'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Crown, Info } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { formatCFA } from '@/lib/data';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { FirstDepositModal } from '@/components/FirstDepositModal';

const vipPackages = [
  // ─── NIVEAU 1 : 75 JOURS ───
  { level: 1, name: 'Niveau 1 - 2.5K', cost: 2500, days: 75, total: 45000,  daily: 600,  duration: '75j', color: 'from-[#d4af37] to-[#aa8c2c]', textAccent: 'text-amber-100' },
  { level: 2, name: 'Niveau 1 - 4.5K', cost: 4500, days: 75, total: 90000,  daily: 1200, duration: '75j', color: 'from-[#f59e0b] to-[#d97706]', textAccent: 'text-amber-200' },
  { level: 3, name: 'Niveau 1 - 7K',   cost: 7000, days: 75, total: 135000, daily: 1800, duration: '75j', color: 'from-[#e60049] to-[#b30039]', textAccent: 'text-rose-200' },
  
  // ─── NIVEAU 2 : 60 JOURS (Rendement doublé à chaque palier) ───
  { level: 4, name: 'Niveau 2 - 5K',  cost: 5000,  days: 60, total: 90000,  daily: 1500,  duration: '60j', color: 'from-[#7c3aed] to-[#6d28d9]', textAccent: 'text-violet-200' },
  { level: 5, name: 'Niveau 2 - 10K', cost: 10000, days: 60, total: 180000, daily: 3000,  duration: '60j', color: 'from-[#8b5cf6] to-[#7c3aed]', textAccent: 'text-violet-200' },
  { level: 6, name: 'Niveau 2 - 20K', cost: 20000, days: 60, total: 360000, daily: 6000,  duration: '60j', color: 'from-[#a78bfa] to-[#8b5cf6]', textAccent: 'text-violet-200' },
  { level: 7, name: 'Niveau 2 - 50K', cost: 50000, days: 60, total: 720000, daily: 12000, duration: '60j', color: 'from-[#c4b5fd] to-[#a78bfa]', textAccent: 'text-violet-200' },
];

