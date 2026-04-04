/**
 * Modulo di calcolo costi procedurali completi
 * Confronto Mediazione vs Causa Civile vs Arbitrato
 *
 * Supporta due modalità tariffarie per la mediazione:
 * 1. Nazionale — D.M. 150/2023
 * 2. COA Genova — Tariffe locali Ordine Avvocati Genova
 *
 * Arbitrato supportato:
 * 1. CAM — Camera Arbitrale di Milano (tariffe dal 1 marzo 2023)
 * 2. Medyapro — Camera Arbitrale Medyapro Srl
 *
 * Fonti normative:
 * - Contributo Unificato: D.P.R. 115/2002, art. 13 (aggiornato 2024)
 * - Parametri Forensi: D.M. 55/2014 aggiornato D.M. 147/2022
 * - Indennità mediazione: D.M. 150/2023
 * - Imposta di registro: D.P.R. 131/1986, art. 8 Tariffa Parte I
 * - Esenzioni mediazione: D.Lgs. 28/2010, art. 17
 * - Gratuito Patrocinio: D.P.R. 115/2002, art. 76 — limite 2025: €13.659,64
 */

import { formatEuro, type ModalitaTariffaria } from "./calcolo-indennita.js";

// ========================
// TIPI
// ========================

export type TipoArbitrato =
  | "cam"
  | "medyapro_ordinario_unico"
  | "medyapro_ordinario_collegio"
  | "medyapro_rapido_unico"
  | "medyapro_rapido_collegio";

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
  tipoArbitrato?: TipoArbitrato;
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

export interface CostiArbitrato {
  onorariCAM: number;          // onorari istituzione (CAM o Medyapro spese amm.)
  onorariArbitro: number;      // onorari arbitro/collegio (netto IVA)
  ivaArbitro: number;
  compensoAvvocato: number;
  speseGenerali15: number;
  cpa4Avvocato: number;
  iva22Avvocato: number;
  bollo: number;
  stimaCTU: number;
  impostaRegistroLodo: number;
  totalePerParte: number;
  totaleComplessivo: number;
  // Metadati per etichette UI
  nomeIstituzione: string;
  tipoArbitro: string;
  durataStimata: string;
  noteCalcolo: string;
}

export interface RisultatoConfronto {
  costiMediazione: CostiMediazione;
  costiCausaCivile: CostiCausaCivile;
  costiAppello: CostiGradoSuccessivo;
  costiCassazione: CostiGradoSuccessivo;
  costiArbitrato: CostiArbitrato;
  totaleCausaTreGradi: number;
  risparmioMediazione: number;
  percentualeRisparmio: number;
  risparmioMediazioneTreGradi: number;
  percentualeRisparmioTreGradi: number;
  gratuitoPatrocinio: GratuitoPatrocinio;
  durataMediaStimata: { mediazione: string; causaCivile: string; appello: string; cassazione: string; arbitratoCAM: string };
  vantaggiFiscali: string[];
}

// ========================
// TABELLE NORMATIVE — PROCESSO
// ========================

const CONTRIBUTO_UNIFICATO = [
  { min: 0, max: 1100, importo: 43 },
  { min: 1100.01, max: 5200, importo: 98 },
  { min: 5200.01, max: 26000, importo: 237 },
  { min: 26000.01, max: 52000, importo: 518 },
  { min: 52000.01, max: 260000, importo: 759 },
  { min: 260000.01, max: 520000, importo: 1214 },
  { min: 520000.01, max: Infinity, importo: 1686 },
];

const PARAMETRI_FORENSI_GIUDIZIALI = [
  { min: 0, max: 1100, studio: 131, introduttiva: 131, istruttoria: 200, decisionale: 200 },
  { min: 1100.01, max: 5200, studio: 425, introduttiva: 425, istruttoria: 851, decisionale: 851 },
  { min: 5200.01, max: 26000, studio: 919, introduttiva: 777, istruttoria: 1680, decisionale: 1701 },
  { min: 26000.01, max: 52000, studio: 1701, introduttiva: 1204, istruttoria: 1806, decisionale: 2905 },
  { min: 52000.01, max: 260000, studio: 2552, introduttiva: 1628, istruttoria: 5670, decisionale: 4253 },
  { min: 260000.01, max: 520000, studio: 3544, introduttiva: 2338, istruttoria: 10411, decisionale: 6164 },
];

