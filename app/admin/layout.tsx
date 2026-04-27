'use client';
import { useAuth } from '../providers';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const adminMenu = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/tenants', label: 'Tenants', icon: '🏢' },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  useEffect(() => {
    if (loading) return;
    // No logueado → login
    if (!user || !user.email) {
      router.replace('/auth/login');
      return;
    }
    // Verificar acceso de super admin contra el backend
    // Llamamos a /admin/overview con el header — si responde 403 no es admin
    fetch(`${API_URL}/admin/overview`, {
      headers: {
        'client-id': user.sub || user.email,
        'x-user-email': user.email,
      },
    })
      .then(res => {
        if (res.status === 403) {
          setAuthorized(false);
          // Redirigir al dashboard normal después de 2s
          setTimeout(() => router.replace('/dashboard'), 2000);
        } else if (res.ok) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          setTimeout(() => router.replace('/auth/login'), 2000);
        }
      })
      .catch(() => {
        setAuthorized(false);
        setTimeout(() => router.replace('/auth/login'), 2000);
      });
  }, [user, loading, router]);
  // Cargando o verificando
  if (loading || authorized === null) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-gray-500">Verificando permisos de admin...</p>
        </div>
      </div>
    );
  }
  // No autorizado
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-red-500/20 rounded-3xl p-8 text-center">
          <p className="text-5xl mb-4">🚫</p>
          <h1 className="text-xl font-bold text-white mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-400 mb-4">
            Esta sección es solo para super administradores.
          </p>
          <p className="text-[10px] text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }
  // Layout de admin
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#080B14] border-r border-white/5 flex-col fixed h-full z-30">
        <div className="px-6 h-16 flex items-center gap-2 border-b border-white/5">
          <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-sm font-bold tracking-tighter leading-none">clientes.bot</p>
            <p className="text-[9px] text-red-400 font-bold tracking-widest">SUPER ADMIN</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {adminMenu.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                pathname === item.href
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-white mt-4 border-t border-white/5 pt-6"
          >
            <span className="text-lg">↩️</span>
            Volver a mi dashboard
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-xs text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/10 transition-all"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#080B14] border-b border-white/5 z-20 flex items-center px-4 gap-3">
        <img src="/cb-logo.webp" alt="Logo" className="w-7 h-7 object-contain" />
        <div className="flex-1">
          <p className="text-sm font-bold tracking-tighter leading-none">clientes.bot</p>
          <p className="text-[9px] text-red-400 font-bold tracking-widest">SUPER ADMIN</p>
        </div>
        <button onClick={logout} className="text-xs text-red-400">Salir</button>
      </div>
      {/* Main */}
      <div className="flex-1 md:ml-64 mt-14 md:mt-0 overflow-x-hidden w-full">
        <main className="p-3 md:p-6">{children}</main>
      </div>
    </div>
  );
}