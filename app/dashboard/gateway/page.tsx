'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function GatewayPage() {
  const { user } = useAuth();
  const [gateway, setGateway] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [keys, setKeys] = useState<any>({});
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const loadGateway = () => {
    fetch(`${API_URL}/gateway`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setGateway(data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { loadGateway(); }, []);
  const keyFields: any = {
    bold: [
      { key: 'bold_identity_key', label: 'Identity Key' },
      { key: 'bold_secret_key', label: 'Secret Key' },
    ],
    wompi: [
      { key: 'wompi_private_key', label: 'Llave Privada' },
      { key: 'wompi_public_key', label: 'Llave Publica' },
      { key: 'wompi_events_key', label: 'Llave de Eventos' },
    ],
    openpay: [
      { key: 'merchant_id', label: 'Merchant ID' },
      { key: 'private_key', label: 'Llave Privada' },
    ],
    mercadopago: [
      { key: 'mercadopago_access_token', label: 'Access Token' },
      { key: 'mercadopago_public_key', label: 'Public Key' },
    ],
   ppaypal: [
      { key: 'paypal_client_id', label: 'Client ID' },
      { key: 'paypal_client_secret', label: 'Client Secret' },
    ],
    payu: [
      { key: 'payu_api_key', label: 'API Key' },
      { key: 'payu_merchant_id', label: 'Merchant ID' },
      { key: 'payu_account_id', label: 'Account ID' },
    ],
  };
  const handleSaveKeys = async (gwId: string) => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/gateway`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ gateway_name: gwId, gateway_keys: keys, set_as: '' }),
      });
      showToast('✓ Llaves guardadas');
      setConfiguring(null);
      setKeys({});
      loadGateway();
    } catch (err) { showToast('Error guardando'); }
    setSaving(false);
  };
  const handleSetAs = async (gwId: string, role: string) => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/gateway`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ gateway_name: gwId, set_as: role }),
      });
      showToast(`✓ ${gwId} como ${role}`);
      loadGateway();
    } catch (err) { showToast('Error'); }
    setSaving(false);
  };
  const handleActivate = async (gwId: string) => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/gateway`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({ gateway_name: gwId, gateway_keys: keys }),
      });
      setGateway({ ...gateway, gateway_name: gwId, gateway_active: true });
      setConfiguring(null);
      setKeys({});
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pasarela de Pagos 🏦</h1>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>
      )}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Principal</p>
            <p className="text-lg text-indigo-400 font-bold capitalize">{gateway?.gateway_name || 'No configurada'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Respaldo</p>
            <p className="text-lg text-yellow-400 font-bold capitalize">{gateway?.gateway_fallback || 'No configurada'}</p>
          </div>
        </div>
      </div>
      <h3 className="font-bold mb-4">Pasarelas Disponibles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(gateway?.available_gateways || []).map((gw: any, i: number) => (
          <div key={i} className={`bg-white/[0.03] border rounded-2xl p-6 transition-all ${
            gateway?.gateway_name === gw.id ? 'border-indigo-500' : 'border-white/5 hover:border-indigo-500/30'
          }`}>
            <h3 className="font-bold mb-1">{gw.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{gw.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {gw.countries.map((c: string) => (
                <span key={c} className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-gray-400">{c}</span>
              ))}
            </div>
            {configuring === gw.id ? (
              <div className="space-y-3">
                {(keyFields[gw.id] || []).map((field: any) => (
                  <div key={field.key}>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{field.label}</label>
                    <input
                      type="password"
                      value={keys[field.key] || ''}
                      onChange={(e) => setKeys({...keys, [field.key]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                      placeholder="Pega tu llave aqui..."
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={() => { setConfiguring(null); setKeys({}); }}
                    className="flex-1 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                    Cancelar
                  </button>
                  <button onClick={() => handleSaveKeys(gw.id)} disabled={saving}
                    className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar llaves'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => setConfiguring(gw.id)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 transition-all">
                  🔑 {gateway?.gateway_keys?.[((keyFields[gw.id] || [])[0] || {}).key] ? 'Modificar llaves' : 'Configurar llaves'}
                </button>
                {gateway?.gateway_keys?.[((keyFields[gw.id] || [])[0] || {}).key] && gateway?.gateway_name !== gw.id && (
                  <button onClick={() => handleSetAs(gw.id, 'principal')} disabled={saving}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
                    ⭐ Usar como principal
                  </button>
                )}
                {gateway?.gateway_keys?.[((keyFields[gw.id] || [])[0] || {}).key] && gateway?.gateway_fallback !== gw.id && gateway?.gateway_name !== gw.id && (
                  <button onClick={() => handleSetAs(gw.id, 'fallback')} disabled={saving}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all">
                    🔄 Usar como respaldo
                  </button>
                )}
                {gateway?.gateway_name === gw.id && <p className="text-xs text-indigo-400 font-bold text-center">⭐ Principal</p>}
                {gateway?.gateway_fallback === gw.id && <p className="text-xs text-yellow-400 font-bold text-center">🔄 Respaldo</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Tu pasarela de pagos no esta listada?</p>
        <p className="text-indigo-400 text-sm font-bold">Contactanos para solicitar una integracion personalizada</p>
      </div>
    </div>
  );
}