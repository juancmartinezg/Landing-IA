'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
function KanbanColumn({ id, label, color, bg, count, value, children }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef}
      className={`min-w-[180px] sm:min-w-[220px] flex-1 border rounded-2xl p-2 sm:p-3 transition-all ${color} ${
        isOver ? `${bg} border-2 scale-[1.01]` : 'bg-white/[0.02]'
      }`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold">{label}</h3>
        <span className="text-[10px] text-gray-500">{count}</span>
      </div>
      {value > 0 && <p className="text-[10px] text-emerald-400 mb-2">${value.toLocaleString()} COP</p>}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">{children}</div>
      {count === 0 && <p className="text-[10px] text-gray-600 text-center py-4">Arrastra leads aquí</p>}
    </div>
  );
}
function KanbanCard({ lead, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.phoneNumber,
    data: { type: 'card', stage: lead.lead_stage || 'nuevo' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`bg-white/[0.03] border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:bg-white/[0.06] transition-all ${
        isDragging ? 'shadow-lg shadow-indigo-500/20 border-indigo-500/50' : ''
      }`}
      onClick={onClick}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 bg-indigo-600/20 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-400">
          {(lead.customer_name || 'U').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{lead.customer_name || 'Sin nombre'}</p>
          <p className="text-[9px] text-gray-600">{lead.phoneNumber}</p>
        </div>
      </div>
      {lead.service_of_interest && <p className="text-[9px] text-gray-500 truncate">{lead.service_of_interest}</p>}
      {(lead.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {(lead.tags || []).slice(0, 2).map((tag: string, i: number) => (
            <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
              {tag.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
      {(lead.lead_score || 0) > 0 && (
        <div className="mt-1 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${
            lead.lead_score >= 70 ? 'bg-emerald-500' : lead.lead_score >= 40 ? 'bg-yellow-500' : 'bg-gray-500'
          }`} style={{width: `${lead.lead_score}%`}}></div>
        </div>
      )}
    </div>
  );
}
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
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
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
        (l.service_of_interest || '').toLowerCase().includes(s) ||
        (l.tags || []).some((t: string) => t.toLowerCase().includes(s)) ||
        (l.notes || []).some((n: any) => (n.text || '').toLowerCase().includes(s)) ||
        (l.lead_stage || '').toLowerCase().includes(s) ||
        (l.lead_status || '').toLowerCase().includes(s)
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
  const addNote = async (phone: string) => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch(`${API_URL}/leads/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      body: JSON.stringify({ phone, text: newNote.trim() }),
    });
    setNewNote('');
    setSavingNote(false);
    loadDetail(phone);
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
        <h1 className="text-lg sm:text-2xl font-bold">CRM / Leads 👥</h1>
       <div className="flex gap-2">
          <button onClick={() => setView(view === 'list' ? 'kanban' : 'list')}
            className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            {view === 'list' ? '📊 Kanban' : '📋 Lista'}
          </button>
          <button onClick={exportCSV} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            📥 Exportar CSV
          </button>
        </div>
      </div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono, servicio, tags, notas..."
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
      {/* Alertas inteligentes */}
      {(() => {
        const now = Date.now() / 1000;
        const alerts: any[] = [];
        filtered.forEach(l => {
          const lastUpdate = Number(l.last_updated || 0);
          const hoursSince = lastUpdate ? (now - lastUpdate) / 3600 : 0;
          const status = (l.lead_status || '').toLowerCase();
          const tags = l.tags || [];
          const score = l.lead_score || 0;
          const visits = l.visit_count || 0;
          // Alerta: no responde hace 48h con intención de compra
          if (hoursSince > 48 && (status.includes('intencion') || status.includes('interesado') || score >= 60)) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `No responde hace ${Math.floor(hoursSince)}h y tenía intención de compra`,
              color: 'bg-red-500/10 border-red-500/20 text-red-400', icon: '🔴' });
          }
          // Alerta: preguntó precio varias veces (visitas >= 3)
          else if (visits >= 3 && !status.includes('cerrado') && !status.includes('pagado')) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `${visits} visitas — posiblemente listo para cerrar`,
              color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', icon: '🟡' });
          }
          // Alerta: lead caliente sin contactar
          if (tags.includes('caliente') && (l.lead_stage || 'nuevo') === 'nuevo') {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `Lead caliente sin contactar`,
              color: 'bg-orange-500/10 border-orange-500/20 text-orange-400', icon: '🟠' });
          }
          // Alerta: score alto sin seguimiento
          if (score >= 70 && !['cerrado_ganado', 'negociacion'].includes(l.lead_stage || '')) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `Score ${score}/100 — requiere seguimiento inmediato`,
              color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: '🟢' });
          }
        });
        return alerts.length > 0 ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold">🔔 Alertas</span>
              <span className="text-[10px] text-gray-500">{alerts.length}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {alerts.slice(0, 5).map((a, i) => (
                <div key={i} onClick={() => { loadDetail(a.phone); setView('list'); }}
                  className={`min-w-[250px] border rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-all ${a.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{a.icon}</span>
                    <span className="text-xs font-bold truncate">{a.name}</span>
                  </div>
                  <p className="text-[10px]">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}
     {view === 'kanban' ? (
        /* ==================== VISTA KANBAN CON DRAG & DROP ==================== */
        <DndContext
           sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over) return;
            const phone = active.id as string;
            const validStages = ['nuevo', 'contactado', 'interesado', 'negociacion', 'cerrado_ganado', 'cerrado_perdido'];
            // Si soltó sobre una columna, over.id es el stage
            // Si soltó sobre otro card, buscar en qué columna está ese card
            let newStage = over.id as string;
            if (!validStages.includes(newStage)) {
              const targetLead = filtered.find(l => l.phoneNumber === newStage);
              if (targetLead) {
                newStage = targetLead.lead_stage || 'nuevo';
              } else {
                return;
              }
            }
            const lead = filtered.find(l => l.phoneNumber === phone);
            if (lead && (lead.lead_stage || 'nuevo') !== newStage) {
              updateStage(phone, newStage);
            }
          }}
        >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            { id: 'nuevo', label: '🆕 Nuevo', color: 'border-gray-500/30', bg: 'bg-gray-500/5' },
            { id: 'contactado', label: '📞 Contactado', color: 'border-blue-500/30', bg: 'bg-blue-500/5' },
            { id: 'interesado', label: '🔥 Interesado', color: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
            { id: 'negociacion', label: '🤝 Negociación', color: 'border-purple-500/30', bg: 'bg-purple-500/5' },
            { id: 'cerrado_ganado', label: '✅ Ganado', color: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
            { id: 'cerrado_perdido', label: '❌ Perdido', color: 'border-red-500/30', bg: 'bg-red-500/5' },
          ].map(stage => {
            const stageLeads = filtered.filter(l => (l.lead_stage || 'nuevo') === stage.id);
            const stageValue = stageLeads.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
            return (
               <KanbanColumn key={stage.id} id={stage.id} label={stage.label} color={stage.color} bg={stage.bg}
                count={stageLeads.length} value={stageValue} className="min-w-[180px] sm:min-w-[220px]">
                {stageLeads.map((lead) => (
                  <KanbanCard key={lead.phoneNumber} lead={lead}
                    onClick={() => { loadDetail(lead.phoneNumber); setView('list'); }} />
                ))}
              </KanbanColumn>
            );
          })}
        </div>
        </DndContext>
      ) : (
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
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${
                      lead.lead_status === 'INTENCION DE COMPRA' ? 'bg-emerald-500/20 text-emerald-400' :
                      lead.lead_status === 'INTERESADO' ? 'bg-indigo-500/20 text-indigo-400' :
                      lead.lead_status === 'DEMO' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {lead.lead_status || 'Nuevo'}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1 hidden sm:block">{lead.service_of_interest || ''}</p>
                    <p className="text-[10px] text-gray-600 hidden sm:block">Visitas: {lead.visit_count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Detalle del Lead */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 lg:p-6 lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto">
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
              {/* Acciones rápidas */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Acciones rápidas</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://wa.me/${selectedLead.lead?.phoneNumber}`} target="_blank"
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold transition-all">
                    💬 Enviar WhatsApp
                  </a>
                  <button onClick={() => {
                    const slug = selectedLead.lead?.service_of_interest?.toLowerCase().replace(/\s+/g, '-') || '';
                    if (slug) {
                      fetch(`${API_URL}/conversations/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                        body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, content: `Hola! Te envío el enlace para completar tu reserva 🎯` }),
                      });
                    }
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold transition-all">
                    💳 Enviar link pago
                  </button>
                  <button onClick={() => {
                    if (selectedLead.lead?.phoneNumber) {
                      updateStage(selectedLead.lead.phoneNumber, 'contactado');
                      addNote(selectedLead.lead.phoneNumber);
                      setNewNote('Contactado por el asesor');
                    }
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white font-bold transition-all">
                    📞 Marcar contactado
                  </button>
                </div>
              </div>
              {/* Notas */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">📝 Notas</p>
                <div className="flex gap-1 mb-2">
                  <input value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newNote.trim()) addNote(selectedLead.lead?.phoneNumber);
                    }}
                    placeholder="Agregar nota..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white" />
                  <button onClick={() => addNote(selectedLead.lead?.phoneNumber)}
                    disabled={!newNote.trim() || savingNote}
                    className="text-xs bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3 py-2 rounded-lg font-bold transition-all disabled:opacity-30">
                    {savingNote ? '...' : '📝'}
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {(selectedLead.lead?.notes || []).map((note: any, i: number) => (
                    <div key={i} className="text-[10px] p-2 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-gray-300">{note.text}</p>
                      <p className="text-gray-600 mt-1">
                        {new Date((note.created_at || 0) * 1000).toLocaleDateString()} {new Date((note.created_at || 0) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </p>
                    </div>
                  ))}
                  {!(selectedLead.lead?.notes || []).length && (
                    <p className="text-[10px] text-gray-600 text-center py-2">Sin notas</p>
                  )}
                </div>
              </div>
              {/* Timeline unificada */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="font-bold mb-2">📋 Timeline</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {(() => {
                    const events: any[] = [];
                    // Mensajes de conversación
                    (selectedLead.conversation || []).forEach((msg: any, i: number) => {
                      events.push({
                        type: msg.role === 'user' ? 'user_msg' : 'bot_msg',
                        text: msg.text,
                        icon: msg.role === 'user' ? '👤' : (msg.text?.startsWith('[Asesor]') ? '🙋' : '🤖'),
                        color: msg.role === 'user' ? 'bg-indigo-500/10 text-indigo-300' :
                               msg.text?.startsWith('[Asesor]') ? 'bg-yellow-500/10 text-yellow-300' :
                               'bg-white/5 text-gray-300',
                        order: i,
                      });
                    });
                    // Pago
                    if (selectedLead.payment) {
                      const p = selectedLead.payment;
                      events.push({
                        type: 'payment',
                        text: `${p.status === 'PAGADO' ? '✅ Pago confirmado' : p.status === 'PENDING' ? '⏳ Pago pendiente' : '❌ Pago ' + p.status}: $${(p.amount || 0).toLocaleString()} ${p.currency || 'COP'} — ${p.service_name || ''}`,
                        icon: '💳',
                        color: p.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-yellow-500/10 text-yellow-300',
                        order: 9000,
                      });
                    }
                    // Cita agendada
                    if (selectedLead.payment?.schedule_status === 'AGENDADO') {
                      events.push({
                        type: 'appointment',
                        text: `📅 Cita agendada: ${selectedLead.payment.scheduled_date || ''} a las ${selectedLead.payment.scheduled_hour || ''}:00`,
                        icon: '📅',
                        color: 'bg-purple-500/10 text-purple-300',
                        order: 9500,
                      });
                    }
                    // Estado actual
                    if (selectedLead.session_state) {
                      events.push({
                        type: 'state',
                        text: `Estado: ${selectedLead.session_state}`,
                        icon: '🔄',
                        color: 'bg-gray-500/10 text-gray-400',
                        order: 9900,
                      });
                    }
                    return events.length > 0 ? events.map((ev, i) => (
                      <div key={i} className={`text-xs p-2 rounded-lg flex items-start gap-2 ${ev.color}`}>
                        <span className="shrink-0">{ev.icon}</span>
                        <span className="break-words">{ev.text}</span>
                      </div>
                    )) : (
                      <p className="text-xs text-gray-600 text-center py-4">Sin actividad registrada</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-3xl mb-2">👈</p>
              <p className="text-sm">Selecciona un lead para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}