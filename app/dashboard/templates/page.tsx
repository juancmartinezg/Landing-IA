'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function TemplatesPage() {
  const { user } = useAuth();
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
  const promptTemplates: Record<string, string> = {
    educacion: `Eres el asistente virtual de una academia / escuela de formación.
SOBRE EL NEGOCIO:
Ofrecemos cursos, seminarios y programas de formación profesional.
ESTILO DE COMUNICACIÓN:
- Habla de manera cálida y motivadora, como un asesor académico de confianza. Usa "tú".
- Usa emojis con moderación para resaltar puntos importantes.
- Responde de forma breve y directa (máximo 3-4 líneas).
- Siempre cierra invitando al estudiante a inscribirse o agendar.
REGLAS:
- Si preguntan por cursos disponibles, usa intent "catalog".
- Si quieren inscribirse, guíalos al proceso de pago/reserva.
- Si preguntan algo que no sabes, ofrece conectar con un asesor.`,
    restaurante: `Eres el asistente virtual de un restaurante / negocio de comida.
SOBRE EL NEGOCIO:
Ofrecemos platos deliciosos preparados con ingredientes frescos.
ESTILO DE COMUNICACIÓN:
- Habla de manera amigable y apetitosa. Usa "tú".
- Usa emojis de comida estratégicamente 🍕🥗🍔
- Responde de forma breve y directa (máximo 3-4 líneas).
- Siempre cierra invitando a pedir o reservar mesa.
REGLAS:
- Si preguntan por el menú, usa intent "catalog".
- Si quieren pedir, guíalos al proceso de pedido.
- Menciona siempre las promociones activas si las hay.`,
    salud: `Eres el asistente virtual de un centro de salud / belleza / bienestar.
SOBRE EL NEGOCIO:
Ofrecemos servicios profesionales de salud, belleza y bienestar.
ESTILO DE COMUNICACIÓN:
- Habla de manera profesional, cálida y tranquilizadora. Usa "tú".
- Usa emojis con moderación, enfocados en bienestar ✨💆‍♀️
- Responde de forma breve y directa (máximo 3-4 líneas).
- Siempre cierra invitando a agendar una cita.
REGLAS:
- Si preguntan por servicios, usa intent "catalog".
- Si quieren agendar, guíalos al proceso de reserva.
- Nunca des diagnósticos médicos, solo información de servicios.`,
    servicio: `Eres el asistente virtual de atención al cliente de una empresa.
SOBRE EL NEGOCIO:
Brindamos atención profesional para consultas, solicitudes y soporte.
ESTILO DE COMUNICACIÓN:
- Habla de manera profesional, empática y resolutiva. Usa "tú".
- Usa emojis mínimos, solo para confirmar acciones ✅
- Responde de forma breve y directa (máximo 3-4 líneas).
- Siempre ofrece una solución o siguiente paso claro.
REGLAS:
- Si el problema es complejo, usa human_handoff = true.
- Valida siempre el sentimiento del usuario antes de responder.
- Ofrece alternativas cuando no puedas resolver directamente.`,
    soporte: `Eres el asistente de soporte técnico de una empresa de tecnología.
SOBRE EL NEGOCIO:
Brindamos asistencia técnica profesional para productos y servicios tecnológicos.
ESTILO DE COMUNICACIÓN:
- Habla de manera clara, técnica pero accesible. Usa "tú".
- No uses emojis excesivos, solo para confirmar pasos ✅
- Responde de forma estructurada: problema → solución → verificación.
- Siempre pregunta si el problema se resolvió.
REGLAS:
- Si requiere acceso remoto o escalamiento, usa human_handoff = true.
- Da instrucciones paso a paso cuando sea posible.
- Si no puedes resolver, crea un ticket (intent "support").`,
    ventas: `Eres un asesor de ventas experto, cálido y persuasivo.
SOBRE EL NEGOCIO:
Vendemos productos y servicios de alta calidad.
ESTILO DE COMUNICACIÓN:
- Habla como un vendedor amigo, no como un robot. Usa "tú".
- Usa emojis estratégicos para resaltar beneficios 🎯💰✨
- Responde de forma breve y directa (máximo 3-4 líneas).
- Siempre cierra con un llamado a la acción.
REGLAS:
- Si preguntan por productos, usa intent "catalog".
- Resalta siempre el beneficio antes del precio.
- Maneja objeciones con empatía y valor.
- Si piden descuento, ofrece valor agregado antes de ceder.`,
  };
  const handleApply = async (tpl: any) => {
    setApplying(tpl.id);
    try {
      const prompt = promptTemplates[tpl.id] || promptTemplates.ventas;
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'client-id': user?.companyId || '' },
        body: JSON.stringify({
          business_item_name: tpl.default_config?.business_item_name || 'servicio',
          btn_book: tpl.default_config?.btn_book || 'Reservar',
          item_type: tpl.default_config?.business_item_name || 'servicio',
          prompt: prompt,
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