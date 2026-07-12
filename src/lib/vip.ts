import { randomUUID } from "node:crypto";
import { count, eq, and, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import {
  users,
  wallets,
  vipSubscriptions,
  dailyEarnings,
  walletTransactions,
} from "@/db/schema";

// --- Configuration des packs VIP -------------------------------------------
// Paiement UNIQUE à la fin du cycle
// Revenu quotidien = 600 FCFA/jour pour TOUS les niveaux
// Total = 600 × jours

export interface VipPack {
  level: number;
  name: string;
  cost: number;
  days: number;
  totalReturn: number;
  dailyReturn: number;
  duration: '60j' | '75j';
}

// --- Configuration des packs VIP -------------------------------------------
// Paiement UNIQUE à la fin du cycle
// Niveau 1 = Investissements de 2 500 FCFA, 4 500 FCFA et 7 000 FCFA (75 Jours) -> rapports 600 FCFA par jour (total : 45 000 FCFA)
// Niveau 2 = Investissements à partir de 5 000 FCFA (60 Jours) -> rapports 1 500 FCFA par jour (total : 90 000 FCFA) pour tous les paliers

export interface VipPack {
  level: number;
  name: string;
  cost: number;
  days: number;
  totalReturn: number;
  dailyReturn: number;
  duration: '60j' | '75j';
}

export const VIP_PACKS: VipPack[] = [
  // NIVEAU 1 : PACKS DE 2 500, 4 500 ET 7 000 FCFA (75 Jours)
  { level: 1, name: "Niveau 1 - Pack 2.5K (75J)", cost: 2500, days: 75, totalReturn: 45000, dailyReturn: 600, duration: '75j' },
  { level: 2, name: "Niveau 1 - Pack 4.5K (75J)", cost: 4500, days: 75, totalReturn: 90000, dailyReturn: 1200, duration: '75j' },
  { level: 3, name: "Niveau 1 - Pack 7K (75J)",   cost: 7000, days: 75, totalReturn: 135000, dailyReturn: 1800, duration: '75j' },

  // NIVEAU 2 : PACKS DE 5 000 À 50 000 FCFA (60 Jours) - Rendement doublé à chaque palier
  { level: 4, name: "Niveau 2 - Pack 5K (60J)",   cost: 5000,  days: 60, totalReturn: 90000,  dailyReturn: 1500,  duration: '60j' },
  { level: 5, name: "Niveau 2 - Pack 10K (60J)",  cost: 10000, days: 60, totalReturn: 180000, dailyReturn: 3000,  duration: '60j' },
  { level: 6, name: "Niveau 2 - Pack 20K (60J)",  cost: 20000, days: 60, totalReturn: 360000, dailyReturn: 6000,  duration: '60j' },
  { level: 7, name: "Niveau 2 - Pack 50K (60J)",  cost: 50000, days: 60, totalReturn: 720000, dailyReturn: 12000, duration: '60j' },
];

export function getVipPack(level: number): VipPack | undefined {
  return VIP_PACKS.find((pack) => pack.level === level);
}

// --- Créer une nouvelle souscription VIP -----------------------------------

export interface CreateSubscriptionResult {
  subscriptionId: number;
  balance: number;
  endDate: Date;
}

export async function createVipSubscription(
  userId: number,
  level: number,
): Promise<CreateSubscriptionResult> {
  const pack = getVipPack(level);
  if (!pack) throw new Error("Niveau VIP invalide");

  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() + pack.days);

  return db.transaction(async (tx) => {
    await tx.execute(sql`select id from wallets where user_id = ${userId} for update`);

    const [wallet] = await tx
      .select({ balance: wallets.balance })
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      throw new Error("Aucun portefeuille pour cet utilisateur.");
    }
    if (wallet.balance < pack.cost) {
      throw new Error("Solde insuffisant.");
    }

    const newBalance = wallet.balance - pack.cost;

    await tx
      .update(wallets)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(wallets.userId, userId));

    const reference = `VIP-${level}-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;

    await tx.insert(walletTransactions).values({
      userId,
      type: "vip_purchase",
      status: "completed",
      amount: pack.cost,
      paymentMethod: "VIP Upgrade",
      reference,
      note: `Souscription ${pack.name} (${pack.days} jours)`,
    });

    const [subscription] = await tx
      .insert(vipSubscriptions)
      .values({
        userId,
        level,
        dailyReward: 0, // plus de paiement quotidien — paiement unique à la fin
        totalDays: pack.days,
        cost: pack.cost,
        status: "active",
        endDate,
      })
      .returning({ id: vipSubscriptions.id, endDate: vipSubscriptions.endDate });

    if (!subscription) {
      throw new Error("Échec de la création de la souscription VIP.");
    }

    return {
      subscriptionId: subscription.id,
      balance: newBalance,
      endDate: subscription.endDate,
    };
  });
}

// --- Paiement UNIQUE à la fin du cycle VIP (après 75 jours) -----------------

export interface ClaimEndRewardResult {
  userId: number;
  amount: number;
  subscriptionId: number;
}

/**
 * Vérifie les abonnements VIP expirés et verse le montant total
 * À exécuter quotidiennement par l'admin
 */
export async function distributeExpiredVipRewards(): Promise<ClaimEndRewardResult[]> {
  const now = new Date();
  const results: ClaimEndRewardResult[] = [];

  // Récupérer tous les abonnements expirés encore actifs
  const expiredSubscriptions = await db
    .select()
    .from(vipSubscriptions)
    .where(
      and(
        eq(vipSubscriptions.status, "active"),
        sql`${vipSubscriptions.endDate} <= ${now}`,
      ),
    );

  for (const subscription of expiredSubscriptions) {
    const pack = getVipPack(subscription.level);
    if (!pack) continue;

    try {
      await db.transaction(async (tx) => {
        await tx.execute(sql`select id from wallets where user_id = ${subscription.userId} for update`);

        const reference = `VIPF-${subscription.id}-${randomUUID().slice(0, 12).toUpperCase()}`;

        await tx
          .update(wallets)
          .set({ balance: sql`${wallets.balance} + ${pack.totalReturn}`, updatedAt: now })
          .where(eq(wallets.userId, subscription.userId));

        await tx.insert(walletTransactions).values({
          userId: subscription.userId,
          type: "vip_daily",
          status: "completed",
          amount: pack.totalReturn,
          paymentMethod: "VIP Final",
          reference,
          note: `${pack.name} — Paiement final après ${pack.days} jours`,
        });

        // Marquer comme payé (expiré)
        await tx
          .update(vipSubscriptions)
          .set({ status: "expired", daysPaid: subscription.totalDays, lastPaidDate: now, updatedAt: now })
          .where(eq(vipSubscriptions.id, subscription.id));
      });

      results.push({
        userId: subscription.userId,
        amount: pack.totalReturn,
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error(`Failed to pay expired subscription ${subscription.id}`, error);
    }
  }

  return results;
}

// --- Récupérer les abonnements VIP d'un utilisateur -------------------------

export async function getUserActiveVip(userId: number) {
  const subscriptions = await db
    .select()
    .from(vipSubscriptions)
    .where(
      and(
        eq(vipSubscriptions.userId, userId),
        eq(vipSubscriptions.status, "active"),
      ),
    )
    .orderBy(vipSubscriptions.level);

  return subscriptions;
}
