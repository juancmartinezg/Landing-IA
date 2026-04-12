'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function MemoryPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/memory`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => { setMemories(data.memories || []); setLoading(false); })
      .catch(() => {
        setMemories([]);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Memoria IA 🧠</h1>
      <p className="text-gray-400 mb-6">Todo lo que tu bot ha aprendido de las conversaciones con asesores y de la IA.</p>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : memories.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🧠</p>
          <h2 className="text-xl font-bold mb-2">Tu bot aun no ha aprendido nada</h2>
          <p className="text-gray-400 text-sm mb-4">Cuando un asesor responda preguntas o la IA responda con alta confianza, las respuestas se guardaran aqui automaticamente.</p>
          <a href="/dashboard/training" className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            Entrenar bot manualmente →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map((mem, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Pregunta:</p>
                  <p className="font-medium text-indigo-300">{mem.original_question || mem.normalized_question}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ml-3 ${
                  mem.source === 'human_agent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {mem.source === 'human_agent' ? 'Asesor' : 'IA'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Respuesta aprendida:</p>
                <p className="text-sm text-gray-300">{mem.answer}</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-gray-600">Usado {mem.hit_count || 0} veces</p>
                <button className="text-xs text-red-400 hover:text-red-300 font-bold">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}