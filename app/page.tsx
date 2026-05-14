'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWidget from './components/ChatWidget';
import InstallPWAPrompt from './components/InstallPWAPrompt';
import FadeInOnScroll from './components/FadeInOnScroll';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// ============================================================
// TIPOS — Catálogo de planes desde /billing/plans-public
// ============================================================
interface PlanCard {
  key: string;
  name: string;
  subtitle: string;
  price_usd: number;
  price_cop: number;
  price_annual: number;
  popular: boolean;
  btn_label: string;
  btn_href_type: 'checkout' | 'whatsapp';
  btn_href_whatsapp?: string;
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
    btnClass: 'bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500',
  },
  indigo_popular: {
    color: 'border-indigo-500/50 bg-indigo-600',
    btnClass: 'bg-white text-indigo-600 hover:bg-gray-100 font-black shadow-lg',
  },
  gold: {
    color: 'border-amber-500/40 hover:border-amber-500/60 bg-gradient-to-br from-amber-500/5 to-yellow-500/5',
    btnClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black shadow-lg shadow-amber-500/20',
  },
  amber: {
    color: 'border-amber-500/30 hover:border-amber-500/50',
    btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20',
  },
  slate: {
    color: 'border-slate-500/30 hover:border-slate-500/50',
    btnClass: 'bg-slate-600 hover:bg-slate-500 text-white',
  },
};
// Tooltip de features
function FeatureTooltip({ title, desc }: { title: string; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex ml-1 align-middle">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-white/10 hover:bg-indigo-500/40 text-[9px] font-black text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-indigo-500/50"
        aria-label="Más info"
      >?</button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-6 top-0 z-50 w-56 bg-[#1a1f2e] border border-white/10 rounded-xl p-3 shadow-2xl text-left">
            <p className="text-[10px] font-bold text-white mb-1">{title}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">{desc}</p>
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-white text-xs">✕</button>
          </div>
        </>
      )}
    </span>
  );
}
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [plans, setPlans] = useState<PlanCard[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/billing/plans-public`)
      .then(r => r.json())
      .then(data => {
        if (data?.plans) setPlans(data.plans);
        setPlansLoading(false);
      })
      .catch(() => setPlansLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-indigo-500/30 scroll-smooth">
      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2.5 shrink-0">
            <img src="/cb-logo.webp" alt="clientes.bot" className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
            <span className="text-base md:text-xl font-black tracking-tighter">clientes.bot</span>
            <span className="hidden sm:inline-flex items-center text-[9px] md:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/15 to-emerald-500/15 border border-indigo-500/30 text-indigo-300">
              Revenue OS
            </span>
          </div>
          <div className="hidden md:flex gap-7 text-sm text-gray-400">
            <a href="#producto" className="hover:text-white transition-colors font-medium">Producto</a>
            <Link href="/demo" target="_blank" className="hover:text-white transition-colors font-medium flex items-center gap-1">
              Demo en vivo
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </Link>
            <a href="#comparativa" className="hover:text-white transition-colors font-medium">¿Por qué nosotros?</a>
            <a href="#planes" className="hover:text-white transition-colors font-medium">Planes</a>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Link href="/auth/login" className="hidden sm:inline-block border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap">
              Iniciar sesión
            </Link>
            <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap">
              Probar 14 días gratis
            </Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400 text-xl ml-1" aria-label="Menu">☰</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#0B0F1A] border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#producto" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Producto</a>
            <Link href="/demo" target="_blank" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">
              Demo en vivo →
            </Link>
            <a href="#comparativa" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">¿Por qué nosotros?</a>
            <a href="#planes" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-400 hover:text-white">Planes</a>
          </div>
        )}
      </nav>
      {/* ============================================================ */}
      {/* HERO — Revenue OS */}
      {/* ============================================================ */}
      <section className="pt-32 md:pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-600/8 blur-[200px] -z-10" />
        <div className="absolute top-60 left-1/4 w-[400px] h-[400px] bg-purple-600/6 blur-[180px] -z-10" />
        <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-emerald-600/6 blur-[180px] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] md:text-[11px] text-gray-300 font-black tracking-[0.2em] uppercase">
                WhatsApp Revenue OS · Multi-tenant
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              El Revenue OS para<br />
              negocios que venden por
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-400"> WhatsApp.</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Captura, organiza, automatiza y mide cada peso que entra por WhatsApp —
              <span className="text-white font-bold"> desde el anuncio hasta el cobro</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/demo"
                target="_blank"
                className="bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] px-8 py-4 rounded-2xl font-black text-base transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center justify-center gap-2"
              >
                Probar el dashboard en vivo
                <span className="opacity-70">↗</span>
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-8 py-4 rounded-2xl font-bold text-base transition-all inline-flex items-center justify-center gap-2"
              >
                Empezar 14 días gratis
              </Link>
            </div>
            <p className="text-[11px] text-gray-600">
              Sin tarjeta de crédito · Sin código · Cancela cuando quieras
            </p>
          </div>
          {/* Trust bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-14">
            {[
              { v: '$2.4M', l: 'Revenue trazado', desc: 'COP en 30 días JMC' },
              { v: '7.8/10', l: 'Match rate atribución', desc: 'vs 4/10 del estándar' },
              { v: '47%', l: 'Menos CPA', desc: 'con CAPI + IA loop' },
              { v: '6+', l: 'Canales nativos', desc: 'WA · IG · FB · Web · Voz' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center hover:border-white/10 transition-all">
                <p className="text-2xl md:text-3xl font-black text-white tabular-nums">{s.v}</p>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1 font-bold">{s.l}</p>
                <p className="text-[10px] text-gray-600 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* HERO VISUAL — Revenue/Attribution Dashboard */}
          <FadeInOnScroll delay={150}>
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-emerald-600/20 blur-3xl -z-10" />
            <div className="bg-[#080B14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#050810] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/5 rounded-lg px-4 py-1 text-[10px] text-gray-500 flex items-center gap-1">
                    🔒 clientes.bot/dashboard/analytics
                  </div>
                </div>
                <Link
                  href="/demo/analytics"
                  target="_blank"
                  className="text-[9px] px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg whitespace-nowrap"
                >
                  Abrir demo ↗
                </Link>
              </div>
              <Link href="/demo/analytics" target="_blank" className="block relative group">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Revenue Dashboard</p>
                      <p className="text-sm md:text-base font-black text-white">Últimos 30 días · Atribución completa</p>
                    </div>
                    <div className="flex gap-1">
                      {['7d', '30d', '90d', 'Año'].map((p, i) => (
                        <span key={p} className={`text-[9px] md:text-[10px] px-2.5 py-1 rounded-md font-bold ${
                          i === 1 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'
                        }`}>{p}</span>
                      ))}
                    </div>
                  </div>
                  {/* 4 KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 border border-emerald-500/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Revenue</p>
                        <span className="text-[9px] text-emerald-400 font-bold">↑ 47%</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white tabular-nums">$2,418,500</p>
                      <p className="text-[9px] text-gray-500 mt-1">trazado desde WhatsApp</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/0 border border-indigo-500/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[9px] text-indigo-400 uppercase tracking-wider font-bold">ROAS</p>
                        <span className="text-[9px] text-emerald-400 font-bold">↑ 12%</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white tabular-nums">4.82×</p>
                      <p className="text-[9px] text-gray-500 mt-1">retorno por anuncio</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/0 border border-purple-500/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">CPA</p>
                        <span className="text-[9px] text-emerald-400 font-bold">↓ 47%</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white tabular-nums">$18,420</p>
                      <p className="text-[9px] text-gray-500 mt-1">costo por venta cerrada</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[9px] text-yellow-400 uppercase tracking-wider font-bold">Match rate</p>
                        <span className="text-[9px] text-emerald-400 font-bold">↑ 7.8/10</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white tabular-nums">7.8/10</p>
                      <p className="text-[9px] text-gray-500 mt-1">vs 4.0 estándar Meta</p>
                    </div>
                  </div>
                  {/* Grid revenue chart + funnel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                    <div className="md:col-span-7 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Revenue por día</p>
                        <div className="flex items-center gap-3 text-[9px]">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-2 h-2 rounded-sm bg-emerald-500" />Pagado
                          </span>
                          <span className="flex items-center gap-1 text-indigo-400">
                            <span className="w-2 h-2 rounded-sm bg-indigo-500" />Pendiente
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-1 h-32 mb-2">
                        {[
                          { paid: 45, pend: 12 }, { paid: 62, pend: 18 }, { paid: 38, pend: 8 },
                          { paid: 78, pend: 24 }, { paid: 55, pend: 15 }, { paid: 84, pend: 22 },
                          { paid: 71, pend: 19 }, { paid: 92, pend: 26 }, { paid: 68, pend: 14 },
                          { paid: 88, pend: 31 }, { paid: 75, pend: 18 }, { paid: 96, pend: 28 },
                          { paid: 82, pend: 22 }, { paid: 100, pend: 35 },
                        ].map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col-reverse items-stretch gap-0.5 group">
                            <div className="bg-emerald-500/70 rounded-sm group-hover:bg-emerald-400 transition-colors" style={{height: `${d.paid * 0.8}%`}} />
                            <div className="bg-indigo-500/40 rounded-sm group-hover:bg-indigo-400/70 transition-colors" style={{height: `${d.pend * 0.6}%`}} />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[8px] text-gray-600">
                        <span>1 abr</span><span>8 abr</span><span>15 abr</span><span>22 abr</span><span>30 abr</span>
                      </div>
                    </div>
                    <div className="md:col-span-5 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Embudo conversacional</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Anuncio visto', n: '12,847', w: 100, c: 'bg-slate-500/40' },
                          { label: 'Click → WhatsApp', n: '1,924', w: 75, c: 'bg-indigo-500/60' },
                          { label: 'Conversación IA', n: '1,612', w: 63, c: 'bg-purple-500/70' },
                          { label: 'Lead calificado', n: '847', w: 33, c: 'bg-yellow-500/70' },
                          { label: 'Venta cerrada', n: '131', w: 5, c: 'bg-emerald-500' },
                        ].map((s, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] text-gray-300 font-medium">{s.label}</span>
                              <span className="text-[10px] font-black text-white tabular-nums">{s.n}</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.03] rounded-sm overflow-hidden">
                              <div className={`h-full ${s.c} rounded-sm`} style={{width: `${s.w}%`}} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] text-gray-500">Conversión total</span>
                        <span className="text-xs font-black text-emerald-400 tabular-nums">1.02%</span>
                      </div>
                    </div>
                  </div>
                  {/* Bottom: top fuentes + actividad live */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Top fuentes de revenue</p>
                      <div className="space-y-1.5">
                        {[
                          { src: '📘 Meta Ads · Campaña Q2', rev: '$1,247k', pct: 51, c: 'bg-blue-500' },
                          { src: '🚀 Meta Ads · Retargeting', rev: '$542k', pct: 22, c: 'bg-indigo-500' },
                          { src: '📸 Instagram Ads · Reels', rev: '$381k', pct: 16, c: 'bg-pink-500' },
                          { src: '🌐 Orgánico WhatsApp', rev: '$248k', pct: 11, c: 'bg-emerald-500' },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-white/5 rounded-sm overflow-hidden shrink-0">
                              <div className={`h-full ${s.c} rounded-sm`} style={{width: `${s.pct}%`}} />
                            </div>
                            <p className="text-[10px] text-gray-300 flex-1 truncate font-medium">{s.src}</p>
                            <span className="text-[10px] font-black text-white tabular-nums shrink-0">{s.rev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Actividad en tiempo real</p>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { ts: 'hace 2s', e: '💳 Venta', t: 'María L. · $145k · Apto 2H', c: 'text-emerald-400' },
                          { ts: 'hace 18s', e: '🎯 Lead atribuido', t: 'Carlos M. ← Meta Ads Q2', c: 'text-indigo-400' },
                          { ts: 'hace 1m', e: '🤖 Bot calificó', t: 'Pedro R. · Score 92/100', c: 'text-purple-400' },
                          { ts: 'hace 3m', e: '📅 Cita agendada', t: 'Ana G. · Mar 14:00', c: 'text-sky-400' },
                          { ts: 'hace 6m', e: '✨ Variante IA', t: 'Hook escasez · CTR 4.99%', c: 'text-yellow-400' },
                        ].map((a, i) => (
                          <div key={i} className="flex items-start gap-2 text-[10px]">
                            <span className={`font-bold shrink-0 ${a.c}`}>{a.e}</span>
                            <span className="text-gray-400 flex-1 truncate">{a.t}</span>
                            <span className="text-gray-600 shrink-0 text-[9px]">{a.ts}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-12">
                  <div className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black shadow-2xl text-sm flex items-center gap-2 transform group-hover:scale-105 transition-all">
                    Navegar el dashboard en pantalla completa →
                  </div>
                </div>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                { label: '📊 Atribución', href: '/demo/analytics' },
                { label: '🚀 Anuncios IA', href: '/demo/ads' },
                { label: '👥 CRM Kanban', href: '/demo/crm' },
                { label: '💬 Conversaciones', href: '/demo/chat' },
              ].map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  target="_blank"
                  className="text-[11px] px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/40 text-gray-300 hover:text-white font-bold rounded-xl transition-all"
                >
                  {b.label} ↗
                </Link>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-500 mt-4 max-w-xl mx-auto">
              Dashboard real · Datos demo de Inmobiliaria Aurora.
              <span className="text-indigo-400"> Explora libremente, sin login.</span>
            </p>
          </div>
          </FadeInOnScroll>
        </div>
      </section>
      {/* ============================================================ */}
      {/* WHY NOW — Los 4 problemas macro del mercado */}
      {/* ============================================================ */}
      <section className="py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/5 blur-[200px] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] text-red-400 uppercase tracking-[0.3em] font-black mb-4">El estado actual del mercado</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              Tus clientes ya viven en WhatsApp.<br />
              <span className="text-red-400">Tu operación, no.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              4 verdades incómodas que están drenando revenue de tu negocio ahora mismo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                stat: '76%',
                statLabel: 'de las ventas LATAM',
                title: 'Pasan por WhatsApp.',
                desc: 'Tu cliente ya decidió: prefiere chatear que llamar, que abrir tu web, que llenar formularios. WhatsApp es el nuevo embudo. Pero la mayoría de negocios opera ahí como si fuera 2015 — con WhatsApp Web abierto y respuestas manuales.',
                icon: '📱',
                color: 'from-emerald-500/15 to-emerald-500/0',
                border: 'border-emerald-500/30',
                accent: 'text-emerald-400',
              },
              {
                stat: '< 5 min',
                statLabel: 'es la ventana real',
                title: 'Si tardas más, perdiste.',
                desc: 'Estudios de Harvard Business Review demuestran que los leads contactados en menos de 5 minutos convierten 9× más. Pero tu equipo duerme, almuerza, se enferma, atiende a otros. Cada minuto que pasa sin respuesta es plata que se va al competidor.',
                icon: '⏱️',
                color: 'from-yellow-500/15 to-yellow-500/0',
                border: 'border-yellow-500/30',
                accent: 'text-yellow-400',
              },
              {
                stat: '8+',
                statLabel: 'herramientas desconectadas',
                title: 'Tu stack es un Frankenstein.',
                desc: 'CRM por aquí, bot por allá, Ads en otra ventana, Calendly aparte, pasarela aparte, Zapier pegando todo con cinta. Cada herramienta cuesta plata. Cada integración rota cuesta más. Y al final, nadie sabe qué está pasando con cada lead.',
                icon: '🔌',
                color: 'from-red-500/15 to-red-500/0',
                border: 'border-red-500/30',
                accent: 'text-red-400',
              },
              {
                stat: '4/10',
                statLabel: 'match rate Meta promedio',
                title: 'Tus Ads aprenden de clics, no de ventas.',
                desc: 'El algoritmo de Meta optimiza por lo que mides. Si solo mandas "clicks", optimiza para que más gente haga click — no para que más gente compre. Sin atribución completa Lead→Venta, estás pagando para entrenar al algoritmo equivocado.',
                icon: '🎯',
                color: 'from-purple-500/15 to-purple-500/0',
                border: 'border-purple-500/30',
                accent: 'text-purple-400',
              },
            ].map((p, i) => (
              <FadeInOnScroll key={i} delay={i * 100}>
                <div className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-3xl p-6 md:p-8 h-full transition-all hover:scale-[1.01]`}>
                  <div className="flex items-start gap-5 mb-4">
                    <div className="text-5xl shrink-0">{p.icon}</div>
                    <div className="flex-1">
                      <p className={`text-4xl md:text-5xl font-black ${p.accent} leading-none tabular-nums`}>{p.stat}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">{p.statLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-black mb-3">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
          <FadeInOnScroll delay={500}>
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                Cada día que tu operación no está conectada con WhatsApp,
              </p>
              <p className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 leading-tight">
                es revenue que se va al competidor.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-[11px] text-gray-500">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600" />
                <span className="uppercase tracking-[0.3em] font-bold">Hay otra forma</span>
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600" />
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
      {/* ============================================================ */}
      {/* STACK ROTO → UNA PLATAFORMA — La solución */}
      {/* ============================================================ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-emerald-400 uppercase tracking-[0.3em] font-black mb-4">La solución</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Reemplaza tu stack por <span className="text-emerald-400">una sola plataforma</span><br />
              que sí se habla entre sí.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              CRM, WhatsApp, Ads, pasarela, calendario, automatizaciones — todo en una sola interfaz. <span className="text-white font-bold">Una sola factura. Cero integraciones manuales. Cero datos perdidos entre apps.</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <FadeInOnScroll>
            <div className="md:col-span-1 bg-red-500/[0.03] border border-red-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">😩</span>
                <p className="text-xs font-black text-red-400 uppercase tracking-widest">Antes · Stack roto</p>
              </div>
              <div className="space-y-2">
                {[
                  { tool: 'CRM externo', cost: '$50-300/mes' },
                  { tool: 'Bot WhatsApp básico', cost: '$30-80/mes' },
                  { tool: 'Plataforma de Ads', cost: '$50-200/mes' },
                  { tool: 'Calendario online', cost: '$15-30/mes' },
                  { tool: 'Pasarela 1', cost: '% transacción' },
                  { tool: 'Email marketing', cost: '$20-100/mes' },
                  { tool: 'Atribución / analytics', cost: '$200-890/mes' },
                  { tool: 'Automatización (Zapier)', cost: '$30-100/mes' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-300 truncate">❌ {t.tool}</p>
                    <p className="text-[10px] text-red-400 font-bold whitespace-nowrap ml-2">{t.cost}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-red-500/20 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black text-red-400">$400-1,700+ /mes</p>
                <p className="text-[10px] text-gray-500 mt-1">Sin contar el caos operativo</p>
              </div>
            </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2 opacity-40 animate-bounce">↓</div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Reemplaza todo con</p>
              </div>
            </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={400}>
            <div className="md:col-span-1 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🦁</span>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Después · Una plataforma</p>
                </div>
                <div className="bg-[#0B0F1A]/50 border border-white/10 rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/cb-logo.webp" alt="" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                    <div>
                      <p className="text-base font-black">clientes.bot</p>
                      <p className="text-[10px] text-gray-500">Todo en uno · Multi-tenant · IA real</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      'CRM Pro + IA',
                      'Bot IA 24/7',
                      'Anuncios IA',
                      'Multi-pasarela',
                      'Agenda inteligente',
                      'Atribución completa',
                      'Multicanal',
                      'Voz IA',
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px] text-gray-300">
                        <span className="text-emerald-400">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Desde</p>
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">$97 /mes</p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">Una sola factura · 0 integraciones manuales</p>
                </div>
              </div>
            </div>
            </FadeInOnScroll>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/demo"
              target="_blank"
              className="inline-block text-sm px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              🚀 Ver el dashboard en vivo →
            </Link>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* CÓMO FUNCIONA — 5 pasos del flujo de ventas */}
      {/* ============================================================ */}
      <section id="producto" className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] text-emerald-400 uppercase tracking-[0.3em] font-black mb-4">Cómo funciona</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              5 pasos. <span className="text-emerald-400">1 flujo completo.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Del anuncio al cierre de venta, todo dentro de la misma plataforma. La IA aprende de cada conversión real.
            </p>
          </div>
          <div className="space-y-6">
            {([
              {
                n: '01',
                icon: '🎯',
                color: 'text-purple-400',
                bg: 'from-purple-500/10 to-purple-500/0',
                border: 'border-purple-500/30',
                title: 'Captura desde anuncios',
                desc: 'La IA crea campañas Click-to-WhatsApp optimizadas con copy persuasivo, 3 formatos de imagen y targeting profesional. Cada clic dispara una conversación con tu bot.',
                metrics: [
                  { label: 'Wizard guiado', value: '8 pasos' },
                  { label: 'Variantes IA', value: '5+ por anuncio' },
                  { label: 'Canales', value: 'WA · IG · FB' },
                ],
              },
              {
                n: '02',
                icon: '🤖',
                color: 'text-emerald-400',
                bg: 'from-emerald-500/10 to-emerald-500/0',
                border: 'border-emerald-500/30',
                title: 'IA responde automáticamente',
                desc: 'Tu vendedor IA atiende 24/7 con tono y conocimiento de tu negocio. Entiende audios, recuerda clientes anteriores y califica leads con preguntas inteligentes.',
                metrics: [
                  { label: 'Disponibilidad', value: '24/7' },
                  { label: 'Memoria', value: 'Permanente' },
                  { label: 'Idiomas', value: 'Multi-idioma' },
                ],
              },
              {
                n: '03',
                icon: '💳',
                color: 'text-yellow-400',
                bg: 'from-yellow-500/10 to-yellow-500/0',
                border: 'border-yellow-500/30',
                title: 'Agenda o cobra en el chat',
                desc: 'El bot envía links de pago seguros o muestra disponibilidad real de tu agenda. El cliente paga o reserva sin salir de WhatsApp. Conversión 3x más alta que un carrito web.',
                metrics: [
                  { label: 'Pasarelas', value: '7+ integradas' },
                  { label: 'Citas', value: 'Auto-confirmadas' },
                  { label: 'Recordatorios', value: '24h + 1h antes' },
                ],
              },
              {
                n: '04',
                icon: '👥',
                color: 'text-indigo-400',
                bg: 'from-indigo-500/10 to-indigo-500/0',
                border: 'border-indigo-500/30',
                title: 'CRM organiza solo',
                desc: 'Cada lead se mueve por el embudo automáticamente. La IA puntúa probabilidad de cierre, asigna agente, captura email/ciudad/documento. Tu equipo solo habla con los listos para comprar.',
                metrics: [
                  { label: 'Etapas Kanban', value: 'Automáticas' },
                  { label: 'Lead scoring', value: 'IA 0-100%' },
                  { label: 'Asignación', value: 'Round-robin' },
                ],
              },
              {
                n: '05',
                icon: '📈',
                color: 'text-sky-400',
                bg: 'from-sky-500/10 to-sky-500/0',
                border: 'border-sky-500/30',
                title: 'IA optimiza tus anuncios con ventas reales',
                desc: 'Los datos completos de cada venta vuelven a Meta. El algoritmo de Facebook aprende de COMPRAS, no de clics, y reduce tu costo por adquisición 30-50% en 60 días. Esto es lo que cambia todo.',
                metrics: [
                  { label: 'Match rate', value: '7-8/10' },
                  { label: 'CPL reducido', value: '30-50%' },
                  { label: 'Cron diario', value: 'IA recomienda' },
                ],
              },
            ] as any[]).map((step, i) => (
              <FadeInOnScroll key={i} delay={i * 80}>
              <div
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gradient-to-br ${step.bg} border ${step.border} rounded-3xl p-6 md:p-8 transition-all hover:scale-[1.01]`}
              >
                <div className="md:col-span-1 flex md:flex-col items-center gap-4 md:gap-2">
                  <p className={`text-6xl md:text-7xl font-black ${step.color} opacity-30 leading-none`}>{step.n}</p>
                  <p className="text-4xl md:text-5xl">{step.icon}</p>
                </div>
                <div className="md:col-span-7">
                  <h3 className="text-xl md:text-2xl font-black mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                <div className="md:col-span-4 grid grid-cols-3 gap-2">
                  {step.metrics.map((m: any, j: number) => (
                    <div key={j} className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-center">
                      <p className="text-[8px] text-gray-500 uppercase tracking-widest">{m.label}</p>
                      <p className={`text-xs font-black ${step.color} mt-1`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              </FadeInOnScroll>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-sm text-gray-400 mb-4 max-w-xl mx-auto">
              Un solo flujo. Una sola plataforma. <span className="text-white font-bold">Resultado:</span> 2-5x más ROI publicitario sin trabajo extra.
            </p>
            <Link
              href="/demo"
              target="_blank"
              className="inline-block text-sm px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              🎬 Ver el flujo completo en vivo →
            </Link>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* COMPARATIVA — Por qué nosotros */}
      {/* ============================================================ */}
      <section id="comparativa" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-yellow-400 uppercase tracking-[0.3em] font-black mb-4">¿Por qué nosotros?</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Lo que <span className="text-yellow-400">GoHighLevel</span><br />
              debería haber sido.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Mismo precio. Triple producto. Atribución que ninguno tiene. IA que aprende de ventas reales, no de clics.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Característica</th>
                    <th className="p-4 text-center bg-gradient-to-b from-indigo-500/10 to-transparent">
                      <div className="flex items-center justify-center gap-2">
                        <img src="/cb-logo.webp" alt="" className="w-5 h-5" />
                        <span className="font-black text-indigo-400">clientes.bot</span>
                      </div>
                    </th>
                    <th className="p-4 text-center text-gray-400 font-bold">GoHighLevel</th>
                    <th className="p-4 text-center text-gray-400 font-bold">Manychat</th>
                    <th className="p-4 text-center text-gray-400 font-bold">HubSpot</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    { f: 'WhatsApp Business nativo', us: '✅', ghl: '⚠️ Parcial', mc: '✅', hs: '❌' },
                    { f: 'Atribución completa Lead → Venta', us: '✅ Match 7-8/10', ghl: '❌', mc: '❌', hs: '✅ $890/mes' },
                    { f: 'IA real que aprende (no scripts)', us: '✅', ghl: '⚠️ Básica', mc: '❌', hs: '⚠️ Add-on' },
                    { f: 'Voz IA con llamadas reales', us: '✅', ghl: '❌', mc: '❌', hs: '❌' },
                    { f: 'IA optimiza tus anuncios sola', us: '✅ 5 motores', ghl: '❌', mc: '❌', hs: '❌' },
                    { f: '7+ pasarelas LATAM + globales', us: '✅', ghl: '❌ Solo Stripe', mc: '❌', hs: '⚠️ Stripe' },
                    { f: 'CRM Kanban + scoring IA', us: '✅', ghl: '⚠️ Básico', mc: '❌', hs: '✅ Caro' },
                    { f: 'Multicanal (WA + IG + FB)', us: '✅', ghl: '❌', mc: '⚠️ FB only', hs: '❌' },
                    { f: 'Generador IA de anuncios premium', us: '✅', ghl: '❌', mc: '❌', hs: '❌' },
                    { f: 'White-label total', us: '✅ Agency', ghl: '✅ $497+', mc: '❌', hs: '❌' },
                    { f: 'Multi-tenant arquitectura nativa', us: '✅', ghl: '⚠️ Lenta', mc: '❌', hs: '✅' },
                    { f: 'Precio base mensual', us: '$97', ghl: '$97', mc: '$15', hs: '$890+' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-4 font-bold text-gray-200">{r.f}</td>
                      <td className="p-4 text-center bg-indigo-500/[0.03]">
                        <span className="font-black text-emerald-400 text-xs md:text-sm">{r.us}</span>
                      </td>
                      <td className="p-4 text-center text-gray-400 text-xs md:text-sm">{r.ghl}</td>
                      <td className="p-4 text-center text-gray-400 text-xs md:text-sm">{r.mc}</td>
                      <td className="p-4 text-center text-gray-400 text-xs md:text-sm">{r.hs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-indigo-500/5 border-t border-indigo-500/20 text-center">
              <p className="text-[11px] text-indigo-300">
                💡 <span className="font-black">Resultado:</span> mismo precio que GoHighLevel, con la atribución de HubSpot ($890/mes) incluida + IA que ninguno tiene.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* MÓDULOS PRINCIPALES — 4 cards grandes */}
      {/* ============================================================ */}
      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-black mb-4">Producto</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              4 módulos. <span className="text-indigo-400">Conectados de fábrica.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Cada módulo es enterprise por sí solo. Juntos son imparables. Haz clic en cualquiera para verlo funcionando en vivo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeInOnScroll delay={0}>
            <Link href="/demo/crm" target="_blank" className="group bg-gradient-to-br from-indigo-500/10 to-indigo-500/0 border border-indigo-500/30 rounded-3xl p-6 hover:border-indigo-500/60 hover:scale-[1.01] transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-full">Ver en vivo ↗</div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">👥</span>
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">CRM + Multi-agente</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-indigo-400 transition-colors">Cada lead en su lugar.<br />Cada agente con su trabajo.</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">Kanban drag & drop, scoring IA de probabilidad de cierre, asignación automática, notas privadas, ranking de performance. Tu equipo cierra más en menos tiempo.</p>
              <div className="bg-[#0B0F1A]/50 border border-white/10 rounded-xl p-3 space-y-1.5">
                {[
                  { name: 'Carlos Méndez', stage: '✅ Ganado', score: 95, color: 'bg-emerald-500' },
                  { name: 'Mariana Quintero', stage: '🤝 Negociación', score: 75, color: 'bg-amber-500' },
                  { name: 'Mateo Jiménez', stage: '🔥 Interesado', score: 62, color: 'bg-sky-500' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center text-[8px] font-bold text-indigo-400">{l.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold truncate">{l.name}</p>
                      <p className="text-[8px] text-gray-500">{l.stage}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${l.color}`} style={{ width: `${l.score}%` }} />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold w-7 text-right">{l.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Link>
            </FadeInOnScroll>
            <FadeInOnScroll delay={100}>
            <Link href="/demo/ads" target="_blank" className="group bg-gradient-to-br from-purple-500/10 to-purple-500/0 border border-purple-500/30 rounded-3xl p-6 hover:border-purple-500/60 hover:scale-[1.01] transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-purple-500/20 text-purple-300 font-bold rounded-full">Ver en vivo ↗</div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">🚀</span>
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Anuncios IA + Atribución</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-purple-400 transition-colors">La IA crea, prueba y mejora<br />tus anuncios sola.</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">5 motores IA optimizando todos los días: detecta ganadores, mata perdedores, genera variantes, publica las mejores y aprende de los resultados. Tu inversión rinde 2-5x más.</p>
              <div className="bg-[#0B0F1A]/50 border border-white/10 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                  <span className="text-base">🏆</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate">Hook escasez · Ganador</p>
                    <p className="text-[8px] text-gray-500">CTR 4.99% · CPL $38</p>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 font-bold rounded">✨ Variantes</span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                  <span className="text-base">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate">Hook genérico · Perdedor</p>
                    <p className="text-[8px] text-gray-500">CTR 0.8% · CPL $145</p>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">AUTO-PAUSAR</span>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-emerald-300">🎯 La IA detecta esto cada día a las 6 AM</p>
                </div>
              </div>
            </Link>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
            <Link href="/demo/chat" target="_blank" className="group bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 border border-emerald-500/30 rounded-3xl p-6 hover:border-emerald-500/60 hover:scale-[1.01] transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full">Ver en vivo ↗</div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">💬</span>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Bot IA + Multicanal</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-emerald-400 transition-colors">Tu vendedor IA.<br />Nunca duerme. Nunca falla.</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">Atiende WhatsApp + Instagram + Facebook desde una sola bandeja. Memoria que recuerda a cada cliente, transcribe audios, agenda, cobra. Tu equipo solo entra cuando hace falta.</p>
              <div className="bg-[#0B0F1A]/50 border border-white/10 rounded-xl p-3 space-y-2">
                <div className="flex justify-end"><div className="bg-[#005c4b]/40 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[80%]"><p className="text-[10px]">¿Apto 2H con vista al lago?</p></div></div>
                <div className="flex justify-start"><div className="bg-[#1a1f2e] rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[80%]"><p className="text-[8px] text-emerald-400 font-bold mb-0.5">🤖 Bot IA</p><p className="text-[10px]">62m², vista al lago, $145k USD. Quedan 8 unidades 🏢 ¿Te envío el link de reserva?</p></div></div>
                <div className="flex justify-end"><div className="bg-[#005c4b]/40 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[80%]"><p className="text-[10px]">¡Sí!</p></div></div>
              </div>
            </Link>
            </FadeInOnScroll>
            <FadeInOnScroll delay={300}>
            <Link href="/demo/analytics" target="_blank" className="group bg-gradient-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/30 rounded-3xl p-6 hover:border-yellow-500/60 hover:scale-[1.01] transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-yellow-500/20 text-yellow-300 font-bold rounded-full">Ver en vivo ↗</div>
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 mb-4">
                <span className="text-sm">📈</span>
                <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">Pagos + Agenda + Reportes</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-yellow-400 transition-colors">Cobra, agenda y mide<br />sin moverte del chat.</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">7+ pasarelas de pago integradas, agenda inteligente con disponibilidad real, reportes con atribución completa Lead → Venta. Sabes qué te dio cada peso.</p>
              <div className="bg-[#0B0F1A]/50 border border-white/10 rounded-xl p-3 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 text-center"><p className="text-[7px] text-gray-500 uppercase">Revenue</p><p className="text-xs font-black text-purple-400">$2.1M</p></div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center"><p className="text-[7px] text-gray-500 uppercase">ROAS</p><p className="text-xs font-black text-yellow-400">514%</p></div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center"><p className="text-[7px] text-gray-500 uppercase">CPL</p><p className="text-xs font-black text-emerald-400">$58</p></div>
                </div>
                <div className="flex items-end gap-1 h-12 mt-2">
                  {[40, 25, 60, 35, 80, 50, 95, 70, 85, 65, 100, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-yellow-500 to-purple-500 rounded-t" style={{ height: `${h}%`, opacity: 0.4 + (i / 24) }} />
                  ))}
                </div>
              </div>
            </Link>
            </FadeInOnScroll>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* PRUEBA TÉCNICA — Badges enterprise */}
      {/* ============================================================ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-sky-400 uppercase tracking-[0.3em] font-black mb-4">Infraestructura</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Esto NO es un MVP.<br />
              <span className="text-sky-400">Es producto enterprise.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Construido sobre la misma arquitectura que usan Stripe, Linear y Vercel. Diseñado para escalar a millones de tenants sin tocar una línea de código.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: '🏢', title: 'Multi-tenant nativo', desc: 'Aislamiento estricto de datos por cliente · Multi-marca · Multi-sucursal' },
              { icon: '⚡', title: 'Serverless en AWS', desc: 'Lambda + DynamoDB con PITR · Auto-scaling · 99.9% uptime' },
              { icon: '🔒', title: 'Seguridad enterprise', desc: '2FA triple (Passkey/TOTP/Email) · Audit log · Backups continuos' },
              { icon: '🌐', title: 'Multi-canal oficial', desc: 'WhatsApp Business API · Instagram DM · Facebook Messenger · 100% nativo' },
              { icon: '🎯', title: 'Atribución profesional', desc: 'Conversions API completa · Match rate 7-8/10 · PII hasheado SHA-256' },
              { icon: '🧠', title: 'IA multi-modelo', desc: 'Cascada con failover automático · Memoria persistente · Aprendizaje continuo' },
              { icon: '🔄', title: 'Event-driven', desc: 'Crons distribuidos · Cola de eventos · Retry automático · Cero datos perdidos' },
              { icon: '📡', title: 'API REST + Webhooks', desc: 'Documentación pública · Rate limiting · Webhooks firmados HMAC' },
              { icon: '🏦', title: 'Multi-pasarela', desc: '7+ procesadores de pago globales y locales LATAM con conciliación automática' },
              { icon: '🌍', title: 'Multi-idioma', desc: 'Plantillas auto-traducidas · Detección de locale · Soporte ES/EN/PT/FR' },
              { icon: '📊', title: 'Cost-aware', desc: 'Free tier escalable · Pago por uso · Sin compromisos mensuales fijos' },
              { icon: '🚀', title: 'Deploy continuo', desc: 'Rollback en 1 clic · Versiones publicadas · Cero downtime en actualizaciones' },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-sky-500/30 transition-all">
                <p className="text-2xl mb-2">{t.icon}</p>
                <p className="text-xs font-black text-white mb-1">{t.title}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { v: '19', l: 'Tablas con PITR' },
              { v: '5', l: 'Motores IA en producción' },
              { v: '< 200ms', l: 'Latencia respuesta bot' },
              { v: '99.9%', l: 'Uptime garantizado' },
            ].map((s, i) => (
              <div key={i} className="bg-gradient-to-br from-sky-500/5 to-sky-500/0 border border-sky-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-sky-400">{s.v}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* PARA QUIÉN — Casos de uso */}
      {/* ============================================================ */}
      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-purple-400 uppercase tracking-[0.3em] font-black mb-4">Para quién</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Diseñado para negocios<br />que <span className="text-purple-400">venden por WhatsApp.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Si tu negocio tiene un número de WhatsApp y atiende clientes ahí, vas a triplicar lo que vendes.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '🏥', name: 'Clínicas y consultorios', desc: 'Citas + recordatorios + cobros' },
              { icon: '🏢', name: 'Inmobiliarias', desc: 'Catálogo + visitas + separaciones' },
              { icon: '🎓', name: 'Escuelas y academias', desc: 'Inscripciones + pagos + cohortes' },
              { icon: '🛍️', name: 'E-commerce', desc: 'Catálogo + checkout + envío' },
              { icon: '💇', name: 'Salones de belleza', desc: 'Citas + paquetes + fidelización' },
              { icon: '🏋️', name: 'Gimnasios y fitness', desc: 'Membresías + clases + planes' },
              { icon: '🍽️', name: 'Restaurantes', desc: 'Pedidos + reservas + delivery' },
              { icon: '🔧', name: 'Servicios profesionales', desc: 'Cotizaciones + agenda + cobros' },
              { icon: '🚗', name: 'Concesionarios', desc: 'Test drives + financiación + leads' },
              { icon: '✈️', name: 'Agencias de viajes', desc: 'Paquetes + reservas + pagos' },
              { icon: '🎯', name: 'Coaches y mentores', desc: 'Inscripciones + sesiones + pagos' },
              { icon: '🏢', name: 'Agencias de marketing', desc: 'Multi-cliente + white-label' },
            ].map((b, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all group text-center">
                <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</p>
                <p className="text-xs font-black mb-1">{b.name}</p>
                <p className="text-[9px] text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* PLANES — Conectados al backend /billing/plans-public */}
      {/* ============================================================ */}
      <section id="planes" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-indigo-400 uppercase tracking-[0.3em] font-black mb-4">Planes</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Pricing transparente.<br />
              <span className="text-indigo-400">Sin sorpresas.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mb-8">
              14 días gratis. Sin tarjeta de crédito. Cancela cuando quieras. Cambia de plan en cualquier momento.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setBillingAnnual(false)}
                className={`text-sm px-5 py-2 rounded-lg font-bold transition-all ${
                  !billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingAnnual(true)}
                className={`text-sm px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  billingAnnual ? 'bg-white/10 text-white' : 'text-gray-500'
                }`}
              >
                Anual
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">-20%</span>
              </button>
            </div>
          </div>
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 animate-pulse h-[600px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => {
                const theme = COLOR_THEMES[plan.color_theme] || COLOR_THEMES.indigo;
                const priceMonthly = billingAnnual ? Math.round(plan.price_annual / 12) : plan.price_usd;
                const href = plan.btn_href_type === 'whatsapp'
                  ? (plan.btn_href_whatsapp || 'https://wa.me/573022205845')
                  : '/auth/login';
                return (
                  <div
                    key={plan.key}
                    className={`rounded-3xl border p-6 md:p-8 flex flex-col text-left transition-all relative ${
                      plan.popular ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30 scale-[1.03] z-10' : 'bg-white/[0.03]'
                    } ${theme.color}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        ⭐ Más popular
                      </div>
                    )}
                    <h3 className="text-lg font-black mb-1">{plan.name}</h3>
                    <p className={`text-[10px] uppercase tracking-widest mb-6 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {plan.subtitle}
                    </p>
                    <div className="mb-1">
                      <span className="text-4xl font-black">${priceMonthly}</span>
                      <span className={`text-sm font-medium ml-1 ${plan.popular ? 'opacity-70' : 'text-gray-600'}`}>/mes</span>
                    </div>
                    {billingAnnual && (
                      <p className={`text-[10px] mb-1 ${plan.popular ? 'text-emerald-200' : 'text-emerald-400'}`}>
                        Facturado anualmente — ${plan.price_annual}/año
                      </p>
                    )}
                    <p className={`text-[10px] mb-6 ${plan.popular ? 'text-indigo-200' : 'text-gray-600'}`}>
                      USD · {billingAnnual ? 'facturación anual' : 'facturación mensual'}
                    </p>
                    <ul className="space-y-2.5 mb-8 flex-1 text-sm">
                      {plan.features_ui.map((f, i) => (
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
                          {f.tooltip_title && (
                            <FeatureTooltip title={f.tooltip_title} desc={f.tooltip_desc} />
                          )}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={href}
                      className={`w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all ${theme.btnClass}`}
                    >
                      {plan.btn_label}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 md:p-8 text-center">
            <p className="text-[10px] text-amber-400 uppercase tracking-[0.3em] font-black mb-3">💰 Programa de afiliados</p>
            <h3 className="text-xl md:text-2xl font-black mb-2">
              Gana 40% el primer año + <span className="text-amber-400">30% lifetime</span>
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-4">
              La mejor comisión de la industria. Sin sub-tiers complicados. Cookie de 90 días. Pagos mensuales.
            </p>
            <Link
              href="/affiliates"
              className="inline-block text-xs px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Ver programa de afiliados →
            </Link>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* FAQ */}
      {/* ============================================================ */}
      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em] font-black mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: '¿Tengo que cambiar mi número de WhatsApp?', a: 'Puedes usar tu número actual o uno nuevo. Si usas el actual, se transforma en WhatsApp Business API en 2 minutos y el bot empieza a responder automáticamente. Recomendamos una línea dedicada para mantener tu personal aparte.' },
              { q: '¿Qué tan rápido se configura?', a: 'En menos de 10 minutos tienes el bot respondiendo en tu WhatsApp. Conectas con 1 clic vía Facebook (sin QR), subes tu catálogo, ajustas el tono y listo. El wizard te guía paso a paso. Si tienes plan Agency, un especialista te configura todo sin costo extra.' },
              { q: '¿Qué pasa si el bot no sabe responder algo?', a: 'El bot transfiere automáticamente la conversación a un agente humano de tu equipo. Tu agente recibe notificación instantánea por email, push y sonido. Mientras escribe, el bot se pausa solo para evitar duplicados — tecnología patrón "auto-takeover".' },
              { q: '¿Funciona en mi país?', a: 'Sí, funcionamos a nivel global. Integramos pasarelas internacionales (Stripe, PayPal) y locales según tu mercado (Bold, Wompi, MercadoPago, OpenPay, PayU y más). Si tu pasarela favorita no está, la integramos sin costo en menos de 48h.' },
              { q: '¿Cómo es la atribución completa Lead → Venta?', a: 'Cuando un cliente paga, enviamos a Meta los datos del comprador hasheados con SHA-256: email, ciudad, documento, click ID. El algoritmo de Facebook aprende de COMPRAS REALES, no de clics. Resultado: tu costo por venta baja 30-50% en 60 días. Esto es lo que HubSpot cobra $890/mes — aquí va incluido.' },
              { q: '¿Qué tan real es la IA?', a: 'No son scripts pre-armados. Es IA conversacional con memoria persistente que recuerda a cada cliente como persona, entiende audios, detecta intención de compra, califica leads automáticamente y se adapta a tu tono de marca. Cascada con failover automático en 3 modelos para 99.9% de disponibilidad.' },
              { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin penalidad. Los 14 días de prueba son gratis y no pedimos tarjeta de crédito para empezar. Después puedes cancelar con 1 clic desde el dashboard. Sin contratos largos, sin letras pequeñas.' },
              { q: '¿Necesito conocimientos técnicos?', a: 'No. Todo se configura con clicks. El wizard te guía paso a paso. Si en algún momento necesitas ayuda, nuestro equipo te asiste por WhatsApp en menos de 4h hábiles (1h en plan Agency).' },
              { q: '¿Puedo gestionar varios negocios desde una cuenta?', a: 'Sí, con el plan Growth manejas hasta 5 sub-cuentas (sucursales o marcas). Con el plan Agency manejas clientes ilimitados con white-label total — tu logo, tu dominio, tu marca. Tus clientes finales nunca saben que existimos.' },
              { q: '¿Mis datos están seguros?', a: 'Sí. Arquitectura multi-tenant con aislamiento estricto (los datos de un cliente jamás se cruzan con otro), backups continuos PITR (point-in-time recovery), 2FA obligatorio para admins (Passkey/TOTP/Email), audit log de toda acción administrativa, y SSL en todos los endpoints. Construido sobre AWS con SLA 99.9%.' },
              { q: '¿Qué pasa si supero mi quota de mensajes?', a: 'Te avisamos cuando llegues al 80% de tu cuota mensual. Puedes comprar packs adicionales (1k/$19, 5k/$79, 20k/$249) que NO expiran nunca y se suman a tu plan. O subir de plan en cualquier momento sin perder configuración.' },
              { q: '¿Qué incluye el demo público?', a: 'El dashboard completo con datos de un negocio ficticio (Inmobiliaria Aurora). Puedes navegar por CRM, conversaciones, anuncios IA, reportes, suscripción — exactamente lo mismo que verás al activar tu cuenta. Cero registro, cero compromiso.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-all">
                  <p className="text-sm font-bold pr-4">{faq.q}</p>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-20 px-6 border-t border-white/5">
        <FadeInOnScroll>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] -z-10" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-emerald-600/8 blur-[150px] -z-10" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-purple-600/8 blur-[150px] -z-10" />
          <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-emerald-900/20 border border-white/10 p-10 md:p-16 rounded-3xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-gray-300 font-bold tracking-wide">14 días gratis · Sin tarjeta · Setup en 10 min</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              Cada día sin esto<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">es un día perdiendo plata.</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Cada mensaje sin responder es un cliente que se va a tu competencia. Cada anuncio sin atribución es plata mal invertida. Cambia eso hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/demo"
                target="_blank"
                className="bg-white text-indigo-700 hover:bg-gray-100 hover:scale-[1.02] px-8 py-4 rounded-2xl font-black text-base transition-all shadow-2xl inline-flex items-center justify-center gap-2"
              >
                Probar el dashboard en vivo
                <span className="opacity-60">↗</span>
              </Link>
              <Link
                href="/auth/login"
                className="bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] px-8 py-4 rounded-2xl font-black text-base transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center justify-center gap-2"
              >
                Empezar 14 días gratis
              </Link>
            </div>
            <p className="text-[11px] text-gray-500">
              Sin tarjeta · Sin código · Cancela cuando quieras
            </p>
          </div>
        </div>
        </FadeInOnScroll>
      </section>
      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="py-12 border-t border-white/5 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/cb-logo.webp" alt="clientes.bot" className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                <span className="text-lg font-black tracking-tighter">clientes.bot</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-sm">
                El Revenue OS para negocios que venden por WhatsApp. CRM, IA, Atribución y Pagos en una sola plataforma.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/573022205845" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-500 hover:text-emerald-400 flex items-center justify-center transition-all">💬</a>
                <a href="https://instagram.com/clientes.bot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-500 hover:text-pink-400 flex items-center justify-center transition-all">📸</a>
                <a href="https://facebook.com/clientesbot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 flex items-center justify-center transition-all">👤</a>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Producto</p>
              <div className="space-y-2">
                <a href="#producto" className="block text-xs text-gray-500 hover:text-white transition-colors">Cómo funciona</a>
                <Link href="/demo" target="_blank" className="block text-xs text-gray-500 hover:text-white transition-colors">Demo en vivo ↗</Link>
                <a href="#comparativa" className="block text-xs text-gray-500 hover:text-white transition-colors">¿Por qué nosotros?</a>
                <a href="#planes" className="block text-xs text-gray-500 hover:text-white transition-colors">Planes</a>
                <Link href="/affiliates" className="block text-xs text-gray-500 hover:text-white transition-colors">Programa de afiliados</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Empresa</p>
              <div className="space-y-2">
                <a href="https://wa.me/573022205845" target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-500 hover:text-white transition-colors">Contacto</a>
                <a href="mailto:soporte@clientes.bot" className="block text-xs text-gray-500 hover:text-white transition-colors">soporte@clientes.bot</a>
                <Link href="/auth/login" className="block text-xs text-gray-500 hover:text-white transition-colors">Iniciar sesión</Link>
                <Link href="/auth/login" className="block text-xs text-gray-500 hover:text-white transition-colors">Crear cuenta</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Legal</p>
              <div className="space-y-2">
                <Link href="/terminos" className="block text-xs text-gray-500 hover:text-white transition-colors">Términos de servicio</Link>
                <Link href="/politica-de-privacidad" className="block text-xs text-gray-500 hover:text-white transition-colors">Política de privacidad</Link>
                <Link href="/politica-de-privacidad#cookies" className="block text-xs text-gray-500 hover:text-white transition-colors">Política de cookies</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-600">© 2026 SGC Technology S.A.S. · Todos los derechos reservados.</p>
            <p className="text-[10px] text-gray-600">Hecho con 🦁 para negocios que rugen.</p>
          </div>
        </div>
      </footer>
      <ChatWidget />
      <InstallPWAPrompt variant="landing" />
    </div>
  );
}