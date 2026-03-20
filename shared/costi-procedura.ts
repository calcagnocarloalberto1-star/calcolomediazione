/**
 * Modulo di calcolo costi procedurali completi
 * Confronto Mediazione vs Causa Civile
 * 
 * Supporta due modalità tariffarie per la mediazione:
 * 1. Nazionale — D.M. 150/2023
 * 2. COA Genova — Tariffe locali Ordine Avvocati Genova
 * 
 * Fonti normative:
 * - Contributo Unificato: D.P.R. 115/2002, art. 13 (aggiornato 2024)
 * - Parametri Forensi: D.M. 55/2014 aggiornato D.M. 147/2022
 * - Indennità mediazione: D.M. 150/2023
 * - Imposta di registro: D.P.R. 131/1986, art. 8 Tariffa Parte I
 * - Esenzioni mediazione: D.Lgs. 28/2010, art. 17
 * - Gratuito Patrocinio: D.P.R. 115/2002, art. 76 — limite 2025: €13.659,64
 * - Costi notarili: Tabelle CNN per accordi immobiliari
 */

import { formatEuro, type ModalitaTariffaria } from "./calcolo-indennita.js";

// ========================
// TIPI
// ========================

export interface InputConfronto {
  valoreLite: number;
  tipoValore: "determinato" | "indeterminabile_basso" | "indeterminabile_medio" | "indeterminabile_alto";
  tipoMediazione: "volontaria" | "obbligatoria" | "demandata";
  materiaImmobiliare: boolean;
  primaCasa?: boolean;
  modalitaTariffaria?: ModalitaTariffaria;
  redditoAnnuo?: number;
  numeroProcedure?: number;
  gratuitoPatrocinio?: boolean;
  mediatoreEsperto?: boolean;
  proceduraComplessa?: boolean;
}

export interface ImposteImmobiliari {
  impostaRegistro: number;
  impostaIpotecaria: number;
  impostaCatastale: number;
  totaleImposte: number;
  aliquotaRegistro: string;
  isPrimaCasa: boolean;
  note: string;
}

export interface CostiMediazione {
  indennitaOrganismo: number;
  speseAvvio: number;
  compensoAvvocato: number;
  speseGenerali15: number;
  iva22Avvocato: number;
  cpa4Avvocato: number;
  impostaRegistro: number;
  imposteImmobiliari: ImposteImmobiliari | null;
  costoNotaio: number;
  totalePerParte: number;
  totaleComplessivo: number;
  creditoImposta: number;
  totaleNettoPerParte: number;
  modalitaTariffaria: ModalitaTariffaria;
}

export interface CostiCausaCivile {
  contributoUnificato: number;
  marcaDaBollo: number;
  dirittoCopia: number;
  compensoAvvocato: number;
  speseGenerali15: number;
  iva22Avvocato: number;
  cpa4Avvocato: number;
  impostaRegistroSentenza: number;
  stimaCTU: number;
  totalePerParte: number;
  totaleComplessivo: number;
}

export interface CostiGradoSuccessivo {
  grado: "appello" | "cassazione";
  contributoUnificato: number;
  marcaDaBollo: number;
  compensoAvvocato: number;
  speseGenerali15: number;
  iva22Avvocato: number;
  cpa4Avvocato: number;
  stimaCTU: number;
  totalePerParte: number;
  durataStimata: string;
  note: string;
}

export interface GratuitoPatrocinio {
  ammissibile: boolean;
  limiteReddito: number;
  redditoInserito: number;
  note: string;
}

export interface RisultatoConfronto {
  costiMediazione: CostiMediazione;
  costiCausaCivile: CostiCausaCivile;
  costiAppello: CostiGradoSuccessivo;
  costiCassazione: CostiGradoSuccessivo;
  totaleCausaTreGradi: number;
  risparmioMediazione: number;
  percentualeRisparmio: number;
  risparmioMediazioneTreGradi: number;
  percentualeRisparmioTreGradi: number;
  gratuitoPatrocinio: GratuitoPatrocinio;
  durataMediaStimata: { mediazione: string; causaCivile: string; appello: string; cassazione: string };
  vantaggiFiscali: string[];
}

// ========================
// TABELLE NORMATIVE
// ========================

