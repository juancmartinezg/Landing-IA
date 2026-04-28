'use client';
import { useAuth } from '../../providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// 24h en milisegundos
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
export default function Admin2FAVerifyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<{
    passkey_enabled: boolean;
    totp_enabled: boolean;
  } | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  // Marcar como verificado y redirigir al admin
  const completeVerification = () => {
    const expiresAt = Date.now() + VERIFY_TTL_MS;
    localStorage.setItem('cb_admin_2fa_verified_until', String(expiresAt));
    router.replace('/admin');
  };
  // Cargar estado 2FA al inicio
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/admin/2fa-status`, {
      headers: {
        'client-id': user.sub || user.email,
        'x-user-email': user.email,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.has_2fa) {
          // No tiene 2FA → forzar setup
          router.replace('/admin/2fa-setup');
          return;
        }
        setStatus({
          passkey_enabled: !!data.passkey_enabled,
          totp_enabled: !!data.totp_enabled,
        });
      })
      .catch(() => setError('Error de conexión'));
  }, [user, router]);
  // Verificar con huella
  const verifyWithPasskey = async () => {
    if (!user?.email) return;
    setError('');
    try {
      const optRes = await fetch(`${API_URL}/auth/passkey-login-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const optData = await optRes.json();
      if (!optData.options) {
        setError(optData.error || 'No se pudo obtener opciones de huella');
        return;
      }
      const opts = optData.options;
      opts.challenge = Uint8Array.from(
        atob(opts.challenge.replace(/-/g, '+').replace(/_/g, '/')),
        (c: string) => c.charCodeAt(0)
      );
      opts.allowCredentials = (opts.allowCredentials || []).map((c: any) => ({
        ...c,
        id: Uint8Array.from(
          atob(c.id.replace(/-/g, '+').replace(/_/g, '/')),
          (c: string) => c.charCodeAt(0)
        ),
      }));
      const credential = (await navigator.credentials.get({
        publicKey: opts,
      })) as any;
      const verifyRes = await fetch(
        `${API_URL}/auth/passkey-login-complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            credential: {
              id: credential.id,
              rawId: credential.id,
              type: credential.type,
              response: {
                clientDataJSON: btoa(
                  String.fromCharCode(
                    ...new Uint8Array(credential.response.clientDataJSON)
                  )
                )
                  .replace(/\+/g, '-')
                  .replace(/\//g, '_')
                  .replace(/=+$/, ''),
                authenticatorData: btoa(
                  String.fromCharCode(
                    ...new Uint8Array(credential.response.authenticatorData)
                  )
                )
                  .replace(/\+/g, '-')
                  .replace(/\//g, '_')
                  .replace(/=+$/, ''),
                signature: btoa(
                  String.fromCharCode(
                    ...new Uint8Array(credential.response.signature)
                  )
                )
                  .replace(/\+/g, '-')
                  .replace(/\//g, '_')
                  .replace(/=+$/, ''),
              },
            },
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        completeVerification();
      } else {
        setError(verifyData.error || 'No se pudo verificar la huella');
      }
    } catch (e: any) {
      if (e.name !== 'NotAllowedError') {
        setError('Error con la huella. Usa el código.');
      }
    }
  };
  // Enviar código por email
  const sendCode = async () => {
    if (!user?.email) return;
    setError('');
    try {
      await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      setCodeSent(true);
    } catch {
      setError('Error enviando código');
    }
  };
  // Verificar código (TOTP o email)
  const verifyCode = async () => {
    if (!user?.email || code.length !== 6) {
      setError('Ingresa los 6 dígitos');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code }),
      });
      const data = await res.json();
      if (data.verified) {
        completeVerification();
      } else {
        setError(data.error || 'Código incorrecto');
      }
    } catch {
      setError('Error de conexión');
    }
    setSubmitting(false);
  };
  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <p className="text-5xl mb-4">🔐</p>
          <h1 className="text-2xl font-black text-white mb-2">Verifica tu identidad</h1>
          <p className="text-sm text-gray-400">
            Antes de acceder al panel admin, necesitamos confirmar que eres tú.
          </p>
          <p className="text-[10px] text-gray-600 mt-2">
            La verificación dura 24 horas en este navegador.
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
          {/* Botón huella si está disponible */}
          {status.passkey_enabled && (
            <button
              type="button"
              onClick={verifyWithPasskey}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <span className="text-xl">🔐</span>
              Verificar con huella / Face ID
            </button>
          )}
          {/* Separador si hay ambos métodos */}
          {status.passkey_enabled && (status.totp_enabled || codeSent) && (
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                o usa código
              </span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          )}
          {/* Input de código */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none focus:border-indigo-500 transition-all"
            autoFocus={!status.passkey_enabled}
          />
          <button
            onClick={verifyCode}
            disabled={submitting || code.length !== 6}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold py-3 rounded-2xl transition-all"
          >
            {submitting ? '⏳ Verificando...' : '✅ Verificar código'}
          </button>
          {/* Si solo tiene email code, mostrar botón enviar */}
          {!status.totp_enabled && (
            <button
              onClick={sendCode}
              className="w-full text-indigo-400 hover:text-indigo-300 text-xs font-medium py-2 transition-all"
            >
              {codeSent
                ? '📧 Reenviar código por email'
                : '📧 Enviar código a mi email'}
            </button>
          )}
          {status.totp_enabled && !codeSent && (
            <p className="text-[10px] text-gray-500 text-center">
              Ingresa el código de tu app autenticadora (Google Authenticator).
            </p>
          )}
        </div>
        <Link
          href="/dashboard"
          className="block w-full text-gray-500 hover:text-gray-300 text-xs py-3 text-center transition-all mt-4"
        >
          ← Volver a mi dashboard
        </Link>
      </div>
    </div>
  );
}