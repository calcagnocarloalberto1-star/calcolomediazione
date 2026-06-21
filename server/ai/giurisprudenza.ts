/**
 * server/ai/giurisprudenza.ts
 * ============================================================
 * Catalogo strutturato di pronunce di legittimità e di merito
 * sulla mediazione civile e commerciale (D.Lgs. 28/2010),
 * consultabile dai motori AI server-side per arricchire i prompt
 * (Analisi caso AI, Bozza accordo, Maan-Batna, Guida strategica).
 *
 * Mantenuto come fonte di verità lato server. Aggiornato in
 * sincronia con `client/src/data/giurisprudenza-db.ts` per i temi
 * di interesse trasversale (procura sostanziale, condizione di
 * procedibilità, art. 17 esenzioni fiscali).
 *
 * Aggiornato a giugno 2026 - 6 pronunce di riferimento sul tema
 * "procura sostanziale e rappresentanza in mediazione".
 * ============================================================
 */

export interface PronunciaAI {
  /** Identificativo univoco interno */
  id: string;
  /** Organo giudicante (es. "Cassazione", "Tribunale", "Corte costituzionale") */
  organo: string;
  /** Sezione (se applicabile) */
  sezione?: string;
  /** Numero sentenza/ordinanza */
  numero: string;
  /** Anno (4 cifre) */
  anno: number;
  /** Data deposito (YYYY-MM-DD) */
  data: string;
  /** Presidente */
  presidente?: string;
  /** Relatore/Estensore */
  relatore?: string;
  /** Titolo sintetico (max 100 char) */
  titolo: string;
  /** Tema principale */
  tema: TemaPronuncia;
  /** Massima in forma compressa (max 600 char) */
  massima: string;
  /** Principio di diritto enunciato */
  principio: string;
  /** Citazione formale per essere riportata nei prompt */
  citazioneFormale: string;
  /** Riferimenti normativi e giurisprudenziali */
  riferimenti: string[];
  /** Tag per indicizzazione semantica nei prompt */
  tag: string[];
  /** URL fonte primaria */
  fonteUrl: string;
}

export type TemaPronuncia =
  | "procura_sostanziale"
  | "condizione_procedibilita"
  | "comunicazione_invito"
  | "simmetria_mediazione_giudizio"
  | "patrocinio_gratuito"
  | "esenzioni_fiscali"
  | "altro";

// ─── DATASET ─────────────────────────────────────────────────────────────

