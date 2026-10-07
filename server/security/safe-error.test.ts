import assert from "node:assert/strict";
import { safeErrorMetadata } from "./safe-error.js";

const error = Object.assign(new Error("Messaggio interno con dati sintetici"), {
  status: 400,
  type: "entity.parse.failed",
  code: "BAD_JSON",
  body: "{\"nome\":\"Persona Sintetica\",\"dato\":\"segreto\"",
  filename: "fascicolo-persona-sintetica.pdf",
  request: { headers: { authorization: "Bearer token-sintetico" } },
});

const metadata = safeErrorMetadata(error);
const serialized = JSON.stringify(metadata);

assert.deepEqual(metadata, {
  name: "Error",
  status: 400,
  code: "BAD_JSON",
  type: "entity.parse.failed",
});
assert.equal(serialized.includes("Persona Sintetica"), false);
assert.equal(serialized.includes("segreto"), false);
assert.equal(serialized.includes("fascicolo"), false);
assert.equal(serialized.includes("token-sintetico"), false);

console.log("Safe error logging tests passed");
