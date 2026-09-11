# PRIV-11 — Registro delle attività di trattamento (art. 30 GDPR) — bozza di lavoro

**Stato: bozza da approvare dal titolare; sia le nuove Analisi AI sia il flusso
AI AML restano sospesi.** Il registro ex art. 30 GDPR è un
documento organizzativo che il titolare tiene e aggiorna; questa bozza ne
ricalca la struttura minima e va integrata con gli elementi che il codice da
solo non può attestare (contratti firmati, ruoli organizzativi, eventuale
nomina di un DPO).

## Titolare del trattamento

Carlo Alberto Calcagno, titolare di CalcoloMediazione.it (dato dichiarato in
`client/src/pages/PrivacyPolicy.tsx`, Sezione 1).

- Recapito email pubblicato: `calcagnocarloalberto1@gmail.com`
- Pagina per le richieste privacy: `https://calcolomediazione.it/contatti`
- Sede o domicilio professionale: da integrare nel registro conservato dal
  titolare, senza ricavarlo o presumere dati dal codice.

## Responsabile della protezione dei dati (DPO)

Da stabilire: verificare se le condizioni dell'art. 37 GDPR (trattamento su
larga scala di categorie particolari di dati come attività principale, tra
gli altri criteri) impongano la nomina di un DPO. Non risulta un DPO nominato
nella documentazione del sito.

## Attività di trattamento

### 1. Navigazione del sito

- **Finalità:** funzionamento del sito, statistiche aggregate.
- **Categorie di interessati:** visitatori del sito.
- **Categorie di dati:** percorso visitato e conteggi aggregati. L'applicazione
  non memorizza IP o user-agent nel contatore first-party; eventuali log
  infrastrutturali Northflank restano da verificare contrattualmente.
- **Base giuridica:** legittimo interesse (dati tecnici); consenso (Google Analytics, dopo il banner cookie).
- **Destinatari:** Google Analytics (solo dopo consenso —
  `client/src/components/CookieConsent.tsx`,
  `client/public/ga-bootstrap.js`).
- **Trasferimento extra-UE:** sì, verso Google (USA) se l'utente accetta i cookie analitici.
- **Termine di conservazione:** conteggio totale aggregato nel database;
  dettaglio per pagina solo in memoria applicativa; Google Analytics
  normalmente fino a due anni secondo la configurazione dichiarata nella
  Cookie Policy, da verificare nel pannello Analytics.
- **Misure di sicurezza:** HSTS, CSP applicata con nonce, GA bloccato di
  default e caricato solo dopo consenso.

### 2. Calcolatori deterministici (indennità, confronto costi, costi notarili, credito d'imposta, calcolo assegni)

- **Finalità:** fornire stime orientative dei costi/indennità di mediazione.
- **Categorie di interessati:** utenti del sito (avvocati, mediatori, cittadini).
- **Categorie di dati:** valori economici inseriti, tipologia di procedura; nessun dato identificativo richiesto dai calcolatori base.
- **Base giuridica:** esecuzione di una richiesta dell'utente (assimilabile a un contratto/servizio richiesto).
- **Destinatari:** nessuno (elaborazione lato client o server senza invio a terzi).
- **Trasferimento extra-UE:** nessuno.
- **Termine di conservazione:** non conservati in modo permanente (dichiarato in privacy policy).

### 3. Analisi AI del Caso

- **Stato del flusso:** nuove analisi, upload e chat sospesi lato interfaccia e
  server. Le analisi storiche restano consultabili, esportabili e cancellabili
  fino alla cancellazione o alla scadenza massima di 30 giorni.