// Contributo Unificato - Primo Grado Civile (D.P.R. 115/2002 art. 13)
const CONTRIBUTO_UNIFICATO = [
  { min: 0, max: 1100, importo: 43 },
  { min: 1100.01, max: 5200, importo: 98 },
  { min: 5200.01, max: 26000, importo: 237 },
  { min: 26000.01, max: 52000, importo: 518 },
  { min: 52000.01, max: 260000, importo: 759 },
  { min: 260000.01, max: 520000, importo: 1214 },
  { min: 520000.01, max: Infinity, importo: 1686 },
];

// Parametri Forensi Giudiziali D.M. 55/2014 aggiornato D.M. 147/2022
const PARAMETRI_FORENSI_GIUDIZIALI = [
  { min: 0, max: 1100, studio: 131, introduttiva: 131, istruttoria: 200, decisionale: 200 },
  { min: 1100.01, max: 5200, studio: 425, introduttiva: 425, istruttoria: 851, decisionale: 851 },
  { min: 5200.01, max: 26000, studio: 919, introduttiva: 777, istruttoria: 1680, decisionale: 1701 },
  { min: 26000.01, max: 52000, studio: 1701, introduttiva: 1204, istruttoria: 1806, decisionale: 2905 },
  { min: 52000.01, max: 260000, studio: 2552, introduttiva: 1628, istruttoria: 5670, decisionale: 4253 },
  { min: 260000.01, max: 520000, studio: 3544, introduttiva: 2338, istruttoria: 10411, decisionale: 6164 },
];

// Parametri Forensi Stragiudiziali (Tabella 25-bis)
const PARAMETRI_FORENSI_STRAGIUDIZIALI = [
  { min: 0, max: 1100, attivazione: 68, negoziazione: 68, conciliazione: 68 },
  { min: 1100.01, max: 5200, attivazione: 236, negoziazione: 252, conciliazione: 352 },
  { min: 5200.01, max: 26000, attivazione: 425, negoziazione: 352, conciliazione: 567 },
  { min: 26000.01, max: 52000, attivazione: 567, negoziazione: 709, conciliazione: 788 },
  { min: 52000.01, max: 260000, attivazione: 992, negoziazione: 1061, conciliazione: 1276 },
  { min: 260000.01, max: 520000, attivazione: 1134, negoziazione: 1454, conciliazione: 1701 },
];

// Contributo Unificato - Appello (D.P.R. 115/2002 — maggiorato del 50%)
const CONTRIBUTO_UNIFICATO_APPELLO = [
  { min: 0, max: 1100, importo: 64.50 },
  { min: 1100.01, max: 5200, importo: 147 },
  { min: 5200.01, max: 26000, importo: 355.50 },
  { min: 26000.01, max: 52000, importo: 777 },
  { min: 52000.01, max: 260000, importo: 1138.50 },
  { min: 260000.01, max: 520000, importo: 1821 },
  { min: 520000.01, max: Infinity, importo: 2529 },
];

// Contributo Unificato - Cassazione (D.P.R. 115/2002 — raddoppiato)
const CONTRIBUTO_UNIFICATO_CASSAZIONE = [
  { min: 0, max: 1100, importo: 86 },
  { min: 1100.01, max: 5200, importo: 196 },
  { min: 5200.01, max: 26000, importo: 474 },
  { min: 26000.01, max: 52000, importo: 1036 },
  { min: 52000.01, max: 260000, importo: 1518 },
  { min: 260000.01, max: 520000, importo: 2428 },
  { min: 520000.01, max: Infinity, importo: 3372 },
];

// Parametri Forensi Corte d'Appello — Tabella 12 D.M. 55/2014 agg. D.M. 147/2022
const PARAMETRI_FORENSI_APPELLO = [
  { min: 0, max: 1100, studio: 142, introduttiva: 142, istruttoria: 179, decisionale: 210 },
  { min: 1100.01, max: 5200, studio: 536, introduttiva: 536, istruttoria: 992, decisionale: 851 },
  { min: 5200.01, max: 26000, studio: 1134, introduttiva: 921, istruttoria: 1843, decisionale: 1911 },
  { min: 26000.01, max: 52000, studio: 2058, introduttiva: 1418, istruttoria: 3045, decisionale: 3470 },
  { min: 52000.01, max: 260000, studio: 2977, introduttiva: 1911, istruttoria: 4326, decisionale: 5103 },
  { min: 260000.01, max: 520000, studio: 4389, introduttiva: 2552, istruttoria: 5880, decisionale: 7298 },
];

