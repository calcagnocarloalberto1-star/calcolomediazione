/**
 * Logica di calcolo indennità mediazione
 * Supporta due modalità tariffarie:
 * 1. Nazionale — D.M. 150/2023 (art. 28 primo incontro + Tabella A incontri successivi)
 * 2. COA Genova — Tariffe locali dell'Ordine degli Avvocati di Genova
 * 
 * Differenziazione:
 * - Mediazione VOLONTARIA: tariffe piene
 * - Mediazione OBBLIGATORIA: riduzione 1/5 (nazionale) / 20% (Genova) — art. 28, co. 8
 * - Mediazione DEMANDATA: stesse riduzioni dell'obbligatoria
 * 
 * Struttura D.M. 150/2023:
 * - Art. 28, co. 4: Spese di avvio (€40 / €75 / €110)
 * - Art. 28, co. 5: Spese di mediazione primo incontro (€60 / €120 / €170)
 * - Art. 30 + Tabella A: Spese di mediazione per incontri successivi (range min-max)
 * - Art. 30, co. 1: Conciliazione al primo incontro → ulteriori spese = Tabella A minimi
 * - Art. 30, co. 2/3: Conciliazione incontri successivi → Tabella A + maggiorazione 25%
 * - Art. 34, co. 2: Dalle ulteriori spese si detraggono le spese mediazione primo incontro (art. 28, co. 5)
 */

export type ModalitaTariffaria = "nazionale" | "coa_genova";
export type TipoMediazione = "volontaria" | "obbligatoria" | "demandata";
export type EsitoMediazione = "nessuno_primo" | "accordo_primo" | "accordo_successivi" | "nessuno_successivi";
export type TipoValore = "determinato" | "indeterminabile_basso" | "indeterminabile_medio" | "indeterminabile_alto";

export interface EsenzioneArt17 {
  esenteBollo: boolean;
  esenteRegistro: boolean;
  limiteEsenzione: number;
  impostaRegistroRisparmiata: number;
  note: string;
}

export interface CalcoloRisultato {
  speseAvvio: number;
  spesePrimoIncontro: number;
  riduzioneObbligatoria: number;
  totalePrimoIncontro: number;
  speseBase: number;
  detrazioneSpese: number;
  maggiorazioneSuccesso: number;
  maggiorazioneArt31: number;
  riduzioneObbligatoriaUlteriori: number;
  ulterioriSpese: number;
  totalePerParte: number;
  totaleComplessivo: number;
  iva: number;
  totaleConIva: number;
  scaglione: string;
  modalitaTariffaria: ModalitaTariffaria;
  esenzioneArt17: EsenzioneArt17;
}

export interface InputCalcolo {
  valoreLite: number;
  tipoMediazione: TipoMediazione;
  esito: EsitoMediazione;
  tipoValore: TipoValore;
  modalitaTariffaria?: ModalitaTariffaria;
  numeroProcedure?: number;
  gratuitoPatrocinio?: boolean;
}

// ========================
// SPESE PRIMO INCONTRO — D.M. 150/2023, Art. 28, commi 4-5
// ========================

/**
 * Art. 28, co. 4 — Spese di avvio (3 fasce):
 * - €40: liti fino a €1.000
 * - €75: liti da €1.001 a €50.000
 * - €110: liti oltre €50.000 e indeterminabili
 */
function getSpeseAvvioNazionali(valoreLite: number, tipoValore: TipoValore): number {
  if (tipoValore !== "determinato") return 110; // indeterminabili: sempre €110
  if (valoreLite <= 1000) return 40;
  if (valoreLite <= 50000) return 75;
  return 110;
}

/**
 * Art. 28, co. 5 — Spese di mediazione primo incontro (3 fasce):
 * - €60: liti fino a €1.000 / indeterminabile basso
 * - €120: liti da €1.001 a €50.000 / indeterminabile medio
 * - €170: liti oltre €50.000 / indeterminabile alto
 */
function getSpeseMediazionePrimoIncontro(valoreLite: number, tipoValore: TipoValore): number {
  if (tipoValore === "indeterminabile_basso") return 60;
  if (tipoValore === "indeterminabile_medio") return 120;
  if (tipoValore === "indeterminabile_alto") return 170;
  // Determinato
  if (valoreLite <= 1000) return 60;
  if (valoreLite <= 50000) return 120;
  return 170;
}

