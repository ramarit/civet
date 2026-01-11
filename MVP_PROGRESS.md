# Civet MVP Progress - Phase 1

## ✅ Completed (This Session)

### 1. **Data Model Design**
- ✅ Added `intent_level` to forms (`low` | `medium` | `high`)
- ✅ Added `signals[]` to leads for transparency
- ✅ Added `priority` to leads (`high` | `medium` | `low`)
- ✅ Added `disqualified` boolean and `disqualified_reason` to leads
- ✅ Added `ai_summary` field for AI explanations
- ✅ Added `DisqualifierRule` type for auto-disqualification
- ✅ Added `signal_type` metadata to form fields

### 2. **Scoring Engine**
- ✅ Created `signal-extractor.ts` - Extracts signals from lead responses
  - Budget signals (0-20 pts)
  - Urgency signals (0-15 pts)
  - Service signals (0-10 pts)
  - Source signals (0-12 pts)
  - Completion signals (0-20 pts)
  - Contact quality signals (0-15 pts)
- ✅ Created `scorer.ts` - Calculates scores and priority buckets
  - Context-aware thresholds based on form intent level
  - Disqualifier evaluation
  - Custom scoring rules support
  - Score explanation functionality

### 3. **Documentation**
- ✅ Created `SCHEMA_MIGRATION.md` - Directus schema changes guide
- ✅ Updated TypeScript types in `lib/types.ts`
- ✅ This progress document

## 🚧 Next Steps (In Order of Priority)

### Phase 1B: Integration & Testing

#### 1. **Directus Schema Migration** (Do This First!)
**Before any code will work, you must update Directus schema:**

```
Follow instructions in SCHEMA_MIGRATION.md:
1. Add intent_level to forms collection
2. Add signals, priority, disqualified fields to leads collection
3. Update permissions for User role
```

#### 2. **Lead Submission Scoring**
Create API endpoint that scores leads when they're submitted:

**File to create:** `app/api/leads/route.ts` (or update existing)
```typescript
import { scoreLead } from "@/lib/scoring/scorer";

// When lead is created:
const scoringResult = scoreLead(responses, form);

// Save to Directus:
await directus.request(createItem("leads", {
  ...leadData,
  signals: scoringResult.signals,
  score: scoringResult.score,
  priority: scoringResult.priority,
  disqualified: scoringResult.disqualified,
  disqualified_reason: scoringResult.disqualified_reason,
}));
```

#### 3. **Update Seed Script**
Update `scripts/seed-inbox.ts` to include:
- Forms with different `intent_level` values
- Leads with realistic `signals`, `priority`, `disqualified` data
- Use the scoring system to calculate realistic scores

#### 4. **Form-Grouped Inbox** (Big UI Change)
Refactor inbox to show leads grouped by form:

**Changes needed:**
- Fetch leads grouped by form_id
- Show form intent level badges
- Sort within each form by: intent → priority → recency
- Add priority badges (HIGH/MED/LOW) instead of status
- Show signal summary or AI summary in preview

**Example structure:**
```
INBOX

Contact Form (HIGH INTENT) - 8 leads
├─ [HIGH] John Smith - $50k budget, urgent timeline
├─ [MED] Jane Doe - Interested, unclear timeline
└─ [LOW] Bob Jones - Basic inquiry

Free Consultation (MEDIUM INTENT) - 12 leads
├─ [HIGH] Alice Brown - Referral, specific problem
└─ ...

Newsletter (LOW INTENT) - 45 leads
└─ Show only high priority
```

### Phase 2: AI Integration

#### 1. **AI Summary Generation**
Add AI summary to explain why each lead is prioritized:

**Use:** OpenAI API or similar
**Input:** Lead responses + signals
**Output:** 1-2 sentence summary

Example: "High priority due to $50k budget and urgent timeline. Business email and referral source indicate serious intent."

#### 2. **Batch Re-scoring**
Create admin tool to re-score existing leads when:
- Scoring rules change
- Form intent level changes
- Testing different thresholds

### Phase 3: Email & Timeline

#### 1. **Email Integration**
- Send/receive emails per lead
- Show in lead timeline
- Attach notes to emails

#### 2. **Lead Timeline View**
- All interactions in one place
- Emails, notes, status changes
- Score changes (with explanation)

## 🎯 Current MVP Scope

### ✅ IN SCOPE (V1)
- ✅ Forms with intent levels
- ✅ Per-form scoring
- ✅ Priority bucketing
- ✅ Signal extraction
- ✅ Disqualifiers
- 🚧 Form-grouped inbox
- 🚧 AI summaries
- ⏳ Basic email send/receive

### ❌ OUT OF SCOPE (V1)
- ❌ Global lead scores
- ❌ Custom formula builders
- ❌ Advanced workflows
- ❌ Page builder features
- ❌ CRM pipelines
- ❌ Task management
- ❌ Multi-touch attribution

## 📊 Scoring Example

**Form:** "Enterprise Consultation Request" (HIGH INTENT)
**Lead Responses:**
- Budget: "$50,000"
- Timeline: "Need to start next week"
- Company Email: "john@acmecorp.com"
- Referral: "Existing client"

**Signals Extracted:**
- Budget: +20 pts (>$50k)
- Urgency: +10 pts (next week)
- Contact Quality: +11 pts (business email + full name)
- Source: +12 pts (referral)
- Completion: +18 pts (90% complete)

**Total Score:** 71 points
**Priority:** HIGH (threshold: 50+ for high-intent forms)

**AI Summary:** "High priority enterprise lead with $50k budget and urgent timeline. Referral from existing client indicates high qualification likelihood."

## 🔧 Technical Debt to Address Later

1. **Deprecate `status` field** - Once priority is working, remove status-based filtering
2. **Simplify Pages** - Currently over-built; strip down to just form hosting
3. **Remove unused dashboard stats** - Replace with form-centric view
4. **Add proper error handling** - Scoring failures should be graceful

## 📝 Testing Checklist

Before considering Phase 1 complete:

- [ ] Directus schema updated successfully
- [ ] Can create form with intent_level
- [ ] Lead submission triggers scoring
- [ ] Signals are extracted correctly
- [ ] Priority buckets match intent thresholds
- [ ] Disqualifiers work as expected
- [ ] Seed script creates realistic test data
- [ ] Inbox shows form-grouped leads
- [ ] Can sort by priority within each form
- [ ] Score explanation is readable

## 🚀 Next Session Goals

**Immediate priorities:**
1. Update Directus schema (follow SCHEMA_MIGRATION.md)
2. Test scoring system with seed data
3. Build form-grouped inbox UI
4. Add AI summary generation (if time permits)

**Success criteria:**
- User can see leads organized by form
- Each lead shows clear priority (HIGH/MED/LOW)
- Priority is based on transparent, explainable scoring
- High-intent forms surface high-priority leads effectively
