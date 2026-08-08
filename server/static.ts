import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { SEO_CONTENT } from "./seo-content.js";

// SEO pages metadata
const SEO_PAGES: Record<string, { title: string; description: string }> = {
  "/": { title: "CalcoloMediazione \u2014 Calcolatore Indennit\u00e0 Mediazione Civile, Analisi AI e Confronto Costi", description: "Piattaforma gratuita per avvocati e mediatori: calcolatore indennit\u00e0 D.M. 150/2023, analisi AI del caso, confronto costi mediazione vs processo su tre gradi di giudizio, stima costi notarili, credito d'imposta, generatore procura." },
  "/calcolatore": { title: "Calcolatore Indennit\u00e0 Mediazione D.M. 150/2023 \u2014 Tariffe Nazionali e COA Genova", description: "Calcola le indennit\u00e0 di mediazione civile secondo il D.M. 150/2023: tariffe nazionali Tabella A e regolamento COA Genova. Spese di avvio, riduzioni art. 28, maggiorazioni art. 31, agevolazioni fiscali art. 17 D.Lgs. 28/2010." },
  "/analisi-caso-ai": { title: "Analisi AI del Caso di Mediazione con Confronto Economico", description: "Analisi completa del caso di mediazione con intelligenza artificiale: analisi giuridica, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico primo grado, appello e cassazione con stima CTU, verifica congruità valore catastale." },
  "/confronto-costi": { title: "Confronto Costi Mediazione vs Processo: Primo Grado, Appello, Cassazione", description: "Confronta i costi della mediazione con quelli del processo su tre gradi di giudizio. Contributo unificato, compensi avvocato, CTU in appello, parametri forensi D.M. 55/2014 Tabelle 2, 12 e 13." },
  "/faq": { title: "FAQ Mediazione Civile \u2014 Domande Frequenti D.M. 150/2023 e D.Lgs. 28/2010", description: "Le risposte alle domande pi\u00f9 frequenti sulla mediazione civile: indennit\u00e0, primo incontro, materie obbligatorie, procura sostanziale (Cass. 10978/2026 e 9608/2026), agevolazioni fiscali art. 17, credito d'imposta, art. 5-quater (mediazione demandata)." },
  "/guida-dm-150": { title: "Guida Completa D.M. 150/2023 - Tariffe Mediazione", description: "Guida dettagliata al Decreto Ministeriale 150/2023 sulle tariffe di mediazione civile e commerciale. Tabelle, calcoli ed esempi pratici." },
  "/generatore-procura": { title: "Generatore Procura Speciale per Mediazione", description: "Genera la procura speciale per la mediazione civile con tutti i poteri necessari. Conforme al D.Lgs. 28/2010." },
  "/giurisprudenza": { title: "Giurisprudenza Mediazione - Database Sentenze", description: "Database di giurisprudenza sulla mediazione civile e commerciale. Sentenze di Cassazione, Tribunali e Corti d'Appello con ricerca avanzata." },
  "/credito-imposta": { title: "Credito d'Imposta e Gratuito Patrocinio in Mediazione", description: "Guida completa al credito d'imposta per la mediazione civile (D.M. 1\u00b0 agosto 2023) e al gratuito patrocinio. Requisiti, importi e procedura." },
  "/costi-notarili": { title: "Calcola Costi Notarili Mediazione \u00b7 CalcoloMediazione", description: "Calcola i costi notarili per accordo di mediazione o sentenza: onorari, imposta di registro, ipotecaria, catastale e IVA. Esenzione art. 17 D.Lgs. 28/2010." },
  "/strategie-negoziazione": { title: "Strategie di Negoziazione per la Mediazione Civile", description: "Guida alle principali strategie e tecniche di negoziazione nella mediazione civile: MAAN/BATNA, negoziazione integrativa, ZOPA, ancoraggio e comunicazione." },
  "/mediazione-obbligatoria-quanto-costa": { title: "Mediazione Obbligatoria: Quanto Costa Davvero nel 2026 (Guida con Esempi)", description: "Quanto costa la mediazione civile obbligatoria: tabella ufficiale D.M. 150/2023, riduzione del 20%, esempi di calcolo reali e confronto con le spese di un giudizio." },
  "/glossario": { title: "Glossario della Mediazione Civile", description: "Glossario completo dei termini utilizzati nella mediazione civile e commerciale. Definizioni chiare e riferimenti normativi." },
  "/calcolo-assegni": { title: "Calcolo Assegni di Separazione e Divorzio", description: "Strumento orientativo per il calcolo dell'assegno di mantenimento del coniuge, dell'assegno divorzile (Cass. SU 18287/2018) e del contributo al mantenimento dei figli (art. 337-ter c.c.). Esportazione PDF del report motivato." },
  "/chi-siamo": { title: "Chi Siamo \u2014 Avv. Carlo Alberto Calcagno, mediatore e Legal Tech Genova", description: "Avv. Carlo Alberto Calcagno: mediatore familiare e civile ODM Genova, commissario ADR COA Genova, formatore. Legal Tech, AI applicata alla mediazione e ADR. Tutti gli strumenti gratuiti di CalcoloMediazione." },
  "/contatti": { title: "Contatti - CalcoloMediazione", description: "Contatta il team di CalcoloMediazione per informazioni, supporto tecnico e collaborazioni." },
  "/antiriciclaggio": { title: "Antiriciclaggio in Mediazione \u2014 Obblighi e Modelli per Avvocati e Organismi", description: "Guida agli obblighi antiriciclaggio in mediazione (D.Lgs. 231/2007) e compilazione automatica dei modelli del fascicolo: adeguata verifica, titolare effettivo, scheda di rischio, segnalazione operazioni sospette." },
  "/antiriciclaggio-guida": { title: "Guida Semplice all'Antiriciclaggio in Mediazione \u2014 D.Lgs. 231/2007", description: "Guida in linguaggio semplice agli obblighi antiriciclaggio per mediatori e Organismi di mediazione: chi \u00e8 obbligato, cosa fare al tavolo, segnalazione operazioni sospette." },
  "/privacy-policy": { title: "Privacy Policy \u2014 CalcoloMediazione", description: "Informativa sul trattamento dei dati personali di CalcoloMediazione.it: titolare del trattamento, dati raccolti, finalit\u00e0 e modalit\u00e0 di utilizzo, diritti dell'utente ai sensi del GDPR (Regolamento UE 2016/679)." },
  "/cookie-policy": { title: "Cookie Policy \u2014 CalcoloMediazione", description: "Informativa sui cookie di CalcoloMediazione.it: cookie tecnici necessari e cookie analitici (Google Analytics), installati solo previo consenso esplicito dell'utente tramite il banner del Sito." },
  "/termini-condizioni": { title: "Termini e Condizioni \u2014 CalcoloMediazione", description: "Termini e condizioni d'uso di CalcoloMediazione.it: descrizione dei servizi gratuiti offerti, natura indicativa dei risultati dei calcolatori e limitazioni di responsabilit\u00e0." },
};

