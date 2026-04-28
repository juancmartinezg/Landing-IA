'use client';
import { useAuth } from '../../providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function Admin2FASetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  // Polling cada 5s — si el admin configura 2FA en otra pestaña, este detecta y deja pasar
  useEffect(() => {
    if (!user?.email) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/admin/2fa-status`, {
          headers: {
            'client-id': user.sub || user.email,
            'x-user-email': user.email,
          },
        });
        const data = await res.json();
        if (data.has_2fa) {
          clearInterval(interval);
          // Tiene 2FA — ir a verificar
          router.replace('/admin/2fa-verify');
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [user, router]);
  const checkNow = async () => {
    if (!user?.email) return;
    setChecking(true);
    try {
      const res = await fetch(`${API_URL}/admin/2fa-status`, {
        headers: {
          'client-id': user.sub || user.email,
          'x-user-email': user.email,
        },
      });
      const data = await res.json();
      if (data.has_2fa) {
        router.replace('/admin/2fa-verify');
        return;
      }
    } catch {}
    setChecking(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <p className="text-6xl mb-4">🔐</p>
          <h1 className="text-2xl font-black text-white mb-2">2FA requerido</h1>
          <p className="text-sm text-gray-400">
            Como administrador de la plataforma, necesitas configurar verificación
            en 2 pasos antes de acceder al panel.
          </p>
        </div>
        <div className="bg-white/[0.03] border border-yellow-500/20 rounded-3xl p-6 mb-4">
          <p className="text-sm text-yellow-400 font-bold mb-3">⚠️ Por seguridad</p>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Toda acción que hagas en el panel admin queda en auditoría. Para proteger
            tu cuenta y los datos de los clientes, exigimos un segundo factor:
          </p>
          <ul className="text-xs text-gray-300 space-y-2">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Huella / Face ID</strong> (recomendado, 1 click)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>App autenticadora</strong> (Google Authenticator, Authy)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Código por email</strong> (fallback)</span>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <Link
            href="/dashboard/settings"
            className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl text-center transition-all shadow-lg shadow-indigo-600/20"
          >
            🔧 Ir a Configuración para activar 2FA
          </Link>
          <button
            onClick={checkNow}
            disabled={checking}
            className="block w-full border border-white/10 text-gray-400 font-bold py-3 px-6 rounded-2xl hover:bg-white/5 transition-all text-sm disabled:opacity-50"
          >
            {checking ? '⏳ Verificando...' : '🔄 Ya configuré 2FA, continuar'}
          </button>
          <Link
            href="/dashboard"
            className="block w-full text-gray-500 hover:text-gray-300 text-xs py-2 text-center transition-all"
          >
            ← Volver a mi dashboard
          </Link>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-6">
          Esta pantalla se cierra automáticamente cuando detectamos que activaste 2FA.
        </p>
      </div>
    </div>
  );
}