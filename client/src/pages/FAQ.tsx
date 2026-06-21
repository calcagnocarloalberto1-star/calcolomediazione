import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { HelpCircle, Euro, Brain, ArrowLeft, TrendingUp, Shield, FileText, Scale, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
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
        q: "Cos\u00e8 la mediazione civile e commerciale?",
        a: "La mediazione civile e commerciale \u00e8 un procedimento stragiudiziale di risoluzione delle controversie, disciplinato dal D.Lgs. 28/2010, in cui un terzo imparziale (il mediatore) assiste le parti nel trovare un accordo amichevole. Il mediatore non decide la controversia, ma facilita la comunicazione tra le parti per raggiungere una soluzione condivisa. La mediazione pu\u00f2 essere volontaria, obbligatoria (come condizione di procedibilit\u00e0 della domanda giudiziale) o demandata dal giudice.",
      },
      {
        q: "Quando \u00e8 obbligatoria la mediazione?",
        a: "La mediazione \u00e8 obbligatoria come condizione di procedibilit\u00e0 della domanda giudiziale nelle materie elencate dall\u2019art. 5, comma 1, del D.Lgs. 28/2010, come modificato dalla Riforma Cartabia (D.Lgs. 149/2022). Chi intende esercitare un\u2019azione giudiziaria in queste materie deve prima tentare la mediazione. L\u2019esperimento della mediazione \u00e8 condizione di procedibilit\u00e0 della domanda, e l\u2019improcedibilit\u00e0 deve essere eccepita dal convenuto o rilevata dal giudice non oltre la prima udienza.",
      },
      {
        q: "Quali sono le materie soggette a mediazione obbligatoria?",
        a: "Le materie soggette a mediazione obbligatoria includono: condominio, diritti reali, divisione, successioni ereditarie, patti di famiglia, locazione, comodato, affitto di aziende, risarcimento del danno derivante da responsabilit\u00e0 medica e sanitaria, risarcimento del danno derivante da diffamazione con il mezzo della stampa o altro mezzo di pubblicit\u00e0, contratti assicurativi, bancari e finanziari, associazione in partecipazione, consorzio, franchising, opera, rete, somministrazione, societ\u00e0 di persone, e subfornitura. Dal 30 giugno 2023 la Riforma Cartabia ha ampliato l\u2019elenco originario.",
      },
      {
        q: "Cosa cambia per il condominio con la Riforma Cartabia? L\u2019amministratore deve ottenere una delibera?",
        a: "S\u00ec, ma solo per approvare l\u2019accordo o la proposta del mediatore \u2014 non pi\u00f9 per partecipare alla mediazione. La Riforma Cartabia (D.Lgs. 149/2022) ha introdotto l\u2019art. 5-ter del D.Lgs. 28/2010, in vigore dal 30 giugno 2023, che prevede: l\u2019amministratore del condominio \u00e8 legittimato ad attivare un procedimento di mediazione, ad aderirvi e a parteciparvi autonomamente, senza necessit\u00e0 di alcuna delibera assembleare preventiva. L\u2019assemblea interviene soltanto nella fase finale: il verbale contenente l\u2019accordo di conciliazione o la proposta conciliativa del mediatore sono sottoposti all\u2019approvazione dell\u2019assemblea condominiale, che delibera entro il termine fissato nell\u2019accordo o nella proposta con le maggioranze previste dall\u2019art. 1136 c.c. In caso di mancata approvazione entro tale termine, la conciliazione si intende non conclusa. Prima della riforma, l\u2019art. 71-quater disp. att. c.c. richiedeva una delibera assembleare preventiva anche per la semplice partecipazione al procedimento. Il nuovo regime si applica a tutti i procedimenti instaurati dopo il 30 giugno 2023.",
      },
      {
        q: "Quanto dura un procedimento di mediazione? È vero che non può superare i sei mesi?",
        a: "No, non è corretto affermare che una mediazione non possa superare i sei mesi. Ecco la disciplina esatta vigente (art. 6 D.Lgs. 28/2010, come modificato dal D.Lgs. 216/2024, in vigore dal 25 gennaio 2025). La durata ordinaria è di sei mesi dal deposito della domanda. Tuttavia la legge prevede espressamente la possibilità di proroghe, con regole diverse a seconda del tipo di mediazione. Per la mediazione volontaria e per la mediazione obbligatoria (condizione di procedibilità ai sensi dell'art. 5, co. 1): il termine di sei mesi è prorogabile con accordo scritto delle parti per periodi successivi di tre mesi ciascuno, senza un limite massimo al numero di proroghe. Il procedimento può quindi durare 6 + 3 + 3 + 3 mesi e così via, purché le parti concordino per iscritto ogni proroga prima della scadenza del termine in corso. Per la mediazione demandata dal giudice (art. 5-quater): la proroga è possibile una sola volta, per ulteriori tre mesi (6 + 3 = 9 mesi massimi), sempre su accordo scritto delle parti chiesto prima della scadenza dei sei mesi. In sintesi: la mediazione obbligatoria o volontaria può protrarsi ben oltre i sei mesi tramite proroghe successive; solo la mediazione demandata ha un tetto assoluto di nove mesi. Il primo incontro si svolge non prima di venti e non oltre quaranta giorni dal deposito della domanda. Il termine non è soggetto a sospensione feriale.",
      },
      {
        q: "Quanto costa la mediazione?",
        a: "I costi della mediazione sono regolati dal D.M. 150/2023 e comprendono le spese di avvio e le spese di mediazione per il primo incontro, che variano in base al valore della controversia. Le spese di avvio sono: \u20ac40 per liti fino a \u20ac1.000, \u20ac75 per liti da \u20ac1.001 a \u20ac50.000, \u20ac110 per liti oltre \u20ac50.000 e di valore indeterminato. Le spese di mediazione per il primo incontro sono: \u20ac60 (fino a \u20ac1.000), \u20ac120 (\u20ac1.001-\u20ac50.000), \u20ac170 (oltre \u20ac50.000). In caso di prosecuzione o accordo si applicano le ulteriori spese di mediazione della Tabella A. Per le mediazioni obbligatorie e demandate dal giudice \u00e8 prevista una riduzione di un quinto (art. 28, co. 8). Il nostro calcolatore permette di determinare l\u2019importo esatto in base ai parametri specifici del caso.",
      },
    ],
  },
  {
    icon: Euro,
    title: "Indennit\u00e0 e Costi",
    questions: [
      {
        q: "Come si calcola l\u2019indennit\u00e0 di mediazione secondo il D.M. 150/2023?",
        a: "L\u2019indennit\u00e0 di mediazione si calcola in base al valore della controversia secondo il D.M. 150/2023. Il calcolo prevede: 1) Individuazione delle spese di avvio in base al valore della lite (\u20ac40/\u20ac75/\u20ac110); 2) Determinazione delle spese di mediazione per il primo incontro (\u20ac60/\u20ac120/\u20ac170); 3) In caso di accordo o prosecuzione: applicazione delle ulteriori spese dalla Tabella A del D.M. 150/2023; 4) Riduzione di un quinto per mediazione obbligatoria/demandata (art. 28, co. 8); 5) Maggiorazione del 10% per conciliazione al primo incontro o del 25% per conciliazione agli incontri successivi; 6) Detrazione delle spese di mediazione gi\u00e0 versate per il primo incontro (art. 34, co. 2); 7) Aggiunta dell\u2019IVA al 22%.",
      },
      {
        q: "Quali sono le spese di avvio?",
        a: "Le spese di avvio sono dovute da ciascuna parte e variano in base al valore della lite (art. 28, co. 4, D.M. 150/2023): \u20ac40 per liti fino a \u20ac1.000, \u20ac75 per liti da \u20ac1.001 a \u20ac50.000, \u20ac110 per liti di valore superiore a \u20ac50.000 e per quelle di valore indeterminato. Sono versate dall\u2019istante al momento del deposito della domanda di mediazione e dalla parte chiamata al momento dell\u2019adesione.",
      },
      {
        q: "Ci sono riduzioni per mancato accordo al primo incontro?",
        a: "S\u00ec. Se la mediazione si conclude al primo incontro senza accordo, le parti devono corrispondere esclusivamente le spese di avvio (\u20ac40/\u20ac75/\u20ac110 in base al valore della lite) e le spese di mediazione per il primo incontro (\u20ac60/\u20ac120/\u20ac170), eventualmente ridotte di un quinto se la mediazione \u00e8 obbligatoria o demandata (art. 28, co. 6 e 8, D.M. 150/2023). Non sono dovute le ulteriori spese di mediazione previste dalla Tabella A. Questa previsione mira a contenere i costi per le parti quando la mediazione non prosegue oltre il primo incontro.",
      },
      {
        q: "L\u2019accordo di mediazione \u00e8 esente da imposta di registro?",
        a: "S\u00ec. Ai sensi dell\u2019art. 17, comma 2, del D.Lgs. 28/2010 (come modificato dalla Riforma Cartabia), tutti gli atti, documenti e provvedimenti relativi al procedimento di mediazione sono esenti dall\u2019imposta di bollo e da ogni spesa, tassa o diritto di qualsiasi specie e natura. Inoltre, l\u2019accordo di conciliazione \u00e8 esente dall\u2019imposta di registro fino al valore di \u20ac100.000. Per la parte eccedente tale importo, l\u2019imposta di registro \u00e8 dovuta secondo le aliquote ordinarie. Il precedente limite era di \u20ac50.000.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Costi Notarili e Spese per Questioni da Trascrivere",
    badge: "Art. 11 D.Lgs. 28/2010 \u2014 Art. 2643 c.c.",
    questions: [
      {
        q: "Quando serve il notaio nella mediazione civile?",
        a: "L\u2019intervento del notaio \u00e8 necessario quando l\u2019accordo di mediazione riguarda uno dei contratti o degli atti previsti dall\u2019art. 2643 del codice civile, ossia atti soggetti a trascrizione nei registri immobiliari. Ad esempio: trasferimenti di propriet\u00e0 immobiliare, costituzione o modifica di servit\u00f9, accertamenti di usucapione, divisioni immobiliari. In questi casi, ai sensi dell\u2019art. 11, comma 3, del D.Lgs. 28/2010, la sottoscrizione dell\u2019accordo deve essere autenticata da un pubblico ufficiale a ci\u00f2 autorizzato (notaio). Senza l\u2019autenticazione notarile, l\u2019accordo non pu\u00f2 essere trascritto e non \u00e8 opponibile ai terzi.",
      },
      {
        q: "Quali sono i costi notarili per la trascrizione dell\u2019accordo di mediazione?",
        a: "I costi notarili comprendono pi\u00f9 voci. 1) Onorario del notaio: liberalizzato dal D.L. 1/2012 e quindi non tariffato; il motore di calcolomediazione.it adotta scaglioni orientativi (\u20ac1.500 fino a \u20ac100.000 di valore, \u20ac2.000 fino a \u20ac200.000, \u20ac2.500 fino a \u20ac300.000, \u20ac3.200 fino a \u20ac500.000, \u20ac4.000 oltre). 2) IVA 22% sull\u2019onorario. 3) Contributo Cassa Nazionale del Notariato al 4% sull\u2019onorario. 4) Visure ipocatastali e voltura: stima forfettaria \u20ac300. 5) Imposta di registro (esente fino a \u20ac100.000 in mediazione, 2% prima casa / 9% altri immobili sull\u2019eccedenza). 6) Imposte ipotecaria e catastale in misura fissa (\u20ac50 + \u20ac50). 7) Imposta di bollo (\u20ac230 fuori mediazione, esente in mediazione). I valori sono stime orientative: per il preventivo effettivo \u00e8 sempre necessario rivolgersi al notaio.",
      },
      {
        q: "L\u2019accordo di mediazione immobiliare gode di esenzioni fiscali?",
        a: "S\u00ec, l\u2019accordo di mediazione gode di un regime fiscale agevolato ai sensi dell\u2019art. 17 del D.Lgs. 28/2010: 1) Esenzione totale dall\u2019imposta di bollo e da ogni spesa, tassa o diritto (comma 1). 2) Esenzione dall\u2019imposta di registro fino a \u20ac100.000 di valore (comma 2): per la parte eccedente si applica il 2% per la prima casa o il 9% per gli altri immobili. 3) Imposte ipotecaria e catastale: l\u2019Agenzia delle Entrate (Risposta n. 235/2020) ha sostenuto che l\u2019esenzione dell\u2019art. 17, co. 1, si estende anche a queste imposte; tuttavia, per prudenza operativa e in linea con l\u2019orientamento di numerose Conservatorie, il motore del calcolatore le mantiene nella misura fissa di \u20ac50 + \u20ac50. La giurisprudenza tributaria \u00e8 in evoluzione (cfr. anche la sezione Giurisprudenza). Il risparmio rispetto alla compravendita ordinaria resta significativo, soprattutto per immobili fino a \u20ac100.000.",
      },
      {
        q: "Quanto si risparmia con la prima casa nella mediazione immobiliare?",
        a: "Il risparmio principale riguarda l\u2019imposta di registro. In compravendita ordinaria prima casa: imposta di registro 2% sul valore catastale + ipotecaria \u20ac50 + catastale \u20ac50. In mediazione, fino a \u20ac100.000 il registro \u00e8 azzerato; oltre \u20ac100.000 si paga il 2% solo sulla parte eccedente. Esempio pratico: immobile prima casa con valore catastale \u20ac120.000: a) compravendita ordinaria \u2192 registro \u20ac2.400 + ipo/catastali \u20ac100 = \u20ac2.500; b) accordo in mediazione \u2192 registro 2% solo su \u20ac20.000 = \u20ac400 + ipo/catastali \u20ac100 = \u20ac500, con risparmio di circa \u20ac2.000 sulle sole imposte indirette. Per immobili fino a \u20ac100.000 il risparmio sull\u2019imposta di registro \u00e8 totale. A queste cifre vanno aggiunti onorario notarile, IVA, cassa e visure (vedi domanda dedicata).",
      },
      {
        q: "Le imposte ipotecarie e catastali sono davvero esenti per l\u2019accordo di mediazione?",
        a: "La questione ha avuto un\u2019evoluzione giurisprudenziale. L\u2019Agenzia delle Entrate, con la Risposta n. 235 del 31 luglio 2020, ha confermato che l\u2019esenzione di cui all\u2019art. 17 del D.Lgs. 28/2010 si estende anche alle imposte ipotecarie e catastali. Tuttavia, alcune Conservatorie dei Registri Immobiliari hanno talvolta rifiutato la trascrizione in assenza del pagamento. La giurisprudenza tributaria recente ha dato ragione ai contribuenti: l\u2019atto notarile necessario a garantire la trascrizione dell\u2019accordo di mediazione beneficia dell\u2019agevolazione tributaria generalizzata di cui al comma 1 dell\u2019art. 17, trattandosi di un necessario e conseguente atto del procedimento di mediazione.",
      },
      {
        q: "Cos\u2019\u00e8 la verifica di congruит\u00e0 del valore catastale e a cosa serve?",
        a: "La verifica di congruит\u00e0 (art. 29 D.M. 150/2023) consente di confrontare il valore dichiarato nella domanda di mediazione o nell\u2019accordo con il valore catastale dell\u2019immobile. Il valore catastale si calcola moltiplicando la rendita catastale per coefficienti specifici: x115,5 per la prima casa, x126 per altri fabbricati (cat. A e C escluse A/10 e C/1), x176,4 per cat. B, x63 per cat. A/10 e D, x42,84 per cat. C/1 ed E, x112,5 per terreni agricoli. Se il valore dichiarato \u00e8 inferiore al valore catastale, l\u2019Agenzia delle Entrate potrebbe contestare il valore ai fini fiscali. Il nostro calcolatore permette di effettuare questa verifica immediatamente, segnalando il livello di rischio.",
      },
      {
        q: "Quanto costa complessivamente trascrivere un accordo di mediazione immobiliare?",
        a: "Esempio concreto allineato al motore unificato di calcolomediazione.it. Immobile prima casa da \u20ac150.000 in accordo di mediazione: 1) Onorario notaio (scaglione \u20ac100k-\u20ac200k): \u20ac2.000; 2) IVA 22% su onorario: \u20ac440; 3) Cassa notarile 4%: \u20ac80; 4) Visure e volture: \u20ac300; 5) Imposta di registro 2% su \u20ac50.000 (eccedenza oltre \u20ac100.000): \u20ac1.000; 6) Imposta ipotecaria: \u20ac50; 7) Imposta catastale: \u20ac50; 8) Bollo: esente. Totale stimato: circa \u20ac3.920. Per un immobile non prima casa dello stesso valore l\u2019imposta di registro sarebbe del 9% su \u20ac50.000 = \u20ac4.500 e il totale salirebbe a circa \u20ac7.420. Per immobili fino a \u20ac100.000 prima casa il totale \u00e8 indicativamente \u20ac1.500 (onorario) + \u20ac330 (IVA) + \u20ac60 (cassa) + \u20ac300 (visure) + \u20ac0 (registro) + \u20ac100 (ipo/catastali) = circa \u20ac2.290. Confronta sempre con un preventivo del notaio.",
      },
    ],
  },
  {
    icon: TrendingUp,
    title: "Credito d\u2019Imposta in Mediazione",
    badge: "Art. 20 D.Lgs. 28/2010 \u2014 D.M. 1\u00b0 agosto 2023",
    questions: [
      {
        q: "Cos\u2019\u00e8 il credito d\u2019imposta per la mediazione civile?",
        a: "Il credito d\u2019imposta per la mediazione civile \u00e8 un incentivo fiscale previsto dall\u2019art. 20 del D.Lgs. 28/2010, come novellato dalla Riforma Cartabia (D.Lgs. 149/2022), e disciplinato nelle modalit\u00e0 operative dal D.M. 1\u00b0 agosto 2023 (pubblicato in G.U. n. 183 del 7 agosto 2023). Lo Stato riconosce alle parti che hanno partecipato a una procedura di mediazione un rimborso parziale, sotto forma di credito d\u2019imposta, dei costi sostenuti per l\u2019indennit\u00e0 versata all\u2019organismo di mediazione, per il compenso dell\u2019avvocato e, in certi casi, per il contributo unificato versato per il giudizio successivamente estinto.",
      },
      {
        q: "Quali sono gli importi massimi del credito d\u2019imposta?",
        a: "L\u2019art. 20 del D.Lgs. 28/2010 prevede tre tipologie di credito d\u2019imposta: a) Credito per indennit\u00e0 versata all\u2019organismo di mediazione: fino a \u20ac600 in caso di accordo, ridotto a \u20ac300 in caso di mancato accordo. b) Credito per compenso dell\u2019avvocato: fino a \u20ac600 in caso di accordo, ridotto a \u20ac300 in caso di mancato accordo. Questo credito spetta solo nelle mediazioni obbligatorie (art. 5, co. 1) e nelle mediazioni demandate dal giudice (art. 5-quater). c) Credito per contributo unificato: fino a \u20ac518, solo in caso di mediazione demandata dal giudice con accordo raggiunto che comporti l\u2019estinzione del giudizio. I crediti di cui alle lettere a) e b) sono cumulabili ma soggetti a un tetto di \u20ac600 per procedura. Il tetto annuale \u00e8 di \u20ac2.400 per le persone fisiche e \u20ac24.000 per le persone giuridiche.",
      },
      {
        q: "Chi pu\u00f2 richiedere il credito d\u2019imposta?",
        a: "Possono richiedere il credito d\u2019imposta: 1) Le parti (persone fisiche o giuridiche) che hanno partecipato a una procedura di mediazione conclusa dopo il 30 giugno 2023 e che hanno sostenuto costi documentati per indennit\u00e0 all\u2019organismo e/o compenso dell\u2019avvocato. 2) Gli organismi di mediazione, per l\u2019indennit\u00e0 non percepita dalle parti ammesse al patrocinio a spese dello Stato (art. 15-septies, co. 2, D.Lgs. 28/2010), fino a un massimo annuale di \u20ac24.000. Non \u00e8 possibile ottenere il credito d\u2019imposta per le mediazioni avviate prima del 30 giugno 2023.",
      },
      {
        q: "Entro quando va presentata la domanda?",
        a: "Ai sensi dell\u2019art. 3, commi 1 e 5, del D.M. 1\u00b0 agosto 2023, la domanda di attribuzione del credito d\u2019imposta deve essere presentata, a pena di inammissibilit\u00e0, tramite la piattaforma online ministeriale entro il 31 marzo dell\u2019anno successivo a quello di conclusione della procedura di mediazione. Per le mediazioni concluse nel 2025, la scadenza \u00e8 il 31 marzo 2026. Decorso inutilmente tale termine, non sar\u00e0 pi\u00f9 possibile ottenere il beneficio fiscale.",
      },
      {
        q: "Come si presenta la domanda?",
        a: "La domanda si presenta esclusivamente online tramite la piattaforma del Ministero della Giustizia accessibile all\u2019indirizzo https://lsg.giustizia.it/. Occorre autenticarsi con SPID, CIE o CNS, registrarsi sul portale e selezionare l\u2019applicativo Istanza credito di imposta. Si compila il form indicando: la tipologia di procedura, il numero d\u2019ordine dell\u2019Organismo di mediazione, il numero identificativo del procedimento, il valore della lite, la materia della controversia, la data dell\u2019accordo (o del verbale di mancato accordo), i dati della fattura dell\u2019organismo, le modalit\u00e0 e la data di pagamento. \u00c8 obbligatorio indicare un indirizzo PEC per le comunicazioni.",
      },
      {
        q: "Cosa succede dopo la presentazione della domanda?",
        a: "Dopo la presentazione della domanda, il Ministero della Giustizia effettua le verifiche ritenute necessarie. Entro il 30 aprile dell\u2019anno di presentazione, con decreto del Capo Dipartimento per gli Affari di Giustizia, viene riconosciuto l\u2019importo del credito d\u2019imposta effettivamente spettante a ciascun beneficiario, nei limiti di cui all\u2019art. 20, commi 2, 3 e 4 del D.Lgs. 28/2010, e nel rispetto del tetto massimo di spesa annuo (\u20ac51.821.400). Il Ministero comunica al richiedente l\u2019importo del credito riconosciuto.",
      },
      {
        q: "Come si utilizza il credito d\u2019imposta riconosciuto?",
        a: "Il credito d\u2019imposta \u00e8 utilizzabile esclusivamente in compensazione tramite modello F24, presentato obbligatoriamente tramite i servizi telematici dell\u2019Agenzia delle Entrate (Entratel/Fisconline), a partire dalla data di ricezione della comunicazione ministeriale. I codici tributo, istituiti con Risoluzioni n. 23/E e n. 24/E del 14 maggio 2024, sono: 7067 per indennit\u00e0 organismo e compenso avvocato; 7068 per il contributo unificato; 7069 per gli organismi di mediazione. Non \u00e8 prevista la possibilit\u00e0 di ottenere un rimborso diretto delle somme.",
      },
      {
        q: "Il credito d\u2019imposta per il compenso dell\u2019avvocato spetta sempre?",
        a: "No. Il credito d\u2019imposta commisurato al compenso dell\u2019avvocato (fino a \u20ac600 con accordo, \u20ac300 senza) spetta solo nelle mediazioni obbligatorie ai sensi dell\u2019art. 5, co. 1, del D.Lgs. 28/2010 (dove l\u2019assistenza legale \u00e8 obbligatoria) e nelle mediazioni demandate dal giudice ai sensi dell\u2019art. 5-quater. Non spetta invece nelle mediazioni volontarie o in quelle derivanti da clausola contrattuale.",
      },
      {
        q: "Cosa si intende per riduzione della met\u00e0 in caso di insuccesso?",
        a: "L\u2019art. 20, co. 2, del D.Lgs. 28/2010 prevede che in caso di insuccesso della mediazione (mancato raggiungimento dell\u2019accordo) i crediti d\u2019imposta per l\u2019indennit\u00e0 dell\u2019organismo e per il compenso dell\u2019avvocato sono ridotti della met\u00e0. Quindi, il credito per l\u2019indennit\u00e0 scende da \u20ac600 a \u20ac300 e quello per il compenso dell\u2019avvocato da \u20ac600 a \u20ac300. Il credito per il contributo unificato (\u20ac518) non si applica in caso di mancato accordo, perch\u00e9 presuppone l\u2019estinzione del giudizio a seguito dell\u2019accordo di conciliazione.",
      },
      {
        q: "Come si calcola il tetto di \u20ac600 per procedura?",
        a: "Il tetto di \u20ac600 per procedura (art. 20, co. 2, D.Lgs. 28/2010) si applica alla somma del credito per indennit\u00e0 organismo (lett. a) e del credito per compenso avvocato (lett. b). Esempio: se una parte ha versato \u20ac400 di indennit\u00e0 e \u20ac400 di compenso avvocato in una mediazione obbligatoria con accordo, il credito totale teorico sarebbe \u20ac800, ma viene ridotto a \u20ac600 per effetto del tetto per procedura. Il credito per il contributo unificato (lett. c) si cumula separatamente. Pertanto, il massimo ottenibile per una singola procedura \u00e8 \u20ac600 (indennit\u00e0 + avvocato) + \u20ac518 (contributo unificato) = \u20ac1.118.",
      },
      {
        q: "Le mediazioni avviate prima del 30 giugno 2023 danno diritto al credito?",
        a: "No. L\u2019art. 20 del D.Lgs. 28/2010, nella versione anteriore alle modifiche introdotte dalla Riforma Cartabia (D.Lgs. 149/2022, in vigore dal 30 giugno 2023), non ha mai ricevuto attuazione. Il D.M. 1\u00b0 agosto 2023 disciplina le modalit\u00e0 di presentazione della domanda solo per le procedure concluse in data successiva all\u2019entrata in vigore della riforma. Di conseguenza, le mediazioni avviate e concluse prima del 30 giugno 2023 non possono beneficiare del credito d\u2019imposta.",
      },
      {
        q: "Il credito d\u2019imposta spetta anche per la mediazione volontaria?",
        a: "S\u00ec, ma solo per l\u2019indennit\u00e0 versata all\u2019organismo di mediazione (art. 20, co. 1, primo periodo). Il credito per l\u2019indennit\u00e0 spetta a tutte le parti, indipendentemente dal tipo di mediazione (obbligatoria, demandata o volontaria), quando \u00e8 raggiunto l\u2019accordo di conciliazione (\u20ac600) o in caso di mancato accordo (\u20ac300). Tuttavia, il credito per il compenso dell\u2019avvocato spetta solo nelle mediazioni obbligatorie e demandate, e il credito per il contributo unificato spetta solo nelle mediazioni demandate con accordo.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Gratuito Patrocinio in Mediazione",
    badge: "Artt. 15-bis / 15-undecies D.Lgs. 28/2010 \u2014 D.M. 1\u00b0 agosto 2023",
    questions: [
      {
        q: "Cos\u2019\u00e8 il patrocinio a spese dello Stato in mediazione?",
        a: "Il patrocinio a spese dello Stato (comunemente chiamato gratuito patrocinio) in mediazione \u00e8 un beneficio introdotto dalla Riforma Cartabia (D.Lgs. 149/2022) che ha inserito nel D.Lgs. 28/2010 il nuovo Capo II-bis (artt. da 15-bis a 15-undecies), dedicato alle Disposizioni sul patrocinio a spese dello Stato nella mediazione civile e commerciale. Consente alle persone che si trovano in condizioni economiche disagiate di accedere alla mediazione senza sostenere i costi per l\u2019indennit\u00e0 dell\u2019organismo di mediazione e per il compenso dell\u2019avvocato, che vengono posti a carico dello Stato.",
      },
      {
        q: "Qual \u00e8 l\u2019evoluzione giuridica che ha portato al riconoscimento del gratuito patrocinio in mediazione?",
        a: "Il percorso \u00e8 stato lungo e articolato. La Corte di Cassazione, con sentenza n. 18123/2020, aveva escluso il gratuito patrocinio per l\u2019attivit\u00e0 stragiudiziale in generale. La svolta \u00e8 arrivata con la Corte Costituzionale (sentenza n. 10 del 20 gennaio 2022), che ha dichiarato l\u2019illegittimit\u00e0 costituzionale degli artt. 74, co. 2, e 75, co. 1, del D.P.R. 115/2002, nella parte in cui non prevedevano il patrocinio a spese dello Stato per l\u2019attivit\u00e0 difensiva svolta nell\u2019ambito del procedimento di mediazione. La Cassazione (ord. n. 7974/2024) ha poi individuato come data spartiacque il 21 gennaio 2022. La Riforma Cartabia ha infine regolamentato organicamente l\u2019istituto nel D.Lgs. 28/2010.",
      },
      {
        q: "Quali sono i requisiti per essere ammessi al gratuito patrocinio in mediazione?",
        a: "I requisiti sono previsti dagli artt. 15-bis e 15-ter del D.Lgs. 28/2010: 1) Deve trattarsi di mediazione obbligatoria ai sensi dell\u2019art. 5, co. 1, del D.Lgs. 28/2010. 2) La mediazione deve concludersi con il raggiungimento dell\u2019accordo. 3) Non si deve trattare di controversie per cessione di crediti e ragioni altrui, salvo che la cessione appaia fatta in pagamento di crediti o ragioni preesistenti (art. 15-bis, co. 2). 4) Il richiedente deve trovarsi nelle condizioni reddituali previste dalla normativa sul patrocinio a spese dello Stato (D.P.R. 115/2002).",
      },
      {
        q: "Come si presenta l\u2019istanza di ammissione al patrocinio in mediazione?",
        a: "L\u2019istanza di ammissione al patrocinio nel procedimento di mediazione (art. 15-quater, D.Lgs. 28/2010) deve essere presentata in via anticipata e preventiva, sia da chi intenda proporre domanda di mediazione sia da chi intenda aderire al procedimento. L\u2019istanza va presentata al Consiglio dell\u2019Ordine degli Avvocati (COA) del luogo ove ha sede l\u2019organismo di mediazione competente ai sensi dell\u2019art. 4, co. 1, D.Lgs. 28/2010.",
      },
      {
        q: "Entro quanto tempo il COA decide sull\u2019ammissione?",
        a: "Ai sensi dell\u2019art. 15-quinquies, co. 2, del D.Lgs. 28/2010, entro venti giorni dal deposito dell\u2019istanza il Consiglio dell\u2019Ordine degli Avvocati procede alle verifiche di ammissibilit\u00e0 e, in caso positivo, ammette l\u2019interessato al patrocinio in via anticipata e provvisoria, dandogliene immediata comunicazione. In caso di rigetto dell\u2019istanza, il richiedente pu\u00f2 proporre ricorso al Presidente del Tribunale competente (art. 15-sexies), che decide con decreto non impugnabile.",
      },
      {
        q: "Quali sono gli effetti dell\u2019ammissione al patrocinio a spese dello Stato?",
        a: "Gli effetti, previsti dall\u2019art. 15-septies del D.Lgs. 28/2010, sono: 1) L\u2019ammissione \u00e8 valida per l\u2019intero procedimento di mediazione. 2) La parte ammessa \u00e8 esonerata dal pagamento delle spese e delle indennit\u00e0 all\u2019organismo di mediazione. 3) L\u2019avvocato che assiste la parte ammessa non pu\u00f2 chiedere n\u00e9 percepire dal proprio assistito compensi o rimborsi a qualunque titolo diversi da quelli previsti dal Capo II-bis; ogni patto contrario \u00e8 nullo (art. 15-septies, co. 5). 4) L\u2019organismo di mediazione ottiene un credito d\u2019imposta per l\u2019indennit\u00e0 non percepita (art. 20, co. 4, fino a \u20ac24.000 annui).",
      },
      {
        q: "Come viene determinato il compenso dell\u2019avvocato ammesso al patrocinio?",
        a: "Il compenso dell\u2019avvocato \u00e8 disciplinato dall\u2019art. 4 del D.M. 1\u00b0 agosto 2023, che fa rinvio all\u2019art. 15-octies del D.Lgs. 28/2010. L\u2019avvocato ha diritto a un compenso nella misura prevista dall\u2019art. 20, co. 1-bis, del D.M. 55/2014 (parametri forensi per mediazione), ridotto della met\u00e0. Se la mediazione si conclude con accordo, le fasi di attivazione e negoziazione sono maggiorate del 30%. Sulla somma risultante si applica poi il rimborso forfettario del 15% per le spese generali, oltre IVA e CPA.",
      },
      {
        q: "L\u2019avvocato come ottiene il pagamento del compenso?",
        a: "Quando la mediazione si conclude con accordo, l\u2019ammissione anticipata al patrocinio viene confermata su istanza dell\u2019avvocato dal COA che ha deliberato l\u2019ammissione, mediante apposizione del visto di congruит\u00e0 sulla parcella (art. 15-septies, co. 3 e 4). Il COA verifica la completezza della documentazione e la congruит\u00e0 del compenso in base al valore dell\u2019accordo. Successivamente, il COA trasmette la parcella vistata al Ministero della Giustizia tramite la piattaforma ministeriale.",
      },
      {
        q: "Cosa succede se la mediazione non si conclude con accordo?",
        a: "Se la mediazione non si conclude con un accordo di conciliazione, l\u2019ammissione anticipata al patrocinio cessa i suoi effetti e non viene confermata (art. 15-septies, D.Lgs. 28/2010). In tal caso, la parte ammessa \u00e8 comunque esonerata dal pagamento delle indennit\u00e0 all\u2019organismo per la fase di mediazione svolta, ma l\u2019avvocato non matura il diritto al compenso a carico dello Stato tramite il patrocinio. Resta fermo il diritto della parte di avvalersi del patrocinio a spese dello Stato nell\u2019eventuale successivo giudizio civile, secondo le regole ordinarie del D.P.R. 115/2002.",
      },
      {
        q: "Il gratuito patrocinio vale anche per la mediazione volontaria o demandata?",
        a: "No. L\u2019ammissione al patrocinio a spese dello Stato in mediazione \u00e8 prevista esclusivamente per la mediazione obbligatoria ai sensi dell\u2019art. 5, co. 1, del D.Lgs. 28/2010 (art. 15-bis). Non si estende quindi alla mediazione volontaria, n\u00e9 alla mediazione derivante da clausola contrattuale, n\u00e9 alla mediazione demandata dal giudice ai sensi dell\u2019art. 5-quater.",
      },
      {
        q: "L\u2019organismo di mediazione \u00e8 obbligato ad accettare il procedimento con parte ammessa al patrocinio?",
        a: "S\u00ec. Ai sensi dell\u2019art. 17, co. 6, del D.Lgs. 28/2010, quando la mediazione \u00e8 condizione di procedibilit\u00e0 della domanda giudiziale (art. 5, co. 1) o \u00e8 demandata dal giudice (art. 5-quater, co. 2), all\u2019organismo non \u00e8 dovuta alcuna indennit\u00e0 dalla parte ammessa al patrocinio a spese dello Stato. L\u2019organismo deve comunque svolgere la procedura. Come compensazione, all\u2019organismo \u00e8 riconosciuto un credito d\u2019imposta commisurato all\u2019indennit\u00e0 non percepita, fino a un importo massimo annuale di \u20ac24.000 (art. 20, co. 4, D.Lgs. 28/2010).",
      },
      {
        q: "L\u2019ammissione al patrocinio pu\u00f2 essere revocata?",
        a: "S\u00ec. L\u2019art. 15-novies del D.Lgs. 28/2010 prevede che l\u2019ammissione al patrocinio possa essere revocata dal COA competente quando, in qualsiasi momento del procedimento, si accerti che le condizioni di reddito che hanno dato luogo all\u2019ammissione non sussistono o sono venute meno. La revoca ha effetto dalla comunicazione all\u2019interessato. Il COA d\u00e0 comunicazione della revoca anche al Ministero della Giustizia per gli eventuali recuperi.",
      },
    ],
  },
  {
    icon: Brain,
    title: "Analisi AI",
    questions: [
      {
        q: "Come funziona l\u2019analisi AI del caso?",
        a: "L\u2019analisi AI utilizza modelli di intelligenza artificiale avanzati per analizzare i documenti e le informazioni relative al caso di mediazione. Il processo prevede sette fasi: 1) Caricamento dei documenti; 2) Estrazione delle entit\u00e0 rilevanti (parti, importi, date); 3) Classificazione della materia; 4) Analisi giuridica preliminare; 5) Valutazione della complessit\u00e0; 6) Suggerimenti strategici; 7) Generazione del report.",
      },
      {
        q: "I dati inseriti sono sicuri e riservati?",
        a: "S\u00ec. La sicurezza e la riservatezza dei dati sono una priorit\u00e0 assoluta. Tutti i dati vengono trasmessi tramite connessione crittografata (HTTPS/TLS). I documenti caricati vengono elaborati in tempo reale e non vengono archiviati permanentemente sui nostri server. Il trattamento dei dati \u00e8 conforme al GDPR (Regolamento UE 2016/679) e alla normativa italiana sulla privacy. I dati non vengono condivisi con terze parti e vengono utilizzati esclusivamente per l\u2019analisi richiesta.",
      },
      {
        q: "L\u2019analisi AI sostituisce il parere di un avvocato?",
        a: "No, assolutamente no. L\u2019analisi AI fornisce un supporto informativo e orientativo, ma non costituisce in alcun modo un parere legale. L\u2019intelligenza artificiale pu\u00f2 aiutare a identificare le questioni giuridiche rilevanti, classificare la materia e fornire un\u2019analisi preliminare, ma non pu\u00f2 sostituire la consulenza di un professionista abilitato. Si raccomanda sempre di consultare un avvocato per valutazioni specifiche sul proprio caso.",
      },
      {
        q: "Quali tipi di analisi produce il sistema?",
        a: "Il sistema produce diversi tipi di analisi: 1) Analisi delle entit\u00e0: identificazione delle parti, importi, date e riferimenti normativi presenti nei documenti; 2) Classificazione della materia: determinazione automatica della materia di mediazione e verifica dell\u2019obbligatoriet\u00e0; 3) Analisi giuridica: inquadramento normativo e individuazione delle questioni giuridiche rilevanti; 4) Valutazione strategica: punti di forza e debolezza della posizione, possibili scenari; 5) Calcolo costi: stima automatica delle indennit\u00e0 di mediazione; 6) Report completo: documento riepilogativo con tutte le analisi effettuate e le raccomandazioni.",
      },
    ],
  },
];

export default function FAQ() {
  useEffect(() => {
    const allQuestions = faqSections.flatMap((section) => section.questions);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Domande Frequenti sulla Mediazione Civile",
      "description": "FAQ sulla mediazione civile e commerciale: costi, indennit\u00e0, credito d\u2019imposta, gratuito patrocinio e analisi AI.",
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
      <SeoHead
        title="FAQ Mediazione Civile — Domande Frequenti D.M. 150/2023 e D.Lgs. 28/2010"
        description="Le risposte alle domande più frequenti sulla mediazione civile: indennità, primo incontro, materie obbligatorie, agevolazioni fiscali art. 17, credito d’imposta, art. 5-quater (mediazione demandata)."
        canonical="https://calcolomediazione.it/faq"
      />
      <div className="max-w-4xl mx-auto">
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
            Tutto quello che c&apos;\u00e8 da sapere sulla mediazione civile, i costi previsti dal D.M. 150/2023,
            il credito d&apos;imposta (art. 20 D.Lgs. 28/2010), il gratuito patrocinio (artt. 15-bis/15-undecies)
            e il funzionamento della nostra piattaforma con analisi AI.
          </p>
        </div>

        <div className="space-y-8">
          {faqSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
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

        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Non hai trovato la risposta?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Prova i nostri calcolatori per ottenere calcoli precisi delle indennit&apos;\u00e0 e del credito d&apos;imposta,
            oppure avvia un\u2019analisi AI del tuo caso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calcolatore">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                Calcola Indennit&apos;\u00e0
              </span>
            </Link>
            <Link href="/credito-imposta">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                Credito d&apos;Imposta
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
