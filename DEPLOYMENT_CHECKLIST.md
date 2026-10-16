# Civet Deployment Checklist
## Your Step-by-Step Launch Guide

**GitHub Repository:** https://github.com/ramarit/civet
**Branch:** `civet-saas-platform`
**Status:** ✅ Code pushed, ready for deployment

---

## Quick Links

| Service | Sign Up URL | Purpose |
|---------|-------------|---------|
| **Vercel** | https://vercel.com/signup | Dashboard hosting |
| **Railway** | https://railway.app/ | API + Bug Loop hosting |
| **Cloudflare** | https://dash.cloudflare.com/sign-up | Widget CDN |
| **Supabase** | https://supabase.com/ | PostgreSQL database |
| **Upstash** | https://upstash.com/ | Redis cache |
| **Stripe** | https://stripe.com/ | Payment processing |

---

## Phase 1: Core Infrastructure (30 minutes)

### ☐ 1. Set Up Database (Supabase)

**Why first?** All services need the database connection string.

```bash
# Steps:
1. Sign up at https://supabase.com/
2. Create project: "civet-production"
3. Save database password
4. Get connection string
5. Run schema in SQL Editor (copy from apps/api/src/db/schema.sql)
```

**Save this:**
```
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### ☐ 2. Set Up Redis (Upstash)

**Why second?** API needs Redis for caching.

```bash
# Steps:
1. Sign up at https://upstash.com/
2. Create database: "civet-cache"
3. Copy REST URL and token
```

**Save this:**
```
REDIS_URL=redis://:password@xxxxx.upstash.io:6379
```

---

## Phase 2: Backend Services (30 minutes)

### ☐ 3. Set Up API (Railway)

```bash
# Steps:
1. Sign up at https://railway.app/
2. Create new project from GitHub repo
3. Add service: apps/api
4. Add these environment variables:
```

**Required Environment Variables:**
```env
DATABASE_URL=<from Supabase>
REDIS_URL=<from Upstash>
NODE_ENV=production
PORT=8000

# Generate these:
JWT_SECRET=<run: openssl rand -base64 32>

# Add your API keys:
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
DEEPL_API_KEY=xxxxx

# Add later:
STRIPE_SECRET_KEY=<from Stripe>
```

**After deployment, save this:**
```
API_URL=https://civet-api.railway.app
```

### ☐ 4. Set Up Bug Loop (Railway)

```bash
# In same Railway project:
1. Add another service: apps/bug-loop
2. Add these environment variables:
```

**Required Environment Variables:**
```env
DATABASE_URL=<same as API>
ANTHROPIC_API_KEY=<same as API>
GITHUB_TOKEN=<create at https://github.com/settings/tokens>
GITHUB_REPO=ramarit/civet
NODE_ENV=production
PORT=3002
```

---

## Phase 3: Frontend (20 minutes)

### ☐ 5. Set Up Dashboard (Vercel)

```bash
# Steps:
1. Sign up at https://vercel.com/signup
2. Import project from GitHub
3. Configure:
   - Root Directory: apps/dashboard
   - Framework: Next.js
4. Add environment variables:
```

**Required Environment Variables:**
```env
DATABASE_URL=<from Supabase>
NEXT_PUBLIC_API_URL=<from Railway API>

# Generate these:
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Optional OAuth:
GOOGLE_CLIENT_ID=<from Google Console>
GOOGLE_CLIENT_SECRET=<from Google Console>
GITHUB_CLIENT_ID=<from GitHub OAuth Apps>
GITHUB_CLIENT_SECRET=<from GitHub OAuth Apps>
```

**After deployment, save this:**
```
DASHBOARD_URL=https://civet-xxxxx.vercel.app
```

### ☐ 6. Set Up Widget CDN (Cloudflare)

```bash
# Steps:
1. Sign up at https://dash.cloudflare.com/sign-up
2. Create Pages project
3. Connect GitHub repo
4. Configure:
   - Project: civet-widget
   - Build command: cd packages/widget-sdk && npm install && npm run build
   - Build output: packages/widget-sdk/dist
```

**After deployment, save this:**
```
WIDGET_CDN=https://civet-widget.pages.dev
```

---

## Phase 4: Payments (10 minutes)

### ☐ 7. Set Up Stripe

```bash
# Steps:
1. Sign up at https://stripe.com/
2. Go to Developers → API keys
3. Copy test keys
4. Create products for each tier (see pricing doc)
5. Set up webhook endpoint
```

**Save these:**
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Add to Railway API service.**

---

## Phase 5: CI/CD (10 minutes)

### ☐ 8. Configure GitHub Actions Secrets

```bash
# Go to: https://github.com/ramarit/civet/settings/secrets/actions
# Add these secrets:
```

**Required Secrets:**
```
VERCEL_TOKEN=<from vercel.com/account/tokens>
VERCEL_ORG_ID=<from Vercel project settings>
VERCEL_PROJECT_ID_DASHBOARD=<from Vercel project settings>

RAILWAY_TOKEN=<from railway.app/account/tokens>

CLOUDFLARE_API_TOKEN=<from Cloudflare API tokens>
CLOUDFLARE_ACCOUNT_ID=<from Cloudflare dashboard>

