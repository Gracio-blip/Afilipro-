'use client';

import { EarnTaskTemplate, EarnTask } from '@/components/EarnTaskTemplate';
import { FirstDepositModal } from '@/components/FirstDepositModal';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { Music2 } from 'lucide-react';

const tasks: EarnTask[] = [
  {
    id: 1,
    title: 'TikTok Business',
    description: 'Regardez une vidéo publique TikTok sur les petites entreprises',
    reward: 200,
    duration: '3min',
    difficulty: 'easy',
    completed: false,
    taskType: 'tiktok',
    thumbnailColor: '#EC4899',
    externalUrl: 'https://www.tiktok.com/embed/v2/7460528928072027435',
  },
  {
    id: 2,
    title: 'TikTok Communauté',
    description: 'Regardez une vidéo publique de la communauté TikTok',
    reward: 200,
    duration: '3min',
    difficulty: 'easy',
    completed: false,
    taskType: 'tiktok',
    thumbnailColor: '#EC4899',
    externalUrl: 'https://www.tiktok.com/embed/v2/7012606652008402182',
  },
];

export default function TiktokPage() {
  const { isActivated, showDepositModal, closeDepositModal, guardAction } = useActivationGuard();

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
      <EarnTaskTemplate
        title="TikTok Earn"
        subtitle="Regardez des vidéos TikTok et gagnez 200 FCFA par vue"
        icon={Music2}
        accentColor="bg-gradient-to-br from-pink-500 to-rose-600"
        tasks={tasks}
        totalAvailable={2}
        totalEarned={0}
        isActivated={isActivated}
        onNotActivated={() => guardAction(() => {})}
      />
    </>
  );
}
