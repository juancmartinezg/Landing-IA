'use client';
import { useAuth } from '../../providers';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface Tenant {
  company_id: string;
  brand_name?: string;
  status?: string;
  plan?: string;
  created_at?: string;
}
interface TenantsResponse {
  tenants: Tenant[];
  count: number;
  next_token: string;
  has_more: boolean;
}
export default function AdminTenantsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [currentToken, setCurrentToken] = useState('');
  const [nextToken, setNextToken] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [tokenStack, setTokenStack] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const fetchTenants = async (token: string = '', isNewSearch: boolean = false) => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page_size', String(pageSize));
      if (token) params.set('next_token', token);
      const res = await fetch(`${API_URL}/admin/tenants?${params.toString()}`, {
        headers: {
          'client-id': user.sub || user.email,
          'x-user-email': user.email,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || `Error ${res.status}`);
        setLoading(false);
        return;
      }
      const json: TenantsResponse = await res.json();
      setTenants(json.tenants || []);
      setNextToken(json.next_token || '');
      setHasMore(json.has_more || false);
      setCurrentToken(token);
      if (isNewSearch) setTokenStack([]);
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchTenants('', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pageSize]);
  const handleNext = () => {
    if (!nextToken) return;
    setTokenStack([...tokenStack, currentToken]);
    fetchTenants(nextToken);
  };
  const handlePrev = () => {
    const prevStack = [...tokenStack];
    const prev = prevStack.pop() || '';
    setTokenStack(prevStack);
    fetchTenants(prev);
  };
  // Filtrar lado cliente (search funciona solo dentro de la página actual)
  const filtered = search
    ? tenants.filter(t =>
        (t.company_id || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.brand_name || '').toLowerCase().includes(search.toLowerCase())
      )
    : tenants;
  const formatDate = (s?: string) => {
    if (!s) return '—';
    try {
      const d = new Date(s.split('.')[0].replace(' ', 'T'));
      return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
    } catch {
      return s.slice(0, 10);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Tenants</h1>
        <p className="text-xs text-gray-500 mt-1">
          {tenants.length} tenant{tenants.length !== 1 ? 's' : ''} en esta página
          {hasMore && <span className="ml-2 text-[10px] text-yellow-400">(hay más)</span>}
        </p>
      </div>
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Buscar por company_id o brand_name (en esta página)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
        />
        <select
          value={pageSize}
          onChange={e => setPageSize(parseInt(e.target.value, 10))}
          className="bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
        >
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
        <button
          onClick={() => fetchTenants(currentToken)}
          disabled={loading}
          className="text-sm px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-50"
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {/* Tabla */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Company ID</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Brand</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Plan</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Creado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs text-gray-500">
                    {search ? 'Sin resultados con ese filtro' : 'Sin tenants'}
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.company_id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-indigo-300">{t.company_id}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {t.brand_name || <span className="text-gray-600 italic">sin nombre</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 uppercase tracking-widest">
                        {t.plan || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold ${
                        t.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {t.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {formatDate(t.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Paginación */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={tokenStack.length === 0 || loading}
          className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-30 transition-all"
        >
          ← Anterior
        </button>
        <span className="text-xs text-gray-500">
          Página {tokenStack.length + 1}
        </span>
        <button
          onClick={handleNext}
          disabled={!hasMore || loading}
          className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-30 transition-all"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}