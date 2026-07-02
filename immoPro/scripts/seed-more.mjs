// Add more properties (apartment-heavy) to Supabase in HD.
// Run:  node scripts/seed-more.mjs   (idempotent, upsert by slug)

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/).filter((l) => l && !l.trimStart().startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// HD Unsplash helper (1600px, quality 85)
const hd = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=85`;

const COORDS = {
  Douala: { lat: 4.0511, lng: 9.7679 },
  'Yaoundé': { lat: 3.848, lng: 11.5021 },
  Kribi: { lat: 2.9391, lng: 9.9073 }
};

const P = [
  {
    slug: 'p7', title: 'Appartement F4, Bonanjo', title_en: '3-Bedroom Apartment, Bonanjo',
    city: 'Douala', price: 135000000, surface: 145, type: 'APPARTEMENT', rooms: 3, bathrooms: 2,
    description: 'Vaste appartement traversant au cœur du quartier administratif de Bonanjo. Lumière naturelle toute la journée, prestations soignées et immeuble sécurisé avec ascenseur.',
    description_en: 'Spacious through-apartment in the heart of Bonanjo’s administrative district. All-day natural light, refined finishes, secure building with elevator.',
    features: ['Ascenseur', 'Gardiennage 24/7', 'Parking privé', 'Balcon'],
    features_en: ['Elevator', '24/7 Security', 'Private Parking', 'Balcony'],
    imgs: ['1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1484154218962-a197022b5858']
  },
  {
    slug: 'p8', title: 'Penthouse vue mer, Kribi', title_en: 'Sea-View Penthouse, Kribi',
    city: 'Kribi', price: 210000000, surface: 190, type: 'APPARTEMENT', rooms: 4, bathrooms: 3,
    description: 'Penthouse d’exception en front de mer, terrasse panoramique face à l’Atlantique. Un pied-à-terre balnéaire rare, à quelques pas de la plage.',
    description_en: 'Exceptional beachfront penthouse with a panoramic terrace over the Atlantic. A rare seaside retreat, steps from the beach.',
    features: ['Vue mer panoramique', 'Terrasse', 'Piscine commune', 'Sécurité'],
    features_en: ['Panoramic Sea View', 'Terrace', 'Shared Pool', 'Security'],
    imgs: ['1567767292278-a4f21aa2d36e', '1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2']
  },
  {
    slug: 'p9', title: 'Appartement meublé, Bonamoussadi', title_en: 'Furnished Apartment, Bonamoussadi',
    city: 'Douala', price: 68000000, surface: 95, type: 'APPARTEMENT', rooms: 2, bathrooms: 2,
    description: 'Appartement moderne entièrement meublé dans le quartier résidentiel de Bonamoussadi. Idéal jeune cadre ou expatrié, prêt à habiter.',
    description_en: 'Modern, fully furnished apartment in the residential Bonamoussadi district. Ideal for a young professional or expat — move-in ready.',
    features: ['Meublé', 'Climatisation', 'Cuisine équipée', 'Internet fibre'],
    features_en: ['Furnished', 'Air Conditioning', 'Equipped Kitchen', 'Fibre Internet'],
    imgs: ['1560448204-e02f11c3d0e2', '1522771739844-6a9f6d5f14af', '1502672260266-1c1ef2d93688']
  },
  {
    slug: 'p10', title: 'Appartement de standing, Nlongkak', title_en: 'Upscale Apartment, Nlongkak',
    city: 'Yaoundé', price: 115000000, surface: 130, type: 'APPARTEMENT', rooms: 3, bathrooms: 2,
    description: 'Appartement haut de gamme proche du centre de Yaoundé. Finitions premium, double séjour et vaste balcon ouvert sur la ville.',
    description_en: 'High-end apartment near central Yaoundé. Premium finishes, double living room, and a wide balcony over the city.',
    features: ['Double séjour', 'Balcon', 'Ascenseur', 'Groupe électrogène'],
    features_en: ['Double Living Room', 'Balcony', 'Elevator', 'Backup Generator'],
    imgs: ['1493809842364-78817add7ffb', '1484154218962-a197022b5858', '1522708323590-d24dbb6b0267']
  },
  {
    slug: 'p11', title: 'Loft moderne, Akwa', title_en: 'Modern Loft, Akwa',
    city: 'Douala', price: 78000000, surface: 105, type: 'APPARTEMENT', rooms: 2, bathrooms: 1,
    description: 'Loft au design contemporain en plein centre d’Akwa. Volumes ouverts, hauteur sous plafond généreuse et lumière abondante.',
    description_en: 'Contemporary-design loft in central Akwa. Open volumes, generous ceiling height, and abundant light.',
    features: ['Espace ouvert', 'Centre-ville', 'Parking', 'Sécurité par badge'],
    features_en: ['Open Plan', 'City Center', 'Parking', 'Keycard Access'],
    imgs: ['1522771739844-6a9f6d5f14af', '1567767292278-a4f21aa2d36e', '1493809842364-78817add7ffb']
  },
  {
    slug: 'p12', title: 'Villa jumelée, Odza', title_en: 'Semi-Detached Villa, Odza',
    city: 'Yaoundé', price: 155000000, surface: 260, type: 'VILLA', rooms: 4, bathrooms: 3,
    description: 'Villa jumelée récente dans un environnement calme et verdoyant à Odza. Jardin privatif, garage et sécurité de quartier.',
    description_en: 'Recent semi-detached villa in a calm, green setting in Odza. Private garden, garage, and neighborhood security.',
    features: ['Jardin privatif', 'Garage', 'Quartier sécurisé', 'Cuisine équipée'],
    features_en: ['Private Garden', 'Garage', 'Secured Area', 'Equipped Kitchen'],
    imgs: ['1600585154340-be6161a56a0c', '1600607687939-ce8a6c25118c', '1512917774080-9991f1c4c750']
  },
  {
    slug: 'p13', title: 'Appartement F3, Mendong', title_en: '2-Bedroom Apartment, Mendong',
    city: 'Yaoundé', price: 52000000, surface: 88, type: 'APPARTEMENT', rooms: 2, bathrooms: 1,
    description: 'Appartement neuf et fonctionnel dans le quartier en plein essor de Mendong. Excellent rapport qualité-prix pour un premier achat ou un investissement locatif.',
    description_en: 'Brand-new, functional apartment in the fast-growing Mendong district. Excellent value for a first purchase or rental investment.',
    features: ['Neuf', 'Cuisine équipée', 'Balcon', 'Parking'],
    features_en: ['Brand New', 'Equipped Kitchen', 'Balcony', 'Parking'],
    imgs: ['1484154218962-a197022b5858', '1502672260266-1c1ef2d93688', '1560448204-e02f11c3d0e2']
  },
  {
    slug: 'p14', title: 'Terrain constructible, Bonabéri', title_en: 'Buildable Land, Bonabéri',
    city: 'Douala', price: 42000000, surface: 500, type: 'TERRAIN', rooms: null, bathrooms: null,
    description: 'Parcelle titrée et viabilisée à Bonabéri, en bordure de voie bitumée. Idéale pour un projet résidentiel ou un petit collectif.',
    description_en: 'Titled, serviced plot in Bonabéri along a paved road. Ideal for a residential project or a small development.',
    features: ['Titre foncier', 'Viabilisé', 'Accès bitumé', 'Zone résidentielle'],
    features_en: ['Land Title', 'Serviced', 'Paved Access', 'Residential Zone'],
    imgs: ['1613490493576-7fde63acd811', '1507525428034-b723cf961d3e']
  }
];

async function main() {
  const rows = P.map((p) => ({
    slug: p.slug, title: p.title, title_en: p.title_en, city: p.city, price: p.price,
    surface: p.surface, type: p.type, rooms: p.rooms, bathrooms: p.bathrooms,
    description: p.description, description_en: p.description_en,
    features: p.features, features_en: p.features_en, status: 'available', published: true,
    cover_image: hd(p.imgs[0]), lat: COORDS[p.city]?.lat ?? null, lng: COORDS[p.city]?.lng ?? null
  }));

  const { data, error } = await supabase.from('properties').upsert(rows, { onConflict: 'slug' }).select('id, slug');
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  console.log(`Upserted ${data.length} properties.`);

  const idBySlug = Object.fromEntries(data.map((r) => [r.slug, r.id]));
  const ids = data.map((r) => r.id);
  await supabase.from('property_images').delete().in('property_id', ids);

  const imageRows = [];
  for (const p of P) {
    const pid = idBySlug[p.slug];
    p.imgs.forEach((id, i) => imageRows.push({ property_id: pid, url: hd(id), alt: p.title, sort_order: i }));
  }
  const { error: imgErr } = await supabase.from('property_images').insert(imageRows);
  if (imgErr) { console.error('images failed:', imgErr.message); process.exit(1); }
  console.log(`Inserted ${imageRows.length} HD images.`);

  const { count } = await supabase.from('properties').select('*', { count: 'exact', head: true });
  const { count: apts } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('type', 'APPARTEMENT');
  console.log(`TOTAL properties: ${count} (apartments: ${apts})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
