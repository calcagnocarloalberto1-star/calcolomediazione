# Piano operativo sicurezza, privacy e risposta agli incidenti

Data di aggiornamento: 9 settembre 2026
Ambito: CalcoloMediazione.it, Northflank, PostgreSQL, Anthropic API e Google Gemini API.

Questo documento è una checklist operativa e una bozza organizzativa. Non costituisce certificazione di conformità né sostituisce la valutazione del titolare, del DPO o di un consulente privacy.

## Stato tecnico verificato

- HTTPS, redirect HTTP, header di sicurezza e CSP con nonce sono attivi.
- Le nuove analisi sono protette con AES-256-GCM; i token di accesso sono memorizzati come hash.
- `/api/health` verifica database e disponibilità di tutte le key ID necessarie a decifrare i payload.
- Le analisi sono eliminate automaticamente dopo 30 giorni; gli upload AML sono elaborati in memoria e non sono archiviati come file.
- Login, upload e funzioni IA hanno limiti di frequenza; i file sono limitati per numero e dimensione e verificati anche tramite firma binaria.
- La sessione admin usa un cookie `HttpOnly`, `Secure` e `SameSite=Strict`, dura 30 minuti ed è revocata sul server al logout.
- In produzione il login amministrativo richiede una password di almeno 16 caratteri, un `ADMIN_SECRET` persistente e TOTP. Se una di queste condizioni manca, l'area admin resta sospesa senza interrompere il sito pubblico.
- Le API inutilizzate che registravano e restituivano lo storico dei calcoli sono state rimosse.
- `multer` è aggiornato alla versione 2.3.0; il controllo automatico blocca vulnerabilità di livello alto o critico.

## Attività obbligatorie prima del prossimo rilascio

- [ ] Generare un segreto TOTP Base32 di almeno 160 bit.
- [ ] Registrarlo in un'app di autenticazione su almeno un dispositivo controllato.
- [ ] Conservare il codice/QR di recupero in un gestore di password cifrato.
- [ ] Aggiungere `ADMIN_TOTP_SECRET` ai secret runtime di Northflank.
- [ ] Verificare che `ADMIN_PASSWORD`, `ADMIN_SECRET` e `DATA_ENCRYPTION_KEY` siano differenti, casuali e conservati anche fuori da Northflank.
- [ ] Verificare che `GEMINI_PAID_SERVICE_ACKNOWLEDGED` resti `false` finché non è confermato un servizio commerciale coperto da DPA.
- [ ] Creare un backup PostgreSQL e annotare data, regione, cifratura, retention e responsabile.
- [ ] Eseguire il restore in un database temporaneo isolato, senza collegarlo al dominio pubblico.
- [ ] Eliminare il database temporaneo dopo aver verificato integrità e leggibilità.

## Fornitori e accordi ex art. 28 GDPR

Per ogni fornitore conservare PDF o copia datata di contratto, DPA, elenco subprocessori e misure tecniche. Annotare titolare del controllo, data di verifica e rinnovo.

### Northflank

- Ottenere un DPA che disciplini espressamente Northflank come responsabile per workload, database, log e backup.
- Chiedere regione effettiva di applicazione, database, control plane, log e backup; non presumere che “Europe” significhi SEE.
- Documentare subprocessori, notifiche di variazione, cancellazione alla cessazione, retention dei backup, RPO, RTO e procedura di restore.
- Verificare accesso al Trust Center e documentazione SOC 2 Type 2.
- Riferimenti: https://northflank.com/security e https://northflank.com/legal/privacy

### Anthropic

- Conservare Commercial Terms e DPA applicabili all'account API.
- Verificare SCC, subprocessori, misure tecniche e possibilità di zero data retention.
- La documentazione pubblica indica per l'API commerciale cancellazione automatica di input e output entro 30 giorni, salvo eccezioni contrattuali, legali, di sicurezza o servizi con retention diversa.
- I Commercial Terms dichiarano che Anthropic non addestra i modelli sui Customer Content dei servizi commerciali.
- Riferimenti: https://www.anthropic.com/legal/commercial-terms e https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data

### Google Gemini

- Usare il fallback solo con servizio a pagamento idoneo e DPA applicabile.
- Conservare il Cloud Data Processing Addendum, SCC applicabili ed elenco subprocessori.
- I termini distinguono i servizi gratuiti, nei quali i contenuti possono essere usati per migliorare i prodotti e sottoposti a revisione umana, dai servizi a pagamento, nei quali prompt e risposte non sono usati per migliorare i prodotti.
- Verificare la retention effettiva della configurazione utilizzata; evitare Grounding se non necessario.
- Riferimenti: https://ai.google.dev/gemini-api/terms e https://cloud.google.com/terms/data-processing-addendum

## Registro dei trattamenti e DPIA

- [ ] Approvare formalmente `PRIV-11-registro-trattamenti.md`, indicando finalità, base giuridica, categorie di interessati e dati, destinatari, trasferimenti, retention e misure.
- [ ] Completare `PRIV-10-dpia-analisi-ai.md` includendo AML, dati giudiziari, eventuali dati ex art. 9, minori e interessati terzi.
- [ ] Documentare per ogni flusso chi può caricare dati, con quale titolo e con quale informativa agli interessati.
- [ ] Vietare nelle istruzioni operative l'invio di dati non necessari; privilegiare anonimizzazione e pseudonimizzazione.
- [ ] Definire un processo per accesso, rettifica, cancellazione, limitazione e opposizione con verifica dell'identità del richiedente.
- [ ] Riesaminare DPIA e registro almeno annualmente e a ogni variazione di provider, modello, finalità o retention.

## Retention approvata

| Dato | Conservazione | Controllo |
|---|---:|---|
| Analisi AI salvate | massimo 30 giorni | cancellazione automatica oraria e prova trimestrale |
| File PDF dell'Analisi AI | non archiviati come file; testo nel payload dell'analisi | test applicativo |
| File e risultati AML | elaborazione transitoria; nessun archivio server dell'app | test applicativo e verifica log |
| Token analisi | hash nel database; token originale nel browser dell'utente | ispezione database |
| Statistiche interne | totale aggregato nel DB; dettaglio pagina in memoria | revisione codice |
| Log infrastrutturali e backup | da definire contrattualmente | pannello Northflank e DPA |
| Dati presso provider IA | secondo contratto e configurazione commerciale | verifica DPA e account |

## Backup e prova di ripristino

1. Creare un backup cifrato del database prima di migrazioni e almeno settimanalmente.
2. Conservare `DATA_ENCRYPTION_KEY` fuori da Northflank in un gestore di password/secret manager; un backup senza la chiave non è recuperabile.
3. Non inserire chiavi in repository, documenti, screenshot, ticket o chat.
4. Ogni trimestre ripristinare l'ultimo backup in un database temporaneo isolato.
5. Avviare una copia temporanea dell'app con dominio non pubblico e keyring corretto.
6. Verificare conteggi, lettura di un record sintetico, cancellazione e `/api/health`.
7. Registrare esito, durata, RPO/RTO osservati e anomalie; eliminare poi ambiente e copie temporanee.

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