// Parametri Forensi Cassazione — Tabella 13 D.M. 55/2014 agg. D.M. 147/2022
// NB: In Cassazione non c'è fase istruttoria
const PARAMETRI_FORENSI_CASSAZIONE = [
  { min: 0, max: 1100, studio: 252, introduttiva: 284, decisionale: 142 },
  { min: 1100.01, max: 5200, studio: 709, introduttiva: 777, decisionale: 389 },
  { min: 5200.01, max: 26000, studio: 1276, introduttiva: 1134, decisionale: 672 },
  { min: 26000.01, max: 52000, studio: 2336, introduttiva: 1969, decisionale: 1208 },
  { min: 52000.01, max: 260000, studio: 3402, introduttiva: 2478, decisionale: 1775 },
  { min: 260000.01, max: 520000, studio: 4961, introduttiva: 3260, decisionale: 2552 },
];

// Spese primo incontro — D.M. 150/2023, Art. 28 commi 4-5
// Art. 28, co. 4: Spese avvio = €40 (fino €1k), €75 (€1k-50k), €110 (>€50k e indeterminabili)
// Art. 28, co. 5: Spese mediazione primo incontro = €60 (fino €1k), €120 (€1k-50k), €170 (>€50k)
function getSpeseAvvioNazionaliConfronto(valoreLite: number): number {
  if (valoreLite <= 1000) return 40;
  if (valoreLite <= 50000) return 75;
  return 110;
}

function getSpeseMediazionePrimoIncontroConfronto(valoreLite: number): number {
  if (valoreLite <= 1000) return 60;
  if (valoreLite <= 50000) return 120;
  return 170;
}

// Tabella A — D.M. 150/2023 (spese mediazione incontri successivi, importi minimi)
const TABELLA_A_MEDIAZIONE_NAZIONALE = [
  { min: 0, max: 1000, minimoTabA: 80 },
  { min: 1000.01, max: 5000, minimoTabA: 160 },
  { min: 5000.01, max: 10000, minimoTabA: 290 },
  { min: 10000.01, max: 25000, minimoTabA: 440 },
  { min: 25000.01, max: 50000, minimoTabA: 720 },
  { min: 50000.01, max: 150000, minimoTabA: 1200 },
  { min: 150000.01, max: 250000, minimoTabA: 1500 },
  { min: 250000.01, max: 500000, minimoTabA: 2500 },
  { min: 500000.01, max: 1500000, minimoTabA: 3900 },
  { min: 1500000.01, max: 2500000, minimoTabA: 4600 },
  { min: 2500000.01, max: 5000000, minimoTabA: 6500 },
  { min: 5000000.01, max: Infinity, minimoTabA: 10000 },
];

// Indennità Mediazione COA Genova (tariffe piene, riduzione 20% per obbligatoria)
const INDENNITA_MEDIAZIONE_GENOVA = [
  { min: 0, max: 1000, speseAvvio: 40, indennita: 110 },
  { min: 1000.01, max: 5000, speseAvvio: 80, indennita: 220 },
  { min: 5000.01, max: 10000, speseAvvio: 100, indennita: 260 },
  { min: 10000.01, max: 25000, speseAvvio: 120, indennita: 360 },
  { min: 25000.01, max: 50000, speseAvvio: 180, indennita: 520 },
  { min: 50000.01, max: 100000, speseAvvio: 220, indennita: 780 },
  { min: 100000.01, max: 250000, speseAvvio: 260, indennita: 1560 },
  { min: 250000.01, max: 500000, speseAvvio: 300, indennita: 2600 },
  { min: 500000.01, max: Infinity, speseAvvio: 340, indennita: 3900 },
];

// Genova indeterminabili
const GENOVA_INDETERMINABILI = {
  speseAvvio: 88,
  indeterminabile_basso: 260,
  indeterminabile_medio: 520,
  indeterminabile_alto: 780,
};

// Costi notarili — onorario medio indicativo (libero post D.L. 1/2012)
// SECONDA CASA / ALTRI IMMOBILI — onorari ordinari
const COSTI_NOTARILI_SECONDA_CASA = [
  { min: 0, max: 10000, onorario: 1300 },
  { min: 10000.01, max: 25000, onorario: 1550 },
  { min: 25000.01, max: 50000, onorario: 1800 },
  { min: 50000.01, max: 250000, onorario: 2200 },
  { min: 250000.01, max: 500000, onorario: 2500 },
  { min: 500000.01, max: 2500000, onorario: 3200 },
  { min: 2500000.01, max: 5000000, onorario: 3900 },
  { min: 5000000.01, max: Infinity, onorario: 5000 },
];

