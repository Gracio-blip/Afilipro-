import { NextResponse } from "next/server";
import { and, eq, lte, gte, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { wallets, walletTransactions, vipSubscriptions, dailyEarnings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getVipPack } from "@/lib/vip";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);

    if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    if (user.status !== "active") {
      return NextResponse.json({ error: "Votre compte doit être activé avant de collecter les revenus." }, { status: 403 });
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Récupérer tous les abonnements VIP actifs de l'utilisateur
    const activeSubscriptions = await db
      .select()
      .from(vipSubscriptions)
      .where(
        and(
          eq(vipSubscriptions.userId, user.id),
          eq(vipSubscriptions.status, "active"),
          lte(vipSubscriptions.startDate, now),
        ),
      );

    if (activeSubscriptions.length === 0) {
      return NextResponse.json({ credited: 0, message: "Aucun abonnement actif." });
    }

    let totalCredited = 0;
    const paidSubs: number[] = [];
    let alreadyExpired = 0;

    for (const sub of activeSubscriptions) {
      // Si pas encore arrivé à échéance, on saute
      if (sub.endDate.getTime() > now.getTime()) {
        continue;
      }

      // L'abonnement est arrivé à échéance — verser le montant total UNE SEULE FOIS
      const pack = getVipPack(sub.level);
      if (!pack) continue;

      // Vérifier si déjà payé (paiement unique)
      const alreadyPaid = await db
        .select({ id: walletTransactions.id })
        .from(walletTransactions)
        .where(
          and(
            eq(walletTransactions.userId, user.id),
            eq(walletTransactions.type, "vip_daily"),
            eq(walletTransactions.reference, `VIPF-${sub.id}`),
          ),
        )
        .limit(1);

      if (alreadyPaid.length > 0) {
        // Déjà payé, marquer comme expiré
        await db.update(vipSubscriptions).set({ status: "expired", updatedAt: now }).where(eq(vipSubscriptions.id, sub.id));
        alreadyExpired++;
        continue;
      }

      const reference = `VIPF-${sub.id}-${randomUUID().slice(0, 12).toUpperCase()}`;

      await db.transaction(async (tx) => {
        await tx.execute(sql`select id from wallets where user_id = ${user.id} for update`);

        await tx
          .update(wallets)
          .set({ balance: sql`${wallets.balance} + ${pack.totalReturn}`, updatedAt: now })
          .where(eq(wallets.userId, user.id));

        await tx.insert(walletTransactions).values({
          userId: user.id,
          type: "vip_daily",
          status: "completed",
          amount: pack.totalReturn,
          paymentMethod: "VIP Final",
          reference,
          note: `${pack.name} — Paiement final après ${pack.days} jours`,
        });

        await tx
          .update(vipSubscriptions)
          .set({ status: "expired", daysPaid: sub.totalDays, lastPaidDate: now, updatedAt: now })
          .where(eq(vipSubscriptions.id, sub.id));
      });

      totalCredited += pack.totalReturn;
      paidSubs.push(sub.id);
    }

    const [wallet] = await db
      .select({ balance: wallets.balance })
      .from(wallets)
      .where(eq(wallets.userId, user.id))
      .limit(1);

    return NextResponse.json({
      credited: totalCredited,
      balance: wallet?.balance ?? 0,
      paidSubscriptions: paidSubs.length,
      alreadyExpired,
      message:
        totalCredited > 0
          ? `🎉 ${paidSubs.length} abonnement(s) arrivé(s) à échéance. +${totalCredited.toLocaleString("fr-FR")} FCFA versés sur votre compte !`
          : alreadyExpired > 0
          ? "Vos gains ont déjà été versés. Tous vos abonnements sont à jour."
          : "Aucun abonnement arrivé à échéance pour le moment. Le paiement sera effectué après 75 jours.",
    });
  } catch (error) {
    console.error("VIP daily income error", error);
    return NextResponse.json({ error: "Impossible de collecter les gains." }, { status: 500 });
  }
}
