// PRIV-17 - Protocollo tecnico a due fasi per il gating dei flussi AI su
// pratiche che possono contenere dati di minori.
// Specifica completa: docs/PRIV-17-presidi-rafforzati-minori-ai.md
//
// STATO DI QUESTA IMPLEMENTAZIONE (da non rimuovere senza aggiornare anche
// la specifica e l'audit): questo modulo implementa il protocollo tecnico
// (preflight a due fasi, gate fail-closed, rilevamento euristico, audit
// trail minimizzato). Il "percorso rafforzato" (dichiarazione si/non so)
// resta bloccato di default - MINORS_AI_PATH_ENABLED non impostato - finche
// non sono completati gli adempimenti elencati nella specifica sotto
// "Documentazione necessaria" (DPIA, accordo ex art. 28, registro art. 30,
// testo dell'avviso approvato dal titolare, ecc.) e non e stato eseguito il
// riesame indipendente richiesto per la chiusura di PRIV-02-D. Il gate
// generale CASE_AI_ENABLED/CASE_AI_GDPR_APPROVED resta la condizione
// sovraordinata e indipendente: se disattivato, nessuna di queste rotte e
// raggiungibile a prescindere da questo modulo.
//
// Limite noto e dichiarato: l'audit trail delle attestazioni e il registro
// dei token monouso vivono in memoria di processo, sullo stesso modello di
// ADMIN_SESSIONS in server/routes.ts - si azzerano a ogni riavvio/deploy e
// non sono condivisi tra piu istanze del server. Una persistenza durevole
// (tabella dedicata con migrazione Drizzle) e un'attivita di follow-up che
// richiede accesso al database di produzione, non disponibile in questo
// contesto di sviluppo.
//
// Importante per chi modifica questo file: a differenza di
// requireCaseAiEnabled/requireAmlAiEnabled (idempotenti, nessuno stato),
// requireMinorsPreflightToken CONSUMA il token (monouso). Va montato UNA
// SOLA VOLTA per richiesta, in fase di pre-parser gate (vedi
// registerMinorsPreflightGates), e NON va ripetuto anche sulla singola route
// come "difesa in profondita": una seconda verifica troverebbe il token gia
// consumato dalla prima e rifiuterebbe richieste legittime.

import crypto from "crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { isCaseAiEnabled } from "../privacy-controls.js";
import { MINORS_NOTICE_VERSION, MINORS_CONFIRMATION_COUNT } from "../../shared/minori-preflight.js";

export { MINORS_NOTICE_VERSION, MINORS_CONFIRMATION_COUNT };

const PREFLIGHT_TTL_MS = 5 * 60 * 1000;
const AUDIT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export function isMinorsPathEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
    return env.MINORS_AI_PATH_ENABLED === "true";
}

const PREFLIGHT_SECRET_CONFIGURED = Boolean(process.env.MINORS_PREFLIGHT_SECRET);
const PREFLIGHT_SECRET = process.env.MINORS_PREFLIGHT_SECRET || crypto.randomBytes(32).toString("hex");
if (!PREFLIGHT_SECRET_CONFIGURED) {
    console.warn(
          "[MINORS_PREFLIGHT_SECRET] Variabile non impostata: generato un valore casuale solo per questo processo. " +
          "Tutti i token preflight emessi finora diventeranno invalidi al prossimo riavvio/deploy (i token durano " +
          "comunque solo pochi minuti, quindi l'impatto pratico e limitato). Imposta MINORS_PREFLIGHT_SECRET come " +
          "variabile d'ambiente fissa in produzione."
        );
}

export type MinorsStatus = "yes" | "no" | "unknown";
const VALID_STATUS = new Set<MinorsStatus>(["yes", "no", "unknown"]);

interface PreflightRecord {
    exp: number;
    flowId: string;
    status: MinorsStatus;
    scope: string;
}
// Registro dei token emessi e non ancora consumati (monouso). La chiave e il
// jti. Il consumo e "get poi delete" senza alcun `await` frapposto: essendo
// Node a singolo thread per l'esecuzione sincrona, due richieste concorrenti
// non possono entrambe superare il controllo con lo stesso jti (test di
// accettazione n.8).
const PREFLIGHT_STORE = new Map<string, PreflightRecord>();

function sweepExpiredTokens(): void {
    const now = Date.now();
    for (const [jti, rec] of PREFLIGHT_STORE) {
          if (rec.exp < now) PREFLIGHT_STORE.delete(jti);
    }
}
setInterval(sweepExpiredTokens, 60 * 1000).unref();

