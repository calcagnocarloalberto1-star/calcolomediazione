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

// Nota (20-21/09/2026): l'Analisi AI del caso e l'assistente AI antiriciclaggio
// sui documenti sono entrambi attivi in produzione dal 14/09/2026 (v. sez. 10-11
// e 34-37 dell'audit di sicurezza). I claim "sospeso"/"sospesi"/"sospesa" qui sotto
// erano il testo pubblico corretto quando le funzioni erano davvero sospese; ora
// che sono attive, la loro ricomparsa nel testo pubblico sarebbe essa stessa un
// claim obsoleto, quindi si aggiungono qui invece che in un controllo separato.
// NB: non si può usare un controllo generico "il file non deve contenere la parola
// sospeso", perché client/src/pages/AnalisiCasoAI.tsx la contiene legittimamente
// (testo condizionale dietro il flag runtime caseAiEnabled, per lo stato in cui la
// funzione fosse di nuovo disattivata) e server/routes.ts la contiene con un
// significato del tutto distinto e ancora corretto (blocco dell'area
// amministrativa per TOTP non configurato — "area admin sospesa"). Per questo le
// frasi sotto sono claim testuali specifici, verificati assenti dall'intero
// publicCopy comprese entrambe le eccezioni, non un pattern generico sulla parola.
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
  "Le nuove analisi AI sono temporaneamente sospese",
  "L'assistente AI sui documenti è sospeso",
  "Analisi AI temporaneamente sospesa",
  "il server rifiuta le relative richieste prima di leggerne o decodificarne il corpo",
  "La riattivazione richiederà la definizione documentata dei ruoli privacy",
]) {
  assert.equal(
    publicCopy.includes(obsoleteClaim),
    false,
    `Obsolete public AI claim found: ${obsoleteClaim}`,
  );
}

// Nota (20-21/09/2026): controllo generico di non regressione per i soli file
// il cui contenuto non ha mai un motivo legittimo di contenere "sospeso" in
// relazione all'Analisi AI o all'assistente AML — esclusi quindi
// AnalisiCasoAI.tsx e routes.ts (v. nota sopra), coperti invece dai claim
// testuali specifici appena verificati.
for (const file of [
  "client/index.html",
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
  "client/public/antiriciclaggio-guida.html",
  "server/ai/assistente-kb.ts",
  "server/ai/llm.ts",
  "server/static.ts",
  "client/src/pages/Contatti.tsx",
]) {
  assert.doesNotMatch(
    readFileSync(file, "utf8"),
    /temporaneamente sospes|resta sospes|sono sospes/i,
    `Obsolete AI-suspension notice still present in ${file}`,
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
