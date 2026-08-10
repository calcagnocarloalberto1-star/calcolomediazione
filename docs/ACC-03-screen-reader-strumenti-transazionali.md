[ACC-03-screen-reader-strumenti-transazionali.md](https://github.com/user-attachments/files/30893266/ACC-03-screen-reader-strumenti-transazionali.md)
# ACC-03 — Test con screen reader sugli strumenti transazionali

Documento interno di processo. Origine: audit professionale dell'8 agosto
2026, issue GitHub #28 (P1). Prosegue [ACC-01](../docs) (fix iframe
antiriciclaggio) e [ACC-02](./ACC-02-navigabilita-tastiera.md) (nomi
accessibili e navigabilità da tastiera sui 4 strumenti principali).

## Metodo e limiti

Come per ACC-02, non sono uno specialista di accessibilità e non sostituisco
un audit umano con screen reader reale (NVDA/VoiceOver/JAWS). Ho usato
`page.accessibility.snapshot()` di Playwright — l'albero di accessibilità
calcolato dal browser, lo stesso dato letto dagli screen reader — per
misurare in modo oggettivo e riproducibile due cose distinte sui 7 strumenti
richiesti dai criteri di accettazione (Calcolatore Indennità, Confronto
Costi, Costi Notarili, Generatore Procura, Analisi AI del Caso,
Antiriciclaggio, Calcolo Assegni):

1. **Nome accessibile di ogni controllo di form** (già coperto per i primi 4
   strumenti in ACC-02; qui esteso ad Antiriciclaggio, Costi Notarili,
   Calcolo Assegni).
2. **Annuncio di risultati/errori dinamici** (`aria-live`/`role="status"`/
   `role="alert"`), dimensione non testata in ACC-02 e richiesta
   esplicitamente dai criteri di accettazione di questa issue.

Con priorità sulla pagina **/antiriciclaggio**, esplicitamente indicata
nell'issue come "già critica in fase di ispezione automatica dell'albero di
accessibilità".

## Esito del test su /antiriciclaggio confrontato con la correzione applicata in ACC-01

ACC-01 (commit `d3aed68`) aveva risolto il problema più grave: un `<iframe>`
che nascondeva **tutto** il contenuto del modulo all'albero di
accessibilità (0 input, 0 label, 64 nodi a11y esposti prima della
correzione → 195 input, 219 label, 674 nodi dopo). Da allora il modulo è
raggiungibile e navigabile, ma ACC-01 non aveva verificato — perché non era
il suo perimetro — se i controlli ora esposti avessero anche un **nome
accessibile** corretto.

Questo test lo ha verificato con `page.accessibility.snapshot()` e ha
trovato che **non lo avevano**: su 135 controlli di form visibili al
caricamento (textbox/combobox/checkbox), **39 risultavano privi di nome
accessibile** (30 select + 9 campi di testo) — un utente con screen reader
sentiva il controllo ("combo box", "text box") ma non a cosa si riferisse,
nonostante l'etichetta fosse visibile a schermo a fianco del campo.

Causa: il file è HTML statico scritto a mano, non un componente React. Su
**220 elementi `<label>`** presenti nel file, **zero** avevano l'attributo
`for=` che li collega programmaticamente al controllo — la stessa classe di
difetto (associazione label↔controllo assente) individuata nei componenti
React con ACC-02, ma qui sistemica su un intero modulo di conformità
antiriciclaggio da 235 campi.

## Correzioni applicate su /antiriciclaggio

**1. Associazione `label` → controllo mancante (122 campi).** Ho scritto
uno script (BeautifulSoup, verifica statica del DOM) che ha analizzato tutti
i 219 `<label>` del file: 97 avvolgono già correttamente il proprio
controllo (pattern valido, es. `<label class="cbrow"><input type="checkbox"
...> testo</label>` sulle checkbox — nessuna modifica necessaria) e **122**
seguono invece il pattern rotto (label come fratello del controllo, non
associato):
```html
<div class="field"><label>Denominazione Organismo</label><div class="hint">...</div><input id="odm_nome" type="text" ...></div>
```
Per questi 122, ho verificato — programmaticamente, non a occhio — quale
controllo ciascuna etichetta descrive (il primo controllo con `id` trovato
nello stesso contenitore `.field`), controllato che ogni `id` di
destinazione esista davvero nel file e che nessun `id` venga usato due
volte, poi ho aggiunto `for="id-del-controllo"` a ciascuna delle 122
etichette. Il diff risultante tocca solo gli attributi dei tag `<label>`
(11 righe del file, che raggruppano più campi ciascuna essendo il file
scritto in gran parte su poche righe lunghe): nessun testo visibile,
nessuno stile, nessuna riga di logica applicativa modificata. Un'occorrenza
letterale di `<label>` **non** è stata toccata perché non è markup HTML ma
una stringa JavaScript dentro `<script>` (widget checkbox generato a runtime
per l'assistente AI, già corretto di suo — l'input vi è avvolto
correttamente dal proprio `<label>`).

