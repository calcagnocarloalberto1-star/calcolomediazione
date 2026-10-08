# PRIV-12 — Verifica fornitori e trasferimenti internazionali

Data di verifica: 11 settembre 2026

## Scopo e stato

Il documento raccoglie evidenze pubbliche e registra l'esame, svolto dal
titolare, di documentazione riservata ottenuta dai fornitori. Non riproduce nel
repository pubblico il contenuto coperto da NDA e non sostituisce i DPA applicabili
all'account né attesta condizioni commerciali che non siano state verificate
nel relativo pannello.

## Northflank

- Il servizio applicativo e il database risultano configurati nella regione
  `Europe - West (London)`, Regno Unito.
- NDA reciproco Common Paper sottoscritto da entrambe le parti il 10 settembre
  2026, nella forma standard soggetta alla legge e al foro del Delaware, con
  audit trail della firma elettronica conservato nell'archivio riservato.
- Dopo la firma è stato ottenuto l'accesso al Trust Center Northflank (Vanta).
- DPA ottenuto e verificato: copre sette dei nove punti della checklist
  interna. Restano da ottenere i valori numerici di RPO e RTO dei backup.
- Rapporto SOC 2 Type II verificato senza eccezioni sui controlli testati.
- Rapporto di penetration test Kaiju Security verificato con rischio
  classificato `Low` in tutte le aree testate.
- La Commissione europea indica il Regno Unito tra i Paesi destinatari di una
  decisione di adeguatezza GDPR, rinnovata il 19 dicembre 2025 e valida fino al
  27 dicembre 2031, salvo proroga o modifica:
  https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
- L'adeguatezza disciplina il trasferimento verso il Regno Unito, ma non
  sostituisce l'accordo sul trattamento ex art. 28 GDPR.
- La pagina sicurezza dichiara SOC 2 Type 2 e indica i contatti sicurezza:
  https://northflank.com/security

**Stato:** trasferimento verso il Regno Unito coperto da adeguatezza; DPA,
SOC 2 Type II, penetration test e documentazione Trust Center acquisiti e
verificati nei limiti sopra indicati. La migrazione a Francoforte è stata
valutata e scartata perché comporterebbe downtime senza spostare i backup
nativi fuori dal Regno Unito. La risposta del fornitore ancora attesa
riguarda i valori numerici RPO/RTO; ciò non chiude la prova interna di restore, che resta
separatamente aperta in PRIV-13.

### Northflank — DPA: riscontro punto per punto (verifica del 7 ottobre 2026)

Documento esaminato: `DPA.docx (2).pdf`, Northflank Data Processing Addendum,
ottenuto dal Trust Center il 10 settembre 2026. Il testo non contiene firme e
indica il cliente solo come «l'entità che accetta l'Addendum o usa i Servizi»:
è un DPA a adesione, di cui non risulta una controfirma. Riscontro rispetto alle
nove domande della richiesta del 9 settembre (PRIV-14):

| # | Domanda | Esito nel DPA |
|---|---------|---------------|
| 1 | Soggetti e subresponsabili | Sì: Northflank Ltd responsabile; Allegato 1: Google Cloud Platform, Fastly, NS1, WorkOS, PostHog |
| 2 | Luoghi di carichi, database, log, supporto, backup | Parziale: Allegato 1 indica solo «Regno Unito / regioni scelte»; per log e backup nativi v. nota sotto |
| 3 | Meccanismo di trasferimento extra SEE/UK | Non specificato: art. 5.1 rinvia a «garanzie appropriate»; nessuna SCC citata per i subresponsabili negli Stati Uniti |
| 4 | Modifica dei subresponsabili | Sì: art. 4.2-4.3, preavviso e 30 giorni per opporsi; non indica dove iscriversi agli aggiornamenti |
| 5 | Notifica degli incidenti | Parziale: «senza ingiustificato ritardo» (art. 6.2), senza termine in ore |
| 6 | Cancellazione e restituzione | Sì: cancellazione entro 180 giorni dalla cessazione (art. 8.1) |
| 7 | Backup, restore, RPO/RTO | Non indicati nel DPA (Allegato 2, punto 8, generico); valori verificati dal titolare nel pannello il 20 settembre 2026 (PRIV-10, addendum) |
| 8 | SOC 2 Type II | Sì: report ottenuto dal Trust Center |
| 9 | DPA controfirmato o self-service | Non dimostrato: DPA a adesione; manca una conferma scritta che si applichi al team del titolare |

