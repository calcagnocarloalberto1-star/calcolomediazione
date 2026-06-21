import { Link } from "wouter";
import {
  ArrowLeft,
  User,
  Scale,
  Brain,
  BookOpen,
  Award,
  Calculator,
  TrendingUp,
  Building2,
  FileText,
  FileCheck,
  Gavel,
  Coins,
  Swords,
  GraduationCap,
  Code2,
  Sparkles,
  Heart,
  Landmark,
} from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { chiSiamoJsonLd } from "./chi-siamo-jsonld";

export default function ChiSiamo() {
  return (
    <main
      className="min-h-screen bg-background"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <SeoHead
        title="Chi Siamo — Avv. Carlo Alberto Calcagno, mediatore e Legal Tech Genova"
        description="Avv. Carlo Alberto Calcagno: mediatore familiare e civile ODM Genova, commissario ADR COA Genova, formatore. Legal Tech, AI applicata alla mediazione e ADR. Tutti gli strumenti gratuiti di CalcoloMediazione."
        canonical="https://calcolomediazione.it/chi-siamo"
        jsonLd={chiSiamoJsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <header className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Chi Siamo
          </h1>
        </header>

        {/* Hero section */}
        <section aria-labelledby="hero-title" className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 id="hero-title" className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CalcoloMediazione.it
          </h2>
          <p className="text-sm leading-relaxed opacity-90 mb-4">
            CalcoloMediazione.it è una piattaforma professionale gratuita dedicata alla mediazione civile e commerciale, conforme al D.M. 150/2023 e alla Riforma Cartabia (D.Lgs. 149/2022). Il progetto nasce dall’esperienza diretta nel campo della mediazione e della risoluzione alternativa delle controversie (ADR), con l’obiettivo di fornire a mediatori, avvocati e cittadini strumenti precisi, aggiornati e accessibili.
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            Il sito integra un sistema di intelligenza artificiale avanzato per l’analisi dei casi, una banca dati giurisprudenziale curata, un generatore di procura speciale sostanziale conforme agli orientamenti di Cassazione 2025-2026, una guida ai costi notarili, un calcolo del credito d’imposta e una sezione di strategie di negoziazione. Tutto gratuito, senza pubblicità e senza affiliazioni.
          </p>
        </section>

        {/* Il Progetto */}
        <section aria-labelledby="progetto-title" className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 id="progetto-title" className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Il Progetto
          </h2>
          <p className="text-xs opacity-70 mb-5">
            Tutti gli strumenti disponibili gratuitamente sul sito.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={Calculator}
              title="Calcolatore Indennità"
              description="Calcolo delle indennità di mediazione secondo il D.M. 150/2023 e le tariffe COA Genova. Supporto per mediazione obbligatoria, volontaria e demandata dal giudice."
              href="/calcolatore"
            />
            <FeatureCard
              icon={Brain}
              title="Analisi AI del Caso"
              description="Pipeline AI in 8 fasi: analisi giuridica, strategia, MAAN/BATNA, compatibilità interessi, bias cognitivi, bozza accordo, prospetto economico e confronto costi."
              href="/analisi-caso-ai"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Confronto Costi"
              description="Comparazione economica trasparente tra mediazione e processo civile: contributo unificato, marche, onorari, durata media e probabilità di successo."
              href="/confronto-costi"
            />
            <FeatureCard
              icon={Building2}
              title="Costi Notarili"
              description="Calcolo dei costi notarili per l’autenticazione dell’accordo di mediazione (art. 11 D.Lgs. 28/2010) quando è richiesta la forma pubblica per la trascrizione."
              href="/costi-notarili"
            />
            <FeatureCard
              icon={Coins}
              title="Credito d’Imposta"
              description="Stima del credito d’imposta riconosciuto in caso di successo della mediazione (art. 20 D.Lgs. 28/2010 post-Cartabia), con tetti aggiornati e simulazione personalizzata."
              href="/credito-imposta"
            />
            <FeatureCard
              icon={FileCheck}
              title="Generatore Procura"
              description="Generatore gratuito di procura speciale sostanziale per la mediazione, conforme a Cass. 8473/2019, 14676/2025, 9608/2026 e 10978/2026. Download in PDF e DOCX."
              href="/generatore-procura"
            />
            <FeatureCard
              icon={Gavel}
              title="Banca Dati Giurisprudenza"
              description="Raccolta di 88 pronunce di Corte Costituzionale, Cassazione SS.UU., Cassazione e merito dal 2010 ad oggi, con massime, principi di diritto e note esplicative."
              href="/giurisprudenza"
            />
            <FeatureCard
              icon={Swords}
              title="Strategie di Negoziazione"
              description="Tecniche operative di negoziazione integrativa, gestione delle emozioni, ascolto attivo, MAAN/BATNA e strumenti psicologici per il tavolo di mediazione."
              href="/strategie-negoziazione"
            />
            <FeatureCard
              icon={BookOpen}
              title="Guida D.M. 150/2023"
              description="Guida operativa al D.M. 150/2023 con esempi pratici, parametri di calcolo, casi particolari (litisconsorzio, mancata partecipazione, gratuito patrocinio)."
              href="/guida-dm-150"
            />
            <FeatureCard
              icon={FileText}
              title="Glossario"
              description="Glossario ragionato dei termini tecnici della mediazione e dell’ADR: dalla condizione di procedibilità al patrocinio a spese dello Stato, dalla MAAN al BATNA."
              href="/glossario"
            />
            <FeatureCard
              icon={Scale}
              title="FAQ Aggiornate"
              description="Domande frequenti su procura sostanziale, partecipazione personale, mediazione obbligatoria, sanzioni ex art. 12-bis, gratuito patrocinio e Riforma Cartabia."
              href="/faq"
            />
            <FeatureCard
              icon={Award}
              title="Gratuito e Indipendente"
              description="Tutto il sito è gratuito, senza pubblicità e senza affiliazione ad alcun organismo di mediazione. Un servizio professionale per la comunità giuridica."
            />
          </div>
        </section>

        {/* L'Autore */}
        <section
          aria-labelledby="autore-title"
          className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6"
          itemScope
          itemType="https://schema.org/Person"
          itemProp="author"
        >
          <meta itemProp="honorificPrefix" content="Avv." />
          <meta itemProp="jobTitle" content="Avvocato e mediatore civile, commerciale e familiare" />
          <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="hidden">
            <meta itemProp="addressLocality" content="Genova" />
            <meta itemProp="addressRegion" content="Liguria" />
            <meta itemProp="addressCountry" content="IT" />
          </span>
          <h2 id="autore-title" className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            L’Autore
          </h2>
          <p className="text-xs opacity-70 mb-5">
            <span itemProp="name">Avv. Carlo Alberto Calcagno</span> — Genova
          </p>

          <p className="text-sm leading-relaxed opacity-90 mb-3">
            <strong>Carlo Alberto Calcagno</strong> è avvocato del Foro di Genova e mediatore civile e commerciale. È iscritto come <strong>mediatore familiare e civile</strong> presso organismi accreditati di Genova e svolge attività di <strong>formatore</strong> nei percorsi di abilitazione e aggiornamento professionale dei mediatori. È membro della <strong>Commissione ADR del Consiglio dell’Ordine degli Avvocati di Genova</strong>, dove contribuisce all’elaborazione di protocolli e linee guida sulla mediazione obbligatoria, demandata e sulla risoluzione alternativa delle controversie.
          </p>

          <p className="text-sm leading-relaxed opacity-90 mb-3">
            La sua attività professionale si concentra sulla <strong>mediazione familiare</strong> (separazioni, divorzi, conflitti genitoriali, rapporti intergenerazionali) e sulla <strong>mediazione civile e commerciale</strong> (condominio, diritti reali, locazioni, contratti, successioni). Affianca alle competenze tecnico-giuridiche un approccio <strong>olistico e integrativo</strong> alla gestione del conflitto, che combina strumenti psicologici (Enneagramma, comunicazione non violenta), pratiche di consapevolezza e framework filosofico-spirituali, per accompagnare le parti oltre il piano puramente posizionale.
          </p>

          <p className="text-sm leading-relaxed opacity-90 mb-3">
            <strong>Autore e ricercatore</strong>, si dedica allo studio della <strong>storia del diritto e delle procedure di conciliazione</strong>: dal diritto romano alle costituzioni sabaude, dalla riforma giudiziaria post-unitaria fino al moderno sistema italiano di ADR. Questa prospettiva storica nutre un’interpretazione vivente delle norme attuali sulla mediazione, anche alla luce delle più recenti pronunce di legittimità (Cass. 9608/2026, 10978/2026, 14676/2025).
          </p>

          <p className="text-sm leading-relaxed opacity-90 mb-3">
            È <strong>sviluppatore full-stack autodidatta</strong> (JavaScript/TypeScript, React, Node.js, PostgreSQL/Drizzle, PHP) e progettista di applicazioni AI a supporto del diritto. CalcoloMediazione.it è il suo progetto principale e integra modelli di linguaggio di ultima generazione (Anthropic Claude, OpenAI, Google Gemini) attraverso una pipeline di <em>prompt engineering</em> calibrata sulla materia mediativa.
          </p>

          <p className="text-sm leading-relaxed opacity-90">
            Ha ideato e cura altri progetti web nel campo dell’ADR, della crescita personale e degli approcci integrativi alla persona:{" "}
            <a href="https://enneagrammaevolutivo.it" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>EnneagrammaEvolutivo.it</a>{" "}
            (Enneagramma come strumento di consapevolezza e di lettura dei conflitti) e{" "}
            <a href="https://olismo-integrato.it" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }} itemProp="sameAs">Olismo-Integrato.it</a>{" "}
            (approccio olistico-integrato al benessere e alla relazione).
          </p>
        </section>

        {/* Aree di competenza */}
        <section aria-labelledby="competenze-title" className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 id="competenze-title" className="text-xl font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Aree di Competenza
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CompetenzaCard
              icon={Scale}
              title="Mediazione Civile e Commerciale"
              description="Condominio, diritti reali, locazione, contratti, responsabilità, successioni, divisioni, risarcimento danni."
            />
            <CompetenzaCard
              icon={Heart}
              title="Mediazione Familiare"
              description="Separazioni, divorzi, gestione del conflitto genitoriale, accordi sull’affidamento, rapporti intergenerazionali."
            />
            <CompetenzaCard
              icon={GraduationCap}
              title="Formazione ADR"
              description="Corsi di abilitazione e aggiornamento per mediatori, seminari per avvocati, formazione sulla Riforma Cartabia."
            />
            <CompetenzaCard
              icon={Landmark}
              title="Storia del Diritto"
              description="Diritto romano, statuti sabaudi, sistema giudiziario italiano e storia delle procedure conciliative."
            />
            <CompetenzaCard
              icon={Sparkles}
              title="Approcci Integrativi"
              description="Enneagramma, psicologia dei conflitti, comunicazione non violenta, framework spirituali applicati alla mediazione."
            />
            <CompetenzaCard
              icon={Code2}
              title="Legal Tech e AI"
              description="Sviluppo full-stack di strumenti legali, integrazione di modelli AI, prompt engineering per la materia giuridica."
            />
          </div>
        </section>

        {/* Missione */}
        <section aria-labelledby="missione-title" className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8">
          <h2 id="missione-title" className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            La Nostra Missione
          </h2>
          <div className="space-y-3 text-sm leading-relaxed opacity-90">
            <p>
              La mediazione civile e commerciale rappresenta uno strumento fondamentale per la risoluzione efficace delle controversie, ma spesso la comprensione dei suoi costi, dei suoi presupposti tecnici e dei suoi benefici resta poco accessibile. CalcoloMediazione.it nasce per colmare questa lacuna.
            </p>
            <p>I nostri obiettivi:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Trasparenza:</strong> rendere immediatamente comprensibili i costi della mediazione</li>
              <li><strong>Confronto:</strong> permettere una valutazione obiettiva tra mediazione e processo civile</li>
              <li><strong>Innovazione:</strong> applicare l’intelligenza artificiale per supportare l’analisi dei casi</li>
              <li><strong>Accessibilità:</strong> offrire strumenti gratuiti e professionali a tutti gli operatori del diritto</li>
              <li><strong>Aggiornamento:</strong> mantenere il calcolatore e la banca dati conformi alle ultime modifiche normative e giurisprudenziali</li>
              <li><strong>Integrazione:</strong> coniugare rigore tecnico-giuridico, intelligenza artificiale e approcci olistici alla gestione del conflitto</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="p-4 border border-foreground/20 bg-background/50 h-full hover:border-foreground/60 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
      </div>
      <p className="text-xs leading-relaxed opacity-80">{description}</p>
    </div>
  );
  if (href) {
    return (
      <Link href={href}>
        <span className="block cursor-pointer h-full">{content}</span>
      </Link>
    );
  }
  return content;
}

function CompetenzaCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 border border-foreground/20 bg-background/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
      </div>
      <p className="text-xs leading-relaxed opacity-80">{description}</p>
    </div>
  );
}
