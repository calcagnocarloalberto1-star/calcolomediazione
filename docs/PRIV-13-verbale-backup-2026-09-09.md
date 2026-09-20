# PRIV-13 — Verbale backup e continuità operativa

Data: 9 settembre 2026

## Sistema

- Piattaforma: Northflank
- Add-on: `calcolomediazione-db`
- Motore: PostgreSQL 18
- Regione: Europe - West (London)
- Rete: privata
- TLS: attivo
- Alta disponibilità: non attiva

## Backup manuale prima del rilascio

- Nome: `pre-release-security-2026-09-09`
- Tipo: disk backup
- Dimensione indicata: 6 GB
- Durata indicata: 2 minuti e 48 secondi
- Ora di creazione indicata: 20:28 CEST
- Esito nel pannello: completato con stato verde
- Esecutore: Carlo Alberto Calcagno, tramite pannello Northflank
- Evidenza: schermata `a50d2724787b448687245e1e470ffb83/image.jpg`,
  acquisita alle 20:32 CEST e conservata nella sessione operativa del
  9 settembre 2026; impronta SHA-256 da registrare nell'archivio riservato
  prima dell'approvazione del verbale. Nessuna credenziale è riportata nel
  repository
- Cifratura, ubicazione e retention: documentazione Trust Center verificata
  dal titolare il 10 settembre 2026 e conservata nell'archivio riservato;
  dettagli contrattuali non riprodotti nel repository pubblico
- Finalità: punto di recupero precedente al rilascio del commit di hardening
  `d34c61f71ba1ecf54b142d9ae761515656ca3ed6`

## Backup automatico

- Tipo: snapshot
- Frequenza: giornaliera
- Conservazione: 14 giorni
- Stato: configurato nel pannello Northflank il 9 settembre 2026
- Cifratura, ubicazione e retention: verificate nella documentazione
  riservata del Trust Center
- RPO/RTO dichiarati da Northflank: valori numerici non ancora ottenuti dal
  fornitore; richiesta in attesa. Per i valori osservati empiricamente in una
  prova di ripristino reale, v. "Prova di ripristino" più avanti in questo
  documento.

## Rilascio successivo al backup

- Commit pubblicato su `main`:
  `d34c61f71ba1ecf54b142d9ae761515656ca3ed6`
- Pipeline GitHub: superata; URL e identificativo dell'esecuzione da annotare
  nell'archivio riservato prima dell'approvazione del verbale
- Health check pubblico: `{"ok":true}`; ora esatta e risposta firmata/non
  alterabile non conservate
- Configurazione admin: TOTP configurato e area disponibile, verificata
  dall'utente il 9 settembre 2026
- Accesso amministrativo con password e TOTP: riuscito, come da schermata
  conservata nella sessione operativa
- Logout e ritorno alla schermata di autenticazione: riuscito, come da
  schermata conservata nella sessione operativa

## Prova di ripristino

**Eseguita il 15 settembre 2026**, su un add-on temporaneo isolato, mai sul
database di produzione, come richiesto sopra.

1. **Identificativo del backup usato:** `15092026-02-15-utc-disk` (backup
   automatico giornaliero di `calcolomediazione-db`, creato alle 04:15 UTC del
   15/09/2026).
2. **Ora di inizio e fine del ripristino:** avviato alle 08:26:05 UTC
   (creazione dell'add-on temporaneo `cm-db-restore-test-20260915` a partire
   dal backup indicato); add-on confermato in stato "Running" (1/1) alle
   08:28:00 UTC.
