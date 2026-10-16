# Cloud Services Setup Guide
## Complete Step-by-Step Configuration for All Services

**Last Updated:** 2026-10-16

---

## Overview

This guide walks you through setting up all cloud services needed for Civet:

1. **Vercel** - Dashboard deployment
2. **Railway** - API and Bug Loop deployment
3. **Cloudflare** - Widget CDN
4. **Supabase** - PostgreSQL database
5. **Upstash** - Redis cache
6. **Stripe** - Payment processing
7. **GitHub Actions** - CI/CD secrets

**Estimated Setup Time:** 60-90 minutes

---

## 1. Vercel Setup (Dashboard)

### Step 1.1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub account

### Step 1.2: Import Dashboard Project

1. Click "Add New..." → "Project"
2. Import `ramarit/civet` repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/dashboard`
   - **Build Command:** `cd ../.. && pnpm install && pnpm build --filter=dashboard`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

### Step 1.3: Configure Environment Variables

Add these in Vercel project settings → Environment Variables:

```env
# Database
DATABASE_URL=<your-supabase-connection-string>

# NextAuth
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# API
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api

# OAuth (optional)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

### Step 1.4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your deployed URL
4. **Save URLs:**
   - Production: `https://civet-XXXXX.vercel.app`
   - Project ID: Found in Settings → General

### Step 1.5: Get Vercel Tokens for CI/CD

