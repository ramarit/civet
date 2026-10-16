# Bug Loop - Quick Start Guide

Get your automated bug tracking system up and running in minutes.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ running
- GitHub account with a repository
- Anthropic API key (Claude)
- SMTP server access (Gmail, SendGrid, etc.)

## Step 1: Install Dependencies

```bash
cd apps/bug-loop
npm install
```

## Step 2: Set Up Database

Start PostgreSQL and create a database:

```bash
# Using psql
createdb bugloop

# Or using SQL
psql -c "CREATE DATABASE bugloop;"
```

## Step 3: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
DATABASE_URL=postgresql://user:password@localhost:5432/bugloop

# Email (example with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=bugs@yourdomain.com
```

### Getting Required Credentials

#### GitHub Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes: `repo` (all), `workflow`
4. Copy the token to `GITHUB_TOKEN`

#### Anthropic API Key
1. Sign up at https://console.anthropic.com/
2. Go to API Keys section
3. Create new key
4. Copy to `ANTHROPIC_API_KEY`

#### Gmail App Password (if using Gmail)
1. Enable 2-factor authentication on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate new app password
4. Copy to `SMTP_PASSWORD`

## Step 4: Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start on port 3000 (or your configured PORT).

## Step 5: Test the System

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Submit a Bug

```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test bug",
    "description": "This is a test bug to verify the system works",
    "customerEmail": "test@example.com",
    "severity": "low"
  }'
```

Expected response:
```json
{
  "message": "Bug report received and is being processed",
  "bugId": "uuid-here"
}
```

### Test 3: Check Logs

Watch the logs to see the processing:

```bash
tail -f logs/combined.log
```

You should see:
1. Bug submission received
2. AI analysis in progress
3. GitHub issue created
4. Email notification sent

## Step 6: Set Up GitHub Webhooks (Optional)

To enable automatic closing of bugs when PRs are merged:

1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Payload URL: `https://your-domain.com/api/webhooks/github`
4. Content type: `application/json`
5. Secret: Copy from your `GITHUB_WEBHOOK_SECRET` env var
6. Events: Select "Pull requests", "Issues", "Issue comments"
7. Active: Check the box
8. Add webhook

Note: For local development, use ngrok or similar to expose your local server.

## Step 7: Monitor Your First Bug

After submitting a test bug, you can:

1. Check your email for notifications
2. View the created GitHub issue in your repository
3. Watch the logs for processing steps
4. Check the database for stored data

## Common Issues

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution: Make sure PostgreSQL is running and `DATABASE_URL` is correct.

### GitHub API Error

```
Error: Bad credentials
```

Solution: Verify your `GITHUB_TOKEN` is valid and has the correct permissions.

### Email Not Sending

```
Error: Invalid login
```

Solution: Check SMTP credentials. For Gmail, make sure you're using an App Password, not your regular password.

### Anthropic API Error

```
Error: Invalid API key
```

Solution: Verify your `ANTHROPIC_API_KEY` is correct and active.

## Next Steps

1. **Customize Prompts**: Edit AI prompts in `src/ai/*.ts` to match your codebase
2. **Add Authentication**: Secure the `/api/bugs` endpoint with authentication
3. **Configure Tests**: Set `TEST_COMMAND` to match your test suite
4. **Set Repo Path**: Configure `REPO_PATH` if not running from repo root
5. **Enable Auto-Merge**: Set `AUTO_MERGE_ENABLED=true` (after testing)

## Example Workflow

Here's what happens when a bug is submitted:

```
1. Customer submits bug via POST /api/bugs
   ↓
2. Bug saved to database (status: submitted)
   ↓
3. Email sent to customer: "Bug received"
   ↓
4. Claude analyzes bug (status: analyzing)
   ↓
5. GitHub issue created (status: issue_created)
   ↓
6. Email sent: "Issue created at [URL]"
   ↓
7. If auto-fixable:
   - Create branch (status: fixing)
   - Generate fix with Claude
   - Review with Claude
   - Run tests (status: testing)
   - Create PR if tests pass (status: pr_created)
   - Email sent: "Fix created at [PR URL]"
   ↓
8. When PR is merged:
   - Close issue (status: resolved)
   - Email sent: "Bug resolved!"
```

## Testing with Real Bugs

To test with a realistic bug:

```bash
# Use the example bug submission
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d @examples/bug-submission.json

# Or use the shell script
chmod +x examples/curl-examples.sh
./examples/curl-examples.sh
```

## Verification Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Bug submission returns 202
- [ ] Database tables created
- [ ] Bug appears in database
- [ ] GitHub issue created
- [ ] Email received
- [ ] Logs show processing steps

## Getting Help

Check the documentation:
- `README.md`: Full system documentation
- `ARCHITECTURE.md`: Technical architecture details
- `examples/`: Example requests and responses

## Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production`
2. Use a proper process manager (PM2, systemd)
3. Set up database backups
4. Configure proper logging
5. Add monitoring and alerts
6. Enable HTTPS
7. Add rate limiting
8. Implement authentication
9. Review security settings
10. Test thoroughly in staging

Congratulations! Your Bug Loop system is now running.
