# Quick Start Guide

Get started with the Civet Widget SDK in under 5 minutes.

## Step 1: Get Your Project ID

1. Sign up at [https://civet.ai](https://civet.ai)
2. Create a new project
3. Copy your project ID from the dashboard

## Step 2: Add the Widget

Add this snippet to your website's `<head>` section:

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

Replace `YOUR_PROJECT_ID` with your actual project ID.

## Step 3: Configure Languages (Optional)

By default, the widget supports all major languages. To restrict to specific languages:

```html
<script>
(function(w,d,s){
  w.civet=w.civet||{};
  var script=d.createElement(s);
  script.async=true;
  script.src='https://cdn.civet.ai/widget.js';
  script.setAttribute('data-project','YOUR_PROJECT_ID');
  script.setAttribute('data-default-lang','en');
  d.head.appendChild(script);
})(window,document,'script');
</script>
```

## Step 4: Test It

1. Load your website
2. You should see a language selector in the top-right corner
3. Click it and select a language
4. Your page content should translate automatically

## Step 5: SEO Setup (Recommended)

Add hreflang tags to your `<head>`:

```html
<link rel="alternate" hreflang="en" href="https://yoursite.com/" />
<link rel="alternate" hreflang="fr" href="https://yoursite.com/fr/" />
<link rel="alternate" hreflang="es" href="https://yoursite.com/es/" />
<link rel="alternate" hreflang="x-default" href="https://yoursite.com/" />
```

Configure your server to serve the same HTML for all language URLs:

**Nginx:**
```nginx
location ~ ^/(en|fr|es|de|it|pt|ja|zh|ko|ar)/ {
  try_files $uri $uri/ /index.html;
}
```

**Apache:**
```apache
RewriteEngine On
RewriteRule ^(en|fr|es|de|it|pt|ja|zh|ko|ar)/ /index.html [L]
```

## Advanced Usage

### Programmatic Installation

```javascript
import CivetWidget from '@civet/widget-sdk';

const widget = new CivetWidget({
  projectId: 'YOUR_PROJECT_ID',
  defaultLanguage: 'en',
  targetLanguages: ['en', 'fr', 'es', 'de'],
  onLanguageChange: (lang) => {
    console.log('Language changed to:', lang);
  }
});

await widget.init();
```

### Excluding Content

Use `data-civet-no-translate` attribute:

```html
<div data-civet-no-translate>
  This won't be translated
</div>
```

### Custom Language Selector Position

```javascript
new CivetWidget({
  projectId: 'YOUR_PROJECT_ID',
  selectorPosition: 'bottom-left' // or 'top-left', 'bottom-right', 'custom'
});
```

### Using a Custom Element

```javascript
new CivetWidget({
  projectId: 'YOUR_PROJECT_ID',
  customSelectorElement: document.getElementById('my-language-selector')
});
```

## Troubleshooting

### Widget not appearing?

1. Check browser console for errors
2. Verify your project ID is correct
3. Make sure the script is loaded (check Network tab)

### Translations not working?

1. Verify your project has translations configured
2. Check that target languages are enabled in your project
3. Clear browser cache and localStorage

### Performance issues?

1. Use `excludeSelectors` to reduce translatable content:
   ```javascript
   new CivetWidget({
     projectId: 'YOUR_PROJECT_ID',
     excludeSelectors: ['.no-translate', 'code', 'pre']
   });
   ```

2. Enable caching (enabled by default):
   ```javascript
   new CivetWidget({
     projectId: 'YOUR_PROJECT_ID',
     enableCache: true,
     cacheExpiry: 7 // days
   });
   ```

## Next Steps

- Read the [full documentation](README.md)
- Check out [performance optimization notes](PERFORMANCE.md)
- Join our [community Discord](#)
- Report issues on [GitHub](#)

## Support

Need help?
- Email: support@civet.ai
- Docs: https://docs.civet.ai
- Discord: https://discord.gg/civet