const PRIMARY_URL = "https://calcolomediazione.it";

// Route effettivamente registrate lato client in client/src/App.tsx.
// Usato per distinguere un 404 reale da una pagina esistente, cosi' da
// evitare i soft-404 (status 200 su URL inesistenti) segnalati in SEO-01.
const VALID_CLIENT_ROUTES = new Set<string>([
  "/",
  "/calcolatore",
  "/analisi-caso-ai",
  "/faq",
  "/guida-dm-150",
  "/confronto-costi",
  "/costi-notarili",
  "/privacy-policy",
  "/cookie-policy",
  "/termini-condizioni",
  "/chi-siamo",
  "/contatti",
  "/glossario",
  "/generatore-procura",
  "/giurisprudenza",
  "/credito-imposta",
  "/strategie-negoziazione",
  "/mediazione-obbligatoria-quanto-costa",
  "/antiriciclaggio",
  "/antiriciclaggio-guida",
  "/admin",
]);

function isKnownRoute(reqPath: string): boolean {
  if (VALID_CLIENT_ROUTES.has(reqPath)) return true;
  // Route dinamica /giurisprudenza/:slug
  if (/^\/giurisprudenza\/[^/]+$/.test(reqPath)) return true;
  return false;
}

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

  // Intercept homepage before static middleware to inject SEO content
  app.get("/", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    const siteUrl = getSiteUrl(req);
    const homeTitle = SEO_PAGES["/"]?.title || "CalcoloMediazione";
    const homeDesc = SEO_PAGES["/"]?.description || "";
    html = html.replace('</head>', `  <link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:title" content="${homeTitle}" />\n    <meta property="og:description" content="${homeDesc}" />\n    <meta property="og:url" content="${siteUrl}/" />\n    <meta property="og:type" content="website" />\n    <meta property="og:site_name" content="CalcoloMediazione" />\n    <meta property="og:image" content="${siteUrl}/og-image.svg" />\n  </head>`);
    const seoHtml = SEO_CONTENT["/"];
    if (seoHtml) {
      html = html.replace('<div id="root"></div>', `<div id="root">${seoHtml}</div>`);
    }
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // For SEO: inject proper meta tags for known pages
  app.use("/{*path}", (req, res) => {
    // Express 5 con pattern "/{*path}" restituisce req.params["path"] come
    // array di segmenti (non stringa) per i path con piu' livelli — es.
    // /giurisprudenza/:slug diventa ["giurisprudenza","slug"]. Un semplice
    // template literal produrrebbe "/giurisprudenza,slug" (join con virgola),
    // rompendo sia il lookup SEO_PAGES/SEO_CONTENT sia il nuovo controllo
    // isKnownRoute() di SEO-01. Ricostruiamo quindi il path unendo i segmenti
    // con "/".
    const pathParam = req.params["path"];
    const reqPath = pathParam
      ? `/${Array.isArray(pathParam) ? pathParam.join("/") : pathParam}`
      : "/";
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
        `  <link rel="canonical" href="${siteUrl}${reqPath}" />\n    <meta property="og:title" content="${seoPage.title}" />\n    <meta property="og:description" content="${seoPage.description}" />\n    <meta property="og:url" content="${siteUrl}${reqPath}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:site_name" content="CalcoloMediazione" />\n    <meta property="og:image" content="${siteUrl}/og-image.svg" />\n  </head>`
      );
    } else {
      // Unknown pages — just add canonical to current path
      html = html.replace(
        '</head>',
        `  <link rel="canonical" href="${siteUrl}${reqPath}" />\n  </head>`
      );
    }

    // Inject SEO pre-rendered content into <div id="root"> for Googlebot
    const seoHtml = SEO_CONTENT[reqPath];
    if (seoHtml) {
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${seoHtml}</div>`
      );
    }

    // SEO-01: le URL che non corrispondono a nessuna route reale dell'app
    // devono restituire HTTP 404 (soft-404 fix), mantenendo invariati il
    // markup e il design della pagina "Pagina non trovata" (not-found.tsx),
    // che viene comunque renderizzata lato client da React su qualunque path.
    if (!isKnownRoute(reqPath)) {
      res.status(404);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
}
