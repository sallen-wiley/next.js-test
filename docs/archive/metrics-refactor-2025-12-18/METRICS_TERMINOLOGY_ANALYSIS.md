# Metrics & Terminology Analysis

## Executive Summary

After reviewing the data flow from database → services → components, I've identified **terminology inconsistencies** and **potential data accuracy issues** in how we're counting and labeling invited/queued reviewers.

---

## Database Schema Overview

### `review_invitations` Table

**Purpose**: Tracks sent invitations and their lifecycle
**Status Values**: `pending`, `accepted`, `declined`, `report_submitted`, `invalidated`, `revoked`
**Current Rows**: 10

**Key Columns**:

- `status` - Current state of invitation
- `invited_date` - When invitation was sent
- `due_date` - Deadline for review (if accepted)
- `invitation_expiration_date` - When pending invitation expires
- `report_invalidated_date` - When report was marked invalid

### `invitation_queue` Table

**Purpose**: Holds reviewers waiting to be invited
**Current Rows**: 7

**Key Columns**:

- `sent` (boolean) - Whether invitation has been sent (default: false)
- `sent_at` (timestamp) - When it was sent
- `queue_position` (integer) - Order in queue

---

## Current Implementation Issues

### 🔴 Issue #1: "Invited" Count is Misleading

**Current Label**: "INVITED"
**What it counts**: `invitations.filter((i) => i.status === "pending").length`
**Database column**: `review_invitations.status = 'pending'`

**Problem**: This is actually counting **"PENDING RESPONSE"** invitations, not total invited count.

**Why it's confusing**:

- An invitation with `status = 'accepted'` is no longer counted as "invited"
- An invitation with `status = 'declined'` is no longer counted as "invited"
- But these reviewers **were invited** - they've just responded

**Correct interpretation**:

- `pending` = Invitation sent, awaiting response (not yet accepted/declined)
- Total invited = ALL records in `review_invitations` (regardless of status)

**Suggested fixes**:

1. **Option A**: Change label to "PENDING" (clearer)
2. **Option B**: Count all non-queue invitations: `invitations.length` (total invited)

---

### 🟡 Issue #2: No Distinction Between "Expired" and "Pending"

**Current Logic**:

```typescript
const expiredCount = invitations.filter(
  (i) =>
    i.status === "pending" &&
    i.invitation_expiration_date &&
    new Date(i.invitation_expiration_date) < now
).length;
```

**Problem**: Expired invitations still have `status = 'pending'` in the database. We're calculating "expired" at runtime but the invitation status doesn't reflect this.

**Implications**:

- "INVITED" card shows: ALL pending invitations (including expired ones)
- "0 Expired" text shows: SUBSET of pending that are past expiration date
- **These overlap!** The same invitation could be counted in both places

**Suggested fix**:

- Update UI labels to be clearer about what's included
- Consider updating status to `expired` in database when expiration date passes

---

### 🟡 Issue #3: "Overdue" Calculation May Be Inaccurate

**Current Logic**:

```typescript
const overdueCount = invitations.filter(
  (i) => i.status === "accepted" && i.due_date && new Date(i.due_date) < now
).length;
```

**Issue**: Only counts **accepted** invitations past their due date. But what about:

- Reports that were submitted late (now `status = 'report_submitted'`)?
- Reviews that were invalidated after being overdue?

**Question for product**: Should "overdue" only show currently-late reviews, or historical late submissions?

---

### 🟢 Issue #4: Queue Count is Correct

**Current Logic**:

```typescript
const queuedCount = queue.length;
```

**Source**: `invitation_queue` table filtered by `manuscript_id` and `sent = false`

**Status**: ✅ This is accurate

**Verification**:

```typescript
// From getManuscriptQueue in dataService.ts
.from("invitation_queue")
.select("*")
.eq("manuscript_id", manuscriptId)
.order("queue_position", { ascending: true });
```

---

## Terminology Mapping

### Current Labels vs. Reality

| UI Label        | Current Count                 | Database Source                              | Actual Meaning                  |
| --------------- | ----------------------------- | -------------------------------------------- | ------------------------------- |
| **INVITED**     | `status = 'pending'`          | `review_invitations`                         | ⚠️ Should be "PENDING RESPONSE" |
| **ACCEPTED**    | `status = 'accepted'`         | `review_invitations`                         | ✅ Correct                      |
| **DECLINED**    | `status = 'declined'`         | `review_invitations`                         | ✅ Correct                      |
| **QUEUED**      | `queue.length`                | `invitation_queue` (sent=false)              | ✅ Correct                      |
| **Expired**     | Pending + past expiration     | Calculated from `invitation_expiration_date` | ⚠️ Overlaps with INVITED        |
| **Revoked**     | `status = 'revoked'`          | `review_invitations`                         | ✅ Correct                      |
| **Submitted**   | `status = 'report_submitted'` | `review_invitations`                         | ✅ Correct                      |
| **Overdue**     | Accepted + past due           | Calculated from `due_date`                   | ⚠️ Incomplete                   |
| **Invalidated** | `status = 'invalidated'`      | `review_invitations`                         | ✅ Correct                      |

