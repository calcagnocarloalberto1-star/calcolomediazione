import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const publicCopyFiles = [
  "client/index.html",
  "client/public/antiriciclaggio.js",
  "client/public/antiriciclaggio.html",
  "client/public/antiriciclaggio-guida.html",
  "client/public/llms.txt",
  "client/src/components/Footer.tsx",
  "client/src/components/Header.tsx",
  "client/src/pages/Home.tsx",
  "client/src/pages/AnalisiCasoAI.tsx",
  "client/src/pages/Antiriciclaggio.tsx",
  "client/src/pages/AntiriciclaggioGuida.tsx",
  "client/src/pages/ChiSiamo.tsx",
  "client/src/pages/Contatti.tsx",
  "client/src/pages/CostiNotarili.tsx",
  "client/src/pages/FAQ.tsx",
  "client/src/pages/PrivacyPolicy.tsx",
  "client/src/pages/StrategieNegoziazione.tsx",
  "client/src/pages/TerminiCondizioni.tsx",
  "client/src/pages/chi-siamo-jsonld.ts",
  "server/ai/assistente-kb.ts",
  "server/ai/llm.ts",
  "server/routes.ts",
  "server/seo-content.ts",
  "server/static.ts",
] as const;

const publicCopy = publicCopyFiles
  .map(file => `${file}\n${readFileSync(file, "utf8")}`)
  .join("\n");

for (const obsoleteClaim of [
  "salvo la modalita facoltativa con assistente AI",
  "Mediazione e Negoziazione con AI",
  "integra un sistema di intelligenza artificiale avanzato",
  "Analisi completa del caso con intelligenza artificiale",
  "L'analisi include la verifica di congruita",
  "il mediatore esegue l'identificazione, la valutazione del rischio",
  "Responsabile su istruzioni del professionista/Organismo titolare",
  "Analisi AI dei casi di mediazione (analisi giuridica, strategica, economica)",
  "L'Analisi AI genera un quadro economico completo",
  "L'Analisi AI genera scenari economici completi",
  "generato dall'Analisi AI",
  "Sarà riattivato soltanto dopo aver definito il professionista o l'Organismo quale titolare",
  "I contenuti inviati alle funzioni IA sono trasmessi",
  "Le analisi generate tramite intelligenza artificiale presenti sul sito",
  "stessi numeri usati dall&apos;Analisi AI e dal Calcolatore",
  "confronto costi, analisi AI del caso, generatore procura",
  "Analisi caso con intelligenza artificiale",
  "rischio, adeguata verifica ed eventuale segnalazione restano una responsabilità del mediatore e dell'Organismo",
  "anche con l'ausilio di un'estrazione automatica dei dati mediante intelligenza artificiale dai documenti caricati",
  "restano in capo al mediatore, all'Organismo di mediazione e ai rispettivi professionisti",
]) {
  assert.equal(
    publicCopy.includes(obsoleteClaim),
    false,
    `Obsolete public AI claim found: ${obsoleteClaim}`,
  );
}

// Dal 14/09/2026 i flussi CASE e AML generali risultano attivi per decisione
// documentata del titolare. Il percorso con dati di minori resta invece
// separatamente bloccato: i test devono distinguere i due stati, non imporre
// una vecchia sospensione generale ormai incoerente con la policy pubblicata.
const privacyPolicy = readFileSync("client/src/pages/PrivacyPolicy.tsx", "utf8");
assert.match(privacyPolicy, /attiv[oi] dal 14 settembre 2026/i);
assert.match(privacyPolicy, /in caso affermativo o di incertezza l'analisi resta bloccata/i);

const analysisPage = readFileSync("client/src/pages/AnalisiCasoAI.tsx", "utf8");
assert.match(analysisPage, /percorso rafforzato per pratiche con possibili dati di minori non è ancora attivo/i);

const minorsGate = readFileSync("server/security/minors-preflight.ts", "utf8");
assert.match(minorsGate, /MINORS_REINFORCED_PATH_IMPLEMENTED = false/);
assert.match(minorsGate, /MINORS_AI_GDPR_APPROVED/);

const privacyControls = readFileSync("server/privacy-controls.ts", "utf8");
for (const requiredControl of [
  "CASE_AI_GDPR_APPROVED",
  "AML_AI_GDPR_APPROVED",
]) {
  assert.equal(
    privacyControls.includes(requiredControl),
    true,
    `Required privacy control is missing: ${requiredControl}`,
  );
}

// PRIV-10/PRIV-11 (14/09/2026): l'assistente AI di caricamento documenti sulla
// pagina Antiriciclaggio e' stato riattivato (rischio residuo accettato dal
// titolare insieme agli altri quattro gia' documentati). Questo test verificava
// in precedenza che i relativi controlli restassero assenti dal markup; ora
// verifica invece che siano presenti, cosi' un'eventuale rimozione accidentale
// in futuro viene comunque segnalata.
const amlMarkup = readFileSync("client/public/antiriciclaggio.html", "utf8");
for (const restoredAiControl of [
  'id="assist_files"',
  'id="assist_folder"',
  'id="assist_richiesta"',
  'data-ac-action="assist-estrai"',
  'data-ac-action="assist-reset"',
]) {
  assert.equal(
    amlMarkup.includes(restoredAiControl),
    true,
    `Expected AML assistant control missing from markup: ${restoredAiControl}`,
  );
}

console.log("privacy public copy tests passed");
