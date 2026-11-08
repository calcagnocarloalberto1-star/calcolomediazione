// Controllo automatico sull'output delle fasi che trattano di persone (art. 6, par. 3,
// ultimo comma, AI Act: nessuna profilazione di persone fisiche). I prompt riducono il
// rischio ma non lo azzerano: questa guardia rilegge la risposta, riscrive in forma
// impersonale le frasi che attribuiscono a una parte un atteggiamento, una percezione o
// una tendenza; se la riscrittura non basta riprova una seconda volta e, in ultima istanza,
// trasforma la frase in una domanda aperta per il mediatore (nelle tabelle solo la cella
// interessata, così la struttura resta intatta). Non compare più nessun segnaposto di
// omissione nel testo (8 novembre 2026). Nei log finiscono solo
// i conteggi, mai il testo (riservatezza dei fascicoli).
import { callLLM } from "./llm.js";

const SOGGETTI_FISSI = ["E\\.M\\.", "P\\.G\\. S\\.r\\.l\\.", "A\\.B\\. S\\.p\\.A\\.", "C\\.D\\. S\\.r\\.l\\.", "F\\.G\\.", "H\\.L\\.", "A\\.B\\.", "C\\.D\\.", "l'istante", "il chiamato", "la parte", "una parte", "le parti", "entrambe le parti", "entrambi", "ciascuna parte", "una delle parti", "uno dei due", "l'altra parte", "chi abita", "chi occupa", "chi vive", "chi detiene", "il debitore", "il creditore", "il fornitore", "il cliente", "il conduttore", "il locatore", "il coerede", "il fratello", "la sorella"];
const VERBI_COMPLETI = "(?:tende a|tendono a|potrebbe rifiutare|potrebbero rifiutare|rifiuta e|rifiuterebbe|accetterebbe|percepisce|percepiscono|ritiene|ritengono|crede|credono|sente|sentono|si sente|potrebbe sentirsi|potrebbero sentirsi|preferisce|preferiscono|preferirebbe|potrebbe preferire|potrebbero preferire|vuole|vogliono|teme|temono|spera|sperando|desidera|sopravvaluta|sovrastima|sovrastimano|sottostima|sottostimano|potrebbe sovrastimare|potrebbero sovrastimare|potrebbe sottostimare|potrebbero sottostimare|è overconfident|considera|considerano|potrebbe considerare|potrebbero considerare|porterebbe (?:l'istante|il chiamato|la parte|ciascuna parte|entrambe le parti) a|trovano|ricorda|ricordano|ignora|ignorano|ignorando|si aspetta|si aspettano|pensa|pensano|reagisce|reagiscono|sa valutare|è convint[oaie]|ha una tendenza|è incline|sarà più incline|è più incline|è sovrastimatore|non è affidabile|è affidabile|è in malafede|mente|è insolvente)(?![\\p{L}])";
const VERBI_RADICE = "(?:è convint|è aggressiv|è emotiv|è (?:molto |più |poco |del tutto )?(?:sicur|ottimist|pessimist|fiducios))";
const VERBI = `(?:${VERBI_COMPLETI}|${VERBI_RADICE})`;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Soggetti da riconoscere oltre a quelli generici: nomi (e cognomi) delle parti del caso.
function soggettiDaNomi(nomiParti: string[]): string[] {
  const out: string[] = [];
  for (const nome of nomiParti) {
    const n = nome.trim();
    if (n.length < 2) continue;
    out.push(escapeRe(n));
    for (const tok of n.split(/\s+/)) {
      if (tok.length >= 3 && !/^(s\.?\s?r\.?\s?l|s\.?\s?p\.?\s?a|s\.?n\.?c|s\.?a\.?s)\.?$/i.test(tok)) out.push(escapeRe(tok));
    }
  }
  return out;
}

