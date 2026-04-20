'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({ phone: '', service_name: '', date: '', hour: '10', duration: '1', notes: '', amount: '0' });
  const [saving, setSaving] = useState(false);
  const loadAppointments = () => {
    fetch(`${API_URL}/appointments`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setAppointments(data.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    loadAppointments();
    fetch(`${API_URL}/services`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setServices(data.services || []))
      .catch(() => {});
  }, []);
  const handleCreate = async () => {
    if (!form.phone || !form.date || !form.hour) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({
          phone: form.phone.replace(/[^0-9]/g, ''),
          service_name: form.service_name || 'Cita manual',
          date: form.date,
          hour: parseInt(form.hour),
          duration: parseInt(form.duration),
          notes: form.notes,
          amount: parseInt(form.amount) || 0,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ phone: '', service_name: '', date: '', hour: '10', duration: '1', notes: '', amount: '0' });
        loadAppointments();
      }
    } catch (err) { console.error('Error creando cita:', err); }
    setSaving(false);
  };
  const handleCancel = async (phone: string) => {
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      await fetch(`${API_URL}/appointments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ phone }),
      });
      loadAppointments();
    } catch (err) { console.error('Error cancelando:', err); }
  };
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.scheduled_date >= today);
  const past = appointments.filter(a => a.scheduled_date < today);
  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Citas Agendadas 📅</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all">
          + Agendar
        </button>
      </div>
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Citas</p>
          <p className="text-3xl font-bold text-indigo-400">{appointments.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Proximas</p>
          <p className="text-3xl font-bold text-emerald-400">{upcoming.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Completadas</p>
          <p className="text-3xl font-bold text-gray-400">{past.length}</p>
        </div>
      </div>
      {/* Modal crear cita */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Agendar cita 📅</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Teléfono *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="573001234567" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Servicio</label>
                <select value={form.service_name} onChange={e => {
                  const svc = services.find(s => s.name === e.target.value);
                  setForm({...form, service_name: e.target.value, amount: svc?.pricing?.regular_price?.toString() || '0'});
                }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="">Seleccionar...</option>
                  {services.map((s, i) => <option key={i} value={s.name}>{s.name} - ${(s.pricing?.regular_price || 0).toLocaleString()}</option>)}
                  <option value="Cita manual">Otro (manual)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fecha *</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Hora *</label>
                  <select value={form.hour} onChange={e => setForm({...form, hour: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                    {Array.from({length: 14}, (_, i) => i + 7).map(h => (
                      <option key={h} value={h}>{h}:00 {h < 12 ? 'AM' : h === 12 ? 'PM' : 'PM'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Duración (horas)</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white">
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                    <option value="4">4 horas</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Monto</label>
                  <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notas</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  placeholder="Notas adicionales..." rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-white resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 transition-all">
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={saving || !form.phone || !form.date}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 disabled:opacity-30 transition-all">
                {saving ? '⏳ Agendando...' : '✅ Agendar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📅</p>
          <h2 className="text-xl font-bold mb-2">No hay citas agendadas</h2>
          <p className="text-gray-400 text-sm">Las citas aparecen cuando un cliente agenda desde WhatsApp o las creas desde aquí.</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all">
            + Agendar cita
          </button>
        </div>
      ) : (
        <>
          {/* Proximas citas */}
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-4 text-emerald-400">Proximas citas</h3>
              <div className="space-y-3">
                {upcoming.map((apt, i) => (
                  <div key={i} className="bg-white/[0.03] border border-emerald-500/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-indigo-400">{apt.scheduled_date?.split('-')[2]}</p>
                        <p className="text-[8px] text-gray-400 uppercase">
                          {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][parseInt(apt.scheduled_date?.split('-')[1]) - 1]}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">{apt.service_name}</p>
                        <p className="text-sm text-gray-400">{apt.phoneNumber}</p>
                        <p className="text-xs text-gray-500">{apt.scheduled_type || 'personalizado'}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-lg font-bold text-indigo-400">{apt.scheduled_hour}:00</p>
                      <p className="text-sm text-emerald-400 font-bold">${(parseInt(apt.amount) || 0).toLocaleString()} {apt.currency}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full ${
                          apt.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' : apt.status === 'MANUAL' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {apt.status}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); handleCancel(apt.phoneNumber); }}
                          className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                          ✕ Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Citas pasadas */}
          {past.length > 0 && (
            <div>
              <h3 className="font-bold mb-4 text-gray-500">Citas anteriores</h3>
              <div className="space-y-3">
                {past.map((apt, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-500/10 rounded-xl flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-gray-500">{apt.scheduled_date?.split('-')[2]}</p>
                        <p className="text-[8px] text-gray-600 uppercase">
                          {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][parseInt(apt.scheduled_date?.split('-')[1]) - 1]}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{apt.service_name}</p>
                        <p className="text-sm text-gray-500">{apt.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">{apt.scheduled_date} - {apt.scheduled_hour}:00</p>
                      <p className="text-sm text-gray-500">${(parseInt(apt.amount) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}