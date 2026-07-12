'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { mockUser } from '@/lib/data';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit2, 
  Save, Camera, Shield, Bell, Lock, CreditCard,
  Trophy, Star, TrendingUp, Crown
} from 'lucide-react';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: '+228 90 12 34 56',
    address: 'Lomé, Togo',
    bio: 'Affilié passionné par le marketing digital. J\'aime partager mes découvertes et aider les autres à réussir dans l\'affiliation en Afrique de l\'Ouest.',
  });

  const handleSave = () => {
    setEditing(false);
    showToast('Profil mis à jour avec succès', 'success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const stats = [
    { label: 'Membre depuis', value: mockUser.joinDate, icon: Calendar },
    { label: 'Niveau', value: 'Gold Member', icon: Crown },
    { label: 'Points', value: '12 450', icon: Star },
    { label: 'Classement', value: '#4', icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-4xl font-bold border-4 border-white/20">
              KM
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-display mb-2">{mockUser.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3" /> Gold Member
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">
                Vérifié
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">
                Top 5%
              </span>
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors"
          >
            {editing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {editing ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="font-bold text-gray-900 font-display">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none resize-none disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display text-gray-900">
                Moyens de paiement
              </h2>
              <button className="text-sm text-primary font-semibold hover:text-accent">
                + Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Visa', last4: '4242', expiry: '12/25', primary: true },
                { type: 'PayPal', last4: 'marie@...', expiry: '', primary: false },
              ].map((method, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{method.type}</div>
                    <div className="text-sm text-gray-500">•••• {method.last4}</div>
                  </div>
                  {method.primary && (
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-semibold">
                      Principal
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-primary">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Sécurité
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Changer le mot de passe', icon: Lock },
                { label: 'Authentification 2FA', icon: Shield },
                { label: 'Sessions actives', icon: Bell },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => showToast('Fonctionnalité à venir', 'info')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-700 flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Accomplissements
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Première vente', unlocked: true },
                { label: '100 clics', unlocked: true },
                { label: '1000€ gagnés', unlocked: true },
                { label: '5 filleuls', unlocked: true },
                { label: 'Top 10%', unlocked: true },
                { label: '10K clics', unlocked: false },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    a.unlocked ? 'bg-accent/20' : 'bg-gray-100'
                  }`}>
                    {a.unlocked ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${a.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
