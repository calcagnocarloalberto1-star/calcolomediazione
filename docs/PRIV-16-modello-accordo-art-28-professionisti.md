# PRIV-16 — Modello di accordo sul trattamento dei dati ex art. 28 GDPR

Data di predisposizione: 12 settembre 2026
Stato: bozza contrattuale non sottoscritta e non operativa

## Avvertenza

Questo documento attua la decisione di indirizzo del titolare del 12 settembre
2026, secondo cui il futuro servizio AI destinato ai professionisti dovrà essere
strutturato, salvo successivo riesame motivato, con:

- professionista o Organismo quale titolare del trattamento, dopo verifica
  fattuale per lo specifico scenario;
- CalcoloMediazione quale responsabile del trattamento ai sensi dell'art. 28
  GDPR;
- fornitori tecnici autorizzati quali subresponsabili.

La sola predisposizione di questa bozza non determina i ruoli per casi concreti,
non prova la conformità del trattamento e non autorizza la riattivazione dei
flussi AI. L'accordo deve essere completato, riesaminato e sottoscritto prima
dell'uso con dati personali di pratiche reali.

## Parti

### Titolare del trattamento

- Denominazione o nominativo: ______________________________________
- Codice fiscale/P. IVA: ___________________________________________
- Sede e recapiti: _________________________________________________
- Referente privacy/DPO, se nominato: _______________________________

### Responsabile del trattamento

- Nome: Carlo Alberto Calcagno
- Servizio: CalcoloMediazione.it
- Codice fiscale/P. IVA: ___________________________________________
- Sede e recapiti: _________________________________________________
- Referente privacy: _______________________________________________

## Oggetto, durata, natura e finalità

Il titolare incarica il responsabile di mettere a disposizione le funzioni
espressamente selezionate nel servizio CalcoloMediazione.it, nei limiti delle
istruzioni documentate e dell'Allegato A.

- **Oggetto:** elaborazione assistita di informazioni relative a pratiche di
  mediazione o negoziazione, ove la specifica funzione sia stata autorizzata.
- **Durata:** dalla sottoscrizione fino alla cancellazione dell'account o alla
  cessazione del servizio, fatte salve le operazioni di restituzione,
  cancellazione e conservazione obbligatoria.
- **Natura delle operazioni:** raccolta, ricezione, estrazione temporanea,
  pseudonimizzazione, trasmissione controllata ai subresponsabili autorizzati,
  generazione di output, conservazione limitata, consultazione, esportazione e
  cancellazione.
- **Finalità:** erogare al titolare lo strumento tecnico richiesto. Il
  responsabile non utilizza i contenuti delle pratiche per alcuna finalità
  propria non prevista dalle istruzioni documentate, incluse profilazione
  commerciale o addestramento di modelli.

## Interessati e categorie di dati

Le categorie effettivamente autorizzate devono essere selezionate nell'Allegato
A. Possono comprendere:

- utenti professionisti e loro collaboratori;
- clienti, controparti, difensori, consulenti e altri partecipanti alla pratica;
- rappresentanti di persone giuridiche;
- testimoni o altri terzi menzionati nei documenti;
- minori, soltanto dopo l'attivazione dei presidi specifici di PRIV-17.

I dati possono comprendere dati identificativi e di contatto, informazioni
professionali, economiche, patrimoniali, contrattuali e processuali. Categorie
particolari ex art. 9 GDPR e dati ex art. 10 GDPR sono esclusi salvo specifica
istruzione, presupposto normativo documentato, aggiornamento della DPIA e
attivazione dei relativi controlli tecnici.

## Istruzioni documentate

Il responsabile tratta i dati soltanto:

1. per le funzioni e le categorie selezionate nell'Allegato A;
2. secondo le istruzioni impartite mediante configurazione del servizio,
   richieste documentate e presente accordo;
3. per il tempo strettamente necessario e secondo la retention approvata;
4. nei territori e tramite i subresponsabili autorizzati nell'Allegato B.

Se un trattamento è richiesto dal diritto dell'Unione o nazionale cui è
soggetto il responsabile, quest'ultimo informa il titolare di tale obbligo
giuridico prima del trattamento, salvo che il diritto vieti tale informazione
per rilevanti motivi di interesse pubblico.

Se ritiene che un'istruzione violi il GDPR o altra normativa applicabile, il
responsabile informa senza ritardo il titolare e sospende l'esecuzione
dell'istruzione, nei limiti consentiti dalla legge.

## Obblighi del titolare

Il titolare:

- determina finalità, categorie di interessati e dati, basi giuridiche e
  presupposti degli artt. 9 e 10 GDPR;
