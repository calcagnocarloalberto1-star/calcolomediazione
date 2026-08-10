# Proposta — CSP con domini elencati e code-splitting per rotta

**Data:** 10 agosto 2026
**Stato:** proposta, non implementata — richiede la tua approvazione prima di procedere (a differenza degli altri interventi di questa sessione, entrambi comportano un rischio reale di rompere funzionalità del sito se qualcosa viene dimenticato o sbagliato).

Questi sono i due punti lasciati aperti dagli audit SEO-05 e SEO-07 come "da valutare" invece che corretti direttamente, perché toccano rispettivamente la sicurezza percepita del sito (CSP) e il routing dell'intera applicazione (code-splitting). Li presento insieme perché entrambi richiedono test estesi su tutte le pagine prima di andare in produzione.

---

## 1. Content-Security-Policy con domini elencati esplicitamente

### Situazione attuale

`server/index.ts` non imposta l'header `Content-Security-Policy`, con un commento esplicito nel codice ("niente CSP restrittivo: eviterebbe di rompere CDN OCR, Google Fonts e Analytics") — una scelta presa in una sessione precedente, non una svista. Gli altri header di sicurezza (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) sono già presenti e corretti.

### Cosa cambierebbe

Ho verificato nel codice sorgente quali domini di terze parti il sito richiama effettivamente lato browser (non lato server: le chiamate a Anthropic/Google Gemini per l'AI avvengono dal server, non dal browser dell'utente, quindi non richiedono voci CSP):

| Direttiva | Domini necessari | Motivo |
|---|---|---|
| `script-src` | `'self'`, `https://cdn.jsdelivr.net`, `https://www.googletagmanager.com` | script del sito, libreria jsPDF nella pagina calcolo-assegni, Google Analytics (solo dopo consenso cookie) |
| `style-src` | `'self'`, `https://fonts.googleapis.com`, `'unsafe-inline'` | CSS del sito, foglio stile Google Fonts, stili inline generati dai componenti UI (Radix/Tailwind ne usano spesso) |
| `font-src` | `'self'`, `https://fonts.gstatic.com` | file dei web font |
| `connect-src` | `'self'`, `https://www.google-analytics.com`, `https://region1.google-analytics.com` | chiamate API del sito (stesso dominio) e invii di misurazione di Analytics |
| `img-src` | `'self'`, `data:` | immagini del sito e immagini generate come data-URI (export PDF/canvas) |
| `frame-src` | `'self'` | la pagina Guida Antiriciclaggio carica `/antiriciclaggio-guida.html` in un iframe dello stesso dominio |
| `object-src` | `'none'` | nessun plugin/Flash/embed necessario |

Punto delicato: `client/index.html` contiene uno `<script>` inline (il bootstrap di Google Analytics) — con una CSP restrittiva questo richiede `'unsafe-inline'` in `script-src` oppure convertire lo script in un file esterno con nonce. La soluzione più semplice e sicura è spostare quel piccolo blocco in un file `.js` statico servito dal sito stesso, eliminando la necessità di `'unsafe-inline'` per gli script (mantenendolo solo per gli stili, meno rischioso).

### Come lo farei, se approvi

1. Prima fase: header `Content-Security-Policy-Report-Only` con la policy sopra, per una settimana — non blocca nulla, ma registra in console eventuali violazioni non previste, permettendo di individuare domini dimenticati prima di rompere qualcosa.
2. Verifica manuale di tutte le funzionalità che coinvolgono terze parti: caricamento font, banner cookie e Analytics dopo consenso, export PDF (calcolatore, analisi AI, costi notarili), iframe della guida antiriciclaggio, assistente AI (chiamate server-side, non dovrebbero essere toccate).
3. Solo dopo la verifica: passaggio da `Report-Only` a `Content-Security-Policy` effettivo.

### Rischio se sbagliato

Un dominio dimenticato nella policy non genera un errore visibile all'utente in molti casi (uno script bloccato semplicemente non si esegue), quindi un bug di questo tipo può restare silente per settimane — da qui la fase di `Report-Only` come rete di sicurezza.

---

## 2. Code-splitting del bundle JavaScript per rotta

### Situazione attuale

La build di produzione genera un solo file JavaScript da **2,4 MB (690 KB compressi)** contenente il codice di *tutte* le pagine del sito (oltre 30, da `App.tsx`: calcolatore, analisi AI, generatore procura, giurisprudenza, tutte le guide, ecc.), tutte importate staticamente in `client/src/App.tsx`. Chi visita anche una sola pagina scarica ed esegue il codice di tutte.

Misurato con PageSpeed Insights (Lighthouse, SEO-07): LCP (tempo al primo contenuto visibile) di **5,9 secondi su mobile**, praticamente identico su home, calcolatore e analisi AI — non è un problema specifico di una pagina, è il collo di bottiglia del bundle unico. Su computer le stesse pagine sono eccellenti (LCP 0,7-1,2s): il problema è specifico della CPU/rete più lente simulate su mobile da Lighthouse. È l'intervento con il maggiore impatto misurato su tutto il sito.

### Cosa cambierebbe

Convertire gli oltre 30 `import` statici di pagina in `App.tsx` in `React.lazy(() => import("@/pages/..."))`, avvolgendo le `<Route>` in un `<Suspense>` con un indicatore di caricamento leggero. Effetto: ogni pagina scarica solo il proprio codice al primo caricamento, invece dell'intero bundle. Header, Footer e componenti condivisi (già usati su ogni pagina) resterebbero nel bundle principale, così restano immediati.

Nota tecnica positiva: le librerie più pesanti (`html2canvas`, `jspdf`/`index.es`, `purify.es`) sono **già** separate in chunk propri dalla build (visibili nell'output di build come file distinti) — il problema riguarda solo il codice applicativo delle pagine, non le librerie di terze parti già gestite bene da Vite.

### Come lo farei, se approvi

1. Conversione di tutti gli `import` di pagina in `React.lazy()`, una sola modifica concentrata in `App.tsx` (il resto del codice delle pagine non cambia).
2. Verifica sistematica di **ogni** pagina del sito dopo la modifica (sono oltre 30) — il rischio principale del code-splitting è una pagina che smette di caricarsi per un problema di import circolare o di path, che si manifesta solo a runtime e solo su quella specifica pagina.
3. Nuova misurazione PageSpeed Insights su home/calcolatore/analisi AI per confermare il miglioramento reale dell'LCP mobile, non solo teorico.
4. Verifica che il meccanismo di pre-rendering per i crawler (SEO_CONTENT, sistema server-side indipendente dal bundle JS) continui a funzionare invariato — non dovrebbe essere toccato, perché quel contenuto viene iniettato dal server prima che il bundle JS venga eseguito, ma è comunque un controllo di sicurezza da fare.

### Rischio se sbagliato

Un errore di code-splitting tende a essere **visibile** (una pagina che non carica, schermata bianca) piuttosto che silente come nel caso della CSP — più facile da individuare in fase di test, ma se sfuggisse in produzione sarebbe un disservizio diretto per chi usa quella pagina specifica.

---

## Riepilogo della richiesta

Se approvi, procedo nell'ordine: prima il code-splitting (impatto misurabile più alto, rischio più visibile/rilevabile in test), poi la CSP in modalità `Report-Only` per una settimana prima di renderla effettiva. Fammi sapere se vuoi che proceda con entrambi, uno solo, o nessuno per ora.
