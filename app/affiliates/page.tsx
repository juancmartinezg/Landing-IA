'use client';
import { useState } from 'react';
import Link from 'next/link';
import AffiliateTracker from '../components/AffiliateTracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AffiliatesLandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError('Por favor completa tu nombre y email.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/affiliate/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && (data.affiliate_code || data.status === 'ok')) {
        setSubmitted(true);
      } else {
        setError(data.error || 'No se pudo registrar. Intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 scroll-smooth">
      <AffiliateTracker />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
          <Link href="/" className="flex flex-col md:flex-row items-center gap-0 md:gap-2 shrink-0">
            <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
            <span className="text-[9px] md:text-xl font-bold tracking-tighter">clientes.bot</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#ganancias" className="hover:text-white transition-colors">Ganancias</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/" className="hover:text-white transition-colors">Volver al inicio</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Link href="/auth/login"
              className="border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 px-2.5 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap">
              Iniciar sesión
            </Link>
            <a href="#registro"
              className="bg-emerald-600 hover:bg-emerald-500 px-2.5 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap">
              Unirme gratis
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-gray-400 text-xl ml-1" aria-label="Menu">☰</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#0B0F1A] border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#como-funciona" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Cómo funciona</a>
            <a href="#ganancias" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Ganancias</a>
            <a href="#faq" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">FAQ</a>
            <Link href="/" className="block text-sm text-gray-400 hover:text-white">Volver al inicio</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-600/8 blur-[200px] -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] text-emerald-300 font-bold">Programa de afiliados — Sin costo, sin mínimos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Gana{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
              comisiones
            </span>
            <br />para siempre.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
            Recomienda clientes.bot y gana el{' '}
            <strong className="text-white">40% el primer año</strong> y{' '}
            <strong className="text-white">30% recurring forever</strong> por cada cliente que se suscriba con tu link.
            Sin techo. Sin caducidad. Sin complicaciones.
          </p>
          <p className="text-[11px] text-gray-600 mb-10">
            GoHighLevel da 40% el año 1, luego solo 5%. Nosotros te damos 6x más a partir del año 2. 🦁
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#registro"
              className="bg-emerald-600 hover:bg-emerald-500 hover:scale-105 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-emerald-600/25 inline-flex items-center justify-center gap-2">
              🤝 Unirme al programa — gratis
            </a>
            <a href="#ganancias"
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold text-base transition-all inline-flex items-center justify-center gap-2">
              💰 Calcular mis ganancias
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: '40%', l: 'Comisión año 1',      c: 'text-emerald-400' },
            { v: '30%', l: 'Año 2 en adelante',   c: 'text-indigo-400' },
            { v: '90d', l: 'Cookie de atribución', c: 'text-purple-400' },
            { v: '$50', l: 'Pago mínimo USD',       c: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
              <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] text-emerald-400 uppercase tracking-[0.3em] font-bold mb-4">Simple de entender</p>
          <h2 className="text-3xl md:text-5xl font-black mb-16">
            3 pasos para <span className="text-emerald-400">ganar dinero</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: '01', icon: '🔗',
                t: 'Regístrate y obtén tu link',
                d: 'Llena el formulario abajo. Recibes un link único como clientes.bot/?ref=TUCODIGO. Compártelo en redes, email, WhatsApp o donde quieras.',
              },
              {
                n: '02', icon: '👥',
                t: 'Alguien lo usa y se suscribe',
                d: 'Cuando alguien hace clic en tu link, se guarda una cookie de 90 días. Si se suscribe en ese período — la comisión es tuya.',
              },
              {
                n: '03', icon: '💸',
                t: 'Cobras todos los meses',
                d: 'El día 5 de cada mes recibes el pago de las comisiones liberadas. Primeros 12 meses al 40%, luego 30% para siempre.',
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-7xl font-black text-white/[0.03] absolute -top-8 left-1/2 -translate-x-1/2 group-hover:text-emerald-500/10 transition-colors">
                  {step.n}
                </div>
                <div className="relative z-10 bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all h-full text-left">
                  <p className="text-3xl mb-4">{step.icon}</p>
                  <h3 className="text-lg font-bold mb-3">{step.t}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVA VS GHL */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-purple-400 uppercase tracking-[0.3em] font-bold mb-4">La diferencia real</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              6x más que <span className="text-purple-400">GoHighLevel</span><br />a partir del año 2.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              GHL paga 40% el primer año y luego baja al 5%. Nosotros mantenemos 30% para siempre.
              Con 10 clientes Growth, eso es una diferencia de <strong className="text-white">$10,692/año</strong>.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/5">
              <div className="px-6 py-4 text-xs text-gray-500 font-medium">Condición</div>
              <div className="px-6 py-4 text-xs text-white font-bold text-center">clientes.bot 🦁</div>
              <div className="px-6 py-4 text-xs text-gray-500 font-medium text-center">GoHighLevel</div>
            </div>
            {[
              { label: 'Comisión año 1',          cb: '40%',       ghl: '40%',   cbColor: 'text-emerald-400', tie: true },
              { label: 'Comisión año 2+',          cb: '30% 🔥',    ghl: '5%',    cbColor: 'text-emerald-400' },
              { label: 'Cookie de atribución',     cb: '90 días',   ghl: '30 días', cbColor: 'text-emerald-400' },
              { label: 'Pago mínimo',              cb: '$50 USD',   ghl: '$50 USD', cbColor: 'text-white', tie: true },
              { label: 'Pago mensual',             cb: 'Día 5 ✅',  ghl: 'Día 15', cbColor: 'text-emerald-400' },
              { label: '10 clientes Growth — año 1', cb: '$14,256', ghl: '$14,256', cbColor: 'text-white', tie: true },
              { label: '10 clientes Growth — año 2', cb: '$10,692', ghl: '$1,782',  cbColor: 'text-emerald-400' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
                <div className="px-6 py-4 text-xs text-gray-400">{row.label}</div>
                <div className={`px-6 py-4 text-xs font-bold text-center ${row.cbColor}`}>{row.cb}</div>
                <div className={`px-6 py-4 text-xs text-center ${row.tie ? 'text-gray-400' : 'text-red-400/70'}`}>{row.ghl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULADORA */}
      <section id="ganancias" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-yellow-400 uppercase tracking-[0.3em] font-bold mb-4">Calcula tu potencial</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">¿Cuánto puedes ganar?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '5 referidos Growth',
                clients: 5, plan: 'Growth', mrr: 297,
                year1: Math.round(5 * 297 * 12 * 0.4),
                year2: Math.round(5 * 297 * 12 * 0.3),
                monthly2: Math.round(5 * 297 * 0.3),
                color: 'border-white/10',
                badge: '',
              },
              {
                title: '10 referidos Growth',
                clients: 10, plan: 'Growth', mrr: 297,
                year1: Math.round(10 * 297 * 12 * 0.4),
                year2: Math.round(10 * 297 * 12 * 0.3),
                monthly2: Math.round(10 * 297 * 0.3),
                color: 'border-emerald-500/40 ring-1 ring-emerald-500/20',
                badge: '⭐ Más común',
              },
              {
                title: '20 referidos Agency',
                clients: 20, plan: 'Agency', mrr: 497,
                year1: Math.round(20 * 497 * 12 * 0.4),
                year2: Math.round(20 * 497 * 12 * 0.3),
                monthly2: Math.round(20 * 497 * 0.3),
                color: 'border-amber-500/30',
                badge: '🦁 Pro',
              },
            ].map((sc, i) => (
              <div key={i} className={`relative rounded-3xl border ${sc.color} bg-white/[0.03] p-6 flex flex-col gap-4`}>
                {sc.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      i === 1 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>{sc.badge}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold">{sc.title}</p>
                  <p className="text-[10px] text-gray-500">Plan {sc.plan} · ${sc.mrr}/mes c/u</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-[10px] text-gray-500">Ingresos año 1 (40%)</p>
                    <p className="text-2xl font-black text-indigo-400">${sc.year1.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-[10px] text-gray-500">Ingresos año 2+ (30% / año)</p>
                    <p className="text-2xl font-black text-emerald-400">${sc.year2.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-600">${sc.monthly2.toLocaleString()}/mes sin hacer nada más</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-6">
            * Cálculos asumiendo 0% de churn. Las comisiones se liberan 30 días post-pago.
          </p>
        </div>
      </section>

      {/* CONDICIONES */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-bold mb-4">Transparencia total</p>
            <h2 className="text-3xl md:text-4xl font-black">Condiciones del programa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: '📅',
                title: 'Pago mensual día 5',
                desc: 'Las comisiones liberadas se pagan el día 5 de cada mes vía Stripe Connect (USD) o transferencia Wompi (COP).',
              },
              {
                icon: '⏳',
                title: 'Hold de 30 días',
                desc: 'Cada comisión queda en espera 30 días después del pago del referido. Esto protege contra reembolsos y chargebacks.',
              },
              {
                icon: '🛡️',
                title: 'Anti-fraude (60 días)',
                desc: 'Si un referido cancela antes de 60 días de su primera suscripción, la comisión se anula automáticamente.',
              },
              {
                icon: '🍪',
                title: 'Cookie de 90 días',
                desc: 'Si alguien hace clic en tu link y se suscribe en los próximos 90 días, la comisión es tuya aunque vuelva directamente.',
              },
              {
                icon: '💳',
                title: 'Pago mínimo $50 USD',
                desc: 'Si no acumulas $50 USD en el período, el saldo se acumula para el siguiente mes sin perderse.',
              },
              {
                icon: '📋',
                title: 'Revisión de tasas con aviso',
                desc: 'Las tasas pueden revisarse con 90 días de aviso previo. Las comisiones ya generadas se pagan bajo los términos originales.',
              },
            ].map((c, i) => (
              <div key={i} className="flex gap-4 bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <p className="text-sm font-bold mb-1">{c.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              {
                q: '¿Necesito ser cliente de clientes.bot para ser afiliado?',
                a: 'No necesariamente, pero recomendamos que lo seas para que puedas recomendar desde experiencia propia. El programa está abierto para cualquier persona.',
              },
              {
                q: '¿Cuántas personas puedo referir?',
                a: 'Sin límite. Puedes referir 2 o 200 negocios. Cuantos más clientes activos tengas referidos, mayor es tu ingreso mensual recurrente.',
              },
              {
                q: '¿Qué pasa si el cliente cambia de plan?',
                a: 'Tu comisión se ajusta automáticamente al nuevo plan. Si sube de Starter a Growth, empiezas a ganar la comisión del plan más alto.',
              },
              {
                q: '¿Cómo sé cuánto he ganado?',
                a: 'Desde tu dashboard en /dashboard/affiliate puedes ver en tiempo real tus referidos, comisiones pendientes, liberadas y pagadas.',
              },
              {
                q: '¿En qué moneda me pagan?',
                a: 'En USD vía Stripe Connect (para cuentas fuera de Colombia) o en COP vía transferencia bancaria Wompi (para Colombia).',
              },
              {
                q: '¿Qué pasa si mi referido pide reembolso?',
                a: 'Si el reembolso ocurre dentro del hold de 30 días, la comisión no se libera. Si ya fue liberada pero el cliente lleva menos de 60 días, se anula y descuenta del próximo pago.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-all">
                  <p className="text-sm font-bold pr-4">{faq.q}</p>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO DE REGISTRO */}
      <section id="registro" className="py-20 px-6">
        <div className="max-w-xl mx-auto relative">
          <div className="absolute inset-0 bg-emerald-600/10 blur-[100px] -z-10" />
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-600/5 border border-white/10 p-8 md:p-12 rounded-3xl text-center">
            {submitted ? (
              <div className="space-y-4">
                <p className="text-5xl">🎉</p>
                <h2 className="text-2xl font-black">¡Ya eres afiliado!</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Revisa tu email — te enviamos tu link único y las instrucciones para empezar.
                  También puedes verlo desde tu dashboard.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl font-bold text-sm transition-all"
                >
                  Ir a mi dashboard →
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-black mb-2">Únete gratis ahora</h2>
                <p className="text-gray-400 text-sm mb-8">
                  Crea tu cuenta de afiliado en 30 segundos.<br />Sin costo. Sin mínimos.
                </p>
                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block">Nombre completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                      ⚠️ {error}
                    </p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registrando...
                      </>
                    ) : '🤝 Obtener mi link de afiliado'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-600 mt-4">
                  Al registrarte aceptas los{' '}
                  <Link href="/terminos" className="text-indigo-400 hover:text-indigo-300">
                    Términos del programa de afiliados
                  </Link>. Las tasas pueden revisarse con 90 días de aviso.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
            </Link>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
              <Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <a href="mailto:soporte@clientes.bot" className="hover:text-white transition-colors">soporte@clientes.bot</a>
            </div>
            <p className="text-[10px] text-gray-600">© 2026 SGC Technology S.A.S.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}