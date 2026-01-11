# Directus Schema Migration Guide

## Overview
This document describes the schema changes needed to implement core MVP features for Civet.

## Changes Required in Directus Admin Panel

### 1. Forms Collection

**Add new fields:**

| Field Name | Type | Options | Notes |
|------------|------|---------|-------|
| `intent_level` | String/Select | Options: `low`, `medium`, `high`<br>Default: `medium`<br>Required: Yes | Indicates the qualification intent of this form |
| `disqualifiers` | JSON | Allow null: Yes | Array of disqualifier rules (see DisqualifierRule type) |

**Notes:**
- `scoring_rules` already exists as JSON field
- `intent_level` should be required for all new forms
- Existing forms should default to `medium` intent

### 2. Leads Collection

**Add new fields:**

| Field Name | Type | Options | Notes |
|------------|------|---------|-------|
| `signals` | JSON | Allow null: Yes<br>Default: `[]` | Array of extracted signals (see Signal type) |
| `priority` | String/Select | Options: `high`, `medium`, `low`<br>Default: `medium`<br>Required: Yes | Priority bucket for this lead |
| `disqualified` | Boolean | Default: `false`<br>Required: Yes | Whether lead is disqualified |
| `disqualified_reason` | String/Text | Allow null: Yes | Reason for disqualification |
| `ai_summary` | Text | Allow null: Yes | AI-generated summary of why lead is prioritized |

**Notes:**
- Keep `status` field for backward compatibility but it will be deprecated
- `score` field already exists
- All existing leads should default: `priority=medium`, `disqualified=false`, `signals=[]`

## TypeScript Type Definitions

See `/lib/types.ts` for the complete type definitions.

### Key Types:

```typescript
// Form intent level
type IntentLevel = "low" | "medium" | "high";

// Lead priority (replaces status in v1)
type Priority = "high" | "medium" | "low";

// Signal types
type SignalType = "budget" | "urgency" | "service" | "source" | "completion" | "contact_quality" | "other";

// DisqualifierRule structure
interface DisqualifierRule {
  field: string;
  operator: "equals" | "contains" | "less_than";
  value: string | number;
  reason: string;
}

// Signal structure
interface Signal {
  type: SignalType;
  field?: string;
  value: any;
  weight: number;
  description?: string;
}
```

## Migration Steps

### In Directus Admin Panel:

1. **Navigate to Settings > Data Model**
2. **Select "forms" collection**
   - Click "+ Create Field"
   - Add `intent_level` (Dropdown, required)
   - Add `disqualifiers` (JSON, optional)
3. **Select "leads" collection**
   - Click "+ Create Field"
   - Add `signals` (JSON, optional, default `[]`)
   - Add `priority` (Dropdown, required, default `medium`)
   - Add `disqualified` (Boolean, required, default `false`)
   - Add `disqualified_reason` (Text, optional)
   - Add `ai_summary` (Text, optional)
4. **Update Permissions**
   - Ensure "User" role can read/write all new fields

### Verify Migration:

Run this test query in Directus API:
```bash
curl -X GET "YOUR_DIRECTUS_URL/items/forms?fields=id,name,intent_level"
curl -X GET "YOUR_DIRECTUS_URL/items/leads?fields=id,priority,disqualified,signals"
```

## Rollback Plan

If migration fails:
1. Remove new fields from collections
2. Revert TypeScript types in `lib/types.ts`
3. Restore from git: `git checkout main lib/types.ts`

## Next Steps After Migration

1. Update seed scripts to include new fields
2. Build signal extraction logic
3. Implement scoring algorithm
4. Update inbox UI to show form-grouped leads
