'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Plan {
  key: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  variant_monthly: string;
  variant_annual: string;
  annual_savings: number;
  features: {
    sub_accounts: number;
    messages_per_month: number;
    leads: number;
    agents: number;
    voice_minutes: number;
    white_label: boolean;
    api_access: boolean;
  };
}

interface Subscription {
  status: string;
  plan: string;
  variant_key: string;
  interval: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_ends_at: string;
  ls_subscription_id: string;
}

const PLAN_ICONS: Record<string, string> = { solo: '🚀', pro: '⭐', agency: '🦁' };
const PLAN_COLORS: Record<string, { border: string; badge: string; btn: string; glow: string }> = {
  solo:   { border: 'border-indigo-500/30',  badge: 'bg-indigo-500/20 text-indigo-400',   btn: 'bg-indigo-600 hover:bg-indigo-500',   glow: 'shadow-indigo-500/20' },
  pro:    { border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500', glow: 'shadow-emerald-500/20' },
  agency: { border: 'border-amber-500/30',   badge: 'bg-amber-500/20 text-amber-400',     btn: 'bg-amber-600 hover:bg-amber-500',     glow: 'shadow-amber-500/20' },
};

function fmt(n: number) { return n === -1 ? 'Ilimitado' : n.toLocaleString(); }

function fmtDate(dateStr: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

export default function BillingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [annual, setAnnual] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.companyId) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      setSuccessMsg('🎉 ¡Suscripción activada! Bienvenido a clientes.bot.');
      window.history.replaceState({}, '', '/dashboard/billing');
    }
    Promise.all([
      fetch(`${API_URL}/billing/plans`, { headers: { 'client-id': user.companyId } }).then(r => r.json()),
      fetch(`${API_URL}/billing/me`, { headers: { 'client-id': user.companyId } }).then(r => r.json()),
    ]).then(([plansData, subData]) => {
      setPlans(plansData.plans || []);
      if (subData.status && subData.status !== 'no_subscription') setSub(subData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleCheckout = async (plan: Plan) => {
    if (!user?.companyId) return;
    const variantKey = annual ? `${plan.key}_annual` : `${plan.key}_monthly`;
    setCheckingOut(variantKey);
    try {
      const res = await fetch(`${API_URL}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user.companyId },
        body: JSON.stringify({
          variant_key: variantKey,
          email: user.email || '',
          name: user.name || '',
        }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (e) {
      console.error('Checkout error:', e);
    }
    setCheckingOut(null);
  };

  const handleCancel = async () => {
    if (!user?.companyId || !confirm('¿Cancelar tu suscripción al final del período?')) return;
    setCancelling(true);
    try {
      await fetch(`${API_URL}/billing/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user.companyId },
        body: JSON.stringify({}),
      });
      setSub(prev => prev ? { ...prev, cancel_at_period_end: true, status: 'cancelled' } : prev);
    } catch (e) { console.error(e); }
    setCancelling(false);
  };

  const handleResume = async () => {
    if (!user?.companyId) return;
    setResuming(true);
    try {
      await fetch(`${API_URL}/billing/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user.companyId },
        body: JSON.stringify({}),
      });
      setSub(prev => prev ? { ...prev, cancel_at_period_end: false, status: 'active' } : prev);
    } catch (e) { console.error(e); }
    setResuming(false);
  };

  const currentPlanKey = sub?.plan || null;
  const isActive = sub?.status === 'active';
  const isCancelled = sub?.cancel_at_period_end;
  const isPastDue = sub?.status === 'past_due';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">💳 Suscripción</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tu plan y facturación</p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-emerald-400 text-sm font-medium">{successMsg}</p>
          <button onClick={() => setSuccessMsg('')} className="text-gray-500 hover:text-white text-sm">✕</button>
        </div>
      )}

      {/* Estado actual */}
      {sub && (
        <div className={`rounded-2xl border p-5 ${
          isPastDue ? 'border-red-500/30 bg-red-500/5' :
          isCancelled ? 'border-yellow-500/30 bg-yellow-500/5' :
          'border-white/10 bg-white/[0.03]'
        }`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plan actual</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{PLAN_ICONS[currentPlanKey || ''] || '📦'}</span>
                <span className="text-xl font-bold capitalize">{sub.plan || '—'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isPastDue ? 'bg-red-500/20 text-red-400' :
                  isCancelled ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {isPastDue ? '⚠️ Pago fallido' : isCancelled ? '⏳ Cancela pronto' : '✅ Activo'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {sub.interval === 'annual' ? '📅 Facturación anual' : '📅 Facturación mensual'}
                {sub.current_period_end && ` · Próximo cobro: ${fmtDate(sub.current_period_end)}`}
              </p>
              {isCancelled && sub.current_period_end && (
                <p className="text-xs text-yellow-400 mt-1">
                  ⚠️ Acceso hasta {fmtDate(sub.current_period_end)}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {isCancelled ? (
                <button onClick={handleResume} disabled={resuming}
                  className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all disabled:opacity-50">
                  {resuming ? '...' : '↩️ Reactivar'}
                </button>
              ) : isActive ? (
                <button onClick={handleCancel} disabled={cancelling}
                  className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-50">
                  {cancelling ? '...' : 'Cancelar suscripción'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Toggle mensual/anual */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-400">{sub ? 'Cambiar de plan:' : 'Elige tu plan:'}</p>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
          <button onClick={() => setAnnual(false)}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${!annual ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
            Mensual
          </button>
          <button onClick={() => setAnnual(true)}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${annual ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
            Anual
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold">-20%</span>
          </button>
        </div>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const colors = PLAN_COLORS[plan.key] || PLAN_COLORS.solo;
          const isCurrent = currentPlanKey === plan.key;
          const variantKey = annual ? `${plan.key}_annual` : `${plan.key}_monthly`;
          const isLoadingPlan = checkingOut === variantKey;

          return (
            <div key={plan.key}
              className={`relative rounded-2xl border p-5 flex flex-col gap-4 transition-all shadow-xl ${colors.border} ${colors.glow} ${
                isCurrent ? 'bg-white/[0.06]' : 'bg-white/[0.02] hover:bg-white/[0.04]'
              } ${plan.key === 'pro' ? 'ring-1 ring-emerald-500/30' : ''}`}>

              {plan.key === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">⭐ MÁS POPULAR</span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${colors.badge}`}>Tu plan actual</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{PLAN_ICONS[plan.key]}</span>
                  <span className="font-bold text-lg">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${annual ? plan.price_annual : plan.price_monthly}</span>
                  <span className="text-gray-500 text-sm">/{annual ? 'año' : 'mes'}</span>
                </div>
                {annual && (
                  <p className="text-emerald-400 text-xs mt-1">
                    Ahorras ${(plan.price_monthly * 12 - plan.price_annual).toLocaleString()}/año
                  </p>
                )}
              </div>

              <div className="space-y-2 flex-1">
                {[
                  { label: 'Sub-cuentas',     value: fmt(plan.features.sub_accounts) },
                  { label: 'Mensajes/mes',     value: fmt(plan.features.messages_per_month) },
                  { label: 'Leads CRM',        value: fmt(plan.features.leads) },
                  { label: 'Agentes humanos',  value: fmt(plan.features.agents) },
                  { label: 'Voz IA (min/mes)', value: fmt(plan.features.voice_minutes) },
                  { label: 'White-label',      value: plan.features.white_label ? '✅' : '❌' },
                  { label: 'API pública',      value: plan.features.api_access ? '✅' : '❌' },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="font-medium text-white">{f.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={isCurrent || !!checkingOut}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  isCurrent
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : `${colors.btn} text-white shadow-lg`
                } disabled:opacity-60`}>
                {isLoadingPlan ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirigiendo...
                  </span>
                ) : isCurrent ? 'Plan actual' : sub ? 'Cambiar a este plan' : 'Comenzar ahora'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02] space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ℹ️ Información de facturación</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <p className="text-white font-medium mb-1">🔒 Pago seguro</p>
            <p>Procesado por Lemon Squeezy. Aceptamos tarjetas de crédito y débito internacionales.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">↩️ Cancela cuando quieras</p>
            <p>Sin contratos. Cancela desde aquí y mantienes acceso hasta el final del período pagado.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">📧 Soporte</p>
            <p>¿Preguntas sobre tu factura? Escríbenos a <span className="text-indigo-400">soporte@clientes.bot</span></p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 pb-4">
        Equivalente a GoHighLevel Unlimited $297 — con IA real, CAPI completo y LATAM nativo incluidos.
        <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 ml-1">Ver comparativa completa →</Link>
      </div>

    </div>
  );
}
