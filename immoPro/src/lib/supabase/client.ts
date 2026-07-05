import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';

/**
 * Browser-side Supabase client. Use in client `<script>` islands for public
 * reads and authenticated actions. Access is governed by Row Level Security,
 * so the anon key is safe to ship.
 *
 * SINGLETON — this matters. Astro bundles every island's `<script>` into its
 * own `hoisted.*.js` chunk, so this module gets evaluated multiple times on a
 * single page (AuthModal, Header/Footer, agent dashboard, etc). Calling
 * `createBrowserClient()` per chunk spawns several GoTrueClient instances that
 * all share the same auth-cookie key *and* the same `navigator.locks` name.
 * That collision is what breaks the app:
 *   - the losing instance re-writes the session cookie right after signOut(),
 *     so users stay logged in / see the agent dashboard after "signing out";
 *   - the instances contend on the shared Web Lock, hanging getUser()/
 *     getSession() — the "login takes forever / busy-blocking" symptom;
 *   - "Multiple GoTrueClient instances detected" is logged to the console.
 * Caching the instance on `globalThis` guarantees ONE client per browser tab
 * no matter how many chunks import this module.
 */
const GLOBAL_KEY = '__immoproSupabaseClient__';
const store = globalThis as typeof globalThis & {
  [GLOBAL_KEY]?: ReturnType<typeof createBrowserClient<Database>>;
};

export const supabase =
  store[GLOBAL_KEY] ??
  (store[GLOBAL_KEY] = createBrowserClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  ));
