'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import { 
  Mail, MessageCircle, Phone, MapPin, Send,
  Headphones, Clock, Check, User, ChevronDown
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: 'Marie Dupont',
    email: 'marie.dupont@email.fr',
    subject: '',
    category: 'general',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const categories = [
    { value: 'general', label: 'Question générale' },
    { value: 'payment', label: 'Paiement / Retrait' },
    { value: 'technical', label: 'Problème technique' },
    { value: 'affiliate', label: 'Affiliation' },
    { value: 'account', label: 'Compte' },
    { value: 'other', label: 'Autre' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      showToast('Veuillez écrire un message', 'error');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast('Message envoyé ! Nous vous répondrons sous 24h', 'success');
      setFormData({ ...formData, subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactMethods = [
    { icon: Mail, label: 'Email', value: 'support@afilipro.com', desc: 'Réponse sous 24h' },
    { icon: MessageCircle, label: 'Chat en direct', value: 'Disponible 24/7', desc: 'Temps réel' },
    { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89', desc: 'Lun-Ven 9h-18h' },
    { icon: MapPin, label: 'Adresse', value: 'Paris, France', desc: 'Siège social' },
  ];

  const faqs = [
    { q: 'Comment retirer mes gains ?', a: 'Rendez-vous dans Withdrawals Centre, choisissez le montant et la méthode. Le minimum est de 50€.' },
    { q: 'Combien de temps prend un retrait ?', a: 'Les retraits sont traités sous 15 jours ouvrés selon la méthode choisie.' },
    { q: 'Comment fonctionne le parrainage ?', a: 'Partagez votre lien de parrainage. Vous gagnez 10% des commissions de vos filleuls.' },
    { q: 'Puis-je avoir plusieurs comptes ?', a: 'Non, un seul compte par personne est autorisé pour garantir l\'équité.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-display">Contact Us</h1>
          </div>
          <p className="text-white/80">Notre équipe est là pour vous aider</p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <method.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{method.label}</h3>
            <p className="text-sm text-gray-700 font-medium mb-1">{method.value}</p>
            <p className="text-xs text-gray-500">{method.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
            Envoyez-nous un message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none appearance-none"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet de votre message"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande..."
                rows={5}
                required
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sending ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" /> Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Support Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Horaires de support
            </h3>
            <div className="space-y-3">
              {[
                { day: 'Lundi - Vendredi', hours: '9h00 - 18h00', active: true },
                { day: 'Samedi', hours: '10h00 - 16h00', active: false },
                { day: 'Dimanche', hours: 'Fermé', active: false },
                { day: 'Chat en direct', hours: '24/7', active: true },
              ].map((schedule, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">{schedule.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{schedule.hours}</span>
                    {schedule.active && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-gradient-to-br from-success/10 to-green-50 rounded-2xl p-6 border border-success/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Temps de réponse moyen</h3>
                <div className="text-3xl font-bold font-display text-success mb-1">2h</div>
                <p className="text-sm text-gray-600">
                  Notre équipe s'engage à vous répondre dans les meilleurs délais. 
                  89% des messages sont traités en moins de 4h.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4">
              Questions fréquentes
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-900">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-3 pb-3 text-sm text-gray-600">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
