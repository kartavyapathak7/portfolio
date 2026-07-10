import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        site: {
          bg: "#08080a",
          elevated: "#111114",
          card: "#16161a",
          /** Use border-site-border — this is an rgba value not usable as bg directly */
          border: "rgba(255, 255, 255, 0.08)",
          text: "#f0f0f2",
          muted: "#8a8a96",
          accent: "#c8ff00",
          "accent-dim": "rgba(200, 255, 0, 0.15)",
          orange: "#ff5c2b",
          steel: "#2a2a32",
        },
        protein: {
          green: "#22c55e",
          "green-dim": "rgba(34, 197, 94, 0.15)",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(0, 0, 0, 0.4)",
        glow: "0 0 24px rgba(200, 255, 0, 0.3)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "count-pulse": "countPulse 0.3s ease",
        "spin": "spin 1s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      /* grid-template-rows animation for FAQ accordion */
      gridTemplateRows: {
        "0fr": "0fr",
        "1fr": "1fr",
      },
      transitionProperty: {
        "grid-template-rows": "grid-template-rows",
      },
    },
  },
  plugins: [],
};

export default config;
