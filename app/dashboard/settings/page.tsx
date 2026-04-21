'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const ALL_DAYS = [
  { id: 0, label: 'Lunes' },
  { id: 1, label: 'Martes' },
  { id: 2, label: 'Miércoles' },
  { id: 3, label: 'Jueves' },
  { id: 4, label: 'Viernes' },
  { id: 5, label: 'Sábado' },
  { id: 6, label: 'Domingo' },
];
const CRM_FIELD_OPTIONS = [
  { id: 'product_name', label: 'Producto / Servicio', icon: '🏷️' },
  { id: 'purchase_date', label: 'Fecha de compra', icon: '📅' },
  { id: 'shipping_address', label: 'Dirección de envío', icon: '📍' },
  { id: 'carrier', label: 'Transportadora', icon: '🚚' },
  { id: 'tracking_number', label: 'Número de guía', icon: '📋' },
  { id: 'shipping_status', label: 'Estado del envío', icon: '📊' },
  { id: 'renewal_date', label: 'Fecha de renovación', icon: '🔄' },
  { id: 'renewal_frequency', label: 'Frecuencia', icon: '⏰' },
];
const BUSINESS_PRESETS: Record<string, { label: string; fields: string[] }> = {
  servicios: { label: '🎯 Servicios', fields: ['product_name', 'purchase_date'] },
  productos: { label: '🛒 Tienda', fields: ['product_name', 'purchase_date', 'shipping_address', 'carrier', 'tracking_number', 'shipping_status'] },
  seguros: { label: '🛡️ Seguros', fields: ['product_name', 'purchase_date', 'renewal_date', 'renewal_frequency'] },
  restaurante: { label: '🍔 Delivery', fields: ['product_name', 'shipping_address', 'shipping_status'] },
  salud: { label: '🏥 Salud', fields: ['product_name', 'purchase_date', 'renewal_date', 'renewal_frequency'] },
  todos: { label: '⚙️ Todos', fields: CRM_FIELD_OPTIONS.map(f => f.id) },
};
const SHIPPING_PROVIDERS = [
  { id: 'servientrega', name: 'Servientrega', country: '🇨🇴 CO' },
  { id: 'coordinadora', name: 'Coordinadora', country: '🇨🇴 CO' },
  { id: 'envia', name: 'Envía', country: '🇨🇴 CO' },
  { id: 'interrapidisimo', name: 'Inter Rapidísimo', country: '🇨🇴 CO' },
  { id: '99minutos', name: '99 Minutos', country: '🇲🇽🇨🇴' },
  { id: 'dhl', name: 'DHL', country: '🌎 Global' },
  { id: 'fedex', name: 'FedEx', country: '🌎 Global' },
   { id: 'estafeta', name: 'Estafeta', country: '🇲🇽 MX' },
  { id: 'paquetexpress', name: 'Paquetexpress', country: '🇲🇽 MX' },
  { id: 'redpack', name: 'Redpack', country: '🇲🇽 MX' },
  { id: 'andreani', name: 'Andreani', country: '🇦🇷 AR' },
  { id: 'chilexpress', name: 'Chilexpress', country: '🇨🇱 CL' },
];
export default function SettingsPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newHoliday, setNewHoliday] = useState('');
  const [crmFields, setCrmFields] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState('servicios');
  const [shippingProviders, setShippingProviders] = useState<string[]>([]);
  const [postPaymentFlow, setPostPaymentFlow] = useState('scheduling');
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [wizard, setWizard] = useState({
    what_you_sell: '',
    location: '',
    prices: '',
    website_url: '',
    tone: 'amigable',
    emojis: 'pocos',
    language: 'español',
    sales_style: 'consultivo',
    requirements: '',
    faq: '',
    discount_policy: '',
  });
  const [form, setForm] = useState({
    brand_name: '',
    business_item_name: '',
    currency: '',
    btn_book: '',
    brand_logo_url: '',
  });
 const [schedForm, setSchedForm] = useState({
    timezone: 'America/Bogota',
    business_hours_start: 8,
    business_hours_end: 18,
    closed_days: [] as number[],
    holidays: [] as string[],
  });
  const [humanHours, setHumanHours] = useState({
    start: 8,
    end: 18,
    days: [1, 2, 3, 4, 5] as number[],
  });
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    fetch(`${API_URL}/config`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setForm({
          brand_name: data.brand_name || '',
          business_item_name: data.business_item_name || data.item_type || '',
          currency: data.currency || 'COP',
          btn_book: data.btn_book || '',
          brand_logo_url: data.brand_logo_url || '',
        });
        const sched = data.scheduling || {};
        setSchedForm({
          timezone: sched.timezone || 'America/Bogota',
          business_hours_start: sched.business_hours?.start || 8,
          business_hours_end: sched.business_hours?.end || 18,
          closed_days: sched.closed_days || [],
          holidays: sched.holidays || [],
        });
       setPromptText(data.prompt || '');
        setCrmFields(data.crm_fields || []);
        setBusinessType(data.business_type || 'servicios');
        setShippingProviders((data.shipping || {}).providers || []);
        setPostPaymentFlow(data.post_payment_flow || 'scheduling');
        const hh = data.human_support_hours || {};
        setHumanHours({
          start: hh.start ?? 8,
          end: hh.end ?? 18,
          days: hh.days ?? [1, 2, 3, 4, 5],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify(form),
      });
      setConfig({ ...config, ...form });
      setEditing(false);
      showToast('✓ Datos del negocio guardados');
    } catch (err) {
      showToast('Error guardando');
    }
    setSaving(false);
  };
  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({
          scheduling: {
            timezone: schedForm.timezone,
            utc_offset: schedForm.timezone === 'America/Bogota' ? -5 : 0,
            business_hours: {
              start: schedForm.business_hours_start,
              end: schedForm.business_hours_end,
            },
            closed_days: schedForm.closed_days,
            holidays: schedForm.holidays,
          },
        }),
      });
      setConfig({
        ...config,
        scheduling: {
          timezone: schedForm.timezone,
          business_hours: { start: schedForm.business_hours_start, end: schedForm.business_hours_end },
          closed_days: schedForm.closed_days,
          holidays: schedForm.holidays,
        },
      });
      showToast('✓ Horarios guardados');
    } catch (err) {
      showToast('Error guardando horarios');
    }
    setSaving(false);
  };
  const handleSavePrompt = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ prompt: promptText }),
      });
      setConfig({ ...config, prompt: promptText });
      setEditingPrompt(false);
      showToast('✓ Prompt guardado');
    } catch (err) {
      showToast('Error guardando prompt');
    }
    setSaving(false);
  };
  const handleSaveHumanHours = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({
          human_support_hours: {
            start: humanHours.start,
            end: humanHours.end,
            days: humanHours.days,
          },
        }),
      });
      setConfig({ ...config, human_support_hours: humanHours });
      showToast('✓ Horario del asesor guardado');
    } catch (err) {
      showToast('Error guardando horario del asesor');
    }
    setSaving(false);
  };
  const hasShippingFields = crmFields.some(f => ['carrier', 'tracking_number', 'shipping_status'].includes(f));
  const toggleShippingProvider = (id: string) => {
    setShippingProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };
  const handleSaveCrmFields = async () => {
    setSaving(true);
    try {
      const payload: any = { crm_fields: crmFields, business_type: businessType };
      if (hasShippingFields && shippingProviders.length > 0) {
        payload.shipping = { providers: shippingProviders, active: true };
      } else {
        payload.shipping = { providers: [], active: false };
      }
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify(payload),
      });
      setConfig({ ...config, crm_fields: crmFields, business_type: businessType, shipping: payload.shipping });
      showToast('✓ Campos del CRM guardados');
    } catch (err) {
      showToast('Error guardando campos');
    }
    setSaving(false);
  };
  const toggleCrmField = (fieldId: string) => {
    setCrmFields(prev => prev.includes(fieldId) ? prev.filter(f => f !== fieldId) : [...prev, fieldId]);
  };
  const applyPreset = (presetId: string) => {
    setBusinessType(presetId);
    setCrmFields(BUSINESS_PRESETS[presetId]?.fields || []);
  };
  const toggleHumanDay = (dayId: number) => {
    setHumanHours(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId].sort(),
    }));
  };
  const toggleClosedDay = (dayId: number) => {
    setSchedForm(prev => ({
      ...prev,
      closed_days: prev.closed_days.includes(dayId)
        ? prev.closed_days.filter(d => d !== dayId)
        : [...prev.closed_days, dayId],
    }));
  };
  const addHoliday = () => {
    if (!newHoliday) return;
    if (schedForm.holidays.includes(newHoliday)) {
      showToast('Esa fecha ya está agregada');
      return;
    }
    setSchedForm(prev => ({ ...prev, holidays: [...prev.holidays, newHoliday].sort() }));
    setNewHoliday('');
  };
  const removeHoliday = (date: string) => {
    setSchedForm(prev => ({ ...prev, holidays: prev.holidays.filter(h => h !== date) }));
  };
  const generatePrompt = () => {
    const toneMap: Record<string, string> = {
      formal: 'Habla de manera formal y profesional, usando "usted".',
      amigable: 'Habla de manera cálida y amigable, como un asesor de confianza. Usa "tú".',
      casual: 'Habla de manera relajada y casual, como un amigo. Usa "tú" y expresiones coloquiales.',
    };
    const emojiMap: Record<string, string> = {
      muchos: 'Usa emojis frecuentemente para hacer la conversación más visual y atractiva.',
      pocos: 'Usa emojis con moderación, solo para resaltar puntos importantes.',
      ninguno: 'No uses emojis en tus respuestas.',
    };
    const salesMap: Record<string, string> = {
      directo: `ESTILO DE VENTA DIRECTO:\n- Cuando el cliente pregunte por un servicio o producto, muestra las opciones disponibles de inmediato.\n- Incluye precios y beneficios principales en tu respuesta.\n- Cierra siempre invitando a comprar o reservar.`,
      consultivo: `ESTILO DE VENTA CONSULTIVO (embudo conversacional):\n- PASO 1: Cuando un cliente nuevo pregunte por un servicio/producto, NO muestres opciones de inmediato. Primero haz UNA pregunta de conexión adaptada al contexto (ej: "¿Es para ti o para alguien más?", "¿Qué te llamó la atención?", "¿Ya tienes experiencia?").\n- PASO 2: Después de su respuesta, pide el nombre de forma natural: "¡Qué bien! ¿Con quién tengo el gusto?" Si lo ignora, NO insistas.\n- PASO 3: Una vez tienes contexto (y ojalá el nombre), muestra las opciones con intent "catalog". Usa el nombre si lo tienes.\n- PASO 4: Cuando elija un servicio, resalta el beneficio principal antes del precio. Pregunta si quiere reservar.\n- PASO 5: Si confirma, usa intent "payment". Mensaje tipo: "[Nombre], tu pre-reserva está lista. Te envío el link de pago seguro."`,
      informativo: `ESTILO INFORMATIVO:\n- Responde las preguntas del cliente de forma clara y completa.\n- No presiones para comprar. Solo informa.\n- Si el cliente muestra interés en comprar, ofrece las opciones disponibles.`,
    };
    const brandName = form.brand_name || 'nuestro negocio';
    let prompt = `Eres el asistente virtual de ${brandName}.\n\n`;
    prompt += `SOBRE EL NEGOCIO:\n${wizard.what_you_sell}\n\n`;
    if (wizard.location) prompt += `UBICACIÓN: ${wizard.location}\n\n`;
    if (wizard.website_url) prompt += `SITIO WEB: ${wizard.website_url}\nSi el cliente pregunta por la página web, comparte esta URL.\n\n`;
    if (wizard.prices) prompt += `PRECIOS:\n${wizard.prices}\n\n`;
    prompt += `ESTILO DE COMUNICACIÓN:\n`;
    prompt += `- ${toneMap[wizard.tone] || toneMap.amigable}\n`;
    prompt += `- ${emojiMap[wizard.emojis] || emojiMap.pocos}\n`;
    prompt += `- Idioma: ${wizard.language}\n`;
    prompt += `- Responde de forma breve y directa (máximo 3-4 líneas).\n\n`;
    prompt += `${salesMap[wizard.sales_style] || salesMap.consultivo}\n\n`;
    if (wizard.requirements) prompt += `REQUISITOS / CONDICIONES:\n${wizard.requirements}\n\n`;
    if (wizard.faq) prompt += `PREGUNTAS FRECUENTES:\n${wizard.faq}\n\n`;
    if (wizard.discount_policy) prompt += `POLÍTICA DE DESCUENTOS:\n${wizard.discount_policy}\n\n`;
    prompt += `REGLAS IMPORTANTES:\n`;
    prompt += `- Nunca inventes información sobre precios o servicios que no estén en el catálogo.\n`;
    prompt += `- Si preguntan algo del contexto general (cómo llegar, qué llevar, clima), usa tu conocimiento para responder.\n`;
    prompt += `- Si el cliente muestra intención de compra, guíalo al proceso de pago o reserva.\n`;
    setPromptText(prompt.trim());
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuración ⚙️</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Editar datos
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="border border-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/5">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos del Negocio */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Datos del Negocio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre del negocio</label>
              {editing ? (
                <input value={form.brand_name} onChange={(e) => setForm({...form, brand_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <p className="text-white font-medium">{config?.brand_name || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Tipo de item</label>
              {editing ? (
                <input value={form.business_item_name} onChange={(e) => setForm({...form, business_item_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                  placeholder="producto, servicio, curso..." />
              ) : (
                <p className="text-white font-medium">{config?.business_item_name || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Moneda</label>
              {editing ? (
                <select value={form.currency} onChange={(e) => setForm({...form, currency: e.target.value})}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="COP" className="bg-[#1a1f2e] text-white">COP - Peso Colombiano</option>
                  <option value="MXN" className="bg-[#1a1f2e] text-white">MXN - Peso Mexicano</option>
                  <option value="USD" className="bg-[#1a1f2e] text-white">USD - Dólar</option>
                  <option value="EUR" className="bg-[#1a1f2e] text-white">EUR - Euro</option>
                  <option value="ARS" className="bg-[#1a1f2e] text-white">ARS - Peso Argentino</option>
                  <option value="CLP" className="bg-[#1a1f2e] text-white">CLP - Peso Chileno</option>
                  <option value="PEN" className="bg-[#1a1f2e] text-white">PEN - Sol Peruano</option>
                  <option value="BRL" className="bg-[#1a1f2e] text-white">BRL - Real Brasileño</option>
                </select>
              ) : (
                <p className="text-white font-medium">{config?.currency || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Texto botón de reserva</label>
              {editing ? (
                <input value={form.btn_book} onChange={(e) => setForm({...form, btn_book: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <p className="text-white font-medium">{config?.btn_book || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Logo del negocio</label>
              {editing ? (
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input value={form.brand_logo_url} onChange={(e) => setForm({...form, brand_logo_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                      placeholder="URL del logo o sube uno..." />
                  </div>
                  <label className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all shrink-0">
                    📷 Subir
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const res = await fetch(`${API_URL}/upload-url?file_name=${encodeURIComponent(file.name)}&folder=profile`, {
                          headers: { 'client-id': user?.companyId || '' }
                        });
                        const data = await res.json();
                        if (data.upload_url) {
                          await fetch(data.upload_url, {
                            method: 'PUT',
                            headers: { 'Content-Type': data.content_type },
                            body: file,
                          });
                          setForm({...form, brand_logo_url: data.public_url});
                          showToast('✓ Logo subido');
                        }
                      } catch (err) {
                        showToast('Error subiendo logo');
                      }
                    }} />
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {config?.brand_logo_url ? (
                    <img src={config.brand_logo_url} className="w-14 h-14 rounded-xl object-contain bg-white/5 p-1" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 text-xs">Sin logo</div>
                  )}
                </div>
              )}
              {editing && form.brand_logo_url && (
                <img src={form.brand_logo_url} alt="Preview" className="mt-3 h-16 rounded-xl object-contain" />
              )}
            </div>
          </div>
        </div>
        {/* Horarios */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Horarios</h3>
            <button onClick={handleSaveSchedule} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
              {saving ? '...' : 'Guardar horarios'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Zona horaria</label>
              <select value={schedForm.timezone} onChange={(e) => setSchedForm({...schedForm, timezone: e.target.value})}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                <option value="America/Bogota" className="bg-[#1a1f2e] text-white">America/Bogota (UTC-5)</option>
                <option value="America/Mexico_City" className="bg-[#1a1f2e] text-white">America/Mexico_City (UTC-6)</option>
                <option value="America/Argentina/Buenos_Aires" className="bg-[#1a1f2e] text-white">Buenos Aires (UTC-3)</option>
                <option value="America/Santiago" className="bg-[#1a1f2e] text-white">Santiago (UTC-4)</option>
                <option value="America/Lima" className="bg-[#1a1f2e] text-white">Lima (UTC-5)</option>
                <option value="America/New_York" className="bg-[#1a1f2e] text-white">New York (UTC-5)</option>
                <option value="Europe/Madrid" className="bg-[#1a1f2e] text-white">Madrid (UTC+1)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Hora apertura</label>
                <select value={schedForm.business_hours_start} onChange={(e) => setSchedForm({...schedForm, business_hours_start: parseInt(e.target.value)})}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i} className="bg-[#1a1f2e] text-white">{i}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Hora cierre</label>
                <select value={schedForm.business_hours_end} onChange={(e) => setSchedForm({...schedForm, business_hours_end: parseInt(e.target.value)})}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i} className="bg-[#1a1f2e] text-white">{i}:00</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Días cerrados</label>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map(day => (
                  <button key={day.id} onClick={() => toggleClosedDay(day.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      schedForm.closed_days.includes(day.id)
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}>
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Festivos */}
        {/* Horario del Asesor Humano */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Horario del Asesor 🙋‍♂️</h3>
            <button onClick={handleSaveHumanHours} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
              {saving ? '...' : 'Guardar'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-4">Fuera de este horario, el bot NO transferirá a un asesor humano y seguirá atendiendo con IA.</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Hora inicio</label>
              <select value={humanHours.start} onChange={(e) => setHumanHours({...humanHours, start: parseInt(e.target.value)})}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i} className="bg-[#1a1f2e] text-white">{i}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Hora fin</label>
              <select value={humanHours.end} onChange={(e) => setHumanHours({...humanHours, end: parseInt(e.target.value)})}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i} className="bg-[#1a1f2e] text-white">{i}:00</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Días con asesor disponible</label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map(day => (
                <button key={day.id} onClick={() => toggleHumanDay(day.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    humanHours.days.includes(day.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}>
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Festivos</h3>
            <span className="text-xs text-gray-500">{schedForm.holidays.length} días</span>
          </div>
          <div className="flex gap-2 mb-3">
            <select id="holidayCountry" defaultValue="CO"
              className="bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
              <option value="CO" className="bg-[#1a1f2e] text-white">🇨🇴 Colombia</option>
              <option value="MX" className="bg-[#1a1f2e] text-white">🇲🇽 México</option>
              <option value="AR" className="bg-[#1a1f2e] text-white">🇦🇷 Argentina</option>
              <option value="CL" className="bg-[#1a1f2e] text-white">🇨🇱 Chile</option>
              <option value="PE" className="bg-[#1a1f2e] text-white">🇵🇪 Perú</option>
              <option value="EC" className="bg-[#1a1f2e] text-white">🇪🇨 Ecuador</option>
              <option value="BR" className="bg-[#1a1f2e] text-white">🇧🇷 Brasil</option>
              <option value="US" className="bg-[#1a1f2e] text-white">🇺🇸 Estados Unidos</option>
              <option value="ES" className="bg-[#1a1f2e] text-white">🇪🇸 España</option>
            </select>
            <button onClick={async () => {
              const country = (document.getElementById('holidayCountry') as HTMLSelectElement)?.value || 'CO';
              const year = new Date().getFullYear().toString();
              try {
                const res = await fetch(`${API_URL}/holidays?country=${country}&year=${year}`);
                const data = await res.json();
                if (data.holidays?.length) {
                  const merged = [...new Set([...schedForm.holidays, ...data.holidays])].sort();
                  setSchedForm(prev => ({ ...prev, holidays: merged }));
                  showToast(`✓ ${data.count} festivos de ${data.country_name} cargados`);
                } else {
                  showToast('No se encontraron festivos');
                }
              } catch { showToast('Error cargando festivos'); }
            }}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap">
              🌎 Cargar festivos
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="date" value={newHoliday} onChange={(e) => setNewHoliday(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
            <button onClick={addHoliday}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-xs font-bold transition-all">
              + Manual
            </button>
          </div>
          {schedForm.holidays.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No hay festivos configurados</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {schedForm.holidays.map((date, i) => (
                <div key={i} className="flex justify-between items-center bg-white/[0.02] rounded-lg px-4 py-2">
                  <span className="text-sm text-white">{date}</span>
                  <button onClick={() => removeHoliday(date)}
                    className="text-xs text-red-400 hover:text-red-300 font-bold">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-600 mt-3">Los festivos se guardan con el botón "Guardar horarios" de arriba.</p>
        </div>
        {/* Prompt del Bot — Wizard */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Prompt del Bot</h3>
            {!editingPrompt ? (
              <button onClick={() => setEditingPrompt(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                {config?.prompt ? 'Editar' : 'Configurar'}
              </button>
            ) : (
              <button onClick={() => { setEditingPrompt(false); setWizardStep(1); }}
                className="text-xs text-gray-400 hover:text-white font-bold">
                Cancelar
              </button>
            )}
          </div>
          {editingPrompt ? (
            <div>
              {/* Progress */}
              <div className="flex gap-1 mb-6">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${
                    s <= wizardStep ? 'bg-indigo-500' : 'bg-white/10'
                  }`} />
                ))}
              </div>
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-2">🏢 <strong className="text-white">Paso 1:</strong> Cuéntanos sobre tu negocio</p>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">¿Qué vendes o qué servicio ofreces?</label>
                    <textarea value={wizard.what_you_sell} onChange={(e) => setWizard({...wizard, what_you_sell: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none"
                      placeholder="Ej: Somos una escuela de tiro que ofrece seminarios y cursos de manejo de armas..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Ubicación</label>
                    <input value={wizard.location} onChange={(e) => setWizard({...wizard, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                      placeholder="Ej: Guarne, Antioquia, Colombia" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Precios principales</label>
                    <textarea value={wizard.prices} onChange={(e) => setWizard({...wizard, prices: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none"
                      placeholder="Ej: Seminario $280.000, Curso Escolta $1.300.000..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Sitio web (opcional)</label>
                    <input value={wizard.website_url} onChange={(e) => setWizard({...wizard, website_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                      placeholder="https://www.tunegocio.com" />
                  </div>
                  <button onClick={() => setWizardStep(2)} disabled={!wizard.what_you_sell}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    Siguiente →
                  </button>
                </div>
              )}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-2">🤖 <strong className="text-white">Paso 2:</strong> Personalidad del bot</p>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Tono de comunicación</label>
                    <div className="flex gap-2">
                      {['formal', 'amigable', 'casual'].map(t => (
                        <button key={t} onClick={() => setWizard({...wizard, tone: t})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all capitalize ${
                            wizard.tone === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}>
                          {t === 'formal' ? '👔 Formal' : t === 'amigable' ? '😊 Amigable' : '🤙 Casual'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">¿Usa emojis?</label>
                    <div className="flex gap-2">
                      {['muchos', 'pocos', 'ninguno'].map(e => (
                        <button key={e} onClick={() => setWizard({...wizard, emojis: e})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all capitalize ${
                            wizard.emojis === e ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}>
                          {e === 'muchos' ? '🎉 Muchos' : e === 'pocos' ? '👍 Pocos' : '🚫 Ninguno'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Idioma principal</label>
                    <div className="flex gap-2">
                      {['español', 'inglés', 'portugués'].map(lang => (
                        <button key={lang} onClick={() => setWizard({...wizard, language: lang})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all capitalize ${
                            wizard.language === lang ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Estilo de venta</label>
                    <div className="flex gap-2">
                      {['directo', 'consultivo', 'informativo'].map(s => (
                        <button key={s} onClick={() => setWizard({...wizard, sales_style: s})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all capitalize ${
                            wizard.sales_style === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}>
                          {s === 'directo' ? '🎯 Directo' : s === 'consultivo' ? '🤝 Consultivo' : '📋 Informativo'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-gray-600 mt-1">
                      {wizard.sales_style === 'directo' ? 'Muestra opciones y precios de inmediato' :
                       wizard.sales_style === 'consultivo' ? 'Hace preguntas antes de mostrar opciones (recomendado)' :
                       'Solo informa, no presiona para comprar'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setWizardStep(1)}
                      className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                      ← Atrás
                    </button>
                    <button onClick={() => setWizardStep(3)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-2">📋 <strong className="text-white">Paso 3:</strong> Información adicional</p>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Requisitos o condiciones</label>
                    <textarea value={wizard.requirements} onChange={(e) => setWizard({...wizard, requirements: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none"
                      placeholder="Ej: Ser mayor de edad, presentar cédula original..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Preguntas frecuentes y sus respuestas</label>
                    <textarea value={wizard.faq} onChange={(e) => setWizard({...wizard, faq: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-24 resize-none"
                      placeholder="Ej: ¿Dan certificado? Sí, incluye certificado. ¿Hay parqueadero? Sí, amplio..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">¿Qué hacer si piden descuento?</label>
                    <textarea value={wizard.discount_policy} onChange={(e) => setWizard({...wizard, discount_policy: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-16 resize-none"
                      placeholder="Ej: Ofrecer plan pareja con descuento, no dar descuentos individuales..." />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setWizardStep(2)}
                      className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                      ← Atrás
                    </button>
                    <button onClick={() => { generatePrompt(); setWizardStep(4); }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all">
                      Generar prompt ✨
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-2">✅ <strong className="text-white">Paso 4:</strong> Revisa y guarda</p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-2">
                    <p className="text-xs text-emerald-400 font-bold">✨ Prompt generado automáticamente. Puedes editarlo si quieres.</p>
                  </div>
                  <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-64 resize-none font-mono" />
                  <div className="flex gap-2">
                    <button onClick={() => setWizardStep(3)}
                      className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                      ← Atrás
                    </button>
                    <button onClick={handleSavePrompt} disabled={saving}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                      {saving ? 'Guardando...' : '💾 Guardar prompt'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-400 whitespace-pre-wrap">{config?.prompt?.substring(0, 800) || 'Sin prompt configurado'}{config?.prompt?.length > 800 ? '...' : ''}</p>
              </div>
              <a href="/dashboard/templates" className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-bold">
                Cambiar plantilla →
              </a>
            </div>
          )}
        </div>
         {/* Campos del CRM */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Campos del CRM 📋</h3>
            <button onClick={handleSaveCrmFields} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
              {saving ? '...' : 'Guardar campos'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-3">Elige qué información quieres rastrear de tus clientes. Usa un preset o personaliza.</p>
          {/* Presets rápidos */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(BUSINESS_PRESETS).map(([id, preset]) => (
              <button key={id} onClick={() => applyPreset(id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  businessType === id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}>
                {preset.label}
              </button>
            ))}
          </div>
          {/* Checkboxes individuales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {CRM_FIELD_OPTIONS.map(field => (
              <button key={field.id} onClick={() => toggleCrmField(field.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all border ${
                  crmFields.includes(field.id)
                    ? 'border-indigo-500 bg-indigo-600/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}>
                <span className="text-sm">{field.icon}</span>
                <span className="text-[10px] font-medium">{field.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-600">{crmFields.length} campos activos</p>
        </div>
        {/* Transportadoras — solo si tiene campos de envío activos */}
        {hasShippingFields && (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Transportadoras 🚚</h3>
              <span className={`text-xs font-bold ${shippingProviders.length > 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {shippingProviders.length > 0 ? `✓ ${shippingProviders.length} activa${shippingProviders.length > 1 ? 's' : ''}` : '⚠ Sin configurar'}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mb-3">Marca las transportadoras que usas. Solo estas aparecerán en el CRM.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SHIPPING_PROVIDERS.map(sp => (
                <button key={sp.id} onClick={() => toggleShippingProvider(sp.id)}
                  className={`p-3 rounded-xl text-center transition-all border ${
                    shippingProviders.includes(sp.id)
                      ? 'border-emerald-500 bg-emerald-600/10'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}>
                  <p className="text-xs font-bold">{sp.name}</p>
                  <p className="text-[9px] text-gray-500">{sp.country}</p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3">Se guarda con el botón "Guardar campos" de arriba.</p>
          </div>
        )}
        {/* Después del Pago */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Después del Pago ✅</h3>
            <button onClick={async () => {
              setSaving(true);
              await fetch(`${API_URL}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                body: JSON.stringify({ post_payment_flow: postPaymentFlow }),
              });
              setConfig({ ...config, post_payment_flow: postPaymentFlow });
              showToast('✓ Flujo post-pago guardado');
              setSaving(false);
            }} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
              {saving ? '...' : 'Guardar'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-3">¿Qué pasa cuando un cliente completa el pago?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'scheduling', label: '📅 Agendar cita', desc: 'Ideal para servicios, salud, cursos' },
              { id: 'shipping', label: '📦 Pedir envío', desc: 'Dirección + transportadora' },
              { id: 'download', label: '⬇️ Enviar descarga', desc: 'Productos digitales, ebooks' },
              { id: 'thanks_only', label: '🙏 Solo agradecimiento', desc: 'Sin acción adicional' },
            ].map(opt => (
              <button key={opt.id} onClick={() => setPostPaymentFlow(opt.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  postPaymentFlow === opt.id
                    ? 'border-emerald-500 bg-emerald-600/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}>
                <p className="text-xs font-bold">{opt.label}</p>
                <p className="text-[9px] text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
        {/* Descripción Visual del Negocio */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Identidad Visual 🎨</h3>
            <button onClick={async () => {
              setSaving(true);
              const el = document.getElementById('visual-desc') as HTMLTextAreaElement;
              await fetch(`${API_URL}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                body: JSON.stringify({ visual_description: el?.value || '' }),
              });
              showToast('✓ Descripción visual guardada');
              setSaving(false);
            }} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
              {saving ? '...' : 'Guardar'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-3">Describe cómo se ve tu negocio. La IA usará esto para generar imágenes publicitarias más fieles a tu marca.</p>
          <textarea id="visual-desc" defaultValue={config?.visual_description || ''}
            placeholder="Ej: Polígono de tiro al aire libre, rodeado de montañas, zona rural verde, personas con camisetas negras y gafas de protección..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white resize-none" />
          <p className="text-[9px] text-gray-600 mt-2">Incluye: colores de tu marca, tipo de instalaciones, vestimenta del equipo, ambiente general.</p>
        </div>
        {/* Importar Sitio Web */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Importar Sitio Web 🌐</h3>
          </div>
          <p className="text-[10px] text-gray-500 mb-3">Pega la URL de tu sitio web y el bot aprenderá sobre tu negocio automáticamente.</p>
          <div className="flex gap-2">
            <input
              id="scrape-url"
              type="url"
              defaultValue={config?.website_url || wizard.website_url || ''}
              placeholder="https://www.tunegocio.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
            />
            <button
              onClick={async () => {
                const urlInput = document.getElementById('scrape-url') as HTMLInputElement;
                const url = urlInput?.value?.trim();
                if (!url) { showToast('Ingresa una URL'); return; }
                setSaving(true);
                showToast('⏳ Importando sitio web...');
                try {
                  const res = await fetch(`${API_URL}/scrape`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
                    body: JSON.stringify({ url }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    showToast(`✓ Importado: ${data.title || 'Sitio web'} (${data.char_count} caracteres)`);
                  } else {
                    showToast(data.error || 'Error importando');
                  }
                } catch (err) { showToast('Error de conexión'); }
                setSaving(false);
              }}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {saving ? '⏳...' : '🌐 Importar'}
            </button>
          </div>
          <p className="text-[9px] text-gray-600 mt-2">El contenido se agrega al contexto del bot. Máximo 5,000 caracteres.</p>
          {config?.prompt?.includes('INFORMACION DEL SITIO WEB') && (
            <p className="text-[9px] text-emerald-400 mt-1">✅ Sitio web importado y activo en el bot</p>
          )}
        </div>
        {/* Pasarela de Pagos */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 md:col-span-2">
          <h3 className="font-bold mb-4">Pasarela de Pagos</h3>
          <div className="flex items-center gap-6">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Pasarela activa</label>
              <p className="text-white font-medium capitalize">{config?.gateway_name || 'No configurada'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Estado</label>
              <p className={`font-medium ${config?.gateway_active ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {config?.gateway_active ? '✓ Activa' : '⚠ Configurar'}
              </p>
            </div>
            <a href="/dashboard/gateway" className="ml-auto text-sm text-indigo-400 hover:text-indigo-300 font-bold">
              Configurar pasarela →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}