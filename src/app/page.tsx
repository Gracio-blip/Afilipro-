'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hasToken = localStorage.getItem('afilipro_token');
    const hasSavedUser = localStorage.getItem('afilipro_user');
    router.replace(hasToken || hasSavedUser ? '/dashboard' : '/auth');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );
}
