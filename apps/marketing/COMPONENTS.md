# Interactive Components Reference

Quick reference guide for all custom interactive components.

## TranslationDemo

**Purpose**: Live translation demo in the hero section
**File**: `/src/components/interactive/TranslationDemo.tsx`

```tsx
import { TranslationDemo } from '@/components/interactive/TranslationDemo';

<TranslationDemo
  languages={['es', 'fr', 'ja']}  // Array of language codes
  showFloatingBubbles={true}      // Enable floating language bubbles
/>
```

**Features**:
- Real-time text input with translation display
- Floating language bubbles with flags
- Animated transitions between languages
- Auto-cycling demo phrases
- Responsive design

**Customization**:
```tsx
const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', demo: 'Hola, mundo' },
  // Add more languages here
];
```

---

## SpeedComparison

**Purpose**: Animated race showing Civet vs competitors
**File**: `/src/components/interactive/SpeedComparison.tsx`

```tsx
import { SpeedComparison } from '@/components/interactive/SpeedComparison';

<SpeedComparison
  civetSpeed={200}          // Speed in milliseconds
  competitorSpeed={2000}    // Competitor speed in ms
  showAnimation={true}      // Auto-play race
/>
```

**Features**:
- Side-by-side progress bars
- Cache hit rate visualization
- Winner badge when Civet finishes first
- Automated race loop
- Stats comparison grid

**Stats Displayed**:
- Speed difference percentage
- Cache hit rate (70%)
- Uptime (99.9%)

---

## PricingCalculator

**Purpose**: Interactive cost calculator with sliders
**File**: `/src/components/interactive/PricingCalculator.tsx`

```tsx
import { PricingCalculator } from '@/components/interactive/PricingCalculator';

<PricingCalculator
  competitors={['weglot', 'lantis']}  // Competitor IDs
  showSavings={true}                  // Show annual savings
/>
```

**Features**:
- Draggable sliders for languages and page views
- Live cost calculations
- Real-time competitor comparison
- Animated savings display
- Responsive pricing cards

**Pricing Tiers** (editable in component):
```tsx
const PRICING = {
  civet: { basePrice: 29, pricePerLanguage: 5 },
  weglot: { basePrice: 99, pricePerLanguage: 12 },
  lantis: { basePrice: 79, pricePerLanguage: 10 },
};
```

---

## FlipCard / TestimonialFlipCards

**Purpose**: 3D flip cards for before/after testimonials
**File**: `/src/components/interactive/FlipCard.tsx`

### Single Card
```tsx
import { FlipCard } from '@/components/interactive/FlipCard';

<FlipCard
  before={{
    stat: '12 days',
    label: 'to launch',
    icon: '😰',
    problem: 'Problem description',
  }}
  after={{
    stat: '2 minutes',
    label: 'to go live',
    icon: '🚀',
    improvement: 'How Civet helped',
  }}
  company={{
    name: 'TechFlow',
    person: 'Sarah Chen',
    role: 'Head of Growth',
  }}
/>
```

### Multiple Cards
```tsx
import { TestimonialFlipCards } from '@/components/interactive/FlipCard';

<TestimonialFlipCards
  beforeAfter={true}    // Show before/after states
  showMetrics={true}    // Display metrics below
/>
```

**Features**:
- Hover or click to flip
- 3D rotation animation
- Before: Problem state with metrics
- After: Success with improvements
- Company branding

**Testimonials** (editable in component):
```tsx
const testimonials = [
  {
    before: { /* ... */ },
    after: { /* ... */ },
    company: { /* ... */ },
  },
  // Add more testimonials
];
```

---

## LanguageGlobe

**Purpose**: Canvas-based visualization of global translations
**File**: `/src/components/interactive/LanguageGlobe.tsx`

```tsx
import { LanguageGlobe } from '@/components/interactive/LanguageGlobe';

<LanguageGlobe />  // No props needed
```

**Features**:
- Canvas-based connection lines
- Pulsing language nodes
- Animated connections
- Real-time translation indicators
- Auto-updating active languages

**Languages** (editable in component):
```tsx
const languages = [
  { name: 'Spanish', flag: '🇪🇸', x: 20, y: 50 },
  // Add more languages with positions
];
```

---

## SmoothScroll Animations

**Purpose**: Scroll-triggered animations
**File**: `/src/components/animations/SmoothScroll.tsx`

### Single Element
```tsx
import { SmoothScroll } from '@/components/animations/SmoothScroll';

<SmoothScroll
  direction="up"      // 'up', 'down', 'left', 'right'
  delay={0.2}         // Delay in seconds
  duration={0.6}      // Animation duration
  className="..."     // Optional classes
>
  <YourContent />
</SmoothScroll>
```

### Stagger Children
```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations/SmoothScroll';

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>First item</StaggerItem>
  <StaggerItem>Second item</StaggerItem>
  <StaggerItem>Third item</StaggerItem>
</StaggerContainer>
```

**Features**:
- Intersection Observer based
- Animate once on scroll into view
- Customizable direction and timing
- Stagger children animations

---

## Custom Animations (CSS)

**File**: `/src/styles/custom-animations.css`

### Gradient Shift
```tsx
<div className="gradient-shift bg-gradient-purple-blue">
  Content with animated gradient
</div>
```

