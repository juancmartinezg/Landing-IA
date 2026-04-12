'use client';
import { useAuth } from '../../../app/providers';
export default function LoginPage() {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/cb-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tighter">clientes.bot</span>
          </div>
          <p className="text-gray-400 text-sm">Inicia sesion para acceder a tu dashboard</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all mb-4"
          >
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
          <button
            onClick={login}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Iniciar sesion con email
          </button>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              No tienes cuenta?{' '}
              <button onClick={login} className="text-indigo-400 hover:text-indigo-300 font-bold">
                Registrate gratis
              </button>
            </p>
          </div>
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