- fornisce le informative dovute, compresa quella ex art. 14 ove applicabile;
- impartisce istruzioni lecite, complete e documentate;
- applica minimizzazione e pseudonimizzazione prima del caricamento;
- non inserisce dati eccedenti, non necessari o non autorizzati;
- verifica i poteri e le autorizzazioni dei propri utenti;
- valuta e documenta i rischi, inclusa la DPIA quando richiesta;
- informa il responsabile di richieste degli interessati, contenziosi, ordini
  dell'autorità o vincoli di conservazione rilevanti.

## Obblighi del responsabile

Il responsabile:

- tratta i dati esclusivamente su istruzione documentata del titolare;
- autorizza all'accesso soltanto persone vincolate alla riservatezza;
- adotta le misure dell'Allegato C e le riesamina periodicamente;
- tiene separati, per quanto tecnicamente possibile, i dati dei diversi
  titolari;
- tenuto conto della natura del trattamento, assiste il titolare con misure
  tecniche e organizzative adeguate nell'esercizio dei diritti degli
  interessati;
- tenuto conto della natura del trattamento e delle informazioni a propria
  disposizione, assiste il titolare negli obblighi degli artt. 32-36 GDPR,
  inclusi sicurezza, notifiche delle violazioni, DPIA e consultazione
  preventiva;
- mette a disposizione le informazioni necessarie a dimostrare il rispetto
  dell'art. 28 GDPR;
- non vende, diffonde o usa i dati per addestrare modelli propri;
- informa il titolare delle richieste giuridicamente vincolanti di accesso ai
  dati, salvo divieto di legge.

## Sicurezza

Le misure minime sono descritte nell'Allegato C e comprendono, ove applicabili:

- HTTPS e header di sicurezza;
- cifratura autenticata AES-256-GCM dei contenuti conservati;
- chiavi e segreti separati dal database;
- controlli di accesso e autenticazione multifattore per l'area amministrativa;
- pseudonimizzazione preventiva best-effort;
- limiti di dimensione e frequenza, validazione dei file e minimizzazione dei
  log;
- retention limitata, cancellazione automatica e cancellazione su richiesta;
- gate fail-closed prima dei parser e degli handler di upload;
- backup, ripristino e risposta agli incidenti secondo procedure documentate.

## Violazioni dei dati personali

Il responsabile informa il titolare senza ingiustificato ritardo dopo essere
venuto a conoscenza di una violazione. Salvo impossibilità motivata, invia una
prima comunicazione entro 24 ore, indicando almeno:

- natura dell'evento e momento della scoperta;
- categorie e volume stimato di interessati e dati;
- conseguenze probabili;
- misure adottate o proposte;
- referente per gli aggiornamenti.

Le informazioni mancanti possono essere trasmesse per fasi. Il responsabile
conserva un registro dell'incidente e coopera affinché il titolare possa
rispettare i termini degli artt. 33 e 34 GDPR.

## Subresponsabili

Il titolare autorizza soltanto i subresponsabili elencati nell'Allegato B. Per
ogni nuova nomina o sostituzione:

1. il responsabile comunica preventivamente identità, funzione, Paese e data
   prevista;
2. il titolare dispone di ____ giorni per formulare un'obiezione motivata;
3. prima di qualsiasi trattamento, il responsabile conclude con il
   subresponsabile un contratto scritto e giuridicamente vincolante che impone
   gli stessi obblighi in materia di protezione dei dati previsti dal presente
   accordo, con garanzie sufficienti per misure tecniche e organizzative
   adeguate;
4. se il subresponsabile omette di adempiere, il responsabile iniziale conserva
   nei confronti del titolare l'intera responsabilità dell'adempimento degli
   obblighi del subresponsabile.

Anthropic e Google Gemini non possono essere inseriti nell'Allegato B per il
trattamento di pratiche reali finché account effettivo, DPA, condizioni
commerciali, subprocessori, retention e trasferimenti non siano verificati e
archiviati.

## Trasferimenti internazionali

Il responsabile non trasferisce dati fuori dallo SEE o verso organizzazioni
internazionali senza istruzione documentata e valido meccanismo ai sensi del
capo V GDPR. Quando necessario, documenta:

- decisione di adeguatezza o SCC 2021 con modulo corretto;
- valutazione d'impatto del trasferimento;
- misure supplementari;
- eventuale addendum UK per dati soggetti a UK GDPR.

## Diritti degli interessati

Il responsabile inoltra al titolare, senza rispondere nel merito salvo
istruzione, le richieste ricevute direttamente. Fornisce assistenza tecnica
ragionevole per accesso, rettifica, cancellazione, limitazione, portabilità,
opposizione e contestazione di decisioni automatizzate.