const PARAMETRI_FORENSI_STRAGIUDIZIALI = [
  { min: 0, max: 1100, attivazione: 68, negoziazione: 68, conciliazione: 68 },
  { min: 1100.01, max: 5200, attivazione: 236, negoziazione: 252, conciliazione: 352 },
  { min: 5200.01, max: 26000, attivazione: 425, negoziazione: 352, conciliazione: 567 },
  { min: 26000.01, max: 52000, attivazione: 567, negoziazione: 709, conciliazione: 788 },
  { min: 52000.01, max: 260000, attivazione: 992, negoziazione: 1061, conciliazione: 1276 },
  { min: 260000.01, max: 520000, attivazione: 1134, negoziazione: 1454, conciliazione: 1701 },
];

const CONTRIBUTO_UNIFICATO_APPELLO = [
  { min: 0, max: 1100, importo: 64.50 },
  { min: 1100.01, max: 5200, importo: 147 },
  { min: 5200.01, max: 26000, importo: 355.50 },
  { min: 26000.01, max: 52000, importo: 777 },
  { min: 52000.01, max: 260000, importo: 1138.50 },
  { min: 260000.01, max: 520000, importo: 1821 },
  { min: 520000.01, max: Infinity, importo: 2529 },
];

const CONTRIBUTO_UNIFICATO_CASSAZIONE = [
  { min: 0, max: 1100, importo: 86 },
  { min: 1100.01, max: 5200, importo: 196 },
  { min: 5200.01, max: 26000, importo: 474 },
  { min: 26000.01, max: 52000, importo: 1036 },
  { min: 52000.01, max: 260000, importo: 1518 },
  { min: 260000.01, max: 520000, importo: 2428 },
  { min: 520000.01, max: Infinity, importo: 3372 },
];

const PARAMETRI_FORENSI_APPELLO = [
  { min: 0, max: 1100, studio: 142, introduttiva: 142, istruttoria: 179, decisionale: 210 },
  { min: 1100.01, max: 5200, studio: 536, introduttiva: 536, istruttoria: 992, decisionale: 851 },
  { min: 5200.01, max: 26000, studio: 1134, introduttiva: 921, istruttoria: 1843, decisionale: 1911 },
  { min: 26000.01, max: 52000, studio: 2058, introduttiva: 1418, istruttoria: 3045, decisionale: 3470 },
  { min: 52000.01, max: 260000, studio: 2977, introduttiva: 1911, istruttoria: 4326, decisionale: 5103 },
  { min: 260000.01, max: 520000, studio: 4389, introduttiva: 2552, istruttoria: 5880, decisionale: 7298 },
];

const PARAMETRI_FORENSI_CASSAZIONE = [
  { min: 0, max: 1100, studio: 252, introduttiva: 284, decisionale: 142 },
  { min: 1100.01, max: 5200, studio: 709, introduttiva: 777, decisionale: 389 },
  { min: 5200.01, max: 26000, studio: 1276, introduttiva: 1134, decisionale: 672 },
  { min: 26000.01, max: 52000, studio: 2336, introduttiva: 1969, decisionale: 1208 },
  { min: 52000.01, max: 260000, studio: 3402, introduttiva: 2478, decisionale: 1775 },
  { min: 260000.01, max: 520000, studio: 4961, introduttiva: 3260, decisionale: 2552 },
];

// ========================
// TABELLE NORMATIVE — MEDIAZIONE
// ========================

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

const GENOVA_INDETERMINABILI = {
  speseAvvio: 88,
  indeterminabile_basso: 260,
  indeterminabile_medio: 520,
  indeterminabile_alto: 780,
};

// ========================
// TABELLE ARBITRATO CAM
// ========================

