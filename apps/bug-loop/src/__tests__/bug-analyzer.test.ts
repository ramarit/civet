import { BugAnalyzer } from '../ai/bug-analyzer';
import { BugReport } from '../types';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            type: 'text',
            text: JSON.stringify({
              summary: 'Login button not responding to clicks',
              rootCause: 'Event handler not properly attached',
              affectedComponents: ['login', 'authentication'],
              suggestedPriority: 'high',
              estimatedComplexity: 'simple',
              relatedFiles: ['src/components/LoginButton.tsx'],
              tags: ['frontend', 'ui'],
              isAutofixable: true,
              reasoning: 'Simple event handler issue that can be fixed automatically',
            }),
          }],
        }),
      },
    })),
  };
});

describe('BugAnalyzer', () => {
  const mockBug: BugReport = {
    id: 'test-bug-1',
    title: 'Login button not working',
    description: 'The login button does not respond when clicked',
    customerEmail: 'test@example.com',
    severity: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });

  it('should analyze a bug report successfully', async () => {
    const analysis = await BugAnalyzer.analyzeBug(mockBug);

    expect(analysis).toBeDefined();
    expect(analysis.summary).toBe('Login button not responding to clicks');
    expect(analysis.isAutofixable).toBe(true);
    expect(analysis.suggestedPriority).toBe('high');
    expect(analysis.estimatedComplexity).toBe('simple');
    expect(analysis.affectedComponents).toContain('login');
  });

  it('should include related files in analysis', async () => {
    const analysis = await BugAnalyzer.analyzeBug(mockBug);

    expect(analysis.relatedFiles).toBeDefined();
    expect(analysis.relatedFiles.length).toBeGreaterThan(0);
  });

  it('should provide reasoning for the analysis', async () => {
    const analysis = await BugAnalyzer.analyzeBug(mockBug);

    expect(analysis.reasoning).toBeDefined();
    expect(typeof analysis.reasoning).toBe('string');
    expect(analysis.reasoning.length).toBeGreaterThan(0);
  });
});
