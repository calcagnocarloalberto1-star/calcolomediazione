import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { storage } from "./storage.js";
import { estrazioneEntita } from "./ai/ner-extraction.js";
import { analisiGiuridica } from "./ai/analisi-giuridica.js";
import { guidaStrategica } from "./ai/guida-strategica.js";
import { analisiMaanBatna } from "./ai/maan-batna.js";
import { compatibilitaInteressi } from "./ai/compatibilita-interessi.js";
import { controlloBiasCognitivi } from "./ai/controllo-cognitivo.js";
import { bozzaAccordo } from "./ai/bozza-accordo.js";
import { analisiEconomica } from "./ai/analisi-economica.js";
import { callLLM, estraiDocumentoAI, cercaGiurisprudenzaAI } from "./ai/llm.js";
import { generateAnalisiPdf } from "./pdf-export.js";
import { stats } from "./stats.js";
import { registerClientErrorRoute } from "./client-errors.js";
import { sentenze, ORGANI_GIUDIZIARI } from "../client/src/data/giurisprudenza-db.js";
import { generaSlugSentenza, trovaSentenzaPerSlug, urlSentenza } from "../shared/sentenza-slug.js";
import { buildSentenzaHtml, buildGiurisprudenzaSitemap } from "./sentenza-bot-html.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ─── SEO: PAGINE E METADATI ────────────────────────────────────────────────
const PRIMARY_URL = "https://calcolomediazione.it";

const PAGES = [
  { path: "/", title: "CalcoloMediazione — Calcolatore Indennità Mediazione Civile, Analisi AI e Confronto Costi", desc: "Piattaforma gratuita per avvocati e mediatori: calcolatore indennità D.M. 150/2023, analisi AI del caso, confronto costi mediazione vs processo su tre gradi di giudizio, stima costi notarili, credito d'imposta, generatore procura.", priority: "1.0", changefreq: "weekly" },
  { path: "/calcolatore", title: "Calcolatore Indennità Mediazione D.M. 150/2023 — Tariffe Nazionali e COA Genova", desc: "Calcola le indennità di mediazione civile secondo il D.M. 150/2023: tariffe nazionali Tabella A e regolamento COA Genova. Spese di avvio, riduzioni art. 28, maggiorazioni art. 31, agevolazioni fiscali art. 17 D.Lgs. 28/2010.", priority: "0.9", changefreq: "monthly" },
  { path: "/analisi-caso-ai", title: "Analisi AI del Caso di Mediazione con Confronto Economico", desc: "Analisi completa del caso di mediazione con intelligenza artificiale: analisi giuridica, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico primo grado, appello e cassazione con stima CTU, verifica congruità valore catastale.", priority: "0.9", changefreq: "monthly" },
  { path: "/confronto-costi", title: "Confronto Costi Mediazione vs Processo: Primo Grado, Appello, Cassazione", desc: "Confronta i costi della mediazione con quelli del processo su tre gradi di giudizio. Contributo unificato, compensi avvocato, CTU in appello, parametri forensi D.M. 55/2014 Tabelle 2, 12 e 13.", priority: "0.9", changefreq: "monthly" },
  { path: "/costi-notarili", title: "Calcola Costi Notarili Mediazione · CalcoloMediazione", desc: "Calcola i costi notarili per accordo di mediazione o sentenza: onorari, imposta di registro, ipotecaria, catastale e IVA. Esenzione art. 17 D.Lgs. 28/2010.", priority: "0.8", changefreq: "monthly" },
  { path: "/faq", title: "FAQ Mediazione Civile — Domande Frequenti D.M. 150/2023 e D.Lgs. 28/2010", desc: "Le risposte alle domande più frequenti sulla mediazione civile: indennità, primo incontro, materie obbligatorie, agevolazioni fiscali art. 17, credito d'imposta, art. 5-quater (mediazione demandata).", priority: "0.7", changefreq: "monthly" },
  { path: "/guida-dm-150", title: "Guida Completa D.M. 150/2023 - Tariffe Mediazione", desc: "Guida dettagliata al Decreto Ministeriale 150/2023 sulle tariffe di mediazione civile e commerciale. Tabelle, calcoli ed esempi pratici.", priority: "0.7", changefreq: "monthly" },
  { path: "/generatore-procura", title: "Generatore Procura Speciale per Mediazione", desc: "Genera la procura speciale per la mediazione civile con tutti i poteri necessari. Conforme al D.Lgs. 28/2010.", priority: "0.8", changefreq: "monthly" },
  { path: "/giurisprudenza", title: "Giurisprudenza Mediazione - Database Sentenze", desc: "Database di giurisprudenza sulla mediazione civile e commerciale. Sentenze di Cassazione, Tribunali e Corti d'Appello con ricerca avanzata.", priority: "0.7", changefreq: "weekly" },
  { path: "/credito-imposta", title: "Credito d'Imposta e Gratuito Patrocinio in Mediazione", desc: "Guida completa al credito d'imposta per la mediazione civile (D.M. 1° agosto 2023) e al gratuito patrocinio. Requisiti, importi e procedura.", priority: "0.7", changefreq: "monthly" },
  { path: "/strategie-negoziazione", title: "Strategie di Negoziazione per la Mediazione Civile", desc: "Guida alle principali strategie e tecniche di negoziazione nella mediazione civile: MAAN/BATNA, negoziazione integrativa, zone of possible agreement, ancoraggio e tecniche di comunicazione.", priority: "0.7", changefreq: "monthly" },
  { path: "/glossario", title: "Glossario della Mediazione Civile", desc: "Glossario completo dei termini utilizzati nella mediazione civile e commerciale. Definizioni chiare e riferimenti normativi.", priority: "0.5", changefreq: "monthly" },
  { path: "/chi-siamo", title: "Chi Siamo - CalcoloMediazione", desc: "Scopri il team dietro CalcoloMediazione, la piattaforma professionale per mediatori civili e commerciali.", priority: "0.4", changefreq: "yearly" },
  { path: "/contatti", title: "Contatti - CalcoloMediazione", desc: "Contatta il team di CalcoloMediazione per informazioni, supporto tecnico e collaborazioni.", priority: "0.4", changefreq: "yearly" },
];

function getSiteUrl(req: any): string {
  const host = req.hostname || req.headers.host?.split(':')[0] || 'calcolomediazione.it';
  if (host.includes('calcolomediazione.org')) return 'https://calcolomediazione.org';
  if (host.includes('calcolomediazione.it')) return 'https://calcolomediazione.it';
  return PRIMARY_URL;
}

