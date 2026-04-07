'use client'; // Necesario para animaciones y hooks en App Router
import React, { useState, useEffect } from 'react';

// Definición de la conversación simulada
const conversacion = [
  { id: 1, tipo: 'cliente', texto: 'Hola! Quiero info sobre el plan Growth', tiempo: '10:01 AM' },
  { id: 2, tipo: 'bot', texto: '¡Hola! Claro que sí. El plan Growth ($300/mes) te ofrece flujos ilimitados, IA avanzada y soporte prioritario para hasta 500 clientes.', tiempo: '10:01 AM' },
  { id: 3, tipo: 'cliente', texto: '¿Incluye integración con pagos locales?', tiempo: '10:02 AM' },
  { id: 4, tipo: 'bot', texto: '¡Absolutamente! Podrás cobrar directamente por WhatsApp usando Stripe, PayPal o transferencias locales configuradas.', tiempo: '10:02 AM' },
  { id: 5, tipo: 'cliente', texto: 'Genial, ¿cómo empiezo?', tiempo: '10:03 AM' },
  { id: 6, tipo: 'bot', texto: '¡Súper! Solo dale clic al botón "Comenzar prueba gratuita" en la web o llena el formulario y te daremos acceso inmediato. 🚀', tiempo: '10:03 AM' },
];

export default function MockupCelular() {
  const [mensajesVisibles, setMensajesVisibles] = useState<typeof conversacion>([]);
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (indice < conversacion.length) {
      const msgActual = conversacion[indice];
      
      if (msgActual.tipo === 'bot') {
        // Simular que el bot está escribiendo
        setEstaEscribiendo(true);
        const timerEscribiendo = setTimeout(() => {
          setEstaEscribiendo(false);
          setMensajesVisibles((prev) => [...prev, msgActual]);
          setIndice(indice + 1);
        }, 1500); // Pausa de escritura
        return () => clearTimeout(timerEscribiendo);
      } else {
        // Mensaje del cliente aparece más rápido
        const timerCliente = setTimeout(() => {
          setMensajesVisibles((prev) => [...prev, msgActual]);
          setIndice(indice + 1);
        }, 1000); // Pausa de lectura
        return () => clearTimeout(timerCliente);
      }
    } else {
      // Reiniciar el bucle después de que termina la conversación
      const timerReiniciar = setTimeout(() => {
        setMensajesVisibles([]);
        setIndice(0);
      }, 5000); // Pausa final antes de reiniciar
      return () => clearTimeout(timerReiniciar);
    }
  }, [indice]);

  return (
    <div className="relative w-full max-w-[320px] aspect-[9/18.5] mx-auto">
      
      {/* 1. MARCO DEL TELÉFONO (Fotorrealista) */}
      <div className="absolute inset-0 bg-[#080E1C] rounded-[3rem] border-[12px] border-[#1A2333] shadow-[-10px_10px_30px_rgba(0,0,0,0.5),_10px_-10px_30px_rgba(255,255,255,0.03)] overflow-hidden z-10 flex flex-col">
        
        {/* Notch/Isla Dinámica */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1A2333] rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-10 h-1 bg-black rounded-full opacity-30"></div>
        </div>

        {/* 2. HEADER DE WHATSAPP */}
        <div className="bg-[#111B21] pt-8 pb-3 px-4 flex items-center gap-3 border-b border-white/5 relative z-10">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-lg">C</div>
          <div>
            <div className="font-bold text-sm flex items-center gap-1.5">
              clientes.bot AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">en línea</div>
          </div>
          <div className="ml-auto flex gap-4 text-gray-400">
            <span>📞</span>
            <span>📹</span>
            <span>⋮</span>
          </div>
        </div>

        {/* 3. ÁREA DE CHAT (Fondo de WhatsApp) */}
        <div className="flex-1 bg-[#0B141A] p-4 overflow-y-auto flex flex-col-reverse relative group">
          {/* Fondo sutil de WhatsApp */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/wa-bg.png')] bg-repeat"></div>
          
          <div className="flex flex-col gap-3 relative z-10">
            {mensajesVisibles.map((msg) => (
              <div key={msg.id} className={`flex ${msg.tipo === 'cliente' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[80%] p-3 rounded-xl shadow-md relative ${msg.tipo === 'cliente' ? 'bg-[#005C4B] rounded-br-none' : 'bg-[#202C33] rounded-bl-none'}`}>
                  {/* Triangulito de la burbuja */}
                  <div className={`absolute bottom-0 w-3 h-3 ${msg.tipo === 'cliente' ? 'bg-[#005C4B] -right-1.5 rounded-bl-full' : 'bg-[#202C33] -left-1.5 rounded-br-full'}`}></div>
                  
                  <p className="text-[12px] leading-relaxed text-white">{msg.texto}</p>
                  <span className="text-[9px] text-gray-400 mt-1 block text-right">{msg.tiempo}</span>
                </div>
              </div>
            ))}

            {/* Indicador de "Escribiendo..." */}
            {estaEscribiendo && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-[#202C33] p-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. FOOTER DE ESCRITURA */}
        <div className="bg-[#111B21] p-3 flex items-center gap-3 border-t border-white/5 relative z-10">
          <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-xs text-gray-500">
            Mensaje...
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg">
            🎤
          </div>
        </div>
      </div>

      {/* Sombras y reflejos externos para fotorrealismo */}
      <div className="absolute inset-4 bg-indigo-600/10 rounded-[2.5rem] blur-2xl z-0"></div>
    </div>
  );
}