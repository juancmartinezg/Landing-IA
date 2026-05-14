'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface PlanCard {
  key: string;
  name: string;
  subtitle: string;
  price_usd: number;
  price_annual: number;
  popular: boolean;
  btn_label: string;
  color_theme: string;
  features_ui: Array<{
    label: string;
    included: boolean;
    tooltip_title: string;
    tooltip_desc: string;
  }>;
}
const COLOR_THEMES: Record<string, { color: string; btnClass: string }> = {
  indigo: {
    color: 'border-white/10 hover:border-indigo-500/30',
    btnClass: 'bg-white/5 hover:bg-indigo-600 border border-white/10',
  },
  indigo_popular: {
    color: 'border-indigo-500/50 bg-indigo-600',
    btnClass: 'bg-white text-indigo-600 hover:bg-gray-100 font-black shadow-lg',
  },
  gold: {
    color: 'border-amber-500/30 hover:border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-yellow-500/5',
    btnClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black shadow-lg shadow-amber-500/20',
  },
  amber: {
    color: 'border-amber-500/30 hover:border-amber-500/50',
    btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg',
  },
  slate: {
    color: 'border-slate-500/30 hover:border-slate-500/50',
    btnClass: 'bg-slate-600 hover:bg-slate-500 text-white',
  },
};
export default function DemoBillingPage() {
  const [plans, setPlans] = useState<PlanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  // Mock del estado "como si tuvieras una cuenta activa"
  const currentPlan = 'growth';
  const usage = {
    messages_used: 6840,
    messages_limit: 10000,
    leads_used: 40,
    leads_limit: -1,
    agents_used: 3,
    agents_limit: 5,
    voice_used: 42,
    voice_limit: 100,
    wizards_used: 11,
    wizards_limit: 20,
  };
  const messagePacks = [
    { key: 'S', name: 'Pack S', messages: 1000, price: 19, discount: 0 },
    { key: 'M', name: 'Pack M', messages: 5000, price: 79, discount: 17, popular: true },
    { key: 'L', name: 'Pack L', messages: 20000, price: 249, discount: 35 },
  ];
  const billingHistory = [
    { date: '2026-04-14', desc: 'Growth — mensual', amount: 297, status: 'PAGADO' },
    { date: '2026-03-14', desc: 'Growth — mensual', amount: 297, status: 'PAGADO' },
    { date: '2026-02-26', desc: 'Pack M — 5,000 mensajes', amount: 79, status: 'PAGADO' },
    { date: '2026-02-14', desc: 'Growth — mensual', amount: 297, status: 'PAGADO' },
    { date: '2026-01-14', desc: 'Growth — mensual (primer mes)', amount: 297, status: 'PAGADO' },
  ];
  useEffect(() => {
    fetch(`${API_URL}/billing/plans-public`)
      .then(r => r.json())
      .then(data => {
        if (data?.plans) setPlans(data.plans);
        if (data?.trial_days) setTrialDays(data.trial_days);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const pct = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };
  const pctColor = (p: number) => {
    if (p >= 90) return 'bg-red-500';
    if (p >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">💎 Mi suscripción</h1>
          <p className="text-gray-400 text-sm">Plan actual, uso del mes y facturación</p>
        </div>
        <button className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
          ⚙️ Portal de facturación
        </button>
      </div>
      {/* Plan actual */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border border-indigo-500/40 rounded-2xl p-5 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">⭐</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black">Plan Growth</p>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black">ACTIVO</span>
              </div>
              <p className="text-xs text-gray-300">Próximo cargo: 14 jun · <span className="font-bold text-white">$297 USD</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl">
              Cambiar plan
            </button>
            <button className="text-xs px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl">
              Cancelar
            </button>
          </div>
        </div>
      </div>
      {/* Uso del mes */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">📊 Uso del mes</p>
          <p className="text-[10px] text-gray-500">Reinicia el 14 jun</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 font-bold">💬 Conversaciones</p>
              <p className="text-[10px] text-emerald-400 font-bold">{usage.messages_used.toLocaleString()} / {usage.messages_limit.toLocaleString()}</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${pctColor(pct(usage.messages_used, usage.messages_limit))}`} style={{ width: `${pct(usage.messages_used, usage.messages_limit)}%` }} />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">{Math.round(pct(usage.messages_used, usage.messages_limit))}% usado</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 font-bold">👥 Leads</p>
              <p className="text-[10px] text-emerald-400 font-bold">{usage.leads_used} / ∞</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '8%' }} />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">Ilimitado</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 font-bold">🧑‍💼 Agentes</p>
              <p className="text-[10px] text-emerald-400 font-bold">{usage.agents_used} / {usage.agents_limit}</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${pctColor(pct(usage.agents_used, usage.agents_limit))}`} style={{ width: `${pct(usage.agents_used, usage.agents_limit)}%` }} />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">{Math.round(pct(usage.agents_used, usage.agents_limit))}% usado</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 font-bold">🎙️ Voz IA</p>
              <p className="text-[10px] text-emerald-400 font-bold">{usage.voice_used} / {usage.voice_limit} min</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${pctColor(pct(usage.voice_used, usage.voice_limit))}`} style={{ width: `${pct(usage.voice_used, usage.voice_limit)}%` }} />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">{Math.round(pct(usage.voice_used, usage.voice_limit))}% usado</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 font-bold">✨ Generador IA</p>
              <p className="text-[10px] text-emerald-400 font-bold">{usage.wizards_used} / {usage.wizards_limit}</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${pctColor(pct(usage.wizards_used, usage.wizards_limit))}`} style={{ width: `${pct(usage.wizards_used, usage.wizards_limit)}%` }} />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">{Math.round(pct(usage.wizards_used, usage.wizards_limit))}% usado</p>
          </div>
        </div>
      </div>
      {/* Comparar planes */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-lg font-black mb-1">Comparar planes</p>
            <p className="text-xs text-gray-400">Cambia o actualiza cuando quieras · Prueba {trialDays} días gratis sin tarjeta</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setBillingAnnual(false)}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                !billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingAnnual(true)}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'
              }`}
            >
              Anual
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 animate-pulse h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const theme = COLOR_THEMES[plan.color_theme] || COLOR_THEMES.indigo;
              const isCurrent = plan.key === currentPlan;
              const priceMonthly = billingAnnual ? Math.round(plan.price_annual / 12) : plan.price_usd;
              return (
                <div
                  key={plan.key}
                  className={`rounded-3xl border p-6 flex flex-col text-left transition-all relative ${
                    plan.popular ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30 scale-[1.02]' : 'bg-white/[0.03]'
                  } ${theme.color}`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                      ⭐ Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-[#0B0F1A] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      ✓ Plan actual
                    </div>
                  )}
                  <h3 className="text-lg font-black mb-1">{plan.name}</h3>
                  <p className={`text-[10px] uppercase tracking-widest mb-5 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {plan.subtitle}
                  </p>
                  <div className="mb-1">
                    <span className="text-4xl font-black">${priceMonthly}</span>
                    <span className={`text-sm font-medium ml-1 ${plan.popular ? 'opacity-70' : 'text-gray-600'}`}>/mes</span>
                  </div>
                  {billingAnnual && (
                    <p className={`text-[10px] mb-1 ${plan.popular ? 'text-emerald-200' : 'text-emerald-400'}`}>
                      Facturado anual — ${plan.price_annual}/año
                    </p>
                  )}
                  <p className={`text-[10px] mb-5 ${plan.popular ? 'text-indigo-200' : 'text-gray-600'}`}>
                    USD · {billingAnnual ? 'anual' : 'mensual'}
                  </p>
                  {/* Features preview (top 8) */}
                  <ul className="space-y-2 mb-6 flex-1 text-xs">
                    {plan.features_ui.slice(0, 8).map((f, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2 ${
                          !f.included
                            ? plan.popular
                              ? 'opacity-40'
                              : 'text-gray-600'
                            : plan.popular
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        <span className={`mt-0.5 shrink-0 ${f.included ? (plan.popular ? 'text-white' : 'text-emerald-400') : 'text-gray-600'}`}>
                          {f.included ? '✓' : '—'}
                        </span>
                        <span className="flex-1">{f.label}</span>
                      </li>
                    ))}
                    {plan.features_ui.length > 8 && (
                      <li className={`text-[10px] italic pt-1 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                        + {plan.features_ui.length - 8} características más
                      </li>
                    )}
                  </ul>
                  <button
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl text-center text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                        : theme.btnClass
                    }`}
                  >
                    {isCurrent ? '✓ Tu plan actual' : plan.btn_label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Message Packs */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="text-lg font-black mb-1">📦 Packs de mensajes adicionales</p>
            <p className="text-xs text-gray-400">No expiran nunca · Se suman a tu plan actual</p>
          </div>
          <p className="text-xs text-emerald-400 font-bold">Balance actual: 0 mensajes extra</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {messagePacks.map((pack) => (
            <div
              key={pack.key}
              className={`relative rounded-2xl border p-5 transition-all ${
                pack.popular
                  ? 'bg-indigo-500/10 border-indigo-500/40'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-black uppercase">
                  ⭐ Más comprado
                </div>
              )}
              <p className="text-2xl font-black mb-1">{pack.name}</p>
              <p className="text-3xl font-black text-indigo-400 mb-2">{pack.messages.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">mensajes</p>
              {pack.discount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black mb-3 inline-block">
                  −{pack.discount}% descuento
                </span>
              )}
              <p className="text-3xl font-black mb-4">${pack.price}<span className="text-sm font-normal text-gray-500"> USD</span></p>
              <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                pack.popular
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
              }`}>
                Comprar pack
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Historial de facturación */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">🧾 Historial de facturación</p>
          <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Descargar todo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Fecha</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Descripción</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right">Monto</th>
                <th className="pb-2 pr-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-center">Estado</th>
                <th className="pb-2 text-[9px] text-gray-500 uppercase tracking-widest font-bold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((b, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-3 text-gray-400">{b.date}</td>
                  <td className="py-3 pr-3 font-bold">{b.desc}</td>
                  <td className="py-3 pr-3 text-right font-black text-emerald-400">${b.amount} USD</td>
                  <td className="py-3 pr-3 text-center">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black">{b.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* CTA final */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">💎</p>
        <p className="text-lg font-black mb-2">¿Necesitas algo más grande?</p>
        <p className="text-xs text-gray-400 mb-4 max-w-xl mx-auto">
          El plan Enterprise incluye conversaciones ilimitadas, voz IA sin tope, avatar IA con video, account manager dedicado, SLA 99.9% y dominio 100% personalizado. <span className="text-indigo-400 font-bold">Diseñado para agencias y empresas que rugen.</span>
        </p>
        <Link
          href="/auth/login"
          className="inline-block text-xs px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          🚀 Hablar con ventas
        </Link>
      </div>
    </div>
  );
}