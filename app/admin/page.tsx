'use client';
import { useAuth } from '../providers';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface TopTenant {
  company_id: string;
  messages_24h: number;
}
interface OverviewData {
  tenants_total: number;
  tenants_active: number;
  messages_24h: number;
  payments_30d_count: number;
  payments_30d_total: number;
  errors_24h: number;
  audit_logs_24h: number;
  top_5_tenants_by_messages_24h: TopTenant[];
  _cached: boolean;
  _generated_at: number;
}
export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const fetchOverview = async () => {
    if (!user?.email) return;
    setRefreshing(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/overview`, {
        headers: {
          'client-id': user.sub || user.email,
          'x-user-email': user.email,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || `Error ${res.status}`);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchOverview();
    // Auto-refresh cada 60s (igual al TTL del cache backend)
    const interval = setInterval(fetchOverview, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <p className="text-sm text-red-400 font-bold mb-1">Error cargando overview</p>
        <p className="text-xs text-gray-400">{error}</p>
        <button
          onClick={fetchOverview}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }
  if (!data) return null;
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  const formatNum = (n: number) =>
    new Intl.NumberFormat('es-CO').format(n);
  const generatedAgo = Math.floor((Date.now() / 1000) - data._generated_at);
  const generatedLabel = generatedAgo < 60
    ? `hace ${generatedAgo}s`
    : `hace ${Math.floor(generatedAgo / 60)}m`;
  const cards = [
    { label: 'Tenants totales', value: formatNum(data.tenants_total), icon: '🏢', color: 'indigo' },
    { label: 'Tenants activos', value: formatNum(data.tenants_active), icon: '✅', color: 'emerald' },
    { label: 'Mensajes 24h', value: formatNum(data.messages_24h), icon: '💬', color: 'sky' },
    { label: 'Pagos 30d', value: formatNum(data.payments_30d_count), icon: '💳', color: 'yellow' },
    { label: 'Revenue 30d', value: formatCurrency(data.payments_30d_total), icon: '💰', color: 'emerald' },
    { label: 'Errores 24h', value: formatNum(data.errors_24h), icon: '🐛', color: data.errors_24h > 0 ? 'red' : 'gray' },
    { label: 'Audit logs 24h', value: formatNum(data.audit_logs_24h), icon: '📝', color: 'purple' },
  ];
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    sky: 'text-sky-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400',
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Generado {generatedLabel}
            {data._cached && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">cache</span>}
          </p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={refreshing}
          className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 transition-all"
        >
          {refreshing ? '⏳ Actualizando...' : '🔄 Actualizar'}
        </button>
      </div>
      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{c.icon}</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{c.label}</p>
            <p className={`text-xl md:text-2xl font-black ${colorMap[c.color]}`}>{c.value}</p>
          </div>
        ))}
      </div>
      {/* Top 5 tenants por mensajes */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          🏆 Top 5 tenants por mensajes (24h)
        </h2>
        {data.top_5_tenants_by_messages_24h.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">Sin actividad en las últimas 24h</p>
        ) : (
          <div className="space-y-2">
            {data.top_5_tenants_by_messages_24h.map((t, i) => {
              const max = data.top_5_tenants_by_messages_24h[0]?.messages_24h || 1;
              const pct = (t.messages_24h / max) * 100;
              return (
                <div key={t.company_id} className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 w-6">#{i + 1}</span>
                  <span className="text-xs font-mono text-gray-300 w-32 truncate">{t.company_id}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 w-12 text-right">{t.messages_24h}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Banner de errores si hay */}
      {data.errors_24h > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-sm font-bold text-red-400 mb-1">
            🐛 {data.errors_24h} error{data.errors_24h !== 1 ? 'es' : ''} en las últimas 24h
          </p>
          <p className="text-xs text-gray-400">
            Revisa la tabla <code className="bg-white/5 px-1.5 py-0.5 rounded">ErrorLog</code> en DynamoDB para detalles.
          </p>
        </div>
      )}
    </div>
  );
}