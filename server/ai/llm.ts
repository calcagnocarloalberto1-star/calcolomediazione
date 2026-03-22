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
  // Remove common unicode decorative symbols that break rendering
  result = result.replace(/[\u2713\u2714\u2715\u2716\u2717\u2718\u2022\u25cf\u25cb\u25a0\u25a1\u2605\u2606\u2192\u2190\u2191\u2193\u27a4\u25b6\u25c0\u2b50\u26a0\u2139\u274c\u2705\u2611\u2612\u2610\u25ba\u25c4\u2666\u2665\u2660\u2663\u2764\u270f\u270e\u2702\u2709\u260e\u231a\u231b\u23f0\u23f3\u2615\u26bd\u26be\u2728\u2733\u2734\u2747\u2756]/g, '');
  // Remove emoji ranges
  result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  // Fix table formatting: ensure separator row has correct column count
  const lines = result.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && lines[i + 1] && /^\s*\|[\s:-]+\|/.test(lines[i + 1])) {
      const headerCols = (lines[i].match(/\|/g) || []).length;
      const sepCols = (lines[i + 1].match(/\|/g) || []).length;
      if (sepCols < headerCols) {
        // Fix separator row to match header column count
        const diff = headerCols - sepCols;
        lines[i + 1] = lines[i + 1].replace(/\|\s*$/, ' --- |'.repeat(diff) + ' |');
      }
    }
  }
  result = lines.join('\n');
  // Replace € symbol with EUR for consistency (some fonts don't render it)
  // Actually keep € as it renders fine in browsers, just clean up encoding issues
  result = result.replace(/\\u20ac/g, '\u20ac');
  return result.trim();
}

export async function callLLM(systemPrompt: string, userPrompt: string, maxTokens: number = 16384): Promise<string> {
  // Priority 1: Google Gemini (direct REST API to control thinkingConfig)
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
      // Fall through to Anthropic or placeholder
    }
  }

  // Priority 2: Anthropic Claude
  const anthropic = getAnthropicClient();
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: "claude_sonnet_4_6",
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: userPrompt }
        ],
        system: systemPrompt + FORMAT_CONSTRAINT,
      });
      const textBlock = message.content.find(b => b.type === "text");
      return textBlock?.text || "Errore nella risposta AI.";
    } catch (error) {
      console.error("Errore chiamata Anthropic:", error);
      // Fall through to placeholder
    }
  }

  // Fallback: return structured placeholder
  return generatePlaceholder(systemPrompt);
}

