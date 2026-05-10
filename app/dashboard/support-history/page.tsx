'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface SupportAction {
  action: string;
  target: string;
  details: string;
  ts: number;
}
interface SupportRequest {
  request_id: string;
  admin_email: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'COMPLETED';
  reason: string;
  created_at: number;
  approved_at: number;
  denied_at: number;
  expired_at: number;
  closed_at: number;
  rw_expires_at: number;
  actions_count: number;
  close_reason: string;
  actions: SupportAction[];
}
const STATUS_META: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  PENDING: { label: 'Esperando respuesta', color: 'text-yellow-400', bg: 'bg-yellow-500/10', emoji: '⏳' },
  APPROVED: { label: 'En sesión activa', color: 'text-emerald-400', bg: 'bg-emerald-500/10', emoji: '✏️' },
  DENIED: { label: 'Denegada', color: 'text-gray-400', bg: 'bg-gray-500/10', emoji: '🚫' },
  EXPIRED: { label: 'Expirada', color: 'text-amber-400', bg: 'bg-amber-500/10', emoji: '⏰' },
  COMPLETED: { label: 'Sesión finalizada', color: 'text-indigo-400', bg: 'bg-indigo-500/10', emoji: '✓' },
};
export default function SupportHistoryPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<SupportRequest[]>([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    if (!user?.companyId) return;
    fetch(`${API_URL}/support/history`, { headers: { 'client-id': user.companyId } })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) setHistory(d.history || []);
        else setError(d.error || 'Error cargando historial');
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || 'Error de conexión');
        setLoading(false);
      });
  }, [user]);
  const fmtDate = (ts: number) => {
    if (!ts) return '—';
    return new Date(ts * 1000).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const fmtDuration = (start: number, end: number) => {
    if (!start || !end) return '—';
    const min = Math.max(1, Math.floor((end - start) / 60));
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    return `${h}h ${min % 60}min`;
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
      <div>
        <h1 className="text-2xl font-black tracking-tight">🆘 Historial de soporte</h1>
        <p className="text-xs text-gray-400 mt-1">
          Cada vez que un admin de clientes.bot acceda a tu cuenta queda registrado aquí. Transparencia total — últimos 90 días.
        </p>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
          {error}
        </div>
      )}
      {history.length === 0 && !error && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h3 className="font-bold mb-1">Sin actividad de soporte</h3>
          <p className="text-xs text-gray-400">
            Nadie del equipo de clientes.bot ha solicitado acceso a tu cuenta en los últimos 90 días.
          </p>
        </div>
      )}
      <div className="space-y-3">
        {history.map((r) => {
          const meta = STATUS_META[r.status] || STATUS_META.PENDING;
          const isExpanded = expanded === r.request_id;
          const endTs = r.closed_at || r.rw_expires_at;
          const hasActions = r.status === 'COMPLETED' && r.actions.length > 0;
          return (
            <div key={r.request_id} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${meta.bg} ${meta.color}`}>
                      {meta.emoji} {meta.label}
                    </span>
                    {r.status === 'COMPLETED' && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 font-bold">
                        {r.actions.length} cambio{r.actions.length === 1 ? '' : 's'}
                      </span>
                    )}
                    {r.close_reason === 'timeout' && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                        Cerrada por tiempo
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {fmtDate(r.created_at)}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">Admin: </span>
                    <code className="text-indigo-300 font-mono text-[11px]">{r.admin_email}</code>
                  </div>
                  <div>
                    <span className="text-gray-500">Razón: </span>
                    <span className="text-gray-200">{r.reason}</span>
                  </div>
                  {r.status === 'COMPLETED' && (
                    <div>
                      <span className="text-gray-500">Duración sesión: </span>
                      <span className="text-gray-200">{fmtDuration(r.approved_at, endTs)}</span>
                    </div>
                  )}
                </div>
                {hasActions && (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : r.request_id)}
                    className="mt-3 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    {isExpanded ? '▲ Ocultar detalles' : `▼ Ver ${r.actions.length} acción${r.actions.length === 1 ? '' : 'es'}`}
                  </button>
                )}
              </div>
              {hasActions && isExpanded && (
                <div className="border-t border-white/5 bg-black/20 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">
                    Acciones realizadas durante la sesión
                  </p>
                  <ul className="space-y-2">
                    {r.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold">{a.action}</span>
                            {a.target && (
                              <code className="text-[10px] text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                                {a.target}
                              </code>
                            )}
                            <span className="text-[10px] text-gray-600 ml-auto">{fmtDate(a.ts)}</span>
                          </div>
                          {a.details && (
                            <p className="text-[11px] text-gray-400 mt-1 break-words">{a.details}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}