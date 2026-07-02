import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { Database } from '../database.types';

/**
 * Request-scoped Supabase client for SSR pages and API routes. It reads the
 * user's session from the request cookies and writes refreshed session cookies
 * back through Astro's cookie API, so `supabase.auth.getUser()` reflects the
 * signed-in agent/owner and RLS applies to their role.
 */
export function createSupabaseServerClient(context: {
  request: Request;
  cookies: AstroCookies;
}) {
  const { request, cookies } = context;

  const url = import.meta.env.PUBLIC_SUPABASE_URL || (globalThis as any).process?.env?.PUBLIC_SUPABASE_URL;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).process?.env?.PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient<Database>(
    url,
    anon,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '').map(
            (c) => ({ name: c.name, value: c.value ?? '' })
          );
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookies.set(name, value, options);
          }
        }
      }
    }
  );
}
