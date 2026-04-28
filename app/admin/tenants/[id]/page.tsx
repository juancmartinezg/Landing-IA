'use client';
import { useAuth } from '../../../providers';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface TenantDetail {
  tenant_id: string;
  config: Record<string, any>;
  metrics: {
    messages_24h: number;
    messages_7d: number;
    leads_total: number;
    leads_24h: number;
    payments_30d_count: number;
    payments_30d_revenue: number;
    last_activity_ts: number;
  };
  errors_recent: Array<{
    service: string;
    error_type: string;
    message: string;
    timestamp: number;
  }>;
  timeline: Array<{
    action: string;
    actor: string;
    target: string;
    details: string;
    timestamp: number;
  }>;
  integrations: {
    meta_connected: boolean;
    meta_pixel_id: string;
    ad_account_id: string;
    page_id: string;
    waba_id: string;
    phone_number_id: string;
    token_expires_at: number;
    token_expires_in_days?: number;
    scheduling_enabled: boolean;
    gateway_configured: boolean;
  };
  tags: string[];
  tenant_notes: string;
  _generated_at: number;
}
export default function AdminTenantDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.id as string) || '';
  const [data, setData] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'config' | 'metrics' | 'errors' | 'timeline'>('metrics');
  const fetchDetail = async () => {
    if (!user?.email || !tenantId) return;
    setRefreshing(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}`, {
        headers: {
          'client-id': user.sub || user.email,
          'x-user-email': user.email,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || `Error ${res.status}`);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tenantId]);
  const formatNum = (n: number) => new Intl.NumberFormat('es-CO').format(n || 0);
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);
  const formatTime = (ts: number) => {
    if (!ts) return '—';
    const ago = Math.floor(Date.now() / 1000 - ts);
    if (ago < 60) return `hace ${ago}s`;
    if (ago < 3600) return `hace ${Math.floor(ago / 60)}m`;
    if (ago < 86400) return `hace ${Math.floor(ago / 3600)}h`;
    if (ago < 604800) return `hace ${Math.floor(ago / 86400)}d`;
    return new Date(ts * 1000).toLocaleString('es-CO');
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <p className="text-sm text-red-400 font-bold mb-1">Error cargando detalle</p>
        <p className="text-xs text-gray-400">{error}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={fetchDetail} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-lg">
            Reintentar
          </button>
          <Link href="/admin/tenants" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-lg">
            ← Volver
          </Link>
        </div>
      </div>
    );
  }
  if (!data) return null;
  const cfg = data.config || {};
  const brand = cfg.brand_name || tenantId;
  const status = cfg.status || 'ACTIVE';
  const plan = cfg.plan || '—';
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/tenants" className="text-[10px] text-gray-500 hover:text-gray-300 mb-2 inline-block">
            ← Volver a tenants
          </Link>
          <h1 className="text-2xl font-black tracking-tight">{brand}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <code className="text-xs font-mono text-indigo-300 bg-white/5 px-2 py-0.5 rounded">{data.tenant_id}</code>
            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ${
              status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'
            }`}>
              {status}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase tracking-widest">
              plan: {plan}
            </span>
            {data.integrations.meta_connected ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                ✓ Meta conectado
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold">
                ⚠ Meta no conectado
              </span>
            )}
            {data.tags && data.tags.map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchDetail} disabled={refreshing}
            className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 transition-all">
            {refreshing ? '⏳' : '🔄 Actualizar'}
          </button>
          <StatusActionsPanel
            tenantId={data.tenant_id}
            currentStatus={status}
            user={user}
            onChanged={fetchDetail}
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/5">
        {[
          { id: 'metrics', label: '📊 Métricas', count: null },
          { id: 'config', label: '⚙️ Config', count: Object.keys(cfg).length },
          { id: 'errors', label: '🐛 Errores', count: data.errors_recent.length },
          { id: 'timeline', label: '📜 Timeline', count: data.timeline.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              tab === t.id
                ? 'text-white border-indigo-500'
                : 'text-gray-500 border-transparent hover:text-white'
            }`}>
            {t.label}
            {t.count !== null && (
              <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full ${
                tab === t.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* ===== TAB: MÉTRICAS ===== */}
      {tab === 'metrics' && (
        <div className="space-y-4">
          {/* Cards de métricas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Mensajes 24h</p>
              <p className="text-2xl font-black text-sky-400">{formatNum(data.metrics.messages_24h)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Mensajes 7d</p>
              <p className="text-2xl font-black text-indigo-400">{formatNum(data.metrics.messages_7d)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Leads totales</p>
              <p className="text-2xl font-black text-purple-400">{formatNum(data.metrics.leads_total)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Leads 24h</p>
              <p className="text-2xl font-black text-emerald-400">{formatNum(data.metrics.leads_24h)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pagos 30d</p>
              <p className="text-2xl font-black text-yellow-400">{formatNum(data.metrics.payments_30d_count)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Revenue 30d</p>
              <p className="text-2xl font-black text-emerald-400">{formatCurrency(data.metrics.payments_30d_revenue)}</p>
            </div>
          </div>
          {/* Última actividad */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Última actividad</p>
            <p className="text-sm text-white">{formatTime(data.metrics.last_activity_ts)}</p>
          </div>
          {/* Integrations */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <h3 className="text-xs font-bold mb-3 text-gray-400 uppercase tracking-widest">🔌 Integraciones</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Meta</p>
                <p className={data.integrations.meta_connected ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                  {data.integrations.meta_connected ? '✓ Conectado' : '✗ Desconectado'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Pixel ID</p>
                <p className="font-mono text-indigo-300 truncate">{data.integrations.meta_pixel_id || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Ad Account</p>
                <p className="font-mono text-indigo-300 truncate">{data.integrations.ad_account_id || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">WABA ID</p>
                <p className="font-mono text-indigo-300 truncate">{data.integrations.waba_id || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Phone Number ID</p>
                <p className="font-mono text-indigo-300 truncate">{data.integrations.phone_number_id || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Token expira</p>
                <p className={`font-bold ${
                  !data.integrations.token_expires_at ? 'text-gray-500' :
                  (data.integrations.token_expires_in_days || 0) < 7 ? 'text-red-400' :
                  (data.integrations.token_expires_in_days || 0) < 30 ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  {data.integrations.token_expires_at
                    ? `en ${data.integrations.token_expires_in_days || 0}d`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Scheduling</p>
                <p className={data.integrations.scheduling_enabled ? 'text-emerald-400' : 'text-gray-500'}>
                  {data.integrations.scheduling_enabled ? '✓ Activo' : '✗ Inactivo'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Gateway pago</p>
                <p className={data.integrations.gateway_configured ? 'text-emerald-400' : 'text-yellow-400'}>
                  {data.integrations.gateway_configured ? '✓ Configurado' : '⚠ No configurado'}
                </p>
              </div>
            </div>
          </div>
          {/* Notas internas + Tags (C3+C4 editable inline) */}
          <NotesAndTagsEditor
            tenantId={data.tenant_id}
            initialNotes={data.tenant_notes}
            initialTags={data.tags}
            user={user}
            onSaved={fetchDetail}
          />
        </div>
      )}
      {/* ===== TAB: CONFIG ===== */}
      {tab === 'config' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
            config_pro ({Object.keys(cfg).length} campos — tokens sensibles enmascarados)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <tbody>
                {Object.entries(cfg).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => (
                  <tr key={k} className="border-b border-white/[0.03]">
                    <td className="py-2 pr-4 text-gray-500 font-mono align-top whitespace-nowrap">{k}</td>
                    <td className="py-2 text-gray-200 break-all">
                      {typeof v === 'object'
                        ? <pre className="text-[10px] text-gray-400 bg-black/30 rounded p-2 whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>
                        : typeof v === 'boolean'
                          ? <span className={v ? 'text-emerald-400' : 'text-gray-500'}>{String(v)}</span>
                          : String(v).length > 80
                            ? <details><summary className="cursor-pointer text-indigo-400">{String(v).slice(0, 80)}...</summary><div className="mt-1 break-all">{String(v)}</div></details>
                            : String(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* ===== TAB: ERRORES ===== */}
      {tab === 'errors' && (
        data.errors_recent.length === 0 ? (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
            <p className="text-5xl mb-4">✨</p>
            <h3 className="font-bold mb-1">Sin errores recientes</h3>
            <p className="text-xs text-gray-400">
              Ningún error en los últimos 7 días para este tenant.
            </p>
            <Link href="/admin/errors" className="mt-4 inline-block text-xs text-indigo-400 hover:text-indigo-300 font-bold">
              Ver todos los errores →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {data.errors_recent.map((e, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold">
                    {e.error_type}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                    {e.service}
                  </span>
                  <span className="text-[10px] text-gray-500 ml-auto">{formatTime(e.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 break-words">{e.message}</p>
              </div>
            ))}
            <Link href={`/admin/errors?company_id=${data.tenant_id}`}
              className="block text-center text-xs text-indigo-400 hover:text-indigo-300 font-bold py-3">
              Ver todos los errores de este tenant →
            </Link>
          </div>
        )
      )}
      {/* ===== TAB: TIMELINE ===== */}
      {tab === 'timeline' && (
        data.timeline.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">📜</p>
            <p className="text-xs text-gray-400">Sin eventos en el audit log</p>
          </div>
        ) : (
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/10"></div>
            <div className="space-y-3">
              {data.timeline.map((t, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-[11px] top-2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0B0F1A]"></div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{t.action}</span>
                        {t.target && (
                          <code className="text-[10px] font-mono text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded">
                            {t.target}
                          </code>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatTime(t.timestamp)}</span>
                    </div>
                    {t.actor && (
                      <p className="text-[10px] text-gray-500 mt-1">por <span className="text-gray-300">{t.actor}</span></p>
                    )}
                    {t.details && (
                      <p className="text-[11px] text-gray-400 mt-1 break-words">{t.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
      {/* Footer info */}
      <p className="text-[10px] text-gray-600 text-center">
        Generado {formatTime(data._generated_at)}
      </p>
    </div>
  );
}
// ============================================================
// C3+C4: Editor inline de notas internas + tags
// ============================================================
const PRESET_TAGS = [
  { id: 'vip', label: 'VIP', color: 'amber' },
  { id: 'beta', label: 'Beta', color: 'purple' },
  { id: 'churn-risk', label: 'Riesgo churn', color: 'red' },
  { id: 'pago-tarde', label: 'Paga tarde', color: 'orange' },
  { id: 'testing', label: 'Testing', color: 'blue' },
  { id: 'multi-persona', label: 'Multi-persona', color: 'emerald' },
  { id: 'high-volume', label: 'Alto volumen', color: 'sky' },
];
function NotesAndTagsEditor({ tenantId, initialNotes, initialTags, user, onSaved }: any) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [customTag, setCustomTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'client-id': user?.sub || user?.email,
          'x-user-email': user?.email,
        },
        body: JSON.stringify({ tenant_notes: notes, tags }),
      });
      if (res.ok) {
        setSavedAt(Date.now());
        setDirty(false);
        if (onSaved) onSaved();
      } else {
        alert('Error guardando');
      }
    } catch {
      alert('Error de conexión');
    }
    setSaving(false);
  };
  const toggleTag = (tagId: string) => {
    setTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
    setDirty(true);
  };
  const addCustomTag = () => {
    const clean = customTag.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 30);
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setCustomTag('');
      setDirty(true);
    }
  };
  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(t => t !== tagId));
    setDirty(true);
  };
  const presetIds = PRESET_TAGS.map(p => p.id);
  const customTags = tags.filter(t => !presetIds.includes(t));
  return (
    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 space-y-4">
      <div>
        <p className="text-[10px] text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          🗒️ Notas internas (solo admins)
          {dirty && <span className="text-[9px] text-orange-400">(sin guardar)</span>}
          {savedAt && !dirty && <span className="text-[9px] text-emerald-400">✓ guardado</span>}
        </p>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
          placeholder="Notas privadas sobre este tenant (visibles solo para admins)..."
          maxLength={2000}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 resize-none"
        />
        <p className="text-[9px] text-gray-500 text-right mt-1">{notes.length}/2000</p>
      </div>
      <div>
        <p className="text-[10px] text-yellow-500 uppercase tracking-widest mb-2">🏷️ Tags</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESET_TAGS.map(p => (
            <button key={p.id} onClick={() => toggleTag(p.id)}
              className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all border ${
                tags.includes(p.id)
                  ? `bg-${p.color}-500/20 text-${p.color}-400 border-${p.color}-500/40`
                  : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'
              }`}>
              {tags.includes(p.id) ? '✓ ' : ''}{p.label}
            </button>
          ))}
        </div>
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {customTags.map(t => (
              <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center gap-1">
                {t}
                <button onClick={() => removeTag(t)} className="hover:text-red-400 ml-1">✕</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input type="text" value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
            placeholder="Tag custom..."
            maxLength={30}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500" />
          <button onClick={addCustomTag} disabled={!customTag.trim()}
            className="text-[10px] px-3 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white font-bold disabled:opacity-30 transition-all">
            + Agregar
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-yellow-500/10 pt-3">
        <button onClick={save} disabled={!dirty || saving}
          className="text-xs px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold disabled:opacity-30 transition-all">
          {saving ? '⏳ Guardando...' : dirty ? '💾 Guardar cambios' : '✓ Sin cambios'}
        </button>
      </div>
    </div>
  );
}
// ============================================================
// C7: Panel de acciones de status (Suspender / Reactivar / Eliminar)
// ============================================================
function StatusActionsPanel({ tenantId, currentStatus, user, onChanged }: any) {
  const [acting, setActing] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { action: 'SUSPENDED' | 'ACTIVE' | 'DELETED', title: string, desc: string, requireReason: boolean }>(null);
  const [reason, setReason] = useState('');
  const openModal = (action: 'SUSPENDED' | 'ACTIVE' | 'DELETED') => {
    const configs = {
      SUSPENDED: {
        title: '⏸️ Suspender tenant',
        desc: 'El bot dejará de responderle al usuario final (silencio total). No se pierde data, se puede reactivar cuando quieras.',
        requireReason: true,
      },
      ACTIVE: {
        title: '✅ Reactivar tenant',
        desc: 'El bot volverá a responder normalmente.',
        requireReason: false,
      },
      DELETED: {
        title: '🗑️ Marcar como eliminado',
        desc: 'Soft delete. El bot se apaga, el tenant sale de las listas por defecto, pero la data queda intacta durante 90 días.',
        requireReason: true,
      },
    };
    setReason('');
    setModal({ action, ...configs[action] });
  };
  const execute = async () => {
    if (!modal) return;
    if (modal.requireReason && !reason.trim()) {
      alert('Escribe una razón para auditoría');
      return;
    }
    setActing(modal.action);
    try {
      const res = await fetch(`${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'client-id': user?.sub || user?.email,
          'x-user-email': user?.email,
        },
        body: JSON.stringify({ status: modal.action, reason: reason.trim() }),
      });
      if (res.ok) {
        setModal(null);
        if (onChanged) onChanged();
      } else {
        const err = await res.json().catch(() => ({}));
        alert('Error: ' + (err.error || res.status));
      }
    } catch {
      alert('Error de conexión');
    }
    setActing(null);
  };
  const isSuspended = currentStatus === 'SUSPENDED';
  const isDeleted = currentStatus === 'DELETED';
  return (
    <>
      {isSuspended || isDeleted ? (
        <button onClick={() => openModal('ACTIVE')} disabled={acting === 'ACTIVE'}
          className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all disabled:opacity-50">
          {acting === 'ACTIVE' ? '⏳' : '✅ Reactivar'}
        </button>
      ) : (
        <button onClick={() => openModal('SUSPENDED')} disabled={acting === 'SUSPENDED'}
          className="text-xs px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white border border-yellow-500/30 rounded-lg font-bold transition-all disabled:opacity-50">
          {acting === 'SUSPENDED' ? '⏳' : '⏸️ Suspender'}
        </button>
      )}
      {!isDeleted && (
        <button onClick={() => openModal('DELETED')} disabled={acting === 'DELETED'}
          className="text-xs px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-lg font-bold transition-all disabled:opacity-50">
          {acting === 'DELETED' ? '⏳' : '🗑️ Eliminar'}
        </button>
      )}
      {/* Modal de confirmación */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModal(null)}>
          <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">{modal.title}</h3>
            <p className="text-xs text-gray-400 mb-4">{modal.desc}</p>
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Tenant</p>
              <code className="text-xs text-indigo-300 font-mono">{tenantId}</code>
            </div>
            {modal.requireReason && (
              <div className="mb-4">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">
                  Razón (requerida para auditoría)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Cliente no pagó 3 meses / pausa vacaciones / cierre de cuenta..."
                  maxLength={500}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 resize-none"
                />
                <p className="text-[9px] text-gray-600 text-right mt-1">{reason.length}/500</p>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(null)}
                className="text-xs px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-400 rounded-lg font-bold transition-all">
                Cancelar
              </button>
              <button onClick={execute} disabled={acting !== null}
                className={`text-xs px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 ${
                  modal.action === 'ACTIVE' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                  modal.action === 'DELETED' ? 'bg-red-600 hover:bg-red-500 text-white' :
                  'bg-yellow-600 hover:bg-yellow-500 text-white'
                }`}>
                {acting ? '⏳ Aplicando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}