// ─── BOT DETECTION & DYNAMIC RENDERING ────────────────────────────────────
const BOT_UA_REGEX = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|linkedinbot|twitterbot|whatsapp|telegrambot|applebot|semrushbot|ahrefsbot|mj12bot|screaming.frog/i;

function isBot(userAgent: string): boolean {
  return BOT_UA_REGEX.test(userAgent);
}

const PAGE_CONTENT: Record<string, string> = {
  "/": `
    <h1>CalcoloMediazione - Calcolatore Indennità Mediazione Civile</h1>
    <p>Piattaforma professionale gratuita per la mediazione civile ai sensi del D.M. 150/2023. Analisi AI del caso, confronto economico su tre gradi di giudizio, calcolatore indennità e generatore documenti.</p>
    <h2>Strumenti disponibili</h2>
    <ul>
      <li><a href="/calcolatore">Calcolatore Indennità Mediazione D.M. 150/2023</a> - Calcola spese di avvio, indennità, compensi avvocato, costi notarili con esenzione prima casa</li>
      <li><a href="/analisi-caso-ai">Analisi AI del Caso di Mediazione</a> - Analisi giuridica completa, MAAN/BATNA, bias cognitivi, bozza accordo, confronto economico</li>
      <li><a href="/confronto-costi">Confronto Costi Mediazione vs Processo</a> - Primo grado, appello e cassazione con stima CTU e parametri forensi D.M. 55/2014</li>
      <li><a href="/generatore-procura">Generatore Procura Speciale per Mediazione</a> - Conforme al D.Lgs. 28/2010</li>
      <li><a href="/giurisprudenza">Database Giurisprudenza Mediazione</a> - Sentenze di Cassazione, Tribunali e Corti d'Appello</li>
      <li><a href="/credito-imposta">Credito d'Imposta e Gratuito Patrocinio</a> - Art. 20 D.Lgs. 28/2010</li>
      <li><a href="/strategie-negoziazione">Strategie di Negoziazione</a> - MAAN/BATNA, negoziazione integrativa, ZOPA</li>
    </ul>
    <h2>Caratteristiche principali</h2>
    <ul>
      <li>Conforme al D.M. 150/2023 - Tariffe mediazione civile e commerciale</li>
      <li>Confronto costi su tre gradi di giudizio: primo grado, appello e cassazione</li>
      <li>Stima CTU in appello (art. 356 c.p.c.)</li>
      <li>Esenzione prima casa per costi notarili</li>
      <li>Verifica congruità valore catastale (art. 29 D.M. 150/2023)</li>
      <li>Credito d'imposta fino a 1.118 euro per procedura</li>
      <li>Gratuito patrocinio in mediazione (artt. 15-bis/15-undecies D.Lgs. 28/2010)</li>
      <li>100% gratuito per avvocati e mediatori</li>
    </ul>
    <h2>Guide e Risorse</h2>
    <ul>
      <li><a href="/faq">Domande Frequenti sulla Mediazione Civile</a></li>
      <li><a href="/guida-dm-150">Guida Completa al D.M. 150/2023</a></li>
      <li><a href="/glossario">Glossario della Mediazione Civile</a></li>
    </ul>
    <h2>Hub Olismo Integrato - Approfondimenti professionali</h2>
    <p>Due hub specialistici a cura dell'avv. Carlo Alberto Calcagno: norma, procedura e persona nello stesso spazio.</p>
    <ul>
      <li><a href="https://olismo-integrato.it/mediazione-civile.html" rel="noopener external">Mediazione Civile e Commerciale (Olismo Integrato)</a> - D.Lgs. 28/2010 + Riforma Cartabia, matrice strumenti per condominio, banche, responsabilita medica, societa e successioni</li>
      <li><a href="https://olismo-integrato.it/mediazione-familiare.html" rel="noopener external">Mediazione Familiare Sistemica (Olismo Integrato)</a> - separazione, divorzio, accordi genitoriali, art. 473-bis.10 c.p.c., Convenzione di Istanbul</li>
    </ul>`,

  "/costi-notarili": `
    <h1>Costi Notarili: Stima e Confronto Mediazione vs Sentenza</h1>
    <p>Calcolatore gratuito dei costi notarili per accordo di mediazione o sentenza: onorari notarili, imposta di registro, ipotecaria, catastale, IVA e cassa. Confronto strutturato con esenzione art. 17 D.Lgs. 28/2010 e agevolazioni prima casa.</p>
    <h2>Calcolo costi notarili: cosa include</h2>
    <ul>
      <li>Onorari notarili parametrici (D.M. 140/2012, L. 89/1913)</li>
      <li>IVA 22% e cassa nazionale del notariato 4%</li>
      <li>Visure ipotecarie e catastali</li>
      <li>Imposte indirette: registro, ipotecaria, catastale (D.P.R. 131/1986)</li>
      <li>Onorari forensi D.M. 55/2014 per assistenza in mediazione</li>
    </ul>
    <h2>Esenzione art. 17 D.Lgs. 28/2010</h2>
    <p>L'accordo di mediazione che dispone trasferimenti immobiliari beneficia dell'esenzione dall'imposta di registro entro il limite di 100.000 euro di valore, oltre a esenzione da bollo e tasse ipocatastali in misura fissa. La normativa rappresenta uno dei vantaggi economici più rilevanti rispetto alla sentenza, che sconta sempre le imposte ordinarie del D.P.R. 131/1986.</p>
    <h2>Prima casa: agevolazioni e requisiti</h2>
    <p>L'acquisto della prima abitazione (non di lusso, categorie catastali A/2-A/7) gode di imposta di registro al 2% (anziché 9%) e imposte ipotecaria/catastale in misura fissa di 50 euro ciascuna. Il calcolatore applica automaticamente le agevolazioni se l'immobile soddisfa i requisiti della Nota II-bis art. 1 della Tariffa, Parte Prima, D.P.R. 131/1986.</p>
    <h2>Confronto mediazione vs sentenza</h2>
    <p>A parità di valore immobiliare, l'accordo di mediazione consente un risparmio fino al 90% sulle imposte indirette grazie al combinato disposto dell'art. 17 D.Lgs. 28/2010 e delle agevolazioni prima casa. La sentenza non beneficia di alcuna esenzione equivalente e sconta sempre l'imposta di registro proporzionale ordinaria.</p>
    <h2>Riferimenti normativi</h2>
    <p>D.M. 140/2012 (parametri notarili), L. 89/1913 (Legge Notarile), D.P.R. 131/1986 (Testo Unico imposta di registro), art. 17 D.Lgs. 28/2010 (esenzioni fiscali in mediazione), D.M. 55/2014 (parametri forensi), Nota II-bis Tariffa allegata al D.P.R. 131/1986 (prima casa).</p>`,

  "/calcolatore": `
    <h1>Calcolatore Indennità Mediazione D.M. 150/2023</h1>
    <p>Calcola le indennità di mediazione civile e commerciale secondo le tariffe del Decreto Ministeriale 150/2023. Strumento gratuito per avvocati e mediatori.</p>
    <h2>Cosa calcola</h2>
    <ul>
      <li>Spese di avvio della procedura di mediazione</li>
      <li>Indennità di mediazione per scaglioni di valore</li>
      <li>Compenso dell'avvocato in mediazione (D.M. 147/2022)</li>
      <li>Costi notarili per trascrizione con esenzione prima casa</li>
      <li>Verifica congruità valore catastale (art. 29 D.M. 150/2023)</li>
      <li>Doppia tariffa per mediazioni senza accordo</li>
      <li>Credito d'imposta fino a 1.118 euro (art. 20 D.Lgs. 28/2010)</li>
      <li>Gratuito patrocinio (artt. 15-bis/15-undecies D.Lgs. 28/2010)</li>
    </ul>
    <h2>Riferimenti normativi</h2>
    <p>Conforme al D.M. 150/2023, D.M. 147/2022, D.M. 55/2014, D.Lgs. 28/2010 come modificato dalla Riforma Cartabia (D.Lgs. 149/2022).</p>`,

  "/analisi-caso-ai": `
    <h1>Analisi AI del Caso di Mediazione</h1>
    <p>Analisi completa del caso di mediazione con intelligenza artificiale: dalla estrazione delle entità all'analisi giuridica, dal MAAN/BATNA alla bozza di accordo.</p>
    <h2>Fasi dell'analisi</h2>
    <ul>
      <li>Estrazione entità (NER): parti, fatti, valore della lite, materia</li>
      <li>Analisi giuridica: inquadramento normativo, giurisprudenza rilevante</li>
      <li>Guida strategica: tecniche di mediazione, gestione del caucus</li>
      <li>Analisi MAAN/BATNA: alternative disponibili, zona di possibile accordo (ZOPA)</li>
      <li>Compatibilità degli interessi: interessi sottostanti alle posizioni</li>
      <li>Controllo bias cognitivi: ancoraggio, avversione alla perdita, overconfidence</li>
      <li>Bozza di accordo: schema di accordo in mediazione</li>
      <li>Analisi economica comparativa: mediazione vs causa su tre gradi di giudizio</li>
    </ul>
    <h2>Esportazione PDF</h2>
    <p>L'analisi completa può essere esportata in formato PDF professionale, con possibilità di anonimizzazione delle parti.</p>`,

  "/confronto-costi": `
    <h1>Confronto Costi Mediazione vs Processo Civile</h1>
    <p>Confronta i costi della mediazione con quelli del processo civile su tre gradi di giudizio: primo grado, appello e Cassazione.</p>
    <h2>Cosa include il confronto</h2>
    <ul>
      <li>Primo grado: contributo unificato, compenso avvocato (D.M. 55/2014 Tabella 2), eventuale CTU</li>
      <li>Appello: contributo unificato maggiorato, compenso avvocato (D.M. 55/2014 Tabella 12), CTU in appello (art. 356 c.p.c.)</li>
      <li>Cassazione: contributo unificato, compenso avvocato (D.M. 55/2014 Tabella 13)</li>
      <li>Mediazione: indennità D.M. 150/2023, compenso avvocato D.M. 147/2022, durata stimata</li>
      <li>Risparmio stimato scegliendo la mediazione</li>
    </ul>`,

  "/faq": `
    <h1>FAQ - Domande Frequenti sulla Mediazione Civile</h1>
    <p>Risposte alle domande più frequenti sulla mediazione civile e commerciale, le indennità, i costi e le agevolazioni fiscali.</p>
    <h2>Argomenti trattati</h2>
    <ul>
      <li>Come si calcola l'indennità di mediazione secondo il D.M. 150/2023</li>
      <li>Quali materie sono soggette a mediazione obbligatoria</li>
      <li>Come funziona il credito d'imposta per la mediazione</li>
      <li>Cos'è il gratuito patrocinio in mediazione</li>
      <li>Come si calcola l'esenzione prima casa nei costi notarili</li>
      <li>Cos'è la verifica di congruità del valore catastale (art. 29 D.M. 150/2023)</li>
      <li>Differenza tra mediazione e negoziazione assistita</li>
    </ul>`,

  "/guida-dm-150": `
    <h1>Guida Completa al D.M. 150/2023 - Tariffe Mediazione</h1>
    <p>Guida dettagliata al Decreto Ministeriale 150 del 2023 sulle tariffe di mediazione civile e commerciale. Scaglioni, calcoli ed esempi pratici.</p>
    <h2>Contenuto della guida</h2>
    <ul>
      <li>Struttura delle tariffe per scaglioni di valore della controversia</li>
      <li>Spese di avvio della procedura</li>
      <li>Indennità per procedura con e senza accordo</li>
      <li>Verifica congruità del valore catastale (art. 29)</li>
      <li>Tariffe per organismi con sede a Genova (riduzione 20%)</li>
      <li>IVA e oneri accessori</li>
      <li>Confronto con le tariffe previgenti (D.M. 180/2010)</li>
    </ul>`,

  "/generatore-procura": `
    <h1>Generatore Procura Speciale per Mediazione</h1>
    <p>Genera la procura speciale per la mediazione civile con tutti i poteri necessari ai sensi dell'art. 8 del D.Lgs. 28/2010 come modificato dalla Riforma Cartabia.</p>
    <h2>Caratteristiche della procura</h2>
    <ul>
      <li>Conforme all'art. 8 D.Lgs. 28/2010 (poteri speciali per il mandatario)</li>
      <li>Personalizzazione delle parti e della materia</li>
      <li>Inclusione dei poteri minimi richiesti dalla legge</li>
      <li>Esportazione in formato Word e PDF</li>
      <li>Istruzioni per la firma e l'autenticazione</li>
    </ul>`,

  "/giurisprudenza": `
    <h1>Giurisprudenza sulla Mediazione Civile</h1>
    <p>Database di sentenze sulla mediazione civile e commerciale. Cassazione, Tribunali e Corti d'Appello con ricerca avanzata per materia, anno e organo giudicante.</p>
    <h2>Temi principali</h2>
    <ul>
      <li>Improcedibilità per mancato esperimento della mediazione obbligatoria</li>
      <li>Sanzioni per mancata partecipazione (art. 8 D.Lgs. 28/2010)</li>
      <li>Validità dell'accordo di mediazione</li>
      <li>Riservatezza del procedimento di mediazione</li>
      <li>Mediazione delegata dal giudice</li>
      <li>Materie soggette a mediazione obbligatoria dopo la Riforma Cartabia</li>
    </ul>`,

  "/credito-imposta": `
    <h1>Credito d'Imposta e Gratuito Patrocinio in Mediazione</h1>
    <p>Guida completa al credito d'imposta per chi aderisce alla mediazione civile (D.M. 1 agosto 2023) e al gratuito patrocinio in mediazione (artt. 15-bis/15-undecies D.Lgs. 28/2010).</p>
    <h2>Credito d'imposta</h2>
    <ul>
      <li>Importo massimo: 1.118 euro per procedura</li>
      <li>Requisiti: mediazione conclusa con accordo</li>
      <li>Come richiedere il credito all'Agenzia delle Entrate</li>
      <li>Base imponibile: indennità di mediazione e compenso avvocato</li>
    </ul>
    <h2>Gratuito patrocinio</h2>
    <ul>
      <li>Requisiti reddituali (soglia ISEE)</li>
      <li>Materie ammesse in mediazione</li>
      <li>Come fare domanda al Consiglio dell'Ordine</li>
    </ul>`,

  "/strategie-negoziazione": `
    <h1>Strategie di Negoziazione per la Mediazione Civile</h1>
    <p>Guida alle principali strategie e tecniche di negoziazione nella mediazione civile. Dalla teoria dei giochi alle tecniche di comunicazione avanzata.</p>
    <h2>Tecniche trattate</h2>
    <ul>
      <li>MAAN (Migliore Alternativa all'Accordo Negoziato) e BATNA</li>
      <li>ZOPA - Zona di Possibile Accordo</li>
      <li>Negoziazione integrativa (win-win)</li>
      <li>Ancoraggio e gestione della prima offerta</li>
      <li>Tecnica del caucus (sessioni separate)</li>
      <li>Gestione dei bias cognitivi in negoziazione</li>
      <li>Comunicazione non verbale e ascolto attivo</li>
    </ul>`,

  "/glossario": `
    <h1>Glossario della Mediazione Civile</h1>
    <p>Definizioni chiare e riferimenti normativi di tutti i termini tecnici utilizzati nella mediazione civile e commerciale italiana.</p>
    <h2>Termini principali</h2>
    <ul>
      <li>Mediazione, conciliazione, arbitrato: differenze</li>
      <li>MAAN/BATNA, ZOPA, ancoraggio</li>
      <li>Organismo di mediazione, mediatore professionista</li>
      <li>Indennità, spese di avvio, onorario</li>
      <li>Mediazione obbligatoria, mediazione delegata, mediazione volontaria</li>
      <li>Accordo di mediazione, verbale, esecutività</li>
    </ul>`,

  "/chi-siamo": `
    <h1>Chi Siamo - CalcoloMediazione</h1>
    <p>CalcoloMediazione è una piattaforma professionale gratuita per mediatori e avvocati italiani, sviluppata da Carlo Alberto Calcagno, avvocato e mediatore professionista con sede a Genova.</p>
    <p>La piattaforma è conforme al D.M. 150/2023 e al D.Lgs. 28/2010 come modificato dalla Riforma Cartabia (D.Lgs. 149/2022).</p>`,

  "/contatti": `
    <h1>Contatti - CalcoloMediazione</h1>
    <p>Per informazioni, segnalazioni di errori o collaborazioni, contatta il team di CalcoloMediazione.</p>
    <p>Email: calcagnocarloalberto1@gmail.com</p>
    <p>Il sito è gestito da Carlo Alberto Calcagno, avvocato e mediatore, Genova.</p>`,
};

