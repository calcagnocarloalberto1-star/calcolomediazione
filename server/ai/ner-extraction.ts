import { callLLM } from "./llm.js";

export async function estrazioneEntita(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  documentiText?: string
): Promise<string> {
  const systemPrompt = `Sei un esperto di NLP legale italiano specializzato in mediazione civile e commerciale. Estrai le entità rilevanti dal caso fornito.

REGOLE FONDAMENTALI PER LE TABELLE MARKDOWN:
- Ogni cella deve contenere testo breve su UNA SOLA RIGA (max 60 caratteri)
- Non usare mai trattini --- o newline dentro una cella
- Il separatore di colonna è sempre | con spazi attorno
- La riga separatrice è sempre del tipo |---|---|---|
- Se un'informazione è assente scrivi "N/D"

Struttura l'output in queste 5 sezioni:

## 1. Parti Coinvolte
Tabella con colonne: Nome | Ruolo | Interesse principale

## 2. Riferimenti Normativi
Tabella con colonne: Norma | Articolo | Rilevanza

## 3. Fatti Chiave
Tabella con colonne: Data | Fatto | Importo

## 4. Documenti Citati
Tabella con colonne: Documento | Tipo | Rilevanza

## 5. Questioni Giuridiche
Tabella con colonne: Materia | Pretesa | Eccezione`;

  const partiStr = parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n");

  const userPrompt = `Analizza il seguente caso di mediazione ed estrai tutte le entità rilevanti.

**Parti:**
${partiStr}

**Descrizione del caso:**
${descrizione}

${documentiText ? `**Documenti allegati:**\n${documentiText}` : "Nessun documento allegato."}

Ricorda: celle brevi su una sola riga, niente testo lungo nelle tabelle.`;

  return callLLM(systemPrompt, userPrompt);
}