const TARIFFE_ARBITRATO_CAM = [
  { min: 0, max: 50000, onorariCAM: 1000, arbitroUnicoMin: 1500, arbitroUnicoMax: 2500 },
  { min: 50001, max: 100000, onorariCAM: 1700, arbitroUnicoMin: 2500, arbitroUnicoMax: 4500 },
  { min: 100001, max: 250000, onorariCAM: 3500, arbitroUnicoMin: 4500, arbitroUnicoMax: 10000 },
  { min: 250001, max: 500000, onorariCAM: 7000, arbitroUnicoMin: 10000, arbitroUnicoMax: 18000 },
  { min: 500001, max: 1000000, onorariCAM: 12000, arbitroUnicoMin: 18000, arbitroUnicoMax: 25000 },
  { min: 1000001, max: 2500000, onorariCAM: 18000, arbitroUnicoMin: 25000, arbitroUnicoMax: 40000 },
];

// ========================
// TABELLE ARBITRATO MEDYAPRO
// Fonte: Tariffe Camera Arbitrale Medyapro Srl
// ========================

// Spese amministrative per parte (ciascuna parte versa al deposito)
const SPESE_AMM_MEDYAPRO_ORDINARIO = [
  { min: 0,         max: 5000,     spese: 200 },
  { min: 5000.01,   max: 15000,    spese: 300 },
  { min: 15000.01,  max: 30000,    spese: 400 },
  { min: 30000.01,  max: 250000,   spese: 800 },
  { min: 250000.01, max: 500000,   spese: 1400 },
  { min: 500000.01, max: 1000000,  spese: 2400 },
  { min: 1000000.01,max: Infinity, spese: 3600 },
];

const SPESE_AMM_MEDYAPRO_RAPIDO = [
  { min: 0,         max: 5000,     spese: 150 },
  { min: 5000.01,   max: 15000,    spese: 250 },
  { min: 15000.01,  max: 30000,    spese: 350 },
  { min: 30000.01,  max: 250000,   spese: 600 },
  { min: 250000.01, max: 500000,   spese: 1000 },
  { min: 500000.01, max: 1000000,  spese: 1800 },
  { min: 1000000.01,max: Infinity, spese: 2600 },
];

// Compensi arbitro unico Medyapro (min/max totale — dividere per 2 per parte)
const COMPENSI_ARBITRO_UNICO_MEDYAPRO = [
  { min: 0,          max: 30000,    compMin: 1000,  compMax: 2000 },
  { min: 30000.01,   max: 50000,    compMin: 1000,  compMax: 2500 },
  { min: 50000.01,   max: 100000,   compMin: 2000,  compMax: 4500 },
  { min: 100000.01,  max: 250000,   compMin: 3500,  compMax: 7500 },
  { min: 250000.01,  max: 500000,   compMin: 6500,  compMax: 15000 },
  { min: 500000.01,  max: 1000000,  compMin: 8000,  compMax: 20000 },
  { min: 1000000.01, max: 2500000,  compMin: 15000, compMax: 35000 },
  { min: 2500000.01, max: 5000000,  compMin: 25000, compMax: 60000 },
  { min: 5000000.01, max: 10000000, compMin: 35000, compMax: 75000 },
  { min: 10000000.01,max: Infinity, compMin: 35000, compMax: 75000, percentualeEccedenza: 0.005 },
];

// Compensi collegio arbitrale Medyapro (min/max totale — dividere per 2 per parte)
const COMPENSI_COLLEGIO_MEDYAPRO = [
  { min: 0,          max: 30000,    compMin: 3000,   compMax: 6000 },
  { min: 30000.01,   max: 50000,    compMin: 3000,   compMax: 7000 },
  { min: 50000.01,   max: 100000,   compMin: 6000,   compMax: 11000 },
  { min: 100000.01,  max: 250000,   compMin: 10000,  compMax: 19000 },
  { min: 250000.01,  max: 500000,   compMin: 15000,  compMax: 38000 },
  { min: 500000.01,  max: 1000000,  compMin: 22000,  compMax: 58000 },
  { min: 1000000.01, max: 2500000,  compMin: 34000,  compMax: 87000 },
  { min: 2500000.01, max: 5000000,  compMin: 56000,  compMax: 150000 },
  { min: 5000000.01, max: 10000000, compMin: 100000, compMax: 212000 },
  { min: 10000000.01,max: Infinity, compMin: 100000, compMax: 212000, percentualeEccedenza: 0.0125 },
];

