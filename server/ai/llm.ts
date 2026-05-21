import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// ─── COSTANTI MODELLI ─────────────────────────────────────────────────────
// Modello Anthropic centralizzato — modificare qui per cambiarlo.
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const GEMINI_MODEL = "gemini-2.5-flash";

// Output massimo per modello (in token).
// Gemini 2.5 Flash supporta fino a 65536; Claude Haiku 4.5 fino a 16384.
const GEMINI_MAX_OUTPUT = 32768;
const ANTHROPIC_MAX_OUTPUT = 16384;
const DEFAULT_MAX_TOKENS = 16384;

// Massimo numero di continuazioni automatiche se la risposta viene troncata.
const MAX_CONTINUATIONS = 2;

// ─── CLIENTS ──────────────────────────────────────────────────────────────
let geminiClient: GoogleGenerativeAI | null = null;
function getGeminiClient(): GoogleGenerativeAI | null {
  if (geminiClient) return geminiClient;
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return geminiClient;
  }
  return null;
}

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  if (anthropicClient) return anthropicClient;
  if (process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic();
    return anthropicClient;
  }
  return null;
}

// ─── FORMAT CONSTRAINT ────────────────────────────────────────────────────
// Appeso a ogni system prompt. Le aggiunte rispetto alla versione precedente:
//   • istruzione esplicita sui paragrafi separati da riga vuota
//   • istruzione di chiudere ogni sezione anche se ci si avvicina al limite
const FORMAT_CONSTRAINT = `\n\nIMPORTANTE — Regole di formattazione OBBLIGATORIE (violazioni non accettate):
- NON usare MAI emoji, emoticon, simboli Unicode decorativi (frecce speciali, check mark, stelle, pallini colorati, icone, simboli come \u2713 \u2717 \u2022 \u25cf \u2605 \u2192 \u27a4). Usa SOLO caratteri ASCII standard.
- Per le tabelle Markdown: SEMPRE usare | e --- con allineamento a sinistra. OGNI riga DEVE avere ESATTAMENTE lo stesso numero di colonne dell'intestazione. NON lasciare celle vuote, scrivi "-" se non c'e' un valore.
- PRIMA di ogni tabella lascia una riga vuota; DOPO ogni tabella lascia una riga vuota.
- Per i punti elenco usa SOLO trattini (-), mai pallini, asterischi o altri simboli.
- Per enfatizzare usa **grassetto**, mai emoji o simboli.
- SEPARA SEMPRE i paragrafi con UNA RIGA VUOTA (due newline consecutivi). Non scrivere mai due paragrafi su righe consecutive senza riga vuota in mezzo: in Markdown verrebbero fusi in un unico blocco di testo.
- NON troncare MAI l'analisi. Completa SEMPRE ogni sezione fino alla fine. Se ti accorgi di stare per finire lo spazio, sii piu' conciso ma chiudi sempre l'ultima frase e l'ultima sezione.
- Scrivi in italiano professionale e chiaro.
- Per i simboli di valuta usa la parola "euro" o "EUR", non il simbolo.`;

