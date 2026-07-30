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
// Default richiesto al provider: il dispatcher chiede SEMPRE il massimo del
// provider, cosi' non c'e' mai un cap artificioso che tronca l'output.
const DEFAULT_MAX_TOKENS = 16384;

// Massimo numero di continuazioni automatiche se la risposta viene troncata.
// Con 4 continuazioni e 16k token Anthropic possiamo arrivare a ~80k token
// totali di output, sufficienti anche per analisi molto lunghe senza tagli.
const MAX_CONTINUATIONS = 4;

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

// True se almeno un provider AI e' configurato (chiave presente).
export function serviziAIDisponibili(): boolean {
return !!(process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY);
}

// ─── FORMAT CONSTRAINT ────────────────────────────────────────────────────
const FORMAT_CONSTRAINT = `\n\nIMPORTANTE — Regole di formattazione OBBLIGATORIE (violazioni non accettate):
- NON usare MAI emoji, emoticon, simboli Unicode decorativi (frecce speciali, check mark, stelle, pallini colorati, icone, simboli come \u2713 \u2717 \u2022 \u25cf \u2605 \u2192 \u27a4). Usa SOLO caratteri ASCII standard.
- Per le tabelle Markdown: SEMPRE usare | e --- con allineamento a sinistra. OGNI riga DEVE avere ESATTAMENTE lo stesso numero di colonne dell'intestazione. NON lasciare celle vuote, scrivi "-" se non c'e' un valore.
- OGNI riga di tabella (intestazione, separatore, righe dati) DEVE stare su una RIGA SEPARATA, terminata da newline. NON mettere mai due righe di tabella su una stessa linea.
- PRIMA di ogni tabella lascia una riga vuota; DOPO ogni tabella lascia una riga vuota.
- Per i punti elenco usa SOLO trattini (-), mai pallini, asterischi o altri simboli.
- Per enfatizzare usa **grassetto**, mai emoji o simboli.
- SEPARA SEMPRE i paragrafi con UNA RIGA VUOTA (due newline consecutivi). Non scrivere mai due paragrafi su righe consecutive senza riga vuota in mezzo: in Markdown verrebbero fusi in un unico blocco di testo.
- NON troncare MAI l'analisi. Completa SEMPRE ogni sezione fino alla fine. Se ti accorgi di stare per finire lo spazio, sii piu' conciso ma chiudi sempre l'ultima frase e l'ultima sezione.
- NON disegnare MAI alberi, schemi, grafici, gerarchie o diagrammi usando caratteri ASCII (slash /, backslash \\, pipe |, trattini --, parentesi, asterischi *). Sono illeggibili e brutti da vedere.
- Per rappresentare alberi decisionali, gerarchie e strutture ramificate usa SOLO elenchi nidificati Markdown con trattini (-) e indentazione di 2 spazi per livello. Esempio corretto:
- Scenario A: Accordo in mediazione
- Probabilità: 60%
- Esito Namira: -20
- Esito Ministero: -20
- Scenario B: Causa civile
- Probabilità: 40%
- Esito Namira: -100
- Esito Ministero: +20
- NON usare MAI code block (tre apici) per rappresentare strutture, tabelle, schemi o testo formattato: i code block servono solo per vero codice sorgente. Per i dati strutturati usa tabelle Markdown o elenchi nidificati.
- Scrivi in italiano professionale e chiaro.
- Per i simboli di valuta usa la parola "euro" o "EUR", non il simbolo.`;

// ─── NORMALIZZAZIONE TABELLE INLINE ───────────────────────────────────────
// Anche se il FORMAT_CONSTRAINT vieta esplicitamente di mettere piu' righe
// di tabella su una stessa linea, il modello a volte concatena comunque
// header + separator + righe data senza newline (specie sotto pressione
// di token). Questa funzione ripara l'output spezzando dove serve.
//
// Pattern riconosciuto: "<testo>|<spazi>|<testo>" che e' "fine cella" seguita
// da spazi seguita da "inizio cella nuova riga". Il separatore di celle
// interno e' "<testo>|<testo>" (senza spazi attorno al pipe), quindi non
// matcha. Il fix viene applicato in modo iterativo (g) per gestire piu'
// righe concatenate nella stessa riga sorgente.
function fixInlineTables(text: string): string {
// Caso 1: separator "|---|" preceduto da fine riga: "...| |---|..."
// Caso 2: riga dati preceduta da fine riga precedente: "...| | val |..."
// Una sola regex copre entrambi i casi: il "successivo" puo' essere
// qualsiasi non-spazio non-pipe (incluso '-' del separator e i dati).
return text.replace(
/([^\s|])[ \t]*\|[ \t]+\|[ \t]*([^\s|])/g,
"$1 |\n| $2"
);
}

// ─── CLEANUP ──────────────────────────────────────────────────────────────
function cleanAIOutput(text: string): string {
let result = text;
result = result.replace(/[\u2713\u2714\u2715\u2716\u2717\u2718\u2022\u25cf\u25cb\u25a0\u25a1\u2605\u2606\u2192\u2190\u2191\u2193\u27a4\u25b6\u25c0\u2b50\u26a0\u2139\u274c\u2705\u2611\u2612\u2610\u25ba\u25c4\u2666\u2665\u2660\u2663\u2764\u270f\u270e\u2702\u2709\u260e\u231a\u231b\u23f0\u23f3\u2615\u26bd\u26be\u2728\u2733\u2734\u2747\u2756]/g, '');
result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

// FIX: ripara tabelle inline (righe concatenate senza newline).
// DEVE essere fatto PRIMA del fix header/separator sotto, perche'
// altrimenti tabelle inline non vengono mai riconosciute.
result = fixInlineTables(result);

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

// ─── PROVIDER: ANTHROPIC (con continuazione automatica) ───────────────────
async function callAnthropic(
systemPrompt: string,
userPrompt: string,
maxTokens: number
): Promise<string | null> {
const anthropic = getAnthropicClient();
if (!anthropic) return null;

// Chiediamo SEMPRE il massimo del provider: se il modello vuole essere
// breve lo sara' comunque, ma cosi' eliminiamo ogni cap artificioso.
const cap = ANTHROPIC_MAX_OUTPUT;
void maxTokens;
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
"Sei stato interrotto a meta'. Continua ESATTAMENTE dal carattere in cui ti sei fermato, " +
"senza ripetere nulla, senza preamboli (NIENTE 'continuo da dove ero rimasto'), senza " +
"ricominciare la sezione, senza riscrivere intestazioni gia' presenti. Concludi tutte " +
"le sezioni mancanti fino alla fine. Se eri a meta' di una frase, riprendi a meta' frase. " +
"Se eri a meta' di una tabella, riprendi con la prossima riga di tabella corretta. " +
"NON aggiungere MAI testo del tipo '...continua' o '[continuazione]'.",
});
} catch (error) {
console.error("Errore chiamata Anthropic:", error);
return fullText || null;
}
}

