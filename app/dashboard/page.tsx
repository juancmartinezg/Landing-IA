'use client';
import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/cb-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">
              Cerrar sesion
            </button>
          </div>
        </div>
      </nav>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.name || user.email} 👋</h1>
        <p className="text-gray-400 mb-8">Este es tu centro de comando</p>
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Leads</p>
            <p className="text-3xl font-bold text-indigo-400">--</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pagos</p>
            <p className="text-3xl font-bold text-emerald-400">--</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Citas</p>
            <p className="text-3xl font-bold text-sky-400">--</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ingresos</p>
            <p className="text-3xl font-bold text-purple-400">--</p>
          </div>
        </div>
        {/* Coming Soon */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🚀</p>
          <h2 className="text-xl font-bold mb-2">Dashboard en construccion</h2>
          <p className="text-gray-400 text-sm">Estamos construyendo tu centro de comando. Muy pronto podras ver metricas, CRM, conversaciones y mas.</p>
        </div>
      </div>
    </div>
  );
}