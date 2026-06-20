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
// Il moltiplicatore include già la rivalutazione del 5%
// quindi si usa il "coefficiente sintetico" = rendita non rivalutata × coefficiente complessivo

export type CategoriaCatastale =
  | "prima_casa"
  | "altri_fabbricati_ac"
  | "cat_b"
  | "cat_a10_d"
  | "cat_c1_e"
  | "terreno_agricolo";

export interface CoefficienteCatastale {
  label: string;
  descrizione: string;
  moltiplicatore: number;
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
  renditaCatastale: number;
  categoria: CategoriaCatastale;
  valoreDomanda: number;
}

export interface RisultatoVerificaCatastale {
  renditaCatastale: number;
  renditaRivalutata: number;
  moltiplicatore: number;
  valoreCatastale: number;
  valoreDomanda: number;
  differenza: number;
  percentualeScostamento: number;
  congruo: boolean;
  rischio: "nessuno" | "basso" | "medio" | "alto";
  messaggio: string;
  categoriaLabel: string;
}

export function verificaCongruita(input: InputVerificaCatastale): RisultatoVerificaCatastale {
  const coeff = COEFFICIENTI_CATASTALI[input.categoria];

  const renditaRivalutata = Math.round(input.renditaCatastale * 1.05 * 100) / 100;
  const valoreCatastale = Math.round(input.renditaCatastale * coeff.moltiplicatore * 100) / 100;

  const differenza = Math.round((input.valoreDomanda - valoreCatastale) * 100) / 100;
  const percentualeScostamento =
    valoreCatastale > 0
      ? Math.round((differenza / valoreCatastale) * 10000) / 100
      : 0;

  const congruo = input.valoreDomanda >= valoreCatastale;

  let rischio: "nessuno" | "basso" | "medio" | "alto";
  let messaggio: string;

  if (congruo) {
    rischio = "nessuno";
    messaggio = `Il valore della domanda (€ ${formatValuta(input.valoreDomanda)}) è superiore o pari al valore catastale (€ ${formatValuta(valoreCatastale)}). Il valore è congruo ai fini dell'Agenzia delle Entrate.`;
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

function formatValuta(n: number): string {
  return n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatValutaBreve(n: number): string {
  return n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
