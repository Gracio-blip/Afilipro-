'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { CandlestickChart } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Initiation au Trading', description: 'Apprenez les bases du trading et de la bourse', reward: 2000, duration: '10min', difficulty: 'easy', completed: false, taskType: 'tutorial-trading', thumbnailColor: '#84CC16' },
  { id: 2, title: 'Analyse Technique', description: 'Maîtrisez les graphiques et indicateurs', reward: 3000, duration: '15min', difficulty: 'medium', completed: false, taskType: 'tutorial-trading', thumbnailColor: '#84CC16' },
  { id: 3, title: 'Trading Crypto', description: 'Comprendre les cryptomonnaies et le Bitcoin', reward: 3500, duration: '20min', difficulty: 'hard', completed: false, taskType: 'tutorial-trading', thumbnailColor: '#84CC16' },
  { id: 4, title: 'Gestion des Risques', description: 'Protégez votre capital et gérez vos pertes', reward: 2500, duration: '12min', difficulty: 'medium', completed: true, taskType: 'tutorial-trading', thumbnailColor: '#84CC16' },
  { id: 5, title: 'Stratégies Avancées', description: 'Techniques de trading professionnelles', reward: 4000, duration: '25min', difficulty: 'hard', completed: false, taskType: 'tutorial-trading', thumbnailColor: '#84CC16' },
];

export default function TradingPage() {
  return (
    <EarnTaskTemplate
      title="Trading Tutorials"
      subtitle="Apprenez le trading et gagnez des FCFA"
      icon={CandlestickChart}
      accentColor="bg-gradient-to-br from-lime-500 to-green-600"
      tasks={tasks}
      totalAvailable={5}
      totalEarned={5500}
    />
  );
}
