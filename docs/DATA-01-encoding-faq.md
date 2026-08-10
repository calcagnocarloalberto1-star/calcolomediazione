# DATA-01 — Bug di encoding testo nella pagina FAQ

**Data:** 10 agosto 2026

## Stato dei due rilievi originali

L'audit originale segnalava due problemi sulla pagina `/faq`:

1. **Titolo "Cosè" privo di apostrofo** invece di "Cos'è" — verificato live: **già corretto** (risolto in una sessione precedente, prima di questa issue).
2. **Sequenze unicode non decodificate** nel paragrafo introduttivo — verificato live: **non presente**, il testo introduttivo ("Tutto quello che c'è da sapere...") è pulito.

## Bug nuovo trovato durante la verifica

Controllando l'intera pagina (non solo il paragrafo introduttivo citato dall'audit) e le altre pagine generate dalla stessa pipeline di contenuti, come richiesto dai criteri di accettazione, ho trovato un problema diverso ma imparentato, non segnalato dall'audit originale: la parola **"congruità" appariva scritta con due caratteri cirillici visivamente identici ai corrispondenti latini** (и al posto di "i", т al posto di "t"), risultando "congru**ит**à" — visibile testualmente agli utenti reali in 4 punti della pagina FAQ (2 domande sulla verifica di congruità catastale, 2 sul visto di congruità dell'avvocato nel patrocinio a spese dello Stato).

È il tipo di corruzione tipico di un copia-incolla da una fonte con caratteri unicode simili (o di una generazione automatica del testo), non visibile scorrendo il codice a colpo d'occhio perché i caratteri sono praticamente indistinguibili da quelli latini nella maggior parte dei font.

**Corretto** in `client/src/pages/FAQ.tsx`. Verificata l'assenza dello stesso pattern (scansione di tutti i file `.tsx/.ts/.md/.json/.html` del repo alla ricerca di caratteri cirillici) in qualsiasi altra pagina del sito: il bug era isolato a questo unico file.

## File toccati

- `client/src/pages/FAQ.tsx`
