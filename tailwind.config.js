/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ajoute les extensions que tu utilises
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
};