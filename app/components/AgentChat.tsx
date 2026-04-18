'use client';
import { useState, useRef, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AgentChat({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('cb_agent_history') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
 useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0) localStorage.setItem('cb_agent_history', JSON.stringify(messages.slice(-20)));
  }, [messages]);
  useEffect(() => {
    // Precargar voces del navegador
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
  }, []);
  const speak = (text: string) => {
    if (!voiceEnabled) return;
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      // Limpiar emojis y caracteres especiales para voz natural
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}✨✅❌⭐🎯📱💬🔒🛒💰📋🏷️🏙️📮📝📤📥➕✏️🗑️📞💳🤖🎙️🔴🔊🔇]/gu, '').replace(/\s+/g, ' ').trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = 1.2;
      // Buscar voz femenina en español
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.lang.startsWith('es') && /female|paulina|helena|conchita|lucia|monica|sabina/i.test(v.name))
        || voices.find(v => v.lang.startsWith('es') && !(/male|jorge|diego|andres/i.test(v.name)))
        || voices.find(v => v.lang.startsWith('es'));
      if (femaleVoice) utterance.voice = femaleVoice;
      speechSynthesis.speak(utterance);
    }
  };
  const startListening = async () => {
    // Detener si ya está grabando
    if (listening && recognitionRef.current) {
      if (recognitionRef.current.stop) recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      // Desktop/Android: usar SpeechRecognition nativo
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onstart = () => setListening(true);
        recognition.onresult = (e: any) => {
          const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
          setInput(transcript);
          if (e.results[e.results.length - 1].isFinal) {
            setListening(false);
            sendMessage(transcript);
          }
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
        recognition.start();
      } catch { setListening(false); }
    } else {
      // iOS/Safari: grabar audio y enviar a Gemini
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setListening(true);
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          setListening(false);
          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setLoading(true);
            try {
              const hist = messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
              const res = await fetch(`${API_URL}/agent/voice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'client-id': companyId },
                body: JSON.stringify({ audio: base64, mime_type: mimeType, history: hist }),
              });
              const data = await res.json();
              if (data.transcript) setMessages(prev => [...prev, { role: 'user', text: data.transcript }]);
              const reply = data.reply || 'No pude procesar tu audio.';
              setMessages(prev => [...prev, { role: 'agent', text: reply }]);
              speak(reply);
            } catch { setMessages(prev => [...prev, { role: 'agent', text: 'Error procesando audio.' }]); }
            setLoading(false);
          };
          reader.readAsDataURL(blob);
        };
        recognitionRef.current = mediaRecorder;
        mediaRecorder.start();
        setTimeout(() => { if (mediaRecorder.state === 'recording') mediaRecorder.stop(); }, 10000);
      } catch {
        alert('Permite el acceso al micrófono.');
        setListening(false);
      }
    }
  };
  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
      const res = await fetch(`${API_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': companyId },
        body: JSON.stringify({ message: msg, history }),
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
              <p className="text-sm font-bold text-white">Aria ✨</p>
              <p className="text-[9px] text-gray-500">Tu asistente inteligente</p>
            </div>
            <button onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                voiceEnabled ? 'bg-indigo-600/20' : 'bg-white/5'
              }`}>
              <span className="text-sm">{voiceEnabled ? '🔊' : '🔇'}</span>
            </button>
          </div>
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-3xl mb-3">✨</p>
                <p className="text-sm text-gray-400">¡Hola! Soy <strong className="text-indigo-400">Aria</strong>, tu asistente.</p>
                <p className="text-[10px] text-gray-600 mt-1">Pregúntame lo que necesites o pídeme que haga algo por ti 😊</p>
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
                placeholder="Escribe o habla..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              <button onClick={startListening} disabled={listening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  listening ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10'
                }`}>
                <span className="text-lg">{listening ? '🔴' : '🎙️'}</span>
              </button>
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