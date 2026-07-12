'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { formatCFA } from '@/lib/data';
import { useWallet } from '@/components/WalletProvider';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AP';
}

export function DashboardHeader() {
  const { user, loading } = useWallet();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-17 items-center justify-between gap-3 pl-17 pr-4 sm:pr-6 lg:pr-8">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md sm:flex">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold font-display text-primary">
              Afili<span className="text-accent">Pro</span>
            </div>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block">Gagnez. Évoluez.</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard/withdrawals"
            className="flex items-center gap-2 rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-amber-50 px-3 py-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <div className="text-[9px] leading-none text-slate-500">Solde</div>
              <div className="mt-0.5 whitespace-nowrap text-xs font-bold text-slate-950">
                {loading ? '…' : formatCFA(user?.balance ?? 0)}
              </div>
            </div>
          </Link>

          <Link href="/dashboard/account" className="flex items-center gap-2 border-l border-slate-100 pl-2 sm:pl-3">
            <div className="hidden text-right sm:block">
              <div className="max-w-32 truncate text-xs font-bold text-slate-900">{user?.name ?? 'Mon compte'}</div>
              <div className="text-[9px] font-semibold uppercase text-accent">Membre</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials(user?.name ?? 'Afili Pro')}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
