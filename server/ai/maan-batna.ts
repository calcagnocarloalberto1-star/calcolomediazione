import { callLLM } from "./llm.js";
import { calcolaConfronto, formatEuro, type InputConfronto } from "../../shared/costi-procedura.js";

export async function analisiMaanBatna(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  analisiPrecedenti: string
): Promise<string> {
  let costiContext = "";
  if (valoreLite && valoreLite > 0) {
    try {
      const input: InputConfronto = {
        valoreLite,
        tipoValore: "determinato",
        tipoMediazione: "obbligatoria",
        materiaImmobiliare: false,
      };
      const confronto = calcolaConfronto(input);
      costiContext = `

**DATI COSTI CALCOLATI (per parte):**
| Voce | Mediazione | Causa Civile |
|------|-----------|-------------|
| Spese organismo/C.U. | ${formatEuro(confronto.costiMediazione.indennitaOrganismo)} | ${formatEuro(confronto.costiCausaCivile.contributoUnificato + confronto.costiCausaCivile.marcaDaBollo)} |
| Compenso avvocato | ${formatEuro(confronto.costiMediazione.compensoAvvocato)} | ${formatEuro(confronto.costiCausaCivile.compensoAvvocato)} |
| Spese + CPA + IVA | ${formatEuro(confronto.costiMediazione.speseGenerali15 + confronto.costiMediazione.cpa4Avvocato + confronto.costiMediazione.iva22Avvocato)} | ${formatEuro(confronto.costiCausaCivile.speseGenerali15 + confronto.costiCausaCivile.cpa4Avvocato + confronto.costiCausaCivile.iva22Avvocato)} |
| Imposta registro | ${formatEuro(confronto.costiMediazione.impostaRegistro)} | ${formatEuro(confronto.costiCausaCivile.impostaRegistroSentenza)} |
| Stima CTU | - | ${formatEuro(confronto.costiCausaCivile.stimaCTU)} |
| **TOTALE per parte** | **${formatEuro(confronto.costiMediazione.totaleNettoPerParte)}** | **${formatEuro(confronto.costiCausaCivile.totalePerParte)}** |
| Risparmio mediazione | **${formatEuro(confronto.risparmioMediazione)} (${confronto.percentualeRisparmio}%)** | - |
| Durata stimata | ${confronto.durataMediaStimata.mediazione} | ${confronto.durataMediaStimata.causaCivile} |`;
    } catch (e) {
      // Se il calcolo fallisce, procediamo senza dati costi
    }
  }

  const systemPrompt = `Sei un esperto di negoziazione e mediazione civile italiana. Analizza la MAAN/BATNA per ciascuna parte.

REGOLE FONDAMENTALI PER LE TABELLE MARKDOWN:
- Ogni cella deve contenere testo breve su UNA SOLA RIGA (max 50 caratteri)
- Non usare mai newline o testo lungo dentro una cella
- La riga separatrice e' sempre del tipo |---|---|---|
- Se un'informazione e' assente scrivi "-"

Produci OBBLIGATORIAMENTE queste 9 sezioni nell'ordine indicato:

## 1. Alternative disponibili
Per ciascuna parte, elenco puntato delle opzioni se la mediazione fallisce.

## 2. Confronto costi
Usa i DATI COSTI CALCOLATI forniti. Tabella con colonne:
| Voce | Mediazione | Causa Civile |
|---|---|---|

## 3. Probabilita' di successo
Tabella con colonne:
| Alternativa | Parte | Probabilita' | Note |
|---|---|---|---|

## 4. BATNA Score
Tabella con colonne:
| Parte | Punteggio | Motivazione breve |
|---|---|---|

## 5. ZOPA
Indica il range numerico di possibile accordo in una riga.

## 6. Valore di riserva
Tabella con colonne:
| Parte | Valore minimo | Valore massimo |
|---|---|---|

## 7. Analisi costo-opportunita'
Testo breve (3-4 righe) sul confronto tempo/costi mediazione vs causa.

## 8. Rischi processuali
Tabella con ESATTAMENTE queste 4 colonne, celle brevi max 40 caratteri:
| Rischio | Parte esposta | Probabilita' | Impatto |
|---|---|---|---|
Inserisci almeno 4 righe con rischi specifici del caso.

## 9. Strategia d'apertura
Tabella con colonne:
| Parte | Proposta apertura | Leva negoziale |
|---|---|---|

${valoreLite ? `Valore della lite: EUR ${valoreLite.toLocaleString('it-IT')}` : "Valore della lite: indeterminabile"}`;

  const userPrompt = `Analizza MAAN/BATNA per il seguente caso.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}${costiContext}

Produci tutte e 9 le sezioni richieste. Celle delle tabelle brevi, max 50 caratteri.`;

  return callLLM(systemPrompt, userPrompt);
}
