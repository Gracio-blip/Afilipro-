'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { 
  Copy, Crown, Gift, Network, Percent, Star,
  TrendingUp, UserPlus, Users, Check
} from 'lucide-react';

// Commission 8% niveau 1 sur les dépôts des filleuls directs
const LEVEL1_RATE = 8;

const mockDownlines = [
  { id: 1, name: 'Moussa Traoré',    avatar: 'MT', joinDate: '15 Jan 2025', depositTotal: 17000, commission: Math.floor(17000*0.08), status: 'active', level: 1 },
  { id: 2, name: 'Akossiwa Dossou', avatar: 'AD', joinDate: '20 Jan 2025', depositTotal: 35000, commission: Math.floor(35000*0.08), status: 'active', level: 1 },
  { id: 3, name: 'Aminata Diallo',  avatar: 'AD', joinDate: '28 Jan 2025', depositTotal: 7000,  commission: Math.floor(7000*0.08),  status: 'active', level: 1 },
  { id: 4, name: 'Koffi Agbéko',    avatar: 'KA', joinDate: '02 Fév 2025', depositTotal: 15000, commission: Math.floor(15000*0.08), status: 'active', level: 1 },
  { id: 5, name: 'Fatoumata Keita', avatar: 'FK', joinDate: '05 Fév 2025', depositTotal: 7000,  commission: Math.floor(7000*0.08),  status: 'active', level: 1 },
  { id: 6, name: 'Sènan Adjovi',    avatar: 'SA', joinDate: '10 Fév 2025', depositTotal: 0,     commission: 0,                      status: 'inactive', level: 1 },
  { id: 7, name: 'Fanta Koné',      avatar: 'FK', joinDate: '12 Fév 2025', depositTotal: 0,     commission: 0,                      status: 'inactive', level: 1 },
];

export default function DownlinesPage() {
  const { showToast } = useToast();
  const { user } = useWallet();
  const [copied, setCopied] = useState(false);

  const code = user?.name?.toLowerCase().replace(/\s+/g, '_') ?? 'mon_code';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://afilipro.com'}/auth?ref=${code}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Lien de parrainage copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDeposits    = mockDownlines.reduce((s, d) => s + d.depositTotal, 0);
  const totalCommissions = mockDownlines.reduce((s, d) => s + d.commission,   0);
  const activeCount      = mockDownlines.filter(d => d.status === 'active').length;
  const paidCount        = mockDownlines.filter(d => d.depositTotal > 0).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pt-14">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Network className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">Parrainage</h1>
            <p className="text-white/80">Gagnez 8% sur chaque dépôt de vos filleuls directs</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users,     label: 'Filleuls',          value: `${mockDownlines.length}`,                        sub: `${activeCount} actifs`   },
          { icon: TrendingUp,label: 'Ayant déposé',      value: `${paidCount}`,                                  sub: 'dépôt effectué'          },
          { icon: Percent,   label: 'Dépôts filleuls',   value: `${(totalDeposits/1000).toFixed(0)}k FCFA`,      sub: 'total cumulé'            },
          { icon: Gift,      label: 'Vos commissions',   value: `${totalCommissions.toLocaleString('fr-FR')} FCFA`, sub: '8% des dépôts'         },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="mt-1 font-bold font-display text-slate-900">{s.value}</div>
            <div className="text-[10px] text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Explication commission */}
      <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-yellow-50 border-2 border-accent/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20">
            <Star className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Comment ça marche ?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Partagez votre lien de parrainage. Lorsqu'un filleul effectue un <strong>dépôt validé</strong>,
              vous recevez automatiquement <strong className="text-accent">{LEVEL1_RATE}% du montant déposé</strong> sur votre compte.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 shadow-sm">
                <Crown className="h-4 w-4 text-accent" />
                <span className="font-semibold text-gray-700">Filleul dépose 10 000 FCFA</span>
              </div>
              <div className="text-gray-400 self-center">→</div>
              <div className="flex items-center gap-1.5 rounded-xl bg-accent/20 px-3 py-1.5">
                <Gift className="h-4 w-4 text-accent" />
                <span className="font-bold text-accent">Vous recevez 800 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lien parrainage */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <UserPlus className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Votre lien de parrainage</h3>
            <p className="text-sm text-gray-500">Partagez-le sur WhatsApp, Facebook, TikTok…</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-600 outline-none"
          />
          <button
            onClick={handleCopy}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-all ${
              copied ? 'bg-green-500 text-white' : 'btn-primary'
            }`}
          >
            {copied ? <><Check className="h-4 w-4" /> Copié</> : <><Copy className="h-4 w-4" /> Copier</>}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Code parrainage : <strong className="text-primary">{code}</strong>
        </p>
      </div>

      {/* Liste filleuls */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-xl font-bold font-display text-gray-900">Mes filleuls</h2>
          <p className="text-sm text-gray-500 mt-1">
            Commission générée dès qu'ils effectuent leur premier dépôt validé
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase">
                <th className="px-6 py-3 font-semibold">Filleul</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Dépôt total</th>
                <th className="px-6 py-3 font-semibold">Votre commission (8%)</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {mockDownlines.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-xs font-bold text-white">
                        {d.avatar}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.joinDate}</td>
                  <td className="px-6 py-4">
                    {d.depositTotal > 0 ? (
                      <span className="font-semibold text-gray-900 text-sm">
                        {d.depositTotal.toLocaleString('fr-FR')} FCFA
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Pas encore de dépôt</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {d.commission > 0 ? (
                      <span className="font-bold font-display text-accent">
                        +{d.commission.toLocaleString('fr-FR')} FCFA
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                      d.status === 'active'
                        ? d.depositTotal > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {d.status === 'active'
                        ? d.depositTotal > 0 ? 'Déposé ✓' : 'En attente de dépôt'
                        : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totaux */}
        <div className="flex items-center justify-between border-t border-accent/20 bg-accent/5 px-6 py-4">
          <span className="font-bold text-gray-700">Total commissions générées</span>
          <span className="text-xl font-black font-display text-accent">
            +{totalCommissions.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}
