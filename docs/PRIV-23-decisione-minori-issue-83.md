# PRIV-23 — Minori e mediazione familiare: istruttoria per la decisione (issue #83)

Data: 9 ottobre 2026
Stato: **bozza istruttoria per la decisione del titolare**; nessuna modifica al codice e a
nessun flag. Scadenza indicata per la decisione: 16 ottobre 2026.

## 1. Che cosa chiede l'issue #83 (PRIV-02-D)

Tre punti, da chiudere con una decisione motivata del titolare:

1. valutare una categorizzazione esplicita della pratica come «mediazione familiare» al
   momento della creazione, per attivare presidi differenziati;
2. valutare se limitare o disattivare la modalità «alta precisione (AI)» per questa
   categoria;
3. registrare la decisione, con eventuale rinvio a un intervento tecnico separato.

## 2. Che cosa esiste già nel codice (verificato su `main`)

| Presidio | Dove | Effetto |
|---|---|---|
| Domanda obbligatoria «la pratica contiene o può contenere dati di minori?» (sì / no / non so), senza valore preselezionato | `client/src/pages/AnalisiCasoAI.tsx` | `sì` e `non so` attivano il percorso rafforzato |
| Preflight a due fasi con token firmato, monouso, prima del parser | `server/security/minors-preflight.ts` | Senza token valido la richiesta è rifiutata prima di leggere il contenuto |
| Rilevamento prudenziale di riferimenti a minori dopo il parsing e prima del provider | `server/security/minors-detection.ts` | Se il preflight dice `no` ma il testo indica un minore, la richiesta è bloccata |
| Flag del percorso minori, **spento** (`minorsPathEnabled = false`) | `server/routes.ts`, `isMinorsPathEnabled()` | Con `sì` o `non so` l'analisi non parte: nessun invio a provider |
| Registro minimizzato delle attestazioni (max 30 giorni, cancellabile) | `getMinorsAuditTrail`, `deleteMinorsAuditEntry` | Solo se il percorso fosse abilitato |

Conseguenza pratica: **oggi nessuna pratica con minori può essere inviata ai flussi AI**.
Il testo di PRIV-17 (12 settembre) parla ancora di «specifica non implementata»: va
riletto come specifica ora realizzata ma non abilitata (v. punto 6).

## 3. Punto 1 — Categoria «mediazione familiare»

Una nuova categoria in fase di creazione non aggiunge tutela rispetto alla domanda sui
minori: nella mediazione familiare (d.m. 151/2023; art. 12-bis disp. att. c.c.) la
presenza di minori è la regola, ma non è l'unico rischio (violenza domestica, dati
sanitari, dati economici), e una casella scelta dall'utente può essere sbagliata come
la risposta sui minori. Tuttavia ha un valore diverso: serve a **bloccare o limitare**
categorie intere.

Opzioni:

- **1-A. Nessuna nuova categoria.** Resta la domanda sui minori, già fail-closed.
  Più semplice; il blocco dipende da una risposta onesta e dal rilevamento prudenziale.
- **1-B. Domanda aggiuntiva** «la pratica riguarda una mediazione familiare o la
  separazione dei genitori?», con esito di blocco finché non è approvato un percorso
  specifico. Poche righe di codice nel preflight; riduce il rischio di una risposta
  `no` sui minori in pratiche familiari.
- **1-C. Percorso differenziato** per la mediazione familiare con presidi propri (altre
  conferme, prompt dedicati, esclusione di dati sanitari e di violenza). È un lavoro
  ampio e non è giustificato finché il percorso minori resta spento.

**Proposta: 1-B** (blocco, non percorso), perché costa poco, è coerente con la scelta C
di PRIV-21 (perimetro limitato) e protegge il caso più frequente.

## 4. Punto 2 — Alta precisione (AI) nell'antiriciclaggio

Il flusso antiriciclaggio con documenti (`/api/aml-extract`) tratta documenti d'identità,
visure e procure, non pratiche familiari; non passa dal preflight minori. Dalla
decisione PRIV-21 l'assistente antiriciclaggio è comunque **escluso** dall'Allegato A
dell'accordo art. 28. L'intervento ha dunque già effetto senza ulteriori limiti: nei
documenti d'identità di un minore l'uso resta una scelta dell'utente.

Opzione ulteriore, facoltativa: aggiungere all'avviso della funzione la frase «Non
caricare documenti di persone di età inferiore a 18 anni» e verificare nel testo
dell'informativa che l'avviso sia presente. **Proposta:** solo l'avviso, nessun blocco
tecnico (il documento non consente di riconoscere in modo affidabile l'età senza
trattare il dato).

## 5. Punto 3 — Decisione da registrare

Formula proposta (da adottare, modificare o respingere):

> Il titolare decide che, nel perimetro dell'alternativa C (PRIV-21), le pratiche con
> dati di minori restano escluse dai flussi AI e il percorso a presidi rafforzati
> (PRIV-17) resta disabilitato (`minorsPathEnabled = false`). Si aggiunge al preflight
> una domanda sulla mediazione familiare o sulla separazione dei genitori, con effetto
> di blocco. Nell'assistente antiriciclaggio si aggiunge l'avviso di non caricare
> documenti di minori. L'abilitazione del percorso minori richiede una decisione
> separata, dopo DPIA con scenario minori, aggiornamento di registro, informativa e
> accordo art. 28, e riesame indipendente (criteri di PRIV-17).

Motivazione: il trattamento di dati di minori richiede tutela rafforzata; le garanzie di
contratto con i fornitori restano parzialmente aperte (PRIV-12, PRIV-19); i flussi AI sono
rivolti, oggi, ai soli casi per cui si può escludere la presenza di minori.

## 6. Interventi tecnici collegati (non eseguiti)

1. Domanda aggiuntiva su mediazione familiare nel preflight e test di accettazione
   (n. 1–3 di PRIV-17 estesi).
2. Frase di avviso nella pagina dell'antiriciclaggio.
3. Aggiornare PRIV-17: stato «realizzato, non abilitato», con rinvio a questa nota.
4. Verificare che i testi del sito (informativa, termini) dicano che i dati di minori
   non vanno inseriti.

## 7. Come si chiude l'issue

Quando il titolare ha registrato la decisione in questa nota (data e firma o commit
autenticato) e, se approva i punti 6.1–6.2, aperto l'intervento tecnico separato.

Decisione del titolare: [ ] approvata  [ ] approvata con modifiche  [ ] respinta
Data: ________   Titolare: Carlo Alberto Calcagno
