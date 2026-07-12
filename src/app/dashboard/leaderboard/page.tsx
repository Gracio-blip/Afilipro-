'use client';

import { 
  Trophy, Medal, Crown, Star, 
  Users, Target
} from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  avatar: string;
  earnings: number;
  conversions: number;
  rank: number;
  change: number;
  isMe?: boolean;
}

const leaders: Leader[] = [
  { id: 1, name: 'Akossiwa Dossou', avatar: 'AD', earnings: 2127000, conversions: 189, rank: 1, change: 0 },
  { id: 2, name: 'Moussa Traoré', avatar: 'MT', earnings: 1893000, conversions: 156, rank: 2, change: 1 },
  { id: 3, name: 'Aminata Diallo', avatar: 'AD', earnings: 1411000, conversions: 134, rank: 3, change: -1 },
  { id: 4, name: 'Kodjo Mensah', avatar: 'KM', earnings: 1865000, conversions: 156, rank: 4, change: 2, isMe: true },
  { id: 5, name: 'Koffi Agbéko', avatar: 'KA', earnings: 1083000, conversions: 98, rank: 5, change: 0 },
  { id: 6, name: 'Fatoumata Keita', avatar: 'FK', earnings: 938000, conversions: 87, rank: 6, change: 3 },
  { id: 7, name: 'Sènan Adjovi', avatar: 'SA', earnings: 843000, conversions: 76, rank: 7, change: -2 },
  { id: 8, name: 'Chantal Hountondji', avatar: 'CH', earnings: 756000, conversions: 65, rank: 8, change: 1 },
  { id: 9, name: 'Amadou Konaté', avatar: 'AK', earnings: 647000, conversions: 54, rank: 9, change: -1 },
  { id: 10, name: 'Djénéba Coulibaly', avatar: 'DC', earnings: 574000, conversions: 43, rank: 10, change: 0 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2: return <Medal className="w-6 h-6 text-gray-400" />;
    case 3: return <Medal className="w-6 h-6 text-orange-400" />;
    default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  }
};

export default function LeaderboardPage() {
  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myRank = leaders.find(l => l.isMe);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Trophy className="w-6 h-6" /></div>
            <h1 className="text-3xl font-bold font-display">Leaderboard</h1>
          </div>
          <p className="text-white/80">Classement des meilleurs affiliés</p>
        </div>
      </div>

      {/* My Rank */}
      {myRank && (
        <div className="bg-gradient-to-br from-accent/10 to-yellow-50 rounded-2xl p-6 border-2 border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center"><Trophy className="w-8 h-8 text-accent" /></div>
              <div>
                <div className="text-sm text-gray-600">Votre classement</div>
                <div className="text-3xl font-bold font-display text-gray-900">#{myRank.rank}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Gains totaux</div>
              <div className="text-2xl font-bold font-display text-accent">{myRank.earnings.toLocaleString('fr-FR')} FCFA</div>
              <div className="text-xs text-green-600">↑ +{myRank.change} places</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {/* 2nd */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center font-bold text-white text-xl mb-2">{top3[1].avatar}</div>
          <div className="font-bold text-gray-900 mb-1">{top3[1].name}</div>
          <div className="text-sm font-bold text-gray-700">{(top3[1].earnings/1000).toFixed(0)}k FCFA</div>
          <div className="mt-4 bg-gray-200 rounded-t-xl h-20 flex items-center justify-center"><div className="text-4xl font-bold font-display text-gray-500">2</div></div>
        </div>
        {/* 1st */}
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-center text-white transform scale-105">
          <Crown className="w-10 h-10 mx-auto mb-2" />
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center font-bold text-white text-2xl mb-2">{top3[0].avatar}</div>
          <div className="font-bold text-lg mb-1">{top3[0].name}</div>
          <div className="text-xl font-bold font-display">{(top3[0].earnings/1000).toFixed(0)}k FCFA</div>
          <div className="mt-4 bg-yellow-600 rounded-t-xl h-28 flex items-center justify-center"><div className="text-5xl font-bold font-display text-white">1</div></div>
        </div>
        {/* 3rd */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center font-bold text-white text-xl mb-2">{top3[2].avatar}</div>
          <div className="font-bold text-gray-900 mb-1">{top3[2].name}</div>
          <div className="text-sm font-bold text-gray-700">{(top3[2].earnings/1000).toFixed(0)}k FCFA</div>
          <div className="mt-4 bg-orange-200 rounded-t-xl h-16 flex items-center justify-center"><div className="text-3xl font-bold font-display text-orange-600">3</div></div>
        </div>
      </div>

      {/* Full Ranking */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold font-display text-gray-900">Classement complet</h2></div>
        <div className="divide-y divide-gray-50">
          {rest.map((leader) => (
            <div key={leader.id} className={`flex items-center gap-4 p-4 transition-colors ${leader.isMe ? 'bg-accent/5 border-l-4 border-accent' : 'hover:bg-gray-50'}`}>
              <div className="w-12 text-center">{getRankIcon(leader.rank)}</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center font-bold text-white">{leader.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 flex items-center gap-2">{leader.name}{leader.isMe && <span className="text-xs text-accent">(Vous)</span>}</div>
                <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {leader.conversions} conversions</span>
                  {leader.change !== 0 && <span className={`flex items-center gap-1 ${leader.change > 0 ? 'text-green-600' : 'text-red-500'}`}>{leader.change > 0 ? '↑' : '↓'} {Math.abs(leader.change)}</span>}
                </div>
              </div>
              <div className="text-right"><div className="font-bold font-display text-accent text-lg">{(leader.earnings/1000).toFixed(0)}k FCFA</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Star className="w-5 h-5 text-primary" /></div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Récompenses du classement mensuel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2"><Crown className="w-4 h-4 text-yellow-400" /><span className="text-gray-600">#1: 350 000 FCFA bonus</span></div>
              <div className="flex items-center gap-2"><Medal className="w-4 h-4 text-gray-400" /><span className="text-gray-600">#2: 175 000 FCFA bonus</span></div>
              <div className="flex items-center gap-2"><Medal className="w-4 h-4 text-orange-400" /><span className="text-gray-600">#3: 70 000 FCFA bonus</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
