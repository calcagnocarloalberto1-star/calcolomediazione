import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Eye,
  User,
  UserCheck,
  Briefcase,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  TabStopPosition,
  TabStopType,
  SectionType,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

// ========================
// MATERIE DI MEDIAZIONE ex Art. 5 D.Lgs. 28/2010
// ========================
const MATERIE_MEDIAZIONE = [
  "Condominio",
  "Diritti reali",
  "Divisione",
  "Successioni ereditarie",
  "Patti di famiglia",
  "Locazione",
  "Comodato",
  "Affitto di aziende",
  "Risarcimento danni da responsabilità medica e sanitaria",
  "Risarcimento danni da diffamazione a mezzo stampa o altro mezzo di pubblicità",
  "Contratti assicurativi",
  "Contratti bancari",
  "Contratti finanziari",
  "Associazione in partecipazione",
  "Consorzio",
  "Franchising",
  "Opera",
  "Rete",
  "Somministrazione",
  "Società di persone",
  "Subfornitura",
  "Altra materia (volontaria / convenzionale)",
];

// ========================
// PROVINCE ITALIANE
// ========================
const PROVINCE = [
  "AG","AL","AN","AO","AP","AQ","AR","AT","AV","BA","BG","BI","BL","BN","BO",
  "BR","BS","BT","BZ","CA","CB","CE","CH","CL","CN","CO","CR","CS","CT","CZ",
  "EN","FC","FE","FG","FI","FM","FR","GE","GO","GR","IM","IS","KR","LC","LE",
  "LI","LO","LT","LU","MB","MC","ME","MI","MN","MO","MS","MT","NA","NO","NU",
  "OG","OR","OT","PA","PC","PD","PE","PG","PI","PN","PO","PR","PT","PU","PV",
  "PZ","RA","RC","RE","RG","RI","RM","RN","RO","SA","SI","SO","SP","SR","SS",
  "SU","SV","TA","TE","TN","TO","TP","TR","TS","TV","UD","VA","VB","VC","VE",
  "VI","VR","VT","VV"
];

// ========================
// INTERFACES
// ========================
interface DatiDelegante {
  nomeCognome: string;
  luogoNascita: string;
  dataNascita: string;
  indirizzo: string;
  comune: string;
  provincia: string;
  cap: string;
  codiceFiscale: string;
  partitaIva: string;
  numeroDocumento: string;
  enteRilascio: string;
  dataRilascio: string;
}

interface DatiDelegato {
  nomeCognome: string;
  luogoNascita: string;
  dataNascita: string;
  indirizzo: string;
  comune: string;
  provincia: string;
  cap: string;
  codiceFiscale: string;
  partitaIva: string;
  telefono: string;
  cellulare: string;
  email: string;
  pec: string;
  qualifica: string;
  nomeDifensoreCostituto: string;
}

interface DatiProcedimento {
  numeroProcedimento: string;
  organismoDiMediazione: string;
  materia: string;
}

const INITIAL_DELEGANTE: DatiDelegante = {
  nomeCognome: "",
  luogoNascita: "",
  dataNascita: "",
  indirizzo: "",
  comune: "",
  provincia: "",
  cap: "",
  codiceFiscale: "",
  partitaIva: "",
  numeroDocumento: "",
  enteRilascio: "",
  dataRilascio: "",
};

const INITIAL_DELEGATO: DatiDelegato = {
  nomeCognome: "",
  luogoNascita: "",
  dataNascita: "",
  indirizzo: "",
  comune: "",
  provincia: "",
  cap: "",
  codiceFiscale: "",
  partitaIva: "",
  telefono: "",
  cellulare: "",
  email: "",
  pec: "",
  qualifica: "avvocato_terzo",
  nomeDifensoreCostituto: "",
};

const INITIAL_PROCEDIMENTO: DatiProcedimento = {
  numeroProcedimento: "",
  organismoDiMediazione: "",
  materia: "",
};

