'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { Megaphone } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Pub Nike Air Max', description: 'Regardez cette publicité de 30 secondes pour la nouvelle collection Nike', reward: 350, duration: '30s', difficulty: 'easy', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 2, title: 'Pub Apple iPhone 15', description: 'Découvrez les nouvelles fonctionnalités de l\'iPhone 15 Pro', reward: 500, duration: '45s', difficulty: 'easy', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 3, title: 'Pub Samsung Galaxy', description: 'Vidéo publicitaire pour le nouveau Galaxy S24 Ultra', reward: 400, duration: '40s', difficulty: 'easy', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 4, title: 'Pub Amazon Prime', description: 'Présentation des avantages Amazon Prime', reward: 550, duration: '1min', difficulty: 'medium', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 5, title: 'Pub Tesla Model 3', description: 'Spot publicitaire Tesla - véhicule électrique', reward: 700, duration: '1min 30s', difficulty: 'medium', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 6, title: 'Pub Coca-Cola', description: 'Campagne Coca-Cola Zero Sugar', reward: 300, duration: '25s', difficulty: 'easy', completed: true, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 7, title: 'Pub Netflix', description: 'Bande-annonce des nouvelles séries Netflix', reward: 500, duration: '50s', difficulty: 'easy', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
  { id: 8, title: 'Pub Spotify Premium', description: 'Découvrez Spotify Premium avec 3 mois gratuits', reward: 600, duration: '1min 15s', difficulty: 'medium', completed: false, taskType: 'ad', thumbnailColor: '#F97316' },
];

export default function AdsPage() {
  return (
    <EarnTaskTemplate
      title="Ads"
      subtitle="Regardez des publicités et gagnez des FCFA"
      icon={Megaphone}
      accentColor="bg-gradient-to-br from-orange-500 to-red-600"
      tasks={tasks}
      totalAvailable={8}
      totalEarned={16500}
    />
  );
}
