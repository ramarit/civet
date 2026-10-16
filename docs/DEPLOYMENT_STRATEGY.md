# Civet Deployment Strategy - Simplified

## Current Situation

- **Same GitHub repo** (ramarit/civet)
- **Existing Vercel project** (your old landing page)
- **Need:** Landing page + Dashboard in one deployment

---

## Recommended Architecture: Single Next.js App

### Why This is Best

✅ **Single deployment** - One Vercel project
✅ **Same domain** - No subdomains needed
✅ **Shared auth** - Login works everywhere
✅ **Simpler** - Less configuration
✅ **Faster** - No cross-domain issues

### Structure

```
Your Vercel App:
├── / → Landing page (public)
├── /pricing → Pricing (public)
├── /features → Features (public)
├── /login → Login (public)
├── /register → Register (public)
└── /dashboard → Dashboard (protected)
    ├── /dashboard/projects
    ├── /dashboard/translations
    └── /dashboard/settings
```

---

## Implementation Options

### Option A: Use Existing Root App (FASTEST)

Update your current root-level Next.js app:

```bash
# Current structure (keep this):
app/
  ├── (auth)/
  │   ├── login/
  │   └── register/
  ├── (dashboard)/
  │   └── ... (protected routes)
  ├── page.tsx → Landing page
  ├── pricing/page.tsx → Pricing page
  └── features/page.tsx → Features page

components/
lib/
public/
```

**Vercel Settings:**
- Root Directory: `./` (keep as-is)
- Build Command: `pnpm install && pnpm build`
- Framework: Next.js

**Just update your Vercel project settings and redeploy!**

### Option B: Move Everything to apps/dashboard (CLEANER)

Consolidate into the new apps/dashboard with landing pages:

```bash
apps/dashboard/
  ├── src/app/
  │   ├── (public)/
  │   │   ├── page.tsx → Landing
  │   │   ├── pricing/page.tsx
  │   │   └── features/page.tsx
  │   ├── (auth)/
  │   │   ├── login/page.tsx
  │   │   └── register/page.tsx
  │   └── (dashboard)/
  │       └── ... (protected)
```

**Vercel Settings:**
- Root Directory: `apps/dashboard`
- Build Command: `cd ../.. && pnpm install && pnpm build --filter=dashboard`
- Framework: Next.js

---

## What to Deploy Where

### Single Vercel Project (Recommended)

**Deploy to Vercel:**
- ✅ Landing page
- ✅ Dashboard
- ✅ Auth pages

**Deploy to Railway:**
- ✅ API (apps/api)
- ✅ Bug Loop (apps/bug-loop)

**Deploy to Cloudflare:**
- ✅ Widget SDK (packages/widget-sdk)

---

## Migration Steps

### Step 1: Choose Your Approach

**If you want FASTEST deployment:**
1. Keep root app structure
2. Add landing page content to `app/page.tsx`
3. Add pricing to `app/pricing/page.tsx`
4. Update Vercel → Redeploy
5. Done!

**If you want CLEANEST structure:**
1. Move landing pages to `apps/dashboard/src/app/(public)/`
2. Update Vercel root directory to `apps/dashboard`
3. Redeploy

### Step 2: Update Existing Vercel Project

```bash
# Go to https://vercel.com/dashboard
# Select your civet project
# Settings → General

# For Option A (Root app):
Root Directory: ./
Build Command: pnpm install && pnpm build
Framework Preset: Next.js

# For Option B (apps/dashboard):
Root Directory: apps/dashboard
Build Command: cd ../.. && pnpm install && pnpm build --filter=dashboard
Framework Preset: Next.js
```

### Step 3: Redeploy

Click "Deployments" → Latest → "..." → "Redeploy"

---

## Landing Page Requirements

Your landing page needs:

1. **Hero Section**
   - Headline: "Translate Your Website in Minutes"
   - Subheading: "AI-powered translation for 110+ languages"
   - CTA: "Start Free Trial"

2. **Features**
   - Multi-AI translation
   - SEO-friendly
   - Easy integration
   - Real-time updates

3. **Pricing**
   - Starter: $4.99/lang/mo
   - Professional: $3.99/lang/mo
   - Business: $2.99/lang/mo

4. **Social Proof**
   - Testimonials
   - Logos
   - Stats

5. **Footer**
   - Links
   - Contact
   - Legal

---

## Quick Decision Matrix

**Choose Root App (Option A) if:**
- ✅ You want to deploy TODAY
- ✅ Your current app is working
- ✅ You just need to add landing pages

**Choose apps/dashboard (Option B) if:**
- ✅ You want clean separation
- ✅ You're okay with more setup
- ✅ You want monorepo structure

---

## Recommended: FASTEST Path (30 minutes)

### Use Your Current Root App

1. **Update landing page:**
```bash
# Edit app/page.tsx with landing content
# (I can generate this for you)
```

2. **Add pricing page:**
```bash
# Create app/pricing/page.tsx
```

3. **Verify auth works:**
```bash
# app/(auth)/login/page.tsx already exists
```

4. **Redeploy to Vercel:**
```bash
git add .
git commit -m "feat: add landing and pricing pages"
git push origin civet-saas-platform
```

5. **Done!** ✅

---

## What You'll Deploy

### To Vercel (One Project):
```
civet.vercel.app (or your domain)
├── / → Landing page
├── /pricing → Pricing
├── /login → Login
└── /dashboard → Dashboard (protected)
```

### To Railway (Two Services):
```
civet-api.railway.app → API
civet-bug-loop.railway.app → Bug Loop
```

### To Cloudflare (One Project):
```
civet-widget.pages.dev → Widget CDN
```

---

## Next Steps

**Tell me which approach you prefer:**

1. **"Keep root app"** → I'll help you add landing pages to current structure
2. **"Use apps/dashboard"** → I'll help you consolidate everything there
3. **"Separate apps"** → I'll create apps/marketing for landing page

Then I'll generate the landing page content and update the Vercel config!

---

**My Recommendation:** Keep root app, add landing pages, redeploy. Simplest and fastest! 🚀
