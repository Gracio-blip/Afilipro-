import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { wallets, walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { sendDepositNotification } from "@/lib/telegram";

const ALLOWED = new Set(["mixx", "moov"]);
const MIN_AMOUNT = 2500;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const user = await getCurrentUser(bearerToken);
    if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const body = (await request.json()) as { amount?: number; paymentMethod?: string; phoneNumber?: string };
    const amount = Math.floor(Number(body.amount));
    const paymentMethod = body.paymentMethod?.toLowerCase() ?? "";
    const phoneNumber = body.phoneNumber?.trim() ?? "";

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT)
      return NextResponse.json({ error: `Dépôt minimum : ${MIN_AMOUNT} FCFA.` }, { status: 400 });
    if (!ALLOWED.has(paymentMethod))
      return NextResponse.json({ error: "Moyen de paiement non pris en charge." }, { status: 400 });
    if (phoneNumber.length < 8)
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });

    const reference = `DEP-${randomUUID().replaceAll("-", "").slice(0, 14).toUpperCase()}`;

    const [transaction] = await db
      .insert(walletTransactions)
      .values({
        userId: user.id,
        type: "deposit",
        status: "pending",
        amount,
        paymentMethod,
        phoneNumber,
        reference,
        note: "En attente de validation par l'administrateur",
      })
      .returning({ id: walletTransactions.id, status: walletTransactions.status, amount: walletTransactions.amount, reference: walletTransactions.reference });

    // Notification Telegram asynchrone (ne bloque pas la réponse)
    sendDepositNotification({
      userName: user.name,
      userEmail: user.email,
      amount,
      method: paymentMethod,
      reference,
    }).catch(() => {});

    return NextResponse.json({ transaction, message: "Demande créée. Validation par l'administrateur." }, { status: 201 });
  } catch (error) {
    console.error("Deposit error", error);
    return NextResponse.json({ error: "Impossible de préparer le dépôt." }, { status: 500 });
  }
}
