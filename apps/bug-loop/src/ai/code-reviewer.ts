import Anthropic from '@anthropic-ai/sdk';
import { FileFix, CodeReview } from '../types';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class CodeReviewer {
  static async reviewFix(
    bugDescription: string,
    fixes: FileFix[]
  ): Promise<CodeReview> {
    logger.info(`Reviewing fix with ${fixes.length} file changes`);

    const prompt = this.buildReviewPrompt(bugDescription, fixes);

    try {
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const review = this.parseReviewResponse(content.text);
      logger.info(`Code review completed: Approved=${review.approved}`);

      return review;
    } catch (error) {
      logger.error('Error reviewing fix:', error);
      throw error;
    }
  }

  private static buildReviewPrompt(
    bugDescription: string,
    fixes: FileFix[]
  ): string {
    const changesSection = fixes
      .map(
        (fix) => `
**File: ${fix.path}**

Reasoning: ${fix.reasoning}

Original:
\`\`\`
${fix.originalContent}
\`\`\`

Modified:
\`\`\`
${fix.modifiedContent}
\`\`\`
`
      )
      .join('\n---\n');

    return `You are a senior code reviewer. Review this automated bug fix for quality and correctness.

**Bug Description:**
${bugDescription}

**Proposed Changes:**
${changesSection}

Review these changes and provide your assessment in the following JSON format:

{
  "approved": true/false,
  "concerns": ["list of concerns if any"],
  "suggestions": ["list of improvement suggestions"],
  "testCoverage": "assessment of test coverage needs",
  "overallAssessment": "summary of the review"
}

Evaluate:
1. Does the fix address the bug correctly?
2. Are there any potential side effects or regressions?
3. Is the code quality acceptable (style, readability, maintainability)?
4. Are there missing error cases or edge cases?
5. Should this fix include additional tests?
6. Are there security concerns?

Approve only if the fix is safe and correct. Return ONLY valid JSON, no additional text.`;
  }

  private static parseReviewResponse(response: string): CodeReview {
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        approved: parsed.approved || false,
        concerns: parsed.concerns || [],
        suggestions: parsed.suggestions || [],
        testCoverage: parsed.testCoverage || '',
        overallAssessment: parsed.overallAssessment || '',
      };
    } catch (error) {
      logger.error('Error parsing review response:', error);
      throw new Error(`Failed to parse code review: ${error}`);
    }
  }
}
