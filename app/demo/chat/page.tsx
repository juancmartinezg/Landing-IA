'use client';
import { useState, useRef, useEffect } from 'react';
import { useDemo } from '../DemoDataProvider';
const CHANNEL_ICONS: Record<string, string> = {
  whatsapp: '💚',
  instagram: '📸',
  facebook: '📘',
};
const FLOW_STATE_LABELS: Record<string, { label: string; color: string; pulse: boolean }> = {
  CHAT_MODE: { label: '🤖 Bot atendiendo', color: 'bg-emerald-500/20 text-emerald-400', pulse: true },
  PAUSED_FOR_HUMAN: { label: '🙋 Con humano', color: 'bg-red-500/20 text-red-400', pulse: true },
  AWAITING_CHANNEL_CHOICE: { label: '⏳ Esperando elección', color: 'bg-yellow-500/20 text-yellow-400', pulse: false },
};
function timeShort(iso: string) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${Math.floor(diff / 86400)}d`;
}
export default function DemoChatPage() {
  const { conversations, sendMockMessage, leads, services } = useDemo();
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'human' | 'bot'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeadInfo, setShowLeadInfo] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedConv = conversations.find(c => c.id === selectedConvId);
  const selectedLead = selectedConv ? leads.find(l => l.id === selectedConv.lead_id) : null;
  const selectedService = selectedLead?.service ? services.find(s => s.slug === selectedLead.service) : null;
  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages.length]);
  const filteredConvs = conversations.filter(c => {
    if (filter === 'human' && c.flow_state !== 'PAUSED_FOR_HUMAN') return false;
    if (filter === 'bot' && c.flow_state !== 'CHAT_MODE') return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const handleSend = () => {
    if (!messageInput.trim() || !selectedConv) return;
    const text = messageInput.trim();
    sendMockMessage(selectedConv.id, text, 'agent');
    setMessageInput('');
    
    // Simular respuesta automática del cliente tras 1.5s (demo realista)
    setTimeout(() => {
      setIsTyping(true);
    }, 1500);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        '¡Perfecto, gracias!',
        'Suena bien, lo voy a pensar 🙂',
        'OK, mándame los detalles por favor',
        '¿A qué hora puedes mañana?',
        'Excelente, esperaba esa respuesta',
      ];
      const randomResp = responses[Math.floor(Math.random() * responses.length)];
      sendMockMessage(selectedConv.id, randomResp, 'user');
    }, 4500);
  };
  const counts = {
    all: conversations.length,
    human: conversations.filter(c => c.flow_state === 'PAUSED_FOR_HUMAN').length,
    bot: conversations.filter(c => c.flow_state === 'CHAT_MODE').length,
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">💬 Conversaciones</h1>
          <p className="text-gray-400 text-sm">
            Bandeja unificada · WhatsApp + Instagram + Facebook · {counts.human} requieren atención humana
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {counts.bot} bot · {counts.human} humano
        </div>
      </div>
      {/* Layout 3 paneles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Panel 1: Lista de conversaciones */}
        <div className="md:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          {/* Filtros */}
          <div className="p-3 border-b border-white/5">
            <input
              type="text"
              placeholder="🔍 Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 mb-2"
            />
            <div className="flex gap-1">
              {[
                { key: 'all', label: `Todas (${counts.all})` },
                { key: 'human', label: `🙋 (${counts.human})`, hot: counts.human > 0 },
                { key: 'bot', label: `🤖 (${counts.bot})` },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${
                    filter === f.key
                      ? 'bg-indigo-600 text-white'
                      : f.hot
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((c) => {
              const isActive = c.id === selectedConvId;
              const lastMsg = c.messages[c.messages.length - 1];
              const stateData = FLOW_STATE_LABELS[c.flow_state];
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`w-full text-left p-3 border-b border-white/5 transition-all ${
                    isActive ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-black text-emerald-400">
                        {c.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 text-xs">
                        {CHANNEL_ICONS.whatsapp}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold truncate">{c.name}</p>
                        <span className="text-[9px] text-gray-500 shrink-0">{timeShort(c.last_at)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate mb-1">{lastMsg?.text}</p>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${stateData.color} truncate`}>
                          {stateData.label}
                        </span>
                        {c.unread > 0 && (
                          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredConvs.length === 0 && (
              <div className="p-8 text-center text-[10px] text-gray-600">
                Sin conversaciones que coincidan
              </div>
            )}
          </div>
        </div>
        {/* Panel 2: Chat activo */}
        <div className={`${showLeadInfo ? 'md:col-span-6' : 'md:col-span-9'} bg-[#0a0e18] border border-white/5 rounded-2xl flex flex-col overflow-hidden`}>
          {selectedConv ? (
            <>
              {/* Header chat */}
              <div className="p-3 border-b border-white/5 bg-[#080B14] flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-black text-emerald-400">
                    {selectedConv.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 text-xs">{CHANNEL_ICONS.whatsapp}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{selectedConv.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{selectedConv.phone}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${FLOW_STATE_LABELS[selectedConv.flow_state].color}`}>
                      {FLOW_STATE_LABELS[selectedConv.flow_state].label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {selectedConv.flow_state === 'CHAT_MODE' && (
                    <button className="text-[10px] px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg transition-all whitespace-nowrap">
                      🙋 Tomar control
                    </button>
                  )}
                  {selectedConv.flow_state === 'PAUSED_FOR_HUMAN' && (
                    <button className="text-[10px] px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg transition-all whitespace-nowrap">
                      🤖 Devolver al bot
                    </button>
                  )}
                  <button
                    onClick={() => setShowLeadInfo(!showLeadInfo)}
                    className="text-[10px] px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-lg transition-all"
                  >
                    {showLeadInfo ? '→' : '👤'}
                  </button>
                </div>
              </div>
              {/* Banner contexto si está pausado */}
              {selectedConv.flow_state === 'PAUSED_FOR_HUMAN' && selectedConv.assigned_agent && (
                <div className="bg-red-500/10 border-b border-red-500/20 px-3 py-2 text-[10px] text-red-300 flex items-center gap-2">
                  <span className="text-sm">🙋</span>
                  <span>Atendiendo: <strong>{selectedConv.assigned_agent}</strong> · El bot está pausado en esta conversación</span>
                </div>
              )}
              {/* Mensajes — fondo estilo WhatsApp */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-2"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              >
                {selectedConv.messages.map((m: any, i: number) => {
                  const isUser = m.from === 'user';
                  const isBot = m.from === 'bot';
                  const isAgent = m.from === 'agent';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                        isUser
                          ? 'bg-[#1a1f2e] rounded-tl-sm'
                          : isBot
                          ? 'bg-[#005c4b] rounded-tr-sm'
                          : 'bg-indigo-600/80 rounded-tr-sm'
                      }`}>
                        {isBot && (
                          <p className="text-[9px] text-emerald-300 font-black mb-0.5">🤖 Bot IA</p>
                        )}
                        {isAgent && m.agent_name && (
                          <p className="text-[9px] text-indigo-200 font-black mb-0.5">🙋 {m.agent_name}</p>
                        )}
                        <p className="text-xs text-white whitespace-pre-wrap">{m.text}</p>
                        <p className={`text-[9px] mt-1 text-right ${isUser ? 'text-gray-500' : 'text-white/60'}`}>
                          {timeShort(m.at)} {!isUser && '✓✓'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1f2e] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t border-white/5 bg-[#080B14]">
                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:text-white text-lg shrink-0" title="Adjuntar">📎</button>
                  <button className="text-gray-500 hover:text-white text-lg shrink-0" title="Plantillas">📋</button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="text-[10px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-gray-600 text-white font-black rounded-xl transition-all shrink-0"
                  >
                    Enviar
                  </button>
                </div>
                <p className="text-[9px] text-gray-600 mt-2 text-center">
                  💡 Al escribir como agente, el bot pausa automáticamente esta conversación
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              Selecciona una conversación
            </div>
          )}
        </div>
        {/* Panel 3: Info del lead */}
        {showLeadInfo && selectedLead && (
          <div className="hidden md:flex md:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/20 flex items-center justify-center text-lg font-black text-indigo-400 mb-2">
                {selectedLead.name.charAt(0)}
              </div>
              <p className="text-sm font-black truncate">{selectedLead.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{selectedLead.phone}</p>
              {selectedLead.email && (
                <p className="text-[10px] text-gray-500 truncate">{selectedLead.email}</p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Score IA */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] text-indigo-400 uppercase tracking-widest font-black">🧠 Score IA</p>
                  <span className="text-base font-black text-indigo-400">{selectedLead.score}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedLead.score >= 80 ? 'bg-emerald-500' :
                      selectedLead.score >= 60 ? 'bg-sky-500' :
                      selectedLead.score >= 40 ? 'bg-amber-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${selectedLead.score}%` }}
                  />
                </div>
              </div>
              {/* Etapa */}
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">Etapa</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5">
                  <p className="text-xs font-bold capitalize">{selectedLead.stage.replace('_', ' ')}</p>
                </div>
              </div>
              {/* Servicio */}
              {selectedService && (
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">Interés</p>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
                    <span className="text-lg">{selectedService.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{selectedService.name}</p>
                      <p className="text-[10px] text-emerald-400 font-bold">${selectedService.price.toLocaleString()} USD</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Atribución */}
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">🎯 Origen</p>
                <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-2.5 space-y-1.5">
                  <p className="text-[11px] font-bold text-purple-300">{selectedLead.source}</p>
                  <p className="text-[10px] text-gray-500">📍 {selectedLead.city}</p>
                  {selectedLead.source.includes('Ads') && (
                    <p className="text-[10px] text-gray-500 truncate">Campaña: Aurora Park — Fase 2</p>
                  )}
                </div>
              </div>
              {/* Agente */}
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">Agente</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5">
                  <p className="text-xs font-bold">
                    {selectedLead.agent === 'Sin asignar' ? '⚠️ Sin asignar' : `🧑‍💼 ${selectedLead.agent}`}
                  </p>
                </div>
              </div>
              {/* Acciones rápidas */}
              <div className="space-y-2">
                <button className="w-full text-[10px] py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all">
                  📅 Agendar cita
                </button>
                <button className="w-full text-[10px] py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all">
                  💳 Enviar link de pago
                </button>
                <button className="w-full text-[10px] py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-lg transition-all">
                  🏷️ Etiquetas y notas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer educativo */}
      <div className="mt-4 bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-purple-500/5 border border-emerald-500/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💬</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">
              Tu bandeja única, multi-canal y con IA en vivo
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              WhatsApp, Instagram y Facebook en una sola pantalla. La IA atiende sola, transfiere a humano cuando hace falta, y cuando un agente escribe el bot se pausa automáticamente — sin choques, sin duplicados. <span className="text-emerald-400 font-bold">Tu equipo deja de saltar entre apps.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}