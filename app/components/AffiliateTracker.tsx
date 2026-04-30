'use client';
import { useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const COOKIE_NAME = 'cb_ref';
const COOKIE_DAYS = 90;
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}
/**
 * AffiliateTracker — captura ?ref=CODE de la URL.
 * 1. Lee query string `ref` al cargar cualquier página.
 * 2. Valida contra /affiliate/validate-code (público).
 * 3. Si válido: guarda cookie `cb_ref` por 90 días + localStorage.
 * 4. Limpia el ?ref= de la URL (UX).
 *
 * En `/dashboard/billing`, el `handleCheckout` lee la cookie y la envía
 * como `ref_code` para que el webhook atribuya la comisión al afiliado.
 */
export default function AffiliateTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = (params.get('ref') || '').trim().toUpperCase();
    if (!ref || ref.length > 12) return;
    // Si ya tenemos la misma cookie, no re-validar
    const existing = getCookie(COOKIE_NAME);
    if (existing === ref) {
      // Limpiar URL igual
      params.delete('ref');
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    // Validar contra backend
    fetch(`${API_URL}/affiliate/validate-code?code=${encodeURIComponent(ref)}`)
      .then((r: any) => r.json())
      .then((data: any) => {
        if (data?.valid) {
          setCookie(COOKIE_NAME, ref, COOKIE_DAYS);
          try {
            localStorage.setItem('cb_ref', ref);
            localStorage.setItem('cb_ref_at', String(Date.now()));
            localStorage.setItem('cb_ref_name', data.affiliate_name || '');
          } catch (e) {
            console.warn('localStorage no disponible:', e);
          }
          console.log(`[Affiliate] Referido por ${data.affiliate_name} (${ref})`);
        }
      })
      .catch((e: any) => console.warn('Affiliate validate error:', e))
      .finally(() => {
        // Limpiar ?ref= de la URL siempre (UX)
        params.delete('ref');
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      });
  }, []);
  return null;
}
/**
 * Helper export: leer el ref_code actual (cookie o localStorage).
 * Usado por /dashboard/billing para inyectar en checkout.
 */
export function getStoredRefCode(): string {
  if (typeof window === 'undefined') return '';
  const cookie = getCookie(COOKIE_NAME);
  if (cookie) return cookie;
  try {
    return localStorage.getItem('cb_ref') || '';
  } catch {
    return '';
  }
}