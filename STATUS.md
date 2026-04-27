# 📊 STATUS — clientes.bot
> **Única fuente de verdad** del estado del proyecto.
> Reemplaza las hojas de ruta dispersas en chats.
> Marca `[x]` cuando cierres una tarea.
**Última actualización:** 27 abril 2026
**Repo frontend:** [Landing-IA](https://github.com/juancmartinezg/Landing-IA) · `main`
**Repo backend:** [chatbot_escuela](https://github.com/juancmartinezg/chatbot_escuela) · `main`
**Producción:** https://clientes.bot (Amplify)
**API:** https://2xlne7i7p5kykfcaioqeasaaoq0laqoe.lambda-url.us-east-1.on.aws
---
## 🦁 FILOSOFÍA LEÓN
> *"El león no anuncia su llegada. Cuando la presa lo ve, ya es tarde."*
**Modo de construcción:**
- 🤫 **No promoción pública** hasta tener el producto completo.
- 🐺 Solo clientes beta cercanos (con contexto de "en construcción").
- 🦁 **Cuando rugimos, rugimos con TODO**: multicanal completo, IA superpoderes, white label, marketplace, voz, video.
- 💰 **Costo cero hasta cobrar**: usar free tiers, pago por uso, evitar SaaS con minimum mensual.
- ⏱️ **Sin fechas, sin presión**: cuando esté listo, está listo. Mejor tarde y perfecto, que rápido y mediocre.
- 🎯 **Ambición clara**: ser la plataforma #1 mundial en CRM + Multicanal + IA + Ads.
---
## 🌍 VISIÓN — Plataforma #1 Mundial
**Posicionamiento:** la única plataforma que combina TODO en una sola:
| Categoría | Competidores top | Su debilidad | Nuestra ventaja |
|---|---|---|---|
| **Multicanal IA** | Manychat, Tidio, Intercom | Solo 1-2 canales fuertes | 6+ canales con misma IA |
| **WhatsApp Bot** | Wati, Respond.io | Sin IA real, sin Ads | IA Gemini + neuroventas + memoria |
| **Facebook Ads IA** | AdEspresso, Madgicx | Caros, complejos | Wizard 5 pasos + IA + cron diario |
| **CRM + Multi-agente** | HubSpot, Pipedrive | Caros, sin WhatsApp nativo | Kanban + IA + multi-rol |
| **Pagos en chat** | Walletly, Tapwallet | Limitado a 1 pasarela | 7+ pasarelas + custom integration |
| **Voz IA** | Bland, Vapi (sin plataforma) | Solo voz, sin CRM | Voz + chat + CRM + Ads |
| **Video IA** | HeyGen (sin chat) | Solo video, sin contexto | Video personalizado por lead |
| **White label** | GoHighLevel | $297/mes minimum | Plan agencia con margen alto |
**Meta:** 1,000 clientes pagando en 12 meses post-lanzamiento. ARR $2M+.
---
## 🏗️ STACK
- **Frontend:** Next.js 14 + Tailwind + Amplify
- **Backend:** AWS Lambda (Python) + Lambda URLs
- **Datos:** DynamoDB (9 tablas)
- **Auth:** AWS Cognito + Google OAuth
- **IA:** Gemini 2.5 Flash + VAPI (voz)
- **Notificaciones:** Firebase Cloud Messaging (FCM)
- **Email:** Resend (migrado de SES, gratis 3000/mes)
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
- `AuditLog` (PK: `company_id`, SK: `sk`, TTL 90 días, PITR activo)
### Servicios externos
- **Cognito User Pool:** `us-east-1_kijdadXdl`
- **Meta App:** `27398458396409385`
- **WABA:** `948932884157315`
- **Pixel:** `1102373681952908`
- **EventBridge cron:** `ads-daily-optimize` (6 AM diario), `meta-token-renewal` (domingos 5 AM UTC)
---
## ✅ MÓDULOS COMPLETADOS
### 🤖 Bot WhatsApp
- [x] IA conversacional Gemini + neuroventas + memory hint
- [x] Multi-pasarela pagos (Wompi, PayPal, MercadoPago, OpenPay, PayU, Bold)
- [ ] **Integrar Stripe** (crítico para mercados US/EU)
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
## 🔧 SPRINT ACTUAL — Cierre de pendientes
### Frontend / Landing ✅ 100%
- [x] Estructura legal (Términos + Privacidad + Cookies)
- [x] Footer con enlaces legales reales
- [x] Botón "Ver demo en vivo" abre ChatWidget
- [x] `rel="noopener noreferrer"` en links externos
- [x] Demos genéricos (Inmobiliaria Aurora)
- [x] Dashboard mockup neutro (USD)
- [x] Ad preview neutro
- [x] Multi-moneda y pasarelas globales (con custom gateway)
- [ ] Sección "Multicanal" en landing (al rugir, no antes)
- [ ] Testimonios reales (depende de marketing)
### Ads Pro ✅ CERRADO 6/6 + bonuses
- [x] Audiencias guardadas con nombre custom — multi-tenant (Bloque 3)
- [x] Resize-image en frontend (botón 📐, 3 formatos 1:1 / 9:16 / 16:9)
- [x] Publish envía 3 formatos a Meta via `asset_feed_spec` (Bloque 4, Lambda v23)
- [x] Advantage+ creative enhancements activado (`degrees_of_freedom_spec`, v23)
- [x] Editar anuncio con preview + guardar (con cards visuales del Bloque 2)
- [x] **IG multi-page** — recorre todas las páginas del usuario y devuelve todos los IGs vinculados con su `page_id` asociado (Lambda v25). Multi-tenant para agencias con múltiples marcas.
- [x] **BONUS Bloque 1**: `/ads/init` unificado + cache localStorage (70% menos requests Meta)
- [x] **BONUS Bloque 2**: Cards visuales + modal vista Facebook + cleanup `cron_optimize` duplicada
### Auth / Onboarding
- [x] **SES → Resend** (AWS denegó producción) — gratis 3000/mes
- [x] PWA caching: abre landing en vez de dashboard al reabrir
- [ ] Advanced Access en Meta (espera 7-30 días, no es trabajo nuestro)
- [ ] Popup Embedded Signup error "Sorry something went wrong" (bug Meta)
### Multi-agente — cerrar 100% ✅
- [x] Polling cada 6s con pausa automática cuando pestaña oculta (ahorra ~70% requests, alcanza ~30 agentes en free tier)
- [x] Sonido + vibración + notificación SO + badges en `app/dashboard/chat/page.tsx`
- [x] Push FCM ⚡ instantáneo (no depende del polling)
- [x] Refresh inmediato al volver a la pestaña + sonido + vibración + notificación SO + badges
- [ ] WebSocket real (Sprint 7 — cuando ya tengamos clientes pagando)
### Seguridad básica ✅ CERRADA 4/4
- [x] Backups DynamoDB PITR en 10/10 tablas (restaurar a cualquier segundo, 35 días)
- [x] Logs CloudWatch verificados: 5/5 Lambdas limpias
- [x] Audit log: tabla `AuditLog` con 6 acciones auditadas + TTL 90 días + endpoint `/admin/audit` (Lambda v29)
- [x] 2FA triple: Passkeys/huella (v33) + Email code Resend (v32) + TOTP Authenticator (v31) — usuario elige. Frontend login flow + Settings UI completos.
- [x] **BONUS**: Auto-renovación tokens Meta (cron semanal EventBridge + `/meta/refresh-tokens` + `/meta/token-status` + banner expiración en dashboard) (Lambda v28)
- [x] **BONUS**: Bug `effective_status` campañas corregido (v27) + Pages filtradas por `ad_account_id` con warnings (v26)
### Pasarelas de pago — pendientes
> Estas son pasarelas que **el cliente final usa** para cobrar a sus compradores
> (no es Stripe billing del SaaS — eso es Sprint 1 abajo).
- [ ] **Stripe** (crítico para US/EU/UK) — pago por transacción
- [ ] Pasarela personalizada bajo demanda (proceso documentado para integrar nuevas en <48h)
---
## 🟡 SPRINTS PLANEADOS — Orden de ejecución (sin fechas)
### 🥇 Sprint 1 — Foundation: empezar a cobrar
> Costo: **$0** (Stripe es comisión por transacción, sin minimum)
- [ ] **Stripe billing del SaaS** (Fase 28)
  - Trial 7 días automático
  - Feature flags por plan (Starter / Growth / Enterprise)
  - Límites por plan (conversaciones, leads, agentes)
  - Stripe Checkout + webhooks
  - Página `/pricing` pública
  - Upgrade/downgrade desde dashboard
  - Email confirmación cobro / fallo de cobro
### 🥈 Sprint 2 — Multicanal real (el rugido principal)
> Costo: **$0** (todas las APIs son gratis)
- [ ] **Web Chat Widget embebible** — `<script src="clientes.bot/widget/{company_id}.js">`
- [ ] **Instagram DM** — webhook Meta + lógica del bot
- [ ] **Facebook Messenger** — webhook Meta + lógica del bot
- [ ] **Telegram** — Bot API gratis
- [ ] **Email transaccional** (Resend, gratis 3000/mes)
- [ ] **Bandeja unificada** — todas las conversaciones en 1 pantalla, con filtro por canal
- [ ] **SMS Twilio** (opcional, pago por SMS al cliente final)
### 🥉 Sprint 3 — IA superpoderes
> Costo: **$0** (todo usa Gemini Flash gratis hasta 1500 req/día)
- [ ] **A/B testing automático** de mensajes (la IA prueba 3 versiones, escala el ganador)
- [ ] **Predicción de churn** (modelo ML detecta lead frío y dispara secuencia de rescate)
- [ ] **Generación de posts IG/FB** con IA (1 pregunta → post listo)
- [ ] **Sentiment + Cultural awareness** (adapta tono por país/cultura)
- [ ] **Predictive scheduling** (agenda en hora con mayor probabilidad estadística de cierre)
- [ ] **Wizard 60 segundos** (cliente sube screenshot IG → Gemini Vision configura todo)
- [ ] **Modo "competidor"** (cliente pega URL de competencia → IA analiza y sugiere mejoras)
### 🏅 Sprint 4 — Crecimiento + Comunidad
> Costo: **$0**
- [ ] **Reseñas con IA** — bot pide reseña post-venta y publica en Google Maps/FB
- [ ] **Funnel builder visual** — drag & drop con `react-flow` (gratis)
- [ ] **Marketplace de bots** — clientes suben/descargan personalidades (bienes raíces, clínica, etc.)
- [ ] **Comisiones de afiliados** — sistema de referidos con tracking automático
- [ ] **White label / Agencia** — multi-cliente dashboard + branding personalizado
- [ ] **API pública con docs** (`swagger-ui` gratis)
### 🎖️ Sprint 5 — Globalización
> Costo: **$0**
- [ ] **i18n (es / en / fr / pt)** con `next-intl`
  - Detección automática `Accept-Language`
  - Selector manual 🌐 en navbar
  - Traducir landing + dashboard + emails (Gemini traduce gratis)
- [ ] **Onboarding video con ARIA** (ya tenemos voz, falta script)
- [ ] **Day-zero compliance** — Habeas Data / GDPR / CCPA automáticos por país detectado
- [ ] **Marketing automation / Drip campaigns** — secuencias de email/WA programadas
- [ ] **n8n self-hosted** en una Lambda (reemplaza Zapier, $0)
### 🏆 Sprint 6 — Diferenciadores premium (con HeyGen)
> Costo: HeyGen ya está pago, ElevenLabs después
- [ ] **Video respuestas con IA (HeyGen)** — avatar del cliente envía videos personalizados a leads
- [ ] **Live shopping** — durante un live de IG/FB, el bot responde DMs y cierra ventas
- [ ] **Asistente de cierre por video llamada** — VAPI + visión IA, el cliente comparte pantalla y la IA lo guía
- [ ] **Analytics avanzado** — Cohorts, LTV, Churn prediction
- [ ] **Detección de duplicados de leads** + Deal value + Historial de cambios (Fase 18 CRM Pro)
- [ ] **Cotizaciones + Facturas electrónicas** + Upsells automáticos (Ventas)
- [ ] **NPS surveys + Loyalty + Gamificación** (Retención)
- [ ] **Tour interactivo + Tutoriales en video + Centro de ayuda** (Educación)
### 🦁 Sprint 7 — RUGIDO FINAL (cuando ya esté generando ingresos)
> Costo: **$$ aceptable porque ya cobras**
- [ ] **Voice Cloning con ElevenLabs** — solo plan Enterprise
- [ ] **WhatsApp Pay nativo** (cuando Meta lo libere por país)
- [ ] **PWA en Google Play** (TWA) + **App Store** (PWAbuilder)
- [ ] **WebSocket real** para multi-agente (mejorar polling 10s)
- [ ] **SOC2 compliance** (cuando tengas $1M+ ARR)
- [ ] **Lanzamiento público** — landing pública, marketing, ads, PR
- [ ] **Sección "Multicanal" visible** en landing
- [ ] **Testimonios reales** de clientes beta
---
## 💰 COSTOS $0 — Filosofía y Proyección
### 🟢 Servicios "pago por uso" (cero compromiso mensual)
| Servicio | Free tier | Después |
|---|---|---|
| AWS Lambda | 1M req/mes siempre | $0.20 / 1M req |
| DynamoDB | 25 GB siempre | centavos por GB |
| Cognito | 50,000 MAU siempre | $0.0055 / MAU |
| S3 | 5 GB primeros 12 meses | $0.023 / GB/mes |
| EventBridge | 14M eventos siempre | $1 / millón |
| Amplify | 1000 min build + 15 GB | mínimo |
| **Gemini Flash** | 1500 req/día siempre | $0.075 / 1M tokens |
| **Resend** | 3000 emails/mes | $20/mes (50k emails) |
| **Stripe** | gratis para ti | 3% + $0.30 al cliente |
| **Meta APIs** | gratis siempre | — |
| **Twilio SMS** | sin minimum | $0.0075 / SMS |
| **VAPI** | sin minimum | $0.05-0.10 / min |
| **n8n self-hosted** | gratis (en tu Lambda) | $0 |
### 🔴 Servicios con costo fijo (pospuestos al final)
| Servicio | Costo | Sprint |
|---|---|---|
| **HeyGen** | ya pagado | 6 |
| **ElevenLabs** | $5-330/mes | 7 |
| **SOC2 audit** | $20-50k/año | 7 |
### 📊 Proyección operativa
| Etapa | Costo mensual | Ingresos | Margen |
|---|---|---|---|
| **Sprints 1-3** (construcción, sin clientes) | $0-5 | $0 | — |
| **Sprint 4-5** (5-10 clientes beta) | $10-25 | $1,000-3,500 | ~99% |
| **Sprint 6-7** (50-100 clientes) | $200-500 | $10,000-35,000 | 95% |
| **Post-lanzamiento** (1,000 clientes) | $1k-3k | $200k+ | 85-95% |
---
## ⚠️ REGLAS INAMOVIBLES
### Filosofía
1. 🦁 **No promoción pública** hasta tener producto completo (modo león)
2. 💰 **Costo cero** durante construcción — nunca pagar SaaS con minimum mensual
3. 🐢 **Calidad sobre velocidad** — sin fechas, sin presión
4. 🤫 **Solo clientes beta** con contexto "en construcción"
### Código
5. **1 cambio por vez** — verificar antes del siguiente
6. **Buscar/reemplazar** — no archivos completos salvo necesidad
7. **`py_compile` obligatorio** antes de subir Lambda
8. **CloudShell** para parches Python (heredoc falla con UTF-8)
9. **DynamoDB:** `status` y `source` son reserved keywords → usar `ExpressionAttributeNames`
10. **Multi-tenant obligatorio** — nada hardcodeado, `config_pro` manda todo
11. **Comentarios Python en español**
12. **UX primero** — el cliente no ve JSON
13. **Frontend:** usar `<Link>` de Next.js (no `<a href>` para rutas internas)
14. **TypeScript:** callbacks con tipo explícito (`(prev: any)`, `(c: any)`)
### Reemplazos de servicios SaaS (filosofía $0)
15. **n8n self-hosted** en lugar de Zapier
16. **Resend** en lugar de SES producción (denegado por AWS)
17. **Polling 10s** en lugar de WebSocket real (hasta tener clientes pagando)
### Sagrado
18. **Bucket `certificados-jmc` NO TOCAR**
19. **PR #5 ROTO** — no usar, no mergear
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
## 📊 PROGRESO GLOBAL
██████████████████████████░░░░ 82%
| Categoría | % |
|---|---|
| ✅ Hecho | **82%** |
| 🔧 En cierre (Sprint actual) | 1% |
| 🟡 Planeado (Sprints 1-7) | 17% |
**Última medición:** 27 abril 2026
### Hitos de moral 🦁
- [x] **0% → 25%** — Bot WhatsApp + API SaaS base
- [x] **25% → 50%** — Multi-tenant + Ads Pro + CRM
- [x] **50% → 69%** — Multi-agente + Landing + Embedded Signup
- [x] **69% → 82%** — Seguridad completa + Tokens + Ads Pro + 2FA triple ✅
- [ ] **82% → 90%** — Admin Panel + Stripe billing + Multicanal ⭐ ESTÁS AQUÍ
- [ ] **90% → 100%** — Premium + Rugido global 🦁
> *"Cada % se gana con café. Cada café se gana con un commit."*
---
## 📞 CONTACTO
- Email: soporte@clientes.bot
- WhatsApp: +57 XXX
- Empresa: SGC Technology S.A.S.
- Juan Martinez