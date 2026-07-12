'use client';

import { 
  Wallet, CreditCard, ArrowDownToLine, ArrowUpFromLine, 
  Shield, Bell, Info, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function WalletGuidePage() {
  const steps = [
    {
      num: 1,
      title: 'Comprendre votre portefeuille',
      desc: 'Votre portefeuille AfiliPro contient tous vos gains. Vous pouvez voir votre solde disponible, en attente et total retiré.',
      icon: Wallet,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      num: 2,
      title: 'Lier un moyen de paiement',
      desc: 'Ajoutez votre compte bancaire, PayPal ou crypto pour pouvoir retirer vos gains.',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-600',
    },
    {
      num: 3,
      title: 'Atteindre le seuil de retrait',
      desc: 'Le retrait minimum est de 50€. Une fois ce seuil atteint, vous pouvez demander un retrait.',
      icon: ArrowDownToLine,
      color: 'from-green-500 to-emerald-600',
    },
    {
      num: 4,
      title: 'Demander un retrait',
      desc: 'Rendez-vous dans le Withdrawals Centre, choisissez le montant et validez. Délai: 15 jours.',
      icon: ArrowUpFromLine,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const faqs = [
    {
      q: 'Quel est le seuil minimum de retrait ?',
      a: 'Le seuil minimum est de 50€. Vous pouvez demander un retrait dès que votre solde disponible atteint ce montant.'
    },
    {
      q: 'Combien de temps prend un retrait ?',
      a: 'Les retraits sont traités sous 15 jours ouvrés. Vous recevrez une notification par email une fois le paiement effectué.'
    },
    {
      q: 'Y a-t-il des frais de retrait ?',
      a: 'Les frais varient selon la méthode choisie: 0% pour virement bancaire, 2% pour PayPal, et 1% pour crypto.'
    },
    {
      q: 'Comment sont calculées mes commissions ?',
      a: 'Les commissions dépendent du produit promu. Elles peuvent être fixes (ex: 25€) ou en pourcentage (ex: 30% du prix).'
    },
    {
      q: 'Puis-je avoir plusieurs moyens de paiement ?',
      a: 'Oui, vous pouvez lier jusqu\'à 3 moyens de paiement différents et choisir celui à utiliser lors du retrait.'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-display">Wallet Guide</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Guide complet pour comprendre et configurer votre portefeuille AfiliPro.
            Apprenez à gérer vos gains, retirer votre argent et optimiser vos revenus.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-accent">Étape {step.num}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
          Moyens de paiement disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Virement bancaire', fee: '0%', time: '2-3 jours', icon: CreditCard },
            { name: 'PayPal', fee: '2%', time: '24h', icon: Wallet },
            { name: 'Crypto (USDT)', fee: '1%', time: '1-2h', icon: Shield },
          ].map((method, i) => (
            <div key={i} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-accent/30 transition-all">
              <method.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{method.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Frais:</span>
                  <span className="font-semibold text-gray-900">{method.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Délai:</span>
                  <span className="font-semibold text-gray-900">{method.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-accent/10 to-yellow-50 rounded-2xl p-6 border-2 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Conseils pour optimiser vos gains</h3>
            <ul className="space-y-2">
              {[
                'Atteignez le seuil de 50€ avant de demander un retrait',
                'Privilégiez le virement bancaire pour éviter les frais',
                'Activez les notifications pour suivre vos paiements',
                'Parrainez des amis pour augmenter vos commissions',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details 
              key={i}
              className="group border border-gray-100 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Notification setup */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold font-display text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Nouveau paiement reçu', enabled: true },
            { label: 'Retrait disponible', enabled: true },
            { label: 'Commission en attente', enabled: false },
            { label: 'Récapitulatif mensuel', enabled: true },
          ].map((notif, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-700">{notif.label}</span>
              <button className={`relative w-11 h-6 rounded-full transition-colors ${
                notif.enabled ? 'bg-success' : 'bg-gray-300'
              }`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notif.enabled ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
