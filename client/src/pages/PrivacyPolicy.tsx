import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    const focusHashTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    };
    focusHashTarget();
    window.addEventListener("hashchange", focusHashTarget);
    return () => window.removeEventListener("hashchange", focusHashTarget);
  }, []);

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
          <p className="text-sm opacity-70">Ultimo aggiornamento: 11 settembre 2026</p>

          <Section title="1. Titolare del trattamento">
            <p>Il titolare del trattamento è Carlo Alberto Calcagno, gestore di CalcoloMediazione.it. Le richieste privacy possono essere inviate mediante i recapiti indicati nella pagina <Link href="/contatti"><span className="underline cursor-pointer text-primary">Contatti</span></Link>.</p>
          </Section>

          <Section title="2. Dati trattati e origine">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Navigazione tecnica:</strong> il server riceve i dati necessari alla connessione e alla sicurezza. Le statistiche interne non conservano indirizzi IP o user-agent: il totale complessivo delle visualizzazioni è memorizzato nel database come solo numero aggregato, mentre il dettaglio per pagina resta volatile in memoria.</li>
              <li><strong>Calcolatori locali:</strong> i dati di molti calcoli restano nel browser, salvo l'uso volontario di funzioni IA o di esportazione che richiedano il server.</li>
              <li><strong>Analisi del caso con IA:</strong> la creazione di nuove analisi, il caricamento PDF e la chat AI sono sospesi. Le analisi già create possono contenere titolo, descrizione, parti, parametri economici, testo estratto dai PDF, risultati e messaggi della chat fino alla cancellazione o alla scadenza.</li>
              <li><strong>Antiriciclaggio:</strong> i moduli ordinari restano nel browser. L'assistente IA sui documenti è sospeso sia nell'interfaccia sia negli endpoint server; nessun documento AML viene accettato o trasmesso da tale funzione.</li>
              <li><strong>Segnalazioni tecniche:</strong> informazioni tecniche minimizzate su errori dell'interfaccia, prive intenzionalmente dei contenuti dei moduli.</li>
            </ul>
          </Section>

          <Section title="3. Finalità e basi giuridiche">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Erogazione del servizio richiesto all'utente:</strong> i calcoli deterministici e le funzioni locali sono forniti ai sensi dell'art. 6, par. 1, lett. b GDPR o delle misure precontrattuali richieste dall'utente.</li>
              <li><strong>Dati personali dell'utente:</strong> quando l'utente inserisce propri dati per richiedere una funzione, il trattamento necessario all'erogazione si fonda sull'art. 6, par. 1, lett. b GDPR. L'eventuale consenso richiesto per Google Analytics è distinto, facoltativo e revocabile.</li>
              <li><strong>Dati di clienti, controparti e altri terzi:</strong> la base giuridica propria di CalcoloMediazione, il ruolo rispetto al professionista e l'eventuale informativa ex art. 14 GDPR non sono ancora stati formalmente definiti e approvati. Per questo le nuove Analisi AI sono sospese e non devono essere usate per pratiche reali.</li>
              <li><strong>Categorie particolari, dati giudiziari e minori:</strong> i flussi AI che potrebbero coinvolgere tali dati restano sospesi. Prima di qualsiasi riattivazione dovranno essere documentati, oltre alla base dell'art. 6, i presupposti degli artt. 9 o 10 GDPR e le misure specifiche per i minori.</li>
              <li><strong>Sicurezza e continuità:</strong> prevenzione di abusi, diagnostica e difesa del servizio, sulla base del legittimo interesse ai sensi dell'art. 6, par. 1, lett. f GDPR.</li>
              <li><strong>Statistiche interne aggregate:</strong> conteggio delle pagine senza identificatori persistenti, sulla base del legittimo interesse.</li>
              <li><strong>Google Analytics:</strong> esclusivamente previo consenso, revocabile in ogni momento dal link “Preferenze cookie” nel footer.</li>
              <li><strong>Obblighi di legge:</strong> quando il trattamento è necessario ai sensi dell'art. 6, par. 1, lett. c GDPR.</li>
            </ul>
          </Section>

          <Section id="servizi-ia" title="4. Servizi di intelligenza artificiale e dati di terzi">
            <p>Le funzioni IA non devono essere usate per decisioni automatiche vincolanti. Gli output sono bozze informative da verificare professionalmente e non sostituiscono il giudizio dell'avvocato, del mediatore o dell'organismo.</p>
            <p>La creazione di nuove Analisi AI, il caricamento dei PDF e la chat sul caso sono sospesi; il server rifiuta queste richieste prima di leggerne o decodificarne il corpo. Una futura riattivazione richiederà una doppia attestazione tecnica e il completamento delle verifiche giuridiche e contrattuali indicate in questa sezione.</p>
            <p>Quando il servizio sarà eventualmente riattivato, i contenuti potranno essere trasmessi ad Anthropic Claude. Google Gemini potrà intervenire soltanto come eventuale fallback e resterà disabilitato finché non verrà espressamente attestato nell'ambiente di produzione l'uso di un servizio a pagamento coperto dalle condizioni applicabili.</p>
            <p>Prima dell'invio, il sistema applica una pseudonimizzazione automatica best-effort dei principali identificativi diretti. Questa misura non equivale ad anonimizzazione: indirizzi, importi, relazioni e circostanze uniche possono permettere di identificare una persona. Il professionista deve quindi eliminare manualmente i dati non necessari, fornire agli interessati l'informativa dovuta e applicare la minimizzazione prima del caricamento.</p>
            <p>Per i servizi commerciali API, la documentazione contrattuale di Anthropic prevede un DPA e, quando necessarie, le clausole contrattuali standard. L'eventuale fallback Gemini potrà essere attivato soltanto con un progetto a pagamento, dopo l'archiviazione e la verifica del Google Cloud Data Processing Addendum e delle clausole contrattuali standard applicabili, oppure di un diverso valido meccanismo di trasferimento. L'applicabilità del DPA all'account Anthropic di produzione deve ancora essere provata e archiviata; non viene dichiarata una conservazione zero in assenza di uno specifico accordo.</p>
            <p>L'assistente AI della pagina Antiriciclaggio è sospeso: i relativi endpoint rifiutano i caricamenti. Sarà eventualmente riattivato soltanto dopo aver determinato e approvato i ruoli di professionista, Organismo e CalcoloMediazione. Se CalcoloMediazione sarà qualificata come responsabile, dovranno essere predisposti l'accordo e le istruzioni ex art. 28 GDPR e autorizzati i subresponsabili; per ogni diversa qualificazione dovranno essere documentati e attuati i relativi obblighi. In ogni caso dovranno essere verificati i presupposti applicabili ai dati trattati, inclusi quelli disciplinati dall'art. 10 GDPR.</p>
            <p>Consulta i <a href="https://www.anthropic.com/legal/commercial-terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">Commercial Terms Anthropic</a>, il <a href="https://www.anthropic.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" className="underline text-primary">DPA Anthropic</a>, i <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">termini Gemini API</a> e il <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer" className="underline text-primary">Google Cloud Data Processing Addendum</a>.</p>
          </Section>

          <Section title="5. Conservazione e cancellazione">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Analisi del caso:</strong> massimo 30 giorni sul database del sito. I contenuti delle nuove analisi sono protetti a livello applicativo con cifratura autenticata AES-256-GCM; l'utente può cancellarli prima dallo storico mediante il token segreto memorizzato nel proprio browser.</li>
              <li><strong>PDF caricati nell'Analisi del caso:</strong> usati in memoria per estrarre il testo e non archiviati come file; il testo estratto confluisce nell'analisi conservata fino a 30 giorni.</li>
              <li><strong>Documenti AML:</strong> non vengono accettati né inviati all'IA finché l'assistente resta sospeso. L'eventuale futura riattivazione richiederà un aggiornamento di questa informativa e dei presidi contrattuali.</li>
              <li><strong>Statistiche interne:</strong> il totale complessivo delle visualizzazioni è conservato nel database come numero aggregato; il dettaglio per pagina resta in memoria fino al riavvio del servizio. Nessuno dei due contiene IP, user-agent o identificatori del visitatore.</li>
              <li><strong>Browser dell'utente:</strong> token di accesso, storico tecnico minimizzato e modelli locali restano sul dispositivo finché l'utente non li elimina o cancella i dati del sito.</li>
            </ul>
          </Section>

          <Section title="6. Destinatari e misure di sicurezza">
            <p>I dati possono essere trattati dai fornitori necessari all'hosting, al database, alla diagnostica tecnica e alle API IA, nei limiti delle funzioni utilizzate. Non sono venduti né diffusi.</p>
            <p>Il sito usa HTTPS, cifratura applicativa autenticata AES-256-GCM per i contenuti delle nuove analisi conservate, risposte API non memorizzabili, cancellazione automatica, controlli di origine, limiti di frequenza e dimensione, validazione dei file e minimizzazione dei log. Per i token casuali di accesso, la colonna usata per la verifica contiene un hash SHA-256; una copia recuperabile del token è inclusa nel payload cifrato dell'analisi per consentire le procedure controllate di migrazione e ripristino. La chiave di cifratura è gestita separatamente dal database nell'ambiente protetto del servizio.</p>
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

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className="space-y-3 scroll-mt-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2 opacity-90">{children}</div>
    </section>
  );
}
