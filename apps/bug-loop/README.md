# Bug Loop - Automated Bug Tracking & Resolution System

An intelligent, automated bug tracking system powered by Claude AI that receives bug reports, analyzes them, attempts automated fixes, and manages the entire resolution lifecycle.

## Features

- **Automated Bug Submission**: Accept bug reports via REST API
- **AI-Powered Analysis**: Claude analyzes bug reports to determine severity, complexity, and auto-fixability
- **GitHub Integration**: Automatically creates issues, branches, and pull requests
- **Intelligent Fix Generation**: Claude generates code fixes based on bug analysis
- **Automated Testing**: Runs tests to validate fixes before creating PRs
- **Code Review**: AI reviews generated fixes for quality and correctness
- **Customer Notifications**: Email notifications at every stage of the bug lifecycle
- **Webhook Integration**: Responds to GitHub events (PR merges, issue comments)

## Architecture

```
Bug Submitted → AI Analysis → GitHub Issue Created →
Generate Fix → Run Tests → Create PR → Notify Customer →
PR Merged → Close Issue → Notify Resolution
```

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude
- `GITHUB_TOKEN`: GitHub personal access token with repo permissions
- `GITHUB_OWNER`: GitHub organization or user name
- `GITHUB_REPO`: Repository name
- `GITHUB_WEBHOOK_SECRET`: Secret for GitHub webhook verification
- `DATABASE_URL`: PostgreSQL connection string
- `SMTP_*`: Email configuration for notifications

## Database Setup

The system uses PostgreSQL. Run the application once to auto-create tables:

```bash
npm run dev
```

Or manually initialize:

```sql
-- Tables are created automatically via BugTrackingDB.initialize()
```

## Usage

### Starting the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Submitting a Bug

Send a POST request to `/api/bugs`:

```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button not working on mobile",
    "description": "The login button does not respond to clicks on iOS Safari",
    "stepsToReproduce": [
      "Open app on iOS Safari",
      "Navigate to login page",
      "Tap login button",
      "Nothing happens"
    ],
    "expectedBehavior": "Login form should submit",
    "actualBehavior": "Button click is not registered",
    "environment": {
      "browser": "Safari",
      "os": "iOS 17.1",
      "version": "1.2.3"
    },
    "customerEmail": "user@example.com",
    "customerName": "John Doe",
    "severity": "high"
  }'
```

### GitHub Webhook Setup

1. Go to your repository settings
2. Navigate to Webhooks
3. Add webhook with URL: `https://your-domain.com/api/webhooks/github`
4. Select events: Pull requests, Issues, Issue comments
5. Add your webhook secret

## Workflow Details

### 1. Bug Submission
- Customer submits bug via API
- Bug saved to database with unique ID
- Customer receives confirmation email

### 2. AI Analysis
- Claude analyzes bug report
- Determines severity and complexity
- Identifies affected components and files
- Assesses if bug is auto-fixable

### 3. GitHub Issue Creation
- Creates issue with AI analysis
- Adds appropriate labels
- Links bug ID for tracking

### 4. Automated Fix (if auto-fixable)
- Creates feature branch
- Generates code fixes using Claude
- Reviews fixes with AI code reviewer
- Applies fixes if approved

### 5. Testing
- Runs automated test suite
- Validates that tests pass
- May retry with different approach if tests fail

### 6. Pull Request
- Commits changes to branch
- Creates PR with detailed description
- Links to original issue
- Requests review

### 7. Notification
- Notifies customer of PR creation
- Sends updates on PR status
- Confirms resolution when merged

### 8. Auto-Close
- Monitors PR merge events via webhooks
- Closes GitHub issue when PR is merged
- Updates bug status to resolved
- Sends final notification to customer

## API Endpoints

### POST /api/bugs
Submit a new bug report

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "customerEmail": "string (required)",
  "stepsToReproduce": ["string"],
  "expectedBehavior": "string",
  "actualBehavior": "string",
  "environment": {
    "browser": "string",
    "os": "string",
    "version": "string"
  },
  "customerName": "string",
  "severity": "low|medium|high|critical"
}
```

**Response:**
```json
{
  "message": "Bug report received and is being processed",
  "bugId": "uuid"
}
```

### POST /api/webhooks/github
GitHub webhook endpoint (configured in repository settings)

### GET /health
Health check endpoint

## Directory Structure

```
src/
├── index.ts                 # Application entry point
├── server.ts                # Express server & webhooks
├── workflows/
│   ├── bug-submission.ts    # New bug handling
│   ├── auto-fix.ts          # Automated fix attempts
│   ├── github-integration.ts # GitHub event handlers
│   └── notification.ts      # Email notifications
├── ai/
│   ├── bug-analyzer.ts      # Bug analysis with Claude
│   ├── fix-generator.ts     # Fix generation with Claude
│   └── code-reviewer.ts     # Code review with Claude
├── services/
│   ├── github.service.ts    # GitHub API interactions
│   ├── test-runner.service.ts # Test execution
│   └── notification.service.ts # Email sending
├── db/
│   └── bug-tracking.ts      # Database operations
├── types/
│   └── index.ts             # TypeScript types
└── utils/
    └── logger.ts            # Winston logger
```

## Database Schema

### bugs
Stores bug report details

### bug_status
Tracks current status and GitHub integration

### fix_attempts
Records all automated fix attempts

### bug_analysis
Stores AI analysis results

## Configuration Options

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `MAX_FIX_ATTEMPTS`: Maximum automated fix attempts (default: 3)
- `TEST_COMMAND`: Command to run tests (default: npm test)
- `BUILD_COMMAND`: Command to build project (default: npm run build)
- `AUTO_MERGE_ENABLED`: Enable automatic PR merging (default: false)
- `REPO_PATH`: Local repository path for fix generation

## Monitoring & Logs

Logs are written to:
- `logs/error.log`: Error level logs
- `logs/combined.log`: All logs
- Console: Formatted output with colors

## Development

```bash
# Watch mode
npm run dev

# Linting
npm run lint

# Tests
npm test

# Build
npm run build
```

## Security Considerations

1. **API Authentication**: Add authentication to `/api/bugs` endpoint in production
2. **Webhook Verification**: Ensure `GITHUB_WEBHOOK_SECRET` is strong and verified
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Input Validation**: Validate all bug report inputs
5. **Secret Management**: Use secure secret management (not .env in production)
6. **Database Security**: Use connection pooling and prepared statements
7. **Email Security**: Validate email addresses and prevent injection

## Extending the System

### Adding New AI Models
Modify the model in `ai/*.ts` files:
```typescript
model: 'claude-opus-4-5-20251101'
```

### Custom Test Parsers
Update `TestRunnerService.parseTestOutput()` for your test framework

### Additional Notifications
Add new methods to `NotificationService` and call from workflows

### Custom Workflows
Create new workflow classes in `src/workflows/`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database user permissions

### GitHub API Issues
- Verify `GITHUB_TOKEN` has correct permissions
- Check rate limits
- Ensure repository access

### Email Not Sending
- Verify SMTP credentials
- Check firewall rules
- Test with a simple email first

### Tests Not Running
- Verify `TEST_COMMAND` is correct
- Check that test dependencies are installed
- Ensure repository path is accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [your-repo/issues]
- Email: support@civet.dev
- Documentation: [your-docs-url]

---

Built with Claude AI by the Civet Team
