import { DashboardBottomNav } from '@/components/DashboardBottomNav';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Sidebar } from '@/components/Sidebar';
import { WalletProvider } from '@/components/WalletProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#f6f7fb]">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <DashboardHeader />
          <main className="flex-1 pb-28 pt-4">
            {children}
          </main>
        </div>
        <DashboardBottomNav />
      </div>
    </WalletProvider>
  );
}
