# Default per il calcolo dei costi notarili

Questo documento descrive i valori di default utilizzati dal modulo `ai/analisi-economica.js` per stimare i costi notarili nei casi in cui l’utente non inserisca un preventivo reale.

> Obiettivo: fornire una stima prudenziale e trasparente, facilmente sostituibile dall’utente, senza replicare il preventivo di un singolo studio notarile.

---

## Struttura del calcolo

Il modulo `analisiEconomica` utilizza la funzione:

```ts
calcolaCostiNotarili({
  valoreImmobile,
  primaCasa,
  onorarioNotarileStimato,
  impostaRegistroAliquota,
  impostaIpotecaria,
  impostaCatastale,
  altreSpeseNotarili,
})
```

che restituisce:

- imposta di registro
- imposta ipotecaria
- imposta catastale
- onorario notarile
- altre spese notarili
- IVA sul pacchetto onorario + spese
- totale complessivo

Se l’utente non fornisce valori personalizzati, il sistema applica i default descritti sotto.

---

## Aliquota di registro

Default:

- **Prima casa**: 2% sul valore dell’immobile  
- **Altre abitazioni / seconda casa**: 9% sul valore dell’immobile  

Queste aliquote sono coerenti con la prassi: 2% per acquisti con agevolazione prima casa, 9% per gli altri casi in regime di registro proporzionale. [web:71][web:73]

> Nota: l’esenzione fino a 100.000 euro in mediazione (art. 17 D.Lgs. 28/2010) viene gestita a livello di motore numerico di confronto, non in questa funzione.

---

## Imposte ipotecaria e catastale

Default:

- **Imposta ipotecaria**: 50 €  
- **Imposta catastale**: 50 €  

Questi importi fissi riflettono lo schema tipico delle imposte ipotecaria e catastale in presenza di agevolazioni prima casa o in assenza di IVA sull’operazione. [web:71][web:69]

---

## Onorario notarile di default

Se l’utente non inserisce un onorario specifico (`onorarioNotarileStimato`), il sistema applica uno scaglione prudenziale:

```ts
function defaultOnorarioNotaio(valoreImmobile: number, primaCasa: boolean): number {
  if (valoreImmobile <= 100000) return primaCasa ? 1200 : 1400;
  if (valoreImmobile <= 200000) return primaCasa ? 1500 : 1800;
  if (valoreImmobile <= 300000) return primaCasa ? 1800 : 2200;
  if (valoreImmobile <= 500000) return primaCasa ? 2200 : 2800;
  return primaCasa ? 2800 : 3500;
}
```

- Per valori tipici di prima casa (150–250k), l’onorario stimato resta nella fascia 1.500–2.200 €, in linea con le indicazioni di mercato che parlano di compensi notarili fra 1.500 e 3.000 € per una compravendita abitativa. [web:68][web:73]

---

## Altre spese notarili di default

Se l’utente non indica `altreSpeseNotarili`, il sistema usa:

```ts
function defaultAltreSpese(valoreImmobile: number): number {
  if (valoreImmobile <= 100000) return 250;
  if (valoreImmobile <= 300000) return 300;
  return 350;
}
```

Queste voci coprono, in forma sintetica, spese vive, bolli, diritti di visura e archivio, che nella pratica vengono poi dettagliate in fattura dal notaio. [web:69][web:70]

---

## IVA sul pacchetto notarile

L’IVA viene calcolata al 22% su:

```ts
imponibileNotaio = onorario + altreSpese;
ivaNotaio = Math.round(imponibileNotaio * 0.22);
```

Il totale complessivo dei costi notarili è quindi:

```ts
totale =
  registro + ipotecaria + catastale + onorario + altreSpese + ivaNotaio;
```

---

## Base di calcolo

La base di calcolo (`valoreImmobile`) è determinata così:

1. Se l’utente inserisce un **valore immobile / base notarile**, si usa quello.  
2. In mancanza, si usa il **valore della lite** passato al modulo di analisi.  
3. In futuro, per i casi con “prezzo-valore” attivo (`applicaPrezzoValore`), la base potrà essere calcolata a partire da rendita catastale e categoria, coerentemente con la verifica di congruità catastale già presente nel sistema.

---

## Sovrascrittura da parte dell’utente

Tutti i parametri fiscali e notarili possono essere personalizzati:

- **Onorario notarile**: campo “onorarioNotarileStimato”  
- **Aliquota registro**: campo “impostaRegistroAliquota”  
- **Imposta ipotecaria/catastale**: campi “impostaIpotecaria” e “impostaCatastale”  
- **Altre spese**: campo “altreSpeseNotarili”

Se uno di questi valori è impostato, il sistema lo utilizza al posto del default.

---

## Nota per gli utenti (FAQ/Guida)

> Se non inserisci un preventivo reale del notaio, il sistema usa valori standard prudenziali basati su scaglioni di valore dell’immobile e distingue tra prima casa e altre abitazioni.  
> Questi valori servono solo per il confronto economico tra mediazione e processo: non sostituiscono in alcun modo il preventivo di uno specifico studio notarile e possono essere modificati in ogni momento inserendo i tuoi dati nella sezione dedicata ai costi notarili.
