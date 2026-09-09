import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity text-primary">
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Informativa sul trattamento dei dati personali
          </h1>
        </div>

        <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-7">
          <p className="text-sm opacity-70">Ultimo aggiornamento: 8 settembre 2026</p>

          <Section title="1. Titolare del trattamento">
            <p>Il titolare del trattamento è Carlo Alberto Calcagno, responsabile di CalcoloMediazione.it. Le richieste privacy possono essere inviate mediante i recapiti indicati nella pagina <Link href="/contatti"><span className="underline cursor-pointer text-primary">Contatti</span></Link>.</p>
          </Section>

          <Section title="2. Dati trattati e origine">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Navigazione tecnica:</strong> il server riceve i dati necessari alla connessione e alla sicurezza. Le statistiche interne non conservano indirizzi IP o user-agent: il totale complessivo delle visualizzazioni è memorizzato nel database come solo numero aggregato, mentre il dettaglio per pagina resta volatile in memoria.</li>
              <li><strong>Calcolatori locali:</strong> i dati di molti calcoli restano nel browser, salvo l'uso volontario di funzioni IA o di esportazione che richiedano il server.</li>
              <li><strong>Analisi del caso con IA:</strong> titolo, descrizione, parti, parametri economici, testo estratto dai PDF, risultati e messaggi della chat.</li>
              <li><strong>Antiriciclaggio:</strong> i moduli ordinari restano nel browser. Solo scegliendo una funzione IA i documenti vengono trasmessi al server e al fornitore IA per l'elaborazione richiesta.</li>
              <li><strong>Segnalazioni tecniche:</strong> informazioni tecniche minimizzate su errori dell'interfaccia, prive intenzionalmente dei contenuti dei moduli.</li>
            </ul>
          </Section>

          <Section title="3. Finalità e basi giuridiche">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Erogazione del servizio richiesto:</strong> calcoli, analisi e generazione di documenti, ai sensi dell'art. 6, par. 1, lett. b GDPR o delle misure precontrattuali richieste dall'utente.</li>
              <li><strong>Sicurezza e continuità:</strong> prevenzione di abusi, diagnostica e difesa del servizio, sulla base del legittimo interesse ai sensi dell'art. 6, par. 1, lett. f GDPR.</li>
              <li><strong>Statistiche interne aggregate:</strong> conteggio delle pagine senza identificatori persistenti, sulla base del legittimo interesse.</li>
              <li><strong>Google Analytics:</strong> esclusivamente previo consenso, revocabile in ogni momento dal link “Preferenze cookie” nel footer.</li>
              <li><strong>Obblighi di legge:</strong> quando il trattamento è necessario ai sensi dell'art. 6, par. 1, lett. c GDPR.</li>
            </ul>
          </Section>

          <Section title="4. Servizi di intelligenza artificiale e dati di terzi">
            <p>Le funzioni IA non devono essere usate per decisioni automatiche vincolanti. Gli output sono bozze informative da verificare professionalmente e non sostituiscono il giudizio dell'avvocato, del mediatore o dell'organismo.</p>
            <p>I contenuti inviati alle funzioni IA sono trasmessi ad Anthropic Claude e, se tecnicamente configurato come fallback in un ambiente commerciale idoneo, a Google Gemini. I fornitori possono trattare dati fuori dallo Spazio economico europeo secondo i relativi accordi sul trattamento e meccanismi di trasferimento applicabili.</p>
            <p>Prima di inserire dati di clienti, controparti o altri interessati, il professionista deve disporre di un'idonea base giuridica, fornire l'informativa necessaria e applicare minimizzazione e pseudonimizzazione. Non inserire dati sanitari, biometrici, giudiziari o altre categorie particolari se non strettamente necessari e giuridicamente autorizzati.</p>
            <p>Per maggiori informazioni consulta le informative di <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">Anthropic</a> e <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">Google Gemini API</a>.</p>
          </Section>

          <Section title="5. Conservazione e cancellazione">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Analisi del caso:</strong> massimo 30 giorni sul database del sito. I contenuti delle nuove analisi sono protetti a livello applicativo con cifratura autenticata AES-256-GCM; l'utente può cancellarli prima dallo storico mediante il token segreto memorizzato nel proprio browser.</li>
              <li><strong>PDF caricati nell'Analisi del caso:</strong> usati in memoria per estrarre il testo e non archiviati come file; il testo estratto confluisce nell'analisi conservata fino a 30 giorni.</li>
              <li><strong>Documenti AML inviati all'IA:</strong> elaborati in memoria e non archiviati dal sito dopo la risposta. I tempi tecnici del fornitore dipendono dal servizio e dal piano contrattuale applicato.</li>
              <li><strong>Statistiche interne:</strong> il totale complessivo delle visualizzazioni è conservato nel database come numero aggregato; il dettaglio per pagina resta in memoria fino al riavvio del servizio. Nessuno dei due contiene IP, user-agent o identificatori del visitatore.</li>
              <li><strong>Browser dell'utente:</strong> token di accesso, storico tecnico minimizzato e modelli locali restano sul dispositivo finché l'utente non li elimina o cancella i dati del sito.</li>
            </ul>
          </Section>

          <Section title="6. Destinatari e misure di sicurezza">
            <p>I dati possono essere trattati dai fornitori necessari all'hosting, al database, alla diagnostica tecnica e alle API IA, nei limiti delle funzioni utilizzate. Non sono venduti né diffusi.</p>
            <p>Il sito usa HTTPS, cifratura applicativa autenticata AES-256-GCM per i contenuti delle nuove analisi conservate, token casuali memorizzati nel database soltanto in forma di hash SHA-256, risposte API non memorizzabili, cancellazione automatica, controlli di origine, limiti di frequenza e dimensione, validazione dei file e minimizzazione dei log. La chiave di cifratura è gestita separatamente dal database nell'ambiente protetto del servizio.</p>
            <p>Nessuna misura elimina ogni rischio: l'utente deve proteggere il proprio dispositivo e non condividere il token di accesso. La cifratura applicativa protegge il contenuto memorizzato, ma non impedisce il trattamento temporaneo necessario sul server e presso il fornitore IA durante l'elaborazione richiesta.</p>
          </Section>

          <Section title="7. Natura del conferimento e responsabilità professionale">
            <p>I dati necessari alla funzione richiesta devono essere conferiti per usarla; il mancato conferimento impedisce l'elaborazione. Quando un professionista inserisce dati di terzi per una propria pratica, opera secondo il ruolo privacy che gli compete e resta responsabile della liceità, necessità e correttezza dei dati immessi.</p>
          </Section>

          <Section title="8. Diritti degli interessati">
            <p>Nei casi previsti dagli artt. 15-22 GDPR, l'interessato può chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, nonché revocare il consenso senza pregiudicare la liceità del trattamento precedente. Le richieste possono essere presentate attraverso la pagina <Link href="/contatti"><span className="underline cursor-pointer text-primary">Contatti</span></Link>.</p>
            <p>È inoltre possibile proporre reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="underline text-primary">Garante per la protezione dei dati personali</a>.</p>
          </Section>

          <Section title="9. Cookie e aggiornamenti">
            <p>Per cookie, strumenti di misurazione e modalità di revoca consulta la <Link href="/cookie-policy"><span className="underline cursor-pointer text-primary">Cookie Policy</span></Link>. Gli aggiornamenti sostanziali dell'informativa saranno pubblicati su questa pagina con la nuova data.</p>
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
