// Controllo automatico sull'output delle fasi che trattano di persone (art. 6, par. 3,
// ultimo comma, AI Act: nessuna profilazione di persone fisiche). I prompt riducono il
// rischio ma non lo azzerano: questa guardia rilegge la risposta, riscrive in forma
// impersonale le frasi che attribuiscono a una parte un atteggiamento, una percezione o
// una tendenza e, se la riscrittura non basta, omette la frase. Nei log finiscono solo
// i conteggi, mai il testo (riservatezza dei fascicoli).
import { callLLM } from "./llm.js";

export const VIOLAZIONI: RegExp[] = [
  /\b(E\.M\.|P\.G\. S\.r\.l\.|A\.B\. S\.p\.A\.|C\.D\. S\.r\.l\.|F\.G\.|H\.L\.|l'istante|il chiamato|la parte)[^.\n|]{0,80}\b(tende a|tendono a|potrebbe rifiutare|potrebbero rifiutare|rifiuta e|percepisce|ritiene|è convint|sopravvaluta|è overconfident|ha una tendenza|è incline|sovrastima|sottostima|è sovrastimatore|non è affidabile|è affidabile|è in malafede|mente|è insolvente|è aggressiv|è emotiv)/i,
  /\b(è|appare|sembra) (un|una) (persona|soggetto) (\w+ ){0,3}(testard|ostinat|aggressiv|inaffidabil|emotiv|ansios)/i,
];

const OMISSIONE = "[frase omessa dal controllo automatico: attribuiva una valutazione a una persona; il mediatore può verificarla con una domanda aperta]";

export function rigaViolante(riga: string): boolean {
  const t = riga.trim();
  if (!t || /\?\s*$/.test(t)) return false; // una domanda al professionista non è un giudizio
  return VIOLAZIONI.some(r => r.test(riga));
}

type Riscrittore = (righe: string[]) => Promise<string[]>;

async function riscriviConLLM(righe: string[]): Promise<string[]> {
  const elenco = righe.map((r, i) => `${i + 1}|${r}`).join("\n");
  const out = await callLLM(
    `Riscrivi frasi di un'analisi di mediazione. Regola: nessuna frase deve avere come soggetto una parte, una sigla o un ruolo (l'istante, il chiamato, la parte, E.M., F.G. ecc.) di verbi di percezione, valutazione, tendenza o scelta (percepisce, ritiene, sovrastima, sottostima, tende a, rifiuta, accetta, è convinto), neppure in forma ipotetica. Riscrivi ogni frase con soggetto impersonale (la proposta, la cifra, la dinamica, la situazione) oppure come domanda aperta che il mediatore può porre. Mantieni lo stesso significato pratico, gli stessi numeri e la stessa formattazione Markdown (trattini, grassetti, barre di tabella). Rispondi SOLO con le frasi riscritte, una per riga, nel formato «numero|frase», senza altro testo.`,
    elenco,
  );
  const mappa = new Map<number, string>();
  for (const l of out.split("\n")) {
    const m = l.match(/^\s*(\d+)\|(.*)$/);
    if (m) mappa.set(Number(m[1]), m[2]);
  }
  return righe.map((r, i) => mappa.get(i + 1) ?? r);
}

function prefisso(riga: string): string {
  const m = riga.match(/^(\s*(?:[-*]\s+|\d+\.\s+)?)/);
  return m ? m[1] : "";
}

export async function applicaGuardiaNoProfilazione(
  testo: string,
  riscrivi: Riscrittore = riscriviConLLM,
): Promise<string> {
  const righe = testo.split("\n");
  const idx = righe.map((r, i) => (rigaViolante(r) ? i : -1)).filter(i => i >= 0);
  if (idx.length === 0) return testo;

  let nuove: string[];
  try {
    nuove = await riscrivi(idx.map(i => righe[i]));
  } catch {
    nuove = idx.map(i => righe[i]); // la riscrittura è fallita: si passa all'omissione
  }
  let riscritte = 0;
  let omesse = 0;
  idx.forEach((i, k) => {
    const candidata = nuove[k] ?? righe[i];
    if (candidata !== righe[i] && !rigaViolante(candidata) && !/\|/.test(righe[i]) === !/\|/.test(candidata)) {
      righe[i] = candidata;
      riscritte++;
    } else {
      righe[i] = `${/^\s*\|/.test(righe[i]) ? "> " : prefisso(righe[i])}${OMISSIONE}`;
      omesse++;
    }
  });
  console.warn(`[guardia-no-profilazione] frasi riscritte=${riscritte} omesse=${omesse}`);
  return righe.join("\n");
}
