'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Copy, Check, Gift, Music2, Network, Sparkles, Star, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { FirstDepositModal } from '@/components/FirstDepositModal';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { useWallet } from '@/components/WalletProvider';
import { useToast } from '@/components/Toast';

const missions = [
  {
    href: '/dashboard/earn',
    title: 'Tâches simples (150 FCFA)',
    description: 'Rejoindre WhatsApp & Telegram — 150 FCFA par tâche',
    icon: Gift,
    gradient: 'from-emerald-500 to-teal-600',
    badge: '150 FCFA',
  },
  {
    href: '/dashboard/tiktok',
    title: 'TikTok du jour',
    description: '2 vidéos disponibles — 200 FCFA / vue',
    icon: Music2,
    gradient: 'from-fuchsia-500 to-pink-600',
    badge: '2/jour',
  },
  {
    href: '/dashboard/quiz',
    title: 'Quiz Challenge',
    description: '100 FCFA par réponse correcte',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-700',
    badge: '5 quiz',
  },
];

const mockDownlines = [
  { name: 'Moussa Traoré',    avatar: 'MT', depositTotal: 17000, commission: Math.floor(17000 * 0.08), status: 'active'   },
  { name: 'Akossiwa Dossou', avatar: 'AD', depositTotal: 35000, commission: Math.floor(35000 * 0.08), status: 'active'   },
  { name: 'Aminata Diallo',  avatar: 'AD', depositTotal: 7000,  commission: Math.floor(7000 * 0.08),  status: 'active'   },
  { name: 'Koffi Agbéko',    avatar: 'KA', depositTotal: 15000, commission: Math.floor(15000 * 0.08), status: 'active'   },
  { name: 'Sènan Adjovi',    avatar: 'SA', depositTotal: 0,     commission: 0,                         status: 'inactive' },
];

export default function MissionsPage() {
  const { user }    = useWallet();
  const { showToast } = useToast();
  const { showDepositModal, closeDepositModal } = useActivationGuard();
  const [copied, setCopied]  = useState(false);

  const code = user?.name?.toLowerCase().replace(/\s+/g, '_') ?? 'mon_code';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://afilipro.com'}/auth?ref=${code}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Lien de parrainage copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommissions = mockDownlines.reduce((s, d) => s + d.commission, 0);
  const paidCount        = mockDownlines.filter(d => d.depositTotal > 0).length;

  return (
    <>
    {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">

      {/* ── Titre ── */}
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Gains quotidiens</p>
            <h1 className="text-3xl font-bold font-display">Activités</h1>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Complétez les activités disponibles chaque jour pour gagner des FCFA.
        </p>
      </section>

      {/* ── Activités — clic → popup si pas encore activé ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {missions.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradient} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent">
                  {m.badge}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-950">{m.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{m.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-emerald-600">Accès direct</span>
                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Parrainage ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Network className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">Parrainage</h2>
            <p className="text-sm text-slate-500">Gagnez 8 % sur chaque dépôt validé de vos filleuls</p>
          </div>
        </div>

        {/* Stats parrainage */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { icon: Users,      label: 'Filleuls',         value: `${mockDownlines.length}` },
            { icon: Star,       label: 'Ont déposé',       value: `${paidCount}` },
            { icon: Gift,       label: 'Commissions',      value: `${totalCommissions.toLocaleString('fr-FR')} FCFA` },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 font-bold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Lien de parrainage */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
              <UserPlus className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Votre lien de parrainage</p>
              <p className="text-xs text-slate-500">Partagez sur WhatsApp, Facebook…</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-xs text-gray-600 outline-none"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-semibold text-xs transition-all ${
                copied ? 'bg-green-500 text-white' : 'btn-primary'
              }`}
            >
              {copied ? <><Check className="h-4 w-4" />Copié</> : <><Copy className="h-4 w-4" />Copier</>}
            </button>
          </div>
        </div>

        {/* Mini-liste filleuls */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="font-bold text-slate-900 text-sm">Mes filleuls récents</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {mockDownlines.map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-[10px] font-bold text-white">
                  {d.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">{d.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {d.depositTotal > 0
                      ? `Dépôt : ${d.depositTotal.toLocaleString('fr-FR')} FCFA`
                      : 'En attente de dépôt'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {d.commission > 0 ? (
                    <span className="text-xs font-bold text-accent">
                      +{d.commission.toLocaleString('fr-FR')} FCFA
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-accent/20 bg-accent/5 px-5 py-3">
            <span className="text-xs font-bold text-slate-600">Total commissions</span>
            <span className="text-sm font-black font-display text-accent">
              +{totalCommissions.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/downlines"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-primary hover:text-primary"
        >
          Voir tout mon équipe de parrainage <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
    </>
  );
}
