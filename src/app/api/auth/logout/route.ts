import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    await clearSession(bearerToken);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json({ error: "Déconnexion impossible." }, { status: 500 });
  }
}
