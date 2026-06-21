/**
 * notarile.ts — Re-export dal motore condiviso shared/notarile.ts
 * Mantenuto per retrocompatibilità con server/ai/analisi-economica.ts.
 *
 * Tutta la logica risiede ora in `shared/notarile.ts` ed è importabile
 * sia lato server sia lato client (Calcolatore, ConfrontoCosti, CostiNotarili).
 */
export * from "../../shared/notarile.js";
