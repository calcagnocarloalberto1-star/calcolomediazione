/**
 * Endpoint /api/client-error: riceve eccezioni JS lato client e le inoltra
 * a un Google Apps Script Web App (ERROR_LOG_WEBHOOK_URL).
 *
 * - Validazione zod
 * - Rate-limit in-memory per IP (60 errori/h)
 * - Forward fire-and-forget al webhook (non blocca la risposta al client)
 * - Log su stdout sempre, anche se il webhook è assente o down
 */

import type { Express, Request, Response } from "express";
import { z } from "zod";

const ClientErrorSchema = z.object({
  timestamp: z.string().max(40),
  session_id: z.string().max(80),
  route: z.string().max(500),
  message: z.string().min(1).max(500),
  stack: z.string().max(2000).default(""),
  source: z.string().max(300).default(""),
  line: z.number().int().min(0).max(1_000_000).default(0),
  column: z.number().int().min(0).max(1_000_000).default(0),
  user_agent: z.string().max(300).default(""),
  viewport_width: z.number().int().min(0).max(10000).default(0),
  viewport_height: z.number().int().min(0).max(10000).default(0),
  is_mobile: z.boolean().default(false),
  component_tag: z.string().max(60).default("global"),
  severity: z.enum(["error", "warning", "boundary"]).default("error"),
  build_hash: z.string().max(40).default("unknown"),
});

const WINDOW_MS = 60 * 60 * 1000; // 1h
const MAX_PER_IP = 60;
const rateBucket = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt < now) {
    rateBucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_PER_IP) return true;
  return false;
}

// Pulizia periodica della map (evita memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateBucket.entries())) {
    if (entry.resetAt < now) rateBucket.delete(ip);
  }
}, 15 * 60 * 1000).unref?.();

async function forwardToSheets(
  payload: z.infer<typeof ClientErrorSchema>,
): Promise<void> {
  const url = process.env.ERROR_LOG_WEBHOOK_URL;
  if (!url) return;
  try {
    // Apps Script accetta POST con content-type text/plain per evitare
    // preflight CORS. Mandiamo JSON serializzato dentro il body.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    // Log ma non fallire: il client ha già ricevuto 204.
    console.warn("[client-errors] forward failed:", (err as Error).message);
  }
}

export function registerClientErrorRoute(app: Express): void {
  app.post("/api/client-error", async (req: Request, res: Response) => {
    const ip =
      ((req.headers["x-forwarded-for"] as string) || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";

    if (rateLimited(ip)) {
      return res.status(429).json({ ok: false, reason: "rate_limited" });
    }

    const parsed = ClientErrorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, reason: "invalid_payload" });
    }

    const payload = { ...parsed.data, ip_hash: hashIp(ip) };

    // Log strutturato (visibile nei log Render)
    console.log(
      `[client-error] ${payload.severity} mobile=${payload.is_mobile} tag=${payload.component_tag} route=${payload.route} msg="${payload.message.slice(0, 120)}"`,
    );

    // Fire-and-forget verso il webhook (non aspettiamo la risposta)
    void forwardToSheets(parsed.data);

    // 204 No Content: il client non deve gestire una risposta.
    return res.status(204).end();
  });
}

/**
 * Hash deterministico ma non reversibile dell'IP (privacy-preserving).
 * Usa una semplice djb2 perché l'IP non è un segreto e ci basta un dedup id.
 */
function hashIp(ip: string): string {
  let h = 5381;
  for (let i = 0; i < ip.length; i++) {
    h = (h * 33) ^ ip.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}
