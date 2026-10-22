# PRIV-22 — Bozza di valutazione documentata ex art. 6, par. 4, AI Act per l'Analisi AI del caso

Data: 9 ottobre 2026
Stato: **bozza istruttoria per il titolare**, non una valutazione definitiva né un parere
legale. Le conclusioni sono ipotesi di lavoro che il titolare deve fare proprie, o
correggere, e firmare. Seguito di PRIV-20 (azioni 2–4).

## 1. A che cosa serve

L'Allegato III, punto 8, lett. a), del Regolamento (UE) 2024/1689 include fra i sistemi
ad alto rischio quelli destinati a essere usati da un'autorità giudiziaria, o per suo
conto, per assisterla nella ricerca e nell'interpretazione dei fatti e del diritto e
nell'applicazione della legge a una serie concreta di fatti, **o a essere usati in modo
analogo nella risoluzione alternativa delle controversie**. L'Analisi AI del caso, con
analisi giuridica e bozza di accordo, ne è un candidato (PRIV-20, § 4).

Il fornitore che ritiene non ad alto rischio un sistema dell'Allegato III deve
**documentare la valutazione prima della messa in servizio**, registrarsi nella banca dati
UE (art. 6, par. 4; art. 49, par. 2) e mettere la documentazione a disposizione delle
autorità che la chiedano. Una classificazione sbagliata è sanzionabile: art. 80 del
Regolamento, art. 23, comma 2, d.lgs. 179/2026 (fino a 15 milioni di euro o 3% del
fatturato, con criterio ridotto per PMI e microimprese). Questa bozza è la base di quel
documento.

## 2. Descrizione del sistema

| Voce | Contenuto |
|------|-----------|
| Fornitore | Titolare del sito (sviluppa il sistema e lo mette in servizio con il proprio nome) |
| Modello | Modello di uso generale di Anthropic (fornitore del modello), via API commerciale |
| Utenti previsti | Professionisti e organismi di mediazione (deployer) |
| Finalità prevista | Supporto **preparatorio** al professionista: mappare il caso e preparare la trattativa |
| Dati | Testi e PDF del fascicolo, pseudonimizzati best-effort; minori e dati degli artt. 9 e 10 GDPR esclusi |
| Output | Analisi in otto fasi e bozza di accordo, presentate come bozze da verificare |
| Uso escluso | Decisioni, proposte vincolanti, sostituzione del mediatore, uso in seduta |
| Conservazione | Analisi per un massimo di 30 giorni |

## 3. Passo 1: rientra nell'Allegato III, punto 8, lett. a)?

Ipotesi prudente: **sì, o non si può escludere**. Lo strumento è usato dal mediatore o dal
difensore e non da un'autorità giudiziaria, ma la formula «in modo analogo» nella
risoluzione alternativa delle controversie è ampia, e due fasi (analisi giuridica e bozza
di accordo) assistono nell'applicazione del diritto a fatti concreti. Si procede quindi
come se il sistema rientrasse nell'Allegato III e si verifica l'esenzione.

## 4. Passo 2: condizioni dell'esenzione (art. 6, par. 3)

Il sistema non è ad alto rischio se non presenta un rischio significativo per salute,
sicurezza o diritti fondamentali, anche perché non influenza materialmente l'esito del
processo decisionale, e se soddisfa almeno una di quattro condizioni.

| Condizione | Esito | Motivo |
|------------|-------|--------|
| a) compito procedurale limitato | No | L'analisi giuridica non è un compito meramente procedurale |
| b) miglioramento del risultato di un'attività umana già completata | No | Lo strumento interviene prima, non dopo |
| c) rilevazione di schemi decisionali senza sostituire o influenzare la valutazione umana | Non invocabile | Le fasi producono valutazioni, non solo rilevazioni |
| d) compito **preparatorio** a una valutazione rilevante | **Sì** | L'output prepara la valutazione del mediatore e la decisione delle parti |

Si invoca perciò la **lettera d)**. Elementi a sostegno: l'output è dichiarato bozza da
verificare; non decide e non propone in nome del mediatore; la decisione spetta alle
parti; l'uso in seduta e la sostituzione del mediatore sono esclusi (dispensa § 3.9.5).

Elementi di debolezza da tenere presenti:

- una bozza di accordo ben scritta può essere adottata senza revisione (rischio di
  *automation bias*);
- le probabilità e i valori attesi hanno un'apparenza di precisione, mentre variano da
  una prova all'altra (nel caso di prova, 18.193 € e 19.699 €);
