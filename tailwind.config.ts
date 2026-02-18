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
        withus: {
          navy: "#0031B7",
          "navy-light": "#1a4ac9",
          gold: "#FEF600",
          "gold-light": "#FFF9B0",
          cream: "#faf9f6",
          "cream-dark": "#f0ede8",
        },
        "cool-gray": {
          50: "#f8fafb",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
        },
      },
      boxShadow: {
        bento: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        serif: ["var(--font-noto-serif)", "Georgia", "serif"],
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
