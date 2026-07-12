'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { ClipboardList } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Sondage Consommation', description: 'Vos habitudes d\'achat en Afrique de l\'Ouest', reward: 1000, duration: '5min', difficulty: 'easy', completed: false, taskType: 'survey', thumbnailColor: '#14B8A6' },
  { id: 2, title: 'Sondage Produits Tech', description: 'Vos préférences technologiques', reward: 1500, duration: '7min', difficulty: 'easy', completed: false, taskType: 'survey', thumbnailColor: '#14B8A6' },
  { id: 3, title: 'Sondage Lifestyle', description: 'Votre style de vie quotidien', reward: 1200, duration: '6min', difficulty: 'easy', completed: false, taskType: 'survey', thumbnailColor: '#14B8A6' },
  { id: 4, title: 'Sondage Beauté', description: 'Vos produits de beauté préférés', reward: 1750, duration: '8min', difficulty: 'medium', completed: false, taskType: 'survey', thumbnailColor: '#14B8A6' },
  { id: 5, title: 'Sondage Voyage', description: 'Vos destinations de rêve en Afrique', reward: 1500, duration: '6min', difficulty: 'easy', completed: true, taskType: 'survey', thumbnailColor: '#14B8A6' },
  { id: 6, title: 'Sondage Alimentation', description: 'Vos habitudes alimentaires', reward: 1200, duration: '5min', difficulty: 'easy', completed: false, taskType: 'survey', thumbnailColor: '#14B8A6' },
];

export default function SurveysPage() {
  return (
    <EarnTaskTemplate
      title="Complete Surveys"
      subtitle="Répondez à des enquêtes et gagnez des FCFA"
      icon={ClipboardList}
      accentColor="bg-gradient-to-br from-teal-500 to-cyan-600"
      tasks={tasks}
      totalAvailable={6}
      totalEarned={6100}
    />
  );
}
