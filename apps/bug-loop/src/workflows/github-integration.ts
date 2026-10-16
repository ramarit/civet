import { BugTrackingDB } from '../db/bug-tracking';
import { GitHubService } from '../services/github.service';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class GitHubIntegrationWorkflow {
  private githubService: GitHubService;
  private notificationService: NotificationService;

  constructor() {
    this.githubService = new GitHubService();
    this.notificationService = new NotificationService();
  }

  async handlePRMerged(prNumber: number): Promise<void> {
    logger.info(`Handling PR merged event: #${prNumber}`);

    try {
      // Find the bug associated with this PR
      // This is a simplified query - you'd need to implement proper lookup
      const bugId = await this.findBugByPR(prNumber);

      if (!bugId) {
        logger.warn(`No bug found for PR #${prNumber}`);
        return;
      }

      const bug = await BugTrackingDB.getBug(bugId);
      const status = await BugTrackingDB.getBugStatus(bugId);

      if (!bug || !status) {
        logger.warn(`Bug or status not found: ${bugId}`);
        return;
      }

      // Update bug status to resolved
      await BugTrackingDB.updateBugStatus(bugId, { status: 'resolved' });

      // Close the GitHub issue
      if (status.githubIssue) {
        await this.githubService.closeIssue(
          status.githubIssue.number,
          `Fixed in PR #${prNumber}. The bug has been resolved and merged to main.`
        );
      }

      // Notify customer
      if (status.pullRequest) {
        await this.notificationService.notifyResolved(
          bug.customerEmail,
          bug.id,
          bug.title,
          status.pullRequest.url
        );
      }

      logger.info(`Bug ${bugId} marked as resolved after PR #${prNumber} merged`);
    } catch (error) {
      logger.error(`Error handling PR merged event for #${prNumber}:`, error);
      throw error;
    }
  }

  async handlePRClosed(prNumber: number, merged: boolean): Promise<void> {
    if (merged) {
      await this.handlePRMerged(prNumber);
      return;
    }

    logger.info(`Handling PR closed (not merged) event: #${prNumber}`);

    try {
      const bugId = await this.findBugByPR(prNumber);

      if (!bugId) {
        logger.warn(`No bug found for PR #${prNumber}`);
        return;
      }

      // Update status to indicate the PR was closed without merging
      await BugTrackingDB.updateBugStatus(bugId, {
        error: `PR #${prNumber} was closed without merging`,
      });

      logger.info(`Updated bug ${bugId} - PR #${prNumber} closed without merge`);
    } catch (error) {
      logger.error(`Error handling PR closed event for #${prNumber}:`, error);
      throw error;
    }
  }

  async handleIssueComment(issueNumber: number, comment: string): Promise<void> {
    logger.info(`Handling issue comment on #${issueNumber}`);

    // Check if comment contains commands (e.g., /retry-fix, /close)
    if (comment.includes('/retry-fix')) {
      await this.retryFix(issueNumber);
    } else if (comment.includes('/close')) {
      await this.githubService.closeIssue(issueNumber);
    }
  }

  private async findBugByPR(prNumber: number): Promise<string | null> {
    // This would query the database to find which bug is associated with this PR
    // Implementation depends on your database structure
    // For now, returning null as a placeholder
    logger.debug(`Looking up bug for PR #${prNumber}`);
    return null;
  }

  private async retryFix(issueNumber: number): Promise<void> {
    logger.info(`Retrying fix for issue #${issueNumber}`);
    // Implementation would trigger a new fix attempt
    // This is a placeholder for the actual implementation
  }
}
