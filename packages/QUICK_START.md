# Civet Shared Packages - Quick Start Guide

## Package Overview

Three shared packages have been created for the Civet monorepo:

1. **@civet/shared-types** - TypeScript type definitions
2. **@civet/config** - Shared configurations (ESLint, TypeScript, Tailwind)
3. **@civet/ui** - React UI component library

## Installation (One-time Setup)

From the monorepo root:

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

## Quick Usage

### 1. Using Types (@civet/shared-types)

```typescript
// Add to package.json
{
  "dependencies": {
    "@civet/shared-types": "workspace:*"
  }
}

// Use in your code
import type {
  User,
  Project,
  Translation,
  CreateProjectRequest,
  GetProjectResponse,
} from '@civet/shared-types';

// Example
const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  avatar: null,
  organizationId: null,
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### 2. Using Config (@civet/config)

```bash
# Add to package.json devDependencies
{
  "devDependencies": {
    "@civet/config": "workspace:*"
  }
}
```

**TypeScript:**
```json
// tsconfig.json
{
  "extends": "@civet/config/typescript/react.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

**ESLint:**
```javascript
// eslint.config.mjs
import { base, typescript, react, nextjs } from '@civet/config/eslint';

export default [...base, ...typescript, ...react, ...nextjs];
```

**Tailwind:**
```javascript
// tailwind.config.js
const baseConfig = require('@civet/config/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // Include shared UI
  ],
};
```

### 3. Using UI Components (@civet/ui)

```bash
# Add to package.json
{
  "dependencies": {
    "@civet/ui": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

**Import styles in your app:**
```tsx
// app/layout.tsx or _app.tsx
import '@civet/ui/styles.css';
```

**Use components:**
```tsx
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Spinner,
} from '@civet/ui';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Civet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          error={false}
          helperText="At least 8 characters"
        />
        <div className="flex gap-2">
          <Button>Sign In</Button>
          <Button variant="outline">Cancel</Button>
        </div>
        <Badge variant="success">Active</Badge>
        <Spinner label="Loading..." />
      </CardContent>
    </Card>
  );
}
```

## Available Components

### Button
```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Input
```tsx
<Input label="Name" placeholder="Enter name" />
<Input
  label="Email"
  type="email"
  error={true}
  helperText="Invalid email format"
/>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Badge
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Spinner
```tsx
<Spinner />
<Spinner size="lg" />
<Spinner variant="light" label="Processing..." />
```

## Common Types

### User Types
```typescript
import type { User, UserRole, UserStatus, UserProfile } from '@civet/shared-types';
```

### Project Types
```typescript
import type {
  Project,
  ProjectStatus,
  ProjectType,
  ProjectSettings,
  CreateProjectInput,
} from '@civet/shared-types';
```

### Translation Types
```typescript
import type {
  Translation,
  TranslationStatus,
  TranslationQuality,
  CreateTranslationInput,
} from '@civet/shared-types';
```

### API Types
```typescript
import type {
  CreateProjectRequest,
  GetProjectResponse,
  ListProjectsRequest,
  PaginatedResponse,
} from '@civet/shared-types';
```

### Utility Types
```typescript
import type {
  Result,
  AsyncResult,
  DeepPartial,
  Optional,
  Nullable,
} from '@civet/shared-types';
```

## Utility Functions

### cn() - Class Name Merger
```tsx
import { cn } from '@civet/ui';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### formatDate()
```tsx
import { formatDate } from '@civet/ui';

formatDate(new Date()); // "January 16, 2026"
```

### formatNumber()
```tsx
import { formatNumber } from '@civet/ui';

formatNumber(1234567); // "1,234,567"
```

### truncate()
```tsx
import { truncate } from '@civet/ui';

truncate('Long text here', 10); // "Long text..."
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
cd packages/shared-types && pnpm build
cd packages/ui && pnpm build

# Watch mode for development
cd packages/ui && pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Clean build artifacts
pnpm clean
```

## File Locations

### Package Locations
- **shared-types:** `/Users/ryanamarit/civet/packages/shared-types/`
- **config:** `/Users/ryanamarit/civet/packages/config/`
- **ui:** `/Users/ryanamarit/civet/packages/ui/`

### Documentation
- **Complete Overview:** `/Users/ryanamarit/civet/packages/PACKAGES_OVERVIEW.md`
- **Setup Summary:** `/Users/ryanamarit/civet/PACKAGES_SETUP_SUMMARY.md`
- **Package READMEs:**
  - `/Users/ryanamarit/civet/packages/shared-types/README.md`
  - `/Users/ryanamarit/civet/packages/config/README.md`
  - `/Users/ryanamarit/civet/packages/ui/README.md`

## Troubleshooting

### Types not found
```bash
# Rebuild packages
pnpm build

# Or from root
cd /Users/ryanamarit/civet && pnpm build
```

### Import errors
```bash
# Reinstall dependencies
pnpm install --force

# Clear cache
rm -rf node_modules/.cache
```

### Styles not applying
```tsx
// Make sure to import UI styles
import '@civet/ui/styles.css';

// Ensure Tailwind content includes UI package
// tailwind.config.js
content: [
  './src/**/*.{ts,tsx}',
  '../../packages/ui/src/**/*.{ts,tsx}',
]
```

## Best Practices

1. **Always use `type` imports for types:**
   ```typescript
   import type { User } from '@civet/shared-types';
   ```

2. **Use the `cn()` utility for className merging:**
   ```tsx
   className={cn('base', conditional && 'extra')}
   ```

3. **Leverage component variants instead of custom styles:**
   ```tsx
   <Button variant="destructive" size="lg">Delete</Button>
   ```

4. **Keep packages independent:**
   - Packages can depend on other packages
   - Apps depend on packages
   - Packages should NOT depend on apps

5. **Build before using:**
   ```bash
   pnpm build  # Always build before first use
   ```

## Support

For detailed documentation, see:
- `/packages/PACKAGES_OVERVIEW.md` - Complete package documentation
- `/PACKAGES_SETUP_SUMMARY.md` - Setup summary
- Individual package READMEs

---

**Last Updated:** 2026-10-16
