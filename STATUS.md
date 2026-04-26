# 📊 STATUS — clientes.bot
> **Única fuente de verdad** del estado del proyecto.
> Reemplaza las hojas de ruta dispersas en chats.
> Marca `[x]` cuando cierres una tarea.
**Última actualización:** 26 abril 2026
**Repo frontend:** [Landing-IA](https://github.com/juancmartinezg/Landing-IA) · `main`
**Repo backend:** [chatbot_escuela](https://github.com/juancmartinezg/chatbot_escuela) · `main`
**Producción:** https://clientes.bot (Amplify)
**API:** https://2xlne7i7p5kykfcaioqeasaaoq0laqoe.lambda-url.us-east-1.on.aws
---
## 🏗️ STACK
- **Frontend:** Next.js 14 + Tailwind + Amplify
- **Backend:** AWS Lambda (Python) + Lambda URLs
- **Datos:** DynamoDB (9 tablas)
- **Auth:** AWS Cognito + Google OAuth
- **IA:** Gemini 2.5 Flash + VAPI (voz)
- **Notificaciones:** Firebase Cloud Messaging (FCM)
- **Email:** SES (sandbox) → migrar a Resend
- **Storage:** S3 (`clientes-bot-media`)
- **Cron:** EventBridge
---
## 📐 INFRAESTRUCTURA
### Lambdas (5 activas)
- `WhatsApp_Typebot_Bridge` — Bot WhatsApp (~4900 líneas)
- `SaaS_API_Handler` — API dashboard + ARIA + Ads (~4700 líneas, ~80 endpoints)
- `WhatsApp_Remarketing` — Follow-up + renewal (~255 líneas)
- `promote-memory-candidates` — Auto-promoción memoria (~122 líneas)
- `knowledge-ingestor` — Ingestión conocimiento
### Tablas DynamoDB (9)
- `KnowledgeBase` (PK: `company_id`, SK: `kb_key`, GSI: `phone_number_id-index`)
- `TypebotSessions` (PK: `phoneNumber`, TTL 24h)
- `Leads_CRM` (PK: `phoneNumber`, GSI: `company_id-index`)
- `StudentPaymentState` (PK: `phoneNumber`, GSI: `company_id-index`)
- `ConversationMemory` (PK: `company_id`, SK: `normalized_question`)
- `ConversationMemoryCandidates` (PK: `company_id`, SK: `normalized_question`)
- `UserMapping` (PK: `email`)
- `Agents`
- `PushTokens`
### Servicios externos
- **Cognito User Pool:** `us-east-1_kijdadXdl`
- **Meta App:** `27398458396409385`
- **WABA:** `948932884157315`
- **Pixel:** `1102373681952908`
- **EventBridge cron:** `ads-daily-optimize` (6 AM diario)
---
## ✅ MÓDULOS COMPLETADOS
### 🤖 Bot WhatsApp
- [x] IA conversacional Gemini + neuroventas + memory hint
- [x] Multi-pasarela pagos (Wompi, PayPal, MercadoPago, OpenPay, PayU, Bold)
- [x] Carrusel visual + fallback lista (template del tenant)
- [x] Google Calendar + WhatsApp Flows
- [x] VAPI llamadas IA
- [x] Memoria inteligente + auto-promote
- [x] Post-pago dinámico + remarketing + renewal
- [x] Multi-tenant (inventario descuenta stock)
- [x] CAPI (Lead, InitiateCheckout, Purchase, Schedule)
- [x] Transcripción de voz (Gemini)
- [x] CRM automático (Leads_CRM)
- [x] Configuración dinámica (config_pro manda todo)
### ⚙️ API SaaS (~80 endpoints)
- [x] Config, onboarding, services CRUD
- [x] Leads CRUD + tags + score + stage + notas + recordatorios + AI insight + CSV import
- [x] Pagos multi-gateway, citas CRUD + Google Calendar, analytics
- [x] Chat: active/takeover/release/send (in-house, sin Chatwoot)
- [x] Meta Embedded Signup (+ pixel + ad_account + page_id automático)
- [x] Code exchange + anti-abuso multi-tenant
- [x] Scraper sitio web → KnowledgeBase
- [x] ARIA: 23 acciones + voz
- [x] Upload S3, holidays, plans, templates, demo
### 👥 Multi-agente
- [x] Tabla Agents + CRUD
- [x] Asignación manual + transferencias con historial + motivo
- [x] Notas privadas entre agentes
- [x] Dashboard de performance con ranking
- [x] Sidebar dinámico por rol (owner/admin/agent/viewer)
- [x] Filtrado backend multi-rol
- [x] Round-robin SOLO en handoff humano
- [x] Email SES al dueño + agente (DKIM+SPF verificados, sandbox)
- [x] Push notifications FCM
- [x] PWA instalable
- [x] Interceptor global de fetch (x-role, x-agent-id)
### 📢 Ads Pro
- [x] Wizard 5 pasos
- [x] Click-to-WhatsApp Ads (OUTCOME_ENGAGEMENT + CONVERSATIONS + WHATSAPP)
- [x] IA genera variantes (3+ con fallbacks)
- [x] Ciudades múltiples con radio individual
- [x] Intereses, edad, género, duración
- [x] Advantage+ Audience activado
- [x] Tracking specs con pixel
- [x] Selector de cuenta publicitaria
- [x] Filtro por cuenta en geo-breakdown y narrative
- [x] Promote_pages
- [x] Instagram vinculado (si disponible en API)
- [x] Botones de período (Hoy/7d/30d/90d)
- [x] Filtro de campaña en resultados
- [x] Botón actualizar dashboard
- [x] Descartar borrador del wizard
- [x] Ubicación del negocio en prompt IA
- [x] Análisis IA con recomendaciones (pausar/escalar/renovar)
- [x] Acciones rápidas en modal
- [x] Detección automática rechazos (cron diario)
- [x] Push FCM cuando hay rechazos
- [x] Editar anuncios (texto + imagen)
- [x] Ad preview
- [x] Edit budget endpoint
- [x] Endpoint resize-image (3 formatos: 1:1, 9:16, 16:9 con Pillow)
- [x] Saved audiences endpoint
- [x] Cache Meta API 15 min + rate limit fallback
- [x] Lazy load ads
- [x] Cron diario EventBridge
### 💻 Frontend
- [x] 19+ páginas: dashboard, CRM Kanban+IA, chat en vivo, catálogo+inventario, citas, pagos, analytics, memoria IA, training, templates, gateway, WhatsApp Embedded Signup, settings, ads wizard+dashboard, agents, agents/performance
- [x] Auth Cognito email/Google + callback + welcome
- [x] Navegación instantánea (Next.js Link)
- [x] ARIA flotante (23 acciones + voz)
- [x] ChatWidget, Toast, PushSetup (FCM)
- [x] Landing pública con demo IA en vivo
- [x] Página `/politica-de-privacidad` (con sección Cookies + Habeas Data)
- [x] Página `/terminos`
---
## 🔧 EN PROCESO — Sprint actual
### Frontend / Landing (~95%)
- [x] Estructura legal (Términos + Privacidad + Cookies)
- [x] Footer con enlaces legales reales
- [x] Botón "Ver demo en vivo" abre ChatWidget
- [x] `rel="noopener noreferrer"` en links externos
- [ ] BLOQUE G: Conversación demo Feature 1 → constructora genérica
- [ ] BLOQUE H: Dashboard mockup → constructora genérica (USD)
- [ ] BLOQUE I: Ad preview → apartamentos
- [ ] Testimonios reales (cuando tengas)
---
## 🔴 PENDIENTE — Cierre de módulos abiertos
### Ads Pro — pulir pendientes
- [ ] Frontend público guardado (UI botones wizard paso 2)
- [ ] Probar resize-image desde frontend (botón 📐 3 formatos)
- [ ] Publish envía 3 formatos a Meta (square + vertical + 16:9)
- [ ] Probar editar anuncio rechazado completo (preview + guardar)
- [ ] Re-vincular IG Business Account en página Facebook
- [ ] Advantage+ creative enhancements (Meta deprecó standard)
### Auth / Onboarding
- [ ] **SES → Resend** (AWS denegó producción)
- [ ] PWA caching: abre landing en vez de dashboard al reabrir
- [ ] Advanced Access en Meta (espera 7-30 días, no es trabajo nuestro)
- [ ] Popup Embedded Signup error "Sorry something went wrong" (bug Meta)
### Multi-agente — cerrar 100%
- [ ] WebSocket en vivo (o polling cada 10s como alternativa simple)
### Seguridad básica (cerrar antes de cobrar)
- [ ] Audit log de cambios sensibles
- [ ] Backups automáticos DynamoDB
- [ ] Verificar logs CloudWatch en todas las Lambdas
---
## 🟡 PRÓXIMO — Después de cerrar lo abierto
### Fase 28 — Stripe + Billing ⭐ CRÍTICO PARA COBRAR
- [ ] Trial 7 días automático
- [ ] Feature flags por plan (Starter / Growth / Enterprise)
- [ ] Límites por plan (conversaciones, leads, agentes)
- [ ] Stripe Checkout + webhooks
- [ ] Página `/pricing` pública (la sección de planes en landing ya existe)
- [ ] Upgrade/downgrade desde dashboard
- [ ] Email de confirmación de cobro / fallo de cobro
### i18n — Internacionalización
- [ ] `next-intl` con detección de `Accept-Language`
- [ ] Locales: `es`, `en`, `fr`, `pt`
- [ ] Selector manual en navbar 🌐
- [ ] Traducir landing
- [ ] Traducir dashboard
- [ ] Traducir emails
### Fase 18 — CRM Pro
- [ ] Historial de cambios por lead
- [ ] Deal value (valor monetario)
- [ ] Detección de duplicados
- [ ] Funnel analytics (conversión por etapa)
- [ ] Actividades (llamadas, emails, reuniones registradas)
---
## 🟢 BACKLOG — Por demanda real de clientes
### Multicanal
- [ ] Instagram DM
- [ ] Messenger
- [ ] Telegram
- [ ] Email transaccional (drip)
- [ ] SMS (Twilio)
### Reputación
- [ ] Solicitud automática de reseñas post-venta
- [ ] Respuestas con IA a reseñas Google
- [ ] Score de reputación
### Funnels / Landing builder
- [ ] Editor drag & drop
- [ ] Plantillas
- [ ] A/B testing
### Marketing automation
- [ ] Workflows visuales
- [ ] Secuencias / drip campaigns
- [ ] Segmentación dinámica
### Ventas
- [ ] Cotizaciones
- [ ] Facturas electrónicas
- [ ] Upsells automáticos
### Analytics avanzado
- [ ] Cohorts
- [ ] LTV
- [ ] Churn prediction
### Educación / Onboarding
- [ ] Tour interactivo (primer login)
- [ ] Tutoriales en video
- [ ] Centro de ayuda
### Retención
- [ ] NPS surveys
- [ ] Loyalty / recompra automática
- [ ] Gamificación
### Agencia / White label
- [ ] Multi-cliente dashboard
- [ ] White label completo
- [ ] Branding personalizado por agencia
### Integraciones
- [ ] API pública con docs
- [ ] Zapier
- [ ] Make / n8n
### Seguridad avanzada
- [ ] 2FA (TOTP)
- [ ] GDPR compliance completo
- [ ] SOC2 (cuando crezcamos)
### PWA Stores
- [ ] Listar PWA en Google Play (TWA)
- [ ] Listar PWA en App Store (PWAbuilder)
---
## ⚠️ REGLAS INAMOVIBLES
1. **1 cambio por vez** — verificar antes del siguiente
2. **Buscar/reemplazar** — no archivos completos salvo necesidad
3. **`py_compile` obligatorio** antes de subir Lambda
4. **CloudShell** para parches Python (heredoc falla con UTF-8)
5. **DynamoDB:** `status` y `source` son reserved keywords → usar `ExpressionAttributeNames`
6. **Multi-tenant obligatorio** — nada hardcodeado, `config_pro` manda todo
7. **Comentarios Python en español**
8. **UX primero** — el cliente no ve JSON
9. **Frontend:** usar `<Link>` de Next.js (no `<a href>` para rutas internas)
10. **TypeScript:** callbacks con tipo explícito (`(prev: any)`, `(c: any)`)
11. **Bucket `certificados-jmc` NO TOCAR**
12. **PR #5 ROTO** — no usar, no mergear
---
## 🚀 DEPLOY
### Frontend
```bash
git add .
git commit -m "..."
git push
# Amplify auto-deploy ~5 min
```
### Lambda (CloudShell obligatorio)
```bash
mkdir -p /tmp/X && cd /tmp/X
aws lambda get-function --function-name NOMBRE --query 'Code.Location' --output text | xargs curl -s -o function.zip
unzip -o function.zip
# editar lambda_function.py con python heredoc
python3 -c "import py_compile; py_compile.compile('lambda_function.py', doraise=True)" && echo "OK"
zip -r function.zip lambda_function.py
aws lambda update-function-code --function-name NOMBRE --zip-file fileb://function.zip --query 'LastModified' --output text --no-cli-pager
# Publicar versión de seguridad:
sleep 10 && aws lambda publish-version --function-name NOMBRE --description "vXX: descripción" --query '[Version,Description]' --output table --no-cli-pager
```
---
## 📞 CONTACTO
- Email: soporte@clientes.bot
- WhatsApp: +57 XXX
- Empresa: SGC Technology S.A.S.