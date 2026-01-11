# Civet Scoring System

## Philosophy

The scoring system is designed to be **transparent, conservative, and context-aware** without making assumptions about what's "valuable" to your specific business.

## How It Works

### 1. **Signal Extraction** (Automatic)
The system automatically extracts signals from lead responses:

- **Budget**: Detects budget mentions and qualitative indicators
- **Urgency**: Timeline language
- **Service**: Service type mentions
- **Source**: How they found you
- **Completion**: Form completion rate
- **Contact Quality**: Email domain, phone, name completeness

**Important**: Signals measure **clarity and intent**, not absolute value.

### 2. **Signal Weighting** (Universal)
Each signal gets a weight based on **universal indicators**:

#### Budget Signal (0-20 pts)
- ✅ **What we DO weight**: Signal clarity
  - Specific number mentioned: Higher weight
  - "Flexible/Open": Good signal (15 pts)
  - "Limited/Tight": Weak signal (3 pts)
  - Any budget mention: Medium signal (8 pts)

- ❌ **What we DON'T assume**: Business-specific value
  - We don't assume $50k is "high" or $5k is "low"
  - Your $5k might be another's $50k

#### Why This Approach?
```
❌ Bad (Hardcoded assumptions):
   $50k budget → 20 points
   Problem: Assumes universal value scale

✅ Good (Signal quality):
   Specific number + "flexible" → 15 points
   "Limited budget" → 3 points
   Lets YOU define what's valuable via scoring rules
```

### 3. **Scoring Rules** (Business-Specific)

**This is where YOU define what's valuable for YOUR business.**

You configure per-form rules like:

```typescript
// For an enterprise consultant:
{
  field: "budget",
  operator: "greater_than",
  value: 50000,
  points: 25
}

// For a freelance designer:
{
  field: "budget",
  operator: "greater_than",
  value: 3000,
  points: 25
}
```

**The scoring rule adds business-specific context on top of universal signal weights.**

### 4. **Priority Buckets** (Context-Aware)

Final priority depends on:
1. **Total Score** (signals + rules)
2. **Form Intent Level** (adjusts thresholds)

```
HIGH INTENT Form (e.g., "Book Consultation"):
- 50+ pts = HIGH priority
- 30-49 pts = MEDIUM priority
- <30 pts = LOW priority

LOW INTENT Form (e.g., "Newsletter"):
- 70+ pts = HIGH priority
- 50-69 pts = MEDIUM priority
- <50 pts = LOW priority
```

## Example Walkthrough

### Lead: Jane Doe submits "Enterprise Consultation" form

**Responses:**
```json
{
  "budget": "flexible, around 25k",
  "timeline": "need to start next month",
  "source": "Google search",
  "email": "jane@company.com",
  "phone": "555-1234"
}
```

**Step 1: Extract Signals**
- Budget: "flexible" detected → 15 pts (good intent)
- Urgency: "next month" → 7 pts (medium urgency)
- Source: "Google" → 7 pts (medium intent source)
- Contact Quality: business email + phone → 12 pts
- Completion: 100% → 20 pts

**Base Score**: 61 points

**Step 2: Apply Scoring Rules** (if configured)
```typescript
// Your rule: "budget contains '25k' → +20 points"
```
**Rules Score**: +20 points

**Step 3: Calculate Priority**
- Final Score: 81 points
- Form Intent: "high"
- Threshold: 50+ = HIGH priority

**Result**: Jane is marked HIGH priority

**Why transparent?**
User can see:
- "Budget signal: flexible, specific amount (+15 pts)"
- "Contact quality: business email, phone provided (+12 pts)"
- "Custom rule matched: budget ≥ 25k (+20 pts)"

## Configuring for Your Business

### Option 1: Use Defaults (Recommended for MVP)
Just set form intent levels:
- HIGH: Contact forms, consultation requests
- MEDIUM: General inquiries
- LOW: Newsletter, downloads

The system will use universal signals to prioritize.

### Option 2: Add Business-Specific Rules
Define what's valuable TO YOU:

```typescript
// Example: Legal services
{
  form: "Case Consultation",
  intent_level: "high",
  scoring_rules: [
    {
      field: "case_type",
      operator: "contains",
      value: "corporate",
      points: 20
    },
    {
      field: "budget",
      operator: "greater_than",
      value: 10000,
      points: 25
    }
  ],
  disqualifiers: [
    {
      field: "location",
      operator: "equals",
      value: "outside_service_area",
      reason: "Outside service area"
    }
  ]
}
```

## Anti-Patterns (What NOT to Do)

❌ **Don't try to make signals cross-business comparable**
- Your high-priority lead ≠ another business's high-priority
- Keep scoring per-form

❌ **Don't over-tune for edge cases**
- Start with defaults
- Add rules only when you see clear patterns

❌ **Don't assume AI is always right**
- Signals are transparent, explainable
- AI summary is advisory, not decision-making

## Future Enhancements (Not in V1)

- **Historical calibration**: Learn from your past leads
- **Dynamic thresholds**: Adjust based on volume
- **Field importance weighting**: Let users boost specific signals
- **Multi-touch scoring**: Account for multiple form submissions

## Questions?

**Q: Why not just use AI to score everything?**
A: AI is a black box. We want users to understand WHY a lead is prioritized. Signals + rules = transparent, tunable system.

**Q: Can I customize signal weights?**
A: Not in V1. Use scoring rules to add business-specific points on top of universal signals.

**Q: What if my form has unique fields?**
A: Add a `signal_type` to the field definition, or use scoring rules to match specific values.

**Q: Why log scale for budgets?**
A: To avoid bias toward large numbers. $100k shouldn't be 20x more important than $5k just because it's 20x larger.