export function costruisciViolazioni(nomiParti: string[] = []): RegExp[] {
  const soggetti = [...SOGGETTI_FISSI, ...soggettiDaNomi(nomiParti)].join("|");
  return [
    new RegExp(`(?<![\\p{L}\\d'’])(?:${soggetti})[^.\\n|]{0,80}(?<![\\p{L}])${VERBI}`, "iu"),
    /\b(è|appare|sembra) (un|una) (persona|soggetto) (\w+ ){0,3}(testard|ostinat|aggressiv|inaffidabil|emotiv|ansios)/i,
    /\b(?:pessimista|ottimista) per\b/i,
    // «Probabilità di accettazione dell'istante (stima ipotesi): 40%»: stima di un comportamento futuro di una parte
    /\bprobabilit[àa] di (?:accettazione|rifiuto|accettare|rifiutare)\b[^.\n|]{0,40}\b(?:dell'istante|del chiamato|della parte|delle parti|di ciascuna parte|di E\.M\.|di P\.G\.|di A\.B\.|di C\.D\.|di F\.G\.|di H\.L\.)/iu,
    /\b(?:porterebbe|porterebbero|indurrebbe|spingerebbe|porta|induce|spinge)\s+(?:l'istante|il chiamato|la parte|ciascuna parte|entrambe le parti|una delle parti|E\.M\.|P\.G\.|A\.B\.|C\.D\.|F\.G\.|H\.L\.)\s+a\b/i,
  ];
}
export const VIOLAZIONI: RegExp[] = costruisciViolazioni();

const DOMANDA_APERTA = "Da verificare con il mediatore, con una domanda aperta: quali elementi sostengono questo punto?";
const CELLA_DA_VERIFICARE = "Da verificare con una domanda aperta";

// Ultima istanza: la frase che non si riesce a riscrivere diventa una domanda aperta.
// In una tabella si sostituiscono solo le celle che violano, mantenendo righe e colonne.
function neutralizzaRiga(riga: string, viola: (r: string) => boolean): string {
  if (/^\s*\|/.test(riga)) {
    const celle = riga.split("|");
    const interne = celle.slice(1, celle.length - (riga.trimEnd().endsWith("|") ? 1 : 0));
    let toccate = 0;
    const nuove = interne.map(c => { if (c.trim() && viola(c)) { toccate++; return ` ${CELLA_DA_VERIFICARE} `; } return c; });
    if (toccate === 0) nuove.forEach((_, k) => { if (k > 0 && nuove[k].trim()) nuove[k] = ` ${CELLA_DA_VERIFICARE} `; });
    return "|" + nuove.join("|") + (riga.trimEnd().endsWith("|") ? "|" : "");
  }
  return `${prefisso(riga)}${DOMANDA_APERTA}`;
}

export function rigaViolante(riga: string, nomiParti: string[] = []): boolean {
  const t = riga.trim();
  if (!t || /\?\s*$/.test(t)) return false; // una domanda al professionista non è un giudizio
  return (nomiParti.length ? costruisciViolazioni(nomiParti) : VIOLAZIONI).some(r => r.test(riga));
}

type Riscrittore = (righe: string[]) => Promise<string[]>;

async function riscriviConLLM(righe: string[]): Promise<string[]> {
  const elenco = righe.map((r, i) => `${i + 1}|${r}`).join("\n");
  const out = await callLLM(
    `Riscrivi frasi di un'analisi di mediazione. Regola: nessuna frase deve avere come soggetto una parte, una sigla o un ruolo (l'istante, il chiamato, la parte, E.M., F.G. ecc.) di verbi di percezione, valutazione, tendenza o scelta (percepisce, ritiene, sovrastima, sottostima, tende a, rifiuta, accetta, è convinto), neppure in forma ipotetica. Riscrivi ogni frase con soggetto impersonale (la proposta, la cifra, la dinamica, la situazione) oppure come domanda aperta che il mediatore può porre. Le percentuali o stime riferite a una parte («l'istante crede 70%») diventano scenari numerici senza soggetto («scenario con probabilità del 70%») o domande («su quali elementi si fonda la stima di ciascun lato?»); «pessimista/ottimista per X» diventa «scenario con probabilità più bassa/più alta». Mantieni lo stesso significato pratico, gli stessi numeri e la stessa formattazione Markdown (trattini, grassetti, barre di tabella). Rispondi SOLO con le frasi riscritte, una per riga, nel formato «numero|frase», senza altro testo.`,
    elenco,
  );
  const mappa = new Map<number, string>();
  for (const l of out.split("\n")) {
    const m = l.match(/^\s*(\d+)\|(.*)$/);
    if (m) mappa.set(Number(m[1]), m[2]);
  }
  return righe.map((r, i) => mappa.get(i + 1) ?? r);
}

type Individuatore = (righe: string[]) => Promise<number[]>;

const RIGHE_PER_BLOCCO = 250;

// Secondo controllo, di significato e non di parole: un secondo passaggio del modello legge
// il testo numerato e indica le righe che attribuiscono a una persona (anche in modo
// indiretto o ipotetico) convinzioni, sentimenti, preferenze, stime, tendenze o
// comportamenti futuri, o che inventano fatti non presenti nel caso. Le righe indicate
// passano poi dalla stessa riscrittura del primo controllo.
export async function individuaConLLM(righe: string[]): Promise<number[]> {
  const trovate: number[] = [];
  const blocchi: Array<[number, number]> = [];
  for (let i = 0; i < righe.length; i += RIGHE_PER_BLOCCO) blocchi.push([i, Math.min(i + RIGHE_PER_BLOCCO, righe.length)]);
  await Promise.all(blocchi.map(async ([da, a]) => {
    const testo = righe.slice(da, a).map((r, k) => (r.trim() ? `${da + k + 1}|${r}` : "")).filter(Boolean).join("\n");
    if (!testo) return;
    const out = await callLLM(
      `Sei un revisore di conformità. Ricevi righe numerate («numero|testo») di un'analisi di mediazione. Indica i numeri delle righe che violano questa regola: l'analisi non deve profilare persone. Violano la regola le righe che attribuiscono a una parte, a una persona o a un ruolo (l'istante, il chiamato, una sigla o un nome, «una delle parti», «chi abita l'immobile», «il fratello», «la parte»…), anche in modo indiretto, ipotetico o con «può/potrebbe/possono»: convinzioni, percezioni, sentimenti, paure, preferenze, intenzioni, tendenze, bias, stime di probabilità o percentuali, comportamenti futuri («sarà più riluttante», «accetterebbe»); oppure che inventano fatti non presenti nel caso (precedenti, amici, esperienze di una parte). NON violano la regola: domande aperte rivolte al mediatore o alle parti; dinamiche descritte in modo impersonale («una proposta formulata come perdita può essere rifiutata»); calcoli e tabelle di scenario senza soggetto; descrizioni di fatti e cifre forniti nel caso; formulazioni di interessi come ipotesi da verificare. Rispondi SOLO con i numeri delle righe che violano, separati da virgole, oppure con la parola NESSUNA.`,
      testo,
    );
    const pulito = out.trim();
    if (process.env.PROVA_DEBUG === "1") console.warn(`[guardia-revisore] blocco ${da + 1}-${a}: risposta «${pulito.slice(0, 200).replace(/\s+/g, " ")}»`);
    if (/^NESSUNA\.?$/i.test(pulito)) return;
    // Risposta valida solo se è un semplice elenco di numeri: ogni altra cosa si scarta.
    if (!/^\d+(\s*,\s*\d+)*\.?$/.test(pulito)) { console.warn(`[guardia-revisore] risposta non valida, blocco ${da + 1}-${a} ignorato`); return; }
    const nums = pulito.match(/\d+/g)!.map(m => Number(m) - 1).filter(n => n >= da && n < a);
    // Se segnala più di un quinto delle righe non è affidabile: scartata.
    if (nums.length > Math.max(5, (a - da) * 0.2)) { console.warn(`[guardia-revisore] troppe righe segnalate (${nums.length}), blocco ${da + 1}-${a} ignorato`); return; }
    trovate.push(...nums);
  }));
  return Array.from(new Set(trovate)).sort((x, y) => x - y);
}

function prefisso(riga: string): string {
  const m = riga.match(/^(\s*(?:[-*]\s+|\d+\.\s+)?)/);
  return m ? m[1] : "";
}

export async function applicaGuardiaNoProfilazione(
  testo: string,
  riscrivi: Riscrittore = riscriviConLLM,
  nomiParti: string[] = [],
  individua: Individuatore | null | undefined = undefined,
): Promise<string> {
  // Il controllo di significato resta SPENTO finché non è stato collaudato su risposte reali:
  // si attiva solo con GUARDIA_REVISORE_LLM=1 (prova 21/10/2026: segnalava quasi ogni riga).
  if (individua === undefined) individua = process.env.GUARDIA_REVISORE_LLM === "1" ? individuaConLLM : null;
  const righe = testo.split("\n");
  const regole = costruisciViolazioni(nomiParti);
  const viola = (r: string) => { const t = r.trim(); return !!t && !/\?\s*$/.test(t) && regole.some(x => x.test(r)); };
  const perParole = righe.map((r, i) => (viola(r) ? i : -1)).filter(i => i >= 0);
  let perSignificato: number[] = [];
  if (individua) {
    try {
      perSignificato = (await individua(righe)).filter(i => i >= 0 && i < righe.length && righe[i].trim() !== "" && !/^\s*#/.test(righe[i]));
    } catch {
      perSignificato = []; // il controllo di significato è un'aggiunta: se fallisce resta quello per parole
    }
  }
  const idx = Array.from(new Set([...perParole, ...perSignificato])).sort((a, b) => a - b);
  if (idx.length === 0) return testo;

  const accettabile = (originale: string, candidata: string | undefined) =>
    candidata !== undefined && candidata !== originale && !viola(candidata) && (!/\|/.test(originale) === !/\|/.test(candidata));
  const chiedi = async (indici: number[]): Promise<string[]> => {
    try { return await riscrivi(indici.map(i => righe[i])); } catch { return indici.map(i => righe[i]); }
  };
  let riscritte = 0;
  let neutralizzate = 0;
  let daFare = idx;
  // Fino a due tentativi di riscrittura; ciò che resta viene neutralizzato, mai omesso.
  for (let tentativo = 0; tentativo < 2 && daFare.length > 0; tentativo++) {
    const nuove = await chiedi(daFare);
    const restano: number[] = [];
    daFare.forEach((i, k) => {
      if (accettabile(righe[i], nuove[k])) { righe[i] = nuove[k]; riscritte++; } else restano.push(i);
    });
    daFare = restano;
  }
  for (const i of daFare) { righe[i] = neutralizzaRiga(righe[i], viola); neutralizzate++; }
  console.warn(`[guardia-no-profilazione] frasi riscritte=${riscritte} neutralizzate=${neutralizzate} (per parole=${perParole.length}, per significato=${perSignificato.filter(i => !perParole.includes(i)).length})`);
  return righe.join("\n");
}
