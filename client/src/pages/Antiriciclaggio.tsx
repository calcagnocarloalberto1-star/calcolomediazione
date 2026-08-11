import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// ACC-01 — fix accessibilità: /antiriciclaggio caricava lo strumento statico
// /antiriciclaggio.html dentro un <iframe>. L'audit ha rilevato che questo
// rende l'intero contenuto (form, textarea, bottoni, testo) invisibile
// all'albero di accessibilità della pagina e ai tool di estrazione testo:
// read_page vedeva un solo elemento generico al posto del form, perché tutto
// vive nel document separato dell'iframe.
//
// Fix: il markup di antiriciclaggio.html viene ora iniettato DIRETTAMENTE nel
// DOM di questa pagina (stesso documento, nessun iframe) dentro un contenitore
// ".ac-embed" — così form/label/testo diventano DOM reale della pagina,
// navigabile da tastiera senza il confine dell'iframe ed estraibile da
// qualunque tool di lettura testo standard, alla pari delle altre pagine del
// sito.
//
// Tre accorgimenti per farlo senza rischi per il resto del sito o per il
// tool stesso:
// 1) CSS scoped — il foglio di stile originale usa selettori "nudi" (body,
//    button, label, input, h2, *, :root) che se iniettati as-is
//    sovrascriverebbero lo stile dell'INTERO sito (es. --card, --radius del
//    design system). Si usa invece client/public/antiriciclaggio-embed.css,
//    la stessa identica dichiarazione con ogni selettore isolato sotto
//    ".ac-embed" (vedi commento in quel file).
// 2) Script isolato — lo script originale dichiara ~100 variabili/funzioni
//    top-level con nomi molto generici ($, v, val, role...). Viene eseguito
//    dentro una IIFE per non inquinare lo scope globale della pagina, con le
//    sole funzioni richiamate dagli attributi onclick/onchange del markup
//    (26, invariate) esposte in modo esplicito e mirato sotto
//    window.__acEmbed, e gli attributi onclick/onchange del markup riscritti
//    di conseguenza (rewriteHandlers).
// 3) Cleanup dei listener globali — lo script registra alcuni listener su
//    document/window (event delegation su input/change, "afterprint" dopo la
//    stampa). Con l'iframe questi sparivano automaticamente alla navigazione;
//    iniettati nel documento principale andrebbero altrimenti accumulandosi
//    a ogni nuova visita della pagina nella stessa sessione SPA. Si
//    intercettano temporaneamente document/window.addEventListener per la
//    durata del mount e si rimuovono all'unmount.
//
// Nessuna modifica al file sorgente antiriciclaggio.html: contenuto, campi,
// logica di calcolo/generazione restano quelli già in produzione, verificati
// e usati dagli organismi di mediazione — cambia solo il meccanismo con cui
// vengono mostrati nella pagina.

// NB: questo elenco deve restare sincronizzato con le funzioni richiamate da
// onclick="…"/onchange="…" nel markup di client/public/antiriciclaggio.html.
// Un nome qui che non esiste più nello script (o uno nuovo mancante) rompe
// SILENZIOSAMENTE l'intero embedding: l'oggetto window.__acEmbed viene
// costruito con la sintassi abbreviata "{ nome, nome2, ... }", quindi un solo
// nome non più dichiarato nello script fa fallire con ReferenceError l'intera
// assegnazione — nessuna delle funzioni definite PRIMA di quel punto viene
// esposta, e ogni pulsante della pagina smette di rispondere (bug osservato
// in produzione dopo la rimozione di printOne/copyOne/stampaTuttoAccumulo/
// scaricaTutto/reset/assistToggleRaw/amlEsportaDati/amlImportaDatiFile senza
// aggiornare questo elenco). Verificare con:
//   grep -oE 'on(click|change)="[^"]*"' client/public/antiriciclaggio.html \
//     | grep -oE '\b[a-zA-Z_][a-zA-Z0-9_]*\(' | sort -u
// dopo ogni modifica ai pulsanti/onclick dello strumento.
const HANDLER_FNS = [
  "aggiungiAggiornamento", "amlCancellaDatiProcedura", "amlCancellaTuttiIDati",
  "amlNuovaParte", "analizzaTrigger", "assistAggiungiFile", "assistEstrai",
  "assistReset", "cancellaStoricoProcedura", "copyMot", "generaFormato",
  "moduliBianco", "resetTrigger", "rimuoviAggiornamento", "scaricaWord",
  "stampaVideoGenova", "toggleTrig",
];
const HANDLER_FN_PATTERN = new RegExp(`\\b(${HANDLER_FNS.join("|")})\\(`, "g");

// Riscrive onclick="genera(...)" -> onclick="window.__acEmbed.genera(...)" (e
// così via per le 25 funzioni sopra), unico punto di contatto tra il markup
// iniettato e lo script eseguito nella sua IIFE isolata.
function rewriteHandlers(markup: string): string {
  return markup.replace(/on(click|change)="([^"]*)"/g, (_full, evt, body) => {
    const rewritten = body.replace(HANDLER_FN_PATTERN, "window.__acEmbed.$1(");
    return `on${evt}="${rewritten}"`;
  });
}

