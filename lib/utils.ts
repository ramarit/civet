import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(d);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate subdomain format (alphanumeric and hyphens only)
 */
export function isValidSubdomain(subdomain: string): boolean {
  const subdomainRegex = /^[a-z0-9-]+$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63;
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Calculate lead score based on scoring rules
 */
export function calculateLeadScore(
  responses: Record<string, any>,
  scoringRules: Array<{
    field: string;
    operator: "equals" | "contains" | "greater_than" | "less_than";
    value: string | number;
    points: number;
  }>
): number {
  let score = 0;

  for (const rule of scoringRules) {
    const fieldValue = responses[rule.field];
    if (fieldValue === undefined) continue;

    let matches = false;
    switch (rule.operator) {
      case "equals":
        matches = fieldValue === rule.value;
        break;
      case "contains":
        matches = String(fieldValue).toLowerCase().includes(String(rule.value).toLowerCase());
        break;
      case "greater_than":
        matches = Number(fieldValue) > Number(rule.value);
        break;
      case "less_than":
        matches = Number(fieldValue) < Number(rule.value);
        break;
    }

    if (matches) {
      score += rule.points;
    }
  }

  return score;
}
