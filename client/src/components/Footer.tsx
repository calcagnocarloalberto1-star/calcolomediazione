import { Link } from "wouter";
import { Scale, HelpCircle, BookOpen, FileText, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background border-t-[3px] border-foreground" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Risorse Utili */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
                Risorse Utili
              </h4>
            </div>
            <ul className="space-y-2">
              <li><FooterLink href="/faq">Domande Frequenti (FAQ)</FooterLink></li>
              <li><FooterLink href="/glossario">Glossario Mediazione</FooterLink></li>
              <li><FooterLink href="/giurisprudenza">Giurisprudenza</FooterLink></li>
              <li><FooterLink href="/guida-dm-150">Guida D.M. 150/2023</FooterLink></li>
              <li><FooterLink href="/confronto-costi">Confronto Costi</FooterLink></li>
            </ul>
          </div>

          {/* Col 2: Calcolatori */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
                Calcolatori
              </h4>
            </div>
            <ul className="space-y-2">
              <li><FooterLink href="/calcolatore">Calcolatore Indennità</FooterLink></li>
              <li><FooterLink href="/analisi-caso-ai">Analisi AI Caso</FooterLink></li>
              <li><FooterLink href="/confronto-costi">Confronto Mediazione vs Processo</FooterLink></li>
              <li><FooterLink href="/generatore-procura">Generatore Procura</FooterLink></li>
              <li><FooterLink href="/credito-imposta">Credito d'Imposta</FooterLink></li>
            </ul>
          </div>

          {/* Col 3: Riferimenti Normativi */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
                Riferimenti Normativi
              </h4>
            </div>
            <ul className="space-y-2">
              <li><FooterExternalLink href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28!vig=">D.Lgs. 28/2010 - Mediazione civile</FooterExternalLink></li>
              <li><FooterLink href="/guida-dm-150">D.M. 150/2023 - Guida tariffe</FooterLink></li>
              <li><FooterExternalLink href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2022-10-10;149!vig=">D.Lgs. 149/2022 - Riforma Cartabia</FooterExternalLink></li>
              <li><FooterExternalLink href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:ministero.giustizia:decreto:2014-03-10;55!vig=">D.M. 55/2014 - Compensi avvocati</FooterExternalLink></li>
              <li><FooterExternalLink href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28~art20!vig=">Art. 20 D.Lgs. 28/2010 - Credito imposta</FooterExternalLink></li>
            </ul>
          </div>

          {/* Col 4: Legale e Contatti */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
                Legale e Contatti
              </h4>
            </div>
            <ul className="space-y-2">
              <li><FooterLink href="/chi-siamo">Chi Siamo</FooterLink></li>
              <li><FooterLink href="/contatti">Contatti</FooterLink></li>
              <li><FooterLink href="/privacy-policy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/cookie-policy">Cookie Policy</FooterLink></li>
              <li><FooterLink href="/termini-condizioni">Termini e Condizioni</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                CalcoloMediazione &copy; 2026
              </span>
            </div>
            <p className="text-xs opacity-60 text-center sm:text-right max-w-lg">
              Strumento professionale gratuito per il calcolo delle indennità di mediazione civile e commerciale — Conforme D.M. 150/2023
            </p>
          </div>

          {/* Disclaimers */}
          <div className="mt-4 space-y-2">
            <p className="text-xs opacity-50 text-center">
              Calcolatore valido esclusivamente per organismi di mediazione che applicano le tariffe del D.M. 150/2023. I compensi degli avvocati sono calcolati sui valori medi previsti dal D.M. 55/2014 (Parametri Forensi). Per calcoli personalizzati consultare il proprio legale.
            </p>
          </div>

          <div className="mt-4 text-center">
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs opacity-40 hover:opacity-60 transition-opacity duration-150"
            >
              Created with Perplexity Computer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <span className="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-150">
        {children}
      </span>
    </Link>
  );
}

function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-150 inline-flex items-center gap-1"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-50" />
    </a>
  );
}
