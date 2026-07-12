import { NextResponse } from "next/server";
import { db } from "@/db";
import { earnTasks, type EarnTask } from "@/db/schema";

export async function POST() {
  try {
    // Create 2 simple tasks worth 150 FCFA each
    const tasks: Array<{
      title: string;
      description: string;
      type: "external_link" | "telegram";
      rewardAmount: number;
      targetUrl: string;
      instructions: string;
      isActive: boolean;
    }> = [
      {
        title: "Rejoindre le groupe WhatsApp",
        description: "Rejoignez notre groupe officiel WhatsApp pour rester informé",
        type: "external_link",
        rewardAmount: 150,
        targetUrl: "https://chat.whatsapp.com/JRWGF3EvpbOKl0fQGeeBnb?s=sw&p=i&ilr=1",
        instructions: "Cliquez sur le lien et rejoignez le groupe.",
        isActive: true,
      },
      {
        title: "Suivre notre canal Telegram",
        description: "Suivez notre canal Telegram officiel",
        type: "telegram",
        rewardAmount: 150,
        targetUrl: "https://t.me/afilipro",
        instructions: "Cliquez sur le lien et appuyez sur 'Rejoindre'.",
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
