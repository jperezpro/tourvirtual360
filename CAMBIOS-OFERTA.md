# Oferta nueva en tourvirtual360.pro (16/11/2026)

Rama local `oferta-2026-11-16`, sin push. Sale de la sección 3 y los cambios 6 y 7 del
diagnóstico «Diagnosticar por qué no se vende la oferta de Tour Virtual y Essenza»
(Planificación, Notion), aprobado por Javier el 16/11/2026.

## Qué cambió

- **Qué es, arriba de todo.** El h1 pasa de «Que recorran tu lugar antes de venir» a
  «Fotos profesionales y recorrido 360 de tu propiedad», con la frase fija debajo: «Es un
  recorrido de toda la casa desde el celular, como si estuvieras adentro».
- **Precios en pesos, por propiedad:** fotos y recorrido 360, 5.600 pesos; video con dron
  y reel, 2.800; solo fotos HDR, 2.500 (tarjeta nueva); sitio web propio, 670 pesos por mes.
  Nada en U$S. Traslado incluido en Montevideo y Canelones. Seña del 30 % por transferencia o Mercado Pago (17/11).
- **Sección nueva «Para inmobiliarias»** (`#inmobiliarias`, también en el menú) con su botón
  a WhatsApp (`cta-inmobiliarias`, con `gtm-cta`) y una línea para fotógrafos inmobiliarios.
- **Zona:** solo Montevideo y Canelones (ver el ajuste del 17/11/2026).
- **Fuera lo que el chat no sostiene:** «Satisfacción Garantizada / devolución del 100%»,
  «Sin costo inicial» y los plazos 24-48 hs y 3-5 días. Queda un solo plazo: 48 horas.
- **Pregunta nueva «¿Qué es un recorrido 360?»**, en la página y en el `FAQPage`.
- **Botones a WhatsApp:** los mensajes dicen «fotos y recorrido 360 de mi propiedad» en vez
  de «tour 360». El formulario suma «Inmobiliaria» y «Casa de temporada» y el servicio
  «Solo fotos».
- **Título, descripción y redes:** con las palabras que la gente busca («fotografía
  inmobiliaria», «fotógrafo de inmuebles»).
- `npm run build:css` regeneró el CSS incrustado; `CAMBIOS-OFERTA.md` va a `_redirects`
  para que no quede público.

Revisado en el navegador de la app a 375 px (sin desborde horizontal) y con los JSON-LD
validados. No se tocó `main.js`, GTM ni la medición.

## Para publicar

Frase para el sí: **«Publicá las webs nuevas»** (sale junto con la rama del mismo nombre
del repo `jperez`). Con ese sí: merge de `oferta-2026-11-16` a `main` y push; Cloudflare
Pages publica solo. Después, abrir tourvirtual360.pro en el celular y probar un botón de
WhatsApp.

## Ajustes del 17/11/2026, antes de publicar

- Seña del 30 % (antes 50 %), por transferencia o Mercado Pago, antes de agendar.
- 20 fotos editadas en las tarjetas, el `FAQPage` y las ofertas del JSON-LD.
- Ejemplo principal: el tour de El Sandú, con un link en el inicio y un botón en `#web`.
- Instagram javierprff en `sameAs`.
- Sin Maldonado (decisión de Javier, 17/11/2026: queda lejos para el precio y no se le
  suma un recargo a nadie cuando el precio va en el anuncio). Zona: Montevideo y Canelones,
  traslado incluido; fuera el «+1.000 pesos» de traslado de la etiqueta del inicio, la
  tarjeta de inmobiliarias, la nota de precios, las preguntas, el pie, las metas y `areaServed`.
