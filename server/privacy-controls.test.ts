import assert from "node:assert/strict";
import express from "express";
import {
  isAmlAiEnabled,
  isCaseAiEnabled,
  registerPrivacyPreParserGates,
  requireAmlAiEnabled,
  requireCaseAiEnabled,
} from "./privacy-controls.js";
import { readFileSync } from "node:fs";

assert.equal(isAmlAiEnabled({}), false, "AML AI must be disabled when the flag is absent");
assert.equal(isAmlAiEnabled({ AML_AI_ENABLED: "false" }), false);
assert.equal(isAmlAiEnabled({ AML_AI_ENABLED: "TRUE" }), false);
assert.equal(isAmlAiEnabled({ AML_AI_ENABLED: "true" }), false);
assert.equal(isAmlAiEnabled({
  AML_AI_ENABLED: "true",
  AML_AI_GDPR_APPROVED: "true",
}), true);

assert.equal(isCaseAiEnabled({}), false, "Case AI must be disabled when the flags are absent");
assert.equal(isCaseAiEnabled({ CASE_AI_ENABLED: "true" }), false);
assert.equal(isCaseAiEnabled({
  CASE_AI_ENABLED: "true",
  CASE_AI_GDPR_APPROVED: "TRUE",
}), false);
assert.equal(isCaseAiEnabled({
  CASE_AI_ENABLED: "true",
  CASE_AI_GDPR_APPROVED: "true",
}), true);

const previousFlags = {
  AML_AI_ENABLED: process.env.AML_AI_ENABLED,
  AML_AI_GDPR_APPROVED: process.env.AML_AI_GDPR_APPROVED,
  CASE_AI_ENABLED: process.env.CASE_AI_ENABLED,
  CASE_AI_GDPR_APPROVED: process.env.CASE_AI_GDPR_APPROVED,
};
delete process.env.AML_AI_ENABLED;
delete process.env.AML_AI_GDPR_APPROVED;
delete process.env.CASE_AI_ENABLED;
delete process.env.CASE_AI_GDPR_APPROVED;

const app = express();
const downstreamCalls: string[] = [];
registerPrivacyPreParserGates(app);
app.use(express.json());
const parserSpy = (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  downstreamCalls.push("parser");
  next();
};
const handlerSpy = (_req: express.Request, res: express.Response) => {
  downstreamCalls.push("handler");
  res.json({ ok: true });
};

for (const path of ["/api/aml-extract", "/api/aml-assist"]) {
  app.post(path, requireAmlAiEnabled, parserSpy, handlerSpy);
}
for (const path of ["/api/upload-pdf", "/api/analisi", "/api/analisi/1/chat"]) {
  app.post(path, requireCaseAiEnabled, parserSpy, handlerSpy);
}
app.get("/api/analisi/:id", (_req, res) => res.json({ available: true }));
app.get("/api/analisi/:id/pdf", (_req, res) => res.json({ available: true }));
app.delete("/api/analisi/:id", (_req, res) => res.json({ available: true }));

const server = app.listen(0);
try {
  const address = server.address();
  assert.ok(address && typeof address === "object");
  for (const path of ["/api/aml-extract", "/api/aml-assist"]) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: "POST",
      body: "{malformed-json",
      headers: { "content-type": "application/json" },
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "AML_AI_DISABLED");
  }
  for (const path of ["/api/upload-pdf", "/api/analisi", "/api/analisi/1/chat"]) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: "POST",
      body: "{malformed-json",
      headers: { "content-type": "application/json" },
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "CASE_AI_DISABLED");
  }
  for (const [method, path] of [
    ["GET", "/api/analisi/1"],
    ["GET", "/api/analisi/1/pdf"],
    ["DELETE", "/api/analisi/1"],
  ] as const) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, { method });
    assert.equal(response.status, 200, `${method} ${path} must remain available`);
    assert.deepEqual(await response.json(), { available: true });
  }
  assert.deepEqual(downstreamCalls, [], "No parser or AI handler may run while AML AI is disabled");
} finally {
  await new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  for (const [name, value] of Object.entries(previousFlags)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
}

const indexSource = readFileSync("server/index.ts", "utf8");
assert.ok(
  indexSource.indexOf("registerPrivacyPreParserGates(app)") < indexSource.indexOf("express.json({"),
  "The production pre-parser privacy gates must be mounted before express.json",
);
assert.ok(
  indexSource.indexOf("registerPrivacyPreParserGates(app)") < indexSource.indexOf("express.urlencoded("),
  "The production pre-parser privacy gates must be mounted before express.urlencoded",
);

const routesSource = readFileSync("server/routes.ts", "utf8");
for (const historicalRoute of [
  'app.get("/api/analisi/:id"',
  'app.get("/api/analisi/:id/pdf"',
  'app.delete("/api/analisi/:id"',
]) {
  assert.ok(routesSource.includes(historicalRoute), `Historical route missing: ${historicalRoute}`);
}

console.log("privacy controls tests passed");
