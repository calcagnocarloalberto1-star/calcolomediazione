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
};
