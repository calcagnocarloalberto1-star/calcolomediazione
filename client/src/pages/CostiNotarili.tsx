import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Building2, Calculator, Info, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  confrontaNotarile,
  type RegimeFiscale,
  type TipologiaCatastale,
} from "@shared/notarile";
import { ExportButtons } from "@/components/ExportButtons";
import { SeoHead } from "@/components/SeoHead";
import { DisclaimerLegale } from "@/components/DisclaimerLegale";
import type { ReportData } from "@/lib/export-risultati";

function fmtEuro(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
}

// --- BUILDER REPORT EXPORT ---
type ConfrontaResult = ReturnType<typeof confrontaNotarile>;
function buildReportNotarile(
  confronto: ConfrontaResult,
  params: {
    prezzo: number;
    regime: RegimeFiscale;
    tipologia: TipologiaCatastale;
    usaPrezzoValore: boolean;
    rendita: number;
    venditoreImpresaIva: boolean;
  }
): ReportData {
  const fmt = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n || 0));
  const m = confronto.con_mediazione.voci;
  const s = confronto.con_sentenza.voci;
  const regimeLabel = params.regime === "prima_casa" ? "Prima casa (registro 2%)" : "Seconda casa / altro (registro 9%)";
  const tipologiaLabel: Record<TipologiaCatastale, string> = {
    prima_casa: "Prima casa (coeff. 115,5)",
    seconda_casa: "Seconda casa (coeff. 126)",
    terreni_non_edificabili: "Terreni non edificabili (coeff. 112,5)",
    fabbricati_C_A10: "Fabbricati C/A10 (coeff. 63)",
    fabbricati_D_E: "Fabbricati D/E (coeff. 65,52)",
  };

  const parametri = [
    { label: "Prezzo / valore dichiarato", value: fmt(params.prezzo) },
    { label: "Regime fiscale", value: regimeLabel },
    { label: "Metodo base imponibile", value: params.usaPrezzoValore ? "Prezzo-valore (rendita rivalutata * coeff.)" : "Prezzo dichiarato" },
    { label: "Tipologia catastale", value: tipologiaLabel[params.tipologia] },
    { label: "Cessione da impresa con IVA", value: params.venditoreImpresaIva ? "Si" : "No" },
    { label: "Base imponibile calcolata", value: fmt(confronto.base) },
  ];
  if (params.usaPrezzoValore && params.rendita > 0) {
    parametri.splice(3, 0, { label: "Rendita catastale", value: fmt(params.rendita) });
  }

  const buildVoci = (v: typeof m) => {
    const rows: { label: string; value: string; bold?: boolean }[] = [
      { label: "Imposta di registro", value: fmt(v.imposta_registro || 0) },
      { label: "Imposta di bollo", value: fmt(v.imposta_bollo || 0) },
      { label: "Imposta ipotecaria", value: fmt(v.imposta_ipotecaria || 0) },
      { label: "Imposta catastale", value: fmt(v.imposta_catastale || 0) },
    ];
    if (params.venditoreImpresaIva) rows.push({ label: "IVA su atto", value: fmt(v.iva || 0) });
    rows.push(
      { label: "Onorario notaio (stima)", value: fmt(v.onorario_notaio || 0) },
      { label: "IVA 22% su onorario", value: fmt(v.iva_onorario || 0) },
      { label: "Cassa Notariato 4%", value: fmt(v.cassa_notarile || 0) },
      { label: "Visure e volture", value: fmt(v.visure_volture || 0) }
    );
    return rows;
  };

  const mediazioneRows = buildVoci(m);
  mediazioneRows.push({ label: "Totale stimato in mediazione", value: fmt(confronto.con_mediazione.totale), bold: true });
  const sentenzaRows = buildVoci(s);
  sentenzaRows.push({ label: "Totale stimato in sentenza", value: fmt(confronto.con_sentenza.totale), bold: true });

  const riepilogoRows = [
    { label: "Totale costi - Accordo in mediazione", value: fmt(confronto.con_mediazione.totale), bold: true },
    { label: "Totale costi - Sentenza del giudice", value: fmt(confronto.con_sentenza.totale), bold: true },
    { label: "Risparmio mediazione", value: fmt(confronto.risparmio), bold: true },
  ];

  const footerNotes = [
    `Mediazione: ${confronto.con_mediazione.note.join(" ; ")}`,
    `Sentenza: ${confronto.con_sentenza.note.join(" ; ")}`,
    confronto.disclaimer,
  ];

  return {
    title: "Stima Costi Notarili",
    subtitle: `${regimeLabel} - Base imponibile: ${fmt(confronto.base)}`,
    sections: [
      { title: "Parametri della stima", rows: parametri },
      { title: "Riepilogo confronto", rows: riepilogoRows },
      { title: "Accordo in mediazione - dettaglio", rows: mediazioneRows },
      { title: "Sentenza del giudice - dettaglio", rows: sentenzaRows },
    ],
    footerNotes,
    fileName: `costi-notarili-${Date.now()}`,
  };
}