return fullText || null;
}

// ─── PROVIDER: GEMINI (con continuazione automatica) ──────────────────────
type GeminiContent = { role: "user" | "model"; parts: Array<{ text: string }> };

async function callGeminiOnce(
systemPrompt: string,
contents: GeminiContent[],
cap: number
): Promise<{ text: string; finishReason: string | null } | null> {
const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) return null;

try {
const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`;
const body = {
systemInstruction: { parts: [{ text: systemPrompt + FORMAT_CONSTRAINT }] },
contents,
generationConfig: {
maxOutputTokens: cap,
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

return {
text: textParts.join("\n\n"),
finishReason: candidate.finishReason || null,
};
} catch (error) {
console.error("Errore chiamata Gemini:", error);
return null;
}
}

async function callGemini(
systemPrompt: string,
userPrompt: string,
maxTokens: number
): Promise<string | null> {
// Chiediamo SEMPRE il massimo del provider, come per Anthropic.
const cap = GEMINI_MAX_OUTPUT;
void maxTokens;

const contents: GeminiContent[] = [
{ role: "user", parts: [{ text: userPrompt }] },
];

let fullText = "";
let continuations = 0;

while (continuations <= MAX_CONTINUATIONS) {
const result = await callGeminiOnce(systemPrompt, contents, cap);
if (!result) return fullText || null;

fullText += result.text;

if (result.finishReason !== "MAX_TOKENS") {
return fullText;
}

// Output troncato: prepariamo una continuazione.
logTruncation("gemini", "MAX_TOKENS", fullText.length);
continuations++;
if (continuations > MAX_CONTINUATIONS) break;

contents.push({ role: "model", parts: [{ text: result.text }] });
contents.push({
role: "user",
parts: [{
text:
"Sei stato interrotto a meta'. Continua ESATTAMENTE dal carattere in cui ti sei fermato, " +
"senza ripetere nulla, senza preamboli, senza ricominciare la sezione, senza riscrivere " +
"intestazioni gia' presenti. Concludi tutte le sezioni mancanti fino alla fine. Se eri " +
"a meta' di una frase, riprendi a meta' frase. Se eri a meta' di una tabella, riprendi " +
"con la prossima riga di tabella corretta. NON aggiungere mai testo del tipo " +
"'...continua' o '[continuazione]'.",
}],
});
}

return fullText || null;
}

// ─── DISPATCHER ───────────────────────────────────────────────────────────
// Priority 1: Anthropic Claude Haiku 4.5 — affidabile per markdown e tabelle.
// Priority 2: Gemini 2.5 Flash — fallback economico, attivo solo se manca la
// chiave Anthropic o se Anthropic restituisce null per errore.
export async function callLLM(
systemPrompt: string,
userPrompt: string,
maxTokens: number = DEFAULT_MAX_TOKENS
): Promise<string> {
// Priority 1: Anthropic
const claude = await callAnthropic(systemPrompt, userPrompt, maxTokens);
if (claude) return cleanAIOutput(claude);

// Priority 2: Gemini (fallback)
const gemini = await callGemini(systemPrompt, userPrompt, maxTokens);
if (gemini) return cleanAIOutput(gemini);

// Fallback finale: placeholder
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

// ─── ESTRAZIONE DOCUMENTO DA IMMAGINE (VISIONE) ───────────────────────────
// Usata dal tool antiriciclaggio in modalita' "alta precisione (AI)".
// Riceve un'immagine (base64) e restituisce i campi anagrafici strutturati.
// Riusa la chiave Anthropic gia' configurata (ANTHROPIC_MODEL = Haiku 4.5).
const DOCTYPE_ISTITUZIONALI = new Set(["avviso", "procura", "bonifico"]);
const DOCTYPE_ISTANZA = "istanza";

// Schema dedicato ai documenti "istituzionali" della procedura (istanza di mediazione,
// comunicazione di avvio, procura, ricevuta di pagamento): a differenza di un documento
// d'identita' o di una visura, qui compaiono PIU' soggetti diversi (parte istante,
// rappresentante legale, difensore, controparte) e dati della procedura. Le chiavi
// restituite corrispondono DIRETTAMENTE agli id dei campi del modulo (non passano per
// la mappatura target/tipo usata per i documenti di identita').
const ISTITUZIONALI_SCHEMA: Record<string, string> = {
odm_nome: "Denominazione dell'Organismo di Mediazione destinatario (es. 'Organismo di Mediazione e Formazione dell'Ordine degli Avvocati di Genova')",
proc_n: "Numero della procedura/istanza (es. 'MED-350-286-931-187' o simile)",
proc_data_dep_istanza: "Data di deposito/creazione dell'istanza, in formato AAAA-MM-GG",
op_materia: "Materia della controversia (es. 'Contratti bancari')",
op_valore: "Valore indicativo della controversia, testo cosi' come scritto (es. 'INDETERMINATO (ALTO)' o un importo)",
p_nome: "Denominazione o nome e cognome della PARTE ISTANTE (chi presenta la domanda) — la PRIMA parte istante se ce ne sono piu' d'una",
p_cf: "Codice fiscale o Partita IVA della parte istante",
p_res: "Indirizzo/recapito della parte istante",
p_pec: "PEC della parte istante, se presente",
p_tel: "Telefono della parte istante, se presente",
rappr_nome: "Nome e cognome del RAPPRESENTANTE LEGALE della parte istante (se persona giuridica), oppure del DIFENSORE/avvocato nominato — indica la persona incaricata di assistere/rappresentare la parte istante",
rappr_nascita: "Luogo e data di nascita del rappresentante legale, se presenti (es. 'Genova, 23/04/1969')",
rappr_cf: "Codice fiscale del rappresentante legale o del difensore, se presente"
};

// Schema per l'Istanza di mediazione: a differenza degli altri documenti
// "istituzionali", l'istanza contiene sempre ALMENO DUE parti (istante e
// aderente/i), ciascuna con un eventuale proprio rappresentante legale o
// difensore. Il vecchio schema (una sola parte istante) ignorava l'aderente:
// qui l'AI restituisce un array di tutte le parti trovate, non piu' una sola.
const PARTE_SCHEMA_DESC = `Ogni parte e' un oggetto con queste chiavi (tutte stringhe, "" se assente):
  "ruolo": "istante" oppure "aderente" (mai altro valore)
  "nome": denominazione o nome e cognome della parte
  "cf": codice fiscale o Partita IVA della parte
  "res": indirizzo/recapito della parte
  "pec": PEC della parte, se presente
  "tel": telefono della parte, se presente
  "rappr_nome": nome e cognome del rappresentante legale (se persona giuridica) o del difensore/avvocato di QUESTA parte, se presente
  "rappr_nascita": luogo e data di nascita del rappresentante/difensore, se presenti (es. "Genova, 23/04/1969")
  "rappr_cf": codice fiscale del rappresentante/difensore, se presente
  "rappr_ruolo": "legale_rapp" se e' il rappresentante legale della societa'/ente, "difensore" se e' l'avvocato che assiste la parte, "" se non c'e' alcun rappresentante/difensore per questa parte`;

export async function estraiDocumentoAI(
immagini: Array<{ base64: string; mediaType: string }>,
doctype: string
): Promise<any> {
const anthropic = getAnthropicClient();
if (!anthropic) throw new Error("Servizio AI non configurato (ANTHROPIC_API_KEY mancante).");

if (doctype === DOCTYPE_ISTANZA) {
  const istruzioniIstanza = `Sei un assistente esperto che estrae dati da documenti di una procedura di mediazione civile italiana (D.Lgs. 28/2010) — Istanza e/o Adesione — per compilare la scheda antiriciclaggio (D.Lgs. 231/2007) di TUTTE le parti coinvolte.
Le immagini fornite possono essere piu' pagine di PIU' documenti diversi della STESSA procedura (es. l'Istanza originaria E una successiva Adesione): considerale INSIEME come un unico fascicolo, non solo la prima pagina.
ATTENZIONE — cerca sistematicamente i blocchi RIPETUTI: questi documenti elencano le parti con intestazioni del tipo "Parte Istante N di M" oppure "Parte Invitata/Aderente N di M" (es. "Parte Istante 1 di 5", "Parte Istante 2 di 5", ... fino a "5 di 5"). Se vedi anche un solo blocco con "N di M" e M maggiore di 1, DEVI cercare e restituire TUTTI gli M blocchi corrispondenti, non fermarti al primo. Un'istanza o un'adesione puo' contenere PIU' parti istanti e PIU' parti aderenti: individuale TUTTE, senza escluderne nessuna. Per ciascuna parte individua anche il proprio rappresentante legale o difensore, se indicato nel documento (ogni parte puo' avere un rappresentante diverso).
Se tra le immagini e' presente un'Adesione, essa di norma richiama gli estremi e le parti dell'Istanza originaria: usa queste informazioni per completare l'elenco delle parti istanti, non limitarti ai soli dati della parte che deposita l'adesione.
Leggi con attenzione tutto il testo, incluse intestazioni, tabelle e firme.
Restituisci ESCLUSIVAMENTE un oggetto JSON valido (nessun testo prima o dopo, senza markdown, senza recinti) con questa struttura ESATTA:
{
  "procedura": {
    "odm_nome": "denominazione dell'Organismo di Mediazione destinatario",
    "proc_n": "numero della procedura/istanza",
    "proc_data_dep_istanza": "data di deposito/creazione, formato AAAA-MM-GG",
    "op_materia": "materia della controversia",
    "op_valore": "valore indicativo della controversia, testo cosi' come scritto"
  },
  "parti": [
    { ... una parte, vedi schema sotto ... },
    { ... un'altra parte ... }
  ]
}
${PARTE_SCHEMA_DESC}
Regole ferree: le date SEMPRE in formato AAAA-MM-GG. Se un dato non e' presente o leggibile, usa stringa vuota "". NON inventare MAI valori non presenti nel documento. Includi in "parti" TUTTE le parti realmente presenti nel documento (istanti e aderenti), non fermarti alla prima. Restituisci SOLO il JSON.`;

  const contentIstanza: any[] = immagini.map((im) => ({
    type: "image",
    source: { type: "base64", media_type: im.mediaType as any, data: im.base64 },
  }));
  contentIstanza.push({ type: "text", text: istruzioniIstanza });

  const messageIstanza = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: contentIstanza }],
  });
  const textBlockIstanza = messageIstanza.content.find(b => b.type === "text") as
    | { type: "text"; text: string } | undefined;
  let rawIstanza = (textBlockIstanza?.text || "").trim();
  rawIstanza = rawIstanza.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const si2 = rawIstanza.indexOf("{"), ei2 = rawIstanza.lastIndexOf("}");
  if (si2 >= 0 && ei2 > si2) rawIstanza = rawIstanza.slice(si2, ei2 + 1);
  let parsedIstanza: any = {};
  try { parsedIstanza = JSON.parse(rawIstanza); }
  catch { throw new Error("Risposta AI non interpretabile."); }

  const str = (v: unknown) => (typeof v === "string" ? v : (v == null ? "" : String(v))).trim();
  const procIn = parsedIstanza.procedura || {};
  const procedura = {
    odm_nome: str(procIn.odm_nome),
    proc_n: str(procIn.proc_n),
    proc_data_dep_istanza: str(procIn.proc_data_dep_istanza),
    op_materia: str(procIn.op_materia),
    op_valore: str(procIn.op_valore),
  };
  const partiIn = Array.isArray(parsedIstanza.parti) ? parsedIstanza.parti : [];
  const parti = partiIn.map((p: any) => ({
    ruolo: (str(p.ruolo) === "aderente" ? "aderente" : "istante"),
    nome: str(p.nome),
    cf: str(p.cf),
    res: str(p.res),
    pec: str(p.pec),
    tel: str(p.tel),
    rappr_nome: str(p.rappr_nome),
    rappr_nascita: str(p.rappr_nascita),
    rappr_cf: str(p.rappr_cf),
    rappr_ruolo: (["legale_rapp","difensore"].includes(str(p.rappr_ruolo)) ? str(p.rappr_ruolo) : ""),
  })).filter((p: any) => p.nome);
  return { procedura, parti };
}

