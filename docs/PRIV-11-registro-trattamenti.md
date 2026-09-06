# PRIV-11 — Registro delle attività di trattamento (art. 30 GDPR) — bozza di lavoro

**Stato: bozza compilata dai fatti tecnici osservabili nel codice, da
rivedere e completare a cura del titolare.** Il registro ex art. 30 GDPR è un
documento organizzativo che il titolare tiene e aggiorna; questa bozza ne
ricalca la struttura minima e va integrata con gli elementi che il codice da
solo non può attestare (contratti firmati, ruoli organizzativi, eventuale
nomina di un DPO).

## Titolare del trattamento

Carlo Alberto Calcagno, titolare di CalcoloMediazione.it (dato dichiarato in
`client/src/pages/PrivacyPolicy.tsx`, Sezione 1).

## Responsabile della protezione dei dati (DPO)

Da stabilire: verificare se le condizioni dell'art. 37 GDPR (trattamento su
larga scala di categorie particolari di dati come attività principale, tra
gli altri criteri) impongano la nomina di un DPO. Non risulta un DPO nominato
nella documentazione del sito.

## Attività di trattamento

### 1. Navigazione del sito

- **Finalità:** funzionamento del sito, statistiche aggregate.
- **Categorie di interessati:** visitatori del sito.
- **Categorie di dati:** indirizzo IP, tipo di browser, pagine visitate, orario di accesso.
- **Base giuridica:** legittimo interesse (dati tecnici); consenso (Google Analytics, dopo il banner cookie).
- **Destinatari:** Google Analytics (solo dopo consenso — `client/src/components/CookieConsent.tsx`, `client/ga-bootstrap.js`).
- **Trasferimento extra-UE:** sì, verso Google (USA) se l'utente accetta i cookie analitici.
- **Termine di conservazione:** fino a 12 mesi (dichiarato in privacy policy).
- **Misure di sicurezza:** HSTS, CSP in modalità report-only, GA bloccato di default (opt-in).

### 2. Calcolatori deterministici (indennità, confronto costi, costi notarili, credito d'imposta, calcolo assegni)

- **Finalità:** fornire stime orientative dei costi/indennità di mediazione.
- **Categorie di interessati:** utenti del sito (avvocati, mediatori, cittadini).
- **Categorie di dati:** valori economici inseriti, tipologia di procedura; nessun dato identificativo richiesto dai calcolatori base.
- **Base giuridica:** esecuzione di una richiesta dell'utente (assimilabile a un contratto/servizio richiesto).
- **Destinatari:** nessuno (elaborazione lato client o server senza invio a terzi).
- **Trasferimento extra-UE:** nessuno.
- **Termine di conservazione:** non conservati in modo permanente (dichiarato in privacy policy).

### 3. Analisi AI del Caso

