# @civet/config

Shared configuration files for the Civet monorepo.

## Overview

This package provides centralized configuration for:

- ESLint (code linting)
- TypeScript (type checking)
- Tailwind CSS (styling)

## Installation

This package is internal to the Civet monorepo and is referenced using workspace protocol:

```json
{
  "devDependencies": {
    "@civet/config": "workspace:*"
  }
}
```

## Usage

### TypeScript Configuration

Extend the base TypeScript configuration in your package:

**Base configuration (for libraries):**

```json
{
  "extends": "@civet/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**React configuration:**

```json
{
  "extends": "@civet/config/typescript/react.json",
  "include": ["src"]
}
```

**Next.js configuration:**

```json
{
  "extends": "@civet/config/typescript/nextjs.json"
}
```

### ESLint Configuration

Import and use the shared ESLint config:

**For TypeScript packages:**

```javascript
// eslint.config.mjs
import { base, typescript } from '@civet/config/eslint';

export default [...base, ...typescript];
```

**For React/Next.js projects:**

```javascript
// eslint.config.mjs
import { base, typescript, react, nextjs } from '@civet/config/eslint';

export default [...base, ...typescript, ...react, ...nextjs];
```

### Tailwind CSS Configuration

Extend the base Tailwind configuration:

```javascript
// tailwind.config.js
const baseConfig = require('@civet/config/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    // Add paths to shared UI components
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      // Add project-specific customizations
    },
  },
};
```

## Configuration Details

### TypeScript Configurations

#### base.json

Strict TypeScript configuration for all packages:

- Strict type checking enabled
- ES2022 target
- ESNext modules with bundler resolution
- Declaration files and source maps enabled
- Composite projects support for monorepo

#### react.json

Extends base configuration with:

- JSX support (react-jsx)
- DOM type definitions
- React-specific compiler options

#### nextjs.json

Extends React configuration with:

- Next.js specific settings
- App directory support
- Path aliases (`@/*`)
- Next.js plugin integration

### ESLint Configurations

#### base

Core ESLint rules for all JavaScript/TypeScript code:

- No console (warnings)
- Prefer const and modern ES6+ features
- Strict equality checks

#### typescript

TypeScript-specific rules:

- Consistent type imports
- No floating promises
- Strict null checks
- No unnecessary conditions

#### react

React and React Hooks rules:

- Hooks rules enforcement
- JSX best practices
- No array index keys

#### nextjs

Next.js specific rules:

- Image optimization
- Link component usage
- Script optimization

### Tailwind Configuration

Provides a comprehensive design system:

#### Brand Colors

- Primary brand colors (50-950 scale)
- Semantic colors (success, warning, error, info)

#### Typography

- Custom font families (Inter for sans-serif, JetBrains Mono for code)
- Extended typography plugin

#### Animations

- Fade in/out
- Slide animations (up, down, left, right)
- Slow spin and pulse

#### Spacing & Layout

- Extended spacing scale (128, 144)
- Extended max-width (8xl, 9xl)
- Custom border radius (4xl, 5xl)

#### Plugins

- @tailwindcss/forms
- @tailwindcss/typography
- @tailwindcss/aspect-ratio
- @tailwindcss/container-queries

## Development

This package contains only configuration files, so there are no build or test scripts needed.

## Best Practices

1. **Don't override core rules**: The configurations are designed to be strict and consistent
2. **Extend, don't replace**: Use the spread operator to extend configurations
3. **Keep it DRY**: Add common configuration here instead of duplicating across packages
4. **Document changes**: Update this README when modifying configurations
5. **Version together**: All configuration changes should be versioned with the package

## Contributing

When modifying configurations:

1. Ensure changes apply to all packages that use the config
2. Test the configuration in at least one consumer package
3. Update documentation in this README
4. Consider backward compatibility
