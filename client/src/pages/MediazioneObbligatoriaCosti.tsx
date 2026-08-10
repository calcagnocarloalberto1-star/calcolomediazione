import { Link } from "wouter";
import { ArrowLeft, Calculator, Scale, ListChecks, HelpCircle } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

// CONT-01 — Articolo "Mediazione obbligatoria: quanto costa davvero nel 2026 (guida con esempi)"
// Issue #52. Tutti gli importi normativi riprodotti qui provengono dalla stessa fonte
// già pubblicata in /guida-dm-150 (Tabella A e spese di avvio/primo incontro del
// D.M. 150/2023): nessun dato diverge, come richiesto dai criteri di accettazione.
export default function MediazioneObbligatoriaCosti() {
  return (
    <div className="min-h-screen py-12 px-4">
      <SeoHead
        title="Mediazione obbligatoria: quanto costa davvero nel 2026 (guida con esempi)"
        description="Quanto costa la mediazione civile obbligatoria nel 2026? Tabella ufficiale D.M. 150/2023, riduzione del 20%, esempi di calcolo reali e differenza con le spese di un giudizio."
        canonical="https://calcolomediazione.it/mediazione-obbligatoria-quanto-costa"
        ogType="article"
      />
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/guida-dm-150">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Guida D.M. 150/2023
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mediazione obbligatoria: quanto costa davvero nel 2026
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Guida con esempi di calcolo reali, basati sulla Tabella A del D.M. 150/2023.
          </p>
        </div>

        <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Se hai ricevuto una lettera di invito alla mediazione — o il tuo avvocato ti ha detto che, prima di
              poter fare causa, devi passare da un organismo di mediazione — la prima domanda è quasi sempre la
              stessa: <strong className="text-foreground">quanto mi costa?</strong>
            </p>
            <p className="mt-4">
              La risposta breve è: molto meno di quanto costerebbe la causa, e per le materie in cui la mediazione
              è obbligatoria (condominio, diritti reali, successioni, locazione, contratti bancari e finanziari, tra
              le altre previste dall'art. 5 del D.Lgs. 28/2010) le tariffe sono anche ridotte del{" "}
              <strong className="text-foreground">20%</strong> rispetto alla mediazione scelta volontariamente.
              Vediamo i numeri veri, con la tabella ufficiale e due esempi di calcolo.
            </p>
          </section>

          <section>
            <SectionTitle icon={ListChecks} title="Da cosa dipende il costo" />
            <p>Il costo della mediazione civile è fissato dal D.M. 150/2023 (in vigore dal 17 novembre 2023) e dipende da tre fattori:</p>
            <ol className="list-decimal ml-6 mt-3 space-y-2">
              <li><strong className="text-foreground">Il valore della controversia</strong> — più è alto il valore, più aumenta l'indennità, ma per scaglioni, non in proporzione diretta.</li>
              <li><strong className="text-foreground">Se la mediazione è obbligatoria, demandata dal giudice o volontaria</strong> — obbligatoria e demandata hanno una riduzione automatica del 20% sull'indennità.</li>
              <li><strong className="text-foreground">Se e quando si raggiunge un accordo</strong> — se l'accordo arriva già al primo incontro, si pagano solo le spese di avvio e quelle del primo incontro: spesso meno di 200 euro per parte.</li>
            </ol>
          </section>

          <section>
            <SectionTitle icon={Scale} title="La tabella dei costi (D.M. 150/2023)" />
            <p>
              Ogni procedura prevede due voci distinte: le <strong className="text-foreground">spese di avvio</strong> (fisse,
              dovute all'atto della domanda) e le <strong className="text-foreground">spese di mediazione del primo incontro</strong> (dovute
              se si arriva effettivamente all'incontro). Se le parti non trovano un accordo al primo incontro e decidono di non
              proseguire, non è dovuto altro.
            </p>
            <div className="overflow-x-auto mt-6 border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-muted/30">
                    <th className="text-left px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Valore della lite</th>
                    <th className="text-right px-4 py-3 font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Spese di avvio</th>
                    <th className="text-right px-4 py-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Spese primo incontro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted"><td className="px-4 py-3 border-r-2 border-foreground">Fino a €1.000</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€40</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€60</td></tr>
                  <tr className="border-b border-muted bg-muted/10"><td className="px-4 py-3 border-r-2 border-foreground">Da €1.001 a €50.000</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€75</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€120</td></tr>
                  <tr><td className="px-4 py-3 border-r-2 border-foreground">Oltre €50.000</td><td className="px-4 py-3 text-right border-r-2 border-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€110</td><td className="px-4 py-3 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€170</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3">
              Fonte: art. 28, commi 4-5, D.M. 150/2023. Se la mediazione prosegue oltre il primo incontro, o si chiude con un
              accordo, si applica la Tabella A del decreto — consultabile per intero, con tutti gli scaglioni, nella nostra{" "}
              <Link href="/guida-dm-150"><span className="underline cursor-pointer text-foreground font-medium">guida completa al D.M. 150/2023</span></Link>.
            </p>
          </section>

          <section>
            <SectionTitle icon={Calculator} title="Esempio 1 — Controversia condominiale da €30.000, accordo al primo incontro" />
            <p>
              È il caso più comune per la mediazione obbligatoria. Valore della lite €30.000, accordo raggiunto già al primo
              incontro (che dà diritto anche a una maggiorazione premiale del 10%):
            </p>
            <ExampleTable
              rows={[
                ["Spese di avvio (scaglione €1.001–€50.000)", "€75,00"],
                ["Riduzione 20% (obbligatoria)", "–€15,00"],
                ["Spese primo incontro", "€120,00"],
                ["Riduzione 20% (obbligatoria)", "–€24,00"],
                ["Tabella A, scaglione €25.001–€50.000", "€720,00"],
                ["Riduzione 20% (obbligatoria)", "–€144,00"],
                ["Maggiorazione +10% (accordo al primo incontro)", "+€57,60"],
                ["Detrazione spese primo incontro già versate", "–€96,00"],
              ]}
              total={["Totale per parte, IVA esclusa", "€693,60"]}
              extra={[
                ["IVA 22%", "€152,59"],
                ["Totale per parte, IVA inclusa", "€846,19"],
              ]}
            />
            <p className="mt-4">
              Su una controversia da 30.000 euro, ogni parte spende quindi <strong className="text-foreground">meno di 850 euro</strong> per
              chiudere la questione con un accordo vincolante — spesso in una sola seduta.
            </p>
          </section>

          <section>
            <SectionTitle icon={Calculator} title="Esempio 2 — Nessun accordo, ci si ferma al primo incontro" />
            <p>
              È lo scenario più economico possibile: le parti si presentano, non trovano un'intesa, e la condizione di
              procedibilità per la causa è comunque soddisfatta. Stesso valore di lite (€30.000, obbligatoria):
            </p>
            <ExampleTable
              rows={[
                ["Spese di avvio", "€75,00"],
                ["Riduzione 20%", "–€15,00"],
                ["Spese primo incontro", "€120,00"],
                ["Riduzione 20%", "–€24,00"],
              ]}
              total={["Totale per parte, IVA esclusa", "€156,00"]}
            />
            <p className="mt-4">
              Meno di 160 euro per parte, IVA esclusa, per adempiere all'obbligo di legge e poter procedere eventualmente in giudizio.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="E se sono ammesso al gratuito patrocinio?" />
            <p>
              Chi ha diritto al patrocinio a spese dello Stato <strong className="text-foreground">non paga nulla</strong>: l'indennità
              è a carico dell'erario e l'organismo di mediazione non può richiedere alcun compenso a quella parte.
            </p>
          </section>

          <section>
            <SectionTitle icon={Scale} title="Mediazione vs causa: quanto si risparmia davvero" />
            <p>
              Il confronto diventa più netto guardando al costo di un giudizio ordinario sullo stesso valore: contributo
              unificato, compensi del proprio avvocato per tutte le fasi del processo, ed eventuale CTU se la materia lo
              richiede — il tutto per un procedimento che, tra primo grado ed eventuale appello, può durare anni anziché
              settimane.
            </p>
            <div className="mt-4">
              <Link href="/confronto-costi">
                <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                  Confronto costi mediazione vs causa civile
                </span>
              </Link>
            </div>
          </section>

          <section>
            <SectionTitle icon={HelpCircle} title="Domande frequenti" />
            <p>
              Le domande più comuni su tempi, obbligo di assistenza legale ed eccezioni sono raccolte nella pagina{" "}
              <Link href="/faq"><span className="underline cursor-pointer text-foreground font-medium">FAQ</span></Link>.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calcola il costo esatto del tuo caso
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Le tabelle sopra danno un'idea generale. Il calcolo reale dipende da variabili specifiche — scaglione esatto,
            eventuale tariffa dell'organismo, maggiorazioni per complessità tecnica. Usa il calcolatore per una cifra precisa.
          </p>
          <Link href="/calcolatore">
            <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
              <Calculator className="w-4 h-4" />
              Calcola il tuo caso
            </span>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8 border-t border-foreground/10 pt-4">
          Le informazioni contenute in questo articolo hanno carattere informativo e divulgativo e sono aggiornate al
          D.M. 150/2023. Non costituiscono consulenza legale. Per una valutazione del proprio caso specifico si
          raccomanda di consultare un avvocato o un mediatore abilitato.
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

function ExampleTable({
  rows,
  total,
  extra,
}: {
  rows: [string, string][];
  total: [string, string];
  extra?: [string, string][];
}) {
  return (
    <div className="mt-4 border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5">
      <div className="space-y-1">
        {rows.map(([label, value], i) => (
          <div key={i} className="flex items-center justify-between py-1 text-sm">
            <span>{label}</span>
            <span
              className={value.startsWith("–") ? "text-red-600 font-semibold" : value.startsWith("+") ? "text-green-700 font-semibold" : "text-foreground font-semibold"}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-foreground pt-2 mt-2">
        <div className="flex items-center justify-between py-1">
          <span className="font-bold text-foreground text-sm">{total[0]}</span>
          <span className="font-bold text-foreground text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{total[1]}</span>
        </div>
      </div>
      {extra && (
        <div className="border-t-2 border-foreground pt-2 mt-2 space-y-1">
          {extra.map(([label, value], i) => (
            <div key={i} className="flex items-center justify-between py-1 text-sm">
              <span className={i === extra.length - 1 ? "font-bold text-foreground" : ""}>{label}</span>
              <span
                className={i === extra.length - 1 ? "font-bold text-foreground text-base" : "text-foreground font-semibold"}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