// ========================
// GENERA TESTO PROCURA
// ========================
function generaTestoProcura(
  delegante: DatiDelegante,
  delegato: DatiDelegato,
  procedimento: DatiProcedimento
): string {
  const oggi = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const indirizzoDelegante = [
    delegante.indirizzo,
    delegante.comune,
    delegante.provincia ? `(${delegante.provincia})` : "",
    delegante.cap,
  ]
    .filter(Boolean)
    .join(", ");

  const indirizzoDelegato = [
    delegato.indirizzo,
    delegato.comune,
    delegato.provincia ? `(${delegato.provincia})` : "",
    delegato.cap,
  ]
    .filter(Boolean)
    .join(", ");

  const prefissoDelegato = delegato.qualifica === "terzo" ? "" : "l'Avv. ";
  const nomeDelegato = delegato.nomeCognome ? `${prefissoDelegato}${delegato.nomeCognome}` : `${prefissoDelegato}____________________`;
  const studioOResidenza = delegato.qualifica === "terzo" ? "residente in" : "con studio in";

  // Clausola Cass. 9608/2026
  const clausolaNonDifensore = delegato.nomeDifensoreCostituto
    ? `Il/La delegato/a dichiara di non essere il difensore costituito della parte delegante nel presente procedimento di mediazione. Il difensore della parte delegante nel presente procedimento è l'Avv. ${delegato.nomeDifensoreCostituto}, soggetto diverso dal delegato, in conformità al principio stabilito da Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026, secondo cui il difensore non può cumulare in sé i distinti ruoli di parte e di suo assistente.`
    : `Il/La delegato/a dichiara di non essere il difensore costituito della parte delegante nel presente procedimento di mediazione, in conformità al principio stabilito da Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026, secondo cui il difensore non può cumulare in sé i distinti ruoli di parte e di suo assistente.`;

  return `PROCURA SPECIALE PER LA PARTECIPAZIONE ALLA MEDIAZIONE
ai sensi dell'art. 8, commi 4 e 4-bis, D.Lgs. n. 28/2010

Il/La sottoscritto/a ${delegante.nomeCognome || "____________________"}${delegante.luogoNascita ? `, nato/a a ${delegante.luogoNascita}` : ""}${delegante.dataNascita ? ` il ${delegante.dataNascita}` : ""}${indirizzoDelegante ? `, residente in ${indirizzoDelegante}` : ""}${delegante.codiceFiscale ? `, C.F. ${delegante.codiceFiscale.toUpperCase()}` : ""}${delegante.partitaIva ? `, P.IVA ${delegante.partitaIva}` : ""}${delegante.numeroDocumento ? `, documento di identità n. ${delegante.numeroDocumento}` : ""}${delegante.enteRilascio ? ` rilasciato da ${delegante.enteRilascio}` : ""}${delegante.dataRilascio ? ` in data ${delegante.dataRilascio}` : ""},

DELEGA

${nomeDelegato}${delegato.luogoNascita ? `, nato/a a ${delegato.luogoNascita}` : ""}${delegato.dataNascita ? ` il ${delegato.dataNascita}` : ""}${indirizzoDelegato ? `, ${studioOResidenza} ${indirizzoDelegato}` : ""}${delegato.codiceFiscale ? `, C.F. ${delegato.codiceFiscale.toUpperCase()}` : ""}${delegato.partitaIva ? `, P.IVA ${delegato.partitaIva}` : ""}${delegato.telefono ? `, Tel. ${delegato.telefono}` : ""}${delegato.cellulare ? `, Cell. ${delegato.cellulare}` : ""}${delegato.email ? `, Email: ${delegato.email}` : ""}${delegato.pec ? `, PEC: ${delegato.pec}` : ""},

a rappresentarlo/a e partecipare, in sua vece e per suo conto, al procedimento di mediazione n. ${procedimento.numeroProcedimento || "______"}${procedimento.organismoDiMediazione ? ` presso ${procedimento.organismoDiMediazione}` : ""}${procedimento.materia ? `, in materia di ${procedimento.materia}` : ""}, con ogni più ampio potere, nessuno escluso, ivi compreso il potere di:

— partecipare a tutti gli incontri di mediazione, sia in presenza che in modalità telematica o da remoto con collegamento audiovisivo;
— chiedere rinvii della mediazione;
— chiedere la mediazione in modalità telematica o in modalità da remoto;
— formulare proposte, controproposte e dichiarazioni;
— prendere visione di documenti e informazioni;
— accettare o rifiutare proposte del mediatore;
— chiedere ed accettare la proposta del mediatore;
— sottoscrivere il verbale di mediazione e l'eventuale accordo;
— firmare il verbale in luogo del rappresentante sia in presenza, sia in modalità telematica e da remoto;
— firmare per la prosecuzione dell'incontro (passaggio dal primo al secondo incontro);
— sottoscrivere l'eventuale accordo di conciliazione, conferendogli altresì il potere di disporre dei diritti sostanziali oggetto della controversia;
— chiedere la CTM (consulenza tecnica in mediazione) ed accettare o meno che la stessa sia producibile in giudizio;
— chiedere la partecipazione del consulente di parte in caso di richiesta di CTM;
— chiedere l'eventuale sostituzione del mediatore;
— chiamare terzi in mediazione che siano rilevanti per una eventuale intesa;
— rinunciare alla mediazione;
— compiere ogni atto utile e necessario ai fini del buon esito della procedura di mediazione.

La presente procura è conferita ai sensi e per gli effetti dell'art. 8, commi 4 e 4-bis, del D.Lgs. n. 28/2010, come modificato dal D.Lgs. n. 149/2022 (Riforma Cartabia).

Si dichiara che la presente procura è conferita a titolo speciale e che il/la delegato/a è a conoscenza dei fatti oggetto della controversia.

${clausolaNonDifensore}

Luogo e data: ______________________, ${oggi}

Firma del delegante: ____________________________

${delegante.nomeCognome || "(Nome e Cognome del Delegante)"}


Per accettazione

${nomeDelegato} firma per accettazione della procura conferita dal/la sig./sig.ra ${delegante.nomeCognome || "____________________"}, previamente identificato/a a mezzo del documento di identità sopra indicato.

Firma ${delegato.qualifica === "terzo" ? "del delegato" : "dell'Avvocato"} per accettazione: ____________________________
${delegato.nomeCognome || `(Nome e Cognome del ${delegato.qualifica === "terzo" ? "Delegato" : "Avvocato"})`}`;
}

