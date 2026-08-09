import { Link } from "wouter";
import { ArrowLeft, Landmark, FileCheck, CalendarClock, AlertTriangle, Calculator } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-05 — Articolo "Credito d'imposta mediazione 2027: come richiederlo e
// quanto vale (guida pratica)" (issue #56). Contenuto normativo interamente
// tratto dalla sezione FAQ "Credito d'Imposta in Mediazione" già pubblicata
// (client/src/pages/FAQ.tsx) — nessun dato normativo diverge da quanto già
// presente sul sito. CTA verso /credito-imposta (calcolatore), link a /faq.
export default function CreditoImpostaMediazioneDomanda() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Credito d'Imposta Mediazione: Come Richiederlo e Quanto Vale (Guida)"
        description="Guida pratica al credito d'imposta per la mediazione civile: importi (fino a €1.118 per procedura), requisiti, scadenza del 31 marzo e procedura di domanda su lsg.giustizia.it."
        canonical="https://calcolomediazione.it/credito-imposta-mediazione-domanda"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/credito-imposta">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai al Calcolatore Credito d'Imposta
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Credito d'imposta mediazione: come richiederlo e quanto vale
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Guida pratica al credito d'imposta previsto dall'art. 20 D.Lgs. 28/2010: importi, requisiti, scadenza
            della domanda e procedura passo per passo.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Chi partecipa a una procedura di mediazione civile può recuperare parte dei costi sostenuti — indennità
              dell'organismo, compenso dell'avvocato e, in certi casi, contributo unificato — grazie a un credito
              d'imposta previsto dall'art. 20 del D.Lgs. 28/2010, come riformato dal D.Lgs. 149/2022 (Riforma
              Cartabia) e disciplinato nelle modalità operative dal D.M. 1° agosto 2023. Vediamo quanto vale, chi ne
              ha diritto e come si richiede.
            </p>
          </section>

          <section>
            <SectionTitle icon={Landmark} title="Quanto vale il credito d'imposta" />
            <p>
              L'art. 20 del D.Lgs. 28/2010 prevede tre tipologie di credito, cumulabili entro un tetto per procedura:
            </p>
            <div className="overflow-x-auto mt-6 border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-muted/30">
                    <th className="text-left px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Voce</th>
                    <th className="text-right px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Con accordo</th>
                    <th className="text-right px-4 py-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Senza accordo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted"><td className="px-4 py-3 border-r-2 border-foreground">a) Indennità organismo di mediazione</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€600</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€300</td></tr>
                  <tr className="border-b border-muted bg-muted/10"><td className="px-4 py-3 border-r-2 border-foreground">b) Compenso avvocato (solo mediazioni obbligatorie/demandate)</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€600</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€300</td></tr>
                  <tr className="border-b-2 border-foreground bg-muted/20"><td className="px-4 py-3 border-r-2 border-foreground font-bold">Tetto (a)+(b) per procedura</td><td className="px-4 py-3 text-right border-r-2 border-foreground font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€600</td><td className="px-4 py-3 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€300</td></tr>
                  <tr><td className="px-4 py-3 border-r-2 border-foreground">c) Contributo unificato (solo mediazione demandata con accordo)</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€518</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>—</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Il massimo ottenibile per una singola procedura è quindi <strong className="text-foreground">€600
              (indennità + avvocato) + €518 (contributo unificato) = €1.118</strong>, in caso di mediazione demandata
              dal giudice conclusa con accordo. Il credito per il compenso dell'avvocato spetta solo nelle mediazioni
              obbligatorie (art. 5, co. 1) e in quelle demandate dal giudice (art. 5-quater): non spetta nelle
              mediazioni volontarie, per le quali resta comunque disponibile il credito per l'indennità
              dell'organismo. Il tetto annuale complessivo è di <strong className="text-foreground">€2.400 per le
              persone fisiche</strong> e <strong className="text-foreground">€24.000 per le persone giuridiche</strong>.
            </p>
          </section>

          <section>
            <SectionTitle icon={FileCheck} title="Chi può richiederlo e a quali condizioni" />
            <p>
              Possono richiedere il credito le parti, persone fisiche o giuridiche, che hanno partecipato a una
              procedura di mediazione <strong className="text-foreground">conclusa dopo il 30 giugno 2023</strong> e
              che hanno sostenuto costi documentati per l'indennità all'organismo e/o il compenso dell'avvocato. Le
              mediazioni avviate e concluse prima di tale data non danno diritto al beneficio, perché la disciplina
              attuativa del D.M. 1° agosto 2023 si applica solo alle procedure successive all'entrata in vigore della
              Riforma Cartabia. Anche gli organismi di mediazione possono richiedere il credito per l'indennità non
              percepita dalle parti ammesse al patrocinio a spese dello Stato, entro un tetto annuale di €24.000.
            </p>
          </section>

          <section>
            <div className="border-2 border-amber-400 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Scadenza: 31 marzo
                  </p>
                  <p className="text-amber-900 text-sm mt-1">
                    Ai sensi dell'art. 3, commi 1 e 5, del D.M. 1° agosto 2023, la domanda va presentata a pena di
                    inammissibilità entro il 31 marzo dell'anno successivo a quello di conclusione della mediazione.
                    Per le mediazioni concluse nel 2026, la scadenza è il 31 marzo 2027. Decorso il termine, il
                    beneficio è definitivamente perso.
                  </p>
                </div>
              </div>
            </div>
            <SectionTitle icon={CalendarClock} title="Come e quando presentare la domanda" />
            <p>
              La domanda si presenta esclusivamente online sulla piattaforma del Ministero della Giustizia,
              all'indirizzo lsg.giustizia.it, autenticandosi con SPID, CIE o CNS e selezionando l'applicativo
              "Istanza credito di imposta". Vanno indicati: tipologia di procedura, numero d'ordine dell'organismo,
              numero identificativo del procedimento, valore della lite, materia della controversia, data
              dell'accordo (o del verbale di mancato accordo), dati della fattura dell'organismo e modalità/data di
              pagamento, oltre a un indirizzo PEC per le comunicazioni. Entro il 30 aprile dell'anno di presentazione,
              con decreto del Capo Dipartimento per gli Affari di Giustizia, viene riconosciuto l'importo
              effettivamente spettante, nei limiti del tetto di spesa annuo complessivo di €51.821.400. Il credito
              riconosciuto si utilizza esclusivamente in compensazione tramite modello F24 (Entratel/Fisconline), con
              i codici tributo 7067 (indennità organismo e compenso avvocato), 7068 (contributo unificato) e 7069
              (per gli organismi di mediazione) istituiti dalle Risoluzioni Agenzia Entrate n. 23/E e 24/E del 14
              maggio 2024. Non è previsto il rimborso diretto delle somme.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calcola il tuo credito
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Il nostro strumento calcola in automatico l'importo del credito d'imposta spettante per il tuo caso,
            in base a esito, tipo di mediazione e costi sostenuti.
          </p>
          <Link href="/credito-imposta">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Calcola il tuo credito
            </span>
          </Link>
        </div>

        <p className="text-xs mt-4">
          Per approfondimenti su casi particolari consulta anche le{" "}
          <Link href="/faq"><span className="underline cursor-pointer text-foreground font-medium">FAQ sul credito d'imposta</span></Link>.
        </p>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate
          alla normativa vigente al momento della pubblicazione. Non costituiscono consulenza fiscale o legale. Per
          la presentazione della domanda e la verifica dei requisiti nel proprio caso specifico si raccomanda di
          consultare un avvocato o un commercialista abilitato.
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
