'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
/**
 * Página invisible de routing PWA.
 * El manifest.json apunta aquí (start_url: "/launch").
 * Decide adónde mandar al usuario según su estado de auth.
 */
export default function LaunchPage() {
  const router = useRouter();
  useEffect(() => {
    // Detectar token de Cognito en localStorage
    const hasAuth = typeof window !== 'undefined' && (
      Object.keys(localStorage).some((k) => k.startsWith('CognitoIdentityServiceProvider')) ||
      !!localStorage.getItem('cb_id_token') ||
      !!localStorage.getItem('cb_company_id')
    );
    if (hasAuth) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="text-center">
        <img src="/cb-logo.webp" alt="clientes.bot" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-xs mt-4">Iniciando clientes.bot...</p>
      </div>
    </div>
  );
}