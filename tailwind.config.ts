import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F1A',      // El azul oscuro de tu imagen
          purple: '#6366F1',    // El morado de tus botones
          green: '#22C55E',     // El verde del badge
          gray: '#94A3B8',      // El texto secundario
        },
      },
    },
  },
  plugins: [],
};
export default config;