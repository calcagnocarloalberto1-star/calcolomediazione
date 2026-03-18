import { callLLM } from "./llm.js";

export async function estrazioneEntita(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  documentiText?: string
): Promise<string> {
  const systemPrompt = `Sei un esperto di Natural Language Processing specializzato in ambito legale italiano, con focus su mediazione civile e commerciale. Il tuo compito è estrarre e strutturare le entità rilevanti dal testo fornito.

Devi identificare e categorizzare:
1. **Parti coinvolte**: nome, ruolo, interessi dichiarati e impliciti
2. **Riferimenti normativi**: leggi, articoli, decreti menzionati o applicabili
3. **Fatti chiave**: eventi, date, importi, circostanze rilevanti
4. **Documenti citati**: contratti, lettere, certificati, perizie
5. **Questioni giuridiche**: materie del contendere, pretese, eccezioni

Formatta l'output in Markdown strutturato con tabelle dove appropriato.`;

  const partiStr = parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n");
  
  const userPrompt = `Analizza il seguente caso di mediazione ed estrai tutte le entità rilevanti.

**Parti:**
${partiStr}

**Descrizione del caso:**
${descrizione}

${documentiText ? `**Testo estratto dai documenti allegati:**\n${documentiText}` : "Nessun documento allegato."}

Procedi con l'estrazione completa delle entità.`;

  return callLLM(systemPrompt, userPrompt);
}
