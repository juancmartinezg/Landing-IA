'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function MemoryPage() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  const loadMemories = () => {
    setLoading(true);
   fetch(`${API_URL}/memory`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => { setMemories(data.memories || []); setLoading(false); })
      .catch(() => { setMemories([]); setLoading(false); });
  };
  useEffect(() => { loadMemories(); }, []);
  const handleDelete = async (normalized_question: string) => {
    if (!confirm('¿Eliminar esta respuesta aprendida?')) return;
    setDeleting(normalized_question);
    try {
      const res = await fetch(`${API_URL}/memory?nq=${encodeURIComponent(normalized_question)}`, {
        method: 'DELETE',
        headers: { 'client-id': 'JMC' },
      });
      if (res.ok) {
        showToast('✓ Respuesta eliminada');
        setMemories(prev => prev.filter(m => m.normalized_question !== normalized_question));
      } else {
        showToast('Error eliminando respuesta');
      }
    } catch {
      showToast('Error de conexión');
    }
    setDeleting(null);
  };
  const handleEdit = async (normalized_question: string) => {
    if (!editAnswer.trim()) return;
    setSaving(true);
    try {
      const params = new URLSearchParams({
        nq: normalized_question,
        answer: editAnswer,
      });
      const res = await fetch(`${API_URL}/memory?${params.toString()}`, {
        method: 'PUT',
        headers: { 'client-id': 'JMC' },
      });
      if (res.ok) {
        showToast('✓ Respuesta actualizada');
        setMemories(prev => prev.map(m =>
          m.normalized_question === normalized_question
            ? { ...m, answer: editAnswer, source: 'manual_edit' }
            : m
        ));
        setEditing(null);
        setEditAnswer('');
      } else {
        showToast('Error guardando respuesta');
      }
    } catch {
      showToast('Error de conexión');
    }
    setSaving(false);
  };
  const sources: Record<string, { label: string; color: string }> = {
    human_agent: { label: 'Asesor', color: 'bg-emerald-500/20 text-emerald-400' },
    gemini: { label: 'IA', color: 'bg-indigo-500/20 text-indigo-400' },
    manual_training: { label: 'Manual', color: 'bg-purple-500/20 text-purple-400' },
    manual_edit: { label: 'Editado', color: 'bg-yellow-500/20 text-yellow-400' },
    auto_promoted: { label: 'Auto', color: 'bg-sky-500/20 text-sky-400' },
    manual_ingest: { label: 'Base', color: 'bg-gray-500/20 text-gray-400' },
  };
  const filtered = memories.filter(mem => {
    if (filter !== 'all' && mem.source !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (mem.original_question || '').toLowerCase().includes(s) ||
             (mem.answer || '').toLowerCase().includes(s) ||
             (mem.normalized_question || '').toLowerCase().includes(s);
    }
    return true;
  });
  const withAnswer = memories.filter(m => m.answer && m.answer.trim());
  const withoutAnswer = memories.filter(m => !m.answer || !m.answer.trim());
  const sourceCount = memories.reduce((acc: Record<string, number>, m) => {
    acc[m.source || 'unknown'] = (acc[m.source || 'unknown'] || 0) + 1;
    return acc;
  }, {});
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Memoria IA 🧠</h1>
        <a href="/dashboard/training" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          + Entrenar bot
        </a>
      </div>
      <p className="text-gray-400 mb-6">Todo lo que tu bot ha aprendido. Puedes editar o eliminar respuestas incorrectas.</p>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total</p>
          <p className="text-2xl font-bold text-indigo-400">{memories.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Con respuesta</p>
          <p className="text-2xl font-bold text-emerald-400">{withAnswer.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Sin respuesta</p>
          <p className="text-2xl font-bold text-yellow-400">{withoutAnswer.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Fuentes</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(sourceCount).map(([src, count]) => (
              <span key={src} className={`text-[9px] px-1.5 py-0.5 rounded-full ${(sources[src] || sources.manual_ingest).color}`}>
                {(sources[src] || { label: src }).label}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por pregunta o respuesta..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        >
          <option value="all" className="bg-[#1a1f2e] text-white">Todas las fuentes</option>
          <option value="manual_ingest" className="bg-[#1a1f2e] text-white">Base (ingesta manual)</option>
          <option value="auto_promoted" className="bg-[#1a1f2e] text-white">Auto-promovidas</option>
          <option value="manual_training" className="bg-[#1a1f2e] text-white">Entrenamiento manual</option>
          <option value="manual_edit" className="bg-[#1a1f2e] text-white">Editadas</option>
          <option value="human_agent" className="bg-[#1a1f2e] text-white">Asesor</option>
          <option value="gemini" className="bg-[#1a1f2e] text-white">IA (Gemini)</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando memorias...</div>
      ) : memories.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🧠</p>
          <h2 className="text-xl font-bold mb-2">Tu bot aún no ha aprendido nada</h2>
          <p className="text-gray-400 text-sm mb-4">Cuando un asesor responda preguntas o la IA responda con alta confianza, las respuestas se guardarán aquí.</p>
          <a href="/dashboard/training" className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            Entrenar bot manualmente →
          </a>
        </div>
      ) : (
        <div>
          <div className="text-xs text-gray-500 mb-3">{filtered.length} de {memories.length} respuestas</div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay resultados con esos filtros</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((mem, i) => {
                const src = sources[mem.source] || { label: mem.source || 'Desconocido', color: 'bg-gray-500/20 text-gray-400' };
                const hasAnswer = mem.answer && mem.answer.trim();
                return (
                  <div key={i} className={`bg-white/[0.03] border rounded-xl p-5 transition-all ${
                    !hasAnswer ? 'border-yellow-500/20' : 'border-white/5'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Pregunta:</p>
                        <p className="font-medium text-indigo-300">{mem.original_question || mem.normalized_question}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {!hasAnswer && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                            Sin respuesta
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-1 rounded-full ${src.color}`}>
                          {src.label}
                        </span>
                      </div>
                    </div>
                    {editing === mem.normalized_question ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{hasAnswer ? 'Editar respuesta:' : 'Agregar respuesta:'}</p>
                        <textarea
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-24 resize-none mb-2"
                          placeholder="Escribe la respuesta que debería dar el bot..."
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { setEditing(null); setEditAnswer(''); }}
                            className="px-4 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                            Cancelar
                          </button>
                          <button onClick={() => handleEdit(mem.normalized_question)}
                            disabled={saving || !editAnswer.trim()}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">
                            {saving ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Respuesta:</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{hasAnswer ? mem.answer : '—'}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-gray-600">Usado {mem.hit_count || 0} veces</p>
                        {mem.last_hit && (
                          <p className="text-[10px] text-gray-600">
                            Último uso: {new Date(mem.last_hit * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditing(mem.normalized_question); setEditAnswer(mem.answer || ''); }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                          {mem.answer && mem.answer.trim() ? 'Editar' : '+ Respuesta'}
                        </button>
                        <button
                          onClick={() => handleDelete(mem.normalized_question)}
                          disabled={deleting === mem.normalized_question}
                          className="text-xs text-red-400 hover:text-red-300 font-bold disabled:opacity-50">
                          {deleting === mem.normalized_question ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}