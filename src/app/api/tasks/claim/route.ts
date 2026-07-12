import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { earnTasks, taskCompletions, wallets, walletTransactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (user.status !== "active") return NextResponse.json({ error: "Activez votre compte d'abord." }, { status: 403 });

  const { taskId } = (await request.json()) as { taskId?: number };
  if (!taskId) return NextResponse.json({ error: "taskId requis." }, { status: 400 });

  const [task] = await db.select().from(earnTasks).where(eq(earnTasks.id, taskId)).limit(1);
  if (!task || !task.isActive) return NextResponse.json({ error: "Tâche introuvable ou inactive." }, { status: 404 });

  // Vérifier si déjà complétée
  const [alreadyDone] = await db
    .select({ id: taskCompletions.id })
    .from(taskCompletions)
    .where(and(eq(taskCompletions.userId, user.id), eq(taskCompletions.taskId, taskId)))
    .limit(1);

  if (alreadyDone) return NextResponse.json({ error: "Vous avez déjà complété cette tâche." }, { status: 409 });

  const reference = `TASK-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;

  await db.transaction(async (tx) => {
    await tx.execute(sql`select id from wallets where user_id = ${user.id} for update`);

    await tx.update(wallets).set({
      balance: sql`${wallets.balance} + ${task.rewardAmount}`,
      taskEarnings: sql`${wallets.taskEarnings} + ${task.rewardAmount}`,
      updatedAt: new Date(),
    }).where(eq(wallets.userId, user.id));

    await tx.insert(walletTransactions).values({
      userId: user.id,
      type: "task_reward",
      status: "completed",
      amount: task.rewardAmount,
      paymentMethod: "task",
      reference,
      note: `Tâche complétée : ${task.title}`,
    });

    await tx.insert(taskCompletions).values({
      userId: user.id,
      taskId,
      rewardAmount: task.rewardAmount,
      status: "completed",
    });

    await tx.update(earnTasks).set({ totalCompletions: sql`${earnTasks.totalCompletions} + 1` }).where(eq(earnTasks.id, taskId));
  });

  return NextResponse.json({ success: true, reward: task.rewardAmount, message: `+${task.rewardAmount} FCFA crédités !` });
}
