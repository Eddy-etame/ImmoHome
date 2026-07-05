/**
 * Favorites — per-user, stored in Supabase. Saving requires an account.
 *
 * Hearts across the site call `toggleFavorite(uid)`. When signed out it returns
 * { needAuth: true } so the UI can open the sign-in modal. `loadFavorites()`
 * primes an in-memory Set of the user's favorited property uuids so `isFavorited`
 * stays synchronous for rendering.
 */
import { supabase } from './supabase/client';
import { toView, type PropertyView } from './property';

let cache: Set<string> | null = null;
let userId: string | null = null;

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Load (or reload) the signed-in user's favorite property uuids. */
export async function loadFavorites(): Promise<Set<string>> {
  const user = await getUser();
  userId = user?.id ?? null;
  cache = new Set();
  if (!userId) return cache;
  const { data, error } = await supabase.from('favorites').select('property_id').eq('user_id', userId);
  if (!error) (data ?? []).forEach((r) => cache!.add(r.property_id));
  return cache;
}

export function isFavorited(uid: string): boolean {
  return cache?.has(uid) ?? false;
}

export type ToggleResult = { needAuth: true } | { needAuth: false; added: boolean };

/** Add/remove a favorite. Requires sign-in — returns { needAuth:true } otherwise. */
export async function toggleFavorite(uid: string): Promise<ToggleResult> {
  if (!userId) {
    const user = await getUser();
    userId = user?.id ?? null;
    if (!userId) return { needAuth: true };
  }
  if (!cache) await loadFavorites();

  if (cache!.has(uid)) {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('property_id', uid);
    if (error) return { needAuth: false, added: true }; // unchanged on failure
    cache!.delete(uid);
    window.dispatchEvent(new CustomEvent('favorites-updated'));
    return { needAuth: false, added: false };
  }
  const { error } = await supabase.from('favorites').insert({ user_id: userId, property_id: uid });
  if (error) return { needAuth: false, added: false };
  cache!.add(uid);
  window.dispatchEvent(new CustomEvent('favorites-updated'));
  return { needAuth: false, added: true };
}

/**
 * Full property records the user has favorited (for the favorites page).
 * Returns null when signed out so the caller can prompt sign-in.
 */
export async function getFavoriteProperties(): Promise<PropertyView[] | null> {
  const user = await getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('favorites')
    .select('created_at, property:properties(*, property_images(url, sort_order))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data
    .map((r) => (r as { property: unknown }).property)
    .filter(Boolean)
    .map((p) => toView(p as Parameters<typeof toView>[0]));
}
