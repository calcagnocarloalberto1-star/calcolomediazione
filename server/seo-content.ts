// Static HTML content for SEO pre-rendering
// This content is injected into <div id="root"> server-side
// React hydrates over it when JS loads in the browser

export const SEO_CONTENT: Record<string, string> = {
  "/": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">CalcoloMediazione - Mediazione e Negoziazione con AI</h1>
<p>Piattaforma professionale gratuita per la mediazione civile ai sensi del <strong>D.M. 150/2023</strong>. Analisi AI del caso, confronto economico su tre gradi di giudizio, calcolatore indennita e generatore documenti.</p>
<h2>Strumenti disponibili</h2>
<ul>
<li><a href="/calcolatore">Calcolatore Indennita Mediazione D.M. 150/2023</a> - Calcola spese di avvio, indennita, compensi avvocato, costi notarili con esenzione prima casa</li>
<li><a href="/analisi-caso-ai">Analisi AI del Caso di Mediazione</a> - Analisi giuridica completa, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico</li>
<li><a href="/confronto-costi">Confronto Costi Mediazione vs Processo</a> - Primo grado, appello e cassazione con stima CTU e parametri forensi D.M. 55/2014</li>
<li><a href="/generatore-procura">Generatore Procura Speciale per Mediazione</a> - Conforme al D.Lgs. 28/2010</li>
<li><a href="/giurisprudenza">Database Giurisprudenza Mediazione</a> - Sentenze di Cassazione, Tribunali e Corti d'Appello</li>
<li><a href="/credito-imposta">Credito d'Imposta e Gratuito Patrocinio</a> - Art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023</li>
<li><a href="/strategie-negoziazione">Strategie di Negoziazione</a> - MAAN/BATNA, negoziazione integrativa, ZOPA, ancoraggio</li>
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
<p>Analisi completa del caso di mediazione con intelligenza artificiale. Il sistema genera 8 sezioni di analisi: estrazione entita (NER), analisi giuridica, guida strategica per il mediatore, analisi MAAN/BATNA, compatibilita degli interessi, controllo bias cognitivi, bozza di accordo e analisi economica comparativa.</p>
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
<p>L'analisi include la verifica di congruita del valore catastale per le materie immobiliari e il calcolo del credito d'imposta disponibile.</p>
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
<p>Il credito d'imposta per la mediazione (art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023) prevede fino a 600 euro per indennita organismo, fino a 600 euro per compenso avvocato, fino a 518 euro per contributo unificato. Scadenza domanda: 31 marzo dell'anno successivo.</p>
</div>`,

  "/credito-imposta": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Credito d'Imposta e Gratuito Patrocinio in Mediazione</h1>
<p>Guida completa al credito d'imposta per la mediazione civile (art. 20 D.Lgs. 28/2010, D.M. 1 agosto 2023) e al gratuito patrocinio (artt. 15-bis/15-undecies D.Lgs. 28/2010).</p>
<h2>Credito d'Imposta</h2>
<p>Importi massimi: fino a 600 euro per indennita organismo (300 senza accordo), fino a 600 euro per compenso avvocato (solo mediazione obbligatoria/demandata), fino a 518 euro per contributo unificato (solo mediazione demandata con accordo). Tetto annuale: 2.400 euro persone fisiche, 24.000 euro persone giuridiche.</p>
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
<p>Guida agli obblighi antiriciclaggio nella mediazione civile (D.Lgs. 231/2007) e compilazione automatica dei modelli del fascicolo riservato, per avvocati, mediatori e Organismi di mediazione.</p>
<h2>Chi e' obbligato</h2>
<p>Orientamento su chi ricade negli obblighi antiriciclaggio in mediazione: Organismo di mediazione (soggetto obbligato principale ex art. 3, c. 5, lett. g D.Lgs. 231/2007), mediatore designato, avvocato che assiste una parte (di regola esente), negoziazione assistita, OCC e gestore della crisi da sovraindebitamento.</p>
<h2>I sei obblighi principali</h2>
<ul>
<li>Adeguata verifica della clientela (artt. 17-19)</li>
<li>Individuazione del titolare effettivo (artt. 18, 20, 22)</li>
<li>Conservazione del fascicolo riservato per 10 anni (artt. 31-32)</li>
<li>Segnalazione di operazioni sospette alla UIF (artt. 35-41)</li>
<li>Autovalutazione e scheda di rischio per ogni pratica (art. 15)</li>
<li>Formazione e presidi interni</li>
</ul>
<h2>Compilazione automatica dei modelli</h2>
<p>Lo strumento genera in automatico i modelli del fascicolo riservato (informativa, modulo di adeguata verifica, scheda di valutazione del rischio, dichiarazione del cliente, foglio di annotazione) a partire dai dati inseriti, con anche una modalita' di lettura assistita dei documenti (identita', visura camerale, istanza di mediazione).</p>
</div>`,

  "/antiriciclaggio-mediazione-obblighi": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Antiriciclaggio per mediatori e avvocati: la guida pratica agli obblighi D.Lgs. 231/2007</h1>
<p>Antiriciclaggio mediazione obblighi: chi è tenuto all'adeguata verifica del mediatore, quando l'avvocato è esente, quali documenti produrre e conservare, come riconoscere un'operazione sospetta. Guida pratica D.Lgs. 231/2007.</p>
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
<p>CalcoloMediazione.it e una piattaforma professionale gratuita dedicata alla mediazione civile e commerciale, conforme al D.M. 150/2023 e alla Riforma Cartabia (D.Lgs. 149/2022). Il progetto nasce dall'esperienza diretta nel campo della mediazione e della risoluzione alternativa delle controversie (ADR), con l'obiettivo di fornire a mediatori, avvocati e cittadini strumenti precisi, aggiornati e accessibili. Il sito integra un sistema di intelligenza artificiale avanzato per l'analisi dei casi, una banca dati giurisprudenziale curata, un generatore di procura speciale, una guida ai costi notarili, un calcolo del credito d'imposta e una sezione di strategie di negoziazione. Tutto gratuito, senza pubblicita e senza affiliazioni.</p>
<h2>Gli strumenti del sito</h2>
<ul>
<li><a href="/calcolatore">Calcolatore Indennita</a> - calcolo delle indennita di mediazione secondo il D.M. 150/2023 e le tariffe COA Genova</li>
<li><a href="/analisi-caso-ai">Analisi AI del Caso</a> - pipeline AI in 8 fasi: analisi giuridica, strategia, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico</li>
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
<li>Innovazione: applicare l'intelligenza artificiale per supportare l'analisi dei casi</li>
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
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Antiriciclaggio in Mediazione — Guida alla Compilazione</h1>
<p>Guida pratica passo per passo alla compilazione dello strumento antiriciclaggio di calcolomediazione.it: cosa fa l'Organismo di mediazione, cosa fa il Mediatore designato, cosa fa l'Avvocato di parte, sezione per sezione, con motore unico di compilazione automatica multi-documento e multi-parte, salvataggio automatico ed esportazione in Word.</p>
<h2>La logica dello strumento: una procedura, piu parti</h2>
<p>Una mediazione coinvolge sempre almeno due soggetti, spesso piu di due. I dati della procedura nel suo complesso (Organismo, numero di procedura, date, mediatore designato, oggetto della controversia) si inseriscono una sola volta; i dati di ciascuna parte (identificazione, rischio, adeguata verifica) si compilano separatamente per ognuna, con il pulsante "Nuova parte per questa procedura" o con il motore di compilazione automatica che individua da solo istanti e aderenti dai documenti caricati.</p>
<h2>Chi compila cosa</h2>
<ul>
<li>Organismo di mediazione (o segreteria): dati del procedimento, numero di iscrizione, legale rappresentante, numero di procedura, date di deposito</li>
<li>Mediatore designato: identificazione della parte, titolare effettivo, qualifica PEP, valutazione del rischio, esame delle anomalie, motore trigger UIF sui sette segnali T1-T7</li>
<li>Avvocato di parte: compila solo se l'incarico sfocia in un'operazione economica autonoma ex art. 3, c. 4, lett. c) D.Lgs. 231/2007; nella generalita dei casi l'attivita difensiva e esclusa dagli obblighi antiriciclaggio</li>
</ul>
<h2>Le 18 sezioni del modulo</h2>
<p>Il modulo si compone di 18 sezioni, dai dati del procedimento e della parte, alla verifica PEP e del titolare effettivo, alla valutazione del rischio e delle anomalie, fino alla verifica di secondo livello del Responsabile Antiriciclaggio (RAR).</p>
<h2>Funzioni trasversali</h2>
<ul>
<li>Gestione di piu parti nella stessa procedura, con dati comuni salvati una sola volta</li>
<li>Motore unico di compilazione automatica dai documenti del fascicolo, con individuazione di tutte le parti (istanti e aderenti)</li>
<li>Salvataggio automatico nel browser, cronologia delle generazioni e ripresa del lavoro</li>
<li>Esportazione e importazione dei dati in formato .json</li>
<li>Generazione, stampa e download del fascicolo in Word o HTML</li>
</ul>
<p>Tutti i dati restano nel browser di chi compila: nulla viene inviato a calcolomediazione.it, salvo la modalita facoltativa ad alta precisione con AI, che trasmette i documenti caricati all'API del fornitore di intelligenza artificiale scelto dall'utente.</p>
</div>`,

  "/privacy-policy": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Privacy Policy</h1>
<p>Informativa sul trattamento dei dati personali degli utenti di CalcoloMediazione.it, ai sensi del Regolamento UE 2016/679 (GDPR).</p>
<h2>Titolare del trattamento</h2>
<p>Il titolare del trattamento e Carlo Alberto Calcagno, responsabile del sito CalcoloMediazione.it.</p>
<h2>Dati raccolti</h2>
<ul>
<li>Dati di navigazione: indirizzo IP, tipo di browser, pagine visitate, orario di accesso</li>
<li>Dati forniti volontariamente nei form di contatto o nei calcolatori</li>
<li>Dati di analisi AI, elaborati in tempo reale e non conservati in modo permanente dopo la chiusura della sessione</li>
</ul>
<h2>Finalita e base giuridica</h2>
<p>I dati sono trattati per erogare i servizi di calcolo e analisi del sito, rispondere alle richieste di contatto, adempiere a obblighi di legge ed effettuare analisi statistiche aggregate, sulla base del consenso, dell'esecuzione di un contratto, del legittimo interesse o di un obbligo legale (art. 6 GDPR).</p>
<h2>Conservazione dei dati</h2>
<p>I dati di navigazione sono conservati fino a 12 mesi; i dati dei calcoli non sono conservati in modo permanente; le eventuali analisi AI salvate sono eliminate entro 30 giorni; i dati di contatto sono conservati per il tempo necessario a evadere la richiesta.</p>
<h2>Compilazione automatica dei modelli antiriciclaggio con AI</h2>
<p>Su scelta esplicita dell'utente, la modalita ad alta precisione dello strumento antiriciclaggio trasmette il documento caricato all'API di un fornitore di intelligenza artificiale (Anthropic) al solo fine di estrarne i dati per la compilazione dei modelli. Il fornitore non utilizza i dati per addestrare i propri modelli e conserva i log tecnici per un massimo di 7 giorni; il sito non conserva il file caricato ne i dati estratti. La modalita predefinita di riconoscimento (OCR) opera invece interamente nel browser, senza trasmissione dei file.</p>
<h2>Diritti dell'interessato</h2>
<p>Ai sensi degli artt. 15-22 GDPR, l'utente ha diritto di accesso, rettifica, cancellazione, limitazione, portabilita e opposizione al trattamento, oltre al diritto di proporre reclamo al Garante per la Protezione dei Dati Personali. Per informazioni sui cookie si rinvia alla <a href="/cookie-policy">Cookie Policy</a>.</p>
</div>`,

  "/cookie-policy": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Cookie Policy</h1>
