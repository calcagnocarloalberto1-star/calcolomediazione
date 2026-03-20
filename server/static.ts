import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// SEO pages metadata
const SEO_PAGES: Record<string, { title: string; description: string }> = {
  "/": { title: "CalcoloMediazione - Calcolatore Indennit\u00e0 Mediazione Civile", description: "Piattaforma professionale per il calcolo delle indennit\u00e0 di mediazione D.M. 150/2023. Analisi AI del caso, confronto costi primo grado, appello e cassazione, stima CTU, esenzione prima casa, generatore procura." },
  "/calcolatore": { title: "Calcolatore Indennit\u00e0 Mediazione D.M. 150/2023", description: "Calcola le indennit\u00e0 di mediazione civile e commerciale secondo le tariffe del D.M. 150/2023. Doppia tariffa, esenzioni, compensi avvocato, costi notarili con esenzione prima casa." },
  "/analisi-caso-ai": { title: "Analisi AI del Caso di Mediazione con Confronto Economico", description: "Analisi completa del caso di mediazione con intelligenza artificiale: analisi giuridica, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico primo grado, appello e cassazione con stima CTU." },
  "/confronto-costi": { title: "Confronto Costi Mediazione vs Processo: Primo Grado, Appello, Cassazione", description: "Confronta i costi della mediazione con quelli del processo su tre gradi di giudizio. Contributo unificato, compensi avvocato, CTU in appello, parametri forensi D.M. 55/2014 Tabelle 2, 12 e 13." },
  "/faq": { title: "FAQ Mediazione Civile - Domande Frequenti", description: "Domande frequenti sulla mediazione civile e commerciale: indennit\u00e0, costi, credito d'imposta, gratuito patrocinio, esenzione prima casa e analisi AI." },
  "/guida-dm-150": { title: "Guida Completa D.M. 150/2023 - Tariffe Mediazione", description: "Guida dettagliata al Decreto Ministeriale 150/2023 sulle tariffe di mediazione civile e commerciale. Tabelle, calcoli ed esempi pratici." },
  "/generatore-procura": { title: "Generatore Procura Speciale per Mediazione", description: "Genera la procura speciale per la mediazione civile con tutti i poteri necessari. Conforme al D.Lgs. 28/2010." },
  "/giurisprudenza": { title: "Giurisprudenza Mediazione - Database Sentenze", description: "Database di giurisprudenza sulla mediazione civile e commerciale. Sentenze di Cassazione, Tribunali e Corti d'Appello con ricerca avanzata." },
  "/credito-imposta": { title: "Credito d'Imposta e Gratuito Patrocinio in Mediazione", description: "Guida completa al credito d'imposta per la mediazione civile (D.M. 1\u00b0 agosto 2023) e al gratuito patrocinio. Requisiti, importi e procedura." },
  "/strategie-negoziazione": { title: "Strategie di Negoziazione per la Mediazione Civile", description: "Guida alle principali strategie e tecniche di negoziazione nella mediazione civile: MAAN/BATNA, negoziazione integrativa, ZOPA, ancoraggio e comunicazione." },
  "/glossario": { title: "Glossario della Mediazione Civile", description: "Glossario completo dei termini utilizzati nella mediazione civile e commerciale. Definizioni chiare e riferimenti normativi." },
  "/chi-siamo": { title: "Chi Siamo - CalcoloMediazione", description: "Scopri il team dietro CalcoloMediazione, la piattaforma professionale per mediatori civili e commerciali." },
  "/contatti": { title: "Contatti - CalcoloMediazione", description: "Contatta il team di CalcoloMediazione per informazioni, supporto tecnico e collaborazioni." },
};

const PRIMARY_URL = "https://calcolomediazione.it";

function getSiteUrl(req: any): string {
  const host = req.hostname || req.headers.host?.split(':')[0] || 'calcolomediazione.it';
  if (host.includes('calcolomediazione.org')) return 'https://calcolomediazione.org';
  if (host.includes('calcolomediazione.it')) return 'https://calcolomediazione.it';
  return PRIMARY_URL;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // For SEO: inject proper meta tags for known pages
  app.use("/{*path}", (req, res) => {
    const reqPath = req.params["path"] ? `/${req.params["path"]}` : "/";
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");

    const siteUrl = getSiteUrl(req);
    const seoPage = SEO_PAGES[reqPath];
    if (seoPage && reqPath !== "/") {
      // Replace title
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${seoPage.title}</title>`
      );
      // Replace description
      html = html.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${seoPage.description}" />`
      );
      // Add canonical URL and OG tags
      html = html.replace(
        '</head>',
        `  <link rel="canonical" href="${siteUrl}${reqPath}" />\n    <meta property="og:title" content="${seoPage.title}" />\n    <meta property="og:description" content="${seoPage.description}" />\n    <meta property="og:url" content="${siteUrl}${reqPath}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:site_name" content="CalcoloMediazione" />\n    <meta property="og:image" content="${siteUrl}/og-image.svg" />\n    <script>if(!window.location.hash || window.location.hash === '#/') window.location.hash = '#${reqPath}';</script>\n  </head>`
      );
    } else if (reqPath === "/") {
      // Home page - canonical already in index.html, just ensure siteUrl is correct
      html = html.replace(
        '</head>',
        `  <link rel="canonical" href="${siteUrl}/" />\n  </head>`
      );
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
}
