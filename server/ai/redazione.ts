// PRIV-08 — Redazione preventiva dei dati identificativi prima dell'invio
// al fornitore AI esterno (Anthropic/Gemini).
//
// Perche' esiste: fino ad ora l'unica "anonimizzazione" disponibile
// (vedi route GET /api/analisi/:id/pdf?anonimizza=1) agiva SOLO sul PDF
// scaricato, cioe' dopo che descrizione/parti erano gia' stati inviati per
// intero al modello e salvati lato server. Anonimizzava l'output mostrato
// all'utente, non l'input mandato all'esterno: non riduceva in alcun modo
// l'esposizione verso il fornitore AI.
//
// Questo modulo sposta la stessa logica di sostituzione PRIMA della
// chiamata AI: la pipeline (runPipeline in server/routes.ts) invia al
// modello descrizione/parti/documentiText gia' redatti (nomi delle parti
// e alcuni identificatori diretti sostituiti con token), e ripristina i
// valori reali solo sui risultati destinati al salvataggio/alla lettura da
// parte dell'utente — mai su quanto viene rimandato in input alle chiamate
// AI successive della stessa pipeline, che devono continuare a vedere solo
// i token.
//
// Limiti noti (da avvertenza, non silenziati):
// - Resta una PSEUDONIMIZZAZIONE best-effort, non un'anonimizzazione in
//   senso GDPR: dettagli indiretti nel testo libero (indirizzi, importi,
//   circostanze uniche del caso) possono comunque rendere la parte
//   identificabile da chi conosce gia' il contesto (controparte, mediatore,
//   organismo). Non sostituisce ne' la valutazione sulla base giuridica del
//   trattamento ne' la verifica umana sostanziale degli output AI.
// - Il riconoscimento di email/codice fiscale/IBAN/telefono e' basato su
//   pattern (regex), quindi best-effort: puo' non intercettare varianti non
//   standard. Deliberatamente NON tenta di redigere sequenze numeriche
//   generiche (es. partita IVA a 11 cifre) per non rischiare di corrompere
//   importi e altri dati numerici rilevanti per l'analisi del caso.
// - Presuppone che il modello riporti i token invariati nell'output (prassi
//   osservata con stringhe delimitate da parentesi quadre come [PARTE_A]);
//   se un token viene riformulato dal modello, il ripristino su quel punto
//   specifico puo' non avvenire e va considerato un limite noto, non un
//   comportamento garantito al 100%.

export interface ParteAnalisi {
  nome: string;
  ruolo: string;
}

export interface RisultatoRedazione {
  descrizioneRedatta: string;
  documentiTextRedatto: string;
  partiRedatte: ParteAnalisi[];
  // Mappa token -> valore originale, da usare SOLO con ripristinaTesto() sui
  // risultati destinati al salvataggio/alla visualizzazione, mai per
  // ricostruire input da rimandare al modello.
  mappa: Record<string, string>;
}

const ETICHETTE_PARTI = [
  "PARTE_A", "PARTE_B", "PARTE_C", "PARTE_D", "PARTE_E", "PARTE_F",
  "PARTE_G", "PARTE_H", "PARTE_I", "PARTE_J",
];

