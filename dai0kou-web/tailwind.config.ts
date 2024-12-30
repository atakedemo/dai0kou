import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        secondary: "#FFC107",
      },
      ringColor: {
        primary: "#4CAF50",
      },
    },
  },
  plugins: [],
} satisfies Config;
