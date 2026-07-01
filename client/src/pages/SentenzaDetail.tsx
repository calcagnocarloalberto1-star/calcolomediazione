import { useMemo } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink, Calendar, Building2, Tag, Hash, Scale, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeoHead } from "@/components/SeoHead";
import { sentenze, ORGANI_GIUDIZIARI, type Sentenza } from "@/data/giurisprudenza-db";
import { trovaSentenzaPerSlug, urlSentenza, generaSlugSentenza } from "@shared/sentenza-slug";
import NotFound from "@/pages/not-found";

const SITE_URL = "https://calcolomediazione.it";

function getOrganoLabel(tipoOrgano: string): string {
  return ORGANI_GIUDIZIARI.find((o) => o.value === tipoOrgano)?.label ?? tipoOrgano;
}

function getOrganoBadgeClass(tipoOrgano: string): string {
  switch (tipoOrgano) {
    case "corte_costituzionale":
      return "bg-red-700 text-white border-red-900";
    case "cassazione_su":
      return "bg-amber-700 text-white border-amber-900";
    case "cassazione":
      return "bg-amber-600 text-white border-amber-800";
    case "corte_appello":
      return "bg-blue-600 text-white border-blue-800";
    case "tribunale":
      return "bg-slate-600 text-white border-slate-800";
    default:
      return "bg-muted text-foreground border-muted";
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Costruisce un titolo SEO ottimizzato <60 char quando possibile.
 * Pattern: "[Organo] [numero]/[anno] — [concetto] | Mediazione"
 */
function buildSeoTitle(s: Sentenza): string {
  const organoAbbr =
    s.tipoOrgano === "corte_costituzionale" ? "Corte Cost." :
    s.tipoOrgano === "cassazione_su" ? "Cass. SS.UU." :
    s.tipoOrgano === "cassazione" ? "Cass." :
    s.tipoOrgano === "corte_appello" ? "App." :
    "Trib.";
  const prefix = `${organoAbbr} ${s.numero}/${s.anno} —`;
  const suffix = " | Mediazione";
  const maxTitoloLen = 60 - prefix.length - suffix.length;
  let titolo = s.titolo;
  if (titolo.length > maxTitoloLen && maxTitoloLen > 15) {
    titolo = titolo.slice(0, maxTitoloLen).trimEnd();
    const lastSpace = titolo.lastIndexOf(" ");
    if (lastSpace > 10) titolo = titolo.slice(0, lastSpace);
  }
  return `${prefix} ${titolo}${suffix}`;
}

function buildSeoDescription(s: Sentenza): string {
  const desc = `${getOrganoLabel(s.tipoOrgano)} n. ${s.numero}/${s.anno}: ${s.massima}`;
  return desc.length > 155 ? desc.slice(0, 152).trimEnd() + "..." : desc;
}

function buildArticleJsonLd(s: Sentenza, canonical: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.titolo,
    articleBody: s.massima,
    datePublished: s.data,
    dateModified: s.data,
    author: {
      "@type": "Organization",
      name: getOrganoLabel(s.tipoOrgano),
    },
    publisher: {
      "@type": "Organization",
      name: "CalcoloMediazione",
      url: SITE_URL,
    },
    mainEntityOfPage: canonical,
    keywords: s.temiChiave.join(", "),
    about: {
      "@type": "Thing",
      name: s.categoria,
    },
    inLanguage: "it-IT",
    isAccessibleForFree: true,
  };
}

function buildBreadcrumbJsonLd(s: Sentenza): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Giurisprudenza", item: SITE_URL + "/giurisprudenza" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${getOrganoLabel(s.tipoOrgano)} ${s.numero}/${s.anno}`,
        item: SITE_URL + urlSentenza(s),
      },
    ],
  };
}

