import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// Pagina "Antiriciclaggio in mediazione".
// Incorpora lo strumento statico /antiriciclaggio.html (servito da client/public)
// con auto-ridimensionamento dell'altezza (stessa origine, nessun bordo/scroll interno).
//
// Cache-busting automatico: l'indirizzo dell'iframe include un parametro "?v="
// univoco per ogni caricamento della pagina (calcolato una sola volta al mount,
// non ad ogni render). Così il browser richiede sempre una copia mai vista prima
// di /antiriciclaggio.html e non può restare bloccato su una versione vecchia in
// cache — prima qui c'era un numero (ASSET_VERSION) da incrementare a mano ad
// ogni modifica del file statico, ma è un passaggio facile da dimenticare (è
// successo più volte) e quando succede gli utenti che hanno già visitato la
// pagina restano bloccati sulla versione precedente finché non lo si nota. Il
// costo di questo approccio è che il file (circa 250 KB) viene sempre
// riscaricato invece di essere servito dalla cache del browser: accettabile per
// uno strumento di compilazione visitato occasionalmente, dove la correttezza
// del contenuto conta più del risparmio di banda.
export default function Antiriciclaggio() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(1600);
  const [cacheBust] = useState<number>(() => Date.now());

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | null = null;
    let interval: number | undefined;
    const settleTimers: number[] = [];

    const sync = () => {
      try {
        const doc = frame.contentWindow?.document;
        if (doc?.body) {
          // Nota: NON usare doc.documentElement.scrollHeight qui. Dentro un
          // iframe la cui altezza è impostata via JS (come questo), lo
          // scrollHeight dell'elemento <html> non scende mai sotto l'altezza
          // corrente impostata sull'iframe stesso: è un "cricchetto" che può
          // solo crescere. Questo strumento cambia altezza di continuo (form
          // che si espandono, "Genera i modelli", intervista T1-T7, dettagli
          // apribili/richiudibili): se una sola misurazione la sovrastima,
          // l'iframe resta bloccato più alto del contenuto reale, lasciando
          // uno spazio vuoto prima del footer del sito. doc.body.scrollHeight
          // riflette invece sempre l'altezza reale del contenuto.
          const h = doc.body.scrollHeight;
          setHeight((prev) => (prev === h + 40 ? prev : h + 40));
        }
      } catch {
        /* cross-origin: ignora */
      }
    };

    const onLoad = () => {
      requestAnimationFrame(() => requestAnimationFrame(sync));

      // Rete di sicurezza: form che si espandono, immagini, generazione dei
      // modelli e dettagli apribili possono cambiare l'altezza dopo il load.
      [50, 150, 350, 700, 1200, 2000].forEach((ms) => {
        settleTimers.push(window.setTimeout(sync, ms));
      });

      try {
        const doc = frame.contentWindow!.document;
        observer = new ResizeObserver(sync);
        observer.observe(doc.body);
      } catch {
        /* cross-origin: il polling qui sotto resta comunque attivo */
      }

      // Rete di sicurezza permanente: questo strumento è molto interattivo
      // (genera/azzera i modelli, apre/chiude dettagli, più parti nella
      // stessa procedura) e il ResizeObserver, osservando il body di un
      // documento in un altro iframe, non sempre notifica le riduzioni di
      // altezza in modo affidabile. Un controllo periodico leggero garantisce
      // che l'iframe si restringa comunque, entro un secondo, quando il
      // contenuto si riduce (es. dopo "Azzera").
      interval = window.setInterval(sync, 900);
    };

    frame.addEventListener("load", onLoad);
    return () => {
      frame.removeEventListener("load", onLoad);
      observer?.disconnect();
      if (interval) window.clearInterval(interval);
      settleTimers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="w-full">
      <SeoHead
        title="Antiriciclaggio in Mediazione — Obblighi e Modelli per Avvocati e Organismi"
        description="Obblighi antiriciclaggio (D.Lgs. 231/2007) nella mediazione civile e compilazione automatica dei modelli del fascicolo: adeguata verifica, titolare effettivo, scheda rischio, dichiarazione cliente, segnalazione operazioni sospette. Per avvocati e organismi di mediazione."
        canonical="https://calcolomediazione.it/antiriciclaggio"
      />
      <iframe
        ref={frameRef}
        src={`/antiriciclaggio.html?v=${cacheBust}`}
        title="Antiriciclaggio in mediazione — obblighi e modelli"
        loading="lazy"
        scrolling="no"
        style={{ width: "100%", height: `${height}px`, border: 0, display: "block" }}
      />
    </div>
  );
}