interface AuditEntry {
    id: string;
    pseudoId: string;
    timestamp: number;
    noticeVersion: string;
    status: MinorsStatus | "invalid";
    scope: string;
    confirmations?: boolean[];
    esito: "emesso" | "rifiutato";
}
// Audit trail minimizzato (PRIV-17, sezione "Conferme separate"): solo
// identificativo pseudonimo, data, versione dei testi e valori booleani
// delle conferme. Mai contenuto della pratica.
const AUDIT_TRAIL: AuditEntry[] = [];

function pseudoIdFromFlow(flowId: string): string {
    return crypto.createHash("sha256").update(`priv17-audit:${flowId}`).digest("hex").slice(0, 24);
}

function cleanupAudit(): void {
    const cutoff = Date.now() - AUDIT_RETENTION_MS;
    while (AUDIT_TRAIL.length && AUDIT_TRAIL[0].timestamp < cutoff) AUDIT_TRAIL.shift();
}
setInterval(cleanupAudit, 60 * 60 * 1000).unref();

function recordAudit(entry: Omit<AuditEntry, "id" | "timestamp">): void {
    AUDIT_TRAIL.push({ id: crypto.randomBytes(8).toString("hex"), timestamp: Date.now(), ...entry });
}

/** Sola lettura per l'area admin. Non restituisce mai contenuto della pratica. */
export function getMinorsAuditTrail(): AuditEntry[] {
    cleanupAudit();
    return AUDIT_TRAIL.slice().reverse();
}

/** Cancellazione anticipata di una singola attestazione (richiesta dal titolare o dall'interessato tramite il titolare). */
export function deleteMinorsAuditEntry(id: string): boolean {
    const idx = AUDIT_TRAIL.findIndex(e => e.id === id);
    if (idx === -1) return false;
    AUDIT_TRAIL.splice(idx, 1);
    return true;
}

