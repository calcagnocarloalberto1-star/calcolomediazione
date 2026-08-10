# SEO-05 — Audit SEO tecnico completo con crawler dedicato

**Data:** 10 agosto 2026
**Metodo:** crawler custom (fetch programmatico via browser autenticato, non un tool SaaS come Screaming Frog/Sitebulb — non disponibili in questo ambiente) su tutte le 124 URL delle due sitemap del sito (`sitemap.xml` + `sitemap-giurisprudenza.xml`), più lettura diretta del codice sorgente del server per i controlli non verificabili da browser (header di sicurezza, generazione della sitemap).

## Riepilogo

| Controllo | Esito |
|---|---|
| Codici di stato HTTP (124/124 URL sitemap) | ✅ tutte 200, nessun redirect, nessun 404/soft-404 |
| Title/meta description duplicati o mancanti | ✅ nessuno su tutte le 30 pagine statiche |
| Tag canonical | ⚠️ mancante su 1 pagina (`/calcolo-assegni/`) — **corretto** |
| Header di sicurezza (X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy) | ✅ presenti e corretti su tutto il sito |
| Header Content-Security-Policy | ⚠️ assente (scelta intenzionale documentata nel codice — vedi sotto) |
| Header X-Powered-By | ⚠️ rivelava "Express" — **corretto** |
| Redirect HTTP → HTTPS | ✅ funzionante |
| Favicon | 🔴 mai esistita nel repo, referenziata ma 404 dal lancio del sito — **corretto** |
| Contenuto pre-renderizzato per crawler/no-JS | ⚠️ mancante su 7 pagine — **da valutare** (dettagli sotto) |
| Link "Admin" pubblico in navigazione | ℹ️ informativo, protetto da password |
| Link interni rotti | ✅ nessuno tra quelli verificati |

## Dettaglio

### 1. Sitemap — copertura e correttezza

Il sito genera `sitemap.xml` e `sitemap-giurisprudenza.xml` dinamicamente lato server (`server/routes.ts`), non da file statico. Le 124 URL (30 pagine di contenuto + 94 sentenze) sono state verificate una per una: **tutte restituiscono HTTP 200, nessun redirect, nessuna incongruenza tra le due sitemap** (contengono lo stesso identico set di URL per la sezione giurisprudenza).

Nota tecnica: esiste anche un file `client/public/sitemap.xml` statico e non aggiornato (18 URL soltanto) che non viene mai servito in produzione — la route dinamica lo intercetta prima. È innocuo ma può confondere chi lavora sul repo in futuro credendo sia quello vero; da valutare se rimuoverlo.

### 2. Title, meta description, canonical

