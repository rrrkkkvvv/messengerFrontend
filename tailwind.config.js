import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      purple: {
        50: "#bca6f4",
        100: "#2c2734",
        150: "#918aa0",
        200: "#564875",
        250: "#221e2a",
        300: "#272131",
      },
      blue: {
        50: "#6969e5",
      },
      green: {
        50: "#f0f7e6",
        100: "#dcebc0",
        150: "#acc767",
        200: "#86C232",
        300: "#6fae2b",
        400: "#61892F",
        500: "#4b681f",
        600: "#3e571a",
        700: "#314513",
        800: "#26360e",
        900: "#1a2608",
      },
      red: {
        100: "#DC143C",
      },
      gray: {
        50: "#d4d5d6",
        100: "#6B6E70",
        200: "#474B4F",
        300: "#222629",
        350: "#18191d",
      },
      white: "#fff",
      black: "#000",
    },
    extend: {
      keyframes: {
        dots: {
          "0%": { opacity: 0 },
          "85%": { opacity: 1 },
          // "100%": { transform:  },
        },
        dropDown: {
          "0%": { opacity: 0, height: 0 },
          "50%": { height: "150px" },

          "100%": { opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        callPing: {
          "75%": { transform: "scale(1.5)", opacity: 0 },
          "100%": { transform: "scale(1.5)", opacity: 0 },
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
        reverseSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        scale: {
          "0%": { transform: "scale(100%)" },
          "50%": { transform: "scale(20%)" },
          "100%": { transform: "scale(100%)" },
        },
        leftSlide: {
          "0%": { transform: "translate(0,0)" },
          "100%": { transform: "translate(-100%,0)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        shake: "shake 2s ease-in-out infinite",
        elevate: "elevate 2s ease-in-out infinite",
        dropDown: "dropDown 0.3s ease-out",
        dots: "dots 1.5s steps(4) infinite",
        callPing: "callPing 1.5s infinite",
        reverseSpin: "reverseSpin 1s ease-in-out infinite",
        scale: "scale 0.3s linear infinite",
        leftSlide: "leftSlide 0.2s linear infinite",
      },
    },
  },
  plugins: [],
};
