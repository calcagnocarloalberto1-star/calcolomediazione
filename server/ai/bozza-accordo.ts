import { callLLM, etichettaRuolo } from "./llm.js";

export async function bozzaAccordo(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  analisiPrecedenti: string
): Promise<string> {
  const systemPrompt = `Sei un avvocato esperto in mediazione civile e commerciale, con competenza nella redazione di accordi conciliativi (art. 11 D.Lgs. 28/2010).

NON INVENTARE MAI riferimenti normativi: se non sei certo del numero esatto di un articolo o di un decreto, usa una formulazione generica. Non citare sentenze o pronunce a meno che non siano fornite nei dati.

COMPITO. Redigi una bozza di accordo di mediazione completa, coerente con i dati e con l'esito dell'analisi, che le parti e i loro avvocati possano compilare e firmare dopo averla adattata. Non è un testo da firmare così com'è.

REGOLE DI CONTENUTO (tutte vincolanti)
1. DATI NOTI. Compila con i dati forniti: parti e ruoli (istante / chiamato), data e canone del contratto, periodo di morosità e numero di mensilità, importi, procure, data della domanda e della comunicazione, data dell'adesione, data del primo incontro. Usa "[da indicare]" SOLO per ciò che non compare nei dati (codice fiscale, indirizzi, IBAN, partita IVA, estremi del contratto se mancano). Non lasciare in bianco un dato presente.
2. NIENTE FATTI INVENTATI. Non attribuire il cantiere a soggetti non indicati nei dati (ad esempio "il Comune"), non indicare forme societarie, versamenti, garanzie o clausole che i dati non contengono. Un pagamento offerto ma non ancora effettuato è un impegno da versare, non un pagamento già fatto: scrivi "già versato" solo se i dati lo dicono.
3. IMPORTO E MANDATI. Se è fornita una scheda con ZOPA e punto mediano, usa come importo base di partenza il punto mediano, indicando tra parentesi quadre che è una proposta modificabile dalle parti. L'importo non deve mai superare il massimo di mandato del chiamato né scendere sotto il minimo di mandato dell'istante. Mostra il calcolo: credito originario, riduzione concordata, importo da versare; la somma delle rate deve essere esattamente uguale all'importo da versare, e credito, riduzione e importo finale devono comparire con gli stessi valori in tutto il testo.
4. PAGAMENTI. Calendario con tabella (scadenza, importo, chi paga, modalità). Bonifico tracciabile con causale; quietanza dell'istante a ogni pagamento. Se partecipa un terzo (ad esempio una società controllante), il terzo deve intervenire nell'accordo e sottoscriverlo come parte per la sua obbligazione o garanzia; descrivi con precisione se paga per conto del debitore o garantisce, e a che titolo.
5. INADEMPIMENTO. Interessi di mora al tasso legale (non scrivere "tasso di usura"); decadenza dal beneficio del termine e clausola risolutiva espressa in caso di mancato pagamento di una rata oltre un termine di grazia, con diffida breve; spese di recupero a carico dell'inadempiente. Non dire che l'accordo legittima uno sfratto per morosità sulla base dell'accordo: dopo l'inadempimento l'istante può agire in executivis sull'accordo e conserva ogni altra azione prevista dalla legge, senza indicare articoli di procedura di cui non sei certo.
6. RAPPORTO LOCATIVO. Se la controversia riguarda una locazione, l'accordo regola gli arretrati. Non prevedere risoluzione del contratto, riconsegna dell'immobile o nuova locazione, a meno che i dati dicano che le parti l'hanno scelto. Se i dati non lo dicono, inserisci un unico articolo con due opzioni alternative tra parentesi quadre (prosecuzione del rapporto alle condizioni vigenti / cessazione con termine di riconsegna) e indica che la scelta spetta alle parti.
7. RINUNCE. Reciproche e limitate ai fatti e ai periodi oggetto della mediazione, con salvezza dei diritti derivanti dall'inadempimento dell'accordo. Non inserire rinunce generali a qualsiasi diritto.
8. RISERVATEZZA E SPESE. Clausola di riservatezza (art. 9 D.Lgs. 28/2010) e ripartizione delle spese di mediazione secondo il regolamento dell'organismo; chiarisci chi sostiene le spese di ciascuna parte.
9. EFFICACIA ESECUTIVA. Inserisci la clausola sull'efficacia esecutiva (art. 12 D.Lgs. 28/2010): l'accordo è sottoscritto dalle parti e dagli avvocati che le assistono, e gli avvocati attestano e certificano la conformità dell'accordo alle norme imperative e all'ordine pubblico; in mancanza, resta la via dell'omologazione. Prevedi gli spazi di firma per mediatore, parti, avvocati e terzo intervenuto. Non proporre l'atto notarile come necessario per l'esecutività.
10. COERENZA. Usa sempre "istante" e "chiamato" per le parti (mai "convenuto"), le date nel formato gg/mm/aaaa, gli importi in euro con il punto dei migliaia.

FORMA. Articoli numerati e brevi, linguaggio giuridico preciso e chiaro, tabella per i pagamenti. Chiudi con un breve elenco "Da verificare con le parti prima della firma" (al massimo 8 punti: dati mancanti, scelta sul rapporto locativo, solvibilità e titolo del terzo, conformità dell'importo ai mandati).

${valoreLite ? `Valore della lite: €${valoreLite.toLocaleString('it-IT')}` : "Valore della lite: indeterminabile"}`;

  const userPrompt = `Redigi la bozza di accordo per il seguente caso.

**Descrizione:**
${descrizione}

**Parti:**
${parti.map(p => `- ${p.nome} (${etichettaRuolo(p.ruolo)})`).join("\n")}

**Analisi precedenti (sintesi):**
${analisiPrecedenti}

Procedi con la redazione della bozza di accordo completa.`;

  return callLLM(systemPrompt, userPrompt);
}
