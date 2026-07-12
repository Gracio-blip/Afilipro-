'use client';

import { useState } from 'react';
import { 
  ReceiptText, Filter, Download, Search, 
  ArrowDownLeft, ArrowUpRight, Clock, Check, X
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Transaction {
  id: number;
  type: 'commission' | 'withdrawal' | 'bonus' | 'refund';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const transactions: Transaction[] = [
  { id: 1, type: 'commission', description: 'Commission - Formation Marketing Digital', amount: 77600, date: '12 Fév 2025, 14:32', status: 'pending', method: 'Affiliation' },
  { id: 2, type: 'commission', description: 'Commission - Smartwatch Fitness', amount: 30000, date: '10 Fév 2025, 09:15', status: 'completed', method: 'Affiliation' },
  { id: 3, type: 'withdrawal', description: 'Retrait vers compte bancaire', amount: -327500, date: '08 Fév 2025, 16:45', status: 'completed', method: 'Virement' },
  { id: 4, type: 'commission', description: 'Commission - Programme Minceur', amount: 48500, date: '05 Fév 2025, 11:20', status: 'completed', method: 'Affiliation' },
  { id: 5, type: 'bonus', description: 'Bonus de série - 5 tâches complétées', amount: 3000, date: '03 Fév 2025, 18:00', status: 'completed', method: 'Bonus' },
  { id: 6, type: 'commission', description: 'Commission - Abonnement Software Pro', amount: 9600, date: '01 Fév 2025, 10:30', status: 'pending', method: 'Affiliation' },
  { id: 7, type: 'withdrawal', description: 'Retrait Mobile Money', amount: -131000, date: '28 Jan 2025, 14:20', status: 'failed', method: 'Mobile Money' },
  { id: 8, type: 'commission', description: 'Commission - Kit Cuisine Pro', amount: 23000, date: '28 Jan 2025, 09:45', status: 'completed', method: 'Affiliation' },
  { id: 9, type: 'refund', description: 'Remboursement - Produit défectueux', amount: -17000, date: '25 Jan 2025, 16:10', status: 'completed', method: 'Remboursement' },
  { id: 10, type: 'bonus', description: 'Bonus de parrainage - Moussa T.', amount: 7000, date: '20 Jan 2025, 12:00', status: 'completed', method: 'Parrainage' },
];

export default function TransactionsPage() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'commission' | 'withdrawal' | 'bonus' | 'refund'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIn = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission': return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'bonus': return <ArrowDownLeft className="w-5 h-5 text-accent" />;
      case 'refund': return <ArrowUpRight className="w-5 h-5 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><ReceiptText className="w-6 h-6" /></div><h1 className="text-3xl font-bold font-display">Payment Transaction</h1></div>
          <p className="text-white/80">Historique complet de vos transactions en FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><ArrowDownLeft className="w-5 h-5 text-green-600" /></div><span className="text-sm text-gray-500">Total entrées</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">+{totalIn.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-red-500" /></div><span className="text-sm text-gray-500">Total sorties</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">-{totalOut.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><ReceiptText className="w-5 h-5 text-accent" /></div><span className="text-sm text-gray-500">Solde net</span></div>
          <div className="text-2xl font-bold font-display text-gray-900">{(totalIn - totalOut).toLocaleString('fr-FR')} FCFA</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none text-sm" /></div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {[{ v: 'all', l: 'Toutes' }, { v: 'commission', l: 'Commissions' }, { v: 'withdrawal', l: 'Retraits' }, { v: 'bonus', l: 'Bonus' }, { v: 'refund', l: 'Remboursements' }].map((f) => (
              <button key={f.v} onClick={() => setFilter(f.v as typeof filter)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === f.v ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.l}</button>
            ))}
          </div>
          <button onClick={() => showToast('Export CSV téléchargé', 'success')} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"><Download className="w-4 h-4" /> Exporter</button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>{getTypeIcon(t.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{t.description}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><span>{t.date}</span><span>•</span><span>{t.method}</span></div>
              </div>
              <div className="text-right">
                <div className={`font-bold font-display ${t.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>{t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('fr-FR')} FCFA</div>
                <div className="mt-1"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${t.status === 'completed' ? 'bg-green-100 text-green-700' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{t.status === 'completed' ? 'Complété' : t.status === 'pending' ? 'En attente' : 'Échec'}</span></div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Aucune transaction trouvée</div>}
      </div>
    </div>
  );
}
