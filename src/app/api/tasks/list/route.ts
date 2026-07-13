import { NextResponse } from "next/server";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { earnTasks, taskCompletions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  // Nettoyer les anciennes tâches interdites (WhatsApp groupe, Telegram canal, TikTok @afilipro, YouTube afilipro sans Bonus)
  try {
    await db.execute(sql`
      UPDATE earn_tasks SET is_active = false 
      WHERE title ILIKE '%whatsapp%groupe%' 
      OR title ILIKE '%canal telegram%'
      OR title ILIKE '%compte tiktok%afilipro%'
      OR (title ILIKE '%youtube%' AND title NOT ILIKE '%(Bonus)%')
    `);
  } catch {}

  let tasks = await db.select().from(earnTasks).where(eq(earnTasks.isActive, true)).orderBy(desc(earnTasks.createdAt));

  // Si moins de 2 tâches, créer les 2 tâches quotidiennes à 150 FCFA
  if (tasks.length < 2) {
    const needed = 2 - tasks.length;
    const newTasks = [
      {
        title: "Visiter notre page Facebook",
        description: "Visitez et aimez notre page Facebook officielle",
        type: "external_link" as const,
        rewardAmount: 150,
        targetUrl: "https://facebook.com",
        instructions: "Cliquez sur le lien, visitez la page et revenez valider.",
        isActive: true,
      },
      {
        title: "Partager AfiliPro",
        description: "Partagez AfiliPro avec un ami",
        type: "custom" as const,
        rewardAmount: 150,
        targetUrl: null,
        instructions: "Partagez le lien de parrainage à un ami.",
        isActive: true,
      },
    ].slice(0, needed);

    if (newTasks.length > 0) {
      await db.insert(earnTasks).values(newTasks as any);
      tasks = await db.select().from(earnTasks).where(eq(earnTasks.isActive, true)).orderBy(desc(earnTasks.createdAt));
    }
  }

  // Limiter strictement à 2 tâches comme demandé
  tasks = tasks.slice(0, 2);

  const completions = await db
    .select({ taskId: taskCompletions.taskId })
    .from(taskCompletions)
    .where(eq(taskCompletions.userId, user.id));

  const completedIds = new Set(completions.map((c) => c.taskId));

  return NextResponse.json({
    tasks: tasks.map((t) => ({ ...t, completed: completedIds.has(t.id) })),
  });
}
