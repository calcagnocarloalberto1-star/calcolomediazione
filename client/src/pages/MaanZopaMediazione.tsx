import { Link } from "wouter";
import { ArrowLeft, Target, Crosshair, Calculator, Handshake, BookOpen } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-08 — Articolo "MAAN e ZOPA in mediazione: come usare la teoria della
// negoziazione per chiudere l'accordo" (issue #59). NOTA anti-duplicazione:
// /strategie-negoziazione tratta già in profondità la teoria di MAAN, ZOPA e
// bias cognitivi (Fisher&Ury, Raiffa, Kahneman&Tversky...). Questo articolo
// non ripete quella trattazione teorica: si concentra su un caso pratico
// worked-example con numeri reali (stessa base dati di calcolaConfronto usata
// in CONT-04/mediazione-vs-causa-civile) e rimanda a /strategie-negoziazione
// per l'approfondimento teorico completo. CTA "Calcola la tua MAAN economica"
// verso /confronto-costi, link a /strategie-negoziazione e /confronto-costi.
export default function MaanZopaMediazione() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="MAAN e ZOPA in Mediazione: Come Chiudere l'Accordo con i Numeri"
        description="MAAN e ZOPA applicate a un caso reale di mediazione: come calcolare la propria alternativa economica al giudizio e individuare la zona di possibile accordo per chiudere la trattativa."
        canonical="https://calcolomediazione.it/maan-zopa-mediazione"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/strategie-negoziazione">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai alle Strategie di Negoziazione
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            MAAN e ZOPA in mediazione: come usare la teoria della negoziazione per chiudere l'accordo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Dalla teoria alla pratica: un caso reale, con numeri veri, per capire come calcolare la MAAN di
            ciascuna parte e individuare la ZOPA in cui l'accordo diventa possibile.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              MAAN (Migliore Alternativa All'Accordo Negoziato, in inglese BATNA) e ZOPA (Zona di Possibile
              Accordo) sono i due concetti cardine della teoria della negoziazione applicata alla mediazione. Nella
              nostra guida alle{" "}
              <Link href="/strategie-negoziazione"><span className="underline cursor-pointer text-foreground font-medium">strategie di negoziazione</span></Link>{" "}
              trovi la trattazione teorica completa — da Fisher e Ury a Kahneman e Tversky. Qui vediamo invece come
              questi concetti si traducono in pratica, con un caso concreto e numeri reali.
            </p>
          </section>

          <section>
            <SectionTitle icon={Target} title="Primo passo: calcolare la MAAN di ciascuna parte" />
            <p>
              In una controversia civile obbligatoria del valore di €30.000, la MAAN di entrambe le parti è il
              giudizio ordinario. Usando le stesse tariffe ufficiali del nostro strumento{" "}
              <Link href="/confronto-costi"><span className="underline cursor-pointer text-foreground font-medium">Confronto Costi</span></Link>{" "}
              (contributo unificato D.P.R. 115/2002, compensi avvocato D.M. 55/2014, indennità di mediazione D.M.
              150/2023), il costo per parte del primo grado di giudizio è di circa{" "}
              <strong className="text-foreground">€14.087</strong>, contro circa{" "}
              <strong className="text-foreground">€4.207</strong> per la mediazione (dettaglio completo nella nostra
              guida{" "}
              <Link href="/mediazione-vs-causa-civile"><span className="underline cursor-pointer text-foreground font-medium">Mediazione vs Causa Civile</span></Link>). Questo significa che la MAAN "economica" di ciascuna parte — il
              punto sotto (o sopra) il quale conviene andare in giudizio piuttosto che accettare l'accordo — non è
              un'impressione soggettiva, ma un numero calcolabile.
            </p>
          </section>

          <section>
            <SectionTitle icon={Crosshair} title="Secondo passo: individuare la ZOPA" />
            <p>
              Supponiamo che l'attore, forte di elementi probatori solidi, stimi la propria MAAN economica netta
              (importo che otterrebbe vincendo la causa, al netto dei costi di giudizio) attorno ai{" "}
              <strong className="text-foreground">€22.000</strong>: sotto questa soglia, andare in giudizio gli
              conviene di più che accettare un accordo peggiore. Il convenuto, dal canto suo, stima che perdere la
              causa gli costerebbe complessivamente circa <strong className="text-foreground">€32.000</strong>{" "}
              (importo della domanda più i costi di giudizio): sopra questa soglia, preferisce anch'egli il
              giudizio. La <strong className="text-foreground">ZOPA</strong> è quindi lo spazio tra questi due
              prezzi di riserva — nell'esempio, tra €22.000 e €32.000: qualsiasi accordo in questo intervallo
              conviene a entrambe le parti rispetto all'alternativa del processo, perché ciascuna risparmia sui
              costi (e sui tempi) del giudizio.
            </p>
          </section>

          <section>
            <SectionTitle icon={Handshake} title="Terzo passo: usare i numeri per chiudere l'accordo" />
            <p>
              Conoscere la propria MAAN — e, per quanto possibile, stimare quella della controparte — cambia
              concretamente il modo in cui si negozia. Una proposta che cade fuori dalla ZOPA (ad esempio,
              un'offerta del convenuto inferiore a €22.000) non verrà mai accettata da una parte razionale, perché
              per lei conviene di più il giudizio: il mediatore può usare questo dato per aiutare le parti a
              correggere proposte fuori mercato, invece di lasciarle scontrarsi su posizioni. Al contrario, quando
              entrambe le parti dispongono di un quadro economico oggettivo — come quello generato dal nostro
              strumento <Link href="/confronto-costi"><span className="underline cursor-pointer text-foreground font-medium">Confronto Costi</span></Link> — le concessioni si trasformano da "perdite" percepite
              in "risparmi" misurabili rispetto all'alternativa del processo: è più facile chiudere un accordo
              quando entrambe le parti vedono, con gli stessi numeri, che l'intervallo di accordo esiste davvero.
            </p>
            <p className="mt-4">
              Per approfondire i bias cognitivi che intervengono in questa fase — ancoraggio, avversione alla
              perdita, effetto framing — e come gestirli al tavolo della mediazione, la nostra guida completa alle{" "}
              <Link href="/strategie-negoziazione"><span className="underline cursor-pointer text-foreground font-medium">strategie di negoziazione</span></Link>{" "}
              analizza in dettaglio ciascun meccanismo, con esempi pratici e riferimenti alla letteratura scientifica
              (Fisher & Ury, Kahneman & Tversky, Raiffa, Thaler).
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calcola la tua MAAN economica
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Il nostro strumento calcola il confronto preciso tra mediazione e giudizio per il tuo valore di lite,
            per individuare la tua MAAN e negoziare con dati oggettivi.
          </p>
          <Link href="/confronto-costi">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Calcola la tua MAAN economica
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          <BookOpen className="w-3 h-3 inline-block mr-1 -mt-0.5" />
          Per la trattazione teorica completa di MAAN, ZOPA e degli altri bias cognitivi consulta la guida{" "}
          <Link href="/strategie-negoziazione"><span className="underline cursor-pointer text-foreground font-medium">Strategie di Negoziazione</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo. I valori
          dell'esempio sono calcolati con le tariffe ufficiali applicabili al momento della pubblicazione e possono
          variare in base al caso concreto; le soglie di riserva delle parti nell'esempio sono ipotetiche a scopo
          illustrativo. Non costituiscono consulenza legale. Per una valutazione del proprio caso specifico si
          raccomanda di consultare un avvocato abilitato.
        </p>
      </article>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 bg-primary/10 border-2 border-foreground flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
    </div>
  );
}
