# Tour Virtual 360UY - Tours 360 para Airbnb y Booking

Sitio web responsivo para servicios de tours virtuales 360 y dron en Montevideo y Canelones.

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
Esto recompila automáticamente mientras escribes.

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
├── assets/
│   └── css/
│       ├── input.css       # Entrada de Tailwind (edita esto para CSS)
│       └── style.css       # CSS compilado (generado automáticamente)
└── images/                 # Imágenes y recursos
```

## 🎨 Editar CSS

### Cambios en CSS existentes:
Edita `styles.css` directamente. Se refleja automáticamente en Live Server.

### Cambios en utilidades/componentes Tailwind:
1. Edita `assets/css/input.css`
2. En terminal: `npm run build:css` (compila una vez)
3. O: `npm run dev:css` (watch mode - se compila automático)
4. Actualiza el navegador

## 🚀 Desplegar a Cloudflare Pages

1. **Primer deploy**: Conecta tu repositorio de GitHub en Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build:css`
   - Publish directory: (root) o `.`
3. Los headers de seguridad se aplican automáticamente desde `_headers`

## 📝 Información de Desarrollo

- **Framework**: HTML5 + Tailwind CSS v3 + Vanilla JavaScript
- **CSS Compilado**: Tailwind genera automáticamente `assets/css/style.css`
- **Semántica HTML**: Jerarquía H1 → H2 → H3 (perfecta para SEO)
- **Accesibilidad**: Estados `:hover` y `:focus` en todos los elementos interactivos
- **Performance**: Google Fonts optimizadas con `display=swap`, imágenes lazy-loaded

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
| `npm run build:css` | Compila CSS una sola vez |
| `npm run dev:css` | Watch mode - compila automático mientras editas |

## 🔍 Checklist antes de mergear cambios

- [ ] Probé con Live Server y se ve bien
- [ ] Si cambié `assets/css/input.css`, ejecuté `npm run build:css`
- [ ] El HTML valida sin errores (F12 → Console)
- [ ] Los estados `:hover` y `:focus` funcionan
- [ ] Responsive en mobile, tablet y desktop

---

**⚠️ IMPORTANTE**: Siempre ejecuta `npm install` cuando clonas el proyecto por primera vez. Si algo no funciona o los cambios no se reflejan, probablemente olvidaste este paso.
