'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy la IA de clientes.bot 🤖. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getBotResponse = (input: string) => {
    const text = input.toLowerCase();
    
    // 1. ¿CÓMO FUNCIONA? (CERO FRICCIÓN / OAUTH)
    if (text.includes('como funciona') || text.includes('funciona') || text.includes('pasos') || text.includes('configur')) {
      return "Es extremadamente sencillo: Inicias sesión con tu cuenta de Facebook en nuestro Dashboard y nosotros nos encargamos de todo el trabajo sucio. Extraemos los tokens, configuramos los flujos de Meta y activamos el motor en 30 segundos. Tú solo subes la información de tu negocio (PDF o Link) y la IA empieza a vender.";
    }

    // 2. ¿PUEDO USAR MI MISMA LÍNEA?
    if (text.includes('mi linea') || text.includes('mismo numero') || text.includes('mi numero') || text.includes('actual') || text.includes('perder')) {
      return "¡Sí! Puedes vincular tu número actual mediante nuestra integración oficial con Meta. Nosotros gestionamos toda la transición técnica para que no pierdas tus contactos. También tienes la opción de activar una línea nueva exclusiva para la IA desde el panel. ¿Qué prefieres para tu negocio?";
    }

    // 3. PRECIOS Y PLANES (Sincronizado con la Landing)
    if (text.includes('precio') || text.includes('costo') || text.includes('vale') || text.includes('plan') || text.includes('tarifas')) {
      return "Tenemos dos motores principales: Starter ($200/mes) para automatización básica, y Growth ($350/mes) que es el más potente ya que incluye Agendamiento Nativo, CRM y Memoria Proactiva. Ambos se configuran solos al iniciar sesión con Facebook. ¿Cuál se ajusta más a tu volumen de ventas?";
    }

    // 4. ¿QUÉ PASA SI SE ACABAN LOS MENSAJES? (Duda Crítica)
    if (text.includes('acaban') || text.includes('terminan') || text.includes('limite') || text.includes('mensajes') || text.includes('chats')) {
      return "¡No te preocupes! El sistema nunca se detiene. Si alcanzas el límite de tu plan (500 o 2.000 chats), puedes adquirir un paquete de mensajes extra desde el Dashboard o subir de nivel tu plan al instante. Siempre recibirás una notificación cuando estés cerca del límite para que tu negocio nunca deje de vender.";
    }

    // 5. DASHBOARD Y CONTROL
    if (text.includes('dashboard') || text.includes('panel') || text.includes('control') || text.includes('ver')) {
      return "En el Dashboard tendrás control total: verás las conversaciones en vivo, el estado de tus leads en el CRM, el calendario de citas y los pagos recibidos por Bold. Es una interfaz diseñada para que tú solo supervises resultados mientras el Motor AWS trabaja por ti.";
    }

    // 6. PAGOS Y AGENDAMIENTO
    if (text.includes('pago') || text.includes('cobrar') || text.includes('cita') || text.includes('agenda') || text.includes('calendario')) {
      return "Nuestra tecnología es capaz de generar links de pago y agendar citas en tu Google Calendar automáticamente. La IA detecta la intención de compra del cliente y cierra el trato sin que tú intervengas. ¿Te imaginas despertar con citas y pagos ya confirmados?";
    }

    // 7. SEGURIDAD Y PRIVACIDAD
    if (text.includes('seguro') || text.includes('datos') || text.includes('privacidad') || text.includes('confia')) {
      return "Tus datos y los de tus clientes están protegidos con encriptación de grado bancario (RSA). Al usar la API oficial de Meta y nuestra infraestructura en AWS, garantizamos que tu información sea privada y tu número esté seguro. 🔐";
    }

    // 8. SALUDOS
    if (text.includes('hola') || text.includes('buenos') || text.includes('que tal')) {
      return "¡Hola! Bienvenido a clientes.bot. Estoy configurada para mostrarte cómo nuestra tecnología de 'Cero Fricción' puede automatizar tu WhatsApp en segundos. ¿Quieres saber cómo conectamos tu cuenta con Facebook sin que tú hagas nada técnico?";
    }

    // 9. FALLBACK (Respuesta cuando no entiende)
    return "Esa es una pregunta muy interesante para nuestro equipo técnico. Lo que te puedo asegurar es que mi motor está diseñado para que tú NO tengas que preocuparte por tokens o APIs. ¿Te gustaría que un asesor humano te llame para explicarte ese punto específico?";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');

    // Simulación de "IA escribiendo..."
    setTimeout(() => {
      const botMsg = { role: 'bot', text: getBotResponse(currentInput) };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-[#075E54] p-5 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl text-white">🤖</div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></div>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">IA clientes.bot</p>
              <p className="text-white/70 text-[10px]">Normalmente responde al instante</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto text-white/50 hover:text-white text-2xl transition-transform active:scale-90">×</button>
          </div>

          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] scroll-smooth"
            style={{ 
              backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", 
              backgroundSize: '400px',
              backgroundRepeat: 'repeat'
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-top-1 duration-300`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm relative ${
                  msg.role === 'user' ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                  <p className="text-[8px] text-gray-400 text-right mt-1 uppercase font-bold tracking-tighter">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-[#f0f2f5] flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white border-none rounded-full px-5 py-3 text-sm text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
            />
            <button 
              type="submit" 
              className="bg-[#075E54] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md active:scale-95 shrink-0"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] w-16 h-16 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative z-[10000]"
      >
        {isOpen ? (
           <span className="text-white text-3xl font-light">×</span>
        ) : (
          <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl font-sans">
            Prueba nuestra IA aquí
          </div>
        )}
      </button>
    </div>
  );
}