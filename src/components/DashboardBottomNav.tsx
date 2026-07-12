'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign, Users, Crown, Wallet } from "lucide-react";

const items = [
  { href: "/dashboard",         label: "Accueil",     icon: Home,       exact: true },
  { href: "/dashboard/earn",    label: "Gagner",      icon: DollarSign  },
  { href: "/dashboard/referral",label: "Parrainage",  icon: Users       },
  { href: "/dashboard/vip",     label: "VIP",         icon: Crown       },
  { href: "/dashboard/withdrawals", label: "Retrait", icon: Wallet      },
];

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto max-w-md grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-accent" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
