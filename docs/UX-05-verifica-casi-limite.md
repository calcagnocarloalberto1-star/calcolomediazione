[UX-05-verifica-casi-limite.md](https://github.com/user-attachments/files/30892263/UX-05-verifica-casi-limite.md)
# UX-05 — Verifica aritmetica/giuridica del calcolatore su casi limite

Documento interno di processo, collegato a [PRIV-07](./PRIV-07-processo-revisione-normativa.md).
Origine: audit professionale dell'8 agosto 2026, issue GitHub #51.

## Metodo

I criteri di accettazione dell'issue richiedono la verifica manuale, da parte
di un consulente esperto, di 5-10 casi limite rappresentativi (cambio di
scaglione, maggiorazioni multiple, mediazione obbligatoria vs volontaria,
gratuito patrocinio). Ho preparato 12 casi — leggermente oltre il minimo
indicato, per coprire anche le tariffe COA Genova e i valori indeterminabili —
con il dettaglio completo di ogni componente di calcolo (non solo il totale
finale).

Il 10 agosto 2026 Carlo ha fornito i due Tariffari ufficiali COA Genova 2026
("Facoltative e Contrattuali" e "Obbligatorie e Demandate", agg. 13/04/2026),
che ho usato per verificare riga per riga tutti gli importi Genova già
presenti nel codice — v. **Fonti verificate** più sotto. Questo ha permesso di
risolvere direttamente due dei quattro punti inizialmente segnalati come "da
verificare" (§2 e §3), oltre a **confermare corretti** tutti gli altri importi
Genova (primo incontro, tabella indennità per scaglione, riduzione 20% per
obbligatoria/demandata, indeterminabili).

Ogni caso è riproducibile con:

```
npx tsx script/verifica-ux05.ts
```

Lo script (`script/verifica-ux05.ts`, non incluso nella build dell'app —
è uno strumento diagnostico) applica anche controlli automatici di primo
livello (non-negatività, coerenza IVA, coerenza totale complessivo) come
filtro tecnico preliminare, PRIMA della verifica giuridica manuale.

## Fonti verificate

- **Tariffario Mediazione 2026 — Facoltative e Contrattuali**, Organismo di
  Mediazione Ordine degli Avvocati di Genova, agg. 13/04/2026 (fornito da
  Carlo il 10/08/2026).
- **Tariffario Mediazione 2026 — Obbligatorie e Demandate**, stesso
  organismo, stesso aggiornamento.

Confrontati riga per riga contro `shared/calcolo-indennita.ts`: spese di
avvio e di mediazione primo incontro (40/75/110 € e 60/120/170 €, identiche
alle nazionali — confermato), tabella delle indennità per scaglione
(24,40 → 7.722,60 €, tutti gli 11 scaglioni — confermato), rapporto esatto
0,8 tra tariffa piena e ridotta obbligatoria/demandata su ogni voce
(confermato riga per riga su entrambi i tariffari), importi indeterminabile
basso/medio/alto (confermato).

## ✅ Punto 2 — RISOLTO: doppia detrazione sul "saldo" prosecuzione COA Genova

I casi C6/C7 avevano rilevato che, per gli scaglioni più bassi (fino a
€1.000 e €1.001-5.000), l'indennità COA Genova per gli incontri successivi
risultava azzerata: l'importo pubblicato (€24,40 / €48,80) era inferiore a
quanto già versato al primo incontro (€60 / €120), che il codice detraeva
una seconda volta.

Il Tariffario fornito da Carlo chiarisce il dubbio: la colonna è intitolata
testualmente **"Saldo indennità prosecuzione (anche senza accordo)"** — la
parola "Saldo" indica che è già un importo netto, quanto resta da versare
per proseguire oltre il primo incontro, non un importo lordo da cui
detrarre ulteriormente quanto già pagato. Il codice applicava invece la
stessa detrazione dell'art. 34 co. 2 prevista per la Tabella A nazionale
(dove è corretta, perché lì gli importi sono lordi), causando un doppio
conteggio solo lato Genova.

**Corretto in `shared/calcolo-indennita.ts`**: per `modalitaTariffaria ===
"coa_genova"` la detrazione ora è €0 invece di riusare le spese del primo
incontro, in entrambi i rami di calcolo (accordo al primo incontro e
incontri successivi). Aggiunto un test di non regressione dedicato
(`shared/calcolo-indennita.test.ts`, Test 11) che blocca esplicitamente
questo comportamento sui due scaglioni più esposti.

Effetto pratico per l'utente (valori PRIMA → DOPO la correzione, IVA
esclusa):

