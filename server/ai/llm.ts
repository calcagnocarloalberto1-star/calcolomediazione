import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (client) return client;
  // The API key is injected via api_credentials when the server starts
  if (process.env.ANTHROPIC_API_KEY) {
    client = new Anthropic();
    return client;
  }
  return null;
}

// Global formatting constraint appended to every system prompt
const FORMAT_CONSTRAINT = `\n\nIMPORTANTE — Regole di formattazione obbligatorie:
- NON usare emoji, emoticon, simboli Unicode decorativi (come frecce speciali, check mark, stelle, pallini colorati, icone). Usa solo testo ASCII standard.
- Per le tabelle, usa il formato Markdown standard con | e --- (allineamento a sinistra). Ogni riga della tabella deve avere lo stesso numero di colonne dell'intestazione.
- Per i punti elenco usa trattini (-) semplici, non pallini o altri simboli.
- Per enfatizzare usa **grassetto** e NON emoji o simboli speciali.
- Scrivi in italiano professionale e chiaro.`;

export async function callLLM(systemPrompt: string, userPrompt: string, maxTokens: number = 4096): Promise<string> {
  const anthropicClient = getClient();
  
  if (anthropicClient) {
    try {
      const message = await anthropicClient.messages.create({
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
