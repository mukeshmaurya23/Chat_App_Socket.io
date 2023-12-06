const { colorTheme } = require("./src/theme/colorTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: colorTheme,
    },
  },
  plugins: [],
};