function escapeRegExp(valore: string): string {
  return valore.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Sostituisce le occorrenze di un pattern con token progressivi dello stesso
// prefisso, riusando lo stesso token per valori identici gia' incontrati
// (cosi' due citazioni della stessa email/CF nel testo diventano lo stesso
// token invece di due token distinti).
function tokenizzaPattern(
  testo: string,
  pattern: RegExp,
  prefisso: string,
  mappa: Record<string, string>,
  contatore: { n: number }
): string {
  return testo.replace(pattern, (match) => {
    const esistente = Object.entries(mappa).find(([, valore]) => valore === match);
    if (esistente) return esistente[0];
    contatore.n += 1;
    const token = `[${prefisso}_${contatore.n}]`;
    mappa[token] = match;
    return token;
  });
}

// Pattern per identificatori diretti nel testo libero, oltre ai nomi delle
// parti (gestiti separatamente perche' arrivano gia' come campo strutturato).
const RE_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const RE_CODICE_FISCALE = /\b[A-Za-z]{6}\d{2}[A-Za-z]\d{2}[A-Za-z]\d{3}[A-Za-z]\b/g;
const RE_IBAN = /\bIT\d{2}[A-Za-z]\d{10}\d{12}\b/gi;
const RE_TELEFONO = /\b(?:\+39\s?)?3\d{2}[\s.-]?\d{6,7}\b/g;

function sostituisciNomeParte(testo: string, nomeCompleto: string, token: string): string {
  if (!nomeCompleto.trim()) return testo;
  let risultato = testo.replace(new RegExp(escapeRegExp(nomeCompleto.trim()), "gi"), token);
  const parti = nomeCompleto.trim().split(/\s+/);
  if (parti.length > 1) {
    const cognome = parti[parti.length - 1];
    if (cognome.length >= 3) {
      risultato = risultato.replace(new RegExp(`\\b${escapeRegExp(cognome)}\\b`, "gi"), token);
    }
  }
  return risultato;
}

// Redige descrizione, documentiText e i nomi delle parti PRIMA di costruire
// i prompt per il modello AI. Da chiamare una sola volta all'inizio della
// pipeline (runPipeline): il risultato va propagato a tutte le chiamate AI
// della stessa pipeline, mentre mappa va usata solo con ripristinaTesto()
// sui campi salvati/mostrati all'utente.
export function redigiDati(
  descrizione: string,
  parti: ParteAnalisi[],
  documentiText: string
): RisultatoRedazione {
  const mappa: Record<string, string> = {};

  let descrizioneRedatta = descrizione || "";
  let documentiTextRedatto = documentiText || "";

  // Ordine importante: i pattern strutturati (email, CF, IBAN, telefono) vanno
  // tokenizzati PRIMA della sostituzione dei nomi/cognomi delle parti. Un
  // cognome puo' comparire come sotto-stringa dentro un'email (es. "rossi" in
  // "mario.rossi@example.com" soddisfa comunque i confini di parola tra "." e
  // "@"): sostituendolo per primo si spezzerebbe il pattern dell'email prima
  // che RE_EMAIL abbia la possibilita' di riconoscerla per intero.
  const contatore = { n: 0 };
  for (const [pattern, prefisso] of [
    [RE_EMAIL, "EMAIL"],
    [RE_CODICE_FISCALE, "CF"],
    [RE_IBAN, "IBAN"],
    [RE_TELEFONO, "TEL"],
  ] as [RegExp, string][]) {
    descrizioneRedatta = tokenizzaPattern(descrizioneRedatta, pattern, prefisso, mappa, contatore);
    documentiTextRedatto = tokenizzaPattern(documentiTextRedatto, pattern, prefisso, mappa, contatore);
  }

  const partiRedatte: ParteAnalisi[] = parti.map((parte, indice) => {
    const etichetta = ETICHETTE_PARTI[indice] || `PARTE_${indice + 1}`;
    const token = `[${etichetta}]`;
    if (parte.nome && parte.nome.trim()) {
      mappa[token] = parte.nome.trim();
      descrizioneRedatta = sostituisciNomeParte(descrizioneRedatta, parte.nome, token);
      documentiTextRedatto = sostituisciNomeParte(documentiTextRedatto, parte.nome, token);
    }
    return { ...parte, nome: etichetta };
  });

  return { descrizioneRedatta, documentiTextRedatto, partiRedatte, mappa };
}

// Ripristina nel testo i valori originali al posto dei token, da applicare
// SOLO ai risultati che vanno salvati/mostrati all'utente — mai a quanto
// viene passato in input a ulteriori chiamate AI della stessa pipeline.
export function ripristinaTesto(testo: string | null | undefined, mappa: Record<string, string>): string {
  if (!testo) return testo || "";
  let risultato = testo;
  for (const [token, valoreOriginale] of Object.entries(mappa)) {
    risultato = risultato.split(token).join(valoreOriginale);
    // Fallback: alcuni modelli possono riportare il token senza le parentesi
    // quadre (es. "PARTE_A" invece di "[PARTE_A]").
    const senzaParentesi = token.slice(1, -1);
    risultato = risultato.replace(new RegExp(`\\b${escapeRegExp(senzaParentesi)}\\b`, "g"), valoreOriginale);
  }
  return risultato;
}
