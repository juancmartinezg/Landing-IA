import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AffiliateTracker from "./components/AffiliateTracker";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL('https://clientes.bot'),
  title: {
    default: 'clientes.bot · Todo tu negocio conectado a WhatsApp',
    template: '%s · clientes.bot',
  },
  description: 'CRM, IA, Atribución de anuncios, Pagos y Citas en una sola plataforma. Captura desde anuncios, vende por WhatsApp y mide ventas reales — no clics. 14 días gratis sin tarjeta.',
  keywords: [
    'WhatsApp Business API', 'CRM WhatsApp', 'bot WhatsApp IA',
    'Facebook Ads atribución', 'Meta CAPI', 'plataforma ventas WhatsApp',
    'alternativa GoHighLevel', 'alternativa Manychat', 'alternativa HubSpot',
    'SaaS multi-tenant', 'CRM Kanban IA', 'lead scoring IA',
    'multicanal WhatsApp Instagram Facebook', 'cobros WhatsApp',
    'agenda inteligente WhatsApp', 'voz IA llamadas', 'pasarela pagos LATAM',
  ],
  authors: [{ name: 'SGC Technology S.A.S.' }],
  creator: 'clientes.bot',
  publisher: 'SGC Technology S.A.S.',
  alternates: {
    canonical: 'https://clientes.bot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'clientes.bot · Todo tu negocio conectado a WhatsApp',
    description: 'CRM + IA + Atribución de Anuncios + Pagos + Citas en una sola plataforma. La infraestructura que reemplaza GoHighLevel, Manychat y HubSpot por un solo precio.',
    url: 'https://clientes.bot',
    siteName: 'clientes.bot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'clientes.bot — Infraestructura SaaS para negocios que venden por WhatsApp',
        type: 'image/png',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'clientes.bot · Todo tu negocio conectado a WhatsApp',
    description: 'CRM + IA + Atribución + Pagos + Citas en una sola plataforma. Reemplaza GoHighLevel, Manychat y HubSpot por un solo precio.',
    images: ['/og-image.png'],
    creator: '@clientesbot',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'clientes.bot',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  category: 'business',
};
export const viewport: Viewport = {
  themeColor: "#6366F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0F1A]">
        <Providers>
          <AffiliateTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}