- **Finalità:** analisi giuridica, MAAN/BATNA, controllo bias cognitivi, bozza di accordo, confronto economico assistiti da AI.
- **Categorie di interessati:** le parti della controversia descritta (spesso diverse dall'utente che compila il modulo).
- **Categorie di dati:** titolo, descrizione libera del caso, nomi e ruolo delle parti, valore della lite, documenti opzionali; potenzialmente dati relativi a minori o alla situazione familiare/economica delle parti nei casi di mediazione familiare.
- **Base giuridica:** da confermare — verosimilmente legittimo interesse o esecuzione di un servizio richiesto dall'utente; per i dati dei terzi (le parti) andrebbe valutato se serva una base autonoma o un'informativa aggiuntiva (v. PRIV-10).
- **Destinatari:** Anthropic (Claude), Google (Gemini, in fallback) — `server/ai/llm.ts`.
- **Trasferimento extra-UE:** sì, verso USA; base dichiarata: clausole contrattuali standard (privacy policy, Sezione 6).
- **Misure di minimizzazione:** redazione preventiva dei nomi delle parti e di alcuni identificatori diretti (email, CF, IBAN, telefono) prima dell'invio ai fornitori, con ripristino solo sui dati mostrati all'utente (`server/ai/redazione.ts`, PRIV-08/PRIV-09).
- **Termine di conservazione:** fino a 30 giorni dalla creazione, cancellazione automatica indipendente dal traffico (`server/storage.ts`, funzione `eliminaAnalisiScadute`, schedulata in `server/index.ts`).
- **Controllo di accesso:** token di accesso casuale (32 byte) per singola analisi; endpoint di amministrazione protetto da token HMAC con scadenza (`verifyAdminToken`).
- **Misure di sicurezza:** vedi sopra; da verificare la presenza di un DPA con Anthropic e Google.

### 4. Antiriciclaggio — compilazione assistita e modalità alta precisione (AI)

- **Finalità:** supporto alla compilazione degli obblighi antiriciclaggio del mediatore/Organismo (D.Lgs. 231/2007).
- **Categorie di interessati:** le parti della procedura di mediazione, i loro titolari effettivi.
- **Categorie di dati:** documenti d'identità, dati anagrafici, informazioni sul rischio, dichiarazioni della parte; potenzialmente dati di cui all'art. 9 (es. indicatori su carichi pendenti per reati).
- **Base giuridica:** obbligo legale del mediatore/Organismo (D.Lgs. 231/2007); il sito agisce da fornitore dello strumento, non da titolare di questi dati (dichiarato in privacy policy: "il trattamento avviene sotto la responsabilità del professionista o dell'organismo... quale titolare").
- **Destinatari:** Anthropic, solo se l'utente sceglie esplicitamente la modalità alta precisione.
- **Trasferimento extra-UE:** sì, in tal caso; clausole contrattuali standard dichiarate.
- **Termine di conservazione:** il sito dichiara di non conservare né il file caricato né i dati estratti; i dati compilati restano nel browser dell'utente (localStorage), non trasmessi al server salvo la chiamata AI facoltativa.

### 5. Database giurisprudenza

- **Finalità:** consultazione di sentenze in materia di mediazione.
- **Categorie di interessati:** nessun dato personale di utenti; le sentenze pubblicate riguardano parti di procedimenti giudiziari già pubblici.
- **Base giuridica:** non applicabile ai visitatori (dati non personali degli utenti); per i dati contenuti nelle sentenze, si tratta di provvedimenti pubblici.

### 6. Contatti

- **Finalità:** rispondere alle richieste inviate tramite il modulo di contatto.
- **Categorie di dati:** nome, email, contenuto del messaggio.
- **Base giuridica:** esecuzione di una richiesta dell'interessato.
- **Termine di conservazione:** il tempo necessario a evadere la richiesta.

## Elenco dei responsabili del trattamento (subprocessor) noti dal codice

| Fornitore | Ruolo | Dati coinvolti | Extra-UE | DPA verificato? |
|---|---|---|---|---|
| Anthropic | Elaborazione AI (Analisi del Caso, antiriciclaggio alta precisione) | Testo del caso, documenti | Sì (USA) | Da verificare — non attestabile dal codice |
| Google (Gemini API) | Elaborazione AI in fallback | Testo del caso | Sì (USA, presumibilmente) | Da verificare |
| Google Analytics | Statistiche di navigazione | Dati di navigazione, solo dopo consenso | Sì (USA) | Da verificare |
| Hosting (Render, da `render.yaml`) | Hosting applicativo e database | Tutti i dati del sito | `render.yaml` non specifica una region: il default di Render è Oregon (USA) salvo configurazione esplicita di una region UE (Francoforte) — da verificare direttamente nel pannello Render, non deducibile con certezza dal solo file di configurazione | Da verificare |

## Note per il completamento

Questa bozza copre solo cosa il codice rivela in modo verificabile. Restano
da aggiungere, a cura del titolare: gli estremi dei DPA effettivamente
firmati con ciascun fornitore, la regione di hosting effettiva del database
(rilevante per capire se i dati degli utenti risiedono anche fisicamente fuori
UE oltre che essere processati da fornitori USA), ed eventuali ulteriori
trattamenti che avvengono fuori dal codice del sito (es. corrispondenza email
diretta con gli utenti).
