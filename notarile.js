/**
 * notarile.js — Motore di calcolo costi notarili e fiscali
 * CalcoloMediazione.it — modulo unico per Calcolatore Indennità + Analisi AI
 * Aggiornato: 2026-06
 *
 * FONTI:
 *  - Onorari notaio: liberalizzati dal DL 1/2012 -> valori SOLO ORIENTATIVI (parametri DM 140/2012)
 *  - Imposte: DPR 131/1986 (Registro), D.Lgs 347/1990 (ipo-catastali)
 *  - Prezzo-valore: L. 296/2006 art.1 c.497
 *  - Esenzione accordo di mediazione: art. 17 D.Lgs 28/2010
 *
 * ATTENZIONE: gli onorari sono stime di mercato, NON tariffe legali.
 * Le imposte sono dovute per legge.
 */

export const NOTARILE_CONFIG = {
  versione: "2026-06",

  coefficienti: {
    prima_casa: 115.5,
    seconda_casa: 126,
    terreni_non_edificabili: 112.5,
    fabbricati_C_A10: 63,
    fabbricati_D_E: 65.52
  },

  imposte_privato: {
    prima_casa: { registro_perc: 2, registro_min: 1000, ipotecaria: 50, catastale: 50 },
    seconda_casa: { registro_perc: 9, registro_min: 1000, ipotecaria: 50, catastale: 50 }
  },

  imposte_impresa_iva: {
    prima_casa: { iva_perc: 4, registro: 200, ipotecaria: 200, catastale: 200 },
    seconda_casa: { iva_perc: 10, registro: 200, ipotecaria: 200, catastale: 200 },
    lusso: { iva_perc: 22, registro: 200, ipotecaria: 200, catastale: 200 }
  },

  esenzione_mediazione: {
    registro_esente_fino_a: 100000,
    bollo_esente: true
  },

  onorario_stima: {
    scaglioni: [
      { fino_a: 100000, compenso: 1500 },
      { fino_a: 200000, compenso: 2000 },
      { fino_a: 300000, compenso: 2500 },
      { fino_a: 500000, compenso: 3200 },
      { fino_a: Infinity, compenso: 4000 }
    ],
    iva_perc: 22,
    cassa_perc: 4,
    visure_volture: 300
  }
};

export function calcolaBaseImponibile({ rendita_catastale, tipologia, prezzo, prezzo_valore }) {
  if (prezzo_valore && rendita_catastale) {
    const coeff = NOTARILE_CONFIG.coefficienti[tipologia] || 115.5;
    return Math.round(rendita_catastale * 1.05 * coeff);
  }
  return prezzo || 0;
}

export function onorarioStimato(base) {
  const sc = NOTARILE_CONFIG.onorario_stima.scaglioni.find(s => base <= s.fino_a);
  return sc ? sc.compenso : 4000;
}

export function calcolaCostiNotarili({
  base,
  regime = "prima_casa",
  venditoreImpresaIva = false,
  scenario = "con_mediazione"
}) {
  const cfg = NOTARILE_CONFIG;
  const out = { scenario, base, voci: {}, note: [] };

  if (venditoreImpresaIva) {
    const r = cfg.imposte_impresa_iva[regime] || cfg.imposte_impresa_iva.seconda_casa;
    out.voci.iva = Math.round(base * r.iva_perc / 100);
    out.voci.imposta_registro = r.registro;
    out.voci.imposta_ipotecaria = r.ipotecaria;
    out.voci.imposta_catastale = r.catastale;
    out.note.push("Acquisto da impresa: IVA + imposte fisse.");
  } else {
    const r = cfg.imposte_privato[regime] || cfg.imposte_privato.seconda_casa;
    let registro = Math.max(base * r.registro_perc / 100, r.registro_min);
    let bollo = 230;

    if (scenario === "con_mediazione") {
      const soglia = cfg.esenzione_mediazione.registro_esente_fino_a;
      if (base <= soglia) {
        registro = 0;
        out.note.push("Registro ESENTE (art. 17 D.Lgs 28/2010, entro 100.000 €).");
      } else {
        registro = (base - soglia) * r.registro_perc / 100;
        out.note.push("Registro dovuto solo sull'eccedenza oltre 100.000 € (art. 17 D.Lgs 28/2010).");
      }
      bollo = 0;
    }

    out.voci.imposta_registro = Math.round(registro);
    out.voci.imposta_bollo = Math.round(bollo);
    out.voci.imposta_ipotecaria = r.ipotecaria;
    out.voci.imposta_catastale = r.catastale;
  }

  if (scenario === "con_sentenza") {
    out.voci.onorario_notaio = 0;
    out.note.push("Sentenza ex art. 2932 c.c.: trascrizione diretta, nessun onorario notarile per il trasferimento.");
  } else {
    const onorario = onorarioStimato(base);
    out.voci.onorario_notaio = onorario;
    out.voci.iva_onorario = Math.round(onorario * cfg.onorario_stima.iva_perc / 100);
    out.voci.cassa_notarile = Math.round(onorario * cfg.onorario_stima.cassa_perc / 100);
    out.voci.visure_volture = cfg.onorario_stima.visure_volture;
    out.note.push("Onorario NON tariffato (liberalizzato DL 1/2012): stima orientativa.");
  }

  out.totale = Object.values(out.voci).reduce((a, b) => a + (Number(b) || 0), 0);
  return out;
}

export function confrontaNotarile(input) {
  const base = calcolaBaseImponibile(input);
  const conMediazione = calcolaCostiNotarili({ ...input, base, scenario: "con_mediazione" });
  const conSentenza = calcolaCostiNotarili({ ...input, base, scenario: "con_sentenza" });

  return {
    base,
    con_mediazione: conMediazione,
    con_sentenza: conSentenza,
    risparmio: conSentenza.totale - conMediazione.totale,
    disclaimer:
      "Onorari notarili liberalizzati (DL 1/2012): valori orientativi. " +
      "Imposte ex DPR 131/1986 e D.Lgs 347/1990. " +
      "Esenzione registro/bollo ex art. 17 D.Lgs 28/2010 nei limiti di legge. " +
      "Calcolo informativo, non sostituisce il preventivo del notaio."
  };
}

function fmtEuro(n) {
  return "€ " + Number(n || 0).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function renderNotarileCalcolatore(containerEl, input) {
  const r = confrontaNotarile(input);
  const m = r.con_mediazione.voci;
  const s = r.con_sentenza.voci;

  containerEl.innerHTML = `
    <h3>Costi Notarili e Fiscali — Art. 29 D.M. 150/2023</h3>
    <p>Base imponibile: <strong>${fmtEuro(r.base)}</strong></p>
    <table>
      <thead>
        <tr>
          <th>Voce</th>
          <th>Con accordo in mediazione</th>
          <th>Con sentenza del giudice</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Imposta di registro</td><td>${fmtEuro(m.imposta_registro || 0)}</td><td>${fmtEuro(s.imposta_registro || 
