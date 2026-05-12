# 📊 STATUS — clientes.bot
> **Única fuente de verdad** del estado del proyecto.
> Reemplaza las hojas de ruta dispersas en chats.
> Marca `[x]` cuando cierres una tarea.
**v165** — AI Creative Loop CERRADO 🦁 5 motores en producción: Content Ingestion + Winner Analysis + Hook Generation multi_pattern + Creative Production (Meta Graph asset_feed_spec real) + Publish+Learn con cross-tenant pool opt-in. 3 tablas DDB con PITR + 2 crons EventBridge ENABLED
**v165** — AI Creative Loop CERRADO 🦁 5 motores en producción: Content Ingestion + Winner Analysis + Hook Generation multi_pattern + Creative Production (Meta Graph asset_feed_spec real) + Publish+Learn con cross-tenant pool opt-in. 3 tablas DDB con PITR + 2 crons EventBridge ENABLED (`ads-ingestion-daily` 7AM UTC, `ads-variant-learn-daily` 8AM UTC). API v156-v164 + frontend `e96fd2a` (botón 🚀 Publicar + modal + 3 sub-tabs) + `2e38b21` (Inteligencia de Ads en settings). Test E2E real: ad PAUSED creado en Meta de JMC heredando asset_feed_spec. Próximo sprint: Brand DNA + Wizard 2.0 + BrandAssets + Wizard Packs (~17h).
**v164** — Ads Pro v2 CERRADO 🎯 Regla #8 KILL_CREATIVE en motor B6.5 (API v153) + `POST /ads/generate-hook-variants` Gemini Flash Lite con cache 5min (API v155) + frontend botón ✨ Variantes en el 🏆 + modal con 3 hooks copiables y patrón emocional detectado (`92a3dcd`). JMC verificado: 0 KILL_CREATIVE (creatives sanos 2.43-4.99% CTR) + Gemini detectó patrón "escasez" del ganador.
**v163** — deuda técnica cerrada: CAPI Schedule funnel completo + Google Calendar multi-tenant + ValidationException fix + Ads dashboard cache L1+L2 DDB (0 rate limits Meta) + fix frontend tab sobreescritura métricas)
Por: **v69** — billing LS + CAPI individual + plantilla ventas v2 + fix CORS)
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
## 💰 ESTRATEGIA COMERCIAL — "GoHighLevel++"
> **Posicionamiento**: lo que GoHighLevel debería haber sido.
> Mismo precio, 3x más features (IA real, CAPI completo, LATAM nativo, Voz IA incluida).
> NO competimos por precio — competimos por valor con precio igualado al líder.
### 🎯 Pricing definitivo (3 planes + Enterprise contact)
| Plan | USD (Stripe) | COP (Wompi) | Target | vs GHL |
|---|---|---|---|---|
| **Solo** | $97/mes | $349,000 | 1 negocio, 1 WhatsApp | = GHL Starter $97 (con IA real) |
| **Pro** ⭐ | $297/mes | $1,090,000 | PYME con equipo, 5 sub-cuentas | = GHL Unlimited $297 (con CAPI + Voz) |
| **Agency** | $497/mes | $1,790,000 | White-label total ilimitado | = GHL SaaS Pro $497 (con cron IA Ads) |
| **Enterprise** | $997+ | $3,590,000+ | Custom, account manager | (GHL no tiene equivalente) |
### 📊 Quotas por plan
| Quota | Solo $97 | Pro $297 | Agency $497 | Enterprise $997+ |
|---|---|---|---|---|
| Sub-cuentas | 1 | 5 | Ilimitado | Ilimitado |
| Mensajes WhatsApp/mes | 5,000 | 25,000 | 100,000 | Ilimitado |
| Leads CRM | 5,000 | Ilimitado | Ilimitado | Ilimitado |
| Agentes humanos | 3 | 10 | Ilimitado | Ilimitado |
| Ads Pro IA | ✅ | ✅ + cron | ✅ + cron | ✅ + cron + custom |
| Meta CAPI + atribución | ✅ | ✅ | ✅ | ✅ |
| VAPI Voz IA | 60 min/mes | 300 min/mes | 1,000 min/mes | Ilimitado |
| White-label | ❌ | Parcial | ✅ Total | ✅ + custom domain |
| API pública | ❌ | ✅ | ✅ | ✅ |
| Soporte | Email 24h | Email 4h | WhatsApp 1h | Slack dedicado |
### 🎁 Descuentos y promos de lanzamiento
- **Trial 14 días sin tarjeta** (vs GHL 14 días — igualamos)
- **Annual -20%** (Solo $77/$297→$237/$497→$397)
- **Lifetime Beta — 25 cupos $97 one-time = Solo plan forever** (escasez real, capital early)
- **NO** plan Free (mata percepción premium)
### 🤝 Programa de afiliados (movido al Sprint 1)
> Diferenciador clave vs GHL: **40% año 1 + 30% recurring forever** (GHL da 40% año 1, 5% después).
> A partir del año 2, los afiliados cobran **6x más** con clientes.bot que con GHL.
> Unit economics: 84% margen bruto antes de afiliado → 44% margen neto con 40% comisión = sostenible 🦁
- **Comisión año 1**: 40% del MRR del referido (primeros 12 meses del cliente)
- **Comisión año 2+**: 30% recurring forever (sin caducidad, sin sub-tiers)
- **Cookie**: 90 días (vs GHL 30 días)
- **Min payout**: $50 USD / $200,000 COP
- **Pago mensual** día 5 vía Stripe Connect (USD) o transferencia Wompi (COP)
- **Hold period 30 días** — comisión se libera 30 días post-pago (protege contra refunds/chargebacks)
- **Anti-fraude**: 0 comisión si cliente cancela antes de 60 días (filtra spam de trials)
- **Cláusula legal**: tasas pueden revisarse con 90 días de aviso. Comisiones generadas se respetan bajo términos originales.
- **Sub-afiliados 2-tier** — pendiente Sprint 4 (no en MVP)
### 🎯 Migration tool (importador desde GHL)
- CSV de leads → Leads_CRM (Sprint 1)
- Workflows GHL → templates internos (Sprint 4)
- Argumento de venta: "1-click migration desde GoHighLevel"
### 🔥 Tagline propuesto landing
> *"Lo que GoHighLevel debería haber sido. WhatsApp con IA real. Atribución completa. Multi-pasarela LATAM. Por el mismo precio."*
---
## 🏗️ STACK
- **Frontend:** Next.js 14 + Tailwind + Amplify
- **Backend:** AWS Lambda (Python) + Lambda URLs
- **Datos:** DynamoDB (19 tablas, todas con PITR)
- **Auth:** AWS Cognito + Google OAuth
- **IA:** Cascada 3 modelos: Gemini 2.5 Flash (principal) → 2.5 Flash Lite → Flash Lite Latest (fallback) + VAPI (voz). LLM_BASE_URL preparado para LLM propio.
- **Notificaciones:** Firebase Cloud Messaging (FCM)
- **Email:** Resend (migrado de SES, gratis 3000/mes)
- **Storage:** S3 (`clientes-bot-media`)
- **Cron:** EventBridge
---
## 📐 INFRAESTRUCTURA
### Lambdas (4 activas — todas con `log_error` → ErrorLog)
- `WhatsApp_Typebot_Bridge` — Bot WhatsApp multi-tenant strict (~7,790 líneas, **v162** — Calendly mode: CalendarPicker v7.3 (`min_date`/`max_date`/`unavailable_dates`) + `_get_available_dates` y `_get_available_slots` con cascada svc→tenant→default + `available_weekdays` y `booking_mode` por servicio + handler async `_internal_action=post_booking_messages` (no bloquea flow) + `post_payment_flow=send_group_link` con mensaje custom + `screen` y `selected_slot` del nivel raíz v6.0/7.3 + scheduling_flow_id desde config_pro) — multicanal activo IG+FB via Gemini + multi-carousel por campaign_id + debounce async + anti-silencio + fragmentación + typing/read receipts + cascada 3 LLM + multi-tenant tokens
- `SaaS_API_Handler` — incluye **`POST /scheduling-flow/setup`** auto-onboarding multi-tenant del WhatsApp Flow CalendarPicker v7.3 (crea + sube JSON + publica + guarda flow_id en config_pro, idempotente)
- `SaaS_API_Handler` — API + Admin Panel + B6.5 cron + C1-C7 tenants + Feature Flags + Quotas + Message Packs + **Affiliates** + Multi-carousel + Release con notif + **Feature Overrides (Fase D)** + **Impersonate completo (Fase E)** + **Auto-onboarding Scheduling Flow** (~14,370 líneas, ~126 endpoints, **v148** — `POST /scheduling-flow/setup` crea flow CalendarPicker v7.3 en Meta via Graph API + sube JSON + publica + guarda flow_id en config_pro, idempotente, reusa RSA key del WABA) — conversations/active FB/IG + multi-carousel + carousels_catalog + emails afiliados + cron payout
- `WhatsApp_Remarketing` — Follow-up + auto-return + renewal (~505 líneas, **v7** — delays variables por intent)
- `promote-memory-candidates` — Auto-promoción memoria source-aware (~155 líneas, **v2** — fix import os + SOURCE_THRESHOLDS human_agent=2 + preserva source SK)
### Tablas DynamoDB (19 — todas con PITR)
- `KnowledgeBase` (PK: `company_id`, SK: `kb_key`, GSI: `phone_number_id-index`)
- `TypebotSessions` (PK: `phoneNumber`, TTL 24h)
- `TypebotSessions_v2` (PK: `contact_id`, GSI: `company_id-channel-index` + `company_id-last_interaction-index`, PITR ✅) — ACTIVA
- `Leads_CRM` (PK: `phoneNumber`, GSI: `company_id-index`)
- `Leads_CRM_v2` (PK: `contact_id`, GSI: `company_id-index` + `company_id-channel-index`, PITR ✅) — ACTIVA
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
- **WABA:** `2891074877943438` (migrado desde `948932884157315` — portfolio Escuela de Tiro Jose Maria Cordoba)
- **Pixel:** `1102373681952908`
- **EventBridge crons:** `ads-daily-optimize` ENABLED (6 AM UTC diario — B6.5 recomendaciones IA), `ads-ingestion-daily` ENABLED (7 AM UTC — Motor 1 Content Ingestion AI Creative Loop), `ads-variant-learn-daily` ENABLED (8 AM UTC — Motor 5 Publish+Learn AI Creative Loop), `meta-token-renewal` ENABLED (domingos 5 AM UTC), `promote-memory-every-5min` ENABLED, `remarketing-every-hour` ENABLED, `affiliate-payout-batch-monthly` ENABLED (día 5 cada mes 8 AM UTC), `affiliate-release-commissions-daily` ENABLED (4 AM UTC = 11 PM CO), `trial-expire-daily` ENABLED (8 AM UTC = 3 AM CO — expira trials 14d + email warning 1-3d), `support-cleanup-hourly` ENABLED (cada hora — Fase E auto-expire + email resumen), `feature-overrides-expire-daily` pendiente (Fase D-4 skip)
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
- [x] **Multicanal**: Instagram DM + Facebook Messenger activos (Bot v114) — misma IA Gemini, catalog lista texto, pago, historial por canal
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
- [x] Cache Meta API L1 memoria + L2 DynamoDB persistente (TTL 15 min, sobrevive cold starts, 0 rate limits) — API v149
- [x] Lazy load ads
- [x] Cron diario EventBridge
- [x] **Ads Pro v2 — AI Creative Analysis** (CERRADO ✅ — 12 mayo 2026):
  - [x] Análisis a nivel **creative/ad** (no solo campaña) — métricas CTR/CPL/Hook Rate por variante individual (API v149 + `_b65_fetch_ad_creative_ranking`)
  - [x] Hook generation basada en ganadores — `POST /ads/generate-hook-variants` con Gemini Flash Lite (API v155) + cache 5min + cascada modelos
  - [x] Auto-kill perdedores por Hook Rate — Regla #8 `kill_creative` en B6.5: CTR<1% + ≥500 impr + CPL>2× avg (API v153)
  - [x] Ranking de creatives en tab "🎯 IA" del dashboard (`GET /ads/creative-ranking` API v152 + frontend `92a3dcd`)
  - [x] Botón "✨ Variantes" en el 🏆 + modal con 3 hooks copiables + patrón emocional detectado (frontend `92a3dcd`)
  - [x] **AI Creative Loop completo (5 motores) — CERRADO 12 mayo 2026 ✅**
    - [x] **Motor 1 Content Ingestion** (API v156-v157): `_ingest_creative_winners` filtra ganadores top20% del tenant + heurístico de patrones (escasez/curiosidad/dolor/beneficio/prueba_social) + persiste en `AdsCreativeLibrary`. Cron `ads-ingestion-daily` 7AM UTC ENABLED. Endpoint `GET /ads/library?pattern=X&period=N&limit=N`.
    - [x] **Motor 2 Winner Analysis** (API v158): `_analyze_winner_patterns` con dedup por `ad_id` + Gemini Flash Lite reclasifica patrón con cache 10min + agrupa por pattern + cross-tenant suggestions del vertical. Endpoint `GET /ads/library/winners?period=N&skip_gemini=0|1`.
    - [x] **Motor 3 Hook Generation extendido** (API v159): `multi_pattern=true` genera 3 hooks de 3 patrones DISTINTOS (cross-tenant aware con top_patterns del tenant). Cascada modelos Gemini con fallback. Cache 5min compuesto `(ad_id, multi_pattern)`.
    - [x] **Motor 4 Creative Production** (API v160-v163): `POST /ads/duplicate-ad` con Meta Graph API real. Soporte dual `object_story_spec` (link/video/photo_data) Y `asset_feed_spec` (Advantage+ Creative). Fix `image_crops` deprecados (191x100, 16x9, 9x16). Status PAUSED por defecto + tracking `AdsHookVariants` + audit_log.
    - [x] **Motor 5 Publish+Learn** (API v164): `_learn_from_variant` evalúa a 7d (CTR delta vs original) + veredictos `winner/marginal_winner/tie/loser/insufficient_data`. Cron `ads-variant-learn-daily` 8AM UTC ENABLED. Si gana ≥+20% CTR → ingiere a `AdsCreativeLibrary` con `source=variant_winner` + pushea anonimizado a `AdsCrossTenantPool` si tenant tiene `ads_cross_tenant_optin=true`. Endpoint `GET /ads/variants/{id}/metrics` para comparativa.
    - [x] **3 tablas DDB nuevas** con PITR + TTL: `AdsCreativeLibrary` (persistente sin TTL, GSI `pattern-ctr-index`), `AdsHookVariants` (90d, GSI `original_ad_id-index`), `AdsCrossTenantPool` (365d, GSI `pattern-ctr-index`).
    - [x] **2 EventBridge crons** ENABLED con targets correctos (Input JSON con path + httpMethod + body).
    - [x] **Frontend `e96fd2a`** (`app/dashboard/ads/page.tsx`): botón "🚀 Publicar" en cada variant card + modal de confirmación con warning PAUSED + 3 sub-tabs dentro de "🎯 IA" (🏆 Ranking actual / 📚 Mi biblioteca / 🚀 Mis variantes) con lazy load. Botón "✨ Variantes" en biblioteca permite regenerar hooks desde cualquier ganador histórico.
    - [x] **Frontend `2e38b21`** (`app/dashboard/settings/page.tsx`): card "🧠 Inteligencia de Ads" con `business_vertical` (input libre + 8 chips quick-pick + datalist 24 sugerencias) + toggle ON/OFF opt-in cross-tenant pool (default OFF, privacy-first) + textos explícitos sobre qué se comparte (pattern, longitud, % uplift) y qué NO (texto literal, datos del negocio, precios).
    - [x] **Cross-tenant learning** como ventaja competitiva del SaaS: anonimizado por diseño, opt-in obligatorio, sk con sufijo `company_id[-4:]` (no identificable). Manychat/Wati no tienen esto.
    - [x] **Test E2E real**: ad PAUSED creado en Meta de JMC (`new_ad_id=120246481560160200`) heredando asset_feed_spec del ganador original (`120242866733710200`) + variante persistida en `AdsHookVariants` con `status=PENDING_REVIEW`.
    - [x] **3 lecciones nuevas** (sesión 12 mayo): #56 API SaaS no tiene `http` global (cada handler crea PoolManager local), #57 reusar motor B6.5 antes que crear endpoint nuevo (Regla #8 KILL_CREATIVE inyectada dentro de `_b65_fetch_ad_creative_ranking` — cero refactor), #58 falsa alarma "0 hits" en regla nueva (validar con datos reales antes de debug — JMC simplemente no tiene perdedores que matar).
    - [x] **Costo unitario**: $0/variante (Gemini Flash Lite con cache 5min). Sin minimum mensual. Replicate descartado tras análisis exhaustivo (`gemini-3.1-flash-image-preview` único modelo para todo el módulo de imágenes).
    - [ ] **Próximo sprint relacionado:** Brand DNA + Wizard 2.0 con generación de imágenes (ver sección "Sprint Brand DNA + Wizard 2.0" abajo).
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
- [x] **B5** 2FA obligatorio para todos los roles admin (Lambda v45 + frontend `0f6234a`) ✅
- [ ] **B6** Confirmación 2FA en acciones destructivas (eliminar tenant, cambiar plan, dar permisos)
- [x] **B6.5** ⚠️ CRÍTICO Cron Ads → recomendaciones IA (diferenciador real vs Manychat/Wati) ✅
   > Sin atribución real (Bloque M) el cron es ciego — solo ve clics, no ROI.
   > **Esto es lo que justifica el SaaS** — sino somos un Manychat más caro.
   - [x] B6.5.1 — Tabla `AdsRecommendations` (PK company_id, SK rec_id, TTL 7d, GSI status-created) ✅
   - [x] B6.5.2 — `handle_ads_cron_recommend()` analiza funnel COMPLETO: CPM, CPC, CPL, ROAS real desde `AdsAttribution` (API v52) ✅
   - [x] B6.5.3 — 7 tipos de recomendación con justificación numérica implementadas:
       - 🟢 SCALE (ROAS≥2.5x + CPL estable + ≥3 ventas)
       - 🔴 PAUSE (CPL +50% Y CTR cae >15%)
       - 🟡 REDUCE (CPL marginal sube 20-50%)
       - 🔄 REFRESH_CREATIVE (CTR cae ≥30% en 7d)
       - 🎯 CHANGE_TARGETING (CPM alto + CTR bajo)
       - ⚠️ RECHARGE_BUDGET (saldo < 3 días)
       - 📊 AB_TEST (campaña ganadora estable)
   - [x] B6.5.4 — Justification dict + impact_estimate_cents + confidence 0-100 ✅
   - [x] B6.5.5 — Cap ±25% del budget actual (en regla SCALE) ✅
   - [ ] B6.5.6 — Push FCM al owner para recs de alto impacto (TODO — no bloquea, ya queda registrado en CloudWatch)
   - [x] B6.5.7 — Endpoints: GET /ads/recommendations · POST /ads/recommendations/apply · /dismiss (API v51) ✅
   - [x] B6.5.8 — Frontend `/dashboard/ads` tab "🎯 IA" con cards + apply (override) + dismiss (con razón) (frontend `5273883`) ✅
   - [x] B6.5.9 — Helper `_b65_already_dismissed_recently` bloquea 3 dismisses del mismo tipo+campaña por 7d ✅
   - [ ] B6.5.10 — Resultado 48h post-apply (sistema aprende) — TODO siguiente sprint
   - [x] B6.5.11 — EventBridge `ads-daily-optimize` reactivado apuntando a `/ads/cron-recommend` (cron 6 AM UTC) ✅
