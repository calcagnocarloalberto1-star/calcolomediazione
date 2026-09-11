import type { Express, RequestHandler } from "express";

export function isAmlAiEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.AML_AI_ENABLED === "true"
    && env.AML_AI_GDPR_APPROVED === "true";
}

export function isCaseAiEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.CASE_AI_ENABLED === "true"
    && env.CASE_AI_GDPR_APPROVED === "true";
}

export const requireAmlAiEnabled: RequestHandler = (_req, res, next) => {
  if (!isAmlAiEnabled()) {
    res.status(503).json({
      error: "L'assistente AI antiriciclaggio è temporaneamente sospeso. La compilazione manuale locale resta disponibile.",
      code: "AML_AI_DISABLED",
    });
    return;
  }
  next();
};

export const requireCaseAiEnabled: RequestHandler = (_req, res, next) => {
  if (!isCaseAiEnabled()) {
    res.status(503).json({
      error: "L'Analisi AI è temporaneamente sospesa per completare le verifiche privacy e contrattuali. Le analisi già create restano consultabili e cancellabili con il relativo token.",
      code: "CASE_AI_DISABLED",
    });
    return;
  }
  next();
};

/**
 * Monta i gate prima dei parser globali. I gate ripetuti sulle singole route
 * restano intenzionalmente come difesa in profondità.
 */
export function registerPrivacyPreParserGates(app: Express): void {
  app.post(
    ["/api/upload-pdf", "/api/analisi", "/api/analisi/:id/chat"],
    requireCaseAiEnabled,
  );
  app.post(
    ["/api/aml-extract", "/api/aml-assist"],
    requireAmlAiEnabled,
  );
}
