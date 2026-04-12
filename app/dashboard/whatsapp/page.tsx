'use client';
import { useState } from 'react';
export default function WhatsAppPage() {
  const [step, setStep] = useState<'intro' | 'connecting' | 'done'>('intro');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Conectar WhatsApp 📱</h1>
      {step === 'intro' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center mb-6">
            <p className="text-5xl mb-4">📱</p>
            <h2 className="text-xl font-bold mb-2">Conecta tu WhatsApp Business</h2>
            <p className="text-gray-400 text-sm mb-6">
              Vincula tu linea de WhatsApp Business con un clic. Nosotros nos encargamos de toda la configuracion tecnica.
            </p>
            <button
              onClick={() => setStep('connecting')}
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg text-lg"
            >
              Conectar con Facebook
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">1️⃣</p>
              <h3 className="font-bold text-sm mb-1">Inicia sesion</h3>
              <p className="text-xs text-gray-400">Con tu cuenta de Facebook que administra tu WhatsApp Business</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">2️⃣</p>
              <h3 className="font-bold text-sm mb-1">Autoriza</h3>
              <p className="text-xs text-gray-400">Permite que clientes.bot gestione los mensajes de tu linea</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">3️⃣</p>
              <h3 className="font-bold text-sm mb-1">Listo</h3>
              <p className="text-xs text-gray-400">Tu bot se activa automaticamente y empieza a responder</p>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Preguntas Frecuentes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">Puedo usar mi mismo numero?</p>
                <p className="text-sm text-gray-400">Si, puedes vincular tu numero actual. Tambien puedes activar una linea nueva.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">Pierdo mis contactos?</p>
                <p className="text-sm text-gray-400">No, tus contactos y conversaciones anteriores se mantienen intactos.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">Puedo desconectarlo despues?</p>
                <p className="text-sm text-gray-400">Si, puedes desconectar tu WhatsApp en cualquier momento desde esta misma pagina.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-400 mb-1">Necesito WhatsApp Business?</p>
                <p className="text-sm text-gray-400">Si, necesitas una cuenta de WhatsApp Business. Si no la tienes, te ayudamos a crearla.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 'connecting' && (
        <div className="max-w-md mx-auto bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold mb-2">Conectando...</h2>
          <p className="text-gray-400 text-sm mb-6">Esta funcion estara disponible muy pronto. Estamos en proceso de aprobacion con Meta.</p>
          <button onClick={() => setStep('intro')} className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}