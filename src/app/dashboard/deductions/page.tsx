'use client';

import { 
  TrendingDown, Receipt, Percent, Info, Download
} from 'lucide-react';

interface Deduction {
  id: number;
  type: 'fee' | 'tax' | 'penalty' | 'refund';
  description: string;
  amount: number;
  date: string;
  reason: string;
}

const deductions: Deduction[] = [
  { id: 1, type: 'fee', description: 'Frais de retrait Mobile Money', amount: 2620, date: '08 Fév 2025', reason: 'Retrait 131 000 FCFA via MoMo' },
  { id: 2, type: 'fee', description: 'Frais de transaction', amount: 776, date: '05 Fév 2025', reason: 'Commission 77 600 FCFA' },
  { id: 3, type: 'refund', description: 'Remboursement client', amount: 17000, date: '25 Jan 2025', reason: 'Produit retourné' },
  { id: 4, type: 'fee', description: 'Frais de retrait bancaire', amount: 0, date: '20 Jan 2025', reason: 'Virement gratuit' },
  { id: 5, type: 'penalty', description: 'Pénalité retard', amount: 3500, date: '15 Jan 2025', reason: 'Retrait hors délai' },
  { id: 6, type: 'tax', description: 'TVA sur commissions', amount: 15520, date: '31 Déc 2024', reason: 'TVA mensuelle' },
];

export default function DeductionsPage() {
  const total = deductions.reduce((sum, d) => sum + d.amount, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fee': return 'bg-orange-100 text-orange-700';
      case 'tax': return 'bg-purple-100 text-purple-700';
      case 'penalty': return 'bg-red-100 text-red-700';
      case 'refund': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fee': return 'Frais';
      case 'tax': return 'Taxe';
      case 'penalty': return 'Pénalité';
      case 'refund': return 'Remboursement';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-red-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><TrendingDown className="w-6 h-6" /></div><h1 className="text-3xl font-bold font-display">Deduction History</h1></div>
          <p className="text-white/80">Historique des frais et déductions en FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><Receipt className="w-5 h-5 text-orange-600" /></div><span className="text-sm text-gray-500">Total déduit</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">-{total.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Percent className="w-5 h-5 text-purple-600" /></div><span className="text-sm text-gray-500">Taux moyen</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">2.4%</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Download className="w-5 h-5 text-blue-600" /></div><span className="text-sm text-gray-500">Transactions</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">{deductions.length}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">Les déductions incluent les frais de transaction, taxes, pénalités et remboursements. Consultez chaque ligne pour comprendre les raisons.</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-gray-900">Détails des déductions</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"><Download className="w-4 h-4" /> Exporter</button>
        </div>
        <div className="divide-y divide-gray-50">
          {deductions.map((d) => (
            <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0"><TrendingDown className="w-5 h-5 text-red-500" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-gray-900">{d.description}</span><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getTypeColor(d.type)}`}>{getTypeLabel(d.type)}</span></div>
                <div className="text-xs text-gray-500">{d.date} • {d.reason}</div>
              </div>
              <div className="text-right"><div className="font-bold font-display text-red-500">-{d.amount.toLocaleString('fr-FR')} FCFA</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
