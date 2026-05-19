'use client';
import { useState, useEffect } from 'react';
import LeadCard from '../../components/LeadCard';
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
  const [reportingMeta, setReportingMeta] = useState(false);
  const [syncingMeta, setSyncingMeta] = useState(false);
  const [syncMetaResult, setSyncMetaResult] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  // MP-4.5: PII pendientes de revisión
  const [piiPending, setPiiPending] = useState<any[]>([]);
  const [piiModalItem, setPiiModalItem] = useState<any>(null);
  const [piiActionLoading, setPiiActionLoading] = useState(false);
  const [piiDiscardReason, setPiiDiscardReason] = useState('');
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
    // Cargar campañas para resolver campaign_id → nombre en tarjeta + dropdown
    fetch(`${API_URL}/ads/campaigns`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setCampaignsList(data.campaigns || []))
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
  // MP-4.5: cargar PII pendientes + polling 30s
  useEffect(() => {
    if (!user?.companyId) return;
    const loadPiiPending = () => {
      fetch(`${API_URL}/pii/pending?limit=100`, { headers: { 'client-id': user.companyId } })
        .then(res => res.json())
        .then(data => setPiiPending(data.items || []))
        .catch(() => {});
    };
    loadPiiPending();
    const piiInterval = setInterval(loadPiiPending, 30000);
    return () => clearInterval(piiInterval);
  }, [user?.companyId]);
  // MP-4.5: confirmar PII manualmente
  const confirmPiiManual = async (contactId: string) => {
    setPiiActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/pii/confirm-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ contact_id: contactId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPiiModalItem(null);
        setPiiPending(piiPending.filter((p: any) => p.contact_id !== contactId));
        alert('✅ Datos confirmados');
      } else {
        alert('⚠️ ' + (data.error || 'No se pudo confirmar'));
      }
    } catch {
      alert('❌ Error de conexión');
    }
    setPiiActionLoading(false);
  };
  // MP-4.5: descartar PII (cliente debe rellenar de nuevo)
  const discardPii = async (contactId: string) => {
    if (!piiDiscardReason.trim() || piiDiscardReason.trim().length < 5) {
      alert('Escribe una razón breve (mínimo 5 caracteres) — ayuda a auditar después.');
      return;
    }
    setPiiActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/pii/discard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ contact_id: contactId, reason: piiDiscardReason.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setPiiModalItem(null);
        setPiiDiscardReason('');
        setPiiPending(piiPending.filter((p: any) => p.contact_id !== contactId));
        alert('✅ Datos descartados. El cliente puede rellenar de nuevo.');
      } else {
        alert('⚠️ ' + (data.error || 'No se pudo descartar'));
      }
    } catch {
      alert('❌ Error de conexión');
    }
    setPiiActionLoading(false);
  };
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
    } catch (e) {
      alert('No se pudo descargar la plantilla. Intenta de nuevo.');
      console.error(e);
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
          if (!r) continue;
          const phone = String(r[3] || '').replace(/\D/g, '');
          // Saltar fila de ejemplo
          if (i === 1 && String(r[0] || '').toLowerCase() === 'juan carlos') continue;
          // Saltar filas sin teléfono válido (sin error — simplemente las ignora)
          if (!phone || phone.length < 7) continue;
          rows.push({
            first_name: String(r[0] || '').trim(),
            last_name: String(r[1] || '').trim(),
            document: String(r[2] || '').trim(),
            phone,
            email: String(r[4] || '').trim().toLowerCase(),
            service_name: String(r[5] || '').trim(),
            amount: r[6] ? String(r[6]).replace(/[^\d.]/g, '') : '',
            currency: String(r[7] || '').trim().toUpperCase() || 'COP',
            purchase_date: String(r[8] || '').trim().slice(0, 10),
            campaign_id: String(r[9] || '').trim(),
          });
        }
        if (!rows.length) {
          const totalRows = jsonRows.length - 1;
          alert(`No encontramos ventas válidas en el archivo.\n\nFilas procesadas: ${totalRows}\nFilas saltadas: ${totalRows} (todas sin teléfono válido)\n\nVerifica que:\n- La columna "Celular" (columna D) tenga números con indicativo (ej: 573001234567) o sin indicativo (ej: 3001234567)\n- Estás usando la plantilla descargada desde el sistema\n- La hoja se llama "Ventas"`);
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
        body: JSON.stringify({ 
          rows: selectedCampaign 
            ? salesRows.map((r: any) => ({ ...r, campaign_id: r.campaign_id || selectedCampaign.campaign_id }))
            : salesRows,
        }),
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
  // === Reportar venta individual a Meta CAPI ===
  const handleReportToMeta = async () => {
    if (!selectedLead?.lead?.phoneNumber) return;
    setReportingMeta(true);
    try {
      const lead = selectedLead.lead;
      const payment = selectedLead.payment;
      const body: any = {
        phone: lead.phoneNumber,
        email: lead.email || '',
        first_name: (lead.customer_name || '').split(' ')[0] || '',
        last_name: (lead.customer_name || '').split(' ').slice(1).join(' ') || '',
        city: lead.city || '',
        zip_code: lead.zip_code || '',
        service_slug: (lead.purchase_info?.product_name || lead.service_of_interest || '').toLowerCase().replace(/\s+/g, '-'),
        amount: payment?.amount || 0,
        currency: payment?.currency || 'COP',
        purchase_date: new Date().toISOString().split('T')[0],
      };
      const res = await fetch(`${API_URL}/leads/report-purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok || data.capi_sent) {
        alert('✅ Venta reportada a Meta. El algoritmo actualizará las campañas.');
      } else {
        alert('⚠️ ' + (data.error || 'Meta no confirmó el evento. Verifica el pixel en configuración.'));
      }
    } catch {
      alert('❌ Error de conexión al reportar a Meta.');
    }
    setReportingMeta(false);
  };
  // === Sync masivo de ventas pagadas a Meta CAPI ===
  const handleSyncMeta = async () => {
    if (!confirm('¿Enviar todas las ventas pagadas a Meta CAPI?\n\nSolo se enviarán las que no se hayan enviado antes (deduplicación automática).')) return;
    setSyncingMeta(true);
    setSyncMetaResult(null);
    try {
      const res = await fetch(`${API_URL}/leads/sync-meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
      });
      const data = await res.json();
      setSyncMetaResult(data);
    } catch {
      setSyncMetaResult({ error: 'Error de conexión' });
    }
    setSyncingMeta(false);
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
      if ((newLead as any).campaign_id) lead.campaign_id = (newLead as any).campaign_id;
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
          <button onClick={() => { 
            setShowSalesImport(!showSalesImport); 
            setShowImport(false); 
            setShowAddLead(false);
            if (!showSalesImport && campaignsList.length === 0) {
              setLoadingCampaigns(true);
              fetch(`${API_URL}/ads/campaigns`, { headers: { 'client-id': user?.companyId || '' } })
                .then(r => r.json())
                .then(data => { setCampaignsList(data.campaigns || []); setLoadingCampaigns(false); })
                .catch(() => setLoadingCampaigns(false));
            }
          }}
            className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            title="Subir historial de ventas para enviar Purchase events a Meta">
            💰 Ventas
          </button>
          <button onClick={handleSyncMeta} disabled={syncingMeta}
            className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 hidden sm:block"
            title="Sincronizar todas las ventas pagadas con Meta CAPI">
            {syncingMeta ? '⏳ Sincronizando...' : '📤 Sync Meta'}
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
            <button onClick={() => { setShowSalesImport(false); setSalesRows([]); setSalesResult(null); setSelectedCampaign(null); }}
              className="text-gray-500 hover:text-white text-lg">✕</button>
          </div>
          {/* Paso 0: Seleccionar campaña */}
          <div className="bg-white/[0.02] border border-indigo-500/10 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold mb-1">Paso 0 — ¿De qué campaña son estas ventas? <span className="text-gray-500 font-normal">(recomendado)</span></p>
            <p className="text-[10px] text-gray-500 mb-3">Selecciona la campaña para que Meta atribuya correctamente estas ventas y calcule el ROAS real.</p>
            {loadingCampaigns ? (
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Cargando campañas...
              </div>
            ) : campaignsList.length === 0 ? (
              <p className="text-[10px] text-gray-600">No hay campañas. Puedes continuar sin seleccionar.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <div onClick={() => setSelectedCampaign(null)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border transition-all ${
                    !selectedCampaign ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                  }`}>
                  <span className="text-[10px] text-gray-400">Sin atribución (ventas orgánicas)</span>
                  {!selectedCampaign && <span className="text-indigo-400 text-[10px] font-bold">✓</span>}
                </div>
                {campaignsList.map((c: any) => (
                  <div key={c.campaign_id} onClick={() => setSelectedCampaign(c)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border transition-all ${
                      selectedCampaign?.campaign_id === c.campaign_id
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium truncate">{c.name}</p>
                      <p className={`text-[9px] mt-0.5 ${c.connected_to_bot ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {c.connected_to_bot ? '✅ Conectada al bot — ROAS medible' : '⚠️ Otro canal — ROAS estimado'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>{c.status === 'ACTIVE' ? '🟢' : '⏸️'}</span>
                      {selectedCampaign?.campaign_id === c.campaign_id && <span className="text-indigo-400 font-bold text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedCampaign && (
              <p className="text-[10px] text-indigo-400 mt-2 font-bold">✓ {selectedCampaign.name}</p>
            )}
          </div>
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
                    <span>🏷️ {row.service_name || '—'}</span>
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
      {syncMetaResult && (
        <div className={`mb-4 p-4 rounded-2xl border ${syncMetaResult.error ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
          <div className="flex justify-between items-start">
            <div>
              {syncMetaResult.error ? (
                <p className="text-red-400 text-sm font-bold">❌ {syncMetaResult.error}</p>
              ) : (
                <>
                  <p className="text-blue-400 font-bold text-sm mb-1">📤 Sync Meta completado</p>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p>📊 Total ventas pagadas: <strong className="text-white">{syncMetaResult.total}</strong></p>
                    <p>✅ Nuevos eventos enviados: <strong className="text-emerald-400">{syncMetaResult.sent}</strong></p>
                    <p>♻️ Ya sincronizados: <strong className="text-gray-300">{syncMetaResult.dedup}</strong></p>
                    {syncMetaResult.failed > 0 && <p>⚠️ Fallidos: <strong className="text-yellow-400">{syncMetaResult.failed}</strong></p>}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setSyncMetaResult(null)} className="text-gray-500 hover:text-white text-lg ml-4">✕</button>
          </div>
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
            {/* Dropdown de campaña — visible siempre para atribución */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">📢 Campaña de origen <span className="text-gray-600 normal-case">(para atribución Meta)</span></label>
              <select value={(newLead as any).campaign_id || ''} onChange={(e: any) => setNewLead({...newLead, campaign_id: e.target.value} as any)}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                <option value="" className="bg-[#1a1f2e] text-white">📱 Orgánico / directo (sin campaña)</option>
                {campaignsList.map((c: any) => (
                  <option key={c.campaign_id || c.id} value={c.campaign_id || c.id} className="bg-[#1a1f2e] text-white">
                    {c.status === 'ACTIVE' ? '🟢' : '⏸️'} {c.name}
                  </option>
                ))}
              </select>
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
      {/* MP-4.5: Banner de PII Pendientes de Revisión */}
      {piiPending.length > 0 && (
        <div className="mb-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
                📋 {piiPending.length} {piiPending.length === 1 ? 'cliente' : 'clientes'} con datos pendientes de revisión
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                El cliente terminó de llenar el formulario PII. Confirma para enviarlos a Meta CAPI o descártalos si hay errores.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
            {piiPending.slice(0, 9).map((item: any) => {
              const captured = item.pii_review_captured_at || 0;
              const minsAgo = captured ? Math.floor((Date.now() / 1000 - captured) / 60) : 0;
              return (
                <div key={item.contact_id} onClick={() => setPiiModalItem(item)}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/40 rounded-xl p-3 cursor-pointer transition-all">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[11px] font-bold truncate flex-1">{item.full_name || 'Sin nombre'}</p>
                    {item.asistente_total > 1 && (
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full shrink-0">
                        {item.asistente_num}/{item.asistente_total}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">📞 {item.phone_normalized || item.contact_id}</p>
                  {item.email && <p className="text-[10px] text-gray-500 truncate">📧 {item.email}</p>}
                  {(item.city || item.country) && (
                    <p className="text-[10px] text-gray-500 truncate">📍 {[item.city, item.country].filter(Boolean).join(', ')}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      item.pii_review_status === 'EDITING'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.pii_review_status === 'EDITING' ? '✏️ Editando' : '⏳ Esperando confirmación'}
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {minsAgo < 60 ? `${minsAgo}m` : `${Math.floor(minsAgo / 60)}h`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {piiPending.length > 9 && (
            <p className="text-[10px] text-gray-500 mt-2 text-center">+ {piiPending.length - 9} más</p>
          )}
        </div>
      )}
      {/* MP-4.5: Modal de detalle PII pendiente */}
      {piiModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => !piiActionLoading && setPiiModalItem(null)}>
          <div className="bg-[#0B0F1A] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-white">📋 Revisar datos del cliente</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {piiModalItem.asistente_total > 1
                    ? `Asistente ${piiModalItem.asistente_num} de ${piiModalItem.asistente_total}`
                    : 'Titular'}
                </p>
              </div>
              <button onClick={() => !piiActionLoading && setPiiModalItem(null)} className="text-gray-500 hover:text-white text-lg shrink-0">✕</button>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">👤 Nombre</span>
                <span className="font-medium text-right">{piiModalItem.full_name || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">🆔 Documento</span>
                <span className="font-medium text-right">{piiModalItem.document_id || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">📧 Email</span>
                <span className="font-medium text-right text-indigo-400 truncate">{piiModalItem.email || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">📞 WhatsApp</span>
                <span className="font-medium text-right">{piiModalItem.phone_normalized ? `+${piiModalItem.phone_normalized}` : (piiModalItem.phone_alt || '—')}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">📍 Ubicación</span>
                <span className="font-medium text-right">
                  {[piiModalItem.city, piiModalItem.region, piiModalItem.country].filter(Boolean).join(', ') || '—'}
                </span>
              </div>
              {piiModalItem.payment_ref && (
                <div className="flex justify-between gap-3 pt-2 border-t border-white/5">
                  <span className="text-gray-500 shrink-0">💳 Pago ref</span>
                  <span className="font-medium text-right text-[10px] text-emerald-400 truncate font-mono">{piiModalItem.payment_ref}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 pt-2 border-t border-white/5">
                <span className="text-gray-500 shrink-0">📱 Contacto</span>
                <span className="font-medium text-right text-[10px] text-gray-400 font-mono">{piiModalItem.contact_id}</span>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-amber-300">
                <strong>✅ Confirmar:</strong> persiste los datos finales en el CRM + envía Lead enriquecido a Meta CAPI + email de confirmación al cliente.
              </p>
              <p className="text-[10px] text-amber-300 mt-2">
                <strong>❌ Descartar:</strong> elimina los datos del buffer. El cliente verá que debe rellenar de nuevo el formulario.
              </p>
            </div>
            <div className="mb-3">
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Razón del descarte (opcional)</label>
              <input
                value={piiDiscardReason}
                onChange={(e) => setPiiDiscardReason(e.target.value)}
                placeholder="Ej: Email mal escrito, cliente debe corregir"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500 text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => discardPii(piiModalItem.contact_id)}
                disabled={piiActionLoading}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
                {piiActionLoading ? '⏳' : '❌ Descartar'}
              </button>
              <button
                onClick={() => confirmPiiManual(piiModalItem.contact_id)}
                disabled={piiActionLoading}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50">
                {piiActionLoading ? '⏳ Confirmando...' : '✅ Confirmar y enviar'}
              </button>
            </div>
          </div>
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
          {selectedLead?.lead?.phoneNumber && (
            <LeadCard
              phone={selectedLead.lead.phoneNumber}
              companyId={user?.companyId || ''}
              onClose={closeDetail}
              onRefresh={() => {
                fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
                  .then(r => r.json()).then(d => setLeads(d.leads || []));
              }}
              variant="crm"
              agentsList={agentsList}
              campaignsList={campaignsList}
              servicesList={servicesList}
              crmFields={crmFields}
              activeCarriers={activeCarriers}
            />
          )}
        </div>
      </div>
      )}
    </div>
  );
}