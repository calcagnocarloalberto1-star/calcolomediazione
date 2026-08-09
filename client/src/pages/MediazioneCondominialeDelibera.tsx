import { Link } from "wouter";
import { ArrowLeft, Building2, Scale, Gavel, HelpCircle, BookOpen } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-02 — Articolo "Mediazione condominiale: quando è obbligatoria e come funziona
// la delibera assembleare" (issue #54... in realtà #53). Ogni dato normativo qui
// riprodotto (art. 5-ter D.Lgs. 28/2010, maggioranze art. 1136 c.c., abrogazione
// art. 71-quater disp. att. c.c.) è identico a quanto già pubblicato in /faq e
// /glossario — nessuna divergenza di merito, solo esposizione discorsiva.
export default function MediazioneCondominialeDelibera() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Mediazione condominiale: quando è obbligatoria e come funziona la delibera assembleare"
        description="Mediazione condominio e delibera assembleare dopo la Riforma Cartabia: quando è obbligatoria, cosa può fare l'amministratore senza delibera (art. 5-ter D.Lgs. 28/2010) e quando serve invece l'assemblea."
        canonical="https://calcolomediazione.it/mediazione-condominiale-delibera-assembleare"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/giurisprudenza">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai alla Giurisprudenza
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mediazione condominiale: quando è obbligatoria e come funziona la delibera assembleare
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Cosa può fare l'amministratore senza convocare l'assemblea, e quando invece la delibera è indispensabile.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Se il tuo condominio è coinvolto in una controversia — con un condomino, un fornitore, il locatore di un
              negozio al piano terra — la prima domanda pratica è quasi sempre la stessa:{" "}
              <strong className="text-foreground">l'amministratore ha bisogno del via libera dell'assemblea prima di andare in mediazione?</strong>
            </p>
            <p className="mt-4">
              Dal 30 giugno 2023 la risposta è cambiata radicalmente rispetto al passato, grazie alla Riforma Cartabia.
              Vediamo la disciplina esatta, con le fonti normative aggiornate.
            </p>
          </section>

          <section>
            <SectionTitle icon={Building2} title="Il condominio è materia di mediazione obbligatoria" />
            <p>
              Le controversie condominiali rientrano tra le materie per cui la mediazione è{" "}
              <strong className="text-foreground">condizione di procedibilità</strong> della domanda giudiziale, ai sensi
              dell'art. 5, comma 1, del D.Lgs. 28/2010. In pratica: prima di poter fare causa su una questione
              condominiale, occorre prima tentare la mediazione — pena l'improcedibilità della domanda, che deve essere
              eccepita dal convenuto o rilevata dal giudice non oltre la prima udienza.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="L'amministratore può partecipare senza delibera preventiva (art. 5-ter)" />
            <p>
              Prima della riforma, l'art. 71-quater delle disposizioni di attuazione del codice civile richiedeva una
              delibera assembleare preventiva anche solo per <em>partecipare</em> alla mediazione: un vincolo che,
              nella pratica, poteva far perdere tempi preziosi o addirittura precludere l'esperimento della procedura
              nei termini.
            </p>
            <p className="mt-4">
              La Riforma Cartabia (D.Lgs. 149/2022) ha introdotto l'<strong className="text-foreground">art. 5-ter del D.Lgs. 28/2010</strong>,
              in vigore dal 30 giugno 2023, che ha cambiato le regole: l'amministratore di condominio è ora legittimato
              ad <strong className="text-foreground">attivare</strong> un procedimento di mediazione, ad{" "}
              <strong className="text-foreground">aderirvi</strong> e a <strong className="text-foreground">parteciparvi autonomamente</strong>,
              senza bisogno di alcuna delibera assembleare preventiva. La norma ha abrogato espressamente i commi 2, 4,
              5 e 6 del previgente art. 71-quater disp. att. c.c., che imponevano quel passaggio preliminare.
            </p>
          </section>

          <section>
            <SectionTitle icon={Gavel} title="Quando invece la delibera serve davvero" />
            <p>
              L'assemblea condominiale non esce di scena: interviene nella <strong className="text-foreground">fase finale</strong>.
              Il verbale contenente l'accordo di conciliazione, oppure la proposta conciliativa formulata dal
              mediatore, devono essere sottoposti all'approvazione dell'assemblea, che delibera entro il termine
              fissato nell'accordo o nella proposta stessa, con le maggioranze previste dall'art. 1136 c.c.
            </p>
            <p className="mt-4">
              Se l'assemblea non approva entro quel termine, la conciliazione si intende{" "}
              <strong className="text-foreground">non conclusa</strong>. In sintesi: l'amministratore può negoziare e
              condurre tutta la trattativa in autonomia, ma l'ultima parola sull'accordo resta ai condomini riuniti in
              assemblea.
            </p>
          </section>

          <section>
            <SectionTitle icon={Building2} title="Cosa cambia in pratica per l'amministratore" />
            <p>
              Il nuovo regime si applica a tutti i procedimenti di mediazione instaurati dopo il 30 giugno 2023. In
              pratica, per l'amministratore significa poter rispondere tempestivamente a un invito in mediazione, o
              attivarne uno, senza dover prima riunire l'assemblea — un passaggio che, specie fuori stagione o con
              condomini poco reattivi, poteva richiedere settimane. Resta comunque buona prassi informare
              tempestivamente i condomini dell'avvio della procedura, anche se la legge non lo impone come condizione
              di validità.
            </p>
          </section>

          <section>
            <SectionTitle icon={Gavel} title="Cosa dice la giurisprudenza" />
            <p>
              La Cassazione ha già avuto modo di applicare la nuova disciplina. In un caso relativo a immissioni
              rumorose da locali commerciali in condominio, la Suprema Corte ha confermato che l'amministratore può
              agire anche in sede di mediazione senza necessità di delibera preventiva, proprio in applicazione
              dell'art. 5-ter D.Lgs. 28/2010 (
              <Link href="/giurisprudenza/cassazione-23881-2025-immissioni-rumorose-da-locali-commerciali-posizione">
                <span className="underline cursor-pointer text-foreground font-medium">Cass. civ., Sez. III, n. 23881/2025</span>
              </Link>
              ). È invece un orientamento ormai superato, risalente al regime precedente la riforma, quello secondo cui
              l'amministratore privo di delibera preventiva non soddisfaceva la condizione di procedibilità (
              <Link href="/giurisprudenza/cassazione-20076-2020-mediazione-condominiale-delibera-assembleare">
                <span className="underline cursor-pointer text-foreground font-medium">Cass. civ., Sez. III, n. 20076/2020</span>
              </Link>
              , orientamento pre-Cartabia).
            </p>
            <div className="mt-6">
              <Link href="/giurisprudenza">
                <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                  <Gavel className="w-4 h-4" />
                  Approfondisci la giurisprudenza
                </span>
              </Link>
            </div>
          </section>

          <section>
            <SectionTitle icon={BookOpen} title="Termini e definizioni" />
            <p>
              Per una definizione sintetica di ogni termine tecnico citato in questo articolo — condizione di
              procedibilità, art. 5-ter, Riforma Cartabia — consulta il nostro{" "}
              <Link href="/glossario"><span className="underline cursor-pointer text-foreground font-medium">glossario della mediazione civile</span></Link>.
            </p>
          </section>

          <section>
            <SectionTitle icon={HelpCircle} title="Domande frequenti" />
            <p>
              Altre domande comuni su materie obbligatorie, durata del procedimento e casi particolari sono raccolte
              nella pagina{" "}
              <Link href="/faq"><span className="underline cursor-pointer text-foreground font-medium">FAQ</span></Link>.
            </p>
          </section>
        </div>

        <p className="text-xs text-muted-foreground mt-12 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla Riforma Cartabia (D.Lgs. 149/2022) e al D.Lgs. 28/2010. Non costituiscono consulenza legale. Per una
          valutazione del proprio caso specifico si raccomanda di consultare un avvocato o un amministratore
          professionista abilitato.
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