// PRIMA CASA — onorari ridotti (circa 30% in meno rispetto a seconda casa)
// Fonte: stime medie da NotaioFacile, Immobiliare.it, tabelle CNN indicative
const COSTI_NOTARILI_PRIMA_CASA = [
  { min: 0, max: 10000, onorario: 900 },
  { min: 10000.01, max: 25000, onorario: 1100 },
  { min: 25000.01, max: 50000, onorario: 1250 },
  { min: 50000.01, max: 250000, onorario: 1500 },
  { min: 250000.01, max: 500000, onorario: 1750 },
  { min: 500000.01, max: 2500000, onorario: 2200 },
  { min: 2500000.01, max: 5000000, onorario: 2700 },
  { min: 5000000.01, max: Infinity, onorario: 3500 },
];

// ========================
// IMPOSTE TRASFERIMENTO IMMOBILIARE
// Fonti: D.P.R. 131/1986, D.Lgs. 347/1990, Art. 1 nota II-bis Tariffa Parte I
// ========================

/**
 * Calcola le imposte sui trasferimenti immobiliari
 * 
 * PRIMA CASA (persona fisica, requisiti art. 1 nota II-bis Tariffa):
 * - Imposta di registro: 2% (minimo €1.000)
 * - Imposta ipotecaria: €50 (fissa)
 * - Imposta catastale: €50 (fissa)
 * 
 * SECONDA CASA / ALTRI IMMOBILI:
 * - Imposta di registro: 9% (minimo €1.000)
 * - Imposta ipotecaria: €50 (fissa)
 * - Imposta catastale: €50 (fissa)
 * 
 * In mediazione con accordo (art. 17 D.Lgs. 28/2010):
 * - Esenzione imposta di registro fino a €100.000
 * - Imposta di bollo esente
 */
function calcolaImposteImmobiliari(
  valoreImmobile: number,
  primaCasa: boolean,
  inMediazione: boolean
): ImposteImmobiliari {
  const aliquota = primaCasa ? 0.02 : 0.09;
  const aliquotaLabel = primaCasa ? "2%" : "9%";
  
  let impostaRegistro = Math.round(valoreImmobile * aliquota);
  // Minimo €1.000 per imposta di registro
  if (impostaRegistro < 1000) impostaRegistro = 1000;
  
  // In mediazione: esenzione registro fino a €100.000 (art. 17 D.Lgs. 28/2010)
  if (inMediazione) {
    const valoreImponibile = Math.max(0, valoreImmobile - 100000);
    impostaRegistro = Math.round(valoreImponibile * aliquota);
    if (valoreImmobile <= 100000) impostaRegistro = 0;
  }
  
  // Imposte ipotecaria e catastale: €50 fisse ciascuna (acquisto da privato)
  const impostaIpotecaria = 50;
  const impostaCatastale = 50;
  
  const totaleImposte = impostaRegistro + impostaIpotecaria + impostaCatastale;
  
  let note = primaCasa
    ? `Agevolazione prima casa: aliquota registro ${aliquotaLabel} (art. 1 nota II-bis Tariffa Parte I, D.P.R. 131/1986). Imposte ipotecaria e catastale: €50 fisse ciascuna. Onorari notarili ridotti (~30%).`
    : `Aliquota ordinaria ${aliquotaLabel} (seconda casa/altro immobile). Imposte ipotecaria e catastale: €50 fisse ciascuna. Onorari notarili ordinari.`;
  
  if (inMediazione) {
    note += " Esenzione imposta di registro fino a €100.000 (art. 17, co. 3, D.Lgs. 28/2010).";
  }
  
  return {
    impostaRegistro,
    impostaIpotecaria,
    impostaCatastale,
    totaleImposte,
    aliquotaRegistro: aliquotaLabel,
    isPrimaCasa: primaCasa,
    note,
  };
}

// Valori per controversie indeterminabili
const VALORI_INDETERMINABILI: Record<string, number> = {
  indeterminabile_basso: 25000,
  indeterminabile_medio: 50000,
  indeterminabile_alto: 250000,
};

const LIMITE_GRATUITO_PATROCINIO = 13659.64;

// ========================
// FUNZIONI DI LOOKUP
// ========================

