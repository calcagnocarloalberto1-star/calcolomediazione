export function getCspNonce(): string | undefined {
  const nonce = document
    .querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')
    ?.content.trim();
  return nonce || undefined;
}

export function applyCspNonce(script: HTMLScriptElement): void {
  const nonce = getCspNonce();
  if (nonce) script.nonce = nonce;
}
