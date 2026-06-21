import { jsPDF } from "jspdf";
import type { AnalisiCaso } from "../shared/schema.js";

let autoTablePluginApplied = false;
function ensureAutoTable() {
  if (!autoTablePluginApplied) {
    try {
      const autoTableModule = require("jspdf-autotable");
      const applyPlugin = autoTableModule.applyPlugin || autoTableModule.default?.applyPlugin;
      if (typeof applyPlugin === "function") applyPlugin(jsPDF);
      autoTablePluginApplied = true;
    } catch (e) {
      console.error("Failed to load jspdf-autotable:", e);
    }
  }
}

// ─── HELPERS NORMALIZZAZIONE TABELLE ─────────────────────────────────────
function isSepRow(line: string): boolean {
  const t = line.trim();
  if (!t.includes("-")) return false;
  const inner = t.replace(/^\|/, "").replace(/\|$/, "");
  if (!inner.includes("-")) return false;
  return inner.split("|").every((c) => /^\s*:?-{1,}:?\s*$/.test(c));
}

function looksLikeRow(line: string): boolean {
  const t = line.trim();
  if (!t.includes("|")) return false;
  return t.replace(/^\|/, "").replace(/\|$/, "").split("|").length >= 2;
}

function wrapPipes(line: string): string {
  let t = line.trim();
  if (!t.startsWith("|")) t = "| " + t;
  if (!t.endsWith("|")) t = t + " |";
  return t;
}

function normalizeTablesInText(text: string): string {
  let res = text.replace(
    /^\s*\|?([ \t]*[=_][-=_:\s|]*)\|?[ \t]*$/gm,
    (m) => m.replace(/[=_]/g, "-")
  );
  const lines = res.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = i + 1 < lines.length ? lines[i + 1] : "";
    if (looksLikeRow(line) && isSepRow(next)) {
      if (out.length > 0) {
        const prev = out[out.length - 1];
        if (prev.trim() !== "" && !looksLikeRow(prev) && !isSepRow(prev)) out.push("");
      }
      const block: string[] = [line, next];
      let j = i + 2;
      while (j < lines.length && (looksLikeRow(lines[j]) || isSepRow(lines[j]))) {
        block.push(lines[j]);
        j++;
      }
      for (const b of block) out.push(wrapPipes(b));
      if (j < lines.length && lines[j].trim() !== "") out.push("");
      i = j;
      continue;
    }
    out.push(line);
    i++;
  }
  return out.join("\n");
}

