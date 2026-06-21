/**
 * Client-side error logger.
 *
 * Cattura eccezioni JavaScript runtime (window.onerror + unhandledrejection)
 * e le invia all'endpoint /api/client-error che le inoltra a Google Sheets
 * (via Apps Script webhook).
 *
 * Caratteristiche:
 *  - Mobile-first: il flag is_mobile è true se viewport <768px OR UA touch.
 *  - sendBeacon per garantire l'invio anche durante navigation/unload.
 *  - Deduplicazione hash-based su 60s (evita flood dello stesso errore).
 *  - Rate-limit lato client: max 20 errori/sessione.
 *  - Session ID generato una volta per tab (sessionStorage).
 *  - Filtri rumore: ignora errori da estensioni browser, ResizeObserver loop,
 *    e network errors (offline/CORS) che non sono bug applicativi.
 */

export type ErrorSeverity = "error" | "warning" | "boundary";

export interface ClientErrorPayload {
  timestamp: string;
  session_id: string;
  route: string;
  message: string;
  stack: string;
  source: string;
  line: number;
  column: number;
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
  is_mobile: boolean;
  component_tag: string;
  severity: ErrorSeverity;
  build_hash: string;
}

const MAX_ERRORS_PER_SESSION = 20;
const DEDUPE_WINDOW_MS = 60_000;

// Pattern di errori da ignorare (rumore browser, non bug applicativi)
const IGNORE_PATTERNS = [
  /ResizeObserver loop/i,
  /Non-Error promise rejection captured/i,
  /Script error\.?$/i, // CORS-blocked errors da CDN esterni
  /Extension context invalidated/i,
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /Failed to fetch dynamically imported module/i, // chunk-load fallita (utente con cache stale)
];

let errorCount = 0;
const recentErrors = new Map<string, number>();

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem("__cm_err_sid");
    if (!sid) {
      sid =
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem("__cm_err_sid", sid);
    }
    return sid;
  } catch {
    return "no-storage";
  }
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.innerWidth < 768;
  const touchUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return narrow || touchUA;
}

function shouldIgnore(message: string): boolean {
  return IGNORE_PATTERNS.some((re) => re.test(message));
}

function hashError(message: string, source: string, line: number): string {
  return `${message}::${source}::${line}`;
}

function isDuplicate(key: string): boolean {
  const now = Date.now();
  // Pulizia entries vecchie
  for (const [k, ts] of Array.from(recentErrors.entries())) {
    if (now - ts > DEDUPE_WINDOW_MS) recentErrors.delete(k);
  }
  if (recentErrors.has(key)) return true;
  recentErrors.set(key, now);
  return false;
}

function getBuildHash(): string {
  // Vite inietta __BUILD_HASH__ via define se configurato, altrimenti fallback.
  try {
    const el = document.querySelector('script[src*="/assets/index-"]') as
      | HTMLScriptElement
      | null;
    if (el?.src) {
      const m = el.src.match(/index-([A-Za-z0-9]+)\.js/);
      if (m) return m[1];
    }
  } catch {
    /* noop */
  }
  return "unknown";
}

function getRoute(): string {
  try {
    return window.location.pathname + window.location.search;
  } catch {
    return "unknown";
  }
}

export function sendError(
  message: string,
  options: {
    stack?: string;
    source?: string;
    line?: number;
    column?: number;
    component_tag?: string;
    severity?: ErrorSeverity;
  } = {},
): void {
  if (typeof window === "undefined") return;
  if (errorCount >= MAX_ERRORS_PER_SESSION) return;
  if (!message || shouldIgnore(message)) return;

  const stack = options.stack || "";
  const source = options.source || "";
  const line = options.line || 0;
  const key = hashError(message, source, line);
  if (isDuplicate(key)) return;

  errorCount += 1;

  const payload: ClientErrorPayload = {
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    route: getRoute(),
    message: message.slice(0, 500),
    stack: stack.slice(0, 2000),
    source: source.slice(0, 300),
    line,
    column: options.column || 0,
    user_agent: navigator.userAgent.slice(0, 300),
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    is_mobile: isMobileDevice(),
    component_tag: options.component_tag || "global",
    severity: options.severity || "error",
    build_hash: getBuildHash(),
  };

  try {
    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "application/json" });
    // sendBeacon è preferibile perché funziona anche durante unload.
    if (navigator.sendBeacon && navigator.sendBeacon("/api/client-error", blob)) {
      return;
    }
    // Fallback fetch keepalive
    fetch("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow - non vogliamo loop di errori */
    });
  } catch {
    /* swallow */
  }
}

let installed = false;

export function installGlobalErrorHandlers(): void {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  window.addEventListener("error", (event: ErrorEvent) => {
    sendError(event.message || "unknown error", {
      stack: event.error?.stack,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      severity: "error",
    });
  });

  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "Unhandled promise rejection";
      const stack = reason instanceof Error ? reason.stack : "";
      sendError(message, {
        stack: stack || "",
        severity: "error",
        component_tag: "promise",
      });
    },
  );
}
