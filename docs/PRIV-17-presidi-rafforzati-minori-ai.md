# PRIV-17 — Presidi rafforzati per dati di minori nei flussi AI

Data di predisposizione: 12 settembre 2026
Stato: specifica operativa non implementata e non approvata per il rilascio

## Decisione di indirizzo

Il titolare ha scelto il 12 settembre 2026 di non adottare un divieto assoluto,
ma di subordinare qualsiasi futuro trattamento AI di pratiche con dati di
minori a presidi rafforzati.

Questa scelta non riattiva il servizio. Finché tutti i controlli descritti
nelle sezioni seguenti non sono implementati, testati e approvati, le pratiche
con minori restano escluse dai flussi AI.

## Principio fail-closed

Il sistema deve considerare la pratica non autorizzata quando:

- l'utente non risponde alla domanda sulla presenza di minori;
- l'utente seleziona “sì” o “non so” e il presidio specifico non è attivo;
- manca una delle attestazioni giuridiche o tecniche richieste;
- il client e il server riportano stati discordanti;
- la configurazione di produzione è assente, non valida o non verificabile.

Il blocco deve avvenire sul server prima del body parser o dell'upload. La sola
disabilitazione dell'interfaccia non è sufficiente.

La classificazione non può essere letta dal medesimo body che il gate dovrebbe
impedire di analizzare. È quindi necessario il protocollo preliminare a due
fasi descritto sotto.

## Protocollo tecnico a due fasi

### Fase 1 — Preflight privo del contenuto della pratica

Prima di testo o file, il client invia a un endpoint dedicato soltanto
metadati a valori chiusi mediante header di lunghezza limitata:

- stato minori: `yes`, `no` o `unknown`;
- versione dell'avviso mostrato;
- conferme richieste espresse come valori booleani;
- categoria generale della funzione richiesta.

L'endpoint deve essere montato prima dei parser globali e non deve accettare un
body. Se i controlli sono superati, restituisce un token preflight firmato,
monouso e di breve durata, che incorpora stato, versione e percorso
autorizzato, senza dati della pratica.

### Fase 2 — Contenuto

La successiva richiesta di analisi o upload presenta il token preflight in un
header. Prima del parser o di Multer, il server verifica firma, scadenza,
monouso, vincolo all'utente o alla sessione e compatibilità con l'endpoint. Il
consumo del token deve essere atomico, così che due richieste concorrenti non
possano riutilizzarlo. Solo dopo tale verifica il contenuto può essere
ricevuto.

Dopo il parsing ma prima di qualsiasi invio al provider, un secondo controllo
esegue il rilevamento prudenziale di possibili riferimenti a minori. Se il
preflight dichiarava `no` ma il rilevamento segnala un rischio, la richiesta è
bloccata e deve ripartire dal percorso rafforzato. Il rilevamento automatico
riduce il rischio di classificazioni errate, ma non prova l'assenza di dati di
minori.

## Flusso proposto

### Categorizzazione obbligatoria

Prima di accettare testo o file, l'interfaccia deve chiedere:

> La pratica contiene o può contenere dati riferiti a persone di età inferiore
> a 18 anni?

Valori ammessi:

- `sì`;
- `no`;
- `non so`.

Nessun valore deve essere preselezionato. `Sì` e `non so` attivano il percorso
rafforzato.

### Avviso specifico

Nel percorso rafforzato deve comparire, prima di ogni caricamento:

> I dati dei minori richiedono una tutela rafforzata. Non caricare documenti
> finché non hai verificato la necessità del trattamento, la base giuridica,
> l'informativa applicabile e la possibilità di eliminare nomi, recapiti,
> immagini, dati sanitari, scolastici e ogni dettaglio non indispensabile.
> La pseudonimizzazione automatica non garantisce l'anonimato.

### Conferme separate

L'utente professionista deve confermare separatamente, senza caselle
preselezionate:

1. di essere autorizzato dal titolare della pratica a utilizzare lo strumento;
2. di avere verificato base giuridica, informativa ed eventuali presupposti
   dell'art. 9 GDPR;
3. di avere verificato, se presenti dati su condanne o reati, il presupposto
   dell'art. 10 GDPR e il diritto nazionale applicabile;
4. di avere eliminato i dati non necessari;
5. di non avere inserito immagini o registrazioni del minore, vietate fino a
   una futura decisione separata;
6. di non avere inserito recapiti diretti o altri identificativi del minore
   salvo assoluta necessità documentata;
7. di avere verificato che l'uso dell'AI sia compatibile con il superiore
   interesse del minore e con le regole professionali applicabili.

Le conferme devono essere registrate come evento tecnico minimizzato, senza
salvare il contenuto della pratica nei log. Il registro conserva soltanto
identificativo pseudonimo, data, versione dei testi e valori delle conferme per
lo stesso termine dell'analisi, con massimo 30 giorni, accesso amministrativo
autorizzato e cancellazione contestuale. La finalità esclusiva è dimostrare
l'applicazione dei controlli e ricostruire eventuali incidenti. La cancellazione
anticipata può essere richiesta dal professionista/Organismo titolare o
dall'interessato tramite il titolare, previa verifica dell'identità e dei
presupposti applicabili.

