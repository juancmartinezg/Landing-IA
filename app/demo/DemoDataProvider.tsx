'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import * as M from './mockData';
// Context con toda la data mock + setters para que el demo "sienta" interactivo
// (mover lead de etapa, marcar mensaje leído, etc.) sin tocar backend real.
interface DemoContextType {
  brand: typeof M.MOCK_BRAND;
  agents: typeof M.MOCK_AGENTS;
  services: typeof M.MOCK_SERVICES;
  leads: typeof M.MOCK_LEADS;
  setLeads: (l: typeof M.MOCK_LEADS) => void;
  conversations: typeof M.MOCK_CONVERSATIONS;
  setConversations: (c: typeof M.MOCK_CONVERSATIONS) => void;
  appointments: typeof M.MOCK_APPOINTMENTS;
  payments: typeof M.MOCK_PAYMENTS;
  adsCampaigns: typeof M.MOCK_ADS_CAMPAIGNS;
  adsRecommendations: typeof M.MOCK_ADS_RECOMMENDATIONS;
  analytics: typeof M.MOCK_ANALYTICS;
  memoryEntries: typeof M.MOCK_MEMORY_ENTRIES;
  templates: typeof M.MOCK_TEMPLATES;
  campaigns: typeof M.MOCK_CAMPAIGNS;
  reminders: typeof M.MOCK_REMINDERS;
  // helpers
  moveLeadStage: (leadId: string, newStage: string) => void;
  sendMockMessage: (convId: string, text: string, from: 'user' | 'bot' | 'agent') => void;
}
const DemoContext = createContext<DemoContextType | null>(null);
export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoDataProvider');
  return ctx;
};
export default function DemoDataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState(M.MOCK_LEADS);
  const [conversations, setConversations] = useState(M.MOCK_CONVERSATIONS);
  // Mover lead entre etapas (drag & drop Kanban)
  const moveLeadStage = (leadId: string, newStage: string) => {
    setLeads(leads.map(l =>
      l.id === leadId ? { ...l, stage: newStage } : l
    ));
  };
  // Simular envío de mensaje en una conversación
  const sendMockMessage = (convId: string, text: string, from: 'user' | 'bot' | 'agent') => {
    const now = new Date().toISOString();
    setConversations(conversations.map(c =>
      c.id === convId
        ? {
            ...c,
            last_at: now,
            messages: [...c.messages, { from, text, at: now, ...(from === 'agent' ? { agent_name: 'Tú (demo)' } : {}) }],
          }
        : c
    ));
  };
  return (
    <DemoContext.Provider value={{
      brand: M.MOCK_BRAND,
      agents: M.MOCK_AGENTS,
      services: M.MOCK_SERVICES,
      leads,
      setLeads,
      conversations,
      setConversations,
      appointments: M.MOCK_APPOINTMENTS,
      payments: M.MOCK_PAYMENTS,
      adsCampaigns: M.MOCK_ADS_CAMPAIGNS,
      adsRecommendations: M.MOCK_ADS_RECOMMENDATIONS,
      analytics: M.MOCK_ANALYTICS,
      memoryEntries: M.MOCK_MEMORY_ENTRIES,
      templates: M.MOCK_TEMPLATES,
      campaigns: M.MOCK_CAMPAIGNS,
      reminders: M.MOCK_REMINDERS,
      moveLeadStage,
      sendMockMessage,
    }}>
      {children}
    </DemoContext.Provider>
  );
}