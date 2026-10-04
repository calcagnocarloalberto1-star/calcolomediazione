// 04/10/2026: scheda dei NUMERI DI RIFERIMENTO, calcolata una sola volta e passata
// a tutte le sezioni dell'analisi.
//
// Problema: ogni sezione ricalcolava per conto suo valore atteso, ZOPA, costi e
// probabilita' di accordo, con ipotesi diverse (es. valore atteso del giudizio per
// l'istante tra 11.435 e 17.650 euro nello stesso documento). Qui il modello
// estrae SOLO i dati di partenza (importi, probabilita' degli scenari, costi) e
// tutti i calcoli (somma delle probabilita', valore atteso, ZOPA, confronto con
// l'accordo) sono fatti dal codice, in modo deterministico.
// Import dinamico di llm.js dentro schedaNumeriRiferimento: le funzioni pure di questo
// file restano testabili senza caricare l'SDK.

export interface ScenarioGiudizio {
  descrizione: string;
  probabilita: number; // percentuale 0-100
  importoCondanna: number; // euro che il chiamato dovrebbe pagare in quello scenario
}

export interface DatiRiferimento {
  creditoTotale: number;
  minimoIstante: number | null; // minimo accettabile (es. limite della procura)
  massimoChiamato: number | null; // massimo disponibile (es. limite della procura)
  offertaChiamato: number | null;
  scenari: ScenarioGiudizio[];
  costiMediazioneParte: number; // per parte
  costiGiudizioParte: number; // per parte, primo grado, compresa la mediazione obbligatoria
  probabilitaAccordoMin: number | null; // percentuale
  probabilitaAccordoMax: number | null;
}

const fmt = (n: number) =>
  Math.round(n).toLocaleString("it-IT", { maximumFractionDigits: 0 });

function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/\./g, "").replace(",", ".")) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Valida e normalizza i dati estratti dal modello. Restituisce null se inutilizzabili. */
export function normalizzaDati(raw: unknown): DatiRiferimento | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const credito = num(r.creditoTotale);
  if (!credito || credito <= 0) return null;

  const scenariRaw = Array.isArray(r.scenari) ? r.scenari : [];
  const scenari: ScenarioGiudizio[] = [];
  for (const s of scenariRaw) {
    if (!s || typeof s !== "object") continue;
    const o = s as Record<string, unknown>;
    const p = num(o.probabilita);
    const imp = num(o.importoCondanna);
    if (p === null || imp === null) continue;
    // Gli scenari sono solo quelli del giudizio: l'accordo non e' uno scenario del giudizio.
    if (typeof o.descrizione === "string" && /accord|mediazion|conciliaz|transaz/i.test(o.descrizione)) continue;
    scenari.push({
      descrizione: typeof o.descrizione === "string" ? o.descrizione.slice(0, 120) : "Scenario",
      probabilita: p,
      importoCondanna: Math.min(imp, credito * 1.5),
    });
  }
  if (scenari.length === 0) return null;
  const somma = scenari.reduce((a, s) => a + s.probabilita, 0);
  if (somma <= 0) return null;
  // normalizza a 100 esatto
  for (const s of scenari) s.probabilita = (s.probabilita / somma) * 100;

  const costiM = num(r.costiMediazioneParte) ?? 0;
  const costiG = num(r.costiGiudizioParte) ?? 0;
  const pMin = num(r.probabilitaAccordoMin);
  const pMax = num(r.probabilitaAccordoMax);

  return {
    creditoTotale: credito,
    minimoIstante: num(r.minimoIstante),
    massimoChiamato: num(r.massimoChiamato),
    offertaChiamato: num(r.offertaChiamato),
    scenari,
    costiMediazioneParte: costiM,
    costiGiudizioParte: costiG,
    probabilitaAccordoMin: pMin !== null ? Math.min(pMin, 100) : null,
    probabilitaAccordoMax: pMax !== null ? Math.min(pMax, 100) : null,
  };
}

