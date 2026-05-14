'use client';
import { useAuth } from '../providers';
import ToastProvider from '../components/Toast';
import AgentChat from '../components/AgentChat';
import PushSetup from '../components/PushSetup';
import InstallPWAPrompt from '../components/InstallPWAPrompt';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const menuItems = [
  { href: '/dashboard', label: 'Metricas', icon: '📊', roles: ['owner', 'admin', 'agent', 'viewer'] },
  { href: '/dashboard/crm', label: 'CRM / Leads', icon: '👥', roles: ['owner', 'admin', 'agent', 'viewer'] },
  { href: '/dashboard/agents', label: 'Mi equipo', icon: '🧑‍💼', roles: ['owner', 'admin'] },
  { href: '/dashboard/agents/performance', label: 'Ranking equipo', icon: '🏆', roles: ['owner', 'admin'] },
  { href: '/dashboard/chat', label: 'Conversaciones', icon: '💬', roles: ['owner', 'admin', 'agent', 'viewer'] },
  { href: '/dashboard/services', label: 'Catálogo', icon: '🛍️', roles: ['owner', 'admin', 'agent', 'viewer'] },
  { href: '/dashboard/appointments', label: 'Citas', icon: '📅', roles: ['owner', 'admin', 'agent', 'viewer'] },
  { href: '/dashboard/payments', label: 'Pagos', icon: '💳', roles: ['owner', 'admin', 'agent'] },
  { href: '/dashboard/analytics', label: 'Reportes', icon: '📈', roles: ['owner', 'admin'] },
  { href: '/dashboard/memory', label: 'Memoria IA', icon: '🧠', roles: ['owner', 'admin'] },
  { href: '/dashboard/training', label: 'Entrenar Bot', icon: '🎓', roles: ['owner', 'admin'] },
  { href: '/dashboard/templates', label: 'Plantillas', icon: '📋', roles: ['owner', 'admin'] },
  { href: '/dashboard/templates/manage', label: 'Plantillas WA', icon: '📝', roles: ['owner', 'admin'] },
  { href: '/dashboard/gateway', label: 'Pasarela', icon: '🏦', roles: ['owner'] },
  { href: '/dashboard/inventory', label: 'Inventario', icon: '📦', roles: ['owner', 'admin'] },
  { href: '/dashboard/ads', label: 'Facebook Ads', icon: '📢', roles: ['owner', 'admin'] },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: '📱', roles: ['owner'] },
  { href: '/dashboard/settings', label: 'Configuracion', icon: '⚙️', roles: ['owner'] },
  { href: '/dashboard/billing', label: 'Suscripción', icon: '💎', roles: ['owner'] },
  { href: '/dashboard/affiliate', label: 'Afiliados', icon: '🤝', roles: ['owner'] },
  { href: '/dashboard/support-history', label: 'Soporte', icon: '🆘', roles: ['owner'] },
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
  const [unreadChats, setUnreadChats] = useState(0);
  const [tokenWarning, setTokenWarning] = useState<{status: string, message: string, needs_reconnect: boolean, days_left?: number} | null>(null);
  const [trialInfo, setTrialInfo] = useState<{status: string, trial_ends_at: number, days_left: number} | null>(null);
  // E-7: estado del impersonate (banner rojo cuando hay ticket activo)
  const [impersonateInfo, setImpersonateInfo] = useState<{tenant_id: string, brand_name: string, mode: string, expires_at: number, admin_email: string} | null>(null);
  // E-9: modal de pedir escritura
  const [showSupportModal, setShowSupportModal] = useState(false);
  useEffect(() => {
    // Leer ticket impersonate del localStorage al cargar
    try {
      const ticket = localStorage.getItem('cb_impersonate_ticket');
      const infoRaw = localStorage.getItem('cb_impersonate_info');
      if (ticket && infoRaw) {
        const info = JSON.parse(infoRaw);
        // Verificar que no haya expirado
        if (info.expires_at && info.expires_at * 1000 > Date.now()) {
          setImpersonateInfo(info);
        } else {
          localStorage.removeItem('cb_impersonate_ticket');
          localStorage.removeItem('cb_impersonate_info');
        }
      }
    } catch {}
  }, []);
  // E-12.A: Auto-poll del ticket cada 30s mientras estamos en read_only
  // Detecta si el cliente aprobo escritura y actualiza localStorage automaticamente
  useEffect(() => {
    if (!impersonateInfo || impersonateInfo.mode !== 'read_only') return;
    const checkUpgrade = async () => {
      try {
        const res = await fetch(`${API_URL}/support/my-tickets`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.has_active_ticket && data.rw_ticket && data.mode === 'read_write') {
          // Cliente aprobo — actualizar localStorage + recargar
          localStorage.setItem('cb_impersonate_ticket', data.rw_ticket);
          const newInfo = {
            ...impersonateInfo,
            mode: 'read_write',
            expires_at: data.rw_expires_at,
          };
          localStorage.setItem('cb_impersonate_info', JSON.stringify(newInfo));
          // Notificar al usuario antes de recargar
          alert('✅ El cliente aprobó tu solicitud. Ahora tienes escritura por 30 minutos. La página se recargará.');
          location.reload();
        }
      } catch {
        // Silencioso — el poll vuelve a intentar en 30s
      }
    };
    // Primera verificación a los 5s (no esperamos 30s en el primer ciclo)
    const firstCheck = setTimeout(checkUpgrade, 5000);
    const interval = setInterval(checkUpgrade, 30000);
    return () => {
      clearTimeout(firstCheck);
      clearInterval(interval);
    };
  }, [impersonateInfo]);
  const exitImpersonate = async () => {
    if (!impersonateInfo) return;
    if (!confirm(`Salir del modo impersonate de "${impersonateInfo.brand_name}"?`)) return;
    // E-12.C: si estaba en read_write, avisar al backend para cerrar sesion + email resumen
    if (impersonateInfo.mode === 'read_write') {
      try {
        await fetch(`${API_URL}/support/exit`, { method: 'POST' });
      } catch {
        // Silencioso — no bloqueamos el exit por un fallo de red
      }
    }
    localStorage.removeItem('cb_impersonate_ticket');
    localStorage.removeItem('cb_impersonate_info');
    setImpersonateInfo(null);
    router.push(`/admin/tenants/${encodeURIComponent(impersonateInfo.tenant_id)}`);
  };
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
    if (user?.companyId) {
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
      // Verificar estado del token Meta (1 vez por sesion)
      if (!sessionStorage.getItem('cb_token_checked')) {
        fetch(`${API_URL}/meta/token-status`, { headers: { 'client-id': user.companyId } })
          .then(res => res.json())
          .then(data => {
            if (data.needs_reconnect || data.status === 'expired' || data.status === 'unknown') {
              setTokenWarning(data);
            } else if (data.days_left && data.days_left <= 7) {
              setTokenWarning(data);
            }
             sessionStorage.setItem('cb_token_checked', '1');
          })
          .catch(() => {});
      }
      // Banner trial: leer estado de suscripción
      fetch(`${API_URL}/billing/me`, { headers: { 'client-id': user.companyId } })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'trialing' && data.trial_ends_at) {
            const trialEnds = typeof data.trial_ends_at === 'number'
              ? data.trial_ends_at
              : Math.floor(new Date(data.trial_ends_at).getTime() / 1000);
            const daysLeft = Math.max(0, Math.ceil((trialEnds - Date.now() / 1000) / 86400));
            setTrialInfo({ status: 'trialing', trial_ends_at: trialEnds, days_left: daysLeft });
          } else if (data.status === 'trial_expired') {
            setTrialInfo({ status: 'trial_expired', trial_ends_at: 0, days_left: 0 });
          }
        })
        .catch(() => {});
      // Contar chats que necesitan atencion        
      fetch(`${API_URL}/conversations/active`, { headers: { 'client-id': user.companyId } })
        .then(res => res.json())
        .then(data => {
          const convs = data.conversations || [];
          const paused = convs.filter((c: any) => c.flow_state === 'PAUSED_FOR_HUMAN').length;
          setUnreadChats(paused);
        })
        .catch(() => {});
    }
    const interval = setInterval(() => {
      if (user?.companyId) {
        fetch(`${API_URL}/leads/reminders`, { headers: { 'client-id': user.companyId } })
          .then(res => res.json())
          .then(data => setReminders(data.reminders || []))
          .catch(() => {});
        fetch(`${API_URL}/conversations/active`, { headers: { 'client-id': user.companyId } })
          .then(res => res.json())
          .then(data => {
            const convs = data.conversations || [];
            const paused = convs.filter((c: any) => c.flow_state === 'PAUSED_FOR_HUMAN').length;
            setUnreadChats(paused);
          })
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
          <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
        </div>
        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.filter(item => !user?.role || item.roles.includes(user.role)).map((item) => (
            <Link
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
              {item.href === '/dashboard/chat' && unreadChats > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadChats > 9 ? '9+' : unreadChats}
                </span>
              )}
            </Link>
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
                <img src="/cb-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold tracking-tighter">clientes.bot</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {menuItems.filter(item => !user?.role || item.roles.includes(user.role)).map((item) => (
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
                  {item.href === '/dashboard/chat' && unreadChats > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadChats > 9 ? '9+' : unreadChats}
                    </span>
                  )}
                </Link>
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
      <div className="flex-1 md:ml-64 overflow-x-hidden w-full max-w-full">
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
                        <Link href="/dashboard/crm" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">
                          Ver todos en CRM →
                        </Link>
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
        {/* Banner E-7: impersonate (super admin viendo dashboard del cliente) */}
        {impersonateInfo && (
          <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 border-b-2 border-red-400 flex items-center justify-between gap-3 sticky top-16 z-10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl shrink-0">👁</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Viendo como <span className="bg-white/20 px-2 py-0.5 rounded">{impersonateInfo.brand_name}</span>
                  <span className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-widest">
                    {impersonateInfo.mode === 'read_only' ? '🔒 Solo lectura' : '✏️ Escritura'}
                  </span>
                </p>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Super admin: <span className="font-mono">{impersonateInfo.admin_email}</span>
                  {' · '}
                  Expira en {Math.max(0, Math.ceil((impersonateInfo.expires_at - Date.now() / 1000) / 60))} min
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(true)}
              disabled={impersonateInfo.mode !== 'read_only'}
              className="text-xs px-4 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 font-bold rounded-lg whitespace-nowrap shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={impersonateInfo.mode === 'read_only' ? 'Solicitar acceso de escritura al cliente' : 'Ya tienes escritura'}
            >
              {impersonateInfo.mode === 'read_only' ? '✏️ Pedir escritura' : '✏️ Escritura activa'}
            </button>
            <button
              onClick={exitImpersonate}
              className="text-xs px-4 py-2 bg-white text-red-600 hover:bg-red-50 font-bold rounded-lg whitespace-nowrap shrink-0 transition-all"
            >
              Salir
            </button>
          </div>
        )}
        {/* Modal E-9: Pedir escritura */}
        {showSupportModal && impersonateInfo && (
          <SupportRequestModal
            tenantId={impersonateInfo.tenant_id}
            brandName={impersonateInfo.brand_name}
            onClose={() => setShowSupportModal(false)}
          />
        )}
        {/* Banner de token Meta expirado */}
        {tokenWarning && (
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 ${
            tokenWarning.status === 'expired' || tokenWarning.needs_reconnect
              ? 'bg-red-500/10 border-b border-red-500/20'
              : 'bg-yellow-500/10 border-b border-yellow-500/20'
          }`}>
            <p className={`text-xs font-medium flex-1 ${
              tokenWarning.status === 'expired' || tokenWarning.needs_reconnect
                ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {tokenWarning.status === 'expired' || tokenWarning.needs_reconnect
                ? '🔴 Tu conexión con WhatsApp expiró. El bot no puede responder mensajes.'
                : `⚠️ Tu conexión con WhatsApp expira en ${tokenWarning.days_left} días.`
              }
            </p>
            <Link href="/dashboard/whatsapp"
              className={`text-[10px] px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                tokenWarning.status === 'expired' || tokenWarning.needs_reconnect
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
              }`}>
              {tokenWarning.needs_reconnect ? 'Reconectar ahora' : 'Renovar conexión'}
            </Link>
            <button onClick={() => setTokenWarning(null)}
              className="text-gray-500 hover:text-white text-sm shrink-0">✕</button>
          </div>
        )}
        {/* Banner de trial 14 días */}
        {trialInfo && (
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 ${
            trialInfo.status === 'trial_expired'
              ? 'bg-red-500/10 border-b border-red-500/20'
              : trialInfo.days_left <= 3
                ? 'bg-orange-500/10 border-b border-orange-500/20'
                : 'bg-indigo-500/10 border-b border-indigo-500/20'
          }`}>
            <p className={`text-xs font-medium flex-1 ${
              trialInfo.status === 'trial_expired'
                ? 'text-red-400'
                : trialInfo.days_left <= 3
                  ? 'text-orange-400'
                  : 'text-indigo-400'
            }`}>
              {trialInfo.status === 'trial_expired'
                ? '🔴 Tu prueba gratuita expiró. Activa un plan para seguir usando clientes.bot.'
                : trialInfo.days_left === 0
                  ? '⏰ Tu prueba expira hoy — activa tu plan ahora.'
                  : trialInfo.days_left <= 3
                    ? `⏰ Te quedan ${trialInfo.days_left} día${trialInfo.days_left === 1 ? '' : 's'} de prueba — activa tu plan.`
                    : `🎁 Estás en prueba gratuita: ${trialInfo.days_left} días restantes.`
              }
            </p>
            <Link href="/dashboard/billing"
              className={`text-[10px] px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                trialInfo.status === 'trial_expired'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : trialInfo.days_left <= 3
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400'
              }`}>
              {trialInfo.status === 'trial_expired' ? 'Activar plan' : 'Ver planes'}
            </Link>
          </div>
        )}
        {/* Page Content */}
         <main className="p-3 md:p-6 overflow-x-hidden">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
         {user?.companyId && (
          <>
            <AgentChat companyId={user.companyId} />
            <PushSetup />
            <InstallPWAPrompt variant="dashboard" />
          </>
        )}
      </div>
    </div>
  );
}
// ============================================================
// E-9: Modal "Pedir escritura" desde modo impersonate
// ============================================================
function SupportRequestModal({ tenantId, brandName, onClose }: any) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; request_id?: string } | null>(null);
  const submit = async () => {
    if (reason.trim().length < 10) {
      alert('La razón debe tener al menos 10 caracteres. El cliente la va a leer — sé claro.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/support/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: data.message || 'Solicitud enviada', request_id: data.request_id });
      } else {
        setResult({ ok: false, message: data.error || `Error ${res.status}` });
      }
    } catch (e: any) {
      setResult({ ok: false, message: e.message || 'Error de conexión' });
    }
    setSubmitting(false);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="bg-[#0B0F1A] border border-yellow-500/30 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {result?.ok ? (
          <>
            <h3 className="text-lg font-bold text-emerald-400 mb-2">✓ Solicitud enviada</h3>
            <p className="text-xs text-gray-400 mb-4">{result.message}</p>
            <p className="text-[10px] text-gray-500 mb-4">
              El cliente recibirá un email con un link para aprobar o denegar tu solicitud.
              Cuando apruebe, recargá la página para que el banner se actualice a modo escritura.
            </p>
            <button onClick={onClose} className="w-full text-xs px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg">
              Cerrar
            </button>
          </>
        ) : result && !result.ok ? (
          <>
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠ Error</h3>
            <p className="text-xs text-gray-300 mb-4">{result.message}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setResult(null)} className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg">
                Reintentar
              </button>
              <button onClick={onClose} className="text-xs px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg">
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-1">✏️ Pedir escritura</h3>
            <p className="text-xs text-gray-500 mb-4">
              Cliente: <span className="text-indigo-400 font-bold">{brandName}</span>
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-[11px] text-yellow-300">
                ⚠ El cliente recibirá un email con tu solicitud. Si aprueba, tendrás <strong>escritura por 30 minutos</strong>.
                Toda acción queda registrada en auditoría.
              </p>
            </div>
            <label className="block text-xs text-gray-400 font-semibold mb-1">
              Razón del soporte <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Cliente reportó que no le aparecen los leads del último día. Necesito ajustar el filtro de fecha del CRM."
              maxLength={500}
              rows={4}
              disabled={submitting}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500 mb-2 resize-none"
            />
            <p className="text-[10px] text-gray-600 text-right mb-4">
              {reason.length}/500 caracteres · El cliente lo va a leer
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} disabled={submitting} className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg disabled:opacity-50">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={submitting || reason.trim().length < 10}
                className="text-xs px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}