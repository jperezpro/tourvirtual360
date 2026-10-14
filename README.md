# Tour Virtual 360UY - Tours 360 y Dron para inmuebles y comercios

Sitio web responsivo para servicios de tours virtuales 360 y dron para inmuebles, comercios y alojamientos en Montevideo y Canelones.

## 🚀 Setup Rápido

### Primera vez después de clonar:
```bash
npm install
```

Solo eso. Instala las dependencias y estás listo.

### Desarrollo Local

**Opción recomendada: `python -I scripts/servidor-local.py`** (servidor
`tourvirtual360` de `.claude/launch.json`, `http://127.0.0.1:8360`). Saca Google
Tag Manager de la página para que las pruebas no manden visitas a GA4 con
hostname 127.0.0.1, aplica la CSP de `_headers` y acepta pedidos parciales de
video como Cloudflare.

**Opción 1: Con Live Server (VS Code)** (ojo: carga GTM y cuenta visitas en GA4)
- Click derecho en `index.html` → "Open with Live Server"
- La web se abre en `http://localhost:5500`
- Los cambios se reflejan automáticamente

**Opción 2: Con watch mode automático del CSS**
Si editas `assets/css/input.css`, ejecuta:
```bash
npm run dev:css
```
Esto recompila `assets/css/style.css` mientras escribes. Ojo: la página usa el
CSS **incrustado** en `index.html`, así que al terminar corré `npm run build:css`
para que el cambio llegue a la página.

## 📁 Estructura del Proyecto

```
├── index.html              # Página principal
├── main.js                 # JavaScript interactivo
├── styles.css              # Estilos personalizados
├── _headers                # Headers de seguridad (Cloudflare)
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── package.json            # Dependencias (npm install)
├── tailwind.config.js      # Config de Tailwind CSS
├── postcss.config.js       # Config de PostCSS
├── .gitignore              # Archivos ignorados en Git
├── scripts/
│   ├── inline-css.js       # Incrusta style.css + styles.css en index.html
│   └── servidor-local.py   # Servidor de prueba sin GTM (ver Desarrollo Local)
├── assets/
│   └── css/
│       ├── input.css       # Entrada de Tailwind (edita esto para CSS)
│       └── style.css       # CSS compilado y minificado (generado)
├── images/                 # Imágenes y recursos
│   └── portafolio/         # Posters de los reels (WebP, 360 y 540 px de ancho)
└── videos/                 # Reels del portafolio en versión web (720×1280)
```

## 🎬 Sumar un trabajo al portafolio

Cómo está armado (14/10/2026), con tres reglas de jvx: **un trabajo por bloque,
una sola acción por bloque y nunca dos trabajos lado a lado** (dos reels juntos
parecían un antes y después y obligaban a elegir; la decisión queda para los
precios):

- `#demo` ("Trabajos reales en 360°", después del hero): el reel de un
  alojamiento y, debajo, el tour 360 del mismo lugar. Arriba de la tarjeta del
  tour van las indicaciones de gestos (`<figure class="gestos">`, la imagen
  `images/gestures*` con un rótulo por mano); `main.js` las copia encima del
  tour cuando se abre y se van solas.
- `#reel` ("Reels para tus redes", entre los beneficios y las garantías): el
  reel de otro alojamiento, lejos del primero.

Con la página solo bajan imágenes lazy; el reel y el tour se cargan al tocar,
en el visor `#visor` (`main.js`), y se descartan al cerrarlo. Como máximo tres
bloques: un trabajo nuevo **reemplaza** a uno de los que están, no se suma un
cuarto.

1. **Reel para web** (el de 4K es para redes, no para la página). Desde la raíz
   del repo, con el slug del tour (`tours.tourvirtual360.pro/<slug>/`):

   ```bash
   ffmpeg -i "<reel 4K>.mp4" -map 0:v:0 -map 0:a:0 -map_metadata -1 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset slow -crf 23 -maxrate 2500k -bufsize 5000k -profile:v high -level 4.0 -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -ac 2 -ar 48000 -movflags +faststart videos/<slug>-720.mp4
   ```

   Sale en ~2,5 Mbps: un reel de 70 s pesa ~23 MB. **Cloudflare Pages no acepta
   archivos de más de 25 MiB**: un reel de más de ~75 s necesita `-maxrate`
   más bajo. `+faststart` hace que empiece a reproducirse sin bajarlo entero.
   Se probó bajar a 1,8 y 1,5 Mbps (14-17 MB): la calidad medida con VMAF cae
   4-8 puntos (El Villorrio queda debajo de 80, con artefactos en el follaje
   del dron), y como el video baja solo al tocarlo, no vale la pena. Partir del
   export 4K de DaVinci (H.264 a ~70 Mbps) es tan bueno como exportar directo a
   720p. Si se vuelve a exportar un reel, va con otro nombre
   (`<slug>-720b.mp4`): `/videos/*` se cachea un año.
