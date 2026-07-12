import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { and, eq, gt, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { authSessions, users, wallets, walletTransactions } from "@/db/schema";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "afilipro_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, "hex");

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(authSessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentUser(bearerToken?: string) {
  let token = bearerToken;
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE)?.value;
  }
  if (!token) return null;

  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      referralCode: users.referralCode,
      referrerId: users.referrerId,
      status: users.status,
      isVip: users.isVip,
      createdAt: users.createdAt,
      balance: wallets.balance,
      currency: wallets.currency,
      withdrawalCount: wallets.withdrawalCount,
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .innerJoin(wallets, eq(wallets.userId, users.id))
    .where(
      and(
        eq(authSessions.tokenHash, hashToken(token)),
        gt(authSessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!result) return null;

  const [depRes, vipRes] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(${sum(walletTransactions.amount)}, 0)` })
      .from(walletTransactions)
      .where(and(eq(walletTransactions.userId, result.id), eq(walletTransactions.type, "deposit"), eq(walletTransactions.status, "completed"))),
    db
      .select({ total: sql<number>`coalesce(${sum(walletTransactions.amount)}, 0)` })
      .from(walletTransactions)
      .where(and(eq(walletTransactions.userId, result.id), eq(walletTransactions.type, "vip_purchase"), eq(walletTransactions.status, "completed"))),
  ]);

  const totalDeposits = Number(depRes[0]?.total ?? 0);
  const totalSpentOnVip = Number(vipRes[0]?.total ?? 0);
  const unspentDeposit = Math.max(0, totalDeposits - totalSpentOnVip);
  const withdrawableBalance = Math.max(0, (result.balance ?? 0) - unspentDeposit);

  return {
    ...result,
    balance: result.balance ?? 0,
    currency: result.currency ?? "FCFA",
    unspentDeposit,
    withdrawableBalance,
  };
}

export async function clearSession(bearerToken?: string) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE)?.value;
  const tokens = [cookieToken, bearerToken].filter((token): token is string => Boolean(token));

  for (const token of new Set(tokens)) {
    await db.delete(authSessions).where(eq(authSessions.tokenHash, hashToken(token)));
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
