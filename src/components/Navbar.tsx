'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, TrendingUp, LayoutDashboard, ShoppingBag, Home, User } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/products', label: 'Produits', icon: ShoppingBag },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary font-display">
              Afili<span className="text-accent">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth"
              className="px-4 py-2 text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Connexion
            </Link>
            <Link href="/auth?mode=register" className="btn-primary">
              Commencer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t space-y-2">
              <Link
                href="/auth"
                className="block px-4 py-3 text-center text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/auth?mode=register"
                className="block px-4 py-3 text-center btn-primary"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
