import { Pool } from 'pg';
import { BugReport, BugStatus, FixAttempt } from '../types';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class BugTrackingDB {
  static async initialize() {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS bugs (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          steps_to_reproduce JSONB,
          expected_behavior TEXT,
          actual_behavior TEXT,
          environment JSONB,
          customer_email TEXT NOT NULL,
          customer_name TEXT,
          severity TEXT,
          attachments JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bug_status (
          bug_id TEXT PRIMARY KEY REFERENCES bugs(id),
          status TEXT NOT NULL,
          github_issue JSONB,
          pull_request JSONB,
          fix_attempts INTEGER DEFAULT 0,
          last_updated TIMESTAMP DEFAULT NOW(),
          error TEXT
        );

        CREATE TABLE IF NOT EXISTS fix_attempts (
          id TEXT PRIMARY KEY,
          bug_id TEXT REFERENCES bugs(id),
          attempt_number INTEGER NOT NULL,
          branch_name TEXT NOT NULL,
          files_modified JSONB NOT NULL,
          test_results JSONB,
          success BOOLEAN DEFAULT FALSE,
          error TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bug_analysis (
          bug_id TEXT PRIMARY KEY REFERENCES bugs(id),
          summary TEXT NOT NULL,
          root_cause TEXT,
          affected_components JSONB,
          suggested_priority TEXT,
          estimated_complexity TEXT,
          related_files JSONB,
          tags JSONB,
          is_autofixable BOOLEAN,
          reasoning TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_bugs_customer_email ON bugs(customer_email);
        CREATE INDEX IF NOT EXISTS idx_bug_status_status ON bug_status(status);
        CREATE INDEX IF NOT EXISTS idx_fix_attempts_bug_id ON fix_attempts(bug_id);
      `);
      logger.info('Database initialized successfully');
    } finally {
      client.release();
    }
  }

  static async createBug(bug: BugReport): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO bugs (
          id, title, description, steps_to_reproduce, expected_behavior,
          actual_behavior, environment, customer_email, customer_name,
          severity, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          bug.id,
          bug.title,
          bug.description,
          JSON.stringify(bug.stepsToReproduce || []),
          bug.expectedBehavior,
          bug.actualBehavior,
          JSON.stringify(bug.environment || {}),
          bug.customerEmail,
          bug.customerName,
          bug.severity,
          JSON.stringify(bug.attachments || []),
        ]
      );

      await client.query(
        `INSERT INTO bug_status (bug_id, status) VALUES ($1, $2)`,
        [bug.id, 'submitted']
      );

      await client.query('COMMIT');
      logger.info(`Bug created: ${bug.id}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getBug(bugId: string): Promise<BugReport | null> {
    const result = await pool.query('SELECT * FROM bugs WHERE id = $1', [bugId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      stepsToReproduce: row.steps_to_reproduce,
      expectedBehavior: row.expected_behavior,
      actualBehavior: row.actual_behavior,
      environment: row.environment,
      customerEmail: row.customer_email,
      customerName: row.customer_name,
      severity: row.severity,
      attachments: row.attachments,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async updateBugStatus(bugId: string, status: Partial<BugStatus>): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (status.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status.status);
    }

    if (status.githubIssue) {
      updates.push(`github_issue = $${paramIndex++}`);
      values.push(JSON.stringify(status.githubIssue));
    }

    if (status.pullRequest) {
      updates.push(`pull_request = $${paramIndex++}`);
      values.push(JSON.stringify(status.pullRequest));
    }

    if (status.fixAttempts !== undefined) {
      updates.push(`fix_attempts = $${paramIndex++}`);
      values.push(status.fixAttempts);
    }

    if (status.error) {
      updates.push(`error = $${paramIndex++}`);
      values.push(status.error);
    }

    updates.push(`last_updated = NOW()`);
    values.push(bugId);

    await pool.query(
      `UPDATE bug_status SET ${updates.join(', ')} WHERE bug_id = $${paramIndex}`,
      values
    );

    logger.info(`Bug status updated: ${bugId} -> ${status.status || 'partial update'}`);
  }

  static async getBugStatus(bugId: string): Promise<BugStatus | null> {
    const result = await pool.query('SELECT * FROM bug_status WHERE bug_id = $1', [bugId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      bugId: row.bug_id,
      status: row.status,
      githubIssue: row.github_issue,
      pullRequest: row.pull_request,
      fixAttempts: row.fix_attempts,
      lastUpdated: row.last_updated,
      error: row.error,
    };
  }

  static async saveFixAttempt(attempt: FixAttempt): Promise<void> {
    await pool.query(
      `INSERT INTO fix_attempts (
        id, bug_id, attempt_number, branch_name, files_modified,
        test_results, success, error
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        attempt.id,
        attempt.bugId,
        attempt.attemptNumber,
        attempt.branchName,
        JSON.stringify(attempt.filesModified),
        JSON.stringify(attempt.testResults),
        attempt.success,
        attempt.error,
      ]
    );

    logger.info(`Fix attempt saved: ${attempt.id} (attempt ${attempt.attemptNumber})`);
  }

  static async saveBugAnalysis(bugId: string, analysis: any): Promise<void> {
    await pool.query(
      `INSERT INTO bug_analysis (
        bug_id, summary, root_cause, affected_components, suggested_priority,
        estimated_complexity, related_files, tags, is_autofixable, reasoning
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (bug_id) DO UPDATE SET
        summary = EXCLUDED.summary,
        root_cause = EXCLUDED.root_cause,
        affected_components = EXCLUDED.affected_components,
        suggested_priority = EXCLUDED.suggested_priority,
        estimated_complexity = EXCLUDED.estimated_complexity,
        related_files = EXCLUDED.related_files,
        tags = EXCLUDED.tags,
        is_autofixable = EXCLUDED.is_autofixable,
        reasoning = EXCLUDED.reasoning`,
      [
        bugId,
        analysis.summary,
        analysis.rootCause,
        JSON.stringify(analysis.affectedComponents),
        analysis.suggestedPriority,
        analysis.estimatedComplexity,
        JSON.stringify(analysis.relatedFiles),
        JSON.stringify(analysis.tags),
        analysis.isAutofixable,
        analysis.reasoning,
      ]
    );

    logger.info(`Bug analysis saved: ${bugId}`);
  }

  static async getBugAnalysis(bugId: string): Promise<any | null> {
    const result = await pool.query('SELECT * FROM bug_analysis WHERE bug_id = $1', [bugId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      summary: row.summary,
      rootCause: row.root_cause,
      affectedComponents: row.affected_components,
      suggestedPriority: row.suggested_priority,
      estimatedComplexity: row.estimated_complexity,
      relatedFiles: row.related_files,
      tags: row.tags,
      isAutofixable: row.is_autofixable,
      reasoning: row.reasoning,
    };
  }

  static async getFixAttempts(bugId: string): Promise<FixAttempt[]> {
    const result = await pool.query(
      'SELECT * FROM fix_attempts WHERE bug_id = $1 ORDER BY attempt_number',
      [bugId]
    );

    return result.rows.map(row => ({
      id: row.id,
      bugId: row.bug_id,
      attemptNumber: row.attempt_number,
      branchName: row.branch_name,
      filesModified: row.files_modified,
      testResults: row.test_results,
      success: row.success,
      error: row.error,
      createdAt: row.created_at,
    }));
  }
}
