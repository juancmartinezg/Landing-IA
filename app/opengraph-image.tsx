import { ImageResponse } from 'next/og';
// Next.js auto-detecta este archivo y genera la OG image en /og-image
export const runtime = 'edge';
export const alt = 'clientes.bot — Infraestructura SaaS para negocios que venden por WhatsApp';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0B0F1A 0%, #1a1f3a 50%, #0B0F1A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Glow indigo arriba izquierda */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Glow emerald abajo derecha */}
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px',
            padding: '8px 20px',
            marginBottom: '30px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: '#10b981',
            }}
          />
          <span style={{ fontSize: '16px', color: '#d1d5db', fontWeight: 700 }}>
            Infraestructura SaaS · Multi-tenant · LATAM + USA + Europa
          </span>
        </div>
        {/* H1 */}
        <div
          style={{
            fontSize: '88px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.05,
            marginBottom: '20px',
            zIndex: 10,
            letterSpacing: '-2px',
          }}
        >
          <div>Todo tu negocio</div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <span>conectado a</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #34d399, #818cf8, #c084fc)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              WhatsApp.
            </span>
          </div>
        </div>
        {/* Sub */}
        <div
          style={{
            fontSize: '28px',
            color: '#9ca3af',
            textAlign: 'center',
            marginBottom: '40px',
            zIndex: 10,
            maxWidth: '900px',
          }}
        >
          CRM · IA · Atribución de Ads · Pagos · Citas — en una sola plataforma.
        </div>
        {/* Logos chip-style abajo */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {['🚀 Anuncios IA', '👥 CRM + IA', '💬 Multicanal', '💳 7+ pasarelas', '🎯 Atribución completa'].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '18px',
                  color: '#e0e7ff',
                  fontWeight: 700,
                  display: 'flex',
                }}
              >
                {chip}
              </div>
            )
          )}
        </div>
        {/* Logo bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🦁
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            clientes.bot
          </span>
        </div>
        {/* CTA bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            padding: '14px 24px',
            borderRadius: '14px',
            fontSize: '20px',
            fontWeight: 900,
            color: 'white',
            display: 'flex',
            zIndex: 10,
          }}
        >
          14 días gratis →
        </div>
      </div>
    ),
    { ...size }
  );
}