export const PRONUNCE_LEGITTIMITA_MEDIAZIONE: PronunciaAI[] = [
  {
    id: "cass-10978-2026",
    organo: "Cassazione",
    sezione: "II Civile",
    numero: "10978",
    anno: 2026,
    data: "2026-04-24",
    presidente: "Scarpa",
    relatore: "Trapuzzano",
    titolo:
      "Procura sostanziale in mediazione: ammissibile il conferimento al medesimo difensore",
    tema: "procura_sostanziale",
    massima:
      "Nel procedimento di mediazione obbligatoria ex D.Lgs. 28/2010, la comparizione personale della parte puo' essere sostituita da quella di un rappresentante sostanziale munito di apposita procura, anche coincidente con il difensore della parte stessa. La procura sostanziale richiede la sola forma scritta con sottoscrizione del rappresentato, senza necessita' di autenticazione ex art. 1392 c.c., salvo che la legge richieda forma diversa per l'atto da compiere (es. trascrizione ex art. 2643 c.c.).",
    principio:
      "La procura sostanziale per la partecipazione alla mediazione obbligatoria puo' essere validamente conferita anche al medesimo difensore della parte; non richiede autenticazione notarile salvo specifica previsione di legge per la forma dell'atto da compiere.",
    citazioneFormale:
      "Cass. civ., Sez. II, ord. 24 aprile 2026, n. 10978 (Pres. Scarpa, Rel. Trapuzzano)",
    riferimenti: [
      "Art. 8 D.Lgs. 28/2010",
      "Art. 1392 c.c.",
      "Art. 2643 c.c.",
      "Cass. 8473/2019",
      "Cass. 14676/2025",
      "Cass. 9608/2026",
    ],
    tag: [
      "procura sostanziale",
      "difensore",
      "mediazione obbligatoria",
      "forma scritta",
      "non autenticazione",
      "rappresentanza",
      "art. 1392 c.c.",
      "condominio",
    ],
    fonteUrl:
      "https://www.dirittobancario.it/art/sulla-procura-sostanziale-nel-procedimento-di-mediazione/",
  },

  {
    id: "cass-9608-2026",
    organo: "Cassazione",
    sezione: "III Civile",
    numero: "9608",
    anno: 2026,
    data: "2026-04-15",
    presidente: "Rubino",
    relatore: "Gianniti",
    titolo:
      "Mediazione obbligatoria: il difensore non puo' cumulare i ruoli di parte e assistente",
    tema: "procura_sostanziale",
    massima:
      "In tema di mediazione obbligatoria o demandata ex D.Lgs. 28/2010, la condizione di procedibilita' della domanda giudiziale e' collegata all'effettivo esperimento del procedimento. La condizione si considera soddisfatta quando al primo incontro almeno la parte ritualmente onerata compaia personalmente ovvero tramite un rappresentante munito di adeguati poteri sostanziali. La sola comparizione dell'avvocato, anche se munito di procura, non e' idonea quando il difensore non possa cumulare in se' i distinti ruoli di parte e di suo assistente.",
    principio:
      "La condizione di procedibilita' della mediazione obbligatoria richiede la partecipazione effettiva della parte (personalmente o tramite rappresentante sostanziale distinto), non surrogabile dal solo difensore.",
    citazioneFormale:
      "Cass. civ., Sez. III, ord. 15 aprile 2026, n. 9608 (Pres. Rubino, Rel. Gianniti)",
    riferimenti: [
      "Art. 5 D.Lgs. 28/2010",
      "Art. 8 D.Lgs. 28/2010",
      "Cass. 8473/2019",
      "Cass. 18485/2024",
      "Cass. 14676/2025",
    ],
    tag: [
      "procura sostanziale",
      "condizione di procedibilita'",
      "comparizione personale",
      "cumulo ruoli",
      "difensore",
      "art. 5 d.lgs. 28/2010",
    ],
    fonteUrl: "https://www.dirittobancario.it/cat/giurisprudenza/contratti-e-garanzie-giurisprudenza/",
  },

  {
    id: "cass-15584-2026",
    organo: "Cassazione",
    sezione: "III Civile",
    numero: "15584",
    anno: 2026,
    data: "2026-05-21",
    presidente: "Scarano",
    relatore: "Pellecchia",
    titolo:
      "Mediazione obbligatoria: condizione di procedibilita' riferita solo all'atto introduttivo",
    tema: "condizione_procedibilita",
    massima:
      "La mediazione obbligatoria ex articolo 5 D.Lgs. 28/2010, quale condizione di procedibilita' finalizzata al raggiungimento di una soluzione conciliativa, e' applicabile al solo atto introduttivo del giudizio, e non anche alle domande riconvenzionali, fermo restando che al mediatore compete di valutare tutte le istanze e gli interessi delle parti ed al giudice di esperire il tentativo di mediazione, ove possibile, per l'intero corso del processo.",
    principio:
      "La condizione di procedibilita' della mediazione obbligatoria si applica solo all'atto introduttivo, non alle domande riconvenzionali.",
    citazioneFormale:
      "Cass. civ., Sez. III, ord. 21 maggio 2026, n. 15584 (Pres. Scarano, Rel. Pellecchia)",
    riferimenti: ["Art. 5 D.Lgs. 28/2010", "Cass. SU 19596/2020"],
    tag: [
      "condizione di procedibilita'",
      "domanda riconvenzionale",
      "atto introduttivo",
      "art. 5 d.lgs. 28/2010",
    ],
    fonteUrl:
      "https://ntplusdiritto.ilsole24ore.com/art/rassegna-massime-cassazione-civile-AIcFkkiD",
  },

  {
    id: "trib-tivoli-269-2026",
    organo: "Tribunale",
    sezione: "Tivoli",
    numero: "269",
    anno: 2026,
    data: "2026-05-01",
    titolo:
      "Convocazione mediazione al solo difensore non basta se procura limitata al giudizio",
    tema: "comunicazione_invito",
    massima:
      "Nella mediazione obbligatoria non si puo' dare per scontato che il difensore nominato nel giudizio sia automaticamente destinatario valido anche delle comunicazioni relative alla fase stragiudiziale. Se la procura alle liti riguarda soltanto la fase giudiziale e non contiene riferimento espresso alla fase stragiudiziale o al procedimento di mediazione, l'invito al solo avvocato non basta a soddisfare la condizione di procedibilita'.",
    principio:
      "Solo una procura che preveda espressamente anche la fase stragiudiziale o la procedura di mediazione puo' giustificare la comunicazione dell'invito al solo difensore.",
    citazioneFormale: "Trib. Tivoli, sent. n. 269/2026",
    riferimenti: [
      "Art. 5 D.Lgs. 28/2010",
      "Art. 8 D.Lgs. 28/2010",
      "Cass. 9608/2026",
    ],
    tag: [
      "procura alle liti",
      "procura sostanziale",
      "convocazione mediazione",
      "fase stragiudiziale",
      "domicilio eletto",
    ],
    fonteUrl:
      "https://www.mondoadr.it/giurisprudenza_art/non-basta-mandare-linvito-al-solo-avvocato-se-la-convocazione-in-mediazione-e-irregolare-il-decreto-ingiuntivo-va-revocato-2/",
  },

  {
    id: "trib-civitavecchia-503-2026",
    organo: "Tribunale",
    sezione: "Civitavecchia",
    numero: "503",
    anno: 2026,
    data: "2026-04-10",
    titolo:
      "Mediazione demandata: comunicazione al difensore costituito sufficiente alla procedibilita'",
    tema: "comunicazione_invito",
    massima:
      "Nel contesto della mediazione demandata dal giudice in corso di causa, la comunicazione dell'avvio del procedimento al procuratore costituito non puo' essere considerata automaticamente inidonea ai fini della procedibilita'. Cio' che conta e' che la comunicazione sia effettivamente idonea a informare la parte e a consentirle la partecipazione. Il difensore gia' costituito puo' rappresentare un canale idoneo, deontologicamente tenuto a trasmettere l'informazione al cliente.",
    principio:
      "Nella mediazione demandata in corso di causa, la comunicazione al difensore costituito puo' soddisfare la condizione di procedibilita' se idonea a rendere la parte effettivamente informata.",
    citazioneFormale: "Trib. Civitavecchia, sent. n. 503/2026",
    riferimenti: ["Art. 5 D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    tag: [
      "mediazione demandata",
      "comunicazione difensore",
      "procuratore costituito",
      "PEC",
      "condizione di procedibilita'",
    ],
    fonteUrl:
      "https://www.mondoadr.it/giurisprudenza_art/nella-mediazione-demandata-puo-bastare-linvito-al-difensore-no-a-formalismi-che-svuotano-la-procedibilita/",
  },

  {
    id: "trib-milano-390-2026",
    organo: "Tribunale",
    sezione: "Milano",
    numero: "390",
    anno: 2026,
    data: "2026-04-01",
    titolo:
      "Mediazione obbligatoria: simmetria tra istanza di mediazione e domanda giudiziale",
    tema: "simmetria_mediazione_giudizio",
    massima:
      "In tema di mediazione obbligatoria, la condizione di procedibilita' della domanda giudiziale si considera validamente assolta solo qualora sussista piena corrispondenza e simmetria tra i fatti esposti nell'istanza di mediazione e quelli successivamente dedotti in sede processuale. Nuovi motivi di doglianza, non preventivamente mediati, risultano preclusi.",
    principio:
      "La condizione di procedibilita' della mediazione richiede una specifica corrispondenza contenutistica tra fase stragiudiziale e fase giudiziale (principio di simmetria).",
    citazioneFormale: "Trib. Milano, sent. n. 390/2026",
    riferimenti: ["Art. 4 D.Lgs. 28/2010", "Art. 5 D.Lgs. 28/2010"],
    tag: [
      "simmetria",
      "istanza di mediazione",
      "domanda giudiziale",
      "improcedibilita'",
      "delibere condominiali",
    ],
    fonteUrl:
      "https://www.mondoadr.it/giurisprudenza_art/domanda-mediazione-e-giudiziale-la-mancata-simmetria-comporta-limprocedibilita/",
  },
];

