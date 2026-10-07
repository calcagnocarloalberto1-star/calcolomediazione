/**
 * Logica di calcolo indennità mediazione
 * Supporta due modalità tariffarie:
 * 1. Nazionale — D.M. 150/2023 (art. 28 primo incontro + Tabella A incontri successivi)
 * 2. COA Genova — Tariffe locali dell'Ordine degli Avvocati di Genova
 *    (Tariffario Mediazione 2026 — Obbligatorie e Demandate / Facoltative e Contrattuali)
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
 *
 * NOTA COA Genova (verificato sul Tariffario Mediazione 2026 pubblicato da ordineavvocatigenova.it):
 * - Le spese di PRIMO INCONTRO (spese di avvio + acconto mediazione) del tariffario COA Genova
 *   "Facoltative e Contrattuali" (tariffe piene) sono numericamente identiche a quelle nazionali
 *   D.M. 150/2023 art. 28 co. 4-5 (€40/€75/€110 e €60/€120/€170); per questo vengono riusate le
 *   stesse funzioni getSpeseAvvioNazionali / getSpeseMediazionePrimoIncontro.
 * - Per gli INCONTRI SUCCESSIVI / ACCORDO (art. 30), invece, COA Genova pubblica una propria
 *   "Tabella delle Indennità" distinta dalla Tabella A nazionale (vedi TABELLA_INDENNITA_GENOVA
 *   sotto), con importi ("Indennità base") diversi da quelli nazionali e diversi anche dalle
 *   spese di primo incontro. Le mediazioni obbligatorie/demandate applicano una riduzione del 20%
 *   su tutti questi importi (rapporto esatto 0,8 verificato riga per riga sul tariffario).
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
  /**
   * true quando l'indennità di prosecuzione (incontri successivi/accordo) non è determinabile
   * dal tariffario — attualmente solo COA Genova, controversie oltre €5.000.000, dove il
   * Tariffario Mediazione 2026 riporta "ND" su tutte e tre le colonne della Tabella delle
   * Indennità. Quando true, speseBase/ulterioriSpese/detrazioneSpese/maggiorazioni sono 0 e
   * totalePerParte/totaleComplessivo/iva/totaleConIva riflettono SOLO le spese di primo
   * incontro (le uniche note con certezza): l'indennità di prosecuzione va concordata con
   * l'Organismo. Richiesto da Carlo il 28/09/2026 ("da determinare"), v. sez. 41 audit.
   */
  nonDeterminato: boolean;
}

export interface InputCalcolo {
  valoreLite: number;
  tipoMediazione: TipoMediazione;
  esito: EsitoMediazione;
  tipoValore: TipoValore;
  modalitaTariffaria?: ModalitaTariffaria;
  numeroProcedure?: number;
  gratuitoPatrocinio?: boolean;
  /** Art. 31, co. 3, lett. a) — mediatore di esperienza e competenza designato su concorde indicazione delle parti */
  mediatoreEsperto?: boolean;
  /** Art. 31, co. 3, lett. b) — complessità delle questioni oggetto della procedura */
  proceduraComplessa?: boolean;
}

