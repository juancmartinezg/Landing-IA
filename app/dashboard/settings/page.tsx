'use client';
import { useState, useEffect } from 'react';
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
export default function SettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newHoliday, setNewHoliday] = useState('');
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [wizard, setWizard] = useState({
    what_you_sell: '',
    location: '',
    prices: '',
    tone: 'amigable',
    emojis: 'pocos',
    language: 'español',
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
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    fetch(`${API_URL}/config`, { headers: { 'client-id': 'JMC' } })
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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
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
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
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
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
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
    const brandName = form.brand_name || 'nuestro negocio';
    let prompt = `Eres el asistente virtual de ${brandName}.\n\n`;
    prompt += `SOBRE EL NEGOCIO:\n${wizard.what_you_sell}\n\n`;
    if (wizard.location) prompt += `UBICACIÓN: ${wizard.location}\n\n`;
    if (wizard.prices) prompt += `PRECIOS:\n${wizard.prices}\n\n`;
    prompt += `ESTILO DE COMUNICACIÓN:\n`;
    prompt += `- ${toneMap[wizard.tone] || toneMap.amigable}\n`;
    prompt += `- ${emojiMap[wizard.emojis] || emojiMap.pocos}\n`;
    prompt += `- Idioma: ${wizard.language}\n`;
    prompt += `- Responde de forma breve y directa (máximo 3-4 líneas).\n`;
    prompt += `- Siempre cierra invitando al cliente a tomar acción.\n\n`;
    if (wizard.requirements) prompt += `REQUISITOS / CONDICIONES:\n${wizard.requirements}\n\n`;
    if (wizard.faq) prompt += `PREGUNTAS FRECUENTES:\n${wizard.faq}\n\n`;
    if (wizard.discount_policy) prompt += `POLÍTICA DE DESCUENTOS:\n${wizard.discount_policy}\n\n`;
    prompt += `REGLAS IMPORTANTES:\n`;
    prompt += `- Si el cliente pregunta algo que no sabes, ofrece conectarlo con un asesor humano.\n`;
    prompt += `- Nunca inventes información sobre precios o servicios que no estén listados arriba.\n`;
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
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">URL del logo</label>
              {editing ? (
                <input value={form.brand_logo_url} onChange={(e) => setForm({...form, brand_logo_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <div className="flex items-center gap-3">
                  {config?.brand_logo_url && <img src={config.brand_logo_url} className="w-10 h-10 rounded-lg object-contain bg-white/5" />}
                  <p className="text-white font-medium text-sm truncate">{config?.brand_logo_url || '-'}</p>
                </div>
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
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Festivos</h3>
            <span className="text-xs text-gray-500">{schedForm.holidays.length} días</span>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="date" value={newHoliday} onChange={(e) => setNewHoliday(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
            <button onClick={addHoliday}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-xs font-bold transition-all">
              + Agregar
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