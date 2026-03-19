import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Calcolatore from "@/pages/Calcolatore";
import AnalisiCasoAI from "@/pages/AnalisiCasoAI";
import FAQ from "@/pages/FAQ";
import GuidaDM150 from "@/pages/GuidaDM150";
import ConfrontoCosti from "@/pages/ConfrontoCosti";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import TerminiCondizioni from "@/pages/TerminiCondizioni";
import ChiSiamo from "@/pages/ChiSiamo";
import Contatti from "@/pages/Contatti";
import Glossario from "@/pages/Glossario";
import GeneratoreProcura from "@/pages/GeneratoreProcura";
import Giurisprudenza from "@/pages/Giurisprudenza";
import CreditoImposta from "@/pages/CreditoImposta";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/Admin";
import { usePageTracker } from "@/hooks/use-page-tracker";

function AppRouter() {
  usePageTracker();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calcolatore" component={Calcolatore} />
      <Route path="/analisi-caso-ai" component={AnalisiCasoAI} />
      <Route path="/faq" component={FAQ} />
      <Route path="/guida-dm-150" component={GuidaDM150} />
      <Route path="/confronto-costi" component={ConfrontoCosti} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/termini-condizioni" component={TerminiCondizioni} />
      <Route path="/chi-siamo" component={ChiSiamo} />
      <Route path="/contatti" component={Contatti} />
      <Route path="/glossario" component={Glossario} />
      <Route path="/generatore-procura" component={GeneratoreProcura} />
      <Route path="/giurisprudenza" component={Giurisprudenza} />
      <Route path="/credito-imposta" component={CreditoImposta} />
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
        <Router hook={useHashLocation}>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
