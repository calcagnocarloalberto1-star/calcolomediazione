// ═══════════════════════════════════════════════════════════════════════════
// Slug e helper URL per pagine di dettaglio giurisprudenza.
// Condiviso tra client (React) e server (Express bot rendering).
// ═══════════════════════════════════════════════════════════════════════════

export interface SentenzaMinima {
  id: number;
  organo: string;
  tipoOrgano: string;
  numero: string;
  anno: number;
  titolo: string;
}

// Mappa tipoOrgano → prefisso slug leggibile
const PREFISSO_ORGANO: Record<string, string> = {
  corte_costituzionale: "corte-costituzionale",
  cassazione_su: "cassazione-ssuu",
  cassazione: "cassazione",
  corte_appello: "corte-appello",
  tribunale: "tribunale",
};

/**
 * Rimuove accenti, punteggiatura, spazi multipli e restituisce testo
 * URL-safe in kebab-case.
 */
export function normalizzaSlug(input: string, maxLen: number = 60): string {
  const cleaned = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // rimuove diacritici
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (cleaned.length <= maxLen) return cleaned;
  // Tronca senza spezzare l'ultima parola
  const truncated = cleaned.slice(0, maxLen);
  const lastDash = truncated.lastIndexOf("-");
  return lastDash > 20 ? truncated.slice(0, lastDash) : truncated;
}

/**
 * Genera slug canonico per una sentenza.
 * Pattern: [prefisso-organo]-[numero]-[anno]-[titolo-troncato]
 * Esempio: "cassazione-14885-2026-nuovo-termine-per-riassumere-mediazione"
 */
export function generaSlugSentenza(s: SentenzaMinima): string {
  const prefisso = PREFISSO_ORGANO[s.tipoOrgano] || "sentenza";
  const numero = s.numero.replace(/[^a-z0-9]/gi, "");
  const titoloSlug = normalizzaSlug(s.titolo, 55);
  return `${prefisso}-${numero}-${s.anno}-${titoloSlug}`;
}

/**
 * Percorso relativo canonico per la pagina di dettaglio.
 */
export function urlSentenza(s: SentenzaMinima): string {
  return `/giurisprudenza/${generaSlugSentenza(s)}`;
}

/**
 * Cerca una sentenza per slug (anche legacy: se lo slug non matcha esattamente,
 * prova a estrarre organo/numero/anno per fallback).
 */
export function trovaSentenzaPerSlug<T extends SentenzaMinima>(
  sentenze: T[],
  slug: string
): T | undefined {
  // Match esatto sullo slug generato
  const esatto = sentenze.find((s) => generaSlugSentenza(s) === slug);
  if (esatto) return esatto;

  // Fallback: estrai numero e anno da slug tipo "cassazione-14885-2026-..."
  const match = slug.match(/^(corte-costituzionale|cassazione-ssuu|cassazione|corte-appello|tribunale)-([a-z0-9]+)-(\d{4})/);
  if (!match) return undefined;

  const [, prefissoSlug, numeroSlug, annoStr] = match;
  const anno = parseInt(annoStr, 10);

  // Ritraduci prefissoSlug → tipoOrgano
  const tipoOrgano = Object.entries(PREFISSO_ORGANO).find(
    ([, prefix]) => prefix === prefissoSlug
  )?.[0];
  if (!tipoOrgano) return undefined;

  return sentenze.find(
    (s) =>
      s.tipoOrgano === tipoOrgano &&
      s.numero.replace(/[^a-z0-9]/gi, "").toLowerCase() === numeroSlug &&
      s.anno === anno
  );
}
