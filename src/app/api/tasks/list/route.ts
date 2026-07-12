import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { earnTasks, taskCompletions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let tasks = await db.select().from(earnTasks).where(eq(earnTasks.isActive, true)).orderBy(desc(earnTasks.createdAt));

  // Si aucune tâche n'existe, on insère par défaut les 4 tâches à 150 FCFA
  if (tasks.length === 0) {
    const defaultTasks = [
      {
        title: "Rejoindre le groupe WhatsApp",
        description: "Rejoignez notre groupe officiel WhatsApp pour rester informé",
        type: "external_link" as const,
        rewardAmount: 150,
        targetUrl: "https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1",
        instructions: "Cliquez sur le lien et rejoignez le groupe.",
        isActive: true,
      },
      {
        title: "Suivre notre canal Telegram",
        description: "Suivez notre canal Telegram officiel",
        type: "telegram" as const,
        rewardAmount: 150,
        targetUrl: "https://t.me/afilipro",
        instructions: "Cliquez sur le lien et appuyez sur 'Rejoindre'.",
        isActive: true,
      },
      {
        title: "Suivre notre compte TikTok @afilipro",
        description: "Abonnez-vous à notre compte TikTok officiel",
        type: "tiktok_follow" as const,
        rewardAmount: 150,
        targetUrl: "https://www.tiktok.com",
        instructions: "Cliquez sur le lien et appuyez sur 'Suivre'.",
        isActive: true,
      },
      {
        title: "S'abonner à la chaîne YouTube",
        description: "Abonnez-vous à notre chaîne YouTube officielle",
        type: "youtube_subscribe" as const,
        rewardAmount: 150,
        targetUrl: "https://www.youtube.com",
        instructions: "Cliquez sur le lien et appuyez sur 'S'abonner'.",
        isActive: true,
      },
    ];
    await db.insert(earnTasks).values(defaultTasks as any);
    tasks = await db.select().from(earnTasks).where(eq(earnTasks.isActive, true)).orderBy(desc(earnTasks.createdAt));
  }

  const completions = await db
    .select({ taskId: taskCompletions.taskId })
    .from(taskCompletions)
    .where(eq(taskCompletions.userId, user.id));

  const completedIds = new Set(completions.map((c) => c.taskId));

  return NextResponse.json({
    tasks: tasks.map((t) => ({ ...t, completed: completedIds.has(t.id) })),
  });
}
