export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-14 pb-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Conditions d'utilisation</h1>
        <p className="text-xs text-slate-400 mb-8">Dernière mise à jour : Juillet 2026</p>

        {[
          { title: '1. Acceptation des conditions', content: 'En créant un compte sur AfiliPro, vous acceptez les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, vous ne pouvez pas utiliser la plateforme.' },
          { title: '2. Éligibilité', content: 'Vous devez avoir au moins 18 ans pour utiliser AfiliPro. Un seul compte par personne est autorisé. La création de comptes multiples entraîne la suspension immédiate.' },
          { title: '3. Activation du compte', content: 'L\'activation du compte nécessite un dépôt unique de 2 000 FCFA minimum. Ce dépôt doit être validé par l\'administrateur avant que votre compte soit activé.' },
          { title: '4. Gains et récompenses', content: 'Les gains sont crédités après validation des tâches ou dépôts. AfiliPro se réserve le droit de modifier les montants des récompenses à tout moment.' },
          { title: '5. Retraits', content: 'Les retraits suivent un système de paliers progressifs (ex: 1500 FCFA, 3500 FCFA...). Le capital de dépôt initial ne peut pas être retiré, seuls les gains générés (missions, VIP, parrainage) sont retirables. Les retraits sont traités sous 24 heures ouvrées.' },
          { title: '6. Comportement interdit', content: 'Il est interdit de créer plusieurs comptes, d\'utiliser des robots ou scripts automatisés, de tenter de frauder le système, ou d\'usurper l\'identité d\'autrui. Toute infraction entraîne la suspension du compte et la perte des gains.' },
          { title: '7. Confidentialité', content: 'Vos données personnelles sont protégées et ne sont pas partagées avec des tiers sans votre consentement. Consultez notre politique de confidentialité pour plus de détails.' },
          { title: '8. Modification des conditions', content: 'AfiliPro peut modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur la plateforme. Votre utilisation continue constitue une acceptation des nouvelles conditions.' },
          { title: '9. Contact', content: 'Pour toute question concernant ces conditions, contactez-nous via WhatsApp ou Telegram.' },
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
