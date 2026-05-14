'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import DemoBanner from './DemoBanner';
import DemoDataProvider, { useDemo } from './DemoDataProvider';
// Items del sidebar — espejo exacto del dashboard real (app/dashboard/layout.tsx).
// 'enabled' marca si la página tiene demo navegable real.
// Las disabled muestran tooltip "Disponible al crear cuenta".
const menuItems = [
  { href: '/demo', label: 'Métricas', icon: '📊', enabled: true },
  { href: '/demo/crm', label: 'CRM / Leads', icon: '👥', enabled: true },
  { href: '/demo/agents', label: 'Mi equipo', icon: '🧑‍💼', enabled: true },
  { href: '/demo/agents/performance', label: 'Ranking equipo', icon: '🏆', enabled: false },
  { href: '/demo/chat', label: 'Conversaciones', icon: '💬', enabled: true },
  { href: '/demo/services', label: 'Catálogo', icon: '🛍️', enabled: true },
  { href: '/demo/appointments', label: 'Citas', icon: '📅', enabled: true },
  { href: '/demo/payments', label: 'Pagos', icon: '💳', enabled: true },
  { href: '/demo/analytics', label: 'Reportes', icon: '📈', enabled: true },
  { href: '/demo/memory', label: 'Memoria IA', icon: '🧠', enabled: true },
  { href: '/demo/training', label: 'Entrenar Bot', icon: '🎓', enabled: false },
  { href: '/demo/templates', label: 'Plantillas', icon: '📋', enabled: false },
  { href: '/demo/templates/manage', label: 'Plantillas WA', icon: '📝', enabled: true },
  { href: '/demo/marketing', label: 'Campañas', icon: '📢', enabled: true },
  { href: '/demo/gateway', label: 'Pasarela', icon: '🏦', enabled: false },
  { href: '/demo/inventory', label: 'Inventario', icon: '📦', enabled: false },
  { href: '/demo/ads', label: 'Anuncios IA', icon: '🚀', enabled: true },
  { href: '/demo/whatsapp', label: 'WhatsApp', icon: '📱', enabled: false },
  { href: '/demo/settings', label: 'Configuración', icon: '⚙️', enabled: false },
  { href: '/demo/billing', label: 'Suscripción', icon: '💎', enabled: true },
  { href: '/demo/affiliate', label: 'Afiliados', icon: '🤝', enabled: false },
  { href: '/demo/support-history', label: 'Soporte', icon: '🆘', enabled: false },
];
function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { brand, reminders, conversations } = useDemo();
  const [showReminders, setShowReminders] = useState(false);
  const unreadChats = conversations.filter(c => c.flow_state === 'PAUSED_FOR_HUMAN').length;
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <DemoBanner />
      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 bg-[#080B14] border-r border-white/5 flex-col fixed h-[calc(100vh-44px)] z-30 top-[44px]">
          <div className="px-6 h-16 flex items-center gap-2 border-b border-white/5">
            <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              if (!item.enabled) {
                return (
                  <div
                    key={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 text-gray-600 cursor-not-allowed group relative"
                    title="Disponible al crear cuenta"
                  >
                    <span className="text-lg opacity-50">{item.icon}</span>
                    <span className="opacity-50">{item.label}</span>
                    <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 font-bold">PRO</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                  {item.href === '/demo/chat' && unreadChats > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadChats}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                D
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Visitante demo</p>
                <p className="text-[10px] text-gray-500 truncate">demo@clientes.bot</p>
              </div>
            </div>
            <Link href="/auth/login" className="block w-full text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold transition-all">
              Crear mi cuenta
            </Link>
          </div>
        </aside>
        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
            <aside className="absolute left-0 top-0 h-full w-64 bg-[#080B14] border-r border-white/5 flex flex-col">
              <div className="px-6 h-16 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-2xl">×</button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {menuItems.map((item) => {
                  if (!item.enabled) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 text-gray-600 cursor-not-allowed"
                      >
                        <span className="text-lg opacity-50">{item.icon}</span>
                        <span className="opacity-50 flex-1">{item.label}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 font-bold">PRO</span>
                      </div>
                    );
                  }
                  return (
                    <Link
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
                      {item.href === '/demo/chat' && unreadChats > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {unreadChats}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/5">
                <Link href="/auth/login" className="block w-full text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold transition-all">
                  Crear mi cuenta
                </Link>
              </div>
            </aside>
          </div>
        )}
        {/* Main */}
        <div className="flex-1 md:ml-64 overflow-x-hidden w-full max-w-full">
          {/* Top Navbar */}
          <header className="h-16 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-md flex items-center px-4 md:px-6 sticky top-[44px] z-20">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 text-2xl mr-4">
              ☰
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center gap-3">
              {/* Recordatorios */}
              <div className="relative">
                <button
                  onClick={() => setShowReminders(!showReminders)}
                  className="relative text-gray-400 hover:text-white text-xl transition-all"
                >
                  🔔
                  {reminders.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {reminders.length}
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
                        {reminders.map((r) => (
                          <div key={r.id} className={`px-4 py-3 border-b border-white/5 ${r.overdue ? 'bg-red-500/5' : ''}`}>
                            <div className="flex items-start gap-2">
                              <span className="text-sm mt-0.5">{r.overdue ? '🔴' : '🟡'}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium truncate">{r.customer_name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{r.text}</p>
                                <p className={`text-[9px] mt-0.5 ${r.overdue ? 'text-red-400' : 'text-gray-500'}`}>
                                  {r.overdue ? '⚠️ Vencido' : '📅 Próximo'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">{brand.name}</p>
                <p className="text-[10px] text-gray-500">Modo demo · Datos ficticios</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base">
                🏢
              </div>
            </div>
          </header>
          <main className="p-3 md:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoDataProvider>
      <DemoShell>{children}</DemoShell>
    </DemoDataProvider>
  );
}