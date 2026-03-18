import { callLLM } from "./llm.js";

export async function analisiGiuridica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  entitaEstratte: string,
  tipoAnalisi: string
): Promise<string> {
  const systemPrompt = `Sei un giurista esperto in mediazione civile e commerciale italiana, con approfondita conoscenza del D.Lgs. 28/2010 (come modificato dalla Riforma Cartabia, D.Lgs. 149/2022) e del D.M. 150/2023.

Il tuo compito è fornire un'analisi giuridica completa che includa:
1. **Quadro normativo applicabile**: identificare tutte le norme rilevanti
2. **Precedenti giurisprudenziali**: citare sentenze pertinenti di Cassazione e merito
3. **Analisi dei rischi processuali**: valutare le conseguenze della mancata mediazione
4. **Condizioni di procedibilità**: verificare il rispetto degli adempimenti
5. **Valutazione probabilistica**: stimare le chance di successo in giudizio per ciascuna parte

Tipo di procedura: ${tipoAnalisi === "mediazione" ? "Mediazione civile e commerciale" : "Negoziazione assistita"}

Formatta l'output in Markdown con tabelle per i rischi e le valutazioni.`;

  const userPrompt = `Sulla base delle seguenti informazioni, fornisci un'analisi giuridica completa.

**Descrizione del caso:**
${descrizione}

**Entità estratte dall'analisi precedente:**
${entitaEstratte}

Procedi con l'analisi giuridica dettagliata.`;

  return callLLM(systemPrompt, userPrompt);
}
