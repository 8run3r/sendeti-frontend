import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90D9",
        "primary-light": "#EBF4FF",
        "primary-dark": "#2C6BAD",
        accent: "#FF6B9D",
        "accent-warm": "#FFB347",
        "accent-green": "#52C97E",
        "neutral-50": "#FAFBFC",
        "neutral-100": "#F2F4F7",
        "neutral-200": "#E4E8EE",
        "neutral-600": "#6B7280",
        "neutral-900": "#111827",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 8px 32px rgba(74,144,217,0.12)",
        lg: "0 20px 60px rgba(0,0,0,0.10)",
        "blue-hover": "0 8px 32px rgba(74,144,217,0.20)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
