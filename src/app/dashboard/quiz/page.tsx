'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { FirstDepositModal } from '@/components/FirstDepositModal';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { Brain } from 'lucide-react';

const tasks: EarnTask[] = [
  { id: 1, title: 'Quiz Culture Générale', description: '10 questions sur la culture générale africaine et mondiale', reward: 100, duration: '5min', difficulty: 'medium', completed: false, taskType: 'quiz', thumbnailColor: '#8B5CF6' },
  { id: 2, title: 'Quiz Mathématiques',    description: 'Résolvez 5 problèmes mathématiques simples',               reward: 100, duration: '5min', difficulty: 'medium', completed: false, taskType: 'quiz', thumbnailColor: '#8B5CF6' },
  { id: 3, title: 'Quiz Histoire',         description: 'Testez vos connaissances en histoire africaine',            reward: 100, duration: '4min', difficulty: 'easy',   completed: false, taskType: 'quiz', thumbnailColor: '#8B5CF6' },
  { id: 4, title: 'Quiz Sciences',         description: 'Questions sur la biologie et la physique',                 reward: 100, duration: '5min', difficulty: 'medium', completed: false, taskType: 'quiz', thumbnailColor: '#8B5CF6' },
  { id: 5, title: 'Quiz Géographie',       description: "Capitales et pays d'Afrique et du monde",                  reward: 100, duration: '4min', difficulty: 'easy',   completed: false, taskType: 'quiz', thumbnailColor: '#8B5CF6' },
];

export default function QuizPage() {
  const { isActivated, showDepositModal, closeDepositModal, guardAction } = useActivationGuard();

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
      <EarnTaskTemplate
        title="Quiz Challenge"
        subtitle="100 FCFA par réponse correcte — Testez vos connaissances"
        icon={Brain}
        accentColor="bg-gradient-to-br from-violet-500 to-purple-700"
        tasks={tasks}
        totalAvailable={5}
        totalEarned={0}
        isActivated={isActivated}
        onNotActivated={() => guardAction(() => {})}
      />
    </>
  );
}
