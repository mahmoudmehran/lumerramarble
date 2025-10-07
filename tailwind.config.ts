import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f59000",
          50: "#fef9ec",
          100: "#fcf0d3",
          200: "#f8dea5",
          300: "#f4c66d",
          400: "#f0a532",
          500: "#f59000",
          600: "#d67300",
          700: "#b35800",
          800: "#914607",
          900: "#773b0a",
        },
        secondary: {
          DEFAULT: "#2c3e50",
          50: "#f8f9fa",
          100: "#ecf0f1",
          200: "#d6dbdf",
          300: "#bdc3c7",
          400: "#95a5a6",
          500: "#7f8c8d",
          600: "#6c7b7d",
          700: "#5d6d6e",
          800: "#4a5859",
          900: "#2c3e50",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        arabic: ["Cairo", "system-ui", "sans-serif"],
        latin: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