/** Calcola la scheda in testo: tutti i numeri derivati sono calcolati qui, non dal modello. */
export function costruisciScheda(d: DatiRiferimento): string {
  const righe: string[] = [];
  righe.push("DATI DI CALCOLO DEL CASO (importi gia' calcolati: usa ESCLUSIVAMENTE questi numeri in tutte le sezioni, senza ricalcolarli e senza proporne altri per le stesse grandezze; non nominare mai questo blocco, scrivi come se i numeri fossero fatti del caso)");
  righe.push(`- Credito rivendicato dall'istante: euro ${fmt(d.creditoTotale)}`);
  if (d.offertaChiamato !== null) righe.push(`- Offerta attuale del chiamato: euro ${fmt(d.offertaChiamato)}`);
  if (d.minimoIstante !== null) righe.push(`- Minimo accettabile dall'istante: euro ${fmt(d.minimoIstante)}`);
  if (d.massimoChiamato !== null) righe.push(`- Massimo disponibile per il chiamato: euro ${fmt(d.massimoChiamato)}`);

  // ZOPA
  let mediano: number | null = null;
  if (d.minimoIstante !== null && d.massimoChiamato !== null) {
    if (d.minimoIstante <= d.massimoChiamato) {
      mediano = (d.minimoIstante + d.massimoChiamato) / 2;
      righe.push(`- ZOPA: da euro ${fmt(d.minimoIstante)} a euro ${fmt(d.massimoChiamato)} (ampiezza euro ${fmt(d.massimoChiamato - d.minimoIstante)}, punto mediano euro ${fmt(mediano)})`);
    } else {
      righe.push(`- ZOPA: assente allo stato (il minimo dell'istante, euro ${fmt(d.minimoIstante)}, supera il massimo del chiamato, euro ${fmt(d.massimoChiamato)}; scarto euro ${fmt(d.minimoIstante - d.massimoChiamato)})`);
    }
  }

  if (d.probabilitaAccordoMin !== null && d.probabilitaAccordoMax !== null) {
    const lo = Math.min(d.probabilitaAccordoMin, d.probabilitaAccordoMax);
    const hi = Math.max(d.probabilitaAccordoMin, d.probabilitaAccordoMax);
    righe.push(`- Probabilita' di accordo in mediazione (stima unica): ${fmt(lo)}-${fmt(hi)}%`);
  }

  // Giudizio: valore atteso
  const ev = d.scenari.reduce((a, s) => a + (s.probabilita / 100) * s.importoCondanna, 0);
  righe.push("- Scenari del giudizio (probabilita' sommano 100%):");
  for (const s of d.scenari) {
    righe.push(`    * ${s.descrizione}: ${s.probabilita.toFixed(0)}% - condanna euro ${fmt(s.importoCondanna)}`);
  }
  righe.push(`- Valore atteso lordo della condanna: euro ${fmt(ev)}`);
  const istanteGiudizio = ev - d.costiGiudizioParte;
  const chiamatoGiudizio = ev + d.costiGiudizioParte;
  righe.push(`- Costi per parte: mediazione euro ${fmt(d.costiMediazioneParte)}, giudizio di primo grado euro ${fmt(d.costiGiudizioParte)} (comprende la mediazione obbligatoria)`);
  righe.push(`- Valore atteso NETTO del giudizio: per l'istante incassa euro ${fmt(istanteGiudizio)}; per il chiamato paga euro ${fmt(chiamatoGiudizio)} (calcolati al netto/lordo dei soli costi propri; non comprendono rischio di insolvenza, tempi, sfratto)`);

  // Confronto con l'accordo al punto mediano (o all'offerta, se manca la ZOPA)
  const x = mediano ?? d.offertaChiamato;
  if (x !== null) {
    const istanteAccordo = x - d.costiMediazioneParte;
    const chiamatoAccordo = x + d.costiMediazioneParte;
    const etichetta = mediano !== null ? "punto mediano della ZOPA" : "offerta attuale";
    righe.push(`- Confronto con l'accordo a euro ${fmt(x)} (${etichetta}): l'istante incassa euro ${fmt(istanteAccordo)} netti contro euro ${fmt(istanteGiudizio)} del giudizio (${istanteAccordo >= istanteGiudizio ? "l'accordo rende di piu'" : "il giudizio rende di piu' sul solo piano economico: la convenienza dell'accordo va motivata con tempi, rischio di insolvenza e certezza"}); il chiamato paga euro ${fmt(chiamatoAccordo)} contro euro ${fmt(chiamatoGiudizio)} del giudizio (${chiamatoAccordo <= chiamatoGiudizio ? "l'accordo costa di meno" : "l'accordo costa di piu' sul solo piano economico"})`);
  }
  righe.push("Usa questi numeri come dati del caso, senza nominare questo blocco ne' commentarlo: non scrivere mai le parole scheda o dati di calcolo.");
  return righe.join("\n");
}

