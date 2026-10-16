import Anthropic from '@anthropic-ai/sdk';
import { BugReport, BugAnalysis } from '../types';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class BugAnalyzer {
  static async analyzeBug(bug: BugReport, codeContext?: string): Promise<BugAnalysis> {
    logger.info(`Analyzing bug: ${bug.id}`);

    const prompt = this.buildAnalysisPrompt(bug, codeContext);

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

      const analysis = this.parseAnalysisResponse(content.text);
      logger.info(`Bug analysis completed: ${bug.id} - Autofixable: ${analysis.isAutofixable}`);

      return analysis;
    } catch (error) {
      logger.error(`Error analyzing bug ${bug.id}:`, error);
      throw error;
    }
  }

  private static buildAnalysisPrompt(bug: BugReport, codeContext?: string): string {
    return `You are a senior software engineer analyzing a bug report. Provide a detailed technical analysis.

**Bug Report:**
Title: ${bug.title}
Description: ${bug.description}

${bug.stepsToReproduce ? `Steps to Reproduce:\n${bug.stepsToReproduce.map((step, i) => `${i + 1}. ${step}`).join('\n')}` : ''}

${bug.expectedBehavior ? `Expected Behavior: ${bug.expectedBehavior}` : ''}
${bug.actualBehavior ? `Actual Behavior: ${bug.actualBehavior}` : ''}

${bug.environment ? `Environment:\n${JSON.stringify(bug.environment, null, 2)}` : ''}

${codeContext ? `\n**Code Context:**\n${codeContext}` : ''}

Analyze this bug and provide your response in the following JSON format:

{
  "summary": "Brief 1-2 sentence summary of the bug",
  "rootCause": "Likely root cause if identifiable",
  "affectedComponents": ["list", "of", "affected", "components"],
  "suggestedPriority": "low|medium|high|critical",
  "estimatedComplexity": "simple|moderate|complex",
  "relatedFiles": ["list/of/likely/affected/files.ts"],
  "tags": ["relevant", "tags"],
  "isAutofixable": true/false,
  "reasoning": "Explanation of your analysis and why it is/isn't autofixable"
}

Be thorough in your analysis. Consider:
- Can this be automatically fixed with high confidence?
- What files would need to be modified?
- Is this a simple fix (typo, missing null check) or complex (architectural change)?
- What testing would be needed to verify the fix?

Return ONLY valid JSON, no additional text.`;
  }

  private static parseAnalysisResponse(response: string): BugAnalysis {
    try {
      // Remove markdown code blocks if present
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        summary: parsed.summary || '',
        rootCause: parsed.rootCause,
        affectedComponents: parsed.affectedComponents || [],
        suggestedPriority: parsed.suggestedPriority || 'medium',
        estimatedComplexity: parsed.estimatedComplexity || 'moderate',
        relatedFiles: parsed.relatedFiles || [],
        tags: parsed.tags || [],
        isAutofixable: parsed.isAutofixable || false,
        reasoning: parsed.reasoning || '',
      };
    } catch (error) {
      logger.error('Error parsing bug analysis response:', error);
      throw new Error(`Failed to parse bug analysis: ${error}`);
    }
  }
}
