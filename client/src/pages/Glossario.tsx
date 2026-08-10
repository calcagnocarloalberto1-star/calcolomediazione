import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SeoHead } from "@/components/SeoHead";

interface GlossaryEntry {
  term: string;
  definition: string;
  references?: string;
}

const glossaryEntries: GlossaryEntry[] = [
  {
    term: "Accordo di mediazione",
    definition: "L'intesa raggiunta dalle parti al termine del procedimento di mediazione, sottoscritta dalle parti stesse e dai loro avvocati. Se tutti gli avvocati attestano la conformità dell'accordo alle norme imperative e all'ordine pubblico, esso costituisce titolo esecutivo per l'espropriazione forzata, l'esecuzione per consegna e rilascio, l'esecuzione degli obblighi di fare e non fare e per l'iscrizione di ipoteca giudiziale.",
    references: "Art. 12 D.Lgs. 28/2010"
  },
  {
    term: "ADR (Alternative Dispute Resolution)",
    definition: "Acronimo inglese che indica i metodi alternativi di risoluzione delle controversie, ossia tutti quei procedimenti che consentono di comporre una lite senza ricorrere al giudizio ordinario. Comprendono la mediazione, la negoziazione assistita, l'arbitrato e la conciliazione.",
  },
  {
    term: "Amministratore di condominio in mediazione (art. 5-ter)",
    definition: "L'art. 5-ter del D.Lgs. 28/2010, introdotto dalla Riforma Cartabia (D.Lgs. 149/2022) e in vigore dal 30 giugno 2023, stabilisce che l'amministratore di condominio è legittimato ad attivare un procedimento di mediazione, ad aderirvi e a parteciparvi autonomamente, senza necessità di alcuna delibera assembleare preventiva. La delibera dell'assemblea condominiale è richiesta soltanto nella fase finale, per approvare il verbale contenente l'accordo di conciliazione o la proposta conciliativa del mediatore. L'assemblea delibera entro il termine fissato nell'accordo o nella proposta, con le maggioranze previste dall'art. 1136 c.c. In caso di mancata approvazione entro tale termine, la conciliazione si intende non conclusa. La norma ha abrogato i commi 2, 4, 5 e 6 del previgente art. 71-quater disp. att. c.c., che richiedevano una delibera assembleare preventiva anche per la semplice partecipazione.",
    references: "Art. 5-ter D.Lgs. 28/2010; Art. 71-quater disp. att. c.c. (come modificato da D.Lgs. 149/2022)"
  },
  {
    term: "Avvio del procedimento",
    definition: "L'atto con cui il procedimento di mediazione viene formalmente attivato, mediante il deposito della domanda presso un organismo di mediazione accreditato. Le spese di avvio variano in base al valore della lite: €40 (fino a €1.000), €75 (da €1.001 a €50.000), €110 (oltre €50.000 e indeterminato) — art. 28, co. 4, D.M. 150/2023.",
    references: "Art. 4 D.Lgs. 28/2010; D.M. 150/2023"
  },
  {
    term: "BATNA (Best Alternative to a Negotiated Agreement)",
    definition: "La migliore alternativa all'accordo negoziato. Indica la soluzione più favorevole che una parte può ottenere se la mediazione non dovesse avere successo. Conoscere la propria BATNA è fondamentale per valutare la convenienza di un'eventuale proposta di accordo. In italiano si usa anche l'acronimo MAAN (Migliore Alternativa All'Accordo Negoziato).",
  },
  {
    term: "Bias cognitivi",
    definition: "Distorsioni sistematiche nel processo decisionale che possono influenzare il comportamento delle parti in mediazione. Tra i più rilevanti: l'ancoraggio (ancorarsi alla prima cifra proposta), l'avversione alla perdita (percepire le concessioni come perdite), il framing (variazione delle decisioni in base alla presentazione del problema), l'overconfidence (sopravvalutazione delle proprie ragioni).",
  },
  {
    term: "Caucus",
    definition: "Sessione separata e riservata che il mediatore conduce con una sola parte. Permette di esplorare interessi e margini di flessibilità che non verrebbero rivelati in presenza dell'altra parte. Le informazioni raccolte in caucus sono confidenziali, salvo autorizzazione della parte a condividerle.",
  },
  {
    term: "Condizione di procedibilità",
    definition: "Requisito processuale che deve essere soddisfatto prima di poter presentare una domanda giudiziale. Nelle materie soggette a mediazione obbligatoria, il tentativo di mediazione costituisce condizione di procedibilità della domanda. L'improcedibilità deve essere eccepita dal convenuto o rilevata dal giudice non oltre la prima udienza.",
    references: "Art. 5 D.Lgs. 28/2010"
  },
  {
    term: "Contributo unificato",
    definition: "Tributo dovuto per l'iscrizione a ruolo di cause civili. L'importo varia in base al valore della controversia secondo gli scaglioni previsti dal D.P.R. 115/2002. Non è dovuto in mediazione, rappresentando uno dei risparmi del percorso mediativo rispetto al processo.",
    references: "Art. 13 D.P.R. 115/2002"
  },
  {
    term: "Credito d'imposta",
    definition: "Agevolazione fiscale prevista per le parti che ricorrono alla mediazione. Il credito d'imposta spetta sull'indennità di mediazione (fino a 600 euro) e sul compenso dell'avvocato nelle mediazioni obbligatorie o demandate (fino a 600 euro). È utilizzabile in compensazione tramite il modello F24.",
    references: "Art. 20 D.Lgs. 28/2010"
  },
  {
    term: "Correttivo Cartabia (D.Lgs. 216/2024)",
    definition: "Decreto legislativo 21 novembre 2024, n. 216, recante disposizioni integrative e correttive del D.Lgs. 149/2022 (Riforma Cartabia). In vigore dal 25 gennaio 2025, ha modificato l'art. 6 del D.Lgs. 28/2010 portando la durata ordinaria del procedimento di mediazione da tre a sei mesi. Regime delle proroghe: per la mediazione volontaria e per quella obbligatoria (condizione di procedibilità), le parti possono concordare per iscritto proroghe successive di tre mesi ciascuna, senza limite al numero (6+3+3+3... mesi). Per la mediazione demandata dal giudice, la proroga è ammessa una sola volta per tre mesi (massimo 9 mesi totali). È quindi errato affermare che una mediazione non possa durare oltre sei mesi: per la mediazione obbligatoria e volontaria non esiste un tetto massimo assoluto, purché le parti concordino ogni proroga per iscritto prima della scadenza.",
    references: "D.Lgs. 216/2024; Art. 6 D.Lgs. 28/2010"
  },
  {
    term: "CTU (Consulenza Tecnica d'Ufficio)",
    definition: "Perizia disposta dal giudice nel corso del processo civile, affidata a un esperto (consulente tecnico) iscritto nell'albo del tribunale. I costi della CTU sono anticipati dalla parte che ne fa richiesta e definitivamente posti a carico della parte soccombente. In mediazione la CTU non è prevista, con conseguente risparmio.",
  },
  {
    term: "D.Lgs. 28/2010",
    definition: "Decreto legislativo 4 marzo 2010, n. 28, che ha introdotto nell'ordinamento italiano la disciplina organica della mediazione finalizzata alla conciliazione delle controversie civili e commerciali. È stato significativamente modificato dalla Riforma Cartabia (D.Lgs. 149/2022) e dal Correttivo Cartabia (D.Lgs. 216/2024, in vigore dal 25 gennaio 2025), che ha portato la durata massima del procedimento a sei mesi.",
    references: "D.Lgs. 28/2010; D.Lgs. 149/2022; D.Lgs. 216/2024"
  },
  {
    term: "D.M. 150/2023",
    definition: "Decreto del Ministero della Giustizia del 24 ottobre 2023, che ha sostituito il D.M. 180/2010 nella regolamentazione degli organismi di mediazione, dei formatori e delle indennità. Contiene le tabelle aggiornate per il calcolo delle indennità di mediazione per scaglioni di valore della controversia.",
    references: "D.M. 150/2023"
  },
  {
    term: "Esenzione fiscale (Art. 17)",
    definition: "Agevolazione prevista dall'art. 17 del D.Lgs. 28/2010: tutti gli atti, documenti e provvedimenti del procedimento di mediazione sono esenti dall'imposta di bollo e da ogni spesa, tassa o diritto. In caso di accordo, il verbale è esente dall'imposta di registro fino al valore di 100.000 euro.",
    references: "Art. 17 D.Lgs. 28/2010"
  },
  {
    term: "Gratuito patrocinio",
    definition: "Istituto che consente ai soggetti con reddito inferiore a una determinata soglia di essere difesi a spese dello Stato. In mediazione, la parte ammessa al gratuito patrocinio è esonerata dal pagamento dell'indennità, che viene posta a carico dell'erario.",
    references: "D.P.R. 115/2002; D.Lgs. 28/2010"
  },
  {
    term: "Imposta di registro",
    definition: "Tributo dovuto per la registrazione di atti giuridici. Nella mediazione con accordo, l'imposta di registro è esente fino al valore di 100.000 euro (art. 17, comma 3, D.Lgs. 28/2010). Per la parte eccedente, l'imposta è del 3%. Nelle sentenze giudiziarie l'esenzione non si applica.",
    references: "Art. 17, co. 3, D.Lgs. 28/2010"
  },
  {
    term: "Imposte trasferimento immobiliare",
    definition: "Insieme delle imposte dovute in caso di trasferimento immobiliare: imposta di registro (2% per prima casa, 9% per seconda casa/altro, con minimo di €1.000), imposta ipotecaria (€50 fissa) e imposta catastale (€50 fissa). In mediazione, l'accordo avente ad oggetto un trasferimento immobiliare gode dell'esenzione dall'imposta di registro fino a €100.000 (art. 17 D.Lgs. 28/2010). L'autenticazione dell'accordo è effettuata da un notaio ai sensi dell'art. 11 D.Lgs. 28/2010.",
    references: "D.P.R. 131/1986; D.Lgs. 347/1990; Art. 17 D.Lgs. 28/2010"
  },
  {
    term: "Indennità di mediazione",
    definition: "Compenso dovuto all'organismo di mediazione da ciascuna parte per lo svolgimento del procedimento. L'importo è determinato in base al valore della controversia secondo le tabelle del D.M. 150/2023. Sono previste riduzioni per le mediazioni obbligatorie (-20%) e maggiorazioni differenziate in caso di accordo: +10% se l'accordo è raggiunto al primo incontro, +25% se raggiunto negli incontri successivi.",
    references: "D.M. 150/2023"
  },
  {
    term: "MAAN (Migliore Alternativa All'Accordo Negoziato)",
    definition: "Versione italiana della BATNA. Rappresenta la migliore opzione che una parte può perseguire se la mediazione fallisce. L'analisi delle MAAN di entrambe le parti è uno strumento fondamentale per il mediatore e per le parti stesse per valutare la convenienza dell'accordo.",
  },
  {
    term: "Mediatore",
    definition: "Soggetto terzo, imparziale e neutrale, privo di potere decisionale, che assiste le parti nella ricerca di un accordo amichevole. Deve essere iscritto nell'elenco dei mediatori di un organismo accreditato e possedere i requisiti di formazione previsti dalla legge (almeno 80 ore di formazione iniziale e aggiornamento biennale).",
    references: "Art. 1, lett. b), D.Lgs. 28/2010"
  },
  {
    term: "Mediazione civile e commerciale",
    definition: "Procedimento stragiudiziale di risoluzione delle controversie in cui un terzo imparziale (mediatore) assiste le parti nel trovare un accordo amichevole per la composizione della lite. La durata ordinaria è di sei mesi dal deposito della domanda (art. 6 D.Lgs. 28/2010, come modificato dal D.Lgs. 216/2024, in vigore dal 25 gennaio 2025). Per la mediazione volontaria e per quella obbligatoria (condizione di procedibilità), il termine è prorogabile con accordo scritto delle parti per periodi successivi di tre mesi ciascuno, senza limite al numero di proroghe (6+3+3+3... mesi). Per la mediazione demandata dal giudice, la proroga è possibile una sola volta per ulteriori tre mesi (massimo 9 mesi totali). Non è quindi corretto affermare che una mediazione non possa superare i sei mesi: il superamento è possibile — e anzi frequente nella pratica — tramite proroghe concordate per iscritto prima della scadenza del termine in corso.",
    references: "Art. 1, lett. a), D.Lgs. 28/2010; Art. 6 D.Lgs. 28/2010; D.Lgs. 216/2024"
  },
  {
    term: "Mediazione demandata",
    definition: "Mediazione disposta dal giudice nel corso del processo, quando lo ritiene opportuno per la natura della causa, lo stato dell'istruzione e il comportamento delle parti. Ha durata ordinaria di sei mesi. A differenza della mediazione obbligatoria e volontaria — dove le proroghe successive di tre mesi sono illimitate — per la mediazione demandata la proroga è possibile una sola volta, per ulteriori tre mesi, su accordo scritto delle parti chiesto prima della scadenza dei sei mesi. La durata massima assoluta della mediazione demandata è quindi di nove mesi (6 + 3). Il giudice fissa una successiva udienza dopo la scadenza del termine di durata della mediazione.",
    references: "Art. 5-quater D.Lgs. 28/2010; Art. 6 D.Lgs. 28/2010"
  },
  {
    term: "Mediazione obbligatoria",
    definition: "Mediazione prevista come condizione di procedibilità della domanda giudiziale in specifiche materie: condominio, diritti reali, divisione, successioni ereditarie, patti di famiglia, locazione, comodato, affitto di aziende, responsabilità medica, diffamazione, contratti assicurativi, bancari e finanziari, e altre materie introdotte dalla Riforma Cartabia. Per le controversie condominiali, l'amministratore può partecipare alla mediazione senza delibera assembleare preventiva (art. 5-ter D.Lgs. 28/2010).",
    references: "Art. 5, co. 1, D.Lgs. 28/2010; Art. 5-ter D.Lgs. 28/2010"
  },
  {
    term: "Mediazione volontaria",
    definition: "Mediazione attivata spontaneamente dalle parti, senza obbligo di legge né ordine del giudice. Le parti possono ricorrere alla mediazione volontaria per qualsiasi controversia civile e commerciale vertente su diritti disponibili.",
    references: "Art. 2 D.Lgs. 28/2010"
  },
  {
    term: "Negoziazione assistita",
    definition: "Procedura alternativa alla mediazione, disciplinata dal D.L. 132/2014 (conv. L. 162/2014), in cui le parti, assistite dai rispettivi avvocati, cercano di raggiungere un accordo senza l'intervento di un mediatore. È obbligatoria per le controversie in materia di risarcimento del danno da circolazione di veicoli e natanti.",
    references: "D.L. 132/2014, conv. L. 162/2014"
  },
  {
    term: "Organismo di mediazione",
    definition: "Ente pubblico o privato iscritto nel registro tenuto dal Ministero della Giustizia, presso il quale è possibile depositare la domanda di mediazione. Gli organismi devono rispettare i requisiti previsti dal D.M. 150/2023 in termini di organizzazione, trasparenza e formazione dei mediatori.",
    references: "Art. 16 D.Lgs. 28/2010; D.M. 150/2023"
  },
  {
    term: "Parametri forensi",
    definition: "Criteri per la determinazione dei compensi degli avvocati, stabiliti dal D.M. 55/2014 (aggiornato dal D.M. 147/2022). I compensi sono calcolati in base al valore della controversia e alle fasi dell'attività (studio, introduttiva, istruttoria/trattazione, decisionale per il giudizio; studio, negoziazione, accordo per lo stragiudiziale).",
    references: "D.M. 55/2014; D.M. 147/2022"
  },
  {
    term: "Primo incontro",
    definition: "Prima sessione del procedimento di mediazione. Con la Riforma Cartabia, il primo incontro ha acquisito una funzione non più meramente informativa ma sostanziale: il mediatore illustra il programma e invita le parti a esporre la propria posizione. Il primo incontro si svolge non prima di venti e non oltre quaranta giorni dal deposito della domanda, salvo diversa indicazione delle parti. La mancata partecipazione senza giustificato motivo può avere conseguenze processuali.",
    references: "Art. 8 D.Lgs. 28/2010"
  },
  {
    term: "Proposta del mediatore",
    definition: "Proposta formale di conciliazione che il mediatore può formulare alle parti. Se una parte rifiuta la proposta e in giudizio ottiene un risultato non più favorevole, il giudice può condannarla alle spese del procedimento successivo alla proposta, anche se risulta vincitrice della causa.",
    references: "Artt. 11 e 13 D.Lgs. 28/2010"
  },
  {
    term: "Riforma Cartabia",
    definition: "Insieme di riforme della giustizia civile introdotte dal D.Lgs. 149/2022, in attuazione della delega contenuta nella L. 206/2021. Ha significativamente modificato la disciplina della mediazione, ampliando le materie obbligatorie, rafforzando il primo incontro, introducendo la mediazione telematica e potenziando gli incentivi fiscali. Ha inoltre introdotto l'art. 5-ter, che consente all'amministratore di condominio di partecipare alla mediazione senza delibera assembleare preventiva. Il Correttivo Cartabia (D.Lgs. 216/2024, in vigore dal 25 gennaio 2025) ha poi portato la durata massima del procedimento a sei mesi.",
    references: "D.Lgs. 149/2022; L. 206/2021; D.Lgs. 216/2024"
  },
  {
    term: "Scaglioni di valore",
    definition: "Fasce di importo in cui è suddiviso il valore della controversia per il calcolo delle indennità di mediazione e dei compensi degli avvocati. Ogni scaglione corrisponde a un importo base di indennità, che viene poi modulato in base alle riduzioni e maggiorazioni applicabili.",
    references: "D.M. 150/2023, Tabella A"
  },
  {
    term: "Titolo esecutivo",
    definition: "Documento che consente di procedere all'esecuzione forzata. L'accordo di mediazione, sottoscritto dalle parti e dai loro avvocati che ne attestano la conformità, costituisce titolo esecutivo senza necessità di omologazione giudiziale (salvo per le ipoteche giudiziali, ove necessaria l'omologazione del tribunale).",
    references: "Art. 12 D.Lgs. 28/2010"
  },
  {
    term: "ZOPA (Zone of Possible Agreement)",
    definition: "La zona di possibile accordo, ossia l'intervallo tra il minimo che una parte è disposta ad accettare e il massimo che l'altra è disposta a offrire. Se la ZOPA è positiva (le due soglie si sovrappongono), un accordo è possibile. Se è negativa, le parti non hanno margini di intesa sul piano economico.",
  },
];

