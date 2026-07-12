import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    const [user] = await db.select({ id: users.id, name: users.name }).from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      return NextResponse.json({ error: "Aucun compte trouvé avec cette adresse e-mail." }, { status: 404 });
    }

    // Générer un code à 6 chiffres
    const resetCode = randomInt(100000, 999999).toString();
    
    // TODO: Envoyer le code par email (implémentation réelle)
    // Pour l'instant, on simule l'envoi
    console.log(`Code de réinitialisation pour ${email}: ${resetCode}`);

    return NextResponse.json({ 
      success: true, 
      message: "Un code de réinitialisation a été envoyé à votre adresse e-mail.",
      // En production, ne jamais renvoyer le code
      code: resetCode 
    });
  } catch (error) {
    console.error("Forgot password error", error);
    return NextResponse.json({ error: "Impossible de traiter votre demande." }, { status: 500 });
  }
}
