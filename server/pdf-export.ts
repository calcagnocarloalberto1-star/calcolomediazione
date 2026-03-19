import { jsPDF } from "jspdf";
import type { AnalisiCaso } from "../shared/schema.js";

// jspdf-autotable: use dynamic require + applyPlugin for CJS bundle compatibility
let autoTablePluginApplied = false;
function ensureAutoTable() {
  if (!autoTablePluginApplied) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const autoTableModule = require("jspdf-autotable");
      const applyPlugin = autoTableModule.applyPlugin || autoTableModule.default?.applyPlugin;
      if (typeof applyPlugin === "function") {
        applyPlugin(jsPDF);
      }
      autoTablePluginApplied = true;
    } catch (e) {
      console.error("Failed to load jspdf-autotable:", e);
    }
  }
}

// Comprehensive sanitization: replace all characters jsPDF can't render (Helvetica = Latin-1 only)
function sanitizeText(text: string): string {
  return text
    // Common Unicode arrows → ASCII
    .replace(/[\u2192\u2794\u27A1\u21D2\u279C\u2B95]/g, "->")
    .replace(/[\u2190\u2B05]/g, "<-")
    .replace(/[\u2194\u21D4]/g, "<->")
    .replace(/[\u2191\u2B06]/g, "^")
    .replace(/[\u2193\u2B07]/g, "v")
    // Bullet/list markers
    .replace(/[\u2022\u2023\u25CF\u25CB\u25A0\u25AA\u25AB\u25A1\u2981\u26AB\u26AA]/g, "-")
    .replace(/[\u25B6\u25B8\u25BA\u25C6\u25C7\u25C8]/g, "-")
    // Check/cross marks
    .replace(/[\u2713\u2714\u2705\u2611]/g, "[OK]")
    .replace(/[\u2717\u2718\u274C\u2716\u274E]/g, "[NO]")
    .replace(/[\u2610]/g, "[ ]")
    // Stars/ratings
    .replace(/[\u2605\u2B50\u2606\u2729\u272A]/g, "*")
    // Common symbols
    .replace(/[\u2013\u2014]/g, "-")                    // en/em dash
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")         // smart single quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')         // smart double quotes
    .replace(/[\u2026]/g, "...")                          // ellipsis
    .replace(/[\u00B7\u2022\u2219]/g, "-")               // middle dot / bullet
    .replace(/[\u00A0]/g, " ")                            // non-breaking space
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")          // zero-width chars
    .replace(/[\u00AB\u00BB]/g, '"')                      // guillemets
    // Warning/info symbols
    .replace(/[\u26A0\u2757\u2755\u2753\u2754]/g, "[!]")
    .replace(/[\u2139\u24D8]/g, "[i]")
    // Math symbols common in legal/financial text
    .replace(/[\u2264]/g, "<=")
    .replace(/[\u2265]/g, ">=")
    .replace(/[\u2260]/g, "!=")
    .replace(/[\u00D7]/g, "x")
    .replace(/[\u00F7]/g, "/")
    .replace(/[\u221E]/g, "inf")
    .replace(/[\u2211]/g, "Sum")
    .replace(/[\u0394]/g, "Delta")
    // Currency
    .replace(/[\u20AC]/g, "EUR")
    // Strip remaining emoji ranges (comprehensive)
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")   // emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")   // misc symbols & pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")   // transport & map
    .replace(/[\u{1F700}-\u{1F77F}]/gu, "")   // alchemical
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, "")   // geometric shapes extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, "")   // supplemental arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")   // supplemental symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")   // chess symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")   // symbols and pictographs ext-A
    .replace(/[\u{1FB00}-\u{1FBFF}]/gu, "")   // symbols for legacy computing
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")   // flags
    .replace(/[\u{2600}-\u{26FF}]/gu, "")     // misc symbols (remaining)
    .replace(/[\u{2700}-\u{27BF}]/gu, "")     // dingbats (remaining)
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")     // variation selectors
    .replace(/[\u{E0020}-\u{E007F}]/gu, "")   // tags
    .replace(/[\u{20E3}]/gu, "")               // combining enclosing keycap
    // Final cleanup: remove any remaining non-Latin1 characters
    // Keep basic Latin, Latin-1 Supplement, and common accented chars
    .replace(/[^\x00-\xFF]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Parse a markdown table into structured data
interface ParsedTable {
  headers: string[];
  rows: string[][];
}

function parseMarkdownTable(text: string): ParsedTable | null {
  const lines = text.trim().split("\n");
  if (lines.length < 3) return null;

  // Header row
  const headerLine = lines[0].trim();
  if (!headerLine.includes("|")) return null;

  // Separator row (must have dashes)
  const sepLine = lines[1].trim();
  if (!sepLine.match(/^[\s|:-]+$/)) return null;

  const parseRow = (line: string): string[] => {
    return line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => cell.trim());
  };

  const headers = parseRow(headerLine);
  const rows: string[][] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.includes("|")) break;
    rows.push(parseRow(line));
  }

  if (headers.length === 0 || rows.length === 0) return null;
  return { headers, rows };
}

