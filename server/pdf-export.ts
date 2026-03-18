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


export function generateAnalisiPdf(analisi: AnalisiCaso): Buffer {
  ensureAutoTable();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const marginBottom = 25;
  const maxY = pageHeight - marginBottom;

  let y = 25;

  // Colors
  const primaryColor: [number, number, number] = [197, 90, 43];
  const darkColor: [number, number, number] = [35, 35, 35];
  const grayColor: [number, number, number] = [120, 120, 120];
  const lightBg: [number, number, number] = [245, 242, 237];
  const tableHeaderBg: [number, number, number] = [240, 235, 228];
  const tableAltBg: [number, number, number] = [250, 248, 245];

  function checkNewPage(neededSpace: number = 15) {
    if (y + neededSpace > maxY) {
      doc.addPage();
      y = 25;
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

    // Calculate column widths based on content
    const colCount = sanitizedHeaders.length;
    const availWidth = contentWidth;

    (doc as any).autoTable({
      startY: y,
      head: [sanitizedHeaders],
      body: sanitizedRows,
      margin: { left: marginLeft, right: marginRight },
      tableWidth: availWidth,
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [180, 170, 160],
        lineWidth: 0.3,
        textColor: darkColor,
        font: "helvetica",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: tableHeaderBg,
        textColor: darkColor,
        fontStyle: "bold",
        fontSize: 8,
        lineWidth: 0.5,
        lineColor: [150, 140, 130],
      },
      alternateRowStyles: {
        fillColor: tableAltBg,
      },
      columnStyles: colCount <= 3 ? {} : undefined,
      didDrawPage: () => {
        // Reset y after page break within table
      },
    });

    // Update y position after table
    y = (doc as any).lastAutoTable?.finalY ?? y + 10;
    y += 4;
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
              // Check for bold patterns (text between **)
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

  // ========== COVER / HEADER ==========
  // Orange top bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 4, "F");

  y = 28;
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("CALCOLOMEDIAZIONE - ANALISI AI", marginLeft, y);
  y += 12;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(sanitizeText(analisi.titolo), contentWidth);
  for (const line of titleLines) {
    doc.text(line, marginLeft, y);
    y += 9;
  }
  y += 4;

  // Meta info box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.6);
  const boxHeight = 20;
  doc.rect(marginLeft, y, contentWidth, boxHeight, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "normal");
  const now = new Date();
  const dateStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`Data: ${dateStr}`, marginLeft + 4, y + 6);
  doc.text(`Tipo: ${analisi.tipoAnalisi === "mediazione" ? "Mediazione" : "Negoziazione Assistita"}`, marginLeft + 4, y + 12);
  if (analisi.valoreLite) {
    doc.text(`Valore lite: EUR ${Number(analisi.valoreLite).toLocaleString("it-IT")}`, marginLeft + 4, y + 18);
  }

  // Parti on right side
  const parti = analisi.parti as Array<{ nome: string; ruolo: string }> | null;
  if (parti && parti.length > 0) {
    const partiStr = parti.map(p => `${sanitizeText(p.nome)} (${p.ruolo})`).join(", ");
    const partiLines = doc.splitTextToSize(`Parti: ${partiStr}`, contentWidth / 2 - 5);
    let partiY = y + 6;
    for (const line of partiLines) {
      doc.text(line, pageWidth / 2 + 5, partiY);
      partiY += 4.5;
    }
  }

  y += boxHeight + 8;

  // Divider line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1.2);
  doc.line(marginLeft, y, marginLeft + 35, y);
  y += 10;

  // ========== CONTENT SECTIONS ==========
  const analysisSections: Array<{ title: string; content: string | null }> = [
    { title: "1. Estrazione Entita (NER)", content: analisi.prospettoEconomico },
    { title: "2. Analisi Giuridica", content: analisi.analisiGiuridica },
    { title: "3. Guida Strategica", content: analisi.guidaStrategica },
    { title: "4. Analisi MAAN/BATNA", content: analisi.analisiMaanBatna },
    { title: "5. Compatibilita Interessi", content: analisi.compatibilitaInteressi },
    { title: "6. Controllo Bias Cognitivi", content: analisi.controlloBiasCognitivi },
    { title: "7. Bozza Accordo", content: analisi.bozzaAccordo },
    { title: "8. Analisi Economica Comparativa", content: analisi.analisiEconomica },
  ];

  for (const section of analysisSections) {
    if (!section.content) continue;

    // Section title with accent bar
    checkNewPage(20);
    doc.setFillColor(...primaryColor);
    doc.rect(marginLeft, y - 1, 3, 7, "F");
    doc.setFontSize(12);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, marginLeft + 7, y + 4);
    y += 12;

    // Parse sub-sections from the content
    const subSections = extractStructuredSections(section.content);

    for (const sub of subSections) {
      if (sub.heading) {
        checkNewPage(12);

        const headClean = sanitizeText(sub.heading);
        if (sub.level <= 2) {
          // Major sub-heading
          doc.setFontSize(10);
          doc.setTextColor(...primaryColor);
          doc.setFont("helvetica", "bold");
          doc.text(headClean, marginLeft + 2, y);
          y += 6;
        } else {
          // Minor sub-heading
          doc.setFontSize(9.5);
          doc.setTextColor(...darkColor);
          doc.setFont("helvetica", "bold");
          doc.text(headClean, marginLeft + 2, y);
          y += 5.5;
        }
      }

      if (sub.body) {
        renderContentBody(sub.body);
      }
      y += 1.5;
    }

    y += 5; // Section spacing
  }

  // ========== FINAL FOOTER ==========
  checkNewPage(25);
  y += 4;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  y += 8;

  doc.setFontSize(7.5);
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Documento generato automaticamente da CalcoloMediazione - Analisi AI",
    marginLeft, y
  );
  y += 4;
  doc.text(
    `Data generazione: ${dateStr} | calcolomediazione.com`,
    marginLeft, y
  );
  y += 4;
  doc.text(
    "Questo documento ha valore informativo e non sostituisce la consulenza legale professionale.",
    marginLeft, y
  );

  // ========== PAGE FOOTERS ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.4);
    doc.line(marginLeft, pageHeight - 17, pageWidth - marginRight, pageHeight - 17);
    doc.setFontSize(7.5);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text(
      `CalcoloMediazione | Analisi AI | Pagina ${i} di ${totalPages}`,
      pageWidth / 2,
      pageHeight - 12,
      { align: "center" }
    );
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
