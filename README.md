# Civet - AI-Powered Translation SaaS

> Translate your website into 110+ languages with AI. Simple integration, powerful results.

## 🎯 Project Goal

Build a fully automated AI SaaS product targeting **$10k MRR** through:
- Competitive pricing ($2-3/language/month)
- Multi-AI provider support (Claude, GPT-4, DeepL)
- Automated bug tracking and resolution
- Superior SEO optimization

## 🏗️ Architecture

This is a monorepo managed by [Turborepo](https://turbo.build) and [pnpm](https://pnpm.io).

### Apps

- **dashboard**: Next.js 14 admin dashboard for managing translations
- **api**: Fastify backend API server
- **bug-loop**: Automated bug tracking and resolution system
- **marketing**: Public marketing website

### Packages

- **translation-engine**: Core AI translation logic with multi-provider support
- **widget-sdk**: JavaScript integration snippet for customer websites
- **shared-types**: Shared TypeScript types and interfaces
- **ui**: Shared React components (shadcn/ui)
- **config**: Shared configuration (ESLint, TypeScript, Tailwind)
- **billing**: Stripe billing and subscription management

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development servers
pnpm dev
```

### Development Commands

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm test         # Run all tests
pnpm lint         # Lint all code
pnpm format       # Format code with Prettier
```

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./docs/api.md)
- [Widget Integration Guide](./docs/widget.md)
- [Development Guide](./docs/development.md)

## 🔐 Environment Variables

See `.env.example` for required environment variables.

## 📦 Deployment

Deployments are automated via GitHub Actions:
- Frontend (Dashboard, Marketing) → Vercel
- Backend (API, Bug Loop) → Railway
- Widget SDK → Cloudflare CDN

## 🎯 Roadmap

- [x] Architecture design
- [x] Project structure setup
- [ ] Authentication system
- [ ] Translation engine
- [ ] Widget SDK
- [ ] Admin dashboard
- [ ] Billing integration
- [ ] Bug tracking loop

## 📊 Success Metrics

- **Technical**: 99.9% uptime, <2s translation time
- **Business**: $10k MRR by Month 6
- **Customer**: NPS >50, <5% churn

---

Built with ❤️ using Claude Code
