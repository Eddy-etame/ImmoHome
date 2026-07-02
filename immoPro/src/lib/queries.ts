import { createClient } from '@supabase/supabase-js';
import type { Database, PropertyType, PropertyStatus } from './database.types';

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

/** UI-facing property shape (camelCase), decoupled from DB column names. */
export interface PropertyView {
  id: string;            // slug — used in URLs
  title: string;
  titleEn: string;
  city: string;
  price: number;
  surface: number;
  type: PropertyType;
  status: PropertyStatus;
  rooms: number | null;
  bathrooms: number | null;
  image: string;         // cover image
  images: string[];
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  neighborhood: string;
  neighborhoodEn: string;
  lat: number | null;
  lng: number | null;
}

type PropertyRow = Database['public']['Tables']['properties']['Row'] & {
  property_images?: { url: string; sort_order: number }[] | null;
};

function toView(row: PropertyRow): PropertyView {
  const galleryFromJoin = (row.property_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  const images = galleryFromJoin.length > 0
    ? galleryFromJoin
    : row.cover_image
      ? [row.cover_image]
      : [];

  return {
    id: row.slug ?? row.id,
    title: row.title,
    titleEn: row.title_en ?? row.title,
    city: row.city,
    price: row.price,
    surface: row.surface,
    type: row.type,
    status: row.status,
    rooms: row.rooms,
    bathrooms: row.bathrooms,
    image: row.cover_image ?? images[0] ?? '',
    images,
    description: row.description ?? '',
    descriptionEn: row.description_en ?? row.description ?? '',
    features: row.features ?? [],
    featuresEn: row.features_en ?? row.features ?? [],
    neighborhood: row.neighborhood ?? '',
    neighborhoodEn: row.neighborhood_en ?? row.neighborhood ?? '',
    lat: row.lat,
    lng: row.lng
  };
}

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
