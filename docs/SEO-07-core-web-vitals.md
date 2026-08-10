# SEO-07 — Misurazione Core Web Vitals (PageSpeed Insights/Lighthouse)

**Data:** 10 agosto 2026
**Metodo:** PageSpeed Insights (Lighthouse) reale su home, `/calcolatore`, `/analisi-caso-ai`, mobile e computer.

## Punteggi

| Pagina | Dispositivo | Prestazioni | Accessibilità | Best Practice | SEO |
|---|---|---|---|---|---|
| Home | Mobile | 60 | 93 | 96 | 100 |
| Home | Computer | ~100 | 93 | 96 | 100 |
| Calcolatore | Mobile | 64 | 93 | 96 | 100 |
| Calcolatore | Computer | ~100 | 93 | 96 | 100 |
| Analisi AI del Caso | Mobile | 64 | 93 | 96 | 100 |
| Analisi AI del Caso | Computer | ~100 | 93 | 96 | 100 |

## Core Web Vitals (dettaglio mobile — il caso critico)

| Pagina | LCP | CLS | TBT |
|---|---|---|---|
| Home | **5,9 s** (scarso) | **0,292** (scarso) | 20 ms (ottimo) |
| Calcolatore | **5,9 s** (scarso) | 0 (ottimo) | 50 ms (ottimo) |
| Analisi AI del Caso | **5,9 s** (scarso) | 0 (ottimo) | 40 ms (ottimo) |

Soglie Google: LCP buono ≤2,5s, scarso >4s. CLS buono ≤0,1, scarso >0,25.

Su computer tutte e tre le pagine sono eccellenti (LCP ~0,7-1,2s, CLS ≤0,014) — **il problema è specifico del mobile**, dove Lighthouse simula una CPU di fascia media e una rete più lenta.

## Cause identificate

**LCP lento (5,9s su tutte e tre le pagine, in modo pressoché identico):** non è un problema di contenuto specifico di una pagina, ma un collo di bottiglia condiviso da tutto il sito. La build di produzione genera un unico bundle JavaScript da **2,4 MB (690 KB compressi)**, non suddiviso in chunk più piccoli — la build stessa lo segnala come warning. Lighthouse conferma: "Riduci il codice JavaScript inutilizzato" (496 KB di risparmio stimato) e "Richieste di blocco del rendering" (1970 ms di risparmio stimato) sono le due voci più pesanti. In pratica: prima che l'utente veda qualcosa, il browser deve scaricare ed eseguire l'intero bundle, che contiene il codice di *tutte* le pagine del sito (calcolatore, analisi AI, generatore procura, giurisprudenza, ecc.), anche quando ne visita solo una.

**Soluzione tipica:** code-splitting per rotta (`React.lazy()` + `import()` dinamico su ciascuna pagina in `App.tsx`), così ogni pagina scarica solo il proprio codice. È un intervento di refactoring non banale (tocca il routing e va testato con attenzione su tutte le pagine) — non l'ho implementato in questa sessione, lo segnalo come possibile issue separata data la sua rilevanza (è il singolo intervento con il maggiore impatto misurato sulle prestazioni mobile del sito).

**CLS scarso solo in home (0,292, soglia "scarso" >0,25):** causato dal caricamento dei web font di Google Fonts (`fonts.gstatic.com`, file `.woff2`) — quando il font arriva dopo il primo render, il testo si "sposta" nel layout. Non accade nelle altre due pagine testate (probabilmente per differenze nel contenuto sopra la piega). Soluzione tipica: `font-display: optional` o preload dei font critici — intervento contenuto, possibile issue separata se prioritario.

## Accessibilità/Best Practice automatiche — incrocio con l'audit manuale

Punteggio 93/100 costante su tutte e tre le pagine (identico su mobile e computer — la stessa "constatazione" viene ripetuta anche se punteggio "computer" può differire leggermente per differenze wording UI di Lighthouse). Ho incrociato i rilievi con il lavoro manuale già fatto in ACC-01/02/03/04:

- **Zoom disabilitato su mobile** (`maximum-scale=1` nel meta viewport) — rilievo *nuovo*, non coperto dall'audit manuale precedente (che si è concentrato su tastiera, screen reader e contrasto colore, non sullo zoom). **Corretto**: rimosso il tetto allo zoom.
- **Elementi di intestazione non in ordine gerarchico decrescente** su almeno una pagina — rilevato da Lighthouse ma non ho ottenuto il dettaglio esatto (elemento/pagina) per una limitazione tecnica nell'estrazione dei dati dal report in questa sessione. Segnalo il rilievo così com'è; andrebbe rieseguito il test PageSpeed Insights e aperto il pannello "Accessibilità" per vedere l'elemento esatto.
- Gli altri rilievi minori (mappe di origine mancanti per il JS, errori generici in console) sono di natura tecnica/debug, non di accessibilità per l'utente finale.

Il punteggio 93/100 e l'assenza di rilievi sovrapponibili al lavoro già fatto sono una buona conferma indiretta della qualità del lavoro ACC-01/02/03/04.

## File toccati in questa issue

- `client/index.html` — rimosso `maximum-scale=1` dal meta viewport

## Non implementato in questa sessione (richiede una decisione tua)

- Code-splitting del bundle JS per rotta — il fix con il maggiore impatto misurato, ma è un refactoring del routing, non un fix meccanico.
- `font-display`/preload per i Google Fonts (CLS home).
- Verifica puntuale dell'elemento con ordine di intestazioni non sequenziale.