// ─── HELPER PER PROMPT AI ────────────────────────────────────────────────

/**
 * Restituisce le pronunce filtrate per tema, ordinate per data decrescente.
 */
export function getPronunceByTema(tema: TemaPronuncia): PronunciaAI[] {
  return PRONUNCE_LEGITTIMITA_MEDIAZIONE.filter((p) => p.tema === tema).sort(
    (a, b) => b.data.localeCompare(a.data),
  );
}

/**
 * Restituisce una pronuncia per id univoco.
 */
export function getPronunciaById(id: string): PronunciaAI | undefined {
  return PRONUNCE_LEGITTIMITA_MEDIAZIONE.find((p) => p.id === id);
}

/**
 * Cerca pronunce per tag (case-insensitive, full match parziale).
 */
export function searchPronunceByTag(query: string): PronunciaAI[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRONUNCE_LEGITTIMITA_MEDIAZIONE.filter((p) =>
    p.tag.some((t) => t.toLowerCase().includes(q)),
  );
}

/**
 * Genera un blocco testuale pronto da iniettare nei prompt AI,
 * con le pronunce piu' rilevanti per il tema dato.
 * Limita a `max` pronunce e formato bullet con citazione + principio.
 */
export function buildContestoGiurisprudenziale(
  tema: TemaPronuncia,
  max = 3,
): string {
  const pronunce = getPronunceByTema(tema).slice(0, max);
  if (pronunce.length === 0) return "";

  const lines = pronunce.map(
    (p) =>
      `- ${p.citazioneFormale}: ${p.principio}`,
  );

  return `\nGIURISPRUDENZA DI RIFERIMENTO (${tema}):\n${lines.join("\n")}\n`;
}

/**
 * Restituisce SEMPRE le 2 pronunce cardine sulla procura sostanziale
 * (Cass. 9608/2026 e Cass. 10978/2026), utili per il generatore procura
 * e per i motori che analizzano la procedibilita'.
 */
export function getPronunceCardineProcura(): {
  cass9608: PronunciaAI;
  cass10978: PronunciaAI;
} {
  const cass9608 = getPronunciaById("cass-9608-2026")!;
  const cass10978 = getPronunciaById("cass-10978-2026")!;
  return { cass9608, cass10978 };
}
