/**
 * notarile.ts — Motore di calcolo costi notarili e fiscali
 * CalcoloMediazione.it — modulo unico per Calcolatore Indennità + Analisi AI
 * Aggiornato: 2026-06
 *
 * FONTI:
 *  - Onorari notaio: liberalizzati dal DL 1/2012 -> valori SOLO ORIENTATIVI (parametri DM 140/2012)
 *  - Imposte: DPR 131/1986 (Registro), D.Lgs 347/1990 (ipo-catastali)
 *  - Prezzo-valore: L. 296/2006 art. 1 c. 497
 *  - Esenzione accordo di mediazione: art. 17 D.Lgs 28/2010
 *
 * ATTENZIONE: gli onorari sono stime di mercato, NON tariffe legali.
 * Le imposte sono dovute per legge.
 */

export type TipologiaCatastale =
  | "prima_casa"
  | "seconda_casa"
  | "terreni_non_edificabili"
  | "fabbricati_C_A10"
  | "fabbricati_D_E";

export type RegimeFiscale = "prima_casa" | "seconda_casa";

export type ScenarioNotarile = "con_mediazione" | "con_sentenza";

export interface NotarileInput {
  rendita_catastale?: number | null;
  tipologia?: TipologiaCatastale;
  prezzo?: number | null;
  prezzo_valore?: boolean;
  regime?: RegimeFiscale;
  venditoreImpresaIva?: boolean;
}

export interface VociCosti {
  imposta_registro?: number;
  imposta_bollo?: number;
  imposta_ipotecaria?: number;
  imposta_catastale?: number;
  iva?: number;
  onorario_notaio?: number;
  iva_onorario?: number;
  cassa_notarile?: number;
  visure_volture?: number;
}

export interface DettaglioScenario {
  scenario: ScenarioNotarile;
  base: number;
  voci: VociCosti;
  note: string[];
  totale: number;
}

export interface ConfrontoNotarile {
  base: number;
  con_mediazione: DettaglioScenario;
  con_sentenza: DettaglioScenario;
  risparmio: number;
  disclaimer: string;
}

export const NOTARILE_CONFIG = {
  versione: "2026-06",

  // Coefficienti per il valore catastale (rendita rivalutata 5% × coefficiente)
  coefficienti: {
    prima_casa: 115.5,
    seconda_casa: 126,
    terreni_non_edificabili: 112.5,
    fabbricati_C_A10: 63,
    fabbricati_D_E: 65.52,
  } as Record<TipologiaCatastale, number>,

  // Imposte indirette su compravendita tra privati (atto soggetto a registro)
  imposte_privato: {
    prima_casa: { registro_perc: 2, registro_min: 1000, ipotecaria: 50, catastale: 50 },
    seconda_casa: { registro_perc: 9, registro_min: 1000, ipotecaria: 50, catastale: 50 },
  } as Record<RegimeFiscale, { registro_perc: number; registro_min: number; ipotecaria: number; catastale: number }>,

  // Acquisto da impresa con IVA
  imposte_impresa_iva: {
    prima_casa: { iva_perc: 4, registro: 200, ipotecaria: 200, catastale: 200 },
    seconda_casa: { iva_perc: 10, registro: 200, ipotecaria: 200, catastale: 200 },
    lusso: { iva_perc: 22, registro: 200, ipotecaria: 200, catastale: 200 },
  } as Record<string, { iva_perc: number; registro: number; ipotecaria: number; catastale: number }>,

  // Esenzione fiscale verbale di accordo di mediazione (art. 17 D.Lgs 28/2010)
  esenzione_mediazione: {
    registro_esente_fino_a: 100000,
    bollo_esente: true,
  },

  // Onorario notaio: STIMA orientativa per scaglioni di valore
  onorario_stima: {
    scaglioni: [
      { fino_a: 100000, compenso: 1500 },
      { fino_a: 200000, compenso: 2000 },
      { fino_a: 300000, compenso: 2500 },
      { fino_a: 500000, compenso: 3200 },
      { fino_a: Infinity, compenso: 4000 },
    ],
    iva_perc: 22,
    cassa_perc: 4,
    visure_volture: 300,
  },
};

