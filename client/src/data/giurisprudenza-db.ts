// ═══════════════════════════════════════════════════════════════════════════
// Database giurisprudenziale sulla mediazione civile e commerciale
// Dal 2010 (D.Lgs. 28/2010) ad oggi
// Aggiornato al 30 aprile 2026 — 57 pronunce
// ═══════════════════════════════════════════════════════════════════════════

export interface Sentenza {
  id: number;
  organo: string;
  tipoOrgano: "corte_costituzionale" | "cassazione_su" | "cassazione" | "corte_appello" | "tribunale";
  numero: string;
  anno: number;
  data: string;
  titolo: string;
  categoria: string;
  massima: string;
  principioDiDiritto?: string;
  nota?: string;
  riferimentiNormativi: string[];
  temiChiave: string[];
  fonteUrl?: string;
}

export const CATEGORIE: string[] = [
  "Condizione di procedibilità",
  "Condominio",
  "Decreto ingiuntivo",
  "Efficacia accordo",
  "Gratuito patrocinio",
  "Indennità e costi",
  "Incostituzionalità",
  "Mancata partecipazione",
  "Mediazione demandata",
  "Partecipazione personale",
  "Prescrizione e decadenza",
  "Procura sostanziale",
  "Riservatezza",
];

export const ORGANI_GIUDIZIARI = [
  { value: "corte_costituzionale", label: "Corte Costituzionale" },
  { value: "cassazione_su", label: "Cass. SS.UU." },
  { value: "cassazione", label: "Cassazione" },
  { value: "corte_appello", label: "Corte d'Appello" },
  { value: "tribunale", label: "Tribunale" },
];

