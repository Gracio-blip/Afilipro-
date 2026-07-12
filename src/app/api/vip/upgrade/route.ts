import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vipSubscriptions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getVipPack, createVipSubscription } from "@/lib/vip";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const currentUser = await getCurrentUser(bearerToken);

    if (!currentUser) {
      return NextResponse.json({ error: "Veuillez vous connecter." }, { status: 401 });
    }
    if (currentUser.status !== "active") {
      return NextResponse.json({ error: "Votre premier dépôt doit être validé avant d’activer un investissement VIP." }, { status: 403 });
    }

    const body = (await request.json()) as { level?: number };
    const targetLevel = Math.floor(Number(body.level));

    const pack = getVipPack(targetLevel);
    if (!pack) {
      return NextResponse.json({ error: "Niveau VIP non valide." }, { status: 400 });
    }

    // Check for active subscription at this level or above
    const [highest] = await db
      .select({ level: vipSubscriptions.level, endDate: vipSubscriptions.endDate })
      .from(vipSubscriptions)
      .where(eq(vipSubscriptions.userId, currentUser.id))
      .orderBy(vipSubscriptions.level)
      .limit(1);

    if (highest && highest.endDate.getTime() > Date.now() && highest.level >= targetLevel) {
      return NextResponse.json({ error: "Vous possédez déjà ce niveau VIP ou un niveau supérieur." }, { status: 400 });
    }

    try {
      const result = await createVipSubscription(currentUser.id, targetLevel);

      return NextResponse.json({
        success: true,
        balance: result.balance,
        vipLevel: targetLevel,
        endDate: result.endDate,
        message: `${pack.name} activé avec succès pour un cycle de ${pack.days} jours.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'activation.";
      if (message.includes("Solde insuffisant")) {
        return NextResponse.json({ error: `${pack.name} coûte ${pack.cost.toLocaleString("fr-FR")} FCFA. Veuillez recharger.` }, { status: 400 });
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } catch (error) {
    console.error("VIP upgrade error", error);
    return NextResponse.json({ error: "Impossible de souscrire au pack VIP pour le moment." }, { status: 500 });
  }
}
