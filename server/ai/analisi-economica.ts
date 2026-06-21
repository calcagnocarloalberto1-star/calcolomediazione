import { callLLM } from "./llm.js";
import { calcolaIndennita, formatEuro } from "../../shared/calcolo-indennita.js";
import {
  confrontaNotarile,
  renderNotarileMarkdown,
  type TipologiaCatastale,
  type RegimeFiscale,
} from "./notarile.js";

// ─── CONTRIBUTO UNIFICATO — D.P.R. 115/2002, art. 13 ─────────────────────
function calcolaContributoUnificato(valore: number): number {
  if (valore <= 1100) return 43;
  if (valore <= 5200) return 98;
  if (valore <= 26000) return 237;
  if (valore <= 52000) return 518;
  if (valore <= 260000) return 759;
  if (valore <= 520000) return 1214;
  return 1686;
}

// ─── COMPENSO AVVOCATO — D.M. 55/2014 valori medi ────────────────────────
// Tabella 2 (primo grado), Tabella 12 (appello), Tabella 13 (cassazione)
function calcolaCompensoPrimoGrado(valore: number): number {
  if (valore <= 1100) return 800;
  if (valore <= 5200) return 1800;
  if (valore <= 26000) return 3800;
  if (valore <= 52000) return 6500;
  if (valore <= 260000) return 11000;
  if (valore <= 520000) return 16500;
  return 25000;
}

function calcolaCompensoAppello(valore: number): number {
  if (valore <= 1100) return 700;
  if (valore <= 5200) return 1500;
  if (valore <= 26000) return 3200;
  if (valore <= 52000) return 5500;
  if (valore <= 260000) return 9500;
  if (valore <= 520000) return 14000;
  return 21000;
}

function calcolaCompensoCassazione(valore: number): number {
  if (valore <= 1100) return 600;
  if (valore <= 5200) return 1300;
  if (valore <= 26000) return 2800;
  if (valore <= 52000) return 4800;
  if (valore <= 260000) return 8500;
  if (valore <= 520000) return 12500;
  return 19000;
}

function calcolaCompensoMediazione(valore: number): number {
  if (valore <= 1100) return 450;
  if (valore <= 5200) return 900;
  if (valore <= 26000) return 1800;
  if (valore <= 52000) return 3200;
  if (valore <= 260000) return 5500;
  if (valore <= 520000) return 8500;
  return 13000;
}

// ─── ACCESSORI (spese generali 15% + CPA 4% + IVA 22%) ───────────────────
function calcolaAccessori(compensoBase: number): number {
  const speseGenerali = compensoBase * 0.15;
  const imponibile = compensoBase + speseGenerali;
  const cpa = imponibile * 0.04;
  const iva = (imponibile + cpa) * 0.22;
  return Math.round(speseGenerali + cpa + iva);
}

// ─── STIMA CTU ────────────────────────────────────────────────────────────
function stimaCTU(valore: number): number {
  if (valore <= 26000) return 1500;
  if (valore <= 52000) return 2500;
  if (valore <= 260000) return 4000;
  if (valore <= 520000) return 6000;
  return 9000;
}

// ─── COSTI NOTARILI STIMATI ───────────────────────────────────────────────
function calcolaCostiNotarili({
  valoreImmobile,
  primaCasa,
  onorarioNotarileStimato,
  impostaRegistroAliquota,
  impostaIpotecaria,
  impostaCatastale,
  altreSpeseNotarili,
}: {
  valoreImmobile: number;
  primaCasa: boolean;
  onorarioNotarileStimato: number | null;
  impostaRegistroAliquota: number | null;
  impostaIpotecaria: number | null;
  impostaCatastale: number | null;
  altreSpeseNotarili: number | null;
}) {
  const aliquotaRegistro = impostaRegistroAliquota ?? (primaCasa ? 0.02 : 0.09);
  const registro = Math.round(valoreImmobile * aliquotaRegistro);
  const ipotecaria = impostaIpotecaria ?? 50;
  const catastale = impostaCatastale ?? 50;
  const onorario = onorarioNotarileStimato ?? 2500;
  const altreSpese = altreSpeseNotarili ?? 300;
  const imponibileNotaio = onorario + altreSpese;
  const ivaNotaio = Math.round(imponibileNotaio * 0.22);
  const totale = registro + ipotecaria + catastale + onorario + altreSpese + ivaNotaio;

  return {
    registro,
    ipotecaria,
    catastale,
    onorario,
    altreSpese,
    ivaNotaio,
    totale,
  };
}

