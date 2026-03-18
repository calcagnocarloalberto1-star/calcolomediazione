import { Link } from "wouter";
import { ArrowLeft, BookOpen, Scale, Table2, TrendingDown, TrendingUp, Calculator, ExternalLink } from "lucide-react";
import { getScaglioni, formatEuro } from "@shared/calcolo-indennita";

export default function GuidaDM150() {
  const scaglioni = getScaglioni();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </span>
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Guida al D.M. 150/2023
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Guida completa al Decreto Ministeriale 150/2023 sulle indennità di mediazione civile e commerciale.
          </p>
        </div>

        {/* Table of contents */}
        <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-10">
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Indice
          </h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { n: "1", label: "Introduzione" },
              { n: "2", label: "Ambito di Applicazione" },
              { n: "3", label: "Tabella degli Scaglioni" },
              { n: "4", label: "Riduzioni Previste" },
              { n: "5", label: "Maggiorazioni" },
              { n: "6", label: "Esempio Pratico" },
              { n: "7", label: "Riferimenti Normativi" },
            ].map((item) => (
              <span
                key={item.n}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <span
                  className="w-6 h-6 bg-primary/10 border border-foreground flex items-center justify-center text-xs font-bold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {item.n}
                </span>
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* 1. Introduzione */}
          <section>
            <SectionHeader icon={BookOpen} number="1" title="Introduzione" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Il <strong className="text-foreground">Decreto Ministeriale 150/2023</strong> (pubblicato in Gazzetta Ufficiale il 2 novembre 2023)
                ha ridefinito i criteri per la determinazione delle indennità spettanti agli organismi di mediazione civile e commerciale.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Questo decreto attua le disposizioni introdotte dalla <strong className="text-foreground">Riforma Cartabia</strong> (D.Lgs. 149/2022),
                che ha profondamente modificato il D.Lgs. 28/2010 in materia di mediazione. Il D.M. 150/2023 sostituisce il precedente
                D.M. 180/2010, aggiornando la Tabella delle indennità e introducendo nuove regole per il calcolo dei costi.
              </p>
              <div className="border-2 border-primary bg-primary/5 p-4 mt-4">
                <p className="text-sm font-semibold text-foreground">
                  Il D.M. 150/2023 è entrato in vigore il 17 novembre 2023 e si applica a tutte le procedure di mediazione avviate successivamente a tale data.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Ambito di Applicazione */}
          <section>
            <SectionHeader icon={Scale} number="2" title="Ambito di Applicazione" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Il decreto si applica a tutte le procedure di mediazione civile e commerciale gestite dagli organismi iscritti
                nel Registro tenuto dal Ministero della Giustizia. I criteri di calcolo si applicano indipendentemente dal tipo di mediazione:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="border-2 border-foreground p-4 bg-muted/30">
                  <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Volontaria
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Scelta liberamente dalle parti senza obbligo di legge. Si applica l'indennità piena senza riduzioni.
                  </p>
                </div>
                <div className="border-2 border-foreground p-4 bg-muted/30">
                  <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Obbligatoria
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Imposta dalla legge come condizione di procedibilità (art. 5 D.Lgs. 28/2010). Prevista riduzione del 20%.
                  </p>
                </div>
                <div className="border-2 border-foreground p-4 bg-muted/30">
                  <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Demandata
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Disposta dal giudice nel corso del giudizio (art. 5-quater D.Lgs. 28/2010). Prevista riduzione del 20%.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Per le controversie di <strong className="text-foreground">valore indeterminabile</strong>, il decreto prevede tre fasce
                di riferimento: bassa complessità (€25.000), media complessità (€50.000) e alta complessità (€250.000).
              </p>
            </div>
          </section>

          {/* 3. Tabella degli Scaglioni */}
          <section>
            <SectionHeader icon={Table2} number="3" title="Tabella degli Scaglioni" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 border-b-2 border-foreground">
                <p className="text-muted-foreground leading-relaxed">
                  La Tabella A allegata al D.M. 150/2023 stabilisce le indennità di mediazione in base al valore della controversia.
                  Ogni scaglione prevede un importo fisso per le spese di avvio e un'indennità base per ciascuna parte.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/30">
                      <th className="text-left px-4 py-3 text-sm font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Valore della Lite
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-bold border-r-2 border-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Spese di Avvio
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Indennità (per parte)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaglioni.map((s, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-muted ${idx % 2 === 0 ? "bg-card" : "bg-muted/10"}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium border-r-2 border-foreground">
                          {s.label}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-right border-r-2 border-foreground"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {formatEuro(s.speseAvvio)}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-right font-semibold"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {formatEuro(s.indennita)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t-2 border-foreground bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Fonte: Tabella A, D.M. 150/2023 — Gazzetta Ufficiale della Repubblica Italiana, 2 novembre 2023.
                  Importi per ciascuna parte. IVA 22% esclusa.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Riduzioni Previste */}
          <section>
            <SectionHeader icon={TrendingDown} number="4" title="Riduzioni Previste" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Il D.M. 150/2023 prevede specifiche riduzioni dell'indennità di mediazione nei seguenti casi:
              </p>
              <div className="space-y-4">
                <ReductionCard
                  title="Mediazione obbligatoria o demandata"
                  reduction="-20%"
                  description="Quando la mediazione è condizione di procedibilità (obbligatoria) o è disposta dal giudice (demandata), l'indennità è ridotta di un quinto (20%). Questa riduzione si applica sia al primo incontro che agli incontri successivi."
                />
                <ReductionCard
                  title="Primo incontro senza accordo"
                  reduction="Solo spese avvio + indennità primo incontro"
                  description="Se le parti non raggiungono l'accordo al primo incontro e decidono di non proseguire, sono dovute solo le spese di avvio (€40) e l'indennità relativa al primo incontro, con le eventuali riduzioni applicabili."
                />
                <ReductionCard
                  title="Gratuito patrocinio"
                  reduction="Esenzione totale"
                  description="La parte ammessa al patrocinio a spese dello Stato è esente dal pagamento dell'indennità di mediazione. L'organismo non può richiedere alcun compenso a tale parte. L'indennità è posta a carico dell'erario."
                />
                <ReductionCard
                  title="Detrazione spese di avvio"
                  reduction="-€40"
                  description="Negli incontri successivi al primo, le spese di avvio (€40) già versate vengono detratte dall'indennità complessiva, evitando una doppia imposizione a carico delle parti."
                />
              </div>
            </div>
          </section>

          {/* 5. Maggiorazioni */}
          <section>
            <SectionHeader icon={TrendingUp} number="5" title="Maggiorazioni" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                In determinate circostanze, l'indennità di mediazione può essere maggiorata:
              </p>
              <div className="space-y-4">
                <div className="border-2 border-foreground p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-bold border border-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      +20%
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Accordo raggiunto
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Quando le parti raggiungono un accordo di mediazione (sia al primo incontro che negli incontri
                        successivi), l'indennità è maggiorata di un quinto (20%). Questa maggiorazione incentiva
                        il raggiungimento dell'accordo e premia l'organismo per il risultato ottenuto.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-foreground p-4 bg-muted/20">
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-block px-2 py-1 bg-muted-foreground text-background text-xs font-bold border border-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Variabile
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Perizia tecnica e complessità particolare
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        In caso di procedimenti che richiedono perizia tecnica o che presentano materia di particolare
                        complessità, l'organismo può prevedere costi aggiuntivi per la consulenza tecnica,
                        da concordare con le parti. Le spese per l'eventuale consulente tecnico sono separate
                        dall'indennità di mediazione e sono a carico delle parti che ne hanno fatto richiesta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-2 border-primary bg-primary/5 p-4 mt-6">
                <p className="text-sm text-foreground">
                  <strong>Nota:</strong> L'IVA al 22% si applica sull'importo totale dell'indennità (comprensivo
                  di eventuali riduzioni e maggiorazioni) ed è a carico di ciascuna parte.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Esempio Pratico */}
          <section>
            <SectionHeader icon={Calculator} number="6" title="Esempio Pratico" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Vediamo un esempio concreto di calcolo per una controversia condominiale (mediazione obbligatoria)
                del valore di <strong className="text-foreground">€30.000</strong>, conclusa con accordo al primo incontro.
              </p>

              <div className="border-2 border-foreground bg-muted/10 p-4 mb-6">
                <h4 className="font-bold text-sm mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Parametri
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Valore della lite:</span> <strong>€30.000</strong></div>
                  <div><span className="text-muted-foreground">Scaglione:</span> <strong>€25.001 - €50.000</strong></div>
                  <div><span className="text-muted-foreground">Tipo:</span> <strong>Obbligatoria (condominiale)</strong></div>
                  <div><span className="text-muted-foreground">Esito:</span> <strong>Accordo al primo incontro</strong></div>
                </div>
              </div>

              <div className="space-y-3">
                <ExampleRow label="1. Spese di avvio" value="€40,00" />
                <ExampleRow label="2. Indennità base (scaglione €25.001-€50.000)" value="€600,00" />
                <ExampleRow label="3. Riduzione obbligatoria (-20% di €600)" value="-€120,00" highlight="reduction" />
                <ExampleRow label="4. Indennità primo incontro (€600 - €120)" value="€480,00" />
                <ExampleRow label="5. Totale primo incontro (€40 + €480)" value="€520,00" />
                <ExampleRow label="6. Maggiorazione accordo (+20% di €600)" value="+€120,00" highlight="increase" />
                <div className="border-t-2 border-foreground pt-3">
                  <ExampleRow label="Totale per parte" value="€640,00" bold />
                </div>
                <ExampleRow label="IVA 22%" value="€140,80" />
                <div className="border-t-2 border-foreground pt-3">
                  <ExampleRow label="Totale per parte (IVA inclusa)" value="€780,80" bold />
                  <ExampleRow label="Totale complessivo (2 parti, IVA esclusa)" value="€1.280,00" bold />
                </div>
              </div>

              <div className="mt-6">
                <Link href="/calcolatore">
                  <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                    <Calculator className="w-4 h-4" />
                    Calcola con il tuo caso
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* 7. Riferimenti Normativi */}
          <section>
            <SectionHeader icon={ExternalLink} number="7" title="Riferimenti Normativi" />
            <div className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Di seguito i principali riferimenti normativi in materia di mediazione civile e commerciale:
              </p>
              <div className="space-y-3">
                <ReferenceLink
                  title="D.M. 150/2023"
                  description="Decreto Ministeriale 25 ottobre 2023, n. 150 — Determinazione dei criteri e delle modalità di calcolo delle indennità spettanti agli organismi di mediazione"
                  url="https://www.gazzettaufficiale.it/eli/id/2023/11/02/23G00163/sg"
                />
                <ReferenceLink
                  title="D.Lgs. 28/2010"
                  description="Decreto Legislativo 4 marzo 2010, n. 28 — Attuazione dell'articolo 60 della legge 18 giugno 2009, n. 69, in materia di mediazione finalizzata alla conciliazione delle controversie civili e commerciali"
                  url="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28"
                />
                <ReferenceLink
                  title="D.Lgs. 149/2022 (Riforma Cartabia)"
                  description="Decreto Legislativo 10 ottobre 2022, n. 149 — Attuazione della legge 26 novembre 2021, n. 206, recante delega al Governo per l'efficienza del processo civile"
                  url="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2022-10-10;149"
                />
                <ReferenceLink
                  title="Art. 5 D.Lgs. 28/2010"
                  description="Condizione di procedibilità — Disciplina della mediazione obbligatoria e delle materie soggette"
                  url="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28~art5"
                />
              </div>
              <div className="border-2 border-primary bg-primary/5 p-4 mt-6">
                <p className="text-sm text-foreground">
                  <strong>Disclaimer:</strong> Le informazioni contenute in questa guida hanno carattere puramente informativo
                  e divulgativo. Non costituiscono parere legale. Per una valutazione specifica del proprio caso,
                  si consiglia di consultare un professionista abilitato.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-2 border-foreground bg-primary/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Pronto a calcolare?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Usa il nostro calcolatore per ottenere l'importo esatto delle indennità di mediazione
            per il tuo caso specifico.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calcolatore">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                <Calculator className="w-4 h-4" />
                Calcola Indennità
              </span>
            </Link>
            <Link href="/faq">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer">
                Leggi le FAQ
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, number, title }: { icon: React.ElementType; number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-primary/10 border-2 border-foreground flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <span className="text-primary mr-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{number}.</span>
        {title}
      </h2>
    </div>
  );
}

function ReductionCard({ title, reduction, description }: { title: string; reduction: string; description: string }) {
  return (
    <div className="border-2 border-foreground p-4 bg-muted/10">
      <div className="flex items-start gap-3">
        <span
          className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold border border-foreground shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {reduction}
        </span>
        <div>
          <h4 className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ExampleRow({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: "reduction" | "increase" }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight === "reduction" ? "text-red-600" : highlight === "increase" ? "text-green-600" : "text-foreground"
        } ${bold ? "text-base" : ""}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </span>
    </div>
  );
}

function ReferenceLink({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-2 border-foreground p-4 bg-muted/10 hover:bg-muted/30 transition-colors duration-150 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors duration-150" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors duration-150" />
      </div>
    </a>
  );
}
