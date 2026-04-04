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
  const [tipoArbitratoMedyapro, setTipoArbitratoMedyapro] = useState<TipoArbitrato>("medyapro_ordinario_unico");
  const [showDetails, setShowDetails] = useState(false);
  const [showVantaggi, setShowVantaggi] = useState(true);

  const baseInput = useMemo(() => ({
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
  }), [valoreLite, tipoValore, tipoMediazione, materiaImmobiliare, primaCasa, modalitaTariffaria, redditoAnnuo, gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa]);

  const isValid = tipoValore !== "determinato" || (!!valoreLite && parseFloat(valoreLite) > 0);

  const risultatoCAM: RisultatoConfronto | null = useMemo(() => {
    if (!isValid) return null;
    try { return calcolaConfronto({ ...baseInput, tipoArbitrato: "cam" }); } catch { return null; }
  }, [baseInput, isValid]);

  const risultatoMedyapro: RisultatoConfronto | null = useMemo(() => {
    if (!isValid) return null;
    try { return calcolaConfronto({ ...baseInput, tipoArbitrato: tipoArbitratoMedyapro }); } catch { return null; }
  }, [baseInput, isValid, tipoArbitratoMedyapro]);

  const risultato = risultatoCAM;

  const medyaproLabel = tipoArbitratoMedyapro.includes("rapido") ? "Medyapro Rapido" : "Medyapro Ordinario";
  const medyaproLabelFull = risultatoMedyapro?.costiArbitrato.nomeIstituzione ?? medyaproLabel;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            Confronto completo: mediazione civile, arbitrato CAM, arbitrato Medyapro e causa ordinaria.
          </p>
        </div>

        {/* Tariff Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button onClick={() => setModalitaTariffaria("nazionale")}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${modalitaTariffaria === "nazionale" ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-foreground/30 bg-card hover:border-foreground/60"}`}>
            <Globe className={`w-6 h-6 flex-shrink-0 ${modalitaTariffaria === "nazionale" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tariffe Nazionali</div>
              <div className="text-xs text-muted-foreground">D.M. 150/2023</div>
            </div>
            {modalitaTariffaria === "nazionale" && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>}
          </button>
          <button onClick={() => setModalitaTariffaria("coa_genova")}
            className={`flex items-center gap-3 p-4 border-2 transition-all duration-150 ${modalitaTariffaria === "coa_genova" ? "border-foreground bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-foreground/30 bg-card hover:border-foreground/60"}`}>
            <Building2 className={`w-6 h-6 flex-shrink-0 ${modalitaTariffaria === "coa_genova" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tariffe COA Genova</div>
              <div className="text-xs text-muted-foreground">Ordine Avvocati Genova</div>
            </div>
            {modalitaTariffaria === "coa_genova" && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Attivo</Badge>}
          </button>
        </div>

        {/* Form */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Valore</Label>
                <Select value={tipoValore} onValueChange={setTipoValore}>
                  <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
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
                    style={{ fontFamily: "'JetBrains Mono', monospace" }} />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Mediazione</Label>
                <Select value={tipoMediazione} onValueChange={v => setTipoMediazione(v as InputConfronto["tipoMediazione"])}>
                  <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="obbligatoria">Obbligatoria</SelectItem>
                    <SelectItem value="volontaria">Volontaria</SelectItem>
                    <SelectItem value="demandata">Demandata dal giudice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selettore solo per tipo Medyapro */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Arbitrato Medyapro</Label>
                <Select value={tipoArbitratoMedyapro} onValueChange={v => setTipoArbitratoMedyapro(v as TipoArbitrato)}>
                  <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="medyapro_ordinario_unico">Ordinario — Arbitro unico</SelectItem>
                    <SelectItem value="medyapro_ordinario_collegio">Ordinario — Collegio (3 arbitri)</SelectItem>
                    <SelectItem value="medyapro_rapido_unico">Rapido — Arbitro unico</SelectItem>
                    <SelectItem value="medyapro_rapido_collegio">Rapido — Collegio (3 arbitri)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">CAM è sempre arbitro unico (valori medi)</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Trasferimento immobiliare</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={materiaImmobiliare} onCheckedChange={setMateriaImmobiliare} />
                  <span className="text-sm text-muted-foreground">{materiaImmobiliare ? "Sì (intervento notarile)" : "No"}</span>
                </div>
              </div>

              {materiaImmobiliare && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Agevolazione prima casa</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={primaCasa} onCheckedChange={setPrimaCasa} />
                    <span className="text-sm text-muted-foreground">{primaCasa ? "Sì — registro 2%" : "No — registro 9%"}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Gratuito Patrocinio</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={gratuitoPatrocinio} onCheckedChange={setGratuitoPatrocinio} />
                  <span className="text-sm text-muted-foreground">{gratuitoPatrocinio ? "Attivo — costi a carico erario" : "No"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Maggiorazioni art. 31, co. 3</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={mediatoreEsperto} onCheckedChange={setMediatoreEsperto} />
                    <span className="text-sm text-muted-foreground">Mediatore esperto {mediatoreEsperto ? "(+20%)" : ""}</span>
                  </div>
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={proceduraComplessa} onCheckedChange={setProceduraComplessa} />
                    <span className="text-sm text-muted-foreground">Procedura complessa {proceduraComplessa ? "(+20%)" : ""}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Reddito annuo (opzionale)</Label>
                <Input type="number" value={redditoAnnuo} onChange={e => setRedditoAnnuo(e.target.value)}
                  placeholder="Per verifica gratuito patrocinio" className="border-2 border-foreground font-mono"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {risultato && risultatoMedyapro && (
          <>
            {/* Summary Cards — 5 colonne */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-green-700" />
                    <span className="text-xs font-bold text-green-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mediazione</span>
                  </div>
                  <div className="text-xl font-bold text-green-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatEuro(risultato.costiMediazione.totaleNettoPerParte)}
                  </div>
                  <p className="text-xs text-green-700 mt-1">per parte (netto credito)</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-amber-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arbitrato CAM</span>
                  </div>
                  <div className="text-xl font-bold text-amber-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatEuro(risultato.costiArbitrato.totalePerParte)}
                  </div>
                  <p className="text-xs text-amber-700 mt-1">per parte — {risultato.costiArbitrato.durataStimata}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-orange-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-orange-700" />
                    <span className="text-xs font-bold text-orange-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{medyaproLabel}</span>
                  </div>
                  <div className="text-xl font-bold text-orange-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte)}
                  </div>
                  <p className="text-xs text-orange-700 mt-1">per parte — {risultatoMedyapro.costiArbitrato.durataStimata}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Gavel className="w-4 h-4 text-red-700" />
                    <span className="text-xs font-bold text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Causa Civile</span>
                  </div>
                  <div className="text-xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatEuro(risultato.costiCausaCivile.totalePerParte)}
                  </div>
                  <p className="text-xs text-red-700 mt-1">per parte (I grado)</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary/10">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--primary))" }}>Risparmio med.</span>
                  </div>
                  <div className="text-xl font-bold font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(var(--primary))" }}>
                    {formatEuro(risultato.risparmioMediazione)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {risultato.percentualeRisparmio > 0 ? `${risultato.percentualeRisparmio}% vs causa` : "causa meno costosa"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Confronto CAM vs Medyapro — card dedicata */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 bg-gradient-to-r from-amber-50/60 to-orange-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  Confronto diretto: CAM vs Medyapro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-foreground">
                        <th className="text-left py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Voce</th>
                        <th className="text-right py-2 px-3 font-bold text-amber-800 bg-amber-50">CAM</th>
                        <th className="text-right py-2 px-3 font-bold text-orange-800 bg-orange-50">{medyaproLabel}</th>
                        <th className="text-right py-2 px-3 font-bold text-foreground/60 bg-muted/30">Differenza</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {[
                        { label: "Spese amm. (per parte)", cam: risultato.costiArbitrato.onorariCAM, med: risultatoMedyapro.costiArbitrato.onorariCAM },
                        { label: "Onorari arbitro (netto IVA)", cam: risultato.costiArbitrato.onorariArbitro, med: risultatoMedyapro.costiArbitrato.onorariArbitro },
                        { label: "IVA 22% onorari arbitro", cam: risultato.costiArbitrato.ivaArbitro, med: risultatoMedyapro.costiArbitrato.ivaArbitro },
                        { label: "Compenso avvocato", cam: risultato.costiArbitrato.compensoAvvocato, med: risultatoMedyapro.costiArbitrato.compensoAvvocato },
                        { label: "Spese gen. 15% + CPA + IVA avv.", cam: risultato.costiArbitrato.speseGenerali15 + risultato.costiArbitrato.cpa4Avvocato + risultato.costiArbitrato.iva22Avvocato, med: risultatoMedyapro.costiArbitrato.speseGenerali15 + risultatoMedyapro.costiArbitrato.cpa4Avvocato + risultatoMedyapro.costiArbitrato.iva22Avvocato },
                        { label: "Bollo + CTU + Registro lodo", cam: risultato.costiArbitrato.bollo + risultato.costiArbitrato.stimaCTU + risultato.costiArbitrato.impostaRegistroLodo, med: risultatoMedyapro.costiArbitrato.bollo + risultatoMedyapro.costiArbitrato.stimaCTU + risultatoMedyapro.costiArbitrato.impostaRegistroLodo },
                      ].map(({ label, cam, med }) => (
                        <tr key={label} className="border-b border-foreground/10">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{label}</td>
                          <td className="text-right py-2 px-3 bg-amber-50/50">{formatEuro(cam)}</td>
                          <td className="text-right py-2 px-3 bg-orange-50/50">{formatEuro(med)}</td>
                          <td className={`text-right py-2 px-3 bg-muted/20 text-xs ${med - cam > 0 ? "text-red-600" : med - cam < 0 ? "text-green-600" : "text-muted-foreground"}`}>
                            {med - cam === 0 ? "—" : `${med - cam > 0 ? "+" : ""}${formatEuro(med - cam)}`}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-foreground font-bold text-base">
                        <td className="py-3 px-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTALE per parte</td>
                        <td className="text-right py-3 px-3 bg-amber-100 text-amber-900">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                        <td className="text-right py-3 px-3 bg-orange-100 text-orange-900">{formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte)}</td>
                        <td className={`text-right py-3 px-3 bg-muted/30 text-sm font-bold ${risultatoMedyapro.costiArbitrato.totalePerParte - risultato.costiArbitrato.totalePerParte > 0 ? "text-red-600" : "text-green-600"}`}>
                          {risultatoMedyapro.costiArbitrato.totalePerParte - risultato.costiArbitrato.totalePerParte === 0 ? "—" : `${risultatoMedyapro.costiArbitrato.totalePerParte - risultato.costiArbitrato.totalePerParte > 0 ? "+" : ""}${formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte - risultato.costiArbitrato.totalePerParte)}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  CAM: tariffe dal 1 marzo 2023, arbitro unico (valori medi min/max). {risultatoMedyapro.costiArbitrato.noteCalcolo}
                </p>
              </CardContent>
            </Card>

            {/* Gradi successivi */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 bg-gradient-to-r from-red-50/50 to-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Landmark className="w-5 h-5 text-red-700" />
                  Costi Gradi Successivi di Giudizio
                </CardTitle>
                <p className="text-xs text-muted-foreground">In caso di impugnazione i costi si moltiplicano. Mediazione e arbitrato evitano tutti i gradi.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-white border-2 border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Gavel className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Corte d'Appello</span>
                    </div>
                    <div className="text-xl font-bold text-red-800 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatEuro(risultato.costiAppello.totalePerParte)}</div>
                    <p className="text-xs text-red-600 mt-1">per parte — {risultato.costiAppello.durataStimata}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>CU +50%</span><span className="font-mono">{formatEuro(risultato.costiAppello.contributoUnificato)}</span></div>
                      <div className="flex justify-between"><span>Compenso avv. (Tab. 12)</span><span className="font-mono">{formatEuro(risultato.costiAppello.compensoAvvocato)}</span></div>
                      {risultato.costiAppello.stimaCTU > 0 && <div className="flex justify-between"><span>Stima CTU</span><span className="font-mono">{formatEuro(risultato.costiAppello.stimaCTU)}</span></div>}
                    </div>
                  </div>
                  <div className="p-4 bg-white border-2 border-red-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Landmark className="w-4 h-4 text-red-700" />
                      <span className="text-sm font-bold text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Corte di Cassazione</span>
                    </div>
                    <div className="text-xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatEuro(risultato.costiCassazione.totalePerParte)}</div>
                    <p className="text-xs text-red-600 mt-1">per parte — {risultato.costiCassazione.durataStimata}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>CU raddoppiato</span><span className="font-mono">{formatEuro(risultato.costiCassazione.contributoUnificato)}</span></div>
                      <div className="flex justify-between"><span>Compenso avv. (Tab. 13)</span><span className="font-mono">{formatEuro(risultato.costiCassazione.compensoAvvocato)}</span></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">No CTU (giudizio di legittimità)</p>
                  </div>
                  <div className="p-4 bg-red-100 border-2 border-red-400">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-800" />
                      <span className="text-sm font-bold text-red-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Totale 3 Gradi</span>
                    </div>
                    <div className="text-xl font-bold text-red-900 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatEuro(risultato.totaleCausaTreGradi)}</div>
                    <p className="text-xs text-red-700 mt-1">per parte — 6-12 anni</p>
                    <div className="mt-3 pt-3 border-t border-red-300">
                      <div className="text-xs font-bold text-green-800 mb-1">Risparmio con mediazione:</div>
                      <div className="text-lg font-bold text-green-800 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatEuro(risultato.risparmioMediazioneTreGradi)}</div>
                      <p className="text-xs text-green-700">{risultato.percentualeRisparmioTreGradi}% vs tre gradi</p>
                    </div>
                  </div>
                </div>

                {/* Riepilogo progressivo con 4 colonne */}
                <div className="bg-white border-2 border-foreground p-4">
                  <div className="text-sm font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Riepilogo costi per parte</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-foreground">
                          <th className="text-left py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Procedura</th>
                          <th className="text-right py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Totale per parte</th>
                          <th className="text-right py-2 px-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Durata</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <tr className="bg-green-100 border-b border-foreground/10">
                          <td className="py-2 px-3 font-bold text-green-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mediazione</td>
                          <td className="text-right py-2 px-3 text-green-900 font-bold">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.durataMediaStimata.mediazione}</td>
                        </tr>
                        <tr className="bg-amber-50 border-b border-foreground/10">
                          <td className="py-2 px-3 font-bold text-amber-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arbitrato CAM</td>
                          <td className="text-right py-2 px-3 text-amber-900 font-bold">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.costiArbitrato.durataStimata}</td>
                        </tr>
                        <tr className="bg-orange-50 border-b border-foreground/10">
                          <td className="py-2 px-3 font-bold text-orange-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{medyaproLabel}</td>
                          <td className="text-right py-2 px-3 text-orange-900 font-bold">{formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultatoMedyapro.costiArbitrato.durataStimata}</td>
                        </tr>
                        <tr className="bg-red-50/50 border-b border-foreground/10">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>I grado (Tribunale)</td>
                          <td className="text-right py-2 px-3">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">{risultato.durataMediaStimata.causaCivile}</td>
                        </tr>
                        <tr className="bg-red-50/70 border-b border-foreground/10">
                          <td className="py-2 px-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>I + II grado</td>
                          <td className="text-right py-2 px-3">{formatEuro(risultato.costiCausaCivile.totalePerParte + risultato.costiAppello.totalePerParte)}</td>
                          <td className="text-right py-2 px-3 text-xs">+{risultato.durataMediaStimata.appello}</td>
                        </tr>
                        <tr className="bg-red-100 border-t-2 border-foreground font-bold">
                          <td className="py-3 px-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTALE 3 GRADI</td>
                          <td className="text-right py-3 px-3 text-red-900">{formatEuro(risultato.totaleCausaTreGradi)}</td>
                          <td className="text-right py-3 px-3 text-xs">6-12 anni</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grafico con 5 barre */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
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
                      { name: "Mediazione", "Costi totali": Math.round(risultato.costiMediazione.totaleNettoPerParte) },
                      { name: "CAM", "Costi totali": Math.round(risultato.costiArbitrato.totalePerParte) },
                      { name: medyaproLabel, "Costi totali": Math.round(risultatoMedyapro.costiArbitrato.totalePerParte) },
                      { name: "I grado", "Costi totali": Math.round(risultato.costiCausaCivile.totalePerParte) },
                      { name: "I+II+III", "Costi totali": Math.round(risultato.totaleCausaTreGradi) },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barGap={4} barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e0db" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "'Space Grotesk', sans-serif", fill: "#2d2926" }} axisLine={{ stroke: "#2d2926", strokeWidth: 2 }} tickLine={{ stroke: "#2d2926" }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#2d2926" }} axisLine={{ stroke: "#2d2926", strokeWidth: 2 }} tickLine={{ stroke: "#2d2926" }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip formatter={(v: number) => formatEuro(v)} contentStyle={{ border: "2px solid #2d2926", borderRadius: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }} labelStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} />
                    <Bar dataKey="Costi totali" stroke="#2d2926" strokeWidth={2} radius={0}>
                      <Cell fill="#16a34a" />
                      <Cell fill="#d97706" />
                      <Cell fill="#ea580c" />
                      <Cell fill="#dc2626" />
                      <Cell fill="#991b1b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Mediazione: 1-6 mesi. CAM: {risultato.costiArbitrato.durataStimata}. {medyaproLabel}: {risultatoMedyapro.costiArbitrato.durataStimata}. Causa civile su 3 gradi: fino a 12 anni.
                </p>
              </CardContent>
            </Card>

            {/* Imposte immobiliari */}
            {risultato.costiMediazione.imposteImmobiliari && (
              <div className="bg-blue-50 border-2 border-blue-200 p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-800 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Imposte Trasferimento Immobiliare {risultato.costiMediazione.imposteImmobiliari.isPrimaCasa ? "(Prima Casa)" : "(Seconda Casa)"}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><span className="text-blue-600 text-xs">Registro ({risultato.costiMediazione.imposteImmobiliari.aliquotaRegistro})</span><div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaRegistro)}</div></div>
                      <div><span className="text-blue-600 text-xs">Ipotecaria</span><div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaIpotecaria)}</div></div>
                      <div><span className="text-blue-600 text-xs">Catastale</span><div className="font-bold font-mono text-blue-900">{formatEuro(risultato.costiMediazione.imposteImmobiliari.impostaCatastale)}</div></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">{risultato.costiMediazione.imposteImmobiliari.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Durata + Gratuito Patrocinio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Durata Media Stimata</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                      { val: risultato.durataMediaStimata.mediazione, label: "Mediazione", cls: "bg-green-50 border-green-200 text-green-800" },
                      { val: risultato.costiArbitrato.durataStimata, label: "CAM", cls: "bg-amber-50 border-amber-200 text-amber-800" },
                      { val: risultatoMedyapro.costiArbitrato.durataStimata, label: medyaproLabel, cls: "bg-orange-50 border-orange-200 text-orange-800" },
                      { val: risultato.durataMediaStimata.causaCivile, label: "I grado", cls: "bg-red-50 border-red-200 text-red-800" },
                      { val: risultato.durataMediaStimata.appello, label: "Appello", cls: "bg-red-100 border-red-300 text-red-900" },
                    ].map(({ val, label, cls }) => (
                      <div key={label} className={`text-center p-2 border-2 ${cls}`}>
                        <div className="text-sm font-bold font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
                        <div className="text-xs leading-tight mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${gratuitoPatrocinio ? "border-green-600 bg-green-50" : "border-foreground"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className={`w-5 h-5 ${gratuitoPatrocinio ? "text-green-700" : "text-primary"}`} />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Gratuito Patrocinio</span>
                    {gratuitoPatrocinio && <Badge className="bg-green-100 text-green-800 border-green-300 border ml-auto">ATTIVO</Badge>}
                  </div>
                  {gratuitoPatrocinio ? (
                    <div className="space-y-1 text-xs text-green-700">
                      <p>- Indennità organismo mediazione: a carico dell'erario</p>
                      <p>- Compenso avvocato: a carico dell'erario</p>
                      <p>- Contributo unificato: prenotato a debito</p>
                      <p>- CTU: prenotata a debito</p>
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

            {/* Dettaglio a tabs */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dettaglio Costi per Parte</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs">
                    {showDetails ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    {showDetails ? "Nascondi" : "Mostra dettaglio"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="confronto">
                  <TabsList className="flex flex-wrap gap-1 h-auto bg-muted border-2 border-foreground p-1 mb-4">
                    <TabsTrigger value="confronto" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Confronto</TabsTrigger>
                    <TabsTrigger value="mediazione" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Mediazione</TabsTrigger>
                    <TabsTrigger value="causa" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">I Grado</TabsTrigger>
                    <TabsTrigger value="appello" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Appello</TabsTrigger>
                    <TabsTrigger value="cam" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">CAM</TabsTrigger>
                    <TabsTrigger value="medyapro" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Medyapro</TabsTrigger>
                    <TabsTrigger value="cassazione" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Cassazione</TabsTrigger>
                  </TabsList>

                  <TabsContent value="confronto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-foreground">
                            <th className="text-left py-2 px-2 font-bold text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Voce</th>
                            <th className="text-right py-2 px-2 font-bold text-xs text-green-800 bg-green-50">Mediazione</th>
                            <th className="text-right py-2 px-2 font-bold text-xs text-amber-800 bg-amber-50">CAM</th>
                            <th className="text-right py-2 px-2 font-bold text-xs text-orange-800 bg-orange-50">{medyaproLabel}</th>
                            <th className="text-right py-2 px-2 font-bold text-xs text-red-800 bg-red-50">Causa</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {[
                            { label: "Spese avvio/C.U./Spese amm.", med: risultato.costiMediazione.indennitaOrganismo, cam: risultato.costiArbitrato.onorariCAM, medy: risultatoMedyapro.costiArbitrato.onorariCAM, causa: risultato.costiCausaCivile.contributoUnificato + risultato.costiCausaCivile.marcaDaBollo + risultato.costiCausaCivile.dirittoCopia },
                            { label: "Onorari arbitro + IVA", med: 0, cam: risultato.costiArbitrato.onorariArbitro + risultato.costiArbitrato.ivaArbitro, medy: risultatoMedyapro.costiArbitrato.onorariArbitro + risultatoMedyapro.costiArbitrato.ivaArbitro, causa: 0 },
                            { label: "Compenso avvocato", med: risultato.costiMediazione.compensoAvvocato, cam: risultato.costiArbitrato.compensoAvvocato, medy: risultatoMedyapro.costiArbitrato.compensoAvvocato, causa: risultato.costiCausaCivile.compensoAvvocato },
                            { label: "Spese gen. + CPA + IVA avv.", med: risultato.costiMediazione.speseGenerali15 + risultato.costiMediazione.cpa4Avvocato + risultato.costiMediazione.iva22Avvocato, cam: risultato.costiArbitrato.speseGenerali15 + risultato.costiArbitrato.cpa4Avvocato + risultato.costiArbitrato.iva22Avvocato, medy: risultatoMedyapro.costiArbitrato.speseGenerali15 + risultatoMedyapro.costiArbitrato.cpa4Avvocato + risultatoMedyapro.costiArbitrato.iva22Avvocato, causa: risultato.costiCausaCivile.speseGenerali15 + risultato.costiCausaCivile.cpa4Avvocato + risultato.costiCausaCivile.iva22Avvocato },
                            { label: "Registro / Bollo / CTU", med: risultato.costiMediazione.impostaRegistro + risultato.costiMediazione.costoNotaio, cam: risultato.costiArbitrato.bollo + risultato.costiArbitrato.stimaCTU + risultato.costiArbitrato.impostaRegistroLodo, medy: risultatoMedyapro.costiArbitrato.bollo + risultatoMedyapro.costiArbitrato.stimaCTU + risultatoMedyapro.costiArbitrato.impostaRegistroLodo, causa: risultato.costiCausaCivile.impostaRegistroSentenza + risultato.costiCausaCivile.stimaCTU },
                          ].map(({ label, med, cam, medy, causa }) => (
                            <tr key={label} className="border-b border-foreground/10">
                              <td className="py-2 px-2" style={{ fontFamily: "Inter, sans-serif" }}>{label}</td>
                              <td className="text-right py-2 px-2 bg-green-50/50">{med > 0 ? formatEuro(med) : "—"}</td>
                              <td className="text-right py-2 px-2 bg-amber-50/50">{cam > 0 ? formatEuro(cam) : "—"}</td>
                              <td className="text-right py-2 px-2 bg-orange-50/50">{medy > 0 ? formatEuro(medy) : "—"}</td>
                              <td className="text-right py-2 px-2 bg-red-50/50">{causa > 0 ? formatEuro(causa) : "—"}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-foreground font-bold text-sm">
                            <td className="py-3 px-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TOTALE</td>
                            <td className="text-right py-3 px-2 bg-green-100 text-green-900">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</td>
                            <td className="text-right py-3 px-2 bg-amber-100 text-amber-900">{formatEuro(risultato.costiArbitrato.totalePerParte)}</td>
                            <td className="text-right py-3 px-2 bg-orange-100 text-orange-900">{formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte)}</td>
                            <td className="text-right py-3 px-2 bg-red-100 text-red-900">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="mediazione">
                    <div className="space-y-3">
                      <DetailItem label="Spese avvio organismo" value={risultato.costiMediazione.speseAvvio} note={modalitaTariffaria === "coa_genova" ? "Tariffe COA Genova" : "D.M. 150/2023 — Tabella A"} />
                      <DetailItem label="Indennità organismo mediazione" value={risultato.costiMediazione.indennitaOrganismo - risultato.costiMediazione.speseAvvio} note={tipoMediazione !== "volontaria" ? `Ridotta del 20% per mediazione ${tipoMediazione}` : "Mediazione volontaria — tariffe piene"} />
                      <DetailItem label="Compenso avvocato (parametri stragiudiziali)" value={risultato.costiMediazione.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Fasi: attivazione (+30%), negoziazione (+30%), conciliazione" />
                      <DetailItem label="Spese generali 15%" value={risultato.costiMediazione.speseGenerali15} note="15% sul compenso" />
                      <DetailItem label="CPA 4%" value={risultato.costiMediazione.cpa4Avvocato} note="4% su compenso + spese generali" />
                      <DetailItem label="IVA 22%" value={risultato.costiMediazione.iva22Avvocato} note="22% su compenso + spese generali + CPA" />
                      <DetailItem label="Imposta di registro" value={risultato.costiMediazione.impostaRegistro} note={risultato.costiMediazione.impostaRegistro === 0 ? "ESENTE — valore ≤ €100.000 (art. 17 D.Lgs. 28/2010)" : "3% sulla parte eccedente €100.000"} highlight={risultato.costiMediazione.impostaRegistro === 0} />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold">Totale</span><span className="font-bold font-mono">{formatEuro(risultato.costiMediazione.totalePerParte)}</span></div>
                      <div className="flex justify-between text-green-700"><span className="text-sm">Credito d'imposta</span><span className="font-mono text-sm">-{formatEuro(risultato.costiMediazione.creditoImposta)}</span></div>
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-green-800">Totale netto</span><span className="font-bold font-mono text-green-800">{formatEuro(risultato.costiMediazione.totaleNettoPerParte)}</span></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="causa">
                    <div className="space-y-3">
                      <DetailItem label="Contributo unificato" value={risultato.costiCausaCivile.contributoUnificato} note="D.P.R. 115/2002, art. 13" />
                      <DetailItem label="Marca da bollo + diritti copia" value={risultato.costiCausaCivile.marcaDaBollo + risultato.costiCausaCivile.dirittoCopia} note="€27 iscrizione ruolo + €30 forfettario copie" />
                      <DetailItem label="Compenso avvocato (Tab. 2)" value={risultato.costiCausaCivile.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese gen. + CPA + IVA" value={risultato.costiCausaCivile.speseGenerali15 + risultato.costiCausaCivile.cpa4Avvocato + risultato.costiCausaCivile.iva22Avvocato} note="15% spese generali + 4% CPA + 22% IVA" />
                      <DetailItem label="Imposta di registro sentenza" value={risultato.costiCausaCivile.impostaRegistroSentenza} note="3% sul valore della condanna (art. 8 lett. b Tariffa DPR 131/1986)" />
                      <DetailItem label="Stima CTU" value={risultato.costiCausaCivile.stimaCTU} note="Stima indicativa (variabile per materia)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-red-800">Totale I grado</span><span className="font-bold font-mono text-red-800">{formatEuro(risultato.costiCausaCivile.totalePerParte)}</span></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appello">
                    <div className="space-y-3">
                      <DetailItem label="Contributo unificato (+50%)" value={risultato.costiAppello.contributoUnificato} note="Art. 13 D.P.R. 115/2002" />
                      <DetailItem label="Compenso avvocato (Tab. 12)" value={risultato.costiAppello.compensoAvvocato} note="D.M. 55/2014 mod. D.M. 147/2022 — Tab. 12" />
                      <DetailItem label="Spese gen. + CPA + IVA" value={risultato.costiAppello.speseGenerali15 + risultato.costiAppello.cpa4Avvocato + risultato.costiAppello.iva22Avvocato} note="15% + 4% + 22%" />
                      <DetailItem label="Stima CTU" value={risultato.costiAppello.stimaCTU} note="Eventuale rinnovo CTU (art. 356 c.p.c.)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-red-800">Totale Appello</span><span className="font-bold font-mono text-red-800">{formatEuro(risultato.costiAppello.totalePerParte)}</span></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cam">
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 p-3 mb-2">
                        <p className="text-xs text-amber-800 font-semibold">CAM — Camera Arbitrale di Milano. Tariffe dal 1 marzo 2023. Arbitro unico (valori medi).</p>
                      </div>
                      <DetailItem label="Diritti amministrativi CAM (per parte)" value={risultato.costiArbitrato.onorariCAM} note="Esenti IVA" />
                      <DetailItem label="Onorari arbitro unico (media min/max, per parte)" value={risultato.costiArbitrato.onorariArbitro} note="Quota per parte = totale / 2" />
                      <DetailItem label="IVA 22% onorari arbitro" value={risultato.costiArbitrato.ivaArbitro} note="IVA 22% sugli onorari dell'arbitro" />
                      <DetailItem label="Compenso avvocato (Tab. 2)" value={risultato.costiArbitrato.compensoAvvocato} note="D.M. 55/2014 — studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese gen. + CPA + IVA avv." value={risultato.costiArbitrato.speseGenerali15 + risultato.costiArbitrato.cpa4Avvocato + risultato.costiArbitrato.iva22Avvocato} note="15% + 4% + 22%" />
                      <DetailItem label="Bollo" value={risultato.costiArbitrato.bollo} note="Stima €150 forfettario (DPR 642/1972)" />
                      <DetailItem label="Stima CTU" value={risultato.costiArbitrato.stimaCTU} note="Variabile per materia" />
                      <DetailItem label="Imposta di registro sul lodo" value={risultato.costiArbitrato.impostaRegistroLodo} note="3% (art. 8 Tariffa DPR 131/1986 — lodo ha efficacia di sentenza ex art. 824-bis c.p.c.)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-amber-800">Totale CAM</span><span className="font-bold font-mono text-amber-800">{formatEuro(risultato.costiArbitrato.totalePerParte)}</span></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medyapro">
                    <div className="space-y-3">
                      <div className="bg-orange-50 border border-orange-200 p-3 mb-2">
                        <p className="text-xs text-orange-800 font-semibold">{risultatoMedyapro.costiArbitrato.nomeIstituzione}</p>
                        <p className="text-xs text-orange-700 mt-1">{risultatoMedyapro.costiArbitrato.tipoArbitro} — Durata: {risultatoMedyapro.costiArbitrato.durataStimata}</p>
                      </div>
                      <DetailItem label="Spese amministrative (per parte)" value={risultatoMedyapro.costiArbitrato.onorariCAM} note="Versate da ciascuna parte al deposito dell'istanza di arbitrato o di nomina dell'arbitro" />
                      <DetailItem label="Onorari arbitro/collegio (media min/max, per parte)" value={risultatoMedyapro.costiArbitrato.onorariArbitro} note="Quota per parte = totale / 2. Liquidati dal direttivo ex art. 32 del Regolamento." />
                      <DetailItem label="IVA 22% onorari arbitro" value={risultatoMedyapro.costiArbitrato.ivaArbitro} note="IVA 22% sugli onorari dell'arbitro/collegio" />
                      <DetailItem label="Compenso avvocato (Tab. 2)" value={risultatoMedyapro.costiArbitrato.compensoAvvocato} note="D.M. 55/2014 — studio + introduttiva + istruttoria + decisionale" />
                      <DetailItem label="Spese gen. + CPA + IVA avv." value={risultatoMedyapro.costiArbitrato.speseGenerali15 + risultatoMedyapro.costiArbitrato.cpa4Avvocato + risultatoMedyapro.costiArbitrato.iva22Avvocato} note="15% + 4% + 22%" />
                      <DetailItem label="Bollo" value={risultatoMedyapro.costiArbitrato.bollo} note="Imposta di bollo su tutti gli atti e provvedimenti del procedimento (art. 33 Regolamento)" />
                      <DetailItem label="Stima CTU" value={risultatoMedyapro.costiArbitrato.stimaCTU} note="Costi CTU determinati su base tabelle giudiziali (art. 23.5 Regolamento)" />
                      <DetailItem label="Imposta di registro sul lodo" value={risultatoMedyapro.costiArbitrato.impostaRegistroLodo} note="3% (art. 8 Tariffa DPR 131/1986)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-orange-800">Totale Medyapro</span><span className="font-bold font-mono text-orange-800">{formatEuro(risultatoMedyapro.costiArbitrato.totalePerParte)}</span></div>
                      <p className="text-xs text-muted-foreground italic">Pagamento: IBAN IT77X0503411716000000007462 — Banco Popolare di Verona — intestato a MedyaPro Srl. Causale: numero procedura e nome parte.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="cassazione">
                    <div className="space-y-3">
                      <DetailItem label="Contributo unificato (raddoppiato)" value={risultato.costiCassazione.contributoUnificato} note="Art. 13 D.P.R. 115/2002" />
                      <DetailItem label="Compenso avvocato (Tab. 13)" value={risultato.costiCassazione.compensoAvvocato} note="D.M. 55/2014 — Tab. 13: studio + introduttiva + decisionale (no istruttoria)" />
                      <DetailItem label="Spese gen. + CPA + IVA" value={risultato.costiCassazione.speseGenerali15 + risultato.costiCassazione.cpa4Avvocato + risultato.costiCassazione.iva22Avvocato} note="15% + 4% + 22%" />
                      <DetailItem label="CTU" value={0} note="Non prevista (giudizio di legittimità)" />
                      <div className="border-t-2 border-foreground pt-3 flex justify-between"><span className="font-bold text-red-800">Totale Cassazione</span><span className="font-bold font-mono text-red-800">{formatEuro(risultato.costiCassazione.totalePerParte)}</span></div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Vantaggi Fiscali */}
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <FileText className="w-5 h-5 text-primary" />
                    Vantaggi Fiscali della Mediazione
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowVantaggi(!showVantaggi)} className="text-xs">
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
            <div className="text-xs text-muted-foreground bg-muted/50 p-4 border border-foreground/10 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Criteri di calcolo e avvertenza legale</p>
                  <p className="mb-2"><strong>Compensi avvocato:</strong> calcolati sui valori medi D.M. 55/2014 (agg. D.M. 147/2022). Il compenso effettivo può variare dal -50% al +100% in base a complessità, urgenza e risultati (art. 4 D.M. 55/2014).</p>
                  <p className="mb-2"><strong>Arbitrato CAM:</strong> tariffe Camera Arbitrale di Milano dal 1 marzo 2023. Arbitro unico, valori medi min/max. Onorari CAM esenti IVA; IVA 22% sugli onorari dell'arbitro. Il lodo ha efficacia di sentenza (art. 824-bis c.p.c.).</p>
                  <p className="mb-2"><strong>Arbitrato Medyapro:</strong> tariffe Camera Arbitrale Medyapro Srl (Regolamento approvato 14 novembre 2022). Spese amministrative versate da ciascuna parte al deposito. Compensi arbitro/collegio calcolati come media tra minimo e massimo tariffario per scaglione, quota per parte = totale / 2. Compensi liquidati dal direttivo ex art. 32 Regolamento. Si applica l'imposta di bollo su tutti gli atti (art. 28.2 Regolamento). CTU determinata su tabelle giudiziali (art. 23.5 Regolamento).</p>
                  <p><strong>Avvertenza:</strong> tutti i calcoli hanno finalità esclusivamente informativa e orientativa. Non costituiscono consulenza legale né preventivo vincolante.</p>
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
