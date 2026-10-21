// Per la fase «bias cognitivi» le parti non vengono identificate: né nomi né ruoli arrivano al
// modello. Non potendo sapere a chi appartiene un fatto, il modello non può attribuire bias,
// percezioni o tendenze a una persona determinata (art. 6, par. 3, ultimo comma, AI Act) e si
// riducono anche i dati personali trattati (art. 5, par. 1, lett. c, GDPR).
const FORME_SOCIETARIE = /^(s\.?\s?r\.?\s?l|s\.?\s?p\.?\s?a|s\.?\s?n\.?\s?c|s\.?\s?a\.?\s?s|sig|sig\.ra|dott|avv|ing|prof)\.?$/i;

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const RUOLI: Array<[RegExp, string]> = [
  [/\b(?:gli|i)\s+(?:istanti|chiamati)\b/gi, "le parti"],
  [/\bparte\s+(?:istante|chiamata)\b/gi, "una parte"],
  [/\ball['’]\s?(?:istante)\b/gi, "a una parte"],
  [/\bdell['’]\s?(?:istante)\b/gi, "di una parte"],
  [/\bdall['’]\s?(?:istante)\b/gi, "da una parte"],
  [/\bnell['’]\s?(?:istante)\b/gi, "in una parte"],
  [/\bsull['’]\s?(?:istante)\b/gi, "su una parte"],
  [/\bl['’]\s?(?:istante)\b/gi, "una parte"],
  [/\bal\s+chiamato\b/gi, "a una parte"],
  [/\bdel\s+chiamato\b/gi, "di una parte"],
  [/\bdal\s+chiamato\b/gi, "da una parte"],
  [/\bnel\s+chiamato\b/gi, "in una parte"],
  [/\bsul\s+chiamato\b/gi, "su una parte"],
  [/\bil\s+chiamato\b/gi, "una parte"],
  [/\b(?:istante|chiamato|chiamata)\b/gi, "parte"],
];

export function anonimizzaParti(testo: string, parti: Array<{ nome: string }>): string {
  const nomi = new Set<string>();
  for (const p of parti) {
    const n = (p.nome ?? "").trim();
    if (n.length < 2) continue;
    nomi.add(n);
    for (const tok of n.split(/\s+/)) if (tok.length >= 3 && !FORME_SOCIETARIE.test(tok)) nomi.add(tok);
  }
  let out = testo;
  for (const n of Array.from(nomi).sort((a, b) => b.length - a.length)) {
    out = out.replace(new RegExp(`(?<![\\p{L}\\d])${esc(n)}(?![\\p{L}\\d])`, "giu"), "una parte");
  }
  for (const [re, sost] of RUOLI) out = out.replace(re, sost);
  return out;
}
