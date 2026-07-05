import type { Database, PropertyType, PropertyStatus } from './database.types';

/**
 * Pure property view-model + row→view transform. NO Supabase import lives here
 * on purpose: `favorites.ts` runs in the browser and only needs `toView`, so
 * keeping this module client-free stops the server data client (`queries.ts`,
 * which builds a `createClient` at module scope) from being pulled into the
 * browser bundle — that stray client is a second GoTrueClient and triggers the
 * "Multiple GoTrueClient instances detected" warning. See lib/supabase/client.ts.
 */

/** UI-facing property shape (camelCase), decoupled from DB column names. */
export interface PropertyView {
  id: string;            // slug — used in URLs
  uid: string;           // database uuid — used for relations (favorites)
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

export type PropertyRow = Database['public']['Tables']['properties']['Row'] & {
  property_images?: { url: string; sort_order: number }[] | null;
};

export function toView(row: PropertyRow): PropertyView {
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
    uid: row.id,
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
