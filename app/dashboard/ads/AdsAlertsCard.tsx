'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const FIELD_LABELS: Record<string, string> = {
  spent: 'Gasto', cpa: 'CPA (costo por resultado)', cpc: 'CPC (costo por clic)',
  cpm: 'CPM (costo por mil)', cpp: 'CPP (costo por persona)', ctr: 'CTR (%)',
  frequency: 'Frecuencia', impressions: 'Impresiones', unique_impressions: 'Impresiones únicas',
  reach: 'Alcance', clicks: 'Clics', unique_clicks: 'Clics únicos',
  results: 'Resultados', result_rate: 'Tasa de resultados', leadgen: 'Leads',
  link_click: 'Clics en enlace', cost_per_link_click: 'Costo por clic en enlace',
  post_engagement: 'Interacciones', video_view: 'Reproducciones de video',
  name: 'Nombre', daily_budget: 'Presupuesto diario', lifetime_budget: 'Presupuesto total',
  spend_cap: 'Límite de gasto', effective_status: 'Estado', bid_amount: 'Puja',
  start_time: 'Fecha de inicio', stop_time: 'Fecha de fin',
};
const PRESET_LABELS: Record<string, string> = {
  TODAY: 'Hoy', YESTERDAY: 'Ayer', LAST_2_DAYS: 'Últimos 2 días', LAST_3_DAYS: 'Últimos 3 días',
  LAST_7_DAYS: 'Últimos 7 días', LAST_14_DAYS: 'Últimos 14 días', LAST_30_DAYS: 'Últimos 30 días',
  LIFETIME: 'De por vida', THIS_MONTH: 'Este mes', THIS_WEEK_MON_TODAY: 'Esta semana',
};
const ENTITY_LABELS: Record<string, string> = { CAMPAIGN: 'Campaña', ADSET: 'Conjunto de anuncios', AD: 'Anuncio' };
const EVENT_LABELS: Record<string, string> = {
  INSIGHTS_UPDATED: 'Cuando una métrica cruza un umbral',
  INSIGHTS_MILESTONE_REACHED: 'Cuando se alcanza un hito (de por vida)',
  OBJECT_UPDATED: 'Cuando alguien cambia algo de la campaña',
  OBJECT_CREATED: 'Cuando se crea una campaña nueva',
};

