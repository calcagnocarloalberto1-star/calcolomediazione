[PRIV-07-processo-revisione-normativa.md](https://github.com/user-attachments/files/30889356/PRIV-07-processo-revisione-normativa.md)
# PRIV-07 — Processo di aggiornamento normativo/giurisprudenziale periodico

Documento interno di processo. Non pubblicato sul sito (la sola data visibile
richiesta dai criteri di accettazione è già presente su `/guida-dm-150`,
`/faq` e `/glossario` — v. DATA-04).

## Responsabile

**Avv. Carlo Alberto Calcagno** — titolare del sito, unico responsabile
dell'aggiornamento normativo e giurisprudenziale dei contenuti.

## Cadenza

**Annuale**, entro il mese di **agosto** di ogni anno (in continuità con la
prima verifica, effettuata il 9 agosto 2026). Da anticipare, al di fuori
della cadenza ordinaria, ogni volta che una fonte monitorata (v. sotto)
segnali un cambiamento normativo o giurisprudenziale rilevante prima della
scadenza annuale.

## Checklist di verifica

Ad ogni revisione, verificare e — se necessario — aggiornare:

1. **Tariffe D.M. 150/2023**: scaglioni Tabella A, spese di avvio (art. 28),
   maggiorazioni (art. 31), tariffe COA Genova — usate da `/calcolatore`,
   `/guida-dm-150`.
2. **Agevolazioni fiscali art. 17 D.Lgs. 28/2010**: soglia di esenzione
   imposta di registro, aliquote su eccedenza — usate da `/costi-notarili`,
   `/trasferimento-immobiliare-mediazione`.
3. **Gratuito patrocinio (artt. 15-bis/15-undecies D.Lgs. 28/2010)**: limiti
   di reddito, tempi di risposta COA — usato da `/gratuito-patrocinio-mediazione`.
4. **Credito d'imposta mediazione**: importi, scadenze di domanda — usato da
   `/credito-imposta`, `/credito-imposta-mediazione-domanda`.
5. **Assegno di mantenimento e divorzile**: eventuali nuove pronunce che
   aggiornino i criteri di Cass. SU 18287/2018 — usato da
   `/assegno-mantenimento-divorzile-calcolo`, `/calcolo-assegni`.
6. **Antiriciclaggio D.Lgs. 231/2007**: eventuali modifiche agli obblighi
   o alle soglie — usato da `/antiriciclaggio`, `/antiriciclaggio-guida`,
   `/antiriciclaggio-mediazione-obblighi`.
7. **Database giurisprudenza** (`client/src/data/giurisprudenza-db.ts`):
   nuove pronunce rilevanti da aggiungere, validazione automatica già attiva
   in fase di build (v. DATA-02).

## Monitoraggio specifico: Cass. 9608/2026 e Cass. 10978/2026

Queste due ordinanze, alla base del `/generatore-procura`, sono
**recentissime e non ancora consolidate** in tutti gli organismi di
mediazione (v. avviso di prudenza in pagina, reso più visibile con PRIV-06).
Ad ogni revisione periodica, e comunque non oltre i 12 mesi dalla loro
pubblicazione:

- verificare se sono intervenute pronunce successive (conformi o difformi)
  della Cassazione sullo stesso tema;
- verificare se la prassi degli organismi di mediazione risulta essersi
  uniformata;
- se la giurisprudenza risulta consolidata, valutare la rimozione o
  attenuazione dell'avviso di prudenza; se emergono contrasti, valutarne il
  rafforzamento.

## Timestamp visibile (collegamento a DATA-04)

Le pagine `/guida-dm-150`, `/faq` e `/glossario` mostrano la dicitura
"Ultima verifica normativa: [mese] [anno]" (v. DATA-04), da aggiornare
manualmente ad ogni revisione che comporti modifiche sostanziali al
contenuto di quella pagina. Le pagine `/privacy-policy`, `/cookie-policy`
e `/termini-condizioni` seguono lo stesso principio con la propria dicitura
"Ultimo aggiornamento".

## Archivio delle revisioni

| Data | Esito |
|---|---|
| 2026-08-09 | Prima verifica formalizzata. Processo definito (questo documento). Nessuna modifica normativa sostanziale rilevata rispetto ai contenuti già pubblicati in questa data. |
