import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 22px 70px rgba(29, 42, 61, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