// ========================
// GENERA WORD
// ========================
async function generaDocx(
  delegante: DatiDelegante,
  delegato: DatiDelegato,
  procedimento: DatiProcedimento
) {
  const oggi = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const indirizzoDelegante = [
    delegante.indirizzo,
    delegante.comune,
    delegante.provincia ? `(${delegante.provincia})` : "",
    delegante.cap,
  ].filter(Boolean).join(", ");

  const indirizzoDelegato = [
    delegato.indirizzo,
    delegato.comune,
    delegato.provincia ? `(${delegato.provincia})` : "",
    delegato.cap,
  ].filter(Boolean).join(", ");

  const prefissoDelegato = delegato.qualifica === "terzo" ? "" : "l'Avv. ";
  const nomeDelegato = delegato.nomeCognome ? `${prefissoDelegato}${delegato.nomeCognome}` : `${prefissoDelegato}____________________`;
  const studioOResidenza = delegato.qualifica === "terzo" ? "residente in" : "con studio in";

  let deleganteText = `Il/La sottoscritto/a ${delegante.nomeCognome || "____________________"}`;
  if (delegante.luogoNascita) deleganteText += `, nato/a a ${delegante.luogoNascita}`;
  if (delegante.dataNascita) deleganteText += ` il ${delegante.dataNascita}`;
  if (indirizzoDelegante) deleganteText += `, residente in ${indirizzoDelegante}`;
  if (delegante.codiceFiscale) deleganteText += `, C.F. ${delegante.codiceFiscale.toUpperCase()}`;
  if (delegante.partitaIva) deleganteText += `, P.IVA ${delegante.partitaIva}`;
  if (delegante.numeroDocumento) deleganteText += `, documento di identità n. ${delegante.numeroDocumento}`;
  if (delegante.enteRilascio) deleganteText += ` rilasciato da ${delegante.enteRilascio}`;
  if (delegante.dataRilascio) deleganteText += ` in data ${delegante.dataRilascio}`;
  deleganteText += ",";

  let delegatoText = `${nomeDelegato}`;
  if (delegato.luogoNascita) delegatoText += `, nato/a a ${delegato.luogoNascita}`;
  if (delegato.dataNascita) delegatoText += ` il ${delegato.dataNascita}`;
  if (indirizzoDelegato) delegatoText += `, ${studioOResidenza} ${indirizzoDelegato}`;
  if (delegato.codiceFiscale) delegatoText += `, C.F. ${delegato.codiceFiscale.toUpperCase()}`;
  if (delegato.partitaIva) delegatoText += `, P.IVA ${delegato.partitaIva}`;
  if (delegato.telefono) delegatoText += `, Tel. ${delegato.telefono}`;
  if (delegato.cellulare) delegatoText += `, Cell. ${delegato.cellulare}`;
  if (delegato.email) delegatoText += `, Email: ${delegato.email}`;
  if (delegato.pec) delegatoText += `, PEC: ${delegato.pec}`;
  delegatoText += ",";

  const clausolaNonDifensore = delegato.nomeDifensoreCostituto
    ? `Il/La delegato/a dichiara di non essere il difensore costituito della parte delegante nel presente procedimento di mediazione. Il difensore della parte delegante nel presente procedimento e' l'Avv. ${delegato.nomeDifensoreCostituto}, soggetto diverso dal delegato, in conformita' al principio stabilito da Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026.`
    : `Il/La delegato/a dichiara di non essere il difensore costituito della parte delegante nel presente procedimento di mediazione, in conformita' al principio stabilito da Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026, secondo cui il difensore non puo' cumulare in se' i distinti ruoli di parte e di suo assistente.`;

  const poteri = [
    "partecipare a tutti gli incontri di mediazione, sia in presenza che in modalita' telematica o da remoto con collegamento audiovisivo;",
    "chiedere rinvii della mediazione;",
    "chiedere la mediazione in modalita' telematica o in modalita' da remoto;",
    "formulare proposte, controproposte e dichiarazioni;",
    "prendere visione di documenti e informazioni;",
    "accettare o rifiutare proposte del mediatore;",
    "chiedere ed accettare la proposta del mediatore;",
    "sottoscrivere il verbale di mediazione e l'eventuale accordo;",
    "firmare il verbale in luogo del rappresentante sia in presenza, sia in modalita' telematica e da remoto;",
    "firmare per la prosecuzione dell'incontro (passaggio dal primo al secondo incontro);",
    "sottoscrivere l'eventuale accordo di conciliazione, conferendogli altresi' il potere di disporre dei diritti sostanziali oggetto della controversia;",
    "chiedere la CTM (consulenza tecnica in mediazione) ed accettare o meno che la stessa sia producibile in giudizio;",
    "chiedere la partecipazione del consulente di parte in caso di richiesta di CTM;",
    "chiedere l'eventuale sostituzione del mediatore;",
    "chiamare terzi in mediazione che siano rilevanti per una eventuale intesa;",
    "rinunciare alla mediazione;",
    "compiere ogni atto utile e necessario ai fini del buon esito della procedura di mediazione.",
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun({ text: "PROCURA SPECIALE PER LA PARTECIPAZIONE ALLA MEDIAZIONE", bold: true, size: 28, font: "Times New Roman" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: "ai sensi dell'art. 8, commi 4 e 4-bis, D.Lgs. n. 28/2010", italics: true, size: 22, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: deleganteText, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 },
            children: [new TextRun({ text: "DELEGA", bold: true, size: 28, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: delegatoText, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: `a rappresentarlo/a e partecipare, in sua vece e per suo conto, al procedimento di mediazione n. ${procedimento.numeroProcedimento || "______"}${procedimento.organismoDiMediazione ? ` presso ${procedimento.organismoDiMediazione}` : ""}${procedimento.materia ? `, in materia di ${procedimento.materia}` : ""}, con ogni piu' ampio potere, nessuno escluso, ivi compreso il potere di:`, size: 24, font: "Times New Roman" })],
          }),
          ...poteri.map((potere) =>
            new Paragraph({
              spacing: { after: 80 },
              indent: { left: 567 },
              children: [new TextRun({ text: `\u2014 ${potere}`, size: 24, font: "Times New Roman" })],
            })
          ),
          new Paragraph({
            spacing: { before: 300, after: 200 },
            children: [new TextRun({ text: "La presente procura e' conferita ai sensi e per gli effetti dell'art. 8, commi 4 e 4-bis, del D.Lgs. n. 28/2010, come modificato dal D.Lgs. n. 149/2022 (Riforma Cartabia).", size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: "Si dichiara che la presente procura e' conferita a titolo speciale e che il/la delegato/a e' a conoscenza dei fatti oggetto della controversia.", size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [new TextRun({ text: clausolaNonDifensore, size: 24, font: "Times New Roman", bold: true })],
          }),
          new Paragraph({
            spacing: { before: 400, after: 400 },
            children: [new TextRun({ text: `Luogo e data: ______________________, ${oggi}`, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: "Firma del delegante: ____________________________", size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 400 },
            children: [new TextRun({ text: delegante.nomeCognome || "(Nome e Cognome del Delegante)", size: 24, font: "Times New Roman", italics: !delegante.nomeCognome })],
          }),
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [new TextRun({ text: "Per accettazione", bold: true, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [new TextRun({ text: `${nomeDelegato} firma per accettazione della procura conferita dal/la sig./sig.ra ${delegante.nomeCognome || "____________________"}, previamente identificato/a a mezzo del documento di identita' sopra indicato.`, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: `Firma ${delegato.qualifica === "terzo" ? "del delegato" : "dell'Avvocato"} per accettazione: ____________________________`, size: 24, font: "Times New Roman" })],
          }),
          new Paragraph({
            children: [new TextRun({ text: delegato.nomeCognome || `(Nome e Cognome del ${delegato.qualifica === "terzo" ? "Delegato" : "Avvocato"})`, size: 24, font: "Times New Roman", italics: !delegato.nomeCognome })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Procura_Mediazione_${procedimento.numeroProcedimento || "bozza"}.docx`);
}

// ========================
// GENERA PDF
// ========================
function generaPdf(
  delegante: DatiDelegante,
  delegato: DatiDelegato,
  procedimento: DatiProcedimento
) {
  const testo = generaTestoProcura(delegante, delegato, procedimento);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const marginLeft = 20;
  const marginRight = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginLeft - marginRight;
  let y = 25;
  const lines = testo.split("\n");

  for (const line of lines) {
    if (!line.trim()) {
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
      continue;
    }
    if (line.startsWith("PROCURA SPECIALE") || line === "DELEGA") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(line === "DELEGA" ? 14 : 13);
      const splitLines = doc.splitTextToSize(line, maxWidth);
      for (const sl of splitLines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(sl, pageWidth / 2, y, { align: "center" });
        y += 7;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      continue;
    }
    if (line.startsWith("ai sensi dell")) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      const splitLines = doc.splitTextToSize(line, maxWidth);
      for (const sl of splitLines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(sl, pageWidth / 2, y, { align: "center" });
        y += 6;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      y += 4;
      continue;
    }
    if (line.startsWith("Per accettazione")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, marginLeft, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      continue;
    }
    if (line.startsWith("Il/La delegato/a dichiara")) {
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(10);
      const splitLines = doc.splitTextToSize(line, maxWidth);
      for (const sl of splitLines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(sl, marginLeft, y);
        y += 5.5;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      continue;
    }
    if (line.startsWith("\u2014") || line.startsWith("- ")) {
      doc.setFontSize(11);
      const splitLines = doc.splitTextToSize(line, maxWidth - 5);
      for (let i = 0; i < splitLines.length; i++) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(splitLines[i], marginLeft + (i === 0 ? 0 : 4), y);
        y += 5.5;
      }
      continue;
    }
    doc.setFontSize(11);
    const splitLines = doc.splitTextToSize(line, maxWidth);
    for (const sl of splitLines) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(sl, marginLeft, y);
      y += 5.5;
    }
  }

  doc.save(`Procura_Mediazione_${procedimento.numeroProcedimento || "bozza"}.pdf`);
}

// ========================
// FORM FIELD COMPONENT
// ========================
function FormField({
  label, value, onChange, placeholder, required, type = "text", className = "", testId,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; type?: string; className?: string; testId: string;
}) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-2 border-foreground/20 focus:border-primary h-10 text-sm"
        data-testid={testId}
      />
    </div>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function GeneratoreProcura() {
  const { toast } = useToast();
  const [delegante, setDelegante] = useState<DatiDelegante>(INITIAL_DELEGANTE);
  const [delegato, setDelegato] = useState<DatiDelegato>(INITIAL_DELEGATO);
  const [procedimento, setProcedimento] = useState<DatiProcedimento>(INITIAL_PROCEDIMENTO);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateDelegante = (field: keyof DatiDelegante, value: string) =>
    setDelegante((prev) => ({ ...prev, [field]: value }));
  const updateDelegato = (field: keyof DatiDelegato, value: string) =>
    setDelegato((prev) => ({ ...prev, [field]: value }));
  const updateProcedimento = (field: keyof DatiProcedimento, value: string) =>
    setProcedimento((prev) => ({ ...prev, [field]: value }));

  const isValid = delegante.nomeCognome.trim() && delegato.nomeCognome.trim() && procedimento.numeroProcedimento.trim();

  const handleGeneraDocx = async () => {
    if (!isValid) {
      toast({ title: "Campi obbligatori", description: "Compila almeno Nome delegante, Nome delegato e Numero procedimento.", variant: "destructive" });
      return;
    }
    try {
      await generaDocx(delegante, delegato, procedimento);
      toast({ title: "Documento generato", description: "Il file Word (.docx) è stato scaricato." });
    } catch (err) {
      toast({ title: "Errore", description: "Impossibile generare il documento Word.", variant: "destructive" });
    }
  };

  const handleGeneraPdf = () => {
    if (!isValid) {
      toast({ title: "Campi obbligatori", description: "Compila almeno Nome delegante, Nome delegato e Numero procedimento.", variant: "destructive" });
      return;
    }
    try {
      generaPdf(delegante, delegato, procedimento);
      toast({ title: "PDF generato", description: "Il file PDF è stato scaricato." });
    } catch (err) {
      toast({ title: "Errore", description: "Impossibile generare il PDF.", variant: "destructive" });
    }
  };

  const handleAnteprima = () => {
    if (!isValid) {
      toast({ title: "Campi obbligatori", description: "Compila almeno Nome delegante, Nome delegato e Numero procedimento.", variant: "destructive" });
      return;
    }
    setShowPreview(true);
    setTimeout(() => { previewRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
  };

  const handleReset = () => {
    setDelegante(INITIAL_DELEGANTE);
    setDelegato(INITIAL_DELEGATO);
    setProcedimento(INITIAL_PROCEDIMENTO);
    setShowPreview(false);
    toast({ title: "Form resettato", description: "Tutti i campi sono stati cancellati." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b-[3px] border-foreground bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Generatore Procura
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Art. 8, commi 4 e 4-bis, D.Lgs. n. 28/2010</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Genera automaticamente la procura speciale per la partecipazione alla mediazione.
            Compila i dati e scarica il documento in formato Word (.docx) o PDF, conforme al modello
            previsto dalla normativa vigente e alla giurisprudenza più recente.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Avviso FONDAMENTALE Cass. 9608/2026 */}
        <div className="flex items-start gap-3 bg-red-50 border-2 border-red-400 p-4">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-900">
            <p className="font-semibold mb-1">ATTENZIONE — Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026</p>
            <p className="mb-2">
              La Cassazione ha stabilito che <strong>il difensore costituito non può cumulare in sé i ruoli di parte e di assistente</strong>.
              La presenza del solo avvocato che assiste la parte nel procedimento, anche se munito di procura sostanziale,
              <strong> non soddisfa la condizione di procedibilità</strong>.
            </p>
            <p>
              La procura sostanziale può essere conferita esclusivamente a:
            </p>
            <ul className="mt-1 ml-4 space-y-0.5 list-disc">
              <li><strong>Un terzo</strong> (familiare, collaboratore, fiduciario — chiunque non sia l&apos;avvocato difensore)</li>
              <li><strong>Un avvocato diverso</strong> dal difensore costituito nel procedimento di mediazione</li>
            </ul>
          </div>
        </div>

        {/* Avviso normativo generale */}
        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-300 p-4">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Riferimento normativo</p>
            <p>
              La procura speciale per la partecipazione alla mediazione deve essere conferita
              ai sensi dell&apos;art. 8, commi 4 e 4-bis, D.Lgs. 28/2010. La procura non richiede
              autenticazione notarile (Cass. 14676/2025), salvo che l&apos;accordo riguardi atti soggetti
              a trascrizione ex art. 2643 c.c. I campi contrassegnati con * sono obbligatori.
            </p>
          </div>
        </div>

        {/* SEZIONE 1: DATI DELEGANTE */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center border-2 border-foreground">
                <User className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dati Delegante
              </h2>
              <span className="text-xs text-muted-foreground ml-2">(chi conferisce la procura)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nome e Cognome" value={delegante.nomeCognome} onChange={(v) => updateDelegante("nomeCognome", v)} required className="sm:col-span-2" testId="input-delegante-nome" />
              <FormField label="Luogo di Nascita" value={delegante.luogoNascita} onChange={(v) => updateDelegante("luogoNascita", v)} testId="input-delegante-luogo-nascita" />
              <FormField label="Data di Nascita" value={delegante.dataNascita} onChange={(v) => updateDelegante("dataNascita", v)} type="date" testId="input-delegante-data-nascita" />
              <FormField label="Residenza (Via/Piazza)" value={delegante.indirizzo} onChange={(v) => updateDelegante("indirizzo", v)} className="sm:col-span-2" testId="input-delegante-indirizzo" />
              <FormField label="Comune" value={delegante.comune} onChange={(v) => updateDelegante("comune", v)} testId="input-delegante-comune" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Prov.</Label>
                  <Select value={delegante.provincia} onValueChange={(v) => updateDelegante("provincia", v)}>
                    <SelectTrigger className="border-2 border-foreground/20 h-10" data-testid="select-delegante-provincia">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCE.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <FormField label="CAP" value={delegante.cap} onChange={(v) => updateDelegante("cap", v)} testId="input-delegante-cap" />
              </div>
              <FormField label="Codice Fiscale" value={delegante.codiceFiscale} onChange={(v) => updateDelegante("codiceFiscale", v.toUpperCase())} testId="input-delegante-cf" />
              <FormField label="P.IVA (opzionale)" value={delegante.partitaIva} onChange={(v) => updateDelegante("partitaIva", v)} testId="input-delegante-piva" />
              <Separator className="sm:col-span-2 my-2" />
              <FormField label="Numero Documento" value={delegante.numeroDocumento} onChange={(v) => updateDelegante("numeroDocumento", v)} testId="input-delegante-num-doc" />
              <FormField label="Ente Rilascio" value={delegante.enteRilascio} onChange={(v) => updateDelegante("enteRilascio", v)} placeholder="es. Comune di Genova" testId="input-delegante-ente" />
              <FormField label="Data Rilascio" value={delegante.dataRilascio} onChange={(v) => updateDelegante("dataRilascio", v)} type="date" testId="input-delegante-data-rilascio" />
            </div>
          </CardContent>
        </Card>

        {/* SEZIONE 2: DATI DELEGATO */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center border-2 border-foreground">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dati Delegato
              </h2>
              <span className="text-xs text-muted-foreground ml-2">(terzo o avvocato non difensore)</span>
            </div>

            {/* Avviso inline nel form */}
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-5 text-xs text-red-800">
              <strong>Cass. 9608/2026:</strong> il delegato NON può essere l&apos;avvocato che assiste la parte nel presente procedimento di mediazione.
              Può essere un terzo o un avvocato diverso dal difensore costituito.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Qualifica delegato */}
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Qualifica del Delegato <span className="text-destructive">*</span>
                </Label>
                <Select value={delegato.qualifica} onValueChange={(v) => updateDelegato("qualifica", v)}>
                  <SelectTrigger className="border-2 border-foreground/20 h-10" data-testid="select-delegato-qualifica">
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avvocato_terzo">Avvocato (NON il difensore nel presente procedimento)</SelectItem>
                    <SelectItem value="terzo">Terzo non avvocato (familiare, collaboratore, fiduciario)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nome difensore costituto (per la clausola Cass. 9608/2026) */}
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Nome del difensore costituito nel procedimento (opzionale — per clausola Cass. 9608/2026)
                </Label>
                <Input
                  type="text"
                  value={delegato.nomeDifensoreCostituto}
                  onChange={(e) => updateDelegato("nomeDifensoreCostituto", e.target.value)}
                  placeholder="es. Avv. Mario Rossi (il difensore, DIVERSO dal delegato)"
                  className="border-2 border-foreground/20 focus:border-primary h-10 text-sm"
                  data-testid="input-delegato-difensore"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Se compilato, la procura conterrà la dichiarazione esplicita che il delegato è soggetto diverso dal difensore indicato.
                </p>
              </div>

              <FormField label="Nome e Cognome" value={delegato.nomeCognome} onChange={(v) => updateDelegato("nomeCognome", v)} required className="sm:col-span-2" testId="input-delegato-nome" />
              <FormField label="Luogo di Nascita" value={delegato.luogoNascita} onChange={(v) => updateDelegato("luogoNascita", v)} testId="input-delegato-luogo-nascita" />
              <FormField label="Data di Nascita" value={delegato.dataNascita} onChange={(v) => updateDelegato("dataNascita", v)} type="date" testId="input-delegato-data-nascita" />
              <FormField label={delegato.qualifica === "terzo" ? "Residenza (Via/Piazza)" : "Studio (Via/Piazza)"} value={delegato.indirizzo} onChange={(v) => updateDelegato("indirizzo", v)} className="sm:col-span-2" testId="input-delegato-indirizzo" />
              <FormField label="Comune" value={delegato.comune} onChange={(v) => updateDelegato("comune", v)} testId="input-delegato-comune" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Prov.</Label>
                  <Select value={delegato.provincia} onValueChange={(v) => updateDelegato("provincia", v)}>
                    <SelectTrigger className="border-2 border-foreground/20 h-10" data-testid="select-delegato-provincia">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCE.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <FormField label="CAP" value={delegato.cap} onChange={(v) => updateDelegato("cap", v)} testId="input-delegato-cap" />
              </div>
              <FormField label="Codice Fiscale" value={delegato.codiceFiscale} onChange={(v) => updateDelegato("codiceFiscale", v.toUpperCase())} testId="input-delegato-cf" />
              <FormField label="P.IVA" value={delegato.partitaIva} onChange={(v) => updateDelegato("partitaIva", v)} testId="input-delegato-piva" />
              <Separator className="sm:col-span-2 my-2" />
              <FormField label="Telefono" value={delegato.telefono} onChange={(v) => updateDelegato("telefono", v)} type="tel" testId="input-delegato-telefono" />
              <FormField label="Cellulare" value={delegato.cellulare} onChange={(v) => updateDelegato("cellulare", v)} type="tel" testId="input-delegato-cellulare" />
              <FormField label="Email" value={delegato.email} onChange={(v) => updateDelegato("email", v)} type="email" testId="input-delegato-email" />
              <FormField label="PEC" value={delegato.pec} onChange={(v) => updateDelegato("pec", v)} type="email" testId="input-delegato-pec" />
            </div>
          </CardContent>
        </Card>

        {/* SEZIONE 3: DATI PROCEDIMENTO */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center border-2 border-foreground">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dati Procedimento</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Numero Procedimento" value={procedimento.numeroProcedimento} onChange={(v) => updateProcedimento("numeroProcedimento", v)} required testId="input-num-procedimento" />
              <FormField label="Organismo di Mediazione" value={procedimento.organismoDiMediazione} onChange={(v) => updateProcedimento("organismoDiMediazione", v)} placeholder="es. Camera di Mediazione di Genova" testId="input-organismo" />
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Materia della Mediazione</Label>
                <Select value={procedimento.materia} onValueChange={(v) => updateProcedimento("materia", v)}>
                  <SelectTrigger className="border-2 border-foreground/20 h-10" data-testid="select-materia">
                    <SelectValue placeholder="Seleziona la materia..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIE_MEDIAZIONE.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAnteprima} variant="outline"
            className="flex-1 h-12 border-2 border-foreground font-semibold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            data-testid="button-anteprima">
            <Eye className="w-4 h-4 mr-2" />Anteprima Procura
          </Button>
          <Button onClick={handleGeneraDocx}
            className="flex-1 h-12 bg-primary text-primary-foreground border-2 border-foreground font-semibold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            data-testid="button-genera-docx">
            <Download className="w-4 h-4 mr-2" />Genera Word (.docx)
          </Button>
          <Button onClick={handleGeneraPdf}
            className="flex-1 h-12 bg-foreground text-background border-2 border-foreground font-semibold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            data-testid="button-genera-pdf">
            <FileText className="w-4 h-4 mr-2" />Genera PDF
          </Button>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors" data-testid="button-reset">
            Cancella tutti i campi
          </button>
        </div>

        {/* PREVIEW */}
        {showPreview && (
          <div ref={previewRef}>
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Anteprima Documento</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="text-muted-foreground" data-testid="button-chiudi-anteprima">Chiudi</Button>
                </div>
                <Separator className="mb-6" />
                <div className="prose prose-sm max-w-none font-serif whitespace-pre-wrap leading-relaxed text-foreground/90" style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}>
                  {generaTestoProcura(delegante, delegato, procedimento)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground pb-8 space-y-1">
          <p>Documento generato automaticamente da CalcoloMediazione.</p>
          <p>La procura è conforme all&apos;art. 8, commi 4 e 4-bis, D.Lgs. n. 28/2010 (Riforma Cartabia, D.Lgs. 149/2022).</p>
          <p>Aggiornata a Cass. civ., Sez. III, ord. n. 9608/2026: il delegato deve essere soggetto diverso dal difensore costituito nel procedimento.</p>
          <p>Procura non notarile conforme a Cass. 14676/2025 (salvo atti soggetti a trascrizione ex art. 2643 c.c.).</p>
          <p>Il presente strumento non sostituisce la consulenza legale professionale.</p>
        </div>
      </div>
    </div>
  );
}
