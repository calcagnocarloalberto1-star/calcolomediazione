# Piano operativo sicurezza, privacy e risposta agli incidenti

Data di aggiornamento: 11 settembre 2026
Ambito: CalcoloMediazione.it, Northflank, PostgreSQL, Anthropic API e Google Gemini API.

Questo documento è una checklist operativa e una bozza organizzativa. Non costituisce certificazione di conformità né sostituisce la valutazione del titolare, del DPO o di un consulente privacy.

## Stato tecnico verificato

- HTTPS, redirect HTTP, header di sicurezza e CSP con nonce sono attivi.
- Le nuove analisi sono protette con AES-256-GCM. La colonna di verifica del
  token contiene un hash; una copia recuperabile del token è conservata nel
  payload cifrato, con chiave mantenuta separatamente dal database, per
  consentire le procedure di migrazione e rollback.
- `/api/health` verifica database e disponibilità di tutte le key ID necessarie a decifrare i payload.
- Le nuove Analisi AI, i relativi upload/chat e l'assistente AI AML sono
  sospesi fail-closed. Gli endpoint rifiutano le richieste prima dei parser di
  upload. Le analisi storiche sono eliminate automaticamente dopo 30 giorni;
  la compilazione manuale AML resta locale nel browser.
- Login, upload e funzioni IA hanno limiti di frequenza; i file sono limitati per numero e dimensione e verificati anche tramite firma binaria.
- La sessione admin usa un cookie `HttpOnly`, `Secure` e `SameSite=Strict`, dura 30 minuti ed è revocata sul server al logout.
- In produzione il login amministrativo richiede una password di almeno 16 caratteri, un `ADMIN_SECRET` persistente e TOTP. Se una di queste condizioni manca, l'area admin resta sospesa senza interrompere il sito pubblico.
- Le API inutilizzate che registravano e restituivano lo storico dei calcoli sono state rimosse.
- `multer` è aggiornato alla versione 2.3.0; il controllo automatico blocca vulnerabilità di livello alto o critico.

## Attività obbligatorie prima del prossimo rilascio

- [x] Generare un segreto TOTP Base32 di almeno 160 bit.
- [x] Registrarlo in un'app di autenticazione su almeno un dispositivo controllato.
- [ ] Conservare il codice/QR di recupero in un gestore di password cifrato.
- [x] Aggiungere `ADMIN_TOTP_SECRET` ai secret runtime di Northflank.
- [ ] Verificare che `ADMIN_PASSWORD`, `ADMIN_SECRET` e `DATA_ENCRYPTION_KEY` siano differenti, casuali e conservati anche fuori da Northflank.
- [x] Verificare nel pannello Northflank che
  `GEMINI_PAID_SERVICE_ACKNOWLEDGED` sia assente o diverso da `true` finché
  non è confermato un servizio commerciale coperto da DPA. Il codice resta
  fail-closed e non usa Gemini senza tale attestazione. Verifica effettuata
  dal titolare l'11 settembre 2026: variabile assente.
- [x] Integrare il verbale del backup PostgreSQL con l'esito della verifica
  della documentazione riservata Trust Center su cifratura, ubicazione e
  retention. La creazione materiale del backup è riuscita.
- [ ] Eseguire il restore in un database temporaneo isolato, senza collegarlo al dominio pubblico.
- [ ] Eliminare il database temporaneo dopo aver verificato integrità e leggibilità.
- [x] Sospendere fail-closed l'assistente AI AML finché non sono definiti
  accordo ex art. 28, istruzioni, subresponsabili e presupposto ex art. 10.
- [x] Sospendere fail-closed le nuove Analisi AI finché non sono approvati
  ruolo, base propria per i dati di terzi, artt. 9/10, informativa art. 14,
  DPIA/registro e copertura contrattuale dell'account Anthropic.
- [ ] Attestare nel pannello Northflank che `CASE_AI_ENABLED`,
  `CASE_AI_GDPR_APPROVED`, `AML_AI_ENABLED` e `AML_AI_GDPR_APPROVED` siano
  assenti o diversi da `true`. Il codice richiede entrambi i flag del relativo
  flusso per qualsiasi futura riattivazione.

## Fornitori e accordi ex art. 28 GDPR

Per ogni fornitore conservare PDF o copia datata di contratto, DPA, elenco subprocessori e misure tecniche. Annotare titolare del controllo, data di verifica e rinnovo.

