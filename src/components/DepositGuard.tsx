'use client';

import Link from 'next/link';
import { LockKeyhole, WalletCards, ArrowRight } from 'lucide-react';
import { useWallet } from '@/components/WalletProvider';

interface DepositGuardProps {
  children: React.ReactNode;
}

/**
 * Bloque l'accès à son contenu si l'utilisateur n'a pas encore
 * effectué un dépôt validé (type = 'deposit' & status = 'completed').
 */
export function DepositGuard({ children }: DepositGuardProps) {
  const { user, loading } = useWallet();

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  // Le statut devient "active" uniquement après validation du premier dépôt.
  if (user?.status === 'active') {
    // Accès autorisé → afficher le contenu
    return <>{children}</>;
  }

  // Accès bloqué → afficher le mur de dépôt
  return (
    <div className="mx-auto max-w-lg pt-20 px-4 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-xl border border-slate-100">
        {/* Icône */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <LockKeyhole className="h-10 w-10 text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold font-display text-slate-900 mb-3">
          Accès réservé aux membres actifs
        </h2>
        <p className="text-slate-500 leading-relaxed mb-2">
          Pour accéder aux activités et gagner des FCFA chaque jour, vous devez d'abord effectuer un dépôt d'investissement.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Dépôt minimum : <strong className="text-slate-600">2 500 FCFA</strong> via Mixx by Yas, Moov Money ou MTN Money.
        </p>

        {/* Statut */}
        <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-semibold text-amber-800">
            ⏳ Aucun dépôt validé sur votre compte
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Votre dépôt doit être approuvé par un administrateur avant que les activités soient débloquées.
          </p>
        </div>

        <Link
          href="/dashboard/deposit"
          className="inline-flex items-center gap-2 btn-primary px-8 py-4 text-base font-bold"
        >
          <WalletCards className="h-5 w-5" />
          Effectuer mon dépôt
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-6 text-xs text-slate-400">
          Déjà déposé ?{' '}
          <Link href="/dashboard/transactions" className="text-primary hover:text-accent font-medium">
            Vérifier le statut de mon dépôt →
          </Link>
        </p>
      </div>
    </div>
  );
}