if (DOCTYPE_ISTITUZIONALI.has(doctype)) {
const schemaLines = Object.entries(ISTITUZIONALI_SCHEMA)
.map(([k, desc]) => ` "${k}": "${desc}"`).join(",\n");
const istruzioniIst = `Sei un assistente esperto che estrae dati da documenti italiani della procedura di mediazione civile (D.Lgs. 28/2010), per compilare la scheda antiriciclaggio (D.Lgs. 231/2007).
Tipo di documento indicato dall'utente: ${doctype} (documento della procedura, non un documento d'identita': puo' contenere PIU' soggetti diversi — parte istante, suo rappresentante legale o difensore, e la controparte).
Le immagini fornite possono essere piu' pagine dello STESSO documento: considerale insieme.
Concentrati SOLO sulla PARTE ISTANTE (chi presenta la domanda) e sul suo rappresentante/difensore: NON estrarre i dati della controparte/parte invitata.
Leggi con attenzione tutto il testo, incluse intestazioni, tabelle e firme.
Restituisci ESCLUSIVAMENTE un oggetto JSON valido (nessun testo prima o dopo, senza markdown, senza recinti) con ESATTAMENTE queste chiavi, tutte come stringhe. Se un dato non e' presente o non e' leggibile, usa stringa vuota "". NON inventare MAI valori non presenti nel documento.
{
${schemaLines}
}
Regole ferree: le date SEMPRE in formato AAAA-MM-GG. Non aggiungere chiavi diverse da quelle elencate. Restituisci SOLO il JSON.`;

const contentIst: any[] = immagini.map((im) => ({
type: "image",
source: { type: "base64", media_type: im.mediaType as any, data: im.base64 },
}));
contentIst.push({ type: "text", text: istruzioniIst });

const messageIst = await anthropic.messages.create({
model: ANTHROPIC_MODEL,
max_tokens: 1024,
messages: [{ role: "user", content: contentIst }],
});
const textBlockIst = messageIst.content.find(b => b.type === "text") as
| { type: "text"; text: string } | undefined;
let rawIst = (textBlockIst?.text || "").trim();
rawIst = rawIst.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
const si = rawIst.indexOf("{"), ei = rawIst.lastIndexOf("}");
if (si >= 0 && ei > si) rawIst = rawIst.slice(si, ei + 1);
let parsedIst: Record<string, unknown> = {};
try { parsedIst = JSON.parse(rawIst); }
catch { throw new Error("Risposta AI non interpretabile."); }
const outIst: Record<string, string> = {};
for (const k of Object.keys(ISTITUZIONALI_SCHEMA)) {
const val = parsedIst[k];
outIst[k] = (typeof val === "string" ? val : (val == null ? "" : String(val))).trim();
}
return outIst;
}

