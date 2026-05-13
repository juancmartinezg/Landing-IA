'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function WizardPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const [quota, setQuota] = useState<any>(null);
  const [hasBrandDna, setHasBrandDna] = useState<boolean | null>(null);
  const [strategy, setStrategy] = useState('sell');
  const [channels, setChannels] = useState<string[]>(['facebook', 'instagram', 'whatsapp']);
  const [language, setLanguage] = useState('es');
  const [services, setServices] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [brandAssets, setBrandAssets] = useState<any[]>([]);
  const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
  const [refMode, setRefMode] = useState<'real' | 'logo' | 'generic'>('real');
  const [plan, setPlan] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [copies, setCopies] = useState<any[]>([]);
  const [generatingCopies, setGeneratingCopies] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [budgetDaily, setBudgetDaily] = useState('20000');
  const [duration, setDuration] = useState('7');
  const [campaignName, setCampaignName] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/brand-dna`, { headers: h }).then(r => r.ok ? r.json() : null).then(d => setHasBrandDna(d?.ok || false)).catch(() => setHasBrandDna(false));
    fetch(`${API_URL}/ads/wizard/check-quota`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' } }).then(r => r.json()).then(d => setQuota(d)).catch(() => {});
    fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).then(d => setServices(d.services || [])).catch(() => {});
    fetch(`${API_URL}/brand-assets`, { headers: h }).then(r => r.json()).then(d => setBrandAssets(d.assets || [])).catch(() => {});
  }, []);
  const toggleChannel = (ch: string) => setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const addBenefit = () => { if (newBenefit.trim() && benefits.length < 10) { setBenefits([...benefits, newBenefit.trim()]); setNewBenefit(''); } };
  const toggleRef = (url: string) => setSelectedRefs(prev => prev.includes(url) ? prev.filter(u => u !== url) : prev.length < 5 ? [...prev, url] : prev);
  const toggleImage = (idx: number) => setSelectedImages(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 3 ? [...prev, idx] : prev);
  const generatePlanAndImages = async () => {
    setGeneratingImages(true); setPreviewImages([]); setSelectedImages([]);
    try {
      let p = plan;
      if (!p) {
        setGeneratingPlan(true);
        const sr = await fetch(`${API_URL}/ads/wizard/generate-strategy`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ strategy, channels, language, product_slug: selectedSlug, benefits, use_brand_dna: true }) });
        const sd = await sr.json();
        if (!sd.ok) { showToast('❌ ' + (sd.error || sd.message || 'Error')); setGeneratingImages(false); setGeneratingPlan(false); return; }
        p = sd.plan; setPlan(p); setGeneratingPlan(false);
      }
      showToast('⏳ Generando imágenes con IA...');
      const ir = await fetch(`${API_URL}/ads/wizard/generate-images-preview`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ image_prompts: p.image_prompts || [], brand_asset_urls: refMode === 'real' ? selectedRefs : [] }) });
      const id = await ir.json();
      if (id.ok) { setPreviewImages(id.images || []); showToast(`✅ ${id.total_ok} imágenes en ${id.elapsed_seconds}s`); }
      else showToast('❌ ' + (id.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setGeneratingImages(false); setGeneratingPlan(false);
  };
  const generateCopies = async () => {
    if (!plan) return; setGeneratingCopies(true);
    try {
      const svc = services.find((s: any) => s.slug === selectedSlug);
      const r = await fetch(`${API_URL}/ads/wizard/generate-copies`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ copy_angles: plan.copy_angles || [], product_name: svc?.name || selectedSlug || 'Mi producto', cta_text: plan.cta_text || 'Compra ahora', tone: plan.tone || 'profesional', language, benefits, use_brand_dna: true }) });
      const d = await r.json();
      if (d.ok) { setCopies(d.copies || []); setCampaignName(svc?.name ? `${svc.name} - ${new Date().toLocaleDateString()}` : `Campaña ${new Date().toLocaleDateString()}`); showToast(`✅ ${(d.copies || []).length} textos generados`); }
      else showToast('❌ ' + (d.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setGeneratingCopies(false);
  };
  const launchCampaign = async () => {
    setLaunching(true);
    try {
      const urls = selectedImages.map(idx => previewImages.find((i: any) => i.index === idx)?.image_url || '').filter((u: string) => u);
      const r = await fetch(`${API_URL}/ads/campaigns/publish`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: campaignName, objective: strategy === 'branding' || strategy === 'promote' ? 'OUTCOME_AWARENESS' : 'OUTCOME_ENGAGEMENT', budget_daily: parseInt(budgetDaily) || 20000, variants: copies.slice(0, urls.length).map((c: any, i: number) => ({ headline: campaignName?.substring(0, 60), text: typeof c === 'string' ? c : c.text, description: plan?.cta_text || '', image_url: urls[i] || urls[0] })), country: 'CO', duration, service_slug: selectedSlug, age_min: 18, age_max: 65, gender: 'all', cities: [], interests: [] }) });
      if (r.ok) { showToast('🚀 ¡Campaña publicada!'); setTimeout(() => { window.location.href = '/dashboard/ads'; }, 2000); }
      else { const d = await r.json(); showToast('❌ ' + (d.error || 'Error')); }
    } catch { showToast('Error de conexión'); }
    setLaunching(false);
  };
  const STEPS = [{n:1,l:'🧬'},{n:2,l:'🎯'},{n:3,l:'📢'},{n:4,l:'🌐'},{n:5,l:'📦'},{n:6,l:'📸'},{n:7,l:'🎨'},{n:8,l:'📝'}];
  if (hasBrandDna === null) return <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-sm text-gray-400">Cargando wizard...</p></div>;
    return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/ads" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
          <h1 className="text-xl font-bold">Wizard de Campaña ✨</h1>
          {step > 1 && (
            <button onClick={() => {
              if (!confirm('¿Descartar el borrador? Perderás todo el progreso.')) return;
              setStep(1); setPlan(null); setPreviewImages([]); setSelectedImages([]); setCopies([]); setBenefits([]); setSelectedRefs([]);
              showToast('Borrador descartado');
            }} className="text-[9px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition-all">
              🗑️ Descartar
            </button>
          )}
        </div>
        {quota && <span className="text-[10px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">🎨 {quota.source === 'plan_unlimited' ? '∞' : quota.remaining_plan} wizards</span>}
      </div>
      <div className="flex gap-1 mb-8">
        {STEPS.map(s => (
          <button key={s.n} onClick={() => s.n <= step && setStep(s.n)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${s.n === step ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : s.n < step ? 'bg-emerald-600/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
            {s.l}
          </button>
        ))}
      </div>
      {quota && !quota.can_generate && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-red-400 font-bold mb-2">⚠️ Sin wizards disponibles</p>
          <p className="text-xs text-gray-400 mb-3">{quota.message}</p>
          <Link href="/dashboard/billing" className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold transition-all text-white">Comprar pack de wizards</Link>
        </div>
      )}
      {quota?.can_generate && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          {step === 1 && (
            <div className="text-center max-w-md mx-auto">
              <p className="text-3xl mb-4">🧬</p>
              <h2 className="text-lg font-bold mb-2">ADN de tu marca</h2>
              {hasBrandDna ? (
                <>
                  <p className="text-xs text-emerald-400 mb-4">✅ Tu ADN de marca está generado. La IA lo usará para personalizar toda la campaña.</p>
                  <button onClick={() => setStep(2)} className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl text-sm font-bold transition-all">Siguiente →</button>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-4">Primero necesitas generar el ADN de tu marca. Ve a Configuración y genera tu ADN (~30 segundos).</p>
                  <Link href="/dashboard/settings" className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl text-sm font-bold transition-all inline-block">Ir a generar ADN 🧬</Link>
                </>
              )}
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold mb-2">¿Cuál es tu objetivo?</h2>
              <p className="text-xs text-gray-400 mb-4">Esto define cómo la IA optimiza imágenes y textos.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[{id:'sell',l:'💰 Vender',d:'Generar compras/reservas inmediatas'},{id:'promote',l:'📢 Promocionar',d:'Dar a conocer a nuevas audiencias'},{id:'lead_gen',l:'🎯 Captar leads',d:'Capturar datos de interesados'},{id:'branding',l:'🌟 Branding',d:'Posicionar marca y recordación'}].map(o => (
                  <button key={o.id} onClick={() => setStrategy(o.id)}
                    className={`p-4 rounded-xl text-left transition-all border ${strategy === o.id ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                    <p className="text-sm font-bold">{o.l}</p>
                    <p className="text-[10px] text-gray-500">{o.d}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold">Siguiente →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold mb-2">¿Dónde quieres publicar?</h2>
              <p className="text-xs text-gray-400 mb-4">Selecciona los canales para tu campaña.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[{id:'facebook',l:'Facebook Ads',e:'📘',on:true},{id:'instagram',l:'Instagram Ads',e:'📸',on:true},{id:'whatsapp',l:'WhatsApp CTW',e:'💚',on:true},{id:'tiktok',l:'TikTok Ads',e:'🎵',on:false},{id:'google',l:'Google Ads',e:'🔍',on:false}].map(ch => (
                  <button key={ch.id} onClick={() => ch.on && toggleChannel(ch.id)} disabled={!ch.on}
                    className={`p-3 rounded-xl text-left transition-all border relative ${!ch.on ? 'opacity-40 cursor-not-allowed border-white/5' : channels.includes(ch.id) ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                    <p className="text-sm font-bold">{ch.e} {ch.l}</p>
                    {!ch.on && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold absolute top-2 right-2">Próximamente</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                <button onClick={() => setStep(4)} disabled={channels.length === 0} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">Siguiente →</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Idioma de los anuncios</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[{id:'es',l:'🇪🇸 Español'},{id:'en',l:'🇺🇸 English'},{id:'pt',l:'🇧🇷 Português'},{id:'fr',l:'🇫🇷 Français'}].map(lg => (
                  <button key={lg.id} onClick={() => setLanguage(lg.id)}
                    className={`p-3 rounded-xl text-center text-sm font-bold transition-all border ${language === lg.id ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                    {lg.l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                <button onClick={() => setStep(5)} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold">Siguiente →</button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Producto y beneficios</h2>
              <p className="text-xs text-gray-400 mb-4">Selecciona qué promocionar y sus beneficios clave.</p>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                <button onClick={() => setSelectedSlug('')} className={`w-full p-3 rounded-xl text-left border ${!selectedSlug ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02]'}`}>
                  <p className="text-sm font-bold">🏢 Todo mi negocio</p>
                </button>
                {services.filter((s: any) => s.active !== false).map((s: any) => (
                  <button key={s.slug} onClick={() => setSelectedSlug(s.slug)} className={`w-full p-3 rounded-xl text-left border ${selectedSlug === s.slug ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02]'}`}>
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-[10px] text-gray-500">${(s.pricing?.regular_price || 0).toLocaleString()}</p>
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-300 mb-2">Beneficios clave ({benefits.length}/10)</p>
                <div className="flex gap-2 mb-2">
                  <input value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addBenefit()} placeholder="Ej: Certificado incluido" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 text-white" />
                  <button onClick={addBenefit} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs font-bold">+ Agregar</button>
                </div>
                {benefits.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{benefits.map((b, i) => (<span key={i} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 flex items-center gap-1">{b} <button onClick={() => setBenefits(benefits.filter((_, j) => j !== i))} className="text-red-400">✕</button></span>))}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(4)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                <button onClick={() => setStep(6)} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold">Siguiente →</button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Referencias visuales</h2>
              <p className="text-xs text-gray-400 mb-4">¿Tienes fotos reales de tu negocio?</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{id:'real' as const,l:'🟢 Sí, tengo fotos',d:'Recomendado +400% CTR'},{id:'logo' as const,l:'🟡 Solo mi logo',d:'IA inventa + tu logo'},{id:'generic' as const,l:'🔴 No tengo nada',d:'IA inventa todo (genérico)'}].map(o => (
                  <button key={o.id} onClick={() => setRefMode(o.id)}
                    className={`p-3 rounded-xl text-center border ${refMode === o.id ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02]'}`}>
                    <p className="text-xs font-bold">{o.l}</p>
                    <p className="text-[9px] text-gray-500">{o.d}</p>
                  </button>
                ))}
              </div>
              {refMode === 'real' && brandAssets.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-300 mb-2">Selecciona hasta 5 fotos de tu biblioteca:</p>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {brandAssets.map((a: any) => (
                      <button key={a.asset_id} onClick={() => toggleRef(a.s3_url)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedRefs.includes(a.s3_url) ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-white/20'}`}>
                        <img src={a.thumbnail_url || a.s3_url} alt={a.name} className="w-full aspect-square object-cover" loading="lazy" />
                        {selectedRefs.includes(a.s3_url) && <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center"><span className="text-white text-lg font-bold">✓</span></div>}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-500 mt-2">{selectedRefs.length}/5 seleccionadas</p>
                </div>
              )}
              {refMode === 'real' && brandAssets.length === 0 && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-yellow-400">⚠️ No tienes fotos en tu biblioteca. <Link href="/dashboard/settings" className="text-indigo-400 underline">Sube fotos primero →</Link></p>
                </div>
              )}
              {refMode === 'generic' && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-red-400">⚠️ Sin fotos reales tu anuncio será más genérico (CTR estimado -40%). ¿Seguro que no puedes subir al menos 1 foto?</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setStep(5)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                <button onClick={() => { setStep(7); generatePlanAndImages(); }} disabled={generatingImages} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  {generatingImages ? '⏳ Generando...' : '🎨 Generar imágenes →'}
                </button>
              </div>
            </div>
          )}
          {step === 7 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Elige tus imágenes</h2>
              <p className="text-xs text-gray-400 mb-4">Selecciona hasta 3 imágenes para tu campaña. La IA las generó según tu marca y producto.</p>
              {generatingImages || generatingPlan ? (
                <div className="flex flex-col items-center py-16">
                  <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-400">{generatingPlan ? 'Creando estrategia con IA...' : 'Generando imágenes con IA (~20s)...'}</p>
                </div>
              ) : previewImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm mb-4">No se generaron imágenes. Intenta de nuevo.</p>
                  <button onClick={generatePlanAndImages} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold">🔄 Reintentar</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {previewImages.filter((img: any) => img.ok).map((img: any) => (
                      <button key={img.index} onClick={() => toggleImage(img.index)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${selectedImages.includes(img.index) ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-600/30' : 'border-transparent hover:border-white/20'}`}>
                        <img src={img.image_url} alt={`Variante ${img.index + 1}`} className="w-full aspect-square object-cover" loading="lazy" />
                        {selectedImages.includes(img.index) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {selectedImages.indexOf(img.index) + 1}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mb-4">{selectedImages.length}/3 seleccionadas — click para seleccionar/deseleccionar</p>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(6)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                    <button onClick={generatePlanAndImages} className="border border-white/10 px-4 py-3 rounded-xl text-xs font-bold hover:bg-white/5">🔄 Regenerar</button>
                    <button onClick={() => { setStep(8); generateCopies(); }} disabled={selectedImages.length === 0 || generatingCopies} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                      {generatingCopies ? '⏳...' : `📝 Generar textos (${selectedImages.length} img) →`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {step === 8 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Textos y lanzamiento</h2>
              {generatingCopies ? (
                <div className="flex flex-col items-center py-12">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs text-gray-400">Generando textos persuasivos con IA...</p>
                </div>
              ) : copies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">No se generaron textos.</p>
                  <button onClick={generateCopies} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold">🔄 Reintentar</button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-4">Revisa los textos generados. Puedes editarlos. El texto de la primera variante se incrustará en las imágenes.</p>
                  <div className="space-y-3 mb-6">
                    {copies.map((c: any, i: number) => (
                      <div key={i} className={`bg-white/[0.02] border rounded-xl p-3 ${i === 0 ? 'border-purple-500/50 ring-1 ring-purple-500/30' : 'border-white/5'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">V{i + 1}</span>
                          <span className="text-[9px] text-gray-500">{c.angle}</span>
                          {i === 0 && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">📸 Se incrusta en imagen</span>}
                          <span className="text-[9px] text-gray-600 ml-auto">{c.char_count || c.text?.length || 0} chars</span>
                        </div>
                        <textarea value={c.text} onChange={(e) => { const updated = [...copies]; updated[i] = { ...c, text: e.target.value }; setCopies(updated); }}
                          rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white resize-none" />
                        {c.social_proof_used && <p className="text-[9px] text-emerald-400 mt-1 italic">🛡️ {c.social_proof_used}</p>}
                      </div>
                    ))}
                  </div>
                  {previewImages.some((p: any) => p.overlay_applied) && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-emerald-400 mb-3">✅ Preview con texto incrustado</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedImages.map(idx => {
                          const img = previewImages.find((i: any) => i.index === idx);
                          return img ? (
                            <div key={idx} className="rounded-xl overflow-hidden border border-emerald-500/30">
                              <img src={img.image_url} alt={`Final ${idx}`} className="w-full aspect-square object-cover" />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6">
                    <h3 className="text-xs font-bold text-gray-300 mb-3">⚙️ Configuración de campaña</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Nombre</label>
                        <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Presupuesto diario</label>
                        <input type="number" value={budgetDaily} onChange={(e) => setBudgetDaily(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Duración (días)</label>
                        <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                          <option value="7">7 días</option><option value="15">15 días</option><option value="30">30 días</option><option value="0">Indefinida</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(7)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                    {!previewImages.some((p: any) => p.overlay_applied) ? (
                      <button onClick={async () => {
                        if (copies.length > 0 && selectedImages.length > 0) {
                          showToast('⏳ Incrustando texto en imágenes (~30s)...');
                          const hookText = (copies[0]?.text || '').split('.')[0]?.substring(0, 30) || 'Ver más';
                          let success = 0;
                          for (let i = 0; i < selectedImages.length; i++) {
                            const img = previewImages.find((im: any) => im.index === selectedImages[i]);
                            if (!img?.image_url) continue;
                            try {
                              const ovRes = await fetch(`${API_URL}/ads/overlay-and-resize`, {
                                method: 'POST',
                                headers: { ...h, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ image_url: img.image_url, overlay_text: hookText, include_overlay: true }),
                              });
                              const ovData = await ovRes.json();
                              if (ovData.ok && ovData.square) {
                                setPreviewImages((prev: any[]) => prev.map((p: any) => p.index === selectedImages[i] ? { ...p, image_url: ovData.square, overlay_applied: true } : p));
                                success++;
                              }
                            } catch {}
                          }
                          if (success > 0) showToast(`✅ Texto incrustado en ${success} imagen${success > 1 ? 'es' : ''}. Revisa el preview abajo.`);
                          else showToast('❌ No se pudo incrustar el texto');
                        }
                      }} disabled={launching || copies.length === 0}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50">
                        ✏️ Incrustar texto en imágenes
                      </button>
                    ) : (
                      <button onClick={launchCampaign} disabled={launching}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50">
                        {launching ? '⏳ Publicando en Meta...' : '🚀 Lanzar campaña'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}