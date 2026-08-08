// ═══════════════════════════════════════════════════════════════════════════
// SEO-03: genera server/lastmod-generated.json.
//
// Per ogni pagina statica, calcola la data dell'ultimo commit git che ha
// toccato il/i file sorgente corrispondenti e la scrive in un JSON che il
// server importa a runtime per popolare <lastmod> nella sitemap.
//
// IMPORTANTE — script MANUALE, non fa parte della build automatica:
// l'ambiente di build di produzione (Render) non garantisce che il binario
// git o la history .git completa siano disponibili. Va quindi eseguito a
// mano in locale (`npm run generate:lastmod`), dove la history git completa
// è garantita (serve `git fetch --unshallow` se il clone è shallow), e il
// suo output (server/lastmod-generated.json) va committato normalmente: da
// lì viene letto a runtime/build come file statico, senza dipendere da git.
//
// Se per una pagina la lookup git fallisce (file non tracciato, git non
// disponibile, ecc.), lo script NON sovrascrive con una data odierna fissa:
// preserva il valore già presente nel JSON committato, così un fallimento
// locale non introduce mai una data uniforme/sbagliata. Solo per una pagina
// del tutto nuova, mai generata prima, viene usata la data odierna come
// valore iniziale (segnalato chiaramente in console, da rivedere a mano).
// ═══════════════════════════════════════════════════════════════════════════

import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
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

// Ritorna null (anziché una data fissa) se git non è disponibile o nessuno
// dei file ha storia: il chiamante decide come gestire l'assenza di dato,
// preservando eventuali valori già noti invece di inventarne uno nuovo.
function lastCommitDate(files: string[]): string | null {
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
      // git non disponibile o file non tracciato: ignora, si prova con gli altri file
    }
  }
  return latest;
}

async function loadPrevious(outPath: string): Promise<Record<string, string>> {
  try {
    const raw = await readFile(outPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    // Prima generazione: nessun file precedente da cui ereditare valori.
    return {};
  }
}

async function generate() {
  const outPath = path.resolve(import.meta.dirname, "../server/lastmod-generated.json");
  const previous = await loadPrevious(outPath);
  const today = new Date().toISOString().slice(0, 10);

  const result: Record<string, string> = {};
  let updated = 0;
  let preserved = 0;
  let seededToday = 0;

  for (const [pagePath, files] of Object.entries(PAGE_SOURCES)) {
    const gitDate = lastCommitDate(files);
    if (gitDate) {
      result[pagePath] = gitDate;
      if (previous[pagePath] !== gitDate) updated++;
    } else if (previous[pagePath]) {
      result[pagePath] = previous[pagePath];
      preserved++;
      console.warn(`⚠️  ${pagePath}: lookup git fallita, mantengo il valore precedente (${previous[pagePath]})`);
    } else {
      result[pagePath] = today;
      seededToday++;
      console.warn(`⚠️  ${pagePath}: nessun valore precedente né storia git, inizializzato a oggi (${today}) — da rivedere a mano`);
    }
  }

  await writeFile(outPath, JSON.stringify(result, null, 2) + "\n", "utf-8");
  console.log(
    `✅ lastmod generato per ${Object.keys(result).length} pagine → server/lastmod-generated.json ` +
    `(${updated} aggiornate, ${preserved} preservate dal precedente, ${seededToday} inizializzate a oggi)`
  );
}

generate().catch((err) => {
  console.error("Errore generazione lastmod:", err);
  process.exit(1);
});
