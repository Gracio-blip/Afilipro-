export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  commission_type: 'fixed' | 'percentage';
  commission_value: number;
  image_color: string;
  features: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  totalEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  joinDate: string;
}

export interface Commission {
  id: number;
  productName: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  date: string;
  type: 'fixed' | 'percentage';
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Formation Marketing Digital',
    description: 'Maîtrisez le marketing digital de A à Z avec cette formation complète. 50+ heures de contenu vidéo, études de cas réels et exercices pratiques.',
    category: 'Formation',
    price: 194000,
    commission_type: 'percentage',
    commission_value: 40,
    image_color: '#1E3A5F',
    features: ['50+ heures de vidéo', 'Certificat inclus', 'Support prioritaire', 'Accès à vie']
  },
  {
    id: 2,
    name: 'Coffret Soins Premium',
    description: 'Ensemble de produits de soins visages et corps de qualité supérieure. Idéal pour les influenceurs beauté et lifestyle.',
    category: 'Beauté',
    price: 58000,
    commission_type: 'fixed',
    commission_value: 17000,
    image_color: '#D4AF37',
    features: ['5 produits inclus', 'Packaging luxueux', 'Cadeau gratuit', 'Livraison offerte']
  },
  {
    id: 3,
    name: 'Abonnement Software Pro',
    description: 'Logiciel de productivité avec IA intégrée. Gagnez du temps sur vos tâches quotidiennes.',
    category: 'Tech',
    price: 32000,
    commission_type: 'percentage',
    commission_value: 30,
    image_color: '#10B981',
    features: ['30 jours gratuits', 'Toutes plateformes', 'Mises à jour incluses', 'Support 24/7']
  },
  {
    id: 4,
    name: 'Smartwatch Fitness',
    description: 'Montre connectée avec suivi cardiaque, GPS et analyse du sommeil. Le cadeau tech parfait.',
    category: 'Tech',
    price: 130000,
    commission_type: 'fixed',
    commission_value: 30000,
    image_color: '#6366F1',
    features: ['Étanche 50m', 'Autonomie 7 jours', 'GPS intégré', '20 modes sport']
  },
  {
    id: 5,
    name: 'Programme Minceur 12 Semaines',
    description: 'Programme fitness et nutrition complet avec suivi personnalisé et coach virtuel.',
    category: 'Santé',
    price: 97000,
    commission_type: 'percentage',
    commission_value: 50,
    image_color: '#EC4899',
    features: ['Plan repas personnalisé', 'Vidéos coaching', 'Suivi hebdomadaire', 'Groupe privé']
  },
  {
    id: 6,
    name: 'Kit Cuisine Professionnelle',
    description: 'Set d\'ustensiles de cuisine en acier inox pour chefs amateurs et passionnés.',
    category: 'Maison',
    price: 84000,
    commission_type: 'fixed',
    commission_value: 23000,
    image_color: '#F59E0B',
    features: ['20 pièces', 'Garantie 5 ans', 'Lavable lave-vaisselle', 'Eco-friendly']
  },
  {
    id: 7,
    name: 'Cours de Langue Premium',
    description: 'Apprenez l\'anglais, l\'espagnol ou l\'allemand avec cette plateforme interactive.',
    category: 'Formation',
    price: 130000,
    commission_type: 'percentage',
    commission_value: 35,
    image_color: '#8B5CF6',
    features: ['30 langues', 'Professeurs natifs', 'Certificat inclus', 'Garantie 30 jours']
  },
  {
    id: 8,
    name: 'Parfums Signature Collection',
    description: 'Collection de parfums artisanaux aux fragrances uniques et élégantes.',
    category: 'Beauté',
    price: 104000,
    commission_type: 'percentage',
    commission_value: 45,
    image_color: '#0EA5E9',
    features: ['8 fragrances', 'Flacons rechargeables', 'Coffret cadeau', 'Notes naturelles']
  }
];

export const categories = ['Tous', 'Formation', 'Tech', 'Beauté', 'Santé', 'Maison'];

export const mockUser: User = {
  id: 1,
  name: 'Kodjo Mensah',
  email: 'kodjo.mensah@email.com',
  totalEarnings: 0,
  totalClicks: 0,
  totalConversions: 0,
  conversionRate: 0,
  joinDate: 'Mars 2024'
};

export const monthlyStats = [
  { month: 'Sep', earnings: 210000 },
  { month: 'Oct', earnings: 318000 },
  { month: 'Nov', earnings: 401000 },
  { month: 'Dec', earnings: 583000 },
  { month: 'Jan', earnings: 354000 },
  { month: 'Fév', earnings: 1865000 }
];

export const recentCommissions: Commission[] = [
  { id: 1, productName: 'Formation Marketing Digital', amount: 77600, status: 'pending', date: '12 Fév 2025', type: 'percentage' },
  { id: 2, productName: 'Smartwatch Fitness', amount: 30000, status: 'approved', date: '10 Fév 2025', type: 'fixed' },
  { id: 3, productName: 'Programme Minceur', amount: 48500, status: 'paid', date: '05 Fév 2025', type: 'percentage' },
  { id: 4, productName: 'Abonnement Software Pro', amount: 9600, status: 'pending', date: '01 Fév 2025', type: 'percentage' },
  { id: 5, productName: 'Kit Cuisine Pro', amount: 23000, status: 'approved', date: '28 Jan 2025', type: 'fixed' },
];

export const testimonials = [
  {
    name: 'Akossiwa Dossou',
    role: 'Blogueuse Lifestyle',
    avatar: 'AD',
    text: 'J\'ai généré plus de 2 000 000 FCFA de commissions en seulement 3 mois. AfiliPro a transformé mon blog en source de revenus récurrents !',
    earnings: '2 127 000 FCFA'
  },
  {
    name: 'Moussa Traoré',
    role: 'YouTubeur Tech',
    avatar: 'MT',
    text: 'Les produits tech plaisent énormément à mon audience. Le suivi des conversions est limpide et les paiements toujours à l\'heure.',
    earnings: '3 858 000 FCFA'
  },
  {
    name: 'Aminata Diallo',
    role: 'Influenceuse Beauté',
    avatar: 'AD',
    text: 'Le programme d\'affiliation le plus professionnel que j\'ai testé. Les créatives sont magnifiques et mes followers adorent.',
    earnings: '1 411 000 FCFA'
  }
];

export function generateAffiliateLink(productId: number, userId: number = 1): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://afilipro.com';
  return `${baseUrl}/products/${productId}?ref=user_${userId}&aff=1`;
}

export function formatCFA(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}
