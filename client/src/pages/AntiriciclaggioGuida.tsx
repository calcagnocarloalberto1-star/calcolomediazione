import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";

// Pagina "Antiriciclaggio — guida in linguaggio semplice".
// Incorpora la pagina statica /antiriciclaggio-guida.html (servita da client/public)
// con auto-ridimensionamento dell'altezza (stessa origine, nessun bordo/scroll interno).
export default function AntiriciclaggioGuida() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(1800);

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
        title="Antiriciclaggio in Mediazione — Guida in linguaggio semplice"
        description="Guida in linguaggio semplice agli obblighi antiriciclaggio nella mediazione civile: chi è obbligato, ispezioni della Guardia di Finanza, cosa fare e cosa mettere a verbale. Per avvocati e organismi di mediazione."
        canonical="https://calcolomediazione.it/antiriciclaggio-guida"
      />
      <iframe
        ref={frameRef}
        src="/antiriciclaggio-guida.html"
        title="Antiriciclaggio in mediazione — guida in linguaggio semplice"
        loading="lazy"
        scrolling="no"
        style={{ width: "100%", height: `${height}px`, border: 0, display: "block" }}
      />
    </div>
  );
}