function sign(payload: string): string {
    return crypto.createHmac("sha256", PREFLIGHT_SECRET).update(payload).digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

const FLOW_ID_RE = /^[A-Za-z0-9_-]{16,128}$/;
const TOKEN_RE = /^mp1:(yes|no|unknown):([a-z0-9_-]+):([A-Za-z0-9_-]{16,128}):(\d+):([a-f0-9]{32}):([a-f0-9]{64})$/;

function issueToken(status: MinorsStatus, flowId: string, scope: string): { token: string; expiresInSeconds: number } {
    const jti = crypto.randomBytes(16).toString("hex");
    const exp = Date.now() + PREFLIGHT_TTL_MS;
    const payload = `mp1:${status}:${scope}:${flowId}:${exp}:${jti}`;
    const sig = sign(payload);
    PREFLIGHT_STORE.set(jti, { exp, flowId, status, scope });
    return {
          token: Buffer.from(`${payload}:${sig}`).toString("base64url"),
          expiresInSeconds: Math.floor(PREFLIGHT_TTL_MS / 1000),
    };
}

interface ConsumeResult {
    ok: boolean;
    status?: MinorsStatus;
    reason?: string;
}
function consumeToken(token: string, flowId: string, scope: string): ConsumeResult {
    if (!token || !flowId) return { ok: false, reason: "missing" };
    let decoded: string;
    try {
          decoded = Buffer.from(token, "base64url").toString("utf8");
    } catch {
          return { ok: false, reason: "malformed" };
    }
    const m = decoded.match(TOKEN_RE);
    if (!m) return { ok: false, reason: "malformed" };
    const [, status, tokScope, tokFlowId, expStr, jti, sig] = m;
    const payload = `mp1:${status}:${tokScope}:${tokFlowId}:${expStr}:${jti}`;
    const expected = sign(payload);
    if (!timingSafeEqualHex(sig, expected)) return { ok: false, reason: "signature" };

  // Lettura e cancellazione senza `await` frapposto: consumo atomico.
  const rec = PREFLIGHT_STORE.get(jti);
    if (!rec) return { ok: false, reason: "unknown-or-already-used" };
    PREFLIGHT_STORE.delete(jti);

  if (Date.now() > rec.exp || Date.now() > Number(expStr)) return { ok: false, reason: "expired" };
    if (rec.flowId !== flowId || rec.flowId !== tokFlowId) return { ok: false, reason: "flow-mismatch" };
    if (rec.scope !== scope || tokScope !== scope) return { ok: false, reason: "scope-mismatch" };
    if (rec.status !== status) return { ok: false, reason: "tampered" };
    return { ok: true, status: rec.status };
}

function parseConfirmations(header: string): boolean[] | null {
    if (!header) return null;
    const parts = header.split(",").map(s => s.trim());
    if (parts.length !== MINORS_CONFIRMATION_COUNT) return null;
    if (!parts.every(p => p === "0" || p === "1")) return null;
    return parts.map(p => p === "1");
}

const SCOPE = "case-ai";

/**
 * Fase 1 - endpoint di preflight, montato prima dei parser globali (vedi
 * server/index.ts). Legge SOLO header a valori chiusi, mai un body: la
 * classificazione non puo provenire dallo stesso contenuto che il gate deve
 * poter bloccare.
 */
export function registerMinorsPreflightRoute(app: Express): void {
    app.post("/api/analisi/minori-preflight", (req: Request, res: Response) => {
          if (!isCaseAiEnabled()) {
                  return res.status(503).json({
                            error: "L'Analisi AI e temporaneamente sospesa per completare le verifiche privacy e contrattuali.",
                            code: "CASE_AI_DISABLED",
                  });
          }

                 const status = String(req.headers["x-minors-status"] || "") as MinorsStatus | "";
          const noticeVersion = String(req.headers["x-notice-version"] || "");
          const flowId = String(req.headers["x-case-flow-id"] || "");

                 if (!status || !VALID_STATUS.has(status)) {
                         recordAudit({ pseudoId: pseudoIdFromFlow(flowId || "sconosciuto"), noticeVersion, status: "invalid", scope: SCOPE, esito: "rifiutato" });
                         return res.status(422).json({
                                   error: "Occorre indicare se la pratica contiene o puo contenere dati di minori prima di procedere.",
                                   code: "MINORS_STATUS_INVALID",
                         });
                 }
          if (!noticeVersion || noticeVersion !== MINORS_NOTICE_VERSION) {
                  return res.status(422).json({
                            error: "L'avviso privacy mostrato non e aggiornato: ricarica la pagina e riprova.",
                            code: "MINORS_NOTICE_STALE",
                  });
          }
          if (!FLOW_ID_RE.test(flowId)) {
                  return res.status(422).json({
                            error: "Identificativo di sessione mancante o non valido.",
                            code: "MINORS_FLOW_ID_INVALID",
                  });
          }

                 let confirmations: boolean[] | undefined;
          if (status === "yes" || status === "unknown") {
                  if (!isMinorsPathEnabled()) {
                            recordAudit({ pseudoId: pseudoIdFromFlow(flowId), noticeVersion, status, scope: SCOPE, esito: "rifiutato" });
                            return res.status(503).json({
                                        error: "Il percorso rafforzato per pratiche con possibili dati di minori non e ancora attivo: la pratica non puo essere trattata con l'AI in questo momento.",
                                        code: "MINORS_PATH_DISABLED",
                            });
                  }
                  const parsed = parseConfirmations(String(req.headers["x-minors-confirmations"] || ""));
                  if (!parsed || parsed.some(v => v !== true)) {
                            recordAudit({ pseudoId: pseudoIdFromFlow(flowId), noticeVersion, status, scope: SCOPE, confirmations: parsed || undefined, esito: "rifiutato" });
                            return res.status(422).json({
                                        error: "Tutte le conferme richieste per il percorso rafforzato devono essere spuntate separatamente.",
                                        code: "MINORS_CONFIRMATIONS_MISSING",
                            });
                  }
                  confirmations = parsed;
          }

                 const issued = issueToken(status, flowId, SCOPE);
          recordAudit({ pseudoId: pseudoIdFromFlow(flowId), noticeVersion, status, scope: SCOPE, confirmations, esito: "emesso" });
          res.json(issued);
    });
}

/**
 * Fase 2 - verifica e consumo del token, da montare prima dei parser globali
 * (vedi nota in testa al file: NON idempotente, va montato una sola volta).
 */
export function requireMinorsPreflightToken(req: Request, res: Response, next: NextFunction): void {
    const token = String(req.headers["x-minors-preflight-token"] || "");
    const flowId = String(req.headers["x-case-flow-id"] || "");
    const result = consumeToken(token, flowId, SCOPE);
    if (!result.ok) {
          res.status(422).json({
                  error: "Verifica preliminare sui dati di minori mancante, scaduta o non valida per questa richiesta. Ripetere la procedura.",
                  code: "MINORS_PREFLIGHT_REQUIRED",
          });
          return;
    }
    (req as Request & { minorsStatus?: MinorsStatus }).minorsStatus = result.status;
    next();
}

export function registerMinorsPreflightGates(app: Express): void {
    app.post(
          ["/api/upload-pdf", "/api/analisi", "/api/analisi/:id/chat"],
          requireMinorsPreflightToken,
        );
}
