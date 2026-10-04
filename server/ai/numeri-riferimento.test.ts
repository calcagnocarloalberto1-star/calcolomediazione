import assert from "node:assert/strict";
import { normalizzaDati, costruisciScheda } from "./numeri-riferimento.js";

// Caso di prova: credito 23.450, mandati 16.000 / 18.410
const d = normalizzaDati({
  creditoTotale: 23450,
  minimoIstante: 16000,
  massimoChiamato: 18410,
  offertaChiamato: 16000,
  scenari: [
    { descrizione: "riduzione 25%", probabilita: 70, importoCondanna: 17587 },
    { descrizione: "riduzione 10%", probabilita: 20, importoCondanna: 21105 },
    { descrizione: "nessuna riduzione", probabilita: 10, importoCondanna: 23450 },
  ],
  costiMediazioneParte: 1500,
  costiGiudizioParte: 5000,
  probabilitaAccordoMin: 60,
  probabilitaAccordoMax: 70,
});
assert.ok(d);
const somma = d!.scenari.reduce((a, s) => a + s.probabilita, 0);
assert.ok(Math.abs(somma - 100) < 1e-9, "le probabilita' sommano 100");
const scheda = costruisciScheda(d!);
assert.match(scheda, /ZOPA: da euro 16\.000 a euro 18\.410/);
assert.match(scheda, /punto mediano euro 17\.205/);
// EV lordo = 0.7*17587 + 0.2*21105 + 0.1*23450 = 18.877 (arrotondato)
assert.match(scheda, /Valore atteso lordo della condanna: euro 18\.877/);
// netto istante = 18.877 - 5.000 = 13.877; chiamato = 23.877
assert.match(scheda, /incassa euro 13\.877/);
assert.match(scheda, /paga euro 23\.877/);

// Probabilita' non a 100: vengono normalizzate
const n = normalizzaDati({
  creditoTotale: 1000,
  scenari: [
    { descrizione: "a", probabilita: 60, importoCondanna: 500 },
    { descrizione: "b", probabilita: 30, importoCondanna: 800 },
    { descrizione: "c", probabilita: 7, importoCondanna: 1000 },
  ],
});
assert.ok(n);
assert.ok(Math.abs(n!.scenari.reduce((a, s) => a + s.probabilita, 0) - 100) < 1e-9);

// ZOPA assente quando il minimo supera il massimo
const z = normalizzaDati({
  creditoTotale: 23450,
  minimoIstante: 21000,
  massimoChiamato: 19500,
  scenari: [{ descrizione: "x", probabilita: 100, importoCondanna: 20000 }],
});
assert.match(costruisciScheda(z!), /ZOPA: assente allo stato/);

// Dati inutilizzabili
assert.equal(normalizzaDati(null), null);
assert.equal(normalizzaDati({ creditoTotale: 0, scenari: [] }), null);
assert.equal(normalizzaDati({ creditoTotale: 1000, scenari: [] }), null);

console.log("numeri-riferimento.test.ts: ok");
