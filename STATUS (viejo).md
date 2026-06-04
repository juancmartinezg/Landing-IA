# 📊 STATUS — clientes.bot
> **Única fuente de verdad** del estado del proyecto.
> Reemplaza las hojas de ruta dispersas en chats.
> Marca `[x]` cuando cierres una tarea.
**API v275 + Bot v246 + Frontend `2a077ea`** — Sprint Ads Pro v3 + Biblioteca + Video IA + Pricing + Publishing Engine 🦁🎬📚💰 (23-25 mayo, 3 sesiones ~30h efectivas).(23-24 mayo, sesión maratón ~25h efectivas en 36h — madrugada + mañana + noche). **5 bugs revenue-critical full-stack + 2 bugs históricos cerrados como bonus.** Bug #69 (copies 4 campos completos: headline+primary 400-600+description+cta_button enum 8 opciones) + Bug #70 (refs reales como inlineData a Gemini, multi-tenant agnostico, 100/10 visualmente) + Bug #71 (3 formatos Meta HD nativos: 1080×1080/1080×1920/1920×1080 vía Pillow crop wide-composition, costo $0 extra) + Bug #72 (wizard_launch acepta arrays paralelos image_urls_vertical/horizontal/video_urls + Meta Advantage+ asset_feed_spec) + Bug #73 (upload video manual MP4/MOV via presigned S3 + /ads/video/register persiste en biblioteca + video_data en campaigns/publish para Meta /advideos). Bug doble flujo scheduling cerrado: PII Flow movido al FINAL del async post_booking (Single + Multi unificados con Flow recursivo, eliminada rama AWAITING_LEAD_DETAILS/CAPTURING_ATTENDEES). Bug histórico /register routing usaba endswith capturando /ads/video/register. Frontend mobile lag (loop infinito useEffect en servicios). **Tabla AdsCreativeGenerations** creada (PK company_id, SK generation_id, GSIs campaign_id-generated_at + vertical-generated_at, PITR ✅, TTL 365d) — base Hypothesis Engine + Pattern Marketplace + Benchmark + Fatigue Prediction. **Vertex AI Imagen 3** configurado como helper futuro (Service Account + Secrets Manager + google-auth-layer:1) — disponible para outpainting con máscara cuando se necesite. **Pillow layer Python 3.14 reconstruido** + fuentes Inter Bold/Regular TTF reales (las .otf de GitHub eran HTML 4xx). **Memoria Lambda** API + Bot 512→1024MB (2x CPU, fix lag mobile). **Biblioteca creativos full-stack**: GET /ads/library?type=image|video|copy|winners + DELETE bulk + cap-aware persist multi-tenant via plan_features (starter=50, growth=500, agency/enterprise/owner_lifetime=-1) + frontend /dashboard/ads/library con 4 tabs (imágenes/videos/copies/ganadores) + multiselect + bulk delete + banner cap warning. **Wizard de Video standalone** /dashboard/ads/video-wizard 4 steps (tipo/brief/upload-o-biblioteca/textos+lanzar) con upload manual MP4/MOV + elegir de biblioteca + placeholders honestos "Generar IA / Avatar HeyGen → Próximamente". **Sidebar reorganizado**: 3 items bajo Ads (Anuncios IA / Biblioteca creativos / Wizard de Video). **Wizard imagen Step 8** UI: copies 4 campos editables (headline 40 + primary_text 400-600 con validador color + description 30 + cta_button select con 8 opciones Meta) + botón "📹 + Video" cuando overlay aplicado. business_vertical=escuela_tiro configurado en JMC (alimenta moat correctamente).
### 2 jun 2026 — Sesión MARATÓN (~20h efectivas) 🦁💪
**API v278 + Bot v268 + Frontend `32d2cf0`** — Cost Foundations + arm64 + UX-Contexto + Permisos Granulares + Pending-Schedule Reminders.
#### 🏗️ SPRINT 1: Cost Foundations Fase 1 — CERRADO
**Sin tocar código de aplicación** (solo infra). Ahorro proyectado a 1M clientes: **~$19,010/mes (~$228K/año)**.
- ✅ **CloudWatch Logs retention 7d** en 4 Lambdas (antes never expire — bomba silenciosa)
- ✅ **S3 Lifecycle + Intelligent-Tiering:**
  - `clientes-bot-media`: IT auto-tier + 90d→Glacier IR + 365d→Deep Archive
  - `clientes-bot-backups`: 30d→Glacier IR + 120d→Deep Archive
  - `certificados-jmc`: 🚫 intacto (regla #10)
- ✅ **DDB PITR audit:** desactivado en 8 tablas regenerables/TTL, mantenido en 7 críticas + 10 snapshots defensivos on-demand
- ✅ **Cleanup tablas legacy:** `TypebotSessions` v1, `WhatsApp_Sessions`, `saas_clients`, `saas_products` (luego restaurada por bug #51)
- ✅ **Bucket `atalogo-saas-imagenes` borrado y restaurado** (10 archivos legacy)
#### 🦾 SPRINT 2: Graviton arm64 Migration — CERRADO
Las 4 Lambdas migradas. Layers nuevos arm64 publicados:
- ✅ `promote-memory-candidates` → arm64
- ✅ `WhatsApp_Remarketing` → arm64 (+ fix bug #54: timeout 3s→30s, mem 128→256MB)
- ✅ `SaaS_API_Handler` → arm64 + 3 layers nuevos
- ✅ `WhatsApp_Typebot_Bridge` → arm64 + 2 layers nuevos
- Layers arm64 publicados: `pillow-arm64:1`, `google-auth-arm64:2`, `cryptography-arm64:1`
- `tenacity-library:1` reutilizable (Python puro)
- Ahorro proyectado: -20% Lambda compute permanente
#### 🐛 SPRINT 3: UX-Contexto — Bugs revenue-critical de buyers
Detectado por audit de leads reales (Jader 573163174755, Juan Carlos 573135733186): bot trataba buyers post-pago como leads nuevos, remarketing disparándose a compradores, reagendamiento ignorado, etc.
**Bot v261-v265 (BUYER_GUARD completo + reagendamiento + welcome menu):**
- ✅ **FIX 1** (Remarketing v9): Cron skipea buyers via cross-check `is_buyer` + `status=PAGADO`. Auto-cierra `remarketing_pending` cuando detecta buyer
- ✅ **FIX 2-tris** (Bot v258): `payment_status=PAGADO` → `is_buyer=True` (fuente de verdad cuando CRM inconsistente)
- ✅ **FIX 2-quad** (Bot v259): BUYER_GUARD intercepta `catalog/booking/payment/greeting` para buyer con cita activa
- ✅ **FIX 2-sexies** (Bot v261): Cuando buyer dice "necesito mover", "reagendar" → dispara `_trigger_scheduling_flow` directo con calendar picker
- ✅ **FIX 3** (Bot v261): `GUARD_ALREADY_PAID` silencioso (no más "Tu pago ya está confirmado..." en cada respuesta)
- ✅ **FIX 4** (Bot v261): `_reagendar_words` ampliado con variantes naturales ("moverla", "no voy a poder", "se me cruzo", "necesito mover") + regex
- ✅ **FIX 5** (Bot v265): Welcome menu solo en **sesión nueva** (no en CHAT_MODE con history)
- ✅ **FIX 6** (DDB `JMC/config_pro`): Prompt Gemini ajustado — `"hola"` solo → `intent=greeting` (no `catalog`)
- ✅ **FIX 60** (Bot v266): pax_count acepta palabras ("una persona" → 1, "pareja" → 2, etc) + dígitos
**Validado E2E con buyer test (tu número 573003723786 + Juan Carlos real):**
- "hola" → bot responde personalizado SIN catálogo a buyer activo
- "cuándo es mi cita" → fecha directa
- "necesito mover mi cita" → flow scheduling con calendar picker ✅
#### 🔧 SPRINT 4: Bug #21 Reincidencia — Cache stale post-reconnect WABA
**Síntoma:** Tras desconectar/reconectar WhatsApp del dashboard, bot deja de responder ~5min con `"Webhook sin tenant resuelto"`. Solo se recupera con cold start manual.
- ✅ **Bot v267:** `resolve_company()` NO cachea `DEFAULT_COMPANY_ID` en no-match. Solo matches reales se guardan. Performance no afectado, auto-corrección inmediata al siguiente webhook.
#### 🔒 SPRINT 5: Permisos Granulares por Agente — CERRADO
Sistema multi-tenant de permisos para que owner cree roles personalizados con checklist visual.
**Backend (SaaS_API_Handler v278):**
- ✅ Helper `get_agent_full()` lee rol REAL desde DDB Agents (no del header — antes era falseable desde DevTools)
- ✅ Helper `can(agent, permission)` con matriz defaults por rol
- ✅ Helper `require_permission()` para guards en endpoints
- ✅ `PERMISSIONS_CATALOG`: 10 categorías, ~35 permisos
- ✅ `ROLE_PRESETS`: Asesor de Ventas / Manager / Supervisor (solo lectura)
- ✅ 4 endpoints CRUD:
  - `GET /agents/permissions-catalog`
  - `GET /agents/permission-presets`
  - `GET /agents/{id}/permissions`
  - `PUT /agents/{id}/permissions` (owner only)
- ✅ 6 endpoints sensibles blindados:
  - `GET /payments` (`view_payments`)
  - `GET /analytics` (`view_analytics`)
  - `POST /payments/mark-paid-manual` (`mark_paid_manual`)
  - `POST /leads/bulk-import-purchases` (`bulk_import_leads`)
  - `GET /ads/dashboard` (`view_ads`)
  - `GET /billing/me` (`view_billing`)
- ✅ Audit log automático en cambios de permisos
- ✅ Cache 60s para performance
- ✅ Fix `permissions` reserved keyword DDB (`ExpressionAttributeNames` con alias `#perms`)
**Frontend (`32d2cf0`):**
- ✅ Botón "🔒 Permisos" en lista de agentes (solo si role !== 'owner')
- ✅ Página `/dashboard/agents/[id]/permissions` con checklist visual
- ✅ 3 presets aplicables con 1 click
- ✅ Custom role name input
- ✅ Contador "X de N permisos habilitados"
- ✅ Botón sticky guardar
- ✅ Test E2E validado con agente real Andrés Felipe Pérez
#### 📅 SPRINT 6: Pending-Schedule Reminders — NUEVO FEATURE
Detectado por observación: muchos clientes pagaban pero no veían/tocaban el botón Agendar del Flow, asumiendo silencio.
**Bot v268 + EventBridge:**
- ✅ `_trigger_scheduling_flow` registra `scheduling_flow_sent_at` en `StudentPaymentState`
- ✅ Nueva función `handle_cron_pending_schedule()`:
  - Escanea `PAGADO + schedule_status != AGENDADO + scheduling_flow_sent_at` existente
  - Reminder 1 (a los 30 min): mensaje + re-dispara `_trigger_scheduling_flow`
  - Reminder 2 (a los 90 min): ofrece ayuda manual escribiendo el día preferido
  - Idempotente con counter `pending_reminders_sent` (máx 2)
- ✅ Routing `POST /cron/pending-schedule` + `_internal_action=cron_pending_schedule`
- ✅ EventBridge `pending-schedule-reminders` ENABLED (rate 30 min)
- ✅ Multi-tenant safe (lee `config_pro` del tenant)
- ✅ Test E2E validado: pago test con `flow_sent_at` -35 min → procesado 1/0 → reminder enviado correctamente
#### 🧹 Bonus / fixes menores del día
- ✅ Fix #53 carrusel redundancia (Bot v247): pre-mensaje corto en lugar de reply Gemini fragmentado antes del template
- ✅ Cleanup lead Jader (rastro de tests previos): scheduled_date actualizado manualmente a jueves 4 jun
- ✅ Limpieza buckets/tablas legacy con backup defensivo + restore validado
#### 📌 Lecciones nuevas
- **#48:** AWS S3 Lifecycle exige mínimo 90d entre Glacier IR → Deep Archive (no 30→90, sino 30→120)
- **#49:** PITR ≠ Snapshot on-demand. PITR continuo $0.20/GB-mo. Snapshot $0.10/GB una vez. Para tablas TTL/regenerables, snapshot defensivo es mejor ratio
- **#50:** `aws s3 rm` NO acepta `--no-progress` (solo `sync`/`cp`)
- **#51:** Cleanup buckets/tablas requiere audit no solo de `grep` sobre código sino también URLs/refs en `KnowledgeBase config_pro` y datos dinámicos. Bucket `atalogo-saas-imagenes` se borró por falsa-negativa, restaurado en 5min
- **#52:** AWS CLI v2.34: `update-function-configuration --architectures arm64` falla con "Unknown options". Workaround: `update-function-code --architectures arm64` (re-deploy zip)
- **#53:** Templates Meta carousel traen su propio BODY component. Mandar reply Gemini ANTES duplica info
- **#54:** Lambda timeout 3s en `WhatsApp_Remarketing` ocultaba bug #15 desde meses. Subir timeout NO cuesta más (Lambda cobra por ms ejecutados, no por timeout configurado)
- **#55:** `StudentPaymentState` es FUENTE DE VERDAD para "es buyer?" — más confiable que `Leads_CRM_v2.is_buyer` (cleanup de lead deja inconsistencia)
- **#56:** Pre-Gemini context inject NO basta — Gemini ignora reglas si tiene patrones más fuertes. Necesario guard en `process_ai_response` post-Gemini
- **#57:** `try/except Exception` silencia errores reales del helper. Logs de diagnóstico (BUYER_CHECK_START / ctx) son obligatorios al iterar fixes
- **#58:** Lista de intents que devuelve Gemini incluye `"schedule"` y `"reschedule"`. Agregar siempre al GUARD junto con catalog/booking/payment
- **#59:** Cleanup mal hecho de un lead deja inconsistencia entre tablas (lead recreado sin `is_buyer` pero pago original sigue)
- **#60:** El prompt de Gemini en `config_pro` puede CONTRADECIR los guards del código. Si el bot responde mal a algo, **primero leer el prompt** antes de tocar lógica del handler. El prompt es declarativo y manda más fuerte que código defensivo
- **#61:** `resolve_company` no debe cachear `DEFAULT_COMPANY_ID` cuando GSI no encuentra match. Cache distribuido en containers Lambda es imposible de invalidar atomically — la solución es **no cachear fallbacks/errores**
- **#62:** `get_agent_context` leía del HEADER (falseable desde DevTools). Vulnerabilidad de seguridad cerrada — ahora lee del JWT Cognito (firmado, no falseable) + valida contra DDB
- **#63:** `permissions` es palabra reservada en DynamoDB. Sumar a la lista de regla #5 junto con `status` y `source`. Siempre usar `ExpressionAttributeNames` con alias `#perms`
- **#64:** Próxima migración pendiente: bug latente `leads_table` referenciada como global en L50, L1431, L1608 del Bot sin declarar. Falla silenciosa en paths donde corre
#### 📊 Métricas del día
- **Lambdas en producción:** 4 (todas arm64)
- **Versiones publicadas:** Bot v247 → v268 (21 versiones), API v275 → v278 (3 versiones), Remarketing v6 → v9
- **EventBridge rules nuevas:** 1 (`pending-schedule-reminders` rate 30 min)
- **Bugs cerrados:** ~12 críticos + 6 menores
- **Features nuevas:** Permisos granulares + Cron pending-schedule
- **Líneas de código modificadas:** ~800 (Backend + Frontend)
- **Snapshots defensivos DDB:** 10 creados (35d retención)
- **Backups defensivos S3:** ~13 archivos + 3 JSONs (35d retención)
#### 🛡️ Recursos defensivos retenidos
- **DynamoDB snapshots** 35 días: `cost-foundations-step3-20260528-223754-*` (10 tablas)
- **S3 backups** indefinido: `s3://clientes-bot-backups-235565749479/cost-foundations-cleanup/20260528-220858/`
- **Lambda versions** rollback:
  - `WhatsApp_Typebot_Bridge:251` (pre-arm64)
  - `WhatsApp_Typebot_Bridge:267` (pre-pending-schedule)
  - `SaaS_API_Handler:275` (pre-arm64)
  - `SaaS_API_Handler:276` (pre-permissions)
#### 🏆 Producción actual
**API v278 + Bot v268 + Remarketing v9 + Frontend `32d2cf0`**
Todas las Lambdas en **arm64 Python 3.14** con layers nuevos.
JMC corriendo sin downtime durante toda la sesión maratón.

### 3 jun 2026 — Sprint SQS FIFO Nivel 4 + Sidebar dinámico 🦁⚡
**API v278 + Bot v277 + Remarketing v9 + Frontend `6599ea7`**
#### 🔒 Sidebar dinámico por permisos (Frontend `6599ea7`)
- ✅ Helper `canSeeMenuItem()` filtra items del sidebar por `permissions_effective` del agente
- ✅ Fetch de permisos al montar layout (solo si role=agent/viewer)
- ✅ Owner/admin ven TODO (corto-circuito)
- ✅ Campo `permission` en cada menuItem (24 items mapeados)
- ✅ Ambos sidebars (desktop + mobile) usan el mismo filtro
#### 🚀 SPRINT 7: SQS FIFO Nivel 4 — Race conditions eliminadas
Refactor arquitectural del debounce: de invoke async con sleep 5s → SQS FIFO con sliding window.
**Infra (FASE 1):**
- ✅ Cola `bot-messages.fifo` (ContentBasedDeduplication ON, VisibilityTimeout 60s, retention 4d)
- ✅ DLQ `bot-messages-dlq.fifo` (retention 14d, maxReceiveCount 3)
- ✅ IAM Policy `SQSBotMessagesAccess` en role del bot
- ✅ Env vars `BOT_MESSAGES_QUEUE_URL` + `DEBOUNCE_MODE`
- ✅ Event source mapping `adbb7d8c-4684-4727-93da-2ac9df6553d6` (SQS→Lambda)
**Código (PASOS 1-5 + fixes):**
- ✅ **PASO 1** (Bot v272): Refactor `_process_consolidated_message()` extraída de `debounce_execute` — función pura reutilizable sin recursión
- ✅ **PASO 2** (Bot v273): Handler `_handle_sqs_batch()` + detector `eventSource=aws:sqs` al inicio de `lambda_handler`
- ✅ **PASO 3** (Bot v274): Feature flag `DEBOUNCE_MODE` en entry-point — branch `legacy` vs `sqs_fifo` con fallback automático
- ✅ **PASO 4**: Event source mapping creado (Disabled → Enabled)
- ✅ **PASO 5** (Bot v276): Toggle `DEBOUNCE_MODE=sqs_fifo` + fix `debounce_processed` limpiado pre-SQS
- ✅ **Bot v277**: Sliding window — buffer DDB + flush async 5s. Consolida ráfagas ("hola" + "quiero info" + "del seminario" → 1 respuesta)
**Resultado validado E2E:**

### 24-25 mayo 2026 — Bug Wompi + Video IA Test + Pricing definitivo + Publishing Engine 🦁💰🎬
**API v278 + Bot v277 + Frontend `6599ea7`**(sesión ~8h noche)
**Bug Wompi pagos (CRÍTICO — cliente real Oscar perdido):**
- ✅ **Raíz:** webhook Wompi llega con `payment_link_id` pero bot buscaba solo por `payment_reference` (que Wompi cambia) y `phone_number` (que no matchea si pagó con Nequi de 3ro — esposa/familiar)
- ✅ **Fix Bot v244:** `WompiGateway.parse_webhook` devuelve `payment_link_id` + persistencia `wompi_payment_link_id` en `StudentPaymentState` al crear link + webhook cascada 3 niveles: reference → payment_link_id → phone
- ✅ **Fix Bot v246:** completar `parse_webhook` que faltaba en patch anterior
- ✅ **14 PENDING verificados vs Wompi API:** 0 pagos perdidos (todos abandonos legítimos)
- ✅ **Cron reconciliación diaria:** `handle_cron_reconcile_payments` escanea PENDING 72h + consulta Wompi API + marca automático si APPROVED + EventBridge `payments-reconcile-daily` ENABLED 6 AM UTC
- ✅ **Bug histórico `/register` routing:** `endswith("/register")` capturaba `/ads/video/register` → fix a match exacto `== "/register"` (API v275)
**Video IA — Test exitoso Fal.ai:**
- ✅ **Wan v2.7 (Video IA Pro):** 50s generación, $0.10/seg, 720p, audio ambiental incluido gratis, prompt español funciona
- ✅ **Kling v3 Pro (Video IA Cinematic):** 111s generación, $0.112-$0.168/seg, ultra-realista (expresiones faciales, retroceso arma, física objetos), audio incluido
- ✅ **Veredicto:** Kling Pro "diferencia brutal" vs Wan. Estrategia: Wan para Growth (Pro), Kling para Agency/Enterprise (Cinematic)
- ✅ **Naming comercial:** "Video IA Pro" (Wan) + "Video IA Cinematic (Ultra-Realista)" (Kling)
- ✅ **Arquitectura 15s:** 5s IA pura (gancho visual) + 10s FFmpeg (freeze + Ken Burns + chips dinámicos + CTA)
- ✅ **Fal.ai API key configurada y testeada** (key en chat #22, NO en env vars aún — va en Secrets Manager)
- ⏳ **Pendiente:** endpoint `/ads/video/generate` + SQS async + webhook Fal.ai + FFmpeg Lambda Layer + post-procesamiento 15s
**Pricing DEFINITIVO actualizado en DDB (`plan_features`):**
- ✅ **Starter $127/mes** ($457K COP, annual $1,219): Bot IA + CRM + Pagos + Citas + 2 agentes + 2 redes + 25 posts programados. SIN Ads, SIN Video, SIN Voz, SIN Multicanal avanzado.
- ✅ **Growth $347/mes** ($1.25M COP, annual $3,331): TODO Starter + Ads Pro IA + 30 Videos IA Pro + 1 Video IA Cinematic GRATIS/mes (antojo) + CAPI + Voz 100min + Multicanal + 4 redes + 150 posts + Cross-post + Smart Repurpose AI™ + Autopost
- ✅ **Agency $597/mes** ($2.15M COP, annual $5,731): TODO Growth + 60 Videos IA Cinematic + White-label + 6 redes + 750 posts + Sub-cuentas ilimitadas
- ✅ **Enterprise $1,297/mes** ($4.67M COP, annual $12,451): TODO Agency + 150 Videos IA Cinematic + Voz 1000min fair-use + Content Queue AI + Growth Flywheel + Account manager
- ✅ **Packs Cinematic upsell (Growth):** 5/$10 · 15/$25 · 50/$70 (Lemon Squeezy one-time)
- ✅ **Afiliados ajustados:** Solo+Growth 40%/20% · Agency 30%/15% · Enterprise 0% (directo)
**3 motores de producto definidos:**
- ✅ **🎨 AI Content Engine** (genera, consume créditos): Imágenes IA (Gemini) + Video IA Pro (Wan) + Video IA Cinematic (Kling) + Copies IA + Variantes
- ✅ **📡 Publishing Engine** (distribuye, soft limits): FB + IG + TikTok + Reels + WA + scheduling + cross-post + autopost + Smart Repurpose AI™
- ✅ **🧠 Growth Engine** (moat futuro): Ads → Orgánico → Mide engagement → Orgánico ganador → Sugiere ad. Bidirectional content intelligence. Content Queue AI (detecta silencio, llena calendario automático)
**Quotas Publishing Engine:**
- Starter: 25 posts activos, 2 redes
- Growth: 150 posts, 4 redes, cross-post, repurpose, autopost
- Agency: 750 posts, 6 redes, todo incluido
- Enterprise: ilimitado + Content Queue AI
**features_ui actualizado para landing (sin "próximamente"):**
- Starter: 24 items (17✅ + 7❌)
- Growth: 31 items (todos ✅)
- Agency: 23 items (todos ✅)
- Enterprise: 15 items (todos ✅)
**Lecciones nuevas:**
- #42: Wompi `payment_link_id` es la ÚNICA llave estable para match (reference cambia, phone del pagador puede ser 3ro)
- #43: Cron reconciliación como safety net — no confiar solo en webhooks para pagos
- #44: Fal.ai `duration` debe ser integer no string (error 422 silencioso)
- #45: Wan v2.7 genera audio ambiental gratis (antes era diferenciador de Kling — ya no)
- #46: NO usar nombres de proveedores en pricing visible al cliente (Wan/Kling → Pro/Cinematic)
- #47: Publicaciones orgánicas ≠ generación de contenido. Push cuesta ~$0, generación cuesta $$. Limitar generación, soft-limit publicación
- #48: Smart Repurpose AI™ como producto estrella, no feature menor. "Más contenido sin más trabajo" vende más que "adapta formato"
**Pendiente próximo sprint (Video IA infra):**
1. Guardar Fal.ai API key en AWS Secrets Manager (NO en env vars)
2. Compilar FFmpeg Lambda Layer para Python 3.14 x86_64
3. Endpoint `POST /ads/video/generate` (orquestador: valida créditos → Gemini genera prompt movimiento → dispara Fal.ai async)
4. Cola SQS `video-generation-queue` con DLQ
5. Lambda Worker consume SQS → llama Fal.ai queue/submit con webhook_url
6. Lambda Webhook recibe callback Fal.ai → descarga 5s clip → FFmpeg extiende a 15s (freeze + Ken Burns + chips + CTA + logo) → S3 → DDB `used += 1` → push FCM
7. Frontend video-wizard conectado al endpoint real
8. Packs Cinematic en Lemon Squeezy (cuando aprueben verificación)
9. Actualizar landing con nuevos precios + features Video IA + Publishing Engine
10. Settings card `business_profile`
11. Limpiar código muerto AWAITING_LEAD_DETAILS + CAPTURING_ATTENDEES en Bot
**Producción actual:** API v275 + Bot v246 + Frontend `2a077ea` + `423e1fa` (STATUS)
**API v239 + Bot v242 + Frontend `99e72d2`** — Sprint Match Rate Meta + Mark-Paid-Manual + Ads Pro v3 fixes CERRADO 🦁🎯💯 (22-23 mayo, sesión maratón ~11h). Bug #45 raíz cerrado + bonus external_id sobreescritura + bonus country/region/zip CAPI + endpoint `/leads/sync-meta-leads` retroactivo + endpoint `/payments/mark-paid-manual` (asesor marca pagos externos efectivo/transferencia/QR) + apply-action 8 acciones + analyze MAX_TOKENS fix. **277 eventos CAPI con PII enriquecida** + payload validado en Graph Explorer (events_received:1, messages:[]).**API v228 + Bot v240 + Frontend `f18ab09`** — Sprint Fix Atribución ROAS CERRADO 🦁🎯 (21 mayo, sesión ~5h). Filtro CRM por campaña + Resolución ad_id→campaign_id Meta Graph + Backfill 9 purchases $2.38M + Fix release preserva flow_state mid-captura.
**API v224 + Bot v236 + Frontend `f18ab09`** — Sprint AUDIT-1 cerrado 🦁🔍 (20 mayo, sesión ~3h auditoría). 4 deudas técnicas reales cerradas + 5 confirmadas como falsos pendientes (ya hechas).
**API v223 + Bot v230 + Frontend `fa61f4b`** — Sprint PII Review Multi-tenant (MP-1 a MP-4) CERRADO 🦁📋💎 (18 mayo, sesión maratón ~12h).
**Sprint PII Review Multi-tenant + Match Rate Meta** (18 mayo ~12h): Pipeline completo de captura PII post-pago con revisión humana antes de enviar a Meta CAPI. **5 mega-patches deployados:**
- **MP-1** (Bot v221): Blacklist nombre + helper `_is_invalid_name` (rechaza preguntas como "¿cuánto cuesta?" detectadas como nombre) + rename `dni→document_number` con **dual-read soft** (lee ambos, escribe solo nuevo) + fix `_ensure_lead_created_at` raíz (cierra Bug #9 ENÉSIMA reincidencia — todos los `update_item` a Leads_CRM_v2 ahora garantizan `created_at` con `if_not_exists`).
- **MP-2** (Bot v222): Trigger PII Flow post-SUCCESS scheduling (asistente 1) con `pax_flow_sent_at` idempotente + validación cruzada estricta (no warning — bloquea con error si email/doc/teléfono duplicados entre asistentes) + persistencia migrada a `customer_document_number`.
- **MP-3** (API v218→v223 + Bot v223→v230): Helper genérico `_create_or_update_meta_flow` reutilizado (refactor scheduling-flow/setup para reusar) + endpoint `POST /flows/pii/setup` multi-idioma (6 locales `es/en_US/pt_BR/fr/it/de`) + auto-onboarding en `/onboarding` + Flow JSON v6 sin REVIEW_SCREEN (3 pantallas: DATOS → UBICACION → terminal con complete) + placeholders dinámicos `${data.phone_label}` / `${data.email_label}` por tenant (Titular vs Asistente N) + `init_phone` pre-rellenado para titular + helpers `_get_country_phone_code` + `_normalize_phone_with_country` (auto-normaliza teléfono usando phone_code del país elegido).
- **MP-4** (Bot v225→v230 + API v221 + Frontend `fa61f4b`): nfm_reply guarda buffer (NO persiste CRM aún) + envía mensaje WhatsApp con **resumen completo + botones [✅ Correcto / ✏️ Editar]** al cliente + handlers `_handle_pii_confirm` (persiste + audit + email + Enhanced CAPI) y `_handle_pii_edit` (re-dispara Flow con init-values del buffer) + push FCM real al asesor (reusa `send_push_to_agent` existente — NO crea código nuevo) + endpoints `GET /pii/pending` paginado + `POST /pii/confirm-manual` + `POST /pii/discard` con audit log + frontend banner ámbar en `/dashboard/crm` con tarjetas clickeables + modal detalle con resumen + badge ámbar contador en sidebar item CRM + polling 30s.
- **Geo expansion**: `KnowledgeBase[__PLATFORM__/geo_regions]` enriquecido a **12 países LATAM+ES+US+BR (295 regiones / 1345 ciudades)** con merge sin duplicados — JMC puede recibir clientes de AR/BR/MX/PE/CL/EC/VE/UY/PY/ES/US sin tocar código. Backup pre-merge en S3 `clientes-bot-backups-235565749479/backups/geo_regions/`.
- **Multi-tenant safe**: `config_pro.pii_review_notify_to` (default `"all"` → owner + agentes activos `Agents` + emails `UserMapping`) — cualquier tenant nuevo recibe push automático sin config.
- **Test E2E real producción**: Flow PII v6 PUBLISHED en Meta (ID `4280696278819211`) + lead `573003723786` completó flow → buffer guardado → mensaje con resumen + botones → click "✅ Correcto" → datos persistidos en CRM con `customer_*` correctos + `pii_review_status=CONFIRMED_BY_AGENT` + audit log `PII_CONFIRM_MANUAL` ✅. Push verificado: PC ✅ + iOS ✅. Android pendiente PWA install local.
- **22 deploys totales**: Bot v220→v230, API v217→v223, Frontend `1cf05eb`→`fa61f4b`. **9 bugs raíz cerrados** durante la sesión: helpers faltantes tras reset CloudShell, anchors whitespace falsos OK, write fallos silenciosos (script reportaba OK sin escribir), Footer `${form.X}` cross-screen refs (Meta rechaza), REVIEW_SCREEN routing terminal+navigate cíclico, tokens stale UNREGISTERED, agent_id mismatch (token guarda por email no por "owner"), missing endpoint_uri en flow publish, lectura nfm_reply solo del payload (debe mergear con buffer de DATOS_SCREEN).
- **Filosofía león aplicada**: NO crons de retry para PII pendientes (síncrono o no se hace), NO REVIEW_SCREEN en Flow Meta (review nativo de WhatsApp via botones + chat = más auditable + visible al asesor), helper reutilizable `_create_or_update_meta_flow` (no duplicar 3 endpoints para scheduling/PII/futuros), persistencia idempotente (`if_not_exists` everywhere).
**Match Rate Meta esperado: 5.7 → 8-9/10** cuando llegue volumen real (cliente confirma → Lead enriquecido enviado con email+nombre+doc+phone+ciudad+país hash SHA-256 via CAPI).
**API v215 + Bot v207 + Frontend `b30b7f5`** — Sprint Marketing Completo + Atribución + Revenue Protection CERRADO 🦁🎠💰 (15-16 mayo, 2 sesiones ~20h total).
**Sprint Marketing Carousel + Polish** (15 mayo ~3h): Carruseles MARKETING en campañas masivas fuera ventana 24h. `/templates/list` enriquecido con `is_carousel`/`card_count`/`body`/`var_count`/`body_example`/`category` real desde Meta. Helper `_upload_image_to_meta_for_bulk` con cache `(image_url, phone_id)` anti Bug #36. Payload Meta `components.carousel.cards` con `media_id` por card. Paralelización 20 workers (2000 msgs en ~70s). Fallbacks variables vacías (`"amigo"`/brand). **Test E2E producción**: carrusel JMC 10 cards fuera ventana 24h ✅.
**Sprint Marketing UX** (15 mayo): Humanización plantillas (📅/💬/🎠) en `/marketing` y `/templates/manage`. Preview WhatsApp real con valores ejemplo. Validación obligatoria mapeo variables. Tabs **🔍 Por filtros** / **✋ Elegir del CRM** / **📋 Lista externa** (pegar números + import CSV/Excel sin tocar CRM). Editor visual carrusel con body custom neuroventas `{{1}}`+`{{2}}` + preview en vivo + selector servicios con thumbnail.
**Sprint Atribución + Revenue Protection** (15-16 mayo ~8h): Backfill 463 leads atribución desde AdsAttribution. 334 sesiones zombies `flow_state=ACTIVE` liberadas. TTL 7d en TypebotSessions_v2 + rehidratación desde CRM (cliente vuelve después de 7+ días = bot lo recuerda). Fix `_save_lead_attribution` con `if_not_exists` (sin `ConditionExpression`). Cron `attribution-sync-every-10min` como defensa redundante. Fallback `campaign_id` desde AdsAttribution en `send_meta_capi_event` + `handle_leads_sync_meta` (ROAS fix). 121 Purchase re-enviados a Meta CON campaign_id+city+fbc+document_id. Fix pax_count en 3 call sites de `trigger_payment_flow`. Fix Gemini "dejame verificar" eliminado (cascada sin reply inventado). Anti-hallucination: datos completos del servicio al prompt. Audio transcrito + imagen a S3 privado. `/conversations/active` orden DESC. Sync CAPI clamp 7d (Meta error 2804003). Breakdown razones de fallo en sync-meta.
**API v194 + Bot v191 + Frontend `8d7d698`** — Sprint Enhanced CAPI + Templates Manager + Bulk Send COMPLETO 🦁 (14 mayo sesión 3 final). Bulk Send: `/dashboard/marketing` envío masivo templates a leads filtrados por etapa/tags/servicio/inactividad + quotas por plan (Solo 100/Growth 1000/Agency ∞) + estimador costo USD + historial campañas + audit log + banner transparencia Meta. API v194 `POST /marketing/send-bulk` + `GET /marketing/campaigns`. (15 mayo, ~3h). **Carruseles MARKETING en campañas masivas**: `/marketing/send-bulk` ahora envía carruseles APROBADOS fuera de ventana 24h con `media_id` por card subido al `phone_number_id` del tenant (helper `_upload_image_to_meta_for_bulk` con cache `(image_url, phone_id)` anti Bug #36). `/templates/list` extendido con `is_carousel`, `card_count`, `body`, `var_count`, `body_example`, `category` real desde Meta. **Test E2E producción**: carrusel JMC 10 cards enviado a número real fuera de ventana 24h, recibido correctamente ✅. UX completa: humanización plantillas (📅 Recordatorio / 💬 Seguimiento / 🎠 Carrusel) en `/marketing` y `/templates/manage`, preview WhatsApp real con valores ejemplo en verde negrita, validación obligatoria mapeo de variables (botón disabled si faltan), tabs **🔍 Por filtros** vs **✋ Elegir uno por uno** con multi-select checkboxes, estimador costo carrusel $0.06 USD/msg vs $0.025 texto. **Diferenciador competitivo**: ni Manychat ni Wati permiten enviar carruseles MARKETING desde su UI nativa.
**API v194 + Bot v191 + Frontend `8d7d698`** — Sprint Enhanced CAPI + Templates Manager + Bulk Send COMPLETO 🦁 (14 mayo sesión 3 final). Bulk Send: `/dashboard/marketing` envío masivo templates a leads filtrados por etapa/tags/servicio/inactividad + quotas por plan (Solo 100/Growth 1000/Agency ∞) + estimador costo USD + historial campañas + audit log + banner transparencia Meta. API v194 `POST /marketing/send-bulk` + `GET /marketing/campaigns`.
**API v193 + Bot v191 + Frontend `6c91137`** — Sprint Enhanced CAPI + Templates Manager + Sprint E COMPLETO 🦁 (14 mayo sesión 3, ~6h). Enhanced CAPI: PII completo en TODOS los eventos (email+name+city+document SHA-256 + fbc click ID) + value=regular_price + Lead re-send con PII. **Templates Manager UI**: `/dashboard/templates/manage` crear/listar/borrar templates UTILITY+MARKETING + preview WhatsApp + banner costos Meta + auto-refresh status. CRM: tarjeta lead muestra anuncio+click ID+email+ciudad+documento. **Meta Match Rate: 4/10 → 7-8/10.**
**API v192 + Bot v191 + Frontend `4c51579`** 
— Sprint Enhanced CAPI + Sprint E COMPLETO 🦁 (14 mayo sesión 3, ~6h). Enhanced CAPI: PII completo en TODOS los eventos (email+name+city+document hash SHA-256 + fbc click ID formato `fb.1.{ts}.{ctwa_clid}`) + value=regular_price (no anticipo) en Purchase. Bot wrapper `send_meta_capi_event` auto-enriquece desde Leads_CRM_v2. API bulk import + report-purchase enriquecidos con city+fbc+doc+regular_price. Lead re-send con PII tras captura email. CRM: tarjeta del lead muestra anuncio (campaign_id) + click ID + email + ciudad + documento. 
**Meta Match Rate esperado: 4/10 → 7-8/10.** Falta IP+UserAgent para 9-10 (requiere pixel en landing, sprint separado).
**API v191 + Bot v189 + Frontend `bbcdbb7`** — Sprint E COMPLETO + Multi-tenant MASTER 🦁
**API v191 + Bot v189 + Frontend `bbcdbb7`** — Sprint E COMPLETO + Multi-tenant MASTER 🦁 (13-14 mayo, 2 sesiones ~20h total, 12 sprints + 10 bugs producción). 
**Sprint E cerrado 100%**: captura 5 campos PII post-scheduling (name+dni+phone+email+city) single + multi-persona (N asistentes × 5 campos c/u con validación duplicados), email confirmación Resend multi-idioma, cron recordatorios cascada (WA libre→template Meta→email) cada hora con idempotencia, botones interactivos 1h antes (Confirmar/Reprogramar/Cancelar), no-show detection, lead scoring metadata en handoff. 
**Templates Meta APPROVED**: `appointment_reminder_v1` + `follow_up_v1` en ES (auto-create 4 idiomas ES/EN_US/PT_BR/FR). **Multi-tenant funnel_mode** (6 modos) + Lead Qualifier IA + Shipping step-machine + Payment link reuse + Welcome menu fix debounce + Anti-hallucination prompt regla 24b + FLOW_STATE_GUARD_UNIVERSAL en debounce. **Bot v153→v189** (36 versiones). **API v185→v191** (6 versiones). 
**Frontend 7 commits**. 2 EventBridge rules nuevas (templates-poll-6h + reminders-hourly). Multi-tenant safe, escalable a 1M tenants sin tocar código.
**v185** — Sprint Wizard 2.0 Step 8 Premium CERRADO 🦁 (13 mayo madrugada). Step 8 separado en 2 fases (incrustar texto con preview → lanzar con every-guard), dropdown copy→imagen por variante, borrador localStorage keyed por `company_id` con auto-save debounced 500ms + TTL 30d + warning si servicio borrado + limpieza post-launch, botón "+N más" con cap configurable desde `config_pro.wizard_max_images_per_round` (default 10), regenerar todo con confirm. 
**Backend (API v185)**: cuota movida de `generate-strategy` (texto barato) a `generate-images-preview` (donde está el costo real Gemini Image), append y regenerar-todo cobran 1 wizard cada uno (justo y predecible), strategy gratis. Multi-tenant safe, escalable a 1M tenants sin tocar código. Frontend `a904590`, test E2E con CloudWatch confirmando `wizard_quota consumed: company=JMC source=plan_unlimited append=False|True` ✅.
**v179** — Sprint Brand DNA + Wizard 2.0 CERRADO 🦁 6 fases completadas en 1 sesión maratón (12-13 mayo).Brand DNA con scraping multi-source + Gemini (API v165). Brand Assets Library con 5 endpoints CRUD + thumbnails + Bucket Policy S3 (API v167). Wizard Backend 9 endpoints: check-quota + generate-strategy (10 Andromeda prompts) + generate-images-preview (10×512px paralelo) + generate-images-final (3×1K) + generate-copies (5 variantes social proof legal) + launch multi-canal + billing packs wizards (API v168-v179). Wizard Frontend 8 pasos full-screen (`246103f`). Andromeda overlay+resize via Gemini sin Pillow (API v174-v177). Cross-tenant siempre ON (network effect, API v166 + TyC sección 12). 5 tablas DDB nuevas (BrandDNA + BrandAssets + AdsCreativeLibrary + AdsHookVariants + AdsCrossTenantPool). 3 productos Wizard Packs en Lemon Squeezy. Bucket Policy S3 para brand-assets público. 27 deploys backend + 8 commits frontend.
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
- `WhatsApp_Typebot_Bridge` — Bot WhatsApp multi-tenant strict (~11,292 líneas, **v242** — `_internal_action=mark_paid_manual` handler para pago externo del asesor (CAPI Purchase + stock + post_flow + mensaje cliente). v241 fix CAPI Match Rate: `_send_meta_event` acepta country/region/zip + fix bug external_id sobreescritura (array de N IDs) + wrapper lee `customer_document_number` canónico. v240 — Fix M4 ad_id→campaign_id via Meta Graph + cache 24h + guarda `source_first_ad_id` separado. Previamente v236 AUDIT-1: guards defensivos `search_memory` + `get_services_catalog` guards defensivos `search_memory` + `get_services_catalog` (empty company_id → return None/[]) + `_cid_pay` blindado arriba del webhook post-pago (Bug 9.A/B raíz cerrado). Previamente Sprint Revenue Protection:
 `_save_lead_attribution` con `if_not_exists` idempotente + fallback campaign_id desde AdsAttribution + pax_count en 3 call sites + anti-hallucination datos servicio completo + Gemini cascada sin reply mentiroso + audio transcrito S3 + imagen S3 privado + rehidratación CRM + TTL 7d sesiones + ACTIVE passive state + WEBHOOK_RAW debug log) — Sprint E completo: captura PII 5 campos single+multi-persona + email confirmación Resend + cron recordatorios cascada WA→template→email + botones 1h (confirmar/reprogramar/cancelar) + no-show + FLOW_STATE_GUARD_UNIVERSAL debounce + funnel_mode 6 modos + Lead Qualifier + Shipping step-machine + payment reuse + regla 24b; Calendly mode: CalendarPicker v7.3 (`min_date`/`max_date`/`unavailable_dates`) + `_get_available_dates` y `_get_available_slots` con cascada svc→tenant→default + `available_weekdays` y `booking_mode` por servicio + handler async `_internal_action=post_booking_messages` (no bloquea flow) + `post_payment_flow=send_group_link` con mensaje custom + `screen` y `selected_slot` del nivel raíz v6.0/7.3 + scheduling_flow_id desde config_pro) — multicanal activo IG+FB via Gemini + multi-carousel por campaign_id + debounce async + anti-silencio + fragmentación + typing/read receipts + cascada 3 LLM + multi-tenant tokens
- `SaaS_API_Handler` — incluye **`POST /scheduling-flow/setup`** auto-onboarding multi-tenant del WhatsApp Flow CalendarPicker v7.3 (crea + sube JSON + publica + guarda flow_id en config_pro, idempotente)
- `SaaS_API_Handler` — (~21,028 líneas, **v239** — Endpoint nuevo `/payments/mark-paid-manual` (asesor marca pago externo + escribe StudentPaymentState + Leads_CRM_v2 + invoca bot async). v238 Fix ads/analyze: maxOutputTokens 2000→4096 + thinkingConfig.thinkingBudget=0 + cascada 3 modelos + texto parcial si MAX_TOKENS. v237 Fix apply-action: 8 acciones (pausar/escalar/reducir/activar + ab_test/refresh_creative/change_targeting/recharge_budget UI-only con mensaje guía). v231 endpoint nuevo `/leads/sync-meta-leads` re-envía Lead event con PII enriquecida retroactiva. v230 `_send_meta_event` acepta country/region/zip + sync-meta lee customer_document_number canónico + fix external_id sobreescritura. v229 Bug #45 `handle_import_leads` escribe customer_* canónicos (email/document/city/region/country/first_name/last_name) en vez de legacy. v228 — Fix release preserva flow_state mid-captura (CAPTURING_ATTENDEES / AWAITING_LEAD_DETAILS / AWAITING_PAX_COUNT) + mensaje reanudación cliente. v227 — Fix `handle_ads_analyze`: `_get_attribution_data` (no existía) → `_b65_get_attribution_for_campaign` + keys correctas. Previamente v224 AUDIT-1 fix `/admin/overview` reserved keyword `action`. v215 Marketing:
 `/templates/list` enriquecido + `/marketing/send-bulk` carrusel + paralelización 20w + fallbacks variables + body_text custom carrusel + sufijo timestamp único + phone_list acepta dicts + `/chat/media` presigned URL + `/conversations/active` DESC + sync-meta campaign_id+PII fallback AdsAttribution + clamp 7d + breakdown razones + `/attribution/sync-crm` cron endpoint) + B6.5 cron + C1-C7 tenants + Feature Flags + Quotas + Message Packs + **Affiliates** + Multi-carousel + Release con notif + **Feature Overrides (Fase D)** + **Impersonate completo (Fase E)** + **Auto-onboarding Scheduling Flow + Templates Reminder/Follow-up multi-idioma** + **Wizard 2.0 Premium** + **Multi-tenant funnel_mode + Lead Qualifier whitelist** + **Cron poll templates Meta** + **Templates Manager UI** + **Marketing Carousel Bulk Send** (~19,210 líneas, **v199** — `/templates/list` enriquecido con `is_carousel`/`card_count`/`body`/`var_count`/`body_example`/`category` real desde Meta + `/marketing/send-bulk` detecta carrusel + helper `_upload_image_to_meta_for_bulk` cache `(url, phone_id)` + payload Meta `components.carousel.cards` con `media_id` por card) — conversations/active FB/IG + multi-carousel + carousels_catalog + emails afiliados + cron payout
- `WhatsApp_Remarketing` — Follow-up + auto-return + renewal (~505 líneas, **v7** — delays variables por intent)
- `promote-memory-candidates` — Auto-promoción memoria source-aware (~155 líneas, **v2** — fix import os + SOURCE_THRESHOLDS human_agent=2 + preserva source SK)
### Tablas DynamoDB (19 — todas con PITR) — multi-tenant strict
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
- **EventBridge crons:** `ads-daily-optimize` ENABLED (6 AM UTC diario — B6.5 recomendaciones IA), `ads-ingestion-daily` ENABLED (7 AM UTC — Motor 1 Content Ingestion AI Creative Loop), `ads-variant-learn-daily` ENABLED (8 AM UTC — Motor 5 Publish+Learn AI Creative Loop), `meta-token-renewal` ENABLED (domingos 5 AM UTC), `promote-memory-every-5min` ENABLED, `remarketing-every-hour` ENABLED, `affiliate-payout-batch-monthly` ENABLED (día 5 cada mes 8 AM UTC), `affiliate-release-commissions-daily` ENABLED (4 AM UTC = 11 PM CO), `trial-expire-daily` ENABLED (8 AM UTC = 3 AM CO — expira trials 14d + email warning 1-3d), `support-cleanup-hourly` ENABLED (cada hora — Fase E auto-expire + email resumen), `feature-overrides-expire-daily` pendiente (Fase D-4 skip), `templates-poll-status-6h` ENABLED (cada 6h — refresca estado templates Meta PENDING→APPROVED), `attribution-sync-every-10min` ENABLED (cada 10 min — sync AdsAttribution → Leads_CRM_v2 workaround bug _save_lead_attribution)(cada hora — recordatorios citas 24h+1h antes con cascada WA→template→email + no-show detection)
---
## ✅ MÓDULOS COMPLETADOS
### 🤖 Bot WhatsApp
- [x] IA conversacional Gemini + neuroventas + memory hint
- [x] Multi-pasarela pagos (Wompi, PayPal, MercadoPago, OpenPay, PayU, Bold)
- [x] **Billing internacional**: Lemon Squeezy (USD) ya integrado ✅ — Stripe NO disponible para merchants Colombia. Planes Starter $97 / Growth $297 / Agency $497 en USD via LS. COP via Wompi/Bold ya integrado.
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
- [x] **Enhanced CAPI** (Bot v191): PII completo en todos los eventos (email+name+city+doc SHA-256 + fbc click ID formato `fb.1.{ts}.{ctwa_clid}`) + value=regular_price (no anticipo) + Lead re-send con PII tras captura email. Match Rate 4/10 → 7-8/10.
- [x] **Templates Manager** (API v193 + Frontend `6c91137`): crear/listar/borrar templates custom UTILITY+MARKETING via Meta Graph API + preview WhatsApp + banner costos + auto-refresh status
- [x] **Marketing Carousel Bulk Send** (API v199 + Frontend `e1a5f15`): envío masivo de carruseles MARKETING aprobados fuera de ventana 24h. Helper `_upload_image_to_meta_for_bulk` multi-tenant. UX completa: labels humanos, preview WA real con valores ejemplo, validación mapeo de variables, multi-select leads. **Test E2E producción ✅**.
- [x] **PII Review Multi-tenant** (MP-1 a MP-4 — Bot v220→v230 + API v217→v223 + Frontend `fa61f4b`): Pipeline completo de captura datos cliente post-pago con revisión humana antes de Meta CAPI. **Flujo:** Cliente paga → Flow scheduling → Flow PII (DATOS+UBICACION) → bot guarda buffer + manda mensaje con resumen + [✅ Correcto / ✏️ Editar] → click "Correcto" → persiste CRM + Enhanced CAPI con PII completa + email confirmación. **Componentes:** helper genérico `_create_or_update_meta_flow` (reusable scheduling/PII/futuros) + endpoint `POST /flows/pii/setup` multi-idioma 6 locales (es/en_US/pt_BR/fr/it/de) auto-disparado en onboarding + Flow JSON v6 con placeholders dinámicos `${data.X}` por asistente (Titular vs N) + auto-normalize phone con `phone_code` del país + validación cruzada estricta (email/doc/teléfono únicos entre asistentes) + endpoints `GET /pii/pending` paginado + `POST /pii/confirm-manual` + `POST /pii/discard` + audit log + frontend banner ámbar CRM + modal + badge sidebar + push FCM real (reusa `send_push_to_agent` + scan `UserMapping` para tokens por email) + 12 países geo expansion (295 regiones / 1345 ciudades). **Bug #9 cerrado de raíz** con helper `_ensure_lead_created_at` en todos los `update_item` Leads_CRM_v2. **Test E2E producción ✅** Flow PII v6 PUBLISHED Meta (ID `4280696278819211`).
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
- [x] **Templates Manager API** (v193): `GET /templates/list`, `POST /templates/custom` (UTILITY/MARKETING), `DELETE /templates/custom`, category dynamic
- [x] **Enhanced CAPI API** (v192): bulk import + report-purchase enriquecidos con city+fbc+doc+regular_price desde Leads_CRM_v2
- [x] **Bulk Send API** (v194): `POST /marketing/send-bulk` envío masivo templates + `GET /marketing/campaigns` historial + quotas por plan + audit log
- [x] **Marketing Carousel Bulk Send** (API v197-v208 + Frontend `b30b7f5`): carruseles MARKETING fuera ventana 24h con `media_id` por card. Paralelización 20 workers. Body custom neuroventas `{{1}}`+`{{2}}`. Editor visual carrusel con preview WhatsApp + selector servicios. 3 tabs destinatarios (filtros/CRM/lista externa pegar+CSV). Fallbacks variables vacías. Sufijo timestamp único anti-colisión Meta. **Test E2E producción ✅**.
- [x] **Revenue Protection** (Bot v198-v207 + API v200-v215): Backfill 463 leads atribución. 334 sesiones zombies liberadas. TTL 7d + rehidratación CRM. Fix pax_count 3 call sites. Anti-hallucination datos servicio. Fix Gemini reply mentiroso. Audio transcrito + imagen S3 privado. Presigned URL 24h. Conversations DESC. Sync CAPI campaign_id+PII fallback AdsAttribution. Clamp 7d. Cron `attribution-sync-every-10min`. **121 Purchase re-enviados CON campaign_id ✅**.
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
### 💰 Fase K — Billing avanzado (Lemon Squeezy + Wompi — NO Stripe)
> Stripe NO opera para merchants en Colombia. Billing USD = Lemon Squeezy (ya integrado). Billing COP = Wompi (ya integrado). Stripe Connect para payouts afiliados USD → reemplazar por LS Affiliates o transferencia manual.
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
- [x] `BrandDNA` (PK: `company_id`, TTL 90d, PITR ✅) ✅ creada Sprint Brand DNA (12 mayo) — ADN de marca con scraping multi-source + Gemini
- [x] `BrandAssets` (PK: `company_id`, SK: `asset_id`, GSI: `asset_type-index`, TTL 365d, PITR ✅) ✅ creada Sprint Brand Assets (12 mayo) — biblioteca de fotos del negocio
- [ ] Modificar `KnowledgeBase config_pro`: agregar `feature_overrides`, `tenant_notes`, `tags`, `events_timeline`, `pixel_id`, `business_vertical`, `ads_cross_tenant_optin`, `wizards_pack_balance`
- [ ] Modificar `Leads_CRM`: agregar `source_campaign_id`, `source_type`, `paid_amount`
### ⚙️ Env vars nuevas
- `SUPER_ADMIN_EMAILS` (ya existe) — bootstrap inicial
- `IMPERSONATE_HMAC_SECRET` — firma de tickets
- `PLAN_FEATURES_JSON` — catálogo de features + quotas por plan (Sprint 1)
- ~~`STRIPE_SECRET_KEY`~~ — NO APLICA (Stripe no opera en Colombia). Billing USD = Lemon Squeezy. Billing COP = Wompi.
- ~~`STRIPE_CONNECT_CLIENT_ID`~~ — NO APLICA. Payout afiliados USD via LS o transferencia manual.
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
### 23-24 mayo 2026 — Sprint Ads Pro v3 + Biblioteca + Wizard Video (sesión maratón 25h) 🦁🎬📚
> 36h en total (madrugada + mañana + noche). 12 bugs/lecciones cerrados. Wizard Ads completamente reescrito.
#### Bug #59 (OPERACIONAL 🟠) — Pillow layer Python runtime mismatch
- **Síntoma**: `cannot import name '_imaging' from 'PIL'` en Lambda con runtime python3.14, layer pillow:1 era para 3.9-3.12.
- **Fix**: rebuild layer con `pip --platform manylinux2014_x86_64 --python-version 3.14 --only-binary=:all: Pillow` + publish-layer-version con compatible-runtimes=python3.14. Layer pillow:2.
- **Lección**: layers Python deben matchear runtime EXACTO. Verificar con `aws lambda get-layer-version --query CompatibleRuntimes` antes de asumir compat.
#### Bug #60 (BUG NIVEL HTML 🤡) — curl -L de GitHub raw retornó HTML, no binario
- **Síntoma**: `Inter-Bold.otf` 300KB descargado con curl, deploy a Lambda OK, pero `OSError: unknown file format` al cargar fuente. Texto overlay caía a fuente bitmap default 10px.
- **Causa raíz**: `head -c 200 fonts/Inter-Bold.otf` reveló `<!DOCTYPE html><html lang="en"...` — era la página de GitHub renderizada, NO el archivo binario.
- **Fix**: bajar TTF directo de Google Fonts URL pública. Validar con `head -c 16 archivo | od -c` (debe empezar con `\0\1\0\0` para TTF o `OTTO` para OTF).
- **Lección 32**: `ls -lah` muestra tamaño aunque el archivo sea HTML basura. SOLO `head -c X | od -c` confirma binario válido. Bug que se demora horas si no haces el check correcto.
#### Bug #61 (OPERACIONAL 🟠) — deploy_api.sh no incluía fonts/ al staging
- **Síntoma**: tras deploy, `font_path=''` en logs aunque las fuentes estaban en pkg/fonts/.
- **Causa**: el copy al staging copiaba solo lambda_function.py, no el directorio fonts/.
- **Fix manual**: `mkdir /tmp/api/api && cp -r /tmp/api_pkg/pkg/fonts /tmp/api/api/ && cp lambda_function.py ...` antes de `~/.deploy_api.sh`.
- **Lección 33**: scripts de deploy deben incluir TODOS los assets, no solo el .py. Validar con `unzip -l function.zip | grep fonts` antes de confiar en deploy OK.
#### Bug #62 (PROMPT 🤖) — Sustantivos negativos activan tokens en Imagen 3
- **Síntoma**: prompt outpainting con "DO NOT add walls, fences, buildings" → modelo dibujaba muros y edificios en los bordes.
- **Causa**: en CFG Scale alto (21+), nombrar objetos negados los inyecta en el grafo de atención.
- **Fix**: prompt sin sustantivos negativos. Usar "extend background environment, negative space, texture synthesis" + reglas positivas de continuidad.
- **Lección 34**: prompts de difusión NO procesan negaciones como contratos legales. Estrategia correcta: silenciar lo prohibido + reforzar lo deseado positivamente.
#### Bug #63 (LIMITACIÓN MODELO 🤖) — Vertex Imagen 3 outpainting no es 100% pixel-perfect
- **Síntoma**: máscara con dilation=0.0 (estricta), modelo aún tocaba pixels del centro: cambiaba pantalón por shorts en vertical, inventaba muros en horizontal.
- **Causa**: Imagen 3 tiene "bleed" de ~5% en máscaras binarias. La doc oficial promete pixel-perfect pero no lo es en práctica.
- **Decisión arquitectónica**: abandonar outpainting con Vertex en producción. Usar Pillow crop puro desde imagen wide-composition de Gemini (filosofía "es más fácil cortar que agregar"). Vertex queda como helper futuro disponible.
- **Lección 35**: documentación de modelos IA promete más de lo que entrega. Validar con tests reales antes de comprometer arquitectura.
#### Bug #64 (FILOSOFÍA 🦁) — "Es más fácil cortar que agregar"
- **Insight de Juan**: en vez de pelear con outpainting (Gemini regenera/alucina), generar imagen 1024×1024 con composición wide (sujeto en centro 50% + breathing room) → Pillow crop centro a vertical/horizontal → resize HD a 1080/1920.
- **Resultado**: 0 alucinaciones, costo $0 extra, multi-tenant agnóstico, todos los formatos perfectos.
- **Lección 36**: cuando un modelo no respeta input, no insistas con prompts. Cambia la estrategia: genera más grande y recorta, o genera nativo en cada aspect ratio. La mejor solución no siempre es la más "inteligente".
#### Bug #65 (DIAGNÓSTICO 🔍) — bash `ls -lah` engaña con archivos HTML
- Mencionado en Bug #60. La lección 32 aplica.
#### Bug #66 (RACE FLUJO 🚨) — Doble flujo scheduling: Flow PII inmediato + chat AWAITING_LEAD_DETAILS
- **Síntoma**: tras agendar cita, llegaba Flow PII al usuario INMEDIATO + 3 mensajes post_booking + "Por último necesito tus datos" (chat) — dos rutas paralelas pidiendo lo mismo.
- **Causa raíz**: cuando se agregó Flow PII (Sprint MP-2 v222), no se desactivó la rama vieja de `_pending_lead_details` en async post_booking. Ambas rutas activas en producción durante 5 días sin detectar.
- **Fix Bot v243**: PII Flow movido al FINAL del async post_booking (después de los 3 mensajes) + rama chat eliminada (era código muerto). Single + multi-persona unificados con Flow recursivo de `_trigger_pii_flow(asistente_num=N+1)`.
- **Lección 37**: al agregar feature nueva que reemplaza una vieja, el viejo flujo debe DESACTIVARSE explícitamente, no quedar "por si acaso". Auditoría obligatoria: buscar todas las rutas que escriben el mismo flow_state.
#### Bug #67 (FRONTEND React 🐛) — useEffect con array `[]` inline causa loop infinito
- **Síntoma**: chat mobile lentísimo, botones tardaban en reaccionar, congelaba al hacer back. Desktop normal.
- **Causa**: `useEffect(() => { fetch(/services); setServices(d.services) }, [servicesList, companyId])` con `servicesList` que el padre pasaba como `[]` inline → nuevo array cada render → effect dispara → setState → re-render → nuevo `[]` → loop. CPU mobile = peor.
- **Fix (Juan)**: cambiar deps a `[companyId]` solamente + chequear `servicesList.length > 0` adentro + `eslint-disable-next-line react-hooks/exhaustive-deps` justificado en comentario.
- **Lección 38**: NUNCA usar como dependencia de useEffect un array/objeto que el padre pueda pasar inline. Soluciones: useRef para "frozen" reference, o solo primitivos (companyId) en deps.
#### Bug #68 (ROUTING) — `/register` capturaba `/ads/video/register`
- **Síntoma**: endpoint nuevo POST /ads/video/register devolvía error "email y company_id son requeridos" (de handle_register).
- **Causa**: el routing usaba `path.rstrip("/").endswith("/register")` que matchea cualquier URL terminando en `/register`. Como estaba ANTES de los routes /ads/* en el elif, ganaba siempre.
- **Fix API v275**: cambiar a `path.rstrip("/") == "/register"` (match exacto).
- **Lección 39**: NUNCA usar `endswith` en routing — usar match exacto o prefix. Pattern matching de path debe ser estricto.
#### Bug #69 (HELPER MULTI-LAMBDA) — `get_config_pro` existe en Bot, NO en API
- **Síntoma**: `_get_library_cap` retornaba siempre 50 (default starter) aunque JMC es enterprise/owner_lifetime.
- **Causa**: helper `get_config_pro(client_id)` está definido en `WhatsApp_Typebot_Bridge` (Bot), NO en `SaaS_API_Handler` (API). Mi función llamaba algo inexistente → except silencioso → fallback default.
- **Fix**: en API, leer DDB directo con projection limitada (`#p, plan_source`). NO asumir que helpers del Bot están en API.
- **Lección 40**: helpers no son globales entre Lambdas. Si una función está definida en un Lambda, en otro hay que reimplementarla o auditar antes de llamarla. Cuando un valor "imposible" persiste, agregar `logger.info(f"DEBUG: ...")` con todas las variables temporales.
#### Bug #70 (DEPLOY 📂) — Frontend: archivo correcto en directorio equivocado
- **Síntoma**: tras commit, `/dashboard/ads/library/page.tsx` tenía código del WIZARD DE VIDEO. `/video-wizard/page.tsx` NO existía.
- **Causa**: Juan pegó el contenido del archivo D (video-wizard) en el path del archivo C1 (library) por error de copy/paste.
- **Fix**: PowerShell `mkdir video-wizard && move library/page.tsx video-wizard/` + crear library/page.tsx nuevo con código correcto.
- **Lección 41**: SIEMPRE verificar el SHA del frontend después de commits grandes via `read_file(commit_sha=SHA, file_path=X)`. Si el archivo tiene contenido distinto al esperado, detectar antes de seguir.
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
### 15 mayo 2026 — Sprint Marketing Carousel + Polish CERRADO 🦁🎠
> Sesión ~3h. Cerró el envío masivo de **carruseles MARKETING fuera de ventana 24h** (lo que ningún competidor LATAM tiene en su UI). 3 deploys API (v197/v198/v199) + 4 commits frontend (`db06bfe` → `695156a` → `2611ba9` → `e1a5f15`). Test E2E real con tarjeta Meta validando carrusel de 10 cards entregado a número personal del founder.
#### Auditoría inicial (regla #5: 1 cambio por vez)
- [x] **Hallazgo crítico**: 4 endpoints de carrusel YA EXISTÍAN al 100% (`POST /templates/carousel` en L7671, `GET /templates/carousel`, `PUT /templates/carousel/activate`, `DELETE /templates/carousel`). Los carruseles ya nacían con `category: MARKETING` en Meta. **Cero código nuevo de creación.**
- [x] **Gap real identificado**: `handle_marketing_send_bulk` (L7156) solo buscaba en `templates` (auto) y `custom_templates` — NO leía `carousels_catalog`. Por eso bulk send daba "Template no encontrado" para carruseles. **El sprint era plumbing, no greenfield.**
#### Patch 1 — `/templates/list` incluye carruseles (API v197)
- [x] `handle_list_templates` lee también `carousels_catalog` y devuelve carruseles APPROVED unificados con flag `is_carousel: true` + `card_count` + `label` + `body: "Catalogo visual con N productos/servicios"` + `category: MARKETING` + `editable: false`
- [x] Skip silencioso de carruseles no APPROVED (PENDING/REJECTED no aparecen en marketing UI)
- [x] Test verificado: `JMC` ahora retorna 3 templates (2 auto + 1 carrusel) en vez de 2
#### Patch 2 — `/marketing/send-bulk` soporta carruseles (API v198)
- [x] **Helper `_upload_image_to_meta_for_bulk(image_url, phone_number_id, access_token)`**: descarga imagen → POST a `/{phone_id}/media` → retorna `media_id`. Cache 15 min keyed por `(image_url, phone_number_id)` (anti Bug #36).
- [x] **Cache `_bulk_media_cache`**: dict global keyed `f"{url}::{phone_id}"`. Multi-tenant safe.
- [x] **Lookup extendido en `handle_marketing_send_bulk`**: tras buscar en `templates` y `custom_templates`, busca también en `carousels_catalog`. Si encuentra match, setea `is_carousel=True` + `carousel_data` con el item completo.
- [x] **Payload Meta carrusel**: si `is_carousel`, lee `services_catalog` del tenant → toma N servicios activos con precio → sube imagen a Meta (con cache) por card → arma `components.carousel.cards` con `card_index`, header image (media_id), body (nombre + precio), 2 botones quick_reply (`svc_{slug}` + `info_{slug}`). Pad para matchear `card_count` exacto (Meta lo exige).
- [x] **Fallback robusto**: si falla upload de cualquier imagen → recipient queda en `failed` con error claro, no rompe la campaña entera.
- [x] **Reusa lógica del bot**: mismo payload structure que `_enviar_catalogo_template_carousel` (L1744) — cero reinvención.
#### Patch 3 — `/templates/list` enriquece body real desde Meta (API v199)
- [x] **Bug latente detectado**: templates `auto` solo guardaban `template_name`/`template_id` en `config_pro.templates` — sin `body` ni count de variables. Frontend marketing mostraba preview vacío → cliente no sabía qué iba a enviar → mapeo de variables ciego.
- [x] **Fix multi-capa**: el polling de status a Meta (L7541) ahora también extrae `body`, `var_count` (regex `\{\{N\}\}`), `body_example` (primer entry de `example.body_text`), y `category` real desde el response de `/{waba_id}/message_templates`. Cero round-trips extra a Meta (reusa el GET existente).
- [x] **Skip guard para carruseles**: `if t.get("is_carousel"): continue` evita sobreescribir el body descriptivo del carrusel.
- [x] **Test verificado**: `appointment_reminder_v1` → 5 variables (Juan, Seminario Tiro 9mm, sabado 17 mayo, 10:00 AM, Escuela JMC Guarne). `follow_up_v1` → 2 variables (Juan, Seminario Tiro 9mm). `catalogo_jmc_10cards` → 0 variables.
#### Frontend Patch 1 — Humanizar plantillas en `/dashboard/marketing` (Frontend `db06bfe`)
- [x] Diccionario `TEMPLATE_LABELS` con metadata humana para plantillas auto conocidas (`appointment_reminder_v1` → 📅 Recordatorio de cita, `follow_up_v1` → 💬 Seguimiento comercial).
- [x] Helper `humanizeTemplate(t)` con fallback inteligente (capitaliza nombre técnico si no está mapeado).
- [x] Card descriptiva indigo con título + descripción + caso de uso ideal.
- [x] Preview del body del template (no solo el nombre técnico).
#### Frontend Patch 2 — Preview carrusel + estimador costo (Frontend `695156a`)
- [x] `humanizeTemplate` extendido para `is_carousel`: emoji 🎠 + label cliente + count cards.
- [x] Card morada describiendo qué es el carrusel + "lo último en tecnología WhatsApp".
- [x] Preview visual con miniaturas de cards apiladas (máx 5 visibles + "+N más").
- [x] Estimador costo actualizado: carrusel $0.06 USD/msg vs marketing $0.025 vs utility $0.01.
#### Frontend Patch 3 — Preview WA real + validación vars + multi-select leads (Frontend `2611ba9`)
- [x] **Preview WhatsApp REAL**: usa `body_example` de Meta para mostrar el mensaje exacto que recibirá el lead con valores ejemplo en `*negrita*` (rendered con fondo emerald + texto bold). Cliente entiende qué van a recibir sus leads ANTES de enviar.
- [x] **Validación obligatoria mapeo**: dropdowns rojo (vacío) → verde (mapeado). Botón "Enviar" DISABLED si quedan variables sin mapear. Banner rojo arriba del botón explicando qué falta.
- [x] **Opciones extendidas mapeo**: agregadas `appointment_date`, `appointment_time`, `appointment_location`, `custom_value` (texto fijo). Antes solo 4, ahora 8.
- [x] **Tabs destinatarios**: 🔍 Por filtros (default, comportamiento previo) vs ✋ Elegir uno por uno (NUEVO).
- [x] **Multi-select leads**: lista scrollable con checkboxes individuales. Botón "Seleccionar todos los visibles". Counter en vivo. Backend ya soportaba `phone_list` → cero patch backend.
- [x] **Botón con texto dinámico**: "⚠️ Mapea variables" / "⚠️ Selecciona destinatarios" / "🚀 Enviar a N destinatarios" según estado.
#### Frontend Patch 4 — Humanizar `/dashboard/templates/manage` (Frontend `e1a5f15`)
- [x] Mismo `TEMPLATE_LABELS` + helper `humanize()` reaplicado.
- [x] Tarjetas rediseñadas: emoji + título humano grande arriba + subtítulo descriptivo + preview del body (verde WhatsApp) + badges contextuales (🤖 Sistema / ✨ Personalizada / 🎠 Carrusel) + nombre técnico discreto al fondo en mono gris (para soporte/debugging).
- [x] Cliente entiende **inmediatamente** qué es cada plantilla sin tener que abrir nada.
#### Test E2E producción ✅
- [x] **Enviado**: 1 carrusel `catalogo_escuela_de_tiro_jmc_10cards` (10 cards) al número del founder `573017881094` vía `/marketing/send-bulk` con `phone_list` explícita.
- [x] **Recibido**: carrusel completo con las 10 cards renderizadas en WhatsApp ~5 segundos después. **Fuera de ventana 24h** (mensaje frío legítimo gracias a `category: MARKETING`).
- [x] **Costo real**: $0.06 USD a tarjeta Meta del tenant.
- [x] **Validación clave**: este es el feature que NINGÚN competidor LATAM (Manychat/Wati/Respond.io) permite hacer desde su UI nativa.
#### Lecciones nuevas (sesión 15 mayo)
59. **🦁 Auditar antes de codear (Lección 48 reincidida)**: cuando el cliente pide "agregar X feature", primero verificar si ya existe parcialmente. Sprint planeado a 17h se redujo a 3h porque los 4 endpoints de carrusel ya estaban hechos — solo faltaba el plumbing del `send-bulk`. Filosofía león: ¿esto cabe dentro de algo que ya funciona?
60. **🟢 Body de templates auto requiere refresh desde Meta**: cuando el sistema crea templates automáticamente (sin que el cliente ingrese el body), DDB solo tiene `template_name` + `template_id`. El `body` real vive en Meta. Patrón: cuando hagas polling de status, aprovechar para extraer también `body`/`example`/`category` y enriquecer el response del frontend. Cero round-trips extra.
61. **🟢 Helper de upload con cache `(input, emisor)` keyed (Lección 30 reusada)**: media_ids de Meta están atados al `phone_number_id` del uploader. Cache `_bulk_media_cache` con key `f"{url}::{phone_id}"` previene cross-tenant leaks + ahorra requests a Meta cuando un tenant manda múltiples campañas con las mismas imágenes del catálogo.
62. **🦁 Diferenciador real vs gimmick**: enviar carrusel MARKETING fuera de ventana 24h no es feature cosmética — es **upsell visual sin ventana de conversación**. Es el equivalente a un email con catálogo visual pero en WhatsApp. Manychat/Wati lo permiten via API si el cliente codea, pero NO desde UI nativa. Vendible como "Premium WhatsApp Marketing" en el plan Agency.
---
### 13 mayo 2026 (sesión maratón ~13h) — Multi-tenant MASTER + 6 bugs críticos producción 🦁
> 9 sprints completos en una sesión. Bot v153→v174 (21 versiones), API v185→v189 (4 versiones), Frontend `a904590`→`cf1344d` (5 commits). Test E2E real con WhatsApp validando cada deploy. Sprint A+B+C+D-lite+E.3+E.1.b backend completos.
#### ✅ Sprints cerrados HOY
**Sprint Wizard 2.0 Step 8 Premium** (API v185 + Frontend `a904590`)
- Step 8 separado: incrustar texto con preview → lanzar con every-guard
- Dropdown copy→imagen por variante, borrador localStorage company_id+TTL 30d
- Cap configurable `config_pro.wizard_max_images_per_round`, regenerar con confirm
- Cuota movida a `generate-images-preview` (donde está costo real Gemini Image)
**Sprint Scheduling UI multi-tenant** — verificación E2E sin código (frontend ya tenía UI, backend agnóstico al schema)
**Sprint ValidationException latente Bot v164** — `_cid_pay = (item.get("company_id") or DEFAULT_COMPANY_ID or "").strip()` blindando 4 call sites en `handle_payment_webhook`
**Sprint A — funnel_mode multi-tenant** (Bot v165 + Frontend `b4d0670`)
- 6 modos: `pay_to_book` (JMC), `book_first` (clínicas), `human_close` (B2B), `pay_and_ship` (e-commerce), `pay_and_deliver` (digital), `free_booking` (lead magnet)
- Bot rutea según `funnel_mode` en `process_ai_response`
- CAPI granular: pay_to_book → Lead+Checkout+Purchase+Schedule | book_first → Lead+Schedule | human_close → Lead solo si calificado | free_booking → Lead+Schedule
- Frontend card 6 modos en `/dashboard/settings`
**Sprint B — Auto-disparo flows en onboarding** (API v187)
- `handle_meta_exchange` dispara automáticamente `/scheduling-flow/setup` tras Embedded Signup exitoso
- Idempotente, NUNCA rompe el flujo principal (try/except)
**Sprint C — Lead Qualifier IA** (Bot v166 + API v188 + Frontend `cf1344d`)
- Estado nuevo `QUALIFYING_LEAD` cuando `funnel_mode=human_close`
- Helper `_evaluate_lead_with_gemini(answers, questions, brand_name)` retorna `{qualified, score, reason}`
- Solo leads calificados disparan handoff humano + CAPI Lead
- Fríos siguen con bot (opción B sin descartar)
- Card UI condicional `funnelMode === 'human_close'` con preguntas editables
**Sprint D-lite — Shipping step-machine** (Bot v167)
- Reemplazo del chat lineal de 4 preguntas por step-machine campo a campo
- Validación inline: nombre completo, dirección, teléfono, email, ciudad, depto, código postal, ID, notas
- Campos configurables `config_pro.shipping.required_fields`
- CAPI `AddShippingInfo` al completar
- Mensaje confirmación custom desde `config_pro.shipping.confirmation_message`
**Sprint E.3 — Lead scoring metadata** (Bot v169)
- `initiate_human_handoff` acepta `metadata` opcional
- Sesión guarda `handoff_metadata` con `lead_score`/`lead_reason`/`qualifier_qa`/`customer_name`/`service_slug`
- Frontend dashboard del agente puede leer metadata para mostrar "🔥 Lead caliente"
**Sprint E.1.b backend — Templates auto-create multi-idioma** (API v189)
- Diccionarios `APPOINTMENT_REMINDER_TEMPLATES` + `FOLLOW_UP_TEMPLATES` en 4 idiomas (ES/EN_US/PT_BR/FR)
- Helper `_detect_tenant_locale(config)` cascada: locale > timezone > currency > default `es`
- Helper `_create_meta_template(client_id, waba_id, access_token, spec)` idempotente
- Endpoint `POST /templates/auto-create` crea ambos templates en idioma del tenant
- Endpoint `GET /templates/poll-status` para cron refresh estado Meta
- Auto-disparo en `handle_meta_exchange` tras scheduling-flow/setup
- JMC submitted: `appointment_reminder_v1` ID `1527540475669134` (PENDING) + `follow_up_v1` ID `1776237060039872` (PENDING)
- Whitelist `locale`, `templates`, `payment_link_ttl_hours` en `handle_update_config`
#### 🐛 Bugs producción detectados + arreglados HOY
#### Bug #53 (CRÍTICO 🔴) — `initiate_chatwoot_handoff` no existía (NameError silente x3 sprints)
- **Síntoma**: 3 call sites llamaban función inexistente. Sprint A+C usaban nombre antiguo que ya no existe en el bot. NameError silente dentro de try/except → handoff humano nunca disparaba en producción.
- **Causa**: cuando migramos handoff de Chatwoot a in-house (API v82-v85), la función se renombró a `initiate_human_handoff` pero los nuevos call sites en Sprint A Bloque 2 (`process_ai_response` L6167) y Sprint C Bloque 1 (handler qualifying L1658+1697) usaron el nombre viejo. 6 sprints después se detectó.
- **Fix**: Bot v168 — `c.replace("initiate_chatwoot_handoff", "initiate_human_handoff")` × 3 ocurrencias. La firma de `initiate_human_handoff` ya acepta los kwargs `dynamic_token`/`dynamic_phone_id` → cero refactor extra.
- **Lección 49**: en sprints incrementales que llaman funciones antiguas, hacer **grep pre-deploy** verificando que la función existe (`grep -n "^def NOMBRE"`). NameError dentro de try/except es invisible hasta producción.
#### Bug #54 (CRÍTICO 🔴) — Welcome menu NUNCA salía al saludar (bypassed por debounce async)
- **Síntoma**: cliente escribe "Hola" → Gemini procesa como conversación normal y manda carrusel directo. El guard `is_greeting + flow_state != "CHAT_MODE" + word_count <= 3` en L7831 NUNCA se ejecutaba.
- **Causa raíz**: el bot tiene **debounce async** con 5s de delay. Cuando llega "Hola" → encola `pending_inputs` → 5s después invoca `debounce_execute` → este path llama directo a `call_gemini` **saltándose el guard síncrono completo**. El path síncrono donde está el guard solo aplica a casos especiales (botones, flows activos).
- **Fix**: Bot v173 — inyectar guard del welcome menu DENTRO de `debounce_execute`, antes del `call_gemini`. Replica la condición `is_greeting + flow_state != "CHAT_MODE" + word_count <= 3` y manda `send_welcome_menu` + limpia pending_inputs + return.
- **Lección 50**: si el bot tiene debounce async/buffer/queue, **CUALQUIER guard de procesamiento síncrono DEBE replicarse en el path async**. Auditar todos los handlers que terminen en `call_gemini` para verificar guards consistentes.
#### Bug #55 (CRÍTICO 🔴) — Payment link reuse no detectaba slug normalizado (Lección 17 reincidida)
- **Síntoma**: cliente generó link → confirma "Si" → bot genera link nuevo en vez de reusar el existente. Log: `PAYMENT REUSE skip: slug_match=False`.
- **Causa**: reuse guard ejecutaba ANTES del bloque `slug_normalize_v1` que resuelve nombre→slug. DDB tenía `service_slug="seminario-tiro-pistola-9mm"` pero el guard comparaba contra el nombre crudo "Seminario de Tiro Con Pistola 9mm" que Gemini había devuelto.
- **Fix**: Bot v171 — mover el guard DESPUÉS de los 3 intentos de normalización (`slug_normalize_v1`). Mismo patrón Lección 17 (Bug #28 del 5 mayo).
- **Lección 17 reincidida**: guards condicionales que dependen de campos normalizados DEBEN ir AFTER toda la cadena de normalización. Repite Bug #28.
#### Bug #56 (ALTO 🟡) — Doble envío de payment link (race condition Gemini + intercept Si/Ok)
- **Síntoma**: cliente confirmaba flow → bot enviaba 2 mensajes de pago con misma URL (1 del intercept Si/Ok + 1 del Gemini intent=payment async).
- **Causa**: intercept Si/Ok dispara `trigger_payment_flow` síncrono. En paralelo, debounce_execute manda mensaje a Gemini que también devuelve `intent=payment` → segunda llamada a `trigger_payment_flow`. Ambas pasan el reuse guard porque el lock no existía.
- **Fix**: Bot v172 — `ANTI_DOUBLE_PAYMENT_SEND` al inicio de `trigger_payment_flow`. Lock 60s con campo `payment_link_sent_at` en sesión. Cubre TODOS los call sites de un solo lugar.
- **Lección 51**: handlers que disparan acciones costosas (envío de mensajes, generación de links) en bot con debounce async, NECESITAN lock idempotente en sesión. Patrón: `if last_action_at + ttl > now: skip`.
#### Bug #57 (UX 🟡) — Bot inventaba envío de link 3 veces (anti-hallucination)
- **Síntoma**: cliente recibió link → dice "Gracias / Ahora pago / Voy a pagar / Mandame el link" → bot responde "Te envío el link de pago seguro" pero NO lo envía. Gemini hallucina envío que no va a pasar.
- **Causa**: Gemini detectaba `intent=payment` con `detected_service=null`. Código decide "solo enviar reply" pero Gemini había inventado en el reply "te envío el link" → mentira al usuario.
- **Fix**: Bot v174 — fix combinado:
  - **Regla 24b en system_prompt**: instrucción explícita "Si cliente YA recibió link y dice frases pasivas (ahora pago, voy a pagar, gracias), responde NEUTRAL. NUNCA inventes envío. Si PIDE explícitamente (mándame el link, no me llegó), responde tipo 'te lo reenvío'".
  - **Code condicional**: re-envío solo si el reply de Gemini contiene keywords ("reenvi", "te lo paso", "te lo envio", "aqui te va") + cliente tiene PENDING en DDB válido.
- **Test E2E verificado** ✅: "Gracias" → neutral. "Ahora pago" → neutral. "El link no funciona" → reenvío del link existente.
- **Lección 52**: LLMs hallucinan acciones que NO ejecutan. El system_prompt debe enseñar la diferencia entre "anunciar acción" vs "ejecutar acción". Y el code debe ser último guardián condicionando ejecución a señales claras del prompt (keywords en reply).
#### Bug #58 (REVENUE 🟥) — Payment link no se reusaba entre conversaciones
- **Síntoma**: cliente generó link → no paga → vuelve 4h después → bot genera link NUEVO en Wompi. Cliente tiene 2-3 links diferentes para misma compra. Caos UX + costo extra de generación.
- **Fix**: Bot v170-v171 — reuse guard al inicio de `trigger_payment_flow` post slug-normalize. Si hay PENDING reciente (< 24h TTL) con mismo phone+slug+company+pax → reusa `payment_url` existente. TTL configurable `config_pro.payment_link_ttl_hours` default 24.
- **Test E2E verificado** ✅: log `PAYMENT REUSE OK: ... age=228s`. Cliente recibe MISMO link "válido por ~23h más".
- **Lección 53**: payment links son costosos de generar (rate limit + UX). Reusar entre conversaciones es revenue protection. Lock keyed por (phone, slug, company, pax, status, age<ttl).
#### Lecciones nuevas (49-53)
- **Lección 49**: NameError silente en sprints incrementales — grep pre-deploy verificando función existe.
- **Lección 50**: debounce async puede saltar guards síncronos — replicar guards en path async.
- **Lección 51**: lock idempotente con `last_action_at + ttl` en sesión es regla para handlers costosos.
- **Lección 52**: LLMs hallucinan acciones — system_prompt debe enseñar a no inventar + code condiciona ejecución a keywords del reply.
- **Lección 53**: Templates Meta multi-idioma se crean N veces (uno por idioma). Cada tenant onboardea con SU locale → backend crea SOLO el template de SU idioma.
---
### 15-16 mayo 2026 — Sprint Marketing + Atribución + Revenue Protection 🦁💰
> Sesión épica ~20h. 26 deploys (Bot v198→v207 + API v200→v215). 8 commits frontend. Revenue protection: 121 Purchase re-enviados a Meta CON campaign_id.
#### Bug #59 (REVENUE 🟥) — pax_count=1 siempre en payment link
- **Síntoma**: Cliente reserva para 2 personas → bot calcula $560k correctamente → genera link por $140k (1 persona).
- **Causa**: 3 call sites de `trigger_payment_flow` (líneas 5858, 9330, 9345) NO leían `pax_confirmed` de la sesión. Usaban default `pax_count=1`.
- **Fix**: Bot v204 — los 3 call sites ahora leen `int((session or {}).get("pax_confirmed", 1) or 1)`.
#### Bug #60 (REVENUE 🟥) — ROAS = 0 en Meta Ads Manager
- **Síntoma**: 121 ventas pagadas, ROAS = 0 en todas las campañas. Meta no vincula Purchase a campañas.
- **Causa triple**: (1) `_save_lead_attribution` no escribía `source_first_campaign_id` en CRM (bug raíz no resuelto). (2) `send_meta_capi_event` leía campaign_id del CRM → vacío → Purchase sin campaign_id. (3) `handle_leads_sync_meta` no pasaba campaign_id ni PII.
- **Fix multicapa**: Bot v207 fallback AdsAttribution en `send_meta_capi_event`. API v215 `handle_leads_sync_meta` pasa campaign_id+city+fbc+document_id con fallback AdsAttribution. 121 Purchase re-enviados. Cron `attribution-sync-every-10min` como defensa redundante.
#### Bug #61 (UX 🟡) — Gemini hallucina "máximo 5 personas" (real: 10)
- **Síntoma**: Bot respondía "los grupos son de máximo 5 personas" cuando el catálogo dice max_pax=10.
- **Causa**: `active_service` solo inyectaba el nombre al prompt, NO los datos completos (max_pax, pricing, duration, characteristics).
- **Fix**: Bot v204 — inyecta JSON completo del servicio al prompt con regla "usa SOLO estos datos".
#### Bug #62 (UX 🟡) — Gemini "Un momento, dejame verificar" (mentira)
- **Síntoma**: Cuando Gemini devolvía JSON truncado, el código de reparación inventaba reply "Un momento, dejame verificar eso para ti" → cliente quedaba esperando sin respuesta real.
- **Causa**: Línea 2962 hardcodeaba reply mentiroso cuando faltaba campo `reply` en JSON truncado.
- **Fix**: Bot v201 — si falta `reply`, NO inventar. Dejar que la cascada pruebe siguiente modelo Gemini.
#### Bug #63 (CRÍTICO 🔴) — 334 sesiones zombies con flow_state=ACTIVE
- **Síntoma**: 334 clientes (11.7% de la base) no recibían respuesta del bot. `DEBOUNCE_FLOW_GUARD` interceptaba porque `flow_state=ACTIVE` no estaba en `_passive_states`.
- **Causa**: `flow_state=ACTIVE` era valor legacy de pre-Bot v140. Nunca se limpió de sesiones viejas.
- **Fix**: Bot v198 — `ACTIVE` agregado a `_passive_states`. Limpieza masiva de 334 sesiones.
#### Bug #64 (OPERACIONAL 🟠) — `/conversations/active` mostraba conversaciones de hace 1h+
- **Síntoma**: Dashboard de chat no mostraba leads recientes. Último visible era de hace 1+ hora.
- **Causa**: Query al GSI sin `ScanIndexForward=False` → DDB devolvía items viejos primero (límite 1MB).
- **Fix**: API v203 — `ScanIndexForward=False` + `Limit=200`.
#### Bug #65 (OPERACIONAL 🟠) — Sync Meta "Event Timestamp Too Old" (95 de 120 fallos)
- **Síntoma**: sync-meta fallaba 79% con HTTP 400. Sin detalle visible del error.
- **Causa**: Meta rechaza eventos CAPI >7 días. Pagos viejos excedían el límite.
- **Fix**: API v212 — auto-clamp `event_time` a `now - 6 días` si >7 días. API v211 — captura body del HTTPError para diagnóstico.
#### Lecciones nuevas (sesión 15-16 mayo)
59. **🦁 No postergar features cuando el cliente las pide**: "mañana" es procrastinación disfrazada de protección. Si el cliente dice "hazlo ahora", se hace ahora.
60. **🔴 `ConditionExpression` en DynamoDB puede fallar silente**: si hay race conditions o estados inesperados, `ConditionalCheckFailedException` se traga con `pass`. Usar `if_not_exists()` en el `UpdateExpression` es más robusto — idempotente, sin excepciones, sin silencios.
61. **🔴 ROAS = 0 cuando Purchase CAPI no lleva campaign_id**: Meta no puede vincular la venta a la campaña si el evento no trae el campaign_id. Fallback desde AdsAttribution cuando CRM no lo tiene.
62. **🔴 Cron de defensa redundante es arquitectura, no band-aid**: HubSpot/Salesforce usan sync jobs periódicos para garantizar consistencia entre tablas. `attribution-sync-every-10min` cuesta $0.001/día y garantiza que ningún lead CTW Ad quede sin atribución aunque el bot falle. Mantenerlo activo incluso después de fixear el bot.
63. **🔴 `clear_pax_data` no debe borrar datos que el webhook de pago necesita**: `pax_confirmed` y `customer_name` se necesitan cuando Wompi confirma (puede ser minutos/horas después). Solo borrar campos de flow_state/scheduling, NO de pago.
64. **🔴 Datos del servicio al prompt de Gemini**: sin max_pax, pricing, duration en el contexto, Gemini inventa. Inyectar JSON completo del servicio activo con regla "usa SOLO estos datos".
65. **🔴 HTTP 400 sin body = diagnóstico ciego**: `urllib.request.urlopen` lanza `HTTPError` sin leer el body de Meta. Capturar con `except urllib.error.HTTPError as e: e.read()` para ver el mensaje real.
66. **🔴 `send_meta_capi_event` y `handle_leads_sync_meta` son 2 paths distintos**: el bot usa el wrapper (con fallback), la API usa `_send_meta_event` directo. Ambos necesitan campaign_id + PII. Fix en ambos.
67. **🦁 26 deploys sin tumbar producción**: disciplina de `py_compile` + `publish-version` + 1 cambio por vez. Rollback disponible en cada versión.
### 20 mayo 2026 (madrugada) — Sprint AUDIT-1: filosofía león aplicada 🦁🔍
> Sesión ~3h. Cero features nuevas. 100% auditoría de pendientes del STATUS + cierre quirúrgico de deuda técnica real. 2 deploys (Bot v236 + API v224). 0 producción rota. 4 wins limpios + 5 "pendientes" confirmados como ya cerrados (auditar antes de codear funciona).
#### Cerrados en esta sesión
- [x] **Env vars muertas eliminadas del Bot**: `TABLE_PRODUCTS`, `TABLE_CLIENTS`, `CATALOG_ID` borradas tras confirmar código fantasma (3 funciones `enviar_catalogo_saas`, `enviar_detalle_producto_saas`, `get_saas_products` declaradas pero nunca llamadas + `CATALOG_ID 998604755824586` confirmado "does not exist" en Meta Graph). Backup S3 `dead-code-cleanup/` con `saas_products` (5 items viejos) + `saas_clients` (1 item huérfano). Limpieza Fase 3 del código (~80 líneas) pendiente para sesión dedicada.
- [x] **REMARKETING_DELAY_HOURS=24h** (era 0.25h modo testing). Restauración atómica con `--cli-input-json` tras incidente operacional (ver Lección 54).
- [x] **Google Calendar multi-tenant confirmado funcionando** — `_get_google_calendar_service(company_id)` y `create_calendar_event(..., company_id=...)` ya reciben el parámetro desde Bot v163.
- [x] **3 ValidationException raíz cerradas** (Bot v236 + API v224):
  - **Bug 9.A** — `get_services_catalog("")` en webhook Wompi por cascada de `item.get("company_id", DEFAULT_COMPANY_ID)` cuando key existe vacía (Lección 48 reincidencia). Fix: mover `_cid_pay` blindado ARRIBA del bloque post-pago (antes de CAPI Purchase, stock descuento, save_session multi-persona). 3 ocurrencias del antipatrón reemplazadas.
  - **Bug 9.B** — `search_memory("")` y `get_services_catalog("")` sin guards defensivos. Fix: `if not company_id: return None/[]` al inicio de ambas funciones. Defense-in-depth contra cualquier call site futuro (especialmente path Instagram que tarda en resolver tenant).
  - **Bug 9.C** — `/admin/overview` audit scan con reserved keyword `action` en `ProjectionExpression`. Fix: agregar `"#act": "action"` a `ExpressionAttributeNames` + cambiar a `ProjectionExpression="company_id, #act"`.
#### Confirmados como "ya cerrados" (falsos pendientes del STATUS)
- ✅ `customer_email` viajando OK en Purchase CAPI (98% según Meta dashboard 20 mayo)
- ✅ Google Calendar multi-tenant ya recibe `company_id` desde v163
- ✅ Env vars muertas del Bot (`WHATSAPP_TOKEN`, `META_APP_ID`, etc.) ya no existían — eran false positive de sesión anterior
- ✅ Sprint Calendly UI completo desde frontend `bd3cad7`
- ✅ Match Rate Meta subió 5.7 → 6.5/10 + 98% email coverage en Purchase
#### Incidente operacional resuelto (Lección 54)
- **Bug operacional crítico**: `aws lambda update-function-configuration --environment 'Variables={KEY=VAL}'` es **DESTRUCTIVO** — borra todas las env vars no especificadas. Al subir `REMARKETING_DELAY_HOURS=24` con shorthand, se borraron las otras 8 env vars del Remarketing.
- **Recuperación**: leer config de versión publicada anterior (v8) con `aws lambda get-function-configuration --qualifier 8` + restaurar con `--cli-input-json file://config.json` que permite JSON estructurado correcto.
- **Lección 54 (CRÍTICA)**: NUNCA usar `update-function-configuration --environment` con shorthand `Variables={K=V}`. **SIEMPRE** patrón leer→modificar→escribir con `--cli-input-json file://...json` que incluye TODAS las env vars. Aplica a Lambda, RDS parameter groups, ECS task definitions — cualquier API AWS que reciba "el set completo" de variables.
#### Pendientes reales identificados (próxima sesión)
- **Bug #44 carrusel skip** (`last_service_slug` huérfano sin lifecycle): guard en L8321-8325 chequea solo `last_service_slug` poblado sin importar `flow_state`. Cliente recurrente con servicio viejo pide catálogo → solo texto, NO carrusel. Fix quirúrgico ~30min.
- **Bug #45 customer_email no se persiste en `Leads_CRM_v2`**: bot LEE de Wompi pero NUNCA escribe a CRM. 0/100 leads JMC tienen email. Webhook Wompi recibe email del cliente al pagar pero no se persiste. Match Rate Lead bajo. Fix ~1h.
- **UI editable de `post_booking_messages`** por servicio: hoy se setea en DDB manual (JMC tiene 3 mensajes globales OK pero cada tenant nuevo necesita poder editarlos desde UI). Estimado 2h frontend.
- **Limpieza código fantasma saas_products** (Fase 3): ~80 líneas + 2 tablas DDB pendientes de borrar tras 7 días sin regresiones.
- **Bug latente Remarketing**: env var `PHONE_NUMBER_ID=1048898704969876` apunta a WABA viejo post-migración. No bloquea (lee del config_pro), pero confunde debugging. Actualizar a `1050792924791062`.
- **Meta App Review**: re-enviar SOLO `ads_read` con video Embedded Signup completo (logout→login→permisos checkbox). `catalog_management` se descarta — confirmado que NO usamos Meta Catalog API (templates de carrusel ≠ Catalog API).
- **Test E2E remarketing real** con número distinto al founder (info abandonment + cart abandonment).
#### Hallazgos meta de la auditoría
- **4 de 9 items del Bloque 1 ya estaban cerrados** — solo 5 son pendientes reales. 14h estimadas inicialmente se redujeron a ~3h + 3h restantes (Bug #44, Bug #45, UI post_booking).
- **Defense-in-depth funciona**: guards en `search_memory` y `get_services_catalog` no requieren auditar 20+ call sites — protege contra TODOS los futuros llamadores que pasen empty string. Costo: 4 líneas. Beneficio: ValidationException nunca más por este vector.
- **Auditar antes de codear (Lección 48 reaplicada 5ta vez)**: cuando el cliente pide cerrar pendientes, primero verificar si ya están hechos. Las sesiones intensas dejan deuda de documentación; el código suele estar más adelantado que el STATUS.
### 21 mayo 2026 — Sprint Fix Atribución ROAS + Release Preserva Flow 🦁🎯
> Sesión ~5h. Cerró 4 bugs encadenados que tenían ROAS invisible en producción + un bug raíz de takeover humano que rompía multi-persona. 2 deploys (Bot v240 + API v227 + API v228) + 2 backfills DDB. ROAS de campaña BOT visible por primera vez: 3.8x ($1.54M / $405k en 7d).
#### Bug #66 (CRÍTICO 🔴) — Filtro CRM por campaña no devolvía leads
- **Síntoma**: 499 leads en total, dropdown mostraba 17 campañas activas, pero al filtrar por cualquiera → "No hay leads con esos filtros".
- **Diagnóstico iterativo**: scan DDB reveló 721 leads con `source_first_campaign_id` poblado. Top 3 campañas tenían 292/243/181 leads. Pero `/ads/campaigns` devolvía IDs que NO matcheaban con los del CRM (`120246281898050200` lead vs `120246281898030200` campaign — IDs hermanos pero distintos).
- **Causa raíz**: Meta a veces manda `ad_id` en `referral.source_id` (no `campaign_id`). El bot lo guardaba en una variable mal nombrada `source_first_campaign_id`. Documentación Meta no era explícita.
- **Hallazgo posterior**: tras verificación contra Meta Graph API, los IDs del lead SÍ existían como campañas reales (algunas ARCHIVED). El bug era menos severo de lo pensado — la mayoría de leads SÍ tenían campaign_id correcto, solo el endpoint `/ads/analyze` no los leía.
- **Fix multicapa**:
  - **Bot v240** — helper `_resolve_ad_to_campaign(ad_id, company_id)` con cache 24h. Llama Meta Graph API `?fields=campaign{id}` cuando sea necesario. Guarda `source_first_ad_id` + `source_first_campaign_id` por separado (auditable).
  - **`_extract_referral`** ahora devuelve `ad_id` (el valor crudo) en lugar de asumir `campaign_id`.
  - **`_save_lead_attribution`** resuelve via Graph antes de persistir. Fallback: si Meta no resuelve, guarda el ad_id como campaign_id (mejor algo que nada).
- **Test E2E**: filtro CRM por campaña 030200 funciona ✅. Lead Cesar Barrera (post-v240) muestra ambos campos correctamente.
#### Bug #67 (REVENUE 🟥) — Análisis IA mostraba 0 ventas con 9 pagos reales
- **Síntoma**: campaña BOT con $405k gastado y 267 leads → "Generas leads ($1,518 cada uno) pero no hay ventas atribuidas al bot". Realidad: 9 pagos reales por $2.38M.
- **Causa**: línea 13222 de `SaaS_API_Handler` llamaba función `_get_attribution_data(client_id, campaign_id)` que **NO EXISTÍA**. NameError silente capturado por try/except → `attr=None` → `purchases=0`. La función correcta era `_b65_get_attribution_for_campaign(company_id, cid, days=7)` que SÍ existe (línea 9825) y devuelve `{"leads", "purchases", "revenue_cents"}`.
- **Doble bug**: además de la función inexistente, las keys que pedía (`purchases_7d`, `revenue_7d`) tampoco matcheaban con las reales (`purchases`, `revenue_cents`).
- **Fix (API v227)**: cambiar `_get_attribution_data` → `_b65_get_attribution_for_campaign(client_id, campaign_id, days=7)` + ajustar keys del dict.
- **Backfill**: AdsAttribution tenía solo 11 purchases (de antes del wrapper en `_send_meta_event`). Script CloudShell cruzó `StudentPaymentState` (status=PAGADO) con `Leads_CRM_v2.source_first_campaign_id` → backfilleó 9 purchases nuevos ($2.38M). Idempotente con `ConditionExpression`.
- **Resultado verificado**: análisis IA ahora muestra **"Funnel completo: 97,422 impr → 3,162 clicks (3.25% CTR) → 267 leads ($1,518 CPL) → 7 ventas (ROAS 3.8x)"** + recomendación **SCALE** 🟢.
- **Lección 55**: try/except que captura toda Exception oculta NameError. Llamadas a funciones de tu propio codebase deben validarse con grep antes de deploy. Tests E2E no detectaron porque el path solo se ejecuta cuando hay campaign_id válido.
#### Bug #68 (REVENUE 🟥) — Release humano rompía flow CAPTURING_ATTENDEES
- **Síntoma**: cliente Guillermo (3454) pagó $560k para 4 personas. Bot inició captura: nombre ✅, doc ✅, teléfono ✅. Cliente se enredó en el 4to campo. Asesor intervino. Cuando devolvió al bot, `flow_state=CHAT_MODE` → flow muerto → 0 leads sintéticos creados → 1 Purchase event a Meta de $560k (en vez de 4 × $140k).
- **Diagnóstico**: 2 sesiones JMC con `attendees_total>1` + `attendees_current=1` + `attendees_list=[]` + `flow_state=CHAT_MODE` + `released_at` presente. Causa exacta confirmada en logs CloudWatch (PAX STICKY pax_confirmed=4 + release posterior).
- **Causa raíz**: `handle_conversation_release` en API forzaba `flow_state=CHAT_MODE` siempre, sin importar si el flow estaba mid-captura. Los buffers quedaban huérfanos.
- **Fix (API v228)** — preserva flow_state mid-captura con prioridades:
  - **Prioridad 1**: si `attendees_total>1` + (`attendees_current>=1` OR buffer OR pending_attendees_capture) + lista incompleta → restaura `CAPTURING_ATTENDEES`
  - **Prioridad 2**: si `pending_lead_details` OR `lead_details_step>0` → restaura `AWAITING_LEAD_DETAILS`
  - **Prioridad 3**: si `pax_confirmed>1` sin `customer_name` → restaura `AWAITING_PAX_COUNT`
  - **Fallback**: `CHAT_MODE` (comportamiento original)
- **Mensaje al cliente**: si reanuda flow mid-captura, le envía "Retomamos donde quedamos. Vamos por el Asistente X/Y. Por favor confirmame el dato pendiente." (en vez del genérico).
- **Lección 56**: en handlers de "devolver al bot" tras takeover humano, NUNCA forzar reset del flow_state. El agente puede haber intervenido mid-captura. Defense-in-depth: leer el estado anterior y restaurar inteligentemente.
- **Lección 57**: bugs raíz de multi-persona explican por qué $2.38M se reportó como 7 transacciones cuando en realidad fueron ~12 personas (3454 con 4 + 5052 con 2 + el resto single). La métrica a Meta es correcta filosóficamente (1 phone = 1 user_data hash) pero perdemos atribución granular por persona.
#### Cleanups Python operacionales (sesión 21 mayo)
- **Lección 58 — f-strings multilínea con `\n` literal NO compilan**: Python rechaza f-strings con saltos de línea reales adentro. Patrón seguro: `chr(92)+"n"` como literal o concatenación `+ "\\n" +`. Aplicar patches sobre versión FRESCA del Lambda (descargar con `aws lambda get-function`), no sobre archivos parchados a medias en `/tmp`.
- **Lección 59 — Rutas de deploy distintas entre Bot y API**: `~/.deploy_bot.sh` lee de `/tmp/aud/bot/`, `~/.deploy_api.sh` lee de `/tmp/api/api/` (subcarpeta doble). Documentado para sesiones futuras.
#### Pendiente identificado (sin bloquear)
- 🟡 12 ventas reales reportadas como 7 transacciones a Meta: filosóficamente correcto (Meta optimiza por phone hash, 1 click = 1 hash), pero falta migrar el módulo M11-M16 (chat lineal) al PII Flow v6 de Meta para que la captura sea atómica y no se rompa por takeover humano. Estimado 4-6h en sesión dedicada.
Resumen sesión 21 mayo
✅ Filtro CRM por campaña funcionando (probado en producción)
✅ Análisis IA muestra ROAS 3.8x con 7 ventas reales (antes mostraba 0)
✅ Bot v240 deployed (resolver ad_id→campaign_id Meta Graph)
✅ API v227 deployed (fix análisis IA con función correcta)
✅ API v228 deployed (release preserva flow mid-captura)
✅ 9 purchases ($2.38M) backfilleados a AdsAttribution
✅ 4 lecciones nuevas (55-59)
### 22-23 mayo 2026 — Sprint Match Rate Meta + Mark-Paid-Manual + Ads Pro v3 fixes 🦁🎯💯
> Sesión maratón ~11h. 12 deploys (API v229→v239 + Bot v241→v242) + 1 commit frontend (`99e72d2`) + 1 backfill DDB + 277 eventos CAPI con PII enriquecida + 1 endpoint nuevo para pagos externos (revenue-critical). Cero producción rota. Validado en Graph API Explorer: `{events_received:1, messages:[]}` — payload perfecto.
#### Bug #45 (CERRADO 🟢) — handle_import_leads escribía campos legacy
- **Síntoma**: solo 31/585 leads JMC tenían `customer_email`. Asesor importaba CSV con email → se guardaba como `email` (legacy) en vez de `customer_email` (canónico) → Enhanced CAPI no podía hashearlo → Match Rate Lead bajo (5.7/10).
- **Causa raíz**: `handle_import_leads` (API L10828) escribía `item_data["email"]` en vez de `item_data["customer_email"]`. Mismo problema con `city`. NO mapeaba: `first_name`, `last_name`, `document/dni`, `region/state`, `country`.
- **Fix (API v229)**: campos canónicos `customer_*` + aceptar múltiples nombres de columna CSV (`document/dni/document_number`, `region/state/departamento`).
- **Backfill**: 94 leads JMC migrados (56 `email`→`customer_email`, 94 `city`→`customer_city`). Idempotente con guards.
- **Resultado**: 61 leads con `customer_email` (+30), 59 con `customer_city` (+59).
#### Bug #46.A (CERRADO 🟢 — bonus) — `_send_meta_event` sobreescribía external_id
- **Síntoma**: external_id se seteaba con hash de phone, luego se sobreescribía con hash de document. Meta acepta external_id como array de múltiples IDs → perdíamos uno.
- **Fix (API v230 + Bot v241)**: acumulador `ext_ids = []` con append de phone + document, set único al final.
#### Bug #46.B (CERRADO 🟢 — bonus) — CAPI no mandaba country/region/zip
- **Síntoma**: `_send_meta_event` no aceptaba esos kwargs, perdíamos 12-26% potencial Match Rate por país/zip/región.
- **Fix (API v230 + Bot v241)**: firma ampliada + user_data agrega `ct`/`st`/`country`/`zp` con hashing SHA-256 normalizado (country ISO 2 letras lowercase).
#### Endpoint nuevo: `/leads/sync-meta-leads` (API v231)
- Re-envía Lead event con PII enriquecida a leads existentes (tras backfill o captura tardía).
- `order_id` pseudo-determinístico `{company}_lead_enriched_{phone}` para idempotencia entre re-syncs.
- **Test E2E**: 117 leads JMC re-enviados, 100% HTTP 200, 0 failed.
#### Bug apply-action 400 (API v237) — 4 acciones no soportadas
- **Síntoma**: cliente click "Aplicar" en sugerencia → 400 "No se pudo ab_test: Error desconocido".
- **Causa**: solo `pausar`/`escalar`/`activar` implementadas. `ab_test`/`refresh_creative`/`change_targeting`/`recharge_budget` caían al fallback genérico.
- **Fix**: agregar acción `reducir` real (budget -20%) + 4 acciones UI-only con mensaje guía + audit log + listado de soportadas en error.
#### Bug analyze MAX_TOKENS (API v238)
- **Síntoma**: dashboard ads mostraba solo `funnel_diagnosis` genérico, sin `ai_insight` rico. CloudWatch: `finish_reason: MAX_TOKENS`.
- **Causa**: `gemini-2.5-flash` consume 1000-1500 tokens en thinking interno antes de generar texto, dejando solo ~500 para respuesta real. `maxOutputTokens: 2000` quedaba corto.
- **Fix**: `maxOutputTokens 2000→4096` + `thinkingConfig.thinkingBudget=0` (libera todo el budget para texto) + cascada 3 modelos `gemini-2.5-flash → flash-lite → flash-lite-latest` + aceptar texto parcial si MAX_TOKENS con sufijo "[Análisis recortado por límite del modelo]".
- **Resultado**: `ai_insight` 2199 chars con análisis completo 3 secciones (QUE FUNCIONA / PROBLEMA / ACCION).
#### Endpoint nuevo: `/payments/mark-paid-manual` (API v239 + Bot v242 + Frontend `99e72d2`) — REVENUE-CRITICAL 🟥
- **Problema resuelto**: cliente paga externo (efectivo/transferencia/QR/link otra pasarela no integrada) → asesor marca pagado → flujo continúa automáticamente.
- **Antes**: lead quedaba en limbo: sin scheduling, sin CAPI Purchase, sin email confirmación, sin mensaje al cliente. Caso real del founder hoy: cliente no pudo pagar por Wompi, asesor tomó control, envió QR de otro número, cliente pagó externo → quedó en el limbo todo el día.
- **Implementación**:
  - **API** valida body, escribe `StudentPaymentState` con `source=manual_agent` + `marked_by_agent` + `payment_method` + `manual_notes`, actualiza `Leads_CRM_v2` (`is_buyer=true`, `cerrado_ganado`, `paid_amount`), audit log `PAYMENT_MARKED_MANUAL`, invoca bot async via `lambda_client.invoke(InvocationType="Event")`.
  - **Bot** `_internal_action=mark_paid_manual`: side-effects post-pago idénticos a webhook real (mensaje cliente WhatsApp "✅ Pago confirmado" + CAPI Purchase con `regular_price` 100% no anticipo + descuento stock + post_payment_flow correcto según servicio: scheduling/send_group_link/download/thanks_only). 
  - **Frontend**: botón "✅ Pago externo" en `LeadCard.tsx` ⚡ Acciones rápidas. Modal con banner amarillo si hay PENDING del bot + dropdown servicios (auto-load del catálogo) + toggle Anticipo/Pago completo (auto-fill `deposit_required` o `regular_price`) + hint "📤 A Meta CAPI siempre se reporta el valor completo" + selector método (efectivo/transferencia/QR/link externo/otro) + textarea notas + checkbox CAPI ON default.
- **Multi-tenant safe**: lee tokens/pixel del config del tenant.
- **Test E2E real**: phone `573332370347`, monto $280k, transferencia → cliente recibió mensaje + scheduling + CAPI Purchase HTTP 200 a Meta (verificado en MetaEventsLog).
#### Validación Match Rate con Test Events (sesión)
- Patch temporal `meta_test_event_code` support en `_send_meta_event` (API v232).
- Log temporal `CAPI_DEBUG` mostró payload exacto enviado a Meta: phone+fn+ln+em+ct+external_id hashes presentes ✅.
- Validación final en Graph API Explorer con mismo payload: `{events_received: 1, messages: []}` ✅. Confirma código perfecto, Test Events visual con latencia 6-24h normal de Meta.
- Cleanup post-validación: `meta_test_event_code` removido de config + log `CAPI_DEBUG` removido del código.
#### Lecciones nuevas
- **Lección 60 (🔴 Campos canónicos vs legacy)**: cuando hay 2 esquemas (`email` legacy vs `customer_email` canónico), TODA escritura debe usar el canónico. Los lectores hacen fallback pero el CAPI hashea solo el canónico → Match Rate cae silente. Audit obligatorio en TODO endpoint que escriba a `Leads_CRM_v2`.
- **Lección 61 (🔴 `external_id` arrays)**: Meta acepta `external_id` como array de N hashes (phone + document + cualquier ID propio). Sobreescribir = perder Match Rate. Patrón: `ext_ids = []; append; user_data["external_id"] = ext_ids`.
- **Lección 62 (🟢 Re-envío retroactivo CAPI)**: `order_id = "{company}_{event}_enriched_{phone}"` evita colisión con event_id original. Meta lo procesa como evento nuevo y actualiza el perfil del usuario.
- **Lección 63 (🟢 Backfill idempotente con guards)**: `if not existing_canonical: migrate_legacy`. Correr 2 veces = no-op. Evita pisar datos buenos por error humano.
- **Lección 64 (🦁 Auditar antes que codear — 6ta reaplicación)**: STATUS decía Bug #45 abierto, pero bot ya escribía `customer_email` en 6 call sites (PII Flow v6 + bulk-import-purchases). Bug real estaba en API `handle_import_leads`, no bot. Ahorró ~4h de codear en el lugar equivocado.
- **Lección 65 (🔴 Pago externo via `_internal_action`)**: replicar todo el flujo post-pago del webhook en API es pesadilla (~150 líneas). Patrón limpio: API hace escrituras DDB + invoca bot async con `_internal_action=X`. Bot reusa su propio flujo. 30 líneas vs 150.
- **Lección 66 (🟢 Anticipo vs Pago completo en UI)**: si producto soporta anticipo (`deposit_required`), UI debe permitir elegir. Backend siempre reporta `regular_price` (100%) a Meta CAPI — el wrapper auto-corrige con `regular_price` del servicio (Bug #34 ya cubre esto).
- **Lección 67 (🔴 Gemini thinking mode consume tokens)**: `gemini-2.5-flash` con thinking activo gasta 1000-1500 tokens en pensamiento INTERNO antes de generar texto. Agregar `thinkingConfig: {"thinkingBudget": 0}` libera todo el budget para la respuesta real. Sin esto, `maxOutputTokens: 2000` truncaba a la mitad.
- **Lección 68 (🟡 Test Events Manager es eventually consistent)**: payload puede ser perfecto, Meta puede aceptar con `events_received:1`, y aún así Test Events visual tarda 6-24h en mostrarlo. NO debuggear payload por ausencia visual — validar con Graph API Explorer directo.
#### Pendientes detectados (próximas sesiones)
- 🟡 **Variantes de ad reemplazan TODO el copy con 125 chars** (Bug #69 nuevo). `handle_ads_duplicate_ad` (API L15330) hace `afs_new["bodies"] = [{"text": new_primary_text}]` → pierde precio, beneficios, CTA del ganador. Anuncio inservible. Sprint dedicado "Ads Copy Generator v3" estimado 4h: endpoint nuevo `/ads/generate-ad-variants` que devuelve `{headline, primary_text, description}` completo + business_profile en config_pro con default_price/cta_phrase/urgency_phrases multi-tenant.
- 🟡 **Imágenes IA wizard no respetan referencias** (Bug #70 nuevo). Cliente sube fotos de su producto/lugar → Gemini genera imágenes que no se parecen. Diagnóstico pendiente del prompt builder. Sprint dedicado estimado 6h.
- 🟢 Verificar Match Quality dashboard Meta a las 24-48h (esperado: 5.7→7.5).
- 🟡 Captura `fbp` (cookie navegador, +21% Match Rate) — requiere pixel JavaScript en landing.
- 🟡 Decisión InitiateCheckout timing: ¿al generar link (señal débil) vs al confirmar pax (señal media)?
Resumen sesión 22-23 mayo
✅ Bug #45 cerrado de raíz + 2 bonus (external_id + country/region/zip)
✅ Backfill 94 leads JMC migrados a campos canónicos
✅ Endpoint `/leads/sync-meta-leads` retroactivo deployed
✅ 277 eventos CAPI con PII enriquecida enviados a Meta (160 Purchase + 117 Lead)
✅ Bug apply-action 400 cerrado (8 acciones soportadas)
✅ Bug analyze MAX_TOKENS cerrado (thinkingBudget=0 + cascada)
✅ Endpoint `/payments/mark-paid-manual` deployed + frontend integrado + test E2E real
✅ Payload validado en Graph API Explorer: events_received:1, messages:[]
✅ 9 lecciones nuevas (60-68)
✅ 12 deploys sin tumbar producción
## ⏳ PENDIENTE PARA CONTINUAR — Sprint E sin terminar
### Sprint E.1.b Frontend (continuar mañana)
- [ ] **Onboarding wizard**: selector locale con auto-detect `navigator.language` → mapear a es/en_US/pt_BR/fr → enviar a `/onboarding` o `/config`
- [ ] **Settings**: card "🌐 Idioma del negocio" con selector + botón "🔄 Recrear plantillas WhatsApp" tras cambiar locale (llama `POST /templates/auto-create` con `force_locale`)
### Sprint E.0 — Capturar email (no empezado)
- [ ] **E.0a Bot**: estado nuevo `AWAITING_EMAIL` post-scheduling exitoso. Validación regex. Guarda en `Leads_CRM_v2.email` + `StudentPaymentState.customer_email`. Skip si ya tiene email guardado.
- [ ] **E.0b Bot**: helper `_send_appointment_confirmation_email(sender, payment_item, config)` con Resend al confirmar agendamiento. Subject + body desde `config_pro.email.confirmation_subject` y `confirmation_body` con variables `{brand}`, `{name}`, `{date}`, `{hour}`, `{service}`, `{location}`.
### Sprint E.1.a — Cron recordatorios cascada (no empezado)
- [ ] **Bot endpoint** `POST /cron/reminders` con header `X-Cron-Secret`
- [ ] **EventBridge rule** `appointment-reminders-hourly`
- [ ] **Lógica cascada**:
  1. `hours_since_last_user_msg < 24` → texto libre WhatsApp ✅
  2. Si CTWA recent → ventana extendida 72h → texto libre 
  3. Fuera de ventana → enviar template `appointment_reminder_v1` (debe estar APPROVED en Meta)
  4. Si template aún PENDING → fallback email Resend
  5. Si no hay email → skip silente + log warning
- [ ] **Idempotencia**: campo `reminders_sent: [24, 1]` en `StudentPaymentState` para no duplicar
- [ ] **Mensaje configurable** desde `config_pro.scheduling.reminder_message`
- [ ] **Ventanas configurables** desde `config_pro.scheduling.reminder_hours: [24, 1]` (default 24h antes + 1h antes)
### Sprint E.2 — Reprogramar/cancelar/no-show (no empezado)
- [ ] **Botones interactivos** en recordatorios: "✅ Confirmar / 📅 Reprogramar / ❌ Cancelar"
- [ ] **Reprogramar** → dispara scheduling flow nuevo (reusa `_trigger_scheduling_flow`)
- [ ] **Cancelar** → `schedule_status=CANCELLED` + email Resend al tenant + libera slot Google Cal
- [ ] **No-show**: cron horario marca `no_show=true` si 1h después de la cita el cliente no respondió + email al tenant
### Cron poll templates Meta (para auto-aprobación)
- [ ] **EventBridge rule** `templates-poll-status-6h` (cada 6h)
- [ ] **Endpoint** ya creado: `GET /templates/poll-status` (lo creamos en v189)
- [ ] **Target**: invocar el endpoint para CADA tenant con templates en PENDING
- [ ] Cuando `status=APPROVED` → log + audit + email opcional al owner "Tu plantilla quedó aprobada, ya puedes enviar recordatorios"
---
## 📋 BACKLOG GRANDE — Sprints dedicados separados (NO HOY)
### Sprint Templates Manager UI (~2.5h dedicados)
> Diferenciador real vs Manychat/Wati. Cliente puede crear templates custom.
- [ ] Página `/dashboard/templates/manage` con lista (auto + custom)
- [ ] Botón "+ Crear plantilla custom" con preview WhatsApp visual
- [ ] Selector categoría UTILITY/MARKETING/AUTHENTICATION con tooltips de costo
- [ ] Selector idioma + multi-idioma (crear mismo `name` en N idiomas)
- [ ] Banner permanente "Meta cobra cada mensaje a tu tarjeta Facebook Business"
- [ ] Modal pre-crear MARKETING con tabla precios estimados por país
- [ ] Endpoints: `GET /templates/list`, `POST /templates/custom`, `DELETE /templates/{name}/{language}`
- [ ] Botón "Test send" enviar template de prueba al admin
- [ ] **Precios reales mayo 2026** (Meta puede actualizarlos, mostrar disclaimer):
  - UTILITY: $0.008 (CO/MX) → $0.04 (ES) por msg
  - MARKETING: $0.012 (CO) → $0.08 (BR) por msg
  - AUTHENTICATION: $0.030 (CO/MX/BR) → $0.057 (ES) por msg
### Sprint Bulk Send / Campañas Marketing (~5-6h dedicados)
> ⚠️ Sprint de ALTO RIESGO. Mandar mensajes equivocados a 1000 clientes = pesadilla. Requiere tests E2E exhaustivos.
- [ ] Quotas por plan: Solo 100/mes, Pro 1000/mes, Agency ilimitado
- [ ] Selector destinatarios desde CRM con filtros (tags, stage, score, días sin actividad)
- [ ] Validación pre-envío: cantidad + estimación costo + checkbox "Entiendo el cargo"
- [ ] Modal de confirmación con monto estimado + tabla de precios actualizada
- [ ] Disclaimer legal "Meta cobra esto a tu tarjeta de Facebook Business, no a clientes.bot"
- [ ] Tabla `MarketingCampaigns` con audit_log por campaña
- [ ] Métricas: sent / delivered / read / replied / converted / unsubscribed
- [ ] Botón "Cancelar campaña en vuelo" si detecta bug
### Sprint Multi-idioma plataforma completa (~12-15h código + ~30h traducción)
> NO bot UI multi-idioma — eso es sprint diferente. Hoy bot está hardcoded a español.
- [ ] **Bot**: 24 reglas del system_prompt traducidas por locale (es/en_US/pt_BR/fr)
- [ ] **Bot**: helper `_t(locale, key)` que lee diccionario por idioma
- [ ] **Bot**: ~200 strings hardcoded en send_text del flow comercial → diccionario por locale
- [ ] **Bot**: welcome menu, shipping, qualifier, scheduling success → todos i18n
- [ ] **Frontend**: instalar next-intl + extraer strings a JSON por idioma
- [ ] **Frontend**: ~50 páginas, miles de strings traducidos
- [ ] **Resend**: templates email por idioma
- [ ] **DDB seed**: prompts default por idioma (`templates/wizard-prompt`)
- [ ] **Tests E2E**: por idioma (manual al inicio, automatizado después)
### Backlog menor (de sprints anteriores aún pendiente)
- [ ] **B6.5.6** Push FCM al owner para recs ads alto impacto
- [ ] **B6.5.10** Resultado 48h post-apply (sistema aprende)
- [ ] **M19** Test event code mode (validar primeros 5 eventos CAPI)
- [ ] **M20** Dashboard Match Rate por tenant en `/admin/tenants/{id}`
- [ ] **Stripe** billing US/EU (Sprint K completo)
- [ ] **Fase F** Soporte/ticketing real
- [ ] Tests E2E pendientes Remarketing (info abandonment + cart abandonment con número real)
- [ ] Subir `REMARKETING_DELAY_HOURS` a 24h tras validar (actualmente 1h testing)
---
### 13 mayo 2026 (madrugada) — Limpieza ValidationException Bot v164 🦁
> Sesión ~15 min. Cerrado pendiente declarado en sprint 11 mayo. 4 call sites en `handle_payment_webhook` (Bot L3087, L3089, L3112, L3124) hacían `item.get("company_id", DEFAULT_COMPANY_ID)` — pero `.get(key, default)` NO usa el default si la key existe vacía. Con `DEFAULT_COMPANY_ID=""` (strict mode v19) → 2 ValidationException latentes en CloudWatch.
#### Fix (Bot v164)
- [x] Extraer `_cid_pay = (item.get("company_id") or DEFAULT_COMPANY_ID or "").strip()` UNA vez tras el item resuelto.
- [x] Guard explícito: si `_cid_pay` vacío tras blindaje → `logger.warning` + return 200 OK con `OK_NO_TENANT` (sin procesar post-pago, sin romper Wompi/Bold).
- [x] Reusar `_cid_pay` en los 4 call sites (`get_config_pro`, `get_services_catalog` x3) → 0 ValidationException posibles.
- [x] py_compile OK + deploy v164 verificado.
#### Lección 48
- **🟢 `.get(key, default)` ≠ `(item.get(key) or default)`**: el primero solo usa default si la key NO existe. Si existe con valor falsy (`""`, `None`, `0`) lo retorna tal cual. En multi-tenant strict con `DEFAULT_COMPANY_ID=""`, este patrón rompe silente. Patrón seguro: `(item.get(key) or default or "").strip()`.
### Próximos pendientes
- **M19/M20** — Test event code + Dashboard Match Rate por tenant.
- **B6.5.6/B6.5.10** — Push FCM ads + sistema aprende post-apply.
- **Stripe** — billing US/EU (crítico para mercados globales).
- **Fase F** — Soporte/ticketing real. el item. No rompen el flow (try/except los traga) pero ensucian CloudWatch.
- **`Tipo: ${data.service_type_label}` renderizado literal en DATE_SCREEN**: el bot manda la key bien, pero Meta no la interpola en el `TextBody`. Workaround acordado: eliminar el `TextBody` del flow JSON publicado (no es necesario que aparezca tipo de servicio, el cliente ya sabe qué pagó).
- **Datos JMC sin `service.scheduling.time_slots`**: el código está bien escrito (lee `time_slots` del servicio), pero el servicio `seminario-tiro-pistola-9mm` no tiene el campo configurado → cae al rango completo de `business_hours` (9-17). Pendiente: agregar el dato a DDB + construir UI multi-tenant en `/dashboard/services` para que clientes configuren sus horarios sin tocar DDB.
### 13 mayo 2026 (madrugada) — Sprint Wizard 2.0 Step 8 Premium 🦁
> Sesión ~4h. Cerró Step 8 del Wizard con UX premium + borrador persistente + cobro corregido. 2 commits frontend (`2b7b235` → `a904590`) + 1 deploy backend (API v185). Multi-tenant safe + escalable a 1M tenants sin tocar código (cap configurable desde DDB).
#### Frontend `a904590` — Step 8 premium
- [x] **Separación incrustar/lanzar**: 2 botones distintos (`✏️ Incrustar texto en imágenes` → `🚀 Lanzar campaña`). Imposible lanzar sin preview con overlay aplicado (guard `every`, no `some`). UX problem #1 resuelto.
- [x] **Dropdown copy→imagen por variante**: estado `imageHookMap: Record<imgIdx, copyIdx>` auto-poblado por rotación al generar copies. Cliente elige cuál copy va en cuál imagen vía `<select>` con preview de texto. UX problem #2 resuelto.
- [x] **Borrador localStorage multi-tenant**: keyed por `cb_wizard_draft_${company_id}` (cero leak cross-tenant). Auto-save debounced 500ms con dependencias completas. Hidratación al montar con `draftHydrated` gate (evita race con auto-save inicial vacío).
- [x] **TTL 30 días** en borrador (descarte silente si `savedAt < now - 30d`) + **limpieza post-launch** (sino relanza al volver) + **warning si servicio borrado** (limpia `selectedSlug` y notifica).
- [x] **Botón "+N más" con cap configurable**: lee `config_pro.wizard_max_images_per_round` y `wizard_default_images_per_round` (defaults 10 y 5). Selector dinámico `Array.from({length: Math.min(cap - len, 10)})`. Si mañana subes el cap a 20, cambias DDB sin tocar código.
- [x] **Regenerar todo con confirm**: separado del append. Borra todas, genera frescas, descuenta 1 wizard. UX clara.
- [x] **`generateMoreImages` con offset**: `index: previewImages.length + i` preserva selecciones previas al hacer toggle.
- [x] **Refresh quota tras descuento**: el contador 🎨 N wizards baja en tiempo real tras `+ Generar más`.
- [x] **`discardDraft` limpia TODO**: incluye `imageHookMap` y `selectedSlug` que se olvidaron en el botón original.
- [x] **Indicador "💾 Guardado"** discreto en el header.
#### Backend API v185 — Cobro de cuota corregido
- [x] **Auditoría reveló bug arquitectónico**: `handle_wizard_generate_strategy` descontaba 1 wizard (`SaaS_API_Handler/lambda_function.py:1629` consume_wizard_quota), pero `handle_wizard_generate_images_preview` NO descontaba nada. Cliente podía generar infinitas imágenes (donde está el costo real Gemini Image ~$0.025-0.05/imagen) y se le cobraba por planificar (Gemini Flash Lite ~$0.0001).
- [x] **Fix (API v185)**: cuota movida de `strategy` a `images-preview`. Strategy gratis (texto barato). Cada llamada a `images-preview` cobra 1 wizard sin importar si es 1ra ronda, append o regenerar-todo. Justo y predecible.
- [x] **Flag `append: true`** se loguea pero no afecta el descuento — el frontend lo marca para analytics futuros.
- [x] **GET /config** retorna `Item` completo de `config_pro` (solo filtra `meta_access_token`), por lo que `wizard_max_images_per_round` y `wizard_default_images_per_round` se entregan al frontend automáticamente si están seteados. Cero patch backend para soportar el cap configurable.
- [x] **Test E2E verificado en CloudWatch**: 2 líneas `wizard_quota consumed: company=JMC source=plan_unlimited append=False prompts=2` + `append=True prompts=2`. Strategy NO aparece en logs de quota.
#### Lecciones nuevas
45. **🔴 Cuota debe descontarse donde está el costo real**: cobrar por la operación cara (Gemini Image), no por la barata (texto). Audit cada endpoint de generación con LLM antes de marcar quota como "implementada".
46. **🟡 Multi-tenant config-driven**: cuando un parámetro pueda variar por tenant (cap de imágenes, max días scheduling, time_slots), siempre leerlo de `config_pro` con default sensato. Nunca hardcodear en código ni env var.
47. **🟢 Hidratación con gate**: cuando hidratas estado complejo desde storage en un useEffect, usa un flag `hydrated` que el auto-save respete con `if (!hydrated) return`. Sino el auto-save inicial pisa con vacío.
### 13 mayo 2026 (madrugada) — Sprint Scheduling UI multi-tenant CERRADO 🦁
> Sesión ~10 min. Sprint cerrado sin código nuevo — auditoría reveló que frontend (SHA `bd3cad7`) ya tenía la UI completa y el backend (`handle_add_service`/`handle_update_service`) acepta el dict `scheduling` agnósticamente. **Cero patch necesario.**
#### Validación E2E
- [x] Frontend `app/dashboard/services/page.tsx:543-668`: UI completa con toggle `time_slots` (7 AM-8 PM), `available_weekdays` (Lun-Dom), `booking_mode` (solapable/exclusive), `max_days_ahead`. Payload manda `scheduling.*` con los 4 campos nuevos.
- [x] Backend `handle_add_service` (`:5469-5493`) y `handle_update_service` (`:5518-5544`) aceptan dict `scheduling` completo sin filtrar campos. Cero whitelist innecesaria.
- [x] DDB JMC verificado: 2 servicios (`seminario-tiro-pistola-9mm` y `seminario-personalizado-9mm`) ya tienen `time_slots`, `available_weekdays: [1-6]` (sin lunes), `booking_mode`, `max_days_ahead: 30` persistidos.
- [x] Bot v162 ya lee estos campos con cascada svc→tenant→default (`STATUS.md:100`).
#### Lección 48
- **🟢 Auditar antes de codear**: cuando un sprint parece complejo, primero verificar si el frontend, backend y datos ya están alineados. En este caso 3 sprints anteriores (Bot v152 + Frontend `bd3cad7` + auto-update DDB del cliente) ya cerraron el sistema sin que nadie se diera cuenta. Sprint de 10 minutos en lugar de 4 horas.
### Próximos pendientes
- **2 `ValidationException` latentes en `handle_payment_webhook`** (L2904-3036 del bot): limpieza CloudWatch (no bloquea producción).
- **M19/M20** — Test event code + Dashboard Match Rate por tenant.
- **B6.5.6/B6.5.10** — Push FCM ads + sistema aprende post-apply.
- **Stripe** — billing US/EU (crítico para mercados globales).
- **Fase F** — Soporte/ticketing real. `handle_add_service` + `handle_update_service`.
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
- 8 pasos: Brand DNA check → Estrategia → Canales (TikTok+Google "FALTA") → Idioma → Producto+Beneficios → Referencias visuales → Grid 10 imágenes → Textos persuasivos
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
- 🟥 **Bug #69 NUEVO — Variantes Ads inservibles** (detectado 23 mayo): `handle_ads_duplicate_ad` (API L15330) reemplaza TODO el copy del ganador con solo el hook de 125 chars → anuncio sin precio, sin ubicación, sin beneficios, sin CTA → atrae curiosos que no convierten. Sprint dedicado "Ads Copy Generator v3" ~4h: endpoint nuevo `/ads/generate-ad-variants` que devuelve `{headline, primary_text completo 400-600 chars, description, cta, pattern}` + `business_profile` en config_pro (default_price, cta_phrase, urgency_phrases multi-tenant). Prompt Gemini enriquecido con precio del catálogo + ubicación + brand voice.
- 🟥 **Bug #70 NUEVO — Imágenes IA wizard no respetan referencias** (detectado 23 mayo): cliente sube fotos de su producto/lugar/equipo → Gemini Image genera imágenes que NO se parecen al producto real. Problema crítico para tenants con productos físicos. Sprint dedicado ~6h: auditar `handle_wizard_generate_images_preview` (cómo pasa refs a Gemini), validar prompt builder, posible refactor con plantillas por `business_vertical` (servicios vs producto físico vs evento) + agregar "USE these reference images STRICTLY" al prompt.
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
- [ ] **Instagram COmentarios** - responder comenatarios en los post de Instagram. con opcion de habilitar o deshabilitar en post independientes
- [x] **Facebook Messenger** — Bot v104-v114: mismo flujo IG, subscribed_apps v22 ✅
- [ ] **Instagram Publicaciones** (publicar contenido con IA)
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
### 🦁 Sprint 7 — RUGIDO FINAL
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
### Reglas nuevas — sesión 20 mayo (AUDIT-1)
32. **🔴 NUNCA `update-function-configuration --environment Variables={K=V}` con shorthand**: ese formato es **DESTRUCTIVO** — borra TODAS las env vars no especificadas. Aplica a Lambda, RDS parameter groups, ECS task definitions. Patrón seguro obligatorio: leer config completa con `get-function-configuration` → modificar dict en memoria → escribir con `--cli-input-json file://config.json`. Si vas a cambiar 1 sola variable, el archivo JSON debe incluir LAS 9 (o las que sean) — no solo la que cambias. Costo del error: 8 env vars perdidas + 15 min de recuperación leyendo de versión publicada anterior.
33. **🦁 Auditar antes de codear (5ta reaplicación)**: cuando el usuario pide cerrar pendientes del STATUS, primero VERIFICAR si ya están cerrados con grep + CloudWatch + DDB. Las sesiones intensas dejan deuda de documentación; el código suele estar más adelantado que la lista. Sprint AUDIT-1 confirmó: 4 de 9 items "pendientes" ya estaban cerrados. Tiempo ahorrado: ~10h.
34. **🔴 Defense-in-depth en funciones de DDB con PK requerida**: cualquier función que haga `table.get_item(Key={"pk": value})` debe tener guard `if not value: return None/[]` AL INICIO. Sin el guard, `value=""` genera `ValidationException` silente en CloudWatch (no rompe runtime pero ensucia logs). Costo: 4 líneas por función. Beneficio: blindaje contra todos los call sites futuros sin auditar cada uno individualmente.
### Reglas nuevas — sesión 22-23 mayo (Match Rate Meta)
35. **🔴 Campos canónicos vs legacy en escritura**: cuando hay 2 esquemas paralelos (`email` legacy vs `customer_email` canónico), TODA escritura debe usar el canónico. Los lectores hacen fallback con `X or Y`, pero el CAPI hashea solo el canónico → Match Rate cae silente. Audit obligatorio en TODO endpoint que escriba a tablas con migración previa.
36. **🔴 Meta external_id es ARRAY de hashes, no scalar**: Meta acepta `user_data["external_id"] = [hash1, hash2, ...]` con phone + document + cualquier ID propio. Sobreescribir un valor por otro = perder Match Rate. Patrón: acumulador `ext_ids = []; append; set único al final`.
37. **🔴 Side-effects post-action via `_internal_action` async**: cuando un endpoint API necesita disparar flujo completo del Bot (mensaje + CAPI + stock + post_flow), NO duplicar 150 líneas en API. Patrón limpio: API hace escrituras DDB + `lambda_client.invoke(InvocationType="Event", Payload={"_internal_action": "X"})`. Bot reusa su propio flujo. 30 líneas vs 150. Reutilizable para webhook, mark-manual, refund, etc.
38. **🔴 Gemini thinking mode consume tokens**: modelos `gemini-2.5-flash` con thinking activo gastan 1000-1500 tokens en pensamiento INTERNO antes de generar texto. `maxOutputTokens: 2000` queda corto. Agregar `thinkingConfig: {"thinkingBudget": 0}` libera todo el budget para la respuesta real. Aplicar en endpoints que generan análisis largos (no chat conversacional donde thinking ayuda).
39. **🟡 Test Events Manager es eventually consistent**: payload puede ser perfecto, Meta puede aceptar con `events_received:1`, y aún así Test Events visual tarda 6-24h en mostrarlo. NO debuggear payload por ausencia visual en Test Events — validar con **Graph API Explorer** directo. Si Graph Explorer responde `{events_received:1, messages:[]}` → código perfecto, solo esperar.
40. **🟢 Anticipo vs Pago completo en UI multi-tenant**: si producto soporta anticipo (`deposit_required` en catálogo), UI debe permitir elegir entre Anticipo y Pago completo con auto-fill del catálogo. Backend siempre reporta `regular_price` 100% a Meta CAPI (el wrapper `send_meta_capi_event` ya auto-corrige con `regular_price` del servicio cuando event_name=Purchase).
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
### Barra 1 — Features construidos del proyecto total
█████████████████████████████████░ 99.9%
### Barra 2 — Pendientes cerrados de los abiertos (actualizada 23 mayo)
████████░░░░░░░░░░░░░░░░░░░ 32% (8/25 items)
**Inventario de pendientes** al 23 mayo 2026:
- 🟢 **Cerrados sesión 22-23 mayo**: Bug #45 (customer_email canónico), external_id arrays, country/region/zip CAPI, sync-meta-leads retroactivo, apply-action 4 acciones, analyze MAX_TOKENS, mark-paid-manual end-to-end, validación Match Rate Graph Explorer.
- 🔴 Deuda técnica reciente: **2 de 4 abiertos** (UI post_booking_messages, test E2E remarketing, código fantasma saas_products Fase 3). Bug #44 carrusel skip pendiente.
- 🟥 **Bugs revenue-critical nuevos detectados**: Bug #69 (variantes Ads inservibles — solo hook 125 chars) + Bug #70 (imágenes IA wizard no respetan referencias).
- 🟠 Sprint E sin terminar: **2 abiertos** (Frontend wizard locale + selector idioma, Cron poll templates Meta).
- 🟡 Backlog menor: **5 abiertos** (B6.5.6 Push FCM ads, B6.5.10 sistema aprende post-apply, M19 Test event code, M20 Dashboard Match Rate por tenant, D-4 Cron expire feature overrides, C5 Eventos timeline enriquecido).
- 🟧 Frontend pequeños: **2 abiertos** (Dropdown selector templates en `/dashboard/templates`, Sección "Multicanal" visible en landing).
- ⚪ Operacional Meta: **1 abierto** (re-enviar video Embedded Signup para `ads_read`).
**Cerrados en sesión AUDIT-1** (20 mayo): env vars muertas del Bot + REMARKETING_DELAY_HOURS=24h + 3 ValidationException raíz (Bug 9.A/B/C) + Google Calendar multi-tenant confirmado.
> **Filosofía:** la Barra 2 es la métrica honesta del día a día. La Barra 1 ya está al 99.9% (features construidos), pero para "100% sin nada abierto" faltan 18 items reales (~22-30h de trabajo). Cada % de la Barra 2 = 1 pendiente cerrado.
### ⏱️ Métricas de desarrollo reales
| Métrica | Valor |
|---|---|
| **Horas invertidas hasta hoy** | ~613h |
| **Horas pendientes (completo)** | ~520h |
| **Total proyecto completo** | ~1,133h |
| **Equivalente invertido** | ~3.7 meses full-time senior |
| **Equivalente pendiente** | ~3.4 meses full-time senior |
| **MVP cobrable (Sprint 1)** | ✅ COMPLETADO — trial + billing + quotas E2E |
| **Match Rate Meta CAPI** | 5.7/10 → 7.5+/10 (en validación 24-48h) |
| **Eventos CAPI con PII enriquecida** | 277 (160 Purchase + 117 Lead) |
| **Endpoints revenue-critical nuevos** | `/payments/mark-paid-manual` + `/leads/sync-meta-leads` |
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
| Sesión 11-13 mayo (multi-tenant MASTER + 12 sprints + 10 bugs producción) | ~20h |
| Sesión 14 mayo (Enhanced CAPI + Templates Manager + Bulk Send) | ~6h |
| Sesión 15 mayo (Sprint Marketing Carousel + Polish + Test E2E) | ~3h |
| Debugging, rollbacks, incidentes varios | ~20h |
| Sesión 15-16 mayo (Marketing + Atribución + Revenue Protection) | ~20h |
| Sesión 20 mayo (AUDIT-1 + cleanup) | ~3h |
| Sesión 21 mayo (Fix Atribución ROAS + release multi-persona) | ~5h |
| Sesión 22-23 mayo (Match Rate Meta + Mark-Paid-Manual + Ads Pro v3 fixes) | ~11h |
| **Total** | **~613h** |
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
| ✅ Infraestructura construida | **95%** |
| ✅ Billing LS completo (trial+checkout+webhook+quotas) | 100% ✅ |
| ✅ Feature Flags + Quotas enforcement | 100% ✅ |
| ✅ Sprint E completo (recordatorios+email+PII+botones+no-show) | 100% ✅ |
| ✅ Enhanced CAPI (PII+fbc+regular_price) | 100% ✅ Match Rate 4→8/10 |
| ✅ Templates Manager (crear/listar/borrar UTILITY+MARKETING) | 100% ✅ |
| ✅ Multi-tenant funnel_mode (6 modos) + Lead Qualifier IA | 100% ✅ |
| ✅ Multicanal WhatsApp + IG + FB Messenger | 100% ✅ (pendiente App Review IG Advanced) |
| ✅ Programa Afiliados completo (4 tablas + cron + emails + tracker) | 100% ✅ |
| ✅ Bulk Send / Campañas Marketing (API v194 + Frontend `8d7d698`) | 100% ✅ |
| 🟡 Multi-idioma plataforma (bot+frontend) | 0% — sprint dedicado |
| 🟡 Admin Panel completo (F-K) | ~25% (D+E cerradas) |
| 🟡 Web Chat Widget | 0% |
**Última medición:** 23 mayo 2026 — **Sprint Match Rate Meta + Mark-Paid-Manual + Ads Pro v3 fixes CERRADO** 🦁🎯💯
API v239 + Bot v242 + Frontend `99e72d2`. Sesión maratón ~11h. 12 deploys (API v229→v239 + Bot v241→v242) + 1 commit frontend + 1 backfill DDB. Bug #45 raíz cerrado + 2 bonus (external_id arrays + country/region/zip CAPI) + endpoint `/leads/sync-meta-leads` retroactivo + endpoint revenue-critical `/payments/mark-paid-manual` (asesor marca pagos externos efectivo/transferencia/QR/link) con UX completa (banner PENDING + toggle Anticipo/Pago completo + reporte CAPI 100% valor) + apply-action 8 acciones + analyze MAX_TOKENS fix (thinkingBudget=0 + cascada 3 modelos). **277 eventos CAPI con PII enriquecida** enviados a Meta. Test E2E mark-paid-manual real validado. Payload Meta validado en Graph API Explorer: `{events_received:1, messages:[]}`. 9 lecciones nuevas (60-68). 2 bugs nuevos detectados para sprints dedicados: Bug #69 (variantes ad inservibles) + Bug #70 (imágenes IA no respetan refs). Próximo: Ads Pro v3 Copy Generator + Imágenes IA respeta refs + verificar Match Quality Meta dashboard 24h.
**Medición anterior:** 21 mayo 2026 — Sprint Fix Atribución ROAS. API v228 + Bot v240 + Frontend `f18ab09`.
**Medición anterior:** 16 mayo 2026 — **Sprint Marketing Completo + Atribución + Revenue Protection CERRADO** 🦁💰
API v215 + Bot v207 + Frontend `b30b7f5`. 2 sesiones ~20h total. Bot v198→v207 (10 deploys). API v200→v215 (16 deploys). Frontend 8 commits. **26 deploys sin tumbar producción.** 463 leads atribución backfill + 334 sesiones zombies liberadas + 121 Purchase re-enviados CON campaign_id a Meta. Carrusel marketing editor visual + 3 tabs destinatarios + audio/imagen S3 + rehidratación CRM + TTL sesiones + pax_count fix + anti-hallucination + ROAS fix. Cron `attribution-sync-every-10min` ENABLED.- [x] **99.9% Sprint Fix Atribución ROAS** (21 mayo, ~5h): 3 bugs revenue-critical cerrados (filtro CRM, análisis IA `_get_attribution_data` inexistente, release rompe multi-persona). Bot v240 + API v227 + API v228. ROAS 3.8x visible por primera vez. 4 lecciones nuevas (55-59). ⭐ ESTÁS AQUÍ
- [ ] **99.9% → 100%** — Migrar M11-M16 chat lineal → PII Flow v6 (atómico, no se rompe con takeover) + Cerrar 18 pendientes reales (Bug #44 + Bug #45 + UI post_booking + Sprint E frontend + Backlog menor + Multi-idioma + Fase F Soporte + Web Chat Widget) → RUGIDO 🦁
**Medición anterior:** 15 mayo 2026 — Sprint Marketing Carousel + Polish. API v199 + Bot v191 + Frontend `e1a5f15`. — **Sprint Marketing Carousel + Polish CERRADO** 🦁🎠
API v199 + Bot v191 + Frontend `e1a5f15`. Sesión ~3h. 3 deploys API (v197/v198/v199) + 4 commits frontend (`db06bfe` → `695156a` → `2611ba9` → `e1a5f15`). **Test E2E producción**: carrusel JMC 10 cards entregado a número real fuera ventana 24h ✅. Cliente puede enviar carruseles MARKETING aprobados desde UI nativa (ningún competidor LATAM tiene esto). UX completa: humanización plantillas, preview WhatsApp real con valores ejemplo, validación obligatoria mapeo variables, multi-select leads con checkboxes. 4 lecciones nuevas (59-62). Próximo: Multi-idioma plataforma + Fase F Soporte + Admin F-K restante.
**Medición anterior:** 14 mayo 2026 — **Sprint Enhanced CAPI + Templates Manager + Bulk Send CERRADOS** 🦁 API v193 + Bot v191 + Frontend `6c91137`. 3 sesiones en 2 días (~26h total). 48 versiones del bot (v153→v191). 8 versiones API (v185→v193). 14 commits frontend. 12 sprints completados + 10 bugs producción cerrados. Meta Match Rate 4/10 → 7-8/10. Templates APPROVED. Cron recordatorios + no-show ENABLED. Captura PII 5 campos single+multi-persona.
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
- [x] **95% → 96%** — Ads Pro v2 CERRADO 🎯 Regla #8 KILL_CREATIVE + Hook Generation + frontend ✨ Variantes. API v153-v155, frontend `92a3dcd`. 🦁
- [x] **96% → 97%** — AI Creative Loop CERRADO 🦁 5 motores E2E (Content Ingestion + Winner Analysis + Hook Gen multi_pattern + Creative Production Meta Graph + Publish+Learn cross-tenant). API v156-v164, frontend `e96fd2a` + `2e38b21`. 🦁
- [x] **97% → 98%** — Sprint Brand DNA + Wizard 2.0 CERRADO 🦁 Brand DNA scraping multi-source + Brand Assets Library + Wizard Backend 9 endpoints + Wizard Frontend 8 pasos + Andromeda overlay + cross-tenant + Wizard Packs LS. API v165-v179, frontend `246103f`. 27 deploys + 8 commits en 1 sesión.
- [x] **98% → 99%** — Sprint multi-tenant MASTER 🦁 (13-14 mayo, 2 sesiones ~20h). 12 sprints: funnel_mode 6 modos + Lead Qualifier IA + Shipping step-machine + Sprint E completo (captura PII 5 campos single+multi-persona + email confirmación Resend + cron recordatorios cascada WA→template→email + botones confirmar/reprogramar/cancelar + no-show) + auto-create templates 4 idiomas + payment link reuse + welcome menu fix debounce + anti-hallucination prompt. Bot v153→v189 (36 versiones), API v185→v191, Frontend 7 commits. 10 bugs producción cerrados.
- [x] **99% → 99.5%** — Sprint Enhanced CAPI + Templates Manager 🦁 (14 mayo sesión 3). PII completo CAPI + fbc click ID + value=regular_price + Templates Manager UI UTILITY+MARKETING. Bot v191, API v192-v193, Frontend `6c91137`. **Meta Match Rate: 4/10 → 7-8/10.**
- [x] **99.5% → 99.7%** — Sprint Bulk Send / Campañas Marketing 🦁 (14 mayo sesión 3 final). `/dashboard/marketing` envío masivo templates + filtros leads (etapa/tags/servicio/inactividad) + mapeo variables→campos lead + estimador costo USD + checkbox "Entiendo el cargo Meta" + quotas por plan + historial campañas + audit log. API v194 + Frontend `8d7d698`.
- [x] **99.7% → 99.8%** — Sprint Marketing Carousel + Polish CERRADO 🦁🎠 (15 mayo, ~3h). API v197-v199, Frontend `db06bfe` → `e1a5f15`.
- [x] **99.8% → 99.9%** — Sprint Marketing Completo + Atribución + Revenue Protection 🦁💰 (15-16 mayo, ~20h). Bot v198→v207 (10 deploys). API v200→v215 (16 deploys). Frontend `e1a5f15` → `b30b7f5` (8 commits). 463 leads atribución backfill + 334 sesiones zombies + 121 Purchase re-enviados CON campaign_id. Carrusel marketing editor visual + lista externa + audio/imagen S3 + rehidratación CRM + TTL sesiones + pax_count fix + anti-hallucination + ROAS fix. **Diferenciador: ni Manychat ni Wati tienen carrusel marketing desde UI + atribución CAPI completa + editor visual + lista externa.** ⭐ ESTÁS AQUÍ
- [ ] **99.9% → 100%** — Multi-idioma + Fase F Soporte + Web Chat Widget + RUGIDO 🦁 (15 mayo, ~3h). Carruseles MARKETING en campañas masivas fuera de ventana 24h. `/templates/list` enriquecido + `/marketing/send-bulk` con helper `_upload_image_to_meta_for_bulk` cache `(url, phone_id)` + payload `components.carousel.cards`. UX completa: humanización plantillas en `/marketing` y `/templates/manage`, preview WhatsApp real con valores ejemplo, validación mapeo variables, multi-select leads checkbox. **Test E2E producción**: carrusel JMC 10 cards entregado a número real fuera ventana 24h ✅. API v197-v199, Frontend `db06bfe` → `695156a` → `2611ba9` → `e1a5f15`. **Diferenciador real**: ningún competidor LATAM tiene esto en UI nativa. ⭐ ESTÁS AQUÍ
- [x] **99.9% Sprint AUDIT-1** (20 mayo, ~3h): cero features nuevas, 100% auditoría. 4 deudas técnicas cerradas + 5 falsos pendientes confirmados como ya hechos. Bot v236 + API v224.
- [x] **99.9% Sprint Fix Atribución ROAS** (21 mayo, ~5h): 3 bugs revenue-critical cerrados (filtro CRM, análisis IA `_get_attribution_data` inexistente, release rompe multi-persona). Bot v240 + API v227 + API v228. ROAS 3.8x visible por primera vez. 4 lecciones nuevas (55-59).
- [x] **99.9% Sprint Match Rate Meta + Mark-Paid-Manual** (22-23 mayo, ~11h): Bug #45 raíz cerrado + 2 bonus CAPI (external_id arrays + country/region/zip) + endpoint `/leads/sync-meta-leads` retroactivo + endpoint revenue-critical `/payments/mark-paid-manual` con UX completa + apply-action 8 acciones + analyze MAX_TOKENS fix. **277 eventos CAPI con PII enriquecida** + payload validado en Graph Explorer. 12 deploys (API v229→v239 + Bot v241→v242 + Frontend `99e72d2`). 9 lecciones nuevas (60-68). 2 bugs nuevos detectados (#69 variantes ad inservibles + #70 imágenes IA refs). ⭐ ESTÁS AQUÍ
- [ ] **99.9% → 100%** — Sprint Ads Pro v3 (Copy Generator + Imágenes IA respeta refs) + Migrar M11-M16 chat lineal → PII Flow v6 atómico + Cerrar pendientes reales (Sprint E frontend + Backlog menor + Multi-idioma + Fase F Soporte + Web Chat Widget) → RUGIDO 🦁
> *"Cada % se gana con café. Cada café se gana con un commit."*
> *"La Barra 2 es la verdad. La Barra 1 es el marketing. Si llegas a 100% en ambas, ruges."*
---
## 📞 CONTACTO
- Email: soporte@clientes.bot
- WhatsApp: +57 XXX
- Empresa: SGC Technology S.A.S.
- Juan Martinez