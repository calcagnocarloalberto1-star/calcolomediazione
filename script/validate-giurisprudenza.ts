// ═══════════════════════════════════════════════════════════════════════════
// Validazione automatica del database giurisprudenziale
// ═══════════════════════════════════════════════════════════════════════════
// Eseguito come prebuild step. Blocca la build se trova:
//   1. ID duplicati
//   2. Sentenze duplicate per (tipoOrgano + numero + anno)
//   3. Campi obbligatori mancanti
//
// Uso: tsx script/validate-giurisprudenza.ts
// Exit code 0 = OK, 1 = errore (blocca build / merge)
// ═══════════════════════════════════════════════════════════════════════════

import { sentenze, type Sentenza } from "../client/src/data/giurisprudenza-db.js";

export interface ValidationError {
  type: "duplicate_id" | "duplicate_sentenza" | "missing_field" | "invalid_value";
  message: string;
  ids?: number[];
}

export function validateGiurisprudenza(data: Sentenza[] = sentenze): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1) ID duplicati
  const idMap = new Map<number, number[]>();
  data.forEach((s, idx) => {
    if (!idMap.has(s.id)) idMap.set(s.id, []);
    idMap.get(s.id)!.push(idx);
  });
  for (const [id, indexes] of idMap.entries()) {
    if (indexes.length > 1) {
      errors.push({
        type: "duplicate_id",
        message: `ID ${id} usato ${indexes.length} volte (posizioni array: ${indexes.join(", ")})`,
        ids: [id],
      });
    }
  }

  // 2) Sentenze duplicate per chiave logica (tipoOrgano + organo_canonico + numero + anno)
  // Normalizziamo l'organo rimuovendo specificazioni di sezione (", Sez. ...", " civ.", ecc.)
  // così "Trib. Catania" e "Trib. Catania, Sez. IV" risultano la stessa sede.
  // Se numero è vuoto (sentenze storiche senza numero pubblicato), fallback su titolo.
  const canonicalizeOrgano = (organo: string): string => {
    return organo
      .trim()
      .toLowerCase()
      // Espandi "trib." -> "tribunale" e "cass." -> "cassazione" per unificare le forme abbreviate
      .replace(/^trib\b\.?/, "tribunale")
      .replace(/^cass\b\.?/, "cassazione")
      // Rimuovi tutto dopo la prima virgola (sezioni, sottoarticolazioni)
      .split(",")[0]
      // Rimuovi qualifiche post-nome (" civ.", " civile", " pen.")
      .replace(/\s+(civ\.?|civile|pen\.?|penale|lav\.?|lavoro)$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  };
  const dedupMap = new Map<string, Sentenza[]>();
  for (const s of data) {
    const organoKey = canonicalizeOrgano(s.organo);
    const numeroKey = (s.numero || `__notitle__${s.titolo.slice(0, 60).toLowerCase()}`).trim();
    const key = `${s.tipoOrgano}|${organoKey}|${numeroKey}|${s.anno}`;
    if (!dedupMap.has(key)) dedupMap.set(key, []);
    dedupMap.get(key)!.push(s);
  }
  for (const [, sents] of dedupMap.entries()) {
    if (sents.length > 1) {
      const label = sents[0].numero
        ? `${sents[0].organo} ${sents[0].numero}/${sents[0].anno}`
        : `${sents[0].organo} ${sents[0].anno} ("${sents[0].titolo.slice(0, 50)}...")`;
      errors.push({
        type: "duplicate_sentenza",
        message: `Sentenza duplicata "${label}" presente ${sents.length} volte (ids: ${sents.map(s => s.id).join(", ")})`,
        ids: sents.map(s => s.id),
      });
    }
  }

  // 3) Campi obbligatori (numero escluso: alcune sentenze storiche non hanno numero pubblicato)
  const requiredFields: (keyof Sentenza)[] = [
    "id", "organo", "tipoOrgano", "anno", "data",
    "titolo", "categoria", "massima", "riferimentiNormativi", "temiChiave",
  ];
  for (const s of data) {
    for (const field of requiredFields) {
      const v = s[field];
      if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
        errors.push({
          type: "missing_field",
          message: `Sentenza id ${s.id}: campo obbligatorio "${String(field)}" mancante o vuoto`,
          ids: [s.id],
        });
      }
      if (Array.isArray(v) && v.length === 0) {
        errors.push({
          type: "missing_field",
          message: `Sentenza id ${s.id}: array "${String(field)}" vuoto`,
          ids: [s.id],
        });
      }
    }
    // anno plausibile (2010 = D.Lgs. 28/2010, max anno corrente + 1)
    const annoCorrente = new Date().getFullYear();
    if (s.anno < 2010 || s.anno > annoCorrente + 1) {
      errors.push({
        type: "invalid_value",
        message: `Sentenza id ${s.id}: anno ${s.anno} fuori range (atteso 2010-${annoCorrente + 1})`,
        ids: [s.id],
      });
    }

    // DATA-02: campo "data" deve essere una data reale in formato ISO (YYYY-MM-DD).
    // Individua valori placeholder/non validi come "None", stringhe vuote o date
    // impossibili (es. "2026-13-45") che a runtime producevano "Invalid Date".
    const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.data ?? "");
    if (!isoDateMatch) {
      errors.push({
        type: "invalid_value",
        message: `Sentenza id ${s.id}: campo "data" ("${s.data}") non è in formato ISO YYYY-MM-DD`,
        ids: [s.id],
      });
    } else {
      const [, y, m, d] = isoDateMatch;
      const parsed = new Date(`${y}-${m}-${d}T00:00:00Z`);
      const valid =
        !Number.isNaN(parsed.getTime()) &&
        parsed.getUTCFullYear() === Number(y) &&
        parsed.getUTCMonth() + 1 === Number(m) &&
        parsed.getUTCDate() === Number(d);
      if (!valid) {
        errors.push({
          type: "invalid_value",
          message: `Sentenza id ${s.id}: campo "data" ("${s.data}") non è una data di calendario valida`,
          ids: [s.id],
        });
      }
    }

    // DATA-02: per le pronunce più recenti (dal 2020 in poi) il numero di
    // provvedimento è sempre reperibile dalla fonte; un numero mancante indica
    // una scheda incompleta, non una sentenza storica priva di numero pubblicato.
    if (s.anno >= 2020 && (!s.numero || s.numero.trim() === "")) {
      errors.push({
        type: "missing_field",
        message: `Sentenza id ${s.id} (${s.organo}, ${s.anno}): campo "numero" mancante per una pronuncia recente`,
        ids: [s.id],
      });
    }
  }

  return errors;
}

