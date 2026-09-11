# PRIV-10 — Valutazione d'impatto sulla protezione dei dati (DPIA)

**Stato: bozza non approvabile finché non sono chiusi i prerequisiti indicati
nella sezione finale.** Il presente documento organizza gli elementi tecnici necessari a
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
- Se il servizio sarà riattivato, i dati del caso potranno essere trasmessi ad **Anthropic** e, soltanto se il fallback
  viene espressamente abilitato dopo la verifica del Paid Service, a
  **Google Gemini**. Il possibile trasferimento internazionale richiede
  particolare attenzione quando i dati sono sensibili o riguardano soggetti
  vulnerabili.
- Il servizio è aperto al pubblico, ma volume, frequenza e numero di
  interessati non sono ancora misurati in modo sufficiente per qualificare il
  trattamento come "larga scala".

Entrambi i flussi AI sono attualmente sospesi. Questi elementi rendono comunque ragionevole completare una DPIA prudenziale per
«Analisi AI del Caso» e per l'antiriciclaggio in modalità alta precisione,
senza anticipare la decisione formale sulla sua obbligatorietà.

## Descrizione sistematica del trattamento (art. 35, § 7, lett. a)

| Elemento | Analisi AI del Caso | Antiriciclaggio — modalita' alta precisione |
|---|---|---|
| Dati in ingresso | Titolo, descrizione libera del caso, parti (nome, ruolo), documenti opzionali, valore della lite | Immagine/pagine del documento caricato |
| Interessati | Le parti della controversia (spesso non l'utente che compila il modulo) | Il cliente/parte i cui documenti sono caricati |
| Destinatario esterno | Nessuno finché le nuove Analisi AI restano sospese; in caso di futura riattivazione, Anthropic (Claude) e Google (Gemini) soltanto se il fallback viene espressamente abilitato dopo la verifica del Paid Service | Nessuno finché l'assistente AML resta sospeso |
| Base del trasferimento extra-UE | Da verificare e documentare sul DPA/contratto applicabile, incluse eventuali clausole contrattuali standard | idem |
| Minimizzazione applicata | Funzione sospesa; in caso di futura riattivazione, redazione preventiva best-effort (PRIV-08/PRIV-09) e minimizzazione manuale obbligatoria | Funzione sospesa; nessun documento trasmesso |
| Conservazione lato server | Nessun nuovo dato accettato; le analisi storiche già create, incluse descrizione e output derivati, restano fino alla cancellazione o per un massimo di 30 giorni | Non applicabile finché la funzione resta sospesa |
| Controllo umano sull'output | Dichiarato in piu' punti del sito come necessario, non tecnicamente imposto | Dichiarato come necessario prima dell'uso del fascicolo |

## Necessita' e proporzionalita' (art. 35, § 7, lett. b)

Punti a favore della proporzionalita' gia' presenti:

- Entrambi i flussi AI sono sospesi; i calcolatori deterministici e la
  compilazione manuale locale AML restano utilizzabili senza fornitori AI.
- In caso di futura riattivazione, la redazione preventiva ridurrà, senza
  eliminare, l'esposizione dei dati identificativi diretti verso i fornitori.
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
| Ri-identificazione delle parti da parte del fornitore AI nonostante la redazione (dettagli indiretti nel testo libero: indirizzi, importi, circostanze uniche) | Media-alta (dati potenzialmente su minori/famiglia) | Sospeso | Nuovi upload, analisi e chat bloccati fail-closed; in caso di futura riattivazione, redazione preventiva e minimizzazione manuale | Estendere il riconoscimento a piu' pattern; valutare un secondo passaggio di revisione umana del testo prima dell'invio per i casi piu' sensibili |
| Accesso non autorizzato ai dati salvati lato server | Alta | Da misurare | Token casuale; hash nella colonna di verifica; copia recuperabile nel payload cifrato AES-256-GCM con chiave separata dal DB; admin con TOTP | Verificare efficacia e accessi; valutare la co-localizzazione logica del token recuperabile e del payload |
| Trattamento di dati relativi a condanne o reati nell'AML | Alta | Sospeso | UI disabilitata; endpoint fail-closed salvo la doppia attestazione `AML_AI_ENABLED=true` e `AML_AI_GDPR_APPROVED=true` | Mantenere entrambi i flag assenti o diversi da `true`; definire presupposto ex art. 10 GDPR e diritto nazionale, ruolo del professionista, accordo ex art. 28 e istruzioni documentate prima di autorizzare il flusso |
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

In attesa della decisione finale del titolare, le nuove Analisi AI sono sospese
per ogni materia. L'interfaccia vieta senza eccezioni l'invio di identificativi
di minori e di dati sanitari, biometrici o giudiziari; tale divieto resta una
misura di minimizzazione e non sostituisce le basi e garanzie richieste dagli
artt. 6, 9 e 10 GDPR. Prima di qualsiasi riattivazione occorre decidere se
escludere stabilmente questi dati o introdurre un percorso separato, motivato e
tecnicamente verificabile. Non viene introdotta una categorizzazione automatica
della pratica, che creerebbe un ulteriore dato classificatorio senza eliminare
il rischio di casi sensibili presenti in altre materie.

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
6. Prima di riattivare l'Analisi AI devono essere definiti e approvati il ruolo
   di CalcoloMediazione rispetto ai dati di terzi, la propria base ex art. 6,
   gli eventuali presupposti ex artt. 9 e 10 e il processo per l'informativa ex
   art. 14 o per la documentazione di una specifica eccezione applicabile.
7. L'assistente AI AML resta sospeso fino alla definizione del ruolo di
   responsabile, dell'accordo ex art. 28, delle istruzioni documentate e del
   presupposto ex art. 10 e diritto nazionale per eventuali dati su condanne
   e reati.
8. Devono essere censiti diagnostica, Google Apps Script e log Northflank,
   con retention, trasferimenti e DPA.
9. `CASE_AI_ENABLED` e `CASE_AI_GDPR_APPROVED` devono restare assenti o diversi
   da `true` fino alla decisione formale; per AML vale lo stesso per
   `AML_AI_ENABLED` e `AML_AI_GDPR_APPROVED`. Ogni riattivazione richiede
   entrambi i flag del relativo flusso e un rilascio controllato.

## Decisione futura del titolare

- [ ] Prerequisiti chiusi e DPIA riesaminata.
- [ ] Trattamento approvato con motivazione e rischio residuo documentato.
- [ ] Trattamento sospeso o limitato.
- [ ] Richiesto un parere privacy/DPO o una consultazione preventiva.

- Motivazione: ________________________________________________
- Data: ____________________
- Titolare: Carlo Alberto Calcagno
- Firma o riferimento alla decisione conservata: ____________________
