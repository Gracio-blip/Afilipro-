'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Erreur de connexion', 'error');
        setLoading(false);
        return;
      }

      // Vérifier si c'est un admin
      const adminCheck = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (!adminCheck.ok) {
        showToast('Accès administrateur requis', 'error');
        setLoading(false);
        return;
      }

      // Stocker le token admin
      localStorage.setItem('afilipro_admin_token', data.token);
      localStorage.setItem('afilipro_admin_name', data.user.name);

      showToast('Connexion admin réussie', 'success');
      router.push('/admin/dashboard');
    } catch (error) {
      showToast('Erreur de connexion', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Afili<span className="text-amber-400">Pro</span>
          </h1>
          <p className="text-slate-300">Espace Administrateur</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Connexion Admin</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="admin@afilipro.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
