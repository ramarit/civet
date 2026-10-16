export interface BugReport {
  id: string;
  title: string;
  description: string;
  stepsToReproduce?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: {
    browser?: string;
    os?: string;
    version?: string;
  };
  customerEmail: string;
  customerName?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BugAnalysis {
  summary: string;
  rootCause?: string;
  affectedComponents: string[];
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  relatedFiles: string[];
  tags: string[];
  isAutofixable: boolean;
  reasoning: string;
}

export interface FixAttempt {
  id: string;
  bugId: string;
  attemptNumber: number;
  branchName: string;
  filesModified: FileFix[];
  testResults?: TestResults;
  success: boolean;
  error?: string;
  createdAt: Date;
}

export interface FileFix {
  path: string;
  originalContent: string;
  modifiedContent: string;
  reasoning: string;
}

export interface TestResults {
  passed: boolean;
  total: number;
  passed_count: number;
  failed_count: number;
  output: string;
  duration: number;
}

export interface GitHubIssue {
  number: number;
  url: string;
  state: 'open' | 'closed';
}

export interface PullRequest {
  number: number;
  url: string;
  state: 'open' | 'closed' | 'merged';
  branchName: string;
}

export interface BugStatus {
  bugId: string;
  status: 'submitted' | 'analyzing' | 'issue_created' | 'fixing' | 'testing' | 'pr_created' | 'resolved' | 'failed';
  githubIssue?: GitHubIssue;
  pullRequest?: PullRequest;
  fixAttempts: number;
  lastUpdated: Date;
  error?: string;
}

export interface NotificationPayload {
  to: string;
  subject: string;
  bugId: string;
  bugTitle: string;
  status: BugStatus['status'];
  githubIssueUrl?: string;
  pullRequestUrl?: string;
  message: string;
}

export interface CodeReview {
  approved: boolean;
  concerns: string[];
  suggestions: string[];
  testCoverage: string;
  overallAssessment: string;
}