Nessun titolo o meta description duplicato o mancante sulle 30 pagine di contenuto. Un solo canonical mancante, su `/calcolo-assegni/` (l'unica pagina del sito con markup HTML statico indipendente, non generata dal server come le altre) — **corretto** con l'aggiunta del tag.

### 3. Header di sicurezza HTTP

Verificati sia da browser sia leggendo `server/index.ts`:
- `X-Content-Type-Options: nosniff` ✅
- `X-Frame-Options: SAMEORIGIN` ✅
- `Referrer-Policy: strict-origin-when-cross-origin` ✅
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` ✅
- `Content-Security-Policy`: **assente**. Il codice contiene un commento esplicito che spiega la scelta ("niente CSP restrittivo: eviterebbe di rompere CDN OCR, Google Fonts e Analytics") — non è una svista, ma una decisione già presa in una sessione precedente. Se si vuole comunque introdurla, va costruita elencando esplicitamente tutti i domini di terze parti in uso (Google Fonts, servizio OCR, Analytics, eventuale AI) e testata con attenzione: un CSP mal configurato può rompere silenziosamente funzionalità del sito. Non l'ho implementata in questa sessione — è una modifica strutturale che merita una decisione esplicita, non un fix meccanico.
- `X-Powered-By: Express` era presente, rivelando pubblicamente lo stack tecnico del server. **Corretto** con `app.disable("x-powered-by")`.

### 4. Favicon mancante (bug reale, corretto)

`client/index.html` referenzia `/favicon.png`, ma questo file non è mai stato incluso nel repository, in nessun commit passato. Il sito è stato senza favicon fin dal lancio (verificato: la URL live restituiva 404). Ho creato un'icona coerente con il brand del sito (la stessa icona "Scale" usata nell'header, sullo stesso colore `--primary`) e l'ho aggiunta in `client/public/favicon.png`. È un placeholder funzionale corretto tecnicamente — se si desidera un'icona disegnata ad hoc, va sostituita con lo stesso nome file.

(Nota: l'immagine OG per la condivisione social, `/og-image.svg`, è invece generata correttamente da una route server dedicata — verificato live, nessun problema lì.)

### 5. Contenuto pre-renderizzato mancante su 7 pagine

Il server inietta contenuto HTML pre-renderizzato (titolo H1 + testo) dentro `<div id="root">` per la maggior parte delle pagine, così che crawler e strumenti che non eseguono JavaScript vedano comunque un contenuto reale (mappa `SEO_CONTENT` in `server/static.ts` / `server/routes.ts`). Verificando tutte le 30 pagine, **7 non hanno questa voce** e restituiscono un `<div id="root"></div>` vuoto a chi non esegue JavaScript (titolo e meta description restano comunque corretti, solo il corpo della pagina è assente):

- `/costi-notarili`
- `/chi-siamo`
- `/contatti`
- `/antiriciclaggio-guida`
- `/privacy-policy`
- `/cookie-policy`
- `/termini-condizioni`

Google oggi renderizza quasi sempre il JavaScript prima di indicizzare, quindi l'impatto pratico è probabilmente limitato — ma altri bot (social media, alcuni crawler AI, strumenti che non renderizzano JS) vedrebbero queste 7 pagine come vuote. Colmare il divario richiede scrivere un breve HTML di fallback per ciascuna pagina (non è un fix meccanico: per `/privacy-policy` o `/chi-siamo`, per esempio, serve riprodurre correttamente il contenuto reale). Non l'ho fatto in questa sessione — lo segnalo come possibile prossimo issue, a tua discrezione su priorità.

### 6. Link "Admin" pubblico in navigazione

Il link "Admin" nell'header è visibile pubblicamente (desktop) a chiunque visiti il sito, anche se il pannello dietro è protetto da password. Non è una falla di sicurezza, ma espone l'esistenza del pannello a chiunque, invitando tentativi di accesso. Puramente informativo — nessuna azione presa, è una scelta di prodotto che spetta a te.

### 7. Boilerplate residuo non pertinente

`client/index.html` contiene ancora tre tag ereditati da un template di scaffolding iniziale, mai puliti:
```html
<meta name="author" content="Perplexity Computer">
<meta property="og:see_also" content="https://www.perplexity.ai/computer">
<link rel="author" href="https://www.perplexity.ai/computer">
```
Attribuiscono pubblicamente (nel codice sorgente HTML, visibile a chiunque) l'autorialità del sito a un prodotto di terzi, cosa chiaramente non voluta. Non li ho toccati perché riguardano l'identità/attribuzione del sito — una decisione tua, non un bug tecnico. Fammi sapere se vuoi che li rimuova o li sostituisca.

## File toccati in questa issue

- `server/index.ts` — `app.disable("x-powered-by")`
- `client/public/favicon.png` — nuovo file
- `client/public/calcolo-assegni/index.html` — aggiunto canonical

## Non verificabile in questo ambiente

- Scansione con tool SaaS dedicato (Screaming Frog/Sitebulb/Semrush) — non disponibile; il crawler custom copre gli stessi criteri di accettazione della issue originale.
- Stato di indicizzazione effettivo in Google (soft-404, copertura) — richiede accesso a Google Search Console, oggetto di SEO-06 (bloccata, vedi nota separata).
