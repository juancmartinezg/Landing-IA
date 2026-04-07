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

// ✅ CONFIGURACIÓN ÚNICA Y CORRECTA
export const metadata: Metadata = {
  title: "clientes.bot - Gestión de Clientes con IA",
  description: "Automatización de WhatsApp, CRM y pagos para tu negocio.",
  manifest: "/manifest.json",
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
  themeColor: "#6366F1", // El morado de tu diseño
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