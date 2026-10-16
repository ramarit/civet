# Build Guide

## Quick Build

```bash
npm install
npm run build
```

This creates:
- `dist/civet.js` - IIFE build for `<script>` tag usage
- `dist/civet.esm.js` - ESM build for `import` statements
- `dist/index.d.ts` - TypeScript type definitions
- Source maps for debugging

## Build Scripts

### `npm run build`
Builds all outputs (ESM + IIFE + types)

### `npm run build:esm`
Builds ES module version only

### `npm run build:iife`
Builds IIFE version only (for script tags)

### `npm run build:types`
Generates TypeScript declarations

### `npm run dev`
Watch mode - rebuilds on file changes

### `npm run analyze`
Analyzes bundle size and composition

## Testing the Build

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Open example page**
   ```bash
   open example.html
   ```

3. **Check browser console**
   - Should see "Civet widget loaded successfully"
   - Check for any errors

4. **Test language switching**
   - Click language selector in top-right
   - Switch between languages
   - Verify translations work

## Build Output

### IIFE Build (dist/civet.js)
- Global variable: `CivetWidget`
- Target: ES2015 for broad browser support
- Size: ~9KB gzipped
- Auto-initializes from script tag attributes

### ESM Build (dist/civet.esm.js)
- Named export: `CivetWidget`
- Default export: `CivetWidget`
- Target: ES2020
- Size: ~8.5KB gzipped
- For modern bundlers (webpack, rollup, vite)

### TypeScript Definitions (dist/index.d.ts)
- Full type definitions
- JSDoc comments included
- Auto-generated from source

## Optimizations Applied

1. **Minification**
   - Variable name shortening
   - Dead code elimination
   - Whitespace removal

2. **Tree Shaking**
   - Unused exports removed
   - Side-effect free code
   - Import optimization

3. **CSS Inlining**
   - No external CSS file
   - Injected at runtime
   - Minified and compressed

4. **Zero Dependencies**
   - No external libraries
   - Smaller bundle size
   - Faster builds

## Bundle Analysis

Run `npm run analyze` to see:
- Module sizes
- Import graph
- Optimization opportunities

Example output:
```
dist/civet.js  9.2kb (3.1kb gzipped)
dist/civet.esm.js  8.5kb (2.9kb gzipped)

  src/index.ts ────────────────────────────── 12.3kb
  src/core/translator.ts ─────────────────────  8.7kb
  src/ui/language-selector.ts ───────────────  7.2kb
  src/core/dom-observer.ts ──────────────────  6.1kb
  ...
```

## Troubleshooting

### Build fails with TypeScript errors
- Check `tsconfig.json` is valid
- Run `npm install` to ensure TypeScript is installed
- Verify all imports are correct

### Bundle size too large
- Run `npm run analyze` to identify large modules
- Check for unused imports
- Verify tree shaking is working

### Source maps not working
- Ensure `--sourcemap` flag in build scripts
- Check browser DevTools settings
- Verify `dist/*.map` files exist

## Production Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Upload to CDN**
   - Upload `dist/civet.js` to CDN
   - Set appropriate cache headers
   - Enable gzip compression on server

3. **CDN Headers** (recommended)
   ```
   Cache-Control: public, max-age=31536000, immutable
   Content-Type: application/javascript; charset=utf-8
   Content-Encoding: gzip
   ```

4. **Versioning**
   - Use version in filename: `civet.v1.0.0.js`
   - Or use CDN versioning
   - Update integration snippets

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run analyze
      # Upload to CDN or artifact storage
```

## Performance Targets

Maintain these metrics:

- Bundle size (IIFE): <10KB gzipped ✓
- Bundle size (ESM): <9KB gzipped ✓
- Build time: <5 seconds ✓
- Type generation: <3 seconds ✓

## Next Steps

After building:
1. Test in example.html
2. Test in target browsers
3. Run performance benchmarks
4. Deploy to CDN
5. Update documentation with CDN URL
