# Civet Widget SDK

Production-ready JavaScript widget for website translation. Lightweight, fast, and SEO-friendly.

## Features

- **Automatic content detection** - Translates all text content on the page
- **Language selector UI** - Beautiful, customizable language dropdown
- **SEO-friendly URLs** - Clean `/en/`, `/fr/` URL structure
- **Smart caching** - LocalStorage caching with expiry
- **Dynamic content support** - Mutation observer for SPA/dynamic content
- **Minimal performance impact** - <50ms initialization, <10KB gzipped
- **Cookie persistence** - Remembers user language preference
- **Dark mode support** - Automatic dark mode detection
- **Mobile responsive** - Optimized for all screen sizes
- **XSS protection** - Safe text sanitization

## Installation

### Via CDN (Recommended)

Add this snippet to your HTML `<head>`:

```html
<script>
(function(w,d,s){
  w.civet=w.civet||{};
  var script=d.createElement(s);
  script.async=true;
  script.src='https://cdn.civet.ai/widget.js';
  script.setAttribute('data-project','YOUR_PROJECT_ID');
  d.head.appendChild(script);
})(window,document,'script');
</script>
```

### Via NPM

```bash
npm install @civet/widget-sdk
```

```javascript
import CivetWidget from '@civet/widget-sdk';

const widget = new CivetWidget({
  projectId: 'YOUR_PROJECT_ID'
});

widget.init();
```

## Configuration

### Basic Configuration

```html
<script
  src="https://cdn.civet.ai/widget.js"
  data-project="YOUR_PROJECT_ID"
  data-default-lang="en"
  data-api-url="https://api.civet.ai"
></script>
```

### Advanced Configuration (Programmatic)

```javascript
const widget = new CivetWidget({
  // Required
  projectId: 'YOUR_PROJECT_ID',

  // Optional
  apiUrl: 'https://api.civet.ai',
  defaultLanguage: 'en',
  targetLanguages: ['en', 'es', 'fr', 'de'],
  autoDetect: true,

  // UI Configuration
  selectorPosition: 'top-right', // 'top-left' | 'bottom-right' | 'bottom-left' | 'custom'
  customSelectorElement: document.getElementById('my-selector'),

  // Exclusions
  excludeSelectors: ['.no-translate', '#header'],

  // Caching
  enableCache: true,
  cacheExpiry: 7, // days

  // Cookies
  cookieName: 'civet_lang',
  cookieDomain: '.example.com',
  cookieExpiry: 365, // days

  // Callbacks
  onLanguageChange: (language) => {
    console.log('Language changed to:', language);
  },
  onTranslationComplete: () => {
    console.log('Translation complete');
  },
  onError: (error) => {
    console.error('Translation error:', error);
  },

  // Debug
  debug: false
});

await widget.init();
```

## API Reference

### Methods

#### `init()`

Initialize the widget. Must be called after instantiation.

```javascript
await widget.init();
```

#### `changeLanguage(language: string)`

Programmatically change the language.

```javascript
await widget.changeLanguage('es');
```

#### `getCurrentLanguage()`

Get the current language code.

```javascript
const lang = widget.getCurrentLanguage(); // 'es'
```

#### `getStats()`

Get widget statistics for debugging.

```javascript
const stats = widget.getStats();
// {
//   storedLanguages: 2,
//   totalNodes: 450,
//   currentLanguage: 'es',
//   cacheSize: 12345,
//   observerActive: true,
//   queueSize: 0
// }
```

#### `clearCache()`

Clear all cached translations.

```javascript
widget.clearCache();
```

#### `destroy()`

Destroy the widget and clean up resources.

```javascript
widget.destroy();
```

## Excluding Content from Translation

Use the `data-civet-no-translate` attribute:

```html
<div data-civet-no-translate>
  This content will not be translated
</div>
```

Or configure exclusions programmatically:

```javascript
new CivetWidget({
  projectId: 'YOUR_PROJECT_ID',
  excludeSelectors: [
    '.no-translate',
    '#navigation',
    '[data-keep-original]'
  ]
});
```

## SEO Best Practices

### URL Structure

The widget automatically creates SEO-friendly URLs:

```
https://example.com/        -> Default language (en)
https://example.com/fr/     -> French
https://example.com/es/     -> Spanish
```

### Hreflang Tags

Add hreflang tags for SEO:

```html
<link rel="alternate" hreflang="en" href="https://example.com/" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/" />
<link rel="alternate" hreflang="es" href="https://example.com/es/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

### Server-Side Setup

For SEO, configure your server to serve the same HTML for all language URLs:

**Nginx:**
```nginx
location ~ ^/(en|fr|es|de)/ {
  try_files $uri $uri/ /index.html;
}
```

**Apache:**
```apache
RewriteEngine On
RewriteRule ^(en|fr|es|de)/ /index.html [L]
```

## Framework Integration

### React

```jsx
import { useEffect } from 'react';
import CivetWidget from '@civet/widget-sdk';

function App() {
  useEffect(() => {
    const widget = new CivetWidget({
      projectId: 'YOUR_PROJECT_ID',
      onLanguageChange: (lang) => {
        console.log('Language:', lang);
      }
    });

    widget.init();

    return () => widget.destroy();
  }, []);

  return <div>Your app</div>;
}
```

### Vue

```vue
<template>
  <div>Your app</div>
</template>

<script>
import CivetWidget from '@civet/widget-sdk';

export default {
  mounted() {
    this.widget = new CivetWidget({
      projectId: 'YOUR_PROJECT_ID'
    });
    this.widget.init();
  },
  beforeUnmount() {
    this.widget?.destroy();
  }
};
</script>
```

### Next.js

```javascript
// app/layout.js
'use client';

import { useEffect } from 'react';
import CivetWidget from '@civet/widget-sdk';

export default function RootLayout({ children }) {
  useEffect(() => {
    const widget = new CivetWidget({
      projectId: process.env.NEXT_PUBLIC_CIVET_PROJECT_ID
    });

    widget.init();

    return () => widget.destroy();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Performance

The Civet widget is optimized for minimal performance impact:

- **Initial load**: <50ms
- **Bundle size**: <10KB gzipped
- **Memory footprint**: ~2MB for 1000 text nodes
- **Translation switch**: <100ms for cached languages
- **DOM mutations**: Batched and debounced (100ms delay)

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization notes.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Troubleshooting

### Widget not initializing

Check that:
1. `data-project` attribute is set correctly
2. Script is loaded before `</body>` or uses `async`
3. No console errors

### Translations not appearing

Check:
1. API endpoint is reachable
2. Project ID is valid
3. Target language is configured in your Civet project
4. Check browser console for errors

### Performance issues

1. Reduce the number of translatable nodes using `excludeSelectors`
2. Enable caching (default: enabled)
3. Increase mutation observer debounce delay

## Support

- Documentation: https://docs.civet.ai
- Email: support@civet.ai
- GitHub: https://github.com/civet/civet

## License

MIT License - see LICENSE file for details
