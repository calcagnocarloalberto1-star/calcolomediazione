import { Link } from "wouter";
import { HelpCircle, Euro, Brain, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSection {
  icon: React.ElementType;
  title: string;
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
        q: "Quanto dura un procedimento di mediazione?",
        a: "La durata massima del procedimento di mediazione è di tre mesi dalla data di deposito della domanda, prorogabili di ulteriori tre mesi dopo il primo incontro con il consenso delle parti. Il primo incontro informativo si svolge generalmente entro 30 giorni dal deposito della domanda. Nella pratica, molte mediazioni si concludono in 1-3 incontri, nell'arco di alcune settimane. Il termine di tre mesi non è perentorio, ma il suo superamento non produce effetti sulla procedibilità dell'azione giudiziaria.",
      },
      {
        q: "Quanto costa la mediazione?",
        a: "I costi della mediazione sono regolati dal D.M. 150/2023 e comprendono le spese di avvio (€40 per ciascuna parte) e le indennità di mediazione, che variano in base al valore della controversia secondo scaglioni predefiniti. Per una controversia fino a €1.000, l'indennità è di €60; per una controversia tra €250.001 e €500.000, l'indennità è di €1.800. Sono previste riduzioni per le mediazioni obbligatorie e demandaate (-20%) e maggiorazioni in caso di accordo (+20%). Il nostro calcolatore permette di determinare l'importo esatto in base ai parametri specifici del caso.",
      },
    ],
  },
  {
    icon: Euro,
    title: "Indennità e Costi",
    questions: [
      {
        q: "Come si calcola l'indennità di mediazione secondo il D.M. 150/2023?",
        a: "L'indennità di mediazione si calcola in base al valore della controversia, secondo la Tabella A allegata al D.M. 150/2023. Il calcolo prevede: 1) Individuazione dello scaglione in base al valore della lite; 2) Determinazione delle spese di avvio (€40); 3) Applicazione dell'indennità base per lo scaglione; 4) Applicazione delle eventuali riduzioni (mediazione obbligatoria/demandata: -20%); 5) Applicazione delle eventuali maggiorazioni (accordo raggiunto: +20%); 6) Aggiunta dell'IVA al 22%. Per gli incontri successivi al primo, le spese di avvio vengono detratte dall'indennità.",
      },
      {
        q: "Quali sono le spese di avvio?",
        a: "Le spese di avvio ammontano a €40 per ciascuna parte e sono dovute al momento del deposito della domanda di mediazione. Queste spese sono fisse e non variano in base al valore della controversia. Negli incontri successivi al primo, le spese di avvio vengono detratte dall'indennità complessiva dovuta, per evitare una doppia imposizione.",
      },
      {
        q: "Cosa succede in caso di gratuito patrocinio?",
        a: "Nel caso in cui una delle parti sia ammessa al gratuito patrocinio (patrocinio a spese dello Stato), l'organismo di mediazione non può richiedere il pagamento dell'indennità di mediazione a tale parte. L'indennità è posta a carico dell'erario nei limiti e secondo le modalità previste dalla normativa vigente. L'organismo è tenuto ad accettare la domanda di mediazione e a svolgere il procedimento anche in assenza del pagamento dell'indennità da parte dell'ammesso al patrocinio.",
      },
      {
        q: "Ci sono riduzioni per mancato accordo al primo incontro?",
        a: "Sì. Se la mediazione si conclude al primo incontro senza accordo, le parti devono corrispondere solo le spese di avvio (€40) e l'indennità relativa al primo incontro, eventualmente ridotta del 20% se la mediazione è obbligatoria o demandata. Non sono dovute le indennità per gli incontri successivi. Questa previsione mira a contenere i costi per le parti quando la mediazione non prosegue oltre il primo incontro informativo.",
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
            Tutto quello che c'è da sapere sulla mediazione civile, i costi previsti dal D.M. 150/2023
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
              <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-foreground bg-muted/30">
                <div className="w-10 h-10 bg-primary/10 border-2 border-foreground flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {section.title}
                </h2>
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
            Prova il nostro calcolatore per ottenere un calcolo preciso delle indennità,
            oppure avvia un'analisi AI del tuo caso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calcolatore">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                Calcola Indennità
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
