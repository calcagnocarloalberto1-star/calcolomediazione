/**
 * Restituisce solo metadati tecnici non sensibili.
 *
 * Gli errori dei parser Express possono contenere `body`; quelli dei provider
 * possono incorporare prompt o frammenti della pratica. Non serializzare mai
 * l'oggetto errore completo nei log dei flussi CASE/AML.
 */
export function safeErrorMetadata(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== "object") {
    return { kind: typeof error };
  }

  const candidate = error as Record<string, unknown>;
  const metadata: Record<string, unknown> = {
    name: typeof candidate.name === "string" ? candidate.name : "Error",
  };

  for (const key of ["status", "statusCode", "code", "type"]) {
    const value = candidate[key];
    if (typeof value === "string" || typeof value === "number") {
      metadata[key] = value;
    }
  }

  return metadata;
}

export function logSafeError(label: string, error: unknown): void {
  console.error(label, safeErrorMetadata(error));
}