- si «influenza» la valutazione umana anche senza sostituirla: per questo servono
  verifica umana effettiva e avvertenze visibili.

## 5. Passo 3: profilazione (il punto critico)

L'esenzione **non vale** se il sistema effettua profilazione di persone fisiche (art. 6,
par. 3, ultimo comma; profilazione ai sensi dell'art. 4, n. 4, GDPR: trattamento
automatizzato di dati personali per valutare aspetti personali, in particolare, fra l'altro,
comportamento, preferenze, affidabilità, situazione economica).

**Rilievo emerso dalla lettura dei prompt (server/ai/controllo-cognitivo.ts).** La fase
«bias cognitivi» chiede, per ciascun bias, il livello di rischio da 1 a 5, «come si manifesta
nel caso specifico» e le strategie di mitigazione, avendo in ingresso l'elenco delle parti. Il
testo non vieta di attribuire un bias a una persona determinata, e l'output può quindi
leggersi come una valutazione del comportamento o delle tendenze di una parte. Può
configurarsi, in questo modo, profilazione. Lo stesso rischio, più attenuato, riguarda la
guida strategica («cosa esplorare con ciascuna parte» nel caucus) e la fase degli interessi
latenti, che attribuiscono motivazioni alle parti.

Alternative:

| Opzione | Contenuto | Effetti |
|---------|-----------|---------|
| A. Riformulare | I prompt descrivono i **rischi della trattativa e della situazione** (ad esempio l'effetto di ancoraggio della cifra della domanda) e non le tendenze di una persona; vietano espressamente di attribuire tratti, motivazioni o tendenze a una parte; formulano ipotesi e domande aperte | Riduce il rischio di profilazione; si perde parte della personalizzazione |
| B. Eliminare | Si toglie la fase dei bias (e si limita la guida strategica) | Massima sicurezza della classificazione; perde un elemento didattico del servizio |
| C. Mantenere e trattare come alto rischio | Si assumono gli obblighi del fornitore (sistema di gestione dei rischi, documentazione tecnica, registrazione, sorveglianza umana, valutazione di conformità) | Oneri sproporzionati per un servizio gratuito; da escludere salvo scelta diversa |

**Indicazione di lavoro (non una decisione): A**, con test prima dell'invocazione
dell'esenzione.

## 6. Test proposti prima di invocare l'esenzione

Con casi sintetici (quelli già usati per la dispensa e almeno altri due, anche con persone
fisiche):

1. L'output non contiene frasi del tipo «la parte X è sovrastimatrice / ha tendenza a»;
   descrive dinamiche della trattativa e domande da porre.
2. I valori numerici rinviano a un calcolo da riverificare; l'avvertenza di verifica è
   presente in ogni fase.
3. L'esportazione PDF e lo storico riportano la dicitura di origine IA.
4. Nessun output qualifica una persona (affidabilità, solvibilità, intenzioni).

Criterio: nessuna violazione su tutti i casi; in caso contrario, correggere i prompt e
ripetere.

## 7. Rischi per i diritti fondamentali e misure

| Rischio | Misura |
|---------|--------|
| Errori e allucinazioni | Avvertenza di verifica; fonti da controllare; calcoli ricontrollati con strumenti deterministici |
| Pregiudizi (bias) dell'output | Divieto di attribuire tratti alle persone; test; revisione dei prompt |
| Automation bias | Bozze dichiarate tali; dispensa e regole di buona pratica; nessun uso in seduta |
| Riservatezza | Pseudonimizzazione best-effort, minimizzazione, conservazione limitata, accordo art. 28, esclusione di minori e dati degli artt. 9 e 10 |
| Equità verso le parti | L'analisi è per il professionista; le parti sono informate dell'uso dell'IA (art. 13 L. 132/2025) |
| Trasparenza | Sistema di IA dichiarato; informativa; documentazione interna aggiornata |

## 8. Se si invoca l'esenzione: adempimenti

1. Firma del titolare e data di questa valutazione, **prima** della messa in servizio per
   dati reali di terzi.
2. Registrazione del sistema nella banca dati UE (art. 49, par. 2) nei termini applicabili
   (il Digital Omnibus approvato dal Consiglio il 29 giugno 2026 sposta al 2 dicembre 2027
   l'applicazione degli obblighi dell'Allegato III: da riscontrare nella Gazzetta ufficiale
   dell'Unione europea).
3. Conservare la documentazione e tenerla disponibile per ACN su richiesta.
4. Verificare se la Commissione abbia pubblicato le linee guida sulla classificazione
   (art. 6, par. 5) e adeguare la valutazione.
5. Riesame almeno annuale e a ogni modifica sostanziale di prompt, modello o finalità.
6. Canale per i reclami (PRIV-20, azione 5).

## 9. Decisione del titolare

| Decisione | Scelta |
|-----------|--------|
| Opzione sulla fase dei bias | **A (riformulare)** — approvata dal titolare il 9 ottobre 2026 |
| Invocare l'esenzione dell'art. 6, par. 3, lett. d) | **Sì, condizionata** al superamento dei test del § 6 — approvata il 9 ottobre 2026 |
| Data della valutazione | da apporre quando i test sono superati |
| Firma | ____________ |

## 10. Stato dell'attuazione (9 ottobre 2026)

- **Fatto:** prompt delle fasi «bias cognitivi», «compatibilità degli interessi», «guida
  strategica» e «MAAN/BATNA» con le regole comuni in `server/ai/regole-no-profilazione.ts`
  (divieto di valutare caratteristiche personali, di attribuire bias a una parte
  determinata, di prevedere comportamenti; interessi come ipotesi da verificare). Test
  automatico `server/ai/prompt-no-profilazione.test.ts` (controlla che le regole siano nei
  prompt e che le vecchie formulazioni non tornino).
- **Non ancora fatto:** i test del § 6 su output reali. Servono una chiave API e la lettura
  degli output; lo script `server/ai/prova-profilazione.ts` esegue tre casi sintetici e
  cerca attribuzioni a persone, ma il controllo automatico non sostituisce la lettura.
  Esito dello script: 0 nessuna violazione, 1 violazioni, 2 chiave mancante.
- **Dopo i test:** firmare questa valutazione, registrare il sistema nella banca dati UE nei
  termini applicabili e predisporre il canale reclami (§ 8).

Fino a quando i test non sono superati e la valutazione non è firmata, l'esenzione non va
presentata come accertata. (Firmata il 22 ottobre 2026: v. § 12.)

## 11. Esito dei test del 21 ottobre 2026

**Prova.** Tre casi sintetici (locazione commerciale, contratto di fornitura, divisione di un
immobile ereditato) con `server/ai/prova-profilazione.ts`, chiave API temporanea, fasi «bias
cognitivi», «compatibilità degli interessi» e «guida strategica».

**Sequenza.**

| Passaggio | Segnalazioni del controllo automatico |
|-----------|---------------------------------------|
| Prima prova, prompt come da § 10 | 17 |
| Dopo la riscrittura dei prompt su Teoria del Prospetto e Decision Analysis | 4 |
| Dopo gli esempi espliciti nei prompt | 7 |
| Dopo l'introduzione della guardia sull'output (`server/ai/guardia-no-profilazione.ts`) | nessuna |

La guardia rilegge ogni risposta, riscrive in forma impersonale le frasi che attribuiscono a
una parte percezioni, preferenze, stime o comportamenti e, se la riscrittura non basta, omette
la frase con un avviso; riconosce i nomi reali delle parti, i ruoli, i soggetti descrittivi
(«chi abita l'immobile») e un elenco esteso di verbi. Nella prova finale ha riscritto circa
venti frasi e ne ha omesse cinque; nei log restano solo i conteggi.

**Controllo di significato.** Un secondo passaggio del modello, che avrebbe dovuto indicare le
righe problematiche anche senza parole-spia, è stato provato e disattivato: con il modello in
uso rispondeva in modo incoerente (elenchi di tutte le righe, testo al posto dei numeri,
falsi positivi). Resta disponibile solo con un'impostazione esplicita (`GUARDIA_REVISORE_LLM=1`).

**Lettura umana dell'output finale** (circa 2.800 righe). Il controllo automatico dà esito
positivo, ma la lettura trova ancora circa 35–40 righe, quasi tutte nella fase dei bias, con
attribuzioni formulate come ipotesi («il debitore può rifiutare…», «entrambe le parti
potrebbero sopravvalutare la probabilità di vincere», «per F.G. la mancata ricezione può essere
interpretata come perdita di un diritto», «chi abita l'immobile potrebbe sopravvalutare…»).
Nelle fasi su interessi e guida strategica gli interessi sono formulati come ipotesi da
verificare e come domande.

**Esito rispetto ai criteri del § 6.** I criteri 2–4 (valori numerici come ipotesi di calcolo,
dicitura di origine IA, nessuna qualifica di affidabilità, solvibilità o intenzioni) risultano
rispettati. Il criterio 1 («nessuna frase del tipo "la parte X ha tendenza a"») non è
soddisfatto in senso letterale: restano frasi ipotetiche sulle dinamiche che possono riguardare
una parte.

**Decisione del titolare (21 ottobre 2026).** Sono state valutate tre soluzioni: lasciare la fase
dei bias com'è, anonimizzare le parti nell'input della fase, tornare al testo precedente al
9 ottobre. Il titolare ha scelto di lasciare la fase com'è (senza anonimizzare), con le regole
nei prompt e la guardia sull'output, accettando il rischio residuo descritto sopra, perché le
attribuzioni sono ipotetiche e il testo è una bozza di lavoro che il professionista verifica.

**Argomenti del titolare a sostegno della scelta (21 ottobre 2026).** Il titolare ha rilevato che
(a) le frasi sono formulate sempre al condizionale, come ipotesi e non come constatazioni, e per
questo non ravvisa un rischio elevato; (b) le note sui bias cognitivi non sono visibili ad alcuno
se non al mediatore, che le usa come strumento di lavoro. Gli argomenti sono registrati come
valutazione del titolare. Si osserva che il condizionale attenua l'effetto della frase ma non
cambia il suo oggetto, e che il rilievo della visibilità limitata ai soli professionisti riduce
l'esposizione senza escludere che la frase riguardi una persona identificabile; per questo il
rischio resta qualificato come residuo e accettato, e la firma della scheda 5 spetta al titolare.

**Misure che accompagnano la scelta.**

- avvertenza di bozza da verificare in ogni fase e dicitura di origine IA (§ 6, punti 2–3);
- guardia sull'output attiva nelle quattro fasi che trattano di persone;
- revisione del professionista prima di qualunque uso;
- nuova prova (script e lettura) a ogni modifica dei prompt della fase dei bias;
- possibilità di spegnere la fase dei bias se emergessero attribuzioni più nette (opzione B del
  § 9) e di anonimizzare le parti (soluzione già predisposta e non adottata).

**Punto da valutare con attenzione.** L'art. 6, par. 3, ultimo comma, AI Act esclude
l'esenzione quando il sistema effettua profilazione di persone fisiche. Se le frasi ipotetiche
residue fossero ritenute una valutazione di aspetti personali delle parti (art. 4, n. 4, GDPR),
l'esenzione non sarebbe invocabile e il sistema andrebbe trattato come ad alto rischio. La
valutazione e la firma spettano al titolare.

**Aperto.** L'output della fase dei bias si interrompe per limite di lunghezza oltre i
45.000 caratteri circa; da risolvere a parte.

## 12. Firma della valutazione (22 ottobre 2026)

Il titolare ha firmato il 22 ottobre 2026 la scheda 5, versione 2 («Decisione del titolare»),
barrando **«Approvo con riesame»**: invoca l'esenzione dell'art. 6, par. 3, lett. d), AI Act e
accetta il rischio residuo sulla fase dei bias alle misure e alle condizioni seguenti.

**Misure.** Quelle del § 11, con in più l'esclusione della sezione «Controllo Bias Cognitivi»
dal PDF dell'Analisi AI per impostazione predefinita (da attuare con modifica al codice: nel
PDF attuale la sezione è inclusa, quindi l'argomento «le note sono visibili solo al mediatore»
regge solo se il mediatore non consegna il PDF ad altri).

**Condizioni di spegnimento della fase dei bias (opzione B).** Se (a) in una rilettura di
campione compare una frase che attribuisce a una parte, in forma non ipotetica, una
caratteristica, un atteggiamento o un comportamento; (b) arriva un reclamo sul punto; (c) la
Commissione o l'autorità competente pubblica indicazioni che portino a ritenere l'esenzione non
invocabile.

**Riesame.** Entro sei mesi dalla firma (**22 aprile 2027**), o dopo i primi casi reali con dati
di terzi se anteriori, con lettura di un campione degli output.

**Annotazione.** La scheda firmata è conservata dal titolare. Il margine di incertezza
sull'ultimo comma dell'art. 6, par. 3, AI Act (profilazione) resta indicato nella scheda: la
decisione è con riesame e non senza riserve.

| Decisione | Scelta |
|-----------|--------|
| Rischio residuo sulla fase dei bias | Accettato con le misure e le condizioni sopra |
| Esenzione art. 6, par. 3, lett. d) | Invocata con riesame |
| Data della valutazione | 22 ottobre 2026 |
| Firma | Apposta dal titolare sulla scheda 5 (versione 2) |

Restano da fare: esclusione della sezione dei bias dal PDF di default; registrazione nella banca
dati UE nei termini applicabili (§ 8, punto 2); data di attivazione dell'accordo art. 28.
