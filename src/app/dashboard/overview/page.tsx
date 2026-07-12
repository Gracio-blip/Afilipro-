'use client';

import { StatsCard } from '@/components/StatsCard';
import { 
  Euro, MousePointerClick, TrendingUp, Percent,
  Trophy, Users, Gift, Target
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { monthlyStats, mockUser } from '@/lib/data';

const categoryData = [
  { name: 'Formation', value: 35, color: '#1E3A5F' },
  { name: 'Tech', value: 25, color: '#D4AF37' },
  { name: 'Beauté', value: 20, color: '#EC4899' },
  { name: 'Santé', value: 12, color: '#10B981' },
  { name: 'Maison', value: 8, color: '#F59E0B' },
];

const weeklyData = [
  { day: 'Lun', clicks: 240, conversions: 8 },
  { day: 'Mar', clicks: 320, conversions: 12 },
  { day: 'Mer', clicks: 280, conversions: 10 },
  { day: 'Jeu', clicks: 410, conversions: 15 },
  { day: 'Ven', clicks: 520, conversions: 18 },
  { day: 'Sam', clicks: 680, conversions: 24 },
  { day: 'Dim', clicks: 590, conversions: 21 },
];

const achievements = [
  { label: 'Première vente', unlocked: true, icon: Trophy },
  { label: '100 clics', unlocked: true, icon: Target },
  { label: '1000€ gagnés', unlocked: true, icon: Euro },
  { label: '5 filleuls', unlocked: true, icon: Users },
  { label: 'Top 10%', unlocked: true, icon: Gift },
  { label: '10K clics', unlocked: false, icon: Target },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-display mb-2">Overview</h1>
          <p className="text-white/80">Vue d'ensemble de vos performances</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Gains totaux" value={mockUser.totalEarnings} suffix=" FCFA" icon={Euro} trend={12} color="accent" />
        <StatsCard label="Clics" value={mockUser.totalClicks} icon={MousePointerClick} trend={8} color="primary" />
        <StatsCard label="Conversions" value={mockUser.totalConversions} icon={TrendingUp} trend={15} color="success" />
        <StatsCard label="Taux conversion" value={mockUser.conversionRate} suffix="%" icon={Percent} trend={2} color="primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
            Revenus mensuels
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${Number(v).toLocaleString('fr-FR')} FCFA`, 'Revenus']}
                />
                <Line type="monotone" dataKey="earnings" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
            Répartition par catégorie
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
          Activité hebdomadaire
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="clicks" name="Clics" fill="#1E3A5F" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversions" name="Conversions" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
          Accomplissements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((a, i) => (
            <div 
              key={i}
              className={`p-4 rounded-2xl text-center transition-all ${
                a.unlocked 
                  ? 'bg-gradient-to-br from-accent/10 to-yellow-50 border-2 border-accent/20' 
                  : 'bg-gray-50 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                a.unlocked ? 'bg-accent/20' : 'bg-gray-200'
              }`}>
                <a.icon className={`w-6 h-6 ${a.unlocked ? 'text-accent' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs font-semibold text-gray-700">{a.label}</div>
              {a.unlocked && (
                <div className="text-xs text-success mt-1">✓ Débloqué</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
