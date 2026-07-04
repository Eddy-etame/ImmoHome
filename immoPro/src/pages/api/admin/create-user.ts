import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { supabaseAdmin } from '../../../lib/supabase/admin';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function generatePassword(len = 12): string {
  // Ambiguity-free alphabet (no O/0, I/l/1) + symbols for strength.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const out: string[] = [];
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  for (let i = 0; i < len; i++) out.push(chars[buf[i] % chars.length]);
  return out.join('');
}

/**
 * Agent/owner-only. Creates a Supabase auth account for a prospect (role
 * 'client'), a matching CRM row, and returns the generated password so the
 * agent can hand it to the client. No email is sent here (that path is wired
 * separately through the Forms service).
 */
export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Non authentifié.' }, 401);

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!profile || (profile.role !== 'agent' && profile.role !== 'owner')) {
    return json({ error: 'Accès réservé au personnel.' }, 403);
  }

  const body = await context.request.json().catch(() => ({} as Record<string, unknown>));
  const email = String(body.email ?? '').trim().toLowerCase();
  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Adresse email invalide.' }, 400);

  const password = generatePassword();
  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: 'client' }
  });
  if (error) return json({ error: error.message }, 400);

  // Ensure the profile carries the client role (covers a skipped trigger).
  await supabaseAdmin.from('profiles').upsert({
    id: created.user.id, email, full_name: name || null, role: 'client'
  });

  // Best-effort CRM entry so the account shows in the Clients tab.
  await supabaseAdmin.from('clients').insert({
    name: name || email, email, phone: phone || null, source: 'agent'
  });

  return json({ ok: true, email, password });
};
