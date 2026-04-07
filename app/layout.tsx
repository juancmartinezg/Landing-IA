import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ CONFIGURACIÓN COMPLETA: SEO + PWA + SOCIAL CARDS
export const metadata: Metadata = {
  title: 'clientes.bot | Automatiza tu WhatsApp con IA',
  description: 'El único SaaS que combina WhatsApp, CRM y pagos locales con Inteligencia Artificial. Ahorra 20h a la semana y vende más.',
  manifest: "/manifest.json",
  
  // Configuración para que el link se vea pro en WhatsApp/Redes
  openGraph: {
    title: 'clientes.bot | Automatiza tu WhatsApp con IA',
    description: 'El único SaaS que combina WhatsApp, CRM y pagos locales con IA.',
    url: 'https://tu-dominio.com', // Reemplaza con tu URL real cuando la tengas
    siteName: 'clientes.bot',
    images: [
      {
        url: '/dashboard-preview.png', // Usa la imagen del dashboard para la vista previa
        width: 1200,
        height: 630,
        alt: 'clientes.bot Dashboard Preview',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Configuración para Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'clientes.bot | IA para WhatsApp',
    description: 'SaaS de automatización con pagos integrados y CRM.',
    images: ['/dashboard-preview.png'],
  },

  // Configuración PWA y Apple
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "clientes.bot",
  },
  
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

// ✅ VIEWPORT SEPARADO (ESTÁNDAR NEXT.JS 15+)
export const viewport: Viewport = {
  themeColor: "#6366F1", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
        {children}
      </body>
    </html>
  );
}