// ========================
// TABELLA A — D.M. 150/2023 (Spese mediazione incontri successivi)
// Importi MINIMI per scaglione (art. 31, co. 2: i minimi sono quelli
// dovuti come massimi per lo scaglione immediatamente precedente)
// ========================
const TABELLA_A_NAZIONALI = [
  { min: 0, max: 1000, minimoTabA: 80, massimoTabA: 160, label: "Fino a €1.000" },
  { min: 1000.01, max: 5000, minimoTabA: 160, massimoTabA: 290, label: "€1.001 - €5.000" },
  { min: 5000.01, max: 10000, minimoTabA: 290, massimoTabA: 440, label: "€5.001 - €10.000" },
  { min: 10000.01, max: 25000, minimoTabA: 440, massimoTabA: 720, label: "€10.001 - €25.000" },
  { min: 25000.01, max: 50000, minimoTabA: 720, massimoTabA: 1200, label: "€25.001 - €50.000" },
  { min: 50000.01, max: 150000, minimoTabA: 1200, massimoTabA: 1500, label: "€50.001 - €150.000" },
  { min: 150000.01, max: 250000, minimoTabA: 1500, massimoTabA: 2500, label: "€150.001 - €250.000" },
  { min: 250000.01, max: 500000, minimoTabA: 2500, massimoTabA: 3900, label: "€250.001 - €500.000" },
  { min: 500000.01, max: 1500000, minimoTabA: 3900, massimoTabA: 4600, label: "€500.001 - €1.500.000" },
  { min: 1500000.01, max: 2500000, minimoTabA: 4600, massimoTabA: 6500, label: "€1.500.001 - €2.500.000" },
  { min: 2500000.01, max: 5000000, minimoTabA: 6500, massimoTabA: 10000, label: "€2.500.001 - €5.000.000" },
  { min: 5000000.01, max: Infinity, minimoTabA: 10000, massimoTabA: 15000, label: "Oltre €5.000.000" },
];

// ========================
// SCAGLIONI COA GENOVA — Tariffe Ordine Avvocati Genova
// Spese avvio e indennità (acconto mediazione) per valore determinato
// Le tariffe sono piene (facoltativa/volontaria); per obbligatoria si applica riduzione 20%
// ========================
const SCAGLIONI_GENOVA = [
  { min: 0, max: 1000, speseAvvio: 40, indennita: 110, label: "Fino a €1.000" },
  { min: 1000.01, max: 5000, speseAvvio: 80, indennita: 220, label: "€1.001 - €5.000" },
  { min: 5000.01, max: 10000, speseAvvio: 100, indennita: 260, label: "€5.001 - €10.000" },
  { min: 10000.01, max: 25000, speseAvvio: 120, indennita: 360, label: "€10.001 - €25.000" },
  { min: 25000.01, max: 50000, speseAvvio: 180, indennita: 520, label: "€25.001 - €50.000" },
  { min: 50000.01, max: 100000, speseAvvio: 220, indennita: 780, label: "€50.001 - €100.000" },
  { min: 100000.01, max: 250000, speseAvvio: 260, indennita: 1560, label: "€100.001 - €250.000" },
  { min: 250000.01, max: 500000, speseAvvio: 300, indennita: 2600, label: "€250.001 - €500.000" },
  { min: 500000.01, max: Infinity, speseAvvio: 340, indennita: 3900, label: "Oltre €500.000" },
];

// Indennità Genova per controversie indeterminabili (solo acconto, spese avvio fisse €88)
// Applicate come tariffe piene; per obbligatoria riduzione 20%
const INDENNITA_GENOVA_INDETERMINABILI = {
  indeterminabile_basso: 260,   // complessità bassa
  indeterminabile_medio: 520,   // complessità media
  indeterminabile_alto: 780,    // complessità alta
};

const SPESE_AVVIO_GENOVA_INDETERMINABILI = 88;

// Valori fittizi per controversie indeterminabili (per lookup altre tabelle)
const VALORI_INDETERMINABILI: Record<string, number> = {
  indeterminabile_basso: 25000,
  indeterminabile_medio: 50000,
  indeterminabile_alto: 250000,
};

