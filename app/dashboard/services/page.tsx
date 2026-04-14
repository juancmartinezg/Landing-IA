'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const emptyForm = {
  name: '', description: '', category: 'servicio',
  regular_price: '', deposit_required: '', currency: 'COP',
  image_url: '', duration_hours: '1', service_type: 'personalizado',
};
export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  const loadServices = () => {
    setLoading(true);
    fetch(`${API_URL}/services`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setServices(data.services || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { loadServices(); }, []);
  const openNew = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (svc: any) => {
    setEditingSlug(svc.slug);
    setForm({
      name: svc.name || '',
      description: svc.description || '',
      category: svc.category || 'servicio',
      regular_price: String(svc.pricing?.regular_price || ''),
      deposit_required: String(svc.pricing?.deposit_required || ''),
      currency: svc.pricing?.currency || 'COP',
      image_url: svc.image_url || '',
      duration_hours: String(svc.scheduling?.duration_hours || '1'),
      service_type: svc.scheduling?.service_type || 'personalizado',
    });
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingSlug(null);
    setForm(emptyForm);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        image_url: form.image_url,
        pricing: {
          regular_price: parseInt(form.regular_price) || 0,
          deposit_required: parseInt(form.deposit_required) || 0,
          currency: form.currency,
          deposit_type: 'percentage',
          deposit_percentage: 50,
        },
        scheduling: {
          service_type: form.service_type,
          duration_hours: parseInt(form.duration_hours) || 1,
          group_booking: false,
          scheduling_mode: 'calendar',
        },
      };
      if (editingSlug) {
        await fetch(`${API_URL}/services`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
          body: JSON.stringify({ slug: editingSlug, ...payload }),
        });
        showToast('✓ Servicio actualizado');
      } else {
        await fetch(`${API_URL}/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
          body: JSON.stringify(payload),
        });
        showToast('✓ Servicio creado');
      }
      closeForm();
      loadServices();
    } catch (err) {
      showToast('Error guardando servicio');
    }
    setSaving(false);
  };
  const handleDelete = async (slug: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      const res = await fetch(`${API_URL}/services?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { 'client-id': user?.companyId || '' },
      });
      if (res.ok) {
        showToast('✓ Servicio eliminado');
        setServices(prev => prev.filter(s => s.slug !== slug));
      } else {
        showToast('Error eliminando servicio');
      }
    } catch {
      showToast('Error de conexión');
    }
  };
  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Servicios 🛍️</h1>
        <button onClick={showForm ? closeForm : openNew} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          {showForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>
      {showForm && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4">{editingSlug ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="Ej: Corte de cabello" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Categoria</label>
              <input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="Ej: servicio, curso, producto" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Descripcion</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none"
                placeholder="Describe tu servicio..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Precio</label>
              <input type="number" value={form.regular_price} onChange={(e) => setForm({...form, regular_price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="50000" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Anticipo requerido</label>
              <input type="number" value={form.deposit_required} onChange={(e) => setForm({...form, deposit_required: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="25000" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Duracion (horas)</label>
              <input type="number" value={form.duration_hours} onChange={(e) => setForm({...form, duration_hours: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Tipo</label>
              <select value={form.service_type} onChange={(e) => setForm({...form, service_type: e.target.value})}
                className="bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white w-full">
                <option value="personalizado" className="bg-[#1a1f2e] text-white">Personalizado</option>
                <option value="regular" className="bg-[#1a1f2e] text-white">Regular / Grupal</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">URL de imagen</label>
              <input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={closeForm}
              className="px-6 py-3 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving || !form.name}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Guardando...' : editingSlug ? 'Actualizar servicio' : 'Guardar servicio'}
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : services.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🛍️</p>
          <h2 className="text-xl font-bold mb-2">No hay servicios</h2>
          <p className="text-gray-400 text-sm mb-4">Agrega tu primer servicio para que el bot pueda ofrecerlo.</p>
          <button onClick={openNew} className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            + Agregar servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group">
              {svc.image_url && (
                <img src={svc.image_url} alt={svc.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{svc.name}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${svc.active !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {svc.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{svc.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold text-emerald-400">${svc.pricing?.regular_price?.toLocaleString()} {svc.pricing?.currency}</p>
                  <p className="text-xs text-gray-500">{svc.scheduling?.service_type} | {svc.scheduling?.duration_hours}h</p>
                </div>
                {svc.pricing?.deposit_required > 0 && (
                  <p className="text-xs text-gray-500 mb-3">Anticipo: ${svc.pricing.deposit_required.toLocaleString()}</p>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openEdit(svc)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:bg-indigo-500/10 transition-all">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(svc.slug)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}