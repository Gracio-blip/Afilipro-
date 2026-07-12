'use client';

import Link from 'next/link';
import { ArrowRight, X, WalletCards, Zap, TrendingUp, Users } from 'lucide-react';

interface FirstDepositModalProps {
  onClose: () => void;
}

export function FirstDepositModal({ onClose }: FirstDepositModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-slate-950 via-primary to-[#352461] px-6 pb-8 pt-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20">
              <WalletCards className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold font-display">Activez votre accès</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Effectuez votre premier dépôt pour débloquer les jeux, activités et gains quotidiens.
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="divide-y divide-slate-100 px-6">
          {[
            { icon: Zap, color: 'bg-amber-100 text-amber-600', label: 'Lucky Spin', desc: '3 tours gratuits par jour pour gagner des FCFA' },
            { icon: TrendingUp, color: 'bg-violet-100 text-violet-600', label: 'Investissements VIP', desc: 'Gagnez chaque jour pendant 75 jours' },
            { icon: Users, color: 'bg-emerald-100 text-emerald-600', label: 'Parrainage', desc: '8 % sur chaque dépôt de vos filleuls' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3.5">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 pt-4">
          <Link
            href="/dashboard/deposit"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4b2f83] to-[#6f45b5] px-5 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            Effectuer mon premier dépôt
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-center text-xs text-slate-400">
            Minimum 2 500 FCFA · Mixx by Yas · Moov Money
          </p>
        </div>
      </div>
    </div>
  );
}
