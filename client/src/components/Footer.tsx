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
            <ul className="space-y-0">
              <li><FooterLink href="/faq">Domande Frequenti (FAQ)</FooterLink></li>
              <li><FooterLink href="/glossario">Glossario Mediazione</FooterLink></li>
              <li><FooterLink href="/giurisprudenza">Giurisprudenza</FooterLink></li>
              <li><FooterLink href="/guida-dm-150">Guida D.M. 150/2023</FooterLink></li>
              <li><FooterLink href="/confronto-costi">Confronto Costi</FooterLink></li>
              <li><FooterLink href="/strategie-negoziazione">Strategie di Negoziazione</FooterLink></li>
              <li><FooterLink href="/mediazione-obbligatoria-quanto-costa">Mediazione Obbligatoria: Quanto Costa</FooterLink></li>
              <li><FooterLink href="/mediazione-condominiale-delibera-assembleare">Mediazione Condominiale e Delibera</FooterLink></li>
              <li><FooterLink href="/procura-sostanziale-mediazione">Procura Sostanziale in Mediazione</FooterLink></li>
              <li><FooterLink href="/mediazione-vs-causa-civile">Mediazione vs Causa Civile</FooterLink></li>
              <li><FooterLink href="/credito-imposta-mediazione-domanda">Credito d'Imposta: Come Richiederlo</FooterLink></li>
              <li><FooterLink href="/gratuito-patrocinio-mediazione">Gratuito Patrocinio in Mediazione</FooterLink></li>
              <li><FooterLink href="/maan-zopa-mediazione">MAAN e ZOPA in Mediazione</FooterLink></li>
              <li><FooterLink href="/assegno-mantenimento-divorzile-calcolo">Assegno di Mantenimento e Divorzile</FooterLink></li>
              <li><FooterLink href="/antiriciclaggio-mediazione-obblighi">Antiriciclaggio in Mediazione: gli Obblighi</FooterLink></li>
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
            <ul className="space-y-0">
              <li><FooterLink href="/calcolatore">Calcolatore Indennità</FooterLink></li>
              <li><FooterLink href="/analisi-caso-ai">Analisi AI Caso</FooterLink></li>
              <li><FooterLink href="/confronto-costi">Confronto Mediazione vs Processo</FooterLink></li>
              <li><FooterLink href="/generatore-procura">Generatore Procura</FooterLink></li>
              <li><FooterLink href="/credito-imposta">Credito d'Imposta</FooterLink></li>
              <li><FooterStaticLink href="/calcolo-assegni/">Calcolo Assegni Divorzio</FooterStaticLink></li>
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
            <ul className="space-y-0">
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
            <ul className="space-y-0">
              <li><FooterLink href="/chi-siamo">Chi Siamo</FooterLink></li>
              <li><FooterLink href="/contatti">Contatti</FooterLink></li>
              <li><FooterLink href="/privacy-policy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/cookie-policy">Cookie Policy</FooterLink></li>
              <li><FooterLink href="/termini-condizioni">Termini e Condizioni</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-3 mt-10 mb-6">
          <SocialLink
            href="https://www.linkedin.com/in/carlo-alberto-calcagno-22253920"
            label="LinkedIn"
            bgColor="#0A66C2"
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
          />
          <SocialLink
            href="https://www.facebook.com/carloalberto.calcagno/"
            label="Facebook"
            bgColor="#1877F2"
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
          />
          <SocialLink
            href="https://www.youtube.com/@CarloAlbertoCalcagnoGenova"
            label="YouTube"
            bgColor="#FF0000"
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
          />
          {/* DATA-03: link X/Twitter rimosso — nessun profilo attivo da collegare */}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/30 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                CalcoloMediazione &copy; 2026
              </span>
            </div>
            {/* FIX: rimosso opacity-60 → colore esplicito con contrasto sufficiente */}
            <p className="text-xs text-background/90 text-center sm:text-right max-w-lg">
              Strumento professionale gratuito per il calcolo delle indennità di mediazione civile e commerciale — Conforme D.M. 150/2023
            </p>
          </div>

          {/* Disclaimers — FIX: opacity-50 → text-background/80 */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-background/80 text-center">
              Calcolatore valido esclusivamente per organismi di mediazione che applicano le tariffe del D.M. 150/2023. I compensi degli avvocati sono calcolati sui valori medi previsti dal D.M. 55/2014 (Parametri Forensi). Per calcoli personalizzati consultare il proprio legale.
            </p>
          </div>

          {/* FIX: opacity-40 → text-background/70, abbastanza leggibile ma discreto */}
          <div className="mt-4 text-center">
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-background/70 hover:text-background transition-colors duration-150"
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
      {/* FIX a11y mobile: area touch >= 36px (py-2 → 8+8+20≈36px) */}
      <span className="block py-2 text-sm text-background/90 hover:text-background cursor-pointer transition-colors duration-150">
        {children}
      </span>
    </Link>
  );
}

function FooterStaticLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block py-2 text-sm text-background/90 hover:text-background transition-colors duration-150"
    >
      {children}
    </a>
  );
}

function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-2 text-sm text-background/90 hover:text-background transition-colors duration-150 items-center gap-1"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </span>
    </a>
  );
}

function SocialLink({ href, label, bgColor, icon }: { href: string; label: string; bgColor: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex items-center justify-center w-10 h-10 border-2 border-background/30 transition-all duration-200 hover:scale-110 hover:border-background/60"
      style={{ backgroundColor: bgColor }}
      data-testid={`social-${label.toLowerCase()}`}
    >
      <span className="text-white" aria-hidden="true">{icon}</span>
      {/* FIX: testo tooltip social ora con contrasto sufficiente */}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {label}
      </span>
    </a>
  );
}
