import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Msg = { role: "user" | "assistant"; content: string };

const BENVENUTO: Msg = {
  role: "assistant",
  content:
    "Ciao! Sono l'assistente di CalcoloMediazione. Posso rispondere a domande sulla mediazione civile e commerciale (procedura, costi, condizione di procedibilità, Riforma Cartabia, antiriciclaggio…) e indicarti gli strumenti giusti del sito. Come posso aiutarti?",
};

// Assistente flottante ancorato ai contenuti del sito (FAQ, glossario, guide).
// Nessun dato personale: risponde su temi generali di mediazione.
export default function Assistente() {
  const [aperto, setAperto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([BENVENUTO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, aperto]);

  const invia = async () => {
    const testo = input.trim();
    if (!testo || loading) return;
    const nuovaStoria: Msg[] = [...msgs, { role: "user", content: testo }];
    setMsgs(nuovaStoria);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nuovaStoria.filter((m) => m !== BENVENUTO) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && data.error) ? data.error : "Errore dell'assistente");
      setMsgs((m) => [...m, { role: "assistant", content: String(data.risposta || "") }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: "assistant", content: "Si è verificato un errore: " + ((e && e.message) ? e.message : "riprova tra poco.") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!aperto && (
        <button
          onClick={() => setAperto(true)}
          aria-label="Apri l'assistente"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg px-4 py-3 hover:opacity-90 print:hidden"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">Assistente</span>
        </button>
      )}
      {aperto && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] flex flex-col rounded-2xl border-2 border-foreground/15 bg-background shadow-2xl overflow-hidden print:hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Assistente mediazione</span>
            </div>
            <button onClick={() => setAperto(false)} aria-label="Chiudi" className="p-1 hover:opacity-80">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={"inline-block rounded-xl px-3 py-2 text-sm max-w-[90%] " + (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                  {m.role === "assistant" ? <MarkdownRenderer content={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block rounded-xl px-3 py-2 text-sm bg-muted text-muted-foreground">Sto pensando…</div>
              </div>
            )}
          </div>
          <div className="border-t border-foreground/10 p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") invia(); }}
                placeholder="Scrivi una domanda…"
                className="flex-1 rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-primary bg-background"
                aria-label="Messaggio per l'assistente"
              />
              <button onClick={invia} disabled={loading} aria-label="Invia" className="rounded-lg bg-primary text-primary-foreground px-3 py-2 disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 px-1">Informazioni generali, non consulenza legale. L'assistente può sbagliare: verifica sempre le fonti.</p>
          </div>
        </div>
      )}
    </>
  );
}
