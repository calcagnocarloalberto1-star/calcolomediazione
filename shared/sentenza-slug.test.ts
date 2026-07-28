/**
 * Test automatici per sentenza-slug.ts — normalizzazione, slug e round-trip.
 */
import { normalizzaSlug, generaSlugSentenza, urlSentenza, trovaSentenzaPerSlug } from "./sentenza-slug.js";

let passed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`\u274c FAIL: ${msg}`); process.exit(1); }
  passed++;
}
function eqs(a: string, b: string, msg: string) { assert(a === b, `${msg} (atteso "${b}", ottenuto "${a}")`); }

eqs(normalizzaSlug("Tribunale di Forl\u00ec"), "tribunale-di-forli", "slug con accento");
eqs(normalizzaSlug("Corte d'Appello di Napoli"), "corte-dappello-di-napoli", "slug con apostrofo");

const s = { id: 89, organo: "Tribunale di Forl\u00ec", tipoOrgano: "tribunale", numero: "539", anno: 2026, titolo: "Corrispondenza domanda" };
eqs(generaSlugSentenza(s), "tribunale-539-2026-corrispondenza-domanda", "slug sentenza");
eqs(urlSentenza(s), "/giurisprudenza/tribunale-539-2026-corrispondenza-domanda", "url sentenza");

const found = trovaSentenzaPerSlug([s], generaSlugSentenza(s));
assert(!!found && found.id === 89, "trovaSentenzaPerSlug round-trip");

console.log(`\u2705 sentenza-slug.test.ts: ${passed} asserzioni OK`);
