'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { TaskModal, TaskType } from './tasks/TaskModal';
import { ExternalTaskModal } from './tasks/ExternalTaskModal';
import { 
  Play, Check, Clock, Euro, Trophy, Star
} from 'lucide-react';

export interface EarnTask {
  id: number;
  title: string;
  description: string;
  reward: number;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  taskType: TaskType;
  thumbnailColor: string;
  externalUrl?: string;
}

interface EarnTaskTemplateProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  tasks: EarnTask[];
  totalAvailable: number;
  totalEarned: number;
  isActivated?: boolean;
  onNotActivated?: () => void;
}

export function EarnTaskTemplate({
  title,
  subtitle,
  icon: Icon,
  accentColor,
  tasks: initialTasks,
  totalAvailable,
  totalEarned,
  isActivated = true,
  onNotActivated,
}: EarnTaskTemplateProps) {
  const { showToast } = useToast();
  const { transactions, refresh } = useWallet();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<EarnTask | null>(null);

  const isExternal = (task: EarnTask) => task.taskType === 'tiktok' || task.taskType === 'video';

  useEffect(() => {
    const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    setTasks(initialTasks.map((task) => {
      if (!isExternal(task)) return task;
      const referencePrefix = `TASK-${day}-${task.taskType}-${task.id}-`;
      const completedOnServer = transactions.some((transaction) => transaction.reference.startsWith(referencePrefix));
      return { ...task, completed: task.completed || completedOnServer };
    }));
  }, [initialTasks, transactions]);

  const handleStartTask = (task: EarnTask) => {
    if (task.completed) return;
    // Si le compte n'est pas encore activé, déclencher le popup de dépôt
    if (!isActivated) {
      onNotActivated?.();
      return;
    }
    setActiveTask(task);
  };

  const handleTaskComplete = async () => {
    if (!activeTask) return;

    if (isExternal(activeTask)) {
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
        body: JSON.stringify({ taskType: activeTask.taskType, taskId: activeTask.id }),
      });
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        showToast(data.error || 'Mission non validée.', 'error');
        throw new Error(data.error || 'Mission non validée.');
      }
      showToast(data.message || 'Mission validée.', 'success');
      await refresh();
    } else {
      showToast(`Mission complétée : +${activeTask.reward.toLocaleString('fr-FR')} FCFA`, 'success');
    }

    setTasks((current) => current.map((task) => task.id === activeTask.id ? { ...task, completed: true } : task));
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const potentialReward = tasks.filter((task) => !task.completed).reduce((sum, task) => sum + task.reward, 0);
  const earnedToday = tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.reward, 0);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const difficultyLabels = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-white ${accentColor}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold font-display">{title}</h1>
            </div>
            <p className="text-white/80">{subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold font-display">{tasks.filter((task) => !task.completed).length}</div>
              <div className="text-xs text-white/70">Restantes</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold font-display">{earnedToday.toLocaleString('fr-FR')}</div>
              <div className="text-xs text-white/70">FCFA aujourd’hui</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Complétées</span>
          </div>
          <div className="text-3xl font-bold font-display text-gray-900">
            {completedCount}<span className="text-gray-400">/{tasks.length}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-gray-500">Potentiel restant</span>
          </div>
          <div className="text-3xl font-bold font-display text-gray-900">
            {potentialReward.toLocaleString('fr-FR')} <span className="text-lg text-gray-400">FCFA</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-gray-500">Bonus série</span>
          </div>
          <div className="text-3xl font-bold font-display text-gray-900">
            +{completedCount >= 5 ? '3 000' : '0'} <span className="text-lg text-gray-400">FCFA</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
          Tâches disponibles
        </h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                task.completed
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-100 hover:border-accent/30 hover:bg-accent/5'
              }`}
            >
              {/* Thumbnail */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{ backgroundColor: task.thumbnailColor }}
              >
                {task.completed ? (
                  <Check className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                )}
                {!task.completed && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${difficultyColors[task.difficulty]}`}>
                    {difficultyLabels[task.difficulty]}
                  </span>
                  {isExternal(task) && !task.completed && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      Externe
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.duration}
                  </span>
                  <span className="flex items-center gap-1 text-accent font-bold">
                    +{task.reward.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => handleStartTask(task)}
                disabled={task.completed}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  task.completed
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'btn-primary'
                }`}
              >
                {task.completed ? 'Complété' : 'Commencer'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Astuce pour maximiser vos gains</h3>
            <p className="text-sm text-gray-600">
              Complétez toutes les tâches quotidiennes pour débloquer des bonus de série.
              Pour les vidéos et TikTok, cliquez sur le lien, regardez le contenu, puis revenez valider.
              Chaque tâche complétée crédite immédiatement vos FCFA !
            </p>
          </div>
        </div>
      </div>

      {/* Internal Task Modal (Quiz, Survey, Tutorial, Ads, Sponsored) */}
      {activeTask && !isExternal(activeTask) && (
        <TaskModal
          isOpen={true}
          onClose={() => setActiveTask(null)}
          type={activeTask.taskType}
          title={activeTask.title}
          description={activeTask.description}
          reward={activeTask.reward}
          duration={activeTask.duration}
          thumbnailColor={activeTask.thumbnailColor}
          onComplete={handleTaskComplete}
        />
      )}

      {/* External Task Modal (Video, TikTok) */}
      {activeTask && isExternal(activeTask) && (
        <ExternalTaskModal
          isOpen={true}
          onClose={() => setActiveTask(null)}
          title={activeTask.title}
          description={activeTask.description}
          reward={activeTask.reward}
          externalUrl={activeTask.externalUrl || 'https://www.youtube.com'}
          platform={activeTask.taskType === 'tiktok' ? 'tiktok' : 'video'}
          thumbnailColor={activeTask.thumbnailColor}
          onComplete={handleTaskComplete}
        />
      )}
    </div>
  );
}