// ========================
// COSTI NOTARILI
// ========================

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
// IMPOSTE IMMOBILIARI
// ========================

function calcolaImposteImmobiliari(
  valoreImmobile: number,
  primaCasa: boolean,
  inMediazione: boolean
): ImposteImmobiliari {
  const aliquota = primaCasa ? 0.02 : 0.09;
  const aliquotaLabel = primaCasa ? "2%" : "9%";
  let impostaRegistro = Math.round(valoreImmobile * aliquota);
  if (impostaRegistro < 1000) impostaRegistro = 1000;
  if (inMediazione) {
    const valoreImponibile = Math.max(0, valoreImmobile - 100000);
    impostaRegistro = Math.round(valoreImponibile * aliquota);
    if (valoreImmobile <= 100000) impostaRegistro = 0;
  }
  const impostaIpotecaria = 50;
  const impostaCatastale = 50;
  const totaleImposte = impostaRegistro + impostaIpotecaria + impostaCatastale;
  let note = primaCasa
    ? `Agevolazione prima casa: registro ${aliquotaLabel} (art. 1 nota II-bis Tariffa Parte I). Ipotecaria e catastale €50 fisse ciascuna.`
    : `Aliquota ordinaria ${aliquotaLabel} (seconda casa). Ipotecaria e catastale €50 fisse ciascuna.`;
  if (inMediazione) note += " Esenzione registro fino a €100.000 (art. 17 D.Lgs. 28/2010).";
  return { impostaRegistro, impostaIpotecaria, impostaCatastale, totaleImposte, aliquotaRegistro: aliquotaLabel, isPrimaCasa: primaCasa, note };
}

// ========================
// LOOKUP HELPERS
// ========================

const VALORI_INDETERMINABILI: Record<string, number> = {
  indeterminabile_basso: 25000,
  indeterminabile_medio: 50000,
  indeterminabile_alto: 250000,
};

const LIMITE_GRATUITO_PATROCINIO = 13659.64;

function findScaglione<T extends { min: number; max: number }>(tabella: T[], valore: number): T {
  return tabella.find(s => valore >= s.min && valore <= s.max) || tabella[tabella.length - 1];
}

function isObbligatoria(tipo: string): boolean {
  return tipo === "obbligatoria" || tipo === "demandata";
}

function stimaCTUPerValore(valore: number): number {
  if (valore <= 10000) return 500;
  if (valore <= 50000) return 1500;
  if (valore <= 250000) return 3000;
  if (valore <= 520000) return 5000;
  return 8000;
}

// ========================
// CALCOLO MEDIAZIONE
// ========================

