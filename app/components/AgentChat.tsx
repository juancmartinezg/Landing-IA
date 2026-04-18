'use client';
import { useState, useRef, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AgentChat({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.1;
      speechSynthesis.speak(utterance);
    }
  };
  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setListening(false);
      sendMessage(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };
  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': companyId },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data.reply || 'No pude procesar tu solicitud.';
      const needsConfirm = data.needs_confirmation && data.action;
      if (needsConfirm) {
        setPendingAction({ action: data.action, params: data.params });
        setMessages(prev => [...prev, { role: 'agent', text: reply, confirm: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', text: reply }]);
        setPendingAction(null);
      }
      speak(reply);
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Error de conexión. Intenta de nuevo.' }]);
    }
    setLoading(false);
  };
  const confirmAction = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': companyId },
        body: JSON.stringify({ message: `CONFIRMAR ACCION: ${pendingAction.action} con params ${JSON.stringify(pendingAction.params)}` }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'agent', text: data.reply || '✅ Acción ejecutada' }]);
      speak(data.reply || 'Listo, acción ejecutada');
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Error ejecutando la acción.' }]);
    }
    setPendingAction(null);
    setLoading(false);
  };
  return (
    <>
      {/* Boton flotante */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/30 z-50 transition-all hover:scale-110">
        <span className="text-2xl">{open ? '✕' : '🤖'}</span>
      </button>
      {/* Panel del chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-[#0B0F1A] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 bg-[#080B14] flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Asistente IA</p>
              <p className="text-[9px] text-gray-500">Pregúntame lo que quieras</p>
            </div>
            <button onClick={startListening} disabled={listening}
              className={`ml-auto w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                listening ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10'
              }`}>
              <span className="text-lg">{listening ? '🔴' : '🎙️'}</span>
            </button>
          </div>
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-3xl mb-3">🤖</p>
                <p className="text-sm text-gray-400">¡Hola! Soy tu asistente.</p>
                <p className="text-[10px] text-gray-600 mt-1">Pregúntame sobre tus leads, ventas, o pídeme que haga algo.</p>
                <div className="mt-4 space-y-1">
                  {['¿Quién me escribió hoy?', '¿Cuánto he vendido?', '¿Cuántos leads tengo?'].map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="w-full text-left text-[10px] px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 transition-all">
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/30 text-white rounded-tr-sm'
                    : 'bg-white/[0.06] text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.confirm && pendingAction && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={confirmAction}
                        className="text-[10px] px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                        ✅ Confirmar
                      </button>
                      <button onClick={() => { setPendingAction(null); setMessages(prev => [...prev, { role: 'agent', text: 'Acción cancelada.' }]); }}
                        className="text-[10px] px-3 py-1 rounded-lg bg-red-600/20 text-red-400 font-bold">
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] px-4 py-2 rounded-xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="px-3 py-3 border-t border-white/5 bg-[#080B14]">
            <div className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) sendMessage(); }}
                placeholder="Escribe o usa el micrófono..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all disabled:opacity-30 shrink-0">
                <span className="text-white text-lg">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}