import { Link } from "wouter";
import { ArrowLeft, Home, Percent, FileCheck, Calculator, Scale } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-10 — Articolo "Trasferimento immobiliare in mediazione: quanto si
// risparmia su notaio e imposte" (issue #61). Contenuto interamente tratto
// dalla sezione FAQ già pubblicata sul sito (client/src/pages/FAQ.tsx,
// blocco "trasferimento immobiliare in mediazione") — stessi importi, stesse
// aliquote, stessi esempi già usati nel motore di calcolo di /costi-notarili:
// esenzione imposta di registro fino a €100.000 (art. 17, c. 2, D.Lgs.
// 28/2010), 2%/9% sull'eccedenza, ipotecaria/catastale fisse €50+€50, bollo
// esente (art. 17, c. 1), obbligo di autentica notarile per gli atti ex art.
// 2643 c.c. (art. 11, c. 3, D.Lgs. 28/2010). CTA "Calcola i costi notarili"
// verso /costi-notarili, link a /guida-dm-150.
export default function TrasferimentoImmobiliareMediazione() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Trasferimento Immobiliare in Mediazione: Quanto si Risparmia (Guida)"
        description="Trasferimento immobiliare in mediazione: imposta di registro esente fino a €100.000, quando serve il notaio, quanto si risparmia sulla prima casa rispetto alla compravendita ordinaria. Guida con esempi di calcolo."
        canonical="https://calcolomediazione.it/trasferimento-immobiliare-mediazione"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/costi-notarili">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai al calcolatore dei costi notarili
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Trasferimento immobiliare in mediazione: quanto si risparmia su notaio e imposte
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Quando un accordo di mediazione trasferisce un immobile, l'imposta di registro è esente fino a €100.000 e
            il risparmio rispetto a una compravendita ordinaria può essere notevole. Ecco come si calcola, con
            esempi reali.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              La mediazione civile non serve solo a comporre controversie: può anche concludersi con un vero
              trasferimento di proprietà immobiliare — ad esempio nella divisione di un bene tra coeredi, nella
              definizione di una comunione, o nella composizione di una controversia che le parti scelgono di
              chiudere cedendo un immobile invece di litigare in tribunale. In questi casi l'accordo di mediazione
              gode di un regime fiscale agevolato, previsto dall'art. 17 del D.Lgs. 28/2010, che può tradursi in un
              risparmio concreto rispetto a una compravendita ordinaria dallo stesso notaio.
            </p>
          </section>

          <section>
            <SectionTitle icon={FileCheck} title="Quando serve il notaio" />
            <p>
              Non tutti gli accordi di mediazione richiedono l'intervento di un notaio. Serve quando l'accordo
              riguarda uno degli atti previsti dall'art. 2643 del codice civile — quelli soggetti a trascrizione nei
              registri immobiliari: trasferimenti di proprietà, costituzione o modifica di servitù, accertamenti di
              usucapione, divisioni immobiliari. In questi casi, l'art. 11, comma 3, del D.Lgs. 28/2010 richiede che
              la sottoscrizione dell'accordo sia autenticata da un notaio: senza questa autentica l'accordo non può
              essere trascritto e non è opponibile ai terzi.
            </p>
          </section>

          <section>
            <SectionTitle icon={Percent} title="Le agevolazioni fiscali dell'art. 17" />
            <p>L'accordo di mediazione beneficia di un regime agevolato su tre fronti:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Imposta di bollo</strong>: esenzione totale su tutti gli atti,
                documenti e provvedimenti relativi al procedimento (art. 17, c. 1).
              </li>
              <li>
                <strong className="text-foreground">Imposta di registro</strong>: esente fino a{" "}
                <strong className="text-foreground">€100.000</strong> di valore dell'accordo (art. 17, c. 2). Per la
                parte eccedente si applicano le aliquote ordinarie: <strong className="text-foreground">2%</strong>{" "}
                per la prima casa, <strong className="text-foreground">9%</strong> per gli altri immobili.
              </li>
              <li>
                <strong className="text-foreground">Imposte ipotecaria e catastale</strong>: l'Agenzia delle Entrate
                (Risposta n. 235/2020) ha sostenuto che l'esenzione dell'art. 17, c. 1 si estenderebbe anche a queste
                imposte; per prudenza operativa, in linea con l'orientamento di numerose Conservatorie, restano
                comunque generalmente applicate in misura fissa (€50 + €50).
              </li>
            </ul>
          </section>

          <section>
            <SectionTitle icon={Calculator} title="Un esempio: prima casa da €120.000" />
            <p>
              Il risparmio si vede meglio con un confronto diretto. Immobile prima casa con valore catastale
              €120.000:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Compravendita ordinaria</strong>: imposta di registro 2% sul
                valore catastale = €2.400, più ipotecaria e catastale fisse (€50 + €50) = totale{" "}
                <strong className="text-foreground">€2.500</strong> di sole imposte indirette.
              </li>
              <li>
                <strong className="text-foreground">Accordo di mediazione</strong>: il registro si applica solo
                sull'eccedenza rispetto a €100.000, quindi 2% su €20.000 = €400, più ipotecaria e catastale (€50 +
                €50) = totale <strong className="text-foreground">€500</strong>.
              </li>
            </ul>
            <p className="mt-3">
              Il risparmio, sulle sole imposte indirette, è di circa <strong className="text-foreground">€2.000</strong>.
              Per immobili di valore fino a €100.000 il risparmio sull'imposta di registro è totale: l'imposta non è
              semplicemente ridotta, è azzerata.
            </p>
          </section>

          <section>
            <SectionTitle icon={Home} title="Il costo complessivo: cosa aggiungere alle imposte" />
            <p>
              Al risparmio fiscale vanno sommati gli altri costi della pratica notarile, che restano dovuti come per
              qualsiasi atto: l'onorario del notaio (liberalizzato, quindi non tariffato — indicativamente €1.500 fino
              a €100.000 di valore, con scaglioni crescenti oltre), l'IVA al 22% sull'onorario, il contributo alla
              Cassa Nazionale del Notariato al 4% sull'onorario, e le visure ipocatastali con la voltura (stima
              forfettaria intorno a €300). Per un immobile prima casa da €150.000 in accordo di mediazione, il totale
              stimato — onorario, IVA, cassa, visure, registro sull'eccedenza, ipotecaria e catastale — si aggira
              intorno ai €3.920, contro circa €7.420 per lo stesso valore su un immobile non prima casa (dove il
              registro sull'eccedenza sale al 9%). Sono importi orientativi: per il preventivo effettivo è sempre
              necessario rivolgersi al notaio che riceverà l'atto.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="Un limite da tenere presente: il valore dichiarato" />
            <p>
              Le agevolazioni si calcolano sul valore dichiarato nell'accordo, ma l'Agenzia delle Entrate può
              confrontarlo con il valore catastale dell'immobile (verifica di congruità, art. 29 D.M. 150/2023): se il
              valore dichiarato risulta inferiore al valore catastale, l'Agenzia può contestarlo ai fini fiscali. Prima
              di formalizzare l'accordo è quindi buona prassi verificare la congruità del valore dichiarato rispetto
              a quello catastale.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calcola i costi notarili
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Inserisci il valore dell'immobile e verifica subito onorario, IVA, cassa notarile, imposte di registro,
            ipotecaria e catastale per il tuo accordo di mediazione, con confronto rispetto alla compravendita
            ordinaria.
          </p>
          <Link href="/costi-notarili">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Calcola i costi notarili
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          Per il quadro completo sulle tariffe e le agevolazioni della mediazione consulta anche la{" "}
          <Link href="/guida-dm-150"><span className="underline cursor-pointer text-foreground font-medium">Guida Completa al D.M. 150/2023</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla normativa vigente al momento della pubblicazione. Non costituiscono consulenza legale o fiscale. Gli
          importi indicati sono stime orientative: per il preventivo effettivo e la verifica del proprio caso
          specifico si raccomanda di rivolgersi a un notaio o a un avvocato abilitato.
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
