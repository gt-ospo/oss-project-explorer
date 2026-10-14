/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gtgold": "#a4925a",
        "gtgoldlight": "#bfb37c",
        "gtgolddark": "#6c6036",
        "gtblack": "#262626",
      }
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"]
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}

