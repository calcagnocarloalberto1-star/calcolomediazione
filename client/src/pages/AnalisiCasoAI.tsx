import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoHead } from "@/components/SeoHead";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Brain, Plus, Trash2, Upload, FileText, Send, Loader2,
  CheckCircle, Clock, Download, RotateCcw, FileDown, Home,
  Shield, EyeOff, ChevronDown, ChevronUp, Eye, Scale, Award,
  History, FolderOpen, Trash, CalendarDays,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { apiRequest } from "@/lib/queryClient";
import type { AnalisiCaso } from "@shared/schema";
import { COEFFICIENTI_CATASTALI, type CategoriaCatastale } from "@shared/valore-catastale";

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  "Estrazione Entità (NER)",
  "Analisi Giuridica",
  "Guida Strategica",
  "Analisi MAAN/BATNA",
  "Compatibilità Interessi",
  "Bias Cognitivi e Analisi Decisionale",
  "Bozza Accordo",
  "Analisi Economica Comparativa",
];

const TEORIE_OPTIONS = [
  { id: "ancoraggio", label: "Ancoraggio" },
  { id: "avversione_perdita", label: "Avversione alla Perdita" },
  { id: "framing", label: "Framing" },
  { id: "overconfidence", label: "Overconfidence" },
  { id: "sunk_cost", label: "Sunk Cost" },
  { id: "availability", label: "Availability Bias" },
  { id: "teoria_giochi", label: "Teoria dei Giochi" },
  { id: "decision_analysis", label: "Decision Analysis" },
  { id: "mcda", label: "MCDA" },
  { id: "teoria_prospetto", label: "Teoria del Prospetto" },
];

const QUICK_ACTIONS = [
  "Approfondisci analisi giuridica",
  "Riformula bozza accordo",
  "Analizza rischi specifici",
  "Genera verbale mediazione",
];

// ─── GESTIONE TOKEN IN LOCALSTORAGE ─────────────────────────────────────────
// Chiave: "analisi_token_<id>" → valore: accessToken
// Chiave: "analisi_history" → valore: JSON array di {id, titolo, stato, createdAt, valoreLite, parti}

function saveToken(id: number, token: string) {
  try {
    localStorage.setItem(`analisi_token_${id}`, token);
  } catch {}
}

function getToken(id: number): string | null {
  try {
    return localStorage.getItem(`analisi_token_${id}`);
  } catch {
    return null;
  }
}

interface HistoryEntry {
  id: number;
  titolo: string;
  stato: string;
  createdAt: string;
  valoreLite?: number | null;
  parti?: Array<{ nome: string; ruolo: string }>;
}

function saveToHistory(entry: HistoryEntry) {
  try {
    const raw = localStorage.getItem("analisi_history");
    const list: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(e => e.id === entry.id);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    localStorage.setItem("analisi_history", JSON.stringify(list.slice(0, 50)));
  } catch {}
}

function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem("analisi_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function removeFromHistory(id: number) {
  try {
    const list = getHistory().filter(e => e.id !== id);
    localStorage.setItem("analisi_history", JSON.stringify(list));
    localStorage.removeItem(`analisi_token_${id}`);
  } catch {}
}

function updateHistoryEntry(analisi: AnalisiCaso) {
  saveToHistory({
    id: analisi.id,
    titolo: analisi.titolo,
    stato: analisi.stato ?? "in_corso",
    createdAt: analisi.createdAt ? String(analisi.createdAt) : new Date().toISOString(),
    valoreLite: analisi.valoreLite ? Number(analisi.valoreLite) : null,
    parti: (analisi.parti as Array<{ nome: string; ruolo: string }>) || [],
  });
}