export default function Antiriciclaggio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cacheBust] = useState<number>(() => Date.now());
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    // Bug osservato su /antiriciclaggio-guida (stessa architettura di questa
    // pagina, v. commento equivalente in AntiriciclaggioGuida.tsx): finché
    // questo effect non inietta il contenuto, il contenitore è vuoto e la
    // pagina intera è altissima solo poche centinaia di px; arrivando qui già
    // scrollati in basso da un'altra pagina (il sito non azzera mai lo scroll
    // al cambio di rotta), il browser blocca subito lo scroll al massimo
    // consentito da questa pagina ancora corta — cioè in fondo, verso il
    // Footer del sito — e non lo riporta in cima da solo quando il contenuto
    // reale viene iniettato e la pagina si allunga. Fix preventivo: forzare
    // lo scroll in cima appena si monta la pagina.
    window.scrollTo(0, 0);

    // Foglio di stile scoped: aggiunto una sola volta, condiviso se la
    // pagina viene rimontata nella stessa sessione SPA.
    const CSS_ID = "ac-embed-styles";
    if (!document.getElementById(CSS_ID)) {
      const link = document.createElement("link");
      link.id = CSS_ID;
      link.rel = "stylesheet";
      link.href = `/antiriciclaggio-embed.css?v=${cacheBust}`;
      document.head.appendChild(link);
    }

    // Intercetta temporaneamente document/window.addEventListener per poter
    // rimuovere, all'unmount, i listener globali che lo script del tool
    // registra (event delegation su input/change, "afterprint"). Senza
    // questo si accumulerebbero a ogni nuova visita della pagina nella
    // stessa sessione SPA (con l'iframe sparivano automaticamente).
    const recorded: { target: Document | Window; type: string; listener: EventListenerOrEventListenerObject; options?: boolean | AddEventListenerOptions }[] = [];
    const origDocAdd = Document.prototype.addEventListener;
    const origWinAdd = Window.prototype.addEventListener;
    document.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      recorded.push({ target: document, type, listener, options });
      return origDocAdd.call(document, type, listener, options as AddEventListenerOptions);
    } as typeof document.addEventListener;
    window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      recorded.push({ target: window, type, listener, options });
      return origWinAdd.call(window, type, listener, options as AddEventListenerOptions);
    } as typeof window.addEventListener;

    fetch(`/antiriciclaggio.html?v=${cacheBust}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => {
        if (cancelled || !containerRef.current) return;

        const bodyStart = html.indexOf("<body>") + "<body>".length;
        const scriptOpenIdx = html.indexOf("<script", bodyStart);
        const scriptOpenTagEnd = html.indexOf(">", scriptOpenIdx) + 1;
        const scriptCloseIdx = html.lastIndexOf("</script>");
        if (bodyStart <= 0 || scriptOpenIdx < 0 || scriptCloseIdx < 0) {
          throw new Error("Struttura HTML inattesa");
        }

        const markup = rewriteHandlers(html.slice(bodyStart, scriptOpenIdx));
        const scriptCode = html.slice(scriptOpenTagEnd, scriptCloseIdx);

        containerRef.current.innerHTML = markup;

        const exportList = HANDLER_FNS.join(", ");
        const wrapped =
          "(function(){\n" + scriptCode +
          `\nwindow.__acEmbed = { ${exportList} };\n})();`;

        const scriptEl = document.createElement("script");
        scriptEl.textContent = wrapped;
        containerRef.current.appendChild(scriptEl);
      })
      .catch((err) => {
        console.error("Errore caricamento strumento antiriciclaggio:", err);
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      for (const { target, type, listener, options } of recorded) {
        target.removeEventListener(type, listener, options as EventListenerOptions);
      }
      document.addEventListener = origDocAdd as typeof document.addEventListener;
      window.addEventListener = origWinAdd as typeof window.addEventListener;
      delete (window as unknown as { __acEmbed?: unknown }).__acEmbed;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <SeoHead
        title="Antiriciclaggio in Mediazione — Obblighi e Modelli per Avvocati e Organismi"
        description="Obblighi antiriciclaggio (D.Lgs. 231/2007) nella mediazione civile e compilazione automatica dei modelli del fascicolo: adeguata verifica, titolare effettivo, scheda rischio, dichiarazione cliente, segnalazione operazioni sospette. Per avvocati e organismi di mediazione."
        canonical="https://calcolomediazione.it/antiriciclaggio"
      />
      {error && (
        <div className="max-w-2xl mx-auto my-12 border-2 border-foreground bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <p>
            Non è stato possibile caricare lo strumento. Ricarica la pagina o riprova tra qualche istante.
          </p>
        </div>
      )}
      <div ref={containerRef} className="ac-embed" />
    </div>
  );
}
