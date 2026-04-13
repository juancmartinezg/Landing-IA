'use client';
import { useAuth } from '../providers';
import ToastProvider from '../components/Toast';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
const menuItems = [
  { href: '/dashboard', label: 'Metricas', icon: '📊' },
  { href: '/dashboard/crm', label: 'CRM / Leads', icon: '👥' },
  { href: '/dashboard/chat', label: 'Conversaciones', icon: '💬' },
  { href: '/dashboard/services', label: 'Servicios', icon: '🛍️' },
  { href: '/dashboard/appointments', label: 'Citas', icon: '📅' },
  { href: '/dashboard/payments', label: 'Pagos', icon: '💳' },
  { href: '/dashboard/analytics', label: 'Reportes', icon: '📈' },
  { href: '/dashboard/memory', label: 'Memoria IA', icon: '🧠' },
  { href: '/dashboard/training', label: 'Entrenar Bot', icon: '🎓' },
  { href: '/dashboard/templates', label: 'Plantillas', icon: '📋' },
  { href: '/dashboard/gateway', label: 'Pasarela', icon: '🏦' },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: '📱' },
  { href: '/dashboard/settings', label: 'Configuracion', icon: '⚙️' },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!loading && !user) {
      const stored = localStorage.getItem('cb_user');
      if (!stored) {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-[#080B14] border-r border-white/5 flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-6 h-16 flex items-center gap-2 border-b border-white/5">
          <img src="/cb-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
        </div>
        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                pathname === item.href
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Usuario'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full text-xs text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/10 transition-all">
            Cerrar sesion
          </button>
        </div>
      </aside>
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#080B14] border-r border-white/5 flex flex-col">
            <div className="px-6 h-16 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <img src="/cb-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                    pathname === item.href
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || 'Usuario'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button onClick={logout} className="w-full text-xs text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/10 transition-all">
                Cerrar sesion
              </button>
            </div>
          </aside>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 text-2xl mr-4">
            ☰
          </button>
          <div className="flex-1"></div>
          <span className="text-sm text-gray-400 hidden md:block">{user?.email}</span>
        </header>
        {/* Page Content */}
         <main className="p-6">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
      </div>
    </div>
  );
}