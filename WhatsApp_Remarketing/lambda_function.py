import os
import boto3
from datetime import datetime
import urllib3
import json
import time

# Variables de entorno
TABLE_NAME = os.environ["DYNAMODB_TABLE"]
META_ACCESS_TOKEN = os.environ["META_ACCESS_TOKEN"]
PHONE_NUMBER_ID = os.environ["PHONE_NUMBER_ID"]
DEFAULT_COMPANY_ID = os.environ.get("DEFAULT_COMPANY_ID", "default_company")

DELAY = int(os.environ.get("REMARKETING_DELAY_HOURS", "24"))
WINDOW = int(os.environ.get("REMARKETING_WINDOW_HOURS", "72"))

# DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

# HTTP client
http = urllib3.PoolManager()

# Función para enviar mensaje por WhatsApp
def send_whatsapp(phone, text):
    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {META_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "text": {"body": text}
    }
    response = http.request("POST", url, body=json.dumps(payload), headers=headers)
    print(f"WhatsApp enviado a {phone}: {response.status}")
    print("Respuesta completa de Meta:", response.data.decode("utf-8"))
    return response.status

def lambda_handler(event, context):
    now = datetime.now()

    # Buscar clientes pendientes
    response = table.scan(
        FilterExpression="remarketing_pending = :val",
        ExpressionAttributeValues={":val": True}
    )

    for item in response.get("Items", []):
        print("Procesando item:", item)

        phone = item["phoneNumber"]
        company_id = item.get("company_id", DEFAULT_COMPANY_ID)
        service = item.get("detected_service", "nuestro servicio")
        intent = item.get("last_intent", "service_info")
        last_interaction = datetime.fromisoformat(item["last_interaction"])
        stage = int(item.get("remarketing_stage", 0))
        closed = item.get("remarketing_closed", False)

        # Si el usuario ya respondió y se cerró el ciclo, no enviar nada
        if closed:
            print(f"Usuario {phone} ya respondió, ciclo cerrado.")
            continue

        # Calcular diferencia en horas
        diff_hours = (now - last_interaction).total_seconds() / 3600
        print(f"Diferencia en horas: {diff_hours}, stage: {stage}")

        if DELAY <= diff_hours <= WINDOW:
            # Etapa 1: primer mensaje
            if stage == 0:
                if intent == "course_info":
                    text = f"Hola 👋, ayer nos preguntaste por el curso {service}. ¿Quieres reservar tu cupo?"
                elif intent == "product_info":
                    text = f"Hola 👋, ayer nos preguntaste por {service}. ¿Quieres que te comparta detalles o disponibilidad?"
                elif intent == "service_info":
                    text = f"Hola 👋, ayer nos preguntaste por {service}. ¿Quieres más información?"
                else:
                    text = f"Hola 👋, ayer nos preguntaste por {service}. ¿Quieres continuar?"

                send_whatsapp(phone, text)

                table.update_item(
                    Key={"phoneNumber": phone, "company_id": company_id},
                    UpdateExpression="SET remarketing_stage = :stage, last_remarketing_sent = :sent",
                    ExpressionAttributeValues={
                        ":stage": 1,
                        ":sent": now.isoformat()
                    }
                )

            # Etapa 2: segundo mensaje gracioso
            elif stage == 1 and diff_hours >= (DELAY * 2):
                text = f"Me dejaste en visto 😅… igual seguimos aquí si quieres más info de {service} ✨"
                send_whatsapp(phone, text)

                expire_at = int(time.time()) + (4 * 24 * 3600)

                table.update_item(
                    Key={"phoneNumber": phone, "company_id": company_id},
                    UpdateExpression="SET remarketing_stage = :stage, remarketing_pending = :false, remarketing_sent = :sent, expireAt = :exp",
                    ExpressionAttributeValues={
                        ":stage": 2,
                        ":false": False,
                        ":sent": now.isoformat(),
                        ":exp": expire_at
                    }
                )

    return {"status": "done"}
