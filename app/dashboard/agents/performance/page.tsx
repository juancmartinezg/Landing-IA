'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AgentsPerformancePage() {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/agents/performance`, { headers: { 'client-id': user?.companyId || '' } })
      .then((r: any) => r.json())
      .then((d: any) => { setPerformance(d.performance || []); setTotals(d.totals || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando métricas...</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Performance del equipo 📊</h1>
          <p className="text-xs text-gray-500 mt-1">Métricas de cierre y revenue por agente</p>
        </div>
        <Link href="/dashboard/agents" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
          ← Ver agentes
        </Link>
      </div>
      {performance.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-xl font-bold mb-2">Aún no hay datos</h2>
          <p className="text-gray-400 text-sm mb-6">Crea agentes y asigna leads para ver sus métricas aquí.</p>
          <Link href="/dashboard/agents" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-sm font-bold transition-all inline-block">
            + Crear agente
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Leads totales</p>
              <p className="text-xl font-bold text-white">{totals.total_leads || 0}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Cerrados</p>
              <p className="text-xl font-bold text-emerald-400">{totals.total_closed_won || 0}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Revenue</p>
              <p className="text-xl font-bold text-yellow-400">${(totals.total_revenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Conversión prom.</p>
              <p className="text-xl font-bold text-indigo-400">{totals.avg_conversion || 0}%</p>
            </div>
          </div>
          <h3 className="font-bold mb-3">Ranking por agente</h3>
          <div className="space-y-2">
            {performance.map((p: any, i: number) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (p.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">${(p.revenue || 0).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500">revenue total</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-500">Leads</p>
                    <p className="text-sm font-bold">{p.total_leads}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-500">En negociación</p>
                    <p className="text-sm font-bold text-yellow-400">{p.in_negotiation}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-500">Cerrados</p>
                    <p className="text-sm font-bold text-emerald-400">{p.closed_won}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-500">Perdidos</p>
                    <p className="text-sm font-bold text-red-400">{p.closed_lost}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-500">Conversión</p>
                    <p className={`text-sm font-bold ${p.conversion_rate >= 30 ? 'text-emerald-400' : p.conversion_rate >= 15 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {p.conversion_rate}%
                    </p>
                  </div>
                </div>
                {!p.active && <p className="text-[9px] text-red-400 mt-2">⚠️ Agente inactivo</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}