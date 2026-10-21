import assert from "node:assert/strict";
import { applicaGuardiaNoProfilazione, rigaViolante } from "./guardia-no-profilazione.js";

// Righe reali emerse dalla prova del 21/10/2026
for (const r of [
  "- **Effetto:** L'istante percepisce una perdita; tende a rifiutare.",
  "- **Effetto:** Il chiamato percepisce una riduzione di perdita (un guadagno relativo); tende ad accettare.",
  "Un accordo su 32.000 EUR è razionale solo se la parte ritiene di avere scarsissime probabilità di vincere.",
  "- Segnale che la parte non ritiene il calcolo economico attendibile.",
  "Se H.L. ritiene il valore più basso, la trattativa si complica.",
]) assert.ok(rigaViolante(r), `deve essere segnalata: ${r}`);
for (const r of [
  "Ha informazioni aggiornate sulla solidità economica di P.G. S.r.l.? Ritiene che l'azienda continui a operare?",
  "Una proposta formulata come perdita può essere rifiutata.",
  "",
]) assert.ok(!rigaViolante(r), `non deve essere segnalata: ${r}`);

const testo = ["# Titolo", "- **Effetto:** L'istante percepisce una perdita; tende a rifiutare.", "- Frase neutra.", "- Il chiamato ritiene il prezzo alto."].join("\n");
const buona = await applicaGuardiaNoProfilazione(testo, async righe => righe.map((_, i) => i === 0 ? "- **Effetto:** Una proposta letta come perdita può essere rifiutata." : "- Il mediatore può chiedere come viene valutato il prezzo."));
assert.ok(buona.includes("Una proposta letta come perdita"));
assert.ok(buona.includes("Frase neutra"));
assert.ok(!buona.includes("percepisce"));
assert.ok(!buona.includes("omessa"));

// riscrittura che non migliora → omissione, e il resto del testo resta
const cattiva = await applicaGuardiaNoProfilazione(testo, async righe => righe);
assert.equal((cattiva.match(/frase omessa/g) ?? []).length, 2);
assert.ok(cattiva.includes("Frase neutra") && cattiva.startsWith("# Titolo"));

// riscrittore che fallisce → omissione
const errore = await applicaGuardiaNoProfilazione(testo, async () => { throw new Error("x"); });
assert.ok(!errore.includes("percepisce"));

// riga di tabella → citazione, mai testo nella tabella
const tab = await applicaGuardiaNoProfilazione("| A | Il chiamato percepisce una perdita |", async r => r);
assert.ok(tab.startsWith("> [frase omessa"));

// testo pulito: invariato, nessuna chiamata
let chiamate = 0;
const pulito = "Nessuna frase problematica.\n- Voce.";
assert.equal(await applicaGuardiaNoProfilazione(pulito, async r => { chiamate++; return r; }), pulito);
assert.equal(chiamate, 0);
console.log("✅ guardia-no-profilazione.test.ts: asserzioni OK");
