# Civet Monorepo - Shared Packages Overview

This document provides an overview of the shared packages structure in the Civet monorepo.

## Package Structure

The Civet monorepo includes the following shared packages:

```
packages/
├── shared-types/      # Shared TypeScript types and interfaces
├── config/            # Shared configuration files
├── ui/                # Shared React UI components
├── translation-engine/ # Translation engine (already exists)
├── billing/           # Billing package (placeholder)
└── widget-sdk/        # Widget SDK (placeholder)
```

## Package Details

### 1. @civet/shared-types

**Purpose:** Centralized TypeScript type definitions for the entire monorepo.

**Key Features:**
- Core entity types (User, Project, Translation, Language)
- API request/response types
- Database schema types
- Common utility types
- Full TypeScript strict mode

**Structure:**
```
shared-types/
├── src/
│   ├── entities/          # Domain entities
│   │   ├── user.ts
│   │   ├── project.ts
│   │   ├── translation.ts
│   │   └── language.ts
│   ├── api/              # API types
│   │   ├── requests.ts
│   │   └── responses.ts
│   ├── database/         # Database schemas
│   │   └── schema.ts
│   └── utils/           # Utility types
│       └── common.ts
├── package.json
├── tsconfig.json
└── README.md
```

**Usage:**
```typescript
import type { User, Project, Translation, CreateProjectRequest } from '@civet/shared-types';
```

**Key Types Included:**
- **User Types:** User, UserRole, UserStatus, UserProfile, UserPreferences
- **Project Types:** Project, ProjectStatus, ProjectType, ProjectSettings, ProjectStats
- **Translation Types:** Translation, TranslationStatus, TranslationQuality, TranslationBatch
- **Language Types:** Language, LanguageDetection, SupportedLanguageCode
- **API Types:** All request/response types with proper pagination
- **Database Types:** Complete schema definitions for all tables
- **Utility Types:** Result, AsyncResult, DeepPartial, Optional, and more

---

### 2. @civet/config

**Purpose:** Centralized configuration for ESLint, TypeScript, and Tailwind CSS.

**Key Features:**
- Multiple TypeScript configurations (base, react, nextjs)
- ESLint configurations with proper rules
- Shared Tailwind CSS theme
- Consistent code quality across packages

**Structure:**
```
config/
├── eslint/
│   └── index.mjs         # ESLint configurations
├── typescript/
│   ├── base.json         # Base TS config
│   ├── react.json        # React TS config
│   └── nextjs.json       # Next.js TS config
├── tailwind/
│   └── index.js          # Tailwind config
├── package.json
├── index.js
└── README.md
```

**Usage:**

TypeScript:
```json
{
  "extends": "@civet/config/typescript/base.json"
}
```

ESLint:
```javascript
import { base, typescript, react } from '@civet/config/eslint';
export default [...base, ...typescript, ...react];
```

Tailwind:
```javascript
const baseConfig = require('@civet/config/tailwind');
module.exports = { ...baseConfig, content: ['./src/**/*.{ts,tsx}'] };
```

**Configuration Features:**

**TypeScript:**
- Strict mode enabled
- ES2022 target
- Composite projects for monorepo
- Source maps and declarations

**ESLint:**
- TypeScript rules with strict type checking
- React and React Hooks rules
- Next.js specific rules
- Consistent type imports

**Tailwind:**
- Brand color palette
- Custom animations and keyframes
- Extended spacing and sizing
- Form, typography, and container query plugins

---

### 3. @civet/ui

**Purpose:** Shared React UI component library built with Tailwind CSS and shadcn/ui principles.

**Key Features:**
- Fully typed React components
- Accessible components using Radix UI primitives
- Consistent design system
- Dark mode support
- Multiple component variants

**Structure:**
```
ui/
├── src/
│   ├── components/       # React components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   └── spinner.tsx
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   ├── styles/          # Global styles
│   │   └── globals.css
│   └── index.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── tsup.config.ts
└── README.md
```

