import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { wallets, walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);

    if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    if (user.status !== "active") {
      return NextResponse.json({ error: "Activez votre compte avec un premier dépôt validé avant de jouer." }, { status: 403 });
    }

    const { amount } = (await request.json()) as { amount?: number };
    const gain = Math.floor(Number(amount));

    if (!gain || gain <= 0 || gain > 800) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    const reference = `SPIN-${randomUUID().replaceAll("-", "").slice(0, 14).toUpperCase()}`;

    await db.transaction(async (tx) => {
      await tx.execute(sql`select id from wallets where user_id = ${user.id} for update`);

      await tx
        .update(wallets)
        .set({ balance: sql`${wallets.balance} + ${gain}`, updatedAt: new Date() })
        .where(eq(wallets.userId, user.id));

      await tx.insert(walletTransactions).values({
        userId: user.id,
        type: "earning",
        status: "completed",
        amount: gain,
        paymentMethod: "lucky_spin",
        reference,
        note: `Lucky Spin — gain de ${gain} FCFA`,
      });
    });

    const [wallet] = await db
      .select({ balance: wallets.balance })
      .from(wallets)
      .where(eq(wallets.userId, user.id))
      .limit(1);

    return NextResponse.json({ success: true, gain, balance: wallet?.balance ?? 0 });
  } catch (error) {
    console.error("Lucky spin claim error", error);
    return NextResponse.json({ error: "Impossible de créditer le gain." }, { status: 500 });
  }
}