const istruzioni = `Sei un assistente esperto che estrae dati da documenti italiani per compilare un modulo antiriciclaggio (D.Lgs. 231/2007).
Tipo di documento indicato dall'utente: ${doctype}.
Le immagini fornite possono essere piu' pagine o piu' facciate dello STESSO documento (es. fronte e retro): considerale INSIEME e unisci le informazioni.
Estrai TUTTI i campi effettivamente presenti e leggibili: leggi con attenzione anche il testo piccolo, la zona MRZ (le righe con i simboli < in fondo a carte d'identita' e passaporti), timbri e retro del documento. Per una carta d'identita'/CIE italiana sono di norma leggibili: cognome e nome, luogo e data di nascita, cittadinanza, numero del documento, Comune/autorita' di rilascio, date di rilascio e scadenza; il codice fiscale e la residenza sono spesso presenti (sul retro o sulla CIE): estraili se visibili. Per patente/passaporto adatta di conseguenza; per una visura camerale estrai denominazione, forma giuridica, sede legale, P.IVA/CF e capitale sociale.
Restituisci ESCLUSIVAMENTE un oggetto JSON valido (nessun testo prima o dopo, senza markdown, senza recinti) con ESATTAMENTE queste chiavi, tutte come stringhe. Compila ogni campo che riesci a leggere; usa stringa vuota "" solo per i dati realmente assenti o illeggibili. NON inventare MAI valori non presenti nel documento.
{
"nome": "Cognome e nome della persona fisica; oppure denominazione/ragione sociale se e' una societa'",
"nascita": "Luogo e data di nascita insieme, se presenti (es. 'Roma, 12/03/1980')",
"cf": "Codice fiscale (16 caratteri) della persona fisica; oppure P.IVA/codice fiscale se societa'",
"res": "Indirizzo di residenza (persona fisica) o sede legale (societa')",
"cittadinanza": "Cittadinanza (solo persona fisica)",
"doc": "Tipo e numero del documento (es. 'Carta d'identita' n. CA12345AB')",
"doc_da": "Autorita' o Comune che ha rilasciato il documento",
"doc_il": "Data di rilascio del documento",
"doc_scad": "Data di scadenza del documento",
"forma_giuridica": "Forma giuridica se societa' (es. 'S.r.l.'), altrimenti vuoto",
"capitale": "Capitale sociale se presente, altrimenti vuoto"
}
Regole ferree: le date (doc_il, doc_scad) SEMPRE in formato AAAA-MM-GG. Non aggiungere chiavi diverse da quelle elencate. Restituisci SOLO il JSON.`;

const content: any[] = immagini.map((im) => ({
type: "image",
source: { type: "base64", media_type: im.mediaType as any, data: im.base64 },
}));
content.push({ type: "text", text: istruzioni });

const message = await anthropic.messages.create({
model: ANTHROPIC_MODEL,
max_tokens: 1024,
messages: [{ role: "user", content }],
});

const textBlock = message.content.find(b => b.type === "text") as
| { type: "text"; text: string }
| undefined;
let raw = (textBlock?.text || "").trim();
raw = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");
if (start >= 0 && end > start) raw = raw.slice(start, end + 1);

let parsed: Record<string, unknown> = {};
try { parsed = JSON.parse(raw); }
catch { throw new Error("Risposta AI non interpretabile."); }

const chiavi = ["nome","nascita","cf","res","cittadinanza","doc","doc_da","doc_il","doc_scad","forma_giuridica","capitale"];
const out: Record<string, string> = {};
for (const k of chiavi) {
const val = parsed[k];
out[k] = (typeof val === "string" ? val : (val == null ? "" : String(val))).trim();
}
return out;
}

// ─── ASSISTENTE AI DI COMPILAZIONE (tool antiriciclaggio) ─────────────────
// A differenza di estraiDocumentoAI (un documento alla volta, schema fisso
// per tipo), questo assistente riceve PIU' documenti insieme e una richiesta
// libera dell'utente (es. "Mi compili il modulo AV e la scheda di valutazione
// del rischio alla luce di questi documenti?") e prova a compilare in un colpo
// solo la maggior parte dei campi del Modulo di Adeguata Verifica e della
// Scheda di valutazione del rischio, oltre a rispondere in prosa alla richiesta.
// Riusa lo stesso client/modello di estraiDocumentoAI.

