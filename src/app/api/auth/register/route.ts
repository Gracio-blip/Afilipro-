import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { users, wallets, earnTasks, referralEarnings, walletTransactions } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateReferralCode(name: string, id: number): string {
  const base = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const rand = randomBytes(2).toString("hex").toUpperCase();
  return `${base}${id}${rand}`.slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      referralCode?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const phone = body.phone?.trim() || null;
    const password = body.password ?? "";
    const referralCode = body.referralCode?.trim().toUpperCase() || null;

    if (name.length < 2)
      return NextResponse.json({ error: "Le nom est trop court." }, { status: 400 });
    if (!EMAIL_PATTERN.test(email))
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: "Mot de passe : 8 caractères minimum." }, { status: 400 });

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing)
      return NextResponse.json({ error: "Un compte existe déjà avec cet e-mail." }, { status: 409 });

    // Trouver le parrain par son code de parrainage
    let referrerId: number | null = null;
    if (referralCode) {
      const [ref] = await db.select({ id: users.id }).from(users).where(eq(users.referralCode, referralCode)).limit(1);
      referrerId = ref?.id ?? null;
    }

    const passwordHash = await hashPassword(password);

    const user = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({ name, email, phone, passwordHash, referrerId, status: "pending_activation" })
        .returning({ id: users.id, name: users.name, email: users.email, status: users.status, createdAt: users.createdAt });

      // Générer le code de parrainage unique
      const myCode = generateReferralCode(name, created.id);
      await tx.update(users).set({ referralCode: myCode }).where(eq(users.id, created.id));

      const [wallet] = await tx
        .insert(wallets)
        .values({ userId: created.id, balance: 0, currency: "FCFA" })
        .returning({ balance: wallets.balance, currency: wallets.currency });

      return { ...created, referralCode: myCode, ...wallet, vipLevel: 0 };
    });

    const token = await createSession(user.id);

    return NextResponse.json({
      user,
      token,
      requiresActivation: true,
      message: "Compte créé. Effectuez votre premier dépôt de 2 000 FCFA pour l'activer.",
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Impossible de créer le compte." }, { status: 500 });
  }
}
