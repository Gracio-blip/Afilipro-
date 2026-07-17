-- ============================================================
-- AFILIPRO — Schéma complet production PostgreSQL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by_id UUID,
  is_active BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0,
  task_balance NUMERIC(12,2) DEFAULT 0,
  invest_balance NUMERIC(12,2) DEFAULT 0,
  affiliate_earnings NUMERIC(12,2) DEFAULT 0,
  task_earnings NUMERIC(12,2) DEFAULT 0,
  total_deposits NUMERIC(12,2) DEFAULT 0,
  total_withdrawals NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  method TEXT,
  phone TEXT,
  description TEXT,
  admin_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward NUMERIC(12,2) NOT NULL,
  type TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  task_id UUID REFERENCES tasks(id) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  investment_amount NUMERIC(12,2) NOT NULL,
  daily_reward NUMERIC(12,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  total_return NUMERIC(12,2),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  plan_id UUID REFERENCES investment_plans(id) NOT NULL,
  status TEXT DEFAULT 'active',
  total_earned NUMERIC(12,2) DEFAULT 0,
  days_claimed INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  last_claimed_at TIMESTAMP,
  ends_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  reward INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
