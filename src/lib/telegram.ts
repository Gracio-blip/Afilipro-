/**
 * Envoie une notification Telegram quand un utilisateur demande un retrait.
 * 
 * Configuration : 
 *   1. Créer un bot Telegram via @BotFather → récupérer BOT_TOKEN
 *   2. Récupérer ton CHAT_ID (via @userinfobot ou en envoyant un message au bot)
 *   3. Mettre BOT_TOKEN et CHAT_ID dans le fichier .env
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID ?? '';

export async function sendWithdrawalNotification(params: {
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  method: string;
  reference: string;
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    // Mode silencieux si pas configuré — ne bloque jamais la réponse utilisateur
    return false;
  }

  const { userName, userEmail, userPhone, amount, method, reference } = params;

  const message = [
    '🔔 *NOUVEAU RETRAIT* 🔔',
    '',
    `👤 *Utilisateur :* ${userName}`,
    `📧 Email : ${userEmail}`,
    `📱 Téléphone : ${userPhone}`,
    `💰 *Montant :* ${amount.toLocaleString('fr-FR')} FCFA`,
    `💳 Méthode : ${method}`,
    `🆔 Référence : \`${reference}\``,
    '',
    `⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome' })}`,
    '',
    '👉 *Traitez sur :* `/admin`',
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram] Erreur envoi :', data.description);
      return false;
    }

    console.log('[Telegram] Notification envoyée avec succès');
    return true;
  } catch (error) {
    console.error('[Telegram] Erreur réseau :', error);
    return false;
  }
}

/**
 * Envoie une notification de dépôt également (optionnel)
 */
export async function sendDepositNotification(params: {
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  reference: string;
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false;

  const { userName, userEmail, amount, method, reference } = params;

  const message = [
    '💰 *NOUVEAU DÉPÔT* 💰',
    '',
    `👤 *Utilisateur :* ${userName}`,
    `📧 Email : ${userEmail}`,
    `💵 *Montant :* ${amount.toLocaleString('fr-FR')} FCFA`,
    `💳 Méthode : ${method}`,
    `🆔 Référence : \`${reference}\``,
    '',
    `⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome' })}`,
    '',
    '👉 *Validez sur :* `/admin`',
  ].join('\n');

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );
    return true;
  } catch {
    return false;
  }
}
