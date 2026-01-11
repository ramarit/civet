# Field Signal Detection

## The Challenge

To extract useful scoring signals, we need to know which form field represents what:
- Which field asks about budget?
- Which field asks about timeline?
- Which field asks about referral source?

## The Solution: Smart Heuristics (Zero Config)

Instead of requiring users to manually map fields, we **detect signal types automatically** based on how users naturally name their fields.

## How It Works

### Detection Logic

```typescript
Field: { label: "What's your budget?" }
→ Detect: Contains "budget" keyword
→ Signal Type: budget
→ Extract: Budget signal with appropriate weighting

Field: { label: "When do you need to start?" }
→ Detect: Contains "when" + "start" keywords
→ Signal Type: urgency
→ Extract: Urgency signal

Field: { label: "How did you hear about us?" }
→ Detect: Contains "hear about" keyword
→ Signal Type: source
→ Extract: Source signal
```

### Supported Signal Types

#### 1. Budget Signal
**Keywords detected:**
- budget, cost, price, pricing, investment, spend
- afford, pay, payment, quote, estimate, fee, rate
- much, how much, what's your budget, budget range

**Examples that work:**
- ✅ "What's your budget?"
- ✅ "Project cost"
- ✅ "How much can you invest?"
- ✅ "Budget range"
- ✅ "Pricing expectations"

#### 2. Urgency Signal
**Keywords detected:**
- timeline, urgency, urgent, when, timeframe, time frame
- start, begin, launch, deadline, asap, schedule
- how soon, when do you need, when would you like

**Examples that work:**
- ✅ "When do you need to start?"
- ✅ "Project timeline"
- ✅ "How soon do you need this?"
- ✅ "Deadline"
- ✅ "Urgency level"

#### 3. Service Signal
**Keywords detected:**
- service, services, interested in, interest, looking for
- need help with, need, require, want, type of
- which service, what service, help with, project type

**Examples that work:**
- ✅ "Which service are you interested in?"
- ✅ "What do you need help with?"
- ✅ "Type of project"
- ✅ "Service required"

#### 4. Source Signal
**Keywords detected:**
- hear about, heard about, find us, found us, referral
- referred by, source, how did you, where did you
- learn about, discover, utm, came from

**Examples that work:**
- ✅ "How did you hear about us?"
- ✅ "Referral source"
- ✅ "Where did you find us?"
- ✅ "Who referred you?"

## What Happens When Detection Fails?

If we can't detect a specific signal type, the field is marked as **"other"**:
- Gets neutral weight (5 points)
- Still contributes to completion signal
- Still included in form responses

**This is safe by design** - we prefer neutral weighting over wrong assumptions.

## Progressive Enhancement Path

### Phase 1: Heuristics Only (MVP - Current)
```
User creates field: "Budget?"
→ System detects: budget signal
→ Works automatically
→ Zero configuration required
```

### Phase 2: Preset Templates (Better UX)
```
Form Builder:
┌────────────────────────────────────┐
│ Quick Add:                         │
│ □ Budget Question (optimized)      │
│ □ Timeline Question (optimized)    │
│ □ Referral Source (optimized)      │
│                                    │
│ Or create custom field             │
└────────────────────────────────────┘

Preset includes:
- Pre-written question
- Select options (if applicable)
- Explicit signal_type set
```

### Phase 3: Manual Override (Power Users)
```
Field Settings:
┌────────────────────────────────────┐
│ Label: "What's your spend range?"  │
│                                    │
│ Signal Type: Auto (budget)         │
│ Override: [Select type...]         │
│   ○ None                           │
│   ○ Budget                         │
│   ○ Urgency                        │
│   ○ Service                        │
│   ○ Source                         │
└────────────────────────────────────┘
```

## Examples: Real-World Forms

### Example 1: Web Design Inquiry

```typescript
Form: "Website Project Inquiry"
Fields:
  1. "Your name" → No signal (contact info)
  2. "Email" → No signal (contact info)
  3. "What's your budget range?" → budget signal ✓
  4. "When do you need to launch?" → urgency signal ✓
  5. "How did you find us?" → source signal ✓
  6. "Tell us about your project" → No signal (message)

Signals extracted: 3/6 fields
Success rate: 50% (this is good!)
```

### Example 2: Legal Consultation

```typescript
Form: "Case Consultation Request"
Fields:
  1. "Full name" → No signal
  2. "Phone number" → No signal
  3. "Case type" → service signal ✓
  4. "How urgent is your case?" → urgency signal ✓
  5. "How did you hear about our firm?" → source signal ✓
  6. "Budget for legal services" → budget signal ✓

Signals extracted: 4/6 fields
Success rate: 67% (excellent!)
```

### Example 3: Newsletter Signup (Low Intent)

```typescript
Form: "Newsletter Signup"
Fields:
  1. "Email" → No signal
  2. "First name" → No signal
  3. "Company (optional)" → No signal

Signals extracted: 0/3 fields
Success rate: 0% (this is fine!)

Why it's fine:
- Low-intent form doesn't need signals
- Completion and contact quality still scored
- Intent level sets appropriate thresholds
```

## Debugging Signal Detection

When viewing a lead's scoring breakdown, users should see:

```
Lead: John Smith
Score: 72 points

Signals Detected:
✓ Budget: "$25k for website" (+15 pts)
  Detected from field: "Project budget"

✓ Urgency: "Need to launch in 6 weeks" (+10 pts)
  Detected from field: "Timeline"

✓ Source: "Referral from Jane" (+12 pts)
  Detected from field: "How did you hear about us?"

✓ Contact Quality: Business email, phone provided (+12 pts)

✓ Completion: 100% of fields filled (+20 pts)

○ No service signal detected
  Consider adding a "Service needed" field
```

## When to Use Explicit signal_type

**Use explicit `signal_type` when:**

1. **Custom/creative field names**
   ```typescript
   {
     label: "How much are you looking to invest in growth?",
     signal_type: "budget" // Explicit override
   }
   ```

2. **Non-English forms**
   ```typescript
   {
     label: "¿Cuál es su presupuesto?",
     signal_type: "budget" // Heuristics won't detect Spanish
   }
   ```

3. **Ambiguous phrasing**
   ```typescript
   {
     label: "Tell us about your needs",
     signal_type: "service" // Could be interpreted many ways
   }
   ```

## Best Practices for Users

### ✅ DO: Use Clear, Standard Language

```
Good field names:
✓ "What's your budget?"
✓ "When do you need to start?"
✓ "How did you hear about us?"
✓ "Which service are you interested in?"
```

### ❌ DON'T: Use Vague or Creative Names (If You Want Auto-Detection)

```
Problematic field names:
✗ "Q1" (no context)
✗ "Your thoughts on investment" (too vague)
✗ "Timing considerations" (ambiguous)
✗ "Referrer" (too abbreviated)

These will be marked as "other" (5 pts neutral)
```

### 💡 TIP: Test Your Form

After creating a form, submit a test lead and check:
1. Were signals detected correctly?
2. Is the score reasonable?
3. If not, either:
   - Rename fields to be clearer
   - Add explicit signal_type
   - Add custom scoring rule

## Future Enhancements (Not MVP)

1. **Learning System**
   - Track which field names worked well
   - Suggest improvements to detection patterns
   - Auto-improve heuristics over time

2. **Multi-Language Support**
   - Detect language from field content
   - Apply language-specific patterns
   - Support international users

3. **Custom Pattern Library**
   - Let power users define their own patterns
   - Share patterns across forms
   - Industry-specific templates