function preClean(text: string): string {
  if (!text) return "";
  // FIX: ripara tabelle inline (righe concatenate da spazi senza newline).
  const fixed = text.replace(
    /([^\s|])[ \t]*\|[ \t]+\|[ \t]*([^\s|])/g,
    "$1 |\n| $2"
  );
  // Normalizza pipe mancanti, blank line, separatori non-standard.
  const normalized = normalizeTablesInText(fixed);
  return normalized
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2192\u2794\u27A1\u21D2\u279C\u2B95]/g, "->")
    .replace(/[\u2190\u2B05]/g, "<-")
    .replace(/[\u2194\u21D4]/g, "<->")
    .replace(/[\u2191\u2B06]/g, "^")
    .replace(/[\u2193\u2B07]/g, "v")
    .replace(/[\u2022\u2023\u25CF\u25CB\u25A0\u25AA\u25AB\u25A1\u2981\u26AB\u26AA]/g, "-")
    .replace(/[\u25B6\u25B8\u25BA\u25C6\u25C7\u25C8]/g, "-")
    .replace(/[\u2713\u2714\u2705\u2611]/g, "[OK]")
    .replace(/[\u2717\u2718\u274C\u2716\u274E]/g, "[NO]")
    .replace(/[\u2610]/g, "[ ]")
    .replace(/[\u2605\u2B50\u2606\u2729\u272A]/g, "*")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2026]/g, "...")
    .replace(/[\u00B7\u2022\u2219]/g, "-")
    .replace(/[\u00A0]/g, " ")
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/[\u00AB\u00BB]/g, '"')
    .replace(/[\u26A0\u2757\u2755\u2753\u2754]/g, "[!]")
    .replace(/[\u2139\u24D8]/g, "[i]")
    .replace(/[\u2264]/g, "<=")
    .replace(/[\u2265]/g, ">=")
    .replace(/[\u2260]/g, "!=")
    .replace(/[\u00D7]/g, "x")
    .replace(/[\u00F7]/g, "/")
    .replace(/[\u221E]/g, "inf")
    .replace(/[\u2211]/g, "Sum")
    .replace(/[\u0394]/g, "Delta")
    .replace(/[\u20AC]/g, "EUR")
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F700}-\u{1F77F}]/gu, "")
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, "")
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
    .replace(/[\u{1FB00}-\u{1FBFF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{E0020}-\u{E007F}]/gu, "")
    .replace(/[\u{20E3}]/gu, "")
    .replace(/[^\x00-\xFF]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*\*([\s\S]+?)\*\*\*/g, "$1")
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/__([\s\S]+?)__/g, "$1")
    .replace(/\*([\s\S]+?)\*/g, "$1")
    .replace(/_([\s\S]+?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~([\s\S]+?)~~/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "- ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "  ")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/\*{1,3}/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanCell(text: string): string {
  const cleaned = sanitizeText(stripMarkdown(preClean(text)));
  // FIX: limite alzato da 250 -> 2000 caratteri.
  // jspdf-autotable gestisce automaticamente il wrap multilinea delle celle.
  // Il vecchio limite a 250 char troncava contenuto utile delle tabelle AI
  // (scenari ZOPA, motivazioni, riferimenti normativi).
  return cleaned.length > 2000 ? cleaned.substring(0, 1997) + "..." : cleaned;
}

interface ParsedTable { headers: string[]; rows: string[][]; }

function parseMarkdownTable(text: string): ParsedTable | null {
  // Applica wrapPipes per essere robusto anche se chiamato con righe non normalizzate.
  const rawLines = text.trim().split("\n");
  if (rawLines.length < 3) return null;
  const lines = rawLines.map((l) => (looksLikeRow(l) || isSepRow(l) ? wrapPipes(l) : l));
  const headerLine = lines[0].trim();
  if (!headerLine.startsWith("|") || !headerLine.endsWith("|")) return null;
  if (headerLine.length > 1000) return null;
  const sepLine = lines[1].trim();
  if (!sepLine.match(/^\|[\s|:\-]+\|$/)) return null;
  const parseRow = (line: string): string[] =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
  const headers = parseRow(headerLine);
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) break;
    if (!line.startsWith("|") || !line.endsWith("|")) break;
    if (/^\|[-\s|:]+\|$/.test(line)) continue;
    rows.push(parseRow(line));
  }
  if (!headers.length || !rows.length) return null;

  // FIX: normalizzo le righe alla larghezza dell'header.
  // Le righe con meno celle vengono paddate, quelle con piu' celle troncate.
  // Cosi' jspdf-autotable disegna sempre tabelle ben allineate.
  const cols = headers.length;
  const normRows = rows.map(r => {
    if (r.length < cols) return [...r, ...Array(cols - r.length).fill("")];
    if (r.length > cols) return r.slice(0, cols);
    return r;
  });

  return { headers, rows: normRows };
}

interface ContentSegment { type: "text" | "table"; content: string; table?: ParsedTable; }

function splitSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  // Usiamo looksLikeRow/isSepRow: il testo è già normalizzato da preClean,
  // ma restiamo tolleranti.
  const lines = text.split("\n");
  let buf: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const isTableStart =
      looksLikeRow(line) &&
      i + 1 < lines.length && isSepRow(lines[i + 1]);
    if (isTableStart) {
      if (buf.length) { segments.push({ type: "text", content: buf.join("\n") }); buf = []; }
      const tableLines = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && (looksLikeRow(lines[i]) || isSepRow(lines[i]))) {
        tableLines.push(lines[i++]);
      }
      const table = parseMarkdownTable(tableLines.join("\n"));
      if (table) segments.push({ type: "table", content: tableLines.join("\n"), table });
      else buf.push(...tableLines);
    } else { buf.push(line); i++; }
  }
  if (buf.length) segments.push({ type: "text", content: buf.join("\n") });
  return segments;
}

