/* ============================================================
   Cristiano Ronaldo — JavaScript vanilla
   Funciones:
   1. Menú de navegación responsive.
   2. Resaltado del enlace de la sección visible.
   3. Línea de tiempo interactiva (expandir/plegar).
   4. Filtro de la tabla de estadísticas por club.
   5. Animación de conteo en las tarjetas de cifras.
   6. Visor de imágenes (modal) para la galería.
   7. Año actual en el pie de página.
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    inicializarMenu();
    inicializarResaltadoNavegacion();
    inicializarLineaTiempo();
    inicializarFiltroEstadisticas();
    inicializarContadores();
    inicializarVisorGaleria();
    mostrarAnioActual();
  });

  /* ---------- 1. Menú responsive ---------- */
  function inicializarMenu() {
    var boton = document.getElementById("menuBoton");
    var lista = document.getElementById("menuLista");
    if (!boton || !lista) return;

    // Estado inicial segun el ancho de pantalla.
    var esMovil = window.matchMedia("(max-width: 720px)");
    aplicarEstadoMenu(esMovil.matches);

    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      lista.hidden = abierto;
      // Al abrir, el foco pasa a la primera opcion del menu.
      if (!abierto) {
        var primero = lista.querySelector("a");
        if (primero) primero.focus();
      }
    });

    // Al pulsar un enlace en movil, se cierra el menu y el foco viaja a la
    // seccion de destino (que se hace enfocable con tabindex="-1").
    lista.addEventListener("click", function (evento) {
      var enlace = evento.target.closest("a");
      if (!enlace || !esMovil.matches) return;

      boton.setAttribute("aria-expanded", "false");
      lista.hidden = true;

      var destino = document.querySelector(enlace.getAttribute("href"));
      if (destino) {
        destino.setAttribute("tabindex", "-1");
        destino.focus();
      } else {
        boton.focus();
      }
    });

    // Si cambia el tamano de la ventana, se recalcula.
    aniadirCambioMedia(esMovil, function (coincide) {
      aplicarEstadoMenu(coincide);
    });

    function aplicarEstadoMenu(coincideMovil) {
      if (coincideMovil) {
        lista.hidden = true;
        boton.setAttribute("aria-expanded", "false");
      } else {
        lista.hidden = false;
        boton.setAttribute("aria-expanded", "false");
      }
    }
  }

  /* ---------- 2. Resaltado del enlace activo ---------- */
  function inicializarResaltadoNavegacion() {
    var enlaces = Array.prototype.slice.call(
      document.querySelectorAll('.navegacion__lista a[href^="#"]')
    );
    if (!enlaces.length || !("IntersectionObserver" in window)) return;

    var secciones = enlaces
      .map(function (enlace) {
        return document.querySelector(enlace.getAttribute("href"));
      })
      .filter(Boolean);

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var id = entrada.target.id;
          enlaces.forEach(function (enlace) {
            var activo = enlace.getAttribute("href") === "#" + id;
            enlace.classList.toggle("is-activo", activo);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    secciones.forEach(function (seccion) {
      observador.observe(seccion);
    });
  }

  /* ---------- 3. Línea de tiempo interactiva ---------- */
  function inicializarLineaTiempo() {
    var lista = document.getElementById("lineaTiempo");
    if (!lista) return;

    var cabeceras = lista.querySelectorAll(".linea-tiempo__cabecera");
    Array.prototype.forEach.call(cabeceras, function (cabecera) {
      var detalle = cabecera.nextElementSibling;
      if (!detalle) return;

      cabecera.addEventListener("click", function () {
        var abierto = cabecera.getAttribute("aria-expanded") === "true";
        cabecera.setAttribute("aria-expanded", String(!abierto));
        detalle.hidden = abierto;
      });
    });
  }

  /* ---------- 4. Filtro de la tabla de estadísticas ---------- */
  function inicializarFiltroEstadisticas() {
    var contenedor = document.querySelector(".filtro");
    var tabla = document.getElementById("tablaEstadisticas");
    if (!contenedor || !tabla) return;

    var botones = contenedor.querySelectorAll(".filtro__boton");
    var filas = tabla.querySelectorAll("tbody tr");
    var estado = document.getElementById("filtroEstado");
    var total = filas.length;

    function aplicarFiltro(boton) {
      var club = boton.getAttribute("data-club");

      Array.prototype.forEach.call(botones, function (b) {
        var activo = b === boton;
        b.classList.toggle("is-activo", activo);
        b.setAttribute("aria-pressed", String(activo));
      });

      var visibles = 0;
      Array.prototype.forEach.call(filas, function (fila) {
        var coincide = club === "todos" || fila.getAttribute("data-club") === club;
        fila.hidden = !coincide;
        if (coincide) visibles++;
      });

      if (estado) {
        estado.textContent =
          "Mostrando " + visibles + " de " + total + " etapas.";
      }
    }

    contenedor.addEventListener("click", function (evento) {
      var boton = evento.target.closest(".filtro__boton");
      if (boton) aplicarFiltro(boton);
    });

    // Mensaje inicial sin anuncio intrusivo (el filtro activo es "Todos").
    if (estado) estado.textContent = "Mostrando " + total + " de " + total + " etapas.";
  }

  /* ---------- 5. Animación de conteo ---------- */
  function inicializarContadores() {
    var numeros = document.querySelectorAll(".tarjeta__numero[data-contador]");
    if (!numeros.length) return;

    var reduceMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function animar(elemento) {
      var destino = parseInt(elemento.getAttribute("data-contador"), 10) || 0;
      var sufijo = elemento.getAttribute("data-sufijo") || "";

      if (reduceMovimiento) {
        elemento.textContent = destino + sufijo;
        return;
      }

      var inicio = null;
      var duracion = 1200;

      function paso(marca) {
        if (inicio === null) inicio = marca;
        var progreso = Math.min((marca - inicio) / duracion, 1);
        var valor = Math.floor(progreso * destino);
        elemento.textContent = valor + (progreso === 1 ? sufijo : "");
        if (progreso < 1) {
          window.requestAnimationFrame(paso);
        }
      }

      window.requestAnimationFrame(paso);
    }

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(numeros, animar);
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas, obs) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          animar(entrada.target);
          obs.unobserve(entrada.target);
        });
      },
      { threshold: 0.5 }
    );

    Array.prototype.forEach.call(numeros, function (numero) {
      observador.observe(numero);
    });
  }

  /* ---------- 6. Visor de imágenes ---------- */
  function inicializarVisorGaleria() {
    var visor = document.getElementById("visor");
    var visorImagen = document.getElementById("visorImagen");
    var disparadores = document.querySelectorAll(".galeria__disparador");
    if (!visor || !visorImagen || !disparadores.length) return;

    // GIF transparente de 1x1 usado como marcador cuando el visor esta cerrado.
    var IMAGEN_VACIA =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    var ultimoDisparador = null;

    // Hace inerte (no enfocable ni leible) todo el contenido de fondo mientras
    // el modal esta abierto, y lo restaura al cerrar.
    function fondoInerte(activar) {
      Array.prototype.forEach.call(document.body.children, function (hijo) {
        if (hijo === visor || hijo.tagName === "SCRIPT") return;
        if (activar) {
          hijo.setAttribute("inert", "");
          hijo.setAttribute("aria-hidden", "true");
        } else {
          hijo.removeAttribute("inert");
          hijo.removeAttribute("aria-hidden");
        }
      });
    }

    function elementosFocoables() {
      var candidatos = visor.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      return Array.prototype.filter.call(candidatos, function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
    }

    function abrir(disparador) {
      var url = disparador.getAttribute("data-ampliada");
      var img = disparador.querySelector("img");
      if (!url) return;

      visorImagen.src = url;
      visorImagen.alt = img ? img.alt : "";
      visor.hidden = false;
      document.body.style.overflow = "hidden";
      ultimoDisparador = disparador;

      // Primero se mueve el foco dentro del modal y despues se inerta el fondo,
      // para no dejar el foco en un elemento con aria-hidden.
      var cerrarBoton = visor.querySelector(".visor__cerrar");
      if (cerrarBoton) cerrarBoton.focus();
      fondoInerte(true);
    }

    function cerrar() {
      visor.hidden = true;
      visorImagen.src = IMAGEN_VACIA;
      visorImagen.alt = "";
      document.body.style.overflow = "";
      fondoInerte(false);
      if (ultimoDisparador) {
        ultimoDisparador.focus();
        ultimoDisparador = null;
      }
    }

    Array.prototype.forEach.call(disparadores, function (disparador) {
      disparador.addEventListener("click", function () {
        abrir(disparador);
      });
    });

    visor.addEventListener("click", function (evento) {
      if (evento.target.hasAttribute("data-cerrar")) {
        cerrar();
      }
    });

    // Trampa de foco: Tab y Shift+Tab quedan contenidos dentro del modal.
    visor.addEventListener("keydown", function (evento) {
      if (evento.key !== "Tab") return;

      var focoables = elementosFocoables();
      if (!focoables.length) {
        evento.preventDefault();
        return;
      }

      var primero = focoables[0];
      var ultimo = focoables[focoables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && !visor.hidden) {
        cerrar();
      }
    });
  }

  /* ---------- 7. Año actual ---------- */
  function mostrarAnioActual() {
    var elemento = document.getElementById("anioActual");
    if (elemento) {
      elemento.textContent = String(new Date().getFullYear());
    }
  }

  /* ---------- Utilidad: compatibilidad de MediaQueryList ---------- */
  function aniadirCambioMedia(mql, callback) {
    function manejar(evento) {
      callback(evento.matches);
    }
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", manejar);
    } else if (typeof mql.addListener === "function") {
      // Navegadores antiguos.
      mql.addListener(manejar);
    }
  }
})();
