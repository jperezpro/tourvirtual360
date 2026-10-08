/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // index.html lleva el CSS incrustado (scripts/inline-css.js). Ese bloque no
    // son clases usadas: se saca antes de escanear para que el CSS no crezca solo.
    transform: {
      html: (contenido) =>
        contenido.replace(/<!-- css-inline:inicio -->[\s\S]*?<!-- css-inline:fin -->/, ""),
    },
  },
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
