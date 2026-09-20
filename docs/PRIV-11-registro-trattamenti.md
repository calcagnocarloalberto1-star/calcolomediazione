# PRIV-11 — Registro delle attività di trattamento (art. 30 GDPR) — bozza di lavoro

**Stato: bozza approvata dal titolare il 14/09/2026 con rischio residuo
documentato (v. "Approvazione del titolare" più avanti in questo documento);
sia le nuove Analisi AI sia il flusso AI AML sono oggi attivi, con alcuni
prerequisiti ancora da chiudere.** Il registro ex art. 30 GDPR è un
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

- **Stato del flusso:** attivo dal 14/09/2026 (rischio residuo accettato dal
  titolare, v. "Approvazione del titolare" più avanti in questo documento e
  PRIV-10, "Decisione del titolare"). Le analisi, storiche e nuove, restano
  consultabili, esportabili e cancellabili
  fino alla cancellazione o alla scadenza massima di 30 giorni.
- **Finalità:** analisi giuridica, MAAN/BATNA, controllo bias cognitivi, bozza di accordo e confronto economico assistiti da AI.
- **Categorie di interessati:** le parti della controversia descritta (spesso diverse dall'utente che compila il modulo).
- **Categorie di dati:** titolo, descrizione libera del caso, nomi e ruolo delle parti, valore della lite, documenti opzionali; potenzialmente dati relativi a minori o alla situazione familiare/economica delle parti nei casi di mediazione familiare.
- **Base giuridica e trasparenza:** da definire e approvare — resta un
  prerequisito ancora aperto nonostante l'attivazione del 14/09/2026 (rischio
  residuo accettato dal titolare). La dichiarazione dell'utente non costituisce il consenso dei
  terzi né la base giuridica del professionista/Organismo titolare. Devono
  essere motivati il ruolo, la base ex art. 6 del titolare, gli eventuali
  presupposti ex artt. 9 e 10 e il processo per l'informativa ex art. 14 o una
  specifica eccezione documentata.
- **Destinatari:** Anthropic (Claude); Google (Gemini) soltanto se il fallback
  viene espressamente abilitato dopo la verifica del Paid Service —
  `server/ai/llm.ts`.
- **Trasferimento extra-UE:** possibile verso USA o altri Paesi; garanzia e meccanismo applicabili sono da verificare e documentare sul contratto/DPA del servizio effettivamente usato.
- **Misure di minimizzazione:** redazione preventiva dei nomi delle parti e di alcuni identificatori diretti (email, CF, IBAN, telefono) prima dell'invio ai fornitori, con ripristino solo sui dati mostrati all'utente (`server/ai/redazione.ts`, PRIV-08/PRIV-09). L'avviso immediato chiarisce che la misura è best-effort, richiede la rimozione manuale dei dati non necessari e limita l'invio di dati sanitari, biometrici, giudiziari e identificativi di minori.
- **Termine di conservazione:** fino a 30 giorni dalla creazione, cancellazione automatica indipendente dal traffico (`server/storage.ts`, funzione `eliminaAnalisiScadute`, schedulata in `server/index.ts`).
- **Controllo di accesso:** token casuale; hash nella colonna di verifica;
  copia recuperabile nel payload cifrato AES-256-GCM, oltre alla copia nel
  browser dell'utente; endpoint amministrativo protetto da sessione HMAC.
- **Ruolo di CalcoloMediazione:** il 12 settembre 2026 è stato scelto in via di
  indirizzo il modello professionista/Organismo titolare e CalcoloMediazione
  responsabile ex art. 28. La scelta, registrata in PRIV-18, resta da
  verificare in concreto e rendere operativa mediante accordo e istruzioni: il
  flusso è stato comunque riattivato il 14/09/2026 accettando questo punto
  come rischio residuo (v. "Approvazione del titolare" più avanti in questo
  documento).
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
- **Stato del flusso:** la funzione facoltativa di caricamento documenti con
  bozza automatica è attiva dal 14/09/2026 (rischio residuo accettato dal
  titolare, v. PRIV-10 addendum 14/09/2026); la compilazione manuale locale
  resta sempre disponibile senza invio di documenti.
- **Base giuridica e ruoli:** anche per l'AML PRIV-18 sceglie in via di
  indirizzo il professionista/Organismo titolare e CalcoloMediazione
  responsabile. Il modello deve essere verificato nel caso concreto e reso
  operativo mediante accordo e istruzioni ex art. 28, autorizzazione dei
  subresponsabili e individuazione del presupposto nazionale per l'art. 10;
  fino a quel momento la funzione resta attiva come rischio residuo assunto
  dal titolare, non come trattamento con base giuridica già definita.
- **Destinatari:** Anthropic, per i soli documenti che l'utente sceglie
  volontariamente di caricare tramite questa funzione.
- **Trasferimento extra-UE:** possibile in tal caso; garanzia e meccanismo applicabili sono da verificare e documentare sul contratto/DPA Anthropic.
- **Termine di conservazione:** i documenti caricati non vengono conservati
  lato server (elaborazione stateless per singola richiesta); nessuna copia
  resta oltre la durata della richiesta. I dati inseriti manualmente restano nel browser dell'utente
  (localStorage). Un'eventuale retention lato server, se introdotta in
  futuro, dovrà essere
  definita nell'accordo e nell'informativa.

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

