// Database giurisprudenziale sulla mediazione civile e commerciale
// Dal 2010 (D.Lgs. 28/2010) ad oggi

export interface Sentenza {
  id: number;
  organo: string; // "Corte Costituzionale" | "Cassazione SS.UU." | "Cassazione" | "Tribunale" | "Corte d'Appello"
  tipoOrgano: "corte_costituzionale" | "cassazione_su" | "cassazione" | "corte_appello" | "tribunale";
  sezione?: string;
  data: string; // YYYY-MM-DD
  numero: string;
  anno: number;
  titolo: string;
  massima: string;
  principioDiDiritto?: string;
  temiChiave: string[];
  categoria: string;
  riferimentiNormativi: string[];
  nota?: string;
  fonteUrl?: string;
}

export const CATEGORIE = [
  "Condizione di procedibilità",
  "Mediazione obbligatoria",
  "Mediazione delegata",
  "Mediazione telematica e competenza",
  "Rappresentanza e procura",
  "Sanzioni e mancata partecipazione",
  "Primo incontro ed effettività",
  "Decreto ingiuntivo e opposizione",
  "Gratuito patrocinio",
  "Accordo e titolo esecutivo",
  "Durata e termini",
  "Questioni costituzionali",
  "Spese e indennità",
  "Mediatore e organismo",
  "Riforma Cartabia e correttivo",
] as const;

export const TEMI = [
  "procedibilità",
  "obbligatorietà",
  "mediazione delegata",
  "mediazione telematica",
  "competenza territoriale",
  "procura speciale",
  "rappresentanza",
  "comparizione personale",
  "primo incontro",
  "effettività",
  "sanzione pecuniaria",
  "mancata partecipazione",
  "argomenti di prova",
  "decreto ingiuntivo",
  "opposizione",
  "onere mediazione",
  "gratuito patrocinio",
  "patrocinio spese Stato",
  "accordo",
  "titolo esecutivo",
  "omologa",
  "durata",
  "termini decadenza",
  "eccesso di delega",
  "costituzionalità",
  "spese mediazione",
  "indennità",
  "credito d'imposta",
  "riforma Cartabia",
  "correttivo D.Lgs. 216/2024",
  "domanda riconvenzionale",
  "buona fede",
  "riservatezza",
  "mediatore",
  "organismo di mediazione",
  "improcedibilità",
] as const;

export const ORGANI_GIUDIZIARI = [
  { value: "corte_costituzionale", label: "Corte Costituzionale" },
  { value: "cassazione_su", label: "Cassazione Sezioni Unite" },
  { value: "cassazione", label: "Cassazione" },
  { value: "corte_appello", label: "Corte d'Appello" },
  { value: "tribunale", label: "Tribunale" },
] as const;

