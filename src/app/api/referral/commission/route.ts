import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { users, wallets, walletTransactions, referralEarnings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// 300 FCFA pour chaque filleul qui active son compte avec 2 000 FCFA
const REFERRAL_BONUS = 300;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);
    if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const { referredUserId } = (await request.json()) as { referredUserId?: number };
    if (!referredUserId) {
      return NextResponse.json({ error: "ID du filleul requis." }, { status: 400 });
    }

    // Trouver le filleul et son parrain
    const [referred] = await db
      .select({ id: users.id, name: users.name, referrerId: users.referrerId })
      .from(users)
      .where(eq(users.id, referredUserId))
      .limit(1);

    if (!referred?.referrerId) {
      return NextResponse.json({ credited: 0, message: "Pas de parrain enregistré." });
    }

    // Vérifier que la commission n'a pas déjà été versée
    const [existing] = await db
      .select({ id: referralEarnings.id })
      .from(referralEarnings)
      .where(eq(referralEarnings.referredId, referredUserId))
      .limit(1);

    if (existing) {
      return NextResponse.json({ credited: 0, message: "Commission déjà versée." });
    }

    const reference = `REF-${randomUUID().replaceAll("-", "").slice(0, 14).toUpperCase()}`;

    await db.transaction(async (tx) => {
      await tx.execute(sql`select id from wallets where user_id = ${referred.referrerId} for update`);

      await tx
        .update(wallets)
        .set({ balance: sql`${wallets.balance} + ${REFERRAL_BONUS}`, referralEarnings: sql`${wallets.referralEarnings} + ${REFERRAL_BONUS}`, updatedAt: new Date() })
        .where(eq(wallets.userId, referred.referrerId!));

      const [tx_record] = await tx.insert(walletTransactions).values({
        userId: referred.referrerId!,
        type: "referral_bonus",
        status: "completed",
        amount: REFERRAL_BONUS,
        paymentMethod: "referral",
        reference,
        note: `Bonus parrainage — activation de ${referred.name}`,
      }).returning({ id: walletTransactions.id });

      await tx.insert(referralEarnings).values({
        referrerId: referred.referrerId!,
        referredId: referredUserId,
        amount: REFERRAL_BONUS,
        type: "activation",
        transactionId: tx_record?.id,
      });

      await tx.update(users).set({ totalReferrals: sql`${users.totalReferrals} + 1` }).where(eq(users.id, referred.referrerId!));
    });

    return NextResponse.json({ credited: REFERRAL_BONUS, message: `+${REFERRAL_BONUS} FCFA crédités au parrain.` });
  } catch (error) {
    console.error("Referral commission error", error);
    return NextResponse.json({ error: "Erreur de commission de parrainage." }, { status: 500 });
  }
}
