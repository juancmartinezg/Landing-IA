'use client';
import React from 'react';

export default function PoliticaPrivacidad() {
  const lastUpdate = "9 de Abril de 2026";

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-300 font-sans p-6 md:p-20">
      <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
          Política de Privacidad
        </h1>
        <p className="text-indigo-400 text-sm mb-10 font-medium">Última actualización: {lastUpdate}</p>

        <section className="space-y-8 text-sm md:text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Introducción</h2>
            <p>
              En <strong>clientes.bot</strong> ("nosotros", "nuestro"), respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo tratamos sus datos personales cuando utiliza nuestra aplicación conectada a los servicios de Meta (WhatsApp Business API).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Datos que recopilamos</h2>
            <p>Al utilizar nuestra plataforma a través del inicio de sesión de Facebook (Embedded Signup), recopilamos:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Información de la cuenta de WhatsApp Business (WABA ID).</li>
              <li>ID del número de teléfono y Tokens de acceso proporcionados por Meta.</li>
              <li>Mensajes entrantes y salientes procesados por nuestro motor de IA para fines de automatización de ventas.</li>
              <li>Información de contacto de leads generados (nombre, teléfono).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Uso de la información</h2>
            <p>Utilizamos sus datos exclusivamente para:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Configurar y mantener el funcionamiento de su chatbot.</li>
              <li>Automatizar respuestas y procesos de agendamiento.</li>
              <li>Sincronizar sus leads con el Dashboard de clientes.bot.</li>
              <li>Procesar transacciones a través de integraciones de pago autorizadas por usted.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Eliminación de datos</h2>
            <p>
              Usted tiene derecho a solicitar la eliminación de sus datos en cualquier momento. Puede hacerlo desde el Dashboard de usuario o enviando un correo a <strong>soporte@clientes.bot</strong>. Al solicitar la eliminación, revocaremos los tokens de Meta y eliminaremos sus registros de nuestras bases de datos en un plazo máximo de 72 horas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad de grado industrial (encriptación SSL y bases de datos aisladas en AWS) para garantizar que sus Tokens de Meta y los datos de sus clientes nunca sean accedidos por terceros no autorizados.
            </p>
          </div>

          <div className="pt-10 border-t border-white/5">
            <p className="text-gray-500 text-xs">
              clientes.bot cumple con las políticas de datos de la plataforma Meta y el Reglamento General de Protección de Datos (GDPR). Al utilizar nuestra aplicación, usted acepta los términos descritos en esta página.
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <a href="/" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}