import type { MetadataRoute } from 'next';
// Reglas para crawlers
// Allowlist explícito de bots de redes sociales (Facebook, Twitter, LinkedIn, WhatsApp)
// y motores de búsqueda. Disallow de áreas privadas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Bots de redes sociales — acceso completo a contenido público
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'Facebot', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'WhatsApp', allow: '/' },
      { userAgent: 'TelegramBot', allow: '/' },
      { userAgent: 'Slackbot', allow: '/' },
      { userAgent: 'Slackbot-LinkExpanding', allow: '/' },
      { userAgent: 'Discordbot', allow: '/' },
      { userAgent: 'SkypeUriPreview', allow: '/' },
      // Motores de búsqueda — explícitos
      { userAgent: 'Googlebot', allow: '/', disallow: ['/admin', '/dashboard', '/auth', '/api'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/admin', '/dashboard', '/auth', '/api'] },
      // Default — todos los demás
      {
        userAgent: '*',
        allow: ['/', '/demo', '/affiliates', '/og-image.png', '/sitemap.xml'],
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/auth/*',
          '/api/*',
          '/support/approve/*',
        ],
      },
    ],
    sitemap: 'https://clientes.bot/sitemap.xml',
    host: 'https://clientes.bot',
  };
}