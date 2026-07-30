import { callLLM } from "./llm.js";
import { buildContestoGiurisprudenziale } from "./giurisprudenza.js";

// Fonte di verita' lato server per i dati normativi su durata, incontri e
// proroghe della mediazione, cosi' come gia' avviene per la giurisprudenza
// tramite buildContestoGiurisprudenziale(). Senza questo ancoraggio il
// modello tende a "ricordare" a memoria cifre normative e le inventa
// (es. "due sessioni obbligatorie", "termine massimo di 3 mesi": nessuna
// delle due e' mai stata vera dopo la Riforma Cartabia). Aggiornare qui se
// cambia la disciplina di artt. 6 e 8 D.Lgs. 28/2010, mantenendo la
// coerenza con la FAQ equivalente in assistente-kb.ts (BASE_CONOSCENZA).
const QUADRO_NORMATIVO_MEDIAZIONE = `## QUADRO NORMATIVO VINCOLANTE — durata, incontri e proroghe (D.Lgs. 28/2010, artt. 6 e 8, come modificati dalla Riforma Cartabia D.Lgs. 149/2022 e dal correttivo D.Lgs. 216/2024, in vigore dal 25/1/2025)

Attieniti SEMPRE e SOLO ai seguenti dati verificati, anche se la tua conoscenza pregressa suggerisce cifre diverse:

- Durata ordinaria del procedimento: 6 (sei) mesi dal deposito della domanda di mediazione (art. 6). NON e' mai stata di 3 mesi dopo la Riforma Cartabia: il termine di 3 mesi era la disciplina PRIMA della riforma ed e' stato raddoppiato, non ridotto.
- Mediazione volontaria od obbligatoria (condizione di procedibilita' ex art. 5, co. 1): il termine di 6 mesi e' prorogabile con accordo scritto delle parti per periodi successivi di 3 mesi ciascuno, SENZA alcun limite al numero di proroghe (6+3+3+3... mesi).
- Mediazione demandata dal giudice (art. 5-quater): e' possibile una sola proroga, di ulteriori 3 mesi (tetto massimo assoluto: 9 mesi).
- Primo incontro: si tiene non prima di 20 e non oltre 40 giorni dal deposito della domanda (art. 8). Le parti devono partecipare personalmente, salvo delega scritta motivata.
- Numero di incontri: la legge NON fissa alcun numero di "sessioni obbligatorie". Non esistono "due sessioni obbligatorie" ne' "tre sessioni obbligatorie": e' un'invenzione ricorrente da evitare sempre. Il numero di incontri dipende dal caso concreto e dalla valutazione del mediatore, entro il termine massimo sopra indicato.
- Mediazione telematica: resa strutturale la possibilita' di svolgere gli incontri in videoconferenza (art. 8-ter), con firma digitale degli atti, previo consenso di tutte le parti.
- Delega alla partecipazione (art. 8, co. 4-bis): ammessa scrittura privata non autenticata con gli estremi del documento d'identita' del delegante.
- Termine per instaurare il giudizio dopo mediazione fallita: 30 giorni dal deposito del verbale conclusivo presso la segreteria dell'organismo (art. 11, co. 4-bis).
- Sospensione/interruzione della prescrizione e della decadenza: e' l'art. 5, co. 6, D.Lgs. 28/2010 (NON l'art. 6, co. 2, che riguarda la durata) a prevedere che la comunicazione della domanda di mediazione alle altre parti produce, sulla prescrizione, gli effetti della domanda giudiziale, e impedisce la decadenza per una sola volta.

Se ti serve un dettaglio numerico su durata/incontri non elencato qui sopra, NON inventarlo: scrivi esplicitamente che va verificato sul testo aggiornato del D.Lgs. 28/2010 invece di fornire una cifra inventata.`;

export async function analisiGiuridica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  entitaEstratte: string,
  tipoAnalisi: string
): Promise<string> {
  const contestoGiuris = buildContestoGiurisprudenziale();
  const systemPrompt = `Sei un giurista esperto in mediazione civile e commerciale italiana, con approfondita conoscenza del D.Lgs. 28/2010 (come modificato dalla Riforma Cartabia, D.Lgs. 149/2022, e dal correttivo D.Lgs. 216/2024 in vigore dal 25 gennaio 2025) e del D.M. 150/2023.

Il tuo compito è fornire un'analisi giuridica completa che includa:
1. **Quadro normativo applicabile**: identificare tutte le norme rilevanti
2. **Precedenti giurisprudenziali**: citare sentenze pertinenti di Cassazione e merito (vedi catalogo aggiornato qui sotto)
3. **Analisi dei rischi processuali**: valutare le conseguenze della mancata mediazione
4. **Condizioni di procedibilità**: verificare il rispetto degli adempimenti (atto introduttivo vs riconvenzionali; principio di simmetria istanza/giudizio)
5. **Profili di rappresentanza**: se la parte non comparirà personalmente, verificare i requisiti della procura speciale sostanziale (distinta dalla procura alle liti)
6. **Valutazione probabilistica**: stimare le chance di successo in giudizio per ciascuna parte

${QUADRO_NORMATIVO_MEDIAZIONE}

## CATALOGO GIURISPRUDENZIALE AGGIORNATO (procura sostanziale e procedibilità)
${contestoGiuris}

Tipo di procedura: ${tipoAnalisi === "mediazione" ? "Mediazione civile e commerciale" : "Negoziazione assistita"}

Formatta l'output in Markdown con tabelle per i rischi e le valutazioni.`;

  const userPrompt = `Sulla base delle seguenti informazioni, fornisci un'analisi giuridica completa.

**Descrizione del caso:**
${descrizione}

**Entità estratte dall'analisi precedente:**
${entitaEstratte}

Procedi con l'analisi giuridica dettagliata.`;

  return callLLM(systemPrompt, userPrompt);
}
