/**
 * Verificatore di Congruità del Valore Catastale
 * Art. 29 D.M. 150/2023 — Determinazione del valore della lite e dell'accordo
 * 
 * Quando la mediazione riguarda materia da trascrivere (es. immobili),
 * le parti devono verificare che il valore della domanda o dell'accordo
 * sia congruo rispetto al valore catastale, per evitare accertamenti
 * da parte dell'Agenzia delle Entrate.
 */

// Categorie catastali con i rispettivi moltiplicatori
// Fonte: Agenzia delle Entrate — coefficienti vigenti
// Il moltiplicatore include già la rivalutazione del 5% (rendita × 1,05 × moltiplicatore base)
// ovvero si usa il "coefficiente sintetico" = rendita non rivalutata × coefficiente complessivo

export type CategoriaCatastale =
  | "prima_casa"           // Abitazione principale (qualsiasi cat. A escluso A/10)
  | "altri_fabbricati_ac"  // Cat. A (escluso A/10) e C (escluso C/1) — non prima casa
  | "cat_b"                // Cat. B (collegi, convitti, ospedali, ecc.)
  | "cat_a10_d"            // Cat. A/10 (uffici) e Gruppo D
  | "cat_c1_e"             // Cat. C/1 (negozi) e Gruppo E
  | "terreno_agricolo";    // Terreni non edificabili

export interface CoefficienteCatastale {
  label: string;
  descrizione: string;
  /** Moltiplicatore sintetico (include rivalutazione 5%) da applicare alla rendita catastale NON rivalutata */
  moltiplicatore: number;
  /** Tipo di reddito base */
  tipoReddito: "rendita" | "dominicale";
}

export const COEFFICIENTI_CATASTALI: Record<CategoriaCatastale, CoefficienteCatastale> = {
  prima_casa: {
    label: "Prima casa",
    descrizione: "Abitazione principale (cat. A escluso A/10) + pertinenze C/2, C/6, C/7",
    moltiplicatore: 115.5,
    tipoReddito: "rendita",
  },
  altri_fabbricati_ac: {
    label: "Altre abitazioni / Cat. A e C",
    descrizione: "Cat. A (escluso A/10) e C (escluso C/1) — seconda casa e altri",
    moltiplicatore: 126,
    tipoReddito: "rendita",
  },
  cat_b: {
    label: "Cat. B (collegi, convitti, ospedali)",
    descrizione: "Fabbricati del Gruppo B",
    moltiplicatore: 176.4,
    tipoReddito: "rendita",
  },
  cat_a10_d: {
    label: "Uffici (A/10) e Gruppo D",
    descrizione: "Fabbricati A/10 (uffici e studi) e Gruppo D (immobili speciali)",
    moltiplicatore: 63,
    tipoReddito: "rendita",
  },
  cat_c1_e: {
    label: "Negozi (C/1) e Gruppo E",
    descrizione: "Cat. C/1 (negozi e botteghe) e Gruppo E",
    moltiplicatore: 42.84,
    tipoReddito: "rendita",
  },
  terreno_agricolo: {
    label: "Terreno agricolo",
    descrizione: "Terreni non edificabili — usa il reddito dominicale",
    moltiplicatore: 112.5,
    tipoReddito: "dominicale",
  },
};

export interface InputVerificaCatastale {
  /** Rendita catastale NON rivalutata (o reddito dominicale per terreni) */
  renditaCatastale: number;
  /** Categoria catastale */
  categoria: CategoriaCatastale;
  /** Valore della domanda di mediazione o dell'accordo */
  valoreDomanda: number;
}

export interface RisultatoVerificaCatastale {
  /** Rendita catastale inserita */
  renditaCatastale: number;
  /** Rendita rivalutata del 5% */
  renditaRivalutata: number;
  /** Moltiplicatore applicato */
  moltiplicatore: number;
  /** Valore catastale calcolato (soglia minima di congruità) */
  valoreCatastale: number;
  /** Valore della domanda/accordo */
  valoreDomanda: number;
  /** Differenza (valoreDomanda - valoreCatastale) */
  differenza: number;
  /** Percentuale di scostamento rispetto al valore catastale */
  percentualeScostamento: number;
  /** Il valore è congruo? (domanda >= catastale) */
  congruo: boolean;
  /** Livello di rischio accertamento */
  rischio: "nessuno" | "basso" | "medio" | "alto";
  /** Messaggio descrittivo */
  messaggio: string;
  /** Categoria utilizzata */
  categoriaLabel: string;
}

/**
 * Calcola il valore catastale e verifica la congruità rispetto al valore della domanda/accordo.
 * 
 * Formula: Valore catastale = Rendita catastale × 1,05 × Moltiplicatore base
 * oppure equivalentemente: Rendita catastale × Moltiplicatore sintetico
 */
export function verificaCongruita(input: InputVerificaCatastale): RisultatoVerificaCatastale {
  const coeff = COEFFICIENTI_CATASTALI[input.categoria];

  const renditaRivalutata = input.renditaCatastale * 1.05;
  // Il moltiplicatore sintetico include già la rivalutazione:
  // moltiplicatore_sintetico = moltiplicatore_base × 1,05
  // Quindi: valoreCatastale = rendita × moltiplicatore_sintetico
  const valoreCatastale = Math.round(input.renditaCatastale * coeff.moltiplicatore * 100) / 100;

  const differenza = input.valoreDomanda - valoreCatastale;
  const percentualeScostamento = valoreCatastale > 0
    ? Math.round((differenza / valoreCatastale) * 10000) / 100
    : 0;

  const congruo = input.valoreDomanda >= valoreCatastale;

  // Determina il livello di rischio
  let rischio: "nessuno" | "basso" | "medio" | "alto";
  let messaggio: string;

  if (congruo) {
    rischio = "nessuno";
    messaggio = `Il valore della domanda (€ ${formatValuta(input.valoreDomanda)}) è superiore al valore catastale (€ ${formatValuta(valoreCatastale)}). Il valore è congruo ai fini dell'Agenzia delle Entrate.`;
  } else {
    const scostamentoAbs = Math.abs(percentualeScostamento);
    if (scostamentoAbs <= 10) {
      rischio = "basso";
      messaggio = `Il valore della domanda è inferiore al valore catastale del ${scostamentoAbs.toFixed(1)}%. Lo scostamento è contenuto ma potrebbe comunque attirare l'attenzione dell'Agenzia delle Entrate.`;
    } else if (scostamentoAbs <= 30) {
      rischio = "medio";
      messaggio = `Il valore della domanda è inferiore al valore catastale del ${scostamentoAbs.toFixed(1)}%. Lo scostamento è significativo e potrebbe generare un accertamento di valore da parte dell'Agenzia delle Entrate (artt. 51-52 DPR 131/1986).`;
    } else {
      rischio = "alto";
      messaggio = `Il valore della domanda è inferiore al valore catastale del ${scostamentoAbs.toFixed(1)}%. Lo scostamento è molto rilevante e rende altamente probabile un accertamento fiscale. Si consiglia di adeguare il valore della domanda almeno al valore catastale.`;
    }
  }

  return {
    renditaCatastale: input.renditaCatastale,
    renditaRivalutata,
    moltiplicatore: coeff.moltiplicatore,
    valoreCatastale,
    valoreDomanda: input.valoreDomanda,
    differenza,
    percentualeScostamento,
    congruo,
    rischio,
    messaggio,
    categoriaLabel: coeff.label,
  };
}

/** Formattazione valuta italiana */
function formatValuta(n: number): string {
  return n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Formattazione breve per embedding in testi */
export function formatValutaBreve(n: number): string {
  return n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
