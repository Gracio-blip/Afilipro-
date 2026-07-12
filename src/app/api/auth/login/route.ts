import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, wallets, vipSubscriptions } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
    }

    if (user.status === "suspended") {
      return NextResponse.json({ error: "Votre compte est suspendu." }, { status: 403 });
    }

    const [wallet] = await db
      .select({ balance: wallets.balance, currency: wallets.currency })
      .from(wallets)
      .where(eq(wallets.userId, user.id))
      .limit(1);

    const [highestVip] = await db
      .select({ level: vipSubscriptions.level, endDate: vipSubscriptions.endDate })
      .from(vipSubscriptions)
      .where(eq(vipSubscriptions.userId, user.id))
      .orderBy(vipSubscriptions.level)
      .limit(1);

    const currentVip =
      highestVip && highestVip.endDate.getTime() > Date.now() ? highestVip.level : 0;

    const token = await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        status: user.status,
        balance: wallet?.balance ?? 0,
        vipLevel: currentVip,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Connexion temporairement indisponible." }, { status: 500 });
  }
}
