'use client';
import { useState, useMemo } from 'react';
import { useDemo } from '../DemoDataProvider';
const STAGES = [
  { key: 'nuevo', label: '🆕 Nuevo', color: 'border-slate-500/30 bg-slate-500/5', headerColor: 'text-slate-300' },
  { key: 'interesado', label: '🔥 Interesado', color: 'border-sky-500/30 bg-sky-500/5', headerColor: 'text-sky-300' },
  { key: 'negociacion', label: '🤝 Negociación', color: 'border-amber-500/30 bg-amber-500/5', headerColor: 'text-amber-300' },
  { key: 'cerrado_ganado', label: '✅ Ganado', color: 'border-emerald-500/30 bg-emerald-500/5', headerColor: 'text-emerald-300' },
];
const SCORE_COLORS = (s: number) => {
  if (s >= 80) return 'bg-emerald-500';
  if (s >= 60) return 'bg-sky-500';
  if (s >= 40) return 'bg-amber-500';
  return 'bg-slate-500';
};
const SOURCE_ICONS: Record<string, string> = {
  'Facebook Ads': '📘',
  'Instagram Ads': '📸',
  'Referido': '🤝',
  'Web': '🌐',
};
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
export default function DemoCRMPage() {
  const { leads, moveLeadStage, services, agents } = useDemo();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIInsight, setShowAIInsight] = useState(false);
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filterAgent !== 'all' && l.agent !== filterAgent) return false;
      if (filterSource !== 'all' && l.source !== filterSource) return false;
      if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [leads, filterAgent, filterSource, searchQuery]);
  const groupedLeads = useMemo(() => {
    const groups: Record<string, typeof leads> = {};
    STAGES.forEach(s => { groups[s.key] = []; });
    filteredLeads.forEach(l => {
      if (groups[l.stage]) groups[l.stage].push(l);
    });
    return groups;
  }, [filteredLeads]);
  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const ganados = filteredLeads.filter(l => l.stage === 'cerrado_ganado').length;
    const revenue = filteredLeads
      .filter(l => l.stage === 'cerrado_ganado')
      .reduce((s, l) => s + (l.amount || 0), 0);
    const avgScore = total > 0
      ? Math.round(filteredLeads.reduce((s, l) => s + l.score, 0) / total)
      : 0;
    return { total, ganados, revenue, avgScore };
  }, [filteredLeads]);
  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };
  const handleDragLeave = () => setDragOverStage(null);
  const handleDrop = (stage: string) => {
    if (draggedId) {
      moveLeadStage(draggedId, stage);
      setDraggedId(null);
      setDragOverStage(null);
    }
  };
  const selected = leads.find(l => l.id === selectedLead);
  const selectedService = selected ? services.find(s => s.slug === selected.service) : null;
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">CRM · Leads</h1>
          <p className="text-gray-400 text-sm">
            Arrastra y suelta los leads entre etapas · {stats.total} contactos · ${(stats.revenue / 1000).toFixed(0)}k USD facturados
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="text-xs px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
            + Nuevo lead
          </button>
          <button className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
            📥 Importar CSV
          </button>
          <button className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
            💰 Ventas Excel
          </button>
        </div>
      </div>
      {/* Stats compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Total leads</p>
          <p className="text-xl font-black text-indigo-400">{stats.total}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Cerrado ganado</p>
          <p className="text-xl font-black text-emerald-400">{stats.ganados}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Revenue</p>
          <p className="text-xl font-black text-purple-400">${(stats.revenue / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Score promedio IA</p>
          <p className="text-xl font-black text-yellow-400">{stats.avgScore}%</p>
        </div>
      </div>
      {/* Filtros */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Todos los agentes</option>
          {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          <option value="Sin asignar">Sin asignar</option>
        </select>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Todas las fuentes</option>
          <option value="Facebook Ads">📘 Facebook Ads</option>
          <option value="Instagram Ads">📸 Instagram Ads</option>
          <option value="Referido">🤝 Referido</option>
          <option value="Web">🌐 Web</option>
        </select>
      </div>
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {STAGES.map((stage) => {
          const stageLeads = groupedLeads[stage.key];
          const isHover = dragOverStage === stage.key;
          return (
            <div
              key={stage.key}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage.key)}
              className={`rounded-2xl border ${stage.color} p-3 min-h-[400px] transition-all ${
                isHover ? 'ring-2 ring-indigo-500 scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-black ${stage.headerColor}`}>{stage.label}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => setSelectedLead(lead.id)}
                    className="bg-[#0B0F1A] border border-white/10 rounded-xl p-3 cursor-move hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{lead.name}</p>
                        <p className="text-[9px] text-gray-500 truncate">{lead.phone}</p>
                      </div>
                      <span className="text-xs shrink-0" title={lead.source}>
                        {SOURCE_ICONS[lead.source] || '📱'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{lead.last_msg}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${SCORE_COLORS(lead.score)}`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold w-7 text-right">{lead.score}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <p className="text-[9px] text-gray-500 truncate">
                        {lead.agent === 'Sin asignar' ? '⚠️ Sin asignar' : `🧑‍💼 ${lead.agent.split(' ')[0]}`}
                      </p>
                      <p className="text-[9px] text-gray-600">{timeAgo(lead.last_at)}</p>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center py-6 text-[10px] text-gray-600">
                    Suelta un lead aquí
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Drawer detalle del lead seleccionado */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => { setSelectedLead(null); setShowAIInsight(false); }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-md bg-[#0B0F1A] border-l border-white/10 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 sticky top-0 bg-[#0B0F1A] z-10">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center text-base font-black text-indigo-400">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black truncate">{selected.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selected.phone}</p>
                    {selected.email && (
                      <p className="text-xs text-gray-500 truncate">{selected.email}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedLead(null); setShowAIInsight(false); }}
                  className="text-gray-500 hover:text-white text-2xl shrink-0"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  STAGES.find(s => s.key === selected.stage)?.color
                } ${STAGES.find(s => s.key === selected.stage)?.headerColor}`}>
                  {STAGES.find(s => s.key === selected.stage)?.label}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 font-bold">
                  {SOURCE_ICONS[selected.source]} {selected.source}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 font-bold">
                  📍 {selected.city}
                </span>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {/* Score IA */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">🧠 Score IA de cierre</p>
                  <span className="text-2xl font-black text-indigo-400">{selected.score}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${SCORE_COLORS(selected.score)}`}
                    style={{ width: `${selected.score}%` }}
                  />
                </div>
                <button
                  onClick={() => setShowAIInsight(!showAIInsight)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  {showAIInsight ? '▲ Ocultar análisis' : '▼ Ver análisis IA'}
                </button>
                {showAIInsight && (
                  <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      {selected.score >= 80
                        ? `💎 Lead caliente. Cliente con alta intención de compra: ya hizo preguntas específicas sobre precio y financiación, mencionó timing concreto. Recomendamos contacto inmediato del agente asignado.`
                        : selected.score >= 60
                        ? `🔥 Lead tibio. Ha mostrado interés genuino y respondió múltiples mensajes. La IA detectó dudas resolvibles. Recomendamos enviar caso de éxito + agendar visita en próximos 3 días.`
                        : selected.score >= 40
                        ? `⚡ Lead frío reactivable. Conversación inicial sin compromiso fuerte. Recomendamos secuencia de remarketing automática con beneficios diferenciadores.`
                        : `🆕 Lead recién captado. Sin información suficiente todavía. El bot está calificando con preguntas inteligentes. Espera 24h para reanalizar.`
                      }
                    </p>
                  </div>
                )}
              </div>
              {/* Servicio de interés */}
              {selectedService && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Servicio de interés</p>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{selectedService.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{selectedService.name}</p>
                      <p className="text-[10px] text-gray-500">${selectedService.price.toLocaleString()} USD</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Último mensaje */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Último mensaje</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-300 italic">"{selected.last_msg}"</p>
                  <p className="text-[10px] text-gray-600 mt-2">hace {timeAgo(selected.last_at)}</p>
                </div>
              </div>
              {/* Agente asignado */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Agente asignado</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  {selected.agent === 'Sin asignar' ? (
                    <>
                      <span className="text-xl">⚠️</span>
                      <p className="text-xs text-amber-400 font-bold flex-1">Sin asignar</p>
                      <button className="text-[10px] px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg">
                        Asignar
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {selected.agent.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{selected.agent}</p>
                        <p className="text-[10px] text-gray-500">Asignado por round-robin</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Atribución */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">🎯 Atribución completa</p>
                <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Fuente</span>
                    <span className="font-bold text-purple-400">{SOURCE_ICONS[selected.source]} {selected.source}</span>
                  </div>
                  {selected.source.includes('Ads') && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Campaña</span>
                        <span className="font-bold text-white truncate ml-2">Aurora Park — Fase 2</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Click ID</span>
                        <span className="font-mono text-[9px] text-gray-500 truncate ml-2">fb.1.{Math.floor(new Date(selected.last_at).getTime() / 1000)}.{selected.id}xyz</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Costo lead</span>
                        <span className="font-bold text-yellow-400">~$58 USD</span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <span className="text-[10px]">💡</span>
                    <p className="text-[10px] text-gray-400 italic">
                      Datos enviados a Meta automáticamente para mejorar tus anuncios
                    </p>
                  </div>
                </div>
              </div>
              {/* Acciones */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Acciones rápidas</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="text-[11px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                    💬 Abrir chat
                  </button>
                  <button className="text-[11px] py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
                    📅 Agendar cita
                  </button>
                  <button className="text-[11px] py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all">
                    💳 Enviar link pago
                  </button>
                  <button className="text-[11px] py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-all">
                    📤 Reportar venta
                  </button>
                  <button className="text-[11px] py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all col-span-2">
                    🏷️ Etiquetas y notas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Footer educativo */}
      <div className="mt-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-emerald-500/5 border border-indigo-500/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">
              Esto es lo que vas a ver al activar tu plan
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cada lead que entra a tu negocio se organiza solo en este Kanban. La IA puntúa la probabilidad de cierre, asigna agente, captura datos completos y los envía a Meta para que tus anuncios aprendan de ventas reales — no solo de clics. <span className="text-indigo-400 font-bold">Tu equipo cierra más, en menos tiempo.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}