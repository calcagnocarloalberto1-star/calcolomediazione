import { callLLM } from "./llm.js";

export async function analisiEconomica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  tipoAnalisi: string,
  previousAnalysis: string
): Promise<string> {
  const valore = valoreLite || 25000;
  const systemPrompt = `Sei un esperto di costi legali e fiscalità della mediazione civile e commerciale italiana.
Devi produrre una SEZIONE ECONOMICA COMPARATIVA dettagliata che confronti due scenari:

SCENARIO A: MEDIAZIONE POSITIVA (accordo raggiunto)
- Indennità organismo di mediazione (D.M. 150/2023) per valore EUR ${valore.toLocaleString("it-IT")}
- Compenso avvocato (parametri forensi stragiudiziali D.M. 55/2014 agg. D.M. 147/2022)
- Spese generali 15%, CPA 4%, IVA 22%
- Esenzione imposta di registro fino a EUR 100.000 (art. 17, comma 3, D.Lgs. 28/2010)
- Esenzione imposta di bollo (art. 17, comma 2, D.Lgs. 28/2010)
- Credito d'imposta fino a EUR 600 sull'indennità + fino a EUR 600 sul compenso avvocato (se obbligatoria/demandata)
- Costo notaio (se materia immobiliare, stimare)
- Imposte ipotecaria e catastale: esenti in mediazione
- Durata stimata: 1-3 mesi

SCENARIO B: PROCESSO CIVILE (mediazione negativa + contenzioso)
- Indennità mediazione negativa (solo primo incontro, ridotta)
- Contributo unificato (D.P.R. 115/2002, art. 13)
- Marca da bollo EUR 27 + diritti copia EUR 30
- Compenso avvocato (parametri forensi giudiziali D.M. 55/2014: studio + introduttiva + istruttoria + decisionale)
- Spese generali 15%, CPA 4%, IVA 22%
- Stima CTU (consulenza tecnica d'ufficio)
- Imposta di registro su sentenza: 3% del valore
- Nessuna esenzione art. 17
- Costo notaio (se trasferimento immobiliare)
- Imposte ipotecaria e catastale: dovute
- Durata stimata: 2-5 anni primo grado

FORMATO OUTPUT - usa tabelle markdown:
1. Tabella riepilogativa "Mediazione Positiva" con tutte le voci e totale
2. Tabella riepilogativa "Processo Civile" con tutte le voci e totale
3. Tabella comparativa finale con differenza e risparmio percentuale
4. Sezione "Vantaggi Fiscali della Mediazione" con elenco dettagliato art. 17
5. Sezione "Analisi Temporale" con stima durata e costi opportunità
6. Conclusioni con raccomandazione economica

IMPORTANTE:
- Usa trattini (-) per gli elenchi, MAI emoji
- Usa tabelle markdown standard con |
- Tutti gli importi in EUR con separatore migliaia
- Sii preciso nei calcoli, usa gli scaglioni normativi corretti
- Considera che il tipo di analisi è: ${tipoAnalisi}
- Il valore della lite è: EUR ${valore.toLocaleString("it-IT")}`;

  const userPrompt = `Caso: ${descrizione}
Parti: ${parti.map(p => `${p.nome} (${p.ruolo})`).join(", ")}
Valore della lite: EUR ${valore.toLocaleString("it-IT")}
Tipo: ${tipoAnalisi === "mediazione" ? "Mediazione civile e commerciale" : "Negoziazione assistita"}

Contesto dall'analisi precedente:
${previousAnalysis}

Genera la sezione economica comparativa completa con calcoli precisi.`;

  return callLLM(systemPrompt, userPrompt, 8000);
}
