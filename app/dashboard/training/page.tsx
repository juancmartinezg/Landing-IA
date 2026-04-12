'use client';
import { useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function TrainingPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'client-id': 'JMC' },
        body: JSON.stringify({ question: question.trim(), answer: answer.trim() }),
      });
      setHistory(prev => [{ question, answer, time: new Date().toLocaleTimeString() }, ...prev]);
      setQuestion('');
      setAnswer('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Entrenar Bot 🎓</h1>
      <p className="text-gray-400 mb-6">Ensena a tu bot nuevas respuestas. Escribe la pregunta que haria un cliente y la respuesta que deberia dar tu bot.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Nueva Respuesta</h3>
          
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Pregunta del cliente</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-24 resize-none"
              placeholder="Ej: Tienen parqueadero? Puedo llevar mi mascota? Cual es el horario?"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Respuesta del bot</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white h-24 resize-none"
              placeholder="Ej: Si, contamos con parqueadero amplio para vehiculos y motos."
            />
          </div>
          {saved && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <p className="text-emerald-400 text-sm font-bold">✓ Respuesta guardada. Tu bot ya la aprendio.</p>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !question.trim() || !answer.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : '🧠 Ensenar al bot'}
          </button>
          <div className="mt-4 bg-white/[0.02] rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Tips para entrenar mejor:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Escribe la pregunta como la haria un cliente real</li>
              <li>• La respuesta debe ser corta y directa (2-3 lineas)</li>
              <li>• Puedes agregar varias formas de la misma pregunta</li>
              <li>• El bot tambien aprende automaticamente de los asesores</li>
            </ul>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Entrenamiento de esta sesion</h3>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-gray-500 text-sm">Las respuestas que agregues apareceran aqui</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {history.map((item, i) => (
                <div key={i} className="bg-white/[0.02] rounded-xl p-4">
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-500 uppercase">Pregunta:</p>
                    <p className="text-sm text-indigo-300">{item.question}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Respuesta:</p>
                    <p className="text-sm text-gray-300">{item.answer}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-2">{item.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}