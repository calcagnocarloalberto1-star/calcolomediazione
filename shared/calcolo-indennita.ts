/**
 * Logica di calcolo indennità mediazione
 * Supporta due modalità tariffarie:
 * 1. Nazionale — D.M. 150/2023, Tabella A
 * 2. COA Genova — Tariffe locali dell'Ordine degli Avvocati di Genova
 * 
 * Differenziazione:
 * - Mediazione VOLONTARIA: tariffe piene
 * - Mediazione OBBLIGATORIA: riduzione (1/5 per nazionale, 20% per Genova)
 *   - Valore determinato
 *   - Indeterminabile basso / medio / alto
 * - Mediazione DEMANDATA: stesse riduzioni dell'obbligatoria
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
// SCAGLIONI NAZIONALI — D.M. 150/2023 Tabella A
// ========================
const SCAGLIONI_NAZIONALI = [
  { min: 0, max: 1000, speseAvvio: 40, indennita: 60, label: "Fino a €1.000" },
  { min: 1000.01, max: 5000, speseAvvio: 40, indennita: 120, label: "€1.001 - €5.000" },
  { min: 5000.01, max: 10000, speseAvvio: 40, indennita: 200, label: "€5.001 - €10.000" },
  { min: 10000.01, max: 25000, speseAvvio: 40, indennita: 360, label: "€10.001 - €25.000" },
  { min: 25000.01, max: 50000, speseAvvio: 40, indennita: 600, label: "€25.001 - €50.000" },
  { min: 50000.01, max: 100000, speseAvvio: 40, indennita: 880, label: "€50.001 - €100.000" },
  { min: 100000.01, max: 250000, speseAvvio: 40, indennita: 1200, label: "€100.001 - €250.000" },
  { min: 250000.01, max: 500000, speseAvvio: 40, indennita: 1800, label: "€250.001 - €500.000" },
  { min: 500000.01, max: 2500000, speseAvvio: 40, indennita: 3600, label: "€500.001 - €2.500.000" },
  { min: 2500000.01, max: 5000000, speseAvvio: 40, indennita: 5400, label: "€2.500.001 - €5.000.000" },
  { min: 5000000.01, max: Infinity, speseAvvio: 40, indennita: 9200, label: "Oltre €5.000.000" },
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

function getScaglioneFromTable(tabella: typeof SCAGLIONI_NAZIONALI, valore: number) {
  return tabella.find(s => valore >= s.min && valore <= s.max) || tabella[tabella.length - 1];
}

function isObbligatoria(tipo: TipoMediazione): boolean {
  return tipo === "obbligatoria" || tipo === "demandata";
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
  let speseBase: number; // indennità base
  let scaglioneLabel: string;
  let riduzioneRate: number;

  if (modalita === "coa_genova") {
    // ---- TARIFFE COA GENOVA ----
    if (tipoValore !== "determinato") {
      // Indeterminabili: spese avvio fisse + acconto specifico
      speseAvvio = SPESE_AVVIO_GENOVA_INDETERMINABILI;
      speseBase = INDENNITA_GENOVA_INDETERMINABILI[tipoValore] || 260;
      scaglioneLabel = tipoValore === "indeterminabile_basso" ? "Indeterminabile — basso"
        : tipoValore === "indeterminabile_medio" ? "Indeterminabile — medio"
        : "Indeterminabile — alto";
    } else {
      const scaglione = getScaglioneFromTable(SCAGLIONI_GENOVA, valoreLite);
      speseAvvio = scaglione.speseAvvio;
      speseBase = scaglione.indennita;
      scaglioneLabel = scaglione.label;
    }
    // Genova: riduzione 20% per obbligatoria/demandata
    riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  } else {
    // ---- TARIFFE NAZIONALI D.M. 150/2023 ----
    const scaglione = getScaglioneFromTable(SCAGLIONI_NAZIONALI, valoreLite);
    speseAvvio = scaglione.speseAvvio;
    speseBase = scaglione.indennita;
    scaglioneLabel = scaglione.label;
    // Nazionale: riduzione 1/5 per obbligatoria/demandata
    riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  }

  // Calcolo primo incontro
  let spesePrimoIncontro = speseBase;
  const riduzioneObbligatoria = speseBase * riduzioneRate;
  spesePrimoIncontro = speseBase - riduzioneObbligatoria;

  const totalePrimoIncontro = speseAvvio + spesePrimoIncontro;

  // Se primo incontro senza accordo
  if (esito === "nessuno_primo") {
    const totalePerParte = totalePrimoIncontro;
    const totaleComplessivo = totalePerParte * 2;
    const iva = totalePerParte * 0.22;
    return {
      speseAvvio,
      spesePrimoIncontro,
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

  // Se accordo al primo incontro
  if (esito === "accordo_primo") {
    const maggiorazioneSuccesso = speseBase * 0.2; // +1/5 per accordo
    const totalePerParte = totalePrimoIncontro + maggiorazioneSuccesso;
    const totaleComplessivo = totalePerParte * 2;
    const iva = totalePerParte * 0.22;
    return {
      speseAvvio,
      spesePrimoIncontro,
      riduzioneObbligatoria,
      totalePrimoIncontro,
      speseBase,
      detrazioneSpese: 0,
      maggiorazioneSuccesso,
      maggiorazioneArt31: 0,
      riduzioneObbligatoriaUlteriori: 0,
      ulterioriSpese: maggiorazioneSuccesso,
      totalePerParte,
      totaleComplessivo,
      iva,
      totaleConIva: totalePerParte + iva,
      scaglione: scaglioneLabel,
      modalitaTariffaria: modalita,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Incontri successivi
  let ulterioriSpese = speseBase;

  // Detrazione spese avvio
  const detrazioneSpese = speseAvvio;
  ulterioriSpese -= detrazioneSpese;

  // Riduzione obbligatoria/demandata anche per incontri successivi
  const riduzioneObbligatoriaUlteriori = speseBase * riduzioneRate;
  ulterioriSpese -= riduzioneObbligatoriaUlteriori;

  // Maggiorazione per accordo
  let maggiorazioneSuccesso = 0;
  if (esito === "accordo_successivi") {
    maggiorazioneSuccesso = speseBase * 0.2;
    ulterioriSpese += maggiorazioneSuccesso;
  }

  // Art. 31: maggiorazione per materie obbligatorie (non implementata qui)
  const maggiorazioneArt31 = 0;

  const totalePerParte = totalePrimoIncontro + Math.max(0, ulterioriSpese);
  const totaleComplessivo = totalePerParte * 2;
  const iva = totalePerParte * 0.22;

  return {
    speseAvvio,
    spesePrimoIncontro,
    riduzioneObbligatoria,
    totalePrimoIncontro,
    speseBase,
    detrazioneSpese,
    maggiorazioneSuccesso,
    maggiorazioneArt31,
    riduzioneObbligatoriaUlteriori,
    ulterioriSpese: Math.max(0, ulterioriSpese),
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
  const tabella = modalita === "coa_genova" ? SCAGLIONI_GENOVA : SCAGLIONI_NAZIONALI;
  return tabella.map(s => ({
    label: s.label,
    speseAvvio: s.speseAvvio,
    indennita: s.indennita,
  }));
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
