# PROMPT COMPLET POUR GITHUB COPILOT — AfiliPro
# Copie tout ce fichier et colle-le dans GitHub Copilot Chat

Je veux que tu crées un projet Next.js 16 complet appelé AfiliPro et que tu le déploies sur Netlify avec Neon comme base de données.

---

## STACK

- Next.js 16.2.6 (App Router)
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + PostgreSQL (Neon)
- NextAuth v5 (JWT, Credentials)
- Framer Motion
- Lucide React
- Netlify (hébergement)
- Telegram Bot API (notifications)

---

## ÉTAPE 1 — Crée le projet Next.js

```bash
npx create-next-app@16.2.6 afilipro --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd afilipro
npm install next-auth@beta drizzle-orm pg bcryptjs framer-motion lucide-react @netlify/plugin-nextjs @auth/drizzle-adapter
npm install -D @types/bcryptjs @types/pg drizzle-kit
```

---

## ÉTAPE 2 — Crée ces fichiers EXACTEMENT

### `netlify.toml` (à la racine)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "standalone" };
export default nextConfig;
```

### `.env.local`
```
DATABASE_URL=postgresql://USER:PASS@HOST/DB?sslmode=require
AUTH_SECRET=IsEFQ4pfcCyaKya4+7SybQDVfu6nlyt83Y4iSmjyMZQ=
NEXT_PUBLIC_APP_URL=https://ton-site.netlify.app
TELEGRAM_BOT_TOKEN=8735161135:AAHt2w069NoMVcWFNttRuodjvHCnXar1MZY
TELEGRAM_CHAT_ID=8735161135
```

### `.gitignore`
```
node_modules/
.next/
.env
.env.local
*.log
```

---

## ÉTAPE 3 — Structure des dossiers à créer

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    login/page.tsx
    register/page.tsx
    admin/page.tsx
    ref/[code]/page.tsx
    api/
      health/route.ts
      auth/[...nextauth]/route.ts
      init-db/route.ts
    (dashboard)/
      layout.tsx
      dashboard/page.tsx
      deposit/page.tsx
      withdrawals/page.tsx
      investments/page.tsx
      missions/page.tsx
      referral/page.tsx
      referral/CopyButton.tsx
      spin/page.tsx
      spin/SpinWheel.tsx
      bottle/page.tsx
      bottle/BottleGame.tsx
      wallet/page.tsx
      history/page.tsx
      profile/page.tsx
      faq/page.tsx
      contact/page.tsx
      support/page.tsx
  components/
    afili/
      AppShell.tsx
      TopBar.tsx
      BottomTabs.tsx
      Drawer.tsx
      LiveFeed.tsx
  db/
    index.ts
    schema.ts
  lib/
    actions.ts
    auth.ts
    utils.ts
    app-data.ts
    telegram.ts
  proxy.ts
```

---

## ÉTAPE 4 — Contenu de chaque fichier

### `src/db/schema.ts`
```ts
import { pgTable, text, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(),
  referralCode: text("referral_code").unique(),
  referredById: uuid("referred_by_id"),
  isActive: boolean("is_active").default(false),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  taskBalance: decimal("task_balance", { precision: 12, scale: 2 }).default("0"),
  investBalance: decimal("invest_balance", { precision: 12, scale: 2 }).default("0"),
  affiliateEarnings: decimal("affiliate_earnings", { precision: 12, scale: 2 }).default("0"),
  taskEarnings: decimal("task_earnings", { precision: 12, scale: 2 }).default("0"),
  totalDeposits: decimal("total_deposits", { precision: 12, scale: 2 }).default("0"),
  totalWithdrawals: decimal("total_withdrawals", { precision: 12, scale: 2 }).default("0"),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  method: text("method"),
  phone: text("phone"),
  description: text("description"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  reward: decimal("reward", { precision: 12, scale: 2 }).notNull(),
  type: text("type").default("general"),
  isActive: boolean("is_active").default(true),
});

export const userTasks = pgTable("user_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const investmentPlans = pgTable("investment_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 12, scale: 2 }).notNull(),
  dailyReward: decimal("daily_reward", { precision: 12, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  totalReturn: decimal("total_return", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

export const userInvestments = pgTable("user_investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: uuid("plan_id").references(() => investmentPlans.id).notNull(),
  status: text("status").default("active"),
  totalEarned: decimal("total_earned", { precision: 12, scale: 2 }).default("0"),
  daysClaimed: integer("days_claimed").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  lastClaimedAt: timestamp("last_claimed_at"),
  endsAt: timestamp("ends_at"),
});

export const spinHistory = pgTable("spin_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  reward: integer("reward").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### `src/db/index.ts`
```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

