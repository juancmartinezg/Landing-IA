'use client';
import { createContext, useContext, useState, useCallback } from 'react';
interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}
const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
});
export const useToast = () => useContext(ToastContext);
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const show = useCallback((msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  const success = useCallback((msg: string) => show(`✓ ${msg}`, 'success'), [show]);
  const error = useCallback((msg: string) => show(`✕ ${msg}`, 'error'), [show]);
  const info = useCallback((msg: string) => show(msg, 'info'), [show]);
  const colors: Record<string, string> = {
    success: 'border-emerald-500/30 text-emerald-400',
    error: 'border-red-500/30 text-red-400',
    info: 'border-indigo-500/30 text-indigo-400',
  };
  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 bg-[#1a1f2e] border rounded-xl px-5 py-3 text-sm font-medium shadow-xl ${colors[toast.type] || colors.info}`}>
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}