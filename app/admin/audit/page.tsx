'use client';
import { useAuth } from '../../providers';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AdminAuditPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [tenantFilter, setTenantFilter] = useState('');
  const [limit, setLimit] = useState(50);
  const fetchAudit = async (tid?: string) => {
    if (!user?.email) return;
    setRefreshing(true);
    setError('');
    try {
      const clientId = tid || tenantFilter || user.sub || user.email;
      const res = await fetch(`${API_URL}/admin/audit?limit=${limit}`, {
        headers: {
          'client-id': clientId,
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
      setLogs(json.logs || []);
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const formatTime = (ts: number) => {
    if (!ts) return '—';
    const ago = Math.floor(Date.now() / 1000 - ts);
    if (ago < 60) return `hace ${ago}s`;
    if (ago < 3600) return `hace ${Math.floor(ago / 60)}m`;
    if (ago < 86400) return `hace ${Math.floor(ago / 3600)}h`;
    return new Date(ts * 1000).toLocaleString('es-CO');
  };
  const actionColors: Record<string, string> = {
    CONNECT_WHATSAPP: 'bg-blue-500/10 text-blue-400',
    UPDATE_CONFIG: 'bg-indigo-500/10 text-indigo-400',
    DELETE_SERVICE: 'bg-red-500/10 text-red-400',
    ADMIN_UPDATE_TENANT: 'bg-yellow-500/10 text-yellow-400',
    PIXEL_CREATED: 'bg-emerald-500/10 text-emerald-400',
    TOKEN_RENEWED: 'bg-purple-500/10 text-purple-400',
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">📜 Audit Log</h1>
          <p className="text-xs text-gray-500 mt-1">{logs.length} eventos</p>
        </div>
        <button onClick={() => fetchAudit()} disabled={refreshing}
          className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 transition-all">
          {refreshing ? '⏳' : '🔄 Actualizar'}
        </button>
      </div>
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <input type="text" value={tenantFilter}
            onChange={e => setTenantFilter(e.target.value)}
            placeholder="Company ID (ej: JMC)"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" />
          <select value={limit} onChange={e => setLimit(parseInt(e.target.value))}
            className="bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none">
            <option value={25}>25 eventos</option>
            <option value={50}>50 eventos</option>
            <option value={100}>100 eventos</option>
          </select>
          <button onClick={() => fetchAudit(tenantFilter || undefined)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg text-xs font-bold transition-all">
            Filtrar
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {logs.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📜</p>
          <p className="text-xs text-gray-400">Sin eventos en el audit log para este tenant</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/10"></div>
          <div className="space-y-3">
            {logs.map((log, i) => {
              const color = actionColors[log.action] || 'bg-gray-500/10 text-gray-400';
              return (
                <div key={log.sk || i} className="relative pl-10">
                  <div className="absolute left-[11px] top-2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0B0F1A]"></div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${color}`}>
                          {log.action}
                        </span>
                        {log.target && (
                          <code className="text-[10px] font-mono text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded">
                            {log.target}
                          </code>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatTime(log.timestamp)}</span>
                    </div>
                    {log.actor && (
                      <p className="text-[10px] text-gray-500 mt-1">por <span className="text-gray-300">{log.actor}</span></p>
                    )}
                    {log.details && (
                      <p className="text-[11px] text-gray-400 mt-1 break-words">{log.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}