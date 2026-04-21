'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AdsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'metrics' | 'campaigns' | 'audiences' | 'create'>('metrics');
  const [metrics, setMetrics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [audiences, setAudiences] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [createForm, setCreateForm] = useState({ service_slug: '', budget_daily: '15000', audience_id: '', name: '' });
  const [syncForm, setSyncForm] = useState({ name: '', segment: 'all' });
  const [syncing, setSyncing] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const h = { 'client-id': user?.companyId || '' };
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ads/metrics`, { headers: h }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).catch(() => ({ campaigns: [] })),
      fetch(`${API_URL}/ads/audiences`, { headers: h }).then(r => r.json()).catch(() => ({ audiences: [] })),
      fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).catch(() => ({ services: [] })),
    ]).then(([m, c, a, s]) => {
      setMetrics(m); setCampaigns(c.campaigns || []); setAudiences(a.audiences || []); setServices(s.services || []);
      setLoading(false);
    });
  }, []);
  const handleGenerate = async () => {
    setCreating(true); setVariants([]);
    try {
      const res = await fetch(`${API_URL}/ads/campaigns/generate`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_slug: createForm.service_slug, budget_daily: parseInt(createForm.budget_daily), audience_id: createForm.audience_id }),
      });
      const data = await res.json();
      setVariants(data.variants || []);
    } catch { showToast('Error generando'); }
    setCreating(false);
  };
  const handlePublish = async () => {
    if (!variants.length) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/ads/campaigns/publish`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createForm.name || `Campana ${new Date().toLocaleDateString()}`, objective: 'OUTCOME_LEADS', budget_daily: parseInt(createForm.budget_daily), audience_id: createForm.audience_id, variants }),
      });
      const data = await res.json();
      if (res.ok) { showToast(`✓ ${data.message}`); setVariants([]); setTab('campaigns');
        fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).then(d => setCampaigns(d.campaigns || []));
      } else showToast(data.error || 'Error');
    } catch { showToast('Error publicando'); }
    setCreating(false);
  };
  const handleSyncAudience = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_URL}/ads/audiences/sync`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify(syncForm),
      });
      const data = await res.json();
      if (res.ok) { showToast(`✓ ${data.message}`);
        fetch(`${API_URL}/ads/audiences`, { headers: h }).then(r => r.json()).then(d => setAudiences(d.audiences || []));
      } else showToast(data.error || 'Error');
    } catch { showToast('Error sincronizando'); }
    setSyncing(false);
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
    return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <h1 className="text-2xl font-bold mb-6">Facebook Ads 📢</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[{id:'metrics',l:'📊 Métricas'},{id:'campaigns',l:'📋 Campañas'},{id:'audiences',l:'👥 Audiencias'},{id:'create',l:'✨ Crear'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t.l}
          </button>
        ))}
      </div>
      {tab === 'metrics' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: 'Gasto', value: `$${(metrics?.spend || 0).toLocaleString()}`, color: 'text-red-400' },
              { label: 'Impresiones', value: (metrics?.impressions || 0).toLocaleString(), color: 'text-indigo-400' },
              { label: 'Clicks', value: (metrics?.clicks || 0).toLocaleString(), color: 'text-sky-400' },
              { label: 'CTR', value: `${(metrics?.ctr || 0).toFixed(2)}%`, color: 'text-emerald-400' },
              { label: 'CPC', value: `$${(metrics?.cpc || 0).toLocaleString()}`, color: 'text-purple-400' },
              { label: 'Leads', value: metrics?.leads || 0, color: 'text-yellow-400' },
            ].map((m, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
          {!metrics?.impressions && (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-3xl mb-3">📢</p>
              <p className="text-gray-400 text-sm">Sin datos de Ads. Crea tu primera campaña.</p>
              <button onClick={() => setTab('create')} className="mt-3 text-indigo-400 text-sm font-bold">Crear campaña →</button>
            </div>
          )}
        </div>
      )}
      {tab === 'campaigns' && (
        campaigns.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-gray-400 text-sm">No hay campañas.</p>
            <button onClick={() => setTab('create')} className="mt-3 text-indigo-400 text-sm font-bold">Crear →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.ad_ids?.length || 0} anuncios • ${(c.budget_daily || 0).toLocaleString()}/día</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{c.status || 'PAUSED'}</span>
                  <span className="text-[10px] text-gray-600">{new Date((c.created_at || 0) * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {tab === 'audiences' && (
        <div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-4">
            <h3 className="font-bold mb-3">Crear audiencia desde CRM</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={syncForm.name} onChange={e => setSyncForm({...syncForm, name: e.target.value})} placeholder="Nombre audiencia"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              <select value={syncForm.segment} onChange={e => setSyncForm({...syncForm, segment: e.target.value})}
                className="bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                <option value="all">Todos los leads</option>
                <option value="buyers">Compradores</option>
                <option value="interested">Interesados</option>
                <option value="new">Nuevos</option>
              </select>
              <button onClick={handleSyncAudience} disabled={syncing}
                className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-30 transition-all">
                {syncing ? '⏳...' : '👥 Sincronizar'}
              </button>
            </div>
          </div>
          {audiences.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No hay audiencias</p>
          ) : (
            <div className="space-y-2">
              {audiences.map((a, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <div><p className="font-medium text-sm">{a.name}</p><p className="text-[10px] text-gray-500">{a.segment} • {a.count} contactos</p></div>
                  <span className="text-[10px] text-gray-600">{new Date((a.created_at || 0) * 1000).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'create' && (
        <div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-4">
            <h3 className="font-bold mb-4">✨ Crear campaña con IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Servicio</label>
                <select value={createForm.service_slug} onChange={e => setCreateForm({...createForm, service_slug: e.target.value})}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="">General (todo el negocio)</option>
                  {services.map((s, i) => <option key={i} value={s.slug}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Presupuesto diario</label>
                <input type="number" value={createForm.budget_daily} onChange={e => setCreateForm({...createForm, budget_daily: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Audiencia</label>
                <select value={createForm.audience_id} onChange={e => setCreateForm({...createForm, audience_id: e.target.value})}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="">Automática (Colombia 18-65)</option>
                  {audiences.map((a, i) => <option key={i} value={a.id}>{a.name} ({a.count})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre campaña</label>
                <input value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
                  placeholder="Mi campaña..." />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
              {creating ? '⏳ Generando...' : '✨ Generar variantes con IA'}
            </button>
          </div>
          {variants.length > 0 && (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Preview de anuncios ({variants.length} variantes)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {variants.map((v, i) => (
                  <div key={i} className="border border-white/10 rounded-xl p-4">
                    <p className="text-[10px] text-gray-500 mb-2">Variante {i + 1}</p>
                    <p className="font-bold text-sm mb-1">{v.headline}</p>
                    <p className="text-xs text-gray-300 mb-2">{v.text}</p>
                    <p className="text-[10px] text-gray-500">{v.description}</p>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 mt-2 inline-block">{v.cta}</span>
                  </div>
                ))}
              </div>
              <button onClick={handlePublish} disabled={creating}
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
                {creating ? '⏳ Publicando...' : '📢 Publicar campaña (pausada)'}
              </button>
              <p className="text-[9px] text-gray-600 mt-2">La campaña se crea pausada. Actívala cuando estés listo.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}