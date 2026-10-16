# Civet Marketing Website - Setup Guide

## Quick Start (3 steps)

```bash
# 1. Install dependencies
cd apps/marketing
pnpm install

# 2. Run development server
pnpm dev

# 3. Open http://localhost:3001
```

That's it! No environment variables needed for development.

## What You Get

### Interactive Components

1. **Hero with Live Translation Demo**
   - Type text and see it translate in real-time
   - Floating language bubbles
   - Animated gradient background
   - File: `/src/components/interactive/TranslationDemo.tsx`

2. **Speed Comparison Race**
   - Side-by-side Civet vs Competitor animation
   - Shows 70% faster with caching
   - Real progress bars
   - File: `/src/components/interactive/SpeedComparison.tsx`

3. **Interactive Pricing Calculator**
   - Drag sliders for languages and page views
   - Live cost comparison
   - Animated savings display
   - File: `/src/components/interactive/PricingCalculator.tsx`

4. **Flip Card Testimonials**
   - Hover to flip and reveal transformation
   - Before/After with real metrics
   - 3D card rotation
   - File: `/src/components/interactive/FlipCard.tsx`

5. **Language Globe**
   - Canvas-based connection visualization
   - Pulsing translation nodes
   - Real-time indicators
   - File: `/src/components/interactive/LanguageGlobe.tsx`

### Custom Design System

**Brand Colors** (in `tailwind.config.ts`):
- Primary: `civet-purple-500` (#7C3AED)
- Accent: `civet-blue-500` (#3B82F6)
- Success: `civet-green-500` (#10B981)
- Neutrals: `warm-50` through `warm-900`

**Custom Animations** (in `tailwind.config.ts` + `/src/styles/custom-animations.css`):
- `animate-morph` - Morphing blob shapes
- `animate-float` - Floating particles
- `animate-shimmer` - Text shimmer effect
- `gradient-shift` - Animated gradient backgrounds
- `hover-lift` - Smooth card elevations

**Typography**:
- Display: `font-display` (SF Pro Display)
- Body: `font-sans` (Optimized system fonts)
- Mono: `font-mono` (JetBrains Mono)
- Display sizes: `text-display-xl`, `text-display-lg`, `text-display-md`

## File Structure

```
apps/marketing/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage ⭐
│   │   ├── pricing/page.tsx            # Pricing page with calculator ⭐
│   │   ├── features/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/
│   │   ├── interactive/ ⭐⭐⭐        # CUSTOM INTERACTIVE COMPONENTS
│   │   │   ├── TranslationDemo.tsx    # Live translation demo
│   │   │   ├── SpeedComparison.tsx    # Race animation
│   │   │   ├── PricingCalculator.tsx  # Interactive pricing
│   │   │   ├── FlipCard.tsx           # Flip testimonials
│   │   │   └── LanguageGlobe.tsx      # Canvas globe
│   │   │
│   │   ├── animations/
│   │   │   └── SmoothScroll.tsx       # Scroll animations
│   │   │
│   │   ├── home/
│   │   │   ├── hero.tsx ⭐            # Custom hero with gradient
│   │   │   ├── features.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   └── faq.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   └── ui/                        # Radix UI primitives
│   │
│   └── styles/
│       └── custom-animations.css ⭐   # Custom CSS animations
│
├── public/                             # Static assets
├── tailwind.config.ts ⭐⭐⭐          # CUSTOM BRAND CONFIG
├── package.json
├── README.md
└── SETUP.md (this file)
```

## Using Interactive Components

### Translation Demo
```tsx
import { TranslationDemo } from '@/components/interactive/TranslationDemo';

<TranslationDemo
  languages={['es', 'fr', 'ja']}  // Which languages to show
  showFloatingBubbles              // Enable floating bubbles
/>
```

### Speed Comparison
```tsx
import { SpeedComparison } from '@/components/interactive/SpeedComparison';

<SpeedComparison
  civetSpeed={200}                 // Civet speed in ms
  competitorSpeed={2000}           // Competitor speed in ms
  showAnimation                    // Enable auto-play animation
/>
```

### Pricing Calculator
```tsx
import { PricingCalculator } from '@/components/interactive/PricingCalculator';

<PricingCalculator
  competitors={['weglot', 'lantis']}  // Competitors to compare
  showSavings                         // Show savings calculation
/>
```

### Flip Cards
```tsx
import { TestimonialFlipCards } from '@/components/interactive/FlipCard';

<TestimonialFlipCards
  beforeAfter              // Show before/after states
  showMetrics              // Display metrics below cards
/>
```

### Language Globe
```tsx
import { LanguageGlobe } from '@/components/interactive/LanguageGlobe';

<LanguageGlobe />  // No props needed, fully self-contained
```

## Customization

### Change Brand Colors

Edit `tailwind.config.ts`:

```typescript
civet: {
  purple: {
    500: '#7C3AED',  // Change to your primary color
    // Other shades auto-generated or manually set
  },
  blue: {
    500: '#3B82F6',  // Change to your accent color
  }
}
```

### Add Custom Animations

In `tailwind.config.ts`:

```typescript
keyframes: {
  'my-animation': {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  }
},
animation: {
  'my-animation': 'my-animation 0.5s ease-out',
}
```

Use in components:
```tsx
<div className="animate-my-animation">
  Content
</div>
```

### Create New Interactive Component

1. Create file in `/src/components/interactive/`:

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  // Define props with TypeScript
}

export function MyComponent({ }: MyComponentProps) {
  const [state, setState] = useState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Your interactive content */}
    </motion.div>
  );
}
```

2. Use in pages:

```tsx
import { MyComponent } from '@/components/interactive/MyComponent';

