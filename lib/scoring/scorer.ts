/**
 * Lead Scoring System
 *
 * Calculates lead scores and priority buckets based on:
 * 1. Form intent level (context)
 * 2. Extracted signals (evidence)
 * 3. Scoring rules (business logic)
 * 4. Disqualifiers (hard stops)
 *
 * Core Principles:
 * - Conservative scoring (avoid false positives)
 * - Transparent calculation (every point is explainable)
 * - Per-form context (no cross-form comparisons)
 */

import type { Lead, Form, Signal, DisqualifierRule, ScoringRule } from "@/lib/types";
import { extractSignals } from "./signal-extractor";

export interface ScoringResult {
  score: number;
  priority: "high" | "medium" | "low";
  signals: Signal[];
  disqualified: boolean;
  disqualified_reason?: string;
}

/**
 * Score a lead based on form configuration
 */
export function scoreLead(
  responses: Record<string, any>,
  form: Form
): ScoringResult {
  // Step 1: Check disqualifiers first
  const disqualification = checkDisqualifiers(responses, form.disqualifiers || []);
  if (disqualification.disqualified) {
    return {
      score: 0,
      priority: "low",
      signals: [],
      disqualified: true,
      disqualified_reason: disqualification.reason,
    };
  }

  // Step 2: Extract signals
  const signals = extractSignals(responses, form);

  // Step 3: Calculate base score from signals
  const baseScore = signals.reduce((sum, signal) => sum + signal.weight, 0);

  // Step 4: Apply custom scoring rules
  const rulesScore = applyScoringRules(responses, form.scoring_rules || []);

  // Step 5: Calculate final score
  const finalScore = Math.min(100, baseScore + rulesScore);

  // Step 6: Determine priority bucket based on intent level and score
  const priority = determinePriority(finalScore, form.intent_level);

  return {
    score: Math.round(finalScore),
    priority,
    signals,
    disqualified: false,
  };
}

/**
 * Check if lead matches any disqualifier rules
 */
function checkDisqualifiers(
  responses: Record<string, any>,
  disqualifiers: DisqualifierRule[]
): { disqualified: boolean; reason?: string } {
  for (const rule of disqualifiers) {
    const value = responses[rule.field];

    if (value === undefined || value === null) {
      continue;
    }

    const matches = evaluateCondition(value, rule.operator, rule.value);

    if (matches) {
      return {
        disqualified: true,
        reason: rule.reason,
      };
    }
  }

  return { disqualified: false };
}

/**
 * Apply custom scoring rules defined by the user
 */
function applyScoringRules(
  responses: Record<string, any>,
  rules: ScoringRule[]
): number {
  let totalPoints = 0;

  for (const rule of rules) {
    const value = responses[rule.field];

    if (value === undefined || value === null) {
      continue;
    }

    const matches = evaluateCondition(value, rule.operator, rule.value);

    if (matches) {
      totalPoints += rule.points;
    }
  }

  return totalPoints;
}

/**
 * Evaluate a condition (used by both disqualifiers and scoring rules)
 */
function evaluateCondition(
  actualValue: any,
  operator: string,
  expectedValue: string | number
): boolean {
  const actual = String(actualValue).toLowerCase();
  const expected = String(expectedValue).toLowerCase();

  switch (operator) {
    case "equals":
      return actual === expected;

    case "contains":
      return actual.includes(expected);

    case "greater_than":
      const actualNum = parseFloat(actual);
      const expectedNum = parseFloat(expected);
      return !isNaN(actualNum) && !isNaN(expectedNum) && actualNum > expectedNum;

    case "less_than":
      const actualNumLt = parseFloat(actual);
      const expectedNumLt = parseFloat(expected);
      return !isNaN(actualNumLt) && !isNaN(expectedNumLt) && actualNumLt < expectedNumLt;

    default:
      return false;
  }
}

/**
 * Determine priority bucket based on score and form intent level
 *
 * Priority thresholds are context-aware:
 * - High intent forms: more leads get "high" priority
 * - Low intent forms: stricter thresholds
 */
function determinePriority(
  score: number,
  intentLevel: "low" | "medium" | "high"
): "high" | "medium" | "low" {
  // Define thresholds per intent level
  const thresholds = getIntentThresholds(intentLevel);

  if (score >= thresholds.high) {
    return "high";
  }

  if (score >= thresholds.medium) {
    return "medium";
  }

  return "low";
}

/**
 * Get priority thresholds based on form intent level
 */
function getIntentThresholds(intentLevel: "low" | "medium" | "high"): {
  high: number;
  medium: number;
} {
  switch (intentLevel) {
    case "high":
      // High-intent forms (e.g., "Book Consultation")
      // More lenient - we expect qualified leads
      return {
        high: 50, // 50+ points = high priority
        medium: 30, // 30-49 points = medium priority
      };

    case "medium":
      // Medium-intent forms (e.g., "Contact Us")
      // Balanced thresholds
      return {
        high: 60, // 60+ points = high priority
        medium: 40, // 40-59 points = medium priority
      };

    case "low":
      // Low-intent forms (e.g., "Newsletter Signup")
      // Strict thresholds - need strong signals
      return {
        high: 70, // 70+ points = high priority
        medium: 50, // 50-69 points = medium priority
      };
  }
}

/**
 * Re-score an existing lead (for updates/manual review)
 */
export function rescoreLead(lead: Lead, form: Form): ScoringResult {
  return scoreLead(lead.responses, form);
}

/**
 * Explain score breakdown (for transparency)
 */
export function explainScore(signals: Signal[]): string {
  if (signals.length === 0) {
    return "No scoring signals detected.";
  }

  const sortedSignals = [...signals].sort((a, b) => b.weight - a.weight);

  const breakdown = sortedSignals
    .filter((s) => s.weight > 0)
    .map((s) => `• ${s.description} (+${s.weight} pts)`)
    .join("\n");

  const totalPoints = signals.reduce((sum, s) => sum + s.weight, 0);

  return `**Score Breakdown (${totalPoints} points):**\n${breakdown}`;
}
