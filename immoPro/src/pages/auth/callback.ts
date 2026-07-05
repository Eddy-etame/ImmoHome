import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../lib/supabase/server';

export const prerender = false;

/**
 * Email-confirmation / magic-link landing. Supabase redirects the user here
 * after they click the link in their inbox. We complete the sign-in on the
 * server so the session cookie is set before the next page renders.
 *
 * Two link styles are supported so this works no matter how the Supabase email
 * template is configured:
 *   - PKCE (default `createBrowserClient` flow): `?code=...`  → exchangeCodeForSession
 *   - Token hash (`{{ .TokenHash }}` templates):  `?token_hash=...&type=...` → verifyOtp
 *
 * On success we redirect to `next` (defaults to home, signed in). On failure we
 * send the user home with `?auth=error` so the UI can explain what to do.
 *
 * NOTE (Supabase dashboard): the deployed origin's `/auth/callback` must be in
 * Authentication → URL Configuration → Redirect URLs, otherwise Supabase
 * refuses the redirect. Add e.g. https://immohome.vercel.app/auth/callback and
 * http://localhost:4321/auth/callback.
 */
export const GET: APIRoute = async ({ request, cookies, url, redirect }) => {
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type'); // signup | recovery | email | email_change | magiclink

  // Only allow same-site relative redirects to avoid open-redirect abuse.
  const nextParam = url.searchParams.get('next') || '/';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  const supabase = createSupabaseServerClient({ request, cookies });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirect(next);
    return redirect('/?auth=error');
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'email' | 'email_change' | 'magiclink' | 'invite',
      token_hash: tokenHash
    });
    if (!error) return redirect(next);
    return redirect('/?auth=error');
  }

  return redirect('/?auth=error');
};
