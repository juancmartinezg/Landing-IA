'use client';
import React from 'react';
import MockupCelular from './components/MockupCelular'; 
import ChatWidget from './components/ChatWidget';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 font-sans scroll-smooth">
      
      {/* 1. NAVBAR (Cambia solo esto) */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center text-white">
          <div className="flex flex-col md:flex-row items-center gap-0 md:gap-2">
            <img 
              src="/cb-logo.webp" 
              alt="C.B. Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]"
            />
            <span className="text-[9px] md:text-xl font-bold tracking-tighter text-white font-sans">clientes.bot</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 font-sans">
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          </div>
         <div className="flex items-center gap-2">
            <a href="/auth/login" className="border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 px-3 py-2 md:px-6 md:py-2.5 rounded-xl text-[11px] md:text-sm font-bold transition-all text-white font-sans whitespace-nowrap">
              Iniciar sesion
            </a>
            <a href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 md:px-6 md:py-2.5 rounded-xl text-[11px] md:text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 text-white font-sans whitespace-nowrap">
              Prueba gratis
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-white">
            Todo lo que tu negocio necesita, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-400">
              en una sola plataforma
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
            Somos el único SaaS que combina WhatsApp, CRM, pagos locales y campañas. 
            Ahorra tiempo y vende más con clientes.bot.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 relative z-10">
            <a href="/auth/login" className="bg-indigo-600 hover:scale-105 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/25 text-white inline-block">
              Comenzar prueba gratuita →
            </a>
            <a href="#dashboard" className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all text-white flex items-center justify-center">
              Ver Dashboard
            </a>
          </div>

          <div className="mt-16 mb-24 relative z-10 scale-100 md:scale-110">
            <MockupCelular />
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* 3. BENEFICIOS RÁPIDOS */}
      <section id="beneficios" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white uppercase tracking-widest text-sm opacity-50">Por qué elegirnos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "+40% conversiones", d: "Aumenta tus ventas con IA", i: "📈" },
              { t: "Ahorra 20 h/semana", d: "Automatiza tareas repetitivas", i: "⏳" },
              { t: "Cobros al instante", d: "Pagos locales integrados", i: "💰" },
            ].map((b, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group text-center">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{b.i}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{b.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DASHBOARD INTERACTIVO (Corregido y Fotorrealista) */}
      <section id="dashboard" className="py-24 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Tu Centro de <br/><span className="text-sky-400">Comando Inteligente</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Controla cada conversación, pago y métrica desde una interfaz diseñada para la claridad y el crecimiento de tu negocio.</p>
          </div>

          <div className="relative group max-w-5xl mx-auto">
            {/* Contenedor del Mockup con la imagen local */}
            <div className="relative aspect-[16/9] bg-[#1A2333] border-[8px] border-[#2A3942] rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-indigo-500/10">
              
              {/* Imagen del Dashboard (Usando tu archivo local) */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: "url('/dashboard-preview.webp')",
                  backgroundColor: '#0B0F1A' // Color de carga
                }}
              ></div>

              {/* Overlay para dar profundidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/40 to-transparent z-10"></div>
            </div>

            {/* Widgets Flotantes (Estos se mantienen igual porque dan mucho estilo) */}
            <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl hidden md:block z-20 animate-bounce-slow">
              <p className="text-[10px] text-gray-400 mb-1 uppercase font-black tracking-widest">Ingresos Hoy</p>
              <p className="text-2xl font-black text-emerald-400">$2,450.00</p>
            </div>

            <div className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl hidden md:block z-20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <p className="text-sm font-bold text-white tracking-tight">IA Analizando Leads...</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium italic">"84% de probabilidad de cierre en el chat #492"</p>
            </div>
          </div>

          {/* Métricas inferiores */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { l: "Leads Generados", v: "1,284", c: "text-indigo-400" },
                { l: "Tasa de Cierre", v: "24.5%", c: "text-emerald-400" },
                { l: "Tiempo Ahorrado", v: "158 hrs", c: "text-sky-400" },
                { l: "Ventas por IA", v: "82%", c: "text-purple-400" }
              ].map((m, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] text-center backdrop-blur-sm">
                  <p className="text-[9px] uppercase font-black text-gray-500 mb-1 tracking-widest">{m.l}</p>
                  <p className={`text-2xl font-black ${m.c}`}>{m.v}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 5. FUNCIONALIDADES DETALLADAS */}
      <section id="funcionalidades" className="py-24 px-6 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Poderosa tecnología <br/><span className="text-indigo-500">al alcance de tu mano</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Diseñado para escalar. Olvídate de configuraciones complejas y empieza a vender en minutos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { i: "🤖", t: "IA con Memoria Proactiva", d: "Nuestra IA no solo responde, recuerda preferencias de clientes previos para cerrar ventas de forma personalizada." },
              { i: "🔗", t: "Integración CRM Nativa", d: "Sincroniza automáticamente cada chat con tu base de datos. Sin hojas de cálculo, sin procesos manuales." },
              { i: "💳", t: "Pagos en un Clic", d: "Genera links de pago de Stripe o PayPal directamente en la conversación de WhatsApp. Vende mientras duermes." },
              { i: "📊", t: "Dashboards en Tiempo Real", d: "Mide la tasa de conversión, el tiempo de respuesta y tus ingresos totales desde un panel de control intuitivo." },
              { i: "🌍", t: "Multi-idioma Inteligente", d: "Detecta el idioma del cliente y responde automáticamente en más de 50 idiomas con fluidez natural." },
              { i: "🔐", t: "Seguridad Bancaria", d: "Tus datos y los de tus clientes están protegidos con encriptación de grado militar y cumplimiento GDPR." }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">{f.i}</div>
                <h3 className="text-xl font-bold mb-4">{f.t}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CÓMO FUNCIONA (PASOS) */}
      <section className="py-24 px-6 bg-[#0E121F]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-16 uppercase tracking-tighter">Tu negocio en piloto automático <br/><span className="text-emerald-400 italic">en 3 pasos</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              { s: "01", t: "Conecta tu WhatsApp", d: "Escanea el QR y sincroniza tu línea corporativa en segundos." },
              { s: "02", t: "Entrena a tu IA", d: "Sube tu catálogo o PDF de servicios. La IA aprenderá todo sobre ti." },
              { s: "03", t: "Empieza a Vender", d: "Mira cómo la plataforma gestiona chats, CRM y pagos sola." }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 group-hover:text-indigo-500/10 transition-colors">{step.s}</div>
                <h3 className="text-xl font-bold mb-4 relative z-10">{step.t}</h3>
                <p className="text-gray-400 text-sm relative z-10">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PLANES: Estrategia Cero Fricción */}
      <section id="planes" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16 uppercase tracking-tighter font-sans">
            Escala tu negocio sin <br/>
            <span className="text-indigo-500">tocar una sola línea de código</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Starter */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col text-left hover:border-indigo-500/30 transition-all">
              <h3 className="text-lg font-bold mb-2 font-sans">Starter Core</h3>
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-6 tracking-widest">Configuración Express con Facebook</p>
              <div className="text-4xl font-black mb-8 font-sans">$200<span className="text-sm text-gray-600 font-medium">/mes</span></div>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-400 font-sans">
                <li>✅ Autoconfiguración en 30 segundos</li>
                <li>✅ Motor de Respuesta IA 24/7</li>
                <li>✅ 1 Línea de WhatsApp Business</li>
                <li>✅ 500 Conversaciones Inteligentes</li>
                <li className="text-gray-600">❌ Agendamiento Nativo</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-all font-sans uppercase text-xs tracking-widest">
                Iniciar ahora
              </button>
            </div>

            {/* Plan Growth */}
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col text-left shadow-2xl shadow-indigo-600/40 scale-105 z-10 relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recomendado</div>
              <h3 className="text-lg font-bold mb-2 font-sans">Growth Engine</h3>
              <p className="text-indigo-100 text-[10px] uppercase font-bold mb-6 tracking-widest">Ventas en Piloto Automático</p>
              <div className="text-4xl font-black mb-8 font-sans">$350<span className="text-sm opacity-70 font-medium">/mes</span></div>
              <ul className="space-y-4 mb-10 flex-1 text-sm font-sans">
                <li>✅ 2.000 Chats con Memoria Proactiva</li>
                <li>✅ Agendamiento en Calendario</li>
                <li>✅ Control de CRM y Leads</li>
                <li>✅ Generación de Enlaces de Pago</li>
                <li>✅ Detección de Intención de Compra</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white text-indigo-600 font-black hover:bg-gray-100 transition-all shadow-lg font-sans uppercase text-xs tracking-widest">
                Activar Growth
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col text-left hover:border-indigo-500/30 transition-all">
              <h3 className="text-lg font-bold mb-2 font-sans">Enterprise Ultra</h3>
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-6 tracking-widest">Omnicanalidad de Élite</p>
              <div className="text-4xl font-black mb-8 font-sans">Custom</div>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-400 font-sans">
                <li>✅ Motor de Voz para Llamadas IA</li>
                <li>✅ Entrenamiento con Documentación Privada</li>
                <li>✅ Líneas y Sucursales Ilimitadas</li>
                <li>✅ Panel de Supervisión Multicanal</li>
                <li>✅ Soporte Prioritario 24/7</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-all font-sans uppercase text-xs tracking-widest">
                Hablar con Experto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIOS (Ricardo Real de /public) */}
      <section className="py-24 px-6 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Estrellas con Brillo */}
          <div className="flex justify-center gap-1.5 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-emerald-400 text-xl drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">⭐</span>
            ))}
          </div>

          <h2 className="text-2xl md:text-4xl font-medium italic mb-14 text-gray-200 leading-tight tracking-tight">
            "Desde que implementamos <span className="text-white font-bold not-italic">clientes.bot</span>, mi equipo de ventas ya no pierde tiempo en dudas básicas. La IA cierra las ventas solo, nosotros solo entregamos. ¡Cambio total!"
          </h2>

          <div className="flex flex-col items-center">
            {/* FOTO DE RICARDO LOCAL */}
            <div className="relative group">
              {/* Efecto de halo detrás de la foto */}
              <div className="absolute inset-0 bg-indigo-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 shadow-2xl">
                <img 
                  src="/ricardo.jpg" 
                  alt="Ricardo S. - CEO FastDelivery" 
                  className="w-full h-full rounded-full object-cover border-2 border-[#0B0F1A]"
                />
              </div>

              {/* Badge de Verificado */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-[#0B0F1A] text-[10px] shadow-lg">
                ✓
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xl font-black text-white tracking-tight">Ricardo S.</p>
              <p className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.25em] mt-1">CEO @ FastDelivery</p>
            </div>
          </div>
        </div>
      </section>      
      
      {/* 9. CONTACTO / CTA FINAL */}
      <section id="contacto" className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-900/40 to-indigo-600/10 border border-white/10 p-12 rounded-[3rem] text-center text-white relative shadow-2xl">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500/20 blur-3xl"></div>
          
          <h2 className="text-4xl font-black mb-4">Únete a la revolución</h2>
          <p className="text-gray-400 mb-10">Deja de perder clientes por tiempos de respuesta largos. Automatiza hoy.</p>

          {/* Reemplaza "TU_ID_AQUÍ" por el ID que te de Formspree */}
          <form 
            action="https://formspree.io/f/TU_ID_AQUÍ" 
            method="POST"
            className="space-y-4 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-2 tracking-widest font-sans">Nombre</label>
                <input 
                  type="text" 
                  name="nombre" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-white font-sans" 
                  placeholder="Camilo Pérez" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-2 tracking-widest font-sans">Empresa</label>
                <input 
                  type="text" 
                  name="empresa" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-white font-sans" 
                  placeholder="Bot S.A." 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-2 tracking-widest font-sans">Email Corporativo</label>
              <input 
                type="email" 
                name="email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-white font-sans" 
                placeholder="Camilo@empresa.com" 
                required 
              />
            </div>

            {/* Campo oculto para evitar SPAM (Honeypot) */}
            <input type="text" name="_gotcha" style={{ display: 'none' }} />

            <button 
              type="submit" 
              className="w-full py-6 rounded-2xl bg-indigo-600 font-black text-xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all mt-6 text-white uppercase tracking-widest font-sans"
            >
              Obtener Acceso Inmediato
            </button>
          </form>

          <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-tighter font-sans">
            Al enviar, aceptas recibir una propuesta personalizada vía email o WhatsApp.
          </p>
        </div>
      </section>

      {/* 10. FOOTER (Copia y pega este bloque sobre el anterior) */}
      <footer className="py-12 text-center border-t border-white/5 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* LOGO EN EL FOOTER (Igual al del Navbar) */}
          <div className="flex items-center gap-2 font-bold">
            <img 
              src="/cb-logo.webp" 
              className="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]" 
              alt="Logo Footer" 
            />
            <span className="tracking-tighter text-lg font-sans">clientes.bot</span>
          </div>

          <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-medium font-sans">
            © 2026 SGC TECHNOLOGY. Todos los derechos reservados.
          </p>

          <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest font-sans">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>

      {/* CSS Extra para animaciones (Añadir en global.css si es posible) */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
      
      <ChatWidget />

    </div>
  );
}