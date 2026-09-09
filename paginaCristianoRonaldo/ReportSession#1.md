# ReportSession #1 — Sitio "Cristiano Ronaldo"

**Fecha:** 2026-09-07
**Carpeta de trabajo:** `paginaCristianoRonaldo/`
**Rama git:** `main`
**Stack:** HTML + CSS + JavaScript vanilla. Sin frameworks, sin backend, sin dependencias.
**Herramientas usadas para validar:** Node.js v24.15.0 (`node --check`, scripts de comprobación, servidor estático de prueba) y `curl`.

---

## 1. Objetivo de la sesión

Construir desde cero la primera versión de un sitio web estático en español sobre
Cristiano Ronaldo, con estructura semántica, navegación interna, biografía, línea de
tiempo interactiva, estadísticas, galería con imágenes reales, enlaces funcionales,
foco visible y diseño responsive. Después, revisar esa primera versión desde la
terminal y corregir los problemas detectados sin añadir frameworks.

---

## 2. Estado inicial del repositorio

- La carpeta `paginaCristianoRonaldo/` **no existía**; se creó en esta sesión.
- El repo solo contenía `CLAUDE.md`, `README.md` y `.gitignore`.
- No hay framework de build ni suite de tests en el proyecto.

---

## 3. Archivos creados

| Archivo | Contenido |
|---|---|
| `paginaCristianoRonaldo/index.html` | Documento HTML5 semántico con todo el contenido. |
| `paginaCristianoRonaldo/styles.css` | Estilos: variables CSS, modo claro/oscuro, responsive, foco visible. |
| `paginaCristianoRonaldo/script.js` | JavaScript vanilla (IIFE + `"use strict"`), 7 funciones. |
| `paginaCristianoRonaldo/ReportSession#1.md` | Este informe. |

---

## 4. Estructura del sitio (`index.html`)

- `<head>`: `charset`, `viewport`, `meta description`, `meta author`, `<title>`,
  `preconnect` a Wikimedia y `<link>` a `styles.css`.
- Enlace **"Saltar al contenido"** (`.salto-contenido`) como primer elemento del `body`.
- `<header id="inicio">`: marca, `<h1>`, descripción y `<nav aria-label>` con botón
  de menú (`#menuBoton`, `aria-expanded`, `aria-controls`) y lista `#menuLista`.
- `<main id="contenido">` con 5 `<section>`, cada una con `aria-labelledby`:
  1. **`#biografia`** — 3 párrafos de prosa.
  2. **`#trayectoria`** — `<ol id="lineaTiempo">` con 6 hitos (2002, 2003, 2009, 2016,
     2018, 2023). Cada hito: `<button type="button" aria-expanded="false">` +
     `<div class="linea-tiempo__detalle" hidden>`.
  3. **`#estadisticas`** — 4 tarjetas de cifras (`data-contador`, `data-sufijo`),
     grupo de botones de filtro (`.filtro__boton` con `data-club`) y
     `<table id="tablaEstadisticas">` con `<caption>`, `scope` en cabeceras y
     contenedor `.tabla-scroll` para scroll horizontal.
  4. **`#galeria`** — `<ul>` con 3 imágenes de Wikimedia Commons; cada una en un
     `<button class="galeria__disparador" data-ampliada="...">` con `<img>`
     (`alt` descriptivo, `loading="lazy"`, `width`/`height`) y `<figcaption>`.
  5. **`#fuentes`** — 3 enlaces externos con `target="_blank"` y
     `rel="noopener noreferrer"`.
- `<footer class="pie">`: texto informativo, año (`<span id="anioActual">`) y enlace
  "Volver arriba" (`#inicio`).
- Modal de galería `<div class="visor" id="visor" hidden>` con fondo, `<figure
  role="dialog" aria-modal="true">`, botón de cerrar y `<img id="visorImagen">`.
- `<script src="script.js">` al final del `body`.

### Imágenes de la galería (Wikimedia Commons, licencias libres)

| Archivo | Uso | `alt` |
|---|---|---|
| `Cristiano_Ronaldo_2018.jpg` | Real Madrid (2018) | "Cristiano Ronaldo con la camiseta blanca del Real Madrid durante un partido en 2018, corriendo por el campo." |
| `Cristiano_Ronaldo_20120609.jpg` | Portugal, Eurocopa 2012 | "Cristiano Ronaldo con la camiseta de la selección de Portugal en la Eurocopa 2012, preparándose para golpear el balón." |
| `Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis,_September_2023_(cropped).jpg` | Al-Nassr (2023) | "Cristiano Ronaldo con la camiseta amarilla del Al-Nassr en un partido de septiembre de 2023 frente al Persépolis." |

