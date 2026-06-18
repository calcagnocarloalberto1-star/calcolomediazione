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

function normalizeMarkdownTables(text: string): string {
  if (!text) return text;
  let result = text;

  // STEP 1 — Riga vuota prima della tabella
  // Cerca: carattere non-pipe + \n + riga-pipe + \n + riga-separatore
  // Il lookahead (?=...) verifica che la riga successiva sia effettivamente
  // un separatore GFM (solo -, :, |, spazi) prima di inserire la riga vuota,
  // così non spezza liste o altri elementi che iniziano con |.
  result = result.replace(
    /([^\n|])\n(\|[^\n]+\n[ \t]*\|[ \t]*[-:]+[-:\s|]*)/g,
    "$1\n\n$2"
  );

  // STEP 2 — Separatori non-standard: |===| o |___| → |---|
  result = result.replace(
    /^\|([ \t]*[=_][-=_\s|]*)\|[ \t]*$/gm,
    (match) => match.replace(/[=_]/g, "-")
  );

  // STEP 3 — Righe concatenate (fix legacy per record DB pre-patch)
  // "testo| |testo" indica due righe di tabella unite su una sola riga.
  // La regex originale era troppo aggressiva su celle vuote; questa versione
  // opera solo quando c'è uno spazio bianco ESTERNO alle celle (≥1 spazio
  // dopo | e ≥1 spazio prima di |), che segnala un confine di riga.
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
