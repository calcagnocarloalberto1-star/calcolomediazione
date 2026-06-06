import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Scale, Menu, X, Brain, Calculator, ChevronDown, BarChart3, FileText, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [strumentiOpen, setStrumentiOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-foreground bg-card" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" data-testid="link-home" aria-label="CalcoloMediazione — torna alla home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 bg-primary flex items-center justify-center border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Scale className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight hidden sm:inline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                CalcoloMediazione
              </span>
            </div>
          </Link>

          {/* Desktop nav — FIX: aria-label per identificare la navigazione */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigazione principale" data-testid="nav-desktop">

            {/* Dropdown Strumenti — FIX: aria-expanded + aria-haspopup */}
            <div
              className="relative"
              onMouseEnter={() => setStrumentiOpen(true)}
              onMouseLeave={() => setStrumentiOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-150"
                aria-haspopup="true"
                aria-expanded={strumentiOpen}
                aria-controls="dropdown-strumenti"
                data-testid="nav-strumenti"
              >
                Strumenti
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>

              {strumentiOpen && (
                <div
                  id="dropdown-strumenti"
                  role="menu"
                  className="absolute top-full left-0 w-64 bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
                >
                  <Link href="/analisi-caso-ai" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-b border-muted" data-testid="nav-analisi-ai">
                      <Brain className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Analisi AI</div>
                        <div className="text-xs text-muted-foreground">Analisi caso con intelligenza artificiale</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/calcolatore" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-b border-muted" data-testid="nav-calcolatore">
                      <Calculator className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Calcolatore Indennità</div>
                        <div className="text-xs text-muted-foreground">D.M. 150/2023</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/confronto-costi" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-b border-muted" data-testid="nav-confronto-costi">
                      <BarChart3 className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Confronto Costi</div>
                        <div className="text-xs text-muted-foreground">Mediazione vs Causa Civile</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/generatore-procura" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-b border-muted" data-testid="nav-generatore-procura">
                      <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Generatore Procura</div>
                        <div className="text-xs text-muted-foreground">Art. 8, D.Lgs. 28/2010</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/giurisprudenza" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-b border-muted" data-testid="nav-giurisprudenza">
                      <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Giurisprudenza</div>
                        <div className="text-xs text-muted-foreground">Sentenze sulla mediazione dal 2010</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/credito-imposta" onClick={() => setStrumentiOpen(false)}>
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="nav-credito-imposta">
                      <TrendingUp className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div>
                        <div className="text-sm font-semibold">Credito d'Imposta</div>
                        <div className="text-xs text-muted-foreground">Art. 20, D.Lgs. 28/2010</div>
                      </div>
                    </div>
                  </Link>
                  <a href="/calcolo-assegni/" onClick={() => setStrumentiOpen(false)} data-testid="nav-calcolo-assegni">
                    <div role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer border-t border-border">
                      <Scale className="w-4 h-4 text-primary" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          Calcolo Assegni
                          <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">NUOVO</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Separazione &amp; Divorzio · Cass. SU 18287/2018</div>
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <Link href="/guida-dm-150">
              <span className="px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-150">Guide</span>
            </Link>
            <Link href="/strategie-negoziazione">
              <span className="px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-150">Strategie</span>
            </Link>
            <Link href="/faq">
              <span className="px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-150">Risorse</span>
            </Link>
            <Link href="/admin">
              <span className="px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors duration-150 border border-foreground/20 ml-1">
                Admin
              </span>
            </Link>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                {/* FIX: aria-label esplicito sul pulsante hamburger */}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={mobileOpen ? "Chiudi menu" : "Apri menu di navigazione"}
                  aria-expanded={mobileOpen}
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-6 h-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-l-[3px] border-foreground bg-card p-0">
                {/* FIX: nav semantico anche nel menu mobile */}
                <nav aria-label="Navigazione mobile">
                  <div className="flex flex-col pt-12">
                    <div className="px-4 pb-4 border-b-2 border-muted">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-foreground">
                          <Scale className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          CalcoloMediazione
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {/* FIX: "Strumenti" come testo descrittivo, non navigabile */}
                      <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground" aria-hidden="true">
                        Strumenti
                      </div>
                      <Link href="/analisi-caso-ai" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-analisi">
                          <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Analisi AI</span>
                        </div>
                      </Link>
                      <Link href="/calcolatore" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-calcolatore">
                          <Calculator className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Calcolatore Indennità</span>
                        </div>
                      </Link>
                      <Link href="/confronto-costi" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-confronto-costi">
                          <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Confronto Costi</span>
                        </div>
                      </Link>
                      <Link href="/generatore-procura" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-generatore-procura">
                          <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Generatore Procura</span>
                        </div>
                      </Link>
                      <Link href="/giurisprudenza" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-giurisprudenza">
                          <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Giurisprudenza</span>
                        </div>
                      </Link>
                      <Link href="/credito-imposta" onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer" data-testid="mobile-nav-credito-imposta">
                          <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium">Credito d'Imposta</span>
                        </div>
                      </Link>
                      <a href="/calcolo-assegni/" onClick={() => setMobileOpen(false)} data-testid="mobile-nav-calcolo-assegni">
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 cursor-pointer">
                          <Scale className="w-5 h-5 text-primary" aria-hidden="true" />
                          <span className="font-medium flex items-center gap-2">
                            Calcolo Assegni
                            <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">NUOVO</span>
                          </span>
                        </div>
                      </a>
                      <div className="border-t-2 border-muted mt-2 pt-2">
                        <Link href="/guida-dm-150" onClick={() => setMobileOpen(false)}>
                          <div className="px-4 py-3 text-sm font-medium hover:bg-muted cursor-pointer">Guide</div>
                        </Link>
                        <Link href="/strategie-negoziazione" onClick={() => setMobileOpen(false)}>
                          <div className="px-4 py-3 text-sm font-medium hover:bg-muted cursor-pointer">Strategie di Negoziazione</div>
                        </Link>
                        <Link href="/faq" onClick={() => setMobileOpen(false)}>
                          <div className="px-4 py-3 text-sm font-medium hover:bg-muted cursor-pointer">Risorse</div>
                        </Link>
                        <Link href="/admin" onClick={() => setMobileOpen(false)}>
                          <div className="px-4 py-3 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer border-t border-muted">
                            Admin
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
