# PRIV-10 — Valutazione d'impatto sulla protezione dei dati (DPIA)

**Stato: trattamento approvato dal titolare il 14/09/2026 con motivazione e
rischio residuo documentato (v. "Decisione del titolare" in fondo a questo
documento); i prerequisiti indicati nella sezione finale non sono ancora
tutti chiusi e vanno richiusi progressivamente.** Il presente documento organizza gli elementi tecnici necessari a
una valutazione d'impatto ex art. 35 GDPR sui trattamenti che coinvolgono
intelligenza artificiale generativa sul sito. Le valutazioni di merito
(necessita' effettiva della DPIA, giudizio di accettabilita' del rischio
residuo, decisione se consultare il Garante ex art. 36) restano riservate al
titolare del trattamento e, se ritenuto opportuno, a un consulente privacy/DPO
esterno: nessuna parte di questo documento sostituisce quel giudizio.

## Motivo della valutazione prudenziale

L'art. 35, § 3, GDPR include, tra gli altri casi, la valutazione sistematica
basata su trattamento automatizzato sulla quale si fondano decisioni con
effetti giuridici o analogamente significativi e il trattamento su larga scala
di categorie particolari. Gli output del sito sono dichiarati non vincolanti e
soggetti a verifica umana; la larga scala non è stata misurata. La DPIA viene
quindi svolta in via prudenziale sulla base della combinazione di più criteri
di rischio, non perché uno dei casi dell'art. 35, § 3 sia già dimostrato.
Gli elementi rilevanti sono:

- **Analisi AI del Caso**, quando attiva, genera tramite modello generativo una valutazione
  giuridica, un'analisi MAAN/BATNA e un controllo dei bias cognitivi sulla
  base dei dati del caso concreto inseriti dall'utente. L'output è dichiarato
  non vincolante e soggetto a verifica umana, quindi non si assume che
  ricorra la fattispecie dell'art. 35, § 3, lett. a. Resta tuttavia una
  valutazione automatizzata di circostanze riferibili alle parti della
  controversia, che sono spesso terzi rispetto all'utente che compila il
  modulo e non prestano un consenso diretto al trattamento.
- La **mediazione familiare** (separazioni, affidamento, assegni) tratta per
  sua natura dati che possono riguardare minori e, indirettamente, la salute
  o le condizioni economiche delle parti — categorie che richiedono un livello
  di attenzione piu' alto anche quando non rientrano formalmente nell'art. 9.
- I dati del caso vengono trasmessi ad **Anthropic** e, soltanto se il fallback
  viene espressamente abilitato dopo la verifica del Paid Service, a
  **Google Gemini**. Il possibile trasferimento internazionale richiede
  particolare attenzione quando i dati sono sensibili o riguardano soggetti
  vulnerabili.
- Il servizio è aperto al pubblico, ma volume, frequenza e numero di
  interessati non sono ancora misurati in modo sufficiente per qualificare il
  trattamento come "larga scala".

Entrambi i flussi AI sono oggi attivi, con rischio residuo accettato dal
titolare (v. "Decisione del titolare" in fondo a questo documento). Questi elementi rendono comunque necessario completare una DPIA prudenziale per
«Analisi AI del Caso» e per l'antiriciclaggio in modalità alta precisione,
senza anticipare la decisione formale sulla sua obbligatorietà.

## Descrizione sistematica del trattamento (art. 35, § 7, lett. a)

