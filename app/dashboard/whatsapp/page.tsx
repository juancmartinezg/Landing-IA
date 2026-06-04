'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const META_APP_ID = '27398458396409385';
const META_CONFIG_ID = '997214322992918';
export default function WhatsAppPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [pinState, setPinState] = useState<{ required: boolean; phoneNumberId: string }>({ required: false, phoneNumberId: '' });
  const [pin, setPin] = useState('');
  const [submittingPin, setSubmittingPin] = useState(false);
  const [enablingChat, setEnablingChat] = useState(false);
  const [chatConvMsg, setChatConvMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const sessionData = useRef<any>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };
  useEffect(() => {
    fetch(`${API_URL}/config`, { headers: { 'client-id': user?.companyId || '' } })
      .then((res: any) => res.json())
      .then((data: any) => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  // SDK de Facebook — patron oficial
  useEffect(() => {
    if ((window as any).FB) { setSdkReady(true); return; }
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        cookie: true,
        xfbml: true,
        version: 'v25.0',
      });
      setSdkReady(true);
    };
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
  // Listener para recibir datos de sesion del Embedded Signup
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!['https://www.facebook.com', 'https://business.facebook.com'].includes(event.origin)) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('WA_EMBEDDED_SIGNUP data:', data.data);
          sessionData.current = data.data;
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  const isConnected = config?.phone_number_id && config?.waba_id && config.phone_number_id !== 'pending' && config.waba_id !== 'pending' && config.phone_number_id !== 'DISCONNECTED' && config.waba_id !== 'DISCONNECTED';
  const handleSignupResponse = useCallback(async (response: any) => {
    console.log('Embedded Signup response:', JSON.stringify(response));
    if (response.authResponse) {
      setConnecting(true);
      const code = response.authResponse.code || '';
      const accessToken = response.authResponse.accessToken || '';
      const waData = sessionData.current || {};
      try {
        const res = await fetch(`${API_URL}/meta/exchange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'client-id': user?.companyId || '',
          },
          body: JSON.stringify({
            code,
            access_token: accessToken,
            waba_id: waData.whatsapp_business_account_id || waData.waba_id || '',
            phone_number_id: waData.phone_number_id || '',
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          window.location.href = '/dashboard/whatsapp';
          return;
        } else if (res.ok && data.requires_pin) {
          setConnecting(false);
          setPinState({ required: true, phoneNumberId: data.phone_number_id || '' });
          return;
        } else {
          showToast('Error: ' + (data.error || 'No se pudo conectar'));
        }
      } catch (err: any) {
        showToast('Error de conexión con el servidor');
      }
      setConnecting(false);
    }
  }, [config, user]);
  const handlePinSubmit = async () => {
    if (pin.length !== 6) return showToast('El PIN debe tener 6 dígitos');
    setSubmittingPin(true);
    try {
      const res = await fetch(`${API_URL}/meta/register-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ phone_number_id: pinState.phoneNumberId, pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/dashboard/whatsapp';
        return;
      } else {
        showToast('PIN incorrecto: ' + (data.error || 'Intenta de nuevo'));
      }
    } catch {
      showToast('Error enviando el PIN');
    }
    setSubmittingPin(false);
  };  
  const handleConnect = () => {
    const FB = (window as any).FB;
    if (!FB) return showToast('SDK no cargado');
    sessionData.current = null;
    setConnecting(true);
    FB.login((response: any) => {
      if (response.authResponse) {
        handleSignupResponse(response);
      } else {
        setConnecting(false);
        if (response.status !== 'unknown') {
          showToast('Conexión cancelada');
        }
      }
    }, {
      config_id: META_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '',
        sessionInfoVersion: '3',
      },
    });
  };
  const handleDisconnect = async () => {
    if (!confirm('¿Desconectar WhatsApp? El bot dejará de responder.')) return;
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({
          phone_number_id: 'DISCONNECTED',
          waba_id: 'DISCONNECTED',
          meta_access_token: 'DISCONNECTED',
        }),
      });
      setConfig({ ...config, phone_number_id: '', waba_id: '', meta_access_token: '' });
      showToast('WhatsApp desconectado');
    } catch {
      showToast('Error desconectando');
    }
  };
  // Activar conversiones de chat (CTWA): autodescubre el dataset de mensajeria
  const handleEnableChatConversions = async () => {
    setEnablingChat(true);
    setChatConvMsg(null);
    try {
      const res = await fetch(`${API_URL}/meta/enable-chat-conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setChatConvMsg({ ok: !!data.ok, text: data.message || (data.ok ? 'Activado' : 'No se pudo activar') });
      if (data.ok && data.dataset_id) {
        setConfig((c: any) => ({ ...c, capi_business_messaging: true, capi_messaging_dataset_id: data.dataset_id }));
      }
    } catch {
      setChatConvMsg({ ok: false, text: 'Error de conexión.' });
    }
    setEnablingChat(false);
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
      {pinState.required && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full">
            <p className="text-4xl mb-4">🔐</p>
            <h3 className="text-xl font-bold text-white mb-2">Ingresa tu PIN de WhatsApp</h3>
            <p className="text-gray-400 text-sm mb-6">
              Meta requiere un PIN de 6 dígitos para registrar este número.<br />
              Encuéntralo en la app de WhatsApp Business → Configuración → Cuenta → PIN de dos pasos.
            </p>
            <input
              type="number"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value.slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl font-mono tracking-[0.5em] bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 mb-4"
            />
            <button
              onClick={handlePinSubmit}
              disabled={submittingPin || pin.length !== 6}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 mb-3"
            >
              {submittingPin ? 'Verificando...' : 'Confirmar PIN'}
            </button>
            <button
              onClick={() => { setPinState({ required: false, phoneNumberId: '' }); setPin(''); }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      )}
      {connecting && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-3xl p-10 text-center max-w-sm">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-2">Conectando WhatsApp...</h3>
            <p className="text-gray-400 text-sm">Completa el proceso en la ventana de Facebook.<br />Esta pantalla se actualizará automáticamente.</p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">Conectar WhatsApp 📱</h1>
      {isConnected ? (
        <div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-400">WhatsApp Conectado</h2>
                <p className="text-sm text-gray-400">Tu bot está activo y respondiendo mensajes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Phone Number ID</p>
                <p className="text-sm text-white font-mono">{config.phone_number_id}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">WABA ID</p>
                <p className="text-sm text-white font-mono">{config.waba_id}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Nombre del negocio</p>
                <p className="text-sm text-white">{config.brand_name || '-'}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Estado del bot</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-sm text-emerald-400 font-bold">Activo</p>
                </div>
              </div>
            </div>
            <button onClick={handleDisconnect}
              className="mt-6 text-xs text-red-400 hover:text-red-300 font-bold">
              Desconectar WhatsApp
            </button>
          </div>
          {/* Conversiones de chat (CTWA) — atribución de ventas por anuncios de WhatsApp */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold">Conversiones de chat</h2>
                  {config?.capi_business_messaging && config?.capi_messaging_dataset_id ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Activas</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-500/15 text-gray-400 px-2 py-0.5 rounded-full">Inactivas</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Atribuye automáticamente las ventas que llegan por anuncios de Click-to-WhatsApp a la campaña que las originó, para que Meta optimice mejor tu inversión. Sin tocar el Administrador de eventos.
                </p>
                {config?.capi_business_messaging && config?.capi_messaging_dataset_id ? (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Conjunto de datos: <span className="font-mono text-gray-300">{config.capi_messaging_dataset_id}</span>
                    </p>
                    <button onClick={handleEnableChatConversions} disabled={enablingChat}
                      className="mt-3 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
                      {enablingChat ? '⏳ Verificando...' : '🔄 Volver a verificar'}
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEnableChatConversions} disabled={enablingChat}
                    className="mt-4 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    {enablingChat ? '⏳ Activando...' : '⚡ Activar conversiones de chat'}
                  </button>
                )}
                {chatConvMsg && (
                  <p className={`mt-3 text-xs font-medium ${chatConvMsg.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {chatConvMsg.ok ? '✓ ' : '⚠️ '}{chatConvMsg.text}
                  </p>
                )}
              </div>
            </div>
          </div>
          <h3 className="font-bold mb-4">Acciones rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/chat" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">💬</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Chat en vivo</h3>
              <p className="text-sm text-gray-500">Ver conversaciones activas</p>
            </Link>
            <Link href="/dashboard/services" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">🛍️</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Catálogo</h3>
              <p className="text-sm text-gray-500">Gestionar servicios del bot</p>
            </Link>
            <Link href="/dashboard/settings" className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
              <p className="text-2xl mb-2">⚙️</p>
              <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Configuración</h3>
              <p className="text-sm text-gray-500">Ajustar personalidad del bot</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center mb-6">
            <p className="text-5xl mb-4">📱</p>
            <h2 className="text-xl font-bold mb-2">Conecta tu WhatsApp Business</h2>
            <p className="text-gray-400 text-sm mb-6">
              Vincula tu línea de WhatsApp Business con un clic. Nosotros nos encargamos de toda la configuración técnica.
            </p>
            <button
              onClick={handleConnect}
              disabled={connecting || !sdkReady}
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg text-lg disabled:opacity-50"
            >
              {connecting ? 'Conectando...' : !sdkReady ? 'Cargando...' : '🔗 Conectar con Facebook'}
            </button>
            <p className="text-[10px] text-gray-600 mt-4">
              Al conectar, autorizas a clientes.bot a gestionar mensajes de tu línea de WhatsApp Business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">1️⃣</p>
              <h3 className="font-bold text-sm mb-1">Inicia sesión</h3>
              <p className="text-xs text-gray-400">Con tu cuenta de Facebook que administra tu WhatsApp Business</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">2️⃣</p>
              <h3 className="font-bold text-sm mb-1">Autoriza</h3>
              <p className="text-xs text-gray-400">Permite que clientes.bot gestione los mensajes de tu línea</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">3️⃣</p>
              <h3 className="font-bold text-sm mb-1">Listo</h3>
              <p className="text-xs text-gray-400">Tu bot se activa automáticamente y empieza a responder</p>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Preguntas Frecuentes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">¿Puedo usar mi mismo número?</p>
                <p className="text-sm text-gray-400">Sí, puedes vincular tu número actual o activar una línea nueva.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">¿Necesito un número nuevo?</p>
                <p className="text-sm text-gray-400">Recomendamos usar una línea dedicada para el bot. Si usas tu número personal, se convertirá en WhatsApp Business API y perderás el acceso desde la app normal de WhatsApp.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">¿Puedo desconectarlo después?</p>
                <p className="text-sm text-gray-400">Sí, puedes desconectar tu WhatsApp en cualquier momento.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}