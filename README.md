# Tour Virtual 360UY - Tours 360 y Dron para inmuebles y comercios

Sitio web responsivo para servicios de tours virtuales 360 y dron para inmuebles, comercios y alojamientos en Montevideo y Canelones.

## 🚀 Setup Rápido

### Primera vez después de clonar:
```bash
npm install
```

Solo eso. Instala las dependencias y estás listo.

### Desarrollo Local

**Opción 1: Con Live Server (VS Code)**
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
│   └── inline-css.js       # Incrusta style.css + styles.css en index.html
├── assets/
│   └── css/
│       ├── input.css       # Entrada de Tailwind (edita esto para CSS)
│       └── style.css       # CSS compilado y minificado (generado)
└── images/                 # Imágenes y recursos
```

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

✅ Tours virtuales 360 embebidos (Kuula)  
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
