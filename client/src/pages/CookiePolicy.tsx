import { Link } from "wouter";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Cookie className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Cookie Policy
          </h1>
        </div>

        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-6">
          <p className="text-sm opacity-60">Ultimo aggiornamento: Marzo 2026</p>

          <Section title="1. Cosa Sono i Cookie">
            <p>I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo terminale (computer, tablet, smartphone), dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. I cookie sono utilizzati per diverse finalità, dall'esecuzione di autenticazioni informatiche al monitoraggio di sessioni, alla memorizzazione di informazioni su specifiche configurazioni degli utenti.</p>
          </Section>

          <Section title="2. Tipologie di Cookie Utilizzati">
            <p>Il Sito CalcoloMediazione.com utilizza le seguenti categorie di cookie:</p>

            <h3 className="font-bold mt-3">2.1 Cookie Tecnici (necessari)</h3>
            <p>Sono essenziali per il corretto funzionamento del Sito e non possono essere disattivati. Includono:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Cookie di sessione per il mantenimento dello stato di navigazione</li>
              <li>Cookie funzionali per ricordare le preferenze dell'utente (es. modalità tariffe selezionata)</li>
              <li>Cookie di sicurezza per prevenire attività fraudolente</li>
            </ul>
            <p className="mt-2 text-xs opacity-70">Questi cookie non richiedono il consenso preventivo dell'utente ai sensi dell'art. 122, comma 1, del Codice Privacy (D.Lgs. 196/2003) e del Provvedimento del Garante dell'8 maggio 2014.</p>

            <h3 className="font-bold mt-4">2.2 Cookie Analitici</h3>
            <p>Utilizzati per raccogliere informazioni statistiche aggregate sull'utilizzo del Sito (numero di visitatori, pagine visitate, tempo di permanenza). Questi dati sono raccolti in forma anonima e aggregata.</p>

            <h3 className="font-bold mt-4">2.3 Cookie di Terze Parti</h3>
            <p>Il Sito potrebbe utilizzare servizi di terze parti che installano propri cookie. In particolare:</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-foreground/20">
                    <th className="text-left py-2 pr-4 font-bold">Servizio</th>
                    <th className="text-left py-2 pr-4 font-bold">Finalità</th>
                    <th className="text-left py-2 font-bold">Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4">Servizi AI (Anthropic)</td>
                    <td className="py-2 pr-4">Elaborazione analisi AI</td>
                    <td className="py-2"><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Privacy Policy</a></td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4">Font CDN (Google Fonts / Fontsource)</td>
                    <td className="py-2 pr-4">Caricamento font tipografici</td>
                    <td className="py-2"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Privacy Policy</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="3. Durata dei Cookie">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-foreground/20">
                    <th className="text-left py-2 pr-4 font-bold">Tipo</th>
                    <th className="text-left py-2 pr-4 font-bold">Durata</th>
                    <th className="text-left py-2 font-bold">Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4">Cookie di sessione</td>
                    <td className="py-2 pr-4">Fino alla chiusura del browser</td>
                    <td className="py-2">Eliminati automaticamente al termine della sessione</td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pr-4">Cookie persistenti</td>
                    <td className="py-2 pr-4">Max 12 mesi</td>
                    <td className="py-2">Memorizzano preferenze dell'utente tra le sessioni</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Gestione dei Cookie">
            <p>L'utente può gestire le preferenze relative ai cookie direttamente all'interno del proprio browser. Di seguito i link alle istruzioni per i browser più diffusi:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Safari</a></li>
              <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>Microsoft Edge</a></li>
            </ul>
            <p className="mt-2">La disattivazione dei cookie tecnici potrebbe compromettere il corretto funzionamento di alcune funzionalità del Sito.</p>
          </Section>

          <Section title="5. Riferimenti Normativi">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Regolamento UE 2016/679 (GDPR)</li>
              <li>D.Lgs. 196/2003 (Codice Privacy), come modificato dal D.Lgs. 101/2018</li>
              <li>Provvedimento del Garante Privacy dell'8 maggio 2014 ("Individuazione delle modalità semplificate per l'informativa e l'acquisizione del consenso per l'uso dei cookie")</li>
              <li>Linee guida del Garante Privacy del 10 giugno 2021 su cookie e altri strumenti di tracciamento</li>
            </ul>
          </Section>

          <Section title="6. Aggiornamenti">
            <p>La presente Cookie Policy può essere aggiornata periodicamente. L'utente è invitato a consultare questa pagina per verificare eventuali modifiche. Per informazioni generali sul trattamento dei dati, si rinvia alla <Link href="/privacy-policy"><span className="underline cursor-pointer" style={{ color: 'var(--primary)' }}>Privacy Policy</span></Link>.</p>
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
