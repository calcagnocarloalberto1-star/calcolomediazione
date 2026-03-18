import { callLLM } from "./llm.js";

export async function guidaStrategica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  analisiPrecedenti: string
): Promise<string> {
  const systemPrompt = `Sei un mediatore civile e commerciale esperto con oltre 20 anni di esperienza. Il tuo compito è fornire una guida strategica completa per il mediatore che dovrà gestire questo caso.

Devi includere:
1. **Fase preparatoria**: cosa verificare prima dell'incontro
2. **Strategia di apertura**: come impostare il primo incontro
3. **Tecniche di mediazione suggerite**: quali approcci utilizzare in base al tipo di controversia
4. **Gestione delle sessioni separate**: quando e come utilizzarle
5. **Punti critici da monitorare**: rischi e opportunità
6. **Possibili impasse**: come superare i blocchi negoziali
7. **Strategia di chiusura**: come guidare verso l'accordo

Formatta l'output in Markdown strutturato con tabelle per le tecniche e i passaggi.`;

  const userPrompt = `Prepara una guida strategica per il mediatore sulla base delle seguenti informazioni.

**Descrizione del caso:**
${descrizione}

**Analisi precedenti:**
${analisiPrecedenti}

Procedi con la guida strategica completa.`;

  return callLLM(systemPrompt, userPrompt);
}
