import type { ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Assistente from "@/components/Assistente";
import Home from "@/pages/Home";
import Calcolatore from "@/pages/Calcolatore";
import AnalisiCasoAI from "@/pages/AnalisiCasoAI";
import FAQ from "@/pages/FAQ";
import GuidaDM150 from "@/pages/GuidaDM150";
import ConfrontoCosti from "@/pages/ConfrontoCosti";
import CostiNotarili from "@/pages/CostiNotarili";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import TerminiCondizioni from "@/pages/TerminiCondizioni";
import ChiSiamo from "@/pages/ChiSiamo";
import Contatti from "@/pages/Contatti";
import Glossario from "@/pages/Glossario";
import GeneratoreProcura from "@/pages/GeneratoreProcura";
import Giurisprudenza from "@/pages/Giurisprudenza";
import SentenzaDetail from "@/pages/SentenzaDetail";
import CreditoImposta from "@/pages/CreditoImposta";
import Antiriciclaggio from "@/pages/Antiriciclaggio";
import AntiriciclaggioGuida from "@/pages/AntiriciclaggioGuida";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/Admin";
import StrategieNegoziazione from "@/pages/StrategieNegoziazione";
import MediazioneObbligatoriaCosti from "@/pages/MediazioneObbligatoriaCosti";
import MediazioneCondominialeDelibera from "@/pages/MediazioneCondominialeDelibera";
import ProcuraSostanzialeMediazione from "@/pages/ProcuraSostanzialeMediazione";
import MediazioneVsCausaCivile from "@/pages/MediazioneVsCausaCivile";
import CreditoImpostaMediazioneDomanda from "@/pages/CreditoImpostaMediazioneDomanda";
import GratuitoPatrocinioMediazione from "@/pages/GratuitoPatrocinioMediazione";
import MaanZopaMediazione from "@/pages/MaanZopaMediazione";
import AssegnoMantenimentoDivorzileCalcolo from "@/pages/AssegnoMantenimentoDivorzileCalcolo";
import AntiriciclaggioMediazioneObblighi from "@/pages/AntiriciclaggioMediazioneObblighi";
import TrasferimentoImmobiliareMediazione from "@/pages/TrasferimentoImmobiliareMediazione";
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
      <Route path="/mediazione-obbligatoria-quanto-costa" component={MediazioneObbligatoriaCosti} />
      <Route path="/mediazione-condominiale-delibera-assembleare" component={MediazioneCondominialeDelibera} />
      <Route path="/procura-sostanziale-mediazione" component={ProcuraSostanzialeMediazione} />
      <Route path="/mediazione-vs-causa-civile" component={MediazioneVsCausaCivile} />
      <Route path="/credito-imposta-mediazione-domanda" component={CreditoImpostaMediazioneDomanda} />
      <Route path="/gratuito-patrocinio-mediazione" component={GratuitoPatrocinioMediazione} />
      <Route path="/maan-zopa-mediazione" component={MaanZopaMediazione} />
      <Route path="/assegno-mantenimento-divorzile-calcolo" component={AssegnoMantenimentoDivorzileCalcolo} />
      <Route path="/antiriciclaggio">
        <Boundary tag="antiriciclaggio" section="lo strumento antiriciclaggio">
          <Antiriciclaggio />
        </Boundary>
      </Route>
      <Route path="/antiriciclaggio-guida" component={AntiriciclaggioGuida} />
      <Route path="/antiriciclaggio-mediazione-obblighi" component={AntiriciclaggioMediazioneObblighi} />
      <Route path="/trasferimento-immobiliare-mediazione" component={TrasferimentoImmobiliareMediazione} />
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
        {/*
          ACC-02: CookieConsent è position:fixed (appare in basso indipendentemente dalla
          sua posizione nel markup), ma essendo prima renderizzato DOPO l'intero Footer
          (decine di link) l'ordine di tabulazione da tastiera lo rendeva raggiungibile solo
          dopo 50+ pressioni di Tab — di fatto irraggiungibile per un utente che naviga solo
          da tastiera, pur essendo visivamente il primo elemento che vede. Spostato subito
          dopo lo skip-link, prima dell'header, così un utente da tastiera lo incontra a
          inizio pagina (l'aspetto visivo non cambia, essendo position:fixed).
        */}
        <CookieConsent />
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main
            id="main-content"
            className="flex-1"
            aria-label="Contenuto principale"
          >
            <AppRouter />
          </main>
          <Footer />
          <Assistente />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
