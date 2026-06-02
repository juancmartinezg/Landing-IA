'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface PermissionInfo {
  [key: string]: string;
}
interface Category {
  label: string;
  permissions: PermissionInfo;
}
interface Catalog {
  [key: string]: Category;
}
interface Preset {
  name: string;
  description: string;
  permissions: { [key: string]: boolean };
}
interface Presets {
  [key: string]: Preset;
}
export default function PermissionsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const [catalog, setCatalog] = useState<Catalog>({});
  const [presets, setPresets] = useState<Presets>({});
  const [agent, setAgent] = useState<any>(null);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [customRoleName, setCustomRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const h = { 'client-id': user?.companyId || '' };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/agents/permissions-catalog`, { headers: h }).then((r: any) => r.json()),
      fetch(`${API_URL}/agents/permission-presets`, { headers: h }).then((r: any) => r.json()),
      fetch(`${API_URL}/agents/${agentId}/permissions`, { headers: h }).then((r: any) => r.json()),
    ]).then(([cat, pre, ag]: any) => {
      setCatalog(cat.catalog || {});
      setPresets(pre.presets || {});
      setAgent(ag);
      setPermissions(ag.permissions_effective || {});
      setCustomRoleName(ag.custom_role_name || '');
      setLoading(false);
    }).catch(() => {
      showToast('❌ Error cargando permisos');
      setLoading(false);
    });
  }, [agentId]);
  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const applyPreset = (presetKey: string) => {
    const preset = presets[presetKey];
    if (!preset) return;
    // Construir permisos completos: catálogo entero, con preset marcando lo que SÍ
    const all: { [key: string]: boolean } = {};
    Object.values(catalog).forEach(cat => {
      Object.keys(cat.permissions).forEach(key => {
        all[key] = !!preset.permissions[key];
      });
    });
    setPermissions(all);
    setCustomRoleName(preset.name);
    showToast(`✅ Preset "${preset.name}" aplicado (no olvides guardar)`);
  };
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/agents/${agentId}/permissions`, {
        method: 'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions, custom_role_name: customRoleName }),
      });
      const d = await res.json();
      if (res.ok) {
        showToast('✅ Permisos actualizados');
        setTimeout(() => router.push('/dashboard/agents'), 1500);
      } else {
        showToast(d.error || 'Error guardando');
      }
    } catch {
      showToast('❌ Error de conexión');
    }
    setSaving(false);
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando permisos...</div>;
  if (!agent) return <div className="text-center py-12 text-red-400">Agente no encontrado</div>;
  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = Object.values(catalog).reduce((sum, cat) => sum + Object.keys(cat.permissions).length, 0);
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
      <div className="mb-6">
        <Link href="/dashboard/agents" className="text-xs text-gray-500 hover:text-white">← Volver a agentes</Link>
        <h1 className="text-2xl font-bold mt-2">🔒 Permisos de {agent.name}</h1>
        <p className="text-xs text-gray-500 mt-1">
          {agent.email} • Rol base: <span className="text-indigo-400 font-bold">{agent.role}</span>
        </p>
        <p className="text-xs text-purple-400 mt-1">
          {enabledCount} de {totalCount} permisos habilitados
        </p>
      </div>
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-bold mb-3">⚡ Aplicar preset rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="text-left bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl p-3 transition-all"
            >
              <p className="text-sm font-bold">{preset.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="text-xs text-gray-400 mb-1 block">Nombre personalizado del rol (opcional)</label>
        <input
          value={customRoleName}
          onChange={(e: any) => setCustomRoleName(e.target.value)}
          placeholder="Ej: Asesor de Ventas Senior"
          maxLength={50}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white"
        />
      </div>
      <div className="space-y-4">
        {Object.entries(catalog).map(([catKey, category]) => (
          <div key={catKey} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3">{category.label}</h3>
            <div className="space-y-2">
              {Object.entries(category.permissions).map(([permKey, permLabel]) => (
                <label key={permKey} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all">
                  <input
                    type="checkbox"
                    checked={!!permissions[permKey]}
                    onChange={() => togglePermission(permKey)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-purple-500"
                  />
                  <span className="text-xs flex-1">{permLabel}</span>
                  <code className="text-[9px] text-gray-600 font-mono">{permKey}</code>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-4 mt-6 bg-[#1a1f2e]/95 backdrop-blur border border-white/10 rounded-2xl p-4 flex gap-2">
        <Link href="/dashboard/agents" className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold text-center hover:bg-white/5 transition-all">
          Cancelar
        </Link>
         <button
          onClick={save}
          disabled={saving}
          className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar permisos'}
        </button>
      </div>
    </div>
  );
}