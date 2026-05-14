'use client';
import Link from 'next/link';
export default function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex w-7 h-7 rounded-full bg-white/15 items-center justify-center text-sm shrink-0">
            🎬
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] md:text-xs font-black text-white truncate">
              ESTÁS EN MODO DEMO
              <span className="hidden sm:inline ml-2 font-normal opacity-90">
                · Datos ficticios de Inmobiliaria Aurora
              </span>
            </p>
            <p className="hidden md:block text-[10px] text-white/80 mt-0.5">
              Navega como si fuera tu cuenta. Todo lo que ves es lo que recibirás al activar tu plan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Link
            href="/"
            className="hidden md:inline-block text-[10px] md:text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all whitespace-nowrap"
          >
            ← Volver a inicio
          </Link>
          <Link
            href="/auth/login"
            className="text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 bg-white text-indigo-700 hover:bg-gray-100 font-black rounded-lg shadow-lg transition-all whitespace-nowrap"
          >
            🚀 Crear mi cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}