export default function AdsAlertsCard({ companyId }: { companyId: string }) {
  const h: any = { 'client-id': companyId || '' };
  const [status, setStatus] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    name: '', event_type: 'INSIGHTS_UPDATED', entity_type: 'CAMPAIGN',
    field: 'cpa', operator: 'GREATER_THAN', value: '', time_preset: 'TODAY',
    action: 'notify', pause_target: 'self', cooldown_min: 60,
  });

  const toast = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 4000); };

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        fetch(`${API_URL}/ads/webhooks/status`, { headers: h }).then(x => x.json()),
        fetch(`${API_URL}/ads/webhooks/rules`, { headers: h }).then(x => x.json()),
      ]);
      setStatus(s); setRules(r.rules || []);
    } catch { toast('Error cargando alertas'); }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [companyId]);

  const connect = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/ads/webhooks/setup`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: '{}' });
      const d = await res.json();
      toast(res.ok ? '✓ Alertas de Meta conectadas' : (d?.account_subscription?.detail?.error || 'No se pudo conectar'));
      await load();
    } catch { toast('Error conectando'); }
    setBusy(false);
  };

  const savePrefs = async (patch: any) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/ads/alerts/prefs`, { method: 'PUT', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
      const d = await res.json();
      if (res.ok) { setStatus({ ...status, alerts_config: d.alerts_config }); toast('✓ Guardado'); }
      else toast(d.error || 'Error');
    } catch { toast('Error guardando'); }
    setBusy(false);
  };

  const createRule = async () => {
    if (!form.value && form.event_type !== 'OBJECT_CREATED' && form.event_type !== 'OBJECT_UPDATED') { toast('Escribe el valor del umbral'); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/ads/webhooks/rules`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await res.json();
      if (res.ok) { toast('✓ Regla creada'); setOpen(false); setForm({ ...form, name: '', value: '' }); await load(); }
      else toast(d.error || 'Meta rechazó la regla');
    } catch { toast('Error creando regla'); }
    setBusy(false);
  };

  const patchRule = async (rule_id: string, patch: any) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/ads/webhooks/rules`, { method: 'PUT', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ rule_id, ...patch }) });
      const d = await res.json();
      if (res.ok) { setRules(rules.map(r => r.rule_id === rule_id ? d.rule : r)); } else toast(d.error || 'Error');
    } catch { toast('Error'); }
    setBusy(false);
  };

  const deleteRule = async (rule_id: string) => {
    if (!confirm('¿Borrar esta regla? Deja de avisarte de inmediato.')) return;
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/ads/webhooks/rules?rule_id=${encodeURIComponent(rule_id)}`, { method: 'DELETE', headers: h });
      if (res.ok) { setRules(rules.filter(r => r.rule_id !== rule_id)); toast('✓ Regla borrada'); } else toast('Error borrando');
    } catch { toast('Error'); }
    setBusy(false);
  };

  const cfg = status?.alerts_config || {};
  const cat = status?.catalog || {};
  const isMilestone = form.event_type === 'INSIGHTS_MILESTONE_REACHED';
  const isMetric = form.event_type === 'INSIGHTS_UPDATED' || isMilestone;
  const fieldOptions: string[] = isMetric ? (cat.metric_fields || []) : (cat.metadata_fields || []);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-sm mb-1">🔔 Alertas de Meta en tiempo real</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-2xl">
            Meta te avisa en el momento: anuncio rechazado, creativo quemado y las reglas de umbral que tú definas
            (gasto, CPA, leads…). Cada regla puede solo avisarte o pausar automáticamente.
          </p>
        </div>
        {status && !status.connected && (
          <button onClick={connect} disabled={busy} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all">
            {busy ? '...' : 'Conectar alertas'}
          </button>
        )}
        {status?.connected && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg whitespace-nowrap">✓ Conectado</span>
        )}
      </div>

      {msg && <p className="text-[11px] text-indigo-300 mb-3">{msg}</p>}
      {loading && <p className="text-[11px] text-gray-400">Cargando…</p>}

      {!loading && status && (
        <>
          {/* Preferencias */}
          <div className="grid sm:grid-cols-2 gap-2 mb-4">
            {[
              { k: 'enabled', l: 'Recibir alertas de anuncios' },
              { k: 'email', l: 'Avisarme también por correo' },
              { k: 'status_alerts', l: 'Anuncio rechazado o sin entregar' },
              { k: 'fatigue_alerts', l: 'Creativo quemado (fatiga)' },
            ].map(o => (
              <label key={o.k} className="flex items-center gap-2 bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2 text-[11px] cursor-pointer">
                <input type="checkbox" checked={!!cfg[o.k]} disabled={busy} onChange={e => savePrefs({ [o.k]: e.target.checked })} className="accent-indigo-500" />
                <span>{o.l}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2 text-[11px]">
              <span className="text-gray-400">Avisar fatiga desde</span>
              <select value={cfg.fatigue_min_level || 'HIGH'} disabled={busy} onChange={e => savePrefs({ fatigue_min_level: e.target.value })}
                className="bg-[#0f1320] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white outline-none focus:border-indigo-500">
                <option value="LOW">Baja</option><option value="MEDIUM">Media</option><option value="HIGH">Alta</option>
              </select>
            </label>
            <label className="flex items-center gap-2 bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2 text-[11px]">
              <span className="text-gray-400">No repetir la misma alerta en</span>
              <select value={String(cfg.dedupe_hours || 12)} disabled={busy} onChange={e => savePrefs({ dedupe_hours: parseInt(e.target.value) })}
                className="bg-[#0f1320] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white outline-none focus:border-indigo-500">
                {[1, 6, 12, 24, 48, 72].map(x => <option key={x} value={x}>{x} h</option>)}
              </select>
            </label>
          </div>

          {/* Reglas */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-gray-300">Mis reglas ({rules.length})</p>
            <button onClick={() => setOpen(!open)} className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all">
              {open ? 'Cancelar' : '+ Nueva regla'}
            </button>
          </div>

          {open && (
            <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-4 mb-3 space-y-2">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre de la regla (ej: CPA alto en campañas)"
                className="w-full bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500" />
              <div className="grid sm:grid-cols-2 gap-2">
                <select value={form.event_type} onChange={e => {
                  const et = e.target.value;
                  const opts = (et === 'OBJECT_UPDATED') ? (cat.metadata_fields || []) : (cat.metric_fields || []);
                  setForm({ ...form, event_type: et, field: opts[0] || '', time_preset: et === 'INSIGHTS_MILESTONE_REACHED' ? 'LIFETIME' : 'TODAY' });
                }} className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                  {(cat.event_types || []).map((x: string) => <option key={x} value={x}>{EVENT_LABELS[x] || x}</option>)}
                </select>
                <select value={form.entity_type} onChange={e => setForm({ ...form, entity_type: e.target.value })}
                  className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                  {(cat.entity_types || []).map((x: string) => <option key={x} value={x}>{ENTITY_LABELS[x] || x}</option>)}
                </select>
              </div>
              {form.event_type !== 'OBJECT_CREATED' && (
                <div className="grid sm:grid-cols-3 gap-2">
                  <select value={form.field} onChange={e => setForm({ ...form, field: e.target.value })}
                    className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                    {fieldOptions.map((x: string) => <option key={x} value={x}>{FIELD_LABELS[x] || x}</option>)}
                  </select>
                  <select value={isMilestone ? 'EQUAL' : form.operator} disabled={isMilestone} onChange={e => setForm({ ...form, operator: e.target.value })}
                    className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500 disabled:opacity-50">
                    <option value="GREATER_THAN">Mayor que</option>
                    <option value="LESS_THAN">Menor que</option>
                    {isMilestone && <option value="EQUAL">Llega a</option>}
                  </select>
                  {isMetric && (
                    <input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder={`Valor${cat.currency ? ' en ' + cat.currency : ''}`}
                      className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500" />
                  )}
                </div>
              )}
              {isMetric && (
                <select value={isMilestone ? 'LIFETIME' : form.time_preset} disabled={isMilestone} onChange={e => setForm({ ...form, time_preset: e.target.value })}
                  className="w-full bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500 disabled:opacity-50">
                  {(cat.time_presets || []).map((x: string) => <option key={x} value={x}>Ventana: {PRESET_LABELS[x] || x}</option>)}
                </select>
              )}
              <div className="grid sm:grid-cols-3 gap-2">
                <select value={form.action} onChange={e => setForm({ ...form, action: e.target.value })}
                  className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                  <option value="notify">Solo avisarme</option>
                  <option value="pause">Pausar automáticamente</option>
                </select>
                {form.action === 'pause' && (
                  <select value={form.pause_target} onChange={e => setForm({ ...form, pause_target: e.target.value })}
                    className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                    <option value="self">Pausar el objeto que falló</option>
                    <option value="campaign">Pausar toda la campaña</option>
                  </select>
                )}
                <select value={String(form.cooldown_min)} onChange={e => setForm({ ...form, cooldown_min: parseInt(e.target.value) })}
                  className="bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500">
                  {[0, 15, 60, 180, 720, 1440].map(x => <option key={x} value={x}>Esperar {x} min entre avisos</option>)}
                </select>
              </div>
              {isMilestone && cat.milestone_minimums?.[form.field] && (
                <p className="text-[10px] text-amber-400">Meta exige un mínimo de {cat.milestone_minimums[form.field]} para {FIELD_LABELS[form.field] || form.field}.</p>
              )}
              <button onClick={createRule} disabled={busy} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 rounded-xl text-[11px] font-bold transition-all">
                {busy ? 'Creando…' : 'Crear regla'}
              </button>
            </div>
          )}

          {rules.length === 0 && !open && (
            <p className="text-[11px] text-gray-500">Todavía no tienes reglas. Ejemplo útil: “CPA de hoy mayor que 60.000 → solo avisarme”.</p>
          )}

          <div className="space-y-2">
            {rules.map(r => (
              <div key={r.rule_id} className="flex items-center justify-between gap-3 bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold truncate">{r.name || `${FIELD_LABELS[r.field] || r.field}`}</p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {ENTITY_LABELS[r.entity_type] || r.entity_type} · {FIELD_LABELS[r.field] || r.field}
                    {r.operator === 'LESS_THAN' ? ' menor que ' : r.operator === 'EQUAL' ? ' llega a ' : ' mayor que '}
                    {r.value}{r.time_preset ? ` · ${PRESET_LABELS[r.time_preset] || r.time_preset}` : ''}
                    {' · '}{r.action === 'pause' ? 'pausa automática' : 'solo avisa'}
                    {r.fired_count > 0 ? ` · se activó ${r.fired_count}x` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={r.action} disabled={busy} onChange={e => patchRule(r.rule_id, { action: e.target.value })}
                    className="bg-[#0f1320] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-indigo-500">
                    <option value="notify">Avisar</option>
                    <option value="pause">Pausar</option>
                  </select>
                  <button onClick={() => patchRule(r.rule_id, { status: r.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' })} disabled={busy}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${r.status === 'ENABLED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                    {r.status === 'ENABLED' ? 'Activa' : 'Pausada'}
                  </button>
                  <button onClick={() => deleteRule(r.rule_id)} disabled={busy} className="text-gray-500 hover:text-red-400 text-[11px] transition-all">🗑</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
