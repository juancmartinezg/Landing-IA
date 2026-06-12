'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
type VideoType = 'upload' | 'library' | 'ai' | 'avatar' | null;
export default function VideoWizardPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [step, setStep] = useState(1);
  const [videoType, setVideoType] = useState<VideoType>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3500); };
  // Datos de la campaña
  const [services, setServices] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [strategy, setStrategy] = useState('sell');
  const [channels, setChannels] = useState<string[]>(['facebook', 'instagram', 'whatsapp']);
  const [language, setLanguage] = useState('es');
  const [campaignName, setCampaignName] = useState('');
  const [budgetDaily, setBudgetDaily] = useState('20000');
  const [duration, setDuration] = useState('7');
  // Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [libraryVideos, setLibraryVideos] = useState<any[]>([]);
  // Copies
  const [copies, setCopies] = useState<any[]>([]);
  const [generatingCopies, setGeneratingCopies] = useState(false);
  const [launching, setLaunching] = useState(false);
  // Video IA state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGenerationId, setAiGenerationId] = useState('');
  const [aiBrief, setAiBrief] = useState('');
  const [aiStyle, setAiStyle] = useState('cinematic');
  const [aiModel, setAiModel] = useState('wan');
  const [aiPolling, setAiPolling] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [brandImages, setBrandImages] = useState<any[]>([]);
  const [aiLibraryImages, setAiLibraryImages] = useState<any[]>([]);
  const [imgSourcesLoaded, setImgSourcesLoaded] = useState(false);
  useEffect(() => {
    if (!user?.companyId) return;
    fetch(`${API_URL}/services`, { headers: h }).then(r => r.json()).then(d => setServices(d.services || [])).catch(() => {});
  }, [user?.companyId]);
  const loadLibraryVideos = async () => {
    try {
      const r = await fetch(`${API_URL}/ads/library?type=video&limit=50`, { headers: h });
      const d = await r.json();
      if (d.ok) setLibraryVideos(d.items || []);
    } catch {}
  };
  // Carga fuentes de imágenes base para video IA: brand-assets + imágenes generadas
  const loadImageSources = async () => {
    if (imgSourcesLoaded) return;
    try {
      const [ba, lib] = await Promise.all([
        fetch(`${API_URL}/brand-assets`, { headers: h }).then(r => r.json()).catch(() => ({})),
        fetch(`${API_URL}/ads/library?type=image&limit=50`, { headers: h }).then(r => r.json()).catch(() => ({})),
      ]);
      setBrandImages(ba.assets || []);
      setAiLibraryImages((lib.items || []).filter((it: any) => it.s3_url));
    } catch {}
    setImgSourcesLoaded(true);
  };
  const toggleChannel = (ch: string) => setChannels(p => p.includes(ch) ? p.filter(c => c !== ch) : [...p, ch]);
  // VALIDAR + SUBIR video manual
  const handleFileSelect = (f: File) => {
    if (!f) return;
    if (!/\.(mp4|mov|m4v)$/i.test(f.name)) {
      showToast('❌ Solo MP4 o MOV');
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      showToast('❌ Máximo 500MB');
      return;
    }
    setVideoFile(f);
    // Validar duración en cliente
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      window.URL.revokeObjectURL(v.src);
      if (v.duration > 240) {
        showToast('❌ Video muy largo (máx 4 min)');
        setVideoFile(null);
        return;
      }
      showToast(`✅ Video válido (${Math.round(v.duration)}s, ${(f.size / 1024 / 1024).toFixed(1)}MB)`);
    };
    v.src = window.URL.createObjectURL(f);
  };
  const uploadVideo = async () => {
    if (!videoFile) return;
    setUploading(true); setUploadProgress(0);
    try {
      // 1. Pedir presigned URL
      const ur = await fetch(`${API_URL}/ads/video/upload-url?file_name=${encodeURIComponent(videoFile.name)}`, { headers: h });
      const ud = await ur.json();
      if (!ud.upload_url) { showToast('❌ Error obteniendo URL'); setUploading(false); return; }
      // 2. Subir directo a S3 con progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`));
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('PUT', ud.upload_url);
        xhr.setRequestHeader('Content-Type', ud.content_type || 'video/mp4');
        xhr.send(videoFile);
      });
      // 3. Registrar en biblioteca
      const rr = await fetch(`${API_URL}/ads/video/register`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_url: ud.public_url,
          file_name: videoFile.name,
          size_bytes: videoFile.size,
          service_slug: selectedSlug,
          language,
          country: 'CO',
        }),
      });
      const rd = await rr.json();
      if (rd.ok) {
        setVideoUrl(ud.public_url);
        showToast(rd.library_full ? '⚠️ Subido (biblioteca llena, no se guardó)' : '✅ Subido y guardado en biblioteca');
      } else showToast('❌ ' + (rd.error || 'Error registrando'));
    } catch (e: any) {
      showToast('❌ Error: ' + (e.message || 'desconocido'));
    }
    setUploading(false);
  };
  const generateVideoAI = async () => {
    if (!selectedSlug) { showToast('⚠️ Selecciona un servicio en el paso anterior'); return; }
    setAiGenerating(true);
    try {
      // 1. Storyboard: Gemini genera el plan narrativo de 3 escenas
      showToast('🧠 Diseñando el storyboard...');
      const planRes = await fetch(`${API_URL}/ads/video/plan`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_slug: selectedSlug,
          brief: aiBrief || '',            // opcional: contexto extra
          hook_type: 'authority',
        }),
      });
      const planData = await planRes.json();
      if (!planData.success || !planData.plan) {
        showToast('❌ ' + (planData.error || 'No se pudo generar el storyboard'));
        setAiGenerating(false); return;
      }
      // 2. Generar las 3 imágenes (ancladas a la imagen de referencia si hay)
      showToast('🎨 Generando las 3 escenas...');
      const imgRes = await fetch(`${API_URL}/ads/video/storyboard-images`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planData.plan_id,
          scenes: planData.plan.scenes,
          service_slug: selectedSlug,
          reference_image_url: aiImageUrl || '',   // opcional: ancla visual
        }),
      });
      const imgData = await imgRes.json();
      if (!imgData.success || (imgData.total_ok || 0) < 3) {
        showToast('❌ No se pudieron generar las 3 imágenes. Intenta de nuevo.');
        setAiGenerating(false); return;
      }
      const order = ['hook', 'solution', 'outcome'];
      const sceneImages = order.map(
        (role) => (imgData.scenes.find((s: any) => s.role === role) || {}).image_url
      );
      // 3. Animar las 3 escenas (3 créditos Kling) + concatenar
      showToast('🎬 Animando el video premium (~3 min)...');
      const genRes = await fetch(`${API_URL}/ads/video/generate-premium`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planData.plan,
          scene_images: sceneImages,
          service_slug: selectedSlug,
          cta_text: 'Reserva tu cupo',
        }),
      });
      const genData = await genRes.json();
      if (genData.success) {
        setAiGenerationId(genData.generation_id);
        showToast('🎬 Video premium en producción. Esperando...');
        pollVideoStatus(genData.generation_id);
      } else {
        showToast('❌ ' + (genData.error || 'Error generando'));
        setAiGenerating(false);
      }
    } catch {
      showToast('Error de conexión');
      setAiGenerating(false);
    }
  };
  const pollVideoStatus = (genId: string) => {
    setAiPolling(true);
    let resolved = false;  // evita stale closure de videoUrl en el timeout
    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${API_URL}/ads/library?type=video&limit=50`, { headers: h });
        const d = await r.json();
        const items = d.items || [];
        const found = items.find((i: any) => i.generation_id === genId && i.s3_url);
        if (found) {
          resolved = true;
          clearInterval(interval);
          setVideoUrl(found.s3_url);
          setAiGenerating(false);
          setAiPolling(false);
          showToast('🎬 ¡Video premium generado exitosamente!');
        }
      } catch {}
    }, 10000); // Poll cada 10s
    // Timeout 8 min: el flujo premium (3 escenas Kling + concat) tarda 3-5 min
    setTimeout(() => {
      clearInterval(interval);
      if (!resolved) {
        setAiPolling(false);
        setAiGenerating(false);
        showToast('⏳ El video está tardando más de lo esperado. Revisa tu biblioteca en unos minutos.');
      }
    }, 480000);
  };
  const generateCopies = async () => {
    if (!selectedSlug) { showToast('⚠️ Selecciona un servicio primero'); return; }
    setGeneratingCopies(true);
    try {
      const svc = services.find((s: any) => s.slug === selectedSlug);
      // Pedir copies con angulos genericos
      const r = await fetch(`${API_URL}/ads/wizard/generate-copies`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copy_angles: ['escasez + urgencia', 'autoridad', 'prueba social', 'beneficio directo', 'dolor + solucion'],
          product_name: svc?.name || 'Mi producto',
          service_slug: selectedSlug,
          cta_text: 'Reserva tu cupo',
          tone: 'profesional, directa',
          language,
          channel: channels.includes('instagram') ? 'instagram' : 'facebook',
          benefits: svc?.characteristics || [],
          use_brand_dna: true,
        }),
      });
      const d = await r.json();
      if (d.ok) {
        setCopies(d.copies || []);
        setCampaignName(svc?.name ? `${svc.name} VIDEO - ${new Date().toLocaleDateString()}` : `Campaña Video ${new Date().toLocaleDateString()}`);
        showToast(`✅ ${d.copies?.length || 0} textos generados`);
      } else showToast('❌ ' + (d.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setGeneratingCopies(false);
  };
  const launchCampaign = async () => {
    if (!videoUrl) { showToast('⚠️ Sube o elige un video primero'); return; }
    if (copies.length === 0) { showToast('⚠️ Genera los textos primero'); return; }
    setLaunching(true);
    try {
      const r = await fetch(`${API_URL}/ads/wizard/launch`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName || `Video ${Date.now()}`,
          image_urls: [],
          image_urls_vertical: [],
          image_urls_horizontal: [],
          video_urls: [videoUrl],
          copies: copies.slice(0, 1),
          cta_text: 'Reserva ahora',
          strategy,
          channels,
          budget_daily: parseInt(budgetDaily) || 20000,
          duration: parseInt(duration) || 7,
          service_slug: selectedSlug,
          country: 'CO',
          cities: [],
          age_min: 18,
          age_max: 65,
          gender: 'all',
          interests: [],
        }),
      });
      if (r.ok) {
        showToast('🚀 ¡Campaña con video publicada!');
        setTimeout(() => window.location.href = '/dashboard/ads', 2000);
      } else {
        const d = await r.json();
        showToast('❌ ' + (d.error || 'Error'));
      }
    } catch { showToast('Error de conexión'); }
    setLaunching(false);
  };
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/ads" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
        <h1 className="text-xl font-bold">🎬 Wizard de Video</h1>
      </div>
      {/* STEP 1 — Tipo de video */}
      {step === 1 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">¿Cómo creas el video?</h2>
          <p className="text-xs text-gray-400 mb-6">Elige el método según tu preferencia.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'upload' as const, icon: '📤', l: 'Subir mi video', d: 'MP4 o MOV, hasta 500MB / 4 min', tag: 'GRATIS', tagColor: 'emerald', enabled: true },
              { id: 'library' as const, icon: '📚', l: 'Elegir de mi biblioteca', d: 'Videos que ya subí en campañas anteriores', tag: 'GRATIS', tagColor: 'emerald', enabled: true },
              { id: 'ai' as const, icon: '🤖', l: 'Generar con IA', d: 'Video IA desde imagen + prompt (Wan Pro ~50s)', tag: 'NUEVO', tagColor: 'purple', enabled: true },
              { id: 'avatar' as const, icon: '🎭', l: 'Avatar IA HeyGen', d: 'Avatar digital que habla a cámara con tu script', tag: 'PRÓXIMAMENTE', tagColor: 'yellow', enabled: false },
            ].map(o => (
              <button key={o.id} disabled={!o.enabled}
                onClick={() => {
                  if (!o.enabled) {
                    showToast('🚀 Próximamente — Sprint dedicado en desarrollo');
                    return;
                  }
                  setVideoType(o.id);
                  if (o.id === 'library') loadLibraryVideos();
                  if (o.id === 'ai') loadImageSources();
                  setStep(2);
                }}
                className={`p-5 rounded-xl text-left border transition-all relative ${!o.enabled ? 'opacity-60 cursor-not-allowed border-white/5 bg-white/[0.02]' : 'border-white/10 bg-white/[0.02] hover:border-purple-500/50 hover:bg-purple-600/5'}`}>
                <div className="text-3xl mb-2">{o.icon}</div>
                <p className="text-sm font-bold mb-1">{o.l}</p>
                <p className="text-[11px] text-gray-500">{o.d}</p>
                <span className={`absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full font-bold bg-${o.tagColor}-500/20 text-${o.tagColor}-300`}>
                  {o.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* STEP 2 — Brief (servicio + canales) */}
      {step === 2 && videoType && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Brief de la campaña</h2>
          <p className="text-xs text-gray-400 mb-4">¿Qué promocionas y dónde?</p>
          <div className="mb-4">
            <label className="text-xs text-gray-300 font-bold block mb-2">Producto/Servicio</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-300 font-bold block mb-2">Estrategia</label>
            <div className="grid grid-cols-2 gap-2">
              {[{id:'sell',l:'💰 Vender'},{id:'promote',l:'📢 Promocionar'},{id:'lead_gen',l:'🎯 Captar leads'},{id:'branding',l:'🌟 Branding'}].map(o => (
                <button key={o.id} onClick={() => setStrategy(o.id)}
                  className={`p-3 rounded-xl text-sm font-bold border ${strategy === o.id ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02]'}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-300 font-bold block mb-2">Canales</label>
            <div className="grid grid-cols-3 gap-2">
              {[{id:'facebook',l:'📘 Facebook'},{id:'instagram',l:'📸 Instagram'},{id:'whatsapp',l:'💚 WhatsApp'}].map(ch => (
                <button key={ch.id} onClick={() => toggleChannel(ch.id)}
                  className={`p-2 rounded-xl text-xs font-bold border ${channels.includes(ch.id) ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/[0.02]'}`}>
                  {ch.l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
            <button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold">Siguiente →</button>
          </div>
        </div>
      )}
      {/* STEP 3 — Upload o elegir de biblioteca */}
      {step === 3 && videoType === 'upload' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">📤 Subir video</h2>
          <p className="text-xs text-gray-400 mb-4">MP4 o MOV, hasta 500MB, máximo 4 minutos.</p>
          {!videoFile ? (
            <label className="block border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-600/5 transition-all">
              <input type="file" accept="video/mp4,video/quicktime,.mp4,.mov" className="hidden" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} />
              <p className="text-4xl mb-3">📹</p>
              <p className="text-sm font-bold mb-1">Click para elegir video</p>
              <p className="text-[11px] text-gray-500">MP4 / MOV · Max 500MB · Max 4 min</p>
            </label>
          ) : (
            <div className="border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold">📹 {videoFile.name}</p>
                  <p className="text-[10px] text-gray-500">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                {!videoUrl && !uploading && (
                  <button onClick={() => setVideoFile(null)} className="text-red-400 text-xs hover:bg-red-500/10 px-2 py-1 rounded">Cambiar</button>
                )}
              </div>
              <video src={videoUrl || URL.createObjectURL(videoFile)} controls className="w-full max-h-80 rounded-xl bg-black mb-3" />
              {uploading ? (
                <div>
                  <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-purple-600 h-2 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center">Subiendo {uploadProgress}%...</p>
                </div>
              ) : videoUrl ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-400 font-bold">✅ Video subido y listo</p>
                </div>
              ) : (
                <button onClick={uploadVideo} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold">
                  📤 Subir video
                </button>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
            <button onClick={() => { setStep(4); generateCopies(); }} disabled={!videoUrl} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {step === 3 && videoType === 'library' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">📚 Elegir de mi biblioteca</h2>
          <p className="text-xs text-gray-400 mb-4">Videos que ya subiste en campañas anteriores.</p>
          {libraryVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm text-gray-400 mb-3">No tienes videos en tu biblioteca</p>
              <button onClick={() => setVideoType('upload')} className="text-xs px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">
                📤 Subir mi primer video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {libraryVideos.map((v: any) => (
                <button key={v.generation_id} onClick={() => setVideoUrl(v.s3_url)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${videoUrl === v.s3_url ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/10 hover:border-white/30'}`}>
                  <video src={v.s3_url} className="w-full aspect-video object-cover bg-black" />
                  <div className="p-2 bg-[#0f1320]">
                    <p className="text-[10px] text-gray-300 truncate text-left">{v.asset_subtype || 'video'}</p>
                    <p className="text-[9px] text-gray-500 truncate text-left">{v.service_slug || '-'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
            <button onClick={() => { setStep(4); generateCopies(); }} disabled={!videoUrl} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {/* STEP 3 — Generar con IA */}
      {step === 3 && videoType === 'ai' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">🤖 Generar video con IA</h2>
          <p className="text-xs text-gray-400 mb-4">Sube una imagen de referencia y describe el movimiento que quieres.</p>
          {!videoUrl ? (
            <>
              <div className="mb-4">
                <label className="text-xs text-gray-300 font-bold block mb-2">Imagen de referencia *</label>
                 {!aiImageUrl ? (
                  <div className="space-y-4">
                    {/* Catálogo de servicios */}
                    {services.filter((s: any) => s.image_url).length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">📦 Del catálogo</p>
                        <div className="space-y-2">
                          {services.filter((s: any) => s.image_url).map((s: any) => (
                            <button key={s.slug} onClick={() => { setAiImageUrl(s.image_url); if (!aiBrief) setAiBrief(s.name); }}
                              className="w-full p-3 rounded-xl text-left border flex items-center gap-3 border-white/5 bg-white/[0.02] hover:border-white/20">
                              <img src={s.image_url} alt={s.name} className="w-16 h-16 rounded-lg object-cover" />
                              <div>
                                <p className="text-sm font-bold">{s.name}</p>
                                <p className="text-[10px] text-gray-500">Usar esta imagen como base</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Imágenes generadas por IA (biblioteca) */}
                    {aiLibraryImages.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">📚 Mis imágenes generadas ({aiLibraryImages.length})</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {aiLibraryImages.map((it: any) => (
                            <button key={it.generation_id || it.s3_url} onClick={() => setAiImageUrl(it.s3_url)}
                              className="rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all">
                              <img src={it.s3_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Brand assets (fotos del negocio) */}
                    {brandImages.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">🏢 Mis fotos del negocio ({brandImages.length})</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {brandImages.map((a: any) => (
                            <button key={a.asset_id} onClick={() => setAiImageUrl(a.s3_url)}
                              className="rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all">
                              <img src={a.thumbnail_url || a.s3_url} alt={a.name} className="w-full aspect-square object-cover" loading="lazy" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* URL manual */}
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">O pega URL de imagen:</label>
                      <input value={aiImageUrl} onChange={(e) => setAiImageUrl(e.target.value)} placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-purple-500/30 rounded-xl bg-purple-600/5">
                    <img src={aiImageUrl} alt="ref" className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-xs text-purple-300 font-bold">Imagen seleccionada ✅</p>
                      <button onClick={() => setAiImageUrl('')} className="text-[10px] text-gray-400 hover:text-white mt-1">Cambiar</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-300 font-bold block mb-2">Contexto extra (opcional)</label>
                <textarea value={aiBrief} onChange={(e) => setAiBrief(e.target.value)} rows={3}
                  placeholder="Ej: Persona disparando pistola 9mm en polígono profesional con humo cinematográfico"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Estilo</label>
                  <select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                    <option value="cinematic">🎬 Cinematográfico</option>
                    <option value="dynamic">⚡ Dinámico</option>
                    <option value="smooth">🌊 Suave</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Modelo</label>
                  <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                    <option value="wan">🎯 Video IA Pro (~50s aprox)</option>
                    <option value="kling">🏆 Video IA Cinematic (~110s)</option>
                  </select>
                </div>
              </div>
              {aiGenerating ? (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 text-center">
                  <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-purple-300">Generando video con IA...</p>
                  <p className="text-[10px] text-gray-400 mt-1">{aiModel === 'wan' ? '~60 segundos Aprox' : '~120 segundos aprox'} • No cierres esta página</p>
                  {aiGenerationId && <p className="text-[9px] text-gray-600 mt-2 font-mono">ID: {aiGenerationId}</p>}
                </div>
              ) : (
                <button onClick={generateVideoAI} disabled={!selectedSlug}
                  className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  🎬 Generar video premium (3 escenas)
                </button>
              )}
            </>
          ) : (
            <div className="border border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
              <p className="text-xs text-emerald-400 font-bold mb-3">✅ Video IA generado</p>
              <video src={videoUrl} controls className="w-full max-h-80 rounded-xl bg-black" />
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button onClick={() => { setStep(2); setVideoUrl(''); setAiGenerating(false); }} className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
            <button onClick={() => { setStep(4); generateCopies(); }} disabled={!videoUrl}
              className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {/* STEP 4 — Copies + config + lanzar */}
      {step === 4 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Textos y lanzamiento</h2>
          {videoUrl && (
            <div className="mb-4 rounded-xl overflow-hidden border border-white/10 max-w-md">
              <video src={videoUrl} controls className="w-full bg-black" />
            </div>
          )}
          {generatingCopies ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-gray-400">Generando textos persuasivos...</p>
            </div>
          ) : copies.length === 0 ? (
            <button onClick={generateCopies} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold mb-4">
              🔄 Generar textos
            </button>
          ) : (
            <div className="space-y-3 mb-6">
              {copies.slice(0, 3).map((c: any, i: number) => {
                const updateCopy = (field: string, value: string) => {
                  const updated = [...copies];
                  updated[i] = { ...c, [field]: value };
                  setCopies(updated);
                };
                return (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">V{i + 1}</span>
                      <span className="text-[9px] text-gray-500">{c.pattern || c.angle}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Headline ({(c.headline || '').length}/40)</label>
                        <input value={c.headline || ''} maxLength={40} onChange={(e) => updateCopy('headline', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Texto principal ({(c.primary_text || '').length}/600)</label>
                        <textarea value={c.primary_text || c.text || ''} maxLength={600} onChange={(e) => updateCopy('primary_text', e.target.value)}
                          rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white resize-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {copies.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6">
              <h3 className="text-xs font-bold text-gray-300 mb-3">⚙️ Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Nombre</label>
                  <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Presupuesto diario</label>
                  <input type="number" value={budgetDaily} onChange={(e) => setBudgetDaily(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Duración</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 text-white">
                    <option value="7">7 días</option><option value="15">15 días</option><option value="30">30 días</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStep(3)} className="flex-1 min-w-[100px] border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5">← Atrás</button>
            <button onClick={launchCampaign} disabled={!videoUrl || copies.length === 0 || launching}
              className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
              {launching ? '⏳ Publicando...' : '🚀 Lanzar campaña con video'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}