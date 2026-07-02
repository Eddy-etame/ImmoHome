// Create (or reuse) the ImmoPro owner account and promote it in `profiles`.
// Run:  node scripts/create-admin.mjs
// Uses the service-role key. Safe to re-run.

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Usage: node scripts/create-admin.mjs [email] [password] [fullName]
const EMAIL = process.argv[2] || 'admin@immopro.cm';
const PASSWORD = process.argv[3] || 'Immopro2026!';
const FULL_NAME = process.argv[4] || 'ImmoPro Admin';

async function main() {
  let userId = null;

  const { data: created, error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: FULL_NAME }
  });

  if (error) {
    // Already exists → find it.
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) { console.error('listUsers failed:', listErr.message); process.exit(1); }
    userId = list.users.find((u) => u.email === EMAIL)?.id ?? null;
    if (!userId) { console.error('Could not create or find user:', error.message); process.exit(1); }
    console.log('User already existed, reusing.');
  } else {
    userId = created.user.id;
    console.log('Created auth user.');
  }

  // Ensure a profile row exists with owner role (covers the case where the
  // signup trigger was skipped during migration).
  const { error: pErr } = await supabase
    .from('profiles')
    .upsert({ id: userId, email: EMAIL, full_name: FULL_NAME, role: 'owner' });
  if (pErr) { console.error('profile upsert failed:', pErr.message); process.exit(1); }

  // Verify
  const { data: prof } = await supabase.from('profiles').select('role, email').eq('id', userId).single();
  console.log(`OWNER READY -> ${EMAIL} / ${PASSWORD}  (role: ${prof?.role})`);
}

main().catch((e) => { console.error('crashed:', e); process.exit(1); });
