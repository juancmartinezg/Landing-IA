'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CATEGORIES = [
  { id: 'UTILITY', label: '🔧 Utilidad', desc: 'Recordatorios, confirmaciones, alertas. Más barato (~$0.008-0.04 USD/msg).', color: 'indigo' },
  { id: 'MARKETING', label: '📢 Marketing', desc: 'Promos, ofertas, reactivación. Más caro (~$0.012-0.08 USD/msg). Requiere opt-in.', color: 'purple' },
];
export default function TemplatesManagerPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
  const [form, setForm] = useState({
    name: '',
    category: 'UTILITY',
    body: '',
    example: [''],
  });
  const loadTemplates = () => {
    setLoading(true);
    fetch(`${API_URL}/templates/list`, { headers: h })
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { loadTemplates(); }, []);
  const handleCreate = async () => {
    if (!form.name.trim() || !form.body.trim()) { showToast('⚠️ Nombre y cuerpo son requeridos'); return; }
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/templates/custom`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim().toLowerCase().replace(/\s+/g, '_'),
          category: form.category,
          body: form.body.trim(),
          example: form.example.filter(e => e.trim()),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(`✅ Template "${form.name}" ${data.existing ? 'ya existía' : 'enviado a Meta'}. Estado: ${data.status || 'PENDING'}`);
        setShowCreate(false);
        setForm({ name: '', category: 'UTILITY', body: '', example: [''] });
        loadTemplates();
      } else {
        showToast(`❌ ${data.error || 'Error creando template'}`);
      }
    } catch { showToast('Error de conexión'); }
    setCreating(false);
  };
  const handleDelete = async (name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Se borrará de Meta y del sistema.`)) return;
    setDeleting(name);
    try {
      const res = await fetch(`${API_URL}/templates/custom`, {
        method: 'DELETE',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.ok) { showToast(`🗑️ "${name}" eliminado`); loadTemplates(); }
      else showToast(`❌ ${data.error || 'Error eliminando'}`);
    } catch { showToast('Error de conexión'); }
    setDeleting(null);
  };
  const handleRefresh = async () => {
    try {
      await fetch(`${API_URL}/templates/poll-status`, { method: 'GET', headers: h });
      loadTemplates();
      showToast('🔄 Estados actualizados desde Meta');
    } catch { showToast('Error consultando Meta'); }
  };
  // Contar variables {{N}} en el body
  const varCount = (form.body.match(/\{\{\d+\}\}/g) || []).length;
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold">Plantillas WhatsApp 📝</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold transition-all">
            🔄 Verificar estado
          </button>
          <button onClick={() => setShowCreate(!showCreate)}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            {showCreate ? '✕ Cerrar' : '+ Crear plantilla'}
          </button>
        </div>
      </div>
      {/* Banner costos Meta */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
        <p className="text-[11px] text-amber-300 leading-relaxed">
          ⚠️ <strong>Meta cobra cada mensaje enviado con plantilla</strong> directamente a la tarjeta de tu cuenta de Facebook Business.
          clientes.bot no cobra comisión adicional. Precios varían por país y categoría (~$0.008-0.08 USD por mensaje).
          <a href="https://developers.facebook.com/docs/whatsapp/pricing" target="_blank" className="text-indigo-400 underline ml-1">Ver precios Meta →</a>
        </p>
      </div>
      {/* Formulario crear */}
      {showCreate && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4">✨ Crear plantilla nueva</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nombre interno *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
                placeholder="promo_limpieza_dental" />
              <p className="text-[9px] text-gray-600 mt-1">Solo letras, números y guiones bajos. Máx 60 chars.</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Categoría *</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setForm({ ...form, category: cat.id })}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      form.category === cat.id
                        ? `border-${cat.color}-500 bg-${cat.color}-600/10`
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}>
                    <p className="text-xs font-bold">{cat.label}</p>
                    <p className="text-[8px] text-gray-500 leading-relaxed mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Cuerpo del mensaje * <span className="text-gray-600 normal-case">— usa {'{{1}}'}, {'{{2}}'} para variables</span>
            </label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white resize-none font-mono"
              placeholder={'Hola {{1}}, tenemos promoción de {{2}} este mes. 30% de descuento si agendas antes del viernes. Responde SI para agendar.'} />
            <p className="text-[9px] text-gray-600 mt-1">{form.body.length}/1024 chars · {varCount} variable{varCount !== 1 ? 's' : ''} detectada{varCount !== 1 ? 's' : ''}</p>
          </div>
          {varCount > 0 && (
            <div className="mb-4">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Ejemplos de variables (Meta los requiere para preview)</label>
              <div className="space-y-2">
                {Array.from({ length: varCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12 shrink-0">{`{{${i + 1}}}`}</span>
                    <input value={form.example[i] || ''} onChange={(e) => {
                      const ex = [...form.example];
                      ex[i] = e.target.value;
                      setForm({ ...form, example: ex });
                    }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white"
                      placeholder={i === 0 ? 'Ej: Juan' : i === 1 ? 'Ej: limpieza dental' : `Ejemplo ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Preview */}
          {form.body && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Preview</p>
              <div className="bg-[#0B3D2E] rounded-xl p-4 max-w-sm">
                <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                  {form.body.replace(/\{\{(\d+)\}\}/g, (_, n) => {
                    const idx = parseInt(n) - 1;
                    return form.example[idx] || `[variable ${n}]`;
                  })}
                </p>
              </div>
            </div>
          )}
          {form.category === 'MARKETING' && (
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-purple-300 leading-relaxed">
                📢 <strong>Templates MARKETING</strong> son más caros y requieren que el destinatario haya dado opt-in.
                Meta puede rechazarlos si el contenido no cumple sus políticas.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5">Cancelar</button>
            <button onClick={handleCreate} disabled={creating || !form.name.trim() || !form.body.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all">
              {creating ? '⏳ Enviando a Meta...' : '📤 Crear y enviar a revisión'}
            </button>
          </div>
        </div>
      )}
      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando plantillas...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📝</p>
          <h2 className="text-xl font-bold mb-2">Sin plantillas</h2>
          <p className="text-gray-400 text-sm mb-4">Conecta WhatsApp y se crearán automáticamente las plantillas de recordatorio y follow-up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((t, i) => {
            const statusColor = t.status === 'APPROVED' ? 'emerald' : t.status === 'PENDING' ? 'yellow' : t.status === 'REJECTED' ? 'red' : 'gray';
            const statusLabel = t.status === 'APPROVED' ? '✅ Aprobada' : t.status === 'PENDING' ? '⏳ En revisión' : t.status === 'REJECTED' ? '❌ Rechazada' : '⚪ Desconocido';
            const catColor = t.category === 'MARKETING' ? 'purple' : 'indigo';
            return (
              <div key={i} className={`bg-white/[0.03] border rounded-xl p-4 transition-all ${
                t.status === 'APPROVED' ? 'border-emerald-500/20' : t.status === 'REJECTED' ? 'border-red-500/20' : 'border-white/5'
              }`}>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold">{t.template_name}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold bg-${catColor}-500/20 text-${catColor}-400`}>
                          {t.category || 'UTILITY'}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold bg-${statusColor}-500/20 text-${statusColor}-400`}>
                          {statusLabel}
                        </span>
                        {t.type === 'auto' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500">Auto-creada</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {t.language} · ID: {(t.template_id || '').slice(-8) || '—'}
                        {t.created_at ? ` · ${new Date(t.created_at * 1000).toLocaleDateString()}` : ''}
                      </p>
                      {t.body && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate max-w-md">{t.body.slice(0, 100)}{t.body.length > 100 ? '...' : ''}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.editable && (
                      <button onClick={() => handleDelete(t.template_name)} disabled={deleting === t.template_name}
                        className="text-[10px] px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold transition-all disabled:opacity-50">
                        {deleting === t.template_name ? '...' : '🗑️ Eliminar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}