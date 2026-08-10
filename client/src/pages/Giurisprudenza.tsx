import { useState, useMemo } from "react";
import { Search, Scale, Filter, ChevronDown, ChevronUp, ExternalLink, BookOpen, X, Calendar, Building2, Tag, Hash, Link2 } from "lucide-react";
import { Link } from "wouter";
import { urlSentenza } from "@shared/sentenza-slug";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SeoHead } from "@/components/SeoHead";
import {
  sentenze,
  cercaSentenze,
  CATEGORIE,
  ORGANI_GIUDIZIARI,
  type Sentenza,
} from "@/data/giurisprudenza-db";

// Ricerca in linguaggio naturale sulla giurisprudenza (dati pubblici).
// Chiama /api/giurisprudenza/cerca-ai e mostra le pronunce più pertinenti
// con la motivazione. Nessun dato personale è coinvolto.
function RicercaAI() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [risultati, setRisultati] = useState<Array<{ id: number; motivo: string }> | null>(null);

  const cerca = async () => {
    const query = q.trim();
    if (query.length < 5) { setErrore("Descrivi la questione in almeno qualche parola."); return; }
    setLoading(true); setErrore(null); setRisultati(null);
    try {
      const res = await fetch("/api/giurisprudenza/cerca-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && data.error) ? data.error : "Errore del servizio di ricerca");
      setRisultati(Array.isArray(data.risultati) ? data.risultati : []);
    } catch (e: any) {
      setErrore((e && e.message) ? e.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-base">Ricerca AI — descrivi la questione a parole tue</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        Poni una domanda in linguaggio naturale (es. «onere di attivare la mediazione nell'opposizione a decreto ingiuntivo») e l'assistente indica le pronunce più pertinenti tra quelle in archivio, con il motivo. La ricerca opera solo sul database pubblico di giurisprudenza: nessun dato personale viene trattato.
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") cerca(); }}
          placeholder="Descrivi la questione giuridica..."
          className="h-11 border-2 border-foreground/20 focus:border-primary text-sm"
          data-testid="input-ricerca-ai"
        />
        <Button onClick={cerca} disabled={loading} className="h-11 whitespace-nowrap">
          {loading ? "Ricerca…" : "Cerca con AI"}
        </Button>
      </div>
      {errore && <p className="text-sm text-red-600">{errore}</p>}
      {risultati && risultati.length === 0 && !errore && (
        <p className="text-sm text-muted-foreground">Nessuna pronuncia dell'archivio risulta pertinente a questa richiesta. Prova a riformularla, oppure usa la ricerca per parole chiave qui sotto.</p>
      )}
      {risultati && risultati.length > 0 && (
        <div className="space-y-2">
          {risultati.map((r) => {
            const s = sentenze.find((x) => x.id === r.id);
            if (!s) return null;
            return (
              <Link key={r.id} href={urlSentenza(s)}>
                <div className="rounded-lg bg-background border border-foreground/10 p-3 hover:border-primary cursor-pointer transition-colors">
                  <div className="text-sm font-semibold">{s.organo} n. {s.numero}/{s.anno} — {s.titolo}</div>
                  <div className="text-xs text-muted-foreground mt-1"><span className="font-medium">Perché è rilevante:</span> {r.motivo}</div>
                </div>
              </Link>
            );
          })}
          <p className="text-[11px] text-muted-foreground">Risultati proposti dall'AI: verificane sempre la pertinenza leggendo la pronuncia. L'elenco completo e i filtri restano disponibili qui sotto.</p>
        </div>
      )}
    </div>
  );
}

// Badge color mapping for organo type
function getOrganoBadgeClass(tipoOrgano: string): string {
  switch (tipoOrgano) {
    case "corte_costituzionale":
      return "bg-red-700 text-white border-red-900";
    case "cassazione_su":
      return "bg-amber-700 text-white border-amber-900";
    case "cassazione":
      return "bg-amber-700 text-white border-amber-800";
    case "corte_appello":
      return "bg-blue-600 text-white border-blue-800";
    case "tribunale":
      return "bg-slate-600 text-white border-slate-800";
    default:
      return "bg-muted text-foreground border-muted";
  }
}

function getOrganoLabel(tipoOrgano: string): string {
  const found = ORGANI_GIUDIZIARI.find(o => o.value === tipoOrgano);
  return found ? found.label : tipoOrgano;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

// ========================
// SENTENZA CARD COMPONENT
// ========================
function SentenzaCard({ sentenza, isExpanded, onToggle }: { sentenza: Sentenza; isExpanded: boolean; onToggle: () => void }) {
  return (
    <Card
      className="border-2 border-foreground/20 hover:border-foreground/40 transition-colors duration-150 cursor-pointer"
      onClick={onToggle}
      data-testid={`card-sentenza-${sentenza.id}`}
    >
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold border ${getOrganoBadgeClass(sentenza.tipoOrgano)}`}>
                {sentenza.organo}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                n. {sentenza.numero}/{sentenza.anno}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(sentenza.data)}
              </span>
            </div>
            {/* Title */}
            <h3 className="text-sm font-semibold leading-snug mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {sentenza.titolo}
            </h3>
            {/* Category badge */}
            <Badge variant="outline" className="text-xs font-normal border-foreground/20">
              {sentenza.categoria}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0 mt-1" data-testid={`toggle-sentenza-${sentenza.id}`}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <Separator />

            {/* Massima */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Massima
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90">{sentenza.massima}</p>
            </div>

            {/* Principio di diritto */}
            {sentenza.principioDiDiritto && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                  Principio di diritto
                </h4>
                <p className="text-sm leading-relaxed text-amber-900 italic">
                  "{sentenza.principioDiDiritto}"
                </p>
              </div>
            )}

            {/* Nota */}
            {sentenza.nota && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
                  Nota
                </h4>
                <p className="text-sm text-blue-900">{sentenza.nota}</p>
              </div>
            )}

            {/* Riferimenti normativi */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Riferimenti normativi
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sentenza.riferimentiNormativi.map((rif, i) => (
                  <span key={i} className="inline-flex text-xs bg-muted px-2 py-0.5 border border-foreground/10 font-mono">
                    {rif}
                  </span>
                ))}
              </div>
            </div>

            {/* Temi chiave */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Temi chiave
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sentenza.temiChiave.map((tema, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {tema}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fonte URL + Link a pagina dedicata */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={urlSentenza(sentenza)}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-2 font-medium"
                data-testid={`link-dedicata-${sentenza.id}`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Apri pagina dedicata
              </Link>
              {sentenza.fonteUrl && (
                <a
                  href={sentenza.fonteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-2 font-medium"
                  data-testid={`link-fonte-${sentenza.id}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Leggi il testo integrale
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ========================
// STATS COMPONENT
// ========================
function StatisticheBrief() {
  const totale = sentenze.length;
  const corteCostituzionale = sentenze.filter(s => s.tipoOrgano === "corte_costituzionale").length;
  const cassazioneSU = sentenze.filter(s => s.tipoOrgano === "cassazione_su").length;
  const cassazione = sentenze.filter(s => s.tipoOrgano === "cassazione").length;
  const merito = sentenze.filter(s => s.tipoOrgano === "corte_appello" || s.tipoOrgano === "tribunale").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {[
        { label: "Totale", value: totale, color: "bg-foreground text-background" },
        { label: "Corte Cost.", value: corteCostituzionale, color: "bg-red-700 text-white" },
        { label: "Cass. SS.UU.", value: cassazioneSU, color: "bg-amber-700 text-white" },
        { label: "Cassazione", value: cassazione, color: "bg-amber-700 text-white" },
        { label: "Merito", value: merito, color: "bg-slate-600 text-white" },
      ].map((stat) => (
        <div key={stat.label} className="flex items-center gap-2.5 p-3 border-2 border-foreground/10">
          <span className={`${stat.color} text-lg font-bold px-2.5 py-0.5 font-mono border border-foreground/20 min-w-[2.5rem] text-center`}>
            {stat.value}
          </span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function Giurisprudenza() {
  const [testoLibero, setTestoLibero] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [tipoOrgano, setTipoOrgano] = useState<string>("");
  const [annoMin, setAnnoMin] = useState<string>("");
  const [annoMax, setAnnoMax] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const risultati = useMemo(() => {
    return cercaSentenze({
      testoLibero: testoLibero.trim() || undefined,
      categoria: categoria || undefined,
      tipoOrgano: tipoOrgano || undefined,
      annoMin: annoMin ? parseInt(annoMin) : undefined,
      annoMax: annoMax ? parseInt(annoMax) : undefined,
    });
  }, [testoLibero, categoria, tipoOrgano, annoMin, annoMax]);

  const hasActiveFilters = categoria || tipoOrgano || annoMin || annoMax;

  const resetFilters = () => {
    setCategoria("");
    setTipoOrgano("");
    setAnnoMin("");
    setAnnoMax("");
    setTestoLibero("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Giurisprudenza Mediazione Civile 2010-2026 — Cassazione, Costituzionale, Merito"
        description="Motore di ricerca della giurisprudenza in tema di mediazione civile: sentenze della Corte Costituzionale, Cassazione e merito dal 2010 al 2026, comprese le ultime pronunce sulla Riforma Cartabia."
        canonical="https://calcolomediazione.it/giurisprudenza"
      />
      {/* Hero */}
      <section className="border-b-[3px] border-foreground bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Giurisprudenza Mediazione
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Motore di ricerca giurisprudenziale dal 2010 ad oggi
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Raccolta sistematica delle principali pronunce in materia di mediazione civile e commerciale:
            sentenze della Corte Costituzionale, della Cassazione a Sezioni Unite e sezioni semplici,
            e giurisprudenza di merito. Dal D.Lgs. 28/2010 alla Riforma Cartabia e al correttivo D.Lgs. 216/2024.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statistiche */}
        <StatisticheBrief />

        {/* Ricerca AI in linguaggio naturale */}
        <RicercaAI />

        {/* Search bar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={testoLibero}
                onChange={(e) => setTestoLibero(e.target.value)}
                placeholder="Cerca per parola chiave, numero sentenza, articolo di legge..."
                className="pl-10 h-12 border-2 border-foreground/20 focus:border-primary text-sm"
                data-testid="input-search"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 border-2 font-semibold text-sm gap-2 ${
                showFilters || hasActiveFilters
                  ? "border-primary text-primary"
                  : "border-foreground/20"
              }`}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              Filtri
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <Card className="border-2 border-foreground/15">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Categoria */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Categoria
                    </label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger className="border-2 border-foreground/20 h-10 text-sm" data-testid="select-categoria">
                        <SelectValue placeholder="Tutte" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIE.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Organo */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Organo giudiziario
                    </label>
                    <Select value={tipoOrgano} onValueChange={setTipoOrgano}>
                      <SelectTrigger className="border-2 border-foreground/20 h-10 text-sm" data-testid="select-organo">
                        <SelectValue placeholder="Tutti" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORGANI_GIUDIZIARI.map((org) => (
                          <SelectItem key={org.value} value={org.value}>{org.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Anno min */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Anno da
                    </label>
                    <Input
                      type="number"
                      value={annoMin}
                      onChange={(e) => setAnnoMin(e.target.value)}
                      placeholder="2010"
                      min={2010}
                      max={2026}
                      className="border-2 border-foreground/20 h-10 text-sm"
                      data-testid="input-anno-min"
                    />
                  </div>

                  {/* Anno max */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Anno a
                    </label>
                    <Input
                      type="number"
                      value={annoMax}
                      onChange={(e) => setAnnoMax(e.target.value)}
                      placeholder="2026"
                      min={2010}
                      max={2026}
                      className="border-2 border-foreground/20 h-10 text-sm"
                      data-testid="input-anno-max"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="text-xs text-primary hover:underline underline-offset-2 flex items-center gap-1"
                      data-testid="button-reset-filters"
                    >
                      <X className="w-3 h-3" />
                      Rimuovi filtri
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground font-mono">{risultati.length}</span>{" "}
            {risultati.length === 1 ? "sentenza trovata" : "sentenze trovate"}
            {(testoLibero || hasActiveFilters) && (
              <span> su {sentenze.length} totali</span>
            )}
          </p>
          {(testoLibero || hasActiveFilters) && (
            <button
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Mostra tutte
            </button>
          )}
        </div>

        {/* Results list */}
        <div className="space-y-3">
          {risultati.length === 0 ? (
            <Card className="border-2 border-dashed border-foreground/20">
              <CardContent className="p-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground font-medium">
                  Nessuna sentenza trovata con i criteri selezionati.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Prova a modificare i filtri o la ricerca testuale.
                </p>
              </CardContent>
            </Card>
          ) : (
            risultati.map((sentenza) => (
              <SentenzaCard
                key={sentenza.id}
                sentenza={sentenza}
                isExpanded={expandedId === sentenza.id}
                onToggle={() => setExpandedId(expandedId === sentenza.id ? null : sentenza.id)}
              />
            ))
          )}
        </div>

        {/* Legend / Disclaimer */}
        <div className="text-center text-xs text-muted-foreground pb-8 space-y-2 pt-4">
          <Separator className="mb-4" />
          <div className="flex flex-wrap justify-center gap-3 mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-700 border border-red-900" />
              <span>Corte Costituzionale</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-700 border border-amber-900" />
              <span>Cass. SS.UU.</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-700 border border-amber-800" />
              <span>Cassazione</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-600 border border-blue-800" />
              <span>Corte d'Appello</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-600 border border-slate-800" />
              <span>Tribunale</span>
            </span>
          </div>
          <p>
            Raccolta giurisprudenziale a cura di CalcoloMediazione.
          </p>
          <p>
            Questa raccolta ha finalita informativa e di studio. Non sostituisce la consulenza legale professionale.
          </p>
          <p>
            Fonti: Corte Costituzionale, Corte di Cassazione, giurisprudenza di merito.
          </p>
        </div>
      </div>
    </div>
  );
}