## Controlli server

Prima di una futura implementazione devono essere definiti:

- metadato preflight obbligatorio `containsMinors` con valori `yes`, `no`,
  `unknown`, mai acquisito dal body della pratica;
- flag separato, con valore predefinito disabilitato, per il percorso minori;
- verifica congiunta del gate generale CASE, del gate specifico minori e del
  token preflight firmato;
- rifiuto `503` o `422` prima dei parser e di Multer quando il percorso non è
  autorizzato;
- nessun fallback silenzioso verso un provider o modello diverso;
- nessun inserimento di testo, nomi o metadati della pratica nei log;
- retention e cancellazione coerenti con l'accordo ex art. 28;
- audit trail delle sole attestazioni, con data, versione del testo e
  identificativo non direttamente riconducibile alla pratica.
- rilevamento prudenziale dopo il parsing e prima del provider per intercettare
  classificazioni `no` potenzialmente errate.

## Minimizzazione tecnica

Prima dell'invio al provider, oltre alla pseudonimizzazione generale, il sistema
deve rilevare e sostituire, per quanto tecnicamente possibile:

- nomi e cognomi del minore e dei familiari;
- data e luogo di nascita;
- indirizzi, recapiti, account e identificativi scolastici;
- fotografie e immagini, la cui rilevazione determina il blocco e non la sola
  sostituzione;
- codici fiscali, numeri di documento e identificativi sanitari;
- nomi di scuole, strutture sanitarie o comunità quando identificanti;
- combinazioni di età, luogo, relazione e circostanze uniche.

Il rilevamento automatico resta una misura di riduzione del rischio e non
costituisce anonimizzazione. Il sistema deve mostrare all'utente una preview
del testo pseudonimizzato prima dell'invio, consentendo ulteriori rimozioni.

## Categorie da bloccare fino a valutazione separata

Anche con il percorso rafforzato, restano bloccati fino a specifica decisione:

- immagini o registrazioni del minore;
- dati sanitari dettagliati;
- dati relativi ad abusi, violenza o procedimenti penali;
- relazioni dei servizi sociali o psicologiche integrali;
- documenti scolastici integrali;
- dati biometrici o genetici;
- informazioni non necessarie rispetto alla finalità professionale dichiarata.

## Documentazione necessaria

Prima dell'abilitazione devono risultare completati:

- accordo ex art. 28 con il professionista o Organismo;
- DPIA con scenario specifico per minori;
- registro art. 30 aggiornato;
- base giuridica e, se applicabile, presupposto dell'art. 9;
- presupposto dell'art. 10 e diritto nazionale applicabile, se sono coinvolti
  dati relativi a condanne o reati;
- processo per informativa e diritti degli interessati;
- DPA, trasferimenti, retention e no-training dei provider;
- valutazione del superiore interesse del minore;
- testo dell'avviso e delle conferme approvato dal titolare;
- elenco dei subresponsabili autorizzati.

## Test di accettazione

Devono essere eseguiti senza dati personali reali:

1. assenza di `containsMinors` → richiesta bloccata prima del parser;
2. `unknown` → percorso rafforzato obbligatorio;
3. `yes` con flag specifico assente → richiesta bloccata;
4. `yes` con una conferma mancante → richiesta bloccata;
5. client manipolato → blocco server invariato;
6. token preflight assente, scaduto o destinato ad altro endpoint → blocco
   prima del parser;
7. token usato da sessione diversa → blocco prima del parser;
8. doppio utilizzo concorrente dello stesso token → una sola richiesta può
   consumarlo atomicamente;
9. dichiarazione `no` con testo sintetico che indica un minore → blocco prima
   del provider e richiesta di nuovo preflight;
10. immagine o registrazione sintetica riferita a un minore → blocco
   incondizionato;
11. file oltre limite o tipo non ammesso → rifiuto prima dell'estrazione;
12. provider non verificato → nessun fallback;
13. testo sintetico con identificativi → preview pseudonimizzata;
14. log applicativi → nessun contenuto della pratica;
15. cancellazione → rimozione nei tempi documentati;
16. storico già esistente → consultazione, esportazione e cancellazione non
    compromesse dai nuovi gate;
17. accessibilità → avviso, campi e errori annunciati correttamente da tastiera
    e screen reader.

## Criteri per la chiusura di PRIV-02-D

L'issue può essere chiusa soltanto quando:

- la presente specifica è stata approvata;
- sono state implementate UI, API e persistenza minima delle attestazioni;
- i test di accettazione sono automatizzati e superati;
- DPIA, registro, informativa e accordo ex art. 28 sono aggiornati;
- un riesame indipendente non rileva blocker critici o alti;
- il titolare registra la decisione finale e la data del riesame.
