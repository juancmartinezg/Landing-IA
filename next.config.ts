import withPWAInit from "next-pwa";
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // No cachear rutas de auth ni la página de routing PWA
  // (siempre deben preguntar al servidor el estado actual)
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^\/launch$/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^\/auth\/.*/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^\/dashboard\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "dashboard-cache",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff|woff2|ttf|otf)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "assets-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
  ],
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config: any) => {
    return config;
  },
};
export default withPWA(nextConfig);