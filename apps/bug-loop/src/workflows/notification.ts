import { BugTrackingDB } from '../db/bug-tracking';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class NotificationWorkflow {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async sendBugStatusUpdate(bugId: string): Promise<void> {
    logger.info(`Sending status update for bug: ${bugId}`);

    try {
      const bug = await BugTrackingDB.getBug(bugId);
      const status = await BugTrackingDB.getBugStatus(bugId);

      if (!bug || !status) {
        logger.warn(`Bug or status not found: ${bugId}`);
        return;
      }

      let message = '';
      let subject = '';

      switch (status.status) {
        case 'submitted':
          subject = `Bug Report Received: ${bug.title}`;
          message = 'Your bug report has been received and is being analyzed.';
          break;

        case 'analyzing':
          subject = `Bug Analysis in Progress: ${bug.title}`;
          message = 'Our AI system is analyzing your bug report.';
          break;

        case 'issue_created':
          subject = `Bug Tracked: ${bug.title}`;
          message = 'A GitHub issue has been created to track your bug.';
          break;

        case 'fixing':
          subject = `Fix in Progress: ${bug.title}`;
          message = 'Our automated system is working on a fix for your bug.';
          break;

        case 'testing':
          subject = `Testing Fix: ${bug.title}`;
          message = 'A potential fix has been generated and is being tested.';
          break;

        case 'pr_created':
          subject = `Fix Ready for Review: ${bug.title}`;
          message = 'An automated fix has been created and submitted for review.';
          break;

        case 'resolved':
          subject = `Bug Resolved: ${bug.title}`;
          message = 'Your bug has been fixed and the changes have been merged!';
          break;

        case 'failed':
          subject = `Bug Requires Manual Review: ${bug.title}`;
          message = 'Our automated system could not fix this bug. It has been escalated to our engineering team.';
          break;

        default:
          logger.warn(`Unknown status: ${status.status}`);
          return;
      }

      await this.notificationService.sendNotification({
        to: bug.customerEmail,
        subject,
        bugId: bug.id,
        bugTitle: bug.title,
        status: status.status,
        githubIssueUrl: status.githubIssue?.url,
        pullRequestUrl: status.pullRequest?.url,
        message,
      });

      logger.info(`Status update sent for bug ${bugId}`);
    } catch (error) {
      logger.error(`Error sending status update for bug ${bugId}:`, error);
      throw error;
    }
  }

  async sendDailySummary(email: string): Promise<void> {
    logger.info(`Sending daily summary to ${email}`);

    // This would generate a summary of all bugs submitted by this customer
    // Implementation would query the database and format a summary email
    logger.info('Daily summary feature not yet implemented');
  }
}
