import express, { Request, Response } from 'express';
import { Webhooks } from '@octokit/webhooks';
import { BugReport } from './types';
import { BugSubmissionWorkflow } from './workflows/bug-submission';
import { GitHubIntegrationWorkflow } from './workflows/github-integration';
import { logger } from './utils/logger';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize GitHub webhooks
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || 'default-secret',
});

// Workflows
const bugSubmissionWorkflow = new BugSubmissionWorkflow();
const githubIntegrationWorkflow = new GitHubIntegrationWorkflow();

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Bug submission endpoint
app.post('/api/bugs', async (req: Request, res: Response) => {
  try {
    const bugData = req.body;

    // Validate required fields
    if (!bugData.title || !bugData.description || !bugData.customerEmail) {
      return res.status(400).json({
        error: 'Missing required fields: title, description, customerEmail',
      });
    }

    // Create bug report
    const bug: BugReport = {
      id: uuidv4(),
      title: bugData.title,
      description: bugData.description,
      stepsToReproduce: bugData.stepsToReproduce,
      expectedBehavior: bugData.expectedBehavior,
      actualBehavior: bugData.actualBehavior,
      environment: bugData.environment,
      customerEmail: bugData.customerEmail,
      customerName: bugData.customerName,
      severity: bugData.severity || 'medium',
      attachments: bugData.attachments,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Process asynchronously
    bugSubmissionWorkflow.handleNewBug(bug).catch(error => {
      logger.error(`Failed to process bug ${bug.id}:`, error);
    });

    res.status(202).json({
      message: 'Bug report received and is being processed',
      bugId: bug.id,
    });
  } catch (error) {
    logger.error('Error submitting bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GitHub webhook endpoint
app.post('/api/webhooks/github', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(req.body);

    await webhooks.verifyAndReceive({
      id: req.headers['x-github-delivery'] as string,
      name: req.headers['x-github-event'] as any,
      signature,
      payload,
    });

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GitHub webhook handlers
webhooks.on('pull_request.closed', async ({ payload }) => {
  try {
    await githubIntegrationWorkflow.handlePRClosed(
      payload.pull_request.number,
      payload.pull_request.merged
    );
  } catch (error) {
    logger.error('Error handling PR closed webhook:', error);
  }
});

webhooks.on('issue_comment.created', async ({ payload }) => {
  try {
    await githubIntegrationWorkflow.handleIssueComment(
      payload.issue.number,
      payload.comment.body
    );
  } catch (error) {
    logger.error('Error handling issue comment webhook:', error);
  }
});

webhooks.on('issues.closed', async ({ payload }) => {
  logger.info(`Issue #${payload.issue.number} was closed`);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export function startServer() {
  app.listen(port, () => {
    logger.info(`Bug Loop server listening on port ${port}`);
  });
}

export default app;
