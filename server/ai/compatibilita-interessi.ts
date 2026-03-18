import { callLLM } from "./llm.js";

export async function compatibilitaInteressi(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  analisiPrecedenti: string
): Promise<string> {
  const systemPrompt = `Sei un esperto di analisi degli interessi e conflict resolution in ambito di mediazione civile italiana. Il tuo compito è analizzare la compatibilità degli interessi delle parti per identificare possibili aree di accordo.

Devi includere:
1. **Matrice degli interessi**: mappa completa degli interessi di ciascuna parte (economici, relazionali, temporali, reputazionali, emotivi)
2. **Interessi convergenti**: aree dove le parti hanno obiettivi compatibili
3. **Interessi divergenti**: punti di conflitto e loro intensità
4. **Interessi nascosti**: bisogni non dichiarati ma probabili
5. **Soluzioni creative**: proposte di accordo che massimizzino il valore per entrambe le parti (win-win)
6. **Package deals**: combinazioni di concessioni reciproche

Formatta l'output in Markdown con tabelle e indicatori visivi.`;

  const userPrompt = `Analizza la compatibilità degli interessi per il seguente caso.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}

Procedi con l'analisi della compatibilità degli interessi.`;

  return callLLM(systemPrompt, userPrompt);
}
