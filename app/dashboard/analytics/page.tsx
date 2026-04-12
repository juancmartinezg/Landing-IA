'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/analytics`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando reportes...</div>;
  if (!data) return <div className="text-center py-12 text-gray-500">Error cargando datos</div>;
  const conversionRate = data.total_leads > 0 ? ((data.paid_count / data.total_leads) * 100).toFixed(1) : '0';
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reportes y Analiticas 📈</h1>
      {/* Metricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-3xl font-bold text-indigo-400">{data.total_leads}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tasa de Conversion</p>
          <p className="text-3xl font-bold text-emerald-400">{conversionRate}%</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ingresos Totales</p>
          <p className="text-3xl font-bold text-purple-400">${data.total_revenue?.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ticket Promedio</p>
          <p className="text-3xl font-bold text-sky-400">
            ${data.paid_count > 0 ? Math.round(data.total_revenue / data.paid_count).toLocaleString() : 0}
          </p>
        </div>
      </div>
      {/* Detalle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pagos Aprobados</p>
          <p className="text-2xl font-bold text-emerald-400">{data.paid_count}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pagos Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{data.pending_count}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Citas Agendadas</p>
          <p className="text-2xl font-bold text-sky-400">{data.scheduled_count}</p>
        </div>
      </div>
      {/* Graficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Leads por Estado</h3>
          {Object.entries(data.leads_by_status || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.leads_by_status).map(([status, count]: any) => {
                const pct = data.total_leads > 0 ? (count / data.total_leads) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{status}</span>
                      <span className="font-bold text-indigo-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000" style={{width: `${pct}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Sin datos</p>
          )}
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Top Servicios</h3>
          {(data.top_services || []).length > 0 ? (
            <div className="space-y-3">
              {data.top_services.map((svc: any, i: number) => {
                const maxCount = data.top_services[0]?.count || 1;
                const pct = (svc.count / maxCount) * 100;
                const colors = ['from-emerald-600 to-emerald-400', 'from-sky-600 to-sky-400', 'from-purple-600 to-purple-400', 'from-yellow-600 to-yellow-400', 'from-pink-600 to-pink-400'];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{svc.service}</span>
                      <span className="font-bold text-emerald-400">{svc.count}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-1000`} style={{width: `${pct}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Sin datos</p>
          )}
        </div>
      </div>
      {/* Funnel */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h3 className="font-bold mb-6">Embudo de Conversion</h3>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-md">
            <div className="bg-indigo-600/20 rounded-xl p-4 text-center mb-2">
              <p className="text-xs text-gray-400">Leads Totales</p>
              <p className="text-2xl font-bold text-indigo-400">{data.total_leads}</p>
            </div>
            <div className="bg-sky-600/20 rounded-xl p-4 text-center mb-2 mx-6">
              <p className="text-xs text-gray-400">Con Intencion de Compra</p>
              <p className="text-2xl font-bold text-sky-400">{data.leads_by_status?.['INTENCION DE COMPRA'] || 0}</p>
            </div>
            <div className="bg-emerald-600/20 rounded-xl p-4 text-center mb-2 mx-12">
              <p className="text-xs text-gray-400">Pagaron</p>
              <p className="text-2xl font-bold text-emerald-400">{data.paid_count}</p>
            </div>
            <div className="bg-purple-600/20 rounded-xl p-4 text-center mx-20">
              <p className="text-xs text-gray-400">Agendaron</p>
              <p className="text-2xl font-bold text-purple-400">{data.scheduled_count}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}