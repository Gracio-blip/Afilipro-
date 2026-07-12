import { NextResponse } from "next/server";
import { and, eq, like, sql } from "drizzle-orm";
import { db } from "@/db";
import { wallets, walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const REWARDS = {
  tiktok: { 1: 200, 2: 200 },
  quiz: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 },
} as const;

type SupportedTask = keyof typeof REWARDS;

function utcDay() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const currentUser = await getCurrentUser(bearerToken);
    if (!currentUser) {
      return NextResponse.json({ error: "Veuillez vous connecter." }, { status: 401 });
    }
    if (currentUser.status !== "active") {
      return NextResponse.json({ error: "Activez votre compte avec un premier dépôt validé avant d’accéder aux activités." }, { status: 403 });
    }

    const body = (await request.json()) as { taskType?: string; taskId?: number };
    const taskType = body.taskType as SupportedTask;
    const taskId = Math.floor(Number(body.taskId));

    if (!(taskType in REWARDS)) {
      return NextResponse.json({ error: "Type de mission invalide." }, { status: 400 });
    }

    const reward = REWARDS[taskType][taskId as keyof (typeof REWARDS)[SupportedTask]];
    if (!reward) {
      return NextResponse.json({ error: "Mission inconnue." }, { status: 400 });
    }

    const day = utcDay();
    const prefix = `TASK-${day}-${taskType}-`;
    const reference = `${prefix}${taskId}-${currentUser.id}`;
    const dailyEarningLimit = 1000; // Limite quotidienne en FCFA

    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`select id from wallets where user_id = ${currentUser.id} for update`);

      // Récupérer les missions complétées aujourd'hui
      const completedToday = await tx
        .select({ 
          id: walletTransactions.id, 
          reference: walletTransactions.reference,
          amount: walletTransactions.amount 
        })
        .from(walletTransactions)
        .where(
          and(
            eq(walletTransactions.userId, currentUser.id),
            eq(walletTransactions.type, "earning"),
            like(walletTransactions.reference, `${prefix}%`),
          ),
        );

      // Vérifier si la mission est déjà complétée
      if (completedToday.some((transaction) => transaction.reference === reference)) {
        return { error: "Cette mission est déjà complétée aujourd'hui.", status: 409 } as const;
      }

      // Vérifier la limite de 2 missions par type par jour
      if (completedToday.length >= 2) {
        return { error: "Votre limite de deux missions est atteinte pour aujourd'hui.", status: 429 } as const;
      }

      // Calculer le total des gains quotidiens (toutes missions confondues)
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      
      const allEarningsToday = await tx
        .select({ amount: walletTransactions.amount })
        .from(walletTransactions)
        .where(
          and(
            eq(walletTransactions.userId, currentUser.id),
            eq(walletTransactions.type, "earning"),
            sql`${walletTransactions.createdAt} >= ${todayStart}`,
          ),
        );

      const totalEarnedToday = allEarningsToday.reduce((sum, t) => sum + t.amount, 0);

      // Vérifier si le plafond quotidien est atteint
      if (totalEarnedToday >= dailyEarningLimit) {
        return { 
          error: `Vous avez atteint la limite quotidienne de ${dailyEarningLimit} FCFA. Revenez demain !`, 
          status: 429 
        } as const;
      }

      // Vérifier si cette mission dépasserait le plafond
      if (totalEarnedToday + reward > dailyEarningLimit) {
        return { 
          error: `Cette mission dépasserait la limite quotidienne. Vous avez déjà gagné ${totalEarnedToday} FCFA aujourd'hui.`, 
          status: 429 
        } as const;
      }

      const [wallet] = await tx
        .select({ balance: wallets.balance })
        .from(wallets)
        .where(eq(wallets.userId, currentUser.id))
        .limit(1);

      if (!wallet) {
        return { error: "Aucun portefeuille.", status: 400 } as const;
      }

      const balance = wallet.balance + reward;
      await tx
        .update(wallets)
        .set({ balance, updatedAt: new Date() })
        .where(eq(wallets.userId, currentUser.id));
      await tx.insert(walletTransactions).values({
        userId: currentUser.id,
        type: "earning",
        status: "completed",
        amount: reward,
        paymentMethod: taskType,
        reference,
        note: `Mission ${taskType} n°${taskId} — Total quotidien: ${totalEarnedToday + reward} FCFA`,
      });

      return { reward, balance, totalEarnedToday: totalEarnedToday + reward } as const;
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ...result, message: `+${result.reward.toLocaleString("fr-FR")} FCFA crédités.` });
  } catch (error) {
    console.error("Task completion error", error);
    return NextResponse.json({ error: "Impossible de valider cette mission." }, { status: 500 });
  }
}
