import Anthropic from '@anthropic-ai/sdk';
import { BugReport, BugAnalysis, FileFix } from '../types';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class FixGenerator {
  static async generateFix(
    bug: BugReport,
    analysis: BugAnalysis,
    repoPath: string
  ): Promise<FileFix[]> {
    logger.info(`Generating fix for bug: ${bug.id}`);

    // Read the content of files that need to be fixed
    const fileContents = await this.readFiles(repoPath, analysis.relatedFiles);

    const prompt = this.buildFixPrompt(bug, analysis, fileContents);

    try {
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 8192,
        temperature: 0.2,
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

      const fixes = this.parseFixResponse(content.text, fileContents);
      logger.info(`Generated ${fixes.length} file fixes for bug: ${bug.id}`);

      return fixes;
    } catch (error) {
      logger.error(`Error generating fix for bug ${bug.id}:`, error);
      throw error;
    }
  }

  private static async readFiles(
    repoPath: string,
    filePaths: string[]
  ): Promise<Map<string, string>> {
    const fileContents = new Map<string, string>();

    for (const filePath of filePaths) {
      try {
        const fullPath = path.join(repoPath, filePath);
        const content = await fs.readFile(fullPath, 'utf-8');
        fileContents.set(filePath, content);
        logger.debug(`Read file: ${filePath}`);
      } catch (error) {
        logger.warn(`Could not read file ${filePath}:`, error);
      }
    }

    return fileContents;
  }

  private static buildFixPrompt(
    bug: BugReport,
    analysis: BugAnalysis,
    fileContents: Map<string, string>
  ): string {
    const filesSection = Array.from(fileContents.entries())
      .map(([path, content]) => `**${path}:**\n\`\`\`\n${content}\n\`\`\``)
      .join('\n\n');

    return `You are a senior software engineer tasked with fixing a bug. Generate precise code changes.

**Bug Report:**
Title: ${bug.title}
Description: ${bug.description}

${bug.stepsToReproduce ? `Steps to Reproduce:\n${bug.stepsToReproduce.map((step, i) => `${i + 1}. ${step}`).join('\n')}` : ''}

**Analysis:**
${analysis.summary}
Root Cause: ${analysis.rootCause || 'Unknown'}
Complexity: ${analysis.estimatedComplexity}

**Current Code:**
${filesSection}

Generate a fix for this bug. Provide your response in the following JSON format:

{
  "fixes": [
    {
      "path": "path/to/file.ts",
      "modifiedContent": "complete modified file content",
      "reasoning": "explanation of the changes made"
    }
  ]
}

Requirements:
1. Provide the COMPLETE modified file content, not just the changed lines
2. Ensure the fix addresses the root cause
3. Maintain code style and patterns from the existing code
4. Add necessary error handling and validation
5. Include comments explaining non-obvious changes
6. Ensure backward compatibility where possible

Return ONLY valid JSON, no additional text.`;
  }

  private static parseFixResponse(
    response: string,
    originalFiles: Map<string, string>
  ): FileFix[] {
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.fixes || !Array.isArray(parsed.fixes)) {
        throw new Error('Invalid fix response format');
      }

      return parsed.fixes.map((fix: any) => ({
        path: fix.path,
        originalContent: originalFiles.get(fix.path) || '',
        modifiedContent: fix.modifiedContent,
        reasoning: fix.reasoning || '',
      }));
    } catch (error) {
      logger.error('Error parsing fix response:', error);
      throw new Error(`Failed to parse fix response: ${error}`);
    }
  }

  static async applyFixes(repoPath: string, fixes: FileFix[]): Promise<void> {
    logger.info(`Applying ${fixes.length} fixes`);

    for (const fix of fixes) {
      try {
        const fullPath = path.join(repoPath, fix.path);
        await fs.writeFile(fullPath, fix.modifiedContent, 'utf-8');
        logger.info(`Applied fix to: ${fix.path}`);
      } catch (error) {
        logger.error(`Error applying fix to ${fix.path}:`, error);
        throw error;
      }
    }
  }
}
