import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, wallets } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);

    if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    if (user.status !== "active") {
      return NextResponse.json({ error: "Activez votre compte avec votre premier dépôt pour accéder au quiz." }, { status: 403 });
    }

    const [dbUser] = await db.select({ lastClaim: users.lastDailyQuizClaim }).from(users).where(eq(users.id, user.id));
    
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (dbUser.lastClaim && dbUser.lastClaim.toISOString().slice(0, 10) === todayStr) {
      return NextResponse.json({ error: "Vous avez déjà complété le quiz aujourd'hui." }, { status: 400 });
    }

    const REWARD = 150; // 50 FCFA x 3 questions

    await db.transaction(async (tx) => {
      await tx.update(users).set({ lastDailyQuizClaim: now }).where(eq(users.id, user.id));
      await tx.update(wallets).set({
        balance: sql`${wallets.balance} + ${REWARD}`,
        taskEarnings: sql`${wallets.taskEarnings} + ${REWARD}`,
        updatedAt: now
      }).where(eq(wallets.userId, user.id));
    });

    return NextResponse.json({ success: true, message: `Félicitations ! ${REWARD} FCFA ont été ajoutés à votre compte.`, amount: REWARD });
  } catch (error) {
    console.error("Daily Quiz Claim Error:", error);
    return NextResponse.json({ error: "Erreur lors de la réclamation." }, { status: 500 });
  }
}
