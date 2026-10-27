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
  theme: {
    extend: {},
  },
  plugins: [],
}
