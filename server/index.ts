import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { eliminaAnalisiScadute, storageReady, verifyStorageHealth } from "./storage";
import { serveStatic } from "./static";
import { createServer } from "http";
import { buildContentSecurityPolicy, createCspNonce } from "./security/csp";
import { registerPrivacyPreParserGates } from "./privacy-controls";

const app = express();
// Render inoltra il traffico attraverso un solo proxy. Limitare il trust al
// primo hop impedisce al client di falsificare req.ip tramite X-Forwarded-For.
app.set("trust proxy", 1);
// SEO-05: rimuove "X-Powered-By: Express", che rivela pubblicamente lo stack
// tecnico del server (informazione utile solo a chi cerca vulnerabilità note).
app.disable("x-powered-by");
const httpServer = createServer(app);

// Header di sicurezza di base.
app.use((_req, res, next) => {
  const cspNonce = createCspNonce();
  res.locals.cspNonce = cspNonce;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Content-Security-Policy", buildContentSecurityPolicy(cspNonce));
  next();
});

// Le risposte API possono contenere fascicoli, nominativi e risultati delle
// analisi: non devono essere memorizzate da browser o proxy intermedi.
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, private, max-age=0");
  res.setHeader("Pragma", "no-cache");
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Privacy fail-closed: le richieste AI disabilitate vengono respinte prima che
// Express legga JSON, form URL-encoded o upload. I gate nelle route costituiscono
// una seconda barriera e non sostituiscono questo livello applicativo.
registerPrivacyPreParserGates(app);

app.use(
  express.json({
    limit: "2mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Non si registrano i body delle risposte: possono contenere dati personali
      // (nomi, codici fiscali, indirizzi, contenuti delle analisi).
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  await storageReady;
  await verifyStorageHealth();
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    // Non propagare messaggi interni, query o dettagli dei provider al client.
    const message = status >= 500 ? "Errore interno del server" : (err.message || "Richiesta non valida");
    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );

  // PRIV-09 — garantisce la retention a 30 giorni indipendentemente dal
  // traffico (in precedenza girava solo come effetto collaterale della
  // creazione di una nuova analisi, vedi server/storage.ts). Un intervallo
  // ogni ora e' sufficiente per onorare la promessa fatta in privacy policy
  // senza bisogno di infrastruttura di scheduling esterna.
  eliminaAnalisiScadute().catch((err) => console.error("Errore pulizia analisi scadute:", err));
  setInterval(() => {
    eliminaAnalisiScadute().catch((err) => console.error("Errore pulizia analisi scadute:", err));
  }, 60 * 60 * 1000);
})();
