/**
 * Componente leggero per gestire i tag SEO/GEO/Open Graph lato client.
 * Aggiorna document.title, meta description, canonical, og:* e twitter:*.
 * Inserisce/aggiorna anche un blocco JSON-LD per il motore corrente.
 *
 * Nessuna dipendenza esterna (no react-helmet).
 */

import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  /** Tipo Open Graph: default "website" — "article" per pagine di approfondimento. */
  ogType?: "website" | "article";
  /** Immagine OG (1200x630). Default: og-image del sito. */
  ogImage?: string;
  /** JSON-LD aggiuntivo (es. tipo SoftwareApplication, FAQPage, BreadcrumbList). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string
) {
  let el = document.head.querySelector(
    `meta[${attr}="${key}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function SeoHead({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = "https://calcolomediazione.it/og-image.svg",
  jsonLd,
}: SeoHeadProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "it_IT");
    setMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      "CalcoloMediazione"
    );

    setMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image"
    );
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // GEO meta — Italia / Genova
    setMeta('meta[name="geo.region"]', "name", "geo.region", "IT-GE");
    setMeta('meta[name="geo.placename"]', "name", "geo.placename", "Genova");
    setMeta(
      'meta[name="geo.position"]',
      "name",
      "geo.position",
      "44.4056;8.9463"
    );
    setMeta('meta[name="ICBM"]', "name", "ICBM", "44.4056, 8.9463");

    setLink("canonical", canonical);
    setLink("alternate", canonical); // hreflang it gestito via meta sotto
    let alt = document.head.querySelector(
      'link[rel="alternate"][hreflang="it-IT"]'
    ) as HTMLLinkElement | null;
    if (!alt) {
      alt = document.createElement("link");
      alt.rel = "alternate";
      alt.hreflang = "it-IT";
      document.head.appendChild(alt);
    }
    alt.href = canonical;

    // JSON-LD dinamico — id stabile per page-script
    const JSONLD_ID = "page-jsonld";
    let scriptEl = document.head.querySelector(
      `script#${JSONLD_ID}`
    ) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.id = JSONLD_ID;
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogType, ogImage, jsonLd]);

  return null;
}
