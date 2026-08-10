import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    __loadGA?: () => void;
    __gaLoaded?: boolean;
  }
}

const COOKIE_NAME = "cm_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already made a choice
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      // Small delay to avoid layout shift on first paint
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIE_NAME, "accepted", COOKIE_MAX_AGE);
    setVisible(false);
    // Enable Google Analytics
    if (window.__loadGA) {
      window.__loadGA();
    }
  };

  const handleReject = () => {
    setCookie(COOKIE_NAME, "rejected", COOKIE_MAX_AGE);
    setVisible(false);
    // GA stays blocked — nothing to do
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      style={{ pointerEvents: "none" }}
      data-testid="cookie-consent-wrapper"
    >
      <div
        className="max-w-3xl mx-auto bg-card border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6"
        style={{ pointerEvents: "auto" }}
        role="region"
        aria-label="Preferenze cookie"
        data-testid="cookie-consent-banner"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 border-2 border-foreground flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-bold mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Utilizziamo i cookie
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Questo sito utilizza cookie tecnici necessari al funzionamento e cookie analitici
              (Google Analytics) per migliorare l'esperienza di navigazione.
              Puoi accettare o rifiutare i cookie analitici. Per maggiori informazioni consulta la{" "}
              <Link href="/cookie-policy">
                <span
                  className="underline cursor-pointer font-medium"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Cookie Policy
                </span>
              </Link>{" "}
              e la{" "}
              <Link href="/privacy-policy">
                <span
                  className="underline cursor-pointer font-medium"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Privacy Policy
                </span>
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button
                onClick={handleAccept}
                className="text-xs font-bold border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                data-testid="button-cookie-accept"
              >
                Accetta tutti
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                className="text-xs font-bold border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                data-testid="button-cookie-reject"
              >
                Solo necessari
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
