import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { users, admins, adminLogs } from "@/db/schema";

export async function requireAdmin(userId: number) {
  const [admin] = await db
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
    })
    .from(admins)
    .where(eq(admins.userId, userId))
    .limit(1);

  return admin ?? null;
}

export interface LogEntryInput {
  adminId: number | null;
  action: string;
  targetType?: string;
  targetId?: number;
  details?: string;
  ipAddress?: string;
}

export async function logAdminAction(entry: LogEntryInput) {
  await db.insert(adminLogs).values({
    adminId: entry.adminId,
    action: entry.action,
    targetType: entry.targetType ?? null,
    targetId: entry.targetId ?? null,
    details: entry.details ?? null,
    ipAddress: entry.ipAddress ?? null,
  });
}

export async function seedDefaultAdmin() {
  const [existing] = await db.select({ id: admins.id }).from(admins).limit(1);
  if (existing) return existing;

  const [seedUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@afilipro.com"))
    .limit(1);

  if (!seedUser) return null;

  const [admin] = await db
    .insert(admins)
    .values({
      userId: seedUser.id,
      name: "Administrateur AfiliPro",
      email: "admin@afilipro.com",
    })
    .returning({ id: admins.id });

  return admin ?? null;
}
