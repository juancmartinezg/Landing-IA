'use client';
import { useState, useMemo } from 'react';
import { useDemo } from '../DemoDataProvider';
const PERIODS = [
  { key: '7d', label: 'Hoy', days: 1 },
  { key: '7d2', label: '7 días', days: 7 },
  { key: '30d', label: '30 días', days: 30 },
  { key: '90d', label: '90 días', days: 90 },
];
export default function DemoAnalyticsPage() {
  const { analytics, leads, payments, adsCampaigns, agents } = useDemo();
  const [period, setPeriod] = useState('30d');
  // Métricas derivadas
  const totalRevenue = analytics.total_revenue;
  const avgTicket = analytics.paid_count > 0 ? totalRevenue / analytics.paid_count : 0;
  const conversionRate = analytics.conversion_rate;
  const totalAdsSpend = adsCampaigns.reduce((s, c) => s + c.spend_total, 0);
  const totalAdsRevenue = adsCampaigns.reduce((s, c) => s + c.revenue, 0);
  const roas = totalAdsSpend > 0 ? (totalAdsRevenue / totalAdsSpend) * 100 : 0;
  // Breakdown por fuente (atribución)
  const bySource = useMemo(() => {
    const groups: Record<string, { count: number; revenue: number }> = {};
    leads.filter(l => l.stage === 'cerrado_ganado').forEach(l => {
      if (!groups[l.source]) groups[l.source] = { count: 0, revenue: 0 };
      groups[l.source].count += 1;
      groups[l.source].revenue += l.amount || 0;
    });
    return Object.entries(groups)
      .map(([source, data]) => ({ source, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [leads]);
  // Breakdown por ciudad
  const byCity = useMemo(() => {
    const groups: Record<string, { count: number; revenue: number }> = {};
    leads.filter(l => l.stage === 'cerrado_ganado').forEach(l => {
      if (!groups[l.city]) groups[l.city] = { count: 0, revenue: 0 };
      groups[l.city].count += 1;
      groups[l.city].revenue += l.amount || 0;
    });
    return Object.entries(groups)
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [leads]);
  // Funnel
  const funnel = useMemo(() => {
    const total = leads.length;
    const interested = leads.filter(l => ['interesado', 'negociacion', 'cerrado_ganado'].includes(l.stage)).length;
    const negotiating = leads.filter(l => ['negociacion', 'cerrado_ganado'].includes(l.stage)).length;
    const closed = leads.filter(l => l.stage === 'cerrado_ganado').length;
    return [
      { stage: 'Captados', count: total, pct: 100, color: 'bg-indigo-500' },
      { stage: 'Interesados', count: interested, pct: Math.round((interested / total) * 100), color: 'bg-sky-500' },
      { stage: 'En negociación', count: negotiating, pct: Math.round((negotiating / total) * 100), color: 'bg-amber-500' },
      { stage: 'Cerrado ganado', count: closed, pct: Math.round((closed / total) * 100), color: 'bg-emerald-500' },
    ];
  }, [leads]);
  // Revenue chart (16 puntos)
  const maxRevenue = Math.max(...analytics.revenue_last_30d.map(d => d.value), 1);
  const totalShown = analytics.revenue_last_30d.reduce((s, d) => s + d.value, 0);
  const sourceColors: Record<string, string> = {
    'Facebook Ads': 'bg-blue-500',
    'Instagram Ads': 'bg-pink-500',
    'Referido': 'bg-emerald-500',
    'Web': 'bg-amber-500',
  };
  const sourceIcons: Record<string, string> = {
    'Facebook Ads': '📘',
    'Instagram Ads': '📸',
    'Referido': '🤝',
    'Web': '🌐',
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">📈 Reportes y atribución</h1>
          <p className="text-gray-400 text-sm">
            Sabes exactamente qué canal te dio cada peso · Atribución completa Lead → Venta
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`text-[10px] md:text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  period === p.key ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="text-[10px] md:text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
            📊 Exportar CSV
          </button>
        </div>
      </div>
      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/0 border border-purple-500/20 rounded-2xl p-4">
          <p className="text-[9px] text-purple-400 uppercase tracking-widest font-bold mb-1">💰 Revenue total</p>
          <p className="text-2xl md:text-3xl font-black text-purple-400">${(totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +52% vs mes anterior</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold mb-1">✅ Ventas cerradas</p>
          <p className="text-2xl md:text-3xl font-black text-emerald-400">{analytics.paid_count}</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +40% vs mes anterior</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500/10 to-sky-500/0 border border-sky-500/20 rounded-2xl p-4">
          <p className="text-[9px] text-sky-400 uppercase tracking-widest font-bold mb-1">🎯 Conversión global</p>
          <p className="text-2xl md:text-3xl font-black text-sky-400">{conversionRate}%</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +8% vs benchmark sector</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/20 rounded-2xl p-4">
          <p className="text-[9px] text-yellow-400 uppercase tracking-widest font-bold mb-1">💎 Ticket promedio</p>
          <p className="text-2xl md:text-3xl font-black text-yellow-400">${(avgTicket / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-emerald-400 mt-1">USD por venta</p>
        </div>
      </div>
      {/* Banner atribución */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3 flex-wrap">
          <span className="text-3xl shrink-0">🎯</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black mb-1">Atribución completa Lead → Venta · Match Rate 8/10</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Mientras tus competidores ven solo clics, tú ves <span className="text-indigo-400 font-bold">ventas reales atribuidas</span> a cada anuncio.
              El algoritmo de Meta aprende de tus compras — no de impresiones — y reduce tu CPL 30-50%.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-white/[0.03] rounded-lg p-2.5">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">ROAS global</p>
                <p className="text-lg font-black text-emerald-400">{Math.round(roas)}%</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2.5">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Inversión Ads</p>
                <p className="text-lg font-black text-purple-400">${totalAdsSpend.toLocaleString()}</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2.5">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Revenue Ads</p>
                <p className="text-lg font-black text-emerald-400">${(totalAdsRevenue / 1000000).toFixed(2)}M</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2.5">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Datos enviados</p>
                <p className="text-lg font-black text-sky-400">{analytics.paid_count}/event</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Gráfica revenue + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">💰 Revenue · últimos 30 días</p>
            <p className="text-sm font-black text-purple-400">${(totalShown / 1000).toFixed(0)}k USD</p>
          </div>
          <div className="flex items-end gap-1.5 h-48 mb-2">
            {analytics.revenue_last_30d.map((d, i) => {
              const height = (d.value / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all bg-[#1a1f2e] border border-white/10 rounded-md px-2 py-1 text-[9px] text-white font-bold whitespace-nowrap z-10">
                    ${(d.value / 1000).toFixed(0)}k
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      d.value === maxRevenue
                        ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                        : d.value > 0
                        ? 'bg-gradient-to-t from-indigo-600/60 to-indigo-400/60 hover:from-indigo-500 hover:to-indigo-300'
                        : 'bg-white/[0.03]'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] text-gray-600">
            <span>15 abr</span>
            <span>22 abr</span>
            <span>29 abr</span>
            <span>6 may</span>
            <span>13 may</span>
          </div>
        </div>
        {/* Funnel */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">🌪️ Embudo de ventas</p>
          <div className="space-y-3">
            {funnel.map((f, i) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold">{f.stage}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{f.count}</span>
                    <span className="text-[10px] text-gray-500">({f.pct}%)</span>
                  </div>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.color} transition-all`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
                {i < funnel.length - 1 && (
                  <p className="text-[9px] text-gray-600 text-center mt-1">
                    ↓ {Math.round((funnel[i + 1].count / f.count) * 100)}% pasa
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Breakdown por canal + Top servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">🎯 Revenue por canal (atribución real)</p>
            <span className="text-[9px] text-emerald-400 font-bold">100% trazado</span>
          </div>
          <div className="space-y-3">
            {bySource.map((s) => {
              const pct = (s.revenue / totalRevenue) * 100;
              return (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{sourceIcons[s.source]}</span>
                      <p className="text-xs font-bold">{s.source}</p>
                      <span className="text-[9px] text-gray-500">({s.count} ventas)</span>
                    </div>
                    <p className="text-xs font-black text-emerald-400">${(s.revenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sourceColors[s.source]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">💎 Top servicios vendidos</p>
          <div className="space-y-3">
            {analytics.top_services.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold truncate flex-1">{s.service}</p>
                  <span className="text-xs font-black text-emerald-400">${(s.revenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full"
                      style={{ width: `${(s.revenue / analytics.top_services[0].revenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 w-12 text-right">{s.count} ventas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Performance equipo + Ciudades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">🏆 Performance del equipo</p>
          <div className="space-y-3">
            {agents.map((a) => {
              const revenue = leads
                .filter(l => l.agent === a.name && l.stage === 'cerrado_ganado')
                .reduce((s, l) => s + (l.amount || 0), 0);
              return (
                <div key={a.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-black text-indigo-400 shrink-0">
                    {a.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <p className="text-xs font-bold truncate">{a.name}</p>
                      <span className="text-xs font-black text-emerald-400">${(revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span>{a.sales_closed} ventas</span>
                      <span>·</span>
                      <span>Resp. {a.response_avg_sec}s avg</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        style={{ width: `${(a.sales_closed / 18) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">📍 Ventas por ciudad</p>
          <div className="space-y-3">
            {byCity.map((c) => {
              const pct = (c.revenue / totalRevenue) * 100;
              return (
                <div key={c.city}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <p className="text-xs font-bold">{c.city}</p>
                      <span className="text-[9px] text-gray-500">({c.count} ventas)</span>
                    </div>
                    <p className="text-xs font-black text-emerald-400">${(c.revenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ROI por campaña */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">🚀 ROI real por campaña</p>
          <span className="text-[9px] text-purple-400 font-bold">Atribución completa activa</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Campaña</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">Inversión</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">Leads</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">CPL</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">Ventas</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">Revenue</th>
                <th className="pb-2 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {adsCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.image}</span>
                      <p className="text-xs font-bold truncate max-w-[180px]">{c.name}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-right text-purple-400 font-bold">${c.spend_total.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right text-emerald-400 font-bold">{c.leads}</td>
                  <td className="py-3 pr-3 text-right text-yellow-400 font-bold">${c.cpl.toFixed(0)}</td>
                  <td className="py-3 pr-3 text-right text-emerald-400 font-bold">{c.sales}</td>
                  <td className="py-3 pr-3 text-right text-purple-400 font-bold">${(c.revenue / 1000).toFixed(0)}k</td>
                  <td className="py-3 text-right">
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${
                      (c.revenue / c.spend_total) >= 5
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : (c.revenue / c.spend_total) >= 2
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {Math.round((c.revenue / c.spend_total) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-white/[0.02] font-black">
                <td className="py-3 pr-3 text-xs">TOTAL</td>
                <td className="py-3 pr-3 text-right text-purple-400">${totalAdsSpend.toLocaleString()}</td>
                <td className="py-3 pr-3 text-right text-emerald-400">
                  {adsCampaigns.reduce((s, c) => s + c.leads, 0)}
                </td>
                <td className="py-3 pr-3 text-right text-yellow-400">
                  ${(totalAdsSpend / adsCampaigns.reduce((s, c) => s + c.leads, 0)).toFixed(0)}
                </td>
                <td className="py-3 pr-3 text-right text-emerald-400">
                  {adsCampaigns.reduce((s, c) => s + c.sales, 0)}
                </td>
                <td className="py-3 pr-3 text-right text-purple-400">${(totalAdsRevenue / 1000).toFixed(0)}k</td>
                <td className="py-3 text-right">
                  <span className="text-xs font-black px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    {Math.round(roas)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer educativo */}
      <div className="bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-emerald-500/5 border border-purple-500/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🎯</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">
              Esto es lo que HubSpot cobra $890/mes — aquí va incluido
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Atribución completa significa que sabes exactamente qué anuncio, qué canal y qué agente te dio cada peso. La IA de Meta aprende de tus VENTAS reales — no de clics — y reduce tu costo por adquisición 30-50% en 60 días. <span className="text-purple-400 font-bold">Tu plata invertida rinde 2-5x más sin tocar Ads Manager.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}