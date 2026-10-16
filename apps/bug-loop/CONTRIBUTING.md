# Contributing to Bug Loop

Thank you for your interest in contributing to Bug Loop! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/civet.git
   cd civet/apps/bug-loop
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your API keys and credentials
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch

Create a descriptive branch name:

```bash
git checkout -b feature/add-slack-notifications
git checkout -b fix/test-runner-timeout
git checkout -b docs/improve-deployment-guide
```

### 2. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm test

# Test manually
npm run dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add Slack notification integration"
git commit -m "fix: resolve test runner timeout issue"
git commit -m "docs: improve deployment instructions for AWS"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/add-slack-notifications
```

Then create a pull request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define types explicitly
- Avoid `any` types when possible

```typescript
// Good
interface BugReport {
  id: string;
  title: string;
  description: string;
}

async function processBug(bug: BugReport): Promise<void> {
  // Implementation
}

// Avoid
async function processBug(bug: any) {
  // Implementation
}
```

### Naming Conventions

- **Classes**: PascalCase (`BugAnalyzer`, `GitHubService`)
- **Functions**: camelCase (`analyzeBug`, `createIssue`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ATTEMPTS`, `DEFAULT_TIMEOUT`)
- **Files**: kebab-case (`bug-analyzer.ts`, `github.service.ts`)

### Code Organization

```typescript
// 1. Imports (organized)
import { external } from 'external-package';
import { local } from '../local-module';
import { types } from '../types';

// 2. Constants
const MAX_RETRIES = 3;

// 3. Types/Interfaces (if not in separate file)
interface Config {
  apiKey: string;
}

// 4. Class/Function definitions
export class MyService {
  // Implementation
}

// 5. Helper functions (if any)
function helperFunction() {
  // Implementation
}
```

### Error Handling

Always handle errors properly:

```typescript
// Good
try {
  await someOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  throw new Error(`Failed to complete operation: ${error.message}`);
}

// Also good - with specific error types
try {
  await apiCall();
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network error
  } else if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    throw error;
  }
}
```

### Logging

Use the Winston logger:

```typescript
import { logger } from '../utils/logger';

// Different log levels
logger.info('Bug processing started', { bugId: bug.id });
logger.warn('Fix attempt failed, retrying', { attempt: 2 });
logger.error('Critical error occurred', error);
logger.debug('Debug information', { data: someData });
```

## Testing

### Unit Tests

Write unit tests for all new functionality:

```typescript
// src/__tests__/my-feature.test.ts
import { MyFeature } from '../my-feature';

describe('MyFeature', () => {
  it('should do something', () => {
    const result = MyFeature.doSomething();
    expect(result).toBe('expected');
  });

  it('should handle errors', async () => {
    await expect(MyFeature.failingOperation()).rejects.toThrow();
  });
});
```

### Integration Tests

Test workflow integrations:

```typescript
describe('Bug Submission Workflow', () => {
  it('should process bug end-to-end', async () => {
    const bug = createTestBug();
    await workflow.handleNewBug(bug);

    const status = await db.getBugStatus(bug.id);
    expect(status.status).toBe('issue_created');
  });
});
```

### Test Coverage

Aim for >80% test coverage:

```bash
npm test -- --coverage
```

## Documentation

### Code Comments

- Add JSDoc comments for public APIs
- Explain "why" not "what"
- Keep comments up to date

```typescript
/**
 * Analyzes a bug report using Claude AI to determine severity,
 * complexity, and whether it can be automatically fixed.
 *
 * @param bug - The bug report to analyze
 * @param codeContext - Optional code context for better analysis
 * @returns Analysis results including auto-fixability assessment
 */
export async function analyzeBug(
  bug: BugReport,
  codeContext?: string
): Promise<BugAnalysis> {
  // Implementation
}
```

### README Updates

Update relevant documentation:

- README.md: User-facing features
- ARCHITECTURE.md: Technical changes
- DEPLOYMENT.md: Deployment changes
- QUICKSTART.md: Setup process changes

## Pull Request Guidelines

### PR Title

Use conventional commits format:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `test: add tests`
- `refactor: code refactoring`
- `chore: maintenance tasks`

### PR Description

Include:

1. **What**: What does this PR do?
2. **Why**: Why is this change needed?
3. **How**: How does it work?
4. **Testing**: How was it tested?
5. **Screenshots**: If UI changes

Example:

```markdown
## What
Adds Slack notification integration for bug status updates

## Why
Customers requested real-time notifications in Slack

## How
- Created new SlackService class
- Added webhook configuration
- Integrated with notification workflow

## Testing
- Unit tests for SlackService
- Manual testing with test Slack workspace
- Verified all notification types

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] Linter passes
- [x] Tested locally
```

## What to Contribute

### Good First Issues

Look for issues labeled `good first issue`:

- Documentation improvements
- Adding tests
- Fixing typos
- Small bug fixes

### Feature Requests

Before implementing major features:

1. Open an issue to discuss
2. Get maintainer approval
3. Implement and submit PR

### Bug Fixes

1. Create issue describing the bug
2. Reference issue in PR
3. Add test that reproduces the bug
4. Implement fix
5. Verify test now passes

## Areas for Contribution

### High Priority

- **Additional Integrations**: Slack, Discord, Jira
- **Authentication**: API key/JWT authentication
- **Rate Limiting**: Prevent abuse
- **Caching**: Improve performance
- **Metrics**: Prometheus/Grafana integration

### Medium Priority

- **Web Dashboard**: UI for bug tracking
- **Advanced AI**: Custom fix strategies
- **Multi-repo**: Support multiple repositories
- **Duplicate Detection**: Identify similar bugs
- **Auto-merge**: Safe automatic PR merging

### Documentation

- **Tutorials**: Step-by-step guides
- **Examples**: More usage examples
- **Videos**: Screencasts/demos
- **Blog Posts**: Case studies

## Code Review Process

### What Reviewers Look For

1. **Code Quality**: Clean, readable, maintainable
2. **Tests**: Adequate test coverage
3. **Documentation**: Updated and accurate
4. **Performance**: No obvious bottlenecks
5. **Security**: No vulnerabilities
6. **Breaking Changes**: Backwards compatibility

### Responding to Feedback

- Be open to suggestions
- Ask questions if unclear
- Make requested changes
- Update PR when ready for re-review

## Release Process

Maintainers handle releases:

1. Version bump (semantic versioning)
2. Changelog update
3. Git tag
4. npm publish (if applicable)
5. GitHub release

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue
- **Chat**: Join our Discord (if available)
- **Email**: support@civet.dev

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to Bug Loop!