export default function Glossario() {
  const [search, setSearch] = useState("");

  const filtered = glossaryEntries.filter(
    (e) =>
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.definition.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, GlossaryEntry[]>>((acc, entry) => {
    const letter = entry.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(entry);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Glossario della Mediazione Civile — Termini Tecnici e Giuridici"
        description="Glossario completo dei termini tecnici della mediazione civile e commerciale: art. 5, ODM, MAAN, BATNA, caucus, verbale, proposta del mediatore, esenzione art. 17."
        canonical="https://calcolomediazione.it/glossario"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Glossario della Mediazione
          </h1>
        </div>

        <p className="text-sm opacity-70 mb-1">
          {glossaryEntries.length} termini essenziali della mediazione civile e commerciale italiana
        </p>
        {/* DATA-04 / PRIV-07: data dell'ultima verifica normativa, aggiornata
            manualmente ad ogni revisione periodica (v. processo PRIV-07). */}
        <p className="text-sm opacity-50 mb-6">Ultima verifica normativa: agosto 2026</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <Input
            type="text"
            placeholder="Cerca nel glossario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-2 border-foreground/30 focus:border-foreground"
            data-testid="glossary-search"
          />
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' })}
              className="w-8 h-8 text-xs font-bold border border-foreground/20 hover:border-foreground transition-colors flex items-center justify-center"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {letter}
            </button>
          ))}
        </div>

        {search && (
          <p className="text-xs opacity-60 mb-4">
            {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'} per &quot;{search}&quot;
          </p>
        )}

        <div className="space-y-6">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold border-[2px] border-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}
                >
                  {letter}
                </span>
                <div className="flex-1 h-[2px] bg-foreground/10" />
              </div>
              <div className="space-y-3">
                {grouped[letter].map((entry) => (
                  <div
                    key={entry.term}
                    className="bg-card border border-foreground/20 p-4"
                    data-testid={`glossary-entry-${entry.term.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {entry.term}
                    </h3>
                    <p className="text-xs leading-relaxed opacity-85">{entry.definition}</p>
                    {entry.references && (
                      <p className="text-xs mt-2 opacity-50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Rif.: {entry.references}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Nessun termine trovato per &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
