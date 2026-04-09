'use client';
import React from 'react';

export default function PoliticaPrivacidad() {
  const lastUpdate = "9 de Abril de 2026";

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-300 font-sans p-6 md:p-20">
      <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          Política de Privacidad y Tratamiento de Datos
        </h1>
        <p className="text-indigo-400 text-sm mb-12 font-medium bg-indigo-500/10 w-fit px-4 py-2 rounded-full">
          Versión Corporativa - Última actualización: {lastUpdate}
        </p>

        <nav className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-white font-bold mb-2">Resumen para Meta Reviewers:</p>
          <p className="text-xs leading-relaxed text-gray-400">
            Esta aplicación solicita permisos de <code>ads_management</code>, <code>ads_read</code>, <code>whatsapp_business_messaging</code> y <code>whatsapp_business_management</code>. 
            Los datos se utilizan exclusivamente para la automatización de ventas y optimización de pauta publicitaria autorizada por el usuario final.
          </p>
        </nav>

        <section className="space-y-10 text-sm md:text-base leading-relaxed">
          
          {/* 1. Responsable */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">01.</span> Responsable del Tratamiento
            </h2>
            <p>
              <strong>clientes.bot</strong> es responsable de la recolección y tratamiento de los datos suministrados por los usuarios que vinculan sus activos digitales (Cuentas Comerciales de Meta, Cuentas de Anuncios y Cuentas de WhatsApp Business) a nuestra plataforma.
            </p>
          </div>

          {/* 2. Datos de Meta y Publicidad */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">02.</span> Datos Recopilados y Acceso a APIs de Meta
            </h2>
            <p className="mb-4">Mediante el inicio de sesión con Facebook (OAuth) y la concesión de permisos, accedemos a:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">WhatsApp Business:</strong>
                WABA ID, Phone Number ID, tokens de acceso y métricas de mensajes para la operación del chatbot.
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Gestión de Anuncios (Ads):</strong>
                ID de cuenta de anuncios, estructuras de campañas, creatividades y datos de rendimiento (ROAS, CPC, CTR).
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Contenido de Mensajería:</strong>
                Logs de chats procesados por nuestra IA para fines de entrenamiento específico y servicio al cliente.
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Información de Perfil:</strong>
                Nombre y correo electrónico del administrador para la gestión de la cuenta en el SaaS.
              </li>
            </ul>
          </div>

          {/* 3. Finalidad y Gestión de Presupuestos */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">03.</span> Finalidad: Automatización y Optimización de Pauta
            </h2>
            <p className="mb-4">Los datos se tratan estrictamente para:</p>
            <ul className="list-disc ml-6 space-y-3">
              <li>
                <strong className="text-indigo-400">Gestión de Campañas:</strong> Creación, edición y publicación de anuncios en nombre del usuario para la captación de leads hacia WhatsApp.
              </li>
              <li>
                <strong className="text-indigo-400">Optimización de Presupuesto:</strong> Nuestra IA analiza el rendimiento de los anuncios en tiempo real. Usted autoriza a <strong>clientes.bot</strong> para realizar ajustes automáticos de presupuesto (incrementos o pausas) basados en los umbrales de rendimiento pre-configurados en su Dashboard.
              </li>
              <li>
                <strong className="text-indigo-400">Cierre de Ventas:</strong> Procesamiento de mensajes mediante modelos de lenguaje para responder dudas, agendar citas y facilitar pagos.
              </li>
            </ul>
          </div>

          {/* 4. Seguridad y Blindaje */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">04.</span> Blindaje de Datos y Seguridad Bancaria
            </h2>
            <p>
              Utilizamos encriptación <strong>AES-256</strong> para almacenar los <i>Tokens de Acceso de Usuario</i> y <i>Tokens de Sistema</i>. Los datos de pauta publicitaria se almacenan de forma aislada en instancias seguras de AWS. Nunca compartimos su información con otros clientes del SaaS ni con terceros para fines comerciales ajenos a la prestación del servicio.
            </p>
          </div>

          {/* 5. Eliminación de Datos y Revocación (Requisito META) */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">05.</span> Control del Usuario y Eliminación de Datos
            </h2>
            <p className="mb-4">
              Usted mantiene el control total sobre sus activos. Puede revocar el acceso de <strong>clientes.bot</strong> en cualquier momento mediante:
            </p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>La sección de "Configuración de Integraciones" en nuestro Dashboard.</li>
              <li>La configuración de "Business Integrations" en su perfil personal de Facebook.</li>
              <li>Solicitud directa al correo <strong>soporte@clientes.bot</strong>.</li>
            </ol>
            <p className="mt-4 italic bg-red-500/5 p-4 rounded-lg border border-red-500/10">
              Al eliminar su cuenta, procederemos a la eliminación inmediata de todos los tokens de acceso y logs de mensajes asociados a su empresa en un máximo de 48 horas hábiles.
            </p>
          </div>

          {/* 6. Limitación de Responsabilidad */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-3">6. Deslinde de Responsabilidad Financiera</h2>
            <p className="text-xs text-gray-400">
              clientes.bot actúa como una herramienta de automatización. Aunque nuestra IA busca optimizar el rendimiento, el usuario es el único responsable de establecer los límites de gasto diario y total en sus cuentas de anuncios de Meta. clientes.bot no se hace responsable por fluctuaciones en los costos de pauta decididos por los algoritmos de subasta de Meta ni por gastos derivados de configuraciones de presupuesto erróneas realizadas por el usuario.
            </p>
          </div>

        </section>

        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">clientes.bot © 2026 - Todos los derechos reservados</p>
          <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all">
            Acepto y Volver al Inicio
          </a>
        </footer>
      </div>
    </div>
  );
}