> Requieren conexión a internet (se sirven desde `upload.wikimedia.org`).

---

## 5. Estilos (`styles.css`)

- Variables CSS en `:root`; paleta alternativa bajo `@media (prefers-color-scheme: dark)`.
- Soporte de `@media (prefers-reduced-motion: reduce)` (desactiva animaciones y scroll suave).
- **Foco visible** global con `:focus-visible` (contorno ámbar de 3 px).
- Contenedor fluido (`width: min(100% - 2.5rem, 1080px)`), tipografía con `clamp()`.
- Componentes: cabecera con degradado, tarjetas, línea de tiempo con eje y nodos,
  tabla con scroll horizontal, galería en grid `auto-fit`, modal centrado.
- Responsive: breakpoint en `720px` (menú colapsable, ajustes de la galería).

---

## 6. JavaScript (`script.js`)

IIFE con `"use strict"`; todo se inicializa en `DOMContentLoaded`. Cada función
comprueba que sus elementos existan antes de actuar.

| # | Función | Qué hace |
|---|---|---|
| 1 | `inicializarMenu` | Menú responsive; alterna `hidden`/`aria-expanded`; se cierra al pulsar un enlace en móvil; recalcula estado al cambiar el breakpoint. |
| 2 | `inicializarResaltadoNavegacion` | `IntersectionObserver` que marca `.is-activo` en el enlace de la sección visible. |
| 3 | `inicializarLineaTiempo` | Clic en cada `<button>` de hito alterna `aria-expanded` y el `hidden` del detalle. Teclado nativo (`Enter`/`Espacio`). |
| 4 | `inicializarFiltroEstadisticas` | Los botones de filtro muestran/ocultan filas de la tabla por `data-club` y marcan el botón activo. |
| 5 | `inicializarContadores` | Animación de conteo (0 → valor) con `requestAnimationFrame` al entrar en viewport; respeta `prefers-reduced-motion`; con fallback si no hay `IntersectionObserver`. |
| 6 | `inicializarVisorGaleria` | Abre/cierra el modal; mueve el foco al botón de cerrar y lo devuelve al disparador; cierra con `×`, clic en el fondo (`[data-cerrar]`) o `Escape`; bloquea el scroll del `body`. |
| 7 | `mostrarAnioActual` | Escribe el año actual en `#anioActual`. |
|   | `aniadirCambioMedia` | Utilidad de compatibilidad `MediaQueryList` (`addEventListener` / `addListener`). |

---

## 7. Revisión / QA realizada desde la terminal

| Comprobación | Método | Resultado |
|---|---|---|
| `index.html` carga `styles.css` y `script.js` | regex sobre `<link>` y `<script src>` | OK |
| Existencia de los 3 archivos | `fs.existsSync` | OK |
| Enlaces internos → destino | 7 anclas (`#contenido`, `#biografia`, `#trayectoria`, `#estadisticas`, `#galeria`, `#fuentes`, `#inicio`) vs. `id` del documento | Las 7 resuelven |
| `alt` descriptivo en imágenes | extracción de los `<img>` | 3/3 en la galería con `alt` en español; el `<img>` del visor usa marcador (correcto) |
| Línea de tiempo por teclado | inspección del marcado | 6 hitos como `<button type="button">` → foco con `Tab`, activación con `Enter`/`Espacio` nativos |
| Sintaxis JavaScript | `node --check script.js` | Sin errores |
| Referencias JS → DOM | 7 `getElementById` + 9 selectores de clase cruzados con el HTML | Todos existen |
| Etiquetas de bloque balanceadas | conteo apertura/cierre (`section`, `nav`, `main`, `header`, `footer`, `ol`, `ul`, `table`) | Todas OK (5 `<section>`, etc.) |
| Llaves del CSS | conteo `{` / `}` | Balanceadas |
| Imágenes remotas (Wikimedia) | `curl` | Las 3 → `200 image/jpeg` |
| Enlaces externos | `curl` | Wikipedia ES y Wikimedia Commons → `200` |
| Servir con servidor local | servidor estático Node | `/`, `/styles.css`, `/script.js` → `200` con `Content-Type` correcto |
| Data URI del marcador del visor | decodificación base64 | 42 bytes, cabecera `GIF89a` válida |

---

## 8. Problemas encontrados y corregidos (sin frameworks)

### 8.1 `<img src="">` en el visor modal
- **Síntoma:** un `src` vacío hace que el navegador vuelva a solicitar el propio
  documento y no es válido según la especificación.
