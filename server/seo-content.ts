// Static HTML content for SEO pre-rendering
// This content is injected into <div id="root"> server-side
// React hydrates over it when JS loads in the browser

export const SEO_CONTENT: Record<string, string> = {
  "/": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">CalcoloMediazione - Strumenti per Mediazione e Negoziazione</h1>
<p>Piattaforma professionale gratuita per la mediazione civile ai sensi del <strong>D.M. 150/2023</strong>: confronto economico, calcolatore indennita e generatori di documenti. Le nuove analisi AI sono temporaneamente sospese.</p>
<h2>Strumenti disponibili</h2>
<ul>
<li><a href="/calcolatore">Calcolatore Indennita Mediazione D.M. 150/2023</a> - Calcola spese di avvio, indennita, compensi avvocato, costi notarili con esenzione prima casa</li>
<li><a href="/analisi-caso-ai">Analisi AI del Caso di Mediazione</a> - nuove analisi e caricamento documenti temporaneamente sospesi; le analisi gia create restano consultabili</li>
<li><a href="/confronto-costi">Confronto Costi Mediazione vs Processo</a> - Primo grado, appello e cassazione con stima CTU e parametri forensi D.M. 55/2014</li>
<li><a href="/costi-notarili">Costi Notarili</a> - Stima dei puri costi notarili: onorario, IVA, cassa, visure, imposte di registro/ipotecaria/catastale</li>
<li><a href="/generatore-procura">Generatore Procura Speciale per Mediazione</a> - Conforme al D.Lgs. 28/2010</li>
<li><a href="/giurisprudenza">Database Giurisprudenza Mediazione</a> - Sentenze di Cassazione, Tribunali e Corti d'Appello</li>
<li><a href="/credito-imposta">Credito d'Imposta e Gratuito Patrocinio</a> - Art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023</li>
<li><a href="/strategie-negoziazione">Strategie di Negoziazione</a> - MAAN/BATNA, negoziazione integrativa, ZOPA, ancoraggio</li>
<li><a href="/antiriciclaggio">Antiriciclaggio in Mediazione</a> - strumento locale per compilare manualmente i modelli; ruoli e obblighi vanno verificati nel caso concreto e l'assistente AI e sospeso</li>
<li><a href="/antiriciclaggio-guida">Antiriciclaggio - Guida agli obblighi e alla compilazione</a> - Chi e' obbligato, adeguata verifica, fascicolo, operazioni sospette, e come si compila lo strumento</li>
<li><a href="/calcolo-assegni">Calcolo Assegni</a> - Stima orientativa dell'assegno di mantenimento del coniuge, dell'assegno divorzile e del contributo per i figli</li>
</ul>
<h2>Caratteristiche principali</h2>
<ul>
<li>Conforme al D.M. 150/2023 - Tariffe mediazione civile e commerciale</li>
<li>Confronto costi su tre gradi di giudizio: primo grado, appello e cassazione</li>
<li>Stima CTU in appello (art. 356 c.p.c.)</li>
<li>Esenzione prima casa per costi notarili</li>
<li>Verifica congruita valore catastale (art. 29 D.M. 150/2023)</li>
<li>Credito d'imposta fino a 1.118 euro per procedura</li>
<li>Gratuito patrocinio in mediazione (artt. 15-bis/15-undecies D.Lgs. 28/2010)</li>
<li>100% gratuito per avvocati e mediatori</li>
</ul>
<h2>Guide e Risorse</h2>
<ul>
<li><a href="/faq">Domande Frequenti sulla Mediazione Civile</a></li>
<li><a href="/guida-dm-150">Guida Completa al D.M. 150/2023</a></li>
<li><a href="/glossario">Glossario della Mediazione Civile</a></li>
<li><a href="/chi-siamo">Chi Siamo</a></li>
<li><a href="/privacy-policy">Privacy Policy</a></li>
</ul>
<p>CalcoloMediazione e una piattaforma professionale per il calcolo delle indennita di mediazione civile e commerciale. Conforme al Decreto Ministeriale 150/2023 e al D.Lgs. 28/2010 come modificato dalla Riforma Cartabia (D.Lgs. 149/2022).</p>
</div>`,

  "/calcolatore": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Calcolatore Indennita Mediazione D.M. 150/2023</h1>
<p>Calcola le indennita di mediazione civile e commerciale secondo le tariffe del <strong>D.M. 150/2023</strong>. Include spese di avvio, indennita per il primo incontro, ulteriori spese di mediazione, riduzione per mediazione obbligatoria, maggiorazioni per accordo, compensi avvocato, costi notarili con esenzione prima casa e verifica congruita valore catastale.</p>
<h2>Come funziona il calcolo</h2>
<p>Il calcolatore determina automaticamente le spese di mediazione in base al valore della controversia, applicando le tariffe della Tabella A allegata al D.M. 150/2023. Prevede la doppia tariffa (tariffe nazionali e tariffe COA Genova), le esenzioni per mediazione obbligatoria e demandata (riduzione 1/5), le maggiorazioni per accordo al primo incontro (+10%) o successivo (+25%), e le maggiorazioni art. 31 per mediatore esperto e procedura complessa.</p>
<h2>Parametri del calcolo</h2>
<ul>
<li>Spese di avvio: 40 euro (fino a 1.000), 75 euro (1.001-50.000), 110 euro (oltre 50.000)</li>
<li>Spese primo incontro: 60, 120 o 170 euro in base al valore</li>
<li>Ulteriori spese: Tabella A D.M. 150/2023</li>
<li>Compensi avvocato: parametri forensi D.M. 55/2014 aggiornato D.M. 147/2022</li>
<li>Verifica congruita catastale: art. 29 D.M. 150/2023</li>
</ul>
</div>`,

  "/analisi-caso-ai": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Analisi AI del Caso di Mediazione</h1>
<p>La creazione di nuove analisi, il caricamento dei documenti e la chat con intelligenza artificiale sono temporaneamente sospesi durante il completamento delle verifiche privacy e contrattuali. Le analisi già create restano consultabili, esportabili e cancellabili con il relativo token.</p>
<h2>Sezioni dell'analisi</h2>
<ul>
<li><strong>Estrazione Entita (NER)</strong> - Parti coinvolte, riferimenti normativi, fatti chiave, documenti citati, questioni giuridiche</li>
<li><strong>Analisi Giuridica</strong> - Quadro normativo applicabile, precedenti giurisprudenziali, rischi processuali, raccomandazioni</li>
<li><strong>Guida Strategica</strong> - Tecniche di mediazione, fasi del procedimento, suggerimenti per il mediatore</li>
<li><strong>Analisi MAAN/BATNA</strong> - Migliore Alternativa All'Accordo Negoziato per ciascuna parte, Zona di Possibile Accordo (ZOPA)</li>
<li><strong>Compatibilita Interessi</strong> - Matrice degli interessi (economici, relazionali, temporali, reputazionali), interessi convergenti e divergenti</li>
<li><strong>Controllo Bias Cognitivi</strong> - Ancoraggio, avversione alla perdita, framing, overconfidence, sunk cost e strategie di mitigazione</li>
<li><strong>Bozza Accordo</strong> - Testo completo dell'accordo di mediazione ai sensi dell'art. 11 D.Lgs. 28/2010</li>
<li><strong>Analisi Economica</strong> - Confronto costi mediazione positiva vs causa civile su tre gradi (primo grado, appello, cassazione)</li>
</ul>
<p>Quando il servizio era attivo, l'analisi poteva includere la verifica di congruita del valore catastale per le materie immobiliari e il calcolo del credito d'imposta disponibile. La creazione di nuove analisi resta sospesa.</p>
</div>`,

  "/confronto-costi": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Confronto Costi Mediazione vs Processo Civile</h1>
<p>Confronta i costi della mediazione civile con quelli del processo ordinario su <strong>tre gradi di giudizio</strong>: primo grado, appello e cassazione. Include contributo unificato, compensi avvocato (parametri forensi D.M. 55/2014 aggiornato D.M. 147/2022), stima CTU, imposta di registro, costi notarili e credito d'imposta.</p>
<h2>Voci di costo confrontate</h2>
<ul>
<li><strong>Mediazione</strong>: spese avvio, indennita organismo, compenso avvocato (Tab. 25-bis D.M. 55/2014), costi notarili, esenzione imposta di registro fino a 100.000 euro</li>
<li><strong>Primo Grado</strong>: contributo unificato (D.P.R. 115/2002), marca da bollo, compenso avvocato (Tab. 2), stima CTU, imposta di registro sentenza (3%)</li>
<li><strong>Appello</strong>: CU maggiorato del 50%, compenso avvocato (Tab. 12), eventuale CTU (art. 356 c.p.c.)</li>
<li><strong>Cassazione</strong>: CU raddoppiato, compenso avvocato (Tab. 13), no CTU (giudizio di legittimita)</li>
</ul>
<p>I compensi avvocato sono calcolati sui valori medi del D.M. 55/2014. Il compenso effettivo puo variare dal -50% al +100% in base alla complessita della causa (art. 4 D.M. 55/2014).</p>
</div>`,

  "/faq": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">FAQ Mediazione Civile - Domande Frequenti</h1>
<h2>Mediazione Civile - Domande Generali</h2>
<p><strong>Cos'e la mediazione civile?</strong> La mediazione civile e commerciale e un procedimento stragiudiziale di risoluzione delle controversie, disciplinato dal D.Lgs. 28/2010, in cui un terzo imparziale (il mediatore) assiste le parti nel trovare un accordo amichevole.</p>
<p><strong>Quando e obbligatoria la mediazione?</strong> La mediazione e obbligatoria per le materie elencate dall'art. 5, comma 1, del D.Lgs. 28/2010: condominio, diritti reali, divisione, successioni, patti di famiglia, locazione, comodato, affitto di aziende, responsabilita medica, diffamazione, contratti assicurativi, bancari e finanziari, e altre.</p>
<p><strong>Quanto dura un procedimento di mediazione?</strong> Con il D.Lgs. 216/2024 la durata massima e di 6 mesi dal deposito della domanda, prorogabile con accordo delle parti.</p>
<h2>Costi Notarili e Spese per Questioni da Trascrivere</h2>
<p><strong>Quando serve il notaio?</strong> L'intervento del notaio e necessario quando l'accordo riguarda atti soggetti a trascrizione (art. 2643 c.c.): trasferimenti immobiliari, servitu, usucapione, divisioni.</p>
<p><strong>L'accordo gode di esenzioni fiscali?</strong> Si, ai sensi dell'art. 17 D.Lgs. 28/2010: esenzione imposta di registro fino a 100.000 euro, esenzione imposte ipotecarie e catastali (Risposta AdE n. 235/2020).</p>
<h2>Credito d'Imposta in Mediazione</h2>
<p>Il credito d'imposta per la mediazione (art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023) prevede fino a 600 euro per indennita organismo e fino a 600 euro per compenso avvocato, cumulabili tra loro fino a un tetto di 600 euro per procedura, piu fino a 518 euro per contributo unificato (solo mediazione demandata con accordo): totale massimo 1.118 euro per procedura. Scadenza domanda: 31 marzo dell'anno successivo.</p>
</div>`,

  "/credito-imposta": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Credito d'Imposta e Gratuito Patrocinio in Mediazione</h1>
<p>Guida completa al credito d'imposta per la mediazione civile (art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023) e al gratuito patrocinio (artt. 15-bis/15-undecies D.Lgs. 28/2010).</p>
<h2>Credito d'Imposta</h2>
<p>Importi massimi: fino a 600 euro per indennita organismo (300 senza accordo) e fino a 600 euro per compenso avvocato (solo mediazione obbligatoria/demandata), ma i due crediti sono cumulabili solo fino a un tetto di 600 euro per procedura; a questo si aggiunge fino a 518 euro per contributo unificato (solo mediazione demandata con accordo), per un totale massimo di 1.118 euro per procedura. Tetto annuale: 2.400 euro persone fisiche, 24.000 euro persone giuridiche.</p>
<h2>Gratuito Patrocinio</h2>
<p>Il patrocinio a spese dello Stato in mediazione (Riforma Cartabia) consente alle persone in condizioni economiche disagiate di accedere alla mediazione obbligatoria senza sostenere costi per indennita organismo e compenso avvocato.</p>
</div>`,

  "/generatore-procura": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Generatore Procura Speciale per Mediazione</h1>
<p>Genera automaticamente la procura speciale per la mediazione civile con tutti i poteri necessari. Conforme al D.Lgs. 28/2010 e alle disposizioni della Riforma Cartabia.</p>
<p>La procura include: poteri di partecipazione al procedimento di mediazione, potere di conciliare e transigere, potere di sottoscrivere il verbale e l'eventuale accordo, clausola di accettazione da parte dell'avvocato.</p>
</div>`,

  "/giurisprudenza": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Giurisprudenza Mediazione - Database Sentenze</h1>
<p>Database di giurisprudenza sulla mediazione civile e commerciale. Sentenze della Corte di Cassazione, dei Tribunali e delle Corti d'Appello con ricerca avanzata per materia, anno e organo giudicante.</p>
<p>Include pronunce su: condizione di procedibilita, effettivita del tentativo di mediazione, mancata partecipazione, clausole vessatorie, mediazione delegata, competenza territoriale dell'organismo.</p>
</div>`,

  "/strategie-negoziazione": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Strategie di Negoziazione per la Mediazione Civile</h1>
<p>Guida alle principali strategie e tecniche di negoziazione nella mediazione civile: MAAN/BATNA, negoziazione integrativa, Zone of Possible Agreement (ZOPA), ancoraggio e tecniche di comunicazione.</p>
</div>`,

  "/mediazione-obbligatoria-quanto-costa": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Mediazione Obbligatoria: Quanto Costa Davvero nel 2026 (Guida con Esempi)</h1>
<p>Quanto costa la mediazione civile obbligatoria? Tabella ufficiale D.M. 150/2023, riduzione del 20% per la mediazione obbligatoria e demandata, esempi di calcolo reali e confronto con le spese di un giudizio ordinario.</p>
</div>`,

  "/mediazione-condominiale-delibera-assembleare": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Mediazione Condominiale: Quando è Obbligatoria e Come Funziona la Delibera Assembleare</h1>
<p>Mediazione condominio e delibera assembleare dopo la Riforma Cartabia: quando è obbligatoria, cosa puo fare l'amministratore senza delibera (art. 5-ter D.Lgs. 28/2010) e quando serve invece l'assemblea.</p>
</div>`,

  "/procura-sostanziale-mediazione": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Procura Sostanziale per la Mediazione: Guida Aggiornata 2026 (Cass. 9608 e 10978)</h1>
<p>Procura sostanziale mediazione e procura speciale art. 8 D.Lgs. 28/2010: chi puo rappresentare la parte, forma richiesta e la recente evoluzione della Cassazione (Cass. 9608/2026 e 10978/2026).</p>
</div>`,

  "/mediazione-vs-causa-civile": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Mediazione vs Causa Civile: la Vera Differenza di Costi e Tempi</h1>
<p>Mediazione o causa civile conviene? Confronto reale dei costi tra processo civile e mediazione: contributo unificato, compensi avvocato D.M. 55/2014, CTU, con un esempio di calcolo aggiornato.</p>
</div>`,

  "/credito-imposta-mediazione-domanda": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Credito d'Imposta Mediazione: Come Richiederlo e Quanto Vale (Guida)</h1>
<p>Guida pratica al credito d'imposta per la mediazione civile: importi (fino a &euro;1.118 per procedura), requisiti, scadenza del 31 marzo e procedura di domanda su lsg.giustizia.it.</p>
</div>`,

  "/gratuito-patrocinio-mediazione": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Gratuito Patrocinio in Mediazione: Requisiti e Procedura (Guida)</h1>
<p>Gratuito patrocinio mediazione: chi puo richiederlo, requisiti di reddito, come presentare l'istanza al COA e cosa succede se l'accordo non si raggiunge. Guida aggiornata artt. 15-bis/15-undecies D.Lgs. 28/2010.</p>
</div>`,

  "/maan-zopa-mediazione": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">MAAN e ZOPA in Mediazione: Come Chiudere l'Accordo con i Numeri</h1>
<p>MAAN e ZOPA applicate a un caso reale di mediazione: come calcolare la propria alternativa economica al giudizio e individuare la zona di possibile accordo per chiudere la trattativa.</p>
</div>`,

  "/assegno-mantenimento-divorzile-calcolo": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Assegno di Mantenimento e Assegno Divorzile: Come si Calcolano (Guida)</h1>
<p>Assegno di mantenimento e assegno divorzile dopo Cass. SU 18287/2018: quali criteri considera il giudice, cosa cambia tra separazione e divorzio, e come funziona il mantenimento dei figli ex art. 337-ter c.c.</p>
</div>`,

  "/glossario": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Glossario della Mediazione Civile</h1>
<p>Glossario completo dei termini utilizzati nella mediazione civile e commerciale. Definizioni chiare e riferimenti normativi per avvocati, mediatori e parti.</p>
</div>`,

  "/guida-dm-150": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Guida Completa al D.M. 150/2023 - Tariffe Mediazione</h1>
<p>Guida dettagliata al Decreto Ministeriale 150/2023 sulle tariffe di mediazione civile e commerciale. Tabelle, calcoli ed esempi pratici. Include Tabella A con scaglioni di valore, spese di avvio, indennita per il primo incontro, ulteriori spese, riduzioni e maggiorazioni.</p>
</div>`,

  "/antiriciclaggio": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Antiriciclaggio in Mediazione</h1>
<p>Strumento locale per la compilazione manuale dei modelli antiriciclaggio. Ruoli e obblighi devono essere verificati nel caso concreto; l'assistente AI e il caricamento dei documenti sono temporaneamente sospesi.</p>
<h2>Chi e' obbligato</h2>
<p>La qualifica del soggetto obbligato e la ripartizione dei compiti dipendono dall'inquadramento normativo, dall'incarico concreto e dalle procedure interne. La guida e lo strumento non assegnano automaticamente ruoli o responsabilita.</p>
<h2>I sei obblighi principali</h2>
<ul>
<li>Adeguata verifica della clientela (artt. 17-19)</li>
<li>Individuazione del titolare effettivo (artt. 18, 20, 22)</li>
<li>Conservazione del fascicolo riservato per 10 anni (artt. 31-32)</li>
<li>Segnalazione di operazioni sospette alla UIF (artt. 35-41)</li>
<li>Autovalutazione e scheda di rischio per ogni pratica (art. 15)</li>
<li>Formazione e presidi interni</li>
</ul>
<h2>Compilazione manuale dei modelli</h2>
<p>Lo strumento locale riporta nei modelli i dati inseriti manualmente nel browser. La lettura assistita dei documenti e sospesa e i relativi endpoint rifiutano i caricamenti.</p>
</div>`,

  "/trasferimento-immobiliare-mediazione": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Trasferimento immobiliare in mediazione: quanto si risparmia su notaio e imposte</h1>
<p>Trasferimento immobiliare in mediazione: imposta di registro esente fino a €100.000, quando serve il notaio, quanto si risparmia sulla prima casa rispetto alla compravendita ordinaria. Guida con esempi di calcolo.</p>
</div>`,

  "/costi-notarili": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Costi Notarili: Stima e Confronto Mediazione vs Sentenza</h1>
<p>Stima dei costi notarili e fiscali per il trasferimento immobiliare, con confronto tra accordo di mediazione e sentenza del giudice. Include imposta di registro, imposta ipotecaria e catastale, IVA, onorario notarile, cassa nazionale del notariato e verifica dell'esenzione fiscale prevista dall'art. 17 D.Lgs. 28/2010.</p>
<h2>Calcolo costi notarili: cosa include la stima</h2>
<p>Il calcolatore copre tutte le voci che concorrono al costo finale di un atto di trasferimento immobiliare: onorario notarile (parametrato al valore dell'immobile), cassa nazionale del notariato al 4%, IVA al 22%, visure ipocatastali e camerali, oltre alle imposte di registro, ipotecaria e catastale.</p>
<h2>Esenzione fiscale dell'accordo di mediazione (art. 17 D.Lgs. 28/2010)</h2>
<p>Gli accordi conciliativi raggiunti in mediazione godono dell'esenzione dell'imposta di registro entro la soglia di 100.000 euro. Oltre questa soglia, l'imposta si applica sulla sola parte eccedente. Questa agevolazione, prevista anche dalla Riforma Cartabia (D.Lgs. 149/2022), non opera nella sentenza del giudice.</p>
<h2>Prima casa: agevolazioni fiscali e imposta di registro ridotta</h2>
<p>L'agevolazione prima casa riduce l'imposta di registro dal 9% al 2% sulla base imponibile catastale (rendita rivalutata per il coefficiente 115,5), cumulabile con l'esenzione art. 17, applicandosi in via residuale sulla parte eccedente.</p>
<h2>Confronto pratico: accordo di mediazione vs sentenza</h2>
<p>Il calcolatore evidenzia in chiaro la differenza economica tra i due scenari su un'identica base immobiliare, includendo onorari notarili, imposte e differenze fiscali.</p>
</div>`,

  "/chi-siamo": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Chi Siamo</h1>
<p>CalcoloMediazione.it e una piattaforma professionale gratuita dedicata alla mediazione civile e commerciale, conforme al D.M. 150/2023 e alla Riforma Cartabia (D.Lgs. 149/2022). Il progetto nasce dall'esperienza diretta nel campo della mediazione e della risoluzione alternativa delle controversie (ADR), con l'obiettivo di fornire a mediatori, avvocati e cittadini strumenti precisi, aggiornati e accessibili. Il sito offre una banca dati giurisprudenziale curata, generatori di documenti, una guida ai costi notarili, il calcolo del credito d'imposta e strategie di negoziazione. La funzione di analisi dei casi con intelligenza artificiale e temporaneamente sospesa durante il completamento delle verifiche privacy e contrattuali.</p>
<h2>Gli strumenti del sito</h2>
<ul>
<li><a href="/calcolatore">Calcolatore Indennita</a> - calcolo delle indennita di mediazione secondo il D.M. 150/2023 e le tariffe COA Genova</li>
<li><a href="/analisi-caso-ai">Analisi AI del Caso</a> - nuove analisi e caricamento documenti temporaneamente sospesi; le analisi gia create restano consultabili</li>
<li><a href="/confronto-costi">Confronto Costi</a> - comparazione tra mediazione e processo civile su tre gradi di giudizio</li>
<li><a href="/costi-notarili">Costi Notarili</a> - calcolo dei costi notarili per l'accordo di mediazione</li>
<li><a href="/credito-imposta">Credito d'Imposta</a> - stima del credito d'imposta ex art. 20 D.Lgs. 28/2010</li>
<li><a href="/generatore-procura">Generatore Procura</a> - procura speciale sostanziale per la mediazione, conforme alla giurisprudenza di Cassazione</li>
<li><a href="/giurisprudenza">Banca Dati Giurisprudenza</a> - raccolta di pronunce di Cassazione e di merito sulla mediazione</li>
<li><a href="/strategie-negoziazione">Strategie di Negoziazione</a> - tecniche di negoziazione integrativa e MAAN/BATNA</li>
<li><a href="/glossario">Glossario</a> e <a href="/faq">FAQ</a> - guida ai termini tecnici e alle domande piu frequenti sulla mediazione</li>
</ul>
<h2>L'autore</h2>
<p>Carlo Alberto Calcagno e avvocato del Foro di Genova e mediatore civile e commerciale, iscritto come mediatore familiare e civile presso organismi accreditati di Genova, con attivita di formatore nei percorsi di abilitazione e aggiornamento professionale dei mediatori. Membro della Commissione ADR del Consiglio dell'Ordine degli Avvocati di Genova, la sua attivita si concentra sulla mediazione familiare (separazioni, divorzi, conflitti genitoriali) e sulla mediazione civile e commerciale (condominio, diritti reali, locazioni, contratti, successioni). Si dedica anche allo studio della storia del diritto e delle procedure di conciliazione, ed e sviluppatore full-stack autodidatta e progettista di applicazioni AI a supporto del diritto.</p>
<h2>La missione</h2>
<ul>
<li>Trasparenza: rendere immediatamente comprensibili i costi della mediazione</li>
<li>Confronto: permettere una valutazione obiettiva tra mediazione e processo civile</li>
<li>Innovazione responsabile: usare l'intelligenza artificiale soltanto dopo aver completato e documentato le verifiche privacy e contrattuali necessarie</li>
<li>Accessibilita: offrire strumenti gratuiti e professionali a tutti gli operatori del diritto</li>
<li>Aggiornamento: mantenere il calcolatore e la banca dati conformi alle ultime modifiche normative</li>
<li>Integrazione: coniugare rigore tecnico-giuridico, intelligenza artificiale e approcci olistici alla gestione del conflitto</li>
</ul>
</div>`,

  "/contatti": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Contatti</h1>
<p>Contatti di CalcoloMediazione.it per segnalazioni, suggerimenti e collaborazioni professionali in materia di mediazione civile e commerciale.</p>
<h2>Informazioni di contatto</h2>
<ul>
<li>Email: calcagnocarloalberto1@gmail.com</li>
<li>Sito Web: calcolomediazione.it</li>
<li>Indirizzo: Via Trieste 4/9, 16011 Arenzano (GE)</li>
<li>P.IVA: 03718420106</li>
<li>Iscrizione Albo: Ordine degli Avvocati di Genova, n. 2127</li>
</ul>
<p>Le richieste inviate via email vengono generalmente evase entro 48 ore lavorative.</p>
<h2>Segnalazioni e suggerimenti</h2>
<p>Il sito accoglie segnalazioni su: errori di calcolo nelle indennita o nei confronti economici, aggiornamenti normativi non ancora recepiti, proposte per nuove funzionalita, problemi tecnici o bug.</p>
<h2>Altri progetti</h2>
<ul>
<li>EnneagrammaEvolutivo.it - percorsi di crescita personale e consapevolezza</li>
<li>Olismo-Integrato.it - approccio olistico e integrato alla mediazione</li>
</ul>
</div>`,

  "/antiriciclaggio-guida": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Antiriciclaggio in mediazione — guida agli obblighi e alla compilazione</h1>
<p>Due guide in una: la Parte 1 illustra in termini generali gli obblighi antiriciclaggio; la Parte 2 spiega passo per passo lo strumento locale che genera i modelli del fascicolo. L'utente deve verificare con il proprio Organismo e consulente gli obblighi e i ruoli applicabili al caso concreto. L'assistente AI sui documenti e temporaneamente sospeso. Devi solo generare un documento? Vai direttamente al <a href="/antiriciclaggio.html">generatore dei documenti antiriciclaggio</a>.</p>
<h2>Parte 1 — Guida agli obblighi di legge</h2>
<h3>Chi è obbligato, e chi no</h3>
<p>L'applicazione della normativa antiriciclaggio dipende dalla qualifica del soggetto, dall'incarico e dall'operazione concreta. Organismo e professionista devono verificare il proprio inquadramento, le regole tecniche e le procedure interne; questa guida e lo strumento non assegnano automaticamente ruoli o responsabilita.</p>
<h3>L'adeguata verifica della clientela</h3>
<p>Identificazione, titolare effettivo, verifica PEP, valutazione del rischio e misure di adeguata verifica semplificata, ordinaria o rafforzata.</p>
<h3>Il fascicolo: i documenti da produrre e conservare</h3>
<p>Conservazione decennale ai sensi degli artt. 31-32 D.Lgs. 231/2007.</p>
<h3>Riconoscere un'operazione sospetta</h3>
<p>I sette segnali di anomalia UIF e perche' il livello di rischio non va mai riportato nel verbale di mediazione.</p>
<h3>Come si traduce in pratica</h3>
<p>Dagli obblighi di legge alla compilazione concreta dei modelli, spiegata nella Parte 2.</p>
<h2>Parte 2 — Guida alla compilazione dello strumento</h2>
<p>Guida pratica passo per passo alla compilazione manuale dello strumento antiriciclaggio di calcolomediazione.it, sezione per sezione, con selettore iniziale del documento da predisporre, gestione locale multi-parte, salvataggio automatico nel browser ed esportazione in Word. Le indicazioni sui ruoli sono generali e devono essere verificate per il caso e l'organizzazione concreta.</p>
<h3>La logica dello strumento: una procedura, piu parti</h3>
<p>Una mediazione coinvolge almeno due soggetti e può coinvolgerne altri. I dati della procedura nel suo complesso si inseriscono una sola volta; i dati di ciascuna parte si compilano manualmente e separatamente con il pulsante "Nuova parte per questa procedura". In cima alla pagina si sceglie il documento da predisporre. Il caricamento e l'analisi automatica dei documenti sono temporaneamente sospesi.</p>
<h3>Chi compila cosa</h3>
<ul>
<li>Organismo o segreteria: puo raccogliere i dati secondo le procedure e le deleghe interne adottate dall'Organismo</li>
<li>Mediatore designato: compila o verifica le sezioni affidategli dalle procedure interne, senza attribuzione automatica di responsabilita da parte dello strumento</li>
<li>Avvocato di parte: valuta separatamente se e in quale misura l'incarico concreto rientri negli obblighi applicabili alla professione forense</li>
</ul>
<h3>Le 19 sezioni del modulo</h3>
<p>Il modulo si compone di 19 sezioni, dai dati del procedimento e della parte, alla verifica PEP e del titolare effettivo, alla valutazione del rischio e delle anomalie, fino alla generazione dei documenti e alla verifica di secondo livello del Responsabile Antiriciclaggio (RAR).</p>
<h3>Funzioni trasversali</h3>
<ul>
<li>Selettore iniziale del documento da predisporre, con barra persistente "Stai compilando" e possibilita' di cambiare scelta in ogni momento</li>
<li>Gestione di piu parti nella stessa procedura, con dati comuni salvati una sola volta</li>
<li>Compilazione manuale separata per ciascuna parte; il motore AI sui documenti e temporaneamente sospeso</li>
<li>Salvataggio automatico nel browser, cronologia delle generazioni e ripresa del lavoro</li>
<li>Generazione e download in Word del singolo documento scelto, o dell'intero fascicolo come opzione avanzata</li>
<li>Area riservata per il promemoria SOS/RAR, separata dal fascicolo ordinario e attiva solo con rischio ALTO</li>
</ul>
<p>Tutti i dati inseriti nel modulo restano nel browser di chi compila e non vengono inviati a calcolomediazione.it. L'assistente AI e il caricamento dei documenti sono temporaneamente sospesi e le relative richieste vengono rifiutate dal server.</p>
<h3>Domande frequenti</h3>
<p><strong>I dati inseriti vengono inviati a calcolomediazione.it?</strong> No: la compilazione manuale resta nel browser (localStorage). L'assistente AI e il caricamento dei documenti sono sospesi.</p>
<p><strong>Posso generare solo un documento, senza tutto il fascicolo?</strong> Si': scegliendo il documento nel selettore in cima alla pagina, la sezione 19 mostra un solo pulsante di generazione per quel documento; il fascicolo completo resta un'opzione avanzata.</p>
<p><strong>Cambio computer o browser: ritrovo i dati?</strong> No, il salvataggio e' locale al browser: per portare il lavoro altrove si scarica il fascicolo in Word.</p>
<h3>Altre risorse del sito</h3>
<ul>
<li><a href="/generatore-procura">Generatore di procure per la mediazione</a></li>
<li><a href="/calcolatore">Calcolatore indennita' di mediazione</a></li>
<li><a href="/giurisprudenza">Banca dati di giurisprudenza sulla mediazione</a></li>
<li><a href="/faq">FAQ generali sulla mediazione civile</a></li>
<li><a href="/glossario">Glossario dei termini della mediazione</a></li>
</ul>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"I dati inseriti vengono inviati a calcolomediazione.it?","acceptedAnswer":{"@type":"Answer","text":"Mai. Tutto resta nel browser del dispositivo usato per compilare (localStorage): non c'e' alcun invio a un server, ne' di calcolomediazione.it ne' di terzi."}},
{"@type":"Question","name":"Posso generare solo un documento, senza tutto il fascicolo?","acceptedAnswer":{"@type":"Answer","text":"Si': scegli il documento che ti serve nel selettore in cima alla pagina (Modulo AV, Scheda rischio, Dichiarazione del cliente o Modello ufficiale COA Genova) e la sezione 19 mostrera' un solo pulsante di generazione per quel documento. Il fascicolo completo resta disponibile come opzione avanzata."}},
{"@type":"Question","name":"Cambio computer o browser: ritrovo i dati?","acceptedAnswer":{"@type":"Answer","text":"No, il salvataggio automatico e' locale a quel browser. Per portare il lavoro su un altro dispositivo genera e scarica il fascicolo in Word, oppure ricompila i dati sull'altro computer."}}
]}
</script>
</div>`,

  "/privacy-policy": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Informativa sul trattamento dei dati personali</h1>
<p>Ultimo aggiornamento: 8 settembre 2026.</p>
<h2>Titolare del trattamento</h2>
<p>Il titolare del trattamento e Carlo Alberto Calcagno, responsabile di CalcoloMediazione.it. Le richieste privacy possono essere inviate mediante i recapiti della pagina Contatti.</p>
<h2>Dati trattati</h2>
<p>Il server riceve i dati tecnici necessari alla connessione e alla sicurezza. Le statistiche interne non conservano indirizzi IP o user-agent: il totale complessivo delle visualizzazioni e memorizzato nel database come solo numero aggregato, mentre il dettaglio per pagina resta volatile in memoria. Le nuove funzioni IA sono temporaneamente sospese; i relativi dati potranno essere trattati soltanto in caso di futura riattivazione subordinata alle verifiche indicate di seguito.</p>
<h2>Finalita e basi giuridiche</h2>
<p>I dati sono trattati per erogare il servizio richiesto, proteggere e diagnosticare il servizio, adempiere agli obblighi di legge e produrre statistiche interne aggregate. Google Analytics e utilizzato esclusivamente previo consenso, revocabile dal link Preferenze cookie nel footer.</p>
<h2>Servizi di intelligenza artificiale</h2>
<p>La creazione di nuove Analisi AI, il caricamento dei documenti e la chat sono temporaneamente sospesi; il server rifiuta le relative richieste prima di leggerne o decodificarne il corpo. In caso di futura riattivazione, subordinata alle verifiche giuridiche e contrattuali, i contenuti potrebbero essere trasmessi ad Anthropic Claude e, soltanto se tecnicamente abilitato come fallback in un ambiente commerciale idoneo, a Google Gemini. Prima di qualsiasi riattivazione dovranno essere documentati i ruoli, le basi giuridiche, i trasferimenti applicabili, la minimizzazione e la pseudonimizzazione.</p>
<h2>Conservazione</h2>
<p>Le analisi del caso sono conservate nel database del sito per un massimo di 30 giorni e possono essere eliminate prima mediante il token segreto nel browser. I file PDF dell'Analisi del caso sono elaborati in memoria; il testo estratto confluisce nell'analisi. I documenti AML inviati all'IA non sono archiviati dal sito dopo la risposta; i tempi tecnici del fornitore dipendono dal servizio e dal piano applicato.</p>
<h2>Sicurezza e diritti</h2>
<p>Il sito usa HTTPS, risposte API non memorizzabili, token casuali, controlli di origine, limiti di frequenza e dimensione, validazione dei file e minimizzazione dei log. Ai sensi degli artt. 15-22 GDPR, l'interessato puo esercitare i diritti applicabili e proporre reclamo al Garante. Per maggiori dettagli consultare la pagina completa nel browser e la <a href="/cookie-policy">Cookie Policy</a>.</p>
</div>`,

  "/cookie-policy": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Cookie Policy</h1>
