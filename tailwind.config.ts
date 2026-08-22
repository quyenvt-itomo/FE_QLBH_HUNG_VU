/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/shared/constants/ui";

export default {
  darkMode: "class",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: COLORS.BACKGROUND,
        primary: COLORS.PRIMARY,
        secondary: "var(--text-secondary)",
      },
      borderRadius: {
        normal: "3px",
      },
      fontFamily: {
        nunito: ['"Nunito Sans"', "sans-serif"],
        lexend: ['"Be Vietnam Pro"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        text: "2px 2px 4px rgba(0,0,0,0.3)",
      },
      fontSize: {
        "2xs": ["10px", "14px"], //
      },
    },
    screens: {
      sm: "576px", // mobile lớn
      md: "768px", // tablet
      lg: "992px", // laptop nhỏ
      xl: "1200px", // desktop thường
      "2xl": "1600px", // desktop lớn
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        ".text-shadow-sm": {
          textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
        },
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        },
        ".text-shadow-md": {
          textShadow: "4px 4px 6px rgba(0,0,0,0.35)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".bg-panel": {
          backgroundColor: "var(--bg-panel)",
        },
        ".action-sticky": {
          "--tw-gradient-from": "var(--bg-panel) var(--tw-gradient-from-position)",
          "--tw-gradient-to": "transparent var(--tw-gradient-to-position)",
          "--tw-gradient-stops":
            "var(--tw-gradient-from), var(--bg-panel) var(--tw-gradient-via-position), var(--tw-gradient-to)",
          backgroundImage: "linear-gradient(to left, var(--tw-gradient-stops))",
          position: "sticky",
          right: "-1px",
        },
        ".sticky-left": {
          position: "sticky",
          left: -1,
          zIndex: 9,
        },
        ".sticky-right": {
          position: "sticky",
          right: -1,
          zIndex: 9,
        },
        ".action-sticky-bottom": {
          "--tw-gradient-from": "var(--bg-panel) var(--tw-gradient-from-position)",
          "--tw-gradient-to": "transparent var(--tw-gradient-to-position)",
          "--tw-gradient-stops":
            "var(--tw-gradient-from), var(--bg-panel) var(--tw-gradient-via-position), var(--tw-gradient-to)",
          backgroundImage: "linear-gradient(to top, var(--tw-gradient-stops))",
          position: "sticky",
          bottom: "0",
          zIndex: 10,
        },
      });
    },
  ],
};
