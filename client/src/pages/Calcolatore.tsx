import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Info, Building2, Globe, CheckCircle, Scale, UserCheck, Puzzle, Landmark, AlertTriangle, ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  calcolaIndennita,
  getScaglioni,
  getScaglioniGenovaIndeterminabili,
  formatEuro,
  type ModalitaTariffaria,
  type TipoMediazione,
  type EsitoMediazione,
  type TipoValore,
  type CalcoloRisultato,
} from "@shared/calcolo-indennita";
import {
  verificaCongruita,
  COEFFICIENTI_CATASTALI,
  type CategoriaCatastale,
  type RisultatoVerificaCatastale,
} from "@shared/valore-catastale";
import { ExportButtons } from "@/components/ExportButtons";
import { SpiegaAI } from "@/components/SpiegaAI";
import { SeoHead } from "@/components/SeoHead";
import { DisclaimerLegale } from "@/components/DisclaimerLegale";
import type { ReportData } from "@/lib/export-risultati";

// ─── BUILDER REPORT EXPORT ──────────────────────────────────────────────
function buildReportCalcolatore(
  r: CalcoloRisultato,
  tipoMediazione: TipoMediazione,
  tipoValore: TipoValore,
  valoreLite: string,
  esito: EsitoMediazione
): ReportData {
  const valore = tipoValore === "determinato" ? `\u20AC ${parseFloat(valoreLite || "0").toLocaleString("it-IT")}` : tipoValore.replace("_", " ");
  const modalita = r.modalitaTariffaria === "coa_genova" ? "Tariffa COA Genova" : "Tariffa Nazionale (D.M. 150/2023)";
  const tipoMedLabel = tipoMediazione === "obbligatoria" ? "Mediazione obbligatoria" : tipoMediazione === "demandata" ? "Mediazione demandata dal giudice" : "Mediazione volontaria";
  const esitoLabel: Record<EsitoMediazione, string> = {
    nessuno_primo: "Mancato accordo al primo incontro",
    nessuno_successivi: "Mancato accordo dopo il primo incontro",
    accordo_primo: "Accordo al primo incontro",
    accordo_successivi: "Accordo dopo il primo incontro",
  };

  const primoIncontroRows = [
    { label: "Spese di avvio (art. 28, co. 4)", value: formatEuro(r.speseAvvio) },
    { label: "Indennità base primo incontro (art. 28, co. 5)", value: formatEuro(r.speseBase) },
  ];
  if (r.riduzioneObbligatoria > 0) {
    primoIncontroRows.push({
      label: `Riduzione ${tipoMediazione === "obbligatoria" ? "obbligatoria" : "demandata"}`,
      value: `- ${formatEuro(r.riduzioneObbligatoria)}`,
    });
  }
  primoIncontroRows.push({
    label: "Totale Primo Incontro",
    value: formatEuro(r.totalePrimoIncontro),
    bold: true,
  } as { label: string; value: string; bold?: boolean });

  const ulterioriRows: { label: string; value: string; bold?: boolean }[] = [];
  if (r.ulterioriSpese > 0) {
    ulterioriRows.push({ label: "Ulteriori spese (incontri successivi)", value: formatEuro(r.ulterioriSpese) });
  }
  if (r.detrazioneSpese > 0) {
    ulterioriRows.push({ label: "Detrazione spese primo incontro (art. 34, co. 2)", value: `- ${formatEuro(r.detrazioneSpese)}` });
  }
  if (r.maggiorazioneSuccesso > 0) {
    ulterioriRows.push({ label: `Maggiorazione per accordo (${esito === "accordo_primo" ? "+10%" : "+25%"})`, value: `+ ${formatEuro(r.maggiorazioneSuccesso)}` });
  }
  if (r.maggiorazioneArt31 > 0) {
    ulterioriRows.push({ label: "Maggiorazione art. 31, co. 3 (+20%)", value: `+ ${formatEuro(r.maggiorazioneArt31)}` });
  }

  const totaliRows = [
    { label: "Totale per Parte", value: formatEuro(r.totalePerParte), bold: true },
    { label: "IVA 22%", value: formatEuro(r.iva) },
    { label: "Totale con IVA (per parte)", value: formatEuro(r.totaleConIva), bold: true },
    { label: "Totale Complessivo (2 parti)", value: formatEuro(r.totaleComplessivo), bold: true },
  ];

  const sections = [
    {
      title: "Parametri del calcolo",
      rows: [
        { label: "Modalità tariffaria", value: modalita },
        { label: "Scaglione", value: r.scaglione },
        { label: "Valore della lite", value: valore },
        { label: "Tipo di mediazione", value: tipoMedLabel },
        { label: "Esito", value: esitoLabel[esito] },
      ],
    },
    { title: "Primo incontro", rows: primoIncontroRows },
  ];
  if (ulterioriRows.length > 0) sections.push({ title: "Incontri successivi / Maggiorazioni", rows: ulterioriRows });
  sections.push({ title: "Totali", rows: totaliRows });

  const footerNotes: string[] = [];
  if (r.esenzioneArt17.esenteBollo) footerNotes.push("Esenzione imposta di bollo (art. 17 D.Lgs. 28/2010) su tutti gli atti del procedimento.");
  if (r.esenzioneArt17.esenteRegistro && r.esenzioneArt17.limiteEsenzione > 0) footerNotes.push(`Esenzione imposta di registro fino a ${formatEuro(r.esenzioneArt17.limiteEsenzione)} del valore dell'accordo.`);
  footerNotes.push("Importi calcolati secondo D.M. 150/2023; valori soggetti a variazioni in funzione della concreta gestione della procedura.");

  return {
    title: "Calcolo Indennità di Mediazione",
    subtitle: `${modalita} — ${tipoMedLabel} — Valore lite: ${valore}`,
    sections,
    footerNotes,
    fileName: `calcolo-indennita-mediazione-${Date.now()}`,
  };
}

