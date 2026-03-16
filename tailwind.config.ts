import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // F7A072 coral — primary action colour (most used)
        primary: "#F7A072",
        "primary-light": "#FFF0EB",
        "primary-dark": "#e8875a",
        // E1BBC9 pink — borders, soft backgrounds (second most used)
        pink: "#E1BBC9",
        "pink-light": "#FBF0F4",
        // E2FCEF mint — success, free-shipping, badges (third)
        mint: "#E2FCEF",
        "mint-dark": "#52C97E",
        // Purple — sale / promo highlights
        accent: "#C874D9",
        "accent-light": "#F5E6F8",
        // legacy alias used throughout components
        "accent-warm": "#F7A072",
        "accent-green": "#52C97E",
        // Neutrals
        "neutral-50": "#FAFAFA",
        "neutral-100": "#F2F4F7",
        "neutral-200": "#E4E8EE",
        "neutral-600": "#6B7280",
        "neutral-900": "#1a1a1a",
      },
      fontFamily: {
        // Cormorant Garamond — headings: elegant, premium, not AI-generic
        display: ["Cormorant Garamond", "Georgia", "serif"],
        // Figtree — body: 2022 Google Font, clean, slightly rounded, fresh
        body: ["Figtree", "sans-serif"],
        sans: ["Figtree", "sans-serif"],
        mono: ["Figtree", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 8px 32px rgba(247,160,114,0.18)",
        lg: "0 20px 60px rgba(0,0,0,0.10)",
        "coral-hover": "0 16px 48px rgba(247,160,114,0.30)",
        "pink-hover": "0 8px 32px rgba(225,187,201,0.35)",
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
