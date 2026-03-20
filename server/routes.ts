import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { storage } from "./storage.js";
import { estrazioneEntita } from "./ai/ner-extraction.js";
import { analisiGiuridica } from "./ai/analisi-giuridica.js";
import { guidaStrategica } from "./ai/guida-strategica.js";
import { analisiMaanBatna } from "./ai/maan-batna.js";
import { compatibilitaInteressi } from "./ai/compatibilita-interessi.js";
import { controlloBiasCognitivi } from "./ai/controllo-cognitivo.js";
import { bozzaAccordo } from "./ai/bozza-accordo.js";
import { analisiEconomica } from "./ai/analisi-economica.js";
import { callLLM } from "./ai/llm.js";
import { generateAnalisiPdf } from "./pdf-export.js";
import { stats } from "./stats.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Track all page views (non-API requests are tracked via a dedicated endpoint)
  app.post("/api/track", (req, res) => {
    const { path } = req.body;
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    stats.track('page_view', path, userAgent, ip);
    res.json({ ok: true });
  });

  // Admin stats - password protected
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CalcoloMediazione2026!";

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      // Simple token - in production use JWT
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Password errata" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Non autorizzato" });
    }
    const token = auth.slice(7);
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      if (!decoded.startsWith("admin:")) {
        return res.status(401).json({ error: "Token non valido" });
      }
      res.json(stats.getStats());
    } catch {
      res.status(401).json({ error: "Token non valido" });
    }
  });

  // === ANALISI AI ===

  // Upload PDF and extract text
  app.post("/api/upload-pdf", upload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nessun file caricato" });
      }

      const results: Array<{ filename: string; text: string; pages: number }> = [];

      for (const file of files) {
        try {
          const uint8 = new Uint8Array(file.buffer);
          const parser = new PDFParse(uint8);
          await parser.load();
          const textResult = await parser.getText();
          const info = await parser.getInfo();
          results.push({
            filename: file.originalname,
            text: textResult.text || "",
            pages: info.total || 0,
          });
          parser.destroy();
        } catch (pdfErr) {
          console.error(`Errore parsing PDF ${file.originalname}:`, pdfErr);
          results.push({
            filename: file.originalname,
            text: `[Errore nella lettura del file ${file.originalname}]`,
            pages: 0,
          });
        }
      }

      stats.track('upload_pdf');
      res.json({ files: results });
    } catch (error) {
      console.error("Errore upload PDF:", error);
      res.status(500).json({ error: "Errore nell'elaborazione dei file" });
    }
  });

  // Create new analysis and run pipeline
  app.post("/api/analisi", async (req, res) => {
    try {
      const { titolo, descrizione, tipoAnalisi, modalitaTariffaria, valoreLite, tipoValore, parti, teorieSelezionate, documentiText, materiaImmobiliare, primaCasa, renditaCatastale, categoriaCatastale, gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa } = req.body;

      if (!titolo || !descrizione) {
        return res.status(400).json({ error: "Titolo e descrizione sono obbligatori" });
      }

      // Create initial record
      const analisi = await storage.createAnalisi({
        titolo,
        descrizione,
        tipoAnalisi: tipoAnalisi || "mediazione",
        valoreLite: valoreLite || null,
        tipoValore: tipoValore || "determinato",
        parti: parti || [],
        stato: "in_corso",
        analisiGiuridica: null,
        guidaStrategica: null,
        analisiMaanBatna: null,
        compatibilitaInteressi: null,
        controlloBiasCognitivi: null,
        bozzaAccordo: null,
        analisiEconomica: null,
        prospettoEconomico: null,
        chatHistory: [],
      });

      stats.track('analisi_ai');

      // Run pipeline async
      runPipeline(analisi.id, descrizione, parti || [], tipoAnalisi || "mediazione", valoreLite, teorieSelezionate || ["ancoraggio", "avversione_perdita", "framing", "overconfidence", "sunk_cost", "availability", "teoria_giochi", "decision_analysis", "mcda", "teoria_prospetto"], documentiText || "", {
        materiaImmobiliare: materiaImmobiliare || false,
        primaCasa: primaCasa || false,
        renditaCatastale: renditaCatastale || null,
        categoriaCatastale: categoriaCatastale || null,
        gratuitoPatrocinio: gratuitoPatrocinio || false,
        mediatoreEsperto: mediatoreEsperto || false,
        proceduraComplessa: proceduraComplessa || false,
        modalitaTariffaria: modalitaTariffaria || "nazionale",
      });

      res.json(analisi);
    } catch (error) {
      console.error("Errore creazione analisi:", error);
      res.status(500).json({ error: "Errore interno del server" });
    }
  });

  // Get all analyses
  app.get("/api/analisi", async (_req, res) => {
    const analisi = await storage.getAllAnalisi();
    res.json(analisi);
  });

  // Get single analysis
  app.get("/api/analisi/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const analisi = await storage.getAnalisi(id);
    if (!analisi) {
      return res.status(404).json({ error: "Analisi non trovata" });
    }
    res.json(analisi);
  });

  // Export analysis as PDF
  app.get("/api/analisi/:id/pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analisi = await storage.getAnalisi(id);
      if (!analisi) {
        return res.status(404).json({ error: "Analisi non trovata" });
      }
      if (analisi.stato !== "completata") {
        return res.status(400).json({ error: "Analisi non ancora completata" });
      }

      // Anonymization support
      const shouldAnonymize = req.query.anonimizza === '1';
      let analisiForPdf = analisi;
      if (shouldAnonymize) {
        const partiList = (analisi.parti as Array<{ nome: string; ruolo: string }>) || [];
        const labels = ["Parte A", "Parte B", "Parte C", "Parte D", "Parte E", "Parte F"];
        const anonReplace = (text: string | null): string | null => {
          if (!text) return text;
          let result = text;
          partiList.forEach((p, i) => {
            if (p.nome && p.nome.trim()) {
              const nome = p.nome.trim();
              const label = labels[i] || `Parte ${String.fromCharCode(65 + i)}`;
              const regex = new RegExp(nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              result = result.replace(regex, label);
              const parts = nome.split(/\s+/);
              if (parts.length > 1) {
                const cognome = parts[parts.length - 1];
                if (cognome.length >= 3) {
                  const cognomeRegex = new RegExp(`\\b${cognome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                  result = result.replace(cognomeRegex, label);
                }
              }
            }
          });
          return result;
        };
        // Create anonymized copy
        const anonParti = partiList.map((p, i) => ({ nome: labels[i] || `Parte ${String.fromCharCode(65 + i)}`, ruolo: p.ruolo }));
        analisiForPdf = {
          ...analisi,
          titolo: anonReplace(analisi.titolo) || analisi.titolo,
          descrizione: anonReplace(analisi.descrizione) || analisi.descrizione,
          parti: anonParti,
          prospettoEconomico: anonReplace(analisi.prospettoEconomico),
          analisiGiuridica: anonReplace(analisi.analisiGiuridica),
          guidaStrategica: anonReplace(analisi.guidaStrategica),
          analisiMaanBatna: anonReplace(analisi.analisiMaanBatna),
          compatibilitaInteressi: anonReplace(analisi.compatibilitaInteressi),
          controlloBiasCognitivi: anonReplace(analisi.controlloBiasCognitivi),
          bozzaAccordo: anonReplace(analisi.bozzaAccordo),
          analisiEconomica: anonReplace(analisi.analisiEconomica),
        };
      }

      const pdfBuffer = generateAnalisiPdf(analisiForPdf);
      const prefix = shouldAnonymize ? 'anonimo-' : '';
      const filename = `${prefix}analisi-${analisi.titolo.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.pdf`;

      stats.track('pdf_export');
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Errore generazione PDF:", error);
      res.status(500).json({ error: "Errore nella generazione del PDF" });
    }
  });

  // Delete analysis
  app.delete("/api/analisi/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteAnalisi(id);
    if (!deleted) {
      return res.status(404).json({ error: "Analisi non trovata" });
    }
    res.json({ success: true });
  });

  // Chat continuation
  app.post("/api/analisi/:id/chat", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { message } = req.body;

      const analisi = await storage.getAnalisi(id);
      if (!analisi) {
        return res.status(404).json({ error: "Analisi non trovata" });
      }

      const chatHistory = analisi.chatHistory || [];

      // Build context from analysis results
      const context = [
        analisi.prospettoEconomico ? `Estrazione Entità (NER):\n${analisi.prospettoEconomico}` : "",
        analisi.analisiGiuridica ? `Analisi Giuridica:\n${analisi.analisiGiuridica}` : "",
        analisi.guidaStrategica ? `Guida Strategica:\n${analisi.guidaStrategica}` : "",
        analisi.analisiMaanBatna ? `MAAN/BATNA:\n${analisi.analisiMaanBatna}` : "",
        analisi.compatibilitaInteressi ? `Compatibilità Interessi:\n${analisi.compatibilitaInteressi}` : "",
        analisi.controlloBiasCognitivi ? `Bias Cognitivi:\n${analisi.controlloBiasCognitivi}` : "",
        analisi.bozzaAccordo ? `Bozza Accordo:\n${analisi.bozzaAccordo}` : "",
        analisi.analisiEconomica ? `Analisi Economica Comparativa:\n${analisi.analisiEconomica}` : "",
      ].filter(Boolean).join("\n\n---\n\n");

      const partiStr = (analisi.parti as Array<{nome: string; ruolo: string}>)?.map(p => `${p.nome} (${p.ruolo})`).join(", ") || "Non specificate";

      const systemPrompt = `Sei un assistente AI specializzato in mediazione civile e commerciale italiana. Hai già analizzato il seguente caso:

Titolo: ${analisi.titolo}
Descrizione: ${analisi.descrizione}
Parti: ${partiStr}
Valore della lite: ${analisi.valoreLite ? `EUR ${analisi.valoreLite}` : "Non specificato"}
Tipo analisi: ${analisi.tipoAnalisi}

Risultati dell'analisi:
${context}

Rispondi alle domande dell'utente sul caso, fornendo approfondimenti, chiarimenti e suggerimenti aggiuntivi. Usa un linguaggio professionale ma accessibile. Formatta le risposte in Markdown.`;

      const prevMessages = chatHistory.map(m => `${m.role === "user" ? "Utente" : "AI"}: ${m.content}`).join("\n");
      const userPrompt = prevMessages ? `${prevMessages}\n\nUtente: ${message}` : message;

      const aiResponse = await callLLM(systemPrompt, userPrompt);

      const now = new Date().toISOString();
      chatHistory.push({ role: "user", content: message, timestamp: now });
      chatHistory.push({ role: "assistant", content: aiResponse, timestamp: now });

      stats.track('chat_message');
      await storage.updateAnalisi(id, { chatHistory });

      res.json({ response: aiResponse, chatHistory });
    } catch (error) {
      console.error("Errore chat:", error);
      res.status(500).json({ error: "Errore nella risposta AI" });
    }
  });

  // === CALCOLI ===

  app.post("/api/calcolo", async (req, res) => {
    try {
      const calcolo = await storage.createCalcolo(req.body);
      stats.track('calcolo');
      res.json(calcolo);
    } catch (error) {
      console.error("Errore salvataggio calcolo:", error);
      res.status(500).json({ error: "Errore nel salvataggio" });
    }
  });

  app.get("/api/calcoli", async (_req, res) => {
    const calcoli = await storage.getAllCalcoli();
    res.json(calcoli);
  });

  // === SEO ENDPOINTS ===

  const PRIMARY_URL = "https://calcolomediazione.it";

  // Detect the actual domain from the request for multi-domain support
  function getSiteUrl(req: any): string {
    const host = req.hostname || req.headers.host?.split(':')[0] || 'calcolomediazione.it';
    if (host.includes('calcolomediazione.org')) return 'https://calcolomediazione.org';
    if (host.includes('calcolomediazione.it')) return 'https://calcolomediazione.it';
    return PRIMARY_URL;
  }

  const PAGES = [
    { path: "/", title: "CalcoloMediazione - Calcolatore Indennità Mediazione Civile", desc: "Piattaforma professionale per il calcolo delle indennità di mediazione D.M. 150/2023. Analisi AI del caso, confronto costi primo grado, appello e cassazione, stima CTU, esenzione prima casa, generatore procura.", priority: "1.0", changefreq: "weekly" },
    { path: "/calcolatore", title: "Calcolatore Indennità Mediazione D.M. 150/2023", desc: "Calcola le indennità di mediazione civile e commerciale secondo le tariffe del D.M. 150/2023. Doppia tariffa, esenzioni, compensi avvocato, costi notarili con esenzione prima casa.", priority: "0.9", changefreq: "monthly" },
    { path: "/analisi-caso-ai", title: "Analisi AI del Caso di Mediazione con Confronto Economico", desc: "Analisi completa del caso di mediazione con intelligenza artificiale: analisi giuridica, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico primo grado, appello e cassazione con stima CTU.", priority: "0.9", changefreq: "monthly" },
    { path: "/confronto-costi", title: "Confronto Costi Mediazione vs Processo: Primo Grado, Appello, Cassazione", desc: "Confronta i costi della mediazione con quelli del processo su tre gradi di giudizio. Contributo unificato, compensi avvocato, CTU in appello, parametri forensi D.M. 55/2014 Tabelle 2, 12 e 13.", priority: "0.8", changefreq: "monthly" },
    { path: "/faq", title: "FAQ Mediazione Civile - Domande Frequenti", desc: "Domande frequenti sulla mediazione civile e commerciale: indennità, costi, credito d'imposta, gratuito patrocinio, esenzione prima casa e analisi AI.", priority: "0.7", changefreq: "monthly" },
    { path: "/guida-dm-150", title: "Guida Completa D.M. 150/2023 - Tariffe Mediazione", desc: "Guida dettagliata al Decreto Ministeriale 150/2023 sulle tariffe di mediazione civile e commerciale. Tabelle, calcoli ed esempi pratici.", priority: "0.7", changefreq: "monthly" },
    { path: "/generatore-procura", title: "Generatore Procura Speciale per Mediazione", desc: "Genera la procura speciale per la mediazione civile con tutti i poteri necessari. Conforme al D.Lgs. 28/2010.", priority: "0.8", changefreq: "monthly" },
    { path: "/giurisprudenza", title: "Giurisprudenza Mediazione - Database Sentenze", desc: "Database di giurisprudenza sulla mediazione civile e commerciale. Sentenze di Cassazione, Tribunali e Corti d'Appello con ricerca avanzata.", priority: "0.7", changefreq: "weekly" },
    { path: "/credito-imposta", title: "Credito d'Imposta e Gratuito Patrocinio in Mediazione", desc: "Guida completa al credito d'imposta per la mediazione civile (D.M. 1° agosto 2023) e al gratuito patrocinio. Requisiti, importi e procedura.", priority: "0.7", changefreq: "monthly" },
    { path: "/strategie-negoziazione", title: "Strategie di Negoziazione per la Mediazione Civile", desc: "Guida alle principali strategie e tecniche di negoziazione nella mediazione civile: MAAN/BATNA, negoziazione integrativa, zone of possible agreement, ancoraggio e tecniche di comunicazione.", priority: "0.7", changefreq: "monthly" },
    { path: "/glossario", title: "Glossario della Mediazione Civile", desc: "Glossario completo dei termini utilizzati nella mediazione civile e commerciale. Definizioni chiare e riferimenti normativi.", priority: "0.5", changefreq: "monthly" },
    { path: "/chi-siamo", title: "Chi Siamo - CalcoloMediazione", desc: "Scopri il team dietro CalcoloMediazione, la piattaforma professionale per mediatori civili e commerciali.", priority: "0.4", changefreq: "yearly" },
    { path: "/contatti", title: "Contatti - CalcoloMediazione", desc: "Contatta il team di CalcoloMediazione per informazioni, supporto tecnico e collaborazioni.", priority: "0.4", changefreq: "yearly" },
  ];

  // Sitemap XML
  app.get("/sitemap.xml", (req, res) => {
    const siteUrl = getSiteUrl(req);
    const today = new Date().toISOString().slice(0, 10);
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of PAGES) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${page.path === "/" ? "" : page.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });

  // Google Search Console verification
  app.get("/googleb2392e1f3564a1be.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: googleb2392e1f3564a1be.html");
  });

  // OG Image (SVG served as image for social sharing)
  app.get("/og-image.svg", (_req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f0eb"/>
  <rect width="1200" height="8" fill="#c55a2b"/>
  <rect x="60" y="50" width="1080" height="530" fill="none" stroke="#2d2926" stroke-width="4"/>
  <text x="100" y="150" font-family="sans-serif" font-weight="bold" font-size="60" fill="#2d2926">CalcoloMediazione</text>
  <text x="100" y="215" font-family="sans-serif" font-weight="bold" font-size="34" fill="#c55a2b">Mediazione e Negoziazione con AI</text>
  <rect x="100" y="240" width="200" height="4" fill="#2d2926"/>
  <text font-family="sans-serif" font-size="24" fill="#2d2926">
    <tspan x="100" y="300">&#x2666; Analisi AI del caso</tspan>
    <tspan x="100" y="340">&#x2666; Confronto costi su 3 gradi</tspan>
    <tspan x="100" y="380">&#x2666; Calcolatore indennit\u00e0</tspan>
    <tspan x="620" y="300">&#x2666; Generatore procura</tspan>
    <tspan x="620" y="340">&#x2666; Database giurisprudenza</tspan>
    <tspan x="620" y="380">&#x2666; Credito d'imposta</tspan>
  </text>
  <rect x="100" y="420" width="1000" height="3" fill="#c55a2b"/>
  <text x="100" y="470" font-family="sans-serif" font-size="21" fill="#6b6560">D.M. 150/2023  \u2022  Primo Grado, Appello, Cassazione  \u2022  CTU  \u2022  Esenzione Prima Casa</text>
  <text x="100" y="530" font-family="sans-serif" font-weight="bold" font-size="26" fill="#2d2926">calcolomediazione.it</text>
  <rect x="880" y="500" width="220" height="48" rx="0" fill="#c55a2b"/>
  <text x="905" y="532" font-family="sans-serif" font-weight="bold" font-size="24" fill="#ffffff">100% Gratuito</text>
</svg>`;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    const siteUrl = getSiteUrl(req);
    const txt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

# Disallow admin and API
Disallow: /api/
Disallow: /#/admin
`;
    res.setHeader("Content-Type", "text/plain");
    res.send(txt);
  });

  return httpServer;
}

// Run the 8-step AI pipeline
async function runPipeline(
  id: number,
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  tipoAnalisi: string,
  valoreLite: number | null,
  teorieSelezionate: string[],
  documentiText: string,
  opzioniEconomiche: { materiaImmobiliare: boolean; primaCasa: boolean; renditaCatastale: number | null; categoriaCatastale: string | null; gratuitoPatrocinio: boolean; mediatoreEsperto: boolean; proceduraComplessa: boolean; modalitaTariffaria: string } = { materiaImmobiliare: false, primaCasa: false, renditaCatastale: null, categoriaCatastale: null, gratuitoPatrocinio: false, mediatoreEsperto: false, proceduraComplessa: false, modalitaTariffaria: "nazionale" }
) {
  try {
    // Step 1: NER Extraction
    const nerResult = await estrazioneEntita(descrizione, parti, documentiText);
    await storage.updateAnalisi(id, { prospettoEconomico: nerResult });

    // Step 2: Analisi Giuridica
    const giuridicaResult = await analisiGiuridica(descrizione, parti, nerResult, tipoAnalisi);
    await storage.updateAnalisi(id, { analisiGiuridica: giuridicaResult });

    // Step 3: Guida Strategica
    const strategicaResult = await guidaStrategica(descrizione, parti, `${nerResult}\n\n${giuridicaResult}`);
    await storage.updateAnalisi(id, { guidaStrategica: strategicaResult });

    // Step 4: MAAN/BATNA
    const maanResult = await analisiMaanBatna(descrizione, parti, valoreLite, `${giuridicaResult}\n\n${strategicaResult}`);
    await storage.updateAnalisi(id, { analisiMaanBatna: maanResult });

    // Prepare truncated contexts for later steps to prevent token overflow
    const giuridicaSummary = giuridicaResult.length > 8000 ? giuridicaResult.slice(0, 8000) + '\n\n[...continua...]' : giuridicaResult;
    const maanSummary = maanResult.length > 8000 ? maanResult.slice(0, 8000) + '\n\n[...continua...]' : maanResult;
    const strategicaSummary = strategicaResult.length > 8000 ? strategicaResult.slice(0, 8000) + '\n\n[...continua...]' : strategicaResult;

    // Step 5: Compatibilità Interessi
    const compatibilitaResult = await compatibilitaInteressi(descrizione, parti, `${giuridicaSummary}\n\n${maanSummary}`);
    await storage.updateAnalisi(id, { compatibilitaInteressi: compatibilitaResult });

    // Step 6: Controllo Bias Cognitivi
    const biasResult = await controlloBiasCognitivi(descrizione, parti, teorieSelezionate, `${giuridicaSummary}\n\n${strategicaSummary}`);
    await storage.updateAnalisi(id, { controlloBiasCognitivi: biasResult });

    // Step 7: Bozza Accordo
    const bozzaResult = await bozzaAccordo(descrizione, parti, valoreLite, `${giuridicaSummary}\n\n${compatibilitaResult}`);
    await storage.updateAnalisi(id, { bozzaAccordo: bozzaResult });

    // Step 8: Analisi Economica Comparativa
    // Truncate context to prevent token overflow - keep first 6000 chars of each
    const truncGiuridica = giuridicaResult.length > 6000 ? giuridicaResult.slice(0, 6000) + '\n\n[...analisi giuridica troncata per brevità...]' : giuridicaResult;
    const truncMaan = maanResult.length > 6000 ? maanResult.slice(0, 6000) + '\n\n[...analisi MAAN troncata per brevità...]' : maanResult;
    const economicaResult = await analisiEconomica(descrizione, parti, valoreLite, tipoAnalisi, `${truncGiuridica}\n\n${truncMaan}`, opzioniEconomiche);
    await storage.updateAnalisi(id, { analisiEconomica: economicaResult, stato: "completata" });
    stats.track('analisi_complete');

  } catch (error) {
    console.error("Errore pipeline AI:", error);
    stats.track('analisi_error');
    await storage.updateAnalisi(id, { stato: "errore" });
  }
}
