import { Link } from "wouter";
import { ArrowLeft, FileText, Scale, AlertTriangle, Gavel, HelpCircle } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-03 — Articolo "Procura sostanziale per la mediazione: guida aggiornata 2026
// alla luce di Cass. 9608 e 10978" (issue #54). Contenuto e nota di prudenza
// riprodotti in coerenza con quanto già pubblicato in /generatore-procura, /faq
// e /glossario — nessuna divergenza normativa, nessuna riformulazione della nota
// di prudenza su Cass. 10978/2026 (vedi PRIV-06).
export default function ProcuraSostanzialeMediazione() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Procura Sostanziale per la Mediazione: Guida Aggiornata 2026 (Cass. 9608 e 10978)"
        description="Procura sostanziale mediazione e procura speciale art. 8 D.Lgs. 28/2010: chi può rappresentare la parte, forma richiesta e la recente evoluzione della Cassazione (Cass. 9608/2026 e 10978/2026)."
        canonical="https://calcolomediazione.it/procura-sostanziale-mediazione"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/generatore-procura">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai al Generatore Procura
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Procura sostanziale per la mediazione: guida aggiornata 2026
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Chi può rappresentare la parte in mediazione, quale forma serve, e cosa cambia con Cass. 9608/2026 e 10978/2026.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Se non puoi (o non vuoi) presentarti personalmente al procedimento di mediazione, la legge ti permette
              di farti rappresentare — ma non con una procura qualunque. Serve una{" "}
              <strong className="text-foreground">procura sostanziale</strong>, distinta dalla procura al tuo avvocato
              per il giudizio, e la Cassazione ha precisato di recente chi può riceverla e come deve essere fatta.
            </p>
          </section>

          <section>
            <SectionTitle icon={FileText} title="Cosa dice la legge (art. 8, comma 4, D.Lgs. 28/2010)" />
            <p>
              L'art. 8, comma 4, del D.Lgs. 28/2010 prevede la comparizione personale della parte al procedimento di
              mediazione, ma ammette espressamente la rappresentanza tramite un terzo — anche il difensore — munito
              di <strong className="text-foreground">apposita procura speciale sostanziale</strong>, distinta dalla
              procura alle liti ex art. 83 c.p.c., che attribuisca il potere di disporre del diritto controverso.
            </p>
            <p className="mt-4">
              Il principio è stato fissato da Cass. 8473/2019 e confermato e precisato da Cass. 14676/2025 e dalle due
              ordinanze del 2026 di cui parliamo in questo articolo. Il rappresentante sostanziale deve essere a
              conoscenza dei fatti di causa e avere poteri dispositivi effettivi — conciliare, transigere,
              sottoscrivere l'accordo: una procura generica o limitata al giudizio non basta.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="I tre scenari possibili dopo Cass. 9608/2026 e 10978/2026" />
            <p>Sono oggi configurabili tre scenari per la procura sostanziale:</p>
            <ul className="list-disc ml-6 mt-3 space-y-3">
              <li>
                <strong className="text-foreground">Procura sostanziale a un terzo</strong> (familiare, collaboratore,
                fiduciario) — sempre ammissibile.
              </li>
              <li>
                <strong className="text-foreground">Procura sostanziale a un avvocato diverso dal difensore</strong> —
                sempre ammissibile, ed è la soluzione prudenziale anche alla luce di{" "}
                <Link href="/giurisprudenza/cassazione-9608-2026-fondamentale-il-difensore-non-puo-cumulare-i-ruoli-di">
                  <span className="underline cursor-pointer text-foreground font-medium">Cass. civ., Sez. III, ord. n. 9608 del 15 aprile 2026</span>
                </Link>
                , secondo cui il difensore non può cumulare in sé i distinti ruoli di parte e di suo assistente.
              </li>
              <li>
                <strong className="text-foreground">Procura sostanziale al medesimo difensore</strong> — è oggi
                ammessa da{" "}
                <Link href="/giurisprudenza/cassazione-10978-2026-procura-sostanziale-in-mediazione-ammissibile-il">
                  <span className="underline cursor-pointer text-foreground font-medium">Cass. civ., Sez. II, ord. n. 10978 del 24 aprile 2026</span>
                </Link>{" "}
                (Pres. Scarpa, Rel. Trapuzzano): nel procedimento di mediazione obbligatoria il difensore costituito
                può essere anche rappresentante sostanziale, purché munito di apposita procura distinta dalla procura
                alle liti, in forma scritta non autenticata (salvo accordi che richiedano trascrizione ex art. 2643 c.c.).
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-400 p-4">
              <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Nota di prudenza operativa</p>
                <p>
                  Cass. 10978/2026 è recentissima e potrebbe non essere ancora consolidata in tutti gli organismi di
                  mediazione. Si consiglia di valutare caso per caso e, ove possibile, di documentare con precisione
                  la procura sostanziale e la sua distinzione dalla procura alle liti. In caso di dubbio, la procura a
                  un avvocato diverso dal difensore (o a un terzo) resta la soluzione più prudente perché non dipende
                  dall'orientamento più recente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle icon={FileText} title="Che forma deve avere la procura?" />
            <p>
              Di regola la procura sostanziale per la mediazione richiede la sola{" "}
              <strong className="text-foreground">scrittura privata non autenticata</strong> con sottoscrizione del
              rappresentato, senza necessità di autenticazione notarile (Cass. 8473/2019, Cass. 14676/2025, Cass.
              10978/2026). L'art. 1392 c.c. impone la forma dell'atto da compiere solo quando il rappresentante deve
              concludere un negozio che richiede forma vincolata: ad esempio, se l'accordo di mediazione comporta atti
              soggetti a trascrizione (art. 2643 c.c.), la procura deve avere la stessa forma richiesta per quell'atto
              (scrittura privata autenticata o atto pubblico).
            </p>
          </section>

          <section>
            <SectionTitle icon={Gavel} title="Approfondisci la giurisprudenza" />
            <p>
              Il nostro database raccoglie tutte le pronunce sul tema, comprese quelle di merito su casi particolari
              come l'invito alla mediazione notificato al solo difensore. Puoi consultarle filtrando per categoria
              "Procura sostanziale".
            </p>
            <div className="mt-4">
              <Link href="/giurisprudenza">
                <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                  Approfondisci la giurisprudenza
                </span>
              </Link>
            </div>
          </section>

          <section>
            <SectionTitle icon={HelpCircle} title="Domande frequenti" />
            <p>
              Altre domande su chi può rappresentare la parte, sulla forma della procura e su cosa succede se l'invito
              alla mediazione è notificato solo all'avvocato sono raccolte nella pagina{" "}
              <Link href="/faq"><span className="underline cursor-pointer text-foreground font-medium">FAQ</span></Link>.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Genera la tua procura sostanziale
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Il generatore produce gratuitamente un modello di procura speciale sostanziale conforme all'orientamento
            più recente, separato dalla procura alle liti e adattato automaticamente alla materia. Ricordati di
            leggere la nota di prudenza operativa riportata sopra prima di scegliere lo scenario.
          </p>
          <Link href="/generatore-procura">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <FileText className="w-4 h-4" />
              Genera la tua procura
            </span>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo. Non costituiscono
          consulenza legale. Per una valutazione del proprio caso specifico, in particolare alla luce dell'evoluzione
          giurisprudenziale ancora in corso su Cass. 10978/2026, si raccomanda di consultare un avvocato abilitato.
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
