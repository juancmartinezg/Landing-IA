'use client';
import { useDemo } from './DemoDataProvider';
import Link from 'next/link';
export default function DemoMetricsPage() {
  const { analytics, brand, agents, conversations, leads, adsCampaigns } = useDemo();
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime())
    .slice(0, 6);
  const activeConvs = conversations.filter(c => c.flow_state !== 'CHAT_MODE').length;
  const totalAdsSpend = adsCampaigns.reduce((s, c) => s + c.spend_total, 0);
  const totalAdsLeads = adsCampaigns.reduce((s, c) => s + c.leads, 0);
  const totalAdsRevenue = adsCampaigns.reduce((s, c) => s + c.revenue, 0);
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            Bienvenido, {brand.name} 👋
          </h1>
          <p className="text-gray-400 text-sm">Tu centro de comando · Últimos 30 días</p>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {['Hoy', '7d', '30d', '90d'].map((p, i) => (
            <button
              key={p}
              className={`text-[10px] md:text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                i === 2 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total leads</p>
          <p className="text-2xl md:text-3xl font-black text-indigo-400">{analytics.total_leads}</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +28% vs mes anterior</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Ventas cerradas</p>
          <p className="text-2xl md:text-3xl font-black text-emerald-400">{analytics.paid_count}</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +40% vs mes anterior</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Citas agendadas</p>
          <p className="text-2xl md:text-3xl font-black text-sky-400">{analytics.scheduled_count}</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +15% vs mes anterior</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Ingresos</p>
          <p className="text-2xl md:text-3xl font-black text-purple-400">
            ${(analytics.total_revenue / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">USD · ↑ +52%</p>
        </div>
      </div>
      {/* Performance Ads + KPIs operativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/0 border border-purple-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">📢 Inversión Ads</p>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">3 ACTIVAS</span>
          </div>
          <p className="text-2xl font-black text-purple-400 mb-1">${totalAdsSpend.toLocaleString()}</p>
          <div className="flex gap-3 text-[10px] text-gray-400 mt-3">
            <span>{totalAdsLeads} leads</span>
            <span className="text-emerald-400">CPL ${(totalAdsSpend / totalAdsLeads).toFixed(0)}</span>
            <span className="text-purple-400">ROAS {Math.round((totalAdsRevenue / totalAdsSpend))}x</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">⚡ Conversaciones activas</p>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mb-1">{conversations.length}</p>
          <div className="flex gap-3 text-[10px] text-gray-400 mt-3">
            <span>{activeConvs} con humano</span>
            <span className="text-sky-400">{conversations.length - activeConvs} con IA</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold">🎯 Conversión global</p>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">↑ +8%</span>
          </div>
          <p className="text-2xl font-black text-yellow-400 mb-1">{analytics.conversion_rate}%</p>
          <div className="flex gap-3 text-[10px] text-gray-400 mt-3">
            <span>Lead → venta</span>
            <span className="text-yellow-400">Tiempo resp. {analytics.avg_response_time_sec}s</span>
          </div>
        </div>
      </div>
      {/* Leads recientes + chat en vivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Leads más recientes</p>
            <Link href="/demo/crm" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Ver todos →</Link>
          </div>
          <div className="space-y-2">
            {recentLeads.map((l) => {
              const stageColors: Record<string, string> = {
                'nuevo': 'bg-slate-500/20 text-slate-300',
                'interesado': 'bg-sky-500/20 text-sky-300',
                'negociacion': 'bg-amber-500/20 text-amber-300',
                'cerrado_ganado': 'bg-emerald-500/20 text-emerald-300',
              };
              const stageLabels: Record<string, string> = {
                'nuevo': '🆕 Nuevo',
                'interesado': '🔥 Interesado',
                'negociacion': '🤝 Negociación',
                'cerrado_ganado': '✅ Ganado',
              };
              return (
                <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all">
                  <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                    {l.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{l.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{l.last_msg}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${stageColors[l.stage]}`}>
                    {stageLabels[l.stage]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">💬 Conversaciones en vivo</p>
            <Link href="/demo/chat" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Abrir bandeja →</Link>
          </div>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((c) => {
              const stateColor = c.flow_state === 'PAUSED_FOR_HUMAN'
                ? 'bg-red-500/20 text-red-400'
                : c.flow_state === 'AWAITING_CHANNEL_CHOICE'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-emerald-500/20 text-emerald-400';
              const stateLabel = c.flow_state === 'PAUSED_FOR_HUMAN'
                ? '🙋 Humano'
                : c.flow_state === 'AWAITING_CHANNEL_CHOICE'
                ? '⏳ Esperando'
                : '🤖 Bot';
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all">
                  <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{lastMsg?.text}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${stateColor}`}>
                    {stateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Performance del equipo + Top servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">🏆 Equipo · Top vendedores</p>
          <div className="space-y-3">
            {agents.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {a.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold truncate">{a.name}</p>
                    <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">{a.sales_closed} ventas</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                      style={{ width: `${(a.sales_closed / 18) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">💎 Servicios más vendidos</p>
          <div className="space-y-3">
            {analytics.top_services.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold truncate flex-1">{s.service}</p>
                  <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">${(s.revenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full"
                      style={{ width: `${(s.revenue / analytics.top_services[0].revenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 w-10 text-right">{s.count} ventas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Campañas activas */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">🚀 Campañas publicitarias activas</p>
          <Link href="/demo/ads" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Gestionar →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {adsCampaigns.map((c) => (
            <div key={c.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{c.name}</p>
                  <p className="text-[9px] text-gray-500">${c.budget_daily}/día</p>
                </div>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-white/[0.02] rounded-lg p-1.5">
                  <p className="text-[8px] text-gray-500">Leads</p>
                  <p className="text-xs font-black text-emerald-400">{c.leads}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-1.5">
                  <p className="text-[8px] text-gray-500">CPL</p>
                  <p className="text-xs font-black text-yellow-400">${c.cpl.toFixed(0)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-1.5">
                  <p className="text-[8px] text-gray-500">ROAS</p>
                  <p className="text-xs font-black text-purple-400">{Math.round(c.revenue / c.spend_total)}x</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/demo/crm" className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-indigo-500/30 transition-all group">
          <p className="text-2xl mb-2">👥</p>
          <h3 className="text-sm font-bold group-hover:text-indigo-400 transition-colors">CRM Kanban</h3>
          <p className="text-[10px] text-gray-500 mt-1">Arrastra leads entre etapas</p>
        </Link>
        <Link href="/demo/chat" className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-emerald-500/30 transition-all group">
          <p className="text-2xl mb-2">💬</p>
          <h3 className="text-sm font-bold group-hover:text-emerald-400 transition-colors">Bandeja unificada</h3>
          <p className="text-[10px] text-gray-500 mt-1">WhatsApp + IG + FB</p>
        </Link>
        <Link href="/demo/ads" className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all group">
          <p className="text-2xl mb-2">🚀</p>
          <h3 className="text-sm font-bold group-hover:text-purple-400 transition-colors">Anuncios IA</h3>
          <p className="text-[10px] text-gray-500 mt-1">Crear + optimizar solo</p>
        </Link>
        <Link href="/demo/analytics" className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-sky-500/30 transition-all group">
          <p className="text-2xl mb-2">📈</p>
          <h3 className="text-sm font-bold group-hover:text-sky-400 transition-colors">Reportes IA</h3>
          <p className="text-[10px] text-gray-500 mt-1">Atribución completa</p>
        </Link>
      </div>
    </div>
  );
}