<p>Informativa sull'utilizzo dei cookie sul sito CalcoloMediazione.it.</p>
<h2>Cookie tecnici</h2>
<p>Cookie di sessione e funzionali, necessari al funzionamento del sito, che non richiedono il consenso preventivo dell'utente.</p>
<h2>Cookie analitici (Google Analytics)</h2>
<p>Il sito utilizza Google Analytics per raccogliere statistiche aggregate di utilizzo. I cookie analitici vengono installati solo dopo che l'utente ha espresso il consenso tramite il banner presente sul sito; senza consenso, Google Analytics non viene caricato.</p>
<h2>Cookie e servizi di terze parti</h2>
<ul>
<li>Google Analytics - statistiche di navigazione, richiede consenso</li>
<li>Servizi AI (Anthropic Claude, Google Gemini in fallback) - elaborazione delle analisi AI e, solo su richiesta dell'utente, lettura dei documenti caricati nello strumento antiriciclaggio</li>
<li>Google Fonts - caricamento dei font tipografici del sito</li>
</ul>
<h2>Gestione dei cookie</h2>
<p>L'utente puo gestire le preferenze sui cookie direttamente dal proprio browser (Chrome, Firefox, Safari, Edge); la disattivazione dei cookie tecnici puo compromettere il funzionamento di alcune funzionalita del sito. Per informazioni generali sul trattamento dei dati si rinvia alla <a href="/privacy-policy">Privacy Policy</a>.</p>
</div>`,

  "/termini-condizioni": `<div style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;color:#2d2926">
