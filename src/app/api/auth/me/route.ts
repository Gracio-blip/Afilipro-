import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const transactions = await db
      .select({
        id: walletTransactions.id,
        type: walletTransactions.type,
        status: walletTransactions.status,
        amount: walletTransactions.amount,
        paymentMethod: walletTransactions.paymentMethod,
        reference: walletTransactions.reference,
        note: walletTransactions.note,
        createdAt: walletTransactions.createdAt,
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, user.id))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(10);

    return NextResponse.json({ user, transactions });
  } catch (error) {
    console.error("Current user error", error);
    return NextResponse.json({ error: "Impossible de charger le compte." }, { status: 500 });
  }
}