export default function Calcolatore() {
  const [modalitaTariffaria, setModalitaTariffaria] = useState<ModalitaTariffaria>("nazionale");
  const [tipoMediazione, setTipoMediazione] = useState<TipoMediazione>("obbligatoria");
  const [tipoValore, setTipoValore] = useState<TipoValore>("determinato");
  const [valoreLite, setValoreLite] = useState<string>("25000");
  const [esito, setEsito] = useState<EsitoMediazione>("nessuno_primo");
  const [risultato, setRisultato] = useState<CalcoloRisultato | null>(null);
  const [mediatoreEsperto, setMediatoreEsperto] = useState(false);
  const [proceduraComplessa, setProceduraComplessa] = useState(false);
  // Verifica congruità catastale
  const [showVerificaCatastale, setShowVerificaCatastale] = useState(false);
  const [renditaCatastale, setRenditaCatastale] = useState<string>("");
  const [categoriaCatastale, setCategoriaCatastale] = useState<CategoriaCatastale>("prima_casa");
  const [verificaResult, setVerificaResult] = useState<RisultatoVerificaCatastale | null>(null);

  const scaglioni = getScaglioni(modalitaTariffaria);

  const handleCalcola = () => {
    const input = {
      valoreLite: tipoValore === "determinato" ? parseFloat(valoreLite) || 0 : 0,
      tipoMediazione,
      esito,
      tipoValore,
      modalitaTariffaria,
      mediatoreEsperto,
      proceduraComplessa,
    };
    const result = calcolaIndennita(input);
    setRisultato(result);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <SeoHead
        title="Calcolatore Indennità Mediazione D.M. 150/2023 — Tariffe Nazionali e COA Genova"
        description="Calcola le indennità di mediazione civile secondo il D.M. 150/2023: tariffe nazionali Tabella A e regolamento COA Genova. Spese di avvio, riduzioni art. 28, maggiorazioni art. 31, agevolazioni fiscali art. 17 D.Lgs. 28/2010."
        canonical="https://calcolomediazione.it/calcolatore"
      />
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              data-testid="text-page-title"
            >
              Calcolatore Indennità Mediazione
            </h1>
          </div>
          <p className="text-muted-foreground">
            Calcolo delle indennità con tariffe nazionali (D.M. 150/2023) o tariffe COA Genova
          </p>
        </div>

        {/* Tariff Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" data-testid="tariff-mode-selector">
          <button
            onClick={() => { setModalitaTariffaria("nazionale"); setRisultato(null); }}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${
              modalitaTariffaria === "nazionale"
                ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "border-foreground/30 bg-card hover:border-foreground/60"
            }`}
            data-testid="button-mode-nazionale"
          >
            <Globe className={`w-6 h-6 ${modalitaTariffaria === "nazionale" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tariffe Nazionali
              </div>
              <div className="text-xs text-muted-foreground">D.M. 150/2023 — Tabella A</div>
            </div>
            {modalitaTariffaria === "nazionale" && (
              <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>
            )}
          </button>

          <button
            onClick={() => { setModalitaTariffaria("coa_genova"); setRisultato(null); }}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${
              modalitaTariffaria === "coa_genova"
                ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "border-foreground/30 bg-card hover:border-foreground/60"
            }`}
            data-testid="button-mode-genova"
          >
            <Building2 className={`w-6 h-6 ${modalitaTariffaria === "coa_genova" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tariffe COA Genova
              </div>
              <div className="text-xs text-muted-foreground">Ordine degli Avvocati di Genova</div>
            </div>
            {modalitaTariffaria === "coa_genova" && (
              <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-form">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Parametri Calcolo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Tipo Mediazione
                    ACC-02: il <Label htmlFor="tipoMediazione"> qui sotto punta a un id
                    che il componente Select/SelectTrigger di Radix non riceve mai (non è
                    un <input> nativo), quindi l'associazione è "rotta" e uno screen reader
                    annuncia solo il valore selezionato, non il nome del campo. Aggiunto
                    aria-label esplicito su ogni SelectTrigger di questa pagina come fix
                    diretto e più affidabile dell'associazione id/htmlFor per i combobox
                    Radix (stesso pattern applicato anche in ConfrontoCosti.tsx,
                    AnalisiCasoAI.tsx, GeneratoreProcura.tsx). */}
                <div className="space-y-2">
                  <Label htmlFor="tipoMediazione" className="text-sm font-semibold">
                    Tipo Mediazione
                  </Label>
                  <Select value={tipoMediazione} onValueChange={(v) => setTipoMediazione(v as TipoMediazione)}>
                    <SelectTrigger className="border-2 border-foreground" aria-label="Tipo Mediazione" data-testid="select-tipo-mediazione">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="volontaria">Volontaria (tariffe piene)</SelectItem>
                      <SelectItem value="obbligatoria">Obbligatoria (riduzione {modalitaTariffaria === "coa_genova" ? "20%" : "1/5"})</SelectItem>
                      <SelectItem value="demandata">Demandata dal giudice (riduzione {modalitaTariffaria === "coa_genova" ? "20%" : "1/5"})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo Valore */}
                <div className="space-y-2">
                  <Label htmlFor="tipoValore" className="text-sm font-semibold">
                    Tipo Valore
                  </Label>
                  <Select value={tipoValore} onValueChange={(v) => setTipoValore(v as TipoValore)}>
                    <SelectTrigger className="border-2 border-foreground" aria-label="Tipo Valore" data-testid="select-tipo-valore">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="determinato">Determinato</SelectItem>
                      <SelectItem value="indeterminabile_basso">Indeterminabile — complessità bassa</SelectItem>
                      <SelectItem value="indeterminabile_medio">Indeterminabile — complessità media</SelectItem>
                      <SelectItem value="indeterminabile_alto">Indeterminabile — complessità alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Valore Lite */}
                {tipoValore === "determinato" && (
                  <div className="space-y-2">
                    <Label htmlFor="valoreLite" className="text-sm font-semibold">
                      Valore della Lite (€)
                    </Label>
                    <Input
                      id="valoreLite"
                      type="number"
                      value={valoreLite}
                      onChange={(e) => setValoreLite(e.target.value)}
                      placeholder="Es. 25000"
                      className="border-2 border-foreground font-mono"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      data-testid="input-valore-lite"
                    />
                  </div>
                )}

                {/* Esito */}
                <div className="space-y-2">
                  <Label htmlFor="esito" className="text-sm font-semibold">
                    Esito Mediazione
                  </Label>
                  <Select value={esito} onValueChange={(v) => setEsito(v as EsitoMediazione)}>
                    <SelectTrigger className="border-2 border-foreground" aria-label="Esito Mediazione" data-testid="select-esito">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="nessuno_primo">Nessun accordo — primo incontro</SelectItem>
                      <SelectItem value="accordo_primo">Accordo al primo incontro</SelectItem>
                      <SelectItem value="accordo_successivi">Accordo agli incontri successivi</SelectItem>
                      <SelectItem value="nessuno_successivi">Nessun accordo — incontri successivi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Art. 31, co. 3 — Maggiorazioni per esperienza/complessità
                    UX-04: la sezione resta montata nel DOM e la sua comparsa/
                    scomparsa è animata (altezza + opacità) invece che
                    istantanea, per evitare lo spostamento brusco del
                    pulsante "Calcola Indennità" sottostante (rischio di
                    click accidentale segnalato in audit). aria-hidden e
                    tabIndex=-1 sui campi quando non pertinente mantengono
                    l'accessibilità da tastiera (nessun focus su campi
                    invisibili). */}
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    esito === "accordo_successivi" ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={esito !== "accordo_successivi"}
                >
                  <div className="space-y-3 p-4 border-2 border-foreground/30 bg-muted/30" data-testid="card-art31">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Maggiorazioni art. 31, co. 3
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      In caso di conciliazione in incontri successivi al primo, le spese possono essere maggiorate fino al 20% in presenza di almeno uno dei seguenti criteri:
                    </p>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="mediatoreEsperto"
                        checked={mediatoreEsperto}
                        onCheckedChange={(checked) => setMediatoreEsperto(checked === true)}
                        className="mt-0.5 border-2 border-foreground"
                        tabIndex={esito === "accordo_successivi" ? undefined : -1}
                        data-testid="checkbox-mediatore-esperto"
                      />
                      <label htmlFor="mediatoreEsperto" className="cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-semibold">Mediatore esperto</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Mediatore di esperienza e competenza designato su concorde indicazione delle parti (lett. a)
                        </p>
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="proceduraComplessa"
                        checked={proceduraComplessa}
                        onCheckedChange={(checked) => setProceduraComplessa(checked === true)}
                        className="mt-0.5 border-2 border-foreground"
                        tabIndex={esito === "accordo_successivi" ? undefined : -1}
                        data-testid="checkbox-procedura-complessa"
                      />
                      <label htmlFor="proceduraComplessa" className="cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <Puzzle className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-semibold">Procedura complessa</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Complessità delle questioni, impegno richiesto al mediatore, numero degli incontri (lett. b)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCalcola}
                  className="w-full py-6 text-base font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                  data-testid="button-calcola"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcola Indennità
                </Button>
              </CardContent>
            </Card>

            {/* Verifica Congruità Catastale — Art. 29 D.M. 150/2023 */}
            {tipoValore === "determinato" && (
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-6" data-testid="card-verifica-catastale">
                <CardHeader className="pb-2">
                  <button
                    onClick={() => setShowVerificaCatastale(!showVerificaCatastale)}
                    className="flex items-center justify-between w-full"
                    data-testid="button-toggle-catastale"
                  >
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Verifica Congruità Catastale
                      </CardTitle>
                    </div>
                    {showVerificaCatastale ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Art. 29 D.M. 150/2023 — Per materia da trascrivere (immobili)
                  </p>
                </CardHeader>
                {showVerificaCatastale && (
                  <CardContent className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Verifica se il valore della domanda/accordo è congruo rispetto al valore catastale dell'immobile. Un valore inferiore al catastale può generare accertamenti da parte dell'Agenzia delle Entrate.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="renditaCatastale" className="text-sm font-semibold">
                        Rendita Catastale (€) — non rivalutata
                      </Label>
                      <Input
                        id="renditaCatastale"
                        type="number"
                        value={renditaCatastale}
                        onChange={(e) => { setRenditaCatastale(e.target.value); setVerificaResult(null); }}
                        placeholder="Es. 925.00 (dalla visura catastale)"
                        className="border-2 border-foreground font-mono"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        data-testid="input-rendita-catastale"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoriaCatastale" className="text-sm font-semibold">
                        Tipologia Immobile
                      </Label>
                      <Select value={categoriaCatastale} onValueChange={(v) => { setCategoriaCatastale(v as CategoriaCatastale); setVerificaResult(null); }}>
                        <SelectTrigger className="border-2 border-foreground" aria-label="Tipologia Immobile" data-testid="select-categoria-catastale">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-foreground">
                          {Object.entries(COEFFICIENTI_CATASTALI).map(([key, val]) => (
                            <SelectItem key={key} value={key}>
                              {val.label} (×{val.moltiplicatore})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => {
                        const rendita = parseFloat(renditaCatastale) || 0;
                        const valore = parseFloat(valoreLite) || 0;
                        if (rendita > 0 && valore > 0) {
                          setVerificaResult(verificaCongruita({
                            renditaCatastale: rendita,
                            categoria: categoriaCatastale,
                            valoreDomanda: valore,
                          }));
                        }
                      }}
                      variant="outline"
                      className="w-full py-5 font-bold border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                      disabled={!renditaCatastale || !valoreLite}
                      data-testid="button-verifica-catastale"
                    >
                      <Landmark className="w-4 h-4 mr-2" />
                      Verifica Congruità
                    </Button>

                    {verificaResult && (
                      <div className={`p-4 border-2 space-y-3 ${
                        verificaResult.congruo
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : verificaResult.rischio === "alto"
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : verificaResult.rischio === "medio"
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                              : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
                      }`} data-testid="result-verifica-catastale">
                        <div className="flex items-center gap-2">
                          {verificaResult.congruo ? (
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                          ) : (
                            <ShieldAlert className={`w-5 h-5 ${
                              verificaResult.rischio === "alto" ? "text-red-600" : "text-amber-600"
                            }`} />
                          )}
                          <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {verificaResult.congruo ? "Valore Congruo" : `Rischio ${verificaResult.rischio === "alto" ? "Alto" : verificaResult.rischio === "medio" ? "Medio" : "Basso"}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Rendita rivalutata:</span>
                            <div className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {formatEuro(verificaResult.renditaRivalutata)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Moltiplicatore:</span>
                            <div className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              ×{verificaResult.moltiplicatore}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valore catastale:</span>
                            <div className="font-mono font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {formatEuro(verificaResult.valoreCatastale)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valore domanda:</span>
                            <div className="font-mono font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {formatEuro(verificaResult.valoreDomanda)}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs leading-relaxed">
                          <span className="font-semibold">Scostamento:</span>{" "}
                          <span className={`font-mono font-bold ${
                            verificaResult.congruo ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                          }`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {verificaResult.percentualeScostamento > 0 ? "+" : ""}{verificaResult.percentualeScostamento.toFixed(1)}%
                          </span>
                          {" "}({verificaResult.differenza >= 0 ? "+" : ""}{formatEuro(verificaResult.differenza)})
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {verificaResult.messaggio}
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {risultato ? (
              <Card
                className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                data-testid="card-risultato"
                role="status"
                aria-live="polite"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Risultato Calcolo
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-primary/10 text-primary border-2 border-primary text-xs">
                        {risultato.scaglione}
                      </Badge>
                      <Badge className={`text-xs border-2 ${
                        risultato.modalitaTariffaria === "coa_genova"
                          ? "bg-amber-100 text-amber-800 border-amber-400"
                          : "bg-blue-100 text-blue-800 border-blue-400"
                      }`}>
                        {risultato.modalitaTariffaria === "coa_genova" ? "COA Genova" : "Nazionale"}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ExportButtons
                      label="calcolo"
                      testIdPrefix="export-calcolatore"
                      buildReport={() => buildReportCalcolatore(risultato, tipoMediazione, tipoValore, valoreLite, esito)}
                    />
                    <SpiegaAI
                      contesto="calcolo dell'indennità di mediazione (D.M. 150/2023)"
                      getPayload={() => buildReportCalcolatore(risultato, tipoMediazione, tipoValore, valoreLite, esito)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Spese Avvio</span>
                      <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-spese-avvio">
                        {formatEuro(risultato.speseAvvio)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Indennità Base (primo incontro)</span>
                      <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-spese-base">
                        {formatEuro(risultato.speseBase)}
                      </span>
                    </div>

                    {risultato.riduzioneObbligatoria > 0 && (
                      <div className="flex justify-between items-center py-2 text-green-700">
                        <span className="text-sm">
                          Riduzione {tipoMediazione === "obbligatoria" ? "obbligatoria" : "demandata"} ({modalitaTariffaria === "coa_genova" ? "-20%" : "-1/5"})
                        </span>
                        <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-riduzione">
                          -{formatEuro(risultato.riduzioneObbligatoria)}
                        </span>
                      </div>
                    )}

                    <Separator className="border-foreground/20" />

                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold">Totale Primo Incontro</span>
                      <span className="font-mono font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-primo">
                        {formatEuro(risultato.totalePrimoIncontro)}
                      </span>
                    </div>

                    {/* UX-01: questo importo è più basso di quello che compare
                        nella Tabella A per lo stesso scaglione di valore — non
                        è un errore, ma l'effetto delle spese ridotte del primo
                        incontro previste dall'art. 28, co. 5-6, D.M. 150/2023.
                        Spiegazione contestuale + link alla guida completa. */}
                    <div className="flex items-start gap-2 py-1 text-xs text-muted-foreground">
                      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        Questo importo è inferiore al valore pieno di Tabella A: per il primo incontro l'art. 28,
                        co. 5-6, D.M. 150/2023 prevede spese ridotte, dovute solo se non si raggiunge un accordo o se
                        la mediazione si ferma qui. Il resto dell'indennità (Tabella A) è dovuto solo se la procedura
                        prosegue oltre il primo incontro.{" "}
                        <Link href="/guida-dm-150">
                          <span className="underline cursor-pointer text-foreground">Approfondisci nella guida</span>
                        </Link>
                        .
                      </span>
                    </div>

                    {risultato.ulterioriSpese > 0 && (
                      <>
                        <Separator className="border-foreground/20" />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Ulteriori Spese (incontri successivi)</span>
                          <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {formatEuro(risultato.ulterioriSpese)}
                          </span>
                        </div>
                      </>
                    )}

                    {risultato.detrazioneSpese > 0 && (
                      <div className="flex justify-between items-center py-2 text-green-700">
                        <span className="text-sm">Detrazione spese primo incontro (art. 34, co. 2)</span>
                        <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          -{formatEuro(risultato.detrazioneSpese)}
                        </span>
                      </div>
                    )}

                    {risultato.maggiorazioneSuccesso > 0 && (
                      <div className="flex justify-between items-center py-2 text-primary">
                        <span className="text-sm">
                          Maggiorazione per accordo ({esito === "accordo_primo" ? "+10%" : "+25%"})
                        </span>
                        <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          +{formatEuro(risultato.maggiorazioneSuccesso)}
                        </span>
                      </div>
                    )}

                    {risultato.maggiorazioneArt31 > 0 && (
                      <div className="flex justify-between items-center py-2 text-amber-700 dark:text-amber-400">
                        <span className="text-sm">
                          Maggiorazione art. 31, co. 3 (+20%)
                          <span className="block text-xs text-muted-foreground">
                            {mediatoreEsperto && proceduraComplessa
                              ? "Mediatore esperto + procedura complessa"
                              : mediatoreEsperto
                                ? "Mediatore esperto"
                                : "Procedura complessa"}
                          </span>
                        </span>
                        <span className="font-mono font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          +{formatEuro(risultato.maggiorazioneArt31)}
                        </span>
                      </div>
                    )}

                    <Separator className="border-foreground" />

                    {/* Totals */}
                    <div className="bg-muted/50 border-2 border-foreground p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Totale per Parte
                        </span>
                        <span
                          className="text-xl font-bold text-primary font-mono"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          data-testid="text-totale-per-parte"
                        >
                          {formatEuro(risultato.totalePerParte)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">IVA 22%</span>
                        <span className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-iva">
                          {formatEuro(risultato.iva)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Totale con IVA (per parte)</span>
                        <span className="font-mono font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-con-iva">
                          {formatEuro(risultato.totaleConIva)}
                        </span>
                      </div>

                      <Separator className="border-foreground/30" />

                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Totale Complessivo (2 parti)
                        </span>
                        <span
                          className="text-xl font-bold font-mono"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          data-testid="text-totale-complessivo"
                        >
                          {formatEuro(risultato.totaleComplessivo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agevolazioni Fiscali Art. 17 */}
                  <div className="mt-6 border-2 border-green-600 bg-green-50 dark:bg-green-950/20" data-testid="card-esenzione-art17">
                    <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-green-600 bg-green-100 dark:bg-green-900/30">
                      <Scale className="w-5 h-5 text-green-700" />
                      <h3 className="text-sm font-bold text-green-800 dark:text-green-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Agevolazioni Fiscali Art. 17 D.Lgs. 28/2010
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-semibold text-foreground">Esenzione imposta di bollo</span>
                          <p className="text-xs text-muted-foreground">
                            {risultato.esenzioneArt17.esenteBollo
                              ? "Si - Tutti gli atti, documenti e provvedimenti del procedimento di mediazione"
                              : "No"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        {risultato.esenzioneArt17.esenteRegistro ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-sm font-semibold text-foreground">Esenzione imposta di registro</span>
                          <p className="text-xs text-muted-foreground">
                            {risultato.esenzioneArt17.esenteRegistro
                              ? `Si - Fino a ${formatEuro(risultato.esenzioneArt17.limiteEsenzione)} del valore dell'accordo`
                              : "Non applicabile (solo in caso di accordo)"}
                          </p>
                        </div>
                      </div>

                      {risultato.esenzioneArt17.impostaRegistroRisparmiata > 0 && (
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-semibold text-foreground">Risparmio imposta di registro</span>
                            <p className="text-xs text-muted-foreground">
                              Imposta di registro risparmiata (3% fino a {formatEuro(risultato.esenzioneArt17.limiteEsenzione)})
                            </p>
                            <span
                              className="text-base font-bold text-green-700 dark:text-green-400"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              data-testid="text-risparmio-registro"
                            >
                              {formatEuro(risultato.esenzioneArt17.impostaRegistroRisparmiata)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-green-300 dark:border-green-700">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {risultato.esenzioneArt17.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-foreground/30 bg-muted/20" data-testid="card-placeholder">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-muted border-2 border-foreground/20 flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Inserisci i parametri
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Compila il modulo a sinistra e premi "Calcola Indennità" per visualizzare il risultato.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reference Table */}
        <div className="mt-12">
          <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-scaglioni">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {modalitaTariffaria === "coa_genova"
                    ? "Scaglioni Tariffe COA Genova — Valore Determinato"
                    : "Scaglioni D.M. 150/2023 — Tabella A"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-scaglioni">
                  <thead>
                    <tr className="border-b-2 border-foreground">
                      <th className="text-left py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Valore della Lite
                      </th>
                      <th className="text-right py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Spese Avvio
                      </th>
                      <th className="text-right py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Indennità
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaglioni.map((s, i) => (
                      <tr
                        key={i}
                        className={`border-b border-muted ${risultato && risultato.scaglione === s.label ? "bg-primary/10 font-semibold" : ""}`}
                        data-testid={`row-scaglione-${i}`}
                      >
                        <td className="py-3 px-4">{s.label}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatEuro(s.speseAvvio)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatEuro(s.indennita)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Genova indeterminabili extra table */}
              {modalitaTariffaria === "coa_genova" && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Tariffe COA Genova — Valore Indeterminabile
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-scaglioni-indet">
                      <thead>
                        <tr className="border-b-2 border-foreground">
                          <th className="text-left py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Complessità
                          </th>
                          <th className="text-right py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Spese Avvio
                          </th>
                          <th className="text-right py-3 px-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Acconto Mediazione
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getScaglioniGenovaIndeterminabili().map((s, i) => (
                          <tr key={i} className="border-b border-muted" data-testid={`row-indet-${i}`}>
                            <td className="py-3 px-4">{s.label}</td>
                            <td className="py-3 px-4 text-right font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {formatEuro(s.speseAvvio)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {formatEuro(s.indennita)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Per mediazioni obbligatorie/demandate si applica la riduzione del 20% su spese avvio e acconto.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DisclaimerLegale
          variant="full"
          riferimenti={["D.M. 150/2023", "D.Lgs. 28/2010", "D.M. 55/2014 (D.M. 147/2022)", "art. 17 D.Lgs. 28/2010", "art. 29 D.M. 150/2023"]}
          noteSpecifiche="I calcoli applicano gli scaglioni della Tabella A del D.M. 150/2023 per il regime nazionale e il Regolamento COA Genova quando attivo. La verifica di congruità catastale segue l'art. 29 D.M. 150/2023."
        />
      </div>
    </div>
  );
}
