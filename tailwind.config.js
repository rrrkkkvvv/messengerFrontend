import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      blue: {
        50: "#6969e5",
      },
      green: {
        100: "#dcebc0",

        200: "#86C232",

        700: "#314513",
      },
      red: {
        100: "#DC143C",
      },
      gray: {
        50: "#e5e5e5",
        100: "#454545",
        200: "#2e2f2f",
        250: "#262626",
        300: "#212121",

        350: "#18191d",
        400: "#171717",
      },
      white: "#fff",
      black: "#000",
    },
    extend: {
      keyframes: {
        dropDown: {
          "0%": { opacity: 0, height: 0 },
          "50%": { height: "150px" },

          "100%": { opacity: 1 },
        },
        expand: {
          "0%": { height: "150px" },
          "20%": {},
          "100%": { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        shake: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(15deg)" },
          "20%": { transform: "rotate(-15deg)" },
          "30%": { transform: "rotate(15deg)" },
          "40%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        elevate: {
          "0%, 20%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, -20px)" },
          "80%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeOut: "fadeOut 0.3s ease-out",
        shake: "shake 2s ease-in-out infinite",
        elevate: "elevate 2s ease-in-out infinite",
        dropDown: "dropDown 0.3s ease-out",
        expand: "expand 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
