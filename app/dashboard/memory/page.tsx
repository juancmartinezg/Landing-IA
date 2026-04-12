'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function MemoryPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const loadMemories = () => {
    fetch(`${API_URL}/memory`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => { setMemories(data.memories || []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { loadMemories(); }, []);
  const handleDelete = async (normalized_question: string) => {
    if (!confirm('Eliminar esta respuesta aprendida?')) return;
    await fetch(`${API_URL}/memory`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
      body: JSON.stringify({ normalized_question }),
    });
    loadMemories();
  };
  const handleEdit = async (normalized_question: string) => {
    if (!editAnswer.trim()) return;
    await fetch(`${API_URL}/memory`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
      body: JSON.stringify({ normalized_question, answer: editAnswer }),
    });
    setEditing(null);
    setEditAnswer('');
    loadMemories();
  };
  const sources = {
    human_agent: { label: 'Asesor', color: 'bg-emerald-500/20 text-emerald-400' },
    gemini: { label: 'IA', color: 'bg-indigo-500/20 text-indigo-400' },
    manual_training: { label: 'Manual', color: 'bg-purple-500/20 text-purple-400' },
    manual_edit: { label: 'Editado', color: 'bg-yellow-500/20 text-yellow-400' },
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Memoria IA 🧠</h1>
        <a href="/dashboard/training" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          + Entrenar bot
        </a>
      </div>
      <p className="text-gray-400 mb-6">Todo lo que tu bot ha aprendido. Puedes editar o eliminar respuestas incorrectas.</p>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando memorias...</div>
      ) : memories.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🧠</p>
          <h2 className="text-xl font-bold mb-2">Tu bot aun no ha aprendido nada</h2>
          <p className="text-gray-400 text-sm mb-4">Cuando un asesor responda preguntas o la IA responda con alta confianza, las respuestas se guardaran aqui.</p>
          <a href="/dashboard/training" className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            Entrenar bot manualmente →
          </a>
        </div>
      ) : (
        <div>
          <div className="text-xs text-gray-500 mb-3">{memories.length} respuestas aprendidas</div>
          <div className="space-y-3">
            {memories.map((mem, i) => {
              const src = (sources as any)[mem.source] || { label: mem.source, color: 'bg-gray-500/20 text-gray-400' };
              return (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Pregunta:</p>
                      <p className="font-medium text-indigo-300">{mem.original_question || mem.normalized_question}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full ml-3 ${src.color}`}>
                      {src.label}
                    </span>
                  </div>
                  {editing === mem.normalized_question ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Editar respuesta:</p>
                      <textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-20 resize-none mb-2"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(null); setEditAnswer(''); }}
                          className="px-4 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition-all">
                          Cancelar
                        </button>
                        <button onClick={() => handleEdit(mem.normalized_question)}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-all">
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Respuesta:</p>
                      <p className="text-sm text-gray-300">{mem.answer}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-gray-600">Usado {mem.hit_count || 0} veces</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditing(mem.normalized_question); setEditAnswer(mem.answer); }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(mem.normalized_question)}
                        className="text-xs text-red-400 hover:text-red-300 font-bold">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}