export default function CostiNotarili() {
  const [regime, setRegime] = useState<RegimeFiscale>("prima_casa");
  const [tipologia, setTipologia] = useState<TipologiaCatastale>("prima_casa");
  const [prezzoStr, setPrezzoStr] = useState("150000");
  const [usaPrezzoValore, setUsaPrezzoValore] = useState(false);
  const [renditaStr, setRenditaStr] = useState("");
  const [venditoreImpresaIva, setVenditoreImpresaIva] = useState(false);

  const prezzo = parseFloat(prezzoStr) || 0;
  const rendita = parseFloat(renditaStr) || 0;

  const confronto = useMemo(() => {
    return confrontaNotarile({
      prezzo,
      prezzo_valore: usaPrezzoValore,
      rendita_catastale: rendita || null,
      tipologia,
      regime,
      venditoreImpresaIva,
    });
  }, [prezzo, usaPrezzoValore, rendita, tipologia, regime, venditoreImpresaIva]);

  const m = confronto.con_mediazione.voci;
  const s = confronto.con_sentenza.voci;

  return (
    <div className="min-h-screen py-8 px-4">
      <SeoHead
        title="Calcola Costi Notarili Mediazione · CalcoloMediazione"
        description="Calcola i costi notarili per accordo di mediazione o sentenza: onorari, imposta di registro, ipotecaria, catastale e IVA. Esenzione art. 17 D.Lgs. 28/2010."
        canonical="https://calcolomediazione.it/costi-notarili"
      />
      {/* FAQPage schema.org - boost SERP visibility con FAQ rich result */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Quali sono i costi notarili per un accordo di mediazione?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Per un trasferimento immobiliare in mediazione si stimano: onorario del notaio (variabile in funzione del valore), visure ipocatastali, IVA al 22% e cassa nazionale del notariato al 4%. Si aggiungono le imposte di registro, ipotecaria e catastale, salvo applicazione dell'esenzione prevista dall'art. 17 del D.Lgs. 28/2010.",
                },
              },
              {
                "@type": "Question",
                name: "Cosa prevede l'art. 17 D.Lgs. 28/2010 sull'esenzione fiscale dell'accordo di mediazione?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "L'art. 17 D.Lgs. 28/2010 prevede l'esenzione dall'imposta di registro entro il limite di valore di 100.000 euro per gli accordi conciliativi raggiunti in sede di mediazione. Oltre questa soglia, l'imposta si applica sulla sola parte eccedente.",
                },
              },
              {
                "@type": "Question",
                name: "Quanto si risparmia con la mediazione rispetto alla sentenza per i costi notarili?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Nell'accordo di mediazione si applica l'esenzione dell'imposta di registro entro 100.000 euro (art. 17 D.Lgs. 28/2010), che nella sentenza non opera. Per un immobile di 200.000 euro il risparmio sull'imposta di registro e' significativo, oltre alla riduzione dei tempi e dei compensi forensi.",
                },
              },
              {
                "@type": "Question",
                name: "L'agevolazione prima casa e' cumulabile con l'esenzione mediazione?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Si. L'agevolazione prima casa riduce l'imposta di registro al 2% (anziche' 9%) e si applica nell'accordo di mediazione in via residuale, sulla parte di valore eccedente la soglia di 100.000 euro dell'esenzione art. 17 D.Lgs. 28/2010.",
                },
              },
              {
                "@type": "Question",
                name: "Come si calcola la base imponibile dell'imposta di registro per un immobile?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Per gli immobili residenziali si applica il sistema del prezzo-valore: la base imponibile e' data dalla rendita catastale rivalutata moltiplicata per il coefficiente di legge (115,5 per prima casa, 126 per altri). Per immobili non residenziali si usa il valore venale dichiarato.",
                },
              },
            ],
          }),
        }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Costi Notarili: Stima e Confronto Mediazione vs Sentenza
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Stima dei puri costi notarili e fiscali per il trasferimento immobiliare,
            con confronto tra accordo di mediazione e sentenza del giudice.
            Motore unificato (shared/notarile.ts) — stessi numeri usati dall&apos;Analisi AI e dal Calcolatore.
          </p>

          {/* Blocco SEO con H2 strutturati per Google */}
          <section className="mt-6 mb-4 max-w-3xl text-sm space-y-4 border-l-4 border-foreground/10 pl-4">
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">
                Calcolo costi notarili: cosa include la stima
              </h2>
              <p className="text-muted-foreground">
                Il calcolatore copre tutte le voci che concorrono al costo finale di un atto di
                trasferimento immobiliare: onorario notarile (parametrato al valore dell&apos;immobile),
                cassa nazionale del notariato al 4%, IVA al 22%, visure ipocatastali e camerali,
                oltre alle imposte di registro, ipotecaria e catastale.
              </p>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">
                Esenzione fiscale dell&apos;accordo di mediazione (art. 17 D.Lgs. 28/2010)
              </h2>
              <p className="text-muted-foreground">
                Gli accordi conciliativi raggiunti in mediazione godono dell&apos;esenzione
                dell&apos;imposta di registro entro la soglia di 100.000 euro. Oltre, l&apos;imposta
                si applica sulla sola parte eccedente. Questa agevolazione, prevista anche dalla
                Riforma Cartabia (D.Lgs. 149/2022), non opera nella sentenza del giudice.
              </p>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">
                Prima casa: agevolazioni fiscali e imposta di registro ridotta
              </h2>
              <p className="text-muted-foreground">
                L&apos;agevolazione prima casa riduce l&apos;imposta di registro dal 9% al 2% sulla
                base imponibile catastale (rendita rivalutata x coefficiente 115,5).
                È cumulabile con l&apos;esenzione art. 17, applicandosi residualmente sull&apos;eccedenza.
              </p>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">
                Confronto pratico: accordo di mediazione vs sentenza
              </h2>
              <p className="text-muted-foreground">
                Il calcolatore evidenzia in chiaro la differenza economica tra i due scenari su
                un&apos;identica base immobiliare, includendo onorari notarili, imposte e
                differenze fiscali. Inserisci i dati qui sotto per ottenere la stima.
              </p>
            </div>
          </section>
        </div>

        {/* Input */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Parametri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prezzo">Prezzo / valore dichiarato (€)</Label>
                <Input
                  id="prezzo"
                  type="number"
                  min="0"
                  value={prezzoStr}
                  onChange={(e) => setPrezzoStr(e.target.value)}
                  className="border-2 border-foreground"
                />
              </div>
              <div>
                <Label htmlFor="regime">Regime fiscale</Label>
                <Select value={regime} onValueChange={(v) => setRegime(v as RegimeFiscale)}>
                  <SelectTrigger className="border-2 border-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prima_casa">Prima casa (registro 2%)</SelectItem>
                    <SelectItem value="seconda_casa">Seconda casa / altro (registro 9%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 border-2 border-foreground p-3 bg-muted/10">
                <Switch
                  checked={usaPrezzoValore}
                  onCheckedChange={setUsaPrezzoValore}
                />
                <div>
                  <Label className="cursor-pointer">Usa &quot;prezzo-valore&quot;</Label>
                  <p className="text-xs text-muted-foreground">
                    Art. 1 c. 497 L. 296/2006: base imponibile = rendita rivalutata × coefficiente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-2 border-foreground p-3 bg-muted/10">
                <Switch
                  checked={venditoreImpresaIva}
                  onCheckedChange={setVenditoreImpresaIva}
                />
                <div>
                  <Label className="cursor-pointer">Cessione da impresa con IVA</Label>
                  <p className="text-xs text-muted-foreground">
                    IVA 4%/10%, registro/ipo/catastale fissi €200
                  </p>
                </div>
              </div>
            </div>

            {usaPrezzoValore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rendita">Rendita catastale (€)</Label>
                  <Input
                    id="rendita"
                    type="number"
                    min="0"
                    value={renditaStr}
                    onChange={(e) => setRenditaStr(e.target.value)}
                    placeholder="es. 800"
                    className="border-2 border-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="tipologia">Tipologia catastale</Label>
                  <Select value={tipologia} onValueChange={(v) => setTipologia(v as TipologiaCatastale)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prima_casa">Prima casa (coeff. 115,5)</SelectItem>
                      <SelectItem value="seconda_casa">Seconda casa (coeff. 126)</SelectItem>
                      <SelectItem value="terreni_non_edificabili">Terreni non edificabili (coeff. 112,5)</SelectItem>
                      <SelectItem value="fabbricati_C_A10">Fabbricati C/A10 (coeff. 63)</SelectItem>
                      <SelectItem value="fabbricati_D_E">Fabbricati D/E (coeff. 65,52)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risultati: confronto a due colonne */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Confronto costi
              </span>
              <Badge variant="outline" className="font-mono">
                Base imponibile: {fmtEuro(confronto.base)}
              </Badge>
            </CardTitle>
            <div className="mt-3">
              <ExportButtons
                label="calcolo notarile"
                testIdPrefix="export-notarile"
                buildReport={() => buildReportNotarile(confronto, {
                  prezzo, regime, tipologia, usaPrezzoValore, rendita, venditoreImpresaIva,
                })}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border-2 border-foreground">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-muted/30">
                    <th className="text-left px-4 py-2 font-bold border-r-2 border-foreground">Voce</th>
                    <th className="text-right px-4 py-2 font-bold border-r-2 border-foreground">Accordo in mediazione</th>
                    <th className="text-right px-4 py-2 font-bold">Sentenza del giudice</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <Row label="Imposta di registro" mVal={m.imposta_registro} sVal={s.imposta_registro} />
                  <Row label="Imposta di bollo" mVal={m.imposta_bollo} sVal={s.imposta_bollo} alt />
                  <Row label="Imposta ipotecaria" mVal={m.imposta_ipotecaria} sVal={s.imposta_ipotecaria} />
                  <Row label="Imposta catastale" mVal={m.imposta_catastale} sVal={s.imposta_catastale} alt />
                  {venditoreImpresaIva && (
                    <Row label="IVA su atto" mVal={m.iva} sVal={s.iva} />
                  )}
                  <Row label="Onorario notaio (stima)" mVal={m.onorario_notaio} sVal={s.onorario_notaio} alt={!venditoreImpresaIva} />
                  <Row label="IVA 22% su onorario" mVal={m.iva_onorario} sVal={s.iva_onorario} alt={venditoreImpresaIva} />
                  <Row label="Cassa Notariato 4%" mVal={m.cassa_notarile} sVal={s.cassa_notarile} alt={!venditoreImpresaIva} />
                  <Row label="Visure e volture" mVal={m.visure_volture} sVal={s.visure_volture} alt={venditoreImpresaIva} />
                  <tr className="border-t-2 border-foreground bg-primary/10 font-bold">
                    <td className="px-4 py-2 border-r-2 border-foreground">Totale stimato</td>
                    <td className="px-4 py-2 text-right border-r-2 border-foreground">{fmtEuro(confronto.con_mediazione.totale)}</td>
                    <td className="px-4 py-2 text-right">{fmtEuro(confronto.con_sentenza.totale)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {confronto.risparmio > 0 && (
              <div className="mt-4 border-2 border-green-700 bg-green-50 dark:bg-green-950/20 p-4">
                <p className="text-sm font-bold text-green-800 dark:text-green-300">
                  Risparmio stimato con accordo in mediazione: {fmtEuro(confronto.risparmio)}
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Esenzione art. 17, co. 2-3, D.Lgs. 28/2010 + nessun contributo unificato + nessuna spesa di lite.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              Note di calcolo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Mediazione:</strong> {confronto.con_mediazione.note.join(" ; ")}
            </p>
            <p>
              <strong>Sentenza:</strong> {confronto.con_sentenza.note.join(" ; ")}
            </p>
            <div className="border-2 border-muted-foreground/30 bg-muted/10 p-3 mt-3">
              <p className="text-xs text-muted-foreground">
                {confronto.disclaimer}
              </p>
            </div>
          </CardContent>
        </Card>

        <DisclaimerLegale
          variant="full"
          riferimenti={["D.P.R. 131/1986", "D.M. 140/2012", "D.Lgs. 28/2010 art. 17", "L. 89/1913 (Legge Notarile)"]}
          noteSpecifiche="Le stime di costo notarile si basano sui parametri ministeriali del D.M. 140/2012 e sulle imposte indirette (registro/ipotecaria/catastale). Negli accordi di mediazione si applica l’esenzione art. 17 D.Lgs. 28/2010 fino al limite previsto."
          className="mb-6"
        />

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/calcolatore">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Calcolatore Indennità di Mediazione
            </span>
          </Link>
          <Link href="/confronto-costi">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Scale className="w-4 h-4" />
              Confronto costi mediazione vs giudizio
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, mVal, sVal, alt }: { label: string; mVal?: number; sVal?: number; alt?: boolean }) {
  return (
    <tr className={`border-b border-muted ${alt ? "bg-muted/10" : ""}`}>
      <td className="px-4 py-2 border-r-2 border-foreground font-sans">{label}</td>
      <td className="px-4 py-2 text-right border-r-2 border-foreground">{fmtEuro(mVal ?? 0)}</td>
      <td className="px-4 py-2 text-right">{fmtEuro(sVal ?? 0)}</td>
    </tr>
  );
}
