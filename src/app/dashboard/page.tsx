'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Dices, DollarSign, Gift, Landmark, Sparkles,
  TrendingUp, Users, Wallet, WalletCards
} from 'lucide-react';
import { useWallet } from '@/components/WalletProvider';
import { useToast } from '@/components/Toast';
import { LiveWithdrawalTicker } from '@/components/LiveWithdrawalTicker';
import { DailyLoginWidget } from '@/components/DailyLoginWidget';
import { FirstDepositModal } from '@/components/FirstDepositModal';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { formatCFA } from '@/lib/data';
import { getClientAuthHeaders } from '@/lib/client-auth';

const quickActions = [
  { href: '/dashboard/earn',       label: 'Gagner',         description: 'Tâches & quiz',       icon: DollarSign, gradient: 'from-emerald-500 to-teal-600' },
  { href: '/dashboard/referral',   label: 'Parrainage',     description: 'Invitez vos proches', icon: Users,      gradient: 'from-indigo-600 to-purple-700' },
  { href: '/dashboard/vip',        label: 'Investir',       description: 'Gains quotidiens',    icon: Sparkles,   gradient: 'from-[#d4af37] to-[#aa8c2c]' },
  { href: '/dashboard/lucky-spin', label: 'Lucky Spin',     description: '3 tours gratuits',    icon: Dices,      gradient: 'from-amber-400 to-orange-500' },
  { href: '/dashboard/deposit',    label: 'Dépôt',          description: 'Mixx by Yas / Moov',icon: WalletCards, gradient: 'from-[#4b2f83] to-[#6f45b5]' },
  { href: '/dashboard/withdrawals',label: 'Retrait',        description: 'Paliers progressifs',  icon: Landmark,   gradient: 'from-slate-600 to-slate-800' },
];

export default function DashboardHome() {
  const { user, transactions, loading, refresh } = useWallet();
  const { showToast } = useToast();
  const { showDepositModal, closeDepositModal } = useActivationGuard();
  const [collecting, setCollecting] = useState(false);

  const hasDeposit  = transactions.some((t) => t.type === 'deposit');
  const hasActiveVip = transactions.some((t) => t.type === 'vip_purchase');

  const handleCollectVip = async () => {
    setCollecting(true);
    try {
      const res = await fetch('/api/vip/daily-income', { method: 'POST', headers: getClientAuthHeaders(true) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      if (data.credited > 0) {
        showToast(`🎉 ${formatCFA(data.credited)} crédités !`, 'success');
        await refresh();
      } else {
        showToast(data.message || 'Aucun gain disponible.', 'info');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erreur', 'error');
    } finally {
      setCollecting(false);
    }
  };

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
      <DailyLoginWidget />

      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-9">
          <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                <Sparkles className="h-3 w-3" /> Mon tableau de bord
              </div>
              <h1 className="mt-4 text-3xl font-bold font-display sm:text-4xl">
                Bonjour, {loading ? '…' : user?.name || 'Membre'} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {user?.status === 'active' ? 'Votre compte est actif.' : 'Activez votre compte avec votre premier dépôt.'}
              </p>
            </div>
            <div className="min-w-52 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Solde disponible</span>
                <Wallet className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-2 text-3xl font-bold font-display text-accent">
                {formatCFA(user?.balance ?? 0)}
              </p>
              {user?.isVip && (
                <span className="mt-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  ★ Membre VIP
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Collecte VIP */}
        {hasActiveVip && (
          <button
            onClick={handleCollectVip}
            disabled={collecting}
            className="w-full flex items-center justify-between rounded-3xl border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-yellow-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">VIP actif</p>
                <h2 className="font-bold text-slate-900">Collecter mes gains quotidiens</h2>
              </div>
            </div>
            <span className="shrink-0 flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white">
              {collecting ? '…' : <><Gift className="h-4 w-4" />Collecter</>}
            </span>
          </button>
        )}

        {/* Premier dépôt */}
        {!hasDeposit && (
          <Link href="/dashboard/deposit" className="flex items-center justify-between rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#56378f] text-white">
                <WalletCards className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#6f45b5]">Activation</p>
                <h2 className="font-bold text-slate-950">Effectuez votre premier dépôt</h2>
                <p className="text-sm text-slate-500">2 500 FCFA · Mixx by Yas · Moov Money</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        )}

        {/* Actions rapides */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Accès rapide</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group relative min-h-28 overflow-hidden rounded-2xl p-4 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient}`} />
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative flex h-full flex-col justify-between">
                  <a.icon className="h-6 w-6" />
                  <div>
                    <div className="font-bold text-sm">{a.label}</div>
                    <div className="text-[10px] text-white/70">{a.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Lien WhatsApp discret en bas */}
        <div className="text-center pb-2">
          <a
            href="https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-green-500 transition-colors"
          >
            📱 Rejoindre le groupe WhatsApp
          </a>
        </div>

        {/* Ticker live */}
        <LiveWithdrawalTicker />
      </div>
    </>
  );
}
