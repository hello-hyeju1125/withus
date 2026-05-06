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
          navy: {
            DEFAULT: "#1E2A5E",
            900: "#142048",
            700: "#1E2A5E",
            500: "#3F4F8A",
            300: "#6B7AAF",
            200: "#9CA8CB",
            100: "#DDE3F2",
          },
          gold: {
            DEFAULT: "#FFE600",
            tint: "#FFFBE0",
          },
          bg: {
            DEFAULT: "#F7F8FA",
            hover: "#EDF0F5",
          },
          accent: {
            blue: "#3466AE",
            "blue-tint": "#EBF1F9",
            green: "#2E8B6A",
            "green-tint": "#E8F5EF",
            gold: "#B8860B",
            "gold-tint": "#FBF4E4",
            purple: "#7B5EA7",
            "purple-tint": "#F3EEF8",
          },
          cta: {
            DEFAULT: "#1E2A5E",
            hover: "#142048",
            tint: "#E5E9F5",
          },
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
