'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  useEffect(() => {
    const stored = localStorage.getItem('cb_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setName(parsed.name || parsed.email || '');
        if (parsed.companyId) {
          router.push('/dashboard');
        }
      } catch {}
    } else {
      router.push('/auth/login');
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/cb-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tighter">clientes.bot</span>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm text-center">
          <p className="text-4xl mb-4">👋</p>
          <h2 className="text-xl font-bold text-white mb-2">
            ¡Hola{name ? `, ${name.split(' ')[0]}` : ''}!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            No encontramos una cuenta asociada a tu correo. ¿Quieres crear tu negocio en clientes.bot?
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              🚀 Crear mi negocio gratis
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('cb_user');
                localStorage.removeItem('cb_tokens');
                router.push('/auth/login');
              }}
              className="w-full border border-white/10 text-gray-400 font-bold py-3 px-6 rounded-2xl hover:bg-white/5 transition-all text-sm"
            >
              Usar otra cuenta
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-4">
            Prueba gratis por 7 días. Sin tarjeta de crédito.
          </p>
        </div>
        <div className="text-center mt-6">
          <a href="/" className="text-gray-500 text-sm hover:text-white transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}