import { type AnalisiCaso, type InsertAnalisiCaso, type Calcolo, type InsertCalcolo } from "@shared/schema";
import pkg from "pg";
import crypto from "crypto";
import { z } from "zod";
import {
  assertDataProtectionConfigured,
  decryptJson,
  encryptedKeyId,
  encryptJson,
  getActiveKeyId,
  getConfiguredKeyIds,
  hashAccessToken,
  isHashedAccessToken,
  prepareAccessTokenForMigration,
  verifyAccessToken,
} from "./security/data-protection";
const { Pool } = pkg;

export interface IStorage {
  createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso & { accessToken: string }>;
  getAnalisi(id: number, accessToken?: string): Promise<AnalisiCaso | undefined>;
  getAllAnalisi(): Promise<AnalisiCaso[]>;
  updateAnalisi(id: number, data: Partial<AnalisiCaso>): Promise<AnalisiCaso | undefined>;
  appendChatMessages(
    id: number,
    messages: Array<{ role: string; content: string; timestamp: string }>,
  ): Promise<AnalisiCaso | undefined>;
  deleteAnalisi(id: number, accessToken: string): Promise<boolean>;
  createCalcolo(data: InsertCalcolo): Promise<Calcolo>;
  getAllCalcoli(): Promise<Calcolo[]>;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  if (process.env.NODE_ENV === "production") {
    assertDataProtectionConfigured();
  }
  // 1. Crea le tabelle se non esistono
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analisi_casi (
      id SERIAL PRIMARY KEY,
      titolo TEXT NOT NULL,
      descrizione TEXT,
      tipo_analisi TEXT DEFAULT 'mediazione',
      valore_lite NUMERIC,
      tipo_valore TEXT DEFAULT 'determinato',
      parti JSONB DEFAULT '[]',
      stato TEXT DEFAULT 'in_corso',
      prospetto_economico TEXT,
      analisi_giuridica TEXT,
      guida_strategica TEXT,
      analisi_maan_batna TEXT,
      compatibilita_interessi TEXT,
      controllo_bias_cognitivi TEXT,
      bozza_accordo TEXT,
      analisi_economica TEXT,
      chat_history JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      secure_payload TEXT
    );

    CREATE TABLE IF NOT EXISTS calcoli (
      id SERIAL PRIMARY KEY,
      valore_lite NUMERIC,
      tipo_mediazione TEXT,
      esito TEXT,
      tipo_valore TEXT DEFAULT 'determinato',
      risultato JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(
    `CREATE TABLE IF NOT EXISTS contatore_visite (
      id INTEGER PRIMARY KEY DEFAULT 1,
      totale INTEGER NOT NULL DEFAULT 0
    )`,
  );
  await pool.query(
    `INSERT INTO contatore_visite (id, totale)
     VALUES (1, 0)
     ON CONFLICT (id) DO NOTHING`,
  );
  await pool.query(`
    ALTER TABLE analisi_casi ADD COLUMN IF NOT EXISTS access_token TEXT;
    ALTER TABLE analisi_casi ADD COLUMN IF NOT EXISTS secure_payload TEXT;
  `);
  console.log("✓ Schema di protezione dati verificato");
}

export const storageReady = initDb();

const sensitiveKeys = [
  "titolo",
  "descrizione",
  "valoreLite",
  "parti",
  "prospettoEconomico",
  "analisiGiuridica",
  "guidaStrategica",
  "analisiMaanBatna",
  "compatibilitaInteressi",
  "controlloBiasCognitivi",
  "bozzaAccordo",
  "analisiEconomica",
  "chatHistory",
] as const;

type SensitivePayload = Omit<
  Pick<AnalisiCaso, (typeof sensitiveKeys)[number]>,
  "valoreLite"
> & {
  valoreLite: string | null;
  accessTokenRecovery?: string;
};

const sensitivePayloadSchema = z.object({
  titolo: z.string(),
  descrizione: z.string().nullable(),
  valoreLite: z.string().regex(/^-?\d+(?:\.\d+)?$/).nullable(),
  parti: z.array(z.object({ nome: z.string(), ruolo: z.string() }).passthrough()),
  prospettoEconomico: z.string().nullable(),
  analisiGiuridica: z.string().nullable(),
  guidaStrategica: z.string().nullable(),
  analisiMaanBatna: z.string().nullable(),
  compatibilitaInteressi: z.string().nullable(),
  controlloBiasCognitivi: z.string().nullable(),
  bozzaAccordo: z.string().nullable(),
  analisiEconomica: z.string().nullable(),
  chatHistory: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
      timestamp: z.string(),
    }).passthrough(),
  ),
  accessTokenRecovery: z.string().regex(/^[a-f0-9]{32}$|^[a-f0-9]{64}$/i).optional(),
});

