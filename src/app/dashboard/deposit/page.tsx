'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, CheckCircle2, Clock3, Phone, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { formatCFA } from '@/lib/data';
import { getClientAuthHeaders } from '@/lib/client-auth';

const methods = [
  { id: 'mixx',  name: 'Mixx by Yas', short: 'YAS', brand: 'bg-[#7c3aed] text-white', desc: 'Yas Mobile' },
  { id: 'moov',  name: 'Moov Money',  short: 'M',   brand: 'bg-[#00a651] text-white', desc: 'Moov Africa' },
] as const;

export default function DepositPage() {
  const { user, transactions, refresh } = useWallet();
  const { showToast } = useToast();
  const [method, setMethod] = useState<(typeof methods)[number]['id']>('mixx');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reference: string; amount: number } | null>(null);

  const isFirstDeposit = !transactions.some(t => t.type === 'deposit');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (isNaN(num) || num < 2500) { showToast('Montant minimum : 2 500 FCFA', 'error'); return; }
    setLoading(true);
    setConfirmation(null);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
        body: JSON.stringify({ amount: num, paymentMethod: method, phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok || !data.transaction) throw new Error(data.error || 'Erreur');
      setConfirmation(data.transaction);
      showToast('Demande enregistrée — validation par l\'administrateur', 'success');
      setAmount('');
      await refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 pt-14 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#352461] via-[#4b2f83] to-[#6f45b5] p-7 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Portefeuille</p>
        <h1 className="mt-2 text-3xl font-bold font-display">Effectuer un dépôt</h1>
        <p className="mt-2 text-sm text-violet-100">
          Premier dépôt minimum : <strong>2 500 FCFA</strong> pour activer votre compte.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Carte utilisateur */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-[#56378f]">
                <UserRound className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">{user?.name ?? '…'}</p>
                <p className="truncate text-xs text-slate-500">{user?.email ?? '—'}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
              <div><p className="text-slate-400">Code parrainage</p><p className="mt-1 font-bold text-primary">{(user as any)?.referralCode ?? '—'}</p></div>
              <div><p className="text-slate-400">Statut</p><p className={`mt-1 font-semibold ${user?.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>{user?.status === 'active' ? 'Actif' : 'En attente'}</p></div>
            </div>
          </div>

          {/* Solde */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-primary p-6 text-white shadow-lg">
            <p className="text-xs text-slate-400">Solde actuel</p>
            <p className="mt-2 text-3xl font-bold font-display text-accent">{formatCFA(user?.balance ?? 0)}</p>
          </div>

          {isFirstDeposit && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-900">⚡ Premier dépôt</p>
              <p className="mt-1 text-xs text-amber-700">Déposez 2 500 FCFA minimum pour activer votre compte et accéder à toutes les fonctionnalités.</p>
            </div>
          )}

          <Link href="/dashboard/withdrawals" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-primary hover:text-primary transition">
            Aller aux retraits →
          </Link>
        </div>

        {/* Formulaire */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Choisir un moyen de dépôt</h2>
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>

          {/* Méthodes de paiement */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {methods.map(m => (
              <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={`rounded-2xl border-2 p-2.5 text-left transition ${method === m.id ? 'border-[#6f45b5] bg-violet-50' : 'border-slate-100 hover:border-slate-200'}`}
                title={m.name}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-[9px] font-black ${m.brand}`}>{m.short}</span>
                <span className="mt-2 block text-[9px] font-bold text-slate-700 truncate">{m.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">Montant (FCFA)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="Minimum 2 500 FCFA" min={2500}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-bold outline-none focus:border-[#6f45b5] focus:bg-white focus:ring-4 focus:ring-violet-100"
                required />
              <div className="mt-2 flex flex-wrap gap-2">
                {[2500, 5000, 10000, 25000].map(v => (
                  <button key={v} type="button" onClick={() => setAmount(String(v))}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-violet-100 hover:text-[#56378f]">
                    {formatCFA(v)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Numéro {methods.find(m => m.id === method)?.name}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:border-[#6f45b5] focus:bg-white focus:ring-4 focus:ring-violet-100"
                  required />
              </div>
            </div>

            <button disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4b2f83] to-[#6f45b5] px-5 py-4 font-bold text-white shadow-lg disabled:opacity-60">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><ArrowDownToLine className="h-5 w-5" /> Déposer</>}
            </button>
          </form>

          {confirmation && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">Demande enregistrée : {formatCFA(confirmation.amount)}</p>
                  <p className="mt-1 text-xs text-emerald-700">Réf : {confirmation.reference}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                    <Clock3 className="h-3 w-3" /> En attente de validation par l'administrateur
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
