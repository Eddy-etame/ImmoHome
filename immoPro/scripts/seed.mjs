// Seed the Supabase database with ImmoPro's initial properties.
// Run:  node scripts/seed.mjs
// Uses the service-role key (bypasses RLS). Idempotent: upserts by `slug`.

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// --- Load env from immoPro/.env -------------------------------------------
const envPath = new URL('../.env', import.meta.url);
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// --- Approx. city coordinates (for the maps phase) ------------------------
const COORDS = {
  Douala: { lat: 4.0511, lng: 9.7679 },
  'Yaoundé': { lat: 3.848, lng: 11.5021 },
  Kribi: { lat: 2.9391, lng: 9.9073 }
};

// --- Property seed data (ported from src/lib/data.ts) ---------------------
const PROPERTIES = [
  {
    slug: 'p1',
    title: 'Villa contemporaine, Bonapriso',
    title_en: 'Contemporary Villa, Bonapriso',
    city: 'Douala',
    price: 285000000,
    surface: 420,
    type: 'VILLA',
    rooms: 5,
    bathrooms: 4,
    description:
      'Cette villa d’exception incarne l’équilibre parfait entre modernité et chaleur. Située dans le quartier prisé de Bonapriso, elle offre des volumes généreux, une luminosité naturelle abondante et des finitions haut de gamme faites pour durer.',
    description_en:
      'This exceptional villa embodies the perfect balance between modernity and warmth. Located in the highly sought-after Bonapriso neighborhood, it offers generous volumes, abundant natural light, and premium finishes built to last.',
    features: ['Piscine', 'Sécurité 24/7', 'Groupe électrogène', 'Jardin paysager', 'Garage double'],
    features_en: ['Swimming Pool', '24/7 Security', 'Generator', 'Landscaped Garden', 'Double Garage'],
    neighborhood:
      'Bonapriso est l’un des quartiers résidentiels les plus prisés de Douala. Ancien quartier colonial réhabilité, il conjugue tranquillité, sécurité et proximité immédiate avec le centre des affaires d’Akwa. Écoles internationales, ambassades et restaurants haut de gamme à quelques minutes.',
    neighborhood_en:
      'Bonapriso is one of Douala’s most sought-after residential neighborhoods. A rehabilitated former colonial district, it combines tranquility, security, and immediate proximity to the Akwa business center. International schools, embassies, and upscale restaurants within minutes.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    slug: 'p2',
    title: 'Appartement T3, Bastos',
    title_en: '2-Bedroom Apartment, Bastos',
    city: 'Yaoundé',
    price: 95000000,
    surface: 110,
    type: 'APPARTEMENT',
    rooms: 2,
    bathrooms: 2,
    description:
      'Situé au cœur de Bastos, cet appartement moderne au design épuré offre un cadre de vie idéal pour les professionnels ou diplomates. Sécurisé et doté de toutes les commodités modernes.',
    description_en:
      'Located in the heart of Bastos, this modern, sleek apartment offers the ideal living environment for professionals or diplomats. Highly secure and equipped with all modern amenities.',
    features: ['Ascenseur', 'Gardiennage', 'Forage d’eau', 'Balcon panoramique'],
    features_en: ['Elevator', 'Security Guard', 'Water Borehole', 'Panoramic Balcony'],
    neighborhood:
      'Bastos est le quartier diplomatique de Yaoundé. Ambassades, organisations internationales et résidences d’expatriés s’y côtoient dans un environnement vert et sécurisé. L’adresse de référence pour qui recherche calme et standing au cœur de la capitale.',
    neighborhood_en:
      'Bastos is Yaoundé’s diplomatic district. Embassies, international organizations, and expatriate residences coexist in a leafy, secure environment. The reference address for those seeking calm and prestige at the heart of the capital.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    slug: 'p3',
    title: 'Terrain titré, Kribi',
    title_en: 'Titled Beachfront Land, Kribi',
    city: 'Kribi',
    price: 32000000,
    surface: 800,
    type: 'TERRAIN',
    rooms: null,
    bathrooms: null,
    description:
      'Une opportunité rare d’acquérir un terrain titré avec une vue imprenable, à proximité de la plage de Kribi. Idéal pour un projet de résidence secondaire ou d’investissement hôtelier.',
    description_en:
      'A rare opportunity to acquire beachfront titled land with stunning views in Kribi. Ideal for a holiday home project or hotel investment.',
    features: ['Vue sur mer', 'Accès direct plage', 'Zone viabilisée', 'Titre foncier disponible'],
    features_en: ['Sea View', 'Direct Beach Access', 'Serviced Area', 'Land Title Available'],
    neighborhood:
      'Kribi est la perle balnéaire du Cameroun. Plages de sable fin, eaux turquoise et infrastructures touristiques en pleine expansion. La zone bénéficie du développement du port en eau profonde et attire les investisseurs en résidence secondaire et en hôtellerie haut de gamme.',
    neighborhood_en:
      'Kribi is Cameroon’s seaside jewel. Fine sand beaches, turquoise waters, and rapidly expanding tourism infrastructure. The area benefits from the deepwater port development and attracts second-home and premium hospitality investors.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    slug: 'p4',
    title: 'Villa de prestige, Golf',
    title_en: 'Prestigious Villa, Golf Course',
    city: 'Yaoundé',
    price: 450000000,
    surface: 600,
    type: 'VILLA',
    rooms: 6,
    bathrooms: 5,
    description:
      'Demeure majestueuse faisant face au prestigieux Golf de Yaoundé. Avec son architecture néo-classique, ses colonnes imposantes et sa piscine olympique, elle représente le summum du luxe.',
    description_en:
      'Majestic estate facing the prestigious Yaoundé Golf Course. With its neo-classical architecture, imposing pillars, and Olympic-sized pool, it represents the absolute pinnacle of luxury.',
    features: ['Piscine olympique', 'Vue sur le Golf', 'Système domotique', 'Salle de cinéma privée', 'Dépendance gardien'],
    features_en: ['Olympic Pool', 'Golf Course View', 'Smart Home System', 'Private Cinema Room', 'Maid’s Quarters'],
    neighborhood:
      'Le quartier du Golf, situé à l’entrée nord de Yaoundé, est l’adresse des résidences d’exception. Vastes parcelles, architecture soignée, et proximité immédiate avec le Golf Club Hippique de Yaoundé. Une enclave verte rare dans la capitale.',
    neighborhood_en:
      'The Golf district, at the northern entrance to Yaoundé, is the address for exceptional residences. Vast plots, refined architecture, and immediate proximity to the Yaoundé Hippique Golf Club. A rare green enclave in the capital.',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    slug: 'p5',
    title: 'Duplex moderne, Denver',
    title_en: 'Modern Duplex, Denver',
    city: 'Douala',
    price: 180000000,
    surface: 300,
    type: 'VILLA',
    rooms: 4,
    bathrooms: 3,
    description:
      'Duplex contemporain aux lignes géométriques affirmées, situé dans le quartier calme et sécurisé de Denver à Douala. Parfait pour une famille recherchant sécurité, confort et modernité.',
    description_en:
      'Contemporary duplex with strong geometric lines, located in the quiet and secure Denver neighborhood in Douala. Perfect for a family seeking safety, comfort, and modernity.',
    features: ['Terrasse rooftop', 'Climatisation centrale', 'Cuisine équipée', 'Groupe électrogène'],
    features_en: ['Rooftop Terrace', 'Central AC', 'Equipped Kitchen', 'Backup Generator'],
    neighborhood:
      'Denver est un quartier résidentiel émergent de Douala, apprécié des familles pour son calme, sa sécurité et la qualité de ses voiries. Plus accessible financièrement que Bonapriso, il offre une excellente alternative pour qui cherche un cadre de vie soigné sans le ticket d’entrée historique.',
    neighborhood_en:
      'Denver is an emerging residential district in Douala, popular with families for its calm, security, and road quality. More financially accessible than Bonapriso, it offers an excellent alternative for those seeking a refined living environment without the historical premium.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    slug: 'p6',
    title: 'Studio meublé, Akwa',
    title_en: 'Furnished Studio, Akwa',
    city: 'Douala',
    price: 45000000,
    surface: 65,
    type: 'APPARTEMENT',
    rooms: 1,
    bathrooms: 1,
    description:
      'Studio haut de gamme entièrement meublé et décoré par un architecte d’intérieur, situé en plein centre d’Akwa. Excellent rendement locatif pour investisseurs.',
    description_en:
      'Premium studio fully furnished and decorated by an interior designer, situated right in the center of Akwa. Excellent rental yield for investors.',
    features: ['Meublé premium', 'Centre-ville', 'Sécurité par badge', 'Parking sous-terrain'],
    features_en: ['Premium Furnishing', 'City Center', 'Keycard Access', 'Underground Parking'],
    neighborhood:
      'Akwa est le cœur historique et commercial de Douala. Banques, sièges sociaux, restaurants et vie nocturne s’y concentrent. Une localisation stratégique pour la location courte durée aux cadres en mission et aux expatriés en transit.',
    neighborhood_en:
      'Akwa is Douala’s historic commercial heart. Banks, corporate headquarters, restaurants, and nightlife all cluster here. A strategic location for short-term rentals to executives on assignment and expatriates in transit.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

async function main() {
  // 1. Upsert properties (idempotent by slug)
  const rows = PROPERTIES.map(({ images, ...p }) => ({
    ...p,
    status: 'available',
    published: true,
    cover_image: images[0],
    lat: COORDS[p.city]?.lat ?? null,
    lng: COORDS[p.city]?.lng ?? null
  }));

  const { data: upserted, error: upErr } = await supabase
    .from('properties')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug');

  if (upErr) {
    console.error('Property upsert failed:', upErr.message);
    process.exit(1);
  }
  console.log(`Upserted ${upserted.length} properties.`);

  const idBySlug = Object.fromEntries(upserted.map((r) => [r.slug, r.id]));

  // 2. Replace images for the seeded properties
  const ids = upserted.map((r) => r.id);
  const { error: delErr } = await supabase.from('property_images').delete().in('property_id', ids);
  if (delErr) {
    console.error('Image cleanup failed:', delErr.message);
    process.exit(1);
  }

  const imageRows = [];
  for (const p of PROPERTIES) {
    const pid = idBySlug[p.slug];
    p.images.forEach((url, i) =>
      imageRows.push({ property_id: pid, url, alt: p.title, sort_order: i })
    );
  }
  const { error: imgErr } = await supabase.from('property_images').insert(imageRows);
  if (imgErr) {
    console.error('Image insert failed:', imgErr.message);
    process.exit(1);
  }
  console.log(`Inserted ${imageRows.length} property images.`);

  // 3. Verify (reads back through the same client)
  const { count: pc } = await supabase.from('properties').select('*', { count: 'exact', head: true });
  const { count: ic } = await supabase.from('property_images').select('*', { count: 'exact', head: true });
  console.log(`VERIFY -> properties in DB: ${pc}, property_images in DB: ${ic}`);
  console.log('Seed complete.');
}

main().catch((e) => {
  console.error('Seed crashed:', e);
  process.exit(1);
});