function findScaglione<T extends { min: number; max: number }>(tabella: T[], valore: number): T {
  return tabella.find(s => valore >= s.min && valore <= s.max) || tabella[tabella.length - 1];
}

function isObbligatoria(tipo: string): boolean {
  return tipo === "obbligatoria" || tipo === "demandata";
}

// ========================
// CALCOLO COSTI MEDIAZIONE
// ========================

function calcolaCostiMediazione(input: InputConfronto, valoreEffettivo: number): CostiMediazione {
  const modalita = input.modalitaTariffaria || "nazionale";
  const isGP = input.gratuitoPatrocinio === true;
  
  let speseAvvio: number;
  let indennita: number; // spese di mediazione (Tabella A minimi per incontri successivi)

  if (modalita === "coa_genova") {
    // Tariffe COA Genova
    if (input.tipoValore !== "determinato") {
      speseAvvio = GENOVA_INDETERMINABILI.speseAvvio;
      indennita = GENOVA_INDETERMINABILI[input.tipoValore as keyof typeof GENOVA_INDETERMINABILI] as number || 260;
    } else {
      const scag = findScaglione(INDENNITA_MEDIAZIONE_GENOVA, valoreEffettivo);
      speseAvvio = scag.speseAvvio;
      indennita = scag.indennita;
    }
    // Riduzione 20% per obbligatoria/demandata
    if (isObbligatoria(input.tipoMediazione)) {
      indennita = indennita * 0.8;
      speseAvvio = speseAvvio * 0.8;
    }
  } else {
    // Tariffe Nazionali D.M. 150/2023
    // Il Confronto Costi assume accordo raggiunto in mediazione → usa:
    // - Spese avvio: art. 28, co. 4 (€40/€75/€110)
    // - Spese mediazione: Tabella A minimi (art. 30) per incontri successivi
    speseAvvio = getSpeseAvvioNazionaliConfronto(valoreEffettivo);
    const scagTabA = findScaglione(TABELLA_A_MEDIAZIONE_NAZIONALE, valoreEffettivo);
    indennita = scagTabA.minimoTabA;
    // Riduzione 1/5 per obbligatoria/demandata (art. 28, co. 8 + art. 30, co. 4)
    if (isObbligatoria(input.tipoMediazione)) {
      indennita = indennita * 0.8;
      speseAvvio = Math.round(speseAvvio * 0.8);
    }
  }

  // Maggiorazione art. 31, co. 3: +20% sull'indennità se mediatore esperto o procedura complessa
  let maggiorazioneArt31 = 0;
  if (input.mediatoreEsperto || input.proceduraComplessa) {
    maggiorazioneArt31 = Math.round(indennita * 0.2);
    indennita = indennita + maggiorazioneArt31;
  }

  // Gratuito patrocinio: indennità a carico dell'erario → 0 per la parte
  let indennitaOrganismo = speseAvvio + indennita;
  if (isGP) {
    indennitaOrganismo = 0;
  }

  // Compenso avvocato — parametri forensi stragiudiziali
  const paramStrag = findScaglione(PARAMETRI_FORENSI_STRAGIUDIZIALI, valoreEffettivo);
  const compensoBase = paramStrag.attivazione * 1.3 + paramStrag.negoziazione * 1.3 + paramStrag.conciliazione;
  // Gratuito patrocinio: avvocato a carico dell'erario → 0 per la parte
  const compensoAvvocato = isGP ? 0 : Math.round(compensoBase);
  
  // Spese generali forfettarie 15%
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  
  // CPA 4%
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  
  // IVA 22%
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  // Imposte di registro / trasferimento immobiliare
  let impostaRegistro = 0;
  let imposteImmobiliari: ImposteImmobiliari | null = null;

  if (input.materiaImmobiliare) {
    // Materia immobiliare: calcola imposte dettagliate (registro + ipotecaria + catastale)
    const primaCasa = input.primaCasa ?? false;
    imposteImmobiliari = calcolaImposteImmobiliari(valoreEffettivo, primaCasa, true);
    impostaRegistro = imposteImmobiliari.totaleImposte;
  } else {
    // Non immobiliare: imposta di registro generica — esente fino a €100.000 (art. 17 D.Lgs. 28/2010)
    if (valoreEffettivo > 100000) {
      impostaRegistro = Math.round((valoreEffettivo - 100000) * 0.03);
    }
  }

  // Costo notaio (solo se materia immobiliare)
  // Prima casa: onorari ridotti (~30% in meno) + imposta registro agevolata 2%
  let costoNotaio = 0;
  if (input.materiaImmobiliare) {
    const primaCasaFlag = input.primaCasa ?? false;
    const tabellaNotaio = primaCasaFlag ? COSTI_NOTARILI_PRIMA_CASA : COSTI_NOTARILI_SECONDA_CASA;
    const scagNotaio = findScaglione(tabellaNotaio, valoreEffettivo);
    costoNotaio = scagNotaio.onorario;
  }

  const totalePerParte = indennitaOrganismo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + impostaRegistro + costoNotaio;
  const totaleComplessivo = totalePerParte * 2;
  
  // Credito d'imposta (art. 20 D.Lgs. 28/2010):
  // - Fino a €600 per indennità organismo (accordo) o €300 (mancato accordo)
  // - Fino a €600 per compenso avvocato (solo obbligatoria/demandata)
  // - Tetto €600 per procedura (lett. a + b)
  // Il Confronto Costi assume accordo → max €600
  let creditoImpostaIndennita = isGP ? 0 : Math.min(600, indennitaOrganismo);
  let creditoImpostaAvvocato = 0;
  if (!isGP && isObbligatoria(input.tipoMediazione)) {
    creditoImpostaAvvocato = Math.min(600, compensoAvvocato);
  }
  // Tetto €600 per procedura
  const creditoImposta = Math.min(600, creditoImpostaIndennita + creditoImpostaAvvocato);
  const totaleNettoPerParte = totalePerParte - creditoImposta;

  return {
    indennitaOrganismo,
    speseAvvio,
    compensoAvvocato,
    speseGenerali15,
    iva22Avvocato,
    cpa4Avvocato,
    impostaRegistro,
    imposteImmobiliari,
    costoNotaio,
    totalePerParte,
    totaleComplessivo,
    creditoImposta,
    totaleNettoPerParte,
    modalitaTariffaria: modalita,
  };
}

