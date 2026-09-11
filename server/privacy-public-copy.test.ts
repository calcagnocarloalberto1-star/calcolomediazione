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
  "compilazione automatica dei modelli del fascicolo",
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

for (const file of [
  "client/index.html",
  "client/src/pages/AnalisiCasoAI.tsx",
  "client/src/pages/FAQ.tsx",
  "client/src/pages/Home.tsx",
  "client/src/pages/StrategieNegoziazione.tsx",
  "client/src/pages/TerminiCondizioni.tsx",
  "client/src/pages/ChiSiamo.tsx",
  "client/src/pages/PrivacyPolicy.tsx",
  "client/src/components/Header.tsx",
  "client/src/components/Footer.tsx",
  "client/public/llms.txt",
  "server/seo-content.ts",
  "server/routes.ts",
  "client/public/antiriciclaggio.html",
  "client/public/antiriciclaggio-guida.html",
]) {
  assert.match(
    readFileSync(file, "utf8"),
    /temporaneamente sospes|resta sospes|sono sospes/i,
    `The public suspension notice is missing from ${file}`,
  );
}

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

const amlMarkup = readFileSync("client/public/antiriciclaggio.html", "utf8");
assert.equal(amlMarkup.includes('id="assist_files"'), false);
assert.equal(amlMarkup.includes('data-ac-action="assist-reset"'), false);
for (const removedAiControl of [
  'id="assist_folder"',
  'data-ac-action="assist-extract"',
  'id="assist_richiesta"',
]) {
  assert.equal(amlMarkup.includes(removedAiControl), false);
}

console.log("privacy public copy tests passed");
