'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface FeatureUI {
  label: string;
  included: boolean;
  tooltip_title: string;
  tooltip_desc: string;
}
interface Plan {
  key: string;
  name: string;
  subtitle?: string;
  price_usd: number;
  price_cop: number;
  price_annual: number;
  popular: boolean;
  btn_label: string;
  btn_href_type: 'checkout' | 'whatsapp';
  btn_href_whatsapp?: string;
  color_theme: string;
  hidden_in_landing?: boolean;
  features?: Record<string, any>;
  quotas: {
    messages_whatsapp: number;
    leads_total: number;
    agents_active: number;
    voice_minutes: number;
    subaccounts: number;
  };
  features_ui: FeatureUI[];
}
const PLAN_KEYS = ['starter', 'growth', 'agency', 'enterprise'];
const PLAN_ICONS: Record<string, string> = {
  starter: '🚀', growth: '⭐', agency: '🦁', enterprise: '🏢',
};
const COLOR_THEMES = ['indigo', 'indigo_popular', 'amber', 'slate'];
export default function AdminPlanFeaturesPage() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<Record<string, Plan>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('starter');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/admin/plan-features`, {
      headers: { 'x-user-email': user.email },
    })
      .then(r => r.json())
      .then(data => {
        if (data.catalog) setCatalog(data.catalog);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);
  const updatePlan = (planKey: string, updates: Partial<Plan>) => {
    setCatalog(prev => ({
      ...prev,
      [planKey]: { ...prev[planKey], ...updates },
    }));
  };
  const updateQuota = (planKey: string, quotaKey: keyof Plan['quotas'], value: number) => {
    setCatalog(prev => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        quotas: { ...prev[planKey].quotas, [quotaKey]: value },
      },
    }));
  };
  const updateFeatureUI = (planKey: string, idx: number, updates: Partial<FeatureUI>) => {
    setCatalog(prev => {
      const plan = prev[planKey];
      const newFeatures = [...plan.features_ui];
      newFeatures[idx] = { ...newFeatures[idx], ...updates };
      return { ...prev, [planKey]: { ...plan, features_ui: newFeatures } };
    });
  };
  const addFeatureUI = (planKey: string) => {
    setCatalog(prev => {
      const plan = prev[planKey];
      return {
        ...prev,
        [planKey]: {
          ...plan,
          features_ui: [
            ...plan.features_ui,
            { label: 'Nueva feature', included: true, tooltip_title: '', tooltip_desc: '' },
          ],
        },
      };
    });
  };
  const removeFeatureUI = (planKey: string, idx: number) => {
    if (!confirm('¿Eliminar esta feature?')) return;
    setCatalog(prev => {
      const plan = prev[planKey];
      return {
        ...prev,
        [planKey]: {
          ...plan,
          features_ui: plan.features_ui.filter((_, i) => i !== idx),
        },
      };
    });
  };
  const moveFeature = (planKey: string, idx: number, dir: -1 | 1) => {
    setCatalog(prev => {
      const plan = prev[planKey];
      const newF = [...plan.features_ui];
      const target = idx + dir;
      if (target < 0 || target >= newF.length) return prev;
      [newF[idx], newF[target]] = [newF[target], newF[idx]];
      return { ...prev, [planKey]: { ...plan, features_ui: newF } };
    });
  };
  const handleSave = async () => {
    if (!user?.email) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/admin/plan-features`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify({ catalog }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'ok', text: '✅ Guardado. Cambios visibles en ~5 minutos (o invalida cache)' });
      } else {
        setMsg({ type: 'err', text: `❌ ${data.error || 'Error al guardar'}` });
      }
    } catch (e: any) {
      setMsg({ type: 'err', text: `❌ ${e.message || 'Error de conexión'}` });
    }
    setSaving(false);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const planKeys = Object.keys(catalog);
  const activePlan = catalog[activeTab];
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">📋 Editor de Planes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Edita los planes mostrados en landing y dashboard. Cambios se propagan en ~5min.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="text-xs px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl">
            ← Volver al admin
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold disabled:opacity-50">
            {saving ? '💾 Guardando...' : '💾 Guardar todos los planes'}
          </button>
        </div>
      </div>
      {msg && (
        <div className={`rounded-xl p-3 text-sm ${
          msg.type === 'ok' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {msg.text}
        </div>
      )}
      {/* Tabs por plan */}
      <div className="flex gap-2 border-b border-white/5 overflow-x-auto">
        {planKeys.map(k => (
          <button
            key={k}
            onClick={() => setActiveTab(k)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === k
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            {PLAN_ICONS[k] || '📦'} {catalog[k]?.name || k}
            {catalog[k]?.popular && <span className="ml-1 text-[9px] text-emerald-400">⭐</span>}
          </button>
        ))}
      </div>
      {!activePlan ? (
        <p className="text-gray-500">Plan no encontrado.</p>
      ) : (
        <div className="space-y-6">
          {/* Datos generales */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Datos generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre" value={activePlan.name}
                onChange={v => updatePlan(activeTab, { name: v })} />
              <Field label="Subtítulo" value={activePlan.subtitle || ''}
                onChange={v => updatePlan(activeTab, { subtitle: v })} />
              <FieldNum label="Precio mensual USD" value={activePlan.price_usd}
                onChange={v => updatePlan(activeTab, { price_usd: v })} />
              <FieldNum label="Precio mensual COP" value={activePlan.price_cop}
                onChange={v => updatePlan(activeTab, { price_cop: v })} />
              <FieldNum label="Precio anual USD" value={activePlan.price_annual}
                onChange={v => updatePlan(activeTab, { price_annual: v })} />
              <Field label="Botón texto" value={activePlan.btn_label}
                onChange={v => updatePlan(activeTab, { btn_label: v })} />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo de botón</label>
                <select value={activePlan.btn_href_type}
                  onChange={e => updatePlan(activeTab, { btn_href_type: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="checkout">Checkout (signup → pago)</option>
                  <option value="whatsapp">WhatsApp (link directo)</option>
                </select>
              </div>
              {activePlan.btn_href_type === 'whatsapp' && (
                <Field label="URL WhatsApp" value={activePlan.btn_href_whatsapp || ''}
                  onChange={v => updatePlan(activeTab, { btn_href_whatsapp: v })} />
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color tema</label>
                <select value={activePlan.color_theme}
                  onChange={e => updatePlan(activeTab, { color_theme: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  {COLOR_THEMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Flags */}
            <div className="flex gap-6 flex-wrap pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={activePlan.popular}
                  onChange={e => updatePlan(activeTab, { popular: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500" />
                <span className="text-sm">⭐ Marcar como "Más popular"</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={activePlan.hidden_in_landing || false}
                  onChange={e => updatePlan(activeTab, { hidden_in_landing: e.target.checked })}
                  className="w-4 h-4 accent-red-500" />
                <span className="text-sm">🙈 Ocultar en landing</span>
              </label>
            </div>
          </div>
          {/* Quotas */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Quotas</h2>
              <span className="text-[10px] text-gray-500">Usa -1 para ilimitado</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FieldNum label="💬 Mensajes WhatsApp" value={activePlan.quotas.messages_whatsapp}
                onChange={v => updateQuota(activeTab, 'messages_whatsapp', v)} />
              <FieldNum label="👥 Leads CRM" value={activePlan.quotas.leads_total}
                onChange={v => updateQuota(activeTab, 'leads_total', v)} />
              <FieldNum label="🧑‍💼 Agentes" value={activePlan.quotas.agents_active}
                onChange={v => updateQuota(activeTab, 'agents_active', v)} />
              <FieldNum label="🎙️ Voz IA min/mes" value={activePlan.quotas.voice_minutes}
                onChange={v => updateQuota(activeTab, 'voice_minutes', v)} />
              <FieldNum label="🏢 Sub-cuentas" value={activePlan.quotas.subaccounts}
                onChange={v => updateQuota(activeTab, 'subaccounts', v)} />
            </div>
          </div>
          {/* Features UI (lista editable) */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Features visibles en cards ({activePlan.features_ui.length})
              </h2>
              <button onClick={() => addFeatureUI(activeTab)}
                className="text-xs px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold">
                + Agregar feature
              </button>
            </div>
            <div className="space-y-3">
              {activePlan.features_ui.map((f, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-mono w-6 shrink-0">#{idx + 1}</span>
                    <input value={f.label}
                      onChange={e => updateFeatureUI(activeTab, idx, { label: e.target.value })}
                      placeholder="Texto de la feature..."
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                    <label className="flex items-center gap-1 cursor-pointer shrink-0">
                      <input type="checkbox" checked={f.included}
                        onChange={e => updateFeatureUI(activeTab, idx, { included: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500" />
                      <span className="text-[10px] text-gray-400">Incluido</span>
                    </label>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => moveFeature(activeTab, idx, -1)}
                        disabled={idx === 0}
                        className="text-xs px-2 py-1 hover:bg-white/5 rounded disabled:opacity-30">
                        ↑
                      </button>
                      <button onClick={() => moveFeature(activeTab, idx, 1)}
                        disabled={idx === activePlan.features_ui.length - 1}
                        className="text-xs px-2 py-1 hover:bg-white/5 rounded disabled:opacity-30">
                        ↓
                      </button>
                      <button onClick={() => removeFeatureUI(activeTab, idx)}
                        className="text-xs px-2 py-1 text-red-400 hover:bg-red-500/10 rounded">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                    <input value={f.tooltip_title}
                      onChange={e => updateFeatureUI(activeTab, idx, { tooltip_title: e.target.value })}
                      placeholder="Tooltip título (opcional)..."
                      className="bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300" />
                    <input value={f.tooltip_desc}
                      onChange={e => updateFeatureUI(activeTab, idx, { tooltip_desc: e.target.value })}
                      placeholder="Tooltip descripción..."
                      className="bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm disabled:opacity-50">
              {saving ? '💾 Guardando...' : '💾 Guardar todos los planes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// === Componentes helper ===
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
    </div>
  );
}
function FieldNum({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
    </div>
  );
}