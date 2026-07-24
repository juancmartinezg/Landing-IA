// ============================================================================
// Componente: WhatsAppNumbersCard — selector de modo por número (bot / asesor)
// ----------------------------------------------------------------------------
// CÓMO USARLO (2 pasos, dentro de tu página de Integraciones):
//
//   1) Crea este archivo:  app/dashboard/whatsapp/WhatsAppNumbersCard.tsx
//      (pega TODO este contenido)
//
//   2) En app/dashboard/whatsapp/page.tsx:
//      a) arriba, junto a los otros imports, agrega:
//           import WhatsAppNumbersCard from './WhatsAppNumbersCard';
//      b) DENTRO del bloque `anyConnected ? (...)`, justo DESPUÉS de la tarjeta
//         "Conversiones de chat" (el </div> que cierra esa tarjeta, ~línea 381)
//         y ANTES de `<h3 className="font-bold mb-4">Acciones rápidas</h3>`,
//         inserta esta única línea:
//           <WhatsAppNumbersCard companyId={user?.companyId || ''} />
//
// No crea ruta nueva; es una sección más de la misma página. Usa los endpoints
// /whatsapp/numbers del backend (PR #11, ya desplegado).
// ============================================================================

'use client';
import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type WaMode = 'bot' | 'asesor';
interface WaNumber {
  phone_number_id: string;
  display_phone: string;
  wa_mode: WaMode;
  is_primary: boolean;
}

export default function WhatsAppNumbersCard({ companyId }: { companyId: string }) {
  const [numbers, setNumbers] = useState<WaNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const headers = { 'Content-Type': 'application/json', 'client-id': companyId };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/whatsapp/numbers`, { headers: { 'client-id': companyId } });
      const data = await res.json();
      setNumbers(data.numbers || []);
    } catch {
      setMsg({ ok: false, text: 'No se pudieron cargar los números.' });
    }
    setLoading(false);
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const setMode = async (phone_number_id: string, wa_mode: WaMode) => {
    setSavingId(phone_number_id);
    setMsg(null);
    setNumbers(prev => prev.map(n => n.phone_number_id === phone_number_id ? { ...n, wa_mode } : n));
    try {
      const res = await fetch(`${API_URL}/whatsapp/numbers`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ phone_number_id, wa_mode }),
      });
      if (!res.ok) throw new Error();
      setMsg({ ok: true, text: 'Modo actualizado.' });
    } catch {
      setMsg({ ok: false, text: 'No se pudo cambiar el modo. Reintenta.' });
      load();
    }
    setSavingId('');
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-500/15 rounded-full flex items-center justify-center shrink-0">
          <span className="text-2xl">📞</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg font-bold">Números de WhatsApp</h2>
            <button onClick={load} className="text-xs text-gray-400 hover:text-gray-200">Actualizar</button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Elige cómo se atiende cada número. En modo <b>Asesor</b> el bot no responde:
            la conversación pasa a una persona en tu panel, pero se sigue capturando de qué
            anuncio/campaña vino (mejor atribución en Meta).
          </p>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">Cargando…</p>
          ) : numbers.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No hay números conectados todavía.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {numbers.map(n => (
                <li key={n.phone_number_id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">
                      {n.display_phone || n.phone_number_id}
                      {n.is_primary && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">Principal</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">ID: {n.phone_number_id}</div>
                  </div>
                  <select
                    value={n.wa_mode}
                    disabled={savingId === n.phone_number_id}
                    onChange={e => setMode(n.phone_number_id, e.target.value as WaMode)}
                    className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                  >
                    <option value="bot">🤖 Contesta el bot</option>
                    <option value="asesor">🧑‍💼 Pasa a asesor</option>
                  </select>
                </li>
              ))}
            </ul>
          )}

          {msg && (
            <p className={`mt-3 text-xs font-medium ${msg.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
              {msg.ok ? '✓ ' : '⚠️ '}{msg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