function extractSections(text: string): Array<{ level: number; heading: string; body: string }> {
  const sections: Array<{ level: number; heading: string; body: string }> = [];
  const lines = text.split("\n");
  let lvl = 0, heading = "", body: string[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,4})\s+(.+)/);
    if (m) {
      if (heading || body.length) sections.push({ level: lvl, heading, body: body.join("\n").trim() });
      lvl = m[1].length; heading = m[2]; body = [];
    } else body.push(line);
  }
  if (heading || body.length) sections.push({ level: lvl, heading, body: body.join("\n").trim() });
  return sections;
}

export function generateAnalisiPdf(analisi: AnalisiCaso): Buffer {
  ensureAutoTable();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 18, marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const marginBottom = 25, maxY = pageHeight - marginBottom;
  let y = 0;

  // ─── COLORI ───────────────────────────────────────────────────────────────
  const primaryColor: [number, number, number] = [38, 150, 140];
  const darkColor: [number, number, number] = [40, 40, 40];
  const grayColor: [number, number, number] = [110, 110, 110];
  const lightGray: [number, number, number] = [160, 160, 160];
  const warmBg: [number, number, number] = [248, 250, 252];
  const tableHeaderBg: [number, number, number] = [38, 150, 140];
  const tableHeaderText: [number, number, number] = [255, 255, 255];
  const tableAltBg: [number, number, number] = [245, 250, 249];
  const white: [number, number, number] = [255, 255, 255];
  const sectionBg: [number, number, number] = [245, 250, 249];
  const bulletColor: [number, number, number] = [38, 150, 140];

  // ─── TIPOGRAFIA ───────────────────────────────────────────────────────────
  const LINE_HEIGHT   = 5.2;
  const PARA_SPACING  = 5;
  const BULLET_INDENT = 8;
  const BULLET_DOT_X  = marginLeft + 2.5;

  const now = new Date();
  const dateStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });

  // ─── UTILITY ──────────────────────────────────────────────────────────────
  function checkNewPage(space = 15) {
    if (y + space > maxY) { doc.addPage(); y = 20; }
  }

  function renderTable(table: ParsedTable) {
    checkNewPage(25);
    const heads = table.headers.map(cleanCell);
    const body = table.rows.map(r => r.map(cleanCell));
    const allCells = [...heads, ...body.flat()];
    const avg = allCells.reduce((s, c) => s + c.length, 0) / Math.max(allCells.length, 1);

    // FIX: il fallback testo per tabelle malformate non deve perdere le celle vuote.
    // Usa "-" come placeholder per le celle vuote in modo da preservare l'allineamento.
    if (heads.length <= 1 || avg > 300) {
      for (const row of [heads, ...body]) {
        const txt = row.map(c => c.trim() || "-").join(" | ");
        if (!txt.trim() || /^[\-\s|]+$/.test(txt)) continue;
        doc.setFontSize(9); doc.setTextColor(...darkColor); doc.setFont("helvetica", "normal");
        for (const wl of doc.splitTextToSize(sanitizeText(txt), contentWidth)) {
          checkNewPage(6); doc.text(wl, marginLeft, y); y += LINE_HEIGHT;
        }
      }
      y += PARA_SPACING; return;
    }
    (doc as any).autoTable({
      startY: y, head: [heads], body,
      margin: { left: marginLeft, right: marginRight }, tableWidth: contentWidth,
      styles: {
        fontSize: 8.5,
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
        lineColor: [220, 215, 210], lineWidth: 0.25,
        textColor: darkColor, font: "helvetica", overflow: "linebreak",
      },
      headStyles: {
        fillColor: tableHeaderBg, textColor: tableHeaderText,
        fontStyle: "bold", fontSize: 8.5, lineWidth: 0,
        cellPadding: { top: 5, right: 4, bottom: 5, left: 4 },
      },
      alternateRowStyles: { fillColor: tableAltBg },
      bodyStyles: { lineColor: [230, 225, 220], lineWidth: 0.15 },
      didDrawPage: () => {},
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 10;
    y += 8;
  }

  // ─── RENDER BODY ──────────────────────────────────────────────────────────
  function renderBody(body: string) {
    if (!body.trim()) return;

    for (const seg of splitSegments(preClean(body))) {
      if (seg.type === "table" && seg.table) {
        renderTable(seg.table);
        continue;
      }

      const cleaned = stripMarkdown(seg.content);
      const paragraphs = cleaned.split(/\n\n+/);

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        const lines = trimmed.split("\n");

        for (const line of lines) {
          const l = line.trim();
          if (!l) { y += 2; continue; }
          if (/^\|[-\s|:]+\|$/.test(l)) continue;

          const isBullet = l.startsWith("- ") || l.startsWith("* ");
          const isNumList = /^\d+\.\s/.test(l);

          if (isBullet || isNumList) {
            const bulletText = isBullet
              ? l.replace(/^[-*]\s+/, "")
              : l.replace(/^\d+\.\s+/, "");

            const wrappedLines = doc.splitTextToSize(
              sanitizeText(bulletText),
              contentWidth - BULLET_INDENT - 2
            );

            checkNewPage(LINE_HEIGHT * wrappedLines.length + 3);

            doc.setFillColor(...bulletColor);
            doc.circle(BULLET_DOT_X, y - 1.2, 0.9, "F");

            doc.setFontSize(9.5);
            doc.setTextColor(...darkColor);
            doc.setFont("helvetica", "normal");
            doc.text(wrappedLines[0], marginLeft + BULLET_INDENT, y);
            y += LINE_HEIGHT;

            for (let wi = 1; wi < wrappedLines.length; wi++) {
              checkNewPage(LINE_HEIGHT);
              doc.text(wrappedLines[wi], marginLeft + BULLET_INDENT, y);
              y += LINE_HEIGHT;
            }

            y += 1.5;

          } else {
            const wrappedLines = doc.splitTextToSize(
              sanitizeText(l),
              contentWidth
            );

            doc.setFontSize(9.5);
            doc.setTextColor(...darkColor);
            doc.setFont("helvetica", "normal");

            for (const wl of wrappedLines) {
              checkNewPage(LINE_HEIGHT);
              doc.text(wl, marginLeft, y);
              y += LINE_HEIGHT;
            }
          }
        }

        y += PARA_SPACING;
      }
    }
  }

  // ─── COVER PAGE ───────────────────────────────────────────────────────────
  const cx = pageWidth / 2;
  y = 35;

  doc.setFontSize(28); doc.setTextColor(...primaryColor); doc.setFont("helvetica", "bold");
  doc.text("CalcoloMediazione", cx, y, { align: "center" });
  y += 10;

  doc.setFontSize(12); doc.setTextColor(...grayColor); doc.setFont("helvetica", "normal");
  doc.text("Analisi AI del Caso", cx, y, { align: "center" });
  y += 8;

  doc.setDrawColor(...primaryColor); doc.setLineWidth(1.2);
  const lineW = 50;
  doc.line(cx - lineW / 2, y, cx + lineW / 2, y);
  y += 16;

  doc.setFontSize(16); doc.setTextColor(...darkColor); doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(sanitizeText(analisi.titolo), contentWidth - 20);
  for (const tl of titleLines) { doc.text(tl, cx, y, { align: "center" }); y += 9; }
  y += 6;

  const parti = analisi.parti as Array<{ nome: string; ruolo: string }> | null;
  if (parti && parti.length > 0) {
    const istanti = parti.filter(p => p.ruolo === "istante" || p.ruolo === "Istante");
    const convenuti = parti.filter(p => p.ruolo !== "istante" && p.ruolo !== "Istante");
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(...darkColor);
    if (istanti.length > 0) {
      const iStr = istanti.map(p => sanitizeText(p.nome)).join(" e ") + " (istanti)";
      doc.text(iStr, cx, y, { align: "center" }); y += 7;
    }
    doc.setFontSize(9); doc.setTextColor(...grayColor);
    doc.text("vs", cx, y, { align: "center" }); y += 7;
    if (convenuti.length > 0) {
      doc.setFontSize(10); doc.setTextColor(...darkColor);
      const cStr = convenuti.map(p => sanitizeText(p.nome)).join(", ") + " (chiamati)";
      const cLines = doc.splitTextToSize(cStr, contentWidth - 20);
      for (const cl of cLines) { doc.text(cl, cx, y, { align: "center" }); y += 7; }
    }
  }
  y += 12;

  const metaLabelX = pageWidth / 2 - 40;
  const metaValueX = pageWidth / 2 - 5;
  const drawMeta = (label: string, value: string) => {
    doc.setFontSize(8.5); doc.setTextColor(...grayColor); doc.setFont("helvetica", "bold");
    doc.text(label + ":", metaLabelX, y, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(...darkColor);
    doc.text(sanitizeText(value), metaValueX, y);
    y += 7;
  };
  drawMeta("Data analisi", dateStr);
  drawMeta("Valore controversia", analisi.valoreLite
    ? `EUR ${Number(analisi.valoreLite).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`
    : "Indeterminato");
  drawMeta("Materia", (analisi.tipoAnalisi === "mediazione"
    ? "Contratti assicurativi - Mediazione obbligatoria"
    : "Negoziazione Assistita"));
  if (analisi.stato) drawMeta("Stato", analisi.stato === "completata" ? "Analisi Completata" : analisi.stato);
  y += 10;

  // ─── BOX DESCRIZIONE — FIX: paginazione corretta ──────────────────────────
  // Vecchio comportamento: box di altezza min(necessaria, residuo pagina) +
  // loop con `break` che troncava silenziosamente le righe in eccesso.
  // Nuovo: se la descrizione entra nello spazio residuo della cover, disegna
  // il box compatto. Altrimenti, sposta la descrizione su una pagina
  // dedicata e la rende paginata correttamente (page break automatico).
  if (analisi.descrizione) {
    // Setto font PRIMA di splitTextToSize cosi' il wrap viene misurato
    // alla stessa size con cui poi disegno: evita overflow orizzontale e
    // stime di altezza incoerenti col rendering effettivo.
    doc.setFontSize(9.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...darkColor);
    const descText = sanitizeText(stripMarkdown(preClean(analisi.descrizione)));
    const descLines = doc.splitTextToSize(descText, contentWidth - 16);
    const boxPaddingV = 8;
    const neededH = descLines.length * LINE_HEIGHT + boxPaddingV * 2;
    const availH = (pageHeight - 25) - y - 10; // 25 mm riservati al footer

    if (neededH <= availH) {
      // Caso A: tutto entra nella cover -> box compatto come prima
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.4);
      doc.setFillColor(252, 252, 252);
      doc.roundedRect(marginLeft, y, contentWidth, neededH, 2, 2, "FD");
      // Rinforzo font dopo il rect (alcuni setFillColor lo resettano implicitamente)
      doc.setFontSize(9.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...darkColor);
      let dy = y + boxPaddingV + LINE_HEIGHT * 0.2;
      for (const dl of descLines) {
        doc.text(dl, marginLeft + 8, dy);
        dy += LINE_HEIGHT;
      }
      y += neededH + 8;
    } else {
      // Caso B: la descrizione e' lunga -> pagina dedicata
      // Disegno il footer della cover prima di passare alla pagina dedicata
      doc.setFontSize(7); doc.setTextColor(...lightGray); doc.setFont("helvetica", "normal");
      doc.text(
        "Questo documento ha valore informativo e non sostituisce la consulenza legale professionale.",
        cx, pageHeight - 15, { align: "center" }
      );
      doc.addPage();
      y = 15;
      doc.setFillColor(...primaryColor); doc.rect(0, 0, pageWidth, 5, "F");
      y = 22;
      doc.setFontSize(13); doc.setTextColor(...primaryColor); doc.setFont("helvetica", "bold");
      doc.text("Descrizione del caso", marginLeft, y);
      y += 8;
      doc.setDrawColor(...primaryColor); doc.setLineWidth(0.6);
      doc.line(marginLeft, y, marginLeft + contentWidth, y);
      y += 9;
      doc.setFontSize(9.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...darkColor);
      for (const dl of descLines) {
        checkNewPage(LINE_HEIGHT);
        doc.text(dl, marginLeft, y);
        y += LINE_HEIGHT;
      }
    }
  }

  // Footer della cover solo se la descrizione e' stata renderizzata sulla cover.
  // Nel caso B il footer e' gia' stato disegnato prima di addPage().
  // Per evitare doppia scrittura controllo numero pagine = 1.
  if (doc.getNumberOfPages() === 1) {
    doc.setFontSize(7); doc.setTextColor(...lightGray); doc.setFont("helvetica", "normal");
    doc.text(
      "Questo documento ha valore informativo e non sostituisce la consulenza legale professionale.",
      cx, pageHeight - 15, { align: "center" }
    );
  }

  // ─── SEZIONI CONTENUTO ────────────────────────────────────────────────────
  const sections = [
    { title: "1. Estrazione Entita (NER)", content: analisi.prospettoEconomico, icon: "NER" },
    { title: "2. Analisi Giuridica",       content: analisi.analisiGiuridica,    icon: "GIU" },
    { title: "3. Guida Strategica",        content: analisi.guidaStrategica,     icon: "STR" },
    { title: "4. Analisi MAAN/BATNA",      content: analisi.analisiMaanBatna,    icon: "MAA" },
    { title: "5. Compatibilita Interessi", content: analisi.compatibilitaInteressi, icon: "INT" },
    { title: "6. Controllo Bias Cognitivi",content: analisi.controlloBiasCognitivi, icon: "BIA" },
    { title: "7. Bozza Accordo",           content: analisi.bozzaAccordo,        icon: "ACC" },
    { title: "8. Analisi Economica Comparativa", content: analisi.analisiEconomica, icon: "ECO" },
  ];

  for (const sec of sections) {
    if (!sec.content) continue;
    doc.addPage(); y = 15;

    doc.setFillColor(...primaryColor); doc.rect(0, 0, pageWidth, 5, "F");
    y = 18;

    doc.setFillColor(...primaryColor); doc.roundedRect(marginLeft, y - 3, 14, 8, 1, 1, "F");
    doc.setFontSize(6.5); doc.setTextColor(...white); doc.setFont("helvetica", "bold");
    doc.text(sec.icon, marginLeft + 7, y + 2.5, { align: "center" });

    doc.setFontSize(14); doc.setTextColor(...darkColor); doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(sec.title), marginLeft + 18, y + 2.5);
    y += 13;

    doc.setDrawColor(...primaryColor); doc.setLineWidth(0.6);
    doc.line(marginLeft, y, marginLeft + contentWidth, y);
    y += 10;

    for (const sub of extractSections(preClean(sec.content))) {
      if (sub.heading) {
        checkNewPage(16);
        const h = sanitizeText(stripMarkdown(sub.heading));
        if (sub.level <= 2) {
          // FIX: heading di sezione con wrap per titoli lunghi.
          // jsPDF non fa autowrap su doc.text; senza splitTextToSize
          // i titoli lunghi uscivano dal margine destro.
          const headLines = doc.splitTextToSize(h, contentWidth - 8);
          const blockH = Math.max(9, headLines.length * 5 + 4);
          checkNewPage(blockH + 2);
          doc.setFillColor(...sectionBg);
          doc.roundedRect(marginLeft, y - 3.5, contentWidth, blockH, 1, 1, "F");
          doc.setFontSize(10.5); doc.setTextColor(...primaryColor); doc.setFont("helvetica", "bold");
          let hy = y + 2.2;
          for (const hl of headLines) {
            doc.text(hl, marginLeft + 5, hy);
            hy += 5;
          }
          y += blockH + 2;
        } else {
          const headLines = doc.splitTextToSize(h, contentWidth - 4);
          doc.setFontSize(10); doc.setTextColor(...darkColor); doc.setFont("helvetica", "bold");
          for (const hl of headLines) {
            checkNewPage(7);
            doc.text(hl, marginLeft + 2, y);
            y += 5;
          }
          y += 2;
        }
      }
      if (sub.body) renderBody(sub.body);
      y += 3;
    }
  }

  // ─── DISCLAIMER — FIX: altezza dinamica e paginazione corretta ────────────
  // Vecchio: rect di altezza fissa 32 mm; con line wrap il testo poteva
  // uscire dal box. Nuovo: misuro le righe effettive, calcolo l'altezza,
  // garantisco lo spazio con checkNewPage.
  {
    const disc1 = doc.splitTextToSize(
      "Questo documento e stato generato automaticamente dalla piattaforma CalcoloMediazione con l'ausilio di intelligenza artificiale.",
      contentWidth - 10
    );
    const disc2 = doc.splitTextToSize(
      "Le informazioni contenute hanno valore puramente informativo e orientativo. Non sostituiscono in alcun modo la consulenza legale professionale di un avvocato abilitato.",
      contentWidth - 10
    );
    const totalLines = disc1.length + disc2.length;
    const disclaimerH = 10 + totalLines * 4 + 12; // titolo + righe + data
    checkNewPage(disclaimerH + 12);

    y += 8;
    doc.setDrawColor(...primaryColor); doc.setLineWidth(1);
    doc.line(marginLeft, y, pageWidth - marginRight, y); y += 10;

    doc.setFillColor(...warmBg); doc.setDrawColor(220, 215, 210); doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, y, contentWidth, disclaimerH, 2, 2, "FD");

    doc.setFontSize(8); doc.setTextColor(...primaryColor); doc.setFont("helvetica", "bold");
    doc.text("AVVERTENZE", marginLeft + 5, y + 8);

    doc.setFontSize(7.5); doc.setTextColor(...grayColor); doc.setFont("helvetica", "normal");
    let dY = y + 14;
    for (const dl of disc1) { doc.text(dl, marginLeft + 5, dY); dY += 4; }
    dY += 1;
    for (const dl of disc2) { doc.text(dl, marginLeft + 5, dY); dY += 4; }
    doc.setTextColor(...lightGray);
    doc.text(`Generato il ${dateStr} | calcolomediazione.it`, marginLeft + 5, dY + 3);

    y += disclaimerH;
  }

  // ─── HEADER & FOOTER PAGINE ───────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    if (i > 1) {
      doc.setFontSize(7); doc.setTextColor(...lightGray); doc.setFont("helvetica", "normal");
      doc.text("CalcoloMediazione", marginLeft, 10);
      doc.text("Relazione Analisi AI", pageWidth - marginRight, 10, { align: "right" });
    }
    doc.setDrawColor(220, 215, 210); doc.setLineWidth(0.3);
    doc.line(marginLeft, pageHeight - 16, pageWidth - marginRight, pageHeight - 16);
    doc.setFontSize(7); doc.setTextColor(...lightGray); doc.setFont("helvetica", "normal");
    if (i === 1) {
      doc.text(`Pagina ${i} di ${total}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    } else {
      doc.text("calcolomediazione.it", marginLeft, pageHeight - 10);
      doc.text(`Pagina ${i} di ${total}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text(dateStr, pageWidth - marginRight, pageHeight - 10, { align: "right" });
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}