- **Corrección:**
  - `index.html`: el `<img id="visorImagen">` usa un GIF transparente de 1×1
    (`data:` URI) como marcador.
  - `script.js`: constante `IMAGEN_VACIA`; `cerrar()` restaura ese marcador y vacía
    el `alt` en lugar de asignar `""`.

### 8.2 Enlace externo a `uefa.com` no verificable
- **Síntoma:** no responde desde el entorno de pruebas (`curl` → `000`); no se puede
  confirmar que funcione.
- **Corrección (`index.html`):** sustituido por
  `https://es.wikipedia.org/wiki/Liga_de_Campeones_de_la_UEFA` (verificado `200`),
  manteniendo `rel="noopener noreferrer"` y el mismo tema.

### 8.3 El modal (`.visor`) y su botón "×" siempre visibles, bloqueando la pantalla
- **Síntoma:** un botón "×" en el centro de la pantalla que tapaba la vista y no
  respondía al clic.
- **Causa:** la regla de autor `.visor { display: grid }` prevalece sobre la regla
  por defecto del navegador `[hidden] { display: none }`, así que el atributo
  `hidden` del HTML nunca ocultaba el modal; al pulsar `×`, el JS ponía
  `visor.hidden = true` pero el CSS seguía forzando `display: grid`.
- **Corrección (`styles.css`, solo regla nueva):**
  ```css
  .visor[hidden] {
    display: none;
  }
  ```
- **Verificación:** llaves CSS balanceadas (81/81); la regla está presente.
  El visor solo se muestra al hacer clic en una imagen de la galería.

---

## 9. Estado actual

- Los 3 archivos del sitio existen y se sirven correctamente desde un servidor local.
- `node --check script.js`: sin errores de sintaxis.
- Todos los enlaces internos resuelven; enlaces externos verificados (`200`).
- Los 3 problemas detectados están corregidos.
- **No se ha creado ningún commit** (no se solicitó).

---

## 10. Cómo ejecutar el sitio

Desde `C:\Proyectos\ecommArticulos`:

```
npx serve paginaCristianoRonaldo
```
→ normalmente `http://localhost:3000`

Alternativas:
```
npx http-server paginaCristianoRonaldo -p 8080      # http://localhost:8080/index.html
```
o la extensión **Live Server** de VS Code →
`http://127.0.0.1:5500/paginaCristianoRonaldo/index.html`

> Tras cambios en el CSS, recargar con **Ctrl+F5** para saltar la caché.

---

## 11. Pendiente de probar manualmente en el navegador

La terminal no ejecuta el DOM; estos puntos necesitan un navegador real:

- Consola de DevTools **sin errores ni advertencias** en tiempo de ejecución.
- **Menú responsive** a ≤720 px: el botón "Menú" muestra/oculta la lista y se cierra
  al pulsar un enlace; el estado se recalcula al cruzar el breakpoint.
- **Resaltado de navegación** (`.is-activo`) siguiendo la sección visible al hacer scroll.
- **Línea de tiempo:** `Enter`/`Espacio` despliegan y pliegan; foco claramente visible.
- **Filtro de estadísticas:** cada club deja solo sus filas y marca el botón activo;
  "Todos" restaura.
- **Contadores:** animación 0 → valor al entrar en viewport; con "reducir movimiento"
  activado aparecen ya con el valor final.
- **Visor de galería:** abre al hacer clic, foco al botón de cerrar, cierra con `×`,
  clic en el fondo y `Escape`, devuelve el foco al disparador y bloquea el scroll
  del `body`. Confirmar además que el "×" ya **no** aparece al cargar la página.
- **Carga real de las 3 imágenes** de Wikimedia y aspecto de la galería.
- **Responsive** general y **modo claro/oscuro** (`prefers-color-scheme`) a distintos anchos.
- **Skip link** "Saltar al contenido" visible al tabular desde el inicio.

---

## 12. Limitaciones conocidas

- No hay framework de tests; la validación fue sintáctica, estructural y de servido HTTP.
- Las imágenes dependen de `upload.wikimedia.org` (requieren internet); el endpoint
  de miniaturas `/thumb/` estaba bloqueado en el entorno, así que se usan los
  originales con `loading="lazy"`.
- Las estadísticas son **aproximadas** (indicado en el `caption` y en una nota) y
  pueden variar según la fuente y la fecha.
- El modal no implementa "focus trap" completo (el foco puede salir del diálogo con
  `Tab`); se cierra con `Escape` y devuelve el foco al disparador.