3. **RPO e RTO osservati:** RTO ≈ 2 minuti (differenza tra le due ore sopra).
   RPO non misurabile direttamente in questa prova, poiché non sono stati
   generati nuovi dati di produzione durante la finestra di backup a fini di
   test; il punto di recupero coincide con l'orario di creazione del backup
   automatico usato (04:15 UTC del 15/09/2026). I valori di RPO/RTO
   *dichiarati* da Northflank restano da ottenere separatamente (v. "Backup
   automatico" sopra).
4. **Conteggi delle tabelle** (verificati tramite un Job Northflank temporaneo
   con accesso alla rete privata dell'add-on, eseguendo query dirette con
   `psql`): `analisi_casi` = 10 righe; `calcoli` = 0 righe; `contatore_visite`
   = 1 riga (id=1, totale=240).
5. **Esito di `/api/health`:** non applicabile in senso letterale, perché per
   costruzione l'applicazione non è stata ripuntata sull'add-on temporaneo
   (che resta isolato dal traffico di produzione, come richiesto). In sua
   sostituzione è stata verificata la connettività e la capacità di eseguire
   query sul database ripristinato (v. punto 4), equivalente applicativo del
   controllo di salute a livello di dati.
6. **Leggibilità di un record sintetico con il keyring corretto:** verificata
   solo parzialmente. È stata controllata l'integrità strutturale del payload
   cifrato di un record reale (`analisi_casi.id = 103`, campo
   `secure_payload` di 86.170 byte), confermando un formato `enc:v1:` ben
   formato con identificativo di chiave, IV, tag di autenticazione e
   ciphertext coerenti — prova che il backup ha preservato i dati cifrati
   byte per byte. **Non è stata invece eseguita la decifratura completa con la
   chiave `DATA_ENCRYPTION_KEY` di produzione**: la sua ubicazione non è stata
   individuata nei punti verificati del pannello Northflank (gruppo di
   secret di progetto, variabili dirette del servizio, sezione Environments)
   e si è scelto di non proseguire la ricerca né di copiarla in un nuovo Job
   temporaneo, per evitare un'esposizione aggiuntiva non necessaria di una
   chiave che protegge dati reali e potenzialmente sensibili (anche di
   minori). L'individuazione della corretta ubicazione di
   `DATA_ENCRYPTION_KEY` è demandata al punto d'audit già aperto sulla
   differenziazione dei segreti Northflank (`ADMIN_PASSWORD`, `ADMIN_SECRET`,
   `DATA_ENCRYPTION_KEY`).
7. **Eliminazione dell'ambiente temporaneo:** completata. Il Job di verifica
   `restore-test-verify` è stato eliminato, quindi l'eliminazione dell'add-on
   `cm-db-restore-test-20260915` è stata avviata alle 08:51:05 UTC.

Costo indicativo della prova: pochi centesimi di euro (add-on con piano di
calcolo minimo, attivo per circa 25 minuti complessivi), autorizzato dal
titolare prima della creazione della risorsa.

## Esito

Creazione del backup manuale e pianificazione automatica verificate dal
titolare nel pannello. DPA, SOC 2 Type II e penetration test sono stati
acquisiti dal Trust Center dopo la sottoscrizione dell'NDA. La prova di
ripristino è stata eseguita il 15 settembre 2026 su un add-on temporaneo
isolato, con esito positivo: il ripristino da backup funziona, RTO ≈ 2
minuti, e l'integrità dei dati (inclusa la struttura del payload cifrato) è
stata verificata. Restano aperti due punti: i valori di RPO/RTO
*dichiarati* da Northflank (v. "Backup automatico") non sono ancora stati
ottenuti dal fornitore, e la decifratura completa di un record con la chiave
di produzione non è stata eseguita in questa prova (v. "Prova di ripristino",
punto 6) — la continuità operativa è quindi provata a livello di
funzionamento del ripristino e di integrità dei dati, ma non ancora
nell'accezione più stretta che includerebbe anche questi due elementi.


## Aggiornamento 20/09/2026 — chiusura del punto "RPO/RTO dichiarati da Northflank"

Il valore RPO/RTO *dichiarato* dal fornitore, citato come punto aperto sopra ("Backup automatico" ed "Esito"), non è mai pervenuto: la richiesta iniziale (9-10/09/2026) è stata seguita da tre solleciti scritti (13/09, 14/09, 15/09/2026 — quest'ultimo con scadenza esplicita al 18/09/2026), rimasti senza riscontro anche dopo la scadenza fissata.

Il 20/09/2026 si è scelto di chiudere il punto su base di autoverifica diretta nel pannello Northflank dell'addon `calcolomediazione-db`, anziché continuare ad attendere:

- **Retention configurata:** 14 giorni (schedule "Daily", visibile in Backup schedules).
- - **Frequenza configurata:** due snapshot al giorno, alle 00:15 e alle 02:15 UTC. Ne segue un RPO nel caso peggiore di circa 22 ore (tra lo snapshot delle 02:15 di un giorno e quello delle 00:15 del giorno successivo) e nel caso migliore di circa 2 ore.
  - - **Configurabilità a livello di progetto/addon:** confermata — la schedule è impostata per singolo addon, non è un valore fisso di piattaforma.
    - - **RTO:** già misurato empiricamente il 15/09/2026 nella prova di ripristino reale sopra descritta (≈ 2 minuti), valore ritenuto più affidabile — perché osservato sul proprio ambiente reale — di un eventuale numero dichiarato genericamente dal fornitore.
     
      - Questi valori sono verificati dal titolare sulla base della configurazione visibile nel proprio pannello e di una prova di ripristino reale, non da una dichiarazione contrattuale o SLA formale di Northflank, che il fornitore non ha mai fornito nonostante tre solleciti. Un'eventuale conferma contrattuale successiva resta utile ma non è più bloccante per la chiusura di questo punto.
      - 
