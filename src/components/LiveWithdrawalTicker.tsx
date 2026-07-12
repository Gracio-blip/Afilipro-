'use client';

import { useEffect, useState } from 'react';

const ALL_ITEMS = [
  { name: 'Jacques',       amount: 5500,  status: 'Validé',   method: 'Mixx by Yas',  type: 'retrait' },
  { name: 'Jean Junior',   amount: 12000, status: 'En cours', method: 'Moov Money',   type: 'depot'   },
  { name: 'Junior',        amount: 8000,  status: 'Validé',   method: 'Mixx by Yas',  type: 'retrait' },
  { name: 'Jean',          amount: 15000, status: 'Validé',   method: 'Moov Money',   type: 'depot'   },
  { name: 'Brice',         amount: 3000,  status: 'En cours', method: 'Mixx by Yas',  type: 'retrait' },
  { name: 'Kevin',         amount: 9000,  status: 'Validé',   method: 'Moov Money',   type: 'retrait' },
  { name: 'Jacques Junior',amount: 7000,  status: 'En cours', method: 'Mixx by Yas',  type: 'depot'   },
  { name: 'Jean Claude',   amount: 14000, status: 'Validé',   method: 'Moov Money',   type: 'retrait' },
  { name: 'Junior Kossi',  amount: 25000, status: 'En cours', method: 'Mixx by Yas',  type: 'depot'   },
  { name: 'Yannick',       amount: 4500,  status: 'Validé',   method: 'Moov Money',   type: 'retrait' },
  { name: 'Daniel',        amount: 10000, status: 'En cours', method: 'Mixx by Yas',  type: 'retrait' },
  { name: 'Wilfried',      amount: 6000,  status: 'Validé',   method: 'Moov Money',   type: 'depot'   },
  { name: 'Patrick',       amount: 11000, status: 'Validé',   method: 'Mixx by Yas',  type: 'retrait' },
  { name: 'Christian',     amount: 5000,  status: 'Validé',   method: 'Moov Money',   type: 'retrait' },
  { name: 'Jean Jacques',  amount: 13500, status: 'En cours', method: 'Mixx by Yas',  type: 'depot'   },
];

function timeAgo(seconds: number) {
  if (seconds < 60) return `il y a ${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `il y a ${m}min`;
  return `il y a ${Math.floor(m / 60)}h`;
}

export function LiveWithdrawalTicker() {
  const [items, setItems] = useState(() =>
    ALL_ITEMS.slice(0, 8).map((item, i) => ({ ...item, seconds: i * 18 + 5 }))
  );
  const [nextIdx, setNextIdx] = useState(8);
  const [tick, setTick] = useState(0);

  // Incrémenter le temps toutes les secondes
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Toutes les 3 secondes, ajouter un nouvel élément en haut
  useEffect(() => {
    const t = setInterval(() => {
      const newItem = ALL_ITEMS[nextIdx % ALL_ITEMS.length];
      setNextIdx((i) => i + 1);
      setItems((prev) => [
        { ...newItem, seconds: 2 },
        ...prev.slice(0, 7),
      ]);
    }, 3000);
    return () => clearInterval(t);
  }, [nextIdx]);

  // Incrémenter les secondes
  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, seconds: item.seconds + 1 }))
    );
  }, [tick]);

  return (
    /* Visible partout — sous le header sur toutes les tailles d'écran */
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 my-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* En-tête */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
          <span className="text-xs font-bold text-slate-600">Retraits & Dépôts en temps réel</span>
        </div>

        {/* Liste défilante */}
        <div className="divide-y divide-slate-50">
          {items.map((item, i) => {
            const isValidated = item.status === 'Validé';
            const isDeposit   = item.type === 'depot';
            return (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center gap-3 px-4 py-2.5 transition-all duration-500"
                style={{ opacity: i === 0 ? 1 : 1, transform: 'translateY(0)' }}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    isDeposit
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-primary to-blue-700'
                  }`}
                >
                  {item.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-slate-800">
                    <span
                      className={`mr-1.5 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                        isDeposit
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isDeposit ? 'Dépôt' : 'Retrait'}
                    </span>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.method} · {timeAgo(item.seconds)}
                  </p>
                </div>

                {/* Montant + statut */}
                <div className="shrink-0 text-right">
                  <p className={`text-xs font-bold ${isDeposit ? 'text-emerald-600' : 'text-primary'}`}>
                    {isDeposit ? '+' : '-'}{item.amount.toLocaleString('fr-FR')} FCFA
                  </p>
                  <span
                    className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      isValidated
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