1. Go to https://vercel.com/account/tokens
2. Create new token named "GitHub Actions"
3. Save token (you'll need it for GitHub secrets)
4. Get Org ID and Project ID from project settings

---

## 2. Railway Setup (API & Bug Loop)

### Step 2.1: Create Railway Account

1. Go to https://railway.app/
2. Sign up with GitHub account
3. Authorize Railway

### Step 2.2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect `ramarit/civet` repository

### Step 2.3: Set Up API Service

1. Click "Add Service" → "GitHub Repo"
2. Configure:
   - **Name:** `civet-api`
   - **Root Directory:** `apps/api`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `node dist/index.js`

### Step 2.4: Add PostgreSQL Database

1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically provision
3. Note the connection variables (automatically injected)

### Step 2.5: Configure API Environment Variables

```env
# Auto-injected by Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Add these manually
NODE_ENV=production
PORT=8000

# AI Providers
ANTHROPIC_API_KEY=<your-anthropic-key>
OPENAI_API_KEY=<your-openai-key>
DEEPL_API_KEY=<your-deepl-key>

# JWT
JWT_SECRET=<generate with: openssl rand -base64 32>

# Redis
REDIS_URL=<your-upstash-redis-url>

# Stripe
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# CORS
CORS_ORIGIN=https://your-dashboard.vercel.app
```

### Step 2.6: Set Up Bug Loop Service

1. Click "Add Service" → "GitHub Repo"
2. Configure:
   - **Name:** `civet-bug-loop`
   - **Root Directory:** `apps/bug-loop`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `node dist/index.js`

### Step 2.7: Configure Bug Loop Environment Variables

```env
# Database (shared with API)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# AI
ANTHROPIC_API_KEY=<your-anthropic-key>

# GitHub
GITHUB_TOKEN=<your-github-token>
GITHUB_REPO=ramarit/civet

# Email (optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-api-key>
SMTP_FROM=noreply@civet.ai

# Application
NODE_ENV=production
PORT=3002
```

### Step 2.8: Deploy Services

1. Both services will auto-deploy
2. **Save URLs:**
   - API: `https://civet-api.railway.app`
   - Bug Loop: `https://civet-bug-loop.railway.app`

### Step 2.9: Run Database Migrations

1. Go to API service
2. Click "Settings" → "Service"
3. Add deployment command:
   ```bash
   pnpm install && pnpm build && node -e "require('./dist/db/migrate.js')"
   ```

Or manually via Railway CLI:
```bash
railway link
railway run psql $DATABASE_URL -f apps/api/src/db/schema.sql
```

### Step 2.10: Get Railway Token for CI/CD

1. Go to https://railway.app/account/tokens
2. Create new token
3. Save for GitHub secrets

---

## 3. Cloudflare Setup (Widget CDN)

### Step 3.1: Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for free account
3. Verify email

### Step 3.2: Create Pages Project

1. Go to "Pages" in sidebar
2. Click "Create a project"
3. Connect GitHub: `ramarit/civet`
4. Configure build:
   - **Project Name:** `civet-widget`
   - **Production branch:** `main`
   - **Build command:** `cd packages/widget-sdk && npm install && npm run build`
   - **Build output directory:** `packages/widget-sdk/dist`

### Step 3.3: Configure Custom Domain (Optional)

1. Go to Pages project → Custom domains
2. Add: `cdn.civet.ai` (or your domain)
3. Update DNS as instructed

### Step 3.4: Get Cloudflare Tokens

1. Go to "My Profile" → "API Tokens"
2. Create token with template "Edit Cloudflare Workers"
3. Permissions needed:
   - Account - Cloudflare Pages - Edit
4. Save API token and Account ID

### Step 3.5: Update Widget URLs

After deployment, update your widget integration code:

```html
<script>
(function(w,d,s){
  w.civet=w.civet||{};
  var script=d.createElement(s);
  script.async=true;
  script.src='https://civet-widget.pages.dev/civet.js'; // or your custom domain
  script.setAttribute('data-project','PROJECT_ID');
  d.head.appendChild(script);
})(window,document,'script');
</script>
```

---

## 4. Supabase Setup (PostgreSQL)

### Step 4.1: Create Supabase Account

1. Go to https://supabase.com/
2. Sign up with GitHub
3. Create new organization

### Step 4.2: Create New Project

1. Click "New Project"
2. Configure:
   - **Name:** `civet-production`
   - **Database Password:** (generate strong password, save it!)
   - **Region:** Choose closest to your users
   - **Plan:** Free tier to start

3. Wait for project to initialize (2-3 minutes)

### Step 4.3: Get Connection String

1. Go to Project Settings → Database
2. Copy connection string under "Connection string"
3. Replace `[YOUR-PASSWORD]` with your database password
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Step 4.4: Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New query"
3. Copy contents of `apps/api/src/db/schema.sql`
4. Paste and run

Or use CLI:
```bash
psql "postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres" -f apps/api/src/db/schema.sql
```

### Step 4.5: Enable Required Extensions

In SQL Editor, run:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Step 4.6: Configure Connection Pooling (Recommended)

1. Go to Database → Connection Pooling
2. Enable "Transaction" mode
3. Get pooler connection string
4. Use this for your apps (better for serverless)

### Step 4.7: Update Environment Variables

Update in Vercel, Railway, etc.:
```env
# Use connection pooler for production
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
```

---

## 5. Upstash Setup (Redis Cache)

### Step 5.1: Create Upstash Account

1. Go to https://upstash.com/
2. Sign up with GitHub or email
3. Verify email

### Step 5.2: Create Redis Database

1. Click "Create Database"
2. Configure:
   - **Name:** `civet-cache`
   - **Type:** Regional
   - **Region:** Choose closest to Railway deployment
   - **Plan:** Free tier (10K commands/day)

3. Click "Create"

### Step 5.3: Get Redis URL

1. Go to database details
2. Scroll to "REST API" section
3. Copy "UPSTASH_REDIS_REST_URL"
4. Also copy "UPSTASH_REDIS_REST_TOKEN"

### Step 5.4: Update Environment Variables

In Railway API and Bug Loop services:

```env
# Option 1: REST API (recommended for serverless)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-token>

# Option 2: Redis URL
REDIS_URL=redis://:your-password@xxxxx.upstash.io:6379
```

### Step 5.5: Test Connection

```bash
# Test Redis connection
redis-cli -u "redis://:your-password@xxxxx.upstash.io:6379" PING
```

---

## 6. Stripe Setup (Payments)

### Step 6.1: Create Stripe Account

1. Go to https://stripe.com/
2. Sign up
3. Complete business verification (can start with test mode)

### Step 6.2: Get API Keys

1. Go to Developers → API keys
2. Copy:
   - **Publishable key:** `pk_test_...` (for frontend)
   - **Secret key:** `sk_test_...` (for backend)

### Step 6.3: Create Products and Prices

1. Go to Products
2. Create products for each tier:

**Starter Tier:**
- Name: "Civet Starter"
- Price: $4.99/month per language
- Billing: Recurring, metered

**Professional Tier:**
- Name: "Civet Professional"
- Price: $3.99/month per language
- Billing: Recurring, metered

**Business Tier:**
- Name: "Civet Business"
- Price: $2.99/month per language
- Billing: Recurring, metered

**Agency Tier:**
- Name: "Civet Agency"
- Price: $99/month
- Billing: Recurring, flat

3. Copy Price IDs for each tier

### Step 6.4: Set Up Webhooks

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-api.railway.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Save webhook signing secret

### Step 6.5: Update Environment Variables

In Railway API service:
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_BUSINESS=price_xxxxx
STRIPE_PRICE_AGENCY=price_xxxxx
```

In Vercel Dashboard:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## 7. GitHub Actions Secrets

### Step 7.1: Navigate to Repository Settings

1. Go to https://github.com/ramarit/civet
2. Click "Settings" → "Secrets and variables" → "Actions"

### Step 7.2: Add Repository Secrets

Click "New repository secret" for each:

**Vercel:**
```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID_DASHBOARD=<dashboard-project-id>
```

**Railway:**
```
RAILWAY_TOKEN=<your-railway-token>
```

**Cloudflare:**
```
CLOUDFLARE_API_TOKEN=<your-api-token>
CLOUDFLARE_ACCOUNT_ID=<your-account-id>
```

**Sentry (Optional):**
```
SENTRY_AUTH_TOKEN=<your-sentry-token>
SENTRY_ORG=<your-org-name>
```

**Slack (Optional):**
```
SLACK_WEBHOOK=<your-slack-webhook-url>
```

**Database:**
```
STAGING_DATABASE_URL=<supabase-staging-url>
PRODUCTION_DATABASE_URL=<supabase-production-url>
```

### Step 7.3: Test Deployment

1. Make a small change to code
2. Commit and push to `staging` branch:
   ```bash
   git checkout -b staging
   git push origin staging
   ```
3. Check GitHub Actions tab
4. Verify deployment to staging

---

## 8. Additional Configurations

### 8.1: OAuth Providers

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-dashboard.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret

**GitHub OAuth:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Configure:
   - **Homepage URL:** `https://your-dashboard.vercel.app`
   - **Callback URL:** `https://your-dashboard.vercel.app/api/auth/callback/github`
4. Copy Client ID and Secret

### 8.2: Email Service (SendGrid)

1. Go to https://sendgrid.com/
2. Sign up for free account
3. Create API key
4. Verify sender email
5. Add to environment variables

### 8.3: Monitoring (Sentry)

1. Go to https://sentry.io/
2. Create new project (Next.js, Node.js)
3. Copy DSN
4. Add to environment variables

---

## 9. Final Verification Checklist

### Environment Variables Set

- [ ] Vercel dashboard configured
- [ ] Railway API configured
- [ ] Railway Bug Loop configured
- [ ] Cloudflare Pages configured
- [ ] All services have DATABASE_URL
- [ ] All services have REDIS_URL
- [ ] API has Stripe keys
- [ ] Dashboard has NextAuth configured
- [ ] GitHub Actions secrets added

### Services Running

- [ ] Vercel dashboard deployed and accessible
- [ ] Railway API deployed and health check passes
- [ ] Railway Bug Loop deployed
- [ ] Cloudflare widget CDN serving files
- [ ] Supabase database accessible
- [ ] Upstash Redis accessible

### Integrations Working

- [ ] Dashboard can connect to API
- [ ] API can connect to database
- [ ] API can connect to Redis
- [ ] Widget can fetch translations
- [ ] OAuth login works (if configured)
- [ ] Stripe webhooks receiving events (test mode)

### CI/CD Pipeline

- [ ] Push to staging triggers deploy
- [ ] Push to main triggers production deploy
- [ ] Tests run on every PR
- [ ] Build artifacts are created

---

## 10. Test Your Setup

### Test API Health

```bash
curl https://your-api.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-10-16T...",
  "database": "connected",
  "redis": "connected"
}
```

### Test Dashboard

1. Visit `https://your-dashboard.vercel.app`
2. Register new account
3. Create test project
4. Add test translation

### Test Widget

Create `test.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Civet Test</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a test page.</p>

  <script>
  (function(w,d,s){
    w.civet=w.civet||{};
    var script=d.createElement(s);
    script.async=true;
    script.src='https://civet-widget.pages.dev/civet.js';
    script.setAttribute('data-project','YOUR_PROJECT_ID');
    d.head.appendChild(script);
  })(window,document,'script');
  </script>
</body>
</html>
```

Open in browser and verify translation works.

---

## Quick Reference

### Service URLs

```
Dashboard:    https://civet-xxxxx.vercel.app
API:          https://civet-api.railway.app
Bug Loop:     https://civet-bug-loop.railway.app
Widget CDN:   https://civet-widget.pages.dev
Database:     db.xxxxx.supabase.co
Redis:        xxxxx.upstash.io
```

### Environment Files

```
Root:         .env.local
Dashboard:    apps/dashboard/.env.local
API:          apps/api/.env (set in Railway)
Bug Loop:     apps/bug-loop/.env (set in Railway)
```

### Common Commands

```bash
# Deploy to staging
git push origin staging

# Deploy to production
git push origin main

# View Railway logs
railway logs -s civet-api

# Run database migrations
railway run psql $DATABASE_URL -f apps/api/src/db/schema.sql

# Test Redis
redis-cli -u $REDIS_URL PING
```

---

## Troubleshooting

### Vercel Build Fails

- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure `pnpm` is being used
- Check that root directory is correct

### Railway Deploy Fails

- Check service logs
- Verify Dockerfile is present
- Check environment variables
- Ensure database is accessible

### Database Connection Issues

- Verify connection string format
- Check if IP is whitelisted (Supabase)
- Test connection with `psql` directly
- Check if database exists

### Widget Not Loading

- Check browser console for errors
- Verify CDN URL is correct
- Check CORS settings on API
- Verify project ID is valid

---

## Cost Summary

With free tiers:

| Service | Free Tier | Paid Starts At |
|---------|-----------|----------------|
| Vercel | Hobby (free) | $20/month |
| Railway | $5 free credit | $5/month |
| Cloudflare | Free | $5/month |
| Supabase | 500MB DB | $25/month |
| Upstash | 10K commands/day | $0.20/100K |
| Stripe | Free | 2.9% + 30¢ per transaction |

**Total monthly cost to start: ~$0-10** (within free tiers)

---

## Next Steps

1. **Complete all setups above**
2. **Test thoroughly**
3. **Set up monitoring and alerts**
4. **Configure custom domains**
5. **Launch beta!**

---

**You're ready to deploy!** 🚀
