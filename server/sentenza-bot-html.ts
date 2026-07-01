// ═══════════════════════════════════════════════════════════════════════════
// HTML server-rendered per singola sentenza, servito ai bot dei motori di ricerca.
// Include Article JSON-LD e BreadcrumbList JSON-LD per rich results.
// ═══════════════════════════════════════════════════════════════════════════

import { sentenze, ORGANI_GIUDIZIARI } from "../client/src/data/giurisprudenza-db.js";
import { generaSlugSentenza, trovaSentenzaPerSlug, urlSentenza } from "../shared/sentenza-slug.js";

function getOrganoLabel(tipoOrgano: string): string {
  return ORGANI_GIUDIZIARI.find((o) => o.value === tipoOrgano)?.label ?? tipoOrgano;
}

function abbrevOrgano(tipoOrgano: string): string {
  switch (tipoOrgano) {
    case "corte_costituzionale":
      return "Corte Cost.";
    case "cassazione_su":
      return "Cass. SS.UU.";
    case "cassazione":
      return "Cass.";
    case "corte_appello":
      return "App.";
    default:
      return "Trib.";
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Costruisce HTML per una singola sentenza (bot rendering).
 * Ritorna null se lo slug non corrisponde ad alcuna sentenza.
 */
export function buildSentenzaHtml(slug: string, siteUrl: string): string | null {
  const s = trovaSentenzaPerSlug(sentenze, slug);
  if (!s) return null;

  const canonical = `${siteUrl}${urlSentenza(s)}`;

  // Titolo SEO ottimizzato <60 char quando possibile
  const abbr = abbrevOrgano(s.tipoOrgano);
  const prefix = `${abbr} ${s.numero}/${s.anno} —`;
  const suffix = " | Mediazione";
  const maxTitoloLen = 60 - prefix.length - suffix.length;
  let titoloAbbrev = s.titolo;
  if (titoloAbbrev.length > maxTitoloLen && maxTitoloLen > 15) {
    titoloAbbrev = titoloAbbrev.slice(0, maxTitoloLen).trimEnd();
    const lastSpace = titoloAbbrev.lastIndexOf(" ");
    if (lastSpace > 10) titoloAbbrev = titoloAbbrev.slice(0, lastSpace);
  }
  const seoTitle = `${prefix} ${titoloAbbrev}${suffix}`;

  // Description <=155 char
  let desc = `${getOrganoLabel(s.tipoOrgano)} n. ${s.numero}/${s.anno}: ${s.massima}`;
  if (desc.length > 155) desc = desc.slice(0, 152).trimEnd() + "...";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.titolo,
    articleBody: s.massima,
    datePublished: s.data,
    dateModified: s.data,
    author: { "@type": "Organization", name: getOrganoLabel(s.tipoOrgano) },
    publisher: { "@type": "Organization", name: "CalcoloMediazione", url: siteUrl },
    mainEntityOfPage: canonical,
    keywords: s.temiChiave.join(", "),
    about: { "@type": "Thing", name: s.categoria },
    inLanguage: "it-IT",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
      { "@type": "ListItem", position: 2, name: "Giurisprudenza", item: siteUrl + "/giurisprudenza" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${getOrganoLabel(s.tipoOrgano)} ${s.numero}/${s.anno}`,
        item: canonical,
      },
    ],
  };

  // Sentenze correlate — stessa categoria, max 4
  const correlate = sentenze
    .filter((x) => x.categoria === s.categoria && x.id !== s.id)
    .slice(0, 4);

  const correlateHtml = correlate.length
    ? `<h2>Sentenze correlate — ${escapeHtml(s.categoria)}</h2>
<ul>${correlate
        .map(
          (c) =>
            `<li><a href="${siteUrl}${urlSentenza(c)}">${escapeHtml(c.organo)} n. ${escapeHtml(c.numero)}/${c.anno} — ${escapeHtml(c.titolo)}</a></li>`
        )
        .join("")}</ul>`
    : "";

  const principioHtml = s.principioDiDiritto
    ? `<h2>Principio di diritto</h2><p><em>${escapeHtml(s.principioDiDiritto)}</em></p>`
    : "";

  const notaHtml = s.nota ? `<h2>Nota</h2><p>${escapeHtml(s.nota)}</p>` : "";

  const fonteHtml = s.fonteUrl
    ? `<p><a href="${escapeHtml(s.fonteUrl)}" rel="noopener external">Consulta la fonte originale</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seoTitle)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escapeHtml(seoTitle)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${siteUrl}/og-image.svg">
  <meta property="article:published_time" content="${s.data}">
  <meta property="article:section" content="${escapeHtml(s.categoria)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seoTitle)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
  <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="${siteUrl}/">CalcoloMediazione</a> &raquo;
    <a href="${siteUrl}/giurisprudenza">Giurisprudenza</a> &raquo;
    <span>${escapeHtml(getOrganoLabel(s.tipoOrgano))} ${escapeHtml(s.numero)}/${s.anno}</span>
  </nav>
  <main>
    <article>
      <header>
        <p><strong>${escapeHtml(s.organo)}</strong> — n. ${escapeHtml(s.numero)}/${s.anno} — ${s.data} — categoria: ${escapeHtml(s.categoria)}</p>
        <h1>${escapeHtml(s.titolo)}</h1>
      </header>
      <h2>Massima</h2>
      <p>${escapeHtml(s.massima)}</p>
      ${principioHtml}
      ${notaHtml}
      <h2>Riferimenti normativi</h2>
      <ul>${s.riferimentiNormativi.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
      <h2>Temi chiave</h2>
      <p>${s.temiChiave.map(escapeHtml).join(", ")}</p>
      ${fonteHtml}
      ${correlateHtml}
    </article>
  </main>
  <footer>
    <p>CalcoloMediazione — Database giurisprudenziale sulla mediazione civile</p>
    <p><a href="${siteUrl}/giurisprudenza">Torna al database completo (${sentenze.length} pronunce)</a></p>
    <p><a href="${siteUrl}">${siteUrl}</a></p>
  </footer>
</body>
</html>`;
}

/**
 * Genera sitemap XML dedicata a tutte le sentenze del database.
 * Formato URL: /sitemap-giurisprudenza.xml
 */
export function buildGiurisprudenzaSitemap(siteUrl: string): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const s of sentenze) {
    const url = `${siteUrl}${urlSentenza(s)}`;
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="it-IT" href="${url}"/>\n`;
    xml += `    <lastmod>${s.data}</lastmod>\n`;
    xml += `    <changefreq>yearly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;
  return xml;
}
