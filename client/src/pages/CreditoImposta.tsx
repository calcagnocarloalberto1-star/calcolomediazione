import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  AlertTriangle,
  Calculator,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  Info,
  Euro,
  Scale,
  ChevronDown,
  ChevronUp,
  Gavel,
  Users,
  Shield,
} from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";
import type { ReportData } from "@/lib/export-risultati";

// Calcolo logica credito d'imposta
interface InputCredito {
  tipoMediazione: "obbligatoria" | "demandata" | "volontaria";
  esito: "accordo" | "mancato_accordo";
  indennitaVersata: number;
  compensoAvvocato: number;
  contributoUnificato: number;
  tipoSoggetto: "persona_fisica" | "persona_giuridica";
  altriCreditiAnno: number;
  gratuitoPatrocinio: boolean;
}

interface RisultatoCredito {
  creditoIndennita: number;
  creditoAvvocato: number;
  creditoContributoUnificato: number;
  totalePerProcedura: number;
  tettoPerProcedura: number;
  tettoAnnuale: number;
  creditoEffettivo: number;
  note: string[];
}

function calcolaCreditoImposta(input: InputCredito): RisultatoCredito {
  const note: string[] = [];
  const maxAccordo = 600;
  const maxMancatoAccordo = 300;
  const maxContributoUnificato = 518;
  const tettoPerProcedura = 600;
  const tettoAnnuale = input.tipoSoggetto === "persona_fisica" ? 2400 : 24000;

  const isAccordo = input.esito === "accordo";
  const tettoIndennita = isAccordo ? maxAccordo : maxMancatoAccordo;
  const tettoAvvocato = isAccordo ? maxAccordo : maxMancatoAccordo;

  // a) Credito indennità organismo
  let creditoIndennita = 0;
  if (input.gratuitoPatrocinio) {
    creditoIndennita = 0;
    note.push("Parte ammessa al gratuito patrocinio: indennità non dovuta, nessun credito su questa voce.");
  } else {
    creditoIndennita = Math.min(input.indennitaVersata, tettoIndennita);
    if (input.indennitaVersata > tettoIndennita) {
      note.push(`Indennità versata (€${input.indennitaVersata.toLocaleString("it-IT")}) superiore al tetto di €${tettoIndennita}: credito limitato a €${tettoIndennita}.`);
    }
  }

  // b) Credito compenso avvocato (solo mediazione obbligatoria/demandata)
  let creditoAvvocato = 0;
  if (input.tipoMediazione === "obbligatoria" || input.tipoMediazione === "demandata") {
    if (input.gratuitoPatrocinio) {
      creditoAvvocato = 0;
      note.push("Parte in gratuito patrocinio: compenso avvocato a carico dello Stato, nessun credito su questa voce.");
    } else {
      creditoAvvocato = Math.min(input.compensoAvvocato, tettoAvvocato);
      if (input.compensoAvvocato > 0) {
        note.push(`Credito avvocato riconosciuto per mediazione ${input.tipoMediazione === "obbligatoria" ? "obbligatoria (art. 5, co. 1)" : "demandata dal giudice (art. 5-quater)"}.`);
      }
    }
  } else {
    if (input.compensoAvvocato > 0) {
      note.push("Mediazione volontaria: il credito d'imposta sul compenso avvocato non è previsto (solo per obbligatoria e demandata).");
    }
  }

  // c) Credito contributo unificato (solo mediazione demandata con accordo)
  let creditoContributoUnificato = 0;
  if (input.tipoMediazione === "demandata" && isAccordo && input.contributoUnificato > 0) {
    creditoContributoUnificato = Math.min(input.contributoUnificato, maxContributoUnificato);
    note.push("Mediazione demandata con accordo: credito riconosciuto sul contributo unificato versato per il giudizio estinto.");
  } else if (input.tipoMediazione !== "demandata" && input.contributoUnificato > 0) {
    note.push("Il credito sul contributo unificato è riconosciuto solo per mediazione demandata dal giudice con accordo.");
  } else if (input.tipoMediazione === "demandata" && !isAccordo && input.contributoUnificato > 0) {
    note.push("Mediazione demandata senza accordo: il credito sul contributo unificato non è riconosciuto.");
  }

  // Tetto per procedura: max €600 per i crediti a) e b) combinati
  const sommaCreditiAB = creditoIndennita + creditoAvvocato;
  let creditoABEffettivo = Math.min(sommaCreditiAB, tettoPerProcedura);
  if (sommaCreditiAB > tettoPerProcedura) {
    const proporzioneIndennita = creditoIndennita / sommaCreditiAB;
    creditoIndennita = Math.round(creditoABEffettivo * proporzioneIndennita * 100) / 100;
    creditoAvvocato = creditoABEffettivo - creditoIndennita;
    note.push(`La somma dei crediti indennità + avvocato supera il tetto di €${tettoPerProcedura} per procedura: importo ridotto proporzionalmente.`);
  }

  // Il contributo unificato è aggiuntivo (art. 20, co. 3)
  const totalePerProcedura = creditoIndennita + creditoAvvocato + creditoContributoUnificato;

  // Tetto annuale
  const disponibileAnnuale = tettoAnnuale - input.altriCreditiAnno;
  const creditoEffettivo = Math.min(totalePerProcedura, Math.max(disponibileAnnuale, 0));
  if (creditoEffettivo < totalePerProcedura && disponibileAnnuale < totalePerProcedura) {
    note.push(`Tetto annuale di €${tettoAnnuale.toLocaleString("it-IT")} quasi raggiunto: credito effettivo ridotto a €${creditoEffettivo.toLocaleString("it-IT")}.`);
  }

  if (!isAccordo) {
    note.push("In caso di mancato accordo i crediti sono ridotti della metà (art. 20, co. 2, D.Lgs. 28/2010).");
  }

  return {
    creditoIndennita,
    creditoAvvocato,
    creditoContributoUnificato,
    totalePerProcedura,
    tettoPerProcedura,
    tettoAnnuale,
    creditoEffettivo,
    note,
  };
}