function normalizeValoreLite(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Valore della lite non valido");
  return parsed;
}

function legacyPayload(row: any): SensitivePayload {
  return sensitivePayloadSchema.parse({
    titolo: row.titolo,
    descrizione: row.descrizione,
    valoreLite:
      row.valore_lite === null || row.valore_lite === undefined
        ? null
        : String(row.valore_lite),
    parti: row.parti ?? [],
    prospettoEconomico: row.prospetto_economico,
    analisiGiuridica: row.analisi_giuridica,
    guidaStrategica: row.guida_strategica,
    analisiMaanBatna: row.analisi_maan_batna,
    compatibilitaInteressi: row.compatibilita_interessi,
    controlloBiasCognitivi: row.controllo_bias_cognitivi,
    bozzaAccordo: row.bozza_accordo,
    analisiEconomica: row.analisi_economica,
    chatHistory: row.chat_history ?? [],
    ...(typeof row.access_token === "string" &&
    !isHashedAccessToken(row.access_token)
      ? { accessTokenRecovery: row.access_token }
      : {}),
  }) as SensitivePayload;
}

function protectedPayload(row: any): SensitivePayload {
  if (!row.secure_payload) return legacyPayload(row);
  const decrypted = decryptJson<unknown>(
    row.secure_payload,
    `analisi-casi:${row.id}:schema-1`,
  );
  return sensitivePayloadSchema.parse(decrypted) as SensitivePayload;
}

function rowToAnalisi(row: any): AnalisiCaso {
  const sensitive = protectedPayload(row);
  return {
    id: row.id,
    titolo: sensitive.titolo,
    descrizione: sensitive.descrizione,
    tipoAnalisi: row.tipo_analisi,
    valoreLite: normalizeValoreLite(sensitive.valoreLite),
    tipoValore: row.tipo_valore,
    parti: sensitive.parti,
    stato: row.stato,
    prospettoEconomico: sensitive.prospettoEconomico,
    analisiGiuridica: sensitive.analisiGiuridica,
    guidaStrategica: sensitive.guidaStrategica,
    analisiMaanBatna: sensitive.analisiMaanBatna,
    compatibilitaInteressi: sensitive.compatibilitaInteressi,
    controlloBiasCognitivi: sensitive.controlloBiasCognitivi,
    bozzaAccordo: sensitive.bozzaAccordo,
    analisiEconomica: sensitive.analisiEconomica,
    chatHistory: sensitive.chatHistory,
    createdAt: row.created_at,
  };
}

// PRIV-09 — la retention a 30 giorni (dichiarata in privacy policy) girava
// SOLO come effetto collaterale di createAnalisi(): se per un periodo non
// arrivava nessuna nuova analisi, quelle vecchie non venivano mai cancellate
// nonostante la promessa fatta agli utenti. Estratta in una funzione a se'
// stante cosi' da poterla anche schedulare in modo indipendente (vedi
// server/index.ts) invece di legarla solo alla creazione di una nuova analisi.
export async function eliminaAnalisiScadute(): Promise<void> {
  await pool.query("DELETE FROM analisi_casi WHERE created_at < now() - interval '30 days'");
}

export async function preflightLegacyAnalisi(): Promise<{
  total: number;
  daProteggere: number;
}> {
  assertDataProtectionConfigured();
  const activeKeyId = getActiveKeyId();
  let lastId = 0;
  let total = 0;
  let daProteggere = 0;

  while (true) {
    const result = await pool.query(
      `SELECT * FROM analisi_casi
       WHERE id > $1
       ORDER BY id
       LIMIT 250`,
      [lastId],
    );
    if (result.rows.length === 0) break;
    for (const row of result.rows) {
      lastId = row.id;
      let payload: SensitivePayload;
      try {
        payload = protectedPayload(row);
        prepareAccessTokenForMigration(
          row.access_token,
          payload.accessTokenRecovery,
        );
      } catch (error) {
        throw new Error(
          `Preflight fallito per analisi ${row.id}: ${
            error instanceof Error ? error.message : "payload non valido"
          }`,
        );
      }
      total++;
      if (
        !row.secure_payload ||
        encryptedKeyId(row.secure_payload) !== activeKeyId ||
        !isHashedAccessToken(row.access_token || "") ||
        !payload.accessTokenRecovery
      ) {
        daProteggere++;
      }
    }
  }
  return { total, daProteggere };
}

