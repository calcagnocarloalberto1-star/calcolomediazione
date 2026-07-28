import { lazy, Suspense, type ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Assistente from "@/components/Assistente";
// Pagine caricate su richiesta (code-splitting): riducono il bundle iniziale.
const Home = lazy(() => import("@/pages/Home"));
const Calcolatore = lazy(() => import("@/pages/Calcolatore"));
const AnalisiCasoAI = lazy(() => import("@/pages/AnalisiCasoAI"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const GuidaDM150 = lazy(() => import("@/pages/GuidaDM150"));
const ConfrontoCosti = lazy(() => import("@/pages/ConfrontoCosti"));
const CostiNotarili = lazy(() => import("@/pages/CostiNotarili"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const TerminiCondizioni = lazy(() => import("@/pages/TerminiCondizioni"));
const ChiSiamo = lazy(() => import("@/pages/ChiSiamo"));
const Contatti = lazy(() => import("@/pages/Contatti"));
const Glossario = lazy(() => import("@/pages/Glossario"));
const GeneratoreProcura = lazy(() => import("@/pages/GeneratoreProcura"));
const Giurisprudenza = lazy(() => import("@/pages/Giurisprudenza"));
const SentenzaDetail = lazy(() => import("@/pages/SentenzaDetail"));
const CreditoImposta = lazy(() => import("@/pages/CreditoImposta"));
const Antiriciclaggio = lazy(() => import("@/pages/Antiriciclaggio"));
const AntiriciclaggioGuida = lazy(() => import("@/pages/AntiriciclaggioGuida"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Admin = lazy(() => import("@/pages/Admin"));
const StrategieNegoziazione = lazy(() => import("@/pages/StrategieNegoziazione"));
import { usePageTracker } from "@/hooks/use-page-tracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { installGlobalErrorHandlers } from "@/lib/error-logger";
// Installa handler globali una sola volta all'avvio del modulo.
installGlobalErrorHandlers();
// Helper: avvolge una pagina in ErrorBoundary con un tag identificativo.
function Boundary({ tag, section, children }: { tag: string; section: string; children: ReactNode }) {
  return (
    <ErrorBoundary tag={tag} section={section}>
      {children}
    </ErrorBoundary>
  );
}
function AppRouter() {
  usePageTracker();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calcolatore">
        <Boundary tag="calculator" section="il calcolatore indennità">
          <Calcolatore />
        </Boundary>
      </Route>
      <Route path="/analisi-caso-ai">
        <Boundary tag="ai-analysis" section="l'analisi AI del caso">
          <AnalisiCasoAI />
        </Boundary>
      </Route>
      <Route path="/faq" component={FAQ} />
      <Route path="/guida-dm-150" component={GuidaDM150} />
      <Route path="/confronto-costi">
        <Boundary tag="comparison-table" section="il confronto costi">
          <ConfrontoCosti />
        </Boundary>
      </Route>
      <Route path="/costi-notarili">
        <Boundary tag="notary-calculator" section="il calcolo costi notarili">
          <CostiNotarili />
        </Boundary>
      </Route>
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/termini-condizioni" component={TerminiCondizioni} />
      <Route path="/chi-siamo" component={ChiSiamo} />
      <Route path="/contatti" component={Contatti} />
      <Route path="/glossario" component={Glossario} />
      <Route path="/generatore-procura">
        <Boundary tag="procura" section="il generatore procura">
          <GeneratoreProcura />
        </Boundary>
      </Route>
      <Route path="/giurisprudenza" component={Giurisprudenza} />
      <Route path="/giurisprudenza/:slug" component={SentenzaDetail} />
      <Route path="/credito-imposta" component={CreditoImposta} />
      <Route path="/strategie-negoziazione" component={StrategieNegoziazione} />
      <Route path="/antiriciclaggio">
        <Boundary tag="antiriciclaggio" section="lo strumento antiriciclaggio">
          <Antiriciclaggio />
        </Boundary>
      </Route>
      <Route path="/antiriciclaggio-guida" component={AntiriciclaggioGuida} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/*
          FIX ACCESSIBILITÀ:
          - Aggiunto aria-label="Navigazione principale" a <Header> (va applicato dentro Header.tsx)
          - <main> ora ha id="main-content" per il link "salta al contenuto"
          - Aggiunto aria-label="Contenuto principale" su <main>
          - Aggiunto "skip to content" link invisibile per navigazione da tastiera (WCAG 2.4.1)
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Vai al contenuto principale
        </a>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main
            id="main-content"
            className="flex-1"
            aria-label="Contenuto principale"
          >
            <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Caricamento…</div>}>
              <AppRouter />
            </Suspense>
          </main>
          <Footer />
          <CookieConsent />
          <Assistente />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
