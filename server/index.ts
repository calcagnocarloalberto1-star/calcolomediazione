import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
// SEO-05: rimuove "X-Powered-By: Express", che rivela pubblicamente lo stack
// tecnico del server (informazione utile solo a chi cerca vulnerabilità note).
app.disable("x-powered-by");
const httpServer = createServer(app);

// PROPOSTA CSP/code-splitting (approvata): Content-Security-Policy in modalità
// Report-Only, prima fase del rollout descritto in
// docs/PROPOSTA-CSP-code-splitting.md. In questa modalità il browser NON blocca
// nulla: registra solo in console eventuali violazioni, permettendo di
// verificare per un periodo di osservazione che l'elenco di domini sia
// completo prima di passare a un CSP effettivo (Content-Security-Policy). Domini
// verificati nel codice sorgente: Google Fonts (style-src/font-src), Google
// Analytics (script-src/connect-src, caricato solo dopo consenso cookie),
// cdn.jsdelivr.net (script-src, libreria jsPDF nella pagina calcolo-assegni).
// Le chiamate all'AI (Anthropic/Gemini) avvengono lato server, non dal
// browser, quindi non richiedono voci qui. Lo script di bootstrap di Google
// Analytics è stato spostato in un file esterno (/ga-bootstrap.js) così
// script-src non necessita di 'unsafe-inline'.
const CSP_REPORT_ONLY =
  "default-src 'self'; " +
  "script-src 'self' https://cdn.jsdelivr.net https://www.googletagmanager.com; " +
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; " +
  "img-src 'self' data:; " +
  "frame-src 'self'; " +
  "object-src 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'";

// Header di sicurezza di base.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy-Report-Only", CSP_REPORT_ONLY);
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: '10mb',
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
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

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
})();
