// Chat dell'analisi: se nessun provider AI risponde, la chat non deve ricevere un
// testo segnaposto (scelto in base a parole qualsiasi del prompt e poi salvato come
// risposta), ma un errore che il server trasforma in un messaggio chiaro.
import assert from "node:assert/strict";

delete process.env.ANTHROPIC_API_KEY;
delete process.env.GEMINI_API_KEY;

const { callLLM } = await import("./llm.js");

// Comportamento invariato per le sezioni dell'analisi: resta il segnaposto.
const segnaposto = await callLLM("Estrazione Entità (NER)", "domanda");
assert.match(segnaposto, /Configurare API Key/);

// Chat: nessun segnaposto, errore esplicito.
await assert.rejects(
  () => callLLM("Estrazione Entità (NER)", "domanda", undefined, { senzaSegnaposto: true }),
  /Nessun provider AI/,
);

console.log("chat fallback test passed");
