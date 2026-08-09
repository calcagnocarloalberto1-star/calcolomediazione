import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, UserCheck, FileText, AlertTriangle, ClipboardList, Wrench } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-07 — Articolo "Antiriciclaggio per mediatori e avvocati: la guida
// pratica agli obblighi D.Lgs. 231/2007" (issue #58). Pubblicazione
// subordinata al completamento di ACC-01 (fix accessibilità di
// /antiriciclaggio), ora fatto. Contenuto interamente tratto dalle guide
// statiche già pubblicate del sito (client/public/antiriciclaggio-guida.html
// e antiriciclaggio.html) — nessun dato normativo diverge da quanto già
// disponibile agli utenti: chi è obbligato (art. 3, c. 5, lett. g e art. 3,
// c. 4, lett. c D.Lgs. 231/2007), l'esenzione dell'avvocato difensore
// (Regola Tecnica CNF n. 2; art. 35, c. 5), l'adeguata verifica, il fascicolo
// dei sei modelli generati dallo strumento, il motore trigger UIF (T1-T7) e
// la conservazione decennale (art. 31). CTA "Usa lo strumento di
// compilazione" verso /antiriciclaggio, link a /antiriciclaggio-guida.
export default function AntiriciclaggioMediazioneObblighi() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Antiriciclaggio Mediazione: Obblighi D.Lgs. 231/2007 per Mediatori e Avvocati"
        description="Antiriciclaggio mediazione obblighi: chi è tenuto all'adeguata verifica del mediatore, quando l'avvocato è esente, quali documenti produrre e conservare, come riconoscere un'operazione sospetta. Guida pratica D.Lgs. 231/2007."
        canonical="https://calcolomediazione.it/antiriciclaggio-mediazione-obblighi"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/antiriciclaggio">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai allo strumento antiriciclaggio
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Antiriciclaggio per mediatori e avvocati: la guida pratica agli obblighi D.Lgs. 231/2007
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Chi è obbligato in mediazione, quando l'avvocato è esente, quali documenti produrre e conservare, e come
            riconoscere un'operazione sospetta senza doverla mettere a verbale.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              La mediazione civile e commerciale rientra a pieno titolo tra le attività soggette alla normativa
              antiriciclaggio. L'<strong className="text-foreground">Organismo di mediazione</strong> è infatti un
              soggetto obbligato ai sensi dell'art. 3, comma 5, lett. g) del D.Lgs. 231/2007, con tutto ciò che ne
              consegue: adeguata verifica della clientela, valutazione del rischio, conservazione decennale della
              documentazione e, quando ricorrono i presupposti, segnalazione delle operazioni sospette. Non è un
              adempimento burocratico isolato: riguarda ogni procedura, si applica a ciascuna parte coinvolta — anche
              quando sono più di due — e va documentato in un fascicolo separato da quello del procedimento.
            </p>
          </section>

          <section>
            <SectionTitle icon={UserCheck} title="Chi è obbligato, e chi no" />
            <p>Gli obblighi non gravano allo stesso modo su tutti i soggetti coinvolti nella procedura:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">L'Organismo di mediazione</strong> è il soggetto obbligato
                principale (art. 3, c. 5, lett. g). Riceve la domanda, avvia il fascicolo AML e, tramite il
                Responsabile Antiriciclaggio (RAR), esercita il controllo di secondo livello.
              </li>
              <li>
                <strong className="text-foreground">Il mediatore designato</strong> è chi materialmente esegue
                l'adeguata verifica al tavolo: identifica la parte, verifica il titolare effettivo e la qualifica di
                persona politicamente esposta (PEP), valuta il rischio e — se emergono anomalie — le trasmette al RAR.
                La diligenza richiesta è personale: non può limitarsi a fare affidamento su quanto già raccolto da
                altri.
              </li>
              <li>
                <strong className="text-foreground">L'avvocato che assiste o difende una parte in mediazione</strong>{" "}
                è, nella generalità dei casi, <strong className="text-foreground">esente</strong>: l'attività
                difensiva è esclusa dagli obblighi antiriciclaggio (Regola Tecnica n. 2 del CNF; art. 35, c. 5, D.Lgs.
                231/2007). Gli obblighi si riattivano solo se l'incarico sfocia in un'operazione economica autonoma
                tipica dell'art. 3, c. 4, lett. c) — ad esempio un trasferimento immobiliare collegato all'accordo di
                mediazione — e riguardano comunque solo quella specifica operazione, non l'attività difensiva nel suo
                complesso.
              </li>
            </ul>
          </section>

          <section>
            <SectionTitle icon={ShieldCheck} title="L'adeguata verifica della clientela" />
            <p>
              Per ciascuna parte della procedura — istante, aderente, eventuali terzi chiamati — il mediatore deve
              condurre l'adeguata verifica: identificazione tramite documento valido, individuazione del{" "}
              <strong className="text-foreground">titolare effettivo</strong> (la persona fisica nel cui interesse
              ultimo agisce la parte, quando questa è una persona giuridica), verifica della qualifica PEP e raccolta
              di informazioni su oggetto e valore della controversia, provenienza dei fondi e modalità di pagamento.
              In base al profilo di rischio che ne risulta, le misure da applicare sono di tre livelli — semplificata,
              ordinaria o rafforzata, con eventuali misure aggiuntive nei casi più delicati. La valutazione del
              rischio va prodotta e conservata anche quando il rischio complessivo risulta basso: non è un passaggio
              facoltativo riservato ai casi problematici.
            </p>
          </section>

          <section>
            <SectionTitle icon={FileText} title="Il fascicolo: i documenti da produrre e conservare" />
            <p>
              Per ciascuna parte, la normativa richiede che l'adeguata verifica risulti da un fascicolo documentale
              specifico: un'informativa AML/privacy, il modulo di adeguata verifica vero e proprio, la scheda di
              valutazione del rischio, la dichiarazione sottoscritta dal cliente sulla veridicità dei dati forniti, un
              foglio di annotazione delle comunicazioni ricevute nel corso della procedura e una checklist di
              controllo. Se dalla valutazione emerge un rischio alto, si aggiunge un promemoria riservato per il
              Responsabile Antiriciclaggio. Tutta questa documentazione va conservata per{" "}
              <strong className="text-foreground">dieci anni</strong> (art. 31 D.Lgs. 231/2007) in un fascicolo
              separato da quello della procedura di mediazione, accessibile solo a chi ha titolo per consultarlo.
            </p>
          </section>

          <section>
            <SectionTitle icon={AlertTriangle} title="Riconoscere un'operazione sospetta" />
            <p>
              Non ogni procedura presenta elementi di rischio, ma il mediatore deve comunque essere in grado di
              riconoscere i segnali che la prassi UIF individua come indicatori di anomalia — dalla complessità
              ingiustificata dell'operazione a incongruenze tra le parti coinvolte e l'oggetto della controversia, fino
              a comportamenti anomali nel corso della procedura stessa. Quando più segnali si combinano fino a
              integrare un "dubbio ragionevole", la valutazione va motivata per iscritto e trasmessa al RAR, che
              decide se procedere con una segnalazione di operazione sospetta.
            </p>
            <p className="mt-3">
              Un punto spesso frainteso: il livello di rischio, gli indicatori di anomalia rilevati e l'eventuale
              esistenza di una segnalazione{" "}
              <strong className="text-foreground">non vanno mai riportati nel verbale di mediazione</strong>, che è
              riservato ma comunque leggibile dalle parti. Questi elementi restano esclusivamente nel fascicolo AML,
              separato e non accessibile alle parti della procedura.
            </p>
          </section>

          <section>
            <SectionTitle icon={ClipboardList} title="Come si traduce in pratica" />
            <p>
              Nel concreto, la compilazione si distribuisce tra i soggetti coinvolti: l'Organismo (o la segreteria)
              raccoglie i dati comuni alla procedura e, quando disponibile, la documentazione allo sportello; il
              mediatore esegue l'identificazione, la valutazione del rischio e l'esame delle anomalie ad ogni
              incontro; l'avvocato, nei rari casi in cui interviene, compila solo i propri dati come rappresentante
              della parte. Per una procedura con più parti, i dati comuni si inseriscono una sola volta, mentre le
              posizioni di ciascun soggetto — istante, aderente, eventuali terzi — restano distinte e vanno tenute
              separate lungo tutto il fascicolo.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Usa lo strumento di compilazione
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Compila i modelli del fascicolo antiriciclaggio — adeguata verifica, scheda di rischio, dichiarazione del
            cliente — con il motore di compilazione automatica multi-parte, direttamente dal browser.
          </p>
          <Link href="/antiriciclaggio">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Wrench className="w-4 h-4" />
              Usa lo strumento di compilazione
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          Per l'inquadramento normativo completo, in linguaggio semplice, consulta anche la{" "}
          <Link href="/antiriciclaggio-guida"><span className="underline cursor-pointer text-foreground font-medium">guida agli obblighi antiriciclaggio</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla normativa vigente al momento della pubblicazione. Non costituiscono consulenza legale. Per la
          valutazione degli obblighi antiriciclaggio nel proprio caso specifico si raccomanda di consultare un
          avvocato abilitato o il Responsabile Antiriciclaggio del proprio Organismo di mediazione.
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
