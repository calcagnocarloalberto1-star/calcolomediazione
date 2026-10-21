// Prova diagnostica del controllo di significato (revisore LLM) su UNA sola sezione.
// Genera la fase «bias cognitivi» del caso 1 (caso sintetico), poi mostra la risposta grezza del
// revisore, quante righe segnala e quali (prime 25, troncate). Non modifica nulla.
// Uso: ANTHROPIC_API_KEY=... npx tsx server/ai/prova-revisore.ts
import { controlloBiasCognitivi } from "./controllo-cognitivo.js";
import { individuaConLLM } from "./guardia-no-profilazione.js";

process.env.PROVA_DEBUG = "1"; // stampa la risposta grezza del revisore (solo caso sintetico)
const testo = await controlloBiasCognitivi(
  "Locazione commerciale, nove canoni non pagati per 23.450 €; il chiamato attribuisce il calo degli incassi ai lavori stradali. Proposta del chiamato: 16.000 € a saldo.",
  [{ nome: "E.M.", ruolo: "istante" }, { nome: "P.G. S.r.l.", ruolo: "chiamato" }],
  ["ancoraggio", "avversione_perdita", "overconfidence", "sunk_cost"],
  "",
);
const righe = testo.split("\n");
console.log(`Testo generato: ${righe.length} righe, ${righe.filter(r => r.trim()).length} non vuote, ${righe.filter(r => r.includes("frase omessa")).length} già omesse dal controllo per parole`);
const idx = await individuaConLLM(righe);
console.log(`Il revisore segnala ${idx.length} righe`);
for (const i of idx.slice(0, 25)) console.log(`${i + 1}| ${righe[i].slice(0, 180)}`);
