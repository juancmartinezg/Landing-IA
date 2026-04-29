# 🦁 LANDING V2 — Estrategia "GoHighLevel++"
> **Blueprint completo** de la landing pública de clientes.bot.
> Este documento es la **única fuente de verdad** del diseño/copy/pricing de la landing.
> Si arrancás un chat nuevo: lee `STATUS.md` + este archivo y tenés todo.
**Última actualización:** 29 abril 2026
**Estado:** 📐 Diseñada, NO implementada (esperando Sprint 1 Stripe vivo)
**Prerequisito de publicación:** Sprint 1 completo (Stripe + Wompi + afiliados funcionando)
---
## 🎯 Posicionamiento
**Tagline principal:**
> *"Lo que GoHighLevel debería haber sido."*
**Subtítulo:**
> WhatsApp con IA real. Atribución completa de ventas. Multi-pasarela LATAM. Voz IA incluida. Por el mismo precio.
**NO competimos por precio — competimos por valor con precio igualado al líder.**
---
## 💰 Pricing definitivo
### USD (Stripe — global)
| Plan | Precio | Target | vs GHL |
|---|---|---|---|
| **Solo** | $97/mes | 1 negocio, 1 WhatsApp | = GHL Starter $97 (con IA real) |
| **Pro** ⭐ | $297/mes | PYME con equipo, 5 sub-cuentas | = GHL Unlimited $297 (con CAPI + Voz) |
| **Agency** | $497/mes | White-label total ilimitado | = GHL SaaS Pro $497 (con cron IA Ads) |
| **Enterprise** | $997+/mes | Custom + account manager | (GHL no tiene equivalente) |
### COP (Wompi — Colombia)
| Plan | COP/mes | USD eq |
|---|---|---|
| **Solo** | $349,000 | $97 |
| **Pro** | $1,090,000 | $297 |
| **Agency** | $1,790,000 | $497 |
| **Enterprise** | $3,590,000+ | $997+ |
### Promos de lanzamiento
- 🎁 **Trial 14 días sin tarjeta** (= GHL)
- 💰 **Annual -20%** (Solo $77 / Pro $237 / Agency $397)
- 🦁 **Lifetime Beta — 25 cupos $97 one-time = Solo plan FOREVER** (escasez real)
- ❌ **NO plan Free** (mata percepción premium)
---
## 📊 Quotas por plan
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
| Onboarding | Self-service | Video llamada | Setup completo | Account manager |
---
## 🔥 Comparativa GoHighLevel — bloque destacado de la landing
| Feature | GoHighLevel | clientes.bot |
|---|---|---|
| WhatsApp Bot IA | ❌ Solo Twilio básico | ✅ IA Gemini conversacional + neuroventas + memoria |
| Meta CAPI + atribución multi-touch | ❌ No tiene | ✅ Funnel completo first-touch + last-touch |
| Pasarelas LATAM (Wompi/Bold/PayU) | ❌ Solo Stripe/PayPal | ✅ 7+ pasarelas |
| Cron IA recomendaciones Ads | ❌ No tiene | ✅ 7 reglas (SCALE/PAUSE/REDUCE/etc) |
| VAPI Voz IA | ❌ Add-on caro | ✅ Incluido |
| Multi-persona pago/agendamiento | ❌ No tiene | ✅ Genérico (1 compra = N cupos) |
| Embedded Signup Meta automático | ❌ Manual | ✅ Pixel + ad_account auto |
| Multi-tenant strict mode | ✅ Sí | ✅ Sí |
| Funnel builder visual | ✅ Drag & drop | 🟡 Sprint 4 |
| Cursos / Membership | ✅ | ❌ No tenés |
| Affiliate manager 30% recurring **FOREVER** | ❌ (40% año 1, 5% después) | ✅ Para siempre |
| Cookie afiliado | 30 días | **90 días** |
| Migration 1-click desde GHL | — | ✅ CSV importer |
| **Precio** | **$297/mes** | **$297/mes** |
**Frase de cierre del bloque:**
> *"Mismo precio. 3x más features. Diseñado para LATAM con IA real."*
---
## 🤝 Programa de Afiliados — diferenciador clave
### Estructura
| Concepto | clientes.bot | GHL | ClickFunnels |
|---|---|---|---|
| Comisión | **30% recurring FOREVER** | 40% año 1, 5% después | 30% recurring forever |
| Cookie | **90 días** | 30 días | 30 días |
| Min payout | $50 USD / $200k COP | $100 | $50 |
| Pago | Mensual día 5 | Mensual | Mensual |
| Sub-afiliados (2-tier) | 🟡 Sprint 4 | ❌ | ❌ |
### Pitch para afiliados (texto exacto en `app/afiliados/page.tsx`)
> *"Refiere 10 clientes Pro ($297/mes). Ganás $891/mes recurrente. Para siempre. Mientras ese cliente siga pagando, tú cobrás. Sin tope. Sin caducidad."*
**Comparativo a 3 años (10 clientes Pro):**
| | clientes.bot | GoHighLevel |
|---|---|---|
| Año 1 | $10,692 | $14,160 |
| Año 2 | $10,692 | $1,776 |
| Año 3 | $10,692 | $1,776 |
| **Total 3 años** | **$32,076** ⭐ | $17,712 |
A partir del año 2, **6x más con clientes.bot**.
---
## 📐 Estructura de páginas
app/ ├── page.tsx # Home / hero + features destacadas ├── pricing/ │ └── page.tsx # 3 planes + comparativa GHL + FAQ ├── comparativa/ │ └── page.tsx # GHL vs clientes.bot lado-a-lado ├── afiliados/ │ └── page.tsx # Programa 30% recurring forever ├── beta/ │ └── page.tsx # Form waitlist Lifetime $97 x 25 cupos ├── migrate-from-ghl/ │ └── page.tsx # Importador CSV + guía └── (existentes) ├── politica-de-privacidad/ ├── terminos/ └── auth/

