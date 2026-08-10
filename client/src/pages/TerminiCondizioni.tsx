import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";

export default function TerminiCondizioni() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Termini e Condizioni
          </h1>
        </div>

        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-6">
          <p className="text-sm opacity-60">Ultimo aggiornamento: Marzo 2026</p>

          <Section title="1. Premessa">
            <p>I presenti Termini e Condizioni regolano l'accesso e l'utilizzo del sito web CalcoloMediazione.it (di seguito "il Sito"), di proprietà di Carlo Alberto Calcagno. L'utilizzo del Sito implica l'accettazione integrale dei presenti Termini.</p>
          </Section>

          <Section title="2. Descrizione del Servizio">
            <p>Il Sito offre gratuitamente i seguenti servizi:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Calcolatore delle indennità di mediazione ai sensi del D.M. 150/2023</li>
              <li>Calcolatore con tariffe dell'Ordine degli Avvocati di Genova</li>
              <li>Confronto costi tra mediazione e processo civile</li>
              <li>Analisi AI dei casi di mediazione (analisi giuridica, strategica, economica)</li>
              <li>Esportazione PDF dei risultati</li>
              <li>Risorse informative sulla mediazione civile e commerciale</li>
            </ul>
          </Section>

          <Section title="3. Natura Indicativa dei Risultati">
            <div className="flex items-start gap-3 p-4 border-2 border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20 mt-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-400">Avvertenza Importante</p>
                <p className="mt-1">I calcoli, le analisi e le informazioni fornite dal Sito hanno carattere meramente indicativo e informativo. Non costituiscono consulenza legale, fiscale o professionale di alcun tipo. I risultati del calcolatore sono basati sui parametri normativi vigenti ma non possono tenere conto di tutte le variabili specifiche di ogni singolo caso.</p>
              </div>
            </div>
            <p className="mt-2">In particolare:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Le indennità calcolate sono valide esclusivamente per gli organismi di mediazione che applicano le tariffe del D.M. 150/2023</li>
              <li>I compensi degli avvocati sono calcolati sui valori medi previsti dal D.M. 55/2014 (Parametri Forensi) e possono variare significativamente</li>
              <li>Le analisi AI sono generate da modelli di intelligenza artificiale e possono contenere imprecisioni</li>
              <li>Per calcoli personalizzati e consulenza specifica, è necessario rivolgersi a un professionista qualificato</li>
            </ul>
          </Section>

          <Section title="4. Proprietà Intellettuale">
            <p>Tutti i contenuti del Sito — testi, grafica, layout, codice sorgente, loghi e marchi — sono di proprietà del Titolare o dei rispettivi aventi diritto e sono protetti dalle leggi italiane e internazionali sulla proprietà intellettuale.</p>
            <p className="mt-2"><strong>Riserva sull'estrazione di testo e dati (Text and Data Mining).</strong> Ai sensi dell'art. 70-quater della Legge 633/1941 (che recepisce l'art. 4 della Direttiva (UE) 2019/790) il Titolare esercita espressamente la riserva sull'estrazione di testo e dati dai contenuti del Sito per finalità di addestramento di modelli di intelligenza artificiale, apprendimento automatico, fine-tuning, generazione di embedding o alimentazione massiva/automatizzata di indici RAG (retrieval-augmented generation) propri di terzi. Tale riserva è resa disponibile in formato leggibile da macchina all'indirizzo <code>/tdm-policy.json</code> e tramite le direttive dedicate nel file <code>robots.txt</code> del Sito. Restano ferme la normale indicizzazione da parte dei motori di ricerca, la citazione con attribuzione per finalità accademiche o giornalistiche, e la lettura in tempo reale da parte di assistenti conversazionali AI che rispondono a una specifica query di un utente con attribuzione della fonte (agenti esplicitamente ammessi in <code>robots.txt</code>, quali ChatGPT-User, Claude-Web, PerplexityBot e equivalenti) — questi ultimi non costituiscono addestramento né alimentazione massiva di sistemi RAG propri. Per richieste di licenza relative all'uso dei contenuti oltre quanto sopra consentito, contattare il Titolare.</p>
            <p>È vietata la riproduzione, distribuzione, trasmissione o modifica dei contenuti del Sito senza preventiva autorizzazione scritta del Titolare, salvo quanto consentito dalla legge.</p>
          </Section>

          <Section title="5. Limitazione di Responsabilità">
            <p>Il Titolare non assume alcuna responsabilità per:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Eventuali errori, inesattezze o imprecisioni nei calcoli o nelle analisi generate</li>
              <li>Danni diretti o indiretti derivanti dall'utilizzo o dall'impossibilità di utilizzare il Sito</li>
              <li>Decisioni prese dall'utente sulla base delle informazioni fornite dal Sito</li>
              <li>Interruzioni o malfunzionamenti del servizio dovuti a cause tecniche o di forza maggiore</li>
              <li>Contenuti generati dall'intelligenza artificiale che possano risultare inesatti o incompleti</li>
            </ul>
          </Section>

          <Section title="6. Obblighi dell'Utente">
            <p>L'utente si impegna a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Utilizzare il Sito in conformità alla legge e ai presenti Termini</li>
              <li>Non utilizzare il Sito per finalità illecite o non autorizzate</li>
              <li>Non tentare di accedere in modo non autorizzato ai sistemi informatici del Sito</li>
              <li>Non sovraccaricare i server con richieste eccessive o automatizzate</li>
              <li>Non inserire nelle analisi AI dati personali sensibili di terzi senza il loro consenso</li>
            </ul>
          </Section>

          <Section title="7. Modifiche al Servizio e ai Termini">
            <p>Il Titolare si riserva il diritto di modificare, sospendere o interrompere il Sito o parte dei suoi servizi in qualsiasi momento e senza preavviso. Il Titolare si riserva altresì il diritto di aggiornare i presenti Termini; le modifiche saranno efficaci dalla data di pubblicazione su questa pagina.</p>
          </Section>

          <Section title="8. Legge Applicabile e Foro Competente">
            <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia relativa all'interpretazione, esecuzione o risoluzione dei presenti Termini, sarà competente in via esclusiva il Foro di Genova.</p>
          </Section>
        </div>

        {/* Note Legali */}
        <div className="mt-8 flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Note Legali
          </h1>
        </div>

        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-6">
          <Section title="Informazioni sul Sito">
            <p>CalcoloMediazione.it è un progetto personale di Carlo Alberto Calcagno, mediatore civile e commerciale.</p>
            <p>Il Sito è uno strumento professionale gratuito per il calcolo delle indennità di mediazione civile e commerciale, conforme al D.M. 150/2023.</p>
          </Section>

          <Section title="Disclaimer sull'Intelligenza Artificiale">
            <p>Le analisi generate tramite intelligenza artificiale presenti sul Sito sono prodotte da modelli linguistici di terze parti. Tali analisi:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Non costituiscono parere legale</li>
              <li>Possono contenere errori o imprecisioni</li>
              <li>Non sostituiscono la consulenza di un professionista qualificato</li>
              <li>Devono essere verificate dall'utente prima di qualsiasi utilizzo</li>
            </ul>
          </Section>

          <Section title="Fonti Normative">
            <p>I calcoli sono basati sulle seguenti fonti normative:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>D.Lgs. 28/2010 — Mediazione civile e commerciale</li>
              <li>D.M. 150/2023 — Regolamento indennità di mediazione</li>
              <li>D.Lgs. 149/2022 — Riforma Cartabia</li>
              <li>D.Lgs. 216/2024 — Correttivo Cartabia (durata mediazione 6 mesi)</li>
              <li>D.M. 55/2014 (agg. D.M. 147/2022) — Parametri forensi</li>
              <li>D.P.R. 115/2002 — Contributo unificato</li>
              <li>D.P.R. 131/1986 — Imposta di registro</li>
              <li>D.Lgs. 347/1990 — Imposte ipotecaria e catastale</li>
              <li>Art. 17 D.Lgs. 28/2010 — Agevolazioni fiscali</li>
              <li>Art. 20 D.Lgs. 28/2010 — Credito d'imposta</li>
            </ul>
          </Section>

          <Section title="Aggiornamento dei Contenuti">
            <p>Il Titolare si impegna a mantenere aggiornati i parametri normativi utilizzati nei calcoli. Tuttavia, eventuali modifiche legislative potrebbero non essere immediatamente recepite. L'utente è invitato a verificare sempre la normativa vigente al momento dell'utilizzo.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2 opacity-90">{children}</div>
    </div>
  );
}
