'use client';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function ChatPage() {
  const [phone, setPhone] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/leads`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => { setLeads(data.leads || []); setLoadingLeads(false); })
      .catch(() => setLoadingLeads(false));
  }, []);
  const loadChat = (phoneNumber: string) => {
    setLoading(true);
    setPhone(phoneNumber);
    fetch(`${API_URL}/conversations?phone=${phoneNumber}`, { headers: { 'client-id': 'JMC' } })
      .then(res => res.json())
      .then(data => { setConversation(data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Conversaciones 💬</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de contactos */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <input
              type="text"
              placeholder="Buscar por telefono..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 text-white"
              onChange={(e) => {
                const val = e.target.value;
                if (val.length >= 10) loadChat(val);
              }}
            />
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {loadingLeads ? (
              <div className="text-center py-8 text-gray-500 text-sm">Cargando...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No hay conversaciones</div>
            ) : (
              leads.map((lead, i) => (
                <div
                  key={i}
                  onClick={() => loadChat(lead.phoneNumber)}
                  className={`px-4 py-3 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                    phone === lead.phoneNumber ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
                      {(lead.customer_name || 'U').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lead.customer_name || 'Sin nombre'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{lead.phoneNumber}</p>
                    </div>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full ${
                      lead.lead_status === 'INTENCION DE COMPRA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {lead.lead_status?.substring(0, 10) || ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Chat */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden flex flex-col" style={{minHeight: '500px'}}>
          {!conversation && !loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-gray-500 text-sm">Selecciona un contacto para ver la conversacion</p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">Cargando conversacion...</div>
            </div>
          ) : (
            <>
              <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5">
                <p className="font-bold">{conversation?.phone}</p>
                <p className="text-xs text-gray-500">
                  Estado: {conversation?.flow_state || '-'} | Intent: {conversation?.last_intent || '-'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversation?.messages?.length > 0 ? (
                  conversation.messages.map((msg: any, i: number) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-200 rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">No hay mensajes en esta conversacion</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}