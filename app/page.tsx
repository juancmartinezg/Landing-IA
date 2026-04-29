'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ChatWidget from './components/ChatWidget';
import InstallPWAPrompt from './components/InstallPWAPrompt';

// Tooltip component para el botón "?"
function FeatureTooltip({ title, desc }: { title: string; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex ml-1 align-middle">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-white/10 hover:bg-indigo-500/40 text-[9px] font-black text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-indigo-500/50"
        aria-label="Más info"
      >?</button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-6 top-0 z-50 w-56 bg-[#1a1f2e] border border-white/10 rounded-xl p-3 shadow-2xl text-left">
            <p className="text-[10px] font-bold text-white mb-1">{title}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">{desc}</p>
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-white text-xs">✕</button>
          </div>
        </>
      )}
    </span>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);

  const plans = [
    {
      key: 'starter',
      name: 'Starter',
      subtitle: 'Para empezar a automatizar',
      price_monthly: 97,
      price_annual: 930,
      color: 'border-white/10 hover:border-indigo-500/30',
      btnClass: 'bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500',
      btnLabel: 'Comenzar gratis',
      popular: false,
      features: [
        { label: 'Bot IA conversacional 24/7', included: true, tooltip: { title: 'Bot con Inteligencia Artificial', desc: 'Tu bot responde preguntas, presenta productos, agenda citas y cierra ventas automáticamente — sin que intervenga nadie de tu equipo.' } },
        { label: '1 línea de WhatsApp Business', included: true, tooltip: { title: '1 número de WhatsApp', desc: 'Conectas un número de teléfono de WhatsApp Business API. El bot atiende todos los mensajes que lleguen a ese número.' } },
        { label: '2,000 conversaciones/mes', included: true, tooltip: { title: 'Conversaciones mensuales', desc: 'Cada vez que un cliente te escribe y el bot responde, cuenta como 1 conversación. 2,000 es suficiente para negocios que están empezando.' } },
        { label: 'Entiende audios de voz 🎤', included: true, tooltip: { title: 'Transcripción de voz', desc: 'Si el cliente te manda un audio de voz en lugar de texto, el bot lo transcribe y lo entiende automáticamente. No pierde ningún mensaje.' } },
        { label: 'Catálogo visual con carrusel', included: true, tooltip: { title: 'Carrusel de productos en WhatsApp', desc: 'El bot muestra tus productos o servicios en formato carrusel visual dentro del chat de WhatsApp. El cliente desliza y ve fotos, precios y descripción.' } },
        { label: 'CRM básico (500 leads)', included: true, tooltip: { title: 'CRM: gestión de clientes', desc: 'Lista de todos los clientes que te han escrito, con su nombre, teléfono, estado (nuevo, interesado, vendido) y notas. Límite de 500 contactos.' } },
        { label: '1 pasarela de pago en el chat', included: true, tooltip: { title: 'Cobros por WhatsApp', desc: 'El bot genera un link de pago y lo envía directamente en el chat. El cliente paga sin salir de WhatsApp. Elige 1 pasarela: Bold, Wompi, PayPal, etc.' } },
        { label: 'Agendamiento inteligente', included: true, tooltip: { title: 'Citas automáticas por WhatsApp', desc: 'El bot muestra las fechas disponibles en tu calendario, el cliente elige y la cita se crea sola. Sin llamadas, sin mensajes manuales.' } },
        { label: '2 agentes humanos', included: true, tooltip: { title: 'Agentes humanos', desc: 'Personas de tu equipo que pueden ver las conversaciones del bot, tomar control cuando el cliente lo necesite y responder directamente desde el dashboard.' } },
        { label: 'Dashboard + App móvil (PWA)', included: true, tooltip: { title: 'Panel de control + App', desc: 'Accede a todas las métricas, conversaciones y herramientas desde el navegador o instala la app en tu celular como si fuera nativa.' } },
        { label: 'Notificaciones push', included: true, tooltip: { title: 'Alertas en tiempo real', desc: 'Recibes una notificación en tu celular cuando un cliente quiere hablar con un humano, paga o agenda una cita.' } },
        { label: 'Entrenamiento personalizado del bot', included: true, tooltip: { title: 'Entrena tu bot', desc: 'Agrega preguntas frecuentes y sus respuestas para que el bot aprenda exactamente cómo hablar de tu negocio.' } },
        { label: 'Facebook Ads con IA', included: false, tooltip: { title: 'Facebook & Instagram Ads', desc: 'Solo disponible en Growth y Agency.' } },
        { label: 'Atribución CAPI (Lead → Venta)', included: false, tooltip: { title: 'Meta CAPI', desc: 'Solo disponible en Growth y Agency.' } },
        { label: 'Voz IA (llamadas automáticas)', included: false, tooltip: { title: 'Llamadas con IA', desc: 'Solo disponible en Growth y Agency.' } },
        { label: 'Remarketing automático', included: false, tooltip: { title: 'Seguimiento a leads fríos', desc: 'Solo disponible en Growth y Agency.' } },
        { label: 'Multicanal (Instagram, Facebook)', included: false, tooltip: { title: 'Más canales', desc: 'Solo disponible en Growth y Agency.' } },
      ],
    },
    {
      key: 'growth',
      name: 'Growth',
      subtitle: 'Ventas en piloto automático',
      price_monthly: 297,
      price_annual: 2851,
      color: 'border-indigo-500/50 bg-indigo-600',
      btnClass: 'bg-white text-indigo-600 hover:bg-gray-100 font-black shadow-lg',
      btnLabel: 'Activar Growth',
      popular: true,
      features: [
        { label: 'Todo lo de Starter, más:', included: true, tooltip: null },
        { label: '10,000 conversaciones/mes', included: true, tooltip: { title: 'Conversaciones mensuales', desc: '10,000 conversaciones es suficiente para negocios en pleno crecimiento con campañas activas de publicidad.' } },
        { label: 'CRM completo + Kanban + IA (leads ilimitados)', included: true, tooltip: { title: 'CRM completo', desc: 'Tablero Kanban drag & drop (Nuevo → Interesado → Negociación → Ganado), puntuación IA de cada lead, tags, etapas, notas privadas entre agentes, importación CSV masiva. Sin límite de contactos.' } },
        { label: '6 pasarelas de pago', included: true, tooltip: { title: 'Múltiples pasarelas', desc: 'Conecta hasta 6 pasarelas de pago: Stripe, Bold, Wompi, PayPal, MercadoPago, OpenPay, PayU. El cliente elige cómo pagar.' } },
        { label: 'Facebook & Instagram Ads con IA', included: true, tooltip: { title: 'Publicidad con IA', desc: 'La IA crea anuncios Click-to-WhatsApp en 5 pasos. Targeting avanzado por ciudad, edad, intereses. Monitoreo diario y alertas si un anuncio falla.' } },
        { label: 'Atribución CAPI completa (Lead → Checkout → Venta)', included: true, tooltip: { title: 'Conversions API de Meta', desc: 'Envía eventos de conversión directamente al servidor de Meta. El algoritmo de Facebook aprende qué anuncios generan ventas reales — no solo clics. Diferenciador masivo vs competidores.' } },
        { label: 'Memoria IA proactiva', included: true, tooltip: { title: 'Memoria inteligente', desc: 'El bot recuerda conversaciones anteriores con cada cliente. Si alguien preguntó por un producto hace 2 semanas y vuelve a escribir, el bot lo recuerda y retoma desde donde quedó.' } },
        { label: 'Voz IA — 100 min/mes', included: true, tooltip: { title: 'Llamadas con IA', desc: 'Tu bot puede hacer o recibir llamadas de voz automatizadas. Ideal para calificar leads o confirmar citas por teléfono. 100 minutos incluidos al mes.' } },
        { label: '5 agentes humanos', included: true, tooltip: { title: 'Equipo de 5 personas', desc: '5 miembros de tu equipo con acceso al dashboard, asignación de leads y chat en vivo. Con ranking de rendimiento por agente.' } },
        { label: 'Remarketing automático', included: true, tooltip: { title: 'Seguimiento automático', desc: 'El bot hace seguimiento automático a leads que no respondieron o no completaron una compra. Envía mensajes personalizados en el momento correcto.' } },
        { label: 'WhatsApp Flows (formularios nativos)', included: true, tooltip: { title: 'WhatsApp Flows', desc: 'Formularios interactivos nativos dentro de WhatsApp. El cliente completa datos, selecciona fechas o elige opciones sin salir del chat.' } },
        { label: 'Control de inventario', included: true, tooltip: { title: 'Inventario integrado', desc: 'Cuando el bot vende un producto, descuenta automáticamente el stock del inventario. Evita vender lo que no tienes.' } },
        { label: 'Multicanal — Instagram DM', included: true, tooltip: { title: 'Instagram Direct Messages', desc: 'El mismo bot de WhatsApp también atiende los mensajes directos de Instagram de tu negocio, desde el mismo dashboard.' } },
        { label: '5 sub-cuentas (sucursales o marcas)', included: true, tooltip: { title: 'Múltiples sucursales', desc: 'Conecta hasta 5 negocios, sucursales o marcas diferentes desde el mismo dashboard.' } },
        { label: 'Soporte por email — 24h', included: true, tooltip: null },
      ],
    },
    {
      key: 'agency',
      name: 'Agency',
      subtitle: 'Para agencias y equipos grandes',
      price_monthly: 497,
      price_annual: 4771,
      color: 'border-amber-500/30 hover:border-amber-500/50',
      btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20',
      btnLabel: 'Contactar ventas',
      popular: false,
      features: [
        { label: 'Todo lo de Growth, más:', included: true, tooltip: null },
        { label: 'Conversaciones ilimitadas', included: true, tooltip: { title: 'Sin límite de mensajes', desc: 'Sin tope de conversaciones al mes. Ideal para agencias con múltiples clientes activos o negocios con alto volumen de mensajes.' } },
        { label: 'Clientes ilimitados desde 1 dashboard', included: true, tooltip: { title: 'Multi-cliente para agencias', desc: 'Gestiona negocios ilimitados desde un solo panel. Cada cliente tiene su propio bot, CRM, campañas y dashboard independiente. Tú lo ves todo.' } },
        { label: 'White-label total (tu marca, no la nuestra)', included: true, tooltip: { title: 'Marca blanca', desc: 'El dashboard y el bot aparecen con el nombre y logo de tu agencia o empresa. El cliente final nunca sabe que usa clientes.bot.' } },
        { label: 'Voz IA — 500 min/mes', included: true, tooltip: { title: 'Llamadas con IA', desc: '500 minutos de llamadas automatizadas con IA al mes. Suficiente para calificar decenas de leads diariamente.' } },
        { label: 'Agentes ilimitados', included: true, tooltip: { title: 'Equipo sin límite', desc: 'Agrega todos los miembros de equipo que necesites. Sin costo adicional por agente.' } },
        { label: 'API pública documentada', included: true, tooltip: { title: 'API para desarrolladores', desc: 'Integra clientes.bot con tus propios sistemas, CRMs externos o herramientas internas usando nuestra API REST documentada.' } },
        { label: 'Multicanal completo (IG + Facebook Messenger)', included: true, tooltip: { title: 'Todos los canales de Meta', desc: 'El bot atiende simultáneamente WhatsApp, Instagram DM y Facebook Messenger desde una sola bandeja unificada.' } },
        { label: 'Soporte prioritario por WhatsApp', included: true, tooltip: { title: 'Soporte directo', desc: 'Acceso a un canal de WhatsApp dedicado con el equipo de clientes.bot. Respuesta en menos de 1 hora en días hábiles.' } },
        { label: 'Onboarding personalizado', included: true, tooltip: { title: 'Configuración asistida', desc: 'Un especialista de nuestro equipo te ayuda a configurar el bot, CRM y campañas en la primera semana. Incluido sin costo adicional.' } },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 scroll-smooth">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
          <div className="flex flex-col md:flex-row items-center gap-0 md:gap-2 shrink-0">
            <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
            <span className="text-[9px] md:text-xl font-bold tracking-tighter">clientes.bot</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#para-quien" className="hover:text-white transition-colors">Para quién</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Link href="/auth/login" className="border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 px-2.5 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap">
              Iniciar sesión
            </Link>
            <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 px-2.5 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap">
              Prueba gratis
            </Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400 text-xl ml-1" aria-label="Menu">☰</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#0B0F1A] border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Funciones</a>
            <a href="#como-funciona" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Cómo funciona</a>
            <a href="#para-quien" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Para quién</a>
            <a href="#planes" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Planes</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[200px] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-indigo-300 font-bold">Más de 50 negocios ya automatizan sus ventas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Tu negocio en
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400"> piloto automático</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Bot de WhatsApp con IA + CRM + Pagos + Publicidad en Facebook.<br className="hidden sm:block" />
              Todo en una sola plataforma. Sin código. Sin complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-indigo-600/25 inline-flex items-center justify-center gap-2">
                🚀 Comenzar gratis — 7 días
              </Link>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget'))} className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold text-base transition-all inline-flex items-center justify-center gap-2">
                💬 Ver demo en vivo
              </button>
            </div>
            <p className="text-[11px] text-gray-600">Sin tarjeta de crédito • Configuración en 2 minutos • Cancela cuando quieras</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
            {[
              { v: '24/7', l: 'Bot IA activo', c: 'text-indigo-400' },
              { v: '6+', l: 'Pasarelas de pago', c: 'text-emerald-400' },
              { v: '+40%', l: 'Más conversiones', c: 'text-purple-400' },
              { v: '20h', l: 'Ahorradas por semana', c: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#080B14] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/5 rounded-lg px-4 py-1 text-[10px] text-gray-500">clientes.bot/dashboard</div>
                </div>
              </div>
              <div className="flex">
                <div className="hidden md:flex w-44 bg-[#080B14] border-r border-white/5 flex-col p-3 gap-1">
                  {[
                    { icon: '📊', label: 'Métricas', active: true },
                    { icon: '👥', label: 'CRM / Leads' },
                    { icon: '🧑‍💼', label: 'Mi equipo' },
                    { icon: '💬', label: 'Conversaciones' },
                    { icon: '🛍️', label: 'Catálogo' },
                    { icon: '📅', label: 'Citas' },
                    { icon: '💳', label: 'Pagos' },
                    { icon: '📢', label: 'Facebook Ads' },
                    { icon: '🧠', label: 'Memoria IA' },
                    { icon: '⚙️', label: 'Configuración' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] ${item.active ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-500'}`}>
                      <span className="text-xs">{item.icon}</span><span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-bold">Bienvenido, Inmobiliaria Aurora 👋</p>
                      <p className="text-[9px] text-gray-500">Últimos 30 días</p>
                    </div>
                    <div className="flex gap-1">
                      {['Hoy', '7d', '30d'].map((p, i) => (
                        <span key={i} className={`text-[8px] px-2 py-0.5 rounded ${i === 2 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    {[
                      { label: 'Leads', value: '284', color: 'text-indigo-400' },
                      { label: 'Ventas', value: '$2.1M', color: 'text-emerald-400' },
                      { label: 'Conversión', value: '24%', color: 'text-purple-400' },
                      { label: 'Te escribieron', value: '1,847', color: 'text-sky-400' },
                      { label: 'CPL Ads', value: '$58', color: 'text-yellow-400' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-center">
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest">{m.label}</p>
                        <p className={`text-sm md:text-base font-black ${m.color}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Leads recientes</p>
                      <div className="space-y-1.5">
                        {[
                          { name: 'Carlos M.', status: '🔥 Interesado', time: '2m', agent: 'María' },
                          { name: 'Ana López', status: '💳 Pagó', time: '15m', agent: 'Juan' },
                          { name: 'Pedro R.', status: '🆕 Nuevo', time: '1h', agent: 'Bot IA' },
                          { name: 'Laura T.', status: '📅 Agendó', time: '3h', agent: 'María' },
                        ].map((l, i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <div className="w-5 h-5 bg-indigo-600/20 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-400">{l.name.charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold truncate">{l.name}</p>
                              <p className="text-[8px] text-gray-500">{l.status} • 🧑‍💼 {l.agent}</p>
                            </div>
                            <span className="text-[8px] text-gray-600">{l.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Chat en vivo</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />3 activos
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-[#005c4b]/30 rounded-lg p-2"><p className="text-[9px]">👤 ¿Info del apto de 2 habitaciones?</p></div>
                        <div className="bg-[#1a1f2e] rounded-lg p-2"><p className="text-[8px] text-emerald-400 mb-0.5">🤖 Bot</p><p className="text-[9px]">¡Hola! El de 2 habitaciones (62 m²) desde $145.000 USD. ¿Te envío el link de pago?</p></div>
                        <div className="bg-[#005c4b]/30 rounded-lg p-2"><p className="text-[9px]">👤 ¡Sí, por favor!</p></div>
                        <div className="bg-[#1a1f2e] rounded-lg p-2"><p className="text-[8px] text-emerald-400 mb-0.5">🤖 Bot</p><p className="text-[9px]">Aquí tienes tu link de pago seguro: 💳 $14.500 USD reserva 🔒</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-bold">📢 Campaña activa: Aurora Park — Fase 2</p>
                      </div>
                      <div className="flex gap-3 text-[9px] text-gray-400">
                        <span>$2.800 invertido</span>
                        <span className="text-emerald-400">48 leads</span>
                        <span className="text-purple-400">CPL $58</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl hidden md:block z-20 animate-bounce-slow">
              <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Leads hoy</p>
              <p className="text-lg font-black text-emerald-400">+12</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl hidden md:block z-20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold">Bot respondiendo 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PRINCIPALES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-bold mb-4">Todo incluido</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">6 herramientas poderosas.<br /><span className="text-indigo-400">1 sola plataforma.</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Deja de pagar por 6 apps diferentes. clientes.bot integra todo lo que necesitas para vender más y atender mejor.</p>
          </div>
          {/* Feature 1: Bot WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">🤖</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Bot de WhatsApp con IA</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Tu mejor vendedor.<br />Nunca duerme. Nunca falla.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Responde preguntas, muestra el catálogo, agenda citas, cobra pagos y cierra ventas — todo automáticamente por WhatsApp. Con memoria inteligente que recuerda cada cliente.</p>
              <ul className="space-y-3">
                {['IA conversacional (no suena a robot)', 'Memoria proactiva: recuerda clientes anteriores', 'Catálogo visual con carrusel de productos', 'Neuroventas: detecta intención de compra', 'Handoff inteligente a agente humano cuando se necesita', 'Funciona 24/7 en cualquier idioma'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-emerald-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/10 rounded-3xl p-8 relative">
              <div className="space-y-3">
                <div className="flex justify-end"><div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]"><p className="text-sm">Hola, vi su anuncio de los apartamentos nuevos 🏢</p></div></div>
                <div className="flex justify-start"><div className="bg-[#1a1f2e] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]"><p className="text-[10px] text-emerald-400 font-bold mb-1">🤖 Bot IA</p><p className="text-sm">¡Hola! 😊 Tenemos disponibles unidades de 2 y 3 habitaciones. ¿Cuál te interesa más?</p></div></div>
                <div className="flex justify-end"><div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]"><p className="text-sm">El de 3 habitaciones, ¿precio y entrega?</p></div></div>
                <div className="flex justify-start"><div className="bg-[#1a1f2e] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]"><p className="text-[10px] text-emerald-400 font-bold mb-1">🤖 Bot IA</p><p className="text-sm">Desde $185.000 USD. Entrega marzo 2027. 🏗️ ¿Te agendo una visita virtual?</p></div></div>
              </div>
            </div>
          </div>
          {/* Feature 2: CRM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 bg-gradient-to-br from-indigo-500/5 to-indigo-500/0 border border-indigo-500/10 rounded-3xl p-6">
              <div className="space-y-2">
                {[
                  { name: 'Carlos Pérez', status: '🔥 Interesado', score: 85, agent: 'María G.' },
                  { name: 'Ana López', status: '🤝 Negociación', score: 72, agent: 'Juan M.' },
                  { name: 'Pedro Ruiz', status: '✅ Ganado', score: 95, agent: 'María G.' },
                  { name: 'Laura Torres', status: '🆕 Nuevo', score: 30, agent: 'Sin asignar' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">{l.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{l.name}</p>
                      <p className="text-[9px] text-gray-500">{l.status} • 🧑‍💼 {l.agent}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${l.score >= 70 ? 'bg-emerald-500' : l.score >= 40 ? 'bg-yellow-500' : 'bg-gray-500'}`} style={{width: `${l.score}%`}} />
                      </div>
                      <p className="text-[8px] text-gray-500 mt-0.5">{l.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">👥</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">CRM + Multi-agente</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Cada lead en su lugar.<br />Cada agente con su trabajo.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">CRM visual tipo Kanban con arrastrar y soltar. Asigna leads a tu equipo automáticamente. Notas privadas, historial completo y análisis IA de cada contacto.</p>
              <ul className="space-y-3">
                {['Kanban drag & drop (Nuevo → Interesado → Negociación → Ganado)', 'Multi-agente: asignación automática round-robin', 'Notas privadas entre agentes (el cliente no las ve)', 'Lead scoring con IA (probabilidad de cierre)', 'Ranking de performance por agente', 'Permisos por rol: owner, admin, agente, viewer'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-indigo-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Feature 3: Ads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">📢</span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Facebook & Instagram Ads</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Publicidad que vende.<br />Sin tocar Ads Manager.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">La IA crea anuncios Click-to-WhatsApp optimizados. Elige servicio, público y presupuesto — nosotros hacemos el resto. Monitoreo 24/7 y optimización automática.</p>
              <ul className="space-y-3">
                {['Wizard de 5 pasos (cualquiera puede crear campañas)', 'IA genera 4+ variantes de copy automáticamente', 'Click-to-WhatsApp: el cliente te escribe directo al bot', 'Targeting pro: ciudades con radio, intereses, edad, género', 'Monitoreo diario: pausa automática si no hay resultados', 'Notificación push si Meta rechaza un anuncio'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-purple-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/10 rounded-3xl p-6">
              <div className="space-y-3">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <div key={s} className="flex-1 h-1.5 rounded-full bg-purple-500" />)}</div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Vista previa del anuncio</p>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-bold mb-2">🏢 ¿Buscas el hogar de tus sueños?</p>
                  <p className="text-[10px] text-gray-400 mb-3">Descubre Aurora Park — apartamentos con vista panorámica. Unidades limitadas. ¡Escríbenos!</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[8px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Radio 25 km</span>
                    <span className="text-[8px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">28-55 años</span>
                    <span className="text-[8px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">CTW WhatsApp</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Alcance</p><p className="text-xs font-bold text-purple-400">12,400</p></div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Te escribieron</p><p className="text-xs font-bold text-emerald-400">48</p></div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Costo/lead</p><p className="text-xs font-bold text-yellow-400">$58</p></div>
                </div>
              </div>
            </div>
          </div>
          {/* Feature 4: Pagos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 bg-gradient-to-br from-yellow-500/5 to-yellow-500/0 border border-yellow-500/10 rounded-3xl p-8 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Pasarelas disponibles</p>
              <div className="grid grid-cols-3 gap-4">
                {['Stripe', 'PayPal', 'Bold', 'Wompi', 'MercadoPago', 'OpenPay'].map((g, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center hover:border-yellow-500/30 transition-all">
                    <p className="text-xs font-bold">{g}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-[10px] text-emerald-400 font-bold">💳 Link de pago enviado por WhatsApp</p>
                <p className="text-xs text-gray-400 mt-1">El cliente paga sin salir del chat</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">💳</span>
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Pagos integrados</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Cobra en el chat.<br />Sin fricciones.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Genera links de pago desde el dashboard o deja que el bot los envíe automáticamente.</p>
              <ul className="space-y-3">
                {['Stripe, Bold, Wompi, PayPal, MercadoPago, OpenPay, PayU y más', 'Link de pago directo en la conversación de WhatsApp', 'El bot confirma el pago al cliente automáticamente', 'Dashboard de pagos con estado en tiempo real', 'Multi-moneda: USD, EUR, GBP, CAD y +30 más', 'Genera links desde el CRM con 1 clic', '¿Tu pasarela no está? Te la integramos sin costo'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-yellow-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Feature 5: Agendamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">📅</span>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Agendamiento inteligente</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Citas que se agendan solas.<br />Directo en el Calendario.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">El bot muestra fechas disponibles, el cliente elige y la cita se crea automáticamente. Sin llamadas, sin WhatsApp manual.</p>
              <ul className="space-y-3">
                {['Calendario integrado inteligente', 'El cliente elige fecha y hora directo en el chat', 'Detección de festivos y días cerrados', 'Recordatorios automáticos antes de la cita', 'Gestión de citas desde el dashboard', 'Citas manuales desde el panel del agente'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-sky-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-sky-500/5 to-sky-500/0 border border-sky-500/10 rounded-3xl p-6">
              <div className="space-y-2">
                {['Lun 28 Abr — 10:00 AM', 'Mar 29 Abr — 2:00 PM', 'Mié 30 Abr — 10:00 AM', 'Jue 1 May — 4:00 PM'].map((d, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 1 ? 'bg-sky-500/10 border border-sky-500/30' : 'bg-white/[0.02] border border-white/5'}`}>
                    <div className="flex items-center gap-3"><span className="text-lg">📅</span><p className="text-xs font-bold">{d}</p></div>
                    {i === 1 ? <span className="text-[9px] px-2 py-1 rounded-full bg-sky-500 text-white font-bold">Seleccionado</span> : <span className="text-[9px] px-2 py-1 rounded-full bg-white/5 text-gray-400">Disponible</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Feature 6: Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-br from-rose-500/5 to-rose-500/0 border border-rose-500/10 rounded-3xl p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📊', label: 'Métricas', desc: 'Revenue, leads, conversión' },
                  { icon: '💬', label: 'Chat en vivo', desc: 'Responde desde el dashboard' },
                  { icon: '🔔', label: 'Push notifications', desc: 'Alertas en tu celular' },
                  { icon: '🧠', label: 'Memoria IA', desc: 'El bot aprende solo' },
                  { icon: '🎓', label: 'Entrenar bot', desc: 'Preguntas y respuestas' },
                  { icon: '📱', label: 'PWA instalable', desc: 'Como app nativa' },
                ].map((d, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:border-rose-500/20 transition-all">
                    <p className="text-lg mb-1">{d.icon}</p>
                    <p className="text-[10px] font-bold">{d.label}</p>
                    <p className="text-[8px] text-gray-500">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">📱</span>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Dashboard + App móvil</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Tu negocio completo<br />en tu bolsillo.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Dashboard web + app instalable. Métricas en tiempo real, chat en vivo, notificaciones push cuando un lead pide hablar con un humano.</p>
              <ul className="space-y-3">
                {['19+ módulos: CRM, chat, citas, pagos, ads, inventario...', 'Push notifications cuando hay handoff a humano', 'Email automático al agente cuando se le asigna un lead', 'Sonido + vibración cuando llega mensaje nuevo', 'Instala como app desde Chrome', 'Funciona en PC, tablet y celular'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-rose-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] text-emerald-400 uppercase tracking-[0.3em] font-bold mb-4">Simple y rápido</p>
          <h2 className="text-3xl md:text-5xl font-black mb-16">Activo en <span className="text-emerald-400">3 pasos</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', icon: '📱', t: 'Conecta tu WhatsApp', d: 'Haz clic en "Conectar con Facebook", selecciona tu número y listo. Sin QR, sin configuraciones técnicas. 30 segundos.' },
              { n: '02', icon: '🎨', t: 'Personaliza tu bot', d: 'Sube tu catálogo, ajusta el tono de la IA, configura horarios y pasarela de pago. El wizard te guía paso a paso.' },
              { n: '03', icon: '🚀', t: 'Empieza a vender', d: 'Tu bot responde 24/7, agenda citas, cobra pagos y tú ves todo desde el dashboard. Crea campañas de Ads con IA.' },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-7xl font-black text-white/[0.03] absolute -top-8 left-1/2 -translate-x-1/2 group-hover:text-indigo-500/10 transition-colors">{step.n}</div>
                <div className="relative z-10 bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all h-full">
                  <p className="text-3xl mb-4">{step.icon}</p>
                  <h3 className="text-lg font-bold mb-3">{step.t}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section id="para-quien" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-purple-400 uppercase tracking-[0.3em] font-bold mb-4">Para todo tipo de negocio</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">¿Es para mí?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Si vendes productos o servicios y atiendes clientes por WhatsApp, clientes.bot es para ti.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏥', name: 'Clínicas y consultorios', desc: 'Agendar citas + recordatorios' },
              { icon: '🍽️', name: 'Restaurantes', desc: 'Pedidos + reservas + delivery' },
              { icon: '🎯', name: 'Escuelas y academias', desc: 'Inscripciones + pagos + info' },
              { icon: '🛍️', name: 'Tiendas online', desc: 'Catálogo + pagos + envíos' },
              { icon: '💇', name: 'Salones de belleza', desc: 'Citas + productos + fidelización' },
              { icon: '🏋️', name: 'Gimnasios', desc: 'Membresías + clases + pagos' },
              { icon: '🏢', name: 'Agencias', desc: 'Multi-cliente + white label' },
              { icon: '🔧', name: 'Servicios profesionales', desc: 'Cotizaciones + seguimiento' },
            ].map((b, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all group text-center">
                <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</p>
                <p className="text-xs font-bold mb-1">{b.name}</p>
                <p className="text-[9px] text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-bold mb-4">Precios transparentes</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Elige tu plan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">7 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.</p>
            {/* Toggle mensual/anual */}
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-xl p-1 mb-4">
              <button onClick={() => setBillingAnnual(false)} className={`text-sm px-5 py-2 rounded-lg font-medium transition-all ${!billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'}`}>Mensual</button>
              <button onClick={() => setBillingAnnual(true)} className={`text-sm px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                Anual <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.key} className={`rounded-3xl border p-8 flex flex-col text-left transition-all relative ${plan.popular ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30 scale-[1.03] z-10' : 'bg-white/[0.03]'} ${plan.color}`}>
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">⭐ Más popular</div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className={`text-[10px] uppercase tracking-widest mb-6 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.subtitle}</p>
                <div className="mb-1">
                  <span className="text-4xl font-black">${billingAnnual ? Math.round(plan.price_annual / 12) : plan.price_monthly}</span>
                  <span className={`text-sm font-medium ml-1 ${plan.popular ? 'opacity-70' : 'text-gray-600'}`}>/mes</span>
                </div>
                {billingAnnual && (
                  <p className="text-[10px] text-emerald-400 mb-1">Facturado anualmente — ${plan.price_annual}/año</p>
                )}
                <p className={`text-[10px] mb-6 ${plan.popular ? 'text-indigo-200' : 'text-gray-600'}`}>USD • {billingAnnual ? 'facturación anual' : 'facturación mensual'}</p>

                <ul className="space-y-2.5 mb-8 flex-1 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 ${!f.included ? (plan.popular ? 'opacity-40' : 'text-gray-600') : plan.popular ? 'text-white' : 'text-gray-300'}`}>
                      <span className={`mt-0.5 shrink-0 ${f.included ? (plan.popular ? 'text-white' : 'text-emerald-400') : 'text-gray-600'}`}>
                        {f.included ? '✓' : '—'}
                      </span>
                      <span className="flex-1">{f.label}</span>
                      {f.tooltip && (
                        <FeatureTooltip title={f.tooltip.title} desc={f.tooltip.desc} />
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.key === 'agency' ? 'https://wa.me/573022205845?text=Hola%2C%20quiero%20info%20del%20plan%20Agency%20de%20clientes.bot' : '/auth/login'}
                  className={`w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all ${plan.btnClass}`}
                >
                  {plan.btnLabel}
                </Link>
              </div>
            ))}
          </div>

          {/* En camino */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <p className="text-[11px] text-amber-400 uppercase tracking-[0.3em] font-bold mb-3">🚀 En camino — disponible pronto</p>
              <p className="text-gray-500 text-xs mb-6">Incluido sin costo adicional cuando esté disponible para todos los planes activos.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🎭', label: 'Avatar IA con video', desc: 'Tu bot envía videos personalizados a cada lead' },
                  { icon: '📞', label: 'Llamadas IA salientes', desc: 'El bot llama a tus leads y califica automáticamente' },
                  { icon: '🔴', label: 'Live Shopping', desc: 'Vende en vivo en Instagram y Facebook con IA' },
                  { icon: '🌐', label: 'Web Chat embebible', desc: 'El mismo bot en tu sitio web con 1 línea de código' },
                ].map((f, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center hover:border-amber-500/20 transition-all">
                    <p className="text-2xl mb-2">{f.icon}</p>
                    <p className="text-[10px] font-bold mb-1">{f.label}</p>
                    <p className="text-[9px] text-gray-600">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Necesito un número de WhatsApp nuevo?', a: 'Puedes usar tu número actual o crear uno nuevo. Al conectar, tu número se convierte en WhatsApp Business API y el bot empieza a responder automáticamente.' },
              { q: '¿Pierdo acceso a mi WhatsApp personal?', a: 'Si usas tu número personal, se convertirá en Business API y ya no podrás usar la app normal de WhatsApp con ese número. Recomendamos usar una línea dedicada.' },
              { q: '¿Qué pasa si el bot no sabe responder?', a: 'El bot transfiere automáticamente la conversación a un agente humano de tu equipo, quien recibe notificación por email y push en su celular.' },
              { q: '¿Funciona en mi país?', a: 'Sí. Funcionamos a nivel global. Integramos pasarelas internacionales (Stripe, PayPal) y locales según tu mercado (Bold, Wompi, MercadoPago, OpenPay, PayU y más).' },
              { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin penalidad. Los 7 días de prueba son completamente gratis y no pedimos tarjeta de crédito para empezar.' },
              { q: '¿Necesito conocimientos técnicos?', a: 'No. Todo se configura con clicks. El wizard te guía paso a paso. Si necesitas ayuda, nuestro equipo te asiste por WhatsApp.' },
              { q: '¿Puedo gestionar varios negocios?', a: 'Sí, con el plan Agency puedes gestionar negocios ilimitados desde un solo dashboard con tu propia marca.' },
              { q: '¿Qué pasa si mi pasarela de pagos no está en la lista?', a: 'Sin problema. Escríbenos a soporte@clientes.bot y la integramos sin costo adicional. Solo necesitamos las credenciales de su API.' },
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

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] -z-10" />
          <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-600/10 border border-white/10 p-10 md:p-14 rounded-3xl text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-black mb-4">¿Listo para vender más?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Únete a los negocios que ya automatizan sus ventas con IA. Configura en 2 minutos, sin código, sin complicaciones.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/25 inline-flex items-center justify-center gap-2">
                🚀 Comenzar gratis — 7 días
              </Link>
              <a href="https://wa.me/573022205845?text=Hola%2C%20quiero%20info%20de%20clientes.bot" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1da851] px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center justify-center gap-2">
                💬 Hablar por WhatsApp
              </a>
            </div>
            <p className="text-[10px] text-gray-600">Sin tarjeta • 7 días gratis • Soporte incluido</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">La plataforma todo-en-uno para negocios que quieren vender más por WhatsApp con inteligencia artificial.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Producto</p>
              <div className="space-y-2">
                <a href="#features" className="block text-xs text-gray-500 hover:text-white transition-colors">Bot WhatsApp IA</a>
                <a href="#features" className="block text-xs text-gray-500 hover:text-white transition-colors">CRM + Multi-agente</a>
                <a href="#features" className="block text-xs text-gray-500 hover:text-white transition-colors">Facebook Ads IA</a>
                <a href="#features" className="block text-xs text-gray-500 hover:text-white transition-colors">Pagos integrados</a>
                <a href="#features" className="block text-xs text-gray-500 hover:text-white transition-colors">Agendamiento</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Empresa</p>
              <div className="space-y-2">
                <a href="#planes" className="block text-xs text-gray-500 hover:text-white transition-colors">Precios</a>
                <a href="#para-quien" className="block text-xs text-gray-500 hover:text-white transition-colors">Casos de uso</a>
                <a href="#como-funciona" className="block text-xs text-gray-500 hover:text-white transition-colors">Cómo funciona</a>
                <a href="https://wa.me/573022205845" className="block text-xs text-gray-500 hover:text-white transition-colors">Contacto</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Legal</p>
              <div className="space-y-2">
                <Link href="/terminos" className="block text-xs text-gray-500 hover:text-white transition-colors">Términos de servicio</Link>
                <Link href="/politica-de-privacidad" className="block text-xs text-gray-500 hover:text-white transition-colors">Política de privacidad</Link>
                <Link href="/politica-de-privacidad#cookies" className="block text-xs text-gray-500 hover:text-white transition-colors">Política de cookies</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-600">© 2026 SGC Technology S.A.S. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="https://wa.me/573022205845" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400 transition-colors text-lg">💬</a>
              <a href="https://instagram.com/clientes.bot" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors text-lg">📸</a>
              <a href="https://facebook.com/clientesbot" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors text-lg">👤</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
      <InstallPWAPrompt variant="landing" />
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
