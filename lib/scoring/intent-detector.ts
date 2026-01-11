/**
 * Intent Level Auto-Detection
 *
 * Automatically detects form intent level based on form name/purpose.
 * This enables zero-config scoring - users don't need to set intent manually.
 *
 * Core Principle: Opinionated defaults that just work.
 */

export type IntentLevel = "low" | "medium" | "high";

/**
 * Detect intent level from form name
 *
 * @param formName - The name/title of the form
 * @returns Detected intent level (defaults to "medium")
 */
export function detectIntentLevel(formName: string): IntentLevel {
  const normalized = formName.toLowerCase().trim();

  // High-intent patterns (transactional, commitment-seeking)
  if (matchesHighIntent(normalized)) {
    return "high";
  }

  // Low-intent patterns (informational, passive)
  if (matchesLowIntent(normalized)) {
    return "low";
  }

  // Default to medium (contact, inquiry, general interest)
  return "medium";
}

/**
 * Check if form name indicates high intent
 */
function matchesHighIntent(name: string): boolean {
  const highIntentPatterns = [
    // Booking/Scheduling
    "book", "schedule", "appointment", "meeting", "reserve", "calendar",

    // Sales/Transactional
    "buy", "purchase", "order", "checkout", "payment", "pricing",
    "quote", "proposal", "estimate", "bid",

    // Commitment
    "consultation", "demo", "trial", "start", "begin", "onboard",
    "enterprise", "implementation",

    // Urgent/Immediate
    "urgent", "immediate", "emergency", "asap",
  ];

  return highIntentPatterns.some((pattern) => name.includes(pattern));
}

/**
 * Check if form name indicates low intent
 */
function matchesLowIntent(name: string): boolean {
  const lowIntentPatterns = [
    // Newsletter/Subscriptions
    "newsletter", "subscribe", "subscription", "email list",
    "mailing list", "updates", "notification",

    // Downloads/Content
    "download", "ebook", "guide", "checklist", "template",
    "resource", "whitepaper", "pdf",

    // Social/Following
    "follow", "join", "community", "group",

    // Generic Signup (without commitment context)
    "signup", "sign up", "register", "registration",

    // Waitlist/Future
    "waitlist", "notify me", "coming soon", "early access",
  ];

  return lowIntentPatterns.some((pattern) => name.includes(pattern));
}

/**
 * Get intent level with fallback
 *
 * @param formIntentLevel - Explicit intent level (if set)
 * @param formName - Form name for auto-detection
 * @returns Final intent level to use
 */
export function getIntentLevel(
  formIntentLevel?: IntentLevel | null,
  formName?: string
): IntentLevel {
  // If explicitly set, use that
  if (formIntentLevel) {
    return formIntentLevel;
  }

  // Otherwise, auto-detect from name
  if (formName) {
    return detectIntentLevel(formName);
  }

  // Final fallback
  return "medium";
}

/**
 * Explain why an intent level was detected (for transparency)
 */
export function explainIntentDetection(
  formName: string,
  detected: IntentLevel
): string {
  const normalized = formName.toLowerCase();

  switch (detected) {
    case "high":
      if (normalized.includes("consultation") || normalized.includes("demo")) {
        return "High-intent form detected: Consultation/demo requests indicate strong buying intent";
      }
      if (normalized.includes("book") || normalized.includes("schedule")) {
        return "High-intent form detected: Booking/scheduling indicates commitment";
      }
      if (normalized.includes("quote") || normalized.includes("pricing")) {
        return "High-intent form detected: Pricing inquiries indicate purchase readiness";
      }
      return "High-intent form detected: Strong signals of immediate interest";

    case "low":
      if (normalized.includes("newsletter") || normalized.includes("subscribe")) {
        return "Low-intent form detected: Newsletter/subscription forms are typically informational";
      }
      if (normalized.includes("download") || normalized.includes("resource")) {
        return "Low-intent form detected: Content downloads indicate early-stage interest";
      }
      return "Low-intent form detected: Passive engagement expected";

    case "medium":
    default:
      return "Medium-intent form (default): General contact/inquiry form";
  }
}

/**
 * Suggest better form name if intent detection might be inaccurate
 */
export function suggestFormNameImprovements(
  formName: string
): string | null {
  const normalized = formName.toLowerCase();

  // Too generic
  if (
    normalized === "form" ||
    normalized === "contact" ||
    normalized === "submit"
  ) {
    return "Consider a more descriptive name like 'Consultation Request' or 'Project Inquiry' for better intent detection";
  }

  // Ambiguous
  if (normalized.includes("get") && !normalized.includes("quote")) {
    return "Clarify intent: 'Get Started' could mean signup (low) or consultation (high)";
  }

  return null;
}
