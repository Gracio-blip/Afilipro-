'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { FirstDepositModal } from '@/components/FirstDepositModal';
import { DailyQuizModal } from '@/components/DailyQuizModal';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { formatCFA } from '@/lib/data';
import {
  Brain, Check, CheckCircle2, ClipboardList, ExternalLink,
  Loader2, Music2, Send, Star, Tv, Users2, Gift, CheckCircle, X
} from 'lucide-react';

interface EarnTask {
  id: number;
  title: string;
  description: string;
  type: string;
  rewardAmount: number;
  targetUrl: string | null;
  instructions: string | null;
  completed: boolean;
  totalCompletions: number;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  quiz:              <Brain className="h-5 w-5" />,
  telegram:          <Send className="h-5 w-5" />,
  tiktok_follow:     <Music2 className="h-5 w-5" />,
  youtube_subscribe: <Tv className="h-5 w-5" />,
  instagram_follow:  <Star className="h-5 w-5" />,
  survey:            <ClipboardList className="h-5 w-5" />,
  external_link:     <ExternalLink className="h-5 w-5" />,
  custom:            <Star className="h-5 w-5" />,
};

const TYPE_LABELS: Record<string, string> = {
  quiz:              'Quiz',
  telegram:          'Telegram',
  tiktok_follow:     'TikTok',
  youtube_subscribe: 'YouTube',
  instagram_follow:  'Instagram',
  survey:            'Sondage',
  external_link:     'Lien externe',
  custom:            'Tâche',
};

const TYPE_COLORS: Record<string, string> = {
  quiz:              'bg-violet-100 text-violet-700',
  telegram:          'bg-sky-100 text-sky-700',
  tiktok_follow:     'bg-pink-100 text-pink-700',
  youtube_subscribe: 'bg-red-100 text-red-700',
  instagram_follow:  'bg-fuchsia-100 text-fuchsia-700',
  survey:            'bg-teal-100 text-teal-700',
  external_link:     'bg-slate-100 text-slate-700',
  custom:            'bg-amber-100 text-amber-700',
};