2. **Poster**: un cuadro lindo del reel (`-ss` = segundo), en dos anchos:

   ```bash
   ffmpeg -ss 20 -i "<reel 4K>.mp4" -frames:v 1 -vf "scale=360:-2:flags=lanczos" -c:v libwebp -quality 72 images/portafolio/<slug>-360.webp
   ffmpeg -ss 20 -i "<reel 4K>.mp4" -frames:v 1 -vf "scale=540:-2:flags=lanczos" -c:v libwebp -quality 72 images/portafolio/<slug>-540.webp
   ```
3. **Poster del tour** (si el trabajo va en `#demo`): la vista inicial real del
   tour, sacada de la foto 360 original con la `vista` de la primera escena de
   `tour.json`. Ojo: en ffmpeg `v360` el pitch positivo es hacia arriba y en
   Marzipano hacia abajo, así que va con el signo cambiado:

   ```bash
   ffmpeg -i "../tours-360/tours/<slug>/fotos/<foto de la 1ª escena>.jpg" -vf "v360=e:flat:yaw=<yaw>:pitch=<-pitch>:h_fov=100:v_fov=67.6:w=1920:h=1080:interp=lanczos" -q:v 2 tour.jpg
   ffmpeg -i tour.jpg -vf "scale=640:-2:flags=lanczos" -c:v libwebp -quality 65 images/portafolio/<slug>-tour-640.webp
   ffmpeg -i tour.jpg -vf "scale=960:-2:flags=lanczos" -c:v libwebp -quality 65 images/portafolio/<slug>-tour-960.webp
   ```

   Topes: ~22 KB y ~40 KB (si no, `-quality 60`). Si la foto tiene retoques
   (`retoques.json`), usar la `_retocada.jpg`. Si se regenera, va con otro
   nombre (`-tour-b-960.webp`): `/images/*` se cachea un año.
4. **Bloque**: cambiar en `index.html` slug, nombre, zona, duración, textos
   alternativos y `data-titulo` del bloque que se reemplaza. Los links no llevan
   `gtm-cta` (no son contactos: no deben contar como conversión de la campaña)
   y el del tour va sin `target` (ver el comentario en el HTML).
5. `npm run build:css` si hay clases nuevas, probar con
   `scripts/servidor-local.py` a 375 y a 1280 px y publicar (push a `main`).
   Después, medir PSI móvil.

## 🎨 Editar CSS

El CSS no se carga como archivo aparte: va **incrustado** en un `<style>` de
`index.html`, entre los marcadores `css-inline:inicio` y `css-inline:fin`. Así la
página se pinta apenas llega el HTML, sin esperar hojas de estilo (en celular
eso era lo que más demoraba la primera pintada). Lo que hay entre los marcadores
no se edita a mano: lo regenera `npm run build:css`.

### Cambios en CSS existentes:
1. Edita `styles.css`
2. En terminal: `npm run build:css`
3. Actualiza el navegador

### Cambios en utilidades/componentes Tailwind (o clases nuevas en el HTML):
1. Edita `assets/css/input.css` o las clases en `index.html`
2. En terminal: `npm run build:css` (compila, minifica e incrusta)
3. Actualiza el navegador

## 🚀 Desplegar a Cloudflare Pages

1. **Primer deploy**: Conecta tu repositorio de GitHub en Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build:css`
   - Publish directory: (root) o `.`
3. Los headers de seguridad se aplican automáticamente desde `_headers`

## 📝 Información de Desarrollo

- **Framework**: HTML5 + Tailwind CSS v3 + Vanilla JavaScript
- **CSS Compilado**: Tailwind genera `assets/css/style.css` (minificado) y `scripts/inline-css.js` lo incrusta en `index.html` junto con `styles.css`
- **Semántica HTML**: Jerarquía H1 → H2 → H3 (perfecta para SEO)
- **Accesibilidad**: Estados `:hover` y `:focus` en todos los elementos interactivos
- **Performance**: CSS incrustado (ninguna hoja de estilos bloquea el render), fuentes del sistema (sin Google Fonts), imágenes en WebP y lazy-loaded

## ✨ Características

✅ Portafolio: tours 360 propios (tours.tourvirtual360.pro) y reels, cargados al tocar  
✅ Botón flotante WhatsApp  
✅ FAQ interactivo con `<details>`  
✅ JSON-LD schema para SEO  
✅ Responsive design (mobile-first)  
✅ Seguridad headers configurados  
✅ Sitemap y robots.txt  

## 📞 Scripts NPM Disponibles

| Comando | Qué hace |
|---------|----------|
| `npm install` | Instala dependencias (ejecutar después de clonar) |
| `npm run build:css` | Compila y minifica el CSS y lo incrusta en `index.html` |
| `npm run dev:css` | Watch mode de `style.css` (después correr `build:css` para incrustarlo) |

## 🔍 Checklist antes de mergear cambios

- [ ] Probé con Live Server y se ve bien
- [ ] Si cambié `assets/css/input.css`, `styles.css` o clases en `index.html`, ejecuté `npm run build:css`
- [ ] El HTML valida sin errores (F12 → Console)
- [ ] Los estados `:hover` y `:focus` funcionan
- [ ] Responsive en mobile, tablet y desktop

---

**⚠️ IMPORTANTE**: Siempre ejecuta `npm install` cuando clonas el proyecto por primera vez. Si algo no funciona o los cambios no se reflejan, probablemente olvidaste este paso.