<p>Ultimo aggiornamento: 8 settembre 2026.</p>
<h2>Scelte disponibili</h2>
<p>Il sito usa il cookie tecnico cm_consent per ricordare la scelta: 12 mesi in caso di accettazione e 6 mesi in caso di rifiuto. Google Analytics viene caricato soltanto dopo un consenso esplicito; il rifiuto non limita le funzioni essenziali.</p>
<h2>Google Analytics</h2>
<p>I cookie _ga e _ga_* sono usati per la misurazione statistica soltanto dopo il consenso. La configurazione disabilita i segnali Google e la personalizzazione pubblicitaria.</p>
<h2>Statistiche interne e memoria locale</h2>
<p>Il sito conta le visualizzazioni sul proprio server senza cookie, profili, indirizzi IP, user-agent o altri identificatori. Il totale complessivo e conservato nel database come solo numero aggregato, mentre il dettaglio per pagina resta in memoria fino al riavvio. Alcune funzioni usano localStorage per preferenze, modelli di lavoro, token casuali e uno storico tecnico minimizzato.</p>
<h2>Revoca</h2>
<p>La scelta puo essere modificata in qualsiasi momento dal link Preferenze cookie nel footer o dalla pagina completa nel browser. La revoca disabilita Analytics e tenta di eliminare i relativi cookie di prima parte. Per il trattamento dei dati si rinvia alla <a href="/privacy-policy">Privacy Policy</a>.</p>
</div>`,

  "/termini-condizioni": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Termini e Condizioni</h1>
<h2>Descrizione del servizio</h2>
<p>CalcoloMediazione.it offre gratuitamente calcolatori, confronto costi, esportazione dei risultati e risorse informative sulla mediazione civile e commerciale. La creazione di nuove Analisi AI e temporaneamente sospesa; restano disponibili consultazione, esportazione e cancellazione delle analisi gia create.</p>
<h2>Natura indicativa dei risultati</h2>
<p>I calcoli, le analisi gia create e le informazioni fornite hanno carattere indicativo e informativo e non costituiscono consulenza legale, fiscale o professionale. Le indennita calcolate sono valide per gli organismi che applicano le tariffe del D.M. 150/2023; i compensi degli avvocati sono calcolati sui valori medi del D.M. 55/2014 e possono variare. Per calcoli personalizzati e necessario rivolgersi a un professionista qualificato.</p>
<h2>Proprieta intellettuale e riserva di estrazione di testo e dati</h2>
<p>Tutti i contenuti del sito sono protetti dalle leggi sulla proprieta intellettuale. Ai sensi dell'art. 70-quater della Legge 633/1941, il Titolare esercita la riserva sull'estrazione di testo e dati dai contenuti del sito per finalita di addestramento di modelli di intelligenza artificiale, resa disponibile in formato leggibile da macchina all'indirizzo /tdm-policy.json e nel file robots.txt.</p>
<h2>Limitazione di responsabilita</h2>
<p>Il Titolare non assume responsabilita per errori nei calcoli, per decisioni prese sulla base delle informazioni fornite dal sito o per contenuti generati dall'intelligenza artificiale che risultino inesatti o incompleti.</p>
<h2>Legge applicabile</h2>
<p>I presenti Termini sono regolati dalla legge italiana; per qualsiasi controversia e competente in via esclusiva il Foro di Genova.</p>
<h2>Note legali</h2>
<p>CalcoloMediazione.it e un progetto personale di Carlo Alberto Calcagno, mediatore civile e commerciale: uno strumento professionale gratuito per il calcolo delle indennita di mediazione civile e commerciale, conforme al D.M. 150/2023.</p>
<h2>Disclaimer sull'intelligenza artificiale</h2>
<p>La creazione di nuove Analisi AI e la chat sono temporaneamente sospese. Le analisi gia create sono state prodotte da modelli linguistici di terze parti: non costituiscono parere legale, possono contenere errori o imprecisioni, non sostituiscono la consulenza di un professionista qualificato e devono essere verificate dall'utente prima di qualsiasi utilizzo.</p>
<h2>Fonti normative</h2>
<p>I calcoli sono basati su: D.Lgs. 28/2010 (mediazione civile e commerciale), D.M. 150/2023 (indennita di mediazione), D.Lgs. 149/2022 (Riforma Cartabia), D.Lgs. 216/2024 (correttivo Cartabia), D.M. 55/2014 aggiornato D.M. 147/2022 (parametri forensi), D.P.R. 115/2002 (contributo unificato), D.P.R. 131/1986 (imposta di registro), D.Lgs. 347/1990 (imposte ipotecaria e catastale).</p>
</div>`,
};
