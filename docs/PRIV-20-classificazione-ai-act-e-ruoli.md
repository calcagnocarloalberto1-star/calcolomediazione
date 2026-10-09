# PRIV-20 — Classificazione dei sistemi di IA del sito secondo l'AI Act e ruoli

Data: 9 ottobre 2026
Stato: **bozza istruttoria**, non una valutazione definitiva. Le conclusioni sono
ipotesi di lavoro da rivedere e fare proprie, o correggere, da parte del titolare.
Va riesaminata al ricevimento del testo definitivo delle modifiche del Digital
Omnibus e almeno una volta l'anno.

## 1. Perché serve

Nel repository non c'era una valutazione della posizione del sito rispetto al
Regolamento (UE) 2024/1689 (AI Act) né rispetto alla L. 132/2025 e al d.lgs. 7
ottobre 2026, n. 179 (GU n. 234 dell'8 ottobre 2026, in vigore dal 23 ottobre 2026,
poteri delle autorità nazionali e formazione). Questa nota la imposta.

## 2. I sistemi del sito

| Sistema | Funzione | Dati | Ipotesi di classificazione |
|---------|----------|------|-----------------------------|
| Analisi AI del caso | Otto fasi: entità, analisi giuridica, strategia, MAAN/BATNA, compatibilità degli interessi, bias cognitivi, bozza di accordo, confronto economico | Dati di pratiche (oggi casi fittizi) | **Da approfondire.** Candidato all'Allegato III, punto 8, lett. a): sistemi usati «in modo analogo» alla ricerca e interpretazione di fatti e diritto e alla loro applicazione a un caso concreto nella risoluzione alternativa delle controversie |
| Assistente AI antiriciclaggio | Propone la compilazione di moduli dai documenti caricati | Documenti d'identità, visure, procure | Probabilmente fuori dall'Allegato III (compito di trascrizione e proposta, conferma umana prima di scrivere nei campi); resta il tema dell'art. 10 GDPR (PRIV-10, PRIV-19) |
| Assistente flottante | Chat su mediazione e strumenti del sito | Nessun dato personale richiesto | Rischio limitato: obbligo di trasparenza (art. 50, par. 1); dal 9 ottobre 2026 si dichiara sistema di IA |
| Ricerca AI sulla giurisprudenza | Seleziona pronunce da un catalogo pubblico | Nessun dato personale | Probabilmente fuori dall'Allegato III (destinatari: professionisti, non autorità giudiziarie) |
| «Spiega con l'AI» sui calcolatori | Testo discorsivo sui numeri | Solo numeri e parametri | Rischio minimo |

## 3. Ruoli

- **Titolare del sito:** fornitore (art. 3, n. 3) dei sistemi di IA del sito, che
  sviluppa e mette in servizio con il proprio nome, costruiti su un modello di
  uso generale fornito da Anthropic (obblighi propri del fornitore del modello).
- **Professionista o organismo che usa lo strumento:** deployer (art. 3, n. 4) del
  sistema; titolare del trattamento ai fini GDPR (PRIV-16).
- **Obbligo trasversale:** alfabetizzazione in materia di IA (art. 4) per chi
  gestisce e usa i sistemi, in vigore dal 2 febbraio 2025.

## 4. Analisi sull'Analisi AI del caso (punto da decidere)

1. **Rientra nell'Allegato III, punto 8, lett. a)?** L'analisi giuridica e la bozza
   di accordo assistono il mediatore e le parti nell'applicazione della legge a un
   caso concreto in una procedura di risoluzione alternativa delle controversie:
   il parallelo con l'uso «in modo analogo» non si esclude.
2. **Esenzione dell'art. 6, par. 3.** Un sistema dell'Allegato III non è ad alto
   rischio se non presenta un rischio significativo per salute, sicurezza o diritti
   fondamentali e svolge, fra l'altro, un compito preparatorio a una valutazione
   umana, o non sostituisce né influenza la valutazione umana senza revisione.
   Elementi a favore: output dichiarato ipotesi da verificare, decisione al
   mediatore e alle parti, nessun automatismo. Elementi da tenere sotto controllo:
   la valutazione deve essere **documentata prima dell'immissione in servizio**
   (art. 6, par. 4) e il fornitore deve registrare il sistema nella banca dati UE
   (art. 49, par. 2) anche se lo ritiene non ad alto rischio.
3. **Profilazione.** L'esenzione non vale se il sistema effettua la profilazione di
   persone fisiche (art. 6, par. 3, ultimo comma). La fase «bias cognitivi» è
   presentata come piste di ascolto e non come valutazione delle persone: la
   formulazione e i testi dei prompt vanno riletti da questo punto di vista.
4. **Calendario.** Per l'Allegato III il Digital Omnibus approvato dal Consiglio il
   29 giugno 2026 sposta l'applicazione degli obblighi al 2 dicembre 2027 (prima: 2
   agosto 2026). Da riscontrare sul testo pubblicato nella Gazzetta ufficiale
   dell'Unione europea prima di citarlo in atti.

## 5. Norme nazionali di contorno

- L. 132/2025: principio antropocentrico e obbligo informativo del professionista
  verso il cliente.
- d.lgs. 179/2026: AgID autorità di notifica (art. 4), ACN autorità di vigilanza del
  mercato sui sistemi di IA (art. 5), con le autorità di settore finanziario e il Garante
  per i casi dell'art. 74, par. 8, AI Act; art. 23 sanzioni (fino a 15
  milioni di euro o 3% del fatturato per gli obblighi dei fornitori, deployer e
  della trasparenza, con criterio ridotto per PMI e microimprese); art. 47
  formazione sull'IA nei corsi degli ordini e delle associazioni L. 4/2013 (entro
  sei mesi dall'entrata in vigore); art. 49 modulazione dell'equo compenso in base
  alla classe di rischio del sistema usato, parametri entro dodici mesi.

## 6. Azioni proposte

1. Dichiarare l'assistente flottante come sistema di IA (fatto, PR #142).
2. Decidere se redigere la valutazione documentata dell'art. 6, par. 4 per
   l'Analisi AI del caso e quale conclusione sostenere (esenzione o alto rischio).
3. Rileggere i testi della fase «bias cognitivi» per escludere l'effetto di
   profilazione.
4. Se si sceglie l'esenzione: preparare il fascicolo della valutazione e valutare
   la registrazione nella banca dati UE nei termini applicabili.
5. Aggiornare DPIA (PRIV-10) e registro (PRIV-11) con il rinvio a questa nota.
6. Riesaminare la nota al testo definitivo del Digital Omnibus.
