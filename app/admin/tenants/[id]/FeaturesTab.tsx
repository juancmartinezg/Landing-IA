'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface FeatureOverride {
  enabled: boolean;
  expires_at: number;
  reason: string;
  set_by: string;
  set_at: number;
}
interface Feature {
  key: string;
  label: string;
  category: string;
  description: string;
  plans: string[];
  in_plan: boolean;
  effective: boolean;
  source: 'plan' | 'override_grant' | 'override_revoke' | 'expired' | 'not_in_plan';
  override: FeatureOverride | null;
}
interface Props {
  tenantId: string;
}
type Action = 'force_on' | 'force_off' | 'remove';
const SOURCE_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  plan: { text: 'Por plan', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  override_grant: { text: 'Forzado ON', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  override_revoke: { text: 'Forzado OFF', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  expired: { text: 'Override venció', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  not_in_plan: { text: 'Fuera del plan', color: 'text-gray-500', bg: 'bg-gray-500/10' },
};
export default function FeaturesTab({ tenantId }: Props) {
  const { user } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [plan, setPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Modal de confirmación
  const [modalFeature, setModalFeature] = useState<Feature | null>(null);
  const [modalAction, setModalAction] = useState<Action>('force_on');
  const [modalReason, setModalReason] = useState('');
  const [modalTotp, setModalTotp] = useState('');
  const [modalExpiresDays, setModalExpiresDays] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const headers = (): HeadersInit => ({
    'client-id': user?.sub || user?.email || '',
    'x-user-email': user?.email || '',
  });
  const fetchFeatures = async () => {
    if (!user?.email || !tenantId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}/features`,
        { headers: headers() }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setError(e.error || `Error ${res.status}`);
      } else {
        const json = await res.json();
        setFeatures(json.features || []);
        setPlan(json.plan || '');
      }
    } catch (e: any) {
      setError(e.message || 'Error de conexión');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, user?.email]);
  // Determina qué acción ofrece el botón según estado actual
  const getNextAction = (f: Feature): Action => {
    if (f.source === 'plan') return 'force_off';
    if (f.source === 'not_in_plan') return 'force_on';
    return 'remove'; // override_grant / override_revoke / expired
  };
  const openModal = (f: Feature, action: Action) => {
    setModalFeature(f);
    setModalAction(action);
    setModalReason('');
    setModalTotp('');
    setModalExpiresDays(0);
    setModalError('');
  };
  const closeModal = () => {
    setModalFeature(null);
    setModalReason('');
    setModalTotp('');
    setModalError('');
  };
  const submitModal = async () => {
    if (!modalFeature) return;
    if (!modalReason.trim()) {
      setModalError('La razón es obligatoria');
      return;
    }
    if (!/^\d{6}$/.test(modalTotp)) {
      setModalError('Código 2FA debe ser 6 dígitos');
      return;
    }
    setSubmitting(true);
    setModalError('');
    try {
      let res: Response;
      if (modalAction === 'remove') {
        // DELETE con query params (el backend espera ?key=X)
        const qs = new URLSearchParams({
          key: modalFeature.key,
          reason: modalReason.trim(),
          totp_code: modalTotp,
        });
        res = await fetch(
          `${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}/features?${qs}`,
          { method: 'DELETE', headers: headers() }
        );
      } else {
        // PUT (force_on / force_off)
        const expires_at =
          modalExpiresDays > 0
            ? Math.floor(Date.now() / 1000) + modalExpiresDays * 86400
            : 0;
        const body = {
          feature_key: modalFeature.key,
          enabled: modalAction === 'force_on',
          expires_at,
          reason: modalReason.trim(),
          totp_code: modalTotp,
        };
        res = await fetch(
          `${API_URL}/admin/tenants/${encodeURIComponent(tenantId)}/features`,
          {
            method: 'PUT',
            headers: { ...headers(), 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setModalError(json.error || `Error ${res.status}`);
        setSubmitting(false);
        return;
      }
      closeModal();
      await fetchFeatures(); // refresca lista
    } catch (e: any) {
      setModalError(e.message || 'Error de conexión');
    }
    setSubmitting(false);
  };
  // Agrupar por categoría
  const grouped = features.reduce<Record<string, Feature[]>>((acc, f) => {
    const cat = f.category || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});
  if (loading) {
    return <div className="text-gray-400 text-sm py-8">Cargando features...</div>;
  }
  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-300 text-sm">
        {error}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-lg font-bold">Features del tenant</h3>
          <p className="text-gray-500 text-xs mt-1">
            Plan actual: <span className="text-indigo-400 font-bold uppercase">{plan}</span> · {features.length} features en catálogo
          </p>
        </div>
        <button
          onClick={fetchFeatures}
          className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5"
        >
          🔄 Refrescar
        </button>
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="space-y-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{cat}</h4>
          <div className="space-y-2">
            {items.map((f) => {
              const meta = SOURCE_LABEL[f.source] || SOURCE_LABEL.plan;
              const expiresAt = f.override?.expires_at || 0;
              const expiresStr =
                expiresAt > 0
                  ? new Date(expiresAt * 1000).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';
              const nextAction = getNextAction(f);
              const isOn = f.effective;
              return (
                <div
                  key={f.key}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-semibold text-sm">{f.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} font-bold`}>
                        {meta.text}
                      </span>
                      {expiresStr && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                          Vence {expiresStr}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{f.description}</p>
                    {f.override?.reason && (
                      <p className="text-gray-600 text-[11px] mt-1 italic">
                        💬 {f.override.reason} — <span className="text-gray-700">{f.override.set_by}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Estado visual: ON/OFF + acciones */}
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${isOn ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {isOn ? 'ON' : 'OFF'}
                    </div>
                    {nextAction === 'force_on' && (
                      <button
                        onClick={() => openModal(f, 'force_on')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold"
                        title="Forzar activación (override)"
                      >
                        Activar
                      </button>
                    )}
                    {nextAction === 'force_off' && (
                      <button
                        onClick={() => openModal(f, 'force_off')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-semibold"
                        title="Forzar desactivación (override)"
                      >
                        Desactivar
                      </button>
                    )}
                    {nextAction === 'remove' && (
                      <button
                        onClick={() => openModal(f, 'remove')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 font-semibold"
                        title="Quitar override y volver al plan"
                      >
                        Quitar override
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* ===== MODAL CONFIRMACIÓN + 2FA ===== */}
      {modalFeature && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && !submitting && closeModal()}
        >
          <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-white text-lg font-bold mb-1">
              {modalAction === 'force_on' && '✅ Activar feature'}
              {modalAction === 'force_off' && '🚫 Desactivar feature'}
              {modalAction === 'remove' && '🔄 Quitar override'}
            </h3>
            <p className="text-gray-500 text-xs mb-4">
              <span className="text-gray-300 font-semibold">{modalFeature.label}</span> en{' '}
              <span className="text-indigo-400 font-bold">{tenantId}</span>
            </p>
            {modalAction === 'remove' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 text-xs text-amber-300">
                La feature volverá al estado natural del plan{' '}
                <span className="font-bold">{plan}</span>.
              </div>
            )}
            {/* Razón */}
            <label className="block text-xs text-gray-400 font-semibold mb-1">
              Razón del cambio <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={modalReason}
              onChange={(e) => setModalReason(e.target.value)}
              placeholder="Ej: Cliente VIP, regalo Q2 2026"
              maxLength={500}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 mb-3"
              disabled={submitting}
            />
            <p className="text-[10px] text-gray-600 -mt-2 mb-3">
              {modalReason.length}/500 caracteres
            </p>
            {/* Expiración (solo para force_on / force_off) */}
            {modalAction !== 'remove' && (
              <>
                <label className="block text-xs text-gray-400 font-semibold mb-1">
                  Expiración (opcional)
                </label>
                <select
                  value={modalExpiresDays}
                  onChange={(e) => setModalExpiresDays(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 mb-3"
                  disabled={submitting}
                >
                  <option value={0}>Sin expiración (permanente)</option>
                  <option value={7}>7 días</option>
                  <option value={14}>14 días</option>
                  <option value={30}>30 días</option>
                  <option value={60}>60 días</option>
                  <option value={90}>90 días</option>
                </select>
              </>
            )}
            {/* TOTP */}
            <label className="block text-xs text-gray-400 font-semibold mb-1">
              Código 2FA (TOTP) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={modalTotp}
              onChange={(e) => setModalTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:border-indigo-500 mb-1"
              disabled={submitting}
            />
            <p className="text-[10px] text-gray-600 mb-4">
              Abre tu app de autenticación (Google Authenticator, 1Password, etc.) y pega el código actual.
            </p>
            {modalError && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 mb-3 text-xs text-rose-300">
                {modalError}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="text-xs px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitModal}
                disabled={submitting || !modalReason.trim() || modalTotp.length !== 6}
                className="text-xs px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Aplicando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}