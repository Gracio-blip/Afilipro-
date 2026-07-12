import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users, wallets, admins } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'AFILIPRO_SETUP_2024_SECRET';

export async function POST(request: Request) {
  const { secret } = await request.json();

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Secret invalide' }, { status: 403 });
  }

  const email = 'admin@afilipro.com';
  const password = 'Admin123456!';
  const name = 'Administrateur AfiliPro';

  try {
    let userId: number;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      userId = existingUser.id;
      const passwordHash = await hashPassword(password);
      await db.update(users).set({ passwordHash, status: 'active', updatedAt: new Date() }).where(eq(users.id, userId));
    } else {
      const passwordHash = await hashPassword(password);
      const [newUser] = await db
        .insert(users)
        .values({ name, email, passwordHash, status: 'active', referralCode: 'ADMIN0001' })
        .returning();
      userId = newUser.id;

      await db.insert(wallets).values({
        userId,
        balance: 0,
        currency: 'FCFA',
      });
    }

    const [existingAdmin] = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, userId))
      .limit(1);

    if (!existingAdmin) {
      await db.insert(admins).values({ userId, name, email });
    }

    return NextResponse.json({
      success: true,
      message: 'Administrateur configuré',
      email,
      password,
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json({ error: 'Erreur de configuration' }, { status: 500 });
  }
}
