'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface WalletUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  referralCode: string | null;
  status: 'pending_activation' | 'active' | 'suspended';
  isVip: boolean;
  balance: number;
  vipLevel: number;
  withdrawalCount?: number;
  unspentDeposit?: number;
  withdrawableBalance?: number;
  createdAt: string;
}

export interface WalletTransaction {
  id: number;
  type: "welcome" | "deposit" | "withdrawal" | "earning" | "vip_purchase" | "vip_daily" | "admin_credit" | "referral_bonus" | "task_reward" | "daily_login";
  status: "pending" | "completed" | "failed" | "approved" | "paid" | "rejected";
  amount: number;
  paymentMethod: string | null;
  reference: string;
  note: string | null;
  createdAt: string;
}

interface WalletContextValue {
  user: WalletUser | null;
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<WalletUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("afilipro_user");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("afilipro_transactions");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("afilipro_user")) {
      return false; // Instant render !
    }
    return true;
  });
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("afilipro_token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("/api/auth/me", {
        headers,
        cache: "no-store",
      });

      if (response.status === 401) {
        // Fallback to localStorage user object if API or cookie is blocked
        const savedUser = typeof window !== "undefined" ? localStorage.getItem("afilipro_user") : null;
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser) as WalletUser;
            setUser(parsed);
            setTransactions([]);
            setLoading(false);
            return;
          } catch {
            // ignore
          }
        }

        router.replace("/auth");
        return;
      }

      const data = await response.json() as {
        user?: WalletUser;
        transactions?: WalletTransaction[];
        error?: string;
      };

      if (!response.ok || !data.user) {
        throw new Error(data.error || "Impossible de charger le compte.");
      }

      setUser(data.user);
      setTransactions(data.transactions ?? []);
      if (typeof window !== "undefined") {
        localStorage.setItem("afilipro_user", JSON.stringify(data.user));
        localStorage.setItem("afilipro_transactions", JSON.stringify(data.transactions ?? []));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ user, transactions, loading, error, refresh }), [user, transactions, loading, error, refresh]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