---
## 🎨 Wireframes textuales
### `app/page.tsx` (Home)
┌──────────────────────────────────────────────────┐ │ NAV: Logo · Pricing · Comparativa · Afiliados · Login │ ├──────────────────────────────────────────────────┤ │ │ │ HERO │ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │ "Lo que GoHighLevel debería haber sido." │ │ │ │ WhatsApp IA real · Atribución completa · │ │ Multi-pasarela LATAM · Voz IA incluida. │ │ Por el mismo precio. │ │ │ │ [🚀 Empezar trial 14 días] [▶️ Ver demo] │ │ │ ├──────────────────────────────────────────────────┤ │ FEATURES DESTACADAS (6 cards) │ │ 🤖 IA Gemini 📊 Meta CAPI 🇨🇴 Pasarelas LATAM │ │ 📞 Voz IA 🎯 Ads cron IA 🔄 Multi-canal │ ├──────────────────────────────────────────────────┤ │ COMPARATIVA RÁPIDA vs GHL (tabla 5 filas) │ │ [Ver comparativa completa →] │ ├──────────────────────────────────────────────────┤ │ TESTIMONIOS (placeholder hasta tener reales) │ ├──────────────────────────────────────────────────┤ │ CTA FINAL: "Únete al beta — $97 lifetime" │ │ [Ver pricing] [Programa afiliados] │ ├──────────────────────────────────────────────────┤ │ FOOTER │ └──────────────────────────────────────────────────┘