export async function analisiEconomica(
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  valoreLite: number | null,
  tipoAnalisi: string,
  previousAnalysis: string,
  opzioniEconomiche: {
    materiaImmobiliare: boolean;
    primaCasa: boolean;
    renditaCatastale: number | null;
    categoriaCatastale: string | null;
    gratuitoPatrocinio: boolean;
    mediatoreEsperto: boolean;
    proceduraComplessa: boolean;
    modalitaTariffaria: string;
    attivaCalcoloCostiNotarili?: boolean;
    tipoAttoNotarile?: string | null;
    valoreImmobile?: number | null;
    applicaPrezzoValore?: boolean;
    venditoreImpresaIva?: boolean;
    onorarioNotarileStimato?: number | null;
    impostaRegistroAliquota?: number | null;
    impostaIpotecaria?: number | null;
    impostaCatastale?: number | null;
    altreSpeseNotarili?: number | null;
  } = {
    materiaImmobiliare: false,
    primaCasa: false,
    renditaCatastale: null,
    categoriaCatastale: null,
    gratuitoPatrocinio: false,
    mediatoreEsperto: false,
    proceduraComplessa: false,
    modalitaTariffaria: "nazionale",
    attivaCalcoloCostiNotarili: false,
    tipoAttoNotarile: "trasferimento_immobiliare",
    valoreImmobile: null,
    applicaPrezzoValore: false,
    venditoreImpresaIva: false,
    onorarioNotarileStimato: null,
    impostaRegistroAliquota: null,
    impostaIpotecaria: null,
    impostaCatastale: null,
    altreSpeseNotarili: null,
  }
): Promise<string> {
  const valore = valoreLite || 25000;
  const {
    materiaImmobiliare,
    primaCasa,
    renditaCatastale,
    categoriaCatastale,
    gratuitoPatrocinio,
    mediatoreEsperto,
    proceduraComplessa,
    modalitaTariffaria,
    attivaCalcoloCostiNotarili = false,
    tipoAttoNotarile = "trasferimento_immobiliare",
    valoreImmobile = null,
    applicaPrezzoValore = false,
    venditoreImpresaIva = false,
    onorarioNotarileStimato = null,
    impostaRegistroAliquota = null,
    impostaIpotecaria = null,
    impostaCatastale = null,
    altreSpeseNotarili = null,
  } = opzioniEconomiche;

  const isGenova = modalitaTariffaria === "coa_genova";

  // ─── CALCOLO DETERMINISTICO MEDIAZIONE ──────────────────────────────────
  const resultAccordoPrimo = calcolaIndennita({
    valoreLite: valore,
    tipoMediazione: "obbligatoria",
    esito: "accordo_primo",
    tipoValore: "determinato",
    modalitaTariffaria: isGenova ? "coa_genova" : "nazionale",
    mediatoreEsperto: false,
    proceduraComplessa: false,
  });

  const resultAccordoSuccessivi = calcolaIndennita({
    valoreLite: valore,
    tipoMediazione: "obbligatoria",
    esito: "accordo_successivi",
    tipoValore: "determinato",
    modalitaTariffaria: isGenova ? "coa_genova" : "nazionale",
    mediatoreEsperto,
    proceduraComplessa,
  });

  const resultNegativo = calcolaIndennita({
    valoreLite: valore,
    tipoMediazione: "obbligatoria",
    esito: "nessuno_primo",
    tipoValore: "determinato",
    modalitaTariffaria: isGenova ? "coa_genova" : "nazionale",
  });

  const compensoAvvMed = calcolaCompensoMediazione(valore);
  const accessoriAvvMed = calcolaAccessori(compensoAvvMed);

  const esenzioneRegistro = Math.min(valore, 100000) * 0.03;

  const creditoIndennita = Math.min(resultAccordoSuccessivi.totalePerParte * 0.5, 600);
  const creditoAvvocato = Math.min(compensoAvvMed * 0.5, 600);
  const creditoTotale = creditoIndennita + creditoAvvocato;

  // ─── CALCOLO DETERMINISTICO PROCESSO ────────────────────────────────────
  const cu1 = calcolaContributoUnificato(valore);
  const cu2 = Math.round(cu1 * 1.5);
  const cu3 = cu1 * 2;

  const avv1 = calcolaCompensoPrimoGrado(valore);
  const acc1 = calcolaAccessori(avv1);
  const avv2 = calcolaCompensoAppello(valore);
  const acc2 = calcolaAccessori(avv2);
  const avv3 = calcolaCompensoCassazione(valore);
  const acc3 = calcolaAccessori(avv3);

  const ctu1 = stimaCTU(valore);
  const ctu2 = ctu1;
  const registro1 = Math.round(valore * 0.03);

  const altreCosts1 = 27 + 30;
  const altreCosts2 = 27;
  const altreCosts3 = 27;

  const tot1 = cu1 + avv1 + acc1 + ctu1 + registro1 + altreCosts1 + resultNegativo.totalePerParte;
  const tot2 = cu2 + avv2 + acc2 + ctu2 + altreCosts2;
  const tot3 = cu3 + avv3 + acc3 + altreCosts3;

  const cumul1 = tot1;
  const cumul2 = tot1 + tot2;
  const cumul3 = tot1 + tot2 + tot3;

  const totMed = resultAccordoSuccessivi.totalePerParte + compensoAvvMed + accessoriAvvMed;

  const costiNotarili = materiaImmobiliare && attivaCalcoloCostiNotarili
    ? calcolaCostiNotarili({
        valoreImmobile: valoreImmobile || valore,
        primaCasa,
        onorarioNotarileStimato,
        impostaRegistroAliquota,
        impostaIpotecaria,
        impostaCatastale,
        altreSpeseNotarili,
      })
    : null;

  // ─── CONFRONTO NOTARILE MEDIAZIONE vs SENTENZA ─────────────────────────
  // Motore avanzato basato su notarile.ts: usato quando l'utente attiva il
  // calcolo notarili E vuole prezzo-valore o acquisto da impresa con IVA.
  let confrontoNotarileMd = "";
  if (materiaImmobiliare && attivaCalcoloCostiNotarili) {
    const tipologia: TipologiaCatastale = primaCasa ? "prima_casa" : "seconda_casa";
    const regime: RegimeFiscale = primaCasa ? "prima_casa" : "seconda_casa";
    try {
      const confronto = confrontaNotarile({
        rendita_catastale: renditaCatastale ?? undefined,
        tipologia,
        prezzo: valoreImmobile ?? valore,
        prezzo_valore: applicaPrezzoValore,
        regime,
        venditoreImpresaIva,
      });
      confrontoNotarileMd = renderNotarileMarkdown({
        rendita_catastale: renditaCatastale ?? undefined,
        tipologia,
        prezzo: valoreImmobile ?? valore,
        prezzo_valore: applicaPrezzoValore,
        regime,
        venditoreImpresaIva,
      });
      // Aggiungiamo info di sintesi al log per debug; non blocca il flusso
      console.log(
        `[notarile] base=${confronto.base} mediazione=${confronto.con_mediazione.totale} sentenza=${confronto.con_sentenza.totale}`,
      );
    } catch (err) {
      console.error("Errore confronto notarile:", err);
    }
  }

  const totMedConNotarili = totMed + (costiNotarili?.totale || 0);
  const totMedNetto = gratuitoPatrocinio ? 0 : totMedConNotarili;

  const risparmio1 = cumul1 - totMedNetto;
  const risparmio2 = cumul2 - totMedNetto;
  const risparmio3 = cumul3 - totMedNetto;

  const risparmioPerc1 = cumul1 > 0 ? Math.round((risparmio1 / cumul1) * 100) : 0;
  const risparmioPerc2 = cumul2 > 0 ? Math.round((risparmio2 / cumul2) * 100) : 0;
  const risparmioPerc3 = cumul3 > 0 ? Math.round((risparmio3 / cumul3) * 100) : 0;

  // ─── VERIFICA CATASTALE ───────────────────────────────────────────────
  let catastaleSection = "";
  if (materiaImmobiliare && renditaCatastale && renditaCatastale > 0) {
    const moltiplicatori: Record<string, { label: string; mult: number }> = {
      prima_casa: { label: "Prima casa", mult: 115.5 },
      altri_fabbricati_ac: { label: "Altre abitazioni", mult: 126 },
      cat_b: { label: "Cat. B", mult: 176.4 },
      cat_a10_d: { label: "Uffici/D", mult: 63 },
      cat_c1_e: { label: "Negozi/E", mult: 42.84 },
      terreno_agricolo: { label: "Terreno agricolo", mult: 112.5 },
    };

    const cat =
      moltiplicatori[categoriaCatastale || "prima_casa"] || moltiplicatori.prima_casa;

    const renditaRivalutata = renditaCatastale * 1.05;
    const valoreCatastale = Math.round(renditaRivalutata * cat.mult * 100) / 100;
    const congruo = valore >= valoreCatastale;
    const scostamento =
      valoreCatastale > 0
        ? Math.round(((valore - valoreCatastale) / valoreCatastale) * 100)
        : 0;

    catastaleSection = `
VERIFICA CONGRUITA' CATASTALE (art. 29 D.M. 150/2023):
- Rendita catastale dichiarata: ${formatEuro(renditaCatastale)}
- Rendita rivalutata (+5%): ${formatEuro(renditaRivalutata)}
- Categoria: ${cat.label} — moltiplicatore ×${cat.mult}
- Valore catastale calcolato: ${formatEuro(valoreCatastale)}
- Valore della domanda: ${formatEuro(valore)}
- Scostamento: ${scostamento > 0 ? "+" : ""}${scostamento}%
- Esito: ${
      congruo
        ? "CONGRUO"
        : "NON CONGRUO — rischio accertamento Agenzia delle Entrate (artt. 51-52 D.P.R. 131/1986)"
    }`;
  }

  const systemPrompt = `Sei un esperto di costi legali e fiscalità della mediazione civile italiana.
Hai a disposizione i CALCOLI GIA' EFFETTUATI dal sistema. Il tuo compito è SOLO presentarli in modo professionale, commentarli e trarre conclusioni. NON ricalcolare nulla — usa esclusivamente i numeri forniti.`;

  const userPrompt = `Caso: ${descrizione}
Parti: ${parti.map((p) => `${p.nome} (${p.ruolo})`).join(", ")}
Valore della lite: ${formatEuro(valore)}
Tipo: ${tipoAnalisi === "mediazione" ? "Mediazione civile" : "Negoziazione assistita"}
Tariffario: ${isGenova ? "COA Genova" : "Nazionale D.M. 150/2023"}
${gratuitoPatrocinio ? "Gratuito patrocinio: ATTIVO (costi mediazione a carico erario)" : ""}
${materiaImmobiliare ? `Materia immobiliare: SI — ${primaCasa ? "prima casa (registro 2%)" : "seconda casa (registro 9%)"}` : ""}
${mediatoreEsperto || proceduraComplessa ? `Maggiorazione art. 31 co. 3: ATTIVA (+20%)` : ""}

═══════════════════════════════════════════════
DATI CALCOLATI DAL SISTEMA — USA SOLO QUESTI
═══════════════════════════════════════════════

SCENARIO A — MEDIAZIONE POSITIVA (accordo successivi al primo incontro):
- Spese avvio organismo: ${formatEuro(resultAccordoSuccessivi.speseAvvio)}
- Indennità primo incontro: ${formatEuro(resultAccordoSuccessivi.spesePrimoIncontro)}
- Indennità incontri successivi (netta): ${formatEuro(resultAccordoSuccessivi.ulterioriSpese)}
${resultAccordoSuccessivi.maggiorazioneArt31 > 0 ? `- Maggiorazione art. 31 co. 3 (+20%): ${formatEuro(resultAccordoSuccessivi.maggiorazioneArt31)}` : ""}
- TOTALE INDENNITA' organismo (per parte): ${formatEuro(resultAccordoSuccessivi.totalePerParte)}
- IVA 22%: ${formatEuro(resultAccordoSuccessivi.iva)}
- Totale indennità con IVA: ${formatEuro(resultAccordoSuccessivi.totaleConIva)}
- Compenso avvocato mediazione (D.M. 147/2022, valori medi): ${formatEuro(compensoAvvMed)}
- Accessori avvocato (spese gen. 15% + CPA 4% + IVA 22%): ${formatEuro(accessoriAvvMed)}
- TOTALE MEDIAZIONE per parte: ${formatEuro(totMed)}
${costiNotarili ? `- TOTALE COSTI NOTARILI: ${formatEuro(costiNotarili.totale)}` : ""}
${costiNotarili ? `- TOTALE MEDIAZIONE + NOTAIO per parte: ${formatEuro(totMedConNotarili)}` : ""}
${gratuitoPatrocinio ? "- Con gratuito patrocinio: EUR 0,00 (a carico erario)" : ""}
- Esenzione imposta di registro (art. 17 D.Lgs. 28/2010): ${formatEuro(esenzioneRegistro)} (su ${formatEuro(Math.min(valore, 100000))})
- Credito d'imposta indennità (50%, max EUR 600): ${formatEuro(creditoIndennita)}
- Credito d'imposta avvocato (50%, max EUR 600): ${formatEuro(creditoAvvocato)}
- CREDITO D'IMPOSTA TOTALE: ${formatEuro(creditoTotale)}
${costiNotarili ? `
SEZIONE COSTI NOTARILI DELL'ACCORDO:
- Tipo atto notarile: ${tipoAttoNotarile}
- Base di calcolo immobile: ${formatEuro(valoreImmobile || valore)}
- Regime fiscale: ${primaCasa ? "prima casa" : "ordinario"}
- Prezzo-valore: ${applicaPrezzoValore ? "SI" : "NO"}
- Imposta di registro atto: ${formatEuro(costiNotarili.registro)}
- Imposta ipotecaria: ${formatEuro(costiNotarili.ipotecaria)}
- Imposta catastale: ${formatEuro(costiNotarili.catastale)}
- Onorario notarile stimato: ${formatEuro(costiNotarili.onorario)}
- Spese vive notarili: ${formatEuro(costiNotarili.altreSpese)}
- IVA su onorario e spese: ${formatEuro(costiNotarili.ivaNotaio)}
` : ""}
${confrontoNotarileMd ? `

CONFRONTO NOTARILE — Mediazione vs Sentenza (motore notarile.ts):
${confrontoNotarileMd}
` : ""}
${catastaleSection}

SCENARIO A-bis — MEDIAZIONE POSITIVA (accordo al primo incontro):
- Totale indennità organismo per parte: ${formatEuro(resultAccordoPrimo.totalePerParte)}
- Totale con IVA: ${formatEuro(resultAccordoPrimo.totaleConIva)}

SCENARIO B — PROCESSO CIVILE I GRADO:
- Mediazione negativa (primo incontro): ${formatEuro(resultNegativo.totalePerParte)}
- Contributo unificato: ${formatEuro(cu1)}
- Marca da bollo + diritti copia: ${formatEuro(altreCosts1)}
- Compenso avvocato I grado (D.M. 55/2014 Tab. 2, valori medi): ${formatEuro(avv1)}
- Accessori avvocato: ${formatEuro(acc1)}
- Stima CTU: ${formatEuro(ctu1)}
- Imposta di registro su sentenza (3%): ${formatEuro(registro1)}
- TOTALE I GRADO per parte: ${formatEuro(tot1)}
- Durata stimata: 2-5 anni

SCENARIO B-bis — APPELLO II GRADO:
- Contributo unificato maggiorato +50%: ${formatEuro(cu2)}
- Marca da bollo: ${formatEuro(altreCosts2)}
- Compenso avvocato appello (D.M. 55/2014 Tab. 12, valori medi): ${formatEuro(avv2)}
- Accessori avvocato: ${formatEuro(acc2)}
- Stima CTU appello (art. 356 c.p.c., ipotesi prudenziale): ${formatEuro(ctu2)}
- TOTALE II GRADO per parte: ${formatEuro(tot2)}
- Durata stimata: 2-3 anni

SCENARIO B-ter — CASSAZIONE III GRADO:
- Contributo unificato raddoppiato: ${formatEuro(cu3)}
- Marca da bollo: ${formatEuro(altreCosts3)}
- Compenso avvocato Cassazione (D.M. 55/2014 Tab. 13, NO istruttoria): ${formatEuro(avv3)}
- Accessori avvocato: ${formatEuro(acc3)}
- CTU: non prevista (giudizio di legittimità)
- TOTALE III GRADO per parte: ${formatEuro(tot3)}
- Durata stimata: 2-4 anni

RIEPILOGO CUMULATIVO:
- Mediazione positiva: ${formatEuro(totMedNetto)}
- Solo I grado: ${formatEuro(cumul1)} — risparmio con mediazione: ${formatEuro(risparmio1)} (${risparmioPerc1}%)
- I + II grado: ${formatEuro(cumul2)} — risparmio con mediazione: ${formatEuro(risparmio2)} (${risparmioPerc2}%)
- I + II + III grado: ${formatEuro(cumul3)} — risparmio con mediazione: ${formatEuro(risparmio3)} (${risparmioPerc3}%)
- Durata cumulativa tre gradi: 6-12 anni vs 1-3 mesi mediazione

Contesto dall'analisi precedente:
${previousAnalysis}

═══════════════════════════════════════════════
Presenta questi dati in formato markdown con:
1. Tabella "Mediazione Positiva" con tutte le voci
2. ${costiNotarili ? `Tabella "Costi Notarili dell'Accordo"` : `Breve nota sull'assenza di costi notarili applicabili`}
3. Tabella "Processo I Grado" con tutte le voci
4. Tabella "Appello II Grado" con tutte le voci
5. Tabella "Cassazione III Grado" con tutte le voci
6. Tabella comparativa finale cumulativa con risparmio percentuale
7. Sezione "Vantaggi Fiscali della Mediazione" (art. 17, credito imposta)
8. Sezione "Analisi Temporale"
${catastaleSection ? `9. Sezione "Verifica Congruità Catastale" con i dati forniti` : ""}
${gratuitoPatrocinio ? `10. Sezione "Effetti Gratuito Patrocinio"` : ""}
- Conclusioni con raccomandazione economica

USA ESCLUSIVAMENTE i numeri forniti sopra. Non ricalcolare nulla. Usa trattini (-) per gli elenchi, tabelle markdown standard.`;

  return callLLM(systemPrompt, userPrompt, 12000);
}
