// Pages Function que corre antes de servir el sitio (las rutas las fija
// _routes.json: /images/* y /videos/* no pasan por aca, para no gastar una
// invocacion por cada foto o pedido parcial de video).
//
// Pages publica toda la carpeta del repo. _redirects manda a la portada las
// rutas exactas (/README.md, /package.json...), pero no cubre la misma ruta
// escrita de otra forma (/README%2Emd, //README.md). Aca la ruta se compara
// decodificada y normalizada (sin %2E, barras repetidas, barras invertidas ni
// segmentos ".."), en minusculas, y lo que no es parte del sitio da 404.
const INTERNO = [
  /\.md$/,
  /\/\.(?!well-known\/)/,
  /^\/package(-lock)?\.json$/,
  /^\/(tailwind|postcss)\.config\.js$/,
  /^\/(scripts|functions|node_modules)\//,
  /^\/_(headers|redirects|routes\.json)$/,
];

function rutaNormalizada(pathname) {
  let p;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  p = p.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  return new URL(p, 'https://x').pathname.toLowerCase();
}

export async function onRequest({ request, next }) {
  const ruta = rutaNormalizada(new URL(request.url).pathname);
  if (ruta === null || INTERNO.some((re) => re.test(ruta))) {
    return new Response('No encontrado', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return next();
}
