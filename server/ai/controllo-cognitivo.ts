import { callLLM } from "./llm.js";

const TEORIE_DESCRIZIONI: Record<string, string> = {
  ancoraggio: "Ancoraggio (Anchoring): tendenza ad affidarsi eccessivamente alla prima informazione ricevuta",
  avversione_perdita: "Avversione alla Perdita (Loss Aversion): le perdite pesano più dei guadagni equivalenti",
  framing: "Framing: la presentazione dell'informazione influenza le decisioni",
  overconfidence: "Overconfidence: sopravvalutazione delle proprie capacità e chance di successo",
  sunk_cost: "Sunk Cost Fallacy: tendenza a continuare per i costi già sostenuti",
  availability: "Availability Bias: sovrastima della probabilità di eventi facilmente ricordabili",
  teoria_giochi: "Teoria dei Giochi (Game Theory): analisi strategica delle interazioni tra parti razionali — equilibrio di Nash, strategie dominanti, dilemma del prigioniero applicato alla negoziazione",
  decision_analysis: "Decision Analysis: framework strutturato per decisioni in condizioni di incertezza — alberi decisionali, valore atteso, analisi di sensibilità, profili di rischio",
  mcda: "MCDA (Multi-Criteria Decision Analysis): metodo per valutare alternative su criteri multipli ponderati — non solo economici ma anche temporali, relazionali, reputazionali e di stress",
  teoria_prospetto: "Teoria del Prospetto (Prospect Theory, Kahneman-Tversky): le persone valutano guadagni e perdite rispetto a un punto di riferimento, con avversione alle perdite asimmetrica e distorsione delle probabilità",
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

  const systemPrompt = `Sei un esperto di economia comportamentale, teoria delle decisioni e psicologia della negoziazione applicata alla mediazione civile. Il tuo compito è analizzare i potenziali bias cognitivi e applicare i framework decisionali selezionati al caso di mediazione.

Per ciascun bias cognitivo selezionato (Ancoraggio, Avversione alla Perdita, Framing, Overconfidence, Sunk Cost, Availability), analizza:
1. **Livello di rischio**: scala 1-5
2. **Come si manifesta nel caso specifico**: esempi concreti
3. **Impatto sulla negoziazione**: come potrebbe distorcere le decisioni
4. **Strategie di mitigazione**: tecniche per il mediatore
5. **Domande di debiasing**: domande specifiche da porre alle parti

Per ciascun framework decisionale selezionato, applica l'analisi specifica:

- **Teoria dei Giochi**: identifica il tipo di gioco (cooperativo/non cooperativo), le strategie disponibili per ogni parte, l'equilibrio di Nash, il payoff cooperativo ottimale e come il mediatore può spostare la dinamica da competitiva a cooperativa. Costruisci la matrice dei payoff.
- **Decision Analysis**: costruisci l'albero decisionale per ogni parte con le opzioni (accordo in mediazione, causa civile, rinuncia), assegna probabilità e valori attesi a ogni ramo, identifica la decisione ottimale. Includi analisi di sensibilità sui parametri chiave.
- **MCDA (Multi-Criteria Decision Analysis)**: definisci i criteri rilevanti (costo economico, tempo, stress, relazione tra le parti, certezza del risultato, reputazione), assegna pesi e punteggi per ogni alternativa (accordo vs causa), calcola il punteggio ponderato complessivo. Presenta in tabella.
- **Teoria del Prospetto**: identifica il punto di riferimento di ogni parte, analizza come la percezione di guadagni/perdite rispetto a quel punto influenza le decisioni, valuta la distorsione delle probabilità (sovrastima eventi rari, sottostima eventi probabili), suggerisci come riformulare le proposte in termini di guadagni per favorire l'accordo.

Teorie/framework da analizzare:
- ${teorie}

Formatta l'output in Markdown con indicatori di rischio visivi, tabelle e matrici.`;

  const userPrompt = `Analizza bias cognitivi e framework decisionali per il seguente caso di mediazione.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}

Procedi con il controllo dei bias cognitivi.`;

  return callLLM(systemPrompt, userPrompt);
}