**Usage:**
```tsx
import { Button, Input, Card, Badge, Spinner } from '@civet/ui';
import '@civet/ui/styles.css';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input label="Email" type="email" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

**Components Included:**

1. **Button** - Multiple variants (default, destructive, outline, ghost, link) and sizes
2. **Input** - Form input with label, error states, and helper text
3. **Card** - Container component with header, content, and footer
4. **Label** - Form labels with required indicator
5. **Badge** - Status badges with variants (success, warning, error, etc.)
6. **Spinner** - Loading spinner with size and color variants

**Utilities:**
- `cn()` - Merge Tailwind classes
- `formatDate()` - Date formatting
- `formatNumber()` - Number formatting
- `truncate()` - String truncation

---

## Installation & Setup

### Adding Dependencies to Your Package

To use these shared packages in your app or package, add them to your `package.json`:

```json
{
  "dependencies": {
    "@civet/shared-types": "workspace:*",
    "@civet/ui": "workspace:*"
  },
  "devDependencies": {
    "@civet/config": "workspace:*"
  }
}
```

Then run:
```bash
pnpm install
```

### Building Packages

Build all packages:
```bash
pnpm build
```

Build specific package:
```bash
cd packages/shared-types && pnpm build
```

### Development Mode

Watch mode for active development:
```bash
cd packages/ui && pnpm dev
```

## Best Practices

### 1. Type Safety
- Always import types using `import type` for better tree-shaking
- Never use `any` - prefer `unknown` and type guards
- Use utility types from `@civet/shared-types` for consistency

```typescript
// Good
import type { User, Project } from '@civet/shared-types';

// Avoid
import { User, Project } from '@civet/shared-types';
```

### 2. Component Usage
- Use the `cn()` utility for conditional styling
- Leverage component variants instead of custom styles
- Keep components composable with the `asChild` pattern

```tsx
// Good
<Button variant="destructive" size="lg">Delete</Button>

// Avoid custom classes when variants exist
<Button className="bg-red-600 px-8">Delete</Button>
```

### 3. Configuration
- Extend base configurations, don't override completely
- Keep package-specific overrides minimal
- Share common rules in the base config

### 4. Dependencies
- Use `workspace:*` protocol for internal packages
- Keep peer dependencies explicit
- Minimize external dependencies

## Integration Examples

### Example: Using Types in an API Route

```typescript
// app/api/projects/route.ts
import type {
  CreateProjectRequest,
  CreateProjectResponse,
} from '@civet/shared-types';

export async function POST(request: Request) {
  const body: CreateProjectRequest['data'] = await request.json();

  // Create project...

  const response: CreateProjectResponse = {
    success: true,
    data: project,
    timestamp: new Date().toISOString(),
  };

  return Response.json(response);
}
```

### Example: Using UI Components in a Form

```tsx
// components/ProjectForm.tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@civet/ui';
import type { CreateProjectInput } from '@civet/shared-types';

export function ProjectForm() {
  const handleSubmit = (data: CreateProjectInput) => {
    // Handle submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            name="name"
            required
          />
          <Input
            label="Description"
            name="description"
          />
          <Button type="submit">Create Project</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Example: Extending Tailwind Configuration

```javascript
// apps/web/tailwind.config.js
const baseConfig = require('@civet/config/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      // App-specific customizations
      colors: {
        ...baseConfig.theme.extend.colors,
        'app-primary': '#custom-color',
      },
    },
  },
};
```

## Dependency Graph

```
apps/web (Next.js)
├── @civet/ui
│   ├── @civet/config (tailwind)
│   └── @civet/shared-types
├── @civet/shared-types
└── @civet/config (eslint, typescript)

apps/api
├── @civet/shared-types
└── @civet/config (eslint, typescript)

packages/translation-engine
├── @civet/shared-types
└── @civet/config (typescript)
```

## Next Steps

1. **Install dependencies** for each package:
   ```bash
   pnpm install
   ```

2. **Build all packages**:
   ```bash
   pnpm build
   ```

3. **Update existing apps** to use shared packages:
   - Replace local types with `@civet/shared-types`
   - Migrate components to use `@civet/ui`
   - Update configs to extend `@civet/config`

4. **Add more components** to `@civet/ui` as needed:
   - Select, Dropdown, Modal, Toast, etc.
   - Follow the existing patterns and accessibility guidelines

5. **Document package usage** in each app's README

## Troubleshooting

### Type errors after installation
```bash
# Rebuild all packages
pnpm build

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Circular dependencies
- Packages should only depend on other packages, never apps
- Apps depend on packages, but packages should not depend on apps

### Style conflicts
- Ensure Tailwind content paths include shared packages
- Import `@civet/ui/styles.css` before custom styles
- Use `cn()` utility to properly merge classes

## Contributing

When adding new shared code:

1. Determine the right package (types vs config vs ui)
2. Add the code following existing patterns
3. Update the package's README
4. Export from the main index file
5. Add usage examples
6. Update this overview document
7. Test in at least one consumer app

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turbo Documentation](https://turbo.build/repo/docs)
