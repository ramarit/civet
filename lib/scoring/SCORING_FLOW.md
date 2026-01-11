# Scoring Flow: How Leads Are Prioritized

## The Two-Layer Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    LEAD SUBMISSION                          │
│  "Jane submits Enterprise Consultation form"               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              LAYER 1: UNIVERSAL SIGNALS                     │
│         (No business assumptions - clarity only)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Signal Type       What We Detect           Weight         │
│  ─────────────────────────────────────────────────────     │
│  Budget            ✓ Specific number?       0-20 pts      │
│                    ✓ "Flexible" intent?                    │
│                    ✓ Budget constraint?                    │
│                                                             │
│  Urgency           ✓ Timeline clarity        0-15 pts      │
│                    ✓ Urgent language                       │
│                                                             │
│  Source            ✓ Referral vs ad          0-12 pts      │
│                    ✓ High-intent channel                   │
│                                                             │
│  Contact Quality   ✓ Business email?         0-15 pts      │
│                    ✓ Phone provided?                       │
│                    ✓ Full name?                            │
│                                                             │
│  Completion        ✓ % fields filled         0-20 pts      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    Base Score: 61 pts
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│        LAYER 2: BUSINESS-SPECIFIC SCORING RULES             │
│        (YOU define what's valuable to YOUR business)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Rules:                                                │
│  ✓ budget > $20k → +25 points                              │
│  ✓ service = "enterprise" → +15 points                     │
│  ✓ industry = "healthcare" → +10 points                    │
│                                                             │
│  Rules Applied: +40 pts                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    Final Score: 101 pts
                    (capped at 100)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              PRIORITY BUCKET DETERMINATION                  │
│        (Context-aware based on form intent level)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Form Intent: HIGH (Enterprise Consultation)                │
│  Thresholds:                                                │
│    • 50+ pts = HIGH priority                                │
│    • 30-49 pts = MEDIUM priority                            │
│    • <30 pts = LOW priority                                 │
│                                                             │
│  Lead Score: 100 pts → HIGH PRIORITY ✓                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RESULT                                   │
├─────────────────────────────────────────────────────────────┤
│  Priority: HIGH                                             │
│  Score: 100                                                 │
│  Signals: [budget +15, urgency +7, contact +12, ...]       │
│  Disqualified: No                                           │
│  AI Summary: "High-value lead with flexible budget..."      │
└─────────────────────────────────────────────────────────────┘
```

## Why Two Layers?

### Layer 1: Universal Signals (Default Behavior)
**Purpose**: Extract intent signals that are universal across businesses

**Examples of GOOD universal signals:**
- ✅ "Flexible budget" = good intent (doesn't assume amount)
- ✅ "Urgent timeline" = high intent (universal urgency)
- ✅ Business email = higher quality contact (universal)
- ✅ Referral source = higher trust (universal)

**Examples of BAD universal signals:**
- ❌ "$50k budget = high value" (value is business-specific)
- ❌ "Enterprise service = high value" (depends on your business)
- ❌ "Healthcare industry = high value" (your niche matters)

### Layer 2: Scoring Rules (Your Customization)
**Purpose**: Add YOUR business context on top of universal signals

**When to add rules:**
- You know specific industries are high-value TO YOU
- You have minimum budget thresholds
- Certain services are more profitable
- Geographic preferences matter
- Specific keywords indicate quality

## Example Scenarios

### Scenario 1: Freelance Web Designer

**Form:** "Project Inquiry" (MEDIUM intent)

**Lead A:**
- Budget: "$3,000 for website redesign"
- Timeline: "1-2 months"
- Source: "Referral from past client"

**Scoring:**
- Budget signal: Specific number + mention → 12 pts
- Urgency: Medium timeline → 7 pts
- Source: Referral → 12 pts
- Contact: Business email → 8 pts
- Completion: 90% → 18 pts

**Base Score:** 57 pts

**Your Rules:**
- Budget > $2,500 → +20 pts (your threshold)
- Source = referral → +15 pts (high trust)

**Final Score:** 92 pts → **HIGH PRIORITY**

---

**Lead B:**
- Budget: "Just exploring options"
- Timeline: "No rush"
- Source: "Facebook ad"

**Scoring:**
- Budget signal: Vague → 5 pts
- Urgency: Low → 3 pts
- Source: Ad → 3 pts
- Contact: Gmail → 4 pts
- Completion: 60% → 12 pts

**Base Score:** 27 pts

**Your Rules:** None matched

**Final Score:** 27 pts → **LOW PRIORITY**

### Scenario 2: Enterprise SaaS Consultant

**Form:** "Demo Request" (HIGH intent)

**Lead A:**
- Budget: "Not sure, need to understand pricing"
- Company: "Fortune 500"
- Timeline: "Evaluating Q1"

**Scoring:**
- Budget signal: Unclear → 5 pts
- Urgency: Medium → 7 pts
- Contact: Corporate email → 12 pts
- Completion: 80% → 16 pts

**Base Score:** 40 pts

**Your Rules:**
- Company size = "enterprise" → +30 pts (your target)
- Timeline = "Q1" → +10 pts (active buying)

**Final Score:** 80 pts → **HIGH PRIORITY**

(Even with unclear budget, enterprise context makes it valuable)

## Decision Tree

```
Lead Submitted
    │
    ├─ Check Disqualifiers
    │   ├─ Matched → DISQUALIFIED ❌
    │   └─ Not Matched → Continue
    │
    ├─ Extract Universal Signals
    │   └─ Base Score (0-100)
    │
    ├─ Apply Your Scoring Rules
    │   └─ Rules Score (0-∞)
    │
    ├─ Calculate Final Score
    │   └─ min(Base + Rules, 100)
    │
    └─ Determine Priority
        ├─ Form Intent: HIGH → Lenient thresholds
        ├─ Form Intent: MEDIUM → Balanced thresholds
        └─ Form Intent: LOW → Strict thresholds
            │
            ├─ HIGH priority → Top of inbox
            ├─ MEDIUM priority → Middle of inbox
            └─ LOW priority → Bottom of inbox
```

## Key Principles

1. **Universal signals measure clarity, not value**
   - "Flexible budget" = good signal
   - "$50k budget" ≠ automatically valuable

2. **Business rules add YOUR context**
   - YOU define what budget is high for you
   - YOU define what industries matter

3. **Intent level adjusts thresholds**
   - High-intent forms: expect good leads
   - Low-intent forms: need stronger signals

4. **Transparency over accuracy**
   - User should understand WHY a lead is prioritized
   - Explainable > optimal

5. **Conservative scoring**
   - Avoid false positives
   - Better to underscore than overscore
