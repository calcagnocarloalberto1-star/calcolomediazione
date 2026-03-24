import { callLLM } from "./llm.js";

export async function guidaStrategica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  nerContext: string
): Promise<string> {
  const systemPrompt = `Sei un mediatore civile e commerciale esperto. Fornisci una guida strategica per il mediatore di questo caso specifico.

REGOLE FONDAMENTALI PER LE TABELLE MARKDOWN:
- Ogni cella deve contenere testo breve su UNA SOLA RIGA (max 50 caratteri)
- Non usare mai newline o testo lungo dentro una cella
- La riga separatrice è sempre del tipo |---|---|---|
- Se un'informazione è assente scrivi "N/D"

Produci queste 7 sezioni in ordine, ognuna breve e concreta:

1. **Fase preparatoria**: 3-4 punti chiave da verificare prima dell'incontro

2. **Strategia d'apertura**: discorso di apertura, tono, scaletta temporale del primo incontro (max 30 min)

3. **Tecniche suggerite**: tabella con esattamente queste 3 colonne:
| Tecnica | Quando usarla | Obiettivo |
|---|---|---|
| Nome tecnica breve | Momento specifico | Risultato atteso |
Inserisci 4 righe con tecniche specifiche per questo caso. Celle brevi, max 40 caratteri ciascuna.

4. **Caucus**: quando convocarli e cosa esplorare con ciascuna parte

5. **Punti critici**: 3-4 rischi e opportunità specifici per questo caso

6. **Gestione impasse**: 3 strategie concrete per sbloccare la negoziazione

7. **Chiusura**: come riconoscere il momento giusto e spingere verso l'accordo

Sii specifico per il caso, non generico. Risposte concise. Formatta in Markdown.`;

  const partiStr = parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n");

  const userPrompt = `Fornisci la guida strategica per il seguente caso di mediazione.

**Parti:**
${partiStr}

**Descrizione del caso:**
${descrizione}

**Contesto dall'analisi delle entità:**
${nerContext}

Produci tutte e 7 le sezioni richieste.`;

  return callLLM(systemPrompt, userPrompt);
}
