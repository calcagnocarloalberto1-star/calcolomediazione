import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { REGOLE_NO_PROFILAZIONE } from "./regole-no-profilazione.js";

// Le fasi dell'Analisi AI che trattano di persone devono includere le regole
// anti-profilazione (docs/PRIV-22-valutazione-art6-par4-analisi-ai.md).
for (const f of ["controllo-cognitivo", "compatibilita-interessi", "guida-strategica", "maan-batna"]) {
  const src = readFileSync(`server/ai/${f}.ts`, "utf8");
  assert.match(src, /import \{ REGOLE_NO_PROFILAZIONE \}/, `${f}: manca l'import delle regole`);
  assert.match(src, /\$\{REGOLE_NO_PROFILAZIONE\}/, `${f}: le regole non sono nel prompt di sistema`);
}

// Formulazioni che attribuivano un bias a una parte determinata.
const cog = readFileSync("server/ai/controllo-cognitivo.ts", "utf8");
assert.doesNotMatch(cog, /Come si manifesta nel caso specifico/);
assert.doesNotMatch(cog, /Livello di rischio\*\*: scala 1-5/);
const int = readFileSync("server/ai/compatibilita-interessi.ts", "utf8");
assert.doesNotMatch(int, /bisogni non dichiarati ma probabili/);

for (const frase of ["Non valutare", "Non attribuire a una parte", "ipotesi da verificare", "bozza di lavoro"]) {
  assert.ok(REGOLE_NO_PROFILAZIONE.includes(frase), `regole: manca «${frase}»`);
}
console.log("✅ prompt-no-profilazione.test.ts: asserzioni OK");