// ========================
// CALCOLO COSTI CAUSA CIVILE
// ========================

function calcolaCostiCausaCivile(input: InputConfronto, valoreEffettivo: number): CostiCausaCivile {
  const isGP = input.gratuitoPatrocinio === true;
  
  const scagCU = findScaglione(CONTRIBUTO_UNIFICATO, valoreEffettivo);
  // Gratuito patrocinio: contributo unificato prenotato a debito (a carico erario)
  const contributoUnificato = isGP ? 0 : scagCU.importo;
  const marcaDaBollo = isGP ? 0 : 27;
  const dirittoCopia = isGP ? 0 : 30;

  const paramGiud = findScaglione(PARAMETRI_FORENSI_GIUDIZIALI, valoreEffettivo);
  // Gratuito patrocinio: compenso avvocato a carico erario
  const compensoAvvocato = isGP ? 0 : (paramGiud.studio + paramGiud.introduttiva + paramGiud.istruttoria + paramGiud.decisionale);
  
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  const impostaRegistroSentenza = Math.round(valoreEffettivo * 0.03);

  let stimaCTU = 0;
  if (valoreEffettivo <= 10000) stimaCTU = 500;
  else if (valoreEffettivo <= 50000) stimaCTU = 1500;
  else if (valoreEffettivo <= 250000) stimaCTU = 3000;
  else if (valoreEffettivo <= 520000) stimaCTU = 5000;
  else stimaCTU = 8000;
  // Gratuito patrocinio: CTU prenotata a debito
  if (isGP) stimaCTU = 0;

  const totalePerParte = contributoUnificato + marcaDaBollo + dirittoCopia + 
    compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + 
    impostaRegistroSentenza + stimaCTU;
  const totaleComplessivo = totalePerParte * 2;

  return {
    contributoUnificato,
    marcaDaBollo,
    dirittoCopia,
    compensoAvvocato,
    speseGenerali15,
    iva22Avvocato,
    cpa4Avvocato,
    impostaRegistroSentenza,
    stimaCTU,
    totalePerParte,
    totaleComplessivo,
  };
}

// ========================
// CALCOLO COSTI APPELLO
// ========================