### Northflank

- NDA reciproco sottoscritto il 10 settembre 2026; accesso al Trust Center
  Vanta ottenuto.
- DPA acquisito e verificato su sette dei nove punti della checklist interna.
- SOC 2 Type II verificato senza eccezioni sui controlli testati.
- Penetration test Kaiju Security verificato con rischio `Low` in tutte le
  aree testate.
- La regione applicativa e database verificata è Europe - West (London). Il
  Regno Unito è coperto da decisione di adeguatezza UE rinnovata il 19
  dicembre 2025. La documentazione riservata Trust Center relativa a
  infrastruttura, log, backup e subprocessori è stata esaminata dal titolare.
- Conservare DPA, audit trail NDA, SOC 2 Type II, penetration test ed elenco
  subprocessori nell'archivio riservato.
- Ottenere i valori numerici di RPO e RTO dei backup; richiesta inviata a
  Northflank e risposta in attesa.
- Riferimenti: https://northflank.com/security,
  https://northflank.com/legal/privacy e
  https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
- Evidenza e richiesta predisposta: `PRIV-12-verifica-fornitori-e-trasferimenti.md`
  e `PRIV-14-richiesta-dpa-northflank.md`.

### Anthropic

- Il DPA con SCC è incorporato nei Commercial Terms applicabili all'API
  commerciale; conservarne una copia datata.
- Verificare SCC, subprocessori, misure tecniche e possibilità di zero data retention.
- La documentazione pubblica indica per l'API commerciale cancellazione automatica di input e output entro 30 giorni, salvo eccezioni contrattuali, legali, di sicurezza o servizi con retention diversa.
- I Commercial Terms dichiarano che Anthropic non addestra i modelli sui Customer Content dei servizi commerciali.
- La chiave di produzione è stata identificata dal titolare come
  `carlo-api-key`; restano da registrare organizzazione, account e piano
  commerciale effettivamente associati.
- Riferimenti: https://www.anthropic.com/legal/commercial-terms,
  https://www.anthropic.com/legal/data-processing-addendum e
  https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data

### Google Gemini

- Usare il fallback solo con servizio a pagamento idoneo e DPA applicabile.
- Conservare il Cloud Data Processing Addendum, SCC applicabili ed elenco subprocessori.
- I termini distinguono i servizi gratuiti, nei quali i contenuti possono essere usati per migliorare i prodotti e sottoposti a revisione umana, dai servizi a pagamento, nei quali prompt e risposte non sono usati per migliorare i prodotti.
- Verificare la retention effettiva della configurazione utilizzata; evitare Grounding se non necessario.
- Il progetto è stato identificato come `gen-lang-client-0302865949`,
  numero `926659369623`, livello 1 a pagamento posticipato. Il fallback resta
  disabilitato finché non sono archiviati e verificati Cloud DPA, SCC
  applicabili o altro valido meccanismo e configurazione di conservazione.
- Riferimenti: https://ai.google.dev/gemini-api/terms e https://cloud.google.com/terms/data-processing-addendum

## Registro dei trattamenti e DPIA

- [ ] Approvare formalmente `PRIV-11-registro-trattamenti.md`, indicando finalità, base giuridica, categorie di interessati e dati, destinatari, trasferimenti, retention e misure.
- [ ] Completare `PRIV-10-dpia-analisi-ai.md` includendo AML, dati giudiziari
  ex art. 10, eventuali dati ex art. 9, minori e interessati terzi.
- [ ] Documentare per ogni flusso chi può caricare dati, con quale titolo e con quale informativa agli interessati.
- [ ] Vietare nelle istruzioni operative l'invio di dati non necessari; privilegiare anonimizzazione e pseudonimizzazione.
- [ ] Definire un processo per accesso, rettifica, cancellazione, limitazione e opposizione con verifica dell'identità del richiedente.
- [ ] Riesaminare DPIA e registro almeno annualmente e a ogni variazione di provider, modello, finalità o retention.

## Retention applicativa e condizioni ancora da approvare

