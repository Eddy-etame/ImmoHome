import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { atelierPassphraseEnabled, checkPassphrase, atelierToken, ATELIER_COOKIE } from '../../lib/atelierGate';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Owner-only. Verifies the atelier passphrase and sets the unlock cookie. */
export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'owner') return json({ error: 'forbidden' }, 403);

  if (!atelierPassphraseEnabled()) return json({ ok: true }); // gate disabled

  const body = await context.request.json().catch(() => ({} as Record<string, unknown>));
  if (!checkPassphrase(String(body.passphrase ?? ''))) return json({ error: 'bad passphrase' }, 401);

  context.cookies.set(ATELIER_COOKIE, await atelierToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/atelier',
    maxAge: 60 * 60 * 8
  });
  return json({ ok: true });
};
