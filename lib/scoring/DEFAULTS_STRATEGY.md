# Zero-Config Scoring Strategy

## Problem Statement

**Current approach violates "Defaults over configuration":**
- User must set `intent_level` on every form
- User should add `scoring_rules` for it to be useful
- This is too much configuration for MVP

## ✅ Solution: Smart Defaults Based on Form Purpose

### Tier 1: Automatic Intent Detection

**The system should infer intent level from form metadata:**

```typescript
// User creates form with name "Book Consultation"
→ System detects: consultation, booking keywords
→ Auto-assigns: intent_level = "high"

// User creates form with name "Newsletter Signup"
→ System detects: newsletter, signup keywords
→ Auto-assigns: intent_level = "low"

// User creates form with name "Contact Us"
→ System detects: contact keywords
→ Auto-assigns: intent_level = "medium" (default)
```

**Keyword Detection:**
```typescript
HIGH INTENT:
- consultation, demo, trial, quote, proposal
- book, schedule, appointment
- buy, purchase, pricing, enterprise

MEDIUM INTENT:
- contact, inquiry, question, help
- info, information, details

LOW INTENT:
- newsletter, subscribe, download
- signup, register (generic)
- follow, updates
```

### Tier 2: Universal Signals Only (No Rules Needed)

**For MVP, scoring should work WITHOUT any custom rules:**

```
Base scoring (0-100 points):
├─ Budget clarity: 0-20 pts
├─ Urgency indicators: 0-15 pts
├─ Source quality: 0-12 pts
├─ Contact completeness: 0-15 pts
├─ Form completion: 0-20 pts
└─ Response quality: 0-18 pts

Total: Up to 100 points from universal signals alone
```

**Priority buckets based ONLY on:**
1. Auto-detected intent level
2. Universal signal score

**No custom rules required for MVP.**

### Tier 3: Optional Enhancement (Later)

**Only power users who need customization:**

```typescript
// OPTIONAL: Override auto-detected intent
form.intent_level = "high" // Manual override

// OPTIONAL: Add business-specific rules
form.scoring_rules = [
  { field: "budget", operator: "greater_than", value: 10000, points: 25 }
]

// OPTIONAL: Add disqualifiers
form.disqualifiers = [
  { field: "location", operator: "equals", value: "excluded", reason: "..." }
]
```

## Revised User Experience

### Creating a Form (Zero Config)

```
User: "Create form"
System: "What's the form for?"
User: "Client consultation requests"

System automatically:
✓ Detects "consultation" keyword
✓ Sets intent_level = "high"
✓ Form is ready to use
✓ Scoring works immediately
```

### Viewing Leads (Zero Config)

```
INBOX: Client Consultation Form (HIGH INTENT)

[HIGH] John Smith - 87 points
  Signals: Business email, flexible budget, urgent timeline
  Summary: "Strong lead - specific budget, urgent need"

[MED] Jane Doe - 54 points
  Signals: Personal email, unclear timeline
  Summary: "Moderate interest - needs follow-up"

[LOW] Bob Jones - 31 points
  Signals: Incomplete form, vague inquiry
  Summary: "Low priority - exploratory inquiry"
```

**User did NOT configure anything. System just works.**

## Implementation Changes Needed

### 1. Auto-Detect Intent Level

```typescript
// In form creation API/UI
function detectIntentLevel(formName: string): "low" | "medium" | "high" {
  const name = formName.toLowerCase();

  // High-intent keywords
  const highIntent = [
    "consultation", "demo", "trial", "quote", "proposal",
    "book", "schedule", "appointment", "meeting",
    "buy", "purchase", "pricing", "enterprise"
  ];

  // Low-intent keywords
  const lowIntent = [
    "newsletter", "subscribe", "download",
    "signup", "register", "follow", "updates"
  ];

  if (highIntent.some(keyword => name.includes(keyword))) {
    return "high";
  }

  if (lowIntent.some(keyword => name.includes(keyword))) {
    return "low";
  }

  return "medium"; // Default
}
```

### 2. Make intent_level Optional in Schema

```typescript
// In Directus schema:
intent_level: {
  type: "string",
  default: "medium", // Auto-set if not provided
  options: ["low", "medium", "high"]
}
```

### 3. Make Scoring Rules Optional

```typescript
// Scoring should work without any rules
scoring_rules: {
  type: "json",
  default: [], // Empty = use only universal signals
  nullable: true
}
```

## Example: Real-World Flow

### Scenario: Freelance Designer

**Step 1: Create Form**
```
Form name: "Website Project Inquiry"
→ Auto-detected: MEDIUM intent
→ No configuration needed
```

**Step 2: Lead Submits**
```
Name: Sarah Johnson
Email: sarah@startupco.com
Budget: "$5,000 for new website"
Timeline: "Need to launch in 6 weeks"
Source: "Referral from Jane"
```

**Step 3: Automatic Scoring**
```
Universal Signals:
├─ Budget: Specific number ("$5,000") → 12 pts
├─ Urgency: Timeframe ("6 weeks") → 10 pts
├─ Source: Referral → 12 pts
├─ Contact: Business email → 8 pts
├─ Completion: 100% → 20 pts
└─ Quality: Well-written → 15 pts

Total: 77 points
Form Intent: MEDIUM
Threshold: 60+ = HIGH

→ Sarah is HIGH PRIORITY ✓
```

**Step 4: User Sees Result**
```
[HIGH] Sarah Johnson - 77 points
  "High-value lead: specific budget, clear timeline, referral source"
```

**User never configured anything.**

## When Users DO Need Configuration

**Progressive disclosure:**

1. **Week 1-2**: Use defaults, see how it works
2. **Week 3**: Notice pattern: "Hmm, all healthcare leads are good for me"
3. **Add rule**: `industry = "healthcare" → +20 points`
4. **Result**: Healthcare leads now prioritized higher

**Configuration is opt-in, not required.**

## MVP Checklist (Revised)

### ✅ Phase 1: Zero-Config Scoring
- [ ] Auto-detect intent level from form name
- [ ] Make intent_level have smart default
- [ ] Ensure scoring works with zero custom rules
- [ ] Universal signals provide 0-100 point range
- [ ] Priority buckets work from universal signals alone

### ⏳ Phase 2: Optional Enhancements (Later)
- [ ] UI to override intent level
- [ ] UI to add custom scoring rules
- [ ] UI to add disqualifiers
- [ ] Historical learning (auto-suggest rules)

## Key Principle

> **"Works perfectly with zero config, gets better with optional tuning"**

Not:
> ~~"Requires configuration to work, then you can tune it"~~

This is the difference between an opinionated product and a framework.
