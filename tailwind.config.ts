import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // zinc-950
        card: "#18181b", // zinc-900
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
        accent: {
          blue: "#3b82f6",
          emerald: "#10b981",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.15)",
        "blue-glow": "0 0 25px -5px rgba(59, 130, 246, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
