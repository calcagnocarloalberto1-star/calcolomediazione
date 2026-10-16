// PRIV-17 — Rilevamento prudenziale di possibili riferimenti a minori nel
// testo libero inviato ai flussi AI (descrizione del caso, documenti,
// messaggi di chat).
//
// Si tratta di un controllo euristico basato su parole chiave e pattern
// (età, date di nascita), pensato per intercettare un'eventuale
// dichiarazione "no" fornita per errore nel preflight (vedi
// docs/PRIV-17-presidi-rafforzati-minori-ai.md, sezione "Fase 2" e test di
// accettazione n.9). Come dichiarato esplicitamente nella specifica, questo
// rilevamento RIDUCE il rischio di classificazioni errate ma non prova in
// alcun modo l'assenza di dati di minori: non sostituisce la valutazione
// professionale dell'utente in fase di preflight.

const PAROLE_CHIAVE: RegExp[] = [
    /\bminorenn\w*/i,
    /\bminori?\b/i,
    /\bbambin[oaie]\b/i,
    /\bfigli[oa]\s+minor/i,
    /\basilo\s+nido\b/i,
    /\bscuola\s+(materna|elementare|media|dell'infanzia)\b/i,
    /\bneonat[oa]\b/i,
    /\badolescent\w*/i,
    /\bpatria\s+potest[aà]\b/i,
    /\bresponsabilit[aà]\s+genitoriale\b/i,
    /\btutore\s+del\s+minore\b/i,
    /\bcuratore\s+speciale\s+del\s+minore\b/i,
    /\baffidamento\s+(dei\s+)?figli/i,
    /\bmediazione\s+familiare\b/i,
    /\bseparazione\s+(?:dei\s+genitori|personale\s+dei\s+coniugi|dei\s+coniugi)\b/i,
    /\bgenitori\s+separat\w*/i,
    /\bfigli?[oa]\b.{0,24}\b(?:\d{1,2}|undici|dodici|tredici|quattordici|quindici|sedici|diciassette)\s+ann[oi]\b/i,
    /\b(?:ha|aveva|compie|compiuto)\s+(?:\d{1,2}|undici|dodici|tredici|quattordici|quindici|sedici|diciassette)\s+ann[oi]\b/i,
    /\b(?:undicenne|dodicenne|tredicenne|quattordicenne|quindicenne|sedicenne|diciassettenne)\b/i,
    /\bpediatr\w*\b/i,
    /\bscuola\s+(?:primaria|secondaria)\b/i,
    /\bservizi?\s+sociali?\b/i,
    /\bcollocamento\s+(?:del|della|dei|delle)?\s*minor/i,
    /\bresidenza\s+abituale\s+(?:del|della|dei|delle)?\s*minor/i,
  ];

// "nato/a il ..." con un anno che renderebbe la persona ancora minorenne
// oggi: indizio di data di nascita di un minore. L'anno limite è ricalcolato
// a ogni chiamata (non una costante) così da restare corretto nel tempo.
function contieneDataNascitaRecente(testo: string): boolean {
    const annoLimite = new Date().getFullYear() - 18;
    const regexData = /\bnat[oa]\s+(?:il|a)\b.{0,20}?\b(19|20)(\d{2})\b/gi;
    let m: RegExpExecArray | null;
    while ((m = regexData.exec(testo))) {
          const anno = Number(`${m[1]}${m[2]}`);
          if (anno > annoLimite) return true;
    }
    return false;
}

// "X anni" con X < 18. Esclude i casi immediatamente preceduti da termini
// che indicano importi, durate contrattuali o processuali (mutuo, causa,
// prescrizione, ecc.) per ridurre i falsi positivi più comuni in un testo
// giuridico — resta comunque un'euristica, non una prova.
const CONTESTI_ESCLUSI = /\b(mutu\w*|contratt\w*|caus\w*|prescri\w*|locazion\w*|comodat\w*|garanzi\w*|pena|reclusion\w*|concession\w*|licenz\w*|affitt\w*|leasing)\D{0,20}$/i;
// Durate, intervalli e stime di tempo («2-4 anni», «per 5 anni», «durata
// stimata 3 anni», «negli ultimi 5 anni»): non sono l'eta' di una persona.
// Il contesto che precede il numero deve essere una parola di durata oppure
// un intervallo («2-», «da 2 a», «tra 2 e») oppure l'inizio di una cella di
// tabella («| 2 anni |», come nelle tabelle dei tempi di giudizio). Un'eta' come «ragazza di 15 anni»
// continua a essere rilevata.
const CONTESTI_DURATA = /(?:\b(?:per|da|entro|oltre|circa|dopo|tra|fra|nei|negli|ultimi|prossimi|durata|durare|dura|stimat\w*|pluriennal\w*|termine|scadenza|fino|tempi|tempo|cumulativ\w*)\b\D{0,20}|\d\s*(?:-|\u2013|\u2014|a|e)\s*|\|\s*\**\s*)$/i;
function contieneEtaMinorenne(testo: string): boolean {
    const regexEta = /\b(\d{1,2})\s+ann[oi]\b/gi;
    let m: RegExpExecArray | null;
    while ((m = regexEta.exec(testo))) {
          const eta = Number(m[1]);
          if (eta >= 0 && eta < 18) {
                  const contestoPrima = testo.slice(Math.max(0, m.index - 30), m.index);
                  if (CONTESTI_ESCLUSI.test(contestoPrima)) continue;
                  if (CONTESTI_DURATA.test(contestoPrima)) continue;
                  return true;
          }
    }
    return false;
}

export interface EsitoRilevamentoMinori {
    rischio: boolean;
    // Solo etichette tecniche (nessun estratto di testo), coerentemente con il
  // divieto di inserire contenuto della pratica nei log/audit trail.
  indizi: string[];
}

export function rilevaPossibiliRiferimentiMinori(...testi: Array<string | null | undefined>): EsitoRilevamentoMinori {
    const indizi = new Set<string>();
    for (const testo of testi) {
          if (typeof testo !== "string" || !testo.trim()) continue;
          PAROLE_CHIAVE.forEach((pattern, i) => {
                  if (pattern.test(testo)) indizi.add(`parola-chiave-${i}`);
          });
          if (contieneDataNascitaRecente(testo)) indizi.add("data-nascita-recente");
          if (contieneEtaMinorenne(testo)) indizi.add("eta-minorenne");
    }
    return { rischio: indizi.size > 0, indizi: Array.from(indizi) };
}