function calcolaCostiMediazione(input: InputConfronto, valoreEffettivo: number): CostiMediazione {
  const modalita = input.modalitaTariffaria || "nazionale";
  const isGP = input.gratuitoPatrocinio === true;

  let speseAvvio: number;
  let indennita: number;

  if (modalita === "coa_genova") {
    if (input.tipoValore !== "determinato") {
      speseAvvio = GENOVA_INDETERMINABILI.speseAvvio;
      indennita = GENOVA_INDETERMINABILI[input.tipoValore as keyof typeof GENOVA_INDETERMINABILI] as number || 260;
    } else {
      const scag = findScaglione(INDENNITA_MEDIAZIONE_GENOVA, valoreEffettivo);
      speseAvvio = scag.speseAvvio;
      indennita = scag.indennita;
    }
    if (isObbligatoria(input.tipoMediazione)) {
      indennita = indennita * 0.8;
      speseAvvio = speseAvvio * 0.8;
    }
  } else {
    speseAvvio = getSpeseAvvioNazionaliConfronto(valoreEffettivo);
    const scagTabA = findScaglione(TABELLA_A_MEDIAZIONE_NAZIONALE, valoreEffettivo);
    indennita = scagTabA.minimoTabA;
    if (isObbligatoria(input.tipoMediazione)) {
      indennita = indennita * 0.8;
      speseAvvio = Math.round(speseAvvio * 0.8);
    }
  }

  if (input.mediatoreEsperto || input.proceduraComplessa) {
    indennita = indennita + Math.round(indennita * 0.2);
  }

  let indennitaOrganismo = speseAvvio + indennita;
  if (isGP) indennitaOrganismo = 0;

  const paramStrag = findScaglione(PARAMETRI_FORENSI_STRAGIUDIZIALI, valoreEffettivo);
  const compensoBase = paramStrag.attivazione * 1.3 + paramStrag.negoziazione * 1.3 + paramStrag.conciliazione;
  const compensoAvvocato = isGP ? 0 : Math.round(compensoBase);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  let impostaRegistro = 0;
  let imposteImmobiliari: ImposteImmobiliari | null = null;
  if (input.materiaImmobiliare) {
    const primaCasa = input.primaCasa ?? false;
    imposteImmobiliari = calcolaImposteImmobiliari(valoreEffettivo, primaCasa, true);
    impostaRegistro = imposteImmobiliari.totaleImposte;
  } else {
    if (valoreEffettivo > 100000) impostaRegistro = Math.round((valoreEffettivo - 100000) * 0.03);
  }

  let costoNotaio = 0;
  if (input.materiaImmobiliare) {
    const primaCasaFlag = input.primaCasa ?? false;
    const tabellaNotaio = primaCasaFlag ? COSTI_NOTARILI_PRIMA_CASA : COSTI_NOTARILI_SECONDA_CASA;
    costoNotaio = findScaglione(tabellaNotaio, valoreEffettivo).onorario;
  }

  const totalePerParte = indennitaOrganismo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + impostaRegistro + costoNotaio;
  const totaleComplessivo = totalePerParte * 2;

  let creditoImpostaIndennita = isGP ? 0 : Math.min(600, indennitaOrganismo);
  let creditoImpostaAvvocato = 0;
  if (!isGP && isObbligatoria(input.tipoMediazione)) {
    creditoImpostaAvvocato = Math.min(600, compensoAvvocato);
  }
  const creditoImposta = Math.min(600, creditoImpostaIndennita + creditoImpostaAvvocato);
  const totaleNettoPerParte = totalePerParte - creditoImposta;

  return {
    indennitaOrganismo, speseAvvio, compensoAvvocato, speseGenerali15, iva22Avvocato,
    cpa4Avvocato, impostaRegistro, imposteImmobiliari, costoNotaio, totalePerParte,
    totaleComplessivo, creditoImposta, totaleNettoPerParte, modalitaTariffaria: modalita,
  };
}

// ========================
// CALCOLO CAUSA CIVILE
// ========================

function calcolaCostiCausaCivile(input: InputConfronto, valoreEffettivo: number): CostiCausaCivile {
  const isGP = input.gratuitoPatrocinio === true;
  const contributoUnificato = isGP ? 0 : findScaglione(CONTRIBUTO_UNIFICATO, valoreEffettivo).importo;
  const marcaDaBollo = isGP ? 0 : 27;
  const dirittoCopia = isGP ? 0 : 30;
  const paramGiud = findScaglione(PARAMETRI_FORENSI_GIUDIZIALI, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramGiud.studio + paramGiud.introduttiva + paramGiud.istruttoria + paramGiud.decisionale);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);
  const impostaRegistroSentenza = Math.round(valoreEffettivo * 0.03);
  const stimaCTU = isGP ? 0 : stimaCTUPerValore(valoreEffettivo);
  const totalePerParte = contributoUnificato + marcaDaBollo + dirittoCopia + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + impostaRegistroSentenza + stimaCTU;
  return { contributoUnificato, marcaDaBollo, dirittoCopia, compensoAvvocato, speseGenerali15, iva22Avvocato, cpa4Avvocato, impostaRegistroSentenza, stimaCTU, totalePerParte, totaleComplessivo: totalePerParte * 2 };
}

// ========================
// CALCOLO APPELLO
// ========================

