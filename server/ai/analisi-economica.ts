import { callLLM } from "./llm.js";

export async function analisiEconomica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  tipoAnalisi: string,
  previousAnalysis: string,
  opzioniEconomiche: { materiaImmobiliare: boolean; primaCasa: boolean; gratuitoPatrocinio: boolean } = { materiaImmobiliare: false, primaCasa: false, gratuitoPatrocinio: false }
): Promise<string> {
  const valore = valoreLite || 25000;
  const { materiaImmobiliare, primaCasa, gratuitoPatrocinio } = opzioniEconomiche;

  // Build dynamic sections based on flags
  let notaioSection = "";
  if (materiaImmobiliare) {
    const tipoImmobile = primaCasa ? "PRIMA CASA" : "SECONDA CASA / ALTRO IMMOBILE";
    const aliquotaRegistro = primaCasa ? "2%" : "9%";
    notaioSection = `
MATERIA IMMOBILIARE - ${tipoImmobile}:
- L'accordo ha ad oggetto un trasferimento immobiliare
- Imposta di registro: ${aliquotaRegistro} sul valore (minimo EUR 1.000)
- In mediazione: esenzione registro fino a EUR 100.000 (art. 17, co. 3, D.Lgs. 28/2010) — si paga solo sull'eccedenza
- Imposta ipotecaria: EUR 50 (fissa)
- Imposta catastale: EUR 50 (fissa)
- E' NECESSARIO IL NOTAIO per l'autenticazione dell'accordo con effetti reali (art. 11 D.Lgs. 28/2010)
- Includere il costo del notaio (stimare in base alle tabelle CNN)
- In causa civile: registro 3% sulla sentenza, imposte ipotecaria/catastale piene`;
  }

  let gpSection = "";
  if (gratuitoPatrocinio) {
    gpSection = `
GRATUITO PATROCINIO ATTIVO (D.P.R. 115/2002, artt. 74-141):
La parte beneficia del patrocinio a spese dello Stato. Questo significa:
- IN MEDIAZIONE: indennità organismo = EUR 0 (a carico erario), compenso avvocato = EUR 0 (a carico erario), spese generali/CPA/IVA = EUR 0
  Restano a carico: imposte di registro (se dovute sull'eccedenza EUR 100.000), costi notarili (se materia immobiliare)
- IN CAUSA CIVILE: contributo unificato = prenotato a debito (EUR 0 per la parte), compenso avvocato = EUR 0 (a carico erario), CTU = prenotata a debito
  Resta a carico: imposta di registro sulla sentenza (3%)
- Credito d'imposta: NON applicabile (i costi sono già a carico dell'erario)
DEVI CALCOLARE I TOTALI TENENDO CONTO DI QUESTI AZZERAMENTI.`;
  }

  const esenzioneNote = `
ESENZIONE ART. 17 D.LGS. 28/2010 — SEMPRE PER ACCORDO POSITIVO:
- L'imposta di registro è ESENTE fino a EUR 100.000
- Per valori superiori a EUR 100.000 si paga SOLO sull'eccedenza (valore - 100.000)
- Esenzione imposta di bollo su tutti gli atti del procedimento
- Questa esenzione si applica SEMPRE in caso di accordo positivo in mediazione`;

  const systemPrompt = `Sei un esperto di costi legali e fiscalità della mediazione civile e commerciale italiana.
Devi produrre una SEZIONE ECONOMICA COMPARATIVA dettagliata che confronti due scenari:

SCENARIO A: MEDIAZIONE POSITIVA (accordo raggiunto)
- Indennità organismo di mediazione (D.M. 150/2023) per valore EUR ${valore.toLocaleString("it-IT")}
- Compenso avvocato (parametri forensi stragiudiziali D.M. 55/2014 agg. D.M. 147/2022)
- Spese generali 15%, CPA 4%, IVA 22%
${esenzioneNote}
- Credito d'imposta fino a EUR 600 sull'indennità + fino a EUR 600 sul compenso avvocato (se obbligatoria/demandata)
${materiaImmobiliare ? "- Costo notaio OBBLIGATORIO (autenticazione accordo con effetti reali)" : "- Costo notaio: non necessario (materia non immobiliare)"}
- Durata stimata: 1-3 mesi
${notaioSection}
${gpSection}

SCENARIO B: PROCESSO CIVILE (mediazione negativa + contenzioso)
- Indennità mediazione negativa (solo primo incontro, ridotta)
- Contributo unificato (D.P.R. 115/2002, art. 13)
- Marca da bollo EUR 27 + diritti copia EUR 30
- Compenso avvocato (parametri forensi giudiziali D.M. 55/2014: studio + introduttiva + istruttoria + decisionale)
- Spese generali 15%, CPA 4%, IVA 22%
- Stima CTU (consulenza tecnica d'ufficio)
- Imposta di registro su sentenza: 3% del valore
- Nessuna esenzione art. 17
${materiaImmobiliare ? "- Costo notaio se trasferimento immobiliare\n- Imposte ipotecaria e catastale: dovute per intero" : ""}
- Durata stimata: 2-5 anni primo grado

FORMATO OUTPUT - usa tabelle markdown:
1. Tabella riepilogativa "Mediazione Positiva" con tutte le voci e totale
2. Tabella riepilogativa "Processo Civile" con tutte le voci e totale
3. Tabella comparativa finale con differenza e risparmio percentuale
4. Sezione "Vantaggi Fiscali della Mediazione" con elenco dettagliato art. 17
5. Sezione "Analisi Temporale" con stima durata e costi opportunità
${gratuitoPatrocinio ? '6. Sezione "Effetti del Gratuito Patrocinio" — dettaglio di quali voci sono azzerate e quali restano a carico' : ""}
${materiaImmobiliare ? `7. Sezione "Costi Notarili e Imposte Immobiliari" — dettaglio costi notaio e confronto imposte ${primaCasa ? "prima casa" : "seconda casa"}` : ""}
${!gratuitoPatrocinio && !materiaImmobiliare ? "6." : gratuitoPatrocinio && materiaImmobiliare ? "8." : "7."} Conclusioni con raccomandazione economica

IMPORTANTE:
- Usa trattini (-) per gli elenchi, MAI emoji
- Usa tabelle markdown standard con |
- Tutti gli importi in EUR con separatore migliaia
- Sii preciso nei calcoli, usa gli scaglioni normativi corretti
- Considera che il tipo di analisi è: ${tipoAnalisi}
- Il valore della lite è: EUR ${valore.toLocaleString("it-IT")}
${gratuitoPatrocinio ? "- ATTENZIONE: il gratuito patrocinio è ATTIVO — azzera indennità, compenso avvocato e accessori per la parte. Calcola di conseguenza." : ""}
${materiaImmobiliare ? `- ATTENZIONE: materia immobiliare — includi SEMPRE il costo del notaio e le imposte di trasferimento (${primaCasa ? "prima casa — registro 2%" : "seconda casa — registro 9%"})` : ""}`;

  const userPrompt = `Caso: ${descrizione}
Parti: ${parti.map(p => `${p.nome} (${p.ruolo})`).join(", ")}
Valore della lite: EUR ${valore.toLocaleString("it-IT")}
Tipo: ${tipoAnalisi === "mediazione" ? "Mediazione civile e commerciale" : "Negoziazione assistita"}
${materiaImmobiliare ? `Materia: IMMOBILIARE — ${primaCasa ? "Prima casa" : "Seconda casa / altro immobile"}` : "Materia: NON immobiliare"}
${gratuitoPatrocinio ? "Gratuito patrocinio: ATTIVO" : "Gratuito patrocinio: NON attivo"}

Contesto dall'analisi precedente:
${previousAnalysis}

Genera la sezione economica comparativa completa con calcoli precisi.`;

  return callLLM(systemPrompt, userPrompt, 8000);
}
