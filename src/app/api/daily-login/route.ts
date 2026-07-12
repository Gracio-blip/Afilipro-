import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { wallets, walletTransactions, dailyLoginBonuses, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const BASE_BONUS = 50;    // FCFA de base
const STREAK_BONUS = 10;  // FCFA supplémentaires par jour de streak

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (user.status !== "active") return NextResponse.json({ credited: 0, message: "Compte non actif." });

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  // Vérifier si bonus déjà réclamé aujourd'hui
  const [alreadyToday] = await db
    .select({ id: dailyLoginBonuses.id })
    .from(dailyLoginBonuses)
    .where(and(eq(dailyLoginBonuses.userId, user.id), gte(dailyLoginBonuses.claimedAt, startOfToday)))
    .limit(1);

  if (alreadyToday) return NextResponse.json({ credited: 0, message: "Bonus déjà réclamé aujourd'hui." });

  // Calculer le streak
  const yesterday = new Date(startOfToday);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const [lastBonus] = await db
    .select({ claimedAt: dailyLoginBonuses.claimedAt, streak: dailyLoginBonuses.streak })
    .from(dailyLoginBonuses)
    .where(eq(dailyLoginBonuses.userId, user.id))
    .orderBy(desc(dailyLoginBonuses.claimedAt))
    .limit(1);

  const wasteYesterday = lastBonus && lastBonus.claimedAt >= yesterday;
  const newStreak = wasteYesterday ? (lastBonus?.streak ?? 0) + 1 : 1;
  const bonus = BASE_BONUS + Math.min(newStreak - 1, 6) * STREAK_BONUS;

  const reference = `LOGIN-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;

  await db.transaction(async (tx) => {
    await tx.execute(sql`select id from wallets where user_id = ${user.id} for update`);

    await tx.update(wallets).set({ balance: sql`${wallets.balance} + ${bonus}`, updatedAt: now }).where(eq(wallets.userId, user.id));

    await tx.insert(walletTransactions).values({
      userId: user.id,
      type: "daily_login",
      status: "completed",
      amount: bonus,
      paymentMethod: "bonus",
      reference,
      note: `Bonus quotidien — Streak ${newStreak} jour${newStreak > 1 ? "s" : ""}`,
    });

    await tx.insert(dailyLoginBonuses).values({ userId: user.id, amount: bonus, streak: newStreak });

    await tx.update(users).set({ loginStreak: newStreak, lastLoginAt: now }).where(eq(users.id, user.id));
  });

  return NextResponse.json({
    credited: bonus,
    streak: newStreak,
    message: `+${bonus} FCFA — Streak ${newStreak} jour${newStreak > 1 ? "s" : ""}`,
  });
}
