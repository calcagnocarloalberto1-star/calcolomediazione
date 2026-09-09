# INFRA-01 — Esercizio in sicurezza su Northflank

Configurazione operativa del servizio e del database Northflank per CalcoloMediazione.

## Cosa faccio io vs. cosa fai tu

Le chiavi e le credenziali devono essere configurate direttamente come segreti runtime nel pannello Northflank. Non devono essere copiate nel repository, nei log, nei ticket o in chat.

## 1. Account e collegamento repo

1. Crea un account su northflank.com (piano free "Sandbox": 2 servizi always-on + 1 database + 2 cron job, gratis).
2. Collega il tuo account GitHub e autorizza l'accesso al repo `calcagnocarloalberto1-star/calcolomediazione`.
3. Crea un nuovo progetto nella regione scelta e annotala nel registro dei trattamenti. **Londra è nel Regno Unito, non nell'Unione europea**: se il workload o il database sono a Londra, documentare il trasferimento e il relativo meccanismo; se è disponibile una regione SEE idonea, preferirla.

## 2. Servizio web

Crea un servizio "Combined service" (build da repo) con:

- **Repo/branch:** `main`
- **Build:** Dockerfile presente nella radice del repository.
- **Build command:** `npm install && npm run build`
- **Start command:** `NODE_ENV=production node dist/index.cjs`
- **Porta:** l'app legge `process.env.PORT`, quindi va bene la porta che Northflank assegna automaticamente — impostala come variabile `PORT` esposta dal servizio (Northflank di solito la inietta da sé).
- **Piano:** free/Sandbox, always-on.

Configurare una **readiness probe HTTP** sulla porta applicativa e sul percorso `/api/health`. L'endpoint verifica la connessione al database e che tutte le chiavi richieste dai payload cifrati siano disponibili. Il Dockerfile contiene anche un health check equivalente.

## 3. Database Postgres

Crea un addon Postgres Northflank (incluso nel piano free), stessa regione del servizio. Copia la connection string generata: andrà nella variabile `DATABASE_URL` del servizio web. Lo schema si crea da solo al primo avvio (`initDb()` in `server/storage.ts`), non serve migrare la struttura — solo i dati esistenti (punto 5).

## 4. Variabili d'ambiente da configurare

Obbligatorie:

- `DATABASE_URL` — connection string del Postgres Northflank
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY` — opzionale; configurare solo per il fallback commerciale descritto sotto.
- `ADMIN_PASSWORD` — senza questa il login admin resta disabilitato
- `ADMIN_SECRET` — valore fisso lungo e casuale, conservato anche fuori da Northflank in un gestore di segreti.
- `ADMIN_TOTP_SECRET` — Base32 di almeno 160 bit, registrato nell'app di autenticazione prima del deploy. In produzione l'area admin resta sospesa se manca.
- `DATA_ENCRYPTION_KEY` — chiave casuale di esattamente 32 byte, codificata in Base64 canonico o come 64 caratteri esadecimali. Generarla fuori dal repository con `openssl rand -base64 32` e conservarne una copia protetta fuori da Northflank.
- `NODE_ENV=production`

Opzionali (default già gestiti nel codice se assenti):

- `AI_MAX_PER_HOUR` (default 30)
- `AI_MAX_PER_DAY` (default 150)
- `ERROR_LOG_WEBHOOK_URL` (se vuoi il forwarding errori client)
- `DATA_ENCRYPTION_KEY_PREVIOUS` (solo durante una rotazione, con eventuali chiavi precedenti separate da virgola)
- `GEMINI_PAID_SERVICE_ACKNOWLEDGED=true` (solo dopo aver verificato piano commerciale e DPA applicabili; in mancanza, omettere o lasciare `false`)

## 5. Backup e protezione dei dati esistenti

Prima della migrazione creare e verificare un backup del database Northflank. Dopo il deploy della release sicura, ma prima di eseguire lo scrub delle colonne legacy, avviare come job una tantum con gli stessi segreti runtime:

```bash
CONFIRM_LEGACY_ENCRYPTION=YES npm run security:encrypt-legacy
```

La procedura esegue un preflight senza scritture, controlla cifratura e token di recupero, quindi lavora in lotti transazionali. Non eseguirla prima di aver verificato la nuova release e il backup.

## 6. Verifica prima del cutover

1. Verificare che il build corrisponda al commit atteso e che la readiness probe `/api/health` passi.
2. Verificare home, calcolo indennità, preferenze cookie, login e logout amministrativi.
3. Eseguire un'analisi end-to-end soltanto con dati completamente fittizi.
4. Verificare direttamente nel database che il nuovo record contenga `secure_payload`, che le colonne sensibili storiche siano vuote e che `access_token` contenga soltanto un hash.
5. Solo dopo backup e verifiche, eseguire il job di migrazione dei record esistenti.

## 7. Dopo la migrazione

- Conservare le chiavi in un gestore separato e provare periodicamente il ripristino.
- Non rimuovere una chiave precedente finché l'health check o il job di rotazione segnala payload associati al relativo key ID.
- Per un rollback alla release precedente, eseguire prima `CONFIRM_ENCRYPTION_ROLLBACK=YES npm run security:rollback-encryption` in manutenzione.