| Caso | Scaglione | Prima (bug) | Dopo (corretto) |
|---|---|---|---|
| C6 | Genova, €2.000, accordo successivi | €195,00 (azzerato) | €255,80 |
| C7 | Genova, €500, accordo successivi | €100,00 (azzerato) | €130,40 |

Il sito **sotto-stimava** il costo reale per questi casi (mostrava solo il
primo incontro, senza l'indennità aggiuntiva per la prosecuzione) — non
sovra-stimava. Nessun utente ha quindi pagato più del dovuto a causa di
questo bug; il rischio era l'opposto, un preventivo online più basso del
reale.

## ✅ Punto 3 — RISOLTO: tabella indeterminabili COA Genova confermata corretta

Gli importi per indeterminabile basso/medio/alto usati per Genova
(rispettivamente €1.390,80 / €1.317,60 / €1.256,60) sono confermati
identici, voce per voce, al Tariffario "Facoltative e Contrattuali"
fornito. Nessuna modifica necessaria.

## ⚠️ Punti ancora aperti — richiedono la tua lettura

**1. Caso C5 — ordine di applicazione delle due maggiorazioni.** Quando un
accordo agli incontri successivi (+25%, art. 30 co. 2) si combina con la
maggiorazione art. 31 co. 3 (fino a +20%, mediatore esperto/procedura
complessa), il codice calcola le due percentuali **separatamente sulla
stessa base** (le spese ridotte, prima di ogni maggiorazione) e le **somma**
("additivo"). Non le compone in sequenza ("moltiplicativo"). Esempio dal
caso C5 (base €1.500): additivo → +25% = €375, +20% = €300, maggiorazione
totale €675, base maggiorata €2.175. Moltiplicativo → 1.500 × 1,25 × 1,20 =
€2.250, cioè €750 di maggiorazione totale anziché €675 (una differenza di
€75 su questo caso, proporzionalmente più alta su valori di lite maggiori).
Il Tariffario Genova ora disponibile non chiarisce questo punto (mostra le
due maggiorazioni solo separatamente, mai in concorso); resta un punto di
lettura giuridica del solo D.M. 150/2023 (art. 30 co. 2 + art. 31 co. 3), non
aritmetica.

**2. Campo "gratuito patrocinio" inutilizzato nel Calcolatore Indennità.**
`shared/calcolo-indennita.ts` dichiara un campo `gratuitoPatrocinio` in
input, ma **non lo usa mai** nel calcolo — è un residuo, probabilmente da un
copia-incolla con `costi-procedura.ts` (che invece lo implementa
correttamente, v. casi C11/C12). La pagina `/calcolatore` non espone
comunque un controllo per questo campo, quindi non c'è un problema visibile
per l'utente — ma è un'inconsistenza nel codice sorgente che segnalo per
completezza. Se utile, posso rimuovere il campo morto o collegarlo davvero.

## Tabella di sintesi — spazio per la tua validazione

Valori aggiornati dopo la correzione del punto 2 (10/08/2026).

| ID | Caso | Totale per parte (IVA escl.) | Verificato | Note / discrepanze |
|---|---|---|---|---|
| C1a | Nazionale, nessun accordo, €1.000 (sotto soglia) | €100,00 | ☐ | |
| C1b | Nazionale, nessun accordo, €1.000,01 (sopra soglia) | €195,00 | ☐ | |
| C2a | Nazionale, accordo successivi, €50.000 (sotto soglia) | €975,00 | ☐ | |
| C2b | Nazionale, accordo successivi, €50.000,01 (sopra soglia) | €1.610,00 | ☐ | |
| C3a | Volontaria, accordo primo, €25.000 | €559,00 | ☐ | |
| C3b | Obbligatoria, accordo primo, €25.000 | €447,00 | ☐ | |
| C3c | Demandata, accordo primo, €25.000 (deve == C3b) | €447,00 | ☐ | |
| C4a | Obbligatoria, accordo successivi, un solo criterio art.31 | €1.480,00 | ☐ | |
| C4b | Obbligatoria, accordo successivi, entrambi i criteri art.31 (deve == C4a) | €1.480,00 | ☐ | |
| C5 | Volontaria, accordo successivi + art.31, €200.000 | €2.285,00 | ☐ | **vedi punto 1 sopra** |
| C6 | COA Genova, accordo successivi, €2.000 | €255,80 | ☐ | corretto — v. sopra |
| C7 | COA Genova, accordo successivi, €500 | €130,40 | ☐ | corretto — v. sopra |
| C8a | Nazionale, accordo successivi, €20.000 | €625,00 | ☐ | |
| C8b | COA Genova, accordo successivi, €20.000 (confronto con C8a) | €683,40 | ☐ | aggiornato dopo fix |
| C9a | Nazionale, indeterminabile alto, obbligatoria, accordo successivi | €1.288,00 | ☐ | |
| C9b | COA Genova, indeterminabile alto, obbligatoria, accordo successivi | €1.480,28 | ☐ | tabella confermata; totale aggiornato dopo fix |
| C10 | Nazionale, accordo primo, €500.000 (cap esenzione registro) | €2.860,00 | ☐ | risparmio registro atteso: €3.000,00 (confermato) |
| C11a | Confronto Costi, obbligatoria, €30.000, GP disattivo | €4.207,00 | ☐ | |
| C11b | Confronto Costi, obbligatoria, €30.000, GP attivo (deve azzerarsi) | €0,00 | ☐ | |
| C12a | Ammissibilità GP, reddito €13.659 (sotto soglia) | ammissibile | ☐ | |
| C12b | Ammissibilità GP, reddito €13.660 (sopra soglia) | non ammissibile | ☐ | verificare vigenza soglia €13.659,64 |

Il dettaglio riga per riga di ogni caso (spese avvio, spese primo incontro,
detrazioni, maggiorazioni, IVA, esenzioni) è nell'output completo dello
script, riprodotto in `docs/UX-05-output-completo.txt` allegato (rigenerato
dopo la correzione).

## Come procedere

1. Spuntare la colonna "Verificato" per ogni caso confermato corretto.
2. Per il punto 1 ancora aperto (ordine delle maggiorazioni), se hai un
   riscontro fammelo sapere: se richiede una modifica al codice apro una
   issue correttiva dedicata invece di modificarlo senza una tua indicazione
   esplicita, trattandosi di un'interpretazione della norma.
3. Questo documento resta in `docs/` come archivio della verifica, in
   continuità con il processo di revisione periodica di PRIV-07.

## Archivio delle verifiche

| Data | Esito |
|---|---|
| 2026-08-10 | Prima verifica preparata (documento + script, 12 casi, 4 punti segnalati). |
| 2026-08-10 | Carlo fornisce i due Tariffari ufficiali COA Genova 2026. Punto 2 (doppia detrazione sul saldo prosecuzione Genova) confermato come bug e corretto in `shared/calcolo-indennita.ts` con test di non regressione dedicato. Punto 3 (tabella indeterminabili Genova) confermato corretto, nessuna modifica. Restano aperti: punto 1 (ordine maggiorazioni, lettura giuridica) e punto 2 residuo (campo gratuitoPatrocinio inutilizzato, rinumerato — nessun impatto utente). |
