// ─── Schema.org JSON-LD per /chi-siamo ──────────────────────────────────────
// Grafo multi-entity: WebPage + WebSite + BreadcrumbList + Person (autore) +
// ProfessionalService (local SEO Genova / Liguria / Italia) + ItemList degli
// strumenti gratuiti del sito.
// Tenuto fuori da ChiSiamo.tsx per leggibilità del componente.

const SITE_URL = "https://calcolomediazione.it";
export const CHI_SIAMO_PAGE_URL = `${SITE_URL}/chi-siamo`;

export const chiSiamoJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CHI_SIAMO_PAGE_URL}#webpage`,
      url: CHI_SIAMO_PAGE_URL,
      name: "Chi Siamo — Avv. Carlo Alberto Calcagno, mediatore e Legal Tech Genova",
      inLanguage: "it-IT",
      isPartOf: { "@id": `${SITE_URL}#website` },
      about: { "@id": `${SITE_URL}#person-calcagno` },
      mainEntity: { "@id": `${SITE_URL}#person-calcagno` },
      breadcrumb: { "@id": `${CHI_SIAMO_PAGE_URL}#breadcrumb` },
      description:
        "Profilo dell'avv. Carlo Alberto Calcagno: mediatore familiare e civile ODM Genova, commissario ADR del COA Genova, formatore, sviluppatore Legal Tech e prompt engineering AI. Tutti gli strumenti gratuiti di CalcoloMediazione.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "CalcoloMediazione",
      inLanguage: "it-IT",
      publisher: { "@id": `${SITE_URL}#person-calcagno` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CHI_SIAMO_PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "Chi Siamo", item: CHI_SIAMO_PAGE_URL },
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person-calcagno`,
      name: "Carlo Alberto Calcagno",
      givenName: "Carlo Alberto",
      familyName: "Calcagno",
      honorificPrefix: "Avv.",
      jobTitle: [
        "Avvocato",
        "Mediatore civile e commerciale",
        "Mediatore familiare",
        "Formatore ODM",
      ],
      description:
        "Avvocato del Foro di Genova, mediatore familiare e civile, formatore ODM, membro della Commissione ADR del Consiglio dell'Ordine degli Avvocati di Genova. Studioso di storia del diritto e sviluppatore Legal Tech con focus su AI e prompt engineering applicati alla mediazione.",
      gender: "https://schema.org/Male",
      nationality: { "@type": "Country", name: "Italia" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Genova",
        addressRegion: "Liguria",
        addressCountry: "IT",
      },
      knowsLanguage: [
        { "@type": "Language", name: "Italian", alternateName: "it" },
        { "@type": "Language", name: "English", alternateName: "en" },
      ],
      knowsAbout: [
        "Mediazione civile e commerciale",
        "Mediazione familiare",
        "Alternative Dispute Resolution (ADR)",
        "Riforma Cartabia D.Lgs. 149/2022",
        "D.Lgs. 28/2010",
        "D.M. 150/2023",
        "Procura speciale sostanziale",
        "Diritto romano",
        "Statuti sabaudi",
        "Storia del diritto italiano",
        "Legal Tech",
        "Intelligenza artificiale applicata al diritto",
        "Prompt engineering",
        "Enneagramma",
        "Approcci olistici e integrativi alla mediazione",
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Avvocato e mediatore civile, commerciale e familiare",
          occupationLocation: {
            "@type": "City",
            name: "Genova",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Genova",
              addressRegion: "Liguria",
              addressCountry: "IT",
            },
          },
          skills:
            "Mediazione obbligatoria, demandata e volontaria; mediazione familiare; ADR; analisi giurisprudenziale; redazione procure sostanziali; Legal Tech; AI applicata al diritto.",
        },
      ],
      memberOf: [
        {
          "@type": "Organization",
          name: "Consiglio dell'Ordine degli Avvocati di Genova — Commissione ADR",
          url: "https://www.ordineavvocatigenova.it/",
        },
      ],
      url: CHI_SIAMO_PAGE_URL,
      sameAs: [
        "https://enneagrammaevolutivo.it",
        "https://olismo-integrato.it",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}#professional-service`,
      name: "Avv. Carlo Alberto Calcagno — Mediazione civile, commerciale e familiare",
      url: CHI_SIAMO_PAGE_URL,
      provider: { "@id": `${SITE_URL}#person-calcagno` },
      areaServed: [
        { "@type": "City", name: "Genova" },
        { "@type": "AdministrativeArea", name: "Liguria" },
        { "@type": "Country", name: "Italia" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Genova",
        addressRegion: "Liguria",
        addressCountry: "IT",
      },
      serviceType: [
        "Mediazione civile e commerciale",
        "Mediazione familiare",
        "Alternative Dispute Resolution (ADR)",
        "Formazione mediatori",
        "Legal Tech consulting",
      ],
      knowsAbout: [
        "Mediazione obbligatoria",
        "Mediazione demandata",
        "Procura sostanziale",
        "Riforma Cartabia",
        "D.M. 150/2023",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${CHI_SIAMO_PAGE_URL}#strumenti`,
      name: "Strumenti gratuiti di CalcoloMediazione",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 11,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Calcolatore Indennità di Mediazione", url: `${SITE_URL}/calcolatore` },
        { "@type": "ListItem", position: 2, name: "Analisi AI del Caso", url: `${SITE_URL}/analisi-caso-ai` },
        { "@type": "ListItem", position: 3, name: "Confronto Costi Mediazione vs Processo", url: `${SITE_URL}/confronto-costi` },
        { "@type": "ListItem", position: 4, name: "Calcolo Costi Notarili Accordo", url: `${SITE_URL}/costi-notarili` },
        { "@type": "ListItem", position: 5, name: "Credito d'Imposta Mediazione", url: `${SITE_URL}/credito-imposta` },
        { "@type": "ListItem", position: 6, name: "Generatore Procura Speciale Sostanziale", url: `${SITE_URL}/generatore-procura` },
        { "@type": "ListItem", position: 7, name: "Banca Dati Giurisprudenza Mediazione (88 pronunce)", url: `${SITE_URL}/giurisprudenza` },
        { "@type": "ListItem", position: 8, name: "Strategie di Negoziazione", url: `${SITE_URL}/strategie-negoziazione` },
        { "@type": "ListItem", position: 9, name: "Guida operativa al D.M. 150/2023", url: `${SITE_URL}/guida-dm-150` },
        { "@type": "ListItem", position: 10, name: "Glossario della Mediazione", url: `${SITE_URL}/glossario` },
        { "@type": "ListItem", position: 11, name: "FAQ aggiornate sulla mediazione", url: `${SITE_URL}/faq` },
      ],
    },
  ],
};
