import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "accordo_art28";

type Info = { versione: string; approvato: boolean; hash: string; testo: string };

function leggiToken(versione: string): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v?.versione === versione && typeof v?.token === "string" ? v.token : null;
  } catch {
    return null;
  }
}

function salvaToken(versione: string, token: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ versione, token }));
  } catch {
    /* l'accettazione resta valida per la sessione corrente */
  }
}

// Accettazione online dell'accordo ex art. 28 GDPR da parte del professionista o
// dell'Organismo che inserisce dati reali di terzi. Il token restituito dal server
// viene conservato solo su questo dispositivo e inviato con la creazione dell'analisi.
export default function AccordoArt28({ onToken }: { onToken: (token: string | null) => void }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [accettato, setAccettato] = useState(false);
  const [invio, setInvio] = useState(false);
  const [campi, setCampi] = useState({ nome: "", ente: "", codiceFiscalePiva: "", sede: "", email: "" });
  const [accetto, setAccetto] = useState(false);

  useEffect(() => {
    let attivo = true;
    fetch("/api/accordo-art28")
      .then(r => r.json())
      .then((d: Info) => {
        if (!attivo) return;
        setInfo(d);
        const t = d.approvato ? leggiToken(d.versione) : null;
        if (t) {
          setAccettato(true);
          onToken(t);
        }
      })
      .catch(() => attivo && setErrore("Impossibile caricare il testo dell'accordo."));
    return () => {
      attivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aggiorna = (k: keyof typeof campi) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCampi(c => ({ ...c, [k]: e.target.value }));

  async function invia() {
    if (!info) return;
    setInvio(true);
    setErrore(null);
    try {
      const res = await fetch("/api/accordo-art28/accetta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campi, accetto: true, versione: info.versione, hash: info.hash }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || "Accettazione non riuscita.");
      salvaToken(info.versione, data.token);
      setAccettato(true);
      onToken(data.token);
    } catch (e: any) {
      setErrore(e?.message || "Accettazione non riuscita.");
    } finally {
      setInvio(false);
    }
  }

  if (errore && !info) return <p className="text-sm text-destructive">{errore}</p>;
  if (!info) return <p className="text-sm text-muted-foreground">Caricamento dell'accordo…</p>;

  if (!info.approvato) {
    return (
      <div className="border-2 border-amber-600/50 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm" data-testid="accordo-non-disponibile">
        <p className="font-semibold">Accordo non ancora disponibile</p>
        <p className="text-muted-foreground">
          L'accettazione online dell'accordo sul trattamento dei dati (art. 28 GDPR) non è ancora attiva.
          Fino ad allora lo strumento può essere usato soltanto con casi fittizi.
        </p>
      </div>
    );
  }

  if (accettato) {
    return (
      <p className="text-sm font-semibold" data-testid="accordo-accettato">
        Accordo sul trattamento dei dati accettato (versione {info.versione}) su questo dispositivo.
      </p>
    );
  }

  const completo =
    campi.nome.trim().length >= 3 && campi.codiceFiscalePiva.trim().length >= 11 && /\S+@\S+\.\S{2,}/.test(campi.email) && accetto;

  return (
    <div className="space-y-3 border-2 border-foreground/20 p-3" data-testid="accordo-art28">
      <p className="text-sm font-semibold">Accordo sul trattamento dei dati (art. 28 GDPR) — versione {info.versione}</p>
      <div className="max-h-64 overflow-y-auto whitespace-pre-wrap border p-3 text-xs leading-relaxed" tabIndex={0}>
        {info.testo}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label htmlFor="acc-nome">Nome e cognome *</Label><Input id="acc-nome" value={campi.nome} onChange={aggiorna("nome")} maxLength={200} /></div>
        <div><Label htmlFor="acc-ente">Studio o Organismo</Label><Input id="acc-ente" value={campi.ente} onChange={aggiorna("ente")} maxLength={200} /></div>
        <div><Label htmlFor="acc-cf">Codice fiscale o P. IVA *</Label><Input id="acc-cf" value={campi.codiceFiscalePiva} onChange={aggiorna("codiceFiscalePiva")} maxLength={32} /></div>
        <div><Label htmlFor="acc-email">E-mail *</Label><Input id="acc-email" type="email" value={campi.email} onChange={aggiorna("email")} maxLength={200} /></div>
        <div className="sm:col-span-2"><Label htmlFor="acc-sede">Sede e recapiti</Label><Input id="acc-sede" value={campi.sede} onChange={aggiorna("sede")} maxLength={300} /></div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="acc-accetto" checked={accetto} onCheckedChange={v => setAccetto(v === true)} className="mt-0.5 border-2 border-foreground" />
        <label htmlFor="acc-accetto" className="cursor-pointer text-sm leading-relaxed">
          Ho letto l'accordo e lo accetto per conto mio o dell'Organismo che rappresento, quale titolare del trattamento.
        </label>
      </div>
      {errore && <p className="text-sm text-destructive">{errore}</p>}
      <Button type="button" onClick={invia} disabled={!completo || invio}>
        {invio ? "Registrazione in corso…" : "Accetto l'accordo"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Registriamo data e ora, versione del testo e i dati qui inseriti, per dimostrare l'accettazione. L'indirizzo e-mail non viene verificato.
      </p>
    </div>
  );
}