| Dato | Conservazione | Controllo |
|---|---:|---|
| Analisi AI storiche già salvate | massimo 30 giorni; nessun nuovo dato accettato durante la sospensione | cancellazione automatica oraria e prova trimestrale |
| File PDF dell'Analisi AI | nessun nuovo file accettato; per le analisi storiche il file non era archiviato direttamente, ma descrizione e output derivati possono conservarne contenuti fino a 30 giorni | test applicativo |
| File e risultati AML | nessun file accettato durante la sospensione; dati manuali soltanto nel browser | test applicativo e verifica log |
| Token analisi | hash nella colonna di verifica; copia recuperabile nel payload cifrato e copia nel browser dell'utente | ispezione database e key management |
| Statistiche interne | totale aggregato nel DB; dettaglio pagina in memoria | revisione codice |
| Diagnostica errori client | dati tecnici minimizzati nei log Northflank e, se configurato, webhook Google Apps Script | retention e DPA da verificare |
| Log infrastrutturali e backup | secondo DPA e documentazione riservata Trust Center; RPO/RTO numerici in attesa | pannello Northflank, DPA e Trust Center |
| Dati presso provider IA | secondo contratto e configurazione commerciale | verifica DPA e account |

## Backup e prova di ripristino

1. Creare un backup cifrato del database prima di migrazioni e almeno settimanalmente.
2. Conservare `DATA_ENCRYPTION_KEY` fuori da Northflank in un gestore di password/secret manager; un backup senza la chiave non è recuperabile.
3. Non inserire chiavi in repository, documenti, screenshot, ticket o chat.
4. Ogni trimestre ripristinare l'ultimo backup in un database temporaneo isolato.
5. Avviare una copia temporanea dell'app con dominio non pubblico e keyring corretto.
6. Verificare conteggi, lettura di un record sintetico, cancellazione e `/api/health`.
7. Registrare esito, durata, RPO/RTO osservati e anomalie; eliminare poi ambiente e copie temporanee.

Il backup manuale precedente al rilascio, la pianificazione giornaliera e il
rinvio motivato della prova di restore sono verbalizzati in
`PRIV-13-verbale-backup-2026-09-09.md`.

## Procedura di risposta agli incidenti

### Rilevazione e contenimento

1. Annotare ora di scoperta, sistemi coinvolti e prima evidenza senza copiare dati personali nei ticket.
2. Sospendere il flusso interessato o mettere l'app in manutenzione se il rischio continua.
3. Revocare subito la credenziale coinvolta: API Anthropic/Gemini, password admin o token Northflank.
4. Non ruotare `DATA_ENCRYPTION_KEY` distruttivamente: aggiungere la vecchia in `DATA_ENCRYPTION_KEY_PREVIOUS`, ricifrare e rimuoverla solo dopo copertura completa.
5. Conservare log e prove in accesso ristretto, mantenendo catena temporale e minimizzazione.

### Valutazione GDPR

1. Stabilire categorie e quantità approssimativa di interessati e dati, inclusi dati giudiziari, identificativi, economici o relativi a minori.
2. Valutare confidenzialità, integrità e disponibilità, conseguenze probabili e misure già applicate.
3. Se vi è una violazione di dati personali, avviare immediatamente il registro dell'incidente e il conteggio delle 72 ore.
4. Se il rischio per i diritti e le libertà non è improbabile, predisporre notifica al Garante entro 72 ore. Se la violazione presenta un rischio elevato, comunicare l'evento agli interessati senza ingiustificato ritardo, salvo una specifica eccezione dell'art. 34, par. 3, GDPR debitamente verificata e documentata.
5. Coinvolgere consulente privacy/DPO per la decisione e documentare anche l'eventuale scelta di non notificare.

### Ripristino e chiusura

1. Ripristinare da backup verificato o distribuire la correzione.
2. Controllare `/api/health`, cifratura, login TOTP, cancellazione e flusso AI con soli dati sintetici.
3. Monitorare recidive e completare una relazione con causa, impatto, tempi, decisioni e azioni preventive.
4. Aggiornare DPIA, registro, istruzioni e formazione interna.

## Calendario minimo

- Ogni settimana: audit dipendenze e test automatici.
- Ogni mese: controllo accessi Northflank, GitHub e provider IA; rimozione utenti o token inutilizzati.
- Ogni trimestre: test backup/restore, cancellazione a 30 giorni, login/TOTP/logout e revisione error log.
- Ogni anno: rotazione programmata delle credenziali, prova completa di incidente, revisione DPIA/DPA/subprocessori.