| Elemento | Analisi AI del Caso | Antiriciclaggio — modalita' alta precisione |
|---|---|---|
| Dati in ingresso | Titolo, descrizione libera del caso, parti (nome, ruolo), documenti opzionali, valore della lite | Immagine/pagine del documento caricato |
| Interessati | Le parti della controversia (spesso non l'utente che compila il modulo) | Il cliente/parte i cui documenti sono caricati |
| Destinatario esterno | Anthropic (Claude); Google (Gemini) soltanto se il fallback viene espressamente abilitato dopo la verifica del Paid Service | Anthropic (Claude), per i documenti che l'utente sceglie di caricare |
| Base del trasferimento extra-UE | Da verificare e documentare sul DPA/contratto applicabile, incluse eventuali clausole contrattuali standard | idem |
| Minimizzazione applicata | Redazione preventiva best-effort (PRIV-08/PRIV-09) e minimizzazione manuale obbligatoria | Nessuna redazione automatica lato server; minimizzazione manuale a cura dell'utente richiesta dall'avviso privacy prima del caricamento |
| Conservazione lato server | Le nuove analisi, come quelle storiche, restano — descrizione e output derivati inclusi — fino alla cancellazione o per un massimo di 30 giorni | Non applicabile: i documenti caricati non vengono conservati lato server (elaborazione stateless per singola richiesta) |
| Controllo umano sull'output | Dichiarato in piu' punti del sito come necessario, non tecnicamente imposto | Dichiarato come necessario prima dell'uso del fascicolo |

## Necessita' e proporzionalita' (art. 35, § 7, lett. b)

Punti a favore della proporzionalita' gia' presenti:

- Entrambi i flussi AI sono oggi attivi con rischio residuo accettato dal
  titolare; restano comunque utilizzabili, come alternativa che non coinvolge
  fornitori AI, i calcolatori deterministici e la compilazione manuale locale AML.
- La redazione preventiva riduce, senza eliminare, l'esposizione dei dati
  identificativi diretti verso i fornitori.
- I fornitori dichiarano (nei rispettivi termini commerciali, non verificabili
  dal codice) di non riutilizzare i dati per addestramento.
- Retention limitata a 30 giorni per i dati salvati lato server.

Punti che richiedono una decisione esplicita del titolare:

- Se la redazione preventiva, l'informativa immediata e la minimizzazione
  manuale siano misure sufficienti per il livello di rischio del trattamento.
  Il flusso richiede una conferma esplicita prima dell'invio, ma tale conferma
  non sostituisce la base giuridica del trattamento né l'informativa dovuta
  agli interessati.
- Dall'11 settembre 2026 l'avviso distingue la pseudonimizzazione automatica
  best-effort dall'anonimizzazione e richiede di rimuovere i dati di terzi non
  necessari. La dichiarazione menziona espressamente dati sanitari, biometrici,
  giudiziari e identificativi di minori.

## Rischi per gli interessati (art. 35, § 7, lett. c) e misure (lett. d)

| Rischio | Gravita' stimata | Probabilita' stimata | Misure gia' in atto | Misure da valutare |
|---|---|---|---|---|
| Ri-identificazione delle parti da parte del fornitore AI nonostante la redazione (dettagli indiretti nel testo libero: indirizzi, importi, circostanze uniche) | Media-alta (dati potenzialmente su minori/famiglia) | Attivo dal 14/09/2026 (rischio residuo accettato dal titolare, v. Decisione del titolare sotto) | Redazione preventiva e minimizzazione manuale richieste all'utente prima dell'invio | Estendere il riconoscimento a piu' pattern; valutare un secondo passaggio di revisione umana del testo prima dell'invio per i casi piu' sensibili |
| Accesso non autorizzato ai dati salvati lato server | Alta | Da misurare | Token casuale; hash nella colonna di verifica; copia recuperabile nel payload cifrato AES-256-GCM con chiave separata dal DB; admin con TOTP | Verificare efficacia e accessi; valutare la co-localizzazione logica del token recuperabile e del payload |
| Trattamento di dati relativi a condanne o reati nell'AML | Alta | Attivo dal 14/09/2026 (rischio residuo accettato dal titolare, v. Addendum sotto) | Doppia attestazione `AML_AI_ENABLED=true` e `AML_AI_GDPR_APPROVED=true`; verifica umana dei campi estratti dichiarata obbligatoria prima dell'uso | Definire il presupposto ex art. 10 GDPR e diritto nazionale, il ruolo del professionista e l'accordo ex art. 28 con istruzioni documentate; fino ad allora resta rischio residuo assunto dal titolare |
| Diagnostica contenente dati personali nei messaggi o stack | Media-alta | Da misurare | Redazione di email, codici fiscali e token; route senza query; user-agent ridotto a mobile/desktop; rate limiting | Verificare webhook, DPA, Paesi e retention; disattivare il webhook se non documentabile |
| Output AI errato o allucinato usato senza verifica (es. una bozza di accordo con clausole scorrette) | Alta (effetti legali reali) | Media | Disclaimer diffusi sul sito che richiedono verifica professionale | Nessuna misura tecnica impedisce oggi l'uso diretto dell'output; valutare un passaggio di conferma esplicita prima dell'export/uso del documento |
| Conservazione dei dati oltre il dichiarato | Media | Bassa dopo PRIV-09 (job di retention reso indipendente dal traffico) | Cancellazione automatica ogni ora oltre i 30 giorni | Monitoraggio/alert se il job fallisce ripetutamente |
| Trasferimento extra-UE senza garanzia adeguata | Alta | Da verificare | La privacy policy rinvia agli accordi e ai meccanismi applicabili senza attestare la sottoscrizione di SCC | Verificare e conservare DPA e garanzia applicabile, incluse eventuali SCC, per Anthropic e per Google se il fallback viene attivato |

## Consultazione (art. 35, § 9)

Valutare se raccogliere il parere degli interessati o dei loro rappresentanti
sulle misure di minimizzazione, salvo che ciò non sia appropriato per ragioni
documentate. Il parere degli utenti professionali può integrare, ma non
sostituire, quello degli interessati o dei loro rappresentanti.

## Presidio provvisorio per dati relativi a minori

Le nuove Analisi AI sono oggi attive per le materie generali, ma restano
escluse dai flussi AI generali le pratiche che coinvolgono dati di minori (v.
sotto). Il 12 settembre 2026 il
titolare ha scelto in via di indirizzo un futuro percorso a presidi rafforzati,
registrato in PRIV-18 e specificato in PRIV-17. La scelta non approva ancora il
trattamento: il percorso deve essere implementato, testato e valutato nella
presente DPIA. Fino ad allora i dati di minori restano esclusi dai flussi AI.
Il divieto provvisorio resta una misura di minimizzazione e non sostituisce le
basi e garanzie richieste dagli artt. 6, 9 e 10 GDPR.

## Esito e prossimi passi

### Valutazione non ancora conclusa

Il rischio inerente è presumibilmente alto per la possibile presenza di dati
giudiziari, familiari, economici, relativi a minori e a terzi, combinata con
l'uso di fornitori AI. Gravità e probabilità residue non sono ancora
classificabili in modo affidabile: mancano metriche d'uso, test documentati
dell'efficacia delle misure, la conclusione sulle basi degli artt. 6 e 9 per
i dati di terzi, la disciplina dell'eventuale futuro flusso AML ex artt. 10 e
28, la configurazione definitiva degli account provider e la retention
diagnostica. Il DPA Northflank è stato acquisito; restano verifiche
   puntuali indicate in PRIV-12 e PRIV-13: valori RPO/RTO e prova interna di
   restore. Le evidenze riservate su DPA, SOC 2 Type II, penetration test,
   cifratura, ubicazione, retention e subprocessori sono state esaminate nei
   limiti descritti in tali documenti.
Non viene quindi formulata alcuna conclusione sull'art. 36 GDPR.

### Prerequisiti prima dell'approvazione

**Nota 14/09/2026:** il titolare ha approvato il trattamento con motivazione e
rischio residuo documentato prima della chiusura di tutti i prerequisiti
elencati qui sotto (v. "Decisione del titolare" più avanti in questo
documento). I punti restano comunque validi come elenco di ciò che va chiuso
progressivamente, a trattamento già attivo.

1. Anthropic deve essere usato tramite account API soggetto ai Commercial
   Terms e al DPA con SCC incorporato:
   https://www.anthropic.com/legal/data-processing-addendum
2. Il progetto Gemini è stato identificato come servizio a pagamento, ma
   Gemini deve restare disabilitato finché Cloud DPA, SCC e configurazione di
   conservazione non sono stati archiviati e verificati:
   https://ai.google.dev/gemini-api/terms
3. Il DPA Northflank e le evidenze Trust Center già esaminate devono essere
   conservati nell'archivio riservato; restano da integrare i valori RPO/RTO e
   da eseguire la prova interna di restore. La decisione di adeguatezza del
   Regno Unito non sostituisce l'art. 28 GDPR:
   https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
4. Gli utenti devono evitare dati non necessari e verificare umanamente ogni
   output prima dell'uso professionale.
5. La DPIA deve essere riesaminata almeno annualmente e prima di modifiche a
   provider, modelli, finalità, categorie di dati o retention.
6. L'Analisi AI è stata riattivata il 14/09/2026 come rischio residuo
   accettato dal titolare (v. "Decisione del titolare" sotto); resta comunque
   da verificare in concreto e rendere
   operativa mediante accordo e istruzioni la scelta di indirizzo, registrata
   in PRIV-18, del professionista/Organismo titolare e CalcoloMediazione
   responsabile ex art. 28. Devono inoltre essere definiti la base ex art. 6
   del professionista/Organismo titolare,
   gli eventuali presupposti ex artt. 9 e 10 e il processo per l'informativa ex
   art. 14 o per la documentazione di una specifica eccezione applicabile.
7. L'assistente AI AML è stato riattivato il 14/09/2026 come rischio residuo
   accettato dal titolare (v. Addendum in fondo a questo documento), pur
   restando aperti la verifica concreta e l'operativizzazione dell'indirizzo di
   CalcoloMediazione responsabile, la
   sottoscrizione dell'accordo ex art. 28 e delle istruzioni documentate e la
   definizione del presupposto ex art. 10 e del diritto nazionale per eventuali
   dati su condanne e reati: questi punti restano prerequisiti da chiudere, non
   più condizioni sospensive dell'attivazione.
8. Devono essere censiti diagnostica, Google Apps Script e log Northflank,
   con retention, trasferimenti e DPA.
9. `CASE_AI_ENABLED` e `CASE_AI_GDPR_APPROVED` devono restare assenti o diversi
   da `true` fino alla decisione formale; per AML vale lo stesso per
   `AML_AI_ENABLED` e `AML_AI_GDPR_APPROVED`. Ogni riattivazione richiede
   entrambi i flag del relativo flusso e un rilascio controllato.

## Decisione del titolare

- [ ] Prerequisiti chiusi e DPIA riesaminata.
- [x] Trattamento approvato con motivazione e rischio residuo documentato.
- [ ] Trattamento sospeso o limitato.
- [ ] Richiesto un parere privacy/DPO o una consultazione preventiva.

- Motivazione: il titolare decide di rendere operativi i flussi AI (Analisi AI del Caso e AML AI) pur in presenza di quattro prerequisiti indicati in questo documento non ancora chiusi, accettati qui come rischio residuo documentato e da richiudere progressivamente: (1) risposta di Northflank sui valori RPO/RTO e sulla configurabilita' a livello di progetto, richiesta il 9-10/09/2026 e sollecitata il 13/09/2026, non ancora ricevuta; (2) prova interna di ripristino da backup, mai eseguita; (3) verifica formale del DPA Anthropic con SCC incorporato (issue #80, ancora aperta); (4) accordo ex art. 28 con i subresponsabili (Northflank, Anthropic) e con il professionista/Organismo titolare per Analisi AI e AML, bozza non sottoscritta con campi controparte in bianco (PRIV-16). Restano fermi in ogni caso il divieto di trattare dati di minori nei flussi AI generali fino all'operativita' del percorso a presidi rafforzati (PRIV-17/PRIV-18) e l'obbligo di verifica umana di ogni output prima dell'uso professionale.
- Data: 14/09/2026
- Titolare: Carlo Alberto Calcagno
- Firma o riferimento alla decisione conservata: commit su GitHub di questo documento, autenticato con l'account del titolare (14/09/2026); da integrare con firma formale se richiesto da consulente privacy/DPO

### Addendum 14/09/2026 — riattivazione dell'assistente AI di caricamento documenti in Antiriciclaggio (quinto rischio residuo)

Lo stesso giorno il titolare ha inoltre deciso di riattivare, sulla pagina
Antiriciclaggio, la funzione facoltativa che permette di caricare i documenti
del fascicolo e ottenere una prima bozza di compilazione tramite Anthropic
(pulsante "Chiedi all'assistente e compila"), disattivata l'11/09/2026 insieme
al resto dell'hardening. La decisione è stata presa a fronte dell'esigenza
operativa del titolare di poter usare e mostrare lo strumento (compresa una
lezione il 15/09/2026) e comporta un quinto punto di rischio residuo, distinto
dai quattro già accettati sopra:

5. **Presupposto ex artt. 9 e 10 GDPR non definito** per l'eventuale
   trattamento, tramite questa funzione, di categorie particolari di dati
   (art. 9) o di dati relativi a condanne penali e reati (art. 10) riferiti
   alle parti della procedura, quando presenti nei documenti caricati
   (ad es. dichiarazioni su carichi pendenti, PEP, provenienza dei fondi). La
   funzione resta accessibile a titolo di scelta dell'utente professionale, con
   verifica umana dichiarata obbligatoria prima di scrivere i dati estratti nei
   campi del modulo; il presupposto giuridico e il ruolo di CalcoloMediazione
   restano da definire secondo lo stesso modello (responsabile ex art. 28) già
   indicato per Analisi AI e AML nella Decisione del titolare sopra.

Questo quinto punto si aggiunge, senza sostituirli, ai quattro prerequisiti
elencati nella Motivazione della Decisione del titolare.


### Addendum 20/09/2026 - chiusura autonoma dei punti 1 e 2 della Motivazione (14/09/2026)

Dei quattro prerequisiti elencati nella Motivazione della Decisione del titolare (14/09/2026, sopra), i primi due risultano oggi chiusi:

1. **Northflank - valori RPO/RTO e configurabilita' a livello di progetto.** Dopo tre solleciti scritti (13/09, 14/09 e 15/09/2026 - quest'ultimo con scadenza esplicita al 18/09/2026) rimasti senza risposta del fornitore anche oltre la scadenza fissata, i tre dati sono stati verificati autonomamente il 20/09/2026 direttamente nel pannello Northflank dell'addon `calcolomediazione-db`: retention dei backup **14 giorni**; frequenza **due snapshot al giorno (00:15 e 02:15 UTC)**, da cui un RPO stimato tra circa 2 e circa 22 ore a seconda del momento dell'eventuale incidente; entrambi i parametri **configurabili per singolo addon/progetto**. Il valore di RTO era gia' stato misurato empiricamente il 15/09/2026 con una prova di ripristino reale (v. punto 2 sotto e `PRIV-13`): circa 2 minuti. Il punto si considera chiuso su base di autoverifica tecnica diretta e di due diligence documentata verso il fornitore, non su una dichiarazione contrattuale di Northflank, mai pervenuta.
2. 2. **Prova interna di ripristino da backup.** Al 14/09/2026 non era ancora stata eseguita; lo e' stata il giorno successivo, **15/09/2026**, su un add-on temporaneo isolato (mai sul database di produzione), con esito positivo: RTO circa 2 minuti, integrita' strutturale dei dati verificata (v. `PRIV-13`, sezione "Prova di ripristino"). Resta parziale, come gia' segnalato in `PRIV-13`, un solo aspetto: la decifratura completa di un record con la chiave `DATA_ENCRYPTION_KEY` di produzione non e' stata eseguita, per non esporre inutilmente quella chiave.
  
   3. Restano aperti, invariati rispetto al 14/09/2026, i punti 3 (verifica formale del DPA Anthropic, issue #80) e 4 (accordo ex art. 28, `PRIV-16`) della Motivazione.
   4. 
