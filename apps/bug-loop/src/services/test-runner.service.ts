import { execa } from 'execa';
import { TestResults } from '../types';
import { logger } from '../utils/logger';

export class TestRunnerService {
  static async runTests(repoPath: string, testCommand?: string): Promise<TestResults> {
    const command = testCommand || process.env.TEST_COMMAND || 'npm test';
    logger.info(`Running tests in ${repoPath}: ${command}`);

    const startTime = Date.now();

    try {
      const [cmd, ...args] = command.split(' ');
      const result = await execa(cmd, args, {
        cwd: repoPath,
        reject: false,
        timeout: 300000, // 5 minutes
      });

      const duration = Date.now() - startTime;
      const output = result.stdout + '\n' + result.stderr;

      // Parse test results (this is a simplified parser, adjust based on your test framework)
      const testResults = this.parseTestOutput(output);

      const passed = result.exitCode === 0;

      logger.info(
        `Tests ${passed ? 'passed' : 'failed'}: ${testResults.passed_count}/${testResults.total} (${duration}ms)`
      );

      return {
        passed,
        total: testResults.total,
        passed_count: testResults.passed_count,
        failed_count: testResults.failed_count,
        output,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error('Error running tests:', error);

      return {
        passed: false,
        total: 0,
        passed_count: 0,
        failed_count: 0,
        output: error.message || 'Test execution failed',
        duration,
      };
    }
  }

  static async runBuild(repoPath: string, buildCommand?: string): Promise<boolean> {
    const command = buildCommand || process.env.BUILD_COMMAND || 'npm run build';
    logger.info(`Running build in ${repoPath}: ${command}`);

    try {
      const [cmd, ...args] = command.split(' ');
      const result = await execa(cmd, args, {
        cwd: repoPath,
        reject: false,
        timeout: 300000, // 5 minutes
      });

      const success = result.exitCode === 0;
      logger.info(`Build ${success ? 'succeeded' : 'failed'}`);

      return success;
    } catch (error) {
      logger.error('Error running build:', error);
      return false;
    }
  }

  private static parseTestOutput(output: string): {
    total: number;
    passed_count: number;
    failed_count: number;
  } {
    // Jest output pattern
    const jestMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/i);
    if (jestMatch) {
      return {
        total: parseInt(jestMatch[3]),
        passed_count: parseInt(jestMatch[2]),
        failed_count: parseInt(jestMatch[1]),
      };
    }

    // Mocha/Vitest pattern
    const mochaMatch = output.match(/(\d+)\s+passing/i);
    const mochaFailMatch = output.match(/(\d+)\s+failing/i);
    if (mochaMatch) {
      const passed = parseInt(mochaMatch[1]);
      const failed = mochaFailMatch ? parseInt(mochaFailMatch[1]) : 0;
      return {
        total: passed + failed,
        passed_count: passed,
        failed_count: failed,
      };
    }

    // Default: try to count test-related lines
    const passedTests = (output.match(/✓|✔|PASS/g) || []).length;
    const failedTests = (output.match(/✗|✘|FAIL/g) || []).length;

    return {
      total: passedTests + failedTests,
      passed_count: passedTests,
      failed_count: failedTests,
    };
  }
}