function calcolaCostiAppello(input: InputConfronto, valoreEffettivo: number): CostiGradoSuccessivo {
  const isGP = input.gratuitoPatrocinio === true;
  
  const scagCU = findScaglione(CONTRIBUTO_UNIFICATO_APPELLO, valoreEffettivo);
  const contributoUnificato = isGP ? 0 : scagCU.importo;
  const marcaDaBollo = isGP ? 0 : 27;

  const paramApp = findScaglione(PARAMETRI_FORENSI_APPELLO, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramApp.studio + paramApp.introduttiva + paramApp.istruttoria + paramApp.decisionale);
  
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  // CTU in appello: possibile rinnovo o nuova CTU (art. 356 c.p.c.)
  // Stima prudenziale: stesse fasce del primo grado
  let stimaCTU = 0;
  if (valoreEffettivo <= 10000) stimaCTU = 500;
  else if (valoreEffettivo <= 50000) stimaCTU = 1500;
  else if (valoreEffettivo <= 250000) stimaCTU = 3000;
  else if (valoreEffettivo <= 520000) stimaCTU = 5000;
  else stimaCTU = 8000;
  if (isGP) stimaCTU = 0; // prenotata a debito

  const totalePerParte = contributoUnificato + marcaDaBollo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + stimaCTU;

  return {
    grado: "appello",
    contributoUnificato,
    marcaDaBollo,
    compensoAvvocato,
    speseGenerali15,
    iva22Avvocato,
    cpa4Avvocato,
    stimaCTU,
    totalePerParte,
    durataStimata: "2-3 anni",
    note: `CU maggiorato del 50% (art. 13 D.P.R. 115/2002). Parametri forensi Tabella 12 D.M. 55/2014 agg. D.M. 147/2022.${stimaCTU > 0 ? " Include stima CTU (eventuale rinnovo art. 356 c.p.c.)." : ""}${isGP ? " Gratuito patrocinio: costi a carico dell'erario." : ""}`,
  };
}

// ========================
// CALCOLO COSTI CASSAZIONE
// ========================

function calcolaCostiCassazione(input: InputConfronto, valoreEffettivo: number): CostiGradoSuccessivo {
  const isGP = input.gratuitoPatrocinio === true;
  
  const scagCU = findScaglione(CONTRIBUTO_UNIFICATO_CASSAZIONE, valoreEffettivo);
  const contributoUnificato = isGP ? 0 : scagCU.importo;
  const marcaDaBollo = isGP ? 0 : 27;

  // In Cassazione non c'è fase istruttoria
  const paramCass = findScaglione(PARAMETRI_FORENSI_CASSAZIONE, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramCass.studio + paramCass.introduttiva + paramCass.decisionale);
  
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  // In Cassazione NON c'è CTU (giudizio di legittimà, non di merito)
  const stimaCTU = 0;

  const totalePerParte = contributoUnificato + marcaDaBollo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato;

  return {
    grado: "cassazione",
    contributoUnificato,
    marcaDaBollo,
    compensoAvvocato,
    speseGenerali15,
    iva22Avvocato,
    cpa4Avvocato,
    stimaCTU,
    totalePerParte,
    durataStimata: "2-4 anni",
    note: `CU raddoppiato (art. 13 D.P.R. 115/2002). Parametri forensi Tabella 13 D.M. 55/2014 agg. D.M. 147/2022. No fase istruttoria, no CTU (giudizio di legittimità).${isGP ? " Gratuito patrocinio: costi a carico dell'erario." : ""}`,
  };
}

// ========================
// CALCOLO GRATUITO PATROCINIO
// ========================

function calcolaGratuitoPatrocinio(redditoAnnuo?: number): GratuitoPatrocinio {
  if (redditoAnnuo === undefined || redditoAnnuo === null) {
    return {
      ammissibile: false,
      limiteReddito: LIMITE_GRATUITO_PATROCINIO,
      redditoInserito: 0,
      note: "Inserire il reddito annuo imponibile per verificare l'ammissibilità al gratuito patrocinio.",
    };
  }

  const ammissibile = redditoAnnuo <= LIMITE_GRATUITO_PATROCINIO;

  return {
    ammissibile,
    limiteReddito: LIMITE_GRATUITO_PATROCINIO,
    redditoInserito: redditoAnnuo,
    note: ammissibile
      ? `Reddito ${formatEuro(redditoAnnuo)} inferiore al limite di ${formatEuro(LIMITE_GRATUITO_PATROCINIO)} (D.M. 22/04/2025). Possibile ammissione al patrocinio a spese dello Stato. Le spese legali e il contributo unificato sono a carico dell'erario.`
      : `Reddito ${formatEuro(redditoAnnuo)} superiore al limite di ${formatEuro(LIMITE_GRATUITO_PATROCINIO)}. Non ammissibile al gratuito patrocinio.`,
  };
}

