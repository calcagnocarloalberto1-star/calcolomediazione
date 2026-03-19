import { Link } from "wouter";
import { ArrowLeft, User, Scale, Brain, BookOpen, Award } from "lucide-react";

export default function ChiSiamo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Chi Siamo
          </h1>
        </div>

        {/* Hero section */}
        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CalcoloMediazione.com
          </h2>
          <p className="text-sm leading-relaxed opacity-90 mb-4">
            CalcoloMediazione.com è uno strumento professionale gratuito dedicato al calcolo delle indennità di mediazione civile e commerciale, conforme al D.M. 150/2023. Il progetto nasce dall'esperienza diretta nel campo della mediazione e della risoluzione alternativa delle controversie (ADR), con l'obiettivo di fornire a mediatori, avvocati e cittadini uno strumento preciso, aggiornato e accessibile.
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            Il sito integra un sistema di intelligenza artificiale avanzato per l'analisi dei casi di mediazione, offrendo supporto nell'analisi giuridica, nella valutazione strategica, nel confronto economico tra mediazione e processo civile, e nella redazione di bozze di accordo.
          </p>
        </div>

        {/* Il Progetto */}
        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Il Progetto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={Scale}
              title="Calcolatore Conforme"
              description="Calcolo delle indennità secondo le tariffe nazionali D.M. 150/2023 e le tariffe del COA Genova, con supporto per mediazione obbligatoria, volontaria e demandata."
            />
            <FeatureCard
              icon={Brain}
              title="Analisi AI"
              description="Pipeline di analisi in 8 fasi: giuridica, strategica, MAAN/BATNA, compatibilità interessi, bias cognitivi, bozza accordo, prospetto economico e confronto costi."
            />
            <FeatureCard
              icon={BookOpen}
              title="Risorse Normative"
              description="Guide dettagliate al D.M. 150/2023, riferimenti normativi aggiornati alla Riforma Cartabia e FAQ sulla mediazione civile e commerciale."
            />
            <FeatureCard
              icon={Award}
              title="Gratuito e Indipendente"
              description="Il sito è completamente gratuito, senza pubblicità e senza affiliazione ad alcun organismo di mediazione. Un servizio per la comunità giuridica."
            />
          </div>
        </div>

        {/* L'Autore */}
        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            L'Autore
          </h2>
          <p className="text-sm leading-relaxed opacity-90 mb-3">
            <strong>Carlo Alberto Calcagno</strong> è un professionista della mediazione civile e commerciale con sede a Genova. Iscritto all'Albo degli Avvocati, opera nel campo della risoluzione alternativa delle controversie (ADR) con una vasta esperienza nella mediazione e nella gestione dei conflitti.
          </p>
          <p className="text-sm leading-relaxed opacity-90 mb-3">
            Studioso di storia del diritto e delle procedure di conciliazione, coniuga la competenza giuridica con un forte interesse per l'innovazione tecnologica applicata al settore legale, in particolare per l'impiego dell'intelligenza artificiale a supporto della mediazione.
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            È autore di diversi progetti web nel campo dell'ADR e della crescita personale, tra cui <a href="https://enneagrammaevolutivo.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>EnneagrammaEvolutivo.com</a>.
          </p>
        </div>

        {/* Missione */}
        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            La Nostra Missione
          </h2>
          <div className="space-y-3 text-sm leading-relaxed opacity-90">
            <p>
              La mediazione civile e commerciale rappresenta uno strumento fondamentale per la risoluzione efficace delle controversie, ma spesso la comprensione dei suoi costi e benefici rimane poco accessibile. CalcoloMediazione.com nasce per colmare questa lacuna.
            </p>
            <p>I nostri obiettivi:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Trasparenza:</strong> rendere immediatamente comprensibili i costi della mediazione</li>
              <li><strong>Confronto:</strong> permettere una valutazione obiettiva tra mediazione e processo civile</li>
              <li><strong>Innovazione:</strong> applicare l'intelligenza artificiale per supportare l'analisi dei casi</li>
              <li><strong>Accessibilità:</strong> offrire strumenti gratuiti e professionali a tutti gli operatori del diritto</li>
              <li><strong>Aggiornamento:</strong> mantenere il calcolatore conforme alle ultime modifiche normative</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
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
