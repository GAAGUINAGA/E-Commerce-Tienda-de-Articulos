"use strict";

/**
 * Comprobacion de accesibilidad (WCAG 2 AA) del sitio estatico.
 *
 * Levanta `http-server` sobre `paginaCristianoRonaldo/`, ejecuta `pa11y-ci`
 * contra las URLs de `.pa11yci.json` y cierra el servidor.
 *
 * Se hace con un runner propio (en vez de `start-server-and-test` /
 * `concurrently`) porque esas utilidades matan el arbol de procesos con
 * `wmic.exe`, ausente en Windows 11 recientes. Aqui el servidor es un hijo
 * directo y `server.close()` funciona en Windows y en Linux por igual.
 */

const path = require("path");
const httpServer = require("http-server");
const pa11yCi = require("pa11y-ci");

const config = require(path.join("..", ".pa11yci.json"));

const HOST = "127.0.0.1";
const PORT = 8080;
const ROOT = path.join(__dirname, "..", "paginaCristianoRonaldo");

const server = httpServer.createServer({ root: ROOT, cache: -1, silent: true });

function terminar(codigo) {
  server.close();
  process.exit(codigo);
}

server.listen(PORT, HOST, () => {
  process.stdout.write(`Servidor de prueba en http://${HOST}:${PORT}\n`);

  pa11yCi(config.urls, config.defaults)
    .then((resultado) => {
      const fallos = resultado.errors || 0;
      process.stdout.write(
        `\npa11y-ci: ${resultado.passes}/${resultado.total} URLs sin errores` +
          (fallos ? ` (${fallos} errores)` : "") +
          "\n"
      );
      terminar(fallos > 0 ? 1 : 0);
    })
    .catch((error) => {
      process.stderr.write(`\npa11y-ci fallo: ${error && error.message}\n`);
      terminar(1);
    });
});

server.server.on("error", (error) => {
  process.stderr.write(`No se pudo iniciar el servidor: ${error.message}\n`);
  process.exit(1);
});
