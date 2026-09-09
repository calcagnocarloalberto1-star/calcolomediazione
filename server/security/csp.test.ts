import assert from "node:assert/strict";
import {
  buildContentSecurityPolicy,
  createCspNonce,
  injectCspNonce,
} from "./csp";

const nonceA = createCspNonce();
const nonceB = createCspNonce();
assert.notEqual(nonceA, nonceB);
assert.match(nonceA, /^[A-Za-z0-9+/]{24}$/);

const policy = buildContentSecurityPolicy(nonceA);
assert.ok(policy.includes(`script-src 'self' 'nonce-${nonceA}'`));
assert.ok(policy.includes("script-src-attr 'none'"));
assert.ok(!policy.match(/script-src[^;]*'unsafe-inline'/));

const html = injectCspNonce(
  '<html><head><script src="/app.js"></script></head><body><script type="application/ld+json">{}</script></body></html>',
  nonceA,
);
assert.equal(html.split(`nonce="${nonceA}"`).length - 1, 2);
assert.ok(html.includes(`<meta name="csp-nonce" content="${nonceA}">`));

console.log("CSP tests passed");
