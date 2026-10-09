# PRIV-24 — Canale reclami sulle funzioni IA e scheda di registrazione nella banca dati UE

Data: 9 ottobre 2026
Stato: **bozza**. Il testo del canale è pronto per essere pubblicato dopo l'approvazione del
titolare; la scheda di registrazione si compila solo se il titolare sostiene l'esenzione
dell'art. 6, par. 3 (PRIV-22) e nei termini applicabili.

## 1. Perché un canale proprio

- Chiunque può proporre reclamo all'autorità di vigilanza del mercato (art. 85 del
  Regolamento (UE) 2024/1689); in Italia è l'ACN (art. 5 d.lgs. 179/2026), che procede
  anche su reclami (artt. 16 e 18 del decreto).
- Un canale presso il titolare non è imposto dal testo del decreto, ma **conviene**: permette di
  rimediare per primi, documentare gli esiti e rispondere alle autorità con atti propri.
  L'informativa privacy già indica che i reclami possono essere rivolti al titolare ai
  recapiti dell'informativa; questa nota ne fissa la procedura.

## 2. Procedura proposta

1. **Ricezione.** Scritto all'indirizzo di posta del titolare indicato nella pagina
   Contatti, con oggetto «Reclamo funzioni IA» (o «Segnalazione»). Non è richiesta una
   forma particolare.
2. **Conferma di ricezione** entro 5 giorni lavorativi, con numero di protocollo interno.
3. **Esame.** Il titolare verifica: funzione interessata, data, possibile incidente di
   dati personali, possibile errore dell'output, possibile effetto discriminatorio o
   lesivo di un diritto.
4. **Risposta motivata** entro 30 giorni, con indicazione delle misure adottate e dei
   rimedi presso l'ACN e, per i profili di protezione dei dati, presso il Garante.
5. **Registro dei reclami**: data, funzione, esito, misure, tempi. Conservazione per 24
   mesi; nessun contenuto della pratica se non indispensabile.
6. **Incidenti gravi.** Se l'evento incide su salute, diritti fondamentali o è una
   violazione di dati, si applicano la procedura del Piano sicurezza e incidenti e, ove
   dovuto, la segnalazione all'autorità (art. 73 del Regolamento; artt. 33–34 GDPR).
7. **Riesame annuale** degli esiti per correggere prompt, avvisi e istruzioni.

I termini (5 giorni, 30 giorni, 24 mesi) sono proposte del titolare, non termini di legge.

## 3. Testo da pubblicare (proposta, per la pagina Contatti o Privacy)

> **Reclami e segnalazioni sulle funzioni di intelligenza artificiale.** Se ritieni che una
> funzione di intelligenza artificiale del sito abbia prodotto un risultato errato, lesivo
> o contrario alla normativa, puoi scrivere al titolare all'indirizzo indicato in questa
> pagina, con oggetto «Reclamo funzioni IA». Riceverai conferma entro 5 giorni lavorativi
> e una risposta motivata entro 30 giorni. Restano ferma la possibilità di rivolgersi
> all'Agenzia per la cybersicurezza nazionale (art. 85 del Regolamento (UE) 2024/1689;
> d.lgs. 179/2026) e, per i profili di protezione dei dati personali, al Garante per la
> protezione dei dati personali.

Interventi tecnici: nessuno (testo statico, da inserire in `Contatti.tsx` e richiamare
nell'informativa).

## 4. Scheda di registrazione nella banca dati UE (art. 6, par. 4; art. 49, par. 2; art. 71)

Applicabile solo se il titolare conclude che l'Analisi AI rientra nell'Allegato III ma non
è ad alto rischio (art. 6, par. 3). Il fornitore deve documentare la valutazione prima
dell'immissione in servizio e registrare il sistema; il calendario per l'Allegato III è
da riscontrare sulla Gazzetta ufficiale dell'Unione (Digital Omnibus: 2 dicembre 2027).

| Voce | Contenuto proposto |
|---|---|
| Fornitore | Carlo Alberto Calcagno, titolare di calcolomediazione.it; P. IVA 03718420106; Via Trieste 4/9, 16011 Arenzano (GE); email dalla pagina Contatti |
| Denominazione del sistema | Analisi AI del caso (calcolomediazione.it) |
| Funzione | Supporto a professionisti nell'analisi di una pratica di mediazione: entità, profili giuridici, strategia, MAAN/BATNA, interessi, indicazioni di lavoro sulla trattativa, bozza di accordo, confronto economico |
| Punto dell'Allegato III invocato | Punto 8, lett. a) (ipotesi di lavoro) |
| Fondamento dell'esenzione | Art. 6, par. 3, lett. d): compito preparatorio a una valutazione umana; nessuna profilazione di persone (regole di PRIV-22 e prompt della PR #147) |
| Stato | Immesso in servizio come strumento di supporto; dati reali di terzi non ancora aperti |
| Modello di base | Modello di uso generale di Anthropic (Claude), via API |
| Stati membri | Italia (accessibile da tutta l'Unione) |
| Valutazione documentata | PRIV-22, con esito delle prove del prompt (script `server/ai/prova-profilazione.ts`) |
| Modalità | Inserimento nella banca dati UE tramite il portale della Commissione; non è automatizzabile da qui |

Prima di registrare: verificare le modalità e il portale effettivamente disponibili alla
data (non verificate in questa nota), e tenere copia della scheda.

## 5. Decisione del titolare

[x] Approvo la procedura e il testo del canale reclami (punti 2–3) — pubblicati il 9 ottobre 2026 in Contatti, informativa e pagina statica, su sua richiesta «inserisci tutto quello che puoi inserire»
[x] Approvo la scheda (punto 4) da usare se si sostiene l'esenzione
Data: 9 ottobre 2026   Titolare: Carlo Alberto Calcagno
Approvato dal titolare il 9 ottobre 2026 (firma digitale sul fascicolo «Decisioni del titolare da firmare», scheda 4; conservato dal titolare). La registrazione nella banca dati UE non è stata eseguita: va fatta dal titolare sul portale della Commissione dopo la firma di PRIV-22 e dopo aver verificato termini e modalità.
