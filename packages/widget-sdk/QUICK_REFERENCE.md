# Quick Reference Card

## Installation Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development watch mode
npm run dev

# Analyze bundle size
npm run analyze

# Verify setup
./verify-setup.sh
```

## Integration Snippet

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

## Programmatic Usage

```javascript
import CivetWidget from '@civet/widget-sdk';

const widget = new CivetWidget({
  projectId: 'YOUR_PROJECT_ID',
  defaultLanguage: 'en',
  targetLanguages: ['en', 'fr', 'es'],
  onLanguageChange: (lang) => console.log(lang)
});

await widget.init();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `projectId` | string | *required* | Your Civet project ID |
| `apiUrl` | string | `'https://api.civet.ai'` | API endpoint |
| `defaultLanguage` | string | `'en'` | Default language code |
| `targetLanguages` | string[] | all | Available languages |
| `autoDetect` | boolean | `true` | Auto-detect browser language |
| `selectorPosition` | string | `'top-right'` | Language selector position |
| `excludeSelectors` | string[] | `[]` | CSS selectors to exclude |
| `enableCache` | boolean | `true` | Enable localStorage caching |
| `cacheExpiry` | number | `7` | Cache expiry in days |
| `cookieName` | string | `'civet_lang'` | Cookie name for language |
| `cookieExpiry` | number | `365` | Cookie expiry in days |
| `debug` | boolean | `false` | Enable debug logging |

## API Methods

```javascript
// Change language
await widget.changeLanguage('fr');

// Get current language
const lang = widget.getCurrentLanguage();

// Get statistics
const stats = widget.getStats();

// Clear cache
widget.clearCache();

// Destroy widget
widget.destroy();
```

## Exclude Content from Translation

```html
<!-- Using attribute -->
<div data-civet-no-translate>
  This won't be translated
</div>

<!-- Using CSS selector (in config) -->
<script>
new CivetWidget({
  projectId: 'xxx',
  excludeSelectors: ['.no-translate', 'code', 'pre']
});
</script>
```

## SEO Setup

```html
<!-- Add hreflang tags -->
<link rel="alternate" hreflang="en" href="https://example.com/" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

```nginx
# Nginx configuration
location ~ ^/(en|fr|es|de)/ {
  try_files $uri $uri/ /index.html;
}
```

## File Structure

```
widget-sdk/
├── src/
│   ├── core/              # Translation logic
│   ├── ui/                # UI components
│   ├── utils/             # Utilities
│   ├── index.ts           # Main entry
│   └── types.ts           # TypeScript types
├── dist/                  # Build output
├── example.html           # Demo page
└── docs/                  # Documentation
```

## Build Outputs

- `dist/civet.js` - IIFE for `<script>` tags
- `dist/civet.esm.js` - ESM for bundlers
- `dist/index.d.ts` - TypeScript definitions

## Performance Metrics

- Bundle size: <10KB gzipped ✓
- Init time: <50ms (1K nodes) ✓
- Language switch: <100ms (cached) ✓
- Memory: ~2MB (1K nodes) ✓

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+)

## Callbacks

```javascript
new CivetWidget({
  projectId: 'xxx',
  onLanguageChange: (lang) => {
    console.log('Language:', lang);
  },
  onTranslationComplete: () => {
    console.log('Translation done');
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Widget not loading | Check project ID, verify CDN URL |
| No translations | Check API endpoint, verify target language |
| Performance issues | Add `excludeSelectors`, enable cache |
| Build fails | Run `npm install`, check TypeScript version |

## Documentation Files

- `README.md` - Main documentation
- `QUICKSTART.md` - 5-minute setup guide
- `PERFORMANCE.md` - Performance optimization
- `CONTRIBUTING.md` - Development guide
- `BUILD_GUIDE.md` - Build instructions
- `PROJECT_SUMMARY.md` - Complete overview

## Support

- Docs: https://docs.civet.ai
- Email: support@civet.ai
- GitHub: https://github.com/civet/civet

## License

MIT License