export default function SentenzaDetail() {
  const [, params] = useRoute<{ slug: string }>("/giurisprudenza/:slug");
  const slug = params?.slug ?? "";
  const sentenza = useMemo(() => trovaSentenzaPerSlug(sentenze, slug), [slug]);

  if (!sentenza) return <NotFound />;

  const canonical = SITE_URL + urlSentenza(sentenza);
  const canonicalSlug = generaSlugSentenza(sentenza);
  const isCanonicalSlug = slug === canonicalSlug;

  // Correlate: stessa categoria, escludendo quella corrente, max 4
  const correlate = sentenze
    .filter((s) => s.categoria === sentenza.categoria && s.id !== sentenza.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={buildSeoTitle(sentenza)}
        description={buildSeoDescription(sentenza)}
        canonical={canonical}
        ogType="article"
        jsonLd={[buildArticleJsonLd(sentenza, canonical), buildBreadcrumbJsonLd(sentenza)]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb + back */}
        <nav aria-label="Breadcrumb" className="text-sm mb-6">
          <Link href="/giurisprudenza" className="inline-flex items-center gap-1 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            <span>Torna al database giurisprudenziale</span>
          </Link>
        </nav>

        {!isCanonicalSlug && (
          <div className="text-xs text-muted-foreground mb-4">
            Slug legacy — link canonico:{" "}
            <Link href={urlSentenza(sentenza)} className="underline">
              {urlSentenza(sentenza)}
            </Link>
          </div>
        )}

        <article>
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-bold border ${getOrganoBadgeClass(sentenza.tipoOrgano)}`}
              >
                {sentenza.organo}
              </span>
              <span className="text-sm font-mono text-muted-foreground">
                <Hash className="inline h-3 w-3" aria-hidden /> n. {sentenza.numero}/{sentenza.anno}
              </span>
              <span className="text-sm text-muted-foreground">
                <Calendar className="inline h-3 w-3" aria-hidden /> {formatDate(sentenza.data)}
              </span>
              <Badge variant="outline" className="text-xs font-normal border-foreground/20">
                <Tag className="inline h-3 w-3 mr-1" aria-hidden />
                {sentenza.categoria}
              </Badge>
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold leading-tight mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {sentenza.titolo}
            </h1>
          </header>

          {/* Massima */}
          <Card className="mb-6 border-2 border-foreground/20">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Scale className="h-5 w-5" aria-hidden />
                Massima
              </h2>
              <p className="text-base leading-relaxed whitespace-pre-line">{sentenza.massima}</p>
            </CardContent>
          </Card>

          {/* Principio di diritto */}
          {sentenza.principioDiDiritto && (
            <Card className="mb-6 border-2 border-primary/40 bg-primary/5">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" aria-hidden />
                  Principio di diritto
                </h2>
                <p className="text-base leading-relaxed whitespace-pre-line font-medium">
                  {sentenza.principioDiDiritto}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Nota */}
          {sentenza.nota && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Nota</h2>
                <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">
                  {sentenza.nota}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Riferimenti + Temi */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-semibold mb-3">Riferimenti normativi</h2>
                <ul className="space-y-1.5 text-sm">
                  {sentenza.riferimentiNormativi.map((r, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-semibold mb-3">Temi chiave</h2>
                <div className="flex flex-wrap gap-1.5">
                  {sentenza.temiChiave.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fonte esterna */}
          {sentenza.fonteUrl && (
            <div className="mb-8">
              <Button asChild variant="outline" size="sm">
                <a href={sentenza.fonteUrl} target="_blank" rel="noopener noreferrer">
                  Consulta la fonte originale
                  <ExternalLink className="h-4 w-4 ml-1.5" aria-hidden />
                </a>
              </Button>
            </div>
          )}

          <Separator className="my-8" />

          {/* Sentenze correlate */}
          {correlate.length > 0 && (
            <section aria-labelledby="correlate-heading">
              <h2 id="correlate-heading" className="text-xl font-bold mb-4">
                Sentenze correlate — {sentenza.categoria}
              </h2>
              <div className="grid gap-3">
                {correlate.map((s) => (
                  <Link
                    key={s.id}
                    href={urlSentenza(s)}
                    className="block p-4 border-2 border-foreground/10 hover:border-foreground/30 transition-colors rounded"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" aria-hidden />
                      {s.organo} n. {s.numero}/{s.anno}
                    </div>
                    <div
                      className="text-sm font-semibold leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {s.titolo}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