Il DPA copre in modo chiaro gli elementi tipici dell'art. 28, par. 3, GDPR:
istruzioni documentate (art. 3.2), riservatezza (4.1), sicurezza (6.1 e
Allegato 2), subresponsabili (4.2-4.4), assistenza per diritti degli interessati
e artt. 32-36 (7.1), cancellazione o restituzione (8.1), informazioni e audit
(9.1, una volta l'anno, preavviso di 30 giorni, a spese del cliente).

Residuo da chiudere con il fornitore: meccanismo di trasferimento verso gli
Stati Uniti (punto 3); conferma scritta di applicabilità del DPA all'account
(punto 9); eventuale precisazione dei luoghi di log e backup (punto 2).

#### Evidenze della corrispondenza con Northflank (settembre 2026)

- **9-10 settembre:** il titolare ha proposto di sostituire legge e foro
  dell'NDA con mediazione ICC da remoto e, in difetto, tribunale di Genova e
  legge italiana (Delaware come ripiego, con mediazione ICC preliminare).
  Northflank ha risposto di non poter modificare legge, foro e risoluzione delle
  controversie del proprio NDA standard; il titolare lo ha firmato così il
  10 settembre. La richiesta di modifica riguardava l'NDA, non il DPA: non
  risulta alcuna richiesta di modifica del DPA né rifiuto relativo ad esso.
- **9-10 settembre:** richiesta di migrazione a Francoforte. Northflank ha
  risposto che servono un nuovo progetto e un periodo di
  inattività e che backup nativi e log restano nel Regno Unito in ogni caso. Il
  10 settembre il titolare ha deciso di non migrare e di mantenere il progetto
  in `Europe - West (London)`.
- **10-15 settembre:** richiesta di retention, RPO/RTO e configurabilità dei
  backup, sollecitata il 13, 14 e 15 settembre senza risposta; dati poi
  verificati direttamente nel pannello il 20 settembre.

## Anthropic API

- Il DPA è incorporato nei Commercial Terms per i servizi commerciali:
  https://privacy.anthropic.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa
- Il DPA incorpora, ove necessarie, le SCC 2021/914, Modulo 2
  titolare-responsabile e/o Modulo 3 responsabile-subresponsabile:
  https://www.anthropic.com/legal/data-processing-addendum
- Il DPA disciplina istruzioni documentate, cancellazione/restituzione alla
  cessazione, subprocessori e trasferimenti.
- L'eventuale zero data retention non è presunto: richiede un accordo
  specifico e approvazione Anthropic:
  https://privacy.anthropic.com/it/articles/8956058-ho-un-accordo-di-conservazione-dati-zero-con-anthropic-a-quali-prodotti-si-applica

**Stato:** DPA e SCC pubblicamente verificati come incorporati nei termini
commerciali dell'API; conservare una copia datata e verificare nel pannello
che la chiave appartenga a un'organizzazione commerciale. La chiave di
produzione è stata identificata dal titolare come `carlo-api-key`; è stata
esclusa `olismo-proxy-2026-05-v2`. Restano da registrare organizzazione,
account e piano API commerciale effettivamente associati. ZDR non attestata.

### Evidenze Anthropic acquisite l'8 ottobre 2026

- **Copia datata del DPA:** versione in vigore dal 24 febbraio 2025, acquisita
  dal titolare il 8 ottobre 2026 alle 22:21 (stampa PDF del sito, 21 pagine);
  impronta SHA-256
  `845569f3a333d3a453dc97189ed6a73290157f1382315dcceb6fccaa9306ec32`.
  L'originale è conservato nell'archivio riservato, non nel repository.
- **Contenuto verificato nella copia:** il DPA è incorporato nei Commercial
  Terms of Service; Anthropic è responsabile e il cliente titolare (B.1);
  autorizzazione generale ai subresponsabili dell'elenco pubblicato, con
  diritto di obiezione entro 15 giorni dalla notifica (C.3); notifica di una
  violazione entro 48 ore (G.1); restituzione e cancellazione entro 30 giorni
  dalla cessazione (H.1); SCC 2021/914 Moduli 2 e 3 incorporate per
  riferimento, con legge e foro irlandesi (I.1, Schedule 3); supporto per la
  valutazione d'impatto sui trasferimenti (I.4); audit su richiesta (F);
  categorie particolari di dati: «None» (Schedule 1, B.3).
- **Pannello della Console (8 ottobre 2026, schermate delle 22:44-22:47):**
  l'organizzazione è «Carlo's Individual Org», ID
  `f563bab2-9c9b-464d-b3ea-e06e4c2321bc`; indirizzo (Via Trieste 4/9, 16011
  Arenzano GE) e partita IVA (IT03718420106) coincidono con i dati del
  responsabile nella bozza dell'accordo (in una lettura precedente della
  stessa sera risultavano non compilati); conservazione dei dati attiva a 30
  giorni, conservazione zero non attiva; adesione al Development Partner
  Program non attiva (la pagina offre il pulsante «Unisciti»); feedback degli
  utenti disattivato; registrazione delle metriche di Claude Code attiva
  (riguarda Claude Code, non le chiamate del sito). La pagina di fatturazione
  mostra una fattura mensile pagata e crediti acquistati a partire dall'11
  aprile 2026 (la cronologia visibile non esclude voci anteriori): è un
  riscontro indiretto dell'uso commerciale, non della data di accettazione dei
  termini.
