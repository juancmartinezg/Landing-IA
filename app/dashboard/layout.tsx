'use client';
import { useAuth } from '../providers';
import ToastProvider from '../components/Toast';
import AgentChat from '../components/AgentChat';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const menuItems = [
  { href: '/dashboard', label: 'Metricas', icon: '📊' },
  { href: '/dashboard/crm', label: 'CRM / Leads', icon: '👥' },
  { href: '/dashboard/chat', label: 'Conversaciones', icon: '💬' },
  { href: '/dashboard/services', label: 'Catálogo', icon: '🛍️' },
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
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [reminders, setReminders] = useState<any[]>([]);
  const [showReminders, setShowReminders] = useState(false);
  useEffect(() => {
    if (!loading && !user) {
      const stored = localStorage.getItem('cb_user');
      if (!stored) {
        router.push('/auth/login');
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (!parsed.companyId) {
            router.push('/auth/welcome');
          }
        } catch {}
      }
    }
    iif (user?.companyId) {
      // Cargar cache primero para render inmediato
      const cached = localStorage.getItem('cb_config');
      if (cached) {
        try {
          const c = JSON.parse(cached);
          setBrandName(c.brand_name || '');
          setBrandLogo(c.brand_logo_url || '');
        } catch {}
      }
      fetch(`${API_URL}/config`, { headers: { 'client-id': user.companyId } })
        .then(res => res.json())
        .then(data => {
          setBrandName(data.brand_name || '');
          setBrandLogo(data.brand_logo_url || '');
          localStorage.setItem('cb_config', JSON.stringify(data));
        })
        .catch(() => {});
      fetch(`${API_URL}/leads/reminders`, { headers: { 'client-id': user.companyId } })
        .then(res => res.json())
        .then(data => setReminders(data.reminders || []))
        .catch(() => {});
    }
    const interval = setInterval(() => {
      if (user?.companyId) {
        fetch(`${API_URL}/leads/reminders`, { headers: { 'client-id': user.companyId } })
          .then(res => res.json())
          .then(data => setReminders(data.reminders || []))
          .catch(() => {});
      }
    }, 60000);
    return () => clearInterval(interval);
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
          <div className="flex items-center gap-3">
            {/* Campanita de recordatorios */}
            <div className="relative">
              <button onClick={() => setShowReminders(!showReminders)}
                className="relative text-gray-400 hover:text-white text-xl transition-all">
                🔔
                {reminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {reminders.length > 9 ? '9+' : reminders.length}
                  </span>
                )}
              </button>
              {showReminders && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowReminders(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                      <span className="text-xs font-bold">⏰ Recordatorios</span>
                      <span className="text-[10px] text-gray-500">{reminders.length} pendientes</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {reminders.length === 0 ? (
                        <p className="text-xs text-gray-600 text-center py-8">Sin recordatorios pendientes 🎉</p>
                      ) : reminders.slice(0, 10).map((r, i) => {
                        const isOverdue = r.overdue;
                        const date = new Date(r.remind_at * 1000);
                        const dateStr = date.toLocaleDateString();
                        const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                        return (
                          <div key={i} onClick={() => { setShowReminders(false); router.push(`/dashboard/crm`); }}
                            className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${
                              isOverdue ? 'bg-red-500/5' : ''
                            }`}>
                            <div className="flex items-start gap-2">
                              <span className="text-sm mt-0.5">{isOverdue ? '🔴' : '🟡'}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium truncate">{r.customer_name || 'Sin nombre'}</p>
                                <p className="text-[10px] text-gray-400 truncate">{r.text}</p>
                                <p className={`text-[9px] mt-0.5 ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                                  {isOverdue ? '⚠️ Vencido' : '📅'} {dateStr} {timeStr}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {reminders.length > 0 && (
                      <div className="px-4 py-2 border-t border-white/5">
                        <a href="/dashboard/crm" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">
                          Ver todos en CRM →
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {brandLogo && (
              <img src={brandLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white/5" />
            )}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{brandName || user?.name || 'Mi Negocio'}</p>
              <p className="text-[10px] text-gray-500">{user?.email}</p>
            </div>
          </div>
        </header>
        {/* Page Content */}
         <main className="p-6">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
        {user?.companyId && (
          <AgentChat companyId={user.companyId} />
        )}
      </div>
    </div>
  );
}