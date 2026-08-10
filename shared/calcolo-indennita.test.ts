/**
 * Test automatici per calcolo-indennita.ts
 * Verifica correttezza tariffe D.M. 150/2023 e COA Genova
 */
import { calcolaIndennita, getScaglioni, type InputCalcolo } from "./calcolo-indennita.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

function assertRange(value: number, min: number, max: number, message: string) {
  if (value < min || value > max) {
    console.error(`❌ FAIL: ${message} — got ${value}, expected ${min}-${max}`);
    process.exit(1);
  }
  console.log(`✅ ${message} = ${value}`);
}

// ==========================================
// TEST 1: Spese di avvio nazionali (art. 28, co. 4)
// ==========================================
console.log("\n=== TEST 1: Spese di avvio nazionali ===");

// Fino a €1.000 → €40
const t1a: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 500, modalitaTariffaria: "nazionale" };
const r1a = calcolaIndennita(t1a);
assert(r1a.speseAvvio === 40, `Spese avvio €500 = €40 (got ${r1a.speseAvvio})`);

// €1.001-€50.000 → €75
const t1b: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r1b = calcolaIndennita(t1b);
assert(r1b.speseAvvio === 75, `Spese avvio €25.000 = €75 (got ${r1b.speseAvvio})`);

// €50.001+ → €110
const t1c: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 100000, modalitaTariffaria: "nazionale" };
const r1c = calcolaIndennita(t1c);
assert(r1c.speseAvvio === 110, `Spese avvio €100.000 = €110 (got ${r1c.speseAvvio})`);

// ==========================================
// TEST 2: Primo incontro nazionali (art. 28, co. 5)
// ==========================================
console.log("\n=== TEST 2: Primo incontro nazionale ===");

// Fino a €1.000 → €60
const t2a: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 500, modalitaTariffaria: "nazionale" };
const r2a = calcolaIndennita(t2a);
assert(r2a.spesePrimoIncontro === 60, `Primo incontro €500 = €60 (got ${r2a.spesePrimoIncontro})`);

// €1.001-€50.000 → €120
const t2b: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r2b = calcolaIndennita(t2b);
assert(r2b.spesePrimoIncontro === 120, `Primo incontro €25.000 = €120 (got ${r2b.spesePrimoIncontro})`);

// €50.001+ → €170
const t2c: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 100000, modalitaTariffaria: "nazionale" };
const r2c = calcolaIndennita(t2c);
assert(r2c.spesePrimoIncontro === 170, `Primo incontro €100.000 = €170 (got ${r2c.spesePrimoIncontro})`);

// ==========================================
// TEST 3: Riduzione obbligatoria (1/5 nazionale)
// ==========================================
console.log("\n=== TEST 3: Riduzione obbligatoria ===");

const t3vol: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r3vol = calcolaIndennita(t3vol);

