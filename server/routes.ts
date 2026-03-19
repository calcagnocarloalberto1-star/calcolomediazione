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
      const { titolo, descrizione, tipoAnalisi, valoreLite, tipoValore, parti, teorieSelezionate, documentiText, materiaImmobiliare, primaCasa, gratuitoPatrocinio } = req.body;

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
        gratuitoPatrocinio: gratuitoPatrocinio || false,
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
  opzioniEconomiche: { materiaImmobiliare: boolean; primaCasa: boolean; gratuitoPatrocinio: boolean } = { materiaImmobiliare: false, primaCasa: false, gratuitoPatrocinio: false }
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
