# PRIV-10 — Valutazione d'impatto sulla protezione dei dati (DPIA) — bozza di lavoro

**Stato: bozza preparata a supporto della revisione, non una DPIA formalmente
adottata.** Il presente documento organizza gli elementi tecnici necessari a
una valutazione d'impatto ex art. 35 GDPR sui trattamenti che coinvolgono
intelligenza artificiale generativa sul sito. Le valutazioni di merito
(necessita' effettiva della DPIA, giudizio di accettabilita' del rischio
residuo, decisione se consultare il Garante ex art. 36) restano riservate al
titolare del trattamento e, se ritenuto opportuno, a un consulente privacy/DPO
esterno: nessuna parte di questo documento sostituisce quel giudizio.

## Perche' una DPIA e' probabilmente necessaria

L'art. 35, § 3, GDPR presume la necessita' di una DPIA quando il trattamento
comporta, tra l'altro: (a) una valutazione sistematica e globale di aspetti
personali basata su trattamento automatizzato, comprese le "profilazioni", che
producono effetti significativi; oppure il trattamento su larga scala di
categorie particolari di dati (art. 9). Gli elementi rilevanti su
calcolomediazione.it:

- **Analisi AI del Caso** genera, tramite modello generativo, una valutazione
  giuridica, un'analisi MAAN/BATNA e un controllo dei bias cognitivi sulla
  base dei dati del caso concreto inseriti dall'utente — una forma di
  valutazione automatizzata di una situazione personale (art. 35, § 3, lett.
  a) applicata alle parti della controversia, che sono terzi rispetto
  all'utente che compila il modulo e non prestano un consenso diretto al
  trattamento.
- La **mediazione familiare** (separazioni, affidamento, assegni) tratta per
  sua natura dati che possono riguardare minori e, indirettamente, la salute
  o le condizioni economiche delle parti — categorie che richiedono un livello
  di attenzione piu' alto anche quando non rientrano formalmente nell'art. 9.
- I dati del caso vengono trasmessi a **fornitori esterni extra-UE**
  (Anthropic, Google) per l'elaborazione — un trasferimento internazionale che
  la normativa guarda con particolare attenzione quando i dati sono sensibili
  o riguardano soggetti vulnerabili.
- Il volume potenziale di casi trattati nel tempo (chiunque puo' usare lo
  strumento gratuitamente) rende plausibile la soglia di "larga scala"
  richiesta dall'art. 35, § 3, lett. b, anche se il singolo trattamento e'
  isolato per caso.

Questi elementi, insieme, rendono ragionevole trattare la DPIA come dovuta
almeno per lo strumento «Analisi AI del Caso»; lo strumento antiriciclaggio in
modalita' alta precisione (che trasmette documenti a un fornitore AI) va
valutato con lo stesso metro.

## Descrizione sistematica del trattamento (art. 35, § 7, lett. a)

| Elemento | Analisi AI del Caso | Antiriciclaggio — modalita' alta precisione |
|---|---|---|
| Dati in ingresso | Titolo, descrizione libera del caso, parti (nome, ruolo), documenti opzionali, valore della lite | Immagine/pagine del documento caricato |
| Interessati | Le parti della controversia (spesso non l'utente che compila il modulo) | Il cliente/parte i cui documenti sono caricati |
| Destinatario esterno | Anthropic (Claude), Google (Gemini in fallback) | Anthropic |
| Base del trasferimento extra-UE | Clausole contrattuali standard (dichiarate in privacy policy) | idem |
| Minimizzazione applicata | Redazione preventiva (PRIV-08/PRIV-09): nomi delle parti e alcuni identificatori diretti (email, CF, IBAN, telefono) sostituiti con token prima dell'invio; ripristino dei valori reali solo sui risultati mostrati all'utente | Nessuna redazione preventiva: l'intero documento (spesso un'immagine) viene trasmesso |
| Conservazione lato server | Fino a 30 giorni, poi cancellazione automatica (PRIV-09: job periodico indipendente dal traffico) | Il sito dichiara di non conservare ne' il file ne' i dati estratti |
| Controllo umano sull'output | Dichiarato in piu' punti del sito come necessario, non tecnicamente imposto | Dichiarato come necessario prima dell'uso del fascicolo |

