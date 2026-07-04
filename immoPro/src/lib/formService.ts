/**
 * Client for the mwcrea Forms microservice (the `logiciel-formulaire` app).
 *
 * Consumer projects like ImmoHome do NOT configure SMTP. They only need:
 *   - PUBLIC_FORM_API_URL  (defaults to the hosted service)
 *   - PUBLIC_FORM_ID       (a form UUID created in the Forms admin GUI)
 *
 * The Forms app owns SMTP and sends the owner notification + submitter
 * auto-reply. This helper handles the Proof-of-Work challenge, the honeypot,
 * and normalizes the response so every form on the site behaves the same.
 */

const API_URL = (import.meta.env.PUBLIC_FORM_API_URL || 'https://logiciel-formulaire.vercel.app/api').replace(/\/$/, '');
const DEFAULT_FORM_ID = import.meta.env.PUBLIC_FORM_ID || '';

export interface FormResult {
  ok: boolean;
  error?: string;
  /** true when a bot tripped the honeypot: we report success but send nothing. */
  skipped?: boolean;
  /** true when no form id is configured: caller can treat email as optional. */
  notConfigured?: boolean;
}

async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function solvePow(challenge: string, difficulty: number): Promise<number> {
  const prefix = '0'.repeat(difficulty);
  let nonce = 0;
  // Bounded so a misconfigured difficulty can never hang the tab forever.
  const MAX = 5_000_000;
  while (nonce < MAX) {
    if ((await sha256(`${challenge}:${nonce}`)).startsWith(prefix)) return nonce;
    nonce++;
  }
  throw new Error('proof-of-work timeout');
}

/**
 * Submit a payload to a form. Returns a normalized result — never throws.
 * `honeypot` is the value of a hidden anti-bot field; if filled we silently
 * succeed. If no form id is configured, returns { ok:false, notConfigured:true }
 * so callers can keep working (e.g. still store the lead in the DB).
 */
export async function submitToForm(
  fields: Record<string, string | undefined>,
  opts: { formId?: string; lang?: string; honeypot?: string } = {}
): Promise<FormResult> {
  const formId = opts.formId || DEFAULT_FORM_ID;
  if (!formId) return { ok: false, notConfigured: true, error: 'PUBLIC_FORM_ID not set' };
  if (opts.honeypot && opts.honeypot.trim() !== '') return { ok: true, skipped: true };

  try {
    const challengeRes = await fetch(`${API_URL}/challenge`);
    if (!challengeRes.ok) return { ok: false, error: 'Service temporarily unavailable.' };
    const { challenge, timestamp, difficulty } = await challengeRes.json();

    const nonce = await solvePow(challenge, difficulty);

    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(fields)) if (v != null) clean[k] = String(v);

    const res = await fetch(`${API_URL}/submit/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...clean,
        _lang: opts.lang || 'fr',
        pow_challenge: challenge,
        pow_timestamp: timestamp,
        pow_nonce: String(nonce),
      }),
    });

    const data = await res.json().catch(() => ({} as Record<string, string>));
    if (!res.ok) return { ok: false, error: data.error || data.remedy || 'Submission failed.' };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error.' };
  }
}
