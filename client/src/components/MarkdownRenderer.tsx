import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

// ─── NORMALIZZAZIONE TABELLE MARKDOWN ────────────────────────────────────────
//
// Problema: l'AI produce spesso tabelle GFM precedute da testo (bold, paragrafo)
// senza riga vuota di separazione, es.:
//
//   **Costi della mediazione**
//   | Voce | Importo |        ← nessuna riga vuota prima
//   |---|---|
//   | Totale | € 3.375 |
//
// remark-gfm segue la specifica CommonMark/GFM che richiede una riga vuota
// tra un paragrafo e una tabella. Senza, la prima riga della tabella viene
// trattata come continuazione del paragrafo e l'intera tabella non viene
// riconosciuta → appare come testo plain.
//
// La funzione applica tre fix in sequenza:
//
//   1. Riga vuota prima della tabella
//      Pattern: testo non-tabella + \n + riga che inizia con | e la riga
//      successiva è un separatore (|---|). Aggiunge \n\n prima della tabella.
//
//   2. Separatori con = o _ al posto di -
//      Alcune AI producono |===| o |___| — li convertiamo in |---|.
//
//   3. Fix legacy: righe concatenate su una riga sola
//      Pattern originale di fixInlineTables: "testo| |testo" → split su \n.
//      Mantenuto per compatibilità con record vecchi del DB.
//
// La funzione è idempotente: se applicata a testo già corretto non produce
// modifiche. Tutte le regex sono testate su output reali dell'analisi AI.

// Restituisce true se la riga è un separatore GFM (---|:---:|---).
function isSeparatorRow(line: string): boolean {
  const t = line.trim();
  if (!t.includes("-")) return false;
  // Rimuovo pipe iniziale/finale eventualmente assenti.
  const inner = t.replace(/^\|/, "").replace(/\|$/, "");
  if (!inner.includes("-")) return false;
  // Ogni cella deve essere fatta solo da -, :, spazi (almeno un -).
  return inner.split("|").every((c) => /^\s*:?-{1,}:?\s*$/.test(c));
}

// Restituisce true se la riga sembra una riga di tabella (contiene almeno un
// pipe non in fondo isolato e una struttura cella|cella).
function looksLikeTableRow(line: string): boolean {
  const t = line.trim();
  if (!t.includes("|")) return false;
  // Almeno due segmenti separati da pipe (es. "a | b" o "| a | b |").
  const parts = t.replace(/^\|/, "").replace(/\|$/, "").split("|");
  return parts.length >= 2;
}

// Aggiunge pipe iniziale/finale se mancanti, in modo da rendere la riga
// conforme allo standard GFM.
function wrapPipes(line: string): string {
  let t = line.trim();
  if (!t.startsWith("|")) t = "| " + t;
  if (!t.endsWith("|")) t = t + " |";
  return t;
}

// Normalizza un blocco "tabella" multilinea: garantisce pipe iniziale/finale
// su header, separatore e righe successive.
function normalizeTableBlock(lines: string[]): string[] {
  return lines.map((l) => (looksLikeTableRow(l) || isSeparatorRow(l) ? wrapPipes(l) : l));
}

function normalizeMarkdownTables(text: string): string {
  if (!text) return text;

  // STEP 0 — Pre-pulizia: separatori non-standard |===| o |___| → |---|
  let result = text.replace(
    /^\s*\|?([ \t]*[=_][-=_:\s|]*)\|?[ \t]*$/gm,
    (m) => m.replace(/[=_]/g, "-")
  );

  // STEP 1 — Scan riga per riga per identificare le tabelle e:
  //   a) garantire riga vuota prima dell'header (richiesta GFM)
  //   b) aggiungere pipe iniziale/finale mancanti su header, separatore,
  //      righe della tabella
  //   c) garantire riga vuota dopo l'ultima riga della tabella
  const lines = result.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = i + 1 < lines.length ? lines[i + 1] : "";
    // Inizio tabella: riga che sembra una riga di tabella + riga successiva
    // che è un separatore (anche senza pipe iniziale/finale).
    if (looksLikeTableRow(line) && isSeparatorRow(next)) {
      // a) blank line prima
      if (out.length > 0) {
        const prev = out[out.length - 1];
        if (prev.trim() !== "" && !looksLikeTableRow(prev) && !isSeparatorRow(prev)) {
          out.push("");
        }
      }
      // Raccolgo tutte le righe della tabella
      const block: string[] = [line, next];
      let j = i + 2;
      while (j < lines.length && (looksLikeTableRow(lines[j]) || isSeparatorRow(lines[j]))) {
        block.push(lines[j]);
        j++;
      }
      // b) normalizzo pipe
      const normalized = normalizeTableBlock(block);
      out.push(...normalized);
      // c) blank line dopo (se non c'è già)
      if (j < lines.length && lines[j].trim() !== "") out.push("");
      i = j;
      continue;
    }
    out.push(line);
    i++;
  }
  result = out.join("\n");

  // STEP 2 — Fix legacy: righe concatenate su una sola riga
  // "testo| |testo" indica due righe di tabella unite. Conservato per
  // compatibilità con record DB pre-patch.
  result = result.replace(
    /([^\s|])[ \t]*\|[ \t]{2,}\|[ \t]*([^\s|])/g,
    "$1 |\n| $2"
  );

  return result;
}

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const normalized = normalizeMarkdownTables(content);

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert
        prose-headings:font-display prose-headings:tracking-tight
        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
        prose-h2:border-b-2 prose-h2:border-foreground/20 prose-h2:pb-2
        prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
        prose-h4:text-base prose-h4:mt-3 prose-h4:mb-1
        prose-p:text-sm prose-p:leading-relaxed prose-p:mb-3
        prose-li:text-sm prose-li:leading-relaxed
        prose-strong:text-foreground
        prose-blockquote:border-l-4 prose-blockquote:border-primary
        prose-blockquote:bg-primary/5 prose-blockquote:px-4
        prose-blockquote:py-2 prose-blockquote:text-sm prose-blockquote:italic
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-sm prose-code:font-mono
        [&_table]:!m-0 [&_table]:!p-0
      "
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── TABELLA ──
          // Wrapper scrollabile con bordo e ombra brutalista.
          // "not-prose" sul div esterno impedisce a Tailwind Typography
          // di sovrascrivere gli stili della tabella con le sue regole
          // prose-table:* che hanno specificità più alta.
          table: ({ node, ...props }) => (
            <div className="not-prose my-4 overflow-x-auto border-2 border-foreground/80 bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] rounded-sm">
              <table
                className="w-full text-sm border-collapse min-w-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
                {...props}
              />
            </div>
          ),

          thead: ({ node, ...props }) => (
            <thead className="bg-primary text-primary-foreground" {...props} />
          ),

          tbody: ({ node, ...props }) => (
            <tbody
              className="[&_tr:nth-child(even)]:bg-muted/30 divide-y divide-foreground/10"
              {...props}
            />
          ),

          tr: ({ node, ...props }) => (
            <tr
              className="border-b border-foreground/10 last:border-b-0 hover:bg-muted/20 transition-colors"
              {...props}
            />
          ),

          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 text-left font-bold text-sm border-r border-primary-foreground/20 last:border-r-0 align-top whitespace-normal"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              {...props}
            />
          ),

          td: ({ node, ...props }) => (
            <td
              className="px-3 py-2 text-sm border-r border-foreground/10 last:border-r-0 align-top break-words whitespace-normal"
              {...props}
            />
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
