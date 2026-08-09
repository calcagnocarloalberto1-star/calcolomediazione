import { Link } from "wouter";
import { ArrowLeft, Scale, Heart, Users, Calculator, AlertTriangle } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-09 — Articolo "Assegno di mantenimento e assegno divorzile: come si
// calcolano dopo Cass. SU 18287/2018" (issue #60). Contenuto grounded sui
// criteri effettivamente usati dal nostro strumento CalcoloAssegni
// (client/public/calcolo-assegni/index.html) — stessi fattori, stesso
// disclaimer, nessun dato normativo divergente. CTA "Prova il calcolo
// orientativo" verso /calcolo-assegni, link a /calcolo-assegni e /glossario.
export default function AssegnoMantenimentoDivorzileCalcolo() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Assegno di Mantenimento e Assegno Divorzile: Come si Calcolano (Guida)"
        description="Assegno di mantenimento e assegno divorzile dopo Cass. SU 18287/2018: quali criteri considera il giudice, cosa cambia tra separazione e divorzio, e come funziona il mantenimento dei figli ex art. 337-ter c.c."
        canonical="https://calcolomediazione.it/assegno-mantenimento-divorzile-calcolo"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/calcolo-assegni/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai al Calcolatore Assegni
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Assegno di mantenimento e assegno divorzile: come si calcolano dopo Cass. SU 18287/2018
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Separazione, divorzio e mantenimento dei figli: tre istituti diversi, tre criteri diversi. Ecco cosa
            considera davvero il giudice.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              "Quanto mi spetta di mantenimento?" è una delle domande più frequenti in una separazione o in un
              divorzio — ma la risposta cambia radicalmente a seconda della fase (separazione o divorzio) e di chi
              ne ha diritto (il coniuge o i figli). Non esiste una formula unica: i criteri sono diversi per ciascun
              istituto, e ogni valutazione resta rimessa al giudice del caso concreto. Vediamo però quali fattori
              entrano davvero nel calcolo.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="Assegno di mantenimento del coniuge (separazione)" />
            <p>
              Nella separazione personale, l'assegno di mantenimento si fonda sul{" "}
              <strong className="text-foreground">differenziale reddituale</strong> tra i due coniugi, modulato in
              base a una serie di criteri che il giudice valuta congiuntamente: la durata del matrimonio, la
              capacità lavorativa del coniuge richiedente (piena, ridotta o nulla), l'eventuale presenza di figli a
              carico, l'età del richiedente e il tenore di vita goduto durante il matrimonio. A differenza
              dell'assegno divorzile, in separazione il parametro di riferimento resta più vicino al tenore di vita
              matrimoniale, in coerenza con la persistenza del vincolo coniugale.
            </p>
          </section>

          <section>
            <SectionTitle icon={Heart} title="Assegno divorzile: la svolta di Cass. SU 18287/2018" />
            <p>
              Con il divorzio, i criteri cambiano in modo sostanziale. Le Sezioni Unite della Corte di Cassazione,
              con la sentenza n. 18287 dell'11 luglio 2018, hanno superato il precedente riferimento al "tenore di
              vita matrimoniale" e hanno attribuito all'assegno divorzile una{" "}
              <strong className="text-foreground">triplice funzione: assistenziale, compensativa e
              perequativa</strong>. In pratica, il giudice non si limita più a verificare lo squilibrio economico tra
              gli ex coniugi, ma valuta anche:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Il <strong className="text-foreground">contributo</strong> dato dal richiedente alla vita familiare e alla formazione del patrimonio comune o dell'altro coniuge (determinante, significativo, moderato o marginale).</li>
              <li>Le <strong className="text-foreground">rinunce e i sacrifici professionali</strong> sostenuti durante il matrimonio (ad esempio aver lasciato un lavoro per occuparsi della famiglia).</li>
              <li>La durata del matrimonio, l'età e la capacità lavorativa attuale del richiedente.</li>
              <li>Le condizioni economiche e patrimoniali di entrambi gli ex coniugi.</li>
            </ul>
            <p className="mt-4">
              Questo significa che due situazioni con lo stesso divario reddituale possono dare luogo ad assegni
              molto diversi, a seconda di quanto il richiedente abbia effettivamente contribuito e rinunciato durante
              la vita matrimoniale: l'assegno divorzile, dopo la sentenza del 2018, "compensa" più di quanto non
              "conservi" un tenore di vita.
            </p>
          </section>

          <section>
            <SectionTitle icon={Users} title="Mantenimento dei figli: un istituto a parte" />
            <p>
              Il mantenimento dei figli segue una logica completamente diversa, disciplinata dall'
              <strong className="text-foreground">art. 337-ter c.c.</strong>, e non dipende dall'esito della causa
              tra i genitori: è un diritto autonomo dei figli, valutato secondo il{" "}
              <strong className="text-foreground">principio di proporzionalità</strong> rispetto al reddito di
              ciascun genitore. I fattori principali sono il fabbisogno del figlio in base all'età, i tempi di
              permanenza presso ciascun genitore, i redditi di entrambi i genitori e le spese dirette (ad esempio il
              costo dell'abitazione del genitore collocatario). Il genitore non collocatario, o comunque quello
              individuato come obbligato, versa un contributo periodico all'altro genitore per coprire la quota di
              spesa non sostenuta direttamente.
            </p>
          </section>

          <div className="border-2 border-amber-400 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900 text-sm">
                Nessuna formula, per quanto accurata, sostituisce la valutazione del giudice, che resta libero di
                considerare ogni elemento del caso concreto. Un calcolo orientativo è un punto di partenza per
                capire l'ordine di grandezza e preparare la trattativa, non un risultato vincolante.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Prova il calcolo orientativo
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Il nostro strumento calcola in modo orientativo l'assegno di mantenimento, l'assegno divorzile o il
            mantenimento dei figli, motivando i criteri considerati ed esportando il report in PDF.
          </p>
          <Link href="/calcolo-assegni/">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Prova il calcolo orientativo
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          Per la terminologia tecnica citata in questo articolo consulta anche il nostro{" "}
          <Link href="/glossario"><span className="underline cursor-pointer text-foreground font-medium">Glossario della Mediazione Civile</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla giurisprudenza vigente al momento della pubblicazione. Non costituiscono consulenza legale. Il
          calcolo dell'assegno resta una valutazione discrezionale del giudice: per il proprio caso specifico si
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
