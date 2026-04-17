'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function ChatPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'bot' | 'agent'>('bot');
  // === Bot conversations ===
  const [botConvs, setBotConvs] = useState<any[]>([]);
  const [loadingBot, setLoadingBot] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [botMessages, setBotMessages] = useState<any[]>([]);
  const [loadingBotMsgs, setLoadingBotMsgs] = useState(false);
  // === Chatwoot conversations ===
  const [cwConvs, setCwConvs] = useState<any[]>([]);
  const [loadingCw, setLoadingCw] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [cwMessages, setCwMessages] = useState<any[]>([]);
  const [loadingCwMsgs, setLoadingCwMsgs] = useState(false);
  // === Shared ===
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [takenOver, setTakenOver] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  // Cargar conversaciones del bot
  const loadBotConvs = () => {
    fetch(`${API_URL}/conversations/active`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setBotConvs(data.conversations || []); setLoadingBot(false); })
      .catch(() => setLoadingBot(false));
  };
  // Cargar mensajes de una conversacion del bot
  const loadBotMessages = (phone: string, isPolling = false) => {
    if (!isPolling) setLoadingBotMsgs(true);
    fetch(`${API_URL}/conversations?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        const msgs = data.messages || [];
        setBotMessages(prev => prev.length !== msgs.length ? msgs : prev);
        setLoadingBotMsgs(false);
      })
      .catch(() => setLoadingBotMsgs(false));
  };
  // Cargar conversaciones que necesitan asesor (PAUSED_FOR_HUMAN)
  const loadCwConvs = () => {
    // Filtrar del tab Bot las que están en PAUSED_FOR_HUMAN
    const paused = botConvs.filter(c => c.flow_state === 'PAUSED_FOR_HUMAN');
    setCwConvs(paused);
    setLoadingCw(false);
  };
  // Cargar mensajes de Chatwoot
  const loadCwMessages = (convId: string, isPolling = false) => {
    if (!isPolling) setLoadingCwMsgs(true);
    fetch(`${API_URL}/chatwoot/messages?conversation_id=${convId}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        const msgs = data.messages || [];
        setCwMessages(prev => prev.length !== msgs.length ? msgs : prev);
        setLoadingCwMsgs(false);
      })
      .catch(() => setLoadingCwMsgs(false));
  };
  // Inicial
  useEffect(() => {
    loadBotConvs();
    loadCwConvs();
    const interval = setInterval(() => {
      if (tab === 'bot') loadBotConvs();
      else loadCwConvs();
    }, 5000);
    return () => clearInterval(interval);
  }, [tab]);
  // Auto-refresh mensajes
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (tab === 'bot' && selectedPhone) {
      pollRef.current = setInterval(() => loadBotMessages(selectedPhone, true), 5000);
    } else if (tab === 'agent' && selectedConvId) {
      pollRef.current = setInterval(() => loadCwMessages(selectedConvId, true), 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [tab, selectedPhone, selectedConvId]);
  // Scroll al ultimo mensaje
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, cwMessages]);
  const selectBotConv = (phone: string) => {
    setSelectedPhone(phone);
    setSelectedConvId(null);
    setBotMessages([]);
    const conv = botConvs.find(c => c.phone === phone);
    setTakenOver(conv?.flow_state === 'PAUSED_FOR_HUMAN');
    setNewMessage('');
    loadBotMessages(phone);
    setMobileView('chat');
  };
  const selectCwConv = (convId: string) => {
    // convId aquí es el phone de la conversación pausada
    setSelectedPhone(convId);
    setSelectedConvId(null);
    setBotMessages([]);
    setTakenOver(true);
    loadBotMessages(convId);
    setMobileView('chat');
  };
  const goBackToList = () => {
    setMobileView('list');
  };
  const formatMsgTime = (ts: any) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'number' ? (ts > 1e12 ? ts : ts * 1000) : ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const getDateLabel = (ts: any) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'number' ? (ts > 1e12 ? ts : ts * 1000) : ts);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (msgDate.getTime() === today.getTime()) return 'Hoy';
    if (msgDate.getTime() === yesterday.getTime()) return 'Ayer';
    return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const getAvatarColor = (id: string) => {
    const colors = ['bg-emerald-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-amber-600', 'bg-cyan-600', 'bg-rose-600', 'bg-teal-600'];
    let hash = 0;
    for (let i = 0; i < (id || '').length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };
  const handleSendFile = async (file: File) => {
    if (!file) return;
    // En tab agent, enviar por Chatwoot
    if (tab === 'agent' && !selectedConvId) return;
    // En tab bot con takeover, subir a S3 y enviar URL por WhatsApp
    if (tab === 'bot') {
      if (!selectedPhone || !takenOver) return;
      setSending(true);
      try {
        const res = await fetch(`${API_URL}/upload-url?file_name=${encodeURIComponent(file.name)}&folder=chat`, {
          headers: { 'client-id': user?.companyId || '' }
        });
        const data = await res.json();
        if (data.upload_url) {
          await fetch(data.upload_url, { method: 'PUT', headers: { 'Content-Type': data.content_type }, body: file });
          await fetch(`${API_URL}/conversations/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
            body: JSON.stringify({ phone: selectedPhone, content: `📎 ${file.name}\n${data.public_url}` }),
          });
          loadBotMessages(selectedPhone);
        }
      } catch (err) { console.error('Error enviando archivo:', err); }
      setSending(false);
      return;
    }
    if (tab !== 'agent' || !selectedConvId) return;
    setSending(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await fetch(`${API_URL}/chatwoot/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
          body: JSON.stringify({
            conversation_id: selectedConvId,
            content: newMessage.trim() || '',
            file_base64: base64,
            file_name: file.name,
            file_type: file.type,
          }),
        });
        setNewMessage('');
        loadCwMessages(selectedConvId);
        setSending(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error enviando archivo:', err);
      setSending(false);
    }
  };
  // Enviar mensaje por Chatwoot
  const handleSendCw = async () => {
    if (!newMessage.trim() || !selectedConvId) return;
    setSending(true);
    const msg = newMessage.trim();
    setNewMessage('');
    try {
      await fetch(`${API_URL}/chatwoot/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ conversation_id: selectedConvId, content: msg }),
      });
      loadCwMessages(selectedConvId);
    } catch (err) {
      console.error('Error enviando:', err);
    }
    setSending(false);
  };
  // === Takeover: asesor toma/devuelve control ===
  const handleTakeover = async (phone: string) => {
    try {
      await fetch(`${API_URL}/conversations/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ phone }),
      });
      setTakenOver(true);
      loadBotConvs();
    } catch (err) { console.error('Error takeover:', err); }
  };
  const handleRelease = async (phone: string) => {
    try {
      await fetch(`${API_URL}/conversations/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ phone }),
      });
      setTakenOver(false);
      setNewMessage('');
      loadBotConvs();
    } catch (err) { console.error('Error release:', err); }
  };
  const handleSendBot = async () => {
    if (!newMessage.trim() || !selectedPhone) return;
    setSending(true);
    const msg = newMessage.trim();
    setNewMessage('');
    try {
      await fetch(`${API_URL}/conversations/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ phone: selectedPhone, content: msg }),
      });
      loadBotMessages(selectedPhone);
    } catch (err) { console.error('Error send:', err); }
    setSending(false);
  };
  const formatTime = (ts: any) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'number' ? (ts > 1e12 ? ts : ts * 1000) : ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString();
  };
  const stateLabel = (state: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'CHAT_MODE': { label: 'Chateando', color: 'bg-emerald-500/20 text-emerald-400' },
      'PAUSED_FOR_HUMAN': { label: 'Con asesor', color: 'bg-yellow-500/20 text-yellow-400' },
      'AWAITING_CHANNEL_CHOICE': { label: 'Eligiendo', color: 'bg-indigo-500/20 text-indigo-400' },
      'SCHEDULING_FLOW': { label: 'Agendando', color: 'bg-purple-500/20 text-purple-400' },
    };
    return map[state] || { label: state || 'Activo', color: 'bg-gray-500/20 text-gray-400' };
  };
  // Filtrar conversaciones
  const filteredBot = botConvs.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.name || '').toLowerCase().includes(s) || (c.phone || '').includes(s);
  });
  const filteredCw = cwConvs.filter(c => {
    // Solo mostrar conversaciones con mensajes no leídos o de las últimas 24h
    const hasUnread = (c.unread_count || 0) > 0;
    const isRecent = c.last_message_at && (Date.now() - new Date(typeof c.last_message_at === 'number' ? c.last_message_at * 1000 : c.last_message_at).getTime()) < 86400000;
    if (!hasUnread && !isRecent) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.name || '').toLowerCase().includes(s) || (c.phone || '').includes(s);
  });
  // Mensajes activos segun tab
  const activeMessages = tab === 'bot' ? botMessages : cwMessages;
  const isLoadingMsgs = tab === 'bot' ? loadingBotMsgs : loadingCwMsgs;
  const hasSelection = tab === 'bot' ? !!selectedPhone : !!selectedConvId;
  const selectedName = tab === 'bot'
    ? (botConvs.find(c => c.phone === selectedPhone)?.name || selectedPhone || '')
    : (cwConvs.find(c => String(c.id) === selectedConvId)?.name || '');
  const selectedDetail = tab === 'bot'
    ? (botConvs.find(c => c.phone === selectedPhone)?.phone || '')
    : (cwConvs.find(c => String(c.id) === selectedConvId)?.phone || '');
   return (       
       <div className="flex overflow-hidden fixed top-[5.5rem] left-0 right-0 bottom-4 md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:-m-6 md:h-[calc(100vh-7rem)] bg-[#0B0F1A] z-10">
      {/* Sidebar — oculto en móvil cuando hay chat abierto */}
      <div className={`w-full md:w-80 border-r border-white/5 bg-[#080B14] flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
         <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-bold text-lg mb-3">Conversaciones 💬</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contacto..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
          />
        </div>
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button onClick={() => setTab('bot')}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              tab === 'bot' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'
            }`}>
            💬 Chats ({botConvs.length})
          </button>
          <button onClick={() => setTab('agent')}
            className={`flex-1 py-3 text-xs font-bold transition-all relative ${
              tab === 'agent' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500'
            }`}>
            🙋 En vivo ({cwConvs.filter(c => c.unread_count > 0).length})
            {cwConvs.reduce((sum, c) => sum + (c.unread_count || 0), 0) > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'bot' ? (
            loadingBot ? (
              <div className="space-y-1 p-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
                    <div className="w-10 h-10 bg-white/5 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-full" />
                      <div className="h-2 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBot.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No hay conversaciones activas</div>
            ) : (
              filteredBot.map((conv, i) => {
                const st = stateLabel(conv.flow_state);
                return (
                   <div key={i} onClick={() => selectBotConv(conv.phone)}
                    className={`px-4 md:px-4 py-3 cursor-pointer transition-all border-b border-white/[0.03] hover:bg-white/[0.03] ${
                      selectedPhone === conv.phone ? 'bg-indigo-600/10 border-l-2 border-l-emerald-500' : ''
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600/20 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-emerald-400 shrink-0">
                        {(conv.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-sm font-medium truncate flex-1 min-w-0">{conv.name || 'Sin nombre'}</p>
                          <span className="text-[10px] text-gray-600 shrink-0 whitespace-nowrap">{formatTime(conv.last_interaction)}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{conv.last_user_msg || conv.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                          <span className="text-[9px] text-gray-600">{conv.message_count} msgs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            loadingCw ? (
              <div className="space-y-1 p-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
                    <div className="w-10 h-10 bg-white/5 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-full" />
                      <div className="h-2 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCw.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No hay conversaciones con asesor</div>
            ) : (
              filteredCw.map((conv, i) => (
                <div key={i} onClick={() => selectCwConv(conv.phone)}
                  className={`px-4 md:px-4 py-3 cursor-pointer transition-all border-b border-white/[0.03] hover:bg-white/[0.03] ${
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
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-sm font-medium truncate flex-1 min-w-0">{conv.name || 'Sin nombre'}</p>
                        <span className="text-[10px] text-gray-600 shrink-0 whitespace-nowrap">{formatTime(conv.last_message_at)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-[200px] md:max-w-none">{conv.last_message || conv.phone}</p>
                      <span className="text-[9px] text-indigo-400 truncate">{conv.agent || 'Sin asignar'}</span>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
      {/* Panel de chat — fullscreen en móvil */}
      <div className={`flex-1 flex flex-col bg-[#0B0F1A] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {!hasSelection ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl mb-4">💬</p>
              <h3 className="text-xl font-bold mb-2">Selecciona una conversación</h3>
              <p className="text-gray-500 text-sm">Elige un contacto de la lista para ver el chat</p>
            </div>
          </div>
        ) : isLoadingMsgs ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header */}
           <div className="h-14 md:h-16 px-4 md:px-6 border-b border-white/5 flex items-center justify-between bg-[#080B14]">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button onClick={goBackToList} className="md:hidden text-gray-400 hover:text-white text-2xl shrink-0 pl-1">←</button>
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  tab === 'bot' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-indigo-600/20 text-indigo-400'
                }`}>
                  {(selectedName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{selectedName || 'Sin nombre'}</p>
                  <p className="text-[10px] md:text-[11px] text-gray-500 truncate">{selectedDetail}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                {tab === 'bot' && selectedPhone && (
                  takenOver ? (
                    <button onClick={() => handleRelease(selectedPhone)}
                      className="text-[9px] md:text-[10px] px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 font-bold transition-all">
                      🤖 <span className="hidden sm:inline">Devolver al </span>bot
                    </button>
                  ) : (
                    <button onClick={() => handleTakeover(selectedPhone)}
                      className="text-[9px] md:text-[10px] px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 font-bold transition-all">
                      🙋 <span className="hidden sm:inline">Tomar </span>control
                    </button>
                  )
                )}
                <span className={`text-[9px] md:text-[10px] px-2 md:px-3 py-1 rounded-full hidden sm:inline-flex ${
                  tab === 'bot' ? (takenOver ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400') : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {tab === 'bot' ? (takenOver ? '🙋 Asesor' : '🤖 Bot') : '🙋 Asesor'}
                </span>
              </div>
            </div>
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-6 py-4"
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 50%)' }}>
              {activeMessages.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-1">
                  {activeMessages.map((msg: any, i: number) => {
                    const msgTs = msg.ts || msg.created_at;
                    const prevTs = i > 0 ? (activeMessages[i-1].ts || activeMessages[i-1].created_at) : null;
                    const currentLabel = getDateLabel(msgTs);
                    const prevLabel = getDateLabel(prevTs);
                    const showDateSep = currentLabel && currentLabel !== prevLabel;
                    const timeStr = formatMsgTime(msgTs);
                    const isUser = msg.role === 'user';
                    const isHuman = (msg.text || msg.content || '').startsWith('[Asesor');
                    return (
                      <div key={i}>
                        {showDateSep && (
                          <div className="flex justify-center my-4">
                            <span className="bg-[#1a1f2e] text-[10px] text-gray-500 px-4 py-1.5 rounded-full font-medium shadow-sm">
                              {currentLabel}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}>
                          <div className={`max-w-[80%] md:max-w-[65%] px-3 py-2 text-[13px] md:text-sm leading-relaxed relative ${
                            isUser
                              ? 'bg-[#005c4b] text-white rounded-xl rounded-tr-sm'
                              : msg.private
                                ? 'bg-yellow-500/10 text-yellow-200 rounded-xl rounded-tl-sm border border-yellow-500/20'
                                : isHuman
                                  ? 'bg-[#1a2236] text-blue-100 rounded-xl rounded-tl-sm border border-blue-500/20'
                                  : 'bg-[#1a1f2e] text-gray-200 rounded-xl rounded-tl-sm'
                          }`}>
                            {!isUser && (
                              <p className={`text-[10px] font-bold mb-0.5 ${
                                isHuman ? 'text-blue-400' : msg.private ? 'text-yellow-400' : 'text-emerald-400'
                              }`}>
                                {isHuman ? '🙋 Asesor' : msg.private ? '🔒 Nota privada' : '🤖 Bot'}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap pr-12">{msg.text || msg.content || ''}</p>
                            <span className={`absolute bottom-1.5 right-3 text-[9px] ${
                              isUser ? 'text-white/40' : 'text-gray-600'
                            }`}>
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm">No hay mensajes</p>
                </div>
              )}
            </div>
            {/* Input - solo para Chatwoot */}
            {tab === 'agent' && selectedConvId && (
              <div className="px-4 py-3 border-t border-white/5 bg-[#080B14]">
                <div className="flex items-end gap-2 max-w-3xl mx-auto">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendCw();
                        }
                      }}
                      placeholder="Responder como asesor..."
                      className="w-full bg-transparent outline-none text-sm text-white resize-none max-h-24"
                      rows={1}
                    />
                  </div>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all shrink-0">
                    <span className="text-gray-400 text-lg">📎</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.zip" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSendFile(f); e.target.value = ''; }} />
                  <button
                    onClick={handleSendCw}
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all disabled:opacity-30 shrink-0"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-white text-lg">➤</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* Input para tab Bot cuando asesor tiene control */}
            {tab === 'bot' && takenOver && selectedPhone && (
              <div className="px-4 py-3 border-t border-yellow-500/20 bg-[#080B14]">
                <div className="flex items-end gap-2 max-w-3xl mx-auto">
                  <div className="flex-1 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl px-4 py-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendBot();
                        }
                      }}
                      placeholder="Escribir como asesor..."
                      className="w-full bg-transparent outline-none text-sm text-white resize-none max-h-24"
                      rows={1}
                    />
                  </div>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all shrink-0">
                    <span className="text-gray-400 text-lg">📎</span>
                  </button>
                  <button
                    onClick={handleSendBot}
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 bg-yellow-600 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all disabled:opacity-30 shrink-0"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-white text-lg">➤</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* Info para tab Bot cuando bot tiene control */}
            {tab === 'bot' && !takenOver && (
              <div className="px-4 py-3 border-t border-white/5 bg-[#080B14] text-center">
                <p className="text-[10px] text-gray-600">Esta conversación es manejada por el bot • Haz clic en "Tomar control" para intervenir</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}