'use client';
import React, { useState, useEffect } from 'react';

// Definición de la conversación
const conversacion = [
  { id: 1, tipo: 'bot', texto: '¡Hola! Bienvenido a clientes.bot', tiempo: '10:01 AM' },
  { id: 2, tipo: 'cliente', texto: 'Hola, ¿cómo funciona?', tiempo: '10:01 AM' },
  { id: 3, tipo: 'bot', texto: 'Automatizo tu WhatsApp con IA para vender más.', tiempo: '10:02 AM' },
  { id: 4, tipo: 'cliente', texto: '¿Puede cobrar pagos locales?', tiempo: '10:02 AM' },
  { id: 5, tipo: 'bot', texto: '¡Sí! Integración total con pagos y CRM. 🚀', tiempo: '10:03 AM' },
];

export default function MockupCelular() {
  const [mensajesVisibles, setMensajesVisibles] = useState<typeof conversacion>([]);
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);
  const [indice, setIndice] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && indice < conversacion.length) {
      const msgActual = conversacion[indice];
      if (msgActual.tipo === 'bot') {
        setEstaEscribiendo(true);
        const t = setTimeout(() => {
          setEstaEscribiendo(false);
          setMensajesVisibles((prev) => [...prev, msgActual]);
          setIndice(indice + 1);
        }, 1500);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setMensajesVisibles((prev) => [...prev, msgActual]);
          setIndice(indice + 1);
        }, 1000);
        return () => clearTimeout(t);
      }
    } else if (mounted) {
      const t = setTimeout(() => { setMensajesVisibles([]); setIndice(0); }, 5000);
      return () => clearTimeout(t);
    }
  }, [indice, mounted]);

  if (!mounted) return <div className="mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem]" />;

  return (
    <div className="mx-auto w-[280px] h-[580px] bg-[#0B141A] border-[10px] border-[#1A2333] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative">
       
       {/* 1. HEADER */}
       <div className="bg-[#111B21] pt-10 pb-3 px-4 border-b border-white/5 text-center shrink-0 z-20">
          <p className="text-xs font-bold text-white uppercase tracking-widest">clientes.bot</p>
          <p className="text-[10px] text-emerald-500 animate-pulse font-medium">en línea</p>
       </div>

       {/* 2. ÁREA DE CHAT (SOLO TU IMAGEN) */}
       <div className="flex-1 relative overflow-hidden shrink-0">
          
          {/* TU IMAGEN AL 100% DE OPACIDAD */}
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              backgroundImage: "url('/wa-bg.png')", 
              backgroundSize: 'cover', // O 'contain' si quieres que se vea el patrón completo
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#E5DDD5' // Color de respaldo por si la imagen tarda en cargar
            }}
          ></div>

          {/* Burbujas de mensajes sobre la imagen */}
          <div className="absolute inset-0 z-10 p-4 flex flex-col gap-3 overflow-y-auto">
            {mensajesVisibles.map((m) => (
              <div 
                key={m.id} 
                className={`p-3 rounded-xl text-[11px] max-w-[85%] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  m.tipo === 'cliente' 
                    ? 'bg-[#DCF8C6] self-end rounded-br-none text-[#111B21]' 
                    : 'bg-white self-start rounded-bl-none text-[#111B21]'
                }`}
              >
                <p className="leading-relaxed">{m.texto}</p>
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[8px] text-gray-500 opacity-70 uppercase">{m.tiempo}</span>
                  {m.tipo === 'bot' && <span className="text-sky-500 text-[10px] font-bold">✓✓</span>}
                </div>
              </div>
            ))}

            {estaEscribiendo && (
              <div className="flex justify-start">
                <div className="bg-white/90 p-2.5 rounded-xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
       </div>

       {/* 3. FOOTER */}
       <div className="p-3 bg-[#111B21] flex items-center gap-2 border-t border-white/5 z-20">
          <div className="flex-1 bg-[#2A3942] rounded-full h-8 flex items-center px-4 text-[10px] text-gray-400">
            Escribiendo...
          </div>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-xs">🎤</div>
       </div>
    </div>
  );
}