function calcolaCostiAppello(input: InputConfronto, valoreEffettivo: number): CostiGradoSuccessivo {
  const isGP = input.gratuitoPatrocinio === true;
  const contributoUnificato = isGP ? 0 : findScaglione(CONTRIBUTO_UNIFICATO_APPELLO, valoreEffettivo).importo;
  const marcaDaBollo = isGP ? 0 : 27;
  const paramApp = findScaglione(PARAMETRI_FORENSI_APPELLO, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramApp.studio + paramApp.introduttiva + paramApp.istruttoria + paramApp.decisionale);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);
  const stimaCTU = isGP ? 0 : stimaCTUPerValore(valoreEffettivo);
  const totalePerParte = contributoUnificato + marcaDaBollo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + stimaCTU;
  return { grado: "appello", contributoUnificato, marcaDaBollo, compensoAvvocato, speseGenerali15, iva22Avvocato, cpa4Avvocato, stimaCTU, totalePerParte, durataStimata: "2-3 anni", note: `CU maggiorato del 50% (art. 13 D.P.R. 115/2002). Parametri Tab. 12 D.M. 55/2014.${isGP ? " GP attivo." : ""}` };
}

// ========================
// CALCOLO CASSAZIONE
// ========================

function calcolaCostiCassazione(input: InputConfronto, valoreEffettivo: number): CostiGradoSuccessivo {
  const isGP = input.gratuitoPatrocinio === true;
  const contributoUnificato = isGP ? 0 : findScaglione(CONTRIBUTO_UNIFICATO_CASSAZIONE, valoreEffettivo).importo;
  const marcaDaBollo = isGP ? 0 : 27;
  const paramCass = findScaglione(PARAMETRI_FORENSI_CASSAZIONE, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramCass.studio + paramCass.introduttiva + paramCass.decisionale);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);
  const totalePerParte = contributoUnificato + marcaDaBollo + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato;
  return { grado: "cassazione", contributoUnificato, marcaDaBollo, compensoAvvocato, speseGenerali15, iva22Avvocato, cpa4Avvocato, stimaCTU: 0, totalePerParte, durataStimata: "2-4 anni", note: `CU raddoppiato (art. 13 D.P.R. 115/2002). Parametri Tab. 13 D.M. 55/2014. No CTU.${isGP ? " GP attivo." : ""}` };
}

// ========================
// CALCOLO ARBITRATO CAM
// ========================

function calcolaCostiArbitratoCAM(input: InputConfronto, valoreEffettivo: number): CostiArbitrato {
  const isGP = input.gratuitoPatrocinio === true;
  const scagCAM = findScaglione(TARIFFE_ARBITRATO_CAM, valoreEffettivo);
  const onorariCAM = Math.round(scagCAM.onorariCAM / 2);
  const arbitroUnicoAvg = (scagCAM.arbitroUnicoMin + scagCAM.arbitroUnicoMax) / 2;
  const onorariArbitro = Math.round(arbitroUnicoAvg / 2);
  const ivaArbitro = Math.round(onorariArbitro * 0.22);
  const paramGiud = findScaglione(PARAMETRI_FORENSI_GIUDIZIALI, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramGiud.studio + paramGiud.introduttiva + paramGiud.istruttoria + paramGiud.decisionale);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);
  const bollo = 150;
  const stimaCTU = isGP ? 0 : stimaCTUPerValore(valoreEffettivo);
  const impostaRegistroLodo = Math.round(valoreEffettivo * 0.03);
  const totalePerParte = onorariCAM + onorariArbitro + ivaArbitro + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + bollo + stimaCTU + impostaRegistroLodo;
  return {
    onorariCAM, onorariArbitro, ivaArbitro, compensoAvvocato, speseGenerali15, cpa4Avvocato, iva22Avvocato, bollo, stimaCTU, impostaRegistroLodo,
    totalePerParte, totaleComplessivo: totalePerParte * 2,
    nomeIstituzione: "CAM — Camera Arbitrale di Milano",
    tipoArbitro: "Arbitro unico (valori medi min/max)",
    durataStimata: "6-12 mesi",
    noteCalcolo: "Tariffe CAM in vigore dal 1 marzo 2023. Arbitro unico, valori medi. Onorari CAM esenti IVA; IVA 22% sugli onorari dell'arbitro. Non si applica il contributo unificato.",
  };
}

// ========================
// CALCOLO ARBITRATO MEDYAPRO
// ========================

