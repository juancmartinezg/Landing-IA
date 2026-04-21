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
  const [variants, setVariants] = useState<any[]>(() => {
    if (typeof window !== 'undefined') { try { return JSON.parse(localStorage.getItem('ads_wiz_variants') || '[]'); } catch { return []; } } return [];
  });
  const [syncForm, setSyncForm] = useState({ name: '', segment: 'all' });
  const [syncing, setSyncing] = useState(false);
  const [wizStep, setWizStep] = useState(() => {
    if (typeof window !== 'undefined') { try { return parseInt(localStorage.getItem('ads_wiz_step') || '1'); } catch { return 1; } } return 1;
  });
  const [wiz, setWiz] = useState(() => {
    const def = { service_slug: '', country: 'CO', city: '', location: '', radius: '10', budget_daily: '15000', duration: '7', ad_account_id: '', page_id: '', page_name: '', instagram_id: '', age_min: '18', age_max: '65', gender: 'all', cities: [] as any[], interests: [] as any[] };
    if (typeof window !== 'undefined') { try { return {...def, ...JSON.parse(localStorage.getItem('ads_wiz_data') || '{}')}; } catch { return def; } } return def;
  });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [igAccounts, setIgAccounts] = useState<any[]>([]);
  const [campFilter, setCampFilter] = useState('all');
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [genImgIdx, setGenImgIdx] = useState<number | null>(null);
  const [businessType, setBusinessType] = useState('servicios');
  const [dashboard, setDashboard] = useState<any>(null);
  const [period, setPeriod] = useState('last_30d');
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [interestSearch, setInterestSearch] = useState('');
  const [interestResults, setInterestResults] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [searchingInterest, setSearchingInterest] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const h = { 'client-id': user?.companyId || '' };
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ads/dashboard?period=last_30d`, { headers: h }).then(r => r.json()).catch(() => ({ global: {}, campaigns: [], alerts: [] })),
      fetch(`${API_URL}/ads/audiences`, { headers: h }).then(r => r.json()).catch(() => ({ audiences: [] })),
      fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).catch(() => ({ services: [] })),
      fetch(`${API_URL}/ads/accounts`, { headers: h }).then(r => r.json()).catch(() => ({ accounts: [] })),
      fetch(`${API_URL}/ads/pages`, { headers: h }).then(r => r.json()).catch(() => ({ pages: [] })),
    ]).then(([dash, a, s, ac, pg]) => {
      setDashboard(dash); setMetrics(dash.global || {}); setCampaigns(dash.campaigns || []); setAudiences(a.audiences || []); setServices(s.services || []);
      const accs = ac.accounts || [];
      setAccounts(accs);
      setPages(pg.pages || []);
      const selAcc = accs.find((x: any) => x.selected);
      if (selAcc) setWiz((prev: any) => ({...prev, ad_account_id: selAcc.id}));
      const selPage = (pg.pages || []).find((x: any) => x.selected);
      if (selPage) setWiz((prev: any) => ({...prev, page_id: selPage.id, page_name: selPage.name}));
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
        body: JSON.stringify({ name: campName, objective: 'OUTCOME_LEADS', budget_daily: budgetDaily, variants, country: wiz.country, city: wiz.city, radius: wiz.radius, duration: wiz.duration, service_slug: wiz.service_slug, age_min: parseInt(wiz.age_min || '18'), age_max: parseInt(wiz.age_max || '65'), gender: wiz.gender, cities: wiz.cities, interests: wiz.interests })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✅ ¡Campaña publicada!'); setTab('campaigns'); setWizStep(1); setVariants([]);
        localStorage.removeItem('ads_wiz_step'); localStorage.removeItem('ads_wiz_data'); localStorage.removeItem('ads_wiz_variants');
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
  const reloadDashboard = (p?: string) => {
    const pr = p || period;
    fetch(`${API_URL}/ads/dashboard?period=${pr}`, { headers: h }).then(r => r.json()).then(d => {
      setDashboard(d); setMetrics(d.global || {}); setCampaigns(d.campaigns || []);
    }).catch(() => {});
  };
  const handleAnalyze = async (campaignId: string) => {
    setAnalyzing(campaignId); setAnalysis(null);
    try {
      const res = await fetch(`${API_URL}/ads/analyze`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign_id: campaignId }) });
      const data = await res.json();
      setAnalysis(data);
    } catch { showToast('Error analizando'); }
    setAnalyzing(null);
  };
  const handleApplyAction = async (action: string, targetId: string) => {
    const res = await fetch(`${API_URL}/ads/apply-action`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ action, target_id: targetId }) });
    const data = await res.json();
    if (res.ok) { showToast(`✓ ${data.message}`); reloadDashboard(); } else showToast(data.error || 'Error');
  };
  const searchCity = async (q: string) => {
    setCitySearch(q);
    if (q.length < 2) { setCityResults([]); return; }
    setSearchingCity(true);
    try {
      const res = await fetch(`${API_URL}/ads/search-targeting?q=${encodeURIComponent(q)}&type=city`, { headers: h });
      const data = await res.json();
      setCityResults(data.results || []);
    } catch {} 
    setSearchingCity(false);
  };
  const searchInterest = async (q: string) => {
    setInterestSearch(q);
    if (q.length < 2) { setInterestResults([]); return; }
    setSearchingInterest(true);
    try {
      const res = await fetch(`${API_URL}/ads/search-targeting?q=${encodeURIComponent(q)}&type=interest`, { headers: h });
      const data = await res.json();
      setInterestResults(data.results || []);
    } catch {}
    setSearchingInterest(false);
  };
  const addCity = (city: any) => {
    if (!wiz.cities.find((c: any) => c.key === city.key)) {
      setWiz((prev: any) => ({...prev, cities: [...prev.cities, city]}));
    }
    setCitySearch(''); setCityResults([]);
  };
  const removeCity = (key: string) => {
    setWiz((prev: any) => ({...prev, cities: prev.cities.filter((c: any) => c.key !== key)}));
  };
  const addInterest = (interest: any) => {
    if (!wiz.interests.find((i: any) => i.id === interest.id)) {
      setWiz((prev: any) => ({...prev, interests: [...prev.interests, interest]}));
    }
    setInterestSearch(''); setInterestResults([]);
  };
  const removeInterest = (id: string) => {
    setWiz((prev: any) => ({...prev, interests: prev.interests.filter((i: any) => i.id !== id)}));
  };  
  useEffect(() => {
    localStorage.setItem('ads_wiz_step', String(wizStep));
    localStorage.setItem('ads_wiz_data', JSON.stringify(wiz));
  }, [wizStep, wiz]);
  useEffect(() => {
    if (variants.length) localStorage.setItem('ads_wiz_variants', JSON.stringify(variants));
  }, [variants]);
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
              <div className="flex gap-2 mb-4">
                {[{id:'today',l:'Hoy'},{id:'last_7d',l:'7 días'},{id:'last_30d',l:'30 días'},{id:'last_90d',l:'90 días'}].map(p => (
                  <button key={p.id} onClick={() => { setPeriod(p.id); reloadDashboard(p.id); }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${period === p.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {p.l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Invertido</p>
                  <p className="text-xl font-bold text-white">${(metrics?.spend || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Alcance</p>
                  <p className="text-xl font-bold text-indigo-400">{(metrics?.reach || metrics?.impressions || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Te escribieron</p>
                  <p className="text-xl font-bold text-emerald-400">{metrics?.leads || 0}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Costo / lead</p>
                  <p className="text-xl font-bold text-purple-400">${(metrics?.cpl || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">ROI</p>
                  <p className="text-xl font-bold text-yellow-400">{metrics?.roas || 0}x</p>
                  {(metrics?.sales || 0) > 0 && <p className="text-[8px] text-gray-500">{metrics.sales} ventas</p>}
                </div>
              </div>
              {(dashboard?.alerts || []).length > 0 && (
                <div className="space-y-2 mb-6">
                  {dashboard.alerts.map((a: any, i: number) => (
                    <div key={i} className={`rounded-xl p-3 border ${a.severity === 'danger' ? 'bg-red-500/5 border-red-500/20' : a.severity === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                      <p className={`text-xs font-bold ${a.severity === 'danger' ? 'text-red-400' : a.severity === 'success' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {a.severity === 'danger' ? '🔴' : a.severity === 'success' ? '🟢' : '🟡'} {a.campaign}: {a.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="font-bold mb-3">Rendimiento por campaña</h3>
              <div className="space-y-2">
                {campaigns.filter((c: any) => c.metrics?.spend > 0 || c.status === 'ACTIVE').map((c: any, i: number) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${c.rendimiento === 'alto' ? 'bg-emerald-500' : c.rendimiento === 'medio' ? 'bg-yellow-500' : c.rendimiento === 'bajo' ? 'bg-red-500' : 'bg-gray-500'}`} />
                          <p className="font-bold text-sm truncate">{c.name}</p>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${c.status_human === 'activa' ? 'bg-emerald-500/20 text-emerald-400' : c.status_human === 'pausada' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.status_human}</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-400">
                          <span>${(c.metrics?.spend || 0).toLocaleString()}</span>
                          <span>{c.metrics?.leads || 0} leads</span>
                          <span>CPL ${(c.metrics?.cpl || 0).toLocaleString()}</span>
                          <span>CTR {c.metrics?.ctr || 0}%</span>
                          {c.metrics?.frequency > 0 && <span>Freq {c.metrics.frequency}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => handleAnalyze(c.campaign_id)} disabled={analyzing === c.campaign_id}
                          className="text-[9px] px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-bold transition-all disabled:opacity-50">
                          {analyzing === c.campaign_id ? '⏳...' : '🔍 Analizar'}
                        </button>
                        <button onClick={() => handleApplyAction(c.status === 'ACTIVE' ? 'pausar' : 'activar', c.campaign_id)}
                          className={`text-[9px] px-2 py-1 rounded-lg font-bold transition-all ${c.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {c.status === 'ACTIVE' ? '⏸' : '▶'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {analysis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAnalysis(null)}>
                  <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={(e: any) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">🔍 Análisis de campaña</h3>
                      <button onClick={() => setAnalysis(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                        <p className="text-[8px] text-gray-500">Gasto</p>
                        <p className="text-sm font-bold">${(analysis.metrics?.spend || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                        <p className="text-[8px] text-gray-500">Leads</p>
                        <p className="text-sm font-bold text-emerald-400">{analysis.metrics?.leads || 0}</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                        <p className="text-[8px] text-gray-500">CPL</p>
                        <p className="text-sm font-bold text-purple-400">${(analysis.metrics?.cpl || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {analysis.funnel_diagnosis && (
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3 mb-4">
                        <p className="text-[10px] text-indigo-400 font-bold mb-1">📊 Diagnóstico</p>
                        <p className="text-xs text-gray-300">{analysis.funnel_diagnosis}</p>
                      </div>
                    )}
                    {analysis.ai_insight && (
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-4">
                        <p className="text-[10px] text-purple-400 font-bold mb-1">🤖 Insight IA</p>
                        <p className="text-xs text-gray-300">{analysis.ai_insight}</p>
                      </div>
                    )}
                    {(analysis.recommendations || []).length > 0 && (
                      <div className="mb-4">
                        <p className="text-[10px] text-gray-400 font-bold mb-2">💡 Recomendaciones</p>
                        {analysis.recommendations.map((r: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3 mb-2">
                            <div className="flex-1">
                              <p className="text-xs text-white mb-1">{r.reason}</p>
                              <p className="text-[8px] text-gray-500">Confianza: {r.confidence}</p>
                            </div>
                            {r.target_id && (
                              <button onClick={() => { handleApplyAction(r.action, r.target_id); setAnalysis(null); }}
                                className="text-[9px] px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold ml-2 shrink-0">
                                ✅ Aplicar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {(analysis.ads || []).length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-2">📋 Anuncios</p>
                        {analysis.ads.map((a: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-[10px] py-1 border-b border-white/5">
                            <span className="text-gray-300 truncate flex-1">{a.name}</span>
                            <span className="text-gray-400 mx-2">${(a.spend || 0).toLocaleString()}</span>
                            <span className="text-emerald-400">{a.leads} leads</span>
                            <span className="text-gray-500 ml-2">CTR {a.ctr}%</span>
                          </div>
                        ))}
                        {analysis.best_ad && <p className="text-[9px] text-emerald-400 mt-2">🏆 Mejor: {analysis.best_ad}</p>}
                        {analysis.worst_ad && <p className="text-[9px] text-red-400">💀 Peor: {analysis.worst_ad}</p>}
                      </div>
                    )}
                  </div>
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
                  {f.l} ({f.id === 'all' ? campaigns.length : campaigns.filter((c: any) => c.status === f.id).length})
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {campaigns.filter((c: any) => campFilter === 'all' || c.status === campFilter).map((c: any, i: number) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{c.name}</p>
                      <div className="flex gap-3 text-[10px] text-gray-500 mt-1">
                        <span>{c.ad_count || c.ad_ids?.length || 0} anuncios</span>
                        {c.budget_daily > 0 && <span>${c.budget_daily.toLocaleString()}/día</span>}
                        {c.metrics?.leads > 0 && <span className="text-emerald-400">{c.metrics.leads} leads</span>}
                        {c.metrics?.spend > 0 && <span>${(c.metrics.spend || 0).toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${c.rendimiento === 'alto' ? 'bg-emerald-500/20 text-emerald-400' : c.rendimiento === 'medio' ? 'bg-yellow-500/20 text-yellow-400' : c.rendimiento === 'bajo' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {c.rendimiento === 'alto' ? '🟢 Alto' : c.rendimiento === 'medio' ? '🟡 Medio' : c.rendimiento === 'bajo' ? '🔴 Bajo' : '⚪ Sin datos'}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${c.status_human === 'activa' ? 'bg-emerald-500/20 text-emerald-400' : c.status_human === 'pausada' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.status_human || c.status}</span>
                      <button onClick={() => handleApplyAction(c.status === 'ACTIVE' ? 'pausar' : 'activar', c.campaign_id)}
                        className={`text-[9px] px-2 py-1 rounded-lg font-bold transition-all ${c.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {c.status === 'ACTIVE' ? '⏸ Pausar' : '▶ Activar'}
                      </button>
                      <button onClick={() => handleAnalyze(c.campaign_id)}
                        className="text-[9px] px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-bold transition-all">
                        🔍
                      </button>
                    </div>
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
                <h3 className="font-bold text-lg mb-2">¿A quién quieres llegar?</h3>
                <p className="text-xs text-gray-400 mb-4">La IA optimizará automáticamente. Ajusta si quieres.</p>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">País</label>
                    <select value={wiz.country} onChange={e => setWiz({...wiz, country: e.target.value})}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                      {[['CO','🇨🇴 Colombia'],['MX','🇲🇽 México'],['AR','🇦🇷 Argentina'],['CL','🇨🇱 Chile'],['PE','🇵🇪 Perú'],['EC','🇪🇨 Ecuador'],['US','🇺🇸 Estados Unidos'],['ES','🇪🇸 España'],['BR','🇧🇷 Brasil'],['PA','🇵🇦 Panamá']].map(([v,l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Ciudades</label>
                    <input value={citySearch} onChange={e => searchCity(e.target.value)} placeholder="Buscar ciudad..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                    {searchingCity && <p className="text-[8px] text-gray-500 mt-1">Buscando...</p>}
                    {cityResults.length > 0 && (
                      <div className="mt-1 max-h-32 overflow-y-auto bg-[#1a1f2e] border border-white/10 rounded-xl">
                        {cityResults.map((c: any, i: number) => (
                          <button key={i} onClick={() => addCity(c)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-all border-b border-white/5">
                            {c.name} <span className="text-gray-500">({c.region}, {c.country_name})</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {wiz.cities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {wiz.cities.map((c: any, i: number) => (
                          <span key={i} className="text-[9px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
                            {c.name} <button onClick={() => removeCity(c.key)} className="text-red-400 hover:text-red-300">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                    {wiz.cities.length === 0 && <p className="text-[8px] text-gray-600 mt-1">Sin ciudades = todo el país</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Edad mínima</label>
                      <input type="number" value={wiz.age_min} onChange={e => setWiz({...wiz, age_min: e.target.value})} min="13" max="65"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Edad máxima</label>
                      <input type="number" value={wiz.age_max} onChange={e => setWiz({...wiz, age_max: e.target.value})} min="13" max="65"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Género</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{id:'all',l:'👥 Todos'},{id:'male',l:'👨 Hombres'},{id:'female',l:'👩 Mujeres'}].map(g => (
                        <button key={g.id} onClick={() => setWiz({...wiz, gender: g.id})}
                          className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${wiz.gender === g.id ? 'border-indigo-500 bg-indigo-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                          {g.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Intereses (opcional)</label>
                    <input value={interestSearch} onChange={e => searchInterest(e.target.value)} placeholder="Buscar interés... (ej: fitness, cocina, armas)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                    {searchingInterest && <p className="text-[8px] text-gray-500 mt-1">Buscando...</p>}
                    {interestResults.length > 0 && (
                      <div className="mt-1 max-h-32 overflow-y-auto bg-[#1a1f2e] border border-white/10 rounded-xl">
                        {interestResults.map((int: any, i: number) => (
                          <button key={i} onClick={() => addInterest(int)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-all border-b border-white/5">
                            {int.name} {int.audience_size > 0 && <span className="text-gray-500">({(int.audience_size || 0).toLocaleString()} personas)</span>}
                          </button>
                        ))}
                      </div>
                    )}
                    {wiz.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {wiz.interests.map((int: any, i: number) => (
                          <span key={i} className="text-[9px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 flex items-center gap-1">
                            {int.name} <button onClick={() => removeInterest(int.id)} className="text-red-400 hover:text-red-300">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[8px] text-gray-600 mt-1">Sin intereses = la IA de Meta decide (Advantage+)</p>
                  </div>
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
                          if (res.ok) { showToast(`✓ ${data.message}`); const ac = await fetch(`${API_URL}/ads/accounts`, { headers: h }).then(r => r.json()); setAccounts(ac.accounts || []); if (ac.accounts?.length) setWiz((prev: any) => ({...prev, ad_account_id: ac.accounts[0].id})); }
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
                  {creating ? (
                    <div className="flex-1 py-3 rounded-xl bg-indigo-600/30 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{width: '70%'}} />
                        </div>
                        <span className="text-[9px] text-indigo-400">Generando...</span>
                      </div>
                      <p className="text-[8px] text-gray-500 text-center">La IA está creando tus anuncios...</p>
                    </div>
                  ) : (
                    <button onClick={handleGenerate} disabled={!wiz.ad_account_id || !wiz.page_id}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold disabled:opacity-30 transition-all">
                      ✨ Generar anuncios
                    </button>
                  )}
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
                        <div className="flex gap-1">
                          <button onClick={async () => {
                            showToast('⏳ Regenerando copy...');
                            const res = await fetch(`${API_URL}/ads/campaigns/generate`, {
                              method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ service_slug: wiz.service_slug, budget_daily: parseInt(wiz.budget_daily || '15000') }),
                            });
                            const data = await res.json();
                            if (data.variants?.length) {
                              const nv = [...variants]; nv[i] = {...nv[i], headline: data.variants[0].headline, text: data.variants[0].text, description: data.variants[0].description};
                              setVariants(nv); showToast('✅ Copy regenerado');
                            } else showToast('Error regenerando');
                          }} className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all" title="Regenerar texto">
                            🔄 Rehacer Copy
                          </button>
                          {variants.length > 1 && (
                            <button onClick={() => { setVariants((prev: any[]) => prev.filter((_, idx) => idx !== i)); showToast('Variante descartada'); }}
                              className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Descartar variante">
                              🗑️
                            </button>
                          )}
                        </div>
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
                <button onClick={async () => {
                  showToast('⏳ Generando variante adicional...');
                  const res = await fetch(`${API_URL}/ads/campaigns/generate`, {
                    method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ service_slug: wiz.service_slug, budget_daily: parseInt(wiz.budget_daily || '15000') }),
                  });
                  const data = await res.json();
                  if (data.variants?.length) {
                    const svcImg = data.service_image || '';
                    const newV = {...data.variants[0], image_url: data.variants[0].image_url || svcImg || variants[0]?.image_url || ''};
                    setVariants((prev: any[]) => [...prev, newV]);
                    showToast('✅ Variante agregada');
                  } else showToast('Error generando');
                }} className="w-full py-2 rounded-xl border border-dashed border-white/10 text-xs text-gray-400 hover:bg-white/[0.03] hover:text-white transition-all mb-4">
                  + Agregar variante
                </button>
                <div className="bg-white/[0.02] rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-gray-400">📋 {variants.length} anuncios • ${parseInt(wiz.budget_daily || '0').toLocaleString()}/día • {wiz.duration === '0' ? 'Indefinida' : `${wiz.duration} días`} • {wiz.cities?.length > 0 ? wiz.cities.map((c: any) => c.name).join(', ') : wiz.country} • {wiz.age_min}-{wiz.age_max} años • {wiz.gender === 'all' ? 'Todos' : wiz.gender === 'male' ? 'Hombres' : 'Mujeres'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWizStep(4)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">← Atrás</button>
                  {publishing ? (
                    <div className="flex-1 py-3 rounded-xl bg-emerald-600/30 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{width: '60%'}} />
                        </div>
                        <span className="text-[9px] text-emerald-400">Publicando...</span>
                      </div>
                      <p className="text-[8px] text-gray-500 text-center">Creando campaña en Meta (~10s)</p>
                    </div>
                  ) : (
                    <button onClick={handlePublish}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold transition-all">
                      🚀 Publicar campaña
                    </button>
                  )}
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