'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/appointments`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setAppointments(data.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.scheduled_date >= today);
  const past = appointments.filter(a => a.scheduled_date < today);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Citas Agendadas 📅</h1>
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
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📅</p>
          <h2 className="text-xl font-bold mb-2">No hay citas agendadas</h2>
          <p className="text-gray-400 text-sm">Las citas aparecen automaticamente cuando un cliente paga y agenda desde WhatsApp.</p>
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
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-400">{apt.scheduled_hour}:00</p>
                      <p className="text-sm text-emerald-400 font-bold">${(parseInt(apt.amount) || 0).toLocaleString()} {apt.currency}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${
                        apt.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {apt.status}
                      </span>
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