// ─── CLEANUP ──────────────────────────────────────────────────────────────
function cleanAIOutput(text: string): string {
  let result = text;
  result = result.replace(/[\u2713\u2714\u2715\u2716\u2717\u2718\u2022\u25cf\u25cb\u25a0\u25a1\u2605\u2606\u2192\u2190\u2191\u2193\u27a4\u25b6\u25c0\u2b50\u26a0\u2139\u274c\u2705\u2611\u2612\u2610\u25ba\u25c4\u2666\u2665\u2660\u2663\u2764\u270f\u270e\u2702\u2709\u260e\u231a\u231b\u23f0\u23f3\u2615\u26bd\u26be\u2728\u2733\u2734\u2747\u2756]/g, '');
  result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // Fix tabelle: header con N colonne ma separator con < N.
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

  // Garanzia di separazione paragrafi: se ho un newline singolo tra due righe
  // di testo "narrativo" (non liste, non tabelle, non heading), lo trasformo
  // in doppio newline. Conservativo: lo faccio SOLO se entrambe le righe
  // sono prose (no |, no #, no -, no >).
  result = result.replace(
    /([^\n|#\->\s].{20,})\n([^\n|#\->\s])/g,
    '$1\n\n$2'
  );

  return result.trim();
}

// ─── LOGGING ──────────────────────────────────────────────────────────────
function logTruncation(provider: string, reason: string, length: number) {
  console.warn(
    `[callLLM] OUTPUT TRONCATO — provider=${provider} reason=${reason} chars=${length}. ` +
    `Aumenta max_tokens o riduci lo scope della sezione.`
  );
}

// ─── PROVIDER: GEMINI ─────────────────────────────────────────────────────
async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number
): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: systemPrompt + FORMAT_CONSTRAINT }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: Math.min(maxTokens, GEMINI_MAX_OUTPUT),
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json() as any;

    if (data.error) {
      console.error("Errore Gemini API:", data.error.message);
      return null;
    }
    if (!data.candidates || data.candidates.length === 0) return null;

    const candidate = data.candidates[0];
    const parts = candidate.content?.parts || [];
    const textParts = parts
      .filter((p: any) => !p.thought && p.text)
      .map((p: any) => p.text);

    if (textParts.length === 0) return null;

    // FIX: join con \n\n invece di \n per preservare la separazione dei paragrafi.
    const text = textParts.join("\n\n");

    if (candidate.finishReason === "MAX_TOKENS") {
      logTruncation("gemini", "MAX_TOKENS", text.length);
    }

    return text;
  } catch (error) {
    console.error("Errore chiamata Gemini:", error);
    return null;
  }
}

// ─── PROVIDER: ANTHROPIC (con continuazione automatica) ───────────────────
async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number
): Promise<string | null> {
  const anthropic = getAnthropicClient();
  if (!anthropic) return null;

  const cap = Math.min(maxTokens, ANTHROPIC_MAX_OUTPUT);
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "user", content: userPrompt },
  ];

  let fullText = "";
  let continuations = 0;

  while (continuations <= MAX_CONTINUATIONS) {
    try {
      const message = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: cap,
        messages,
        system: systemPrompt + FORMAT_CONSTRAINT,
      });

      const textBlock = message.content.find(b => b.type === "text") as
        | { type: "text"; text: string }
        | undefined;
      const chunk = textBlock?.text || "";
      fullText += chunk;

      if (message.stop_reason !== "max_tokens") {
        return fullText;
      }

      // Risposta troncata: prepariamo una continuazione.
      logTruncation("anthropic", "max_tokens", fullText.length);
      continuations++;
      if (continuations > MAX_CONTINUATIONS) break;

      messages.push({ role: "assistant", content: chunk });
      messages.push({
        role: "user",
        content:
          "Sei stato interrotto a meta'. Continua ESATTAMENTE dal punto in cui ti sei fermato, " +
          "senza ripetere quanto gia' detto, senza preamboli e senza ricominciare la sezione. " +
          "Concludi tutte le sezioni mancanti.",
      });
    } catch (error) {
      console.error("Errore chiamata Anthropic:", error);
      return fullText || null;
    }
  }

  return fullText || null;
}

// ─── DISPATCHER ───────────────────────────────────────────────────────────
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = DEFAULT_MAX_TOKENS
): Promise<string> {
  // Priority 1: Gemini
  const gemini = await callGemini(systemPrompt, userPrompt, maxTokens);
  if (gemini) return cleanAIOutput(gemini);

  // Priority 2: Anthropic
  const claude = await callAnthropic(systemPrompt, userPrompt, maxTokens);
  if (claude) return cleanAIOutput(claude);

  // Fallback: placeholder
  return generatePlaceholder(systemPrompt);
}

// ─── PLACEHOLDER ──────────────────────────────────────────────────────────
function generatePlaceholder(systemPrompt: string): string {
  if (systemPrompt.includes("NER") || systemPrompt.includes("entità")) {
    return `## Estrazione Entità (NER)\n\n### Parti Coinvolte\n\n| Parte | Ruolo | Interessi Identificati |\n|-------|-------|----------------------|\n| Parte Istante | Richiedente | Risoluzione controversia |\n| Parte Convenuta | Resistente | Tutela posizione |\n\n> *Configurare API Key per risultati completi*`;
  }
  if (systemPrompt.includes("giuridica") || systemPrompt.includes("legale")) {
    return `## Analisi Giuridica\n\n### Quadro Normativo\n\nLa controversia si inquadra nel D.Lgs. 28/2010.\n\n> *Configurare API Key per risultati completi*`;
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