<section className="py-24 bg-white">
  <MyComponent />
</section>
```

## Common Tasks

### Update Homepage Hero Text

Edit `/src/components/home/hero.tsx`:

```tsx
<h1 className="...">
  Your New Headline
  <br />
  <span className="text-shimmer">with AI</span>
</h1>
```

### Change Pricing Tiers

Edit `/src/app/pricing/page.tsx`:

Find the `tiers` array and update:

```typescript
const tiers = [
  {
    name: 'Your Plan',
    price: 9.99,
    description: 'Your description',
    features: {
      included: ['Feature 1', 'Feature 2'],
      notIncluded: ['Premium feature'],
    },
    // ...
  }
];
```

### Add New Page

1. Create `/src/app/your-page/page.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Page - Civet',
  description: 'Your page description',
};

export default function YourPage() {
  return (
    <div className="bg-white">
      <section className="pt-32 pb-16">
        {/* Your content */}
      </section>
    </div>
  );
}
```

2. Add to navbar in `/src/components/layout/navbar.tsx`

### Update Testimonials

Edit `/src/components/interactive/FlipCard.tsx`:

Find the `testimonials` array in `TestimonialFlipCards`:

```typescript
const testimonials = [
  {
    before: {
      stat: '12 days',
      label: 'to launch',
      icon: '😰',
      problem: 'Description of problem',
    },
    after: {
      stat: '2 minutes',
      label: 'to go live',
      icon: '🚀',
      improvement: 'Description of improvement',
    },
    company: {
      name: 'Company Name',
      person: 'John Doe',
      role: 'CEO',
    },
  },
  // Add more...
];
```

## Styling Guide

### Use Brand Colors

```tsx
// Purple
className="bg-civet-purple-500 text-white"

// Blue accent
className="bg-civet-blue-500 text-white"

// Success green
className="bg-civet-green-500 text-white"

// Warm neutrals
className="bg-warm-50 text-warm-900"

// Gradients
className="bg-gradient-purple-blue"
```

### Apply Custom Shadows

```tsx
// Purple glow
className="shadow-glow-purple"

// Blue glow
className="shadow-glow-blue"

// Floating card
className="shadow-float"
```

### Use Custom Animations

```tsx
// Morph blob
className="animate-morph"

// Float
className="animate-float"

// Float slow
className="animate-float-slow"

// Shimmer text
className="text-shimmer"

// Pulse glow
className="animate-pulse-glow"
```

### Scroll Animations

```tsx
import { SmoothScroll, StaggerContainer, StaggerItem } from '@/components/animations/SmoothScroll';

// Single element
<SmoothScroll direction="up" delay={0.2}>
  <h2>Animated heading</h2>
</SmoothScroll>

// Stagger children
<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

## Performance Tips

1. **Lazy load heavy components**:
```tsx
import dynamic from 'next/dynamic';

const LanguageGlobe = dynamic(
  () => import('@/components/interactive/LanguageGlobe').then(mod => mod.LanguageGlobe),
  { ssr: false }
);
```

2. **Optimize images**:
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority // For above-fold images
/>
```

3. **Use Framer Motion wisely**:
```tsx
// Good: Only animate on mount
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

// Better: Animate on scroll
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}  // Only animate once
>
```

## Accessibility Checklist

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Color contrast WCAG AA compliant
- ✅ Reduced motion support
- ✅ Semantic HTML (h1, h2, nav, section, etc.)
- ✅ Focus indicators visible
- ✅ Alt text on images
- ✅ Form labels

## Troubleshooting

### Animations not working?
1. Check `custom-animations.css` is imported in `globals.css`
2. Verify Tailwind config has the animation defined
3. Use browser DevTools to inspect element classes

### Components not showing?
1. Make sure `'use client'` directive is at the top of interactive components
2. Check browser console for errors
3. Verify all imports are correct

### Styles not applying?
1. Run `pnpm dev` to rebuild Tailwind
2. Clear `.next` cache: `rm -rf .next`
3. Check Tailwind config content paths include your files

### Build errors?
1. Run type check: `pnpm type-check`
2. Fix TypeScript errors
3. Ensure all dependencies are installed

## Next Steps

1. Customize brand colors in `tailwind.config.ts`
2. Update copy and content in components
3. Add your own images to `/public`
4. Test on mobile devices
5. Run lighthouse audit for performance
6. Deploy to Vercel

## Support

- Documentation: This file + `/README.md`
- Design Strategy: `/docs/MARKETING_DESIGN_STRATEGY.md`
- Email: hello@civet.io

---

**Happy building! Make it award-worthy.**