export default function VipPage() {
  const { user, refresh } = useWallet();
  const { showToast } = useToast();
  const router = useRouter();
  const { showDepositModal, closeDepositModal, guardAction } = useActivationGuard();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleUpgrade = async (level: number, cost: number) => {
    if (!user) {
      showToast('Veuillez vous connecter.', 'error');
      router.push('/auth');
      return;
    }

    if (!getClientAuthHeaders()) {
      return;
    }

    if (user.balance < cost) {
      showToast(`Solde insuffisant. Vous avez ${formatCFA(user.balance)}.`, 'error');
      router.push('/dashboard/deposit');
      return;
    }

    setLoadingId(level);
    try {
      const res = await fetch('/api/vip/upgrade', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
        body: JSON.stringify({ level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      showToast(data.message || 'Investissement activé !', 'success');
      await refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erreur', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
      <div className="mx-auto max-w-6xl space-y-8 pt-14 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Investissements VIP</p>
              <h1 className="mt-2 text-3xl font-bold font-display sm:text-4xl">Niveaux VIP</h1>
              <p className="mt-2 text-sm text-slate-400">Paiement unique et garanti à la fin de votre cycle d'investissement.</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 font-display text-xl font-black text-accent">
                V{user?.vipLevel ?? 0}
              </div>
              <div>
                <p className="text-xs text-slate-400">Statut actuel</p>
                <p className="text-base font-bold text-white">VIP {user?.vipLevel ?? 0} {user?.vipLevel === 0 && '(Standard)'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NIVEAU 1 : 75 JOURS ─── */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 border border-amber-500/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black shadow-lg">1</div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">NIVEAU 1 — 75 JOURS</h2>
              <p className="text-xs text-slate-500">De 600 à 1 800 FCFA / jour selon votre pack • Total jusqu'à <strong className="text-emerald-600">135 000 FCFA</strong></p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vipPackages.filter(v => v.duration === '75j').map((vip) => {
              const isCurrent = user?.vipLevel === vip.level;
              const isUnlocked = (user?.vipLevel ?? 0) >= vip.level;
              const loading = loadingId === vip.level;

              return (
                <div key={vip.level} className={`group relative overflow-hidden rounded-3xl border-2 transition hover:-translate-y-1 hover:shadow-2xl ${isCurrent ? 'border-accent bg-gradient-to-b from-amber-50 to-white shadow-xl shadow-accent/20' : 'border-slate-200 bg-white'}`}>
                  <div className={`bg-gradient-to-br ${vip.color} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-4 -mt-4" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-black tracking-wider shadow-sm">{vip.name}</span>
                        <Crown className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-white/80 font-semibold">Investissement</p>
                        <p className="mt-1 text-2xl font-black font-display drop-shadow-lg">{formatCFA(vip.cost)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500 font-semibold">Rendement quotidien</span>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{formatCFA(vip.daily)} / jour</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500 font-semibold">Durée</span>
                      <span className="text-sm font-bold text-slate-900">{vip.days} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Retour total</span>
                      <span className="text-sm font-black font-display text-emerald-600">{formatCFA(vip.total)}</span>
                    </div>

                    {isCurrent ? (
                      <button disabled className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="h-5 w-5" /> Actif
                      </button>
                    ) : isUnlocked ? (
                      <button disabled className="mt-3 w-full rounded-xl bg-slate-200 py-3 text-center font-bold text-slate-500">
                        Déjà acquis
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(vip.level, vip.cost)}
                        disabled={loadingId !== null}
                        className="mt-3 btn-primary flex w-full items-center justify-center gap-2 py-3 font-bold shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40"
                      >
                        {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Investir maintenant</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── NIVEAU 2 : 60 JOURS ─── */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4 border border-violet-500/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white font-black shadow-lg">2</div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">NIVEAU 2 — 60 JOURS</h2>
              <p className="text-xs text-slate-500">Rendement doublé à chaque palier • De <strong className="text-emerald-600">1 500 FCFA</strong> à <strong className="text-emerald-600">12 000 FCFA</strong> par jour</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vipPackages.filter(v => v.duration === '60j').map((vip) => {
              const isCurrent = user?.vipLevel === vip.level;
              const isUnlocked = (user?.vipLevel ?? 0) >= vip.level;
              const loading = loadingId === vip.level;

              return (
                <div key={vip.level} className={`group relative overflow-hidden rounded-3xl border-2 transition hover:-translate-y-1 hover:shadow-2xl ${isCurrent ? 'border-violet-500 bg-gradient-to-b from-violet-50 to-white shadow-xl shadow-violet-500/20' : 'border-slate-200 bg-white'}`}>
                  <div className={`bg-gradient-to-br ${vip.color} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-4 -mt-4" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-black tracking-wider shadow-sm">{vip.name}</span>
                        <Crown className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-white/80 font-semibold">Investissement</p>
                        <p className="mt-1 text-2xl font-black font-display drop-shadow-lg">{formatCFA(vip.cost)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500 font-semibold">Rendement quotidien</span>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{formatCFA(vip.daily)} / jour</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500 font-semibold">Durée</span>
                      <span className="text-sm font-bold text-slate-900">{vip.days} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Retour total</span>
                      <span className="text-sm font-black font-display text-emerald-600">{formatCFA(vip.total)}</span>
                    </div>

                    {isCurrent ? (
                      <button disabled className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="h-5 w-5" /> Actif
                      </button>
                    ) : isUnlocked ? (
                      <button disabled className="mt-3 w-full rounded-xl bg-slate-200 py-3 text-center font-bold text-slate-500">
                        Déjà acquis
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(vip.level, vip.cost)}
                        disabled={loadingId !== null}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 py-3 font-bold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-xl hover:shadow-violet-500/40"
                      >
                        {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Investir maintenant</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Info footer */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-slate-100 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs text-slate-600">Besoin de recharger votre compte avant d'activer un pack VIP ?</p>
          </div>
          <Link href="/dashboard/deposit" className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-sm transition hover:text-accent">
            Faire un dépôt Mixx by Yas / Moov Money
          </Link>
        </div>
      </div>
    </>
  );
}
