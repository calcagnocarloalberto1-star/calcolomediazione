import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Server, Users, Eye, Brain, Calculator, FileText, MessageSquare, Upload, LogOut, RefreshCw, Lock, BarChart2, Activity } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminStats {
  uptime: string;
  startTime: string;
  counters: {
    totalPageViews: number;
    analisiAiCreate: number;
    analisiAiComplete: number;
    analisiAiError: number;
    calcoliEffettuati: number;
    pdfExported: number;
    chatMessages: number;
    uploadPdf: number;
    pageViews: Record<string, number>;
  };
  uniqueVisitors24h: number;
  pageViews24h: number;
  last7Days: Record<string, number>;
  last24hHourly: Record<string, number>;
  topPages: [string, number][];
  recentActivity: { timestamp: string; type: string; path: string }[];
  totalEntries: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EVENT_LABELS: Record<string, string> = {
  page_view: "Vista pagina",
  analisi_ai: "Analisi AI avviata",
  analisi_complete: "Analisi AI completata",
  analisi_error: "Analisi AI errore",
  calcolo: "Calcolo indennità",
  pdf_export: "Export PDF",
  chat_message: "Messaggio chat",
  upload_pdf: "Upload PDF",
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/calcolatore": "Calcolatore",
  "/analisi-caso-ai": "Analisi AI",
  "/faq": "FAQ",
  "/guida-dm-150": "Guida DM 150",
  "/confronto-costi": "Confronto Costi",
  "/chi-siamo": "Chi Siamo",
  "/contatti": "Contatti",
  "/glossario": "Glossario",
  "/generatore-procura": "Generatore Procura",
  "/giurisprudenza": "Giurisprudenza",
  "/credito-imposta": "Credito d'Imposta",
};

const GIORNO_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

function formatDateIT(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${GIORNO_IT[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "medium" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#c55a2b",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #2d2926",
        boxShadow: "4px 4px 0 #2d2926",
        padding: "20px 24px",
        borderRadius: 0,
      }}
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={20} color={color} strokeWidth={2.5} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b6b6b", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 700, color: "#2d2926", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9a9a9a", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function BarChartCSS({
  data,
  labelFn,
}: {
  data: [string, number][];
  labelFn?: (key: string) => string;
}) {
  const maxVal = Math.max(...data.map(([, v]) => v), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {data.map(([key, val]) => (
        <div
          key={key}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          title={`${labelFn ? labelFn(key) : key}: ${val}`}
        >
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#2d2926", fontWeight: 600 }}>
            {val}
          </span>
          <div
            style={{
              width: "100%",
              height: Math.max((val / maxVal) * 80, val > 0 ? 4 : 0),
              background: val > 0 ? "#c55a2b" : "#e8e0d8",
              border: val > 0 ? "2px solid #2d2926" : "2px solid #ccc",
              boxShadow: val > 0 ? "2px 2px 0 #2d2926" : "none",
              transition: "height 0.3s ease",
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              color: "#6b6b6b",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {labelFn ? labelFn(key) : key}
          </span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#2d2926", fontWeight: 500 }}>
          {PAGE_LABELS[label] || label}
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#c55a2b", fontWeight: 700 }}>
          {value}
        </span>
      </div>
      <div style={{ height: 12, background: "#e8e0d8", border: "1.5px solid #2d2926", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: "#c55a2b",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd });
      return res.json() as Promise<{ success: boolean; token: string }>;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setLoginError("");
    },
    onError: () => {
      setLoginError("Password errata. Riprova.");
    },
  });

  // Stats query
  const {
    data: statsData,
    isLoading,
    refetch,
    isError,
  } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats", token],
    queryFn: async () => {
      if (!token) throw new Error("Non autorizzato");
      const res = await fetch(`${("__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__")}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Non autorizzato");
      return res.json();
    },
    enabled: !!token,
    refetchInterval: false,
    staleTime: 0,
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [token, refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastRefresh(new Date());
  }, [refetch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  const handleLogout = () => {
    setToken(null);
    setPassword("");
    queryClient.removeQueries({ queryKey: ["/api/admin/stats"] });
  };

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f0eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "3px solid #2d2926",
            boxShadow: "8px 8px 0 #2d2926",
            padding: "40px 48px",
            maxWidth: 400,
            width: "100%",
            borderRadius: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <Lock size={28} color="#c55a2b" strokeWidth={2.5} />
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 700, color: "#2d2926", margin: 0 }}>
              Admin Dashboard
            </h1>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#2d2926", display: "block", marginBottom: 6 }}
              >
                Password amministratore
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la password..."
                data-testid="input-admin-password"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "2px solid #2d2926",
                  borderRadius: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  background: "#f5f0eb",
                  color: "#2d2926",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "2px solid #dc2626",
                  padding: "8px 12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#dc2626",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              data-testid="button-admin-login"
              style={{
                background: "#c55a2b",
                color: "#fff",
                border: "2px solid #2d2926",
                boxShadow: "4px 4px 0 #2d2926",
                padding: "12px 24px",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
                borderRadius: 0,
                opacity: loginMutation.isPending ? 0.7 : 1,
              }}
            >
              {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", padding: "32px 24px", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 800, color: "#2d2926", margin: 0 }}
          >
            Pannello Amministrazione
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b6b6b", margin: "4px 0 0" }}>
            Aggiornamento automatico ogni 30 secondi · Ultimo: {lastRefresh.toLocaleTimeString("it-IT")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleRefresh}
            data-testid="button-refresh-stats"
            style={{
              background: "#fff",
              color: "#2d2926",
              border: "2px solid #2d2926",
              boxShadow: "3px 3px 0 #2d2926",
              padding: "8px 16px",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RefreshCw size={14} />
            Aggiorna
          </button>
          <button
            onClick={handleLogout}
            data-testid="button-logout"
            style={{
              background: "#2d2926",
              color: "#fff",
              border: "2px solid #2d2926",
              boxShadow: "3px 3px 0 #6b6b6b",
              padding: "8px 16px",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LogOut size={14} />
            Disconnetti
          </button>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", padding: 80, fontFamily: "Inter, sans-serif", color: "#6b6b6b" }}>
          Caricamento statistiche...
        </div>
      )}

      {isError && (
        <div
          style={{
            background: "#fef2f2",
            border: "2px solid #dc2626",
            padding: "16px 24px",
            color: "#dc2626",
            fontFamily: "Inter, sans-serif",
            marginBottom: 24,
          }}
        >
          Errore nel caricamento delle statistiche. Sessione scaduta?
        </div>
      )}

      {statsData && (
        <>
          {/* Row 1 — Key metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <StatCard
              icon={Server}
              label="Uptime Server"
              value={statsData.uptime}
              sub={`Avviato il ${new Date(statsData.startTime).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}`}
            />
            <StatCard
              icon={Users}
              label="Visitatori Unici (24h)"
              value={statsData.uniqueVisitors24h}
              sub="IP unici nelle ultime 24 ore"
            />
            <StatCard
              icon={Eye}
              label="Visite Pagina (24h)"
              value={statsData.pageViews24h}
              sub={`Totale: ${statsData.counters.totalPageViews}`}
            />
            <StatCard
              icon={Brain}
              label="Analisi AI Totali"
              value={statsData.counters.analisiAiCreate}
              sub={`Completate: ${statsData.counters.analisiAiComplete} · Errori: ${statsData.counters.analisiAiError}`}
            />
          </div>

          {/* Row 2 — Feature usage */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <StatCard
              icon={Calculator}
              label="Calcoli Indennità"
              value={statsData.counters.calcoliEffettuati}
            />
            <StatCard
              icon={FileText}
              label="PDF Esportati"
              value={statsData.counters.pdfExported}
            />
            <StatCard
              icon={MessageSquare}
              label="Messaggi Chat AI"
              value={statsData.counters.chatMessages}
            />
            <StatCard
              icon={Upload}
              label="Upload PDF"
              value={statsData.counters.uploadPdf}
            />
          </div>

          {/* Row 3 — Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* 7-day bar chart */}
            <div
              style={{
                background: "#fff",
                border: "2px solid #2d2926",
                boxShadow: "4px 4px 0 #2d2926",
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <BarChart2 size={18} color="#c55a2b" />
                <h2
                  style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 700, color: "#2d2926", margin: 0 }}
                >
                  Visite Ultimi 7 Giorni
                </h2>
              </div>
              <BarChartCSS
                data={Object.entries(statsData.last7Days)}
                labelFn={(key) => formatDateIT(key)}
              />
            </div>

            {/* Top pages */}
            <div
              style={{
                background: "#fff",
                border: "2px solid #2d2926",
                boxShadow: "4px 4px 0 #2d2926",
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <BarChart2 size={18} color="#c55a2b" />
                <h2
                  style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 700, color: "#2d2926", margin: 0 }}
                >
                  Pagine Più Visitate
                </h2>
              </div>
              {statsData.topPages.length === 0 ? (
                <p style={{ color: "#9a9a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  Nessun dato disponibile
                </p>
              ) : (
                statsData.topPages.map(([page, count]) => (
                  <HorizontalBar
                    key={page}
                    label={page}
                    value={count}
                    max={statsData.topPages[0]?.[1] || 1}
                  />
                ))
              )}
            </div>
          </div>

          {/* Row 4 — Activity log */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #2d2926",
              boxShadow: "4px 4px 0 #2d2926",
              padding: "20px 24px",
              marginBottom: 24,
              overflowX: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Activity size={18} color="#c55a2b" />
              <h2
                style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 700, color: "#2d2926", margin: 0 }}
              >
                Attività Recente
              </h2>
              <span
                style={{
                  marginLeft: "auto",
                  background: "#f5f0eb",
                  border: "1.5px solid #2d2926",
                  padding: "2px 8px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#6b6b6b",
                }}
              >
                Ultimi 20 eventi
              </span>
            </div>
            {statsData.recentActivity.length === 0 ? (
              <p style={{ color: "#9a9a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                Nessuna attività registrata
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #2d2926" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2d2926",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Orario
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2d2926",
                      }}
                    >
                      Evento
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2d2926",
                      }}
                    >
                      Percorso
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.recentActivity.map((entry, i) => (
                    <tr
                      key={i}
                      data-testid={`row-activity-${i}`}
                      style={{
                        borderBottom: "1px solid #e8e0d8",
                        background: i % 2 === 0 ? "#fff" : "#faf7f4",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 12px",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 11,
                          color: "#6b6b6b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: entry.type === "page_view" ? "#e8f4fd" : entry.type.startsWith("analisi") ? "#fef3c7" : "#f0fdf4",
                            border: "1.5px solid #2d2926",
                            padding: "2px 8px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#2d2926",
                          }}
                        >
                          {EVENT_LABELS[entry.type] || entry.type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 11,
                          color: "#c55a2b",
                        }}
                      >
                        {PAGE_LABELS[entry.path] || entry.path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Row 5 — Google Analytics info */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #2d2926",
              boxShadow: "4px 4px 0 #2d2926",
              padding: "20px 24px",
              marginBottom: 32,
            }}
          >
            <h2
              style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 700, color: "#2d2926", margin: "0 0 12px" }}
            >
              Integrazione Google Analytics
            </h2>
            <p
              style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b6b6b", marginBottom: 12, lineHeight: 1.6 }}
            >
              Per attivare Google Analytics, copia il tuo <strong>Measurement ID</strong> (es. <code>G-XXXXXXXXXX</code>) e incollalo nel file{" "}
              <code style={{ background: "#f5f0eb", padding: "1px 5px", border: "1px solid #ccc" }}>client/index.html</code>{" "}
              sostituendo <code>GA_MEASUREMENT_ID</code> nei commenti già presenti. Rimuovi i commenti per attivare il tracciamento.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                data-testid="input-ga-id"
                style={{
                  padding: "8px 12px",
                  border: "2px solid #2d2926",
                  borderRadius: 0,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13,
                  background: "#f5f0eb",
                  color: "#2d2926",
                  outline: "none",
                  minWidth: 200,
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#9a9a9a",
                  fontStyle: "italic",
                }}
              >
                Il codice va inserito manualmente nel file HTML
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                background: "#f5f0eb",
                border: "1.5px solid #2d2926",
                padding: "10px 14px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                color: "#2d2926",
                lineHeight: 1.7,
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{`<!-- Decommentare in client/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}</pre>
            </div>
          </div>

          {/* Footer note */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              color: "#9a9a9a",
              textAlign: "center",
            }}
          >
            Le statistiche sono in memoria — vengono azzerate al riavvio del server. Totale eventi registrati:{" "}
            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{statsData.totalEntries}</span>
          </p>
        </>
      )}
    </div>
  );
}
