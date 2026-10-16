import { Octokit } from '@octokit/rest';
import { BugReport, BugAnalysis, GitHubIssue, PullRequest } from '../types';
import { logger } from '../utils/logger';

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.owner = process.env.GITHUB_OWNER || '';
    this.repo = process.env.GITHUB_REPO || '';
  }

  async createIssue(
    bug: BugReport,
    analysis: BugAnalysis
  ): Promise<GitHubIssue> {
    logger.info(`Creating GitHub issue for bug: ${bug.id}`);

    const body = this.buildIssueBody(bug, analysis);
    const labels = this.determineLabels(analysis);

    try {
      const response = await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: `[BUG] ${bug.title}`,
        body,
        labels,
      });

      logger.info(`Created issue #${response.data.number}: ${response.data.html_url}`);

      return {
        number: response.data.number,
        url: response.data.html_url,
        state: 'open',
      };
    } catch (error) {
      logger.error('Error creating GitHub issue:', error);
      throw error;
    }
  }

  async createBranch(bugId: string, baseBranch: string = 'main'): Promise<string> {
    const branchName = `bugfix/${bugId}`;
    logger.info(`Creating branch: ${branchName}`);

    try {
      // Get the base branch ref
      const baseRef = await this.octokit.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${baseBranch}`,
      });

      // Create new branch
      await this.octokit.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: baseRef.data.object.sha,
      });

      logger.info(`Created branch: ${branchName}`);
      return branchName;
    } catch (error) {
      logger.error(`Error creating branch ${branchName}:`, error);
      throw error;
    }
  }

  async createPullRequest(
    branchName: string,
    bug: BugReport,
    analysis: BugAnalysis,
    issueNumber: number,
    baseBranch: string = 'main'
  ): Promise<PullRequest> {
    logger.info(`Creating pull request for branch: ${branchName}`);

    const title = `Fix: ${bug.title}`;
    const body = this.buildPRBody(bug, analysis, issueNumber);

    try {
      const response = await this.octokit.pulls.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        head: branchName,
        base: baseBranch,
      });

      // Link PR to issue
      await this.octokit.issues.createComment({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        body: `Automated fix created in PR #${response.data.number}`,
      });

      logger.info(`Created PR #${response.data.number}: ${response.data.html_url}`);

      return {
        number: response.data.number,
        url: response.data.html_url,
        state: 'open',
        branchName,
      };
    } catch (error) {
      logger.error('Error creating pull request:', error);
      throw error;
    }
  }

  async commitChanges(
    branchName: string,
    files: Array<{ path: string; content: string }>,
    message: string
  ): Promise<void> {
    logger.info(`Committing ${files.length} files to ${branchName}`);

    try {
      // Get the current commit SHA
      const ref = await this.octokit.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branchName}`,
      });

      const currentCommitSha = ref.data.object.sha;

      // Get the tree SHA of the current commit
      const currentCommit = await this.octokit.git.getCommit({
        owner: this.owner,
        repo: this.repo,
        commit_sha: currentCommitSha,
      });

      const baseTreeSha = currentCommit.data.tree.sha;

      // Create blobs for each file
      const blobs = await Promise.all(
        files.map(async (file) => {
          const blob = await this.octokit.git.createBlob({
            owner: this.owner,
            repo: this.repo,
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64',
          });
          return {
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.data.sha,
          };
        })
      );

      // Create a new tree
      const tree = await this.octokit.git.createTree({
        owner: this.owner,
        repo: this.repo,
        base_tree: baseTreeSha,
        tree: blobs,
      });

      // Create a new commit
      const commit = await this.octokit.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message,
        tree: tree.data.sha,
        parents: [currentCommitSha],
      });

      // Update the reference
      await this.octokit.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branchName}`,
        sha: commit.data.sha,
      });

      logger.info(`Committed changes to ${branchName}: ${commit.data.sha}`);
    } catch (error) {
      logger.error('Error committing changes:', error);
      throw error;
    }
  }

  async closeIssue(issueNumber: number, comment?: string): Promise<void> {
    logger.info(`Closing issue #${issueNumber}`);

    try {
      if (comment) {
        await this.octokit.issues.createComment({
          owner: this.owner,
          repo: this.repo,
          issue_number: issueNumber,
          body: comment,
        });
      }

      await this.octokit.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        state: 'closed',
      });

      logger.info(`Closed issue #${issueNumber}`);
    } catch (error) {
      logger.error(`Error closing issue #${issueNumber}:`, error);
      throw error;
    }
  }

  private buildIssueBody(bug: BugReport, analysis: BugAnalysis): string {
    return `## Bug Report

**Reported by:** ${bug.customerName || bug.customerEmail}
**Severity:** ${analysis.suggestedPriority}
**Complexity:** ${analysis.estimatedComplexity}
**Bug ID:** ${bug.id}

### Description
${bug.description}

${bug.stepsToReproduce && bug.stepsToReproduce.length > 0 ? `
### Steps to Reproduce
${bug.stepsToReproduce.map((step, i) => `${i + 1}. ${step}`).join('\n')}
` : ''}

${bug.expectedBehavior ? `
### Expected Behavior
${bug.expectedBehavior}
` : ''}

${bug.actualBehavior ? `
### Actual Behavior
${bug.actualBehavior}
` : ''}

${bug.environment ? `
### Environment
\`\`\`json
${JSON.stringify(bug.environment, null, 2)}
\`\`\`
` : ''}

---

## AI Analysis

**Summary:** ${analysis.summary}

${analysis.rootCause ? `**Root Cause:** ${analysis.rootCause}` : ''}

**Affected Components:** ${analysis.affectedComponents.join(', ')}

**Auto-fixable:** ${analysis.isAutofixable ? 'Yes' : 'No'}

**Analysis:** ${analysis.reasoning}

${analysis.relatedFiles.length > 0 ? `
**Related Files:**
${analysis.relatedFiles.map(f => `- \`${f}\``).join('\n')}
` : ''}

---

*This issue was automatically created by the Bug Loop system.*
`;
  }

  private buildPRBody(
    bug: BugReport,
    analysis: BugAnalysis,
    issueNumber: number
  ): string {
    return `## Automated Bug Fix

Fixes #${issueNumber}

### Bug Summary
${analysis.summary}

### Changes Made
This PR contains automated fixes generated by AI analysis of the bug report.

${analysis.rootCause ? `**Root Cause:** ${analysis.rootCause}` : ''}

**Complexity:** ${analysis.estimatedComplexity}

### Testing
- Automated tests have been run and passed
- Please review the changes carefully before merging

### Affected Components
${analysis.affectedComponents.join(', ')}

---

**Bug ID:** ${bug.id}
**Customer:** ${bug.customerEmail}

*This pull request was automatically generated by the Bug Loop system.*
`;
  }

  private determineLabels(analysis: BugAnalysis): string[] {
    const labels = ['bug', 'automated'];

    // Add priority label
    labels.push(`priority:${analysis.suggestedPriority}`);

    // Add complexity label
    labels.push(`complexity:${analysis.estimatedComplexity}`);

    // Add component labels
    analysis.affectedComponents.forEach(component => {
      labels.push(`component:${component}`);
    });

    // Add custom tags
    analysis.tags.forEach(tag => {
      labels.push(tag);
    });

    if (analysis.isAutofixable) {
      labels.push('auto-fixed');
    }

    return labels;
  }
}
