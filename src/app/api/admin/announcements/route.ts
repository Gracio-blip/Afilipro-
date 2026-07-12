import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements, admins } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const items = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  return NextResponse.json({ announcements: items });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { title, message, type } = await request.json();
  const [ann] = await db.insert(announcements).values({
    title, message, type: type ?? "info", isActive: true, createdBy: admin.id,
  }).returning();

  return NextResponse.json({ announcement: ann }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { announcementId, isActive } = await request.json();
  await db.update(announcements).set({ isActive }).where(eq(announcements.id, announcementId));
  return NextResponse.json({ success: true });
}