function buildBotHtml(page: { path: string; title: string; desc: string }, siteUrl: string): string {
  const canonical = `${siteUrl}${page.path === "/" ? "" : page.path}`;
  const content = PAGE_CONTENT[page.path] || `<h1>${page.title}</h1><p>${page.desc}</p>`;

  const jsonLd = page.path === "/" ? `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CalcoloMediazione",
    "url": "${siteUrl}",
    "description": "${page.desc}",
    "applicationCategory": "LegalApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
    "author": {
      "@type": "Person",
      "name": "Carlo Alberto Calcagno",
      "jobTitle": "Avvocato e Mediatore",
      "address": { "@type": "PostalAddress", "addressLocality": "Genova", "addressCountry": "IT" }
    }
  }
  </script>` : "";

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.desc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${siteUrl}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.desc}">
  ${jsonLd}
</head>
<body>
  <nav>
    <a href="/">CalcoloMediazione</a> |
    <a href="/calcolatore">Calcolatore</a> |
    <a href="/analisi-caso-ai">Analisi AI</a> |
    <a href="/confronto-costi">Confronto Costi</a> |
    <a href="/faq">FAQ</a> |
    <a href="/guida-dm-150">Guida D.M. 150/2023</a> |
    <a href="/giurisprudenza">Giurisprudenza</a>
  </nav>
  <main>${content}</main>
  <footer>
    <p>CalcoloMediazione - Piattaforma professionale per la mediazione civile</p>
    <p>Conforme al D.M. 150/2023 | D.Lgs. 28/2010 | Riforma Cartabia (D.Lgs. 149/2022)</p>
    <p><a href="${siteUrl}">${siteUrl}</a></p>
  </footer>
