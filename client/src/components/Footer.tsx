import { Link } from "wouter";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background border-t-[3px] border-foreground" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Risorse Utili */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
              Risorse Utili
            </h4>
            <ul className="space-y-2">
              <li><Link href="/faq"><span className="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-150">FAQ</span></Link></li>
              <li><span className="text-sm opacity-40">Glossario Mediazione <span className="text-xs italic">(presto)</span></span></li>
              <li><span className="text-sm opacity-40">Blog <span className="text-xs italic">(presto)</span></span></li>
            </ul>
          </div>

          {/* Col 2: Calcolatori */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
              Calcolatori
            </h4>
            <ul className="space-y-2">
              <li><Link href="/calcolatore"><span className="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-150">Calcolatore Indennità</span></Link></li>
              <li><span className="text-sm opacity-40">Credito d'Imposta <span className="text-xs italic">(presto)</span></span></li>
              <li><Link href="/analisi-caso-ai"><span className="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-150">Analisi AI Caso</span></Link></li>
            </ul>
          </div>

          {/* Col 3: Riferimenti Normativi */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
              Riferimenti Normativi
            </h4>
            <ul className="space-y-2">
              <li><a href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28!vig=" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-150">D.Lgs. 28/2010</a></li>
              <li><Link href="/guida-dm-150"><span className="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-150">D.M. 150/2023</span></Link></li>
              <li><a href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2022-10-10;149!vig=" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-150">D.Lgs. 149/2022</a></li>
              <li><a href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2010-03-04;28~art5!vig=" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-150">Art. 5 D.Lgs. 28/2010</a></li>
            </ul>
          </div>

          {/* Col 4: Legale */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
              Legale
            </h4>
            <ul className="space-y-2">
              <li><span className="text-sm opacity-40">Privacy Policy <span className="text-xs italic">(presto)</span></span></li>
              <li><span className="text-sm opacity-40">Cookie Policy <span className="text-xs italic">(presto)</span></span></li>
              <li><span className="text-sm opacity-40">Chi Siamo <span className="text-xs italic">(presto)</span></span></li>
              <li><span className="text-sm opacity-40">Contatti <span className="text-xs italic">(presto)</span></span></li>
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
            <p className="text-xs opacity-60 text-center sm:text-right max-w-md">
              Questo sito non è affiliato ad alcun organismo di mediazione pubblico. Le informazioni fornite hanno carattere puramente indicativo.
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
