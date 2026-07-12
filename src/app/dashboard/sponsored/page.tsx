'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { Film } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Vidéo Sponsorisée Nike', description: 'Regardez cette campagne publicitaire Nike Air', reward: 1750, duration: '2min', difficulty: 'easy', completed: false, taskType: 'sponsored', thumbnailColor: '#D946EF' },
  { id: 2, title: 'Vidéo Sponsorisée Apple', description: 'Regardez cette présentation produit Apple', reward: 2000, duration: '2min', difficulty: 'easy', completed: false, taskType: 'sponsored', thumbnailColor: '#D946EF' },
  { id: 3, title: 'Vidéo Sponsorisée Samsung', description: 'Lancement du nouveau smartphone Samsung', reward: 1850, duration: '2min', difficulty: 'medium', completed: false, taskType: 'sponsored', thumbnailColor: '#D946EF' },
  { id: 4, title: 'Vidéo Sponsorisée Adidas', description: 'Collection sportswear Adidas', reward: 1500, duration: '1min', difficulty: 'easy', completed: true, taskType: 'sponsored', thumbnailColor: '#D946EF' },
  { id: 5, title: 'Vidéo Sponsorisée L\'Oréal', description: 'Nouvelle gamme beauté L\'Oréal', reward: 1700, duration: '2min', difficulty: 'easy', completed: false, taskType: 'sponsored', thumbnailColor: '#D946EF' },
];

export default function SponsoredPage() {
  return (
    <EarnTaskTemplate
      title="Sponsored Videos"
      subtitle="Vidéos sponsorisées avec récompenses premium en FCFA"
      icon={Film}
      accentColor="bg-gradient-to-br from-fuchsia-500 to-pink-700"
      tasks={tasks}
      totalAvailable={5}
      totalEarned={12000}
    />
  );
}