// ─── HELPER API CON TOKEN ────────────────────────────────────────────────────
async function apiGetAnalisi(id: number): Promise<AnalisiCaso | null> {
  const token = getToken(id);
  if (!token) return null;
  try {
    const res = await fetch(`/api/analisi/${id}`, {
      headers: { "X-Access-Token": token },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function apiPostChat(id: number, message: string): Promise<{ response: string; chatHistory: any[] } | null> {
  const token = getToken(id);
  if (!token) return null;
  try {
    const res = await fetch(`/api/analisi/${id}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function apiDeleteAnalisi(id: number): Promise<boolean> {
  try {
    await apiRequest("DELETE", `/api/analisi/${id}`);
    return true;
  } catch {
    return false;
  }
}

// ─── TIPI ────────────────────────────────────────────────────────────────────
interface Party { nome: string; ruolo: string; }
interface ChatMessage { role: string; content: string; timestamp: string; }

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════
export default function AnalisiCasoAI() {
  // Form state
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [tipoAnalisi, setTipoAnalisi] = useState("mediazione");
  const [modalitaTariffaria, setModalitaTariffaria] = useState("nazionale");
  const [tipoValore, setTipoValore] = useState("determinato");
  const [valoreLite, setValoreLite] = useState("");
  const [parti, setParti] = useState<Party[]>([{ nome: "", ruolo: "istante" }, { nome: "", ruolo: "convenuto" }]);
  const [teorieSelezionate, setTeorieSelezionate] = useState<string[]>(TEORIE_OPTIONS.map(t => t.id));
  const [materiaImmobiliare, setMateriaImmobiliare] = useState(false);
  const [primaCasa, setPrimaCasa] = useState(true);
  const [renditaCatastaleAI, setRenditaCatastaleAI] = useState<string>("");
  const [categoriaCatastaleAI, setCategoriaCatastaleAI] = useState("prima_casa");
  const [gratuitoPatrocinio, setGratuitoPatrocinio] = useState(false);
  const [mediatoreEsperto, setMediatoreEsperto] = useState(false);
  const [proceduraComplessa, setProceduraComplessa] = useState(false);
  // ─── Costi notarili ──────────────────────────────────────────────────────
  const [attivaCalcoloCostiNotarili, setAttivaCalcoloCostiNotarili] = useState(false);
  const [valoreImmobile, setValoreImmobile] = useState<string>("");
  const [applicaPrezzoValore, setApplicaPrezzoValore] = useState(false);
  const [venditoreImpresaIva, setVenditoreImpresaIva] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Analysis state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analisi, setAnalisi] = useState<AnalisiCaso | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedTexts, setUploadedTexts] = useState<Array<{ filename: string; text: string; pages: number }>>([]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Export / view state
  const [exportingPdf, setExportingPdf] = useState(false);
  const [isAnonymized, setIsAnonymized] = useState(false);

  // ─── POLLING ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning || !analisi) return;
    const interval = setInterval(async () => {
      try {
        const data = await apiGetAnalisi(analisi.id);
        if (!data) return;
        setAnalisi(data);
        updateHistoryEntry(data);

        let completed = 0;
        if (data.prospettoEconomico) completed++;
        if (data.analisiGiuridica) completed++;
        if (data.guidaStrategica) completed++;
        if (data.analisiMaanBatna) completed++;
        if (data.compatibilitaInteressi) completed++;
        if (data.controlloBiasCognitivi) completed++;
        if (data.bozzaAccordo) completed++;
        if (data.analisiEconomica) completed++;
        setCurrentStep(completed);

        if (data.chatHistory && (data.chatHistory as any[]).length > 0 && chatMessages.length === 0) {
          setChatMessages(data.chatHistory as ChatMessage[]);
        }
        if (data.stato === "completata" || data.stato === "errore") {
          setIsRunning(false);
        }
      } catch (error) {
        console.error("Errore polling:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, analisi]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ─── GESTIONE PARTI ───────────────────────────────────────────────────────
  const addParty = () => setParti([...parti, { nome: "", ruolo: "terzo" }]);
  const removeParty = (i: number) => { if (parti.length > 2) setParti(parti.filter((_, j) => j !== i)); };
  const updateParty = (i: number, field: keyof Party, value: string) => {
    const updated = [...parti]; updated[i] = { ...updated[i], [field]: value }; setParti(updated);
  };
  const toggleTeoria = (id: string) => {
    setTeorieSelezionate(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  // ─── UPLOAD PDF ───────────────────────────────────────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    if (dropped.length > 0) { setFiles(prev => [...prev, ...dropped]); uploadPdfFiles(dropped); }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === "application/pdf");
      if (selected.length > 0) { setFiles(prev => [...prev, ...selected]); uploadPdfFiles(selected); }
    }
  };
  const uploadPdfFiles = async (newFiles: File[]) => {
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      newFiles.forEach(f => formData.append("files", f));
      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.files) setUploadedTexts(prev => [...prev, ...data.files]);
      }
    } catch (error) { console.error("Errore upload PDF:", error); }
    setUploadingFiles(false);
  };

  // ─── SUBMIT ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!titolo || descrizione.length < 50) return;
    setIsRunning(true); setCurrentStep(0);
    try {
      const documentiCombinati = uploadedTexts
        .map(d => `--- Documento: ${d.filename} (${d.pages} pagine) ---\n${d.text}`)
        .join("\n\n");

      const body = {
        titolo, descrizione, tipoAnalisi, modalitaTariffaria, tipoValore,
        valoreLite: tipoValore === "determinato" ? parseFloat(valoreLite) || null : null,
        parti: parti.filter(p => p.nome.trim()),
        teorieSelezionate, documentiText: documentiCombinati,
        materiaImmobiliare, primaCasa: materiaImmobiliare ? primaCasa : false,
        renditaCatastale: materiaImmobiliare && renditaCatastaleAI ? parseFloat(renditaCatastaleAI) : null,
        categoriaCatastale: materiaImmobiliare ? categoriaCatastaleAI : null,
        gratuitoPatrocinio, mediatoreEsperto, proceduraComplessa,
        // Costi notarili (motore notarile.ts)
        attivaCalcoloCostiNotarili: materiaImmobiliare && attivaCalcoloCostiNotarili,
        tipoAttoNotarile: "trasferimento_immobiliare",
        valoreImmobile:
          materiaImmobiliare && attivaCalcoloCostiNotarili && valoreImmobile
            ? parseFloat(valoreImmobile)
            : null,
        applicaPrezzoValore: materiaImmobiliare && attivaCalcoloCostiNotarili && applicaPrezzoValore,
        venditoreImpresaIva: materiaImmobiliare && attivaCalcoloCostiNotarili && venditoreImpresaIva,
      };

      const res = await apiRequest("POST", "/api/analisi", body);
      const data: AnalisiCaso & { accessToken?: string } = await res.json();

      // Salva il token — fondamentale per accedere all'analisi
      if (data.accessToken) {
        saveToken(data.id, data.accessToken);
      }
      // Salva nello storico locale
      updateHistoryEntry(data);
      setAnalisi(data);
    } catch (error) {
      console.error("Errore avvio analisi:", error);
      setIsRunning(false);
    }
  };

  // ─── CHAT ─────────────────────────────────────────────────────────────────
  const handleSendChat = async (message?: string) => {
    const msg = message || chatInput.trim();
    if (!msg || !analisi) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: msg, timestamp: new Date().toISOString() }]);
    setIsSending(true);
    try {
      const data = await apiPostChat(analisi.id, msg);
      if (data) {
        setChatMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: new Date().toISOString() }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Errore nella risposta AI. Riprova.", timestamp: new Date().toISOString() }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Errore nella risposta AI. Riprova.", timestamp: new Date().toISOString() }]);
    }
    setIsSending(false);
  };

  // ─── EXPORT PDF ───────────────────────────────────────────────────────────
  const handleExportPdf = async () => {
    if (!analisi) return;
    setExportingPdf(true);
    const token = getToken(analisi.id);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
      const anonParam = isAnonymized ? "?anonimizza=1" : "";
      const res = await fetch(`/api/analisi/${analisi.id}/pdf${anonParam}`, {
        signal: controller.signal,
        headers: token ? { "X-Access-Token": token } : {},
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const prefix = isAnonymized ? "anonimo-" : "";
      a.download = `${prefix}analisi-${analisi.titolo.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof Error && error.name === "AbortError";
      alert(isTimeout
        ? "Timeout: la generazione PDF ha superato i 25 secondi."
        : `Errore generazione PDF: ${error instanceof Error ? error.message : "sconosciuto"}.`);
    }
    setExportingPdf(false);
  };

  // ─── EXPORT TXT ───────────────────────────────────────────────────────────
  const cleanExportText = (text: string): string => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "").replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "").replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
      .replace(/[\u2713\u2714\u2705\u2611]/g, "[OK]").replace(/[\u2717\u2718\u274C]/g, "[NO]")
      .replace(/[\u2022\u25CF\u25CB\u25A0]/g, "-").replace(/[\u2192\u2794\u27A1\u279C]/g, "->")
      .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
      .replace(/[^\S\n]{2,}/g, " ").trim();
  };

  const handleExportText = () => {
    if (!analisi) return;
    const t = (text: string | null | undefined) => anonymizeText(text) || "";
    const raw = [
      `# Analisi AI - ${t(analisi.titolo)}`,
      isAnonymized ? "(VERSIONE ANONIMIZZATA)" : "",
      `Data: ${new Date().toLocaleDateString("it-IT")}`, "",
      analisi.prospettoEconomico ? `## Estrazione Entita (NER)\n\n${t(analisi.prospettoEconomico)}` : "",
      analisi.analisiGiuridica ? `## Analisi Giuridica\n\n${t(analisi.analisiGiuridica)}` : "",
      analisi.guidaStrategica ? `## Guida Strategica\n\n${t(analisi.guidaStrategica)}` : "",
      analisi.analisiMaanBatna ? `## Analisi MAAN/BATNA\n\n${t(analisi.analisiMaanBatna)}` : "",
      analisi.compatibilitaInteressi ? `## Compatibilita Interessi\n\n${t(analisi.compatibilitaInteressi)}` : "",
      analisi.controlloBiasCognitivi ? `## Controllo Bias Cognitivi\n\n${t(analisi.controlloBiasCognitivi)}` : "",
      analisi.bozzaAccordo ? `## Bozza Accordo\n\n${t(analisi.bozzaAccordo)}` : "",
      analisi.analisiEconomica ? `## Analisi Economica Comparativa\n\n${t(analisi.analisiEconomica)}` : "",
      "", "---", "Documento generato da CalcoloMediazione - Analisi AI",
    ].filter(Boolean).join("\n\n");

    const blob = new Blob([cleanExportText(raw)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const prefix = isAnonymized ? "anonimo-" : "";
    a.download = `${prefix}analisi-${analisi.titolo.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── NUOVA ANALISI ────────────────────────────────────────────────────────
  const handleNewAnalysis = () => {
    setAnalisi(null); setIsRunning(false); setCurrentStep(0);
    setChatMessages([]); setChatInput(""); setTitolo(""); setDescrizione("");
    setFiles([]); setUploadedTexts([]); setUploadingFiles(false); setIsAnonymized(false);
  };

  // ─── ANONIMIZZAZIONE ──────────────────────────────────────────────────────
  const anonymizeText = (text: string | null | undefined): string => {
    if (!text || !isAnonymized || !analisi) return text || "";
    const partiList = (analisi.parti as Array<{ nome: string; ruolo: string }>) || [];
    const labels = ["Parte A", "Parte B", "Parte C", "Parte D", "Parte E", "Parte F"];
    let result = text;
    partiList.forEach((p, i) => {
      if (p.nome?.trim()) {
        const nome = p.nome.trim();
        const label = labels[i] || `Parte ${String.fromCharCode(65 + i)}`;
        result = result.replace(new RegExp(nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), label);
        const parts = nome.split(/\s+/);
        if (parts.length > 1) {
          const cognome = parts[parts.length - 1];
          if (cognome.length >= 3) {
            result = result.replace(new RegExp(`\\b${cognome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), label);
          }
        }
      }
    });
    return result;
  };

  const progressPercent = (currentStep / PIPELINE_STEPS.length) * 100;

  // ═══════════════════════════════════════════════════════════════════════════
  // VISTA RISULTATI
  // ═══════════════════════════════════════════════════════════════════════════
  if (analisi && (analisi.stato === "completata" || currentStep > 0)) {
    return (
      <div className="min-h-screen py-8 px-4">
      <SeoHead
        title="Analisi AI del Caso di Mediazione — Estrazione Entità, Strategia e Costi"
        description="Analisi automatica del caso di mediazione con intelligenza artificiale: estrazione entità, analisi giuridica, strategia di mediazione, stima dei costi e generazione documenti."
        canonical="https://calcolomediazione.it/analisi-caso-ai"
      />
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }} data-testid="text-analisi-title">
                  {analisi.titolo}
                </h1>
                <Badge className={`text-xs border ${analisi.stato === "completata" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}`}>
                  {analisi.stato === "completata" ? "Completata" : "In corso..."}
                </Badge>
                {isAnonymized && <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-300 border ml-2">Anonimizzato</Badge>}
              </div>
            </div>
            {analisi.stato === "completata" && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" onClick={handleExportPdf} disabled={exportingPdf}
                  className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                  data-testid="button-export-pdf">
                  {exportingPdf ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileDown className="w-3 h-3 mr-1" />}
                  Esporta PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportText}
                  className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                  data-testid="button-export-md">
                  <Download className="w-3 h-3 mr-1" />Esporta TXT
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsAnonymized(!isAnonymized)}
                  className={`text-xs border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 ${isAnonymized ? "border-primary bg-primary/10" : "border-foreground"}`}
                  data-testid="button-anonimizza">
                  <EyeOff className="w-3 h-3 mr-1" />{isAnonymized ? "Dati reali" : "Anonimizza"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleNewAnalysis}
                  className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                  data-testid="button-new-analysis">
                  <RotateCcw className="w-3 h-3 mr-1" />Nuova Analisi
                </Button>
              </div>
            )}
          </div>

          {/* Progress */}
          {isRunning && (
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6" data-testid="card-progress">
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Analisi in corso...</span>
                  <span className="text-sm font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currentStep}/{PIPELINE_STEPS.length}</span>
                </div>
                <Progress value={progressPercent} className="h-3 mb-4 border border-foreground" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PIPELINE_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-2 text-sm">
                      {i < currentStep ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        : i === currentStep ? <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                        : <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                      <span className={i < currentStep ? "text-foreground" : i === currentStep ? "text-primary font-semibold" : "text-muted-foreground"}>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs risultati */}
          <Tabs defaultValue="ner" className="mb-8" data-testid="tabs-risultati">
            <TabsList className="flex flex-wrap gap-1 h-auto bg-muted border-2 border-foreground p-1">
              {[
                { value: "ner", label: "NER" }, { value: "giuridica", label: "Giuridica" },
                { value: "strategica", label: "Strategica" }, { value: "maan", label: "MAAN/BATNA" },
                { value: "interessi", label: "Interessi" }, { value: "bias", label: "Bias" },
                { value: "accordo", label: "Accordo" }, { value: "economica", label: "Economica" },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  data-testid={`tab-${tab.value}`}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {[
              { value: "ner", content: analisi.prospettoEconomico, label: "Estrazione entità in corso..." },
              { value: "giuridica", content: analisi.analisiGiuridica, label: "Analisi giuridica in corso..." },
              { value: "strategica", content: analisi.guidaStrategica, label: "Guida strategica in corso..." },
              { value: "maan", content: analisi.analisiMaanBatna, label: "Analisi MAAN/BATNA in corso..." },
              { value: "interessi", content: analisi.compatibilitaInteressi, label: "Analisi compatibilità in corso..." },
              { value: "bias", content: analisi.controlloBiasCognitivi, label: "Controllo bias cognitivi in corso..." },
              { value: "accordo", content: analisi.bozzaAccordo, label: "Generazione bozza accordo in corso..." },
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="pt-6">
                    {tab.content ? <MarkdownRenderer content={anonymizeText(tab.content)} />
                      : <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin" /><span>{tab.label}</span></div>}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="economica">
              <Card className="border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="border-b-2 border-primary bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-foreground">
                      <span className="text-primary-foreground text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>€</span>
                    </span>
                    Analisi Economica Comparativa
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {analisi.analisiEconomica ? <MarkdownRenderer content={anonymizeText(analisi.analisiEconomica)} />
                    : <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin" /><span>Analisi economica comparativa in corso...</span></div>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Chat */}
          {analisi.stato === "completata" && (
            <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-chat">
              <CardHeader>
                <CardTitle className="text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Chat con AI — Approfondisci l'analisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {QUICK_ACTIONS.map(action => (
                    <Button key={action} variant="outline" size="sm" onClick={() => handleSendChat(action)}
                      className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150">
                      {action}
                    </Button>
                  ))}
                </div>
                <div className="min-h-[200px] max-h-[400px] overflow-y-auto border-2 border-foreground p-4 mb-4 space-y-4 bg-muted/30">
                  {chatMessages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">Fai una domanda o usa le azioni rapide sopra per approfondire l'analisi.</p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] p-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground border-2 border-foreground" : "bg-card border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}`}>
                        {msg.role === "assistant" ? <MarkdownRenderer content={anonymizeText(msg.content)} /> : anonymizeText(msg.content)}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-card border-2 border-foreground p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Loader2 className="w-4 h-4 animate-spin" /></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2">
                  <Input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendChat()}
                    placeholder="Scrivi una domanda..." className="border-2 border-foreground" data-testid="input-chat" />
                  <Button onClick={() => handleSendChat()} disabled={!chatInput.trim() || isSending}
                    className="border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                    data-testid="button-send-chat">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VISTA FORM
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }} data-testid="text-analisi-page-title">
              Analisi Caso AI
            </h1>
          </div>
          <p className="text-muted-foreground">Analisi completa del caso con intelligenza artificiale: estrazione entità, analisi giuridica, guida strategica e bozza accordo.</p>
        </div>

        {/* Storico */}
        <StoricoAnalisi onLoadAnalisi={(a) => {
          setAnalisi(a);
          let completed = 0;
          if (a.prospettoEconomico) completed++;
          if (a.analisiGiuridica) completed++;
          if (a.guidaStrategica) completed++;
          if (a.analisiMaanBatna) completed++;
          if (a.compatibilitaInteressi) completed++;
          if (a.controlloBiasCognitivi) completed++;
          if (a.bozzaAccordo) completed++;
          if (a.analisiEconomica) completed++;
          setCurrentStep(completed);
          if (a.stato === "in_corso") setIsRunning(true);
          if (a.chatHistory && (a.chatHistory as any[]).length > 0) setChatMessages(a.chatHistory as ChatMessage[]);
        }} />

        <ExampleOutputPreview />

        <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-testid="card-analisi-form">
          <CardContent className="pt-6 space-y-6">
            {/* Titolo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Titolo del Caso</Label>
              <Input value={titolo} onChange={e => setTitolo(e.target.value)}
                placeholder="Es. Controversia condominiale per infiltrazioni"
                className="border-2 border-foreground" data-testid="input-titolo" />
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Descrizione del Caso <span className="text-muted-foreground font-normal ml-2">(min. 50 caratteri)</span></Label>
              <Textarea value={descrizione} onChange={e => setDescrizione(e.target.value)}
                placeholder="Descrivi il caso in dettaglio: parti coinvolte, fatti, pretese, documenti rilevanti..."
                rows={5} className="border-2 border-foreground resize-none" data-testid="input-descrizione" />
              <div className="text-xs text-muted-foreground text-right">{descrizione.length}/50 caratteri min.</div>
            </div>

            {/* Tipo + Tariffario + Valore */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Analisi</Label>
                <Select value={tipoAnalisi} onValueChange={setTipoAnalisi}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-tipo-analisi"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="mediazione">Mediazione</SelectItem>
                    <SelectItem value="negoziazione_assistita">Negoziazione Assistita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tariffario</Label>
                <Select value={modalitaTariffaria} onValueChange={setModalitaTariffaria}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-analisi-tariffario"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="nazionale">Nazionale (D.M. 150/2023)</SelectItem>
                    <SelectItem value="coa_genova">COA Genova</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo Valore</Label>
                <Select value={tipoValore} onValueChange={setTipoValore}>
                  <SelectTrigger className="border-2 border-foreground" data-testid="select-analisi-tipo-valore"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-foreground">
                    <SelectItem value="determinato">Determinato</SelectItem>
                    <SelectItem value="indeterminabile_basso">Indeterminabile — basso</SelectItem>
                    <SelectItem value="indeterminabile_medio">Indeterminabile — medio</SelectItem>
                    <SelectItem value="indeterminabile_alto">Indeterminabile — alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {tipoValore === "determinato" && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Valore della Lite (€)</Label>
                <Input type="number" value={valoreLite} onChange={e => setValoreLite(e.target.value)}
                  placeholder="Es. 50000" className="border-2 border-foreground font-mono"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="input-analisi-valore" />
              </div>
            )}

            {/* Opzioni Economiche */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Opzioni per l'Analisi Economica</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-2 border-foreground/20 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Switch checked={materiaImmobiliare} onCheckedChange={setMateriaImmobiliare} data-testid="switch-analisi-immobiliare" />
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{materiaImmobiliare ? "Materia immobiliare" : "Non immobiliare"}</span>
                  </div>
                </div>
                {materiaImmobiliare && (
                  <div className="flex items-center gap-3">
                    <Switch checked={primaCasa} onCheckedChange={val => { setPrimaCasa(val); setCategoriaCatastaleAI(val ? "prima_casa" : "altri_fabbricati_ac"); }} data-testid="switch-analisi-prima-casa" />
                    <span className="text-sm">{primaCasa ? "Prima casa (registro 2%)" : "Seconda casa (registro 9%)"}</span>
                  </div>
                )}
                {materiaImmobiliare && (
                  <div className="sm:col-span-3 p-3 border-2 border-foreground/20 bg-muted/20 space-y-3">
                    <div className="flex items-center gap-3">
                      <Switch checked={attivaCalcoloCostiNotarili} onCheckedChange={setAttivaCalcoloCostiNotarili} data-testid="switch-analisi-costi-notarili" />
                      <span className="text-sm font-semibold">{attivaCalcoloCostiNotarili ? "Costi notarili: ATTIVI" : "Calcolo costi notarili"}</span>
                    </div>
                    {attivaCalcoloCostiNotarili && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Valore immobile / prezzo (€)</Label>
                          <Input type="number" value={valoreImmobile} onChange={e => setValoreImmobile(e.target.value)}
                            placeholder="Es. 110000" className="border-2 border-foreground/50 font-mono text-sm h-9"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="input-valore-immobile-ai" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch checked={applicaPrezzoValore} onCheckedChange={setApplicaPrezzoValore} data-testid="switch-prezzo-valore" />
                          <span className="text-xs">{applicaPrezzoValore ? "Prezzo-valore (L. 296/2006)" : "Base = prezzo"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch checked={venditoreImpresaIva} onCheckedChange={setVenditoreImpresaIva} data-testid="switch-venditore-impresa" />
                          <span className="text-xs">{venditoreImpresaIva ? "Acquisto da impresa (IVA)" : "Acquisto da privato"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {materiaImmobiliare && (
                  <div className="sm:col-span-3 p-3 border-2 border-foreground/20 bg-muted/20 space-y-3">
                    <span className="text-xs font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verifica Congruità Catastale (art. 29 D.M. 150/2023)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Rendita catastale (€)</Label>
                        <Input type="number" value={renditaCatastaleAI} onChange={e => setRenditaCatastaleAI(e.target.value)}
                          placeholder="Es. 925.00" className="border-2 border-foreground/50 font-mono text-sm h-9"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="input-rendita-catastale-ai" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tipologia immobile</Label>
                        <Select value={categoriaCatastaleAI} onValueChange={setCategoriaCatastaleAI}>
                          <SelectTrigger className="border-2 border-foreground/50 text-sm h-9" data-testid="select-categoria-ai"><SelectValue /></SelectTrigger>
                          <SelectContent className="border-2 border-foreground">
                            {Object.entries(COEFFICIENTI_CATASTALI).map(([key, val]) => (
                              <SelectItem key={key} value={key}>{val.label} (×{val.moltiplicatore})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Switch checked={gratuitoPatrocinio} onCheckedChange={setGratuitoPatrocinio} data-testid="switch-analisi-gp" />
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{gratuitoPatrocinio ? "Gratuito patrocinio" : "No patrocinio"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-2 border-foreground/20 bg-muted/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Maggiorazioni art. 31, co. 3</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={mediatoreEsperto} onCheckedChange={setMediatoreEsperto} data-testid="switch-analisi-mediatore-esperto" />
                    <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Mediatore esperto</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={proceduraComplessa} onCheckedChange={setProceduraComplessa} data-testid="switch-analisi-procedura-complessa" />
                    <div className="flex items-center gap-1.5"><Scale className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Procedura complessa</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parti */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Parti Coinvolte</Label>
                <Button variant="outline" size="sm" onClick={addParty}
                  className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" data-testid="button-add-party">
                  <Plus className="w-3 h-3 mr-1" />Aggiungi Parte
                </Button>
              </div>
              {parti.map((p, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input value={p.nome} onChange={e => updateParty(i, "nome", e.target.value)}
                      placeholder={`Nome parte ${i + 1}`} className="border-2 border-foreground" data-testid={`input-party-nome-${i}`} />
                  </div>
                  <div className="w-40">
                    <Select value={p.ruolo} onValueChange={v => updateParty(i, "ruolo", v)}>
                      <SelectTrigger className="border-2 border-foreground" data-testid={`select-party-ruolo-${i}`}><SelectValue /></SelectTrigger>
                      <SelectContent className="border-2 border-foreground">
                        <SelectItem value="istante">Istante</SelectItem>
                        <SelectItem value="convenuto">Convenuto</SelectItem>
                        <SelectItem value="terzo">Terzo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {parti.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeParty(i)}
                      className="flex-shrink-0 text-destructive" data-testid={`button-remove-party-${i}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Documenti (PDF)</Label>
              <div className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-150 ${dragActive ? "border-primary bg-primary/5" : "border-foreground/40 hover:border-foreground"}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()} data-testid="dropzone-files">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Trascina i file PDF qui o <span className="text-primary font-semibold">sfoglia</span></p>
                <input id="file-input" type="file" accept=".pdf" multiple onChange={handleFileInput} className="hidden" />
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((f, i) => {
                    const uploadInfo = uploadedTexts.find(u => u.filename === f.name);
                    return (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1.5 border border-foreground/20 py-1 px-2">
                        {!uploadInfo && uploadingFiles ? <Loader2 className="w-3 h-3 animate-spin text-primary" />
                          : uploadInfo ? <CheckCircle className="w-3 h-3 text-green-600" />
                          : <FileText className="w-3 h-3" />}
                        <span className="max-w-[150px] truncate">{f.name}</span>
                        {uploadInfo && <span className="text-xs text-muted-foreground font-mono">({uploadInfo.pages}p)</span>}
                        <button onClick={e => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); setUploadedTexts(prev => prev.filter(u => u.filename !== f.name)); }}
                          className="ml-1 hover:text-destructive">×</button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Teorie */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Teorie Cognitive e Framework Decisionali</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {TEORIE_OPTIONS.map(teoria => (
                  <div key={teoria.id} className="flex items-center gap-2" data-testid={`checkbox-teoria-${teoria.id}`}>
                    <Checkbox id={teoria.id} checked={teorieSelezionate.includes(teoria.id)}
                      onCheckedChange={() => toggleTeoria(teoria.id)} className="border-2 border-foreground" />
                    <label htmlFor={teoria.id} className="text-sm cursor-pointer">{teoria.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button onClick={handleSubmit} disabled={!titolo || descrizione.length < 50 || isRunning}
              className="w-full py-6 text-base font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              data-testid="button-avvia-analisi">
              {isRunning ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analisi in corso...</>
                : <><Brain className="w-5 h-5 mr-2" />Avvia Analisi AI</>}
            </Button>

            <div className="mt-6 text-xs text-muted-foreground bg-muted/50 p-4 border border-foreground/10" data-testid="text-disclaimer-ai">
              <div className="flex items-start gap-2">
                <Scale className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Criteri di calcolo e avvertenza legale</p>
                  <p className="mb-2"><strong>Compensi avvocato:</strong> le stime dei compensi legali nell'analisi economica sono basate sui <strong>valori medi</strong> previsti dal D.M. 55/2014 (aggiornato D.M. 147/2022). Il compenso effettivo può variare significativamente in base alla complessità della causa.</p>
                  <p><strong>Avvertenza:</strong> l'analisi generata dall'intelligenza artificiale e tutti i calcoli forniti hanno finalità esclusivamente informativa e orientativa. Non costituiscono consulenza legale. Per una valutazione precisa, si raccomanda di consultare un avvocato o un professionista abilitato.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STORICO ANALISI — legge da localStorage, non dall'API pubblica
// ═══════════════════════════════════════════════════════════════════════════
function StoricoAnalisi({ onLoadAnalisi }: { onLoadAnalisi: (a: AnalisiCaso) => void }) {
  const [open, setOpen] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadHistory = () => {
    setHistoryList(getHistory());
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadHistory();
  };

  const handleLoad = async (id: number) => {
    setLoading(id);
    const data = await apiGetAnalisi(id);
    if (data) {
      onLoadAnalisi(data);
      // Aggiorna lo storico con lo stato attuale
      updateHistoryEntry(data);
      setHistoryList(getHistory());
    } else {
      alert("Analisi non trovata o token scaduto. Potrebbe essere necessario ricrearla.");
    }
    setLoading(null);
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await apiDeleteAnalisi(id);
    removeFromHistory(id);
    setHistoryList(getHistory());
    setDeleting(null);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const total = historyList.length;
  const completed = historyList.filter(a => a.stato === "completata").length;

  return (
    <Card className="border-2 border-foreground/30 bg-card mb-6" data-testid="card-storico-analisi">
      <button onClick={handleToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors duration-150"
        data-testid="button-toggle-storico">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <div>
            <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Storico Analisi</span>
            <span className="block text-xs text-muted-foreground">
              {total > 0 ? `${total} analis${total === 1 ? "i" : "i"} salvat${total === 1 ? "a" : "e"} (${completed} completat${completed === 1 ? "a" : "e"})` : "Carica analisi precedenti"}
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-6">
          {historyList.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nessuna analisi precedente su questo dispositivo.</p>
              <p className="text-xs mt-1">Le analisi vengono salvate automaticamente qui.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {historyList.map(a => (
                <div key={a.id}
                  className="flex items-start gap-3 p-3 border-2 border-foreground/15 hover:border-foreground/30 transition-colors duration-150"
                  data-testid={`storico-item-${a.id}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{a.titolo}</span>
                      <Badge className={`text-[10px] flex-shrink-0 border ${a.stato === "completata" ? "bg-green-100 text-green-800 border-green-300" : a.stato === "errore" ? "bg-red-100 text-red-800 border-red-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}`}>
                        {a.stato}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatDate(a.createdAt)}</span>
                      {a.valoreLite && <span className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>EUR {Number(a.valoreLite).toLocaleString("it-IT")}</span>}
                      {a.parti && a.parti.length > 0 && <span className="truncate max-w-[200px]">{a.parti.map(p => p.nome).filter(Boolean).join(" vs ")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleLoad(a.id)} disabled={loading === a.id}
                      className="text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      data-testid={`button-load-${a.id}`}>
                      {loading === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <FolderOpen className="w-3 h-3 mr-1" />}
                      Apri
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                      className="text-xs text-muted-foreground hover:text-destructive" data-testid={`button-delete-${a.id}`}>
                      {deleting === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE OUTPUT PREVIEW
// ═══════════════════════════════════════════════════════════════════════════
const EXAMPLE_SECTIONS = [
  { step: 1, title: "Estrazione Entità (NER)", content: "**Parti identificate:**\n- **Rossi Mario** (Istante) — proprietario unità immobiliare piano 2°\n- **Condominio Via Garibaldi 15** (Convenuto)\n\n**Importi rilevanti:**\n| Voce | Importo |\n|---|---|\n| Danno da infiltrazioni | € 35.000 |\n| Preventivo riparazione | € 12.500 |" },
  { step: 2, title: "Analisi Giuridica", content: "**Materia:** Condominio (art. 5, co. 1, D.Lgs. 28/2010) — Mediazione obbligatoria\n\n**Inquadramento normativo:**\nLa controversia rientra nella responsabilità del condominio per danni derivanti da parti comuni (art. 1117 c.c.)." },
  { step: 3, title: "Guida Strategica", content: "**Strategia negoziale consigliata: Approccio collaborativo con ZOPA identificata**\n\n1. Presentare la quantificazione completa con documentazione a supporto\n2. ZOPA stimata: € 20.000 – € 28.000\n3. Evidenziare i costi della causa ordinaria vs. il costo della mediazione" },
  { step: 8, title: "Analisi Economica Comparativa", content: "| Voce | Mediazione | Causa Civile |\n|---|---|---|\n| Indennità organismo / C.U. | € 528 | € 518 |\n| Compenso avvocato | € 2.847 | € 5.936 |\n| **Totale** | **€ 3.375** | **€ 9.004** |\n\n**Risparmio con mediazione: € 6.229 (69%)**" },
];

function ExampleOutputPreview() {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-2 border-dashed border-primary/40 bg-primary/5 mb-6" data-testid="card-example-output">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/10 transition-colors duration-150"
        data-testid="button-toggle-example">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-primary" />
          <div>
            <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Esempio di Output dell'Analisi AI</span>
            <span className="block text-xs text-muted-foreground">Caso dimostrativo: controversia condominiale per infiltrazioni (€ 35.000)</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4">
          <p className="text-xs text-muted-foreground bg-muted/50 p-3 border border-foreground/10">
            Questo è un esempio dimostrativo. L'analisi reale produce 8 sezioni complete personalizzate sul caso inserito.
          </p>
          {EXAMPLE_SECTIONS.map(section => (
            <div key={section.step} className="border-2 border-foreground/20 bg-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-muted/30">
                <span className="w-6 h-6 bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold border border-foreground">{section.step}</span>
                <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{section.title}</span>
              </div>
              <div className="px-4 py-3 text-sm"><MarkdownRenderer content={section.content} /></div>
            </div>
          ))}
          <div className="text-center pt-2">
            <Badge variant="outline" className="border-primary/30 text-primary">+ 4 sezioni aggiuntive: MAAN/BATNA, Compatibilità Interessi, Bias Cognitivi, Bozza Accordo</Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
