'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';

// Lambda ERP independiente (facturacion electronica). Definir en .env:
// NEXT_PUBLIC_ERP_API_URL=https://<tu-erp-lambda-url>.lambda-url.us-east-1.on.aws
const ERP_URL = process.env.NEXT_PUBLIC_ERP_API_URL || '';

type Tab = 'facturas' | 'nueva' | 'terceros' | 'config' | 'bulk';

interface Linea {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  precio_iva_incluido: boolean;
  iva: number;
}

const MODOS = [
  { id: 'OFF', label: 'No facturar' },
  { id: 'SOLO_SI_CLIENTE_PIDE', label: 'Solo si el cliente la pide' },
  { id: 'AUTOMATICA_PREGUNTA', label: 'Automatica (preguntar al cliente)' },
  { id: 'AUTOMATICA_SIEMPRE', label: 'Automatica siempre' },
  { id: 'MANUAL_BOTON', label: 'Manual (boton en el CRM)' },
  { id: 'CONSUMIDOR_FINAL', label: 'Siempre a consumidor final' },
];

// Que hace el bot cuando el cliente PIDE factura en el chat.
// Se guarda en facturacion_config.factura_request_action (lo lee el bridge).
const FACTURA_ACTIONS = [
  { id: '', label: 'No intervenir (el bot responde normal)' },
  { id: 'PREGUNTAR', label: 'Pedir el RUT / datos al cliente' },
  { id: 'HUMANO', label: 'Pasar a un asesor humano' },
  { id: 'MANUAL', label: 'Tomar nota en el CRM (gestion manual)' },
];

const TIPO_DOC = [
  { id: '13', label: 'Cedula (CC)' },
  { id: '31', label: 'NIT' },
  { id: '22', label: 'Cedula extranjeria (CE)' },
  { id: '41', label: 'Pasaporte' },
  { id: '12', label: 'Tarjeta identidad (TI)' },
];

