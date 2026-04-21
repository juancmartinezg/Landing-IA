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
  const [publishing, setPublishing] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [syncForm, setSyncForm] = useState({ name: '', segment: 'all' });
  const [syncing, setSyncing] = useState(false);
  const [wizStep, setWizStep] = useState(1);
  const [wiz, setWiz] = useState({ service_slug: '', country: 'CO', city: '', location: '', radius: '10', budget_daily: '15000', duration: '7', ad_account_id: '', page_id: '', page_name: '', instagram_id: '' });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [igAccounts, setIgAccounts] = useState<any[]>([]);
  const [campFilter, setCampFilter] = useState('all');
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [genImgIdx, setGenImgIdx] = useState<number | null>(null);
  const [businessType, setBusinessType] = useState('servicios');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const h = { 'client-id': user?.companyId || '' };
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ads/metrics`, { headers: h }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).catch(() => ({ campaigns: [] })),
      fetch(`${API_URL}/ads/audiences`, { headers: h }).then(r => r.json()).catch(() => ({ audiences: [] })),
      fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).catch(() => ({ services: [] })),
      fetch(`${API_URL}/ads/accounts`, { headers: h }).then(r => r.json()).catch(() => ({ accounts: [] })),
      fetch(`${API_URL}/ads/pages`, { headers: h }).then(r => r.json()).catch(() => ({ pages: [] })),
    ]).then(([m, c, a, s, ac, pg]) => {
      setMetrics(m); setCampaigns(c.campaigns || []); setAudiences(a.audiences || []); setServices(s.services || []);
      const accs = ac.accounts || [];
      setAccounts(accs);
      setPages(pg.pages || []);
      const selAcc = accs.find((x: any) => x.selected);
      if (selAcc) setWiz(prev => ({...prev, ad_account_id: selAcc.id}));
      const selPage = (pg.pages || []).find((x: any) => x.selected);
      if (selPage) setWiz(prev => ({...prev, page_id: selPage.id, page_name: selPage.name}));
      fetch(`${API_URL}/config`, { headers: h }).then(r => r.json()).then(cfg => {
        setBusinessType(cfg.business_type || 'servicios');
      }).catch(() => {});
      setLoading(false);
    });
  }, []);
  const handleGenerate = async () => {
    setCreating(true); setVariants([]);
    showToast('⏳ La IA está creando tus anuncios...');
    try {
      const budgetDaily = Math.max(5000, parseInt(wiz.budget_daily || '15000'));
      const res = await fetch(`${API_URL}/ads/campaigns/generate`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_slug: wiz.service_slug, budget_daily: budgetDaily }),
      });
      const data = await res.json();
      if (data.variants?.length) {
        const svcImg = data.service_image || '';
        const withImg = data.variants.map((x: any) => ({...x, image_url: x.image_url || svcImg}));
        setVariants(withImg); showToast('✅ Creativos listos. Revisa y edita.'); setWizStep(5);
      }
      else showToast('Error generando creativos');
    } catch { showToast('Error de conexión'); }
    setCreating(false);
  };
  const handlePublish = async () => {
    if (!variants.length) return;
    setPublishing(true);
    // Guardar cuenta seleccionada
    if (wiz.ad_account_id || wiz.page_id) {
      await fetch(`${API_URL}/ads/select-account`, {
        method: 'PUT', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_account_id: wiz.ad_account_id, page_id: wiz.page_id, page_name: wiz.page_name, instagram_id: wiz.instagram_id }),
      }).catch(() => {});
    }
    try {
      const svc = services.find(s => s.slug === wiz.service_slug);
      const campName = svc ? `${svc.name} - ${new Date().toLocaleDateString()}` : `Campaña ${new Date().toLocaleDateString()}`;
      const budgetDaily = Math.max(5000, parseInt(wiz.budget_daily || '15000'));
      const res = await fetch(`${API_URL}/ads/campaigns/publish`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: campName, objective: 'OUTCOME_LEADS', budget_daily: budgetDaily, variants, country: wiz.country, city: wiz.city, radius: wiz.radius, duration: wiz.duration, service_slug: wiz.service_slug })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✅ ¡Campaña publicada!'); setTab('campaigns'); setWizStep(1); setVariants([]);
        fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).then(d => setCampaigns(d.campaigns || []));
      } else showToast(data.error || 'Error');
    } catch { showToast('Error de conexión'); }
    setPublishing(false);
  };
  const loadInstagram = async (pageId: string) => {
    try {
      const res = await fetch(`${API_URL}/ads/instagram`, { headers: h });
      const data = await res.json();
      setIgAccounts(data.instagram_accounts || []);
    } catch {}
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
          <div>
            <div className="flex gap-2 mb-4">
              {[{id:'all',l:'Todas'},{id:'ACTIVE',l:'🟢 Activas'},{id:'PAUSED',l:'⏸ Pausadas'}].map(f => (
                <button key={f.id} onClick={() => setCampFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${campFilter === f.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {f.l} ({f.id === 'all' ? campaigns.length : campaigns.filter(c => c.status === f.id).length})
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {campaigns.filter(c => campFilter === 'all' || c.status === campFilter).map((c, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.ad_ids?.length || 0} anuncios{c.budget_daily ? ` • $${c.budget_daily.toLocaleString()}/día` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${c.status === 'ACTIVE' && c.budget_daily > 0 ? 'bg-emerald-500/20 text-emerald-400' : c.status === 'ACTIVE' ? 'bg-gray-500/20 text-gray-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{c.status === 'ACTIVE' && !c.budget_daily ? 'Finalizada' : c.status === 'ACTIVE' ? 'Activa' : 'Pausada'}</span>
                    <button onClick={async () => {
                      const ns = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
                      const res = await fetch(`${API_URL}/ads/campaigns/toggle`, {
                        method: 'PUT', headers: { ...h, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ campaign_id: c.campaign_id, status: ns }),
                      });
                      const data = await res.json();
                      if (res.ok) { showToast(`✓ ${data.message}`); fetch(`${API_URL}/ads/campaigns`, { headers: h }).then(r => r.json()).then(d => setCampaigns(d.campaigns || [])); }
                      else showToast(data.error || 'Error');
                    }} className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all ${c.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                      {c.status === 'ACTIVE' ? '⏸ Pausar' : '▶ Activar'}
                    </button>
                    <span className="text-[10px] text-gray-600">{new Date((c.created_at || 0) * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
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
              {[1,2,3,4,5].map(s => (
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
                <button onClick={() => setWizStep(2)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">Siguiente →</button>
              </div>
            )}
            {wizStep === 2 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Dónde están tus clientes?</h3>
                <p className="text-xs text-gray-400 mb-4">Configura la ubicación de tu anuncio</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">País</label>
                    <select value={wiz.country} onChange={e => setWiz({...wiz, country: e.target.value})}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                      <option value="CO">🇨🇴 Colombia</option>
                      <option value="MX">🇲🇽 México</option>
                      <option value="AR">🇦🇷 Argentina</option>
                      <option value="CL">🇨🇱 Chile</option>
                      <option value="PE">🇵🇪 Perú</option>
                      <option value="EC">🇪🇨 Ecuador</option>
                      <option value="US">🇺🇸 Estados Unidos</option>
                      <option value="ES">🇪🇸 España</option>
                      <option value="BR">🇧🇷 Brasil</option>
                      <option value="PA">🇵🇦 Panamá</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Ciudad (opcional)</label>
                    <input value={wiz.city} onChange={e => setWiz({...wiz, city: e.target.value})} placeholder="Ej: Medellín, Bogotá, Miami..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Alcance</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: '10', icon: '📍', label: 'Mi zona (10 km)' },
                        { id: '25', icon: '🏙️', label: 'Mi ciudad (25 km)' },
                        { id: '50', icon: '🗺️', label: 'Mi región (50 km)' },
                        { id: '0', icon: '🌎', label: 'Todo el país' },
                      ].map(opt => (
                        <button key={opt.id} onClick={() => setWiz({...wiz, radius: opt.id})}
                          className={`p-2.5 rounded-xl text-left transition-all border ${wiz.radius === opt.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                          <p className="text-xs font-bold">{opt.icon} {opt.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  {wiz.radius !== '0' && (
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Dirección del negocio (para el radio)</label>
                      <input value={wiz.location} onChange={e => setWiz({...wiz, location: e.target.value})} placeholder="Ej: Calle 80 #45-20"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(1)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={() => setWizStep(3)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">Siguiente →</button>
                </div>
              </div>
            )}
            {wizStep === 3 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Cuánto quieres invertir?</h3>
                <p className="text-xs text-gray-400 mb-4">Presupuesto diario (lo que Meta recomienda)</p>
                <div className="space-y-2 mb-4">
                  {[
                    { amount: '10000', label: '💡 Probar', desc: '$10,000/día — ~200 personas', tag: '' },
                    { amount: '20000', label: '🚀 Crecer', desc: '$20,000/día — ~600 personas', tag: 'Recomendado' },
                    { amount: '50000', label: '🔥 Escalar', desc: '$50,000/día — ~1,500 personas', tag: '' },
                  ].map(opt => (
                    <button key={opt.amount} onClick={() => setWiz({...wiz, budget_daily: opt.amount})}
                      className={`w-full p-3 rounded-xl text-left transition-all border relative ${wiz.budget_daily === opt.amount ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                      <p className="text-sm font-bold">{opt.label}</p>
                      <p className="text-[10px] text-gray-500">{opt.desc}</p>
                      {opt.tag && <span className="absolute top-2 right-3 text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">{opt.tag}</span>}
                    </button>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-400 mb-1 block">Monto diario personalizado</label>
                  <input type="number" value={wiz.budget_daily} onChange={e => setWiz({...wiz, budget_daily: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-2 block">Duración</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '7', label: '7 días' },
                      { id: '15', label: '15 días' },
                      { id: '30', label: '30 días' },
                      { id: '0', label: 'Indefinida' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setWiz({...wiz, duration: opt.id})}
                        className={`p-2.5 rounded-xl text-center transition-all border ${wiz.duration === opt.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                        <p className="text-xs font-bold">{opt.label}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-600 mt-2">
                    {wiz.duration === '0' ? 'La campaña correrá hasta que la pauses' : `Total estimado: $${(parseInt(wiz.budget_daily || '0') * parseInt(wiz.duration || '7')).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(2)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={() => setWizStep(4)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">Siguiente →</button>
                </div>
              </div>
            )}
            {wizStep === 4 && (
              <div>
                <h3 className="font-bold text-lg mb-2">¿Dónde publicar?</h3>
                <p className="text-xs text-gray-400 mb-4">Selecciona tu cuenta publicitaria y página</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Cuenta publicitaria</label>
                    {accounts.length === 0 ? (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                        <p className="text-xs text-yellow-400 mb-2">⚠️ No tienes cuentas publicitarias activas.</p>
                        <button onClick={async () => {
                          showToast('⏳ Creando cuenta publicitaria...');
                          const res = await fetch(`${API_URL}/ads/create-account`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' } });
                          const data = await res.json();
                          if (res.ok) { showToast(`✓ ${data.message}`); const ac = await fetch(`${API_URL}/ads/accounts`, { headers: h }).then(r => r.json()); setAccounts(ac.accounts || []); if (ac.accounts?.length) setWiz(prev => ({...prev, ad_account_id: ac.accounts[0].id})); }
                          else showToast(data.error || 'Error');
                        }} className="text-[10px] px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
                          + Crear cuenta publicitaria
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {accounts.map((acc, i) => (
                          <button key={i} onClick={() => setWiz({...wiz, ad_account_id: acc.id})}
                            className={`w-full p-3 rounded-xl text-left transition-all border ${wiz.ad_account_id === acc.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                            <p className="text-sm font-bold">{acc.name}</p>
                            <p className="text-[10px] text-gray-500">{acc.business_name} • {acc.currency}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Página de Facebook</label>
                    {pages.length === 0 ? (
                      <p className="text-xs text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">⚠️ No tienes páginas vinculadas.</p>
                    ) : (
                      <div className="space-y-2">
                        {pages.map((pg, i) => (
                          <button key={i} onClick={() => { setWiz({...wiz, page_id: pg.id, page_name: pg.name}); loadInstagram(pg.id); }}
                            className={`w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${wiz.page_id === pg.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                            {pg.picture && <img src={pg.picture} className="w-8 h-8 rounded-full shrink-0" />}
                            <p className="text-sm font-bold">{pg.name}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {igAccounts.length > 0 && (
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Instagram (opcional)</label>
                      <div className="space-y-2">
                        <button onClick={() => setWiz({...wiz, instagram_id: ''})}
                          className={`w-full p-3 rounded-xl text-left transition-all border ${!wiz.instagram_id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                          <p className="text-sm">Sin Instagram</p>
                        </button>
                        {igAccounts.map((ig, i) => (
                          <button key={i} onClick={() => setWiz({...wiz, instagram_id: ig.id})}
                            className={`w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${wiz.instagram_id === ig.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                            {ig.profile_pic && <img src={ig.profile_pic} className="w-8 h-8 rounded-full shrink-0" />}
                            <p className="text-sm font-bold">@{ig.username}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setWizStep(3)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={handleGenerate} disabled={creating || !wiz.ad_account_id || !wiz.page_id}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
                    {creating ? '⏳ Generando anuncios (~15s)...' : '✨ Generar anuncios'}
                  </button>
                </div>
                {(!wiz.ad_account_id || !wiz.page_id) && (
                  <p className="text-[9px] text-yellow-400 text-center mt-2">Selecciona cuenta y página para continuar</p>
                )}
              </div>
            )}
            {wizStep === 5 && variants.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Revisa tus anuncios</h3>
                <p className="text-xs text-gray-400 mb-4">La IA generó {variants.length} variantes. Edita lo que quieras.</p>
                <div className="space-y-3 mb-4">
                  {variants.map((v, i) => (
                    <div key={i} className="border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-gray-500">Anuncio {i + 1}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[9px] text-gray-500">Imagen</label>
                          <div className="flex gap-2 items-center">
                            {v.image_url ? (
                              <img src={v.image_url} className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-all"
                                onClick={() => setPreviewImg(v.image_url)} title="Click para ver en grande" />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 text-[10px]">Sin imagen</div>
                            )}
                            <div className="flex flex-col gap-1">
                              {genImgIdx === i && (
                                <div className="w-full">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{width: '60%', animation: 'pulse 2s infinite'}} />
                                    </div>
                                    <span className="text-[8px] text-purple-400">Generando...</span>
                                  </div>
                                  <p className="text-[8px] text-gray-600">Puede tardar ~1-2 minutos</p>
                                </div>
                              )}
                              {['servicios', 'salud', 'todos'].includes(businessType) && genImgIdx !== i && (
                                <button onClick={async () => {
                                  setGenImgIdx(i);
                                  const res = await fetch(`${API_URL}/ads/generate-image`, {
                                    method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ prompt: v.headline + ' ' + v.text, service_slug: wiz.service_slug }),
                                  });
                                  const data = await res.json();
                                  if (res.ok && data.image_url) {
                                    const nv = [...variants]; nv[i] = {...nv[i], image_url: data.image_url}; setVariants(nv);
                                    showToast('✅ Imagen generada');
                                  } else showToast(data.error || 'Error generando imagen');
                                  setGenImgIdx(null);
                                }} className="text-[9px] px-2 py-1 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 font-bold transition-all">
                                  🤖 Generar con IA
                                </button>
                              )}
                              <label className="text-[9px] px-2 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 font-bold transition-all cursor-pointer text-center">
                                📷 Subir
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const r = await fetch(`${API_URL}/upload-url?file_name=${encodeURIComponent(file.name)}&folder=ads`, { headers: h });
                                  const d = await r.json();
                                  if (d.upload_url) {
                                    await fetch(d.upload_url, { method: 'PUT', headers: { 'Content-Type': d.content_type }, body: file });
                                    const nv = [...variants]; nv[i] = {...nv[i], image_url: d.public_url}; setVariants(nv);
                                    showToast('✅ Imagen subida');
                                  }
                                }} />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500">Título</label>
                          <input value={v.headline} onChange={e => { const nv = [...variants]; nv[i] = {...nv[i], headline: e.target.value}; setVariants(nv); }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 text-white" />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500">Texto principal</label>
                          <textarea value={v.text} onChange={e => { const nv = [...variants]; nv[i] = {...nv[i], text: e.target.value}; setVariants(nv); }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 text-white resize-none h-16" />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500">Descripción</label>
                          <input value={v.description} onChange={e => { const nv = [...variants]; nv[i] = {...nv[i], description: e.target.value}; setVariants(nv); }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/[0.02] rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-gray-400">📋 Resumen: {variants.length} anuncios • ${parseInt(wiz.budget_daily || '0').toLocaleString()}/día • {wiz.duration === '0' ? 'Indefinida' : `${wiz.duration} días`} • {wiz.radius === '0' ? 'Todo el país' : `${wiz.city || wiz.country} (${wiz.radius} km)`}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(4)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  <button onClick={handlePublish} disabled={publishing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
                    {publishing ? '⏳ Publicando (~10s)...' : '🚀 Publicar campaña'}
                  </button>
                </div>
                <p className="text-[9px] text-gray-600 text-center mt-2">Se crea pausada. Actívala cuando estés listo.</p>
              </div>
            )}
          </div>
        </div>
      )}
    {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-2xl max-h-[80vh] mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImg(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg z-10 transition-all">✕</button>
            <img src={previewImg} className="max-w-full max-h-[80vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}