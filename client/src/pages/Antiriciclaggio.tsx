import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// Pagina "Antiriciclaggio in mediazione".
// Incorpora lo strumento statico /antiriciclaggio.html (servito da client/public)
// con auto-ridimensionamento dell'altezza (stessa origine, nessun bordo/scroll interno).
export default function Antiriciclaggio() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(1600);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | null = null;
    let interval: number | undefined;

    const sync = () => {
      try {
        const doc = frame.contentWindow?.document;
        if (doc?.body) {
          const h = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight,
          );
          setHeight(h + 40);
        }
      } catch {
        /* cross-origin: ignora */
      }
    };

    const onLoad = () => {
      sync();
      try {
        const doc = frame.contentWindow!.document;
        observer = new ResizeObserver(sync);
        observer.observe(doc.body);
      } catch {
        interval = window.setInterval(sync, 600);
      }
    };

    frame.addEventListener("load", onLoad);
    return () => {
      frame.removeEventListener("load", onLoad);
      observer?.disconnect();
      if (interval) window.clearInterval(interval);
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
        src="/antiriciclaggio.html"
        title="Antiriciclaggio in mediazione — obblighi e modelli"
        loading="lazy"
        scrolling="no"
        style={{ width: "100%", height: `${height}px`, border: 0, display: "block" }}
      />
    </div>
  );
}
