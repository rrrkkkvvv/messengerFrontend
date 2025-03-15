/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
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

      gray: {
        50: "#d4d5d6",
        100: "#6B6E70",
        200: "#474B4F",
        300: "#222629",
      },
      white: "#fff",
      black: "#333",
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
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

        reverseSpin: "reverseSpin 0.5s ease-in-out infinite",
        scale: "scale 0.3s linear infinite",
        leftSlide: "leftSlide 0.2s linear infinite",
      },
    },
  },
  plugins: [],
};
