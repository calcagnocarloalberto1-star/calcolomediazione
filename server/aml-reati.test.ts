// PRIV-19: la dichiarazione sui dati relativi a condanne e reati (art. 10 GDPR)
// deve essere identica fra server, pagina e script, e imposta sulle due route AML.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AML_REATI_DECLARATION_TEXT, AML_REATI_DECLARATION_VERSION } from "../shared/aml-reati.js";

const js = readFileSync("client/public/antiriciclaggio.js", "utf8");
const html = readFileSync("client/public/antiriciclaggio.html", "utf8");
const routes = readFileSync("server/routes.ts", "utf8");

assert.ok(js.includes(`const AML_REATI_DECLARATION_VERSION = "${AML_REATI_DECLARATION_VERSION}";`), "versione diversa nello script");
assert.ok(js.includes('fd.append("dichiarazioneReati", AML_REATI_DECLARATION_VERSION)'), "lo script non invia la dichiarazione");
assert.ok(html.includes(AML_REATI_DECLARATION_TEXT), "testo diverso nella pagina");
assert.ok(html.includes('id="assist_reati"'), "casella assente nella pagina");
for (const path of ["/api/aml-extract", "/api/aml-assist"]) {
  const re = new RegExp(`app\\.post\\("${path}",[^\\n]*requireAmlReatiDeclaration`);
  assert.ok(re.test(routes), `gate assente su ${path}`);
}
console.log("aml-reati.test.ts: ok");