### `src/lib/utils.ts`
```ts
export function formatMoney(amount: number): string {
  return `${Number(amount).toLocaleString("fr-FR")} FCFA`;
}
export function getMinWithdrawal(wallet: { totalWithdrawals?: string | number | null }): number {
  const count = Number(wallet.totalWithdrawals ?? 0);
  const mins = [1500, 3000, 6000, 12000, 24000, 48000, 96000];
  return mins[Math.min(count, mins.length - 1)];
}
export function formatGMT(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleTimeString("fr-FR", { timeZone: "Africa/Lome", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) + " GMT+0 (Lomé)";
}
```

### `src/lib/telegram.ts`
```ts
export async function sendTelegram(text: string): Promise<void> {
  const BOT = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT = process.env.TELEGRAM_CHAT_ID;
  if (!BOT || !CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT, text, parse_mode: "HTML" }),
    });
  } catch {}
}
export const fmtMoney = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
export const lomeTime = (d?: Date) => (d ?? new Date()).toLocaleString("fr-FR", { timeZone: "Africa/Lome", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " GMT+0";
```

### `src/lib/auth.ts`
```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.toLowerCase().trim();
        const password = credentials?.password as string;
        if (!email || !password) return null;
        const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = rows[0];
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name } as any;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) { if (user) { token.id = (user as any).id; token.name = user.name; } return token; },
    session({ session, token }) { if (token) { (session.user as any).id = token.id; } return session; },
  },
});
```

### `src/proxy.ts`
```ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const publicRoutes = ["/", "/login", "/register"];
  const isPublic = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/ref/");
  if (!isLoggedIn && !isPublic) return NextResponse.redirect(new URL("/login", nextUrl));
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register"))
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
```

### `src/app/api/auth/[...nextauth]/route.ts`
```ts
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

### `src/app/api/health/route.ts`
```ts
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ status: "ok" }); }
```

### `src/app/api/init-db/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || token !== process.env.AUTH_SECRET) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, email TEXT NOT NULL UNIQUE, phone TEXT, password TEXT NOT NULL, referral_code TEXT UNIQUE, referred_by_id UUID, is_active BOOLEAN DEFAULT false, role TEXT DEFAULT 'user', created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS wallets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, balance NUMERIC(12,2) DEFAULT 0, task_balance NUMERIC(12,2) DEFAULT 0, invest_balance NUMERIC(12,2) DEFAULT 0, affiliate_earnings NUMERIC(12,2) DEFAULT 0, task_earnings NUMERIC(12,2) DEFAULT 0, total_deposits NUMERIC(12,2) DEFAULT 0, total_withdrawals NUMERIC(12,2) DEFAULT 0);
      CREATE TABLE IF NOT EXISTS transactions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, type TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, status TEXT DEFAULT 'pending', method TEXT, phone TEXT, description TEXT, admin_note TEXT, created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT, reward NUMERIC(12,2) NOT NULL, type TEXT DEFAULT 'general', is_active BOOLEAN DEFAULT true);
      CREATE TABLE IF NOT EXISTS user_tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, task_id UUID REFERENCES tasks(id) NOT NULL, completed_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS investment_plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, investment_amount NUMERIC(12,2) NOT NULL, daily_reward NUMERIC(12,2) NOT NULL, duration_days INTEGER NOT NULL, total_return NUMERIC(12,2), is_active BOOLEAN DEFAULT true);
      CREATE TABLE IF NOT EXISTS user_investments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, plan_id UUID REFERENCES investment_plans(id) NOT NULL, status TEXT DEFAULT 'active', total_earned NUMERIC(12,2) DEFAULT 0, days_claimed INTEGER DEFAULT 0, started_at TIMESTAMP DEFAULT NOW(), last_claimed_at TIMESTAMP, ends_at TIMESTAMP);
      CREATE TABLE IF NOT EXISTS spin_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, reward INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW());
      INSERT INTO investment_plans (name, investment_amount, daily_reward, duration_days, total_return) VALUES ('Bronze',2500,600,75,45000),('Silver',4500,1200,75,90000),('Gold',7000,1600,75,120000),('VIP 1',5000,1500,60,90000),('VIP 2',10000,3000,60,180000),('VIP 3',15000,4500,60,270000),('VIP 4',20000,6000,60,360000) ON CONFLICT DO NOTHING;
      INSERT INTO tasks (title, description, reward, type) VALUES ('Quiz quotidien','3 questions 50 FCFA chacune',150,'quiz'),('Canal Telegram','Rejoins le canal officiel',50,'telegram'),('Jeu des bouteilles','Trouve la bouteille cachant la boule',100,'bottle'),('Lucky Spin','Tourne la roue',0,'spin') ON CONFLICT DO NOTHING;
    `);
    return NextResponse.json({ success: true, message: "Base de données initialisée !" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
```

