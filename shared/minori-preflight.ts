// PRIV-17 — costanti condivise fra client e server per il protocollo di
// preflight sui dati di minori nei flussi AI.
// Specifica: docs/PRIV-17-presidi-rafforzati-minori-ai.md
//
// Cambiare il testo dell'avviso o delle conferme richiede di incrementare
// MINORS_NOTICE_VERSION: un client con una versione diversa da quella
// accettata dal server viene bloccato (vedi server/security/minors-preflight.ts).

export const MINORS_NOTICE_VERSION = "priv17-v1";

export const MINORS_NOTICE_TEXT =
  "I dati dei minori richiedono una tutela rafforzata. Non caricare documenti " +
  "finché non hai verificato la necessità del trattamento, la base giuridica, " +
  "l'informativa applicabile e la possibilità di eliminare nomi, recapiti, " +
  "immagini, dati sanitari, scolastici e ogni dettaglio non indispensabile. " +
  "La pseudonimizzazione automatica non garantisce l'anonimato.";

export const MINORS_CONFIRMATION_LABELS: readonly string[] = [
  "Sono autorizzato dal titolare della pratica a utilizzare questo strumento.",
  "Ho verificato la base giuridica, l'informativa ed eventuali presupposti dell'art. 9 GDPR.",
  "Se sono presenti dati su condanne o reati, ho verificato il presupposto dell'art. 10 GDPR e il diritto nazionale applicabile.",
  "Ho eliminato i dati non necessari rispetto alla finalità dell'analisi.",
  "Non ho inserito immagini o registrazioni del minore (vietate fino a una futura decisione separata).",
  "Non ho inserito recapiti diretti o altri identificativi del minore, salvo assoluta necessità documentata.",
  "Ho verificato che l'uso dell'AI sia compatibile con il superiore interesse del minore e con le regole professionali applicabili.",
];

export const MINORS_CONFIRMATION_COUNT = MINORS_CONFIRMATION_LABELS.length;

export const MINORS_CATEGORIZATION_QUESTION =
  "La pratica contiene o può contenere dati riferiti a persone di età inferiore a 18 anni?";

export type MinorsStatus = "yes" | "no" | "unknown";
