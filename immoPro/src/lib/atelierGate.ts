/**
 * Second factor for the owner console: a shared passphrase on top of the
 * Supabase owner session. Set ATELIER_PASSPHRASE (server env) to enable it;
 * leave it unset to disable (owner login alone). The unlock cookie stores a
 * token derived from the passphrase + the service-role key, so it cannot be
 * forged client-side.
 */
const PASSPHRASE =
  import.meta.env.ATELIER_PASSPHRASE || (globalThis as { process?: { env?: Record<string, string> } }).process?.env?.ATELIER_PASSPHRASE || '';
const SERVICE =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY || (globalThis as { process?: { env?: Record<string, string> } }).process?.env?.SUPABASE_SERVICE_ROLE_KEY || '';

export const ATELIER_COOKIE = 'atelier_unlock';

export function atelierPassphraseEnabled(): boolean {
  return PASSPHRASE.length > 0;
}

async function sha256hex(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const h = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** The value stored in the unlock cookie when the passphrase is correct. */
export async function atelierToken(): Promise<string> {
  return sha256hex(`${PASSPHRASE}::${SERVICE}`);
}

export function checkPassphrase(input: string): boolean {
  return atelierPassphraseEnabled() && input === PASSPHRASE;
}

/** True when the passphrase gate is on and the request cookie does not satisfy it. */
export async function needsPassphrase(cookieValue: string | undefined): Promise<boolean> {
  if (!atelierPassphraseEnabled()) return false;
  return cookieValue !== (await atelierToken());
}
