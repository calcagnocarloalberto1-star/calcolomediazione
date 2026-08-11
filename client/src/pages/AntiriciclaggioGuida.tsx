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
// FAQ della guida (Parte 2, sezione 7): mantenuto qui in sincronia con il
// testo visibile in client/public/antiriciclaggio-guida.html (#faq) per poter
// esporre lo schema.org FAQPage lato client tramite SeoHead — lo stesso
// pattern già usato in FAQ.tsx/StrategieNegoziazione.tsx, indipendente dal
// fetch del markup statico (che inietta solo <body>, non <head>).
const GUIDA_FAQ = [
  {
    q: "I dati inseriti vengono inviati a calcolomediazione.it?",
    a: "Mai. Tutto resta nel browser del dispositivo usato per compilare (localStorage): non c'è alcun invio a un server, né di calcolomediazione.it né di terzi.",
  },
  {
    q: "Cambio computer o browser: ritrovo i dati?",
    a: "No, il salvataggio automatico è locale a quel browser: non esiste più una funzione di esportazione/importazione dei dati compilati. Per portare il lavoro su un altro dispositivo genera e scarica il fascicolo in Word (sezione 19) e trasmettilo, oppure ricompila i dati sull'altro computer.",
  },
  {
    q: "Il pulsante \"Carica questi dati\" non compare: perché?",
    a: "Il salvataggio e il recupero sono legati al numero di procedura: finché il campo \"N. procedura / R.G. mediazione\" è vuoto, lo strumento non sa a quale pratica associare i dati salvati.",
  },
  {
    q: "Come tengo distinte le posizioni di più parti nella stessa procedura?",
    a: "Con \"+ Nuova parte per questa procedura\": ogni parte resta salvata separatamente con il proprio nome, e nel box \"Procedure con dati salvati\" le trovi tutte elencate sotto lo stesso numero di procedura.",
  },
  {
    q: "Rischio di perdere tutto se cancello i dati di navigazione del browser?",
    a: "Sì: essendo un salvataggio solo locale, cancellando la cronologia/i dati di navigazione si perde anche quanto salvato qui. Per una conservazione affidabile nel tempo, dopo aver generato i modelli usa sempre una delle sezioni \"Genera o stampa i modelli\" (sezione 19) per scaricare il fascicolo in Word o stamparlo.",
  },
  {
    q: "Il motore ha letto male un dato, o sbagliato il ruolo di una parte: cosa faccio?",
    a: "Nell'elenco delle parti individuate, prima di applicare, correggi il ruolo con il menù a tendina se necessario; una volta applicata una parte, i suoi campi restano comunque normali campi del modulo, modificabili a mano come tutti gli altri prima di generare il fascicolo definitivo.",
  },
  {
    q: "Il motore individua tutte le parti, anche se sono più di due?",
    a: "Sì: legge sistematicamente tutti i documenti caricati e cerca sia gli istanti sia gli aderenti, quanti che siano — non si ferma alla prima parte istante. Applica ciascuna parte trovata una alla volta con \"Applica questa parte ai campi\", scaricando o stampando il fascicolo generato prima di passare alla successiva.",
  },
  {
    q: "Posso generare solo un documento, senza tutto il fascicolo?",
    a: "Sì: scegli il documento che ti serve nel selettore in cima alla pagina (Modulo AV, Scheda rischio, Dichiarazione del cliente o Modello ufficiale COA Genova) e la sezione 19 mostrerà un solo pulsante di generazione per quel documento. Il fascicolo completo resta disponibile come opzione avanzata in \"Altre opzioni\".",
  },
];

const GUIDA_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GUIDA_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

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
        jsonLd={GUIDA_FAQ_JSONLD}
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
