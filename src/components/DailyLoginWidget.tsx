'use client';

import { useEffect, useState } from 'react';
import { Gift, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { formatCFA } from '@/lib/data';

const BONUS_KEY = 'afilipro_daily_bonus';

export function DailyLoginWidget() {
  const { user, refresh } = useWallet();
  const { showToast } = useToast();
  const [show, setShow] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [result, setResult] = useState<{ credited: number; streak: number } | null>(null);

  useEffect(() => {
    if (user?.status !== 'active') return;
    const today = new Date().toISOString().slice(0, 10);
    const lastShown = localStorage.getItem(BONUS_KEY);
    if (lastShown !== today) setShow(true);
  }, [user?.status]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/daily-login', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
      });
      const data = await res.json();
      if (data.credited > 0) {
        setResult({ credited: data.credited, streak: data.streak });
        localStorage.setItem(BONUS_KEY, new Date().toISOString().slice(0, 10));
        await refresh();
      } else {
        // Déjà réclamé
        localStorage.setItem(BONUS_KEY, new Date().toISOString().slice(0, 10));
        setShow(false);
      }
    } catch {
      showToast('Erreur lors de la réclamation', 'error');
    } finally {
      setClaiming(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShow(false)} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 px-6 pb-8 pt-6 text-white text-center">
          <div className="absolute right-4 top-4">
            <button onClick={() => setShow(false)} className="rounded-full bg-white/20 p-1.5 hover:bg-white/30">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-3 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Gift className="h-8 w-8" />
            </div>
          </div>
          {result ? (
            <>
              <h2 className="text-2xl font-bold font-display">🎉 Bonus réclamé !</h2>
              <p className="mt-2 text-amber-100">Streak : {result.streak} jour{result.streak > 1 ? 's' : ''}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-display">Bonus quotidien</h2>
              <p className="mt-2 text-amber-100">Connecté aujourd'hui ? Réclamez votre récompense !</p>
            </>
          )}
        </div>

        <div className="p-6 text-center">
          {result ? (
            <>
              <p className="text-4xl font-black font-display text-success">+{formatCFA(result.credited)}</p>
              <p className="mt-1 text-sm text-slate-500">Crédités sur votre compte</p>
              <button
                onClick={() => setShow(false)}
                className="mt-5 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white"
              >
                Super, merci !
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">Revenez chaque jour pour augmenter votre streak et gagner plus !</p>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="mt-5 w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base font-bold"
              >
                {claiming ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Réclamer mon bonus <Gift className="h-5 w-5" /></>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
