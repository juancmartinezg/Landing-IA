'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// Diccionario de labels humanos para plantillas conocidas (auto-creadas por el sistema).
// Si una plantilla no está aquí, se muestra su nombre técnico como fallback.
const TEMPLATE_LABELS: Record<string, { title: string; emoji: string; desc: string; useCase: string }> = {
  appointment_reminder_v1: {
    title: 'Recordatorio de cita',
    emoji: '📅',
    desc: 'Recuerda al cliente la fecha y hora de su próxima cita.',
    useCase: 'Ideal para enviar 24h o 1h antes de la cita agendada.',
  },
  follow_up_v1: {
    title: 'Seguimiento comercial',
    emoji: '💬',
    desc: 'Reactiva leads que mostraron interés pero no completaron la compra.',
    useCase: 'Ideal para leads inactivos +7 días o que abandonaron el pago.',
  },
};
// Devuelve el label humano de una plantilla (o el nombre técnico si no está mapeada).
const humanizeTemplate = (t: any) => {
  const meta = TEMPLATE_LABELS[t.template_name];
  if (meta) return `${meta.emoji} ${meta.title}`;
  // Fallback: capitaliza el nombre técnico (snake_case → Title Case)
  const pretty = t.template_name
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
  const icon = t.category === 'MARKETING' ? '📢' : '🔧';
  return `${icon} ${pretty}`;
};
export default function MarketingPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [quota, setQuota] = useState<any>({});
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 5000); };
  const [form, setForm] = useState({
    template_name: '',
    language: 'es',
    filters: { lead_stage: [] as string[], tags: [] as string[], days_inactive: 0, service: '' },
    param_field_map: {} as Record<string, string>,
    confirmed: false,
  });
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/templates/list`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/marketing/campaigns`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/leads`, { headers: h }).then(r => r.json()),
    ]).then(([tpl, camp, ld]) => {
      setTemplates((tpl.templates || []).filter((t: any) => t.status === 'APPROVED'));
      setCampaigns(camp.campaigns || []);
      setQuota(camp.quota || {});
      setLeads(ld.leads || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  // Filtrar leads según filtros seleccionados
  const filteredLeads = leads.filter(l => {
    const phone = l.contact_id || l.phoneNumber || '';
    if (!phone || phone.startsWith('demo_')) return false;
    if (form.filters.lead_stage.length > 0 && !form.filters.lead_stage.includes(l.lead_stage || 'nuevo')) return false;
    if (form.filters.tags.length > 0 && !(l.tags || []).some((t: string) => form.filters.tags.includes(t))) return false;
    if (form.filters.service && (l.service_of_interest || '').toLowerCase() !== form.filters.service.toLowerCase()) return false;
    if (form.filters.days_inactive > 0) {
      const last = Number(l.last_updated || 0);
      if (last && (Date.now() / 1000 - last) < form.filters.days_inactive * 86400) return false;
    }
    return true;
  });
  const selectedTpl = templates.find(t => t.template_name === form.template_name);
  const varCount = (selectedTpl?.body || '').match(/\{\{\d+\}\}/g)?.length || 0;
  const estimatedCost = filteredLeads.length * (selectedTpl?.category === 'MARKETING' ? 0.025 : 0.01);
  const allTags = [...new Set(leads.flatMap(l => l.tags || []))];
  const allStages = ['nuevo', 'contactado', 'interesado', 'negociacion', 'cerrado_ganado', 'cerrado_perdido'];
  const allServices = [...new Set(leads.map(l => l.service_of_interest).filter(Boolean))];
  const handleSend = async () => {
    if (!form.template_name || filteredLeads.length === 0) return;
    if (!form.confirmed) { showToast('⚠️ Debes confirmar que entiendes los cargos de Meta'); return; }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/marketing/send-bulk`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: form.template_name,
          language: form.language,
          param_field_map: form.param_field_map,
          filters: {
            lead_stage: form.filters.lead_stage.length > 0 ? form.filters.lead_stage : undefined,
            tags: form.filters.tags.length > 0 ? form.filters.tags : undefined,
            days_inactive: form.filters.days_inactive || undefined,
            service: form.filters.service || undefined,
          },
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok) {
        showToast(`✅ Campaña enviada: ${data.sent} mensajes`);
        fetch(`${API_URL}/marketing/campaigns`, { headers: h }).then(r => r.json()).then(d => {
          setCampaigns(d.campaigns || []);
          setQuota(d.quota || {});
        });
      } else {
        showToast(`❌ ${data.error || 'Error enviando'}`);
      }
    } catch { showToast('Error de conexión'); }
    setSending(false);
  };
  const toggleStage = (s: string) => setForm(f => ({
    ...f, filters: { ...f.filters, lead_stage: f.filters.lead_stage.includes(s) ? f.filters.lead_stage.filter(x => x !== s) : [...f.filters.lead_stage, s] }
  }));
  const toggleTag = (t: string) => setForm(f => ({
    ...f, filters: { ...f.filters, tags: f.filters.tags.includes(t) ? f.filters.tags.filter(x => x !== t) : [...f.filters.tags, t] }
  }));
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold">Campañas Marketing 📢</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">
            📊 {quota.used || 0}/{quota.limit === 'unlimited' ? '∞' : quota.limit || 100} envíos este mes
          </span>
          <Link href="/dashboard/templates/manage" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
            📝 Gestionar plantillas →
          </Link>
        </div>
      </div>
      {/* Banner costos */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-6">
        <p className="text-[10px] text-amber-300">
          ⚠️ Meta cobra cada mensaje a tu tarjeta de Facebook Business. UTILITY ~$0.01 USD/msg · MARKETING ~$0.025 USD/msg. clientes.bot no cobra comisión.
        </p>
      </div>
      {/* Nueva campaña */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-4">🚀 Nueva campaña</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Template selector */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Plantilla aprobada *</label>
            {templates.length === 0 ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                <p className="text-[10px] text-red-400">No tienes plantillas aprobadas. <Link href="/dashboard/templates/manage" className="text-indigo-400 underline">Crear una →</Link></p>
              </div>
            ) : (
              <select value={form.template_name} onChange={(e) => setForm({ ...form, template_name: e.target.value })}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-white">
                <option value="">— Seleccionar plantilla —</option>
                {templates.map(t => (
                  <option key={t.template_name} value={t.template_name}>
                    {humanizeTemplate(t)}
                  </option>
                ))}
              </select>
            )}
            {selectedTpl && (
              <div className="mt-2 space-y-2">
                {/* Card descriptiva — qué es y cuándo usarla */}
                {TEMPLATE_LABELS[selectedTpl.template_name] && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3">
                    <p className="text-[11px] font-bold text-indigo-300 mb-1">
                      {TEMPLATE_LABELS[selectedTpl.template_name].emoji}{' '}
                      {TEMPLATE_LABELS[selectedTpl.template_name].title}
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      {TEMPLATE_LABELS[selectedTpl.template_name].desc}
                    </p>
                    <p className="text-[10px] text-indigo-300/80 mt-1.5 italic">
                      💡 {TEMPLATE_LABELS[selectedTpl.template_name].useCase}
                    </p>
                  </div>
                )}
                {/* Preview del mensaje real que recibirá el cliente */}
                {selectedTpl?.body && (
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Vista previa del mensaje</p>
                    <div className="bg-[#0B3D2E] rounded-lg p-3">
                      <p className="text-[10px] text-white/80 whitespace-pre-wrap">{selectedTpl.body}</p>
                    </div>
                  </div>
                )}
                {/* Badge de categoría — explica el costo */}
                <p className="text-[9px] text-gray-500">
                  {selectedTpl.category === 'MARKETING'
                    ? '📢 Categoría: Marketing (~$0.025 USD/msg)'
                    : '🔧 Categoría: Utilitaria (~$0.01 USD/msg)'}{' '}
                  · Idioma: {selectedTpl.language}
                </p>
              </div>
            )}
          </div>
          {/* Variable mapping */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Mapeo de variables</label>
            {varCount === 0 ? (
              <p className="text-[10px] text-gray-600">Esta plantilla no tiene variables.</p>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: varCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-10">{`{{${i+1}}}`}</span>
                    <select value={form.param_field_map[String(i+1)] || ''} onChange={(e) => setForm(f => ({
                      ...f, param_field_map: { ...f.param_field_map, [String(i+1)]: e.target.value }
                    }))}
                      className="flex-1 bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none">
                      <option value="">— Campo del lead —</option>
                      <option value="name">👤 Nombre</option>
                      <option value="service">🏷️ Servicio de interés</option>
                      <option value="email">📧 Email</option>
                      <option value="phone">📞 Teléfono</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Filtros destinatarios */}
        <div className="border-t border-white/5 pt-4 mb-4">
          <h4 className="text-xs font-bold text-gray-300 mb-3">🎯 Filtrar destinatarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Etapa del lead</label>
              <div className="flex flex-wrap gap-1">
                {allStages.map(s => (
                  <button key={s} onClick={() => toggleStage(s)}
                    className={`text-[9px] px-2 py-1 rounded-full transition-all ${
                      form.filters.lead_stage.includes(s) ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 15).map(t => (
                  <button key={t} onClick={() => toggleTag(t)}
                    className={`text-[9px] px-2 py-1 rounded-full transition-all ${
                      form.filters.tags.includes(t) ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Servicio de interés</label>
              <select value={form.filters.service} onChange={(e) => setForm(f => ({ ...f, filters: { ...f.filters, service: e.target.value } }))}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none">
                <option value="">— Todos —</option>
                {allServices.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Días sin actividad (mínimo)</label>
              <input type="number" min="0" value={form.filters.days_inactive || ''} onChange={(e) => setForm(f => ({ ...f, filters: { ...f.filters, days_inactive: parseInt(e.target.value) || 0 } }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none"
                placeholder="Ej: 30 (leads inactivos >30 días)" />
            </div>
          </div>
        </div>
        {/* Estimador */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-bold text-purple-400">📊 {filteredLeads.length} destinatarios</p>
              <p className="text-[10px] text-gray-400">Costo estimado: ~${estimatedCost.toFixed(2)} USD (Meta cobra a tu tarjeta)</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.confirmed} onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
                className="w-4 h-4 accent-purple-500" />
              <label className="text-[10px] text-gray-300">Entiendo que Meta cobra este monto a mi tarjeta</label>
            </div>
          </div>
        </div>
        {/* Resultado */}
        {result && (
          <div className={`rounded-xl p-4 mb-4 ${result.ok ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-red-500/5 border border-red-500/20'}`}>
            {result.ok ? (
              <div>
                <p className="text-emerald-400 font-bold">✅ Campaña enviada</p>
                <p className="text-xs text-gray-400 mt-1">Enviados: {result.sent} · Fallidos: {result.failed} · Total: {result.total_recipients}</p>
                {result.errors?.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-[10px] text-red-400 cursor-pointer">Ver errores ({result.errors.length})</summary>
                    <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((e: any, i: number) => (
                        <p key={i} className="text-[9px] text-red-300">{e.phone}: {e.error}</p>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <p className="text-red-400 text-sm">❌ {result.error}</p>
            )}
          </div>
        )}
        {/* Botón enviar */}
        <button onClick={handleSend}
          disabled={sending || !form.template_name || filteredLeads.length === 0 || !form.confirmed}
          className="w-full py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-600/20">
          {sending ? '⏳ Enviando campaña...' : `🚀 Enviar a ${filteredLeads.length} destinatarios`}
        </button>
      </div>
      {/* Historial de campañas */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h3 className="font-bold mb-4">📊 Historial de campañas</h3>
        {campaigns.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No hay campañas enviadas aún</p>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <div>
                  <p className="text-xs font-bold">{c.template_name}</p>
                  <p className="text-[9px] text-gray-500">
                    {new Date(c.created_at * 1000).toLocaleString()} · {c.language}
                    {c.filters?.lead_stage?.length > 0 && ` · Etapas: ${c.filters.lead_stage.join(', ')}`}
                    {c.filters?.tags?.length > 0 && ` · Tags: ${c.filters.tags.join(', ')}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">{c.sent} enviados</p>
                  {c.failed > 0 && <p className="text-[9px] text-red-400">{c.failed} fallidos</p>}
                  <p className="text-[9px] text-gray-500">{c.total_recipients} destinatarios</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}