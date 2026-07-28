/**
 * Test automatici per valore-catastale.ts — coefficienti e congruita'.
 */
import { verificaCongruita, COEFFICIENTI_CATASTALI } from "./valore-catastale.js";

let passed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`\u274c FAIL: ${msg}`); process.exit(1); }
  passed++;
}
function eq(a: number, b: number, msg: string) { assert(a === b, `${msg} (atteso ${b}, ottenuto ${a})`); }

eq(COEFFICIENTI_CATASTALI.prima_casa.moltiplicatore, 115.5, "coefficiente prima casa");
eq(COEFFICIENTI_CATASTALI.altri_fabbricati_ac.moltiplicatore, 126, "coefficiente altri fabbricati");

const r1 = verificaCongruita({ renditaCatastale: 1000, categoria: "prima_casa", valoreDomanda: 120000 });
eq(r1.valoreCatastale, 115500, "valore catastale prima casa (1000 x 115.5)");
assert(r1.congruo === true, "congruo quando domanda >= catastale");

const r2 = verificaCongruita({ renditaCatastale: 1000, categoria: "prima_casa", valoreDomanda: 100000 });
assert(r2.congruo === false, "non congruo quando domanda < catastale");

eq(verificaCongruita({ renditaCatastale: 1000, categoria: "altri_fabbricati_ac", valoreDomanda: 200000 }).valoreCatastale,
   126000, "valore catastale altri fabbricati (1000 x 126)");

console.log(`\u2705 valore-catastale.test.ts: ${passed} asserzioni OK`);
