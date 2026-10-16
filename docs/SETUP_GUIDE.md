# Civet Setup Guide
## Complete Step-by-Step Installation Instructions

**Last Updated:** 2026-10-16

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL and Redis)
- **VS Code** - [Download](https://code.visualstudio.com/)

### Cloud Accounts (for production)
- **Anthropic** - Claude API key ([Get one](https://console.anthropic.com/))
- **OpenAI** - OpenAI API key ([Get one](https://platform.openai.com/))
- **DeepL** - DeepL API key ([Get one](https://www.deepl.com/pro-api))
- **Stripe** - Stripe account ([Sign up](https://stripe.com/))
- **Vercel** - Vercel account ([Sign up](https://vercel.com/))
- **Railway** - Railway account ([Sign up](https://railway.app/))

---

## Quick Start (Automated)

Use the automated setup script:

```bash
cd /Users/ryanamarit/civet
./scripts/setup.sh
```

This will:
1. Check Node.js and pnpm versions
2. Install all dependencies
3. Create environment files
4. Optionally start Docker services
5. Run database migrations
6. Build all packages
7. Set up git hooks

---

## Manual Setup

### Step 1: Install Dependencies

```bash
cd /Users/ryanamarit/civet
pnpm install
```

### Step 2: Environment Configuration

#### Root Environment (.env.local)

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# AI Providers
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
DEEPL_API_KEY=xxxxx

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/civet
REDIS_URL=redis://localhost:6379

# Application
NODE_ENV=development
```

#### Dashboard Environment

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

Edit `apps/dashboard/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# OAuth (optional)
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
```

#### API Environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/civet
REDIS_URL=redis://localhost:6379
JWT_SECRET=<generate with: openssl rand -base64 32>
PORT=8000
```

#### Bug Loop Environment

```bash
cp apps/bug-loop/.env.example apps/bug-loop/.env
```

Edit `apps/bug-loop/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO=your-org/civet
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/civet
```

### Step 3: Start Services

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL
docker run -d --name civet-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=civet \
  -p 5432:5432 \
  postgres:16

# Start Redis
docker run -d --name civet-redis \
  -p 6379:6379 \
  redis:7
```

#### Option B: Local Installation

Install PostgreSQL and Redis locally:

**macOS (Homebrew):**
```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis
```

### Step 4: Database Setup

```bash
# Create database
createdb civet

# Run migrations
cd apps/api
psql postgresql://postgres:postgres@localhost:5432/civet -f src/db/schema.sql
cd ../..
```

### Step 5: Build Packages

```bash
pnpm build
```

This will build all packages in the correct order using Turborepo.

### Step 6: Start Development Servers

```bash
pnpm dev
```

This will start:
- **Dashboard:** http://localhost:3000
- **API:** http://localhost:8000
- **Bug Loop:** http://localhost:3002
- **Widget SDK:** Build mode (use `pnpm --filter widget-sdk dev` for watch mode)

---

## Verification

### Check API Health

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-10-16T..."
}
```

### Check Dashboard

Open http://localhost:3000 in your browser. You should see the login page.

### Check Database Connection

```bash
psql postgresql://postgres:postgres@localhost:5432/civet -c "SELECT COUNT(*) FROM users;"
```

---

## Development Workflow

### Running Specific Apps

```bash
# Dashboard only
pnpm --filter dashboard dev

# API only
pnpm --filter api dev

# Bug Loop only
pnpm --filter bug-loop dev
```

### Running Tests

```bash
# All tests
pnpm test

# Specific package
pnpm --filter translation-engine test
pnpm --filter api test

# Watch mode
pnpm test:watch
```

### Linting and Type Checking

```bash
# Lint all code
pnpm lint

# Type check all code
pnpm type-check

# Format code
pnpm format
```

### Building for Production

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter dashboard build
```

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Find process using port 8000
lsof -ti:8000 | xargs kill -9
```

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep civet-postgres

# Check PostgreSQL logs
docker logs civet-postgres

# Restart PostgreSQL
docker restart civet-postgres
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker ps | grep civet-redis

# Test Redis connection
redis-cli ping

# Restart Redis
docker restart civet-redis
```

### Build Errors

```bash
# Clean all builds
pnpm clean

# Remove node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### TypeScript Errors

```bash
# Rebuild all packages
pnpm build

# Check for circular dependencies
npx madge --circular --extensions ts,tsx apps/dashboard/src
```

---

## VS Code Setup

### Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "prisma.prisma"
  ]
}
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## API Keys Guide

### Anthropic Claude

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local` as `ANTHROPIC_API_KEY`

### OpenAI

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local` as `OPENAI_API_KEY`

### DeepL

1. Go to https://www.deepl.com/pro-api
2. Sign up for DeepL API Pro
3. Navigate to Account
4. Copy Authentication Key
5. Add to `.env.local` as `DEEPL_API_KEY`

### Stripe

1. Go to https://stripe.com/
2. Sign up or log in
3. Navigate to Developers > API Keys
4. Copy Secret Key (starts with `sk_test_` for test mode)
5. Add to `apps/api/.env` as `STRIPE_SECRET_KEY`

### GitHub

For bug loop integration:

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `admin:org`
4. Copy token
5. Add to `apps/bug-loop/.env` as `GITHUB_TOKEN`

---

## Database Schema

The database schema is automatically created when you run migrations. It includes:

- **users** - User accounts
- **teams** - Team/organization management
- **team_members** - Team membership
- **projects** - Customer projects
- **project_languages** - Enabled languages per project
- **translations** - All translations (cached)
- **subscriptions** - Billing subscriptions
- **usage_logs** - Usage tracking
- **refresh_tokens** - JWT refresh tokens
- **bug_reports** - Bug tracking
- **bug_resolutions** - Bug fix tracking

---

## Next Steps

1. **Read the documentation:**
   - [Architecture Overview](../ARCHITECTURE.md)
   - [Pricing Analysis](./PRICING_ANALYSIS.md)
   - [API Documentation](./API.md)

2. **Create a test project:**
   ```bash
   curl -X POST http://localhost:8000/api/projects \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <your-jwt-token>" \
     -d '{"name": "Test Project", "domain": "example.com"}'
   ```

3. **Test the widget:**
   - Copy integration snippet from dashboard
   - Add to a test HTML file
   - Open in browser and test translations

4. **Set up deployment:**
   - Configure Vercel for dashboard
   - Configure Railway for API
   - Configure Cloudflare for widget
   - Set up GitHub Actions secrets

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker logs civet-postgres`
3. Check environment variables are set correctly
4. Ensure all services are running

---

**You're all set! Happy developing! 🚀**
