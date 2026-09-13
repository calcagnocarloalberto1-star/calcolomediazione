// PRIV-17 — test automatici del protocollo tecnico a due fasi (fase 1:
// preflight, fase 2: consumo del token). Copre i test di accettazione della
// specifica che riguardano la logica server (docs/PRIV-17-presidi-rafforzati-
// minori-ai.md, sezione "Test di accettazione"): i punti relativi
// all'interfaccia utente, all'accessibilita' e alla documentazione legale
// restano fuori dall'ambito di questo file, non essendo automatizzabili qui.

import assert from "node:assert/strict";
import express from "express";
import { readFileSync } from "node:fs";
import {
  registerMinorsPreflightRoute,
  registerMinorsPreflightGates,
  MINORS_NOTICE_VERSION,
  MINORS_CONFIRMATION_COUNT,
} from "./minors-preflight.js";
import { rilevaPossibiliRiferimentiMinori } from "./minors-detection.js";

const previousFlags = {
  CASE_AI_ENABLED: process.env.CASE_AI_ENABLED,
  CASE_AI_GDPR_APPROVED: process.env.CASE_AI_GDPR_APPROVED,
  MINORS_AI_PATH_ENABLED: process.env.MINORS_AI_PATH_ENABLED,
};
process.env.CASE_AI_ENABLED = "true";
process.env.CASE_AI_GDPR_APPROVED = "true";
delete process.env.MINORS_AI_PATH_ENABLED;

const app = express();
registerMinorsPreflightRoute(app);
registerMinorsPreflightGates(app);
app.use(express.json());
const seen: string[] = [];
for (const path of ["/api/upload-pdf", "/api/analisi", "/api/analisi/1/chat"]) {
  app.post(path, (req, res) => {
    seen.push(path);
    res.json({ ok: true, minorsStatus: (req as any).minorsStatus });
  });
}

const server = app.listen(0);
const address = server.address();
assert.ok(address && typeof address === "object");
const base = `http://127.0.0.1:${(address as any).port}`;

function flowId(): string {
  return "f".repeat(2) + Math.random().toString(36).slice(2).padEnd(20, "0");
}

async function preflight(headers: Record<string, string>) {
  const res = await fetch(`${base}/api/analisi/minori-preflight`, { method: "POST", headers });
  return { status: res.status, body: await res.json() };
}

async function callProtected(path: string, token: string | undefined, fid: string) {
  const headers: Record<string, string> = { "x-case-flow-id": fid, "content-type": "application/json" };
  if (token) headers["x-minors-preflight-token"] = token;
  const res = await fetch(`${base}${path}`, { method: "POST", headers, body: "{}" });
  return { status: res.status, body: await res.json() };
}

