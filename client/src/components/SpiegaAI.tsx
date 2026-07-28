import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface SpiegaAIProps {
  /** Contesto breve per l'AI, es. "confronto costi mediazione vs causa". */
  contesto: string;
  /** Funzione che restituisce i dati da spiegare (oggetto serializzabile). */
  getPayload: () => unknown;
  /** Etichetta del pulsante. */
  titolo?: string;
}

// Pulsante riutilizzabile che invia i risultati di un calcolatore al server
// e mostra una spiegazione discorsiva in linguaggio semplice (adatta al cliente).
// Nessun dato personale: si spiegano solo numeri e parametri gia' calcolati.
export function SpiegaAI({ contesto, getPayload, titolo = "Spiega questi numeri (AI)" }: SpiegaAIProps) {
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [testo, setTesto] = useState<string | null>(null);

  const spiega = async () => {
    setLoading(true); setErrore(null); setTesto(null);
    try {
      const payload = getPayload();
      const res = await fetch("/api/spiega", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contesto, dati: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && data.error) ? data.error : "Errore del servizio AI");
      setTesto((data && data.spiegazione) ? String(data.spiegazione) : "");
    } catch (e: any) {
      setErrore((e && e.message) ? e.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3 print:hidden">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Spiegazione in linguaggio semplice</span>
        </div>
        <Button onClick={spiega} disabled={loading} size="sm">
          {loading ? "Elaborazione…" : titolo}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Genera un testo discorsivo, adatto da condividere con il cliente, che spiega i numeri qui sopra. È una spiegazione di supporto, non una consulenza: verifica sempre i contenuti.
      </p>
      {errore && <p className="text-sm text-red-600">{errore}</p>}
      {testo && (
        <div className="rounded-lg bg-background border border-foreground/10 p-3 text-sm">
          <MarkdownRenderer content={testo} />
        </div>
      )}
    </div>
  );
}
