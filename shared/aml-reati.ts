// PRIV-19 / PRIV-10 — dichiarazione obbligatoria prima dell'uso dell'assistente
// AI antiriciclaggio, per i dati relativi a condanne e reati (art. 10 GDPR).
// Cambiare il testo richiede di incrementare AML_REATI_DECLARATION_VERSION: il
// client in `client/public/antiriciclaggio.js` ne ripete versione e testo (file
// statico, non importa moduli); un test verifica che coincidano.

export const AML_REATI_DECLARATION_VERSION = "aml-reati-v1";

export const AML_REATI_DECLARATION_TEXT =
  "Dichiaro di agire come titolare del trattamento (o su suo incarico documentato) e di aver verificato, " +
  "prima di caricare i documenti, la base giuridica e l'informativa. Se i documenti contengono o possono " +
  "contenere dati relativi a condanne penali e reati, o a misure di sicurezza connesse, dichiaro di aver " +
  "verificato il presupposto dell'art. 10 GDPR e il diritto nazionale che lo autorizza; in caso contrario " +
  "non li carico.";