// ========================
// SPESE PRIMO INCONTRO — D.M. 150/2023, Art. 28, commi 4-5
// Valide sia per le tariffe NAZIONALI sia per COA GENOVA (importi identici, verificato
// sul Tariffario Mediazione 2026 COA Genova — Facoltative e Contrattuali)
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
// TABELLA DELLE INDENNITÀ — COA GENOVA (incontri successivi / accordo, art. 30)
// Fonte: Tariffario Mediazione 2026 — Facoltative e Contrattuali (tariffe piene),
// Ordine degli Avvocati di Genova. Per le mediazioni obbligatorie/demandate si applica
// la riduzione del 20% (rapporto esatto verificato riga per riga contro il tariffario
// "Obbligatorie e Demandate": ogni importo è pari all'80% del corrispondente importo
// "Facoltative e Contrattuali").
// "indennitaBase" = colonna "Indennità base" del tariffario (importo pre-IVA, pre-maggiorazione,
// prima della riduzione 20% per le obbligatorie). Le maggiorazioni +10% (accordo al primo
// incontro, art. 31 co. 1) e +25% (accordo agli incontri successivi, art. 30 co. 2) vengono
// applicate dinamicamente dalla logica generica di calcolaIndennita, già condivisa con la
// modalità nazionale.
//
// Scaglione "Oltre €5.000.000": il Tariffario Mediazione 2026 COA Genova (Agg. 23/09/2026,
// fornito da Carlo) riporta esplicitamente "ND" su tutte e tre le colonne della Tabella delle
// Indennità per questo scaglione — a differenza della Tabella A nazionale, che per lo stesso
// scaglione ha un importo reale (v. TABELLA_A_NAZIONALI sotto). indennitaBase è quindi `null`
// per questo scaglione: calcolaIndennita() lo intercetta e restituisce nonDeterminato: true
// invece di stimare un numero. Richiesto esplicitamente da Carlo il 28/09/2026 ("da
// determinare"), v. sez. 41 audit.
// ========================
interface ScaglioneIndennitaGenova {
  min: number;
  max: number;
  /** null = "ND" nel tariffario: nessun importo determinato per questo scaglione */
  indennitaBase: number | null;
  label: string;
}
const TABELLA_INDENNITA_GENOVA: ScaglioneIndennitaGenova[] = [
  { min: 0, max: 1000, indennitaBase: 24.40, label: "Fino a €1.000" },
  { min: 1000.01, max: 5000, indennitaBase: 48.80, label: "€1.001 - €5.000" },
  { min: 5000.01, max: 10000, indennitaBase: 207.40, label: "€5.001 - €10.000" },
  { min: 10000.01, max: 25000, indennitaBase: 390.40, label: "€10.001 - €25.000" },
  { min: 25000.01, max: 50000, indennitaBase: 732.00, label: "€25.001 - €50.000" },
  { min: 50000.01, max: 150000, indennitaBase: 1256.60, label: "€50.001 - €150.000" },
  { min: 150000.01, max: 250000, indennitaBase: 1622.60, label: "€150.001 - €250.000" },
  { min: 250000.01, max: 500000, indennitaBase: 2842.60, label: "€250.001 - €500.000" },
  { min: 500000.01, max: 1500000, indennitaBase: 4550.60, label: "€500.001 - €1.500.000" },
  { min: 1500000.01, max: 2500000, indennitaBase: 5404.60, label: "€1.500.001 - €2.500.000" },
  { min: 2500000.01, max: 5000000, indennitaBase: 7722.60, label: "€2.500.001 - €5.000.000" },
  { min: 5000000.01, max: Infinity, indennitaBase: null, label: "Oltre €5.000.000 (ND — da determinare)" },
];

// Indennità base (tariffe piene) per gli incontri successivi/accordo su controversie
// indeterminabili — COA Genova (Tabella delle Indennità, colonna "Indennità base").
// Nota: a differenza delle spese di primo incontro, questi importi NON coincidono con lo
// scaglione determinato equivalente (dato pubblicato direttamente dal tariffario COA Genova).
const INDENNITA_GENOVA_PROSECUZIONE_INDETERMINABILI: Record<string, number> = {
  indeterminabile_basso: 1390.80,
  indeterminabile_medio: 1317.60,
  indeterminabile_alto: 1256.60,
};

// Valori fittizi per controversie indeterminabili (per lookup altre tabelle, es. esenzione art. 17)
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

/**
 * Spese di mediazione per incontri successivi/accordo (art. 30) — COA Genova.
 * Tariffe piene (Facoltative e Contrattuali); la riduzione 20% per le obbligatorie/demandate
 * viene applicata a valle da calcolaIndennita (riduzioneRate), come per la modalità nazionale.
 */