const t3obb: InputCalcolo = { tipoMediazione: "obbligatoria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r3obb = calcolaIndennita(t3obb);

assert(r3obb.riduzioneObbligatoria > 0, `Riduzione obbligatoria presente (got ${r3obb.riduzioneObbligatoria})`);
assert(r3obb.totalePrimoIncontro < r3vol.totalePrimoIncontro, `Totale primo obbligatoria (${r3obb.totalePrimoIncontro}) < volontaria (${r3vol.totalePrimoIncontro})`);

// ==========================================
// TEST 4: Maggiorazione accordo +25% e +10%
// ==========================================
console.log("\n=== TEST 4: Maggiorazioni accordo ===");

const t4: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r4 = calcolaIndennita(t4);
assert(r4.maggiorazioneSuccesso > 0, `Maggiorazione successo +25% presente (got ${r4.maggiorazioneSuccesso})`);

// ==========================================
// TEST 5: Art. 31 co. 3 — Maggiorazione +20%
// ==========================================
console.log("\n=== TEST 5: Art. 31 co. 3 maggiorazione ===");

const t5no: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r5no = calcolaIndennita(t5no);

const t5si: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale", mediatoreEsperto: true };
const r5si = calcolaIndennita(t5si);

assert(r5si.maggiorazioneArt31 > 0, `Maggiorazione art. 31 presente (got ${r5si.maggiorazioneArt31})`);
assert(r5si.totalePerParte > r5no.totalePerParte, `Totale con art. 31 (${r5si.totalePerParte}) > senza (${r5no.totalePerParte})`);

// Entrambi i flag → stessa maggiorazione (max +20%)
const t5both: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale", mediatoreEsperto: true, proceduraComplessa: true };
const r5both = calcolaIndennita(t5both);
assert(r5both.maggiorazioneArt31 === r5si.maggiorazioneArt31, `Due flag (${r5both.maggiorazioneArt31}) = uno (${r5si.maggiorazioneArt31}) (max +20%)`);

// ==========================================
// TEST 6: Esenzione art. 17 (accordo)
// ==========================================
console.log("\n=== TEST 6: Esenzione art. 17 ===");

const t6acc: InputCalcolo = { tipoMediazione: "obbligatoria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 50000, modalitaTariffaria: "nazionale" };
const r6acc = calcolaIndennita(t6acc);
assert(r6acc.esenzioneArt17.esenteBollo === true, "Accordo → bollo esente");
assert(r6acc.esenzioneArt17.esenteRegistro === true, "Accordo → registro esente");
assert(r6acc.esenzioneArt17.impostaRegistroRisparmiata === 1500, `Risparmio registro €50.000 = €1.500 (got ${r6acc.esenzioneArt17.impostaRegistroRisparmiata})`);

const t6no: InputCalcolo = { tipoMediazione: "obbligatoria", esito: "nessuno_successivi", tipoValore: "determinato", valoreLite: 50000, modalitaTariffaria: "nazionale" };
const r6no = calcolaIndennita(t6no);
assert(r6no.esenzioneArt17.esenteRegistro === false, "Nessun accordo → registro NON esente");

// ==========================================
// TEST 7: COA Genova - scaglioni
// Verificato contro Tariffario Mediazione 2026 COA Genova — Facoltative e Contrattuali:
// il primo incontro Genova è numericamente identico al primo incontro nazionale
// (€75 spese avvio per €25.000, fascia €1.001-€50.000).
// ==========================================
console.log("\n=== TEST 7: Tariffe COA Genova ===");

const t7: InputCalcolo = { tipoMediazione: "volontaria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "coa_genova" };
const r7 = calcolaIndennita(t7);
assert(r7.speseAvvio === 75, `Genova spese avvio €25.000 = €75 (got ${r7.speseAvvio})`);

// Genova riduzione 20% obbligatoria
const t7obb: InputCalcolo = { tipoMediazione: "obbligatoria", esito: "nessuno_primo", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "coa_genova" };
const r7obb = calcolaIndennita(t7obb);
assert(r7obb.speseAvvio === 60, `Genova obbligatoria spese avvio = €60 (75*0.8) (got ${r7obb.speseAvvio})`);

// ==========================================
// TEST 8: Scaglioni Tabella A nazionale (12) e Tabella delle Indennità COA Genova (11)
// ==========================================
console.log("\n=== TEST 8: Scaglioni Tabella A / Tabella Indennità Genova ===");

const scaglioni = getScaglioni("nazionale");
assert(scaglioni.length === 12, `12 scaglioni nazionali (got ${scaglioni.length})`);

const scagGe = getScaglioni("coa_genova");
assert(scagGe.length === 11, `11 scaglioni Genova (got ${scagGe.length})`);

// ==========================================
// TEST 9: Detrazione art. 34, co. 2
// ==========================================
console.log("\n=== TEST 9: Detrazione art. 34 co. 2 ===");

const t9: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 25000, modalitaTariffaria: "nazionale" };
const r9 = calcolaIndennita(t9);
assert(r9.detrazioneSpese > 0, `Detrazione art. 34 presente (got ${r9.detrazioneSpese})`);

// ==========================================
// TEST 10: COA Genova — Tabella delle Indennità (incontri successivi/accordo)
// Verificato contro Tariffario Mediazione 2026 COA Genova — Facoltative e Contrattuali,
// scaglione €10.001-€25.000, Indennità base = €390,40 (volontaria) / €312,32 (obbligatoria,
// -20%, valore identico a quello pubblicato nel Tariffario "Obbligatorie e Demandate").
// ==========================================
console.log("\n=== TEST 10: Tabella delle Indennità COA Genova ===");

const t10vol: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 20000, modalitaTariffaria: "coa_genova" };
const r10vol = calcolaIndennita(t10vol);
assert(r10vol.speseBase === 390.40, `Genova indennità base €20.000 = €390,40 (got ${r10vol.speseBase})`);

const t10obb: InputCalcolo = { tipoMediazione: "obbligatoria", esito: "nessuno_successivi", tipoValore: "determinato", valoreLite: 20000, modalitaTariffaria: "coa_genova" };
const r10obb = calcolaIndennita(t10obb);
assert(Math.abs(r10obb.speseBase * 0.8 - 312.32) < 0.01, `Genova indennità base obbligatoria €20.000 *0.8 = €312,32 (got ${r10obb.speseBase * 0.8})`);

// ==========================================
// TEST 11 — UX-05 (casi C6/C7): la "Tabella delle Indennità" COA Genova è un SALDO
// (dicitura testuale del Tariffario Mediazione 2026 COA Genova: "Saldo indennità
// prosecuzione — anche senza accordo") già netto rispetto al primo incontro, quindi NON
// va detratta ulteriormente la spesa di mediazione primo incontro (a differenza della
// Tabella A nazionale, dove la detrazione ex art. 34 co. 2 è invece corretta). Verificato
// contro il Tariffario ufficiale COA Genova (Facoltative/Contrattuali) fornito da Carlo
// il 10/08/2026: scaglione €1.001-5.000, indennità base €48,80, +25% accordo successivi
// = €12,20 (arrotondato a €12) → saldo netto atteso €60,80, NON azzerato.
// ==========================================
console.log("\n=== TEST 11: COA Genova — nessuna doppia detrazione sul saldo prosecuzione (UX-05 C6/C7) ===");

const t11: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 2000, modalitaTariffaria: "coa_genova" };
const r11 = calcolaIndennita(t11);
assert(r11.detrazioneSpese === 0, `Genova: nessuna detrazione del primo incontro sul saldo prosecuzione (got detrazioneSpese=${r11.detrazioneSpese})`);
assert(Math.abs(r11.ulterioriSpese - 60.80) < 0.01, `Genova €2.000 accordo successivi: ulteriori spese nette = €60,80 (indennità base €48,80 + 25% = €12) (got ${r11.ulterioriSpese})`);
assert(r11.ulterioriSpese > 0, "Genova: le ulteriori spese NON devono azzerarsi per gli scaglioni bassi (bug corretto UX-05)");

// Verifica anche lo scaglione più basso (fino a €1.000), ancora più esposto al bug prima della correzione
const t11b: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 500, modalitaTariffaria: "coa_genova" };
const r11b = calcolaIndennita(t11b);
assert(Math.abs(r11b.ulterioriSpese - 30.40) < 0.01, `Genova €500 accordo successivi: ulteriori spese nette = €30,40 (indennità base €24,40 + 25% = €6) (got ${r11b.ulterioriSpese})`);

// La detrazione nazionale (Tabella A) resta invece invariata (art. 34 co. 2 si applica)
const t11nat: InputCalcolo = { tipoMediazione: "volontaria", esito: "accordo_successivi", tipoValore: "determinato", valoreLite: 2000, modalitaTariffaria: "nazionale" };
const r11nat = calcolaIndennita(t11nat);
assert(r11nat.detrazioneSpese === 120, `Nazionale: detrazione primo incontro invariata (art. 34 co. 2) = €120 (got ${r11nat.detrazioneSpese})`);

// ==========================================
console.log("\n✅ TUTTI I TEST SUPERATI ✅\n");
