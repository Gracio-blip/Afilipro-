export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-14 pb-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Politique de confidentialité</h1>
        <p className="text-xs text-slate-400 mb-8">Dernière mise à jour : Juillet 2026</p>

        {[
          { title: '1. Données collectées', content: 'Nous collectons : nom, adresse e-mail, numéro de téléphone, données de transaction (dépôts, retraits), adresses IP pour la sécurité, et historique d\'activité sur la plateforme.' },
          { title: '2. Utilisation des données', content: 'Vos données sont utilisées pour : gérer votre compte, traiter les transactions, prévenir la fraude, améliorer la plateforme et vous envoyer des notifications importantes.' },
          { title: '3. Protection des données', content: 'Vos mots de passe sont chiffrés (hachage scrypt). Vos données financières sont protégées. Nous n\'vendons jamais vos données à des tiers.' },
          { title: '4. Partage des données', content: 'Vos données ne sont partagées qu\'avec les prestataires de paiement (Mixx by Yas, Moov Money, etc.) pour traiter vos transactions, et uniquement ce qui est nécessaire.' },
          { title: '5. Conservation des données', content: 'Vos données sont conservées tant que votre compte est actif. En cas de suppression, les données sont conservées 30 jours avant suppression définitive.' },
          { title: '6. Vos droits', content: 'Vous avez le droit d\'accéder à vos données, de les corriger, ou de demander leur suppression. Contactez-nous via WhatsApp ou Telegram.' },
          { title: '7. Cookies', content: 'Nous utilisons des sessions sécurisées pour maintenir votre connexion. Aucun cookie de tracking publicitaire n\'est utilisé.' },
        ].map((section, i) => (
          <div key={i} className="mb-6">
            <h2 className="font-bold text-slate-900 mb-2">{section.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
