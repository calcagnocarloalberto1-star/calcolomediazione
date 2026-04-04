import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Scale, Gavel, TrendingDown, Clock, Shield, FileText,
  ChevronDown, ChevronUp, Info, CheckCircle, Globe, Building2,
  Home, BarChart3, Landmark, AlertTriangle, Briefcase,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  calcolaConfronto,
  type InputConfronto,
  type RisultatoConfronto,
  type TipoArbitrato,
} from "@shared/costi-procedura";
import { formatEuro, type ModalitaTariffaria } from "@shared/calcolo-indennita";

// Etichette arbitrato
const ARBITRATO_LABELS: Record<TipoArbitrato, string> = {
  cam: "CAM — Milano",
  medyapro_ordinario_unico: "Medyapro — Ordinario (arbitro unico)",
  medyapro_ordinario_collegio: "Medyapro — Ordinario (collegio)",
  medyapro_rapido_unico: "Medyapro — Rapido (arbitro unico)",
  medyapro_rapido_collegio: "Medyapro — Rapido (collegio)",
};

export default function ConfrontoCosti() {
  const [modalitaTariffaria, setModalitaTariffaria] = useState<ModalitaTariffaria>("nazionale");
  const [tipoValore, setTipoValore] = useState("determinato");
  const [valoreLite, setValoreLite] = useState("50000");
  const [tipoMediazione, setTipoMediazione] = useState<"volontaria" | "obbligatoria" | "demandata">("obbligatoria");
  const [materiaImmobiliare, setMateriaImmobiliare] = useState(false);
  const [primaCasa, setPrimaCasa] = useState(true);
  const [redditoAnnuo, setRedditoAnnuo] = useState("");
  const [gratuitoPatrocinio, setGratuitoPatrocinio] = useState(false);
  const [mediatoreEsperto, setMediatoreEsperto] = useState(false);
  const [proceduraComplessa, setProceduraComplessa] = useState(false);
  const [tipoArbitrato, setTipoArbitrato] = useState<TipoArbitrato>("cam");
  const [showDetails, setShowDetails] = useState(false);
  const [showVantaggi, setShowVantaggi] = useState(true);

  const input: InputConfronto = useMemo(() => ({
    valoreLite: parseFloat(valoreLite) || 0,
    tipoValore: tipoValore as InputConfronto["tipoValore"],
    tipoMediazione,
    materiaImmobiliare,
    primaCasa: materiaImmobiliare ? primaCasa : undefined,
    modalitaTariffaria,
    redditoAnnuo: redditoAnnuo ? parseFloat(redditoAnnuo) : undefined,
    gratuitoPatrocinio,
    mediatoreEsperto,
    proceduraComplessa,
    tipoArbitrato,
  }), [valoreLite, tipoValore, tipoMediazione, materiaImmobiliare, primaCasa, modalitaTariffaria, redditoAnnuo, gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa, tipoArbitrato]);

  const risultato: RisultatoConfronto | null = useMemo(() => {
    if (tipoValore === "determinato" && (!valoreLite || parseFloat(valoreLite) <= 0)) return null;
    try { return calcolaConfronto(input); } catch { return null; }
  }, [input, tipoValore, valoreLite]);

  // Label dinamica per arbitrato
  const arbLabel = risultato?.costiArbitrato.nomeIstituzione ?? ARBITRATO_LABELS[tipoArbitrato];
  const arbLabelShort = tipoArbitrato === "cam" ? "Arbitrato CAM" : `Arbitrato Medyapro`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }} data-testid="text-confronto-title">
              Confronto Costi
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Confronto completo dei costi tra mediazione civile, arbitrato e causa ordinaria: contributo unificato, compenso avvocato (D.M. 55/2014), imposte, costi notarili e gratuito patrocinio.
          </p>
        </div>

        {/* Tariff Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" data-testid="confronto-tariff-selector">
          <button onClick={() => setModalitaTariffaria("nazionale")}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${modalitaTariffaria === "nazionale" ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-foreground/30 bg-card hover:border-foreground/60"}`}
            data-testid="button-confronto-nazionale">
            <Globe className={`w-6 h-6 flex-shrink-0 ${modalitaTariffaria === "nazionale" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tariffe Nazionali</div>
              <div className="text-xs text-muted-foreground">D.M. 150/2023</div>
            </div>
            {modalitaTariffaria === "nazionale" && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>}
          </button>
          <button onClick={() => setModalitaTariffaria("coa_genova")}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${modalitaTariffaria === "coa_genova" ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-foreground/30 bg-card hover:border-foreground/60"}`}
            data-testid="button-confronto-genova">
            <Building2 className={`w-6 h-6 flex-shrink-0 ${modalitaTariffaria === "coa_genova" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tariffe COA Genova</div>
              <div className="text-xs text-muted-foreground">Ordine Avvocati Genova</div>
            </div>
            {modalitaTariffaria === "coa_genova" && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>}
          </button>
        </div>

        {/* Form */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8" data-testid="card-confronto-form">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tipo Valore */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Valore</Label>
                <Select value={tipoValore} onValueChange={setTipoValore}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-confronto-tipo-valore"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="determinato">Determinato</SelectItem>
                    <SelectItem value="indeterminabile_basso">Indeterminabile — basso</SelectItem>
                    <SelectItem value="indeterminabile_medio">Indeterminabile — medio</SelectItem>
                    <SelectItem value="indeterminabile_alto">Indeterminabile — alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoValore === "determinato" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Valore della Lite (€)</Label>
                  <Input type="number" value={valoreLite} onChange={e => setValoreLite(e.target.value)}
                    placeholder="50000" className="border-2 border-foreground font-mono"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="input-confronto-valore" />
                </div>
              )}

              {/* Tipo Mediazione */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Mediazione</Label>
                <Select value={tipoMediazione} onValueChange={v => setTipoMediazione(v as InputConfronto["tipoMediazione"])}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-confronto-tipo-mediazione"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="obbligatoria">Obbligatoria</SelectItem>
                    <SelectItem value="volontaria">Volontaria</SelectItem>
                    <SelectItem value="demandata">Demandata dal giudice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo Arbitrato */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Arbitrato</Label>
                <Select value={tipoArbitrato} onValueChange={v => setTipoArbitrato(v as TipoArbitrato)}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-confronto-arbitrato"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="cam">CAM — Camera Arbitrale di Milano</SelectItem>
                    <SelectItem value="medyapro_ordinario_unico">Medyapro — Ordinario (arbitro unico)</SelectItem>
                    <SelectItem value="medyapro_ordinario_collegio">Medyapro — Ordinario (collegio 3 arbitri)</SelectItem>
                    <SelectItem value="medyapro_rapido_unico">Medyapro — Rapido (arbitro unico)</SelectItem>
                    <SelectItem value="medyapro_rapido_collegio">Medyapro — Rapido (collegio 3 arbitri)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {tipoArbitrato === "cam" && "Tariffe CAM in vigore dal 1 marzo 2023"}
                  {tipoArbitrato.startsWith("medyapro") && "Camera Arbitrale Medyapro Srl — Banco Popolare di Verona"}
                </p>
              </div>

              {/* Materia Immobiliare */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Trasferimento immobiliare</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={materiaImmobiliare} onCheckedChange={setMateriaImmobiliare} data-testid="switch-immobiliare" />
                  <span className="text-sm text-muted-foreground">{materiaImmobiliare ? "Sì (intervento notarile)" : "No"}</span>
                </div>
              </div>

              {materiaImmobiliare && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Agevolazione prima casa</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={primaCasa} onCheckedChange={setPrimaCasa} data-testid="switch-prima-casa" />
                    <span className="text-sm text-muted-foreground">{primaCasa ? "Sì — registro 2%" : "No — registro 9%"}</span>
                  </div>
                </div>
              )}

              {/* Gratuito Patrocinio */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Gratuito Patrocinio</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={gratuitoPatrocinio} onCheckedChange={setGratuitoPatrocinio} data-testid="switch-gratuito-patrocinio" />
                  <span className="text-sm text-muted-foreground">{gratuitoPatrocinio ? "Attivo — costi a carico erario" : "No"}</span>
                </div>
              </div>

              {/* Maggiorazioni art. 31 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Maggiorazioni art. 31, co. 3</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={mediatoreEsperto} onCheckedChange={setMediatoreEsperto} data-testid="switch-mediatore-esperto" />
                    <span className="text-sm text-muted-foreground">Mediatore esperto {mediatoreEsperto ? "(+20%)" : ""}</span>
                  </div>
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={proceduraComplessa} onCheckedChange={setProceduraComplessa} data-testid="switch-procedura-complessa" />
                    <span className="text-sm text-muted-foreground">Procedura complessa {proceduraComplessa ? "(+20%)" : ""}</span>
                  </div>
                </div>
              </div>

              {/* Reddito */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Reddito annuo (opzionale)</Label>
                <Input type="number" value={redditoAnnuo} onChange={e => setRedditoAnnuo(e.target.value)}
                  placeholder="Per verifica gratuito patrocinio" className="border-2 border-foreground font-mono"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="input-confronto-reddito" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {risultato && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-50" data-testid="card-totale-mediazione">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-5 h-5 text-green-700" />
                    <span className="text-sm font-bold text-green-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mediazione</span>
                  </div>
                  <Badge className={`mb-2 text-xs border ${risultato.costiMediazione.modalitaTariffaria === "coa_genova" ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-blue-100 text-blue-800 border-blue-300"}`}>
                    {risultato.costiMediazione.modalitaTariffaria === "coa_genova" ? "COA Genova" : "Nazionale"}
                  </Badge>
                  <div className="text-2xl font-bold text-green-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-mediazione">
                    {formatEuro(risultato.costiMediazione.totaleNettoPerParte)}
                  </div>
                  <p className="text-xs text-green-700 mt-1">per parte (al netto del credito d'imposta)</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-50" data-testid="card-totale-causa">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="w-5 h-5 text-red-700" />
                    <span className="text-sm font-bold text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Causa Civile (I grado)</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-causa">
                    {formatEuro(risultato.costiCausaCivile.totalePerParte)}
                  </div>
                  <p className="text-xs text-red-700 mt-1">per parte (primo grado)</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-amber-50" data-testid="card-totale-arbitrato">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <span className="text-sm font-bold text-amber-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{arbLabelShort}</span>
                  </div>
                  <Badge className="mb-2 text-xs border bg-amber-100 text-amber-800 border-amber-300">
                    {risultato.costiArbitrato.tipoArbitro.split("(")[0].trim()}
                  </Badge>
                  <div className="text-2xl font-bold text-amber-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-arbitrato">
                    {formatEuro(risultato.costiArbitrato.totalePerParte)}
                  </div>
                  <p className="text-xs text-amber-700 mt-1">per parte — {risultato.costiArbitrato.durataStimata}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary/10" data-testid="card-risparmio">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--primary))" }}>Risparmio (I grado)</span>
                  </div>
                  <div className="text-2xl font-bold font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(var(--primary))" }} data-testid="text-risparmio">
                    {formatEuro(risultato.risparmioMediazione)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {risultato.percentualeRisparmio > 0 ? `${risultato.percentualeRisparmio}% in meno rispetto alla causa civile` : "La causa civile risulta meno costosa"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gradi Successivi */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 bg-gradient-to-r from-red-50/50 to-orange-50/50" data-testid="card-gradi-successivi">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Landmark className="w-5 h-5 text-red-700" />
                  Costi Gradi Successivi di Giudizio
                </CardTitle>
                <p className="text-xs text-muted-foreground">In caso di impugnazione, i costi si moltiplicano. La mediazione e l'arbitrato evitano tutti i gradi.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-white border-2 border-red-200" data-testid="card-costi-appello">
                    <div className="flex items-center gap-2 mb-2">
                      <Gavel className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Corte d'Appello</span>
                    </div>
                    <div className="text-xl font-bold text-red-800 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-costi-appello">
                      {formatEuro(risultato.costiAppello.totalePerParte)}
                    </div>
                    <p className="text-xs text-red-600 mt-1">per parte — durata {risultato.costiAppello.durataStimata}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>CU (maggiorato 50%)</span><span className="font-mono">{formatEuro(risultato.costiAppello.contributoUnificato)}</span></div>
                      <div className="flex justify-between"><span>Compenso avv. (Tab. 12)</span><span className="font-mono">{formatEuro(risultato.costiAppello.compensoAvvocato)}</span></div>
                      <div className="flex justify-between"><span>Spese + CPA + IVA</span><span className="font-mono">{formatEuro(risultato.costiAppello.speseGenerali15 + risultato.costiAppello.cpa4Avvocato + risultato.costiAppello.iva22Avvocato)}</span></div>
                      {risultato.costiAppello.stimaCTU > 0 && <div className="flex justify-between"><span>Stima CTU (art. 356 c.p.c.)</span><span className="font-mono">{formatEuro(risultato.costiAppello.stimaCTU)}</span></div>}
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-red-300" data-testid="card-costi-cassazione">
                    <div className="flex items-center gap-2 mb-2">
                      <Landmark className="w-4 h-4 text-red-700" />
                      <span className="text-sm font-bold text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Corte di Cassazione</span>
                    </div>
                    <div className="text-xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-costi-cassazione">
                      {formatEuro(risultato.costiCassazione.totalePerParte)}
                    </div>
                    <p className="text-xs text-red-600 mt-1">per parte — durata {risultato.costiCassazione.durataStimata}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>CU (raddoppiato)</span><span className="font-mono">{formatEuro(risultato.costiCassazione.contributoUnificato)}</span></div>
                      <div className="flex justify-between"><span>Compenso avv. (Tab. 13)</span><span className="font-mono">{formatEuro(risultato.costiCassazione.compensoAvvocato)}</span></div>
                      <div className="flex justify-between"><span>Spese + CPA + IVA</span><span className="font-mono">{formatEuro(risultato.costiCassazione.speseGenerali15 + risultato.costiCassazione.cpa4Avvocato + risultato.costiCassazione.iva22Avvocato)}</span></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">NB: In Cassazione non c'è fase istruttoria</p>
                  </div>

                  <div className="p-4 bg-red-100 border-2 border-red-400" data-testid="card-totale-tre-gradi">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-800" />
                      <span className="text-sm font-bold text-red-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Totale 3 Gradi</span>
                    </div>
                    <div className="text-xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-totale-tre-gradi">
                      {formatEuro(risultato.totaleCausaTreGradi)}
                    </div>
                    <p className="text-xs text-red-700 mt-1">per parte — durata complessiva 6-12 anni</p>
                    <div className="mt-3 pt-3 border-t border-red-300">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingDown className="w-3 h-3 text-green-700" />
                        <span className="text-xs font-bold text-green-800">Risparmio con mediazione:</span>
                      </div>
                      <div className="text-lg font-bold text-green-800 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="text-risparmio-tre-gradi">
                        {formatEuro(risultato.risparmioMediazioneTreGradi)}
                      </div>
                      <p className="text-xs text-green-700">{risultato.percentualeRisparmioTreGradi}% in meno rispetto ai tre gradi di giudizio</p>
                    </div>
                  </div>
                </div>

                {/* Riepilogo progressivo */}
                <div className="bg-white border-2 border-foreground p-4">
                  <div className="text-sm font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Riepilogo progressivo dei costi per parte</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-foreground">
                          <th className="text-left py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Procedura</th>
                          <th className="text-right py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Costo</th>
                          <th className="text-right py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cumulativo</th>
                          <th className="text-right py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Durata</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <tr className="border-b border-foreground/10 bg-red-50/50">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>I grado (Tribunale)</td>
                          <td className="text-right py-2 px-3">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 font-bold">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.durataMediaStimata.causaCivile}</td>
                        </tr>
                        <tr className="border-b border-foreground/10 bg-red-50/70">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>II grado (Appello)</td>
                          <td className="text-right py-2 px-3">{formatEuro(risultato.costiAppello.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 font-bold">{formatEuro(risultato.costiCausaCivile.totalePerParte + risultato.costiAppello.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.durataMediaStimata.appello}</td>
                        </tr>
                        <tr className="border-b border-foreground/10 bg-red-100/70">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>III grado (Cassazione)</td>
                          <td className="text-right py-2 px-3">{formatEuro(risultato.costiCassazione.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 font-bold">{formatEuro(risultato.totaleCausaTreGradi)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.durataMediaStimata.cassazione}</td>
                        </tr>
                        <tr className="border-t-2 border-foreground font-bold bg-red-100">
                          <td className="py-3 px-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTALE 3 GRADI</td>
                          <td className="text-right py-3 px-3"></td>
                          <td className="text-right py-3 px-3 text-red-900 text-base">{formatEuro(risultato.totaleCausaTreGradi)}</td>
                          <td className="text-right py-3 px-3 text-xs">6-12 anni</td>
                        </tr>
                        <tr className="bg-green-100 border-t-2 border-green-600">
                          <td className="py-3 px-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MEDIAZIONE</td>
                          <td className="text-right py-3 px-3"></td>
                          <td className="text-right py-3 px-3 text-green-900 text-base font-bold">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</td>
                          <td className="text-right py-3 px-3 text-xs">{risultato.durataMediaStimata.mediazione}</td>
                        </tr>
                        <tr className="bg-amber-100 border-t-2 border-amber-600">
                          <td className="py-3 px-3 text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {risultato.costiArbitrato.nomeIstituzione.toUpperCase()}
                          </td>
                          <td className="text-right py-3 px-3"></td>
                          <td className="text-right py-3 px-3 text-amber-900 text-base font-bold">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                          <td className="text-right py-3 px-3 text-xs">{risultato.costiArbitrato.durataStimata}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grafico */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8" data-testid="card-grafico-confronto">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Confronto Visivo dei Costi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={[
                      { name: "Mediazione", "Costi totali": Math.round(risultato.costiMediazione.totaleNettoPerParte), fill: "#16a34a" },
                      { name: arbLabelShort, "Costi totali": Math.round(risultato.costiArbitrato.totalePerParte), fill: "#d97706" },
                      { name: "I grado", "Costi totali": Math.round(risultato.costiCausaCivile.totalePerParte), fill: "#dc2626" },
                      { name: "I + II grado", "Costi totali": Math.round(risultato.costiCausaCivile.totalePerParte + risultato.costiAppello.totalePerParte), fill: "#b91c1c" },
                      { name: "I + II + III", "Costi totali": Math.round(risultato.totaleCausaTreGradi), fill: "#991b1b" },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    barGap={4} barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e0db" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "'Space Grotesk', sans-serif", fill: "#2d2926" }} axisLine={{ stroke: "#2d2926", strokeWidth: 2 }} tickLine={{ stroke: "#2d2926" }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#2d2926" }} axisLine={{ stroke: "#2d2926", strokeWidth: 2 }} tickLine={{ stroke: "#2d2926" }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip formatter={(v: number) => formatEuro(v)} contentStyle={{ border: "2px solid #2d2926", borderRadius: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }} labelStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} />
                    <Bar dataKey="Costi totali" stroke="#2d2926" strokeWidth={2} radius={0}>
                      <Cell fill="#16a34a" />
                      <Cell fill="#d97706" />
                      <Cell fill="#dc2626" />
                      <Cell fill="#b91c1c" />
                      <Cell fill="#991b1b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  La mediazione risolve in 1-6 mesi. L'arbitrato in {risultato.costiArbitrato.durataStimata}. La causa civile su 3 gradi può richiedere fino a 12 anni. Il totale mediazione è al netto del credito d'imposta.
                </p>
              </CardContent>
            </Card>

            {/* Imposte immobiliari */}
            {risultato.costiMediazione.imposteImmobiliari && (
              <div className="bg-blue-50 border-2 border-blue-200 p-4 mb-8" data-testid="card-imposte-immobiliari">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-800 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Imposte Trasferimento Immobiliare {risultato.costiMediazione.imposteImmobiliari.isPrimaCasa ? "(Prima Casa)" : "(Seconda Casa / Altro)"}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 text-xs">Registro ({risultato.costiMediazione.imposteImmobiliari.aliquotaRegistro})</span>
                        <div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaRegistro)}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-xs">Ipotecaria</span>
                        <div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaIpotecaria)}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-xs">Catastale</span>
                        <div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaCatastale)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">{risultato.costiMediazione.imposteImmobiliari.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Durata + Gratuito Patrocinio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-durata">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Durata Media Stimata</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="text-center p-3 bg-green-50 border-2 border-green-200">
                      <div className="text-base font-bold text-green-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{risultato.durataMediaStimata.mediazione}</div>
                      <div className="text-xs text-green-700">Mediazione</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 border-2 border-amber-200">
                      <div className="text-base font-bold text-amber-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{risultato.costiArbitrato.durataStimata}</div>
                      <div className="text-xs text-amber-700 text-center leading-tight">{arbLabelShort}</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 border-2 border-red-200">
                      <div className="text-base font-bold text-red-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{risultato.durataMediaStimata.causaCivile}</div>
                      <div className="text-xs text-red-700">I grado</div>
                    </div>
                    <div className="text-center p-3 bg-red-50/70 border-2 border-red-200">
                      <div className="text-base font-bold text-red-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{risultato.durataMediaStimata.appello}</div>
                      <div className="text-xs text-red-700">Appello</div>
                    </div>
                    <div className="text-center p-3 bg-red-100 border-2 border-red-300">
                      <div className="text-base font-bold text-red-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{risultato.durataMediaStimata.cassazione}</div>
                      <div className="text-xs text-red-800">Cassazione</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${gratuitoPatrocinio ? "border-green-600 bg-green-50" : "border-foreground"}`} data-testid="card-gratuito-patrocinio">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className={`w-5 h-5 ${gratuitoPatrocinio ? "text-green-700" : "text-primary"}`} />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Gratuito Patrocinio</span>
                    {gratuitoPatrocinio && <Badge className="bg-green-100 text-green-800 border-green-300 border ml-auto">ATTIVO</Badge>}
                  </div>
                  {gratuitoPatrocinio ? (
                    <div>
                      <p className="text-sm text-green-800 font-medium mb-2">Simulazione con gratuito patrocinio attivo (D.P.R. 115/2002, artt. 74-141):</p>
                      <div className="space-y-1 text-xs text-green-700">
                        <p>- Indennità organismo mediazione: a carico dell'erario</p>
                        <p>- Compenso avvocato: a carico dell'erario</p>
                        <p>- Contributo unificato: prenotato a debito</p>
                        <p>- CTU: prenotata a debito</p>
                        <p>- Restano a carico: imposte di registro e notaio (se dovuti)</p>
                      </div>
                    </div>
                  ) : risultato.gratuitoPatrocinio.redditoInserito > 0 ? (
                    <div>
                      <Badge className={`mb-2 ${risultato.gratuitoPatrocinio.ammissibile ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"} border`}>
                        {risultato.gratuitoPatrocinio.ammissibile ? "Ammissibile" : "Non ammissibile"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{risultato.gratuitoPatrocinio.note}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Limite reddito 2025: <span className="font-mono font-bold">{formatEuro(risultato.gratuitoPatrocinio.limiteReddito)}</span></p>
                      <p className="text-xs text-muted-foreground">Inserisci il reddito annuo per verificare l'ammissibilità (D.M. 22/04/2025).</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Dettaglio */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8" data-testid="card-dettaglio">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dettaglio Costi per Parte</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs" data-testid="button-toggle-details">
                    {showDetails ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    {showDetails ? "Nascondi" : "Mostra dettaglio"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="confronto" data-testid="tabs-dettaglio">
                  <TabsList className="flex flex-wrap gap-1 h-auto bg-muted border-2 border-foreground p-1 mb-4">
                    <TabsTrigger value="confronto" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-confronto">Confronto</TabsTrigger>
                    <TabsTrigger value="mediazione" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-mediazione-det">Mediazione</TabsTrigger>
                    <TabsTrigger value="causa" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-causa-det">I Grado</TabsTrigger>
                    <TabsTrigger value="appello" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-appello-det">Appello</TabsTrigger>
                    <TabsTrigger value="arbitrato" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-arbitrato-det">Arbitrato</TabsTrigger>
                    <TabsTrigger value="cassazione" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="tab-cassazione-det">Cassazione</TabsTrigger>
                  </TabsList>

                  {/* Confronto side-by-side */}
                  <TabsContent value="confronto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-foreground">
                            <th className="text-left py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Voce</th>
                            <th className="text-right py-2 px-3 font-bold text-green-800 bg-green-50">Mediazione</th>
                            <th className="text-right py-2 px-3 font-bold text-amber-800 bg-amber-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{arbLabelShort}</th>
                            <th className="text-right py-2 px-3 font-bold text-red-800 bg-red-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Causa Civile</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          <CostRow label="Spese avvio/C.U./Spese amm." med={risultato.costiMediazione.indennitaOrganismo} arb={risultato.costiArbitrato.onorariCAM} causa={risultato.costiCausaCivile.contributoUnificato + risultato.costiCausaCivile.marcaDaBollo + risultato.costiCausaCivile.dirittoCopia} />
                          <CostRow label="Onorari arbitro (+ IVA)" med={0} arb={risultato.costiArbitrato.onorariArbitro + risultato.costiArbitrato.ivaArbitro} causa={0} />
                          <CostRow label="Compenso avvocato" med={risultato.costiMediazione.compensoAvvocato} arb={risultato.costiArbitrato.compensoAvvocato} causa={risultato.costiCausaCivile.compensoAvvocato} />
                          <CostRow label="Spese generali 15%" med={risultato.costiMediazione.speseGenerali15} arb={risultato.costiArbitrato.speseGenerali15} causa={risultato.costiCausaCivile.speseGenerali15} />
                          <CostRow label="CPA 4%" med={risultato.costiMediazione.cpa4Avvocato} arb={risultato.costiArbitrato.cpa4Avvocato} causa={risultato.costiCausaCivile.cpa4Avvocato} />
                          <CostRow label="IVA 22% avvocato" med={risultato.costiMediazione.iva22Avvocato} arb={risultato.costiArbitrato.iva22Avvocato} causa={risultato.costiCausaCivile.iva22Avvocato} />
                          <CostRow label="Bollo" med={0} arb={risultato.costiArbitrato.bollo} causa={risultato.costiCausaCivile.marcaDaBollo} />
                          {risultato.costiMediazione.imposteImmobiliari ? (
                            <>
                              <CostRow label={`Imposta registro (${risultato.costiMediazione.imposteImmobiliari.aliquotaRegistro})`} med={risultato.costiMediazione.imposteImmobiliari.impostaRegistro} arb={risultato.costiArbitrato.impostaRegistroLodo} causa={risultato.costiCausaCivile.impostaRegistroSentenza} />
                              <CostRow label="Imposta ipotecaria" med={risultato.costiMediazione.imposteImmobiliari.impostaIpotecaria} arb={0} causa={0} />
                              <CostRow label="Imposta catastale" med={risultato.costiMediazione.imposteImmobiliari.impostaCatastale} arb={0} causa={0} />
                            </>
                          ) : (
                            <CostRow label="Imposta di registro" med={risultato.costiMediazione.impostaRegistro} arb={risultato.costiArbitrato.impostaRegistroLodo} causa={risultato.costiCausaCivile.impostaRegistroSentenza} />
                          )}
                          {risultato.costiMediazione.costoNotaio > 0 && (
                            <CostRow label="Costi notarili" med={risultato.costiMediazione.costoNotaio} arb={0} causa={0} />
                          )}
                          <CostRow label="Stima CTU" med={0} arb={risultato.costiArbitrato.stimaCTU} causa={risultato.costiCausaCivile.stimaCTU} />
                          <tr className="border-t-2 border-foreground font-bold">
                            <td className="py-3 px-3">Totale per parte</td>
                            <td className="text-right py-3 px-3 bg-green-50 text-green-900">{formatEuro(risultato.costiMediazione.totalePerParte)}</td>
                            <td className="text-right py-3 px-3 bg-amber-50 text-amber-900">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                            <td className="text-right py-3 px-3 bg-red-50 text-red-900">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          </tr>
                          <tr className="text-green-700 bg-green-50/50">
                            <td className="py-2 px-3 text-xs">Credito d'imposta</td>
                            <td className="text-right py-2 px-3 text-xs">-{formatEuro(risultato.costiMediazione.creditoImposta)}</td>
                            <td className="text-right py-2 px-3 text-xs">—</td>
                            <td className="text-right py-2 px-3 text-xs">—</td>
                          </tr>
                          <tr className="border-t-2 border-foreground font-bold text-base">
                            <td className="py-3 px-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTALE NETTO</td>
                            <td className="text-right py-3 px-3 bg-green-100 text-green-900">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</td>
                            <td className="text-right py-3 px-3 bg-amber-100 text-amber-900">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                            <td className="text-right py-3 px-3 bg-red-100 text-red-900">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* Dettaglio Mediazione */}
                  <TabsContent value="mediazione">
                    <div className="space-y-3">
                      <DetailItem label="Spese avvio organismo" value={risultato.costiMediazione.speseAvvio} note={modalitaTariffaria === "coa_genova" ? "Tariffe COA Genova" : "D.M. 150/2023 — Tabella A"} />
                      <DetailItem label="Indennità organismo mediazione" value={risultato.costiMediazione.indennitaOrganismo - risultato.costiMediazione.speseAvvio} note={tipoMediazione !== "volontaria" ? `Ridotta del 20% per mediazione ${tipoMediazione}` : "Mediazione volontaria — tariffe piene"} />
                      <DetailItem label="Compenso avvocato (parametri stragiudiziali)" value={risultato.costiMediazione.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Fasi: attivazione (+30%), negoziazione (+30%), conciliazione" />
                      <DetailItem label="Spese generali forfettarie" value={risultato.costiMediazione.speseGenerali15} note="15% sul compenso (art. 2 D.M. 55/2014)" />
                      <DetailItem label="CPA — Cassa Previdenza Avvocati" value={risultato.costiMediazione.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA" value={risultato.costiMediazione.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      {risultato.costiMediazione.imposteImmobiliari ? (
                        <>
                          <DetailItem label={`Imposta di registro (${risultato.costiMediazione.imposteImmobiliari.aliquotaRegistro})`} value={risultato.costiMediazione.imposteImmobiliari.impostaRegistro} note={risultato.costiMediazione.imposteImmobiliari.note} highlight={risultato.costiMediazione.imposteImmobiliari.impostaRegistro === 0} />
                          <DetailItem label="Imposta ipotecaria" value={risultato.costiMediazione.imposteImmobiliari.impostaIpotecaria} note="Misura fissa €50 (D.Lgs. 347/1990, art. 10)" />
                          <DetailItem label="Imposta catastale" value={risultato.costiMediazione.imposteImmobiliari.impostaCatastale} note="Misura fissa €50 (D.Lgs. 347/1990, art. 10)" />
                        </>
                      ) : (
                        <DetailItem label="Imposta di registro" value={risultato.costiMediazione.impostaRegistro} note={risultato.costiMediazione.impostaRegistro === 0 ? "ESENTE — Valore inferiore a €100.000 (art. 17 D.Lgs. 28/2010)" : "Dovuta solo sulla parte eccedente €100.000 al 3%"} highlight={risultato.costiMediazione.impostaRegistro === 0} />
                      )}
                      {risultato.costiMediazione.costoNotaio > 0 && (
                        <DetailItem label="Costo notaio" value={risultato.costiMediazione.costoNotaio} note="Onorario notarile per autenticazione accordo con effetti reali (art. 11 D.Lgs. 28/2010)" />
                      )}
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Totale per parte</span>
                        <span className="font-bold font-mono text-lg">{formatEuro(risultato.costiMediazione.totalePerParte)}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-700">
                        <span className="text-sm">Credito d'imposta (art. 20 D.Lgs. 28/2010)</span>
                        <span className="font-mono text-sm">-{formatEuro(risultato.costiMediazione.creditoImposta)}</span>
                      </div>
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold text-green-800">Totale netto per parte</span>
                        <span className="font-bold font-mono text-lg text-green-800">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Dettaglio Causa Civile */}
                  <TabsContent value="causa">
                    <div className="space-y-3">
                      <DetailItem label="Contributo unificato" value={risultato.costiCausaCivile.contributoUnificato} note="D.P.R. 115/2002, art. 13 — Primo grado civile" />
                      <DetailItem label="Marca da bollo iscrizione a ruolo" value={risultato.costiCausaCivile.marcaDaBollo} note="€27 per iscrizione al ruolo generale" />
                      <DetailItem label="Diritti di copia" value={risultato.costiCausaCivile.dirittoCopia} note="Stima forfettaria per copie atti e notifiche" />
                      <DetailItem label="Compenso avvocato (Tab. 2)" value={risultato.costiCausaCivile.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — fase studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese generali forfettarie" value={risultato.costiCausaCivile.speseGenerali15} note="15% sul compenso (art. 2 D.M. 55/2014)" />
                      <DetailItem label="CPA — Cassa Previdenza Avvocati" value={risultato.costiCausaCivile.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA" value={risultato.costiCausaCivile.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      <DetailItem label="Imposta di registro sentenza" value={risultato.costiCausaCivile.impostaRegistroSentenza} note="3% sul valore della condanna (art. 8 lett. b Tariffa DPR 131/1986)" />
                      <DetailItem label="Stima CTU" value={risultato.costiCausaCivile.stimaCTU} note="Stima indicativa (variabile per materia)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold text-red-800">Totale per parte (I grado)</span>
                        <span className="font-bold font-mono text-lg text-red-800">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Dettaglio Appello */}
                  <TabsContent value="appello">
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 p-3 mb-2">
                        <p className="text-xs text-amber-800">Corte d'Appello — II grado. Durata: {risultato.costiAppello.durataStimata}.</p>
                      </div>
                      <DetailItem label="Contributo unificato (maggiorato 50%)" value={risultato.costiAppello.contributoUnificato} note="Art. 13 D.P.R. 115/2002 — CU del primo grado maggiorato del 50% per l'appello" />
                      <DetailItem label="Marca da bollo" value={risultato.costiAppello.marcaDaBollo} note="€27 per iscrizione al ruolo" />
                      <DetailItem label="Compenso avvocato (Tab. 12)" value={risultato.costiAppello.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Tab. 12: fase studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese generali" value={risultato.costiAppello.speseGenerali15} note="15% sul compenso" />
                      <DetailItem label="CPA 4%" value={risultato.costiAppello.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA 22%" value={risultato.costiAppello.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      <DetailItem label="Stima CTU" value={risultato.costiAppello.stimaCTU} note="Eventuale rinnovo o nuova CTU in appello (art. 356 c.p.c.)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold text-red-800">Totale per parte (Appello)</span>
                        <span className="font-bold font-mono text-lg text-red-800">{formatEuro(risultato.costiAppello.totalePerParte)}</span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Dettaglio Arbitrato */}
                  <TabsContent value="arbitrato">
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 p-3 mb-2">
                        <p className="text-xs text-amber-800 font-semibold">{risultato.costiArbitrato.nomeIstituzione}</p>
                        <p className="text-xs text-amber-700 mt-1">{risultato.costiArbitrato.tipoArbitro} — Durata stimata: {risultato.costiArbitrato.durataStimata}</p>
                      </div>
                      <DetailItem label="Spese amministrative (per parte)" value={risultato.costiArbitrato.onorariCAM} note={tipoArbitrato === "cam" ? "Diritti amministrativi Camera Arbitrale di Milano — esenti IVA" : "Spese amministrative Medyapro Srl — versate da ciascuna parte al deposito dell'istanza"} />
                      <DetailItem label="Onorari arbitro/collegio (netto IVA)" value={risultato.costiArbitrato.onorariArbitro} note="Media tra minimo e massimo tariffario — quota per parte (totale diviso 2)" />
                      <DetailItem label="IVA 22% sugli onorari arbitro" value={risultato.costiArbitrato.ivaArbitro} note="IVA 22% sugli onorari dell'arbitro/collegio" />
                      <DetailItem label="Compenso avvocato (Tab. 2)" value={risultato.costiArbitrato.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Tabella 2: fase studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese generali forfettarie" value={risultato.costiArbitrato.speseGenerali15} note="15% sul compenso (art. 2 D.M. 55/2014)" />
                      <DetailItem label="CPA — Cassa Previdenza Avvocati" value={risultato.costiArbitrato.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA avvocato" value={risultato.costiArbitrato.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      <DetailItem label="Bollo" value={risultato.costiArbitrato.bollo} note="Stima forfettaria €150 (circa 10 fogli × €16 — DPR 642/1972). Non si applica il contributo unificato." />
                      <DetailItem label="Stima CTU" value={risultato.costiArbitrato.stimaCTU} note="Stima indicativa (variabile per materia)" />
                      <DetailItem label="Imposta di registro sul lodo" value={risultato.costiArbitrato.impostaRegistroLodo} note="3% sul valore della controversia (art. 8 lett. b Tariffa DPR 131/1986) — il lodo ha efficacia di sentenza (art. 824-bis c.p.c.)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold text-amber-800">Totale per parte</span>
                        <span className="font-bold font-mono text-lg text-amber-800">{formatEuro(risultato.costiArbitrato.totalePerParte)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">{risultato.costiArbitrato.noteCalcolo}</p>
                    </div>
                  </TabsContent>

                  {/* Dettaglio Cassazione */}
                  <TabsContent value="cassazione">
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 p-3 mb-2">
                        <p className="text-xs text-amber-800">Corte di Cassazione — III grado. Durata: {risultato.costiCassazione.durataStimata}. In Cassazione non c'è fase istruttoria.</p>
                      </div>
                      <DetailItem label="Contributo unificato (raddoppiato)" value={risultato.costiCassazione.contributoUnificato} note="Art. 13 D.P.R. 115/2002 — CU del primo grado raddoppiato per il ricorso in Cassazione" />
                      <DetailItem label="Marca da bollo" value={risultato.costiCassazione.marcaDaBollo} note="€27 per iscrizione al ruolo" />
                      <DetailItem label="Compenso avvocato (Tab. 13)" value={risultato.costiCassazione.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Tab. 13: fase studio + introduttiva + decisionale (no istruttoria)" />
                      <DetailItem label="Spese generali" value={risultato.costiCassazione.speseGenerali15} note="15% sul compenso" />
                      <DetailItem label="CPA 4%" value={risultato.costiCassazione.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA 22%" value={risultato.costiCassazione.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      <DetailItem label="CTU" value={0} note="Non prevista in Cassazione (giudizio di legittimità, non di merito)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between items-center">
                        <span className="font-bold text-red-800">Totale per parte (Cassazione)</span>
                        <span className="font-bold font-mono text-lg text-red-800">{formatEuro(risultato.costiCassazione.totalePerParte)}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Vantaggi Fiscali */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8" data-testid="card-vantaggi">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <FileText className="w-5 h-5 text-primary" />
                    Vantaggi Fiscali della Mediazione
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowVantaggi(!showVantaggi)} className="text-xs" data-testid="button-toggle-vantaggi">
                    {showVantaggi ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showVantaggi && (
                <CardContent>
                  <div className="space-y-2">
                    {risultato.vantaggiFiscali.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-4 border border-foreground/10 mb-4" data-testid="text-disclaimer">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Criteri di calcolo e avvertenza legale</p>
                  <p className="mb-2">
                    <strong>Compensi avvocato:</strong> i compensi sono calcolati sulla base dei valori medi previsti dal D.M. 55/2014 (aggiornato D.M. 147/2022), sommando le fasi applicabili per ciascun grado. Il compenso effettivo può variare significativamente (dal -50% al +100% rispetto ai valori medi) in base alla complessità, numero delle parti, urgenza e risultati conseguiti (art. 4 D.M. 55/2014).
                  </p>
                  <p className="mb-2">
                    <strong>Arbitrato CAM:</strong> tariffe della Camera Arbitrale di Milano in vigore dal 1 marzo 2023. Simulazione con arbitro unico e valori medi min/max. Onorari CAM esenti IVA; IVA 22% sugli onorari dell'arbitro. Non si applica il contributo unificato. Il lodo ha efficacia di sentenza (art. 824-bis c.p.c.).
                  </p>
                  <p className="mb-2">
                    <strong>Arbitrato Medyapro:</strong> tariffe della Camera Arbitrale Medyapro Srl. Spese amministrative versate da ciascuna parte al deposito. Compensi arbitro/collegio calcolati come media tra minimo e massimo per scaglione, divisi per due (quota per parte). Si applica l'imposta di bollo su tutti gli atti. Per pagamenti: IBAN IT77X0503411716000000007462 (Banco Popolare di Verona, intestato a MedyaPro Srl).
                  </p>
                  <p>
                    <strong>Avvertenza:</strong> tutti i calcoli hanno finalità esclusivamente informativa e orientativa. Non costituiscono consulenza legale né preventivo vincolante. Per una valutazione precisa, si raccomanda di consultare un avvocato o un professionista abilitato.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {!risultato && tipoValore === "determinato" && (
          <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="py-12 text-center">
              <Scale className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Inserisci il valore della lite per visualizzare il confronto dei costi.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ========================
// SUB-COMPONENTS
// ========================

function CostRow({ label, med, arb, causa }: { label: string; med: number; arb: number; causa: number }) {
  return (
    <tr className="border-b border-foreground/10">
      <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{label}</td>
      <td className="text-right py-2 px-3 bg-green-50/50 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{med > 0 ? formatEuro(med) : "—"}</td>
      <td className="text-right py-2 px-3 bg-amber-50/50 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{arb > 0 ? formatEuro(arb) : "—"}</td>
      <td className="text-right py-2 px-3 bg-red-50/50 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{causa > 0 ? formatEuro(causa) : "—"}</td>
    </tr>
  );
}

function DetailItem({ label, value, note, highlight }: { label: string; value: number; note: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2 px-3 ${highlight ? "bg-green-50 border border-green-200" : "border-b border-foreground/5"}`}>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{note}</div>
      </div>
      <div className="font-mono text-sm font-bold flex-shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {highlight && value === 0 ? <Badge className="bg-green-100 text-green-800 border-green-300 border">ESENTE</Badge> : formatEuro(value)}
      </div>
    </div>
  );
}
