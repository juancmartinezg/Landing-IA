'use client';
import React from 'react';
import Link from 'next/link';
export default function TerminosCondiciones() {
  const lastUpdate = "26 de Abril de 2026";
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-300 font-sans p-6 md:p-20">
      <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          Términos y Condiciones de Servicio
        </h1>
        <p className="text-indigo-400 text-sm mb-12 font-medium bg-indigo-500/10 w-fit px-4 py-2 rounded-full">
          Última actualización: {lastUpdate}
        </p>
        <nav className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-white font-bold mb-2">Resumen:</p>
          <p className="text-xs leading-relaxed text-gray-400">
            Al registrarte y usar <strong>clientes.bot</strong> aceptas estos términos. Si no estás de acuerdo, no utilices el servicio.
          </p>
        </nav>
        <section className="space-y-10 text-sm md:text-base leading-relaxed">
          {/* 1. Aceptación */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">01.</span> Aceptación de los Términos
            </h2>
            <p>
              Estos Términos y Condiciones (en adelante, "Términos") constituyen un acuerdo legal entre <strong>SGC Technology S.A.S.</strong> (en adelante, "clientes.bot", "nosotros") y el usuario o empresa que se registra y utiliza la plataforma (en adelante, "Usuario", "tú"). Al crear una cuenta, marcar la casilla de aceptación o utilizar el servicio aceptas íntegramente estos Términos y la <Link href="/politica-de-privacidad" className="text-indigo-400 hover:underline">Política de Privacidad</Link>.
            </p>
          </div>
          {/* 2. Descripción del servicio */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">02.</span> Descripción del Servicio
            </h2>
            <p className="mb-4">
              <strong>clientes.bot</strong> es una plataforma SaaS multi-tenant que ofrece:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Bot de WhatsApp con IA</strong>
                Respuestas automáticas, catálogo, agendamiento y cobro vía WhatsApp Business API.
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">CRM y Multi-agente</strong>
                Gestión de leads, asignación a equipo, notas privadas y analytics.
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Publicidad en Meta</strong>
                Creación, optimización y monitoreo de campañas en Facebook e Instagram.
              </li>
              <li className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Pagos integrados</strong>
                Generación de links de pago a través de pasarelas de terceros (Bold, Wompi, PayPal, MercadoPago, OpenPay, PayU).
              </li>
            </ul>
          </div>
          {/* 3. Registro y cuenta */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">03.</span> Registro, Cuenta y Edad Mínima
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Debes tener al menos <strong>18 años</strong> y representar legalmente a una empresa o persona natural con actividad económica registrada.</li>
              <li>Eres responsable de la veracidad de los datos suministrados (nombre, correo, teléfono, datos del negocio).</li>
              <li>Eres responsable de la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.</li>
              <li>Notifícanos de inmediato a <strong>soporte@clientes.bot</strong> si detectas un uso no autorizado.</li>
            </ul>
          </div>
          {/* 4. Planes y prueba gratis */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">04.</span> Planes, Prueba Gratuita y Facturación
            </h2>
            <ul className="list-disc ml-6 space-y-3">
              <li>
                <strong className="text-indigo-400">Prueba gratuita:</strong> Ofrecemos 7 días de prueba sin tarjeta de crédito. Al finalizar, deberás elegir un plan de pago para continuar usando la plataforma.
              </li>
              <li>
                <strong className="text-indigo-400">Suscripción:</strong> Los planes son de pago mensual recurrente en USD. La suscripción se renueva automáticamente hasta que la canceles.
              </li>
              <li>
                <strong className="text-indigo-400">Cancelación:</strong> Puedes cancelar en cualquier momento desde tu Dashboard. La cancelación detiene el siguiente cobro; el período ya pagado sigue activo hasta su vencimiento.
              </li>
              <li>
                <strong className="text-indigo-400">Reembolsos:</strong> No se realizan reembolsos por períodos parciales ya facturados, salvo obligación legal aplicable.
              </li>
              <li>
                <strong className="text-indigo-400">Cambios de precio:</strong> Notificaremos cualquier cambio con al menos 30 días de anticipación al correo registrado.
              </li>
            </ul>
          </div>
          {/* 5. Uso aceptable */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">05.</span> Uso Aceptable
            </h2>
            <p className="mb-4">Te comprometes a NO utilizar la plataforma para:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Enviar mensajes masivos no solicitados (spam) o violar las políticas de WhatsApp Business y Meta.</li>
              <li>Promocionar contenido ilegal, violento, sexual explícito, fraudulento o que infrinja derechos de terceros.</li>
              <li>Recolectar datos personales sin consentimiento o violar la Ley 1581 de 2012 (Habeas Data, Colombia) o el GDPR (UE).</li>
              <li>Realizar ingeniería inversa, descompilar o intentar extraer el código fuente del software.</li>
              <li>Revender, sublicenciar o transferir tu cuenta sin autorización escrita.</li>
              <li>Usar la plataforma para actividades sancionadas (lavado de activos, financiación de terrorismo, etc.).</li>
            </ul>
            <p className="mt-4 italic bg-red-500/5 p-4 rounded-lg border border-red-500/10">
              El incumplimiento dará lugar a la suspensión inmediata de la cuenta sin reembolso, y a las acciones legales que correspondan.
            </p>
          </div>
          {/* 6. Servicios de terceros */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">06.</span> Servicios de Terceros
            </h2>
            <p className="mb-4">
              <strong>clientes.bot</strong> integra servicios de terceros (Meta, Google, AWS, OpenAI, Gemini, VAPI, Stripe y pasarelas de pago). Su uso está sujeto a los términos y políticas de cada proveedor. No somos responsables por:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Caídas, cambios o suspensiones de las APIs de Meta/WhatsApp.</li>
              <li>Bloqueos de cuenta de WhatsApp Business o Ads Manager por incumplimiento de las políticas de Meta.</li>
              <li>Costos de pauta publicitaria, comisiones de pasarelas de pago o tarifas de WhatsApp Business API.</li>
              <li>Disputas entre el Usuario y sus clientes finales sobre pagos, productos o servicios.</li>
            </ul>
          </div>
          {/* 7. Propiedad intelectual */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">07.</span> Propiedad Intelectual
            </h2>
            <p>
              El software, marca, logo, diseño, interfaz, código fuente y documentación de <strong>clientes.bot</strong> son propiedad exclusiva de <strong>SGC Technology S.A.S.</strong> y están protegidos por las leyes de propiedad intelectual de Colombia y tratados internacionales. El Usuario recibe una licencia limitada, no exclusiva, intransferible y revocable para usar la plataforma según estos Términos. El contenido que el Usuario sube (catálogos, imágenes, mensajes, leads) sigue siendo de su propiedad.
            </p>
          </div>
          {/* 8. Garantías y limitación de responsabilidad */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">08.</span> Garantías y Limitación de Responsabilidad
            </h2>
            <p className="mb-4">
              La plataforma se ofrece <strong>"tal cual" (AS IS)</strong>, sin garantías expresas ni implícitas de funcionamiento ininterrumpido, ausencia de errores o resultados comerciales específicos.
            </p>
            <p className="mb-4">
              En ningún caso <strong>clientes.bot</strong> ni sus directivos, empleados o aliados serán responsables por:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Lucro cesante, pérdida de clientes, ventas no concretadas o daños indirectos.</li>
              <li>Pérdida de datos por causas ajenas (fallas de AWS, Meta, Google u otros proveedores).</li>
              <li>Decisiones comerciales tomadas por el Usuario con base en métricas, recomendaciones de IA o analytics de la plataforma.</li>
              <li>Gastos de pauta publicitaria, costos de WhatsApp Business API o comisiones de pasarelas.</li>
            </ul>
            <p className="mt-4 italic bg-red-500/5 p-4 rounded-lg border border-red-500/10">
              La responsabilidad total acumulada de clientes.bot frente al Usuario, por cualquier concepto, no excederá el monto pagado por éste durante los <strong>3 meses anteriores</strong> al hecho que origine el reclamo.
            </p>
          </div>
          {/* 9. Suspensión y terminación */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">09.</span> Suspensión y Terminación de la Cuenta
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>El Usuario puede cancelar su cuenta en cualquier momento desde el Dashboard o escribiendo a <strong>soporte@clientes.bot</strong>.</li>
              <li><strong>clientes.bot</strong> puede suspender o cancelar la cuenta inmediatamente y sin reembolso si detecta incumplimiento de estos Términos, fraude, mora en el pago superior a 7 días o uso indebido de las APIs de terceros.</li>
              <li>Tras la cancelación, los datos del Usuario se eliminarán en un máximo de 48 horas hábiles, conforme a la <Link href="/politica-de-privacidad" className="text-indigo-400 hover:underline">Política de Privacidad</Link>.</li>
            </ul>
          </div>
          {/* 10. Modificaciones */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">10.</span> Modificaciones a los Términos
            </h2>
            <p>
              Podemos actualizar estos Términos en cualquier momento. Los cambios se publicarán en esta página con la fecha de "Última actualización" actualizada. Si los cambios son sustanciales, te notificaremos por correo electrónico con al menos 15 días de anticipación. El uso continuado de la plataforma después de la fecha de entrada en vigor constituye aceptación de los nuevos Términos.
            </p>
          </div>
          {/* 11. Ley aplicable y jurisdicción */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">11.</span> Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Estos Términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta inicialmente mediante negociación directa de buena fe. De no ser posible, las partes se someten a la jurisdicción de los jueces competentes de la ciudad de Medellín, Colombia, renunciando a cualquier otro fuero.
            </p>
          </div>
          {/* 12. Contacto */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-3">12. Contacto</h2>
            <p className="text-sm text-gray-400">
              <strong>SGC Technology S.A.S.</strong><br />
              Correo: <strong>soporte@clientes.bot</strong><br />
              WhatsApp: <strong>+57 302 220 5845</strong><br />
              Sitio web: <strong>https://clientes.bot</strong>
            </p>
          </div>
        </section>
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">clientes.bot © 2026 - Todos los derechos reservados</p>
          <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all">
            Acepto y Volver al Inicio
          </Link>
        </footer>
      </div>
    </div>
  );
}