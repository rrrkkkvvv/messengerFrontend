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
      red: {
        100: "#DC143C",
      },
      gray: {
        50: "#d4d5d6",
        100: "#6B6E70",
        200: "#474B4F",
        300: "#222629",
      },
      white: "#fff",
      black: "#000",
    },
    extend: {
      keyframes: {
        dots: {
          "0%": { content: "''" },
          "25%": { content: "'.'" },
          "50%": { content: "'..'" },
          "75%": { content: "'...'" },
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
        dropDown: "dropDown 0.3s ease-out",
        dots: "dots 1.5s steps(4) infinite",

        reverseSpin: "reverseSpin 0.5s ease-in-out infinite",
        scale: "scale 0.3s linear infinite",
        leftSlide: "leftSlide 0.2s linear infinite",
      },
    },
  },
  plugins: [],
};