// ========================
// FUNZIONI DI LOOKUP
// ========================

function getScaglioneFromTable<T extends { min: number; max: number }>(tabella: T[], valore: number): T {
  return tabella.find(s => valore >= s.min && valore <= s.max) || tabella[tabella.length - 1];
}

function isObbligatoria(tipo: TipoMediazione): boolean {
  return tipo === "obbligatoria" || tipo === "demandata";
}

/**
 * Per le controversie indeterminabili, la Tabella A applica
 * lo scaglione €50.001 - €150.000 (art. 31 D.M. 150/2023)
 */
function getValorePerTabellaA(valoreLite: number, tipoValore: TipoValore): number {
  if (tipoValore !== "determinato") {
    return 100000; // rientra nello scaglione €50.001-€150.000
  }
  return valoreLite;
}

// ========================
// ESENZIONE ART. 17 D.LGS. 28/2010
// ========================

function calcolaEsenzioneArt17(esito: EsitoMediazione, valoreLite: number): EsenzioneArt17 {
  const hasAccordo = esito === "accordo_primo" || esito === "accordo_successivi";

  if (hasAccordo) {
    const limiteEsenzione = 100000;
    const impostaRegistroRisparmiata = Math.min(valoreLite, limiteEsenzione) * 0.03;
    return {
      esenteBollo: true,
      esenteRegistro: true,
      limiteEsenzione,
      impostaRegistroRisparmiata,
      note: "Accordo raggiunto: esenzione totale imposta di bollo su tutti gli atti (art. 17, c. 2) ed esenzione imposta di registro fino a €100.000 (art. 17, c. 3, D.Lgs. 28/2010).",
    };
  }

  return {
    esenteBollo: true,
    esenteRegistro: false,
    limiteEsenzione: 0,
    impostaRegistroRisparmiata: 0,
    note: "Esenzione parziale: imposta di bollo esente sugli atti del procedimento (art. 17, c. 2, D.Lgs. 28/2010). Esenzione imposta di registro non applicabile in assenza di accordo.",
  };
}

// ========================
// CALCOLO PRINCIPALE
// ========================