<h1 style="font-size:2rem;font-family:'Space Grotesk',sans-serif">Termini e Condizioni</h1>
<h2>Descrizione del servizio</h2>
<p>CalcoloMediazione.it offre gratuitamente: calcolatore delle indennita di mediazione ai sensi del D.M. 150/2023, calcolatore con tariffe dell'Ordine degli Avvocati di Genova, confronto costi tra mediazione e processo civile, analisi AI dei casi di mediazione, esportazione PDF dei risultati e risorse informative sulla mediazione civile e commerciale.</p>
<h2>Natura indicativa dei risultati</h2>
<p>I calcoli, le analisi e le informazioni fornite hanno carattere indicativo e informativo e non costituiscono consulenza legale, fiscale o professionale. Le indennita calcolate sono valide per gli organismi che applicano le tariffe del D.M. 150/2023; i compensi degli avvocati sono calcolati sui valori medi del D.M. 55/2014 e possono variare; le analisi AI possono contenere imprecisioni. Per calcoli personalizzati e necessario rivolgersi a un professionista qualificato.</p>
<h2>Proprieta intellettuale e riserva di estrazione di testo e dati</h2>
<p>Tutti i contenuti del sito sono protetti dalle leggi sulla proprieta intellettuale. Ai sensi dell'art. 70-quater della Legge 633/1941, il Titolare esercita la riserva sull'estrazione di testo e dati dai contenuti del sito per finalita di addestramento di modelli di intelligenza artificiale, resa disponibile in formato leggibile da macchina all'indirizzo /tdm-policy.json e nel file robots.txt.</p>
<h2>Limitazione di responsabilita</h2>
<p>Il Titolare non assume responsabilita per errori nei calcoli, per decisioni prese sulla base delle informazioni fornite dal sito o per contenuti generati dall'intelligenza artificiale che risultino inesatti o incompleti.</p>
<h2>Legge applicabile</h2>
<p>I presenti Termini sono regolati dalla legge italiana; per qualsiasi controversia e competente in via esclusiva il Foro di Genova.</p>
<h2>Note legali</h2>
<p>CalcoloMediazione.it e un progetto personale di Carlo Alberto Calcagno, mediatore civile e commerciale: uno strumento professionale gratuito per il calcolo delle indennita di mediazione civile e commerciale, conforme al D.M. 150/2023.</p>
<h2>Disclaimer sull'intelligenza artificiale</h2>
<p>Le analisi generate tramite intelligenza artificiale presenti sul sito sono prodotte da modelli linguistici di terze parti: non costituiscono parere legale, possono contenere errori o imprecisioni, non sostituiscono la consulenza di un professionista qualificato e devono essere verificate dall'utente prima di qualsiasi utilizzo.</p>
<h2>Fonti normative</h2>
<p>I calcoli sono basati su: D.Lgs. 28/2010 (mediazione civile e commerciale), D.M. 150/2023 (indennita di mediazione), D.Lgs. 149/2022 (Riforma Cartabia), D.Lgs. 216/2024 (correttivo Cartabia), D.M. 55/2014 aggiornato D.M. 147/2022 (parametri forensi), D.P.R. 115/2002 (contributo unificato), D.P.R. 131/1986 (imposta di registro), D.Lgs. 347/1990 (imposte ipotecaria e catastale).</p>
</div>`,
};
