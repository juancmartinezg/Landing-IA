'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ChatWidget from './components/ChatWidget';
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 scroll-smooth">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#para-quien" className="hover:text-white transition-colors">Para quién</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:inline-flex border border-white/10 hover:border-indigo-500/50 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Iniciar sesión
            </Link>
            <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
              Prueba gratis 7 días
            </Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400 text-2xl ml-2">☰</button>
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
              Bot de WhatsApp con IA + CRM + Pagos + Publicidad en Facebook.
              <br className="hidden sm:block" />
              Todo en una sola plataforma. Sin código. Sin complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-indigo-600/25 inline-flex items-center justify-center gap-2">
                🚀 Comenzar gratis — 7 días
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget'))}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold text-base transition-all inline-flex items-center justify-center gap-2"
              >
                💬 Ver demo en vivo
              </button>
            </div>
            <p className="text-[11px] text-gray-600">Sin tarjeta de crédito • Configuración en 2 minutos • Cancela cuando quieras</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
            {[
              { v: '24/7', l: 'Bot IA activo', c: 'text-indigo-400' },
              { v: '6', l: 'Pasarelas de pago', c: 'text-emerald-400' },
              { v: '+40%', l: 'Más conversiones', c: 'text-purple-400' },
              { v: '20h', l: 'Ahorradas por semana', c: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          {/* Dashboard Preview - Mockup con código */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Barra superior del "navegador" */}
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
              {/* Contenido del dashboard */}
              <div className="flex">
                {/* Sidebar mini */}
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
                      <span className="text-xs">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div className="flex-1 p-4 md:p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-bold">Bienvenido, Constructora Riverside 👋</p>
                      <p className="text-[9px] text-gray-500">Últimos 30 días</p>
                    </div>
                    <div className="flex gap-1">
                      {['Hoy', '7d', '30d'].map((p, i) => (
                        <span key={i} className={`text-[8px] px-2 py-0.5 rounded ${i === 2 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>{p}</span>
                      ))}
                    </div>
                  </div>
                  {/* Métricas */}
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
                  {/* Dos columnas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Leads recientes */}
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
                    {/* Chat en vivo */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Chat en vivo</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />3 activos
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-[#005c4b]/30 rounded-lg p-2"><p className="text-[9px]">👤 ¿Info del apto de 2 habitaciones?</p></div>
                        <div className="bg-[#1a1f2e] rounded-lg p-2"><p className="text-[8px] text-emerald-400 mb-0.5">🤖 Bot</p><p className="text-[9px]">¡Hola! El de 2 habitaciones (62 m²) desde $145.000 USD con 10% de reserva. ¿Te envío el link de pago?</p></div>
                        <div className="bg-[#005c4b]/30 rounded-lg p-2"><p className="text-[9px]">👤 ¡Sí, por favor!</p></div>
                        <div className="bg-[#1a1f2e] rounded-lg p-2"><p className="text-[8px] text-emerald-400 mb-0.5">🤖 Bot</p><p className="text-[9px]">Aquí tienes tu link de pago seguro: 💳 $14.500 USD reserva 🔒</p></div>
                      </div>
                    </div>
                  </div>
                  {/* Campaña activa */}
                  <div className="mt-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-bold">📢 Campaña activa: Riverside Park — Fase 2</p>
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
            {/* Floating widgets */}
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
                {[
                  'IA conversacional (no suena a robot)',
                  'Memoria proactiva: recuerda clientes anteriores',
                  'Catálogo visual con carrusel de productos',
                  'Neuroventas: detecta intención de compra',
                  'Handoff inteligente a agente humano cuando se necesita',
                  'Funciona 24/7 en cualquier idioma',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/10 rounded-3xl p-8 relative">
              <div className="space-y-3">
                <div className="flex justify-end"><div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]"><p className="text-sm">Hola, vi un anuncio de los apartamentos nuevos 🏢</p></div></div>
                <div className="flex justify-start"><div className="bg-[#1a1f2e] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]"><p className="text-[10px] text-emerald-400 font-bold mb-1">🤖 Bot IA</p><p className="text-sm">¡Hola! 😊 Tenemos disponibles apartamentos de 2 y 3 alcobas en el proyecto Reserva del Bosque. ¿Te interesa más el de 2 o de 3 alcobas?</p></div></div>
                <div className="flex justify-end"><div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]"><p className="text-sm">El de 3, ¿cuánto vale y cuándo entregan?</p></div></div>
                <div className="flex justify-start"><div className="bg-[#1a1f2e] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]"><p className="text-[10px] text-emerald-400 font-bold mb-1">🤖 Bot IA</p><p className="text-sm">El de 3 alcobas tiene 78m² y desde $385.000.000. Entrega en marzo 2027. 🏗️ ¿Te agendo una cita virtual con un asesor para ver planos y separar?</p></div></div>
              </div>
            </div>
          </div>
          {/* Feature 2: CRM + Multi-agente */}
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
                {[
                  'Kanban drag & drop (Nuevo → Interesado → Negociación → Ganado)',
                  'Multi-agente: asignación automática round-robin',
                  'Notas privadas entre agentes (el cliente no las ve)',
                  'Lead scoring con IA (probabilidad de cierre)',
                  'Ranking de performance por agente',
                  'Permisos por rol: owner, admin, agente, viewer',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Feature 3: Facebook Ads IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">📢</span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Facebook & Instagram Ads</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">Publicidad que vende.<br />Sin tocar Ads Manager.</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">La IA crea anuncios Click-to-WhatsApp optimizados. Elige servicio, público y presupuesto — nosotros hacemos el resto. Monitoreo 24/7 y optimización automática.</p>
              <ul className="space-y-3">
                {[
                  'Wizard de 5 pasos (cualquiera puede crear campañas)',
                  'IA genera 4+ variantes de copy automáticamente',
                  'Click-to-WhatsApp: el cliente te escribe directo al bot',
                  'Targeting pro: ciudades con radio, intereses, edad, género',
                  'Monitoreo diario: pausa automática si no hay resultados',
                  'Notificación push si Meta rechaza un anuncio',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/10 rounded-3xl p-6">
              <div className="space-y-3">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= 5 ? 'bg-purple-500' : 'bg-white/10'}`} />)}</div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Vista previa del anuncio</p>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-bold mb-2">🏢 ¿Buscas el hogar de tus sueños?</p>
                  <p className="text-[10px] text-gray-400 mb-3">Descubre Riverside Park — apartamentos de 2 y 3 habitaciones con vista panorámica. Unidades limitadas. ¡Escríbenos por WhatsApp!</p>
                  <div className="flex gap-2">
                    <span className="text-[8px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Radio 25 km</span>
                    <span className="text-[8px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">28-55 años</span>
                    <span className="text-[8px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">CTW WhatsApp</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Alcance</p><p className="text-xs font-bold text-purple-400">12,400</p></div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Te escribieron</p><p className="text-xs font-bold text-emerald-400">48</p></div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center"><p className="text-[8px] text-gray-500">Costo/lead</p><p className="text-xs font-bold text-yellow-400">$3,200</p></div>
                </div>
              </div>
            </div>
          </div>
          {/* Feature 4: Pagos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 bg-gradient-to-br from-yellow-500/5 to-yellow-500/0 border border-yellow-500/10 rounded-3xl p-8 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Pasarelas disponibles</p>
              <div className="grid grid-cols-3 gap-4">
                {['Bold', 'Wompi', 'PayPal', 'MercadoPago', 'OpenPay', 'PayU'].map((g, i) => (
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
              <p className="text-gray-400 mb-6 leading-relaxed">Genera links de pago desde el dashboard o deja que el bot los envíe automáticamente. 6 pasarelas disponibles para toda Latinoamérica.</p>
              <ul className="space-y-3">
                {[
                  'Bold, Wompi, PayPal, MercadoPago, OpenPay, PayU',
                  'Link de pago directo en la conversación de WhatsApp',
                  'Webhook automático: el bot confirma el pago al cliente',
                  'Dashboard de pagos con estado en tiempo real',
                  'Multi-moneda: COP, MXN, USD, ARS, CLP, PEN',
                  'Genera links desde el CRM con 1 clic',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400 mt-0.5">✓</span>{f}
                  </li>
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
              <p className="text-gray-400 mb-6 leading-relaxed">El bot muestra fechas disponibles, el cliente elige y la cita se crea automáticamente en tu calendario. Sin llamadas, sin WhatsApp manual.</p>
              <ul className="space-y-3">
                {[
                  'Integración directa de Calendario',
                  'WhatsApp Flows: el cliente elige fecha y hora en el chat',
                  'Detección de festivos y días cerrados',
                  'Recordatorios automáticos antes de la cita',
                  'Gestión de citas desde el dashboard',
                  'Citas manuales desde el panel del agente',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-sky-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-sky-500/5 to-sky-500/0 border border-sky-500/10 rounded-3xl p-6">
              <div className="space-y-2">
                {['Lun 28 Abr — 10:00 AM', 'Mar 29 Abr — 2:00 PM', 'Mié 30 Abr — 10:00 AM', 'Jue 1 May — 4:00 PM'].map((d, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 1 ? 'bg-sky-500/10 border border-sky-500/30' : 'bg-white/[0.02] border border-white/5 hover:border-sky-500/20'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📅</span>
                      <p className="text-xs font-bold">{d}</p>
                    </div>
                    {i === 1 ? (
                      <span className="text-[9px] px-2 py-1 rounded-full bg-sky-500 text-white font-bold">Seleccionado</span>
                    ) : (
                      <span className="text-[9px] px-2 py-1 rounded-full bg-white/5 text-gray-400">Disponible</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Feature 6: Dashboard + PWA */}
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
              <p className="text-gray-400 mb-6 leading-relaxed">Dashboard web + PWA instalable. Métricas en tiempo real, chat en vivo con tus clientes, notificaciones push cuando un lead pide hablar con un humano. Todo desde tu celular.</p>
              <ul className="space-y-3">
                {[
                  '19+ páginas: CRM, chat, citas, pagos, ads, inventario...',
                  'Push notifications (FCM) cuando hay handoff a humano',
                  'Email automático al agente cuando se le asigna un lead',
                  'Sonido + vibración cuando llega mensaje nuevo',
                  'Instala como app desde Chrome (PWA)',
                  'Funciona en PC, tablet y celular',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-rose-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* TODO: Cómo funciona + Para quién + Planes + Testimonios + FAQ + CTA + Footer */}
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
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-bold mb-4">Precios transparentes</p>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Elige tu plan</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">Todos incluyen 7 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col text-left hover:border-indigo-500/30 transition-all">
              <h3 className="text-lg font-bold mb-1">Starter</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Para empezar a automatizar</p>
              <div className="text-4xl font-black mb-1">$200<span className="text-sm text-gray-600 font-medium">/mes</span></div>
              <p className="text-[10px] text-gray-600 mb-6">USD • facturación mensual</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Bot IA 24/7</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>1 línea de WhatsApp</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>500 conversaciones/mes</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>CRM básico</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>1 pasarela de pago</li>
                <li className="flex gap-2 text-gray-600"><span>—</span>Agendamiento</li>
                <li className="flex gap-2 text-gray-600"><span>—</span>Facebook Ads</li>
                <li className="flex gap-2 text-gray-600"><span>—</span>Multi-agente</li>
              </ul>
              <Link href="/auth/login" className="w-full py-3 rounded-2xl bg-white/5 hover:bg-indigo-600 text-center text-sm font-bold transition-all border border-white/10 hover:border-indigo-500">
                Comenzar gratis
              </Link>
            </div>
            {/* Growth */}
            <div className="bg-indigo-600 rounded-3xl p-8 flex flex-col text-left shadow-2xl shadow-indigo-600/30 scale-[1.03] z-10 relative">
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Más popular</div>
              <h3 className="text-lg font-bold mb-1">Growth</h3>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest mb-6">Ventas en piloto automático</p>
              <div className="text-4xl font-black mb-1">$350<span className="text-sm opacity-70 font-medium">/mes</span></div>
              <p className="text-[10px] text-indigo-200 mb-6">USD • facturación mensual</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex gap-2"><span>✓</span>Todo lo de Starter +</li>
                <li className="flex gap-2"><span>✓</span>2,000 conversaciones/mes</li>
                <li className="flex gap-2"><span>✓</span>Memoria proactiva IA</li>
                <li className="flex gap-2"><span>✓</span>Agendamiento + Calendario</li>
                <li className="flex gap-2"><span>✓</span>CRM completo + Kanban</li>
                <li className="flex gap-2"><span>✓</span>6 pasarelas de pago</li>
                <li className="flex gap-2"><span>✓</span>Facebook Ads con IA</li>
                <li className="flex gap-2"><span>✓</span>3 agentes incluidos</li>
              </ul>
              <Link href="/auth/login" className="w-full py-3 rounded-2xl bg-white text-indigo-600 text-center text-sm font-black transition-all hover:bg-gray-100 shadow-lg">
                Activar Growth
              </Link>
            </div>
            {/* Enterprise */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col text-left hover:border-indigo-500/30 transition-all">
              <h3 className="text-lg font-bold mb-1">Enterprise</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Para agencias y equipos grandes</p>
              <div className="text-4xl font-black mb-1">Custom</div>
              <p className="text-[10px] text-gray-600 mb-6">Cotización personalizada</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Todo lo de Growth +</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Conversaciones ilimitadas</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Llamadas IA (VAPI)</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Agentes ilimitados</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Multi-línea WhatsApp</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>API pública</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Soporte prioritario 24/7</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span>Onboarding personalizado</li>
              </ul>
              <Link href="/auth/login" className="w-full py-3 rounded-2xl bg-white/5 hover:bg-indigo-600 text-center text-sm font-bold transition-all border border-white/10 hover:border-indigo-500">
                Hablar con ventas
              </Link>
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
              { q: '¿Funciona en mi país?', a: 'Sí. Funcionamos en toda Latinoamérica y España. Soportamos pasarelas de pago locales (Bold, Wompi para Colombia; OpenPay para México; MercadoPago para Argentina, etc).' },
              { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin penalidad. Los 7 días de prueba son completamente gratis y no pedimos tarjeta de crédito para empezar.' },
              { q: '¿Necesito conocimientos técnicos?', a: 'No. Todo se configura con clicks. El wizard te guía paso a paso. Si necesitas ayuda, nuestro equipo te asiste por WhatsApp.' },
              { q: '¿Puedo gestionar varios negocios?', a: 'Sí, con el plan Enterprise puedes gestionar múltiples líneas de WhatsApp y cuentas publicitarias desde un solo dashboard.' },
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