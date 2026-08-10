import { Link } from "wouter";
import { ArrowLeft, Scale, Clock, Calculator, Brain } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-04 — Articolo "Mediazione vs causa civile: la vera differenza di costi e
// tempi (con calcolo aggiornato)" (issue #55). L'esempio numerico (valore lite
// €30.000, mediazione obbligatoria) è calcolato con la stessa funzione
// shared/costi-procedura.ts (calcolaConfronto) usata dal tool /confronto-costi:
// stessi importi, nessuna divergenza.
export default function MediazioneVsCausaCivile() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Mediazione vs Causa Civile: la Vera Differenza di Costi e Tempi"
        description="Mediazione o causa civile conviene? Confronto reale dei costi tra processo civile e mediazione: contributo unificato, compensi avvocato D.M. 55/2014, CTU, con un esempio di calcolo aggiornato."
        canonical="https://calcolomediazione.it/mediazione-vs-causa-civile"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/confronto-costi">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Vai al Confronto Costi
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mediazione vs causa civile: la vera differenza di costi e tempi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Un confronto con numeri reali, non stime approssimative: quanto costa davvero fare causa rispetto a
            mediare, e quanto tempo richiede ciascuna strada.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              "Mediazione o causa civile, cosa conviene?" È la domanda che si pone chiunque si trovi davanti a una
              controversia. La risposta dipende dal caso specifico, ma i numeri — quelli veri, calcolati con le
              tariffe ufficiali — raccontano una storia piuttosto chiara. Vediamola con un esempio concreto.
            </p>
          </section>

          <section>
            <SectionTitle icon={Clock} title="La differenza di tempi, prima di tutto" />
            <p>
              Prima ancora dei costi, la differenza più netta è nei tempi. Una mediazione dura tipicamente{" "}
              <strong className="text-foreground">da 1 a 6 mesi</strong>. Una causa civile di primo grado richiede in
              media <strong className="text-foreground">2-4 anni</strong>; se una delle parti impugna la sentenza,
              l'appello aggiunge <strong className="text-foreground">1-3 anni</strong>, e un eventuale ricorso in
              Cassazione altri <strong className="text-foreground">1-3 anni</strong>. Un contenzioso che attraversa
              tutti e tre i gradi di giudizio può quindi arrivare a durare{" "}
              <strong className="text-foreground">fino a 12 anni</strong>.
            </p>
          </section>

          <section>
            <SectionTitle icon={Calculator} title="Un esempio con numeri reali: controversia da €30.000" />
            <p>
              Prendiamo lo stesso caso usato anche nelle nostre altre guide: una controversia obbligatoria (es.
              condominiale) del valore di €30.000. Ecco cosa emerge mettendo a confronto mediazione e primo grado di
              giudizio, con le tariffe ufficiali (contributo unificato D.P.R. 115/2002 art. 13, compensi avvocato
              D.M. 55/2014 aggiornato D.M. 147/2022, indennità di mediazione D.M. 150/2023):
            </p>
            <div className="overflow-x-auto mt-6 border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-muted/30">
                    <th className="text-left px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Voce (per parte)</th>
                    <th className="text-right px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mediazione</th>
                    <th className="text-right px-4 py-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Causa civile (1° grado)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted"><td className="px-4 py-3 border-r-2 border-foreground">Indennità organismo (incl. spese di avvio) / Contributo unificato</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€636</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€518</td></tr>
                  <tr className="border-b border-muted bg-muted/10"><td className="px-4 py-3 border-r-2 border-foreground">Compenso avvocato (valori medi D.M. 55/2014)</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€2.447</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€7.616</td></tr>
                  <tr className="border-b border-muted"><td className="px-4 py-3 border-r-2 border-foreground">CTU (consulenza tecnica d'ufficio, se necessaria)</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>—</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€1.500</td></tr>
                  <tr className="border-b border-muted bg-muted/10"><td className="px-4 py-3 border-r-2 border-foreground">Spese generali 15%, IVA 22%, CPA 4%</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€1.124</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€3.496</td></tr>
                  <tr className="border-b border-muted"><td className="px-4 py-3 border-r-2 border-foreground">Altre voci (marca da bollo, diritto di copia, registro sentenza)</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>—</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€957</td></tr>
                  <tr className="border-b-2 border-foreground bg-muted/20"><td className="px-4 py-3 border-r-2 border-foreground font-bold">Totale per parte (IVA inclusa)</td><td className="px-4 py-3 text-right border-r-2 border-foreground font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€4.207</td><td className="px-4 py-3 text-right font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€14.087</td></tr>
                  <tr><td className="px-4 py-3 border-r-2 border-foreground">Credito d'imposta mediazione</td><td className="px-4 py-3 text-right border-r-2 border-foreground text-green-700 font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>–€600</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>—</td></tr>
                  <tr className="border-t-2 border-foreground bg-primary/5"><td className="px-4 py-3 border-r-2 border-foreground font-bold">Totale netto per parte</td><td className="px-4 py-3 text-right border-r-2 border-foreground font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€3.607</td><td className="px-4 py-3 text-right font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€14.087</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3">
              Fonte: stesso motore di calcolo del nostro strumento{" "}
              <Link href="/confronto-costi"><span className="underline cursor-pointer text-foreground font-medium">Confronto Costi</span></Link>. Il compenso avvocato è calcolato sui valori medi delle 4 fasi del giudizio (studio, introduttiva, istruttoria, decisionale). CTU stimata forfettariamente.
            </p>
            <p className="mt-4">
              Su questo caso, mediare invece di fare causa fa risparmiare circa{" "}
              <strong className="text-foreground">10.480 euro per parte (74% in meno)</strong> rispetto al solo primo
              grado. E se si considera che un giudizio può proseguire in appello e Cassazione — fino a 12 anni e un
              totale per parte di circa €40.078 sui tre gradi — il risparmio della mediazione sale a circa{" "}
              <strong className="text-foreground">36.471 euro per parte (91% in meno)</strong>.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="Perché il divario è così ampio" />
            <p>
              La differenza non dipende da una singola voce, ma si accumula: il compenso dell'avvocato per un
              giudizio civile copre quattro fasi processuali (mentre in mediazione il compenso stragiudiziale è su
              base ridotta), la CTU è una spesa che in mediazione spesso non serve, e — soprattutto — ogni grado di
              giudizio successivo (appello, Cassazione) somma un nuovo contributo unificato e un nuovo compenso
              legale, mentre la mediazione resta un procedimento unico. A questo si aggiungono i vantaggi fiscali
              specifici della mediazione: esenzione dall'imposta di registro fino a €100.000, esenzione dall'imposta
              di bollo, e il credito d'imposta fino a €600 per procedura.
            </p>
          </section>

          <section>
            <SectionTitle icon={Brain} title="Il calcolo dei costi come strumento di negoziazione" />
            <p>
              Conoscere in anticipo il costo reale dell'alternativa al giudizio — quella che nella teoria della
              negoziazione si chiama MAAN, la Migliore Alternativa all'Accordo Negoziato — è spesso decisivo per
              chiudere un accordo in mediazione. Un prospetto economico dettagliato, come quello che genera il nostro
              strumento, permette a mediatore e parti di ragionare su basi oggettive invece che su impressioni.
              Approfondisci queste tecniche nella nostra guida alle{" "}
              <Link href="/strategie-negoziazione"><span className="underline cursor-pointer text-foreground font-medium">strategie di negoziazione per la mediazione civile</span></Link>.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Confronta i costi del tuo caso
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            L'esempio sopra è generico. Il nostro strumento calcola il confronto preciso per il tuo valore di lite,
            includendo appello, Cassazione, arbitrato CAM/MedyaPro ed eventuale gratuito patrocinio.
          </p>
          <Link href="/confronto-costi">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Confronta i costi del tuo caso
            </span>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo. I valori
          dell'esempio sono calcolati con le tariffe ufficiali applicabili al momento della pubblicazione e possono
          variare in base al caso concreto. Non costituiscono consulenza legale. Per una valutazione del proprio caso
          specifico si raccomanda di consultare un avvocato abilitato.
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
