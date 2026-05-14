// Mock data para el demo navegable público.
// Negocio ficticio: "Inmobiliaria Aurora" — proyecto Aurora Park.
// Toda la data es coherente entre módulos (mismos leads aparecen en CRM, chat, pagos, ads).
export const MOCK_BRAND = {
  name: 'Inmobiliaria Aurora',
  logo: '/cb-logo.webp',
  currency: 'USD',
  vertical: 'Bienes Raíces',
};
export const MOCK_AGENTS = [
  { id: 'a1', name: 'María García', email: 'maria@aurora.com', role: 'admin', sales_closed: 18, response_avg_sec: 42 },
  { id: 'a2', name: 'Juan Martínez', email: 'juan@aurora.com', role: 'agent', sales_closed: 12, response_avg_sec: 58 },
  { id: 'a3', name: 'Laura Pérez', email: 'laura@aurora.com', role: 'agent', sales_closed: 9, response_avg_sec: 71 },
];
export const MOCK_SERVICES = [
  { slug: 'apto-2h-vista', name: 'Apto 2H Vista Panorámica', price: 145000, currency: 'USD', stock: 8, image: '🏢', category: 'Apartamentos' },
  { slug: 'apto-3h-premium', name: 'Apto 3H Premium', price: 185000, currency: 'USD', stock: 4, image: '🏙️', category: 'Apartamentos' },
  { slug: 'penthouse-doble', name: 'Penthouse Doble Altura', price: 320000, currency: 'USD', stock: 2, image: '🌇', category: 'Penthouse' },
  { slug: 'local-comercial', name: 'Local Comercial 80m²', price: 95000, currency: 'USD', stock: 6, image: '🏬', category: 'Comercial' },
  { slug: 'reserva-cita', name: 'Cita de visita guiada', price: 50, currency: 'USD', stock: 999, image: '📅', category: 'Visitas' },
  { slug: 'estudio-economico', name: 'Estudio 45m² Inversión', price: 68000, currency: 'USD', stock: 12, image: '🏠', category: 'Apartamentos' },
];
// 40 leads con distribución realista de etapas
export const MOCK_LEADS = [
  // Cerrado ganado (12) — los que compraron
  { id: 'l1', name: 'Carlos Méndez', phone: '+1305551001', email: 'carlos.m@gmail.com', stage: 'cerrado_ganado', score: 95, agent: 'María García', service: 'apto-3h-premium', amount: 185000, last_msg: 'Gracias por todo, el departamento es hermoso', last_at: '2026-05-13T18:22:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l2', name: 'Ana López', phone: '+1305551002', email: 'ana.lopez@outlook.com', stage: 'cerrado_ganado', score: 92, agent: 'Juan Martínez', service: 'apto-2h-vista', amount: 145000, last_msg: 'Pago confirmado, nos vemos en la entrega', last_at: '2026-05-13T16:08:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l3', name: 'Pedro Ruiz', phone: '+1305551003', email: 'pruiz@yahoo.com', stage: 'cerrado_ganado', score: 90, agent: 'María García', service: 'penthouse-doble', amount: 320000, last_msg: 'Listo, ¡firmamos!', last_at: '2026-05-12T11:34:00Z', source: 'Referido', city: 'Tampa' },
  { id: 'l4', name: 'Sofía Restrepo', phone: '+1305551004', email: 'sofia.r@gmail.com', stage: 'cerrado_ganado', score: 88, agent: 'Laura Pérez', service: 'apto-2h-vista', amount: 145000, last_msg: 'Perfecto, gracias', last_at: '2026-05-11T20:12:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l5', name: 'Roberto Silva', phone: '+1305551005', email: 'rsilva@hotmail.com', stage: 'cerrado_ganado', score: 91, agent: 'Juan Martínez', service: 'local-comercial', amount: 95000, last_msg: 'Excelente atención', last_at: '2026-05-10T14:45:00Z', source: 'Web', city: 'Miami' },
  { id: 'l6', name: 'Diana Morales', phone: '+1305551006', email: 'dmorales@gmail.com', stage: 'cerrado_ganado', score: 89, agent: 'María García', service: 'apto-3h-premium', amount: 185000, last_msg: 'Confirmado el pago de la separación', last_at: '2026-05-09T09:18:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l7', name: 'Andrés Castaño', phone: '+1305551007', email: 'acastano@outlook.com', stage: 'cerrado_ganado', score: 87, agent: 'Laura Pérez', service: 'estudio-economico', amount: 68000, last_msg: 'Listo, hablamos mañana', last_at: '2026-05-08T17:33:00Z', source: 'Facebook Ads', city: 'Tampa' },
  { id: 'l8', name: 'Valentina Cruz', phone: '+1305551008', email: 'vcruz@gmail.com', stage: 'cerrado_ganado', score: 93, agent: 'Juan Martínez', service: 'apto-2h-vista', amount: 145000, last_msg: '¡Gracias!', last_at: '2026-05-07T13:21:00Z', source: 'Referido', city: 'Miami' },
  { id: 'l9', name: 'Felipe Ortiz', phone: '+1305551009', email: 'fortiz@yahoo.com', stage: 'cerrado_ganado', score: 86, agent: 'María García', service: 'apto-3h-premium', amount: 185000, last_msg: 'Hablamos pronto', last_at: '2026-05-06T11:09:00Z', source: 'Web', city: 'Orlando' },
  { id: 'l10', name: 'Camila Vargas', phone: '+1305551010', email: 'cvargas@hotmail.com', stage: 'cerrado_ganado', score: 84, agent: 'Laura Pérez', service: 'apto-2h-vista', amount: 145000, last_msg: 'OK', last_at: '2026-05-05T15:54:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l11', name: 'Daniel Herrera', phone: '+1305551011', email: 'dherrera@gmail.com', stage: 'cerrado_ganado', score: 88, agent: 'Juan Martínez', service: 'local-comercial', amount: 95000, last_msg: 'Excelente', last_at: '2026-05-04T19:30:00Z', source: 'Instagram Ads', city: 'Tampa' },
  { id: 'l12', name: 'Isabela Marín', phone: '+1305551012', email: 'imarin@outlook.com', stage: 'cerrado_ganado', score: 85, agent: 'María García', service: 'apto-2h-vista', amount: 145000, last_msg: 'Pago listo', last_at: '2026-05-03T10:42:00Z', source: 'Referido', city: 'Miami' },
  // Negociación (8)
  { id: 'l13', name: 'Javier Restrepo', phone: '+1305551013', email: 'jrestrepo@gmail.com', stage: 'negociacion', score: 78, agent: 'María García', service: 'apto-3h-premium', amount: null, last_msg: 'Necesito revisarlo con mi esposa, te confirmo mañana', last_at: '2026-05-14T08:15:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l14', name: 'Mariana Quintero', phone: '+1305551014', email: 'mquintero@outlook.com', stage: 'negociacion', score: 75, agent: 'Juan Martínez', service: 'penthouse-doble', amount: null, last_msg: '¿Hay opción de financiación a 10 años?', last_at: '2026-05-14T07:42:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l15', name: 'Esteban Gómez', phone: '+1305551015', email: 'egomez@yahoo.com', stage: 'negociacion', score: 72, agent: 'Laura Pérez', service: 'apto-2h-vista', amount: null, last_msg: 'Mándame el plano por favor', last_at: '2026-05-13T22:01:00Z', source: 'Facebook Ads', city: 'Tampa' },
  { id: 'l16', name: 'Natalia Vélez', phone: '+1305551016', email: 'nvelez@gmail.com', stage: 'negociacion', score: 70, agent: 'María García', service: 'apto-3h-premium', amount: null, last_msg: 'Estoy entre el 3H y el penthouse', last_at: '2026-05-13T19:33:00Z', source: 'Referido', city: 'Miami' },
  { id: 'l17', name: 'Sebastián Páez', phone: '+1305551017', email: 'spaez@hotmail.com', stage: 'negociacion', score: 76, agent: 'Juan Martínez', service: 'local-comercial', amount: null, last_msg: '¿El local tiene parqueadero incluido?', last_at: '2026-05-13T16:48:00Z', source: 'Web', city: 'Miami' },
  { id: 'l18', name: 'Paula Henao', phone: '+1305551018', email: 'phenao@outlook.com', stage: 'negociacion', score: 68, agent: 'Laura Pérez', service: 'estudio-economico', amount: null, last_msg: 'Quiero que sea para mi hija universitaria', last_at: '2026-05-13T14:22:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l19', name: 'Tomás Aristizábal', phone: '+1305551019', email: 'taristizabal@gmail.com', stage: 'negociacion', score: 71, agent: 'María García', service: 'apto-2h-vista', amount: null, last_msg: 'Esperando confirmación del banco', last_at: '2026-05-13T11:55:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l20', name: 'Daniela Cardona', phone: '+1305551020', email: 'dcardona@yahoo.com', stage: 'negociacion', score: 73, agent: 'Juan Martínez', service: 'apto-3h-premium', amount: null, last_msg: 'Coordinemos visita el viernes', last_at: '2026-05-13T09:18:00Z', source: 'Referido', city: 'Tampa' },
  // Interesado (12)
  { id: 'l21', name: 'Mateo Jiménez', phone: '+1305551021', email: 'mjimenez@gmail.com', stage: 'interesado', score: 62, agent: 'Laura Pérez', service: 'apto-2h-vista', amount: null, last_msg: '¿Cuándo entregan?', last_at: '2026-05-14T09:55:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l22', name: 'Lucía Mejía', phone: '+1305551022', email: 'lmejia@outlook.com', stage: 'interesado', score: 60, agent: 'María García', service: 'estudio-economico', amount: null, last_msg: 'Me interesa para inversión', last_at: '2026-05-14T09:30:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l23', name: 'Nicolás Toro', phone: '+1305551023', email: 'ntoro@hotmail.com', stage: 'interesado', score: 58, agent: 'Juan Martínez', service: 'apto-3h-premium', amount: null, last_msg: '¿Qué incluye el precio?', last_at: '2026-05-14T08:48:00Z', source: 'Web', city: 'Tampa' },
  { id: 'l24', name: 'Sara Bedoya', phone: '+1305551024', email: 'sbedoya@gmail.com', stage: 'interesado', score: 65, agent: 'Laura Pérez', service: 'apto-2h-vista', amount: null, last_msg: 'Mándame fotos del baño y la cocina', last_at: '2026-05-14T07:15:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l25', name: 'Alejandro Rojas', phone: '+1305551025', email: 'arojas@yahoo.com', stage: 'interesado', score: 55, agent: 'María García', service: 'local-comercial', amount: null, last_msg: '¿Permiten restaurante?', last_at: '2026-05-13T23:42:00Z', source: 'Referido', city: 'Miami' },
  { id: 'l26', name: 'Verónica Salazar', phone: '+1305551026', email: 'vsalazar@outlook.com', stage: 'interesado', score: 63, agent: 'Juan Martínez', service: 'apto-3h-premium', amount: null, last_msg: 'Me gusta la vista al parque', last_at: '2026-05-13T21:08:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l27', name: 'Iván Posada', phone: '+1305551027', email: 'iposada@gmail.com', stage: 'interesado', score: 57, agent: 'Laura Pérez', service: 'penthouse-doble', amount: null, last_msg: '¿Tiene jacuzzi privado?', last_at: '2026-05-13T18:33:00Z', source: 'Facebook Ads', city: 'Tampa' },
  { id: 'l28', name: 'Manuela Echeverri', phone: '+1305551028', email: 'mecheverri@hotmail.com', stage: 'interesado', score: 61, agent: 'María García', service: 'apto-2h-vista', amount: null, last_msg: 'Quiero ver el modelo', last_at: '2026-05-13T15:55:00Z', source: 'Web', city: 'Miami' },
  { id: 'l29', name: 'Ricardo Builes', phone: '+1305551029', email: 'rbuiles@gmail.com', stage: 'interesado', score: 59, agent: 'Juan Martínez', service: 'estudio-economico', amount: null, last_msg: 'Para alquilar por Airbnb', last_at: '2026-05-13T13:22:00Z', source: 'Instagram Ads', city: 'Miami' },
  { id: 'l30', name: 'Andrea Galindo', phone: '+1305551030', email: 'agalindo@outlook.com', stage: 'interesado', score: 64, agent: 'Laura Pérez', service: 'apto-3h-premium', amount: null, last_msg: '¿Hay descuento por pago de contado?', last_at: '2026-05-13T11:48:00Z', source: 'Referido', city: 'Orlando' },
  { id: 'l31', name: 'Cristian Lopera', phone: '+1305551031', email: 'clopera@yahoo.com', stage: 'interesado', score: 56, agent: 'María García', service: 'apto-2h-vista', amount: null, last_msg: 'Excelente proyecto', last_at: '2026-05-13T09:10:00Z', source: 'Facebook Ads', city: 'Tampa' },
  { id: 'l32', name: 'Carolina Tobón', phone: '+1305551032', email: 'ctobon@gmail.com', stage: 'interesado', score: 67, agent: 'Juan Martínez', service: 'apto-3h-premium', amount: null, last_msg: 'Me interesa, dame info', last_at: '2026-05-13T07:38:00Z', source: 'Instagram Ads', city: 'Miami' },
  // Nuevo (8)
  { id: 'l33', name: 'Felipe Naranjo', phone: '+1305551033', email: 'fnaranjo@gmail.com', stage: 'nuevo', score: 40, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Hola, vi su anuncio', last_at: '2026-05-14T09:58:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l34', name: 'Gabriela Estrada', phone: '+1305551034', email: '', stage: 'nuevo', score: 35, agent: 'Sin asignar', service: null, amount: null, last_msg: '¿Tienen aptos disponibles?', last_at: '2026-05-14T09:52:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l35', name: 'Mauricio Zapata', phone: '+1305551035', email: '', stage: 'nuevo', score: 42, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Buenos días', last_at: '2026-05-14T09:48:00Z', source: 'Web', city: 'Tampa' },
  { id: 'l36', name: 'Lina Botero', phone: '+1305551036', email: '', stage: 'nuevo', score: 38, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Hola', last_at: '2026-05-14T09:45:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l37', name: 'Óscar Pineda', phone: '+1305551037', email: '', stage: 'nuevo', score: 33, agent: 'Sin asignar', service: null, amount: null, last_msg: '¿Información?', last_at: '2026-05-14T09:40:00Z', source: 'Referido', city: 'Miami' },
  { id: 'l38', name: 'Tatiana Acevedo', phone: '+1305551038', email: '', stage: 'nuevo', score: 45, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Vi el anuncio en Instagram', last_at: '2026-05-14T09:35:00Z', source: 'Instagram Ads', city: 'Orlando' },
  { id: 'l39', name: 'Fernando Ríos', phone: '+1305551039', email: '', stage: 'nuevo', score: 36, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Me llaman?', last_at: '2026-05-14T09:30:00Z', source: 'Facebook Ads', city: 'Miami' },
  { id: 'l40', name: 'Pilar Cano', phone: '+1305551040', email: '', stage: 'nuevo', score: 41, agent: 'Sin asignar', service: null, amount: null, last_msg: 'Quiero saber precios', last_at: '2026-05-14T09:25:00Z', source: 'Web', city: 'Tampa' },
];
// Conversaciones activas (8 — algunas con bot, otras con humano)
export const MOCK_CONVERSATIONS = [
  {
    id: 'c1', lead_id: 'l13', name: 'Javier Restrepo', phone: '+1305551013',
    flow_state: 'PAUSED_FOR_HUMAN', assigned_agent: 'María García',
    unread: 2, last_at: '2026-05-14T08:15:00Z',
    messages: [
      { from: 'user', text: 'Hola, vi el anuncio del apto 3H', at: '2026-05-14T07:55:00Z' },
      { from: 'bot', text: '¡Hola Javier! 😊 Te cuento sobre el Apto 3H Premium: 95 m², vista al parque, desde $185,000 USD. ¿Te envío el brochure?', at: '2026-05-14T07:55:30Z' },
      { from: 'user', text: 'Sí, mándamelo', at: '2026-05-14T07:56:00Z' },
      { from: 'bot', text: '✅ Brochure enviado. ¿Te interesa agendar una visita guiada?', at: '2026-05-14T07:56:20Z' },
      { from: 'user', text: 'Necesito hablar con un asesor', at: '2026-05-14T08:00:00Z' },
      { from: 'agent', text: 'Hola Javier, soy María. Cuéntame qué dudas tienes 🙂', at: '2026-05-14T08:01:00Z', agent_name: 'María García' },
      { from: 'user', text: 'Necesito revisarlo con mi esposa, te confirmo mañana', at: '2026-05-14T08:15:00Z' },
    ],
  },
  {
    id: 'c2', lead_id: 'l21', name: 'Mateo Jiménez', phone: '+1305551021',
    flow_state: 'CHAT_MODE', assigned_agent: null,
    unread: 0, last_at: '2026-05-14T09:55:00Z',
    messages: [
      { from: 'user', text: 'Hola, me interesa el proyecto Aurora', at: '2026-05-14T09:50:00Z' },
      { from: 'bot', text: '¡Bienvenido Mateo! 🏢 Aurora Park tiene 4 tipos de unidades. ¿Cuál te interesa más: 2H, 3H, Penthouse o Comercial?', at: '2026-05-14T09:50:30Z' },
      { from: 'user', text: '2H', at: '2026-05-14T09:51:00Z' },
      { from: 'bot', text: 'Excelente elección 🎯 El Apto 2H Vista Panorámica tiene 62 m², vista al lago, desde $145,000 USD. ¿Cuándo entregan?', at: '2026-05-14T09:51:30Z' },
      { from: 'user', text: '¿Cuándo entregan?', at: '2026-05-14T09:55:00Z' },
      { from: 'bot', text: 'Entrega en marzo 2027 🏗️ Quedan solo 8 unidades disponibles. ¿Te genero el link de reserva ($14,500 USD para apartar)?', at: '2026-05-14T09:55:20Z' },
    ],
  },
  {
    id: 'c3', lead_id: 'l33', name: 'Felipe Naranjo', phone: '+1305551033',
    flow_state: 'CHAT_MODE', assigned_agent: null,
    unread: 1, last_at: '2026-05-14T09:58:00Z',
    messages: [
      { from: 'user', text: 'Hola, vi su anuncio', at: '2026-05-14T09:58:00Z' },
      { from: 'bot', text: '¡Hola Felipe! 👋 Soy el asistente de Inmobiliaria Aurora. ¿Te cuento sobre el proyecto Aurora Park o tienes alguna pregunta específica?', at: '2026-05-14T09:58:15Z' },
    ],
  },
  {
    id: 'c4', lead_id: 'l1', name: 'Carlos Méndez', phone: '+1305551001',
    flow_state: 'CHAT_MODE', assigned_agent: null,
    unread: 0, last_at: '2026-05-13T18:22:00Z',
    messages: [
      { from: 'user', text: 'Hola, ¿cuándo es la entrega?', at: '2026-05-13T18:00:00Z' },
      { from: 'bot', text: '¡Hola Carlos! Tu Apto 3H Premium se entrega en marzo 2027. Te enviaremos updates mensuales del avance de obra 🏗️', at: '2026-05-13T18:00:20Z' },
      { from: 'user', text: 'Perfecto', at: '2026-05-13T18:15:00Z' },
      { from: 'user', text: 'Gracias por todo, el departamento es hermoso', at: '2026-05-13T18:22:00Z' },
    ],
  },
  {
    id: 'c5', lead_id: 'l14', name: 'Mariana Quintero', phone: '+1305551014',
    flow_state: 'PAUSED_FOR_HUMAN', assigned_agent: 'Juan Martínez',
    unread: 1, last_at: '2026-05-14T07:42:00Z',
    messages: [
      { from: 'user', text: 'Me interesa el penthouse', at: '2026-05-14T07:30:00Z' },
      { from: 'bot', text: '¡Excelente elección Mariana! 🌇 El Penthouse Doble Altura tiene 180 m², terraza privada con jacuzzi, desde $320,000 USD. ¿Te agendo visita?', at: '2026-05-14T07:30:30Z' },
      { from: 'user', text: '¿Hay opción de financiación a 10 años?', at: '2026-05-14T07:42:00Z' },
      { from: 'bot', text: 'Te conecto con un asesor especializado en financiación 🙋‍♂️', at: '2026-05-14T07:42:30Z' },
    ],
  },
  {
    id: 'c6', lead_id: 'l24', name: 'Sara Bedoya', phone: '+1305551024',
    flow_state: 'CHAT_MODE', assigned_agent: null,
    unread: 0, last_at: '2026-05-14T07:15:00Z',
    messages: [
      { from: 'user', text: 'Mándame fotos del baño y la cocina', at: '2026-05-14T07:15:00Z' },
      { from: 'bot', text: '¡Claro Sara! 📸 Aquí van 4 fotos del Apto 2H que te interesa. Cocina con isla central, baño principal con bañera. ¿Te gusta?', at: '2026-05-14T07:15:30Z' },
    ],
  },
  {
    id: 'c7', lead_id: 'l34', name: 'Gabriela Estrada', phone: '+1305551034',
    flow_state: 'AWAITING_CHANNEL_CHOICE', assigned_agent: null,
    unread: 1, last_at: '2026-05-14T09:52:00Z',
    messages: [
      { from: 'user', text: '¿Tienen aptos disponibles?', at: '2026-05-14T09:52:00Z' },
      { from: 'bot', text: '¡Hola Gabriela! 👋 Sí, tenemos varias unidades. ¿Prefieres que te atienda nuestro asistente IA o un asesor humano?', at: '2026-05-14T09:52:20Z' },
    ],
  },
  {
    id: 'c8', lead_id: 'l16', name: 'Natalia Vélez', phone: '+1305551016',
    flow_state: 'CHAT_MODE', assigned_agent: null,
    unread: 0, last_at: '2026-05-13T19:33:00Z',
    messages: [
      { from: 'user', text: 'Estoy entre el 3H y el penthouse', at: '2026-05-13T19:33:00Z' },
      { from: 'bot', text: 'Te ayudo a decidir Natalia 🎯 Diferencias clave:\n• 3H Premium: 95 m², $185k, vista parque\n• Penthouse: 180 m², $320k, terraza privada + jacuzzi\n¿Cuántas personas viven contigo?', at: '2026-05-13T19:33:30Z' },
    ],
  },
];
// Citas próximas (12)
export const MOCK_APPOINTMENTS = [
  { id: 'ap1', lead_id: 'l13', name: 'Javier Restrepo', service: 'Visita guiada Apto 3H', date: '2026-05-15', hour: 10, duration: 1, status: 'AGENDADO' },
  { id: 'ap2', lead_id: 'l14', name: 'Mariana Quintero', service: 'Visita Penthouse', date: '2026-05-15', hour: 14, duration: 2, status: 'AGENDADO' },
  { id: 'ap3', lead_id: 'l21', name: 'Mateo Jiménez', service: 'Visita Apto 2H', date: '2026-05-16', hour: 11, duration: 1, status: 'AGENDADO' },
  { id: 'ap4', lead_id: 'l24', name: 'Sara Bedoya', service: 'Visita Apto 2H + cocina', date: '2026-05-16', hour: 16, duration: 1, status: 'AGENDADO' },
  { id: 'ap5', lead_id: 'l16', name: 'Natalia Vélez', service: 'Tour Premium + Penthouse', date: '2026-05-17', hour: 10, duration: 2, status: 'AGENDADO' },
  { id: 'ap6', lead_id: 'l25', name: 'Alejandro Rojas', service: 'Visita Local Comercial', date: '2026-05-17', hour: 15, duration: 1, status: 'AGENDADO' },
  { id: 'ap7', lead_id: 'l26', name: 'Verónica Salazar', service: 'Visita Apto 3H', date: '2026-05-18', hour: 11, duration: 1, status: 'AGENDADO' },
  { id: 'ap8', lead_id: 'l30', name: 'Andrea Galindo', service: 'Visita Apto 3H', date: '2026-05-18', hour: 14, duration: 1, status: 'AGENDADO' },
  { id: 'ap9', lead_id: 'l32', name: 'Carolina Tobón', service: 'Visita Apto 3H', date: '2026-05-19', hour: 10, duration: 1, status: 'AGENDADO' },
  { id: 'ap10', lead_id: 'l20', name: 'Daniela Cardona', service: 'Visita Apto 3H', date: '2026-05-19', hour: 16, duration: 1, status: 'AGENDADO' },
  { id: 'ap11', lead_id: 'l19', name: 'Tomás Aristizábal', service: 'Visita Apto 2H', date: '2026-05-20', hour: 11, duration: 1, status: 'AGENDADO' },
  { id: 'ap12', lead_id: 'l27', name: 'Iván Posada', service: 'Tour Penthouse + jacuzzi', date: '2026-05-20', hour: 14, duration: 2, status: 'AGENDADO' },
];
// Pagos (los 12 cerrado_ganado + 2 pendientes)
export const MOCK_PAYMENTS = [
  ...MOCK_LEADS.filter(l => l.stage === 'cerrado_ganado').map(l => ({
    id: `pay_${l.id}`,
    phone: l.phone,
    name: l.name,
    service: MOCK_SERVICES.find(s => s.slug === l.service)?.name || l.service,
    amount: l.amount || 0,
    currency: 'USD',
    status: 'PAGADO',
    paid_at: l.last_at,
    gateway: 'Tarjeta',
    reference: `AURORA_${l.phone.slice(-4)}_${Math.floor(Date.now() / 1000)}`,
  })),
  {
    id: 'pay_p1', phone: '+1305551013', name: 'Javier Restrepo',
    service: 'Apto 3H Premium', amount: 18500, currency: 'USD',
    status: 'PENDIENTE', paid_at: null, gateway: 'Tarjeta',
    reference: 'AURORA_1013_1778649000',
  },
  {
    id: 'pay_p2', phone: '+1305551014', name: 'Mariana Quintero',
    service: 'Penthouse Doble Altura', amount: 32000, currency: 'USD',
    status: 'PENDIENTE', paid_at: null, gateway: 'Tarjeta',
    reference: 'AURORA_1014_1778649100',
  },
];
// Campañas Facebook Ads (3 activas)
export const MOCK_ADS_CAMPAIGNS = [
  {
    id: 'cmp1',
    name: 'Aurora Park — Fase 2 Lanzamiento',
    status: 'ACTIVE',
    objective: 'CONVERSATIONS',
    budget_daily: 100,
    currency: 'USD',
    spend_total: 2800,
    impressions: 124800,
    clicks: 3120,
    ctr: 2.5,
    cpm: 22.43,
    leads: 48,
    cpl: 58.33,
    sales: 12,
    cps: 233.33,
    revenue: 1740000,
    roas: 621,
    image: '🏢',
    primary_text: '¿Buscas el hogar de tus sueños en Miami? Aurora Park: apartamentos con vista al lago, desde $145,000 USD. Cupos limitados.',
    headline: 'Aurora Park — Tu nuevo hogar',
    cta: 'WhatsApp',
    age_min: 28, age_max: 55,
    cities: ['Miami', 'Orlando', 'Tampa'],
    interests: ['Bienes raíces', 'Inversión inmobiliaria', 'Apartamentos'],
    creatives: [
      { id: 'cr1', name: 'Hook escasez', ctr: 3.8, cpl: 42, impressions: 45200, status: 'ACTIVE', is_winner: true },
      { id: 'cr2', name: 'Hook beneficio', ctr: 2.4, cpl: 65, impressions: 38500, status: 'ACTIVE' },
      { id: 'cr3', name: 'Hook social proof', ctr: 2.1, cpl: 72, impressions: 41100, status: 'ACTIVE' },
    ],
  },
  {
    id: 'cmp2',
    name: 'Inversionistas — Estudio + Local',
    status: 'ACTIVE',
    objective: 'CONVERSATIONS',
    budget_daily: 60,
    currency: 'USD',
    spend_total: 1450,
    impressions: 68200,
    clicks: 1840,
    ctr: 2.7,
    cpm: 21.26,
    leads: 28,
    cpl: 51.79,
    sales: 4,
    cps: 362.50,
    revenue: 326000,
    roas: 224,
    image: '💼',
    primary_text: 'Inversión inmobiliaria en USA con ROI 8-12% anual. Estudio desde $68k o Local Comercial desde $95k. Financiación disponible.',
    headline: 'Invierte en Miami',
    cta: 'WhatsApp',
    age_min: 35, age_max: 60,
    cities: ['Miami', 'New York', 'Los Angeles'],
    interests: ['Inversiones', 'Real Estate Investment', 'ROI'],
    creatives: [
      { id: 'cr4', name: 'Hook ROI', ctr: 3.2, cpl: 45, impressions: 32400, status: 'ACTIVE', is_winner: true },
      { id: 'cr5', name: 'Hook financiación', ctr: 2.3, cpl: 58, impressions: 35800, status: 'ACTIVE' },
    ],
  },
  {
    id: 'cmp3',
    name: 'Penthouse — Audiencia Premium',
    status: 'ACTIVE',
    objective: 'CONVERSATIONS',
    budget_daily: 40,
    currency: 'USD',
    spend_total: 920,
    impressions: 28400,
    clicks: 540,
    ctr: 1.9,
    cpm: 32.39,
    leads: 8,
    cpl: 115,
    sales: 2,
    cps: 460,
    revenue: 640000,
    roas: 696,
    image: '🌇',
    primary_text: 'Penthouse de lujo con terraza privada y jacuzzi. Solo 2 unidades disponibles. $320,000 USD. Vive como mereces.',
    headline: 'Penthouse exclusivo',
    cta: 'WhatsApp',
    age_min: 40, age_max: 65,
    cities: ['Miami Beach', 'Coral Gables'],
    interests: ['Lujo', 'High net worth', 'Premium real estate'],
    creatives: [
      { id: 'cr6', name: 'Hook exclusividad', ctr: 2.1, cpl: 98, impressions: 14200, status: 'ACTIVE', is_winner: true },
      { id: 'cr7', name: 'Hook lifestyle', ctr: 1.7, cpl: 132, impressions: 14200, status: 'ACTIVE' },
    ],
  },
];
// Recomendaciones IA del cron Ads
export const MOCK_ADS_RECOMMENDATIONS = [
  {
    id: 'rec1', campaign_id: 'cmp1', type: 'SCALE',
    title: 'Escalar Aurora Park — Fase 2',
    desc: 'ROAS 621% con CPL estable ($58). Recomendamos aumentar presupuesto +25% para capturar más leads sin comprometer eficiencia.',
    impact_estimate: '+12 leads/día',
    confidence: 88,
    icon: '🟢',
  },
  {
    id: 'rec2', campaign_id: 'cmp3', type: 'REFRESH_CREATIVE',
    title: 'Refrescar creatives Penthouse',
    desc: 'CTR cayó 32% en los últimos 7 días (1.9% vs 2.8% inicial). Es momento de generar variantes nuevas del hook ganador.',
    impact_estimate: 'Recuperar CTR a ~2.5%',
    confidence: 76,
    icon: '🔄',
  },
  {
    id: 'rec3', campaign_id: 'cmp2', type: 'AB_TEST',
    title: 'A/B test Inversionistas',
    desc: 'Hook ROI tiene CPL 22% más bajo que Hook financiación. Recomendamos pausar el segundo y duplicar presupuesto del primero.',
    impact_estimate: '-$15 CPL promedio',
    confidence: 82,
    icon: '📊',
  },
];
// Métricas globales del dashboard
export const MOCK_ANALYTICS = {
  total_leads: 40,
  paid_count: 12,
  scheduled_count: 12,
  total_revenue: 2147000,
  conversion_rate: 30,
  avg_response_time_sec: 52,
  active_conversations: 8,
  paused_for_human: 3,
  leads_by_status: {
    'Cerrado ganado': 12,
    'Negociación': 8,
    'Interesado': 12,
    'Nuevo': 8,
  },
  top_services: [
    { service: 'Apto 2H Vista Panorámica', count: 6, revenue: 870000 },
    { service: 'Apto 3H Premium', count: 4, revenue: 740000 },
    { service: 'Penthouse Doble Altura', count: 1, revenue: 320000 },
    { service: 'Local Comercial', count: 2, revenue: 190000 },
    { service: 'Estudio Económico', count: 1, revenue: 68000 },
  ],
  revenue_last_30d: [
    { date: '2026-04-15', value: 0 }, { date: '2026-04-18', value: 145000 },
    { date: '2026-04-22', value: 95000 }, { date: '2026-04-26', value: 185000 },
    { date: '2026-04-29', value: 0 }, { date: '2026-05-03', value: 145000 },
    { date: '2026-05-04', value: 95000 }, { date: '2026-05-05', value: 145000 },
    { date: '2026-05-06', value: 185000 }, { date: '2026-05-07', value: 145000 },
    { date: '2026-05-08', value: 68000 }, { date: '2026-05-09', value: 185000 },
    { date: '2026-05-10', value: 95000 }, { date: '2026-05-11', value: 145000 },
    { date: '2026-05-12', value: 320000 }, { date: '2026-05-13', value: 185000 },
  ],
};
// Memoria IA aprendida
export const MOCK_MEMORY_ENTRIES = [
  { id: 'm1', question: 'cuando entregan los apartamentos', answer: 'Entrega programada para marzo 2027. Te enviaremos updates mensuales del avance de obra 🏗️', source: 'human_agent', hit_count: 28, last_used: '2026-05-14T08:55:00Z' },
  { id: 'm2', question: 'precio apto 2h vista', answer: 'El Apto 2H Vista Panorámica tiene 62 m², vista al lago, desde $145,000 USD. Quedan 8 unidades disponibles.', source: 'gemini:conversational', hit_count: 42, last_used: '2026-05-14T09:51:00Z' },
  { id: 'm3', question: 'precio penthouse', answer: 'El Penthouse Doble Altura tiene 180 m², terraza privada con jacuzzi, desde $320,000 USD. Solo quedan 2 unidades 🌇', source: 'gemini:catalog_button', hit_count: 18, last_used: '2026-05-14T07:30:00Z' },
  { id: 'm4', question: 'financiacion', answer: 'Tenemos financiación con bancos aliados a 10, 15 y 20 años. Cuota inicial desde 10%. ¿Te conecto con un asesor de financiación?', source: 'human_agent', hit_count: 24, last_used: '2026-05-14T07:42:00Z' },
  { id: 'm5', question: 'incluye parqueadero', answer: 'Sí, todas las unidades incluyen 1 parqueadero. Penthouse incluye 2 parqueaderos + bodega.', source: 'gemini:conversational', hit_count: 15, last_used: '2026-05-13T16:48:00Z' },
  { id: 'm6', question: 'descuento pago contado', answer: 'Sí, ofrecemos 5% de descuento por pago de contado total. Aplica también descuentos por separación temprana.', source: 'human_agent', hit_count: 9, last_used: '2026-05-13T11:48:00Z' },
  { id: 'm7', question: 'permite restaurante local comercial', answer: 'Sí, el Local Comercial 80 m² está zonificado para gastronomía, retail y servicios. Tiene salida de humos preparada.', source: 'gemini:ad_greeting', hit_count: 6, last_used: '2026-05-13T23:42:00Z' },
  { id: 'm8', question: 'jacuzzi privado', answer: '¡Sí! El Penthouse Doble Altura tiene jacuzzi privado en la terraza, con vista panorámica al lago 🌅', source: 'gemini:conversational', hit_count: 11, last_used: '2026-05-13T18:33:00Z' },
];
// Plantillas WhatsApp aprobadas
export const MOCK_TEMPLATES = [
  { id: 't1', name: 'bienvenida_aurora_v1', category: 'UTILITY', language: 'es', status: 'APPROVED', body: '¡Hola {{1}}! 👋 Gracias por tu interés en Aurora Park. Soy el asistente virtual de Inmobiliaria Aurora. ¿En qué puedo ayudarte hoy?' },
  { id: 't2', name: 'recordatorio_visita_v1', category: 'UTILITY', language: 'es', status: 'APPROVED', body: 'Hola {{1}}, te recordamos tu visita guiada de Aurora Park mañana a las {{2}}. Dirección: 1234 Aurora Ave, Miami. ¿Confirmas? ✅' },
  { id: 't3', name: 'confirmacion_pago_v1', category: 'UTILITY', language: 'es', status: 'APPROVED', body: '✅ ¡Pago confirmado, {{1}}! Tu separación del {{2}} por ${{3}} USD ha sido procesada. Te enviaremos los documentos por email en las próximas 24h.' },
  { id: 't4', name: 'campaña_inversionistas_v1', category: 'MARKETING', language: 'es', status: 'APPROVED', body: '🏙️ Hola {{1}}, en Inmobiliaria Aurora tenemos oportunidades de inversión con ROI 8-12% anual. ¿Te envío el dossier?' },
  { id: 't5', name: 'seguimiento_lead_v1', category: 'MARKETING', language: 'es', status: 'PENDING', body: 'Hola {{1}}, hace unos días estuviste interesado en {{2}}. ¿Tienes alguna duda? Estamos aquí para ayudarte 🙂' },
];
// Campañas Bulk Send enviadas
export const MOCK_CAMPAIGNS = [
  { id: 'bc1', name: 'Recordatorio Marzo Open House', template: 'campaña_inversionistas_v1', filter: 'tag:inversionista', sent: 248, delivered: 245, read: 198, replied: 42, converted: 6, cost_usd: 2.97, status: 'COMPLETED', sent_at: '2026-05-12T14:00:00Z' },
  { id: 'bc2', name: 'Penthouse — Lista VIP', template: 'campaña_inversionistas_v1', filter: 'score>70', sent: 64, delivered: 64, read: 58, replied: 12, converted: 1, cost_usd: 0.77, status: 'COMPLETED', sent_at: '2026-05-08T10:30:00Z' },
  { id: 'bc3', name: 'Reactivación leads fríos abril', template: 'seguimiento_lead_v1', filter: 'inactividad>30d', sent: 412, delivered: 408, read: 285, replied: 67, converted: 4, cost_usd: 4.94, status: 'COMPLETED', sent_at: '2026-04-28T16:00:00Z' },
];
// Recordatorios pendientes (campanita del header)
export const MOCK_REMINDERS = [
  { id: 'r1', customer_name: 'Javier Restrepo', text: 'Llamar a confirmar visita penthouse', remind_at: 1778742000, overdue: false },
  { id: 'r2', customer_name: 'Mariana Quintero', text: 'Enviar simulador de crédito', remind_at: 1778738400, overdue: true },
  { id: 'r3', customer_name: 'Sara Bedoya', text: 'Compartir video tour 360°', remind_at: 1778821200, overdue: false },
];
// Helpers para componentes
export const stageColors: Record<string, string> = {
  'nuevo': 'bg-slate-500/20 text-slate-300',
  'interesado': 'bg-sky-500/20 text-sky-300',
  'negociacion': 'bg-amber-500/20 text-amber-300',
  'cerrado_ganado': 'bg-emerald-500/20 text-emerald-300',
};
export const stageLabels: Record<string, string> = {
  'nuevo': '🆕 Nuevo',
  'interesado': '🔥 Interesado',
  'negociacion': '🤝 Negociación',
  'cerrado_ganado': '✅ Ganado',
};
export const stageOrder = ['nuevo', 'interesado', 'negociacion', 'cerrado_ganado'];
export function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}