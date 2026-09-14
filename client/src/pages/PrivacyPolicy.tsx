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
          <p className="text-sm opacity-70">Ultimo aggiornamento: 14 settembre 2026</p>

          <Section title="1. Titolare del trattamento">
            <p>Il titolare del trattamento è Carlo Alberto Calcagno, gestore di CalcoloMediazione.it. Le richieste privacy possono essere inviate mediante i recapiti indicati nella pagina <Link href="/contatti"><span className="underline cursor-pointer text-primary">Contatti</span></Link>.</p>
          </Section>

          <Section title="2. Dati trattati e origine">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Navigazione tecnica:</strong> il server riceve i dati necessari alla connessione e alla sicurezza. Le statistiche interne non conservano indirizzi IP o user-agent: il totale complessivo delle visualizzazioni è memorizzato nel database come solo numero aggregato, mentre il dettaglio per pagina resta volatile in memoria.</li>
              <li><strong>Calcolatori locali:</strong> i dati di molti calcoli restano nel browser, salvo l'uso volontario di funzioni IA o di esportazione che richiedano il server.</li>
              <li><strong>Analisi del caso con IA:</strong> la creazione di nuove analisi, il caricamento PDF e la chat AI sono attivi dal 14 settembre 2026, previa dichiarazione obbligatoria sull'eventuale presenza di dati di persone minorenni (v. sezione 4). Le analisi possono contenere titolo, descrizione, parti, parametri economici, testo estratto dai PDF, risultati e messaggi della chat fino alla cancellazione o alla scadenza.</li>
              <li><strong>Antiriciclaggio:</strong> i moduli ordinari restano nel browser. L'assistente IA facoltativo per la bozza automatica dai documenti del fascicolo è attivo dal 14 settembre 2026: i documenti vengono trasmessi al fornitore IA solo se l'utente sceglie di usare questa funzione (v. sezione 4).</li>
              <li><strong>Segnalazioni tecniche:</strong> informazioni tecniche minimizzate su errori dell'interfaccia, prive intenzionalmente dei contenuti dei moduli.</li>
            </ul>
          </Section>

          <Section title="3. Finalità e basi giuridiche">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Erogazione del servizio richiesto all'utente:</strong> i calcoli deterministici e le funzioni locali sono forniti ai sensi dell'art. 6, par. 1, lett. b GDPR o delle misure precontrattuali richieste dall'utente.</li>
              <li><strong>Dati personali dell'utente:</strong> quando l'utente inserisce propri dati per richiedere una funzione, il trattamento necessario all'erogazione si fonda sull'art. 6, par. 1, lett. b GDPR. L'eventuale consenso richiesto per Google Analytics è distinto, facoltativo e revocabile.</li>
              <li><strong>Dati di clienti, controparti e altri terzi:</strong> quando l'utente professionista inserisce, nei testi o nei documenti caricati per le funzioni IA, dati riferibili a clienti, controparti o altri terzi, il trattamento si fonda sul legittimo interesse di CalcoloMediazione e del professionista alla prestazione del servizio richiesto (art. 6, par. 1, lett. f GDPR), bilanciato con i diritti dei terzi interessati. Il professionista resta responsabile di minimizzare i dati non necessari prima del caricamento e di fornire ai terzi l'informativa dovuta ex art. 14 GDPR, salvo una specifica eccezione applicabile e documentata.</li>
              <li><strong>Categorie particolari, dati giudiziari e minori:</strong> per l'Analisi AI del Caso, l'utente deve dichiarare prima di ogni analisi se la pratica riguarda persone minorenni; in caso affermativo o di incertezza l'analisi resta bloccata finché non sarà definito un percorso a presidi rafforzati. Per l'assistente IA dell'antiriciclaggio, i documenti caricati possono eccezionalmente contenere dati relativi a categorie particolari o a condanne e reati (es. dichiarazioni su carichi pendenti, PEP): il presupposto specifico ex artt. 9 o 10 GDPR non è ancora definito ed è stato accettato dal titolare come rischio residuo documentato, in attesa di essere completato.</li>
              <li><strong>Sicurezza e continuità:</strong> prevenzione di abusi, diagnostica e difesa del servizio, sulla base del legittimo interesse ai sensi dell'art. 6, par. 1, lett. f GDPR.</li>
              <li><strong>Statistiche interne aggregate:</strong> conteggio delle pagine senza identificatori persistenti, sulla base del legittimo interesse.</li>
              <li><strong>Google Analytics:</strong> esclusivamente previo consenso, revocabile in ogni momento dal link “Preferenze cookie” nel footer.</li>
              <li><strong>Obblighi di legge:</strong> quando il trattamento è necessario ai sensi dell'art. 6, par. 1, lett. c GDPR.</li>
            </ul>
          </Section>

          <Section id="servizi-ia" title="4. Servizi di intelligenza artificiale e dati di terzi">
            <p>Le funzioni IA non devono essere usate per decisioni automatiche vincolanti. Gli output sono bozze informative da verificare professionalmente e non sostituiscono il giudizio dell'avvocato, del mediatore o dell'organismo.</p>
            <p>La creazione di nuove Analisi AI, il caricamento dei PDF e la chat sul caso sono attivi dal 14 settembre 2026, dietro una doppia attestazione tecnica lato server: le funzioni si disattivano automaticamente se anche una sola delle due condizioni viene rimossa. Il titolare ha approvato l'attivazione accettando come rischio residuo documentato alcuni prerequisiti organizzativi e contrattuali ancora aperti — in particolare la sottoscrizione dell'accordo ex art. 28 GDPR con CalcoloMediazione e la verifica formale del DPA con il fornitore IA per l'account di produzione — indicati in dettaglio nella documentazione interna del titolare (registro dei trattamenti e valutazione d'impatto).</p>
            <p>Per il flusso rivolto ai professionisti, il modello scelto è quello in cui il professionista o l'Organismo di mediazione determina finalità e mezzi essenziali della pratica e opera come titolare del trattamento per i dati che vi inserisce, mentre CalcoloMediazione tratta tali dati per suo conto quale responsabile ai sensi dell'art. 28 GDPR. Questo modello è stato scelto in via di indirizzo dal titolare ma non è ancora reso operativo da un accordo sottoscritto: fino alla sottoscrizione resta un elemento di rischio residuo accettato, non un trattamento con base contrattuale già definita.</p>
            <p>I contenuti delle funzioni attive vengono trasmessi ad Anthropic Claude. Google Gemini può intervenire soltanto come eventuale fallback e resta disabilitato finché non verrà espressamente attestato nell'ambiente di produzione l'uso di un servizio a pagamento coperto dalle condizioni applicabili.</p>
            <p>Prima dell'invio, il sistema applica una pseudonimizzazione automatica best-effort dei principali identificativi diretti. Questa misura non equivale ad anonimizzazione: indirizzi, importi, relazioni e circostanze uniche possono permettere di identificare una persona. Il professionista deve quindi eliminare manualmente i dati non necessari, fornire agli interessati l'informativa dovuta e applicare la minimizzazione prima del caricamento.</p>
            <p>Il trasferimento dei dati verso Anthropic (Stati Uniti) si basa sulle clausole contrattuali standard (SCC) incorporate nel DPA dei Commercial Terms del servizio; l'applicabilità di tale DPA all'account Anthropic effettivamente usato in produzione deve ancora essere verificata e archiviata dal titolare — è uno dei punti accettati come rischio residuo documentato indicati sopra. Non viene dichiarata una conservazione zero in assenza di uno specifico accordo verificato. Google Gemini resta disabilitato e non riceve alcun dato finché non sarà eventualmente attivato un progetto a pagamento coperto da un Cloud Data Processing Addendum, dalle relative clausole contrattuali standard o da un diverso valido meccanismo di trasferimento, archiviati e verificati.</p>
            <p>L'assistente AI facoltativo della pagina Antiriciclaggio, che genera una prima bozza di compilazione a partire dai documenti caricati dall'utente, è attivo dal 14 settembre 2026 come funzione di scelta dell'utente professionale: la compilazione manuale locale, che non trasmette alcun documento, resta sempre disponibile in alternativa. Il modello di ruoli descritto sopra (professionista/Organismo titolare, CalcoloMediazione responsabile ex art. 28) si applica anche a questo flusso, con lo stesso accordo ancora da sottoscrivere. Il presupposto specifico per eventuali dati ex art. 10 GDPR presenti nei documenti caricati (v. sezione 3) non è ancora definito ed è stato accettato dal titolare come rischio residuo documentato, in attesa di essere completato.</p>
            <p>Consulta i <a href="https://www.anthropic.com/legal/commercial-terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">Commercial Terms Anthropic</a>, il <a href="https://www.anthropic.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer" className="underline text-primary">DPA Anthropic</a>, i <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">termini Gemini API</a> e il <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer" className="underline text-primary">Google Cloud Data Processing Addendum</a>.</p>
          </Section>

          <Section title="5. Conservazione e cancellazione">
            <ul className="list-disc space-y-2 ml-5">
              <li><strong>Analisi del caso:</strong> massimo 30 giorni sul database del sito. I contenuti delle nuove analisi sono protetti a livello applicativo con cifratura autenticata AES-256-GCM; l'utente può cancellarli prima dallo storico mediante il token segreto memorizzato nel proprio browser.</li>
              <li><strong>PDF caricati nell'Analisi del caso:</strong> usati in memoria per estrarre il testo e non archiviati come file; il testo estratto confluisce nell'analisi conservata fino a 30 giorni.</li>
              <li><strong>Documenti AML:</strong> i documenti caricati per l'assistente IA facoltativo sono elaborati in memoria per l'estrazione dei dati richiesti e non sono archiviati come file dopo la risposta; l'eventuale conservazione tecnica lato fornitore IA segue il piano e i termini a esso applicabili.</li>
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
