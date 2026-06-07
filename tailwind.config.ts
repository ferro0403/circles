import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070709",
        panel: "#121116",
        violet: {
          DEFAULT: "#9d5cff",
          300: "#c4b5fd",
          400: "#a78bfa",
          800: "#5b21b6",
        },
        muted: "#92909a",
      },
      boxShadow: {
        glow: "0 0 44px rgba(157, 92, 255, 0.22)",
        card: "0 18px 60px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
