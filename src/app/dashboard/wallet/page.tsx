'use client';

import { useWallet } from '@/components/WalletProvider';
import { formatCFA } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight, Clock, Wallet, TrendingUp, Gift, DollarSign } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABELS: Record<string, string> = {
  deposit: 'Dépôt',
  withdrawal: 'Retrait',
  earning: 'Gain activité',
  task_reward: 'Récompense tâche',
  referral_bonus: 'Commission parrainage',
  vip_purchase: 'Investissement VIP',
  vip_daily: 'Revenu VIP journalier',
  admin_credit: 'Crédit admin',
  daily_login: 'Bonus connexion',
  welcome: 'Bonus bienvenue',
};

export default function WalletPage() {
  const { user, transactions, loading } = useWallet();

  const taskEarnings   = transactions.filter(t => t.type === 'task_reward' || t.type === 'earning').reduce((s, t) => s + t.amount, 0);
  const affiliEarnings = transactions.filter(t => t.type === 'referral_bonus').reduce((s, t) => s + t.amount, 0);
  const withdrawn      = transactions.filter(t => t.type === 'withdrawal' && (t.status === 'completed' || t.status === 'paid')).reduce((s, t) => s + t.amount, 0);
  const pendingOut     = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const totalIn        = transactions.filter(t => t.amount > 0 && t.type !== 'withdrawal').reduce((s, t) => s + t.amount, 0);

  const getIcon = (type: string) => {
    if (['deposit', 'referral_bonus', 'task_reward', 'vip_daily', 'admin_credit', 'daily_login', 'earning'].includes(type))
      return <ArrowDownLeft className="h-4 w-4 text-emerald-600" />;
    if (['withdrawal', 'vip_purchase'].includes(type))
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-slate-400" />;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-700',
      paid:      'bg-emerald-100 text-emerald-700',
      pending:   'bg-amber-100 text-amber-700',
      failed:    'bg-red-100 text-red-700',
      rejected:  'bg-red-100 text-red-700',
      approved:  'bg-blue-100 text-blue-700',
    };
    const label: Record<string, string> = {
      completed: 'Complété', paid: 'Payé', pending: 'En attente',
      failed: 'Échoué', rejected: 'Refusé', approved: 'Approuvé',
    };
    return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>{label[status] ?? status}</span>;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-primary p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Mon portefeuille</p>
          <h1 className="mt-2 text-3xl font-bold font-display">Solde disponible</h1>
          <p className="mt-3 text-5xl font-black font-display text-accent">
            {loading ? '…' : formatCFA(user?.balance ?? 0)}
          </p>
        </div>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: TrendingUp, label: 'Total entré',       value: formatCFA(totalIn),        color: 'text-emerald-600' },
          { icon: Gift,       label: 'Gains affiliation', value: formatCFA(affiliEarnings), color: 'text-violet-600'  },
          { icon: DollarSign, label: 'Gains tâches',      value: formatCFA(taskEarnings),   color: 'text-blue-600'    },
          { icon: Wallet,     label: 'Retiré',            value: formatCFA(withdrawn),      color: 'text-slate-600'   },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="flex gap-3">
        <Link href="/dashboard/deposit" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 font-bold text-white shadow-lg shadow-accent/20">
          <ArrowDownLeft className="h-5 w-5" /> Déposer
        </Link>
        <Link href="/dashboard/withdrawals" className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white py-3.5 font-bold text-primary">
          <ArrowUpRight className="h-5 w-5" /> Retirer
        </Link>
      </div>

      {/* Historique complet */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold font-display text-slate-900">Historique complet</h2>
          {pendingOut > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              {formatCFA(pendingOut)} en attente
            </span>
          )}
        </div>
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Wallet className="mx-auto h-10 w-10 mb-3" />
            <p>Aucune transaction pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  {getIcon(tx.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {tx.paymentMethod && ` · ${tx.paymentMethod}`}
                  </p>
                  {tx.note && <p className="text-[10px] text-slate-400 italic">{tx.note}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'withdrawal' || tx.type === 'vip_purchase' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {tx.type === 'withdrawal' || tx.type === 'vip_purchase' ? '-' : '+'}{formatCFA(tx.amount)}
                  </p>
                  {getStatusBadge(tx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
