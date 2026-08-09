import { Link } from "wouter";
import { ArrowLeft, Shield, ListChecks, Clock, Scale, HelpCircle } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-06 — Articolo "Gratuito patrocinio in mediazione: guida completa ai
// requisiti e alla procedura" (issue #57). Contenuto interamente tratto dalla
// sezione FAQ "Gratuito Patrocinio in Mediazione" già pubblicata
// (client/src/pages/FAQ.tsx) — nessun dato normativo diverge da quanto già
// presente sul sito. CTA "Leggi le FAQ dedicate" verso /faq, link a /chi-siamo.
export default function GratuitoPatrocinioMediazione() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Gratuito Patrocinio in Mediazione: Requisiti e Procedura (Guida)"
        description="Gratuito patrocinio mediazione: chi può richiederlo, requisiti di reddito, come presentare l'istanza al COA e cosa succede se l'accordo non si raggiunge. Guida aggiornata artt. 15-bis/15-undecies D.Lgs. 28/2010."
        canonical="https://calcolomediazione.it/gratuito-patrocinio-mediazione"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/faq">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai alle FAQ
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Gratuito patrocinio in mediazione: guida completa ai requisiti e alla procedura
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Chi ha diritto al patrocinio a spese dello Stato in mediazione, quali requisiti servono e come si
            presenta la domanda al Consiglio dell'Ordine degli Avvocati.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Il patrocinio a spese dello Stato — il cosiddetto "gratuito patrocinio" — non riguarda più solo il
              processo civile: dalla Riforma Cartabia (D.Lgs. 149/2022) è stato esteso anche alla mediazione,
              attraverso il nuovo Capo II-bis del D.Lgs. 28/2010 (artt. da 15-bis a 15-undecies). Chi si trova in
              condizioni economiche disagiate può quindi partecipare alla mediazione senza sostenere i costi
              dell'indennità dell'organismo né il compenso dell'avvocato, che vengono posti a carico dello Stato.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="Da dove nasce questo diritto" />
            <p>
              Il riconoscimento del gratuito patrocinio in mediazione è il risultato di un percorso giurisprudenziale
              lungo diversi anni. La Cassazione, con la sentenza n. 18123/2020, aveva inizialmente escluso il
              beneficio per l'attività stragiudiziale. La svolta è arrivata con la Corte Costituzionale (sentenza n.
              10 del 20 gennaio 2022), che ha dichiarato incostituzionali gli artt. 74, co. 2, e 75, co. 1, del
              D.P.R. 115/2002 nella parte in cui non prevedevano il patrocinio per l'attività difensiva svolta in
              mediazione. La Cassazione (ord. n. 7974/2024) ha poi fissato al 21 gennaio 2022 la data spartiacque per
              l'applicabilità. La Riforma Cartabia ha infine regolamentato organicamente l'istituto.
            </p>
          </section>

          <section>
            <SectionTitle icon={ListChecks} title="I requisiti per essere ammessi" />
            <p>Gli artt. 15-bis e 15-ter del D.Lgs. 28/2010 richiedono che ricorrano contestualmente queste condizioni:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Deve trattarsi di <strong className="text-foreground">mediazione obbligatoria</strong> ai sensi dell'art. 5, co. 1, D.Lgs. 28/2010 — il beneficio non si estende alla mediazione volontaria, a quella da clausola contrattuale né a quella demandata dal giudice (art. 5-quater).</li>
              <li>La mediazione deve <strong className="text-foreground">concludersi con un accordo</strong> perché il compenso dell'avvocato sia riconosciuto a carico dello Stato (l'esonero dalle indennità dell'organismo, invece, resta fermo anche senza accordo).</li>
              <li>Non deve trattarsi di una controversia per cessione di crediti o ragioni altrui, salvo che la cessione sia fatta in pagamento di crediti preesistenti (art. 15-bis, co. 2).</li>
              <li>Il richiedente deve rientrare nei <strong className="text-foreground">limiti di reddito</strong> previsti dalla normativa generale sul patrocinio a spese dello Stato (D.P.R. 115/2002).</li>
            </ul>
          </section>

          <section>
            <SectionTitle icon={Clock} title="Come si presenta la domanda e i tempi di risposta" />
            <p>
              L'istanza di ammissione (art. 15-quater) va presentata <strong className="text-foreground">in via
              anticipata e preventiva</strong>, prima o durante la procedura, sia da chi propone la domanda di
              mediazione sia da chi vi aderisce. Va depositata presso il{" "}
              <strong className="text-foreground">Consiglio dell'Ordine degli Avvocati (COA)</strong> del luogo in
              cui ha sede l'organismo di mediazione competente. Il COA ha <strong className="text-foreground">venti
              giorni</strong> di tempo (art. 15-quinquies, co. 2) per verificare l'ammissibilità e, in caso positivo,
              ammette l'interessato in via anticipata e provvisoria, comunicandolo immediatamente. In caso di
              rigetto, è possibile presentare ricorso al Presidente del Tribunale competente (art. 15-sexies), che
              decide con decreto non impugnabile.
            </p>
          </section>

          <section>
            <SectionTitle icon={Shield} title="Cosa succede con e senza accordo" />
            <p>
              Se la mediazione si conclude con l'accordo, l'ammissione anticipata viene confermata su istanza
              dell'avvocato dal COA, che appone il visto di congruità sulla parcella e la trasmette al Ministero
              della Giustizia per il pagamento. Il compenso dell'avvocato è calcolato secondo i parametri dell'art.
              20, co. 1-bis, D.M. 55/2014, <strong className="text-foreground">ridotto della metà</strong>, con una
              maggiorazione del 30% sulle fasi di attivazione e negoziazione in caso di accordo, oltre al rimborso
              forfettario del 15%, IVA e CPA. Se invece la mediazione si chiude <strong className="text-foreground">
              senza accordo</strong>, l'ammissione anticipata cessa i suoi effetti e l'avvocato non matura il diritto
              al compenso a carico dello Stato per quella fase — resta però ferma la possibilità di richiedere il
              patrocinio nell'eventuale giudizio civile successivo, secondo le regole ordinarie. L'organismo di
              mediazione, dal canto suo, non può comunque rifiutarsi di condurre la procedura (art. 17, co. 6): in
              compenso ottiene un credito d'imposta sull'indennità non percepita, fino a €24.000 annui. L'ammissione
              può infine essere revocata dal COA (art. 15-novies) se vengono meno i requisiti di reddito che l'hanno
              giustificata.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Leggi le FAQ dedicate
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Trovi altri approfondimenti su requisiti, procedura e casi particolari nella sezione FAQ dedicata al
            gratuito patrocinio in mediazione.
          </p>
          <Link href="/faq">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <HelpCircle className="w-4 h-4" />
              Leggi le FAQ dedicate
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          Per informazioni sul nostro team e sui percorsi di assistenza consulta anche la pagina{" "}
          <Link href="/chi-siamo"><span className="underline cursor-pointer text-foreground font-medium">Chi Siamo</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla normativa vigente al momento della pubblicazione. Non costituiscono consulenza legale. Per la
          presentazione dell'istanza e la verifica dei requisiti nel proprio caso specifico si raccomanda di
          consultare un avvocato abilitato o il Consiglio dell'Ordine competente.
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
