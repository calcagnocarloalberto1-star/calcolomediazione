// ═══════════════════════════════════════════════════════════════════════════
// SEO-03: genera server/lastmod-generated.json a build time.
//
// Per ogni pagina statica, calcola la data dell'ultimo commit git che ha
// toccato il/i file sorgente corrispondenti e la scrive in un JSON che il
// server importa a runtime per popolare <lastmod> nella sitemap.
//
// Perché a build time e non a runtime: l'ambiente di produzione (Render) non
// garantisce che il binario git o la history .git siano disponibili nel
// container di runtime dopo il build. Calcolare qui, una volta per commit,
// garantisce inoltre che il valore NON cambi ad ogni deploy se il file
// sorgente non è stato modificato (requisito esplicito di SEO-01/SEO-03).
//
// Se git non è disponibile (es. ambiente senza .git), usa un fallback fisso
// per non rompere la build.
// ═══════════════════════════════════════════════════════════════════════════

import { execSync } from "child_process";
import { writeFile } from "fs/promises";
import path from "path";

// path pubblico -> file sorgente (o file multipli: si usa il più recente)
const PAGE_SOURCES: Record<string, string[]> = {
  "/": ["client/src/pages/Home.tsx"],
  "/calcolatore": ["client/src/pages/Calcolatore.tsx"],
  "/analisi-caso-ai": ["client/src/pages/AnalisiCasoAI.tsx"],
  "/confronto-costi": ["client/src/pages/ConfrontoCosti.tsx"],
  "/costi-notarili": ["client/src/pages/CostiNotarili.tsx"],
  "/faq": ["client/src/pages/FAQ.tsx"],
  "/guida-dm-150": ["client/src/pages/GuidaDM150.tsx"],
  "/generatore-procura": ["client/src/pages/GeneratoreProcura.tsx"],
  "/giurisprudenza": [
    "client/src/pages/Giurisprudenza.tsx",
    "client/src/data/giurisprudenza-db.ts",
  ],
  "/credito-imposta": ["client/src/pages/CreditoImposta.tsx"],
  "/strategie-negoziazione": ["client/src/pages/StrategieNegoziazione.tsx"],
  "/glossario": ["client/src/pages/Glossario.tsx"],
  "/chi-siamo": ["client/src/pages/ChiSiamo.tsx"],
  "/contatti": ["client/src/pages/Contatti.tsx"],
  "/antiriciclaggio": ["client/src/pages/Antiriciclaggio.tsx"],
  "/antiriciclaggio-guida": ["client/src/pages/AntiriciclaggioGuida.tsx"],
  "/privacy-policy": ["client/src/pages/PrivacyPolicy.tsx"],
  "/cookie-policy": ["client/src/pages/CookiePolicy.tsx"],
  "/termini-condizioni": ["client/src/pages/TerminiCondizioni.tsx"],
  "/calcolo-assegni/": ["client/public/calcolo-assegni"],
};

// Fallback se git non è disponibile o un file non ha storia (es. non tracciato).
const FALLBACK_DATE = "2026-08-08";

function lastCommitDate(files: string[]): string {
  let latest: string | null = null;
  for (const file of files) {
    try {
      const out = execSync(`git log -1 --format=%cs -- "${file}"`, {
        cwd: path.resolve(import.meta.dirname, ".."),
        encoding: "utf-8",
      }).trim();
      if (out && (!latest || out > latest)) {
        latest = out;
      }
    } catch {
      // git non disponibile o file non tracciato: ignora, si userà il fallback
    }
  }
  return latest || FALLBACK_DATE;
}

async function generate() {
  const result: Record<string, string> = {};
  for (const [pagePath, files] of Object.entries(PAGE_SOURCES)) {
    result[pagePath] = lastCommitDate(files);
  }
  const outPath = path.resolve(import.meta.dirname, "../server/lastmod-generated.json");
  await writeFile(outPath, JSON.stringify(result, null, 2) + "\n", "utf-8");
  console.log(`✅ lastmod generato per ${Object.keys(result).length} pagine → server/lastmod-generated.json`);
}

generate().catch((err) => {
  console.error("Errore generazione lastmod:", err);
  process.exit(1);
});
