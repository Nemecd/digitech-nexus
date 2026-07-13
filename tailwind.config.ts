import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F3",
        navy: { DEFAULT: "#15417E", light: "#1C50A0" },
        gold: "#D98C1F",
        ink: "#1C2333",
        slate: "#4B5468",
        line: "#E7E4DC",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-inter)"],
        mono: ["var(--font-plex-mono)"],
      },
    },
  },
  plugins: [],
} satisfies Config;