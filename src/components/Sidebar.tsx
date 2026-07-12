'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3, Banknote, BookOpen, Brain, Crown, Dices,
  DollarSign, FileText, HelpCircle, Home, Info, LogOut, Menu,
  MessagesSquare, MessageCircle, Music2, Shield, Trophy, User,
  UserCircle, Users, Wallet, WalletCards, X
} from 'lucide-react';
import { formatCFA } from '@/lib/data';
import { useWallet } from '@/components/WalletProvider';
import { clearClientSession, getClientAuthHeaders } from '@/lib/client-auth';

const sections = [
  {
    title: 'Principal',
    items: [
      { href: '/dashboard',          label: 'Tableau de bord',    icon: Home,          accent: 'text-blue-400' },
      { href: '/dashboard/earn',     label: 'Gagner de l\'argent',icon: DollarSign,    accent: 'text-emerald-400' },
      { href: '/dashboard/referral', label: 'Mon Parrainage',     icon: Users,         accent: 'text-violet-400' },
      { href: '/dashboard/vip',      label: 'Investissements VIP',icon: Crown,         accent: 'text-amber-400', badge: 'HOT' },
    ],
  },
  {
    title: 'Portefeuille',
    items: [
      { href: '/dashboard/wallet',       label: 'Mon Portefeuille',  icon: Wallet,     accent: 'text-cyan-400' },
      { href: '/dashboard/deposit',      label: 'Effectuer un dépôt',icon: WalletCards, accent: 'text-green-400' },
      { href: '/dashboard/withdrawals',  label: 'Retrait des gains', icon: Banknote,   accent: 'text-rose-400' },
      { href: '/dashboard/transactions', label: 'Historique',        icon: BarChart3,  accent: 'text-sky-400' },
    ],
  },
  {
    title: 'Activités',
    items: [
      { href: '/dashboard/lucky-spin',  label: 'Lucky Spin',         icon: Dices,      accent: 'text-yellow-400' },
      { href: '/dashboard/quiz',        label: 'Quiz Challenge',      icon: Brain,      accent: 'text-violet-400' },
      { href: '/dashboard/tiktok',      label: 'TikTok Earn',         icon: Music2,     accent: 'text-pink-400' },
      { href: '/dashboard/leaderboard', label: 'Classement',          icon: Trophy,     accent: 'text-amber-400' },
      { href: '/dashboard/community',   label: 'Communauté',          icon: MessagesSquare, accent: 'text-orange-400' },
    ],
  },
  {
    title: 'Mon compte',
    items: [
      { href: '/dashboard/profile', label: 'Mon Profil',              icon: User,       accent: 'text-indigo-400' },
      { href: '/dashboard/help',    label: 'Centre d\'aide & FAQ',    icon: HelpCircle, accent: 'text-teal-400' },
      { href: '/dashboard/about',   label: 'À propos',                icon: Info,       accent: 'text-slate-400' },
      { href: '/dashboard/terms',   label: 'Conditions d\'utilisation',icon: FileText,  accent: 'text-slate-400' },
      { href: 'https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1', label: 'Groupe WhatsApp', icon: MessageCircle, accent: 'text-green-400', external: true },
    ],
  },
];

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'AP';
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    const headers = getClientAuthHeaders();
    await fetch('/api/auth/logout', { method: 'POST', headers }).catch(() => {});
    clearClientSession();
    router.replace('/auth');
  };

  return (
    <>
      {/* Bouton burger - haut gauche */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="fixed left-4 top-3.5 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg border border-white/10 transition hover:bg-slate-800"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <button
          aria-label="Fermer"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`custom-scroll fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-slate-950 border-r border-white/10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex min-h-full flex-col pt-16">
          {/* Profil */}
          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-950">
                {initials(user?.name ?? 'AfiliPro')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{user?.name ?? '…'}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-accent">{formatCFA(user?.balance ?? 0)}</span>
                  {user?.status === 'active' && <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">Actif</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            {sections.map(section => (
              <div key={section.title} className="mb-6">
                <span className="block px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {section.title}
                </span>
                <div className="space-y-0.5">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        target={(item as any).external ? '_blank' : undefined}
                        rel={(item as any).external ? 'noopener noreferrer' : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${active ? 'bg-accent/15 font-bold text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${active ? 'text-accent' : item.accent}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                        <span className="text-sm">{item.label}</span>
                        {(item as any).badge && <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-slate-950">{(item as any).badge}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Déconnexion */}
          <div className="border-t border-white/10 px-4 py-4">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10">
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
