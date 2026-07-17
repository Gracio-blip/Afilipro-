/**
 * Script d'initialisation de la base de données en production.
 * À exécuter une seule fois après le premier déploiement.
 * Usage: npx tsx scripts/init-db.ts
 */
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    console.log("🔌 Connexion à la base de données...");

    // Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT, email TEXT NOT NULL UNIQUE, phone TEXT,
        password TEXT NOT NULL, referral_code TEXT UNIQUE,
        referred_by_id UUID, is_active BOOLEAN DEFAULT false,
        role TEXT DEFAULT 'user', created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        balance NUMERIC(12,2) DEFAULT 0, task_balance NUMERIC(12,2) DEFAULT 0,
        invest_balance NUMERIC(12,2) DEFAULT 0, affiliate_earnings NUMERIC(12,2) DEFAULT 0,
        task_earnings NUMERIC(12,2) DEFAULT 0, total_deposits NUMERIC(12,2) DEFAULT 0,
        total_withdrawals NUMERIC(12,2) DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        type TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL,
        status TEXT DEFAULT 'pending', method TEXT, phone TEXT,
        description TEXT, admin_note TEXT, created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL, description TEXT,
        reward NUMERIC(12,2) NOT NULL, type TEXT DEFAULT 'general',
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
        name TEXT NOT NULL, investment_amount NUMERIC(12,2) NOT NULL,
        daily_reward NUMERIC(12,2) NOT NULL, duration_days INTEGER NOT NULL,
        total_return NUMERIC(12,2), is_active BOOLEAN DEFAULT true
      );
      CREATE TABLE IF NOT EXISTS user_investments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        plan_id UUID REFERENCES investment_plans(id) NOT NULL,
        status TEXT DEFAULT 'active', total_earned NUMERIC(12,2) DEFAULT 0,
        days_claimed INTEGER DEFAULT 0, started_at TIMESTAMP DEFAULT NOW(),
        last_claimed_at TIMESTAMP, ends_at TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS spin_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        reward INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tables créées");

    // Seed plans
    await client.query(`
      INSERT INTO investment_plans (name, investment_amount, daily_reward, duration_days, total_return, is_active)
      VALUES
        ('Bronze', 2500,  600,  75, 45000,  true),
        ('Silver', 4500,  1200, 75, 90000,  true),
        ('Gold',   7000,  1600, 75, 120000, true),
        ('VIP 1',  5000,  1500, 60, 90000,  true),
        ('VIP 2',  10000, 3000, 60, 180000, true),
        ('VIP 3',  15000, 4500, 60, 270000, true),
        ('VIP 4',  20000, 6000, 60, 360000, true)
      ON CONFLICT DO NOTHING;
    `);
    console.log("✅ Plans d'investissement créés");

    // Seed tasks
    await client.query(`
      INSERT INTO tasks (title, description, reward, type, is_active) VALUES
        ('Quiz quotidien',     '3 questions · 50 FCFA chacune · 150 FCFA si tout correct', 150, 'quiz',     true),
        ('Canal Telegram',     'Rejoins le canal officiel et reste abonné',                  50, 'telegram', true),
        ('Jeu des bouteilles', 'Trouve la bouteille cachant la boule · 100 FCFA si gagné',  100, 'bottle',   true),
        ('Lucky Spin',         'Tourne la roue · Gain aléatoire',                             0, 'spin',     true)
      ON CONFLICT DO NOTHING;
    `);
    console.log("✅ Tâches créées");
    console.log("🎉 Base de données initialisée avec succès !");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error("❌ Erreur:", e.message); process.exit(1); });
