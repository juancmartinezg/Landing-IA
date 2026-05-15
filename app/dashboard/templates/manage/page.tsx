'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CATEGORIES = [
  { id: 'UTILITY', label: '🔧 Utilidad', desc: 'Recordatorios, confirmaciones, alertas. Más barato (~$0.008-0.04 USD/msg).', color: 'indigo' },
  { id: 'MARKETING', label: '📢 Marketing', desc: 'Promos, ofertas, reactivación. Más caro (~$0.012-0.08 USD/msg). Requiere opt-in.', color: 'purple' },
];
// Diccionario de labels humanos para plantillas auto-creadas conocidas.
// Si no está en este dict, se capitaliza el nombre técnico como fallback.
const TEMPLATE_LABELS: Record<string, { title: string; emoji: string; desc: string }> = {
  appointment_reminder_v1: {
    title: 'Recordatorio de cita',
    emoji: '📅',
    desc: 'Recuerda al cliente la fecha y hora de su próxima cita.',
  },
  follow_up_v1: {
    title: 'Seguimiento comercial',
    emoji: '💬',
    desc: 'Reactiva leads que mostraron interés pero no completaron la compra.',
  },
};
// Devuelve {title, emoji, subtitle} humanos para mostrar la plantilla.
const humanize = (t: any) => {
  // Carruseles: nombre del label que dio el cliente al crearlo
  if (t.is_carousel || t.type === 'carousel') {
    const raw = t.label || t.template_name || '';
    const pretty = raw
      .replace(/_v\d+$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return {
      title: pretty || 'Carrusel de productos',
      emoji: '🎠',
      subtitle: `${t.card_count || 0} productos · Carrusel visual`,
    };
  }
  // Plantillas auto conocidas
  const meta = TEMPLATE_LABELS[t.template_name];
  if (meta) {
    return { title: meta.title, emoji: meta.emoji, subtitle: meta.desc };
  }
  // Custom del cliente: capitalizar nombre técnico
  const pretty = (t.template_name || '')
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: pretty || 'Plantilla',
    emoji: t.category === 'MARKETING' ? '📢' : '🔧',
    subtitle: t.type === 'custom' ? 'Plantilla personalizada' : 'Plantilla del sistema',
  };
};
export default function TemplatesManagerPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const [form, setForm] = useState({
    name: '',
    category: 'UTILITY',
    body: '',
    example: [''],
    // Modo carrusel (UI condicional)
    is_carousel: false,
    carousel_label: '',
    carousel_body_text: '',
    carousel_services: [] as string[],
  });
  // Catálogo de servicios del tenant (para el selector del carrusel)
  const [servicesCatalog, setServicesCatalog] = useState<any[]>([]);
  const [carouselCreating, setCarouselCreating] = useState(false);
  const loadTemplates = () => {
    setLoading(true);
    fetch(`${API_URL}/templates/list`, { headers: h })
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    loadTemplates();
    // Cargar catálogo del tenant (para el selector del carrusel)
    fetch(`${API_URL}/services`, { headers: h })
      .then(r => r.json())
      .then(d => setServicesCatalog(d.services || []))
      .catch(() => {});
  }, []);
  const handleCreate = async () => {
    if (!form.name.trim() || !form.body.trim()) { showToast('⚠️ Nombre y cuerpo son requeridos'); return; }
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/templates/custom`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim().toLowerCase().replace(/\s+/g, '_'),
          category: form.category,
          body: form.body.trim(),
          example: form.example.filter(e => e.trim()),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(`✅ Template "${form.name}" ${data.existing ? 'ya existía' : 'enviado a Meta'}. Estado: ${data.status || 'PENDING'}`);
        setShowCreate(false);
        setForm({ name: '', category: 'UTILITY', body: '', example: [''] });
        loadTemplates();
      } else {
        showToast(`❌ ${data.error || 'Error creando template'}`);
      }
    } catch { showToast('Error de conexión'); }
    setCreating(false);
  };
  const handleDelete = async (name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Se borrará de Meta y del sistema.`)) return;
    setDeleting(name);
    try {
      const res = await fetch(`${API_URL}/templates/custom`, {
        method: 'DELETE',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.ok) { showToast(`🗑️ "${name}" eliminado`); loadTemplates(); }
      else showToast(`❌ ${data.error || 'Error eliminando'}`);
    } catch { showToast('Error de conexión'); }
    setDeleting(null);
  };
  const handleRefresh = async () => {
    try {
      await fetch(`${API_URL}/templates/poll-status`, { method: 'GET', headers: h });
      loadTemplates();
      showToast('🔄 Estados actualizados desde Meta');
    } catch { showToast('Error consultando Meta'); }
  };
  // Default body neuroventas multi-tenant (mismo que el backend)
  const DEFAULT_CAROUSEL_BODY = (
    '¡Hola {{1}}! 👋\n\n' +
    'En *{{2}}* preparamos esta selección especial para ti.\n\n' +
    'Mira las opciones abajo y toca *Reservar* en la que más te ' +
    'guste — o *Más info* si quieres detalles antes de decidir.\n\n' +
    '⚡ *Cupos limitados.* No esperes a que se agoten 👇'
  );
  const handleCreateCarousel = async () => {
    if (form.carousel_services.length < 2) {
      showToast('⚠️ Selecciona al menos 2 servicios');
      return;
    }
    if (form.carousel_services.length > 10) {
      showToast('⚠️ Máximo 10 servicios por carrusel');
      return;
    }
    const bodyText = form.carousel_body_text.trim() || DEFAULT_CAROUSEL_BODY;
    // Validación frontend: requiere {{1}} y {{2}}
    if (!bodyText.includes('{{1}}') || !bodyText.includes('{{2}}')) {
      showToast('⚠️ El mensaje debe incluir {{1}} (nombre cliente) y {{2}} (negocio)');
      return;
    }
    setCarouselCreating(true);
    try {
      const res = await fetch(`${API_URL}/templates/carousel`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: form.carousel_services,
          label: form.carousel_label.trim() || `Catálogo ${form.carousel_services.length} productos`,
          body_text: bodyText,
        }),
      });
      const data = await res.json();
      if (res.ok || data.template_id) {
        showToast(`✅ Carrusel enviado a Meta. Estado: ${data.status || 'PENDING'} (revisión 10 min - 24h)`);
        setShowCreate(false);
        setForm({
          name: '', category: 'UTILITY', body: '', example: [''],
          is_carousel: false, carousel_label: '', carousel_body_text: '', carousel_services: [],
        });
        loadTemplates();
      } else {
        showToast(`❌ ${data.error || 'Error creando carrusel'}`);
      }
    } catch { showToast('Error de conexión'); }
    setCarouselCreating(false);
  };
  const toggleCarouselService = (slug: string) => {
    setForm(f => ({
      ...f,
      carousel_services: f.carousel_services.includes(slug)
        ? f.carousel_services.filter(s => s !== slug)
        : [...f.carousel_services, slug],
    }));
  };
  // Contar variables {{N}} en el body
  const varCount = (form.body.match(/\{\{\d+\}\}/g) || []).length;
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold">Plantillas WhatsApp 📝</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleRefresh} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold transition-all">
            🔄 Verificar estado
          </button>
          <button onClick={() => { setShowCreate(true); setForm(f => ({ ...f, is_carousel: false })); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              showCreate && !form.is_carousel ? 'bg-indigo-600' : 'bg-indigo-600/30 hover:bg-indigo-600/50'
            }`}>
            ✨ Crear plantilla
          </button>
          <button onClick={() => { setShowCreate(true); setForm(f => ({ ...f, is_carousel: true })); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              showCreate && form.is_carousel ? 'bg-purple-600' : 'bg-purple-600/30 hover:bg-purple-600/50'
            }`}>
            🎠 Crear carrusel
          </button>
          {showCreate && (
            <button onClick={() => setShowCreate(false)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold transition-all">
              ✕ Cerrar
            </button>
          )}
        </div>
      </div>
      {/* Banner costos Meta */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
        <p className="text-[11px] text-amber-300 leading-relaxed">
          ⚠️ <strong>Meta cobra cada mensaje enviado con plantilla</strong> directamente a la tarjeta de tu cuenta de Facebook Business.
          clientes.bot no cobra comisión adicional. Precios varían por país y categoría (~$0.008-0.08 USD por mensaje).
          <a href="https://developers.facebook.com/docs/whatsapp/pricing" target="_blank" className="text-indigo-400 underline ml-1">Ver precios Meta →</a>
        </p>
      </div>
      {/* Formulario crear plantilla TEXTO */}
      {showCreate && !form.is_carousel && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4">✨ Crear plantilla de texto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre interno *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="promo_limpieza_dental" />
              <p className="text-[9px] text-gray-600 mt-1">Solo letras, números y guiones bajos. Máx 60 chars.</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Categoría *</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setForm({ ...form, category: cat.id })}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      form.category === cat.id
                        ? `border-${cat.color}-500 bg-${cat.color}-600/10`
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}>
                    <p className="text-xs font-bold">{cat.label}</p>
                    <p className="text-[8px] text-gray-500 leading-relaxed mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Cuerpo del mensaje * <span className="text-gray-600 normal-case">— usa {'{{1}}'}, {'{{2}}'} para variables</span>
            </label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white resize-none font-mono"
              placeholder={'Hola {{1}}, tenemos promoción de {{2}} este mes. 30% de descuento si agendas antes del viernes. Responde SI para agendar.'} />
            <p className="text-[9px] text-gray-600 mt-1">{form.body.length}/1024 chars · {varCount} variable{varCount !== 1 ? 's' : ''} detectada{varCount !== 1 ? 's' : ''}</p>
          </div>
          {varCount > 0 && (
            <div className="mb-4">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Ejemplos de variables (Meta los requiere para preview)</label>
              <div className="space-y-2">
                {Array.from({ length: varCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12 shrink-0">{`{{${i + 1}}}`}</span>
                    <input value={form.example[i] || ''} onChange={(e) => {
                      const ex = [...form.example];
                      ex[i] = e.target.value;
                      setForm({ ...form, example: ex });
                    }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                      placeholder={i === 0 ? 'Ej: Juan' : i === 1 ? 'Ej: limpieza dental' : `Ejemplo ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Preview */}
          {form.body && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Preview</p>
              <div className="bg-[#0B3D2E] rounded-xl p-4 max-w-sm">
                <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                  {form.body.replace(/\{\{(\d+)\}\}/g, (_: string, n: string) => {
                    const idx = parseInt(n) - 1;
                    return form.example[idx] || `[variable ${n}]`;
                  })}
                </p>
              </div>
            </div>
          )}
          {form.category === 'MARKETING' && (
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-purple-300 leading-relaxed">
                📢 <strong>Templates MARKETING</strong> son más caros y requieren que el destinatario haya dado opt-in.
                Meta puede rechazarlos si el contenido no cumple sus políticas.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5">Cancelar</button>
            <button onClick={handleCreate} disabled={creating || !form.name.trim() || !form.body.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all">
              {creating ? '⏳ Enviando a Meta...' : '📤 Crear y enviar a revisión'}
            </button>
          </div>
        </div>
      )}
      {/* Formulario crear CARRUSEL */}
      {showCreate && form.is_carousel && (
        <div className="bg-white/[0.03] border border-purple-500/20 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4">🎠 Crear carrusel de marketing</h3>
          {/* Info badge */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-4">
            <p className="text-[11px] text-purple-300 leading-relaxed">
              🎯 <strong>Carrusel visual con tus productos/servicios</strong> + mensaje de apertura neuroventas.
              Los clientes ven hasta 10 productos con foto, precio y botones de acción. Una vez aprobado por Meta (~10 min - 24h),
              úsalo en campañas de marketing. Costo Meta: ~$0.06 USD/mensaje.
            </p>
          </div>
          {/* Etiqueta amigable */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Etiqueta del carrusel</label>
            <input value={form.carousel_label} onChange={(e) => setForm({ ...form, carousel_label: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-white"
              placeholder="Ej: Catálogo principal, Promos del mes, etc." />
            <p className="text-[9px] text-gray-600 mt-1">Para identificarlo en tu lista. Si lo dejas vacío, se autogenera.</p>
          </div>
          {/* Selector de servicios */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Servicios/productos a mostrar * <span className="text-gray-600 normal-case">— mín 2, máx 10</span>
            </label>
            {servicesCatalog.length === 0 ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                <p className="text-[10px] text-amber-300">
                  ⚠️ No tienes servicios en tu catálogo. <Link href="/dashboard/services" className="text-indigo-400 underline">Crear servicios →</Link>
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 max-h-64 overflow-y-auto space-y-1">
                  {servicesCatalog.map((s: any) => {
                    const slug = s.slug || s.id || '';
                    const checked = form.carousel_services.includes(slug);
                    const hasImage = !!s.image_url;
                    const price = s.pricing?.promotional_price || s.pricing?.regular_price || 0;
                    const currency = s.pricing?.currency || 'COP';
                    return (
                      <label key={slug}
                        className={`flex items-center gap-2 px-2 py-2 rounded text-[11px] cursor-pointer transition-colors ${
                          checked ? 'bg-purple-500/10 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'
                        } ${!hasImage ? 'opacity-60' : ''}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleCarouselService(slug)}
                          disabled={!hasImage}
                          className="w-3 h-3 accent-purple-500" />
                        {hasImage ? (
                          <img src={s.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-[8px] text-gray-500">
                            sin foto
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{s.name || slug}</p>
                          <p className="text-[9px] text-gray-500">${price.toLocaleString()} {currency}{!hasImage && ' · ⚠️ Sin imagen — no se puede incluir'}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[9px] text-gray-600 mt-1">
                  Seleccionados: <span className={`font-bold ${
                    form.carousel_services.length >= 2 && form.carousel_services.length <= 10 ? 'text-emerald-400' : 'text-red-400'
                  }`}>{form.carousel_services.length}</span>/10
                  · Solo se pueden seleccionar productos con imagen.
                </p>
              </>
            )}
          </div>
          {/* Mensaje de apertura (body) */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Mensaje de apertura * <span className="text-gray-600 normal-case">— aparece ANTES del carrusel</span>
            </label>
            <textarea
              value={form.carousel_body_text || DEFAULT_CAROUSEL_BODY}
              onChange={(e) => setForm({ ...form, carousel_body_text: e.target.value })}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-white resize-y font-mono"
            />
            <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
              <p className="text-[9px] text-gray-600">
                Variables obligatorias: <code className="bg-white/5 px-1 rounded">{'{{1}}'}</code> = nombre cliente ·
                <code className="bg-white/5 px-1 rounded ml-1">{'{{2}}'}</code> = nombre del negocio
              </p>
              <button type="button" onClick={() => setForm({ ...form, carousel_body_text: DEFAULT_CAROUSEL_BODY })}
                className="text-[9px] text-purple-400 hover:text-purple-300 font-bold">
                🔄 Restaurar texto sugerido
              </button>
            </div>
          </div>
          {/* Preview WhatsApp del mensaje */}
          {(form.carousel_body_text || DEFAULT_CAROUSEL_BODY) && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">📱 Vista previa WhatsApp</p>
              <div className="bg-[#0B3D2E] rounded-xl p-4 max-w-sm border-l-4 border-emerald-500/50">
                <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                  {(form.carousel_body_text || DEFAULT_CAROUSEL_BODY)
                    .replace(/\{\{1\}\}/g, 'Juan')
                    .replace(/\{\{2\}\}/g, user?.companyId || 'Tu negocio')
                    .split(/(\*[^*]+\*)/)
                    .map((part: string, idx: number) =>
                      part.startsWith('*') && part.endsWith('*') ? (
                        <strong key={idx} className="text-white">{part.slice(1, -1)}</strong>
                      ) : (
                        <span key={idx}>{part}</span>
                      )
                    )}
                </p>
                {/* Mini-preview del carrusel */}
                {form.carousel_services.length > 0 && (
                  <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                    {form.carousel_services.slice(0, 5).map((slug, i) => {
                      const s = servicesCatalog.find((x: any) => (x.slug || x.id) === slug);
                      return (
                        <div key={i} className="shrink-0 w-20 h-24 bg-white/10 rounded border border-white/20 overflow-hidden">
                          {s?.image_url ? (
                            <img src={s.image_url} alt="" className="w-full h-16 object-cover" />
                          ) : (
                            <div className="w-full h-16 bg-white/5 flex items-center justify-center text-[8px] text-gray-500">🖼️</div>
                          )}
                          <p className="text-[7px] text-white/80 px-1 pt-0.5 truncate">{s?.name || ''}</p>
                        </div>
                      );
                    })}
                    {form.carousel_services.length > 5 && (
                      <div className="shrink-0 w-20 h-24 flex items-center justify-center text-[10px] text-white/40">
                        +{form.carousel_services.length - 5} más
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-500 mt-1 italic">
                Vista previa con valores ejemplo. Cuando envíes la campaña, {'{{1}}'} y {'{{2}}'} se reemplazan automáticamente con los datos reales.
              </p>
            </div>
          )}
          {/* Banner costo + advertencia */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4">
            <p className="text-[10px] text-amber-300 leading-relaxed">
              ⚠️ <strong>Meta revisa el carrusel antes de aprobarlo.</strong> Toma entre 10 minutos y 24 horas.
              Una vez aprobado, podrás usarlo en campañas de marketing. Costo Meta: ~$0.06 USD por mensaje enviado.
            </p>
          </div>
          {/* Botones acción */}
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5">Cancelar</button>
            <button onClick={handleCreateCarousel}
              disabled={carouselCreating || form.carousel_services.length < 2 || form.carousel_services.length > 10}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-600/20">
              {carouselCreating
                ? '⏳ Enviando a Meta...'
                : form.carousel_services.length < 2
                  ? '⚠️ Selecciona al menos 2 servicios'
                  : form.carousel_services.length > 10
                    ? '⚠️ Máximo 10 servicios'
                    : `🎠 Crear carrusel (${form.carousel_services.length} productos)`}
            </button>
          </div>
        </div>
      )}
      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando plantillas...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📝</p>
          <h2 className="text-xl font-bold mb-2">Sin plantillas</h2>
          <p className="text-gray-400 text-sm mb-4">Conecta WhatsApp y se crearán automáticamente las plantillas de recordatorio y follow-up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((t, i) => {
            const statusColor = t.status === 'APPROVED' ? 'emerald' : t.status === 'PENDING' ? 'yellow' : t.status === 'REJECTED' ? 'red' : 'gray';
            const statusLabel = t.status === 'APPROVED' ? '✅ Aprobada' : t.status === 'PENDING' ? '⏳ En revisión' : t.status === 'REJECTED' ? '❌ Rechazada' : '⚪ Desconocido';
            const catColor = t.category === 'MARKETING' ? 'purple' : 'indigo';
            return (
              <div key={i} className={`bg-white/[0.03] border rounded-xl p-4 transition-all ${
                t.status === 'APPROVED' ? 'border-emerald-500/20' : t.status === 'REJECTED' ? 'border-red-500/20' : 'border-white/5'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-1 min-w-0">
                      {/* Título humano grande */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-bold">
                          {humanize(t).emoji} {humanize(t).title}
                        </p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold bg-${catColor}-500/20 text-${catColor}-400`}>
                          {t.category === 'MARKETING' ? 'Marketing' : 'Utilidad'}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold bg-${statusColor}-500/20 text-${statusColor}-400`}>
                          {statusLabel}
                        </span>
                        {t.type === 'auto' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500" title="Plantilla creada automáticamente al conectar WhatsApp">
                            🤖 Sistema
                          </span>
                        )}
                        {t.type === 'carousel' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400" title="Carrusel visual para campañas de marketing">
                            🎠 Carrusel
                          </span>
                        )}
                        {t.type === 'custom' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400" title="Plantilla creada por ti">
                            ✨ Personalizada
                          </span>
                        )}
                      </div>
                      {/* Subtítulo descriptivo */}
                      <p className="text-[11px] text-gray-400 mt-1">{humanize(t).subtitle}</p>
                      {/* Preview del body (lo que el cliente recibirá) */}
                      {t.body && !t.is_carousel && (
                        <div className="mt-2 bg-[#0B3D2E]/40 rounded-lg px-3 py-2 border-l-2 border-emerald-500/30">
                          <p className="text-[10px] text-white/80 whitespace-pre-wrap leading-relaxed">
                            {t.body.length > 180 ? `${t.body.slice(0, 180)}…` : t.body}
                          </p>
                        </div>
                      )}
                      {/* Metadata técnica al final, discreta */}
                      <p className="text-[9px] text-gray-600 mt-2 font-mono">
                        {t.template_name} · {t.language}
                        {t.var_count > 0 && ` · ${t.var_count} variable${t.var_count > 1 ? 's' : ''}`}
                        {t.created_at ? ` · creada ${new Date(t.created_at * 1000).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.editable && (
                      <button onClick={() => handleDelete(t.template_name)} disabled={deleting === t.template_name}
                        className="text-[10px] px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold transition-all disabled:opacity-50">
                        {deleting === t.template_name ? '...' : '🗑️ Eliminar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}