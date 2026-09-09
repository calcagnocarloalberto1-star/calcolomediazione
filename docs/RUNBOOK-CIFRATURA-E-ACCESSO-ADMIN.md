# Runbook cifratura e accesso amministrativo

## Obiettivo

Questo runbook descrive la messa in esercizio delle protezioni applicative per le analisi di mediazione e dell'accesso amministrativo. Le operazioni sui dati esistenti devono essere eseguite solo dopo un backup verificato.

## Variabili segrete

- `DATA_ENCRYPTION_KEY`: chiave casuale di esattamente 32 byte, codificata in Base64 o come 64 caratteri esadecimali, stabile e separata dal database. È obbligatoria in produzione. Se viene persa, i payload cifrati non sono recuperabili. Può essere generata con `openssl rand -base64 32`.
- `DATA_ENCRYPTION_KEY_PREVIOUS`: una o più chiavi precedenti separate da virgola, da mantenere durante una rotazione finché tutti i record non sono stati ricifrati.
- `ADMIN_SECRET`: segreto stabile usato per firmare le sessioni amministrative.
- `ADMIN_PASSWORD`: password amministrativa lunga, unica e conservata in un gestore di password.
- `ADMIN_TOTP_SECRET`: segreto Base32 opzionale. Quando presente, il login richiede anche un codice TOTP a sei cifre.

Le chiavi non devono essere inserite nel repository, nei log, nei ticket o nei documenti condivisi.

## Prima del rilascio

1. Creare e verificare un backup del database PostgreSQL.
2. Configurare `DATA_ENCRYPTION_KEY` e verificare che il servizio la conservi tra riavvii e deploy.
3. Verificare che `ADMIN_SECRET` sia stabile e che `ADMIN_PASSWORD` sia robusta.
4. Configurare `ADMIN_TOTP_SECRET` solo dopo aver registrato il segreto nell'app di autenticazione dell'amministratore.
5. Eseguire `npm run check`, `npm test` e `npm run build`.

## Comportamento dopo il deploy

- Le nuove analisi sono cifrate con AES-256-GCM prima della scrittura nel database.
- Il database conserva soltanto l'hash SHA-256 dei nuovi token di accesso.
- I vecchi token restano validi e vengono trasformati in hash al primo accesso.
- Un aggiornamento di una vecchia analisi la converte automaticamente nel formato cifrato.
- Le analisi mai più aperte né aggiornate restano nel formato precedente fino alla migrazione o alla cancellazione automatica entro 30 giorni.

## Migrazione dei record preesistenti

Dopo il backup, eseguire nell'ambiente che possiede `DATABASE_URL` e `DATA_ENCRYPTION_KEY`:

```bash
CONFIRM_LEGACY_ENCRYPTION=YES npm run security:encrypt-legacy
```

La procedura esegue prima un controllo completo senza scritture, quindi lavora in lotti transazionali da 100 record con timeout sui lock. Decifra e valida anche i payload già presenti, verifica ogni round-trip, cifra o ricifra i contenuti con la chiave attiva, sostituisce le colonne storiche con valori non informativi e converte in hash i token ancora presenti in chiaro. Se il preflight rileva un record non leggibile, nessuna migrazione viene avviata.

Il preflight verifica inoltre che ogni token di recupero cifrato corrisponda al token corrente, sia esso ancora in chiaro o già hashato. Un'incoerenza interrompe la procedura prima di qualsiasi scrub.

## Rotazione della chiave

1. Conservare l'attuale `DATA_ENCRYPTION_KEY` in `DATA_ENCRYPTION_KEY_PREVIOUS`.
2. Impostare una nuova `DATA_ENCRYPTION_KEY`.
3. Verificare che le analisi precedenti siano ancora leggibili.
4. Rieseguire la procedura `security:encrypt-legacy`: i record associati alla chiave precedente vengono ricifrati con la chiave attiva.

Non rimuovere mai una chiave precedente finché esistono payload che riportano il suo identificatore.
All'avvio e nell'health check il servizio confronta gli identificatori delle chiavi presenti nel database con il keyring configurato e rifiuta di dichiararsi pronto se manca una chiave necessaria.

## Rollback applicativo di emergenza

La release precedente non comprende il formato cifrato. Prima di riportare in produzione un binario precedente, ripristinare le colonne legacy e i token con:

```bash
CONFIRM_ENCRYPTION_ROLLBACK=YES npm run security:rollback-encryption
```

Il comando esegue prima un preflight completo e si arresta senza scritture se anche una sola analisi non è decifrabile o non contiene il token di recupero. Il rollback riporta temporaneamente dati e token in chiaro nel database: deve quindi essere usato solo per emergenza, in una finestra di manutenzione, e seguito appena possibile dal ripristino della release sicura e da una nuova migrazione.

## Verifiche periodiche

- Testare login, TOTP, logout e scadenza della sessione.
- Verificare che il cookie amministrativo sia `HttpOnly`, `Secure` e `SameSite=Strict`.
- Creare un'analisi di prova con dati fittizi e controllare direttamente nel database che nomi e descrizione non siano leggibili.
- Verificare la cancellazione anticipata e quella automatica dopo 30 giorni.
- Provare almeno annualmente il ripristino del backup e la disponibilità delle chiavi.
