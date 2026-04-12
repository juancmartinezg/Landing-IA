'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  useEffect(() => {
    fetch(`${API_URL}/templates`)
      .then(res => res.json())
      .then(data => { setTemplates(data.templates || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  const handleApply = async (tpl: any) => {
    setApplying(tpl.id);
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
        body: JSON.stringify({
          business_item_name: tpl.default_config?.business_item_name || 'servicio',
          btn_book: tpl.default_config?.btn_book || 'Reservar',
          item_type: tpl.default_config?.business_item_name || 'servicio',
        }),
      });
      setApplied(tpl.id);
      setTimeout(() => setApplied(null), 3000);
    } catch (err) {
      console.error('Error:', err);
    }
    setApplying(null);
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Plantillas de Personalidad 📋</h1>
      <p className="text-gray-400 mb-6">Elige una personalidad para tu bot. Los textos y botones se actualizan al instante.</p>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl, i) => (
            <div key={i} className={`bg-white/[0.03] border rounded-2xl p-6 transition-all ${
              applied === tpl.id ? 'border-emerald-500' : 'border-white/5 hover:border-indigo-500/30'
            }`}>
              <div className="text-3xl mb-3">{tpl.icon}</div>
              <h3 className="font-bold mb-1">{tpl.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{tpl.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="text-[10px] px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
                  {tpl.default_config?.business_item_name}
                </span>
                <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  {tpl.default_config?.btn_book}
                </span>
              </div>
              {applied === tpl.id ? (
                <p className="w-full text-center py-2 text-xs font-bold text-emerald-400">✓ Aplicada</p>
              ) : (
                <button
                  onClick={() => handleApply(tpl)}
                  disabled={applying === tpl.id}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {applying === tpl.id ? 'Aplicando...' : 'Aplicar plantilla'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}