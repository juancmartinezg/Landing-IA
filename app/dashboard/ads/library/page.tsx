'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function LibraryPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [tab, setTab] = useState<'image' | 'video' | 'copy' | 'winners'>('image');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cap, setCap] = useState(-1);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const load = async () => {
    if (!user?.companyId) return;
    setLoading(true); setSelected([]);
    try {
      const r = await fetch(`${API_URL}/ads/library?type=${tab}&limit=100`, { headers: h });
      const d = await r.json();
      if (d.ok) {
        setItems(d.items || []);
        setCap(d.cap ?? -1);
        setCount(d.current_count ?? 0);
      } else showToast('❌ ' + (d.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [tab, user?.companyId]);
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const selectAll = () => {
    const ids = items.map((i: any) => i.generation_id || i.creative_id).filter(Boolean);
    setSelected(selected.length === ids.length ? [] : ids);
  };
  const bulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`¿Eliminar ${selected.length} creativo${selected.length > 1 ? 's' : ''}? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      const r = await fetch(`${API_URL}/ads/library/delete`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ generation_ids: selected }),
      });
      const d = await r.json();
      if (d.ok) {
        showToast(`✅ ${d.deleted} eliminado${d.deleted !== 1 ? 's' : ''}`);
        await load();
      } else showToast('❌ ' + (d.error || 'Error'));
    } catch { showToast('Error de conexión'); }
    setDeleting(false);
  };
  const fmt = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const capLabel = cap === -1 ? '∞' : `${count}/${cap}`;
  const capWarning = cap > 0 && count >= cap * 0.9;
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/ads" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
          <h1 className="text-xl font-bold">📚 Biblioteca de creativos</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold ${capWarning ? 'bg-yellow-500/20 text-yellow-300' : 'bg-purple-500/20 text-purple-300'}`}>
            {capLabel}
          </span>
        </div>
      </div>
      {capWarning && cap > 0 && count >= cap && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4 text-xs text-yellow-300">
          📚 Tu biblioteca está llena ({count}/{cap}). Las nuevas generaciones no se guardan, pero tu campaña funciona normal. Te recomendamos eliminar las más antiguas.
        </div>
      )}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'image' as const, l: '🎨 Imágenes' },
          { id: 'video' as const, l: '📹 Videos' },
          { id: 'copy' as const, l: '📝 Copies' },
          { id: 'winners' as const, l: '🏆 Ganadores' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t.l}
          </button>
        ))}
      </div>
      {items.length > 0 && tab !== 'winners' && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <button onClick={selectAll} className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 font-bold text-gray-300">
            {selected.length === items.length ? '☐ Deseleccionar todo' : '☑ Seleccionar todo'}
          </button>
          <span className="text-[10px] text-gray-500">{selected.length}/{items.length} seleccionados</span>
          {selected.length > 0 && (
            <button onClick={bulkDelete} disabled={deleting}
              className="ml-auto text-[11px] px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold disabled:opacity-50">
              {deleting ? '⏳ Eliminando...' : `🗑️ Eliminar ${selected.length}`}
            </button>
          )}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm text-gray-400 mb-1">No hay {tab === 'image' ? 'imágenes' : tab === 'video' ? 'videos' : tab === 'copy' ? 'copies' : 'ganadores'} todavía</p>
          <p className="text-[11px] text-gray-600">{tab === 'video' ? 'Sube un video desde el wizard de video.' : 'Genera tu primera campaña con el wizard.'}</p>
        </div>
      ) : tab === 'image' || tab === 'video' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((it: any) => {
            const id = it.generation_id;
            const isSel = selected.includes(id);
            return (
              <div key={id} className={`relative rounded-xl overflow-hidden border-2 transition-all ${isSel ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/10 hover:border-white/30'}`}>
                <button onClick={() => toggle(id)} className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md bg-black/60 backdrop-blur flex items-center justify-center text-xs">
                  {isSel ? '✅' : '☐'}
                </button>
                {tab === 'image' ? (
                  <button onClick={() => setPreviewUrl(it.s3_url)} className="w-full">
                    <img src={it.s3_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                  </button>
                ) : (
                  <video src={it.s3_url} className="w-full aspect-video object-cover bg-black" controls />
                )}
                <div className="p-2 bg-[#0f1320]">
                  <p className="text-[10px] text-gray-300 truncate">{it.asset_subtype || '-'}</p>
                  <p className="text-[9px] text-gray-500 truncate">{it.service_slug || it.business_vertical || '-'}</p>
                  <p className="text-[9px] text-gray-600">{fmt(it.generated_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : tab === 'copy' ? (
        <div className="space-y-3">
          {items.map((it: any) => {
            const isSel = selected.includes(it.generation_id);
            return (
              <div key={it.generation_id} className={`bg-white/[0.02] border rounded-xl p-3 ${isSel ? 'border-purple-500' : 'border-white/5'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <button onClick={() => toggle(it.generation_id)} className="text-sm">
                    {isSel ? '✅' : '☐'}
                  </button>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">{it.asset_subtype || 'copy'}</span>
                  <span className="text-[9px] text-gray-500 ml-auto">{fmt(it.generated_at)}</span>
                </div>
                <p className="text-xs text-gray-300">{it.prompt_preview || '-'}</p>
                {it.service_slug && <p className="text-[10px] text-gray-500 mt-1">📦 {it.service_slug}</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it: any) => (
            <div key={it.creative_id} className="rounded-xl overflow-hidden border border-white/10 bg-[#0f1320]">
              {it.thumbnail_url && <img src={it.thumbnail_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />}
              <div className="p-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">🏆 {it.pattern || '-'}</span>
                  <span className="text-[9px] text-emerald-400 font-bold ml-auto">CTR {(it.ctr || 0).toFixed(2)}%</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">{it.ad_name || '-'}</p>
                <p className="text-[9px] text-gray-600 truncate">{it.body_text || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="" className="max-w-full max-h-full object-contain" />
          <button onClick={() => setPreviewUrl(null)} className="absolute top-4 right-4 text-white text-3xl">✕</button>
        </div>
      )}
    </div>
  );
}