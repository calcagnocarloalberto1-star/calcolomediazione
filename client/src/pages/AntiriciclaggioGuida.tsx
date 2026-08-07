import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// Pagina "Antiriciclaggio — guida in linguaggio semplice".
// Incorpora la pagina statica /antiriciclaggio-guida.html (servita da client/public)
// con auto-ridimensionamento dell'altezza (stessa origine, nessun bordo/scroll interno).
//
// Cache-busting automatico: vedi il commento equivalente in Antiriciclaggio.tsx.
// Il parametro "?v=" è calcolato una sola volta al mount (non ad ogni render) ed
// è sempre diverso, così il browser non può restare bloccato su una copia vecchia
// di /antiriciclaggio-guida.html in cache — non serve più incrementare a mano un
// numero di versione ad ogni modifica del file statico.
export default function AntiriciclaggioGuida() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(1800);
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
          // solo crescere. Se una singola misurazione lo sovrastima anche di
          // poco, l'iframe resta bloccato più alto del contenuto reale per
          // sempre, lasciando uno spazio vuoto sotto la guida prima del
          // footer del sito. doc.body.scrollHeight non ha questo problema e
          // riflette sempre l'altezza reale del contenuto.
          const h = doc.body.scrollHeight;
          setHeight((prev) => (prev === h + 40 ? prev : h + 40));
        }
      } catch {
        /* cross-origin: ignora */
      }
    };

    const onLoad = () => {
      // Doppio rAF: assicura che il browser abbia completato almeno un
      // ciclo di layout/paint prima della prima misurazione. Senza questa
      // attesa la prima lettura di scrollHeight può essere transitoriamente
      // troppo alta, lasciando per un istante uno spazio vuoto sotto il
      // contenuto della guida prima del "salto" all'altezza corretta.
      requestAnimationFrame(() => requestAnimationFrame(sync));

      // Rete di sicurezza: alcuni reflow (immagini che finiscono di
      // caricare, dettagli che si aprono) arrivano dopo il load event.
      // Ri-misura per un paio di secondi finché l'altezza non si è assestata.
      [50, 150, 350, 700, 1200, 2000].forEach((ms) => {
        settleTimers.push(window.setTimeout(sync, ms));
      });

      try {
        const doc = frame.contentWindow!.document;
        observer = new ResizeObserver(sync);
        observer.observe(doc.body);
        // Ogni immagine che completa il caricamento può cambiare l'altezza
        // del contenuto: ridisegna la misura anche in quel momento.
        doc.querySelectorAll("img").forEach((img) => {
          if (!(img as HTMLImageElement).complete) {
            img.addEventListener("load", sync, { once: true });
          }
        });
      } catch {
        /* cross-origin: il polling qui sotto resta comunque attivo */
      }

      // Rete di sicurezza permanente: un ResizeObserver che osserva il body
      // di un documento in un altro iframe non sempre notifica in modo
      // affidabile le riduzioni di altezza. Un controllo periodico leggero
      // garantisce che l'iframe si restringa comunque entro un secondo.
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
        title="Antiriciclaggio in Mediazione — Guida in linguaggio semplice"
        description="Guida in linguaggio semplice agli obblighi antiriciclaggio nella mediazione civile: chi è obbligato, ispezioni della Guardia di Finanza, cosa fare e cosa mettere a verbale. Per avvocati e organismi di mediazione."
        canonical="https://calcolomediazione.it/antiriciclaggio-guida"
      />
      <iframe
        ref={frameRef}
        src={`/antiriciclaggio-guida.html?v=${cacheBust}`}
        title="Antiriciclaggio in mediazione — guida in linguaggio semplice"
        loading="lazy"
        scrolling="no"
        style={{ width: "100%", height: `${height}px`, border: 0, display: "block" }}
      />
    </div>
  );
}