## Restituzione e cancellazione

Alla cessazione, il titolare sceglie tra restituzione ed eliminazione dei dati,
salvo obblighi di legge. Il responsabile:

- rende disponibili gli strumenti di esportazione previsti;
- elimina i dati attivi entro ____ giorni dalla richiesta o cessazione;
- cancella tutte le copie esistenti, incluse quelle in sistemi attivi, repliche,
  cache, code e backup, secondo tempi documentati, salvo obbligo di legge;
- documenta tempi e modalità di eliminazione da backup e log;
- comunica eventuali copie che devono essere conservate per legge e ne limita
  il trattamento.

## Verifiche e audit

Il responsabile mette a disposizione tutte le informazioni necessarie a
dimostrare il rispetto dell'art. 28 GDPR e consente e contribuisce alle
attività di revisione, comprese le ispezioni, realizzate dal titolare o da un
altro soggetto da questi incaricato. Le modalità ordinarie possono prevedere
preavviso e misure proporzionate per proteggere sicurezza, riservatezza e dati
di altri clienti, senza svuotare il diritto di verifica. In caso di incidente,
richiesta dell'autorità o fondato sospetto di inadempimento, il diritto di
verifica non è limitato alla cadenza ordinaria. Il responsabile informa
immediatamente il titolare se, a suo parere, un'istruzione relativa all'audit
viola il GDPR o altra normativa applicabile.

## Responsabilità e prevalenza

Le responsabilità restano disciplinate dal GDPR, dalla normativa applicabile e
dal contratto principale. In caso di contrasto sul trattamento dei dati,
prevale il presente accordo. Le clausole non possono ridurre i diritti degli
interessati.

## Allegato A — Scheda delle istruzioni

- Funzioni autorizzate: _____________________________________________
- Finalità specifiche: ______________________________________________
- Interessati ammessi: ______________________________________________
- Categorie di dati ammesse: ________________________________________
- Dati in ingresso e metadati tecnici ammessi: _______________________
- Output e inferenze generate autorizzati: ___________________________
- Dati di audit e attestazioni autorizzati: ___________________________
- Categorie espressamente escluse: __________________________________
- Presupposti artt. 6, 9 e 10: ______________________________________
- Retention: ________________________________________________________
- Utenti autorizzati: _______________________________________________
- Istruzioni aggiuntive: ____________________________________________

## Allegato B — Subresponsabili autorizzati

| Fornitore | Servizio | Paesi | Meccanismo di trasferimento | DPA e data | Stato |
|---|---|---|---|---|---|
| Northflank LTD | Hosting, database e infrastruttura | Da completare per workload, backup, log e control plane | Da completare | DPA acquisito; verifica residua in PRIV-12/13 | Non approvato in questa bozza |
| Anthropic | API AI primaria | Da verificare | Da verificare | Applicabilità all'account `carlo-api-key` da provare | Non autorizzato |
| Google | Gemini API, solo eventuale fallback | Da verificare | Da verificare | Paid Service e DPA da archiviare | Non autorizzato |

## Allegato C — Misure tecniche e organizzative

Riferimenti iniziali, da allegare nella versione firmata:

- `docs/RUNBOOK-CIFRATURA-E-ACCESSO-ADMIN.md`;
- `docs/PIANO-SICUREZZA-PRIVACY-E-INCIDENTI.md`;
- `docs/PRIV-13-verbale-backup-2026-09-09.md`;
- `docs/PRIV-15-checklist-riattivazione-ai.md`;
- `docs/PRIV-17-presidi-rafforzati-minori-ai.md`.

La versione sottoscritta deve allegare copie datate o identificativi di
versione immutabili delle misure applicabili; il semplice rinvio a documenti
modificabili nel repository non è sufficiente.

Prima della firma, ogni misura deve essere classificata nella seguente matrice:

| Misura | Stato: attiva/futura/non provata | Evidenza e versione | Limiti o dipendenze |
|---|---|---|---|
| __________________________________ | __________________ | __________________ | __________________ |
| __________________________________ | __________________ | __________________ | __________________ |
| __________________________________ | __________________ | __________________ | __________________ |

Le misure future o non provate non possono essere presentate come garanzie già
operative e, se indispensabili al trattamento, impediscono l'avvio del
servizio.

Eventuali eccezioni, limiti o misure ulteriori:

____________________________________________________________________

## Sottoscrizione

Per il titolare:

- Nome e qualifica: _________________________________________________
- Data: __________________
- Firma: ____________________________________________________________

Per il responsabile:

- Nome e qualifica: Carlo Alberto Calcagno, gestore di
  CalcoloMediazione.it
- Data: __________________
- Firma: ____________________________________________________________
