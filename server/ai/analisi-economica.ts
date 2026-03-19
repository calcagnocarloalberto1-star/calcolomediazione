import { callLLM } from "./llm.js";

export async function analisiEconomica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  tipoAnalisi: string,
  previousAnalysis: string,
  opzioniEconomiche: { materiaImmobiliare: boolean; primaCasa: boolean; gratuitoPatrocinio: boolean; mediatoreEsperto: boolean; proceduraComplessa: boolean; modalitaTariffaria: string } = { materiaImmobiliare: false, primaCasa: false, gratuitoPatrocinio: false, mediatoreEsperto: false, proceduraComplessa: false, modalitaTariffaria: "nazionale" }
): Promise<string> {
  const valore = valoreLite || 25000;
  const { materiaImmobiliare, primaCasa, gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa, modalitaTariffaria } = opzioniEconomiche;
  const isGenova = modalitaTariffaria === "coa_genova";

  // Build dynamic sections based on flags
  let notaioSection = "";
  if (materiaImmobiliare) {
    const tipoImmobile = primaCasa ? "PRIMA CASA" : "SECONDA CASA / ALTRO IMMOBILE";
    const aliquotaRegistro = primaCasa ? "2%" : "9%";
    notaioSection = `
MATERIA IMMOBILIARE - ${tipoImmobile}:
- L'accordo ha ad oggetto un trasferimento immobiliare
- Imposta di registro: ${aliquotaRegistro} sul valore (minimo EUR 1.000)
- In mediazione: esenzione registro fino a EUR 100.000 (art. 17, co. 3, D.Lgs. 28/2010) — si paga solo sull'eccedenza
- Imposta ipotecaria: EUR 50 (fissa)
- Imposta catastale: EUR 50 (fissa)
- E' NECESSARIO IL NOTAIO per l'autenticazione dell'accordo con effetti reali (art. 11 D.Lgs. 28/2010)
- Includere il costo del notaio (stimare in base alle tabelle CNN)
- In causa civile: registro 3% sulla sentenza, imposte ipotecaria/catastale piene`;
  }

  // Art. 31 co. 3 — Maggiorazione indennità
  let art31Section = "";
  if (mediatoreEsperto || proceduraComplessa) {
    const criteri: string[] = [];
    if (mediatoreEsperto) criteri.push("mediatore di esperienza e competenza designato su concorde indicazione delle parti (lett. a)");
    if (proceduraComplessa) criteri.push("complessità delle questioni, impegno richiesto al mediatore, numero degli incontri (lett. b)");
    art31Section = `
MAGGIORAZIONE ART. 31, CO. 3, D.M. 150/2023:
In caso di conciliazione in incontri successivi al primo, le spese possono essere maggiorate fino al 20% in presenza di almeno uno dei seguenti criteri:
- ${criteri.join("\n- ")}
Criteri selezionati: ${criteri.length}
DEVI APPLICARE una maggiorazione del +20% sull'indennità di mediazione (incontri successivi) nello Scenario A.
Questa maggiorazione si calcola SULL'INDENNITA' degli incontri successivi al primo, NON sulle spese di avvio.
La maggiorazione si applica UNA SOLA VOLTA anche se entrambi i criteri sono presenti (max +20%).`;
  }

  let gpSection = "";
  if (gratuitoPatrocinio) {
    gpSection = `
GRATUITO PATROCINIO ATTIVO (D.P.R. 115/2002, artt. 74-141):
La parte beneficia del patrocinio a spese dello Stato. Questo significa:
- IN MEDIAZIONE: indennità organismo = EUR 0 (a carico erario), compenso avvocato = EUR 0 (a carico erario), spese generali/CPA/IVA = EUR 0
  Restano a carico: imposte di registro (se dovute sull'eccedenza EUR 100.000), costi notarili (se materia immobiliare)
- IN CAUSA CIVILE: contributo unificato = prenotato a debito (EUR 0 per la parte), compenso avvocato = EUR 0 (a carico erario), CTU = prenotata a debito
  Resta a carico: imposta di registro sulla sentenza (3%)
- Credito d'imposta: NON applicabile (i costi sono già a carico dell'erario)
DEVI CALCOLARE I TOTALI TENENDO CONTO DI QUESTI AZZERAMENTI.`;
  }

  const esenzioneNote = `
ESENZIONE ART. 17 D.LGS. 28/2010 — SEMPRE PER ACCORDO POSITIVO:
- L'imposta di registro è ESENTE fino a EUR 100.000
- Per valori superiori a EUR 100.000 si paga SOLO sull'eccedenza (valore - 100.000)
- Esenzione imposta di bollo su tutti gli atti del procedimento
- Questa esenzione si applica SEMPRE in caso di accordo positivo in mediazione`;

  // Build tariff reference section
  let tariffSection = "";
  if (isGenova) {
    tariffSection = `
TARIFFARIO APPLICATO: COA GENOVA (Ordine degli Avvocati di Genova)
ATTENZIONE: NON usare le tariffe nazionali D.M. 150/2023. Usa ESCLUSIVAMENTE gli scaglioni COA Genova:
- Fino a EUR 1.000: spese avvio EUR 40, indennità EUR 110
- EUR 1.001-5.000: spese avvio EUR 80, indennità EUR 220
- EUR 5.001-10.000: spese avvio EUR 100, indennità EUR 260
- EUR 10.001-25.000: spese avvio EUR 120, indennità EUR 360
- EUR 25.001-50.000: spese avvio EUR 180, indennità EUR 520
- EUR 50.001-100.000: spese avvio EUR 220, indennità EUR 780
- EUR 100.001-250.000: spese avvio EUR 260, indennità EUR 1.560
- EUR 250.001-500.000: spese avvio EUR 300, indennità EUR 2.600
- Oltre EUR 500.000: spese avvio EUR 340, indennità EUR 3.900
Per mediazione obbligatoria/demandata: riduzione del 20% sull'indennità.
L'indennità Genova è un importo unico (non c'è distinzione primo incontro / successivi come nel D.M. 150/2023).`;
  } else {
    tariffSection = `
TARIFFARIO APPLICATO: NAZIONALE (D.M. 150/2023 — Tabella A)
Scaglioni tariffe nazionali:
- Fino a EUR 1.000: spese avvio EUR 40, indennità EUR 80
- EUR 1.001-5.000: spese avvio EUR 75, indennità EUR 160
- EUR 5.001-10.000: spese avvio EUR 75, indennità EUR 290
- EUR 10.001-25.000: spese avvio EUR 75, indennità EUR 440
- EUR 25.001-50.000: spese avvio EUR 75, indennità EUR 720
- EUR 50.001-150.000: spese avvio EUR 110, indennità EUR 1.200
- EUR 150.001-250.000: spese avvio EUR 110, indennità EUR 1.500
- EUR 250.001-500.000: spese avvio EUR 110, indennità EUR 2.500
- EUR 500.001-1.500.000: spese avvio EUR 110, indennità EUR 3.900
- EUR 1.500.001-2.500.000: spese avvio EUR 110, indennità EUR 4.600
- EUR 2.500.001-5.000.000: spese avvio EUR 110, indennità EUR 6.500
- Oltre EUR 5.000.000: spese avvio EUR 110, indennità EUR 10.000
Per mediazione obbligatoria/demandata: riduzione di 1/5 sull'indennità.
Struttura: spese avvio (art. 28 co. 4) + primo incontro (art. 28 co. 5: EUR 60/120/170) + incontri successivi (Tabella A).
Maggiorazione +25% per accordo, +10% per più parti, detrazione art. 34 co. 2.`;
  }

  const systemPrompt = `Sei un esperto di costi legali e fiscalità della mediazione civile e commerciale italiana.
Devi produrre una SEZIONE ECONOMICA COMPARATIVA dettagliata che confronti due scenari:
${tariffSection}

SCENARIO A: MEDIAZIONE POSITIVA (accordo raggiunto)
- Indennità organismo di mediazione ${isGenova ? "(tariffe COA Genova)" : "(D.M. 150/2023)"} per valore EUR ${valore.toLocaleString("it-IT")}
- Compenso avvocato (parametri forensi stragiudiziali D.M. 55/2014 agg. D.M. 147/2022)
- Spese generali 15%, CPA 4%, IVA 22%
${esenzioneNote}
- Credito d'imposta fino a EUR 600 sull'indennità + fino a EUR 600 sul compenso avvocato (se obbligatoria/demandata)
${materiaImmobiliare ? "- Costo notaio OBBLIGATORIO (autenticazione accordo con effetti reali)" : "- Costo notaio: non necessario (materia non immobiliare)"}
- Durata stimata: 1-3 mesi
${notaioSection}
${art31Section}
${gpSection}

SCENARIO B: PROCESSO CIVILE (mediazione negativa + contenzioso)
- Indennità mediazione negativa (solo primo incontro, ridotta)
- Contributo unificato (D.P.R. 115/2002, art. 13)
- Marca da bollo EUR 27 + diritti copia EUR 30
- Compenso avvocato (parametri forensi giudiziali D.M. 55/2014: studio + introduttiva + istruttoria + decisionale)
- Spese generali 15%, CPA 4%, IVA 22%
- Stima CTU (consulenza tecnica d'ufficio)
- Imposta di registro su sentenza: 3% del valore
- Nessuna esenzione art. 17
${materiaImmobiliare ? "- Costo notaio se trasferimento immobiliare\n- Imposte ipotecaria e catastale: dovute per intero" : ""}
- Durata stimata: 2-5 anni primo grado

FORMATO OUTPUT - usa tabelle markdown:
1. Tabella riepilogativa "Mediazione Positiva" con tutte le voci e totale
2. Tabella riepilogativa "Processo Civile" con tutte le voci e totale
3. Tabella comparativa finale con differenza e risparmio percentuale
4. Sezione "Vantaggi Fiscali della Mediazione" con elenco dettagliato art. 17
5. Sezione "Analisi Temporale" con stima durata e costi opportunità
${gratuitoPatrocinio ? '6. Sezione "Effetti del Gratuito Patrocinio" — dettaglio di quali voci sono azzerate e quali restano a carico' : ""}
${materiaImmobiliare ? `7. Sezione "Costi Notarili e Imposte Immobiliari" — dettaglio costi notaio e confronto imposte ${primaCasa ? "prima casa" : "seconda casa"}` : ""}
${!gratuitoPatrocinio && !materiaImmobiliare ? "6." : gratuitoPatrocinio && materiaImmobiliare ? "8." : "7."} Conclusioni con raccomandazione economica

IMPORTANTE:
- Usa trattini (-) per gli elenchi, MAI emoji
- Usa tabelle markdown standard con |
- Tutti gli importi in EUR con separatore migliaia
- Sii preciso nei calcoli, usa gli scaglioni normativi corretti del tariffario indicato sopra
- TARIFFARIO SELEZIONATO: ${isGenova ? "COA GENOVA" : "NAZIONALE D.M. 150/2023"} — usa SOLO questi scaglioni per l'indennità
- Considera che il tipo di analisi è: ${tipoAnalisi}
- Il valore della lite è: EUR ${valore.toLocaleString("it-IT")}
${gratuitoPatrocinio ? "- ATTENZIONE: il gratuito patrocinio è ATTIVO — azzera indennità, compenso avvocato e accessori per la parte. Calcola di conseguenza." : ""}
${materiaImmobiliare ? `- ATTENZIONE: materia immobiliare — includi SEMPRE il costo del notaio e le imposte di trasferimento (${primaCasa ? "prima casa — registro 2%" : "seconda casa — registro 9%"})` : ""}
${mediatoreEsperto || proceduraComplessa ? "- ATTENZIONE: maggiorazione art. 31 co. 3 ATTIVA — applica +20% sull'indennità degli incontri successivi nella tabella Mediazione Positiva. Evidenzia la voce come riga separata nella tabella." : ""}`;

  const userPrompt = `Caso: ${descrizione}
Parti: ${parti.map(p => `${p.nome} (${p.ruolo})`).join(", ")}
Valore della lite: EUR ${valore.toLocaleString("it-IT")}
Tipo: ${tipoAnalisi === "mediazione" ? "Mediazione civile e commerciale" : "Negoziazione assistita"}
Tariffario: ${isGenova ? "COA Genova (tariffe locali)" : "Nazionale (D.M. 150/2023)"}
${materiaImmobiliare ? `Materia: IMMOBILIARE — ${primaCasa ? "Prima casa" : "Seconda casa / altro immobile"}` : "Materia: NON immobiliare"}
${gratuitoPatrocinio ? "Gratuito patrocinio: ATTIVO" : "Gratuito patrocinio: NON attivo"}
${mediatoreEsperto || proceduraComplessa ? `Maggiorazione art. 31 co. 3: ATTIVA (${[mediatoreEsperto && "mediatore esperto", proceduraComplessa && "procedura complessa"].filter(Boolean).join(" + ")}) — +20% sull'indennità` : "Maggiorazione art. 31 co. 3: NON attiva"}

Contesto dall'analisi precedente:
${previousAnalysis}

Genera la sezione economica comparativa completa con calcoli precisi.`;

  return callLLM(systemPrompt, userPrompt, 8000);
}
