# PRIV-19 — Nota di sintesi per la decisione sull'attivazione dell'accordo art. 28 online

Data: 9 ottobre 2026
Stato: nota istruttoria per il titolare. Il 9 ottobre 2026 il titolare ha scelto l'alternativa C (verbale PRIV-21); l'attivazione resta da autorizzare. La decisione
e la sua motivazione vanno registrate in un verbale separato (come PRIV-18).

## 1. Che cosa si decide

Oggi il sito accetta in pratica soltanto casi fittizi: la dichiarazione «accordo
in essere» viene respinta dal server perché `ACCORDO_ART28_APPROVATO = false`
(`shared/accordo-art28.ts`). Portare il flag a `true` (con versione del testo
aggiornata) consente a professionisti e organismi di accettare online l'accordo e
di usare l'Analisi AI con dati di pratiche reali di terzi, con CalcoloMediazione
responsabile del trattamento e Anthropic e Northflank subresponsabili (PRIV-16).

È il passaggio che aumenta davvero l'esposizione: dai dati di prova ai dati
personali di terzi. Resta reversibile (basta riportare il flag a `false`), ma i
dati già trattati nel frattempo non si «ritirano».

## 2. Che cosa è già chiuso

- DPA Anthropic: copia datata (SHA-256 in PRIV-12), incorporato nei Commercial
  Terms, SCC 2021/914 Moduli 2 e 3, notifica violazioni 48 ore, cancellazione
  entro 30 giorni, obiezione ai subresponsabili 15 giorni.
- Console Anthropic: conservazione a 30 giorni, nessuna adesione al programma di
  condivisione dei dati per l'addestramento; dati dell'organizzazione coerenti
  con quelli del responsabile.
- Conferma del supporto Anthropic in chat: applicabilità del DPA all'organizzazione
  e impegno a non addestrare sui contenuti.
- Ricevuta dell'11 aprile 2026 di Anthropic Ireland Limited: riscontro indiretto
  dell'uso commerciale e dell'entità contraente.
- DPA Northflank a adesione verificato punto per punto il 7 ottobre; SOC 2 Type II;
  test di intrusione; NDA firmato il 10 settembre; backup autoverificati
  (RPO ~22 ore, RTO ~2 minuti).
- Hosting a Londra: decisione di adeguatezza UK in vigore fino al 27 dicembre 2031.
- Dichiarazione preliminare e verifica server; presidi minori implementati e minori
  esclusi dai flussi (percorso disattivato).

## 3. Che cosa resta aperto e che peso ha

| # | Punto aperto | Che cosa manca | Rischio se si attiva ora | Peso |
|---|--------------|----------------|--------------------------|------|
| 1 | Data di accettazione dei Commercial Terms Anthropic | Prova documentale della data; copia controfirmata (operatore umano, ID 215476307755517) | Solo probatorio: il contratto c'è (uso a pagamento dall'11 aprile, conferma del supporto), ma non lo si può datare né mostrare firmato in caso di controllo (art. 5, par. 2, GDPR) | Medio-basso |
| 2 | Subresponsabili Anthropic per l'API | L'elenco pubblico di 20 voci riguarda l'intero servizio; non dice chi tratta i contenuti dell'API (USA, Sudafrica, Canada) | Il professionista riceve un elenco più ampio del reale; obbligo di trasparenza verso di lui | Medio-basso |
| 3 | Applicabilità del DPA Northflank all'account | Conferma scritta (richiesta inviata il 9 ottobre) | DPA a adesione senza controfirma: si presume applicabile, ma non provato | Medio-basso |
| 4 | Meccanismo di trasferimento verso gli USA per i subresponsabili Northflank | Indicazione delle SCC o del Data Privacy Framework (stessa richiesta) | Trasferimenti senza base dichiarata per i subresponsabili statunitensi | Medio |
| 5 | Luoghi di log e backup nativi | Indicazione scritta (stessa richiesta) | Log e backup potrebbero stare fuori dal Regno Unito; la DPIA dice solo Londra | Basso-medio |
| 6 | Testo e campi dell'accordo | Codice fiscale del responsabile; giorni e Allegati A–C; approvazione finale e nuova versione del testo | Accettazioni su testo incompleto o non approvato | Bloccante tecnico, non di rischio |
| 7 | Assistente AI antiriciclaggio | Presupposto ex art. 10 GDPR per dati relativi a condanne o reati non definito (PRIV-10) | Estendere l'accordo a questo flusso con dati reali aggrava un rischio già accettato soltanto per i casi di prova | Medio-alto, se incluso |
| 8 | Informativa alle parti | Dipende dal professionista (titolare): il testo dell'accordo deve richiamarlo e il sito avvertirlo | Il professionista carica dati senza aver informato le parti | Medio, mitigabile con testo |
| 9 | DPIA e registro | Aggiornare ruoli e flusso (titolare = professionista, CalcoloMediazione = responsabile) prima dell'attivazione | Documenti non allineati alla configurazione effettiva | Basso, da fare |

## 4. Alternative

**A. Attivare ora, con rischio residuo accettato.** Come già fatto il 14 settembre.
Pro: i punti 1–5 sono in larga parte probatori e già in corso di sollecito. Contro:
si estende l'uso a dati reali di terzi senza chiudere i punti 4 e 7.

**B. Attivare quando arriva la risposta di Anthropic (punto 1), con Analisi AI
soltanto.** I punti 3–5 restano aperti, ma sono residui accettati e dichiarati;
l'antiriciclaggio AI resta fuori dall'Allegato A finché il punto 7 non è risolto.
Pro: la parte più pesante sul piano probatorio è chiusa; rischio contenuto. Contro:
dipende da tempi di Anthropic non nostri.

**C. Attivare al più tardi a una data fissata, con o senza la risposta (con Analisi
AI soltanto).** Come B, ma con un limite di tempo; se la risposta non arriva, il
verbale registra che la prova della data non esiste e che il rischio è assunto.
Pro: non resta sospeso a tempo indeterminato. Contro: parte con il punto 1 aperto.

**D. Non attivare finché 1, 3, 4 e 5 non sono tutti chiusi.** Massima prudenza;
tempi lunghi e fuori dal nostro controllo (Northflank ha già risposto con ritardo
e non negozia).

## 5. Indicazione di lavoro (non una decisione)

La mia indicazione è **C**: attivazione limitata all'Analisi AI, con l'assistente
antiriciclaggio escluso dall'Allegato A finché non è risolto l'art. 10 GDPR, in una
data fissata da te (ad esempio dopo il termine di risposta di una settimana a
Northflank), con verbale che documenti i punti 1–5 come residui accettati e con
riesame al ricevimento delle risposte. La valutazione giuridica finale resta tua,
come titolare e come avvocato.

## 6. Prima di portare il flag a `true`

1. Compilare codice fiscale del responsabile, giorni e Allegati A–C; rileggere il testo.
2. Aggiornare la versione dell'accordo in `shared/accordo-art28.ts`.
3. Verificare che l'Allegato A non includa l'antiriciclaggio AI (se si sceglie B o C).
4. Aggiornare DPIA (PRIV-10) e registro (PRIV-11) con i nuovi ruoli.
5. Registrare la decisione in un verbale datato.
6. Prova end to end con un'accettazione di prova e una dichiarazione «accordo in essere».
