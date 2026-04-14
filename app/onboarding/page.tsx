'use client';
import { useState } from 'react';
import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    business_name: '',
    what_you_sell: '',
    item_type: 'servicio',
    currency: 'COP',
    timezone: 'America/Bogota',
  });
  const handleFinish = async () => {
    if (!form.business_name || !form.what_you_sell) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // 1. Crear empresa con onboarding
      const res = await fetch(`${API_URL}/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': user?.sub || user?.email || '',
        },
        body: JSON.stringify({
          business_name: form.business_name,
          item_type: form.item_type,
          currency: form.currency,
          timezone: form.timezone,
          prompt: `Eres el asistente virtual de ${form.business_name}. Vendes: ${form.what_you_sell}. Responde de forma amable, profesional y breve. Siempre cierra invitando al cliente a comprar o agendar.`,
          btn_book: `Reservar ${form.item_type}`,
          business_hours: { start: 8, end: 18 },
          closed_days: [],
          holidays: [],
        }),
      });
      if (!res.ok) {
        setError('Error creando tu negocio. Intenta de nuevo.');
        setSaving(false);
        return;
      }
      const data = await res.json();
      const companyId = data.client_id || user?.sub || '';
      // 2. Registrar en UserMapping
      await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          company_id: companyId,
        }),
      });
      // 3. Actualizar localStorage
      const stored = localStorage.getItem('cb_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.companyId = companyId;
        localStorage.setItem('cb_user', JSON.stringify(parsed));
      }
      // 4. Ir al dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    }
    setSaving(false);
  };
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/cb-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tighter">clientes.bot</span>
          </div>
          <p className="text-gray-400 text-sm">Configura tu negocio en 30 segundos</p>
        </div>
        {/* Progress */}
        <div className="flex gap-1 mb-8 max-w-xs mx-auto">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-indigo-500' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-2">¿Cómo se llama tu negocio?</h2>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre del negocio *</label>
                <input
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                  placeholder="Ej: Pizzeria Don Mario"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">¿Qué vendes o qué servicio ofreces? *</label>
                <textarea
                  value={form.what_you_sell}
                  onChange={(e) => setForm({ ...form, what_you_sell: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none"
                  placeholder="Ej: Pizzas artesanales, pastas, ensaladas..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Tipo de item principal</label>
                <select
                  value={form.item_type}
                  onChange={(e) => setForm({ ...form, item_type: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                >
                  <option value="servicio" className="bg-[#1a1f2e] text-white">Servicio</option>
                  <option value="producto" className="bg-[#1a1f2e] text-white">Producto</option>
                  <option value="curso" className="bg-[#1a1f2e] text-white">Curso</option>
                  <option value="cita" className="bg-[#1a1f2e] text-white">Cita / Consulta</option>
                </select>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.business_name || !form.what_you_sell}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-2">Últimos detalles</h2>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Moneda</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                >
                  <option value="COP" className="bg-[#1a1f2e] text-white">COP - Peso Colombiano</option>
                  <option value="MXN" className="bg-[#1a1f2e] text-white">MXN - Peso Mexicano</option>
                  <option value="USD" className="bg-[#1a1f2e] text-white">USD - Dólar</option>
                  <option value="EUR" className="bg-[#1a1f2e] text-white">EUR - Euro</option>
                  <option value="ARS" className="bg-[#1a1f2e] text-white">ARS - Peso Argentino</option>
                  <option value="CLP" className="bg-[#1a1f2e] text-white">CLP - Peso Chileno</option>
                  <option value="PEN" className="bg-[#1a1f2e] text-white">PEN - Sol Peruano</option>
                  <option value="BRL" className="bg-[#1a1f2e] text-white">BRL - Real Brasileño</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Zona horaria</label>
                <select
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                >
                  <option value="America/Bogota" className="bg-[#1a1f2e] text-white">Colombia (UTC-5)</option>
                  <option value="America/Mexico_City" className="bg-[#1a1f2e] text-white">México (UTC-6)</option>
                  <option value="America/Argentina/Buenos_Aires" className="bg-[#1a1f2e] text-white">Argentina (UTC-3)</option>
                  <option value="America/Santiago" className="bg-[#1a1f2e] text-white">Chile (UTC-4)</option>
                  <option value="America/Lima" className="bg-[#1a1f2e] text-white">Perú (UTC-5)</option>
                  <option value="America/New_York" className="bg-[#1a1f2e] text-white">New York (UTC-5)</option>
                  <option value="Europe/Madrid" className="bg-[#1a1f2e] text-white">España (UTC+1)</option>
                </select>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/5 transition-all"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {saving ? 'Creando...' : '🚀 Crear mi negocio'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-xs">Podrás cambiar todo esto después en Configuración</p>
        </div>
      </div>
    </div>
  );
}