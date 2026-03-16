import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C874D9",
        "primary-light": "#F5E6F8",
        "primary-dark": "#a855c7",
        coral: "#F7A072",
        "coral-dark": "#e8875a",
        "coral-light": "#FFF0EB",
        pink: "#E1BBC9",
        "pink-light": "#FBF0F4",
        mint: "#E2FCEF",
        "mint-dark": "#52C97E",
        accent: "#F7A072",
        "accent-warm": "#F7A072",
        "accent-green": "#52C97E",
        "neutral-50": "#FAFAFA",
        "neutral-100": "#F2F4F7",
        "neutral-200": "#E4E8EE",
        "neutral-600": "#6B7280",
        "neutral-900": "#1a1a1a",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Nunito", "sans-serif"],
        sans: ["Nunito", "sans-serif"],
        mono: ["Nunito", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 8px 32px rgba(200,116,217,0.15)",
        lg: "0 20px 60px rgba(0,0,0,0.10)",
        "purple-hover": "0 20px 40px rgba(200,116,217,0.20)",
        "coral-hover": "0 12px 32px rgba(247,160,114,0.30)",
      },
      borderRadius: { "2xl": "16px", "3xl": "24px" },
      maxWidth: { content: "1400px" },
    },
  },
  plugins: [],
};

export default config;
