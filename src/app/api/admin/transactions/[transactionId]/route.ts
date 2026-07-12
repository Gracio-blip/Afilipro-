import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users, wallets, walletTransactions } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { requireAdmin, logAdminAction } from '@/lib/admin';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ transactionId: string }> }
) {
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

  const { transactionId } = await context.params;
  const { action } = await request.json();

  const [transaction] = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.id, parseInt(transactionId)))
    .limit(1);

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction non trouvée' }, { status: 404 });
  }

  if (transaction.status !== 'pending') {
    return NextResponse.json({ error: 'Transaction déjà traitée' }, { status: 400 });
  }

  if (action === 'approve') {
    if (transaction.type === 'deposit') {
      await db.transaction(async (tx) => {
        await tx
          .update(wallets)
          .set({
            balance: sql`${wallets.balance} + ${transaction.amount}`,
          })
          .where(eq(wallets.userId, transaction.userId));

        await tx
          .update(walletTransactions)
          .set({ status: 'completed', reviewedBy: admin.id, reviewedAt: new Date(), updatedAt: new Date() })
          .where(eq(walletTransactions.id, transaction.id));

        // Le premier dépôt validé active automatiquement le compte.
        await tx
          .update(users)
          .set({ status: 'active', updatedAt: new Date() })
          .where(eq(users.id, transaction.userId));
      });

      await logAdminAction({
        adminId: admin.id,
        action: 'Dépôt approuvé',
        targetType: 'transaction',
        targetId: transaction.id,
        details: `${transaction.amount} FCFA crédités`,
      });

      return NextResponse.json({ success: true, message: 'Dépôt approuvé' });
    }

    if (transaction.type === 'withdrawal') {
      await db
        .update(walletTransactions)
        .set({ status: 'completed' })
        .where(eq(walletTransactions.id, transaction.id));

      await logAdminAction({
        adminId: admin.id,
        action: 'Retrait approuvé',
        targetType: 'transaction',
        targetId: transaction.id,
        details: `${transaction.amount} FCFA versés`,
      });

      return NextResponse.json({ success: true, message: 'Retrait approuvé' });
    }
  }

  if (action === 'reject') {
    if (transaction.type === 'deposit') {
      await db
        .update(walletTransactions)
        .set({ status: 'failed' })
        .where(eq(walletTransactions.id, transaction.id));

      await logAdminAction({
        adminId: admin.id,
        action: 'Dépôt rejeté',
        targetType: 'transaction',
        targetId: transaction.id,
        details: `${transaction.amount} FCFA`,
      });

      return NextResponse.json({ success: true, message: 'Dépôt rejeté' });
    }

    if (transaction.type === 'withdrawal') {
      await db.transaction(async (tx) => {
        await tx
          .update(wallets)
          .set({
            balance: sql`${wallets.balance} + ${transaction.amount}`,
          })
          .where(eq(wallets.userId, transaction.userId));

        await tx
          .update(walletTransactions)
          .set({ status: 'failed' })
          .where(eq(walletTransactions.id, transaction.id));
      });

      await logAdminAction({
        adminId: admin.id,
        action: 'Retrait rejeté',
        targetType: 'transaction',
        targetId: transaction.id,
        details: `${transaction.amount} FCFA remboursés`,
      });

      return NextResponse.json({ success: true, message: 'Retrait rejeté, fonds remboursés' });
    }
  }

  return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
}
