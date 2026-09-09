# PRIV-12 — Verifica fornitori e trasferimenti internazionali

Data di verifica: 9 settembre 2026

## Scopo e stato

Il documento raccoglie le evidenze pubbliche disponibili per i fornitori
utilizzati da CalcoloMediazione.it. Non sostituisce i DPA applicabili
all'account né attesta condizioni commerciali che non siano state verificate
nel relativo pannello.

## Northflank

- Il servizio applicativo e il database risultano configurati nella regione
  `Europe - West (London)`, Regno Unito.
- La Commissione europea indica il Regno Unito tra i Paesi destinatari di una
  decisione di adeguatezza GDPR, rinnovata il 19 dicembre 2025 e valida fino al
  27 dicembre 2031, salvo proroga o modifica:
  https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
- L'adeguatezza disciplina il trasferimento verso il Regno Unito, ma non
  sostituisce l'accordo sul trattamento ex art. 28 GDPR.
- Nelle pagine pubbliche esaminate non è stato individuato un DPA
  self-service specifico per i dati dei workload. Northflank indica
  `legal@northflank.com` per le questioni legali e privacy:
  https://northflank.com/legal/privacy
- La pagina sicurezza dichiara SOC 2 Type 2 e indica i contatti sicurezza:
  https://northflank.com/security

**Stato:** trasferimento verso il Regno Unito coperto da adeguatezza;
DPA, subprocessori, localizzazione di log e backup, cancellazione,
notifica incidenti, RPO e RTO ancora da ottenere e archiviare.

## Anthropic API

- Il DPA è incorporato nei Commercial Terms per i servizi commerciali:
  https://privacy.anthropic.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa
- Il DPA incorpora, ove necessarie, le SCC 2021/914, Modulo 2
  titolare-responsabile e/o Modulo 3 responsabile-subresponsabile:
  https://www.anthropic.com/legal/data-processing-addendum
- Il DPA disciplina istruzioni documentate, cancellazione/restituzione alla
  cessazione, subprocessori e trasferimenti.
- L'eventuale zero data retention non è presunto: richiede un accordo
  specifico e approvazione Anthropic:
  https://privacy.anthropic.com/it/articles/8956058-ho-un-accordo-di-conservazione-dati-zero-con-anthropic-a-quali-prodotti-si-applica

**Stato:** DPA e SCC pubblicamente verificati come incorporati nei termini
commerciali dell'API; conservare una copia datata e verificare nel pannello
che la chiave appartenga a un'organizzazione commerciale. ZDR non attestata.

## Google Gemini API

- Per utenti e applicazioni nello SEE, in Svizzera o nel Regno Unito i
  termini richiedono l'uso di Paid Services.
- Gemini API è qualificata come Paid Service soltanto quando la chiamata
  utilizza un progetto Cloud con account di fatturazione attivo.
- Nei servizi gratuiti Google può usare input e output per migliorare i
  prodotti e può sottoporli a revisione umana; i termini vietano di inviare
  dati sensibili, riservati o personali ai servizi gratuiti.
- Nei Paid Services prompt e risposte non sono usati per migliorare i
  prodotti e sono trattati secondo il Cloud Data Processing Addendum:
  https://ai.google.dev/gemini-api/terms
  https://cloud.google.com/terms/data-processing-addendum
- La zero data retention richiede condizioni e configurazioni specifiche:
  https://ai.google.dev/gemini-api/docs/zdr

**Stato:** fallback disabilitato dal codice salvo
`GEMINI_PAID_SERVICE_ACKNOWLEDGED=true`. Non impostare tale variabile finché
non sono verificati progetto Cloud, fatturazione attiva, DPA e configurazione
di conservazione. La sola presenza di `GEMINI_API_KEY` non abilita il
fornitore.

## Decisione operativa

1. Anthropic resta il fornitore AI principale.
2. Gemini resta disabilitato fino a verifica documentata del Paid Service.
3. Non dichiarare ZDR per alcun fornitore senza un accordo specifico.
4. Richiedere e archiviare il DPA Northflank prima di considerare chiusa la
   verifica ex art. 28.
5. Riesaminare questo documento almeno annualmente e a ogni variazione di
   provider, modello, regione, piano o condizioni contrattuali.
