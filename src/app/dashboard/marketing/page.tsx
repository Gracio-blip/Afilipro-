'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { Share2 } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Module SEO', description: 'Optimisation pour les moteurs de recherche', reward: 2500, duration: '12min', difficulty: 'medium', completed: false, taskType: 'tutorial-marketing', thumbnailColor: '#0EA5E9' },
  { id: 2, title: 'Module Réseaux Sociaux', description: 'Stratégie social media et community management', reward: 2000, duration: '10min', difficulty: 'easy', completed: false, taskType: 'tutorial-marketing', thumbnailColor: '#0EA5E9' },
  { id: 3, title: 'Module Email Marketing', description: 'Campagnes email efficaces et conversion', reward: 2750, duration: '15min', difficulty: 'medium', completed: false, taskType: 'tutorial-marketing', thumbnailColor: '#0EA5E9' },
  { id: 4, title: 'Module Content Marketing', description: 'Création de contenu qui convertit', reward: 2500, duration: '14min', difficulty: 'medium', completed: true, taskType: 'tutorial-marketing', thumbnailColor: '#0EA5E9' },
  { id: 5, title: 'Module Google Ads', description: 'Publicités Google optimisées pour l\'Afrique', reward: 3500, duration: '20min', difficulty: 'hard', completed: false, taskType: 'tutorial-marketing', thumbnailColor: '#0EA5E9' },
];

export default function MarketingPage() {
  return (
    <EarnTaskTemplate
      title="Digital Marketing"
      subtitle="Formez-vous au marketing digital et gagnez des FCFA"
      icon={Share2}
      accentColor="bg-gradient-to-br from-sky-500 to-blue-600"
      tasks={tasks}
      totalAvailable={5}
      totalEarned={5100}
    />
  );
}
