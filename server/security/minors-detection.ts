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
    // «minor» e «minori» non stanno qui: sono anche un comparativo molto comune
    // («costi minori», «minor rischio»). Li valuta contieneRiferimentoAiMinori().
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
    // «mediazione familiare» da sola non indica un minore: compare anche in
    // successioni, imprese di famiglia e conflitti tra adulti (8 novembre 2026:
    // la chat di un'analisi su una successione aziendale restava bloccata).
    // I casi con figli sono coperti da «affidamento figli», «genitori separati»,
    // «minorenne», eta' e dalle altre voci.
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

// «minori» (e «minor») come comparativo: nelle analisi economiche compare di
// continuo («la mediazione comporta costi minori», «tempi minori», «minor
// rischio», «i costi sono minori»). Segnalato il 8 novembre 2026: la chat
// dell'analisi restava bloccata per questo falso positivo, senza spiegazione.
// Si considera comparativo solo se accanto compare un nome di costo, tempo o
// rischio e non c'e' un indizio che si parli di persone («spese per i minori»,
// «tempi di permanenza dei minori» restano segnalati).
const NOMI_COMPARATIVO = "costi|costo|spese|spesa|oneri|onere|tempi|tempo|tempistiche|durata|durate|rischi|rischio|incertezza|incertezze|importi|importo|somme|esborsi|compensi|probabilit[aà]|possibilit[aà]|perdite|margini|margine|valori|valore|entrate|ricavi|vantaggi|svantaggi|difficolt[aà]|impegni|impegno|rigidit[aà]|formalit[aà]|aleatoriet[aà]|rate|canoni|canone";
const REGEX_NOME_DOPO = new RegExp(`^\\s+(?:${NOMI_COMPARATIVO})(?![\\wàèéìòù])`, "i");
const REGEX_NOME_PRIMA = new RegExp(`(?<![\\wàèéìòù])(?:${NOMI_COMPARATIVO})(?![\\wàèéìòù])`, "i");
const REGEX_CONFRONTO_DOPO = /^\s+rispetto\b/i;
const REGEX_INDIZIO_PERSONE = /(?<![\wàèéìòù])(?:dei|delle|degli|ai|alle|agli|nei|nelle|negli|per|con|sui|sulle|dai|tra|fra|verso|genitori|figli\w*|famigli\w*|tutela|affid\w*)(?![\wàèéìòù])/i;

function contieneRiferimentoAiMinori(testo: string): boolean {
    const regex = /(?<![\wàèéìòù])minori?(?![\wàèéìòù])/gi;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(testo))) {
          const dopo = testo.slice(m.index + m[0].length, m.index + m[0].length + 40);
          if (REGEX_NOME_DOPO.test(dopo) || REGEX_CONFRONTO_DOPO.test(dopo)) continue;
          // Ultime parole della stessa frase che precedono «minori».
          const frase = testo.slice(Math.max(0, m.index - 80), m.index).split(/[.;:!?|\n]/).pop() || "";
          const ultime = frase.trim().split(/\s+/).slice(-4).join(" ");
          if (REGEX_NOME_PRIMA.test(ultime) && !REGEX_INDIZIO_PERSONE.test(ultime)) continue;
          return true;
    }
    return false;
}

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
// Parole che rendono «N anni» l'eta' di una persona (nei 40 caratteri prima).
const INDIZI_PERSONA = /\b(?:ragazz\w*|giovan\w*|studente\w*|studentess\w*|alunn\w*|persona|soggetto|et[aà]|nat[oa]|figli\w*|bambin\w*|minor\w*|adolescent\w*|giovanissim\w*)\b[^.\n]{0,40}$/i;
function contieneEtaMinorenne(testo: string): boolean {
    const regexEta = /\b(\d{1,2})\s+ann[oi]\b/gi;
    let m: RegExpExecArray | null;
    while ((m = regexEta.exec(testo))) {
          const eta = Number(m[1]);
          if (eta >= 0 && eta < 18) {
                  const contestoPrima = testo.slice(Math.max(0, m.index - 30), m.index);
                  if (CONTESTI_ESCLUSI.test(contestoPrima)) continue;
                  if (CONTESTI_DURATA.test(contestoPrima)) continue;
                  // «N anni» senza un indizio di persona nelle vicinanze e' una durata
                  // («in 3 anni», «3 anni prima», «ritardo di 3 anni»), non un'eta'.
                  const contestoPersona = testo.slice(Math.max(0, m.index - 40), m.index);
                  if (!INDIZI_PERSONA.test(contestoPersona)) continue;
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
          if (contieneRiferimentoAiMinori(testo)) indizi.add("parola-chiave-minori");
          if (contieneDataNascitaRecente(testo)) indizi.add("data-nascita-recente");
          if (contieneEtaMinorenne(testo)) indizi.add("eta-minorenne");
    }
    return { rischio: indizi.size > 0, indizi: Array.from(indizi) };
}
