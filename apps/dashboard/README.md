# Civet Dashboard

Production-ready Next.js 14 admin dashboard for the Civet translation platform.

## Features

- **Next.js 14 App Router** - Modern React with Server Components
- **NextAuth.js** - Complete authentication system with OAuth support
- **React Query** - Powerful data fetching and caching
- **Zustand** - Lightweight state management
- **shadcn/ui** - Beautiful, accessible UI components
- **Dark Mode** - Full dark mode support with next-themes
- **Responsive Design** - Mobile-first, fully responsive layout
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected dashboard pages
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── projects/          # Project management
│   │   ├── analytics/         # Analytics & reporting
│   │   └── settings/          # Settings pages
│   ├── api/
│   │   └── auth/              # NextAuth API routes
│   └── layout.tsx             # Root layout
├── components/
│   ├── layout/                # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── projects/              # Project components
│   ├── translations/          # Translation editor
│   ├── dashboard/             # Dashboard widgets
│   ├── shared/                # Shared components
│   └── ui/                    # UI primitives
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities
└── store/                     # Zustand stores
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## Key Features

### Authentication

- Email/password authentication
- Google OAuth
- GitHub OAuth
- Session management with NextAuth.js
- Protected routes

### Projects

- Create and manage translation projects
- Multi-language support
- Progress tracking
- Team collaboration

### Translation Editor

- Visual translation editor
- Click-to-edit interface
- Language selector
- Translation status tracking
- Real-time updates

### Analytics

- Translation trends
- Language distribution
- Team performance metrics
- Interactive charts with Recharts

### Settings

- **Profile**: Manage personal information
- **Team**: Invite and manage team members
- **Billing**: Subscription plans and payment management

## Development

```bash
# Run development server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## API Integration

The dashboard connects to:

- **@civet/shared-types** - Shared TypeScript types
- **Translation Engine** - AI-powered translation service
- **Billing Service** - Stripe integration for payments

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker build -t civet-dashboard .
docker run -p 3000:3000 civet-dashboard
```

## Contributing

This is part of the Civet monorepo. See the main README for contribution guidelines.

## License

Proprietary - All rights reserved