// Campi testuali/selezione: id -> descrizione (per i <select> sono elencati i
// valori ammessi, che vanno riportati ESATTAMENTE come indicato).
const AML_ASSIST_SCHEMA: Record<string, string> = {
odm_nome: "Denominazione dell'Organismo di Mediazione",
odm_iscr: "Numero di iscrizione dell'Organismo al registro del Ministero della Giustizia, se indicato",
odm_sede: "Sede dell'Organismo di Mediazione",
odm_lr: "Legale rappresentante dell'Organismo",
proc_n: "Numero della procedura di mediazione / R.G.",
proc_data_dep_istanza: "Data di deposito dell'istanza, formato AAAA-MM-GG",
proc_data_dep_adesione: "Data di deposito dell'adesione della parte invitata, formato AAAA-MM-GG, se presente",
proc_data: "Data del primo incontro di mediazione, formato AAAA-MM-GG, se nota",
proc_med: "Nome del mediatore designato",
proc_ogg: "Oggetto/materia della controversia in mediazione, in sintesi",
p_ruolo: "Ruolo della parte istante nella procedura. Valori ammessi: istante, aderente, terzo, altro",
p_ruolo_altro: "Se p_ruolo=altro, specificare quale ruolo",
p_tipo: "Se la parte istante e' una persona fisica o un ente/societa'. Valori ammessi: pf, pg",
p_natgiur: "Natura giuridica della parte istante. Valori ammessi: pf (persona fisica), sp (societa' di persone), srl, spa, coop, trust, estera, asd, altro",
p_natgiur_altro: "Se p_natgiur=altro, specificare",
p_area: "Area geografica della parte istante. Valori ammessi: italia, ue, extraue, altorischio",
p_area_stato: "Nome dello Stato, se p_area e' ue o extraue",
p_ident_modalita: "Modalita' con cui e' stata identificata la parte. Valori ammessi: presenza, video, digitale, terzo, altro",
p_nome: "Cognome e nome della parte istante persona fisica, oppure denominazione/ragione sociale se societa'/ente",
p_nascita: "Luogo e data di nascita della parte istante (persona fisica) o sede legale (persona giuridica)",
p_cf: "Codice fiscale (persona fisica) o Partita IVA/codice fiscale (ente) della parte istante",
p_res: "Residenza (persona fisica) o sede legale (persona giuridica) della parte istante, se diversa da p_nascita",
p_cittadinanza: "Cittadinanza della parte istante, solo persona fisica",
p_forma_giuridica: "Forma giuridica della parte istante, solo se persona giuridica (es. S.r.l., S.p.A.)",
p_capitale_sociale: "Capitale sociale della parte istante, solo se persona giuridica e se indicato",
p_tel: "Telefono della parte istante",
p_pec: "PEC della parte istante",
p_email: "E-mail ordinaria della parte istante",
p_doc: "Tipo e numero del documento di identita' della parte istante (o del suo legale rappresentante se ente)",
p_doc_rilasciato_da: "Autorita'/Comune che ha rilasciato il documento della parte istante",
p_doc_rilasciato_il: "Data di rilascio del documento della parte istante, formato AAAA-MM-GG",
p_doc_scadenza: "Data di scadenza del documento della parte istante, formato AAAA-MM-GG",
p_prof: "Professione o attivita' economica prevalente della parte istante",
p_settore: "Settore di attivita' della parte istante, se pertinente",
rappr_ruolo: "Titolo con cui interviene un rappresentante/difensore per la parte istante (se non agisce personalmente). Valori ammessi: nessuno, legale_rapp, difensore, procuratore, esecutore, altro",
rappr_ruolo_altro: "Se rappr_ruolo=altro, specificare",
rappr_nome: "Cognome e nome del rappresentante/difensore/procuratore della parte istante",
rappr_nascita: "Luogo e data di nascita del rappresentante",
rappr_cf: "Codice fiscale del rappresentante",
rappr_res: "Residenza del rappresentante",
rappr_cittadinanza: "Cittadinanza del rappresentante",
rappr_tel: "Telefono del rappresentante",
rappr_pec: "PEC del rappresentante",
rappr_email: "E-mail del rappresentante",
rappr_doc: "Tipo e numero del documento di identita' del rappresentante",
rappr_doc_da: "Autorita'/Comune che ha rilasciato il documento del rappresentante",
rappr_doc_il: "Data di rilascio del documento del rappresentante, formato AAAA-MM-GG",
rappr_doc_scadenza: "Data di scadenza del documento del rappresentante, formato AAAA-MM-GG",
rappr_prof: "Professione del rappresentante",
rappr_settore: "Settore di attivita' del rappresentante",
rappr_legame: "Legame del rappresentante con la parte/l'ente (es. dipendente, socio, procuratore esterno)",
pep_parte: "Se la parte istante e' una Persona Politicamente Esposta. Valori ammessi: no, pep, familiare, collegato",
pep_te: "Se il titolare effettivo e' PEP. Valori ammessi: na, no, si",
pep_rappr: "Se il rappresentante e' PEP. Valori ammessi: na, no, si",
pep_esito: "Esito della verifica PEP. Valori ammessi: nessuna, presenza, rafforzate",
pep_carica: "Carica pubblica ricoperta, se pep_parte non e' 'no'",
pep_stato_ente: "Stato/ente/organizzazione presso cui e' stata ricoperta la carica",
pep_cessazione: "Data di cessazione della carica, formato AAAA-MM-GG, se cessata",
pep_rapporto: "Se familiare/collegato, il tipo di rapporto con la PEP",
pep_motivazione: "Breve motivazione della valutazione PEP",
te_pf_opzione: "Solo se la parte istante e' persona fisica: se agisce per se' o per conto di un titolare effettivo terzo. Valori ammessi: proprio, terzo",
te3_nome: "Cognome e nome del titolare effettivo terzo (quando la parte persona fisica agisce per conto di altri)",
te3_nascita: "Luogo e data di nascita del titolare effettivo terzo",
te3_cf: "Codice fiscale del titolare effettivo terzo",
te3_res: "Residenza del titolare effettivo terzo",
te3_cittadinanza: "Cittadinanza del titolare effettivo terzo",
te3_doc: "Documento di identita' del titolare effettivo terzo",
te_percentuale: "Percentuale di partecipazione del titolare effettivo (solo se la parte e' persona giuridica), es. '30%'",
te_nome: "Cognome e nome del titolare effettivo della societa'/ente (persona giuridica)",
te_nascita: "Luogo e data di nascita del titolare effettivo",
te_cf: "Codice fiscale del titolare effettivo",
te_numero: "Numero di titolari effettivi individuati, se piu' di uno",
te_esito: "Esito della verifica sul titolare effettivo. Valori ammessi: completata, integrare, approfondimento",
te_motivazione: "Motivazione della valutazione sul titolare effettivo",
op_materia: "Materia della controversia (es. condominio, contratti bancari, locazione)",
op_valore: "Valore economico della controversia, cosi' come indicato nella domanda",
op_importo: "Importo previsto per l'esecuzione dell'eventuale accordo, se noto",
op_descrizione: "Breve descrizione della vertenza e delle richieste",
rp_naturagiur: "Suggerimento di rischio per 'natura giuridica' della parte. Valori ammessi: basso, medio, alto",
rp_attivita: "Suggerimento di rischio per 'attivita' svolta'. Valori ammessi: basso, medio, alto",
rp_coerenza: "Suggerimento di rischio per 'coerenza delle dichiarazioni con la documentazione'. Valori ammessi: basso, medio, alto",
rp_areageo: "Suggerimento di rischio per 'area geografica'. Valori ammessi: basso, medio, alto",
rp_trasparenza_te: "Suggerimento di rischio per 'trasparenza titolare effettivo'. Valori ammessi: basso, medio, alto",
rp_pep: "Suggerimento di rischio per 'qualifica PEP'. Valori ammessi: basso, medio, alto",
vp_tipologia: "Suggerimento di rischio per 'tipologia della controversia'. Valori ammessi: basso, medio, alto, na",
vp_valore: "Suggerimento di rischio per 'valore economico'. Valori ammessi: basso, medio, alto, na",
vp_modalita: "Suggerimento di rischio per 'modalita' operative'. Valori ammessi: basso, medio, alto, na",
vp_coerenza: "Suggerimento di rischio per 'coerenza dell'operazione con il profilo della parte'. Valori ammessi: basso, medio, alto, na",
vp_complessita: "Suggerimento di rischio per 'complessita' dell'operazione'. Valori ammessi: basso, medio, alto, na",
risk_livello: "Proposta di livello di rischio complessivo della parte/procedura. Valori ammessi: basso, medio, alto",
risk_motivazione: "Motivazione sintetica del livello di rischio proposto",
anomalie_presenti: "Se emergono indicatori di anomalia dai documenti. Valori ammessi: no, si",
anomalie_spiegate: "Se le eventuali anomalie hanno una spiegazione ragionevole e documentata. Valori ammessi: na, si, no",
anomalie_approfondimenti: "Approfondimenti eventualmente gia' svolti risultanti dai documenti",
anomalie_documentazione: "Documentazione acquisita a giustificazione di eventuali anomalie",
av_tipo: "Tipo di adeguata verifica da applicare in base al rischio. Valori ammessi: semplificata, ordinaria, rafforzata"
};

