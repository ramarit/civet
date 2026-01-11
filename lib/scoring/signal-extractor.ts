/**
 * Signal Extraction System
 *
 * Extracts scoring signals from lead responses based on form field metadata.
 * Signals are transparent, weighted indicators used for lead prioritization.
 *
 * Core Principle: Conservative, explainable scoring - no black boxes.
 */

import type { Signal, FormField, Form } from "@/lib/types";

/**
 * Extract signals from lead responses
 */
export function extractSignals(
  responses: Record<string, any>,
  form: Form
): Signal[] {
  const signals: Signal[] = [];

  // Get all fields from all form steps
  const allFields = form.steps.flatMap((step) => step.fields);

  // Extract field-based signals
  for (const field of allFields) {
    const value = responses[field.id];

    if (value === undefined || value === null || value === "") {
      continue; // Skip empty responses
    }

    // Extract signal based on field type and metadata
    const signal = extractFieldSignal(field, value);
    if (signal) {
      signals.push(signal);
    }
  }

  // Extract completion signal
  const completionSignal = extractCompletionSignal(responses, allFields);
  signals.push(completionSignal);

  // Extract contact quality signal
  const contactSignal = extractContactQualitySignal(responses);
  signals.push(contactSignal);

  return signals;
}

/**
 * Extract signal from a specific form field
 */
function extractFieldSignal(
  field: FormField,
  value: any
): Signal | null {
  // Use explicit signal_type if provided
  if (field.signal_type) {
    return {
      type: field.signal_type,
      field: field.id,
      value,
      weight: getSignalWeight(field.signal_type, value),
      description: `${field.label}: ${formatValue(value)}`,
    };
  }

  // Otherwise, infer signal type from field properties
  const inferredType = inferSignalType(field);
  if (inferredType) {
    return {
      type: inferredType,
      field: field.id,
      value,
      weight: getSignalWeight(inferredType, value),
      description: `${field.label}: ${formatValue(value)}`,
    };
  }

  return null;
}

/**
 * Infer signal type from field properties (heuristics)
 */
function inferSignalType(field: FormField): Signal["type"] | null {
  const label = field.label.toLowerCase();
  const id = field.id.toLowerCase();

  // Budget indicators
  if (label.includes("budget") || id.includes("budget") ||
      label.includes("investment") || id.includes("price")) {
    return "budget";
  }

  // Urgency indicators
  if (label.includes("timeline") || label.includes("urgency") ||
      label.includes("when") || id.includes("timeline") ||
      label.includes("start")) {
    return "urgency";
  }

  // Service indicators
  if (label.includes("service") || label.includes("interested in") ||
      label.includes("need help with") || id.includes("service")) {
    return "service";
  }

  // Source indicators
  if (label.includes("hear about") || label.includes("referral") ||
      id.includes("source") || id.includes("utm")) {
    return "source";
  }

  return "other";
}

/**
 * Get weight for a signal based on type and value
 * Weights are conservative and explainable
 */
function getSignalWeight(type: Signal["type"], value: any): number {
  switch (type) {
    case "budget":
      return calculateBudgetWeight(value);

    case "urgency":
      return calculateUrgencyWeight(value);

    case "service":
      return calculateServiceWeight(value);

    case "source":
      return calculateSourceWeight(value);

    case "completion":
      return value; // Completion % is already 0-100

    case "contact_quality":
      return value; // Contact quality score is already weighted

    default:
      return 5; // Neutral weight for generic fields
  }
}

/**
 * Calculate budget signal weight (0-20 points)
 */
function calculateBudgetWeight(value: any): number {
  if (typeof value === "number") {
    // Numeric budget
    if (value >= 50000) return 20;
    if (value >= 20000) return 15;
    if (value >= 10000) return 10;
    if (value >= 5000) return 5;
    return 2;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase();

    // Budget ranges
    if (lower.includes("50k") || lower.includes("50,000") || lower.includes("enterprise")) return 20;
    if (lower.includes("20k") || lower.includes("20,000")) return 15;
    if (lower.includes("10k") || lower.includes("10,000")) return 10;
    if (lower.includes("5k") || lower.includes("5,000")) return 5;

    // Qualitative indicators
    if (lower.includes("flexible") || lower.includes("open")) return 12;
    if (lower.includes("limited") || lower.includes("tight")) return 3;
  }

  return 5; // Default for unclear budget
}

