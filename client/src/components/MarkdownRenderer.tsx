import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

// ─── NORMALIZZAZIONE TABELLE INLINE ────────────────────────────────────────
// Patch difensiva applicata al content prima del rendering.
// Ripara tabelle Markdown in cui l'AI ha concatenato piu' righe su una
// sola linea (header, separator e dati uniti da spazi al posto dei
// newline). Senza questa normalizzazione, remark-gfm non riconosce la
// tabella e la mostra come paragrafo lungo che esce dal contenitore o
// viene "tagliato" a video.
//
// Pattern riconosciuto: "<testo>|<spazi>|<testo>" = fine cella + nuova
// riga. Il separatore di celle interno e' "<testo>|<testo>" senza spazi,
// quindi non viene toccato. La regex e' globale: gestisce piu' righe
// concatenate iterativamente.
//
// Risolve anche eventuali tabelle nei record vecchi del DB che erano gia'
// stati salvati malformati dall'AI prima della patch lato backend.
function fixInlineTables(text: string): string {
  if (!text) return text;
  return text.replace(
    /([^\s|])[ \t]*\|[ \t]+\|[ \t]*([^\s|])/g,
    "$1 |\n| $2"
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const normalized = fixInlineTables(content);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert
      prose-headings:font-display prose-headings:tracking-tight
      prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b-2 prose-h2:border-foreground/20 prose-h2:pb-2
      prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
      prose-h4:text-base prose-h4:mt-3 prose-h4:mb-1
      prose-p:text-sm prose-p:leading-relaxed prose-p:mb-3
      prose-li:text-sm prose-li:leading-relaxed
      prose-strong:text-foreground
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-sm prose-blockquote:italic
      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
    "
    style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Tabelle: wrapper scrollabile + zebra striping + word-break.
          // Risolve:
          //   - tabelle larghe che uscivano dal contenitore (ora scroll
          //     orizzontale invece di overflow visivo)
          //   - mancanza di alternanza colori righe
          //   - testi lunghi nelle celle che spingevano la colonna oltre
          //     la sua larghezza (ora break-words)
          //   - allineamento verticale incoerente con celle multilinea
          //     (ora align-top uniforme)
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto border-2 border-foreground/80 bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <table className="w-full text-sm border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-primary text-primary-foreground" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="[&_tr:nth-child(even)]:bg-muted/30" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-foreground/10 last:border-b-0" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 text-left font-bold text-sm border-r border-primary-foreground/20 last:border-r-0 align-top whitespace-normal"
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
