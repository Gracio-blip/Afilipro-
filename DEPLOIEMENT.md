# 🚀 Guide de déploiement AfiliPro

## Option 1 — Railway (Recommandé, le plus simple)

### Étapes :
1. Crée un compte sur https://railway.app
2. Clique **New Project → Deploy from GitHub**
3. Connecte ton repo GitHub (push ton code d'abord)
4. Railway détecte automatiquement Next.js
5. Ajoute un service **PostgreSQL** dans le même projet
6. Dans **Variables**, ajoute :
   ```
   DATABASE_URL=<copier depuis Railway PostgreSQL>
   AUTH_SECRET=<générer avec : openssl rand -base64 32>
   NEXT_PUBLIC_APP_URL=https://ton-app.railway.app
   TELEGRAM_BOT_TOKEN=8735161135:AAHt2w069NoMVcWFNttRuodjvHCnXar1MZY
   TELEGRAM_CHAT_ID=8735161135
   ```
7. Dans **Settings → Deploy**, ajoute la commande de build :
   ```
   npm run build
   ```
8. Après déploiement, ouvre le terminal Railway et exécute :
   ```
   psql $DATABASE_URL -f scripts/schema-prod.sql
   psql $DATABASE_URL -f scripts/seed-prod.sql
   ```

**Coût** : ~$5/mois (plan Hobby) ou gratuit avec limitations.

---

## Option 2 — Vercel + Neon (Gratuit)

### Base de données : Neon (PostgreSQL gratuit)
1. Crée un compte sur https://neon.tech
2. Crée un projet → copie la connection string
3. Exécute les scripts SQL dans la console Neon :
   - Colle le contenu de `scripts/schema-prod.sql`
   - Colle le contenu de `scripts/seed-prod.sql`

### Application : Vercel
1. Crée un compte sur https://vercel.com
2. Importe ton repo GitHub
3. Dans **Environment Variables**, ajoute :
   ```
   DATABASE_URL=postgresql://... (depuis Neon)
   AUTH_SECRET=<openssl rand -base64 32>
   NEXT_PUBLIC_APP_URL=https://ton-app.vercel.app
   TELEGRAM_BOT_TOKEN=8735161135:AAHt2w069NoMVcWFNttRuodjvHCnXar1MZY
   TELEGRAM_CHAT_ID=8735161135
   ```
4. Clique **Deploy** → c'est en ligne !

**Coût** : Gratuit pour commencer.

---

## Option 3 — VPS (Ubuntu 22.04)

```bash
# 1. Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres createdb afilipro
sudo -u postgres psql -c "CREATE USER afilipro WITH PASSWORD 'MOTDEPASSE';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE afilipro TO afilipro;"

# 3. Créer le schéma
sudo -u postgres psql -d afilipro -f scripts/schema-prod.sql
sudo -u postgres psql -d afilipro -f scripts/seed-prod.sql

# 4. Cloner et configurer
git clone https://github.com/TON_REPO/afilipro.git
cd afilipro
cp .env.production.example .env.local
nano .env.local  # remplir les variables

# 5. Build
npm install
npm run build

# 6. Installer PM2 et démarrer
npm install -g pm2
pm2 start npm --name "afilipro" -- start
pm2 save
pm2 startup

# 7. Nginx (reverse proxy)
sudo apt install nginx -y
# Configurer /etc/nginx/sites-available/afilipro
```

---

## Pousser le code sur GitHub

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "AfiliPro - version initiale"
git remote add origin https://github.com/TON_COMPTE/afilipro.git
git push -u origin main
```

---

## Domaine personnalisé

1. Achète un domaine sur Namecheap, OVH, ou Gandi (~$10/an)
2. Dans Vercel/Railway : Settings → Domains → Add domain
3. Configure les DNS chez ton registrar (enregistrement A ou CNAME)
4. SSL automatique (Let's Encrypt inclus)

---

## Variables d'environnement requises

| Variable | Description | Obligatoire |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `AUTH_SECRET` | Secret JWT NextAuth | ✅ |
| `NEXT_PUBLIC_APP_URL` | URL publique du site | ✅ |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram | ✅ |
| `TELEGRAM_CHAT_ID` | ID du chat/canal admin | ✅ |

---

## Après déploiement — Créer le compte admin

1. Inscris-toi normalement sur le site
2. Dans la DB, exécute :
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';
   ```
3. Accède à `/admin` pour valider les dépôts/retraits
