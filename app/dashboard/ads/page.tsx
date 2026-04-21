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
  const [syncForm, setSyncForm] = useState({ name: '', segment: 'all' });
  const [syncing, setSyncing] = useState(false);
  const [wizStep, setWizStep] = useState(1);
  const [wiz, setWiz] = useState({ goal: 'whatsapp', service_slug: '', location: '', radius: '10', budget_total: '100000' });
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
  const handleLaunch = async () => {
    setCreating(true); setVariants([]);
    showToast('⏳ La IA está creando tu campaña...');
    try {
      const budgetDaily = Math.max(5000, Math.round(parseInt(wiz.budget_total) / 7));
      const genRes = await fetch(`${API_URL}/ads/campaigns/generate`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_slug: wiz.service_slug, budget_daily: budgetDaily }),
      });
      const genData = await genRes.json();
      const v = genData.variants || [];
      if (!v.length) { showToast('Error generando anuncios'); setCreating(false); return; }
      setVariants(v);
      const svc = services.find(s => s.slug === wiz.service_slug);
      const campName = svc ? `${svc.name} - ${new Date().toLocaleDateString()}` : `Campaña ${new Date().toLocaleDateString()}`;
      const pubRes = await fetch(`${API_URL}/ads/campaigns/publish`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: campName, objective: wiz.goal === 'whatsapp' ? 'OUTCOME_LEADS' : 'OUTCOME_TRAFFIC', budget_daily: budgetDaily, variants: v }),
      });
      const pubData = await pubRes.json();
      if (pubRes.ok) {
        showToast('✅ ¡Campaña creada! La IA optimizará automáticamente.');
        setTab('metrics'); setWizStep(1);
        fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).then(d => setCampaigns(d.campaigns || []));
        fetch(`${API_URL}/ads/metrics`, { headers: h }).then(r => r.json()).then(d => setMetrics(d));
      } else showToast(pubData.error || 'Error publicando');
    } catch { showToast('Error de conexión'); }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publicidad 📢</h1>
        {campaigns.length > 0 && tab !== 'create' && (
          <button onClick={() => { setTab('create'); setWizStep(1); }} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            + Nueva campaña
          </button>
        )}
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[{id:'metrics',l:'📊 Resultados'},{id:'campaigns',l:'📋 Mis campañas'},{id:'audiences',l:'👥 Audiencias'},{id:'create',l:'✨ Crear campaña'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t.l}
          </button>
        ))}
      </div>
      {tab === 'metrics' && (
        <div>
          {!metrics?.impressions && !campaigns.length ? (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
              <p className="text-5xl mb-4">📢</p>
              <h2 className="text-xl font-bold mb-2">Atrae más clientes con publicidad</h2>
              <p className="text-gray-400 text-sm mb-6">La IA crea y optimiza tus anuncios automáticamente.<br/>Solo dinos qué promocionar y cuánto invertir.</p>
              <button onClick={() => { setTab('create'); setWizStep(1); }} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-sm font-bold transition-all">
                🚀 Crear mi primera campaña
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Invertido</p>
                  <p className="text-2xl font-bold text-white">${(metrics?.spend || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Personas alcanzadas</p>
                  <p className="text-2xl font-bold text-indigo-400">{(metrics?.impressions || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Te escribieron</p>
                  <p className="text-2xl font-bold text-emerald-400">{metrics?.leads || metrics?.clicks || 0}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Costo por cliente</p>
                  <p className="text-2xl font-bold text-purple-400">${(metrics?.leads ? Math.round((metrics?.spend || 0) / metrics.leads) : 0).toLocaleString()}</p>
                </div>
              </div>
              {(metrics?.spend || 0) > 0 && (metrics?.leads || 0) === 0 && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-yellow-400 font-bold">💡 Aún no tienes leads. Es normal los primeros 2-3 días mientras Facebook aprende. La IA está optimizando.</p>
                </div>
              )}
            </>
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
        <div className="max-w-lg mx-auto">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <div className="flex gap-1 mb-6">
              {[1,2,3].map(s => (
                <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= wizStep ? 'bg-indigo-500' : 'bg-white/10'}`} />
              ))}
            </div>
            {wizStep === 1 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Qué quieres promocionar?</h3>
                <p className="text-xs text-gray-400 mb-4">Elige un servicio o producto</p>
                <div className="space-y-2 mb-4">
                  <button onClick={() => setWiz({...wiz, service_slug: ''})}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${!wiz.service_slug ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                    <p className="text-sm font-bold">🏢 Todo mi negocio</p>
                    <p className="text-[10px] text-gray-500">Anuncio general</p>
                  </button>
                  {services.filter(s => s.active !== false).map((s, i) => (
                    <button key={i} onClick={() => setWiz({...wiz, service_slug: s.slug})}
                      className={`w-full p-3 rounded-xl text-left transition-all border ${wiz.service_slug === s.slug ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-[10px] text-gray-500">${(s.pricing?.regular_price || 0).toLocaleString()}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => setWizStep(2)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">
                  Siguiente →
                </button>
              </div>
            )}
            {wizStep === 2 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Dónde están tus clientes?</h3>
                <p className="text-xs text-gray-400 mb-4">¿Hasta dónde quieres que llegue tu anuncio?</p>
                <div className="space-y-2 mb-4">
                  {[
                    { id: '5', icon: '📍', label: 'Muy cerca', desc: 'A 5 km de mi negocio' },
                    { id: '10', icon: '🏘️', label: 'Mi zona', desc: 'A 10 km (recomendado)' },
                    { id: '25', icon: '🏙️', label: 'Mi ciudad', desc: 'A 25 km' },
                    { id: '0', icon: '🌎', label: 'Todo el país', desc: 'Sin límite geográfico' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setWiz({...wiz, radius: opt.id})}
                      className={`w-full p-3 rounded-xl text-left transition-all border ${wiz.radius === opt.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                      <p className="text-sm font-bold">{opt.icon} {opt.label}</p>
                      <p className="text-[10px] text-gray-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {wiz.radius !== '0' && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-1 block">Dirección de tu negocio</label>
                    <input value={wiz.location} onChange={e => setWiz({...wiz, location: e.target.value})}
                      placeholder="Ej: Calle 80 #45-20, Medellín"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(1)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={() => setWizStep(3)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">Siguiente →</button>
                </div>
              </div>
            )}
            {wizStep === 3 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Cuánto quieres invertir?</h3>
                <p className="text-xs text-gray-400 mb-4">Presupuesto total para esta campaña (7 días)</p>
                <div className="space-y-2 mb-4">
                  {[
                    { amount: '50000', label: '💡 Probar', desc: '$50,000 — ~300 personas verán tu anuncio', tag: '' },
                    { amount: '150000', label: '🚀 Crecer', desc: '$150,000 — ~1,000 personas', tag: 'Recomendado' },
                    { amount: '350000', label: '🔥 Escalar', desc: '$350,000 — ~3,000 personas', tag: 'Más resultados' },
                  ].map(opt => (
                    <button key={opt.amount} onClick={() => setWiz({...wiz, budget_total: opt.amount})}
                      className={`w-full p-3 rounded-xl text-left transition-all border relative ${wiz.budget_total === opt.amount ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                      <p className="text-sm font-bold">{opt.label}</p>
                      <p className="text-[10px] text-gray-500">{opt.desc}</p>
                      {opt.tag && <span className="absolute top-2 right-3 text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">{opt.tag}</span>}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1 block">O escribe un monto personalizado</label>
                  <input type="number" value={wiz.budget_total} onChange={e => setWiz({...wiz, budget_total: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                  <p className="text-[9px] text-gray-600 mt-1">${Math.max(5000, Math.round(parseInt(wiz.budget_total || '0') / 7)).toLocaleString()}/día durante 7 días</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(2)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={handleLaunch} disabled={creating}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
                    {creating ? '⏳ Creando...' : '🚀 Lanzar campaña'}
                  </button>
                </div>
                <p className="text-[9px] text-gray-600 text-center mt-3">La IA creará los anuncios automáticamente y los optimizará cada día.</p>
              </div>
            )}
          </div>
        </div>
      )} 
    </div>
  );
}