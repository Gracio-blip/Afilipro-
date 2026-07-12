'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, WalletCards } from 'lucide-react';
import { useWallet } from '@/components/WalletProvider';

const ALLOWED_BEFORE_ACTIVATION = [
  '/dashboard/deposit',
  '/dashboard/transactions',
];

export function AccountActivationGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useWallet();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const activated = user.status === 'active';
  const allowedRoute = ALLOWED_BEFORE_ACTIVATION.some((route) => pathname.startsWith(route));

  if (activated || allowedRoute) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl">
        <div className="bg-gradient-to-br from-slate-950 via-primary to-[#352461] p-8 text-white sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <LockKeyhole className="h-8 w-8 text-accent" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">Compte en attente</p>
          <h1 className="mt-2 text-3xl font-bold font-display">Activez votre compte</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
            Votre compte a été créé avec un solde de 0 FCFA. Effectuez votre premier dépôt d’investissement, puis attendez sa validation pour accéder aux activités, au Lucky Spin, aux niveaux VIP et au parrainage.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="space-y-3">
            {[
              { icon: WalletCards, title: '1. Effectuez un dépôt', text: 'Montant minimum : 2 500 FCFA.' },
              { icon: Clock3, title: '2. Attendez la validation', text: 'Votre demande apparaît dans l’historique des transactions.' },
              { icon: CheckCircle2, title: '3. Accès automatiquement débloqué', text: 'Après validation, toutes les fonctionnalités deviennent accessibles.' },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href="/dashboard/deposit" className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20">
              <WalletCards className="h-5 w-5" /> Premier dépôt <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/transactions" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Clock3 className="h-5 w-5" /> Suivre ma demande
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
