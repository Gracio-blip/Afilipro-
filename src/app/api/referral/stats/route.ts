import { NextResponse } from "next/server";
import { and, count, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { users, referralEarnings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getCurrentUser(bearerToken);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const [referred] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.referrerId, user.id));

  const [active] = await db
    .select({ total: count() })
    .from(users)
    .where(and(eq(users.referrerId, user.id), eq(users.status, "active")));

  const [earnings] = await db
    .select({ total: sum(referralEarnings.amount) })
    .from(referralEarnings)
    .where(eq(referralEarnings.referrerId, user.id));

  return NextResponse.json({
    stats: {
      totalReferrals: referred?.total ?? 0,
      activeReferrals: active?.total ?? 0,
      totalEarnings: Number(earnings?.total ?? 0),
      pendingEarnings: 0,
      paidEarnings: 0,
    },
  });
}
