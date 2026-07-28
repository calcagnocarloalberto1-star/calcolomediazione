import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Privacy Policy
          </h1>
        </div>

        <div className="bg-card border-[2px] border-foreground shadow-[4px_4px_0px_0px] shadow-foreground/20 p-6 sm:p-8 space-y-6">
          <p className="text-sm opacity-60">Ultimo aggiornamento: Marzo 2026</p>

          <Section title="1. Titolare del Trattamento">
            <p>Il titolare del trattamento dei dati personali è Carlo Alberto Calcagno, responsabile del sito web CalcoloMediazione.it (di seguito "il Sito").</p>
            <p>Per qualsiasi richiesta relativa al trattamento dei dati personali, è possibile contattare il Titolare tramite la pagina <Link href="/contatti"><span className="underline cursor-pointer" style={{ color: 'var(--primary)' }}>Contatti</span></Link>.</p>
          </Section>

          <Section title="2. Tipologia di Dati Raccolti">
            <p>Il Sito raccoglie le seguenti categorie di dati:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, orario di accesso. Questi dati vengono raccolti automaticamente durante la navigazione.</li>
              <li><strong>Dati forniti volontariamente:</strong> eventuali dati inseriti dall'utente nei form di contatto o nei calcolatori (valore della controversia, materia, descrizione del caso per l'analisi AI).</li>
              <li><strong>Dati di analisi AI:</strong> le descrizioni dei casi inserite per l'analisi AI vengono elaborate in tempo reale e non vengono conservate in modo permanente sul server dopo la chiusura della sessione.</li>
            </ul>
          </Section>

          <Section title="3. Finalità del Trattamento">
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Erogazione dei servizi di calcolo e analisi offerti dal Sito</li>
              <li>Miglioramento dell'esperienza di navigazione e dei servizi</li>
              <li>Risposta alle richieste di contatto</li>
              <li>Adempimento di obblighi di legge</li>
              <li>Analisi statistiche aggregate e anonimizzate sull'utilizzo del Sito</li>
            </ul>
          </Section>

          <Section title="4. Base Giuridica del Trattamento">
            <p>Il trattamento dei dati si fonda sulle seguenti basi giuridiche ai sensi dell'art. 6 del Regolamento UE 2016/679 (GDPR):</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Consenso:</strong> per l'utilizzo di cookie non tecnici e per l'invio di comunicazioni</li>
              <li><strong>Esecuzione di un contratto:</strong> per l'erogazione dei servizi richiesti dall'utente</li>
              <li><strong>Legittimo interesse:</strong> per l'analisi statistica e il miglioramento dei servizi</li>
              <li><strong>Obbligo legale:</strong> per gli adempimenti previsti dalla normativa vigente</li>
            </ul>
          </Section>

          <Section title="5. Conservazione dei Dati">
            <p>I dati personali vengono conservati per il tempo strettamente necessario al perseguimento delle finalità per cui sono stati raccolti, nel rispetto del principio di minimizzazione previsto dall'art. 5 del GDPR.</p>
            <p>In particolare:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>I dati di navigazione vengono conservati per un massimo di 12 mesi</li>
              <li>I dati dei calcoli non vengono conservati in modo permanente; le analisi AI eventualmente salvate vengono eliminate automaticamente entro 30 giorni</li>
              <li>I dati di contatto vengono conservati per il tempo necessario a evadere la richiesta</li>
            </ul>
          </Section>

          <Section title="6. Comunicazione e Diffusione dei Dati">
            <p>I dati personali non vengono venduti, ceduti o diffusi a terzi. Possono essere comunicati a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provider di servizi tecnologici (hosting, servizi cloud) necessari al funzionamento del Sito, nei limiti di quanto necessario per l'erogazione del servizio</li>
              <li>Provider di servizi di intelligenza artificiale per l'elaborazione delle analisi AI, in conformità alle rispettive policy sulla privacy</li>
              <li>Autorità competenti, ove richiesto dalla legge</li>
            </ul>
            <p className="mt-2"><strong>Compilazione automatica dei modelli antiriciclaggio — modalità «alta precisione (AI)».</strong> Su scelta esplicita dell'utente, l'immagine (o le pagine) del documento caricato nello strumento antiriciclaggio viene trasmessa all'API di un fornitore di intelligenza artificiale (Anthropic) al solo fine di estrarne automaticamente i dati per la compilazione dei modelli. In base ai termini commerciali e al Data Processing Agreement (DPA) conforme al GDPR, il fornitore non utilizza tali dati per addestrare i propri modelli e ne conserva i log tecnici per un massimo di 7 giorni; l'elaborazione avviene prevalentemente su infrastruttura statunitense, con le clausole contrattuali standard a copertura del trasferimento. Il sito non conserva il file caricato né i dati estratti. Il trattamento avviene sotto la responsabilità del professionista o dell'organismo che utilizza lo strumento, quale titolare, tenuto a verificare la sussistenza di un'idonea base giuridica e a informare l'interessato. La modalità predefinita di riconoscimento (OCR) opera invece interamente nel browser, senza trasmissione dei file. I dati estratti sono comunque sottoposti a controllo umano prima dell'inserimento.</p>
          </Section>

          <Section title="7. Diritti dell'Interessato">
            <p>Ai sensi degli artt. 15-22 del GDPR, l'utente ha diritto di:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Accesso:</strong> ottenere conferma dell'esistenza di dati personali che lo riguardano e la loro comunicazione in forma intelligibile</li>
              <li><strong>Rettifica:</strong> ottenere la correzione di dati inesatti o l'integrazione di dati incompleti</li>
              <li><strong>Cancellazione:</strong> ottenere la cancellazione dei propri dati personali ("diritto all'oblio")</li>
              <li><strong>Limitazione:</strong> ottenere la limitazione del trattamento in determinati casi</li>
              <li><strong>Portabilità:</strong> ricevere i propri dati in un formato strutturato e leggibile da dispositivo automatico</li>
              <li><strong>Opposizione:</strong> opporsi al trattamento dei propri dati personali</li>
            </ul>
            <p className="mt-2">Per esercitare tali diritti, è possibile contattare il Titolare tramite la pagina <Link href="/contatti"><span className="underline cursor-pointer" style={{ color: 'var(--primary)' }}>Contatti</span></Link>.</p>
            <p>L'utente ha inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--primary)' }}>www.garanteprivacy.it</a>).</p>
          </Section>

          <Section title="8. Cookie">
            <p>Per informazioni dettagliate sull'utilizzo dei cookie, si rinvia alla <Link href="/cookie-policy"><span className="underline cursor-pointer" style={{ color: 'var(--primary)' }}>Cookie Policy</span></Link>.</p>
          </Section>

          <Section title="9. Modifiche alla Privacy Policy">
            <p>Il Titolare si riserva il diritto di apportare modifiche alla presente Privacy Policy in qualunque momento, dandone informazione agli utenti su questa pagina. Si prega di consultare periodicamente questa pagina per verificare eventuali aggiornamenti.</p>
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
