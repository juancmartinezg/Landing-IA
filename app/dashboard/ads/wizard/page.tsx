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
  const [refMode, setRefMode] = useState<'real' | 'logo' | 'generic' | 'own'>('real');
  // Modo "usar mis propias imágenes": biblioteca IA + brand-assets + subir desde PC
  const [ownLibrary, setOwnLibrary] = useState<any[]>([]);
  const [ownLibLoaded, setOwnLibLoaded] = useState(false);
  const [uploadingOwn, setUploadingOwn] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [copies, setCopies] = useState<any[]>([]);
  const [generatingCopies, setGeneratingCopies] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [imageHookMap, setImageHookMap] = useState<Record<number, number>>({});
  const [overlayInProgress, setOverlayInProgress] = useState(false);
  const [budgetDaily, setBudgetDaily] = useState('20000');
  const [duration, setDuration] = useState('7');
  const [campaignName, setCampaignName] = useState('');
  const [adCountry, setAdCountry] = useState('CO');
  const [adCity, setAdCity] = useState('');
  const [adRadius, setAdRadius] = useState('25');
  const [adAgeMin, setAdAgeMin] = useState('18');
  const [adAgeMax, setAdAgeMax] = useState('65');
  const [adGender, setAdGender] = useState('all');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [imagesPerRound, setImagesPerRound] = useState(5);
  const [maxImagesCap, setMaxImagesCap] = useState(10);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const draftKey = user?.companyId ? `cb_wizard_draft_${user.companyId}` : '';
  useEffect(() => {
    fetch(`${API_URL}/brand-dna`, { headers: h }).then(r => r.ok ? r.json() : null).then(d => setHasBrandDna(d?.ok || false)).catch(() => setHasBrandDna(false));
    fetch(`${API_URL}/ads/wizard/check-quota`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' } }).then(r => r.json()).then(d => setQuota(d)).catch(() => {});
    fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).then(d => setServices(d.services || [])).catch(() => {});
    fetch(`${API_URL}/brand-assets`, { headers: h }).then(r => r.json()).then(d => setBrandAssets(d.assets || [])).catch(() => {});
    // Leer cap multi-tenant desde config_pro (sin hardcode)
    fetch(`${API_URL}/config`, { headers: h }).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.wizard_max_images_per_round) setMaxImagesCap(parseInt(d.wizard_max_images_per_round));
      if (d?.wizard_default_images_per_round) setImagesPerRound(parseInt(d.wizard_default_images_per_round));
    }).catch(() => {});
    // Hidratar borrador desde localStorage (keyed por company_id — multi-tenant safe)
    if (typeof window !== 'undefined' && draftKey) {
      try {
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const d = JSON.parse(raw);
          // TTL 30 días — borrador viejo se descarta silente
          const ageMs = Date.now() - (d.savedAt || 0);
          if (ageMs > 30 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(draftKey);
            setDraftHydrated(true);
            return;
          }
          if (d.step) setStep(d.step);
          if (d.strategy) setStrategy(d.strategy);
          if (Array.isArray(d.channels)) setChannels(d.channels);
          if (d.language) setLanguage(d.language);
          if (d.selectedSlug !== undefined) setSelectedSlug(d.selectedSlug);
          if (Array.isArray(d.benefits)) setBenefits(d.benefits);
          if (d.refMode) setRefMode(d.refMode);
          if (Array.isArray(d.selectedRefs)) setSelectedRefs(d.selectedRefs);
          if (d.plan) setPlan(d.plan);
          if (Array.isArray(d.previewImages)) setPreviewImages(d.previewImages);
          if (Array.isArray(d.selectedImages)) setSelectedImages(d.selectedImages);
          if (Array.isArray(d.copies)) setCopies(d.copies);
          if (d.campaignName) setCampaignName(d.campaignName);
          if (d.budgetDaily) setBudgetDaily(d.budgetDaily);
          if (d.duration) setDuration(d.duration);
          if (d.imageHookMap) setImageHookMap(d.imageHookMap);
          if (d.adCountry) setAdCountry(d.adCountry);
          if (d.adCity !== undefined) setAdCity(d.adCity);
          if (d.adRadius) setAdRadius(d.adRadius);
          if (d.adAgeMin) setAdAgeMin(d.adAgeMin);
          if (d.adAgeMax) setAdAgeMax(d.adAgeMax);
          if (d.adGender) setAdGender(d.adGender);
          showToast('📂 Borrador restaurado');
        }
      } catch {}
    }
    setDraftHydrated(true);
  }, [draftKey]);
  // Auto-guardado del borrador (debounced 500ms)
  useEffect(() => {
    if (!draftHydrated || !draftKey || typeof window === 'undefined') return;
    const t = setTimeout(() => {
      try {
        const draft = { step, strategy, channels, language, selectedSlug, benefits, refMode, selectedRefs, plan, previewImages, selectedImages, copies, campaignName, budgetDaily, duration, imageHookMap, adCountry, adCity, adRadius, adAgeMin, adAgeMax, adGender, savedAt: Date.now() };
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 1500);
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [step, strategy, channels, language, selectedSlug, benefits, refMode, selectedRefs, plan, previewImages, selectedImages, copies, campaignName, budgetDaily, duration, imageHookMap, adCountry, adCity, adRadius, adAgeMin, adAgeMax, adGender, draftHydrated, draftKey]);
  // Warning si el servicio del borrador ya no existe
  useEffect(() => {
    if (!draftHydrated || !selectedSlug || services.length === 0) return;
    const exists = services.find((s: any) => s.slug === selectedSlug && s.active !== false);
    if (!exists) {
      showToast('⚠️ El servicio del borrador ya no existe. Elige otro o descarta.');
      setSelectedSlug('');
    }
  }, [services, draftHydrated]);
  // Video devuelto por el video-wizard: lo inyecta como 4ª variante (image_url vacío + video_url)
  useEffect(() => {
    if (!draftHydrated || typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('cb_wizard_pending_video');
    if (!raw) return;
    sessionStorage.removeItem('cb_wizard_pending_video');
    try {
      const v = JSON.parse(raw);
      if (!v?.video_url) return;
      setPreviewImages(prev => {
        if (prev.some((i: any) => i.video_url === v.video_url)) return prev;  // ya inyectado
        const nextIdx = prev.length ? Math.max(...prev.map((i: any) => i.index ?? 0)) + 1 : 0;
        const slot = { index: nextIdx, image_url: '', video_url: v.video_url, ok: true, is_video: true, overlay_applied: true };
        // Auto-seleccionar el video para que entre al launch
        setSelectedImages(sel => sel.includes(nextIdx) ? sel : [...sel, nextIdx]);
        return [...prev, slot];
      });
      // Caso solo-video: si no hay copies (no se pasó por el flujo de imágenes),
      // sembrar el copy que generó el video-wizard para que el paso 8 muestre el botón lanzar.
      if (v.copy && typeof v.copy === 'object') {
        setCopies(prev => prev.length ? prev : [v.copy]);
      }
      setStep(8);
      showToast('🎬 Video agregado como variante. Revísalo y lanza.');
    } catch {}
  }, [draftHydrated]);
  const toggleChannel = (ch: string) => setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const addBenefit = () => { if (newBenefit.trim() && benefits.length < 10) { setBenefits([...benefits, newBenefit.trim()]); setNewBenefit(''); } };
  const toggleRef = (url: string) => setSelectedRefs(prev => prev.includes(url) ? prev.filter(u => u !== url) : prev.length < 5 ? [...prev, url] : prev);
  const toggleImage = (idx: number) => setSelectedImages(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 3 ? [...prev, idx] : prev);
  // ── Modo "usar mis propias imágenes" (refMode === 'own') ──────────────
  // Carga las imágenes generadas antes por IA (biblioteca del tenant)
  const loadOwnLibrary = async () => {
    if (ownLibLoaded) return;
    try {
      const r = await fetch(`${API_URL}/ads/library?type=image&limit=200&period=365`, { headers: h });
      const d = await r.json();
      if (d.ok) setOwnLibrary(d.items || []);
    } catch {}
    setOwnLibLoaded(true);
  };
  // Agrega una URL (de biblioteca o brand-asset) a previewImages como creativo final
  const addOwnImage = (url: string) => {
    if (!url) return;
    setPreviewImages(prev => {
      if (prev.some((i: any) => i.image_url === url)) return prev; // ya agregada
      const nextIdx = prev.length ? Math.max(...prev.map((i: any) => i.index ?? 0)) + 1 : 0;
      return [...prev, { index: nextIdx, image_url: url, ok: true, own: true }];
    });
  };
  const isOwnAdded = (url: string) => previewImages.some((i: any) => i.image_url === url);
  // Sube una imagen desde el PC: presigned → PUT S3 → registra en biblioteca (reusable)
  const handleOwnUpload = async (file: File) => {
    if (!file) return;
    setUploadingOwn(true);
    try {
      const up = await fetch(`${API_URL}/brand-assets/upload-url?file_name=${encodeURIComponent(file.name)}&type=product`, { headers: h });
      const ud = await up.json();
      if (!ud.upload_url) { showToast('❌ ' + (ud.error || 'No se pudo iniciar la subida')); setUploadingOwn(false); return; }
      const put = await fetch(ud.upload_url, { method: 'PUT', headers: { 'Content-Type': ud.content_type || file.type }, body: file });
      if (!put.ok) { showToast('❌ Error subiendo la imagen'); setUploadingOwn(false); return; }
      // Registrar en biblioteca para reusarla después
      try {
        const reg = await fetch(`${API_URL}/brand-assets`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ asset_type: 'product', name: file.name.slice(0, 80), s3_url: ud.public_url, tags: ['wizard'] }) });
        const rd = await reg.json();
        if (rd.ok && rd.asset) setBrandAssets(prev => [rd.asset, ...prev]);
      } catch {}
      addOwnImage(ud.public_url);
      showToast('✅ Imagen subida y agregada');
    } catch { showToast('Error de conexión'); }
    setUploadingOwn(false);
  };

  const generateMoreImages = async () => {
    if (!plan) { showToast('⚠️ Primero genera la estrategia'); return; }
    if (previewImages.length >= maxImagesCap) { showToast(`⚠️ Cap alcanzado (${maxImagesCap} imágenes máx)`); return; }
    const remaining = maxImagesCap - previewImages.length;
    const toGenerate = Math.min(imagesPerRound, remaining);
    setGeneratingImages(true);
    try {
      // Refrescar quota antes (descuenta 1 wizard por ronda)
      showToast(`⏳ Generando ${toGenerate} imagen${toGenerate > 1 ? 'es' : ''} más... (descuenta 1 wizard)`);
      const ir = await fetch(`${API_URL}/ads/wizard/generate-images-preview`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ image_prompts: (plan.image_prompts || []).slice(0, toGenerate), brand_asset_urls: refMode === 'real' ? selectedRefs : [], append: true }) });
      const id = await ir.json();
      if (id.ok) {
        const offset = previewImages.length;
        const newImgs = (id.images || []).map((img: any, i: number) => ({ ...img, index: offset + i }));
        setPreviewImages(prev => [...prev, ...newImgs]);
        showToast(`✅ ${newImgs.length} nuevas en ${id.elapsed_seconds}s — total ${offset + newImgs.length}`);
        // Refrescar quota tras descuento
        fetch(`${API_URL}/ads/wizard/check-quota`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' } }).then(r => r.json()).then(d => setQuota(d)).catch(() => {});
      } else showToast('❌ ' + (id.error || 'Error generando más'));
    } catch { showToast('Error de conexión'); }
    setGeneratingImages(false);
  };
  const regenerarNoMarcadas = async () => {
    if (!plan) { showToast('⚠️ Primero genera la estrategia'); return; }
    if (selectedImages.length === 0) { showToast('⚠️ Marca primero las que quieres conservar'); return; }
    const conservadas = previewImages.filter((img: any) => selectedImages.includes(img.index));
    const aReemplazar = previewImages.filter((p: any) => p.ok).length - conservadas.length;
    if (aReemplazar <= 0) { showToast('No hay imágenes para reemplazar'); return; }
    if (!confirm(`Conservas ${conservadas.length} y regeneras ${aReemplazar} nuevas (descuenta 1 wizard). ¿Continuar?`)) return;
    setGeneratingImages(true);
    try {
      showToast(`⏳ Conservando ${conservadas.length}, generando ${aReemplazar} nuevas...`);
      const ir = await fetch(`${API_URL}/ads/wizard/generate-images-preview`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ image_prompts: (plan.image_prompts || []).slice(0, aReemplazar), brand_asset_urls: refMode === 'real' ? selectedRefs : [], append: true }) });
      const id = await ir.json();
      if (id.ok) {
        // Reindexar conservadas (0..n) + nuevas a continuación
        const reindexConservadas = conservadas.map((img: any, i: number) => ({ ...img, index: i }));
        const offset = reindexConservadas.length;
        const newImgs = (id.images || []).map((img: any, i: number) => ({ ...img, index: offset + i }));
        setPreviewImages([...reindexConservadas, ...newImgs]);
        // Las conservadas pasan a ser índices 0..n-1
        setSelectedImages(reindexConservadas.map((_: any, i: number) => i));
        setImageHookMap({});
        showToast(`✅ ${conservadas.length} conservadas + ${newImgs.length} nuevas`);
        fetch(`${API_URL}/ads/wizard/check-quota`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' } }).then(r => r.json()).then(d => setQuota(d)).catch(() => {});
      } else showToast('❌ ' + (id.error || 'Error regenerando'));
    } catch { showToast('Error de conexión'); }
    setGeneratingImages(false);
  };
  const discardDraft = () => {
    if (!confirm('¿Descartar el borrador? Perderás todo el progreso (imágenes, textos, configuración).')) return;
    if (typeof window !== 'undefined' && draftKey) localStorage.removeItem(draftKey);
    setStep(1); setPlan(null); setPreviewImages([]); setSelectedImages([]); setCopies([]); setBenefits([]); setSelectedRefs([]); setImageHookMap({}); setCampaignName(''); setSelectedSlug('');
    showToast('🗑️ Borrador descartado');
  };
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
    setGeneratingCopies(true);
    // Modo "own": no se generó plan (nos saltamos generatePlanAndImages).
    // Generar un plan mínimo con generate-strategy para tener copy_angles/cta/tone.
    let p = plan;
    if (!p) {
      try {
        const sr = await fetch(`${API_URL}/ads/wizard/generate-strategy`, {
          method: 'POST',
          headers: { ...h, 'Content-Type': 'application/json' },
          body: JSON.stringify({ strategy, channels, language, product_slug: selectedSlug, benefits, use_brand_dna: true }),
        });
        const sd = await sr.json();
        if (sd.ok && sd.plan) {
          p = sd.plan;
          setPlan(p);
        }
      } catch {}
      if (!p) {
        showToast('❌ No se pudo preparar la estrategia para los textos');
        setGeneratingCopies(false);
        return;
      }
    }
    try {
      const svc = services.find((s: any) => s.slug === selectedSlug);
      const r = await fetch(`${API_URL}/ads/wizard/generate-copies`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copy_angles: p.copy_angles || [],
          product_name: svc?.name || selectedSlug || 'Mi producto',
          service_slug: selectedSlug,  // enriquece prompt con precio + descripcion del catalogo
          cta_text: p.cta_text || 'Reserva ahora',
          tone: p.tone || 'profesional',
          language,
          channel: channels.includes('instagram') ? 'instagram' : 'facebook',
          benefits,
          use_brand_dna: true,
        }),
      });
      const d = await r.json();
      if (d.ok) {
        const newCopies = d.copies || [];
        setCopies(newCopies);
        if (newCopies.length > 0 && selectedImages.length > 0) {
          const map: Record<number, number> = {};
          selectedImages.forEach((imgIdx, i) => { map[imgIdx] = i % newCopies.length; });
          setImageHookMap(map);
        }
        setCampaignName(svc?.name ? `${svc.name} - ${new Date().toLocaleDateString()}` : `Campaña ${new Date().toLocaleDateString()}`);
        showToast(`✅ ${newCopies.length} textos generados`);
      }
      else showToast('❌ ' + (d.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setGeneratingCopies(false);
  };
  const launchCampaign = async () => {
    setLaunching(true);
    try {
      // Bug #69+#72: usar wizard_launch con copies completos (4 campos) + arrays paralelos
      // de imagenes en 3 formatos. Backend arma asset_feed_spec Advantage+ en Meta.
      const orderedImages = selectedImages
        .map((imgIdx) => previewImages.find((i: any) => i.index === imgIdx))
        .filter(Boolean);
      const image_urls = orderedImages.map((img: any) => img.image_url || '');
      const image_urls_vertical = orderedImages.map((img: any) => img.image_vertical || '');
      const image_urls_horizontal = orderedImages.map((img: any) => img.image_horizontal || '');
      const video_urls = orderedImages.map((img: any) => img.video_url || '');
      // Construir copies en orden — uno por cada imagen (segun imageHookMap)
      const orderedCopies = selectedImages.map((imgIdx) => {
        const copyIdx = imageHookMap[imgIdx] ?? 0;
        return copies[copyIdx] || copies[0] || {};
      });
      const r = await fetch(`${API_URL}/ads/wizard/launch`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          image_urls,
          image_urls_vertical,
          image_urls_horizontal,
          video_urls,
          copies: orderedCopies,
          cta_text: plan?.cta_text || '',
          strategy,
          channels,
          budget_daily: parseInt(budgetDaily) || 20000,
          duration: parseInt(duration) || 7,
          service_slug: selectedSlug,
          country: adCountry,
          city: adCity,
          radius: adRadius,
          cities: [],
          age_min: parseInt(adAgeMin) || 18,
          age_max: parseInt(adAgeMax) || 65,
          gender: adGender,
          interests: [],
        }),
      });
      if (r.ok) {
        if (typeof window !== 'undefined' && draftKey) localStorage.removeItem(draftKey);
        showToast('🚀 ¡Campaña publicada!');
        setTimeout(() => { window.location.href = '/dashboard/ads'; }, 2000);
      } else {
        const d = await r.json();
        showToast('❌ ' + (d.error || 'Error'));
      }
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
            <button onClick={discardDraft} className="text-[9px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition-all">
              🗑️ Descartar
            </button>
          )}
          {draftSaved && <span className="text-[9px] text-emerald-400 font-bold animate-pulse">💾 Guardado</span>}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[{id:'real' as const,l:'🟢 Sí, tengo fotos',d:'Recomendado +400% CTR'},{id:'logo' as const,l:'🟡 Solo mi logo',d:'IA inventa + tu logo'},{id:'generic' as const,l:'🔴 No tengo nada',d:'IA inventa todo (genérico)'},{id:'own' as const,l:'🖼️ Usar mis imágenes',d:'Subir o elegir de biblioteca'}].map(o => (
                  <button key={o.id} onClick={() => { setRefMode(o.id); if (o.id === 'own') { setPreviewImages([]); setSelectedImages([]); loadOwnLibrary(); } }}
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
              {refMode === 'own' && (
                <div className="mb-4 space-y-4">
                  <p className="text-xs text-gray-400">Estas imágenes se usarán <b>tal cual</b> como el anuncio (la IA no genera nada). Elige de tu biblioteca o sube desde tu PC.</p>
                  {/* Subir desde PC */}
                  <div>
                    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${uploadingOwn ? 'bg-white/5 opacity-50' : 'bg-purple-600 hover:bg-purple-500'}`}>
                      {uploadingOwn ? '⏳ Subiendo...' : '📁 Subir desde mi PC'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingOwn}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleOwnUpload(f); e.target.value = ''; }} />
                    </label>
                    <p className="text-[9px] text-gray-500 mt-1">Se guarda en tu biblioteca para reusarla después.</p>
                  </div>
                  {/* Imágenes generadas antes por IA (biblioteca) */}
                  {ownLibrary.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-300 mb-2">📚 Generadas antes ({ownLibrary.length})</p>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {ownLibrary.filter((it: any) => it.s3_url).map((it: any) => (
                          <button key={it.generation_id || it.s3_url} onClick={() => addOwnImage(it.s3_url)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${isOwnAdded(it.s3_url) ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-white/20'}`}>
                            <img src={it.s3_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                            {isOwnAdded(it.s3_url) && <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center"><span className="text-white text-lg font-bold">✓</span></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Brand-assets (fotos del negocio) */}
                  {brandAssets.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-300 mb-2">🏢 Mis fotos del negocio ({brandAssets.length})</p>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {brandAssets.map((a: any) => (
                          <button key={a.asset_id} onClick={() => addOwnImage(a.s3_url)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${isOwnAdded(a.s3_url) ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-white/20'}`}>
                            <img src={a.thumbnail_url || a.s3_url} alt={a.name} className="w-full aspect-square object-cover" loading="lazy" />
                            {isOwnAdded(a.s3_url) && <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center"><span className="text-white text-lg font-bold">✓</span></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {ownLibrary.length === 0 && brandAssets.length === 0 && (
                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400">Aún no tienes imágenes en biblioteca. Sube una desde tu PC para empezar 👆</p>
                    </div>
                  )}
                  <p className="text-[10px] text-purple-300 font-bold">{previewImages.length} imagen{previewImages.length === 1 ? '' : 'es'} lista{previewImages.length === 1 ? '' : 's'} — en el siguiente paso eliges hasta 3.</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setStep(5)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                {refMode === 'own' ? (
                  <button onClick={() => setStep(7)} disabled={previewImages.length === 0} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                    Continuar con mis imágenes →
                  </button>
                ) : (
                  <button onClick={() => { setStep(7); generatePlanAndImages(); }} disabled={generatingImages} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                    {generatingImages ? '⏳ Generando...' : '🎨 Generar imágenes →'}
                  </button>
                )}
              </div>
            </div>
          )}
          {step === 7 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Elige tus imágenes</h2>
              <p className="text-xs text-gray-400 mb-4">Selecciona hasta 3 imágenes para tu campaña.{refMode === 'own' ? ' Son las que tú subiste o elegiste de tu biblioteca.' : ' La IA las generó según tu marca y producto.'}</p>
              {generatingImages || generatingPlan ? (
                <div className="flex flex-col items-center py-16">
                  <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-400">{generatingPlan ? 'Creando estrategia con IA...' : 'Generando imágenes con IA (~20s)...'}</p>
                </div>
               ) : previewImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm mb-4">{refMode === 'own' ? 'No has elegido imágenes. Vuelve atrás para subir o seleccionar.' : 'No se generaron imágenes. Intenta de nuevo.'}</p>
                  {refMode === 'own' ? (
                    <button onClick={() => setStep(6)} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold">← Volver a elegir</button>
                  ) : (
                    <button onClick={generatePlanAndImages} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold">🔄 Reintentar</button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {previewImages.filter((img: any) => img.ok).map((img: any) => (
                      <button key={img.index} onClick={() => { if (img.is_video) return; toggleImage(img.index); }}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${selectedImages.includes(img.index) ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-600/30' : 'border-transparent hover:border-white/20'}`}>
                        {img.is_video ? (
                          <video src={img.video_url} className="w-full aspect-square object-cover bg-black" />
                        ) : (
                          <img src={img.image_url} alt={`Variante ${img.index + 1}`} className="w-full aspect-square object-cover" loading="lazy" />
                        )}
                        {img.is_video && (
                          <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">🎬 Video</div>
                        )}
                        {selectedImages.includes(img.index) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {selectedImages.indexOf(img.index) + 1}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-gray-500">{selectedImages.length}/3 seleccionadas — total {refMode === 'own' ? 'disponibles' : 'generadas'}: {previewImages.filter((p: any) => p.ok).length}{refMode === 'own' ? '' : `/${maxImagesCap}`}</p>
                    {refMode !== 'own' && previewImages.length < maxImagesCap && (
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-gray-500">Generar</label>
                        <select value={imagesPerRound} onChange={(e) => setImagesPerRound(parseInt(e.target.value))}
                          className="bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1 text-[11px] outline-none focus:border-purple-500 text-white">
                          {Array.from({ length: Math.min(maxImagesCap - previewImages.length, 10) }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>+{n}</option>
                          ))}
                        </select>
                        <button onClick={generateMoreImages} disabled={generatingImages}
                          className="text-[11px] px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 font-bold transition-all disabled:opacity-50"
                          title="Genera más sin perder las actuales (descuenta 1 wizard)">
                          {generatingImages ? '⏳...' : '➕ Generar más'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setStep(6)} className="flex-1 min-w-[100px] border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                    {refMode !== 'own' && (
                      <button onClick={() => { if (confirm('Esto borra TODAS las imágenes actuales y genera nuevas (descuenta 1 wizard). ¿Continuar?')) { setPreviewImages([]); setSelectedImages([]); generatePlanAndImages(); } }} className="border border-white/10 px-4 py-3 rounded-xl text-xs font-bold hover:bg-white/5" title="Borra todas y empieza de cero">🔄 Regenerar todo</button>
                    )}
                    {refMode !== 'own' && selectedImages.length > 0 && (
                      <button onClick={regenerarNoMarcadas} disabled={generatingImages} className="border border-purple-500/30 px-4 py-3 rounded-xl text-xs font-bold hover:bg-purple-600/10 text-purple-300 disabled:opacity-50" title="Conserva las marcadas, regenera el resto">♻️ Regenerar no marcadas</button>
                    )}
                    <button onClick={() => { setStep(8); generateCopies(); }} disabled={selectedImages.length === 0 || generatingCopies} className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
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
                  <p className="text-xs text-gray-400 mb-4">Revisa los textos (editables). Luego elige cuál copy se incrusta en cada imagen.</p>
                  <div className="space-y-3 mb-6">
                    {copies.map((c: any, i: number) => {
                      const usedIn = Object.entries(imageHookMap).filter(([_, ci]) => ci === i).map(([ii]) => parseInt(ii));
                      const usedLabels = usedIn.map(ii => selectedImages.indexOf(ii) + 1).filter(n => n > 0);
                      const primaryText = c.primary_text || c.text || '';
                      const primaryLen = c.char_count || primaryText.length || 0;
                      const ctaOptions = ['MESSAGE_PAGE', 'LEARN_MORE', 'SHOP_NOW', 'SIGN_UP', 'CONTACT_US', 'GET_QUOTE', 'APPLY_NOW', 'BOOK_TRAVEL'];
                      const ctaLabels: Record<string, string> = {
                        MESSAGE_PAGE: '💬 Enviar mensaje',
                        LEARN_MORE: '📖 Más información',
                        SHOP_NOW: '🛒 Comprar ahora',
                        SIGN_UP: '📝 Registrarse',
                        CONTACT_US: '📞 Contactar',
                        GET_QUOTE: '💰 Cotizar',
                        APPLY_NOW: '✍️ Postular',
                        BOOK_TRAVEL: '✈️ Reservar',
                      };
                      const updateCopy = (field: string, value: string) => {
                        const updated = [...copies];
                        updated[i] = { ...c, [field]: value };
                        setCopies(updated);
                      };
                      return (
                        <div key={i} className={`bg-white/[0.02] border rounded-xl p-3 ${usedLabels.length > 0 ? 'border-purple-500/50 ring-1 ring-purple-500/30' : 'border-white/5'}`}>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">V{i + 1}</span>
                            <span className="text-[9px] text-gray-500">{c.pattern || c.angle}</span>
                            {usedLabels.length > 0 && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">📸 En imagen{usedLabels.length > 1 ? 'es' : ''} {usedLabels.join(', ')}</span>}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">
                                Headline <span className="text-gray-600">({(c.headline || '').length}/40)</span>
                              </label>
                              <input value={c.headline || ''} maxLength={40}
                                onChange={(e) => updateCopy('headline', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">
                                Texto principal <span className={`${primaryLen >= 600 && primaryLen <= 2300 ? 'text-emerald-400' : 'text-yellow-400'}`}>({primaryLen}/2300 — ideal 600-1300)</span>
                              </label>
                              <textarea value={primaryText} maxLength={2300}
                                onChange={(e) => updateCopy('primary_text', e.target.value)}
                                rows={10} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white resize-y whitespace-pre-wrap" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">
                                  Descripción <span className="text-gray-600">({(c.description || '').length}/125)</span>
                                </label>
                                <input value={c.description || ''} maxLength={125}
                                  onChange={(e) => updateCopy('description', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">CTA botón</label>
                                <select value={c.cta_button || 'MESSAGE_PAGE'}
                                  onChange={(e) => updateCopy('cta_button', e.target.value)}
                                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                                  {ctaOptions.map((o) => <option key={o} value={o}>{ctaLabels[o]}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">
                              Texto para imagen <span className="text-gray-600">({(c.image_hook || '').length}/90 — editable)</span>
                            </label>
                            <input value={c.image_hook || ''} maxLength={90}
                              onChange={(e) => updateCopy('image_hook', e.target.value)}
                              placeholder="Gancho visual para incrustar en la imagen"
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                          </div>
                          {c.social_proof_used && <p className="text-[9px] text-emerald-400 mt-2 italic">🛡️ {c.social_proof_used}</p>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-300 mb-3">🎯 Asigna un copy a cada imagen</h3>
                    <div className={`grid gap-3 ${selectedImages.length === 1 ? 'grid-cols-1' : selectedImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {selectedImages.map((imgIdx, pos) => {
                        const img = previewImages.find((i: any) => i.index === imgIdx);
                        const currentCopyIdx = imageHookMap[imgIdx] ?? 0;
                        if (!img) return null;
                        return (
                          <div key={imgIdx} className={`rounded-xl overflow-hidden border-2 ${img.is_video ? 'border-purple-500/50' : img.overlay_applied ? 'border-emerald-500/50' : 'border-white/10'}`}>
                            <div className="relative">
                              {img.is_video ? (
                                <video src={img.video_url} controls className="w-full aspect-square object-cover bg-black" />
                              ) : (
                                <img src={img.image_url} alt={`Img ${pos + 1}`} className="w-full aspect-square object-cover" />
                              )}
                              <div className="absolute top-2 left-2 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">{pos + 1}</div>
                              {img.is_video && <div className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">🎬 Video</div>}
                              {!img.is_video && img.overlay_applied && <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">✓ Con texto</div>}
                            </div>
                            <div className="p-2 bg-[#0f1320]">
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Copy a incrustar</label>
                              <select value={currentCopyIdx} onChange={(e) => setImageHookMap(prev => ({ ...prev, [imgIdx]: parseInt(e.target.value) }))}
                                className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-purple-500 text-white">
                                {copies.map((c: any, i: number) => {
                                  const preview = (typeof c === 'string' ? c : c.text || '').substring(0, 40);
                                  return <option key={i} value={i}>V{i + 1} — {c.angle || 'copy'} — {preview}{preview.length >= 40 ? '...' : ''}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {selectedImages.every((idx) => previewImages.find((i: any) => i.index === idx)?.overlay_applied) && selectedImages.length > 0 && (
                    <div className="mb-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                      <p className="text-[11px] text-emerald-400 font-bold">✅ Todas las imágenes tienen texto incrustado. Listo para lanzar.</p>
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
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <h4 className="text-xs font-bold text-gray-300 mb-3">🎯 ¿A quién le mostramos el anuncio?</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">País</label>
                          <select value={adCountry} onChange={(e) => setAdCountry(e.target.value)} className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                            <option value="CO">🇨🇴 Colombia</option><option value="MX">🇲🇽 México</option><option value="AR">🇦🇷 Argentina</option><option value="PE">🇵🇪 Perú</option><option value="CL">🇨🇱 Chile</option><option value="EC">🇪🇨 Ecuador</option><option value="ES">🇪🇸 España</option><option value="US">🇺🇸 EE.UU.</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Ciudad (opcional)</label>
                          <input value={adCity} onChange={(e) => setAdCity(e.target.value)} placeholder="Ej: Medellín (vacío = todo el país)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Radio (km)</label>
                          <select value={adRadius} onChange={(e) => setAdRadius(e.target.value)} className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                            <option value="10">10 km</option><option value="25">25 km</option><option value="40">40 km</option><option value="80">80 km</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Edad mínima</label>
                          <input type="number" min={13} max={65} value={adAgeMin} onChange={(e) => setAdAgeMin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Edad máxima</label>
                          <input type="number" min={13} max={65} value={adAgeMax} onChange={(e) => setAdAgeMax(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Sexo</label>
                          <select value={adGender} onChange={(e) => setAdGender(e.target.value)} className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                            <option value="all">👥 Todos</option><option value="male">👨 Hombres</option><option value="female">👩 Mujeres</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setStep(7)} className="flex-1 min-w-[100px] border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
                    {(() => {
                      // Modo "own": las imágenes ya tienen los 3 formatos cuando image_vertical existe.
                      // El video (is_video) cuenta como YA listo: no requiere overlay ni resize.
                      const ownReady = refMode === 'own' && selectedImages.length > 0 &&
                        selectedImages.every((idx) => { const im = previewImages.find((i: any) => i.index === idx); return im?.is_video || im?.image_vertical; });
                      const allOverlaid = refMode === 'own'
                        ? ownReady
                        : (selectedImages.length > 0 && selectedImages.every((idx) => { const im = previewImages.find((i: any) => i.index === idx); return im?.is_video || im?.overlay_applied; }));
                      const someOverlaid = selectedImages.some((idx) => { const im = previewImages.find((i: any) => i.index === idx); return !im?.is_video && im?.overlay_applied; });
                      // Resize mecánico Pillow (sin texto, sin IA) para generar vertical/horizontal de imágenes propias
                      const doResizeOnly = async () => {
                        if (selectedImages.length === 0) return;
                        setOverlayInProgress(true);
                        showToast(`⏳ Preparando ${selectedImages.length} imagen${selectedImages.length > 1 ? 'es' : ''} en 3 formatos...`);
                        let success = 0;
                        for (let i = 0; i < selectedImages.length; i++) {
                          const imgIdx = selectedImages[i];
                          const img = previewImages.find((im: any) => im.index === imgIdx);
                          if (!img?.image_url) continue;
                          try {
                            const ovRes = await fetch(`${API_URL}/ads/overlay-and-resize`, {
                              method: 'POST',
                              headers: { ...h, 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                image_url: img.image_url,
                                include_overlay: false,  // imagen del cliente intacta, solo resize Pillow
                                service_slug: selectedSlug,
                              }),
                            });
                            const ovData = await ovRes.json();
                            if (ovData.ok && ovData.square) {
                              setPreviewImages((prev: any[]) => prev.map((p: any) => p.index === imgIdx ? {
                                ...p,
                                image_url: ovData.square,
                                image_vertical: ovData.vertical || '',
                                image_horizontal: ovData.horizontal || '',
                              } : p));
                              success++;
                            }
                          } catch {}
                        }
                        setOverlayInProgress(false);
                        if (success === selectedImages.length) showToast(`✅ ${success} imagen${success > 1 ? 'es' : ''} lista${success > 1 ? 's' : ''} para lanzar.`);
                        else if (success > 0) showToast(`⚠️ ${success}/${selectedImages.length} listas. Reintenta para completar.`);
                        else showToast('❌ No se pudieron preparar las imágenes');
                      };
                      const doOverlay = async () => {
                        if (copies.length === 0 || selectedImages.length === 0) return;
                        setOverlayInProgress(true);
                        showToast(`⏳ Incrustando texto en ${selectedImages.length} imagen${selectedImages.length > 1 ? 'es' : ''} (~${selectedImages.length * 10}s)...`);
                        let success = 0;
                        for (let i = 0; i < selectedImages.length; i++) {
                          const imgIdx = selectedImages[i];
                          const img = previewImages.find((im: any) => im.index === imgIdx);
                          if (!img?.image_url) continue;
                          // Siempre incrustar desde la imagen ORIGINAL sin texto (evita texto sobre texto al re-incrustar)
                          const sourceUrl = img.original_url || img.image_url;
                          const copyIdx = imageHookMap[imgIdx] ?? (i % copies.length);
                          const copyText = copies[copyIdx]?.primary_text || copies[copyIdx]?.text || copies[0]?.primary_text || copies[0]?.text || '';
                         // Usar image_hook generado por Gemini (editable). Fallback al split si no existe.
                          let hookText = (copies[copyIdx]?.image_hook || '').trim();
                          if (!hookText) {
                            hookText = (copyText.split('.')[0] || copyText).trim();
                            if (hookText.length > 90) {
                              hookText = hookText.substring(0, 90).replace(/\s+\S*$/, '').trim();
                            }
                          }
                          // Quitar emojis (Inter no los renderiza)
                          hookText = hookText.replace(/[^\p{L}\p{N}\s.,!¡?¿:;"'$%&()\-+/]/gu, '').replace(/\s+/g, ' ').trim();
                          if (!hookText) hookText = 'Ver más';
                          try {
                            const ovRes = await fetch(`${API_URL}/ads/overlay-and-resize`, {
                              method: 'POST',
                              headers: { ...h, 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                image_url: sourceUrl,
                                overlay_text: hookText,
                                include_overlay: true,
                                service_slug: selectedSlug,  // auto-fill chips precio + ubicacion desde business_profile
                              }),
                            });
                            const ovData = await ovRes.json();
                            if (ovData.ok && ovData.square) {
                              // Guardar los 3 formatos para que wizard_launch los mande como arrays paralelos
                              setPreviewImages((prev: any[]) => prev.map((p: any) => p.index === imgIdx ? {
                                ...p,
                                // Preservar la original sin texto la primera vez (para re-incrustar limpio)
                                original_url: p.original_url || p.image_url,
                                image_url: ovData.square,
                                image_vertical: ovData.vertical || '',
                                image_horizontal: ovData.horizontal || '',
                                overlay_applied: true,
                              } : p));
                              success++;
                            }
                          } catch {}
                        }
                         setOverlayInProgress(false);
                        if (success === selectedImages.length) showToast(`✅ Texto incrustado en ${success} imagen${success > 1 ? 'es' : ''}. Revisa arriba antes de lanzar.`);
                        else if (success > 0) showToast(`⚠️ ${success}/${selectedImages.length} incrustadas. Reintenta para completar.`);
                        else showToast('❌ No se pudo incrustar el texto');
                      };
                      // Deshacer: restaura la imagen original sin texto (usa original_url guardado)
                      const undoOverlay = () => {
                        setPreviewImages((prev: any[]) => prev.map((p: any) => {
                          if (!selectedImages.includes(p.index) || !p.original_url) return p;
                          return {
                            ...p,
                            image_url: p.original_url,
                            image_vertical: '',
                            image_horizontal: '',
                            overlay_applied: false,
                          };
                        }));
                        showToast('↩️ Texto quitado — imágenes restauradas a su versión original');
                      };
                      if (!allOverlaid) {
                        // Modo "own": el texto es OPCIONAL. Ofrece incrustar texto O usar tal cual.
                        if (refMode === 'own') {
                          return (
                            <>
                              <button onClick={doOverlay} disabled={launching || overlayInProgress || copies.length === 0 || selectedImages.length === 0}
                                className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                                title="Incrusta el texto del copy sobre tus imágenes">
                                {overlayInProgress ? '⏳ Incrustando...' : someOverlaid ? '🔁 Reintentar incrustar faltantes' : '✏️ Incrustar texto (opcional)'}
                              </button>
                              {someOverlaid && (
                                <button onClick={undoOverlay} disabled={launching || overlayInProgress}
                                  className="min-w-[140px] border border-yellow-500/30 hover:bg-yellow-500/10 py-3 px-4 rounded-xl text-xs font-bold text-yellow-300 transition-all disabled:opacity-50"
                                  title="Restaura las imágenes a su versión original sin texto">
                                  ↩️ Quitar texto
                                </button>
                              )}
                              <button onClick={doResizeOnly} disabled={launching || overlayInProgress || selectedImages.length === 0}
                                className="flex-1 min-w-[200px] border border-white/10 hover:bg-white/5 py-3 rounded-xl text-sm font-bold text-gray-300 transition-all disabled:opacity-50"
                                title="Usa tus imágenes tal cual, sin texto">
                                {overlayInProgress ? '⏳ Preparando...' : '📐 Usar tal cual (sin texto)'}
                              </button>
                            </>
                          );
                        }
                        return (
                          <button onClick={doOverlay} disabled={launching || overlayInProgress || copies.length === 0 || selectedImages.length === 0}
                            className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50">
                            {overlayInProgress ? '⏳ Incrustando...' : someOverlaid ? '🔁 Reintentar incrustar faltantes' : '✏️ Incrustar texto en imágenes'}
                          </button>
                        );
                      }
                      return (
                        <>
                          {refMode !== 'own' && (
                            <button onClick={doOverlay} disabled={launching || overlayInProgress}
                              className="border border-white/10 px-4 py-3 rounded-xl text-xs font-bold hover:bg-white/5 disabled:opacity-50" title="Re-incrustar con copies actualizados">
                              🔄 Re-incrustar
                            </button>
                          )}
                          <Link href="/dashboard/ads/video-wizard"
                            className="border border-purple-500/30 px-4 py-3 rounded-xl text-xs font-bold hover:bg-purple-600/10 text-purple-300 whitespace-nowrap"
                            title="Lanzar también una campaña de video">
                            📹 + Video
                          </Link>
                          <button onClick={launchCampaign} disabled={launching || overlayInProgress}
                            className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50">
                            {launching ? '⏳ Publicando en Meta...' : '🚀 Lanzar campaña'}
                          </button>
                        </>
                      );
                    })()}
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