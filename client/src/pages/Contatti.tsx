import { Link } from "wouter";
import { ArrowLeft, Mail, Globe, MapPin, ExternalLink } from "lucide-react";

export default function Contatti() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Mail className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Contatti
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Contatto */}
          <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Informazioni di Contatto
            </h2>

            <div className="space-y-5">
              <ContactItem
                icon={Mail}
                label="Email"
                value="calcagnocarloalberto1@gmail.com"
                href="mailto:calcagnocarloalberto1@gmail.com"
              />
              <ContactItem
                icon={Globe}
                label="Sito Web"
                value="calcolomediazione.com"
                href="https://calcolomediazione.com"
                external
              />
              <ContactItem
                icon={MapPin}
                label="Sede"
                value="Genova, Italia"
              />
            </div>

            <div className="mt-8 p-4 border border-foreground/20 bg-background/50">
              <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Orari di Risposta
              </h3>
              <p className="text-xs leading-relaxed opacity-80">
                Le richieste inviate via email vengono generalmente evase entro 48 ore lavorative. Per questioni urgenti relative al funzionamento del calcolatore, si prega di indicare nell'oggetto "URGENTE - CalcoloMediazione".
              </p>
            </div>
          </div>

          {/* Suggerimenti e Segnalazioni */}
          <div className="space-y-6">
            <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Segnalazioni e Suggerimenti
              </h2>
              <p className="text-sm leading-relaxed opacity-90 mb-4">
                Il tuo feedback è importante per migliorare CalcoloMediazione.com. Puoi scriverci per:
              </p>
              <ul className="space-y-3">
                <SuggestionItem title="Errori di calcolo" description="Se riscontri imprecisioni nei calcoli delle indennità o nei confronti economici" />
                <SuggestionItem title="Aggiornamenti normativi" description="Se sei a conoscenza di modifiche legislative non ancora recepite" />
                <SuggestionItem title="Nuove funzionalità" description="Se hai idee per migliorare il calcolatore o l'analisi AI" />
                <SuggestionItem title="Problemi tecnici" description="Se riscontri bug, errori di visualizzazione o problemi di navigazione" />
              </ul>
            </div>

            <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Altri Progetti
              </h2>
              <div className="space-y-3">
                <ProjectLink
                  name="EnneagrammaEvolutivo.com"
                  description="Percorsi di crescita personale e consapevolezza"
                  href="https://enneagrammaevolutivo.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href, external }: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</p>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium underline flex items-center gap-1"
            style={{ color: 'var(--primary)' }}
          >
            {value}
            {external && <ExternalLink className="w-3 h-3" />}
          </a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

function SuggestionItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }} />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-70">{description}</p>
      </div>
    </li>
  );
}

function ProjectLink({ name, description, href }: { name: string; description: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-foreground/20 bg-background/50 hover:bg-background/80 transition-colors group">
      <Globe className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
      <div className="flex-1">
        <p className="text-sm font-bold group-hover:underline">{name}</p>
        <p className="text-xs opacity-70">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-70" />
    </a>
  );
}
