# Dashboard Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/ryanamarit/civet/apps/dashboard
pnpm install
```

### Additional Dependencies to Install

If you encounter missing dependencies, install them:

```bash
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:

```env
# Minimum required for development
DATABASE_URL="postgresql://user:password@localhost:5432/civet"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

### 3. Database Setup

If using PostgreSQL, ensure your database is running and accessible.

### 4. Run Development Server

```bash
pnpm dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

## Default Routes

- `/` - Redirects to `/login` or `/dashboard` based on auth state
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/dashboard/projects` - Projects list (protected)
- `/dashboard/projects/[id]` - Project details (protected)
- `/dashboard/projects/[id]/translations` - Translation editor (protected)
- `/dashboard/analytics` - Analytics page (protected)
- `/dashboard/settings/profile` - Profile settings (protected)
- `/dashboard/settings/team` - Team settings (protected)
- `/dashboard/settings/billing` - Billing settings (protected)

## Development Workflow

### 1. Authentication

The dashboard uses NextAuth.js for authentication. Currently configured for:

- Credentials (email/password)
- Google OAuth (configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)
- GitHub OAuth (configure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`)

### 2. API Integration

The app uses React Query for data fetching. Example hooks are provided in:

- `/src/hooks/use-projects.ts`

To connect to a real API, update:

- `NEXT_PUBLIC_API_URL` in your environment
- API client configuration in `/src/lib/api-client.ts`

### 3. Styling

The dashboard uses Tailwind CSS with shadcn/ui components:

- Components are in `/src/components/ui/`
- Global styles in `/src/app/globals.css`
- Tailwind config in `tailwind.config.ts`

### 4. Type Safety

TypeScript types from `@civet/shared-types` package:

```typescript
import type { Project, Translation } from '@civet/shared-types'
```

## Building for Production

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Module not found errors

If you see module errors, ensure all workspace dependencies are built:

```bash
# From the root of the monorepo
cd /Users/ryanamarit/civet
pnpm build
```

### TypeScript errors

Check TypeScript configuration:

```bash
pnpm type-check
```

### Authentication issues

1. Verify `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is set
3. Ensure database connection for session storage

## Next Steps

1. **Connect to Backend API**: Update API endpoints in hooks
2. **Configure OAuth**: Add OAuth provider credentials
3. **Setup Database**: Configure database for NextAuth sessions
4. **Add Stripe**: Configure Stripe keys for billing
5. **Customize Branding**: Update logo, colors, and theme

## Support

For issues or questions, refer to the main Civet documentation or create an issue in the repository.
