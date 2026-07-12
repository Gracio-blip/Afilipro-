'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight, Check, Eye, EyeOff, Lock, Mail,
  Phone, ShieldCheck, TrendingUp, User, Users, X
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const benefits = [
  { icon: ShieldCheck, text: 'Compte sécurisé & vérifié' },
  { icon: Users, text: 'Gagnez en parrainant vos proches' },
  { icon: TrendingUp, text: 'Investissements VIP jusqu\'à 75 jours' },
];

function AuthForm() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: searchParams.get('ref') ?? '',
  });

  useEffect(() => {
    const token = localStorage.getItem('afilipro_token');
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => { if (r.ok) window.location.replace('/dashboard'); })
        .catch(() => {});
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error'); return;
    }
    if (formData.password.length < 8) {
      showToast('Mot de passe : 8 caractères minimum.', 'error'); return;
    }
    setLoading(true);
    try {
      const body = mode === 'register'
        ? { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, referralCode: formData.referralCode || undefined }
        : { email: formData.email, password: formData.password };

      const res = await fetch(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      localStorage.setItem('afilipro_token', data.token);
      localStorage.setItem('afilipro_user', JSON.stringify(data.user));
      showToast(mode === 'register' ? 'Compte créé ! Effectuez votre premier dépôt.' : 'Connexion réussie.', 'success');
      setTimeout(() => { window.location.href = '/dashboard'; }, 600);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      showToast('Code envoyé à votre adresse e-mail.', 'success');
      setShowForgot(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const input = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10';

  return (
    <>
      {/* Modal Mot de passe oublié */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Mot de passe oublié</h3>
              <button onClick={() => setShowForgot(false)} className="rounded-full p-1.5 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={input} placeholder="vous@email.com" required />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForgot(false)} className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600">Annuler</button>
                <button type="submit" disabled={forgotLoading} className="flex-1 rounded-xl bg-accent py-3 font-bold text-white hover:bg-amber-500 disabled:opacity-60">
                  {forgotLoading ? 'Envoi…' : 'Envoyer le code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        {/* Panneau gauche */}
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-slate-950">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold font-display">Afili<span className="text-accent">Pro</span></div>
            </div>
            <h1 className="mt-16 max-w-sm text-4xl font-bold leading-tight font-display">
              Gagnez de l'argent,<br />parrainez vos proches.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Plateforme d'affiliation et de micro-tâches rémunérées, pensée pour l'Afrique de l'Ouest.
            </p>
          </div>
          <div className="relative space-y-3">
            {benefits.map(b => (
              <div key={b.text} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
                <b.icon className="h-5 w-5 text-accent" /> {b.text}
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire */}
        <section className="p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-slate-950">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold font-display text-primary">Afili<span className="text-accent">Pro</span></div>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`rounded-lg py-3 text-sm font-bold transition ${mode === m ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-950">
            {mode === 'login' ? 'Bon retour !' : 'Créer mon compte'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'login' ? 'Connectez-vous pour accéder à votre espace.' : 'Inscrivez-vous — activation par premier dépôt.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Nom complet *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className={input} name="name" value={formData.name} onChange={handleChange} placeholder="Ex. Ama Mensah" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className={input} name="phone" value={formData.phone} onChange={handleChange} placeholder="+228 90 00 00 00" type="tel" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Adresse e-mail *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className={input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vous@email.com" required />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className={`${input} pr-11`} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="8 caractères minimum" minLength={8} required />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className={input} type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Répétez le mot de passe" minLength={8} required />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Code de parrainage <span className="font-normal text-slate-400">(facultatif)</span></label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className={input} name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="Ex. JEAN2F91E" />
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-primary hover:text-accent">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-amber-500 disabled:opacity-60">
              {loading
                ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'} <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          {mode === 'register' && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold"><Check className="h-4 w-4" /> Activation par premier dépôt</div>
              <p className="mt-1 pl-6 text-amber-700">
                Après inscription, déposez <strong>2 500 FCFA</strong> minimum (Mixx by Yas, Moov Money) pour activer votre compte et accéder à toutes les fonctionnalités.
              </p>
            </div>
          )}

          <div className="mt-5 text-center">
            <a href="/admin" className="text-xs text-slate-400 hover:text-accent">Espace administrateur</a>
          </div>
        </section>
      </div>
    </>
  );
}

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f9] p-4 sm:p-8">
      <Suspense fallback={<div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