function calcolaCostiArbitratoMedyapro(
  input: InputConfronto,
  valoreEffettivo: number,
  tipoArbitrato: TipoArbitrato
): CostiArbitrato {
  const isGP = input.gratuitoPatrocinio === true;
  const isRapido = tipoArbitrato.includes("rapido");
  const isCollegio = tipoArbitrato.includes("collegio");

  // Spese amministrative (per parte — ciascuna parte versa)
  const tabellaSpese = isRapido ? SPESE_AMM_MEDYAPRO_RAPIDO : SPESE_AMM_MEDYAPRO_ORDINARIO;
  const onorariCAM = findScaglione(tabellaSpese, valoreEffettivo).spese;

  // Compensi arbitro/collegio (totale da dividere per 2 per parte)
  const tabellaArbitro = isCollegio ? COMPENSI_COLLEGIO_MEDYAPRO : COMPENSI_ARBITRO_UNICO_MEDYAPRO;
  const scagArbitro = findScaglione(tabellaArbitro, valoreEffettivo) as any;
  let compTotMin = scagArbitro.compMin;
  let compTotMax = scagArbitro.compMax;
  // Gestione scaglione oltre 10M con percentuale sull'eccedente
  if (scagArbitro.percentualeEccedenza && valoreEffettivo > 10000000) {
    const eccedente = valoreEffettivo - 10000000;
    compTotMin += Math.round(eccedente * scagArbitro.percentualeEccedenza);
    compTotMax += Math.round(eccedente * scagArbitro.percentualeEccedenza);
  }
  const compTotAvg = (compTotMin + compTotMax) / 2;
  const onorariArbitro = Math.round(compTotAvg / 2); // per parte
  const ivaArbitro = Math.round(onorariArbitro * 0.22);

  // Compenso avvocato — stessi parametri giudiziali
  const paramGiud = findScaglione(PARAMETRI_FORENSI_GIUDIZIALI, valoreEffettivo);
  const compensoAvvocato = isGP ? 0 : (paramGiud.studio + paramGiud.introduttiva + paramGiud.istruttoria + paramGiud.decisionale);
  const speseGenerali15 = Math.round(compensoAvvocato * 0.15);
  const cpa4Avvocato = Math.round((compensoAvvocato + speseGenerali15) * 0.04);
  const iva22Avvocato = Math.round((compensoAvvocato + speseGenerali15 + cpa4Avvocato) * 0.22);

  const bollo = 150;
  const stimaCTU = isGP ? 0 : stimaCTUPerValore(valoreEffettivo);
  const impostaRegistroLodo = Math.round(valoreEffettivo * 0.03);

  const totalePerParte = onorariCAM + onorariArbitro + ivaArbitro + compensoAvvocato + speseGenerali15 + cpa4Avvocato + iva22Avvocato + bollo + stimaCTU + impostaRegistroLodo;

  const tipoArbitroLabel = isCollegio ? "Collegio arbitrale (3 arbitri, valori medi)" : "Arbitro unico (valori medi min/max)";
  const tipoProc = isRapido ? "Arbitrato rapido" : "Arbitrato ordinario";
  const durata = isRapido ? "3-6 mesi" : "6-12 mesi";

  return {
    onorariCAM, onorariArbitro, ivaArbitro, compensoAvvocato, speseGenerali15, cpa4Avvocato, iva22Avvocato, bollo, stimaCTU, impostaRegistroLodo,
    totalePerParte, totaleComplessivo: totalePerParte * 2,
    nomeIstituzione: `Medyapro — ${tipoProc}`,
    tipoArbitro: tipoArbitroLabel,
    durataStimata: durata,
    noteCalcolo: `Tariffe Camera Arbitrale Medyapro Srl. ${tipoProc}, ${tipoArbitroLabel.toLowerCase()}. Spese amministrative versate da ciascuna parte al deposito. IVA 22% sugli onorari dell'arbitro. Imposta di bollo stimata €150. Non si applica il contributo unificato.`,
  };
}

// ========================
// GRATUITO PATROCINIO
// ========================

