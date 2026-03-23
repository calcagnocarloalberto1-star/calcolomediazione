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
| Spese generali + CPA + IVA | ${formatEuro(confronto.costiMediazione.speseGenerali15 + confronto.costiMediazione.cpa4Avvocato + confronto.costiMediazione.iva22Avvocato)} | ${formatEuro(confronto.costiCausaCivile.speseGenerali15 + confronto.costiCausaCivile.cpa4Avvocato + confronto.costiCausaCivile.iva22Avvocato)} |
| Imposta di registro | ${formatEuro(confronto.costiMediazione.impostaRegistro)} | ${formatEuro(confronto.costiCausaCivile.impostaRegistroSentenza)} |
| Stima CTU | - | ${formatEuro(confronto.costiCausaCivile.stimaCTU)} |
| **TOTALE per parte** | **${formatEuro(confronto.costiMediazione.totaleNettoPerParte)}** | **${formatEuro(confronto.costiCausaCivile.totalePerParte)}** |
| Risparmio mediazione | **${formatEuro(confronto.risparmioMediazione)}** (${confronto.percentualeRisparmio}%) | - |
| Durata stimata | ${confronto.durataMediaStimata.mediazione} | ${confronto.durataMediaStimata.causaCivile} |

Vantaggi fiscali mediazione: esenzione imposta di registro fino a €100.000, credito d'imposta fino a €600, esenzione bollo e imposte ipotecaria/catastale.`;
    } catch (e) {
      // Se il calcolo fallisce, procediamo senza dati costi
    }
  }

  const systemPrompt = `Sei un esperto di negoziazione e teoria dei giochi applicata alla mediazione civile italiana. Analizza la MAAN/BATNA per ciascuna parte producendo OBBLIGATORIAMENTE tutte le sezioni seguenti nell'ordine indicato:

1. **Alternative disponibili**: elenco delle opzioni se la mediazione fallisce
2. **Confronto costi dettagliato**: usa i DATI COSTI CALCOLATI forniti per mostrare il confronto economico reale tra mediazione e causa civile, includendo contributo unificato, compenso avvocato, imposta di registro, CTU, vantaggi fiscali mediazione
3. **Probabilità di successo**: stima realistica per ciascuna alternativa
4. **BATNA Score**: punteggio 1-10 della forza della posizione di ciascuna parte
5. **ZOPA** (Zona di Possibile Accordo): range in cui l'accordo è possibile
6. **Valore di riserva**: importo minimo/massimo accettabile per ciascuna parte
7. **Analisi costo-opportunità**: confronto tra tempo e costi della causa vs mediazione
8. **Analisi dei Rischi Processuali**: tabella con ALMENO 4 righe che elenca i rischi specifici per ciascuna parte (es. soccombenza, condanna alle spese art. 96 c.p.c., mancata partecipazione art. 8 D.Lgs. 28/2010, rischio CTU sfavorevole, durata del giudizio). La tabella DEVE avere le colonne: Rischio Processuale | Parte esposta | Probabilità | Impatto economico stimato | Note
9. **Strategia d'apertura consigliata**: per ciascuna parte, descrivi la strategia ottimale per il primo incontro di mediazione (proposta di apertura, ancoraggio, concessioni graduali, leve negoziali)

${valoreLite ? `Valore della lite dichiarato: €${valoreLite.toLocaleString('it-IT')}` : "Valore della lite: indeterminabile"}

Formatta l'output in Markdown con tabelle comparative. La sezione 8 e la sezione 9 sono OBBLIGATORIE e devono essere complete. Non troncare mai le tabelle.`;

  const userPrompt = `Analizza MAAN/BATNA per il seguente caso.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${p.ruolo})`).join("\n")}

**Analisi precedenti:**
${analisiPrecedenti}${costiContext}

Procedi con l'analisi MAAN/BATNA dettagliata, includendo un confronto economico completo mediazione vs causa civile basato sui dati costi calcolati.`;

  return callLLM(systemPrompt, userPrompt);
}