export default function FacturacionPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const hj = { ...h, 'Content-Type': 'application/json' };

  const [tab, setTab] = useState<Tab>('facturas');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 4000); };

  // ---- Facturas ----
  const [facturas, setFacturas] = useState<any[]>([]);
  const loadFacturas = () => {
    if (!ERP_URL) { setLoading(false); return; }
    fetch(`${ERP_URL}/erp/facturacion/facturas?limit=100`, { headers: h })
      .then(r => r.json()).then(d => setFacturas(d.facturas || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  // ---- Terceros ----
  const [terceros, setTerceros] = useState<any[]>([]);
  const loadTerceros = () => {
    if (!ERP_URL) return;
    fetch(`${ERP_URL}/erp/facturacion/terceros?limit=200`, { headers: h })
      .then(r => r.json()).then(d => setTerceros(d.terceros || [])).catch(() => {});
  };

  // ---- Config ----
  const [cfg, setCfg] = useState<any>({ modo_facturacion: 'OFF', pedir_rut: true, pt_proveedor: 'stub', ambiente: 'habilitacion', emisor: {}, numeracion: {}, pt_credenciales: {}, factura_iva_pct: 0, factura_iva_modo: 'INCLUIDO', factura_request_action: '', mensaje_pedir_rut: '', mensaje_factura_manual: '' });
  const loadConfig = () => {
    if (!ERP_URL) return;
    fetch(`${ERP_URL}/erp/facturacion/config`, { headers: h })
      .then(r => r.json()).then(d => { if (d && Object.keys(d).length) setCfg({ ...cfg, ...d }); }).catch(() => {});
  };

  useEffect(() => { loadFacturas(); loadTerceros(); loadConfig(); /* eslint-disable-next-line */ }, []);

  // ---- Nueva factura ----
  const [nf, setNf] = useState({
    tipo: 'FEV', consumidor_final: false,
    adquiriente: { tipo_doc: '13', numero_doc: '', dv: '', nombre_razon_social: '', email: '', telefono: '', direccion: '' },
    medio_pago: '10',
  });
  const [lineas, setLineas] = useState<Linea[]>([{ codigo: '', descripcion: '', cantidad: 1, precio_unitario: 0, precio_iva_incluido: true, iva: 19 }]);
  const [emitting, setEmitting] = useState(false);
  const [rutLoading, setRutLoading] = useState(false);

  const addLinea = () => setLineas([...lineas, { codigo: '', descripcion: '', cantidad: 1, precio_unitario: 0, precio_iva_incluido: true, iva: 19 }]);
  const rmLinea = (i: number) => setLineas(lineas.filter((_, idx) => idx !== i));
  const setLn = (i: number, k: keyof Linea, v: any) => setLineas(lineas.map((l, idx) => idx === i ? { ...l, [k]: v } : l));

  const totales = lineas.reduce((acc, l) => {
    const bruto = l.cantidad * l.precio_unitario;
    let base = bruto, iva = 0;
    if (l.iva > 0) {
      if (l.precio_iva_incluido) { base = bruto / (1 + l.iva / 100); iva = bruto - base; }
      else { iva = bruto * l.iva / 100; }
    }
    acc.base += base; acc.iva += iva; acc.total += base + iva;
    return acc;
  }, { base: 0, iva: 0, total: 0 });

  const emitir = async () => {
    if (!ERP_URL) { showToast('Falta configurar NEXT_PUBLIC_ERP_API_URL'); return; }
    setEmitting(true);
    try {
      const payload = {
        tipo: nf.tipo,
        consumidor_final: nf.consumidor_final,
        adquiriente: nf.consumidor_final ? {} : nf.adquiriente,
        lineas: lineas.map(l => ({
          codigo: l.codigo || 'SVC', descripcion: l.descripcion, cantidad: l.cantidad,
          precio_unitario: l.precio_unitario, precio_iva_incluido: l.precio_iva_incluido,
          impuestos: l.iva > 0 ? [{ tipo: 'IVA', tarifa: l.iva }] : [],
        })),
        medio_pago: nf.medio_pago, origen: 'crm_manual',
      };
      const res = await fetch(`${ERP_URL}/erp/facturacion/emitir`, { method: 'POST', headers: hj, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.error) { showToast('Error: ' + d.error); }
      else if (d.duplicada) { showToast('Ya existia una factura para estos datos.'); }
      else { showToast('Factura emitida: ' + (d.factura?.numero || '') + ' · ' + (d.factura?.estado || '')); setTab('facturas'); loadFacturas(); loadTerceros(); }
    } catch (e: any) { showToast('Error de red'); }
    finally { setEmitting(false); }
  };

  const leerRut = async (file: File) => {
    if (!ERP_URL) { showToast('Falta NEXT_PUBLIC_ERP_API_URL'); return; }
    setRutLoading(true);
    try {
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1] || '');
        reader.readAsDataURL(file);
      });
      const res = await fetch(`${ERP_URL}/erp/facturacion/rut`, {
        method: 'POST', headers: hj,
        body: JSON.stringify({ imagen_b64: b64, mime_type: file.type || 'image/jpeg' }),
      });
      const d = await res.json();
      const t = d.tercero || {};
      if (!t.numero_doc) { showToast('No se pudo leer el RUT. Ingresa los datos manualmente.'); return; }
      setNf({ ...nf, consumidor_final: false, adquiriente: {
        tipo_doc: t.tipo_doc || '31', numero_doc: t.numero_doc || '', dv: t.dv || '',
        nombre_razon_social: t.nombre_razon_social || '', email: t.email || '',
        telefono: t.telefono || '', direccion: t.direccion || '',
      }});
      showToast('RUT leido: ' + (t.nombre_razon_social || t.numero_doc));
    } catch { showToast('Error leyendo el RUT'); }
    finally { setRutLoading(false); }
  };

  // ---- Tercero manual ----
  const [nuevoTercero, setNuevoTercero] = useState({ tipo_doc: '13', numero_doc: '', dv: '', nombre_razon_social: '', email: '', telefono: '', direccion: '' });
  const guardarTercero = async () => {
    if (!nuevoTercero.numero_doc) { showToast('Documento requerido'); return; }
    await fetch(`${ERP_URL}/erp/facturacion/terceros`, { method: 'POST', headers: hj, body: JSON.stringify(nuevoTercero) });
    showToast('Cliente guardado'); setNuevoTercero({ tipo_doc: '13', numero_doc: '', dv: '', nombre_razon_social: '', email: '', telefono: '', direccion: '' }); loadTerceros();
  };
  const borrarTercero = async (doc: string) => {
    await fetch(`${ERP_URL}/erp/facturacion/terceros/${encodeURIComponent(doc)}`, { method: 'DELETE', headers: h });
    loadTerceros();
  };
  const anularFactura = async (factura_id: string) => {
    if (!factura_id) { showToast('Factura sin ID'); return; }
    const motivo = window.prompt('Motivo de anulacion (nota credito):', '');
    if (motivo === null) return;
    try {
      const res = await fetch(`${ERP_URL}/erp/facturacion/anular`, { method: 'POST', headers: hj, body: JSON.stringify({ factura_id, motivo }) });
      const d = await res.json();
      if (d.error) showToast('Error: ' + d.error);
      else { showToast('Nota credito emitida'); loadFacturas(); }
    } catch { showToast('Error de red'); }
  };

  // ---- Config guardar ----
  const [savingCfg, setSavingCfg] = useState(false);
  const guardarConfig = async () => {
    setSavingCfg(true);
    try {
      await fetch(`${ERP_URL}/erp/facturacion/config`, { method: 'POST', headers: hj, body: JSON.stringify(cfg) });
      showToast('Configuracion guardada');
    } catch { showToast('Error guardando'); } finally { setSavingCfg(false); }
  };
  const setEmisor = (k: string, v: string) => setCfg({ ...cfg, emisor: { ...(cfg.emisor || {}), [k]: v } });
  const setNum = (k: string, v: any) => setCfg({ ...cfg, numeracion: { ...(cfg.numeracion || {}), [k]: v } });
  const setCred = (k: string, v: string) => setCfg({ ...cfg, pt_credenciales: { ...(cfg.pt_credenciales || {}), [k]: v } });

  // ---- Bulk ----
  const [bulkPreview, setBulkPreview] = useState<any>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const previewBulk = async (file: File) => {
    setBulkFile(file); setBulkBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const res = await fetch(`${ERP_URL}/erp/facturacion/bulk/preview?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/octet-stream' }, body: buf,
      });
      setBulkPreview(await res.json());
    } catch { showToast('Error leyendo el archivo'); } finally { setBulkBusy(false); }
  };
  const emitirBulk = async () => {
    if (!bulkFile) return;
    setBulkBusy(true);
    try {
      const buf = await bulkFile.arrayBuffer();
      const res = await fetch(`${ERP_URL}/erp/facturacion/bulk/emitir?filename=${encodeURIComponent(bulkFile.name)}`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/octet-stream' }, body: buf,
      });
      const d = await res.json();
      showToast(`Emitidas: ${d.emitidas} · Duplicadas: ${d.duplicadas} · Errores: ${(d.errores || []).length}`);
      setBulkPreview(null); setBulkFile(null); loadFacturas();
    } catch { showToast('Error en carga masiva'); } finally { setBulkBusy(false); }
  };

  const badge = (estado: string) => {
    const map: Record<string, string> = {
      APROBADA: 'bg-emerald-500/10 text-emerald-400', ENVIADA: 'bg-blue-500/10 text-blue-400',
      PENDIENTE: 'bg-yellow-500/10 text-yellow-400', RECHAZADA: 'bg-red-500/10 text-red-400',
      ANULADA: 'bg-gray-500/10 text-gray-400', ERROR: 'bg-red-500/10 text-red-400',
    };
    return map[estado] || 'bg-white/5 text-gray-400';
  };
  const cop = (n: number) => '$' + (n || 0).toLocaleString('es-CO');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'facturas', label: 'Facturas' },
    { id: 'nueva', label: 'Nueva factura' },
    { id: 'terceros', label: 'Clientes' },
    { id: 'bulk', label: 'Carga masiva' },
    { id: 'config', label: 'Configuracion' },
  ];

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturacion electronica 🧾</h1>
      </div>

      {!ERP_URL && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-6 text-sm text-yellow-300">
          Configura <code>NEXT_PUBLIC_ERP_API_URL</code> con la URL de la Lambda ERP para activar este modulo.
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== FACTURAS ===== */}
      {tab === 'facturas' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? <div className="text-center py-12 text-gray-500">Cargando...</div> :
            facturas.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-4">🧾</p>
                <h2 className="text-xl font-bold mb-2">Aun no hay facturas</h2>
                <button onClick={() => setTab('nueva')} className="text-indigo-400 text-sm font-bold hover:text-indigo-300">Crear la primera →</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest">
                      <th className="text-left px-5 py-3">Numero</th>
                      <th className="text-left px-3 py-3">Cliente</th>
                      <th className="text-left px-3 py-3 hidden sm:table-cell">Tipo</th>
                      <th className="text-right px-3 py-3">Total</th>
                      <th className="text-center px-3 py-3">Estado</th>
                      <th className="text-left px-5 py-3 hidden md:table-cell">CUFE</th>
                      <th className="text-center px-3 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas.map((f, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-bold">{f.numero || '—'}</td>
                        <td className="px-3 py-3">{f.adquiriente?.nombre_razon_social || 'Consumidor final'}</td>
                        <td className="px-3 py-3 hidden sm:table-cell">{f.tipo}</td>
                        <td className="px-3 py-3 text-right">{cop(f.total)}</td>
                        <td className="px-3 py-3 text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${badge(f.estado)}`}>{f.estado}</span></td>
                        <td className="px-5 py-3 hidden md:table-cell text-[10px] text-gray-500 font-mono">{(f.cufe || '').slice(0, 16)}{f.cufe ? '…' : ''}</td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <a href={`${ERP_URL}/erp/facturacion/representacion?id=${encodeURIComponent(f.factura_id || f.id || '')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 text-xs font-bold mr-3">Ver</a>
                          {f.estado !== 'ANULADA' && (
                            <button onClick={() => anularFactura(f.factura_id || f.id || '')}
                              className="text-red-400 hover:text-red-300 text-xs font-bold">Anular</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}

      {/* ===== NUEVA ===== */}
      {tab === 'nueva' && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="font-bold">Cliente</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-400">
                  <input type="checkbox" checked={nf.consumidor_final} onChange={e => setNf({ ...nf, consumidor_final: e.target.checked })} />
                  Consumidor final
                </label>
                <label className="text-xs font-bold text-indigo-400 cursor-pointer hover:text-indigo-300">
                  {rutLoading ? 'Leyendo RUT…' : '📷 Leer RUT'}
                  <input type="file" accept="image/*,application/pdf" className="hidden" disabled={rutLoading}
                    onChange={e => e.target.files?.[0] && leerRut(e.target.files[0])} />
                </label>
              </div>
            </div>
            {!nf.consumidor_final && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select className={inputCls} value={nf.adquiriente.tipo_doc} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, tipo_doc: e.target.value } })}>
                  {TIPO_DOC.map(t => <option key={t.id} value={t.id} className="bg-gray-900">{t.label}</option>)}
                </select>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="Numero de documento" value={nf.adquiriente.numero_doc} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, numero_doc: e.target.value } })} />
                  <input className={`${inputCls} w-20`} placeholder="DV" value={nf.adquiriente.dv} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, dv: e.target.value } })} />
                </div>
                <input className={inputCls} placeholder="Nombre / Razon social" value={nf.adquiriente.nombre_razon_social} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, nombre_razon_social: e.target.value } })} />
                <input className={inputCls} placeholder="Email" value={nf.adquiriente.email} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, email: e.target.value } })} />
                <input className={inputCls} placeholder="Telefono" value={nf.adquiriente.telefono} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, telefono: e.target.value } })} />
                <input className={inputCls} placeholder="Direccion" value={nf.adquiriente.direccion} onChange={e => setNf({ ...nf, adquiriente: { ...nf.adquiriente, direccion: e.target.value } })} />
              </div>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Items</h3>
              <button onClick={addLinea} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">+ Agregar linea</button>
            </div>
            <div className="space-y-3">
              {lineas.map((l, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className={`${inputCls} col-span-12 md:col-span-4`} placeholder="Descripcion" value={l.descripcion} onChange={e => setLn(i, 'descripcion', e.target.value)} />
                  <input type="number" className={`${inputCls} col-span-3 md:col-span-1`} placeholder="Cant" value={l.cantidad} onChange={e => setLn(i, 'cantidad', parseFloat(e.target.value) || 0)} />
                  <input type="number" className={`${inputCls} col-span-5 md:col-span-2`} placeholder="Precio" value={l.precio_unitario} onChange={e => setLn(i, 'precio_unitario', parseFloat(e.target.value) || 0)} />
                  <select className={`${inputCls} col-span-4 md:col-span-2`} value={l.iva} onChange={e => setLn(i, 'iva', parseFloat(e.target.value))}>
                    <option value={19} className="bg-gray-900">IVA 19%</option>
                    <option value={5} className="bg-gray-900">IVA 5%</option>
                    <option value={0} className="bg-gray-900">Excluido/0%</option>
                  </select>
                  <label className="col-span-6 md:col-span-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <input type="checkbox" checked={l.precio_iva_incluido} onChange={e => setLn(i, 'precio_iva_incluido', e.target.checked)} />
                    IVA incluido
                  </label>
                  <button onClick={() => rmLinea(i)} className="col-span-2 md:col-span-1 text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-6 text-sm">
              <span className="text-gray-400">Base: <b className="text-white">{cop(Math.round(totales.base))}</b></span>
              <span className="text-gray-400">IVA: <b className="text-white">{cop(Math.round(totales.iva))}</b></span>
              <span className="text-gray-400">Total: <b className="text-emerald-400">{cop(Math.round(totales.total))}</b></span>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={emitir} disabled={emitting || !ERP_URL}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold text-sm">
              {emitting ? 'Emitiendo…' : 'Emitir factura'}
            </button>
          </div>
        </div>
      )}

      {/* ===== TERCEROS ===== */}
      {tab === 'terceros' && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Nuevo cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className={inputCls} value={nuevoTercero.tipo_doc} onChange={e => setNuevoTercero({ ...nuevoTercero, tipo_doc: e.target.value })}>
                {TIPO_DOC.map(t => <option key={t.id} value={t.id} className="bg-gray-900">{t.label}</option>)}
              </select>
              <input className={inputCls} placeholder="Documento" value={nuevoTercero.numero_doc} onChange={e => setNuevoTercero({ ...nuevoTercero, numero_doc: e.target.value })} />
              <input className={inputCls} placeholder="Nombre / Razon social" value={nuevoTercero.nombre_razon_social} onChange={e => setNuevoTercero({ ...nuevoTercero, nombre_razon_social: e.target.value })} />
              <input className={inputCls} placeholder="Email" value={nuevoTercero.email} onChange={e => setNuevoTercero({ ...nuevoTercero, email: e.target.value })} />
              <input className={inputCls} placeholder="Telefono" value={nuevoTercero.telefono} onChange={e => setNuevoTercero({ ...nuevoTercero, telefono: e.target.value })} />
              <input className={inputCls} placeholder="Direccion" value={nuevoTercero.direccion} onChange={e => setNuevoTercero({ ...nuevoTercero, direccion: e.target.value })} />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={guardarTercero} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-bold">Guardar cliente</button>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            {terceros.length === 0 ? <div className="p-8 text-center text-gray-500 text-sm">Sin clientes aun.</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest">
                    <th className="text-left px-5 py-3">Documento</th><th className="text-left px-3 py-3">Nombre</th>
                    <th className="text-left px-3 py-3 hidden sm:table-cell">Email</th><th className="text-left px-3 py-3 hidden md:table-cell">Origen</th><th className="px-5 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {terceros.map((t, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-bold">{t.numero_doc}</td>
                        <td className="px-3 py-3">{t.nombre_razon_social}</td>
                        <td className="px-3 py-3 hidden sm:table-cell text-gray-400">{t.email}</td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400">{t.fuente}</span></td>
                        <td className="px-5 py-3 text-right"><button onClick={() => borrarTercero(t.numero_doc)} className="text-red-400 text-xs">Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== BULK ===== */}
      {tab === 'bulk' && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-2">Carga masiva (Excel / CSV)</h3>
            <p className="text-xs text-gray-400 mb-4">Columnas: documento, nombre, email, descripcion, cantidad, precio, iva, iva_incluido. Re-subir el mismo archivo NO duplica facturas.</p>
            <label className="inline-block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-bold cursor-pointer">
              {bulkBusy ? 'Procesando…' : 'Seleccionar archivo'}
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" disabled={bulkBusy}
                onChange={e => e.target.files?.[0] && previewBulk(e.target.files[0])} />
            </label>
          </div>
          {bulkPreview && (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
              <div className="flex gap-6 text-sm mb-4">
                <span className="text-gray-400">Filas: <b className="text-white">{bulkPreview.total}</b></span>
                <span className="text-gray-400">Validas: <b className="text-emerald-400">{(bulkPreview.ok || []).length}</b></span>
                <span className="text-gray-400">Errores: <b className="text-red-400">{(bulkPreview.errores || []).length}</b></span>
              </div>
              {(bulkPreview.errores || []).length > 0 && (
                <div className="mb-4 max-h-40 overflow-y-auto text-xs text-red-400 space-y-1">
                  {bulkPreview.errores.map((e: any, i: number) => <div key={i}>Fila {e.fila}: {e.error}</div>)}
                </div>
              )}
              <button onClick={emitirBulk} disabled={bulkBusy || (bulkPreview.ok || []).length === 0}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-bold text-sm">
                Emitir {(bulkPreview.ok || []).length} facturas
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== CONFIG ===== */}
      {tab === 'config' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Modo de facturacion</h3>
            <select className={inputCls} value={cfg.modo_facturacion} onChange={e => setCfg({ ...cfg, modo_facturacion: e.target.value })}>
              {MODOS.map(m => <option key={m.id} value={m.id} className="bg-gray-900">{m.label}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-400 mt-4">
              <input type="checkbox" checked={!!cfg.pedir_rut} onChange={e => setCfg({ ...cfg, pedir_rut: e.target.checked })} />
              Pedir el RUT por WhatsApp (lectura automatica con IA)
            </label>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-1">IVA por defecto (facturacion automatica)</h3>
            <p className="text-xs text-gray-500 mb-4">Se aplica cuando el bot factura solo (sin lineas manuales). En emision manual el IVA se elige por linea.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className={inputCls} value={cfg.factura_iva_pct ?? 0} onChange={e => setCfg({ ...cfg, factura_iva_pct: parseFloat(e.target.value) })}>
                <option value={0} className="bg-gray-900">0% (exento / excluido)</option>
                <option value={5} className="bg-gray-900">5%</option>
                <option value={19} className="bg-gray-900">19%</option>
              </select>
              <select className={inputCls} value={cfg.factura_iva_modo || 'INCLUIDO'} onChange={e => setCfg({ ...cfg, factura_iva_modo: e.target.value })}>
                <option value="INCLUIDO" className="bg-gray-900">IVA incluido en el precio</option>
                <option value="ADICIONAL" className="bg-gray-900">IVA adicional (se suma al precio)</option>
              </select>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-1">Cuando el cliente pide factura en el chat</h3>
            <p className="text-xs text-gray-500 mb-4">Elige que debe hacer el bot al detectar que un cliente solicita factura.</p>
            <select className={inputCls} value={cfg.factura_request_action || ''} onChange={e => setCfg({ ...cfg, factura_request_action: e.target.value })}>
              {FACTURA_ACTIONS.map(a => <option key={a.id || 'none'} value={a.id} className="bg-gray-900">{a.label}</option>)}
            </select>
            {cfg.factura_request_action === 'PREGUNTAR' && (
              <textarea className={`${inputCls} mt-3`} rows={2}
                placeholder="Mensaje al pedir el RUT (opcional). Ej: Con gusto te facturamos, enviame tu RUT o numero de documento y nombre completo."
                value={cfg.mensaje_pedir_rut || ''} onChange={e => setCfg({ ...cfg, mensaje_pedir_rut: e.target.value })} />
            )}
            {cfg.factura_request_action === 'MANUAL' && (
              <textarea className={`${inputCls} mt-3`} rows={2}
                placeholder="Mensaje de gestion manual (opcional). Ej: Tomamos nota de tu solicitud de factura, nuestro equipo la gestionara."
                value={cfg.mensaje_factura_manual || ''} onChange={e => setCfg({ ...cfg, mensaje_factura_manual: e.target.value })} />
            )}
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Datos del emisor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="NIT" value={cfg.emisor?.nit || ''} onChange={e => setEmisor('nit', e.target.value)} />
              <input className={inputCls} placeholder="DV" value={cfg.emisor?.dv || ''} onChange={e => setEmisor('dv', e.target.value)} />
              <input className={inputCls} placeholder="Razon social" value={cfg.emisor?.razon_social || ''} onChange={e => setEmisor('razon_social', e.target.value)} />
              <input className={inputCls} placeholder="Email" value={cfg.emisor?.email || ''} onChange={e => setEmisor('email', e.target.value)} />
              <input className={inputCls} placeholder="Direccion" value={cfg.emisor?.direccion || ''} onChange={e => setEmisor('direccion', e.target.value)} />
              <input className={inputCls} placeholder="Codigo DANE municipio" value={cfg.emisor?.municipio_dane || ''} onChange={e => setEmisor('municipio_dane', e.target.value)} />
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Resolucion y numeracion DIAN</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Prefijo (ej. FE)" value={cfg.numeracion?.prefijo || ''} onChange={e => setNum('prefijo', e.target.value)} />
              <input className={inputCls} placeholder="Numero de resolucion" value={cfg.numeracion?.resolucion_numero || ''} onChange={e => setNum('resolucion_numero', e.target.value)} />
              <input className={inputCls} placeholder="Clave tecnica" value={cfg.numeracion?.clave_tecnica || ''} onChange={e => setNum('clave_tecnica', e.target.value)} />
              <div className="flex gap-2">
                <input type="number" className={inputCls} placeholder="Rango desde" value={cfg.numeracion?.rango_desde || ''} onChange={e => setNum('rango_desde', parseInt(e.target.value) || 0)} />
                <input type="number" className={inputCls} placeholder="Rango hasta" value={cfg.numeracion?.rango_hasta || ''} onChange={e => setNum('rango_hasta', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Proveedor tecnologico (PT)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className={inputCls} value={cfg.pt_proveedor} onChange={e => setCfg({ ...cfg, pt_proveedor: e.target.value })}>
                <option value="stub" className="bg-gray-900">Pruebas (stub)</option>
                <option value="factus" className="bg-gray-900">Factus</option>
                <option value="dataico" className="bg-gray-900">Dataico</option>
                <option value="hka" className="bg-gray-900">The Factory HKA</option>
                <option value="alegra" className="bg-gray-900">Alegra</option>
              </select>
              <select className={inputCls} value={cfg.ambiente} onChange={e => setCfg({ ...cfg, ambiente: e.target.value })}>
                <option value="habilitacion" className="bg-gray-900">Habilitacion (pruebas)</option>
                <option value="produccion" className="bg-gray-900">Produccion</option>
              </select>
            </div>
            {cfg.pt_proveedor && cfg.pt_proveedor !== 'stub' && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-3">Credenciales del proveedor (te las entrega el PT al contratar). Se guardan cifradas.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Client ID" value={cfg.pt_credenciales?.client_id || ''} onChange={e => setCred('client_id', e.target.value)} />
                  <input className={inputCls} type="password" placeholder="Client Secret" value={cfg.pt_credenciales?.client_secret || ''} onChange={e => setCred('client_secret', e.target.value)} />
                  <input className={inputCls} placeholder="Usuario / Email API" value={cfg.pt_credenciales?.username || ''} onChange={e => setCred('username', e.target.value)} />
                  <input className={inputCls} type="password" placeholder="Contrasena / API Key" value={cfg.pt_credenciales?.password || ''} onChange={e => setCred('password', e.target.value)} />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={guardarConfig} disabled={savingCfg} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold text-sm">
              {savingCfg ? 'Guardando…' : 'Guardar configuracion'}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 border border-white/10 rounded-xl px-5 py-3 text-sm shadow-2xl z-50">{toast}</div>
      )}
    </div>
  );
}