function formatEuro(n: number): string {
  return "€ " + n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calcolo giorni mancanti alla scadenza
function giorniAllaScadenza(): number {
  const scadenza = new Date(2026, 2, 31); // 31 marzo 2026
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  scadenza.setHours(0, 0, 0, 0);
  return Math.ceil((scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
}

// --- BUILDER REPORT EXPORT ---
function buildReportCreditoImposta(
  r: RisultatoCredito,
  input: InputCredito,
  fmt: (n: number) => string
): ReportData {
  const tipoMedLabel = input.tipoMediazione === "obbligatoria" ? "Mediazione obbligatoria"
    : input.tipoMediazione === "demandata" ? "Mediazione demandata dal giudice" : "Mediazione volontaria";
  const esitoLabel = input.esito === "accordo" ? "Accordo raggiunto" : "Mancato accordo";
  const soggettoLabel = input.tipoSoggetto === "persona_fisica" ? "Persona fisica" : "Persona giuridica";

  const parametri = [
    { label: "Tipo di mediazione", value: tipoMedLabel },
    { label: "Esito", value: esitoLabel },
    { label: "Soggetto", value: soggettoLabel },
    { label: "Indennita versata", value: fmt(input.indennitaVersata) },
    { label: "Compenso avvocato", value: fmt(input.compensoAvvocato) },
    { label: "Contributo unificato versato", value: fmt(input.contributoUnificato) },
    { label: "Altri crediti gia maturati nell'anno", value: fmt(input.altriCreditiAnno) },
    { label: "Gratuito patrocinio", value: input.gratuitoPatrocinio ? "Si" : "No" },
  ];

  const dettaglioRows: { label: string; value: string; bold?: boolean }[] = [
    { label: "Credito su indennita organismo (lett. a)", value: fmt(r.creditoIndennita) },
    { label: "Credito su compenso avvocato (lett. b)", value: fmt(r.creditoAvvocato) },
  ];
  if (input.tipoMediazione === "demandata") {
    dettaglioRows.push({ label: "Credito su contributo unificato (lett. c)", value: fmt(r.creditoContributoUnificato) });
  }
  dettaglioRows.push(
    { label: "Tetto per singola procedura (lett. a + b)", value: fmt(r.tettoPerProcedura) },
    { label: `Tetto annuale (${soggettoLabel})`, value: fmt(r.tettoAnnuale) },
    { label: "Totale teorico per procedura", value: fmt(r.totalePerProcedura), bold: true },
    { label: "Credito d'imposta spettante (effettivo)", value: fmt(r.creditoEffettivo), bold: true },
  );

  const sections: ReportData["sections"] = [
    { title: "Parametri del calcolo", rows: parametri },
    { title: "Calcolo del credito d'imposta", rows: dettaglioRows },
  ];

  const footerNotes = r.note.length > 0 ? r.note : ["Calcolo basato su art. 20 D.Lgs. 28/2010 e D.M. 1° agosto 2023."];

  return {
    title: "Calcolo Credito d'Imposta in Mediazione",
    subtitle: `${tipoMedLabel} - ${esitoLabel} - ${soggettoLabel}`,
    sections,
    footerNotes,
    fileName: `credito-imposta-mediazione-${Date.now()}`,
  };
}

export default function CreditoImposta() {
  const [tipoMediazione, setTipoMediazione] = useState<"obbligatoria" | "demandata" | "volontaria">("obbligatoria");
  const [esito, setEsito] = useState<"accordo" | "mancato_accordo">("accordo");
  const [indennitaVersata, setIndennitaVersata] = useState("400");
  const [compensoAvvocato, setCompensoAvvocato] = useState("500");
  const [contributoUnificato, setContributoUnificato] = useState("0");
  const [tipoSoggetto, setTipoSoggetto] = useState<"persona_fisica" | "persona_giuridica">("persona_fisica");
  const [altriCreditiAnno, setAltriCreditiAnno] = useState("0");
  const [gratuitoPatrocinio, setGratuitoPatrocinio] = useState(false);
  const [risultato, setRisultato] = useState<RisultatoCredito | null>(null);
  const [showGuida, setShowGuida] = useState(false);

  const giorniRimasti = useMemo(() => giorniAllaScadenza(), []);
  const scadenzaPassata = giorniRimasti < 0;
  const urgente = giorniRimasti >= 0 && giorniRimasti <= 12;

  const handleCalcola = () => {
    const input: InputCredito = {
      tipoMediazione,
      esito,
      indennitaVersata: parseFloat(indennitaVersata) || 0,
      compensoAvvocato: parseFloat(compensoAvvocato) || 0,
      contributoUnificato: parseFloat(contributoUnificato) || 0,
      tipoSoggetto,
      altriCreditiAnno: parseFloat(altriCreditiAnno) || 0,
      gratuitoPatrocinio,
    };
    setRisultato(calcolaCreditoImposta(input));
  };

  const handleReset = () => {
    setTipoMediazione("obbligatoria");
    setEsito("accordo");
    setIndennitaVersata("400");
    setCompensoAvvocato("500");
    setContributoUnificato("0");
    setTipoSoggetto("persona_fisica");
    setAltriCreditiAnno("0");
    setGratuitoPatrocinio(false);
    setRisultato(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              data-testid="text-page-title"
            >
              Credito d'Imposta Mediazione
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Calcola il credito d'imposta spettante per le spese di mediazione civile e commerciale
            ai sensi dell'art. 20, D.Lgs. 28/2010 e del D.M. 1° agosto 2023.
          </p>
        </div>

        {/* SCADENZA BANNER */}
        <Card
          className={`mb-6 border-2 ${
            scadenzaPassata
              ? "border-muted bg-muted/30"
              : urgente
                ? "border-red-600 bg-red-50 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
                : "border-amber-600 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]"
          }`}
          data-testid="card-scadenza"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center border-2 shrink-0 ${
                scadenzaPassata ? "border-muted-foreground bg-muted" : urgente ? "border-red-700 bg-red-600" : "border-amber-700 bg-amber-500"
              }`}>
                {scadenzaPassata ? (
                  <Clock className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                {scadenzaPassata ? (
                  <>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Scadenza superata
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Il termine per presentare la domanda di credito d'imposta per le mediazioni concluse nel 2025 era il 31 marzo 2026.
                      Per le mediazioni concluse nel 2026, il termine sarà il 31 marzo 2027.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className={`text-lg font-bold mb-1 ${urgente ? "text-red-800" : "text-amber-900"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Scadenza: 31 marzo 2026 — {giorniRimasti === 0 ? "Ultimo giorno" : `${giorniRimasti} giorni rimasti`}
                    </h3>
                    <p className={`text-sm ${urgente ? "text-red-700" : "text-amber-800"}`}>
                      La domanda per il credito d'imposta relativo alle mediazioni concluse entro il 31 dicembre 2025
                      deve essere presentata entro il <strong>31 marzo 2026</strong>, a pena di inammissibilità,
                      tramite la piattaforma del Ministero della Giustizia.
                    </p>
                    <a
                      href="https://lsg.giustizia.it/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 mt-2 text-sm font-semibold underline ${urgente ? "text-red-800" : "text-amber-900"}`}
                    >
                      Accedi alla piattaforma ministeriale
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
              {!scadenzaPassata && (
                <div className={`text-center px-4 py-2 border-2 shrink-0 ${
                  urgente ? "border-red-700 bg-red-100" : "border-amber-700 bg-amber-100"
                }`}>
                  <div className={`text-3xl font-bold font-mono ${urgente ? "text-red-700" : "text-amber-700"}`}>
                    {giorniRimasti}
                  </div>
                  <div className={`text-xs uppercase font-bold tracking-wider ${urgente ? "text-red-600" : "text-amber-600"}`}>
                    {giorniRimasti === 1 ? "giorno" : "giorni"}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-form">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Calculator className="w-5 h-5 text-primary" />
                  Calcola il Tuo Credito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Tipo mediazione */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tipo di mediazione</Label>
                  <Select value={tipoMediazione} onValueChange={(v) => setTipoMediazione(v as typeof tipoMediazione)}>
                    <SelectTrigger className="border-2 border-foreground" data-testid="select-tipo-mediazione">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="obbligatoria">Obbligatoria (art. 5, co. 1)</SelectItem>
                      <SelectItem value="demandata">Demandata dal giudice (art. 5-quater)</SelectItem>
                      <SelectItem value="volontaria">Volontaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Esito */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Esito della mediazione</Label>
                  <Select value={esito} onValueChange={(v) => setEsito(v as typeof esito)}>
                    <SelectTrigger className="border-2 border-foreground" data-testid="select-esito">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accordo">Accordo raggiunto</SelectItem>
                      <SelectItem value="mancato_accordo">Mancato accordo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo soggetto */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tipo di soggetto</Label>
                  <Select value={tipoSoggetto} onValueChange={(v) => setTipoSoggetto(v as typeof tipoSoggetto)}>
                    <SelectTrigger className="border-2 border-foreground" data-testid="select-tipo-soggetto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persona_fisica">Persona fisica (tetto annuo €2.400)</SelectItem>
                      <SelectItem value="persona_giuridica">Persona giuridica (tetto annuo €24.000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="border-foreground/10" />

                {/* Importi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Indennità versata all'organismo (€)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={indennitaVersata}
                      onChange={(e) => setIndennitaVersata(e.target.value)}
                      className="border-2 border-foreground font-mono"
                      data-testid="input-indennita"
                    />
                    <p className="text-xs text-muted-foreground">
                      Importo per la propria quota (art. 17, co. 3-4)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Compenso avvocato in mediazione (€)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={compensoAvvocato}
                      onChange={(e) => setCompensoAvvocato(e.target.value)}
                      className="border-2 border-foreground font-mono"
                      disabled={tipoMediazione === "volontaria"}
                      data-testid="input-avvocato"
                    />
                    <p className="text-xs text-muted-foreground">
                      {tipoMediazione === "volontaria"
                        ? "Non previsto per mediazione volontaria"
                        : "Nei limiti dei parametri forensi (D.M. 55/2014)"}
                    </p>
                  </div>
                </div>

                {tipoMediazione === "demandata" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Contributo unificato versato (€)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={contributoUnificato}
                      onChange={(e) => setContributoUnificato(e.target.value)}
                      className="border-2 border-foreground font-mono"
                      data-testid="input-contributo-unificato"
                    />
                    <p className="text-xs text-muted-foreground">
                      Solo se la mediazione demandata si è conclusa con accordo e il giudizio è stato estinto (max €518)
                    </p>
                  </div>
                )}

                <Separator className="border-foreground/10" />

                {/* Gratuito patrocinio */}
                <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-foreground/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-semibold cursor-pointer" htmlFor="gp-toggle">
                      Gratuito patrocinio
                    </Label>
                  </div>
                  <Switch
                    id="gp-toggle"
                    checked={gratuitoPatrocinio}
                    onCheckedChange={setGratuitoPatrocinio}
                    data-testid="switch-gratuito-patrocinio"
                  />
                </div>

                {/* Altri crediti anno */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Altri crediti d'imposta già utilizzati nell'anno (€)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={altriCreditiAnno}
                    onChange={(e) => setAltriCreditiAnno(e.target.value)}
                    className="border-2 border-foreground font-mono"
                    data-testid="input-altri-crediti"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se hai già richiesto crediti per altre mediazioni nello stesso anno
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCalcola}
                    className="flex-1 bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 h-12 text-base font-bold"
                    data-testid="button-calcola"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calcola Credito
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-2 border-foreground h-12"
                    data-testid="button-reset"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* RISULTATO */}
            {risultato && (
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-risultato">
                <CardHeader className="pb-4 bg-primary/5 border-b-2 border-foreground">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <Euro className="w-5 h-5 text-primary" />
                      Risultato Calcolo
                    </CardTitle>
                    <ExportButtons
                      label="calcolo credito"
                      testIdPrefix="export-credito"
                      buildReport={() => buildReportCreditoImposta(risultato, {
                        tipoMediazione,
                        esito,
                        indennitaVersata: parseFloat(indennitaVersata) || 0,
                        compensoAvvocato: parseFloat(compensoAvvocato) || 0,
                        contributoUnificato: parseFloat(contributoUnificato) || 0,
                        tipoSoggetto,
                        altriCreditiAnno: parseFloat(altriCreditiAnno) || 0,
                        gratuitoPatrocinio,
                      }, formatEuro)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Totale */}
                  <div className="p-6 border-b-2 border-foreground bg-primary/5">
                    <div className="text-center">
                      <p className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-1">
                        Credito d'Imposta Spettante
                      </p>
                      <p
                        className="text-4xl sm:text-5xl font-bold text-primary font-mono"
                        data-testid="text-credito-totale"
                      >
                        {formatEuro(risultato.creditoEffettivo)}
                      </p>
                      {risultato.creditoEffettivo < risultato.totalePerProcedura && (
                        <p className="text-xs text-muted-foreground mt-1">
                          (ridotto da {formatEuro(risultato.totalePerProcedura)} per tetto annuale)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dettaglio voci */}
                  <div className="divide-y-2 divide-foreground/10">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Credito su indennità organismo</span>
                      </div>
                      <span className="font-mono font-bold" data-testid="text-credito-indennita">
                        {formatEuro(risultato.creditoIndennita)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Credito su compenso avvocato</span>
                      </div>
                      <span className="font-mono font-bold" data-testid="text-credito-avvocato">
                        {formatEuro(risultato.creditoAvvocato)}
                      </span>
                    </div>
                    {(tipoMediazione === "demandata") && (
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          <Gavel className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Credito su contributo unificato</span>
                        </div>
                        <span className="font-mono font-bold" data-testid="text-credito-cu">
                          {formatEuro(risultato.creditoContributoUnificato)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-muted/30">
                      <span className="text-sm font-semibold">Tetto per procedura (lett. a + b)</span>
                      <span className="font-mono text-sm">{formatEuro(risultato.tettoPerProcedura)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30">
                      <span className="text-sm font-semibold">Tetto annuale ({tipoSoggetto === "persona_fisica" ? "p. fisica" : "p. giuridica"})</span>
                      <span className="font-mono text-sm">{formatEuro(risultato.tettoAnnuale)}</span>
                    </div>
                  </div>

                  {/* Note */}
                  {risultato.note.length > 0 && (
                    <div className="p-4 bg-amber-50 border-t-2 border-foreground">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Note e avvertenze
                      </p>
                      <ul className="space-y-1">
                        {risultato.note.map((nota, i) => (
                          <li key={i} className="text-xs text-amber-900 flex items-start gap-1">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>{nota}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modalità utilizzo */}
                  <div className="p-4 border-t-2 border-foreground bg-muted/20">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Come utilizzare il credito
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Il credito è utilizzabile esclusivamente in compensazione tramite <strong>modello F24</strong>,
                      da presentare attraverso i servizi telematici dell'Agenzia delle Entrate, a partire dalla
                      comunicazione ministeriale (entro il 30 aprile). Non è previsto rimborso diretto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: Info sidebar */}
          <div className="space-y-6">
            {/* Tabella riepilogo crediti */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-riepilogo">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <FileText className="w-4 h-4 text-primary" />
                  Importi Massimi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-foreground/10">
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Indennità organismo</span>
                      <Badge variant="secondary" className="text-xs font-mono border border-foreground/20">€ 600</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Con accordo (€300 senza)</p>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Compenso avvocato</span>
                      <Badge variant="secondary" className="text-xs font-mono border border-foreground/20">€ 600</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Solo obbligatoria/demandata (€300 senza accordo)</p>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Contributo unificato</span>
                      <Badge variant="secondary" className="text-xs font-mono border border-foreground/20">€ 518</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Solo demandata con accordo ed estinzione giudizio</p>
                  </div>
                  <div className="p-3 bg-primary/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Tetto per procedura (a+b)</span>
                      <Badge className="text-xs font-mono bg-primary text-primary-foreground">€ 600</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Crediti a) e b) cumulabili fino a €600</p>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Tetto annuo — persona fisica</span>
                      <Badge variant="outline" className="text-xs font-mono border-foreground">€ 2.400</Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold">Tetto annuo — persona giuridica</span>
                      <Badge variant="outline" className="text-xs font-mono border-foreground">€ 24.000</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guida procedura */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-procedura">
              <CardHeader className="pb-3">
                <button
                  onClick={() => setShowGuida(!showGuida)}
                  className="flex items-center justify-between w-full"
                >
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Come Presentare la Domanda
                  </CardTitle>
                  {showGuida ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </CardHeader>
              {showGuida && (
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Accedi alla piattaforma ministeriale con SPID, CIE o CNS", link: "https://lsg.giustizia.it/" },
                      { step: "2", text: "Seleziona \"Istanza credito di imposta\" nell'applicativo" },
                      { step: "3", text: "Compila i dati: n. organismo, n. procedimento, data accordo, valore, materia" },
                      { step: "4", text: "Indica il tuo indirizzo PEC per le comunicazioni" },
                      { step: "5", text: "Invia la domanda entro il 31 marzo dell'anno successivo alla conclusione" },
                      { step: "6", text: "Attendi la comunicazione del Ministero (entro il 30 aprile)" },
                      { step: "7", text: "Utilizza il credito in compensazione con modello F24 telematico" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 border border-foreground">
                          {item.step}
                        </div>
                        <div>
                          <p className="text-xs">{item.text}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1 mt-0.5">
                              lsg.giustizia.it <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Normativa */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-normativa">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Scale className="w-4 h-4 text-primary" />
                  Riferimenti Normativi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28~art20!vig=" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline flex items-center gap-1">
                  Art. 20, D.Lgs. 28/2010 <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://www.gazzettaufficiale.it/eli/id/2023/08/07/23A04557/sg" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline flex items-center gap-1">
                  D.M. 1° agosto 2023 (attuazione) <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://lsg.giustizia.it/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline flex items-center gap-1">
                  Piattaforma ministeriale <ExternalLink className="w-3 h-3" />
                </a>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Le procedure di mediazione avviate anteriormente al 30 giugno 2023 non possono beneficiare del credito d'imposta,
                  poiché l'art. 20, D.Lgs. 28/2010, nella versione anteriore alla Riforma Cartabia (D.Lgs. 149/2022),
                  non ha mai ricevuto attuazione.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fondo annuale disponibile: €51.821.400. In caso di domande eccedenti,
                  il credito viene attribuito proporzionalmente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
