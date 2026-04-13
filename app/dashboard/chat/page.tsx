'use client';
import { useState, useEffect, useRef } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<any>(null);
  // Cargar conversaciones de Chatwoot
  const loadConversations = () => {
    fetch(`${API_URL}/chatwoot`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => {
        setConversations(data.conversations || []);
        setLoadingConvs(false);
      })
      .catch(() => setLoadingConvs(false));
  };
  // Cargar mensajes de una conversación
  const loadMessages = (convId: string) => {
    fetch(`${API_URL}/chatwoot/messages?conversation_id=${convId}`, {
      headers: { 'client-id': 'JMC' }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoadingMsgs(false);
      })
      .catch(() => setLoadingMsgs(false));
  };
  // Inicial: cargar conversaciones
  useEffect(() => {
    loadConversations();
    // Auto-refresh conversaciones cada 5 segundos
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);
  // Auto-refresh mensajes cuando hay conversación seleccionada
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (selectedConvId) {
      pollRef.current = setInterval(() => loadMessages(selectedConvId), 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedConvId]);
  // Scroll al último mensaje
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const selectConversation = (convId: string) => {
    setSelectedConvId(convId);
    setLoadingMsgs(true);
    setMessages([]);
    loadMessages(convId);
  };  
  const handleSendMedia = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConvId) return;
    setSending(true);
    const msgText = newMessage.trim();
    setNewMessage('');
    try {
      let bodyPayload: any = {
        conversation_id: selectedConvId,
        content: msgText,
      };
      if (selectedFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(selectedFile);
        });
        bodyPayload.file_base64 = base64;
        bodyPayload.file_name = selectedFile.name;
        bodyPayload.file_type = selectedFile.type;
      }
      const res = await fetch(`${API_URL}/chatwoot/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        setSelectedFile(null);
        loadMessages(selectedConvId);
      }
    } catch (err) {
      console.error('Error enviando:', err);
    }
    setSending(false);
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'nota_de_voz.webm', { type: 'audio/webm' });
        setSelectedFile(audioFile);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accediendo al micrófono:', err);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const filtered = conversations.filter(c => {
    if (tab === 'unread' && !c.unread_count) return false;
    if (search) {
      const s = search.toLowerCase();
      return (c.name || '').toLowerCase().includes(s) ||
             (c.phone || '').includes(s);
    }
    return true;
  });
  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  const selectedConv = conversations.find(c => String(c.id) === selectedConvId);
  const formatTime = (ts: any) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'number' ? ts * 1000 : ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString();
  };
  const renderAttachment = (att: any) => {
    if (att.type === 'image') {
      return <img src={att.url || att.thumb} alt="imagen" className="max-w-[250px] rounded-xl mt-2 cursor-pointer hover:opacity-80" onClick={() => window.open(att.url, '_blank')} />;
    }
    if (att.type === 'audio') {
      return <audio controls src={att.url} className="mt-2 max-w-[250px]" />;
    }
    if (att.type === 'video') {
      return <video controls src={att.url} className="mt-2 max-w-[250px] rounded-xl" />;
    }
    // file / otros
    return (
      <a href={att.url} target="_blank" rel="noopener noreferrer"
         className="mt-2 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 text-xs text-indigo-400 hover:bg-white/10 transition-all">
        📎 Archivo adjunto
      </a>
    );
  };
  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-[#080B14] flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-bold text-lg mb-3">Chat en Vivo 💬</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contacto..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
          />
        </div>
        <div className="flex border-b border-white/5">
          <button onClick={() => setTab('all')}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              tab === 'all' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500'
            }`}>
            Todos ({conversations.length})
          </button>
          <button onClick={() => setTab('unread')}
            className={`flex-1 py-3 text-xs font-bold transition-all relative ${
              tab === 'unread' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500'
            }`}>
            Sin leer ({unreadTotal})
            {unreadTotal > 0 && <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="text-center py-8 text-gray-500 text-sm">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {tab === 'unread' ? 'Todo al día 🎉' : 'No hay conversaciones'}
            </div>
          ) : (
            filtered.map((conv, i) => (
              <div key={i} onClick={() => selectConversation(String(conv.id))}
                className={`px-4 py-3 cursor-pointer transition-all border-b border-white/[0.03] hover:bg-white/[0.03] ${
                  selectedConvId === String(conv.id) ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
                }`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-sm font-bold text-indigo-400">
                      {(conv.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">{conv.name || 'Sin nombre'}</p>
                      <span className="text-[10px] text-gray-600 ml-2 whitespace-nowrap">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{conv.last_message || conv.phone}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Panel de chat */}
      <div className="flex-1 flex flex-col bg-[#0B0F1A]">
        {!selectedConvId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl mb-4">💬</p>
              <h3 className="text-xl font-bold mb-2">Selecciona una conversación</h3>
              <p className="text-gray-500 text-sm">Elige un contacto de la lista para ver el chat</p>
            </div>
          </div>
        ) : loadingMsgs ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-[#080B14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-sm font-bold text-indigo-400">
                  {(selectedConv?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm">{selectedConv?.name || 'Sin nombre'}</p>
                  <p className="text-[11px] text-gray-500">{selectedConv?.phone || ''} · {selectedConv?.agent || 'Sin asignar'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedConv?.unread_count > 0 && (
                  <span className="text-[10px] px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
                    {selectedConv.unread_count} sin leer
                  </span>
                )}
                <span className="text-[10px] px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  ● En vivo
                </span>
              </div>
            </div>
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-6 py-4"
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 50%)' }}>
              {messages.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-3">
                  {messages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600/20 text-indigo-100 rounded-2xl rounded-tr-md'
                          : msg.private
                            ? 'bg-yellow-500/10 text-yellow-200 rounded-2xl rounded-tl-md border border-yellow-500/20'
                            : 'bg-white/[0.06] text-gray-300 rounded-2xl rounded-tl-md'
                      }`}>
                        {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                        {msg.attachments?.map((att: any, j: number) => (
                          <div key={j}>{renderAttachment(att)}</div>
                        ))}
                        <p className={`text-[9px] mt-1 ${
                          msg.role === 'user' ? 'text-indigo-400/50' : 'text-gray-600'
                        }`}>
                          {msg.role === 'user' ? '👤' : msg.private ? '🔒' : '💬'} {msg.sender_name || (msg.role === 'user' ? 'Cliente' : 'Asesor')}
                          {msg.created_at ? ` · ${formatTime(msg.created_at)}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm">No hay mensajes</p>
                </div>
              )}
            </div>
            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 bg-[#080B14]">
              {/* Preview de archivo seleccionado */}
              {selectedFile && (
                <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-lg">{selectedFile.type.startsWith('image/') ? '🖼️' : selectedFile.type.startsWith('audio/') ? '🎤' : '📎'}</span>
                  <span className="text-xs text-gray-400 truncate flex-1">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-red-400 text-xs font-bold hover:text-red-300">✕</button>
                </div>
              )}
              <div className="flex items-end gap-2 max-w-3xl mx-auto">
                {/* Botones de adjuntar */}
                <div className="flex gap-1 shrink-0">
                  <label className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-all" title="Imagen">
                    <span className="text-lg">🖼️</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])} />
                  </label>
                  <label className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-all" title="Archivo">
                    <span className="text-lg">📎</span>
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])} />
                  </label>                  
                </div>
                {/* Textarea */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMedia();
                      }
                    }}
                    placeholder={isRecording ? 'Grabando...' : 'Escribe un mensaje...'}
                    className="w-full bg-transparent outline-none text-sm text-white resize-none max-h-24"
                    rows={1}
                  />
                </div>
                {/* Botón enviar */}
                <button
                  onClick={handleSendMedia}
                  disabled={(!newMessage.trim() && !selectedFile) || sending}
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all disabled:opacity-30 shrink-0"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white text-lg">➤</span>
                  )}
                </button>
              </div>
              <p className="text-[9px] text-gray-600 text-center mt-2">
                {`${messages.length} mensajes · Enter enviar · 🖼️ imagen · 📎 archivo`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}