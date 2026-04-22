'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
   fetch(`${API_URL}/payments`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setPayments(data.payments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const totalPaid = payments.filter(p => p.status === 'PAGADO').reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').length;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pagos 💳</h1>
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-6">
          <p className="text-[9px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">Total Recaudado</p>
          <p className="text-xl md:text-3xl font-bold text-emerald-400">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-6">
          <p className="text-[9px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">Aprobados</p>
          <p className="text-xl md:text-3xl font-bold text-indigo-400">{payments.filter(p => p.status === 'PAGADO').length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-6">
          <p className="text-[9px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">Pendientes</p>
          <p className="text-xl md:text-3xl font-bold text-yellow-400">{totalPending}</p>
        </div>
      </div>
      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'PAGADO', 'PENDING', 'RECHAZADO'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {f === 'all' ? 'Todos' : f}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay pagos {filter !== 'all' ? `con estado ${filter}` : ''}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pay, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  pay.status === 'PAGADO' ? 'bg-emerald-500/20' : pay.status === 'PENDING' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  {pay.status === 'PAGADO' ? '✅' : pay.status === 'PENDING' ? '⏳' : '❌'}
                </div>
                <div>
                  <p className="font-bold">{pay.service_name || 'Servicio'}</p>
                  <p className="text-sm text-gray-400">{pay.phoneNumber}</p>
                  <p className="text-[10px] text-gray-600">{pay.payment_reference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-400">${(parseInt(pay.amount) || 0).toLocaleString()} {pay.currency}</p>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  pay.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' :
                  pay.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {pay.status}
                </span>
                {pay.scheduled_date && (
                  <p className="text-[10px] text-gray-500 mt-1">Cita: {pay.scheduled_date} {pay.scheduled_hour}:00</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}