import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Brain,
  Calculator,
  FileText,
  Scale,
  BarChart3,
  TrendingUp,
  BookOpen,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  Upload,
  FileCheck,
  Download,
  Swords,
  AlertTriangle,
  Clock,
  Building2,
} from "lucide-react";
import { PartnerCards } from "@/components/PartnerCards";
import { SeoHead } from "@/components/SeoHead";
const features = [
  {
    icon: Brain,
    title: "Analisi AI Documenti",
    description: "Analisi automatica del caso con intelligenza artificiale. Estrazione entità, analisi giuridica e guida strategica.",
    href: "/analisi-caso-ai",
    active: true,
  },
  {
    icon: Calculator,
    title: "Calcolatore Indennità",
    description: "Calcolo preciso delle indennità di mediazione secondo il D.M. 150/2023 con tutti gli scaglioni aggiornati.",
    href: "/calcolatore",
    active: true,
  },
  {
    icon: BarChart3,
    title: "Confronto Costi",
    description: "Mediazione vs processo su tre gradi di giudizio: primo grado, appello e cassazione. CU, compensi avvocato, CTU, esenzione prima casa.",
    href: "/confronto-costi",
    active: true,
  },
  {
    icon: Building2,
    title: "Costi Notarili",
    description: "Stima dei puri costi notarili: onorario, IVA, cassa, visure, imposte di registro/ipotecaria/catastale. Confronto accordo di mediazione vs sentenza.",
    href: "/costi-notarili",
    active: true,
  },
  {
    icon: FileText,
    title: "Generatore Procura",
    description: "Genera la procura speciale per la partecipazione alla mediazione ai sensi dell'art. 8, D.Lgs. 28/2010 in formato Word e PDF.",
    href: "/generatore-procura",
    active: true,
  },
  {
    icon: BookOpen,
    title: "Giurisprudenza",
    description: "Motore di ricerca giurisprudenziale: sentenze di Corte Costituzionale, Cassazione e merito dal 2010 ad oggi.",
    href: "/giurisprudenza",
    active: true,
  },
  {
    icon: TrendingUp,
    title: "Credito d'Imposta",
    description: "Calcola il credito d'imposta per mediazione civile (art. 20, D.Lgs. 28/2010). Scadenza domanda: 31 marzo 2026.",
    href: "/credito-imposta",
    active: true,
  },
  {
    icon: Swords,
    title: "Strategie Negoziazione",
    description: "Guida alle tecniche di negoziazione: MAAN/BATNA, negoziazione integrativa, ancoraggio, ZOPA e comunicazione efficace.",
    href: "/strategie-negoziazione",
    active: true,
  },
  {
    icon: Shield,
    title: "Antiriciclaggio",
    description: "Obblighi antiriciclaggio (D.Lgs. 231/2007) in mediazione e compilazione automatica dei modelli del fascicolo: adeguata verifica, titolare effettivo, scheda rischio, dichiarazione cliente e SOS.",
    href: "/antiriciclaggio",
    active: true,
    isNew: true,
  },
  {
    icon: BookOpen,
    title: "Antiriciclaggio · Guida",
    description: "Guida in linguaggio semplice agli obblighi antiriciclaggio in mediazione: chi è obbligato, ispezioni della GdF, cosa fare e cosa mettere a verbale. In domande e risposte.",
    href: "/antiriciclaggio-guida",
    active: true,
    isNew: true,
  },
  {
    icon: Scale,
    title: "Calcolo Assegni",
    description: "Strumento per la stima orientativa dell'assegno di mantenimento del coniuge, dell'assegno divorzile (Cass. SU 18287/2018) e del contributo per i figli (art. 337-ter c.c.). Esportazione PDF.",
    href: "/calcolo-assegni",
    active: true,
    isNew: true,
    external: true,
  },
];
const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Inserisci i Dati",
    description: "Inserisci il valore della lite, il tipo di mediazione e l'esito della procedura.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Ottieni il Calcolo",
    description: "Il sistema calcola automaticamente spese, indennità, riduzioni e maggiorazioni.",
  },
  {
    icon: Download,
    step: "03",
    title: "Esporta il Risultato",
    description: "Scarica il prospetto completo in PDF con tutti i dettagli del calcolo.",
  },
];
function DeadlineBanner() {
  // Show banner only until March 31, 2026
  const deadline = new Date('2026-03-31T23:59:59');
  const now = new Date();
  if (now > deadline) return null;
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return (
    <Link href="/credito-imposta">
      <div className="bg-amber-50 dark:bg-amber-950/40 border-b-2 border-amber-400 dark:border-amber-600 px-4 py-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors" data-testid="banner-scadenza">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-amber-900 dark:text-amber-200 font-medium text-center">
            <strong>Credito d'imposta mediazione:</strong> scadenza presentazione domanda{" "}
            <span className="font-bold">31 marzo 2026</span>
            <span className="hidden sm:inline"> — mancano {daysLeft} giorni</span>
          </span>
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 sm:hidden" />
          <span className="text-amber-700 dark:text-amber-300 font-bold text-xs sm:hidden">{daysLeft}gg</span>
          <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 hidden sm:block" />
        </div>
      </div>
    </Link>
  );
}
export default function Home() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen">
      <SeoHead
        title="CalcoloMediazione — Calcolatore Indennità Mediazione Civile, Analisi AI e Confronto Costi"
        description="Piattaforma gratuita per avvocati e mediatori: calcolatore indennità D.M. 150/2023, analisi AI del caso, confronto costi mediazione vs processo su tre gradi di giudizio, stima costi notarili, credito d'imposta, generatore procura."
        canonical="https://calcolomediazione.it/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "CalcoloMediazione",
            url: "https://calcolomediazione.it/",
            applicationCategory: "LegalService",
            operatingSystem: "Web",
            inLanguage: "it-IT",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            areaServed: { "@type": "Country", name: "Italia" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://calcolomediazione.it/" },
            ],
          },
        ]}
      />
      {/* Deadline Banner */}
      <DeadlineBanner />
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4" data-testid="section-hero">
        <div className="max-w-5xl mx-auto text-center">
          <Badge
            className="mb-6 inline-flex items-center gap-2 bg-primary/10 text-primary border-2 border-primary px-4 py-1.5 text-sm font-semibold"
            data-testid="badge-platform"
          >
            <Sparkles className="w-4 h-4" />
            PIATTAFORMA PROFESSIONALE MEDIATORI
          </Badge>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            data-testid="text-hero-title"
          >
            Mediazione e negoziazione{" "}
            <span className="text-primary">con AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Piattaforma completa per la mediazione civile ai sensi del{" "}
            <strong className="text-foreground">D.M. 150/2023</strong>. Analisi AI del caso, confronto economico su tre gradi di giudizio, calcolatore indennità e generatore documenti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/analisi-caso-ai">
              <Button
                className="w-full sm:w-auto px-8 py-6 text-base font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                data-testid="button-inizia-analisi"
              >
                Inizia Analisi AI <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/calcolatore">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-base font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 bg-card"
                data-testid="button-calcola-indennita"
              >
                Calcola Indennità
              </Button>
            </Link>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground" data-testid="badge-conforme">
              <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 border-2 border-foreground flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              Conforme D.M. 150/2023
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground" data-testid="badge-crittografati">
              <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 border-2 border-foreground flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              Dati Crittografati
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground" data-testid="badge-gdpr">
              <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 border-2 border-foreground flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              GDPR Compliant
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 px-4" data-testid="section-features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Strumenti Professionali
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Una suite completa di strumenti per gestire ogni aspetto della mediazione civile e commerciale.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const cardContent = (
                <Card
                  className={`group border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${feature.active ? "hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer" : "opacity-60"} transition-all duration-150 h-full`}
                  data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 border-2 border-foreground flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      {feature.isNew && (
                        <Badge className="bg-primary text-primary-foreground border-2 border-foreground text-xs font-bold">
                          Nuovo
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    {!feature.active && (
                      <Badge variant="secondary" className="mt-3 text-xs border border-foreground/20">
                        Prossimamente
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
              return feature.active ? (
                feature.external ? (
                  <a key={feature.title} href={feature.href} data-testid={`link-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    {cardContent}
                  </a>
                ) : (
                  <Link key={feature.title} href={feature.href}>
                    {cardContent}
                  </Link>
                )
              ) : (
                <div key={feature.title}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Partner Cards — Olismo Integrato */}
      <PartnerCards />
      {/* How it works */}
      <section className="py-16 px-4 bg-muted/50" data-testid="section-come-funziona">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Come Funziona
            </h2>
            <p className="text-muted-foreground text-lg">
              Tre semplici passaggi per ottenere il calcolo delle indennità.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {step.step}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 text-primary-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Inizia Subito
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Calcola le indennità di mediazione in pochi secondi o avvia un'analisi completa del tuo caso con l'AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calcolatore">
              <Button
                variant="outline"
                className="px-8 py-6 text-base font-bold bg-card text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                data-testid="button-cta-calcolatore"
              >
                Calcola Indennità
              </Button>
            </Link>
            <Link href="/analisi-caso-ai">
              <Button
                className="px-8 py-6 text-base font-bold bg-foreground text-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                data-testid="button-cta-analisi"
              >
                <Brain className="w-5 h-5 mr-2" />
                Analisi AI Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
