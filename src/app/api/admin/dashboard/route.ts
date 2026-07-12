import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { users, walletTransactions, wallets } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  
  const user = await getCurrentUser(bearerToken);
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const admin = await requireAdmin(user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 });
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  const allTransactions = await db
    .select()
    .from(walletTransactions)
    .orderBy(desc(walletTransactions.createdAt));

  const walletBalances = await db.select().from(wallets);

  return NextResponse.json({
    users: allUsers,
    transactions: allTransactions,
    wallets: walletBalances,
  });
}
