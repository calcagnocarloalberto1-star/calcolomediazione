# PRIV-12 — Verifica fornitori e trasferimenti internazionali

Data di verifica: 11 settembre 2026

## Scopo e stato

Il documento raccoglie evidenze pubbliche e registra l'esame, svolto dal
titolare, di documentazione riservata ottenuta dai fornitori. Non riproduce nel
repository pubblico il contenuto coperto da NDA e non sostituisce i DPA applicabili
all'account né attesta condizioni commerciali che non siano state verificate
nel relativo pannello.

## Northflank

- Il servizio applicativo e il database risultano configurati nella regione
  `Europe - West (London)`, Regno Unito.
- NDA reciproco Common Paper sottoscritto da entrambe le parti il 10 settembre
  2026, nella forma standard soggetta alla legge e al foro del Delaware, con
  audit trail della firma elettronica conservato nell'archivio riservato.
- Dopo la firma è stato ottenuto l'accesso al Trust Center Northflank (Vanta).
- DPA ottenuto e verificato: copre sette dei nove punti della checklist
  interna. Restano da ottenere i valori numerici di RPO e RTO dei backup.
- Rapporto SOC 2 Type II verificato senza eccezioni sui controlli testati.
- Rapporto di penetration test Kaiju Security verificato con rischio
  classificato `Low` in tutte le aree testate.
- La Commissione europea indica il Regno Unito tra i Paesi destinatari di una
  decisione di adeguatezza GDPR, rinnovata il 19 dicembre 2025 e valida fino al
  27 dicembre 2031, salvo proroga o modifica:
  https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
- L'adeguatezza disciplina il trasferimento verso il Regno Unito, ma non
  sostituisce l'accordo sul trattamento ex art. 28 GDPR.
- La pagina sicurezza dichiara SOC 2 Type 2 e indica i contatti sicurezza:
  https://northflank.com/security

**Stato:** trasferimento verso il Regno Unito coperto da adeguatezza; DPA,
SOC 2 Type II, penetration test e documentazione Trust Center acquisiti e
verificati nei limiti sopra indicati. La migrazione a Francoforte è stata
valutata e scartata perché comporterebbe downtime senza spostare i backup
nativi fuori dal Regno Unito. La risposta del fornitore ancora attesa
riguarda i valori numerici RPO/RTO; ciò non chiude la prova interna di restore, che resta
separatamente aperta in PRIV-13.

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
che la chiave appartenga a un'organizzazione commerciale. La chiave di
produzione è stata identificata dal titolare come `carlo-api-key`; è stata
esclusa `olismo-proxy-2026-05-v2`. Restano da registrare organizzazione,
account e piano API commerciale effettivamente associati. ZDR non attestata.

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

**Stato verificato l'11 settembre 2026:** la chiave configurata in Northflank
è `Gemini API Key 4`, creata il 9 settembre 2026, associata a `Gemini Project`
(project ID `gen-lang-client-0302865949`, project number `926659369623`).
Google AI Studio indica `Livello 1 - Pagamento posticipato`. La variabile
`GEMINI_PAID_SERVICE_ACKNOWLEDGED` è assente: il fallback resta quindi
disabilitato dal codice. Conservare una copia datata del Cloud DPA, delle SCC
applicabili e della configurazione di conservazione prima di valutare
l'attivazione. La sola presenza di `GEMINI_API_KEY` non abilita il fornitore.

## Decisione operativa

1. Entrambi i flussi AI che possono ricevere dati di pratiche reali restano
   sospesi. Anthropic è il fornitore previsto come principale soltanto in caso
   di futura riattivazione.
2. Gemini resta disabilitato fino a verifica documentata del Paid Service.
3. Non dichiarare ZDR per alcun fornitore senza un accordo specifico.
4. Conservare il DPA Northflank e le evidenze Trust Center già acquisiti;
   integrare i valori RPO/RTO quando Northflank risponderà.
5. Riesaminare questo documento almeno annualmente e a ogni variazione di
   provider, modello, regione, piano o condizioni contrattuali.
