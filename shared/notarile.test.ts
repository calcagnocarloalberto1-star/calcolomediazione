/**
 * Test automatici per notarile.ts — scaglioni onorario, base imponibile,
 * imposta di registro (esenzione mediazione fino a 100k).
 */
import { onorarioStimato, calcolaBaseImponibile, calcolaCostiNotarili } from "./notarile.js";

let passed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`\u274c FAIL: ${msg}`); process.exit(1); }
  passed++;
}
function eq(a: number, b: number, msg: string) { assert(a === b, `${msg} (atteso ${b}, ottenuto ${a})`); }

// Onorario per scaglioni
eq(onorarioStimato(50000), 1500, "onorario 50k");
eq(onorarioStimato(100000), 1500, "onorario 100k (limite scaglione)");
eq(onorarioStimato(150000), 2000, "onorario 150k");
eq(onorarioStimato(250000), 2500, "onorario 250k");
eq(onorarioStimato(400000), 3200, "onorario 400k");
eq(onorarioStimato(600000), 4000, "onorario 600k");

// Base imponibile
eq(calcolaBaseImponibile({ prezzo: 200000 } as any), 200000, "base = prezzo (senza prezzo-valore)");
eq(calcolaBaseImponibile({ rendita_catastale: 1000, tipologia: "prima_casa", prezzo_valore: true } as any),
   Math.round(1000 * 1.05 * 115.5), "base = prezzo-valore prima casa");

// Imposta di registro
eq(calcolaCostiNotarili({ base: 80000, regime: "prima_casa", scenario: "con_mediazione" }).voci.imposta_registro ?? 0,
   0, "registro esente sotto 100k in mediazione");
eq(calcolaCostiNotarili({ base: 150000, regime: "prima_casa", scenario: "con_mediazione" }).voci.imposta_registro ?? 0,
   1000, "registro 2% su eccedenza (mediazione)");
eq(calcolaCostiNotarili({ base: 150000, regime: "prima_casa", scenario: "con_sentenza" }).voci.imposta_registro ?? 0,
   3000, "registro 2% pieno (sentenza)");
assert(calcolaCostiNotarili({ base: 150000, regime: "prima_casa", scenario: "con_mediazione" }).totale > 0,
   "totale mediazione positivo");

console.log(`\u2705 notarile.test.ts: ${passed} asserzioni OK`);
