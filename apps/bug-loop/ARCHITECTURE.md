# Bug Loop Architecture

## System Overview

Bug Loop is an intelligent, automated bug tracking and resolution system that leverages Claude AI to analyze, fix, and manage software bugs from submission to resolution.

## Core Components

### 1. API Server (server.ts)
- **Express Server**: REST API and webhook handler
- **Endpoints**:
  - `POST /api/bugs`: Bug submission endpoint
  - `POST /api/webhooks/github`: GitHub webhook receiver
  - `GET /health`: Health check
- **Webhooks**: Listens for GitHub events (PR merges, issue comments)

### 2. Workflows

#### Bug Submission Workflow
```
Customer submits bug → Save to DB → Send confirmation →
AI analysis → Create GitHub issue → Attempt auto-fix (if applicable)
```

#### Auto-Fix Workflow
```
Create branch → Generate fix with AI → Review fix →
Apply changes → Run tests → Create PR (if tests pass)
```

#### GitHub Integration Workflow
```
PR merged → Find associated bug → Close issue →
Update status → Notify customer
```

### 3. AI Services

#### Bug Analyzer
- Analyzes bug reports using Claude
- Determines:
  - Severity and priority
  - Complexity estimation
  - Affected components
  - Auto-fixability assessment
  - Related files

#### Fix Generator
- Generates code fixes using Claude
- Reads affected files
- Produces complete file modifications
- Provides reasoning for changes

#### Code Reviewer
- Reviews generated fixes for quality
- Checks for:
  - Correctness
  - Side effects
  - Code quality
  - Security concerns
  - Test coverage needs

### 4. External Services

#### GitHub Service
- **Issue Management**: Create, update, close issues
- **Branch Management**: Create feature branches
- **PR Management**: Create pull requests with detailed descriptions
- **Commit Management**: Push code changes to branches

#### Test Runner Service
- Executes test suites
- Parses test output (Jest, Mocha, Vitest)
- Validates fixes before PR creation

#### Notification Service
- SMTP email notifications
- Status updates at each workflow stage
- Customized email templates

### 5. Database Layer

#### Tables
- **bugs**: Bug report details
- **bug_status**: Current status and GitHub references
- **fix_attempts**: History of automated fix attempts
- **bug_analysis**: AI analysis results

#### Operations
- CRUD operations for all entities
- Transaction support
- Status tracking

## Data Flow

```
┌─────────────┐
│  Customer   │
└──────┬──────┘
       │ POST /api/bugs
       ▼
┌─────────────────┐
│   API Server    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Bug Submission  │─────▶│  Database    │
│    Workflow     │      └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bug Analyzer   │
│   (Claude AI)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Service  │
│ (Create Issue)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auto-Fix       │
│  Workflow       │
└────────┬────────┘
         │
         ├─────▶ Fix Generator (Claude)
         │
         ├─────▶ Code Reviewer (Claude)
         │
         ├─────▶ Test Runner
         │
         ▼
┌─────────────────┐
│ GitHub Service  │
│ (Create PR)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Notification   │
│    Service      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Customer      │
└─────────────────┘
```

## AI Integration Points

### 1. Bug Analysis
**Input**:
- Bug title and description
- Steps to reproduce
- Environment details
- Code context (optional)

**Output**:
- Summary and root cause analysis
- Severity and complexity assessment
- List of affected components
- Auto-fixability determination

### 2. Fix Generation
**Input**:
- Bug details
- Analysis results
- Current code from related files

**Output**:
- Complete modified file contents
- Reasoning for each change
- List of files to modify

### 3. Code Review
**Input**:
- Bug description
- Generated fixes with original/modified content

**Output**:
- Approval decision
- List of concerns
- Suggestions for improvement
- Test coverage assessment

## Error Handling

### Retry Logic
- Fix attempts: Up to 3 attempts (configurable)
- Each attempt creates a new branch
- Failed attempts are logged with reasons

### Fallback Paths
- If auto-fix fails → Mark for manual review
- If tests fail → Try different approach or escalate
- If API errors → Log and notify team

### Status Tracking
All states are tracked in the database:
- `submitted` → `analyzing` → `issue_created` → `fixing` → `testing` → `pr_created` → `resolved`
- Error states: `failed` (with error message)

## Security Considerations

### API Security
- Input validation on all endpoints
- Rate limiting (to be implemented)
- Authentication (to be implemented)

### GitHub Integration
- Webhook signature verification
- Token with minimal required permissions
- Secure secret storage

### Database Security
- Parameterized queries (SQL injection prevention)
- Connection pooling
- Encrypted connections

### Email Security
- Email validation
- Prevention of injection attacks
- Template-based content

## Scalability Considerations

### Current Design
- Synchronous processing with async workflows
- Single server instance
- Direct database connections

### Future Improvements
- Message queue for bug processing (Redis, RabbitMQ)
- Multiple worker instances
- Distributed task processing
- Caching layer for repeated analyses
- Rate limiting and throttling

## Monitoring & Observability

### Logging
- Winston logger with multiple transports
- Structured logging with levels
- Separate error log file

### Metrics (Future)
- Bug processing time
- Fix success rate
- Test pass rate
- API response times

### Alerts (Future)
- Failed fix attempts
- Test failures
- API errors
- Database connection issues

## Extension Points

### Custom AI Models
Replace Claude with different models by modifying AI service classes

### Additional Workflows
Add new workflow classes for:
- Scheduled bug reviews
- Automatic PR merging
- Integration with other tools

### Custom Notifications
Extend NotificationService for:
- Slack notifications
- Discord webhooks
- In-app notifications

### Testing Frameworks
Extend TestRunnerService to support:
- Pytest
- PHPUnit
- Go test
- Custom test runners

## Dependencies

### Core
- Express: Web server
- Anthropic SDK: Claude AI integration
- Octokit: GitHub API client
- PostgreSQL: Database

### Supporting
- Nodemailer: Email sending
- Winston: Logging
- Execa: Process execution
- Zod: Schema validation

## Configuration Management

### Environment Variables
All configuration via environment variables

### Validation
Environment variables validated on startup

### Defaults
Sensible defaults for non-critical settings

## Testing Strategy

### Unit Tests
- AI service response parsing
- Database operations
- Service layer logic

### Integration Tests
- Workflow execution
- GitHub API interactions
- Database transactions

### End-to-End Tests
- Complete bug submission flow
- Webhook processing
- Email notifications

## Deployment

### Requirements
- Node.js 20+
- PostgreSQL 15+
- SMTP server access
- GitHub repository access

### Process
1. Set up database
2. Configure environment variables
3. Initialize database schema
4. Start server
5. Configure GitHub webhooks

### Health Checks
- `/health` endpoint
- Database connectivity
- GitHub API accessibility
- SMTP server connectivity

## Future Enhancements

1. **Multi-repository Support**: Handle bugs across multiple repos
2. **Custom Fix Strategies**: Plugin system for fix generation
3. **Learning System**: Learn from successful fixes
4. **Duplicate Detection**: Identify similar bugs
5. **Priority Queue**: Process critical bugs first
6. **Dashboard**: Web UI for bug tracking
7. **Analytics**: Insights on bug patterns
8. **Auto-merge**: Automatically merge passing PRs
9. **Rollback**: Automatic rollback on production issues
10. **Integration Tests**: Generate tests for fixes
