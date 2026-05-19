'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface LeadCardProps {
  phone: string;
  companyId: string;
  onClose: () => void;
  onRefresh?: () => void;
  variant?: 'crm' | 'chat';
  agentsList?: any[];
  campaignsList?: any[];
  servicesList?: any[];
  crmFields?: string[];
  activeCarriers?: string[];
}
export default function LeadCard({
  phone, companyId, onClose, onRefresh,
  variant = 'crm', agentsList = [], campaignsList = [],
  servicesList = [], crmFields = [], activeCarriers = [],
}: LeadCardProps) {
  const [lead, setLead] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [sessionState, setSessionState] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', city: '', zip_code: '' });
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [privateNotes, setPrivateNotes] = useState<any[]>([]);
  const [newPrivateNote, setNewPrivateNote] = useState('');
  const [savingPrivateNote, setSavingPrivateNote] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [reportingMeta, setReportingMeta] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminders, setReminders] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const h = { 'Content-Type': 'application/json', 'client-id': companyId };
  // === Carga autónoma de datos ===
  const loadData = async () => {
    setLoading(true);
    try {
      const [leadRes, notesRes, remindersRes] = await Promise.all([
        fetch(`${API_URL}/leads?phone=${phone}`, { headers: h }),
        fetch(`${API_URL}/leads/private-notes?phone=${phone}`, { headers: h }),
        fetch(`${API_URL}/leads/reminders?phone=${phone}`, { headers: h }).catch(() => ({ json: async () => ({}) })),
      ]);
      const leadData = await leadRes.json();
      const notesData = await notesRes.json();
      const remData = await remindersRes.json();
      setLead(leadData.lead || {});
      setPayment(leadData.payment || null);
      setSessionState(leadData.session_state || '');
      setNotes(leadData.lead?.notes || []);
      setPrivateNotes(notesData.notes || []);
      setReminders(remData.reminders || []);
      // Timeline desde AuditLog (si existe)
      try {
        const tlRes = await fetch(`${API_URL}/leads/timeline?phone=${phone}`, { headers: h });
        if (tlRes.ok) {
          const tlData = await tlRes.json();
          setTimeline(tlData.events || []);
        }
      } catch {}
    } catch (e) {
      console.error('LeadCard loadData error:', e);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (phone && companyId) loadData();
  }, [phone, companyId]);
  // === Helpers de resolución de datos ===
  const l = lead || {};
  const p = payment || {};
  const name = l.customer_name || l.customer_full_name || l.wa_profile_name || 'Sin nombre';
  const email = l.customer_email || l.email || p.customer_email || '';
  const doc = l.customer_document_number || l.customer_dni || p.customer_dni || '';
  const city = l.customer_city || l.city || p.customer_city || '';
  const region = l.customer_region || '';
  const country = l.customer_country || '';
  const zip = l.zip_code || '';
  const phoneNorm = l.phone_normalized || '';
  const pax = p.pax_count || 0;
  const campId = l.source_first_campaign_id || '';
  const campName = (() => {
    if (!campId) return '';
    const c = campaignsList.find((c: any) => c.campaign_id === campId || c.id === campId);
    return c?.name || l.source_first_campaign_name || '';
  })();
  const clid = l.source_first_ctwa_clid || '';
  const sourceUrl = l.source_first_url || '';
  // === Acciones ===
  const updateStage = async (stage: string) => {
    await fetch(`${API_URL}/leads/stage`, { method: 'PUT', headers: h, body: JSON.stringify({ phone, stage }) });
    loadData();
    onRefresh?.();
  };
  const updateTags = async (action: string, tags: string[]) => {
    await fetch(`${API_URL}/leads/tags`, { method: 'PUT', headers: h, body: JSON.stringify({ phone, action, tags }) });
    loadData();
    onRefresh?.();
  };
  const assignAgent = async (agentId: string) => {
    await fetch(`${API_URL}/agents/assign-lead`, { method: 'PUT', headers: h, body: JSON.stringify({ phone, agent_id: agentId }) });
    loadData();
    onRefresh?.();
  };
  const saveEdit = async () => {
    await fetch(`${API_URL}/leads/import`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ leads: [{ phone, name: editForm.name, email: editForm.email, city: editForm.city, zip_code: editForm.zip_code }] }),
    });
    setEditing(false);
    loadData();
    onRefresh?.();
  };
  const addNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch(`${API_URL}/leads/notes`, { method: 'POST', headers: h, body: JSON.stringify({ phone, text: newNote.trim() }) });
    setNewNote('');
    setSavingNote(false);
    loadData();
  };
  const addPrivateNote = async () => {
    if (!newPrivateNote.trim()) return;
    setSavingPrivateNote(true);
    await fetch(`${API_URL}/leads/private-notes`, { method: 'POST', headers: h, body: JSON.stringify({ phone, text: newPrivateNote.trim(), author_name: '' }) });
    setNewPrivateNote('');
    setSavingPrivateNote(false);
    const res = await fetch(`${API_URL}/leads/private-notes?phone=${phone}`, { headers: h });
    const data = await res.json();
    setPrivateNotes(data.notes || []);
  };
  const loadAi = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch(`${API_URL}/leads/ai-insight?phone=${phone}`, { headers: h });
      const data = await res.json();
      setAiInsight(data);
      if (data.close_probability) {
        fetch(`${API_URL}/leads/score`, { method: 'PUT', headers: h, body: JSON.stringify({ phone, score: data.close_probability }) });
      }
      if (data.tags?.length > 0) {
        await fetch(`${API_URL}/leads/tags`, { method: 'PUT', headers: h, body: JSON.stringify({ phone, action: 'add', tags: data.tags }) });
        loadData();
      }
    } catch {}
    setLoadingAi(false);
  };
  const reportToMeta = async () => {
    setReportingMeta(true);
    try {
      const body = {
        phone, email, first_name: name.split(' ')[0] || '', last_name: name.split(' ').slice(1).join(' ') || '',
        city, zip_code: zip, service_slug: (l.service_of_interest || '').toLowerCase().replace(/\s+/g, '-'),
        amount: p.amount || 0, currency: p.currency || 'COP', purchase_date: new Date().toISOString().split('T')[0],
      };
      const res = await fetch(`${API_URL}/leads/report-purchase`, { method: 'POST', headers: h, body: JSON.stringify(body) });
      const data = await res.json();
      alert(data.ok || data.capi_sent ? '✅ Venta reportada a Meta' : '⚠️ ' + (data.error || 'Error'));
    } catch { alert('❌ Error de conexión'); }
    setReportingMeta(false);
  };
  const generatePaymentLink = async () => {
    const amount = prompt('💳 Monto del link de pago (COP):', '250000');
    if (!amount || isNaN(Number(amount))) return;
    const desc = prompt('Descripción:', p.service_name || l.service_of_interest || 'Pago');
    if (!desc) return;
    try {
      const res = await fetch(`${API_URL}/payments/generate-link`, {
        method: 'POST', headers: h, body: JSON.stringify({ phone, amount: Number(amount), description: desc }),
      });
      const data = await res.json();
      if (res.ok && data.payment_url) {
        await fetch(`${API_URL}/conversations/send`, {
          method: 'POST', headers: h,
          body: JSON.stringify({ phone, content: `💳 *Link de pago*\n\n${desc}\n💰 $${Number(amount).toLocaleString()} COP\n\n👉 ${data.payment_url}\n\n🔒 Pago seguro` }),
        });
        alert('✅ Link enviado al cliente');
      } else {
        alert('⚠️ ' + (data.error || 'No se pudo generar'));
      }
    } catch { alert('❌ Error de conexión'); }
  };
  const sendQuickMessage = async (msg: string) => {
    await fetch(`${API_URL}/conversations/send`, { method: 'POST', headers: h, body: JSON.stringify({ phone, content: msg }) });
    alert('✅ Mensaje enviado');
  };
  const deleteLead = async () => {
    if (!confirm('¿Eliminar este lead? Esta acción no se puede deshacer.')) return;
    await fetch(`${API_URL}/leads/delete`, { method: 'DELETE', headers: h, body: JSON.stringify({ phone }) });
    onClose();
    onRefresh?.();
  };
  const addReminder = async () => {
    if (!reminderText.trim() || !reminderDate) return;
    await fetch(`${API_URL}/leads/reminders`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ phone, text: reminderText.trim(), remind_at: new Date(reminderDate).getTime() / 1000 }),
    });
    setReminderText('');
    setReminderDate('');
    loadData();
  };
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  // === Secciones colapsables ===
  const Section = ({ title, children, defaultOpen = false }: { title: string; children: any; defaultOpen?: boolean }) => (
    <details className="mb-3 pt-3 border-t border-white/5 group" open={defaultOpen || undefined}>
      <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        {title}
        <span className="text-gray-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
  const Row = ({ label, value, color, truncate: trunc }: { label: string; value: any; color?: string; truncate?: boolean }) => {
    if (!value || value === '—') return null;
    return (
      <div className="flex justify-between gap-3">
        <span className="text-gray-500 shrink-0 text-xs">{label}</span>
        <span className={`font-medium text-xs text-right ${trunc ? 'truncate max-w-[200px]' : ''} ${color || ''}`}>{value}</span>
      </div>
    );
  };
  const stages = [
    { id: 'nuevo', label: '🆕 Nuevo', color: 'gray' },
    { id: 'contactado', label: '📞 Contactado', color: 'blue' },
    { id: 'interesado', label: '🔥 Interesado', color: 'yellow' },
    { id: 'negociacion', label: '🤝 Negociación', color: 'purple' },
    { id: 'cerrado_ganado', label: '✅ Ganado', color: 'green' },
    { id: 'cerrado_perdido', label: '❌ Perdido', color: 'red' },
  ];
  const stageColor = (id: string, active: boolean) => {
    if (!active) return 'bg-white/5 text-gray-500 hover:bg-white/10';
    const map: Record<string, string> = {
      green: 'bg-emerald-500 text-white', red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-black', purple: 'bg-purple-500 text-white',
      blue: 'bg-blue-500 text-white', gray: 'bg-gray-500 text-white',
    };
    const s = stages.find(s => s.id === id);
    return map[s?.color || 'gray'] || map.gray;
  };
  const quickMessages = [
    { label: '👋 Saludo', msg: `¡Hola ${name.split(' ')[0]}! Te escribimos para darte seguimiento. ¿En qué podemos ayudarte?` },
    { label: '📅 Recordar cita', msg: `¡Hola ${name.split(' ')[0]}! Te recordamos tu cita. ¿Nos confirmas asistencia?` },
    { label: '💰 Seguimiento pago', msg: `¡Hola ${name.split(' ')[0]}! Vimos que tu pago quedó pendiente. ¿Necesitas ayuda para completarlo?` },
    { label: '⭐ Post-servicio', msg: `¡Hola ${name.split(' ')[0]}! ¿Cómo te fue con tu experiencia? Nos encantaría saber tu opinión 🙌` },
  ];
  return (
    <div className="p-4">
      {/* === HEADER === */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg font-bold text-indigo-400">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate">{name}</h3>
          <p className="text-xs text-gray-500 truncate">{phone}</p>
          {email && <p className="text-[10px] text-indigo-400 truncate">{email}</p>}
        </div>
        <button onClick={() => { setEditing(!editing); setEditForm({ name: l.customer_name || '', email: l.email || email, city: l.city || city, zip_code: zip }); }}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold shrink-0">
          {editing ? '✕ Cancelar' : '✏️ Editar'}
        </button>
      </div>
      {/* === EDICIÓN INLINE === */}
      {editing && (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'name', label: 'Nombre', placeholder: 'Juan Pérez' },
              { key: 'email', label: 'Email', placeholder: 'juan@email.com' },
              { key: 'city', label: 'Ciudad', placeholder: 'Medellín' },
              { key: 'zip_code', label: 'Código postal', placeholder: '050001' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[9px] text-gray-500 mb-0.5">{f.label}</label>
                <input value={(editForm as any)[f.key]} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
              </div>
            ))}
          </div>
          <button onClick={saveEdit} className="w-full py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 transition-all">
            ✓ Guardar cambios
          </button>
        </div>
      )}
      {/* === DATOS DEL CLIENTE (mergeados — sin duplicar) === */}
      <div className="space-y-2 text-sm mb-4">
        <Row label="Estado" value={l.lead_status || 'Nuevo'} />
        <Row label="Interés" value={l.service_of_interest} />
        {email && <Row label="📧 Email" value={email} color="text-indigo-400" />}
        {doc && <Row label="🆔 Documento" value={doc} />}
        {(city || region || country) && <Row label="📍 Ubicación" value={[city, region, country].filter(Boolean).join(', ')} />}
        {zip && <Row label="📮 Código postal" value={zip} />}
        {phoneNorm && <Row label="📞 WhatsApp" value={`+${phoneNorm}`} />}
        <Row label="👁 Visitas" value={l.visit_count} />
        <Row label="💬 Sesión" value={sessionState || '-'} />
        {pax > 1 && <Row label="👥 Asistentes" value={`${pax} personas`} color="text-emerald-400" />}
        {l.import_source && <Row label="📤 Origen" value={l.import_source === 'csv_import' ? 'Importado' : l.import_source} />}
      </div>
      {/* === ATRIBUCIÓN === */}
      <Section title="🎯 Origen / Atribución" defaultOpen>
        <div className="space-y-2">
          {campId ? (
            <>
              <div className="flex justify-between gap-3">
                <span className="text-[10px] text-gray-500">📢 Campaña</span>
                <a href={`/dashboard/ads?campaign=${campId}`} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-bold truncate max-w-[200px] cursor-pointer">
                  {campName || `ID: ...${campId.slice(-8)}`} ↗
                </a>
              </div>
              {clid && <Row label="🔗 Click ID" value={clid.slice(0, 16) + '...'} color="text-gray-400" truncate />}
              {sourceUrl && (
                <div className="flex justify-between gap-3">
                  <span className="text-[10px] text-gray-500">🔗 Anuncio</span>
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 truncate max-w-[200px]">
                    Ver anuncio ↗
                  </a>
                </div>
              )}
            </>
          ) : (
            <Row label="📢 Fuente" value="📱 Orgánico / directo" color="text-gray-500" />
          )}
        </div>
      </Section>
      {/* === SCORE + ETAPA === */}
      <Section title="📊 Score + Etapa" defaultOpen>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Lead Score</span>
            <span className={`font-bold ${(l.lead_score || 0) >= 70 ? 'text-emerald-400' : (l.lead_score || 0) >= 40 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {l.lead_score || 0}/100
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${(l.lead_score || 0) >= 70 ? 'bg-emerald-500' : (l.lead_score || 0) >= 40 ? 'bg-yellow-500' : 'bg-gray-500'}`}
              style={{ width: `${l.lead_score || 0}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {stages.map(s => (
            <button key={s.id} onClick={() => updateStage(s.id)}
              className={`text-[9px] px-2 py-1 rounded-full font-bold transition-all ${stageColor(s.id, (l.lead_stage || 'nuevo') === s.id)}`}>
              {s.label}
            </button>
          ))}
        </div>
      </Section>
      {/* === TAGS === */}
      <Section title="🏷️ Tags">
        <div className="flex flex-wrap gap-1 mb-2">
          {(l.tags || []).map((tag: string, i: number) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
              {tag.replace(/_/g, ' ')}
              <button onClick={() => updateTags('remove', [tag])} className="hover:text-red-400 font-bold">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <input value={newTag} onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { updateTags('add', [newTag.trim().toLowerCase().replace(/\s+/g, '_')]); setNewTag(''); } }}
            placeholder="Agregar tag..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-indigo-500 text-white" />
          <button onClick={() => { if (newTag.trim()) { updateTags('add', [newTag.trim().toLowerCase().replace(/\s+/g, '_')]); setNewTag(''); } }}
            className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2 py-1 rounded-lg font-bold transition-all">+</button>
        </div>
      </Section>
      {/* === AGENTE === */}
      {agentsList.length > 0 && (
        <Section title="🧑‍💼 Agente">
          <select value={l.assigned_agent_id || ''} onChange={e => assignAgent(e.target.value)}
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white">
            <option value="">— Sin asignar —</option>
            {agentsList.map((a: any) => <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.role})</option>)}
          </select>
          {l.assigned_agent_name && <p className="text-[10px] text-indigo-400 mt-1">✓ {l.assigned_agent_name}</p>}
        </Section>
      )}
      {/* === PAGO === */}
      {p.status && (
        <Section title="💳 Pago" defaultOpen>
          <p className="text-sm">{p.service_name || l.service_of_interest || ''}</p>
          {p.amount && <p className="text-lg font-bold text-emerald-400">${Number(p.amount).toLocaleString()} {p.currency || 'COP'}</p>}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {p.status}
          </span>
          {p.schedule_status && <p className="text-[10px] text-sky-400 mt-2">📅 {p.schedule_status} · {p.scheduled_date} {p.scheduled_hour ? `${p.scheduled_hour}:00` : ''}</p>}
        </Section>
      )}
      {/* === 🧠 ANALIZAR CON IA === */}
      <Section title="🧠 Analizar con IA">
        {aiInsight ? (
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-xs text-gray-500">Probabilidad cierre</span><span className="text-xs font-bold text-emerald-400">{aiInsight.close_probability || 0}%</span></div>
            {aiInsight.recommendation && <p className="text-[10px] text-gray-300 bg-white/[0.03] rounded-lg p-2">{aiInsight.recommendation}</p>}
            {aiInsight.tags?.length > 0 && <p className="text-[10px] text-indigo-400">Tags IA: {aiInsight.tags.join(', ')}</p>}
            <button onClick={loadAi} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">🔄 Re-analizar</button>
          </div>
        ) : (
          <button onClick={loadAi} disabled={loadingAi}
            className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50">
            {loadingAi ? '⏳ Analizando...' : '🧠 Analizar con IA'}
          </button>
        )}
      </Section>
      {/* === ACCIONES RÁPIDAS === */}
      <Section title="⚡ Acciones rápidas" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => window.open(`https://wa.me/${phone}`, '_blank')}
            className="py-2 rounded-xl text-[10px] font-bold bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all">
            💬 WhatsApp
          </button>
          <button onClick={generatePaymentLink}
            className="py-2 rounded-xl text-[10px] font-bold bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all">
            💳 Link pago
          </button>
          <button onClick={() => updateStage('contactado')}
            className="py-2 rounded-xl text-[10px] font-bold bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
            📞 Contactado
          </button>
          <button onClick={reportToMeta} disabled={reportingMeta}
            className="py-2 rounded-xl text-[10px] font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50">
            {reportingMeta ? '⏳' : '📤 Meta CAPI'}
          </button>
          {variant === 'chat' && (
            <button onClick={() => {
              const msg = prompt('Mensaje rápido:', `¡Hola ${name.split(' ')[0]}! 😊`);
              if (msg) sendQuickMessage(msg);
            }}
              className="py-2 rounded-xl text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all">
              💬 Mensaje libre
            </button>
          )}
          <button onClick={deleteLead}
            className="py-2 rounded-xl text-[10px] font-bold bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all">
            🗑️ Eliminar
          </button>
        </div>
      </Section>
      {/* === ⚡ MENSAJES RÁPIDOS === */}
      <Section title="⚡ Mensajes rápidos">
        <div className="space-y-1.5">
          {quickMessages.map((qm, i) => (
            <button key={i} onClick={() => sendQuickMessage(qm.msg)}
              className="w-full text-left px-3 py-2 rounded-lg text-[10px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-gray-300 transition-all">
              {qm.label}
              <p className="text-[9px] text-gray-600 truncate mt-0.5">{qm.msg.slice(0, 80)}...</p>
            </button>
          ))}
        </div>
      </Section>
      {/* === ⏰ RECORDATORIOS === */}
      <Section title="⏰ Recordatorios">
        <div className="space-y-2 mb-3">
          <input value={reminderText} onChange={e => setReminderText(e.target.value)}
            placeholder="Ej: Llamar para seguimiento..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-indigo-500 text-white" />
          <div className="flex gap-2">
            <input type="datetime-local" value={reminderDate} onChange={e => setReminderDate(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-indigo-500 text-white" />
            <button onClick={addReminder} disabled={!reminderText.trim() || !reminderDate}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-30">
              ⏰
            </button>
          </div>
        </div>
        {reminders.length === 0 ? (
          <p className="text-[10px] text-gray-600 text-center py-2">Sin recordatorios</p>
        ) : (
          <div className="space-y-1.5">
            {reminders.map((r: any, i: number) => {
              const d = new Date((r.remind_at || 0) * 1000);
              return (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] ${r.overdue ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.03] text-gray-300'}`}>
                  <span>{r.overdue ? '🔴' : '🟡'}</span>
                  <span className="flex-1 truncate">{r.text}</span>
                  <span className="text-[9px] text-gray-500 shrink-0">{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              );
            })}
          </div>
        )}
      </Section>
      {/* === 🔒 NOTAS PRIVADAS === */}
      <Section title="🔒 Notas del equipo (privadas)">
        <div className="flex gap-1 mb-2">
          <input value={newPrivateNote} onChange={e => setNewPrivateNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addPrivateNote(); }}
            placeholder="Nota interna, solo la ve tu equipo..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-indigo-500 text-white" />
          <button onClick={addPrivateNote} disabled={savingPrivateNote || !newPrivateNote.trim()}
            className="text-[10px] bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white px-2 py-1 rounded-lg font-bold transition-all disabled:opacity-30">
            🔒
          </button>
        </div>
        {privateNotes.length === 0 ? (
          <p className="text-[10px] text-gray-600 text-center py-2">Sin notas privadas</p>
        ) : (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {privateNotes.map((n: any, i: number) => (
              <div key={i} className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-2 py-1.5">
                <p className="text-[10px] text-yellow-200">{n.text}</p>
                <p className="text-[9px] text-gray-600 mt-0.5">{n.author_name || 'Equipo'} · {new Date((n.created_at || 0) * 1000).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
      {/* === 📝 NOTAS === */}
      <Section title="📝 Notas">
        <div className="flex gap-1 mb-2">
          <input value={newNote} onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addNote(); }}
            placeholder="Agregar nota..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-indigo-500 text-white" />
          <button onClick={addNote} disabled={savingNote || !newNote.trim()}
            className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2 py-1 rounded-lg font-bold transition-all disabled:opacity-30">
            📝
          </button>
        </div>
        {notes.length === 0 ? (
          <p className="text-[10px] text-gray-600 text-center py-2">Sin notas</p>
        ) : (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {notes.map((n: any, i: number) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
                <p className="text-[10px] text-gray-300">{typeof n === 'string' ? n : n.text}</p>
                {n.created_at && <p className="text-[9px] text-gray-600 mt-0.5">{new Date(n.created_at * 1000).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>
      {/* === 📋 TIMELINE === */}
      <Section title="📋 Timeline">
        {timeline.length === 0 ? (
          <p className="text-[10px] text-gray-600 text-center py-2">Sin eventos registrados</p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {timeline.map((ev: any, i: number) => (
              <div key={i} className="flex items-start gap-2 px-2 py-1.5 bg-white/[0.02] rounded-lg">
                <span className="text-[10px] mt-0.5">
                  {ev.action?.includes('STAGE') ? '📊' : ev.action?.includes('PAYMENT') ? '💳' : ev.action?.includes('AGENT') ? '🧑‍💼' : ev.action?.includes('NOTE') ? '📝' : '📌'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-300 truncate">{ev.action || ev.description || 'Evento'}</p>
                  <p className="text-[9px] text-gray-600">{ev.agent_id || ''} · {new Date((ev.timestamp || 0) * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      {/* === COMPRA / ENVÍO (solo variant=crm + crmFields) === */}
      {variant === 'crm' && crmFields.length > 0 && (
        <Section title="📦 Compra / Envío">
          <div className="space-y-2">
            {[
              { key: 'product_name', label: 'Producto', icon: '🏷️', type: servicesList.length > 0 ? 'catalog' : 'text' },
              { key: 'purchase_date', label: 'Fecha compra', icon: '📅', type: 'date' },
              { key: 'shipping_address', label: 'Dirección', icon: '📍', type: 'text' },
              { key: 'carrier', label: 'Transportadora', icon: '🚚', type: 'select', options: ['', ...(activeCarriers.length > 0 ? activeCarriers : ['Servientrega', 'Coordinadora', 'DHL', 'FedEx', 'Otra'])] },
              { key: 'tracking_number', label: 'Guía', icon: '📋', type: 'text' },
              { key: 'shipping_status', label: 'Estado', icon: '📊', type: 'select', options: ['', 'preparando', 'despachado', 'en_camino', 'entregado', 'devuelto'] },
              { key: 'renewal_date', label: 'Renovación', icon: '🔄', type: 'date' },
              { key: 'renewal_frequency', label: 'Frecuencia', icon: '⏰', type: 'select', options: ['', 'mensual', 'trimestral', 'semestral', 'anual'] },
            ].filter(f => crmFields.includes(f.key)).map(f => {
              const val = (l.purchase_info || {})[f.key] || '';
              const save = (v: string) => {
                if (v !== val) fetch(`${API_URL}/leads/purchase-info`, {
                  method: 'PUT', headers: h, body: JSON.stringify({ phone, [f.key]: v }),
                });
              };
              return (
                <div key={f.key} className="flex items-center gap-2">
                  <span className="text-xs w-4 shrink-0">{f.icon}</span>
                  <span className="text-[9px] text-gray-500 w-16 shrink-0">{f.label}</span>
                  {f.type === 'catalog' ? (
                    <select defaultValue={val} onChange={e => save(e.target.value)}
                      className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                      <option value="">—</option>
                      {servicesList.map(s => <option key={s.slug || s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  ) : f.type === 'select' ? (
                    <select defaultValue={val} onChange={e => save(e.target.value)}
                      className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                      {f.options?.map(o => <option key={o} value={o}>{o ? o.replace(/_/g, ' ') : '—'}</option>)}
                    </select>
                  ) : f.type === 'date' ? (
                    <input type="date" defaultValue={val} onChange={e => save(e.target.value)}
                      className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none" />
                  ) : (
                    <input defaultValue={val} onBlur={e => save(e.target.value)} placeholder="—"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}
      {/* === CERRAR === */}
      <div className="pt-4 border-t border-white/5 mt-4">
        <button onClick={onClose}
          className="w-full text-[10px] py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-xl transition-all">
          ✕ Cerrar
        </button>
      </div>
    </div>
  );
}