/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Clases que main.js aplica en runtime (estados del formulario de contacto).
  // Tailwind no las ve al escanear el HTML, asi que hay que declararlas.
  safelist: [
    "text-green-400",
    "text-red-400",
    "text-gray-400",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
