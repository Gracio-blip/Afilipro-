import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { wallets, walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { sendWithdrawalNotification } from "@/lib/telegram";

// Progression des retraits : 1er = 1500, 2ème = 3500, 3ème = 5500, etc (+2000 FCFA/palier)
function getRequiredWithdrawalAmount(withdrawalCount: number): number {
  return 1500 + (2000 * withdrawalCount);
}

const ALLOWED = new Set(["mixx", "moov"]);
const MIN_WITHDRAW = 1500;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const currentUser = await getCurrentUser(bearerToken);
    if (!currentUser) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    if (currentUser.status !== "active") return NextResponse.json({ error: "Activez votre compte d'abord." }, { status: 403 });

    const body = (await request.json()) as { amount?: number; paymentMethod?: string; phoneNumber?: string };
    const amount = Math.floor(Number(body.amount));
    const paymentMethod = body.paymentMethod?.toLowerCase() ?? "";
    const phoneNumber = body.phoneNumber?.trim() ?? "";

    if (!Number.isFinite(amount) || amount < MIN_WITHDRAW)
      return NextResponse.json({ error: `Retrait minimum : ${MIN_WITHDRAW} FCFA.` }, { status: 400 });
    if (!ALLOWED.has(paymentMethod))
      return NextResponse.json({ error: "Moyen de paiement non pris en charge." }, { status: 400 });
    if (phoneNumber.length < 8)
      return NextResponse.json({ error: "Numéro invalide." }, { status: 400 });

    const startOfDay = new Date(); startOfDay.setUTCHours(0, 0, 0, 0);
    const reference = `WDR-${randomUUID().replaceAll("-", "").slice(0, 14).toUpperCase()}`;

    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`select id from wallets where user_id = ${currentUser.id} for update`);

      const [wallet] = await tx.select({ balance: wallets.balance, withdrawalCount: wallets.withdrawalCount }).from(wallets).where(eq(wallets.userId, currentUser.id)).limit(1);
      if (!wallet || wallet.balance < amount) return { error: "Solde insuffisant.", status: 400 } as const;

      // Limite de retrait progressive : 1er=1500, 2ème=3500, 3ème=5500, etc.
      const withdrawalCount = wallet.withdrawalCount ?? 0;
      const requiredAmount = getRequiredWithdrawalAmount(withdrawalCount);
      
      // On bloque tout retrait d'un montant différent du palier actuel
      if (amount !== requiredAmount) {
        return { error: `Votre retrait #${withdrawalCount + 1} doit être exactement de ${requiredAmount.toLocaleString("fr-FR")} FCFA.`, status: 400 } as const;
      }

      // Bloquer le retrait des fonds initiaux de dépôt (sauf la part déjà investie en VIP)
      const [depRows, vipRows] = await Promise.all([
        tx.select({ amount: walletTransactions.amount })
          .from(walletTransactions)
          .where(and(eq(walletTransactions.userId, currentUser.id), eq(walletTransactions.type, 'deposit'), eq(walletTransactions.status, 'completed'))),
        tx.select({ amount: walletTransactions.amount })
          .from(walletTransactions)
          .where(and(eq(walletTransactions.userId, currentUser.id), eq(walletTransactions.type, 'vip_purchase'), eq(walletTransactions.status, 'completed'))),
      ]);

      const totalDepositedAmount = depRows.reduce((sum, d) => sum + d.amount, 0);
      const totalSpentOnVip = vipRows.reduce((sum, v) => sum + v.amount, 0);
      const unspentDeposit = Math.max(0, totalDepositedAmount - totalSpentOnVip);

      // L'utilisateur doit conserver au minimum le montant total non encore investi de son dépôt
      if (wallet.balance - amount < unspentDeposit) {
        return { error: `Le montant de votre dépôt d'investissement (${unspentDeposit.toLocaleString("fr-FR")} FCFA) est réservé aux investissements VIP et ne peut pas être retiré. Seuls vos gains (activités, parrainage) sont retirables.`, status: 400 } as const;
      }

      const wdToday = await tx.select({ id: walletTransactions.id }).from(walletTransactions)
        .where(and(eq(walletTransactions.userId, currentUser.id), eq(walletTransactions.type, "withdrawal"), gte(walletTransactions.createdAt, startOfDay)));
      if (wdToday.length >= 2) return { error: "Limite de 2 retraits par jour atteinte.", status: 429 } as const;

      await tx.update(wallets).set({ 
        balance: wallet.balance - amount, 
        totalWithdrawn: sql`${wallets.totalWithdrawn} + ${amount}`,
        withdrawalCount: sql`${wallets.withdrawalCount} + 1`,
        updatedAt: new Date() 
      }).where(eq(wallets.userId, currentUser.id));

      const [transaction] = await tx.insert(walletTransactions).values({
        userId: currentUser.id, type: "withdrawal", status: "pending",
        amount, paymentMethod, phoneNumber, reference,
        note: `Retrait #${withdrawalCount + 1}`,
      }).returning({ id: walletTransactions.id, status: walletTransactions.status, amount: walletTransactions.amount, reference: walletTransactions.reference });

      return { transaction, balance: wallet.balance - amount, withdrawalCount: withdrawalCount + 1, requiredAmount } as const;
    });

    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    // Envoyer la notification Telegram (ne bloque pas la réponse)
    sendWithdrawalNotification({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: phoneNumber,
      amount,
      method: paymentMethod,
      reference,
    }).catch(() => {});

    return NextResponse.json({ ...result, message: "Demande enregistrée." }, { status: 201 });
  } catch (error) {
    console.error("Withdrawal error", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le retrait." }, { status: 500 });
  }
}