export default function EarnPage() {
  const { refresh } = useWallet();
  const { showToast } = useToast();
  const { isActivated, showDepositModal, closeDepositModal, guardAction } = useActivationGuard();
  const [tasks, setTasks] = useState<EarnTask[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('afilipro_cached_tasks');
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
    return [
      {
        id: 1,
        title: "Visiter notre page Facebook",
        description: "Visitez et aimez notre page Facebook officielle",
        type: "external_link",
        rewardAmount: 150,
        targetUrl: "https://facebook.com",
        instructions: "Cliquez sur le lien, visitez la page et revenez valider.",
        completed: false,
        totalCompletions: 0,
      },
      {
        id: 2,
        title: "Partager AfiliPro",
        description: "Partagez AfiliPro avec un ami",
        type: "custom",
        rewardAmount: 150,
        targetUrl: null,
        instructions: "Partagez le lien de parrainage à un ami.",
        completed: false,
        totalCompletions: 0,
      }
    ];
  });
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);
  
  // Daily Quiz State
  const [dailyQuizClaimed, setDailyQuizClaimed] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const checkDailyQuizStatus = () => {
    const lastClaim = localStorage.getItem('lastDailyQuizClaim');
    const today = new Date().toISOString().slice(0, 10);
    if (lastClaim === today) {
      setDailyQuizClaimed(true);
    } else {
      setDailyQuizClaimed(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks/list', { headers: getClientAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.tasks) {
        setTasks(data.tasks);
        if (typeof window !== 'undefined') {
          localStorage.setItem('afilipro_cached_tasks', JSON.stringify(data.tasks));
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    void fetchTasks(); 
    checkDailyQuizStatus();
  }, []);

  const [taskToConfirm, setTaskToConfirm] = useState<EarnTask | null>(null);

  const handleClaim = async (task: EarnTask) => {
    guardAction(async () => {
      setTaskToConfirm(task);
    });
  };

  const handleConfirmClaim = async (task: EarnTask) => {
    // Ouvrir le lien externe si disponible
    if (task.targetUrl) {
      window.open(task.targetUrl, '_blank');
    }

    setClaiming(task.id);
    setTaskToConfirm(null);
    
    try {
      const res = await fetch('/api/tasks/claim', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
        body: JSON.stringify({ taskId: task.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      showToast(data.message, 'success');
      await refresh();
      void fetchTasks();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur', 'error');
    } finally {
      setClaiming(null);
    }
  };

  const handleQuizSuccess = () => {
    localStorage.setItem('lastDailyQuizClaim', new Date().toISOString().slice(0, 10));
    setDailyQuizClaimed(true);
    refresh();
  };

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
      <DailyQuizModal 
        isOpen={isQuizModalOpen} 
        onClose={() => setIsQuizModalOpen(false)} 
        onSuccess={handleQuizSuccess}
      />

      {/* Modal confirmation tâche */}
      {taskToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-primary to-[#352461] p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Confirmer la tâche</h3>
                <button onClick={() => setTaskToConfirm(null)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-300">{taskToConfirm.description}</p>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">Récompense</p>
                <p className="text-2xl font-bold text-accent">{taskToConfirm.rewardAmount} FCFA</p>
              </div>
              
              <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs text-amber-800 font-semibold">📋 Instructions</p>
                <p className="text-sm text-amber-700 mt-1">{taskToConfirm.instructions || 'Cliquez sur le lien et suivez les instructions.'}</p>
              </div>

              {taskToConfirm.targetUrl && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-800 font-semibold mb-2">🔗 Lien de la tâche :</p>
                  <a 
                    href={taskToConfirm.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-all font-medium underline"
                  >
                    {taskToConfirm.targetUrl}
                  </a>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setTaskToConfirm(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleConfirmClaim(taskToConfirm)}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 font-bold text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Je valide <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-primary to-[#352461] p-8 text-white shadow-xl">
          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Micro-tâches</p>
            <h1 className="mt-2 text-3xl font-bold font-display">Gagner de l'argent</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Complétez des tâches simples et recevez vos FCFA immédiatement sur votre compte.
            </p>
          </div>
        </div>

        {/* Daily Quiz Card */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Gift className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Quiz Quotidien</h2>
                <p className="text-sm text-violet-100">
                  {dailyQuizClaimed 
                    ? "Revenez demain pour un nouveau quiz !" 
                    : "50 FCFA par bonne réponse • 150 FCFA pour 3/3"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsQuizModalOpen(true)}
              disabled={dailyQuizClaimed}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                dailyQuizClaimed 
                  ? "bg-white/20 text-white/60 cursor-not-allowed" 
                  : "bg-white text-violet-600 hover:bg-violet-50 hover:scale-105"
              }`}
            >
              {dailyQuizClaimed ? "Fait ✓" : "Commencer"}
            </button>
          </div>
        </div>

        {/* Grille des tâches */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-bold text-slate-600">Aucune autre tâche disponible pour le moment</p>
            <p className="mt-1 text-sm text-slate-400">Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks.map((task) => {
              const icon = TYPE_ICONS[task.type] ?? <Star className="h-5 w-5" />;
              const badge = TYPE_LABELS[task.type] ?? 'Tâche';
              const badgeColor = TYPE_COLORS[task.type] ?? 'bg-slate-100 text-slate-600';

              return (
                <div
                  key={task.id}
                  className={`flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition ${
                    task.completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${badgeColor}`}>
                        {icon}
                      </div>
                      <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
                        {badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{task.description}</p>
                    )}
                    {task.instructions && (
                      <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 leading-relaxed">
                        {task.instructions}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-lg font-black font-display text-success">
                      +{formatCFA(task.rewardAmount)}
                    </span>

                    {task.completed ? (
                      <div className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Complétée
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(task)}
                        disabled={claiming === task.id}
                        className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-bold disabled:opacity-60"
                      >
                        {claiming === task.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {task.targetUrl && <ExternalLink className="h-4 w-4" />}
                            Je valide
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