| Flusso | Ruolo di CalcoloMediazione | Responsabili tecnici candidati | Altri destinatari/fornitori da censire | Stato |
|---|---|---|---|---|
| Navigazione e gestione del sito | Titolare | Northflank, se confermato dal DPA | Google Analytics, titolarità/ruolo da verificare | aperto |
| Analisi AI per professionista/Organismo | Indirizzo scelto: responsabile ex art. 28, da verificare nel singolo scenario e rendere operativo con accordo | Northflank e Anthropic | Gemini solo se successivamente abilitato e documentato | attivo dal 14/09/2026, rischio residuo accettato dal titolare; accordo, base del titolare, artt. 9/10 e informativa art. 14 ancora da completare |
| AML per professionista/Organismo | Indirizzo scelto: responsabile ex art. 28, da verificare nel singolo scenario e rendere operativo con accordo | Northflank e Anthropic, soltanto se nominabili come subresponsabili nel rapporto approvato | ulteriori soggetti da censire | attivo dal 14/09/2026, rischio residuo accettato dal titolare; richiede comunque accordo e istruzioni, autorizzazione ai subresponsabili e presupposto art. 10 |
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

## Approvazione del titolare

- Prerequisiti e ruoli chiusi: [ ] — non tutti chiusi; approvato comunque con rischio residuo documentato, coerentemente con la decisione registrata nel DPIA (PRIV-10, sezione "Decisione del titolare").
- Trattamento approvato con rischio residuo documentato: [x]
- Data di approvazione: 14/09/2026
- Nome e ruolo: Carlo Alberto Calcagno, titolare del trattamento
- Firma o riferimento alla decisione conservata: vedi Motivazione e firma nel DPIA (PRIV-10)
- Data del prossimo riesame: entro 3 mesi, o prima se si verifica uno di questi eventi: risposta di Northflank su RPO/RTO, esecuzione della prova di restore, chiusura dell'issue #80 (verifica DPA Anthropic), o sottoscrizione dell'accordo ex art. 28 (PRIV-16)

### Nota sul rischio residuo accettato (14/09/2026)

Il titolare ha deciso di rendere operativi i flussi AI (Analisi AI del Caso e AML AI) accettando come rischio residuo documentato i seguenti prerequisiti ancora aperti alla data di approvazione:

1. Risposta di Northflank sui valori RPO/RTO e sulla configurabilita' a livello di progetto (richiesta il 9-10/09/2026, sollecitata il 13/09/2026, non ancora ricevuta).
2. Prova interna di ripristino da backup (mai eseguita).
3. Verifica formale del DPA Anthropic con SCC incorporato (issue #80, ancora aperta).
4. Accordo ex art. 28 con i subresponsabili (Northflank, Anthropic) e con il professionista/Organismo titolare per Analisi AI e AML (bozza non sottoscritta, campi controparte in bianco — PRIV-16).

Questi punti restano da chiudere progressivamente; la presente approvazione non li considera risolti, ma li accetta come rischio assunto dal titolare per rendere operativo il servizio.

Il 14/09/2026, con lo stesso criterio, il titolare ha inoltre riattivato la
funzione facoltativa di caricamento documenti con bozza automatica sulla
pagina Antiriciclaggio, accettando un quinto punto di rischio residuo:

5. Presupposto ex artt. 9 e 10 GDPR non ancora definito per l'eventuale
   trattamento, tramite questa funzione, di categorie particolari di dati o di
   dati relativi a condanne penali e reati riferiti alle parti (v. PRIV-10,
   addendum 14/09/2026).


### Addendum 20/09/2026 - chiusura autonoma dei punti 1 e 2 della Nota sul rischio residuo (14/09/2026)

Dei quattro prerequisiti elencati nella "Nota sul rischio residuo accettato" sopra, i primi due risultano oggi chiusi. Il dettaglio tecnico completo e' in `PRIV-10` (addendum 20/09/2026) e in `PRIV-13`; qui si riporta solo l'esito:

1. **Northflank - valori RPO/RTO.** Dopo tre solleciti scritti (13/09, 14/09, 15/09/2026, quest'ultimo con scadenza esplicita al 18/09/2026) senza risposta del fornitore oltre la scadenza, il punto e' stato chiuso il 20/09/2026 su base di autoverifica diretta nel pannello Northflank: retention 14 giorni, due snapshot al giorno (00:15 e 02:15 UTC), configurabilita' per addon confermata, RTO circa 2 minuti gia' misurato empiricamente il 15/09/2026.
2. 2. **Prova interna di ripristino da backup.** Eseguita il 15/09/2026 (non piu' "mai eseguita" come indicato sopra alla data del 14/09/2026), con esito positivo - v. `PRIV-13`.
  
   3. Restano aperti, invariati, i punti 3 (DPA Anthropic, issue #80) e 4 (accordo ex art. 28, `PRIV-16`).
   4. 
