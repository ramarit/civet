# Bug Loop - Setup Checklist

Use this checklist to ensure your Bug Loop installation is complete and working properly.

## Pre-Installation

- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL 15+ installed and running
- [ ] Git installed (`git --version`)
- [ ] Text editor/IDE ready (VS Code recommended)

## API Keys & Credentials

### Anthropic Claude
- [ ] Signed up at https://console.anthropic.com/
- [ ] Created API key
- [ ] Copied key to safe location
- [ ] Verified key is active

### GitHub
- [ ] Created GitHub Personal Access Token
- [ ] Selected scopes: `repo` (all) and `workflow`
- [ ] Copied token to safe location
- [ ] Have repository owner and name ready

### Email (SMTP)
- [ ] SMTP server credentials available
- [ ] If using Gmail: Created App Password (not regular password)
- [ ] SMTP host and port identified
- [ ] Test credentials if possible

### Database
- [ ] PostgreSQL running (`sudo systemctl status postgresql` on Linux)
- [ ] Database created (`createdb bugloop`)
- [ ] Connection string ready

## Installation Steps

### 1. Project Setup
- [ ] Navigated to project directory
  ```bash
  cd /Users/ryanamarit/civet/apps/bug-loop
  ```
- [ ] Verified all files present (`ls -la`)
- [ ] No missing files or errors

### 2. Dependencies
- [ ] Installed dependencies
  ```bash
  npm install
  ```
- [ ] No installation errors
- [ ] `node_modules` directory created
- [ ] `package-lock.json` created

### 3. Environment Configuration
- [ ] Copied `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- [ ] Edited `.env` file
- [ ] Added `ANTHROPIC_API_KEY`
- [ ] Added `GITHUB_TOKEN`
- [ ] Added `GITHUB_OWNER`
- [ ] Added `GITHUB_REPO`
- [ ] Added `DATABASE_URL`
- [ ] Added SMTP credentials
- [ ] Added `EMAIL_FROM`
- [ ] Saved `.env` file

### 4. Database Setup
- [ ] PostgreSQL service running
- [ ] Database created
- [ ] Connection string correct in `.env`
- [ ] Can connect to database
  ```bash
  psql postgresql://user:password@localhost:5432/bugloop
  ```

## First Run

### 5. Start Development Server
- [ ] Started server
  ```bash
  npm run dev
  ```
- [ ] Server started without errors
- [ ] Saw "Bug Loop system started successfully" message
- [ ] Saw "Bug Loop server listening on port 3000" message
- [ ] Database initialized automatically

### 6. Health Check
- [ ] Health endpoint accessible
  ```bash
  curl http://localhost:3000/health
  ```
- [ ] Received response:
  ```json
  {
    "status": "healthy",
    "timestamp": "..."
  }
  ```

### 7. Test Bug Submission
- [ ] Submitted test bug
  ```bash
  curl -X POST http://localhost:3000/api/bugs \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Test bug",
      "description": "Testing the system",
      "customerEmail": "your-email@example.com",
      "severity": "low"
    }'
  ```
- [ ] Received 202 response with `bugId`
- [ ] Checked logs for processing
  ```bash
  tail -f logs/combined.log
  ```

## Verification

### 8. Check Logs
- [ ] Logs directory created (`ls -la logs/`)
- [ ] `combined.log` file exists
- [ ] `error.log` file exists
- [ ] Logs showing bug processing steps
- [ ] No error messages (except expected ones)

### 9. Check Database
- [ ] Connected to database
  ```bash
  psql postgresql://user:password@localhost:5432/bugloop
  ```
- [ ] Tables created
  ```sql
  \dt
  ```
- [ ] Should see: `bugs`, `bug_status`, `fix_attempts`, `bug_analysis`
- [ ] Bug record exists
  ```sql
  SELECT * FROM bugs LIMIT 1;
  ```
- [ ] Bug status exists
  ```sql
  SELECT * FROM bug_status LIMIT 1;
  ```

### 10. Check GitHub
- [ ] Logged into GitHub
- [ ] Navigated to repository
- [ ] Found created issue
- [ ] Issue has proper labels
- [ ] Issue description looks correct

### 11. Check Email
- [ ] Received email notification
- [ ] Email from correct sender
- [ ] Email content formatted properly
- [ ] Links work (GitHub issue)

## Optional: GitHub Webhooks

### 12. Webhook Setup (Production)
- [ ] Server exposed to internet (or using ngrok for testing)
- [ ] Navigated to GitHub repository settings
- [ ] Added webhook
  - URL: `https://your-domain.com/api/webhooks/github`
  - Content type: `application/json`
  - Secret: Same as `GITHUB_WEBHOOK_SECRET` in `.env`
  - Events: Pull requests, Issues, Issue comments
