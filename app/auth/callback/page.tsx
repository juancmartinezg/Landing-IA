'use client';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
const COGNITO_DOMAIN = 'https://us-east-1kijdadxdl.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '4r4jhvvutib915k449sr67kuce';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.push('/auth/login');
      return;
    }
    const redirectUri = `${window.location.origin}/auth/callback`;
    console.log('[CALLBACK] code:', code, 'redirect_uri:', redirectUri);
    fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: redirectUri,
      }),
    })
      .then(res => res.json())
      .then(async (data) => {
        console.log('[CALLBACK] token response:', data);
        if (data.id_token) {
          const payload = JSON.parse(atob(data.id_token.split('.')[1]));
          const email = payload.email || '';
          const name = payload.name || payload.email || '';
          // Buscar company_id en UserMapping
          let companyId = '', role = 'owner', agentId = '';
          try {
            const meRes = await fetch(`${API_URL}/me?email=${encodeURIComponent(email)}`);
            if (meRes.ok) {
              const meData = await meRes.json();
              companyId = meData.company_id || '';
              role = meData.role || 'owner';
              agentId = meData.agent_id || '';
            }
          } catch (err) {
            console.error('Error fetching /me:', err);
          }
          const user = {
            email,
            name,
            sub: payload.sub || '',
            accessToken: data.access_token || '',
            companyId,
            role,
            agentId,
          };
          localStorage.setItem('cb_user', JSON.stringify(user));
          localStorage.setItem('cb_tokens', JSON.stringify({
            id_token: data.id_token,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          }));
          if (!companyId) {
            window.location.href = '/auth/welcome';
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          console.error('Token exchange failed:', data);
          router.push('/auth/login');
        }
      })
      .catch(err => {
        console.error('Callback error:', err);
        router.push('/auth/login');
      });
  }, [searchParams, router]);
  return (
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-sm">Iniciando sesion...</p>
    </div>
  );
}
export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-sm">Cargando...</p>
        </div>
      }>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}