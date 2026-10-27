import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matched to @aberdeen_daycare_nursery brand palette (Sky Cerulean + Deep Teal + Golden Marigold)
        aberdeen: {
          50: "#f2f7fa",
          100: "#e2eef5",
          200: "#c6dfed",
          300: "#9bc6de",
          400: "#7aa7c2", // Signature poster sky-blue background
          500: "#548eb0",
          600: "#3b7a9e", // Signature poster quote-bubble teal-blue
          700: "#2f6280",
          800: "#275169",
          900: "#1e3f52",
          950: "#132936",
        },
        marigold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde58a",
          300: "#fbd24d",
          400: "#f7b81b",
          500: "#e59500", // Signature poster golden marigold brush-stroke
          600: "#c97d00",
          700: "#a36102",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
