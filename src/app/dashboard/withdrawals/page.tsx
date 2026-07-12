'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpFromLine, CheckCircle2, Clock3, Phone, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { formatCFA } from '@/lib/data';
import { getClientAuthHeaders } from '@/lib/client-auth';

const methods = [
  { id: 'mixx',  name: 'Mixx by Yas', short: 'YAS', brand: 'bg-[#7c3aed] text-white' },
  { id: 'moov',  name: 'Moov Money',  short: 'M',   brand: 'bg-[#00a651] text-white' },
] as const;

const MIN_WITHDRAW = 3000;

export default function WithdrawalsPage() {
  const { user, transactions, refresh } = useWallet();
  const { showToast } = useToast();
  const [method, setMethod] = useState<(typeof methods)[number]['id']>('mixx');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reference: string; amount: number } | null>(null);

  const balance = user?.balance ?? 0;
  const today = new Date().toISOString().slice(0, 10);
  const withdrawalsToday = transactions.filter(t => t.type === 'withdrawal' && t.createdAt.slice(0, 10) === today).length;
  const remainingWithdrawals = Math.max(0, 2 - withdrawalsToday);
  
  const withdrawalCount = user?.withdrawalCount ?? 0;
  const nextRequiredWithdrawal = 1500 + (2000 * withdrawalCount);
  const withdrawableBalance = user?.withdrawableBalance ?? balance;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = nextRequiredWithdrawal;
    if (num > withdrawableBalance) { 
      showToast('Solde retirable insuffisant. Votre capital de dépôt est protégé.', 'error'); 
      return; 
    }
    setLoading(true);
    setConfirmation(null);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
        body: JSON.stringify({ amount: num, paymentMethod: method, phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok || !data.transaction) throw new Error(data.error || 'Erreur');
      setConfirmation(data.transaction);
      showToast('Demande enregistrée — en attente de validation.', 'success');
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
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#6f45b5]">Portefeuille</p>
        <h1 className="mt-2 text-3xl font-bold font-display text-slate-950">Retrait des gains</h1>
        <p className="mt-1 text-sm text-slate-500">
          Votre capital d'investissement ne peut pas être retiré. Seuls vos gains sont retirables via les paliers successifs.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {/* Profil */}
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
              <div><p className="text-slate-400">Code parrain</p><p className="mt-1 font-bold text-primary">{(user as any)?.referralCode ?? '—'}</p></div>
              <div><p className="text-slate-400">Compte</p><p className="mt-1 font-semibold text-emerald-600">Vérifié</p></div>
            </div>
          </div>

          {/* Solde */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#352461] via-[#4b2f83] to-[#6f45b5] p-6 text-white shadow-xl">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-between text-xs text-violet-200">
                <span>Solde retirable (hors capital)</span>
                <WalletCards className="h-5 w-5" />
              </div>
              <p className="mt-3 text-4xl font-bold font-display text-emerald-300">{formatCFA(withdrawableBalance)}</p>
              <p className="mt-1 text-xs text-white/60">Solde total: {formatCFA(balance)}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-xs">
                <div><span className="text-violet-200">Palier de retrait</span><p className="mt-1 font-bold">{formatCFA(nextRequiredWithdrawal)}</p></div>
                <div className="text-right"><span className="text-violet-200">Retraits restants</span><p className="mt-1 font-bold">{remainingWithdrawals}/2</p></div>
              </div>
            </div>
          </div>

          {withdrawableBalance < nextRequiredWithdrawal && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <WalletCards className="h-6 w-6 shrink-0 text-amber-500" />
              <div>
                <p className="font-bold text-amber-950 text-sm">Solde insuffisant</p>
                <p className="text-xs text-amber-700">Il vous manque {formatCFA(nextRequiredWithdrawal - withdrawableBalance)} en gains pour atteindre votre prochain palier de retrait.</p>
              </div>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 mb-6">
            <Link href="/dashboard/deposit" className="rounded-xl px-4 py-3 text-center text-sm font-bold text-slate-500 hover:text-[#56378f]">Dépôt</Link>
            <span className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[#56378f] shadow-sm">Retrait</span>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Où recevoir vos gains ?</h2>
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {methods.map(m => (
              <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={`rounded-2xl border-2 p-2.5 transition ${method === m.id ? 'border-[#6f45b5] bg-violet-50' : 'border-slate-100'}`}
                title={m.name}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-[9px] font-black ${m.brand}`}>{m.short}</span>
                <span className="mt-2 block text-[9px] font-bold text-slate-700 truncate">{m.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">Montant à retirer (Palier imposé)</label>
              <input type="number" value={nextRequiredWithdrawal} readOnly disabled
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4 text-lg font-bold text-slate-500 outline-none cursor-not-allowed"
                required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Numéro {methods.find(m => m.id === method)?.name}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:border-[#6f45b5] focus:bg-white"
                  required />
              </div>
            </div>
            <button disabled={loading || withdrawableBalance < nextRequiredWithdrawal || remainingWithdrawals === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4b2f83] to-[#6f45b5] px-5 py-4 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 transition hover:brightness-110">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : remainingWithdrawals === 0 ? 'Limite quotidienne atteinte'
                : <><ArrowUpFromLine className="h-5 w-5" /> Retirer {formatCFA(nextRequiredWithdrawal)}</>}
            </button>
          </form>

          {confirmation && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">Retrait enregistré : {formatCFA(confirmation.amount)}</p>
                  <p className="mt-1 text-xs text-emerald-700">Réf : {confirmation.reference}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                    <Clock3 className="h-3 w-3" /> En attente de validation — statut : Payé après traitement
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
