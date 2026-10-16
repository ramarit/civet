# Bug Loop - Complete File Structure

```
bug-loop/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── .env.example              # Environment variables template
│   ├── .eslintrc.js              # ESLint configuration
│   ├── jest.config.js            # Jest testing configuration
│   ├── .gitignore                # Git ignore rules
│   └── .dockerignore             # Docker ignore rules
│
├── 🐳 Docker Files
│   ├── Dockerfile                # Production Docker image
│   └── docker-compose.yml        # Multi-container setup
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── QUICKSTART.md             # Quick setup guide
│   ├── ARCHITECTURE.md           # Technical architecture
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── PROJECT_SUMMARY.md        # Project overview
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── FILE_STRUCTURE.md         # This file
│
├── 🔧 GitHub Actions
│   └── .github/
│       └── workflows/
│           └── bug-loop.yml      # CI/CD pipeline
│
├── 📝 Examples
│   ├── examples/
│   │   ├── bug-submission.json   # Example bug report
│   │   └── curl-examples.sh      # API usage examples
│
├── 📊 Logs
│   └── logs/
│       └── .gitkeep              # Placeholder for log files
│
└── 💻 Source Code
    └── src/
        ├── index.ts              # Application entry point
        ├── server.ts             # Express server & webhooks
        │
        ├── 📂 types/
        │   └── index.ts          # TypeScript type definitions
        │
        ├── 📂 workflows/
        │   ├── bug-submission.ts     # Handle new bug submissions
        │   ├── auto-fix.ts           # Automated fix attempts
        │   ├── github-integration.ts # GitHub webhook handlers
        │   └── notification.ts       # Email notifications
        │
        ├── 📂 ai/
        │   ├── bug-analyzer.ts   # Bug analysis with Claude
        │   ├── fix-generator.ts  # Fix generation with Claude
        │   └── code-reviewer.ts  # Code review with Claude
        │
        ├── 📂 services/
        │   ├── github.service.ts        # GitHub API operations
        │   ├── test-runner.service.ts   # Test execution
        │   └── notification.service.ts  # Email sending
        │
        ├── 📂 db/
        │   └── bug-tracking.ts   # Database queries
        │
        ├── 📂 utils/
        │   └── logger.ts         # Winston logger
        │
        └── 📂 __tests__/
            ├── bug-analyzer.test.ts  # Bug analyzer tests
            └── server.test.ts        # Server API tests
```

## File Categories

### Core Application (Entry Points)
- `src/index.ts` - Main application entry point, initializes database and server
- `src/server.ts` - Express server setup, API routes, webhook handlers

### Type Definitions
- `src/types/index.ts` - All TypeScript interfaces and types

### Workflows (Business Logic)
- `src/workflows/bug-submission.ts` - Orchestrates new bug processing
- `src/workflows/auto-fix.ts` - Manages automated fix attempts
- `src/workflows/github-integration.ts` - Handles GitHub webhook events
- `src/workflows/notification.ts` - Email notification logic

### AI Services (Claude Integration)
- `src/ai/bug-analyzer.ts` - Analyzes bugs with Claude
- `src/ai/fix-generator.ts` - Generates code fixes with Claude
- `src/ai/code-reviewer.ts` - Reviews fixes with Claude

### External Services
- `src/services/github.service.ts` - GitHub API wrapper (Octokit)
- `src/services/test-runner.service.ts` - Test execution service
- `src/services/notification.service.ts` - Email service (Nodemailer)

### Data Layer
- `src/db/bug-tracking.ts` - PostgreSQL database operations

### Utilities
- `src/utils/logger.ts` - Winston logging configuration

### Tests
- `src/__tests__/bug-analyzer.test.ts` - Unit tests for bug analyzer
- `src/__tests__/server.test.ts` - API endpoint tests

## Key Directories

### `/src`
All TypeScript source code

### `/logs`
Runtime logs (created automatically)
- `error.log` - Error-level logs
- `combined.log` - All logs

### `/examples`
Example requests and usage

### `/.github`
GitHub Actions CI/CD configuration

### `/dist` (generated)
Compiled JavaScript (created by `npm run build`)

### `/node_modules` (generated)
Installed dependencies (created by `npm install`)

### `/coverage` (generated)
Test coverage reports (created by `npm test -- --coverage`)

## Configuration Files Explained

### package.json
- Dependencies: All npm packages
- Scripts: Build, dev, test commands
- Metadata: Name, version, license

### tsconfig.json
- TypeScript compiler options
- Strict type checking enabled
- ES2022 target

### .env.example
- Template for environment variables
- Lists all required/optional configs
- Copy to `.env` and fill in

### .eslintrc.js
- Code style rules
- TypeScript-specific linting
- Error and warning configurations

### jest.config.js
- Test framework setup
- Coverage settings
- File patterns

### Dockerfile
- Production Docker image
- Multi-stage build
- Node.js 20 Alpine

### docker-compose.yml
- Local development setup
- PostgreSQL + App services
- Volume configurations

## Documentation Files

### README.md (Main)
Complete system documentation with:
- Feature overview
- Installation steps
- API reference
- Configuration guide
- Troubleshooting

### QUICKSTART.md
Fast setup guide for:
- Prerequisites
- 5-minute setup
- First bug submission
- Common issues

### ARCHITECTURE.md
Technical deep-dive:
- System design
- Data flow
- AI integration
- Database schema
- Extension points

### DEPLOYMENT.md
Production deployment:
- Docker deployment
- Manual server setup
- Cloud platforms (AWS, GCP, Azure)
- Security best practices
- Monitoring

### PROJECT_SUMMARY.md
High-level overview:
- What it does
- Key features
- Technology stack
- Use cases

### CONTRIBUTING.md
For contributors:
- Development workflow
- Code style
- Testing guidelines
- PR process

## Example Files

### examples/bug-submission.json
Complete bug report example with:
- All fields populated
- Realistic scenario
- Proper formatting

### examples/curl-examples.sh
Shell script with:
- Multiple API call examples
- Different bug scenarios
- Health check

## Generated at Runtime

These files/folders are created when running the app:

```
logs/
├── error.log          # Error-level logs
└── combined.log       # All logs

dist/                  # Compiled JavaScript
├── index.js
├── server.js
└── ...

node_modules/          # Dependencies

coverage/              # Test coverage reports
```

## Total File Count

- **Source Files**: 17 TypeScript files
- **Config Files**: 7 configuration files
- **Documentation**: 7 markdown files
- **Examples**: 2 example files
- **Tests**: 2 test files
- **CI/CD**: 1 GitHub Actions workflow

**Total**: 36 files (excluding generated files)

## File Size Estimates

- Total source code: ~5,000 lines
- Documentation: ~3,000 lines
- Tests: ~200 lines
- Config: ~300 lines

**Total**: ~8,500 lines of code and documentation
