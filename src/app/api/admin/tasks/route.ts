import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { earnTasks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const tasks = await db.select().from(earnTasks).orderBy(desc(earnTasks.createdAt));
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await request.json();
  const [task] = await db.insert(earnTasks).values({
    title: body.title,
    description: body.description,
    type: body.type,
    rewardAmount: Number(body.rewardAmount),
    targetUrl: body.targetUrl || null,
    instructions: body.instructions || null,
    isActive: true,
  }).returning();

  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { taskId, updates } = await request.json();
  await db.update(earnTasks).set({ ...updates, updatedAt: new Date() }).where(eq(earnTasks.id, taskId));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { taskId } = await request.json();
  await db.update(earnTasks).set({ isActive: false, updatedAt: new Date() }).where(eq(earnTasks.id, taskId));
  return NextResponse.json({ success: true });
}
