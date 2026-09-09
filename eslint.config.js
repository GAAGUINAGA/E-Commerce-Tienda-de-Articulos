"use strict";

/**
 * Configuracion plana de ESLint (v9).
 *
 * El JavaScript del sitio (`paginaCristianoRonaldo/script.js`) esta escrito a
 * proposito en estilo ES5: IIFE + "use strict" + `var`, sin modulos ni sintaxis
 * moderna, para maxima compatibilidad de navegador. Por eso:
 *   - sourceType: "script"  (no es un modulo ES)
 *   - ecmaVersion: 2021     (permite lo que el codigo usa sin forzar mas)
 *   - globals de navegador  (window, document, IntersectionObserver, ...)
 *
 * Solo se parte de las reglas "recomendadas"; no se imponen preferencias de
 * estilo que reescribirian codigo ya revisado.
 */

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", ".opencode/**"],
  },
  js.configs.recommended,
  {
    files: ["paginaCristianoRonaldo/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
];
