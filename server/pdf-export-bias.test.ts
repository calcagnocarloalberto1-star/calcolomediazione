import { sezioniAnalisiPdf } from "./pdf-export.js";
import type { AnalisiCaso } from "@shared/schema";

const analisi = {
  prospettoEconomico: "a", analisiGiuridica: "b", guidaStrategica: "c", analisiMaanBatna: "d",
  compatibilitaInteressi: "e", controlloBiasCognitivi: "BIAS", bozzaAccordo: "g", analisiEconomica: "h",
} as unknown as AnalisiCaso;

let n = 0;
function ok(cond: boolean, msg: string) {
  if (!cond) { console.error("❌ " + msg); process.exit(1); }
  n++;
}

const predefinito = sezioniAnalisiPdf(analisi);
ok(predefinito.length === 7, "di default il PDF ha 7 sezioni");
ok(!predefinito.some(s => s.icon === "BIA"), "di default la sezione bias è esclusa");
const con = sezioniAnalisiPdf(analisi, true);
ok(con.length === 8 && con.some(s => s.icon === "BIA"), "con includiBias la sezione c'è");
ok(sezioniAnalisiPdf(analisi, false).length === 7, "includiBias=false esclude la sezione");
console.log(`✅ pdf-export-bias.test.ts: ${n} asserzioni OK`);
