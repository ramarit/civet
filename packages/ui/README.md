# @civet/ui

Shared React UI components for the Civet translation platform, built with Tailwind CSS and shadcn/ui principles.

## Overview

This package provides a collection of reusable, accessible React components that follow the Civet design system. Components are built using:

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **class-variance-authority** - Type-safe component variants
- **TypeScript** - Full type safety

## Installation

This package is internal to the Civet monorepo and is referenced using workspace protocol:

```json
{
  "dependencies": {
    "@civet/ui": "workspace:*"
  }
}
```

## Usage

### Importing Components

```tsx
import { Button, Input, Card, Badge, Spinner } from '@civet/ui';
```

### Importing Styles

In your app's entry point or layout:

```tsx
import '@civet/ui/styles.css';
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@civet/ui';

function Example() {
  return (
    <>
      <Button>Default Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </>
  );
}
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean - Merge props onto child element

### Input

A form input component with label, error states, and helper text.

```tsx
import { Input } from '@civet/ui';

function Example() {
  return (
    <>
      <Input label="Email" type="email" placeholder="Enter your email" />
      <Input
        label="Password"
        type="password"
        error={true}
        helperText="Password must be at least 8 characters"
      />
    </>
  );
}
```

**Props:**
- `label`: string - Input label
- `error`: boolean - Error state
- `helperText`: string - Helper or error message
- All standard HTML input attributes

### Card

A container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@civet/ui';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
}
```

### Label

A label component for form inputs.

```tsx
import { Label } from '@civet/ui';

function Example() {
  return (
    <>
      <Label htmlFor="name">Name</Label>
      <Label htmlFor="email" required>Email</Label>
    </>
  );
}
```

**Props:**
- `required`: boolean - Shows required asterisk
- All standard HTML label attributes

### Badge

A badge component for displaying status, counts, or labels.

```tsx
import { Badge } from '@civet/ui';

function Example() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </>
  );
}
```

**Props:**
- `variant`: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'

### Spinner

A loading spinner component.

```tsx
import { Spinner } from '@civet/ui';

function Example() {
  return (
    <>
      <Spinner />
      <Spinner size="lg" />
      <Spinner variant="light" label="Loading..." />
    </>
  );
}
```

**Props:**
- `size`: 'sm' | 'default' | 'lg' | 'xl'
- `variant`: 'default' | 'light' | 'dark'
- `label`: string - Accessible label and visible text

## Utilities

### cn()

A utility function for merging Tailwind CSS classes.

```tsx
import { cn } from '@civet/ui';

function Example({ className }) {
  return (
    <div className={cn('base-classes', 'more-classes', className)}>
      Content
    </div>
  );
}
```

### formatDate()

Format dates in a human-readable format.

```tsx
import { formatDate } from '@civet/ui';

formatDate(new Date()); // "January 16, 2024"
formatDate('2024-01-16'); // "January 16, 2024"
```

### formatNumber()

Format numbers with thousand separators.

```tsx
import { formatNumber } from '@civet/ui';

formatNumber(1234567); // "1,234,567"
```

### truncate()

Truncate strings to a specified length.

```tsx
import { truncate } from '@civet/ui';

truncate('This is a long string', 10); // "This is a..."
```

## Customization

### Theming

The package uses CSS variables for theming. You can customize colors by overriding the CSS variables in your app:

```css
:root {
  --primary: 199 89% 48%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Dark Mode

Dark mode is supported through Tailwind's dark mode class strategy:

```tsx
<html className="dark">
  {/* Your app */}
</html>
```

## Development

### Building

```bash
pnpm build
```

### Development Mode

```bash
pnpm dev
```

### Type Checking

```bash
pnpm type-check
```

## Package Structure

```
src/
├── components/       # React components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── label.tsx
│   ├── badge.tsx
│   └── spinner.tsx
├── lib/             # Utilities
│   └── utils.ts
├── styles/          # Global styles
│   └── globals.css
└── index.tsx        # Main export file
```

## Best Practices

1. **Use TypeScript**: All components are fully typed
2. **Accessibility**: Components follow WAI-ARIA guidelines
3. **Composition**: Use the `asChild` prop for flexible composition
4. **Variants**: Use class-variance-authority for type-safe variants
5. **Styling**: Use Tailwind utilities and the `cn()` helper

## Contributing

When adding new components:

1. Create the component in `src/components/`
2. Export from `src/index.tsx`
3. Add documentation to this README
4. Ensure full TypeScript typing
5. Follow accessibility best practices
6. Add appropriate variants using CVA

## Related Packages

- `@civet/shared-types` - Shared TypeScript types
- `@civet/config` - Shared configuration (includes Tailwind config)
