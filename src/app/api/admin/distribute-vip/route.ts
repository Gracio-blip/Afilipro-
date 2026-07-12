import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin';
import { distributeExpiredVipRewards } from '@/lib/vip';

export async function POST(request: Request) {
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

  try {
    const results = await distributeExpiredVipRewards();
    const totalPaid = results.reduce((s, r) => s + r.amount, 0);
    return NextResponse.json({
      success: true,
      results,
      message: `${results.length} abonnements VIP arrivés à échéance. ${totalPaid.toLocaleString("fr-FR")} FCFA versés au total.`,
    });
  } catch (error) {
    console.error('Erreur distribution VIP:', error);
    return NextResponse.json({ error: 'Erreur lors de la distribution' }, { status: 500 });
  }
}
