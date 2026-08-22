/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/constants/UI";

export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: COLORS.BACKGROUND,
        primary: COLORS.PRIMARY,
        secondary: COLORS.SECONDARY,

        orange: COLORS.ORANGE,
      },
      borderRadius: {
        normal: "3px",
      },
      fontFamily: {
        nunito: ['"Nunito Sans"', "sans-serif"],
        lexend: ['"Be Vietnam Pro"', "sans-serif"],
      },
      boxShadow: {
        text: "2px 2px 4px rgba(0,0,0,0.3)",
      },
    },
    screens: {
      sm: "576px", // mobile lớn
      md: "768px", // tablet
      lg: "992px", // laptop nhỏ
      xl: "1200px", // desktop thường
      "2xl": "1600px", // desktop lớn
    },
    token: {
      colorPrimary: "#006EC4", // màu chính toàn hệ thống
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
      });
    },
  ],
};
