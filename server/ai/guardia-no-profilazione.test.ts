import assert from "node:assert/strict";
import { applicaGuardiaNoProfilazione, rigaViolante } from "./guardia-no-profilazione.js";

// Righe reali emerse dalla prova del 21/10/2026
for (const r of [
  "- **Effetto:** L'istante percepisce una perdita; tende a rifiutare.",
  "- **Effetto:** Il chiamato percepisce una riduzione di perdita (un guadagno relativo); tende ad accettare.",
  "Un accordo su 32.000 EUR è razionale solo se la parte ritiene di avere scarsissime probabilità di vincere.",
  "- Segnale che la parte non ritiene il calcolo economico attendibile.",
  "Se H.L. ritiene il valore più basso, la trattativa si complica.",
  "- In dinamica reciproca: l'istante crede di avere il 80% di probabilità, il chiamato crede di avere il 70% di probabilità.",
  "- Una formulazione da evitare: \"Voi potete ridurre la vostra richiesta\" (A.B. sente perdita).",
  "   - Se 37.000 è formulato come perdita (A.B.), A.B. potrebbe preferire il rischio della causa, sperando di recuperare di più.",
  "- Separare gli interessi: F.G. vuole liquidità + certezza; H.L. vuole conservazione immobile.",
  "| 40% (pessimista per A.B.) | ZOPA amplia |",
  "Se A.B. è molto sicuro di vincere (es. 90%), avrà meno incentivo a scendere.",
  "- Le parti tendono a proporre cifre iniziali ottimistiche.",
  "Se A.B. accetterebbe da +25.200 euro, l'accordo è facile.",
  "Una riduzione di rischio significativa porterebbe l'istante a considerare favorevolmente un accordo fino a circa 28.000 euro.",
  "- Chi abita l'immobile è convinto di poter evitare pagamenti, ignorando che la normativa è cristallizzata.",
  "- Una delle parti ritiene che il proprio argomento legale sia così forte da garantire la vittoria.",
  "- **Dinamica asimmetrica**: L'istante potrebbe considerare l'accordo favorevole; il chiamato potrebbe considerarlo sfavorevole.",
  "La fiducia viene sopravvalutata perché una parte ricorda un precedente favorevole.",
  "  - Probabilità di accettazione dell'istante (stima ipotesi): 40%",
  "- **Probabilità di accettazione da parte del chiamato (stima ipotesi):** 45%",
]) assert.ok(rigaViolante(r), `deve essere segnalata: ${r}`);
for (const r of [
  "Ha informazioni aggiornate sulla solidità economica di P.G. S.r.l.? Ritiene che l'azienda continui a operare?",
  "Una proposta formulata come perdita può essere rifiutata.",
  "",
  "- Qual è il minimo che A.B. accetterebbe oggi per chiudere senza processo?",
  "Entrambe le parti hanno interesse a terminare l'indivisione.",
  "La proposta di 16.000 euro può fare da ancora per entrambe le posizioni.",
]) assert.ok(!rigaViolante(r), `non deve essere segnalata: ${r}`);

const testo = ["# Titolo", "- **Effetto:** L'istante percepisce una perdita; tende a rifiutare.", "- Frase neutra.", "- Il chiamato ritiene il prezzo alto."].join("\n");
const buona = await applicaGuardiaNoProfilazione(testo, async righe => righe.map((_, i) => i === 0 ? "- **Effetto:** Una proposta letta come perdita può essere rifiutata." : "- Il mediatore può chiedere come viene valutato il prezzo."), [], null);
assert.ok(buona.includes("Una proposta letta come perdita"));
assert.ok(buona.includes("Frase neutra"));
assert.ok(!buona.includes("percepisce"));
assert.ok(!buona.includes("omessa"));

// riscrittura che non migliora → omissione, e il resto del testo resta
const cattiva = await applicaGuardiaNoProfilazione(testo, async righe => righe, [], null);
assert.equal((cattiva.match(/frase omessa/g) ?? []).length, 2);
assert.ok(cattiva.includes("Frase neutra") && cattiva.startsWith("# Titolo"));

// riscrittore che fallisce → omissione
const errore = await applicaGuardiaNoProfilazione(testo, async () => { throw new Error("x"); }, [], null);
assert.ok(!errore.includes("percepisce"));

// riga di tabella → citazione, mai testo nella tabella
const tab = await applicaGuardiaNoProfilazione("| A | Il chiamato percepisce una perdita |", async r => r, [], null);
assert.ok(tab.startsWith("> [frase omessa"));

// nomi reali delle parti (non sigle dei casi di prova)
assert.ok(rigaViolante("Mario Rossi preferisce il certo dell'accordo.", ["Mario Rossi"]));
assert.ok(rigaViolante("Rossi crede di avere il 70% di probabilità.", ["Mario Rossi"]));
assert.ok(!rigaViolante("Mario Rossi ha depositato il ricorso.", ["Mario Rossi"]));

// testo pulito: invariato, nessuna chiamata
let chiamate = 0;
const pulito = "Nessuna frase problematica.\n- Voce.";
assert.equal(await applicaGuardiaNoProfilazione(pulito, async r => { chiamate++; return r; }, [], null), pulito);
assert.equal(chiamate, 0);
// controllo di significato: righe che nessuna regola di parole riconosce
const sfuggente = ["# Titolo", "- Il fratello che abita potrebbe temere di perdere l'abitazione.", "- Il mediatore può chiedere quali interessi prevalgano.", "- Una stima ottimista può spostare la soglia di accordo."].join("\n");
let viste: string[] = [];
const sem = await applicaGuardiaNoProfilazione(
  sfuggente,
  async righe => { viste = righe; return righe.map(() => "- La cessione della quota può essere letta come rischio per l'abitazione: il mediatore può chiedere come viene valutata."); },
  [],
  async () => [0, 1, 99, -1], // «# Titolo» (intestazione), indici fuori intervallo: ignorati; riga 1 valida
);
assert.deepEqual(viste, ["- Il fratello che abita potrebbe temere di perdere l'abitazione."]);
assert.ok(sem.startsWith("# Titolo") && sem.includes("può essere letta come rischio") && !sem.includes("temere"));
assert.ok(sem.includes("quali interessi prevalgano"));

// il controllo di significato che fallisce non blocca il resto
const fallito = await applicaGuardiaNoProfilazione(testo, async righe => righe.map(() => "- Il mediatore può chiedere come viene valutato il prezzo."), [], async () => { throw new Error("rete"); });
assert.ok(!fallito.includes("percepisce"));

console.log("✅ guardia-no-profilazione.test.ts: asserzioni OK");
