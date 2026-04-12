'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/analytics`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => { setAnalytics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.name || user?.email || 'Usuario'} 👋</h1>
      <p className="text-gray-400 mb-8">Este es tu centro de comando</p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 animate-pulse">
              <div className="h-3 bg-white/5 rounded mb-3 w-20"></div>
              <div className="h-8 bg-white/5 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-indigo-400">{analytics?.total_leads || 0}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pagos Aprobados</p>
              <p className="text-3xl font-bold text-emerald-400">{analytics?.paid_count || 0}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Citas Agendadas</p>
              <p className="text-3xl font-bold text-sky-400">{analytics?.scheduled_count || 0}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ingresos</p>
              <p className="text-3xl font-bold text-purple-400">${analytics?.total_revenue?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Leads por Estado</h3>
              {analytics?.leads_by_status && Object.entries(analytics.leads_by_status).length > 0 ? (
                Object.entries(analytics.leads_by_status).map(([status, count]: any) => (
                  <div key={status} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">{status}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{width: `${(count / (analytics?.total_leads || 1)) * 100}%`}}></div>
                      </div>
                      <span className="font-bold text-indigo-400 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Sin datos</p>
              )}
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Top Servicios</h3>
              {(analytics?.top_services || []).length > 0 ? (
                analytics.top_services.map((svc: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">{svc.service}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(svc.count / (analytics?.top_services?.[0]?.count || 1)) * 100}%`}}></div>
                      </div>
                      <span className="font-bold text-emerald-400 w-8 text-right">{svc.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Sin datos</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/crm" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">👥</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">CRM / Leads</h3>
              <p className="text-sm text-gray-500">Ver todos tus leads y su historial</p>
            </a>
            <a href="/dashboard/services" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">🛍️</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Servicios</h3>
              <p className="text-sm text-gray-500">Gestionar tu catalogo</p>
            </a>
            <a href="/dashboard/settings" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">⚙️</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Configuracion</h3>
              <p className="text-sm text-gray-500">Ajustar tu negocio</p>
            </a>
          </div>
        </>
      )}
    </div>
  );
}