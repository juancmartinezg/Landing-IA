'use client';
import React, { useState, useRef, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [demoId, setDemoId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formSell, setFormSell] = useState('');
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  // Permite abrir el widget desde cualquier botón de la landing
  // disparando window.dispatchEvent(new CustomEvent('open-chat-widget'))
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-chat-widget', handler);
    return () => window.removeEventListener('open-chat-widget', handler);
  }, []);
  const handleCreateDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail || !formBusiness || !formSell) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          business_name: formBusiness,
          what_you_sell: formSell
        })
      });
      const data = await res.json();
      
      if (data.demo_id) {
        setDemoId(data.demo_id);
        setBusinessName(data.business_name);
        setMessages([{ role: 'bot', text: data.welcome_message }]);
        setStep('chat');
      }
    } catch (err) {
      console.error('Error creando demo:', err);
    }
    setLoading(false);
  };
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setLoading(true);
    // Mensaje de "escribiendo..."
    setMessages(prev => [...prev, { role: 'bot', text: '...' }]);
    try {
      const res = await fetch(`${API_URL}/demo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_id: demoId, message: userMsg })
      });
      const data = await res.json();
      
      // Reemplazar "..." con la respuesta real
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: data.reply || 'Gracias por tu mensaje.' };
        return updated;
      });
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: 'Hubo un error. Intenta de nuevo.' };
        return updated;
      });
    }
    setLoading(false);
  };
  const handleReset = () => {
    setStep('form');
    setDemoId('');
    setMessages([]);
    setFormName('');
    setFormEmail('');
    setFormBusiness('');
    setFormSell('');
  };
  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
          
          {/* Header */}
          <div className="bg-[#075E54] p-5 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl text-white">🤖</div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></div>
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-bold text-sm">
                {step === 'chat' ? `IA de ${businessName}` : 'Demo clientes.bot'}
              </p>
              <p className="text-white/70 text-[10px]">
                {step === 'chat' ? 'Bot creado en 30 segundos' : 'Crea tu bot en segundos'}
              </p>
            </div>
            {step === 'chat' && (
              <button onClick={handleReset} className="text-white/50 hover:text-white text-xs underline">
                Nuevo
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white text-2xl">×</button>
          </div>
          {step === 'form' ? (
            /* FORMULARIO */
            <form onSubmit={handleCreateDemo} className="flex-1 p-5 overflow-y-auto bg-[#f0f2f5] flex flex-col gap-3">
              <div className="text-center mb-2">
                <p className="text-slate-800 font-bold text-sm">Crea tu bot en 30 segundos</p>
                <p className="text-slate-500 text-[10px]">Llena estos datos y prueba tu IA personalizada</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Tu nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all"
                  placeholder="Juan Perez"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Email *</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all"
                  placeholder="juan@empresa.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Nombre de tu negocio *</label>
                <input
                  type="text"
                  value={formBusiness}
                  onChange={(e) => setFormBusiness(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all"
                  placeholder="Pizzeria Don Mario"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Que vendes o que servicio ofreces? *</label>
                <input
                  type="text"
                  value={formSell}
                  onChange={(e) => setFormSell(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all"
                  placeholder="Pizzas, pastas, ensaladas..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#1da851] transition-all shadow-lg mt-2 disabled:opacity-50 text-sm"
              >
                {loading ? 'Creando tu bot...' : '🚀 Crear mi bot demo'}
              </button>
              <p className="text-[9px] text-slate-400 text-center mt-1">
                Tu bot se crea al instante con IA. Sin tarjeta de credito.
              </p>
            </form>
          ) : (
            /* CHAT */
            <>
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
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text === '...' ? (
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </span>
                      ) : msg.text}
                    </div>
                  </div>
                ))}
                {/* CTA al final del chat */}
                {messages.length > 3 && (
                  <div className="text-center py-3">
                    <a 
                      href="/auth/login"
                      className="inline-block bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-indigo-500 transition-all shadow-lg"
                    >
                      ¿Te gusto? Registrate gratis →
                    </a>
                  </div>
                )}
              </div>
              {/* Input */}
              <form onSubmit={handleSend} className="p-4 bg-[#f0f2f5] flex gap-2 items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  disabled={loading}
                  className="flex-1 bg-white border-none rounded-full px-5 py-3 text-sm text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#075E54] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md active:scale-95 shrink-0 disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
      {/* Boton Flotante */}
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
          <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            🤖 Prueba tu bot demo aqui
          </div>
        )}
      </button>
    </div>
  );
}