/**
 * Componente riutilizzabile per i bottoni "Scarica PDF" / "Scarica Word".
 * I motori di calcolo passano una funzione `buildReport()` che genera la
 * struttura `ReportData` solo al momento del click (lazy), in modo da
 * lavorare sempre sui risultati più recenti.
 */

import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  exportToPdf,
  exportToDocx,
  type ReportData,
} from "@/lib/export-risultati";

interface ExportButtonsProps {
  /** Factory che costruisce il report ai dati correnti (richiamata al click). */
  buildReport: () => ReportData;
  /** Etichetta breve per il tipo di report (es. "calcolo"). Default: "risultato". */
  label?: string;
  /** Classe CSS opzionale per il wrapper. */
  className?: string;
  /** Posizione dei bottoni — default "horizontal" (affiancati). */
  variant?: "horizontal" | "vertical";
  /** Identificatore stabile per i test (es. "calcolatore"). */
  testIdPrefix?: string;
}

export function ExportButtons({
  buildReport,
  label = "risultato",
  className = "",
  variant = "horizontal",
  testIdPrefix = "export",
}: ExportButtonsProps) {
  const { toast } = useToast();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);

  const handlePdf = () => {
    try {
      setLoadingPdf(true);
      const data = buildReport();
      exportToPdf(data);
      toast({
        title: "PDF scaricato",
        description: `Il ${label} è stato esportato in formato PDF.`,
      });
    } catch (err) {
      console.error("Errore export PDF:", err);
      toast({
        title: "Errore export PDF",
        description: "Impossibile generare il PDF. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDocx = async () => {
    try {
      setLoadingDocx(true);
      const data = buildReport();
      await exportToDocx(data);
      toast({
        title: "Word scaricato",
        description: `Il ${label} è stato esportato in formato Word (.docx).`,
      });
    } catch (err) {
      console.error("Errore export Word:", err);
      toast({
        title: "Errore export Word",
        description: "Impossibile generare il file Word. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoadingDocx(false);
    }
  };

  const wrapperClass =
    variant === "vertical"
      ? `flex flex-col gap-2 ${className}`
      : `flex flex-wrap gap-2 ${className}`;

  return (
    <div className={wrapperClass} data-testid={`${testIdPrefix}-buttons`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handlePdf}
        disabled={loadingPdf}
        className="border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
        data-testid={`${testIdPrefix}-pdf`}
      >
        <FileDown className="w-4 h-4 mr-2" />
        {loadingPdf ? "Generazione..." : "Scarica PDF"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDocx}
        disabled={loadingDocx}
        className="border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
        data-testid={`${testIdPrefix}-docx`}
      >
        <Download className="w-4 h-4 mr-2" />
        {loadingDocx ? "Generazione..." : "Scarica Word"}
      </Button>
    </div>
  );
}
