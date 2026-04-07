'use client';
import React from 'react';
import MockupCelular from './components/MockupCelular'; 

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 font-sans scroll-smooth">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px]">CB</div>
            clientes.bot
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 text-white">
            Prueba gratis
          </button>
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
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="bg-indigo-600 hover:scale-105 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/25 text-white">
              Comenzar prueba gratuita →
            </button>
          </div>

          {/* LLAMADA AL COMPONENTE QUE YA TIENE EL FONDO BEIGE ARREGLADO */}
          <div className="mt-16 mb-24 relative z-10 scale-100 md:scale-110">
            <MockupCelular />
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* 3. BENEFICIOS */}
      <section id="beneficios" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Beneficios de negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "+40% conversiones", d: "Aumenta tus ventas con IA", i: "📈" },
              { t: "Ahorra 20 h/semana", d: "Automatiza tareas repetitivas", i: "⏳" },
              { t: "Cobros al instante", d: "Pagos locales integrados", i: "💰" },
            ].map((b, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{b.i}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{b.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLANES */}
      <section id="planes" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Planes transparentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col text-left">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <div className="text-4xl font-black mb-6">$150<span className="text-sm text-gray-500">/mes</span></div>
              <button className="w-full py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-all">Empezar ahora</button>
            </div>
            {/* Growth */}
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col text-left shadow-2xl shadow-indigo-600/20 scale-105 z-10">
              <h3 className="text-lg font-bold mb-2">Growth</h3>
              <div className="text-4xl font-black mb-6">$300<span className="text-sm opacity-70">/mes</span></div>
              <button className="w-full py-4 rounded-2xl bg-white text-indigo-600 font-black hover:bg-gray-100 transition-all">Empezar ahora</button>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col text-left">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-black mb-6">Custom</div>
              <button className="w-full py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-all">Contactar ventas</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACTO */}
      <section id="contacto" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/5 p-12 rounded-[3rem] text-center text-white">
          <h2 className="text-3xl font-black mb-4">Comienza hoy</h2>
          <p className="text-gray-400 mb-10">Elige tu plan y únete a la plataforma tecnológica</p>
          <form className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-2">Nombre completo</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-white" placeholder="Juan Martínez" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-2">Email corporativo</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-white" placeholder="juan@empresa.com" required />
            </div>
            <button type="submit" className="w-full py-5 rounded-2xl bg-indigo-600 font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all mt-6 text-white uppercase tracking-widest">
              Acceder a la plataforma
            </button>
          </form>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-600 text-xs border-t border-white/5">
        © 2026 Clientes.bot. Todos los derechos reservados.
      </footer>
    </div>
  );
}