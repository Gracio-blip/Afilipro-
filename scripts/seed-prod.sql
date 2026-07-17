-- ============================================================
-- AFILIPRO — Script de seed production
-- À exécuter UNE SEULE FOIS après création de la base
-- ============================================================

-- Plans d'investissement
INSERT INTO investment_plans (id, name, investment_amount, daily_reward, duration_days, total_return, is_active) VALUES
  (gen_random_uuid(), 'Bronze', 2500,  600,  75, 45000,  true),
  (gen_random_uuid(), 'Silver', 4500,  1200, 75, 90000,  true),
  (gen_random_uuid(), 'Gold',   7000,  1600, 75, 120000, true),
  (gen_random_uuid(), 'VIP 1',  5000,  1500, 60, 90000,  true),
  (gen_random_uuid(), 'VIP 2',  10000, 3000, 60, 180000, true),
  (gen_random_uuid(), 'VIP 3',  15000, 4500, 60, 270000, true),
  (gen_random_uuid(), 'VIP 4',  20000, 6000, 60, 360000, true)
ON CONFLICT DO NOTHING;

-- Tâches
INSERT INTO tasks (id, title, description, reward, type, is_active) VALUES
  (gen_random_uuid(), 'Quiz quotidien',     '3 questions · 50 FCFA chacune · 150 FCFA si tout correct',  150, 'quiz',     true),
  (gen_random_uuid(), 'Canal Telegram',     'Rejoins le canal officiel et reste abonné',                   50, 'telegram', true),
  (gen_random_uuid(), 'Jeu des bouteilles', 'Trouve la bouteille cachant la boule · 100 FCFA si gagné',   100, 'bottle',   true)
ON CONFLICT DO NOTHING;