export async function migrateLegacyAnalisi(): Promise<number> {
  assertDataProtectionConfigured();
  const activeKeyId = getActiveKeyId();
  let lastId = 0;
  let migrated = 0;

  while (true) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET LOCAL lock_timeout = '5s'");
      await client.query("SET LOCAL statement_timeout = '60s'");
      const result = await client.query(
        `SELECT * FROM analisi_casi
         WHERE id > $1
         ORDER BY id
         LIMIT 100
         FOR UPDATE`,
        [lastId],
      );
      if (result.rows.length === 0) {
        await client.query("COMMIT");
        break;
      }

      for (const row of result.rows) {
        lastId = row.id;
        const payload = protectedPayload(row);
        const hadRecoveryToken = Boolean(payload.accessTokenRecovery);
        const { recoveryToken, protectedToken } =
          prepareAccessTokenForMigration(
            row.access_token,
            payload.accessTokenRecovery,
          );
        payload.accessTokenRecovery = recoveryToken;

        const needsEncryption =
          !row.secure_payload ||
          encryptedKeyId(row.secure_payload) !== activeKeyId ||
          !hadRecoveryToken;
        const needsTokenHash = !isHashedAccessToken(row.access_token || "");
        const needsScrub =
          row.titolo !== "[contenuto cifrato]" ||
          row.descrizione !== null ||
          row.valore_lite !== null ||
          row.prospetto_economico !== null ||
          row.analisi_giuridica !== null ||
          row.guida_strategica !== null ||
          row.analisi_maan_batna !== null ||
          row.compatibilita_interessi !== null ||
          row.controllo_bias_cognitivi !== null ||
          row.bozza_accordo !== null ||
          row.analisi_economica !== null ||
          (Array.isArray(row.parti) && row.parti.length > 0) ||
          (Array.isArray(row.chat_history) && row.chat_history.length > 0);
        if (!needsEncryption && !needsTokenHash && !needsScrub) continue;

        const securePayload = needsEncryption
          ? encryptJson(payload, `analisi-casi:${row.id}:schema-1`)
          : row.secure_payload;
        sensitivePayloadSchema.parse(
          decryptJson<unknown>(securePayload, `analisi-casi:${row.id}:schema-1`),
        );
        await client.query(
          `UPDATE analisi_casi SET
            secure_payload = $1,
            access_token = $2,
            titolo = '[contenuto cifrato]',
            descrizione = NULL,
            valore_lite = NULL,
            parti = '[]'::jsonb,
            prospetto_economico = NULL,
            analisi_giuridica = NULL,
            guida_strategica = NULL,
            analisi_maan_batna = NULL,
            compatibilita_interessi = NULL,
            controllo_bias_cognitivi = NULL,
            bozza_accordo = NULL,
            analisi_economica = NULL,
            chat_history = '[]'::jsonb
          WHERE id = $3`,
          [securePayload, protectedToken, row.id],
        );
        migrated++;
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Migrazione interrotta vicino all'analisi ${lastId}: ${
          error instanceof Error ? error.message : "errore sconosciuto"
        }`,
      );
    } finally {
      client.release();
    }
  }
  return migrated;
}

export async function preflightEncryptionRollback(): Promise<number> {
  assertDataProtectionConfigured();
  const result = await pool.query(
    `SELECT * FROM analisi_casi
     WHERE secure_payload IS NOT NULL
     ORDER BY id`,
  );
  for (const row of result.rows) {
    const payload = protectedPayload(row);
    if (!payload.accessTokenRecovery) {
      throw new Error(
        `Rollback non eseguibile per analisi ${row.id}: token di recupero assente`,
      );
    }
  }
  return result.rowCount ?? 0;
}

export async function rollbackProtectedAnalisi(): Promise<number> {
  await preflightEncryptionRollback();
  let lastId = 0;
  let restored = 0;

  while (true) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET LOCAL lock_timeout = '5s'");
      await client.query("SET LOCAL statement_timeout = '60s'");
      const result = await client.query(
        `SELECT * FROM analisi_casi
         WHERE secure_payload IS NOT NULL AND id > $1
         ORDER BY id
         LIMIT 100
         FOR UPDATE`,
        [lastId],
      );
      if (result.rows.length === 0) {
        await client.query("COMMIT");
        break;
      }
      for (const row of result.rows) {
        lastId = row.id;
        const payload = protectedPayload(row);
        if (!payload.accessTokenRecovery) {
          throw new Error(`Token di recupero assente per analisi ${row.id}`);
        }
        await client.query(
          `UPDATE analisi_casi SET
            titolo = $1,
            descrizione = $2,
            valore_lite = $3,
            parti = $4,
            prospetto_economico = $5,
            analisi_giuridica = $6,
            guida_strategica = $7,
            analisi_maan_batna = $8,
            compatibilita_interessi = $9,
            controllo_bias_cognitivi = $10,
            bozza_accordo = $11,
            analisi_economica = $12,
            chat_history = $13,
            access_token = $14,
            secure_payload = NULL
          WHERE id = $15`,
          [
            payload.titolo,
            payload.descrizione,
            payload.valoreLite,
            JSON.stringify(payload.parti),
            payload.prospettoEconomico,
            payload.analisiGiuridica,
            payload.guidaStrategica,
            payload.analisiMaanBatna,
            payload.compatibilitaInteressi,
            payload.controlloBiasCognitivi,
            payload.bozzaAccordo,
            payload.analisiEconomica,
            JSON.stringify(payload.chatHistory),
            payload.accessTokenRecovery,
            row.id,
          ],
        );
        restored++;
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  return restored;
}

export async function closeStorage(): Promise<void> {
  await pool.end();
}

export async function verifyStorageHealth(): Promise<void> {
  assertDataProtectionConfigured();
  const availableKeyIds = new Set(getConfiguredKeyIds());
  const result = await pool.query(
    `SELECT DISTINCT split_part(secure_payload, ':', 3) AS key_id
     FROM analisi_casi
     WHERE secure_payload IS NOT NULL`,
  );
  const unavailable = result.rows
    .map((row: any) => row.key_id)
    .filter((id: unknown) => typeof id !== "string" || !availableKeyIds.has(id));
  if (unavailable.length > 0) {
    throw new Error("Il keyring non copre tutti i payload cifrati");
  }
}

export async function incrementaContatoreVisite(): Promise<number> { const res = await pool.query(`UPDATE contatore_visite SET totale = totale + 1 WHERE id = 1 RETURNING totale`); return res.rows[0]?.totale ?? 0; } export async function getContatoreVisite(): Promise<number> { const res = await pool.query(`SELECT totale FROM contatore_visite WHERE id = 1`); return res.rows[0]?.totale ?? 0; } export class DatabaseStorage implements IStorage {
  async createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso & { accessToken: string }> {
    // Retention best-effort immediata: non blocca la creazione. Lo scheduler
    // periodico in server/index.ts resta la garanzia indipendente dal traffico.
    eliminaAnalisiScadute().catch(() => {});
    const accessToken = crypto.randomBytes(32).toString("hex");
    const sensitivePayload: SensitivePayload = {
      titolo: data.titolo,
      descrizione: data.descrizione ?? null,
      valoreLite:
        data.valoreLite === null || data.valoreLite === undefined
          ? null
          : String(data.valoreLite),
      parti: data.parti ?? [],
      prospettoEconomico: data.prospettoEconomico ?? null,
      analisiGiuridica: data.analisiGiuridica ?? null,
      guidaStrategica: data.guidaStrategica ?? null,
      analisiMaanBatna: data.analisiMaanBatna ?? null,
      compatibilitaInteressi: data.compatibilitaInteressi ?? null,
      controlloBiasCognitivi: data.controlloBiasCognitivi ?? null,
      bozzaAccordo: data.bozzaAccordo ?? null,
      analisiEconomica: data.analisiEconomica ?? null,
      chatHistory: data.chatHistory ?? [],
      accessTokenRecovery: accessToken,
    };
    sensitivePayloadSchema.parse(sensitivePayload);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const inserted = await client.query(
        `INSERT INTO analisi_casi
          (titolo, descrizione, tipo_analisi, valore_lite, tipo_valore, parti, stato,
           prospetto_economico, analisi_giuridica, guida_strategica, analisi_maan_batna,
           compatibilita_interessi, controllo_bias_cognitivi, bozza_accordo, analisi_economica,
           chat_history, access_token, secure_payload)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,NULL)
         RETURNING *`,
        [
          "[contenuto cifrato]",
          null,
          data.tipoAnalisi ?? "mediazione",
          null,
          data.tipoValore ?? "determinato",
          JSON.stringify([]),
          data.stato ?? "in_corso",
          null, null, null, null, null, null, null, null,
          JSON.stringify([]),
          hashAccessToken(accessToken),
        ],
      );
      const row = inserted.rows[0];
      const securePayload = encryptJson(
        sensitivePayload,
        `analisi-casi:${row.id}:schema-1`,
      );
      const verifiedPayload = sensitivePayloadSchema.parse(
        decryptJson<unknown>(
          securePayload,
          `analisi-casi:${row.id}:schema-1`,
        ),
      );
      const updated = await client.query(
        `UPDATE analisi_casi SET secure_payload = $1 WHERE id = $2 RETURNING *`,
        [securePayload, row.id],
      );
      await client.query("COMMIT");
      return {
        ...rowToAnalisi({ ...updated.rows[0], secure_payload: securePayload }),
        accessToken,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getAnalisi(id: number, accessToken?: string): Promise<AnalisiCaso | undefined> {
    if (accessToken) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          `SELECT * FROM analisi_casi WHERE id = $1 FOR UPDATE`,
          [id],
        );
        let row = res.rows[0];
        if (!row) {
          await client.query("ROLLBACK");
          return undefined;
        }
        const verification = verifyAccessToken(accessToken, row.access_token);
        if (!verification.valid) {
          await client.query("ROLLBACK");
          return undefined;
        }
        const payload = protectedPayload(row);
        if (
          verification.needsUpgrade ||
          !row.secure_payload ||
          !payload.accessTokenRecovery
        ) {
          payload.accessTokenRecovery = accessToken;
          const securePayload = encryptJson(
            payload,
            `analisi-casi:${id}:schema-1`,
          );
          const updated = await client.query(
            `UPDATE analisi_casi SET
              access_token = $1,
              secure_payload = $2,
              titolo = '[contenuto cifrato]',
              descrizione = NULL,
              valore_lite = NULL,
              parti = '[]'::jsonb,
              prospetto_economico = NULL,
              analisi_giuridica = NULL,
              guida_strategica = NULL,
              analisi_maan_batna = NULL,
              compatibilita_interessi = NULL,
              controllo_bias_cognitivi = NULL,
              bozza_accordo = NULL,
              analisi_economica = NULL,
              chat_history = '[]'::jsonb
             WHERE id = $3 RETURNING *`,
            [hashAccessToken(accessToken), securePayload, id],
          );
          row = updated.rows[0];
        }
        await client.query("COMMIT");
        return rowToAnalisi(row);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }
    // Accesso interno (pipeline AI): nessun token richiesto
    const res = await pool.query(`SELECT * FROM analisi_casi WHERE id = $1`, [id]);
    return res.rows[0] ? rowToAnalisi(res.rows[0]) : undefined;
  }

  async getAllAnalisi(): Promise<AnalisiCaso[]> {
    const res = await pool.query(`SELECT * FROM analisi_casi ORDER BY id DESC`);
    return res.rows.map(rowToAnalisi);
  }

  async updateAnalisi(id: number, data: Partial<AnalisiCaso>): Promise<AnalisiCaso | undefined> {
    const fieldMap: Record<string, string> = {
      tipoAnalisi: "tipo_analisi",
      tipoValore: "tipo_valore",
      stato: "stato",
    };

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const current = await client.query(
        `SELECT * FROM analisi_casi WHERE id = $1 FOR UPDATE`,
        [id],
      );
      if (!current.rows[0]) {
        await client.query("ROLLBACK");
        return undefined;
      }
      const existingPayload = protectedPayload(current.rows[0]);
      const nextPayload = { ...existingPayload };
      let sensitiveChanged = false;
      for (const key of sensitiveKeys) {
        if (key in data) {
          (nextPayload as any)[key] =
            key === "valoreLite" &&
            (data as any)[key] !== null &&
            (data as any)[key] !== undefined
              ? String((data as any)[key])
              : (data as any)[key];
          sensitiveChanged = true;
        }
      }
      sensitivePayloadSchema.parse(nextPayload);

      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;
      for (const [key, col] of Object.entries(fieldMap)) {
        if (key in data) {
          setClauses.push(`${col} = $${idx}`);
          values.push((data as any)[key]);
          idx++;
        }
      }

      if (sensitiveChanged || !current.rows[0].secure_payload) {
        setClauses.push(`secure_payload = $${idx}`);
        values.push(
          encryptJson(nextPayload, `analisi-casi:${id}:schema-1`),
        );
        idx++;
        setClauses.push(
          "titolo = '[contenuto cifrato]'",
          "descrizione = NULL",
          "valore_lite = NULL",
          "parti = '[]'::jsonb",
          "prospetto_economico = NULL",
          "analisi_giuridica = NULL",
          "guida_strategica = NULL",
          "analisi_maan_batna = NULL",
          "compatibilita_interessi = NULL",
          "controllo_bias_cognitivi = NULL",
          "bozza_accordo = NULL",
          "analisi_economica = NULL",
          "chat_history = '[]'::jsonb",
        );
      }

      if (setClauses.length === 0) {
        await client.query("COMMIT");
        return rowToAnalisi(current.rows[0]);
      }

      values.push(id);
      const res = await client.query(
        `UPDATE analisi_casi SET ${setClauses.join(", ")}
         WHERE id = $${idx} RETURNING *`,
        values,
      );
      await client.query("COMMIT");
      return res.rows[0] ? rowToAnalisi(res.rows[0]) : undefined;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async appendChatMessages(
    id: number,
    messages: Array<{ role: string; content: string; timestamp: string }>,
  ): Promise<AnalisiCaso | undefined> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const current = await client.query(
        `SELECT * FROM analisi_casi WHERE id = $1 FOR UPDATE`,
        [id],
      );
      if (!current.rows[0]) {
        await client.query("ROLLBACK");
        return undefined;
      }
      const payload = protectedPayload(current.rows[0]);
      payload.chatHistory = [...(payload.chatHistory || []), ...messages];
      sensitivePayloadSchema.parse(payload);
      const securePayload = encryptJson(
        payload,
        `analisi-casi:${id}:schema-1`,
      );
      const updated = await client.query(
        `UPDATE analisi_casi SET
          secure_payload = $1,
          titolo = '[contenuto cifrato]',
          descrizione = NULL,
          valore_lite = NULL,
          parti = '[]'::jsonb,
          prospetto_economico = NULL,
          analisi_giuridica = NULL,
          guida_strategica = NULL,
          analisi_maan_batna = NULL,
          compatibilita_interessi = NULL,
          controllo_bias_cognitivi = NULL,
          bozza_accordo = NULL,
          analisi_economica = NULL,
          chat_history = '[]'::jsonb
         WHERE id = $2 RETURNING *`,
        [securePayload, id],
      );
      await client.query("COMMIT");
      return updated.rows[0] ? rowToAnalisi(updated.rows[0]) : undefined;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteAnalisi(id: number, accessToken: string): Promise<boolean> {
    const stored = await pool.query(
      `SELECT access_token FROM analisi_casi WHERE id = $1`,
      [id],
    );
    if (!stored.rows[0] || !verifyAccessToken(accessToken, stored.rows[0].access_token).valid) {
      return false;
    }
    const res = await pool.query(`DELETE FROM analisi_casi WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async createCalcolo(data: InsertCalcolo): Promise<Calcolo> {
    const res = await pool.query(
      `INSERT INTO calcoli (valore_lite, tipo_mediazione, esito, tipo_valore, risultato)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        data.valoreLite,
        data.tipoMediazione,
        data.esito,
        data.tipoValore ?? "determinato",
        JSON.stringify(data.risultato ?? null),
      ]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      valoreLite: r.valore_lite,
      tipoMediazione: r.tipo_mediazione,
      esito: r.esito,
      tipoValore: r.tipo_valore,
      risultato: r.risultato,
      createdAt: r.created_at,
    };
  }

  async getAllCalcoli(): Promise<Calcolo[]> {
    const res = await pool.query(`SELECT * FROM calcoli ORDER BY id DESC`);
    return res.rows.map((r: any) => ({
      id: r.id,
      valoreLite: r.valore_lite,
      tipoMediazione: r.tipo_mediazione,
      esito: r.esito,
      tipoValore: r.tipo_valore,
      risultato: r.risultato,
      createdAt: r.created_at,
    }));
  }
}

export const storage = new DatabaseStorage();