**2. Select dentro tabelle di rischio, senza alcun `<label>` disponibile
(11 campi).** Le tabelle dei punti 9 e 10 ("Valutazione del rischio della
parte" e "della prestazione") usano celle di tabella (`<td
class="elname">Natura giuridica</td>`) come etichetta visiva di riga — un
pattern per cui non esiste alcun `<label>` HTML da collegare. Ho aggiunto
`aria-label` direttamente sugli 11 `<select>` interessati, usando
esattamente il testo della cella visibile della stessa riga (coerenza
nome-visibile/nome-accessibile, WCAG 2.5.3).

**3. Campi liberi "Altro: specificare" senza etichetta (12 campi).** In
tutte le liste a caselle di controllo del modulo, l'opzione "Altro" è
seguita da un campo di testo libero completamente privo di etichetta
programmatica (solo un placeholder generico "specificare", che non è
un'etichetta affidabile — sparisce alla digitazione e non tutti gli screen
reader lo annunciano). Aggiunto `aria-label` contestuale a ciascuno dei 12
campi (es. `identfonte_altro_txt` → "Altro — specificare la fonte o
modalità di riscontro"), usando il testo del gruppo di appartenenza per
mantenere il significato preciso di cosa si sta specificando.

**4. Intervista trigger UIF T1–T7, generata via JavaScript (7+7 campi).**
Il blocco "Motore trigger UIF" (funzione `buildTriggers()`) genera a runtime
7 pulsanti di attivazione ("No"/"Sì", testo generico privo di contesto per
chi naviga per elenco di pulsanti) e 7 campi di dettaglio facoltativo, anche
questi privi di etichetta. Aggiunto `aria-label` dinamico a entrambi,
costruito dal testo del trigger stesso (es. "T2 — Incoerenza lite / accordo
(sproporzione): segnale presente?").

**Totale nomi accessibili aggiunti su /antiriciclaggio: 152** (122 label
associate + 11 select in tabella + 12 campi "Altro" + 7 pulsanti trigger).
Verificato dopo il fix: **zero controlli senza nome accessibile**, sia sui
135 controlli visibili al caricamento sia forzando la visibilità di tutte
le sezioni condizionali (238 controlli totali nel DOM).

## Annuncio di risultati e messaggi dinamici (nuova dimensione, tutti i 7 strumenti)

Non testata in ACC-02. Ho verificato se le aree del DOM che cambiano dopo
un calcolo, un errore o un'azione asincrona hanno `aria-live`/`role`, così
che uno screen reader le annunci senza che l'utente debba ri-esplorare la
pagina.

| Strumento | Area verificata | Prima | Dopo |
|---|---|---|---|
| Calcolatore Indennità | Card risultato (`card-risultato`) | nessuno | `role="status"` `aria-live="polite"` |
| Confronto Costi | Riepilogo a 5 card (Mediazione/Arbitrato/MedyaPro/…) | nessuno | `role="status"` `aria-live="polite"` sul riepilogo (le tabelle di dettaglio sotto restano senza, per non generare annunci eccessivi a ogni tasto premuto) |
| Costi Notarili | Totali (con mediazione / con sentenza / risparmio) | nessuno | riepilogo dedicato, invisibile a schermo (`sr-only`) con `role="status"` `aria-live="polite"`, accanto alla tabella di dettaglio invariata |
| Generatore Procura | Esito generazione documento | già gestito da `toast()` (Radix Toast, annuncio integrato) | nessuna modifica necessaria |
| Analisi AI del Caso | Card di avanzamento pipeline; indicatori "in corso" per scheda; log chat con l'AI | nessuno su nessuna delle tre | `role="status"` `aria-live="polite"` su avanzamento e indicatori "in corso"; `role="log"` `aria-live="polite"` sul contenitore della chat (copre anche i messaggi di errore, resi come normali messaggi dell'assistente) |
| Antiriciclaggio | `trigOut`, `autoRiskRow`/`riskBadge`, `autosave_ind`, `out` (anteprima modelli generati), `assist_status`, `assist_answer` | nessuno (0 occorrenze di `aria-live` in tutto il file) | `role="status"` `aria-live="polite"` su tutte e 6 le aree |
| Calcolo Assegni | 3 pannelli risultato (coniuge/divorzile/figli) | **già presente** `aria-live="polite"` | nessuna modifica necessaria; aggiunto in più `role="alert"` sui 10 messaggi di errore di validazione per campo (`data-err`), prima privi di ruolo ARIA proprio |

Calcolo Assegni e (per l'esito principale) Generatore Procura erano già
corretti — rispettivamente per una scelta di implementazione dedicata e per
l'uso della libreria Radix Toast, che integra di suo un annuncio
accessibile. Gli altri 5 strumenti ne erano completamente privi.

## Verificato, nessun problema

- Tutti i 7 strumenti caricano correttamente (200) dopo le modifiche.
- **Nessuna modifica visiva**: verificato con screenshot prima/dopo su
  Antiriciclaggio (tabelle di rischio, intervista trigger) e Costi Notarili
  — pixel-identici salvo i dati di test inseriti.
- **Nessuna regressione funzionale**: compilazione di un campo, selezione
  di un valore, calcolo, tutto verificato via Playwright su Calcolatore e
  Costi Notarili dopo le modifiche.
- `npx tsc --noEmit`, `npm test` (tutte le suite, incluso il nuovo Test 11
  di UX-05) e `npm run build` completati senza errori dopo ogni gruppo di
  modifiche.
- Diff su `antiriciclaggio.html` e `calcolo-assegni/index.html`
  chirurgico: solo attributi ARIA aggiunti, verificato riga per riga con
  `git diff` — nessun testo visibile, nessuno stile, nessuna riga di script
  applicativo alterata (a parte le 2 righe di `buildTriggers()` dove
  l'`aria-label` è generato dinamicamente, comunque senza toccare la logica
  esistente).

## Non verificato — richiede test umano

- **Screen reader reale** (NVDA, VoiceOver, JAWS): come già segnalato in
  ACC-02, questi test misurano il dato che uno screen reader riceve, non
  sostituiscono l'ascolto reale — specialmente per il modulo Antiriciclaggio,
  il più esteso e con più stati condizionali (sezioni che appaiono/
  scompaiono in base alle risposte).
- **Verbosità degli annunci `aria-live="polite"`** su Confronto Costi e
  Costi Notarili: questi due strumenti ricalcolano il risultato a ogni
  carattere digitato (non c'è un pulsante "Calcola" come nel Calcolatore
  Indennità). Ho limitato l'area `aria-live` al solo riepilogo essenziale
  proprio per contenere il numero di annunci, ma solo un ascolto reale può
  confermare che il livello di verbosità risultante sia adeguato e non
  fastidioso.
- **Flusso di download del Generatore Procura**: non verificato (già
  segnalato come limite in ACC-02).
- **Assistente AI di lettura documenti** in Antiriciclaggio
  (`assist_status`/`assist_answer`): ho aggiunto `aria-live`, ma non ho
  potuto testare l'interazione end-to-end perché richiede una vera chiamata
  all'API Anthropic con documenti caricati.

## File modificati

- `client/public/antiriciclaggio.html`: 122 `<label for=...>` aggiunti; 11
  `aria-label` su select di tabella; 12 `aria-label` su campi "Altro:
  specificare"; 7+7 `aria-label` dinamici sul motore trigger UIF; 6
  `role="status" aria-live="polite"` su aree di output dinamico.
- `client/src/pages/CostiNotarili.tsx`: `aria-label` su 2 `SelectTrigger`
  (uno dei quali condizionale) e 2 `Switch`; riepilogo `sr-only` con
  `aria-live="polite"` accanto alla tabella di confronto.
- `client/src/pages/Calcolatore.tsx`: `role="status" aria-live="polite"`
  sulla card del risultato.
- `client/src/pages/ConfrontoCosti.tsx`: `role="status" aria-live="polite"`
  sul riepilogo a 5 card.
- `client/src/pages/AnalisiCasoAI.tsx`: `role="status" aria-live="polite"`
  su card di avanzamento e indicatori "in corso" per scheda;
  `role="log" aria-live="polite"` sul log della chat con l'AI.
- `client/public/calcolo-assegni/index.html`: `role="alert"` sui 10
  messaggi di errore di validazione per campo.

Nessuna modifica a layout, testi visibili o logica di calcolo in nessuno
dei file — solo metadati di accessibilità (associazioni label/controllo,
`aria-label`, `aria-live`, `role`).

## Archivio delle verifiche

| Data | Esito |
|---|---|
| 2026-08-10 | Test automatizzato (Playwright, `accessibility.snapshot()`) sui 7 strumenti richiesti. Priorità su /antiriciclaggio: 152 nomi accessibili aggiunti (122 label associate + 11 select di tabella + 12 campi "Altro" + 14 controlli del motore trigger UIF), confermato 0 controlli senza nome su 238 totali (135 visibili al caricamento). Aggiunta la dimensione "annuncio risultati/errori" (non coperta da ACC-02): 5 strumenti su 7 ne erano completamente privi, corretti con `role="status"`/`role="log"`/`role="alert"` + `aria-live="polite"`; Calcolo Assegni e Generatore Procura già adeguati. Nessuna regressione visiva o funzionale riscontrata. Test con screen reader reale ancora da fare (competenza umana). |
