import Link from 'next/link';
import { Award, Globe, Heart, Phone, Send, Shield, TrendingUp, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pt-14 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-primary p-10 text-white text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/20">
          <TrendingUp className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold font-display">À propos d'AfiliPro</h1>
        <p className="mt-4 max-w-xl mx-auto text-slate-300 leading-relaxed">
          AfiliPro est une plateforme d'affiliation et de micro-tâches rémunérées, pensée pour permettre à tous de générer des revenus supplémentaires en Afrique de l'Ouest.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { icon: Globe, title: 'Notre mission', desc: 'Rendre le revenu digital accessible à tous, partout en Afrique de l\'Ouest.' },
          { icon: Shield, title: 'Sécurité', desc: 'Plateforme sécurisée avec chiffrement des mots de passe et protection contre les fraudes.' },
          { icon: Users, title: 'Communauté', desc: 'Plus de milliers de membres actifs qui génèrent des revenus passifs chaque jour.' },
          { icon: Award, title: 'Récompenses', desc: 'Systèmes de bonus quotidien, classements et niveaux VIP pour récompenser la fidélité.' },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-accent/10 border border-accent/20 p-8 text-center">
        <Heart className="mx-auto h-10 w-10 text-accent mb-3" />
        <h2 className="text-xl font-bold font-display text-slate-900">Rejoignez la communauté</h2>
        <p className="mt-2 text-sm text-slate-500 mb-5">Contactez-nous via WhatsApp ou Telegram pour toute question.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white">
            <Phone className="h-4 w-4" /> Rejoindre le groupe WhatsApp
          </a>
          <a href="https://t.me/afilipro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] px-5 py-3 font-bold text-white">
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-slate-400 justify-center">
        <Link href="/dashboard/terms" className="hover:text-accent">Conditions d'utilisation</Link>
        <span>·</span>
        <Link href="/dashboard/privacy" className="hover:text-accent">Politique de confidentialité</Link>
        <span>·</span>
        <Link href="/dashboard/help" className="hover:text-accent">FAQ</Link>
      </div>
    </div>
  );
}
