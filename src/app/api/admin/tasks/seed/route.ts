import { NextResponse } from "next/server";
import { db } from "@/db";
import { earnTasks } from "@/db/schema";

export async function POST() {
  try {
    const tasks = [
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
    ];

    const inserted = await db.insert(earnTasks).values(tasks as any).returning();
    
    return NextResponse.json({ 
      success: true, 
      message: `${inserted.length} tâches créées (150 FCFA chacune)`,
      tasks: inserted,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Erreur lors de la création des tâches" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await db.select().from(earnTasks).orderBy(earnTasks.createdAt);
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
