# Changelog

All notable changes to the Civet Widget SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-16

### Added
- Initial release of Civet Widget SDK
- Automatic content detection and translation
- Customizable language selector UI
- SEO-friendly URL rewriting (/en/, /fr/, etc.)
- Cookie-based language persistence
- DOM mutation observer for dynamic content
- LocalStorage caching with expiry
- TypeScript support with full type definitions
- Zero external dependencies
- XSS protection via text sanitization
- Dark mode support
- Mobile responsive design
- Performance optimizations (<50ms init, <10KB gzipped)
- Browser language auto-detection
- Configurable exclusion selectors
- Custom positioning for language selector
- Debug logging mode
- Lifecycle callbacks (onLanguageChange, onTranslationComplete, onError)
- Request deduplication and batching
- Comprehensive documentation and examples

### Core Features
- **Translator**: Fast text node extraction and translation
- **DOMObserver**: Efficient mutation detection with debouncing
- **APIClient**: Smart request batching and caching
- **LanguageSelector**: Accessible, customizable UI component
- **URLRewriter**: SEO-friendly URL handling
- **TranslationCache**: Intelligent localStorage management

### Performance
- Bundle size: <10KB gzipped
- Initialization: <50ms for typical websites
- Memory footprint: ~2MB for 1000 text nodes
- Zero layout thrashing
- Optimized tree walking with TreeWalker API
- Fast FNV-1a hashing for text deduplication

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Documentation
- Comprehensive README with integration guide
- Performance optimization notes
- Quick start guide
- Example HTML page
- TypeScript definitions

## [Unreleased]

### Planned
- Web Worker support for background translation
- IndexedDB for large translation caches
- Incremental viewport-based translation
- Server-side rendering support
- React/Vue/Angular component wrappers
- Analytics integration
- A/B testing support
- Custom translation API endpoints
- Translation memory management
- Offline mode support