// Campi checkbox: id -> descrizione. Vanno inclusi in "campi" con valore
// booleano true SOLO quando la condizione risulta dai documenti; altrimenti
// vanno omessi (mai impostare esplicitamente false).
const AML_ASSIST_CHECKBOX_SCHEMA: Record<string, string> = {
cb_identfonte_originale: "Identita' riscontrata su documento originale",
cb_identfonte_cie: "Identita' riscontrata tramite CIE",
cb_identfonte_spid: "Identita' riscontrata tramite SPID",
cb_identfonte_firmadig: "Identita' riscontrata tramite firma digitale",
cb_identfonte_registro: "Identita' riscontrata tramite Registro Imprese",
cb_rappr_titolo_statuto: "Potere di rappresentanza risultante da statuto",
cb_rappr_titolo_visura: "Potere di rappresentanza risultante da visura camerale",
cb_rappr_titolo_procnot: "Potere di rappresentanza risultante da procura notarile",
cb_rappr_titolo_procsp: "Potere di rappresentanza risultante da procura speciale per la mediazione",
cb_rappr_poteri_rappresentare: "Il rappresentante ha il potere di rappresentare la parte in mediazione",
cb_rappr_poteri_proposte: "Il rappresentante ha il potere di formulare/ricevere proposte conciliative",
cb_rappr_poteri_disporre: "Il rappresentante ha il potere di disporre del diritto controverso",
cb_rappr_poteri_sottoscrivere: "Il rappresentante ha il potere di sottoscrivere l'accordo",
cb_pep_dichparte: "Verifica PEP effettuata tramite dichiarazione della parte",
cb_pep_banca: "Verifica PEP effettuata tramite banca dati PEP",
cb_tecrit_propdiretta: "Titolare effettivo individuato per proprieta' diretta",
cb_tecrit_propindiretta: "Titolare effettivo individuato per proprieta' indiretta",
cb_tecrit_controllo: "Titolare effettivo individuato per controllo",
cb_tecrit_poteri: "Titolare effettivo individuato per poteri di amministrazione/direzione",
cb_tefonte_visura: "Titolare effettivo individuato da visura camerale",
cb_tefonte_statuto: "Titolare effettivo individuato da statuto",
cb_tefonte_libro: "Titolare effettivo individuato da libro soci",
cb_tefonte_assetto: "Titolare effettivo individuato da assetto proprietario dichiarato",
cb_tefonte_docsoc: "Titolare effettivo individuato da documentazione societaria",
cb_tefonte_dichparte: "Titolare effettivo individuato da dichiarazione della parte",
cb_accordo_nessuntrasf: "L'eventuale accordo non comporta alcun trasferimento patrimoniale",
cb_accordo_pagamento: "L'eventuale accordo puo' comportare pagamento di somme di denaro",
cb_accordo_immobile: "L'eventuale accordo puo' comportare trasferimento di beni immobili",
cb_accordo_quote: "L'eventuale accordo puo' comportare trasferimento di quote societarie",
cb_accordo_azienda: "L'eventuale accordo puo' comportare trasferimento di aziende",
cb_accordo_dirittireali: "L'eventuale accordo puo' comportare costituzione/trasferimento di diritti reali",
cb_accordo_farenonfare: "L'eventuale accordo puo' comportare obblighi di fare o non fare",
cb_provenienza_redditolav: "Fondi da reddito da lavoro dipendente",
cb_provenienza_redditoauton: "Fondi da reddito da lavoro autonomo",
cb_provenienza_redditoimpresa: "Fondi da reddito d'impresa",
cb_provenienza_disponente: "Fondi da disponibilita' dell'ente/societa'",
cb_provenienza_finanziamento: "Fondi da finanziamento bancario",
cb_provenienza_mutuo: "Fondi da mutuo",
cb_provenienza_donazione: "Fondi da donazione",
cb_provenienza_eredita: "Fondi da eredita'",
cb_provenienza_venditabeni: "Fondi da vendita di beni",
cb_provenienza_investimenti: "Fondi da investimenti",
cb_provenienza_risparmi: "Fondi da risparmi",
cb_pagamento_bonifico: "Pagamento previsto tramite bonifico bancario",
cb_pagamento_assegnocirc: "Pagamento previsto tramite assegno circolare",
cb_pagamento_assegnobanc: "Pagamento previsto tramite assegno bancario",
cb_an_1: "Indicatore di anomalia: informazioni contraddittorie o incoerenti",
cb_an_2: "Indicatore di anomalia: documentazione incompleta o incoerente rispetto alle dichiarazioni",
cb_an_3: "Indicatore di anomalia: rifiuto di fornire dati/documentazione per l'adeguata verifica",
cb_an_4: "Indicatore di anomalia: soggetti interposti o strutture societarie non trasparenti",
cb_an_5: "Indicatore di anomalia: movimentazioni non coerenti con il valore della controversia o il profilo economico",
cb_an_6: "Indicatore di anomalia: reticenza o ingiustificato rifiuto di fornire informazioni",
cb_an_7: "Indicatore di anomalia: controversia apparentemente artificiosa o priva di reale contrapposizione",
cb_an_8: "Indicatore di anomalia: accordo manifestamente sproporzionato rispetto all'oggetto della controversia",
cb_an_9: "Indicatore di anomalia: pagamento/trasferimento a favore di un soggetto estraneo alla controversia",
cb_an_10: "Indicatore di anomalia: pagamento effettuato da un terzo privo di collegamento apparente con la procedura",
cb_an_11: "Indicatore di anomalia: modifiche frequenti e non giustificate del beneficiario o delle modalita' di pagamento",
cb_an_12: "Indicatore di anomalia: trasferimento di immobili/aziende/partecipazioni a valori incongrui",
cb_an_13: "Indicatore di anomalia: utilizzo ingiustificato di contanti, conti esteri, cripto-attivita' o strumenti non ordinari",
cb_an_14: "Indicatore di anomalia: utilizzo di societa'/trust/soggetti interposti non coerente con la controversia",
cb_an_15: "Indicatore di anomalia: ripetute procedure di mediazione tra soggetti collegati",
cb_an_16: "Indicatore di anomalia: rifiuto di chiarire la titolarita' effettiva o la provenienza dei fondi",
cb_an_17: "Indicatore di anomalia: richieste anomale di occultamento di identita', beneficiario, provenienza fondi o condizioni economiche",
cb_avmis_docint: "Misura rafforzata applicata: acquisizione di ulteriore documentazione",
cb_avmis_approftit: "Misura rafforzata applicata: approfondimento sul titolare effettivo",
cb_avmis_provfondi: "Misura rafforzata applicata: verifica della provenienza dei fondi",
cb_avmis_benef: "Misura rafforzata applicata: verifica del beneficiario dell'operazione",
cb_avmis_terzi: "Misura rafforzata applicata: verifica di eventuali soggetti terzi coinvolti",
cb_docacq_identita: "Acquisito documento di identita' (parte, esecutore, titolare effettivo)",
cb_docacq_cf: "Acquisito codice fiscale",
cb_docacq_visura: "Acquisita visura camerale",
cb_docacq_statuto: "Acquisito statuto",
cb_docacq_attocost: "Acquisito atto costitutivo",
cb_docacq_procalliti: "Acquisita procura alle liti",
cb_docacq_procspec: "Acquisita procura speciale/sostanziale per la mediazione",
cb_docacq_procnot: "Acquisita procura notarile",
cb_docacq_modulomav: "Acquisito il modulo di Adeguata Verifica"
};

