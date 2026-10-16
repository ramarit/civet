# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open http://localhost:3001

## Development Workflow

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your component
3. Export metadata for SEO
4. Add the page to the navbar if needed

Example:

```tsx
// src/app/my-page/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page - Civet',
  description: 'Description of my page',
};

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

### Adding New Components

Components are organized by purpose:

- `src/components/layout/` - Navbar, footer, etc.
- `src/components/home/` - Homepage-specific sections
- `src/components/shared/` - Reusable components
- `src/components/ui/` - UI primitives (buttons, cards, etc.)

### Styling

We use Tailwind CSS for styling. Common patterns:

```tsx
// Gradients
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Dark mode
className="bg-white dark:bg-gray-900"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hover states
className="hover:bg-gray-100 dark:hover:bg-gray-800"
```

### Animations

Use Framer Motion for animations:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Icons

We use Lucide React for icons:

```tsx
import { ArrowRight, Check, Globe } from 'lucide-react';

<ArrowRight className="h-5 w-5" />
```

## File Structure

```
apps/marketing/
├── public/                   # Static files
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/                  # Pages (Next.js App Router)
│   │   ├── layout.tsx        # Root layout with navbar/footer
│   │   ├── page.tsx          # Homepage
│   │   ├── globals.css       # Global styles
│   │   ├── pricing/
│   │   ├── features/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── docs/
│   ├── components/
│   │   ├── layout/           # Navbar, Footer
│   │   ├── home/             # Hero, Features, etc.
│   │   ├── shared/           # CTASection, Stats
│   │   └── ui/               # Button, Card, Accordion
│   └── lib/
│       └── utils.ts          # Utility functions
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Common Tasks

### Update Homepage Content

Edit files in `src/components/home/`:
- `hero.tsx` - Hero section
- `features.tsx` - Features grid
- `pricing-preview.tsx` - Pricing cards
- `testimonials.tsx` - Customer testimonials
- `faq.tsx` - FAQ section

### Update Pricing

Edit `src/app/pricing/page.tsx`:
- Update `tiers` array for pricing plans
- Update `faqs` array for FAQ items

### Add Blog Post

1. Add post data to `src/app/blog/[slug]/page.tsx`
2. Update post list in `src/app/blog/page.tsx`

### Update Navigation

Edit `src/components/layout/navbar.tsx`:
- Update `navigation` array to add/remove links

### Update Footer

Edit `src/components/layout/footer.tsx`:
- Update `footerLinks` object for footer sections

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Building for Production

```bash
# Build
npm run build

# Preview production build
npm run start
```

## Type Checking

```bash
npm run type-check
```

## Linting

```bash
npm run lint
```

## Performance Optimization

- Use `next/image` for all images
- Lazy load heavy components
- Minimize client-side JavaScript
- Use static generation where possible
- Optimize fonts with `next/font`

## SEO Checklist

- [ ] Add proper meta tags to each page
- [ ] Include Open Graph tags
- [ ] Add Twitter card tags
- [ ] Update sitemap.xml
- [ ] Verify robots.txt
- [ ] Add structured data where applicable
- [ ] Optimize page titles and descriptions
- [ ] Use semantic HTML

## Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios
- Add alt text to images

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
# Deploy .next folder to your host
```

## Troubleshooting

### Build Errors

- Run `npm run type-check` to find TypeScript errors
- Check that all environment variables are set
- Clear `.next` folder and rebuild

### Styling Issues

- Check Tailwind config
- Verify dark mode classes
- Inspect with browser DevTools

### Animation Issues

- Ensure Framer Motion is installed
- Check `initial`, `animate`, and `viewport` props
- Test with `viewport={{ once: true }}`

## Best Practices

1. **Components**: Keep them small and focused
2. **Styling**: Use Tailwind utilities, avoid custom CSS
3. **Images**: Always use `next/image`
4. **SEO**: Add metadata to every page
5. **Performance**: Code split heavy components
6. **Accessibility**: Test with keyboard and screen reader
7. **Dark Mode**: Always provide dark mode variants

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
