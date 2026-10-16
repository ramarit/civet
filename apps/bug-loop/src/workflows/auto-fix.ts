import path from 'path';
import { BugReport, BugAnalysis, GitHubIssue, FixAttempt } from '../types';
import { BugTrackingDB } from '../db/bug-tracking';
import { FixGenerator } from '../ai/fix-generator';
import { CodeReviewer } from '../ai/code-reviewer';
import { TestRunnerService } from '../services/test-runner.service';
import { GitHubService } from '../services/github.service';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class AutoFixWorkflow {
  private githubService: GitHubService;
  private notificationService: NotificationService;
  private repoPath: string;
  private maxAttempts: number;

  constructor() {
    this.githubService = new GitHubService();
    this.notificationService = new NotificationService();
    this.repoPath = process.env.REPO_PATH || path.join(process.cwd(), '../..');
    this.maxAttempts = parseInt(process.env.MAX_FIX_ATTEMPTS || '3');
  }

  async attemptFix(
    bug: BugReport,
    analysis: BugAnalysis,
    githubIssue: GitHubIssue
  ): Promise<void> {
    logger.info(`Starting auto-fix workflow for bug: ${bug.id}`);

    let attemptNumber = 0;
    let success = false;

    while (attemptNumber < this.maxAttempts && !success) {
      attemptNumber++;
      logger.info(`Fix attempt ${attemptNumber}/${this.maxAttempts} for bug ${bug.id}`);

      try {
        await BugTrackingDB.updateBugStatus(bug.id, {
          status: 'fixing',
          fixAttempts: attemptNumber
        });

        // 1. Create a branch for this fix attempt
        const branchName = `bugfix/${bug.id}-attempt-${attemptNumber}`;
        await this.githubService.createBranch(branchName);

        // 2. Generate the fix
        const fixes = await FixGenerator.generateFix(bug, analysis, this.repoPath);

        if (fixes.length === 0) {
          throw new Error('No fixes generated');
        }

        // 3. Review the fix
        const review = await CodeReviewer.reviewFix(bug.description, fixes);

        if (!review.approved) {
          logger.warn(`Fix attempt ${attemptNumber} not approved: ${review.concerns.join(', ')}`);

          await BugTrackingDB.saveFixAttempt({
            id: uuidv4(),
            bugId: bug.id,
            attemptNumber,
            branchName,
            filesModified: fixes,
            success: false,
            error: `Code review failed: ${review.concerns.join(', ')}`,
            createdAt: new Date(),
          });

          continue;
        }

        // 4. Apply fixes locally
        await FixGenerator.applyFixes(this.repoPath, fixes);

        // 5. Run tests
        await BugTrackingDB.updateBugStatus(bug.id, { status: 'testing' });
        const testResults = await TestRunnerService.runTests(this.repoPath);

        // 6. Save fix attempt
        const fixAttempt: FixAttempt = {
          id: uuidv4(),
          bugId: bug.id,
          attemptNumber,
          branchName,
          filesModified: fixes,
          testResults,
          success: testResults.passed,
          error: testResults.passed ? undefined : 'Tests failed',
          createdAt: new Date(),
        };

        await BugTrackingDB.saveFixAttempt(fixAttempt);

        if (!testResults.passed) {
          logger.warn(`Tests failed for attempt ${attemptNumber}`);
          continue;
        }

        // 7. Commit changes to GitHub
        const commitFiles = fixes.map(fix => ({
          path: fix.path,
          content: fix.modifiedContent,
        }));

        await this.githubService.commitChanges(
          branchName,
          commitFiles,
          `Fix: ${bug.title}\n\nAutomated fix attempt ${attemptNumber}\nBug ID: ${bug.id}`
        );

        // 8. Create pull request
        const pullRequest = await this.githubService.createPullRequest(
          branchName,
          bug,
          analysis,
          githubIssue.number
        );

        await BugTrackingDB.updateBugStatus(bug.id, {
          status: 'pr_created',
          pullRequest
        });

        // 9. Notify customer
        await this.notificationService.notifyFixCreated(
          bug.customerEmail,
          bug.id,
          bug.title,
          pullRequest.url
        );

        success = true;
        logger.info(`Successfully created fix for bug ${bug.id}`);

      } catch (error) {
        logger.error(`Error in fix attempt ${attemptNumber} for bug ${bug.id}:`, error);

        await BugTrackingDB.saveFixAttempt({
          id: uuidv4(),
          bugId: bug.id,
          attemptNumber,
          branchName: `bugfix/${bug.id}-attempt-${attemptNumber}`,
          filesModified: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          createdAt: new Date(),
        });
      }
    }

    if (!success) {
      logger.warn(`Failed to auto-fix bug ${bug.id} after ${this.maxAttempts} attempts`);

      await BugTrackingDB.updateBugStatus(bug.id, {
        status: 'failed',
        error: `Auto-fix failed after ${this.maxAttempts} attempts`,
      });

      await this.notificationService.notifyFailed(
        bug.customerEmail,
        bug.id,
        bug.title,
        githubIssue.url
      );
    }
  }
}
