# PRIV-15 — Checklist di decisione e riattivazione dei flussi AI

Data di predisposizione: 11 settembre 2026
Stato: modello operativo non approvato

Questa scheda evita che una semplice variabile d'ambiente riattivi un
trattamento non ancora autorizzato. Deve essere completata, datata e conservata
nell'archivio riservato prima di modificare i flag di produzione. Non
costituisce da sola una valutazione giuridica né una certificazione di
conformità.

## Analisi AI del Caso

- [ ] Ruoli di CalcoloMediazione, professionista e altri soggetti coinvolti
  determinati, motivati e formalmente approvati per questo specifico flusso.
- [ ] Base propria ex art. 6 per i dati di terzi motivata e documentata.
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
- [ ] Informativa, avviso immediato, istruzioni di minimizzazione e test
  accessibilità approvati.
- [ ] Test sintetici di upload, analisi, chat, cancellazione e retention
  superati senza dati personali reali.

Solo dopo il completamento di tutte le voci:

- `CASE_AI_GDPR_APPROVED=true`
- `CASE_AI_ENABLED=true`

## Assistente AI Antiriciclaggio

- [ ] Ruoli di professionista/Organismo e CalcoloMediazione determinati,
  motivati e formalmente approvati.
- [ ] Se CalcoloMediazione è responsabile, accordo e istruzioni documentate ex
  art. 28 sottoscritti; se titolare autonomo o contitolare, relativi obblighi
  documentati e attuati.
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
