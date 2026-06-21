/**
 * Modulo riutilizzabile per export PDF/Word dei risultati dei "motori" del sito:
 * - Calcolatore indennità (D.M. 150/2023)
 * - Confronto Costi (mediazione vs causa vs arbitrato)
 * - Costi Notarili
 * - Credito d'Imposta
 *
 * I motori passano una struttura comune `ReportData` con titolo, sottotitolo,
 * sezioni (ciascuna con tabelle a 2 colonne label/valore) e note. Le due
 * funzioni `exportToPdf` e `exportToDocx` producono file scaricabili.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

// ─── TIPI ─────────────────────────────────────────────────────────────────

export interface ReportRow {
  label: string;
  value: string;
  /** Se true, riga in grassetto (es. totali) */
  bold?: boolean;
}

export interface ReportSection {
  title: string;
  /** Tabella label/valore. Se omessa, sezione di solo testo. */
  rows?: ReportRow[];
  /** Paragrafi di testo (es. note, descrizioni) */
  paragraphs?: string[];
}

export interface ReportData {
  /** Titolo principale (es. "Calcolo Indennità di Mediazione") */
  title: string;
  /** Sottotitolo (es. "Valore lite €50.000 — Mediazione obbligatoria") */
  subtitle?: string;
  /** Sezioni del report */
  sections: ReportSection[];
  /** Note finali / disclaimer */
  footerNotes?: string[];
  /** Nome del file (senza estensione) */
  fileName: string;
}

// ─── UTILITY ──────────────────────────────────────────────────────────────

function formatDate(): string {
  return new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const FOOTER_TEXT =
  "Documento generato automaticamente da CalcoloMediazione.it — strumento di stima conforme al D.M. 150/2023. " +
  "I valori prodotti hanno finalità informativa e non sostituiscono parere professionale.";

// ─── EXPORT PDF ───────────────────────────────────────────────────────────

export function exportToPdf(data: ReportData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Header — titolo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(data.title, pageWidth - margin * 2);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 7;

  // Sottotitolo
  if (data.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const subLines = doc.splitTextToSize(data.subtitle, pageWidth - margin * 2);
    doc.text(subLines, pageWidth / 2, y, { align: "center" });
    y += subLines.length * 5 + 2;
  }

  // Data
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generato il ${formatDate()}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0);
  y += 8;

  // Sezioni
  for (const section of data.sections) {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    // Titolo sezione
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.title, margin, y);
    y += 2;
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Paragrafi prima della tabella
    if (section.paragraphs && section.paragraphs.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const p of section.paragraphs) {
        const lines = doc.splitTextToSize(p, pageWidth - margin * 2);
        if (y + lines.length * 5 > 280) {
          doc.addPage();
          y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      }
    }

    // Tabella label/valore
    if (section.rows && section.rows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [["Voce", "Importo"]],
        body: section.rows.map((r) => [r.label, r.value]),
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 2.5,
        },
        headStyles: {
          fillColor: [30, 30, 30],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: (pageWidth - margin * 2) * 0.65 },
          1: {
            cellWidth: (pageWidth - margin * 2) * 0.35,
            halign: "right",
            font: "courier",
          },
        },
        didParseCell: (hookData) => {
          const idx = hookData.row.index;
          if (
            hookData.section === "body" &&
            section.rows &&
            section.rows[idx]?.bold
          ) {
            hookData.cell.styles.fontStyle = "bold";
            hookData.cell.styles.fillColor = [240, 240, 240];
          }
        },
        margin: { left: margin, right: margin },
      });
      // @ts-expect-error - lastAutoTable is added by jspdf-autotable
      y = (doc.lastAutoTable?.finalY ?? y) + 6;
    }
  }

  // Footer notes
  if (data.footerNotes && data.footerNotes.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(80);
    for (const note of data.footerNotes) {
      const lines = doc.splitTextToSize(note, pageWidth - margin * 2);
      if (y + lines.length * 4 > 285) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * 4 + 2;
    }
    doc.setTextColor(0);
  }

  // Footer fisso ultima pagina
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(120);
    const footerLines = doc.splitTextToSize(FOOTER_TEXT, pageWidth - margin * 2);
    doc.text(footerLines, pageWidth / 2, 290, { align: "center" });
    doc.text(`Pag. ${i} / ${totalPages}`, pageWidth - margin, 290, { align: "right" });
    doc.setTextColor(0);
  }

  doc.save(`${data.fileName}.pdf`);
}

// ─── EXPORT DOCX ──────────────────────────────────────────────────────────

function makeDocxTableRow(
  label: string,
  value: string,
  bold = false,
  isHeader = false
): TableRow {
  const border = {
    top: { style: BorderStyle.SINGLE, size: 4, color: "888888" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "888888" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "888888" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "888888" },
  };
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        borders: border,
        shading: isHeader
          ? { fill: "1E1E1E" }
          : bold
            ? { fill: "F0F0F0" }
            : undefined,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: bold || isHeader,
                color: isHeader ? "FFFFFF" : "000000",
                size: 20,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        borders: border,
        shading: isHeader
          ? { fill: "1E1E1E" }
          : bold
            ? { fill: "F0F0F0" }
            : undefined,
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: value,
                bold: bold || isHeader,
                color: isHeader ? "FFFFFF" : "000000",
                font: "Courier New",
                size: 20,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export async function exportToDocx(data: ReportData): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Titolo
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: data.title, bold: true, size: 32 })],
    })
  );

  if (data.subtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: data.subtitle, size: 22 })],
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Generato il ${formatDate()}`,
          italics: true,
          size: 18,
          color: "666666",
        }),
      ],
    })
  );

  // Sezioni
  for (const section of data.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ text: section.title, bold: true, size: 26 })],
      })
    );

    if (section.paragraphs) {
      for (const p of section.paragraphs) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: p, size: 22 })],
          })
        );
      }
    }

    if (section.rows && section.rows.length > 0) {
      const rows: TableRow[] = [
        makeDocxTableRow("Voce", "Importo", false, true),
        ...section.rows.map((r) =>
          makeDocxTableRow(r.label, r.value, r.bold ?? false, false)
        ),
      ];
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows,
        })
      );
      // Spaziatura dopo la tabella
      children.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    }
  }

  // Note finali
  if (data.footerNotes && data.footerNotes.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: "Note", bold: true, size: 22 })],
      })
    );
    for (const note of data.footerNotes) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: note, italics: true, size: 20, color: "555555" }),
          ],
        })
      );
    }
  }

  // Footer disclaimer
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: FOOTER_TEXT,
          italics: true,
          size: 16,
          color: "888888",
        }),
      ],
    })
  );

  const doc = new Document({
    creator: "CalcoloMediazione.it",
    title: data.title,
    description: "Report generato automaticamente",
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.fileName}.docx`);
}
