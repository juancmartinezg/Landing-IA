'use client';
import { useAuth } from '../../providers';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface ErrorItem {
  service: string;
  sk: string;
  error_type: string;
  message: string;
  context: string;
  company_id: string;
  actor: string;
  timestamp: number;
}
interface ErrorsData {
  errors: ErrorItem[];
  count: number;
  window_hours: number;
  filters: { service: string | null; error_type: string | null; company_id: string | null };
  by_service: Record<string, number>;
  by_type: Record<string, number>;
  by_tenant: Record<string, number>;
}
export default function AdminErrorsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ErrorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ service: '', error_type: '', company_id: '', hours: '24' });
  const [expanded, setExpanded] = useState<string | null>(null);
  const fetchErrors = async () => {
    if (!user?.email) return;
    setRefreshing(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.service) params.set('service', filters.service);
      if (filters.error_type) params.set('error_type', filters.error_type);
      if (filters.company_id) params.set('company_id', filters.company_id);
      params.set('hours', filters.hours);
      params.set('limit', '100');
      const res = await fetch(`${API_URL}/admin/errors?${params}`, {
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
    fetchErrors();
    const interval = setInterval(fetchErrors, 60000); // auto-refresh 60s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const applyFilters = () => fetchErrors();
  const clearFilters = () => {
    setFilters({ service: '', error_type: '', company_id: '', hours: '24' });
    setTimeout(fetchErrors, 100);
  };
  const formatTime = (ts: number) => {
    const ago = Math.floor(Date.now() / 1000 - ts);
    if (ago < 60) return `hace ${ago}s`;
    if (ago < 3600) return `hace ${Math.floor(ago / 60)}m`;
    if (ago < 86400) return `hace ${Math.floor(ago / 3600)}h`;
    return new Date(ts * 1000).toLocaleString('es-CO');
  };
  const serviceColors: Record<string, string> = {
    SaaS_API: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Bot: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Remarketing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    PromoteMemory: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
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
        <p className="text-sm text-red-400 font-bold mb-1">Error cargando errores</p>
        <p className="text-xs text-gray-400">{error}</p>
        <button onClick={fetchErrors} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-lg">
          Reintentar
        </button>
      </div>
    );
  }
  if (!data) return null;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">🐛 Errores</h1>
          <p className="text-xs text-gray-500 mt-1">
            {data.count} errores en últimas {data.window_hours}h
          </p>
        </div>
        <button onClick={fetchErrors} disabled={refreshing}
          className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 transition-all">
          {refreshing ? '⏳ Actualizando...' : '🔄 Actualizar'}
        </button>
      </div>
      {/* Cards de agregaciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Por servicio</p>
          {Object.keys(data.by_service).length === 0 ? (
            <p className="text-xs text-gray-600">Sin errores</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(data.by_service).map(([s, n]) => (
                <button key={s} onClick={() => { setFilters({ ...filters, service: s }); setTimeout(fetchErrors, 100); }}
                  className="w-full flex justify-between items-center text-xs hover:bg-white/5 px-2 py-1 rounded transition-all">
                  <span className="text-gray-300">{s}</span>
                  <span className="font-bold text-white">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Por tipo</p>
          {Object.keys(data.by_type).length === 0 ? (
            <p className="text-xs text-gray-600">Sin errores</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(data.by_type).slice(0, 5).map(([t, n]) => (
                <button key={t} onClick={() => { setFilters({ ...filters, error_type: t }); setTimeout(fetchErrors, 100); }}
                  className="w-full flex justify-between items-center text-xs hover:bg-white/5 px-2 py-1 rounded transition-all">
                  <span className="text-gray-300 truncate mr-2">{t}</span>
                  <span className="font-bold text-white">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Por tenant</p>
          {Object.keys(data.by_tenant).length === 0 ? (
            <p className="text-xs text-gray-600">Sin tenant info</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(data.by_tenant).slice(0, 5).map(([c, n]) => (
                <button key={c} onClick={() => { setFilters({ ...filters, company_id: c }); setTimeout(fetchErrors, 100); }}
                  className="w-full flex justify-between items-center text-xs hover:bg-white/5 px-2 py-1 rounded transition-all">
                  <span className="text-gray-300 truncate mr-2 font-mono">{c}</span>
                  <span className="font-bold text-white">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Filtros */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <select value={filters.service} onChange={e => setFilters({ ...filters, service: e.target.value })}
            className="bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none">
            <option value="">Todos los servicios</option>
            <option value="SaaS_API">SaaS_API</option>
            <option value="Bot">Bot</option>
            <option value="Remarketing">Remarketing</option>
            <option value="PromoteMemory">PromoteMemory</option>
          </select>
          <input type="text" value={filters.error_type} onChange={e => setFilters({ ...filters, error_type: e.target.value })}
            placeholder="Tipo error (parcial)"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" />
          <input type="text" value={filters.company_id} onChange={e => setFilters({ ...filters, company_id: e.target.value })}
            placeholder="Company ID"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" />
          <select value={filters.hours} onChange={e => setFilters({ ...filters, hours: e.target.value })}
            className="bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none">
            <option value="1">Última hora</option>
            <option value="24">24 horas</option>
            <option value="72">3 días</option>
            <option value="168">7 días</option>
            <option value="720">30 días</option>
          </select>
          <div className="flex gap-2">
            <button onClick={applyFilters} className="flex-1 bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg text-xs font-bold transition-all">
              Filtrar
            </button>
            <button onClick={clearFilters} className="px-3 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
              ✕
            </button>
          </div>
        </div>
      </div>
      {/* Lista de errores */}
      {data.errors.length === 0 ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">✨</p>
          <h3 className="font-bold mb-1">Sin errores</h3>
          <p className="text-xs text-gray-400">
            Ningún error en las últimas {data.window_hours}h con los filtros actuales.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.errors.map((err) => {
            const id = err.sk;
            const isOpen = expanded === id;
            const svcColor = serviceColors[err.service] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            return (
              <div key={id} className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : id)}
                  className="w-full text-left p-3 hover:bg-white/[0.02] transition-all">
                  <div className="flex items-start gap-3 flex-wrap">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${svcColor}`}>
                      {err.service}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold">
                      {err.error_type}
                    </span>
                    {err.company_id && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-mono">
                        {err.company_id}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 ml-auto">{formatTime(err.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 truncate">{err.message}</p>
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 bg-white/[0.02] p-3 space-y-2">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Mensaje completo</p>
                      <pre className="text-[11px] text-gray-300 bg-black/30 rounded p-2 whitespace-pre-wrap break-words">
                        {err.message}
                      </pre>
                    </div>
                    {err.context && (
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Contexto</p>
                        <pre className="text-[11px] text-gray-400 bg-black/30 rounded p-2 whitespace-pre-wrap break-words font-mono">
                          {(() => {
                            try { return JSON.stringify(JSON.parse(err.context), null, 2); }
                            catch { return err.context; }
                          })()}
                        </pre>
                      </div>
                    )}
                    {err.actor && (
                      <div className="text-[10px] text-gray-500">
                        Actor: <span className="text-gray-300">{err.actor}</span>
                      </div>
                    )}
                    <div className="text-[9px] text-gray-600 font-mono">SK: {err.sk}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}