# PRIV-18 — Verbale delle decisioni di indirizzo del titolare

Data: 12 settembre 2026
Stato: decisioni di indirizzo registrate; nessuna autorizzazione alla
riattivazione dei flussi AI

## Contesto

A seguito del merge della PR #84 e del collaudo positivo in produzione, il
titolare Carlo Alberto Calcagno ha espresso tre decisioni per orientare il
completamento delle misure privacy.

Le decisioni sono state registrate anche nelle issue GitHub del progetto. Esse
non approvano la DPIA o il registro nel loro complesso, non attestano la
sottoscrizione di accordi con clienti o fornitori e non autorizzano la modifica
dei flag fail-closed di produzione.

## Decisioni

### Avviso e minimizzazione

È approvato il testo pubblico introdotto con la PR #84 relativo a:

- sospensione delle nuove Analisi AI;
- natura best-effort della pseudonimizzazione automatica;
- differenza tra pseudonimizzazione e anonimizzazione;
- obbligo professionale di rimuovere o minimizzare manualmente i dati non
  necessari prima di un'eventuale futura trasmissione.

Riferimento: issue GitHub #81, chiusa il 12 settembre 2026.

### Dati di minori

È scelta l'opzione dei presidi rafforzati, anziché il divieto assoluto o il mero
rinvio. La scelta deve essere attuata secondo PRIV-17 e resta subordinata a:

- progettazione e implementazione dei controlli;
- aggiornamento e approvazione della DPIA e del registro;
- verifica delle basi e dei presupposti applicabili;
- test sintetici e riesame indipendente;
- decisione finale di attivazione.

Riferimento: issue GitHub #83.

### Modello di ruolo per il servizio professionale

È scelto come modello da sviluppare per l'Analisi AI del caso e per
l'assistente AI AML destinati a professionisti o Organismi quello in cui:

- il professionista o l'Organismo, previa verifica fattuale nel singolo
  scenario, determina finalità e mezzi essenziali e opera quale titolare;
- CalcoloMediazione tratta i dati per conto del titolare quale responsabile ai
  sensi dell'art. 28 GDPR;
- i fornitori tecnici intervengono soltanto come subresponsabili autorizzati e
  contrattualizzati.

L'indirizzo non rende automaticamente CalcoloMediazione responsabile in ogni
flusso. Il ruolo deve essere verificato in concreto e diventa operativo
soltanto con accordo ex art. 28 sottoscritto, istruzioni documentate e catena
dei subresponsabili approvata.

Riferimento: issue GitHub #30.

## Effetti operativi

- `CASE_AI_ENABLED` e `CASE_AI_GDPR_APPROVED` devono restare assenti o diversi
  da `true`.
- `AML_AI_ENABLED` e `AML_AI_GDPR_APPROVED` devono restare assenti o diversi da
  `true`.
- Il modello PRIV-16 deve essere completato e riesaminato prima dell'uso.
- I controlli PRIV-17 devono essere implementati e testati prima di trattare
  dati di minori.
- PRIV-10 e PRIV-11 restano bozze non approvate nel loro complesso.
- Le verifiche Anthropic, Gemini e Northflank ancora aperte restano
  prerequisiti.

## Tracciabilità

- PR #84: https://github.com/calcagnocarloalberto1-star/calcolomediazione/pull/84
- Issue #30: https://github.com/calcagnocarloalberto1-star/calcolomediazione/issues/30
- Issue #81: https://github.com/calcagnocarloalberto1-star/calcolomediazione/issues/81
- Issue #83: https://github.com/calcagnocarloalberto1-star/calcolomediazione/issues/83

## Conferma

- Titolare: Carlo Alberto Calcagno
- Data della decisione: 12 settembre 2026
- Riferimento alla decisione: selezioni espresse e registrate nelle issue sopra
  indicate
- Firma o ulteriore riferimento conservato: __________________________
- Data del prossimo riesame: ________________________________________
