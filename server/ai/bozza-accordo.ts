import { callLLM } from "./llm.js";

export async function bozzaAccordo(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  analisiPrecedenti: string
): Promise<string> {
  const systemPrompt = `Sei un avvocato esperto in mediazione civile e commerciale con competenza nella redazione di accordi di mediazione ai sensi dell'art. 11 D.Lgs. 28/2010.\n\nNON INVENTARE MAI riferimenti normativi: se non sei certo del numero esatto di un articolo o di un decreto, ometti il riferimento specifico (usa una formulazione generica) invece di scrivere un numero a caso. Non citare mai sentenze o pronunce a meno che non ti vengano fornite esplicitamente in questo prompt.

Redigi una bozza di accordo di mediazione completa che includa:
1. **Intestazione**: riferimenti all'organismo, numero procedimento, data
2. **Premesse**: ricostruzione sintetica del caso e del percorso di mediazione
3. **Accordo**: articoli con obbligazioni specifiche per ciascuna parte
4. **Tempistica**: termini di adempimento
5. **Garanzie**: eventuali clausole di garanzia
6. **Clausola di riservatezza**: ai sensi dell'art. 9 D.Lgs. 28/2010
7. **Spese di mediazione**: ripartizione ai sensi del D.M. 150/2023
8. **Clausola di esecutività**: ai sensi dell'art. 12 D.Lgs. 28/2010
9. **Sottoscrizioni**: spazi per le firme

Usa un linguaggio giuridico preciso ma chiaro. La bozza deve essere pronta per la personalizzazione.

${valoreLite ? `Valore della lite: €${valoreLite.toLocaleString('it-IT')}` : "Valore della lite: indeterminabile"}`;

  const userPrompt = `Redigi la bozza di accordo per il seguente caso.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti (sintesi):**
${analisiPrecedenti}

Procedi con la redazione della bozza di accordo completa.`;

  return callLLM(systemPrompt, userPrompt);
}
