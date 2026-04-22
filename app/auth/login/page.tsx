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