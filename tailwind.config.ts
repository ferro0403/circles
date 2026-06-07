import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08090b",
        panel: "#111316",
        lime: "#c9ff4a",
        muted: "#8d929a",
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 255, 74, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
