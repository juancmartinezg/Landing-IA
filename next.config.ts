import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_NODE === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
