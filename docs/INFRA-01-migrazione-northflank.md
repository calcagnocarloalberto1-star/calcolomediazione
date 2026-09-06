# INFRA-01 — Migrazione hosting da Render a Northflank

Bozza operativa. Motivo della migrazione: il piano free di Render include Postgres solo per 30 giorni, poi il database viene eliminato — non è una base affidabile per un servizio in produzione con dati reali degli utenti.

## Cosa faccio io vs. cosa fai tu

Non posso creare l'account Northflank, collegare GitHub via OAuth, né operare sulla tua dashboard/dati di produzione: sono azioni che richiedono le tue credenziali. Preparo qui la configurazione esatta e i passi, tu li esegui sul pannello Northflank.

## 1. Account e collegamento repo

1. Crea un account su northflank.com (piano free "Sandbox": 2 servizi always-on + 1 database + 2 cron job, gratis).
2. Collega il tuo account GitHub e autorizza l'accesso al repo `calcagnocarloalberto1-star/calcolomediazione`.
3. Crea un nuovo progetto, regione **europe-west-frankfurt** (dati in UE, coerente con quanto scritto nel registro trattamenti).

## 2. Servizio web

Crea un servizio "Combined service" (build da repo) con:

- **Repo/branch:** `main`
- **Build:** buildpack automatico (Node.js) oppure Dockerfile se preferisci controllo esplicito — il repo non ha un Dockerfile oggi, il buildpack basta.
- **Build command:** `npm install && npm run build`
- **Start command:** `NODE_ENV=production node dist/index.cjs`
- **Porta:** l'app legge `process.env.PORT`, quindi va bene la porta che Northflank assegna automaticamente — impostala come variabile `PORT` esposta dal servizio (Northflank di solito la inietta da sé).
- **Piano:** free/Sandbox, always-on.

Non ci sono WebSocket né un endpoint di health-check dedicato nel codice: qualsiasi rotta HTTP (es. `/`) va bene come health check.

## 3. Database Postgres

Crea un addon Postgres Northflank (incluso nel piano free), stessa regione del servizio. Copia la connection string generata: andrà nella variabile `DATABASE_URL` del servizio web. Lo schema si crea da solo al primo avvio (`initDb()` in `server/storage.ts`), non serve migrare la struttura — solo i dati esistenti (punto 5).

## 4. Variabili d'ambiente da configurare

Obbligatorie:

- `DATABASE_URL` — connection string del Postgres Northflank
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `ADMIN_PASSWORD` — senza questa il login admin resta disabilitato
- `ADMIN_SECRET` — **impostala esplicitamente** a un valore fisso lungo e casuale. Nota a parte: nel codice attuale, se non è impostata viene rigenerata a caso a ogni riavvio del processo, invalidando tutti i token admin già emessi a ogni deploy. Non è un problema introdotto da questa migrazione, ma è il momento buono per fissarla.
- `NODE_ENV=production`

Opzionali (default già gestiti nel codice se assenti):

- `AI_MAX_PER_HOUR` (default 30)
- `AI_MAX_PER_DAY` (default 150)
- `ERROR_LOG_WEBHOOK_URL` (se vuoi il forwarding errori client)

## 5. Migrazione dei dati esistenti

Se ci sono dati reali su Render Postgres da conservare:

```bash
pg_dump "$RENDER_DATABASE_URL" --no-owner --no-acl -Fc -f dump.pgdump
pg_restore --no-owner --no-acl -d "$NORTHFLANK_DATABASE_URL" dump.pgdump
```

Da eseguire da te (o con mia assistenza sui comandi), non da me direttamente contro il database di produzione: contiene dati personali degli utenti e richiede accesso diretto alle due connection string, che restano tue.

## 6. Verifica prima del cutover

1. Con il nuovo servizio Northflank attivo e collegato al suo Postgres, apri l'URL temporaneo assegnato da Northflank e verifica: calcolo indennità, login admin, un'analisi AI end-to-end.
2. Solo dopo la verifica, sposta il dominio (DNS) da Render a Northflank.
3. Tieni Render attivo qualche giorno come rollback prima di spegnerlo.

## 7. Dopo la migrazione

Aggiornare `docs/PRIV-11-registro-trattamenti.md` (subprocessor: Render → Northflank, regione Frankfurt confermata) solo a migrazione conclusa e verificata — non prima, per non anticipare un fatto non ancora accaduto.