STAGING_DATABASE_URL=<Supabase connection string>
PRODUCTION_DATABASE_URL=<Supabase connection string>
```

**Optional:**
```
SLACK_WEBHOOK=<for deployment notifications>
SENTRY_AUTH_TOKEN=<for error tracking>
```

---

## Phase 6: Testing (10 minutes)

### ☐ 9. Test API

```bash
# Test health endpoint
curl https://your-api.railway.app/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### ☐ 10. Test Dashboard

```bash
# Steps:
1. Visit https://your-dashboard.vercel.app
2. Click "Register"
3. Create account
4. Create test project
5. Try adding a translation
```

### ☐ 11. Test Widget

```bash
# Create test.html:
cat > test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Civet Test</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a test.</p>
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
EOF

# Open in browser and check console
```

### ☐ 12. Test CI/CD

```bash
# Make a small change and push to staging:
echo "# Test" >> README.md
git add README.md
git commit -m "test: CI/CD pipeline"
git push origin staging

# Check GitHub Actions tab
# Verify deployment to Railway/Vercel
```

---

## Quick Setup Script

Run this to check prerequisites:

```bash
#!/bin/bash

echo "🔍 Checking prerequisites..."

# Check if git is configured
if git remote -v | grep -q "ramarit/civet"; then
  echo "✅ Git repository connected"
else
  echo "❌ Git repository not connected"
fi

# Check if pnpm is installed
if command -v pnpm &> /dev/null; then
  echo "✅ pnpm installed: $(pnpm -v)"
else
  echo "❌ pnpm not installed"
fi

# Check if Node.js is correct version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -ge 20 ]; then
  echo "✅ Node.js version: $(node -v)"
else
  echo "❌ Node.js 20+ required, current: $(node -v)"
fi

# Check if .env files exist
if [ -f ".env.local" ]; then
  echo "✅ Root .env.local exists"
else
  echo "⚠️  Root .env.local missing (optional)"
fi

echo ""
echo "📋 Next steps:"
echo "1. Visit https://supabase.com/ to create database"
echo "2. Visit https://upstash.com/ to create Redis cache"
echo "3. Visit https://railway.app/ to deploy API"
echo "4. Visit https://vercel.com/ to deploy dashboard"
echo "5. Visit https://dash.cloudflare.com/ to deploy widget"
echo ""
echo "📖 Full guide: docs/CLOUD_SERVICES_SETUP.md"
```

---

## Troubleshooting

### Build fails on Vercel
```bash
# Check:
1. Environment variables are set
2. Root directory is "apps/dashboard"
3. Build command includes pnpm install
```

### API not accessible on Railway
```bash
# Check:
1. Service logs for errors
2. Environment variables are set
3. Database connection string is correct
4. Port is set to 8000
```

### Widget not loading
```bash
# Check browser console for:
1. CORS errors → Fix API CORS_ORIGIN
2. 404 errors → Check CDN URL
3. Project ID invalid → Check in dashboard
```

---

## Cost Tracking

**Free tier limits:**

| Service | Free Limit | Current Usage |
|---------|-----------|---------------|
| Vercel | 100GB bandwidth | ☐ Monitor |
| Railway | $5 credit | ☐ Monitor |
| Supabase | 500MB DB, 2GB bandwidth | ☐ Monitor |
| Upstash | 10K commands/day | ☐ Monitor |
| Cloudflare | Unlimited | ☐ N/A |
| Stripe | No monthly fee | ☐ N/A |

**Set up billing alerts in each service!**

---

## Environment Variables Master List

### Dashboard (Vercel)
```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### API (Railway)
```env
DATABASE_URL=
REDIS_URL=
NODE_ENV=production
PORT=8000
JWT_SECRET=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
DEEPL_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=
```

### Bug Loop (Railway)
```env
DATABASE_URL=
ANTHROPIC_API_KEY=
GITHUB_TOKEN=
GITHUB_REPO=ramarit/civet
NODE_ENV=production
PORT=3002
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

### GitHub Actions Secrets
```
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID_DASHBOARD=
RAILWAY_TOKEN=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
STAGING_DATABASE_URL=
PRODUCTION_DATABASE_URL=
```

---

## Success Checklist

- [ ] Supabase database created and schema loaded
- [ ] Upstash Redis created
- [ ] Railway API deployed and health check passes
- [ ] Railway Bug Loop deployed
- [ ] Vercel dashboard deployed and accessible
- [ ] Cloudflare widget CDN serving files
- [ ] Can register account on dashboard
- [ ] Can create project in dashboard
- [ ] Widget loads on test page
- [ ] GitHub Actions secrets configured
- [ ] Stripe test mode configured

---

## Your URLs (Fill these in as you deploy)

```
Dashboard:     https://_____________________.vercel.app
API:           https://_____________________.railway.app
Bug Loop:      https://_____________________.railway.app
Widget CDN:    https://_____________________.pages.dev
Database:      db._____________________.supabase.co
Redis:         _____________________.upstash.io

GitHub Repo:   https://github.com/ramarit/civet
```

---

## Support Resources

- **Documentation:** `/Users/ryanamarit/civet/docs/`
- **Setup Guide:** `docs/CLOUD_SERVICES_SETUP.md`
- **Architecture:** `ARCHITECTURE.md`
- **Pricing:** `docs/PRICING_ANALYSIS.md`

---

**Estimated total setup time: 2 hours**

**Ready to launch!** 🚀

Follow the phases in order, and you'll have a fully deployed platform ready for beta testing.
