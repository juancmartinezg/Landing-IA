'use client';
import { useState, useMemo } from 'react';
import { useDemo } from '../DemoDataProvider';
const REC_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  SCALE: { bg: 'from-emerald-500/10 to-emerald-500/0', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  REFRESH_CREATIVE: { bg: 'from-sky-500/10 to-sky-500/0', border: 'border-sky-500/30', text: 'text-sky-400' },
  AB_TEST: { bg: 'from-purple-500/10 to-purple-500/0', border: 'border-purple-500/30', text: 'text-purple-400' },
  PAUSE: { bg: 'from-red-500/10 to-red-500/0', border: 'border-red-500/30', text: 'text-red-400' },
  REDUCE: { bg: 'from-amber-500/10 to-amber-500/0', border: 'border-amber-500/30', text: 'text-amber-400' },
};
const HOOK_VARIANTS_MOCK = [
  {
    pattern: 'escasez',
    hook: '¿Sabías que el 80% de las unidades del piso 12 ya se vendieron?',
    angle: 'Crear urgencia mostrando datos reales de inventario que se agota.',
  },
  {
    pattern: 'curiosidad',
    hook: 'Hay un detalle de los apartamentos Aurora que NADIE está comentando',
    angle: 'Generar intriga sobre características no obvias del proyecto.',
  },
  {
    pattern: 'prueba_social',
    hook: '12 familias ya firmaron este mes en Aurora Park. ¿Y la tuya?',
    angle: 'Validación social con número concreto + pregunta cerrada.',
  },
];
export default function DemoAdsPage() {
  const { adsCampaigns, adsRecommendations } = useDemo();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'recommendations' | 'creative_loop' | 'library'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showVariantsModal, setShowVariantsModal] = useState<string | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variants, setVariants] = useState<typeof HOOK_VARIANTS_MOCK>([]);
  const totals = useMemo(() => {
    const spend = adsCampaigns.reduce((s, c) => s + c.spend_total, 0);
    const leads = adsCampaigns.reduce((s, c) => s + c.leads, 0);
    const sales = adsCampaigns.reduce((s, c) => s + c.sales, 0);
    const revenue = adsCampaigns.reduce((s, c) => s + c.revenue, 0);
    return { spend, leads, sales, revenue, cpl: leads > 0 ? spend / leads : 0, roas: spend > 0 ? (revenue / spend) * 100 : 0 };
  }, [adsCampaigns]);
  const allCreatives = useMemo(() => {
    return adsCampaigns.flatMap(c =>
      c.creatives.map(cr => ({ ...cr, campaign_name: c.name, campaign_id: c.id }))
    ).sort((a, b) => b.ctr - a.ctr);
  }, [adsCampaigns]);
  const handleGenerateVariants = (adId: string) => {
    setShowVariantsModal(adId);
    setLoadingVariants(true);
    setVariants([]);
    // Simular llamada a Gemini
    setTimeout(() => {
      setVariants(HOOK_VARIANTS_MOCK);
      setLoadingVariants(false);
    }, 1800);
  };
  const selectedCmp = adsCampaigns.find(c => c.id === selectedCampaign);
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">🚀 Anuncios IA</h1>
          <p className="text-gray-400 text-sm">
            La IA crea, optimiza y mejora tus campañas todos los días — sin que toques Ads Manager
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20">
            ✨ Crear con IA Premium
          </button>
          <button className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
            🧬 ADN de marca
          </button>
        </div>
      </div>
      {/* KPI globales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Inversión</p>
          <p className="text-xl font-black text-purple-400">${totals.spend.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Leads</p>
          <p className="text-xl font-black text-emerald-400">{totals.leads}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">CPL promedio</p>
          <p className="text-xl font-black text-yellow-400">${totals.cpl.toFixed(0)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Ventas</p>
          <p className="text-xl font-black text-emerald-400">{totals.sales}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/30 rounded-xl p-3">
          <p className="text-[9px] text-purple-400 uppercase tracking-widest font-bold">ROAS</p>
          <p className="text-xl font-black text-emerald-400">{Math.round(totals.roas)}%</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-white/5 overflow-x-auto pb-px">
        {[
          { key: 'campaigns', label: '📊 Campañas', count: adsCampaigns.length },
          { key: 'recommendations', label: '🎯 IA Recomienda', count: adsRecommendations.length, hot: true },
          { key: 'creative_loop', label: '🧠 AI Creative Loop', count: null },
          { key: 'library', label: '📚 Biblioteca ganadores', count: 8 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.key
                ? 'text-white border-indigo-500'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${
                tab.hot ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'
              } font-black`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* TAB: Campañas */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {adsCampaigns.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCampaign(c.id)}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-3xl shrink-0">{c.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-500">Click-to-WhatsApp · ${c.budget_daily}/día</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />ACTIVA
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                  <p className="text-[8px] text-gray-500 uppercase">Alcance</p>
                  <p className="text-xs font-black text-white">{(c.impressions / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                  <p className="text-[8px] text-gray-500 uppercase">CTR</p>
                  <p className="text-xs font-black text-sky-400">{c.ctr}%</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                  <p className="text-[8px] text-gray-500 uppercase">Leads</p>
                  <p className="text-xs font-black text-emerald-400">{c.leads}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                  <p className="text-[8px] text-gray-500 uppercase">CPL</p>
                  <p className="text-xs font-black text-yellow-400">${c.cpl.toFixed(0)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 text-center">
                  <p className="text-[8px] text-emerald-500 uppercase font-bold">Ventas</p>
                  <p className="text-sm font-black text-emerald-400">{c.sales}</p>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-2 text-center">
                  <p className="text-[8px] text-purple-500 uppercase font-bold">Revenue</p>
                  <p className="text-sm font-black text-purple-400">${(c.revenue / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2 text-center">
                  <p className="text-[8px] text-yellow-500 uppercase font-bold">ROAS</p>
                  <p className="text-sm font-black text-yellow-400">{Math.round(c.revenue / c.spend_total)}x</p>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-[10px] text-gray-400 line-clamp-2 italic">"{c.primary_text}"</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.cities.map((city) => (
                    <span key={city} className="text-[8px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                      📍 {city}
                    </span>
                  ))}
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300">
                    👥 {c.age_min}-{c.age_max}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* TAB: Recomendaciones IA */}
      {activeTab === 'recommendations' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">🧠</span>
              <div className="flex-1">
                <p className="text-sm font-black mb-1">La IA analizó tus campañas hace 3 horas</p>
                <p className="text-[11px] text-gray-400">
                  Cada día a las 6 AM la IA revisa CPL, CTR, ROAS y comportamiento de tus creativos.
                  Estas son las acciones que sugiere para hoy. <span className="text-indigo-400 font-bold">Tú decides aplicar o no.</span>
                </p>
              </div>
            </div>
          </div>
          {adsRecommendations.map((rec) => {
            const colors = REC_COLORS[rec.type] || REC_COLORS.SCALE;
            const campaign = adsCampaigns.find(c => c.id === rec.campaign_id);
            return (
              <div
                key={rec.id}
                className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-5`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0">{rec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>{rec.type.replace('_', ' ')}</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold">
                        Confianza {rec.confidence}%
                      </span>
                      {campaign && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold truncate max-w-[200px]">
                          {campaign.image} {campaign.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-white mb-1">{rec.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">{rec.desc}</p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className={`text-xs font-black ${colors.text}`}>
                        Impacto esperado: {rec.impact_estimate}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-[11px] px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-lg transition-all">
                          Descartar
                        </button>
                        <button className={`text-[11px] px-4 py-1.5 bg-white text-[#0B0F1A] hover:bg-gray-100 font-black rounded-lg transition-all`}>
                          ✓ Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* TAB: AI Creative Loop */}
      {activeTab === 'creative_loop' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">🔁</span>
              <div className="flex-1">
                <p className="text-sm font-black mb-1">Tu anuncio mejor cada semana, sin que toques nada</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  La IA detecta tus creativos ganadores, genera variantes con patrones emocionales distintos,
                  publica las mejores y aprende de los resultados. <span className="text-purple-400 font-bold">5 motores trabajando en piloto automático.</span>
                </p>
                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  {['📥 Ingestión', '🔬 Análisis', '✨ Generación', '🚀 Publicación', '📊 Aprendizaje'].map((step, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center">
                      <p className="text-[9px] font-bold text-purple-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">🏆 Ranking de creativos · 7 últimos días</p>
              <span className="text-[10px] text-gray-500">Top {allCreatives.length} por CTR</span>
            </div>
            <div className="space-y-2">
              {allCreatives.map((cr, idx) => {
                const isLoser = cr.ctr < 2.0 && cr.impressions > 14000;
                const isWinner = idx === 0;
                return (
                  <div
                    key={cr.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isWinner
                        ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/0 border-yellow-500/30'
                        : isLoser
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shrink-0 ${
                      isWinner ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400'
                    }`}>
                      {isWinner ? '🏆' : `#${idx + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-xs font-bold truncate">{cr.name}</p>
                        {isWinner && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">GANADOR</span>
                        )}
                        {isLoser && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
                            ⚠️ AUTO-PAUSAR
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{cr.campaign_name}</p>
                    </div>
                    <div className="hidden md:flex gap-3 text-center shrink-0">
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase">CTR</p>
                        <p className={`text-sm font-black ${isWinner ? 'text-yellow-400' : isLoser ? 'text-red-400' : 'text-sky-400'}`}>{cr.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase">CPL</p>
                        <p className="text-sm font-black text-emerald-400">${cr.cpl}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase">Impr.</p>
                        <p className="text-sm font-black text-white">{(cr.impressions / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                    {isWinner && (
                      <button
                        onClick={() => handleGenerateVariants(cr.id)}
                        className="text-[10px] px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-lg whitespace-nowrap shrink-0 shadow-lg shadow-purple-600/20"
                      >
                        ✨ Variantes IA
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Cross-tenant learning */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🌍</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black">Inteligencia colectiva del sector</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">ACTIVA</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  Tu IA aprende de patrones anonimizados de los anuncios ganadores de tu vertical (Bienes Raíces).
                  Tu rendimiento mejora con el del ecosistema. <span className="text-emerald-400">Nada de tu negocio se identifica.</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                    <p className="text-[9px] text-gray-500 uppercase">Patrones aprendidos</p>
                    <p className="text-lg font-black text-emerald-400">147</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                    <p className="text-[9px] text-gray-500 uppercase">Mejora CTR esperada</p>
                    <p className="text-lg font-black text-indigo-400">+34%</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                    <p className="text-[9px] text-gray-500 uppercase">Negocios en tu sector</p>
                    <p className="text-lg font-black text-purple-400">2,840</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TAB: Biblioteca ganadores */}
      {activeTab === 'library' && (
        <div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">📚</span>
              <div className="flex-1">
                <p className="text-sm font-black mb-1">Tus mejores anuncios — guardados para siempre</p>
                <p className="text-[11px] text-gray-400">
                  Cada vez que un anuncio supera al promedio del top 20%, se guarda aquí.
                  Puedes regenerar variantes de cualquiera con 1 clic.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'w1', pattern: 'escasez', hook: 'Solo quedan 8 unidades del piso 12', ctr: 4.99, cpl: 38, age_days: 32, sales_attributed: 6 },
              { id: 'w2', pattern: 'prueba_social', hook: '12 familias ya firmaron este mes', ctr: 4.21, cpl: 45, age_days: 18, sales_attributed: 4 },
              { id: 'w3', pattern: 'beneficio', hook: 'Tu hogar de ensueño con financiación a 20 años', ctr: 3.82, cpl: 52, age_days: 45, sales_attributed: 8 },
              { id: 'w4', pattern: 'curiosidad', hook: '¿Por qué los inversionistas eligen Miami antes que NY?', ctr: 3.71, cpl: 48, age_days: 28, sales_attributed: 3 },
              { id: 'w5', pattern: 'dolor', hook: 'Sigues pagando arriendo en lugar de construir patrimonio', ctr: 3.55, cpl: 56, age_days: 12, sales_attributed: 2 },
              { id: 'w6', pattern: 'escasez', hook: 'Última oportunidad de entrar al precio fase 1', ctr: 3.44, cpl: 58, age_days: 67, sales_attributed: 5 },
              { id: 'w7', pattern: 'beneficio', hook: 'ROI 12% anual en Miami sin moverte de Colombia', ctr: 3.22, cpl: 62, age_days: 21, sales_attributed: 3 },
              { id: 'w8', pattern: 'prueba_social', hook: 'Aurora Park ya tiene lista de espera VIP', ctr: 3.18, cpl: 64, age_days: 9, sales_attributed: 1 },
            ].map((w) => (
              <div key={w.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-yellow-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold uppercase">
                    {w.pattern}
                  </span>
                  <span className="text-[9px] text-gray-500">hace {w.age_days}d</span>
                </div>
                <p className="text-sm font-bold text-white mb-3 line-clamp-2 min-h-[40px]">"{w.hook}"</p>
                <div className="grid grid-cols-3 gap-1 mb-3">
                  <div className="bg-white/[0.02] rounded-md p-1.5 text-center">
                    <p className="text-[8px] text-gray-500 uppercase">CTR</p>
                    <p className="text-xs font-black text-yellow-400">{w.ctr}%</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-md p-1.5 text-center">
                    <p className="text-[8px] text-gray-500 uppercase">CPL</p>
                    <p className="text-xs font-black text-emerald-400">${w.cpl}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-md p-1.5 text-center">
                    <p className="text-[8px] text-gray-500 uppercase">Ventas</p>
                    <p className="text-xs font-black text-purple-400">{w.sales_attributed}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateVariants(w.id)}
                  className="w-full text-[10px] py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-lg transition-all"
                >
                  ✨ Generar variantes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Modal detalle de campaña */}
      {selectedCmp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            className="bg-[#0B0F1A] border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCmp.image}</span>
                <div>
                  <p className="text-lg font-black">{selectedCmp.name}</p>
                  <p className="text-xs text-gray-500">Vista previa del anuncio</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-500 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Texto principal</p>
              <p className="text-sm text-white mb-3 leading-relaxed">{selectedCmp.primary_text}</p>
              <div className="border-t border-white/5 pt-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Título</p>
                <p className="text-base font-bold text-white">{selectedCmp.headline}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">🎯 Segmentación</p>
                <p className="text-xs text-gray-300">Edad: {selectedCmp.age_min}-{selectedCmp.age_max} años</p>
                <p className="text-xs text-gray-300 mt-1">Ciudades: {selectedCmp.cities.join(', ')}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">💡 Intereses</p>
                <div className="flex gap-1 flex-wrap">
                  {selectedCmp.interests.map(i => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{i}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black mb-1">CTA del anuncio</p>
              <p className="text-base font-black text-white">📱 Enviar mensaje por WhatsApp</p>
            </div>
          </div>
        </div>
      )}
      {/* Modal variantes IA */}
      {showVariantsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => !loadingVariants && setShowVariantsModal(null)}
        >
          <div
            className="bg-[#0B0F1A] border border-purple-500/30 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 sticky top-0 bg-[#0B0F1A] pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <p className="text-base font-black">Variantes generadas por IA</p>
                  <p className="text-xs text-gray-500">3 ángulos emocionales distintos del ganador</p>
                </div>
              </div>
              <button
                onClick={() => setShowVariantsModal(null)}
                disabled={loadingVariants}
                className="text-gray-500 hover:text-white text-2xl disabled:opacity-40"
              >
                ×
              </button>
            </div>
            {loadingVariants ? (
              <div className="py-16 text-center">
                <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-purple-300 font-bold mb-1">Generando 3 variantes con IA...</p>
                <p className="text-[11px] text-gray-500">Analizando patrón emocional del ganador · 1-3 segundos</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {variants.map((v, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-black uppercase">
                          Patrón: {v.pattern}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold">
                          Variante {idx + 1} / 3
                        </span>
                      </div>
                      <div className="bg-[#0B0F1A] border border-white/10 rounded-xl p-3 mb-3">
                        <p className="text-sm text-white font-bold leading-relaxed">"{v.hook}"</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 mb-3">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">🎯 Ángulo</p>
                        <p className="text-[11px] text-gray-300 leading-relaxed">{v.angle}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 text-[10px] py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-all">
                          📋 Copiar texto
                        </button>
                        <button className="flex-1 text-[10px] py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-lg transition-all">
                          🚀 Publicar variante
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3">
                  <p className="text-[10px] text-purple-300 leading-relaxed">
                    💡 <span className="font-black">Tip:</span> Duplica el anuncio ganador en Meta y reemplaza solo el hook con una de las variantes.
                    Mantén la imagen y audiencia para aislar el efecto del nuevo texto. Cada variante puede dar +20% a +50% de CTR.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Footer educativo */}
      <div className="mt-6 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-emerald-500/5 border border-purple-500/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🚀</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">
              La IA optimiza tus anuncios todos los días — sin que muevas un dedo
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mientras duermes, la IA analiza CPL, CTR, ROAS y comportamiento. Pausa perdedores, recomienda escalar ganadores, genera variantes de tus mejores creativos y aprende de patrones globales de tu sector. <span className="text-purple-400 font-bold">Tu inversión rinde 2-5x más sin trabajo extra.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}