'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, Users, TrendingUp, Gift, Crown, Clock } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { formatCFA } from '@/lib/data';
import { getClientAuthHeaders } from '@/lib/client-auth';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export default function ReferralPage() {
  const { user } = useWallet();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('afilipro_cached_referral');
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
    return { totalReferrals: 0, activeReferrals: 0, totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0 };
  });

  const referralCode = (user as any)?.referralCode || '…';
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/auth?ref=${referralCode}`
    : `https://afilipro.com/auth?ref=${referralCode}`;

  useEffect(() => {
    fetch('/api/referral/stats', { headers: getClientAuthHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.stats) {
          setStats(d.stats);
          if (typeof window !== 'undefined') {
            localStorage.setItem('afilipro_cached_referral', JSON.stringify(d.stats));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { icon: Users,     label: 'Filleuls total',       value: stats.totalReferrals,                       sub: '' },
    { icon: TrendingUp,label: 'Filleuls actifs',       value: stats.activeReferrals,                      sub: 'ont déposé' },
    { icon: Gift,      label: 'Gains d\'affiliation',  value: formatCFA(stats.totalEarnings),             sub: 'total gagné' },
    { icon: Crown,     label: 'Disponible',            value: formatCFA(stats.pendingEarnings),           sub: 'à retirer' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 to-purple-800 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Gagnez en invitant</p>
          <h1 className="mt-2 text-3xl font-bold font-display">Programme de parrainage</h1>
          <p className="mt-2 text-sm text-violet-100">
            Invitez vos proches et développez votre réseau pour gagner des commissions.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="font-bold font-display text-slate-900">{s.value}</div>
            <div className="text-[10px] text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lien & Code */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Votre code</p>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-accent/10 border border-accent/30 px-4 py-3">
            <span className="text-2xl font-black font-display text-accent">{referralCode}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lien de parrainage</p>
          <div className="flex gap-2">
            <input
              readOnly value={referralLink}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-600"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'btn-primary'}`}
            >
              {copied ? <><Check className="h-4 w-4" />Copié</> : <><Copy className="h-4 w-4" />Copier</>}
            </button>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
          <p className="text-xs font-bold text-slate-700 mb-3">Comment ça marche ?</p>
          {[
            'Votre filleul s\'inscrit avec votre lien',
            'Il effectue son premier dépôt d\'activation',
            'Vous recevez automatiquement votre commission',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">{i + 1}</span>
              <p className="text-xs text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