/**
 * Calculate urgency signal weight (0-15 points)
 */
function calculateUrgencyWeight(value: any): number {
  if (typeof value === "string") {
    const lower = value.toLowerCase();

    if (lower.includes("urgent") || lower.includes("asap") ||
        lower.includes("immediately") || lower.includes("this week")) {
      return 15;
    }

    if (lower.includes("next week") || lower.includes("soon") ||
        lower.includes("1-2 weeks")) {
      return 10;
    }

    if (lower.includes("this month") || lower.includes("next month") ||
        lower.includes("2-4 weeks")) {
      return 7;
    }

    if (lower.includes("quarter") || lower.includes("3 months") ||
        lower.includes("flexible")) {
      return 3;
    }
  }

  return 5; // Default urgency
}

/**
 * Calculate service signal weight (0-10 points)
 */
function calculateServiceWeight(value: any): number {
  if (typeof value === "string") {
    const lower = value.toLowerCase();

    // High-value service indicators
    if (lower.includes("enterprise") || lower.includes("custom") ||
        lower.includes("dedicated")) {
      return 10;
    }

    // Mid-value
    if (lower.includes("premium") || lower.includes("professional")) {
      return 7;
    }

    // Standard
    if (lower.includes("standard") || lower.includes("basic")) {
      return 4;
    }
  }

  return 5; // Default service weight
}

/**
 * Calculate source signal weight (0-12 points)
 */
function calculateSourceWeight(value: any): number {
  if (typeof value === "string") {
    const lower = value.toLowerCase();

    // High-intent sources
    if (lower.includes("referral") || lower.includes("existing client") ||
        lower.includes("partner")) {
      return 12;
    }

    // Medium-intent sources
    if (lower.includes("search") || lower.includes("google") ||
        lower.includes("linkedin")) {
      return 7;
    }

    // Low-intent sources
    if (lower.includes("social") || lower.includes("ad") ||
        lower.includes("facebook")) {
      return 3;
    }
  }

  return 5; // Default source weight
}

/**
 * Extract completion signal (how much of the form was filled)
 */
function extractCompletionSignal(
  responses: Record<string, any>,
  fields: FormField[]
): Signal {
  const requiredFields = fields.filter((f) => f.required);
  const allFieldIds = fields.map((f) => f.id);

  const completedFields = allFieldIds.filter(
    (id) => responses[id] !== undefined &&
            responses[id] !== null &&
            responses[id] !== ""
  );

  const completionRate = (completedFields.length / allFieldIds.length) * 100;

  return {
    type: "completion",
    value: Math.round(completionRate),
    weight: Math.round(completionRate / 5), // 0-20 points
    description: `Completed ${completedFields.length}/${allFieldIds.length} fields (${Math.round(completionRate)}%)`,
  };
}

/**
 * Extract contact quality signal
 * Checks email domain, phone presence, name completeness
 */
function extractContactQualitySignal(
  responses: Record<string, any>
): Signal {
  let qualityScore = 0;
  const indicators: string[] = [];

  // Email quality (0-8 points)
  const email = responses.email;
  if (email && typeof email === "string") {
    const domain = email.split("@")[1]?.toLowerCase();

    if (domain && !["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"].includes(domain)) {
      qualityScore += 8;
      indicators.push("business email");
    } else if (domain) {
      qualityScore += 4;
      indicators.push("personal email");
    }
  }

  // Phone presence (0-4 points)
  const phone = responses.phone;
  if (phone && phone.toString().length >= 10) {
    qualityScore += 4;
    indicators.push("phone provided");
  }

  // Name completeness (0-3 points)
  const name = responses.name;
  if (name && typeof name === "string") {
    if (name.trim().split(/\s+/).length >= 2) {
      qualityScore += 3;
      indicators.push("full name");
    } else {
      qualityScore += 1;
      indicators.push("name provided");
    }
  }

  return {
    type: "contact_quality",
    value: qualityScore,
    weight: qualityScore,
    description: indicators.length > 0
      ? `Contact quality: ${indicators.join(", ")}`
      : "Limited contact info",
  };
}

/**
 * Format value for display
 */
function formatValue(value: any): string {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    return value.length > 50 ? value.substring(0, 50) + "..." : value;
  }
  return String(value);
}