## Necessita' e proporzionalita' (art. 35, § 7, lett. b)

Punti a favore della proporzionalita' gia' presenti:

- Lo strumento e' un supporto opzionale, non un passaggio obbligato della
  mediazione: l'utente puo' condurre l'analisi senza l'AI.
- La redazione preventiva riduce, senza eliminare, l'esposizione dei dati
  identificativi diretti verso i fornitori esterni.
- I fornitori dichiarano (nei rispettivi termini commerciali, non verificabili
  dal codice) di non riutilizzare i dati per addestramento.
- Retention limitata a 30 giorni per i dati salvati lato server.

Punti che richiedono una decisione esplicita del titolare:

- Se la redazione preventiva sia una misura sufficiente per il livello di
  rischio del trattamento, oppure se occorra un consenso/informativa specifici
  raccolti dall'utente prima di usare lo strumento (oggi l'informativa e' solo
  nella privacy policy generale, non un passaggio attivo di consenso legato
  allo strumento).
- Se serva raccogliere una dichiarazione dall'utente che attesti di avere
  titolo per inserire i dati delle parti (che sono terzi) nello strumento.

## Rischi per gli interessati (art. 35, § 7, lett. c) e misure (lett. d)

| Rischio | Gravita' stimata | Probabilita' stimata | Misure gia' in atto | Misure da valutare |
|---|---|---|---|---|
| Ri-identificazione delle parti da parte del fornitore AI nonostante la redazione (dettagli indiretti nel testo libero: indirizzi, importi, circostanze uniche) | Media-alta (dati potenzialmente su minori/famiglia) | Media | Redazione preventiva su nomi e identificatori diretti (PRIV-08/09) | Estendere il riconoscimento a piu' pattern; valutare un secondo passaggio di revisione umana del testo prima dell'invio per i casi piu' sensibili |
| Accesso non autorizzato ai dati salvati lato server | Alta | Bassa dopo PRIV-09 (fix del controllo di accesso su `/api/analisi`) | Token di accesso casuale a 32 byte per analisi; autenticazione admin ora uniformata su verifyAdminToken | Rotazione periodica di ADMIN_SECRET/ADMIN_PASSWORD; log degli accessi admin |
| Output AI errato o allucinato usato senza verifica (es. una bozza di accordo con clausole scorrette) | Alta (effetti legali reali) | Media | Disclaimer diffusi sul sito che richiedono verifica professionale | Nessuna misura tecnica impedisce oggi l'uso diretto dell'output; valutare un passaggio di conferma esplicita prima dell'export/uso del documento |
| Conservazione dei dati oltre il dichiarato | Media | Bassa dopo PRIV-09 (job di retention reso indipendente dal traffico) | Cancellazione automatica ogni ora oltre i 30 giorni | Monitoraggio/alert se il job fallisce ripetutamente |
| Trasferimento extra-UE senza base giuridica adeguata | Alta | Da verificare | Privacy policy dichiara le clausole contrattuali standard | Verificare che le SCC risultino effettivamente sottoscritte con Anthropic e Google (non verificabile dal codice) |

## Consultazione (art. 35, § 9)

Da valutare se raccogliere un parere di mediatori/avvocati che gia' usano lo
strumento sull'accettabilita' delle misure di minimizzazione adottate,
specialmente per i casi di mediazione familiare con minori coinvolti.

## Esito e prossimi passi

Questo documento non contiene una conclusione sul livello di rischio residuo:
quella valutazione, e l'eventuale decisione di consultare il Garante ex art.
36 GDPR se il rischio residuo risultasse elevato, spetta al titolare. I punti
aperti evidenziati sopra (consenso/informativa specifica per l'AI, verifica
delle SCC sottoscritte, eventuale secondo livello di revisione umana) sono il
punto di partenza suggerito per completare la valutazione.
