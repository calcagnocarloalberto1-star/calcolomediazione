/**
 * Card "Partner" — collegamento ai due hub specialistici di olismo-integrato.it
 * (Mediazione Civile e Mediazione Familiare).
 *
 * Vengono mostrate sulla Home di calcolomediazione.it come ponte verso le
 * risorse approfondite dell'avv. Carlo Alberto Calcagno.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart, Scale } from "lucide-react";

interface PartnerCardData {
  icon: typeof Scale;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
  href: string;
  accent: "violet" | "rose";
}

const partners: PartnerCardData[] = [
  {
    icon: Scale,
    title: "Mediazione Civile e Commerciale",
    badge: "Hub Olismo Integrato",
    description:
      "Hub integrato per mediatori e avvocati: D.Lgs. 28/2010 + Riforma Cartabia, matrice strumenti per condominio, banche, responsabilità medica, società e successioni. Norma e persona insieme.",
    bullets: [
      "Materie obbligatorie ex art. 5 (Riforma Cartabia)",
      "Procura sostanziale, primo incontro, art. 8-bis telematica",
      "AI Mediatore con giurisprudenza 2024-2026 e circolari ODM Genova",
    ],
    href: "https://olismo-integrato.it/mediazione-civile.html",
    accent: "violet",
  },
  {
    icon: Heart,
    title: "Mediazione Familiare Sistemica",
    badge: "Hub Olismo Integrato",
    description:
      "Tavolo sistemico olistico per separazione, divorzio e accordi genitoriali: art. 473-bis.10 c.p.c., Riforma Cartabia, Convenzione di Istanbul. Lettura della danza del conflitto e degli adattamenti AT genitoriali.",
    bullets: [
      "Affido condiviso L. 54/2006 e art. 473-bis c.p.c.",
      "Triangolazioni, alienazione parentale, famiglie ricomposte",
      "Strumenti olistici integrati e AI sistemica dedicata",
    ],
    href: "https://olismo-integrato.it/mediazione-familiare.html",
    accent: "rose",
  },
];

export function PartnerCards() {
  return (
    <section
      className="py-16 px-4 bg-muted/30 border-y-2 border-foreground/10"
      data-testid="section-partner-olismo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge
            className="mb-4 inline-flex items-center gap-2 bg-primary/10 text-primary border-2 border-primary px-4 py-1.5 text-sm font-semibold"
            data-testid="badge-partner"
          >
            Approfondimenti professionali
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Hub Olismo Integrato
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Norma, procedura e persona nello stesso spazio. Due hub specialistici per
            mediatori e avvocati a cura dell'avv. Carlo Alberto Calcagno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.map((p) => {
            const Icon = p.icon;
            const accentBg =
              p.accent === "violet"
                ? "bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                : "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300";
            return (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener external"
                data-testid={`link-partner-${p.accent}`}
                className="group block"
              >
                <Card className="h-full border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-150">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 border-2 border-foreground flex items-center justify-center ${accentBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border-2 border-foreground/60 font-semibold"
                      >
                        {p.badge}
                      </Badge>
                    </div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {p.bullets.map((b) => (
                        <li
                          key={b}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary font-bold mt-0.5">›</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      <span>Apri l'hub</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Risorsa esterna a cura di olismo-integrato.it — sito partner editoriale.
          Le aperture avvengono in una nuova scheda.
        </p>
      </div>
    </section>
  );
}
