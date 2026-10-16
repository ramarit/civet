# Contributing to Civet Widget SDK

Thank you for your interest in contributing to the Civet Widget SDK!

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge
- Understanding of browser APIs

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/civet/civet.git
   cd civet/packages/widget-sdk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```

5. **Open the example page**
   ```bash
   open example.html
   ```

## Project Structure

```
widget-sdk/
├── src/
│   ├── core/           # Core translation logic
│   │   ├── translator.ts
│   │   ├── dom-observer.ts
│   │   └── api-client.ts
│   ├── ui/             # UI components
│   │   ├── language-selector.ts
│   │   └── styles.css
│   ├── utils/          # Utilities
│   │   ├── cache.ts
│   │   ├── url-rewriter.ts
│   │   └── helpers.ts
│   ├── types.ts        # TypeScript definitions
│   └── index.ts        # Main entry point
├── dist/               # Build output
├── example.html        # Demo page
└── package.json
```

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Performance Rules

1. **No synchronous layout calculations**
   - Avoid reading layout properties (offsetHeight, etc.) in loops
   - Batch DOM updates

2. **Minimize bundle size**
   - No external dependencies
   - Tree-shakeable code
   - Minification-friendly patterns

3. **Memory efficiency**
   - Use WeakMap for DOM references
   - Clean up event listeners
   - Implement proper disposal patterns

4. **Async operations**
   - Use async/await for API calls
   - Implement request deduplication
   - Add timeout handling

### Testing Checklist

Before submitting:

- [ ] Code builds without errors (`npm run build`)
- [ ] TypeScript types are correct (`npm run build:types`)
- [ ] Bundle size is acceptable (`npm run analyze`)
- [ ] Example page works correctly
- [ ] No console errors or warnings
- [ ] Performance is acceptable (use Performance tab)
- [ ] Memory doesn't leak (use Memory profiler)
- [ ] Works in all supported browsers

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome Android (latest)

### Performance Benchmarks

Maintain these targets:

- Bundle size: <10KB gzipped
- Init time: <50ms (1000 nodes)
- Translation switch: <100ms (cached)
- Memory: <2MB (1000 nodes)

## Making Changes

### Feature Development

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

### Bug Fixes

1. Create a bug fix branch:
   ```bash
   git checkout -b fix/bug-description
   ```

2. Add a test case that reproduces the bug
3. Fix the bug
4. Verify the test passes
5. Submit a pull request

### Documentation Updates

- Update README.md for user-facing changes
- Update PERFORMANCE.md for performance-related changes
- Update CHANGELOG.md following Keep a Changelog format
- Add JSDoc comments for new public APIs

## Pull Request Process

1. **Describe your changes**
   - What problem does it solve?
   - What is the solution?
   - Any breaking changes?

2. **Include tests**
   - Add example usage in example.html
   - Test in multiple browsers

3. **Update documentation**
   - README.md
   - CHANGELOG.md
   - JSDoc comments

4. **Keep it focused**
   - One feature/fix per PR
   - Small, reviewable changes

5. **Performance check**
   - Run bundle analysis
   - Check init time hasn't regressed
   - Verify memory usage

## Performance Testing

### Bundle Size

```bash
npm run analyze
```

Look for:
- Total bundle size
- Largest modules
- Opportunities for optimization

### Runtime Performance

Use Chrome DevTools:

1. **Performance Tab**
   ```javascript
   // Add performance marks in code
   const mark = perfMark('operation');
   // ... do work ...
   const duration = mark();
   ```

2. **Memory Tab**
   - Take heap snapshot before/after
   - Look for retained objects
   - Check for detached DOM nodes

3. **Network Tab**
   - Verify request deduplication
   - Check cache headers
   - Monitor payload sizes

### Load Testing

Test with various page sizes:
- 100 text nodes
- 1,000 text nodes
- 5,000 text nodes
- 10,000 text nodes

## Code Review

We review PRs for:

1. **Correctness**
   - Does it work as intended?
   - Are there edge cases?

2. **Performance**
   - Bundle size impact
   - Runtime performance
   - Memory usage

3. **Code quality**
   - Readable and maintainable
   - Follows project patterns
   - Well-documented

4. **Backward compatibility**
   - Breaking changes?
   - Migration path?

## Release Process

(For maintainers)

1. Update version in package.json
2. Update CHANGELOG.md
3. Run build: `npm run build`
4. Test build: Open example.html
5. Create git tag
6. Publish to npm: `npm publish`
7. Create GitHub release

## Questions?

- Open an issue for bugs/features
- Email: dev@civet.ai
- Discord: https://discord.gg/civet

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
