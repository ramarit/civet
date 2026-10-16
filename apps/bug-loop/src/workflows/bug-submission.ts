import { BugReport } from '../types';
import { BugTrackingDB } from '../db/bug-tracking';
import { BugAnalyzer } from '../ai/bug-analyzer';
import { GitHubService } from '../services/github.service';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';
import { AutoFixWorkflow } from './auto-fix';

export class BugSubmissionWorkflow {
  private githubService: GitHubService;
  private notificationService: NotificationService;

  constructor() {
    this.githubService = new GitHubService();
    this.notificationService = new NotificationService();
  }

  async handleNewBug(bug: BugReport): Promise<void> {
    logger.info(`Processing new bug submission: ${bug.id}`);

    try {
      // 1. Save to database
      await BugTrackingDB.createBug(bug);
      await BugTrackingDB.updateBugStatus(bug.id, { status: 'submitted' });

      // 2. Notify customer of submission
      await this.notificationService.notifyBugSubmitted(
        bug.customerEmail,
        bug.id,
        bug.title
      );

      // 3. Analyze the bug with AI
      await BugTrackingDB.updateBugStatus(bug.id, { status: 'analyzing' });
      const analysis = await BugAnalyzer.analyzeBug(bug);
      await BugTrackingDB.saveBugAnalysis(bug.id, analysis);

      // 4. Create GitHub issue
      await BugTrackingDB.updateBugStatus(bug.id, { status: 'issue_created' });
      const githubIssue = await this.githubService.createIssue(bug, analysis);
      await BugTrackingDB.updateBugStatus(bug.id, { githubIssue });

      // 5. Notify customer of issue creation
      await this.notificationService.notifyIssueCreated(
        bug.customerEmail,
        bug.id,
        bug.title,
        githubIssue.url
      );

      // 6. Attempt automated fix if possible
      if (analysis.isAutofixable) {
        logger.info(`Bug ${bug.id} is auto-fixable, starting fix workflow`);
        const autoFixWorkflow = new AutoFixWorkflow();
        await autoFixWorkflow.attemptFix(bug, analysis, githubIssue);
      } else {
        logger.info(`Bug ${bug.id} requires manual intervention`);
        await BugTrackingDB.updateBugStatus(bug.id, {
          status: 'failed',
          error: 'Bug is not auto-fixable and requires manual review'
        });
      }

      logger.info(`Bug submission workflow completed: ${bug.id}`);
    } catch (error) {
      logger.error(`Error in bug submission workflow for ${bug.id}:`, error);

      await BugTrackingDB.updateBugStatus(bug.id, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Get the issue if it was created
      const status = await BugTrackingDB.getBugStatus(bug.id);
      if (status?.githubIssue) {
        await this.notificationService.notifyFailed(
          bug.customerEmail,
          bug.id,
          bug.title,
          status.githubIssue.url
        );
      }

      throw error;
    }
  }
}