- [ ] Webhook active
- [ ] Test delivery successful

## Testing

### 13. Run Tests
- [ ] Ran test suite
  ```bash
  npm test
  ```
- [ ] All tests passing
- [ ] No test errors

### 14. Run Linter
- [ ] Ran linter
  ```bash
  npm run lint
  ```
- [ ] No linting errors

### 15. Build Application
- [ ] Built application
  ```bash
  npm run build
  ```
- [ ] Build successful
- [ ] `dist` directory created
- [ ] No build errors

## Production Readiness

### 16. Security Review
- [ ] Changed all default passwords
- [ ] Using strong webhook secret
- [ ] `.env` file not committed to git
- [ ] API keys secured
- [ ] Reviewed security best practices in DEPLOYMENT.md

### 17. Performance Review
- [ ] Tested with multiple concurrent bugs
- [ ] Checked memory usage
- [ ] Reviewed log sizes
- [ ] Set up log rotation (if needed)

### 18. Monitoring Setup
- [ ] Health check endpoint verified
- [ ] Logging working correctly
- [ ] Error tracking in place
- [ ] Database backups configured (for production)

## Documentation Review

### 19. Read Documentation
- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Reviewed ARCHITECTURE.md
- [ ] Checked DEPLOYMENT.md (if deploying to production)
- [ ] Reviewed PROJECT_SUMMARY.md

## Troubleshooting

If any step fails, check:

### Common Issues

#### Server won't start
- [ ] Check port 3000 is not in use
- [ ] Verify all environment variables set
- [ ] Check logs for specific error
- [ ] Ensure PostgreSQL is running

#### Database connection error
- [ ] PostgreSQL service running
- [ ] Database exists
- [ ] Credentials correct in `DATABASE_URL`
- [ ] Port 5432 accessible

#### GitHub API errors
- [ ] Token is valid and active
- [ ] Token has correct permissions
- [ ] Repository name and owner correct
- [ ] Not hitting rate limits

#### Email not sending
- [ ] SMTP credentials correct
- [ ] Using App Password (not regular password for Gmail)
- [ ] SMTP port correct (usually 587 or 465)
- [ ] Firewall not blocking SMTP

#### Anthropic API errors
- [ ] API key is valid
- [ ] API key has credit/quota
- [ ] API key format correct (starts with `sk-ant-`)

## Completion

### You're ready when:
- [x] All pre-installation items complete
- [x] All installation steps complete
- [x] First run successful
- [x] All verification steps passed
- [x] Tests passing
- [x] Documentation reviewed

## Next Steps

Now that Bug Loop is set up:

1. **Submit Real Bugs**
   - Update examples with your use cases
   - Test with actual bug reports
   - Verify auto-fix attempts

2. **Customize**
   - Adjust AI prompts in `src/ai/*.ts`
   - Configure test commands
   - Set up repository path

3. **Monitor**
   - Watch logs regularly
   - Check email deliveries
   - Review GitHub issues

4. **Deploy** (if ready for production)
   - Follow DEPLOYMENT.md
   - Set up proper hosting
   - Configure SSL/HTTPS
   - Set up monitoring

5. **Iterate**
   - Gather feedback
   - Improve prompts
   - Add custom features
   - Contribute back!

## Support

If you encounter issues:

1. Check logs: `tail -f logs/error.log`
2. Review QUICKSTART.md troubleshooting section
3. Search existing GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs (without sensitive data)

## Success!

If all checkboxes are checked, congratulations! Your Bug Loop system is fully operational.

Happy bug hunting! 🐛
