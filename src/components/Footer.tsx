import Link from 'next/link';
import { TrendingUp, Mail, Share2, MessageCircle, Bell } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display">
                Afili<span className="text-accent">Pro</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              La plateforme d'affiliation qui vous permet de générer des revenus passifs en promouvant des produits de qualité auprès de votre audience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Plateforme</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/auth" className="text-gray-300 hover:text-white transition-colors">S'inscrire</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Programme Partner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Ressources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Guide d'affiliation</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 AfiliPro. Tous droits réservés. Plateforme d'affiliation certifiée.</p>
        </div>
      </div>
    </footer>
  );
}
