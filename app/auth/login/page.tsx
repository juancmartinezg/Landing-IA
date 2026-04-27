'use client';
import { useAuth } from '../../providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function LoginPage() {
  const { user, loading, loginWithGoogle, signUpWithEmail, signInWithEmail, confirmSignUp } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'confirm'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  useEffect(() => {
    if (checked) return;
    setChecked(true);
    // Si viene con ?2fa=1 (redirect del callback Google con 2FA pendiente)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('2fa') === '1') {
        const pendingEmail = sessionStorage.getItem('cb_pending_2fa') || '';
        if (pendingEmail) {
          setEmail(pendingEmail);
          setMode('2fa' as any);
          sessionStorage.removeItem('cb_pending_2fa');
          // Limpiar query string sin recargar
          window.history.replaceState({}, '', '/auth/login');
        }
        return;
      }
    }
    const stored = localStorage.getItem('cb_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.companyId) router.replace('/dashboard');
        else router.replace('/auth/welcome');
      } catch { router.replace('/dashboard'); }
    }
  }, [checked, router]);
  const handleEmailSubmit = async () => {
    setError(''); setSubmitting(true);
    if (mode === 'register') {
      if (!name.trim()) { setError('Escribe tu nombre'); setSubmitting(false); return; }
      if (password.length < 8) { setError('La contraseña debe tener mínimo 8 caracteres'); setSubmitting(false); return; }
      if (password !== password2) { setError('Las contraseñas no coinciden'); setSubmitting(false); return; }
      const res = await signUpWithEmail(email, password, name);
      if (res.ok && res.needsConfirm) { setMode('confirm'); }
      else if (res.error) setError(res.error);
   } else if (mode === 'login') {
      const res = await signInWithEmail(email, password);
      if (res.ok) {
        // Verificar si tiene 2FA activado
        try {
          const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/me?email=${encodeURIComponent(email)}`);
          const meData = await meRes.json();
          const has2FA = meData.totp_enabled || meData.passkey_enabled || false;
          if (has2FA) {
            // Tiene 2FA — mostrar pantalla de verificación
            setMode('2fa' as any);
            // Si tiene passkey, intentar automáticamente
            if (meData.passkey_enabled && window.PublicKeyCredential) {
              try {
                const optRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/passkey-login-options`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                });
                const optData = await optRes.json();
                if (optData.options) {
                  const opts = optData.options;
                  opts.challenge = Uint8Array.from(atob(opts.challenge.replace(/-/g,'+').replace(/_/g,'/')), (c: string) => c.charCodeAt(0));
                  opts.allowCredentials = (opts.allowCredentials || []).map((c: any) => ({
                    ...c, id: Uint8Array.from(atob(c.id.replace(/-/g,'+').replace(/_/g,'/')), (c: string) => c.charCodeAt(0)),
                  }));
                  const credential = await navigator.credentials.get({ publicKey: opts }) as any;
                  const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/passkey-login-complete`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email,
                      credential: {
                        id: credential.id,
                        rawId: credential.id,
                        type: credential.type,
                        response: {
                          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                          authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credential.response.authenticatorData))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                          signature: btoa(String.fromCharCode(...new Uint8Array(credential.response.signature))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                        },
                      },
                    }),
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.verified) {
                    const stored2 = localStorage.getItem('cb_user');
                    const parsed2 = stored2 ? JSON.parse(stored2) : {};
                    if (parsed2.companyId) router.push('/dashboard');
                    else router.push('/auth/welcome');
                    setSubmitting(false);
                    return;
                  }
                }
              } catch (pkErr) {
                // Passkey falló (usuario canceló, no soportado) — fallback a código
                console.log('Passkey fallback a código:', pkErr);
              }
            }
            // Enviar código por email automáticamente como fallback
            if (!meData.passkey_enabled || true) {
              fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/send-code`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
              }).catch(() => {});
            }
            setSubmitting(false);
            return;
          }
        } catch (e) {
          console.log('2FA check failed, proceeding without:', e);
        }
        // Sin 2FA — directo al dashboard
        localStorage.setItem('cb_last_email', email);
        const stored = localStorage.getItem('cb_user');
        const parsed = stored ? JSON.parse(stored) : {};
        if (parsed.companyId) router.push('/dashboard');
        else router.push('/auth/welcome');
      } else if (res.error) setError(res.error);
    } else if (mode === 'confirm') {
      const res = await confirmSignUp(email, code);
      if (res.ok) {
        const signIn = await signInWithEmail(email, password);
        if (signIn.ok) router.push('/auth/welcome');
        else { setMode('login'); setError('Cuenta confirmada. Inicia sesión.'); }
      } else if (res.error) setError(res.error);
    }
    setSubmitting(false);
  };
  if (!checked || loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  // Pantalla de verificación 2FA
  if ((mode as string) === '2fa') {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/cb-logo.webp" alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-bold text-white tracking-tighter">clientes.bot</span>
            </div>
            <p className="text-gray-400 text-sm">Verificación en 2 pasos</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔐</div>
              <h2 className="text-lg font-bold text-white mb-2">Ingresa tu código</h2>
              <p className="text-gray-400 text-xs">
                Te enviamos un código de 6 dígitos a <strong className="text-white">{email}</strong>
              </p>
            </div>
           {error && <p className="text-red-400 text-xs text-center mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none focus:border-indigo-500 transition-all mb-4"
              autoFocus
            />
            <button
              onClick={async () => {
                if (code.length !== 6) { setError('Ingresa los 6 dígitos'); return; }
                setSubmitting(true); setError('');
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/verify-2fa`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code }),
                  });
                  const data = await res.json();
                  if (data.verified) {
                    const stored = localStorage.getItem('cb_user');
                    const parsed = stored ? JSON.parse(stored) : {};
                    if (parsed.companyId) router.push('/dashboard');
                    else router.push('/auth/welcome');
                  } else {
                    setError(data.error || 'Código incorrecto');
                  }
                } catch { setError('Error de conexión'); }
                setSubmitting(false);
              }}
              disabled={submitting || code.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold py-4 rounded-2xl transition-all mb-3"
            >
              {submitting ? '⏳ Verificando...' : '✅ Verificar'}
            </button>
            <button
              onClick={async () => {
                setError('');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/send-code`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                });
                if (res.ok) setError('');
              }}
              className="w-full text-indigo-400 hover:text-indigo-300 text-xs font-medium py-2 transition-all"
            >
              📧 Reenviar código
            </button>
            <button
              onClick={() => { setMode('login'); setCode(''); setError(''); }}
              className="w-full text-gray-500 hover:text-gray-400 text-xs py-2 transition-all mt-1"
            >
              ← Volver al login
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/cb-logo.webp" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tighter">clientes.bot</span>
          </div>
          <p className="text-gray-400 text-sm">{mode === 'register' ? 'Crea tu cuenta gratis' : mode === 'confirm' ? 'Confirma tu email' : 'Inicia sesión para acceder'}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          {/* Botón huella/FaceID — siempre visible, usa el email del form */}
          {typeof window !== 'undefined' && (window as any).PublicKeyCredential && (
            <button
              type="button"
              onClick={async () => {
                const targetEmail = email.trim() || localStorage.getItem('cb_last_email') || '';
                if (!targetEmail) {
                  setError('Escribe tu email primero abajo, luego usa la huella');
                  return;
                }
                setEmail(targetEmail);
                setError('');
                try {
                  const optRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/passkey-login-options`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: targetEmail }),
                  });
                  const optData = await optRes.json();
                  if (!optData.options) {
                    setError(optData.error || 'No tienes huella registrada con este email');
                    return;
                  }
                  const opts = optData.options;
                  opts.challenge = Uint8Array.from(atob(opts.challenge.replace(/-/g,'+').replace(/_/g,'/')), (c: string) => c.charCodeAt(0));
                  opts.allowCredentials = (opts.allowCredentials || []).map((c: any) => ({
                    ...c, id: Uint8Array.from(atob(c.id.replace(/-/g,'+').replace(/_/g,'/')), (c: string) => c.charCodeAt(0)),
                  }));
                  const credential = await navigator.credentials.get({ publicKey: opts }) as any;
                  const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/passkey-login-complete`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: targetEmail,
                      credential: {
                        id: credential.id,
                        rawId: credential.id,
                        type: credential.type,
                        response: {
                          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                          authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credential.response.authenticatorData))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                          signature: btoa(String.fromCharCode(...new Uint8Array(credential.response.signature))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
                        },
                      },
                    }),
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.verified) {
                    // Cargar /me para obtener companyId/role/agentId
                    let companyId = '', role = 'owner', agentId = '';
                    try {
                      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/me?email=${encodeURIComponent(targetEmail)}`);
                      if (meRes.ok) {
                        const meData = await meRes.json();
                        companyId = meData.company_id || '';
                        role = meData.role || 'owner';
                        agentId = meData.agent_id || '';
                      }
                    } catch {}
                    // Guardar sesión
                    const userData = { email: targetEmail, name: targetEmail, sub: '', accessToken: '', companyId, role, agentId };
                    localStorage.setItem('cb_user', JSON.stringify(userData));
                    localStorage.setItem('cb_last_email', targetEmail);
                    if (companyId) router.push('/dashboard');
                    else router.push('/auth/welcome');
                  } else {
                    setError(verifyData.error || 'No se pudo verificar la huella');
                  }
                } catch (e: any) {
                  if (e.name !== 'NotAllowedError') {
                    setError('Error con la huella. Usa email y contraseña.');
                  }
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all mb-3 shadow-lg shadow-indigo-600/20"
            >
              <span className="text-xl">🔐</span>
              Iniciar con huella / Face ID
            </button>
          )}
          <button onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-xs uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
          {mode === 'confirm' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 text-center">Te enviamos un código de verificación a <strong className="text-white">{email}</strong></p>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Código de verificación"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 text-white text-center tracking-[0.3em] text-lg" />
              <button onClick={handleEmailSubmit} disabled={submitting || !code}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50">
                {submitting ? '⏳ Verificando...' : '✅ Confirmar'}
              </button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleEmailSubmit(); }} className="space-y-3">
              {mode === 'register' && (
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 text-white" />
              )}
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 text-white" />
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Contraseña"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 text-white pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm transition-all">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {mode === 'register' && <p className="text-[9px] text-gray-500 -mt-1 ml-1">Mínimo 8 caracteres, una mayúscula y un número</p>}
              {mode === 'register' && (
                <input value={password2} onChange={e => setPassword2(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Confirmar contraseña"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 text-white" />
              )}
              <button type="submit" disabled={submitting || !email || !password}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                {submitting ? '⏳...' : mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </form>
          )}
          {mode !== 'confirm' && (
            <div className="mt-4 text-center">
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setPassword(''); setPassword2(''); }}
                className="text-gray-400 text-sm hover:text-white transition-all">
                {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          )}
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 text-sm hover:text-white transition-colors">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}