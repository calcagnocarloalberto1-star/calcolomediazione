import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Analisi AI cases
export const analisiCasi = pgTable("analisi_casi", {
  id: serial("id").primaryKey(),
  titolo: text("titolo").notNull(),
  descrizione: text("descrizione"),
  tipoAnalisi: text("tipo_analisi").notNull().default("mediazione"),
  valoreLite: real("valore_lite"),
  tipoValore: text("tipo_valore").default("determinato"),
  parti: jsonb("parti").$type<Array<{ nome: string; ruolo: string }>>().default([]),
  stato: text("stato").notNull().default("in_corso"),
  // AI results
  analisiGiuridica: text("analisi_giuridica"),
  guidaStrategica: text("guida_strategica"),
  analisiMaanBatna: text("analisi_maan_batna"),
  compatibilitaInteressi: text("compatibilita_interessi"),
  controlloBiasCognitivi: text("controllo_bias_cognitivi"),
  bozzaAccordo: text("bozza_accordo"),
  analisiEconomica: text("analisi_economica"),
  prospettoEconomico: text("prospetto_economico"),
  // Chat history
  chatHistory: jsonb("chat_history").$type<Array<{ role: string; content: string; timestamp: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalisiCasoSchema = createInsertSchema(analisiCasi).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalisiCaso = z.infer<typeof insertAnalisiCasoSchema>;
export type AnalisiCaso = typeof analisiCasi.$inferSelect;

// Storico calcoli indennità
export const calcoli = pgTable("calcoli", {
  id: serial("id").primaryKey(),
  valoreLite: real("valore_lite").notNull(),
  tipoMediazione: text("tipo_mediazione").notNull(),
  esito: text("esito").notNull(),
  tipoValore: text("tipo_valore").default("determinato"),
  risultato: jsonb("risultato"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalcoloSchema = createInsertSchema(calcoli).omit({
  id: true,
  createdAt: true,
});

export type InsertCalcolo = z.infer<typeof insertCalcoloSchema>;
export type Calcolo = typeof calcoli.$inferSelect;
