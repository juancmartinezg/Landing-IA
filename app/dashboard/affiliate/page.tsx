'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface AffiliateMe {
  affiliate_code: string;
  affiliate_name: string;
  status: string;
  commission_rate_year1: number;
  commission_rate_recurring: number;
  total_referred: number;
  total_earned_cents: number;
  total_paid_cents: number;
  pending_cents: number;
  held_cents: number;
}

interface Referral {
  company_id: string;
  business_name: string;
  signup_date: string;
  status: string; // PENDING | ACTIVE | CHURNED
  plan: string;
  first_payment_at: string;
  mrr_cents: number;
}

interface Commission {
  referral_id: string;
  amount_cents: number;
  rate_pct: number;
  billing_period: string;
  hold_until: string;
  released: boolean;
  status: string; // HELD | RELEASED | PAID | VOID
}

function fmtUSD(cents: number) {
  return `$${(cents / 100).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(dateStr: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

const STATUS_REFERRAL: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
  ACTIVE:  { label: 'Activo',    color: 'bg-emerald-500/20 text-emerald-400' },
  CHURNED: { label: 'Canceló',   color: 'bg-red-500/20 text-red-400' },
};

const STATUS_COMMISSION: Record<string, { label: string; color: string }> = {
  HELD:     { label: 'En espera', color: 'bg-yellow-500/20 text-yellow-400' },
  RELEASED: { label: 'Liberada',  color: 'bg-indigo-500/20 text-indigo-400' },
  PAID:     { label: 'Pagada',    color: 'bg-emerald-500/20 text-emerald-400' },
  VOID:     { label: 'Anulada',   color: 'bg-red-500/20 text-red-400' },
};

const PLAN_ICONS: Record<string, string> = {
  starter: '🚀', solo: '🚀',
  growth: '⭐', pro: '⭐',
  agency: '🦁',
  enterprise: '🏆',
};

export default function AffiliatePage() {
  const { user } = useAuth();
  const [me, setMe] = useState<AffiliateMe | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAffiliate, setNotAffiliate] = useState(false);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'referrals' | 'commissions'>('referrals');
  const [successMsg, setSuccessMsg] = useState('');

  const refLink = me ? `https://clientes.bot/?ref=${me.affiliate_code}` : '';

  useEffect(() => {
    if (!user?.companyId) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user?.companyId) return;
    setLoading(true);
    try {
      const [meRes, refRes, comRes] = await Promise.all([
        fetch(`${API_URL}/affiliate/me`, { headers: { 'client-id': user.companyId } }),
        fetch(`${API_URL}/affiliate/referrals`, { headers: { 'client-id': user.companyId } }),
        fetch(`${API_URL}/affiliate/commissions`, { headers: { 'client-id': user.companyId } }),
      ]);
      if (meRes.status === 404 || meRes.status === 403) {
        setNotAffiliate(true);
        setLoading(false);
        return;
      }
      const [meData, refData, comData] = await Promise.all([
        meRes.json(), refRes.json(), comRes.json(),
      ]);
      setMe(meData);
      setReferrals(refData.referrals || []);
      setCommissions(comData.commissions || []);
    } catch (e) {
      console.error('Affiliate load error:', e);
    }
    setLoading(false);
  }

  async function handleJoin() {
    if (!user?.companyId) return;
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/affiliate/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user.companyId },
        body: JSON.stringify({ email: user.email, name: user.name }),
      });
      const data = await res.json();
      if (data.affiliate_code || data.status === 'ok') {
        setSuccessMsg('🎉 ¡Te uniste al programa! Tu código único ya está activo.');
        setNotAffiliate(false);
        await loadData();
      } else {
        alert(data.error || 'No se pudo registrar. Intenta de nuevo.');
      }
    } catch (e) {
      console.error('Affiliate signup error:', e);
    }
    setJoining(false);
  }

  function handleCopy() {
    if (!refLink) return;
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── No es afiliado aún ───────────────────────────────────────────────────
  if (notAffiliate) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-2xl font-bold">Programa de Afiliados</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Gana comisiones recurrentes recomendando clientes.bot a otros negocios.<br />
            <strong className="text-white">40% el primer año + 30% forever.</strong> Sin techo. Sin caducidad.
          </p>
        </div>

        {/* Comparativa vs GHL */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">¿Por qué somos mejores que GoHighLevel?</p>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="text-gray-500 font-medium"></div>
            <div className="text-white font-bold">clientes.bot 🦁</div>
            <div className="text-gray-500">GoHighLevel</div>

            <div className="text-gray-400 text-left">Comisión año 1</div>
            <div className="text-emerald-400 font-bold">40%</div>
            <div className="text-gray-500">40%</div>

            <div className="text-gray-400 text-left">Año 2 en adelante</div>
            <div className="text-emerald-400 font-bold">30% forever 🔥</div>
            <div className="text-gray-500">5%</div>

            <div className="text-gray-400 text-left">Cookie</div>
            <div className="text-emerald-400 font-bold">90 días</div>
            <div className="text-gray-500">30 días</div>

            <div className="text-gray-400 text-left">Pago mínimo</div>
            <div className="text-emerald-400 font-bold">$50 USD</div>
            <div className="text-gray-500">$50 USD</div>
          </div>
        </div>

        {/* Ejemplo de earnings */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-2">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">💰 Ejemplo real</p>
          <p className="text-sm text-gray-300">
            Si refieres <strong className="text-white">10 clientes Growth ($297/mes)</strong>:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-gray-500">Ingresos año 1</p>
              <p className="text-2xl font-bold text-indigo-400">$14,256</p>
              <p className="text-gray-500">(40% × $297 × 10 × 12)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-gray-500">Ingresos año 2+</p>
              <p className="text-2xl font-bold text-emerald-400">$10,692<span className="text-sm font-normal text-gray-400">/año</span></p>
              <p className="text-gray-500">sin hacer nada más 🦁</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {joining ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registrando...
            </>
          ) : '🤝 Unirme al programa de afiliados'}
        </button>
        <p className="text-center text-xs text-gray-600">
          Al unirte aceptas los{' '}
          <a href="/terminos" target="_blank" className="text-indigo-400 hover:text-indigo-300">
            Términos y condiciones del programa
          </a>. Las tasas pueden revisarse con 90 días de aviso.
        </p>
      </div>
    );
  }

  // ── Dashboard afiliado ───────────────────────────────────────────────────
  const rate1 = me ? Math.round((me.commission_rate_year1 || 0.4) * 100) : 40;
  const rateR = me ? Math.round((me.commission_rate_recurring || 0.3) * 100) : 30;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">🤝 Programa de Afiliados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tu código: <span className="text-indigo-400 font-bold">{me?.affiliate_code}</span>
            {' · '}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              me?.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {me?.status === 'ACTIVE' ? '✅ Activo' : '⏳ En revisión'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2">
          <span>📅 Pago mensual día 5</span>
          <span className="text-white/20">·</span>
          <span>Mín. $50 USD</span>
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-emerald-400 text-sm font-medium">{successMsg}</p>
          <button onClick={() => setSuccessMsg('')} className="text-gray-500 hover:text-white text-sm">✕</button>
        </div>
      )}

      {/* Link de referido */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-3">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">🔗 Tu link de afiliado</p>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="flex-1 min-w-0 text-xs bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-indigo-300 truncate font-mono">
            {refLink}
          </code>
          <button
            onClick={handleCopy}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? '✅ Copiado' : '📋 Copiar link'}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Cookie de 90 días. Si alguien hace clic en tu link y se suscribe antes de 90 días, la comisión es tuya.
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: '👥',
            label: 'Referidos totales',
            value: me?.total_referred?.toString() || '0',
            sub: `${referrals.filter(r => r.status === 'ACTIVE').length} activos`,
            color: 'border-white/10',
          },
          {
            icon: '💰',
            label: 'Total ganado',
            value: fmtUSD(me?.total_earned_cents || 0),
            sub: `${fmtUSD(me?.total_paid_cents || 0)} pagado`,
            color: 'border-emerald-500/20',
            accent: 'text-emerald-400',
          },
          {
            icon: '⏳',
            label: 'En espera (hold)',
            value: fmtUSD(me?.held_cents || 0),
            sub: 'Se libera en 30 días',
            color: 'border-yellow-500/20',
            accent: 'text-yellow-400',
          },
          {
            icon: '🏦',
            label: 'Listo para pago',
            value: fmtUSD(me?.pending_cents || 0),
            sub: 'Próximo día 5',
            color: 'border-indigo-500/20',
            accent: 'text-indigo-400',
          },
        ].map((card, i) => (
          <div key={i} className={`rounded-2xl border ${card.color} bg-white/[0.03] p-4 space-y-1`}>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>{card.icon}</span>
              <span>{card.label}</span>
            </p>
            <p className={`text-2xl font-bold ${card.accent || 'text-white'}`}>{card.value}</p>
            <p className="text-[10px] text-gray-600">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Tasas de comisión */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">📊 Tus tasas de comisión</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl font-black text-indigo-400">
              {rate1}%
            </div>
            <div>
              <p className="text-sm font-bold">Primer año</p>
              <p className="text-xs text-gray-500">De cada pago mensual del referido durante 12 meses</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl font-black text-emerald-400">
              {rateR}%
            </div>
            <div>
              <p className="text-sm font-bold">Año 2 en adelante</p>
              <p className="text-xs text-gray-500">Recurring forever — sin caducidad, sin sub-tiers 🦁</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Referidos / Comisiones */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {(['referrals', 'commissions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'referrals'
                ? `👥 Referidos (${referrals.length})`
                : `💸 Comisiones (${commissions.length})`}
            </button>
          ))}
        </div>

        {/* Tab: Referidos */}
        {activeTab === 'referrals' && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {referrals.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-4xl">🔗</p>
                <p className="text-gray-400 text-sm">Aún no tienes referidos</p>
                <p className="text-gray-600 text-xs">Comparte tu link y empieza a ganar</p>
                <button
                  onClick={handleCopy}
                  className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all"
                >
                  📋 Copiar mi link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Negocio</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Plan</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Estado</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Registro</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Primer pago</th>
                      <th className="text-right px-5 py-3 text-gray-500 font-medium">MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref, i) => {
                      const st = STATUS_REFERRAL[ref.status] || STATUS_REFERRAL.PENDING;
                      return (
                        <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
                          <td className="px-5 py-3 font-medium text-white">
                            {ref.business_name || ref.company_id}
                          </td>
                          <td className="px-5 py-3 text-gray-400">
                            {PLAN_ICONS[ref.plan] || '📦'} {ref.plan || '—'}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold ${st.color}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-500">{fmtDate(ref.signup_date)}</td>
                          <td className="px-5 py-3 text-gray-500">
                            {ref.first_payment_at ? fmtDate(ref.first_payment_at) : '—'}
                          </td>
                          <td className="px-5 py-3 text-right font-medium text-emerald-400">
                            {ref.mrr_cents ? fmtUSD(ref.mrr_cents) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Comisiones */}
        {activeTab === 'commissions' && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {commissions.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-4xl">💸</p>
                <p className="text-gray-400 text-sm">Aún no hay comisiones generadas</p>
                <p className="text-gray-600 text-xs">Aparecerán aquí cuando tus referidos paguen</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Referido</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Período</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Tasa</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Estado</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Libera</th>
                      <th className="text-right px-5 py-3 text-gray-500 font-medium">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((com, i) => {
                      const st = STATUS_COMMISSION[com.status] || STATUS_COMMISSION.HELD;
                      return (
                        <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
                          <td className="px-5 py-3 text-gray-400 font-mono text-[10px]">
                            {com.referral_id}
                          </td>
                          <td className="px-5 py-3 text-gray-400">{com.billing_period || '—'}</td>
                          <td className="px-5 py-3 text-gray-400">{Math.round(com.rate_pct * 100)}%</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold ${st.color}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-500">
                            {com.released ? '✅' : fmtDate(com.hold_until)}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-white">
                            {fmtUSD(com.amount_cents)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer legal */}
      <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02] space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ℹ️ Condiciones del programa</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <p className="text-white font-medium mb-1">⏳ Hold de 30 días</p>
            <p>Las comisiones se liberan 30 días después del pago del referido para cubrir posibles reembolsos.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">🛡️ Anti-fraude</p>
            <p>Si un referido cancela antes de 60 días, la comisión se anula automáticamente.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">📋 Revisión de tasas</p>
            <p>Las tasas pueden revisarse con 90 días de aviso. Las comisiones ya generadas se respetan bajo términos originales.</p>
          </div>
        </div>
      </div>

    </div>
  );
}