### Particle Float
```tsx
<div className="particle-float">
  Floating particle
</div>
```

### Text Shimmer
```tsx
<span className="text-shimmer">
  Shimmering text
</span>
```

### Hover Lift
```tsx
<div className="hover-lift">
  Card that lifts on hover
</div>
```

---

## Tailwind Custom Animations

**File**: `tailwind.config.ts`

### Morph
```tsx
<div className="animate-morph bg-civet-purple-500/20 rounded-full blur-3xl">
  Morphing blob shape
</div>
```

### Float
```tsx
<div className="animate-float w-4 h-4 bg-white/30 rounded-full">
  Floating particle
</div>

<div className="animate-float-slow w-5 h-5 bg-white/25 rounded-full">
  Slower floating particle
</div>
```

### Pulse Glow
```tsx
<div className="w-2 h-2 bg-civet-green-500 rounded-full animate-pulse-glow">
  Pulsing indicator
</div>
```

### Shimmer
```tsx
<div className="animate-shimmer">
  Shimmer effect
</div>
```

---

## Custom Shadows

**File**: `tailwind.config.ts`

### Purple Glow
```tsx
<div className="shadow-glow-purple">
  Card with purple glow
</div>
```

### Blue Glow
```tsx
<div className="shadow-glow-blue">
  Card with blue glow
</div>
```

### Float Shadow
```tsx
<div className="shadow-float">
  Elevated floating card
</div>
```

---

## Brand Colors

**File**: `tailwind.config.ts`

### Purple (Primary)
```tsx
<div className="bg-civet-purple-500 text-white">
  Primary color
</div>
<div className="bg-civet-purple-600">Darker shade</div>
<div className="bg-civet-purple-400">Lighter shade</div>
```

### Blue (Accent)
```tsx
<div className="bg-civet-blue-500 text-white">
  Accent color
</div>
<div className="bg-civet-blue-600">Darker shade</div>
<div className="bg-civet-blue-400">Lighter shade</div>
```

### Green (Success)
```tsx
<div className="bg-civet-green-500 text-white">
  Success color
</div>
```

### Warm Neutrals
```tsx
<div className="bg-warm-50">Lightest</div>
<div className="bg-warm-100">Very light</div>
<div className="bg-warm-200">Light</div>
<div className="bg-warm-800">Dark</div>
<div className="bg-warm-900">Darkest</div>
```

### Gradients
```tsx
<div className="bg-gradient-purple-blue">
  Purple to blue gradient
</div>

<div className="bg-shimmer-gradient">
  Shimmer gradient overlay
</div>
```

---

## Typography

**File**: `tailwind.config.ts`

### Display Sizes
```tsx
<h1 className="font-display text-display-xl">
  Extra large display (5rem)
</h1>

<h2 className="font-display text-display-lg">
  Large display (4rem)
</h2>

<h3 className="font-display text-display-md">
  Medium display (3rem)
</h3>
```

### Font Families
```tsx
<div className="font-display">Display font (SF Pro)</div>
<div className="font-sans">Body font (System)</div>
<div className="font-mono">Monospace (JetBrains Mono)</div>
```

---

## Responsive Patterns

### Mobile-First
```tsx
<div className="
  px-4           // Mobile: 16px padding
  md:px-6        // Tablet: 24px padding
  lg:px-8        // Desktop: 32px padding
">
  Responsive content
</div>
```

### Grid Layouts
```tsx
<div className="
  grid
  grid-cols-1       // Mobile: 1 column
  md:grid-cols-2    // Tablet: 2 columns
  lg:grid-cols-3    // Desktop: 3 columns
  gap-6
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## Best Practices

### Interactive Components
1. Always use `'use client'` directive
2. Add TypeScript interfaces for props
3. Include ARIA labels for accessibility
4. Make responsive with Tailwind breakpoints
5. Use Framer Motion for smooth animations

### Animations
1. Use `whileInView` with `viewport={{ once: true }}` for scroll animations
2. Keep duration between 0.3s - 0.8s for smooth feel
3. Use easing: `[0.21, 0.47, 0.32, 0.98]` for natural motion
4. Add `prefers-reduced-motion` support

### Performance
1. Lazy load heavy components with `dynamic()`
2. Use `viewport={{ once: true }}` to prevent re-animating
3. Optimize images with Next.js Image
4. Minimize JavaScript bundle size

### Accessibility
1. Add ARIA labels to interactive elements
2. Ensure keyboard navigation works
3. Test color contrast (WCAG AA)
4. Support reduced motion
5. Use semantic HTML

---

## Component Checklist

When creating new interactive components:

- [ ] Add `'use client'` directive
- [ ] Define TypeScript interface for props
- [ ] Use Framer Motion for animations
- [ ] Make responsive (mobile-first)
- [ ] Add ARIA labels
- [ ] Support keyboard navigation
- [ ] Use brand colors from config
- [ ] Test with reduced motion
- [ ] Add to this documentation
- [ ] Export from component file

---

## Quick Links

- Main README: `/README.md`
- Setup Guide: `/SETUP.md`
- Design Strategy: `/docs/MARKETING_DESIGN_STRATEGY.md`
- Tailwind Config: `/tailwind.config.ts`
- Custom Animations: `/src/styles/custom-animations.css`

---

**Need help?** Email hello@civet.io
