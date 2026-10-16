import nodemailer from 'nodemailer';
import { NotificationPayload } from '../types';
import { logger } from '../utils/logger';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    logger.info(`Sending notification to ${payload.to}: ${payload.status}`);

    const html = this.buildEmailHTML(payload);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'bugs@civet.dev',
        to: payload.to,
        subject: payload.subject,
        html,
      });

      logger.info(`Notification sent successfully to ${payload.to}`);
    } catch (error) {
      logger.error(`Error sending notification to ${payload.to}:`, error);
      throw error;
    }
  }

  async notifyBugSubmitted(
    email: string,
    bugId: string,
    title: string
  ): Promise<void> {
    await this.sendNotification({
      to: email,
      subject: `Bug Report Received: ${title}`,
      bugId,
      bugTitle: title,
      status: 'submitted',
      message: 'Your bug report has been received and is being analyzed by our automated system.',
    });
  }

  async notifyIssueCreated(
    email: string,
    bugId: string,
    title: string,
    issueUrl: string
  ): Promise<void> {
    await this.sendNotification({
      to: email,
      subject: `Bug Tracked: ${title}`,
      bugId,
      bugTitle: title,
      status: 'issue_created',
      githubIssueUrl: issueUrl,
      message: 'A GitHub issue has been created to track your bug report.',
    });
  }

  async notifyFixCreated(
    email: string,
    bugId: string,
    title: string,
    prUrl: string
  ): Promise<void> {
    await this.sendNotification({
      to: email,
      subject: `Fix Created: ${title}`,
      bugId,
      bugTitle: title,
      status: 'pr_created',
      pullRequestUrl: prUrl,
      message: 'An automated fix has been generated and submitted for review.',
    });
  }

  async notifyResolved(
    email: string,
    bugId: string,
    title: string,
    prUrl: string
  ): Promise<void> {
    await this.sendNotification({
      to: email,
      subject: `Bug Resolved: ${title}`,
      bugId,
      bugTitle: title,
      status: 'resolved',
      pullRequestUrl: prUrl,
      message: 'Your bug has been fixed and the changes have been merged!',
    });
  }

  async notifyFailed(
    email: string,
    bugId: string,
    title: string,
    issueUrl: string
  ): Promise<void> {
    await this.sendNotification({
      to: email,
      subject: `Bug Requires Manual Review: ${title}`,
      bugId,
      bugTitle: title,
      status: 'failed',
      githubIssueUrl: issueUrl,
      message: 'Our automated system could not fix this bug. It has been escalated to our engineering team.',
    });
  }

  private buildEmailHTML(payload: NotificationPayload): string {
    const statusEmoji = {
      submitted: '📝',
      analyzing: '🔍',
      issue_created: '🐛',
      fixing: '🔧',
      testing: '🧪',
      pr_created: '🔀',
      resolved: '✅',
      failed: '⚠️',
    }[payload.status] || '📧';

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .bug-info {
      background: white;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 5px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6b7280;
      font-size: 14px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${statusEmoji} Bug Loop</h1>
    <p>Automated Bug Tracking & Resolution</p>
  </div>

  <div class="content">
    <h2>Bug Update</h2>

    <div class="bug-info">
      <h3>${payload.bugTitle}</h3>
      <p><strong>Bug ID:</strong> ${payload.bugId}</p>
      <p><strong>Status:</strong> <span class="status-badge">${payload.status.replace('_', ' ')}</span></p>
    </div>

    <p>${payload.message}</p>

    ${payload.githubIssueUrl ? `<a href="${payload.githubIssueUrl}" class="button">View GitHub Issue</a>` : ''}
    ${payload.pullRequestUrl ? `<a href="${payload.pullRequestUrl}" class="button">View Pull Request</a>` : ''}
  </div>

  <div class="footer">
    <p>This is an automated notification from Bug Loop.</p>
    <p>Powered by Civet AI</p>
  </div>
</body>
</html>
`;
  }
}
