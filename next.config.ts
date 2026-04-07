import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // 👈 Corregido: NODE_ENV
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Forzamos webpack para evitar conflictos con Turbopack y PWA
  webpack: (config: any) => {
    return config;
  },
};

export default withPWA(nextConfig);