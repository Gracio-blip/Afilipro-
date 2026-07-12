'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle, Send, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Compte & Activation',
    items: [
      { q: 'Comment activer mon compte ?', a: 'Effectuez un premier dépôt de 2 500 FCFA minimum via Mixx by Yas ou Moov Money. Après validation par l\'administrateur, votre compte est automatiquement activé.' },
      { q: 'Combien de temps prend la validation du dépôt ?', a: 'La validation est effectuée par un administrateur, généralement en moins de 24 heures.' },
      { q: 'Comment réinitialiser mon mot de passe ?', a: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?" et entrez votre e-mail. Vous recevrez un code de réinitialisation.' },
    ],
  },
  {
    category: 'Dépôts & Retraits',
    items: [
      { q: 'Quel est le montant minimum de dépôt ?', a: 'Le dépôt minimum est de 2 500 FCFA. Méthodes acceptées : Mixx by Yas, Moov Money.' },
      { q: 'Comment fonctionnent les retraits ?', a: 'Les retraits fonctionnent par paliers (1er: 1 500, 2ème: 3 500, 3ème: 5 500, etc.). Le capital d\'investissement initial ne peut pas être retiré, seuls vos gains sont retirables. 2 retraits maximum par jour.' },
      { q: 'Combien de temps prend un retrait ?', a: 'Après validation par l\'administrateur (généralement sous 24h), le paiement est effectué sur votre compte Mobile Money.' },
    ],
  },
  {
    category: 'Parrainage',
    items: [
      { q: 'Comment fonctionne le parrainage ?', a: 'Partagez votre code ou lien de parrainage. Pour chaque ami qui s\'inscrit et active son compte avec son premier dépôt, vous recevez une commission automatiquement.' },
      { q: 'Où trouver mon code de parrainage ?', a: 'Dans la section Parrainage de votre tableau de bord, ou dans votre profil. Votre code est unique et personnel.' },
    ],
  },
  {
    category: 'Micro-tâches',
    items: [
      { q: 'Quelles tâches sont disponibles ?', a: 'Quiz (100 FCFA/réponse), rejoindre un canal Telegram (150 FCFA), suivre sur TikTok (150 FCFA), et bien d\'autres ajoutées régulièrement.' },
      { q: 'Peut-on faire une tâche plusieurs fois ?', a: 'Non, chaque tâche ne peut être complétée qu\'une seule fois par utilisateur. Les gains sont crédités immédiatement.' },
    ],
  },
  {
    category: 'Investissements VIP',
    items: [
      { q: 'Comment fonctionnent les niveaux VIP ?', a: 'Chaque niveau VIP génère un revenu quotidien pendant 75 jours. VIP 1 : 2 500 FCFA → 613 FCFA/jour. Plus le niveau est élevé, plus les gains sont importants.' },
      { q: 'Comment collecter mes revenus VIP ?', a: 'Sur votre tableau de bord, cliquez sur "Collecter mes gains quotidiens". Les revenus sont crédités directement sur votre solde.' },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(o => o === key ? null : key);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pt-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10">
          <HelpCircle className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Centre d'aide & FAQ</h1>
        <p className="mt-2 text-slate-500">Trouvez rapidement les réponses à vos questions.</p>
      </div>

      {/* FAQ */}
      {faqs.map((cat) => (
        <div key={cat.category} className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">{cat.category}</h2>
          {cat.items.map((item, i) => {
            const key = `${cat.category}-${i}`;
            const isOpen = open === key;
            return (
              <div key={i} className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white'}`}>
                <button onClick={() => toggle(key)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-semibold text-slate-900">{item.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</div>}
              </div>
            );
          })}
        </div>
      ))}

      {/* Contact */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-primary p-8 text-white">
        <h2 className="text-xl font-bold font-display mb-2">Vous n'avez pas trouvé votre réponse ?</h2>
        <p className="text-sm text-slate-300 mb-6">Notre équipe est disponible pour vous aider.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-[#25D366]/20 p-4 hover:bg-[#25D366]/30 transition">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
            <div>
              <p className="font-bold text-sm">Groupe WhatsApp</p>
              <p className="text-xs text-slate-300">Rejoignez la communauté</p>
            </div>
          </a>
          <a href="https://t.me/afilipro" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-[#0088cc]/20 p-4 hover:bg-[#0088cc]/30 transition">
            <Send className="h-6 w-6 text-[#0088cc]" />
            <div>
              <p className="font-bold text-sm">Telegram</p>
              <p className="text-xs text-slate-300">Canal officiel</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
