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
- Cifratura del backup: non verificata su documentazione contrattuale
- Retention specifica del disk backup manuale: non verificata
- Finalità: punto di recupero precedente al rilascio del commit di hardening
  `d34c61f71ba1ecf54b142d9ae761515656ca3ed6`

## Backup automatico

- Tipo: snapshot
- Frequenza: giornaliera
- Conservazione: 14 giorni
- Stato: configurato nel pannello Northflank il 9 settembre 2026
- Cifratura e ubicazione effettiva: da confermare con Northflank

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

**Non eseguita.** La prova deve avvenire su un add-on temporaneo isolato, mai
sul database di produzione. È rinviata fino all'autorizzazione di eventuali
costi aggiuntivi e alla disponibilità di un metodo di pagamento valido.

Quando sarà autorizzata, registrare:

1. identificativo del backup usato;
2. ora di inizio e fine del ripristino;
3. RPO e RTO osservati;
4. conteggi delle tabelle;
5. esito di `/api/health`;
6. leggibilità di un record sintetico con il keyring corretto;
7. eliminazione dell'ambiente temporaneo.

## Esito

Creazione del backup manuale e pianificazione automatica verificate dal
titolare nel pannello. Cifratura, ubicazione e retention del disk backup
manuale restano da confermare contrattualmente. La capacità effettiva di
ripristino resta da collaudare; fino a quel momento la continuità operativa
non può considerarsi integralmente provata.
