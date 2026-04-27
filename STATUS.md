# 📊 STATUS — clientes.bot
> **Única fuente de verdad** del estado del proyecto.
> Reemplaza las hojas de ruta dispersas en chats.
> Marca `[x]` cuando cierres una tarea.
**Última actualización:** 27 abril 2026 (cierre Bloque A + roadmap Admin Panel completo B-K)
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
- **Datos:** DynamoDB (11 tablas, todas con PITR)
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
- `SaaS_API_Handler` — API dashboard + ARIA + Ads + Admin Panel (~5500 líneas, ~83 endpoints, **v39**)
- `WhatsApp_Remarketing` — Follow-up + renewal (~255 líneas)
- `promote-memory-candidates` — Auto-promoción memoria (~122 líneas)
- `knowledge-ingestor` — Ingestión conocimiento
### Tablas DynamoDB (11)
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
- `ErrorLog` (PK: `service`, SK: `sk`, TTL 30 días, PITR activo) — todo error 500 del Lambda
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
- [x] **Admin Panel API** — `GET /admin/overview`, `GET /admin/tenants` (paginado con cursor), `GET /admin/audit` (v34-v39)
- [x] Hardening `/onboarding` con idempotencia por email + validación
- [x] `log_error()` automático: todo error 500 del lambda_handler queda en tabla `ErrorLog`
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
### 🛡️ Admin Panel Fase A ✅
> Para tu uso interno como super admin de la plataforma. No para clientes.
- [x] **A1** — Helpers `is_super_admin()` + `get_user_email()` con env var `SUPER_ADMIN_EMAILS` (Lambda v34)
- [x] **A2** — Router `/admin/overview` + `/admin/tenants` con guard 403 (Lambda v35)
- [x] **A2.1** — Hotfix DynamoDB reserved keyword `plan` en ProjectionExpression (Lambda v36)
- [x] **A2.2** — Paginación correcta sin `Limit` mal usado + cursor `next_token` base64 (Lambda v37)
- [x] **A3** — Overview enriquecido: tenants total/activos, mensajes 24h, pagos 30d, errores 24h, audit 24h, top 5 tenants. Cache 60s + tabla `ErrorLog` + helper `log_error()` (Lambda v38)
- [x] **A3.7** — Hardening `/onboarding`: validar `business_name` + `client-id` requerido + idempotencia por email (Lambda v39)
- [x] **A3.8** — Frontend `/onboarding` envía `email` + maneja `already_existed`
- [x] **A4.1** — `app/admin/layout.tsx` con guard contra `/admin/overview` + sidebar dedicado
- [x] **A4.2** — `app/admin/page.tsx` overview con auto-refresh 60s + cards + top 5 con barras + banner de errores
- [x] **A4.3** — `app/admin/tenants/page.tsx` lista paginada con `tokenStack` para navegar atrás
- [ ] **Fases B-K** — Admin Panel completo (ver roadmap dedicado abajo)
---
## 🛠️ ROADMAP — Admin Panel completo (Fases B → K)
> **Filosofía:** infraestructura completa antes del rugido. No dejar nada para después.
> Roles: `super_admin` (tú) · `support` (equipo soporte) · `billing` (cuando llegue Stripe)
> Toda escritura sobre tenants requiere consentimiento del cliente o 2FA del admin.
### 🟦 Fase B — Setup + Roles + Seguridad base
- [ ] **B1** Tabla `PlatformAdmins` (PK email, role, active) + seed automático desde env var `SUPER_ADMIN_EMAILS`
- [ ] **B2** Helper `get_admin_role()` + middleware `require_admin(roles)`
- [ ] **B3** CRUD endpoints `/admin/team` (GET/POST/PUT/DELETE)
- [ ] **B4** Frontend `/admin/team` con tabla + form crear/editar admin (estilo Mi equipo)
- [ ] **B5** 2FA obligatorio para todos los roles admin (reusa sistema 2FA existente)
- [ ] **B6** Confirmación 2FA en acciones destructivas (eliminar tenant, cambiar plan, dar permisos)
- [ ] **B7** Session timeout 30 min de inactividad para admins
- [ ] **B8** Email automático "se hizo X en tu cuenta" al cliente cada vez que admin actúa
- [ ] **B9** Login audit (IP, geo, user-agent) en `AuditLog`
### 🟩 Fase C — Tenants Management
- [ ] **C1** `GET /admin/tenants/{id}` detalle completo (config, métricas, errores, timeline)
- [ ] **C2** Frontend `/admin/tenants/[id]` con tabs (Config / Métricas / Errores / Timeline)
- [ ] **C3** Notas internas por tenant (`tenant_notes` en config_pro, solo admins)
- [ ] **C4** Tags por tenant (filtrable en lista) — VIP, beta, churn-risk, etc.
- [ ] **C5** Eventos timeline por tenant (registro, primer pago, último mensaje, churn)
- [ ] **C6** Search backend en `/admin/tenants?q=...` (`Contains` en brand_name + company_id)
- [ ] **C7** Acciones: suspender / reactivar / eliminar (soft delete con status=DELETED)
- [ ] **C8** Cambiar plan con dry-run (preview qué se desactiva antes de aplicar)
- [ ] **C9** Reset password de cliente (Cognito Admin API → email automático Resend)
- [ ] **C10** Modo mantenimiento por tenant (pausar 1 sin tocar los demás)
- [ ] **C11** Clonar configuración de tenant (template para nuevos clientes)
- [ ] **C12** Recovery / undo 24h ventana de cualquier acción admin
### 🟨 Fase D — Feature Flags + Quotas
- [ ] **D1** Catálogo `PLAN_FEATURES` (env var con starter/growth/enterprise → features)
- [ ] **D2** Helper `has_feature(company_id, feature)` con override
- [ ] **D3** `GET/PUT /admin/tenants/{id}/features` overrides individuales
- [ ] **D4** Frontend toggles de features por tenant (verde/rojo/gris según plan + override)
- [ ] **D5** Override con expiración (regalo "ads pro 30 días" auto-revoke)
- [ ] **D6** Quotas tracking (mensajes/mes, leads, agentes) en DynamoDB
- [ ] **D7** Quotas enforcement en bot (rechaza si excede) + banner upgrade en dashboard
- [ ] **D8** Dashboard de uso por tenant (cards de quota usado/total)
### 🟥 Fase E — Impersonate + Asistencia con consentimiento
- [ ] **E1** `POST /admin/impersonate` con HMAC ticket firmado (read-only por defecto, TTL 1h)
- [ ] **E2** Middleware ticket en `lambda_handler` (sustituye client_id si ticket válido)
- [ ] **E3** Frontend banner rojo permanente "Viendo como X — [Salir]" + override `cb_user.companyId`
- [ ] **E4** Botón "Ver como" en detalle tenant
- [ ] **E5** Tabla `SupportRequests` (estados PENDING/APPROVED/DENIED/EXPIRED/COMPLETED)
- [ ] **E6** `POST /support/request` admin solicita permiso de escritura con razón
- [ ] **E7** Push FCM + email Resend al owner del tenant
- [ ] **E8** Página `/support/approve/{id}` para que cliente apruebe/deniegue
- [ ] **E9** Ticket evoluciona a read_write con TTL 30min al aprobar
- [ ] **E10** Auto-expire + email Resend de resumen al cliente al cerrar (qué se hizo)
- [ ] **E11** Página `/dashboard/support-history` (cliente ve histórico de quién entró)
- [ ] **E12** Modo "shadow" (ver chat live del cliente con aviso previo)
### 🟪 Fase F — Soporte como módulo (Ticketing real)
- [ ] **F1** Tabla `SupportTickets` + UI cliente "Pedir ayuda" en su dashboard
- [ ] **F2** Frontend `/admin/tickets` cola con filtros + asignación round-robin entre support
- [ ] **F3** Macro respuestas (canned responses preset)
- [ ] **F4** SLA tracker + alertas de tickets > 4h sin atender
- [ ] **F5** Calificación post-soporte (1-5 estrellas) + email
- [ ] **F6** Historial de tickets por tenant (en detalle de tenant)
- [ ] **F7** Knowledge Base interna del equipo (`/admin/wiki`)
- [ ] **F8** Quick actions por tenant (limpiar cache, reenviar pago, reiniciar bot)
- [ ] **F9** Live escalation (support → super_admin con ping inmediato)
### 🟫 Fase G — Observabilidad completa
- [ ] **G1** `GET /admin/errors` viewer paginado con filtros (service, error_type, tenant)
- [ ] **G2** Hookear `log_error()` en las otras 4 Lambdas (Bot, Remarketing, promote-memory, knowledge-ingestor)
- [ ] **G3** `GET /admin/audit?actor=&action=&tenant=&from=&to=` con filtros + viewer
- [ ] **G4** Export audit log a S3 mensual (compliance > 90 días)
- [ ] **G5** Audit signing (hash chain para no-tampering)
- [ ] **G6** Reportes de actividad anómala con alertas (50 acciones/h = sospechoso)
- [ ] **G7** Health checks `/admin/health` (Lambdas, DynamoDB, Meta API, Resend, Cognito)
- [ ] **G8** Slow queries DynamoDB detector
- [ ] **G9** Top endpoints por latencia (CloudWatch metrics)
- [ ] **G10** Cost breakdown por servicio AWS
- [ ] **G11** Cost por tenant (correlación con quotas)
- [ ] **G12** Status page público `clientes.bot/status` (uptime, mantenimientos)
### 🟧 Fase H — Comunicación admin ↔ cliente
- [ ] **H1** Broadcast email + push a todos los tenants (segmentable por plan/tag/status)
- [ ] **H2** Anuncios in-app (banner top del dashboard del cliente)
- [ ] **H3** Inbox bidireccional admin↔cliente estilo Intercom
- [ ] **H4** Bug reports desde dashboard cliente → tabla `BugReports` → admin queue
- [ ] **H5** Notificaciones de mantenimiento programado (con countdown)
### 🟨 Fase I — Operacional crítico
- [ ] **I1** 🚨 Killswitch global (pausar TODOS los bots con 1 click + 2FA)
- [ ] **I2** Aprobación dual para acciones críticas (2 super_admins deben aprobar)
- [ ] **I3** Rate limiting por admin email (max acciones/min)
- [ ] **I4** Whitelist IPs por admin (opcional, configurable)
- [ ] **I5** Templates de prompt globales (biblioteca por industria: clínica, restaurante, etc.)
- [ ] **I6** API keys management por tenant + revocation
- [ ] **I7** Webhooks que tenant puede recibir (lead nuevo, pago aprobado, etc.)
- [ ] **I8** A/B test de features (habilitar al X% de tenants y medir impacto)
### 🔵 Fase J — Compliance + Premium
- [ ] **J1** GDPR: export ZIP completo de datos de un cliente
- [ ] **J2** GDPR: derecho al olvido + certificado de borrado
- [ ] **J3** AI Assistant del admin (query natural: "¿qué tenants tienen riesgo de churn?")
- [ ] **J4** Comparativa side-by-side de 2-3 tenants
- [ ] **J5** Cohorts (retención por mes de registro)
- [ ] **J6** Health score + churn risk por tenant (algoritmo)
- [ ] **J7** Export CSV de cualquier tabla del admin
### 💰 Fase K — Billing (cuando llegue Stripe — Sprint 1)
- [ ] **K1** Rol `billing` en `PlatformAdmins`
- [ ] **K2** Dashboard MRR / ARR / Churn (estilo Stripe)
- [ ] **K3** Lista suscripciones activas con próximas fechas
- [ ] **K4** Tarjetas próximas a expirar (alerta pre-churn)
- [ ] **K5** Pagos fallidos + dunning automático
- [ ] **K6** Refunds desde UI (con 2FA)
- [ ] **K7** Cupones / códigos promocionales
- [ ] **K8** Reportes financieros mensuales (CSV para contador)
- [ ] **K9** Tax handling + facturación electrónica por país
- [ ] **K10** LTV (Customer Lifetime Value) calculado en tiempo real
- [ ] **K11** Upsell suggestions IA ("este tenant pagaría más, está al 80% de su quota")
### 🎯 Fase L — Meta CAPI completo (Conversions API)
> CRM events → Meta para entrenar el algoritmo. Diferenciador masivo (HubSpot cobra $890/mes por esto).
- [ ] **L1** Helper `send_meta_event(event_name, user_data, event_time, event_id)` reusable
- [ ] **L2** Hashing helper SHA-256 normalizado (phone, email, name, document, city)
- [ ] **L3** `POST /admin/capi/backfill-leads?company_id=&since=` (lote retroactivo)
- [ ] **L4** UI botón "📡 Sincronizar 87 leads con Meta" en `/dashboard/crm`
- [ ] **L5** Auto-sync popup después de CSV import (cliente decide)
- [ ] **L6** Auto-envío `Lead` event en tiempo real (cada lead nuevo del bot)
- [ ] **L7** Auto-envío `InitiateCheckout` cuando bot genera payment link
- [ ] **L8** Recuperar `send_meta_purchase_event` del PR #5 (post-pago) y generalizar
- [ ] **L9** Auto-envío `CompleteRegistration` (al confirmar email Cognito)
- [ ] **L10** Test event code mode (validación primeros 5 antes de spammear pixel)
- [ ] **L11** Dashboard de Match Rate por tenant en `/admin/tenants/{id}`
- [ ] **L12** Dedupe entre online y offline events (event_id consistente)
- [ ] **L13** Pixel del tenant (no del SaaS) — usa `feature_overrides` de Fase D
---
### 🗂️ Tablas DynamoDB nuevas (a crear durante B-K)
- `PlatformAdmins` (PK: `email`, SK: `role`) — equipo de la plataforma
- `SupportRequests` (PK: `request_id`, GSI: `company_id`, TTL 30 días)
- `SupportTickets` (PK: `ticket_id`, GSI: `company_id`, GSI: `assigned_to`)
- `BugReports` (PK: `report_id`, GSI: `company_id`)
- `TenantQuotas` (PK: `company_id`, SK: `period`) — tracking mensajes/leads/agentes
- Modificar `KnowledgeBase config_pro`: agregar `feature_overrides`, `tenant_notes`, `tags`, `events_timeline`
### ⚙️ Env vars nuevas
- `SUPER_ADMIN_EMAILS` (ya existe) — bootstrap inicial
- `IMPERSONATE_HMAC_SECRET` — firma de tickets
- `PLAN_FEATURES_JSON` — catálogo de features por plan
### 🛡️ Reglas inamovibles del Admin Panel
- Toda acción admin queda en `AuditLog`
- Toda escritura sobre tenant requiere consentimiento del cliente o 2FA del admin
- Impersonate por defecto = read-only
- Acciones destructivas = pide 2FA otra vez aunque ya hayas iniciado sesión
- 2 super_admins requeridos para: eliminar tenant, killswitch global, dar rol super_admin
- Email automático al cliente cada vez que un admin actúa (transparencia total)
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
███████████████████████████░░░ 85%
| Categoría | % |
|---|---|
| ✅ Hecho | **85%** |
| 🔧 Admin Panel B-K (planeado completo) | 5% |
| 🟡 Sprints 1-7 + features futuras | 10% |
**Última medición:** 27 abril 2026 (Bloque A cerrado, roadmap B-K aterrizado)
### Hitos de moral 🦁
- [x] **0% → 25%** — Bot WhatsApp + API SaaS base
- [x] **25% → 50%** — Multi-tenant + Ads Pro + CRM
- [x] **50% → 69%** — Multi-agente + Landing + Embedded Signup
- [x] **69% → 82%** — Seguridad completa + Tokens + Ads Pro + 2FA triple ✅
- [x] **82% → 85%** — Admin Panel Fase A (overview + tenants list) ✅ 🦁
- [ ] **85% → 90%** — Admin Panel Fases B-E + L (Roles + Tenants + Features + Impersonate + Meta CAPI) ⭐ ESTÁS AQUÍ
- [ ] **90% → 95%** — Admin Panel Fases F-J (Ticketing + Observabilidad + Comunicación + Compliance)
- [ ] **95% → 100%** — Stripe billing + Fase K + Multicanal completo + RUGIDO 🦁
> *"Cada % se gana con café. Cada café se gana con un commit."*
---
## 📞 CONTACTO
- Email: soporte@clientes.bot
- WhatsApp: +57 XXX
- Empresa: SGC Technology S.A.S.
- Juan Martinez