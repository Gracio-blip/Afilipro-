import { NextRequest, NextResponse } from "next/server";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, wallets } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(user.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const search = request.nextUrl.searchParams.get("q") ?? "";

  const allUsers = await db
    .select({
      id: users.id, name: users.name, email: users.email, phone: users.phone,
      status: users.status, isVip: users.isVip, totalReferrals: users.totalReferrals,
      referralCode: users.referralCode, createdAt: users.createdAt,
      balance: wallets.balance,
    })
    .from(users)
    .leftJoin(wallets, eq(wallets.userId, users.id))
    .where(search ? or(like(users.name, `%${search}%`), like(users.email, `%${search}%`)) : undefined)
    .orderBy(desc(users.createdAt));

  return NextResponse.json({ users: allUsers });
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const authUser = await getCurrentUser(bearerToken);
  if (!authUser) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await requireAdmin(authUser.id);
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { userId, action } = await request.json();
  const statusMap: Record<string, string> = { activate: "active", suspend: "suspended", delete: "deleted" };
  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Action invalide" }, { status: 400 });

  await db.update(users).set({ status: newStatus, updatedAt: new Date() }).where(eq(users.id, userId));
  await logAdminAction({ adminId: admin.id, action: `Compte ${action}`, targetType: "user", targetId: userId });
  return NextResponse.json({ success: true });
}