// Split markdown content into segments: text blocks and tables
interface ContentSegment {
  type: "text" | "table";
  content: string;
  table?: ParsedTable;
}

function splitContentIntoSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const lines = text.split("\n");
  let textBuffer: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect start of table: line with | and next line is separator
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].match(/^[\s|:-]+$/)) {
      // Flush text buffer
      if (textBuffer.length > 0) {
        segments.push({ type: "text", content: textBuffer.join("\n") });
        textBuffer = [];
      }

      // Collect table lines
      const tableLines: string[] = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].trim().includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      const table = parseMarkdownTable(tableLines.join("\n"));
      if (table) {
        segments.push({ type: "table", content: tableLines.join("\n"), table });
      } else {
        textBuffer.push(...tableLines);
      }
    } else {
      textBuffer.push(line);
      i++;
    }
  }

  if (textBuffer.length > 0) {
    segments.push({ type: "text", content: textBuffer.join("\n") });
  }

  return segments;
}

// Strip markdown formatting for plain text rendering
function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")           // headers
    .replace(/\*\*(.+?)\*\*/g, "$1")        // bold
    .replace(/\*(.+?)\*/g, "$1")            // italic
    .replace(/__(.+?)__/g, "$1")            // bold alt
    .replace(/_(.+?)_/g, "$1")              // italic alt
    .replace(/`(.+?)`/g, "$1")              // inline code
    .replace(/~~(.+?)~~/g, "$1")            // strikethrough
    .replace(/^\s*[-*+]\s+/gm, "- ")        // unordered lists → dash
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")     // links → text only
    .replace(/^>\s+/gm, "  ")               // blockquotes
    .replace(/^---+$/gm, "")                // horizontal rules
    .replace(/\n{3,}/g, "\n\n");            // collapse multiple newlines
}

// Extract markdown headers (##, ###, ####) with their content
function extractStructuredSections(text: string): Array<{ level: number; heading: string; body: string }> {
  const sections: Array<{ level: number; heading: string; body: string }> = [];
  const lines = text.split("\n");
  let currentLevel = 0;
  let currentHeading = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      if (currentHeading || currentBody.length > 0) {
        sections.push({ level: currentLevel, heading: currentHeading, body: currentBody.join("\n").trim() });
      }
      currentLevel = headerMatch[1].length;
      currentHeading = headerMatch[2];
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentHeading || currentBody.length > 0) {
    sections.push({ level: currentLevel, heading: currentHeading, body: currentBody.join("\n").trim() });
  }
  return sections;
}

