import { Link } from "wouter";
import { ArrowLeft, Cookie } from "lucide-react";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/CookieConsent";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity text-primary">
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Cookie className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cookie Policy</h1>
        </div>

        <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-7">
          <p className="text-sm opacity-70">Ultimo aggiornamento: 8 settembre 2026</p>

          <Section title="1. Scelte disponibili">
            <p>CalcoloMediazione.it usa una preferenza tecnica necessaria per ricordare la scelta dell'utente. Google Analytics viene caricato soltanto dopo un consenso esplicito. Rifiutare i cookie analitici non limita i calcolatori né le altre funzioni essenziali.</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))}
              className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              Modifica le preferenze cookie
            </button>
          </Section>

          <Section title="2. Cookie e strumenti effettivamente utilizzati">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-foreground/20">
                    <th className="text-left py-2 pr-4">Nome</th>
                    <th className="text-left py-2 pr-4">Finalità</th>
                    <th className="text-left py-2 pr-4">Durata</th>
                    <th className="text-left py-2">Base</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4 font-mono">cm_consent</td>
                    <td className="py-2 pr-4">Memorizza accettazione o rifiuto di Google Analytics</td>
                    <td className="py-2 pr-4">12 mesi se accettato; 6 mesi se rifiutato</td>
                    <td className="py-2">Necessario</td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4 font-mono">_ga, _ga_*</td>
                    <td className="py-2 pr-4">Misurazione statistica tramite Google Analytics 4, ID G-MS9CY7VC3S</td>
                    <td className="py-2 pr-4">Secondo le impostazioni di Google Analytics, normalmente fino a 2 anni</td>
                    <td className="py-2">Consenso</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>La configurazione Analytics disabilita i segnali Google e la personalizzazione pubblicitaria. Se manca il consenso, lo script Analytics non viene caricato.</p>
          </Section>

          <Section title="3. Statistiche interne senza cookie">
            <p>Il sito conta le visualizzazioni delle singole pagine con una richiesta al proprio server. Questo conteggio non usa cookie, non crea profili, non conserva indirizzi IP o user-agent ed è mantenuto soltanto in memoria fino al riavvio del servizio. È distinto da Google Analytics.</p>
          </Section>

          <Section title="4. Memoria locale del browser">
            <p>Alcune funzioni usano localStorage, che non è un cookie: preferenze dei calcolatori, modelli di lavoro, token casuali per riaprire le analisi e uno storico tecnico minimizzato. Questi dati restano sul dispositivo finché l'utente li elimina o cancella i dati del sito. Su computer condivisi è opportuno rimuoverli al termine del lavoro.</p>
          </Section>

          <Section title="5. Revoca e cancellazione">
            <p>La scelta può essere modificata in qualsiasi momento dal pulsante presente in questa pagina o dal link “Preferenze cookie” nel footer. Se il consenso viene revocato, Analytics viene disabilitato e il sito tenta di eliminare i relativi cookie di prima parte. È sempre possibile cancellare anche cookie e memoria locale dalle impostazioni del browser.</p>
          </Section>

          <Section title="6. Terze parti e riferimenti">
            <p>Per il trattamento Analytics consulta la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">Privacy Policy di Google</a>. I servizi IA non sono strumenti di tracciamento e sono descritti separatamente nella <Link href="/privacy-policy"><span className="underline cursor-pointer text-primary">Privacy Policy</span></Link>.</p>
            <p>La gestione del consenso segue le <a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876" target="_blank" rel="noopener noreferrer" className="underline text-primary">Linee guida del Garante sui cookie e altri strumenti di tracciamento</a>.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2 opacity-90">{children}</div>
    </section>
  );
}
