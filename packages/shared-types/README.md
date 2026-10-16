# @civet/shared-types

Shared TypeScript types and interfaces for the Civet translation platform.

## Overview

This package contains all shared type definitions used across the Civet monorepo, including:

- Core entity types (User, Project, Translation, Language)
- API request and response types
- Database schema types
- Common utility types

## Installation

This package is internal to the Civet monorepo and is referenced using workspace protocol:

```json
{
  "dependencies": {
    "@civet/shared-types": "workspace:*"
  }
}
```

## Usage

### Importing Types

```typescript
import type {
  User,
  Project,
  Translation,
  Language,
  CreateProjectRequest,
  GetProjectResponse,
  TranslationStatus,
} from '@civet/shared-types';
```

### Entity Types

```typescript
import type { User, UserRole, UserStatus } from '@civet/shared-types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  // ...
};
```

### API Types

```typescript
import type { CreateProjectRequest, CreateProjectResponse } from '@civet/shared-types';

async function createProject(request: CreateProjectRequest): Promise<CreateProjectResponse> {
  // Implementation
}
```

### Database Types

```typescript
import type { UserRecord, ProjectRecord } from '@civet/shared-types';

// Use these types when working with raw database records
```

### Utility Types

```typescript
import type { Result, AsyncResult, DeepPartial } from '@civet/shared-types';

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error('Division by zero') };
  }
  return { success: true, data: a / b };
}
```

## Package Structure

```
src/
├── entities/          # Core domain entities
│   ├── user.ts
│   ├── project.ts
│   ├── translation.ts
│   └── language.ts
├── api/              # API request/response types
│   ├── requests.ts
│   └── responses.ts
├── database/         # Database schema types
│   └── schema.ts
├── utils/           # Utility types
│   └── common.ts
└── index.ts         # Main export file
```

## Development

### Building

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Watch Mode

```bash
pnpm dev
```

## Best Practices

1. **Keep types pure**: This package should only contain type definitions, no runtime code
2. **Use strict types**: Avoid `any` and prefer explicit types
3. **Document complex types**: Add JSDoc comments for complex type definitions
4. **Export from index**: Always export types through the main index.ts file
5. **Use namespaces carefully**: Group related types but avoid deep nesting

## Contributing

When adding new types:

1. Place them in the appropriate directory
2. Export from the directory's index file
3. Add documentation with JSDoc comments
4. Update this README if adding new major type categories
