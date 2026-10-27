# Tour Virtual 360 · sitio web

Sitio de una página de **Tour Virtual 360**: tours virtuales 360° y video con dron para alojamientos, inmuebles y comercios de Montevideo y Canelones, Uruguay.

- En producción: https://tourvirtual360.pro

![Inicio del sitio: toma con dron de la costa de Santa Ana, Canelones](images/hero/costa-desk-1280.webp)

## Qué resuelve

- **Rápido en el celular.** El CSS va incrustado en el `<head>` (lo genera `scripts/inline-css.js` en el build), la foto del inicio pesa 17-30 KB en AVIF con WebP de respaldo, no se cargan fuentes externas y Google Tag Manager entra después del evento `load`. En la vista previa del 19/10/2026, PageSpeed Insights móvil pasó de 87-88 a 99-100.
- **Portafolio liviano.** Los reels y los tours 360 de trabajos reales bajan solo cuando se tocan, dentro de un `<dialog>`; el botón Atrás del celular cierra el visor sin salir de la página.
- **Consultas directo a WhatsApp.** El formulario arma el mensaje con los datos (servicios, tipo de lugar y zona) y abre WhatsApp con la consulta escrita: la persona solo la envía. No pasa por ningún servidor ni guarda datos en la web.
- **Medición confiable.** GA4 y Google Ads por Tag Manager: la conversión cuenta solo los clics que abren WhatsApp, desde los botones o desde el formulario.
- **SEO y datos estructurados.** schema.org `LocalBusiness` con `OfferCatalog` y `FAQPage`, alineados con el texto visible; Open Graph, `sitemap.xml`, `robots.txt` y una `404.html` propia.
- **Seguridad.** `_headers` define Content-Security-Policy, HSTS, `X-Frame-Options`, `Permissions-Policy` y la caché de cada tipo de archivo; `_redirects` saca de la vista los archivos del repositorio que no son parte del sitio.

## Stack

HTML · Tailwind CSS 3 · JavaScript sin framework · Cloudflare Pages y Pages Functions · Google Tag Manager y GA4

## Estructura

```
index.html                 Página: HTML, CSS incrustado y datos estructurados
404.html                   Página de error (responde 404, sin indexar)
main.js                    Visor del portafolio, formulario y eventos de medición
styles.css                 Estilos propios (se incrustan en el build)
assets/css/input.css       Entrada de Tailwind
scripts/inline-css.js      Incrusta el CSS compilado en index.html
scripts/servidor-local.py  Servidor de prueba sin GTM, con la CSP de producción
_headers, _redirects       Headers de seguridad y caché; redirecciones de Cloudflare
images/                    Foto del inicio, posters del portafolio, imagen para redes
videos/                    Reels del portafolio en 720×1280
```

## Desarrollo local

```bash
npm install
npm run build:css                     # compila Tailwind, minifica e incrusta el CSS
python -I scripts/servidor-local.py   # http://127.0.0.1:8360
```

El servidor de prueba saca Google Tag Manager (las pruebas no suman visitas en GA4), aplica la misma CSP que producción y responde pedidos parciales de video como Cloudflare.

El CSS entre los marcadores `css-inline:inicio` y `css-inline:fin` de `index.html` no se edita a mano: lo regenera `npm run build:css`. Si cambia `main.js`, se cambia también su versión en `index.html` (`main.js?v=AAAAMMDD`), porque la caché de Cloudflare lo guarda hasta 4 horas.

## Despliegue

Cloudflare Pages conectado a este repositorio: cada push a `main` publica el sitio y cada rama tiene su vista previa. Build command: `npm run build:css`.

## Autoría

Diseño, desarrollo, fotos, video y tours: **Javier Perez** · https://jperez.pages.dev

© 2026 Javier Perez. El código se publica como muestra de trabajo. Las fotos, los videos y los tours pertenecen a Tour Virtual 360 y a sus clientes, y no se licencian para reutilización.

---

**In English:** one-page website for Tour Virtual 360, a 360° virtual tour and drone video service in Uruguay. Static HTML and Tailwind CSS on Cloudflare Pages, with a contact form that opens WhatsApp with the request already written.