- **Risposta del supporto Anthropic (8 ottobre 2026, ricevuta alle 22:54
  circa, tramite il canale di assistenza; testo conservato dal titolare):**
  il DPA con le SCC è incorporato automaticamente nei Commercial Terms e
  l'accettazione di questi comporta l'accettazione del DPA, in vigore dal 24
  febbraio 2025; il DPA si applica a tutti i prodotti commerciali, API
  compresa, e quindi, per l'uso dell'API da Console a fini professionali,
  anche all'organizzazione del titolare; i Commercial Terms contengono
  l'impegno vincolante a non addestrare i modelli sui contenuti del cliente,
  applicato di default a tutti i clienti commerciali; per una copia
  controfirmata o ulteriore documentazione il supporto rinvia a un operatore
  umano. Il mittente dichiara di non avere accesso alla data di accettazione
  dei Commercial Terms da parte dell'organizzazione.
- **Riscontro dalla posta del titolare (8 ottobre 2026):** nella casella del
  titolare non risulta alcuna email di benvenuto, di conferma dell'account
  API o sui Commercial Terms. La prima prova dell'uso a pagamento dell'API è
  la ricevuta del sabato 11 aprile 2026 (ore 19:48), acquisto di crediti una
  tantum, emessa da Anthropic Ireland, Limited con IVA italiana al 22%;
  numero di fattura 9BF0758D-645559, coincidente con la cronologia fatture
  della Console. Le email anteriori (novembre 2025) riguardano l'abbonamento
  Pro di Claude.ai e non provano l'accettazione dei Commercial Terms. L'11
  aprile 2026 è quindi solo un riscontro indiretto: non è la data di
  accettazione, che può essere anteriore, ma indica come controparte del
  rapporto per l'uso dell'API l'entità irlandese, coerente con le SCC
  irlandesi del DPA.
