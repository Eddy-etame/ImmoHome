export interface Property {
  id: string;
  title: string;
  titleEn: string;
  city: string;
  price: number;
  surface: number;
  type: 'VILLA' | 'APPARTEMENT' | 'TERRAIN';
  image: string;
  images: string[];
  description: string;
  descriptionEn: string;
  rooms?: number;
  bathrooms?: number;
  features: string[];
  featuresEn: string[];
  neighborhood?: string;
  neighborhoodEn?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string | number;
  timestamp: string;
  action: string;
  reason: string;
  actor: string;
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Villa contemporaine, Bonapriso',
    titleEn: 'Contemporary Villa, Bonapriso',
    city: 'Douala',
    price: 285000000,
    surface: 420,
    type: 'VILLA',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cette villa d’exception incarne l’équilibre parfait entre modernité et chaleur. Située dans le quartier prisé de Bonapriso, elle offre des volumes généreux, une luminosité naturelle abondante et des finitions haut de gamme faites pour durer.',
    descriptionEn: 'This exceptional villa embodies the perfect balance between modernity and warmth. Located in the highly sought-after Bonapriso neighborhood, it offers generous volumes, abundant natural light, and premium finishes built to last.',
    rooms: 5,
    bathrooms: 4,
    features: ['Piscine', 'Sécurité 24/7', 'Groupe électrogène', 'Jardin paysager', 'Garage double'],
    featuresEn: ['Swimming Pool', '24/7 Security', 'Generator', 'Landscaped Garden', 'Double Garage'],
    neighborhood: 'Bonapriso est l’un des quartiers résidentiels les plus prisés de Douala. Ancien quartier colonial réhabilité, il conjugue tranquillité, sécurité et proximité immédiate avec le centre des affaires d’Akwa. Écoles internationales, ambassades et restaurants haut de gamme à quelques minutes.',
    neighborhoodEn: 'Bonapriso is one of Douala’s most sought-after residential neighborhoods. A rehabilitated former colonial district, it combines tranquility, security, and immediate proximity to the Akwa business center. International schools, embassies, and upscale restaurants within minutes.'
  },
  {
    id: 'p2',
    title: 'Appartement T3, Bastos',
    titleEn: '2-Bedroom Apartment, Bastos',
    city: 'Yaoundé',
    price: 95000000,
    surface: 110,
    type: 'APPARTEMENT',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Situé au cœur de Bastos, cet appartement moderne au design épuré offre un cadre de vie idéal pour les professionnels ou diplomates. Sécurisé et doté de toutes les commodités modernes.',
    descriptionEn: 'Located in the heart of Bastos, this modern, sleek apartment offers the ideal living environment for professionals or diplomats. Highly secure and equipped with all modern amenities.',
    rooms: 2,
    bathrooms: 2,
    features: ['Ascenseur', 'Gardiennage', 'Forage d’eau', 'Balcon panoramique'],
    featuresEn: ['Elevator', 'Security Guard', 'Water Borehole', 'Panoramic Balcon'],
    neighborhood: 'Bastos est le quartier diplomatique de Yaoundé. Ambassades, organisations internationales et résidences d’expatriés s’y côtoient dans un environnement vert et sécurisé. L’adresse de référence pour qui recherche calme et standing au cœur de la capitale.',
    neighborhoodEn: 'Bastos is Yaoundé’s diplomatic district. Embassies, international organizations, and expatriate residences coexist in a leafy, secure environment. The reference address for those seeking calm and prestige at the heart of the capital.'
  },
  {
    id: 'p3',
    title: 'Terrain titré, Kribi',
    titleEn: 'Titled Beachfront Land, Kribi',
    city: 'Kribi',
    price: 32000000,
    surface: 800,
    type: 'TERRAIN',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Une opportunité rare d’acquérir un terrain titré avec une vue imprenable, à proximité de la plage de Kribi. Idéal pour un projet de résidence secondaire ou d’investissement hôtelier.',
    descriptionEn: 'A rare opportunity to acquire beachfront titled land with stunning views in Kribi. Ideal for a holiday home project or hotel investment.',
    features: ['Vue sur mer', 'Accès direct plage', 'Zone viabilisée', 'Titre foncier disponible'],
    featuresEn: ['Sea View', 'Direct Beach Access', 'Serviced Area', 'Land Title Available'],
    neighborhood: 'Kribi est la perle balnaire du Cameroun. Plages de sable fin, eaux turquoise et infrastructures touristiques en pleine expansion. La zone bénéficie du développement du port en eau profonde et attire les investisseurs en résidence secondaire et en hôtellerie haut de gamme.',
    neighborhoodEn: 'Kribi is Cameroon’s seaside jewel. Fine sand beaches, turquoise waters, and rapidly expanding tourism infrastructure. The area benefits from the deepwater port development and attracts second-home and premium hospitality investors.'
  },
  {
    id: 'p4',
    title: 'Villa de prestige, Golf',
    titleEn: 'Prestigious Villa, Golf Course',
    city: 'Yaoundé',
    price: 450000000,
    surface: 600,
    type: 'VILLA',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Demeure majestueuse faisant face au prestigieux Golf de Yaoundé. Avec son architecture néo-classique, ses colonnes imposantes et sa piscine olympique, elle représente le summum du luxe.',
    descriptionEn: 'Majestic estate facing the prestigious Yaoundé Golf Course. With its neo-classical architecture, imposing pillars, and Olympic-sized pool, it represents the absolute pinnacle of luxury.',
    rooms: 6,
    bathrooms: 5,
    features: ['Piscine olympique', 'Vue sur le Golf', 'Système domotique', 'Salle de cinéma privée', 'Dépendance gardien'],
    featuresEn: ['Olympic Pool', 'Golf Course View', 'Smart Home System', 'Private Cinema Room', 'Maid’s quarters'],
    neighborhood: 'Le quartier du Golf, situé à l’entrée nord de Yaoundé, est l’adresse des résidences d’exception. Vastes parcelles, architecture soignée, et proximité immédiate avec le Golf Club Hippique de Yaoundé. Une enclave verte rare dans la capitale.',
    neighborhoodEn: 'The Golf district, at the northern entrance to Yaoundé, is the address for exceptional residences. Vast plots, refined architecture, and immediate proximity to the Yaoundé Hippique Golf Club. A rare green enclave in the capital.'
  },
  {
    id: 'p5',
    title: 'Duplex moderne, Denver',
    titleEn: 'Modern Duplex, Denver',
    city: 'Douala',
    price: 180000000,
    surface: 300,
    type: 'VILLA',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Duplex contemporain aux lignes géométriques affirmées, situé dans le quartier calme et sécurisé de Denver à Douala. Parfait pour une famille recherchant sécurité, confort et modernité.',
    descriptionEn: 'Contemporary duplex with strong geometric lines, located in the quiet and secure Denver neighborhood in Douala. Perfect for a family seeking safety, comfort, and modernity.',
    rooms: 4,
    bathrooms: 3,
    features: ['Terrasse rooftop', 'Climatisation centrale', 'Cuisine équipée', 'Groupe électrogène'],
    featuresEn: ['Rooftop Terrace', 'Central AC', 'Equipped Kitchen', 'Backup Generator'],
    neighborhood: 'Denver est un quartier résidentiel émergent de Douala, apprécié des familles pour son calme, sa sécurité et la qualité de ses voiries. Plus accessible financièrement que Bonapriso, il offre une excellente alternative pour qui cherche un cadre de vie soigné sans le ticket d’entrée historique.',
    neighborhoodEn: 'Denver is an emerging residential district in Douala, popular with families for its calm, security, and road quality. More financially accessible than Bonapriso, it offers an excellent alternative for those seeking a refined living environment without the historical premium.'
  },
  {
    id: 'p6',
    title: 'Studio meublé, Akwa',
    titleEn: 'Furnished Studio, Akwa',
    city: 'Douala',
    price: 45000000,
    surface: 65,
    type: 'APPARTEMENT',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Studio haut de gamme entièrement meublé et décoré par un architecte d’intérieur, situé en plein centre d’Akwa. Excellent rendement locatif pour investisseurs.',
    descriptionEn: 'Premium studio fully furnished and decorated by an interior designer, situated right in the center of Akwa. Excellent rental yield for investors.',
    rooms: 1,
    bathrooms: 1,
    features: ['Meublé premium', 'Centre-ville', 'Sécurité par badge', 'Parking sous-terrain'],
    featuresEn: ['Premium Furnishing', 'City Center', 'Keycard Access', 'Underground Parking'],
    neighborhood: 'Akwa est le cœur historique et commercial de Douala. Banques, sièges sociaux, restaurants et vie nocturne s’y concentrent. Une localisation stratégique pour la location courte durée aux cadres en mission et aux expatriés en transit.',
    neighborhoodEn: 'Akwa is Douala’s historic commercial heart. Banks, corporate headquarters, restaurants, and nightlife all cluster here. A strategic location for short-term rentals to executives on assignment and expatriates in transit.'
  }
];

/**
 * Schema version sentinel. Bump whenever the Property/Client/Appointment shapes
 * change in a non-backwards-compatible way. Stored entries with an older version
 * are wiped and re-seeded from INITIAL_PROPERTIES on next read.
 */
export const IMMOPRO_SCHEMA_VERSION = 2;
const SCHEMA_KEY = 'immopro_schema_version';

function ensureSchemaCompatible() {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(SCHEMA_KEY);
  if (stored !== String(IMMOPRO_SCHEMA_VERSION)) {
    // Schema bump: wipe data caches but keep user-only stores (favorites, subscribers, contact messages).
    localStorage.removeItem('immopro_properties');
    localStorage.removeItem('immopro_clients');
    localStorage.removeItem('immopro_appointments');
    localStorage.setItem(SCHEMA_KEY, String(IMMOPRO_SCHEMA_VERSION));
  }
}

export function getProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  ensureSchemaCompatible();
  const stored = localStorage.getItem('immopro_properties');
  if (!stored) {
    localStorage.setItem('immopro_properties', JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROPERTIES;
  }
}

export function saveProperties(properties: Property[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('immopro_properties', JSON.stringify(properties));
  window.dispatchEvent(new CustomEvent('immopro:properties-updated', { detail: { properties } }));
}