- **Finalità futura proposta:** analisi giuridica, MAAN/BATNA, controllo bias cognitivi, bozza di accordo e confronto economico assistiti da AI.
- **Categorie di interessati:** le parti della controversia descritta (spesso diverse dall'utente che compila il modulo).
- **Categorie di dati:** titolo, descrizione libera del caso, nomi e ruolo delle parti, valore della lite, documenti opzionali; potenzialmente dati relativi a minori o alla situazione familiare/economica delle parti nei casi di mediazione familiare.
- **Base giuridica e trasparenza:** da definire e approvare prima della
  riattivazione. La dichiarazione dell'utente non costituisce il consenso dei
  terzi né la base propria di CalcoloMediazione. Devono essere motivati il
  ruolo, la base ex art. 6, gli eventuali presupposti ex artt. 9 e 10 e il
  processo per l'informativa ex art. 14 o una specifica eccezione documentata.
- **Destinatari in caso di futura riattivazione:** Anthropic (Claude); Google (Gemini) soltanto se il fallback
  viene espressamente abilitato dopo la verifica del Paid Service —
  `server/ai/llm.ts`.
- **Trasferimento extra-UE:** possibile verso USA o altri Paesi; garanzia e meccanismo applicabili sono da verificare e documentare sul contratto/DPA del servizio effettivamente usato.
- **Misure di minimizzazione:** redazione preventiva dei nomi delle parti e di alcuni identificatori diretti (email, CF, IBAN, telefono) prima dell'invio ai fornitori, con ripristino solo sui dati mostrati all'utente (`server/ai/redazione.ts`, PRIV-08/PRIV-09). L'avviso immediato chiarisce che la misura è best-effort, richiede la rimozione manuale dei dati non necessari e limita l'invio di dati sanitari, biometrici, giudiziari e identificativi di minori.
- **Termine di conservazione:** fino a 30 giorni dalla creazione, cancellazione automatica indipendente dal traffico (`server/storage.ts`, funzione `eliminaAnalisiScadute`, schedulata in `server/index.ts`).
- **Controllo di accesso:** token casuale; hash nella colonna di verifica;
  copia recuperabile nel payload cifrato AES-256-GCM, oltre alla copia nel
  browser dell'utente; endpoint amministrativo protetto da sessione HMAC.
- **Ruolo di CalcoloMediazione:** da definire e approvare prima della
  riattivazione con riferimento ai dati di terzi e al rapporto con il
  professionista che utilizza il servizio.
- **Misure di sicurezza:** vedi sopra; DPA Anthropic incorporato nei
  Commercial Terms da archiviare per l'account effettivo. Gemini resta
  disabilitato fino alla verifica e archiviazione di Cloud DPA, SCC o altro
  valido meccanismo, configurazione e account.

### 4. Antiriciclaggio — compilazione assistita e modalità alta precisione (AI)

- **Finalità:** supporto alla compilazione degli obblighi antiriciclaggio del mediatore/Organismo (D.Lgs. 231/2007).
- **Categorie di interessati:** le parti della procedura di mediazione, i loro titolari effettivi.
- **Categorie di dati:** documenti d'identità, dati anagrafici, informazioni
  sul rischio e dichiarazioni; possibili categorie particolari ex art. 9 e
  dati su condanne o reati, disciplinati separatamente dall'art. 10 GDPR.
- **Stato del flusso:** sospeso lato interfaccia e lato server; nessun
  documento deve essere trasmesso.
- **Base giuridica e ruoli per un'eventuale riattivazione:** qualificazione da
  determinare e approvare prima della riattivazione. Se CalcoloMediazione sarà
  qualificata come responsabile, serviranno accordo e istruzioni ex art. 28,
  autorizzazione dei subresponsabili e individuazione del presupposto nazionale
  per l'art. 10; se sarà titolare autonomo o contitolare, dovranno essere
  documentati i conseguenti obblighi.
- **Destinatari in caso di futura riattivazione:** Anthropic, soltanto dopo
  la chiusura dei prerequisiti indicati; allo stato nessun documento è
  accettato dagli endpoint AML.
- **Trasferimento extra-UE:** possibile in tal caso; garanzia e meccanismo applicabili sono da verificare e documentare sul contratto/DPA Anthropic.
- **Termine di conservazione:** finché il flusso resta sospeso nessun file è
  accettato. I dati inseriti manualmente restano nel browser dell'utente
  (localStorage). Un'eventuale futura retention del flusso AI dovrà essere
  definita nell'accordo e nell'informativa prima della riattivazione.

### 5. Database giurisprudenza

- **Finalità:** informazione e consultazione di massime e riferimenti su
  provvedimenti in materia di mediazione.
- **Categorie di dati e interessati:** metadati, massime e possibili
  informazioni relative alle parti o ad altri soggetti citati nelle fonti.
- **Fonti:** fonti istituzionali e siti giuridici indicati per ciascuna scheda;
  provenienza, affidabilità e diritti di riuso devono essere verificati.
- **Base giuridica:** da definire e documentare; la pubblicità del
  provvedimento non rende automaticamente ogni dato liberamente
  indicizzabile o riutilizzabile.
- **Misure richieste:** preferire massime prive di nominativi, verificare
  anonimizzazione, rimuovere dati non necessari, stabilire riesame e
  cancellazione/rettifica.
- **Termine di conservazione:** da definire per categoria di contenuto e fonte;
  fino alla decisione, riesame almeno annuale e rimozione tempestiva in caso di
  dati non necessari, inesatti o non legittimamente riutilizzabili.
- **Misure di sicurezza:** accesso in sola lettura dal sito pubblico, controllo
  editoriale delle fonti e delle modifiche nel repository; anonimizzazione e
  minimizzazione da documentare per ciascuna scheda.

### 6. Corrispondenza email

- **Finalità:** rispondere alle richieste inviate all'indirizzo email
  pubblicato sul sito; non è presente un modulo di contatto applicativo.
- **Categorie di dati:** nome, email, contenuto del messaggio.
- **Base giuridica:** esecuzione di una richiesta dell'interessato.
- **Termine di conservazione:** il tempo necessario a evadere la richiesta.

### 7. Diagnostica degli errori client

- **Finalità:** sicurezza, disponibilità e correzione degli errori tecnici.
- **Interessati:** visitatori che incontrano un errore JavaScript.
- **Dati:** timestamp, identificatore casuale di sessione per scheda, route
  senza query, messaggio e stack, sorgente, riga/colonna, dimensioni viewport,
  classe mobile/desktop, componente, severità e build.
- **Base giuridica proposta:** legittimo interesse alla sicurezza e
  affidabilità, soggetto a LIA e informativa.
- **Destinatari:** log infrastrutturali Northflank; Google Apps Script/Sheets
  soltanto se `ERROR_LOG_WEBHOOK_URL` è configurato.
- **Minimizzazione:** redazione di email, codici fiscali e token; eliminazione
  query dalla route; user-agent ridotto a mobile/desktop; limiti di frequenza.
- **Retention, Paesi e DPA:** da verificare prima dell'approvazione del
  registro. Se non documentabili, disattivare il webhook.

## Matrice preliminare dei ruoli

| Flusso | Ruolo di CalcoloMediazione da definire | Responsabili tecnici candidati | Altri destinatari/fornitori da censire | Stato |
|---|---|---|---|---|
| Navigazione e gestione del sito | Titolare | Northflank, se confermato dal DPA | Google Analytics, titolarità/ruolo da verificare | aperto |
| Analisi AI offerta direttamente dal sito | Da definire e approvare per i dati di terzi | Northflank e Anthropic | Gemini solo se successivamente abilitato e documentato | sospeso; base propria, artt. 9/10 e informativa art. 14 da definire |
| AML per professionista/Organismo | Da definire; ipotesi di responsabile soltanto dopo qualificazione e accordo ex art. 28 | Northflank e Anthropic, soltanto se nominabili come subresponsabili nel rapporto approvato | ulteriori soggetti da censire | sospeso; richiede decisione sul ruolo, accordo e istruzioni se applicabili, autorizzazione ai subresponsabili e presupposto art. 10 |
| Diagnostica del sito | Titolare | Northflank, se confermato dal DPA | Google Apps Script/Sheets soltanto se configurato; ruolo da verificare | aperto |

Se CalcoloMediazione opera come responsabile per l'AML, predisporre anche il
registro delle categorie di attività svolte per conto dei titolari ex art.
30, § 2 GDPR.

## Fornitori tecnici e qualificazione privacy da confermare

| Fornitore | Servizio tecnico | Dati coinvolti | Extra-UE | Qualificazione e DPA |
|---|---|---|---|---|
| Anthropic | Elaborazione AI (Analisi del Caso, antiriciclaggio alta precisione) | Testo del caso, documenti | Sì (USA) | Ruolo da confermare per ciascun flusso; DPA con SCC incorporato nei Commercial Terms dell'API, copia datata da archiviare |
| Google (Gemini API) | Elaborazione AI in fallback, disabilitato salvo attestazione Paid Service | Testo del caso | Sì, possibile trattamento globale | Ruolo da confermare; Cloud DPA applicabile ai Paid Services, account e fatturazione da verificare prima dell'attivazione |
| Google Analytics | Statistiche di navigazione | Dati di navigazione, solo dopo consenso | Sì (USA) | Ruolo e DPA da verificare |
| Hosting (Northflank) | Hosting applicativo e database | Tutti i dati del sito | Europe - West (London), Regno Unito; decisione di adeguatezza UE vigente | Responsabile; DPA acquisito e verificato su sette dei nove punti della checklist interna; verifiche puntuali ancora aperte in PRIV-12/13 |

## Note per il completamento

Questa versione copre il codice e le evidenze fornitore raccolte in
  `PRIV-12-verifica-fornitori-e-trasferimenti.md`. Le evidenze Northflank
  riservate sono state esaminate nei limiti documentati; restano aperti i
  valori RPO/RTO e la prova interna di restore. Restano inoltre da aggiungere,
  a cura del titolare, la verifica dell'organizzazione commerciale Anthropic e gli eventuali ulteriori
trattamenti che avvengono fuori dal codice del sito (es. corrispondenza email
diretta con gli utenti).

Per ciascuna attività devono inoltre essere confermati e mantenuti aggiornati
i dati di contatto del titolare e dell'eventuale DPO, le categorie di
destinatari, i trasferimenti e le relative garanzie, i termini di
cancellazione e una descrizione generale delle misure tecniche e
organizzative. Se CalcoloMediazione agisce come responsabile, il registro
separato ex art. 30, § 2 deve riportare anche i titolari per conto dei quali
opera e i dati di contatto degli eventuali DPO e rappresentanti.

## Approvazione futura del titolare

- Prerequisiti e ruoli chiusi: [ ]
- Data di approvazione: ____________________
- Nome e ruolo: Carlo Alberto Calcagno, titolare del trattamento
- Firma o riferimento alla decisione conservata: ____________________
- Data del prossimo riesame: ____________________
