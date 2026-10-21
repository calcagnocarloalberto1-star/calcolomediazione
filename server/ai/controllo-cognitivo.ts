import { callLLM, etichettaRuolo } from "./llm.js";
import { REGOLE_NO_PROFILAZIONE } from "./regole-no-profilazione.js";

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

Per ciascun bias cognitivo selezionato (Ancoraggio, Avversione alla Perdita, Framing, Overconfidence, Sunk Cost, Availability) descrivi il RISCHIO PER LA TRATTATIVA, non le caratteristiche delle persone:
1. **Rilevanza per questa trattativa**: scala 1-5
2. **Come può manifestarsi la dinamica nella situazione**: esempi concreti riferiti ai fatti e alle cifre del caso, senza attribuirla a una parte determinata: il soggetto della frase è la dinamica, la proposta o la cifra, mai una parte, una sigla o un ruolo come soggetto di «percepisce», «ritiene», «sovrastima», «sottostima», neppure in forma ipotetica
3. **Impatto sulla negoziazione**: come potrebbe distorcere le decisioni di chiunque si trovi in questa posizione
4. **Strategie di mitigazione**: tecniche per il mediatore
5. **Domande di debiasing**: domande aperte e neutre che il mediatore può porre a ciascuna parte

Per ciascun framework decisionale selezionato, applica l'analisi specifica:

- **Teoria dei Giochi**: identifica il tipo di gioco (cooperativo/non cooperativo), le strategie disponibili per ogni parte, l'equilibrio di Nash, il payoff cooperativo ottimale e come il mediatore può spostare la dinamica da competitiva a cooperativa. Costruisci la matrice dei payoff.
- **Decision Analysis**: costruisci l'albero decisionale con le opzioni (accordo in mediazione, causa civile, rinuncia) e i valori attesi. Le probabilità sono IPOTESI DI CALCOLO: scrivile come «ipotesi di lavoro (da sostituire con la stima del professionista)», mai come dato o previsione. Includi analisi di sensibilità sui parametri chiave, mostrando come cambia il risultato al variare della probabilità.
- **MCDA (Multi-Criteria Decision Analysis)**: definisci i criteri rilevanti (costo economico, tempo, stress, relazione tra le parti, certezza del risultato, reputazione), assegna pesi e punteggi per ogni alternativa (accordo vs causa), calcola il punteggio ponderato complessivo. Presenta in tabella.
- **Teoria del Prospetto**: elenca i possibili punti di riferimento che la trattativa rende disponibili (la cifra richiesta, l'offerta, il valore atteso della causa) e descrivi come la formulazione di una proposta, in termini di guadagno o di perdita rispetto a ciascuno di essi, può influire sulle decisioni di chiunque si trovi in quella posizione. Non dire quale persona o parte adotti quale riferimento, non dire come percepisca le probabilità né se le sovrastimi o sottostimi: indica invece quali domande il mediatore può porre per scoprirlo. Suggerisci come riformulare le proposte in termini di guadagni per favorire l'accordo.

Teorie/framework da analizzare:
- ${teorie}

${REGOLE_NO_PROFILAZIONE}

Formatta l'output in Markdown con indicatori di rischio visivi, tabelle e matrici.`;

  const userPrompt = `Analizza bias cognitivi e framework decisionali per il seguente caso di mediazione.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${etichettaRuolo(p.ruolo)})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}

Procedi con il controllo dei bias cognitivi.`;

  return callLLM(systemPrompt, userPrompt);
}
