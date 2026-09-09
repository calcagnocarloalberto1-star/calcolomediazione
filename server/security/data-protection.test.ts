import assert from "node:assert/strict";
import {
  assertDataProtectionConfigured,
  decryptJson,
  encryptJson,
  hashAccessToken,
  isHashedAccessToken,
  prepareAccessTokenForMigration,
  verifyAccessToken,
} from "./data-protection";

process.env.DATA_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");

const payload = {
  titolo: "Controversia riservata",
  parti: [{ nome: "Mario Rossi", ruolo: "istante" }],
  valoreLite: 125000,
};

const encrypted = encryptJson(payload, "analysis");
assert.ok(encrypted.startsWith("enc:v1:"));
assert.ok(!encrypted.includes("Mario Rossi"));
assert.deepEqual(decryptJson(encrypted, "analysis"), payload);

assert.throws(
  () => decryptJson(encrypted, "wrong-context"),
  /Impossibile decifrare/,
);
const encryptedParts = encrypted.split(":");
const tamperedBytes = Buffer.from(encryptedParts[5], "base64url");
tamperedBytes[0] ^= 1;
encryptedParts[5] = tamperedBytes.toString("base64url");
const tampered = encryptedParts.join(":");
assert.throws(
  () => decryptJson(tampered, "analysis"),
  /Impossibile decifrare/,
);

const token = "a".repeat(64);
const tokenHash = hashAccessToken(token);
assert.ok(tokenHash.startsWith("sha256:"));
assert.equal(isHashedAccessToken(tokenHash), true);
assert.equal(isHashedAccessToken("sha256:not-a-valid-hash"), false);
assert.ok(!tokenHash.includes(token));
assert.deepEqual(verifyAccessToken(token, tokenHash), {
  valid: true,
  needsUpgrade: false,
});
assert.equal(verifyAccessToken("b".repeat(64), tokenHash).valid, false);
assert.deepEqual(verifyAccessToken(token, token), {
  valid: true,
  needsUpgrade: true,
});

const legacyMigration = prepareAccessTokenForMigration(token);
assert.equal(legacyMigration.recoveryToken, token);
assert.equal(legacyMigration.protectedToken, tokenHash);

const missingTokenMigration = prepareAccessTokenForMigration(null);
assert.match(missingTokenMigration.recoveryToken, /^[a-f0-9]{64}$/);
assert.equal(
  verifyAccessToken(
    missingTokenMigration.recoveryToken,
    missingTokenMigration.protectedToken,
  ).valid,
  true,
);

assert.throws(
  () => prepareAccessTokenForMigration(tokenHash),
  /senza token di recupero/,
);
assert.deepEqual(prepareAccessTokenForMigration(tokenHash, token), {
  recoveryToken: token,
  protectedToken: tokenHash,
});
assert.throws(
  () => prepareAccessTokenForMigration(tokenHash, "b".repeat(64)),
  /non corrisponde/,
);
assert.throws(
  () => prepareAccessTokenForMigration(token, "b".repeat(64)),
  /non corrisponde/,
);

const encryptedWithOldKey = encrypted;
process.env.DATA_ENCRYPTION_KEY_PREVIOUS =
  process.env.DATA_ENCRYPTION_KEY;
process.env.DATA_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
assert.deepEqual(decryptJson(encryptedWithOldKey, "analysis"), payload);

process.env.DATA_ENCRYPTION_KEY = "password-debole";
assert.throws(
  () => assertDataProtectionConfigured(),
  /32 byte casuali/,
);

console.log("Data protection tests passed");
