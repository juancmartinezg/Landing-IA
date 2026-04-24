'use client';
import { useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useAuth } from '../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const VAPID_KEY = 'BDciqjkK9QYD1ZkU2jVDxR4pol9exQyKPlOEaVNFAp8Q4-rBLQYivwbLlASp8m1c0lTr7141hkkCBoaZKVRLu8I';
const firebaseConfig = {
  apiKey: 'AIzaSyBIAuESVxgqQRallMBGSZ3EDBP1S_2jIBU',
  authDomain: 'clientesbot-fa065.firebaseapp.com',
  projectId: 'clientesbot-fa065',
  storageBucket: 'clientesbot-fa065.firebasestorage.app',
  messagingSenderId: '29526887196',
  appId: '1:29526887196:web:8b3a633976cdc16f5148d9',
};
export default function PushSetup() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.companyId || typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    const setup = async () => {
      try {
        const perm = Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission;
        if (perm !== 'granted') return;
        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const messaging = getMessaging(app);
        const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
        if (token) {
          const savedToken = localStorage.getItem('cb_push_token');
          if (savedToken !== token) {
            await fetch(`${API_URL}/push/subscribe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'client-id': user.companyId },
              body: JSON.stringify({ token, device: 'web' }),
            });
            localStorage.setItem('cb_push_token', token);
            console.log('[PushSetup] Token registrado');
          }
        }
        // Foreground messages
        onMessage(messaging, (payload: any) => {
          const title = payload.notification?.title || 'clientes.bot';
          const body = payload.notification?.body || '';
          try { new Notification(title, { body, icon: '/icon-192x192.png' }); } catch {}
        });
      } catch (e) {
        console.warn('[PushSetup] Error:', e);
      }
    };
    setup();
  }, [user]);
  return null;
}