# Migrating Existing Vercel Project to New Dashboard

## Current Situation

You have an old Civet app deployed on Vercel that needs to be updated to the new monorepo structure.

---

## Migration Steps

### Step 1: Backup Current Project Settings

Before making changes, save these from your current Vercel project:

1. Go to https://vercel.com/dashboard
2. Select your "civet" project
3. Note down:
   - [ ] Project domain(s)
   - [ ] Environment variables
   - [ ] Build settings
   - [ ] Custom domains (if any)

### Step 2: Update Project Configuration

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to Settings → General
2. Update these fields:

**Build & Development Settings:**
```
Framework Preset: Next.js
Root Directory: apps/dashboard
Build Command: cd ../.. && pnpm install && pnpm build --filter=dashboard
Output Directory: apps/dashboard/.next
Install Command: pnpm install
Node Version: 20.x
```

3. Update environment variables (Settings → Environment Variables):

**Add/Update these:**
```env
# Database
DATABASE_URL=<your-supabase-url>

# NextAuth
NEXTAUTH_URL=<your-vercel-url>
NEXTAUTH_SECRET=<generate new: openssl rand -base64 32>

# API
NEXT_PUBLIC_API_URL=<your-railway-api-url>

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

4. Go to Deployments → Click "..." → Redeploy

#### Option B: Via vercel.json (Advanced)

Create `apps/dashboard/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm build --filter=dashboard",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

Then redeploy.

### Step 3: Deploy New Branch

1. Go to Settings → Git
2. Change production branch from `main` to `civet-saas-platform`
3. Or merge `civet-saas-platform` into `main`:

```bash
git checkout main
git merge civet-saas-platform
git push origin main
```

### Step 4: Clean Up Old Files (Optional)

After successful deployment, you can remove old app files:

```bash
# Create a backup branch first
git checkout -b backup-old-app
git push origin backup-old-app

# Switch back and remove old files
git checkout civet-saas-platform
git rm -r app/ components/ lib/ public/ (old directories)
git commit -m "chore: remove old app files"
git push origin civet-saas-platform
```

---

## Alternative: Start Fresh

If you prefer a clean slate:

### Delete Old Project

1. Go to Vercel project settings
2. Settings → General → Delete Project
3. Confirm deletion

### Create New Project

1. Click "Add New..." → "Project"
2. Import `ramarit/civet` repository
3. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `apps/dashboard`
   - **Build Command:** `cd ../.. && pnpm install && pnpm build --filter=dashboard`
   - **Install Command:** `pnpm install`

4. Add environment variables (same as above)
5. Deploy

---

## Troubleshooting

### Build Fails: "Cannot find module '@civet/shared-types'"

**Solution:** Ensure build command includes workspace setup:
```bash
cd ../.. && pnpm install && pnpm build --filter=dashboard
```

### Build Fails: "pnpm: command not found"

**Solution:**
1. Go to Settings → General
2. Set Node Version to 20.x
3. pnpm is included with Node 20

### Environment Variables Not Working

**Solution:**
1. Check they're set for correct environment (Production/Preview/Development)
2. Redeploy after adding variables
3. Check variable names match exactly

### 404 on Homepage

**Solution:**
1. Verify Root Directory is `apps/dashboard`
2. Check Output Directory is `.next` (not `apps/dashboard/.next`)
3. Framework preset is Next.js

---

## Verification

After deployment:

1. **Check Homepage:** Visit your Vercel URL
   - Should show login page

2. **Check Build Logs:**
   - Look for successful build
   - Check for missing dependencies

3. **Check Console:**
   - Open browser DevTools
   - Look for errors
   - Verify API connection

4. **Test Registration:**
   - Try creating an account
   - Verify database connection works

---

## Environment Variables Checklist

- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `NEXTAUTH_URL` - Your Vercel URL
- [ ] `NEXTAUTH_SECRET` - Random secret (32+ chars)
- [ ] `NEXT_PUBLIC_API_URL` - Railway API URL
- [ ] `GOOGLE_CLIENT_ID` (optional)
- [ ] `GOOGLE_CLIENT_SECRET` (optional)
- [ ] `GITHUB_CLIENT_ID` (optional)
- [ ] `GITHUB_CLIENT_SECRET` (optional)

---

## Post-Migration

Once successfully deployed:

1. **Update DNS** (if using custom domain)
2. **Test all features**
3. **Update documentation** with new URLs
4. **Notify team** of changes

---

## Rollback Plan

If something goes wrong:

### Quick Rollback via Vercel

1. Go to Deployments
2. Find last working deployment
3. Click "..." → Promote to Production

### Full Rollback

```bash
# Switch back to old branch
git checkout main  # or your old branch

# In Vercel:
# Settings → Git → Change production branch back to "main"
# Settings → General → Change Root Directory back to "./"
```

---

## Recommended Approach

**For existing production site:**
1. Keep old project for now
2. Create NEW Vercel project for new dashboard
3. Test thoroughly on new project
4. Switch DNS when ready
5. Delete old project

**For testing/staging:**
1. Repurpose existing project
2. Update settings
3. Redeploy

---

## Questions?

- Can't find Vercel project? Check: https://vercel.com/dashboard
- Need to create GitHub OAuth app? https://github.com/settings/developers
- Need Supabase URL? Check your Supabase project settings

---

**You're ready to migrate!** Choose your approach above and follow the steps.
