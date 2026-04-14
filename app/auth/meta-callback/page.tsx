'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
function MetaCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Conectando tu WhatsApp...');
  useEffect(() => {
    const code = searchParams.get('code');
    const stateRaw = searchParams.get('state');
    const error = searchParams.get('error');
    if (error) {
      setStatus('error');
      setMessage('Cancelaste la conexión o hubo un error. Puedes intentar de nuevo.');
      return;
    }
    if (!code) {
      setStatus('error');
      setMessage('No se recibió el código de autorización.');
      return;
    }
    let clientId = 'JMC';
    try {
      const state = JSON.parse(decodeURIComponent(stateRaw || '{}'));
      clientId = state.client_id || 'JMC';
    } catch {}
    const exchangeToken = async () => {
      try {
        setMessage('Intercambiando token con Meta...');
        const res = await fetch(`${API_URL}/meta/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'client-id': clientId },
          body: JSON.stringify({
            code,
            redirect_uri: window.location.origin + '/auth/meta-callback',
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus('success');
          setMessage('¡WhatsApp conectado exitosamente! Redirigiendo...');
          setTimeout(() => {
            window.location.href = '/dashboard/whatsapp';
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Error conectando WhatsApp. Intenta de nuevo.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión. Intenta de nuevo.');
      }
    };
    exchangeToken();
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="max-w-md w-full bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Conectando WhatsApp</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">¡Conectado!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <a href="/dashboard/whatsapp"
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all">
              Volver a intentar
            </a>
          </>
        )}
      </div>
    </div>
  );
}
export default function MetaCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MetaCallbackContent />
    </Suspense>
  );
}