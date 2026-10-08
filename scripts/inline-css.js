/**
 * Mete el CSS dentro de index.html, entre los marcadores css-inline.
 *
 * Por que: en celular, cada hoja de estilos externa es un pedido mas que
 * bloquea el primer render (en 4G lento, ~150 ms de latencia cada uno). Con
 * el CSS adentro del HTML, la pagina se pinta apenas llega el documento.
 *
 * Lo corre `npm run build:css` despues de compilar Tailwind. Toma, en este
 * orden (el mismo orden de cascada que tenian los dos <link>):
 *   1. assets/css/style.css  (Tailwind compilado y minificado)
 *   2. styles.css            (estilos propios; se le sacan comentarios y espacios)
 *
 * No toca nada fuera de los marcadores. Si no los encuentra, falla.
 */
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const htmlPath = path.join(raiz, 'index.html');
const tailwind = fs.readFileSync(path.join(raiz, 'assets', 'css', 'style.css'), 'utf8');
const propios = fs.readFileSync(path.join(raiz, 'styles.css'), 'utf8');

// Minificado conservador de styles.css: sin comentarios, espacios colapsados
// y sin espacios alrededor de llaves y punto y coma. No toca selectores.
const propiosMin = propios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .trim();

const css = (tailwind.trim() + '\n' + propiosMin).replace(/\r\n/g, '\n');
if (/<\/style/i.test(css)) {
    console.error('inline-css: el CSS contiene "</style"; no se puede incrustar.');
    process.exit(1);
}

const INICIO = '<!-- css-inline:inicio -->';
const FIN = '<!-- css-inline:fin -->';
const html = fs.readFileSync(htmlPath, 'utf8');
const i = html.indexOf(INICIO);
const f = html.indexOf(FIN);
if (i === -1 || f === -1 || f < i || html.indexOf(INICIO, i + 1) !== -1 || html.indexOf(FIN, f + 1) !== -1) {
    console.error('inline-css: no encontre los marcadores css-inline (uno de cada uno) en index.html.');
    process.exit(1);
}

// Respetar el fin de linea del archivo (CRLF en Windows con autocrlf, LF en el build).
const eol = html.includes('\r\n') ? '\r\n' : '\n';
const bloque = ('    <style>' + css + '</style>').replace(/\n/g, eol);
const nuevo = html.slice(0, i + INICIO.length) + eol + bloque + eol + '    ' + html.slice(f);
if (nuevo !== html) {
    fs.writeFileSync(htmlPath, nuevo);
    console.log(`inline-css: index.html actualizado (${Buffer.byteLength(css)} bytes de CSS).`);
} else {
    console.log('inline-css: sin cambios.');
}
