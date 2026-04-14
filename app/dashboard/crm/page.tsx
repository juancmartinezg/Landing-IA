'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function CRMPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [newTag, setNewTag] = useState('');
  useEffect(() => {
    fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        const items = data.leads || [];
        setLeads(items);
        setFiltered(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    let result = leads;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(l =>
        (l.customer_name || '').toLowerCase().includes(s) ||
        (l.phoneNumber || '').includes(s) ||
        (l.service_of_interest || '').toLowerCase().includes(s)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(l => l.lead_status === filterStatus);
    }
    if (filterTag !== 'all') {
      result = result.filter(l => (l.tags || []).includes(filterTag));
    }
    setFiltered(result);
  }, [search, filterStatus, filterTag, leads]);
  const loadDetail = (phone: string) => {
    fetch(`${API_URL}/leads?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setSelectedLead(data));
    setAiInsight(null);
  };
  const loadAiInsight = (phone: string) => {
    setLoadingAi(true);
    fetch(`${API_URL}/leads/ai-insight?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setAiInsight(data); setLoadingAi(false); })
      .catch(() => setLoadingAi(false));
  };
  const allTags = [...new Set(leads.flatMap(l => l.tags || []))];
  const statuses = [...new Set(leads.map(l => l.lead_status).filter(Boolean))];
  const updateTags = async (phone: string, action: string, tags: string[]) => {
    await fetch(`${API_URL}/leads/tags`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      body: JSON.stringify({ phone, action, tags }),
    });
    loadDetail(phone);
    // Actualizar lista
    fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json()).then(data => setLeads(data.leads || []));
  };
  const updateStage = async (phone: string, stage: string) => {
    await fetch(`${API_URL}/leads/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      body: JSON.stringify({ phone, stage }),
    });
    loadDetail(phone);
    fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json()).then(data => setLeads(data.leads || []));
  };
  const exportCSV = () => {
    const headers = 'Nombre,Telefono,Estado,Servicio,Visitas\n';
    const rows = filtered.map(l =>
      `${l.customer_name || ''},${l.phoneNumber || ''},${l.lead_status || ''},${l.service_of_interest || ''},${l.visit_count || 0}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM / Leads 👥</h1>
        <button onClick={exportCSV} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          📥 Exportar CSV
        </button>
      </div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, telefono o servicio..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        >
          <option value="all">Todos los estados</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        >
          <option value="all">Todos los tags</option>
          {allTags.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Leads */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-500 mb-2">{filtered.length} leads encontrados</div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando leads...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay leads con esos filtros</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.map((lead, i) => (
                <div
                  key={i}
                  onClick={() => loadDetail(lead.phoneNumber)}
                  className={`bg-white/[0.03] border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedLead?.lead?.phoneNumber === lead.phoneNumber ? 'border-indigo-500 bg-indigo-600/5' : 'border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-sm font-bold text-indigo-400">
                      {(lead.customer_name || 'U').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{lead.customer_name || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-500">{lead.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-3 py-1 rounded-full ${
                      lead.lead_status === 'INTENCION DE COMPRA' ? 'bg-emerald-500/20 text-emerald-400' :
                      lead.lead_status === 'INTERESADO' ? 'bg-indigo-500/20 text-indigo-400' :
                      lead.lead_status === 'DEMO' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {lead.lead_status || 'Nuevo'}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{lead.service_of_interest || ''}</p>
                    <p className="text-[10px] text-gray-600">Visitas: {lead.visit_count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Detalle del Lead */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sticky top-20">
          {selectedLead ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg font-bold text-indigo-400">
                  {(selectedLead.lead?.customer_name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{selectedLead.lead?.customer_name || 'Sin nombre'}</h3>
                  <p className="text-xs text-gray-500">{selectedLead.lead?.phoneNumber}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="font-medium">{selectedLead.lead?.lead_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interes</span>
                  <span className="font-medium">{selectedLead.lead?.service_of_interest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visitas</span>
                  <span className="font-medium">{selectedLead.lead?.visit_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sesion</span>
                  <span className="font-medium">{selectedLead.session_state || '-'}</span>
                </div>
              </div>
              
              {/* Score + Stage + Tags manuales */}
              <div className="mb-4 pt-4 border-t border-white/5">
                {/* Etapa del pipeline */}
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Etapa</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'nuevo', label: '🆕 Nuevo', color: 'gray' },
                      { id: 'contactado', label: '📞 Contactado', color: 'blue' },
                      { id: 'interesado', label: '🔥 Interesado', color: 'yellow' },
                      { id: 'negociacion', label: '🤝 Negociación', color: 'purple' },
                      { id: 'cerrado_ganado', label: '✅ Ganado', color: 'green' },
                      { id: 'cerrado_perdido', label: '❌ Perdido', color: 'red' },
                    ].map(s => (
                      <button key={s.id} onClick={() => updateStage(selectedLead.lead?.phoneNumber, s.id)}
                        className={`text-[9px] px-2 py-1 rounded-full font-bold transition-all ${
                          (selectedLead.lead?.lead_stage || 'nuevo') === s.id
                            ? s.color === 'green' ? 'bg-emerald-500 text-white' :
                              s.color === 'red' ? 'bg-red-500 text-white' :
                              s.color === 'yellow' ? 'bg-yellow-500 text-black' :
                              s.color === 'purple' ? 'bg-purple-500 text-white' :
                              s.color === 'blue' ? 'bg-blue-500 text-white' :
                              'bg-gray-500 text-white'
                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                        }`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Score */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Lead Score</span>
                    <span className={`font-bold ${
                      (selectedLead.lead?.lead_score || 0) >= 70 ? 'text-emerald-400' :
                      (selectedLead.lead?.lead_score || 0) >= 40 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>{selectedLead.lead?.lead_score || 0}/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      (selectedLead.lead?.lead_score || 0) >= 70 ? 'bg-emerald-500' :
                      (selectedLead.lead?.lead_score || 0) >= 40 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} style={{width: `${selectedLead.lead?.lead_score || 0}%`}}></div>
                  </div>
                </div>
                {/* Tags manuales */}
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(selectedLead.lead?.tags || []).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
                        {tag.replace(/_/g, ' ')}
                        <button onClick={() => updateTags(selectedLead.lead?.phoneNumber, 'remove', [tag])}
                          className="hover:text-red-400 font-bold">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input value={newTag} onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          updateTags(selectedLead.lead?.phoneNumber, 'add', [newTag.trim().toLowerCase().replace(/\s+/g, '_')]);
                          setNewTag('');
                        }
                      }}
                      placeholder="Agregar tag..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-indigo-500 text-white" />
                    <button onClick={() => {
                      if (newTag.trim()) {
                        updateTags(selectedLead.lead?.phoneNumber, 'add', [newTag.trim().toLowerCase().replace(/\s+/g, '_')]);
                        setNewTag('');
                      }
                    }} className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2 py-1 rounded-lg font-bold transition-all">+</button>
                  </div>
                </div>
              </div>
              {selectedLead.payment && (
                <div className="mb-4 pt-4 border-t border-white/5">
                  <h4 className="font-bold mb-2 text-emerald-400">💳 Pago</h4>
                  <p className="text-sm">{selectedLead.payment.service_name}</p>
                  <p className="text-lg font-bold text-emerald-400">${selectedLead.payment.amount?.toLocaleString()} {selectedLead.payment.currency}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedLead.payment.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedLead.payment.status}
                  </span>
                </div>
              )}
              {/* Panel de Inteligencia Artificial */}
              <div className="pt-4 border-t border-white/5">
                {!aiInsight && !loadingAi ? (
                  <button onClick={() => loadAiInsight(selectedLead.lead?.phoneNumber)}
                    className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white py-3 rounded-xl text-sm font-bold transition-all">
                    🧠 Analizar con IA
                  </button>
                ) : loadingAi ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Analizando conversación...</p>
                  </div>
                ) : aiInsight && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-indigo-400">🧠 Análisis IA</h4>
                    {/* Probabilidad de cierre */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Probabilidad de cierre</span>
                          <span className={`font-bold ${
                            aiInsight.close_probability >= 70 ? 'text-emerald-400' :
                            aiInsight.close_probability >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{aiInsight.close_probability}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${
                            aiInsight.close_probability >= 70 ? 'bg-emerald-500' :
                            aiInsight.close_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} style={{width: `${aiInsight.close_probability}%`}}></div>
                        </div>
                      </div>
                    </div>
                    {/* Resumen */}
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Resumen</p>
                      <p className="text-sm text-gray-300">{aiInsight.summary}</p>
                    </div>
                    {/* Tags */}
                    {aiInsight.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {aiInsight.tags.map((tag: string, i: number) => (
                          <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${
                            tag === 'caliente' || tag === 'listo_para_cerrar' ? 'bg-emerald-500/20 text-emerald-400' :
                            tag === 'frio' || tag === 'inactivo' ? 'bg-red-500/20 text-red-400' :
                            tag === 'objecion' || tag === 'indeciso' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-indigo-500/20 text-indigo-400'
                          }`}>{tag.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                    {/* Acción sugerida */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3">
                      <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1">🎯 Siguiente acción</p>
                      <p className="text-sm text-white font-medium">{aiInsight.suggested_action}</p>
                    </div>
                    {/* Respuesta sugerida */}
                    {aiInsight.suggested_response && (
                      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">💬 Respuesta sugerida</p>
                        <p className="text-sm text-gray-300 italic">"{aiInsight.suggested_response}"</p>
                        <button onClick={() => navigator.clipboard.writeText(aiInsight.suggested_response)}
                          className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold">
                          📋 Copiar respuesta
                        </button>
                      </div>
                    )}
                    {/* Sentimiento */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Sentimiento:</span>
                      <span className={`text-xs font-bold ${
                        aiInsight.sentiment === 'positivo' ? 'text-emerald-400' :
                        aiInsight.sentiment === 'negativo' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {aiInsight.sentiment === 'positivo' ? '😊 Positivo' :
                         aiInsight.sentiment === 'negativo' ? '😟 Negativo' : '😐 Neutral'}
                      </span>
                    </div>
                    {/* Botón re-analizar */}
                    <button onClick={() => loadAiInsight(selectedLead.lead?.phoneNumber)}
                      className="w-full text-xs text-gray-500 hover:text-indigo-400 py-2 transition-all">
                      🔄 Re-analizar
                    </button>
                  </div>
                )}
              </div>              
              {selectedLead.conversation?.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-bold mb-2">💬 Conversacion</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedLead.conversation.map((msg: any, i: number) => (
                      <div key={i} className={`text-xs p-2 rounded-lg ${
                        msg.role === 'user' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white/5 text-gray-300'
                      }`}>
                        <span className="font-bold">{msg.role === 'user' ? '👤' : '🤖'}</span> {msg.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-3xl mb-2">👈</p>
              <p className="text-sm">Selecciona un lead para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}