function generatePlaceholder(systemPrompt: string): string {
  if (systemPrompt.includes("NER") || systemPrompt.includes("entità")) {
    return `## Estrazione Entità (NER)

### Parti Coinvolte
| Parte | Ruolo | Interessi Identificati |
|-------|-------|----------------------|
| Parte Istante | Richiedente | Risoluzione controversia, risarcimento |
| Parte Convenuta | Resistente | Minimizzare esposizione, tutela posizione |

### Riferimenti Normativi Estratti
- **D.Lgs. 28/2010** — Disciplina della mediazione civile e commerciale
- **D.M. 150/2023** — Regolamento indennità di mediazione
- **Art. 5 D.Lgs. 28/2010** — Condizione di procedibilità

### Fatti Chiave
1. Controversia di natura civile/commerciale
2. Materia rientrante nella mediazione obbligatoria
3. Valore della lite determinato/determinabile

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("giuridica") || systemPrompt.includes("legale")) {
    return `## Analisi Giuridica

### Quadro Normativo Applicabile
La controversia si inquadra nel perimetro del **D.Lgs. 28/2010** come modificato dal **D.Lgs. 149/2022** (Riforma Cartabia).

### Precedenti Giurisprudenziali Rilevanti
- **Cass. Sez. Un. 18/09/2020 n. 19596** — Natura della mediazione obbligatoria
- **Cass. Civ. 14/12/2021 n. 40035** — Effettività del tentativo di mediazione

### Analisi dei Rischi Processuali
| Rischio | Probabilità | Impatto |
|---------|------------|---------| 
| Improcedibilità domanda | Media | Alto |
| Condanna spese ex art. 13 | Bassa | Medio |
| Mancata partecipazione | Media | Alto |

### Raccomandazioni
1. Procedere con il tentativo di mediazione come condizione di procedibilità
2. Preparare documentazione completa per il primo incontro
3. Valutare margini di negoziazione realistici

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("strategica") || systemPrompt.includes("mediatore")) {
    return `## Guida Strategica per il Mediatore

### Fase Preparatoria
- Verificare la completezza della documentazione depositata
- Analizzare i profili delle parti e i potenziali punti di convergenza
- Predisporre agenda per il primo incontro informativo

### Strategia di Apertura
1. **Sessione congiunta iniziale** — Presentazione del procedimento e regole
2. **Ascolto attivo** — Raccogliere le posizioni dichiarate di entrambe le parti
3. **Identificazione interessi** — Distinguere posizioni da interessi sottostanti

### Tecniche Suggerite
| Fase | Tecnica | Obiettivo |
|------|---------|-----------| 
| Apertura | Reality testing | Allineare aspettative |
| Esplorazione | Domande circolari | Far emergere interessi |
| Negoziazione | BATNA analysis | Valutare alternative |
| Chiusura | Single-text procedure | Convergere su accordo |

### Punti Critici da Monitorare
- Squilibrio di potere tra le parti
- Resistenze emotive e blocchi comunicativi
- Aspettative economiche irrealistiche

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("MAAN") || systemPrompt.includes("BATNA")) {
    return `## Analisi MAAN/BATNA

### Migliore Alternativa All'Accordo Negoziato

#### Parte Istante
| Alternativa | Probabilità Successo | Costo Stimato | Tempo Stimato |
|-------------|---------------------|---------------|---------------|
| Causa ordinaria | 60% | €5.000-15.000 | 24-36 mesi |
| Arbitrato | 65% | €3.000-8.000 | 12-18 mesi |
| Rinuncia | 100% | €0 | Immediato |

**BATNA Score**: 5.5/10

#### Parte Convenuta
| Alternativa | Probabilità Successo | Costo Stimato | Tempo Stimato |
|-------------|---------------------|---------------|---------------|
| Difesa in giudizio | 40% | €4.000-12.000 | 24-36 mesi |
| Transazione diretta | 70% | Variabile | 1-3 mesi |

**BATNA Score**: 4.8/10

### Zona di Possibile Accordo (ZOPA)
La ZOPA si colloca presumibilmente tra il **40% e il 70%** del valore della pretesa, considerando i costi e tempi delle alternative.

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("compatibilità") || systemPrompt.includes("interessi")) {
    return `## Analisi Compatibilità Interessi

### Matrice degli Interessi
| Interesse | Parte Istante | Parte Convenuta | Compatibilità |
|-----------|--------------|-----------------|---------------|
| Economico | Alta | Media | Parziale |
| Relazionale | Bassa | Media | Alta |
| Temporale | Molto Alta | Alta | Alta |
| Reputazionale | Media | Molto Alta | Parziale |

### Interessi Convergenti
1. **Rapidità di risoluzione** — Entrambe le parti preferiscono evitare i tempi del contenzioso
2. **Riservatezza** — Interesse condiviso a non pubblicizzare la controversia
3. **Continuità rapporti** — Possibile interesse al mantenimento del rapporto

### Interessi Divergenti
1. **Quantificazione economica** — Gap significativo tra domanda e offerta
2. **Riconoscimento responsabilità** — Posizioni contrapposte

### Possibili Soluzioni Creative
- Pagamento dilazionato con garanzie
- Prestazione in natura alternativa
- Accordo parziale con riserva su punti specifici

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("bias") || systemPrompt.includes("cognitiv")) {
    return `## Controllo Bias Cognitivi

### Bias Identificati

#### 1. Ancoraggio (Anchoring)
- **Rischio**: Alto
- **Descrizione**: Le parti tendono ad ancorarsi alla prima cifra menzionata
- **Mitigazione**: Utilizzare range ampi, introdurre criteri oggettivi di valutazione

#### 2. Avversione alla Perdita (Loss Aversion)
- **Rischio**: Medio
- **Descrizione**: Le concessioni vengono percepite come perdite piuttosto che investimenti
- **Mitigazione**: Riformulare le concessioni come guadagni futuri

#### 3. Framing
- **Rischio**: Alto
- **Descrizione**: La presentazione della proposta influenza significativamente l'accettazione
- **Mitigazione**: Presentare le opzioni in termini sia di guadagno che di perdita

#### 4. Overconfidence
- **Rischio**: Medio
- **Descrizione**: Sopravvalutazione delle proprie chance processuali
- **Mitigazione**: Reality testing con dati statistici su esiti giudiziari

#### 5. Sunk Cost Fallacy
- **Rischio**: Basso
- **Descrizione**: Riluttanza ad abbandonare la posizione per costi già sostenuti
- **Mitigazione**: Focus su costi futuri, non passati

### Raccomandazioni per il Mediatore
Utilizzare tecniche di debiasing progressivo durante le sessioni.

> *Analisi generata automaticamente — configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("ECONOMICA COMPARATIVA") || systemPrompt.includes("SCENARIO A")) {
    return `## Sezione Economica Comparativa

### Scenario A: Mediazione Positiva

| Voce | Importo per parte |
|------|-------------------|
| Indennita' organismo di mediazione | Variabile per scaglione D.M. 150/2023 |
| Compenso avvocato (stragiudiziale) | Variabile per valore lite |
| Spese generali + CPA + IVA | Calcolati su compenso |
| Imposta di registro | Esente ex art. 17 D.Lgs. 28/2010 |
| Imposta di bollo | Esente ex art. 17 D.Lgs. 28/2010 |
| Crediti d'imposta | Fino a EUR 1.200 totali |

### Scenario B: Processo Civile

| Voce | Importo per parte |
|------|-------------------|
| Indennita' mediazione negativa | Solo spese avvio |
| Contributo unificato | Variabile per scaglione D.P.R. 115/2002 |
| Compenso avvocato (giudiziale) | Parametri forensi D.M. 55/2014 |
| CTU | Stima variabile |
| Imposta di registro sentenza | 3% del valore |

### Confronto Riepilogativo

La mediazione positiva comporta un risparmio significativo rispetto al processo civile.

> *Analisi generata automaticamente - configurare API Key per risultati completi*`;
  }

  if (systemPrompt.includes("bozza") || systemPrompt.includes("accordo")) {
    return `## Bozza Accordo di Mediazione

---

### VERBALE DI ACCORDO DI MEDIAZIONE
**ai sensi dell'art. 11 D.Lgs. 28/2010**

**Organismo di Mediazione**: [Nome Organismo]
**N. Procedimento**: [Numero]
**Data**: ${new Date().toLocaleDateString('it-IT')}

---

### PREMESSO CHE

- In data odierna si è svolto l'incontro di mediazione tra le parti;
- Le parti, assistite dai rispettivi avvocati, hanno partecipato attivamente;
- Il mediatore ha facilitato la comunicazione e la ricerca di soluzioni;

### LE PARTI CONVENGONO QUANTO SEGUE

**Art. 1 — Oggetto**
Le parti raggiungono il seguente accordo in relazione alla controversia avente ad oggetto [descrizione].

**Art. 2 — Obbligazioni**
[Parte A] si impegna a: [obbligazione]
[Parte B] si impegna a: [obbligazione]

**Art. 3 — Tempistica**
Le prestazioni di cui all'art. 2 dovranno essere eseguite entro [termine].

**Art. 4 — Clausola di riservatezza**
Le parti si impegnano a mantenere riservato il contenuto del presente accordo.

**Art. 5 — Spese di mediazione**
Le spese di mediazione sono ripartite in parti uguali / come segue: [ripartizione].

---

*Il presente accordo, sottoscritto dalle parti e dai rispettivi avvocati, costituisce titolo esecutivo ai sensi dell'art. 12 D.Lgs. 28/2010.*

> *Bozza generata automaticamente — configurare API Key per risultati completi*`;
  }

  return `## Analisi AI

Questa sezione verrà generata automaticamente quando sarà configurata la chiave API.

Per attivare l'analisi AI completa, configurare la variabile d'ambiente.

> *Configurare API Key per risultati completi*`;
}
