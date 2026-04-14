'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function CRMPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  useEffect(() => {
    fetch(`${API_URL}/leads`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        const items = data.leads || [];
        setLeads(items);
        setFiltered(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    let result = leads;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(l =>
        (l.customer_name || '').toLowerCase().includes(s) ||
        (l.phoneNumber || '').includes(s) ||
        (l.service_of_interest || '').toLowerCase().includes(s)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(l => l.lead_status === filterStatus);
    }
    setFiltered(result);
  }, [search, filterStatus, leads]);
  const loadDetail = (phone: string) => {
    fetch(`${API_URL}/leads?phone=${phone}`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => setSelectedLead(data));
  };
  const statuses = [...new Set(leads.map(l => l.lead_status).filter(Boolean))];
  const exportCSV = () => {
    const headers = 'Nombre,Telefono,Estado,Servicio,Visitas\n';
    const rows = filtered.map(l =>
      `${l.customer_name || ''},${l.phoneNumber || ''},${l.lead_status || ''},${l.service_of_interest || ''},${l.visit_count || 0}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM / Leads 👥</h1>
        <button onClick={exportCSV} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          📥 Exportar CSV
        </button>
      </div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, telefono o servicio..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white"
        >
          <option value="all">Todos los estados</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Leads */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-500 mb-2">{filtered.length} leads encontrados</div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando leads...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay leads con esos filtros</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.map((lead, i) => (
                <div
                  key={i}
                  onClick={() => loadDetail(lead.phoneNumber)}
                  className={`bg-white/[0.03] border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedLead?.lead?.phoneNumber === lead.phoneNumber ? 'border-indigo-500 bg-indigo-600/5' : 'border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-sm font-bold text-indigo-400">
                      {(lead.customer_name || 'U').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{lead.customer_name || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-500">{lead.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-3 py-1 rounded-full ${
                      lead.lead_status === 'INTENCION DE COMPRA' ? 'bg-emerald-500/20 text-emerald-400' :
                      lead.lead_status === 'INTERESADO' ? 'bg-indigo-500/20 text-indigo-400' :
                      lead.lead_status === 'DEMO' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {lead.lead_status || 'Nuevo'}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{lead.service_of_interest || ''}</p>
                    <p className="text-[10px] text-gray-600">Visitas: {lead.visit_count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Detalle del Lead */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sticky top-20">
          {selectedLead ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg font-bold text-indigo-400">
                  {(selectedLead.lead?.customer_name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{selectedLead.lead?.customer_name || 'Sin nombre'}</h3>
                  <p className="text-xs text-gray-500">{selectedLead.lead?.phoneNumber}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="font-medium">{selectedLead.lead?.lead_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interes</span>
                  <span className="font-medium">{selectedLead.lead?.service_of_interest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visitas</span>
                  <span className="font-medium">{selectedLead.lead?.visit_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sesion</span>
                  <span className="font-medium">{selectedLead.session_state || '-'}</span>
                </div>
              </div>
              
              {selectedLead.payment && (
                <div className="mb-4 pt-4 border-t border-white/5">
                  <h4 className="font-bold mb-2 text-emerald-400">💳 Pago</h4>
                  <p className="text-sm">{selectedLead.payment.service_name}</p>
                  <p className="text-lg font-bold text-emerald-400">${selectedLead.payment.amount?.toLocaleString()} {selectedLead.payment.currency}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedLead.payment.status === 'PAGADO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedLead.payment.status}
                  </span>
                </div>
              )}
              {selectedLead.conversation?.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-bold mb-2">💬 Conversacion</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedLead.conversation.map((msg: any, i: number) => (
                      <div key={i} className={`text-xs p-2 rounded-lg ${
                        msg.role === 'user' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white/5 text-gray-300'
                      }`}>
                        <span className="font-bold">{msg.role === 'user' ? '👤' : '🤖'}</span> {msg.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-3xl mb-2">👈</p>
              <p className="text-sm">Selecciona un lead para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}