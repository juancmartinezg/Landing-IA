'use client';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
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
      className={`w-full sm:min-w-[220px] sm:flex-1 border rounded-2xl p-2 sm:p-3 transition-all ${color} ${
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
function KanbanCard({ lead, onClick, onMove }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.phoneNumber,
    data: { type: 'card', stage: lead.lead_stage || 'nuevo' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const stages = [
    { id: 'nuevo', label: '🆕 Nuevo' },
    { id: 'interesado', label: '🔥 Interesado' },
    { id: 'negociacion', label: '🤝 Negociación' },
    { id: 'cerrado_ganado', label: '✅ Cerrado' },
    { id: 'contactado', label: '📞 Contactado' },
    { id: 'cerrado_perdido', label: '❌ Perdido' },
  ].filter(s => s.id !== (lead.lead_stage || 'nuevo'));
  return (
    <div ref={setNodeRef} style={style} {...attributes}
      className={`bg-white/[0.03] border border-white/5 rounded-xl p-2.5 hover:bg-white/[0.06] transition-all relative ${
        isDragging ? 'shadow-lg shadow-indigo-500/20 border-indigo-500/50 cursor-grabbing' : 'cursor-pointer'
      }`}>
      <div className="flex items-center gap-2" onClick={onClick}>
        <div {...listeners} className="hidden sm:block cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 text-xs px-0.5">⠿</div>
        <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center text-[9px] font-bold text-indigo-400 shrink-0">
          {(lead.customer_name || 'U').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium truncate">{lead.customer_name || 'Sin nombre'}</p>
          <p className="text-[9px] text-gray-600 truncate">{lead.service_of_interest || lead.phoneNumber}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="text-gray-500 hover:text-white text-sm shrink-0 px-1">⋮</button>
      </div>
      {menuOpen && (
        <div className="absolute right-2 top-full mt-1 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-xl z-50 py-1 min-w-[140px]">
          {stages.map(s => (
            <button key={s.id} onClick={(e) => { e.stopPropagation(); onMove(lead.phoneNumber, s.id); setMenuOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-white/10 text-gray-300 transition-all">
              {s.label}
            </button>
          ))}
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
  const [page, setPage] = useState(1);
  const LEADS_PER_PAGE = 25;
  const [filterTag, setFilterTag] = useState('all');
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [privateNotes, setPrivateNotes] = useState<any[]>([]);
  const [newPrivateNote, setNewPrivateNote] = useState('');
  const [savingPrivateNote, setSavingPrivateNote] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [showDetail, setShowDetail] = useState(false);
  const [crmFields, setCrmFields] = useState<string[]>([]);
  const [activeCarriers, setActiveCarriers] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [filterProduct, setFilterProduct] = useState('all');
  const [showImport, setShowImport] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', city: '', zip_code: '' });
  const [newLead, setNewLead] = useState({ phone: '', name: '', email: '', product: '', city: '', zip_code: '', notes: '', paid: false });
  const [customFields, setCustomFields] = useState<{name: string, value: string}[]>([]);
  const [savingLead, setSavingLead] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  // M7: import de ventas historicas (Bloque M Meta CAPI)
  const [showSalesImport, setShowSalesImport] = useState(false);
  const [salesRows, setSalesRows] = useState<any[]>([]);
  const [salesImporting, setSalesImporting] = useState(false);
  const [salesResult, setSalesResult] = useState<any>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [filterAgent, setFilterAgent] = useState('all');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  useEffect(() => {
    fetch(`${API_URL}/config`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        setCrmFields(data.crm_fields || []);
        setActiveCarriers((data.shipping || {}).providers || []);
      })
      .catch(() => {});
    fetch(`${API_URL}/services`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setServicesList(data.services || []))
      .catch(() => {});
    fetch(`${API_URL}/agents`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setAgentsList((data.agents || []).filter((a: any) => a.active)))
      .catch(() => {});
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
    if (filterProduct !== 'all') {
      result = result.filter(l => (l.purchase_info || {}).product_name === filterProduct);
    }
    if (filterAgent !== 'all') {
      if (filterAgent === 'unassigned') {
        result = result.filter(l => !l.assigned_agent_id);
      } else {
        result = result.filter(l => l.assigned_agent_id === filterAgent);
      }
    }
    setFiltered(result);
    setPage(1);
  }, [search, filterStatus, filterTag, filterProduct, filterAgent, leads]);
  const loadDetail = (phone: string) => {
    fetch(`${API_URL}/leads?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setSelectedLead(data); setShowDetail(true); });
    fetch(`${API_URL}/leads/private-notes?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setPrivateNotes(data.notes || []))
      .catch(() => setPrivateNotes([]));
    setAiInsight(null);
  };
  const addPrivateNote = async (phone: string) => {
    if (!newPrivateNote.trim()) return;
    setSavingPrivateNote(true);
    await fetch(`${API_URL}/leads/private-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      body: JSON.stringify({ phone, text: newPrivateNote.trim(), author_name: user?.name || user?.email || '' }),
    });
    setNewPrivateNote('');
    setSavingPrivateNote(false);
    fetch(`${API_URL}/leads/private-notes?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setPrivateNotes(data.notes || []));
  };
  const closeDetail = () => { setShowDetail(false); };
  const loadAiInsight = (phone: string) => {
    setLoadingAi(true);
    fetch(`${API_URL}/leads/ai-insight?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        setAiInsight(data);
        setLoadingAi(false);
        // Auto-guardar score desde IA
        if (data.close_probability) {
          fetch(`${API_URL}/leads/score`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
            body: JSON.stringify({ phone, score: data.close_probability }),
          });
        }
        // Auto-guardar tags desde IA
        if (data.tags?.length > 0) {
          fetch(`${API_URL}/leads/tags`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
            body: JSON.stringify({ phone, action: 'add', tags: data.tags }),
          }).then(() => {
            fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
              .then(res => res.json()).then(d => setLeads(d.leads || []));
          });
        }
      })
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
  const assignAgent = async (phone: string, agent_id: string) => {
    await fetch(`${API_URL}/agents/assign-lead`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      body: JSON.stringify({ phone, agent_id }),
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
  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        if (jsonData.length < 2) return;
        const headers = jsonData[0].map((h: any) => String(h || '').trim());
        setCsvColumns(headers);
        const autoMap: Record<string, string> = {};
        headers.forEach(h => {
          const lower = h.toLowerCase();
          if (lower.includes('telefono') || lower.includes('phone') || lower.includes('celular') || lower.includes('whatsapp') || lower.includes('tel')) autoMap[h] = 'phone';
          else if (lower.includes('nombre') || lower.includes('name') || lower === 'cliente') autoMap[h] = 'name';
          else if (lower.includes('email') || lower.includes('correo') || lower.includes('mail')) autoMap[h] = 'email';
          else if (lower.includes('producto') || lower.includes('product') || lower.includes('servicio') || lower.includes('service')) autoMap[h] = 'product';
          else if (lower.includes('ciudad') || lower.includes('city')) autoMap[h] = 'city';
          else if (lower.includes('postal') || lower.includes('zip') || lower.includes('codigo')) autoMap[h] = 'zip_code';
          else if (lower.includes('nota') || lower.includes('note') || lower.includes('comentario')) autoMap[h] = 'notes';
          else if (lower.includes('tag') || lower.includes('etiqueta')) autoMap[h] = 'tags';
          else if (lower.includes('pagado') || lower.includes('paid') || lower.includes('compro') || lower.includes('estado')) autoMap[h] = 'paid';
        });
        setColumnMap(autoMap);
        const rows: any[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const values = jsonData[i];
          if (!values || values.length === 0) continue;
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => { row[h] = String(values[idx] || '').trim(); });
          rows.push(row);
        }
        setCsvData(rows);
        setImportResult(null);
      } catch (err) {
        console.error('Error parseando archivo:', err);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const handleImport = async () => {
    if (!csvData.length) return;
    setImporting(true);
    const mappedLeads = csvData.map(row => {
      const lead: any = {};
      Object.entries(columnMap).forEach(([csvCol, field]) => {
        if (field && row[csvCol]) lead[field] = row[csvCol];
      });
      return lead;
    }).filter(l => l.phone);
    try {
      const res = await fetch(`${API_URL}/leads/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ leads: mappedLeads }),
      });
      const data = await res.json();
      setImportResult(data);
      if (data.imported > 0 || data.updated > 0) {
        fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
          .then(r => r.json()).then(d => { setLeads(d.leads || []); });
      }
    } catch { setImportResult({ error: 'Error de conexión' }); }
    setImporting(false);
  };
  // === M7: Descargar plantilla Excel del catalogo ===
  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      const res = await fetch(`${API_URL}/leads/import-template`, {
        headers: { 'client-id': user?.companyId || '' },
      });
      if (!res.ok) throw new Error('Error generando plantilla');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().split('T')[0];
      a.download = `plantilla-ventas-${user?.companyId || 'export'}-${today}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo descargar la plantilla. Intenta de nuevo.');
    }
    setDownloadingTemplate(false);
  };
  // === M7: Parsear xlsx de ventas en cliente ===
  const handleSalesFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheetName = wb.SheetNames.find((n: string) => n.toLowerCase().includes('venta')) || wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
        if (jsonRows.length < 2) {
          alert('El archivo esta vacio. Borra solo la fila de ejemplo y agrega ventas reales.');
          return;
        }
        // Mapeo posicional fijo de M5:
        // 0:phone 1:email 2:service_slug 3:amount 4:currency 5:purchase_date
        // 6:campaign_id 7:customer_first_name 8:customer_last_name
        const rows: any[] = [];
        for (let i = 1; i < jsonRows.length; i++) {
          const r = jsonRows[i];
          if (!r || !r[0]) continue;
          const phone = String(r[0] || '').replace(/\D/g, '');
          if (!phone) continue;
          // Saltar fila de ejemplo (email placeholder)
          if (i === 1 && String(r[1] || '').toLowerCase() === 'cliente@email.com') continue;
          rows.push({
            phone,
            email: String(r[1] || '').trim().toLowerCase(),
            service_slug: String(r[2] || '').trim(),
            amount: r[3] ? String(r[3]).replace(/[^\d.]/g, '') : '',
            currency: String(r[4] || '').trim().toUpperCase() || 'COP',
            purchase_date: String(r[5] || '').trim().slice(0, 10),
            campaign_id: String(r[6] || '').trim(),
            customer_first_name: String(r[7] || '').trim(),
            customer_last_name: String(r[8] || '').trim(),
          });
        }
        if (!rows.length) {
          alert('No encontramos ventas validas. Revisa la plantilla.');
          return;
        }
        setSalesRows(rows);
        setSalesResult(null);
      } catch (err) {
        console.error('Error parseando xlsx ventas:', err);
        alert('No pudimos leer el archivo. Asegurate de usar la plantilla descargada.');
      }
    };
    reader.readAsArrayBuffer(file);
  };
  // === M7: Subir ventas a M6 endpoint ===
  const handleSalesImport = async () => {
    if (!salesRows.length) return;
    setSalesImporting(true);
    try {
      const res = await fetch(`${API_URL}/leads/bulk-import-purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ rows: salesRows }),
      });
      const data = await res.json();
      setSalesResult(data);
      if (data.imported > 0) {
        fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
          .then((r: any) => r.json()).then((d: any) => setLeads(d.leads || []));
      }
    } catch {
      setSalesResult({ error: 'Error de conexion' });
    }
    setSalesImporting(false);
  };
  const handleAddLead = async () => {
    if (!newLead.phone.trim()) return;
    setSavingLead(true);
    try {
      const lead: any = { phone: newLead.phone.replace(/[^0-9]/g, '') };
      if (newLead.name) lead.name = newLead.name;
      if (newLead.email) lead.email = newLead.email;
      if (newLead.product) lead.product = newLead.product;
      if (newLead.city) lead.city = newLead.city;
      if (newLead.zip_code) lead.zip_code = newLead.zip_code;
      if (newLead.notes) lead.notes = newLead.notes;
      if (newLead.paid) lead.paid = true;
      if (customFields.length > 0) {
        lead.custom_fields = {};
        customFields.forEach(cf => { if (cf.name && cf.value) lead.custom_fields[cf.name] = cf.value; });
      }
      const res = await fetch(`${API_URL}/leads/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ leads: [lead] }),
      });
      if (res.ok) {
        setShowAddLead(false);
        setNewLead({ phone: '', name: '', email: '', product: '', city: '', zip_code: '', notes: '', paid: false });
        setCustomFields([]);
        fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
          .then(r => r.json()).then(d => { setLeads(d.leads || []); });
      }
    } catch {}
    setSavingLead(false);
  };
  return (
    <div className="overflow-hidden">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-lg sm:text-2xl font-bold">CRM / Leads 👥</h1>
       <div className="flex gap-2">
          <button onClick={() => setView(view === 'list' ? 'kanban' : 'list')}
            className="bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
            {view === 'list' ? '📊 Kanban' : '📋 Lista'}
          </button>
          <button onClick={() => { setShowAddLead(!showAddLead); setShowImport(false); }} className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
            ➕ Agregar
          </button>
          <button onClick={() => { setShowImport(!showImport); setShowAddLead(false); setShowSalesImport(false); }} className="bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
            📤 Importar
          </button>
          <button onClick={() => { setShowSalesImport(!showSalesImport); setShowImport(false); setShowAddLead(false); }}
            className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            title="Subir historial de ventas para enviar Purchase events a Meta">
            💰 Ventas
          </button>
          <button onClick={exportCSV} className="bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hidden sm:block">
            📥 Exportar
          </button>
        </div>
      </div>
      {/* M7: Modal import de ventas historicas */}
      {showSalesImport && (
        <div className="bg-white/[0.03] border border-emerald-500/20 rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold">💰 Importar ventas históricas</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Sube tu Excel de ventas — enviamos Purchase events a Meta automáticamente para entrenar tus campañas.</p>
            </div>
            <button onClick={() => { setShowSalesImport(false); setSalesRows([]); setSalesResult(null); }}
              className="text-gray-500 hover:text-white text-lg">✕</button>
          </div>
          {/* Paso 1: descargar plantilla */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold mb-1">Paso 1 — Descarga la plantilla</p>
            <p className="text-[10px] text-gray-500 mb-3">Trae dropdown con los servicios de tu catálogo para evitar errores.</p>
            <button onClick={handleDownloadTemplate} disabled={downloadingTemplate}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
              {downloadingTemplate ? 'Generando...' : '📥 Descargar plantilla Excel'}
            </button>
          </div>
          {/* Paso 2: subir archivo */}
          {salesRows.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <p className="text-xs font-bold mb-1">Paso 2 — Sube el archivo completado</p>
              <p className="text-[10px] text-gray-500 mb-3">Llena tus ventas en la hoja &quot;Ventas&quot; y guarda. Luego sube el .xlsx aquí.</p>
              <label className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer transition-all text-xs">
                📁 Seleccionar archivo
                <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleSalesFile(f);
                  e.target.value = '';
                }} />
              </label>
            </div>
          ) : salesResult ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-3">{salesResult.error ? '❌' : '✅'}</p>
              {salesResult.error ? (
                <p className="text-red-400 text-sm">{salesResult.error}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-emerald-400 font-bold text-lg">{salesResult.imported} ventas importadas</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>📊 Total filas: {salesResult.total_rows}</p>
                    <p>📤 Purchase events enviados a Meta: <span className="text-emerald-400 font-bold">{salesResult.capi_sent || 0}</span></p>
                    {salesResult.capi_dedup > 0 && (
                      <p>♻️ Eventos duplicados omitidos: {salesResult.capi_dedup}</p>
                    )}
                    {salesResult.capi_failed > 0 && (
                      <p className="text-yellow-400">⚠️ Eventos fallidos: {salesResult.capi_failed}</p>
                    )}
                    {salesResult.skipped > 0 && (
                      <p className="text-yellow-400">⚠️ Filas saltadas: {salesResult.skipped}</p>
                    )}
                  </div>
                  {salesResult.errors?.length > 0 && (
                    <details className="text-left mt-4 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                      <summary className="text-xs text-red-400 cursor-pointer font-bold">
                        Ver errores ({salesResult.errors_total || salesResult.errors.length})
                      </summary>
                      <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                        {salesResult.errors.map((err: any, i: number) => (
                          <li key={i} className="text-[10px] text-red-300">
                            <span className="text-gray-500">Fila {err.row}:</span> {err.reason}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
              <button onClick={() => { setSalesRows([]); setSalesResult(null); }}
                className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                Importar otro archivo
              </button>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-400 mb-2">
                ✓ {salesRows.length} ventas listas para importar
              </p>
              <div className="bg-white/[0.02] rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                <p className="text-[9px] text-gray-500 mb-2">Vista previa (primeras 5):</p>
                {salesRows.slice(0, 5).map((row, i) => (
                  <div key={i} className="text-[10px] text-gray-400 border-b border-white/5 py-1.5 grid grid-cols-3 gap-2">
                    <span>📱 <strong className="text-white">{row.phone}</strong></span>
                    <span>🏷️ {row.service_slug || '—'}</span>
                    <span>💰 {row.amount ? `$${Number(row.amount).toLocaleString()}` : '(catálogo)'}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSalesRows([]); setSalesResult(null); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                  Cancelar
                </button>
                <button onClick={handleSalesImport} disabled={salesImporting}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">
                  {salesImporting ? 'Importando + enviando a Meta...' : `💰 Importar ${salesRows.length} ventas`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
        />
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none bg-[#0B0F1A] border border-white/10 rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 text-white"
          >
            <option value="all" className="bg-[#1a1f2e] text-white">Estado</option>
            {statuses.map(s => (
              <option key={s} value={s} className="bg-[#1a1f2e] text-white">{s}</option>
            ))}
          </select>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="flex-1 sm:flex-none bg-[#0B0F1A] border border-white/10 rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 text-white"
          >
            <option value="all" className="bg-[#1a1f2e] text-white">Tags</option>
            {allTags.map(t => (
              <option key={t} value={t} className="bg-[#1a1f2e] text-white">{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {crmFields.includes('product_name') && (
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="flex-1 sm:flex-none bg-[#0B0F1A] border border-white/10 rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 text-white"
            >
              <option value="all" className="bg-[#1a1f2e] text-white">Producto</option>
              {[...new Set(leads.map(l => (l.purchase_info || {}).product_name).filter(Boolean))].map(p => (
                <option key={p} value={p} className="bg-[#1a1f2e] text-white">{p}</option>
              ))}
            </select>
          )}
          {agentsList.length > 0 && (
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="flex-1 sm:flex-none bg-[#0B0F1A] border border-white/10 rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 text-white"
            >
              <option value="all" className="bg-[#1a1f2e] text-white">Agente</option>
              <option value="unassigned" className="bg-[#1a1f2e] text-white">Sin asignar</option>
              {agentsList.map((a: any) => (
                <option key={a.agent_id} value={a.agent_id} className="bg-[#1a1f2e] text-white">{a.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      {/* Modal agregar lead manual */}
      {showAddLead && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">➕ Agregar Lead</h3>
            <button onClick={() => setShowAddLead(false)} className="text-gray-500 hover:text-white text-lg">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Teléfono *</label>
              <input value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="573001234567" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Nombre</label>
              <input value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email</label>
              <input value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="juan@email.com" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Producto / Servicio</label>
              <input value={newLead.product} onChange={(e) => setNewLead({...newLead, product: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="Seminario básico" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Ciudad</label>
              <input value={newLead.city} onChange={(e) => setNewLead({...newLead, city: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="Medellín" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Código postal</label>
              <input value={newLead.zip_code} onChange={(e) => setNewLead({...newLead, zip_code: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="050001" />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Notas</label>
              <input value={newLead.notes} onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                placeholder="Cliente referido por..." />
            </div>
            <div className="sm:col-span-2 md:col-span-3 flex items-center gap-3">
              <button onClick={() => setNewLead({...newLead, paid: !newLead.paid})}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  newLead.paid ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-white/40'
                }`}>
                {newLead.paid && <span className="text-white text-xs">✓</span>}
              </button>
              <span className="text-xs text-gray-400">✅ Ya realizó el pago</span>
            </div>
            {customFields.map((cf, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-1 mb-1">
                  <input value={cf.name} onChange={(e) => {
                    const updated = [...customFields];
                    updated[idx].name = e.target.value;
                    setCustomFields(updated);
                  }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px] text-gray-400 outline-none"
                    placeholder="Nombre del campo" />
                  <button onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
                <input value={cf.value} onChange={(e) => {
                  const updated = [...customFields];
                  updated[idx].value = e.target.value;
                  setCustomFields(updated);
                }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                  placeholder="Valor" />
              </div>
            ))}
            <div className="sm:col-span-2 md:col-span-3">
              <button onClick={() => setCustomFields([...customFields, { name: '', value: '' }])}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">
                ➕ Agregar campo personalizado
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowAddLead(false)}
              className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button onClick={handleAddLead} disabled={savingLead || !newLead.phone.trim()}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">
              {savingLead ? 'Guardando...' : '✓ Agregar lead'}
            </button>
          </div>
        </div>
      )}
      {/* Modal de importación CSV */}
      {showImport && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">📤 Importar Leads desde CSV</h3>
            <button onClick={() => { setShowImport(false); setCsvData([]); setCsvColumns([]); setImportResult(null); }}
              className="text-gray-500 hover:text-white text-lg">✕</button>
          </div>
          {csvData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-3">📄</p>
              <p className="text-sm text-gray-400 mb-4">Sube un archivo CSV o Excel con tus contactos</p>
              <p className="text-[10px] text-gray-600 mb-4">Solo el teléfono es obligatorio. Columnas opcionales: nombre, email, producto, ciudad, código postal, notas, tags</p>
              <label className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition-all">
                📁 Seleccionar archivo
                <input type="file" accept=".csv,.xlsx,.xls,.txt,.tsv" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCsvFile(f);
                  e.target.value = '';
                }} />
              </label>
            </div>
          ) : importResult ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-3">{importResult.error ? '❌' : '✅'}</p>
              {importResult.error ? (
                <p className="text-red-400 text-sm">{importResult.error}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-emerald-400 font-bold">{importResult.imported} nuevos importados</p>
                  {importResult.updated > 0 && <p className="text-yellow-400 text-sm">{importResult.updated} actualizados</p>}
                  {importResult.errors > 0 && <p className="text-red-400 text-sm">{importResult.errors} errores</p>}
                </div>
              )}
              <button onClick={() => { setCsvData([]); setCsvColumns([]); setImportResult(null); }}
                className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-bold">Importar otro archivo</button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 mb-3">📋 {csvData.length} registros encontrados. Mapea las columnas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {csvColumns.map(col => (
                  <div key={col}>
                    <p className="text-[9px] text-gray-500 truncate mb-1">{col}</p>
                    <select value={columnMap[col] || ''} onChange={(e) => setColumnMap({...columnMap, [col]: e.target.value})}
                      className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none">
                      <option value="" className="bg-[#1a1f2e]">— Ignorar —</option>
                      <option value="phone" className="bg-[#1a1f2e]">📱 Teléfono</option>
                      <option value="name" className="bg-[#1a1f2e]">👤 Nombre</option>
                      <option value="email" className="bg-[#1a1f2e]">📧 Email</option>
                      <option value="product" className="bg-[#1a1f2e]">🏷️ Producto</option>
                      <option value="city" className="bg-[#1a1f2e]">🏙️ Ciudad</option>
                      <option value="zip_code" className="bg-[#1a1f2e]">📮 Código postal</option>
                      <option value="notes" className="bg-[#1a1f2e]">📝 Notas</option>
                      <option value="tags" className="bg-[#1a1f2e]">🏷️ Tags</option>
                      <option value="paid" className="bg-[#1a1f2e]">✅ Pagó (si/no)</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] rounded-xl p-3 mb-4 max-h-40 overflow-y-auto">
                <p className="text-[9px] text-gray-500 mb-2">Vista previa (primeros 5):</p>
                {csvData.slice(0, 5).map((row, i) => (
                  <div key={i} className="text-[10px] text-gray-400 truncate border-b border-white/5 py-1">
                    {Object.entries(columnMap).filter(([,v]) => v).map(([col, field]) => (
                      <span key={col} className="mr-3">{field}: <strong className="text-white">{row[col] || '—'}</strong></span>
                    ))}
                  </div>
                ))}
              </div>
              {!Object.values(columnMap).includes('phone') && (
                <p className="text-red-400 text-[10px] mb-3">⚠️ Debes mapear al menos la columna de Teléfono</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => { setCsvData([]); setCsvColumns([]); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                  Cancelar
                </button>
                <button onClick={handleImport}
                  disabled={importing || !Object.values(columnMap).includes('phone')}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">
                  {importing ? 'Importando...' : `📤 Importar ${csvData.length} leads`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
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
          if (hoursSince > 48 && (status.includes('intencion') || status.includes('interesado') || score >= 60)) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `No responde hace ${Math.floor(hoursSince)}h con intención de compra`,
              color: 'bg-red-500/10 border-red-500/20 text-red-400', icon: '🔴' });
          }
          else if (visits >= 3 && !status.includes('cerrado') && !status.includes('pagado')) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `${visits} visitas — listo para cerrar`,
              color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', icon: '🟡' });
          }
          if (tags.includes('caliente') && (l.lead_stage || 'nuevo') === 'nuevo') {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `Lead caliente sin contactar`,
              color: 'bg-orange-500/10 border-orange-500/20 text-orange-400', icon: '🟠' });
          }
          if (score >= 70 && !['cerrado_ganado', 'negociacion'].includes(l.lead_stage || '')) {
            alerts.push({ phone: l.phoneNumber, name: l.customer_name || 'Sin nombre',
              text: `Score ${score}/100 — seguimiento inmediato`,
              color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: '🟢' });
          }
        });
        if (alerts.length === 0) return null;
        const [alertsOpen, setAlertsOpen] = [false, () => {}];
        return (
          <div className="mb-4">
            {/* Desktop: tarjetas horizontales */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold">🔔 Alertas</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{alerts.length}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {alerts.slice(0, 4).map((a, i) => (
                  <div key={i} onClick={() => { loadDetail(a.phone); setView('list'); }}
                    className={`min-w-[220px] border rounded-xl p-2.5 cursor-pointer hover:scale-[1.02] transition-all ${a.color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{a.icon}</span>
                      <span className="text-[11px] font-bold truncate">{a.name}</span>
                    </div>
                    <p className="text-[10px]">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Móvil: banner compacto con lista desplegable */}
            <div className="sm:hidden">
              <details className="group">
                <summary className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 cursor-pointer list-none">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔔</span>
                    <span className="text-xs font-bold text-red-400">{alerts.length} alertas pendientes</span>
                  </div>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 space-y-1.5">
                  {alerts.slice(0, 5).map((a, i) => (
                    <div key={i} onClick={() => { loadDetail(a.phone); setView('list'); }}
                      className={`border rounded-lg p-2 cursor-pointer transition-all ${a.color}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{a.icon}</span>
                        <span className="text-[11px] font-bold truncate flex-1">{a.name}</span>
                        <span className="text-[9px] shrink-0">{a.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        );
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
        <div className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto pb-4 sm:-mx-0 sm:px-0">
          {[
            { id: 'nuevo', label: '🆕 Nuevo', color: 'border-gray-500/30', bg: 'bg-gray-500/5' },
            { id: 'interesado', label: '🔥 Interesado', color: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
            { id: 'negociacion', label: '🤝 Negociación', color: 'border-purple-500/30', bg: 'bg-purple-500/5' },
            { id: 'cerrado_ganado', label: '✅ Cerrado', color: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
          ].map(stage => {
            const stageLeads = filtered.filter(l => (l.lead_stage || 'nuevo') === stage.id);
            const stageValue = stageLeads.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
            return (
               <KanbanColumn key={stage.id} id={stage.id} label={stage.label} color={stage.color} bg={stage.bg}
                count={stageLeads.length} value={stageValue} className="min-w-[180px] sm:min-w-[220px]">
                {stageLeads.map((lead) => (
                  <KanbanCard key={lead.phoneNumber} lead={lead}
                    onClick={() => loadDetail(lead.phoneNumber)}
                    onMove={(phone: string, stage: string) => updateStage(phone, stage)} />
                ))}
              </KanbanColumn>
            );
          })}
        </div>
        </DndContext>
      ) : (
      <div className="relative">
        {/* Lista de Leads */}
        <div className={`transition-all ${showDetail ? 'lg:pr-[460px]' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">{filtered.length} leads encontrados</span>
            {filtered.length > LEADS_PER_PAGE && (
              <span className="text-xs text-gray-500">Página {page} de {Math.ceil(filtered.length / LEADS_PER_PAGE)}</span>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-3 bg-white/5 rounded w-32" />
                      <div className="h-2 bg-white/5 rounded w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-3 bg-white/5 rounded w-16 ml-auto" />
                    <div className="h-2 bg-white/5 rounded w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay leads con esos filtros</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.slice((page - 1) * LEADS_PER_PAGE, page * LEADS_PER_PAGE).map((lead, i) => (
                <div
                  key={i}
                  onClick={() => loadDetail(lead.phoneNumber)}
                  className={`bg-white/[0.03] border rounded-xl p-3 md:p-4 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    selectedLead?.lead?.phoneNumber === lead.phoneNumber ? 'border-indigo-500 bg-indigo-600/5' : 'border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-indigo-400 shrink-0">
                      {(lead.customer_name || 'U').charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">{lead.customer_name || 'Sin nombre'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{lead.phoneNumber}</p>
                      {lead.assigned_agent_name && (
                        <p className="text-[10px] text-indigo-400 truncate mt-0.5">🧑‍💼 {lead.assigned_agent_name}</p>
                      )}
                      {lead.last_user_msg && (
                        <p className="text-[10px] text-gray-600 truncate mt-0.5 hidden sm:block">💬 {lead.last_user_msg}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap ${
                      lead.lead_status === 'INTENCION DE COMPRA' ? 'bg-emerald-500/20 text-emerald-400' :
                      lead.lead_status === 'INTERESADO' ? 'bg-indigo-500/20 text-indigo-400' :
                      lead.lead_status === 'DEMO' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {lead.lead_status || 'Nuevo'}
                    </span>
                    {lead.last_updated && (
                      <p className={`text-[9px] mt-1 whitespace-nowrap ${
                        (Date.now()/1000 - Number(lead.last_updated)) > 172800 ? 'text-red-400' :
                        (Date.now()/1000 - Number(lead.last_updated)) > 86400 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        {(() => {
                          const diff = Math.floor((Date.now()/1000 - Number(lead.last_updated)) / 3600);
                          if (diff < 1) return '⚡ Ahora';
                          if (diff < 24) return `🕐 ${diff}h`;
                          if (diff < 48) return '🕐 Ayer';
                          return `⚠️ ${Math.floor(diff/24)}d`;
                        })()}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-600 mt-0.5 hidden sm:block">{lead.service_of_interest || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filtered.length > LEADS_PER_PAGE && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
                  ← Anterior
                </button>
                <span className="text-xs text-gray-500">
                  {page} / {Math.ceil(filtered.length / LEADS_PER_PAGE)}
                </span>
                <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / LEADS_PER_PAGE), p + 1))}
                  disabled={page >= Math.ceil(filtered.length / LEADS_PER_PAGE)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
                  Siguiente →
                </button>
              </div>
            )}
        </div>
        {/* Detalle del Lead — Slide-over desktop / Modal móvil */}
        {showDetail && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeDetail} />}
        <div className={`fixed z-50 bg-[#0B0F1A] border-l border-white/10 transition-transform duration-300 overflow-y-auto
          bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl lg:rounded-none lg:top-0 lg:left-auto lg:right-0 lg:w-[450px] lg:h-full
          ${showDetail ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
        `}>
          <div className="sticky top-0 bg-[#0B0F1A] border-b border-white/5 px-4 py-3 flex justify-between items-center z-10">
            <span className="text-xs font-bold text-gray-400">Detalle del Lead</span>
            <button onClick={closeDetail} className="text-gray-500 hover:text-white text-lg">✕</button>
          </div>
          <div className="p-4">
          {selectedLead ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg font-bold text-indigo-400">
                  {(selectedLead.lead?.customer_name || 'U').charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{selectedLead.lead?.customer_name || 'Sin nombre'}</h3>
                  <p className="text-xs text-gray-500">{selectedLead.lead?.phoneNumber}</p>
                </div>
                <button onClick={() => {
                  setEditingLead(!editingLead);
                  setEditForm({
                    name: selectedLead.lead?.customer_name || '',
                    email: selectedLead.lead?.email || '',
                    city: selectedLead.lead?.city || '',
                    zip_code: selectedLead.lead?.zip_code || '',
                  });
                }} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">
                  {editingLead ? '✕ Cancelar' : '✏️ Editar'}
                </button>
              </div>
              {editingLead && (
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-gray-500 mb-0.5">Nombre</label>
                      <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500 mb-0.5">Email</label>
                      <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500 mb-0.5">Ciudad</label>
                      <input value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500 mb-0.5">Código postal</label>
                      <input value={editForm.zip_code} onChange={(e) => setEditForm({...editForm, zip_code: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
                    </div>
                  </div>
                  <button onClick={async () => {
                    try {
                      await fetch(`${API_URL}/leads/import`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                        body: JSON.stringify({ leads: [{
                          phone: selectedLead.lead?.phoneNumber,
                          name: editForm.name,
                          email: editForm.email,
                          city: editForm.city,
                          zip_code: editForm.zip_code,
                        }] }),
                      });
                      setEditingLead(false);
                      loadDetail(selectedLead.lead?.phoneNumber);
                      fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
                        .then(r => r.json()).then(d => { setLeads(d.leads || []); });
                    } catch {}
                  }}
                    className="w-full py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 transition-all">
                    ✓ Guardar cambios
                  </button>
                </div>
              )}
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="font-medium">{selectedLead.lead?.lead_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interes</span>
                  <span className="font-medium">{selectedLead.lead?.service_of_interest}</span>
                </div>
                {selectedLead.lead?.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-indigo-400">{selectedLead.lead.email}</span>
                  </div>
                )}
                {selectedLead.lead?.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ciudad</span>
                    <span className="font-medium">{selectedLead.lead.city}</span>
                  </div>
                )}
                {selectedLead.lead?.zip_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Código postal</span>
                    <span className="font-medium">{selectedLead.lead.zip_code}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Visitas</span>
                  <span className="font-medium">{selectedLead.lead?.visit_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sesion</span>
                  <span className="font-medium">{selectedLead.session_state || '-'}</span>
                </div>
                {selectedLead.lead?.import_source && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Origen</span>
                    <span className="font-medium text-xs">{selectedLead.lead.import_source === 'csv_import' ? '📤 Importado' : selectedLead.lead.import_source}</span>
                  </div>
                )}
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
              {/* Asignación de agente */}
              {agentsList.length > 0 && (
                <div className="mb-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">🧑‍💼 Agente asignado</p>
                  <select
                    value={selectedLead.lead?.assigned_agent_id || ''}
                    onChange={(e) => assignAgent(selectedLead.lead?.phoneNumber, e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white">
                    <option value="">— Sin asignar —</option>
                    {agentsList.map((a: any) => (
                      <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                  {selectedLead.lead?.assigned_agent_name && (
                    <p className="text-[10px] text-indigo-400 mt-1">✓ Asignado a {selectedLead.lead.assigned_agent_name}</p>
                  )}
                </div>
              )}
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
              {/* Info de compra / envío — filtrado por crm_fields */}
              {crmFields.length > 0 && (
              <div className="mb-4 pt-4 border-t border-white/5">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">📦 Compra / Envío</p>
                    <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 space-y-2">
                    {[
                      { key: 'product_name', label: 'Producto', icon: '🏷️', type: servicesList.length > 0 ? 'catalog' : 'text' },
                      { key: 'purchase_date', label: 'Fecha compra', icon: '📅', type: 'date' },
                      { key: 'shipping_address', label: 'Dirección', icon: '📍', type: 'text' },
                      { key: 'carrier', label: 'Transportadora', icon: '🚚', type: 'select', options: ['', ...(activeCarriers.length > 0 ? activeCarriers.map(c => { const found = [['servientrega','Servientrega'],['coordinadora','Coordinadora'],['envia','Envia'],['interrapidisimo','Inter Rapidísimo'],['99minutos','99 Minutos'],['dhl','DHL'],['fedex','FedEx'],['estafeta','Estafeta'],['paquetexpress','Paquetexpress'],['redpack','Redpack'],['andreani','Andreani'],['chilexpress','Chilexpress']].find(([id]) => id === c); return found ? found[1] : c; }) : ['Servientrega', 'Coordinadora', 'Envia', 'DHL', 'FedEx', 'Otra'])] },
                      { key: 'tracking_number', label: 'Guía', icon: '📋', type: 'text' },
                      { key: 'shipping_status', label: 'Estado', icon: '📊', type: 'select', options: ['', 'preparando', 'despachado', 'en_camino', 'entregado', 'devuelto'] },
                      { key: 'renewal_date', label: 'Renovación', icon: '🔄', type: 'date' },
                      { key: 'renewal_frequency', label: 'Frecuencia', icon: '⏰', type: 'select', options: ['', 'mensual', 'trimestral', 'semestral', 'anual'] },
                    ].filter(f => crmFields.includes(f.key)).map((f) => {
                      const val = (selectedLead.lead?.purchase_info || {})[f.key] || '';
                      const save = (v: string) => {
                        if (v !== val) fetch(`${API_URL}/leads/purchase-info`, {
                          method: 'PUT', headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                          body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, [f.key]: v }),
                        });
                      };
                      return (
                        <div key={f.key} className="flex items-center gap-2">
                          <span className="text-xs w-4 shrink-0">{f.icon}</span>
                          <span className="text-[9px] text-gray-500 w-16 shrink-0">{f.label}</span>
                          {f.type === 'catalog' ? (
                            <select defaultValue={val} onChange={(e) => save(e.target.value)}
                              className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                              <option value="" className="bg-[#1a1f2e] text-white">—</option>
                              {servicesList.map(s => <option key={s.slug || s.name} value={s.name} className="bg-[#1a1f2e] text-white">{s.name}</option>)}
                            </select>
                          ) : f.type === 'select' ? (
                            <select defaultValue={val} onChange={(e) => save(e.target.value)}
                              className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                              {f.options?.map(o => <option key={o} value={o} className="bg-[#1a1f2e] text-white">{o ? o.replace(/_/g, ' ') : '—'}</option>)}
                            </select>
                          ) : (
                            <input type={f.type} defaultValue={val} onBlur={(e) => save(e.target.value)} placeholder={f.label}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none" />
                          )}
                        </div>
                      );
                    })}
                    {crmFields.includes('tracking_number') && selectedLead.lead?.purchase_info?.tracking_number && (() => {
                      const carrier = (selectedLead.lead.purchase_info.carrier || '').toLowerCase();
                      const tracking = selectedLead.lead.purchase_info.tracking_number;
                      const urls: Record<string, string> = {
                        servientrega: `https://www.servientrega.com/wps/portal/rastreo-envio/${tracking}`,
                        coordinadora: `https://www.coordinadora.com/rastreo-de-guia/?guia=${tracking}`,
                        envia: `https://www.envia.co/rastreo?guia=${tracking}`,
                        'inter rapidísimo': `https://www.interrapidisimo.com/rastreo/${tracking}`,
                        '99 minutos': `https://tracking.99minutos.com/${tracking}`,
                        dhl: `https://www.dhl.com/co-es/home/rastreo.html?tracking-id=${tracking}`,
                        fedex: `https://www.fedex.com/fedextrack/?trknbr=${tracking}`,
                        estafeta: `https://rastreo3.estafeta.com/Tracking/${tracking}`,
                        paquetexpress: `https://www.paquetexpress.com.mx/rastreo/${tracking}`,
                        redpack: `https://www.redpack.com.mx/rastreo/?guia=${tracking}`,
                        andreani: `https://www.andreani.com/#!/informacionEnvio/${tracking}`,
                        chilexpress: `https://www.chilexpress.cl/estado-de-envio/${tracking}`,
                      };
                      const providerKey = (activeCarriers.length === 1 ? activeCarriers[0] : '') || carrier;
                      const trackUrl = urls[providerKey] || `https://www.google.com/search?q=rastreo+${carrier}+${tracking}`;
                      return (
                        <a href={trackUrl} target="_blank"
                          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-bold transition-all">
                          🔍 Rastrear guía {tracking}
                        </a>
                      );
                    })()}
                  </div>
                </details>
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
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => navigator.clipboard.writeText(aiInsight.suggested_response)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold">
                            📋 Copiar
                          </button>
                          <button onClick={() => {
                            fetch(`${API_URL}/conversations/send`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                              body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, content: aiInsight.suggested_response }),
                            }).then(() => { loadDetail(selectedLead.lead?.phoneNumber); });
                          }}
                            className="text-[10px] text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg font-bold transition-all">
                            📤 Enviar por WhatsApp
                          </button>
                        </div>
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
                   <button onClick={() => {
                    let phone = selectedLead.lead?.phoneNumber || '';
                    phone = phone.replace(/[^0-9]/g, '');
                    if (phone.length <= 10) phone = '57' + phone;
                    if (selectedLead.session_state) {
                      const msg = prompt('Escribe tu mensaje (se envía desde el bot):', '¡Hola! Te escribimos desde nuestro equipo 😊');
                      if (!msg) return;
                      fetch(`${API_URL}/conversations/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                        body: JSON.stringify({ phone, content: msg }),
                      }).then(r => {
                        if (r.ok) alert('✅ Mensaje enviado desde el bot');
                        else alert('❌ Error enviando');
                      }).catch(() => alert('Error de conexión'));
                    } else {
                      const msg = encodeURIComponent('¡Hola! Te escribimos desde nuestro equipo 😊');
                      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                    }
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold transition-all">
                    💬 {selectedLead.session_state ? 'Enviar WhatsApp' : 'Abrir WhatsApp'}
                  </button>
                  <button onClick={() => {
                    const service = selectedLead.lead?.service_of_interest || '';
                    const defaultAmount = prompt('💳 Monto a cobrar (puedes editarlo para descuentos):', '0');
                    if (!defaultAmount || defaultAmount === '0') return;
                    const description = prompt('Descripción del pago:', service || 'Pago');
                    if (!description) return;
                    let phone = selectedLead.lead?.phoneNumber || '';
                    phone = phone.replace(/[^0-9]/g, '');
                    if (phone.length <= 10) phone = '57' + phone;
                    fetch(`${API_URL}/payments/generate-link`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                      body: JSON.stringify({ phone, amount: parseInt(defaultAmount), description }),
                    }).then(r => r.json()).then(data => {
                      if (data.url) {
                        fetch(`${API_URL}/conversations/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                          body: JSON.stringify({ phone, content: `🛒 *${description}*\n\n💰 Monto: $${parseInt(defaultAmount).toLocaleString()}\n\n👉 ${data.url}\n\n🔒 Pago 100% seguro` }),
                        });
                        alert('✅ Link de pago enviado por WhatsApp');
                      } else {
                        alert('❌ Error: ' + (data.error || 'No se pudo generar el link'));
                      }
                    }).catch(() => alert('Error de conexión'));
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold transition-all">
                    💳 Link pago
                  </button>
                  <button onClick={() => {
                    if (selectedLead.lead?.phoneNumber) {
                      updateStage(selectedLead.lead.phoneNumber, 'contactado');
                      setNewNote('Contactado por el asesor');
                      addNote(selectedLead.lead.phoneNumber);
                    }
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white font-bold transition-all">
                    📞 Contactado
                  </button>
                  <button onClick={async () => {
                    if (!confirm('¿Eliminar este lead? Esta acción no se puede deshacer.')) return;
                    try {
                      await fetch(`${API_URL}/leads/delete?phone=${selectedLead.lead?.phoneNumber}`, {
                        method: 'DELETE',
                        headers: { 'client-id': user?.companyId || '' },
                      });
                      setShowDetail(false);
                      setSelectedLead(null);
                      fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
                        .then(r => r.json()).then(d => { setLeads(d.leads || []); });
                    } catch {}
                  }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-bold transition-all">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
              {/* Mensajes rápidos */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">⚡ Mensajes rápidos</p>
                    <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { icon: '👋', label: 'Saludo', msg: `¡Hola! ¿Cómo estás? Te escribimos para darte información sobre nuestros servicios. ¿En qué podemos ayudarte? 😊` },
                      { icon: '💰', label: 'Precio', msg: `El valor de ${selectedLead.lead?.service_of_interest || 'nuestro servicio'} es muy accesible. ¿Te gustaría conocer los detalles y opciones de pago? 💳` },
                      { icon: '📅', label: 'Agendar', msg: `¡Perfecto! ¿Te gustaría agendar tu cita? Tenemos disponibilidad esta semana. Solo necesito confirmar fecha y hora 📅` },
                      { icon: '🔥', label: 'Urgencia', msg: `¡Hola! Solo quería recordarte que los cupos son limitados y se están llenando rápido. Si quieres asegurar tu lugar, te puedo enviar el enlace de pago ahora mismo 🎯` },
                      { icon: '🙏', label: 'Seguimiento', msg: `¡Hola! ¿Pudiste revisar la información que te envié? Quedo atento a cualquier duda que tengas. ¡Estoy aquí para ayudarte! 🙋‍♂️` },
                      { icon: '⭐', label: 'Reseña', msg: `¡Hola! Esperamos que hayas tenido una excelente experiencia. ¿Nos podrías regalar una reseña? Tu opinión nos ayuda mucho ⭐` },
                    ].map((tpl, i) => (
                      <button key={i} onClick={(e) => {
                        const btn = e.currentTarget;
                        const icon = btn.querySelector('.send-icon') as HTMLElement;
                        if (icon) icon.textContent = '⏳';
                        fetch(`${API_URL}/conversations/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                          body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, content: tpl.msg }),
                        }).then((res) => {
                          if (icon) icon.textContent = res.ok ? '✅' : '❌';
                          setTimeout(() => { if (icon) icon.textContent = '📤'; }, 2000);
                          loadDetail(selectedLead.lead?.phoneNumber);
                        }).catch(() => { if (icon) icon.textContent = '❌'; setTimeout(() => { if (icon) icon.textContent = '📤'; }, 2000); });
                      }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all">
                        <span className="text-sm">{tpl.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-white">{tpl.label}</p>
                          <p className="text-[9px] text-gray-500 truncate">{tpl.msg}</p>
                        </div>
                        <span className="send-icon text-[9px] text-gray-600 shrink-0">📤</span>
                      </button>
                    ))}
                  </div>
                </details>
              </div>
             {/* Recordatorios */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <details className="group" open>
                  <summary className="flex items-center justify-between cursor-pointer list-none mb-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">⏰ Recordatorios</p>
                    <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="space-y-2">
                    {/* Formulario nuevo recordatorio */}
                    <div className="flex gap-1">
                      <input id="rem-text" placeholder="Ej: Llamar para seguimiento..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-indigo-500 text-white" />
                      <input id="rem-date" type="datetime-local"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-indigo-500 text-white" />
                      <button onClick={() => {
                        const text = (document.getElementById('rem-text') as HTMLInputElement)?.value?.trim();
                        const dateVal = (document.getElementById('rem-date') as HTMLInputElement)?.value;
                        if (!text || !dateVal) return;
                        const remind_at = Math.floor(new Date(dateVal).getTime() / 1000);
                        fetch(`${API_URL}/leads/reminder`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                          body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, text, remind_at, type: 'follow_up' }),
                        }).then(() => {
                          (document.getElementById('rem-text') as HTMLInputElement).value = '';
                          (document.getElementById('rem-date') as HTMLInputElement).value = '';
                          loadDetail(selectedLead.lead?.phoneNumber);
                        });
                      }}
                        className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2 py-1.5 rounded-lg font-bold transition-all">⏰</button>
                    </div>
                    {/* Lista de recordatorios */}
                    {(selectedLead.lead?.reminders || []).map((r: any, i: number) => {
                      const isOverdue = !r.completed && r.remind_at < Date.now() / 1000;
                      const date = new Date(r.remind_at * 1000);
                      return (
                        <div key={i} className={`text-[10px] p-2 rounded-lg border flex items-start gap-2 ${
                          r.completed ? 'bg-white/[0.01] border-white/5 opacity-50' :
                          isOverdue ? 'bg-red-500/10 border-red-500/20' :
                          'bg-yellow-500/5 border-yellow-500/10'
                        }`}>
                          <span className="mt-0.5">{r.completed ? '✅' : isOverdue ? '🔴' : '🟡'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`${r.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>{r.text}</p>
                            <p className="text-gray-500 mt-0.5">
                              {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {!r.completed && (
                              <button onClick={() => {
                                fetch(`${API_URL}/leads/reminder`, {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                                  body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, reminder_id: r.id, action: 'complete' }),
                                }).then(() => loadDetail(selectedLead.lead?.phoneNumber));
                              }} className="text-emerald-400 hover:text-emerald-300 font-bold">✓</button>
                            )}
                            <button onClick={() => {
                              fetch(`${API_URL}/leads/reminder`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                                body: JSON.stringify({ phone: selectedLead.lead?.phoneNumber, reminder_id: r.id, action: 'delete' }),
                              }).then(() => loadDetail(selectedLead.lead?.phoneNumber));
                            }} className="text-red-400 hover:text-red-300 font-bold">×</button>
                          </div>
                        </div>
                      );
                    })}
                    {!(selectedLead.lead?.reminders || []).length && (
                      <p className="text-[10px] text-gray-600 text-center py-2">Sin recordatorios</p>
                    )}
                  </div>
                </details>
              </div>
              {/* Notas privadas del equipo */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <details className="group" open>
                  <summary className="flex items-center justify-between cursor-pointer list-none mb-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">🔒 Notas del equipo (privadas)</p>
                    <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="flex gap-1 mb-2">
                    <input value={newPrivateNote} onChange={(e) => setNewPrivateNote(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && newPrivateNote.trim()) addPrivateNote(selectedLead.lead?.phoneNumber); }}
                      placeholder="Nota interna, solo la ve tu equipo..."
                      className="flex-1 bg-white/5 border border-yellow-500/20 rounded-lg px-3 py-2 text-xs outline-none focus:border-yellow-500 text-white" />
                    <button onClick={() => addPrivateNote(selectedLead.lead?.phoneNumber)}
                      disabled={!newPrivateNote.trim() || savingPrivateNote}
                      className="text-xs bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white px-3 py-2 rounded-lg font-bold transition-all disabled:opacity-30">
                      {savingPrivateNote ? '...' : '🔒'}
                    </button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {privateNotes.map((n: any, i: number) => (
                      <div key={i} className="text-[10px] p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                        <p className="text-gray-300">{n.text}</p>
                        <p className="text-gray-500 mt-1">
                          🧑‍💼 {n.author_name} • {new Date((n.created_at || 0) * 1000).toLocaleDateString()} {new Date((n.created_at || 0) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    ))}
                    {!privateNotes.length && <p className="text-[10px] text-gray-600 text-center py-2">Sin notas privadas</p>}
                  </div>
                </details>
              </div>
              {/* Historial de transferencias */}
              {(selectedLead.lead?.agent_history || []).length > 0 && (
                <div className="mb-4 pt-4 border-t border-white/5">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none mb-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">🔄 Historial de agentes</p>
                      <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {[...(selectedLead.lead?.agent_history || [])].reverse().map((h: any, i: number) => (
                        <div key={i} className="text-[10px] p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                          <p className="text-gray-300">
                            {h.action === 'assigned' && <>➕ Asignado a <strong>{h.new_agent_name}</strong></>}
                            {h.action === 'transferred' && <>🔄 <strong>{h.prev_agent_name}</strong> → <strong>{h.new_agent_name}</strong></>}
                            {h.action === 'unassigned' && <>➖ Desasignado de <strong>{h.prev_agent_name}</strong></>}
                          </p>
                          {h.reason && <p className="text-gray-500 text-[9px] mt-0.5">Motivo: {h.reason}</p>}
                          <p className="text-gray-600 text-[9px] mt-0.5">
                            {new Date((h.timestamp || 0) * 1000).toLocaleDateString()} {new Date((h.timestamp || 0) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
              {/* Notas privadas del equipo */}
              <div className="mb-4 pt-4 border-t border-white/5">
                <details className="group" open>
                  <summary className="flex items-center justify-between cursor-pointer list-none mb-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">🔒 Notas del equipo (privadas)</p>
                    <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="flex gap-1 mb-2">
                    <input value={newPrivateNote} onChange={(e) => setNewPrivateNote(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && newPrivateNote.trim()) addPrivateNote(selectedLead.lead?.phoneNumber); }}
                      placeholder="Nota interna, solo la ve tu equipo..."
                      className="flex-1 bg-white/5 border border-yellow-500/20 rounded-lg px-3 py-2 text-xs outline-none focus:border-yellow-500 text-white" />
                    <button onClick={() => addPrivateNote(selectedLead.lead?.phoneNumber)}
                      disabled={!newPrivateNote.trim() || savingPrivateNote}
                      className="text-xs bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white px-3 py-2 rounded-lg font-bold transition-all disabled:opacity-30">
                      {savingPrivateNote ? '...' : '🔒'}
                    </button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {privateNotes.map((n: any, i: number) => (
                      <div key={i} className="text-[10px] p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                        <p className="text-gray-300">{n.text}</p>
                        <p className="text-gray-500 mt-1">
                          🧑‍💼 {n.author_name} • {new Date((n.created_at || 0) * 1000).toLocaleDateString()} {new Date((n.created_at || 0) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    ))}
                    {!privateNotes.length && <p className="text-[10px] text-gray-600 text-center py-2">Sin notas privadas</p>}
                  </div>
                </details>
              </div>
              {/* Historial de transferencias */}
              {(selectedLead.lead?.agent_history || []).length > 0 && (
                <div className="mb-4 pt-4 border-t border-white/5">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none mb-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">🔄 Historial de agentes</p>
                      <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {[...(selectedLead.lead?.agent_history || [])].reverse().map((h: any, i: number) => (
                        <div key={i} className="text-[10px] p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                          <p className="text-gray-300">
                            {h.action === 'assigned' && <>➕ Asignado a <strong>{h.new_agent_name}</strong></>}
                            {h.action === 'transferred' && <>🔄 <strong>{h.prev_agent_name}</strong> → <strong>{h.new_agent_name}</strong></>}
                            {h.action === 'unassigned' && <>➖ Desasignado de <strong>{h.prev_agent_name}</strong></>}
                          </p>
                          {h.reason && <p className="text-gray-500 text-[9px] mt-0.5">Motivo: {h.reason}</p>}
                          <p className="text-gray-600 text-[9px] mt-0.5">
                            {new Date((h.timestamp || 0) * 1000).toLocaleDateString()} {new Date((h.timestamp || 0) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
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
      </div>
      )}
    </div>
  );
}