---

## Recommended Changes

### 1. Update MetricsWidget Labels

**Change "INVITED" card to "PENDING"**:

```tsx
<Typography variant="overline">Pending</Typography>
<Typography variant="h5">{invitedCount}</Typography>
```

Or if we want total invited count:

```typescript
// In InvitationsAndQueuePanel.tsx
const totalInvitedCount = invitations.length; // All invitations regardless of status
const pendingResponseCount = invitations.filter(
  (i) => i.status === "pending"
).length;
```

### 2. Clarify Expired vs Pending

Update the "Expired" display:

```tsx
<Typography variant="subtitle1">{expiredCount}</Typography>
<Typography variant="body1">Expired (of {invitedCount} pending),</Typography>
```

### 3. Add Tooltip/Help Text

Add tooltips to clarify terminology:

```tsx
<Tooltip title="Invitations sent, awaiting accept/decline response">
  <IconButton size="small">
    <InfoOutlinedIcon fontSize="small" />
  </IconButton>
</Tooltip>
```

### 4. Consider Database Status Update

For cleaner logic, consider adding cron job or trigger to update:

- `status = 'pending'` → `status = 'expired'` when `invitation_expiration_date < now()`
- This would make status mutually exclusive and eliminate overlapping counts

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ PAGE: manage-reviewers/page.tsx                                 │
│ Calls: getManuscriptInvitations(manuscriptId)                   │
│        getManuscriptQueue(manuscriptId)                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ SERVICE: dataService.ts                                          │
│                                                                  │
│ getManuscriptInvitations() →                                    │
│   SELECT * FROM review_invitations WHERE manuscript_id = ?      │
│   Returns: ReviewInvitationWithReviewer[] (with joined names)   │
│                                                                  │
│ getManuscriptQueue() →                                          │
│   SELECT * FROM invitation_queue WHERE manuscript_id = ?        │
│   Returns: InvitationQueueItem[] (with joined names)            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ COMPONENT: InvitationsAndQueuePanel.tsx                         │
│ Calculates metrics by filtering invitations array by status:    │
│                                                                  │
│  submittedCount    = filter(status === "report_submitted")      │
│  invalidatedCount  = filter(status === "invalidated")           │
│  acceptedCount     = filter(status === "accepted")              │
│  declinedCount     = filter(status === "declined")              │
│  invitedCount      = filter(status === "pending") ⚠️            │
│  revokedCount      = filter(status === "revoked")               │
│  overdueCount      = filter(accepted + due_date < now)          │
│  expiredCount      = filter(pending + expiration < now) ⚠️      │
│  queuedCount       = queue.length                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ COMPONENT: MetricsWidget.tsx                                    │
│ Displays all counts with labels                                 │
│                                                                  │
│ Cards: ACCEPTED | DECLINED | INVITED ⚠️ | QUEUED               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Questions for Product/Design

1. **"INVITED" label**: Should this mean:
   - Total reviewers we've sent invitations to (regardless of response)?
   - Only reviewers awaiting response (pending)?
2. **Expired invitations**: Should they:
   - Remain in "pending" status with runtime calculation?
   - Get a dedicated `status = 'expired'` in database?
3. **Overdue reviews**: Should we show:
   - Only currently overdue (accepted, past due)?
   - Historical overdue that are now submitted?
4. **Status lifecycle**: Confirm the intended flow:

   ```
   queued → pending → accepted → report_submitted
                   ↘ declined
                   ↘ revoked
                   ↘ expired?

   report_submitted → invalidated (can be reinstated)
   ```

---

## Files Reviewed

1. ✅ `src/app/reviewer-dashboard/manage-reviewers/MetricsWidget.tsx`
2. ✅ `src/app/reviewer-dashboard/manage-reviewers/InvitationsAndQueuePanel.tsx`
3. ✅ `src/services/dataService.ts` (getManuscriptInvitations, getManuscriptQueue)
4. ✅ `src/lib/supabase.ts` (TypeScript type definitions)
5. ✅ `database/schema-exports/schema-2025-12-18-130857.json` (DB schema)

---

## Recommended Immediate Fix

**Priority: Change "INVITED" to "PENDING" for clarity**

This is the quickest fix to eliminate confusion without changing data logic:

```tsx
// In MetricsWidget.tsx, line ~153
<Typography variant="overline">Pending</Typography>
<Typography variant="h5">{invitedCount}</Typography>
```

This accurately reflects what we're counting: invitations that are pending a response.
