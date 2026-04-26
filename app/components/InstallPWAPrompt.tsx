'use client';
import { useState, useEffect } from 'react';
/**
 * Banner profesional para invitar a instalar la PWA.
 * - Detecta Android Chrome (beforeinstallprompt) y muestra botón directo.
 * - Detecta iOS Safari y muestra mini-tutorial visual.
 * - Si la app ya está instalada, no muestra nada.
 * - Si dicen "Más tarde", espera 7 días para volver a mostrar.
 * - Espera 15s antes de aparecer (UX no agresiva).
 *
 * Props:
 *   variant: "landing" | "dashboard" — controla el copy
 */
type Variant = 'landing' | 'dashboard';
export default function InstallPWAPrompt({ variant = 'landing' }: { variant?: Variant }) {
  const [show, setShow] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 1. Detectar si ya está instalada (modo standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;
    // 2. Verificar cooldown: si dijo "Más tarde" en últimos 7 días, no mostrar
    const dismissedAt = parseInt(localStorage.getItem('pwa_prompt_dismissed') || '0', 10);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - dismissedAt < sevenDays) return;
    // 3. Detectar iOS (Safari)
    const ua = navigator.userAgent;
    const iosDetected = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(iosDetected);
    // 4. Si es Android/Chrome, capturar el evento nativo
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Mostrar después de 15 segundos
      setTimeout(() => setShow(true), 15000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    // 5. Si es iOS, mostrar después de 15 segundos también
    if (iosDetected) {
      setTimeout(() => setShow(true), 15000);
    }
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    }
    setInstallPrompt(null);
  };
  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };
  if (!show) return null;
  const copy = variant === 'dashboard'
    ? {
        title: 'Instala clientes.bot en tu celular',
        subtitle: 'Recibe alertas instantáneas cuando llegue un lead',
      }
    : {
        title: 'Instala la app gratis',
        subtitle: 'Tu negocio en automático, siempre a la mano',
      };
  return (
    <>
      {/* Banner */}
      <div
        className="
          fixed z-[9990] font-sans
          bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm
        "
      >
        <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0B0F1A] border border-indigo-500/30 rounded-2xl shadow-2xl p-5 backdrop-blur-md">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-500 hover:text-white text-lg w-7 h-7 flex items-center justify-center"
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              📱
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-white font-bold text-sm mb-0.5">{copy.title}</p>
              <p className="text-gray-400 text-[11px] leading-snug">{copy.subtitle}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            <li className="flex items-center gap-2 text-[11px] text-gray-300">
              <span className="text-emerald-400">✓</span>
              <span>Acceso instantáneo (1 toque)</span>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-gray-300">
              <span className="text-emerald-400">✓</span>
              <span>Notificaciones push de nuevos leads</span>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-gray-300">
              <span className="text-emerald-400">✓</span>
              <span>Más rápido que abrir el navegador</span>
            </li>
          </ul>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 text-gray-400 hover:text-white text-xs font-medium py-2.5 transition-all"
            >
              Más tarde
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              {isIOS ? 'Cómo instalar' : 'Instalar ahora'}
            </button>
          </div>
        </div>
      </div>
      {/* Modal con instrucciones para iOS */}
      {showIOSInstructions && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div
            className="bg-gradient-to-br from-[#1a1f2e] to-[#0B0F1A] border border-indigo-500/30 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold text-base">Instala en tu iPhone</p>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-gray-500 hover:text-white text-xl w-7 h-7 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-5">Sigue estos 3 pasos en Safari:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/5 rounded-xl p-3">
                <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-medium mb-0.5">Toca el botón Compartir</p>
                  <p className="text-gray-500 text-[10px]">El cuadrado con flecha hacia arriba</p>
                </div>
                <div className="shrink-0 text-2xl">📤</div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/5 rounded-xl p-3">
                <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-medium mb-0.5">Selecciona "Añadir a inicio"</p>
                  <p className="text-gray-500 text-[10px]">Baja en el menú hasta encontrarlo</p>
                </div>
                <div className="shrink-0 text-2xl">➕</div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/5 rounded-xl p-3">
                <div className="shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-medium mb-0.5">¡Listo! Toca "Añadir"</p>
                  <p className="text-gray-500 text-[10px]">El icono aparecerá en tu pantalla</p>
                </div>
                <div className="shrink-0 text-2xl">✅</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowIOSInstructions(false);
                handleDismiss();
              }}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}