try {
  // 1. Assenza di containsMinors → richiesta bloccata prima del parser (nessun handler chiamato).
  {
    const fid = flowId();
    const r = await preflight({ "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    assert.equal(r.status, 422);
    assert.equal(r.body.code, "MINORS_STATUS_INVALID");
  }

  // Versione avviso disallineata → bloccato.
  {
    const fid = flowId();
    const r = await preflight({ "x-minors-status": "no", "x-notice-version": "vecchia", "x-case-flow-id": fid });
    assert.equal(r.status, 422);
    assert.equal(r.body.code, "MINORS_NOTICE_STALE");
  }

  // 2/3. "unknown"/"yes" con percorso rafforzato non abilitato → bloccato (MINORS_AI_PATH_ENABLED assente).
  for (const status of ["unknown", "yes"]) {
    const fid = flowId();
    const r = await preflight({ "x-minors-status": status, "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    assert.equal(r.status, 503, `status=${status}`);
    assert.equal(r.body.code, "MINORS_PATH_DISABLED");
  }

  // 4. "yes" con una conferma mancante, anche a percorso abilitato → bloccato.
  process.env.MINORS_AI_PATH_ENABLED = "true";
  {
    const fid = flowId();
    const confermeIncomplete = Array(MINORS_CONFIRMATION_COUNT).fill("1");
    confermeIncomplete[3] = "0";
    const r = await preflight({
      "x-minors-status": "yes",
      "x-notice-version": MINORS_NOTICE_VERSION,
      "x-case-flow-id": fid,
      "x-minors-confirmations": confermeIncomplete.join(","),
    });
    assert.equal(r.status, 422);
    assert.equal(r.body.code, "MINORS_CONFIRMATIONS_MISSING");
  }

  // "yes" con tutte le conferme → emette un token valido.
  let tokenYes: string;
  {
    const fid = flowId();
    const r = await preflight({
      "x-minors-status": "yes",
      "x-notice-version": MINORS_NOTICE_VERSION,
      "x-case-flow-id": fid,
      "x-minors-confirmations": Array(MINORS_CONFIRMATION_COUNT).fill("1").join(","),
    });
    assert.equal(r.status, 200);
    assert.ok(typeof r.body.token === "string" && r.body.token.length > 10);
    tokenYes = r.body.token;
    const call = await callProtected("/api/analisi", tokenYes, fid);
    assert.equal(call.status, 200, JSON.stringify(call.body));
    assert.equal(call.body.minorsStatus, "yes");

    // 8. Doppio utilizzo dello stesso token → solo la prima richiesta lo consuma.
    const second = await callProtected("/api/analisi", tokenYes, fid);
    assert.equal(second.status, 422);
    assert.equal(second.body.code, "MINORS_PREFLIGHT_REQUIRED");
  }
  delete process.env.MINORS_AI_PATH_ENABLED;

  // "no" non richiede conferme ed emette comunque un token.
  {
    const fid = flowId();
    const r = await preflight({ "x-minors-status": "no", "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    assert.equal(r.status, 200);
    const call = await callProtected("/api/analisi", r.body.token, fid);
    assert.equal(call.status, 200);
    assert.equal(call.body.minorsStatus, "no");
  }

  // 6/7. Token assente, o legato a un altro flowId (sessione diversa) → bloccato prima del parser.
  {
    const fid = flowId();
    const r = await preflight({ "x-minors-status": "no", "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    assert.equal(r.status, 200);
    const senzaToken = await callProtected("/api/analisi", undefined, fid);
    assert.equal(senzaToken.status, 422);
    assert.equal(senzaToken.body.code, "MINORS_PREFLIGHT_REQUIRED");

    const altroFlow = await callProtected("/api/analisi", r.body.token, flowId());
    assert.equal(altroFlow.status, 422);
    assert.equal(altroFlow.body.code, "MINORS_PREFLIGHT_REQUIRED");
  }

  // Le tre rotte protette (upload-pdf, analisi, chat) richiedono tutte il token.
  for (const path of ["/api/upload-pdf", "/api/analisi", "/api/analisi/1/chat"]) {
    const fid = flowId();
    const r = await preflight({ "x-minors-status": "no", "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    const call = await callProtected(path, r.body.token, fid);
    assert.equal(call.status, 200, `${path}: ${JSON.stringify(call.body)}`);
  }
  assert.deepEqual(new Set(seen), new Set(["/api/upload-pdf", "/api/analisi", "/api/analisi/1/chat"]));

  // Il gate generale CASE_AI resta sovraordinato: se disabilitato, anche il preflight si blocca.
  {
    delete (process.env as any).CASE_AI_ENABLED;
    const fid = flowId();
    const r = await preflight({ "x-minors-status": "no", "x-notice-version": MINORS_NOTICE_VERSION, "x-case-flow-id": fid });
    assert.equal(r.status, 503);
    assert.equal(r.body.code, "CASE_AI_DISABLED");
    process.env.CASE_AI_ENABLED = "true";
  }
} finally {
  await new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  for (const [name, value] of Object.entries(previousFlags)) {
    if (value === undefined) delete (process.env as any)[name];
    else process.env[name] = value;
  }
}

// Rilevamento euristico (fase 2, dopo il parsing) — test di accettazione n.9.
{
  assert.equal(rilevaPossibiliRiferimentiMinori("Il contratto ha una durata di 20 anni.").rischio, false);
  assert.equal(rilevaPossibiliRiferimentiMinori("Il mutuo trentennale e la causa prescritta dopo 15 anni.").rischio, false);
  assert.equal(rilevaPossibiliRiferimentiMinori("Nessun riferimento particolare in questo testo.").rischio, false);
  assert.equal(rilevaPossibiliRiferimentiMinori("Il figlio minorenne delle parti frequenta la scuola elementare.").rischio, true);
  assert.equal(rilevaPossibiliRiferimentiMinori("La bambina ha 9 anni e vive con la madre.").rischio, true);
  assert.equal(rilevaPossibiliRiferimentiMinori(`Il minore è nato il 3 marzo ${new Date().getFullYear() - 5}.`).rischio, true);
  assert.equal(rilevaPossibiliRiferimentiMinori("Nessun indizio", null, undefined, "ma qui si parla di affidamento dei figli").rischio, true);
}

// Verifica statica: i gate PRIV-17 devono essere montati prima dei parser globali.
{
  const indexSource = readFileSync("server/index.ts", "utf8");
  assert.ok(
    indexSource.indexOf("registerMinorsPreflightGates(app)") < indexSource.indexOf("express.json({"),
    "Il gate di preflight minori deve essere montato prima di express.json",
  );
  assert.ok(
    indexSource.indexOf("registerMinorsPreflightRoute(app)") < indexSource.indexOf("express.json({"),
    "L'endpoint di preflight minori deve essere montato prima di express.json",
  );
}

console.log("PRIV-17 minors preflight tests passed");
