/**
 * Disclaimer legale uniforme per tutti i motori di calcolo
 * (Calcolatore, Confronto Costi, Costi Notarili, Credito d'Imposta).
 *
 * Variante "compact" per i risultati appena calcolati, variante "full" per il
 * footer della pagina con riferimenti normativi estesi.
 */

import { Scale, Info } from "lucide-react";

interface DisclaimerLegaleProps {
  /** "compact" mostra solo la nota essenziale, "full" include i riferimenti normativi. */
  variant?: "compact" | "full";
  /** Riferimenti normativi specifici della pagina (es. ["D.M. 150/2023", "D.Lgs. 28/2010"]). */
  riferimenti?: string[];
  /** Testo aggiuntivo specifico del motore (es. note metodologiche). */
  noteSpecifiche?: string;
  className?: string;
}

export function DisclaimerLegale({
  variant = "compact",
  riferimenti = ["D.M. 150/2023", "D.Lgs. 28/2010", "art. 17 D.Lgs. 28/2010"],
  noteSpecifiche,
  className = "",
}: DisclaimerLegaleProps) {
  if (variant === "compact") {
    return (
      <div
        className={`mt-4 text-xs text-muted-foreground bg-muted/40 p-3 border border-foreground/10 rounded-sm ${className}`}
        data-testid="disclaimer-legale-compact"
      >
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Avvertenza:</strong> i valori prodotti hanno finalità esclusivamente
            informativa e orientativa. Non costituiscono consulenza legale né preventivo
            vincolante. Verifica sempre con il professionista incaricato.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mt-8 text-xs text-muted-foreground bg-muted/50 p-4 border border-foreground/10 ${className}`}
      data-testid="disclaimer-legale-full"
    >
      <div className="flex items-start gap-2">
        <Scale className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-semibold mb-1">Criteri di calcolo e avvertenza legale</p>

          {noteSpecifiche && <p>{noteSpecifiche}</p>}

          <p>
            <strong>Compensi avvocato:</strong> i compensi legali sono determinati sui{" "}
            <strong>valori medi</strong> del D.M. 55/2014 (aggiornato dal D.M. 147/2022),
            sommando le fasi applicabili. Il compenso effettivo può variare
            sensibilmente (indicativamente -50% / +100%) in base a complessità, numero
            delle parti, urgenza, pregio dell'opera e risultati conseguiti
            (art. 4 D.M. 55/2014).
          </p>

          <p>
            <strong>Indennità di mediazione:</strong> calcolate secondo il D.M. 150/2023
            — Tabella A per il regime nazionale, regolamento COA Genova quando attivo.
            Le agevolazioni fiscali ex art. 17 D.Lgs. 28/2010 sono applicate
            automaticamente al ricorrere dei presupposti.
          </p>

          <p>
            <strong>Avvertenza:</strong> tutti i calcoli forniti da questa piattaforma
            hanno finalità esclusivamente informativa e orientativa. Non costituiscono
            in alcun modo consulenza legale, preventivo vincolante né parere
            professionale. Per una valutazione precisa e personalizzata si raccomanda di
            consultare un avvocato o un professionista abilitato.
          </p>

          {riferimenti.length > 0 && (
            <div className="pt-2 mt-2 border-t border-foreground/10">
              <span className="font-semibold">Riferimenti normativi: </span>
              <span>{riferimenti.join(" · ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