---

## ÉTAPE 5 — Règles métier à implémenter dans lib/actions.ts

```
- Inscription: bcrypt hash password, génère referralCode unique, crée wallet vide
- Login: vérifie bcrypt, redirige vers /dashboard?success=1
- Dépôt min: 2500 FCFA, status=pending, envoie notif Telegram admin
- Retrait: progressif 1500>3000>6000>12000>24000 FCFA, déduit taskBalance, notif Telegram
- Activation: quand admin approuve dépôt -> isActive=true + bonus parrain 300 FCFA
- Parrainage: 300 FCFA au parrain au 1er dépôt validé du filleul
- Investissements: Bronze 2500/600/75j, Silver 4500/1200/75j, Gold 7000/1600/75j, VIP1 5000/1500/60j, VIP2 10000/3000/60j, VIP3 15000/4500/60j, VIP4 20000/6000/60j
- Gains invest: bloqués dans investBalance jusqu'à fin plan
- Quiz: 150 FCFA (3x50), Telegram: 50 FCFA, Bouteilles: 100 FCFA si gagné
- Lucky Spin: 3 tentatives/24h, compte actif requis, 0=60% 500=27% 800=13%
- Jeu bouteilles: 3 bouteilles animées, 1 boule, +100 FCFA si correct, illimité
- Notifications Telegram: dépôt soumis + retrait demandé avec tous les détails
- Heure: toujours Africa/Lome GMT+0
```

---

## ÉTAPE 6 — Design UI/UX (style AfiliPro)

```
- Fond: #F5F6FB
- Hero/Drawer: bg-[#0B1120] (dark navy)
- Logo: "Afili" en #0B2A4A + "Pro" en #F5B700
- Boutons: bg-[#0B1120] text-white rounded-2xl
- TopBar: hamburger noir + logo + badge solde beige + avatar
- BottomTabs: blanc arrondi, 5 onglets (Accueil/Gagner/Bouteille/Spin/VIP), icône amber si actif
- Drawer sombre: sections PRINCIPAL/PORTEFEUILLE/AIDE
- Cards: rounded-[20-24px] border bg-white shadow afili-card
- Live feed: défilement vertical animé framer-motion, temps réel GMT+0
- Mobile-first: max-w-[480px] centré
- Tâches accomplies: argent crédité instantanément dans balance + taskBalance + transaction DB
```

---

## ÉTAPE 7 — Push sur GitHub et Netlify

```bash
git init
git add .
git commit -m "AfiliPro - version complète"
git remote add origin https://github.com/Gracio-blip/afilipro.git
git branch -M main
git push -u origin main
```

Ensuite sur Netlify:
1. New site > Import from GitHub > sélectionner afilipro
2. Build: npm run build, Publish: .next
3. Variables d'environnement:
   - DATABASE_URL = (connection string Neon)
   - AUTH_SECRET = IsEFQ4pfcCyaKya4+7SybQDVfu6nlyt83Y4iSmjyMZQ=
   - NEXT_PUBLIC_APP_URL = https://afilipro.netlify.app
   - TELEGRAM_BOT_TOKEN = 8735161135:AAHt2w069NoMVcWFNttRuodjvHCnXar1MZY
   - TELEGRAM_CHAT_ID = 8735161135
4. Deploy
5. Après déploiement: GET https://afilipro.netlify.app/api/init-db?token=IsEFQ4pfcCyaKya4+7SybQDVfu6nlyt83Y4iSmjyMZQ=
6. Dans Neon SQL: UPDATE users SET role='admin', is_active=true WHERE email='ton@email.com';
```