</body>
</html>`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── REDIRECT WWW → NON-WWW (301 permanente) ──────────────────────────────
  // Risolve "Pagina alternativa con tag canonical" in Google Search Console
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    if (host.startsWith("www.")) {
      const newUrl = `https://${host.replace(/^www\./, "")}${req.originalUrl}`;
      return res.redirect(301, newUrl);
    }
    next();
  });

  // ─── BOT MIDDLEWARE — deve stare PRIMA di tutto il resto ─────────────────
  app.use((req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBot(ua)) return next();

    const path = req.path;

    // Non intercettare API, file statici, sitemap, robots
    if (
      path.startsWith("/api/") ||
      path.includes(".") ||
      path === "/sitemap.xml" ||
      path === "/sitemap-giurisprudenza.xml" ||
      path === "/robots.txt"
    ) {
      return next();
    }

    const siteUrl = getSiteUrl(req);

    // ── Pagine dedicate sentenze: /giurisprudenza/<slug> ────────────────
    const sentenzaMatch = path.match(/^\/giurisprudenza\/([a-z0-9-]+)$/);
    if (sentenzaMatch) {
      const slug = sentenzaMatch[1];
      const html = buildSentenzaHtml(slug, siteUrl);
      if (html) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-Robots-Tag", "index, follow");
        return res.send(html);
      }
      // Slug ignoto: 404 esplicito con noindex
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, follow");
      return res.status(404).send(
        `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>Sentenza non trovata | CalcoloMediazione</title><meta name="robots" content="noindex, follow"></head><body><h1>Sentenza non trovata</h1><p><a href="/giurisprudenza">Torna al database giurisprudenza</a></p></body></html>`
      );
    }

    const page = PAGES.find(p => p.path === path) || {
      path,
      title: "CalcoloMediazione - Mediazione Civile",
      desc: "Piattaforma professionale per la mediazione civile e commerciale italiana.",
      priority: "0.5",
      changefreq: "monthly",
    };

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "index, follow");
    res.send(buildBotHtml(page, siteUrl));
  });

  // ─── TRACKING ─────────────────────────────────────────────────────────────
  app.post("/api/track", (req, res) => {
    const { path } = req.body;
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    stats.track('page_view', path, userAgent, ip);
    res.json({ ok: true });
  });

  // ─── CLIENT ERROR LOGGING ────────────────────────────────────────────────
  // Riceve eccezioni JS dal browser (window.onerror, unhandledrejection, ErrorBoundary)
  // e le inoltra a un Google Apps Script Web App (ERROR_LOG_WEBHOOK_URL).
  registerClientErrorRoute(app);

  // ─── ADMIN ────────────────────────────────────────────────────────────────
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CalcoloMediazione2026!";

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Password errata" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Non autorizzato" });
    }
    const token = auth.slice(7);
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      if (!decoded.startsWith("admin:")) {
        return res.status(401).json({ error: "Token non valido" });
      }
      res.json(stats.getStats());
    } catch {
      res.status(401).json({ error: "Token non valido" });
    }
  });

  // ─── ANALISI AI ───────────────────────────────────────────────────────────

  app.post("/api/upload-pdf", upload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nessun file caricato" });
      }
      const results: Array<{ filename: string; text: string; pages: number }> = [];
      for (const file of files) {
        try {
          const uint8 = new Uint8Array(file.buffer);
          const parser = new PDFParse(uint8);
          await parser.load();
          const textResult = await parser.getText();
          const info = await parser.getInfo();
          results.push({ filename: file.originalname, text: textResult.text || "", pages: info.total || 0 });
          parser.destroy();
        } catch (pdfErr) {
          console.error(`Errore parsing PDF ${file.originalname}:`, pdfErr);
          results.push({ filename: file.originalname, text: `[Errore nella lettura del file ${file.originalname}]`, pages: 0 });
        }
      }
      stats.track('upload_pdf');
      res.json({ files: results });
    } catch (error) {
      console.error("Errore upload PDF:", error);
      res.status(500).json({ error: "Errore nell'elaborazione dei file" });
    }
  });

  // ─── ESTRAZIONE AI DA IMMAGINE (tool antiriciclaggio, modalita' alta precisione) ─
  app.post("/api/aml-extract", upload.single("file"), async (req, res) => {
    try {
      const file = (req as any).file;
      const doctype = (req.body?.doctype || "id").toString();
      if (!file || !file.buffer) {
        return res.status(400).json({ error: "Nessun file ricevuto." });
      }
      const mediaType = (file.mimetype || "").toLowerCase();
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(mediaType)) {
        return res.status(400).json({ error: "Per la modalita' AI carica un'immagine (JPG, PNG o WEBP). Per i PDF usa l'estrazione locale." });
      }
      const base64 = file.buffer.toString("base64");
      const fields = await estraiDocumentoAI(base64, mediaType, doctype);
      res.json({ fields });
    } catch (e: any) {
      console.error("Errore /api/aml-extract:", e);
      res.status(500).json({ error: (e && e.message) ? e.message : "Errore durante l'estrazione AI." });
    }
  });

  // ─── RICERCA AI SULLA GIURISPRUDENZA (dati pubblici, nessun dato personale) ─
  app.post("/api/giurisprudenza/cerca-ai", async (req, res) => {
    try {
      const query = (req.body?.query || "").toString().trim();
      if (query.length < 5) {
        return res.status(400).json({ error: "Descrivi la questione in almeno qualche parola." });
      }
      const catalogo = sentenze.map(s =>
        `ID ${s.id} | ${s.organo} ${s.numero}/${s.anno} | ${s.categoria} | ${s.titolo} | temi: ${(s.temiChiave || []).join(", ")} | rif: ${(s.riferimentiNormativi || []).join(", ")} | massima: ${(s.massima || "").slice(0, 320)}`
      ).join("\n");
      const risultati = await cercaGiurisprudenzaAI(query, catalogo);
      const validi = risultati.filter(r => sentenze.some(s => s.id === r.id));
      res.json({ risultati: validi });
    } catch (e: any) {
      console.error("Errore /api/giurisprudenza/cerca-ai:", e);
      res.status(500).json({ error: (e && e.message) ? e.message : "Errore durante la ricerca AI." });
    }
  });

  app.post("/api/analisi", async (req, res) => {
    try {
      const {
        titolo, descrizione, tipoAnalisi, modalitaTariffaria, valoreLite, tipoValore, parti,
        teorieSelezionate, documentiText,
        materiaImmobiliare, primaCasa, renditaCatastale, categoriaCatastale,
        gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa,
        // Nuovi campi notarili
        attivaCalcoloCostiNotarili, tipoAttoNotarile, valoreImmobile,
        applicaPrezzoValore, venditoreImpresaIva,
        onorarioNotarileStimato, impostaRegistroAliquota, impostaIpotecaria,
        impostaCatastale, altreSpeseNotarili,
      } = req.body;
      if (!titolo || !descrizione) {
        return res.status(400).json({ error: "Titolo e descrizione sono obbligatori" });
      }
      const analisi = await storage.createAnalisi({
        titolo, descrizione,
        tipoAnalisi: tipoAnalisi || "mediazione",
        valoreLite: valoreLite || null,
        tipoValore: tipoValore || "determinato",
        parti: parti || [],
        stato: "in_corso",
        analisiGiuridica: null, guidaStrategica: null, analisiMaanBatna: null,
        compatibilitaInteressi: null, controlloBiasCognitivi: null, bozzaAccordo: null,
        analisiEconomica: null, prospettoEconomico: null, chatHistory: [],
      });
      stats.track('analisi_ai');
      runPipeline(
        analisi.id, descrizione, parti || [], tipoAnalisi || "mediazione", valoreLite,
        teorieSelezionate || ["ancoraggio", "avversione_perdita", "framing", "overconfidence", "sunk_cost", "availability", "teoria_giochi", "decision_analysis", "mcda", "teoria_prospetto"],
        documentiText || "",
        {
          materiaImmobiliare: materiaImmobiliare || false,
          primaCasa: primaCasa || false,
          renditaCatastale: renditaCatastale || null,
          categoriaCatastale: categoriaCatastale || null,
          gratuitoPatrocinio: gratuitoPatrocinio || false,
          mediatoreEsperto: mediatoreEsperto || false,
          proceduraComplessa: proceduraComplessa || false,
          modalitaTariffaria: modalitaTariffaria || "nazionale",
          // Nuovi campi notarili (motore costi notarili integrato)
          attivaCalcoloCostiNotarili: attivaCalcoloCostiNotarili || false,
          tipoAttoNotarile: tipoAttoNotarile || "trasferimento_immobiliare",
          valoreImmobile: valoreImmobile ?? valoreLite ?? null,
          applicaPrezzoValore: applicaPrezzoValore || false,
          venditoreImpresaIva: venditoreImpresaIva || false,
          onorarioNotarileStimato: onorarioNotarileStimato ?? null,
          impostaRegistroAliquota: impostaRegistroAliquota ?? null,
          impostaIpotecaria: impostaIpotecaria ?? null,
          impostaCatastale: impostaCatastale ?? null,
          altreSpeseNotarili: altreSpeseNotarili ?? null,
        }
      );
      res.json({ ...analisi, accessToken: (analisi as any).accessToken });
    } catch (error) {
      console.error("Errore creazione analisi:", error);
      res.status(500).json({ error: "Errore interno del server" });
    }
  });

  // GET /api/analisi — solo admin
  app.get("/api/analisi", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Non autorizzato" });
    }
    const token = auth.slice(7);
    try {
      const decoded = Buffer.from(token, "base64").toString();
      if (!decoded.startsWith("admin:")) {
        return res.status(401).json({ error: "Token non valido" });
      }
    } catch {
      return res.status(401).json({ error: "Token non valido" });
    }
    const analisi = await storage.getAllAnalisi();
    res.json(analisi);
  });

  // GET /api/analisi/:id — richiede X-Access-Token
  app.get("/api/analisi/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const accessToken = req.headers["x-access-token"] as string | undefined;
    if (!accessToken) {
      return res.status(401).json({ error: "Token di accesso mancante" });
    }
    const analisi = await storage.getAnalisi(id, accessToken);
    if (!analisi) {
      return res.status(404).json({ error: "Analisi non trovata o accesso non autorizzato" });
    }
    res.json(analisi);
  });

  // GET /api/analisi/:id/pdf — richiede X-Access-Token
  app.get("/api/analisi/:id/pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accessToken = req.headers["x-access-token"] as string | undefined;
      if (!accessToken) {
        return res.status(401).json({ error: "Token di accesso mancante" });
      }
      const analisi = await storage.getAnalisi(id, accessToken);
      if (!analisi) return res.status(404).json({ error: "Analisi non trovata" });
      if (analisi.stato !== "completata") return res.status(400).json({ error: "Analisi non ancora completata" });

      const shouldAnonymize = req.query.anonimizza === '1';
      let analisiForPdf = analisi;
      if (shouldAnonymize) {
        const partiList = (analisi.parti as Array<{ nome: string; ruolo: string }>) || [];
        const labels = ["Parte A", "Parte B", "Parte C", "Parte D", "Parte E", "Parte F"];
        const anonReplace = (text: string | null): string | null => {
          if (!text) return text;
          let result = text;
          partiList.forEach((p, i) => {
            if (p.nome && p.nome.trim()) {
              const nome = p.nome.trim();
              const label = labels[i] || `Parte ${String.fromCharCode(65 + i)}`;
              const regex = new RegExp(nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              result = result.replace(regex, label);
              const parts = nome.split(/\s+/);
              if (parts.length > 1) {
                const cognome = parts[parts.length - 1];
                if (cognome.length >= 3) {
                  const cognomeRegex = new RegExp(`\\b${cognome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                  result = result.replace(cognomeRegex, label);
                }
              }
            }
          });
          return result;
        };
        const anonParti = partiList.map((p, i) => ({ nome: labels[i] || `Parte ${String.fromCharCode(65 + i)}`, ruolo: p.ruolo }));
        analisiForPdf = {
          ...analisi,
          titolo: anonReplace(analisi.titolo) || analisi.titolo,
          descrizione: anonReplace(analisi.descrizione) || analisi.descrizione,
          parti: anonParti,
          prospettoEconomico: anonReplace(analisi.prospettoEconomico),
          analisiGiuridica: anonReplace(analisi.analisiGiuridica),
          guidaStrategica: anonReplace(analisi.guidaStrategica),
          analisiMaanBatna: anonReplace(analisi.analisiMaanBatna),
          compatibilitaInteressi: anonReplace(analisi.compatibilitaInteressi),
          controlloBiasCognitivi: anonReplace(analisi.controlloBiasCognitivi),
          bozzaAccordo: anonReplace(analisi.bozzaAccordo),
          analisiEconomica: anonReplace(analisi.analisiEconomica),
        };
      }

      const pdfBuffer = generateAnalisiPdf(analisiForPdf);
      const prefix = shouldAnonymize ? 'anonimo-' : '';
      const filename = `${prefix}analisi-${analisi.titolo.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.pdf`;
      stats.track('pdf_export');
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Errore generazione PDF:", error);
      res.status(500).json({ error: "Errore nella generazione del PDF" });
    }
  });

  app.delete("/api/analisi/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteAnalisi(id);
    if (!deleted) return res.status(404).json({ error: "Analisi non trovata" });
    res.json({ success: true });
  });

  app.post("/api/analisi/:id/chat", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { message } = req.body;
      const accessToken = req.headers["x-access-token"] as string | undefined;
      if (!accessToken) {
        return res.status(401).json({ error: "Token di accesso mancante" });
      }
      const analisi = await storage.getAnalisi(id, accessToken);
      if (!analisi) return res.status(404).json({ error: "Analisi non trovata o accesso non autorizzato" });

      const chatHistory = analisi.chatHistory || [];
      const context = [
        analisi.prospettoEconomico ? `Estrazione Entità (NER):\n${analisi.prospettoEconomico}` : "",
        analisi.analisiGiuridica ? `Analisi Giuridica:\n${analisi.analisiGiuridica}` : "",
        analisi.guidaStrategica ? `Guida Strategica:\n${analisi.guidaStrategica}` : "",
        analisi.analisiMaanBatna ? `MAAN/BATNA:\n${analisi.analisiMaanBatna}` : "",
        analisi.compatibilitaInteressi ? `Compatibilità Interessi:\n${analisi.compatibilitaInteressi}` : "",
        analisi.controlloBiasCognitivi ? `Bias Cognitivi:\n${analisi.controlloBiasCognitivi}` : "",
        analisi.bozzaAccordo ? `Bozza Accordo:\n${analisi.bozzaAccordo}` : "",
        analisi.analisiEconomica ? `Analisi Economica Comparativa:\n${analisi.analisiEconomica}` : "",
      ].filter(Boolean).join("\n\n---\n\n");

      const partiStr = (analisi.parti as Array<{nome: string; ruolo: string}>)?.map(p => `${p.nome} (${p.ruolo})`).join(", ") || "Non specificate";
      const systemPrompt = `Sei un assistente AI specializzato in mediazione civile e commerciale italiana. Hai già analizzato il seguente caso:\n\nTitolo: ${analisi.titolo}\nDescrizione: ${analisi.descrizione}\nParti: ${partiStr}\nValore della lite: ${analisi.valoreLite ? `EUR ${analisi.valoreLite}` : "Non specificato"}\nTipo analisi: ${analisi.tipoAnalisi}\n\nRisultati dell'analisi:\n${context}\n\nRispondi alle domande dell'utente sul caso, fornendo approfondimenti, chiarimenti e suggerimenti aggiuntivi. Usa un linguaggio professionale ma accessibile. Formatta le risposte in Markdown.`;
      const prevMessages = chatHistory.map((m: any) => `${m.role === "user" ? "Utente" : "AI"}: ${m.content}`).join("\n");
      const userPrompt = prevMessages ? `${prevMessages}\n\nUtente: ${message}` : message;
      const aiResponse = await callLLM(systemPrompt, userPrompt);

      const now = new Date().toISOString();
      chatHistory.push({ role: "user", content: message, timestamp: now });
      chatHistory.push({ role: "assistant", content: aiResponse, timestamp: now });
      stats.track('chat_message');
      await storage.updateAnalisi(id, { chatHistory });
      res.json({ response: aiResponse, chatHistory });
    } catch (error) {
      console.error("Errore chat:", error);
      res.status(500).json({ error: "Errore nella risposta AI" });
    }
  });

  // ─── CALCOLI ──────────────────────────────────────────────────────────────
  app.post("/api/calcolo", async (req, res) => {
    try {
      const calcolo = await storage.createCalcolo(req.body);
      stats.track('calcolo');
      res.json(calcolo);
    } catch (error) {
      console.error("Errore salvataggio calcolo:", error);
      res.status(500).json({ error: "Errore nel salvataggio" });
    }
  });

  app.get("/api/calcoli", async (_req, res) => {
    const calcoli = await storage.getAllCalcoli();
    res.json(calcoli);
  });

  // ─── SEO ENDPOINTS ────────────────────────────────────────────────────────

  app.get("/sitemap.xml", (req, res) => {
    const siteUrl = getSiteUrl(req);
    const today = new Date().toISOString().slice(0, 10);
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
    for (const page of PAGES) {
      const fullUrl = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
      xml += `  <url>\n`;
      xml += `    <loc>${fullUrl}</loc>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="it-IT" href="${fullUrl}"/>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    // Pagine istituzionali non incluse in PAGES
    for (const p of ["/privacy-policy", "/cookie-policy", "/termini-condizioni"]) {
      xml += `  <url>\n    <loc>${siteUrl}${p}</loc>\n    <changefreq>yearly</changefreq>\n    <priority>0.3</priority>\n  </url>\n`;
    }
    // Sezione statica esterna (calcolo assegni)
    xml += `  <url>\n    <loc>${siteUrl}/calcolo-assegni/</loc>\n    <xhtml:link rel="alternate" hreflang="it-IT" href="${siteUrl}/calcolo-assegni/"/>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    // Pagine dedicate sentenze (tutte le pronunce)
    for (const s of sentenze) {
      const url = `${siteUrl}${urlSentenza(s)}`;
      xml += `  <url>\n    <loc>${url}</loc>\n    <xhtml:link rel="alternate" hreflang="it-IT" href="${url}"/>\n    <lastmod>${today}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }
    xml += `</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  });

  // Sitemap dedicata giurisprudenza (per submit separato in GSC)
  app.get("/sitemap-giurisprudenza.xml", (req, res) => {
    const siteUrl = getSiteUrl(req);
    const xml = buildGiurisprudenzaSitemap(siteUrl);
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  });

  app.get("/googleb2392e1f3564a1be.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: googleb2392e1f3564a1be.html");
  });

  app.get("/og-image.svg", (_req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f0eb"/>
  <rect width="1200" height="8" fill="#c55a2b"/>
  <rect x="60" y="50" width="1080" height="530" fill="none" stroke="#2d2926" stroke-width="4"/>
  <text x="100" y="150" font-family="sans-serif" font-weight="bold" font-size="60" fill="#2d2926">CalcoloMediazione</text>
  <text x="100" y="215" font-family="sans-serif" font-weight="bold" font-size="34" fill="#c55a2b">Mediazione e Negoziazione con AI</text>
  <rect x="100" y="240" width="200" height="4" fill="#2d2926"/>
  <text font-family="sans-serif" font-size="24" fill="#2d2926">
    <tspan x="100" y="300">&#x2666; Analisi AI del caso</tspan>
    <tspan x="100" y="340">&#x2666; Confronto costi su 3 gradi</tspan>
    <tspan x="100" y="380">&#x2666; Calcolatore indennita</tspan>
    <tspan x="620" y="300">&#x2666; Generatore procura</tspan>
    <tspan x="620" y="340">&#x2666; Verifica congruita catastale</tspan>
    <tspan x="620" y="380">&#x2666; Credito d'imposta</tspan>
  </text>
  <rect x="100" y="420" width="1000" height="3" fill="#c55a2b"/>
  <text x="100" y="470" font-family="sans-serif" font-size="21" fill="#6b6560">D.M. 150/2023 - Primo Grado, Appello, Cassazione - CTU - Congruita Catastale</text>
  <text x="100" y="530" font-family="sans-serif" font-weight="bold" font-size="26" fill="#2d2926">calcolomediazione.it</text>
  <rect x="880" y="500" width="220" height="48" rx="0" fill="#c55a2b"/>
  <text x="905" y="532" font-family="sans-serif" font-weight="bold" font-size="24" fill="#ffffff">100% Gratuito</text>
</svg>`;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  });

  app.get("/robots.txt", (req, res) => {
    const siteUrl = getSiteUrl(req);
    const txt = `# robots.txt - ${siteUrl.replace("https://", "")}
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

# Bot AI / training: accesso consentito ai contenuti pubblici
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-giurisprudenza.xml
`;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(txt);
  });

  return httpServer;
}

// ─── PIPELINE AI ──────────────────────────────────────────────────────────
async function runPipeline(
  id: number,
  descrizione: string,
  parti: Array<{ nome: string; ruolo: string }>,
  tipoAnalisi: string,
  valoreLite: number | null,
  teorieSelezionate: string[],
  documentiText: string,
  opzioniEconomiche: {
    materiaImmobiliare: boolean; primaCasa: boolean;
    renditaCatastale: number | null; categoriaCatastale: string | null;
    gratuitoPatrocinio: boolean; mediatoreEsperto: boolean;
    proceduraComplessa: boolean; modalitaTariffaria: string;
    // Nuovi campi notarili
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
    materiaImmobiliare: false, primaCasa: false, renditaCatastale: null,
    categoriaCatastale: null, gratuitoPatrocinio: false, mediatoreEsperto: false,
    proceduraComplessa: false, modalitaTariffaria: "nazionale",
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
) {
  // Contesto passato agli step a valle. Claude Haiku 4.5 ha 200k token di
  // context, quindi possiamo permetterci budget ampi senza problemi.
  // Budget per step:
  //   - input singolo: 16000 caratteri (~4k token, era 8000)
  //   - input doppio (compatibilita, bozza): 8000 + 8000 (era 4000 + 4000)
  // Questo riduce drasticamente i casi in cui il contesto a valle perde
  // informazioni importanti dalle sezioni precedenti.
  const truncate = (text: string, max = 16000) =>
    text.length > max ? text.slice(0, max) + '\n\n[...troncato per brevita...]' : text;

  const safeStep = async <T>(stepFn: () => Promise<T>, fallback: T, stepName: string): Promise<T> => {
    try { return await stepFn(); }
    catch (err) { console.error(`Errore step ${stepName}:`, err); return fallback; }
  };

  try {
    // ─── LIVELLO 0: NER (radice, nessuna dipendenza) ──────────────────────
    const nerResult = await safeStep(
      () => estrazioneEntita(descrizione, parti, documentiText),
      '[Estrazione entita non disponibile]', 'NER'
    );
    await storage.updateAnalisi(id, { prospettoEconomico: nerResult });

    // ─── LIVELLO 1: Giuridica + Strategica (dipendono solo dal NER) ────────
    // Girano in parallelo: la Strategica non deve piu' aspettare la Giuridica.
    const [giuridicaResult, strategicaResult] = await Promise.all([
      safeStep(
        () => analisiGiuridica(descrizione, parti, truncate(nerResult), tipoAnalisi),
        '[Analisi giuridica non disponibile]', 'Giuridica'
      ),
      safeStep(
        () => guidaStrategica(descrizione, parti, truncate(nerResult)),
        '[Guida strategica non disponibile]', 'Strategica'
      ),
    ]);
    await storage.updateAnalisi(id, {
      analisiGiuridica: giuridicaResult,
      guidaStrategica: strategicaResult,
    });

    // ─── LIVELLO 2: MAAN + Bias + Economica (dipendono solo dalla Giuridica) ─
    // Tre chiamate in parallelo.
    const [maanResult, biasResult, economicaResult] = await Promise.all([
      safeStep(
        () => analisiMaanBatna(descrizione, parti, valoreLite, truncate(giuridicaResult)),
        '[Analisi MAAN/BATNA non disponibile]', 'MAAN/BATNA'
      ),
      safeStep(
        () => controlloBiasCognitivi(descrizione, parti, teorieSelezionate, truncate(giuridicaResult)),
        '[Controllo bias non disponibile]', 'Bias'
      ),
      safeStep(
        () => analisiEconomica(descrizione, parti, valoreLite, tipoAnalisi, truncate(giuridicaResult), opzioniEconomiche),
        '[Analisi economica non disponibile]', 'Economica'
      ),
    ]);
    await storage.updateAnalisi(id, {
      analisiMaanBatna: maanResult,
      controlloBiasCognitivi: biasResult,
      analisiEconomica: economicaResult,
    });

    // ─── LIVELLO 3: Compatibilita (dipende da Giuridica + MAAN) ────────────
    const compatibilitaResult = await safeStep(
      () => compatibilitaInteressi(descrizione, parti, `${truncate(giuridicaResult, 8000)}\n\n${truncate(maanResult, 8000)}`),
      '[Compatibilita interessi non disponibile]', 'Compatibilita'
    );
    await storage.updateAnalisi(id, { compatibilitaInteressi: compatibilitaResult });

    // ─── LIVELLO 4: Bozza accordo (dipende da Giuridica + Compatibilita) ───
    const bozzaResult = await safeStep(
      () => bozzaAccordo(descrizione, parti, valoreLite, `${truncate(giuridicaResult, 8000)}\n\n${truncate(compatibilitaResult, 8000)}`),
      '[Bozza accordo non disponibile]', 'Accordo'
    );
    await storage.updateAnalisi(id, { bozzaAccordo: bozzaResult, stato: "completata" });
    stats.track('analisi_complete');

  } catch (error) {
    console.error("Errore fatale pipeline AI:", error);
    stats.track('analisi_error');
    await storage.updateAnalisi(id, { stato: "errore" });
  }
}