// ========================
// FUNZIONE PRINCIPALE
// ========================

export function calcolaConfronto(input: InputConfronto): RisultatoConfronto {
  // Determina valore effettivo
  let valoreEffettivo = input.valoreLite;
  if (input.tipoValore !== "determinato") {
    valoreEffettivo = VALORI_INDETERMINABILI[input.tipoValore] || 25000;
  }

  const costiMediazione = calcolaCostiMediazione(input, valoreEffettivo);
  const costiCausaCivile = calcolaCostiCausaCivile(input, valoreEffettivo);
  const costiAppello = calcolaCostiAppello(input, valoreEffettivo);
  const costiCassazione = calcolaCostiCassazione(input, valoreEffettivo);
  const gratuitoPatrocinio = calcolaGratuitoPatrocinio(input.redditoAnnuo);

  // Risparmio primo grado
  const risparmioMediazione = costiCausaCivile.totalePerParte - costiMediazione.totaleNettoPerParte;
  const percentualeRisparmio = costiCausaCivile.totalePerParte > 0
    ? Math.round((risparmioMediazione / costiCausaCivile.totalePerParte) * 100)
    : 0;

  // Totale costi causa su tre gradi di giudizio
  const totaleCausaTreGradi = costiCausaCivile.totalePerParte + costiAppello.totalePerParte + costiCassazione.totalePerParte;
  
  // Risparmio mediazione rispetto a tre gradi
  const risparmioMediazioneTreGradi = totaleCausaTreGradi - costiMediazione.totaleNettoPerParte;
  const percentualeRisparmioTreGradi = totaleCausaTreGradi > 0
    ? Math.round((risparmioMediazioneTreGradi / totaleCausaTreGradi) * 100)
    : 0;

  // Vantaggi fiscali mediazione
  const vantaggiFiscali: string[] = [
    "Esenzione imposta di registro fino a €100.000 (art. 17 D.Lgs. 28/2010)",
    "Esenzione imposta di bollo su tutti gli atti del procedimento",
    "Credito d'imposta fino a €600 per procedura (€300 se non si raggiunge l'accordo)",
    "Esenzione imposte ipotecaria, catastale e di bollo sull'accordo",
  ];
  if (input.tipoMediazione === "obbligatoria" || input.tipoMediazione === "demandata") {
    vantaggiFiscali.push("Credito d'imposta aggiuntivo fino a €600 per il compenso dell'avvocato");
    vantaggiFiscali.push("Riduzione 1/5 dell'indennità di mediazione per procedura obbligatoria/demandata");
  }

  return {
    costiMediazione,
    costiCausaCivile,
    costiAppello,
    costiCassazione,
    totaleCausaTreGradi,
    risparmioMediazione,
    percentualeRisparmio,
    risparmioMediazioneTreGradi,
    percentualeRisparmioTreGradi,
    gratuitoPatrocinio,
    durataMediaStimata: {
      mediazione: "fino a 6 mesi (prorogabili di 3 in 3)",
      causaCivile: "2-5 anni (primo grado)",
      appello: "2-3 anni",
      cassazione: "2-4 anni",
    },
    vantaggiFiscali,
  };
}

// Export tabelle per visualizzazione
export function getTabellaCU() {
  return CONTRIBUTO_UNIFICATO.map(s => ({
    label: s.max === Infinity ? `Oltre €${s.min.toLocaleString("it-IT")}` : `€${s.min.toLocaleString("it-IT")} - €${s.max.toLocaleString("it-IT")}`,
    importo: s.importo,
  }));
}

export function getParametriForensiGiudiziali() {
  return PARAMETRI_FORENSI_GIUDIZIALI.map(s => ({
    label: s.max === Infinity ? `Oltre €${s.min.toLocaleString("it-IT")}` : `€${s.min.toLocaleString("it-IT")} - €${s.max.toLocaleString("it-IT")}`,
    studio: s.studio,
    introduttiva: s.introduttiva,
    istruttoria: s.istruttoria,
    decisionale: s.decisionale,
    totale: s.studio + s.introduttiva + s.istruttoria + s.decisionale,
  }));
}

export { formatEuro };
