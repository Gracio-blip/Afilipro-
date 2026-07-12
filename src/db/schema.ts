import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const transactionTypeEnum = pgEnum("wallet_transaction_type", [
  "welcome", "deposit", "withdrawal", "earning", "vip_purchase", "vip_daily",
  "admin_credit", "referral_bonus", "task_reward", "daily_login",
]);

export const transactionStatusEnum = pgEnum("wallet_transaction_status", [
  "pending", "approved", "paid", "failed", "rejected", "completed",
]);

export const vipStatusEnum = pgEnum("vip_subscription_status", [
  "active", "expired", "cancelled",
]);

export const taskTypeEnum = pgEnum("earn_task_type", [
  "quiz", "telegram", "tiktok_follow", "youtube_subscribe", "instagram_follow",
  "survey", "external_link", "custom",
]);

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    referralCode: varchar("referral_code", { length: 20 }),
    referrerId: integer("referrer_id"),
    status: varchar("status", { length: 20 }).notNull().default("pending_activation"),
    isVip: boolean("is_vip").notNull().default(false),
    totalReferrals: integer("total_referrals").notNull().default(0),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    loginStreak: integer("login_streak").notNull().default(0),
    lastDailyQuizClaim: timestamp("last_daily_quiz_claim"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_referral_code_unique").on(table.referralCode),
    index("users_referrer_idx").on(table.referrerId),
  ],
);

// ─── Wallets ─────────────────────────────────────────────────────────────────

export const wallets = pgTable(
  "wallets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(0),
    taskEarnings: integer("task_earnings").notNull().default(0),
    referralEarnings: integer("referral_earnings").notNull().default(0),
    totalWithdrawn: integer("total_withdrawn").notNull().default(0),
    withdrawalCount: integer("withdrawal_count").notNull().default(0),
    currency: varchar("currency", { length: 10 }).notNull().default("FCFA"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("wallets_user_unique").on(table.userId)],
);

// ─── Auth sessions ───────────────────────────────────────────────────────────

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_unique").on(table.tokenHash),
    index("auth_sessions_user_idx").on(table.userId),
  ],
);

// ─── Login logs ──────────────────────────────────────────────────────────────

export const loginLogs = pgTable(
  "login_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 255 }),
    success: boolean("success").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("login_logs_user_idx").on(table.userId)],
);

// ─── Wallet transactions ─────────────────────────────────────────────────────

export const walletTransactions = pgTable(
  "wallet_transactions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull().default("pending"),
    amount: integer("amount").notNull(),
    paymentMethod: varchar("payment_method", { length: 40 }),
    phoneNumber: varchar("phone_number", { length: 30 }),
    reference: varchar("reference", { length: 80 }).notNull(),
    note: varchar("note", { length: 255 }),
    adminNote: varchar("admin_note", { length: 255 }),
    reviewedBy: integer("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("wallet_transactions_reference_unique").on(table.reference),
    index("wallet_transactions_user_idx").on(table.userId),
    index("wallet_transactions_status_idx").on(table.status),
    index("wallet_transactions_type_idx").on(table.type),
  ],
);

// ─── Earn tasks ──────────────────────────────────────────────────────────────

export const earnTasks = pgTable(
  "earn_tasks",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    description: text("description"),
    type: taskTypeEnum("type").notNull(),
    rewardAmount: integer("reward_amount").notNull(),
    targetUrl: varchar("target_url", { length: 500 }),
    instructions: text("instructions"),
    isActive: boolean("is_active").notNull().default(true),
    maxCompletions: integer("max_completions"),
    totalCompletions: integer("total_completions").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("earn_tasks_active_idx").on(table.isActive)],
);

// ─── Task completions ────────────────────────────────────────────────────────

export const taskCompletions = pgTable(
  "task_completions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    taskId: integer("task_id").notNull().references(() => earnTasks.id, { onDelete: "cascade" }),
    rewardAmount: integer("reward_amount").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("task_completions_user_task_unique").on(table.userId, table.taskId),
    index("task_completions_user_idx").on(table.userId),
  ],
);

// ─── Referral earnings ───────────────────────────────────────────────────────

export const referralEarnings = pgTable(
  "referral_earnings",
  {
    id: serial("id").primaryKey(),
    referrerId: integer("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    referredId: integer("referred_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    type: varchar("type", { length: 40 }).notNull().default("activation"),
    transactionId: integer("transaction_id").references(() => walletTransactions.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("referral_earnings_referrer_referred_unique").on(table.referrerId, table.referredId),
    index("referral_earnings_referrer_idx").on(table.referrerId),
  ],
);

// ─── VIP subscriptions ───────────────────────────────────────────────────────

export const vipSubscriptions = pgTable(
  "vip_subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: integer("level").notNull(),
    dailyReward: integer("daily_reward").notNull(),
    totalDays: integer("total_days").notNull().default(75),
    daysPaid: integer("days_paid").notNull().default(0),
    cost: integer("cost").notNull(),
    status: vipStatusEnum("status").notNull().default("active"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    lastPaidDate: timestamp("last_paid_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("vip_subscriptions_user_idx").on(table.userId),
    index("vip_subscriptions_status_idx").on(table.status),
  ],
);

// ─── Daily earnings ───────────────────────────────────────────────────────────

export const dailyEarnings = pgTable(
  "daily_earnings",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: integer("subscription_id").notNull().references(() => vipSubscriptions.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    amount: integer("amount").notNull(),
    transactionId: integer("transaction_id").references(() => walletTransactions.id),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("daily_earnings_sub_day_unique").on(table.subscriptionId, table.dayNumber),
    index("daily_earnings_user_idx").on(table.userId),
  ],
);

// ─── Admins ──────────────────────────────────────────────────────────────────

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }),
    email: varchar("email", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("admins_user_unique").on(table.userId),
    uniqueIndex("admins_email_unique").on(table.email),
  ],
);

// ─── Admin logs ───────────────────────────────────────────────────────────────

export const adminLogs = pgTable(
  "admin_logs",
  {
    id: serial("id").primaryKey(),
    adminId: integer("admin_id").references(() => admins.id, { onDelete: "set null" }),
    action: varchar("action", { length: 80 }).notNull(),
    targetType: varchar("target_type", { length: 40 }),
    targetId: integer("target_id"),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("admin_logs_admin_idx").on(table.adminId)],
);

// ─── Announcements ────────────────────────────────────────────────────────────

export const announcements = pgTable(
  "announcements",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 20 }).notNull().default("info"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: integer("created_by").references(() => admins.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("announcements_active_idx").on(table.isActive)],
);

// ─── Daily login bonuses ──────────────────────────────────────────────────────

export const dailyLoginBonuses = pgTable(
  "daily_login_bonuses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    streak: integer("streak").notNull().default(1),
    claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("daily_login_bonuses_user_idx").on(table.userId)],
);

// ─── Inferred types ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type EarnTask = typeof earnTasks.$inferSelect;
export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type ReferralEarning = typeof referralEarnings.$inferSelect;
export type VipSubscription = typeof vipSubscriptions.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type AdminLog = typeof adminLogs.$inferSelect;
