'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function SettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    brand_name: '',
    business_item_name: '',
    currency: '',
    btn_book: '',
    brand_logo_url: '',
  });
  useEffect(() => {
    fetch(`${API_URL}/config`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setForm({
          brand_name: data.brand_name || '',
          business_item_name: data.business_item_name || data.item_type || '',
          currency: data.currency || 'COP',
          btn_book: data.btn_book || '',
          brand_logo_url: data.brand_logo_url || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
        body: JSON.stringify(form),
      });
      setConfig({ ...config, ...form });
      setEditing(false);
    } catch (err) {
      console.error('Error guardando:', err);
    }
    setSaving(false);
  };
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuracion ⚙️</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="border border-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/5">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Datos del Negocio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre del negocio</label>
              {editing ? (
                <input value={form.brand_name} onChange={(e) => setForm({...form, brand_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <p className="text-white font-medium">{config?.brand_name || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Tipo de item (producto, servicio, curso...)</label>
              {editing ? (
                <input value={form.business_item_name} onChange={(e) => setForm({...form, business_item_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <p className="text-white font-medium">{config?.business_item_name || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Moneda</label>
              {editing ? (
                <select value={form.currency} onChange={(e) => setForm({...form, currency: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white">
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="USD">USD - Dolar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                  <option value="BRL">BRL - Real Brasileno</option>
                </select>
              ) : (
                <p className="text-white font-medium">{config?.currency || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Texto del boton de reserva</label>
              {editing ? (
                <input value={form.btn_book} onChange={(e) => setForm({...form, btn_book: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <p className="text-white font-medium">{config?.btn_book || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">URL del logo</label>
              {editing ? (
                <input value={form.brand_logo_url} onChange={(e) => setForm({...form, brand_logo_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
              ) : (
                <div className="flex items-center gap-3">
                  {config?.brand_logo_url && <img src={config.brand_logo_url} className="w-10 h-10 rounded-lg object-contain bg-white/5" />}
                  <p className="text-white font-medium text-sm truncate">{config?.brand_logo_url || '-'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Horarios</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Zona horaria</label>
              <p className="text-white font-medium">{config?.scheduling?.timezone || '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Horario de atencion</label>
              <p className="text-white font-medium">{config?.scheduling?.business_hours?.start || '8'}:00 - {config?.scheduling?.business_hours?.end || '18'}:00</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Dias cerrados</label>
              <p className="text-white font-medium">
                {(config?.scheduling?.closed_days || []).map((d: number) => {
                  const days: any = {0:'Lun', 1:'Mar', 2:'Mie', 3:'Jue', 4:'Vie', 5:'Sab', 6:'Dom'};
                  return days[d];
                }).join(', ') || 'Ninguno'}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Festivos configurados</label>
              <p className="text-white font-medium">{(config?.scheduling?.holidays || []).length} dias</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Pasarela de Pagos</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Pasarela activa</label>
              <p className="text-white font-medium capitalize">{config?.gateway_name || 'No configurada'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Estado</label>
              <p className={`font-medium ${config?.gateway_active ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {config?.gateway_active ? '✓ Activa' : '⚠ Configurar'}
              </p>
            </div>
            <a href="/dashboard/gateway" className="inline-block text-sm text-indigo-400 hover:text-indigo-300 font-bold">
              Configurar pasarela →
            </a>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Prompt del Bot</h3>
          <div className="max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-400 whitespace-pre-wrap">{config?.prompt?.substring(0, 800) || 'Sin prompt configurado'}{config?.prompt?.length > 800 ? '...' : ''}</p>
          </div>
          <a href="/dashboard/templates" className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-bold">
            Cambiar plantilla →
          </a>
        </div>
      </div>
    </div>
  );
}