- **Residuo:** la risposta conferma l'applicabilità per l'organizzazione e
  l'impegno di non addestramento, ma è un messaggio del canale di assistenza,
  non un atto firmato, e non indica la data di accettazione. Restano aperti:
  la data di accettazione (da cercare tra le email di conferma o i registri
  dell'organizzazione) e l'eventuale copia controfirmata, da chiedere a un
  operatore umano.
- **Subresponsabili (elenco di 20 voci da
  https://trust.anthropic.com/subprocessors, letto l'8 ottobre 2026 alle
  22:3x; copia della pagina salvata dal titolare alle 22:33, impronta SHA-256
  `e7ed9e20dffd937967279b9b41834af06484b29ac89882846ec862cd39587bef`,
  con elenco identico a quello letto; l'originale è nell'archivio riservato):**
  - Infrastruttura e rete, tutti i prodotti: Google Cloud Platform, Amazon Web
    Services, Microsoft Azure (mondiale); Cloudflare, CDN (mondiale, locale al
    cliente).
  - Fatturazione e accesso: Stripe (USA; Developer Platform incluso), WorkOS
    (USA; Claude for Work e Developer Platform).
  - Assistenza clienti e comunicazioni: Intercom, Twilio, Iterable (USA);
    Nutun (Sudafrica); Boldr (Canada); Functional Software/Sentry, errori e
    assistenza (USA).
  - Antifrode: Sift e Arkose Labs (USA).
  - Ricerca web: Brave Search e TurboPuffer (USA).
  - Altri prodotti non usati dal sito: ElevenLabs (Claude for Work),
    Palantir Federal Cloud Service (Claude for Government), Persona (USA) e
    Yoti (Regno Unito) per Claude Free/Pro/Max.
  - Nota: l'elenco è dell'intero servizio Anthropic; non indica quali
    subresponsabili trattino i contenuti dell'API. Da chiarire con il
    supporto insieme alla conferma di applicabilità, e da verificare per
    possibili trasferimenti verso Paesi terzi (USA, Sudafrica, Canada).

## Google Gemini API

- Per utenti e applicazioni nello SEE, in Svizzera o nel Regno Unito i
  termini richiedono l'uso di Paid Services.
- Gemini API è qualificata come Paid Service soltanto quando la chiamata
  utilizza un progetto Cloud con account di fatturazione attivo.
- Nei servizi gratuiti Google può usare input e output per migliorare i
  prodotti e può sottoporli a revisione umana; i termini vietano di inviare
  dati sensibili, riservati o personali ai servizi gratuiti.
- Nei Paid Services prompt e risposte non sono usati per migliorare i
  prodotti e sono trattati secondo il Cloud Data Processing Addendum:
  https://ai.google.dev/gemini-api/terms
  https://cloud.google.com/terms/data-processing-addendum
- La zero data retention richiede condizioni e configurazioni specifiche:
  https://ai.google.dev/gemini-api/docs/zdr

**Stato verificato l'11 settembre 2026:** la chiave configurata in Northflank
è `Gemini API Key 4`, creata il 9 settembre 2026, associata a `Gemini Project`
(project ID `gen-lang-client-0302865949`, project number `926659369623`).
Google AI Studio indica `Livello 1 - Pagamento posticipato`. La variabile
`GEMINI_PAID_SERVICE_ACKNOWLEDGED` è assente: il fallback resta quindi
disabilitato dal codice. Conservare una copia datata del Cloud DPA, delle SCC
applicabili e della configurazione di conservazione prima di valutare
l'attivazione. La sola presenza di `GEMINI_API_KEY` non abilita il fornitore.

## Decisione operativa

1. Entrambi i flussi AI che possono ricevere dati di pratiche reali restano
   sospesi. Anthropic è il fornitore previsto come principale soltanto in caso
   di futura riattivazione.
2. Gemini resta disabilitato fino a verifica documentata del Paid Service.
3. Non dichiarare ZDR per alcun fornitore senza un accordo specifico.
4. Conservare il DPA Northflank e le evidenze Trust Center già acquisiti;
   integrare i valori RPO/RTO quando Northflank risponderà.
5. Riesaminare questo documento almeno annualmente e a ogni variazione di
   provider, modello, regione, piano o condizioni contrattuali.

**Aggiornamento 14/09/2026 sul punto 1:** il titolare ha deciso l'attivazione
con rischio residuo accettato (v. `docs/PRIV-10-dpia-analisi-ai.md` e
`docs/PRIV-11-registro-trattamenti.md`). I due flussi AI — Analisi AI del caso
e assistente AI antiriciclaggio sui documenti — sono attivi in produzione dal
14/09/2026, con Anthropic come fornitore effettivo e non più solo previsto. I
punti 2-5 restano invariati: Gemini resta disabilitato fino a verifica
documentata del Paid Service, nessuna ZDR dichiarata per alcun fornitore, DPA
Northflank ed evidenze Trust Center da conservare, revisione almeno annuale.
