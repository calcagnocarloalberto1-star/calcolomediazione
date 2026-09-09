import crypto from "crypto";

const ENCRYPTION_PREFIX = "enc:v1";
const TOKEN_HASH_PREFIX = "sha256:";
const KEY_CONTEXT = "calcolomediazione:data-protection:v1";

type KeyEntry = {
  id: string;
  key: Buffer;
};

function decodeKey(secret: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(secret)) {
    return Buffer.from(secret, "hex");
  }
  if (!/^[A-Za-z0-9+/]{43}=$/.test(secret)) {
    throw new Error(
      "La chiave dati deve essere composta da 32 byte casuali codificati in Base64 oppure da 64 caratteri esadecimali",
    );
  }
  const decoded = Buffer.from(secret, "base64");
  if (decoded.length !== 32 || decoded.toString("base64") !== secret) {
    throw new Error("DATA_ENCRYPTION_KEY non è una codifica Base64 canonica di 32 byte");
  }
  return decoded;
}

function keyId(key: Buffer): string {
  return crypto.createHash("sha256").update(key).digest("hex").slice(0, 16);
}

function configuredSecrets(): string[] {
  const current = process.env.DATA_ENCRYPTION_KEY?.trim();
  const previous = (process.env.DATA_ENCRYPTION_KEY_PREVIOUS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return current ? [current, ...previous] : [];
}

function getKeyring(): KeyEntry[] {
  const entries = configuredSecrets().map((secret) => {
    const key = decodeKey(secret);
    return { id: keyId(key), key };
  });

  if (entries.length === 0) {
    throw new Error(
      "DATA_ENCRYPTION_KEY non configurata: impossibile proteggere i dati delle analisi",
    );
  }

  return entries;
}

export function assertDataProtectionConfigured(): void {
  getKeyring();
}

export function getActiveKeyId(): string {
  return getKeyring()[0].id;
}

export function getConfiguredKeyIds(): string[] {
  return getKeyring().map((entry) => entry.id);
}

function decodeBase64UrlCanonical(value: string, label: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error(`${label} non è Base64URL valido`);
  }
  const decoded = Buffer.from(value, "base64url");
  if (decoded.toString("base64url") !== value) {
    throw new Error(`${label} non è in forma Base64URL canonica`);
  }
  return decoded;
}

export function encryptedKeyId(value: string): string | null {
  const match = /^enc:v1:([0-9a-f]{16}):/.exec(value);
  return match?.[1] ?? null;
}

export function encryptJson(value: unknown, context: string): string {
  const [activeKey] = getKeyring();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", activeKey.key, iv);
  cipher.setAAD(Buffer.from(`${KEY_CONTEXT}:${context}`, "utf8"));

  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTION_PREFIX,
    activeKey.id,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(":");
}

export function decryptJson<T>(encrypted: string, context: string): T {
  const parts = encrypted.split(":");
  if (
    parts.length !== 6 ||
    `${parts[0]}:${parts[1]}` !== ENCRYPTION_PREFIX ||
    !/^[0-9a-f]{16}$/.test(parts[2])
  ) {
    throw new Error("Formato del dato cifrato non riconosciuto");
  }

  const [, , storedKeyId, ivValue, tagValue, ciphertextValue] = parts;
  const keyEntry = getKeyring().find((entry) => entry.id === storedKeyId);
  if (!keyEntry) {
    throw new Error(
      `Chiave di cifratura ${storedKeyId} non disponibile; verificare DATA_ENCRYPTION_KEY_PREVIOUS`,
    );
  }

  try {
    const iv = decodeBase64UrlCanonical(ivValue, "IV");
    const tag = decodeBase64UrlCanonical(tagValue, "tag");
    const ciphertext = decodeBase64UrlCanonical(ciphertextValue, "ciphertext");
    if (iv.length !== 12 || tag.length !== 16 || ciphertext.length === 0) {
      throw new Error("Lunghezza non valida");
    }
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyEntry.key,
      iv,
    );
    decipher.setAAD(Buffer.from(`${KEY_CONTEXT}:${context}`, "utf8"));
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return JSON.parse(plaintext.toString("utf8")) as T;
  } catch {
    throw new Error("Impossibile decifrare o autenticare il dato protetto");
  }
}

export function hashAccessToken(token: string): string {
  return `${TOKEN_HASH_PREFIX}${crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex")}`;
}

export function isHashedAccessToken(value: string): boolean {
  return /^sha256:[0-9a-f]{64}$/.test(value);
}

export function prepareAccessTokenForMigration(
  databaseToken: unknown,
  payloadRecoveryToken?: string,
): { recoveryToken: string; protectedToken: string } {
  const storedToken =
    typeof databaseToken === "string" && databaseToken ? databaseToken : null;
  let recoveryToken = payloadRecoveryToken;

  if (!recoveryToken && storedToken && !isHashedAccessToken(storedToken)) {
    recoveryToken = storedToken;
  }
  if (!recoveryToken && !storedToken) {
    recoveryToken = crypto.randomBytes(32).toString("hex");
  }
  if (!recoveryToken) {
    throw new Error("Token già hashato senza token di recupero nel payload");
  }
  if (
    storedToken &&
    !verifyAccessToken(recoveryToken, storedToken).valid
  ) {
    throw new Error(
      "Il token di recupero nel payload non corrisponde al token memorizzato",
    );
  }

  return {
    recoveryToken,
    protectedToken: isHashedAccessToken(storedToken || "")
      ? storedToken!
      : hashAccessToken(recoveryToken),
  };
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyAccessToken(token: string, storedValue: string): {
  valid: boolean;
  needsUpgrade: boolean;
} {
  if (!token || !storedValue) return { valid: false, needsUpgrade: false };

  if (storedValue.startsWith(TOKEN_HASH_PREFIX)) {
    return {
      valid: safeEqual(hashAccessToken(token), storedValue),
      needsUpgrade: false,
    };
  }

  return {
    valid: safeEqual(token, storedValue),
    needsUpgrade: safeEqual(token, storedValue),
  };
}
