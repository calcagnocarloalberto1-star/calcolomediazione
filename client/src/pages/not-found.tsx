import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 border-2 border-foreground flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Pagina non trovata
        </h1>
        <p className="text-muted-foreground mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/">
          <Button
            className="px-6 py-5 text-sm font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
            data-testid="button-torna-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
