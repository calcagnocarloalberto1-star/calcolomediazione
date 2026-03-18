import { type AnalisiCaso, type InsertAnalisiCaso, type Calcolo, type InsertCalcolo } from "@shared/schema";

export interface IStorage {
  // Analisi
  createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso>;
  getAnalisi(id: number): Promise<AnalisiCaso | undefined>;
  getAllAnalisi(): Promise<AnalisiCaso[]>;
  updateAnalisi(id: number, data: Partial<AnalisiCaso>): Promise<AnalisiCaso | undefined>;
  deleteAnalisi(id: number): Promise<boolean>;
  // Calcoli
  createCalcolo(data: InsertCalcolo): Promise<Calcolo>;
  getAllCalcoli(): Promise<Calcolo[]>;
}

export class MemStorage implements IStorage {
  private analisi: Map<number, AnalisiCaso>;
  private calcoli: Map<number, Calcolo>;
  private nextAnalisiId: number;
  private nextCalcoloId: number;

  constructor() {
    this.analisi = new Map();
    this.calcoli = new Map();
    this.nextAnalisiId = 1;
    this.nextCalcoloId = 1;
  }

  async createAnalisi(data: InsertAnalisiCaso): Promise<AnalisiCaso> {
    const id = this.nextAnalisiId++;
    const analisi: AnalisiCaso = {
      id,
      titolo: data.titolo,
      descrizione: data.descrizione ?? null,
      tipoAnalisi: data.tipoAnalisi ?? "mediazione",
      valoreLite: data.valoreLite ?? null,
      tipoValore: data.tipoValore ?? "determinato",
      parti: data.parti ?? [],
      stato: data.stato ?? "in_corso",
      analisiGiuridica: data.analisiGiuridica ?? null,
      guidaStrategica: data.guidaStrategica ?? null,
      analisiMaanBatna: data.analisiMaanBatna ?? null,
      compatibilitaInteressi: data.compatibilitaInteressi ?? null,
      controlloBiasCognitivi: data.controlloBiasCognitivi ?? null,
      bozzaAccordo: data.bozzaAccordo ?? null,
      analisiEconomica: data.analisiEconomica ?? null,
      prospettoEconomico: data.prospettoEconomico ?? null,
      chatHistory: data.chatHistory ?? [],
      createdAt: new Date(),
    };
    this.analisi.set(id, analisi);
    return analisi;
  }

  async getAnalisi(id: number): Promise<AnalisiCaso | undefined> {
    return this.analisi.get(id);
  }

  async getAllAnalisi(): Promise<AnalisiCaso[]> {
    return Array.from(this.analisi.values()).sort((a, b) => b.id - a.id);
  }

  async updateAnalisi(id: number, data: Partial<AnalisiCaso>): Promise<AnalisiCaso | undefined> {
    const existing = this.analisi.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.analisi.set(id, updated);
    return updated;
  }

  async deleteAnalisi(id: number): Promise<boolean> {
    return this.analisi.delete(id);
  }

  async createCalcolo(data: InsertCalcolo): Promise<Calcolo> {
    const id = this.nextCalcoloId++;
    const calcolo: Calcolo = {
      id,
      valoreLite: data.valoreLite,
      tipoMediazione: data.tipoMediazione,
      esito: data.esito,
      tipoValore: data.tipoValore ?? "determinato",
      risultato: data.risultato ?? null,
      createdAt: new Date(),
    };
    this.calcoli.set(id, calcolo);
    return calcolo;
  }

  async getAllCalcoli(): Promise<Calcolo[]> {
    return Array.from(this.calcoli.values()).sort((a, b) => b.id - a.id);
  }
}

export const storage = new MemStorage();
