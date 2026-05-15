'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../providers';
import Link from 'next/link';
import * as XLSX from 'xlsx';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// Diccionario de labels humanos para plantillas conocidas (auto-creadas por el sistema).
// Si una plantilla no está aquí, se muestra su nombre técnico como fallback.
const TEMPLATE_LABELS: Record<string, { title: string; emoji: string; desc: string; useCase: string }> = {
  appointment_reminder_v1: {
    title: 'Recordatorio de cita',
    emoji: '📅',
    desc: 'Recuerda al cliente la fecha y hora de su próxima cita.',
    useCase: 'Ideal para enviar 24h o 1h antes de la cita agendada.',
  },
  follow_up_v1: {
    title: 'Seguimiento comercial',
    emoji: '💬',
    desc: 'Reactiva leads que mostraron interés pero no completaron la compra.',
    useCase: 'Ideal para leads inactivos +7 días o que abandonaron el pago.',
  },
};
// Devuelve el label humano de una plantilla (o el nombre técnico si no está mapeada).
const humanizeTemplate = (t: any) => {
  // Carruseles: emoji especial + label del cliente + count de cards
  if (t.is_carousel || t.type === 'carousel') {
    const label = t.label || t.template_name;
    const pretty = label
      .replace(/_v\d+$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return `🎠 ${pretty} (${t.card_count || 0} productos)`;
  }
  const meta = TEMPLATE_LABELS[t.template_name];
  if (meta) return `${meta.emoji} ${meta.title}`;
  // Fallback: capitaliza el nombre técnico (snake_case → Title Case)
  const pretty = t.template_name
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
  const icon = t.category === 'MARKETING' ? '📢' : '🔧';
  return `${icon} ${pretty}`;
};
export default function MarketingPage() {
  const { user } = useAuth();
  const h = { 'client-id': user?.companyId || '' };
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [quota, setQuota] = useState<any>({});
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 5000); };
  const [form, setForm] = useState({
    template_name: '',
    language: 'es',
    filters: { lead_stage: [] as string[], tags: [] as string[], days_inactive: 0, service: '' },
    param_field_map: {} as Record<string, string>,
    confirmed: false,
    selected_phones: [] as string[],  // Selección manual de leads del CRM
    selection_mode: 'filter' as 'filter' | 'manual' | 'external',
    // Modo external: lista no guardada en CRM
    external_raw: '',         // Textarea del modo "pegar"
    external_parsed: [] as Array<{phone: string; name?: string; service?: string}>,  // Parsed unificado (pegar + import)
    external_file_name: '',   // Nombre del archivo importado (UI feedback)
  });
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/templates/list`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/marketing/campaigns`, { headers: h }).then(r => r.json()),
      fetch(`${API_URL}/leads`, { headers: h }).then(r => r.json()),
    ]).then(([tpl, camp, ld]) => {
      setTemplates((tpl.templates || []).filter((t: any) => t.status === 'APPROVED'));
      setCampaigns(camp.campaigns || []);
      setQuota(camp.quota || {});
      setLeads(ld.leads || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  // Filtrar leads según filtros seleccionados (usado como pre-filtro en ambos modos)
  const filteredLeads = leads.filter(l => {
    const phone = l.contact_id || l.phoneNumber || '';
    if (!phone || phone.startsWith('demo_')) return false;
    if (form.filters.lead_stage.length > 0 && !form.filters.lead_stage.includes(l.lead_stage || 'nuevo')) return false;
    if (form.filters.tags.length > 0 && !(l.tags || []).some((t: string) => form.filters.tags.includes(t))) return false;
    if (form.filters.service && (l.service_of_interest || '').toLowerCase() !== form.filters.service.toLowerCase()) return false;
    if (form.filters.days_inactive > 0) {
      const last = Number(l.last_updated || 0);
      if (last && (Date.now() / 1000 - last) < form.filters.days_inactive * 86400) return false;
    }
    return true;
  });
  // Destinatarios efectivos según el modo
  const effectiveRecipients = useMemo(() => {
    if (form.selection_mode === 'manual') {
      return leads.filter(l => form.selected_phones.includes(l.contact_id || l.phoneNumber || ''));
    }
    if (form.selection_mode === 'external') {
      // Adaptar al formato de leads para que fieldMissingReport y preview funcionen
      return form.external_parsed.map(e => ({
        contact_id: e.phone,
        phoneNumber: e.phone,
        customer_name: e.name || '',
        service_of_interest: e.service || '',
      }));
    }
    return filteredLeads;
  }, [form.selection_mode, form.selected_phones, form.external_parsed, leads, filteredLeads]);
  // Parser de texto pegado: cada línea = phone[,name][,service]
  const parseRawText = (raw: string): Array<{phone: string; name?: string; service?: string; valid: boolean; error?: string}> => {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      const rawPhone = parts[0] || '';
      // Normalizar: solo dígitos y +
      const phone = rawPhone.replace(/[^\d+]/g, '');
      const digitsOnly = phone.replace(/\+/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { phone: rawPhone, valid: false, error: 'Número inválido (debe tener 10-15 dígitos)' };
      }
      return {
        phone: digitsOnly,
        name: parts[1] || undefined,
        service: parts[2] || undefined,
        valid: true,
      };
    });
  };
  const parsedRaw = useMemo(() => parseRawText(form.external_raw), [form.external_raw]);
  const validParsedRaw = parsedRaw.filter(p => p.valid);
  // Handler para subir CSV/Excel
  const handleFileImport = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
      const parsed: Array<{phone: string; name?: string; service?: string}> = [];
      let skippedHeader = false;
      for (const row of rows) {
        if (!row || !row.length) continue;
        const cells = (row as any[]).map(c => String(c || '').trim());
        const rawPhone = cells[0] || '';
        // Skip header row si la primera celda no parece teléfono
        if (!skippedHeader && /^(phone|telefono|teléfono|numero|número|celular|whatsapp)/i.test(rawPhone)) {
          skippedHeader = true;
          continue;
        }
        const phone = rawPhone.replace(/[^\d+]/g, '').replace(/\+/g, '');
        if (phone.length < 10 || phone.length > 15) continue;
        parsed.push({
          phone,
          name: cells[1] || undefined,
          service: cells[2] || undefined,
        });
      }
      if (parsed.length === 0) {
        showToast('⚠️ No se encontraron números válidos en el archivo');
        return;
      }
      setForm(f => ({ ...f, external_parsed: parsed, external_file_name: file.name, external_raw: '' }));
      showToast(`✅ ${parsed.length} números importados de ${file.name}`);
    } catch (e) {
      showToast('❌ Error leyendo el archivo (¿CSV o Excel válido?)');
    }
  };
  // Sincronizar external_parsed cuando se pega texto manualmente
  useEffect(() => {
    if (form.selection_mode === 'external' && form.external_raw && !form.external_file_name) {
      const valid = validParsedRaw.map(p => ({ phone: p.phone, name: p.name, service: p.service }));
      setForm(f => ({ ...f, external_parsed: valid }));
    }
  }, [form.external_raw, form.external_file_name, form.selection_mode]);
  // Descargar plantilla CSV
  const downloadTemplateCSV = () => {
    const csv = 'phone,name,service\n573001234567,Juan Perez,Seminario 9mm\n573009876543,Maria Lopez,\n573005551234,,';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_destinatarios.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  // Toggle individual de un teléfono
  const togglePhone = (phone: string) => setForm(f => ({
    ...f,
    selected_phones: f.selected_phones.includes(phone)
      ? f.selected_phones.filter(p => p !== phone)
      : [...f.selected_phones, phone],
  }));
  // Seleccionar/deseleccionar todos los filtrados
  const toggleAllFiltered = () => setForm(f => {
    const filteredPhones = filteredLeads.map(l => l.contact_id || l.phoneNumber || '').filter(Boolean);
    const allSelected = filteredPhones.every(p => f.selected_phones.includes(p));
    return {
      ...f,
      selected_phones: allSelected
        ? f.selected_phones.filter(p => !filteredPhones.includes(p))
        : [...new Set([...f.selected_phones, ...filteredPhones])],
    };
  });
  const selectedTpl = templates.find(t => t.template_name === form.template_name);
  // Prioridad: var_count del API (más confiable) → fallback a regex sobre body
  const varCount = selectedTpl?.var_count ?? ((selectedTpl?.body || '').match(/\{\{\d+\}\}/g)?.length || 0);
  // Validar que TODAS las variables estén mapeadas antes de permitir envío
  const allVarsMapped = !selectedTpl?.is_carousel && Array.from({ length: varCount }, (_: unknown, i: number) =>
    !!form.param_field_map[String(i + 1)]
  ).every(Boolean);
  // Detectar leads con campos vacíos en las variables mapeadas (transparencia pre-envío)
  // Devuelve un array de {var_num, field, missing_count, fallback}
  const FIELD_LABELS: Record<string, { label: string; fallback: string }> = {
    name: { label: 'Nombre', fallback: 'amigo' },
    service: { label: 'Servicio de interés', fallback: 'nuestro negocio' },
    email: { label: 'Email', fallback: 'tu correo' },
    phone: { label: 'Teléfono', fallback: 'tu número' },
    appointment_date: { label: 'Fecha de cita', fallback: 'tu cita' },
    appointment_time: { label: 'Hora de cita', fallback: 'el horario acordado' },
    appointment_location: { label: 'Lugar / Sede', fallback: 'nuestra ubicación' },
  };
  const fieldMissingReport = (() => {
    if (!selectedTpl || selectedTpl.is_carousel || varCount === 0) return [];
    const FIELD_MAP_TO_LEAD: Record<string, string[]> = {
      name: ['customer_name', 'customer_full_name', 'name'],
      service: ['service_of_interest', 'service'],
      email: ['customer_email', 'email'],
      phone: ['contact_id', 'phoneNumber'],
      appointment_date: ['scheduled_date', 'appointment_date'],
      appointment_time: ['scheduled_hour', 'appointment_time'],
      appointment_location: ['appointment_location'],
    };
    const report: Array<{ varNum: number; field: string; missing: number; total: number; label: string; fallback: string }> = [];
    for (let i = 1; i <= varCount; i++) {
      const field = form.param_field_map[String(i)];
      if (!field || field === 'custom_value') continue;
      const leadFields = FIELD_MAP_TO_LEAD[field] || [field];
      const missing = effectiveRecipients.filter((l: any) => {
        const val = leadFields.map((f: string) => l[f]).find((v: any) => v && String(v).trim());
        return !val;
      }).length;
      if (missing > 0) {
        const meta = FIELD_LABELS[field] || { label: field, fallback: '-' };
        report.push({ varNum: i, field, missing, total: effectiveRecipients.length, label: meta.label, fallback: meta.fallback });
      }
    }
    return report;
  })();
  // Preview con valores reales: reemplaza {{N}} con body_example[N-1]
  const bodyExample: string[] = selectedTpl?.body_example || [];
  const previewBody = (selectedTpl?.body || '').replace(/\{\{(\d+)\}\}/g, (_match: string, n: string) => {
    const idx = parseInt(n) - 1;
    return bodyExample[idx] ? `*${bodyExample[idx]}*` : `[var ${n}]`;
  });
  // Costo Meta por mensaje según tipo:
  // - UTILITY: ~$0.01 USD
  // - MARKETING texto: ~$0.025 USD
  // - MARKETING carrusel: ~$0.06 USD (más caro por la imagen + interactividad)
  const costPerMsg = selectedTpl?.is_carousel
    ? 0.06
    : selectedTpl?.category === 'MARKETING'
      ? 0.025
      : 0.01;
  const estimatedCost = effectiveRecipients.length * costPerMsg;
  const allTags = [...new Set(leads.flatMap(l => l.tags || []))];
  const allStages = ['nuevo', 'contactado', 'interesado', 'negociacion', 'cerrado_ganado', 'cerrado_perdido'];
  const allServices = [...new Set(leads.map(l => l.service_of_interest).filter(Boolean))];
  const handleSend = async () => {
    if (!form.template_name || effectiveRecipients.length === 0) return;
    if (!form.confirmed) { showToast('⚠️ Debes confirmar que entiendes los cargos de Meta'); return; }
    if (varCount > 0 && !allVarsMapped) {
      showToast('⚠️ Mapea TODAS las variables del template antes de enviar');
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const payload: any = {
        template_name: form.template_name,
        language: form.language,
        param_field_map: form.param_field_map,
      };
      // Modo external: lista no guardada en CRM (pegada o importada)
      if (form.selection_mode === 'external' && form.external_parsed.length > 0) {
        payload.phone_list = form.external_parsed.map(e => ({
          phone: e.phone,
          name: e.name || '',
          service: e.service || '',
        }));
      } else if (form.selection_mode === 'manual' && form.selected_phones.length > 0) {
        payload.phone_list = form.selected_phones;
      } else {
        payload.filters = {
          lead_stage: form.filters.lead_stage.length > 0 ? form.filters.lead_stage : undefined,
          tags: form.filters.tags.length > 0 ? form.filters.tags : undefined,
          days_inactive: form.filters.days_inactive || undefined,
          service: form.filters.service || undefined,
        };
      }
      const res = await fetch(`${API_URL}/marketing/send-bulk`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok) {
        showToast(`✅ Campaña enviada: ${data.sent} mensajes`);
        fetch(`${API_URL}/marketing/campaigns`, { headers: h }).then(r => r.json()).then(d => {
          setCampaigns(d.campaigns || []);
          setQuota(d.quota || {});
        });
      } else {
        showToast(`❌ ${data.error || 'Error enviando'}`);
      }
    } catch { showToast('Error de conexión'); }
    setSending(false);
  };
  const toggleStage = (s: string) => setForm(f => ({
    ...f, filters: { ...f.filters, lead_stage: f.filters.lead_stage.includes(s) ? f.filters.lead_stage.filter(x => x !== s) : [...f.filters.lead_stage, s] }
  }));
  const toggleTag = (t: string) => setForm(f => ({
    ...f, filters: { ...f.filters, tags: f.filters.tags.includes(t) ? f.filters.tags.filter(x => x !== t) : [...f.filters.tags, t] }
  }));
  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold">Campañas Marketing 📢</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">
            📊 {quota.used || 0}/{quota.limit === 'unlimited' ? '∞' : quota.limit || 100} envíos este mes
          </span>
          <Link href="/dashboard/templates/manage" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
            📝 Gestionar plantillas →
          </Link>
        </div>
      </div>
      {/* Banner costos */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-6">
        <p className="text-[10px] text-amber-300">
          ⚠️ Meta cobra cada mensaje a tu tarjeta de Facebook Business. UTILITY ~$0.01 USD/msg · MARKETING ~$0.025 USD/msg. clientes.bot no cobra comisión.
        </p>
      </div>
      {/* Nueva campaña */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-4">🚀 Nueva campaña</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Template selector */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Plantilla aprobada *</label>
            {templates.length === 0 ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                <p className="text-[10px] text-red-400">No tienes plantillas aprobadas. <Link href="/dashboard/templates/manage" className="text-indigo-400 underline">Crear una →</Link></p>
              </div>
            ) : (
              <select value={form.template_name} onChange={(e) => setForm({ ...form, template_name: e.target.value })}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-white">
                <option value="">— Seleccionar plantilla —</option>
                {templates.map(t => (
                  <option key={t.template_name} value={t.template_name}>
                    {humanizeTemplate(t)}
                  </option>
                ))}
              </select>
            )}
            {selectedTpl && (
              <div className="mt-2 space-y-2">
                {/* Card descriptiva — qué es y cuándo usarla */}
                {selectedTpl.is_carousel ? (
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-[11px] font-bold text-purple-300 mb-1">
                      🎠 Carrusel de productos
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      Muestra tu catálogo completo de forma visual e interactiva. El cliente ve {selectedTpl.card_count || 0} productos con foto, precio y botones para reservar o pedir info.
                    </p>
                    <p className="text-[10px] text-purple-300/80 mt-1.5 italic">
                      💡 Ideal para reactivar leads inactivos mostrándoles toda tu oferta de un solo mensaje. <span className="text-purple-300 font-bold">Lo último en tecnología WhatsApp.</span>
                    </p>
                  </div>
                ) : TEMPLATE_LABELS[selectedTpl.template_name] && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3">
                    <p className="text-[11px] font-bold text-indigo-300 mb-1">
                      {TEMPLATE_LABELS[selectedTpl.template_name].emoji}{' '}
                      {TEMPLATE_LABELS[selectedTpl.template_name].title}
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      {TEMPLATE_LABELS[selectedTpl.template_name].desc}
                    </p>
                    <p className="text-[10px] text-indigo-300/80 mt-1.5 italic">
                      💡 {TEMPLATE_LABELS[selectedTpl.template_name].useCase}
                    </p>
                  </div>
                )}
                {/* Preview WhatsApp REAL del mensaje (con valores ejemplo en negrita) */}
                {selectedTpl?.body && !selectedTpl.is_carousel && (
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">
                      📱 Vista previa WhatsApp {varCount > 0 && `(con datos de ejemplo)`}
                    </p>
                    <div className="bg-[#0B3D2E] rounded-lg p-3 border-l-4 border-emerald-500/50">
                      <p className="text-[11px] text-white whitespace-pre-wrap leading-relaxed">
                        {previewBody.split(/(\*[^*]+\*)/).map((part: string, idx: number) =>
                          part.startsWith('*') && part.endsWith('*') ? (
                            <span key={idx} className="bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">
                              {part.slice(1, -1)}
                            </span>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        )}
                      </p>
                    </div>
                    {varCount > 0 && (
                      <p className="text-[9px] text-gray-500 mt-1 italic">
                        Las partes <span className="text-emerald-400 font-bold">resaltadas</span> se reemplazan automáticamente con los datos de cada lead.
                      </p>
                    )}
                  </div>
                )}
                {/* Preview especial del carrusel */}
                {selectedTpl.is_carousel && (
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Vista previa del carrusel</p>
                    <div className="bg-[#0B3D2E] rounded-lg p-3 flex gap-1.5 overflow-x-auto">
                      {Array.from({ length: Math.min(selectedTpl.card_count || 0, 5) }).map((_: unknown, i: number) => (
                        <div key={i} className="shrink-0 w-16 h-20 bg-white/10 rounded border border-white/20 flex flex-col items-center justify-center">
                          <span className="text-[8px] text-white/40">🖼️</span>
                          <span className="text-[7px] text-white/30 mt-1">Card {i+1}</span>
                        </div>
                      ))}
                      {(selectedTpl.card_count || 0) > 5 && (
                        <div className="shrink-0 w-16 h-20 flex items-center justify-center text-[9px] text-white/40">
                          +{(selectedTpl.card_count || 0) - 5} más
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Badge de categoría — explica el costo */}
                <p className="text-[9px] text-gray-500">
                  {selectedTpl.is_carousel
                    ? '🎠 Carrusel Marketing (~$0.06 USD/msg) · Premium'
                    : selectedTpl.category === 'MARKETING'
                      ? '📢 Categoría: Marketing (~$0.025 USD/msg)'
                      : '🔧 Categoría: Utilitaria (~$0.01 USD/msg)'}{' '}
                  · Idioma: {selectedTpl.language}
                </p>
              </div>
            )}
          </div>
          {/* Variable mapping */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Mapeo de variables</label>
            {varCount === 0 ? (
              <p className="text-[10px] text-gray-600">Esta plantilla no tiene variables.</p>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: varCount }, (_: unknown, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-xs w-10 ${form.param_field_map[String(i+1)] ? 'text-emerald-400' : 'text-red-400'}`}>{`{{${i+1}}}`}</span>
                    <select value={form.param_field_map[String(i+1)] || ''} onChange={(e) => setForm(f => ({
                      ...f, param_field_map: { ...f.param_field_map, [String(i+1)]: e.target.value }
                    }))}
                      className={`flex-1 bg-[#1a1f2e] border rounded-lg px-2 py-1.5 text-[11px] text-white outline-none ${
                        form.param_field_map[String(i+1)] ? 'border-emerald-500/30' : 'border-red-500/30'
                      }`}>
                      <option value="">— Campo del lead (requerido) —</option>
                      <option value="name">👤 Nombre</option>
                      <option value="service">🏷️ Servicio de interés</option>
                      <option value="email">📧 Email</option>
                      <option value="phone">📞 Teléfono</option>
                      <option value="appointment_date">📅 Fecha de cita</option>
                      <option value="appointment_time">🕐 Hora de cita</option>
                      <option value="appointment_location">📍 Lugar / Sede</option>
                      <option value="custom_value">✏️ Texto fijo (mismo para todos)</option>
                    </select>
                    {bodyExample[i] && (
                      <span className="text-[9px] text-gray-500 italic" title={`Ejemplo Meta: ${bodyExample[i]}`}>
                        ej: {bodyExample[i].slice(0, 15)}{bodyExample[i].length > 15 ? '…' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Selección destinatarios — Tabs Filtros / Manual / External */}
        <div className="border-t border-white/5 pt-4 mb-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="text-xs font-bold text-gray-300">🎯 Destinatarios</h4>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1 flex-wrap">
              <button
                onClick={() => setForm(f => ({ ...f, selection_mode: 'filter' }))}
                className={`text-[10px] px-3 py-1 rounded-md transition-all ${
                  form.selection_mode === 'filter' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}>
                🔍 Por filtros
              </button>
              <button
                onClick={() => setForm(f => ({ ...f, selection_mode: 'manual' }))}
                className={`text-[10px] px-3 py-1 rounded-md transition-all ${
                  form.selection_mode === 'manual' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}>
                ✋ Elegir del CRM
              </button>
              <button
                onClick={() => setForm(f => ({ ...f, selection_mode: 'external' }))}
                className={`text-[10px] px-3 py-1 rounded-md transition-all ${
                  form.selection_mode === 'external' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}>
                📋 Lista externa
              </button>
            </div>
          </div>
          {/* Modo FILTER + MANUAL: filtros del CRM */}
          {(form.selection_mode === 'filter' || form.selection_mode === 'manual') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Etapa del lead</label>
                  <div className="flex flex-wrap gap-1">
                    {allStages.map(s => (
                      <button key={s} onClick={() => toggleStage(s)}
                        className={`text-[9px] px-2 py-1 rounded-full transition-all ${
                          form.filters.lead_stage.includes(s) ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {allTags.slice(0, 15).map(t => (
                      <button key={t} onClick={() => toggleTag(t)}
                        className={`text-[9px] px-2 py-1 rounded-full transition-all ${
                          form.filters.tags.includes(t) ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Servicio de interés</label>
                  <select value={form.filters.service} onChange={(e) => setForm(f => ({ ...f, filters: { ...f.filters, service: e.target.value } }))}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none">
                    <option value="">— Todos —</option>
                    {allServices.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Días sin actividad (mínimo)</label>
                  <input type="number" min="0" value={form.filters.days_inactive || ''} onChange={(e) => setForm(f => ({ ...f, filters: { ...f.filters, days_inactive: parseInt(e.target.value) || 0 } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none"
                    placeholder="Ej: 30 (leads inactivos >30 días)" />
                </div>
              </div>
              {/* Lista de leads — solo en modo manual O cuando hay filtros activos */}
              {(form.selection_mode === 'manual' || form.filters.lead_stage.length > 0 || form.filters.tags.length > 0 || form.filters.service || form.filters.days_inactive > 0) && (
                <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-gray-300">
                      {form.selection_mode === 'manual'
                        ? `📋 Leads seleccionados (${form.selected_phones.length})`
                        : `📋 Leads que cumplen los filtros (${filteredLeads.length})`}
                    </p>
                    {form.selection_mode === 'manual' && (
                      <button onClick={toggleAllFiltered} className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold">
                        {filteredLeads.every(l => form.selected_phones.includes(l.contact_id || l.phoneNumber || ''))
                          ? '☐ Deseleccionar visibles'
                          : '☑️ Seleccionar todos los visibles'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredLeads.length === 0 ? (
                      <p className="text-[10px] text-gray-500 text-center py-3">No hay leads con esos filtros</p>
                    ) : filteredLeads.slice(0, 100).map(l => {
                      const phone = l.contact_id || l.phoneNumber || '';
                      const checked = form.selection_mode === 'manual' ? form.selected_phones.includes(phone) : true;
                      const isManual = form.selection_mode === 'manual';
                      return (
                        <label key={phone}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded text-[10px] transition-colors ${
                            isManual ? 'cursor-pointer hover:bg-white/5' : 'opacity-70'
                          } ${checked && isManual ? 'bg-purple-500/10' : ''}`}>
                          {isManual && (
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePhone(phone)}
                              className="w-3 h-3 accent-purple-500"
                            />
                          )}
                          <span className="text-white font-medium flex-1 truncate">
                            {l.customer_name || l.customer_full_name || '(sin nombre)'}
                          </span>
                          <span className="text-gray-500 font-mono text-[9px]">{phone}</span>
                          {l.lead_stage && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">
                              {l.lead_stage}
                            </span>
                          )}
                        </label>
                      );
                    })}
                    {filteredLeads.length > 100 && (
                      <p className="text-[9px] text-gray-500 text-center py-1 italic">
                        ... y {filteredLeads.length - 100} más (aplica más filtros para reducir)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          {/* Modo EXTERNAL: pegar o importar */}
          {form.selection_mode === 'external' && (
            <div className="space-y-3">
              {/* Banner informativo */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                <p className="text-[10px] text-blue-300 leading-relaxed">
                  ℹ️ <strong>Estos números NO se guardan en tu CRM.</strong> Solo entrarán al CRM si responden a tu mensaje.
                  Ideal para enviar a listas frías compradas o contactos sueltos sin saturar tu base.
                </p>
              </div>
              {/* Opción A: textarea */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">📝 Pegar números (uno por línea)</label>
                <textarea
                  value={form.external_raw}
                  onChange={(e) => setForm(f => ({ ...f, external_raw: e.target.value, external_file_name: '' }))}
                  rows={6}
                  placeholder={'573001234567,Juan Perez,Seminario 9mm\n573009876543,Maria Lopez\n573005551234\n...'}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono text-white outline-none focus:border-purple-500 resize-y" />
                <p className="text-[9px] text-gray-600 mt-1">
                  Formato: <code className="bg-white/5 px-1 rounded">número</code> <code className="bg-white/5 px-1 rounded">,nombre</code> (opc) <code className="bg-white/5 px-1 rounded">,servicio</code> (opc) — uno por línea
                </p>
              </div>
              {/* Separador OR */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">o</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              {/* Opción B: import file */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">📊 Importar lista (CSV o Excel)</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex-1 min-w-[200px] cursor-pointer bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg p-3 text-center transition-all">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileImport(file);
                        e.target.value = '';
                      }}
                    />
                    <p className="text-[11px] text-gray-300">
                      {form.external_file_name ? `📎 ${form.external_file_name}` : '📎 Click para subir CSV/Excel'}
                    </p>
                    <p className="text-[9px] text-gray-600 mt-1">Columnas: phone, name, service</p>
                  </label>
                  <button
                    type="button"
                    onClick={downloadTemplateCSV}
                    className="text-[10px] px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg font-bold transition-all">
                    📥 Plantilla CSV
                  </button>
                </div>
              </div>
              {/* Resumen de lo cargado */}
              {(parsedRaw.length > 0 || form.external_parsed.length > 0) && (
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                    <p className="text-[10px] font-bold text-gray-300">
                      📊 Resumen de la lista
                    </p>
                    <button
                      onClick={() => setForm(f => ({ ...f, external_raw: '', external_parsed: [], external_file_name: '' }))}
                      className="text-[9px] text-red-400 hover:text-red-300 font-bold">
                      🗑️ Limpiar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] mb-2">
                    <span className="text-emerald-400">✅ {form.external_parsed.length} válidos</span>
                    {!form.external_file_name && parsedRaw.filter(p => !p.valid).length > 0 && (
                      <span className="text-red-400">⚠️ {parsedRaw.filter(p => !p.valid).length} inválidos</span>
                    )}
                    <span className="text-gray-400">
                      📛 {form.external_parsed.filter(p => p.name).length} con nombre
                    </span>
                    <span className="text-gray-500">
                      🏷️ {form.external_parsed.filter(p => p.service).length} con servicio
                    </span>
                  </div>
                  {/* Preview primeros 5 */}
                  <div className="max-h-32 overflow-y-auto space-y-0.5">
                    {form.external_parsed.slice(0, 5).map((e, i) => (
                      <p key={i} className="text-[9px] text-gray-400 font-mono">
                        <span className="text-white">{e.phone}</span>
                        {e.name && <span className="text-emerald-300"> · {e.name}</span>}
                        {e.service && <span className="text-purple-300"> · {e.service}</span>}
                      </p>
                    ))}
                    {form.external_parsed.length > 5 && (
                      <p className="text-[9px] text-gray-600 italic">... y {form.external_parsed.length - 5} más</p>
                    )}
                  </div>
                  {/* Errores en líneas pegadas */}
                  {!form.external_file_name && parsedRaw.filter(p => !p.valid).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-[9px] text-red-400 cursor-pointer">Ver errores de parseo</summary>
                      <div className="mt-1 space-y-0.5 max-h-24 overflow-y-auto">
                        {parsedRaw.filter(p => !p.valid).slice(0, 10).map((p, i) => (
                          <p key={i} className="text-[9px] text-red-300 font-mono">
                            "{p.phone}" — {p.error}
                          </p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Estimador */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-bold text-purple-400">📊 {effectiveRecipients.length} destinatarios</p>
              <p className="text-[10px] text-gray-400">Costo estimado: ~${estimatedCost.toFixed(2)} USD (Meta cobra a tu tarjeta)</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.confirmed} onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
                className="w-4 h-4 accent-purple-500" />
              <label className="text-[10px] text-gray-300">Entiendo que Meta cobra este monto a mi tarjeta</label>
            </div>
          </div>
        </div>
        {/* Resultado */}
        {result && (
          <div className={`rounded-xl p-4 mb-4 ${result.ok ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-red-500/5 border border-red-500/20'}`}>
            {result.ok ? (
              <div>
                <p className="text-emerald-400 font-bold">✅ Campaña enviada</p>
                <p className="text-xs text-gray-400 mt-1">Enviados: {result.sent} · Fallidos: {result.failed} · Total: {result.total_recipients}</p>
                {result.errors?.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-[10px] text-red-400 cursor-pointer">Ver errores ({result.errors.length})</summary>
                    <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((e: any, i: number) => (
                        <p key={i} className="text-[9px] text-red-300">{e.phone}: {e.error}</p>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <p className="text-red-400 text-sm">❌ {result.error}</p>
            )}
          </div>
        )}
        {/* Botón enviar */}
        {/* Aviso si quedan variables sin mapear */}
        {selectedTpl && varCount > 0 && !allVarsMapped && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-3">
            <p className="text-[11px] text-red-300 font-bold">
              ⚠️ Faltan variables por mapear
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Esta plantilla tiene {varCount} variable{varCount > 1 ? 's' : ''}. Selecciona qué campo del lead usar para cada una arriba.
            </p>
          </div>
        )}
        {/* Warning de transparencia: leads con campos vacíos usarán fallback */}
        {selectedTpl && allVarsMapped && fieldMissingReport.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-3">
            <p className="text-[11px] text-amber-300 font-bold mb-1.5">
              ℹ️ Datos faltantes en algunos leads
            </p>
            <p className="text-[10px] text-gray-400 mb-2">
              Estos leads recibirán el mensaje con un valor genérico en lugar de su dato real:
            </p>
            <ul className="space-y-1">
              {fieldMissingReport.map(r => (
                <li key={r.varNum} className="text-[10px] text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400 font-mono shrink-0">{`{{${r.varNum}}}`}</span>
                  <span className="flex-1">
                    <span className="font-bold text-amber-300">{r.missing}</span> de <span className="font-bold">{r.total}</span> leads no tienen <span className="font-bold text-gray-200">{r.label}</span>
                    {' → '}usarán <span className="italic text-emerald-400">"{r.fallback}"</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[9px] text-amber-300/70 mt-2 italic">
              💡 Si querés mensajes 100% personalizados, completa esos campos en el CRM antes de enviar.
            </p>
          </div>
        )}
        <button onClick={handleSend}
          disabled={sending || !form.template_name || effectiveRecipients.length === 0 || !form.confirmed || (varCount > 0 && !allVarsMapped)}
          className="w-full py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-600/20">
          {sending
            ? '⏳ Enviando campaña...'
            : effectiveRecipients.length === 0
              ? '⚠️ Selecciona destinatarios'
              : varCount > 0 && !allVarsMapped
                ? '⚠️ Mapea todas las variables'
                : `🚀 Enviar a ${effectiveRecipients.length} destinatarios`}
        </button>
      </div>
      {/* Historial de campañas */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h3 className="font-bold mb-4">📊 Historial de campañas</h3>
        {campaigns.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No hay campañas enviadas aún</p>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <div>
                  <p className="text-xs font-bold">{c.template_name}</p>
                  <p className="text-[9px] text-gray-500">
                    {new Date(c.created_at * 1000).toLocaleString()} · {c.language}
                    {c.filters?.lead_stage?.length > 0 && ` · Etapas: ${c.filters.lead_stage.join(', ')}`}
                    {c.filters?.tags?.length > 0 && ` · Tags: ${c.filters.tags.join(', ')}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">{c.sent} enviados</p>
                  {c.failed > 0 && <p className="text-[9px] text-red-400">{c.failed} fallidos</p>}
                  <p className="text-[9px] text-gray-500">{c.total_recipients} destinatarios</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}