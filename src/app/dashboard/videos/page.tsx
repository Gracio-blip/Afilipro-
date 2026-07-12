'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { PlayCircle } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Vidéo Tendances YouTube', description: 'Regardez la vidéo tendance du jour sur YouTube', reward: 700, duration: '3min', difficulty: 'easy', completed: false, taskType: 'video', thumbnailColor: '#EF4444', externalUrl: 'https://www.youtube.com/results?search_query=trending+today' },
  { id: 2, title: 'Vidéo Formation', description: 'Regardez cette présentation d\'une formation marketing', reward: 1000, duration: '5min', difficulty: 'easy', completed: false, taskType: 'video', thumbnailColor: '#EF4444', externalUrl: 'https://www.youtube.com/results?search_query=formation+marketing+digital' },
];

export default function VideosPage() {
  return (
    <EarnTaskTemplate
      title="Videos Earn"
      subtitle="Regardez des vidéos sur YouTube et gagnez des FCFA"
      icon={PlayCircle}
      accentColor="bg-gradient-to-br from-red-500 to-pink-600"
      tasks={tasks}
      totalAvailable={2}
      totalEarned={0}
    />
  );
}
