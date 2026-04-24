'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'agent' });
  const [saving, setSaving] = useState(false);
  const h = { 'client-id': user?.companyId || '' };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const load = () => {
    fetch(`${API_URL}/agents`, { headers: h })
      .then((r: any) => r.json())
      .then((d: any) => { setAgents(d.agents || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', role: 'agent' });
    setShowForm(true);
  };
  const openEdit = (a: any) => {
    setEditing(a);
    setForm({ name: a.name || '', email: a.email || '', phone: a.phone || '', role: a.role || 'agent' });
    setShowForm(true);
  };
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { showToast('Nombre y email son requeridos'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`${API_URL}/agents`, {
          method: 'PUT',
          headers: { ...h, 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: editing.agent_id, name: form.name, phone: form.phone, role: form.role }),
        });
        const d = await res.json();
        if (res.ok) { showToast('✅ Agente actualizado'); setShowForm(false); load(); }
        else showToast(d.error || 'Error');
      } else {
        const res = await fetch(`${API_URL}/agents`, {
          method: 'POST',
          headers: { ...h, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const d = await res.json();
        if (res.ok) { showToast('✅ Agente creado'); setShowForm(false); load(); }
        else showToast(d.error || 'Error');
      }
    } catch { showToast('Error de conexión'); }
    setSaving(false);
  };
  const toggleActive = async (a: any) => {
    try {
      await fetch(`${API_URL}/agents`, {
        method: 'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: a.agent_id, active: !a.active }),
      });
      showToast(a.active ? 'Agente desactivado' : 'Agente activado');
      load();
    } catch { showToast('Error'); }
  };
  const handleDelete = async (a: any) => {
    if (!confirm(`¿Eliminar a ${a.name}? Sus leads asignados quedarán sin agente.`)) return;
    try {
      const res = await fetch(`${API_URL}/agents?agent_id=${encodeURIComponent(a.agent_id)}`, {
        method: 'DELETE', headers: h,
      });
      if (res.ok) { showToast('Agente eliminado'); load(); }
      else showToast('Error');
    } catch { showToast('Error de conexión'); }
  };
  const roleLabel = (r: string) => {
    const m: any = { owner: '👑 Dueño', admin: '🛡️ Admin', agent: '💼 Asesor', viewer: '👁️ Solo lectura' };
    return m[r] || r;
  };
  const roleBadgeClass = (r: string) => {
    const m: any = {
      owner: 'bg-yellow-500/20 text-yellow-400',
      admin: 'bg-indigo-500/20 text-indigo-400',
      agent: 'bg-emerald-500/20 text-emerald-400',
      viewer: 'bg-gray-500/20 text-gray-400',
    };
    return m[r] || 'bg-gray-500/20 text-gray-400';
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mi equipo 👥</h1>
          <p className="text-xs text-gray-500 mt-1">Gestiona los asesores que atienden a tus clientes</p>
        </div>
        <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          + Nuevo agente
        </button>
      </div>
      {agents.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">👥</p>
          <h2 className="text-xl font-bold mb-2">Aún no tienes agentes</h2>
          <p className="text-gray-400 text-sm mb-6">Agrega asesores para distribuir los leads y dar mejor atención.</p>
          <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-sm font-bold transition-all">
            + Agregar primer agente
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map((a, i) => (
            <div key={i} className={`bg-white/[0.03] border border-white/5 rounded-xl p-4 ${!a.active ? 'opacity-50' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                    {(a.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm truncate">{a.name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${roleBadgeClass(a.role)}`}>
                        {roleLabel(a.role)}
                      </span>
                      {!a.active && <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">Inactivo</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{a.email} {a.phone && `• ${a.phone}`}</p>
                    <p className="text-[10px] text-gray-600">{a.assigned_leads || 0} leads asignados</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleActive(a)} className={`text-[9px] px-2 py-1 rounded-lg font-bold transition-all ${a.active ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                    {a.active ? '⏸ Desactivar' : '▶ Activar'}
                  </button>
                  <button onClick={() => openEdit(a)} className="text-[9px] px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-bold transition-all">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(a)} className="text-[9px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e: any) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Editar agente' : 'Nuevo agente'}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre *</label>
                <input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Juan Pérez"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                <input value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} type="email" placeholder="juan@empresa.com" disabled={!!editing}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white disabled:opacity-50" />
                {editing && <p className="text-[9px] text-gray-600 mt-1">El email no se puede cambiar</p>}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Teléfono</label>
                <input value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} placeholder="3001234567"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Rol</label>
                <select value={form.role} onChange={(e: any) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="agent">💼 Asesor — Atiende leads asignados</option>
                  <option value="admin">🛡️ Admin — Gestiona el equipo y ve todo</option>
                  <option value="viewer">👁️ Solo lectura — Solo ve, no edita</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 py-2.5 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {saving ? '⏳...' : editing ? 'Guardar' : 'Crear agente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}