import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// ACC-01 — fix accessibilità: /antiriciclaggio-guida caricava la pagina statica
// /antiriciclaggio-guida.html dentro un <iframe>. Stesso problema già risolto per
// /antiriciclaggio (vedi il commento esteso in Antiriciclaggio.tsx): un iframe
// rende l'intero contenuto (titoli, tabelle, testo) invisibile all'albero di
// accessibilità della pagina e ai tool di estrazione testo, perché vive in un
// document separato.
//
// Fix: il markup di antiriciclaggio-guida.html viene ora iniettato DIRETTAMENTE
// nel DOM di questa pagina (stesso documento, nessun iframe) dentro un
// contenitore ".ac-guida-embed" — così titoli/tabelle/testo diventano DOM reale
// della pagina, navigabile da tastiera senza il confine dell'iframe ed estraibile
// da qualunque tool di lettura testo standard.
//
// Più semplice del fix equivalente per /antiriciclaggio: antiriciclaggio-guida.html
// non contiene alcuno <script> né alcun onclick/onchange (è puro contenuto
// statico), quindi non serve né isolare uno script in una IIFE né riscrivere
// handler — basta iniettare il markup e caricare il CSS scoped
// (antiriciclaggio-guida-embed.css, stessa trasformazione già usata per
// antiriciclaggio-embed.css: ogni selettore prefissato con ".ac-guida-embed").
//
// Nessuna modifica ai contenuti informativi della guida: cambia solo il
// meccanismo con cui vengono mostrati nella pagina.
export default function AntiriciclaggioGuida() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cacheBust] = useState<number>(() => Date.now());
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    // Bug osservato: "la pagina si apre sul footer". Causa: il sito non ha da
    // nessuna parte un reset dello scroll al cambio di rotta (nessun
    // ScrollToTop/window.scrollTo globale — verificato in tutto client/src);
    // finché questo effect non inietta il contenuto, il contenitore è VUOTO,
    // quindi la pagina intera (Header+Nav+contenitore vuoto+Footer del sito)
    // è altissima solo poche centinaia di px. Se si arriva qui già scrollati
    // in basso su un'altra pagina (es. da un link nel Footer del sito, che
    // sta in fondo), il browser blocca subito lo scroll al massimo consentito
    // da questa pagina ancora corta — cioè al Footer del sito — e quando poi
    // il contenuto reale viene iniettato e la pagina si allunga, lo scroll
    // NON si riporta automaticamente in cima: resta bloccato in fondo. Fix:
    // forzare esplicitamente lo scroll in cima appena si monta la pagina.
    window.scrollTo(0, 0);

    // Foglio di stile scoped: aggiunto una sola volta, condiviso se la
    // pagina viene rimontata nella stessa sessione SPA.
    const CSS_ID = "ac-guida-embed-styles";
    if (!document.getElementById(CSS_ID)) {
      const link = document.createElement("link");
      link.id = CSS_ID;
      link.rel = "stylesheet";
      link.href = `/antiriciclaggio-guida-embed.css?v=${cacheBust}`;
      document.head.appendChild(link);
    }

    fetch(`/antiriciclaggio-guida.html?v=${cacheBust}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => {
        if (cancelled || !containerRef.current) return;

        const bodyStart = html.indexOf("<body>") + "<body>".length;
        const bodyEnd = html.lastIndexOf("</body>");
        if (bodyStart <= 0 || bodyEnd < 0) {
          throw new Error("Struttura HTML inattesa");
        }

        containerRef.current.innerHTML = html.slice(bodyStart, bodyEnd);

        // Il contenuto (con gli id "obblighi"/"compilazione"/ecc.) esiste solo
        // da questo momento in poi: se l'URL con cui si è arrivati qui aveva
        // già un frammento (es. /antiriciclaggio-guida#compilazione, come nei
        // link aggiunti dal toolbar), lo scroll automatico del browser verso
        // quell'ancora è già fallito silenziosamente in precedenza, perché al
        // momento del caricamento della pagina l'elemento non esisteva ancora.
        // Lo si ripete qui a mano, ora che l'elemento è nel DOM.
        if (window.location.hash) {
          const target = document.getElementById(window.location.hash.slice(1));
          if (target) target.scrollIntoView();
        }
      })
      .catch((err) => {
        console.error("Errore caricamento guida antiriciclaggio:", err);
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheBust]);

  return (
    <div className="w-full">
      <SeoHead
        title="Antiriciclaggio in Mediazione — Guida agli obblighi e alla compilazione"
        description="Due guide in una: gli obblighi antiriciclaggio in mediazione in linguaggio semplice (chi è obbligato, adeguata verifica, fascicolo da conservare, come riconoscere un'operazione sospetta) e la guida pratica alla compilazione dello strumento, passo per passo. Per avvocati e organismi di mediazione."
        canonical="https://calcolomediazione.it/antiriciclaggio-guida"
      />
      {error && (
        <div className="max-w-2xl mx-auto my-12 border-2 border-foreground bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <p>
            Non è stato possibile caricare la guida. Ricarica la pagina o riprova tra qualche istante.
          </p>
        </div>
      )}
      <div ref={containerRef} className="ac-guida-embed" />
    </div>
  );
}