const SYSTEM_ESTRAZIONE = `Sei un analista di mediazione civile. Dai dati del caso estrai SOLO i numeri di partenza per un calcolo, e rispondi con un unico oggetto JSON, senza testo prima o dopo e senza blocchi di codice.

Schema:
{
  "creditoTotale": numero in euro (il valore della controversia o il credito rivendicato),
  "minimoIstante": numero in euro oppure null (minimo che l'istante puo' accettare, ad esempio limite della procura sostanziale),
  "massimoChiamato": numero in euro oppure null (massimo che il chiamato puo' offrire, ad esempio limite della procura sostanziale),
  "offertaChiamato": numero in euro oppure null,
  "scenari": [ { "descrizione": "breve", "probabilita": percentuale, "importoCondanna": euro che il chiamato paga in quel caso } ],
  "costiMediazioneParte": euro per parte,
  "costiGiudizioParte": euro per parte (primo grado, compresa la mediazione obbligatoria),
  "probabilitaAccordoMin": percentuale oppure null,
  "probabilitaAccordoMax": percentuale oppure null
}

Regole: i limiti minimoIstante e massimoChiamato si trovano nelle procure sostanziali o nelle lettere degli avvocati presenti nei documenti: cercali li'; usa solo importi presenti nei dati; se un limite non e' indicato usa null; gli scenari sono 3 e riguardano SOLO il giudizio, mai l'accordo in mediazione (esito favorevole al chiamato, intermedio, favorevole all'istante) con probabilita' realistiche che sommano 100; l'importo di condanna non supera il credito; i costi sono stime prudenti coerenti con il valore della controversia. Numeri puri, senza punti dei migliaia ne' simboli.`;

/** Estrae i dati di partenza con una sola chiamata e costruisce la scheda. Null se non riesce. */
export async function schedaNumeriRiferimento(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: unknown,
  nerResult: string,
  documentiText: string = ""
): Promise<string | null> {
  try {
    const { callLLM } = await import("./llm.js");
    const userPrompt = `Valore dichiarato della controversia: ${valoreLite ?? "non indicato"}\nParti: ${parti.map((p) => `${p.nome} (${p.ruolo})`).join(", ")}\n\nDescrizione:\n${descrizione.slice(0, 6000)}\n\nEstrazione entita':\n${nerResult.slice(0, 8000)}${documentiText ? `\n\nTesto dei documenti (procure, lettere, ricevute):\n${documentiText.slice(0, 14000)}` : ""}`;
    const out = await callLLM(SYSTEM_ESTRAZIONE, userPrompt, 1500);
    const m = out.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const dati = normalizzaDati(JSON.parse(m[0]));
    return dati ? costruisciScheda(dati) : null;
  } catch (err) {
    console.error("Errore scheda numeri di riferimento:", err);
    return null;
  }
}