### `app/pricing/page.tsx`
┌──────────────────────────────────────────────────┐ │ HEADER: "Pricing simple. Transparente." │ │ Toggle: [Mensual] [Anual -20%] │ │ Selector: [USD] [COP] │ ├──────────────────────────────────────────────────┤ │ 3 CARDS LADO A LADO │ │ ┌──────┐ ┌──────────┐ ┌──────┐ │ │ │ Solo │ │ Pro ⭐ │ │Agency│ │ │ │ $97 │ │ $297 │ │ $497 │ │ │ │ │ │ (popular)│ │ │ │ │ │ Lista│ │ Lista │ │ Lista│ │ │ │feats │ │ feats │ │feats │ │ │ │[CTA] │ │[CTA] │ │[C

se corto
🦁 Continúo desde donde se cortó. Pegá esto a continuación del bloque anterior:

│  Lista│ │ Lista    │ │Lista │                  │
│  │feats │ │ feats    │ │feats │                  │
│  │[CTA] │ │[CTA]     │ │[CTA] │                  │
│  └──────┘ └──────────┘ └──────┘                  │
│  + Card "Enterprise — Contact sales"             │
├──────────────────────────────────────────────────┤
│  COMPARATIVA GHL (tabla completa, ver arriba)    │
├──────────────────────────────────────────────────┤
│  FAQ                                             │
│  - ¿Puedo cancelar cuando quiera?                │
│  - ¿Qué pasa con mis datos si cancelo?           │
│  - ¿Trial sin tarjeta?                           │
│  - ¿Multi-pasarela funciona en mi país?          │
│  - ¿Migración desde GHL es gratis?               │
├──────────────────────────────────────────────────┤
│  CTA FINAL: Lifetime Beta $97 (X cupos restantes)│
└──────────────────────────────────────────────────┘
app/comparativa/page.tsx
┌──────────────────────────────────────────────────┐
│ HEADER: "GoHighLevel vs clientes.bot"            │
│ Subtítulo: "Mismo precio. Decide informado."     │
├──────────────────────────────────────────────────┤
│ TABLA COMPLETA 30+ FEATURES                      │
│ Columnas: Feature | GHL ❌/✅ | clientes.bot ✅  │
├──────────────────────────────────────────────────┤
│ BLOQUE "Por qué somos diferentes"                │
│ - IA Gemini real (no GPT genérico)               │
│ - Meta CAPI con AdsAttribution                   │
│ - LATAM nativo (Wompi/Bold/PayU/MercadoPago)     │
│ - Voz IA VAPI incluida                           │
│ - Cron IA Ads (7 reglas SCALE/PAUSE/REDUCE)      │
├──────────────────────────────────────────────────┤
│ MIGRATION TOOL                                   │
│ "¿Ya estás en GHL? Migra en 1 click"            │
│ [Cómo migrar →]                                  │
├──────────────────────────────────────────────────┤
│ CTA: [Ver pricing] [Solicitar demo]              │
└──────────────────────────────────────────────────┘
app/afiliados/page.tsx
┌──────────────────────────────────────────────────┐
│ HERO: "Gana 30% recurring. FOREVER."             │
│ Subtítulo: "Sin tope. Sin caducidad. Cookie 90d."│
├──────────────────────────────────────────────────┤
│ CALCULADORA                                      │
│ "Refiere [10] clientes [Pro $297] →              │
│  Ganás $891/mes recurrente"                      │
├──────────────────────────────────────────────────┤
│ COMPARATIVO 3 AÑOS (tabla GHL vs clientes.bot)   │
│ "A partir del año 2, 6x más con nosotros"        │
├──────────────────────────────────────────────────┤
│ CÓMO FUNCIONA (3 pasos)                          │
│ 1. Aplica al programa (sin costo)                │
│ 2. Comparte tu link único                        │
│ 3. Cobrás cada mes que tu referido pague         │
├──────────────────────────────────────────────────┤
│ FAQ AFILIADOS                                    │
│ - ¿Cuándo me pagan? Día 5 de cada mes            │
│ - ¿Min payout? $50 USD / $200k COP              │
│ - ¿Cómo me pagan? Stripe Connect / Wompi         │
│ - ¿Tengo que ser cliente? No                     │
├──────────────────────────────────────────────────┤
│ CTA: [Aplicar ahora]                             │
└──────────────────────────────────────────────────┘
app/beta/page.tsx
┌──────────────────────────────────────────────────┐
│ HEADER: "Lifetime Beta — 25 cupos"               │
│ Counter: "Quedan X cupos"                        │
├──────────────────────────────────────────────────┤
│ "Plan Solo FOREVER por $97 one-time"             │
│ "Mientras existan los servidores, tú no pagás    │
│  mensualidad."                                   │
├──────────────────────────────────────────────────┤
│ Lista de qué incluye (= plan Solo)               │
├──────────────────────────────────────────────────┤
│ FORM:                                            │
│ - Email                                          │
│ - WhatsApp                                       │
│ - País                                           │
│ - "¿Qué te dolería de tu stack actual?"          │
│ [Aplicar al Beta]                                │
├──────────────────────────────────────────────────┤
│ Letra chica: "Aprobamos manualmente. Te          │
│ contactamos en 48h."                             │
└──────────────────────────────────────────────────┘
📝 Copy / Textos exactos
Hero principal (home)
H1:

Lo que GoHighLevel debería haber sido.

H2:

WhatsApp con IA real. Atribución completa de ventas. Multi-pasarela LATAM. Voz IA incluida. Por el mismo precio.

Bullets de impacto (3):

🤖 IA Gemini conversacional — no chatbots genéricos, sino ventas reales
📊 Meta CAPI con atribución multi-touch — sabes qué ad vendió qué
🇨🇴 Pasarelas LATAM nativas — Wompi, Bold, PayU, MercadoPago
CTA primario: 🚀 Empezar trial 14 días CTA secundario: ▶️ Ver demo en vivo

6 features destacadas (cards home)
🤖 WhatsApp IA Gemini — Memoria conversacional, neuroventas, transcripción de voz
📊 Meta CAPI completo — Lead, InitiateCheckout, Purchase, Schedule. Atribución first + last touch
🇨🇴 Multi-pasarela LATAM — Wompi, Bold, PayU, MercadoPago, OpenPay, Stripe, PayPal
📞 Voz IA VAPI — Llamadas automáticas con voz natural. Incluido sin add-on
🎯 Ads Pro IA — Cron diario con 7 reglas (SCALE, PAUSE, REDUCE, etc). Recomienda, tú decides
🔄 Multi-canal — WhatsApp, Web Chat, Instagram, Messenger, Telegram, Email
Frases de venta por plan
Solo $97: "Todo lo de GHL Starter, con IA Gemini real, CAPI completo y pasarelas LATAM. Por el mismo precio."
Pro $297: "5 sub-cuentas, Ads Pro IA con cron, Voz IA 300 min. Lo que GHL Unlimited debería haber sido."
Agency $497: "White-label total, sub-cuentas ilimitadas, soporte WhatsApp 1h. Tu reventa de SaaS lista."
Enterprise $997+: "Account manager dedicado, custom domain, integraciones a medida. Para empresas que no negocian."
Tagline programa afiliados
"Gana 30% recurring. FOREVER." Mientras tu referido siga pagando, tú cobrás. Sin tope. Sin caducidad.

Disclaimer beta (importante mientras Sprint 1 no esté listo)
Cualquier botón de pago/registro debe llevar a:

🚀 "Estamos en lanzamiento privado. Únete al beta y reserva tu cupo lifetime $97."

🔒 Candados de seguridad (NO NEGOCIABLES hasta Sprint 1 completo)
1. Botones deshabilitados o redirigen a beta
// En lugar de:
<button onClick={() => goToCheckout('pro')}>Empezar Pro</button>
// Usar:
<Link href="/beta">Reservar cupo Beta</Link>
2. Robots.txt y meta tags
En cada página nueva (pricing, comparativa, afiliados, beta, migrate-from-ghl):

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
Y en public/robots.txt:

User-agent: *
Disallow: /pricing
Disallow: /comparativa
Disallow: /afiliados
Disallow: /beta
Disallow: /migrate-from-ghl
3. Banner "lanzamiento próximo" en cada página nueva
<div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mb-6">
  🚀 <strong>Lanzamiento próximo</strong> — únete al beta y reserva tu cupo lifetime
</div>
4. Form waitlist en lugar de checkout real
Capturar email + WhatsApp en DDB tabla BetaWaitlist (PK email, GSI created_at-index, fields: country, current_stack, applied_at, status PENDING/APPROVED/DECLINED).

✅ Checklist de implementación
Pre-requisitos (antes de tocar landing)
 Sprint 1 completo (Stripe + Wompi + afiliados funcionando)
 Tabla BetaWaitlist creada en DynamoDB
 Endpoint POST /beta/apply en SaaS_API_Handler
Páginas nuevas (en orden de implementación)
 app/beta/page.tsx — Form waitlist (PRIMERO, lo necesitan los CTAs)
 app/pricing/page.tsx — 3 planes + comparativa + FAQ
 app/comparativa/page.tsx — GHL vs clientes.bot detallado
 app/afiliados/page.tsx — Programa 30% recurring + calculadora
 app/migrate-from-ghl/page.tsx — Importador CSV + guía
 app/page.tsx (home) — Actualizar hero + features
Componentes reutilizables a crear
 components/PricingCard.tsx — Card de plan con CTA
 components/ComparisonTable.tsx — Tabla feature-by-feature
 components/AffiliateCalculator.tsx — Calculadora interactiva
 components/BetaWaitlistForm.tsx — Form de aplicación
 components/CurrencyToggle.tsx — Switch USD/COP
 components/BillingCycleToggle.tsx — Switch Mensual/Anual
Backend support (en SaaS_API_Handler)
 POST /beta/apply — guarda en BetaWaitlist
 GET /beta/cupos-restantes — retorna 25 - count(APPROVED)
 POST /affiliate/signup — ya planeado en S1.L
SEO + meta
 Cada página
continua
🦁 Continúo desde donde se cortó:

### SEO + meta
- [ ] Cada página nueva con `robots: { index: false, follow: false }` hasta Sprint 1 listo
- [ ] `public/robots.txt` bloqueando páginas en construcción
- [ ] Open Graph images por página (1200x630)
- [ ] Favicon + apple-touch-icon actualizados
- [ ] `sitemap.xml` solo con páginas aprobadas para indexar
### Analytics + tracking
- [ ] GA4 / Plausible configurado en todas las páginas
- [ ] Eventos custom:
  - `pricing_viewed` (plan visto)
  - `pricing_cta_clicked` (plan + currency)
  - `comparison_scrolled` (profundidad)
  - `beta_applied` (con UTM source)
  - `affiliate_signup_started`
- [ ] UTM params respetados en conversiones
### Post-Sprint 1 (quitar candados)
- [ ] Quitar meta `noindex` de las páginas nuevas
- [ ] Actualizar `robots.txt` y `sitemap.xml`
- [ ] Reemplazar "Reservar beta" por checkout real (`/billing/checkout`)
- [ ] Activar Google Search Console submit
- [ ] Primer sitemap ping a Google
---
## 🎨 Estilo visual propuesto
### Paleta (mantener coherencia con actual)
- **Primary:** #F59E0B (amber-500) — ya usado en botones
- **Background:** #0B0F1A (dark slate)
- **Accent success:** #10B981 (emerald-500)
- **Accent danger (vs GHL ❌):** #EF4444 (red-500)
- **Accent highlight (vs clientes.bot ✅):** #F59E0B (amber-500)
### Tipografía
- **Headings:** Inter o Geist (lo que ya usa Landing-IA)
- **Body:** Mismo sistema actual
- **Monospace (precios/código):** JetBrains Mono o ui-monospace
### Animaciones
- **Hero:** fade-in staggered + tipo "máquina de escribir" para tagline
- **Features cards:** hover lift con shadow amber
- **Comparativa:** sticky header + highlight de fila al hover
- **Calculadora afiliados:** animación de número contador al cambiar inputs
### Responsive
- **Mobile first** (la mayoría del tráfico LATAM es mobile)
- **Breakpoints:** sm 640px · md 768px · lg 1024px · xl 1280px
- **Comparativa en mobile:** colapsar a acordeón (GHL colapsado, clientes.bot expandido)
---
## 📋 Ejemplos de componentes clave
### `components/PricingCard.tsx`
```tsx
interface PricingCardProps {
  name: string;
  priceUSD: number;
  priceCOP: number;
  currency: 'USD' | 'COP';
  cycle: 'monthly' | 'annual';
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}
Visual:

Card dark con borde amber si popular
Badge "⭐ Popular" top-right si Pro
Precio grande (text-5xl) + ciclo pequeño
Lista de features con check ✅
CTA full-width amber
components/ComparisonTable.tsx
interface ComparisonRow {
  feature: string;
  ghl: 'yes' | 'no' | 'partial' | string;
  clientesBot: 'yes' | 'no' | 'partial' | string;
  highlight?: boolean;
}
Render:

yes → ✅ emerald
no → ❌ red
partial → 🟡 amber
string → texto literal
components/AffiliateCalculator.tsx
Estado:

numReferrals: number (default 10)
planSelected: 'solo' | 'pro' | 'agency' (default 'pro')
currency: 'USD' | 'COP'
Cálculo:

const commissionRate = 0.30;
const monthlyPerPlan = { solo: 97, pro: 297, agency: 497 };
const monthlyEarnings = numReferrals * monthlyPerPlan[planSelected] * commissionRate;
const yearly = monthlyEarnings * 12;
const threeYear = yearly * 3;
Output visible:

Ganancia mensual
Ganancia anual
Ganancia 3 años
Comparativo GHL (lado a lado)
🚀 Orden sugerido de implementación (cuando arranquemos)
Fase 1 — Backend soporte (pre-landing)
Crear tabla BetaWaitlist en DynamoDB
Endpoint POST /beta/apply + GET /beta/cupos-restantes
Email Resend de confirmación al aplicar
Fase 2 — Página beta (primera en público)
components/BetaWaitlistForm.tsx
app/beta/page.tsx
Testing: form envía, email llega, admin ve en DynamoDB
Fase 3 — Componentes base
components/PricingCard.tsx
components/ComparisonTable.tsx
components/CurrencyToggle.tsx
components/BillingCycleToggle.tsx
components/AffiliateCalculator.tsx
Fase 4 — Páginas principales
app/pricing/page.tsx
app/comparativa/page.tsx
app/afiliados/page.tsx
app/migrate-from-ghl/page.tsx
Fase 5 — Home actualizado
app/page.tsx con hero v2 + features + comparativa rápida
Fase 6 — Pulir + lanzar (post Sprint 1)
Quitar candados noindex
Reemplazar CTAs beta por checkout real
Analytics eventos custom
Sitemap + Search Console
🎯 Métricas de éxito (cuando se publique)
Pre-rugido (modo silencioso)
 25 cupos Lifetime Beta ocupados (~$2,425 capital early)
 Tasa de aplicación beta / visita home > 5%
 10 afiliados registrados (aunque sin activos todavía)
Post-rugido (Sprint 7)
 100 trials activos
 20 conversiones trial → pago
 30 afiliados activos generando al menos 1 referral/mes
 5 migraciones completadas desde GHL
⚠️ Reglas inamovibles de la landing
Nunca mentir sobre features — si no está, no va en comparativa
Nunca prometer fechas — filosofía LEÓN ("sin fechas, sin presión")
Nunca cobrar sin producto listo — CTAs → waitlist hasta Sprint 1 verde
Nunca pricing por abajo de GHL — competimos por valor, no precio
Nunca plan Free — mata percepción premium
Siempre trial 14 días sin tarjeta (= GHL, igualar mínimo)
Siempre tagline "GoHighLevel debería haber sido" en home
Siempre comparativa vs GHL visible en pricing + página dedicada
📞 Handoff para futuros chats
Si arrancás un chat nuevo y querés implementar esto:

Leé STATUS.md primero (contexto general)
Leé este LANDING_V2.md (blueprint de landing)
Pedí SHA actual de Landing-IA
Confirmá estado de Sprint 1 (Stripe vivo o no)
Si Sprint 1 NO listo → solo construir con candados noindex + waitlist
Si Sprint 1 SÍ listo → quitar candados y activar checkout real
🦁 Notas finales
No publicar hasta Sprint 1 vivo. Este blueprint queda diseñado, no implementado.
Pitch deck privado en PDF — exportar este documento como PDF para mostrar a afiliados early sin landing pública.
Revisar pricing trimestralmente — si LTV promedio > $300, considerar subir Pro a $349.
A/B testear el tagline — "Lo que GHL debería haber sido" vs "El GoHighLevel con IA real que LATAM merece".
"El león no anuncia su llegada. Cuando la presa lo ve, ya es tarde."

---
## 📝 Commit message sugerido
docs(landing): blueprint completo LANDING_V2 "GoHighLevel++"

Pricing definitivo: Solo $97 / Pro $297 / Agency $497 / Enterprise $997+
Comparativa 15+ features vs GHL
Programa afiliados 30% recurring forever + calculadora
Wireframes de 6 páginas (home, pricing, comparativa, afiliados, beta, migrate)
Copy exacto de todos los CTAs y taglines
Candados de seguridad (noindex, waitlist) hasta Sprint 1 completo
Checklist de implementación en 6 fases
Reglas inamovibles + handoff para chats futuros
Estado: diseñado, NO implementado. Esperando Sprint 1 (Stripe + Wompi + afiliados).

---
## ✅ Verificación del archivo completo
Cuando lo pegues, deberías tener un `LANDING_V2.md` con estas secciones:
| # | Sección | Estado |
|---|---|---|
| 1 | Posicionamiento | ✅ |
| 2 | Pricing USD + COP | ✅ |
| 3 | Promos de lanzamiento | ✅ |
| 4 | Quotas por plan | ✅ |
| 5 | Comparativa GHL | ✅ |
| 6 | Programa afiliados + comparativo 3 años | ✅ |
| 7 | Estructura de páginas | ✅ |
| 8 | Wireframes textuales (5 páginas) | ✅ |
| 9 | Copy / textos exactos | ✅ |
| 10 | Candados de seguridad | ✅ |
| 11 | Checklist de implementación | ✅ |
| 12 | Estilo visual | ✅ |
| 13 | Ejemplos de componentes | ✅ |
| 14 | Orden de implementación en 6 fases | ✅ |
| 15 | Métricas de éxito | ✅ |
| 16 | Reglas inamovibles | ✅ |
| 17 | Handoff para futuros chats | ✅ |