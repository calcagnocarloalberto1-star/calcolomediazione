# Audit privacy e sicurezza di CalcoloMediazione.it

Data: 8 settembre 2026  
Ambito: repository `calcagnocarloalberto1-star/calcolomediazione` e verifica in sola lettura del sito pubblico.

## Sintesi

L'intervento ha corretto vulnerabilità applicative e discrepanze informative nei flussi che possono trattare dati di clienti, parti e documenti professionali. Le funzioni ordinarie dei calcolatori non sono state modificate.

La sicurezza assoluta non può essere garantita da una revisione puntuale. La conformità dipende anche dalla configurazione effettiva di hosting, database, backup, account dei fornitori IA, contratti, autorizzazioni interne e procedure organizzative.

## Rilievi principali e interventi

### Accesso e cancellazione delle analisi

- **Rischio corretto:** l'endpoint `DELETE /api/analisi/:id` consentiva la cancellazione senza verificare il token segreto.
- **Intervento:** la cancellazione richiede ora un token casuale di 64 caratteri e la query SQL verifica insieme ID e token.
- **Protezione aggiuntiva:** le risposte API sono marcate `no-store`; le richieste mutative provenienti da origini web esterne sono rifiutate.

### Dati conservati nel browser

- **Rischio ridotto:** lo storico locale conteneva titolo della pratica, valore e nominativi delle parti.
- **Intervento:** lo storico conserva soltanto ID, stato, data e token necessario a riaprire o cancellare la pratica. Titoli, importi e nomi non sono più duplicati nel browser.
- **Nota:** il token resta nel dispositivo fino alla cancellazione della pratica o dei dati del sito. Su postazioni condivise occorre eliminare lo storico al termine del lavoro.

### Flusso IA e documenti

- **Informativa immediata:** il modulo Analisi Caso AI mostra ora, prima dell'upload, destinatari, retention, minimizzazione e link alla Privacy Policy.
- **Conferma obbligatoria:** caricamento e avvio sono bloccati finché l'utente non conferma di avere titolo al trattamento e di aver minimizzato i dati.
- **Validazione server:** il server rifiuta l'avvio se la conferma non è presente.
- **Upload:** massimo 10 file, 8 MB ciascuno e 32 MB complessivi; vengono controllati MIME e firma binaria di PDF, JPEG, PNG, GIF e WebP.
- **Input:** descrizione, parti e testo dei documenti hanno limiti espliciti. Gli errori dei provider non vengono esposti al browser.
- **Google Gemini:** il fallback è disabilitato salvo configurazione esplicita `GEMINI_PAID_SERVICE_ACKNOWLEDGED=true`, da usare soltanto dopo aver verificato un servizio paid e condizioni contrattuali idonee. I termini Google distinguono il trattamento dei dati tra servizi gratuiti e servizi a pagamento: https://ai.google.dev/gemini-api/terms
- **Anthropic:** le informative sono state corrette per non promettere un periodo fisso di sette giorni non garantito in ogni configurazione. La retention effettiva va verificata sul piano e sull'accordo applicabile: https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-personal-data

### Cookie e statistiche

- **Google Analytics:** resta bloccato fino al consenso. La configurazione imposta consenso predefinito negato, disabilita segnali Google e personalizzazione pubblicitaria.
- **Revoca:** il footer e la Cookie Policy permettono di riaprire le preferenze. La revoca disabilita Analytics e tenta la rimozione dei cookie `_ga`.
- **Scelta equivalente:** il banner mantiene “Accetta tutti” e “Solo necessari”; la chiusura equivale a “Solo necessari”.
- **Durata:** scelta positiva 12 mesi, rifiuto 6 mesi.
- **Statistica interna:** non conserva più IP o user-agent. Il nuovo contatore conserva nel database soltanto il totale numerico aggregato; il dettaglio per pagina resta volatile in memoria.
- **Riferimento:** Linee guida del Garante sui cookie e altri strumenti di tracciamento: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876

### Logging e header

- **Error reporting:** query URL, email, codici fiscali e token vengono rimossi o oscurati prima dell'inoltro al sistema diagnostico. Lo user-agent completo è sostituito da una semplice indicazione desktop/mobile.
- **IP:** i rate limit usano `req.ip` con un solo proxy attendibile, anziché fidarsi direttamente di `X-Forwarded-For`.
- **Header:** aggiunti `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-Permitted-Cross-Domain-Policies`, `Origin-Agent-Cluster` e una CSP minima applicata. La CSP dettagliata resta in `Report-Only` per evitare di interrompere JSON-LD e script esistenti prima di un periodo di osservazione.

### Informative

- Privacy Policy e Cookie Policy sono state riscritte per rappresentare il trattamento reale.
- Il claim generico “Dati Crittografati” è stato sostituito con il più preciso “Connessione HTTPS”.
- I contenuti destinati ai crawler e gli avvisi AML sono stati riallineati.
- L'impostazione segue i principi di minimizzazione e protezione per impostazione predefinita richiamati dalle linee guida EDPB sull'art. 25 GDPR: https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en

## Verifiche eseguite

- TypeScript: superato.
- Test funzionali: tutti superati.
- Validazione database giurisprudenziale: 96 pronunce, nessun duplicato.
- Build di produzione Vite e server: completata.
- `git diff --check`: nessun errore di whitespace.
- Audit npm: eliminate le vulnerabilità applicative rilevate; resta una segnalazione bassa in `esbuild`, dipendenza dello strumento di sviluppo `tsx`, relativa al development server su Windows e non al bundle di produzione Linux.
- Rilascio pubblico: intervento pubblicato su `main` e deployment verificato sul dominio il 9 settembre 2026.
- Sito pubblico: HTTPS, TLS 1.3, redirect HTTP, policy aggiornate, preferenze cookie, conferma privacy server-side e header di sicurezza verificati; nessun mixed content o errore runtime osservato.

## Azioni operative successive al rilascio

1. Verificare e conservare DPA, SCC e condizioni del piano commerciale Anthropic.
2. Lasciare `GEMINI_PAID_SERVICE_ACKNOWLEDGED=false` finché non sia documentato un piano Gemini paid idoneo al trattamento previsto.
3. Verificare il DPA dell'hosting e del database, la regione effettiva, la cifratura a riposo e la retention dei backup.
4. Impostare `ADMIN_PASSWORD` robusta e `ADMIN_SECRET` persistente; limitare l'accesso alle variabili d'ambiente.
5. Verificare il destinatario e la retention di `ERROR_LOG_WEBHOOK_URL`; disabilitarlo se non coperto dal registro dei trattamenti e da adeguate autorizzazioni.
6. Eseguire una prova periodica della cancellazione entro 30 giorni, inclusi eventuali backup secondo la relativa policy.
7. Completare e approvare formalmente DPIA, registro dei trattamenti, procedura di data breach e istruzioni agli autorizzati.
8. Osservare i report CSP e, dopo aver eliminato o autorizzato con nonce/hash gli script JSON-LD inline, passare la policy dettagliata da `Report-Only` a blocco effettivo.

## Limiti della revisione

Non sono stati usati dati personali reali né inviati documenti ai provider IA. Non sono stati ispezionati dashboard, contratti o configurazioni private di Render, PostgreSQL, Anthropic, Google o Google Apps Script. Il documento è una revisione tecnica e informativa, non una certificazione di conformità né un parere legale definitivo.