export const sentenze: Sentenza[] = [
  // =============================================
  // CORTE COSTITUZIONALE
  // =============================================
  {
    id: 1,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    data: "2012-12-06",
    numero: "272",
    anno: 2012,
    titolo: "Illegittimità costituzionale della mediazione obbligatoria per eccesso di delega",
    massima: "È costituzionalmente illegittimo l'art. 5, comma 1, del D.Lgs. 4 marzo 2010, n. 28, nella parte in cui prevede il carattere obbligatorio della mediazione, per violazione degli artt. 76 e 77 della Costituzione, per eccesso di delega legislativa. La legge delega (art. 60, L. 69/2009) non conteneva alcuna esplicita o implicita opzione a favore del carattere obbligatorio dell'istituto della mediazione, né il diritto dell'Unione europea (Direttiva 2008/52/CE) impone o consiglia l'adozione del modello obbligatorio.",
    principioDiDiritto: "Il D.Lgs. n. 28/2010 è incostituzionale nella parte in cui ha previsto il carattere obbligatorio della mediazione come condizione di procedibilità, per eccesso di delega rispetto alla L. 69/2009.",
    temiChiave: ["eccesso di delega", "obbligatorietà", "costituzionalità", "procedibilità"],
    categoria: "Questioni costituzionali",
    riferimentiNormativi: ["Art. 76 Cost.", "Art. 77 Cost.", "Art. 5, co. 1, D.Lgs. 28/2010", "Art. 60, L. 69/2009", "Direttiva 2008/52/CE"],
    nota: "Sentenza storica. La mediazione obbligatoria fu poi reintrodotta dal D.L. 69/2013 (Decreto del Fare), convertito con L. 98/2013, con adeguata base legislativa.",
    fonteUrl: "https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2012&numero=272",
  },
  {
    id: 2,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    data: "2019-04-18",
    numero: "97",
    anno: 2019,
    titolo: "Legittimità costituzionale della mediazione obbligatoria reintrodotta dal D.L. 69/2013",
    massima: "La mediazione obbligatoria, quale condizione di procedibilità delle domande giudiziali in determinate materie, è conforme alla Costituzione. L'istituto ha finalità deflattive del contenzioso e non impedisce l'accesso alla tutela giurisdizionale, ma lo subordina al previo esperimento di un tentativo di conciliazione. La mediazione e la negoziazione assistita, pur avendo entrambe finalità deflattive, sono istituti strutturalmente diversi: nella mediazione il ruolo centrale è svolto dal mediatore, terzo e imparziale, mentre nella negoziazione il ruolo è degli avvocati delle parti.",
    principioDiDiritto: "La previsione della mediazione obbligatoria come condizione di procedibilità (art. 5, co. 1-bis, D.Lgs. 28/2010, come reintrodotto dal D.L. 69/2013) è conforme agli artt. 3, 24, 76, 77 e 111 della Costituzione.",
    temiChiave: ["costituzionalità", "obbligatorietà", "procedibilità", "primo incontro"],
    categoria: "Questioni costituzionali",
    riferimentiNormativi: ["Art. 3 Cost.", "Art. 24 Cost.", "Art. 77 Cost.", "Art. 5, co. 1-bis, D.Lgs. 28/2010", "D.L. 69/2013"],
    nota: "La Corte distingue nettamente mediazione e negoziazione assistita per la diversa struttura e il diverso ruolo del terzo imparziale.",
    fonteUrl: "https://www.cortecostituzionale.it/scheda-pronuncia/2019/97",
  },
  {
    id: 3,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    data: "2022-01-20",
    numero: "10",
    anno: 2022,
    titolo: "Patrocinio a spese dello Stato: estensione alla mediazione obbligatoria conclusa con accordo",
    massima: "Sono costituzionalmente illegittimi gli artt. 74, comma 2, e 75, comma 1, del D.P.R. 115/2002, nella parte in cui non prevedono che il patrocinio a spese dello Stato sia assicurato anche in relazione all'attività difensiva svolta nell'ambito del procedimento di mediazione obbligatoria, quando la mediazione si è conclusa con successo (accordo). È irragionevole consentire il patrocinio a spese dello Stato in caso di esito infruttuoso della mediazione e negarlo quando la mediazione si è conclusa positivamente.",
    principioDiDiritto: "Il patrocinio a spese dello Stato deve essere assicurato anche per l'attività defensiva svolta nella mediazione obbligatoria conclusa con accordo.",
    temiChiave: ["gratuito patrocinio", "patrocinio spese Stato", "accordo", "costituzionalità"],
    categoria: "Gratuito patrocinio",
    riferimentiNormativi: ["Art. 3 Cost.", "Art. 24, co. 3, Cost.", "Art. 74, co. 2, D.P.R. 115/2002", "Art. 75, co. 1, D.P.R. 115/2002"],
    nota: "Sentenza di grande rilevanza pratica: afferma che escludere il gratuito patrocinio nella mediazione positiva sarebbe un disincentivo alla cultura della conciliazione.",
    fonteUrl: "https://www.cortecostituzionale.it/scheda-pronuncia/2022/10",
  },
  {
    id: 4,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    data: "2018-04-19",
    numero: "77",
    anno: 2018,
    titolo: "La giurisdizione come risorsa non illimitata",
    massima: "La giurisdizione costituisce una 'risorsa' non illimitata, che lo Stato deve organizzare in modo efficiente. La previsione di condizioni di procedibilità, quale la mediazione obbligatoria, rientra nella discrezionalità del legislatore nell'organizzare l'accesso alla giustizia, purché non ne risulti precluso l'esercizio del diritto di difesa.",
    temiChiave: ["costituzionalità", "procedibilità", "obbligatorietà"],
    categoria: "Questioni costituzionali",
    riferimentiNormativi: ["Art. 24 Cost.", "Art. 111 Cost."],
    nota: "Pronuncia richiamata dalle Sezioni Unite nella sentenza 3452/2024 per fondare la ratio deflattiva della mediazione.",
  },

  // =============================================
  // CASSAZIONE SEZIONI UNITE
  // =============================================
  {
    id: 10,
    organo: "Cassazione Sezioni Unite",
    tipoOrgano: "cassazione_su",
    sezione: "Sezioni Unite Civili",
    data: "2020-09-18",
    numero: "19596",
    anno: 2020,
    titolo: "Decreto ingiuntivo: l'onere della mediazione grava sul creditore opposto",
    massima: "Nelle controversie soggette a mediazione obbligatoria ex art. 5, comma 1-bis, D.Lgs. 28/2010, i cui giudizi vengano introdotti con un ricorso per decreto ingiuntivo, una volta instaurato il giudizio di opposizione, l'onere di avviare il procedimento di mediazione grava sulla parte opposta (creditore), quale attore in senso sostanziale. Se la mediazione non viene esperita, l'improcedibilità travolge anche il decreto ingiuntivo.",
    principioDiDiritto: "Nelle controversie soggette a mediazione obbligatoria i cui giudizi vengano introdotti con un ricorso per decreto ingiuntivo, l'onere di promuovere la procedura di mediazione è a carico della parte opposta; ne consegue che, ove essa non adempia, la domanda di ingiunzione dovrà essere dichiarata improcedibile e il decreto ingiuntivo revocato.",
    temiChiave: ["decreto ingiuntivo", "opposizione", "onere mediazione", "improcedibilità", "procedibilità"],
    categoria: "Decreto ingiuntivo e opposizione",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 633 c.p.c.", "Art. 645 c.p.c."],
    nota: "Le Sezioni Unite risolvono il contrasto con Cass. 24629/2015 che aveva posto l'onere sull'opponente. Ora è il creditore opposto (attore sostanziale) a dover attivare la mediazione.",
    fonteUrl: "https://www.cortedicassazione.it/resources/cms/documents/19596_09_2020_civ_oscuramento_noindex.pdf",
  },
  {
    id: 11,
    organo: "Cassazione Sezioni Unite",
    tipoOrgano: "cassazione_su",
    sezione: "Sezioni Unite Civili",
    data: "2024-02-07",
    numero: "3452",
    anno: 2024,
    titolo: "La domanda riconvenzionale non è soggetta alla condizione di procedibilità della mediazione",
    massima: "La condizione di procedibilità prevista dall'art. 5 D.Lgs. n. 28/2010 sussiste per il solo atto introduttivo del giudizio e non per le domande riconvenzionali, fermo restando che al mediatore compete di valutare tutte le istanze e gli interessi delle parti ed al giudice di esperire il tentativo di conciliazione per l'intero corso del processo. La mediazione obbligatoria ha la sua ratio nelle finalità di favorire la rapida soluzione delle liti e l'utilizzo delle risorse giurisdizionali solo ove effettivamente necessario: l'istituto non può essere utilizzato in modo disfunzionale.",
    principioDiDiritto: "La condizione di procedibilità prevista dall'art. 5 D.Lgs. n. 28 del 2010 sussiste per il solo atto introduttivo del giudizio e non per le domande riconvenzionali, fermo restando che al mediatore compete di valutare tutte le istanze e gli interessi delle parti ed al giudice di esperire il tentativo di conciliazione, per l'intero corso del processo e laddove possibile.",
    temiChiave: ["domanda riconvenzionale", "procedibilità", "obbligatorietà"],
    categoria: "Condizione di procedibilità",
    riferimentiNormativi: ["Art. 5, D.Lgs. 28/2010", "Art. 363-bis c.p.c."],
    nota: "Pronuncia su rinvio pregiudiziale ex art. 363-bis c.p.c. Le Sezioni Unite valorizzano il ruolo del mediatore e l'importanza della mediazione nella composizione degli interessi contrapposti.",
    fonteUrl: "https://www.cortedicassazione.it/resources/cms/documents/3452_02_2024_civ_oscuramento_noindex.pdf",
  },

  // =============================================
  // CASSAZIONE SEZIONI SEMPLICI
  // =============================================
  {
    id: 20,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2015-12-03",
    numero: "24629",
    anno: 2015,
    titolo: "Decreto ingiuntivo: l'onere della mediazione grava sull'opponente (poi superata da SS.UU. 19596/2020)",
    massima: "Nel giudizio di opposizione a decreto ingiuntivo, l'onere di esperire il tentativo di mediazione grava sulla parte opponente, che ha l'interesse ad agire e il potere di iniziare il processo. Il mancato avvio della mediazione da parte dell'opponente determina il consolidamento degli effetti del decreto ingiuntivo.",
    principioDiDiritto: "Nel giudizio di opposizione a decreto ingiuntivo relativo a controversia soggetta a mediazione obbligatoria, è l'opponente ad avere l'onere di avviare il procedimento di mediazione.",
    temiChiave: ["decreto ingiuntivo", "opposizione", "onere mediazione", "improcedibilità"],
    categoria: "Decreto ingiuntivo e opposizione",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 645 c.p.c.", "Art. 653 c.p.c."],
    nota: "ATTENZIONE: principio SUPERATO da Cass. SS.UU. n. 19596/2020, che ha posto l'onere sul creditore opposto.",
  },
  {
    id: 21,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2019-03-27",
    numero: "8473",
    anno: 2019,
    titolo: "Procura speciale sostanziale per la rappresentanza in mediazione: non serve il notaio",
    massima: "La parte che non intende comparire personalmente al procedimento di mediazione può farsi sostituire da un terzo, anche dal proprio difensore, purché munito di procura speciale sostanziale avente ad oggetto la partecipazione alla mediazione e il potere di disporre dei diritti sostanziali. Non è necessaria la procura notarile: è sufficiente una procura speciale in forma scritta, purché non sia la mera procura alle liti. La necessità della comparizione personale delle parti non implica che si tratti di attività non delegabile.",
    principioDiDiritto: "Il potere di sostituire a sé stesso qualcun altro per la partecipazione alla mediazione può essere conferito con una procura speciale sostanziale. La procura alle liti non è sufficiente; non è neppure necessaria la procura notarile, salvo che l'accordo abbia ad oggetto diritti per cui la forma notarile sia richiesta ad substantiam.",
    temiChiave: ["procura speciale", "rappresentanza", "comparizione personale", "primo incontro"],
    categoria: "Rappresentanza e procura",
    riferimentiNormativi: ["Art. 8, co. 1, D.Lgs. 28/2010", "Art. 185 c.p.c.", "Art. 83 c.p.c.", "Art. 1350 c.c."],
    nota: "Sentenza fondamentale sulla forma della procura in mediazione. Confermata da pronunce successive.",
    fonteUrl: "https://www.so.camcom.it/files/allegati/Cassazione%20Civile%20Sez.%20III,%20sentenza%20n.%208473_2019%20.pdf",
  },
  {
    id: 22,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2021-12-14",
    numero: "40035",
    anno: 2021,
    titolo: "Mediazione delegata dal giudice: il termine è ordinatorio, conta l'effettivo esperimento",
    massima: "Nel caso di mediazione demandata dal giudice (art. 5, commi 2 e 2-bis, D.Lgs. 28/2010), ciò che rileva è l'utile esperimento del tentativo di mediazione entro l'udienza di rinvio fissata dal giudice, non il rispetto del termine di quindici giorni per la presentazione della domanda. Il termine per l'avvio della mediazione delegata ha natura ordinatoria.",
    temiChiave: ["mediazione delegata", "durata", "effettività"],
    categoria: "Mediazione delegata",
    riferimentiNormativi: ["Art. 5, co. 2, D.Lgs. 28/2010", "Art. 5, co. 2-bis, D.Lgs. 28/2010"],
  },
  {
    id: 23,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2020-08-31",
    numero: "18123",
    anno: 2020,
    titolo: "Patrocinio a spese dello Stato e mediazione: liquidazione compenso",
    massima: "Non è liquidabile il compenso al difensore per la fase della mediazione obbligatoria quando alla mediazione non è seguita la proposizione della lite. L'attività difensiva svolta nella mediazione si inserisce nell'ambito del processo e non può essere considerata autonomamente ai fini del patrocinio a spese dello Stato.",
    temiChiave: ["gratuito patrocinio", "patrocinio spese Stato", "spese mediazione"],
    categoria: "Gratuito patrocinio",
    riferimentiNormativi: ["Art. 74, D.P.R. 115/2002", "Art. 75, D.P.R. 115/2002"],
    nota: "Principio poi superato dalla Corte Costituzionale con la sentenza n. 10/2022 che ha dichiarato l'illegittimità di questa interpretazione.",
  },
  {
    id: 24,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2024-07-05",
    numero: "18441",
    anno: 2024,
    titolo: "Ribadita la validità della procura speciale sostanziale in mediazione (conferma Cass. 8473/2019)",
    massima: "Viene confermato il principio della sentenza n. 8473/2019: la necessità della comparizione personale delle parti prevista dal D.Lgs. n. 28/2010 non implica che si tratti di attività non delegabile. La parte può farsi rappresentare dal difensore munito di apposita procura sostanziale, anche notarile, ai fini della condizione di procedibilità.",
    temiChiave: ["procura speciale", "rappresentanza", "comparizione personale", "procedibilità"],
    categoria: "Rappresentanza e procura",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010"],
    nota: "Conferma che l'avvocato con procura sostanziale notarile soddisfa la condizione di procedibilità.",
  },
  {
    id: 25,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2020-01-10",
    numero: "328",
    anno: 2020,
    titolo: "La mediazione è condizione di procedibilità con finalità deflattiva",
    massima: "La mediazione obbligatoria è una condizione di procedibilità della domanda giudiziale con specifiche finalità deflattive. Il suo mancato esperimento non determina l'inammissibilità della domanda ma la sua improcedibilità, con possibilità di sanatoria entro il termine concesso dal giudice.",
    temiChiave: ["procedibilità", "improcedibilità", "obbligatorietà"],
    categoria: "Condizione di procedibilità",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 5, co. 2, D.Lgs. 28/2010"],
  },
  {
    id: 26,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. VI Civile",
    data: "2015-11-27",
    numero: "24260",
    anno: 2015,
    titolo: "Il difetto della condizione di procedibilità è rilevabile d'ufficio",
    massima: "Il mancato esperimento della mediazione obbligatoria quale condizione di procedibilità della domanda giudiziale è rilevabile d'ufficio dal giudice, non oltre la prima udienza. Il giudice che rileva il difetto deve assegnare alle parti un termine per avviare il procedimento di mediazione.",
    temiChiave: ["procedibilità", "improcedibilità", "primo incontro"],
    categoria: "Condizione di procedibilità",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010"],
  },

  // =============================================
  // CORTI D'APPELLO
  // =============================================
  {
    id: 40,
    organo: "Corte d'Appello di Milano",
    tipoOrgano: "corte_appello",
    data: "2024-01-15",
    numero: "145",
    anno: 2024,
    titolo: "Partecipazione dell'avvocato con procura sostanziale: sufficiente per la procedibilità",
    massima: "La partecipazione dell'avvocato con procura sostanziale della parte, anche in mancanza di autentica di notaio, è sufficiente a far ritenere integrato il requisito della partecipazione personale delle parti al procedimento di mediazione richiesto dall'art. 8, comma 4, del D.Lgs. n. 28/2010, nel testo come modificato dalla Riforma Cartabia.",
    temiChiave: ["procura speciale", "rappresentanza", "comparizione personale", "riforma Cartabia"],
    categoria: "Rappresentanza e procura",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010"],
    nota: "Applicazione dei principi di Cass. 8473/2019 nel nuovo quadro della Riforma Cartabia.",
  },
  {
    id: 41,
    organo: "Corte d'Appello di Milano",
    tipoOrgano: "corte_appello",
    sezione: "Sez. II",
    data: "2016-03-22",
    numero: "1087",
    anno: 2016,
    titolo: "La mediazione delegata è applicabile a tutte le controversie civili",
    massima: "La mediazione demandata dal giudice (art. 5, comma 2, D.Lgs. 28/2010) è applicabile a tutte le controversie civili e non solo a quelle oggetto di mediazione obbligatoria, rientrando nei poteri discrezionali del giudice la valutazione sulla natura della causa, lo stato dell'istruzione e il comportamento delle parti.",
    temiChiave: ["mediazione delegata", "obbligatorietà"],
    categoria: "Mediazione delegata",
    riferimentiNormativi: ["Art. 5, co. 2, D.Lgs. 28/2010"],
  },

  // =============================================
  // TRIBUNALI
  // =============================================
  {
    id: 50,
    organo: "Tribunale di Firenze",
    tipoOrgano: "tribunale",
    data: "2014-03-19",
    numero: "774",
    anno: 2014,
    titolo: "Il primo incontro informativo non soddisfa la condizione di procedibilità",
    massima: "Non è sufficiente la comparizione delle parti al primo incontro meramente informativo per soddisfare la condizione di procedibilità. Le parti devono partecipare effettivamente al procedimento di mediazione, andando oltre la mera fase informativa. La semplice dichiarazione di non voler proseguire, senza un effettivo tentativo di mediazione, non integra la condizione di procedibilità.",
    temiChiave: ["primo incontro", "effettività", "procedibilità"],
    categoria: "Primo incontro ed effettività",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 8, D.Lgs. 28/2010"],
    nota: "Una delle prime pronunce sull'effettività della mediazione. Il tema è stato poi chiarito dal correttivo D.Lgs. 216/2024.",
  },
  {
    id: 51,
    organo: "Tribunale di Vasto",
    tipoOrgano: "tribunale",
    data: "2016-04-23",
    numero: "ord.",
    anno: 2016,
    titolo: "Sanzioni per la mancata partecipazione: anche il rifiuto ingiustificato al primo incontro",
    massima: "Le conseguenze sanzionatorie di cui all'art. 8, comma 4-bis, D.Lgs. 28/2010 non scattano soltanto nel caso di assenza ingiustificata della parte al primo incontro di mediazione, ma operano anche nel caso in cui la parte presente al primo incontro rifiuti senza giustificato motivo di procedere nella fase di mediazione effettiva. Il rifiuto deve considerarsi non giustificato sia in mancanza di qualsiasi dichiarazione sulle ragioni, sia quando le motivazioni addotte siano inconsistenti.",
    temiChiave: ["sanzione pecuniaria", "mancata partecipazione", "primo incontro", "effettività"],
    categoria: "Sanzioni e mancata partecipazione",
    riferimentiNormativi: ["Art. 8, co. 4-bis, D.Lgs. 28/2010", "Art. 116, co. 2, c.p.c."],
    nota: "Il Tribunale estende le sanzioni anche al rifiuto di proseguire oltre il primo incontro informativo.",
  },
  {
    id: 52,
    organo: "Tribunale di Roma",
    tipoOrgano: "tribunale",
    sezione: "Sez. XIII",
    data: "2014-02-25",
    numero: "3701",
    anno: 2014,
    titolo: "Mediazione effettiva: necessaria discussione nel merito, non solo incontro informativo",
    massima: "Il tentativo di mediazione non può ritenersi utilmente esperito quando le parti si siano limitate a partecipare al primo incontro informativo senza entrare nel merito della controversia. È necessario che le parti, con l'assistenza del mediatore, affrontino effettivamente la questione controversa.",
    temiChiave: ["primo incontro", "effettività", "procedibilità"],
    categoria: "Primo incontro ed effettività",
    riferimentiNormativi: ["Art. 8, D.Lgs. 28/2010"],
  },
  {
    id: 53,
    organo: "Tribunale di Pavia",
    tipoOrgano: "tribunale",
    sezione: "Sez. III Civile",
    data: "2016-09-01",
    numero: "1090",
    anno: 2016,
    titolo: "Mediazione delegata: il giudice non è vincolato alle materie dell'art. 5, co. 1-bis",
    massima: "La decisione del giudice di disporre la mediazione delegata ex art. 5, comma 2, D.Lgs. 28/2010 rientra nei suoi poteri discrezionali e non è vincolata all'inclusione della lite in una delle materie di cui all'art. 5, co. 1-bis. La valutazione si basa sulla natura della causa, lo stato dell'istruzione e il comportamento delle parti.",
    temiChiave: ["mediazione delegata"],
    categoria: "Mediazione delegata",
    riferimentiNormativi: ["Art. 5, co. 2, D.Lgs. 28/2010"],
  },
  {
    id: 54,
    organo: "Tribunale di Torino",
    tipoOrgano: "tribunale",
    data: "2022-06-15",
    numero: "2577",
    anno: 2022,
    titolo: "Mediazione telematica: non deroga la competenza territoriale dell'organismo",
    massima: "Lo svolgimento della mediazione in modalità telematica non deroga il requisito della competenza territoriale dell'organismo di mediazione. La domanda deve essere depositata presso un organismo avente sede nel circondario del tribunale competente per la causa di merito, anche se l'incontro avviene in videoconferenza.",
    temiChiave: ["mediazione telematica", "competenza territoriale"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010"],
  },
  {
    id: 55,
    organo: "Tribunale di Taranto",
    tipoOrgano: "tribunale",
    data: "2023-03-20",
    numero: "791",
    anno: 2023,
    titolo: "Competenza territoriale e mediazione telematica: va rispettata anche online",
    massima: "Il requisito della competenza territoriale dell'organismo di mediazione va rispettato anche in caso di mediazione telematica. L'esigenza del legislatore è di tutelare il diritto di ciascuno a partecipare da remoto o in presenza. L'organismo deve avere una sede operativa nella circoscrizione dell'ufficio giudiziario competente.",
    temiChiave: ["mediazione telematica", "competenza territoriale", "improcedibilità"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010"],
  },
  {
    id: 56,
    organo: "Tribunale di Catanzaro",
    tipoOrgano: "tribunale",
    data: "2023-06-19",
    numero: "ord.",
    anno: 2023,
    titolo: "Mediazione telematica e competenza territoriale: conferma dell'orientamento restrittivo",
    massima: "La competenza territoriale dell'organismo di mediazione è un requisito inderogabile unilateralmente, anche nel caso di mediazione svolta in modalità telematica. La modalità telematica è una mera modalità di svolgimento dell'incontro, ma non può vanificare la regola sulla competenza territoriale.",
    temiChiave: ["mediazione telematica", "competenza territoriale"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010"],
  },
  {
    id: 57,
    organo: "Tribunale di Civitavecchia",
    tipoOrgano: "tribunale",
    data: "2024-09-10",
    numero: "16380",
    anno: 2024,
    titolo: "Improcedibilità per mediazione presso organismo territorialmente incompetente",
    massima: "La mediazione svolta presso un organismo privo di competenza territoriale comporta l'improcedibilità della domanda giudiziale. Nel caso di condominio, l'organismo deve avere sede nel circondario del tribunale ove si trova il condominio, anche se la mediazione si svolge telematicamente.",
    temiChiave: ["competenza territoriale", "mediazione telematica", "improcedibilità"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010"],
  },
  {
    id: 58,
    organo: "Tribunale di Messina",
    tipoOrgano: "tribunale",
    data: "2025-02-05",
    numero: "194",
    anno: 2025,
    titolo: "Incompetenza territoriale dell'organismo: improcedibilità della domanda",
    massima: "La domanda di mediazione obbligatoria presentata dinanzi a un organismo privo di competenza territoriale comporta la declaratoria di improcedibilità della domanda giudiziale. La competenza dell'organismo è derogabile solo su accordo delle parti.",
    temiChiave: ["competenza territoriale", "improcedibilità"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010"],
  },
  {
    id: 59,
    organo: "Tribunale di Aosta",
    tipoOrgano: "tribunale",
    data: "2025-07-11",
    numero: "143",
    anno: 2025,
    titolo: "Mediazione telematica: attenzione alla sede dell'organismo anche per incontri da remoto",
    massima: "Anche se l'incontro è telematico, va posta attenzione al luogo ove ha sede l'organismo nella scelta di dove depositare la domanda di mediazione. La modalità audiovisiva da remoto non consente di prescindere dalla competenza territoriale.",
    temiChiave: ["mediazione telematica", "competenza territoriale"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010", "Art. 8-ter, D.Lgs. 28/2010"],
  },
  {
    id: 60,
    organo: "Tribunale di Terni",
    tipoOrgano: "tribunale",
    data: "2026-01-15",
    numero: "31",
    anno: 2026,
    titolo: "La modalità telematica è solo forma, non incide sulla competenza territoriale",
    massima: "La modalità telematica è solo una 'forma' di svolgimento dell'incontro di mediazione, ma non incide sulla 'sostanza' della competenza territoriale. Il fatto che le parti non debbano spostarsi fisicamente non autorizza a scegliere un organismo a proprio piacimento.",
    temiChiave: ["mediazione telematica", "competenza territoriale"],
    categoria: "Mediazione telematica e competenza",
    riferimentiNormativi: ["Art. 4, co. 1, D.Lgs. 28/2010", "Art. 8-bis, D.Lgs. 28/2010", "Art. 8-ter, D.Lgs. 28/2010"],
  },

  // =============================================
  // SANZIONI E PARTECIPAZIONE
  // =============================================
  {
    id: 70,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2022-05-19",
    numero: "16197",
    anno: 2022,
    titolo: "Condanna per mancata partecipazione: sanzione obbligatoria, non facoltativa",
    massima: "Quando la mediazione è condizione di procedibilità, il giudice 'condanna' (e non 'può condannare') la parte che non ha partecipato senza giustificato motivo al versamento di una somma corrispondente al contributo unificato. La sanzione è obbligatoria, non facoltativa, laddove la mancata partecipazione sia ritenuta ingiustificata.",
    temiChiave: ["sanzione pecuniaria", "mancata partecipazione", "argomenti di prova"],
    categoria: "Sanzioni e mancata partecipazione",
    riferimentiNormativi: ["Art. 8, co. 4-bis, D.Lgs. 28/2010 (vecchio testo)", "Art. 12-bis, D.Lgs. 28/2010 (nuovo testo)"],
    nota: "Con il D.Lgs. 149/2022 (Riforma Cartabia) e il D.Lgs. 216/2024 (correttivo) la sanzione è stata aumentata al doppio del contributo unificato (art. 12-bis).",
  },
  {
    id: 71,
    organo: "Tribunale di Roma",
    tipoOrgano: "tribunale",
    sezione: "Sez. II",
    data: "2015-02-19",
    numero: "3846",
    anno: 2015,
    titolo: "La mancata partecipazione del condominio: applicabilità della sanzione",
    massima: "È applicabile la sanzione pecuniaria di cui all'art. 8, comma 4-bis, D.Lgs. 28/2010 anche nei confronti del condominio che non partecipi senza giustificato motivo al procedimento di mediazione nelle controversie condominiali.",
    temiChiave: ["sanzione pecuniaria", "mancata partecipazione"],
    categoria: "Sanzioni e mancata partecipazione",
    riferimentiNormativi: ["Art. 8, co. 4-bis, D.Lgs. 28/2010", "Art. 71-quater disp. att. c.c."],
  },

  // =============================================
  // ACCORDO E TITOLO ESECUTIVO
  // =============================================
  {
    id: 80,
    organo: "Tribunale di Palermo",
    tipoOrgano: "tribunale",
    data: "2017-01-20",
    numero: "286",
    anno: 2017,
    titolo: "Omologa dell'accordo di mediazione: sindacato limitato a regolarità formale e ordine pubblico",
    massima: "Il sindacato del Presidente del Tribunale ai fini dell'omologa del verbale di accordo raggiunto in mediazione è limitato alla verifica della regolarità formale e alla conformità all'ordine pubblico e alle norme imperative. Non si estende al merito dell'accordo né alla congruità delle prestazioni pattuite.",
    temiChiave: ["accordo", "omologa", "titolo esecutivo"],
    categoria: "Accordo e titolo esecutivo",
    riferimentiNormativi: ["Art. 12, co. 1-bis, D.Lgs. 28/2010"],
  },
  {
    id: 81,
    organo: "Tribunale di Verona",
    tipoOrgano: "tribunale",
    data: "2016-12-20",
    numero: "3095",
    anno: 2016,
    titolo: "L'accordo di mediazione con avvocati costituisce titolo esecutivo senza omologa",
    massima: "L'accordo di mediazione sottoscritto dalle parti e dai rispettivi avvocati costituisce titolo esecutivo ai sensi dell'art. 12, comma 1, D.Lgs. 28/2010, senza necessità di omologa da parte del tribunale. L'omologa è necessaria solo quando non tutte le parti sono assistite da avvocato.",
    temiChiave: ["accordo", "titolo esecutivo", "omologa"],
    categoria: "Accordo e titolo esecutivo",
    riferimentiNormativi: ["Art. 12, co. 1, D.Lgs. 28/2010", "Art. 12, co. 1-bis, D.Lgs. 28/2010"],
  },

  // =============================================
  // RIFORMA CARTABIA E CORRETTIVO
  // =============================================
  {
    id: 90,
    organo: "Tribunale di Roma",
    tipoOrgano: "tribunale",
    data: "2025-10-15",
    numero: "ord.",
    anno: 2025,
    titolo: "Mediazione obbligatoria e termini di decadenza dopo il D.Lgs. 216/2024",
    massima: "Ai sensi dell'art. 11, comma 4-bis, D.Lgs. 28/2010, introdotto dal correttivo D.Lgs. 216/2024 (interpretazione autentica), quando la mediazione si conclude senza conciliazione, la domanda giudiziale deve essere proposta entro il medesimo termine di decadenza di cui all'art. 8, comma 2, decorrente dal deposito del verbale conclusivo. La norma ha carattere interpretativo e si applica anche ai procedimenti in corso.",
    temiChiave: ["termini decadenza", "correttivo D.Lgs. 216/2024", "riforma Cartabia"],
    categoria: "Riforma Cartabia e correttivo",
    riferimentiNormativi: ["Art. 11, co. 4-bis, D.Lgs. 28/2010", "Art. 8, co. 2, D.Lgs. 28/2010", "D.Lgs. 216/2024"],
    nota: "Il correttivo ha introdotto un'interpretazione autentica che chiarisce il decorso dei termini di decadenza dopo la mediazione negativa.",
  },
  {
    id: 91,
    organo: "Tribunale di Milano",
    tipoOrgano: "tribunale",
    data: "2025-03-20",
    numero: "2145",
    anno: 2025,
    titolo: "Nuova delega in mediazione: forma con firma non autenticata (art. 8, co. 4-bis)",
    massima: "Il D.Lgs. 216/2024 ha introdotto l'art. 8, comma 4-bis, D.Lgs. 28/2010 che specifica che la delega per la partecipazione all'incontro di mediazione va conferita con atto sottoscritto con firma non autenticata, contenente gli estremi del documento di identità del delegante. Ciò codifica il principio già affermato dalla Cassazione con la sentenza n. 8473/2019.",
    temiChiave: ["procura speciale", "rappresentanza", "correttivo D.Lgs. 216/2024", "riforma Cartabia"],
    categoria: "Riforma Cartabia e correttivo",
    riferimentiNormativi: ["Art. 8, co. 4-bis, D.Lgs. 28/2010", "D.Lgs. 216/2024"],
    nota: "La normativa ha finalmente codificato la forma della delega, ponendo fine al dibattito giurisprudenziale.",
  },
  {
    id: 92,
    organo: "Tribunale di Genova",
    tipoOrgano: "tribunale",
    data: "2025-06-10",
    numero: "1789",
    anno: 2025,
    titolo: "Durata della mediazione: sei mesi dopo il D.Lgs. 216/2024",
    massima: "Il procedimento di mediazione ha una durata di sei mesi (non più tre), prorogabile per periodi di volta in volta non superiori a tre mesi. Nel caso di mediazione obbligatoria o delegata, la durata di sei mesi è prorogabile per una sola volta per ulteriori tre mesi. Il termine non è soggetto a sospensione feriale.",
    temiChiave: ["durata", "correttivo D.Lgs. 216/2024"],
    categoria: "Durata e termini",
    riferimentiNormativi: ["Art. 6, D.Lgs. 28/2010", "D.Lgs. 216/2024"],
  },

  // =============================================
  // SPESE E INDENNITÀ
  // =============================================
  {
    id: 100,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2023-06-20",
    numero: "17613",
    anno: 2023,
    titolo: "Condanna alle spese per rifiuto ingiustificato della proposta di mediazione",
    massima: "Il giudice, quando pronuncia la sentenza, condanna la parte che non ha accettato la proposta di mediazione senza giustificato motivo e il cui contenuto corrisponde alla decisione finale, al pagamento delle spese del processo maturate dopo la formulazione della proposta, salvo quanto previsto dagli artt. 92 e 96 c.p.c.",
    temiChiave: ["spese mediazione", "accordo"],
    categoria: "Spese e indennità",
    riferimentiNormativi: ["Art. 13, D.Lgs. 28/2010", "Art. 92 c.p.c.", "Art. 96 c.p.c."],
  },
  {
    id: 101,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2021-07-15",
    numero: "20246",
    anno: 2021,
    titolo: "Spese di mediazione: criterio di riparto tra le parti",
    massima: "Le spese del procedimento di mediazione sono ripartite secondo quanto previsto dall'accordo delle parti o, in mancanza, in parti uguali. L'esenzione dalle spese opera per le materie obbligatorie limitatamente al primo incontro in caso di mancato accordo.",
    temiChiave: ["spese mediazione", "indennità"],
    categoria: "Spese e indennità",
    riferimentiNormativi: ["Art. 17, D.Lgs. 28/2010", "D.M. 150/2023"],
  },

  // =============================================
  // BUONA FEDE E LEALTÀ
  // =============================================
  {
    id: 110,
    organo: "Tribunale di Roma",
    tipoOrgano: "tribunale",
    data: "2017-03-14",
    numero: "5085",
    anno: 2017,
    titolo: "Obbligo di buona fede e lealtà nel procedimento di mediazione",
    massima: "Le parti e i loro avvocati sono tenuti a comportarsi con buona fede e lealtà nel procedimento di mediazione. Vanno considerate illegittime le condotte poste in essere al solo scopo di eludere il dettato normativo, come la partecipazione meramente formale senza effettiva volontà di comporre la controversia.",
    temiChiave: ["buona fede", "effettività", "primo incontro"],
    categoria: "Primo incontro ed effettività",
    riferimentiNormativi: ["Art. 8, D.Lgs. 28/2010", "Art. 1175 c.c.", "Art. 1375 c.c."],
    nota: "Il D.Lgs. 216/2024 ha esplicitamente introdotto il dovere di cooperazione in buona fede e lealtà nell'art. 8-ter.",
  },

  // =============================================
  // MATERIE SPECIFICHE
  // =============================================
  {
    id: 120,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2017-10-20",
    numero: "24841",
    anno: 2017,
    titolo: "Condominio: l'amministratore necessita di delibera assembleare per la mediazione",
    massima: "L'amministratore di condominio, per partecipare utilmente al procedimento di mediazione in materia condominiale, necessita di una delibera assembleare che lo autorizzi a partecipare alla mediazione e, se del caso, a conciliare. In mancanza, la partecipazione è meramente formale e non soddisfa la condizione di procedibilità.",
    temiChiave: ["procedibilità", "comparizione personale", "rappresentanza"],
    categoria: "Condizione di procedibilità",
    riferimentiNormativi: ["Art. 71-quater disp. att. c.c.", "Art. 5, co. 1-bis, D.Lgs. 28/2010"],
  },
  {
    id: 121,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2019-07-03",
    numero: "17781",
    anno: 2019,
    titolo: "Mediazione in materia bancaria: la condizione di procedibilità si applica anche alle azioni di classe",
    massima: "La condizione di procedibilità della mediazione obbligatoria si applica anche alle controversie in materia di contratti bancari e finanziari, incluse le azioni relative a clausole vessatorie. Il legislatore ha incluso la materia bancaria tra quelle soggette a mediazione obbligatoria per la rilevanza sociale e il volume del contenzioso.",
    temiChiave: ["procedibilità", "obbligatorietà"],
    categoria: "Mediazione obbligatoria",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010"],
  },
  {
    id: 122,
    organo: "Tribunale di Verona",
    tipoOrgano: "tribunale",
    data: "2016-01-11",
    numero: "49",
    anno: 2016,
    titolo: "Mediazione e contratti assicurativi: l'obbligo si estende a tutte le tipologie",
    massima: "L'obbligo di mediazione obbligatoria in materia di contratti assicurativi si estende a tutte le controversie derivanti da contratti di assicurazione, senza distinzione tra assicurazione obbligatoria RC Auto e altre tipologie contrattuali.",
    temiChiave: ["obbligatorietà", "procedibilità"],
    categoria: "Mediazione obbligatoria",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010"],
  },
  {
    id: 123,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2022-11-14",
    numero: "33462",
    anno: 2022,
    titolo: "Mediazione delegata: il giudice può disporla fino alla precisazione delle conclusioni",
    massima: "Il giudice, valutata la natura della causa, lo stato dell'istruzione e il comportamento delle parti, può disporre la mediazione delegata in qualsiasi momento del processo fino alla precisazione delle conclusioni, ai sensi dell'art. 5, comma 2, D.Lgs. 28/2010.",
    temiChiave: ["mediazione delegata"],
    categoria: "Mediazione delegata",
    riferimentiNormativi: ["Art. 5, co. 2, D.Lgs. 28/2010"],
    nota: "Il D.Lgs. 216/2024 ha modificato il limite: ora il giudice può delegare in mediazione fino all'udienza di rimessione in decisione.",
  },
  {
    id: 124,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. II Civile",
    data: "2018-12-07",
    numero: "31689",
    anno: 2018,
    titolo: "La mediazione non esperita in appello: rimessione al primo giudice",
    massima: "Il giudice d'appello, riscontrato che la mediazione obbligatoria non è stata esperita in primo grado, deve rimettere la causa al giudice di primo grado, in quanto il difetto della condizione di procedibilità attiene a una questione che doveva essere esaminata dal primo giudice.",
    temiChiave: ["procedibilità", "improcedibilità"],
    categoria: "Condizione di procedibilità",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 354 c.p.c."],
  },
  {
    id: 125,
    organo: "Cassazione",
    tipoOrgano: "cassazione",
    sezione: "Sez. III Civile",
    data: "2020-06-12",
    numero: "11289",
    anno: 2020,
    titolo: "Il mediatore: ruolo centrale e indipendenza nella gestione della mediazione",
    massima: "Il mediatore è un terzo imparziale e indipendente, il cui ruolo è facilitare la comunicazione tra le parti e assisterle nella ricerca di un accordo. Il mediatore non è un ausiliario del giudice e non può essere vincolato da istruzioni del giudice sul modo di condurre la mediazione o sulla formulazione della proposta.",
    temiChiave: ["mediatore", "organismo di mediazione"],
    categoria: "Mediatore e organismo",
    riferimentiNormativi: ["Art. 1, co. 1, lett. a), D.Lgs. 28/2010", "Art. 14, D.Lgs. 28/2010"],
  },
];

// Funzione di ricerca
export function cercaSentenze(filtri: {
  testoLibero?: string;
  categoria?: string;
  tipoOrgano?: string;
  annoMin?: number;
  annoMax?: number;
  temiChiave?: string[];
}): Sentenza[] {
  let risultati = [...sentenze];

  if (filtri.categoria) {
    risultati = risultati.filter(s => s.categoria === filtri.categoria);
  }

  if (filtri.tipoOrgano) {
    risultati = risultati.filter(s => s.tipoOrgano === filtri.tipoOrgano);
  }

  if (filtri.annoMin) {
    risultati = risultati.filter(s => s.anno >= filtri.annoMin!);
  }

  if (filtri.annoMax) {
    risultati = risultati.filter(s => s.anno <= filtri.annoMax!);
  }

  if (filtri.temiChiave && filtri.temiChiave.length > 0) {
    risultati = risultati.filter(s =>
      filtri.temiChiave!.some(t => s.temiChiave.includes(t))
    );
  }

  if (filtri.testoLibero) {
    const query = filtri.testoLibero.toLowerCase();
    risultati = risultati.filter(s =>
      s.titolo.toLowerCase().includes(query) ||
      s.massima.toLowerCase().includes(query) ||
      (s.principioDiDiritto && s.principioDiDiritto.toLowerCase().includes(query)) ||
      s.organo.toLowerCase().includes(query) ||
      s.numero.toLowerCase().includes(query) ||
      s.riferimentiNormativi.some(r => r.toLowerCase().includes(query)) ||
      (s.nota && s.nota.toLowerCase().includes(query))
    );
  }

  // Ordina per anno decrescente, poi per importanza (Corte Cost. > SS.UU. > Cass. > App. > Trib.)
  const ordineOrgano: Record<string, number> = {
    corte_costituzionale: 1,
    cassazione_su: 2,
    cassazione: 3,
    corte_appello: 4,
    tribunale: 5,
  };

  risultati.sort((a, b) => {
    if (b.anno !== a.anno) return b.anno - a.anno;
    return (ordineOrgano[a.tipoOrgano] || 99) - (ordineOrgano[b.tipoOrgano] || 99);
  });

  return risultati;
}
