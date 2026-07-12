'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { 
  Gift, Check, Lock, Sparkles, Crown, 
  TrendingUp, Users, Star, Clock, ArrowRight
} from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  requirement: string;
  unlocked: boolean;
  claimed: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const rewards: Reward[] = [
  { id: 2, title: 'Première affiliation', description: 'Générez votre premier lien', amount: 7000, requirement: 'Créer 1 lien d\'affiliation', unlocked: true, claimed: true, icon: TrendingUp, color: 'from-purple-400 to-indigo-500' },
  { id: 3, title: 'Première commission', description: 'Gagnez votre première commission', amount: 17500, requirement: 'Générer 1 vente', unlocked: true, claimed: false, icon: Star, color: 'from-amber-400 to-orange-500' },
  { id: 4, title: 'Parrain actif', description: 'Invitez 3 amis', amount: 21000, requirement: 'Parrainer 3 personnes', unlocked: true, claimed: false, icon: Users, color: 'from-blue-400 to-cyan-500' },
  { id: 5, title: 'Affilié Gold', description: 'Atteignez 1 000 000 FCFA de gains', amount: 70000, requirement: 'Cumuler 1 000 000 FCFA', unlocked: false, claimed: false, icon: Crown, color: 'from-yellow-400 to-amber-600' },
  { id: 6, title: 'Maître Affiliate', description: 'Atteignez 5 000 000 FCFA de gains', amount: 350000, requirement: 'Cumuler 5 000 000 FCFA', unlocked: false, claimed: false, icon: Sparkles, color: 'from-violet-500 to-purple-600' },
];

export default function StarterRewardPage() {
  const { showToast } = useToast();

  const handleClaim = (reward: Reward) => {
    if (!reward.unlocked || reward.claimed) return;
    showToast(`${reward.amount.toLocaleString('fr-FR')} FCFA crédités sur votre compte !`, 'success');
  };

  const totalClaimed = rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.amount, 0);
  const totalAvailable = rewards.filter(r => r.unlocked && !r.claimed).reduce((sum, r) => sum + r.amount, 0);
  const totalPotential = rewards.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Gift className="w-6 h-6" /></div><h1 className="text-3xl font-bold font-display">Starter Reward</h1></div>
          <p className="text-white/80">Récompenses de progression en FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div><span className="text-sm text-gray-500">Déjà réclamé</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">{totalClaimed.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Gift className="w-5 h-5 text-accent" /></div><span className="text-sm text-gray-500">Disponible</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">{totalAvailable.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Sparkles className="w-5 h-5 text-purple-600" /></div><span className="text-sm text-gray-500">Total potentiel</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">{totalPotential.toLocaleString('fr-FR')} FCFA</div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-display text-gray-900">Votre progression</h2>
          <span className="text-sm font-semibold text-accent">{rewards.filter(r => r.claimed).length}/{rewards.length} récompenses</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent to-yellow-500 rounded-full transition-all duration-500" style={{ width: `${(rewards.filter(r => r.claimed).length / rewards.length) * 100}%` }} />
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${reward.claimed ? 'opacity-60' : ''} ${!reward.unlocked ? 'opacity-70' : 'hover:shadow-xl hover:scale-105'}`}>
            <div className={`h-32 bg-gradient-to-br ${reward.color} relative flex items-center justify-center`}>
              {reward.unlocked ? <reward.icon className="w-16 h-16 text-white/80" /> : <Lock className="w-16 h-16 text-white/60" />}
              {reward.claimed && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Réclamé</div>}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-1">{reward.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{reward.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div><div className="text-2xl font-bold font-display text-accent">+{reward.amount.toLocaleString('fr-FR')}</div><div className="text-xs text-gray-400">FCFA</div></div>
                <div className="text-right"><div className="text-xs text-gray-500 mb-1">Condition</div><div className="text-xs font-medium text-gray-700">{reward.requirement}</div></div>
              </div>
              <button onClick={() => handleClaim(reward)} disabled={!reward.unlocked || reward.claimed} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${!reward.unlocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : reward.claimed ? 'bg-green-100 text-green-700 cursor-default' : 'btn-primary'}`}>
                {!reward.unlocked ? <><Lock className="w-4 h-4" /> Verrouillé</> : reward.claimed ? <><Check className="w-4 h-4" /> Réclamé</> : <>Réclamer <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-accent/10 to-yellow-50 rounded-2xl p-6 border-2 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-accent" /></div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Comment débloquer plus de récompenses ?</h3>
            <p className="text-sm text-gray-600">Continuez à utiliser AfiliPro pour débloquer des bonus supplémentaires. Chaque étape de votre parcours est récompensée en FCFA !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
