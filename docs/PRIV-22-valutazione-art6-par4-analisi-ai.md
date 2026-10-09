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
presentata come accertata.
