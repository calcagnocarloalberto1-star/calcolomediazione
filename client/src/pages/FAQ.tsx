import { useEffect } from "react";
import { Link } from "wouter";
import { HelpCircle, Euro, Brain, ArrowLeft, TrendingUp, Shield, FileText, Scale, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface FAQSection {
  icon: React.ElementType;
  title: string;
  badge?: string;
  questions: { q: string; a: string }[];
}

const faqSections: FAQSection[] = [
  {
    icon: HelpCircle,
    title: "Mediazione Civile - Domande Generali",
    questions: [
      {
        q: "Cos'è la mediazione civile e commerciale?",
        a: "La mediazione civile e commerciale è un procedimento stragiudiziale di risoluzione delle controversie, disciplinato dal D.Lgs. 28/2010, in cui un terzo imparziale (il mediatore) assiste le parti nel trovare un accordo amichevole. Il mediatore non decide la controversia, ma facilita la comunicazione tra le parti per raggiungere una soluzione condivisa. La mediazione può essere volontaria, obbligatoria (come condizione di procedibilità della domanda giudiziale) o demandata dal giudice.",
      },
      {
        q: "Quando è obbligatoria la mediazione?",
        a: "La mediazione è obbligatoria come condizione di procedibilità della domanda giudiziale nelle materie elencate dall'art. 5, comma 1, del D.Lgs. 28/2010, come modificato dalla Riforma Cartabia (D.Lgs. 149/2022). Chi intende esercitare un'azione giudiziaria in queste materie deve prima tentare la mediazione. L'esperimento della mediazione è condizione di procedibilità della domanda, e l'improcedibilità deve essere eccepita dal convenuto o rilevata dal giudice non oltre la prima udienza.",
      },
      {
        q: "Quali sono le materie soggette a mediazione obbligatoria?",
        a: "Le materie soggette a mediazione obbligatoria includono: condominio, diritti reali, divisione, successioni ereditarie, patti di famiglia, locazione, comodato, affitto di aziende, risarcimento del danno derivante da responsabilità medica e sanitaria, risarcimento del danno derivante da diffamazione con il mezzo della stampa o altro mezzo di pubblicità, contratti assicurativi, bancari e finanziari, associazione in partecipazione, consorzio, franchising, opera, rete, somministrazione, società di persone, e subfornitura. Dal 30 giugno 2023 la Riforma Cartabia ha ampliato l'elenco originario.",
      },
     {
  q: "Cosa cambia per il condominio con la Riforma Cartabia? L'amministratore deve ottenere una delibera?",
  a: "Sì, ma solo per approvare l'accordo o la proposta del mediatore — non più per partecipare alla mediazione. La Riforma Cartabia (D.Lgs. 149/2022) ha introdotto l'art. 5-ter del D.Lgs. 28/2010, in vigore dal 30 giugno 2023, che prevede: «L'amministratore del condominio è legittimato ad attivare un procedimento di mediazione, ad aderirvi e a parteciparvi» autonomamente, senza necessità di alcuna delibera assembleare preventiva. L'assemblea interviene soltanto nella fase finale: il verbale contenente l'accordo di conciliazione o la proposta conciliativa del mediatore sono sottoposti all'approvazione dell'assemblea condominiale, che delibera entro il termine fissato nell'accordo o nella proposta con le maggioranze previste dall'art. 1136 c.c. In caso di mancata approvazione entro tale termine, la conciliazione si intende non conclusa. Prima della riforma, invece, l'art. 71-quater disp. att. c.c. richiedeva una delibera assembleare preventiva anche per la semplice partecipazione al procedimento. Il nuovo regime, introdotto per velocizzare le mediazioni condominiali ed evitare rinvii per convocare l'assemblea, si applica a tutti i procedimenti instaurati dopo il 30 giugno 2023.",
},
      {
        q: "Quanto dura un procedimento di mediazione?",
        a: "Con il D.Lgs. 216/2024 (c.d. Correttivo Cartabia, in vigore dal 25 gennaio 2025) la durata massima del procedimento di mediazione è stata portata a sei mesi dalla data di deposito della domanda (art. 6 D.Lgs. 28/2010). Per le mediazioni volontarie e obbligatorie, il termine è prorogabile — con accordo scritto delle parti — per periodi di volta in volta non superiori a tre mesi (6 + 3 + 3 + 3…). Per le mediazioni demandate dal giudice, la proroga è possibile per una sola volta di ulteriori tre mesi (6 + 3). Il primo incontro si svolge non prima di venti e non oltre quaranta giorni dal deposito della domanda, salvo diversa concorde indicazione delle parti. Il termine non è soggetto a sospensione feriale. Nella pratica, molte mediazioni si concludono in 1-3 incontri.",
      },
      {
        q: "Quanto costa la mediazione?",
        a: "I costi della mediazione sono regolati dal D.M. 150/2023 e comprendono le spese di avvio e le spese di mediazione per il primo incontro, che variano in base al valore della controversia. Le spese di avvio sono: €40 per liti fino a €1.000, €75 per liti da €1.001 a €50.000, €110 per liti oltre €50.000 e di valore indeterminato. Le spese di mediazione per il primo incontro sono: €60 (fino a €1.000), €120 (€1.001-€50.000), €170 (oltre €50.000). In caso di prosecuzione o accordo si applicano le ulteriori spese di mediazione della Tabella A. Per le mediazioni obbligatorie e demandate dal giudice è prevista una riduzione di un quinto (art. 28, co. 8). Il nostro calcolatore permette di determinare l'importo esatto in base ai parametri specifici del caso.",
      },
    ],
  },
  {
    icon: Euro,
    title: "Indennità e Costi",
    questions: [
      {
        q: "Come si calcola l'indennità di mediazione secondo il D.M. 150/2023?",
        a: "L'indennità di mediazione si calcola in base al valore della controversia secondo il D.M. 150/2023. Il calcolo prevede: 1) Individuazione delle spese di avvio in base al valore della lite (€40/€75/€110); 2) Determinazione delle spese di mediazione per il primo incontro (€60/€120/€170); 3) In caso di accordo o prosecuzione: applicazione delle ulteriori spese dalla Tabella A del D.M. 150/2023; 4) Riduzione di un quinto per mediazione obbligatoria/demandata (art. 28, co. 8); 5) Maggiorazione del 10% per conciliazione al primo incontro o del 25% per conciliazione agli incontri successivi; 6) Detrazione delle spese di mediazione già versate per il primo incontro (art. 34, co. 2); 7) Aggiunta dell'IVA al 22%.",
      },
      {
        q: "Quali sono le spese di avvio?",
        a: "Le spese di avvio sono dovute da ciascuna parte e variano in base al valore della lite (art. 28, co. 4, D.M. 150/2023): €40 per liti fino a €1.000, €75 per liti da €1.001 a €50.000, €110 per liti di valore superiore a €50.000 e per quelle di valore indeterminato. Sono versate dall'istante al momento del deposito della domanda di mediazione e dalla parte chiamata al momento dell'adesione.",
      },
      {
        q: "Ci sono riduzioni per mancato accordo al primo incontro?",
        a: "Sì. Se la mediazione si conclude al primo incontro senza accordo, le parti devono corrispondere esclusivamente le spese di avvio (€40/€75/€110 in base al valore della lite) e le spese di mediazione per il primo incontro (€60/€120/€170), eventualmente ridotte di un quinto se la mediazione è obbligatoria o demandata (art. 28, co. 6 e 8, D.M. 150/2023). Non sono dovute le ulteriori spese di mediazione previste dalla Tabella A. Questa previsione mira a contenere i costi per le parti quando la mediazione non prosegue oltre il primo incontro.",
      },
      {
        q: "L'accordo di mediazione è esente da imposta di registro?",
        a: "Sì. Ai sensi dell'art. 17, comma 2, del D.Lgs. 28/2010 (come modificato dalla Riforma Cartabia), tutti gli atti, documenti e provvedimenti relativi al procedimento di mediazione sono esenti dall'imposta di bollo e da ogni spesa, tassa o diritto di qualsiasi specie e natura. Inoltre, l'accordo di conciliazione è esente dall'imposta di registro fino al valore di €100.000. Per la parte eccedente tale importo, l'imposta di registro è dovuta secondo le aliquote ordinarie. Il precedente limite era di €50.000.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Costi Notarili e Spese per Questioni da Trascrivere",
    badge: "Art. 11 D.Lgs. 28/2010 — Art. 2643 c.c.",
    questions: [
      {
        q: "Quando serve il notaio nella mediazione civile?",
        a: "L'intervento del notaio è necessario quando l'accordo di mediazione riguarda uno dei contratti o degli atti previsti dall'art. 2643 del codice civile, ossia atti soggetti a trascrizione nei registri immobiliari. Ad esempio: trasferimenti di proprietà immobiliare, costituzione o modifica di servitù, accertamenti di usucapione, divisioni immobiliari. In questi casi, ai sensi dell'art. 11, comma 3, del D.Lgs. 28/2010, la sottoscrizione dell'accordo deve essere autenticata da un pubblico ufficiale a ciò autorizzato (notaio). Senza l'autenticazione notarile, l'accordo non può essere trascritto e non è opponibile ai terzi.",
      },
      {
        q: "Quali sono i costi notarili per la trascrizione dell'accordo di mediazione?",
        a: "I costi notarili comprendono: 1) Onorario del notaio: varia in base al valore dell'immobile, indicativamente da €1.000 (immobili fino a €10.000) a €2.500-4.000 (immobili di valore elevato), oltre IVA al 22%. Per la prima casa gli onorari sono generalmente più contenuti (circa il 30% in meno). 2) Contributo Cassa Nazionale del Notariato e tassa archivio. 3) Spese per visure ipotecarie e catastali (circa €100 forfettarie). 4) Spese per voltura catastale. Il notaio, oltre ad autenticare le firme, verifica la regolarità urbanistica, catastale e ipotecaria dell'immobile, e provvede alla registrazione, trascrizione e voltura.",
      },
      {
        q: "L'accordo di mediazione immobiliare gode di esenzioni fiscali?",
        a: "Sì, l'accordo di mediazione gode di un regime fiscale molto agevolato ai sensi dell'art. 17 del D.Lgs. 28/2010: 1) Esenzione totale dall'imposta di bollo e da ogni spesa, tassa o diritto (comma 1). 2) Esenzione dall'imposta di registro fino a €100.000 di valore (comma 2). Per la parte eccedente si applica il 2% per la prima casa o il 9% per gli altri immobili. 3) Esenzione dalle imposte ipotecarie e catastali: l'Agenzia delle Entrate (Risposta n. 235/2020) ha chiarito che il regime di esenzione si applica anche a queste imposte, indipendentemente dal valore del trasferimento. Si tratta di un risparmio molto significativo rispetto a una compravendita ordinaria.",
      },
      {
        q: "Quanto si risparmia con la prima casa nella mediazione immobiliare?",
        a: "Il risparmio è notevole. In una compravendita ordinaria con prima casa, le imposte sono: imposta di registro 2% sul valore catastale + imposte ipotecaria e catastale fisse (€50 + €50). Con l'accordo di mediazione: fino a €100.000 di valore, tutte le imposte sono azzerate (registro, ipotecaria e catastale). Oltre €100.000, si paga il 2% solo sulla parte eccedente. Esempio pratico: per un immobile con valore catastale €120.000, in compravendita ordinaria si pagherebbero circa €2.400 di registro + €100 di ipotecaria/catastale = €2.500. Con l'accordo di mediazione, si paga il 2% solo su €20.000 (eccedenza oltre €100.000) = €400, con un risparmio di circa €2.100. Per immobili fino a €100.000, il risparmio è totale.",
      },
      {
        q: "Le imposte ipotecarie e catastali sono davvero esenti per l'accordo di mediazione?",
        a: "La questione ha avuto un'evoluzione giurisprudenziale. L'Agenzia delle Entrate, con la Risposta n. 235 del 31 luglio 2020, ha confermato che l'esenzione di cui all'art. 17 del D.Lgs. 28/2010 si estende anche alle imposte ipotecarie e catastali. Tuttavia, alcune Conservatorie dei Registri Immobiliari hanno talvolta rifiutato la trascrizione in assenza del pagamento. La giurisprudenza tributaria recente ha dato ragione ai contribuenti: l'atto notarile necessario a garantire la trascrizione dell'accordo di mediazione beneficia dell'agevolazione tributaria generalizzata di cui al comma 1 dell'art. 17, trattandosi di un 'necessario e conseguente atto' del procedimento di mediazione.",
      },
      {
        q: "Cos'è la verifica di congruità del valore catastale e a cosa serve?",
        a: "La verifica di congruità (art. 29 D.M. 150/2023) consente di confrontare il valore dichiarato nella domanda di mediazione o nell'accordo con il valore catastale dell'immobile. Il valore catastale si calcola moltiplicando la rendita catastale per coefficienti specifici: ×115,5 per la prima casa, ×126 per altri fabbricati (cat. A e C escluse A/10 e C/1), ×176,4 per cat. B, ×63 per cat. A/10 e D, ×42,84 per cat. C/1 ed E, ×112,5 per terreni agricoli. Se il valore dichiarato è inferiore al valore catastale, l'Agenzia delle Entrate potrebbe contestare il valore ai fini fiscali. Il nostro calcolatore permette di effettuare questa verifica immediatamente, segnalando il livello di rischio.",
      },
      {
        q: "Quanto costa complessivamente trascrivere un accordo di mediazione immobiliare?",
        a: "Il costo complessivo dipende dal valore dell'immobile e dalla tipologia (prima casa o meno). Per un immobile prima casa da €150.000: 1) Onorario notaio: circa €1.500-2.000 + IVA (22%) = €1.830-2.440; 2) Imposte di registro: 2% su €50.000 (eccedenza oltre €100.000) = €1.000; 3) Imposte ipotecarie e catastali: esenti (art. 17 D.Lgs. 28/2010); 4) Visure e spese accessorie: circa €100-200. Totale indicativo: circa €3.000-3.700. Per un immobile non prima casa dello stesso valore, l'imposta di registro sarebbe del 9% su €50.000 = €4.500, portando il totale a circa €6.500-7.100. Il risparmio rispetto al contenzioso giudiziario (con CU, CTU, compensi avvocato per più gradi) è comunque molto significativo.",
      },
    ],
  },
  {
    icon: TrendingUp,
    title: "Credito d'Imposta in Mediazione",
    badge: "Art. 20 D.Lgs. 28/2010 — D.M. 1° agosto 2023",
    questions: [
      {
        q: "Cos'è il credito d'imposta per la mediazione civile?",
        a: "Il credito d'imposta per la mediazione civile è un incentivo fiscale previsto dall'art. 20 del D.Lgs. 28/2010, come novellato dalla Riforma Cartabia (D.Lgs. 149/2022), e disciplinato nelle modalità operative dal D.M. 1° agosto 2023 (pubblicato in G.U. n. 183 del 7 agosto 2023). Lo Stato riconosce alle parti che hanno partecipato a una procedura di mediazione un rimborso parziale, sotto forma di credito d'imposta, dei costi sostenuti per l'indennità versata all'organismo di mediazione, per il compenso dell'avvocato e, in certi casi, per il contributo unificato versato per il giudizio successivamente estinto.",
      },
      {
        q: "Quali sono gli importi massimi del credito d'imposta?",
        a: "L'art. 20 del D.Lgs. 28/2010 prevede tre tipologie di credito d'imposta: a) Credito per indennità versata all'organismo di mediazione: fino a €600 in caso di accordo, ridotto a €300 in caso di mancato accordo. b) Credito per compenso dell'avvocato: fino a €600 in caso di accordo, ridotto a €300 in caso di mancato accordo. Questo credito spetta solo nelle mediazioni obbligatorie (art. 5, co. 1) e nelle mediazioni demandate dal giudice (art. 5-quater). c) Credito per contributo unificato: fino a €518, solo in caso di mediazione demandata dal giudice con accordo raggiunto che comporti l'estinzione del giudizio. I crediti di cui alle lettere a) e b) sono cumulabili ma soggetti a un tetto di €600 per procedura. Il tetto annuale è di €2.400 per le persone fisiche e €24.000 per le persone giuridiche.",
      },
      {
        q: "Chi può richiedere il credito d'imposta?",
        a: "Possono richiedere il credito d'imposta: 1) Le parti (persone fisiche o giuridiche) che hanno partecipato a una procedura di mediazione conclusa dopo il 30 giugno 2023 e che hanno sostenuto costi documentati per indennità all'organismo e/o compenso dell'avvocato. 2) Gli organismi di mediazione, per l'indennità non percepita dalle parti ammesse al patrocinio a spese dello Stato (art. 15-septies, co. 2, D.Lgs. 28/2010), fino a un massimo annuale di €24.000. Non è possibile ottenere il credito d'imposta per le mediazioni avviate prima del 30 giugno 2023, poiché l'art. 20 del D.Lgs. 28/2010, nella versione anteriore alla Riforma Cartabia, non ha mai ricevuto attuazione.",
      },
      {
        q: "Entro quando va presentata la domanda?",
        a: "Ai sensi dell'art. 3, commi 1 e 5, del D.M. 1° agosto 2023, la domanda di attribuzione del credito d'imposta deve essere presentata, a pena di inammissibilità, tramite la piattaforma online ministeriale entro il 31 marzo dell'anno successivo a quello di conclusione della procedura di mediazione. Per le mediazioni concluse nel 2025, la scadenza è il 31 marzo 2026. Decorso inutilmente tale termine, non sarà più possibile ottenere il beneficio fiscale.",
      },
      {
        q: "Come si presenta la domanda?",
        a: "La domanda si presenta esclusivamente online tramite la piattaforma del Ministero della Giustizia accessibile all'indirizzo https://lsg.giustizia.it/. Occorre autenticarsi con SPID, CIE o CNS, registrarsi sul portale e selezionare l'applicativo 'Istanza credito di imposta'. Si compila il form indicando: la tipologia di procedura, il numero d'ordine dell'Organismo di mediazione, il numero identificativo del procedimento, il valore della lite, la materia della controversia, la data dell'accordo (o del verbale di mancato accordo), i dati della fattura dell'organismo, le modalità e la data di pagamento. È obbligatorio indicare un indirizzo PEC per le comunicazioni. Al termine, si clicca 'Salva e Invia istanza'.",
      },
      {
        q: "Cosa succede dopo la presentazione della domanda?",
        a: "Dopo la presentazione della domanda, il Ministero della Giustizia effettua le verifiche ritenute necessarie. Entro il 30 aprile dell'anno di presentazione, con decreto del Capo Dipartimento per gli Affari di Giustizia, viene riconosciuto l'importo del credito d'imposta effettivamente spettante a ciascun beneficiario, nei limiti di cui all'art. 20, commi 2, 3 e 4 del D.Lgs. 28/2010, e nel rispetto del tetto massimo di spesa annuo (€51.821.400). Il Ministero comunica al richiedente l'importo del credito riconosciuto. Il credito può essere revocato se viene accertata l'insussistenza dei requisiti soggettivi o oggettivi, o se la domanda contiene dati o dichiarazioni non veritiere.",
      },
      {
        q: "Come si utilizza il credito d'imposta riconosciuto?",
        a: "Il credito d'imposta è utilizzabile esclusivamente in compensazione tramite modello F24, presentato obbligatoriamente tramite i servizi telematici dell'Agenzia delle Entrate (Entratel/Fisconline), a partire dalla data di ricezione della comunicazione ministeriale. I codici tributo, istituiti con Risoluzioni n. 23/E e n. 24/E del 14 maggio 2024, sono: '7067' per indennità organismo e compenso avvocato; '7068' per il contributo unificato; '7069' per gli organismi di mediazione. Non è prevista la possibilità di ottenere un rimborso diretto delle somme.",
      },
      {
        q: "Il credito d'imposta per il compenso dell'avvocato spetta sempre?",
        a: "No. Il credito d'imposta commisurato al compenso dell'avvocato (fino a €600 con accordo, €300 senza) spetta solo nelle mediazioni obbligatorie ai sensi dell'art. 5, co. 1, del D.Lgs. 28/2010 (dove l'assistenza legale è obbligatoria) e nelle mediazioni demandate dal giudice ai sensi dell'art. 5-quater. Non spetta invece nelle mediazioni volontarie o in quelle derivanti da clausola contrattuale. La ratio è che il legislatore ha voluto incentivare con il credito d'imposta solo le ipotesi in cui la parte è obbligata per legge a sostenere la spesa per l'avvocato.",
      },
      {
        q: "Cosa si intende per 'riduzione della metà in caso di insuccesso'?",
        a: "L'art. 20, co. 2, del D.Lgs. 28/2010 prevede che in caso di insuccesso della mediazione (mancato raggiungimento dell'accordo) i crediti d'imposta per l'indennità dell'organismo e per il compenso dell'avvocato sono ridotti della metà. Quindi, il credito per l'indennità scende da €600 a €300 e quello per il compenso dell'avvocato da €600 a €300. Il credito per il contributo unificato (€518) non si applica in caso di mancato accordo, perché presuppone l'estinzione del giudizio a seguito dell'accordo di conciliazione.",
      },
      {
        q: "Come si calcola il tetto di €600 per procedura?",
        a: "Il tetto di €600 per procedura (art. 20, co. 2, D.Lgs. 28/2010) si applica alla somma del credito per indennità organismo (lett. a) e del credito per compenso avvocato (lett. b). Esempio: se una parte ha versato €400 di indennità e €400 di compenso avvocato in una mediazione obbligatoria con accordo, il credito totale teorico sarebbe €800, ma viene ridotto a €600 per effetto del tetto per procedura. Il credito per il contributo unificato (lett. c) si cumula separatamente. Pertanto, il massimo ottenibile per una singola procedura è €600 (indennità + avvocato) + €518 (contributo unificato) = €1.118.",
      },
      {
        q: "Le mediazioni avviate prima del 30 giugno 2023 danno diritto al credito?",
        a: "No. L'art. 20 del D.Lgs. 28/2010, nella versione anteriore alle modifiche introdotte dalla Riforma Cartabia (D.Lgs. 149/2022, in vigore dal 30 giugno 2023), non ha mai ricevuto attuazione. Il D.M. 1° agosto 2023 disciplina le modalità di presentazione della domanda solo per le procedure concluse in data successiva all'entrata in vigore della riforma. Di conseguenza, le mediazioni avviate e concluse prima del 30 giugno 2023 non possono beneficiare del credito d'imposta.",
      },
      {
        q: "Il credito d'imposta spetta anche per la mediazione volontaria?",
        a: "Sì, ma solo per l'indennità versata all'organismo di mediazione (art. 20, co. 1, primo periodo). Il credito per l'indennità spetta a tutte le parti, indipendentemente dal tipo di mediazione (obbligatoria, demandata o volontaria), quando è raggiunto l'accordo di conciliazione (€600) o in caso di mancato accordo (€300). Tuttavia, il credito per il compenso dell'avvocato spetta solo nelle mediazioni obbligatorie e demandate, e il credito per il contributo unificato spetta solo nelle mediazioni demandate con accordo.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Gratuito Patrocinio in Mediazione",
    badge: "Artt. 15-bis / 15-undecies D.Lgs. 28/2010 — D.M. 1° agosto 2023",
    questions: [
      {
        q: "Cos'è il patrocinio a spese dello Stato in mediazione?",
        a: "Il patrocinio a spese dello Stato (comunemente chiamato 'gratuito patrocinio') in mediazione è un beneficio introdotto dalla Riforma Cartabia (D.Lgs. 149/2022) che ha inserito nel D.Lgs. 28/2010 il nuovo Capo II-bis (artt. da 15-bis a 15-undecies), dedicato alle 'Disposizioni sul patrocinio a spese dello Stato nella mediazione civile e commerciale'. Consente alle persone che si trovano in condizioni economiche disagiate di accedere alla mediazione senza sostenere i costi per l'indennità dell'organismo di mediazione e per il compenso dell'avvocato, che vengono posti a carico dello Stato.",
      },
      {
        q: "Qual è l'evoluzione giuridica che ha portato al riconoscimento del gratuito patrocinio in mediazione?",
        a: "Il percorso è stato lungo e articolato. La Corte di Cassazione, con sentenza n. 18123/2020, aveva escluso il gratuito patrocinio per l'attività stragiudiziale in generale. La svolta è arrivata con la Corte Costituzionale (sentenza n. 10 del 20 gennaio 2022), che ha dichiarato l'illegittimità costituzionale degli artt. 74, co. 2, e 75, co. 1, del D.P.R. 115/2002, nella parte in cui non prevedevano il patrocinio a spese dello Stato per l'attività difensiva svolta nell'ambito del procedimento di mediazione. La Cassazione (ord. n. 7974/2024) ha poi individuato come data spartiacque il 21 gennaio 2022. La Riforma Cartabia ha infine regolamentato organicamente l'istituto nel D.Lgs. 28/2010. Il D.M. 1° agosto 2023 ne ha dato attuazione concreta.",
      },
      {
        q: "Quali sono i requisiti per essere ammessi al gratuito patrocinio in mediazione?",
        a: "I requisiti sono previsti dagli artt. 15-bis e 15-ter del D.Lgs. 28/2010: 1) Deve trattarsi di mediazione obbligatoria ai sensi dell'art. 5, co. 1, del D.Lgs. 28/2010 (la mediazione deve essere condizione di procedibilità della domanda giudiziale). 2) La mediazione deve concludersi con il raggiungimento dell'accordo. 3) Non si deve trattare di controversie per cessione di crediti e ragioni altrui, salvo che la cessione appaia fatta in pagamento di crediti o ragioni preesistenti (art. 15-bis, co. 2). 4) Il richiedente deve trovarsi nelle condizioni reddituali previste dalla normativa sul patrocinio a spese dello Stato (D.P.R. 115/2002), ovvero un reddito annuo imponibile non superiore alla soglia prevista dalla legge.",
      },
      {
        q: "Come si presenta l'istanza di ammissione al patrocinio in mediazione?",
        a: "L'istanza di ammissione al patrocinio nel procedimento di mediazione (art. 15-quater, D.Lgs. 28/2010) deve essere presentata in via anticipata e preventiva, sia da chi intenda proporre domanda di mediazione sia da chi intenda aderire al procedimento. L'istanza va presentata al Consiglio dell'Ordine degli Avvocati (COA) del luogo ove ha sede l'organismo di mediazione competente ai sensi dell'art. 4, co. 1, D.Lgs. 28/2010. L'istanza deve contenere le informazioni previste dalla legge e la dichiarazione delle condizioni reddituali. L'istanza deve essere presentata prima dell'avvio della mediazione o prima dell'adesione.",
      },
      {
        q: "Entro quanto tempo il COA decide sull'ammissione?",
        a: "Ai sensi dell'art. 15-quinquies, co. 2, del D.Lgs. 28/2010, entro venti giorni dal deposito dell'istanza il Consiglio dell'Ordine degli Avvocati procede alle verifiche di ammissibilità e, in caso positivo, ammette l'interessato al patrocinio in via anticipata e provvisoria, dandogliene immediata comunicazione. In caso di rigetto dell'istanza, il richiedente può proporre ricorso al Presidente del Tribunale competente (art. 15-sexies), che decide con decreto non impugnabile.",
      },
      {
        q: "Quali sono gli effetti dell'ammissione al patrocinio a spese dello Stato?",
        a: "Gli effetti, previsti dall'art. 15-septies del D.Lgs. 28/2010, sono: 1) L'ammissione è valida per l'intero procedimento di mediazione. 2) La parte ammessa è esonerata dal pagamento delle spese e delle indennità all'organismo di mediazione (sia di primo incontro che di quelle ulteriori ai sensi dell'art. 17, commi 3 e 4). 3) L'avvocato che assiste la parte ammessa non può chiedere né percepire dal proprio assistito compensi o rimborsi a qualunque titolo diversi da quelli previsti dal Capo II-bis; ogni patto contrario è nullo (art. 15-septies, co. 5). 4) L'organismo di mediazione ottiene un credito d'imposta per l'indennità non percepita (art. 20, co. 4, fino a €24.000 annui).",
      },
      {
        q: "Come viene determinato il compenso dell'avvocato ammesso al patrocinio?",
        a: "Il compenso dell'avvocato è disciplinato dall'art. 4 del D.M. 1° agosto 2023, che fa rinvio all'art. 15-octies del D.Lgs. 28/2010. L'avvocato ha diritto a un compenso nella misura prevista dall'art. 20, co. 1-bis, del D.M. 55/2014 (parametri forensi per mediazione), ridotto della metà. Se la mediazione si conclude con accordo, le fasi di attivazione e negoziazione sono maggiorate del 30% (art. 20, co. 1-bis, D.M. 55/2014). Sulla somma risultante si applica poi il rimborso forfettario del 15% per le spese generali, oltre IVA e CPA.",
      },
      {
        q: "L'avvocato come ottiene il pagamento del compenso?",
        a: "Quando la mediazione si conclude con accordo, l'ammissione anticipata al patrocinio viene confermata su istanza dell'avvocato dal COA che ha deliberato l'ammissione, mediante apposizione del visto di congruità sulla parcella (art. 15-septies, co. 3 e 4). Il COA verifica la completezza della documentazione e la congruità del compenso in base al valore dell'accordo. Successivamente, il COA trasmette la parcella vistata al Ministero della Giustizia tramite la piattaforma ministeriale. L'avvocato può scegliere alternativamente tra il pagamento diretto o il riconoscimento di un credito d'imposta (codice tributo '7070'). Il Ministero, verificati i presupposti, convalida la delibera di congruità e riconosce l'importo spettante.",
      },
      {
        q: "Cosa succede se la mediazione non si conclude con accordo?",
        a: "Se la mediazione non si conclude con un accordo di conciliazione, l'ammissione anticipata al patrocinio cessa i suoi effetti e non viene confermata (art. 15-septies, D.Lgs. 28/2010). In tal caso, la parte ammessa è comunque esonerata dal pagamento delle indennità all'organismo per la fase di mediazione svolta, ma l'avvocato non matura il diritto al compenso a carico dello Stato tramite il patrocinio. Resta fermo il diritto della parte di avvalersi del patrocinio a spese dello Stato nell'eventuale successivo giudizio civile, secondo le regole ordinarie del D.P.R. 115/2002.",
      },
      {
        q: "Il gratuito patrocinio vale anche per la mediazione volontaria o demandata?",
        a: "No. L'ammissione al patrocinio a spese dello Stato in mediazione è prevista esclusivamente per la mediazione obbligatoria ai sensi dell'art. 5, co. 1, del D.Lgs. 28/2010 (art. 15-bis). Non si estende quindi alla mediazione volontaria, né alla mediazione derivante da clausola contrattuale, né alla mediazione demandata dal giudice ai sensi dell'art. 5-quater. La ratio è che il legislatore ha voluto garantire il diritto di accesso alla giustizia solo nelle ipotesi in cui la mediazione costituisce un passaggio obbligatorio imposto per legge.",
      },
      {
        q: "L'organismo di mediazione è obbligato ad accettare il procedimento con parte ammessa al patrocinio?",
        a: "Sì. Ai sensi dell'art. 17, co. 6, del D.Lgs. 28/2010, quando la mediazione è condizione di procedibilità della domanda giudiziale (art. 5, co. 1) o è demandata dal giudice (art. 5-quater, co. 2), all'organismo non è dovuta alcuna indennità dalla parte ammessa al patrocinio a spese dello Stato. L'organismo deve comunque svolgere la procedura. Come compensazione, all'organismo è riconosciuto un credito d'imposta commisurato all'indennità non percepita, fino a un importo massimo annuale di €24.000 (art. 20, co. 4, D.Lgs. 28/2010).",
      },
      {
        q: "L'ammissione al patrocinio può essere revocata?",
        a: "Sì. L'art. 15-novies del D.Lgs. 28/2010 prevede che l'ammissione al patrocinio possa essere revocata dal COA competente quando, in qualsiasi momento del procedimento, si accerti che le condizioni di reddito che hanno dato luogo all'ammissione non sussistono o sono venute meno. La revoca ha effetto dalla comunicazione all'interessato. Il COA dà comunicazione della revoca anche al Ministero della Giustizia per gli eventuali recuperi.",
      },
    ],
  },
  {
    icon: Brain,
    title: "Analisi AI",
    questions: [
      {
        q: "Come funziona l'analisi AI del caso?",
        a: "L'analisi AI utilizza modelli di intelligenza artificiale avanzati per analizzare i documenti e le informazioni relative al caso di mediazione. Il processo prevede sette fasi: 1) Caricamento dei documenti; 2) Estrazione delle entità rilevanti (parti, importi, date); 3) Classificazione della materia; 4) Analisi giuridica preliminare; 5) Valutazione della complessità; 6) Suggerimenti strategici; 7) Generazione del report. L'analisi produce un report dettagliato che include l'inquadramento normativo, i punti di forza e debolezza della posizione, e suggerimenti per la strategia negoziale.",
      },
      {
        q: "I dati inseriti sono sicuri e riservati?",
        a: "Sì. La sicurezza e la riservatezza dei dati sono una priorità assoluta. Tutti i dati vengono trasmessi tramite connessione crittografata (HTTPS/TLS). I documenti caricati vengono elaborati in tempo reale e non vengono archiviati permanentemente sui nostri server. Il trattamento dei dati è conforme al GDPR (Regolamento UE 2016/679) e alla normativa italiana sulla privacy. I dati non vengono condivisi con terze parti e vengono utilizzati esclusivamente per l'analisi richiesta.",
      },
      {
        q: "L'analisi AI sostituisce il parere di un avvocato?",
        a: "No, assolutamente no. L'analisi AI fornisce un supporto informativo e orientativo, ma non costituisce in alcun modo un parere legale. L'intelligenza artificiale può aiutare a identificare le questioni giuridiche rilevanti, classificare la materia e fornire un'analisi preliminare, ma non può sostituire la consulenza di un professionista abilitato. Si raccomanda sempre di consultare un avvocato per valutazioni specifiche sul proprio caso. Il sistema è progettato come strumento di supporto per professionisti e parti, non come sostituto della consulenza legale.",
      },
      {
        q: "Quali tipi di analisi produce il sistema?",
        a: "Il sistema produce diversi tipi di analisi: 1) Analisi delle entità: identificazione delle parti, importi, date e riferimenti normativi presenti nei documenti; 2) Classificazione della materia: determinazione automatica della materia di mediazione e verifica dell'obbligatorietà; 3) Analisi giuridica: inquadramento normativo e individuazione delle questioni giuridiche rilevanti; 4) Valutazione strategica: punti di forza e debolezza della posizione, possibili scenari; 5) Calcolo costi: stima automatica delle indennità di mediazione; 6) Report completo: documento riepilogativo con tutte le analisi effettuate e le raccomandazioni.",
      },
    ],
  },
];

export default function FAQ() {
  // Inject FAQ JSON-LD structured data for Google rich snippets
  useEffect(() => {
    const allQuestions = faqSections.flatMap((section) => section.questions);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Domande Frequenti sulla Mediazione Civile",
      "description": "FAQ sulla mediazione civile e commerciale: costi, indennità, credito d'imposta, gratuito patrocinio e analisi AI.",
      "creator": {
        "@type": "SoftwareApplication",
        "name": "Perplexity Computer",
        "url": "https://www.perplexity.ai/computer"
      },
      "mainEntity": allQuestions.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a,
        },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    script.id = "faq-jsonld";
    // Remove existing if present (e.g. on re-render)
    const existing = document.getElementById("faq-jsonld");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-jsonld");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Domande Frequenti
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tutto quello che c'è da sapere sulla mediazione civile, i costi previsti dal D.M. 150/2023,
            il credito d'imposta (art. 20 D.Lgs. 28/2010), il gratuito patrocinio (artt. 15-bis/15-undecies)
            e il funzionamento della nostra piattaforma con analisi AI.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b-2 border-foreground bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 border-2 border-foreground flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {section.title}
                  </h2>
                </div>
                {section.badge && (
                  <Badge variant="outline" className="text-xs font-mono border-foreground/30 whitespace-nowrap self-start sm:self-auto">
                    {section.badge}
                  </Badge>
                )}
              </div>

              {/* Accordion */}
              <Accordion type="single" collapsible className="px-6">
                {section.questions.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`section-${sectionIdx}-item-${idx}`}
                    className="border-b-2 border-muted last:border-b-0"
                  >
                    <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline hover:text-primary transition-colors duration-150">
                      <span className="pr-4">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Non hai trovato la risposta?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Prova i nostri calcolatori per ottenere calcoli precisi delle indennità e del credito d'imposta,
            oppure avvia un'analisi AI del tuo caso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calcolatore">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                Calcola Indennità
              </span>
            </Link>
            <Link href="/credito-imposta">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                Credito d'Imposta
              </span>
            </Link>
            <Link href="/analisi-caso-ai">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <Brain className="w-4 h-4" />
                Analisi AI Caso
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
