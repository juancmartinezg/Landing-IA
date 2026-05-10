'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface SupportRequest {
  request_id: string;
  brand_name: string;
  admin_email: string;
  reason: string;
  created_at: number;
  expires_at: number;
  status: string;
}
export default function SupportApprovePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const requestId = (params?.id as string) || '';
  const token = searchParams?.get('token') || '';
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [error, setError] = useState('');
  const [acting, setActing] = useState<'approve' | 'deny' | null>(null);
  const [result, setResult] = useState<{ action: string; message: string } | null>(null);
  useEffect(() => {
    if (!requestId || !token) {
      setError('Link inválido. Falta request_id o token.');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/support/approve/${encodeURIComponent(requestId)}?token=${encodeURIComponent(token)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || 'Error cargando solicitud');
        } else {
          setRequest(data.request);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || 'Error de conexión');
        setLoading(false);
      });
  }, [requestId, token]);
  const act = async (action: 'approve' | 'deny') => {
    if (!request) return;
    if (action === 'deny' && !confirm('¿Denegar la solicitud? El admin recibirá una notificación.')) return;
setActing(action);
    try {
      const res = await fetch(`${API_URL}/support/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, token, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ action, message: data.message || (action === 'approve' ? 'Aprobado' : 'Denegado') });
      } else {
        setError(data.error || `Error ${res.status}`);
      }
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setActing(null);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-red-400 mb-2">No se pudo cargar la solicitud</h1>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <p className="text-[11px] text-gray-600">
            Si el link tiene más de 24 horas, expiró. Pídele al admin que envíe una nueva solicitud.
          </p>
        </div>
      </div>
    );
  }
  if (result) {
    const isApproved = result.action === 'approve';
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center p-4">
        <div className={`max-w-md w-full ${isApproved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-500/10 border-gray-500/30'} border rounded-2xl p-8 text-center`}>
          <p className="text-5xl mb-4">{isApproved ? '✅' : '🚫'}</p>
          <h1 className={`text-xl font-bold mb-2 ${isApproved ? 'text-emerald-400' : 'text-gray-300'}`}>
            {isApproved ? 'Solicitud aprobada' : 'Solicitud denegada'}
          </h1>
          <p className="text-sm text-gray-400 mb-4">{result.message}</p>
          <p className="text-[11px] text-gray-600">
            {isApproved
              ? 'El admin tiene escritura por 30 minutos. Recibirás un email con el resumen de acciones al cerrar.'
              : 'El admin recibió la notificación. No se activó ningún acceso.'}
          </p>
        </div>
      </div>
    );
  }
  if (!request) return null;
  if (request.status !== 'PENDING') {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-5xl mb-4">📋</p>
          <h1 className="text-xl font-bold mb-2">Solicitud ya procesada</h1>
          <p className="text-sm text-gray-400 mb-4">
            Esta solicitud está en estado <span className="font-bold text-indigo-400">{request.status}</span>.
          </p>
        </div>
      </div>
    );
  }
  const createdDate = new Date(request.created_at * 1000).toLocaleString('es-CO');
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-6">
          <p className="text-5xl mb-3">🆘</p>
          <h1 className="text-xl font-bold mb-1">Solicitud de soporte</h1>
          <p className="text-sm text-gray-400">
            Un administrador necesita acceso temporal a tu cuenta <span className="text-indigo-400 font-bold">{request.brand_name}</span>
          </p>
        </div>
        <div className="bg-indigo-500/10 border-l-4 border-indigo-500 rounded-lg p-4 mb-4">
          <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest mb-1">Razón</p>
          <p className="text-sm text-white leading-relaxed">{request.reason}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Solicitado por</p>
            <p className="text-sm text-white font-mono">{request.admin_email}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Fecha de solicitud</p>
            <p className="text-sm text-gray-300">{createdDate}</p>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
          <p className="text-[11px] text-yellow-300 leading-relaxed">
            ⚠️ Si apruebas, el admin tendrá <strong>escritura por 30 minutos</strong>.
            Todas sus acciones quedan registradas. Recibirás un email con el resumen al cerrar.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => act('deny')}
            disabled={acting !== null}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acting === 'deny' ? '⏳' : '✗ Denegar'}
          </button>
          <button
            onClick={() => act('approve')}
            disabled={acting !== null}
            className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acting === 'approve' ? '⏳' : '✓ Aprobar'}
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-6">
          Si NO solicitaste este soporte o no reconoces al admin, simplemente cierra esta página o haz click en <strong>Denegar</strong>.
        </p>
      </div>
    </div>
  );
}