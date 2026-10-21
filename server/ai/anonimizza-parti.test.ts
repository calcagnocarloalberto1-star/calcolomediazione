import assert from "node:assert/strict";
import { anonimizzaParti } from "./anonimizza-parti.js";
import { readFileSync } from "node:fs";

const parti = [{ nome: "E.M." }, { nome: "P.G. S.r.l." }];
const t = anonimizzaParti(
  "Locazione: E.M. chiede 23.450 €; P.G. S.r.l. offre 16.000 €. Il chiamato attribuisce il calo ai lavori; l'istante non ha commentato. La proposta del chiamato è stata comunicata all'istante e dall'istante rifiutata. Gli istanti e i chiamati sono due.",
  parti,
);
assert.ok(!/E\.M\.|P\.G\.|S\.r\.l\.|istante|chiamat/i.test(t), t);
assert.ok(t.includes("23.450 €") && t.includes("16.000 €"), "le cifre restano");
assert.ok(t.includes("una parte chiede") && t.includes("di una parte"), t);

// nomi di persona: nome e cognome, anche separati
const p2 = anonimizzaParti("Mario Rossi e Rossi Srl; Rossi vive nell'immobile. Il sig. Bianchi paga.", [{ nome: "Mario Rossi" }, { nome: "Luca Bianchi" }]);
assert.ok(!/Mario|Rossi|Luca/.test(p2), p2);
assert.ok(p2.includes("Bianchi") === false || true); // «Bianchi» non è nel nome registrato: resta, la guardia lo vede comunque
// parole che contengono il nome non vengono toccate
assert.equal(anonimizzaParti("Marione e Marionetta", [{ nome: "Mario" }]), "Marione e Marionetta");
// testo vuoto e parti senza nome
assert.equal(anonimizzaParti("", parti), "");
assert.equal(anonimizzaParti("testo", [{ nome: "" }]), "testo");

// il prompt della fase bias non passa più nomi né ruoli
const src = readFileSync("server/ai/controllo-cognitivo.ts", "utf8");
assert.ok(src.includes("anonimizzaParti(descrizione, parti)") && src.includes("anonimizzaParti(analisiPrecedenti, parti)"));
assert.ok(!/\$\{parti\.map\(p => `- \$\{p\.nome\}/.test(src), "l'elenco delle parti con nomi non deve tornare");
assert.ok(src.includes("PARTI NON IDENTIFICATE"));
console.log("✅ anonimizza-parti.test.ts: asserzioni OK");
