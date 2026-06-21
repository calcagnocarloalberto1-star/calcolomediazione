import { Component, type ErrorInfo, type ReactNode } from "react";
import { sendError } from "@/lib/error-logger";

interface Props {
  /**
   * Identificativo del componente protetto. Usato per filtrare la dashboard
   * (es. "calculator", "ai-analysis", "comparison-table", "procura").
   */
  tag: string;
  children: ReactNode;
  /**
   * Etichetta user-friendly mostrata nel fallback. Default: "questa sezione".
   */
  section?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Cattura errori di rendering React e ne invia il dettaglio a /api/client-error.
 * Mostra un fallback discreto invece di un white screen, mantenendo l'app
 * navigabile (Header, Footer, altri tab restano funzionanti).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    sendError(error.message || "React render error", {
      stack: (error.stack || "") + "\n--- componentStack ---" + (info.componentStack || ""),
      severity: "boundary",
      component_tag: this.props.tag,
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const section = this.props.section || "questa sezione";

    return (
      <div
        role="alert"
        className="mx-auto my-8 max-w-2xl rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
      >
        <h2 className="mb-2 text-lg font-semibold text-destructive">
          Si è verificato un errore in {section}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          L'errore è stato registrato e verrà esaminato. Puoi riprovare oppure
          ricaricare la pagina.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Riprova
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Ricarica pagina
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