function getUlterioriSpeseBaseGenova(valoreLite: number, tipoValore: TipoValore): number | null {
  // Gli importi del tariffario COA Genova ("Saldo indennità prosecuzione — Totale con IVA",
  // es. €312,32 = 256 × 1,22) sono GIÀ comprensivi di IVA 22%. Il motore lavora sul netto e
  // aggiunge l'IVA alla fine: qui si scorpora, così il totale con IVA coincide col tariffario.
  const scorpora = (x: number) => Math.round((x / 1.22) * 100) / 100;
  if (tipoValore !== "determinato") {
    return scorpora(INDENNITA_GENOVA_PROSECUZIONE_INDETERMINABILI[tipoValore] ?? 1256.60);
  }
  const scaglione = getScaglioneFromTable(TABELLA_INDENNITA_GENOVA, valoreLite);
  return scaglione.indennitaBase === null ? null : scorpora(scaglione.indennitaBase); // null per "Oltre €5.000.000" (ND)
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
    // Primo incontro: importi identici alle tariffe nazionali D.M. 150/2023 art. 28 co. 4-5
    // (verificato sul Tariffario Mediazione 2026 COA Genova — Facoltative e Contrattuali)
    speseAvvio = getSpeseAvvioNazionali(valoreLite, tipoValore);
    speseMediazionePrimoIncontro = getSpeseMediazionePrimoIncontro(valoreLite, tipoValore);
    // Label scaglione basata sulla Tabella delle Indennità COA Genova (incontri successivi)
    if (tipoValore !== "determinato") {
      scaglioneLabel = tipoValore === "indeterminabile_basso" ? "Indeterminabile — basso"
        : tipoValore === "indeterminabile_medio" ? "Indeterminabile — medio"
        : "Indeterminabile — alto";
    } else {
      const scaglioneGenova = getScaglioneFromTable(TABELLA_INDENNITA_GENOVA, valoreLite);
      scaglioneLabel = scaglioneGenova.label;
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
      nonDeterminato: false,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Se accordo al primo incontro (art. 28, co. 7 + art. 30, co. 1):
  // Ulteriori spese = Tabella A minimi (nazionale) / Tabella delle Indennità (Genova),
  // con maggiorazione +10% per conciliazione al primo incontro.
  // Detrazione: spese di mediazione primo incontro già versate (art. 34, co. 2)
  if (esito === "accordo_primo") {
    let ulterioriSpeseBase: number | null;

    if (modalita === "coa_genova") {
      ulterioriSpeseBase = getUlterioriSpeseBaseGenova(valoreLite, tipoValore);
    } else {
      // Nazionale: Tabella A minimi (art. 30, co. 1)
      const valoreTabA = getValorePerTabellaA(valoreLite, tipoValore);
      const scagTabA = getScaglioneFromTable(TABELLA_A_NAZIONALI, valoreTabA);
      ulterioriSpeseBase = scagTabA.minimoTabA;
    }

    if (ulterioriSpeseBase === null) {
      // COA Genova, controversia oltre €5.000.000: il tariffario riporta "ND" (v. nota su
      // TABELLA_INDENNITA_GENOVA). Non si stima un numero: si restituisce nonDeterminato,
      // con i totali limitati alla sola parte nota con certezza (il primo incontro).
      const totalePerParte = totalePrimoIncontro;
      const totaleComplessivo = totalePerParte * 2;
      const iva = totalePerParte * 0.22;
      return {
        speseAvvio: speseAvvioRidotte,
        spesePrimoIncontro: spesePrimoIncontroRidotte,
        riduzioneObbligatoria,
        totalePrimoIncontro,
        speseBase: 0,
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
        nonDeterminato: true,
        esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
      };
    }

    // Riduzione 1/5 (nazionale) / 20% (Genova) per obbligatoria/demandata (art. 30, co. 4)
    const riduzioneObbligatoriaUlteriori = ulterioriSpeseBase * riduzioneRate;
    const ulterioriSpeseRidotte = ulterioriSpeseBase - riduzioneObbligatoriaUlteriori;

    // Maggiorazione +10% per conciliazione al primo incontro (art. 31, co. 1)
    const maggiorazioneSuccesso = Math.round(ulterioriSpeseRidotte * 0.10 * 100) / 100;

    // Detrazione spese mediazione primo incontro (art. 34, co. 2) — SOLO nazionale.
    // Verificato contro il Tariffario Mediazione 2026 COA Genova (Facoltative/Contrattuali
    // e Obbligatorie/Demandate, fornito da Carlo il 10/08/2026): la colonna "Saldo
    // indennità prosecuzione (anche senza accordo)" è testualmente un SALDO, cioè un
    // importo già netto rispetto a quanto versato al primo incontro — non un importo
    // lordo da cui detrarre ulteriormente. Applicare anche questa detrazione (come per la
    // Tabella A nazionale, dove è invece corretta ex art. 34 co. 2) produceva un doppio
    // conteggio, azzerando le "ulteriori spese" Genova sui valori di lite più bassi
    // (issue UX-05, casi C6/C7 — confermato, non più solo "da verificare").
    const detrazioneSpese = modalita === "coa_genova" ? 0 : spesePrimoIncontroRidotte;

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
      nonDeterminato: false,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Incontri successivi (art. 30, co. 2-3 + Tabella A / Tabella delle Indennità Genova)
  let ulterioriSpeseBase: number | null;

  if (modalita === "coa_genova") {
    ulterioriSpeseBase = getUlterioriSpeseBaseGenova(valoreLite, tipoValore);
  } else {
    // Tabella A minimi
    const valoreTabA = getValorePerTabellaA(valoreLite, tipoValore);
    const scagTabA = getScaglioneFromTable(TABELLA_A_NAZIONALI, valoreTabA);
    ulterioriSpeseBase = scagTabA.minimoTabA;
  }

  if (ulterioriSpeseBase === null) {
    // COA Genova, controversia oltre €5.000.000: il tariffario riporta "ND" — v. nota
    // identica sopra nel ramo accordo_primo e su TABELLA_INDENNITA_GENOVA. Vale anche per
    // l'esito "nessuno_successivi" (art. 34, co. 2: l'indennità di prosecuzione è dovuta
    // anche senza accordo, ma qui non è determinabile).
    const totalePerParte = totalePrimoIncontro;
    const totaleComplessivo = totalePerParte * 2;
    const iva = totalePerParte * 0.22;
    return {
      speseAvvio: speseAvvioRidotte,
      spesePrimoIncontro: spesePrimoIncontroRidotte,
      riduzioneObbligatoria,
      totalePrimoIncontro,
      speseBase: 0,
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
      nonDeterminato: true,
      esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
    };
  }

  // Riduzione 1/5 (nazionale) / 20% (Genova) per obbligatoria/demandata (art. 30, co. 4)
  const riduzioneObbligatoriaUlteriori = ulterioriSpeseBase * riduzioneRate;
  let ulterioriSpeseCalc = ulterioriSpeseBase - riduzioneObbligatoriaUlteriori;

  // Detrazione spese mediazione primo incontro (art. 34, co. 2) — SOLO nazionale, v. nota
  // identica sopra nel ramo accordo_primo (verificato su Tariffario COA Genova 2026: la
  // Tabella delle Indennità Genova è già un "Saldo... anche senza accordo", netto).
  const detrazioneSpese = modalita === "coa_genova" ? 0 : spesePrimoIncontroRidotte;
  ulterioriSpeseCalc -= detrazioneSpese;

  // Maggiorazione per accordo: +25% per conciliazione agli incontri successivi (art. 30, co. 2)
  let maggiorazioneSuccesso = 0;
  if (esito === "accordo_successivi") {
    maggiorazioneSuccesso = Math.round((ulterioriSpeseBase - riduzioneObbligatoriaUlteriori) * 0.25 * 100) / 100;
    ulterioriSpeseCalc += maggiorazioneSuccesso;
  }

  // Art. 31, co. 3 — Maggiorazione fino al 20% per:
  // a) esperienza e competenza del mediatore designato su concorde indicazione delle parti
  // b) complessità delle questioni oggetto della procedura
  // Si applica SOLO in caso di conciliazione in incontri successivi al primo (art. 31, co. 3)
  let maggiorazioneArt31 = 0;
  if (esito === "accordo_successivi" && (input.mediatoreEsperto || input.proceduraComplessa)) {
    // Maggiorazione calcolata sulle spese di mediazione ridotte (dopo riduzione 1/5)
    const basePerMaggiorazione = ulterioriSpeseBase - riduzioneObbligatoriaUlteriori;
    maggiorazioneArt31 = Math.round(basePerMaggiorazione * 0.20);
    ulterioriSpeseCalc += maggiorazioneArt31;
  }

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
    nonDeterminato: false,
    esenzioneArt17: calcolaEsenzioneArt17(esito, valoreLite),
  };
}

// ========================
// TABELLE PER VISUALIZZAZIONE
// ========================

/**
 * Tabella di riferimento degli scaglioni (usata per la tabella riassuntiva mostrata sotto
 * al calcolatore). Accetta un `tipoMediazione` opzionale (default "volontaria", cioè tariffa
 * piena, come prima di questa modifica) per mostrare i valori già ridotti quando l'utente ha
 * selezionato "obbligatoria"/"demandata" — la stessa riduzione del 20% (Genova) / 1/5
 * (nazionale) già applicata dal calcolo vero e proprio in calcolaIndennita().
 *
 * Prima di questa modifica la tabella mostrava SEMPRE la tariffa piena (facoltativa/
 * contrattuale), anche quando l'utente aveva selezionato "obbligatoria" o "demandata": per
 * COA Genova questo produceva numeri diversi da quelli dello scaglione "Obbligatorie e
 * Demandate" del tariffario ufficiale (es. €24,40 mostrati invece di €19,52) — la tariffa
 * piena non è mai pubblicata come tabella separata nel tariffario COA Genova "Obbligatorie
 * e Demandate" fornito da Carlo (Agg. 23/09/2026), che riporta direttamente gli importi già
 * ridotti del 20% come unica colonna "Indennità base". Segnalato da Carlo il 28/09/2026
 * ("la tabella mostrata era completamente sbagliata").
 */
export function getScaglioni(modalita: ModalitaTariffaria = "nazionale", tipoMediazione: TipoMediazione = "volontaria") {
  const riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  const fattore = 1 - riduzioneRate;
  if (modalita === "coa_genova") {
    // Tabella delle Indennità COA Genova (incontri successivi/accordo) con spese di avvio
    // primo incontro corrispondenti (identiche alle nazionali, vedi getSpeseAvvioNazionali)
    return TABELLA_INDENNITA_GENOVA.map(s => {
      let speseAvvioPiena = 110;
      if (s.max <= 1000) speseAvvioPiena = 40;
      else if (s.max <= 50000) speseAvvioPiena = 75;
      return {
        label: s.label,
        speseAvvio: speseAvvioPiena * fattore,
        // null = "Oltre €5.000.000", ND nel tariffario (v. nota su TABELLA_INDENNITA_GENOVA):
        // nessuna riduzione da applicare a un importo che non esiste.
        indennita: s.indennitaBase === null ? null : s.indennitaBase * fattore,
      };
    });
  }
  // Nazionale: mostra la Tabella A con spese avvio corrette
  return TABELLA_A_NAZIONALI.map(s => {
    // Determina la spesa di avvio in base allo scaglione
    let speseAvvioPiena = 110;
    if (s.max <= 1000) speseAvvioPiena = 40;
    else if (s.max <= 50000) speseAvvioPiena = 75;
    return {
      label: s.label,
      speseAvvio: speseAvvioPiena * fattore,
      indennita: s.minimoTabA * fattore,
    };
  });
}

/** V. nota su getScaglioni() — stesso parametro tipoMediazione, stessa riduzione dinamica. */
export function getScaglioniGenovaIndeterminabili(tipoMediazione: TipoMediazione = "volontaria") {
  const riduzioneRate = isObbligatoria(tipoMediazione) ? 0.2 : 0;
  const fattore = 1 - riduzioneRate;
  return [
    {
      label: "Indeterminabile — complessità bassa",
      speseAvvio: getSpeseAvvioNazionali(0, "indeterminabile_basso") * fattore,
      indennita: getSpeseMediazionePrimoIncontro(0, "indeterminabile_basso") * fattore,
    },
    {
      label: "Indeterminabile — complessità media",
      speseAvvio: getSpeseAvvioNazionali(0, "indeterminabile_medio") * fattore,
      indennita: getSpeseMediazionePrimoIncontro(0, "indeterminabile_medio") * fattore,
    },
    {
      label: "Indeterminabile — complessità alta",
      speseAvvio: getSpeseAvvioNazionali(0, "indeterminabile_alto") * fattore,
      indennita: getSpeseMediazionePrimoIncontro(0, "indeterminabile_alto") * fattore,
    },
  ];
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}
