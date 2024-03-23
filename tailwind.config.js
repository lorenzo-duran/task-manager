const breakpoints = require("./breakpoints");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      screens: breakpoints,
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