export function runValidation(throwOnError = false): void {
  console.log("🔍 Validazione database giurisprudenziale...");
  console.log(`   Pronunce caricate: ${sentenze.length}`);

  const errors = validateGiurisprudenza(sentenze);

  if (errors.length === 0) {
    console.log(`✅ Validazione OK — ${sentenze.length} pronunce, nessun duplicato rilevato.`);
    return;
  }

  console.error("");
  console.error("❌ VALIDAZIONE FALLITA");
  console.error(`   ${errors.length} errori rilevati nel db giurisprudenziale:`);
  console.error("");
  for (const err of errors) {
    const prefix = {
      duplicate_id: "🔁 [DUPLICATE_ID]",
      duplicate_sentenza: "🔁 [DUPLICATE_SENTENZA]",
      missing_field: "⚠️  [MISSING_FIELD]",
      invalid_value: "⚠️  [INVALID_VALUE]",
    }[err.type];
    console.error(`   ${prefix} ${err.message}`);
  }
  console.error("");
  const msg = `Validazione db giurisprudenziale fallita: ${errors.length} errori. Build bloccata. Correggi gli errori in client/src/data/giurisprudenza-db.ts`;
  if (throwOnError) {
    throw new Error(msg);
  }
  console.error("Build bloccata. Correggi gli errori in client/src/data/giurisprudenza-db.ts");
  process.exit(1);
}

// CLI entrypoint: `tsx script/validate-giurisprudenza.ts`
const isMain = import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith("validate-giurisprudenza.ts") &&
  process.argv[1]?.endsWith("validate-giurisprudenza.ts");
if (isMain) {
  runValidation(false);
}
