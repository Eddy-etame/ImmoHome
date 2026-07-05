import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { toView, type PropertyRow, type PropertyView } from './property';

// Re-export so existing importers (pages) keep working unchanged.
export { toView };
export type { PropertyView };

/**
 * Anon Supabase client for public, read-only data on the server (Astro
 * frontmatter / API routes). No session, so RLS applies the `anon` role —
 * only published rows are visible.
 */
// Resolve env at build (inlined) or at runtime (Vercel serverless process.env).
const SUPABASE_URL =
  import.meta.env.PUBLIC_SUPABASE_URL || (globalThis as any).process?.env?.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).process?.env?.PUBLIC_SUPABASE_ANON_KEY;

const sb = createClient<Database>(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });

const SELECT_WITH_IMAGES = '*, property_images(url, sort_order)';

/** All published properties, newest first. */
export async function getPublishedProperties(): Promise<PropertyView[]> {
  const { data, error } = await sb
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[queries] getPublishedProperties:', error.message);
    return [];
  }
  return (data as PropertyRow[]).map(toView);
}

/** A single published property by slug, or null if not found. */
export async function getPropertyBySlug(slug: string): Promise<PropertyView | null> {
  const { data, error } = await sb
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[queries] getPropertyBySlug:', error.message);
    return null;
  }
  return data ? toView(data as PropertyRow) : null;
}

/** Featured selection for the homepage. */
export async function getFeaturedProperties(limit = 3): Promise<PropertyView[]> {
  const all = await getPublishedProperties();
  return all.slice(0, limit);
}

/** Up to `limit` properties similar to `property` (same city or type), closest by price. */
export function pickSimilar(property: PropertyView, all: PropertyView[], limit = 3): PropertyView[] {
  return all
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .sort((a, b) => Math.abs(a.price - property.price) - Math.abs(b.price - property.price))
    .slice(0, limit);
}
