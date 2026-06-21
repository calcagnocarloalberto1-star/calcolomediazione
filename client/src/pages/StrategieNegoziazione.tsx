import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Target, Crosshair, ShieldAlert, Scale, Eye, Frame, Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface StrategySection {
  icon: React.ElementType;
  title: string;
  badge?: string;
  questions: { q: string; a: string }[];
}

const strategySections: StrategySection[] = [
  {
    icon: Target,
    title: "MAAN — Migliore Alternativa All'Accordo Negoziato",
    badge: "Fisher & Ury, 1981",
    questions: [
      {
        q: "Cos'è la MAAN (o BATNA)?",
        a: "La MAAN — Migliore Alternativa All'Accordo Negoziato — è il concetto cardine della teoria della negoziazione introdotto da Roger Fisher e William Ury nel celebre \"Getting to Yes\" (1981). In inglese è nota come BATNA (Best Alternative To a Negotiated Agreement). Rappresenta la migliore opzione concretamente disponibile per una parte nel caso in cui la negoziazione non porti a un accordo. Non è un desiderio né un'ipotesi: è l'alternativa reale, valutata nei suoi costi, tempi e probabilità di successo.",
      },
      {
        q: "Perché la MAAN è così importante in mediazione?",
        a: "In mediazione civile, la MAAN di ciascuna parte è quasi sempre il giudizio ordinario. Ma il giudizio ha un costo — spesso sottovalutato: contributo unificato, compensi dell'avvocato per le diverse fasi processuali (studio, introduttiva, istruttoria, decisoria, secondo il D.M. 55/2014), eventuale CTU, imposta di registro sulla sentenza, e soprattutto il tempo. Una MAAN che non viene calcolata nei dettagli non è una MAAN — è un'illusione. Il mediatore che conosce i numeri del giudizio ordinario può aiutare le parti a valutare realisticamente se l'accordo in mediazione conviene più dell'alternativa.",
      },
      {
        q: "Come si calcola concretamente la MAAN?",
        a: "Calcolare la MAAN significa stimare il costo complessivo del percorso alternativo (il giudizio) e confrontarlo con il costo della mediazione. Le voci da considerare includono: il contributo unificato (che varia per scaglione di valore), i compensi legali secondo i parametri del D.M. 55/2014 (valori medi per ciascuna fase), l'eventuale CTU, l'imposta di registro sulla sentenza, e i costi indiretti (tempo, stress, incertezza dell'esito). La sezione \"Confronto Costi\" di CalcoloMediazione.it esegue automaticamente questo calcolo, mettendo a confronto cifra per cifra il percorso di mediazione con il giudizio ordinario — rendendo visibile la MAAN in modo oggettivo.",
      },
      {
        q: "Chi ha una MAAN forte ha un vantaggio in mediazione?",
        a: "Sì. Chi dispone di un'alternativa forte — ad esempio un caso giudiziario con alte probabilità di successo e costi contenuti — ha un potere negoziale maggiore, perché può permettersi di rifiutare proposte che non lo soddisfano. Al contrario, chi ha una MAAN debole (un giudizio costoso, incerto, lungo) ha più incentivo a trovare un accordo. Il mediatore consapevole di questa asimmetria può facilitare il dialogo aiutando entrambe le parti a valutare le proprie alternative con realismo, senza che la parte con la MAAN debole accetti condizioni inique per paura del giudizio, né che la parte forte sfrutti la posizione in modo irragionevole.",
      },
    ],
  },
  {
    icon: Crosshair,
    title: "ZOPA — Zona di Possibile Accordo",
    badge: "Raiffa, 1982",
    questions: [
      {
        q: "Cos'è la ZOPA?",
        a: "La ZOPA — Zone of Possible Agreement, Zona di Possibile Accordo — è l'intervallo in cui le posizioni delle parti si sovrappongono, rendendo possibile un accordo vantaggioso per entrambe. È stata formalizzata da Howard Raiffa in \"The Art and Science of Negotiation\" (1982). In termini concreti: se l'attore non accetta meno di 30.000 euro e il convenuto è disposto a pagare fino a 40.000 euro, la ZOPA è lo spazio tra 30.000 e 40.000 euro. Qualsiasi accordo in quell'intervallo è migliore, per entrambe le parti, rispetto all'alternativa del giudizio.",
      },
      {
        q: "Come si collega la ZOPA alla MAAN?",
        a: "La ZOPA dipende direttamente dalla MAAN di ciascuna parte. Il limite inferiore della ZOPA è determinato dal \"prezzo di riserva\" dell'attore — il punto sotto il quale preferisce andare in giudizio (la sua MAAN). Il limite superiore è il prezzo di riserva del convenuto — il punto sopra il quale preferisce difendersi in tribunale. Se le due MAAN non si sovrappongono (il minimo dell'attore supera il massimo del convenuto), la ZOPA è negativa e l'accordo, su quella base, non è possibile. Per questo calcolare le MAAN è il primo passo per identificare la ZOPA.",
      },
      {
        q: "Cosa succede quando la ZOPA è negativa?",
        a: "Una ZOPA negativa non significa necessariamente che la mediazione è destinata a fallire. Può significare che le parti stanno valutando le proprie alternative in modo irrealistico (sopravvalutando la probabilità di vittoria in giudizio o sottovalutandone i costi), oppure che la trattativa è limitata a una sola variabile (il denaro). Il mediatore esperto può lavorare per \"allargare la torta\": introdurre variabili non monetarie (tempi di pagamento, garanzie, scuse formali, clausole di riservatezza, accordi futuri) che creano valore aggiuntivo e possono trasformare una ZOPA negativa in positiva.",
      },
      {
        q: "L'Analisi AI di CalcoloMediazione aiuta a individuare la ZOPA?",
        a: "Sì. L'Analisi AI genera un quadro economico completo del caso: costi della mediazione in ogni scenario (accordo, mancato accordo, con e senza mediatore esperto, con e senza gratuito patrocinio), costi del contenzioso ordinario, vantaggi fiscali ed esenzioni fino a 100.000 euro. Questo quadro permette al mediatore e all'avvocato di stimare concretamente i limiti economici delle parti — cioè la ZOPA — trasformando un concetto teorico in un dato operativo. L'analisi è esportabile in PDF professionale e può essere anonimizzata per finalità di studio.",
      },
    ],
  },
  {
    icon: ShieldAlert,
    title: "Ancoraggio (Anchoring Effect)",
    badge: "Tversky & Kahneman, 1974",
    questions: [
      {
        q: "Cos'è l'effetto ancoraggio nella negoziazione?",
        a: "L'effetto ancoraggio è un bias cognitivo descritto da Amos Tversky e Daniel Kahneman nel 1974: la prima informazione ricevuta — l'\"àncora\" — influenza in modo sproporzionato tutte le valutazioni successive, anche quando è arbitraria o irrilevante. In una negoziazione, la prima cifra messa sul tavolo diventa il punto di riferimento per l'intera trattativa. Se l'attore apre con una richiesta di 100.000 euro, le offerte successive vengono valutate in relazione a quel numero, anche se il valore realistico della controversia è molto diverso.",
      },
      {
        q: "L'ancoraggio funziona anche con i professionisti esperti?",
        a: "Sì. La ricerca del Program on Negotiation di Harvard ha dimostrato che anche i professionisti esperti — giudici, avvocati, mediatori — sono influenzati dall'ancoraggio, spesso senza rendersene conto. Uno studio ha mostrato che persino ancore numeriche completamente casuali influenzano le decisioni giudiziarie. La consapevolezza del bias è il primo passo per mitigarlo, ma non lo elimina del tutto: è una tendenza profonda del funzionamento cognitivo umano.",
      },
      {
        q: "Come può il mediatore gestire l'ancoraggio?",
        a: "Il mediatore consapevole dell'ancoraggio può intervenire in diversi modi. Primo: aiutare la parte che formula la prima proposta a costruire un'àncora \"credibile\" — ambiziosa ma supportata da dati verificabili (costi del giudizio, parametri forensi, precedenti giurisprudenziali) — evitando che cada nella \"zona dell'insulto\" che provoca chiusura e irrigidimento. Secondo: quando riceve un'àncora estrema, aiutare l'altra parte a non reagire emotivamente ma a riformulare la discussione su basi oggettive. Un prospetto economico dettagliato — come quello generato dall'Analisi AI — può servire da \"contro-àncora\" fondata sui dati anziché sulle impressioni.",
      },
      {
        q: "Perché i dati economici sono un antidoto all'ancoraggio?",
        a: "Un'àncora è tanto più potente quanto meno informazioni alternative ha a disposizione chi la riceve. Se una parte formula una richiesta elevata e l'altra parte non ha riferimenti numerici per valutarla, l'àncora condiziona tutto il negoziato. Ma se il mediatore o l'avvocato dispongono di un quadro economico completo — indennità di mediazione, compensi forensi, costo del giudizio, credito d'imposta, esenzioni — l'àncora perde forza perché viene confrontata con dati oggettivi. È la differenza tra negoziare al buio e negoziare con una mappa.",
      },
    ],
  },
  {
    icon: Eye,
    title: "Avversione alla Perdita (Loss Aversion)",
    badge: "Kahneman & Tversky, 1979",
    questions: [
      {
        q: "Cos'è l'avversione alla perdita?",
        a: "L'avversione alla perdita (loss aversion) è uno dei pilastri della Prospect Theory di Daniel Kahneman e Amos Tversky (1979), che valse a Kahneman il Nobel per l'Economia nel 2002. Il principio: le perdite pesano psicologicamente circa il doppio dei guadagni equivalenti. Perdere 1.000 euro causa un dolore più intenso del piacere di guadagnarne 1.000. Questo semplice dato ha implicazioni profonde per la negoziazione: ogni concessione viene percepita come una perdita, e quindi viene resistita con forza sproporzionata rispetto al suo valore oggettivo.",
      },
      {
        q: "Come si manifesta l'avversione alla perdita in mediazione?",
        a: "In mediazione, l'avversione alla perdita si manifesta in un fenomeno che ogni mediatore conosce: le parti fanno una fatica enorme a fare concessioni. Ciascuna parte percepisce le proprie concessioni come \"perdite\" dolorose, mentre le concessioni dell'avversario appaiono insufficienti o dovute. Il risultato è una simmetria di insoddisfazione che può bloccare la trattativa: entrambe le parti si sentono \"dalla parte sbagliata\" dello scambio, anche quando l'accordo è oggettivamente vantaggioso per entrambe. Yair Livneh, nella Harvard Negotiation Law Review, ha analizzato in dettaglio come la loss aversion costituisca un ostacolo sistematico alla chiusura degli accordi.",
      },
      {
        q: "Come si supera l'avversione alla perdita?",
        a: "La tecnica principale è il reframing — il cambio di cornice. Anziché presentare una concessione come una perdita (\"rinunci a 10.000 euro\"), la si presenta come evitamento di una perdita maggiore (\"eviti un giudizio che ti costerebbe 15.000 euro in più tra spese legali, tempo e incertezza\"). Come hanno evidenziato Neale e Bazerman, cambiare il punto di riferimento delle parti — trasformando il frame da perdita a guadagno — aumenta la propensione a fare concessioni e la probabilità di raggiungere l'accordo. Per il mediatore e l'avvocato, questo richiede di avere i numeri pronti: sapere esattamente quanto costerebbe il giudizio permette di costruire un reframing credibile e concreto.",
      },
      {
        q: "Perché il confronto economico mediazione-processo aiuta a superare il bias?",
        a: "Il confronto economico tra mediazione e processo è lo strumento naturale per il reframing. Quando il mediatore può mostrare — con un prospetto cifra per cifra — che il giudizio ordinario costerebbe complessivamente di più rispetto all'accordo in mediazione (considerando indennità, compensi, contributo unificato, CTU, imposta di registro, tempi), la concessione smette di essere percepita come una \"perdita\" e viene riformulata come un \"risparmio\" rispetto all'alternativa peggiore. La sezione Confronto Costi di CalcoloMediazione.it è stata pensata esattamente per questo: fornire al mediatore la base numerica per il reframing.",
      },
    ],
  },
  {
    icon: Frame,
    title: "Effetto Framing (Framing Effect)",
    badge: "Tversky & Kahneman, 1981",
    questions: [
      {
        q: "Cos'è l'effetto framing?",
        a: "L'effetto framing, dimostrato da Tversky e Kahneman nel 1981 con il celebre esperimento della \"malattia asiatica\", descrive come la presentazione di un'informazione influenzi la decisione, anche quando il contenuto sostanziale è identico. Le persone tendono ad essere avverse al rischio quando le opzioni sono formulate in termini di guadagni, ma propense al rischio quando le stesse opzioni sono formulate in termini di perdite. La cornice (frame) cambia, il contenuto resta lo stesso — eppure le decisioni cambiano radicalmente.",
      },
      {
        q: "Come si applica il framing alla mediazione?",
        a: "In mediazione, il framing ha un'applicazione diretta e concreta. La stessa proposta può essere formulata in due modi: \"Accettando l'accordo a 40.000 euro ottieni 40.000 euro certi\" (frame positivo, guadagno) oppure \"Rifiutando l'accordo rischi di perdere tutto al processo e di spendere altri 15.000 euro\" (frame negativo, perdita). La ricerca mostra che gli attori (che ragionano in termini di guadagno) tendono ad accettare le offerte ragionevoli, mentre i convenuti (che ragionano in termini di perdita) tendono a rifiutarle preferendo il rischio del giudizio. Il mediatore consapevole può calibrare la comunicazione per aiutare ciascuna parte a valutare la proposta nel frame più appropriato.",
      },
      {
        q: "Framing e avversione alla perdita sono collegati?",
        a: "Strettamente. L'avversione alla perdita spiega perché le perdite pesano più dei guadagni; il framing spiega come la stessa situazione possa essere percepita come guadagno o come perdita a seconda di come viene presentata. Insieme, questi due concetti formano il nucleo operativo della Prospect Theory. Per il mediatore, la consapevolezza di entrambi i bias consente di scegliere il momento e il modo giusto per presentare una proposta: con il frame del guadagno per chi sta per accettare, con il frame dell'evitamento della perdita per chi resiste a fare concessioni.",
      },
    ],
  },
  {
    icon: Scale,
    title: "Effetto Dotazione (Endowment Effect)",
    badge: "Thaler, 1980",
    questions: [
      {
        q: "Cos'è l'effetto dotazione?",
        a: "L'effetto dotazione (endowment effect), descritto da Richard Thaler nel 1980 e confermato sperimentalmente da Kahneman, Knetsch e Thaler nel 1990, è la tendenza a sopravvalutare ciò che possediamo rispetto a ciò che non possediamo, per il solo fatto di possederlo. Una tazza da caffè acquistata a 5 euro viene valutata circa il doppio dal suo proprietario rispetto a quanto un acquirente sarebbe disposto a pagare. Questo non è un calcolo razionale: è un bias cognitivo radicato nella psicologia umana.",
      },
      {
        q: "Come si manifesta l'effetto dotazione in mediazione?",
        a: "In mediazione civile, l'effetto dotazione si manifesta in modo pervasivo. Il proprietario di un immobile oggetto di controversia gli attribuisce un valore superiore a quello di mercato. L'attore che ha già una sentenza di primo grado favorevole la considera più solida e più \"sua\" di quanto non sia oggettivamente. Il titolare di un credito contestato lo percepisce come un bene acquisito a cui sta \"rinunciando\". Il risultato è che le aspettative vengono gonfiate — le parti chiedono di più e concedono di meno di quanto sarebbe razionalmente giustificato.",
      },
      {
        q: "Come può il mediatore gestire l'effetto dotazione?",
        a: "Il correttivo principale è la realtà dei numeri. Mostrare il costo effettivo dell'appello, dell'esecuzione, del tempo di attesa — e confrontarlo con il valore certo e immediato dell'accordo in mediazione, comprensivo delle esenzioni fiscali fino a 100.000 euro — aiuta a riportare le aspettative a un livello realistico. Il mediatore può anche utilizzare la tecnica del \"test di realtà\": porre domande che invitano la parte a valutare la propria posizione come se fosse un osservatore esterno, riducendo l'identificazione emotiva con il \"bene posseduto\" (sia esso un immobile, un credito o una sentenza favorevole).",
      },
    ],
  },
  {
    icon: ShieldAlert,
    title: "Svalutazione Reattiva (Reactive Devaluation)",
    badge: "Ross & Stillinger, 1991",
    questions: [
      {
        q: "Cos'è la svalutazione reattiva?",
        a: "La svalutazione reattiva (reactive devaluation), studiata da Lee Ross e Constance Stillinger a Stanford nel 1991, è la tendenza a svalutare automaticamente qualsiasi proposta o concessione proveniente dall'avversario, per il solo fatto che proviene dall'avversario. Un'offerta ragionevole diventa sospetta se è l'altra parte a formularla. Non è un calcolo strategico: è un processo psicologico automatico che scatta indipendentemente dalla qualità della proposta.",
      },
      {
        q: "Come si manifesta la svalutazione reattiva in mediazione?",
        a: "In mediazione, la svalutazione reattiva è un ostacolo quotidiano. La parte che riceve un'offerta dal proprio avversario tende a pensare: \"Se me lo propone lui, è perché ci guadagna — quindi per me è un cattivo affare.\" Lo studio di Ross e colleghi ha mostrato che la stessa proposta viene valutata significativamente peggio quando è attribuita all'avversario rispetto a quando appare come un'opzione neutra o viene suggerita da un terzo. Questo crea un circolo vizioso: l'offerta viene respinta, la controparte si irrigidisce, e la trattativa si blocca.",
      },
      {
        q: "Come può il mediatore neutralizzare la svalutazione reattiva?",
        a: "La strategia più efficace è far emergere le proposte come opzioni generate dal processo di mediazione stesso, anziché come concessioni di una parte all'altra. Il mediatore che presenta uno scenario economico oggettivo — prodotto da un sistema terzo e verificabile — toglie alla proposta il \"marchio\" dell'avversario. Un prospetto dettagliato dei costi e dei benefici, generato dall'Analisi AI e presentato come dato tecnico, ha una forza persuasiva diversa rispetto alla stessa cifra proposta dall'altra parte. È la differenza tra \"ti offro 40.000\" e \"i numeri mostrano che 40.000 è il punto di equilibrio economico per entrambi\".",
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "Prospect Theory — La teoria che unisce tutto",
    badge: "Kahneman & Tversky, 1979 — Nobel 2002",
    questions: [
      {
        q: "Cos'è la Prospect Theory?",
        a: "La Prospect Theory (Teoria del Prospetto) è stata formulata da Daniel Kahneman e Amos Tversky nel 1979 ed è considerata la più importante teoria comportamentale sulle decisioni in condizioni di incertezza. Ha valso a Kahneman il Premio Nobel per l'Economia nel 2002. Il nucleo della teoria: le persone non valutano i risultati in termini assoluti, ma relativamente a un punto di riferimento (reference point); le perdite pesano circa il doppio dei guadagni equivalenti (loss aversion); e le persone tendono a essere avverse al rischio di fronte a guadagni certi ma propense al rischio di fronte a perdite certe.",
      },
      {
        q: "Perché la Prospect Theory è rilevante per la mediazione?",
        a: "La Prospect Theory è il quadro teorico che unifica tutti i bias cognitivi rilevanti per la negoziazione. L'avversione alla perdita, il framing, l'ancoraggio, l'effetto dotazione — sono tutti fenomeni che la Prospect Theory predice e spiega. In mediazione, la teoria spiega perché gli attori (che ragionano in termini di guadagno) e i convenuti (che ragionano in termini di perdita) si comportano in modo sistematicamente diverso di fronte alla stessa proposta. Spiega perché le concessioni sono così difficili, perché le aspettative sono spesso irrealistiche, e perché il modo in cui si presenta un'opzione conta almeno quanto il contenuto dell'opzione stessa.",
      },
      {
        q: "Come può un mediatore usare la Prospect Theory nella pratica?",
        a: "Il mediatore informato dalla Prospect Theory adotta un approccio strategico alla comunicazione. Con l'attore (che valuta guadagni), enfatizza il valore certo dell'accordo rispetto all'incertezza del giudizio. Con il convenuto (che valuta perdite), enfatizza il costo certo del giudizio rispetto al risparmio dell'accordo. Utilizza i dati economici come strumento di reframing: il prospetto dei costi trasforma la percezione da \"rinuncio a qualcosa\" a \"evito un costo maggiore\". Gestisce le àncore con consapevolezza, introduce le proposte in modo da minimizzare la svalutazione reattiva, e aiuta le parti a superare l'effetto dotazione confrontando le aspettative con i numeri reali.",
      },
      {
        q: "CalcoloMediazione.it integra la Prospect Theory?",
        a: "CalcoloMediazione.it è stato progettato come lo strumento operativo che traduce la Prospect Theory in pratica quotidiana. Il Confronto Costi rende visibile la MAAN (giudizio ordinario), permettendo il reframing dalla \"perdita\" della concessione al \"risparmio\" rispetto al giudizio. L'Analisi AI genera scenari economici completi che aiutano a identificare la ZOPA e a costruire àncora credibili. Il tutto in un quadro che permette al mediatore e all'avvocato di disporre dei numeri necessari per superare i bias cognitivi e guidare le parti verso un accordo informato e consapevole.",
      },
    ],
  },
];

// Flatten all Q&A for JSON-LD
const allFaqItems = strategySections.flatMap((s) => s.questions);

export default function StrategieNegoziazione() {
  useEffect(() => {
    document.title =
      "Strategie di Negoziazione — MAAN, ZOPA, Bias Cognitivi | CalcoloMediazione";

    // JSON-LD FAQPage schema
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
      creator: {
        "@type": "SoftwareApplication",
        name: "Perplexity Computer",
        url: "https://www.perplexity.ai/computer",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Guida completa alle strategie di negoziazione in mediazione civile: MAAN (BATNA), ZOPA, ancoraggio, avversione alla perdita, effetto framing, effetto dotazione, svalutazione reattiva e Prospect Theory. Con strumenti di calcolo integrati."
      );
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Strategie di Negoziazione — MAAN/BATNA, ZOPA, Ancoraggio, Metodo Harvard"
        description="Le principali strategie di negoziazione applicate alla mediazione civile: MAAN/BATNA, ZOPA, ancoraggio, metodo Harvard, negoziazione integrativa e gestione delle emozioni al tavolo."
        canonical="https://calcolomediazione.it/strategie-negoziazione"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 bg-primary/10 border-2 border-foreground flex items-center justify-center flex-shrink-0"
            >
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Strategie di Negoziazione
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Le teorie cognitive e i concetti fondamentali della negoziazione applicati alla mediazione civile:
            MAAN, ZOPA, ancoraggio, avversione alla perdita, framing, effetto dotazione, svalutazione reattiva e Prospect Theory.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="text-xs font-mono border-foreground/30">
              Fisher & Ury
            </Badge>
            <Badge variant="outline" className="text-xs font-mono border-foreground/30">
              Kahneman & Tversky
            </Badge>
            <Badge variant="outline" className="text-xs font-mono border-foreground/30">
              Prospect Theory
            </Badge>
            <Badge variant="outline" className="text-xs font-mono border-foreground/30">
              Harvard PON
            </Badge>
          </div>
        </div>

        {/* Intro box */}
        <div className="border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Perché questa pagina
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                La mediazione non è solo una questione di numeri — è una questione di come i numeri vengono percepiti.
                Le teorie cognitive sviluppate negli ultimi quarant'anni da Fisher, Ury, Kahneman, Tversky, Thaler e Ross
                offrono al mediatore e all'avvocato strumenti concreti per comprendere i meccanismi decisionali delle parti,
                superare gli ostacoli psicologici alla chiusura dell'accordo e costruire proposte che vengano valutate
                per il loro valore reale, non per i bias che le distorcono.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                CalcoloMediazione.it traduce queste teorie in pratica quotidiana, fornendo i dati economici
                necessari per calcolare la MAAN, individuare la ZOPA e superare i bias cognitivi con il rigore dei numeri.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {strategySections.map((section, sectionIdx) => (
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
                  <Badge
                    variant="outline"
                    className="text-xs font-mono border-foreground/30 whitespace-nowrap self-start sm:self-auto"
                  >
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
            Metti in pratica le strategie
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Usa i nostri strumenti per calcolare la MAAN, individuare la ZOPA e preparare un quadro
            economico completo per la tua prossima mediazione.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/confronto-costi">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                Confronto Costi (MAAN)
              </span>
            </Link>
            <Link href="/analisi-caso-ai">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <Brain className="w-4 h-4" />
                Analisi AI (ZOPA)
              </span>
            </Link>
            <Link href="/calcolatore">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <Scale className="w-4 h-4" />
                Calcolatore Indennità
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
