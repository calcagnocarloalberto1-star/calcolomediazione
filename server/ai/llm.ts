import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// Google Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI | null {
  if (geminiClient) return geminiClient;
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return geminiClient;
  }
  return null;
}

// Anthropic client (fallback)
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
  if (anthropicClient) return anthropicClient;
  if (process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic();
    return anthropicClient;
  }
  return null;
}

// Global formatting constraint appended to every system prompt
const FORMAT_CONSTRAINT = `\n\nIMPORTANTE — Regole di formattazione OBBLIGATORIE (violazioni non accettate):
- NON usare MAI emoji, emoticon, simboli Unicode decorativi (frecce speciali, check mark, stelle, pallini colorati, icone, simboli come \u2713 \u2717 \u2022 \u25cf \u2605 \u2192 \u27a4). Usa SOLO caratteri ASCII standard.
- Per le tabelle Markdown: SEMPRE usare | e --- con allineamento a sinistra. OGNI riga DEVE avere ESATTAMENTE lo stesso numero di colonne dell'intestazione. NON lasciare celle vuote, scrivi "-" se non c'e' un valore.
- Per i punti elenco usa SOLO trattini (-), mai pallini, asterischi o altri simboli.
- Per enfatizzare usa **grassetto**, mai emoji o simboli.
- NON troncare MAI l'analisi. Completa SEMPRE ogni sezione fino alla fine.
- Scrivi in italiano professionale e chiaro.
- Per i simboli di valuta usa la parola "euro" o "EUR", non il simbolo.`;

// Post-process AI output to fix common formatting issues
function cleanAIOutput(text: string): string {
  let result = text;
  result = result.replace(/[\u2713\u2714\u2715\u2716\u2717\u2718\u2022\u25cf\u25cb\u25a0\u25a1\u2605\u2606\u2192\u2190\u2191\u2193\u27a4\u25b6\u25c0\u2b50\u26a0\u2139\u274c\u2705\u2611\u2612\u2610\u25ba\u25c4\u2666\u2665\u2660\u2663\u2764\u270f\u270e\u2702\u2709\u260e\u231a\u231b\u23f0\u23f3\u2615\u26bd\u26be\u2728\u2733\u2734\u2747\u2756]/g, '');
  result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  const lines = result.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && lines[i + 1] && /^\s*\|[\s:-]+\|/.test(lines[i + 1])) {
      const headerCols = (lines[i].match(/\|/g) || []).length;
      const sepCols = (lines[i + 1].match(/\|/g) || []).length;
      if (sepCols < headerCols) {
        const diff = headerCols - sepCols;
        lines[i + 1] = lines[i + 1].replace(/\|\s*$/, ' --- |'.repeat(diff) + ' |');
      }
    }
  }
  result = lines.join('\n');
  result = result.replace(/\\u20ac/g, '\u20ac');
  return result.trim();
}

export async function callLLM(systemPrompt: string, userPrompt: string, maxTokens: number = 8192): Promise<string> {
  // Priority 1: Google Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const body = {
        systemInstruction: { parts: [{ text: systemPrompt + FORMAT_CONSTRAINT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          thinkingConfig: { thinkingBudget: 0 },
        },
      };
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json() as any;
      if (data.candidates && data.candidates.length > 0) {
        const parts = data.candidates[0].content?.parts || [];
        const textParts = parts
          .filter((p: any) => !p.thought && p.text)
          .map((p: any) => p.text);
        if (textParts.length > 0) return cleanAIOutput(textParts.join("\n"));
      }
      if (data.error) {
        console.error("Errore Gemini API:", data.error.message);
      }
    } catch (error) {
      console.error("Errore chiamata Gemini:", error);
    }
  }

  // Priority 2: Anthropic Claude
  const anthropic = getAnthropicClient();
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: userPrompt }
        ],
        system: systemPrompt + FORMAT_CONSTRAINT,
      });
      const textBlock = message.content.find(b => b.type === "text");
      return cleanAIOutput(textBlock?.text || "Errore nella risposta AI.");
    } catch (error) {
      console.error("Errore chiamata Anthropic:", error);
    }
  }

  return generatePlaceholder(systemPrompt);
}

function generatePlaceholder(systemPrompt: string): string {
  if (systemPrompt.includes("NER") || systemPrompt.includes("entità")) {
    return `## Estrazione Entità (NER)\n\n### Parti Coinvolte\n| Parte | Ruolo | Interessi Identificati |\n|-------|-------|----------------------|\n| Parte Istante | Richiedente | Risoluzione controversia |\n| Parte Convenuta | Resistente | Tutela posizione |\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("giuridica") || systemPrompt.includes("legale")) {
    return `## Analisi Giuridica\n\n### Quadro Normativo\nLa controversia si inquadra nel D.Lgs. 28/2010.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("strategica") || systemPrompt.includes("mediatore")) {
    return `## Guida Strategica\n\nVerificare documentazione e preparare agenda.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("MAAN") || systemPrompt.includes("BATNA")) {
    return `## Analisi MAAN/BATNA\n\nValutare le alternative disponibili per ciascuna parte.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("compatibilità") || systemPrompt.includes("interessi")) {
    return `## Compatibilità Interessi\n\nAnalisi degli interessi convergenti e divergenti.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("bias") || systemPrompt.includes("cognitiv")) {
    return `## Controllo Bias Cognitivi\n\nAnalisi dei principali bias rilevanti per il caso.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("bozza") || systemPrompt.includes("accordo")) {
    return `## Bozza Accordo\n\nBozza da personalizzare in base agli esiti della mediazione.\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("ECONOMICA") || systemPrompt.includes("SCENARIO")) {
    return `## Analisi Economica Comparativa\n\nConfrontare i costi della mediazione con quelli del processo.\n\n> *Configurare API Key per risultati completi*`;
  }
  return `## Analisi AI\n\n> *Configurare API Key per risultati completi*`;
}