// Draw the Scale (bilancia) logo icon using jsPDF vector drawing
function drawLogoIcon(doc: jsPDF, x: number, y: number, size: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setFillColor(...color);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size;

  // Base/stand (triangle at bottom)
  const baseW = s * 0.4;
  const baseH = s * 0.1;
  doc.setLineWidth(0.3);
  doc.triangle(
    cx - baseW / 2, cy + s * 0.38,
    cx + baseW / 2, cy + s * 0.38,
    cx, cy + s * 0.38 - baseH,
    "F"
  );

  // Central pillar
  doc.setLineWidth(s * 0.04);
  doc.line(cx, cy - s * 0.3, cx, cy + s * 0.28);

  // Cross beam
  const beamW = s * 0.4;
  doc.line(cx - beamW, cy - s * 0.3, cx + beamW, cy - s * 0.3);

  // Left pan (small arc/cup)
  const panW = s * 0.16;
  const panY = cy - s * 0.1;
  const leftX = cx - beamW;
  // Left chain
  doc.setLineWidth(s * 0.02);
  doc.line(leftX, cy - s * 0.3, leftX, panY - s * 0.04);
  // Left cup
  doc.setLineWidth(s * 0.03);
  doc.line(leftX - panW, panY, leftX + panW, panY);
  // Arc (simplified with lines)
  doc.line(leftX - panW, panY, leftX - panW * 0.6, panY + s * 0.1);
  doc.line(leftX + panW, panY, leftX + panW * 0.6, panY + s * 0.1);
  doc.line(leftX - panW * 0.6, panY + s * 0.1, leftX + panW * 0.6, panY + s * 0.1);

  // Right pan
  const rightX = cx + beamW;
  // Right chain
  doc.setLineWidth(s * 0.02);
  doc.line(rightX, cy - s * 0.3, rightX, panY - s * 0.04);
  // Right cup
  doc.setLineWidth(s * 0.03);
  doc.line(rightX - panW, panY, rightX + panW, panY);
  doc.line(rightX - panW, panY, rightX - panW * 0.6, panY + s * 0.1);
  doc.line(rightX + panW, panY, rightX + panW * 0.6, panY + s * 0.1);
  doc.line(rightX - panW * 0.6, panY + s * 0.1, rightX + panW * 0.6, panY + s * 0.1);
}