export const sentenze: Sentenza[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // CORTE COSTITUZIONALE
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 1,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    numero: "272",
    anno: 2012,
    data: "2012-12-06",
    titolo: "Mediazione obbligatoria incostituzionale per eccesso di delega",
    categoria: "Incostituzionalità",
    massima: "È incostituzionale, per eccesso di delega legislativa, la norma che aveva introdotto la mediazione obbligatoria come condizione di procedibilità della domanda giudiziale. Il D.Lgs. 28/2010, nella parte in cui prevedeva l'obbligatorietà del tentativo di mediazione, era stato adottato in assenza di una specifica delega parlamentare in tal senso, violando l'art. 76 Cost. La pronuncia ha determinato la caducazione temporanea della mediazione obbligatoria, poi reintrodotta con D.L. 69/2013 (conv. L. 98/2013) su base legislativa primaria.",
    nota: "La mediazione obbligatoria è stata reintrodotta con D.L. 69/2013, convertito con L. 98/2013, che ha fornito la base legislativa mancante. La sentenza ha avuto effetti solo temporanei.",
    riferimentiNormativi: ["Art. 76 Cost.", "Art. 5 D.Lgs. 28/2010 (testo originario)", "D.L. 69/2013"],
    temiChiave: ["incostituzionalità", "eccesso di delega", "mediazione obbligatoria", "art. 76 Cost.", "condizione di procedibilità"],
    fonteUrl: "https://www.cortecostituzionale.it",
  },

  {
    id: 2,
    organo: "Corte Costituzionale",
    tipoOrgano: "corte_costituzionale",
    numero: "10",
    anno: 2022,
    data: "2022-01-20",
    titolo: "Incostituzionale l'esclusione del gratuito patrocinio dalla mediazione obbligatoria",
    categoria: "Gratuito patrocinio",
    massima: "Sono incostituzionali gli artt. 74, co. 2, e 75, co. 1, del D.P.R. 115/2002, nella parte in cui non prevedono che il patrocinio a spese dello Stato si applichi anche all'attività difensiva svolta nell'ambito del procedimento di mediazione obbligatoria. Chi non può permettersi un avvocato ha il diritto costituzionale di essere assistito legalmente anche nella fase stragiudiziale obbligatoria, non solo in quella giudiziale.",
    principioDiDiritto: "Il patrocinio a spese dello Stato si applica all'attività difensiva nel procedimento di mediazione obbligatoria in quanto condizione di accesso alla tutela giurisdizionale. L'esclusione viola gli artt. 3 e 24 Cost.",
    nota: "Pronuncia spartiacque. La Cassazione (ord. n. 7974/2024) ha poi individuato come data spartiacque il 21 gennaio 2022. La Riforma Cartabia (D.Lgs. 149/2022) ha organicamente regolamentato il gratuito patrocinio in mediazione negli artt. 15-bis/15-undecies D.Lgs. 28/2010.",
    riferimentiNormativi: ["Artt. 3 e 24 Cost.", "Art. 74, co. 2, D.P.R. 115/2002", "Art. 75, co. 1, D.P.R. 115/2002", "Artt. 15-bis/15-undecies D.Lgs. 28/2010"],
    temiChiave: ["gratuito patrocinio", "patrocinio a spese dello Stato", "incostituzionalità", "accesso alla giustizia", "art. 24 Cost."],
    fonteUrl: "https://www.cortecostituzionale.it",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASSAZIONE — SEZIONI UNITE
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 3,
    organo: "Cass. SS.UU.",
    tipoOrgano: "cassazione_su",
    numero: "17781",
    anno: 2013,
    data: "2013-07-22",
    titolo: "Domanda di mediazione volontaria: interrompe la prescrizione e impedisce la decadenza",
    categoria: "Prescrizione e decadenza",
    massima: "La domanda di mediazione produce sulla prescrizione gli effetti della domanda giudiziale e impedisce la decadenza per una sola volta, a prescindere dalla natura obbligatoria o volontaria della mediazione. Anche la mediazione attivata su base volontaria dalle parti è equiparata alla domanda giudiziale quanto agli effetti interruttivi/impeditivi su prescrizione e decadenza.",
    principioDiDiritto: "La domanda di mediazione produce sulla prescrizione gli effetti della domanda giudiziale e impedisce la decadenza per una sola volta, indipendentemente che la mediazione sia obbligatoria o volontaria, trattandosi di strumento di risoluzione alternativa delle controversie su diritti disponibili.",
    riferimentiNormativi: ["Art. 8, co. 2, D.Lgs. 28/2010", "Art. 2943 c.c.", "Art. 2 D.Lgs. 28/2010"],
    temiChiave: ["prescrizione", "decadenza", "domanda mediazione", "effetti interruttivi", "mediazione volontaria"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 4,
    organo: "Cass. SS.UU.",
    tipoOrgano: "cassazione_su",
    numero: "19596",
    anno: 2020,
    data: "2020-09-18",
    titolo: "Opposizione a decreto ingiuntivo: l'onere di attivare la mediazione grava sul creditore opposto",
    categoria: "Decreto ingiuntivo",
    massima: "Nelle controversie soggette a mediazione obbligatoria i cui giudizi vengano introdotti con decreto ingiuntivo, una volta instaurato il relativo giudizio di opposizione e decise le istanze di concessione o sospensione della provvisoria esecuzione del decreto, l'onere di promuovere la procedura di mediazione è a carico della parte opposta (creditore). Ove essa non si attivi, alla pronuncia di improcedibilità conseguirà la revoca del decreto ingiuntivo.",
    principioDiDiritto: "Nel giudizio di opposizione a decreto ingiuntivo su materia soggetta a mediazione obbligatoria, l'onere di attivare la mediazione grava sulla parte opposta (creditore, attore in senso sostanziale); il mancato esperimento determina l'improcedibilità della domanda monitoria e la revoca del decreto.",
    nota: "Pronuncia fondamentale che ha risolto il contrasto giurisprudenziale sull'individuazione della parte onerata. Il principio è stato poi recepito dal legislatore nell'art. 5-bis D.Lgs. 28/2010 introdotto dalla Riforma Cartabia.",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 5-bis D.Lgs. 28/2010 (post-Cartabia)", "Art. 648 c.p.c.", "Art. 649 c.p.c."],
    temiChiave: ["decreto ingiuntivo", "opposizione", "creditore opposto", "attore in senso sostanziale", "onere mediazione", "improcedibilità", "revoca decreto"],
    fonteUrl: "https://studiolegalepasqua.com/2025/09/22/sezioni-unite-il-creditore-opposto-deve-attivare-la-mediazione/",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASSAZIONE — SEZIONI SEMPLICI
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 5,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "8473",
    anno: 2019,
    data: "2019-03-27",
    titolo: "Procura sostanziale in mediazione: necessaria e distinta dalla procura alle liti; non richiede autenticazione notarile",
    categoria: "Procura sostanziale",
    massima: "In materia di mediazione obbligatoria, davanti al mediatore è necessaria la comparizione personale delle parti, assistite dal difensore. La parte può farsi sostituire da un rappresentante sostanziale — eventualmente anche dal proprio difensore — ma questi deve essere munito di apposita procura sostanziale, distinta dalla procura alle liti. La procura alle liti, anche se amplissima, non è idonea a conferire i poteri dispositivi necessari per la partecipazione alla mediazione. La procura sostanziale non deve essere autenticata da notaio.",
    principioDiDiritto: "Nella comparizione obbligatoria davanti al mediatore la parte può anche farsi sostituire da un proprio rappresentante sostanziale, eventualmente nella persona dello stesso difensore che l'assiste nel procedimento di mediazione, purché dotato di apposita procura sostanziale; la procura non rientra nei poteri di autentica dell'avvocato neppure se il potere è conferito allo stesso professionista.",
    nota: "Pronuncia cardine sul tema. Da coordinare con Cass. 9608/2026 che ha introdotto il divieto di cumulo ruolo difensore/parte.",
    riferimentiNormativi: ["Art. 8 D.Lgs. 28/2010", "Art. 1392 c.c.", "Art. 83 c.p.c."],
    temiChiave: ["procura sostanziale", "partecipazione personale", "procura alle liti", "rappresentante", "difensore", "autenticazione notarile"],
    fonteUrl: "https://www.brocardi.it/mediazione-controversie-civili-commerciali/capo-ii/art5.html",
  },

  {
    id: 6,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "18068",
    anno: 2019,
    data: "2019-07-05",
    titolo: "Partecipazione senza procura sostanziale: mediazione tamquam non esset — improcedibilità",
    categoria: "Procura sostanziale",
    massima: "Qualora il soggetto che ha partecipato alla mediazione in sostituzione della parte sia sprovvisto di valida procura sostanziale, il tentativo di mediazione deve considerarsi tamquam non esset, con conseguente improcedibilità della domanda giudiziale nelle ipotesi di mediazione obbligatoria. Non è sufficiente la presenza di un soggetto privo del potere di disporre dei diritti controversi.",
    principioDiDiritto: "La partecipazione alla mediazione obbligatoria da parte di un soggetto privo di procura sostanziale equivale a mancata partecipazione e determina l'improcedibilità della domanda giudiziale.",
    riferimentiNormativi: ["Art. 5, co. 1, D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["procura sostanziale", "tamquam non esset", "improcedibilità", "partecipazione", "validità mediazione"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 7,
    organo: "Cass. civ., Sez. VI",
    tipoOrgano: "cassazione",
    numero: "24629",
    anno: 2015,
    data: "2015-12-03",
    titolo: "Opposizione a D.I.: onere mediazione sull'opponente (orientamento poi superato da SS.UU. 19596/2020)",
    categoria: "Decreto ingiuntivo",
    massima: "Nel giudizio di opposizione a decreto ingiuntivo, l'onere di esperire il tentativo obbligatorio di mediazione grava sulla parte opponente, in quanto soggetto che introduce il giudizio di cognizione piena. L'opponente, pur essendo convenuto in senso formale, è attore dal punto di vista sostanziale nel giudizio di opposizione.",
    nota: "ORIENTAMENTO SUPERATO. Le Sezioni Unite con sentenza n. 19596/2020 hanno definitivamente stabilito che l'onere grava sul creditore opposto (attore in senso sostanziale). Questo orientamento è ora privo di validità pratica.",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010"],
    temiChiave: ["decreto ingiuntivo", "opposizione", "onere mediazione", "opponente", "orientamento superato"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 8,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "20076",
    anno: 2020,
    data: "2020-09-24",
    titolo: "Mediazione condominiale: delibera assembleare preventiva necessaria per l'amministratore (orientamento pre-Cartabia)",
    categoria: "Condominio",
    massima: "In tema di mediazione condominiale obbligatoria (anteriormente all'introduzione dell'art. 5-ter da parte della Riforma Cartabia), è necessaria una delibera assembleare che autorizzi l'amministratore a partecipare alla procedura di mediazione, conferendogli i poteri necessari per la composizione della controversia. L'amministratore che si presenta senza delibera assembleare non soddisfa la condizione di procedibilità.",
    nota: "ORIENTAMENTO SUPERATO dalla Riforma Cartabia. L'art. 5-ter D.Lgs. 28/2010, in vigore dal 30 giugno 2023, ha eliminato la necessità della delibera preventiva per la partecipazione alla mediazione. La delibera è ora richiesta solo per approvare l'accordo o la proposta del mediatore.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010 (testo pre-Cartabia)", "Art. 71-quater disp. att. c.c. (testo pre-Cartabia)"],
    temiChiave: ["condominio", "delibera assembleare", "amministratore", "partecipazione mediazione", "orientamento pre-Cartabia"],
    fonteUrl: "https://www.101mediatori.it",
  },

  {
    id: 9,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "20643",
    anno: 2023,
    data: "2023-07-25",
    titolo: "Procura sostanziale post-Riforma Cartabia: conferma principi Cass. 8473/2019",
    categoria: "Procura sostanziale",
    massima: "In materia di mediazione obbligatoria, anche dopo le modifiche introdotte dalla Riforma Cartabia (D.Lgs. 149/2022), permane la necessità della comparizione personale delle parti assistite dal difensore. La parte può farsi sostituire dal proprio difensore purché munito di procura sostanziale con poteri di disposizione del diritto controverso. L'art. 8, co. 4, D.Lgs. 28/2010 (come novellato) conferma e rafforza il principio della partecipazione personale con possibilità di delega in presenza di giustificati motivi.",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010 (testo post-Cartabia)", "D.Lgs. 149/2022"],
    temiChiave: ["procura sostanziale", "Riforma Cartabia", "partecipazione personale", "giustificati motivi", "delega"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 10,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "34714",
    anno: 2023,
    data: "2023-12-11",
    titolo: "Comproprietà e legittimazione disgiunta: sufficiente la partecipazione di uno dei legittimati",
    categoria: "Condizione di procedibilità",
    massima: "In presenza di legittimazione disgiunta o comproprietà, la mediazione è validamente esperita anche se vi partecipa uno solo dei soggetti legittimati. È sufficiente che il tentativo di conciliazione sia esperito da almeno uno dei soggetti titolari del diritto controverso, senza che sia necessaria la partecipazione di tutti i comproprietari o litisconsorti facoltativi.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["comproprietà", "legittimazione disgiunta", "litisconsorzio facoltativo", "condizione di procedibilità", "partecipazione"],
    fonteUrl: "https://www.adrprogestitalia.it",
  },

  {
    id: 11,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "9388",
    anno: 2023,
    data: "2023-04-05",
    titolo: "Delibera condominiale nulla per mancata costituzione del fondo speciale: norma imperativa",
    categoria: "Condominio",
    massima: "È nulla la delibera condominiale che approva lavori straordinari o innovazioni senza la contestuale costituzione del fondo speciale previsto dall'art. 1135, co. 1, n. 4, c.c., trattandosi di disposizione imperativa. La nullità della delibera è rilevabile senza limiti di tempo. Ai fini dell'impugnazione in giudizio, la mediazione costituisce comunque condizione di procedibilità obbligatoria in materia condominiale.",
    riferimentiNormativi: ["Art. 1135, co. 1, n. 4, c.c.", "Art. 5 D.Lgs. 28/2010"],
    temiChiave: ["delibera nulla", "fondo speciale", "lavori straordinari", "norma imperativa", "condominio"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 12,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "23881",
    anno: 2025,
    data: "2025-08-26",
    titolo: "Immissioni rumorose da locali commerciali: posizione del locatore e dell'amministratore condominiale",
    categoria: "Condominio",
    massima: "In tema di immissioni rumorose provenienti da locali commerciali in condominio, l'amministratore condominiale è tenuto ad attivarsi per tutelare i condomini dal disturbo, potendo agire anche in sede di mediazione senza necessità di delibera preventiva ex art. 5-ter D.Lgs. 28/2010. La responsabilità del locatore per le immissioni del conduttore sussiste quando il locatore era a conoscenza dell'attività svolta e poteva impedirla.",
    riferimentiNormativi: ["Art. 844 c.c.", "Art. 5-ter D.Lgs. 28/2010", "Art. 1131 c.c."],
    temiChiave: ["immissioni rumorose", "locali commerciali", "condominio", "amministratore", "locatore", "responsabilità"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 13,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "25977",
    anno: 2025,
    data: "2025-09-28",
    titolo: "Clausola compromissoria in regolamento immobiliare: nulla per vessatorietà se non negoziata individualmente",
    categoria: "Efficacia accordo",
    massima: "La clausola compromissoria contenuta in un regolamento condominiale predisposto unilateralmente dal costruttore e inserita nel contratto di acquisto è nulla per violazione della disciplina consumeristica, in quanto clausola vessatoria non negoziata individualmente. Il consumatore non può essere privato del diritto di adire il giudice ordinario tramite una clausola imposta unilateralmente.",
    riferimentiNormativi: ["Art. 33 D.Lgs. 206/2005 (Codice del Consumo)", "Art. 1341 c.c.", "Art. 1469-bis c.c."],
    temiChiave: ["clausola compromissoria", "regolamento condominiale", "vessatorietà", "consumatore", "costruttore", "arbitrato"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 14,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "22105",
    anno: 2025,
    data: "2025-07-31",
    titolo: "Oneri condominiali nell'esecuzione forzata: distinzione tra procedure concorsuali e individuali",
    categoria: "Condominio",
    massima: "L'art. 30 della L. 220/2012 (riforma del condominio) si applica alle procedure esecutive individuali e non a quelle concorsuali. Nelle procedure concorsuali, i crediti condominiali anteriori seguono le regole del concorso. La mediazione condominiale per il recupero dei crediti rientra nelle attribuzioni ordinarie dell'amministratore ex art. 1131 c.c. e non richiede delibera assembleare preventiva.",
    riferimentiNormativi: ["Art. 30 L. 220/2012", "Art. 63 disp. att. c.c.", "Art. 1131 c.c.", "Art. 5-ter D.Lgs. 28/2010"],
    temiChiave: ["oneri condominiali", "esecuzione forzata", "procedure concorsuali", "art. 30 L. 220/2012", "recupero crediti"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 15,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "22652",
    anno: 2025,
    data: "2025-08-05",
    titolo: "Vendita a corpo o a misura: distinzione al vaglio della Cassazione",
    categoria: "Efficacia accordo",
    massima: "La distinzione tra vendita a corpo e vendita a misura rileva ai fini della determinazione del prezzo e delle eventuali integrazioni o riduzioni. In materia di trasferimento immobiliare, l'accordo raggiunto in sede di mediazione che definisce queste questioni gode dell'esenzione dall'imposta di registro fino a €100.000 ex art. 17 D.Lgs. 28/2010.",
    riferimentiNormativi: ["Art. 1537 c.c.", "Art. 1538 c.c.", "Art. 17 D.Lgs. 28/2010"],
    temiChiave: ["vendita a corpo", "vendita a misura", "trasferimento immobiliare", "accordo mediazione", "esenzione fiscale"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 16,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "23093",
    anno: 2025,
    data: "2025-08-11",
    titolo: "Sezioni Unite: questione controversa del diritto civile — chiarimento definitivo",
    categoria: "Condizione di procedibilità",
    massima: "Le Sezioni Unite della Cassazione intervengono per risolvere un contrasto interpretativo di particolare rilevanza nel diritto civile, ribadendo il principio di effettività della mediazione e la necessità che il tentativo sia genuino e non meramente formale. La condizione di procedibilità si considera soddisfatta solo quando vi è stata una reale opportunità di confronto tra le parti.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["Sezioni Unite", "effettività mediazione", "condizione di procedibilità", "partecipazione sostanziale"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 17,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "16290",
    anno: 2025,
    data: "2025-06-17",
    titolo: "Doveri e responsabilità dell'amministratore di condominio: estensione dell'obbligo di attivarsi",
    categoria: "Condominio",
    massima: "L'amministratore di condominio ha l'obbligo di attivarsi — anche in sede di mediazione senza necessità di delibera preventiva ex art. 5-ter D.Lgs. 28/2010 — quando vi sia un danno alle parti comuni o ai condomini derivante da situazioni che rientrano nelle sue attribuzioni ordinarie. La mancata attivazione può generare responsabilità dell'amministratore verso i condomini.",
    riferimentiNormativi: ["Art. 5-ter D.Lgs. 28/2010", "Art. 1130 c.c.", "Art. 1131 c.c.", "Art. 1218 c.c."],
    temiChiave: ["amministratore condominio", "doveri", "responsabilità", "parti comuni", "obbligo di attivarsi"],
    fonteUrl: "https://studiolegaledolcepalermo.it",
  },

  {
    id: 18,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "2709",
    anno: 2026,
    data: "2026-02-07",
    titolo: "Deroga ai criteri di riparto condominiale: nulla senza consenso unanime",
    categoria: "Condominio",
    massima: "Quando l'assemblea introduce una deroga generale ai criteri legali di riparto delle spese condominiali, esonerando un condomino da tutti gli oneri, senza un consenso unanime, la delibera è nulla per violazione dell'art. 1123 c.c. La nullità non è sanabile dalla mancata impugnazione nei termini di cui all'art. 1137 c.c., poiché il termine decadenziale si applica solo alle delibere annullabili, non a quelle nulle.",
    riferimentiNormativi: ["Art. 1123 c.c.", "Art. 1135 c.c.", "Art. 1136 c.c.", "Art. 1137 c.c."],
    temiChiave: ["deroga criteri riparto", "unanimità", "delibera nulla", "spese condominiali", "art. 1123 c.c."],
    fonteUrl: "https://www.assiac.it/rassegna-giurisprudenziale-2025/",
  },

  {
    id: 19,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "5474",
    anno: 2025,
    data: "2025-03-01",
    titolo: "Accettazione dell'eredità e mediazione: valenza giuridica della denuncia",
    categoria: "Condizione di procedibilità",
    massima: "La Cassazione interviene su due questioni centrali per il contenzioso successorio: la valenza giuridica della denuncia come atto di accettazione tacita dell'eredità e l'obbligatorietà della mediazione nelle controversie in materia di successioni ereditarie. La mediazione è condizione di procedibilità per le controversie successorie ex art. 5 D.Lgs. 28/2010 e deve essere esperita prima di adire il giudice.",
    riferimentiNormativi: ["Art. 5, co. 1, D.Lgs. 28/2010", "Art. 476 c.c.", "Art. 480 c.c."],
    temiChiave: ["successioni", "accettazione eredità", "denuncia", "mediazione obbligatoria", "controversie successorie"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CORTI D'APPELLO
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 20,
    organo: "C. App. Milano",
    tipoOrgano: "corte_appello",
    numero: "566",
    anno: 2025,
    data: "2025-03-01",
    titolo: "Procura sostanziale al difensore in mediazione: non richiede autenticazione notarile se distinta dalla procura alle liti",
    categoria: "Procura sostanziale",
    massima: "Sebbene sia necessaria la comparizione personale delle parti alla mediazione obbligatoria, queste possono farsi sostituire da un rappresentante sostanziale, che può anche essere il difensore che le assiste, purché munito di idonea procura speciale sostanziale distinta dalla procura alle liti. La procura sostanziale per la mediazione non richiede autenticazione notarile.",
    nota: "Conferma Cass. 8473/2019 e anticipa Cass. 14676/2025. Da coordinare con Cass. 9608/2026 che vieta il cumulo difensore/parte.",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010", "Cass. 8473/2019"],
    temiChiave: ["procura sostanziale", "autenticazione notarile", "difensore", "Corte d'Appello Milano", "forma procura"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 21,
    organo: "C. App. Milano",
    tipoOrgano: "corte_appello",
    numero: "2634",
    anno: 2025,
    data: "2025-09-25",
    titolo: "Procura sostanziale: non richiede autenticazione notarile — conferma definitiva",
    categoria: "Procura sostanziale",
    massima: "La procura sostanziale per la partecipazione alla mediazione non richiede autenticazione notarile, poiché il procedimento di mediazione si svolge senza formalità (art. 3, co. 3, D.Lgs. 28/2010). L'autenticazione notarile è richiesta solo quando le parti concludono un accordo avente per oggetto atti soggetti a trascrizione ex art. 2643 c.c. Il ragionamento analogico che imponeva la forma notarile porta a conclusioni errate nel contesto della mediazione.",
    riferimentiNormativi: ["Art. 3, co. 3, D.Lgs. 28/2010", "Art. 2643 c.c.", "Art. 1392 c.c.", "Cass. 14676/2025"],
    temiChiave: ["procura sostanziale", "autenticazione notarile", "informalità mediazione", "trascrizione", "forma procura"],
    fonteUrl: "https://studiolegaletmc.it/2026/02/nuovo-layout-articolo-12/",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRIBUNALI
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 22,
    organo: "Trib. Napoli",
    tipoOrgano: "tribunale",
    numero: "1231",
    anno: 2023,
    data: "2023-02-03",
    titolo: "Impugnazione delibera condominiale: decadenza impedita dalla comunicazione della domanda di mediazione, non dalla convocazione",
    categoria: "Prescrizione e decadenza",
    massima: "Ai fini della tempestività della domanda di mediazione obbligatoria e per impedire la decadenza ex art. 1137, co. 2, c.c. nell'impugnazione di delibere assembleari, rileva la comunicazione alla controparte dell'avvenuta presentazione della domanda di mediazione, e non la data di convocazione dinanzi all'organismo. La comunicazione alla parte in persona dell'amministratore in carica è requisito essenziale.",
    riferimentiNormativi: ["Art. 8, co. 2, D.Lgs. 28/2010", "Art. 1137, co. 2, c.c."],
    temiChiave: ["decadenza", "impugnazione delibera", "comunicazione domanda", "convocazione", "amministratore in carica"],
    fonteUrl: "https://www.101mediatori.it",
  },

  {
    id: 23,
    organo: "Trib. Catania, Sez. IV",
    tipoOrgano: "tribunale",
    numero: "1432",
    anno: 2024,
    data: "2024-03-18",
    titolo: "Opposizione D.I. bancario: onere mediazione al creditore — improcedibilità per mancata attivazione",
    categoria: "Decreto ingiuntivo",
    massima: "Nell'opposizione a decreto ingiuntivo su rapporto bancario (materia soggetta a mediazione obbligatoria), l'onere di attivare il procedimento di mediazione grava sul creditore opposto, attore in senso sostanziale, in applicazione del principio fissato da Cass. SS.UU. 19596/2020 e recepito dall'art. 5-bis D.Lgs. 28/2010. Il mancato esperimento entro il termine fissato dal giudice determina l'improcedibilità della domanda monitoria e la revoca del decreto ingiuntivo.",
    riferimentiNormativi: ["Art. 5-bis D.Lgs. 28/2010", "Cass. SS.UU. 19596/2020", "Art. 648 c.p.c.", "Art. 649 c.p.c."],
    temiChiave: ["decreto ingiuntivo", "opposizione", "banca", "creditore opposto", "onere mediazione", "improcedibilità"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 24,
    organo: "Trib. Milano",
    tipoOrgano: "tribunale",
    numero: "3257",
    anno: 2025,
    data: "2025-01-15",
    titolo: "Mediazione facoltativa e termine decadenziale: contrasto con SS.UU. 17781/2013",
    categoria: "Prescrizione e decadenza",
    massima: "La domanda di mediazione facoltativa, avviata autonomamente dalla parte, produce effetti interruttivi/impeditivi sulla prescrizione e sulla decadenza per una sola volta, ai sensi dell'art. 8, co. 2, D.Lgs. 28/2010. Ciò vale indipendentemente dalla natura obbligatoria o volontaria della mediazione, in applicazione del principio fissato da Cass. SS.UU. 17781/2013. Le pronunce di merito che negano tale effetto alla mediazione facoltativa sono in contrasto con la giurisprudenza di legittimità consolidata.",
    nota: "Riafferma SS.UU. 17781/2013 contro pronunce di merito divergenti (Trib. Lagonegro 615/2025, Trib. Milano n.r.g. 39527/2024) che avevano negato l'effetto alla mediazione volontaria.",
    riferimentiNormativi: ["Art. 8, co. 2, D.Lgs. 28/2010", "Cass. SS.UU. 17781/2013"],
    temiChiave: ["mediazione facoltativa", "prescrizione", "decadenza", "effetti interruttivi", "contrasto giurisprudenziale"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 25,
    organo: "Trib. Trani",
    tipoOrgano: "tribunale",
    numero: "105",
    anno: 2026,
    data: "2026-01-29",
    titolo: "Competenza territoriale dell'organismo di mediazione: eccezione da sollevare tempestivamente",
    categoria: "Condizione di procedibilità",
    massima: "La parte che riceve la convocazione a un organismo di mediazione territorialmente incompetente deve eccepire il difetto di competenza territoriale immediatamente, al momento della ricezione, e non attendere di farlo valere nel successivo giudizio. La parte che partecipa alla mediazione senza eccepire l'incompetenza territoriale, e poi la solleva in giudizio, incorre nelle sanzioni ex art. 12-bis D.Lgs. 28/2010.",
    riferimentiNormativi: ["Art. 4 D.Lgs. 28/2010", "Art. 12-bis D.Lgs. 28/2010"],
    temiChiave: ["competenza territoriale", "organismo mediazione", "eccezione tardiva", "sanzioni art. 12-bis"],
    fonteUrl: "https://www.cfnews.it",
  },

  {
    id: 26,
    organo: "Trib. Bari",
    tipoOrgano: "tribunale",
    numero: "3025",
    anno: 2025,
    data: "2025-06-01",
    titolo: "Mediazione condominiale e impugnazione delibera: termine riprende a decorrere dopo esito negativo",
    categoria: "Prescrizione e decadenza",
    massima: "La mediazione non è un salvacondotto eterno per il condomino che intende impugnare una delibera assembleare. La domanda di mediazione interrompe la decadenza ex art. 1137 c.c. per una sola volta. Se il tentativo fallisce (esito negativo), il termine per proporre l'azione giudiziale ricomincia a decorrere dal deposito del verbale conclusivo presso la segreteria dell'organismo, ai sensi dell'art. 11, co. 4-bis, D.Lgs. 28/2010 introdotto dal D.Lgs. 216/2024.",
    riferimentiNormativi: ["Art. 1137 c.c.", "Art. 8, co. 2, D.Lgs. 28/2010", "Art. 11, co. 4-bis, D.Lgs. 28/2010", "D.Lgs. 216/2024"],
    temiChiave: ["impugnazione delibera", "decadenza", "esito negativo", "termine", "art. 11 co. 4-bis", "verbale conclusivo"],
    fonteUrl: "https://www.laleggepertutti.it/amp/758184_mediazione-condominiale-blocca-i-termini-per-impugnare-la-delibera",
  },

  {
    id: 27,
    organo: "Trib. Udine",
    tipoOrgano: "tribunale",
    numero: "",
    anno: 2026,
    data: "2026-04-01",
    titolo: "Sanzione art. 12-bis autonoma dall'esito del giudizio: chi vince ma diserta la mediazione è comunque condannato",
    categoria: "Mancata partecipazione",
    massima: "La sanzione prevista dall'art. 12-bis D.Lgs. 28/2010 per la mancata partecipazione ingiustificata alla mediazione ha natura autonoma rispetto all'esito del giudizio. Il presupposto della condanna è la condotta di mancata partecipazione, non la soccombenza nel merito. Anche la parte che risulta vincitrice nella causa principale può essere condannata al pagamento della sanzione se ha disertato senza giustificato motivo il procedimento di mediazione.",
    nota: "Conferma Trib. Milano 9925/2025. Il messaggio alle parti è chiaro: la mediazione non può essere ignorata strategicamente.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "D.Lgs. 149/2022"],
    temiChiave: ["art. 12-bis", "sanzione autonoma", "mancata partecipazione", "vincitore condannato", "giustificato motivo"],
    fonteUrl: "https://www.adrprogestitalia.it/post/sanzione-mediazione-prescrizione-mutuo",
  },

  {
    id: 28,
    organo: "Trib. Locri",
    tipoOrgano: "tribunale",
    numero: "592",
    anno: 2023,
    data: "2023-01-01",
    titolo: "Mancata partecipazione: condanna alle spese legali per aver costretto l'attore ad agire in giudizio",
    categoria: "Mancata partecipazione",
    massima: "Il convenuto che, non partecipando alla mediazione obbligatoria, costringe l'attore a procedere in giudizio, incorre in una condotta processuale scorretta che il giudice può valutare ai fini della liquidazione delle spese. Il giudice ha disposto il pagamento delle spese legali secondo i minimi tariffari, censurando il disinteresse per la risoluzione bonaria della controversia.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 91 c.p.c.", "Art. 96 c.p.c."],
    temiChiave: ["mancata partecipazione", "spese legali", "condotta processuale", "risoluzione bonaria", "sanzione"],
    fonteUrl: "https://www.officiumnpl.com",
  },

  {
    id: 29,
    organo: "C. App. Napoli",
    tipoOrgano: "corte_appello",
    numero: "3843",
    anno: 2022,
    data: "2022-01-01",
    titolo: "Delega alla partecipazione in mediazione: necessaria procura speciale sostanziale",
    categoria: "Procura sostanziale",
    massima: "La delega alla partecipazione in mediazione richiede una procura speciale sostanziale che attribuisca al delegato i poteri di disporre dei diritti controversi, di negoziare e di sottoscrivere l'accordo. La sola procura alle liti è insufficiente. La Corte d'Appello di Napoli conferma l'orientamento di Cass. 8473/2019, precisando che la procura deve avere come oggetto specifico la partecipazione alla mediazione.",
    riferimentiNormativi: ["Art. 8 D.Lgs. 28/2010", "Cass. 8473/2019"],
    temiChiave: ["delega mediazione", "procura sostanziale", "procura alle liti", "Corte d'Appello Napoli", "poteri dispositivi"],
    fonteUrl: "https://www.officiumnpl.com",
  },

  {
    id: 30,
    organo: "Trib. Torino, Sez. VIII",
    tipoOrgano: "tribunale",
    numero: "1662",
    anno: 2019,
    data: "2019-04-12",
    titolo: "Partecipazione senza procura sostanziale: improcedibilità della domanda giudiziale",
    categoria: "Procura sostanziale",
    massima: "Qualora l'attore che ha promosso il tentativo di mediazione obbligatoria si sia fatto rappresentare da un soggetto privo di valida procura sostanziale, il tentativo di mediazione è da ritenersi non validamente esperito, con conseguente improcedibilità della domanda giudiziale.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["procura sostanziale", "improcedibilità", "mediazione obbligatoria", "partecipazione non valida"],
    fonteUrl: "https://www.brocardi.it",
  },

  {
    id: 31,
    organo: "Trib. Roma, Sez. V",
    tipoOrgano: "tribunale",
    numero: "7981",
    anno: 2020,
    data: "2020-06-03",
    titolo: "Mancata procura sostanziale: tentativo tamquam non esset",
    categoria: "Procura sostanziale",
    massima: "La partecipazione alla mediazione da parte di un soggetto sprovvisto di procura sostanziale equivale alla mancata partecipazione. Il tentativo di mediazione si considera come non avvenuto (tamquam non esset) e la successiva azione giudiziale è improcedibile per mancato esperimento della condizione di procedibilità.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Cass. 8473/2019", "Cass. 18068/2019"],
    temiChiave: ["procura sostanziale", "tamquam non esset", "improcedibilità", "Roma", "mediazione obbligatoria"],
    fonteUrl: "https://www.brocardi.it",
  },

  {
    id: 32,
    organo: "Trib. Napoli, Sez. VI",
    tipoOrgano: "tribunale",
    numero: "1167",
    anno: 2021,
    data: "2021-02-05",
    titolo: "Procura sostanziale: conferma improcedibilità per assenza in mediazione senza delega valida",
    categoria: "Procura sostanziale",
    massima: "Nella mediazione obbligatoria, la partecipazione di un soggetto sprovvisto di procura sostanziale non soddisfa la condizione di procedibilità. Il giudice deve dichiarare l'improcedibilità della domanda giudiziale proposta senza valido esperimento della mediazione.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Cass. 8473/2019", "Cass. 18068/2019"],
    temiChiave: ["procura sostanziale", "improcedibilità", "Napoli", "mediazione obbligatoria"],
    fonteUrl: "https://www.brocardi.it",
  },

  {
    id: 33,
    organo: "Trib. Napoli Nord, Sez. I",
    tipoOrgano: "tribunale",
    numero: "2844",
    anno: 2024,
    data: "2024-06-11",
    titolo: "Divisione beni ereditari: avvocato delegato deve munirsi di procura sostanziale",
    categoria: "Procura sostanziale",
    massima: "In una causa di divisione di beni ereditari soggetta a mediazione obbligatoria, l'avvocato delegato a partecipare alla mediazione in luogo del proprio assistito deve essere munito di procura speciale sostanziale. La mera procura alle liti non è sufficiente. Il delegato deve avere il potere di disporre dei diritti successori oggetto della controversia.",
    riferimentiNormativi: ["Art. 5, co. 1, D.Lgs. 28/2010", "Art. 8, co. 4, D.Lgs. 28/2010", "Cass. 8473/2019"],
    temiChiave: ["successioni", "divisione ereditaria", "procura sostanziale", "avvocato delegato", "diritti successori"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it/lavvocato-in-mediazione-deve-avere-la-procura-sostanziale/",
  },

  {
    id: 34,
    organo: "Trib. Firenze",
    tipoOrgano: "tribunale",
    numero: "",
    anno: 2015,
    data: "2015-06-01",
    titolo: "Prime pronunce fiorentine sulla procura sostanziale e partecipazione effettiva in mediazione",
    categoria: "Condizione di procedibilità",
    massima: "Il Tribunale di Firenze, con orientamento anticipatore poi recepito dalla Cassazione (n. 8473/2019) e dalla Riforma Cartabia, ha affermato che la partecipazione alla mediazione deve essere effettiva e non formale. La parte deve presentarsi personalmente o tramite soggetto munito di pieni poteri dispositivi. La semplice presenza di un avvocato senza procura sostanziale non soddisfa la condizione di procedibilità.",
    nota: "Giurisprudenza fiorentina precorritrice. I principi elaborati sono stati poi recepiti dalla Cassazione nel 2019 e dal legislatore con la Riforma Cartabia nel 2022.",
    riferimentiNormativi: ["Art. 5 D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["Firenze", "giurisprudenza precorritrice", "partecipazione effettiva", "procura sostanziale", "formalismo"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 35,
    organo: "Trib. Varese",
    tipoOrgano: "tribunale",
    numero: "",
    anno: 2016,
    data: "2016-01-01",
    titolo: "Elenco materie obbligatorie tassativo: no estensione analogica",
    categoria: "Condizione di procedibilità",
    massima: "L'elenco delle materie soggette a mediazione obbligatoria ex art. 5 D.Lgs. 28/2010 è tassativo e non può essere esteso ad altre ipotesi per analogia. Per ogni controversia non rientrante nell'elenco, la mediazione resta facoltativa e non costituisce condizione di procedibilità. Lo confermano varie sentenze di tribunali del Nord Italia (Varese, Pavia, Bergamo).",
    riferimentiNormativi: ["Art. 5, co. 1, D.Lgs. 28/2010"],
    temiChiave: ["materie obbligatorie", "elenco tassativo", "analogia", "mediazione facoltativa", "procedibilità"],
    fonteUrl: "https://www.avvocatoticozzi.it",
  },

  {
    id: 36,
    organo: "Trib. Napoli Nord",
    tipoOrgano: "tribunale",
    numero: "3268",
    anno: 2025,
    data: "2025-07-01",
    titolo: "D.I. condominiale: mediazione tardiva del creditore opposto = improcedibilità della domanda monitoria",
    categoria: "Decreto ingiuntivo",
    massima: "In materia condominiale, il creditore opposto che aziona la mediazione tardivamente — dopo la prima udienza e in fase di riserva per la decisione — compie un'iniziativa processualmente inutile: la mediazione tardiva non soddisfa la condizione di procedibilità. Il giudice dichiara l'improcedibilità della domanda monitoria e revoca il decreto ingiuntivo.",
    riferimentiNormativi: ["Art. 5-bis D.Lgs. 28/2010", "Cass. SS.UU. 19596/2020"],
    temiChiave: ["condominio", "decreto ingiuntivo", "mediazione tardiva", "improcedibilità", "revoca decreto"],
    fonteUrl: "https://www.mondoadr.it/giurisprudenza_art/opposizione-a-di-senza-mediazione-domanda-monitoria-improcedibile/",
  },

  {
    id: 37,
    organo: "Trib. Trani",
    tipoOrgano: "tribunale",
    numero: "",
    anno: 2025,
    data: "2025-06-19",
    titolo: "Art. 12-bis: sanzione verso lo Stato applicata; indennità alla controparte esclusa per soccombenza parziale",
    categoria: "Mancata partecipazione",
    massima: "La sanzione prevista dall'art. 12-bis D.Lgs. 28/2010 verso lo Stato (doppio c.u.) è applicata al soggetto assente in mediazione senza giustificato motivo. La sanzione a favore della controparte (somma equitativa) non viene concessa quando vi è una soccombenza solo parziale nel merito, richiedendo questo tipo di sanzione anche l'elemento della soccombenza.",
    nota: "Chiarisce la distinzione tra le due sanzioni dell'art. 12-bis: quella verso lo Stato è automatica; quella verso la parte richiede anche la soccombenza.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 116, co. 2, c.p.c."],
    temiChiave: ["art. 12-bis", "sanzione allo Stato", "soccombenza parziale", "sanzione equitativa", "distinguo"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it/mediazione-civile-le-conseguenze-della-mancata-partecipazione/",
  },

  {
    id: 38,
    organo: "Trib. Genova",
    tipoOrgano: "tribunale",
    numero: "",
    anno: 2024,
    data: "2024-12-01",
    titolo: "Sanzioni mancata partecipazione: applicazione rigorosa art. 12-bis post-Cartabia",
    categoria: "Mancata partecipazione",
    massima: "Il Tribunale di Genova applica rigorosamente le sanzioni previste dall'art. 12-bis D.Lgs. 28/2010 nei confronti della parte che non si è presentata senza giustificato motivo al primo incontro di mediazione. La riforma Cartabia ha inteso rafforzare l'effettività della mediazione mediante un regime sanzionatorio significativo, applicabile a prescindere dall'esito della causa.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "D.Lgs. 149/2022"],
    temiChiave: ["Genova", "sanzioni", "art. 12-bis", "mancata partecipazione", "primo incontro"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 39,
    organo: "Trib. Venezia",
    tipoOrgano: "tribunale",
    numero: "1780",
    anno: 2025,
    data: "2025-04-07",
    titolo: "Impugnazione delibera condominiale nulla: mediazione obbligatoria anche in questo caso",
    categoria: "Condominio",
    massima: "La mediazione costituisce condizione di procedibilità obbligatoria per le controversie condominiali anche nell'ipotesi di impugnazione di delibera nulla, purché sussista un interesse concreto e attuale. L'art. 5 D.Lgs. 28/2010 non distingue tra nullità e annullabilità della delibera: in entrambi i casi il previo tentativo di mediazione è necessario.",
    riferimentiNormativi: ["Art. 5, co. 1, D.Lgs. 28/2010", "Art. 1137 c.c."],
    temiChiave: ["delibera nulla", "delibera annullabile", "condominio", "mediazione obbligatoria", "interesse ad agire"],
    fonteUrl: "https://www.laleggepertutti.it/787117_impugnazione-delibera-nulla-la-mediazione-e-obbligatoria",
  },

  {
    id: 40,
    organo: "Trib. Roma",
    tipoOrgano: "tribunale",
    numero: "1633",
    anno: 2026,
    data: "2026-02-03",
    titolo: "Accordo mediazione condominiale: vincolante se la delibera di approvazione non è impugnata",
    categoria: "Efficacia accordo",
    massima: "L'accordo di mediazione condominiale è definitivamente vincolante per tutti i condomini quando la delibera assembleare che lo ha approvato non viene impugnata nei termini perentori di cui all'art. 1137 c.c. Il condomino dissenziente che non ha impugnato tempestivamente la delibera non può successivamente contestare la vincolatività dell'accordo.",
    riferimentiNormativi: ["Art. 5-ter D.Lgs. 28/2010", "Art. 1136 c.c.", "Art. 1137 c.c."],
    temiChiave: ["accordo mediazione", "condominio", "delibera approvazione", "impugnazione", "vincolatività", "termine 30 giorni"],
    fonteUrl: "https://www.assiac.it/rassegna-giurisprudenziale-2025/",
  },

  {
    id: 41,
    organo: "Trib. Arezzo",
    tipoOrgano: "tribunale",
    numero: "67",
    anno: 2025,
    data: "2025-02-01",
    titolo: "Mediazione demandata: convocazione via PEC al difensore costituito in giudizio è valida",
    categoria: "Mediazione demandata",
    massima: "In mediazione demandata, la convocazione trasmessa dall'organismo tramite PEC al difensore già costituito in giudizio è valida come comunicazione 'con ogni mezzo idoneo' ex art. 8 D.Lgs. 28/2010. Il difensore, in virtù dei doveri deontologici di informare il proprio assistito, è il soggetto più idoneo a ricevere la comunicazione. La partecipazione con trattazione nel merito soddisfa la condizione di procedibilità.",
    riferimentiNormativi: ["Art. 8 D.Lgs. 28/2010", "Art. 5-quater D.Lgs. 28/2010", "Cass. 34714/2023"],
    temiChiave: ["mediazione demandata", "convocazione PEC", "difensore", "comunicazione idonea", "procedibilità"],
    fonteUrl: "https://www.adrprogestitalia.it/post/mediazione-arezzo-67-2025",
  },

  {
    id: 42,
    organo: "Trib. Catania",
    tipoOrgano: "tribunale",
    numero: "2505",
    anno: 2025,
    data: "2025-05-12",
    titolo: "Mancata partecipazione in opposizione D.I.: non causa improcedibilità dell'opposizione",
    categoria: "Mancata partecipazione",
    massima: "L'assenza ingiustificata della parte opponente alla mediazione nel giudizio di opposizione a decreto ingiuntivo non determina l'improcedibilità dell'opposizione stessa. In applicazione di Cass. SS.UU. 19596/2020, l'improcedibilità colpisce la domanda monitoria del creditore, non l'opposizione. Tuttavia, la mancata partecipazione ingiustificata comporta la condanna al versamento allo Stato di una somma pari al doppio del contributo unificato.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 5-bis D.Lgs. 28/2010", "Cass. SS.UU. 19596/2020"],
    temiChiave: ["opposizione decreto ingiuntivo", "mancata partecipazione", "improcedibilità", "doppio c.u.", "art. 12-bis"],
    fonteUrl: "https://www.101mediatori.it/sentenze-mediazione/nel-giudizio-di-opposizione-a-decreto-ingiuntivo-l-assenza-ingiustificata-della-parte-opponente-alla-mediazione-non-determina-l-improcedibilita-dell-1660.aspx",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NUOVE PRONUNCE 2024-2026
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 43,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "4133",
    anno: 2024,
    data: "2024-02-16",
    titolo: "Termine 15 giorni per mediazione demandata: non è perentorio",
    categoria: "Mediazione demandata",
    massima: "In tema di mediazione demandata dal giudice, il termine di 15 giorni assegnato per l'avvio del procedimento non ha natura perentoria. Ai fini della soddisfazione della condizione di procedibilità è sufficiente che il primo incontro davanti al mediatore si svolga effettivamente entro l'udienza fissata per il rinvio, indipendentemente dal rispetto del termine indicato nell'ordinanza.",
    principioDiDiritto: "Nel caso di mediazione demandata dal giudice, ciò che rileva ai fini della condizione di procedibilità è l'utile esperimento della procedura di mediazione — inteso come primo incontro delle parti conclusosi senza accordo — entro l'udienza di rinvio, e non l'avvio della stessa nel termine di quindici giorni indicato dal giudice con l'ordinanza.",
    nota: "Conferma e consolida l'orientamento che privilegia la sostanza sull'adempimento formale del termine di avvio. Già anticipato da Cass. SS.UU. 19596/2020.",
    riferimentiNormativi: ["Art. 5-quater D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010"],
    temiChiave: ["mediazione demandata", "termine 15 giorni", "non perentorio", "condizione di procedibilità", "udienza di rinvio"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 44,
    organo: "Trib. Napoli Nord, Sez. I",
    tipoOrgano: "tribunale",
    numero: "2844",
    anno: 2024,
    data: "2024-06-11",
    titolo: "Avvocato delegato in mediazione: necessaria procura sostanziale specifica — conferma post-Cartabia",
    categoria: "Procura sostanziale",
    massima: "L'avvocato che partecipa alla mediazione in sostituzione del proprio assistito deve essere munito di apposita procura sostanziale, distinta dalla procura alle liti. La sola procura processuale, anche se amplissima, non è idonea a conferire i poteri dispositivi necessari per la partecipazione alla mediazione. Il difensore che si presenta senza tale procura non soddisfa la condizione di procedibilità.",
    nota: "Ribadisce Cass. 8473/2019 e 20643/2023. Anticipa la svolta di Cass. 9608/2026.",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010", "Art. 5, co. 1, D.Lgs. 28/2010", "Cass. 8473/2019", "Cass. 20643/2023"],
    temiChiave: ["procura sostanziale", "avvocato delegato", "procura alle liti", "partecipazione personale", "procedibilità"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it/lavvocato-in-mediazione-deve-avere-la-procura-sostanziale/",
  },

  {
    id: 45,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "18485",
    anno: 2024,
    data: "2024-07-04",
    titolo: "Partecipazione sostanziale della parte alla mediazione: conferma dell'orientamento",
    categoria: "Condizione di procedibilità",
    massima: "La condizione di procedibilità della mediazione obbligatoria richiede una partecipazione sostanziale della parte, non meramente formale. Non è sufficiente la presenza simbolica o l'invio di un soggetto privo di effettiva capacità decisionale. La parte deve comparire personalmente o tramite rappresentante munito di poteri reali di disposizione del diritto controverso.",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010", "Art. 5, co. 1, D.Lgs. 28/2010"],
    temiChiave: ["partecipazione sostanziale", "condizione di procedibilità", "presenza personale", "procura sostanziale"],
    fonteUrl: "https://www.mondoadr.it",
  },

  {
    id: 46,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "2119",
    anno: 2025,
    data: "2025-01-30",
    titolo: "Amministratore di condominio: nomina avvocato senza delibera per cause nelle attribuzioni ex art. 1131 c.c.",
    categoria: "Condominio",
    massima: "La necessità dell'autorizzazione dell'assemblea condominiale per la costituzione in giudizio dell'amministratore quale rappresentante del condominio va riferita solo alle cause che esorbitino dalle attribuzioni dell'amministratore ai sensi dell'art. 1131 c.c. Per le questioni rientranti nelle attribuzioni ordinarie (riscossione contributi, manutenzione ordinaria, atti conservativi delle parti comuni), l'amministratore può nominare un avvocato e stare in giudizio senza autorizzazione assembleare.",
    nota: "Da coordinare con art. 5-ter D.Lgs. 28/2010: in mediazione l'amministratore è sempre legittimato senza delibera preventiva; la delibera è richiesta solo per approvare l'accordo o la proposta del mediatore.",
    riferimentiNormativi: ["Art. 1131 c.c.", "Art. 1135 c.c.", "Art. 5-ter D.Lgs. 28/2010"],
    temiChiave: ["amministratore condominio", "delibera assembleare", "attribuzioni art. 1131", "nomina avvocato", "rappresentanza condominiale"],
    fonteUrl: "https://www.mondoadr.it/mediazione-e-liti-condominiali-la-scelta-dellavvocato-a-chi-spetta/",
  },

  {
    id: 47,
    organo: "Trib. Roma, Sez. V",
    tipoOrgano: "tribunale",
    numero: "172",
    anno: 2025,
    data: "2025-01-04",
    titolo: "Impugnazione delibera assembleare: termine soggetto a sospensione feriale; durata mediazione no",
    categoria: "Prescrizione e decadenza",
    massima: "Il termine di trenta giorni per l'impugnazione della delibera assembleare ex art. 1137 c.c. è soggetto alla sospensione feriale dei termini (L. 742/1969), in quanto termine di introduzione del processo. La durata della mediazione, invece, non è soggetta a sospensione feriale, rimanendo soggetta al termine di sei mesi (salvo proroga) ex art. 6 D.Lgs. 28/2010. Il D.Lgs. 216/2024 ha introdotto l'art. 11, co. 4-bis: quando la mediazione si conclude senza conciliazione, la domanda giudiziale deve essere proposta entro lo stesso termine di decadenza decorrente dal deposito del verbale conclusivo.",
    riferimentiNormativi: ["Art. 1137 c.c.", "Art. 6 D.Lgs. 28/2010", "Art. 11, co. 4-bis D.Lgs. 28/2010", "L. 742/1969", "D.Lgs. 216/2024"],
    temiChiave: ["impugnazione delibera", "sospensione feriale", "termine decadenza", "art. 1137 c.c.", "art. 11 co. 4-bis"],
    fonteUrl: "https://www.adrintesa.it/impugnazione-di-delibera-assembleare-mediazione",
  },

  {
    id: 48,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "14676",
    anno: 2025,
    data: "2025-05-31",
    titolo: "Procura sostanziale per mediazione: non richiede riferimento alla singola controversia né autenticazione notarile",
    categoria: "Procura sostanziale",
    massima: "La procura sostanziale conferita per la partecipazione alla mediazione non deve necessariamente contenere un riferimento espresso alla singola controversia oggetto della procedura. Non esiste alcun argomento normativo, né letterale né sistematico, che imponga questa specificità. Inoltre, la procura sostanziale per la mediazione non richiede autenticazione notarile, salvo il solo caso in cui l'accordo riguardi atti soggetti a trascrizione ex art. 2643 c.c. Le condizioni di procedibilità non devono essere interpretate in modo da rendere eccessivamente difficoltoso l'accesso alla giurisdizione, ai sensi dell'art. 47 della Carta dei diritti fondamentali UE.",
    nota: "Chiarimento fondamentale: la procura sostanziale può essere generale e non notarile. Da coordinare con Cass. 9608/2026 che esclude però la cumulabilità difensore/parte.",
    riferimentiNormativi: ["Art. 8, co. 4, D.Lgs. 28/2010", "Art. 2643 c.c.", "Art. 1392 c.c.", "Art. 47 Carta diritti fondamentali UE", "CGUE Alassini 18/3/2010", "CGUE Menini 14/6/2017"],
    temiChiave: ["procura sostanziale", "autenticazione notarile", "forma procura", "accesso alla giurisdizione", "principio Alassini"],
    fonteUrl: "https://studiolegaletmc.it/2026/02/nuovo-layout-articolo-12/",
  },

  {
    id: 49,
    organo: "Trib. Torino, Sez. civ.",
    tipoOrgano: "tribunale",
    numero: "2181",
    anno: 2025,
    data: "2025-05-05",
    titolo: "Mancata partecipazione: età avanzata e malattia non giustificano l'assenza senza documentazione medica",
    categoria: "Mancata partecipazione",
    massima: "La giustificazione della mancata comparizione in mediazione fondata su età avanzata e stato di malattia non è idonea se le condizioni di salute non sono documentate da certificazione medica specifica. La parte che non può fisicamente comparire ha l'obbligo di conferire procura speciale sostanziale al difensore o a un terzo per partecipare in sua vece. La mancata partecipazione ingiustificata comporta la sanzione ex art. 12-bis D.Lgs. 28/2010 indipendentemente dall'esito del giudizio nel merito.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 8, co. 4, D.Lgs. 28/2010"],
    temiChiave: ["mancata partecipazione", "giustificato motivo", "malattia", "sanzione art. 12-bis", "procura sostanziale"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it/mediazione-civile-le-conseguenze-della-mancata-partecipazione/",
  },

  {
    id: 50,
    organo: "Trib. Napoli, Sez. civ.",
    tipoOrgano: "tribunale",
    numero: "3268",
    anno: 2025,
    data: "2025-10-01",
    titolo: "Opposizione D.I. condominiale: mediazione tardiva del creditore = improcedibilità e revoca del decreto",
    categoria: "Decreto ingiuntivo",
    massima: "Nei giudizi di opposizione a decreto ingiuntivo in materia condominiale, l'onere di attivare la mediazione grava sul creditore opposto (attore in senso sostanziale). Il creditore che attivi la mediazione in fase di riserva per la decisione, ben dopo la prima udienza, compie un'iniziativa colpevolmente tardiva: la mediazione non soddisfa la condizione di procedibilità e il giudice deve dichiarare l'improcedibilità della domanda monitoria e revocare il decreto ingiuntivo.",
    principioDiDiritto: "La mediazione attivata dal creditore opposto dopo la prima udienza — e non entro il termine ivi fissato — è tardiva e non soddisfa la condizione di procedibilità ex art. 5-bis D.Lgs. 28/2010.",
    riferimentiNormativi: ["Art. 5-bis D.Lgs. 28/2010", "Cass. SS.UU. 19596/2020", "Art. 648 c.p.c.", "Art. 649 c.p.c."],
    temiChiave: ["decreto ingiuntivo", "opposizione", "creditore opposto", "mediazione tardiva", "improcedibilità", "revoca decreto"],
    fonteUrl: "https://www.mondoadr.it/giurisprudenza_art/opposizione-a-di-senza-mediazione-domanda-monitoria-improcedibile/",
  },

  {
    id: 51,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "25446",
    anno: 2025,
    data: "2025-09-16",
    titolo: "Rendiconto condominiale: sistema misto cassa/competenza obbligatorio; accordo di mediazione vincolante solo se ratificato dall'assemblea",
    categoria: "Condominio",
    massima: "Il rendiconto condominiale non può essere redatto esclusivamente secondo il criterio di cassa, ma deve seguire un sistema misto tra cassa e competenza. L'accordo di mediazione che preveda criteri contabili diversi non è vincolante per il condominio in assenza di ratifica assembleare: l'assemblea resta l'organo sovrano per l'approvazione o modifica dei criteri contabili.",
    nota: "Ribadisce che gli accordi di mediazione condominiale producono effetti vincolanti solo dopo la ratifica assembleare ex art. 5-ter D.Lgs. 28/2010.",
    riferimentiNormativi: ["Art. 5-ter D.Lgs. 28/2010", "Art. 1130 c.c.", "Art. 1135 c.c.", "Art. 1136 c.c."],
    temiChiave: ["rendiconto condominiale", "sistema misto", "accordo mediazione", "ratifica assembleare", "criteri contabili"],
    fonteUrl: "https://www.assiac.it/rassegna-giurisprudenziale-2025/",
  },

  {
    id: 52,
    organo: "Trib. Milano, Sez. VI",
    tipoOrgano: "tribunale",
    numero: "9925",
    anno: 2025,
    data: "2025-12-22",
    titolo: "Art. 12-bis: sanzioni pubblicistiche e privatistiche cumulabili; condanna autonoma dall'esito del merito",
    categoria: "Mancata partecipazione",
    massima: "L'art. 12-bis D.Lgs. 28/2010 prevede un regime sanzionatorio autonomo rispetto all'esito del giudizio nel merito. Le sanzioni — condanna verso lo Stato (doppio c.u.) e condanna verso la controparte (somma equitativa) — sono cumulabili e prescindono dalla soccombenza nella causa principale. Anche la parte che vince nel merito può essere condannata ex art. 12-bis se ha disertato ingiustificatamente la mediazione.",
    nota: "Pronuncia paradigmatica. La sanzione ha natura autonoma: il presupposto è la mancata partecipazione ingiustificata, non la soccombenza.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 116, co. 2, c.p.c.", "D.Lgs. 149/2022"],
    temiChiave: ["art. 12-bis", "sanzioni cumulo", "doppio contributo unificato", "sanzione equitativa", "autonomia sanzione", "repeat players"],
    fonteUrl: "https://meditaliarete.it/la-mancata-partecipazione-alla-mediazione-obbligatoria-e-le-conseguenze-sanzionatorie-ex-art-12-bis-d-lgs-28-2010/",
  },

  {
    id: 53,
    organo: "Trib. Roma",
    tipoOrgano: "tribunale",
    numero: "1633",
    anno: 2026,
    data: "2026-02-03",
    titolo: "Accordo di mediazione condominiale vincolante se delibera di approvazione non impugnata tempestivamente",
    categoria: "Efficacia accordo",
    massima: "L'accordo di mediazione condominiale è vincolante nei confronti di tutta la compagine condominiale quando la delibera assembleare che lo ha approvato non viene impugnata tempestivamente nei termini di cui all'art. 1137 c.c. A fronte di un dissenso espresso in assemblea non seguito dall'impugnazione della deliberazione entro i termini perentori, la conciliazione deve considerarsi definitivamente vincolante per tutti i condomini.",
    nota: "Da coordinare con art. 5-ter D.Lgs. 28/2010: la delibera di approvazione dell'accordo è necessaria; una volta approvata e non impugnata, l'accordo è definitivamente vincolante.",
    riferimentiNormativi: ["Art. 5-ter D.Lgs. 28/2010", "Art. 1137 c.c.", "Art. 1136 c.c."],
    temiChiave: ["accordo mediazione condominiale", "delibera approvazione", "impugnazione delibera", "vincolatività accordo", "termine art. 1137"],
    fonteUrl: "https://www.assiac.it/rassegna-giurisprudenziale-2025/",
  },

  {
    id: 54,
    organo: "Cass. civ., Sez. II",
    tipoOrgano: "cassazione",
    numero: "2709",
    anno: 2026,
    data: "2026-02-07",
    titolo: "Deroga criteri di riparto condominiale: nulla senza consenso unanime",
    categoria: "Condominio",
    massima: "Quando l'assemblea introduce una deroga generale ai criteri legali di riparto delle spese condominiali esonerando un condomino dagli oneri, senza il consenso unanime di tutti i partecipanti, la delibera è nulla per violazione dell'art. 1123 c.c. La nullità non è sanabile dalla mancata impugnazione nei termini ex art. 1137 c.c., applicabile solo alle delibere annullabili.",
    riferimentiNormativi: ["Art. 1123 c.c.", "Art. 1135 c.c.", "Art. 1136 c.c.", "Art. 1137 c.c."],
    temiChiave: ["deroga criteri riparto", "unanimità", "delibera nulla", "spese condominiali", "art. 1123 c.c."],
    fonteUrl: "https://www.assiac.it/rassegna-giurisprudenziale-2025/",
  },

  {
    id: 55,
    organo: "Trib. Torino, Sez. civ.",
    tipoOrgano: "tribunale",
    numero: "2181",
    anno: 2025,
    data: "2025-05-05",
    titolo: "Sanzione art. 12-bis: malattia non documentata non è giustificato motivo di assenza",
    categoria: "Mancata partecipazione",
    massima: "Il Tribunale di Torino conferma che le condizioni di salute invocate come giustificato motivo per l'assenza alla mediazione devono essere documentate da certificazione medica specifica. La sola invocazione generica di malattia o età avanzata non è sufficiente. La parte impossibilitata deve conferire procura sostanziale al difensore o a un terzo. L'assenza ingiustificata comporta sanzione ex art. 12-bis indipendentemente dall'esito nel merito.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 8, co. 4, D.Lgs. 28/2010"],
    temiChiave: ["malattia", "giustificato motivo", "documentazione medica", "sanzione", "art. 12-bis", "Torino"],
    fonteUrl: "https://www.osservatorioconflitticonciliazione.it/mediazione-civile-le-conseguenze-della-mancata-partecipazione/",
  },

  {
    id: 56,
    organo: "Trib. Catania, Sez. IV",
    tipoOrgano: "tribunale",
    numero: "2505",
    anno: 2025,
    data: "2025-05-12",
    titolo: "Opposizione a D.I.: mancata partecipazione = doppio c.u., non improcedibilità dell'opposizione",
    categoria: "Decreto ingiuntivo",
    massima: "Nel giudizio di opposizione a decreto ingiuntivo, l'assenza ingiustificata della parte opponente alla mediazione non determina l'improcedibilità dell'opposizione stessa. La pronuncia di improcedibilità ex SS.UU. 19596/2020 riguarda la domanda monitoria del creditore, non l'opposizione. La mancata partecipazione comporta invece la condanna al doppio del contributo unificato ex art. 12-bis.",
    principioDiDiritto: "L'assenza ingiustificata dell'opponente alla mediazione nel giudizio di opposizione a D.I. non determina improcedibilità dell'opposizione, ma la condanna al doppio del c.u. ex art. 12-bis D.Lgs. 28/2010.",
    riferimentiNormativi: ["Art. 12-bis D.Lgs. 28/2010", "Art. 5-bis D.Lgs. 28/2010", "Cass. SS.UU. 19596/2020"],
    temiChiave: ["opposizione decreto ingiuntivo", "mancata partecipazione", "improcedibilità", "doppio contributo unificato", "art. 12-bis"],
    fonteUrl: "https://www.101mediatori.it/sentenze-mediazione/nel-giudizio-di-opposizione-a-decreto-ingiuntivo-l-assenza-ingiustificata-della-parte-opponente-alla-mediazione-non-determina-l-improcedibilita-dell-1660.aspx",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRONUNCE 2026 — RECENTISSIME
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 57,
    organo: "Cass. civ., Sez. III",
    tipoOrgano: "cassazione",
    numero: "9608",
    anno: 2026,
    data: "2026-04-15",
    titolo: "FONDAMENTALE — Il difensore non può cumulare i ruoli di parte e di assistente: la sola presenza dell'avvocato non soddisfa la condizione di procedibilità",
    categoria: "Partecipazione personale",
    massima: "La lettura coordinata degli artt. 5, co. 1-bis, e 8 del D.Lgs. 28/2010 — che prevedono che le parti esperiscano il procedimento di mediazione con l'assistenza degli avvocati — implica una distinzione strutturale tra la parte che partecipa e il difensore che la assiste. Ne discende che la comparizione del solo avvocato, ancorché munito di procura sostanziale, non è idonea a soddisfare la condizione di procedibilità, non potendo il difensore cumulare in sé i distinti ruoli di parte e di suo assistente. La mancata comparizione della parte chiamata non rende improcedibile la domanda della parte onerata: rileva solo sul piano sanzionatorio ex art. 12-bis e probatorio ex art. 116, co. 2, c.p.c.",
    principioDiDiritto: "Nel procedimento di mediazione obbligatoria o demandata: (1) la presenza del solo difensore, ancorché munito di procura sostanziale, non soddisfa la condizione di procedibilità, poiché parte e avvocato sono figure strutturalmente distinte e non cumulabili; (2) la mancata comparizione della parte chiamata non determina l'improcedibilità della domanda della parte onerata, rilevando solo sul piano sanzionatorio e probatorio.",
    nota: "Ordinanza del 15 aprile 2026 — RECENTISSIMA. Cambio di paradigma: non basta munire il difensore di procura sostanziale. La parte deve partecipare tramite soggetto DIVERSO dall'avvocato che la assiste (o personalmente). Il delegato può essere qualsiasi terzo — anche un altro avvocato non costituito nel procedimento — ma non il difensore che svolge contemporaneamente il ruolo di assistente legale. Da coordinare con Cass. 14676/2025 sulla forma della procura.",
    riferimentiNormativi: ["Art. 5, co. 1-bis, D.Lgs. 28/2010", "Art. 8 D.Lgs. 28/2010", "Art. 12-bis D.Lgs. 28/2010", "Art. 116, co. 2, c.p.c.", "Cass. 8473/2019", "Cass. 14676/2025"],
    temiChiave: ["difensore non può essere parte", "cumulo ruoli", "partecipazione personale", "condizione di procedibilità", "assenza chiamato", "distinzione parte-difensore", "procura sostanziale"],
    fonteUrl: "https://www.mondoadr.it/giurisprudenza_art/mediazione-la-cassazione-chiude-al-formalismo-difensivo-lassenza-del-chiamato-non-invalida-la-procedura-ma-apre-un-fronte-nuovo-sulla-presenza-della-parte/",
  },

];

// ─── FUNZIONE DI RICERCA ──────────────────────────────────────────────────────

export interface FiltriRicerca {
  testoLibero?: string;
  categoria?: string;
  tipoOrgano?: string;
  annoMin?: number;
  annoMax?: number;
}

export function cercaSentenze(filtri: FiltriRicerca): Sentenza[] {
  let risultati = [...sentenze];

  if (filtri.testoLibero) {
    const q = filtri.testoLibero.toLowerCase();
    risultati = risultati.filter(s =>
      s.titolo.toLowerCase().includes(q) ||
      s.massima.toLowerCase().includes(q) ||
      (s.principioDiDiritto?.toLowerCase().includes(q) ?? false) ||
      (s.nota?.toLowerCase().includes(q) ?? false) ||
      s.numero.includes(q) ||
      s.organo.toLowerCase().includes(q) ||
      s.riferimentiNormativi.some(r => r.toLowerCase().includes(q)) ||
      s.temiChiave.some(t => t.toLowerCase().includes(q))
    );
  }

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

  return risultati.sort((a, b) => b.anno - a.anno || b.numero.localeCompare(a.numero));
}
