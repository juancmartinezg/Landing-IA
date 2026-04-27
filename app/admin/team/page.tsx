'use client';
import { useAuth } from '../../providers';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface Admin {
  email: string;
  name: string;
  role: 'super_admin' | 'support' | 'billing';
  active: boolean;
  created_at: number;
  created_by?: string;
  last_login?: number;
  deleted_at?: number;
}
const ROLE_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  super_admin: { label: 'Super Admin', emoji: '🦁', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  support: { label: 'Soporte', emoji: '🛟', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  billing: { label: 'Billing', emoji: '💰', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};
const ROLE_DESCRIPTIONS: Record<string, string> = {
  super_admin: 'Acceso total: tenants, equipo, configuración, killswitch.',
  support: 'Solo lectura de tenants + asistir clientes con consentimiento.',
  billing: 'Pagos, suscripciones, refunds, MRR/ARR.',
};
export default function AdminTeamPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  // Fetch list
  const fetchAdmins = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/team`, {
        headers: {
          'client-id': user.sub || user.email,
          'x-user-email': user.email,
        },
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setError(e.error || `Error ${res.status}`);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setAdmins(json.admins || []);
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };
  // Create admin
  const handleCreate = async (data: { email: string; name: string; role: string }) => {
    try {
      const res = await fetch(`${API_URL}/admin/team`, {
        method: 'POST',
        headers: {
          'client-id': user?.sub || user?.email || '',
          'x-user-email': user?.email || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || `Error ${res.status}`, 'err');
        return;
      }
      const emailMsg = json.email_sent ? ' · 📧 Email enviado' : ' (email no se pudo enviar)';
      showToast(`Admin creado${emailMsg}`, 'ok');
      setShowCreate(false);
      fetchAdmins();
    } catch (e: any) {
      showToast(e.message || 'Error de conexión', 'err');
    }
  };
  // Update admin (name / role / active)
  const handleUpdate = async (changes: Partial<Admin>) => {
    if (!editing?.email) return;
    try {
      const res = await fetch(`${API_URL}/admin/team`, {
        method: 'PUT',
        headers: {
          'client-id': user?.sub || user?.email || '',
          'x-user-email': user?.email || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: editing.email, ...changes }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || `Error ${res.status}`, 'err');
        return;
      }
      showToast('Admin actualizado', 'ok');
      setEditing(null);
      fetchAdmins();
    } catch (e: any) {
      showToast(e.message || 'Error de conexión', 'err');
    }
  };
  // Soft delete
  const handleDelete = async (target: Admin) => {
    if (!confirm(`¿Desactivar a ${target.name} (${target.email})?\n\nNo podrá volver a ingresar hasta que lo reactives.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/team?email=${encodeURIComponent(target.email)}`, {
        method: 'DELETE',
        headers: {
          'client-id': user?.sub || user?.email || '',
          'x-user-email': user?.email || '',
        },
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || `Error ${res.status}`, 'err');
        return;
      }
      showToast('Admin desactivado', 'ok');
      fetchAdmins();
    } catch (e: any) {
      showToast(e.message || 'Error de conexión', 'err');
    }
  };
  // Reactivar (1 click)
  const handleReactivate = async (target: Admin) => {
    if (!confirm(`¿Reactivar a ${target.name} (${target.email})?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/team`, {
        method: 'PUT',
        headers: {
          'client-id': user?.sub || user?.email || '',
          'x-user-email': user?.email || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: target.email, active: true }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || `Error ${res.status}`, 'err');
        return;
      }
      showToast('Admin reactivado', 'ok');
      fetchAdmins();
    } catch (e: any) {
      showToast(e.message || 'Error de conexión', 'err');
    }
  };
  // Filtros
  const filteredAdmins = admins.filter(a => {
    if (filter === 'active') return a.active;
    if (filter === 'inactive') return !a.active;
    return true;
  });
  const formatDate = (ts?: number) => {
    if (!ts || ts === 0) return '—';
    return new Date(ts * 1000).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: '2-digit',
    });
  };
  const formatRelative = (ts?: number) => {
    if (!ts || ts === 0) return 'Nunca';
    const diff = Math.floor(Date.now() / 1000 - ts);
    if (diff < 60) return 'Hace segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
  };
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium ${
          toast.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'ok' ? '✅' : '⚠️'} {toast.msg}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Equipo de la plataforma</h1>
          <p className="text-xs text-gray-500 mt-1">
            Admins con acceso a `/admin/*`. Cada cambio queda en auditoría.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="text-sm px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          ➕ Agregar admin
        </button>
      </div>
      {/* Filtros */}
      <div className="flex gap-2">
        {(['active', 'all', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.03] text-gray-500 border border-white/5 hover:text-white'
            }`}
          >
            {f === 'active' ? `✅ Activos (${admins.filter(a => a.active).length})` :
             f === 'inactive' ? `🚫 Inactivos (${admins.filter(a => !a.active).length})` :
             `📋 Todos (${admins.length})`}
          </button>
        ))}
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
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Admin</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Rol</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Estado</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Creado</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Última conexión</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-xs text-gray-500">
                  Sin admins en este filtro
                </td></tr>
              ) : (
                filteredAdmins.map(a => {
                  const meta = ROLE_META[a.role] || ROLE_META.support;
                  const isMe = a.email === user?.email;
                  return (
                    <tr key={a.email} className={`border-b border-white/[0.03] hover:bg-white/[0.02] ${!a.active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white font-medium">{a.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {a.email}
                          {isMe && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">TÚ</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold border ${meta.bg} ${meta.color}`}>
                          {meta.emoji} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.active ? (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-widest">Activo</span>
                        ) : (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-500/10 text-gray-500 font-bold uppercase tracking-widest">Inactivo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(a.created_at)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatRelative(a.last_login)}</td>
                      <td className="px-4 py-3 text-right">
                        {a.active ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditing(a)}
                              className="text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            {!isMe && (
                              <button
                                onClick={() => handleDelete(a)}
                                className="text-xs px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                                title="Desactivar"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReactivate(a)}
                            className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold transition-all"
                            title="Reactivar"
                          >
                            🔄 Reactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Crear */}
      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
      {/* Modal Editar */}
      {editing && (
        <EditAdminModal
          admin={editing}
          isMe={editing.email === user?.email}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
// ===== Modales =====
function CreateAdminModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: { email: string; name: string; role: string }) => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('support');
  const [submitting, setSubmitting] = useState(false);
  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) && name.trim().length >= 2;
  const submit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    await onSubmit({ email: email.trim().toLowerCase(), name: name.trim(), role });
    setSubmitting(false);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0B0F1A] border border-white/10 rounded-3xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-1">Agregar admin</h2>
        <p className="text-xs text-gray-500 mb-5">Se enviará email de bienvenida automáticamente.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Nombre *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Rol *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
            >
              <option value="support">🛟 Soporte</option>
              <option value="billing">💰 Billing</option>
              <option value="super_admin">🦁 Super Admin</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">{ROLE_DESCRIPTIONS[role]}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
           className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold disabled:opacity-30 transition-all"
          >
            {submitting ? '⏳ Creando...' : '✅ Crear admin'}
          </button>
        </div>
      </div>
    </div>
  );
}
function EditAdminModal({ admin, isMe, onClose, onSubmit }: {
  admin: Admin;
  isMe: boolean;
  onClose: () => void;
  onSubmit: (changes: Partial<Admin>) => void;
}) {
  const [name, setName] = useState(admin.name);
  const [role, setRole] = useState<'super_admin' | 'support' | 'billing'>(admin.role);
  const [submitting, setSubmitting] = useState(false);
  const hasChanges = name.trim() !== admin.name || role !== admin.role;
  const isValid = name.trim().length >= 2;
  const submit = async () => {
    if (!hasChanges || !isValid) return;
    setSubmitting(true);
    const changes: Partial<Admin> = {};
    if (name.trim() !== admin.name) changes.name = name.trim();
    if (role !== admin.role) changes.role = role;
    await onSubmit(changes);
    setSubmitting(false);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0B0F1A] border border-white/10 rounded-3xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-1">Editar admin</h2>
        <p className="text-xs text-gray-500 mb-1 font-mono">{admin.email}</p>
        {isMe && (
          <p className="text-[10px] text-yellow-400 mb-3">
            ⚠️ Eres tú. No puedes degradarte ni desactivarte como super_admin único.
          </p>
        )}
        <div className="space-y-3 mt-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
            >
              <option value="support">🛟 Soporte</option>
              <option value="billing">💰 Billing</option>
              <option value="super_admin">🦁 Super Admin</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">{ROLE_DESCRIPTIONS[role]}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={!hasChanges || !isValid || submitting}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold disabled:opacity-30 transition-all"
          >
            {submitting ? '⏳ Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}