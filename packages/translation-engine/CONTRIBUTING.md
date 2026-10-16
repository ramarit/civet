# Contributing to Translation Engine

Thank you for your interest in contributing to the Translation Engine! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)
- Redis (optional, for cache testing)

### Setup Development Environment

1. Clone the repository:
```bash
git clone https://github.com/civet/translation-engine.git
cd translation-engine
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your API keys to .env
```

4. Build the project:
```bash
npm run build
```

5. Run tests (when available):
```bash
npm test
```

## Development Workflow

### Code Style

We use ESLint and TypeScript strict mode. Please ensure your code:
- Passes TypeScript compilation without errors
- Follows ESLint rules
- Uses consistent formatting
- Includes JSDoc comments for public APIs

Run linting:
```bash
npm run lint
npm run lint:fix
```

### Branch Naming

Use descriptive branch names:
- `feature/add-google-translate-provider`
- `fix/cache-key-collision`
- `docs/update-readme-examples`
- `refactor/improve-retry-logic`

### Commit Messages

Follow conventional commits:
```
feat: add Google Translate provider
fix: resolve cache key collision issue
docs: update README with new examples
refactor: improve retry logic performance
test: add tests for batch translation
chore: update dependencies
```

### TypeScript Guidelines

1. **Type Safety**: Always use explicit types, avoid `any`
2. **Interfaces**: Prefer interfaces for public APIs
3. **Generics**: Use generics for reusable components
4. **Null Safety**: Handle null/undefined explicitly
5. **Error Types**: Create specific error classes

Example:
```typescript
// Good
interface TranslationOptions {
  text: string;
  sourceLang: string;
  targetLang: string;
}

async function translate(options: TranslationOptions): Promise<TranslationResponse> {
  // Implementation
}

// Avoid
async function translate(text, from, to) {
  // Implementation
}
```

## Adding New Features

### Adding a New Provider

1. Create a new file in `src/providers/`:
```typescript
// src/providers/google.ts
import { BaseTranslationProvider } from './base';
import { TranslationRequest, TranslationResponse, ProviderConfig } from '../types';

export class GoogleTranslateProvider extends BaseTranslationProvider {
  readonly name = 'google' as const;
  readonly capabilities = {
    supportedLanguages: ['en', 'es', 'fr', /* ... */],
    qualityRatings: {
      'en-es': 93,
      // ...
    },
    costPerChar: 0.00005,
    avgLatency: 1200,
    maxCharsPerRequest: 50000,
  };

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    this.validateRequest(request);
    // Implementation
  }
}
```

2. Update `src/types.ts`:
```typescript
export type ProviderName = 'anthropic' | 'openai' | 'deepl' | 'google';
```

3. Update `src/index.ts`:
```typescript
import { GoogleTranslateProvider } from './providers/google';

// In initializeProviders:
if (config.providers.google) {
  providers.set('google', new GoogleTranslateProvider(config.providers.google));
}
```

4. Add tests for the new provider

5. Update documentation

### Adding a New Routing Strategy

1. Create a new class in `src/router/provider-router.ts`:
```typescript
export class CustomRouting implements RoutingStrategy {
  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    // Custom logic
  }
}
```

2. Export the class from the module

3. Add documentation and examples

### Adding New Quality Metrics

1. Extend the `QualityScorer` interface in `src/quality/scorer.ts`:
```typescript
export class AdvancedQualityScorer implements QualityScorer {
  async score(
    originalText: string,
    translation: TranslationResponse,
    sourceLang: string,
    targetLang: string
  ): Promise<QualityMetrics> {
    // Advanced scoring logic
  }
}
```

2. Register in `QualityScorerFactory`

3. Add tests and documentation

## Testing

### Writing Tests

Create tests in `__tests__` directories:

```typescript
// src/providers/__tests__/anthropic.test.ts
import { AnthropicProvider } from '../anthropic';

describe('AnthropicProvider', () => {
  let provider: AnthropicProvider;

  beforeEach(() => {
    provider = new AnthropicProvider({
      apiKey: 'test-key',
    });
  });

  it('should translate text', async () => {
    // Test implementation
  });

  it('should handle errors gracefully', async () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## Documentation

### Code Documentation

Use JSDoc comments for all public APIs:

```typescript
/**
 * Translates text from one language to another
 *
 * @param request - The translation request containing text and language codes
 * @returns A promise that resolves to the translation response
 * @throws {ValidationError} If the request is invalid
 * @throws {ProviderError} If the provider fails to translate
 *
 * @example
 * ```typescript
 * const result = await engine.translate({
 *   text: 'Hello',
 *   sourceLang: 'en',
 *   targetLang: 'es',
 * });
 * ```
 */
async translate(request: TranslationRequest): Promise<TranslationResponse> {
  // Implementation
}
```

### README Updates

When adding features:
1. Update the main README.md
2. Add examples to examples/
3. Update ARCHITECTURE.md if needed
4. Add entry to CHANGELOG.md

## Pull Request Process

### Before Submitting

1. Ensure all tests pass: `npm test`
2. Run linting: `npm run lint:fix`
3. Build successfully: `npm run build`
4. Update documentation
5. Add CHANGELOG entry

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing performed

## Documentation
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Code comments added
- [ ] Examples added/updated

## Checklist
- [ ] Code follows style guidelines
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Commits follow conventional commits
```

### Review Process

1. Submit PR with clear description
2. Address reviewer comments
3. Ensure CI passes (when set up)
4. Squash commits if needed
5. Maintainer will merge when approved

## Code Review Guidelines

### As a Reviewer

Look for:
- Code correctness
- Test coverage
- Performance implications
- Security issues
- Documentation completeness
- TypeScript type safety
- Error handling

### As an Author

Be prepared to:
- Explain design decisions
- Add tests as requested
- Update documentation
- Address performance concerns
- Fix security issues

## Performance Considerations

### Do's
- Use caching when appropriate
- Implement pagination for large datasets
- Use concurrent processing with limits
- Profile before optimizing
- Monitor memory usage

### Don'ts
- Don't add unnecessary dependencies
- Don't block the event loop
- Don't ignore memory leaks
- Don't skip error handling
- Don't commit large files

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security@civet.com with details
2. Include steps to reproduce
3. Provide proposed fix if available
4. Allow time for fix before disclosure

### Security Best Practices

1. Never commit API keys or secrets
2. Validate all user input
3. Sanitize error messages
4. Use environment variables for config
5. Keep dependencies updated
6. Follow OWASP guidelines

## Release Process

Maintainers only:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push --tags`
5. Publish to npm: `npm publish`
6. Create GitHub release

## Questions?

- Check existing documentation
- Search existing issues
- Open a new issue for discussion
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- CHANGELOG.md
- README.md (if significant contribution)
- Release notes

Thank you for contributing to Translation Engine!
