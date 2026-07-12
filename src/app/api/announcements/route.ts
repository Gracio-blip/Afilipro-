import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const items = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(desc(announcements.createdAt))
    .limit(5);

  return NextResponse.json({ announcements: items });
}