- [ ] **B7** Session timeout 30 min de inactividad para admins
- [ ] **B8** Email automático "se hizo X en tu cuenta" al cliente cada vez que admin actúa
- [ ] **B9** Login audit (IP, geo, user-agent) en `AuditLog`
### 🟩 Fase C — Tenants Management (5/12 ✅ operacional)
- [x] **C1** `GET /admin/tenants/{id}` detalle completo (config + métricas + errores + timeline + integrations) (API v55) ✅
- [x] **C2** Frontend `/admin/tenants/[id]` con 4 tabs (Métricas / Config / Errores / Timeline) (`7046897`) ✅
- [x] **C3** Notas internas por tenant (`tenant_notes` editable inline, max 2000 chars) (API v56 + frontend `efd9d77`) ✅
- [x] **C4** Tags por tenant (7 presets + custom, filtrable, max 20 tags) (API v56 + frontend `efd9d77`) ✅
- [ ] **C5** Eventos timeline por tenant (parcial — ya hay timeline desde AuditLog en tab Timeline)
- [x] **C6** Search backend `/admin/tenants?q=` server-side (Contains en company_id + brand_name) (API v61) ✅
- [x] **C7** Acciones: suspender / reactivar / eliminar (soft delete) — bot respeta `status=SUSPENDED/DELETED` con silencio total + modal con razón obligatoria + audit log (Bot v18 + API v57 + frontend `46001e7`) ✅
- [ ] **C8** Cambiar plan con dry-run (preview qué se desactiva antes de aplicar)
- [ ] **C9** Reset password de cliente (Cognito Admin API → email automático Resend)
- [ ] **C10** Modo mantenimiento por tenant (parcial — C7 cumple este caso)
- [ ] **C11** Clonar configuración de tenant (template para nuevos clientes)
- [ ] **C12** Recovery / undo 24h ventana de cualquier acción admin
### 🟨 Fase D — Feature Flags + Quotas ✅ CERRADA
- [x] **D1** Catálogo `feature_catalog` en `KnowledgeBase[__PLATFORM__]` con 14 features atómicas + cache 5min + endpoint público `GET /admin/feature-catalog` (API v134-v136) ✅
- [x] **D2** Helper `has_feature(company_id, feature)` con override individual desde `config_pro.feature_overrides` (API v70) ✅
- [x] **D3** `GET/PUT/DELETE /admin/tenants/{id}/features` con 2FA TOTP + reason obligatorio + audit_log + email al owner (API v137-v138) ✅
- [x] **D4** Frontend `FeaturesTab.tsx` con toggle 3-estados (PLAN/FORZAR ON/FORZAR OFF) + modal 2FA + 14 features agrupadas por categoría (Frontend `6f39cea`) ✅
- [x] **D5** Override con expiración (selector 7/14/30/60/90 días en modal) — cron expire pendiente para cuando se use ✅
- [x] **D6** Quotas tracking en tabla `TenantQuotas` (Sprint 1.F) ✅
- [x] **D7** Quotas enforcement en bot (Bot v137 QUOTA_ENFORCE=true) ✅
- [x] **D8** Dashboard de uso `/dashboard/billing` con barras + alertas 80%+ (Sprint 1.H) ✅
### 🟥 Fase E — Impersonate + Asistencia con consentimiento ✅ CERRADA
- [x] **E1** Tabla `SupportRequests` (PK request_id, 2 GSIs, PITR, TTL 30d) ✅
- [x] **E2** Helpers HMAC: `_sign_impersonate_ticket` + `_verify_impersonate_ticket` con env var `IMPERSONATE_HMAC_SECRET` ✅
- [x] **E3** `POST /admin/impersonate` genera ticket read_only TTL 1h (API v141) ✅
- [x] **E4** Middleware en `lambda_handler`: lee `X-Impersonate-Ticket` → sustituye client_id + guard read_only hard (API v142) ✅
- [x] **E5** Frontend botón "👁 Ver como cliente" en `/admin/tenants/[id]` + banner rojo + interceptor header automático (Frontend `9f8ca84`) ✅
- [x] **E6** `POST /support/request` admin pide escritura con razón + email Resend al owner + anti-spam 1h (API v143) ✅
- [x] **E7** `GET/POST /support/approve` página pública sin login + token HMAC + approve/deny + emails 3-way (API v144) ✅
- [x] **E8** Frontend `/support/approve/[id]/page.tsx` página pública de aprobación (Frontend `ed0c716`) ✅
- [x] **E9** Auto-poll cada 30s: frontend detecta ticket read_write aprobado y recarga automáticamente (Frontend `108c67a`) ✅
- [x] **E10** `POST /support/exit` cierra sesión + email resumen al cliente SOLO si hubo writes reales (API v146) ✅
- [x] **E11** Cron `support-cleanup-hourly` EventBridge: auto-expire PENDING >24h + cierra APPROVED vencidos + email resumen (API v146) ✅
- [x] **E12** Frontend `/dashboard/support-history` + link sidebar 🆘 Soporte (Frontend `1812e79`) ✅
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
### 🟫 Fase G — Observabilidad completa (G1+G2 ✅)
- [x] **G1** `GET /admin/errors` viewer paginado con filtros (service, error_type, tenant) + agregaciones by_service/by_type/by_tenant (API v54) + frontend `/admin/errors` con detalle expandible (`62b6410`) ✅
- [x] **G2** `log_error()` hookeado en Bot v17 + Remarketing v1 + promote-memory v1 (cualquier error 500 visible en `/admin/errors`) ✅
- [x] **G3** Frontend `/admin/audit` viewer con timeline + filtro por tenant + colores por acción (`48dca59`) ✅
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
### 🎯 Fase M — Meta CAPI completo + ROI real (CRÍTICO antes de optimización IA)
> Sin esto el algoritmo IA del cron es ciego — solo ve clics, no ventas reales.
> Diferenciador masivo: HubSpot cobra $890/mes por esto, en clientes.bot va incluido.
##### Fundamento (sin esto, todo lo demás es ruido)
- [x] **M1** Helper `_send_meta_event(event_name, user_data, custom_data, campaign_id, test_event_code)` con SHA-256 hashing reusable (Bot v5) ✅
- [x] **M2** Tabla `MetaEventsLog` (PK: event_id, TTL 90d, PITR) ✅
- [x] **M3** `event_id` determinístico: `{event}_{phone_last4}_{ref}_{yyyymmdd}` (Bot v5) ✅
- [x] **M4** Bot captura `referral.source_id` + `ctwa_clid` con modelo first-touch + last-touch en `Leads_CRM` (Bot v6) ✅
#### Plantilla Excel inteligente para subir histórico
- [x] **M5** Endpoint `GET /leads/import-template` genera `.xlsx` con dropdown nativo del catálogo (openpyxl layer + API v46) ✅
- [x] **M6** Endpoint `POST /leads/bulk-import-purchases` valida + persiste + dispara Purchase CAPI (API v47) ✅
- [x] **M7** UI `/dashboard/crm`: botón 💰 Ventas con descarga plantilla + parsing xlsx cliente + bulk import (frontend `fa4d537`) ✅
#### Auto-envío en tiempo real
- [x] **M8** Bot manda `Purchase` event automáticamente cuando webhook de pago (Wompi/Bold/etc) confirma — `service_slug` para precio + `source_campaign_id` capturado (Bot `lambda_function.py:2248` + M15 multi-persona `:3871`) ✅
- [x] **M9** Bot manda `Lead` event cuando llega lead nuevo via CTW Ad (Bot `lambda_function.py:5223`) ✅
- [x] **M10** Bot manda `InitiateCheckout` cuando genera payment link (Bot `lambda_function.py:2070`) ✅
#### Eventos de venta multi-persona (genérico: 1 compra = N cupos / N unidades del mismo producto) ✅
- [x] **M11** Estado `AWAITING_PAX_COUNT` — bot pregunta "¿cuántas personas/unidades?" si servicio tiene `allows_group_booking` (Bot v15) ✅
- [x] **M12** Bot calcula total: `pax_count × unit_price`, genera link multi-pasarela con monto correcto (Bot v15) ✅
- [~] **M13** ~~WhatsApp Flow `attendees_form`~~ — reemplazado por chat lineal (mejor UX, sin Flow JSON pesado) ✅
- [x] **M14** Captura datos asistente por asistente (nombre + documento) + valida unicidad documento entre asistentes de la misma compra (Bot v16) ✅
- [x] **M15** Crea N leads independientes (phone sintético `{sender}_aN` para asistentes 2+) + manda N Purchase events con `event_id` único por documento (Bot v16) ✅
- [x] **M16** Tras último asistente, dispara `_trigger_scheduling_flow` automáticamente (Bot v16) ✅
- [x] **M11 UI** — toggle `allows_group_booking` + min/max pax en `/dashboard/services` para que cada cliente decida producto por producto (frontend `2d9e7f3`, API v53) ✅
#### Pixel por tenant
- [x] **M17** Embedded Signup crea Pixel automático si tenant nuevo no tiene (Meta Business API en `handle_meta_exchange`) (API v48) ✅
- [x] **M18** `config_pro.meta_pixel_id` por tenant — `_send_meta_event` lee del config, todos los eventos al pixel del tenant ✅ (implícito por M1)
#### Validación + observabilidad
- [ ] **M19** Test event code mode — validar primeros 5 eventos antes de producción
- [ ] **M20** Dashboard "Match Rate" por tenant en `/admin/tenants/{id}` — qué % de hashes matchearon usuarios reales en Meta
- [x] **M21** Tabla `AdsAttribution` (PK company_id, SK campaign#phone#event#epoch, GSI campaign-event-index, TTL 365d, PITR) + integración bot wrapper + endpoint `GET /ads/attribution` con métricas agregadas (Bot v14 + API v49) ✅
#### Bonus de la sesión 28-29 abril (Bloque M completo + B6.5 + G1+G2)
- [x] **Bot M3A**: refactor `send_meta_capi_event` → wrapper con `event_id` determinístico + enriquece con `campaign_id` first-touch del lead (Bot v7) ✅
- [x] **Bot M3B**: elimina llamada legacy duplicada `send_meta_purchase_event` que disparaba Purchase x2 al pixel del SaaS (Bot v8) ✅
- [x] **Bot M3C**: Lead event ya no se dispara en cada saludo — solo cuando viene de CTW Ad. Agrega `messaging_channel=whatsapp` + `action_source=chat` (Bot v9-v12) ✅
- [x] **Bot M3D**: borra 89 líneas de código legacy CAPI (Bot v13) ✅
- [x] **Bot M21 wrapper**: `send_meta_capi_event` registra atribución first+last en `AdsAttribution` automáticamente (Bot v14) ✅
- [x] **Bot M11-M16**: multi-persona genérico (`allows_group_booking` por servicio + chat lineal asistentes + N Purchase events + scheduling auto) (Bot v15-v16) ✅
- [x] **Bot G2**: `log_error` hookeado en `lambda_handler` global (Bot v17) ✅
- [x] **API M5-M6**: `/leads/import-template` (xlsx con dropdown catálogo) + `/leads/bulk-import-purchases` (valida + persiste + dispara Purchase CAPI) (API v46-v47) ✅
- [x] **API M17**: pixel auto-creado en `handle_meta_exchange` si tenant nuevo no tiene (API v48) ✅
- [x] **API M21**: tabla `AdsAttribution` + `_log_attribution` + `GET /ads/attribution` con métricas agregadas (API v49) ✅
- [x] **API B6.5.A-D**: motor IA con 7 reglas + 3 endpoints CRUD + cron solo recomienda (API v50-v52) ✅
- [x] **API G1**: `/admin/errors` viewer paginado con filtros + agregaciones by_service/by_type/by_tenant (API v54) ✅
- [x] **API services**: `handle_add_service` ahora pasa 11 campos opcionales (multi-tenant genérico) (API v53) ✅
- [x] **Layer openpyxl** publicado y adjuntado a SaaS_API_Handler (266 KB, layer:1) ✅
- [x] **EventBridge `ads-daily-optimize`** ENABLED apuntando a `/ads/cron-recommend` ✅
- [x] **Frontend M7**: `/dashboard/crm` botón 💰 Ventas (descarga plantilla + bulk import) (`fa4d537`) ✅
- [x] **Frontend M11 UI**: `/dashboard/services` toggle `allows_group_booking` + min/max pax (`2d9e7f3`) ✅
- [x] **Frontend B6.5.8**: `/dashboard/ads` tab "🎯 IA" con cards apply/dismiss (`5273883`) ✅
- [x] **Frontend G+**: `/admin/errors` viewer + filtros + detalle expandible (`62b6410`) ✅
- [x] **Helpers** `~/.deploy_bot.sh` y `~/.deploy_api.sh` (1 comando = zip + py_compile + deploy + publish-version) ✅
- [x] **3 tablas DDB** creadas con TTL + PITR: `MetaEventsLog`, `AdsAttribution`, `AdsRecommendations` ✅
- [x] **Bug crítico resuelto**: cron Ads ya NO escala automáticamente sin consentimiento (causa del Bug #2 del 28 abril) — ahora solo recomienda ✅
#### Bonus segunda mitad de la noche (29 abril madrugada)
- [x] **C1+C2**: detalle de tenant con 4 tabs (Métricas/Config/Errores/Timeline) + integrations card con expiración de token Meta + lista clickeable hacia detalle (Bot/API v55, frontend `7046897`) ✅
- [x] **C3+C4**: editor inline de tenant_notes (2000 chars) + tags con 7 presets (vip/beta/churn-risk/etc) + custom tags + audit log automático (API v56, frontend `efd9d77`) ✅
- [x] **C7**: botones suspender/reactivar/eliminar tenant con modal de confirmación + razón obligatoria + audit log. Bot respeta `status=SUSPENDED/DELETED` con silencio total (no quema lista WA) (Bot v18, API v57, frontend `46001e7`) ✅
- [x] **🦁 Multi-tenant strict mode**: `DEFAULT_COMPANY_ID` ya no defaultea a "JMC" — ahora vacío. Bot rechaza silenciosamente webhooks con `phone_number_id` no registrado en ningún `config_pro`. Cada rechazo queda en `ErrorLog` con contexto. Validado: phone fake → `TENANT_NOT_RESOLVED` registrado correctamente (Bot v19) ✅
- [x] **Deuda técnica del SaaS original eliminada** — ahora puedes onboardear cliente #2/#3/#N sin riesgo de cross-contamination de webhooks ✅
- [x] **🦁 Fix bug atribución silencioso (v20)** — `_log_attribution` movido del wrapper `send_meta_capi_event` al low-level `_send_meta_event`. Antes M9 Lead CTW Ad y M15 Purchase multi-persona bypaseaban la atribución → `AdsAttribution` subestimaba funnel → cron B6.5 ciego a grupos y CTW leads. Ahora **todos los call sites CAPI loguean atribución automáticamente**. Fase M ahora 100% cerrada excepto M19/M20 (observabilidad) ✅
---
- [x] **Sintetizador phone para multi-persona**: asistentes 2+ usan `{sender}_aN` para no chocar PK Leads_CRM ✅
---
#### Bonus sesión 29 abril (tarde) — multicanal + fixes
- [x] **Fix flows fantasma (v21)**: `handle_flows_data_exchange` resuelve tenant via `resolve_company(PHONE_NUMBER_ID)` antes de descifrar — elimina `DEFAULT_COMPANY_ID` vacío en lookup de llave privada ✅
- [x] **`ChatwootLiveSessions` eliminada**: verificado que ninguna Lambda la usaba — tabla basura eliminada ✅
- [x] **`Subscriptions` PITR activado**: tabla existía sin PITR — activado antes de Sprint 1 ✅
- [x] **Migración multicanal — arquitectura contact_id**: `TypebotSessions_v2` + `Leads_CRM_v2` con PK `contact_id` genérico + campo `channel` (whatsapp/instagram/facebook) + GSI x2 + PITR. Backup pre-migración en S3 `clientes-bot-backups-235565749479/pre-migration/` ✅
- [x] **Bot v27**: 23 cambios — `contact_id` como PK en session_table y leads_table, `channel` field default `whatsapp`, `leads_table` sin hardcode, backwards compat `payment_table` ✅
- [x] **API v62**: 49+ cambios — `contact_id` como PK en session_table y leads_table, `payments_table` intacta con `phoneNumber` ✅
- [x] **Canales Meta verificados**: WA activo (`phone_number_id: 1048898704969876`), FB Messenger (`page_id: 224383387690264`) y IG DM (`ig_id: 17841459029140443`) listos para conectar en Sprint 2 ✅
---
#### Bonus sesión 29 abril (noche/madrugada) — billing + UX + landing
- [x] **Lemon Squeezy integrado**: checkout, webhook HMAC, planes, cancel, resume — API v63/v64/v65 ✅
- [x] **Planes rediseñados**: Starter $97 / Growth $297 / Agency $497 — features correctos por plan ✅
- [x] **`/dashboard/billing`**: página completa con toggle mensual/anual, estado suscripción, cancel/resume ✅
- [x] **Sidebar**: ítem 💎 Suscripción agregado para rol owner ✅
- [x] **Login passkey auto-disparo**: FaceID/huella se activa automáticamente al cargar — sin botones intermedios ✅
- [x] **Fix dashboard en blanco**: providers.tsx — setUser inmediato desde localStorage, /me en background ✅
- [x] **Landing planes**: Starter/Growth/Agency con tooltips "?" explicativos, toggle anual -20%, sección "En camino 🚀" ✅
- [x] **Lemon Squeezy API key renovar**: ⚠️ regenerar la API key expuesta en el chat
---
#### Bonus sesión 30 abril (madrugada) — Feature Flags + Quotas + Message Packs 🦁
- [x] **Catálogo `PLAN_FEATURES` migrado a DDB**: `KnowledgeBase[__PLATFORM__/plan_features]` (hit límite 4KB env vars). Cache 5min. Admin puede editar sin redeploy ✅
- [x] **Tabla `TenantQuotas`** creada con PITR + TTL 400d (PK: company_id, SK: YYYY-MM). Reset mensual automático por SK ✅
- [x] **Helpers API**: `has_feature`, `get_plan_quotas`, `get_plan_info`, `incr_quota`, `within_quota`, `get_tenant_usage` (API v70+v71) ✅
- [x] **Endpoints**: `GET /billing/features` + `GET /billing/usage` — tested JMC=enterprise (unlimited) + CO_979BE374=starter (blocked 5001/5000) (API v72) ✅
- [x] **Bot v28 enforcement**: chequea quota, incrementa contador. Flag `QUOTA_ENFORCE=false` (rodaje, solo log). Planes ilimitados pasan siempre ✅
- [x] **🦁 JMC = enterprise lifetime** (`plan_source=owner_lifetime`) — no contabiliza como MRR ✅
- [x] **Catálogo `MESSAGE_PACKS` en DDB**: 3 packs S=1k/$19, M=5k/$79 ⭐, L=20k/$249 💎 (descuentos 0%/18%/36%) ✅
- [x] **Bot v29**: `consume_pack_message()` atómico con `ConditionExpression`. Orden: plan → pack → bloqueo ✅
- [x] **API v73**: catálogos leen DDB con cache 5min + fallback env var (backward-compat) ✅
- [x] **API v74**: 3 endpoints `/billing/packs` (GET list), `/billing/packs/checkout` (POST Lemon Squeezy one-time), `/billing/packs/history` (GET AuditLog) + webhook handler `order_created` detecta `type=message_pack` y suma al balance ✅
- [x] **Arquitectura pack balance**: `config_pro.messages_pack_balance` (atomic ADD/SUB) — hasta agotarse, no expira mensualmente (filosofía Stripe/Twilio) ✅
#### Bonus sesión 30 abril (mañana) — Lemon Squeezy E2E + Affiliates 🦁
- [x] **3 productos Message Packs** creados en Lemon Squeezy (variants 1593119/1593133/1593137) ✅
- [x] **🔥 Test E2E REAL con plata**: compra Pack M $79 → webhook `order_created` → `add_pack_messages()` → balance JMC = 5,000 ✅
- [x] **Bug fix v75**: `/billing/webhook` y `/ads/cron-recommend` agregados a `_public_paths` (LS no manda `client-id`) ✅
- [x] **4 tablas DDB Afiliados** creadas con PITR: `Affiliates`, `Referrals`, `AffiliateCommissions`, `AffiliatePayouts` ✅
- [x] **API v76**: 5 endpoints `/affiliate/*` (signup/me/referrals/commissions/validate-code) + hook checkout lee `ref_code` + webhook procesa comisiones con hold 30d ✅
- [x] **API v77**: fix routing `/me` vs `/affiliate/me` ✅
- [x] **Modelo de comisiones**: 40% año 1 + 30% recurring forever, hold 30d post-pago, anti-fraude churn <60d ✅
- [x] **🦁 JMC primer afiliado**: code `JUEX36OP`, status PENDING_REVIEW (auto-approve laxo) ✅
- [x] **Frontend Affiliate Tracker** (`app/components/AffiliateTracker.tsx`): captura `?ref=CODE` → valida API → cookie 90d + localStorage → limpia URL ✅
- [x] **`handleCheckout`** lee cookie `cb_ref` y envía `ref_code` a Lemon Squeezy ✅
- [x] **API v78**: cron `handle_affiliate_cron_release` con anti-fraude final (status=CHURNED → VOID) ✅
- [x] **EventBridge `affiliate-release-commissions-daily`** ENABLED (4 AM UTC = 11 PM CO) ✅
- [x] **Modelo definido en STATUS.md**: cláusula legal "tasas pueden revisarse con 90 días de aviso" — protección contra cambios de mercado ✅
#### Bonus sesión 30 abril (noche) — Remarketing real + Devolver al bot 🦁
> Auditoría post-incidente reveló que el cron `WhatsApp_Remarketing` corría hace meses sin hacer nada (Bug #15: feature fantasma).
> El bot NUNCA escribía `remarketing_pending=true`, las env vars apuntaban a tablas viejas, y el flujo de devolver al bot tenía bug #16.
> Esta sesión cerró el loop completo end-to-end.
**Cart Abandonment:**
- [x] **Bot v32**: marca `remarketing_pending=true` + `remarketing_intent="checkout_abandoned"` cuando `trigger_payment_flow` genera link ✅
- [x] **Bot v32**: desmarca `remarketing_pending=false` + `remarketing_closed=true` cuando webhook confirma PAGADO ✅
**Info Abandonment:**
- [x] **Bot v33**: marca `remarketing_pending=true` + `remarketing_intent="info_{intent}"` en `update_session_context` cuando intent ∈ {info, booking, catalog} y hay `detected_service` ✅
- [x] **Anti-overlap**: si ya hay `remarketing_pending` (cart) o `remarketing_closed=true`, no sobreescribe ✅
**Cron Remarketing:**
- [x] **Remarketing v2**: env vars apuntan a `TypebotSessions_v2` + `Leads_CRM_v2` (antes apuntaban a tablas vacías/viejas) + código adaptado a PK `contact_id` ✅
- [x] **Remarketing v3**: agregada función `process_auto_return_to_bot()` — devuelve sesiones `PAUSED_FOR_HUMAN` >2h sin actividad al bot. Validado: 1 conversación atrapada recuperada en primer test ✅
- [x] **Remarketing v4**: helper `_resolve_service_name()` (slug → nombre real) + `_get_remarketing_message()` con 4 templates diferenciados:
  - `checkout_abandoned`: "Te dejé el link de pago para X y vi que no pudiste completarlo. ¿Tuviste algún inconveniente?"
  - `info_booking`: "Querías reservar X. ¿Te ayudo a completarla? Quedan cupos 🎯"
  - `info_catalog`: "Vi que estuviste explorando nuestros servicios. ¿Hay alguno en particular?"
  - `info_info` (default): "Te dejé información sobre X y noté que quedaste con dudas. ¿Te ayudo a aclararlas?"
- [x] **Stage 0 + Stage 1** con mensajes distintos (segundo intento más blando, sin presión)
**Devolver al bot (Plan A):**
- [x] **API v82**: `handle_conversation_release` ahora envía mensaje cordial al cliente ("Tu conversación vuelve al asistente virtual de {brand}") ✅
- [x] **API v85**: `release` también limpia `assigned_agent_id` y `assigned_agent_name` en `TypebotSessions_v2` + `Leads_CRM_v2` (Bug #16: la conv quedaba en tab Agente fantasma) ✅
- [x] **Frontend `492ec01`**: botón "🤖 Devolver al bot" agregado al tab "🙋 Agente" (antes solo estaba en tab "🤖 En vivo") ✅
- [x] **Frontend `9185c30`**: tras release, limpia `selectedPhone` + cambia tab a "En vivo" + doble refresh (`now` + `1500ms` para DDB eventual consistency) ✅
- [x] **Auto-return safety net**: cron diario devuelve al bot conversaciones sin actividad >2h del agente (evita clientes fantasma esperando) ✅
**Tests pendientes:**
- [ ] Test E2E con número real: info abandonment (1h delay temporal hasta validar)
- [ ] Test E2E con número real: cart abandonment con link de pago no completado
- [ ] Subir `REMARKETING_DELAY_HOURS` a 24h tras validar (actualmente en 1h para testing)
### 🗂️ Tablas DynamoDB nuevas (a crear durante B-M)
- [x] `PlatformAdmins` (PK: `email`) — equipo de la plataforma ✅ creada
- [x] `ErrorLog` (PK: `service`, SK: `sk`, TTL 30d, PITR) ✅ creada
- [x] `SupportRequests` (PK: `request_id`, GSI: `company_id-created_at-index` + `status-created_at-index`, PITR ✅, TTL 30d) ✅ creada Fase E
- [ ] `SupportTickets` (PK: `ticket_id`, GSI: `company_id`, GSI: `assigned_to`)
- [ ] `BugReports` (PK: `report_id`, GSI: `company_id`)
- [x] `TenantQuotas` (PK: `company_id`, SK: `period` YYYY-MM, PITR ✅, TTL 400d) ✅ creada Sprint 1.F
- [x] `Subscriptions` (PK: `company_id`, GSI: `gateway-subscription-index` + `status-index`, PITR ✅) — creada, lista para Sprint 1`
- [x] `Affiliates` (PK: `email`, GSI: `affiliate_code-index`) ✅ creada Sprint 1
- [x] `Referrals` (PK: `company_id`, GSI: `affiliate_email-index`) ✅ creada Sprint 1
- [x] `AffiliateCommissions` (PK: `affiliate_email`, SK: `ts#referral_id`, GSI: `released-hold_until-index`) ✅ creada Sprint 1
- [x] `AffiliatePayouts` (PK: `affiliate_email`, SK: `month` YYYY-MM) ✅ creada Sprint 1
- [x] `MetaEventsLog` (PK: `event_id`, TTL 90d, PITR) ✅ creada — dedup eventos CAPI antes de enviar
- [x] `AdsAttribution` (PK: `company_id`, SK: `campaign_id#phone#event#epoch`, GSI: `campaign-event-index`, TTL 365d, PITR) ✅ creada — vincula campaign → lead → pago
- [x] `AdsRecommendations` (PK: `company_id`, SK: `rec_id`, GSI: `status-created-index`, TTL 7d, PITR) ✅ creada — recomendaciones IA del cron
- [x] `AdsCreativeLibrary` (PK: `company_id`, SK: `creative_id`, GSI: `pattern-ctr-index`, PITR ✅, sin TTL — persistente) ✅ creada Sprint AI Creative Loop — librería de creatives ganadores del tenant
- [x] `AdsHookVariants` (PK: `company_id`, SK: `variant_id`, GSI: `original_ad_id-index`, TTL 90d, PITR ✅) ✅ creada Sprint AI Creative Loop — tracking variantes publicadas (Motor 4 → Motor 5)
- [x] `AdsCrossTenantPool` (PK: `vertical`, SK: `pattern#ts#company_short`, GSI: `pattern-ctr-index`, TTL 365d, PITR ✅) ✅ creada Sprint AI Creative Loop — patrones anonimizados cross-tenant opt-in
- [ ] `BrandDNA` (PK: `company_id`, TTL 90d, PITR) — pendiente Sprint Brand DNA + Wizard 2.0
- [ ] `BrandAssets` (PK: `company_id`, SK: `asset_id`, GSI: `asset_type-index`, TTL 365d auto-cleanup inactivos, PITR) — pendiente Sprint Brand DNA + Wizard 2.0
- [ ] Modificar `KnowledgeBase config_pro`: agregar `feature_overrides`, `tenant_notes`, `tags`, `events_timeline`, `pixel_id`, `business_vertical`, `ads_cross_tenant_optin`, `wizards_pack_balance`
- [ ] Modificar `Leads_CRM`: agregar `source_campaign_id`, `source_type`, `paid_amount`
### ⚙️ Env vars nuevas
- `SUPER_ADMIN_EMAILS` (ya existe) — bootstrap inicial
- `IMPERSONATE_HMAC_SECRET` — firma de tickets
- `PLAN_FEATURES_JSON` — catálogo de features + quotas por plan (Sprint 1)
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — billing global (Sprint 1)
- `STRIPE_CONNECT_CLIENT_ID` — payout de afiliados USD (Sprint 1)
- `WOMPI_SUBSCRIPTIONS_PUBLIC_KEY` / `WOMPI_SUBSCRIPTIONS_PRIVATE_KEY` — billing CO recurrente (Sprint 1)
- `AFFILIATE_RATE_YEAR1` — default 0.40 (40% primer año) configurable (Sprint 1)
- `AFFILIATE_RATE_RECURRING` — default 0.30 (30% año 2+) configurable (Sprint 1)
- `AFFILIATE_COOKIE_DAYS` — default 90 (Sprint 1)
- `AFFILIATE_HOLD_DAYS` — default 30 (días de retención post-pago) (Sprint 1)
- `AFFILIATE_MIN_REFERRAL_DAYS` — default 60 (anti-fraude churn rápido) (Sprint 1)
- `AFFILIATE_MIN_PAYOUT_USD` — default 50 (Sprint 1)
- `AFFILIATE_MIN_PAYOUT_COP` — default 200000 (Sprint 1)
### 🛡️ Reglas inamovibles del Admin Panel
- Toda acción admin queda en `AuditLog`
- Toda escritura sobre tenant requiere consentimiento del cliente o 2FA del admin
- Impersonate por defecto = read-only
- Acciones destructivas = pide 2FA otra vez aunque ya hayas iniciado sesión
- 2 super_admins requeridos para: eliminar tenant, killswitch global, dar rol super_admin
- Email automático al cliente cada vez que un admin actúa (transparencia total)
---
## 🐛 INCIDENTES CRÍTICOS RESUELTOS
### 28 abril 2026 — 8 bugs en 1 día (sesión maratón)
#### Bug #1 (CRÍTICO 🔴) — Webhook WhatsApp apuntaba al Lambda equivocado
- **Síntoma**: 3 días de campañas Ads (~$500k COP gastado), 0 leads nuevos en CRM
- **Causa**: webhook URL del WABA registrado en Meta apuntaba a `lambda-url.us-east-1.on.aws/` (SaaS_API_Handler) en vez del API Gateway del bot
- **Origen**: error de configuración en Meta App "Gestor de Clientes" desde el principio
- **Fix**: cambiar callback URL a `https://7f0rgbqgs2.execute-api.us-east-1.amazonaws.com/default/WhatsApp_Typebot_Bridge`
- **Lección**: necesitamos health check automático de webhook URL por tenant (Fase G7.5)
#### Bug #2 (CRÍTICO 🔴) — Cron Ads escala automáticamente sin consentimiento
- **Síntoma**: presupuesto de campaña subió de $100k/día → $194k/día en 3 días
- **CPL real subió 53%** ($916 → $1.399) — escalamiento empeoró ROI
- **Causa**: `handle_ads_cron_optimize()` aplica cambios automáticos sin notificar al cliente
- **Fix temporal**: cron pausado (`aws events disable-rule --name ads-daily-optimize`)
- **Fix definitivo (B6.5)**: reescribir cron para detectar y RECOMENDAR, cliente decide
#### Bug #3 (ALTO 🟡) — Login con Google bypassea 2FA
- **Síntoma**: usuario con 2FA configurado podía entrar directo via Google sin código
- **Fix**: callback Google chequea `totp_enabled`/`passkey_enabled` post-login → redirige a `/auth/login?2fa=1` si tiene 2FA
#### Bug #4 (ALTO 🟡) — DynamoDB UpdateExpression syntax sin comas
- **Síntoma**: error "Invalid UpdateExpression" al configurar passkey/TOTP
- **Causa**: `REMOVE passkey_challenge passkey_challenge_expires` (sin coma)
- **Fix**: agregar comas en 3 lugares (Lambda v43)
#### Bug #5 (ALTO 🟡) — `/me` no devolvía flags de 2FA
- **Síntoma**: frontend nunca detectaba que usuario tenía 2FA configurado
- **Causa**: handler no incluía `totp_enabled`, `passkey_enabled`, `passkey_count`
- **Fix**: agregar campos al response (Lambda v44)
#### Bug #6 (MEDIO 🟢) — `cb_last_email` no se persistía
- **Síntoma**: botón "Iniciar con huella" nunca aparecía aunque hubiera passkey
- **Causa**: ni `signInWithEmail` ni callback Google guardaban el flag
- **Fix**: agregar `localStorage.setItem('cb_last_email', email)` en ambos lugares
#### Bug #7 (MEDIO 🟢) — `app/auth/login/page.tsx` JSX roto
- **Síntoma**: build de Amplify falla con "Unexpected token"
- **Causa**: edición manual mal hecha que duplicó atributos del botón Google
- **Fix**: limpieza del bloque
#### Bug #8 (BAJO ⚪) — `dashboard/layout.tsx` TS error
- **Síntoma**: build falla — `tokenWarning.days_left` no existe en tipo
- **Fix**: agregar `days_left?: number` al tipo
### 30 abril 2026 — Bot silencioso + dashboard sin conversaciones
#### Bug #9 (CRÍTICO 🔴) — `contact_id` faltante en put_item Leads_CRM_v2
- **Síntoma**: bot respondía correctamente pero leads NO aparecían en CRM. Dashboard de chat mostraba 0 conversaciones.
- **Causa**: durante implementación de Feature Flags/Message Packs (Bot v28/v29), el `item_to_save` del CRM perdió el campo `contact_id` — solo tenía `phoneNumber`. `Leads_CRM_v2` tiene `contact_id` como PK → `ValidationException` silenciosa en cada mensaje.
- **Fix**: agregar `"contact_id": sender` al `item_to_save` (Bot v30) ✅
- **Lección**: al agregar código nuevo sobre tablas migradas, verificar SIEMPRE que el `put_item` incluye la PK correcta. `Leads_CRM_v2` usa `contact_id`, NO `phoneNumber`.
#### Bug #10 (ALTO 🟡) — `conversations/active` retornaba `[]` siempre
- **Causa**: endpoint usaba `session_table.scan()` buscando campo `phoneNumber` — incompatible con `TypebotSessions_v2` que usa `contact_id` como PK y tiene GSI por `company_id`.
- **Fix**: reemplazar scan por `query` con GSI `company_id-last_interaction-index` + fallback `get_item` directo para nombres (API v79/v80) ✅
### 30 abril 2026 (tarde) — Auditoría completa post-incidente
> Tras Bugs #9/#10, audit completo de Bot + API buscando otros casos rotos.
#### Bug #11 (CRÍTICO 🔴) — `unit_amount` undefined en `trigger_payment_flow`
- **Síntoma**: dict `payment_args` tenía 3 líneas mal indentadas heredadas de un patch viejo, una con `"unit_amount": int(unit_amount)` con variable nunca definida en scope.
- **Impacto**: cada flujo de pago (Wompi/Bold/PayU/etc) explotaría con `NameError` → cliente sin link de pago.
- **Fix**: eliminar las 3 líneas mal indentadas (Bot v31) ✅
- **Lección**: `py_compile OK` no garantiza correctness — variable undefined solo se ve en runtime.
#### Bug #12 (ALTO 🟡) — Demo de la landing roto desde migración multicanal
- **Síntoma**: cualquier visitante que probara el demo IA en la landing recibía "Demo expirado" en el primer mensaje.
- **Causa**: `handle_create_demo` escribía `session_table.put_item({"phoneNumber": f"demo_{demo_id}", ...})` sin `contact_id`. PK migrada a `contact_id` → put silenciosamente fallaba. Luego `handle_demo_chat` leía con `Key={"contact_id": ...}` y nunca encontraba nada.
- **Fix**: agregar `"contact_id"` + `"channel": "demo"` al put_item (API v81) ✅
- **Lección**: necesitamos `log_error` en cualquier "Demo expirado" para detectar fallas silenciosas antes.
#### Bug #13 (BAJO ⚪) — Demo escribía a tabla `Leads_CRM` antigua
- **Causa**: `handle_create_demo` hardcodeaba `dynamodb.Table("Leads_CRM")` (PK phoneNumber) en vez de `Leads_CRM_v2`.
- **Fix**: cambiar a `os.environ.get("LEADS_TABLE", "Leads_CRM_v2")` + agregar `contact_id` (API v81) ✅
- **Lección**: cuando hay tablas v1/v2 paralelas, **siempre usar env var `LEADS_TABLE`**, nunca hardcodear nombre.
#### Bug #14 (OPERACIONAL 🟠) — Gemini API spending cap reventado
- **Síntoma**: ~25% de mensajes WhatsApp recibieron respuesta de "alta demanda". 137 errores `429 RESOURCE_EXHAUSTED` en 24h.
- **Causa**: activar billing en Google Cloud reemplaza el free tier diario (1,500 req/día) por **spending cap manual** que estaba muy bajo. Al gastar centavos llegamos al tope.
- **Volumen real consumido**: 416 calls el 30 abril = ~$0.04 USD. Cap estaba en cero o por defecto.
- **Fix**: subir spending cap en Google Cloud Console + alertas 50/75/90% ✅
- **Lección**: activar billing ≠ acceso ilimitado. Siempre revisar el spending cap configurado.
#### Bug #15 (CRÍTICO 🔴) — Remarketing fantasma desde siempre
- **Síntoma**: cron `WhatsApp_Remarketing` corría cada hora sin errores pero `processed: 0` SIEMPRE. Pruebas reales con número personal nunca recibieron seguimiento.
- **Causa raíz**: el Bot **NUNCA escribía** los campos `remarketing_pending` ni `renewal_date` que el cron buscaba. 0 ocurrencias de "remarketing" en `WhatsApp_Typebot_Bridge` antes de v32.
- **Adicional**: env vars del cron apuntaban a tablas obsoletas `WhatsApp_Sessions` (0 items) y `Leads_CRM` (vieja), no a `_v2`.
- **Fix**: implementación end-to-end (Bot v32 cart-abandonment + Bot v33 info-abandonment + Remarketing v2-v4 con env vars correctas + mensajes diferenciados por intent) ✅
- **Lección 8**: validar END-TO-END nuevas features antes de marcar como "completadas". Crons sin tests E2E son trampas silenciosas.
#### Bug #16 (ALTO 🟡) — Conversación queda en tab Agente tras devolver al bot
- **Síntoma**: agente daba "Devolver al bot", la sesión cambiaba a `CHAT_MODE` pero la conversación seguía apareciendo en tab "🙋 Agente" porque mantenía `assigned_agent_id`. El botón quedaba habilitado y la conversación duplicada en ambos tabs.
- **Causa**: `handle_conversation_release` solo limpiaba `flow_state` y `takeover_by`, nunca tocaba `assigned_agent_id`/`assigned_agent_name`.
- **Fix**: API v85 ahora hace `REMOVE assigned_agent_id, assigned_agent_name` en `TypebotSessions_v2` + `Leads_CRM_v2`. Frontend `9185c30` limpia `selectedPhone` y refresca lista con doble fetch ✅
- **Adicional**: API v82 agregó mensaje de "vuelvo a estar disponible" al cliente cuando se devuelve al bot.
- **Lección 9**: cuando un endpoint cambia el estado de una entidad, limpiar TODOS los campos relacionados (no solo el principal). Test visual en frontend obligatorio.
### 5 mayo 2026 — Sesión maratón 15h: Flow comercial multi-tenant + bugs Gemini 🦁
> 25 deploys, 14 bugs raíz cerrados, 4 horas iniciales en madrugada (carrusel) + 11 horas tarde (flow comercial + Gemini stability).
> Resultado: bot vendiendo end-to-end con UX humana, multi-tenant strict, fallback Gemini cuando hay 503.
#### Bug #21 (CRÍTICO 🔴) — GSI corruption tras disconnect/reconnect WhatsApp
- **Síntoma**: tras desconectar y reconectar WA del dashboard, bot rechazaba webhooks con `Webhook sin tenant resuelto phone_number_id=X`. Item en `KnowledgeBase` correcto, pero `query` al GSI `phone_number_id-index` devolvía vacío.
- **Causa**: DDB no propagaba consistentemente al GSI cuando el campo cambiaba múltiples veces rápido (DISCONNECTED → real value).
- **Fix**: re-indexado forzado con valor temporal (`update phone_number_id="TEMP_REINDEX"` → sleep 3s → `update` con valor real → sleep 5s) ✅
- **Mitigación permanente**: script `~/restore-jmc.sh` blindado con re-indexado automático tras cada restore.
- **Lección 12**: tras cualquier disconnect/reconnect de WhatsApp, SIEMPRE verificar el GSI con query antes de dar por bueno el reconnect.
#### Bug #22 (CRÍTICO 🔴) — flow_state stuck en AWAITING_PAX_COUNT post-payment
- **Síntoma**: tras generar payment link multi-persona, sesión quedaba en `AWAITING_PAX_COUNT`. Cliente escribía cualquier cosa después → bot pedía "¿cuántas personas?" infinitamente. Generaba 4+ payment links por usuario.
- **Causa**: `handle_pax_count_input` llamaba `trigger_payment_flow` pero NO liberaba `flow_state` a `CHAT_MODE`.
- **Fix**: agregar `save_session(flow_state=CHAT_MODE)` al final de `handle_pax_count_input` (Bot v48) ✅
- **Lección 13**: TODO handler que dispara una acción terminal (pago, transferencia humana) DEBE liberar el `flow_state` antes de retornar.
#### Bug #23 (CRÍTICO 🔴) — Cross-tenant leak en cache de carrusel
- **Síntoma**: `_carousel_tpl_cache` global, no por tenant. Tenant A pedía catálogo → cacheaba template `catalogo_servicios_v2`. Tenant B (JMC) con su propio template `catalogo_jmc_10cards` recibía el cache equivocado durante 5 min.
- **Fix**: `_carousel_tpl_cache: dict = {}` keyed por `company_id` (Bot v49) ✅
- **Lección 14**: TODO cache compartido en multi-tenant DEBE ser keyed por `company_id`. Audit obligatorio antes de cada deploy multi-tenant.
#### Bug #24 (ALTO 🟡) — intent=catalog no disparaba carrusel
- **Síntoma**: cliente decía "¿qué cursos tienen?" → Gemini clasificaba `intent=catalog` correctamente → bot solo mandaba el `reply` de Gemini SIN carrusel.
- **Causa**: guard `if _question_marks == 0` en `process_ai_response` impedía mandar carrusel cuando el reply de Gemini terminaba con pregunta. Pero Gemini SIEMPRE termina con pregunta.
- **Fix**: quitar el guard. Si `intent=catalog`, SIEMPRE mandar carrusel después del texto (Bot v50) ✅
#### Bug #25 (CRÍTICO 🔴) — Función `enviar_catalogo_carrusel` duplicada con template hardcoded
- **Síntoma**: bot v49 con cache por tenant deployed, pero seguía enviando template viejo `catalogo_servicios_v2` (5 cards) en lugar del nuevo `catalogo_jmc_10cards` (10 cards).
- **Causa**: Python tenía `def enviar_catalogo_carrusel` definida 2 veces. La segunda (línea 1700) sobreescribía la primera (línea 976) con `tpl_name = "catalogo_servicios_v2"` hardcoded. La función "buena" con `_get_best_carousel_template` nunca se llamaba.
- **Fix**: reemplazar hardcode por `_get_best_carousel_template(company_id)` con fallback a lista (Bot v51) ✅
- **Lección 15**: hacer grep por funciones duplicadas antes de deploys grandes. Python no avisa, solo usa la última definida.
#### Bug #26 (CRÍTICO 🔴) — save_session destructivo (put_item pisa todo)
- **Síntoma**: `pax_confirmed=9` se guardaba correctamente, pero 30 segundos después aparecía como `pax_confirmed=1`. Imposible debuggear hasta encontrar la raíz.
- **Causa**: `save_session()` usaba `put_item()` que reemplaza el item completo. Cuando OTRO call-site (de los 20+) hacía `save_session({"flow_state": "CHAT_MODE"})` SIN incluir `pax_confirmed`, lo borraba implícitamente.
- **Fix**: refactor `save_session` a hacer **merge** (read existing + update + write) en lugar de put destructivo (Bot v78) ✅
- **Impacto**: arregla los 20+ call-sites de un solo cambio. Ningún campo se pierde nunca más.
- **Riesgo asumido**: sesión nunca se "limpia" automáticamente. Mitigado con `clear_pax_data()` post-pago (v85).
- **Lección 16**: si una función tiene 20+ call-sites con dicts diferentes, NUNCA usar `put_item` — siempre merge. `update_item` también funciona pero requiere SET dinámico.
#### Bug #27 (ALTO 🟡) — NIVEL 2 capturaba saludos largos antes de Gemini
- **Síntoma**: cliente CTW Ad escribía "Hola quiero más información del seminario" → NIVEL 2 (catálogo) hacía match con "seminario" → respondía con info estática plana, ignorando neuroventas del prompt.
- **Causa**: lógica `service_match = search_catalog(...) if not has_active_conversation else None` capturaba todo mensaje de cliente nuevo, sin importar si era saludo conversacional.
- **Fix**: detectar saludo + servicio (prefijo "hola/buenos/saludos" + ≥4 palabras) → SKIP NIVEL 2 → Gemini responde con neuroventas (Bot v58/v59) ✅
- **Detalle clave**: `is_greeting()` original retornaba `False` con mensajes >19 chars. Fix usa prefix matching directo (`startswith("hola")` etc).
#### Bug #28 (CRÍTICO 🔴) — Guard de `allows_group_booking` antes de normalizar slug
- **Síntoma**: Gemini detectaba `intent=booking` con `detected_service="Seminario de Tiro Con Pistola 9mm"` (NOMBRE, no slug). `trigger_payment_flow` recibía nombre → buscaba en catálogo por slug → no match → guard `if service.get("allows_group_booking")` no aplicaba (service=None) → disparaba pago directo bypaseando flow comercial.
- **Causa**: el guard estaba ANTES del bloque `slug_normalize_v1` que resuelve nombre→slug.
- **Fix**: mover guard `allows_group_booking` DESPUÉS de la normalización (Bot v60) ✅
- **Lección 17**: guards de validación deben ir DESPUÉS de todas las normalizaciones de input. Si el dato puede llegar en N formatos, normalizar antes de decidir.
#### Bug #29 (CRÍTICO 🔴) — Gemini 2.5-flash vomita ráfagas de \n con caracteres acentuados
- **Síntoma**: cuando cliente daba nombre "Juan Martínez" o "Juan Gómez", Gemini respondía con `customer_name: "Juan Mart\n\n\n\n\n\n... (50+ saltos)"`. JSON queda truncado por maxOutputTokens. Reparación falla. Cliente recibe mensaje genérico de "alta demanda".
- **Causa**: bug del modelo `gemini-2.5-flash` con `responseSchema` + caracteres UTF-8 especiales.
- **Fix #1 (Bot v70)**: normalizar input quitando acentos antes de enviar a Gemini (input sin tildes, output con tildes — Gemini genera correctamente acentos en español).
- **Fix #2 (Bot v73)**: cambiar modelo principal a `gemini-2.5-flash-lite` (más barato + sin bug). Fallback a `gemini-flash-lite-latest` si lite falla.
- **Lección 18**: `responseSchema` no protege contra bugs internos del modelo. Tener fallback automático a otro modelo cuando el principal devuelve malformed.
#### Bug #30 (CRÍTICO 🔴) — Gemini 2.5-flash 503 caído masivo
- **Síntoma**: ~30% de requests fallaban con `Gemini 503 - retry automático` x3 → fallback genérico "alta demanda" → UX rota a escala. No era spending cap.
- **Causa**: caída de Google Cloud en `gemini-2.5-flash` (modelo nuevo, infra inestable). Confirmado con curl directo: `gemini-2.5-flash` → 503, `gemini-flash-lite-latest` → 200.
- **Fix**: wrapper `call_gemini` con fallback automático: 3 retries en principal → si falla, 1 intento en `flash-lite-latest` → solo si ambos fallan, fallback genérico (Bot v62-v65) ✅
- **Lección 19**: SaaS production con LLM externo NUNCA debe depender de un solo modelo. Wrapper con fallback automático es regla, no excepción.
#### Bug #31 (CRÍTICO 🔴) — pax_count perdido al final del flow comercial
- **Síntoma**: cliente decía "9 personas" → flow OK hasta dar nombre → `Payment Link enviado con monto $140.000` (pax=1) en lugar de $1.260.000 (pax=9 × $140k). Pérdida real $1.120.000 por venta.
- **Causa**: history truncado a 6 mensajes. Cuando cliente daba nombre en turno 5+, Gemini ya no veía "9 personas" del turno 1. Devolvía `pax_count=null` → código usaba default=1.
- **Fix multicapa**:
  - History 6→20 mensajes (Bot v76)
  - PAX STICKY: guardar `pax_confirmed` en sesión la primera vez, NUNCA sobreescribir (Bot v77)
  - Re-leer sesión fresca antes de comparar (race condition fix)
- **Lección 20**: contexto LLM siempre TRUNCADO. Datos críticos del flow (pax, customer_name, slug) deben persistirse en sesión, no depender solo del context window.
#### Bug #32 (CRÍTICO 🔴) — Intercept "Si/Ok" disparaba pago mid-flow
- **Síntoma**: cliente confirmaba horario con "Si" → intercept de confirmaciones detectaba `last_intent=booking` → disparaba `trigger_payment_flow` → guard pax se activaba → "¿cuántas personas?" otra vez. Loop infinito.
- **Causa**: el intercept "Si/Ok" no diferenciaba entre "sí quiero pagar" (catalog→pago) y "sí, ese horario" (mid-flow comercial).
- **Fix**: guard mid-flow — si hay `pax_confirmed` SIN `customer_name`, "Si" pasa a Gemini (no dispara pago) (Bot v82) ✅
- **Lección 21**: interceptors basados en keywords cortos ("si/ok") DEBEN tener context-awareness del flow actual.
#### Bug #33 (ALTO 🟡) — Bot pegado en respuestas vagas
- **Síntoma**: cliente decía "en la mañana" → bot respondía "Tenemos disponibilidad en 10 AM o 2 PM, ¿cuál prefieres?" (idéntico al turno anterior, sin avanzar). Cliente se frustraba.
- **Causa**: prompt no enseñaba a Gemini a manejar respuestas ambiguas. Solo seguía script rígido.
- **Fix**: regla universal backend #26 — pedir precisión a respuestas vagas usando SOLO opciones reales del catálogo del tenant. Regla #27 — resumir todo antes de cerrar (Bot v81-v83) ✅
- **Multi-tenant**: las reglas van en backend `system_prompt`, no en prompt del cliente. Cualquier tenant nuevo hereda automáticamente.
#### Bug #34 (CRÍTICO 🔴) — Anticipo calculado sin pax_count
- **Síntoma**: cliente para 7 personas → bot anuncia anticipo $140.000 (1 persona) en lugar de $980.000 (7 × $140k).
- **Causa**: `trigger_payment_flow` calculaba `amount = pricing.deposit_required` sin multiplicar por `pax_count`.
- **Fix**: `amount = deposit_required * pax_count` (multi-tenant: lee del catálogo, sin hardcode 50%) (Bot v79-v80) ✅
- **Multi-tenant clean**: cada negocio configura `deposit_required` por servicio en su catálogo. Si no tiene → `regular_price * pax` (pago completo).
#### Mejoras UX aplicadas en sesión 5 mayo
- [x] **Reglas universales backend** (Bot v75/v81): 7 reglas multi-tenant (#21-27) — pax_count, persistencia, orden cierre, anti-vague, resumen final. Cualquier tenant nuevo hereda automáticamente sin tocar su prompt.
- [x] **clear_pax_data() post-pago** (Bot v85): borra `pax_confirmed`, `last_service_slug`, `customer_name`, `flow_state` tras Payment Link enviado. Evita herencia entre flows del mismo cliente. ✅
- [x] **Memoria limpiada**: `ConversationMemory` JMC pasó de 222 a 26 entradas (borradas 196 entradas con hit_count<2 + 5 entradas basura como nombres propios y botones).
- [x] **save_session ahora hace MERGE** (Bot v78): refactor profundo de la función central de sesión. Ningún campo se pierde por put_item destructivo.
- [x] **Frontend `a131081`**: fix Embedded Signup `extras: sessionInfoVersion: 3` (era `version: 'v4'` que rompía Meta).
- [x] **Frontend `4fdd667`**: config_id Embedded Signup restaurado tras fix en Meta Business.
- [x] **Carrusel JMC 10 cards APPROVED**: template `catalogo_escuela_de_tiro_jmc_10cards` aprobado por Meta y enviándose al cliente. Multi-tenant via `config_pro.carousel_template_name` + `carousel_card_count`.
- [x] **API v86-v88 (carrusel multi-tenant fix)**: 3 fixes encadenados — endpoint `/uploads` usa `META_APP_ID` (no waba_id), body con ratio palabras/vars válido (Meta error 2388293), sin saltos de línea (Meta error 2388245).
### 8 mayo 2026 (madrugada) — Cleanup carrusel multi-tenant + WABA env var post-migración 🦁
> Sesión corta ~1h. Auditoría reveló que el carrusel se rompió tras onboarding pilot multi-carousel. 4 deploys separados (Regla #5).
#### Bug #35 (CRÍTICO 🔴) — `enviar_catalogo_carrusel` duplicada regresó (Bug #25 reincidencia)
- **Síntoma**: carrusel JMC no salía. `_get_best_carousel_template` devolvía el template correcto (10 cards APPROVED), pero el payload usaba `catalogo_servicios_v2` (5 cards hardcoded).
- **Causa**: al agregar kwargs `dynamic_token`/`dynamic_phone_id` a call sites, alguien duplicó `enviar_catalogo_carrusel` (línea 2149) en vez de modificar la original (línea 1088). La duplicada hardcodeaba `tpl_name = "catalogo_servicios_v2"`. Python usa la última definida → `_get_best_carousel_template` quedó muerto.
- **Fix**: Bot v117 borró la duplicada (139 líneas). La "buena" en línea 1088 delega a `_enviar_catalogo_template_carousel` con multi-carousel awareness.
- **Lección 28**: **Bug #25 regresó exactamente igual que la 1ra vez**. Agregar hook pre-commit: `grep -c "^def NOMBRE"` antes de cada deploy.
#### Bug #35.1 (BLOQUEANTE) — Kwargs rotos tras borrar duplicada
- **Síntoma**: al borrar la duplicada, call sites llamaban `enviar_catalogo_carrusel(..., dynamic_token=..., dynamic_phone_id=...)` pero la "buena" no aceptaba esos kwargs → `TypeError: got an unexpected keyword argument 'dynamic_token'`.
- **Fix**: Bot v118 agregó los kwargs a la firma.
- **Lección 29**: borrar código duplicado es más riesgoso de lo que parece. Plan correcto: 1) agregar kwargs a la buena; 2) py_compile + tests; 3) borrar la mala. No al revés.
#### Bug #36 (MULTI-TENANT 🟥) — `_media_id_cache` global cross-tenant
- **Síntoma**: silente. Cache de media_ids subidos a Meta estaba keyed solo por `image_url`. Los media_ids están atados al `phone_number_id` que hizo el upload. Tenant A sube imagen → cachea media_id. Tenant B con misma URL (S3 default) intentaría enviar template con media_id de A → Meta rechaza.
- **Fix**: Bot v119 cambió la key a `(image_url, phone_id)`. Multi-tenant safe.
- **Lección 30**: cualquier cache que guarde un ID emitido por API externa (Meta, Stripe, etc.) debe estar keyed por el contexto del emisor, no solo por el input.
#### Bug #37 (OPERACIONAL 🟠) — Env var `PHONE_NUMBER_ID` quedó en WABA viejo tras migración
- **Síntoma**: tras Bot v119 multi-tenant OK, seguía fallando `Meta media upload failed: Object with ID '1048898704969876' does not exist`. El config_pro de JMC tenía el phone nuevo (`1050792924791062`), pero el código caía al fallback `PHONE_NUMBER_ID` env var.
- **Causa**: migración WABA del 6 mayo actualizó `config_pro` pero NUNCA tocó la env var del Lambda. El fallback default apuntaba al phone viejo durante 2 días sin que nadie lo notara (carrusel era el único feature que lo usaba en runtime).
- **Fix**: Bot v120 — env var `PHONE_NUMBER_ID=1050792924791062`. Multi-tenant code de v119 sigue válido — esto solo arregla el fallback default.
- **Lección 31**: tras migración de WABA (o cualquier integración externa con ID), auditar TODAS las env vars de TODAS las Lambdas. Las que apuntan al valor viejo siguen "funcionando" hasta que necesitan operación privilegiada (upload, template lookup) y revientan.
### 8 mayo 2026 (tarde-noche) — Memoria source-aware + 6 bugs CRM masivos 🦁
> Sesión ~3h. Empezamos con memoria source-aware (hito 88→90% checklist), terminamos cerrando 6 bugs CRM/Reportes que llevaban semanas latentes (Bug #9 reincidió x2). 8 deploys (Bot v136 + API v117-v122 + promote-cron v2). 615 entries de memoria limpiadas (97 CM + 518 candidatos).
#### Memoria source-aware (Bot v136 + promote-cron v2)
- [x] **Bot v136 — `_detect_msg_source`**: detecta contexto del mensaje (`catalog_button`/`ad_greeting`/`conversational`) basado en prefijos de botones (svc_/info_/btn_/book_/cc_/date_/time_) y `source_first_campaign_id` en sesión.
- [x] **`search_memory` cascada 3 niveles**: 1) `q#source` exacto → 2) `q#conversational` fallback → 3) `q` legacy (items viejos sin `#source`). Backward-compat total.
- [x] **`register_candidate` guarda `last_ai_answer`**: bug fantasma cerrado. Antes el cron promote escribía `answer=""` porque el bot nunca guardaba la respuesta de Gemini al candidato. Ahora sí.
- [x] **Memoria APRENDIDA con SK `#source`**: bloque inline de auto-aprendizaje (línea 5134+) usa `_mk_sk(normalized, source)` + escribe `"source": f"gemini:{source}"`.
- [x] **promote-cron v2 — `SOURCE_THRESHOLDS`**: human_agent=2 hits, resto=3 hits. Respuestas humanas se promueven más rápido.
- [x] **Fix latente**: promote-cron tenía `os.environ` sin `import os` → `NameError` si se ejecutaba. Arreglado en mismo deploy.
- [x] **Cron promote preserva source**: SK incluye `#source` original. Valores `auto_promoted:gemini:conversational`, `auto_promoted:human_agent`, etc.
- [x] **Cleanup masivo**: 97 entries ConversationMemory JMC borradas (PII, mid-flow, single words, respuestas del bot cacheadas como preguntas) + 518 candidatos viejos sin `#source`. Backup en S3 `clientes-bot-backups-235565749479/pre-clean/`. JMC aprende desde cero con SK source-aware.
#### Bug #38 (CRÍTICO 🔴) — handle_import_leads sin contact_id (Bug #9 REINCIDENCIA)
- **Síntoma**: asesor no podía agregar leads desde CRM. `ValidationException — Missing the key contact_id`. 2 leads perdidos antes del fix (3226152560 Johanna Ximena, 3104209902).
- **Causa**: `item_data` solo tenía `phoneNumber`. PK `Leads_CRM_v2` es `contact_id`. **Bug #9 reincidió** desde migración multicanal 29 abril.
- **Fix**: API v117 — agregar `contact_id` + `channel="whatsapp"`.
- **Lección 32**: Bug #9 regresa cada vez que se edita un endpoint sin saber de la migración. Necesario hook pre-commit que grep `put_item.*Leads_CRM` + verificar `contact_id`.
#### Bug #39 (UX 🟡) — Leads creados por agente quedan huérfanos
- **Síntoma**: asesor crea lead → se guarda → asesor NO lo ve (filtro `assigned_agent_id` lo oculta).
- **Fix**: API v118 — si `agent_role=="agent"` y hay `agent_id`, auto-asigna `assigned_agent_id` al creador.
#### Bug #40 (CRÍTICO 🔴) — ARIA create_lead sin contact_id (Bug #9 3ra REINCIDENCIA)
- **Síntoma**: silente. "ARIA crea un lead para el 3001234567" → explota con mismo `ValidationException`. Nadie lo notó porque ARIA no muestra errores al usuario.
- **Causa**: `_execute_agent_action` action=`create_lead` (línea 5849) solo tenía `phoneNumber` en lead_data.
- **Fix**: API v119 — agregar `contact_id` + `channel` + preservar campos PK en filtro `_required`.
- **Lección 33**: cuando un bug reincide 3 veces en endpoints distintos, no es bug — es deuda arquitectónica. **Auditoría obligatoria** de TODOS los `put_item` a `Leads_CRM_v2` cada vez que se toca endpoint nuevo.
#### Bug #41 (UX 🟡) — Chulito "pagado" sobreescrito a "nuevo"
- **Síntoma**: lead creado con ☑️ "pagado" → `is_buyer=true` OK pero `lead_stage="nuevo"` ❌. Aparecía como nuevo en dashboard.
- **Causa**: bloque "Crear nuevo" (`else:`) sobreescribía `lead_stage="nuevo"` ciegamente después que chulito ya había puesto `cerrado_ganado`.
- **Fix**: API v120 — guardar default solo si `not item_data.get("is_buyer")`.
#### Bug #42 (CRÍTICO 🔴) — Pagos manuales no aparecen en /analytics
- **Síntoma**: asesor marca lead pagado via CRM → `is_buyer=true` en `Leads_CRM_v2` pero **NADA** en `StudentPaymentState`. `/analytics` mostraba `paid_count=0` y `total_revenue=0` con 80+ compradores reales.
- **Causa**: `handle_import_leads` solo escribía a `Leads_CRM_v2`. `/analytics` lee revenue de `StudentPaymentState` (otra tabla). Sin escritura cruzada → reportes mienten.
- **Fix**: API v120 — cuando `is_buyer=true` en lead nuevo, también persistir registro en `StudentPaymentState` con `status="PAGADO"` + amount + service.
- **Lección 34**: cuando hay 2 fuentes de verdad para un mismo dato (CRM + Payments), TODA escritura debe tocar AMBAS tablas. Sino los reportes mienten silenciosamente.
#### Bug #43 (UX 🟡) — bulk-import-purchases con lead_stage="CLIENTE" + sin is_buyer
- **Síntoma**: tras subir plantilla v2 ventas, leads importados NO aparecían en filtro "compradores" del CRM (lead_stage=cerrado_ganado o is_buyer=true).
- **Causa**: `update_item` ponía `lead_stage="CLIENTE"` (no `cerrado_ganado`) y NO marcaba `is_buyer=true`. Tampoco seteaba `phoneNumber`+`channel` (PKs requeridas si lead no existía).
- **Fix**: API v121 — update_item ahora setea `phoneNumber` + `channel="whatsapp"` (con `if_not_exists`) + `lead_stage="cerrado_ganado"` + `lead_status="CERRADO GANADO"` + `is_buyer=true` + `import_source`.
#### Bug #44 (CRÍTICO 🔴) — bulk-import-purchases SIN created_at → GSI no indexa
- **Síntoma**: 12 leads importados con `imported: 12, errors: 0` ✅ pero al hacer query GSI `company_id-index` aparecían 0 nuevos. Reportes seguían vacíos.
- **Causa**: GSI `company_id-index` de `StudentPaymentState` tiene **`created_at` como Sort Key**. DDB no indexa items que no tengan el SK del GSI. El `put_item` original no incluía `created_at` → 12 items huérfanos no indexados.
- **Diagnóstico clave**: `scan` completo mostraba 112 items con company_id=JMC, pero `query` GSI solo 17. Diferencia = los 12 nuevos + huérfanos viejos.
- **Fix**: API v122 — agregar `"created_at": event_time or _now_ts` + `paid_at` al `put_item`. Re-subir plantilla → puts sobreescriben items huérfanos con SK correcto → entran al GSI. Resultado verificado: `paid_count=83`, `total_revenue=$23,380,000 COP`.
- **Lección 35**: tras crear/modificar GSI, validar que TODOS los `put_item` y `update_item` incluyan los atributos definidos en KeySchema. Sin SK del GSI = item huérfano silente. Auditar describe-table → KeySchema antes de tocar puts.
### 9 mayo 2026 (tarde) — Sprint D Feature Flags + Bug #46 race handoff humano 🦁
> Sesión ~6h. Sprint D Fase Feature Overrides multi-tenant cerrado al 100% (5 deploys API + 1 commit frontend). Bug #46 crítico: bot y agente respondiendo en paralelo → fix triple capa con defense-in-depth (4 deploys + 1 commit frontend).
#### Sprint D — Feature Flags multi-tenant (CERRADO 100% ✅)
- [x] **D-1** Catálogo `feature_catalog` en DDB con 14 features atómicas (Bot/Multicanal/CRM/Ads/Atribución/Branding) + endpoint público `GET /admin/feature-catalog` (API v134-v136) ✅
- [x] **D-2** `GET /admin/tenants/{id}/features` con cascada plan/override + estados resueltos (in_plan, effective, source) (API v136) ✅
- [x] **D-3** `PUT /admin/tenants/{id}/features` con 2FA TOTP obligatorio + reason 500 chars + expires_at opcional + audit_log + email Resend al owner (API v137) ✅
- [x] **D-3.5** `DELETE /admin/tenants/{id}/features?key=X` simétrico al PUT — borra override y vuelve a estado plan natural. UX completa set+delete para frontend (API v138) ✅
- [x] **D-5** Frontend `FeaturesTab.tsx` con toggle 3-estados + modal 2FA + selector expiración (Frontend `6f39cea`) ✅
- [~] **D-4** Cron expire overrides — skip (lo cerramos cuando se use `expires_at` real, infra ya soporta)
#### Bug #46 (CRÍTICO 🔴) — Bot y agente responden en paralelo (race condition)
- **Síntoma**: cliente pide humano → asesor responde desde dashboard → bot sigue respondiendo en paralelo a los mensajes del cliente. UX completamente rota.
- **Diagnóstico**: el frontend solo llama `/conversations/send` (manda WhatsApp), nunca `/conversations/takeover`. Bot sigue procesando porque `flow_state != PAUSED_FOR_HUMAN`.
- **Causa secundaria**: `update_session_context` (Bot línea 5140) hardcodea `"flow_state": "ACTIVE"` en cada mensaje del cliente, sobreescribiendo cualquier PAUSED que el agente haya seteado.
- **Causa terciaria**: race condition. Cliente escribe → bot empieza a procesar Gemini (5-10s) → agente hace takeover durante esos 5-10s → bot termina y guarda `_save_data` con `"ACTIVE"` pisando el PAUSED.
- **Fix triple capa**:
  - **API v139** (`handle_conversation_send_message`): auto-takeover automático al primer mensaje del agente. Marca `flow_state=PAUSED_FOR_HUMAN` + audit_log `CONVERSATION_AUTO_TAKEOVER`.
  - **API v139** (`handle_conversation_takeover`): agrega `audit_log` que faltaba.
  - **Bot v140 — Patch 1**: eliminar hardcode `"flow_state": "ACTIVE"` de `update_session_context` (no aporta nada, solo rompe).
  - **Bot v140 — Patch 2**: `save_session` con guard PAUSED_FOR_HUMAN. Si el existing en DDB está en PAUSED y el caller no manda `_force_flow_release`, mantiene PAUSED. Bloquea race condition donde el bot termina Gemini y va a pisar el takeover.
  - **Bot v140 — Patch 3**: `_is_session_paused_for_human()` helper que re-lee la sesión fresca + guard al inicio de `process_ai_response`. Si durante el procesamiento Gemini un agente tomó control, aborta antes de enviar.
- **Test E2E verificado**: 2 PAUSED_GUARDs en logs (bloqueo save + abort proceso) ✅
- **Lección 37**: Baseline drift en patches incrementales — antes de cada patch refrescar el `lambda_function.py` desde el código realmente desplegado (`aws lambda get-function`). No se puede confiar en `~/audit_api/` viejo cuando hay deploys intermedios.
- **Lección 38**: Race conditions en handoff humano son ineludibles cuando el procesamiento del bot dura segundos. Defense-in-depth con guards en 3 capas (save + process + helper de re-read fresco) blinda contra cualquier orden de eventos.
#### Bug #46.1 (UX 🟡) — Audit actor=tenant_id en vez de email del agente
- **Síntoma**: AuditLog mostraba `actor: "JMC"` (tenant_id) en lugar del email del agente que tomó control. Forensics rotos: imposible saber QUIÉN actuó.
- **Causa**: `handle_conversation_takeover` usaba `client_id` como actor. `client_id` es el `companyId` del tenant, no el agente.
- **Fix #1 (API v140)**: router pasa `agent_id` al handler. Handler usa `_actor = agent_id or body.get("agent_id", "") or client_id or "agent_unknown"`. takeover_by y audit_log usan ese actor.
- **Fix #2 (Frontend `5cafbe5`)**: `providers.tsx` interceptor global ahora siempre manda `x-agent-id`: si hay `agentId` lo manda, sino el `email` del owner. Antes el header solo se enviaba si `u.agentId` existía → owners siempre caían a `agent_unknown`.
- **Test E2E verificado**: audit muestra `actor: "juancmartinezg0827@gmail.com"` ✅
- **Lección 39**: en multi-rol (owner/admin/agent), el "actor" para audit debe ser el **email** (estable + único por persona), no el `companyId` (compartido) ni el `agentId` (puede ser null en owners). Todo endpoint que loguee debe pasar `agent_id` desde el header `x-agent-id` y usar email como fallback.
### 10-11 mayo 2026 — Sesión maratón ~20h: Fase D+E completas + Bug #46 race handoff + Bug #48-49 Wompi + Flow scheduling WABA nuevo 🦁
> Sesión épica. Cerró Fase D (Feature Flags) + Fase E (Impersonate completo con consentimiento) + descubrió y arregló 3 bugs críticos de pagos Wompi + migró Scheduling Flow al WABA nuevo + investigó a fondo bug IG/FB (pendiente App Review Meta).
#### Fase D — Feature Flags (CERRADO ✅)
- [x] D-1 a D-5 + D-3.5 DELETE override (API v134-v138, Frontend `6f39cea`) ✅
#### Fase E — Impersonate (CERRADO ✅)
- [x] E-1 a E-13 completo (API v141-v147, Frontend 5 commits, tabla SupportRequests, EventBridge cron) ✅
#### Bug #46 (CRÍTICO 🔴) — Bot y agente responden en paralelo
- **Fix triple capa**: API v139 auto-takeover + Bot v140 guards PAUSED_FOR_HUMAN en save_session + process_ai_response ✅
#### Bug #46.1 (UX 🟡) — Audit actor=tenant_id
- **Fix**: API v140 takeover usa email real + Frontend `5cafbe5` interceptor x-agent-id global ✅
#### Bug #47 (BLOQUEANTE 🔴) — IG/FB no responde a usuarios externos
- **Diagnóstico**: App en Live, tokens correctos, scopes correctos. Meta API rechaza con "App does not have Advanced Access to instagram_manage_messages". Solo admin recibe respuestas.
- **Causa raíz**: `instagram_manage_messages` en Standard Access. Necesita App Review → Advanced Access.
- **Estado**: submission enviada a Meta, esperando review 3-7 días.
- **Workaround**: auto-respuesta nativa de IG redirigiendo a WhatsApp.
#### Bug #48 (CRÍTICO 🔴) — Wompi webhook ignorado ("WOMPI_OK" sin procesar)
- **Síntoma**: 2 clientes pagaron $280k c/u. Bot recibió webhook de Wompi, respondió 200 OK pero NO procesó el pago. Clientes pensaban que les robaron el dinero.
- **Causa**: línea 6524 del bot tenía `return {"statusCode": 200, "body": "WOMPI_OK"}` con comentario "no implementado aún" que cortocircuitaba el handler real.
- **Fix**: Bot v144 — eliminar return prematuro, dejar que `handle_payment_webhook(event, "wompi")` se ejecute ✅
#### Bug #49 (CRÍTICO 🔴) — Wompi reference no matchea
- **Síntoma**: Wompi manda `reference: "qy8DC6_1778464263_u8iaghAyN"` (ID interno del payment link) pero DDB tiene `ESCUELADE_1310_1778464243` (SKU que el bot mandó). El handler busca por reference → no encuentra → no procesa.
- **Fix**: Bot v145 — fallback: si reference no matchea, buscar por `customer_data.phone_number` del webhook → encontrar PENDING más reciente de ese teléfono ✅
#### Bug #49.1 (CRÍTICO 🔴) — PK equivocada en StudentPaymentState
- **Síntoma**: `Key={"contact_id": phone}` pero la tabla tiene PK `phoneNumber`.
- **Fix**: Bot v146 — cambiar a `Key={"phoneNumber": phone}` ✅
#### Scheduling Flow migrado al WABA nuevo
- [x] Flow `1623032778987375` creado en WABA `2891074877943438` con `data_api_version: "3.0"` ✅
- [x] RSA key pair generada + public key registrada en Meta (`signature_status: VALID`) ✅
- [x] Private key guardada en `config_pro.flows_private_key_b64` (DynamoDB, multi-tenant) ✅
- [x] Bot v149 lee key de config_pro en vez de env var ✅
- [x] Bot v150 detecta flow request por body (`encrypted_flow_data`) cuando path no tiene `/flows` ✅
- [x] Bot v151 responde con version "6.0" + key "dates" correcta ✅
- [ ] **Pendiente**: fix `_get_available_dates` (lunes aparece, no debería) + TIME_SCREEN no muestra horas + config `max_days_ahead` por tenant
#### Lecciones nuevas
37. **🔴 Baseline drift**: antes de cada patch, descargar Lambda desplegada. No confiar en `~/audit_*` viejo.
38. **🔴 Race conditions handoff**: defense-in-depth con guards en 3 capas (save + process + re-read fresco).
39. **🔴 Audit actor = email**: en multi-rol, el actor para audit debe ser email (estable), no companyId (compartido).
40. **🔴 Webhook payment links**: Wompi manda reference interna del payment link, NO el SKU del comercio. Siempre tener fallback por phone_number del customer_data.
41. **🔴 WhatsApp Flows migración WABA**: flows NO se migran entre WABAs. Hay que recrear flow + registrar RSA key + configurar endpoint_uri + health check ping.
42. **🔴 Flow version mismatch**: si el flow JSON es v6.0, TODAS las respuestas data_exchange deben tener `"version": "6.0"`. Mezclar 3.0/6.0 causa que Meta no inyecte datos dinámicos.
### 11 mayo 2026 (madrugada) — Sprint Scheduling Flow multi-tenant 🦁
> Sesión ~3h. Cerró 5 bugs del scheduling flow + dejó plan multi-tenant para UI de horarios. 2 deploys (Bot v152 + v153) + 1 fix de dato en DDB pendiente. Backup v151 guardado en `~/lambda_v151_backup.zip` por si rollback.
#### Bug #50 (CRÍTICO 🔴) — Scheduling Flow rompía multi-tenant con company_id=""
- **Síntoma**: TIME_SCREEN no mostraba horarios, lunes aparecía disponible, `${data.service_type_label}` se renderizaba literal. El bot funcionaba accidentalmente para JMC en versiones viejas porque `DEFAULT_COMPANY_ID="JMC"` estaba seteado por env var.
- **Causa raíz**: `_handle_scheduling_flow_exchange` (L3932) hardcodeaba `DEFAULT_COMPANY_ID` en 4 call sites (`get_services_catalog`, `_get_available_dates`, `_get_available_slots`, `get_config_pro`). Tras Bot v19 multi-tenant strict, `DEFAULT_COMPANY_ID=""` y todas las queries caían a empty string → `ValidationException: empty string key`. JMC funcionaba a medias solo porque el cache del catalogo era global y a veces tenía data residual.
- **Fix triple capa (Bot v152)**:
  - `_handle_scheduling_flow_exchange` ahora resuelve `company_id` desde `get_session(phone)` (que `_trigger_scheduling_flow` ya guarda en L3539). Fallback secundario: `StudentPaymentState.company_id`.
  - 4 call sites internos ahora reciben el `company_id` real (no más `DEFAULT_COMPANY_ID`).
  - `max_days_ahead` ahora se lee de `config_pro.scheduling.max_days_ahead` (default 7) → consultorios pueden configurar 30-90 días sin tocar código.
- **Verificación**: log `flow_exchange: phone=... company_id=JMC slug=... type=...` aparece en CloudWatch tras invoke de prueba ✅
- **Lección 43**: cuando un handler recibe un `phone` (token, callback, webhook) y necesita el `company_id`, NO usar `DEFAULT_COMPANY_ID`. Resolver SIEMPRE desde sesión o desde un item canónico (`StudentPaymentState`, `Leads_CRM_v2`). Multi-tenant strict no perdona shortcuts.
#### Bug #51 (CRÍTICO 🔴) — TIME_SCREEN muerto por keys de data mal nombradas
- **Síntoma**: cliente clickeaba "Agendar cita 📅" → DATE_SCREEN se renderizaba (con lunes erróneo) → seleccionaba fecha → TIME_SCREEN quedaba en blanco sin horarios.
- **Causa**: el flow JSON publicado en Meta (`1623032778987375`) esperaba keys `dates` (DATE_SCREEN) y `date_label`+`slots` (TIME_SCREEN), pero el bot enviaba `available_dates`, `selected_date_label`, `available_times`. Mismatch silencioso — Meta no renderiza componentes con `data-source` que no encuentra.
- **Diagnóstico clave**: descargar el flow JSON real desde `https://graph.facebook.com/v22.0/{FLOW_ID}/assets` y comparar keys vs lo que envía el bot. `data_api_version: "3.0"` + `version: "6.0"` es la combinación correcta — NO importa el `data_api_version` (sigue siendo 3.0 incluso si el flow es v6.0).
- **Fix (Bot v153)**: renombrar 2 keys del response del bot:
  - `"available_dates"` → `"dates"` (DATE_SCREEN)
  - `"selected_date_label"` → `"date_label"` + `"available_times"` → `"slots"` (TIME_SCREEN)
- **Lección 44**: tras publicar un WhatsApp Flow, SIEMPRE descargar el asset publicado y verificar las keys esperadas con `python3 -c "import json; ..."`. El compilador del flow no avisa si el bot manda nombres distintos — render queda vacío silente.
#### Bug #52 (LATENTE 🟡) — PK incorrecta en update_item de scheduling (Lección 40 reincidencia)
- **Síntoma**: silente. Tras agendar exitosamente, los campos `scheduled_date`, `scheduled_hour`, `schedule_status` nunca aparecían en `StudentPaymentState`. Reportes/analytics no podían mostrar tasa de agendamiento post-pago.
- **Causa**: 2 `payment_table.update_item` (L3712 y L4138) usaban `Key={"contact_id": phone}` pero la tabla tiene PK `phoneNumber`. DynamoDB no lanza error — el update simplemente no aplica.
- **Fix (Bot v152)**: cambiar a `Key={"phoneNumber": ...}` en ambos call sites.
- **Lección 40 reincidencia**: este es el 4to bug del estilo "PK incorrecta en update silencioso" del año. Necesario: auditoría automatizada que recorra todos los `update_item(Table=X, Key=Y)` y valide Y contra el KeySchema real.
#### Pendientes detectados (no bloquean — siguiente sprint)
- **2 `ValidationException` latentes en `handle_payment_webhook`** (L2904-3036): 2 call sites pasan `""` a `get_config_pro` o `get_services_catalog` antes de tener el item. No rompen el flow (try/except los traga) pero ensucian CloudWatch.
- **`Tipo: ${data.service_type_label}` renderizado literal en DATE_SCREEN**: el bot manda la key bien, pero Meta no la interpola en el `TextBody`. Workaround acordado: eliminar el `TextBody` del flow JSON publicado (no es necesario que aparezca tipo de servicio, el cliente ya sabe qué pagó).
- **Datos JMC sin `service.scheduling.time_slots`**: el código está bien escrito (lee `time_slots` del servicio), pero el servicio `seminario-tiro-pistola-9mm` no tiene el campo configurado → cae al rango completo de `business_hours` (9-17). Pendiente: agregar el dato a DDB + construir UI multi-tenant en `/dashboard/services` para que clientes configuren sus horarios sin tocar DDB.
### Próximo sprint: Scheduling UI multi-tenant
- **API SaaS_API_Handler**: whitelist `service.scheduling.time_slots`, `duration_hours`, `max_days_ahead` en `handle_add_service` + `handle_update_service`.
- **Frontend `/dashboard/services`**: bloque colapsable "⚙️ Agendamiento avanzado" en el modal de servicio con multi-checkbox 8AM-8PM + select duración + input max_days_ahead. Default `[]` = usa business_hours del config_pro.
- **Bot**: extender `_handle_scheduling_flow_exchange` para leer `max_days_ahead` del servicio individual (override sobre config_pro global) — citas a 3 meses para consultorios.
- **DatePicker nativo**: investigar componente WhatsApp Flows v5.0+ para reemplazar `RadioButtonsGroup` (limite 30 items). Necesario para consultorios que agendan hasta 90 días adelante.
#### Lecciones nuevas (sesión 11 mayo madrugada)
43. **🔴 Multi-tenant strict no perdona shortcuts**: cuando un handler recibe un `phone`/token/callback y necesita el `company_id`, NO usar `DEFAULT_COMPANY_ID`. Resolver SIEMPRE desde sesión activa o desde item canónico (`StudentPaymentState`, `Leads_CRM_v2`). Si `DEFAULT_COMPANY_ID=""` strict, cualquier shortcut explota con `ValidationException` silente.
44. **🔴 WhatsApp Flows keys del data**: tras publicar un flow, descargar el asset con `GET /flows/{id}/assets` y verificar las keys que cada screen espera en su `data`. Si el bot manda nombres distintos, Meta renderiza el componente vacío sin error. Crear hook pre-deploy: validar que toda response del flow_exchange mande las keys del flow JSON publicado.
45. **🟡 Lección 40 sigue reincidiendo (4ta vez)**: PK incorrecta en `update_item` silente. Necesario crear job de auditoría que recorra el código buscando `Table("X").update_item(Key={...})` y valide contra el KeySchema real de cada tabla.
46. **🔴 Baseline drift confirmado (Lección 37)**: `~/audit_bot/lambda_function.py` estaba 2.6KB más viejo que la versión desplegada (`_is_session_paused_for_human` faltaba). SIEMPRE descargar el paquete con `aws lambda get-function --query Code.Location | xargs curl` antes de parchar. Nunca confiar en carpetas locales viejas.
47. **🦁 Filosofía multi-tenant en datos de cliente**: si necesitás corregir un dato puntual de un tenant (ej: agregar `time_slots` a un servicio), preguntate ANTES "¿esto debería ser editable desde la UI del cliente?". Si la respuesta es sí → construir la UI en vez de hacer el update DDB a mano. El update DDB es deuda técnica disfrazada de solución rápida — cada update manual te ata como dueño-soporte y rompe el modelo SaaS escalable. Filosofía león: si no escala a 1000 clientes, no lo hagas a 1.
---
## 🧬 PRÓXIMO SPRINT — Brand DNA + Wizard 2.0 + BrandAssets + Wizard Packs
> **Estado:** PENDIENTE (planificado 12 mayo 2026, ejecución pendiente)
> **Tiempo estimado:** ~17h en 5 sesiones atómicas
> **Filosofía:** Wizard de ads de hoy es básico y apretado. Cliente entrega URLs/fotos, IA genera todo según fórmula Andromeda Meta 2026 (emoción + tensión + persona + autenticidad), cliente revisa visualmente y lanza multi-canal.
### 🎯 Objetivo del módulo
Transformar el wizard de Ads actual (5 pasos, 1 imagen genérica) en un **wizard guiado de 8 pasos** que:
1. Analiza la marca del cliente con IA (scraping de su web + IG/FB + competencia)
2. Genera **Brand DNA persistente** (voz, tono, audiencia, dolores, propuesta de valor, social proof legal)
3. Permite seleccionar referencias visuales reales (productos, lugares, equipo) desde **Brand Assets Library**
4. Genera **10 imágenes 512px en paralelo** con prompt Andromeda (cliente elige las que más le gustan)
5. **Upgrade 3 imágenes finales a 1024px** con thinking=high
6. Genera **3-5 variantes de texto** con social proof legal anonimizado
7. Publica multi-canal (FB Ads + IG Ads + WhatsApp CTW) en una sola pantalla de review
8. Quotas por plan con compra de packs adicionales (mismo patrón que Message Packs)
### 📐 Arquitectura técnica
#### Modelo de IA único: `gemini-3.1-flash-image-preview` (Nano Banana 2)
- **Por qué este y no Replicate/Flux:** mismo billing Google ya activo, soporta 0.5K (512px barato $0.045/img), aspect ratios 9:16+16:9+1:1 nativos, hasta 14 imágenes de referencia (productos+personas), thinking mode controlado (minimal/high), marca de agua SynthID legal automática para Meta Ads policies.
- **Costos por wizard:**
  - **Sin refs (servicios genéricos):** 10×$0.045 preview + 3×$0.067 final = **$0.65 USD** (~$2,700 COP)
  - **Con refs (producto/lugar real):** stage 1 master con refs ($0.221) + 9 variantes editando master ($0.41) + 3 finales 1K ($0.20) = **$0.83 USD** (~$3,500 COP)
- **Env vars planificadas:** `IMAGE_MODEL_PREVIEW`, `IMAGE_MODEL_FINAL`, `IMAGE_RESOLUTION_PREVIEW=512`, `IMAGE_RESOLUTION_FINAL=1K`, `IMAGE_THINKING_PREVIEW=minimal`, `IMAGE_THINKING_FINAL=high` (todo configurable sin redeploy).
- **Cuando salga Nano Banana 3 o modelo mejor:** cambiar 1 env var. Cero refactor.
#### Modelo dual canales — preparado para TikTok + Google sin refactor
- **Hoy:** FB Ads + IG Ads + WhatsApp CTW (los 3 corren sobre Meta API ya integrada)
- **Mañana (Sprint 7):** agregar 1 archivo `tiktok_scraper.py` + setear `coming_soon: false` en el catálogo
- **Helper `_scrape_source(source_type, url)` con dispatcher pattern:** cada source es módulo independiente. Wizard step "Canales" lee de array `available_channels` con flag `coming_soon` (visible disabled hasta integrar).
### 📅 Roadmap de 5 sprints atómicos
#### **Sprint A — Brand DNA (~3h)** 🧬
- Tabla `BrandDNA` (PK `company_id`, TTL 90d, PITR)
- Helper `_scrape_source(source_type, url)` con dispatcher pattern:
  - `_scrape_website(url)` ← reusa `/scrape` existente
  - `_scrape_instagram(ig_token)` ← Graph API (requiere conexión Embedded Signup)
  - `_scrape_facebook(fb_token)` ← Graph API
  - `_scrape_competitor(url)` ← scraping HTML público (Puppeteer skip por timeout Lambda — usar `urllib3` + BeautifulSoup)
  - `_scrape_tiktok(url)` ← stub `NotImplementedError` con flag `coming_soon=true`
- Endpoints:
  - `POST /brand-dna/generate` → orquesta scraping multi-source + Gemini análisis profundo + persiste
  - `GET /brand-dna` → lee del cache (90d)
  - `POST /brand-dna/regenerate` → cooldown 15d obligatorio (anti-abuso)
- UI en `/dashboard/settings`:
  - Card "🧬 ADN de mi marca" con botón "Generar"
  - Modal de inputs: URL website, URL competidor 1, URL competidor 2 (opcionales)
  - Visualización del resultado con secciones colapsables: Voz/Tono, Audiencia, Dolores, Propuesta de Valor, Social Proof Legal, Insights de Competencia
  - Botón "🔄 Regenerar" con countdown si está en cooldown
**Output estructurado del Brand DNA:**
```json
{
  "voice": "profesional, cálida, con autoridad técnica",
  "tone": "directo pero amable",
  "target_audience": {
    "demographics": "...",
    "psychographics": "...",
    "pain_points": ["...", "..."]
  },
  "value_propositions": ["..."],
  "legal_social_proof": [
    "+1,000 colombianos eligen formarse en seguridad personal",
    "+500 personas capacitadas confirman que vale cada minuto",
    "El 80% de quienes se forman recomendarían el curso"
  ],
  "competitor_insights": ["..."],
  "sources_used": ["website", "instagram", "competitor_url_1"],
  "generated_at": ts,
  "expires_at": ts + 90d,
  "regenerate_available_at": ts + 15d
}
```
#### **Sprint A.5 — Brand Assets Library (~3h)** 📚
- Tabla `BrandAssets` (PK `company_id`, SK `asset_id`, GSI `asset_type-index`, TTL 365d, PITR)
- Schema: `asset_type` (product/location/team/logo) + `name` + `s3_url` + `thumbnail_url` (256x256 Pillow) + `tags` + `usage_count` + `uploaded_at`
- Endpoints: `POST /brand-assets/upload-url`, `POST /brand-assets`, `GET /brand-assets?type=X`, `DELETE /brand-assets/{id}`, `PUT /brand-assets/{id}`
- UI en `/dashboard/settings`: sección "📚 Biblioteca de imágenes de marca" con drag&drop + 4 grupos
- "Identidad Visual" evoluciona a 3 sub-secciones: 📝 Descripción textual + 📚 Biblioteca + 🧬 Brand DNA
#### **Sprint B — Wizard 2.0 Backend (~4h)** 🤖
- Catálogo `WIZARD_PACKS` en DDB (mismo patrón Message Packs)
- `TenantQuotas` con campo `wizards_used` nuevo
- Helpers: `consume_pack_wizard()`, `add_pack_wizards()`, `_generate_image_async()`, `_brand_dna_to_image_prompt()`
- Endpoints: `POST /ads/wizard/check-quota`, `/generate-strategy`, `/generate-images-preview` (10×512px), `/generate-images-final` (3×1K), `/generate-copies`, `/launch`
- Billing: `GET /billing/packs/wizards` + `POST /billing/packs/wizards/checkout`
- Quotas: Starter 5/mes, Pro 20/mes, Agency 50/mes, Enterprise ilimitado
#### **Sprint C — Wizard 2.0 Frontend (~5h)** 🎨
- Nueva página `/dashboard/ads/wizard` full-screen con 8 pasos
- Indicador cuota arriba: `🎨 3/5 wizards usados este mes`
- 8 pasos: Brand DNA check → Estrategia → Canales (TikTok+Google "Próximamente") → Idioma → Producto+Beneficios → Referencias visuales → Grid 10 imágenes → Textos persuasivos
- Pantalla final: preview Meta Ad 3 formatos + botón "🚀 Lanzar multi-canal"
#### **Sprint D — Andromeda Overlay + 3 formatos auto (~2h)** ✨
- Helper `_overlay_text_on_image()` con Gemini editing nativo
- Auto-generación 3 formatos (1:1, 9:16, 16:9) al publicar
- Integración con Motor 4 del AI Creative Loop
- Texto sobreimpuesto bottom-left, máx 4 palabras, safe-zone Meta
### 💰 Pricing — NO se cobra por wizard al cliente (incluido en plan)
| Plan | Wizards/mes | Costo backend máx | Margen |
|---|---|---|---|
| Starter $97 | 5 | $4.15 | 95.7% ✅ |
| Pro $297 | 20 | $16.60 | 94.4% ✅ |
| Agency $497 | 50 | $41.50 | 91.6% ✅ |
| Enterprise | Ilimitado | depende uso | configurable |
**Packs adicionales (one-time, no expiran):**
| Pack | Wizards | Precio | Descuento |
|---|---|---|---|
| S | 10 | $19 | 0% |
| M ⭐ | 50 | $79 | 17% |
| L 💎 | 200 | $249 | 35% |
### 🔑 12 Decisiones críticas (NO replantear)
1. Scraping: website + IG/FB conectado + URL competencia
2. Modelo IA único: `gemini-3.1-flash-image-preview`
3. Wizard: nueva página `/dashboard/ads/wizard` full-screen
4. Brand DNA: cache 90d + cooldown 15d
5. TikTok+Google Ads: arquitectura preparada con `coming_soon`, Sprint 7
6. Social proof: técnica "vague specificity" legal
7. BrandAssets persistente: una vez subido, reusable N veces
8. $0.83/wizard peor caso: margen 91.6%, no se cobra extra
9. Opción genérica para servicios sin producto: SÍ con warning UX
10. Orden: A → A.5 → B → C → D
11. "Identidad Visual" actual: EVOLUCIONA, no se elimina
12. Wizards incluidos en plan + packs (mismo modelo Message Packs)
### ⚙️ Env vars planificadas
`IMAGE_MODEL_PREVIEW`, `IMAGE_MODEL_FINAL`, `IMAGE_RESOLUTION_PREVIEW=512`, `IMAGE_RESOLUTION_FINAL=1K`, `IMAGE_THINKING_PREVIEW=minimal`, `IMAGE_THINKING_FINAL=high`, `BRAND_DNA_TTL_DAYS=90`, `BRAND_DNA_REGENERATE_COOLDOWN_DAYS=15`, `WIZARD_MAX_REFS=5`, `GOOGLE_SPENDING_CAP_MONTHLY=300`
### 🛡️ Pre-requisitos antes de Sprint B
1. Subir spending cap Google Cloud a $300/mes + alertas 50/75/90% (Lección Bug #14)
2. Crear 3 productos Wizard Packs en Lemon Squeezy (S/M/L) + variant_ids en DDB
3. NO necesitas Replicate — todo Google Gemini
#### Bugs cerrados
##### Bug #53 (CRÍTICO 🔴) — TIME_SCREEN flow v6.0: `screen` leído del lugar equivocado
- **Síntoma**: TIME_SCREEN no renderizaba — flow mostraba "Se produjo un error". Logs mostraban Duration 187ms (handler cayó al fallback genérico).
- **Causa**: `_handle_scheduling_flow_exchange` leía `from_screen = payload.get("screen")` (adentro de `data`), pero v6.0 manda `screen` al nivel raíz del request descifrado.
- **Fix (Bot v155)**: `from_screen = decrypted_data.get("screen", "") or payload.get("screen", "")` + log debug `flow_exchange data_exchange: from_screen=..., payload_keys=...`
- **Lección 48**: en cualquier integración con payload anidado (Flows, webhooks Stripe, etc), loguear `payload_keys` en debug ayuda a cazar mismatches silenciosos al primer intento.
##### Bug #54 (CRÍTICO 🔴) — `selected_slot` vs `selected_time`
- **Síntoma**: tras fix Bug #53, TIME_SCREEN renderizaba pero seleccionar hora no completaba el flow. Bot dejaba typing infinito.
- **Causa**: el componente RadioButtonsGroup del flow JSON v6.0 se llama `selected_slot` (porque la key del data es `slots`), pero el bot buscaba `selected_time`. El log debug del Bug #53 lo reveló al instante: `payload_keys=['selected_slot']`.
- **Fix (Bot v156)**: rename `selected_time` → `selected_slot` (5 ocurrencias dentro de `_handle_scheduling_flow_exchange`).
- **Lección 49**: nombre del componente input == nombre del campo en el payload. Si la key del data se llama `slots`, el RadioButtons que la consume se llama `selected_slot`.
##### Bug #55 (CRÍTICO 🔴) — `time.sleep` síncrono rompía el flow ("no se pudo cargar")
- **Síntoma**: tras agregar 3 recordatorios post-agendamiento con `time.sleep(2.5)` entre cada uno (total 7.5s), Meta cortaba el data_exchange a los ~5s. Cliente veía "no se pudo cargar el contenido". PERO los 4 mensajes SÍ llegaban en cascada (encolados en WA).
- **Causa**: el handler del flow_exchange tarda > 5s → Meta corta conexión → response del SUCCESS_SCREEN nunca llega al cliente. Duration en logs: **10507ms**.
- **Fix (Bot v159)**: invocar el mismo Lambda en modo `InvocationType=Event` con `_internal_action=post_booking_messages` para que los recordatorios corran **en paralelo** sin bloquear la respuesta del flow. Handler async al inicio de `lambda_handler` procesa la acción interna.
- **Lección 50**: side-effects que tardan >2-3s tras un webhook con timeout deben ir SIEMPRE en async invoke (Event), no en el mismo proceso. Patrón reusable para todo post-pago/post-agendamiento/post-handoff.
##### Bug #56 (FALSA ALARMA 😅) — "scheduled_date no se guarda"
- **Síntoma**: tras agendar, `scheduled_date/hour/status` no aparecían en `StudentPaymentState`. Pánico inicial: "es la 5ta reincidencia de Lección 40".
- **Causa REAL**: el comando de testing `reset_payment.sh` hacía `REMOVE scheduled_date, scheduled_hour, schedule_status` justo antes del test. El bot SÍ los escribía correctamente cada vez — el reset los borraba después.
- **Fix**: ninguno (cero bug). El código siempre estuvo bien.
- **Lección 51**: cuando reincide un bug "ya cerrado 3 veces", VERIFICAR PRIMERO con un test sin el reset script antes de declarar regresión. La culpa del testing pipeline no es del código.
#### Features cerradas (en orden de deploy)
**Bot v154 — `max_days_ahead` con cascada svc→tenant→default**
- `_handle_scheduling_flow_exchange` lee primero `service.scheduling.max_days_ahead`, fallback `config_pro.scheduling.max_days_ahead`, default `7`.
- Cero impacto si no hay datos (backward-compatible).
- Log: `flow_exchange: max_days_ahead=X (svc=Y, tenant=Z)`.
**API v148 — `POST /scheduling-flow/setup` auto-onboarding multi-tenant 🦁**
- Endpoint nuevo: `handle_setup_scheduling_flow(client_id, body)`.
- Idempotente: si `config_pro.scheduling_flow_id` ya existe y está PUBLISHED en Meta, devuelve `already_existed: True`. `force_recreate=true` para regenerar.
- 3 llamadas a Meta Graph API: `POST /{waba_id}/flows` → `POST /{flow_id}/assets` (multipart con JSON CalendarPicker v7.3) → `POST /{flow_id}/publish`.
- Genera nombre del flow dinámico: `agendamiento_{brand_clean}_v7`.
- Guarda en `config_pro`: `scheduling_flow_id`, `scheduling_flow_name`, `scheduling_flow_status`, `scheduling_flow_version`.
- Usa `meta_access_token` del tenant + `scheduling_flow_endpoint_uri` configurable (default: env var `BOT_FLOWS_ENDPOINT`).
- **Resultado verificado**: flow `1526049892363825` creado en WABA `2891074877943438` con `validation_errors: []` y `status: PUBLISHED` ✅
- **Filosofía león**: cliente #2 a #1000 onboardea su flow con 1 POST. Cero trabajo manual del founder.
**Bot v157 — CalendarPicker v7.3 (Calendly mode)**
- `_handle_scheduling_flow_exchange` INIT response migrado de `dates` (array) → `min_date`+`max_date`+`unavailable_dates` (strings YYYY-MM-DD).
- Calcula `unavailable_dates` invirtiendo `_get_available_dates`: todos los días dentro del rango que NO están en la lista de disponibles → marcados como `unavailable`.
- Version bump 6.0 → 7.3 en 5 responses internas + 2 del wrapper handle_flows_data_exchange.
- `_trigger_scheduling_flow` lee `scheduling_flow_id` desde config_pro (multi-tenant), fallback env var legacy.
**Bot v158 — Recordatorios post-agendamiento + "Duración aproximada"**
- Tras "✅ ¡Cita agendada!", lee `config_pro.scheduling.post_booking_messages` (lista de strings) y envía cada uno con delay 2.5s.
- Si no hay lista configurada → envía cierre genérico "¿Hay algo más en lo que pueda ayudarte? 🙂" (apaga el typing huérfano).
- Cambio cosmetic: "Duración" → "Duración aproximada" (2 lugares) — refleja que ciertos servicios pueden variar.
**Bot v159 — Recordatorios async (no bloquean flow)**
- `lambda_client.invoke(FunctionName=..., InvocationType="Event", Payload={"_internal_action": "post_booking_messages", ...})` desde dentro del handler de TIME_SCREEN.
- Handler async al inicio de `lambda_handler` procesa `_internal_action=post_booking_messages`: lee tokens dinámicos del tenant, envía cada mensaje con `time.sleep(2.5)`.
- Lambda se invoca a sí mismo en background → response del flow vuelve a Meta en <2s → cliente ve SUCCESS limpio.
**Bot v161 — `available_weekdays` por servicio + fix `max_check`**
- `_get_available_dates` recibe `service_slug` opcional → lee `service.scheduling.available_weekdays` → filtra días que NO están en la lista.
- Si servicio tiene `available_weekdays=[5,6]` (sáb+dom), el calendario marca lun-vie como unavailable.
- Fix bug latente: `max_check = max(30, num_days * 2)` (antes hardcoded 30 → loop terminaba antes de tiempo con num_days=60).
- Call sites actualizados para pasar `service_slug=session.get("scheduling_service_slug")`.
**Bot v162 — `booking_mode` solapable/exclusive**
- `_get_available_slots` recibe `service_slug` opcional + lookup del servicio prioriza slug exacto (fallback a service_type).
- Si `service.scheduling.booking_mode == "exclusive"`: scan `StudentPaymentState` filtrando `company_id + service_slug + scheduled_date + schedule_status=AGENDADO` → recolecta `scheduled_hour` ocupados → suma al `busy_ranges`.
- **Per-service**: solo cuentan reservas del MISMO `service_slug` (Personalizado 9mm a las 14:00 NO bloquea Asesoría Individual a las 14:00 — son recursos distintos).
- Default `solapable`: comportamiento actual (varios clientes mismo slot).
**Frontend (4 commits)**
- `8f8775b`: campo `post_payment_message` + opción `send_group_link` en select "Después del pago"
- `a4c3172`: bloque "Días de la semana disponibles" (multi-checkbox L-D) + fix UI
- `fc069b1`: select `booking_mode` solapable/exclusive con hints multi-tenant
- (commit anterior 4b0d78c): bloque inicial "⚙️ Agendamiento avanzado" con `time_slots` (multi-checkbox 7AM-8PM) + `max_days_ahead` input
#### Configuración JMC desde la UI (cero DDB manual 🦁)
- `Seminario 9mm grupal`: `time_slots=[10,14]`, `max_days_ahead=30`, `booking_mode=solapable`, `post_payment_flow=scheduling`
- `Seminario Personalizado 9mm`: `time_slots=[9,13,16,17]`, `booking_mode=exclusive`, `post_payment_flow=scheduling`
- `Curso de Escolta`: `post_payment_flow=send_group_link` + mensaje con link grupo WhatsApp
- `Semillero Juvenil`: `post_payment_flow=thanks_only` (próximamente migrar a `send_group_link` con su propio grupo)
- `Resto de personalizados`: `booking_mode=exclusive` (configurar uno por uno desde UI)
- `config_pro.scheduling.max_days_ahead=60` (default global del negocio)
- `config_pro.scheduling.post_booking_messages`: 3 mensajes (recordatorios + ubicación + cierre)
#### Pendientes detectados (próximo sprint)
- 🟡 **Google Calendar Service Account multi-tenant**: `_get_google_calendar_service` falla con `empty string company_id` → cita se guarda en DDB pero NO crea evento en Calendar del dueño JMC. Workaround: dueño ve agenda desde dashboard `/dashboard/citas`. Fix similar al de Bug #50 (resolver company_id desde contexto).
- 🟡 **CAPI Schedule event**: 5 líneas pendientes, bonus al funnel Meta (`Lead → InitiateCheckout → Purchase → Schedule`). Útil multi-tenant (consultorios donde Schedule es la conversión clave, no Purchase).
- 🟡 **UI editable de `post_booking_messages`** en `/dashboard/settings` o `/dashboard/services` (hoy se setean en DDB).
- 🟡 **Auto-onboarding del carrusel** (mismo patrón que `/scheduling-flow/setup` → `/carousel/setup`).
- 🟡 **2 ValidationException latentes en `handle_payment_webhook`** (no bloquean, solo ensucian CloudWatch).
- 🟡 **DatePicker componente nativo Meta** (si existe en v7.x — alternativa más compacta al CalendarPicker).
#### Lecciones nuevas (sesión 11 mayo mañana-tarde)
48. **🔴 Debug payload anidado**: en cualquier integración con webhooks/flows, loguear `payload_keys=list(payload.keys())` la primera vez ahorra horas de adivinanza al primer mismatch.
49. **🔴 Nombre de input == nombre del payload**: en WhatsApp Flows, si la key del `data` se llama X, el componente input que la consume se llama `selected_X`. No `selected_X_time` ni variantes.
50. **🔴 Async invoke para side-effects post-webhook**: si tras responder a Meta/Stripe/etc necesitás disparar N mensajes con delays, NUNCA bloquear el response. Patrón: `lambda_client.invoke(InvocationType="Event", Payload={"_internal_action": "..."})` + handler al inicio del lambda_handler.
51. **🟠 Falsas alarmas del testing pipeline**: cuando reincide un bug "ya cerrado 3 veces", VERIFICAR PRIMERO sin el reset/cleanup script antes de declarar regresión. Lección 40 NO siempre es Lección 40.
52. **🦁 Auto-onboarding > update DDB manual**: si un tenant nuevo necesita un asset en Meta (flow, template, pixel, ad account), el endpoint que lo crea debe estar listo DESDE EL DÍA 1. Cada update manual al primer cliente JMC es una promesa rota de escalabilidad. Filosofía león: construir el endpoint la primera vez, no esperar al cliente #2.
53. **🔴 read_file siempre, asumir nunca**: cuarta vez en la sesión asumí (mal) el SHA o repo de un archivo. La herramienta `read_file` acepta cualquier SHA de cualquier repo del workspace. Costo de asumir: 5 min de ida y vuelta + sensación de no confianza del usuario. Costo de verificar: 2 segundos. SIEMPRE verificar.
### 12 mayo 2026 (madrugada-mañana) — Deuda técnica cerrada + Ads cache L1+L2 🦁
> Sesión ~4h post-Calendly. Cerró 3 deudas técnicas pendientes (CAPI Schedule + Google Calendar multi-tenant + ValidationException fix) + migró cache de Meta Ads API a DynamoDB L1+L2 (0 rate limits) + fix frontend tab sobreescritura métricas. Bot v163 + API v149 + 1 commit frontend.
#### Deuda técnica cerrada (Bot v163)
- [x] **CAPI Schedule event**: `send_meta_capi_event("Schedule")` disparado tras confirmar cita en flow_exchange. Cierra el funnel Meta completo: `Lead → InitiateCheckout → Purchase → Schedule`. Multi-tenant (usa company_id del contexto). ✅
- [x] **Google Calendar multi-tenant**: `_get_google_calendar_service(company_id)` y `create_calendar_event(..., company_id=...)` ahora reciben company_id como parámetro. Antes usaban `DEFAULT_COMPANY_ID=""` → `ValidationException` silente → evento nunca se creaba en Calendar del dueño. 2 callers actualizados. ✅
- [x] **ValidationException latente en handle_payment_webhook**: `get_config_pro(DEFAULT_COMPANY_ID)` se llamaba ANTES de tener el item del pago (que trae el company_id real). Fix: `if DEFAULT_COMPANY_ID else {}` + fallback a env vars legacy. No rompe nada, solo limpia CloudWatch. ✅
#### Ads dashboard cache L1+L2 DDB (API v149)
- [x] **`meta_cached_request` migrado a DynamoDB**: cache de 2 niveles — L1 memoria (instantáneo, se pierde en cold start) + L2 DynamoDB `KnowledgeBase[__META_CACHE__]` (persistente entre cold starts, TTL automático). Cuando Meta devuelve 429, devuelve cache expirado como fallback (nunca datos vacíos). Multi-tenant safe: cache_key incluye `company_id`. ✅
- [x] **`handle_ads_dashboard` cacheado**: 4 llamadas directas a Meta envueltas en `meta_cached_request` con cache keys por tenant+periodo+campaña. Dashboard carga **instantáneo** en segunda visita (0 llamadas a Meta). ✅
- [x] **Frontend fix tab sobreescritura**: cambiar tab "Mis campañas" ya NO recarga campañas sin métricas sobreescribiendo las buenas del `/ads/init`. Solo recarga si `campaigns.length === 0`. ✅
#### Lecciones nuevas
54. **🔴 Cache en memoria Lambda es inútil para dashboards**: el Lambda se apaga después de ~5 min de inactividad → cache en dict se pierde → siguiente visita golpea Meta de nuevo → rate limit. DynamoDB como L2 resuelve el problema porque persiste entre cold starts. Patrón reusable para cualquier API externa con rate limit.
55. **🔴 Frontend: setCampaigns sobreescribe métricas**: si un tab hace fetch a un endpoint que devuelve campañas SIN métricas y hace `setCampaigns(data)`, borra las métricas que ya estaban en el state del `/ads/init`. Guard: solo recargar si el state está vacío.
### 12 mayo 2026 (mañana) — Ads Pro v2 CERRADO 🎯 KILL_CREATIVE + Hook Generation E2E 🦁
> Sesión ~2h. Cerró el Sprint Ads Pro v2 completo con 3 bloques atómicos. Reusa motor B6.5 ya en producción (7 reglas → 8 reglas). Gemini Flash Lite cascada con fallback (Lección 19 aplicada). Cache en memoria 5min. Frontend con botón ✨ Variantes + modal copiable. 3 deploys API (v153/v154/v155) + 1 commit frontend (`92a3dcd`).
#### Bloque 1 — Regla #8 KILL_CREATIVE (API v153)
- [x] **Detecta creatives perdedores**: CTR<1% + ≥500 impresiones + CPL>2× avg de la campaña → recomienda pausar (NO auto-pausa, Lección Bug #2).
- [x] **Inyectada en `_b65_fetch_ad_creative_ranking`** justo después del sort (tiene cpl/ctr/impressions/spend por ad en scope).
- [x] **Anti-spam compound key**: `campaign_id#ad_id` en `_b65_already_dismissed_recently` para filtrar por anuncio individual, no por campaña entera.
- [x] **Justification numérica**: `{impressions, ctr_pct, cpl_cop, avg_cpl_campaign, threshold_ctr_pct=1.0, threshold_cpl_multiplier=2.0, spend_wasted_cop}` + confidence 85.
- [x] **JMC verificado**: 8 campañas con ranking, 0 KILL_CREATIVE generadas (creatives sanos 2.43-4.99% CTR). Regla funciona, no hay perdedores que matar. Cuando lances variantes, los cazará automáticamente.
#### Bloque 2 — `POST /ads/generate-hook-variants` (API v154 + fix v155)
- [x] **Endpoint nuevo**: recibe `{ad_id, creative_text, campaign_name}` → Gemini Flash Lite analiza patrón emocional → devuelve `{variants: [{hook, angle, pattern}], pattern, model, cached}`.
- [x] **Cache 5min en memoria**: dict `_hook_variants_cache[ad_id]` evita recomputar el mismo ganador. Segunda llamada al mismo `ad_id` retorna instantáneo con `cached: true`.
- [x] **Cascada de modelos** (Lección 19 aplicada): `gemini-2.5-flash-lite` (principal) → `gemini-flash-lite-latest` (fallback). 0% dependencia de un solo modelo.
- [x] **Quita acentos del input** (Lección 18 / Bug #29): `unicodedata.normalize("NFD")` antes de mandar a Gemini. Input sin tildes, output con tildes correctas.
- [x] **responseMimeType=application/json** + responseSchema implícito en prompt (estructura exacta esperada).
- [x] **Validación dura**: max 3 variantes, hook≤200 chars, angle≤100 chars. Si Gemini devuelve vacío, intenta fallback.
- [x] **Test JMC verificado**: creative "Cupos limitados" → patrón detectado "escasez" → 3 hooks con ángulos distintos (escasez directa / última oportunidad / call-to-action negativa).
- [x] **Bug v154→v155**: usaba `http.request` (no existe en API SaaS — solo en Bot). Fix: `urllib3.PoolManager` local `_hgv`.
#### Bloque 3 — Frontend botón ✨ Variantes + modal (`92a3dcd`)
- [x] **Botón "✨ Variantes" en el 🏆** del ranking de creatives — guard `idx === 0 && ad.ctr >= 2` (solo aparece en ganadores con CTR mínimo, sino no tiene sentido replicar un loser).
- [x] **Modal full-screen** con backdrop blur, header sticky, chip de patrón emocional, 3 cards de variantes con hook + angle + botón "📋 Copiar" individual.
- [x] **Feedback ✓ Copiado 2s** con `navigator.clipboard.writeText` + `setTimeout` reset.
- [x] **Loading state**: spinner morado + "Generando 3 variantes con IA..." durante ~3s.
- [x] **Toast cache**: "⚡ Variantes recuperadas del cache" cuando backend retorna `cached: true`.
- [x] **Tip educativo**: caja morada al final explicando cómo usar las variantes en Ads Manager (duplicar ganador, cambiar solo el hook, mantener imagen+audiencia para aislar el efecto).
#### Pendientes detectados (próximo sprint)
- 🟡 **Endpoint `POST /ads/duplicate-ad`**: publicar variante 1-click directo en Ads Manager (hoy el cliente copia/pega manualmente). Requiere Meta Graph API call para duplicar ad + reemplazar primary_text. Estimado 2-3h.
- 🟡 **Tracking de variantes**: tabla nueva `AdsHookVariants` para comparar CTR de la variante vs el ganador original a los 7 días. Cierra el AI Creative Loop.
- 🟡 **Multi-pattern detection**: hoy Gemini detecta UN patrón. Para ganadores muy buenos (CTR>4%) generar 3 hooks de 3 patrones distintos (escasez + curiosidad + prueba social) para diversificar.
#### Lecciones nuevas (sesión 12 mayo mañana)
56. **🔴 API SaaS no tiene `http` global**: cada handler que llama APIs externas crea su propio `urllib3.PoolManager()` local (`_han`, `_u3v`, `_hgv`, etc). Antes de copiar código de Gemini desde el Bot al API, verificar que el cliente HTTP existe en el handler destino. Costo del error v154: 1 deploy extra (v155) + ~3 min. Patrón seguro: `import urllib3 as _u3_LOCAL; _h = _u3_LOCAL.PoolManager()` al inicio del handler.
57. **🦁 Reusar motor antes que crear endpoint nuevo**: la Regla #8 KILL_CREATIVE se inyectó dentro de `_b65_fetch_ad_creative_ranking` (que ya tenía cpl/ctr/impressions en scope), no en un endpoint nuevo. Resultado: 0 frontend, 0 tablas nuevas, 0 router cambios. Si el motor B6.5 ya itera sobre ads y tiene los datos necesarios, agregar regla #N ahí mismo es el camino correcto. Filosofía león: ¿esto cabe dentro de algo que ya funciona?
58. **🟢 Detección temprana de "falsa alarma" en regla nueva**: tras deployar Regla #8 obtuvimos `total_recommendations: 0`. En vez de asumir bug, verificamos con scan al `creative_ranking` existente y confirmamos que NINGÚN ad cumple los 3 criterios duros. La regla está OK, JMC tiene creatives sanos. Patrón: al deployar regla nueva con 0 hits, validar con los datos reales antes de debug.
### 8-9 mayo 2026 (noche-madrugada) — Sprint 1 COMPLETO: Trial + Quotas + Billing E2E + Admin Editor 🦁
> Sesión maratón ~7h. Cerró Sprint 1 completo: trial 14d auto, quotas enforcement ON, billing E2E con Lemon Squeezy (test real con tarjeta), banner trial, email warning, cron expire, landing+dashboard dinámicos desde DDB, admin editor de planes con features_ui+tooltips. 30 deploys (Bot v137-v138 + API v123-v133 + 8 commits frontend).
#### Sprint 1 — Billing + Trial completado
- [x] **Trial 14d auto**: `handle_onboarding` crea Subscription con `status=trialing` + `trial_ends_at=now+14d` + `plan=starter` (API v123). Guard `owner_lifetime` para JMC (API v124). JMC backfill `enterprise_lifetime` manual.
- [x] **Cron `trial-expire-daily`**: EventBridge 8AM UTC. Scan GSI `status-index` → marca `trial_expired` en Subscription + `TRIAL_EXPIRED` en config_pro. Bot silencia (v138). Email final al expirar.
- [x] **Email warning trial**: pasada 2 del cron busca trials 1-3d antes de expirar → email Resend "te quedan X días" + antispam `trial_warning_sent_at` 23h (API v126).
- [x] **Banner trial dashboard**: layout.tsx lee `/billing/me` → banner azul/naranja/rojo según días restantes (Frontend `6fd482f`).
- [x] **QUOTA_ENFORCE=true**: Bot v137 bloquea con mensaje cordial + log_error. JMC enterprise (limit=-1) no afectado.
- [x] **Fix router `/billing/me`**: caía en `handle_get_me` genérico por `endswith("/me")`. Excluido `/billing` del match (API v127).
- [x] **Webhook sync `config_pro.plan`**: cuando LS notifica subscription_created/updated, actualiza `config_pro.plan` automáticamente. Antes `/billing/features` leía plan viejo (API v129).
- [x] **Test E2E REAL**: registro `mailadministrador@gmail.com` → onboarding "Servicios Profesionales" → trial auto → banner visible → pago Growth $297 con tarjeta test LS → webhook → status=active → plan=growth → quotas 25.000 msg ✅
- [x] **Cleanup**: 3 tenants prueba eliminados (CO_63A6F367, CO_979BE374, CO_9343055D) + tenant test CO_48B17BE3 post-test.
- [x] **LS trial quitado**: 6 variants en LS dashboard sin "Free trial" (evita 28d gratis).
#### Planes dinámicos — fuente única de verdad DDB
- [x] **Catálogo completo en DDB**: `KnowledgeBase[__PLATFORM__/plan_features]` con `features_ui[]` (label, included, tooltip_title, tooltip_desc), subtitle, btn_label, color_theme, popular flag, quotas, precios USD/COP/anual. Enterprise hidden_in_landing.
- [x] **Endpoint `/billing/plans-public`** (público, sin auth): devuelve catálogo enriquecido con variant_ids LS + trial_days (API v131).
- [x] **Landing dinámica**: `app/page.tsx` consume `/billing/plans-public` con fallback estático. Cards renderizadas desde API con tooltips (Frontend `d6433c9`).
- [x] **Dashboard billing dinámico**: `app/dashboard/billing/page.tsx` consume mismo endpoint. features_ui con tooltips compartidos. PLAN_ICONS/PLAN_COLORS renombrados starter/growth/agency (Frontend `5e5b6af`).
- [x] **Propagación instantánea confirmada**: cambio DDB "2,000→3,000 conversaciones" → visible en API en <5s sin redeploy. Revertido a 2,000.
- [x] **Plan features alineados con landing**: env var PLAN_FEATURES_JSON + DDB sincronizados (Starter 2000msg/500leads/2agents/0voz, Growth 10000/-1/5/100, Agency -1/-1/-1/500) (API v130).
#### Admin editor de planes
- [x] **GET/PUT `/admin/plan-features`** (super_admin only): lee/escribe catálogo completo DDB. Validación estructura (3 planes core + name + quotas + features_ui). Invalida cache. Audit log (API v132-v133).
- [x] **Frontend `/admin/plan-features`**: tabs por plan (starter/growth/agency/enterprise), form completo (nombre, subtitle, precios, quotas con -1=ilimitado, features_ui editables con ↑↓🗑️ + tooltip inline, flags popular/hidden, color theme, btn_label/type). Botón "Guardar todos los planes" (Frontend `b620208`).
- [x] **Sidebar admin**: link 💎 Planes agregado (Frontend `d672b95`).
#### Bug #45 (OPERACIONAL 🟠) — Router `/billing/me` caía en `/me` genérico
- **Síntoma**: `/billing/me` devolvía `{error: "email es requerido"}` → banner trial no aparecía.
- **Causa**: router `endswith("/me")` matcheaba antes que `/billing/me`. Faltaba exclusión.
- **Fix**: API v127 — agregar `and "/billing" not in path` al guard de `/me` genérico.
### Lecciones nuevas (sesión 8 mayo tarde-noche)
32. **🔴 Auditoría preventiva post-migración PK**: cuando reincide un bug 2+ veces (Bug #9 reincidió 3 veces), hacer `grep -r "put_item.*Leads_CRM"` automatizado y verificar todos incluyen `contact_id`. La deuda no se cura sola.
33. **🔴 GSI requirements obligatorios**: cualquier `put_item` o `update_item` debe incluir TODOS los atributos del KeySchema del GSI. Item sin SK del GSI = invisible para queries → reportes vacíos sin error.
34. **🔴 Doble fuente de verdad = doble escritura**: si CRM lee de tabla A pero Reportes lee de tabla B, TODA mutación debe tocar ambas. Si no, las dos pantallas muestran datos distintos.
35. **🔴 Auto-asignación leads a creador**: si filtro por rol oculta items, auto-asignar al creador. Sino el agente no ve lo que acaba de crear → frustración inmediata.
36. **🔴 Source-aware memory** (memoria contextual): mismo `normalized_q` puede tener respuestas distintas según contexto (chat libre vs botón vs CTW Ad). Cache key compuesta `(q, source)` con cascada de fallback es la solución correcta.
### Lecciones nuevas (sesión 5 mayo)
12. **🔴 GSI consistency post-disconnect**: tras cualquier disconnect/reconnect que toque GSI fields, validar con query antes de dar OK. DDB no garantiza propagación inmediata cuando el campo cambia múltiples veces rápido.
13. **🔴 flow_state liberation**: TODO handler que dispara acción terminal DEBE liberar `flow_state` antes de retornar. Olvidarlo = loop infinito.
14. **🔴 Multi-tenant cache**: TODO cache compartido en multi-tenant DEBE ser keyed por `company_id`. Audit obligatorio antes de cada deploy.
15. **🔴 Funciones duplicadas Python**: hacer grep por `def NOMBRE_FUNCION` antes de deploys grandes. Python usa la última definida sin avisar.
16. **🔴 NUNCA put_item destructivo**: si una función de save tiene 5+ call-sites con dicts diferentes, refactor a merge inmediatamente.
17. **🔴 Guards después de normalización**: validaciones siempre DESPUÉS de resolver el input a su forma canónica. Si el dato puede llegar en N formatos, normalizar antes de decidir.
18. **🔴 LLM responseSchema NO protege bugs internos**: tener fallback automático a otro modelo cuando el principal devuelve malformed es regla, no excepción.
19. **🔴 NUNCA depender de un solo modelo LLM**: wrapper con fallback (`gemini-2.5-flash-lite` → `gemini-flash-lite-latest`) es estándar para production.
20. **🔴 Datos críticos del flow en sesión, no en context window**: pax, customer_name, slug deben persistirse en DDB. Context LLM siempre truncado.
21. **🔴 Interceptors keyword-based con context-awareness**: "si/ok/dale" significan cosas distintas según `flow_state`. Si hay flow activo → no interpretar como confirmación de pago.
22. **🔴 Reglas universales en backend, no en prompt del cliente**: cualquier patrón de neuroventas o flow comercial común a TODOS los tenants va en `system_prompt` del backend. Cliente solo configura su tono y catálogo.
23. **🔴 cleanup post-acción terminal**: tras Payment Link / handoff humano / scheduling confirmado, limpiar SOLO los campos del flow (no toda la sesión). Mantiene history y profile, evita herencia.
### 1 mayo 2026 — Bot estable + UX fina (sesión maratón)
#### Bug #17 (CRÍTICO 🔴) — Float types en save_session multi-persona
- **Síntoma**: `trigger_payment_flow` explotaba con `Float types are not supported` al guardar `pax_unit_price` (float) en DynamoDB.
- **Impacto**: 12 clientes no recibieron link de pago durante ~40 min.
- **Fix**: convertir `unit_price` a `int()` (COP no usa decimales) — Bot v34 ✅
#### Bug #18 (ALTO 🟡) — Gemini JSON truncado / malformado
- **Síntoma**: `maxOutputTokens=800` causaba JSON cortado. Cliente recibía "dame un minuto" sin retorno.
- **Fix multi-capa**: `maxOutputTokens=1500` (v35) + `responseSchema` fuerza JSON válido (v38) + 3 capas de reparación + fallback suave (v41) ✅
- **Lección**: `responseSchema` de Gemini hace IMPOSIBLE devolver JSON inválido. Usarlo siempre.
#### Bug #19 (CRÍTICO 🔴) — "Sí" dispara pago en vez de catálogo + pago sin servicio detectado
- **Síntoma 1**: cliente pregunta "¿qué cursos ofrecen?" → bot responde "¿te gustaría conocerlos?" → cliente dice "Sí" → bot dispara pago en vez de carrusel.
- **Síntoma 2**: cliente habla DE pago ("pagaré el lunes") → bot interpreta intent=payment → dispara `trigger_payment_flow` con slug de sesión → "No encontré el servicio".
- **Fix 1**: interceptor "Sí" inteligente según `last_intent` (catalog→carrusel, booking/payment→pago, otro→Gemini) — Bot v44 ✅
- **Fix 2**: `payment_guard_v1` — NO disparar pago si Gemini no detectó `detected_service` explícitamente — Bot v46 ✅
#### Bug #20 (MEDIO 🟢) — Dashboard duplica mensajes del bot
- **Síntoma**: cada respuesta del bot aparecía 2 veces en `/dashboard/chat`.
- **Causa**: `update_session_context` Y `_log_outbound` ambos hacían append al history.
- **Fix**: quitar append de `update_session_context`, dejar solo `_log_outbound` como fuente única — Bot v45 ✅
#### Mejoras UX aplicadas
- [x] **responseSchema** (v38): Gemini NUNCA puede devolver JSON inválido — campo `customer_name` incluido en schema ✅
- [x] **customer_name capture** (v39): prioriza nombre verbal del cliente sobre `wa_profile_name` ✅
- [x] **Prompt anti-canson** (v43): 15 reglas (6 técnicas + 9 neuroventas) — precio directo, no repetir nombre, cierre cálido, match tono ✅
- [x] **Telemetría total** (v36+v45): dashboard ve TODOS los outbounds (carruseles, listas, botones, plantillas) sin duplicados ✅
### Lecciones para el roadmap
### Lecciones para el roadmap
1. **Health checks automáticos por tenant** son CRÍTICOS — webhook URLs, tokens, pixel, etc. (Fase G prioritaria)
2. **NUNCA aplicar cambios automáticos** que afecten dinero del cliente sin consentimiento explícito (Fase B6.5)
3. **Test mode antes de producción** para integraciones externas (Meta, Stripe, etc.)
4. **Rollback en 1 click** debe ser estándar para todo deploy
5. **🔴 Migración de PK**: cuando se migra PK (ej `phoneNumber` → `contact_id`), hacer grep de TODOS los `put_item`, `get_item`, `update_item`, `scan` y `query` que referencien el campo viejo en AMBAS Lambdas. Nunca asumir que un módulo no afectado es correcto.
6. **`py_compile OK` ≠ correctness** — variables undefined solo se ven en runtime. Code review manual también.
7. **🔴 Test E2E obligatorio**: crons que dependen de flags escritos por otra Lambda → test E2E con número real ANTES de marcar como hecho. Si el productor no escribe los flags, el cron es fantasma (Bug #15).
8. **🔴 Cleanup de campos relacionados**: cuando endpoint cambia estado, limpiar TODOS los campos relacionados. Frontend test visual obligatorio (Bug #16).
9. **🔴 responseSchema obligatorio**: SIEMPRE usar `responseSchema` en llamadas a Gemini para forzar JSON válido. Sin esto, ~2-5% de respuestas vienen truncadas/malformadas (Bug #18).
10. **🔴 payment_guard**: NUNCA disparar `trigger_payment_flow` si `detected_service=null`. El cliente puede HABLAR de pago sin QUERER pagar. Solo disparar si Gemini detectó servicio explícito (Bug #19).
11. **🔴 Telemetría sin duplicados**: si hay un helper que loguea outbounds (`_log_outbound`), NO appendear también en `update_session_context`. Una sola fuente de verdad (Bug #20).
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
- [x] Popup Embedded Signup — fix completo: nuevo config_id `997214322992918` (permisos completos). Config viejo `694128837119269` pedía permisos rechazados → "Sorry something went wrong". Embed funciona E2E (frontend `495dbee`). Videos enviados a Meta para re-submit de permisos rechazados (7-15 días).
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
### 🐛 Pendientes pequeños (próxima sesión)
- [x] **Bug memoria caching nombres**: filtros anti-PII + anti-mid-flow aplicados (Bot v88). Skip si es customer_name, confirmación corta, cédula, o flow activo. ✅
- [x] **Memoria con contexto/source**: cache key `(normalized_q, source)` donde source ∈ {`catalog_button`, `ad_greeting`, `conversational`}. search_memory cascada 3 niveles + register_candidate guarda last_ai_answer + cleanup 615 entries (Bot v136, promote-cron v2) ✅
- [x] **Remarketing rescate temprano**: `REMARKETING_DELAY_HOURS` bajado de 1h a 0.25h (15 min). Remarketing v6 acepta float. ✅
- [x] **Frontend manejo PIN en embed**: modal 6 dígitos cuando backend responde `requires_pin: true` + POST /meta/register-pin ✅
- [x] **Auto-vincular template**: carousels_catalog guardado en POST /templates/carousel + migrate script para templates existentes ✅
- [x] **Multi-carousel frontend services**: lista + activar default + asignar campañas + eliminar en /dashboard/services ✅
- [x] **Multi-carousel frontend ads**: selector de carrusel por campaña en wizard paso 1 + asignación post-publicación ✅
- [ ] **Selector templates aprobados en frontend**: dropdown en `/dashboard/templates` para elegir cuál template usar por defecto.
- [ ] **Debouncing con SQS**: el debounce async actual funciona pero tiene edge cases de race condition. Para escala (100+ msg/min) migrar a SQS con delay.
- [ ] **Marketing API Access Tier**: reactivar al menos 1 campaña para acumular 500+ calls en 15 días (requisito Meta).
- [x] **Embed Meta**: funciona E2E con nuevo config `997214322992918`. Videos enviados a Meta para re-submit. ✅
#### Bonus sesión 29 abril (tarde/noche) — Meta CAPI + ads + billing
- [x] **Endpoint `POST /leads/report-purchase`**: reportar venta individual a Meta CAPI desde el CRM con 1 clic — sin importar si vino del bot o de fuera ✅
- [x] **Botón "📤 Reportar a Meta"** en panel de detalle del lead (acciones rápidas) ✅
- [x] **Plantilla ventas v2**: columnas nombre, apellido, documento, celular (con indicativo automático del país), email, servicio (dropdown nombres legibles), monto, moneda, fecha, campaign_id ✅
- [x] **Mapeo service_name → slug** automático en bulk-import — el usuario ve nombres legibles, el backend mapea al slug correcto ✅
- [x] **document_id enviado a Meta** como `extern_id` — mejor match rate ✅
- [x] **Fix CORS Lambda URL**: `AllowOrigins: ["https://clientes.bot", "http://localhost:3000"]` — elimina header duplicado que bloqueaba descarga de plantilla ✅
- [x] **Fix presupuesto compartido en wizard de ads**: texto claro en paso 5 que el budget NO se multiplica por variantes ✅
- [x] **Fix modal análisis ads**: botones "Aplicar" ya no cierran el modal ✅
- [x] **Cron ads**: tenant CO_979BE374 (cuenta basura "asd") limpiado — ya no genera errores en el cron diario ✅
- [x] **API v67→v69**: fix CORS + plantilla ventas v2 + bulk-import v2 ✅
---
## 🟡 SPRINTS PLANEADOS — Orden de ejecución (sin fechas)
### 🥇 Sprint 1 — Foundation: empezar a cobrar + afiliados (estrategia GHL killer)
> Costo: **$0** (Stripe + Wompi son comisión por transacción, sin minimum)
> **3 frentes integrados**: Billing dual (Stripe global + Wompi CO) + Feature Flags + Quotas + Programa de Afiliados
#### Billing dual gateway
- [ ] **S1.0** Pre-flight: verificar Wompi Subscriptions habilitado + crear cuenta Stripe test
- [ ] **S1.1** Tabla `Subscriptions` gateway-agnostic (PK company_id, gateway, gateway_subscription_id, status, plan, trial_ends_at, next_billing_date)
- [ ] **S1.2** Catálogo `PLAN_FEATURES_JSON` env var (Solo/Pro/Agency/Enterprise → features + quotas)
- [ ] **S1.3** Helper `_resolve_billing_gateway(country)` → `wompi` (CO) o `stripe` (resto del mundo)
- [x] **S1.4** Endpoints: `/billing/checkout`, `/billing/portal`, `/billing/me`, `/billing/cancel` — via Lemon Squeezy (API v123+) ✅
- [x] **S1.5** Webhook LS → formato canónico + sync config_pro.plan automático (API v129) ✅
- [x] **S1.6** Trial 14d auto en onboarding + cron `trial-expire-daily` + guard owner_lifetime JMC (API v123-v125, Bot v138) ✅
- [x] **S1.7** Email Resend: trial warning 1-3d + email final al expirar + antispam 23h (API v126) ✅
#### Frontend billing
- [x] **S1.A** Landing dinámica consume `/billing/plans-public` (DDB fuente única) + trial 14d + toggle anual -20% (Frontend `d6433c9`) ✅
- [x] **S1.B** `/dashboard/billing` dinámico con features_ui + tooltips + checkout LS + cancel/resume + packs (Frontend `5e5b6af`) ✅
- [x] **S1.C** Banner trial en dashboard layout: azul 14d → naranja 3d → rojo expirado (Frontend `6fd482f`) ✅
- [x] **S1.D** Toggle annual -20% en landing + dashboard ✅
#### Feature Flags + Quotas (Fase D adelantada)
- [x] **S1.E** Helper `has_feature(company_id, feature)` con override individual (API v70) ✅
- [x] **S1.F** Quotas tracking en tabla `TenantQuotas` (API v71) ✅
- [x] **S1.G** QUOTA_ENFORCE=true activado. Bot bloquea con mensaje cordial + log_error (Bot v137) ✅
- [x] **S1.H** Dashboard de uso con 5 quotas + barras + alertas 80%+ (Frontend `billing/page.tsx`) ✅
#### 🤝 Programa de afiliados (40% año 1 + 30% lifetime — diferenciador GHL killer sostenible)
- [x] **S1.I** Tabla `Affiliates` (PK email, affiliate_code único, payout_method, total_referred_mrr, total_paid_lifetime, status active/banned) + GSI affiliate_code-index ✅
- [x] **S1.J** Tabla `Referrals` (PK referral_id=company_id, affiliate_email, signup_date, status PENDING/ACTIVE/CHURNED, first_payment_at, churn_at) ✅
- [x] **S1.K** Tabla `AffiliatePayouts` (PK affiliate_email, SK month YYYY-MM, status PENDING/HELD/RELEASED/PAID, amount_cents, commissions_count) ✅
- [x] **S1.L** Tabla `AffiliateCommissions` (PK affiliate_email, SK ts#referral_id, amount, rate_pct, billing_period, hold_until, released bool) + GSI `released-hold_until-index` ✅
- [x] **S1.M** Endpoint `POST /affiliate/signup` + generación `affiliate_code` (slug+6 chars únicos) (`lambda_function.py:12121`) ✅
- [x] **S1.N** Tracking URL `clientes.bot/?ref=AFFILIATE_CODE` → cookie 90 días + localStorage en frontend (`AffiliateTracker.tsx` montado en `app/layout.tsx:5`) ✅
- [x] **S1.O** Hook `/billing/checkout`: lee cookie ref → guarda `referred_by` en `Subscription` (`app/dashboard/billing/page.tsx:5`) ✅
- [x] **S1.P** Helper `_calculate_commission_rate(referral_signup_at)`: 40% si age<365d, sino 30% (`lambda_function.py:11984`) — env vars `AFFILIATE_RATE_YEAR1=0.40` + `AFFILIATE_RATE_RECURRING=0.30` ✅

- [x] **S1.Q** Webhook handlers: en cada `subscription_payment_success` (`_process_affiliate_commission` en `lambda_function.py:11987`): ✅
    - [x] Calcular comisión según rate dinámico (40%/30%) ✅
    - [x] Crear registro en `AffiliateCommissions` con `hold_until = paid_at + 30d` ✅
    - [x] **Anti-fraude**: si `referral.signup_date < 60d` Y `status=CHURNED` → comisión = 0 (env var `AFFILIATE_MIN_REFERRAL_DAYS=60`, check en `:12025` y `:12306`) ✅
- [x] **S1.R** Cron diario `affiliate-release-commissions`: libera commissions con `hold_until <= now` y `released=False` usando GSI `released-hold_until-index` (`lambda_function.py:12276`) — re-chequea anti-fraude churn<60d antes de liberar ✅
- [x] **S1.S** Cron mensual `affiliate-payout-batch` día 5: agrupa released commissions del mes anterior, paga si ≥ $50 USD / $200k COP, sino acumula (`lambda_function.py:12340`) ✅
- [x] **S1.T** Frontend `/dashboard/affiliate` dashboard: link único + tasa actual (40%/30%) + comisiones acumuladas/pendientes/pagadas + lista de referidos + métricas conversión (`app/dashboard/affiliate/page.tsx`) ✅
- [x] **S1.U** Página landing `/affiliates` pública con signup (`app/affiliates/page.tsx`) ✅
- [x] **S1.V** Email Resend: comisión generada (`:12060`) + payout enviado (`:12440`) + hito alcanzado **1/5/10/50 referidos** — ajustado vs roadmap original (10/50/100) porque "primer referido" engancha emocionalmente ✅
- [x] **S1.W** TyC del programa con cláusula de revisión 90 días de aviso (definido en STATUS L76) ✅
#### Migration tool desde GHL
- [ ] **S1.S** Importador CSV `Contacts` GHL → `Leads_CRM` (parseo de campos custom)
- [ ] **S1.T** Página `/migrate-from-ghl` con guía + uploader CSV
#### Bonus sesión audit afiliados — Sprint 1 cerrado al 100% 🦁
- [x] **Audit completo S1.I-S1.W** vía CloudShell sobre Lambda desplegada (SHA backend `869eed0`, frontend `120235b`)
- [x] **Backend verificado**: 4 tablas DDB + 7 endpoints + 2 crons EventBridge ENABLED + helper `_calculate_commission_rate` con env vars + anti-fraude churn<60d en webhook + cron release usa GSI `released-hold_until-index` (no Scan, escalable) + 3 emails Resend (comisión generada / hito 1-5-10-50 / payout mensual)
- [x] **Frontend verificado**: `app/dashboard/affiliate/page.tsx` (dashboard owner) + `app/affiliates/page.tsx` (landing pública signup) + `AffiliateTracker.tsx` montado en `app/layout.tsx` global + hook checkout en `billing/page.tsx` lee `cb_ref`
- [x] **Sidebar dashboard**: link 🤝 Afiliados visible para rol owner (`app/dashboard/layout.tsx:30`)
- [x] **Hitos ajustados a 1/5/10/50** vs roadmap original 10/50/100 — mejor para growth (engagement temprano)
- [x] **Sprint 1 cerrado oficialmente al 100%** — listo para primer afiliado real
---
### 🥈 Sprint 2 — Multicanal real (el rugido principal)
> Costo: **$0** (todas las APIs son gratis)
- [ ] **Web Chat Widget embebible** — `<script src="clientes.bot/widget/{company_id}.js">`
- [x] **Instagram DM** — Bot v104-v114: Gemini responde, catálogo lista texto, pago, historial, IG echo filter ✅
- [x] **Facebook Messenger** — Bot v104-v114: mismo flujo IG, subscribed_apps v22 ✅
- [ ] **Telegram** — Bot API gratis
- [ ] **Email transaccional** (Resend, gratis 3000/mes)
- [x] **Bandeja unificada** — conversations/active incluye FB/IG, channel icon 💚💬📸 en dashboard ✅
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
- [ ] **Afiliados 2-tier avanzado** — sub-afiliados (gana % de los afiliados que reclutó). MVP de afiliados ya en Sprint 1.
- [ ] **White label / Agencia** — multi-cliente dashboard + branding personalizado
- [ ] **Migration workflows desde GHL** — importar templates/funnels GHL como triggers internos (CSV de leads ya en Sprint 1)
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
20. **🔴 MIGRACIÓN PK**: cuando se migra PK de tabla, grep TODOS los `put_item`/`get_item`/`update_item`/`scan`/`query` con campo viejo en AMBAS Lambdas (Lección Bug #9-#13).
### Reglas nuevas — sesión 5 mayo (regla #6 multi-tenant + LLM stability)
21. **🔴 save_session = MERGE, nunca put destructivo**: si una función de save tiene 5+ call-sites con dicts diferentes, hacer merge (read+update+write). Bug #26 borró pax_confirmed por culpa de put_item.
22. **🔴 Multi-tenant cache obligatorio keyed por company_id**: cualquier dict de cache compartido `_cache: dict = {}`. NUNCA `_cache = {"data": ..., "expires": ...}` global. Bug #23 leakeo template entre tenants.
23. **🔴 LLM con fallback automático a otro modelo**: principal `gemini-2.5-flash-lite` → si 503 o malformed → fallback `gemini-flash-lite-latest`. Bug #29-#30. NUNCA producción con un solo modelo.
24. **🔴 Reglas comunes a TODOS los tenants → backend `system_prompt`**: pax_count, persistencia, orden cierre, anti-vague. Cliente solo configura tono+catálogo en su prompt. Bug #33 (regla en prompt JMC = no escalable).
25. **🔴 Datos críticos del flow → sesión DDB, no context LLM**: pax, customer_name, slug, service. Context LLM siempre truncado. Bug #31 perdió pax al final del flow.
26. **🔴 Validaciones DESPUÉS de normalizar input**: si el dato puede llegar como nombre o slug, normalizar primero, validar después. Bug #28 saltó guard porque service=None pre-normalización.
27. **🔴 cleanup post-acción terminal**: tras Payment Link / handoff humano / scheduling confirmado, llamar `clear_pax_data()` o equivalente. Mantiene history y profile, evita herencia entre flows del mismo cliente. Bug solucionado en v85.
### Reglas nuevas — sesión 8 mayo (post-migración WABA)
28. **🔴 Grep duplicadas antes de deploy**: `grep -c "^def NOMBRE"` en funciones críticas antes de cualquier deploy. Bug #25 regresó como Bug #35 por NO hacer este check. Ideal: hook pre-commit automático.
29. **🔴 Orden correcto para borrar código duplicado**: 1) agregar los kwargs nuevos a la función "buena"; 2) py_compile + tests; 3) borrar la mala. NUNCA borrar primero — los call sites quedan rotos.
30. **🔴 Cache de IDs externos keyed por contexto del emisor**: media_ids de Meta, tokens de Stripe, file_ids de Google, etc. NUNCA keyed solo por input. Siempre `(input, emisor_id)`.
31. **🔴 Auditoría env vars post-migración de integraciones**: tras migrar WABA, Stripe account, Meta pixel, etc., revisar TODAS las env vars de TODAS las Lambdas. El valor viejo puede seguir "funcionando" durante días hasta que lo uses en una operación privilegiada.
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
██████████████████████████████████░ 95%
### ⏱️ Métricas de desarrollo reales
| Métrica | Valor |
|---|---|
| **Horas invertidas hasta hoy** | ~545h |
| **Horas pendientes (completo)** | ~535h |
| **Total proyecto completo** | ~1,080h |
| **Equivalente invertido** | ~3.6 meses full-time senior |
| **Equivalente pendiente** | ~3.5 meses full-time senior |
| **MVP cobrable (Sprint 1)** | ✅ COMPLETADO — trial + billing + quotas E2E |

#### Desglose horas invertidas
| Bloque | Horas |
|---|---|
| Bot WhatsApp base + IA + multi-pasarela + CAPI | ~80h |
| API SaaS ~93 endpoints | ~120h |
| Frontend 20+ páginas | ~80h |
| Multi-agente completo | ~30h |
| Ads Pro completo | ~40h |
| Admin Panel A+B5+C+G | ~40h |
| Seguridad (2FA triple + PITR + audit) | ~20h |
| Bloque M CAPI completo | ~30h |
| Sesión 28 abril (8 bugs + B6.5 + madrugada) | ~12h |
| Sesión 29 abril (flows + migración multicanal) | ~8h |
| Sesión 5 mayo (flow comercial + carrusel + bugs Gemini) | ~15h |
| Sesión 6-7 mayo (embed + debounce + fragmentación + anti-silencio + WABA migración) | ~12h |
| Sesión 8 mayo (multicanal FB/IG completo + fixes + affiliate module) | ~18h |
| Sesión 8-9 mayo noche (Sprint 1 completo: trial+billing+quotas+admin editor+30 deploys) | ~7h |
| Sesión 8 mayo tarde (memoria source-aware + 6 bugs CRM + cleanup 615 entries) | ~3h |
| Debugging, rollbacks, incidentes varios | ~20h |
| **Total** | **~545h** |

#### Desglose horas pendientes
| Bloque | Horas |
|---|---|
| ~~Sprint 1 — billing completo~~ | ~~60h~~ ✅ COMPLETADO (LS) |
| ~~Sprint 1 — Feature Flags + Quotas~~ | ~~20h~~ ✅ COMPLETADO |
| ~~Sprint 1 — Programa de afiliados~~ | ~~10h~~ ✅ COMPLETADO |
| ~~Sprint Calendly Mode + UI Scheduling multi-tenant~~ | ~~8h~~ ✅ COMPLETADO (Bot v154-v162 + API v148 + 4 commits frontend) |

| Sprint 2 — Multicanal IG/FB (backend listo, falta webhooks + bandeja) | ~40h |
| Admin Panel C8-C12 + D-K completo | ~120h |
| Sprint 3 — IA superpoderes | ~60h |
| Sprint 4 — Crecimiento + Marketplace | ~80h |
| Sprint 5 — Globalización i18n | ~40h |
| Sprint 6 — Video IA + Live shopping | ~60h |
| Sprint 7 — Rugido final + PWA + WebSocket | ~40h |
| QA, testing, pulido antes de lanzamiento | ~40h |
| **Total** | **~600h** |

> 💡 **Nota:** Lo que está hecho es la infraestructura más compleja. Lo que falta tiene más features pero menor complejidad técnica por feature. El MVP cobrable (Sprint 1) está a ~93h de distancia.

#### 🧠 Porcentaje real por dificultad técnica

> El 86% mide *cantidad de features*. Por dificultad técnica real, el proyecto está al **~92%**.

| Nivel | Componentes | Estado |
|---|---|---|
| ⭐⭐⭐⭐⭐ Muy difícil | Multi-tenant strict, Bot IA + memoria, CAPI + atribución, Multi-pasarela pagos, Migración multicanal contact_id, 2FA triple, WhatsApp Flows encriptados | ✅ Todo hecho |
| ⭐⭐⭐⭐ Difícil | Ads Pro + IA recomendaciones, Admin Panel observabilidad, Stripe/Wompi billing | ✅ Parcial — billing pendiente |
| ⭐⭐⭐ Medio | Feature Flags + Quotas, Afiliados, Webhooks IG/FB + bandeja unificada, Admin Panel D-K | ❌ Pendiente |
| ⭐⭐ Simple | i18n, Video IA HeyGen, Sprints 4-7 en general | ❌ Pendiente |

> 💡 **En palabras simples:** el 26% de features que falta representa solo el ~13% de la dificultad técnica total. El motor del Ferrari está construido — lo que falta es la tapicería, el GPS y el aire acondicionado.
| Categoría | % |
|---|---|
| ✅ Infraestructura construida | **86%** |
| ✅ Billing LS completo (trial+checkout+webhook+quotas) | 100% ✅ |
| ✅ Feature Flags + Quotas enforcement | 100% ✅ |
| 🟡 Multicanal (IG/Messenger/Telegram) | 0% — Sprint 2 |
| 🟡 Admin Panel completo (D-J) | ~15% |
| 🟡 Sprints 3-7 (IA superpoderes, video, etc.) | 0% |
| 🤝 Programa Afiliados (movido a Sprint 1) | 0% — bloqueante crecimiento |
| 🔧 Pendiente: Sprint 1 ampliado (Stripe+Wompi+Quotas+Afiliados) + E (Impersonate) + F-J + multicanal | 2% |
**Última medición:** 9 mayo 2026 — **Sprint 1 COMPLETADO** 🍾 Trial 14d auto + cron expire + email warning + QUOTA_ENFORCE=true + billing E2E con LS (test real Growth $297) + webhook sync config_pro.plan + landing+dashboard dinámicos desde DDB (fuente única) + admin editor `/admin/plan-features` con features_ui+tooltips + propagación instantánea confirmada. 30 deploys (Bot v136-v138, API v117-v133, promote-cron v2, 8 commits frontend). Sesión anterior: memoria source-aware + 6 bugs CRM (Bug #9 reincidió 3x) + cleanup 615 entries

### Hitos de moral 🦁
- [x] **0% → 25%** — Bot WhatsApp + API SaaS base
- [x] **25% → 50%** — Multi-tenant + Ads Pro + CRM
- [x] **50% → 60%** — Multi-agente + Landing + Embedded Signup
- [x] **60% → 65%** — Seguridad completa + Tokens + Ads Pro + 2FA triple
- [x] **65% → 67%** — Admin Panel Fase A (overview + tenants list)
- [x] **67% → 68%** — B5 (2FA admins) + 8 hotfixes críticos
- [x] **68% → 70%** — Bloque M Meta CAPI + plantilla Excel + bulk import
- [x] **70% → 72%** — B6.5 cron IA + Fase C parcial + G1-G3 + multi-tenant strict 🦁
- [x] **72% → 73%** — Fase M 100% (M8/M9/M10 confirmados) + fix atribución silencioso v20 🦁
- [x] **73% → 74%** — Fix flows fantasma v21 + migración multicanal contact_id + tablas v2 + bot v27 + API v62 🦁
- [x] **74% → 76%** — Lemon Squeezy billing completo (checkout/webhook/cancel/resume) + planes Starter/Growth/Agency + login passkey auto-disparo + dashboard/billing + landing actualizada 🦁
- [x] **76% → 78%** — Meta CAPI individual (report-purchase) + plantilla ventas v2 (nombre/apellido/documento/indicativo/dropdown) + fix CORS Lambda URL + ads fix presupuesto compartido + fix modal análisis 🦁
- [x] **78% → 80%** — Feature Flags (S1.E) + Quotas (S1.F) + Enforcement rodaje (S1.G) + Message Packs (Bloque 6) 🦁
- [x] **80% → 81%** — Frontend usage widgets + Packs Lemon Squeezy E2E (con plata real ✅) + Affiliates backend completo (4 tablas + 5 endpoints + cron release + cookie tracker) 🦁
- [x] **81% → 82%** — Remarketing real end-to-end (cart + info abandonment) + Auto-return PAUSED >2h + Botón "Devolver al bot" en tab Agente + 5 bugs auditados (#11-#15) 🦁
- [ ] **82% → 84%** — Frontend `/dashboard/affiliate` + landing `/affiliates` + cron payout-batch + emails Resend + TyC + CloudWatch alarms
- [x] **82% → 84%** — Sesión 5 mayo: Flow comercial completo + 14 bugs raíz + Gemini fallback + multi-tenant strict (Bot v47-v85, API v86-v88, Remarketing v5) 🦁
- [x] **84% → 86%** — Sesión 6-7 mayo: Debounce async + anti-silencio + fragmentación + typing + cascada 3 LLM + Embed E2E + auto-onboarding API + Lambda 60s + WABA migrado (Bot v85-v102, API v89-v90, Remarketing v6) 🦁
- [x] **86% → 88%** — Frontend Affiliate dashboard + landing pública + cron payout mensual v91 + emails Resend afiliados v92 + TyC sección 13 + PIN embed + Multi-carousel backend v93 + bot campaign_id v103 + Remarketing delays variables v7 🦁
- [x] **88% → 90%** — Multicanal completo Instagram DM + Facebook Messenger (Bot v104-v114, API v95-v96) + fix handle_add_service duplicada sync prompt (API v94) + conversations/active con canal icon 🦁
- [x] **90% → 92%** — Memoria source-aware (Bot v136 + promote-cron v2) + 6 bugs CRM masivos cerrados (Bug #9 reincidió 3 veces, Bug #44 fix CRÍTICO created_at GSI con paid_count 0→83 y revenue $23.38M COP) + cleanup memoria 615 entries — API v117-v122 🦁
- [x] **92% → 94%** — Sprint 1 COMPLETADO 🍾 Trial 14d E2E + QUOTA_ENFORCE=true + billing LS E2E (test real $297) + cron trial-expire + email warning + landing+dashboard dinámicos DDB + admin editor planes + 7 bugs más (Bug #45 router /billing/me) — Bot v137-v138, API v123-v133, 8 commits frontend 🦁
- [x] **94% → 95%** — Calendly Mode CERRADO 📅 CalendarPicker v7.3 + auto-onboarding multi-tenant del flow (1 POST = flow creado en Meta) + UI completa `/dashboard/services` con `time_slots` / `available_weekdays` / `booking_mode` solapable+exclusive / `max_days_ahead` / `post_payment_flow=send_group_link` / recordatorios async post-agendamiento — Bot v154-v162, API v148, 4 commits frontend (4b0d78c, 8f8775b, a4c3172, fc069b1). Bug #56 falsa alarma (testing pipeline borraba scheduled_*). 5 lecciones nuevas (48-53). 🦁
- [x] **95% → 96%** — Ads Pro v2 CERRADO 🎯 Regla #8 KILL_CREATIVE (B6.5 motor) + `/ads/generate-hook-variants` Gemini Flash Lite con cache 5min + frontend botón ✨ Variantes en el 🏆 + modal con 3 hooks copiables y patrón emocional detectado. JMC verificado: 0 KILL_CREATIVE (creatives sanos 2.43-4.99% CTR) + Gemini detectó patrón "escasez" del ganador. API v153-v155, frontend `92a3dcd`. 3 lecciones nuevas (56-58). ⭐ ESTÁS AQUÍ
- [ ] **96% → 100%** — Sprints 3-7 + Admin D-K completo + Feature Flags UI + Impersonate + Hook agente humano memoria + Web Chat Widget + Google Calendar multi-tenant fix + CAPI Schedule + RUGIDO 🦁

> *"Cada % se gana con café. Cada café se gana con un commit."*
---
## 📞 CONTACTO
- Email: soporte@clientes.bot
- WhatsApp: +57 XXX
- Empresa: SGC Technology S.A.S.
- Juan Martinez