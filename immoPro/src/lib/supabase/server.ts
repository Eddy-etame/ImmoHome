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

  return createServerClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
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