function calcolaGratuitoPatrocinio(redditoAnnuo?: number): GratuitoPatrocinio {
  if (redditoAnnuo === undefined || redditoAnnuo === null) {
    return { ammissibile: false, limiteReddito: LIMITE_GRATUITO_PATROCINIO, redditoInserito: 0, note: "Inserire il reddito annuo per verificare l'ammissibilità." };
  }
  const ammissibile = redditoAnnuo <= LIMITE_GRATUITO_PATROCINIO;
  return {
    ammissibile, limiteReddito: LIMITE_GRATUITO_PATROCINIO, redditoInserito: redditoAnnuo,
    note: ammissibile
      ? `Reddito ${formatEuro(redditoAnnuo)} inferiore al limite di ${formatEuro(LIMITE_GRATUITO_PATROCINIO)} (D.M. 22/04/2025). Possibile ammissione al patrocinio a spese dello Stato.`
      : `Reddito ${formatEuro(redditoAnnuo)} superiore al limite di ${formatEuro(LIMITE_GRATUITO_PATROCINIO)}. Non ammissibile al gratuito patrocinio.`,
  };
}

// ========================
// FUNZIONE PRINCIPALE
// ========================

export function calcolaConfronto(input: InputConfronto): RisultatoConfronto {
  let valoreEffettivo = input.valoreLite;
  if (input.tipoValore !== "determinato") {
    valoreEffettivo = VALORI_INDETERMINABILI[input.tipoValore] || 25000;
  }

  const costiMediazione = calcolaCostiMediazione(input, valoreEffettivo);
  const costiCausaCivile = calcolaCostiCausaCivile(input, valoreEffettivo);
  const costiAppello = calcolaCostiAppello(input, valoreEffettivo);
  const costiCassazione = calcolaCostiCassazione(input, valoreEffettivo);

  const tipoArb = input.tipoArbitrato || "cam";
  const costiArbitrato = tipoArb === "cam"
    ? calcolaCostiArbitratoCAM(input, valoreEffettivo)
    : calcolaCostiArbitratoMedyapro(input, valoreEffettivo, tipoArb);

  const gratuitoPatrocinio = calcolaGratuitoPatrocinio(input.redditoAnnuo);

  const risparmioMediazione = costiCausaCivile.totalePerParte - costiMediazione.totaleNettoPerParte;
  const percentualeRisparmio = costiCausaCivile.totalePerParte > 0
    ? Math.round((risparmioMediazione / costiCausaCivile.totalePerParte) * 100) : 0;
  const totaleCausaTreGradi = costiCausaCivile.totalePerParte + costiAppello.totalePerParte + costiCassazione.totalePerParte;
  const risparmioMediazioneTreGradi = totaleCausaTreGradi - costiMediazione.totaleNettoPerParte;
  const percentualeRisparmioTreGradi = totaleCausaTreGradi > 0
    ? Math.round((risparmioMediazioneTreGradi / totaleCausaTreGradi) * 100) : 0;

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
    costiMediazione, costiCausaCivile, costiAppello, costiCassazione, costiArbitrato,
    totaleCausaTreGradi, risparmioMediazione, percentualeRisparmio,
    risparmioMediazioneTreGradi, percentualeRisparmioTreGradi,
    gratuitoPatrocinio,
    durataMediaStimata: {
      mediazione: "1-6 mesi",
      causaCivile: "2-4 anni",
      appello: "+1-3 anni",
      cassazione: "+1-3 anni",
      arbitratoCAM: costiArbitrato.durataStimata,
    },
    vantaggiFiscali,
  };
}

export function getTabellaCU() {
  return CONTRIBUTO_UNIFICATO.map(s => ({
    label: s.max === Infinity ? `Oltre €${s.min.toLocaleString("it-IT")}` : `€${s.min.toLocaleString("it-IT")} - €${s.max.toLocaleString("it-IT")}`,
    importo: s.importo,
  }));
}

export function getParametriForensiGiudiziali() {
  return PARAMETRI_FORENSI_GIUDIZIALI.map(s => ({
    label: s.max === Infinity ? `Oltre €${s.min.toLocaleString("it-IT")}` : `€${s.min.toLocaleString("it-IT")} - €${s.max.toLocaleString("it-IT")}`,
    studio: s.studio, introduttiva: s.introduttiva, istruttoria: s.istruttoria, decisionale: s.decisionale,
    totale: s.studio + s.introduttiva + s.istruttoria + s.decisionale,
  }));
}

export { formatEuro };
