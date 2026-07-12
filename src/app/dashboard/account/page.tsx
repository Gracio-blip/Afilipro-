'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { mockUser, formatCFA } from '@/lib/data';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit2, 
  Shield, CreditCard, Star, TrendingUp, Wallet,
  Crown, BadgeCheck, Copy
} from 'lucide-react';

export default function AccountPage() {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copié !', 'success');
  };

  const accountStats = [
    { label: 'Membre depuis', value: mockUser.joinDate, icon: Calendar },
    { label: 'Niveau', value: 'Gold Member', icon: Crown },
    { label: 'Points de fidélité', value: '12 450 pts', icon: Star },
    { label: 'Taux de conversion', value: `${mockUser.conversionRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-3xl font-bold">KM</div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5"><BadgeCheck className="w-5 h-5 text-blue-500" /></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold font-display">{mockUser.name}</h1>
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <p className="text-white/80">{mockUser.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">Gold Member</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">Vérifié</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">Top 5%</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors">
            <Edit2 className="w-4 h-4" />{editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {accountStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><stat.icon className="w-5 h-5 text-primary" /></div>
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="font-bold text-gray-900 font-display">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Wallet & Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2"><Wallet className="w-5 h-5 text-accent" /> Portefeuille</h2>
            <button className="text-sm text-primary font-semibold hover:text-accent">Voir l'historique</button>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs text-gray-400 mb-1">Solde disponible</div>
                <div className="text-4xl font-bold font-display">{mockUser.totalEarnings.toLocaleString('fr-FR')} FCFA</div>
              </div>
              <CreditCard className="w-10 h-10 text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-xs text-gray-400">En attente</div><div className="font-bold">103 000 FCFA</div></div>
              <div><div className="text-xs text-gray-400">Total retiré</div><div className="font-bold">1 605 000 FCFA</div></div>
              <div><div className="text-xs text-gray-400">Ce mois</div><div className="font-bold text-accent">186 500 FCFA</div></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 btn-primary py-3">Retirer</button>
            <button className="flex-1 btn-secondary py-3">Dépôt</button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2 mb-6"><Shield className="w-5 h-5 text-primary" /> Sécurité</h2>
          <div className="space-y-4">
            {[
              { label: 'Authentification 2FA', enabled: true },
              { label: 'Vérification email', enabled: true },
              { label: 'Vérification téléphone', enabled: false },
              { label: 'Biométrie', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{item.enabled ? 'Activé' : 'Désactivé'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: User, label: 'Nom complet', value: mockUser.name },
            { icon: Mail, label: 'Email', value: mockUser.email },
            { icon: Phone, label: 'Téléphone', value: '+228 90 12 34 56' },
            { icon: MapPin, label: 'Adresse', value: 'Lomé, Togo' },
          ].map((info, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center"><info.icon className="w-5 h-5 text-primary" /></div>
              <div className="flex-1"><div className="text-xs text-gray-500">{info.label}</div><div className="font-semibold text-gray-900">{info.value}</div></div>
              <button onClick={() => handleCopy(info.value)} className="p-2 text-gray-400 hover:text-primary"><Copy className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
