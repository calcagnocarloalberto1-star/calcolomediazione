import crypto from "crypto";

export function createCspNonce(): string {
  return crypto.randomBytes(18).toString("base64");
}

export function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://www.googletagmanager.com`,
    "script-src-attr 'none'",
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
    "img-src 'self' data: blob:",
    "frame-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Autorizza gli script presenti nell'HTML generato dal server e rende il nonce
 * disponibile al client per gli script JSON-LD creati dopo la navigazione SPA.
 */
export function injectCspNonce(html: string, nonce: string): string {
  const withScriptNonces = html.replace(
    /<script(?![^>]*\bnonce=)/gi,
    `<script nonce="${nonce}"`,
  );

  if (/<meta\s+name=["']csp-nonce["']/i.test(withScriptNonces)) {
    return withScriptNonces;
  }

  return withScriptNonces.replace(
    /<\/head>/i,
    `  <meta name="csp-nonce" content="${nonce}">\n</head>`,
  );
}