/** Calcola la base imponibile (prezzo-valore se applicabile, altrimenti prezzo). */
export function calcolaBaseImponibile(input: NotarileInput): number {
  const { rendita_catastale, tipologia, prezzo, prezzo_valore } = input;
  if (prezzo_valore && rendita_catastale && rendita_catastale > 0) {
    const t: TipologiaCatastale = tipologia ?? "prima_casa";
    const coeff = NOTARILE_CONFIG.coefficienti[t] ?? 115.5;
    return Math.round(rendita_catastale * 1.05 * coeff);
  }
  return prezzo ?? 0;
}

/** Restituisce l'onorario stimato del notaio in base alla base imponibile. */
export function onorarioStimato(base: number): number {
  const sc = NOTARILE_CONFIG.onorario_stima.scaglioni.find((s) => base <= s.fino_a);
  return sc ? sc.compenso : 4000;
}

/**
 * Calcola i costi notarili e fiscali per uno scenario.
 */
export function calcolaCostiNotarili({
  base,
  regime = "prima_casa",
  venditoreImpresaIva = false,
  scenario = "con_mediazione",
}: {
  base: number;
  regime?: RegimeFiscale;
  venditoreImpresaIva?: boolean;
  scenario?: ScenarioNotarile;
}): DettaglioScenario {
  const cfg = NOTARILE_CONFIG;
  const out: DettaglioScenario = {
    scenario,
    base,
    voci: {},
    note: [],
    totale: 0,
  };

  // --- IMPOSTE ---
  if (venditoreImpresaIva) {
    const r = cfg.imposte_impresa_iva[regime] ?? cfg.imposte_impresa_iva.seconda_casa;
    out.voci.iva = Math.round((base * r.iva_perc) / 100);
    out.voci.imposta_registro = r.registro;
    out.voci.imposta_ipotecaria = r.ipotecaria;
    out.voci.imposta_catastale = r.catastale;
    out.note.push("Acquisto da impresa: IVA + imposte fisse.");
  } else {
    const r = cfg.imposte_privato[regime] ?? cfg.imposte_privato.seconda_casa;
    let registro = Math.max((base * r.registro_perc) / 100, r.registro_min);
    let bollo = 230; // forfettario atto

    // Esenzione art. 17 D.Lgs 28/2010 (solo accordo di mediazione)
    if (scenario === "con_mediazione") {
      const soglia = cfg.esenzione_mediazione.registro_esente_fino_a;
      if (base <= soglia) {
        registro = 0;
        out.note.push("Registro ESENTE (art. 17 D.Lgs 28/2010, entro 100.000 €).");
      } else {
        registro = ((base - soglia) * r.registro_perc) / 100;
        out.note.push(
          "Registro dovuto solo sull'eccedenza oltre 100.000 € (art. 17 D.Lgs 28/2010).",
        );
      }
      bollo = 0; // esente da bollo
    }

    out.voci.imposta_registro = Math.round(registro);
    out.voci.imposta_bollo = Math.round(bollo);
    out.voci.imposta_ipotecaria = r.ipotecaria;
    out.voci.imposta_catastale = r.catastale;
  }

  // --- ONORARIO NOTAIO (stima) ---
  if (scenario === "con_sentenza") {
    // La sentenza traslativa (art. 2932 c.c.) si trascrive senza atto notarile.
    out.voci.onorario_notaio = 0;
    out.note.push(
      "Sentenza ex art. 2932 c.c.: trascrizione diretta, nessun onorario notarile per il trasferimento.",
    );
  } else {
    const onorario = onorarioStimato(base);
    out.voci.onorario_notaio = onorario;
    out.voci.iva_onorario = Math.round((onorario * cfg.onorario_stima.iva_perc) / 100);
    out.voci.cassa_notarile = Math.round((onorario * cfg.onorario_stima.cassa_perc) / 100);
    out.voci.visure_volture = cfg.onorario_stima.visure_volture;
    out.note.push("Onorario NON tariffato (liberalizzato DL 1/2012): stima orientativa.");
  }

  // --- TOTALE ---
  out.totale = Object.values(out.voci).reduce<number>(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  return out;
}

/**
 * Confronto a due scenari: accordo in mediazione vs sentenza del giudice.
 * Usato dall'Analisi AI (sezione costi notarili) e dal Calcolatore Indennità.
 */
export function confrontaNotarile(input: NotarileInput): ConfrontoNotarile {
  const base = calcolaBaseImponibile(input);
  const regime: RegimeFiscale = input.regime ?? "prima_casa";
  const venditoreImpresaIva = input.venditoreImpresaIva ?? false;

  const conMediazione = calcolaCostiNotarili({
    base,
    regime,
    venditoreImpresaIva,
    scenario: "con_mediazione",
  });
  const conSentenza = calcolaCostiNotarili({
    base,
    regime,
    venditoreImpresaIva,
    scenario: "con_sentenza",
  });

  return {
    base,
    con_mediazione: conMediazione,
    con_sentenza: conSentenza,
    risparmio: conSentenza.totale - conMediazione.totale,
    disclaimer:
      "Onorari notarili liberalizzati (DL 1/2012): valori orientativi. " +
      "Imposte ex DPR 131/1986 e D.Lgs 347/1990. " +
      "Esenzione registro/bollo ex art. 17 D.Lgs 28/2010 nei limiti di legge. " +
      "Calcolo informativo, non sostituisce il preventivo del notaio.",
  };
}

function fmtEuro(n: number): string {
  return (
    "€ " +
    Number(n || 0).toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Render markdown del confronto notarile (usato nei prompt AI e nei report).
 */
export function renderNotarileMarkdown(input: NotarileInput): string {
  const r = confrontaNotarile(input);
  const m = r.con_mediazione.voci;
  const s = r.con_sentenza.voci;

  return `Base imponibile: ${fmtEuro(r.base)}

| Voce | Accordo in mediazione | Sentenza del giudice |
|---|---|---|
| Imposta di registro | ${fmtEuro(m.imposta_registro || 0)} | ${fmtEuro(s.imposta_registro || 0)} |
| Imposta di bollo | ${fmtEuro(m.imposta_bollo || 0)} | ${fmtEuro(s.imposta_bollo || 0)} |
| Imposta ipotecaria | ${fmtEuro(m.imposta_ipotecaria || 0)} | ${fmtEuro(s.imposta_ipotecaria || 0)} |
| Imposta catastale | ${fmtEuro(m.imposta_catastale || 0)} | ${fmtEuro(s.imposta_catastale || 0)} |
| Onorario notaio (stima) | ${fmtEuro(m.onorario_notaio || 0)} | ${fmtEuro(s.onorario_notaio || 0)} |
| IVA su onorario | ${fmtEuro(m.iva_onorario || 0)} | ${fmtEuro(s.iva_onorario || 0)} |
| Cassa notarile | ${fmtEuro(m.cassa_notarile || 0)} | ${fmtEuro(s.cassa_notarile || 0)} |
| Visure e volture | ${fmtEuro(m.visure_volture || 0)} | ${fmtEuro(s.visure_volture || 0)} |
| **Totale** | **${fmtEuro(r.con_mediazione.totale)}** | **${fmtEuro(r.con_sentenza.totale)}** |

Risparmio con accordo in mediazione: **${fmtEuro(r.risparmio)}**

Mediazione: ${r.con_mediazione.note.join(" ; ")}
Sentenza: ${r.con_sentenza.note.join(" ; ")}

> ${r.disclaimer}`;
}
