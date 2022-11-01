/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        blue: "#3CB4E5",
        black: colors.black,
        "dark-blue": "#051C2C",
        red: "#E1251B",
        yellow: "#FED925",
        white: colors.white,
        green: "#00AE42",
        orange: "#FF6B00",
        "light-green": "#A2D45E",
        purple: "#8E41CC",
      },
    },
  },
  plugins: [],
};