export async function assistenteCompilazioneAI(
immagini: Array<{ base64: string; mediaType: string }>,
richiesta: string
): Promise<{ risposta: string; campi: Record<string, string | boolean> }> {
const anthropic = getAnthropicClient();
if (!anthropic) throw new Error("Servizio AI non configurato (ANTHROPIC_API_KEY mancante).");

const schemaTesto = Object.entries(AML_ASSIST_SCHEMA).map(([k, d]) => ` "${k}": "${d}"`).join(",\n");
const schemaCheckbox = Object.entries(AML_ASSIST_CHECKBOX_SCHEMA).map(([k, d]) => ` "${k}": "${d}"`).join(",\n");

const istruzioni = `Sei un assistente esperto di antiriciclaggio (D.Lgs. 231/2007) nella mediazione civile (D.Lgs. 28/2010). Un mediatore/Organismo ti ha caricato uno o piu' documenti del fascicolo di una procedura (es. istanza di mediazione, documenti di identita', visura camerale, procura, comunicazioni, ricevute di pagamento) e ti ha rivolto questa richiesta in linguaggio naturale:

"""${richiesta || "Compila il modulo di Adeguata Verifica e la scheda di valutazione del rischio alla luce di questi documenti."}"""

Il tuo compito e' duplice:
1) Rispondere alla richiesta in linguaggio naturale, in italiano professionale e chiaro, in un campo "risposta" (poche frasi): spiega che cosa hai fatto, quali documenti hai usato, quali dati NON hai trovato e quindi non hai potuto compilare, ed eventuali osservazioni utili (es. se i documenti riguardano piu' parti, spiega che questa compilazione copre la parte istante principale e che le altre parti vanno aggiunte separatamente con "+ Nuova parte per questa procedura"). Se dai documenti emerge un elemento di rischio o un'anomalia, segnalalo chiaramente nella risposta.
2) Estrarre dai documenti quanti piu' campi possibile del modulo, in un campo "campi" (object).

Leggi con attenzione TUTTI i documenti forniti (possono essere piu' pagine e piu' documenti diversi): incrociali per ricostruire un quadro coerente (es. i dati anagrafici possono comparire su un documento di identita', l'oggetto e il valore della controversia sull'istanza, la sede legale sulla visura, ecc.).
Se i documenti riguardano piu' parti istanti o piu' controparti, concentrati SOLO sulla PRIMA parte istante (chi presenta la domanda) salvo diversa indicazione esplicita nella richiesta dell'utente.
NON inventare MAI valori non presenti nei documenti o non ragionevolmente deducibili dal contesto. Per i campi di "valutazione del rischio" (quelli descritti come "Suggerimento di rischio" o "Proposta") puoi formulare una valutazione professionale ragionevole in base al contenuto dei documenti, ma resta un SUGGERIMENTO che l'utente dovra' confermare.

Restituisci ESCLUSIVAMENTE un oggetto JSON valido (nessun testo prima o dopo, senza markdown, senza recinti), con questa struttura:
{
"risposta": "testo della risposta discorsiva in italiano",
"campi": {
 // includi SOLO le chiavi (tra quelle elencate sotto) per cui hai un valore effettivo
}
}

Campi TESTO/SELEZIONE disponibili (valore sempre come stringa; per i valori "ammessi" riporta ESATTAMENTE uno di quelli indicati; le date sempre in formato AAAA-MM-GG):
{
${schemaTesto}
}

Campi CHECKBOX disponibili (valore booleano; includili in "campi" con valore true SOLO se la condizione risulta dai documenti; se non risulta, ometti semplicemente la chiave — non scrivere mai false):
{
${schemaCheckbox}
}

Regola ferrea: non aggiungere in "campi" chiavi diverse da quelle elencate sopra. Restituisci SOLO il JSON.`;

const content: any[] = immagini.map((im) => ({
type: "image",
source: { type: "base64", media_type: im.mediaType as any, data: im.base64 },
}));
content.push({ type: "text", text: istruzioni });

const message = await anthropic.messages.create({
model: ANTHROPIC_MODEL,
max_tokens: 4096,
messages: [{ role: "user", content }],
});

const textBlock = message.content.find(b => b.type === "text") as
| { type: "text"; text: string }
| undefined;
let raw = (textBlock?.text || "").trim();
raw = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");
if (start >= 0 && end > start) raw = raw.slice(start, end + 1);

let parsed: any = {};
try { parsed = JSON.parse(raw); }
catch { throw new Error("Risposta AI non interpretabile."); }

const risposta = typeof parsed.risposta === "string" ? parsed.risposta.trim() : "";
const campiIn = (parsed.campi && typeof parsed.campi === "object") ? parsed.campi : {};
const campi: Record<string, string | boolean> = {};
for (const k of Object.keys(AML_ASSIST_SCHEMA)) {
const val = campiIn[k];
if (val === undefined || val === null) continue;
const s = String(val).trim();
if (s) campi[k] = s;
}
for (const k of Object.keys(AML_ASSIST_CHECKBOX_SCHEMA)) {
const val = campiIn[k];
if (val === true || val === "true") campi[k] = true;
}
return { risposta: risposta || "Ho analizzato i documenti caricati e compilato i campi individuati qui sotto: controllali prima di applicarli.", campi };
}