export function calcolaIndennita(input: InputCalcolo): CalcoloRisultato {
  const { tipoMediazione, esito, tipoValore } = input;
  const modalita = input.modalitaTariffaria || "nazionale";

  // Determina valore effettivo
  let valoreLite = input.valoreLite;
  if (tipoValore !== "determinato") {
    valoreLite = VALORI_INDETERMINABILI[tipoValore] || 25000;
  }

  let speseAvvio: number;
  let speseMediazionePrimoIncontro: number; // art. 28, co. 5
  let scaglioneLabel: string;
  let riduzioneRate: number;

  if (modalita === "coa_genova") {
    // ---- TARIFFE COA GENOVA ----
    if (tipoValore !== "determinato") {
      speseAvvio = SPESE_AVVIO_GENOVA_INDETERMINABILI;
      speseMediazionePrimoIncontro = INDENNITA_GENOVA_INDETERMINABILI[tipoValore] || 260;
      scaglioneLabel = tipoValore === "indeterminabile_basso" ? "Indeterminabile — basso"
        : tipoValore === "indeterminabile_medio" ? "Indeterminabile — medio"
        : "Indeterminabile — alto";
    } else {
      const scaglione = getScaglioneFromTable(SCAGLIONI_GENOVA, valoreLite);
      speseAvvio = scaglione.speseAvvio;
      speseMediazionePrimoIncontro = scaglione.indennita;
      scaglioneLabel = scaglione.label;
    }
    // Genova: riduzione 20% per obbligatoria/demandata
    riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  } else {
    // ---- TARIFFE NAZIONALI D.M. 150/2023 ----
    // Art. 28, co. 4 — Spese di avvio
    speseAvvio = getSpeseAvvioNazionali(valoreLite, tipoValore);
    // Art. 28, co. 5 — Spese di mediazione primo incontro
    speseMediazionePrimoIncontro = getSpeseMediazionePrimoIncontro(valoreLite, tipoValore);
    // Label scaglione basato sulla Tabella A
    const valoreTabA = getValorePerTabellaA(valoreLite, tipoValore);
    const scagTabA = getScaglioneFromTable(TABELLA_A_NAZIONALI, valoreTabA);
    scaglioneLabel = scagTabA.label;
    // Nazionale: riduzione 1/5 per obbligatoria/demandata (art. 28, co. 8)
    riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  }

  // Calcolo primo incontro (art. 28)
  const riduzioneSpeseAvvio = speseAvvio * riduzioneRate;
  const speseAvvioRidotte = speseAvvio - riduzioneSpeseAvvio;
  const riduzioneObbligatoria = speseMediazionePrimoIncontro * riduzioneRate;
  const spesePrimoIncontroRidotte = speseMediazionePrimoIncontro - riduzioneObbligatoria;

  const totalePrimoIncontro = speseAvvioRidotte + spesePrimoIncontroRidotte;

  // speseBase per compatibilità con l'interfaccia
  const speseBase = speseMediazionePrimoIncontro;

  // Se primo incontro senza accordo: null'altro è dovuto (art. 28, co. 6)
  if (esito === "nessuno_primo") {
    const totalePerParte = totalePrimoIncontro;
    const totaleComplessivo = totalePerParte * 2;
    const iva = totalePerParte * 0.22;
    return {
      speseAvvio: speseAvvioRidotte,
      spesePrimoIncontro: spesePrimoIncontroRidotte,
      riduzioneObbligatoria,
      totalePrimoIncontro,
      speseBase,
      detrazioneSpese: 0,
      maggiorazioneSuccesso: 0,
      maggiorazioneArt31: 0,
      riduzioneObbligatoriaUlteriori: 0,
      ulterioriSpese: 0,
      totalePerParte,
      totaleComplessivo,
      iva,
      totaleConIva: totalePerParte + iva,
      scaglione: scaglioneLabel,
      modalitaTariffaria: modalita,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Se accordo al primo incontro (art. 28, co. 7 + art. 30, co. 1):
  // Ulteriori spese = Tabella A minimi, con maggiorazione +10% per conciliazione al primo incontro
  // Detrazione: spese di mediazione primo incontro già versate (art. 34, co. 2)
  if (esito === "accordo_primo") {
    let ulterioriSpeseBase: number;

    if (modalita === "coa_genova") {
      // Per Genova: usa l'indennità come base per la maggiorazione
      ulterioriSpeseBase = speseMediazionePrimoIncontro;
    } else {
      // Nazionale: Tabella A minimi (art. 30, co. 1)
      const valoreTabA = getValorePerTabellaA(valoreLite, tipoValore);
      const scagTabA = getScaglioneFromTable(TABELLA_A_NAZIONALI, valoreTabA);
      ulterioriSpeseBase = scagTabA.minimoTabA;
    }

    // Riduzione 1/5 per obbligatoria/demandata (art. 30, co. 4)
    const riduzioneObbligatoriaUlteriori = ulterioriSpeseBase * riduzioneRate;
    const ulterioriSpeseRidotte = ulterioriSpeseBase - riduzioneObbligatoriaUlteriori;

    // Maggiorazione +10% per conciliazione al primo incontro (art. 31, co. 1)
    const maggiorazioneSuccesso = Math.round(ulterioriSpeseRidotte * 0.10);

    // Detrazione spese mediazione primo incontro (art. 34, co. 2)
    const detrazioneSpese = spesePrimoIncontroRidotte;

    const ulterioriSpeseNette = Math.max(0, ulterioriSpeseRidotte + maggiorazioneSuccesso - detrazioneSpese);

    const totalePerParte = totalePrimoIncontro + ulterioriSpeseNette;
    const totaleComplessivo = totalePerParte * 2;
    const iva = totalePerParte * 0.22;

    return {
      speseAvvio: speseAvvioRidotte,
      spesePrimoIncontro: spesePrimoIncontroRidotte,
      riduzioneObbligatoria,
      totalePrimoIncontro,
      speseBase: ulterioriSpeseBase,
      detrazioneSpese,
      maggiorazioneSuccesso,
      maggiorazioneArt31: 0,
      riduzioneObbligatoriaUlteriori,
      ulterioriSpese: ulterioriSpeseNette,
      totalePerParte,
      totaleComplessivo,
      iva,
      totaleConIva: totalePerParte + iva,
      scaglione: scaglioneLabel,
      modalitaTariffaria: modalita,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Incontri successivi (art. 30, co. 2-3 + Tabella A)
  let ulterioriSpeseBase: number;

  if (modalita === "coa_genova") {
    ulterioriSpeseBase = speseMediazionePrimoIncontro;
  } else {
    // Tabella A minimi
    const valoreTabA = getValorePerTabellaA(valoreLite, tipoValore);
    const scagTabA = getScaglioneFromTable(TABELLA_A_NAZIONALI, valoreTabA);
    ulterioriSpeseBase = scagTabA.minimoTabA;
  }

  // Riduzione 1/5 per obbligatoria/demandata (art. 30, co. 4)
  const riduzioneObbligatoriaUlteriori = ulterioriSpeseBase * riduzioneRate;
  let ulterioriSpeseCalc = ulterioriSpeseBase - riduzioneObbligatoriaUlteriori;

  // Detrazione spese mediazione primo incontro (art. 34, co. 2)
  const detrazioneSpese = spesePrimoIncontroRidotte;
  ulterioriSpeseCalc -= detrazioneSpese;

  // Maggiorazione per accordo: +25% per conciliazione agli incontri successivi (art. 31, co. 3)
  let maggiorazioneSuccesso = 0;
  if (esito === "accordo_successivi") {
    maggiorazioneSuccesso = Math.round((ulterioriSpeseBase - riduzioneObbligatoriaUlteriori) * 0.25);
    ulterioriSpeseCalc += maggiorazioneSuccesso;
  }

  // Art. 31: maggiorazione per competenza mediatore (non implementata qui, opzionale)
  const maggiorazioneArt31 = 0;

  const ulterioriSpeseNette = Math.max(0, ulterioriSpeseCalc);
  const totalePerParte = totalePrimoIncontro + ulterioriSpeseNette;
  const totaleComplessivo = totalePerParte * 2;
  const iva = totalePerParte * 0.22;

  return {
    speseAvvio: speseAvvioRidotte,
    spesePrimoIncontro: spesePrimoIncontroRidotte,
    riduzioneObbligatoria,
    totalePrimoIncontro,
    speseBase: ulterioriSpeseBase,
    detrazioneSpese,
    maggiorazioneSuccesso,
    maggiorazioneArt31,
    riduzioneObbligatoriaUlteriori,
    ulterioriSpese: ulterioriSpeseNette,
    totalePerParte,
    totaleComplessivo,
    iva,
    totaleConIva: totalePerParte + iva,
    scaglione: scaglioneLabel,
    modalitaTariffaria: modalita,
    esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
  };
}

// ========================
// TABELLE PER VISUALIZZAZIONE
// ========================

export function getScaglioni(modalita: ModalitaTariffaria = "nazionale") {
  if (modalita === "coa_genova") {
    return SCAGLIONI_GENOVA.map(s => ({
      label: s.label,
      speseAvvio: s.speseAvvio,
      indennita: s.indennita,
    }));
  }
  // Nazionale: mostra la Tabella A con spese avvio corrette
  return TABELLA_A_NAZIONALI.map(s => {
    // Determina la spesa di avvio in base allo scaglione
    let speseAvvio = 110;
    if (s.max <= 1000) speseAvvio = 40;
    else if (s.max <= 50000) speseAvvio = 75;
    return {
      label: s.label,
      speseAvvio,
      indennita: s.minimoTabA,
    };
  });
}

export function getScaglioniGenovaIndeterminabili() {
  return [
    { label: "Indeterminabile — complessità bassa", speseAvvio: SPESE_AVVIO_GENOVA_INDETERMINABILI, indennita: INDENNITA_GENOVA_INDETERMINABILI.indeterminabile_basso },
    { label: "Indeterminabile — complessità media", speseAvvio: SPESE_AVVIO_GENOVA_INDETERMINABILI, indennita: INDENNITA_GENOVA_INDETERMINABILI.indeterminabile_medio },
    { label: "Indeterminabile — complessità alta", speseAvvio: SPESE_AVVIO_GENOVA_INDETERMINABILI, indennita: INDENNITA_GENOVA_INDETERMINABILI.indeterminabile_alto },
  ];
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}
