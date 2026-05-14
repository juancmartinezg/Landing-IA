import type { MetadataRoute } from 'next';
// Reglas para crawlers
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/demo', '/affiliates'],
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