// ─── RICERCA SEMANTICA GIURISPRUDENZA (pagina pubblica Giurisprudenza) ─────
// Riceve la domanda dell'utente e un catalogo testuale compatto delle pronunce
// (dati PUBBLICI, nessun dato personale) e restituisce gli id piu' pertinenti
// con una breve motivazione. Riusa la chiave Anthropic gia' configurata.
export async function cercaGiurisprudenzaAI(
query: string,
catalogo: string
): Promise<Array<{ id: number; motivo: string }>> {
const anthropic = getAnthropicClient();
if (!anthropic) throw new Error("Servizio AI non configurato (ANTHROPIC_API_KEY mancante).");

const system = `Sei un assistente giuridico esperto di mediazione civile e commerciale italiana (D.Lgs. 28/2010). Ti viene fornito un CATALOGO di pronunce, una per riga, ciascuna con il proprio identificativo numerico. In base alla richiesta dell'utente, individua le pronunce del catalogo piu' pertinenti (massimo 8), ordinate dalla piu' rilevante alla meno rilevante. Usa SOLO gli id presenti nel catalogo: non inventarne mai. Se nessuna pronuncia e' davvero pertinente, restituisci un array vuoto. Rispondi ESCLUSIVAMENTE con un array JSON valido, senza alcun testo attorno e senza markdown, nel formato: [{"id": <numero>, "motivo": "<una frase concisa sul perche' e' pertinente alla richiesta>"}].`;

const user = `RICHIESTA DELL'UTENTE:\n${query}\n\nCATALOGO:\n${catalogo}`;

const message = await anthropic.messages.create({
model: ANTHROPIC_MODEL,
max_tokens: 1500,
system,
messages: [{ role: "user", content: user }],
});

const textBlock = message.content.find(b => b.type === "text") as
| { type: "text"; text: string }
| undefined;
let raw = (textBlock?.text || "").trim();
raw = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
const start = raw.indexOf("[");
const end = raw.lastIndexOf("]");
if (start >= 0 && end > start) raw = raw.slice(start, end + 1);

let parsed: unknown;
try { parsed = JSON.parse(raw); }
catch { return []; }
if (!Array.isArray(parsed)) return [];

const out: Array<{ id: number; motivo: string }> = [];
for (const item of parsed) {
const id = Number((item as any)?.id);
const motivo = String((item as any)?.motivo ?? "").trim();
if (Number.isFinite(id)) out.push({ id, motivo });
}
return out.slice(0, 8);
}

// ─── ASSISTENTE SUI CONTENUTI DEL SITO ────────────────────────────────────
// Chat ancorata alla base di conoscenza (FAQ, glossario, guide). Dati pubblici.
export async function rispostaAssistente(
messages: Array<{ role: "user" | "assistant"; content: string }>,
baseConoscenza: string
): Promise<string> {
const anthropic = getAnthropicClient();
if (!anthropic) throw new Error("Servizio AI non configurato (ANTHROPIC_API_KEY mancante).");

const system = `Sei l'assistente virtuale del sito CalcoloMediazione.it, dedicato alla mediazione civile e commerciale italiana (D.Lgs. 28/2010) e agli strumenti del sito.
Rispondi in italiano, in modo chiaro e professionale, basandoti PRIMA DI TUTTO sulla BASE DI CONOSCENZA qui sotto (tratta dai contenuti del sito). Puoi integrare con nozioni consolidate e non controverse del diritto della mediazione, ma SOLO se sei certo del riferimento esatto.
Regole:
- NON INVENTARE MAI un numero di articolo, comma o decreto di cui non sei certo: in caso di dubbio, esponi il principio in termini generali senza citare il numero esatto, oppure invita a verificare il testo aggiornato della norma.
- NON citare MAI sentenze, ordinanze o pronunce di alcun tipo (Cassazione, Tribunali, Corti d'Appello): per la giurisprudenza rimanda sempre alla banca dati del sito (ricerca AI di giurisprudenza), non fornire mai tu direttamente estremi di una sentenza.
- Se la domanda esce dall'ambito della mediazione civile/commerciale e degli strumenti del sito, dillo con cortesia e riporta l'utente in tema.
- Se non conosci la risposta con certezza, o se dipende dal caso concreto, dillo apertamente e invita a consultare un professionista o a usare gli strumenti del sito.
- Quando pertinente, indirizza agli strumenti del sito: calcolatore indennita (D.M. 150/2023), confronto costi, analisi AI del caso, generatore procura, banca dati di giurisprudenza con ricerca AI, strumento antiriciclaggio.
- NON fornire consulenza legale personalizzata: ricorda, quando serve, che si tratta di informazioni generali che non sostituiscono il parere di un professionista.
- Sii conciso: di norma 3-8 frasi, salvo richiesta di approfondimento.

BASE DI CONOSCENZA:
${baseConoscenza}`;

const msg = await anthropic.messages.create({
model: ANTHROPIC_MODEL,
max_tokens: 1200,
system,
messages: messages.map(m => ({ role: m.role, content: m.content })),
});

const tb = msg.content.find(b => b.type === "text") as
| { type: "text"; text: string }
| undefined;
return (tb?.text || "").trim() || "Mi dispiace, non sono riuscito a formulare una risposta. Riprova a riformulare la domanda.";
}
