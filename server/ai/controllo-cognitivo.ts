import { callLLM } from "./llm.js";

const TEORIE_DESCRIZIONI: Record<string, string> = {
  ancoraggio: "Ancoraggio (Anchoring): tendenza ad affidarsi eccessivamente alla prima informazione ricevuta",
  avversione_perdita: "Avversione alla Perdita (Loss Aversion): le perdite pesano più dei guadagni equivalenti",
  framing: "Framing: la presentazione dell'informazione influenza le decisioni",
  overconfidence: "Overconfidence: sopravvalutazione delle proprie capacità e chance di successo",
  sunk_cost: "Sunk Cost Fallacy: tendenza a continuare per i costi già sostenuti",
  availability: "Availability Bias: sovrastima della probabilità di eventi facilmente ricordabili",
};

export async function controlloBiasCognitivi(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  teorieSelezionate: string[],
  analisiPrecedenti: string
): Promise<string> {
  const teorie = teorieSelezionate
    .map(t => TEORIE_DESCRIZIONI[t] || t)
    .join("\n- ");

  const systemPrompt = `Sei un esperto di economia comportamentale e psicologia della negoziazione applicata alla mediazione civile. Il tuo compito è analizzare i potenziali bias cognitivi che potrebbero influenzare le parti e il mediatore.

Per ciascun bias selezionato, analizza:
1. **Livello di rischio**: scala 1-5
2. **Come si manifesta nel caso specifico**: esempi concreti
3. **Impatto sulla negoziazione**: come potrebbe distorcere le decisioni
4. **Strategie di mitigazione**: tecniche per il mediatore
5. **Domande di debiasing**: domande specifiche da porre alle parti

Bias cognitivi da analizzare:
- ${teorie}

Formatta l'output in Markdown con indicatori di rischio visivi.`;

  const userPrompt = `Analizza i bias cognitivi per il seguente caso di mediazione.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}

Procedi con il controllo dei bias cognitivi.`;

  return callLLM(systemPrompt, userPrompt);
}