export function generateAnalisiPdf(analisi: AnalisiCaso): Buffer {
  ensureAutoTable();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 18;
  const marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const marginBottom = 25;
  const maxY = pageHeight - marginBottom;

  let y = 0;

  // Colors — CalcoloMediazione design system
  const primaryColor: [number, number, number] = [197, 90, 43];   // burnt orange #c55a2b
  const darkColor: [number, number, number] = [45, 41, 38];       // deep charcoal #2d2926
  const grayColor: [number, number, number] = [120, 115, 110];
  const lightGray: [number, number, number] = [160, 155, 150];
  const warmBg: [number, number, number] = [245, 240, 235];       // warm gray #f5f0eb
  const tableHeaderBg: [number, number, number] = [197, 90, 43];  // orange headers
  const tableHeaderText: [number, number, number] = [255, 255, 255];
  const tableAltBg: [number, number, number] = [250, 247, 243];
  const white: [number, number, number] = [255, 255, 255];
  const sectionBg: [number, number, number] = [248, 244, 240];

  const now = new Date();
  const dateStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });

  function checkNewPage(neededSpace: number = 15) {
    if (y + neededSpace > maxY) {
      doc.addPage();
      y = 20;
    }
  }

  function addText(text: string, fontSize: number, color: [number, number, number], lineHeight: number = 5): void {
    const clean = sanitizeText(text);
    if (!clean) return;
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(clean, contentWidth);
    for (const line of lines) {
      checkNewPage(lineHeight + 2);
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }
  }

  function addBoldText(text: string, fontSize: number, color: [number, number, number], lineHeight: number = 5): void {
    const clean = sanitizeText(text);
    if (!clean) return;
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(clean, contentWidth);
    for (const line of lines) {
      checkNewPage(lineHeight + 2);
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }
  }

  function renderTable(table: ParsedTable) {
    checkNewPage(25);

    const cleanCell = (c: string) => sanitizeText(stripMarkdownFormatting(c));
    const sanitizedHeaders = table.headers.map(cleanCell);
    const sanitizedRows = table.rows.map(row => row.map(cleanCell));

    (doc as any).autoTable({
      startY: y,
      head: [sanitizedHeaders],
      body: sanitizedRows,
      margin: { left: marginLeft, right: marginRight },
      tableWidth: contentWidth,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [220, 215, 210],
        lineWidth: 0.25,
        textColor: darkColor,
        font: "helvetica",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: tableHeaderBg,
        textColor: tableHeaderText,
        fontStyle: "bold",
        fontSize: 8,
        lineWidth: 0,
        cellPadding: 3.5,
      },
      alternateRowStyles: {
        fillColor: tableAltBg,
      },
      bodyStyles: {
        lineColor: [230, 225, 220],
        lineWidth: 0.15,
      },
      didDrawPage: () => {},
    });

    // Update y position after table
    y = (doc as any).lastAutoTable?.finalY ?? y + 10;
    y += 5;
  }

  function renderContentBody(body: string) {
    if (!body.trim()) return;

    const segments = splitContentIntoSegments(body);

    for (const segment of segments) {
      if (segment.type === "table" && segment.table) {
        renderTable(segment.table);
      } else {
        // Render text content
        const cleaned = stripMarkdownFormatting(segment.content);
        const paragraphs = cleaned.split(/\n\n+/);

        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (!trimmed) continue;

          const lines = trimmed.split("\n");
          for (const line of lines) {
            const l = line.trim();
            if (!l) continue;

            const isBullet = l.startsWith("- ") || l.startsWith("* ");
            const isNumbered = /^\d+\.\s/.test(l);

            if (isBullet || isNumbered) {
              // Bullet/numbered list item
              const indent = marginLeft + 5;
              const width = contentWidth - 5;
              const clean = sanitizeText(l);
              doc.setFontSize(9);
              doc.setTextColor(...darkColor);
              doc.setFont("helvetica", "normal");
              const wrapped = doc.splitTextToSize(clean, width);
              for (const wl of wrapped) {
                checkNewPage(5);
                doc.text(wl, indent, y);
                y += 4.5;
              }
            } else {
              // Regular paragraph text
              const clean = sanitizeText(l);
              doc.setFontSize(9);
              doc.setTextColor(...darkColor);
              doc.setFont("helvetica", "normal");
              const wrapped = doc.splitTextToSize(clean, contentWidth);
              for (const wl of wrapped) {
                checkNewPage(5);
                doc.text(wl, marginLeft, y);
                y += 4.5;
              }
            }
          }
          y += 2; // paragraph spacing
        }
      }
    }
  }

  // ========================================================================
  //  PAGE 1: COVER PAGE
  // ========================================================================

  // Full-width orange header bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 48, "F");

  // Logo icon in header
  drawLogoIcon(doc, marginLeft, 8, 28, white);

  // Site name next to logo
  doc.setFontSize(18);
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.text("CalcoloMediazione", marginLeft + 32, 22);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Piattaforma professionale per la mediazione civile", marginLeft + 32, 30);
  doc.text("calcolomediazione.it", marginLeft + 32, 37);

  y = 62;

  // Report type badge
  doc.setFillColor(...warmBg);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  const badgeText = "RELAZIONE ANALISI AI";
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const badgeWidth = doc.getTextWidth(badgeText) + 10;
  doc.roundedRect(marginLeft, y, badgeWidth, 8, 1, 1, "FD");
  doc.setTextColor(...primaryColor);
  doc.text(badgeText, marginLeft + 5, y + 5.5);
  y += 16;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(sanitizeText(analisi.titolo), contentWidth);
  for (const line of titleLines) {
    doc.text(line, marginLeft, y);
    y += 10;
  }
  y += 6;

  // Thin orange separator
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1.5);
  doc.line(marginLeft, y, marginLeft + 40, y);
  y += 10;

  // Info box — structured metadata
  const infoBoxY = y;
  const infoBoxH = 50;
  doc.setFillColor(...warmBg);
  doc.setDrawColor(220, 215, 210);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, infoBoxY, contentWidth, infoBoxH, 2, 2, "FD");

  // Left column labels + values
  const col1X = marginLeft + 6;
  const col2X = pageWidth / 2 + 5;
  let infoY = infoBoxY + 9;

  // Label style helper
  const drawInfoLabel = (label: string, value: string, x: number, iy: number) => {
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), x, iy);
    doc.setFontSize(9.5);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(value), x, iy + 5);
  };

  drawInfoLabel("Data", dateStr, col1X, infoY);
  drawInfoLabel("Tipo Procedura", analisi.tipoAnalisi === "mediazione" ? "Mediazione Civile" : "Negoziazione Assistita", col2X, infoY);

  infoY += 16;
  if (analisi.valoreLite) {
    drawInfoLabel("Valore della Lite", `EUR ${Number(analisi.valoreLite).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`, col1X, infoY);
  } else {
    drawInfoLabel("Valore della Lite", "Indeterminato", col1X, infoY);
  }

  // Parti
  const parti = analisi.parti as Array<{ nome: string; ruolo: string }> | null;
  if (parti && parti.length > 0) {
    const partiStr = parti.map(p => `${sanitizeText(p.nome)} (${p.ruolo})`).join(", ");
    drawInfoLabel("Parti", partiStr.length > 60 ? partiStr.substring(0, 57) + "..." : partiStr, col2X, infoY);
  }

  infoY += 16;
  drawInfoLabel("Stato", analisi.stato === "completata" ? "Analisi Completata" : analisi.stato, col1X, infoY);
  drawInfoLabel("Generato da", "CalcoloMediazione AI (Gemini)", col2X, infoY);

  y = infoBoxY + infoBoxH + 12;

  // Description preview (if present)
  if (analisi.descrizione) {
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIZIONE DEL CASO", marginLeft, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...darkColor);
    const descClean = sanitizeText(analisi.descrizione);
    // Show max ~600 chars on the cover
    const descTrunc = descClean.length > 600 ? descClean.substring(0, 597) + "..." : descClean;
    const descLines = doc.splitTextToSize(descTrunc, contentWidth);
    for (const dl of descLines) {
      if (y > maxY - 30) break;
      doc.text(dl, marginLeft, y);
      y += 4.2;
    }
  }

  // Table of contents at bottom of cover page
  y = Math.max(y + 10, pageHeight - 95);
  doc.setFillColor(...sectionBg);
  doc.setDrawColor(230, 225, 220);
  doc.setLineWidth(0.2);
  const tocH = 78;
  doc.roundedRect(marginLeft, y, contentWidth, tocH, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("INDICE DELLA RELAZIONE", marginLeft + 6, y + 8);

  const tocItems = [
    "1. Estrazione Entita (NER)",
    "2. Analisi Giuridica",
    "3. Guida Strategica",
    "4. Analisi MAAN/BATNA",
    "5. Compatibilita Interessi",
    "6. Controllo Bias Cognitivi",
    "7. Bozza Accordo",
    "8. Analisi Economica Comparativa",
  ];

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  let tocY = y + 15;
  const tocCol1 = marginLeft + 8;
  const tocCol2 = marginLeft + contentWidth / 2 + 4;
  for (let i = 0; i < tocItems.length; i++) {
    const tx = i < 4 ? tocCol1 : tocCol2;
    const ty = tocY + (i < 4 ? i : i - 4) * 7;
    doc.text(tocItems[i], tx, ty);
    // Dot separator
    const dotXStart = tx + doc.getTextWidth(tocItems[i]) + 2;
    const dotXEnd = (i < 4 ? tocCol2 - 12 : marginLeft + contentWidth - 8);
    if (dotXEnd > dotXStart + 5) {
      doc.setTextColor(...lightGray);
      let dots = "";
      while (doc.getTextWidth(dots + " .") < (dotXEnd - dotXStart)) {
        dots += " .";
      }
      doc.text(dots, dotXStart, ty);
      doc.setTextColor(...darkColor);
    }
  }

  // Footer on cover page
  doc.setFontSize(7);
  doc.setTextColor(...lightGray);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Questo documento ha valore informativo e non sostituisce la consulenza legale professionale.",
    pageWidth / 2, pageHeight - 15,
    { align: "center" }
  );

  // ========================================================================
  //  CONTENT PAGES
  // ========================================================================

  const analysisSections: Array<{ title: string; content: string | null; icon: string }> = [
    { title: "1. Estrazione Entita (NER)", content: analisi.prospettoEconomico, icon: "NER" },
    { title: "2. Analisi Giuridica", content: analisi.analisiGiuridica, icon: "GIU" },
    { title: "3. Guida Strategica", content: analisi.guidaStrategica, icon: "STR" },
    { title: "4. Analisi MAAN/BATNA", content: analisi.analisiMaanBatna, icon: "MAA" },
    { title: "5. Compatibilita Interessi", content: analisi.compatibilitaInteressi, icon: "INT" },
    { title: "6. Controllo Bias Cognitivi", content: analisi.controlloBiasCognitivi, icon: "BIA" },
    { title: "7. Bozza Accordo", content: analisi.bozzaAccordo, icon: "ACC" },
    { title: "8. Analisi Economica Comparativa", content: analisi.analisiEconomica, icon: "ECO" },
  ];

  for (const section of analysisSections) {
    if (!section.content) continue;

    // Start each major section on a new page
    doc.addPage();
    y = 15;

    // Section header band
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 5, "F");

    y = 18;

    // Section icon badge
    doc.setFillColor(...primaryColor);
    doc.roundedRect(marginLeft, y - 3, 14, 8, 1, 1, "F");
    doc.setFontSize(6.5);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text(section.icon, marginLeft + 7, y + 2.5, { align: "center" });

    // Section title
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(section.title), marginLeft + 18, y + 2.5);
    y += 12;

    // Thin line under title
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.6);
    doc.line(marginLeft, y, marginLeft + contentWidth, y);
    y += 8;

    // Parse sub-sections from the content
    const subSections = extractStructuredSections(section.content);

    for (const sub of subSections) {
      if (sub.heading) {
        checkNewPage(14);

        const headClean = sanitizeText(sub.heading);
        if (sub.level <= 2) {
          // Major sub-heading with background
          doc.setFillColor(...sectionBg);
          doc.roundedRect(marginLeft, y - 3, contentWidth, 8, 1, 1, "F");
          doc.setFontSize(10);
          doc.setTextColor(...primaryColor);
          doc.setFont("helvetica", "bold");
          doc.text(headClean, marginLeft + 4, y + 2);
          y += 9;
        } else {
          // Minor sub-heading
          doc.setFontSize(9.5);
          doc.setTextColor(...darkColor);
          doc.setFont("helvetica", "bold");
          doc.text(headClean, marginLeft + 2, y);
          y += 6;
        }
      }

      if (sub.body) {
        renderContentBody(sub.body);
      }
      y += 2;
    }
  }

  // ========================================================================
  //  FINAL PAGE: DISCLAIMER & FOOTER
  // ========================================================================
  checkNewPage(50);
  y += 6;

  // Closing separator
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  y += 10;

  // Disclaimer box
  doc.setFillColor(...warmBg);
  doc.setDrawColor(220, 215, 210);
  doc.setLineWidth(0.3);
  const disclaimerH = 30;
  doc.roundedRect(marginLeft, y, contentWidth, disclaimerH, 2, 2, "FD");

  doc.setFontSize(7.5);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("AVVERTENZE", marginLeft + 5, y + 7);

  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "normal");
  const disclaimer1 = "Questo documento e stato generato automaticamente dalla piattaforma CalcoloMediazione con l'ausilio di intelligenza artificiale.";
  const disclaimer2 = "Le informazioni contenute hanno valore puramente informativo e orientativo. Non sostituiscono in alcun modo la consulenza legale professionale di un avvocato abilitato.";
  const disclaimer3 = `Generato il ${dateStr} | calcolomediazione.it`;

  const d1Lines = doc.splitTextToSize(disclaimer1, contentWidth - 10);
  let dY = y + 12;
  for (const dl of d1Lines) { doc.text(dl, marginLeft + 5, dY); dY += 3.5; }
  const d2Lines = doc.splitTextToSize(disclaimer2, contentWidth - 10);
  for (const dl of d2Lines) { doc.text(dl, marginLeft + 5, dY); dY += 3.5; }
  doc.setTextColor(...lightGray);
  doc.text(disclaimer3, marginLeft + 5, dY + 1);

  // ========================================================================
  //  PAGE HEADERS & FOOTERS ON ALL PAGES
  // ========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (i > 1) {
      // Page header (not on cover)
      doc.setFontSize(7);
      doc.setTextColor(...lightGray);
      doc.setFont("helvetica", "normal");
      doc.text("CalcoloMediazione", marginLeft, 10);
      doc.text("Relazione Analisi AI", pageWidth - marginRight, 10, { align: "right" });

      // Top orange line (already drawn by section headers on section pages, 
      // but add for pages that start mid-section)
    }

    // Footer line
    doc.setDrawColor(220, 215, 210);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, pageHeight - 16, pageWidth - marginRight, pageHeight - 16);

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.setFont("helvetica", "normal");

    if (i === 1) {
      // Cover footer - just page number
      doc.text(
        `Pagina ${i} di ${totalPages}`,
        pageWidth / 2, pageHeight - 10,
        { align: "center" }
      );
    } else {
      // Content page footer
      doc.text("calcolomediazione.it", marginLeft, pageHeight - 10);
      doc.text(
        `Pagina ${i} di ${totalPages}`,
        pageWidth / 2, pageHeight - 10,
        { align: "center" }
      );
      doc.text(dateStr, pageWidth - marginRight, pageHeight - 10, { align: "right" });
    }
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
