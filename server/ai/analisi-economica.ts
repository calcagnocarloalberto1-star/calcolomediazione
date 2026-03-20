import { callLLM } from "./llm.js";

export async function analisiEconomica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  tipoAnalisi: string,
  previousAnalysis: string,
  opzioniEconomiche: { materiaImmobiliare: boolean; primaCasa: boolean; renditaCatastale: number | null; categoriaCatastale: string | null; gratuitoPatrocinio: boolean; mediatoreEsperto: boolean; proceduraComplessa: boolean; modalitaTariffaria: string } = { materiaImmobiliare: false, primaCasa: false, renditaCatastale: null, categoriaCatastale: null, gratuitoPatrocinio: false, mediatoreEsperto: false, proceduraComplessa: false, modalitaTariffaria: "nazionale" }
): Promise<string> {
  const valore = valoreLite || 25000;
  const { materiaImmobiliare, primaCasa, renditaCatastale, categoriaCatastale, gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa, modalitaTariffaria } = opzioniEconomiche;
  const isGenova = modalitaTariffaria === "coa_genova";

  // Build dynamic sections based on flags
  let notaioSection = "";
  if (materiaImmobiliare) {
    const tipoImmobile = primaCasa ? "PRIMA CASA" : "SECONDA CASA / ALTRO IMMOBILE";
    const aliquotaRegistro = primaCasa ? "2%" : "9%";
    const stimaNotaio = primaCasa
      ? "Onorari notarili RIDOTTI per agevolazione prima casa (circa 30% in meno rispetto a seconda casa). Stima: EUR 900 - 1.750 a seconda del valore"
      : "Onorari notarili ordinari (tariffe piene). Stima: EUR 1.300 - 2.500 a seconda del valore";
    notaioSection = `
MATERIA IMMOBILIARE - ${tipoImmobile}:
- L'accordo ha ad oggetto un trasferimento immobiliare
- Imposta di registro: ${aliquotaRegistro} sul valore catastale (minimo EUR 1.000)
- In mediazione: esenzione registro fino a EUR 100.000 (art. 17, co. 3, D.Lgs. 28/2010) — si paga solo sull'eccedenza
- Imposta ipotecaria: EUR 50 (fissa)
- Imposta catastale: EUR 50 (fissa)
- E' NECESSARIO IL NOTAIO per l'autenticazione dell'accordo con effetti reali (art. 11 D.Lgs. 28/2010)
- ${stimaNotaio}
${primaCasa ? "- VANTAGGIO PRIMA CASA: risparmio significativo sia sulle imposte di registro (2% vs 9%) sia sugli onorari notarili (~30% in meno). Evidenziare questo risparmio nella comparazione." : ""}
- In causa civile: registro 3% sulla sentenza, imposte ipotecaria/catastale piene, costi notarili ordinari`;

    // Add catastale verification if rendita was provided
    if (renditaCatastale && renditaCatastale > 0) {
      const moltiplicatori: Record<string, { label: string; mult: number }> = {
        prima_casa: { label: "Prima casa", mult: 115.5 },
        altri_fabbricati_ac: { label: "Altre abitazioni", mult: 126 },
        cat_b: { label: "Cat. B", mult: 176.4 },
        cat_a10_d: { label: "Uffici/D", mult: 63 },
        cat_c1_e: { label: "Negozi/E", mult: 42.84 },
        terreno_agricolo: { label: "Terreno agricolo", mult: 112.5 },
      };
      const cat = moltiplicatori[categoriaCatastale || "prima_casa"] || moltiplicatori.prima_casa;
      const valoreCatastale = Math.round(renditaCatastale * cat.mult * 100) / 100;
      const congruo = valore >= valoreCatastale;
      const scostamento = valoreCatastale > 0 ? Math.round(((valore - valoreCatastale) / valoreCatastale) * 100) : 0;

      notaioSection += `

VERIFICA CONGRUITA' CATASTALE (ART. 29 D.M. 150/2023):
- Rendita catastale: EUR ${renditaCatastale.toFixed(2)}
- Rendita rivalutata (+5%): EUR ${(renditaCatastale * 1.05).toFixed(2)}
- Categoria: ${cat.label} (moltiplicatore ${cat.mult})
- VALORE CATASTALE CALCOLATO: EUR ${valoreCatastale.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
- Valore domanda/accordo: EUR ${valore.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
- Scostamento: ${scostamento}%
- ESITO: ${congruo ? "CONGRUO — il valore della domanda è pari o superiore al valore catastale" : "NON CONGRUO — il valore è inferiore al catastale, rischio accertamento Agenzia delle Entrate (artt. 51-52 DPR 131/1986)"}
DEVI INCLUDERE questa verifica nell'analisi economica, con un paragrafo dedicato alla congruità del valore.`;
    }
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
${materiaImmobiliare ? (primaCasa ? "- Costo notaio OBBLIGATORIO (autenticazione accordo con effetti reali) — ONORARI RIDOTTI per agevolazione prima casa" : "- Costo notaio OBBLIGATORIO (autenticazione accordo con effetti reali) — onorari ordinari") : "- Costo notaio: non necessario (materia non immobiliare)"}
- Durata stimata: 1-3 mesi
${notaioSection}
${art31Section}
${gpSection}

SCENARIO B: PROCESSO CIVILE — PRIMO GRADO (mediazione negativa + contenzioso)
- Indennità mediazione negativa (solo primo incontro, ridotta)
- Contributo unificato (D.P.R. 115/2002, art. 13)
- Marca da bollo EUR 27 + diritti copia EUR 30
- Compenso avvocato (parametri forensi giudiziali D.M. 55/2014 Tabella 2: studio + introduttiva + istruttoria + decisionale)
- Spese generali 15%, CPA 4%, IVA 22%
- Stima CTU (consulenza tecnica d'ufficio)
- Imposta di registro su sentenza: 3% del valore
- Nessuna esenzione art. 17
${materiaImmobiliare ? "- Costo notaio se trasferimento immobiliare\n- Imposte ipotecaria e catastale: dovute per intero" : ""}
- Durata stimata: 2-5 anni primo grado

SCENARIO B-bis: APPELLO — II GRADO (Corte d'Appello)
Se la parte soccombente impugna la sentenza di primo grado:
- Contributo unificato MAGGIORATO DEL 50% rispetto al primo grado (art. 13 D.P.R. 115/2002)
- Marca da bollo EUR 27
- Compenso avvocato: parametri forensi D.M. 55/2014 agg. D.M. 147/2022 — TABELLA 12 (Appello): fase studio + introduttiva + istruttoria + decisionale
- Spese generali 15%, CPA 4%, IVA 22%
- Stima CTU: eventuale rinnovo o nuova CTU in appello (art. 356 c.p.c.) — stimare gli stessi importi del primo grado come ipotesi prudenziale
- Durata stimata: 2-3 anni

SCENARIO B-ter: CASSAZIONE — III GRADO (Corte di Cassazione)
Se la sentenza d'appello viene impugnata:
- Contributo unificato RADDOPPIATO rispetto al primo grado (art. 13 D.P.R. 115/2002)
- Marca da bollo EUR 27
- Compenso avvocato: parametri forensi D.M. 55/2014 agg. D.M. 147/2022 — TABELLA 13 (Cassazione): fase studio + introduttiva + decisionale (NON C'E' FASE ISTRUTTORIA in Cassazione)
- Spese generali 15%, CPA 4%, IVA 22%
- CTU: NON prevista (la Cassazione è giudizio di legittimità, non di merito)
- Durata stimata: 2-4 anni
- Durata complessiva tre gradi: 6-12 anni

FORMATO OUTPUT - usa tabelle markdown:
1. Tabella riepilogativa "Mediazione Positiva" con tutte le voci e totale
2. Tabella riepilogativa "Processo Civile — I Grado" con tutte le voci e totale
3. Tabella riepilogativa "Appello — II Grado" con CU maggiorato, compenso avvocato Tab. 12, accessori e totale
4. Tabella riepilogativa "Cassazione — III Grado" con CU raddoppiato, compenso avvocato Tab. 13 (no istruttoria), accessori e totale
5. Tabella comparativa finale progressiva: Mediazione vs I grado vs I+II grado vs I+II+III grado (cumulativi) con risparmio percentuale
6. Sezione "Vantaggi Fiscali della Mediazione" con elenco dettagliato art. 17
7. Sezione "Analisi Temporale" con stima durata per ciascun grado e cumulativa vs mediazione
${gratuitoPatrocinio ? '8. Sezione "Effetti del Gratuito Patrocinio" — dettaglio di quali voci sono azzerate e quali restano a carico per tutti e tre i gradi' : ""}
${materiaImmobiliare ? `${gratuitoPatrocinio ? "9" : "8"}. Sezione "Costi Notarili e Imposte Immobiliari" — dettaglio costi notaio e confronto imposte ${primaCasa ? "prima casa" : "seconda casa"}` : ""}
${!gratuitoPatrocinio && !materiaImmobiliare ? "8." : gratuitoPatrocinio && materiaImmobiliare ? "10." : "9."} Conclusioni con raccomandazione economica — evidenziare il risparmio complessivo considerando tutti e tre i gradi di giudizio

IMPORTANTE:
- Usa trattini (-) per gli elenchi, MAI emoji
- Usa tabelle markdown standard con |
- Tutti gli importi in EUR con separatore migliaia
- Sii preciso nei calcoli, usa gli scaglioni normativi corretti del tariffario indicato sopra
- TARIFFARIO SELEZIONATO: ${isGenova ? "COA GENOVA" : "NAZIONALE D.M. 150/2023"} — usa SOLO questi scaglioni per l'indennità
- Considera che il tipo di analisi è: ${tipoAnalisi}
- Il valore della lite è: EUR ${valore.toLocaleString("it-IT")}
${gratuitoPatrocinio ? "- ATTENZIONE: il gratuito patrocinio è ATTIVO — azzera indennità, compenso avvocato e accessori per la parte. Calcola di conseguenza." : ""}
${materiaImmobiliare ? `- ATTENZIONE: materia immobiliare — includi SEMPRE il costo del notaio e le imposte di trasferimento (${primaCasa ? "PRIMA CASA — registro 2% + onorari notarili ridotti ~30%" : "seconda casa — registro 9% + onorari notarili ordinari"})` : ""}
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

  return callLLM(systemPrompt, userPrompt, 12000);
}
