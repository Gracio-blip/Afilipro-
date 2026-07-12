'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Check, ClipboardList, DollarSign, ExternalLink, Loader2,
  LogOut, Megaphone, Plus, Trash2, Users, X, AlertTriangle, TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/Toast';

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface Transaction { id: number; userId: number; type: string; status: string; amount: number; paymentMethod: string | null; phoneNumber: string | null; reference: string; note: string | null; adminNote?: string; createdAt: string; }
interface AdminUser { id: number; name: string; email: string; phone: string | null; status: string; isVip: boolean; totalReferrals: number; referralCode: string | null; createdAt: string; balance: number; }
interface AdminTask { id: number; title: string; type: string; rewardAmount: number; isActive: boolean; totalCompletions: number; targetUrl: string | null; }
interface Announcement { id: number; title: string; message: string; type: string; isActive: boolean; createdAt: string; }

type Tab = 'overview' | 'transactions' | 'users' | 'tasks' | 'announcements';

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' FCFA';

export default function AdminDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'quiz', rewardAmount: 100, targetUrl: '', instructions: '' });
  const [newAnn, setNewAnn] = useState({ title: '', message: '', type: 'info' });
  const [adminNote, setAdminNote] = useState('');
  const [actionTxId, setActionTxId] = useState<number | null>(null);

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('afilipro_admin_token') : '';
  const headers = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

  const api = useCallback(async (url: string, method = 'GET', body?: unknown) => {
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (res.status === 401 || res.status === 403) { router.push('/admin/login'); throw new Error('Non autorisé'); }
    return res.json();
  }, [adminToken]);

  const fetchAll = useCallback(async () => {
    try {
      const [td, ud, tk, an] = await Promise.all([
        api('/api/admin/dashboard'),
        api('/api/admin/users'),
        api('/api/admin/tasks'),
        api('/api/admin/announcements'),
      ]);
      setTransactions(td.transactions || []);
      setUsers(ud.users || []);
      setTasks(tk.tasks || []);
      setAnnouncements(an.announcements || []);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, [api]);

  useEffect(() => {
    if (!adminToken) { router.push('/admin/login'); return; }
    fetchAll();
  }, []);

  const handleTxAction = async (txId: number, action: 'approve' | 'reject') => {
    try {
      const data = await api(`/api/admin/transactions/${txId}`, 'PATCH', { action, adminNote });
      showToast(data.message || 'Traité.', 'success');
      setActionTxId(null);
      setAdminNote('');
      fetchAll();
    } catch { showToast('Erreur.', 'error'); }
  };

  const handleUserAction = async (userId: number, action: string) => {
    if (!confirm(`Confirmer : ${action} l'utilisateur ?`)) return;
    try { await api('/api/admin/users', 'PATCH', { userId, action }); showToast('Fait.', 'success'); fetchAll(); }
    catch { showToast('Erreur.', 'error'); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api('/api/admin/tasks', 'POST', newTask); showToast('Tâche créée.', 'success'); setNewTask({ title: '', description: '', type: 'quiz', rewardAmount: 100, targetUrl: '', instructions: '' }); fetchAll(); }
    catch { showToast('Erreur.', 'error'); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Désactiver cette tâche ?')) return;
    try { await api('/api/admin/tasks', 'DELETE', { taskId }); showToast('Tâche désactivée.', 'success'); fetchAll(); }
    catch { showToast('Erreur.', 'error'); }
  };

  const handleCreateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api('/api/admin/announcements', 'POST', newAnn); showToast('Annonce créée.', 'success'); setNewAnn({ title: '', message: '', type: 'info' }); fetchAll(); }
    catch { showToast('Erreur.', 'error'); }
  };

  const handleDistribute = async () => {
    try { const d = await api('/api/admin/distribute-vip', 'POST'); showToast(d.message || 'Distribution terminée.', 'success'); }
    catch { showToast('Erreur.', 'error'); }
  };

  const pending = transactions.filter(t => t.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalBalance = users.reduce((s, u) => s + (u.balance ?? 0), 0);
  const totalDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const filteredUsers = users.filter(u => !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));

  const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview',     label: 'Vue d\'ensemble', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'transactions', label: 'Transactions',    icon: <DollarSign className="h-4 w-4" />, badge: pending.length },
    { key: 'users',        label: 'Utilisateurs',    icon: <Users className="h-4 w-4" /> },
    { key: 'tasks',        label: 'Tâches',          icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'announcements',label: 'Annonces',        icon: <Megaphone className="h-4 w-4" /> },
  ];

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-accent" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-slate-950 font-black">A</div>
            <div>
              <div className="text-lg font-bold text-slate-900">Afili<span className="text-accent">Pro</span> Admin</div>
              <div className="text-xs text-slate-400">Panneau d'administration</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pending.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{pending.length}</span>
            )}
            <button
              onClick={() => { localStorage.removeItem('afilipro_admin_token'); router.push('/admin/login'); }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Tabs */}
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm border border-slate-100">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === t.key ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              {t.icon} {t.label}
              {t.badge ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{t.badge}</span> : null}
            </button>
          ))}
        </nav>

        {/* ── Vue d'ensemble ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Utilisateurs', value: users.length, sub: `${activeUsers} actifs` },
                { label: 'FCFA en circulation', value: fmt(totalBalance), sub: 'total wallets' },
                { label: 'Dépôts validés', value: fmt(totalDeposits), sub: 'historique' },
                { label: 'Transactions pending', value: pending.length, sub: 'à traiter' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className="mt-2 text-xl font-black text-slate-900">{s.value}</div>
                  <div className="text-[10px] text-slate-400">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleDistribute} className="btn-primary flex items-center gap-2 px-5 py-3 font-bold">
                <TrendingUp className="h-4 w-4" /> Distribuer gains VIP
              </button>
              <button onClick={() => setTab('transactions')} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-100">
                <AlertTriangle className="h-4 w-4" /> {pending.length} transaction{pending.length > 1 ? 's' : ''} en attente
              </button>
            </div>
          </div>
        )}

        {/* ── Transactions ── */}
        {tab === 'transactions' && (
          <div className="space-y-4">
            {pending.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <h3 className="font-bold text-red-900 mb-3">🔴 En attente de traitement ({pending.length})</h3>
                <div className="space-y-3">
                  {pending.map(tx => {
                    const u = users.find(u => u.id === tx.userId);
                    return (
                      <div key={tx.id} className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{tx.type === 'deposit' ? 'DÉPÔT' : 'RETRAIT'}</span>
                              <span className="text-sm font-bold text-slate-900">{u?.name ?? `#${tx.userId}`}</span>
                              <span className="text-xs text-slate-500">{u?.email}</span>
                            </div>
                            <div className="text-lg font-black text-accent">{fmt(tx.amount)}</div>
                            {tx.paymentMethod && <div className="text-xs text-slate-500">{tx.paymentMethod.toUpperCase()} · {tx.phoneNumber}</div>}
                            <div className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleString('fr-FR')}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {actionTxId === tx.id && (
                              <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Note (optionnel)" className="rounded-lg border border-slate-200 px-3 py-2 text-xs w-48 resize-none" rows={2} />
                            )}
                            <div className="flex gap-2">
                              <button onClick={() => { setActionTxId(tx.id); handleTxAction(tx.id, 'approve'); }} className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-600">
                                <Check className="h-3 w-3" /> Approuver
                              </button>
                              <button onClick={() => { setActionTxId(tx.id); handleTxAction(tx.id, 'reject'); }} className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600">
                                <X className="h-3 w-3" /> Refuser
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">Historique ({transactions.length})</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                      {['Date', 'Utilisateur', 'Type', 'Montant', 'Méthode', 'Statut'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.slice(0, 50).map(tx => {
                      const u = users.find(u => u.id === tx.userId);
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{u?.name ?? `#${tx.userId}`}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : tx.type === 'withdrawal' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type.toUpperCase()}</span></td>
                          <td className="px-4 py-3 font-bold text-accent">{fmt(tx.amount)}</td>
                          <td className="px-4 py-3 text-slate-500">{tx.paymentMethod ?? '—'}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tx.status === 'completed' || tx.status === 'paid' ? 'bg-green-100 text-green-700' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{tx.status.toUpperCase()}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Utilisateurs ── */}
        {tab === 'users' && (
          <div className="space-y-4">
            <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Rechercher par nom ou email…" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-900">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                      {['Nom', 'Email', 'Téléphone', 'Solde', 'Filleuls', 'Code', 'Statut', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{u.phone ?? '—'}</td>
                        <td className="px-4 py-3 font-bold text-accent text-xs">{fmt(u.balance ?? 0)}</td>
                        <td className="px-4 py-3 text-center">{u.totalReferrals}</td>
                        <td className="px-4 py-3"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700">{u.referralCode ?? '—'}</span></td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {u.status !== 'active' && <button onClick={() => handleUserAction(u.id, 'activate')} className="rounded px-2 py-1 text-[10px] font-bold bg-green-500 text-white hover:bg-green-600">Activer</button>}
                            {u.status === 'active' && <button onClick={() => handleUserAction(u.id, 'suspend')} className="rounded px-2 py-1 text-[10px] font-bold bg-red-500 text-white hover:bg-red-600">Suspendre</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tâches ── */}
        {tab === 'tasks' && (
          <div className="space-y-5">
            <form onSubmit={handleCreateTask} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-accent" /> Créer une nouvelle tâche</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Titre *" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" required />
                <select value={newTask.type} onChange={e => setNewTask(p => ({ ...p, type: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent">
                  {['quiz', 'telegram', 'tiktok_follow', 'youtube_subscribe', 'instagram_follow', 'survey', 'external_link', 'custom'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input placeholder="Description" value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" />
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Récompense FCFA *" value={newTask.rewardAmount} onChange={e => setNewTask(p => ({ ...p, rewardAmount: Number(e.target.value) }))} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" min={1} required />
                  <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
                <input placeholder="URL cible (optionnel)" value={newTask.targetUrl} onChange={e => setNewTask(p => ({ ...p, targetUrl: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" />
                <input placeholder="Instructions (optionnel)" value={newTask.instructions} onChange={e => setNewTask(p => ({ ...p, instructions: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" />
              </div>
              <button type="submit" className="mt-4 btn-primary flex items-center gap-2 px-5 py-3 font-bold">
                <Plus className="h-4 w-4" /> Créer la tâche
              </button>
            </form>

            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-3 font-bold text-slate-900">Tâches ({tasks.length})</div>
              <div className="divide-y divide-slate-50">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{t.type}</span>
                        <span className="text-xs font-bold text-accent">{t.rewardAmount} FCFA</span>
                        <span className="text-xs text-slate-400">{t.totalCompletions} complétions</span>
                        {t.targetUrl && <ExternalLink className="h-3 w-3 text-slate-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                      <button onClick={() => handleDeleteTask(t.id)} className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Annonces ── */}
        {tab === 'announcements' && (
          <div className="space-y-5">
            <form onSubmit={handleCreateAnn} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-accent" /> Nouvelle annonce</h3>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="Titre *" value={newAnn.title} onChange={e => setNewAnn(p => ({ ...p, title: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent" required />
                  <select value={newAnn.type} onChange={e => setNewAnn(p => ({ ...p, type: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent">
                    {['info', 'success', 'warning', 'promotion'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <textarea placeholder="Message *" value={newAnn.message} onChange={e => setNewAnn(p => ({ ...p, message: e.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent resize-none" required />
              </div>
              <button type="submit" className="mt-4 btn-primary flex items-center gap-2 px-5 py-3 font-bold">
                <Megaphone className="h-4 w-4" /> Envoyer à tous les membres
              </button>
            </form>

            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className={`rounded-2xl p-5 border ${a.type === 'warning' ? 'bg-amber-50 border-amber-200' : a.type === 'success' ? 'bg-emerald-50 border-emerald-200' : a.type === 'promotion' ? 'bg-violet-50 border-violet-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{a.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                      <p className="mt-2 text-xs text-slate-400">{new Date(a.createdAt).toLocaleString('fr-FR')}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{a.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
