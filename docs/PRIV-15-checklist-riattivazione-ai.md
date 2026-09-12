# PRIV-15 — Checklist di decisione e riattivazione dei flussi AI

Data di predisposizione: 11 settembre 2026
Stato: modello operativo non approvato

Le decisioni di indirizzo del 12 settembre 2026 sono registrate in
`PRIV-18-verbale-decisioni-titolare-2026-09-12.md`. Non equivalgono
all'approvazione della DPIA, del registro o del trattamento.

Questa scheda evita che una semplice variabile d'ambiente riattivi un
trattamento non ancora autorizzato. Deve essere completata, datata e conservata
nell'archivio riservato prima di modificare i flag di produzione. Non
costituisce da sola una valutazione giuridica né una certificazione di
conformità.

## Analisi AI del Caso

- [x] Modello di ruolo scelto in via di indirizzo e registrato in PRIV-18:
  professionista/Organismo titolare e CalcoloMediazione responsabile ex art. 28.
- [ ] Accordo ex art. 28 basato su
  `PRIV-16-modello-accordo-art-28-professionisti.md` completato, approvato e
  sottoscritto per il titolare che usa il servizio.
- [ ] Ruoli di eventuali altri soggetti coinvolti determinati, motivati e
  formalmente approvati per questo specifico flusso.
- [ ] Base ex art. 6 del professionista/Organismo titolare per i dati di terzi
  motivata e documentata.
- [ ] Eventuali presupposti ex artt. 9 e 10 definiti.
- [ ] Processo ex art. 14 definito, oppure specifica eccezione motivata e
  documentata.
- [ ] DPIA completata, rischio residuo classificato e decisione ex art. 36
  registrata.
- [ ] Registro art. 30 aggiornato e approvato.
- [ ] Account Anthropic di produzione, Commercial Terms, DPA, SCC,
  subprocessori e retention verificati e archiviati.
- [ ] Eventuale Gemini verificato come Paid Service con DPA, meccanismo di
  trasferimento e retention archiviati.
- [x] Testo pubblico dell'avviso immediato, dei limiti della
  pseudonimizzazione e delle istruzioni di minimizzazione approvato dal titolare
  il 12 settembre 2026, come registrato in PRIV-18 e nell'issue #81.
- [ ] Test accessibilità dell'avviso e del futuro flusso di attestazioni
  superati.
- [ ] Presidi rafforzati per dati di minori descritti in
  `PRIV-17-presidi-rafforzati-minori-ai.md` implementati, testati e approvati.
- [ ] Test sintetici di upload, analisi, chat, cancellazione e retention
  superati senza dati personali reali.

Solo dopo il completamento di tutte le voci:

- `CASE_AI_GDPR_APPROVED=true`
- `CASE_AI_ENABLED=true`

## Assistente AI Antiriciclaggio

- [x] Modello di ruolo scelto in via di indirizzo e registrato in PRIV-18:
  professionista/Organismo titolare e CalcoloMediazione responsabile ex art. 28.
- [ ] Modello verificato nel concreto scenario AML, motivato e reso operativo
  mediante accordo e istruzioni documentate.
- [ ] Accordo e istruzioni documentate ex art. 28 sottoscritti per lo specifico
  professionista o Organismo titolare.
- [ ] Subresponsabili autorizzati e catena contrattuale verificata.
- [ ] Presupposto applicabile ai dati ex art. 10 e diritto nazionale
  documentato.
- [ ] Categorie di dati, minimizzazione, retention e canali di esercizio dei
  diritti definiti.
- [ ] DPIA e registro aggiornati e approvati per il flusso AML.
- [ ] Informativa e guida pubblica aggiornate prima della riattivazione.
- [ ] Test sintetici degli endpoint, del limite file, della cancellazione in
  memoria e dei log superati senza dati personali reali.

Solo dopo il completamento di tutte le voci:

- `AML_AI_GDPR_APPROVED=true`
- `AML_AI_ENABLED=true`

## Decisione

- Flusso autorizzato: ________________________________________________
- Limitazioni o categorie escluse: __________________________________
- Motivazione e rischio residuo accettato: ___________________________
- Data: ____________________
- Titolare/ruolo: Carlo Alberto Calcagno, titolare di CalcoloMediazione.it
- Firma o riferimento alla decisione conservata: ____________________
- Data del prossimo riesame: ____________________
