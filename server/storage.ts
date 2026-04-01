import { type AnalisiCaso, type InsertAnalisiCaso, type Calcolo, type InsertCalcolo } from "@shared/schema";
import pkg from "pg";
import crypto from "crypto";
const { Pool } = pkg;

export interface IStorage {
  createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso & { accessToken: string }>;
  getAnalisi(id: number, accessToken?: string): Promise<AnalisiCaso | undefined>;
  getAllAnalisi(): Promise<AnalisiCaso[]>;
  updateAnalisi(id: number, data: Partial<AnalisiCaso>): Promise<AnalisiCaso | undefined>;
  deleteAnalisi(id: number): Promise<boolean>;
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
      created_at TIMESTAMPTZ DEFAULT NOW()
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

  // 2. Migrazione: aggiunge access_token se non esiste (query separata)
  try {
    await pool.query(`
      ALTER TABLE analisi_casi ADD COLUMN IF NOT EXISTS access_token TEXT;
    `);
    console.log("✓ Colonna access_token verificata");
  } catch (err) {
    console.error("Errore ALTER TABLE access_token:", err);
  }

  // 3. Genera token per le analisi esistenti che ne sono prive (query separata)
  try {
    await pool.query(`
      UPDATE analisi_casi
      SET access_token = md5(random()::text || id::text || now()::text)
      WHERE access_token IS NULL;
    `);
    console.log("✓ Token generati per analisi esistenti");
  } catch (err) {
    console.error("Errore UPDATE access_token:", err);
  }
}

initDb().catch(console.error);

function rowToAnalisi(row: any): AnalisiCaso {
  return {
    id: row.id,
    titolo: row.titolo,
    descrizione: row.descrizione,
    tipoAnalisi: row.tipo_analisi,
    valoreLite: row.valore_lite,
    tipoValore: row.tipo_valore,
    parti: row.parti,
    stato: row.stato,
    prospettoEconomico: row.prospetto_economico,
    analisiGiuridica: row.analisi_giuridica,
    guidaStrategica: row.guida_strategica,
    analisiMaanBatna: row.analisi_maan_batna,
    compatibilitaInteressi: row.compatibilita_interessi,
    controlloBiasCognitivi: row.controllo_bias_cognitivi,
    bozzaAccordo: row.bozza_accordo,
    analisiEconomica: row.analisi_economica,
    chatHistory: row.chat_history,
    createdAt: row.created_at,
  };
}

export class DatabaseStorage implements IStorage {
  async createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso & { accessToken: string }> {
    const accessToken = crypto.randomBytes(32).toString("hex");

    const res = await pool.query(
      `INSERT INTO analisi_casi
        (titolo, descrizione, tipo_analisi, valore_lite, tipo_valore, parti, stato,
         prospetto_economico, analisi_giuridica, guida_strategica, analisi_maan_batna,
         compatibilita_interessi, controllo_bias_cognitivi, bozza_accordo, analisi_economica,
         chat_history, access_token)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        data.titolo,
        data.descrizione ?? null,
        data.tipoAnalisi ?? "mediazione",
        data.valoreLite ?? null,
        data.tipoValore ?? "determinato",
        JSON.stringify(data.parti ?? []),
        data.stato ?? "in_corso",
        data.prospettoEconomico ?? null,
        data.analisiGiuridica ?? null,
        data.guidaStrategica ?? null,
        data.analisiMaanBatna ?? null,
        data.compatibilitaInteressi ?? null,
        data.controlloBiasCognitivi ?? null,
        data.bozzaAccordo ?? null,
        data.analisiEconomica ?? null,
        JSON.stringify(data.chatHistory ?? []),
        accessToken,
      ]
    );
    return { ...rowToAnalisi(res.rows[0]), accessToken };
  }

  async getAnalisi(id: number, accessToken?: string): Promise<AnalisiCaso | undefined> {
    if (accessToken) {
      const res = await pool.query(
        `SELECT * FROM analisi_casi WHERE id = $1 AND access_token = $2`,
        [id, accessToken]
      );
      return res.rows[0] ? rowToAnalisi(res.rows[0]) : undefined;
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
      titolo: "titolo",
      descrizione: "descrizione",
      tipoAnalisi: "tipo_analisi",
      valoreLite: "valore_lite",
      tipoValore: "tipo_valore",
      parti: "parti",
      stato: "stato",
      prospettoEconomico: "prospetto_economico",
      analisiGiuridica: "analisi_giuridica",
      guidaStrategica: "guida_strategica",
      analisiMaanBatna: "analisi_maan_batna",
      compatibilitaInteressi: "compatibilita_interessi",
      controlloBiasCognitivi: "controllo_bias_cognitivi",
      bozzaAccordo: "bozza_accordo",
      analisiEconomica: "analisi_economica",
      chatHistory: "chat_history",
    };

    const jsonFields = new Set(["parti", "chatHistory"]);
    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, col] of Object.entries(fieldMap)) {
      if (key in data) {
        setClauses.push(`${col} = $${idx}`);
        const val = (data as any)[key];
        values.push(jsonFields.has(key) ? JSON.stringify(val) : val);
        idx++;
      }
    }

    if (setClauses.length === 0) return this.getAnalisi(id);

    values.push(id);
    const res = await pool.query(
      `UPDATE analisi_casi SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return res.rows[0] ? rowToAnalisi(res.rows[0]) : undefined;
  }

  async deleteAnalisi(id: number): Promise<boolean> {
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
